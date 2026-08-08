import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const NIVELES = {
  basico:
    "nivel A1-A2: vocabulario cotidiano de casa, comida, trabajo, viajes y rutina diaria",
  intermedio:
    "nivel B1-B2: vocabulario util para conversar, trabajar y entender series o podcasts sin subtitulos",
  avanzado:
    "nivel C1-C2: vocabulario preciso, phrasal verbs, expresiones idiomaticas y palabras que suenan naturales en un nativo",
};

const CATEGORIAS = {
  mixto: "vocabulario variado: mezcla verbos, sustantivos, adjetivos y expresiones",
  verbos: "SOLO verbos (en infinitivo, sin 'to'). Nada de sustantivos ni adjetivos",
  phrasal:
    "SOLO phrasal verbs (verbo + particula: give up, run out of, look forward to). Nada de verbos simples",
  sustantivos: "SOLO sustantivos: objetos, conceptos, lugares, profesiones. Nada de verbos",
  adjetivos: "SOLO adjetivos que describan personas, cosas o situaciones",
  conectores:
    "SOLO conectores y palabras de enlace: although, unless, therefore, in order to, as a result...",
  adverbios: "SOLO adverbios: de modo, de frecuencia, de grado, de tiempo",
  expresiones:
    "SOLO expresiones hechas y modismos de uso frecuente, no traducibles palabra por palabra",
  preposiciones:
    "SOLO preposiciones y combinaciones con preposicion (depend on, good at, interested in)",
  pronombres:
    "SOLO pronombres, determinantes y cuantificadores (each other, both, neither, a few, plenty of)",
};

const SCHEMA = {
  type: "object",
  properties: {
    words: {
      type: "array",
      items: {
        type: "object",
        properties: {
          en: { type: "string", description: "La palabra o expresion en ingles, en minusculas" },
          es: { type: "string", description: "Traduccion al espanol, breve (1-4 palabras)" },
          pron: {
            type: "string",
            description:
              "Como se pronuncia, escrito como lo leeria un espanol. Solo letras del espanol, tilde en la silaba fuerte y GUION entre silabas. " +
              "Ej: 'though' -> 'dóu', 'enough' -> 'i-náf', 'beautiful' -> 'biúu-ri-ful'. " +
              "OJO CON LAS SILABAS: pon solo las que suenan de verdad en ingles, no una por vocal escrita. " +
              "'family' es 'fám-li' (dos), no 'fa-mi-li'. Igual con different (dí-frent), chocolate (chó-klat) y every (év-ri). " +
              "OJO CON LA T AMERICANA: se escribe con r en DOS sitios. " +
              "(1) entre vocales: water -> 'uó-rer', city -> 'sí-ri', better -> 'bé-rer'. " +
              "(2) antes de l: little -> 'lí-rol', bottle -> 'bó-rol', metal -> 'mé-ral'. " +
              "Pero si la silaba de DETRAS es la fuerte, la t se queda: return -> 'ri-térn', hotel -> 'jou-tél', attend -> 'a-ténd'. " +
              "Y DETRAS DE R la t se queda SIEMPRE, aunque en ingles suene flap: forty -> 'fór-ti', thirty -> 'zér-ti', " +
              "dirty -> 'dér-ti', party -> 'pár-ti'. Nunca 'fór-ri' ni 'zér-ri': un espanol leeria esa rr como la de 'perro', " +
              "que suena mucho peor que dejar la t.",
          },
          example: { type: "string", description: "Frase de ejemplo corta en ingles usando la palabra" },
          exampleEs: { type: "string", description: "Traduccion al espanol de la frase de ejemplo" },
        },
        required: ["en", "es", "pron", "example", "exampleEs"],
        additionalProperties: false,
      },
    },
  },
  required: ["words"],
  additionalProperties: false,
};

