(function () {
  'use strict';

  const LOOKUP_ENDPOINT = 'https://ipwho.is/';
  const MY_IP_ENDPOINT = 'https://api64.ipify.org?format=json';
  const TIMEOUT_MS = 12000;

  const input = document.getElementById('ipInput');
  const result = document.getElementById('result');
  const lookupButton = document.getElementById('lookupBtn');
  const exportButton = document.getElementById('exportBtn');
  const myIPButton = document.getElementById('useMyIpBtn');
  const myIPShown = document.getElementById('myIpShown');

  let latestData = null;
  let myIP = null;
  let busy = false;

  function showMessage(message, isError = false) {
    result.className = isError ? 'result error' : 'result';
    result.textContent = message;
  }

  function updateButtons() {
    lookupButton.disabled = busy;
    exportButton.disabled = busy || !latestData;
    myIPButton.disabled = busy;
  }

  async function getJSON(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        cache: 'no-store'
      });

      if (response.status === 429) {
        throw new Error('The IP service rate limit has been reached. Please try again later.');
      }
      if (!response.ok) {
        throw new Error(`The IP service returned HTTP ${response.status}.`);
      }
      try {
        return await response.json();
      } catch (_) {
        throw new Error('The IP service returned an invalid response.');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('The request timed out. Please try again.');
      }
      if (error instanceof TypeError) {
        throw new Error('Unable to contact the IP service. Check your network connection or browser security settings.');
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  async function lookupIP(ipOverride) {
    if (busy) return;
    const ip = (ipOverride || input.value).trim();
    latestData = null;
    updateButtons();
    if (!IPLookupShared.isValidIP(ip)) {
      showMessage('Please enter a valid IPv4 or IPv6 address.', true);
      return;
    }

    busy = true;
    updateButtons();
    input.value = ip;
    showMessage('Loading...');
    try {
      const data = await getJSON(`${LOOKUP_ENDPOINT}${encodeURIComponent(ip)}`);
      if (!data || data.success === false || !data.ip) {
        const detail = data && typeof data.message === 'string' ? data.message : 'This IP address could not be looked up.';
        throw new Error(detail);
      }
      latestData = data;
      result.className = 'result fade-in';
      IPLookupShared.renderTable(result, data);
    } catch (error) {
      showMessage(error.message || 'An unexpected lookup error occurred.', true);
    } finally {
      busy = false;
      updateButtons();
    }
  }

  async function getMyIP() {
    myIPShown.textContent = 'My IP: loading...';
    try {
      const answer = await getJSON(MY_IP_ENDPOINT);
      if (!answer || !IPLookupShared.isValidIP(answer.ip)) {
        throw new Error('The public IP service returned an invalid address.');
      }
      myIP = answer.ip;
      myIPShown.textContent = `My IP: ${myIP}`;
      return myIP;
    } catch (_) {
      myIP = null;
      myIPShown.textContent = 'My IP: unavailable';
      return null;
    }
  }

  function exportResult() {
    if (!latestData) {
      showMessage('Perform an IP lookup before exporting.', true);
      return;
    }
    const report = window.open('assets/export.html', '_blank');
    if (!report) {
      showMessage('The export window was blocked. Please allow pop-ups for this site.', true);
    }
  }

  function isSameOrigin(event) {
    return event.origin === window.location.origin;
  }

  // Export page signals when ready; only send the result to that same-origin page.
  window.addEventListener('message', (event) => {
    if (!isSameOrigin(event) || !event.data || event.data.type !== 'iplookup-export-ready') return;
    if (!event.source || !latestData) return;
    const targetOrigin = location.origin === 'null' ? '*' : location.origin;
    event.source.postMessage({ type: 'iplookup-export-data', payload: latestData }, targetOrigin);
  });

  document.getElementById('copyright-year').textContent = String(new Date().getFullYear());
  lookupButton.addEventListener('click', () => lookupIP());
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') lookupIP();
  });
  exportButton.addEventListener('click', exportResult);
  myIPButton.addEventListener('click', async () => {
    if (busy) return;
    const ip = myIP || await getMyIP();
    if (ip) await lookupIP(ip);
    else showMessage('Could not determine your public IP. You can enter it manually.', true);
  });

  updateButtons();
  getMyIP();
})();
