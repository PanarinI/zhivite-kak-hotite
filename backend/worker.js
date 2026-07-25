// Долина — воркер-сказитель (Cloudflare Worker).
// Держит твой ключ Anthropic (Secret ANTHROPIC_API_KEY, в коде его НЕТ), зовёт Claude
// и превращает механический исход встречи в плоть: хронику, предание, память пары,
// изредка — имя месту. Механику исхода менять модели запрещено — мир честный.

const MODEL = "claude-haiku-4-5";   // дешёвая и быстрая: строк мало, партия — копейки
const ALLOW_ORIGIN = "*";           // игра ходит с диска (file://), поэтому пускаем всех; кошелёк бережёт rate-limit

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": ALLOW_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ error: "POST only" }, 405, cors);

    if (env.RATE_LIMITER) {
      const ip = request.headers.get("cf-connecting-ip") || "anon";
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) return json({ error: "Слишком часто — подожди минуту." }, 429, cors);
    }
    if (!env.ANTHROPIC_API_KEY) return json({ error: "Ключ не настроен на сервере." }, 500, cors);

    let b;
    try { b = await request.json(); } catch { return json({ error: "bad json" }, 400, cors); }

    const s = (v, n) => String(v ?? "").slice(0, n);
    const num = (v) => Math.max(-100, Math.min(100, parseInt(v, 10) || 0));
    const A = b.a || {}, B = b.b || {};
    const aName = s(A.name, 24) || "Первый", bName = s(B.name, 24) || "Вторая";
    const outcome = { friendly: "поладили", neutral: "разошлись нейтрально", quarrel: "повздорили" }[b.outcome] || "разошлись нейтрально";
    const scars = (Array.isArray(b.scars) ? b.scars : []).slice(0, 4).map(x => s(x, 60));
    const memory = (Array.isArray(b.memory) ? b.memory : []).slice(0, 3).map(x => s(x, 80));
    const f = b.flags || {};

    const flagLines = [];
    if (f.foodShared) flagLines.push("Они поделились едой.");
    if (f.noFoodName) flagLines.push(`${s(f.noFoodName, 24)} в итоге ${f.noFoodG === "f" ? "осталась" : "остался"} без еды.`);
    if (f.whisperName) flagLines.push(`Сегодня ${s(f.whisperName, 24)} привёл сюда внутренний голос — незримая рука.`);
    if (f.dice === "good") flagLines.push("Незримая рука клонила исход к добру.");
    if (f.dice === "bad") flagLines.push("Незримая рука клонила исход к худу.");
    if (f.strangerName) flagLines.push(`${s(f.strangerName, 24)} — пришлый из тумана, речь его странна.`);

    const sys =
`Ты — голос мира в игре-летописи «Долина»: безымянная долина, сказочное безвременье, первые люди.
Пиши по-русски, коротко, суховато-сказово, без пафоса и без современных слов.
Правила полей:
- chronicle: 1–2 коротких предложения — что видел бы сторонний глаз, только эта сцена, прошедшее время. Без духов и чудес: мир честный.
- legend: одна фраза — как эту встречу перескажут у костра годы спустя. Образно; духи, знамения и голоса тут можно: это память племени, не мир.
- detail: 3–6 слов, конкретика сцены для памяти пары (что делили, о чём слово было).
- scar_text: если в исходе назван рубец (ссора/обида/приязнь) — 2–4 слова о причине; иначе null.
- place_name: почти всегда null. Лишь если событие врезается в память — короткое имя месту, 1–2 слова, рождённое из события (как «Колодец Ссоры»).
Механический исход встречи менять НЕЛЬЗЯ — он дан.`;

    const user =
`День ${Math.max(1, Math.min(99, parseInt(b.day, 10) || 1))}, погода: ${s(b.weather, 12) || "ясно"}. Место: ${s(b.place, 30) || "тропа"}.
${aName} (${s(A.trait, 30)}, ${A.g === "f" ? "женщина" : "мужчина"}, сытость ${num(A.sat)}/100) и ${bName} (${s(B.trait, 30)}, ${B.g === "f" ? "женщина" : "мужчина"}, сытость ${num(B.sat)}/100) встретились.
Отношение ${aName} к ${bName}: ${num(b.relAB)}; обратно: ${num(b.relBA)} (от −100 вражда до +100 приязнь).
Рубцы между ними: ${scars.length ? scars.join("; ") : "нет"}.
Память их прежних встреч: ${memory.length ? memory.join("; ") : "это их первая заметная встреча"}.
${flagLines.join(" ")}
Исход (непреложно): ${outcome}.${b.scarType ? ` Рубец исхода: ${s(b.scarType, 12)}.` : ""}
Верни строго JSON по схеме.`;

    const schema = {
      type: "object", additionalProperties: false,
      properties: {
        chronicle: { type: "string" },
        legend: { type: "string" },
        detail: { type: "string" },
        scar_text: { type: ["string", "null"] },
        place_name: { type: ["string", "null"] },
      },
      required: ["chronicle", "legend", "detail", "scar_text", "place_name"],
    };

    let r;
    try {
      r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL, max_tokens: 350, system: sys,
          messages: [{ role: "user", content: user }],
          output_config: { format: { type: "json_schema", schema } },
        }),
      });
    } catch {
      return json({ error: "Не достучался до Claude." }, 502, cors);
    }
    if (!r.ok) {
      const detail = (await r.text()).slice(0, 300);
      return json({ error: "Claude вернул ошибку", status: r.status, detail }, 502, cors);
    }
    const data = await r.json();
    if (data.stop_reason === "refusal")
      return json({ error: "Модель отказалась от сцены." }, 200, cors);

    const text = (data.content || []).find((x) => x.type === "text")?.text || "";
    let scene;
    try { scene = JSON.parse(text); } catch { return json({ error: "Не разобрал ответ модели." }, 502, cors); }
    return json(scene, 200, cors);
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...(cors || {}) },
  });
}
