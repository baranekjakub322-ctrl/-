// Activity identities and append-only audit; no planned workout enters this store.
export const DAY=86400000;
export const clone=x=>structuredClone(x);
export const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
export const isDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
export const dayDiff=(a,b)=>Math.round((Date.parse(b)-Date.parse(a))/DAY);
export const addDate=(d,n)=>new Date(Date.parse(d)+n*DAY).toISOString().slice(0,10);
const fail=s=>{throw new Error(s);};
export function validTimeZone(zone){try{new Intl.DateTimeFormat('en',{timeZone:zone}).format(0);return typeof zone==='string'&&zone.length>0;}catch{return false;}}
const hash=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');};
function normalise(raw,today,defaultZone='UTC',fixedId=null){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))fail('Aktywność musi być obiektem.');
 const o=clone(raw);delete o.op;delete o.reason;
 if(o.timeZone!=null&&!validTimeZone(o.timeZone))fail('Nieprawidłowa strefa czasowa aktywności.');
 if(o.startedAt!=null){
  if(typeof o.startedAt!=='string'||!isDate(o.startedAt.slice(0,10))||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(o.startedAt)||!Number.isFinite(Date.parse(o.startedAt)))fail('startedAt wymaga pełnego czasu ISO z offsetem lub Z.');
  o.startedAt=new Date(o.startedAt).toISOString();o.timeZone=o.timeZone||defaultZone;
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:o.timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(o.startedAt)),value=k=>parts.find(p=>p.type===k).value;
  o.date=`${value('year')}-${value('month')}-${value('day')}`;
 }
 if(!isDate(o.date)||o.date>today)fail('Data wykonania musi istnieć i nie może być przyszła.');
 if(!['done','missed','shortened'].includes(o.status))fail('Status aktywności: done/missed/shortened.');
 for(const [k,a,b]of [['distanceKm',0,100],['durationMin',0,1000],['rpe',1,10],['fatigue',1,5],['pain',0,10]])if(o[k]!=null&&(typeof o[k]!=='number'||!Number.isFinite(o[k])||o[k]<a||o[k]>b))fail(`Nieprawidłowe pole aktywności: ${k}.`);
 if(o.status!=='missed'&&(o.distanceKm==null||o.durationMin==null))fail('Wykonanie wymaga rzeczywistego dystansu i czasu.');
 if(o.distanceKm>0&&o.durationMin===0)fail('Dodatni dystans wymaga dodatniego czasu.');
 if(o.distanceKm>0 && o.durationMin>0 && (o.durationMin/o.distanceKm<1.5 || o.durationMin/o.distanceKm>30))fail('Niespójny dystans i czas aktywności; sprawdź jednostki.');
 for(const k of ['activeInjury','reducedIntensity'])if(o[k]!=null&&typeof o[k]!=='boolean')fail(`${k} musi być logiczne.`);
 if(o.sessionType!=null&&!['easy','long','threshold','interval','race','test','recovery'].includes(o.sessionType))fail('Nieprawidłowy rodzaj wykonanej sesji.');
 if(o.status==='missed'&&o.testResult)fail('Pominięcie nie jest wykonanym testem.');
 if(o.testResult&&(!Number.isFinite(o.testResult.distanceKm)||o.testResult.distanceKm<.1||o.testResult.distanceKm>100||!Number.isFinite(o.testResult.timeSec)||o.testResult.timeSec<=0||o.testResult.timeSec>86400))fail('Nieprawidłowy wynik testu.');
 if(o.id!=null&&(typeof o.id!=='string'||!o.id.trim()||o.id.length>160))fail('id aktywności musi być niepustym tekstem do 160 znaków.');
 if(o.externalId!=null&&(!['string','number'].includes(typeof o.externalId)||typeof o.externalId==='number'&&!Number.isFinite(o.externalId)))fail('externalId musi być tekstem lub liczbą.');
 if(o.source!=null&&(typeof o.source!=='string'||!o.source.trim()||o.source.length>80))fail('Nieprawidłowe źródło importu.');
 const source=encodeURIComponent(String(o.source||'import'));
 o.id=fixedId||o.id||(o.externalId!=null?`external:${source}:${encodeURIComponent(String(o.externalId))}`:o.startedAt?`instant:${source}:${o.startedAt}`:`legacy:${o.date}`);
 // Hash is a compact diagnostic fingerprint, never the sole identity/duplicate check.
 o.fingerprint=hash(stable({...o,id:undefined,fingerprint:undefined,timeZone:undefined,date:o.startedAt?undefined:o.date}));
 return o;
}
const semantic=o=>{const p={...o};delete p.fingerprint;if(p.startedAt){delete p.timeZone;delete p.date;}return stable(p);};
export function processActivityLedger(previous={},events=[],today,options={}){
 try{
  if(!isDate(today)||!Array.isArray(events)||!validTimeZone(options.timeZone||'UTC'))fail('Nieprawidłowa lista aktywności, data lub strefa czasowa.');
  const store=clone(previous.activityStore||[]),audit=clone(previous.activityAudit||[]),map=new Map(store.map(r=>[r.id,r])),seen=new Set();let changed=false;
  for(const raw of events){
   if(!raw||typeof raw!=='object')fail('Aktywność musi być obiektem.');
   const op=raw.op||'add';
   if(!['add','correct','cancel','restore'].includes(op))fail('Nieznana operacja aktywności.');
   const addition=op==='add'?normalise(raw,today,options.timeZone||'UTC'):null;
   const id=addition?.id||raw.id;
   if(typeof id!=='string'||!id)fail('Operacja wymaga id aktywności.');
   if(seen.has(id))fail('Duplikat id w jednej partii; połącz operacje.');seen.add(id);
   let row=map.get(id);const before=row?clone(row):null;
   if(op==='add'){
    const current=addition;
    if(row){if(row.cancelled)continue;if(semantic(row.current)===semantic(current))continue;fail('Konflikt zapisanej aktywności: użyj op correct, bez nadpisywania historii.');}
    row={id,original:clone(raw),current,cancelled:false,version:1};store.push(row);map.set(id,row);
   }else{
    if(!row)fail('Nie znaleziono aktywności do korekty/anulowania.');
    if(op==='correct'){
     if(!raw.changes||typeof raw.changes!=='object'||Array.isArray(raw.changes)||'id' in raw.changes||'op' in raw.changes)fail('Korekta wymaga changes i nie zmienia id.');
     const current=normalise({...row.current,...clone(raw.changes)},today,options.timeZone||'UTC',id);
     if(stable(current)===stable(row.current))continue;row.current=current;
    }else {const cancelled=op==='cancel';if(row.cancelled===cancelled)continue;row.cancelled=cancelled;}
    row.version++;
   }
   changed=true;audit.push({sequence:audit.length+1,date:today,id,op,reason:raw.reason||null,before,after:clone(row)});
  }
  const active=store.filter(r=>!r.cancelled).map(r=>clone(r.current)).sort((a,b)=>a.date.localeCompare(b.date)||(a.startedAt||'').localeCompare(b.startedAt||'')||a.id.localeCompare(b.id));
  return {ok:true,activityStore:store,activityAudit:audit,observations:active,completedHistory:active.filter(o=>o.status!=='missed'),changed};
 }catch(e){return {ok:false,bledy:[e.message],komunikat:e.message};}
}

// A date-only symptom report has no trustworthy intra-day order. Use the more conservative state.
export function latestSymptom(rows=[]){
 const symptoms=rows.filter(o=>o&&(o.pain!=null||o.activeInjury!=null));if(!symptoms.length)return null;
 if(symptoms.every(o=>o.startedAt))return symptoms.slice().sort((a,b)=>Date.parse(a.startedAt)-Date.parse(b.startedAt)||Number(!!a.activeInjury)-Number(!!b.activeInjury)||(a.pain||0)-(b.pain||0)).at(-1);
 const date=symptoms.map(o=>o.date).sort().at(-1);
 return symptoms.filter(o=>o.date===date).sort((a,b)=>Number(!!a.activeInjury)-Number(!!b.activeInjury)||(a.pain||0)-(b.pain||0)).at(-1);
}
