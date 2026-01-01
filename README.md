# SWA Tool Suite (voorbeeld repo)

Dit is een samengestelde repo waarin meerdere tools draaien op **één Azure Static Web App**:

- Frontend: `frontend/DNSMegaTool` en `frontend/PortCheckerTool`
- API: één Functions app in `api/function_app.py` met routes per tool:
  - `GET /api/DNSMegaTool/lookup?domain=example.com`
  - `GET /api/PortCheckerTool/portcheck?host=example.com&port=443`

## Lokaal draaien (indicatie)

Frontend is static en kan via elke simpele webserver.  
API is een Azure Functions (Python) project; gebruik Azure Functions Core Tools.

## Deploy

Gebruik `.github/workflows/azure-static-web-apps.yml` en zet in GitHub Secrets:
- `AZURE_STATIC_WEB_APPS_API_TOKEN`

De SWA is geconfigureerd met:
- `app_location: frontend`
- `api_location: api`
