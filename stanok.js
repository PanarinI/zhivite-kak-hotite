// СТАНОК — курируемая генерация дел.
// Движок порождает СКЕЛЕТ дела: правда · улики · разрешимость · фраза с дырами.
// Автор доводит ПЛОТЬ: дневник понимания и действия. Метод Поупа с лицами.
//
//   node stanok.js moskva 60              — 60 дел, ситуации выпадают своим чередом
//   node stanok.js moskva 60 provoke      — станок ведёт туда, где болит (авто-сложность)
//   node stanok.js moskva 60 provoke 1035 — плюс выложить дело с этим сидом для сцены
//
// Мир (язык, ситуации, поступки, люди) лежит в miry/<мир>.js и меняется целиком.
// Модель души — здесь, и она одна на все миры: 5 нужд × 5 рубцов = 25 объяснений.

const fs = require('fs');
const path = require('path');

const NUZHDY = ["голод","признание","принадлежность","смысл","автономия"];
const RUBTSY = ["утрата дитяти","предательство близкого","публичный позор","голодная зима","изгнание"];

// ── ЧТО МЫ СЧИТАЕМ ───────────────────────────────────────────────────────────
// У души есть скрытая правда — пара (нужда, рубец). Пар ровно 25, движок бросает
// жребий и запоминает одну. Игрок её не видит, но видит ПОСТУПКИ. Для каждой из
// 25 пар движок знает, как она повела бы себя в каждой ситуации. Увидев поступок,
// вычёркиваем все пары, которые повели бы себя иначе. 25 → 4 → 1 — это остаток.

const MIR_ID = process.argv[2] || "volyn";
const M = require(path.join(__dirname, 'miry', MIR_ID + '.js'));

function rod(t, g){ return String(t).replace(/\{([^|}]*)\|([^}]*)\}/g, (m,a,b)=> g === "ч" ? b : a); }

// Рубец перебивает нужду там, где болит. Это и есть девиация — самая говорящая улика.
function behave(need, scar, situ){
  const s = M.SCAR[scar];
  return (s && s[situ]) ? s[situ] : M.ACT[need][situ];
}

// ── РАЗРЕШИМОСТЬ ─────────────────────────────────────────────────────────────
// Гипотеза теперь тройка: нужда × рубец × БИОГРАФИЯ рубца (5 × 5 × 3 = 75).
// Поступки сужают до пары (нужда, рубец) — до трёх биографий; вещь в кадре называет,
// какая из трёх это была. Так вещи впервые получают работу, а дело удлиняется на шаг.
function bio(r){ return Array.isArray(M.RW[r]) ? M.RW[r] : [{ txt:M.RW[r], v:null }]; }

function survivors(seen, vesh){
  const out = [];
  for (const n of NUZHDY) for (const r of RUBTSY){
    let ok = true;
    for (const o of seen) if (behave(n, r, o.situ) !== o.act){ ok = false; break; }
    if (!ok) continue;
    bio(r).forEach((b, bi) => {
      if (vesh && b.v !== vesh) return;
      out.push([n, r, bi]);
    });
  }
  return out;
}

// Порядок наблюдений. mode "provoke" — станок ведёт туда, где болит:
// на каждом шаге берёт ситуацию, которая сильнее всего расщепляет остаток.
function razvedka(truth, situList, mode, rnd){
  const seen = [], krivaya = [survivors([]).length];
  let left = survivors([]);
  const pool = [...situList];
  while (pool.length){
    let pick;
    if (mode === "provoke"){
      let best = -1, bestWorst = 1e9;
      for (let i = 0; i < pool.length; i++){
        const groups = new Map();
        for (const [n, r] of left){
          const k = behave(n, r, pool[i]);
          groups.set(k, (groups.get(k) || 0) + 1);
        }
        let worst = 0;
        for (const v of groups.values()) if (v > worst) worst = v;
        if (worst < bestWorst){ bestWorst = worst; best = i; }
      }
      pick = best;
    } else {
      pick = Math.floor(rnd() * pool.length);
    }
    const situ = pool.splice(pick, 1)[0];
    seen.push({ situ, act: behave(truth.need, truth.scar, situ) });
    left = survivors(seen);
    krivaya.push(left.length);
    if (left.length === 1) break;
    // поступки исчерпали себя: остались одни биографии — их различает только вещь
    if (left.every(h => h[0] === left[0][0] && h[1] === left[0][1])) break;
  }
  // последний шаг дела — вещь в кадре, она называет биографию
  let veshShag = false;
  if (left.length > 1 && left.every(h => h[1] === left[0][1])){
    const v = bio(truth.scar)[truth.bi].v;
    if (v){ left = survivors(seen, v); krivaya.push(left.length); veshShag = true; }
  }
  return { seen, krivaya, left, veshShag };
}

// Дышит — решается, но не с первого взгляда: у игрока есть время подумать.
function verdikt(k, left){
  if (left.length > 1) return { z:"глухо", why:`осталось ${left.length} — рубец никто не задел` };
  if (k.length <= 2)   return { z:"мелко", why:"раскрылось за один шаг" };
  if (k[1] <= 3)       return { z:"мелко", why:"первый же взгляд почти всё сказал" };
  return { z:"дышит", why:`${k.length-1} шага, после первого оставалось ${k[1]}` };
}

