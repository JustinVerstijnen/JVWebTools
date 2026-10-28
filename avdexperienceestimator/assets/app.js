import {statistics,probe} from './measurement.mjs';
import {regions} from './regions.mjs';
const $=id=>document.getElementById(id);
let active=null,report=null,visibilityRevision=0;
document.addEventListener('visibilitychange',()=>{visibilityRevision++;});
function waitVisible(signal){
 if(!document.hidden||signal.aborted)return Promise.resolve();
 return new Promise(resolve=>{
  const check=()=>{if(!document.hidden||signal.aborted){document.removeEventListener('visibilitychange',check);signal.removeEventListener('abort',check);resolve();}};
  document.addEventListener('visibilitychange',check);signal.addEventListener('abort',check,{once:true});check();
 });
}
async function visibleProbe(region,signal){
 while(!signal.aborted){
  if(document.hidden)$('progress').textContent='The lookup will resume when this tab is visible.';
  await waitVisible(signal);if(signal.aborted)break;
  $('progress').textContent='Checking '+region.name+'…';
  const revision=visibilityRevision,result=await probe(region,signal);
  // Discard timings affected by background throttling and retry when visible.
  if(signal.aborted)return {ms:null,result:'cancelled'};
  if(revision===visibilityRevision&&!document.hidden)return result;
 }
 return {ms:null,result:'cancelled'};
}
function appendRegion(region,result){
 const row=document.createElement('tr');row.className='region-enter';
 const name=document.createElement('td');const label=document.createElement('strong');label.textContent=region.name;const location=document.createElement('small');location.textContent=region.location;name.append(label,location);
 const latency=document.createElement('td');latency.className='number';latency.textContent=result.statistics.median===null?'—':Math.round(result.statistics.median)+' ms';
 const state=document.createElement('td');
 if(!region.url){state.textContent='No verified test endpoint';state.className='unknown';}
 else if(result.statistics.count){state.textContent=result.statistics.count===5?'Response received':'Partial response';state.className=result.statistics.count===5?'received':'problem';}
 else{state.textContent='Unable to measure';state.className='problem';}
 row.append(name,latency,state);$('rows').append(row);$('exportBtn').disabled=false;
}
async function start(){
 active?.abort();const current=active=new AbortController();
 const snapshot={tool:'AVD Experience Tool',version:3,startedAt:new Date().toISOString(),finishedAt:null,completed:false,method:'Client-side HTTPS, regional AVD gateways; 1 excluded warmup + 5 samples; no-cors; status unknown; not RDP RTT.',regions:[]};
 report=snapshot;$('rows').replaceChildren();$('exportBtn').disabled=true;
 let completedSteps=0;const totalSteps=regions.reduce((n,r)=>n+(r.url?6:1),0);
 $('bar').max=totalSteps;$('bar').value=0;$('bar').setAttribute('aria-valuetext','0% complete');$('percent').textContent='0%';
 const advance=()=>{if(active!==current)return;const percent=Math.round(++completedSteps/totalSteps*100);$('bar').value=completedSteps;$('bar').setAttribute('aria-valuetext',percent+'% complete');$('percent').textContent=percent+'%';};
 try{
  for(const region of regions){
   if(current.signal.aborted)return;
   const result={...region,samples:[],availability:region.url?'configured':'unconfirmed'};
   if(region.url){
    result.warmup=await visibleProbe(region,current.signal);if(!current.signal.aborted)advance();
    for(let i=0;i<5&&!current.signal.aborted;i++){
     const sample=await visibleProbe(region,current.signal);
     if(sample.result!=='cancelled'){result.samples.push({...sample,at:new Date().toISOString()});advance();}
    }
   }
   if(current.signal.aborted)return;
   if(!region.url)advance();
   result.statistics=statistics(result.samples);snapshot.regions.push(result);appendRegion(region,result);
  }
  snapshot.completed=true;snapshot.finishedAt=new Date().toISOString();
  $('progress').textContent='Lookup complete · '+snapshot.regions.filter(r=>r.statistics.count>0).length+' gateways responded';
 }catch(error){
  if(active===current)$('progress').textContent='Lookup interrupted. Click Restart lookup to try again.';
 }finally{if(active===current)active=null;}
}
$('start').onclick=start;
$('exportBtn').onclick=()=>{
 if(!report?.regions.length)return;
 const url=URL.createObjectURL(new Blob([JSON.stringify({...report,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='avd-regions-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
$('year').textContent=new Date().getFullYear();start();
