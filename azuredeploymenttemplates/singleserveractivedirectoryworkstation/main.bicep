targetScope = 'resourceGroup'

@description('Abbreviation. Used in Azure resource names. Default is jv, which creates names like vm-jv-dc01 and vm-jv-ws01.')
@minLength(2)
@maxLength(6)
param abbreviation string = 'jv'

var location = resourceGroup().location

@description('Username. Required. Local administrator username for both VMs. This account is also used for the domain join attempt.')
param adminUsername string

@description('Password. Required. Local administrator password for both VMs. This account is also used for the domain join attempt. Use a strong password.')
@secure()
param adminPassword string

@description('DSRM password. Required. Separate Directory Services Restore Mode password for Active Directory recovery.')
@secure()
param dsrmPassword string

@description('Public IP address. Required. Public IPv4 address that is allowed to connect with RDP. Enter only the IP address, without /32.')
param sourceIpAddress string

@description('Server size. Required. Enter an Azure VM size for the Windows Server / Active Directory VM.')
param serverVmSize string = 'Standard_E2as_v7'

@description('Workstation size. Required. Enter an Azure VM size for the Windows 11 workstation VM.')
param workstationVmSize string = 'Standard_D2as_v7'

@description('Active Directory domain name.')
param domainName string = 'internal.justinverstijnen.nl'

@description('NETBIOS name. Active Directory NetBIOS name. Use 1 to 15 characters.')
@minLength(1)
@maxLength(15)
param domainNetbiosName string = 'JV'

@description('Join the Windows 11 workstation to the new Active Directory domain after the domain controller has been promoted.')
param joinWorkstationToDomain bool = true

@description('Tags. Optional. Add Azure resource tags as a JSON object. Leave empty if no tags are needed.')
param tags object = {}

var vnetAddressPrefix = '10.69.0.0/16'
var subnetPrefix = '10.69.0.0/24'
var serverPrivateIpAddress = '10.69.0.4'
var workstationPrivateIpAddress = '10.69.0.5'

var abbreviationLower = toLower(abbreviation)
var vnetName = 'vnet-${abbreviationLower}-vnet01'
var subnetName = 'snet-${abbreviationLower}-snet01'
var nsgName = 'nsg-${abbreviationLower}-nsg01'

var serverPublicIpName = 'pip-${abbreviationLower}-dc01'
var serverNicName = 'nic-${abbreviationLower}-dc01'
var serverVmName = 'vm-${abbreviationLower}-dc01'
var serverOsDiskName = 'osdisk-${abbreviationLower}-dc01'

var workstationPublicIpName = 'pip-${abbreviationLower}-ws01'
var workstationNicName = 'nic-${abbreviationLower}-ws01'
var workstationVmName = 'vm-${abbreviationLower}-ws01'
var workstationOsDiskName = 'osdisk-${abbreviationLower}-ws01'

var rdpRuleName = 'Allow-RDP-Inbound'

// This command installs the AD DS role, creates a new forest, installs DNS, and schedules a restart.
// The password is base64 encoded only to avoid quoting issues in the PowerShell command.
// The command itself is passed through protectedSettings, so it is not stored as normal deployment output.
var encodedAdminPassword = base64(adminPassword)
var encodedDsrmPassword = base64(dsrmPassword)

var installAdScriptLines = [
  '$ErrorActionPreference = \'Stop\''
  'Install-WindowsFeature AD-Domain-Services -IncludeManagementTools'
  '$dsrmPasswordPlain = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String(\'${encodedDsrmPassword}\'))'
  '$secureDsrmPassword = ConvertTo-SecureString $dsrmPasswordPlain -AsPlainText -Force'
  'Install-ADDSForest -DomainName \'${domainName}\' -DomainNetbiosName \'${domainNetbiosName}\' -SafeModeAdministratorPassword $secureDsrmPassword -InstallDNS -Force -NoRebootOnCompletion:$true'
  '$dsrmPasswordPlain = $null'
  'shutdown.exe /r /t 60 /c \'Restart after Active Directory Domain Services installation\''
  'exit 0'
]

var installAdCommand = 'powershell.exe -ExecutionPolicy Unrestricted -NoProfile -Command "${join(installAdScriptLines, '; ')}"'

