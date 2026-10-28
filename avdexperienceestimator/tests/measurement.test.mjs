import {test} from 'node:test';
import assert from 'node:assert/strict';
import {statistics,probe} from '../assets/measurement.mjs';
test('Failures never become zero-latency samples; medians and range remain correct',()=>{
 assert.deepEqual(statistics([{ms:null},{ms:20},{ms:100},{ms:40}]),{median:40,min:20,max:100,variation:80,count:3});
 assert.equal(statistics([{ms:20},{ms:40}]).median,30);
 assert.equal(statistics([{ms:null}]).median,null);
});
test('Opaque responses never imply HTTP success, credentials and cache disabled',async()=>{
 const original=globalThis.fetch;
 globalThis.fetch=async(url,options)=>{assert.equal(options.credentials,'omit');assert.equal(options.cache,'no-store');assert.equal(options.mode,'no-cors');assert.ok(url.searchParams.has('_avdpulse'));return {type:'opaque'};};
 try{const r=await probe({url:'https://example.com/ping'},new AbortController().signal);assert.equal(r.result,'opaque');assert.equal(r.httpStatus,null);assert.ok(r.ms>=0);}finally{globalThis.fetch=original;}
});
test('Network rejection yields no latency and cancellation sends no request',async()=>{
 const original=globalThis.fetch;let called=0;globalThis.fetch=async()=>{called++;throw new TypeError('failed');};
 try{assert.deepEqual(await probe({url:'https://example.com'},new AbortController().signal),{ms:null,result:'blocked-or-network'});const c=new AbortController();c.abort();assert.deepEqual(await probe({url:'https://example.com'},c.signal),{ms:null,result:'cancelled'});assert.equal(called,1);}finally{globalThis.fetch=original;}
});
test('Readable error responses retain actual HTTP status',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>({type:'cors',status:503,ok:false,arrayBuffer:async()=>new ArrayBuffer(0)});
 try{const r=await probe({url:'https://example.com'},new AbortController().signal,'cors');assert.equal(r.result,'http-error');assert.equal(r.httpStatus,503);}finally{globalThis.fetch=original;}
});
