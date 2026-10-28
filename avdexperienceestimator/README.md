# AVD Experience Estimator

AVD Experience Estimator is a lightweight and web-based Azure Virtual Desktop region performance tool created by Justin Verstijnen. This tool can be used to compare regional HTTPS response times directly from your device. It estimates the one-way latency from the measured HTTPS round-trip time.

## Main features

The main features of this tool are:

- Automatically lookup the first 5 available Azure Virtual Desktop regions
- Start a full lookup of all regions with a configured test endpoint
- Measure multiple regions in parallel
- Displays information like:
   - Azure region
   - Location
   - Estimated one-way latency
   - HTTPS round-trip time (RTT)
- Sort regions alphabetically or by lowest/highest timing using the table headers
- Export the lookup information to JSON

## Hosting

This tool can be hosted on GitHub Pages. Configuration changes can be pushed and built using the default deployment method. Place `index.html` in the root of your repository and enable GitHub Pages under **Settings > Pages**.

## Technical Architecture

- **Languages** : HTML, CSS, Javascript
- **Platform** : GitHub Pages
- **Runtime model** : Serverless
- **Dependencies** : None

## Changelog/new features

New features to this tool are added when needed or if the tool is broken.

Feature requests can be done by submitting issues into GitHub.

## Issues

Its possible to submit any issues using the GitHub issues system.

The tool measures HTTPS request/response timing, not actual RDP RTT or ICMP ping. Estimated latency is calculated as half of the HTTPS timing, and is not a direct one-way measurement. Results can be affected by browser behavior, VPN, proxies, DNS and TLS connection setup. The regional gateway addresses are not a documented public benchmarking API, so measurements can stop working if those endpoints change. Only regions with configured test endpoints are included. The logo and background image are loaded from an external host.

## License

This project is licensed under the **MIT license**. This means that the software is open source and can be used to run the tool yourself.

Use at your own risk. No guarantees or official support are provided.
