export function statistics(samples) {
  const values = samples.filter(s => s.ms !== null && Number.isFinite(s.ms)).map(s => s.ms).sort((a,b)=>a-b);
  if (!values.length) return {median:null,min:null,max:null,variation:null,count:0};
  const n=values.length;
  return {median:n%2?values[(n-1)/2]:(values[n/2-1]+values[n/2])/2,min:values[0],max:values[n-1],variation:values[n-1]-values[0],count:n};
}
export async function probe(endpoint, signal, mode='no-cors') {
  const controller = new AbortController();
  const abort=()=>controller.abort();
  if(signal.aborted) return {ms:null,result:'cancelled'};
  signal.addEventListener('abort',abort,{once:true});
  const timer=setTimeout(abort,6000);
  const url=new URL(endpoint.url);
  url.searchParams.set('_avdpulse',crypto.randomUUID());
  const start=performance.now();
  try {
    const response=await fetch(url,{method:'GET',mode,cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal});
    // Opaque responses do not expose status or body. Never infer service health.
    if(response.type==='opaque') return {ms:performance.now()-start,result:'opaque',httpStatus:null};
    await response.arrayBuffer();
    return {ms:performance.now()-start,result:response.ok?'http-ok':'http-error',httpStatus:response.status};
  } catch(error) {
    return {ms:null,result:signal.aborted?'cancelled':controller.signal.aborted?'timeout':'blocked-or-network'};
  } finally {clearTimeout(timer);signal.removeEventListener('abort',abort);}
}
