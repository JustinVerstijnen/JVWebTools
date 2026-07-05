# Single Server Active Directory and Workstation

This template deploys a Windows Server Active Directory domain controller and one Windows 11 workstation.

## Deployed resources

- Virtual network and subnet
- Network security group
- Two static public IP addresses
- Two network interfaces
- Windows Server 2022 Azure Edition VM
- Windows 11 Pro workstation VM named `vm-jv-ws01`
- Custom Script Extension to install Active Directory Domain Services
- Optional Custom Script Extension to join the workstation to the new domain

## Naming

- Server VM: `vm-jv-<projectName>`
- Workstation VM: `vm-jv-ws01`
- VNet: `vnet-jv-<projectName>`
- Subnet: `snet-jv-<projectName>`
- NSG: `nsg-jv-<projectName>`

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

The workstation domain-join extension now sets the workstation DNS client to the domain controller IP and waits for AD DNS, LDAP SRV records, DC locator, and core domain ports before running `Add-Computer`. This prevents the join from starting while the new domain controller is still rebooting after promotion.
