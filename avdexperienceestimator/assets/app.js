import {statistics, probe} from './measurement.mjs';
import {regions} from './regions.mjs';
import {availableRegions, latencyEstimateFromHttpsRtt, runPool, sortResults} from './lookup.mjs';

const $ = id => document.getElementById(id);
const sampleCount = 5;
const defaultRegionCount = 5;
const maxConcurrentRegions = 6;
const testableRegions = availableRegions(regions);

let active = null;
let report = null;
let sort = {key:'original', direction:'asc'};
let currentRegions = [];
let results = new Map();
let rowElements = new Map();
let visibilityRevision = 0;

document.addEventListener('visibilitychange', () => { visibilityRevision++; });

function waitVisible(signal) {
  if (!document.hidden || signal.aborted) return Promise.resolve();
  return new Promise(resolve => {
    const check = () => {
      if (!document.hidden || signal.aborted) {
        document.removeEventListener('visibilitychange', check);
        signal.removeEventListener('abort', check);
        resolve();
      }
    };
    document.addEventListener('visibilitychange', check);
    signal.addEventListener('abort', check, {once:true});
    check();
  });
}

async function visibleProbe(region, signal) {
  while (!signal.aborted) {
    await waitVisible(signal);
    if (signal.aborted) break;
    const revision = visibilityRevision;
    const result = await probe(region, signal);
    // Avoid browser background throttling affecting the reported times.
    if (signal.aborted) return {ms:null, result:'cancelled'};
    if (revision === visibilityRevision && !document.hidden) return result;
  }
  return {ms:null, result:'cancelled'};
}

function formatTime(ms) {
  return ms === null || !Number.isFinite(ms) ? '—' : `${Math.round(ms)} ms`;
}

function createRow(region) {
  const row = document.createElement('tr');
  row.className = 'region-enter';
  const name = document.createElement('td');
  const label = document.createElement('strong');
  label.textContent = region.name;
  const location = document.createElement('small');
  location.textContent = region.location;
  name.append(label, location);

  const latency = document.createElement('td');
  latency.className = 'number';
  latency.textContent = '…';
  latency.dataset.metric = 'latency';
  const rtt = document.createElement('td');
  rtt.className = 'number';
  rtt.textContent = '…';
  rtt.dataset.metric = 'rtt';
  row.append(name, latency, rtt);
  return row;
}

function updateRow(region, result) {
  const row = rowElements.get(region.id);
  if (!row) return;
  row.querySelector('[data-metric="latency"]').textContent = formatTime(result.latencyEstimateMs);
  row.querySelector('[data-metric="rtt"]').textContent = formatTime(result.rttHttpsMs);
  if (result.statistics.count === 0) row.title = 'Unable to measure this endpoint from your browser';
  else if (result.statistics.count < sampleCount) row.title = `Based on ${result.statistics.count} successful samples`;
  else row.removeAttribute('title');
}

function orderRows() {
  const sorted = sortResults(currentRegions, results, sort.key, sort.direction);
  const fragment = document.createDocumentFragment();
  for (const region of sorted) fragment.append(rowElements.get(region.id));
  $('rows').append(fragment);
}

