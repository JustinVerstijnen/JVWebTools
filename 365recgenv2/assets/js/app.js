(() => {
  const COPY_SVG = `
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
    </svg>
  `;

  const els = {
    // inputs
    defaultDomainInput: document.getElementById('defaultDomainInput'),
    customDomain: document.getElementById('customDomain'),
    modeRadios: document.querySelectorAll('input[name="mode"]'),
    spfFailRadios: document.querySelectorAll('input[name="spfFail"]'),

    dmarcPolicy: document.getElementById('dmarcPolicy'),
    dmarcRUA: document.getElementById('dmarcRUA'),
    dmarcRUF: document.getElementById('dmarcRUF'),
    dmarcPct: document.getElementById('dmarcPct'),
    dmarcAdkim: document.getElementById('dmarcAdkim'),
    dmarcAspf: document.getElementById('dmarcAspf'),

    mtaStsEnabled: document.getElementById('mtaStsEnabled'),
    mtaStsDate: document.getElementById('mtaStsDate'),
    mtaStsEmail: document.getElementById('mtaStsEmail'),

    // actions / output
    results: document.getElementById('results'),
    generateBtn: document.getElementById('generateBtn'),
    exportBtn: document.getElementById('exportBtn'),

    // tabs
    tabs: Array.from(document.querySelectorAll('.tab')),
    panels: Array.from(document.querySelectorAll('.tab-panel')),
    navBtns: Array.from(document.querySelectorAll('[data-nav]')),

    // footer
    footerText: document.getElementById('footerText')
  };

  const tabOrder = ['domains', 'spf', 'dmarc', 'mtasts', 'generate'];

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  function isValidDomain(domain) {
    const re = /^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/;
    return re.test(domain);
  }

  function normalizeTenantInput(raw) {
    let s = (raw || '').trim().toLowerCase();
    if (!s) return { tenantBase: '', tenantFull: '' };

    // Remove protocol, spaces, and trailing dots
    s = s.replace(/^https?:\/\//, '').replace(/\s+/g, '').replace(/\.+$/, '');

    // If user pasted full onmicrosoft domain (even duplicated), strip suffix(es) to get base
    s = s.replace(/(\.onmicrosoft\.com)+$/i, '');

    // If still contains dots (like contoso.mail.onmicrosoft.com pasted weirdly), keep left-most label as base
    // [Inference] This is the safest behavior for this tool's suffix UI.
    if (s.includes('.')) s = s.split('.')[0];

    // Allow only reasonable tenant label chars
    s = s.replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '');

    const tenantFull = s ? `${s}.onmicrosoft.com` : '';
    return { tenantBase: s, tenantFull };
  }

  function normalizeTenantInValue(value) {
    // Fix accidental ".onmicrosoft.com.onmicrosoft.com" in generated targets
    return String(value).replace(/\.onmicrosoft\.com(\.onmicrosoft\.com)+/gi, '.onmicrosoft.com');
  }

  function getSelectedValue(radioNodeList, fallback) {
    for (const r of radioNodeList) if (r.checked) return r.value;
    return fallback;
  }

  function setActiveTab(tabName) {
    els.tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    els.panels.forEach(p => p.classList.toggle('active', p.dataset.tabpanel === tabName));
    // Keep URL hash in sync (nice for refresh)
    try { history.replaceState(null, '', `#${tabName}`); } catch {}
  }

  function currentTabIndex() {
    const active = els.tabs.find(t => t.classList.contains('active'));
    const name = active?.dataset.tab || 'domains';
    return Math.max(0, tabOrder.indexOf(name));
  }

  function goRelative(delta) {
    const idx = currentTabIndex();
    const next = tabOrder[Math.min(tabOrder.length - 1, Math.max(0, idx + delta))];
    setActiveTab(next);
    // Focus first control in panel for accessibility
    const panel = document.querySelector(`.tab-panel[data-tabpanel="${next}"]`);
    const focusable = panel?.querySelector('input, select, button, a');
    focusable?.focus?.();
  }

  async function copyToClipboard(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      if (button) {
        const prev = button.title;
        button.title = 'Copied!';
        button.classList.add('active');
        setTimeout(() => {
          button.title = prev;
          button.classList.remove('active');
        }, 700);
      }
    } catch {
      alert('Copy failed. Please copy manually.');
    }
  }

  function buildTable(sectionTitle, rows) {
    let html = `<h2 class="section-title">${escapeHtml(sectionTitle)}</h2>`;
    html += `<div class="table-wrapper"><table><thead><tr>
      <th style="width: 22%;">Record</th>
      <th style="width: 14%;">Type</th>
      <th>Value</th>
      <th style="width: 60px;"></th>
    </tr></thead><tbody>`;

    rows.forEach(r => {
      const type = escapeHtml(r.type);
      const record = escapeHtml(r.name);
      const value = escapeHtml(r.value);

      html += `<tr>
        <td class="record-cell">${record}</td>
        <td>${type}</td>
        <td class="value-cell"><code>${value}</code></td>
        <td style="text-align:center;">
          <button class="copy-btn" type="button" aria-label="Copy record value" title="Copy">${COPY_SVG}</button>
        </td>
      </tr>`;
    });

    html += `</tbody></table></div>`;
    return html;
  }

  function formatDateYYYYMMDDT000000Z(d) {
    const dt = (d instanceof Date) ? d : new Date(d);
    const y = dt.getUTCFullYear().toString().padStart(4, '0');
    const m = (dt.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = dt.getUTCDate().toString().padStart(2, '0');
    return `${y}${m}${day}T000000Z`;
  }

  function generateRecordsPayload() {
    const tenantRaw = els.defaultDomainInput.value;
    const tenant = normalizeTenantInput(tenantRaw);
    const customDomain = (els.customDomain.value || '').trim().toLowerCase();

    if (!tenant.tenantFull) {
      alert('Please fill in your Microsoft 365 tenant domain.');
      return null;
    }
    if (!customDomain || !isValidDomain(customDomain)) {
      alert('Please fill in a valid custom domain (e.g. example.com).');
      return null;
    }

    // If the user pasted the full tenant domain, show only base in the UI
    if (tenant.tenantBase && els.defaultDomainInput.value.trim().toLowerCase() !== tenant.tenantBase) {
      els.defaultDomainInput.value = tenant.tenantBase;
    }

    const mode = getSelectedValue(els.modeRadios, 'standard');
    const spfFailType = getSelectedValue(els.spfFailRadios, 'hard');

    const dmarcPolicy = els.dmarcPolicy?.value || 'reject';
    const dmarcRUA = (els.dmarcRUA?.value || '').trim();
    const dmarcRUF = (els.dmarcRUF?.value || '').trim();
    const dmarcPct = (els.dmarcPct?.value ?? '').toString().trim();
    const dmarcAdkim = (els.dmarcAdkim?.value || '').trim();
    const dmarcAspf = (els.dmarcAspf?.value || '').trim();

    const mtaEnabled = !!els.mtaStsEnabled?.checked;
    const mtaDateInput = els.mtaStsDate?.value || '';
    const mtaEmail = (els.mtaStsEmail?.value || '').trim();

    const dkimTenantPart = customDomain.replace(/\./g, '-');

    const dkim1 = normalizeTenantInValue(`selector1-${dkimTenantPart}._domainkey.${tenant.tenantFull}`);
    const dkim2 = normalizeTenantInValue(`selector2-${dkimTenantPart}._domainkey.${tenant.tenantFull}`);

    const mxValue = `0 ${dkimTenantPart}.mail.protection.outlook.com`;
    const spfValue = `v=spf1 include:spf.protection.outlook.com ${spfFailType === 'hard' ? '-all' : '~all'}`;

    let dmarcValue = `v=DMARC1; p=${dmarcPolicy};`;
    if (dmarcPct !== '') dmarcValue += ` pct=${dmarcPct};`;
    if (dmarcAdkim) dmarcValue += ` adkim=${dmarcAdkim};`;
    if (dmarcAspf) dmarcValue += ` aspf=${dmarcAspf};`;
    if (dmarcRUA) dmarcValue += ` rua=mailto:${dmarcRUA};`;
    if (dmarcRUF) dmarcValue += ` ruf=mailto:${dmarcRUF};`;

    const mtaIdDate = formatDateYYYYMMDDT000000Z(mtaDateInput || new Date());
    let mtaStsValue = `v=STSv1; id=${mtaIdDate}`;
    if (mtaEmail) mtaStsValue += `; rua=mailto:${mtaEmail}`;

    const records = {
      "MX Record": [
        { type: "MX", name: "@", value: mxValue }
      ],
      "Autodiscover Record": [
        { type: "CNAME", name: "autodiscover", value: "autodiscover.outlook.com" }
      ],
      "SPF Record": [
        { type: "TXT", name: "@", value: spfValue }
      ],
      "DKIM Records": [
        { type: "CNAME", name: "selector1._domainkey", value: dkim1 },
        { type: "CNAME", name: "selector2._domainkey", value: dkim2 }
      ],
      "DMARC Record": [
        { type: "TXT", name: "_dmarc", value: dmarcValue }
      ]
    };

    if (mtaEnabled) {
      records["MTA-STS Record"] = [
        { type: "TXT", name: "_mta-sts", value: mtaStsValue }
      ];
    }

    // If mode is "standard" we keep all. If "custom", you can extend later.
    // [Inference] existing tool behavior used mode; this keeps UI stable.
    const recordOrder = [
      "MX Record",
      "Autodiscover Record",
      "SPF Record",
      "DKIM Records",
      "DMARC Record",
      ...(mtaEnabled ? ["MTA-STS Record"] : [])
    ];

    return { records, recordOrder, tenantFull: tenant.tenantFull, customDomain, mode };
  }

  function renderResults(payload) {
    const { records, recordOrder } = payload;
    let html = '';
    for (const section of recordOrder) {
      const recs = records[section];
      if (!recs) continue;
      html += buildTable(section, recs);
    }
    els.results.innerHTML = html;
    els.exportBtn.style.display = 'inline-flex';

    const buttons = els.results.querySelectorAll('button.copy-btn');
    let i = 0;
    for (const section of recordOrder) {
      const recs = records[section];
      if (!recs) continue;
      for (const rec of recs) {
        const btn = buttons[i++];
        btn.addEventListener('click', () => copyToClipboard(rec.value, btn));
      }
    }
  }

  function buildExportHtml(payload) {
    const { records, recordOrder, tenantFull, customDomain } = payload;
    const now = new Date();
    const stamp = now.toISOString().replace('T', ' ').replace('Z', ' UTC');

    let body = `<h1 style="margin:0 0 6px;font-family:Segoe UI,Arial,sans-serif;">Microsoft 365 DNS Records</h1>`;
    body += `<div style="font-family:Segoe UI,Arial,sans-serif;font-size:12px;color:#555;margin-bottom:14px;">
      Tenant: <b>${escapeHtml(tenantFull)}</b> &nbsp;|&nbsp; Domain: <b>${escapeHtml(customDomain)}</b> &nbsp;|&nbsp; Generated: ${escapeHtml(stamp)}
    </div>`;

    for (const section of recordOrder) {
      const recs = records[section];
      if (!recs) continue;

      body += `<h2 style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;margin:18px 0 8px;">${escapeHtml(section)}</h2>`;
      body += `<table style="width:100%;border-collapse:collapse;font-family:Segoe UI,Arial,sans-serif;font-size:12px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border:1px solid #ddd;background:#f7f7f7;width:22%;">Record</th>
            <th style="text-align:left;padding:8px;border:1px solid #ddd;background:#f7f7f7;width:14%;">Type</th>
            <th style="text-align:left;padding:8px;border:1px solid #ddd;background:#f7f7f7;">Value</th>
          </tr>
        </thead><tbody>`;

      recs.forEach(rec => {
        body += `<tr>
          <td style="padding:8px;border:1px solid #ddd;font-weight:700;">${escapeHtml(rec.name)}</td>
          <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(rec.type)}</td>
          <td style="padding:8px;border:1px solid #ddd;"><code style="white-space:pre-wrap;word-break:break-word;">${escapeHtml(rec.value)}</code></td>
        </tr>`;
      });

      body += `</tbody></table>`;
    }

    body += `<div style="margin-top:24px;text-align:center;font-size:9px;color:#777;font-family:Segoe UI,Arial,sans-serif;">
      &copy; ${now.getFullYear()} Microsoft 365 Records Generator tool by Justin Verstijnen. 
      <a href="https://github.com/JustinVerstijnen/365RecordsGenerator" style="color:inherit;text-decoration:none;">Click here to visit GitHub project.</a>
    </div>`;

    return `<!doctype html><html><head><meta charset="utf-8"><title>Microsoft 365 DNS Records</title></head><body style="background:#fff;margin:18px;">${body}</body></html>`;
  }

  function wireUp() {
    // footer
    if (els.footerText) {
      const year = new Date().getFullYear();
      els.footerText.innerHTML = `&copy; ${year} Microsoft 365 Records Generator tool by Justin Verstijnen. <a href="https://github.com/JustinVerstijnen/365RecordsGenerator" target="_blank" rel="noopener noreferrer">Click here to visit GitHub project.</a>`;
    }

    // tabs
    els.tabs.forEach(t => t.addEventListener('click', () => setActiveTab(t.dataset.tab)));

    // back/next buttons
    els.navBtns.forEach(b => b.addEventListener('click', () => {
      const dir = b.dataset.nav;
      if (dir === 'back') goRelative(-1);
      if (dir === 'next') goRelative(1);
    }));

    // normalize tenant input on blur
    els.defaultDomainInput?.addEventListener('blur', () => {
      const t = normalizeTenantInput(els.defaultDomainInput.value);
      if (t.tenantBase) els.defaultDomainInput.value = t.tenantBase;
    });

    // hash on load
    const hash = (location.hash || '').replace('#', '').trim();
    if (tabOrder.includes(hash)) setActiveTab(hash);

    // generate
    els.generateBtn?.addEventListener('click', () => {
      const payload = generateRecordsPayload();
      if (!payload) return;
      renderResults(payload);
      els.results?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    });

    // export
    els.exportBtn?.addEventListener('click', () => {
      const payload = generateRecordsPayload();
      if (!payload) return;
      const html = buildExportHtml(payload);
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `m365-dns-records-${payload.customDomain}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  wireUp();
})();