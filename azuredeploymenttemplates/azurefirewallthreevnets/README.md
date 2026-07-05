# Azure Firewall with Three VNets

This template deploys Azure Firewall with a firewall policy and three virtual networks.

## Deployed resources

- `vnet-jv-vnet01` with `AzureFirewallSubnet` and `snet-jv-vnet01`
- `vnet-jv-vnet02` with `snet-jv-vnet02`
- `vnet-jv-vnet03` with `snet-jv-vnet03`
- Azure Firewall named `afw-jv-<projectName>`
- Azure Firewall Policy named `afwp-jv-<projectName>`
- Static public IP address for Azure Firewall
- Full bidirectional VNet peering between all three VNets

## VNet peering names

- `VNET01-to-VNET02`
- `VNET02-to-VNET01`
- `VNET01-to-VNET03`
- `VNET03-to-VNET01`
- `VNET02-to-VNET03`
- `VNET03-to-VNET02`

## Addressing

- `vnet-jv-vnet01`: `10.69.0.0/16`
- `AzureFirewallSubnet`: `10.69.0.0/26`
- `snet-jv-vnet01`: `10.69.1.0/24`
- `vnet-jv-vnet02`: `10.70.0.0/16`
- `snet-jv-vnet02`: `10.70.0.0/24`
- `vnet-jv-vnet03`: `10.71.0.0/16`
- `snet-jv-vnet03`: `10.71.0.0/24`

## Notes

This template deploys the network and firewall baseline. It does not create route tables or firewall rules yet, so traffic is not forced through Azure Firewall by default.