// The workstation waits until the domain controller is fully reachable before running Add-Computer.
// This is intentionally more strict than a basic DNS lookup because the AD DS extension on the server exits
// before the post-promotion reboot and Netlogon/DC locator records are fully ready.
var joinDomainScriptLines = [
  '$ErrorActionPreference = \'Stop\''
  '$adminPasswordPlain = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String(\'${encodedAdminPassword}\'))'
  '$securePassword = ConvertTo-SecureString $adminPasswordPlain -AsPlainText -Force'
  '$credential = New-Object System.Management.Automation.PSCredential(\'${domainNetbiosName}\\${adminUsername}\', $securePassword)'
  '$domainName = \'${domainName}\''
  '$dcIp = \'${serverPrivateIpAddress}\''
  '$adapter = Get-NetAdapter | Where-Object { $_.Status -eq \'Up\' -and $_.HardwareInterface } | Sort-Object -Property ifIndex | Select-Object -First 1'
  'if (-not $adapter) { throw \'No active network adapter found.\' }'
  'Set-DnsClientServerAddress -InterfaceIndex $adapter.ifIndex -ServerAddresses $dcIp'
  'ipconfig.exe /flushdns | Out-Null'
  '$srvRecord = \'_ldap._tcp.dc._msdcs.\' + $domainName'
  '$timeout = (Get-Date).AddMinutes(90)'
  '$domainReady = $false'
  'do { try { Resolve-DnsName -Name $domainName -Server $dcIp -ErrorAction Stop | Out-Null; Resolve-DnsName -Name $srvRecord -Type SRV -Server $dcIp -ErrorAction Stop | Out-Null; foreach ($port in 53,88,135,389,445) { $tcpReady = Test-NetConnection -ComputerName $dcIp -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue; if (-not $tcpReady) { throw (\'TCP port \' + $port + \' on domain controller is not reachable.\') } }; nltest.exe /dsgetdc:$domainName /force | Out-Null; if ($LASTEXITCODE -ne 0) { throw \'Domain controller discovery failed.\' }; $domainReady = $true } catch { Write-Host (\'Domain not ready yet: \' + $_.Exception.Message); Start-Sleep -Seconds 30; ipconfig.exe /flushdns | Out-Null } } until ($domainReady -or ((Get-Date) -gt $timeout))'
  'if (-not $domainReady) { throw \'Domain controller was not reachable before timeout.\' }'
  'Add-Computer -DomainName $domainName -Credential $credential -Restart -Force -ErrorAction Stop'
  '$adminPasswordPlain = $null'
  'exit 0'
]

var joinDomainCommand = 'powershell.exe -ExecutionPolicy Unrestricted -NoProfile -Command "${join(joinDomainScriptLines, '; ')}"'

resource nsg 'Microsoft.Network/networkSecurityGroups@2023-11-01' = {
  name: nsgName
  location: location
  tags: tags
  properties: {
    securityRules: [
      {
        name: rdpRuleName
        properties: {
          priority: 1000
          direction: 'Inbound'
          access: 'Allow'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '3389'
          sourceAddressPrefix: '${sourceIpAddress}/32'
          destinationAddressPrefix: '*'
          description: 'Allow RDP only from the configured administrator IP address.'
        }
      }
    ]
  }
}

resource vnet 'Microsoft.Network/virtualNetworks@2023-11-01' = {
  name: vnetName
  location: location
  tags: tags
  properties: {
    addressSpace: {
      addressPrefixes: [
        vnetAddressPrefix
      ]
    }
    dhcpOptions: {
      dnsServers: [
        serverPrivateIpAddress
      ]
    }
    subnets: [
      {
        name: subnetName
        properties: {
          addressPrefix: subnetPrefix
          networkSecurityGroup: {
            id: nsg.id
          }
        }
      }
    ]
  }
}

resource serverPublicIp 'Microsoft.Network/publicIPAddresses@2023-11-01' = {
  name: serverPublicIpName
  location: location
  tags: tags
  sku: {
    name: 'Standard'
  }
  properties: {
    publicIPAllocationMethod: 'Static'
  }
}

resource workstationPublicIp 'Microsoft.Network/publicIPAddresses@2023-11-01' = {
  name: workstationPublicIpName
  location: location
  tags: tags
  sku: {
    name: 'Standard'
  }
  properties: {
    publicIPAllocationMethod: 'Static'
  }
}

resource serverNic 'Microsoft.Network/networkInterfaces@2023-11-01' = {
  name: serverNicName
  location: location
  tags: tags
  properties: {
    dnsSettings: {
      dnsServers: [
        serverPrivateIpAddress
      ]
    }
    ipConfigurations: [
      {
        name: 'ipconfig1'
        properties: {
          privateIPAllocationMethod: 'Static'
          privateIPAddress: serverPrivateIpAddress
          subnet: {
            id: resourceId('Microsoft.Network/virtualNetworks/subnets', vnetName, subnetName)
          }
          publicIPAddress: {
            id: serverPublicIp.id
          }
        }
      }
    ]
  }
  dependsOn: [
    vnet
  ]
}

