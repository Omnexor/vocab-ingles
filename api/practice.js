import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SCHEMA = {
  type: "object",
  properties: {
    exercises: {
      type: "array",
      items: {
        type: "object",
        properties: {
          q: {
            type: "string",
            description:
              "El enunciado. Normalmente una frase en ingles con un hueco marcado con ___",
          },
          options: {
            type: "array",
            description: "Exactamente tres opciones. Solo una es correcta.",
            items: { type: "string" },
          },
          answer: {
            type: "integer",
            description: "Indice de la opcion correcta dentro de options: 0, 1 o 2",
          },
          why: {
            type: "string",
            description: "Explicacion breve en espanol de por que esa es la correcta",
          },
        },
        required: ["q", "options", "answer", "why"],
        additionalProperties: false,
      },
    },
  },
  required: ["exercises"],
  additionalProperties: false,
};

const SYSTEM = `Eres un profesor de ingles para hispanohablantes. Creas ejercicios de gramatica tipo test.

SIEMPRE INGLES AMERICANO, en ortografia y vocabulario: color, neighbor, favorite,
apartment, vacation, elevator, movie, math, soccer, pants, gas, fall.

Reglas:
- Cada ejercicio tiene exactamente 3 opciones y una sola correcta.
- Las opciones incorrectas deben ser errores realistas que comete un hispanohablante,
  no disparates evidentes.
- Las frases deben ser de uso cotidiano, cortas y naturales.
- El enunciado y las opciones van en ingles; la explicacion siempre en espanol.
- La explicacion es de una o dos frases, concreta, sin teoria de mas.
- No repitas la misma frase de ejemplo en varios ejercicios.`;

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
    const title = String(body.title || "").trim().slice(0, 120);
    const goal = String(body.goal || "").trim().slice(0, 240);
    const count = Math.min(Math.max(parseInt(body.count, 10) || 5, 1), 10);
    const seen = Array.isArray(body.seen) ? body.seen.slice(-20) : [];

    if (!title) {
      res.status(400).json({ error: "Falta el tema de la leccion" });
      return;
    }

    const prompt = [
      `Crea ${count} ejercicios tipo test sobre esta leccion de gramatica inglesa: "${title}".`,
      goal ? `Objetivo de la leccion: ${goal}` : null,
      seen.length
        ? `El alumno ya ha visto estos enunciados, plantea otros distintos:\n${seen.join("\n")}`
        : null,
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

    // Descartamos lo que venga mal formado antes de mandarlo al navegador.
    //
    // Lo de las opciones repetidas no es teórico: si un ejercicio trae dos
    // iguales, el alumno puede marcar la buena y que se la den por mala, que es
    // exactamente el fallo que hubo que arreglar en los juegos. Y sin `why` la
    // pantalla de respuesta se queda sin explicar nada, que es la mitad del
    // valor del ejercicio.
    const exercises = (data.exercises ?? []).filter((e) => {
      if (!e || typeof e.q !== "string" || !e.q.trim()) return false;
      if (!Array.isArray(e.options) || e.options.length !== 3) return false;
      if (e.options.some((o) => typeof o !== "string" || !o.trim())) return false;
      const limpias = e.options.map((o) => o.trim().toLowerCase());
      if (new Set(limpias).size !== 3) return false;
      if (!Number.isInteger(e.answer) || e.answer < 0 || e.answer > 2) return false;
      return typeof e.why === "string" && Boolean(e.why.trim());
    });

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ exercises });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      res.status(429).json({ error: "Limite de peticiones alcanzado, prueba en un minuto" });
      return;
    }
    console.error("[practice]", err);
    res.status(500).json({ error: "No se pudieron generar los ejercicios" });
  }
}
