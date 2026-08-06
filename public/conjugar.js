/**
 * Conjugador de verbos.
 *
 * Ver un verbo en todos sus tiempos de una vez es la forma más rápida de
 * entender que el inglés no conjuga como el español: casi todo se construye
 * con auxiliares (do, be, have, will) y el verbo apenas cambia. Lo que cambia
 * son cinco formas base, y de ahí sale todo lo demás.
 *
 * Los irregulares vienen de irregulars.js; el resto se deduce por reglas.
 */
import { IRREGULARES } from "./irregulars.js";

const PORBASE = new Map(IRREGULARES.map((v) => [v.base, v]));

const VOCALES = "aeiou";
const acabaEn = (p, suf) => p.endsWith(suf);

/** Tercera persona: he/she/it. goes, studies, watches, plays. */
export function tercera(base) {
  if (base === "be") return "is";
  if (base === "have") return "has";
  if (base === "do") return "does";
  if (base === "go") return "goes";
  // Los modales no cambian nunca: he can, no "he cans".
  if (esModal(base)) return base;
  if (/(s|sh|ch|x|z|o)$/.test(base)) return base + "es";
  if (acabaEn(base, "y") && !VOCALES.includes(base.at(-2))) return base.slice(0, -1) + "ies";
  return base + "s";
}

/** Gerundio: going, studying, running, making. */
export function gerundio(base) {
  if (esModal(base)) return null; // los modales no tienen gerundio
  if (acabaEn(base, "ie")) return base.slice(0, -2) + "ying"; // lie → lying
  if (acabaEn(base, "ee")) return base + "ing"; // see → seeing
  if (acabaEn(base, "e") && base.length > 2) return base.slice(0, -1) + "ing"; // make → making
  if (dobleConsonante(base)) return base + base.at(-1) + "ing"; // run → running
  return base + "ing";
}

/** Pasado simple: went, studied, stopped, worked. */
export function pasado(base) {
  const irr = PORBASE.get(base);
  if (irr) return irr.pasado;
  if (esModal(base)) return base;
  return regularEd(base);
}

/** Participio: gone, studied, stopped, worked. */
export function participio(base) {
  const irr = PORBASE.get(base);
  if (irr) return irr.participio;
  if (esModal(base)) return base;
  return regularEd(base);
}

function regularEd(base) {
  if (acabaEn(base, "e")) return base + "d"; // like → liked
  if (acabaEn(base, "y") && !VOCALES.includes(base.at(-2))) return base.slice(0, -1) + "ied"; // study → studied
  if (dobleConsonante(base)) return base + base.at(-1) + "ed"; // stop → stopped
  return base + "ed";
}

/**
 * ¿Se dobla la última consonante? Consonante-vocal-consonante y una sílaba
 * (o acento al final). No cubre todos los casos raros del inglés, pero sí los
 * verbos frecuentes: stop, run, plan, begin.
 */
function dobleConsonante(base) {
  if (base.length < 3) return false;
  const [c1, v, c2] = [base.at(-3), base.at(-2), base.at(-1)];
  if (VOCALES.includes(c2) || "wxy".includes(c2)) return false;
  if (!VOCALES.includes(v) || VOCALES.includes(c1)) return false;
  // Solo en verbos de una sílaba o acabados en sílaba tónica conocida.
  const silabas = (base.match(/[aeiouy]+/g) || []).length;
  if (silabas === 1) return true;
  return ["begin", "forget", "prefer", "occur", "refer", "admit", "permit", "commit"].includes(base);
}

const MODALES = ["can", "could", "may", "might", "must", "should", "would", "will", "shall"];
export const esModal = (base) => MODALES.includes(base);

/** ¿"be" o cualquier otro? Cambia todo el paradigma. */
const esBe = (base) => base === "be";

/**
 * Devuelve los tiempos de un verbo, listos para pintar en una tabla.
 * Cada uno con la forma en primera persona y en tercera, que es donde está
 * la trampa para un español (la -s que se olvida).
 */