resource workstationNic 'Microsoft.Network/networkInterfaces@2023-11-01' = {
  name: workstationNicName
  location: location
  tags: tags
  properties: {
    dnsSettings: {
      dnsServers: [
        serverPrivateIpAddress
      ]
    }
    ipConfigurations: [
      {
        name: 'ipconfig1'
        properties: {
          privateIPAllocationMethod: 'Static'
          privateIPAddress: workstationPrivateIpAddress
          subnet: {
            id: resourceId('Microsoft.Network/virtualNetworks/subnets', vnetName, subnetName)
          }
          publicIPAddress: {
            id: workstationPublicIp.id
          }
        }
      }
    ]
  }
  dependsOn: [
    vnet
  ]
}

resource serverVm 'Microsoft.Compute/virtualMachines@2023-09-01' = {
  name: serverVmName
  location: location
  tags: tags
  properties: {
    hardwareProfile: {
      vmSize: serverVmSize
    }
    osProfile: {
      computerName: serverVmName
      adminUsername: adminUsername
      adminPassword: adminPassword
      windowsConfiguration: {
        provisionVMAgent: true
        enableAutomaticUpdates: true
      }
    }
    storageProfile: {
      imageReference: {
        publisher: 'MicrosoftWindowsServer'
        offer: 'WindowsServer'
        sku: '2022-datacenter-azure-edition'
        version: 'latest'
      }
      osDisk: {
        name: serverOsDiskName
        createOption: 'FromImage'
        managedDisk: {
          storageAccountType: 'Premium_LRS'
        }
      }
    }
    networkProfile: {
      networkInterfaces: [
        {
          id: serverNic.id
          properties: {
            primary: true
          }
        }
      ]
    }
    diagnosticsProfile: {
      bootDiagnostics: {
        enabled: true
      }
    }
  }
}

resource workstationVm 'Microsoft.Compute/virtualMachines@2023-09-01' = {
  name: workstationVmName
  location: location
  tags: tags
  properties: {
    hardwareProfile: {
      vmSize: workstationVmSize
    }
    osProfile: {
      computerName: workstationVmName
      adminUsername: adminUsername
      adminPassword: adminPassword
      windowsConfiguration: {
        provisionVMAgent: true
        enableAutomaticUpdates: true
      }
    }
    storageProfile: {
      imageReference: {
        publisher: 'MicrosoftWindowsDesktop'
        offer: 'windows-11'
        sku: 'win11-25h2-pro'
        version: 'latest'
      }
      osDisk: {
        name: workstationOsDiskName
        createOption: 'FromImage'
        managedDisk: {
          storageAccountType: 'Premium_LRS'
        }
      }
    }
    networkProfile: {
      networkInterfaces: [
        {
          id: workstationNic.id
          properties: {
            primary: true
          }
        }
      ]
    }
    diagnosticsProfile: {
      bootDiagnostics: {
        enabled: true
      }
    }
  }
}

resource installAdDsExtension 'Microsoft.Compute/virtualMachines/extensions@2023-09-01' = {
  parent: serverVm
  name: 'install-ad-ds'
  location: location
  properties: {
    publisher: 'Microsoft.Compute'
    type: 'CustomScriptExtension'
    typeHandlerVersion: '1.10'
    autoUpgradeMinorVersion: true
    protectedSettings: {
      commandToExecute: installAdCommand
    }
  }
}

resource joinDomainExtension 'Microsoft.Compute/virtualMachines/extensions@2023-09-01' = if (joinWorkstationToDomain) {
  parent: workstationVm
  name: 'join-domain'
  location: location
  properties: {
    publisher: 'Microsoft.Compute'
    type: 'CustomScriptExtension'
    typeHandlerVersion: '1.10'
    autoUpgradeMinorVersion: true
    protectedSettings: {
      commandToExecute: joinDomainCommand
    }
  }
  dependsOn: [
    installAdDsExtension
  ]
}

output resourceGroupName string = resourceGroup().name
output serverVirtualMachineName string = serverVm.name
output workstationVirtualMachineName string = workstationVm.name
output serverPrivateIPAddress string = serverPrivateIpAddress
output workstationPrivateIPAddress string = workstationPrivateIpAddress
output serverPublicIPAddress string = serverPublicIp.properties.ipAddress
output workstationPublicIPAddress string = workstationPublicIp.properties.ipAddress
output serverRdpCommand string = 'mstsc /v:${serverPublicIp.properties.ipAddress}'
output workstationRdpCommand string = 'mstsc /v:${workstationPublicIp.properties.ipAddress}'
output activeDirectoryDomain string = domainName
output postDeploymentNote string = 'The server restarts after AD DS installation. If joinWorkstationToDomain is true, the workstation waits for domain DNS and then restarts after domain join.'
