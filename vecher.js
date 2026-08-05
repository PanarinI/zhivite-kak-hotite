// ВЕЧЕР — эксперимент: движок не ВЫКЛАДЫВАЕТ правду в поступки, а ПРОЖИВАЕТ вечер тактами.
//
//   node vecher.js moskva 3        — прожить три вечера и напечатать, что в них случилось
//   node vecher.js moskva 1 7      — один вечер с сидом 7
//
// Разница с stanok.js принципиальная. Там правда логически разворачивалась в четыре
// независимых поступка — ничего не происходило, реконструировать было нечего, кроме анкеты.
// Здесь поступок одного человека становится ПОЛОЖЕНИЕМ для другого, а рубец искажает не только
// поведение, но и ЧТЕНИЕ чужого поступка. Из этого сама собой растёт цепь недоразумений,
// где каждое звено объяснимо, и обе стороны правы. Драма не написана — она случилась.

const path = require('path');
const MIR_ID = process.argv[2] || "moskva";
const M = require(path.join(__dirname, 'miry', MIR_ID + '.js'));

const NUZHDY = ["голод","признание","принадлежность","смысл","автономия"];
const RUBTSY = ["утрата дитяти","предательство близкого","публичный позор","голодная зима","изгнание"];

function rod(t, g){ return String(t).replace(/\{([^|}]*)\|([^}]*)\}/g, (m,a,b)=> g === "ч" ? b : a); }
function bio(r){ return Array.isArray(M.RW[r]) ? M.RW[r] : [{ txt:M.RW[r], v:null }]; }
function behave(need, scar, situ){
  const s = M.SCAR[scar];
  return (s && s[situ]) ? s[situ] : M.ACT[need][situ];
}
function deviaciya(scar, situ){ return !!(M.SCAR[scar] && M.SCAR[scar][situ]); }

// ── ТОН ПОСТУПКА: чем он выглядит со стороны ────────────────────────────────
// Тон — не оценка, а направление жеста. Его видят все; правду за ним — никто.
const TON_NEED = {
  "голод":"берущий", "признание":"напоказ", "принадлежность":"к тебе",
  "смысл":"мимо", "автономия":"от тебя"
};
const TON_SCAR = {
  "утрата дитяти":"закрытый", "предательство близкого":"проверяющий",
  "публичный позор":"прячущий", "голодная зима":"хватающий", "изгнание":"уходящий"
};
function ton(need, scar, situ){
  return deviaciya(scar, situ) ? TON_SCAR[scar] : TON_NEED[need];
}

// ── ЧТЕНИЕ: рубец искажает не поведение, а ВОСПРИЯТИЕ чужого поступка ───────
// Это и есть источник драмы: она сделала одно, он увидел другое, и оба правы.
// Пусто — значит прочтено спокойно, как есть.
const READ = {
  "утрата дитяти": {
    "к тебе":     { kak:"жалеет меня, как больную", cena:-0.25 },
    "мимо":       { kak:"ей всё равно, что со мной", cena:-0.20 },
    "закрытый":   { kak:"она такая же, как я", cena:+0.30 }
  },
  "предательство близкого": {
    "напоказ":    { kak:"говорит одно, а делает другое", cena:-0.30 },
    "к тебе":     { kak:"подходит близко — значит, что-то ей нужно", cena:-0.25 },
    "проверяющий":{ kak:"меня сверяют, как чужую", cena:-0.20 }
  },
  "публичный позор": {
    "напоказ":    { kak:"сейчас на меня посмотрят и будут смеяться", cena:-0.35 },
    "проверяющий":{ kak:"при всех выясняет, будто я виновата", cena:-0.30 },
    "прячущий":   { kak:"ей тоже стыдно, значит я не одна", cena:+0.25 }
  },
  "голодная зима": {
    "берущий":    { kak:"забирает — значит мне не достанется", cena:-0.30 },
    "хватающий":  { kak:"такая же, как я — считает до копейки", cena:+0.20 },
    "напоказ":    { kak:"хвалится тем, что у неё есть", cena:-0.20 }
  },
  "изгнание": {
    "от тебя":    { kak:"меня опять выставляют", cena:-0.35 },
    "мимо":       { kak:"меня здесь не замечают", cena:-0.25 },
    "к тебе":     { kak:"зовут — но это ненадолго", cena:+0.10 },
    "уходящий":   { kak:"уходит первой, чтобы не уходить последней — как я", cena:+0.25 }
  }
};

