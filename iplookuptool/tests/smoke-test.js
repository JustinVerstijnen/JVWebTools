/* No npm install required: run "node tests/smoke-test.js". */
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const handler = require('../api/iplookup/index.js');

async function run() {
  const source = fs.readFileSync(path.join(__dirname, '..', 'assets', 'shared.js'), 'utf8');
  const context = { window: {}, URL };
  vm.runInNewContext(source, context);
  const shared = context.window.IPLookupShared;

  for (const ip of ['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111', '::1', '::ffff:192.0.2.1']) {
    assert.equal(shared.isValidIP(ip), true, ip);
  }
  for (const invalid of ['999.1.1.1', 'example.com', '8.8.8.8<script>', '1.1.1', '256.0.0.1', '1.1.1.01', ':::1']) {
    assert.equal(shared.isValidIP(invalid), false, invalid);
  }
  const rows = shared.rows({ ip: '8.8.8.8', type: 'IPv4', latitude: 0, connection: { isp: 'Test ISP' } });
  assert.equal(rows.find(([key]) => key === 'Latitude')[1], '0');
  assert.equal(rows.find(([key]) => key === 'ISP')[1], 'Test ISP');

  const originalFetch = global.fetch;
  try {
    let ctx = {};
    await handler(ctx, { query: { ip: 'invalid-address' } });
    assert.equal(ctx.res.status, 400);

    global.fetch = async () => ({ status: 200, ok: true, headers: { get: () => null }, json: async () => ({ success: true, ip: '8.8.8.8', type: 'IPv4' }) });
    ctx = {};
    await handler(ctx, { query: { ip: '8.8.8.8' } });
    assert.equal(ctx.res.status, 200);
    assert.equal(ctx.res.body.ip, '8.8.8.8');

    global.fetch = async () => ({ status: 429, ok: false, headers: { get: () => '45' }, json: async () => ({ success: false }) });
    ctx = {};
    await handler(ctx, { query: { ip: '8.8.8.8' } });
    assert.equal(ctx.res.status, 429);
    assert.equal(ctx.res.headers['Retry-After'], '45');

    global.fetch = async () => { throw new Error('network error'); };
    ctx = {};
    await handler(ctx, { query: { ip: '8.8.8.8' } });
    assert.equal(ctx.res.status, 502);
  } finally {
    global.fetch = originalFetch;
  }
  console.log('PASS: input, normalized fields, Azure proxy success/error handling');
}

run().catch(error => { console.error(error); process.exitCode = 1; });