// Фраза с дырами — движок строит её из своей же правды
function fraza(name, zavyazka, shablon){
  const t = shablon || { f1:" , потому что боится ", f2:", а ", f3:" научил видеть мир так." };
  return { f1: `${name} ${zavyazka}${t.f1}`, f2: t.f2, f3: t.f3 };
}

// ── СБОРКА ДЕЛА: вечер, две души, две линзы ──────────────────────────────────
function mul(s){ return function(){ s|=0; s=s+0x6D2B79F5|0; let t=Math.imul(s^s>>>15,1|s);
  t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

function delo(seed, mode){
  const rnd = mul(seed);
  const povod = M.POVODY[Math.floor(rnd() * M.POVODY.length)];
  const para  = M.PARY[Math.floor(rnd() * M.PARY.length)];
  const lensy = [];

  for (const [me, target] of [[para.a, para.b], [para.b, para.a]]){
    const scar = RUBTSY[Math.floor(rnd() * 5)];
    const truth = { need: NUZHDY[Math.floor(rnd() * 5)], scar,
                    bi: Math.floor(rnd() * bio(scar).length) };
    const razv = razvedka(truth, povod.situ, mode, rnd);
    const zavyazka = behave(truth.need, truth.scar, povod.situ[0]);
    const g = target.g;                       // распутываем ЦЕЛЬ — весь текст линзы про неё
    const f = fraza(target.name, rod(zavyazka, g), M.FRAZA);
    lensy.push({
      me: me.name, meRole: me.role, gMe: me.g,
      target: target.name, targetRole: target.role, gTarget: target.g,
      truth,
      pravda: `${rod(M.NW[truth.need], g)} × ${rod(bio(truth.scar)[truth.bi].txt, g)}`,
      zavyazka: `${M.SITU[povod.situ[0]]} — ${rod(zavyazka, g)}`,
      fraza: { f1: rod(f.f1, g), f2: rod(f.f2, g), f3: rod(f.f3, g) },
      slova: {   // банк слов для дырок: все 5 нужд и все 15 биографий — большинство лишние
        need: NUZHDY.map(n => rod(M.NW[n], g)),
        scar: RUBTSY.flatMap(r => bio(r).map(b => rod(b.txt, g)))
      },
      uliky: razv.seen.map(o => ({ situ:o.situ, kadr:M.SITU[o.situ], act:rod(o.act, g) })),
      // Всё, на что игрок МОЖЕТ посмотреть (разведка станка — только проверка,
      // порядок выбирает игрок). Плюс 25 гипотез с их поведением — чтобы сцена
      // считала остаток сама, не зная словаря. Дело самодостаточно.
      nabl: povod.situ.map(s => ({
        situ: s, kadr: M.SITU[s], zone: M.ZONA[s], act: rod(behave(truth.need, truth.scar, s), g)
      })),
      gipotezy: NUZHDY.flatMap(n => RUBTSY.flatMap(r => bio(r).map((b, bi) => ({
        n, r, bi, nw: rod(M.NW[n], g), rw: rod(b.txt, g),
        vesh: b.v ? rod(b.v, g) : null,          // вещь, которая называет ЭТУ биографию
        acts: Object.fromEntries(povod.situ.map(s => [s, rod(behave(n, r, s), g)]))
      })))),
      // Вещь рубца теперь УЛИКА (bio:true) — она различает три биографии одного рубца.
      // Остальные вещи по-прежнему немые: связь доплетает человек.
      rechi: [
        { zone: M.VESHCH_SCAR_ZONA || 'sunduk', txt: rod(bio(truth.scar)[truth.bi].v, g), bio: true },
        { zone: M.VESHCH_NEED[truth.need].z, txt: rod(M.VESHCH_NEED[truth.need].t, g) },
        (v => ({ zone: v.z, txt: rod(v.t, g) }))(M.VESHCH_OBSHCH[Math.floor(rnd() * M.VESHCH_OBSHCH.length)])
      ],
      krivaya: razv.krivaya,
      left: razv.left.map(p => `${rod(M.NW[p[0]], g)} + ${rod(bio(p[1])[p[2]].txt, g)}`),
      verdikt: verdikt(razv.krivaya, razv.left)
    });
  }

  return {
    mir: M.id, mesto: M.nazva,
    seed, povod: povod.txt, povodId: povod.id,
    hata: `${para.a.name} (${para.a.role}) ↔ ${para.b.name} (${para.b.role})`,
    lensy,
    godno: lensy.every(l => l.verdikt.z === "дышит"),
    // Дело интересно вдвойне, если правды душ не совпадают: две правоты, простого выбора нет
    dvePravoty: lensy[0].truth.need !== lensy[1].truth.need
  };
}

// ── ПЕЧАТЬ ДЛЯ АВТОРА — он читает и отбирает ─────────────────────────────────
function pechat(d, n){
  const mark = d.godno ? (d.dvePravoty ? "★" : "✓") : "·";
  console.log(`\n${mark} ДЕЛО ${n} · сид ${d.seed}`);
  console.log(`   вечер: ${d.povod}`);
  console.log(`   кто:   ${d.hata}`);
  for (const l of d.lensy){
    const v = l.verdikt;
    console.log(`   ── линза: ты ${l.me} (${l.meRole}) · перед тобой ${l.target} (${l.targetRole})`);
    console.log(`      правда: ${l.pravda}`);
    console.log(`      фраза:  ${l.fraza.f1}[ ]${l.fraza.f2}[ ]${l.fraza.f3}`);
    l.uliky.forEach((u, i) => console.log(`      ${i+1}. ${u.kadr}: ${u.act}   → осталось ${l.krivaya[i+1]}`));
    console.log(`      вещи:   ${l.rechi.map(r=>r.txt).join(' · ')}`);
    console.log(`      станок: ${v.z} — ${v.why}   [${l.krivaya.join(' → ')}]`);
    if (v.z === "глухо") console.log(`      остаток: ${l.left.slice(0,4).join(' | ')}`);
  }
}

// ── ПРОГОН ───────────────────────────────────────────────────────────────────
const N = Number(process.argv[3] || 30);
const MODE = process.argv[4] === "provoke" ? "provoke" : "чередом";

console.log(`СТАНОК · мир: ${M.nazva} (${M.mova}) · дел: ${N} · режим: ${MODE === "provoke" ? "станок ведёт туда, где болит" : "ситуации выпадают своим чередом"}`);
console.log(`словарь: 5 нужд × ${Object.keys(M.SITU).length} ситуаций = ${5*Object.keys(M.SITU).length} поступков + ${Object.values(M.SCAR).reduce((a,o)=>a+Object.keys(o).length,0)} рубцовых отклонений`);

const dela = [];
for (let i = 0; i < N; i++) dela.push(delo(1000 + i * 7, MODE));

const godnye = dela.filter(d => d.godno);
const brak   = dela.filter(d => !d.godno);
console.log(`\n══ ПОКАЗ: первые годные ══`);
godnye.slice(0, 4).forEach((d, i) => pechat(d, i + 1));
if (brak.length){ console.log(`\n══ ПОКАЗ: как выглядит брак ══`); pechat(brak[0], 0); }

const lensAll = dela.flatMap(d => d.lensy);
const cnt = z => lensAll.filter(l => l.verdikt.z === z).length;
const shagi = lensAll.filter(l => l.verdikt.z === "дышит").map(l => l.krivaya.length - 1);
const sred = shagi.length ? (shagi.reduce((a,b) => a+b, 0) / shagi.length).toFixed(2) : "—";

console.log(`\n══ ИТОГ ══`);
console.log(`линз всего: ${lensAll.length}`);
console.log(`   дышит: ${cnt("дышит")} (${(cnt("дышит")/lensAll.length*100).toFixed(0)}%)  ${"█".repeat(Math.round(cnt("дышит")/lensAll.length*40))}`);
console.log(`   мелко: ${cnt("мелко")} (${(cnt("мелко")/lensAll.length*100).toFixed(0)}%)`);
console.log(`   глухо: ${cnt("глухо")} (${(cnt("глухо")/lensAll.length*100).toFixed(0)}%)`);
console.log(`средняя длина дышащего дела: ${sred} шага`);
console.log(`ДЕЛ ЦЕЛИКОМ ГОДНЫХ (обе линзы дышат): ${godnye.length}/${N} = ${(godnye.length/N*100).toFixed(0)}%`);
console.log(`   из них две разные правды (нет простого выбора): ${godnye.filter(d=>d.dvePravoty).length}`);

// ── СКЛАД ────────────────────────────────────────────────────────────────────
const dir = path.join(__dirname, 'dela');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);
const file = path.join(dir, `urozhai-${M.id}-${MODE === "provoke" ? "provoke" : "cheredom"}.json`);
fs.writeFileSync(file, JSON.stringify({ mir: M.id, mode: MODE, vsego: N, godnyh: godnye.length, dela: godnye }, null, 1));
console.log(`\nгодные сложены: dela/${path.basename(file)}`);

// Отобранное дело выкладываем как скрипт: сцена открывается файлом,
// а fetch по file:// браузер не пустит.
const VYBOR = Number(process.argv[5] || 0);
if (VYBOR){
  const d = dela.find(x => x.seed === VYBOR);
  if (!d) console.log(`дела с сидом ${VYBOR} нет в этом урожае`);
  else {
    fs.writeFileSync(path.join(dir, `delo-${M.id}-${VYBOR}.js`),
      `// СКЕЛЕТ — породил станок (node stanok.js ${M.id} ${N} ${MODE} ${VYBOR}). Руками не править.\nwindow.DELO = ${JSON.stringify(d, null, 1)};\n`);
    console.log(`отобранное дело выложил: dela/delo-${M.id}-${VYBOR}.js`);
  }
}