// Срыв — не случайная девиация из таблицы, а собственный жест каждого рубца.
// То, что человек делает, когда накопленное перевесило.
const SRYV = {
  "утрата дитяти":"встаёт и уходит в комнату, не объяснив",
  "предательство близкого":"говорит вслух то, что копила месяц, и не смягчает",
  "публичный позор":"замолкает совсем и до конца вечера не отвечает",
  "голодная зима":"пересчитывает вслух, кто сколько внёс",
  "изгнание":"одевается и уходит, не прощаясь"
};

function mul(s){ return function(){ s|=0; s=s+0x6D2B79F5|0; let t=Math.imul(s^s>>>15,1|s);
  t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

// ── ПРОЖИТЬ ВЕЧЕР ───────────────────────────────────────────────────────────
function vecher(seed){
  const rnd = mul(seed);
  const povod = M.POVODY[Math.floor(rnd() * M.POVODY.length)];
  const para  = M.PARY[Math.floor(rnd() * M.PARY.length)];

  const dushi = [para.a, para.b].map(p => {
    const scar = RUBTSY[Math.floor(rnd() * 5)];
    const bi = Math.floor(rnd() * bio(scar).length);
    return {
      name: p.name, role: p.role, g: p.g,
      need: NUZHDY[Math.floor(rnd() * 5)], scar, bi,
      napryazhenie: 0.15 + rnd() * 0.2,   // с чем человек пришёл в этот вечер
      teplo: {},                           // отношение к другим
      sorvalas: false
    };
  });
  dushi.forEach(d => dushi.forEach(o => { if (o !== d) d.teplo[o.name] = 0.35 + rnd() * 0.2; }));

  const hronika = [];   // ЧТО ПРОИЗОШЛО — то, что игроку предстоит реконструировать
  const pool = [...povod.situ];
  let takt = 0, konec = null;

  while (pool.length && !konec){
    takt++;
    // Положение вечера. Первое задаёт повод, дальше — что подвернулось.
    const situ = takt === 1 ? pool.shift() : pool.splice(Math.floor(rnd() * pool.length), 1)[0];
    const sobytiya = [];

    for (const d of dushi){
      if (d.sorvalas) continue;

      // СРЫВ: когда напряжение перевалило, человек показывает рубец даже там,
      // где обычно держится. Это не случайность — это накопленное.
      const sryv = d.napryazhenie > 0.72 && !deviaciya(d.scar, situ);
      const postupok = sryv ? SRYV[d.scar] : rod(behave(d.need, d.scar, situ), d.g);
      const t = sryv ? TON_SCAR[d.scar] : ton(d.need, d.scar, situ);

      const zapis = { kto: d.name, postupok, ton: t, sryv, chteniya: [] };

      // Остальные ВИДЯТ поступок — и читают его через свой рубец
      for (const o of dushi){
        if (o === d || o.sorvalas) continue;
        const r = (READ[o.scar] || {})[t];
        if (r){
          o.teplo[d.name] += r.cena;
          o.napryazhenie += r.cena < 0 ? -r.cena * 0.9 : -0.08;
          zapis.chteniya.push({ kto: o.name, kak: r.kak, cena: r.cena });
        } else {
          o.napryazhenie -= 0.04;   // спокойно прочитанное чуть отпускает
        }
        o.napryazhenie = Math.max(0, Math.min(1, o.napryazhenie));
        o.teplo[d.name] = Math.max(-1, Math.min(1, o.teplo[d.name]));
      }

      if (sryv){ d.sorvalas = true; d.napryazhenie = Math.min(1, d.napryazhenie + 0.1); }
      sobytiya.push(zapis);
    }

    hronika.push({ takt, situ, kadr: M.SITU[situ], sobytiya });

    // Вечер кончается сам: кто-то сорвался, или тепло провалилось
    const kto_sorvalsya = dushi.find(d => d.sorvalas);
    const holod = dushi.find(d => Object.values(d.teplo).some(v => v < -0.15));
    if (kto_sorvalsya) konec = { tip:"срыв", kto: kto_sorvalsya.name };
    else if (holod)    konec = { tip:"холод", kto: holod.name };
  }
  if (!konec) konec = { tip:"обошлось" };

  return { seed, povod, dushi, hronika, konec };
}

// ── ПЕЧАТЬ: не протокол, а то, что случилось ────────────────────────────────
function pechat(v){
  console.log(`\n${'═'.repeat(78)}`);
  console.log(`ВЕЧЕР · сид ${v.seed} · ${v.povod.txt}`);
  console.log(`${v.dushi.map(d => `${d.name} (${d.role})`).join('  ·  ')}`);
  console.log('─'.repeat(78));

  for (const t of v.hronika){
    console.log(`\n  ${t.kadr.toUpperCase()}`);
    for (const s of t.sobytiya){
      const eho = t.sobytiya.indexOf(s) > 0 && t.sobytiya[t.sobytiya.indexOf(s)-1].postupok === s.postupok;
      console.log(`    ${s.kto}: ${eho ? 'то же самое, слово в слово' : s.postupok}${s.sryv ? '   ← СОРВАЛАСЬ' : ''}`);
      for (const c of s.chteniya)
        console.log(`        ${c.kto} видит это и понимает так: «${c.kak}»${c.cena < 0 ? '  ↓' : '  ↑'}`);
    }
  }

  console.log(`\n  ── чем кончилось: ${v.konec.tip === 'срыв' ? v.konec.kto + ' сорвалась' :
    v.konec.tip === 'холод' ? 'между ними стало холодно' : 'обошлось'} ──`);
  for (const d of v.dushi){
    const про = Object.entries(d.teplo).map(([k, val]) => `${k}: ${val >= 0 ? '+' : ''}${val.toFixed(2)}`).join(', ');
    console.log(`  ${d.name} — напряжение ${d.napryazhenie.toFixed(2)}; ${про}`);
    console.log(`      (скрыто: боится ${rod(M.NW[d.need], d.g)}, ${rod(bio(d.scar)[d.bi].txt, d.g)})`);
  }

  // ЧТО РЕКОНСТРУИРУЕТ ИГРОК: он видит поступки, но НЕ видит прочтений.
  const povorot = v.hronika.flatMap(t => t.sobytiya.flatMap(s =>
    s.chteniya.filter(c => c.cena < -0.24).map(c => ({ takt: t.kadr, kto: s.kto, postupok: s.postupok, chital: c.kto, kak: c.kak }))));
  if (povorot.length){
    console.log(`\n  ── узел вечера (игроку НЕ показывается) ──`);
    const p = povorot[0];
    console.log(`  ${p.kto} просто ${p.postupok}. ${p.chital} поняла это как «${p.kak}» — и с этого всё пошло.`);
  }
}

const N = Number(process.argv[3] || 3);
const SEED0 = Number(process.argv[4] || 0);
console.log(`ВЕЧЕРА · мир: ${M.nazva} · прожито: ${N}`);
const vse = [];
for (let i = 0; i < N; i++) vse.push(vecher(SEED0 ? SEED0 : 400 + i * 13));
vse.forEach(pechat);

const kon = vse.reduce((m, v) => (m[v.konec.tip] = (m[v.konec.tip] || 0) + 1, m), {});
const uzly = vse.filter(v => v.hronika.some(t => t.sobytiya.some(s => s.chteniya.some(c => c.cena < -0.24)))).length;
console.log(`\n${'═'.repeat(78)}`);
console.log(`ИТОГ: ${JSON.stringify(kon)} · вечеров с узлом недоразумения: ${uzly}/${N}`);
