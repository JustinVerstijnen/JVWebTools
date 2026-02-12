# IP Lookup Tool

A simple IP lookup tool that queries the public API at **ipwho.is** and shows the results in a clean table.

This repo is ready to deploy to **Azure Static Web Apps**:

- `/` contains the static site (HTML/CSS/JS)
- `/api` contains an Azure Function (`/api/iplookup`) that proxies requests to ipwho.is to avoid browser CORS blocks

## What does this tool do?

- Accepts any valid IPv4 or IPv6 address
- Displays geolocation/network metadata returned by ipwho.is (e.g., continent, country, city, latitude/longitude, ASN/ISP, timezone).
- No personal or private information is retrieved — only publicly available IP metadata.

## How to use

1. Enter any valid IP address (IPv4 or IPv6) in the search field.
2. Click the **Lookup** button.
3. The public WHOIS information will be displayed in a structured table format.

## Azure Static Web Apps deployment notes

In the Azure Static Web Apps resource configuration, set:

- **App location:** `/`
- **Api location:** `api`
- **Output location:** *(leave empty)*

## License

This project is licensed under the MIT License.