export function conjugar(base, { es = "" } = {}) {
  const v = String(base || "").trim().toLowerCase();
  if (!v) return null;

  const t3 = tercera(v);
  const ger = gerundio(v);
  const pas = pasado(v);
  const par = participio(v);

  if (esModal(v)) {
    return {
      base: v,
      es,
      modal: true,
      formas: { tercera: t3, gerundio: ger, pasado: pas, participio: par },
      tiempos: [
        { id: "presente", nombre: "Presente", yo: `I ${v} go`, el: `he ${v} go`, nota: "El modal no cambia nunca y el verbo va en infinitivo sin «to»." },
        { id: "negativo", nombre: "Negativo", yo: `I ${v} not go`, el: `he ${v} not go`, nota: "La negación va pegada al modal, sin «do»." },
        { id: "pregunta", nombre: "Pregunta", yo: `${v} I go?`, el: `${v} he go?`, nota: "Se invierte el modal, tampoco lleva «do»." },
      ],
    };
  }

  if (esBe(v)) {
    return {
      base: v,
      es,
      formas: { tercera: "is", gerundio: "being", pasado: "was / were", participio: "been" },
      tiempos: [
        { id: "presente", nombre: "Presente simple", yo: "I am", el: "he is", nota: "am / is / are. Es el único verbo con tres formas en presente." },
        { id: "pasado", nombre: "Pasado simple", yo: "I was", el: "he was", nota: "was para I/he/she/it, were para you/we/they." },
        { id: "continuo", nombre: "Presente continuo", yo: "I am being", el: "he is being", nota: "Poco frecuente: solo para comportamientos puntuales." },
        { id: "perfecto", nombre: "Present perfect", yo: "I have been", el: "he has been", nota: "«He estado». Muy usado con for y since." },
        { id: "futuro", nombre: "Futuro (will)", yo: "I will be", el: "he will be", nota: "Tras will, siempre el infinitivo sin «to»." },
        { id: "goingto", nombre: "Futuro (going to)", yo: "I am going to be", el: "he is going to be", nota: "Plan o intención decidida de antes." },
        { id: "condicional", nombre: "Condicional", yo: "I would be", el: "he would be", nota: "«Sería / estaría»." },
      ],
    };
  }

  return {
    base: v,
    es,
    irregular: PORBASE.has(v),
    formas: { tercera: t3, gerundio: ger, pasado: pas, participio: par },
    tiempos: [
      { id: "presente", nombre: "Presente simple", yo: `I ${v}`, el: `he ${t3}`, nota: "Rutinas y hechos. La -s de la tercera persona es el fallo más típico." },
      { id: "presente-neg", nombre: "Presente negativo", yo: `I don't ${v}`, el: `he doesn't ${v}`, nota: "Con doesn't, el verbo vuelve al infinitivo: nunca «doesn't goes»." },
      { id: "continuo", nombre: "Presente continuo", yo: `I am ${ger}`, el: `he is ${ger}`, nota: "Lo que pasa ahora mismo o estos días." },
      { id: "pasado", nombre: "Pasado simple", yo: `I ${pas}`, el: `he ${pas}`, nota: "Acabado y con momento concreto. Igual para todas las personas." },
      { id: "pasado-neg", nombre: "Pasado negativo", yo: `I didn't ${v}`, el: `he didn't ${v}`, nota: "Con didn't el verbo vuelve al infinitivo: nunca «didn't went»." },
      { id: "pasado-cont", nombre: "Pasado continuo", yo: `I was ${ger}`, el: `he was ${ger}`, nota: "Algo en curso cuando pasó otra cosa." },
      { id: "perfecto", nombre: "Present perfect", yo: `I have ${par}`, el: `he has ${par}`, nota: "Sin momento concreto, o con efecto hasta hoy." },
      { id: "pluscuam", nombre: "Past perfect", yo: `I had ${par}`, el: `he had ${par}`, nota: "Lo anterior a otro pasado." },
      { id: "futuro", nombre: "Futuro (will)", yo: `I will ${v}`, el: `he will ${v}`, nota: "Decisión del momento o predicción." },
      { id: "goingto", nombre: "Futuro (going to)", yo: `I am going to ${v}`, el: `he is going to ${v}`, nota: "Plan decidido de antes." },
      { id: "condicional", nombre: "Condicional", yo: `I would ${v}`, el: `he would ${v}`, nota: "«‑ría». Tras would, infinitivo sin «to»." },
      { id: "imperativo", nombre: "Imperativo", yo: `${v}!`, el: `don't ${v}!`, nota: "Órdenes. La forma negativa lleva don't delante." },
    ],
  };
}

/** Verbos que merece la pena ofrecer para conjugar: los irregulares y los regulares frecuentes. */
export function verbosConjugables(banco) {
  const irregulares = IRREGULARES.map((v) => ({ base: v.base, es: v.es, irregular: true }));
  const yaEstan = new Set(irregulares.map((v) => v.base));
  const regulares = (banco || [])
    .filter((w) => w.cat === "verbos" && /^[a-z]+$/.test(w.en) && !yaEstan.has(w.en) && !esModal(w.en))
    .map((w) => ({ base: w.en, es: w.es, irregular: false }));
  return [...irregulares, ...regulares].sort((a, b) => a.base.localeCompare(b.base));
}
