# IP Lookup Tool

A simple IP WHOIS lookup tool that queries the site https://ipwhois.app/ and wraps it in a nice and simple overview with information for both IPv4 and IPv6 addresses. The tool is built with Azure Static Web Apps and Azure Functions using HTML, CSS, and JavaScript.

## What does this tool do?

- Accepts any valid IPv4 or IPv6 address
- Displays ownership and registration details such as:
  - IP range (inetnum)
  - Netname
  - Description
  - Country
  - Administrative contacts
  - Technical contacts
  - Status
  - Creation date
  - Last modified date
  - Source registry
- No personal or private information is retrieved — only publicly available IP ownership data.

## How to use

1. Enter any valid IP address (IPv4 or IPv6) in the search field.
2. Click the **Lookup** button.
3. The public WHOIS information will be displayed in a structured table format.

## License

This project is licensed under the MIT License.
