/* Shared, dependency-free IP lookup presentation and validation helpers. */
(function (global) {
  'use strict';

  function isValidIP(input) {
    if (typeof input !== 'string') return false;
    const ip = input.trim();
    if (!ip || ip.length > 45) return false;

    // IPv4: four decimal octets, no hostname or URL accepted.
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(ip)) {
      return ip.split('.').every(part => Number(part) <= 255 && (part === '0' || !part.startsWith('0')));
    }

    // The browser URL parser validates the complete IPv6 syntax (including ::).
    if (!ip.includes(':') || /[^0-9a-fA-F:.]/.test(ip)) return false;
    try {
      return new URL(`http://[${ip}]/`).hostname.startsWith('[');
    } catch (_) {
      return false;
    }
  }

  function format(value) {
    return value === null || value === undefined || value === '' ? '-' : String(value);
  }

  function withCode(name, code) {
    if (name === null || name === undefined || name === '') return format(code);
    return code ? `${name} (${code})` : String(name);
  }

  function rows(data) {
    // ipwho.is JSON shape; optional fields may be absent on the free plan.
    const connection = data.connection || {};
    const timezone = data.timezone || {};
    const currency = data.currency || {};
    return [
      ['IP', format(data.ip)],
      ['Version', format(data.type)],
      ['Continent', withCode(data.continent, data.continent_code)],
      ['Country', withCode(data.country, data.country_code)],
      ['Region', format(data.region)],
      ['City', format(data.city)],
      ['Postal code', format(data.postal)],
      ['Latitude', format(data.latitude)],
      ['Longitude', format(data.longitude)],
      ['ASN', format(connection.asn)],
      ['Organization', format(connection.org)],
      ['ISP', format(connection.isp)],
      ['Timezone', format(timezone.id)],
      ['Currency', format(currency.code)]
    ];
  }

  function renderTable(container, data) {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');

    rows(data).forEach(([name, value]) => {
      const tr = document.createElement('tr');
      const title = document.createElement('td');
      const strong = document.createElement('strong');
      strong.textContent = `${name}:`;
      title.appendChild(strong);
      const text = document.createElement('td');
      // Never interpolate third-party API data into innerHTML.
      text.textContent = value;
      tr.appendChild(title);
      tr.appendChild(text);
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrapper.appendChild(table);
    container.replaceChildren(wrapper);
  }

  global.IPLookupShared = Object.freeze({ isValidIP, rows, renderTable });
})(window);
