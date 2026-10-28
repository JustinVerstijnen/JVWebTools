/** Execute independent region measurements with a bounded parallel worker pool. */
export async function runPool(items, concurrency, worker, signal) {
  if (!Number.isInteger(concurrency) || concurrency < 1) throw new RangeError('concurrency must be a positive integer');
  let nextIndex = 0;
  const count = Math.min(items.length, concurrency);
  await Promise.all(Array.from({length: count}, async () => {
    while (!signal.aborted) {
      const index = nextIndex++;
      if (index >= items.length) return;
      await worker(items[index], index);
    }
  }));
}

export function availableRegions(list) {
  return list.filter(region => typeof region.url === 'string' && region.url.length > 0);
}

export function sortResults(regions, results, key, direction = 'asc') {
  if (!['region', 'latency', 'rtt', 'original'].includes(key)) throw new RangeError('Invalid sort key');
  if (!['asc', 'desc'].includes(direction)) throw new RangeError('Invalid sort direction');
  if (key === 'original') return [...regions];
  const sign = direction === 'asc' ? 1 : -1;
  return [...regions].sort((a,b) => {
    if (key === 'region') return sign * a.name.localeCompare(b.name, 'en', {sensitivity:'base'}) || a.name.localeCompare(b.name);
    const field = key === 'latency' ? 'latencyEstimateMs' : 'rttHttpsMs';
    const first = results.get(a.id)?.[field];
    const second = results.get(b.id)?.[field];
    const aKnown = typeof first === 'number' && Number.isFinite(first);
    const bKnown = typeof second === 'number' && Number.isFinite(second);
    // Pending/unavailable results always appear after measured results.
    if (aKnown !== bKnown) return aKnown ? -1 : 1;
    if (aKnown && first !== second) return sign * (first - second);
    return a.name.localeCompare(b.name, 'en', {sensitivity:'base'});
  });
}

export function latencyEstimateFromHttpsRtt(rttMs) {
  // An assumption for comparison only, NOT measured one-way latency.
  return rttMs === null || !Number.isFinite(rttMs) ? null : rttMs / 2;
}
