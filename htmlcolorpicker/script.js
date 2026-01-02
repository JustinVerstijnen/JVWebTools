const colorInput   = document.getElementById('colorInput');
const hexInput     = document.getElementById('hexInput');
const rgbInput     = document.getElementById('rgbInput');
const errorMsg     = document.getElementById('errorMsg');

const colorPreview = document.getElementById('colorPreview');
const textPreview  = document.getElementById('textPreview');
const currentHexEl = document.getElementById('currentHex');
const currentRgbEl = document.getElementById('currentRgb');

const copyHexBtn   = document.getElementById('copyHexBtn');
const copyRgbBtn   = document.getElementById('copyRgbBtn');
const hexCopyStatus = document.getElementById('hexCopyStatus');
const rgbCopyStatus = document.getElementById('rgbCopyStatus');

const randomBtn    = document.getElementById('randomBtn');
const resetBtn     = document.getElementById('resetBtn');

const historyList  = document.getElementById('historyList');

let currentColor = '#88B0DC';
let history = [];

function showError(message) {
  errorMsg.textContent = message || '';
}

function hexToRgb(hex) {
  hex = hex.replace('#', '').trim();

  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return null;
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  const clamp = v => Math.max(0, Math.min(255, v));
  const toHex = v => clamp(v).toString(16).padStart(2, '0');
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

function parseRgbString(str) {
  const cleaned = str.trim();

  const fnMatch = cleaned.match(/^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  const simpleMatch = cleaned.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/);

  const m = fnMatch || simpleMatch;
  if (!m) return null;

  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);

  if ([r, g, b].some(v => v < 0 || v > 255)) return null;

  return { r, g, b };
}

function getContrastTextColor({ r, g, b }) {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#000000' : '#FFFFFF';
}

function addToHistory(hex) {
  history = [hex, ...history.filter(h => h !== hex)].slice(0, 10);
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';
  history.forEach(hex => {
    const swatch = document.createElement('div');
    swatch.className = 'history-swatch';
    swatch.style.backgroundColor = hex;
    swatch.title = hex;
    swatch.addEventListener('click', () => setColor(hex, false));
    historyList.appendChild(swatch);
  });
}

function setColor(hex, pushToHistory = true) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    showError('Invalid color value.');
    return;
  }

  showError('');
  currentColor = '#' + hex.replace('#', '').toUpperCase();

  if (pushToHistory) {
    addToHistory(currentColor);
  }

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const textColor = getContrastTextColor(rgb);

  // Update UI
  colorInput.value = currentColor;
  hexInput.value = currentColor;
  rgbInput.value = rgbString;

  colorPreview.style.backgroundColor = currentColor;
  textPreview.style.color = textColor;

  currentHexEl.textContent = currentColor;
  currentRgbEl.textContent = rgbString;
}

function flashCopyStatus(el) {
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 1200);
}

// Event listeners
colorInput.addEventListener('input', (e) => {
  const value = e.target.value;
  setColor(value);
});

hexInput.addEventListener('input', (e) => {
  const value = e.target.value.trim();
  if (!value) {
    showError('');
    return;
  }
  const match = value.match(/^#?[0-9A-Fa-f]{3}$|^#?[0-9A-Fa-f]{6}$/);
  if (!match) {
    showError('Please enter a valid HEX value (e.g. #88B0DC).');
    return;
  }
  setColor(value);
});

rgbInput.addEventListener('blur', (e) => {
  const value = e.target.value.trim();
  if (!value) {
    showError('');
    return;
  }
  const parsed = parseRgbString(value);
  if (!parsed) {
    showError('Please enter a valid RGB value, e.g. "136,176,220" or "rgb(136,176,220)".');
    return;
  }
  const hex = rgbToHex(parsed.r, parsed.g, parsed.b);
  setColor(hex);
});

copyHexBtn.addEventListener('click', () => {
  if (navigator.clipboard && currentColor) {
    navigator.clipboard.writeText(currentColor)
      .then(() => flashCopyStatus(hexCopyStatus))
      .catch(() => alert('Copy failed.'));
  } else {
    alert('Clipboard not supported by this browser.');
  }
});

copyRgbBtn.addEventListener('click', () => {
  const text = currentRgbEl.textContent;
  if (navigator.clipboard && text) {
    navigator.clipboard.writeText(text)
      .then(() => flashCopyStatus(rgbCopyStatus))
      .catch(() => alert('Copy failed.'));
  } else {
    alert('Clipboard not supported by this browser.');
  }
});

randomBtn.addEventListener('click', () => {
  const random = Math.floor(Math.random() * 0xFFFFFF);
  const hex = '#' + random.toString(16).padStart(6, '0');
  setColor(hex);
});

resetBtn.addEventListener('click', () => {
  setColor('#88B0DC');
});

setColor(currentColor, false);
