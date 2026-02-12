const { isIP } = require('node:net');

function respond(context, status, body, headers = {}) {
  context.res = {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Same-origin in Azure Static Web Apps, but useful for local testing.
      'Access-Control-Allow-Origin': '*',
      ...headers,
    },
    body,
  };
}

module.exports = async function (context, req) {
  try {
    const ip = (req && req.query && req.query.ip ? String(req.query.ip) : '').trim();

    if (!ip) {
      respond(context, 400, { success: false, error: 'Missing required query parameter: ip' });
      return;
    }

    if (isIP(ip) === 0) {
      respond(context, 400, { success: false, error: 'Invalid IP address' });
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    let upstreamResponse;
    try {
      upstreamResponse = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'IPLookupTool-SWA/1.0',
          'Accept': 'application/json',
        },
      });
    } finally {
      clearTimeout(timeout);
    }

    const text = await upstreamResponse.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      respond(context, 502, { success: false, error: 'Upstream did not return valid JSON' });
      return;
    }

    // Keep response stable for the frontend; ipwho.is indicates errors via { success: false, ... }
    respond(context, 200, data, {
      // Small cache to reduce upstream calls.
      'Cache-Control': 'public, max-age=60',
    });
  } catch (err) {
    respond(context, 500, {
      success: false,
      error: 'Internal server error',
      detail: err && err.message ? err.message : String(err),
    });
  }
};
