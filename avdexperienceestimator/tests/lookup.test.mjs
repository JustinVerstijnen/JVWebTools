import {test} from 'node:test';
import assert from 'node:assert/strict';
import {availableRegions,latencyEstimateFromHttpsRtt,runPool,sortResults} from '../assets/lookup.mjs';
import {regions} from '../assets/regions.mjs';

test('Default region list contains five configured endpoints and full list never includes an absent URL',()=>{
 const all=availableRegions(regions);
 assert.equal(all.slice(0,5).length,5);
 assert.ok(all.every(r=>r.url && r.url.startsWith('https://')));
 assert.ok(all.length>5);
 assert.ok(all.length<regions.length);
});

test('Sort by name and by either metric, while keeping missing timings at the end',()=>{
 const list=[{id:'a',name:'Zeta'},{id:'b',name:'Alpha'},{id:'c',name:'Beta'}];
 const values=new Map([['a',{rttHttpsMs:100,latencyEstimateMs:50}],['b',{rttHttpsMs:20,latencyEstimateMs:10}],['c',{rttHttpsMs:null,latencyEstimateMs:null}]]);
 assert.deepEqual(sortResults(list,values,'region','asc').map(r=>r.id),['b','c','a']);
 assert.deepEqual(sortResults(list,values,'region','desc').map(r=>r.id),['a','c','b']);
 assert.deepEqual(sortResults(list,values,'rtt','asc').map(r=>r.id),['b','a','c']);
 assert.deepEqual(sortResults(list,values,'latency','desc').map(r=>r.id),['a','b','c']);
 assert.deepEqual(list.map(r=>r.id),['a','b','c']);
});

test('Latency half RTT is explicitly an estimate, with null preserved',()=>{
 assert.equal(latencyEstimateFromHttpsRtt(45),22.5);
 assert.equal(latencyEstimateFromHttpsRtt(null),null);
});

test('Worker pool executes multiple regions simultaneously without exceeding the limit',async()=>{
 const controller=new AbortController();
 let running=0, peak=0;
 const seen=[];
 await runPool([0,1,2,3,4,5,6],3,async item=>{
  running++; peak=Math.max(running,peak);
  seen.push(item);
  await new Promise(resolve=>setTimeout(resolve,8));
  running--;
 },controller.signal);
 assert.equal(peak,3);
 assert.deepEqual(seen.sort((a,b)=>a-b),[0,1,2,3,4,5,6]);
});

test('Aborted worker pool does not schedule extra regions',async()=>{
 const controller=new AbortController();
 const seen=[];
 await runPool([0,1,2,3],2,async id=>{
  seen.push(id);
  controller.abort();
 },controller.signal);
 assert.ok(seen.length<=2);
});
