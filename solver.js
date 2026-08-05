// Солвер — тяжёлый прогон в терминале (node solver.js).
// Тот же движок, что в solver.html, но испытаний в сотни раз больше:
// браузер вешал страницу на 14 прогонах, node тянет тысячи.

const NUZHDY=["голод","признание","принадлежность","смысл","автономия"];
const RUBTSY=["утрата дитяти","предательство близкого","публичный позор","голодная зима","изгнание"];
const SITU=["скудная вода","общий стол","пришёл чужой","дитя больно","чужой дар","старший велит","долгий пост","праздник"];
const DAYS=8, H=15625;

const NB={ "голод":{0:.55,1:.50}, "признание":{5:.60,0:.10}, "принадлежность":{2:.60,1:.20},
           "смысл":{4:.60,3:.15}, "автономия":{3:.55,4:.20,2:-.20} };
const SB={ "утрата дитяти":{"дитя больно":{0:1.2},"общий стол":{3:.8}},
           "предательство близкого":{"пришёл чужой":{3:1.0},"чужой дар":{4:1.0}},
           "публичный позор":{"общий стол":{4:1.0},"старший велит":{4:.9}},
           "голодная зима":{"скудная вода":{0:1.1},"чужой дар":{0:.9}},
           "изгнание":{"пришёл чужой":{3:1.0},"общий стол":{3:.9},"праздник":{3:1.0}} };
const MB={ "утрата дитяти":{0:"хватая",3:"не взглянув на детей"},
           "предательство близкого":{2:"глядя в сторону",1:"через силу"},
           "публичный позор":{4:"не поднимая глаз",1:"едва слышно"},
           "голодная зима":{0:"жадно, себе за пазуху",2:"отмерив ровно половину"},
           "изгнание":{3:"первой, не прощаясь",4:"как чужая"} };

function fresh(a,b){ a[b]=.30;a[b+1]=.32;a[b+2]=.28; for(let k=3;k<12;k++)a[b+k]=0; }

function dayEvents(t0,t1,t2,S,base,d,rich){
  const tr=[t0,t1,t2], situ=SITU[d]; let ev="";
  for(let i=0;i<3;i++){
    let j=(i+1+(d%2))%3; if(j===i)j=(i+2)%3;
    const nd=NUZHDY[(tr[i]/5)|0], sc=RUBTSY[tr[i]%5];
    const read=S[base+3+i*3+j], press=S[base+i];
    let s=[0,0,0,0,0,0];
    const nb=NB[nd]; for(const k in nb) s[k]+=nb[k];
    const sb=SB[sc][situ]; if(sb) for(const k in sb) s[k]+=sb[k];
    s[0]+=press*0.9-read*1.0; s[1]+=press*0.6+read*0.3; s[2]+=(1-press)*0.7+read*0.9;
    s[3]+=-read*0.35; s[4]+=0.05; s[5]+=read*0.1;
    if(situ==="скудная вода"||situ==="долгий пост"){ s[0]+=0.35; s[2]-=0.30; }
    if(situ==="праздник"){ s[2]+=0.25; s[5]+=0.20; }
    let b=0; for(let v=1;v<6;v++) if(s[v]>s[b]+1e-9) b=v;
    ev += i+","+b+","+j;
    if(rich){ const m=MB[sc]; ev += (m&&m[b])? ","+m[b] : ",-"; }
    ev += ";";
    if(b===0){ S[base+i]=Math.max(0,S[base+i]-.28); S[base+j]=Math.min(1,S[base+j]+.20);
               S[base+3+j*3+i]-=.40; S[base+3+i*3+j]-=.10; }
    else if(b===2){ S[base+i]=Math.min(1,S[base+i]+.06); S[base+j]=Math.max(0,S[base+j]-.14);
               S[base+3+j*3+i]+=.28; S[base+3+i*3+j]+=.18; }
    else if(b===1){ if(S[base+3+j*3+i]>.1){ S[base+i]=Math.max(0,S[base+i]-.15); S[base+3+i*3+j]+=.10; }
                    else S[base+3+i*3+j]-=.05; }
    else if(b===3){ S[base+3+i*3+j]-=.08; }
    S[base+i]=Math.min(1,S[base+i]+.05);
  }
  return ev;
}

