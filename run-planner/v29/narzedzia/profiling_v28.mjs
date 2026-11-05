// Additional measured operations, separate from registered test counts.
import fs from 'node:fs';import {performance} from 'node:perf_hooks';
import * as A from '../planGenerator_v27.js';import * as B from '../planGenerator_v28.js';
const out=process.env.WYNIKI||'wyniki_v28';fs.mkdirSync(out,{recursive:true});
const measure=(name,operation)=>{const rss=process.memoryUsage().rss,heap=process.memoryUsage().heapUsed,start=performance.now(),result=operation();if(!result.ok)throw Error(name+': '+JSON.stringify(result.bledy));return {name,elapsedMs:performance.now()-start,rssBefore:rss,rssAfter:process.memoryUsage().rss,heapBefore:heap,heapAfter:process.memoryUsage().heapUsed,completed:result.completedHistory.length};};
const imports=[];
for(const count of [100,1000,3000]){
 const events=Array.from({length:count},(_,n)=>({id:'bulk-'+n,startedAt:new Date(Date.parse('2020-01-01T06:00:00Z')+n*12*3600000).toISOString(),timeZone:'Europe/Warsaw',status:'done',distanceKm:5,durationMin:30,rpe:4}));
 imports.push({...measure('v27 strict '+count,()=>A.processActivities({},events,'2026-11-02')),version:'v27',count});
 imports.push({...measure('v28 strict '+count,()=>B.processActivities({},events,'2026-11-02')),version:'v28',count});
 const partial=[...events,{id:'invalid',date:'2026-11-01',status:'done',distanceKm:5}];
 imports.push({...measure('v28 quarantine '+count,()=>B.importActivities({},partial,'2026-11-02')),version:'v28',count:partial.length});
}
const input={today:'2026-11-02',age:35,level:'intermediate',currentWeeklyKm:35,longestRecentRun:14,bestResult:{distanceKm:10,timeSec:3120},goal:{type:'10k',raceDate:'2027-03-28'},daysPerWeek:3,availableDays:[0,1,2,3,4,5,6]},adaptation=[];
for(const count of [12,60,180]){
 const events=Array.from({length:count},(_,n)=>({id:'adapt-'+n,date:new Date(Date.parse('2027-01-09')-n*86400000).toISOString().slice(0,10),status:'done',distanceKm:5,durationMin:32,rpe:4,sessionType:'easy'}));
 for(const [version,G]of [['v27',A],['v28',B]]){const base=G.generatePlan(input);adaptation.push({...measure(version+' update '+count,()=>G.updatePlan(input,base,events,{today:'2027-01-10'})),version,count});}
}
const result={node:process.version,imports,adaptation,peakRssBytes:process.resourceUsage().maxRSS*1024,limitations:'Sequential cold/warm calls in one process; heap/RSS include retained runtime and JIT, not isolated object size. No SLA claim.'};
fs.writeFileSync(`${out}/performance-operations.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result));
