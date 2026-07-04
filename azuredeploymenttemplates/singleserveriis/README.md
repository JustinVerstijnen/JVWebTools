# Single Server IIS

This template deploys one Windows Server VM with IIS installed.

## Deployed resources

- Virtual network and subnet
- Network security group
- Static public IP address
- Network interface
- Windows Server 2022 Azure Edition VM
- Custom Script Extension to install IIS

## Network access

- `Allow-HTTP-HTTPS-Inbound` allows HTTP TCP/80 and HTTPS TCP/443 from `webSourceAddressPrefix` with priority 1000. The default value is `Internet`.
- `Allow-RDP-Inbound` allows RDP TCP/3389 only from the configured `sourceIpAddress` with priority 2000.

Note: this opens TCP/443 in the NSG. The template does not configure an SSL certificate or HTTPS binding in IIS.

## Outputs

- `rdpCommand`
- `websiteUrl`
- `publicIPAddress`
- `privateIPAddress`
