# Mail Header Analyzer

Static, client-side Mail Header Analyzer tool.

## Features

- Header input with autofocus on page load.
- Paste analyzes automatically; Enter analyzes when headers are present.
- Parses folded RFC 5322 headers.
- Presents the analysis as five end-user friendly blocks: Email summary, Authentication checks, Email route, Anti-spam, and Advanced details.
- Colors SPF/DKIM/DMARC green for pass, red for fail and orange for unknown or other statuses.
- Calculates mail flow delays between Received hops.
- Hides IPv6 addresses in visible Received tables while keeping them in tooltips.
- Exports to HTML, JSON and TXT.
- No API, no storage and no server-side processing.

## Hosting

For GitHub Pages, publish this folder directly. `index.html` references `assets/style.css` and `assets/app.js`, so no build step is required.

For Azure, upload this folder to the `wwwroot` of an Azure App Service / Azure Web App. The included `web.config` supports static hosting on Windows App Service.

## Microsoft anti-spam verdicts

The message summary interprets Microsoft 365 filtering conservatively:

- `CAT` threat categories are evaluated before generic `SFV` allow/bypass signals.
- Documented `SFV` values such as `NSPM`, `SFE`, `SKA`, `SKI`, `SKN`, `SPM`, `SKB`, `SKS`, `SKQ`, and `BLK` are mapped explicitly.
- `SFV:SFE` is treated as an allow result (Safe Senders), not as spam.
- Unknown filtering values are shown as informational instead of being assumed to mean spam.
- `SCL` is shown as context, but is not treated as the sole cloud spam verdict.

Reference: Microsoft Learn, "Anti-spam message headers in cloud organizations".
## Interface improvements

- DKIM verification and DKIM signature metadata are shown together in one authentication row.
- Email Summary starts with Delivery and Spam filtering rows; Inbox/non-spam verdicts are green, Junk/spam verdicts are orange, and unknown verdicts remain informational. Message-ID is shown as a compact subline below Subject.
- Message Summary includes a separate delivery-time value based on the message Date header to the final Received timestamp when available, with the Received chain span as fallback.
- After analysis, the pasted-header field collapses with an animated disclosure triangle and can be expanded again without separate New header / Show header buttons.
- Received headers focus on submitting host, receiving host, and timestamp; the transport Type column is omitted from the main table.
- Microsoft `X-Forefront-Antispam-Report` and `X-Microsoft-Antispam` values are combined into one Anti-spam table with clear sub-sections; missing headers are shown as a centered “Not found in this header.” row.
- Security headers and other non-summary headers are combined into one collapsed Advanced details section.



## File import

The browser UI supports pasted headers plus drag-and-drop/import of `.eml` and `.msg` files. EML files are parsed locally. MSG transport headers are read client-side with `@kenjiuno/msgreader` 1.28.0 (Apache-2.0), loaded as an ES module through esm.sh. If an MSG file does not contain `PidTagTransportMessageHeaders`, the UI imports only basic message properties and clearly labels that fallback.