function mul(s){ return function(){ s|=0; s=s+0x6D2B79F5|0; let t=Math.imul(s^s>>>15,1|s);
  t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

const HS=new Float64Array(H*12), TS=new Float64Array(12), tmp=new Float64Array(12);
let alive=new Int32Array(H), next=new Int32Array(H);

function trial(truth,rich,mode,rnd){
  let nA=H; for(let q=0;q<H;q++) alive[q]=q;
  for(let q=0;q<H;q++) fresh(HS,q*12);
  fresh(TS,0);
  let order=[...Array(DAYS).keys()];
  if(mode===0) for(let i=order.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
  const used={};
  for(let step=0; step<DAYS; step++){
    let pick;
    if(mode===0) pick=order[step];
    else {
      let bestD=-1,bestScore=1e18;
      for(let cand=0;cand<DAYS;cand++){
        if(used[cand]) continue;
        const groups=new Map(); let worst=0;
        for(let w=0;w<nA;w++){
          const h=alive[w], bs=h*12;
          for(let c=0;c<12;c++) tmp[c]=HS[bs+c];
          const sg=dayEvents((h/625)|0,((h/25)|0)%25,h%25,tmp,0,cand,rich);
          const g=(groups.get(sg)||0)+1; groups.set(sg,g); if(g>worst) worst=g;
        }
        if(worst<bestScore){ bestScore=worst; bestD=cand; }
      }
      pick=bestD;
    }
    used[pick]=1;
    const truthEv=dayEvents((truth/625)|0,((truth/25)|0)%25,truth%25,TS,0,pick,rich);
    let nn=0;
    for(let w=0;w<nA;w++){
      const h=alive[w], bs=h*12;
      if(dayEvents((h/625)|0,((h/25)|0)%25,h%25,HS,bs,pick,rich)===truthEv) next[nn++]=h;
    }
    for(let k=0;k<nn;k++) alive[k]=next[k];
    nA=nn;
    if(nA===1) return {solved:step+1,left:1};
  }
  return {solved:0,left:nA};
}

const TRIALS = Number(process.argv[2] || 200);
const cfg=[
  {name:"1 · грубый поступок, положения своим чередом", rich:false, mode:0},
  {name:"2 · + МАНЕРА поступка",                        rich:true,  mode:0},
  {name:"3 · + ПРОВОКАЦИЯ (движок ведёт, куда больно)", rich:true,  mode:1}
];

console.log(`пространство: ${H} гипотез · дней: ${DAYS} · испытаний на конфигурацию: ${TRIALS}\n`);
for(let c=0;c<cfg.length;c++){
  const r=mul(777+c*13); let solved=0, days=0, left=[], t0=Date.now();
  for(let t=0;t<TRIALS;t++){
    const res=trial(Math.floor(r()*H),cfg[c].rich,cfg[c].mode,r);
    if(res.solved){ solved++; days+=res.solved; } else left.push(res.left);
  }
  left.sort((a,b)=>a-b);
  const med = left.length? left[Math.floor(left.length/2)] : 0;
  console.log(`КОНФИГУРАЦИЯ ${cfg[c].name}`);
  console.log(`   решено однозначно: ${solved}/${TRIALS} = ${(solved/TRIALS*100).toFixed(1)}%   ${"█".repeat(Math.round(solved/TRIALS*40))}`);
  console.log(`   средняя длина дела: ${solved?(days/solved).toFixed(2)+" дн.":"—"}`);
  console.log(`   когда не решено — остаток гипотез: медиана ${med}, минимум ${left[0]||"—"}, максимум ${left[left.length-1]||"—"}`);
  console.log(`   доля «почти решено» (осталось ≤3): ${left.length?Math.round(left.filter(x=>x<=3).length/left.length*100):0}% от нерешённых`);
  console.log(`   время: ${((Date.now()-t0)/1000).toFixed(1)} с\n`);
}
