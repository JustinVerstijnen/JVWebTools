# Mail Header Analyzer

Statische, client-side Mail Header Analyzer in dezelfde stijl als de DNS MEGAtool.

## Functionaliteit

- Header-invoer met autofocus bij openen.
- Plakken analyseert automatisch; Enter analyseert wanneer er headers in het veld staan.
- Parseert gevouwen RFC 5322 headers.
- Toont samenvatting, SPF, DKIM, DMARC, ARC, Composite Auth, DKIM-Signature, Received hops en overige headers.
- Kleurt SPF/DKIM/DMARC groen bij pass, rood bij fail en oranje bij onbekend/overig.
- Berekent mailflow-delays tussen Received hops.
- Kopieert analyse naar clipboard.
- Exporteert naar HTML, JSON en TXT.
- Geen API, geen opslag, geen server-side verwerking.

## Azure Web App

Voor GitHub Pages kun je deze map rechtstreeks publiceren. `index.html` verwijst naar `assets/style.css` en `assets/app.js`, dus de standaard GitHub Pages-structuur werkt zonder buildstap.

Voor Azure kun je de inhoud van deze map uploaden naar de `wwwroot` van een Azure App Service / Azure Web App. De meegeleverde `web.config` zorgt voor correcte statische hosting op Windows App Service.
