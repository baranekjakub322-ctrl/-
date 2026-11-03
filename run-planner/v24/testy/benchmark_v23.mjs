// Handcrafted fixtures, independent of both generators. Every corruption is explicit.
export const add=(s,n)=>new Date(Date.parse(s+'T00:00:00Z')+n*86400000).toISOString().slice(0,10);
const clone=x=>JSON.parse(JSON.stringify(x));
const simple=(date,km,kind='latwy',deload=false)=>({data:date,podtyp:kind,typ:kind==='dlugi'?'Długi bieg':'Bieg spokojny Z2',dystans_km:km,czas_min:km*6.5,tempo_zakres:'6:20-6:40',odciazenie:deload,kroki:[{etap:kind==='dlugi'?'Długi bieg ciągły':'Bieg spokojny',dystans_km:km,tempo:'6:20-6:40'}],intensywnosc:{priorytet:'RPE i aktualna forma'}});
function quality(date,k) {
 const metres=[600,800,800,1000,1000,1200,1200,1600][Math.min(k,7)],reps=metres>=1200?3:4;
 const work=reps*metres/1000,rest=(reps-1)*.3;
 return {data:date,podtyp:k%3===2?'tempo_startowe':'interwaly',typ:'Interwały',dystans_km:3+work+rest,czas_min:(3+rest)*6.5+work*5,tempo_zakres:'4:55-5:05',kroki:[{etap:'Rozgrzewka',dystans_km:1.5,tempo:'6:30'},{etap:'Część główna',powtorzenia:reps,dystans_m:metres,tempo:'5:00',przerwa:'90 s truchtu'},{etap:'Schłodzenie',dystans_km:1.5,tempo:'6:30'}],intensywnosc:{priorytet:'RPE i aktualna forma'}};
}
export function fixtures() {
 const input={today:'2026-11-02',age:35,level:'intermediate',currentWeeklyKm:25,longestRecentRun:10,daysPerWeek:3,availableDays:[0,1,2,3,4,5,6],experienceMonths:24,recentWeeklyKm:[23,25,24,25],bestResult:{distanceKm:10,timeSec:3120,date:'2026-10-18'},goal:{type:'10k',targetTimeSec:3000,raceDate:add('2026-11-02',83)}};
 const training=[];let count=0;
 for(let w=0;w<12;w++){
  const date=add(input.today,w*7),deload=w===3||w===7;
  if(w===11){training.push(simple(add(date,2),4),simple(add(date,4),3));continue;}
  if(w===0||deload){training.push(simple(add(date,2),deload?6:7,'latwy',deload),simple(add(date,4),deload?6:8,'latwy',deload),simple(add(date,6),deload?8:10,'dlugi',deload));continue;}
  const q=quality(add(date,2),count++);if(w===10){q.kroki[1].powtorzenia=3;q.dystans_km=3+3*q.kroki[1].dystans_m/1000+.6;q.czas_min=q.dystans_km*6;}
  training.push(q,simple(add(date,4),w===10?6:8),simple(add(date,6),w===10?9:Math.min(14,10+Math.floor(w/2)),'dlugi'));
 }
 const good={ok:true,wersja:'fixture',plan:{intencjaTreningowa:'poprawa'},treningi:training,tygodnie:[],ostrzezenia:[],wykonalnosc:{poziom:'pelna'}};
 const rows=[{name:'prawidlowy',input,plan:good}];
 const variant=(name,fn)=>{const r={name,input:clone(input),plan:clone(good)};fn(r);rows.push(r);};
 variant('zbyt_duzy_kilometraz',r=>{for(const t of r.plan.treningi.filter(t=>t.data<add(input.today,7))){t.dystans_km*=3;t.czas_min*=3;}});
 variant('bez_progresji',r=>{const q=r.plan.treningi.find(t=>t.podtyp==='interwaly');for(let i=0;i<r.plan.treningi.length;i++){const t=r.plan.treningi[i];if(['interwaly','tempo_startowe'].includes(t.podtyp))r.plan.treningi[i]={...clone(q),data:t.data};else if(t.podtyp==='dlugi')t.dystans_km=10;}});
 variant('monotonny',r=>{const q=r.plan.treningi.find(t=>t.podtyp==='interwaly');for(const t of r.plan.treningi.filter(t=>['interwaly','tempo_startowe'].includes(t.podtyp)))t.kroki=clone(q.kroki);});
 variant('nadmierna_intensywnosc',r=>{const q=r.plan.treningi.find(t=>t.podtyp==='interwaly');r.plan.treningi=r.plan.treningi.map(t=>({...clone(q),data:t.data}));});
 variant('nieprawidlowy_taper',r=>{for(const t of r.plan.treningi.filter(t=>t.data>=add(input.today,70))){t.dystans_km=15;t.czas_min=95;}});
 variant('niedopasowany_dystans',r=>{r.input.goal.type='marathon';r.input.goal.targetTimeSec=14400;});
 variant('niewykonalna_czestotliwosc',r=>{r.input.goal.type='marathon';r.input.goal.targetTimeSec=14400;r.input.daysPerWeek=1;r.plan.treningi=r.plan.treningi.filter(t=>new Date(t.data+'T00:00:00Z').getUTCDay()===0);});
 variant('niebezpieczny_powrot',r=>{r.input.breakDays=60;});
 return rows;
}
