// Optional Azure Static Web Apps proxy endpoint. GitHub Pages uses the direct
// browser call in assets/app.js; this endpoint is kept for SWA deployments.
const { isIP } = require('node:net');

function respond(context, status, body, extraHeaders = {}) {
  context.res = {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      ...extraHeaders,
    },
    body,
  };
}

module.exports = async function (context, req) {
  const ip = req && req.query && typeof req.query.ip === 'string' ? req.query.ip.trim() : '';
  if (!ip) return respond(context, 400, { success: false, error: 'Missing query parameter: ip' });
  if (isIP(ip) === 0) return respond(context, 400, { success: false, error: 'Invalid IPv4 or IPv6 address' });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const upstream = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, { signal: controller.signal });
    const retryAfter = upstream.headers.get('retry-after');
    let data;
    try {
      data = await upstream.json();
    } catch (_) {
      return respond(context, 502, { success: false, error: 'IP provider returned invalid JSON' });
    }

    if (upstream.status === 429) {
      const headers = retryAfter ? { 'Retry-After': retryAfter } : {};
      return respond(context, 429, { success: false, error: 'IP provider rate limit reached' }, headers);
    }
    if (!upstream.ok) {
      return respond(context, 502, { success: false, error: `IP provider returned HTTP ${upstream.status}` });
    }
    if (!data || typeof data !== 'object') {
      return respond(context, 502, { success: false, error: 'IP provider returned an invalid response' });
    }
    return respond(context, 200, data, { 'Cache-Control': 'public, max-age=3600' });
  } catch (error) {
    const timedOut = error && error.name === 'AbortError';
    return respond(context, timedOut ? 504 : 502, {
      success: false,
      error: timedOut ? 'IP provider request timed out' : 'Unable to contact IP provider'
    });
  } finally {
    clearTimeout(timer);
  }
};
