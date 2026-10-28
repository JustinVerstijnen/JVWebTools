# IPLookupTool — repaired edition

IPLookupTool is a lightweight, browser-based tool created by Justin Verstijnen. It displays public IPv4 / IPv6 address information and exports it to a report page. Original project and MIT license have been retained.

## What was fixed (October 2026)

- Replaced direct calls to **ipapi.is** with **ipwho.is**. ipapi.is reduced its keyless tier to 30 lookups per IP per UTC day and changed response fields in September 2026.
- Adjusted all result and export fields to the same `ipwho.is` JSON response (`country`, `connection.isp`, `timezone.id`, etc.).
- Replaced the Cloudflare trace request for detecting the user's IP with `api64.ipify.org?format=json` (IPv4/IPv6).
- Added input validation, network timeout, rate-limit and invalid-response handling.
- Prevented HTML injection by rendering third-party data using `textContent`.
- Improved mobile layout and made export unavailable until a lookup succeeds.
- Kept the optional Azure Function proxy and made it forward meaningful HTTP errors.

## Deployment — GitHub Pages / static hosting

1. Extract all files and folders **without changing the directory structure**.
2. Upload or commit the whole folder contents to your static website / GitHub repository (including `assets/shared.js`, `assets/app.js` and `assets/export.js`).
3. Open `index.html` via an HTTP(S) website. Hard-refresh with **Ctrl+F5** if the old version remains cached.
4. Test `8.8.8.8`, an IPv6 address such as `2606:4700:4700::1111`, **Use my IP**, and **Export**.

No npm install, server-side secret or API key is required for the static version. The optional `api/` folder is not used by GitHub Pages; it is for Microsoft Azure Static Web Apps deployments. Browser access to external services `ipwho.is` and `api64.ipify.org` is required.

The free `ipwho.is` tier is limited to **1,000 requests per day**, shared by the domain for browser CORS calls; after the limit, an HTTP 429 response is displayed as a rate-limit error. Limits, service terms and supported fields may change. Currency and security fields may be unavailable on the free tier.

## Documentation

- https://ipwhois.io/documentation
- https://www.ipify.org/
- https://ipapi.is/free-tier.html

## License

MIT, copyright 2025 Justin Verstijnen — see `LICENSE`.

## Quick code tests

Run `node tests/smoke-test.js` to test IP validation, display-field normalization and the optional Azure proxy with simulated API responses.