const SYSTEM = `Eres un profesor de ingles para hispanohablantes. Generas fichas de vocabulario.

SIEMPRE INGLES AMERICANO, en la palabra, en la ortografia y en la pronunciacion:
color (no colour), neighbor (no neighbour), favorite (no favourite), apartment
(no flat), vacation (no holiday), elevator (no lift), movie (no film), math (no
maths), soccer (no football), pants (no trousers), truck (no lorry), gas (no
petrol), store (no shop), fall (no autumn). El audio de la app es en-US.

EL CAMPO "pron" ES LO MAS IMPORTANTE. El alumno es de ESPANA. Escribe la
pronunciacion de forma que, leida en voz alta con las reglas del espanol de
Espana, suene lo mas parecido posible al ingles. Nunca uses simbolos del AFI.
Marca siempre la silaba tonica con tilde.

TODOS los ejemplos de aqui abajo van con el guion de silaba puesto, porque asi
es como tiene que salir el campo "pron". Copia ese formato.

Tabla de equivalencias (usala estrictamente):
  th sorda de "think"   -> z      (en Espana la z suena /θ/): think = "zink", worth = "uérz"
  th sonora de "this"   -> d      (nunca z): this = "dis", that = "dat", the = "de",
                                   mother = "má-der", although = "ol-dóu", therefore = "dér-for"
  h aspirada de "have"  -> j      (la h espanola es MUDA, jamas la uses): have = "jav",
                                   here = "jier", behavior = "bi-jéi-vior"
  w de "we"             -> u      : we = "ui", what = "uót", work = "uérk"
  v de "very"           -> v      (labiodental, no la conviertas en b)
  sh de "she"           -> sh     : she = "shi", issue = "í-shu"
  j de "job"            -> y      : job = "yob", schedule = "skéd-yul"
  ng de "sing"          -> ng     : sing = "sing"
  sonido /k/ SIEMPRE    -> k      : keep = "kiip", cat = "kat", cup = "kap"  (nunca c, nunca "que/qui")
  sonido /g/ ante e,i   -> gu     : get = "guet", again = "a-guén"
  sonido /s/ ante e,i   -> s      (nunca c, que en Espana suena /θ/): since = "sins"

Vocales inglesas mas traicioneras:
  /ʌ/ de "cup, but, result, love"    -> a : cup = "kap", result = "ri-sált", love = "lav"
  /iː/ larga de "see, meet"          -> ii: see = "sii", meeting = "míi-ring"
  /uː/ larga de "food"               -> uu: food = "fuud", improve = "im-prúuv"
  /ɜː/ de "bird, work"               -> er: bird = "berd", worth = "uérz"
  /æ/ de "cat"                       -> a : cat = "kat"

NO pongas tilde en una vocal debil (i, u) si con eso rompes un diptongo: "here"
es "jier", no "jíer" — un espanol leeria "jí-er", en dos silabas, y son una.

Comprobacion obligatoria antes de responder: relee cada "pron" y preguntate
"si un espanol lee esto en voz alta, suena al ingles real?". Vigila sobre todo
que no haya ninguna h muda, que la z solo aparezca en la th sorda, y que la
th sonora vaya siempre con d.

Escribe cada palabra de una expresion por separado, tal como se lee.

Reglas generales:
- Palabras y expresiones utiles y frecuentes, no rarezas de diccionario.
- Nada de repetir palabras que ya conoce el alumno.
- La traduccion debe ser breve, como en un diccionario: "aunque", "a menos que", "debido a".
- La frase de ejemplo debe ser natural, corta y de uso real.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Usa POST" });
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(503).json({ error: "Falta ANTHROPIC_API_KEY en el servidor" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const count = Math.min(Math.max(parseInt(body.count, 10) || 5, 1), 20);
    const nivel = NIVELES[body.level] ? body.level : "intermedio";
    const tema = String(body.topic || "").trim().slice(0, 120);
    // Solo mandamos las ultimas 300 para no inflar el prompt.
    const known = Array.isArray(body.known) ? body.known.slice(-300) : [];

    const categoria = CATEGORIAS[body.category] ? body.category : "mixto";

    const prompt = [
      `Genera exactamente ${count} palabras o expresiones nuevas en ingles de ${NIVELES[nivel]}.`,
      `TIPO DE PALABRA (obligatorio): ${CATEGORIAS[categoria]}.`,
      tema ? `Ademas, todas deben pertenecer a este tema: ${tema}.` : null,
      known.length
        ? `El alumno ya conoce estas, NO las repitas ni uses variantes obvias de ellas:\n${known.join(", ")}`
        : "Es su primer dia, empieza por palabras de alta frecuencia.",
    ]
      .filter(Boolean)
      .join("\n\n");

    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 8000,
      system: SYSTEM,
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: SCHEMA },
      },
      messages: [{ role: "user", content: prompt }],
    });

    if (response.stop_reason === "refusal") {
      res.status(422).json({ error: "La peticion fue rechazada por el modelo" });
      return;
    }

    const text = response.content.find((b) => b.type === "text")?.text ?? "{}";
    const data = JSON.parse(text);

    // Filtro antes de mandarlas al navegador.
    //
    // Lo que entra aqui se guarda en el banco del alumno y se queda. Una ficha
    // sin traduccion sale en blanco en la pantalla, y una pronunciacion con h
    // rompe la regla base de toda la notacion: la h espanola es muda, asi que
    // "have" escrito "hav" se lee "av". Mejor una palabra menos que una mal.
    const texto = (v) => typeof v === "string" && v.trim().length > 0;
    const words = (data.words ?? []).filter((w) => {
      if (!w || !["en", "es", "pron", "example", "exampleEs"].every((k) => texto(w[k]))) return false;
      const pron = w.pron.toLowerCase();
      // ch y sh son digrafos validos; cualquier otra h esta mal
      if (/h/.test(pron.replace(/ch|sh/g, ""))) return false;
      // Solo letras espanolas, guion de silaba y espacio entre palabras
      if (/[^a-záéíóúñ\- ]/.test(pron)) return false;
      // "que/qui" y "ce/ci" se leen mal en Espana: /ke/ y /θe/
      if (/\bqu[ei]|c[ei]/.test(pron)) return false;
      return true;
    });

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ words });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      res.status(429).json({ error: "Limite de peticiones alcanzado, prueba en un minuto" });
      return;
    }
    console.error("[generate]", err);
    res.status(500).json({ error: "No se pudieron generar las palabras" });
  }
}
