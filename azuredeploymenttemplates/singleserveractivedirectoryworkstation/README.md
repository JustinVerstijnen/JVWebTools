# Single Server Active Directory and Workstation

This template deploys a Windows Server Active Directory domain controller and one Windows 11 workstation.

## Parameters

- `abbreviation`: defaults to `jv` and is used in resource names.
- `adminUsername`: local administrator username for both VMs and domain join credential after DC promotion.
- `adminPassword`: local administrator password for both VMs.
- `dsrmPassword`: separate Directory Services Restore Mode password.
- `domainName`: defaults to `internal.justinverstijnen.nl`.
- `domainNetbiosName`: defaults to `JV`.
- `serverVmSize`: defaults to `Standard_E2as_v7`.
- `workstationVmSize`: defaults to `Standard_D2as_v7`.

## Deployed resources with default abbreviation `jv`

- Virtual network: `vnet-jv-vnet01`
- Subnet: `snet-jv-snet01`
- Network security group: `nsg-jv-nsg01`
- Domain controller VM: `vm-jv-dc01`
- Domain controller OS disk: `osdisk-jv-dc01`
- Domain controller NIC: `nic-jv-dc01`
- Domain controller public IP: `pip-jv-dc01`
- Workstation VM: `vm-jv-ws01`
- Workstation OS disk: `osdisk-jv-ws01`
- Workstation NIC: `nic-jv-ws01`
- Workstation public IP: `pip-jv-ws01`
- Custom Script Extension to install Active Directory Domain Services
- Optional Custom Script Extension to join the workstation to the new domain

## Network access

- `Allow-RDP-Inbound` allows RDP TCP/3389 only from the configured `sourceIpAddress`.
- VNet DNS and both VM NIC DNS settings are configured to use the domain controller private IP `10.69.0.4`.

## Outputs

- `serverRdpCommand`
- `workstationRdpCommand`
- `serverPublicIPAddress`
- `workstationPublicIPAddress`
- `activeDirectoryDomain`

## Domain join timing

The workstation domain-join extension sets the workstation DNS client to the domain controller IP and waits for AD DNS, LDAP SRV records, DC locator, and core domain ports before running `Add-Computer`. This prevents the join from starting while the new domain controller is still rebooting after promotion.
