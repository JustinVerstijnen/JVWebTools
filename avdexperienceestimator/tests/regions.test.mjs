import {test} from 'node:test';
import assert from 'node:assert/strict';
import {regions,selectedRegions,rankedRegions} from '../assets/regions.mjs';
import {statistics} from '../assets/measurement.mjs';
test('All nine current public US regions and requested European regions are selectable',()=>{
 assert.deepEqual(regions.filter(r=>r.group==='United States').map(r=>r.name).sort(),['Central US','East US','East US 2','North Central US','South Central US','West Central US','West US','West US 2','West US 3']);
 assert.deepEqual(selectedRegions(new Set(['weu','neu'])).map(r=>r.name),['West Europe','North Europe']);
 assert.equal(selectedRegions(new Set()).length,0);
});
test('Unverified regions stay in the catalog without fabricated URLs',()=>{
 for(const id of ['malaysiawest','indiasouthcentral','indonesiacentral','qatarcentral'])assert.equal(regions.find(r=>r.id===id).url,null);
 assert.equal(new Set(regions.map(r=>r.id)).size,regions.length);
});
test('Ranking puts measured latency before absent data and does not mutate catalog',()=>{
 const list=selectedRegions(new Set(['weu','neu','cus']));const results={weu:{samples:[{ms:50}]},neu:{samples:[{ms:20}]}};
 assert.deepEqual(rankedRegions(list,results,'latency',statistics).map(r=>r.id),['neu','weu','cus']);
 assert.deepEqual(list.map(r=>r.id),['weu','neu','cus']);
});

