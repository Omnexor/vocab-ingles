/**
 * Genera un banco grande de vocabulario y lo guarda en public/vocabulario.json.
 *
 * La app lo carga al arrancar, así que una vez generado tienes miles de palabras
 * disponibles sin conexión y sin gastar API en el uso diario.
 *
 *   node scripts/generar-vocabulario.mjs            -> 3000 palabras
 *   node scripts/generar-vocabulario.mjs 500        -> 500 palabras
 *   node scripts/generar-vocabulario.mjs 3000 --reanudar
 *
 * Va guardando por lotes: si lo cortas o falla la red, vuelve a lanzarlo con
 * --reanudar y sigue donde lo dejó.
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SALIDA = path.join(ROOT, "public", "vocabulario.json");
const LOTE = 25; // palabras por petición

/* ---------- .env.local ---------- */
for (const f of [".env.local", ".env"]) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  for (const linea of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(`
  Falta la API key.

  1. Copia .env.example a .env.local
  2. Pon dentro tu ANTHROPIC_API_KEY (console.anthropic.com -> API Keys)
  3. Vuelve a lanzar este comando
`);
  process.exit(1);
}

const client = new Anthropic();

/* ---------- reparto por categorías ---------- */
// Proporciones parecidas a las de un corpus real de inglés cotidiano.
const REPARTO = {
  sustantivos: 0.28,
  verbos: 0.2,
  adjetivos: 0.15,
  phrasal: 0.1,
  expresiones: 0.08,
  adverbios: 0.07,
  conectores: 0.05,
  preposiciones: 0.04,
  pronombres: 0.03,
};

const DESCRIPCIONES = {
  sustantivos: "sustantivos: objetos, personas, lugares, conceptos, profesiones, comida, casa, trabajo",
  verbos: "verbos en infinitivo sin 'to'",
  adjetivos: "adjetivos que describan personas, cosas, estados o situaciones",
  phrasal: "phrasal verbs (verbo + partícula), como give up, run out of, look forward to",
  expresiones: "expresiones hechas y modismos frecuentes que no se traducen palabra por palabra",
  adverbios: "adverbios de modo, frecuencia, grado y tiempo",
  conectores: "conectores y palabras de enlace",
  preposiciones: "preposiciones y combinaciones fijas con preposición (depend on, good at)",
  pronombres: "pronombres, determinantes y cuantificadores (each other, both, neither, plenty of)",
};

const SCHEMA = {
  type: "object",
  properties: {
    words: {
      type: "array",
      items: {
        type: "object",
        properties: {
          en: { type: "string" },
          es: { type: "string" },
          pron: { type: "string" },
          example: { type: "string" },
          exampleEs: { type: "string" },
        },
        required: ["en", "es", "pron", "example", "exampleEs"],
        additionalProperties: false,
      },
    },
  },
  required: ["words"],
  additionalProperties: false,
};

const SYSTEM = `Eres un profesor de ingles para hispanohablantes de ESPANA. Preparas un banco
de vocabulario ordenado por frecuencia de uso real.

EL CAMPO "pron" ES LO MAS IMPORTANTE. Escribe la pronunciacion de forma que, leida
en voz alta con las reglas del espanol de Espana, suene lo mas parecido posible al
ingles. Nunca uses simbolos del AFI. Marca siempre la silaba tonica con tilde.

Tabla de equivalencias (usala estrictamente):
  th sorda de "think"   -> z      (en Espana la z suena /0/): think = "zink", worth = "uerz"
  th sonora de "this"   -> d      (nunca z): this = "dis", the = "de", although = "oldou",
                                   therefore = "derfor", mother = "mader"
  h aspirada de "have"  -> j      (la h espanola es MUDA, jamas la uses): have = "jav",
                                   here = "jier", behavior = "bijeivior"
  w de "we"             -> u      : we = "ui", what = "uot", work = "uerk"
  v de "very"           -> v      (labiodental, no la conviertas en b)
  sh de "she"           -> sh     : she = "shi", issue = "ishu"
  j de "job"            -> y      : job = "yob", schedule = "skedyul"
  ng de "sing"          -> ng
  sonido /k/ ante e,i   -> k      : keep = "kiip"  (nunca "que/qui")
  sonido /g/ ante e,i   -> gu     : get = "guet", again = "aguen"
  sonido /s/ ante e,i   -> s      (nunca c, que en Espana suena /0/): since = "sins"

Vocales traicioneras:
  /^/ de "cup, but, result, because" -> a : cup = "cap", result = "risalt"
  /i:/ larga de "see, meet"          -> ii: see = "sii", meeting = "miiting"
  /u:/ larga de "food"               -> uu: food = "fuud"
  /3:/ de "bird, work"               -> er: bird = "berd"
  /ae/ de "cat"                      -> a

Antes de responder relee cada "pron": ninguna h muda, la z solo en th sorda, la th
sonora siempre con d.

Ademas:
- La traduccion al espanol debe ser breve, de diccionario.
- La frase de ejemplo, corta, natural y de uso cotidiano.
- Ordena de mas frecuente a menos dentro de cada lote.`;

