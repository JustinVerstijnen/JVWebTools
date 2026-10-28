# AVD Experience Tool

AVD Experience Tool is a lightweight and web-based Azure Virtual Desktop region performance tool created by Justin Verstijnen. This tool can be used to compare the response times of different AVD regions directly from your device. It measures the response times using HTTPS requests from your browser.

## Main features

The main features of this tool are:

- Compare different Azure Virtual Desktop regions
- Automatically measure the response time of each configured region
- Displays information like:
   - Azure region
   - Location
   - Median HTTPS response time
   - Measurement result
- Restart the lookup
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

It's possible to submit any issues using the GitHub issues system.

The tool measures HTTPS response times, not actual RDP or ICMP latency. Results can be affected by the browser, network connection, VPN or proxy. Some regions do not have a verified test endpoint. The logo and background image are loaded from an external host.

## License

This project is licensed under the **MIT license**. This means that the software is open source and can be used to run the tool yourself.

Use at your own risk. No guarantees or official support are provided.
