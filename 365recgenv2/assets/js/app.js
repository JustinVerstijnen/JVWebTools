(() => {
  const els = {
    defaultDomainInput: document.getElementById('defaultDomainInput'),
    customDomain: document.getElementById('customDomain'),
    results: document.getElementById('results'),
    modeRadios: document.querySelectorAll('input[name="mode"]'),
    spfFailRadios: document.querySelectorAll('input[name="spfFail"]'),
    exportBtn: document.getElementById('exportBtn'),
    generateBtn: document.getElementById('generateBtn'),
    customizeDetails: document.getElementById('customizeDetails'),

    dmarcPolicy: document.getElementById('dmarcPolicy'),
    dmarcRUA: document.getElementById('dmarcRUA'),
    dmarcRUF: document.getElementById('dmarcRUF'),
    dmarcPct: document.getElementById('dmarcPct'),
    dmarcAdkim: document.getElementById('dmarcAdkim'),
    dmarcAspf: document.getElementById('dmarcAspf'),
    dmarcFo: document.getElementById('dmarcFo'),
    dmarcRf: document.getElementById('dmarcRf'),
    dmarcRi: document.getElementById('dmarcRi'),

    mtaStsDate: document.getElementById('mtaStsDate'),
    mtaStsEmail: document.getElementById('mtaStsEmail')
  };

  const COPY_SVG = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="white" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
    </svg>
  `;

  const recordOrder = [
    "MX Record",
    "Autodiscover Record",
    "SPF Record",
    "DKIM Records",
    "DMARC Record",
    "MTA-STS Record"
  ];

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function isValidDomain(domain) {
    const re = /^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/;
    return re.test(domain);
  }

  function getSelectedMode() {
    for (const radio of els.modeRadios) if (radio.checked) return radio.value;
    return 'extended';
  }

  function getSelectedSPFFail() {
    for (const radio of els.spfFailRadios) if (radio.checked) return radio.value;
    return 'hard';
  }

  function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.getUTCFullYear().toString().padStart(4, '0') +
      (d.getUTCMonth() + 1).toString().padStart(2, '0') +
      d.getUTCDate().toString().padStart(2, '0') + 'T000000Z';
  }

  async function copyToClipboard(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      if (button) {
        const prev = button.getAttribute('data-prev-title') || '';
        button.setAttribute('data-prev-title', prev);
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

  function buildExtendedTable(sectionTitle, rows) {
    let html = `<h2 class="section-title">${escapeHtml(sectionTitle)}</h2>`;
    html += `<div class="table-wrapper"><table><thead><tr>
      <th style="width: 12%;">Type</th>
      <th style="width: 18%;">Name</th>
      <th>Value</th>
      <th style="width: 60px;"></th>
    </tr></thead><tbody>`;

    rows.forEach(r => {
      const type = r.type;
      const name = r.name;
      const value = r.value;
      const safeValue = escapeHtml(value);

      html += `<tr>
        <td>${escapeHtml(type)}</td>
        <td>${escapeHtml(name)}</td>
        <td class="value-cell"><code>${safeValue}</code></td>
        <td style="text-align:center;">
          <button class="copy-btn" type="button" aria-label="Copy record value" title="Copy">
            ${COPY_SVG}
          </button>
        </td>
      </tr>`;
    });

    html += `</tbody></table></div>`;
    return html;
  }

  function generateRecords() {
    const defaultDomainInput = els.defaultDomainInput.value.trim();
    const defaultDomain = defaultDomainInput ? `${defaultDomainInput}.onmicrosoft.com` : '';
    const customDomain = els.customDomain.value.trim();

    const dmarcPolicy = els.dmarcPolicy?.value || 'reject';
    const dmarcRUA = els.dmarcRUA?.value.trim() || '';
    const dmarcRUF = els.dmarcRUF?.value.trim() || '';
    const dmarcPct = els.dmarcPct?.value;
    const dmarcAdkim = els.dmarcAdkim?.value;
    const dmarcAspf = els.dmarcAspf?.value;
    const dmarcFo = els.dmarcFo?.value.trim();
    const dmarcRf = els.dmarcRf?.value.trim();
    const dmarcRi = els.dmarcRi?.value;

    const mtaStsDateInput = els.mtaStsDate?.value || '';
    const mtaStsEmail = els.mtaStsEmail?.value.trim() || '';

    const spfFailType = getSelectedSPFFail();

    if (!defaultDomainInput) {
      alert('Please fill in the Default domain.');
      return null;
    }

    if (!customDomain || !isValidDomain(customDomain)) {
      alert('Please enter a valid custom domain (e.g. example.com).');
      return null;
    }

    if (dmarcRUA && !isValidEmail(dmarcRUA)) {
      alert('Please enter a valid RUA email address.');
      return null;
    }
    if (dmarcRUF && !isValidEmail(dmarcRUF)) {
      alert('Please enter a valid RUF email address.');
      return null;
    }
    if (mtaStsEmail && !isValidEmail(mtaStsEmail)) {
      alert('Please enter a valid MTA-STS Report email address.');
      return null;
    }

    const dkimTenantPart = customDomain.replace(/\./g, '-');
    const dkim1 = `selector1-${dkimTenantPart}._domainkey.${defaultDomain}`;
    const dkim2 = `selector2-${dkimTenantPart}._domainkey.${defaultDomain}`;

    const mxValue = `0 ${dkimTenantPart}.mail.protection.outlook.com`;
    const spfValue = `v=spf1 include:spf.protection.outlook.com ${spfFailType === 'hard' ? '-all' : '~all'}`;

    let dmarcValue = `v=DMARC1; p=${dmarcPolicy};`;
    if (dmarcPct && dmarcPct !== '') dmarcValue += ` pct=${dmarcPct};`;
    if (dmarcAdkim) dmarcValue += ` adkim=${dmarcAdkim};`;
    if (dmarcAspf) dmarcValue += ` aspf=${dmarcAspf};`;
    if (dmarcFo) dmarcValue += ` fo=${dmarcFo};`;
    if (dmarcRf) dmarcValue += ` rf=${dmarcRf};`;
    if (dmarcRi && dmarcRi !== '') dmarcValue += ` ri=${dmarcRi};`;
    if (dmarcRUA) dmarcValue += ` rua=mailto:${dmarcRUA};`;
    if (dmarcRUF) dmarcValue += ` ruf=mailto:${dmarcRUF};`;

    const mtaStsIdDate = formatDate(mtaStsDateInput || new Date());
    let mtaStsValue = `v=STSv1; id=${mtaStsIdDate}`;
    if (mtaStsEmail) mtaStsValue += `; rua=mailto:${mtaStsEmail}`;

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
      ],
      "MTA-STS Record": [
        { type: "TXT", name: "_mta-sts", value: mtaStsValue }
      ]
    };

    return { records, defaultDomain, customDomain };
  }

  function renderSimple(records) {
    els.results.classList.add('simple');
    els.results.innerHTML = '';
    const lines = [];
    for (const section of recordOrder) {
      const recs = records[section];
      if (!recs) continue;
      recs.forEach(rec => lines.push(`${rec.type}  ${rec.name}  ${rec.value}`));
    }
    els.results.textContent = lines.join('\n');
    els.exportBtn.style.display = 'none';
  }

  function renderExtended(records) {
    els.results.classList.remove('simple');
    let html = '';
    for (const section of recordOrder) {
      const recs = records[section];
      if (!recs) continue;
      html += buildExtendedTable(section, recs);
    }
    els.results.innerHTML = html;
    els.exportBtn.style.display = 'block';

    // attach copy listeners
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

  function exportToHtml(records) {
    // Minimal embedded CSS for exported report (keeps the same look without external assets)
    const styles = document.querySelector('link[href="assets/css/style.css"]') ? '' : '';
    // We will inline a compact stylesheet (re-using key parts)
    const exportStyles = `
      body { font-family: 'Segoe UI', sans-serif; background-color:#f2f2f2; margin:0; padding:0; }
      .container { max-width:900px; margin:40px auto; padding:20px; background:#fff; border-radius:8px; box-shadow:0 0 15px rgba(0,0,0,0.1); }
      .header { display:flex; align-items:center; justify-content:center; gap:15px; margin-bottom:10px; }
      .header img { width:60px; height:60px; object-fit:contain; }
      h1 { margin:0; font-size:1.8em; text-align:center; }
      h2 { margin:20px 0 10px 0; font-size:1.1em; }
      .table-wrapper { overflow-x:auto; margin-top:10px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.08); background:#fff; }
      table { width:100%; border-collapse:separate; border-spacing:0; border-radius:10px; }
      thead { background:#f8f9fa; }
      th, td { padding:12px 10px; border-bottom:1px solid #ddd; text-align:left; vertical-align:top; word-break:break-word; }
      tbody tr:nth-child(even) { background:#f6f6f6; }
      button.copy-btn { background:#8EAFDA; color:#fff; border:1px solid transparent; border-radius:6px; cursor:pointer; width:34px; height:34px; display:inline-flex; align-items:center; justify-content:center; }
      button.copy-btn:hover { background:#6b8ec6; }
      code { font-family:'Segoe UI', sans-serif; font-size:14px; }
      p.footer-text { margin-top:20px; font-size:0.95em; color:#555; }
    `;

    // Build HTML (similar to on-screen extended view)
    let bodyHtml = `<div class="container">
      <div class="header">
        <a href="https://justinverstijnen.nl" target="_blank" rel="noopener noreferrer">
          <img src="https://justinverstijnen.nl/wp-content/uploads/2025/04/cropped-Logo-2.0-Transparant.png" alt="Justin Verstijnen Logo" />
        </a>
        <h1 style="color:black;">Microsoft 365 DNS Records Report</h1>
      </div>`;

    for (const section of recordOrder) {
      const recs = records[section];
      if (!recs) continue;

      bodyHtml += `<h2>${escapeHtml(section)}</h2>`;
      bodyHtml += `<div class="table-wrapper"><table><thead><tr>
        <th style="width:12%;">Type</th>
        <th style="width:18%;">Name</th>
        <th>Value</th>
        <th style="width:60px;"></th>
      </tr></thead><tbody>`;

      recs.forEach(rec => {
        bodyHtml += `<tr>
          <td>${escapeHtml(rec.type)}</td>
          <td>${escapeHtml(rec.name)}</td>
          <td><code>${escapeHtml(rec.value)}</code></td>
          <td style="text-align:center;">
            <button class="copy-btn" type="button" onclick="copyToClipboard('${escapeHtml(rec.value)}')">${COPY_SVG}</button>
          </td>
        </tr>`;
      });

      bodyHtml += `</tbody></table></div>`;
    }

    bodyHtml += `<p class="footer-text">This report was generated by <a href="https://365recordsgenerator.justinverstijnen.nl">Microsoft 365 DNS Record Generator</a> by Justin Verstijnen.</p></div>`;

    const exportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>DNS Records Report - justinverstijnen.nl</title>
<style>${exportStyles}</style>
</head>
<body>
${bodyHtml}
<script>
  function copyToClipboard(text){
    navigator.clipboard.writeText(text);
  }
</script>
</body>
</html>`;

    const blob = new Blob([exportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Microsoft365-DNS-Records.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleGenerate() {
    const out = generateRecords();
    if (!out) return;

    const mode = getSelectedMode();
    if (mode === 'simple') {
      renderSimple(out.records);
    } else {
      renderExtended(out.records);
    }

    // Close customize after generate (matches previous UX, but with <details>)
    if (els.customizeDetails?.open) els.customizeDetails.open = false;

    els.results.focus();
  }

  els.generateBtn.addEventListener('click', handleGenerate);

  els.exportBtn.addEventListener('click', () => {
    const out = generateRecords();
    if (!out) return;
    exportToHtml(out.records);
  });

  // Enter-to-generate while focused in inputs/selects
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const active = document.activeElement;
    if (!active) return;
    const tag = active.tagName;
    if (tag === 'INPUT' || tag === 'SELECT') {
      els.generateBtn.click();
      event.preventDefault();
    }
  });

  // Default date: today (local)
  try {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    if (els.mtaStsDate) els.mtaStsDate.value = `${yyyy}-${mm}-${dd}`;
  } catch {}
})();