/* ---------- estado ---------- */
const objetivo = Number(process.argv[2]) || 3000;
const reanudar = process.argv.includes("--reanudar");

let banco = [];
if (reanudar && fs.existsSync(SALIDA)) {
  banco = JSON.parse(fs.readFileSync(SALIDA, "utf8")).words ?? [];
  console.log(`  Reanudando: ya había ${banco.length} palabras.`);
}

const yaEstan = new Set(banco.map((w) => w.en.toLowerCase()));

function guardar() {
  fs.writeFileSync(
    SALIDA,
    JSON.stringify({ generado: new Date().toISOString(), total: banco.length, words: banco }, null, 0),
  );
}

async function pedirLote(cat, cuantas, yaDeEsta) {
  const respuesta = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: 16000,
    system: SYSTEM,
    output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
    messages: [
      {
        role: "user",
        content: [
          `Genera exactamente ${cuantas} ${DESCRIPCIONES[cat]}.`,
          "Deben estar entre las mas usadas del ingles cotidiano.",
          yaDeEsta.length
            ? `NO repitas ninguna de estas (ni variantes obvias):\n${yaDeEsta.slice(-400).join(", ")}`
            : "Empieza por las de mayor frecuencia.",
        ].join("\n\n"),
      },
    ],
  });

  if (respuesta.stop_reason === "refusal") throw new Error("peticion rechazada");
  const texto = respuesta.content.find((b) => b.type === "text")?.text ?? "{}";
  return JSON.parse(texto).words ?? [];
}

/* ---------- bucle ---------- */
console.log(`\n  Generando ${objetivo} palabras -> public/vocabulario.json\n`);
const inicio = Date.now();

for (const [cat, proporcion] of Object.entries(REPARTO)) {
  const meta = Math.round(objetivo * proporcion);
  let deEstaCat = banco.filter((w) => w.cat === cat).map((w) => w.en);

  while (deEstaCat.length < meta) {
    const cuantas = Math.min(LOTE, meta - deEstaCat.length);
    let lote;
    try {
      lote = await pedirLote(cat, cuantas, deEstaCat);
    } catch (err) {
      console.error(`  ! ${cat}: ${err.message}. Reintento en 5 s…`);
      await new Promise((r) => setTimeout(r, 5000));
      continue;
    }

    let nuevas = 0;
    for (const w of lote) {
      const en = String(w.en || "").trim().toLowerCase();
      if (!en || yaEstan.has(en)) continue;
      yaEstan.add(en);
      banco.push({
        en,
        es: String(w.es || "").trim(),
        pron: String(w.pron || "").trim(),
        example: String(w.example || "").trim(),
        exampleEs: String(w.exampleEs || "").trim(),
        cat,
      });
      deEstaCat.push(en);
      nuevas++;
    }

    guardar();
    const pct = Math.round((banco.length / objetivo) * 100);
    console.log(`  ${String(pct).padStart(3)}%  ${banco.length}/${objetivo}  (+${nuevas} ${cat})`);

    if (nuevas === 0) {
      console.log(`  ${cat}: no salen más palabras nuevas, paso a la siguiente.`);
      break;
    }
  }
}

const mins = ((Date.now() - inicio) / 60000).toFixed(1);
console.log(`\n  Listo: ${banco.length} palabras en ${mins} min -> public/vocabulario.json`);
console.log(`  Reinicia la app y las tendrás todas disponibles sin conexión.\n`);
