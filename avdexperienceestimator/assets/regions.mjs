// Public Azure region list checked 2026-10-28. Enabled gateways returned HTTP 200
// and a matching RegionUrl during verification; they are not a contractual API.
const entries=[
 ['weu','West Europe','Europe','Netherlands'],['neu','North Europe','Europe','Ireland'],
 ['cus','Central US','United States','Iowa'],['eus','East US','United States','Virginia'],['eus2','East US 2','United States','Virginia'],['ncus','North Central US','United States','Illinois'],['scus','South Central US','United States','Texas'],['wcus','West Central US','United States','Wyoming'],['wus','West US','United States','California'],['wus2','West US 2','United States','Washington'],['wus3','West US 3','United States','Arizona'],
 ['eas','East Asia','Asia','Hong Kong'],['seas','Southeast Asia','Asia','Singapore'],['cin','Central India','Asia','Pune'],['sin','South India','Asia','Chennai'],['win','West India','Asia','Mumbai'],['jpe','Japan East','Asia','Tokyo / Saitama'],['jpw','Japan West','Asia','Osaka'],['krc','Korea Central','Asia','Seoul'],['krs','Korea South','Asia','Busan'],
 ['indiasouthcentral','India South Central','Asia','Hyderabad',false],['indonesiacentral','Indonesia Central','Asia','Jakarta',false],['malaysiawest','Malaysia West','Asia','Kuala Lumpur',false],['southeastasia3','Southeast Asia 3','Asia','Johor Bahru',false,'Preview / announced'],['taiwannorth','Taiwan North','Asia','Taipei',false,'Preview / announced'],['taiwannorthwest','Taiwan Northwest','Asia','Taiwan',false,'Paired region; restricted access'],
 ['ilc','Israel Central','Western Asia','Israel'],['qatarcentral','Qatar Central','Western Asia','Doha',false],['uaen','UAE North','Western Asia','Dubai'],['uaec','UAE Central','Western Asia','Abu Dhabi']
];
export const regions=entries.map(([id,name,group,location,available=true,note=''])=>({id,name,group,location,note,url:available?`https://rdgateway-${id}-r1.wvd.microsoft.com/api/health`:null,verifiedAt:available?'2026-10-28':null}));
export function selectedRegions(ids){return regions.filter(r=>ids.has(r.id));}
export function rankedRegions(list,results,sort,stats){return [...list].sort((a,b)=>sort==='latency'?((stats(results[a.id]?.samples||[]).median??Infinity)-(stats(results[b.id]?.samples||[]).median??Infinity))||a.name.localeCompare(b.name):0);}

