# Mail Header Analyzer

Static, client-side Mail Header Analyzer in the same visual style as DNS MEGAtool.

## Features

- Header input with autofocus on page load.
- Paste analyzes automatically; Enter analyzes when headers are present.
- Parses folded RFC 5322 headers.
- Shows message summary, SPF, DKIM, DMARC, ARC, Composite Auth, DKIM-Signature, Received hops and other headers.
- Colors SPF/DKIM/DMARC green for pass, red for fail and orange for unknown or other statuses.
- Calculates mail flow delays between Received hops.
- Hides IPv6 addresses in visible Received tables while keeping them in tooltips.
- Copies analysis to clipboard.
- Exports to HTML, JSON and TXT.
- No API, no storage and no server-side processing.

## Hosting

For GitHub Pages, publish this folder directly. `index.html` references `assets/style.css` and `assets/app.js`, so no build step is required.

For Azure, upload this folder to the `wwwroot` of an Azure App Service / Azure Web App. The included `web.config` supports static hosting on Windows App Service.