function updateSortIndicators() {
  const headers = {region: 'regionHeader', latency:'latencyHeader', rtt:'rttHeader'};
  for (const [key, id] of Object.entries(headers)) {
    const selected = sort.key === key;
    const th = $(id);
    th.setAttribute('aria-sort', selected ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none');
    th.querySelector('.sort-indicator').textContent = selected ? (sort.direction === 'asc' ? '↑' : '↓') : '↕';
  }
}

function setSort(key) {
  sort = sort.key === key
    ? {key, direction: sort.direction === 'asc' ? 'desc' : 'asc'}
    : {key, direction: 'asc'};
  updateSortIndicators();
  orderRows();
}

for (const button of document.querySelectorAll('[data-sort]')) {
  button.addEventListener('click', () => setSort(button.dataset.sort));
}

async function start(full = false) {
  active?.abort();
  const controller = new AbortController();
  active = controller;
  const signal = controller.signal;
  const selected = full ? testableRegions : testableRegions.slice(0, defaultRegionCount);
  currentRegions = selected;
  results = new Map();
  rowElements = new Map();
  sort = {key:'original', direction:'asc'};
  updateSortIndicators();

  const snapshot = {
    tool: 'AVD Experience Estimator',
    version: 4,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    completed: false,
    scope: full ? 'all-available' : 'first-five',
    method: 'Client-side HTTPS no-cors response timing, one warmup + up to five sequential samples per region, six regions tested concurrently; HTTPS RTT is not RDP/ICMP RTT. One-way latency is estimated as HTTPS RTT / 2, not directly measured.',
    regions: []
  };
  report = snapshot;

  $('rows').replaceChildren();
  for (const region of selected) {
    const entry = {
      ...region,
      availability: 'configured',
      warmup: null,
      samples: [],
      statistics: null,
      latencyEstimateMs: null,
      rttHttpsMs: null,
      completed: false
    };
    results.set(region.id, entry);
    snapshot.regions.push(entry);
    const row = createRow(region);
    rowElements.set(region.id, row);
    $('rows').append(row);
  }
  $('exportBtn').disabled = true;

  const plannedSteps = selected.length * (sampleCount + 1);
  let finishedSteps = 0;
  let finishedRegions = 0;
  const progress = () => {
    if (active !== controller) return;
    const percentage = plannedSteps ? Math.round(finishedSteps / plannedSteps * 100) : 100;
    $('bar').max = Math.max(1, plannedSteps);
    $('bar').value = finishedSteps;
    $('bar').setAttribute('aria-valuetext', `${percentage}% complete`);
    $('percent').textContent = `${percentage}%`;
    $('progress').textContent = document.hidden
      ? `Lookup paused while this tab is hidden (${finishedRegions}/${selected.length} regions)`
      : `Checking ${selected.length} regions in parallel · ${finishedRegions}/${selected.length} finished`;
  };
  progress();

  async function checkRegion(region) {
    const entry = results.get(region.id);
    let consumedSteps = 0;
    const advance = () => {consumedSteps++; finishedSteps++; progress();};
    try {
      entry.warmup = await visibleProbe(region, signal);
      if (signal.aborted) return;
      advance();
      let consecutiveFailures = entry.warmup.ms === null ? 1 : 0;
      for (let i = 0; i < sampleCount && !signal.aborted; i++) {
        const sample = await visibleProbe(region, signal);
        if (signal.aborted) return;
        entry.samples.push({...sample, at: new Date().toISOString()});
        advance();
        consecutiveFailures = sample.ms === null ? consecutiveFailures + 1 : 0;
        // Save time on unreachable/blocked endpoints rather than repeating five timeouts.
        if (consecutiveFailures >= 2) break;
      }
    } catch (error) {
      entry.error = 'Unable to complete measurement';
    } finally {
      if (signal.aborted || active !== controller) return;
      finishedSteps += sampleCount + 1 - consumedSteps;
      entry.statistics = statistics(entry.samples);
      entry.rttHttpsMs = entry.statistics.median;
      entry.latencyEstimateMs = latencyEstimateFromHttpsRtt(entry.rttHttpsMs);
      entry.completed = true;
      finishedRegions++;
      updateRow(region, entry);
      orderRows();
      progress();
    }
  }

  try {
    await runPool(selected, maxConcurrentRegions, checkRegion, signal);
    if (signal.aborted || active !== controller) return;
    snapshot.completed = true;
    snapshot.finishedAt = new Date().toISOString();
    const successful = snapshot.regions.filter(r => r.statistics?.count > 0).length;
    $('progress').textContent = `Lookup complete · ${successful} of ${selected.length} regions measured`;
    $('exportBtn').disabled = false;
  } catch (error) {
    if (active === controller && !signal.aborted) {
      $('progress').textContent = 'Lookup interrupted. Click Start full lookup to retry.';
    }
  } finally {
    if (active === controller) active = null;
  }
}

$('start').addEventListener('click', () => start(true));
$('exportBtn').addEventListener('click', () => {
  if (!report?.completed) return;
  const url = URL.createObjectURL(new Blob([JSON.stringify({...report, exportedAt:new Date().toISOString()}, null, 2)], {type:'application/json'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = `avd-experience-estimator-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

$('year').textContent = new Date().getFullYear();
start(false);
