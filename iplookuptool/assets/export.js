(function () {
  'use strict';

  const title = document.getElementById('exportTitle');
  const result = document.getElementById('exportResult');
  let received = false;

  function fromOpener(event) {
    return event.source === window.opener && event.origin === window.location.origin;
  }

  window.addEventListener('message', (event) => {
    if (!fromOpener(event) || !event.data || event.data.type !== 'iplookup-export-data') return;
    const data = event.data.payload;
    if (!data || !IPLookupShared.isValidIP(data.ip)) return;
    received = true;
    title.textContent = `Export result for ${data.ip}`;
    IPLookupShared.renderTable(result, data);
  });

  if (window.opener) {
    result.textContent = 'Loading report...';
    const targetOrigin = window.location.origin === 'null' ? '*' : window.location.origin;
    window.opener.postMessage({ type: 'iplookup-export-ready' }, targetOrigin);
  } else {
    result.textContent = 'No report available. Open this page using Export from the lookup tool.';
  }

  // If this page is used directly, the message above stays visible.
})();
