// ДВИЖОК ВЕЧЕРА для браузера. Сердце — из vecher.js, но теперь вечером управляет игрок:
// он решает состав, рассадку и темы, а дальше вечер идёт сам.
//
// Против «марионеток» здесь три вещи:
//   ЗАЩИТА — поступок в больном положении ВЫБИРАЕТСЯ (5 вариантов), а не выводится из нужды;
//   СИЛА РУБЦА — 0..1, у части людей раны нет вовсе, у каждого свой порог срыва;
//   СОСЕДСТВО — читают только соседи по столу; дальний не читает вовсе.
// Поэтому та же компания при другой рассадке даёт другой вечер.

(function(){
const NUZHDY = ["голод","признание","принадлежность","смысл","автономия"];
const RUBTSY = ["утрата дитяти","предательство близкого","публичный позор","голодная зима","изгнание"];

const TON_NEED = {
  "голод":"берущий", "признание":"напоказ", "принадлежность":"к тебе",
  "смысл":"мимо", "автономия":"от тебя"
};
const TON_SCAR = {
  "утрата дитяти":"закрытый", "предательство близкого":"проверяющий",
  "публичный позор":"прячущий", "голодная зима":"хватающий", "изгнание":"уходящий"
};

// Что человек в этом увидел × чем это ему грозит. Собирается из двух половин,
// поэтому одна и та же рана звучит по-разному у разных людей и с разными соседями.
const VIDIT = {
  "утрата дитяти":  { "к тебе":"жалеет меня", "мимо":"ей всё равно", "закрытый":"она такая же" },
  "предательство близкого": { "напоказ":"говорит одно, делает другое", "к тебе":"подходит — значит что-то нужно", "проверяющий":"меня сверяют" },
  "публичный позор":{ "напоказ":"сейчас будут смотреть", "проверяющий":"при всех выясняет", "прячущий":"ей тоже неловко" },
  "голодная зима":  { "берущий":"забирает", "хватающий":"считает, как я", "напоказ":"хвалится тем, что есть" },
  "изгнание":       { "от тебя":"отодвигается", "мимо":"меня не замечают", "к тебе":"зовут ненадолго", "уходящий":"уходит первой, как я" }
};
const GROZIT = {
  "утрата дитяти":["и сейчас начнёт про детей","и завтра будет то же","и никто не спросит, как я"],
  "предательство близкого":["и опять поверю","и это дойдёт до других","и я снова узнаю последней"],
  "публичный позор":["и снова при всех","и это запомнят","и мне потом это припомнят"],
  "голодная зима":["и мне не хватит","и придётся просить","и я опять буду считать"],
  "изгнание":["и меня опять выставят","и я тут лишняя","и лучше уйти первой"]
};
const CENA = { "жалеет меня":-0.25, "ей всё равно":-0.2, "она такая же":0.3,
  "говорит одно, делает другое":-0.3, "подходит — значит что-то нужно":-0.25, "меня сверяют":-0.2,
  "сейчас будут смотреть":-0.35, "при всех выясняет":-0.3, "ей тоже неловко":0.25,
  "забирает":-0.3, "считает, как я":0.2, "хвалится тем, что есть":-0.2,
  "отодвигается":-0.35, "меня не замечают":-0.25, "зовут ненадолго":0.1, "уходит первой, как я":0.25 };

const SRYV = {
  "утрата дитяти":"встаёт и уходит в комнату, не объяснив",
  "предательство близкого":"говорит вслух то, что копила месяц",
  "публичный позор":"замолкает и до конца вечера не отвечает",
  "голодная зима":"пересчитывает вслух, кто сколько внёс",
  "изгнание":"одевается и уходит, не прощаясь"
};

function mul(s){ return function(){ s|=0; s=s+0x6D2B79F5|0; let t=Math.imul(s^s>>>15,1|s);
  t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function rod(t, g){ return String(t).replace(/\{([^|}]*)\|([^}]*)\}/g, (m,a,b)=> g === "ч" ? b : a); }
function bio(M, r){ return Array.isArray(M.RW[r]) ? M.RW[r] : [{ txt:M.RW[r], v:null }]; }

// ── РОЖДЕНИЕ КРУГА ──────────────────────────────────────────────────────────
function roditKrug(M, seed){
  const rnd = mul(seed);
  const zash = Object.keys(M.ZASH);
  return M.KRUG.map(p => {
    const scar = RUBTSY[Math.floor(rnd() * 5)];
    const sila = rnd() < 0.15 ? 0 : 0.35 + rnd() * 0.65;   // у части людей раны нет вовсе
    return {
      name: p.name, g: p.g, kto: p.kto,
      need: NUZHDY[Math.floor(rnd() * 5)],
      scar, bi: Math.floor(rnd() * bio(M, scar).length),
      sila,
      zashita: zash[Math.floor(rnd() * zash.length)],
      porog: 0.55 + rnd() * 0.3,          // у каждого свой предел
      ostyvanie: 0.03 + rnd() * 0.06,
      pamyat: {}                           // что накопилось между ним и другими
    };
  });
}

// ── ПОСТУПОК ────────────────────────────────────────────────────────────────
function bolit(M, d, situ){ return d.sila > 0 && !!(M.SCAR[d.scar] && M.SCAR[d.scar][situ]); }

function postupok(M, d, situ){
  if (bolit(M, d, situ)){
    // Больно — но КАК он закрывается, решает его защита, а не рана.
    if (d.sila > 0.75) return { txt: rod(M.SCAR[d.scar][situ], d.g), ton: TON_SCAR[d.scar], ranen:true };
    const cherez = M.ZASH[d.zashita];
    return { txt: rod(M.ACT[cherez][situ], d.g), ton: M.TON_ZASH[d.zashita], ranen:true };
  }
  return { txt: rod(M.ACT[d.need][situ], d.g), ton: TON_NEED[d.need], ranen:false };
}

// ── ВЕЧЕР ───────────────────────────────────────────────────────────────────
// mesta — массив душ по кругу стола (null = пусто). Соседи читают в полную силу,
// сидящий через одного — вполсилы, дальше — не читает.
function provesti(M, mesta, temy, seed){
  const rnd = mul(seed);
  const za_stolom = mesta.filter(Boolean);
  za_stolom.forEach(d => {
    d.napryazhenie = 0.12 + rnd() * 0.18;
    d.teplo = {};
    d.sorvalsya = false;
    za_stolom.forEach(o => { if (o !== d) d.teplo[o.name] = (d.pamyat[o.name] || 0) + 0.3 + rnd() * 0.15; });
  });

  const hronika = [], uzly = [];
  let konec = null;

  for (let i = 0; i < temy.length && !konec; i++){
    const situ = temy[i];
    const sobytiya = [];

    for (const d of za_stolom){
      if (d.sorvalsya) continue;

      const sryv = d.sila > 0 && d.napryazhenie > d.porog && !bolit(M, d, situ);
      const p = sryv ? { txt: SRYV[d.scar], ton: TON_SCAR[d.scar] } : postupok(M, d, situ);
      const zapis = { kto: d.name, txt: p.txt, sryv, chteniya: [] };

      // читают только те, кто рядом
      const my = mesta.indexOf(d);
      for (const o of za_stolom){
        if (o === d || o.sorvalsya || o.sila === 0) continue;
        const ego = mesta.indexOf(o);
        const shag = Math.min(Math.abs(my - ego), mesta.length - Math.abs(my - ego));
        const slyshno = shag === 1 ? 1 : (shag === 2 ? 0.5 : 0);
        if (!slyshno) continue;

        const vidit = (VIDIT[o.scar] || {})[p.ton];
        if (!vidit){ o.napryazhenie = Math.max(0, o.napryazhenie - o.ostyvanie); continue; }

        const cena = (CENA[vidit] || 0) * o.sila * slyshno;
        const grozit = GROZIT[o.scar][Math.floor(rnd() * GROZIT[o.scar].length)];
        o.teplo[d.name] = Math.max(-1, Math.min(1, o.teplo[d.name] + cena));
        o.napryazhenie = Math.max(0, Math.min(1, o.napryazhenie + (cena < 0 ? -cena : -0.06)));

        const chtenie = { kto:o.name, pro:d.name, kak:`${vidit} — ${grozit}`, cena };
        zapis.chteniya.push(chtenie);
        if (cena < -0.18) uzly.push({ situ, kto:d.name, txt:p.txt, chital:o.name, kak:chtenie.kak });
      }

      if (sryv){ d.sorvalsya = true; }
      sobytiya.push(zapis);
    }

    hronika.push({ situ, kadr: M.SITU[situ], sobytiya });

    const s = za_stolom.find(d => d.sorvalsya);
    if (s) konec = { tip:"срыв", kto: s.name };
  }

  if (!konec){
    const holodno = za_stolom.some(d => Object.values(d.teplo).some(v => v < -0.1));
    konec = holodno ? { tip:"холод" } : { tip:"обошлось" };
  }

  // след остаётся между людьми до следующего вечера
  za_stolom.forEach(d => Object.entries(d.teplo).forEach(([k, v]) => {
    d.pamyat[k] = (d.pamyat[k] || 0) * 0.5 + (v - 0.35) * 0.5;
  }));

  return { hronika, konec, uzel: uzly[0] || null, za_stolom };
}

window.DVIZHOK = { roditKrug, provesti, NUZHDY, RUBTSY, bio, rod };
})();
