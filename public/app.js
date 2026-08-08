import { SEED_WORDS, CATEGORIAS, nombreCategoria } from "./seed.js";
import { FALSOS_AMIGOS } from "./false-friends.js";
import { LECTURAS } from "./readings.js";
import { CUENTOS } from "./stories.js";
import { IRREGULARES, FORMA_A_BASE, CONTRACCIONES } from "./irregulars.js";
import { conjugar, verbosConjugables, tercera, gerundio, pasado, participio } from "./conjugar.js";
import { EJERCICIOS_MODALES } from "./modals.js";
import { FRASES, CATEGORIAS_FRASES, contextosDe } from "./phrases.js";
import { conGuiones } from "./silabas.js";

/* ------------------------------------------------------------------ *
 * Las lecciones se cargan aparte, y a propósito
 *
 * lessons.js pesa 466 KB — el 45 % de todo lo que se descarga al abrir la app,
 * y más que el propio app.js. Importándolo arriba con los demás, el navegador
 * tiene que bajarlo y parsearlo ENTERO antes de ejecutar una sola línea, aunque
 * abras la app solo para repasar cuatro palabras. En 4G lento eran 2,3 de los
 * 2,5 segundos que tardaba en poder tocarse.
 *
 * Ninguna de las tres pantallas que las usan —el índice de Lecciones, la
 * lección abierta y el contador de Ajustes— sale en el primer pintado, así que
 * se cargan cuando hacen falta. Y para que abrir Lecciones no se quede esperando
 * medio mega, se van bajando solas en cuanto la app está quieta.
 * ------------------------------------------------------------------ */

let LESSONS = [];
let getLesson = () => null;
let cargaLecciones = null;

function cargarLecciones() {
  if (!cargaLecciones) {
    cargaLecciones = import("./lessons.js").then((m) => {
      LESSONS = m.LESSONS;
      getLesson = m.getLesson;
    });
  }
  return cargaLecciones;
}

/* ------------------------------------------------------------------ *
 * Estado
 * ------------------------------------------------------------------ */

const KEY = "vocab-ingles:v1";
/**
 * Intervalos de repaso espaciado, en días. El índice es la "caja" de la palabra.
 *
 * La cola llega hasta el año a propósito. Antes se paraba en 90 días, y eso
 * significa que una palabra que te sabes perfectamente vuelve cuatro veces al
 * año para siempre: con mil palabras dominadas son once repasos diarios solo
 * de cosas que ya sabes. Alargando el final, lo dominado casi no molesta y el
 * hueco queda para lo que de verdad se te resiste.
 */
const INTERVALOS = [0, 1, 3, 7, 16, 35, 90, 180, 365];

const defaults = () => ({
  version: 1,
  settings: { level: "intermedio", daily: 5, topic: "", category: "mixto", tapar: false, tema: "auto", maxRepaso: 25 },
  stats: { streak: 0, best: 0, lastStudy: null },
  daily: { date: null, ids: [], done: 0 },
  words: [],
  lessons: {}, // id -> { best: 0-100, done: bool, last: "YYYY-MM-DD" }
  lecturas: {}, // id -> fecha en que la leíste
  games: {}, // id -> mejor marca
  gamesLast: {}, // id -> fecha de la última partida, para saber qué tienes olvidado
  confusiones: {}, // "palabra|palabra" -> veces que has cambiado una por otra
});

let store = load();

/**
 * Deja la lista de palabras en un estado con el que se pueda trabajar.
 *
 * Media docena de funciones hacen `for (const w of store.words)` y leen w.en
 * directamente. Con una entrada rota —una copia de seguridad a medias, una
 * escritura interrumpida— reventaba refrescarPronunciaciones, que corre AL
 * ARRANCAR: la app se caía antes de pintar nada.
 *
 * Se aplica en los DOS sitios por los que entra una lista de fuera: al leer el
 * localStorage y al restaurar una copia.
 *
 * Va como `function` y no como `const` a propósito. Con const, esto queda por
 * debajo del `let store = load()` de arriba y en su zona muerta: llamarla desde
 * load() lanzaba un ReferenceError que el catch se tragaba, y la app arrancaba
 * con los valores por defecto. Es decir, BORRABA las palabras y la racha del
 * usuario, en silencio y en cada carga. Las declaraciones de función se elevan
 * y no tienen ese problema.
 */
function sanearPalabras(lista) {
  return Array.isArray(lista)
    ? lista.filter((w) => w && typeof w === "object" && typeof w.en === "string" && w.en.trim())
    : [];
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const base = defaults();
    const saved = JSON.parse(raw);
    return {
      ...base,
      ...saved,
      settings: { ...base.settings, ...saved.settings },
      stats: { ...base.stats, ...saved.stats },
      words: sanearPalabras(saved.words),
    };
  } catch (err) {
    // Empezar de cero es lo único que se puede hacer si el estado no se puede
    // leer, pero CALLARSE no. Este catch sin traza escondió justamente lo de
    // arriba: un bug de orden de declaración se veía como «se me han borrado
    // las palabras», sin nada en consola que apuntara al motivo.
    console.error("[vocab] no se pudo leer el estado guardado, empiezo de cero:", err);
    return defaults();
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(store));
}

/* ------------------------------------------------------------------ *
 * Utilidades de fecha
 * ------------------------------------------------------------------ */

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const todayStr = () => iso(today());
const addDays = (days) => {
  const d = today();
  d.setDate(d.getDate() + days);
  return iso(d);
};
const diffDays = (a, b) => Math.round((new Date(a) - new Date(b)) / 86400000);

/* ------------------------------------------------------------------ *
 * Palabras
 * ------------------------------------------------------------------ */

const knownWords = () => store.words.map((w) => w.en);
const byId = (id) => store.words.find((w) => w.id === id);
/** Todo lo vencido, sin tope. Sirve para saber cuánto hay de verdad. */
const dueWords = () => store.words.filter((w) => w.due <= todayStr());

/** El tope de la sesión. 0 = sin límite. */
const topeRepaso = () => store.settings.maxRepaso || Infinity;

/**
 * Qué palabra va antes.
 *
 * Manda la dificultad —las que más te cuestan, primero— pero contando también
 * cuántos días lleva vencida. Si solo mandara la dificultad, las que ya te
 * sabes no volverían NUNCA una vez hay más palabras que hueco: se quedarían
 * pudriéndose al final de la cola hasta que las olvidaras del todo.
 *
 *   recién fallada (caja 0, 3 fallos, vence hoy):  0 + 6 + 8 = 14
 *   dominada (caja 8) que vence hoy:               0 + 0 + 0 = 0   → la última
 *   esa misma, 20 días después:                   20 + 0 + 0 = 20  → la primera
 *
 * Los fallos cuentan como mucho cinco. Sin ese techo, una palabra que llevas
 * fallada cincuenta veces sumaría cien y se pondría delante de TODO para
 * siempre, dejando muertas a las demás. Con el techo, lo que más puede pesar la
 * dificultad son 18 puntos, así que cualquier palabra pasa a la cabeza en
 * cuanto lleva 19 días vencida. Nada se queda atrás indefinidamente.
 */
const TOPE_FALLOS = 5;
function prioridad(w) {
  const diasVencida = Math.max(0, diffDays(todayStr(), w.due));
  return diasVencida + Math.min(w.lapses || 0, TOPE_FALLOS) * 2 + (INTERVALOS.length - 1 - w.box);
}

/**
 * La cola de hoy: lo vencido, ordenado por prioridad y CORTADO por el tope.
 *
 * Sin tope, el repaso crece con el vocabulario y no para: al día 100 te
 * plantaba cincuenta palabras y al año más de doscientas. Con tope, la sesión
 * dura siempre lo mismo y lo que no entra hoy sube de prioridad para mañana,
 * porque llevar días vencida puntúa.
 */
function colaDeHoy() {
  return dueWords()
    .sort((a, b) => prioridad(b) - prioridad(a))
    .slice(0, topeRepaso());
}

/**
 * Cuántas palabras nuevas caben hoy.
 *
 * El tope es el presupuesto del día: primero se paga el repaso, que es lo que
 * ya has aprendido y se te va a olvidar, y lo que sobra se gasta en aprender.
 * Si hoy vencen 18 y el tope son 25, entran 5 nuevas (o las que pidas). Si
 * vencen 25, hoy no entra ninguna y mañana probablemente sí.
 *
 * Esto es lo que impide que la bola de nieve crezca: sin ello, un tope a secas
 * solo aplaza la deuda y la sesión acaba siendo un muro igual.
 */
function huecoParaNuevas() {
  const tope = topeRepaso();
  if (tope === Infinity) return store.settings.daily;
  return Math.max(0, Math.min(store.settings.daily, tope - dueWords().length));
}
const learnedWords = () => store.words.filter((w) => w.box >= 4);

function addWord(raw) {
  // Se llama desde varios sitios (la API, las lecturas, Explorar), así que la
  // guarda va aquí y no solo en quien llama: un null llegando hasta el
  // String(raw.en) tumbaba el render entero.
  if (!raw || typeof raw !== "object") return null;
  const en = String(raw.en || "").trim().toLowerCase();
  if (!en) return null;
  if (store.words.some((w) => w.en === en)) return null;

  const word = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    en,
    es: String(raw.es || "").trim(),
    // Las palabras que genera la IA pueden venir sin guiones: se silabean aquí
    // para que se vean igual que las del banco.
    pron: conGuiones(String(raw.pron || "").trim()),
    example: String(raw.example || "").trim(),
    exampleEs: String(raw.exampleEs || "").trim(),
    cat: raw.cat || store.settings.category,
    added: todayStr(),
    box: 0,
    due: todayStr(),
    reps: 0,
    lapses: 0,
  };
  store.words.push(word);
  return word;
}

/** Aplica la respuesta del repaso: 0 = otra vez, 1 = bien, 2 = fácil. */
function grade(word, result) {
  word.reps += 1;
  if (result === 0) {
    word.lapses += 1;
    word.box = 0;
    word.due = todayStr();
  } else {
    word.box = Math.min(word.box + (result === 2 ? 2 : 1), INTERVALOS.length - 1);
    word.due = addDays(INTERVALOS[word.box]);
  }
  if (store.daily.date === todayStr()) store.daily.done = (store.daily.done || 0) + 1;
  registerStudyDay();
  save();
}

function registerStudyDay() {
  const t = todayStr();
  const { stats } = store;
  if (stats.lastStudy === t) return;
  stats.streak = stats.lastStudy && diffDays(t, stats.lastStudy) === 1 ? stats.streak + 1 : 1;
  stats.best = Math.max(stats.best, stats.streak);
  stats.lastStudy = t;
}

/* ------------------------------------------------------------------ *
 * Generación de palabras nuevas
 * ------------------------------------------------------------------ */

async function fetchNewWords(count) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      count,
      level: store.settings.level,
      category: store.settings.category,
      topic: store.settings.topic,
      known: knownWords(),
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Error ${res.status}`);
  }
  const data = await res.json();
  if (!Array.isArray(data.words)) throw new Error("Respuesta vacía");

  // Se descarta lo que venga mal formado ANTES de tocar nada.
  //
  // El endpoint ya filtra, pero comprobarlo aquí también no es paranoia: basta
  // con que algo por el camino devuelva un 200 con basura para que un null
  // llegue a addWord y reviente. Y como esa excepción se escapaba del try de
  // obtenerPalabras, no saltaba la lista local de reserva: la pantalla se
  // quedaba con el «Preparando tus palabras…» girando para siempre.
  const utiles = data.words.filter(
    (x) => x && typeof x === "object" && ["en", "es", "pron"].every((k) => typeof x[k] === "string" && x[k].trim()),
  );
  if (!utiles.length) throw new Error("Respuesta vacía");
  return utiles;
}

/**
 * Banco de vocabulario generado con scripts/generar-vocabulario.mjs.
 * Si el archivo no existe, la app tira de la lista corta incluida.
 */
let BANCO = [];
async function cargarBanco() {
  try {
    const res = await fetch("./vocabulario.json", { cache: "no-cache" });
    if (!res.ok) return;
    const datos = await res.json();
    if (Array.isArray(datos.words) && datos.words.length) {
      BANCO = datos.words;
      console.info(`[vocab] banco cargado: ${BANCO.length} palabras`);
    }
  } catch (err) {
    // Sin banco se sigue con SEED_WORDS, que son 56 en vez de 1282. La app
    // funciona, pero degradada: los juegos tienen mucho menos material y
    // Explorar se queda casi vacío. Callárselo hacía que ese estado fuera
    // indistinguible del normal, así que al menos queda dicho.
    console.warn("[vocab] no se pudo cargar el banco, sigo con la lista corta:", err.message);
  }
  refrescarPronunciaciones();
}

/**
 * Pone al día la pronunciación de las palabras que ya tenías guardadas.
 *
 * Al añadir una palabra se COPIA su ficha a tus palabras, así que la
 * pronunciación se queda congelada tal y como estaba ese día. Cuando se
 * corrigió la T americana y se metieron los guiones de sílaba, en Explorar
 * salía lo nuevo y en Hoy y en Palabras lo viejo, porque esas dos leen de lo
 * guardado.
 *
 * Se toca SOLO la pronunciación: caja, fechas, repasos y fallos no se rozan.
 * Si la palabra está en el banco se copia la buena de ahí, que además trae las
 * correcciones de sílabas que no se deducen por regla (fám-li, uó-rer). Si no
 * está —porque la generó la IA— al menos se le ponen los guiones.
 */
function refrescarPronunciaciones() {
  const fuente = new Map();
  for (const w of [...SEED_WORDS, ...BANCO]) fuente.set(w.en, w.pron);
  for (const v of IRREGULARES) if (!fuente.has(v.base)) fuente.set(v.base, v.pron.split(" · ")[0]);

  let n = 0;
  for (const w of store.words) {
    const buena = fuente.get(w.en) || conGuiones(w.pron || "");
    if (buena && buena !== w.pron) {
      w.pron = buena;
      n += 1;
    }
  }
  if (n) {
    save();
    console.info(`[vocab] ${n} pronunciaciones puestas al día`);
  }
}

const listaLocal = () => (BANCO.length ? BANCO : SEED_WORDS);

/**
 * Los verbos irregulares como si fueran palabras del banco.
 *
 * No están en vocabulario.json a propósito: allí duplicarían los verbos que ya
 * existen (go, have, take…). Se montan aquí para poder enseñar las tres formas
 * juntas, que es como de verdad se aprenden.
 */
const irregularesComoPalabras = () =>
  IRREGULARES.map((v) => ({
    en: v.base,
    es: v.es,
    pron: v.pron.split(" · ")[0],
    example: `${v.base} · ${v.pasado} · ${v.participio}`,
    exampleEs: v.pron,
    cat: "irregulares",
  }));

/** Vocabulario local de una categoría, sea del banco o de los irregulares. */
function listaLocalPorCat(cat) {
  if (cat === "irregulares") return irregularesComoPalabras();
  const base = listaLocal();
  return cat === "mixto" ? base : base.filter((w) => w.cat === cat);
}

function fetchSeedWords(count) {
  const known = new Set(knownWords());
  const cat = store.settings.category;
  const libres = listaLocal().filter((w) => !known.has(w.en));
  const deLaCategoria = listaLocalPorCat(cat).filter((w) => !known.has(w.en));
  const fuente = deLaCategoria.length ? deLaCategoria : libres;
  // Con un banco grande no interesa ir siempre por el principio de la lista:
  // se coge un tramo al azar para que no salgan siempre las mismas.
  if (fuente.length > count * 4) {
    const desde = Math.floor(Math.random() * (fuente.length - count));
    return fuente.slice(desde, desde + count);
  }
  return fuente.slice(0, count);
}

/** Pide palabras a la API y, si no se puede, tira de la lista local. */
async function obtenerPalabras(count) {
  // Los irregulares son una lista cerrada y conocida: pedírselos a la API sería
  // tirar dinero y arriesgarse a que invente formas que no existen.
  if (store.settings.category === "irregulares") {
    return { words: fetchSeedWords(count), source: "seed" };
  }
  try {
    return { words: await fetchNewWords(count), source: "api" };
  } catch (err) {
    console.warn("[vocab] usando lista local:", err.message);
    return { words: fetchSeedWords(count), source: "seed" };
  }
}

/** Devuelve las palabras de hoy, generándolas la primera vez que se abre en el día. */
async function ensureDailyBatch() {
  const t = todayStr();
  if (store.daily.date === t && store.daily.ids.length) {
    return { words: store.daily.ids.map(byId).filter(Boolean), source: "cache" };
  }

  // El tope del día es un presupuesto: primero el repaso, y solo lo que sobre
  // se gasta en palabras nuevas. Si hoy no cabe ninguna, hoy toca ponerse al
  // día, que es justo lo que evita la bola de nieve.
  const cuantas = huecoParaNuevas();
  if (!cuantas) {
    store.daily = { date: t, ids: [], done: store.daily.date === t ? store.daily.done || 0 : 0 };
    save();
    return { words: [], source: "sin-hueco" };
  }

  const { words: incoming, source } = await obtenerPalabras(cuantas);
  const added = incoming.map(addWord).filter(Boolean);
  store.daily = { date: t, ids: added.map((w) => w.id), done: 0 };
  // Aquí NO se registra día de estudio. Esto corre solo al abrir la app, porque
  // Hoy es la vista de entrada: si contara, la racha premiaría abrir la app y
  // cerrarla, y dejaría de medir nada. La racha sube cuando repasas, juegas,
  // haces una lección, lees o añades una palabra — no cuando aparecen.
  save();

  return { words: added, source };
}

/* ------------------------------------------------------------------ *
 * Audio
 * ------------------------------------------------------------------ */

let voice = null;
let speechRun = 0;
let vozRevisada = false; // evita avisar varias veces mientras cargan las voces
function pickVoice() {
  const voices = speechSynthesis.getVoices();
  if (!voices.length) return; // aún no han cargado; volverá a llamarse con onvoiceschanged

  voice =
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => v.lang?.startsWith("en")) ||
    null;

  // Sin voz, el navegador lee el texto igualmente pero con la voz que tenga
  // puesta por defecto (a menudo la del sistema en español), sin avisar de
  // nada. Para una app que va justo de pronunciación, eso es peor que un
  // error: suena a inglés real y no lo es. Algunos móviles Android vienen
  // sin ningún paquete de voz en inglés instalado.
  //
  // Ojo: esta primera llamada a pickVoice() ocurre nada más cargar el
  // script, antes de que toast()/$ estén definidos más abajo en el archivo.
  // En Chrome de escritorio getVoices() suele devolver vacío la primera vez
  // (de ahí el "return" de arriba) y las voces llegan luego por
  // onvoiceschanged, ya con todo cargado. Pero en algunos navegadores
  // (WebKit, ciertos Android) getVoices() responde ya lleno en la primera
  // llamada síncrona, y llamar a toast() en ese instante rompía la app
  // entera con "Cannot access '$' before initialization". Con setTimeout se
  // aplaza a la cola de tareas, cuando el módulo ya ha terminado de cargar.
  if (!voice && !vozRevisada) {
    vozRevisada = true;
    setTimeout(() => toast("Este dispositivo no tiene voz en inglés. Instálala en Ajustes → Accesibilidad → Texto a voz."), 0);
  }
}
if ("speechSynthesis" in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

function speak(text, { cancel = true } = {}) {
  if (!("speechSynthesis" in window)) {
    toast("Tu navegador no soporta audio");
    return Promise.resolve();
  }
  if (cancel) {
    speechRun += 1;
    speechSynthesis.cancel();
  }
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.9;
    if (voice) u.voice = voice;
    u.onend = resolve;
    u.onerror = resolve;
    speechSynthesis.speak(u);
  });
}

/* ------------------------------------------------------------------ *
 * Helpers de DOM
 * ------------------------------------------------------------------ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 2600);
}

function wordCard(w, { blurred = false } = {}) {
  const hide = blurred ? " hidden-until-reveal" : "";
  return `
    <article class="card${blurred ? " is-tapada" : ""}" data-id="${w.id}">
      <div class="card-top">
        <div>
          <p class="word" lang="en">${esc(w.en)}</p>
          <div class="meta-row">
            <span class="pron${hide}">${esc(w.pron || "—")}</span>
            ${w.cat && w.cat !== "mixto" ? `<span class="cat-chip">${esc(nombreCategoria(w.cat))}</span>` : ""}
          </div>
        </div>
        <button class="speak" data-speak="${esc(w.en)}" title="Escuchar" aria-label="Escuchar">🔊</button>
      </div>
      ${blurred ? `<p class="tap-hint">Toca para ver la traducción</p>` : ""}
      <p class="translation${hide}">${esc(w.es)}</p>
      ${
        w.example
          ? `<p class="example${hide}">${esc(w.example)}<em>${esc(w.exampleEs)}</em></p>`
          : ""
      }
    </article>`;
}

/* ------------------------------------------------------------------ *
 * Vista: Hoy
 * ------------------------------------------------------------------ */

function renderStepper() {
  const n = store.settings.daily;
  $("#cuantas").textContent = n;
  $("#menos").disabled = n <= 1;
  $("#mas").disabled = n >= 50;
  renderPlanResumen();
}

/**
 * La línea que resume el plan cuando está plegado.
 *
 * El objetivo y la categoría se eligen una vez, pero ocupaban los primeros
 * 470px de la pantalla todos los días. Plegados, se ven de un vistazo y se
 * abren cuando de verdad quieres cambiarlos.
 */
function renderPlanResumen() {
  const cat = CATEGORIAS.find((c) => c.id === store.settings.category);
  $("#plan-resumen").textContent = `Objetivo ${store.settings.daily} · ${cat ? cat.nombre : "Un poco de todo"}`;
}

function togglePlan(abrir) {
  const config = $("#plan-config");
  const boton = $("#plan-toggle");
  const abierto = abrir ?? config.hidden;
  config.hidden = !abierto;
  boton.setAttribute("aria-expanded", String(abierto));
  boton.querySelector(".plan-editar").textContent = abierto ? "Listo" : "Cambiar";
}

function cambiarDiarias(n) {
  store.settings.daily = Math.min(Math.max(n, 1), 50);
  save();
  renderStepper();
  if ($("#set-daily")) {
    $("#set-daily").value = store.settings.daily;
    $("#daily-valor").textContent = store.settings.daily;
  }
  updateMoreButtonLabel();
}

function updateMoreButtonLabel() {
  const btn = $("#more-words");
  if (!btn) return;
  const hoy = store.daily.date === todayStr() ? store.daily.ids.map(byId).filter(Boolean).length : 0;
  const faltan = Math.max(store.settings.daily - hoy, 0);
  btn.textContent = `+ ${faltan ? `Completar objetivo · ${faltan}` : "Más palabras"}`;
}

function renderChipsCategoria() {
  const cont = $("#chips-categoria");
  cont.innerHTML = CATEGORIAS.map(
    (c) =>
      `<button class="chip ${store.settings.category === c.id ? "is-active" : ""}" data-cat="${c.id}" aria-pressed="${store.settings.category === c.id}">${esc(c.nombre)}</button>`,
  ).join("");

  $$(".chip", cont).forEach((b) => {
    b.onclick = async () => {
      if (store.settings.category === b.dataset.cat) return;
      store.settings.category = b.dataset.cat;
      save();
      renderChipsCategoria();
      renderPlanResumen();
      await addMoreWords();
    };
  });
}

async function renderHoy() {
  renderStepper();
  renderChipsCategoria();
  const cards = $("#hoy-cards");
  const sub = $("#hoy-sub");
  const actions = $("#hoy-actions");

  cards.innerHTML = `<div class="spinner"></div>`;
  actions.innerHTML = "";
  sub.textContent = "Preparando tus palabras…";

  const { words, source } = await ensureDailyBatch();

  if (!words.length) {
    // Dos motivos muy distintos para no tener palabras nuevas hoy, y hay que
    // decir cuál es: agotar el banco no tiene nada que ver con ir atrasado.
    const pendientes = dueWords().length;
    cards.innerHTML =
      source === "sin-hueco"
        ? `<div class="empty">
             <span class="big">⏳</span>
             Hoy no tocan palabras nuevas: tienes <b>${pendientes}</b> por repasar
             y el tope del día son <b>${store.settings.maxRepaso}</b>.
             <br />Ponte al día y mañana vuelven a entrar.
           </div>
           <p class="hint-line">
             Es a propósito: si entraran igual, el repaso crecería sin parar
             hasta hacerse imposible. Puedes subir el tope en Ajustes.
           </p>`
        : `<div class="empty"><span class="big">🎉</span>Ya has visto todas las palabras disponibles.<br />Configura la API para recibir palabras nuevas.</div>`;
    sub.textContent = source === "sin-hueco" ? "Primero el repaso" : "";
    actions.innerHTML = "";
    return;
  }

  sub.textContent =
    source === "seed"
      ? `${words.length} palabras de la lista local`
      : `${words.length} palabras nuevas · nivel ${store.settings.level}`;

  const aviso =
    source === "seed"
      ? `<div class="callout callout-tip compacto">
           <b>Lista local</b>
           <p>Para palabras nuevas cada día, pon tu <code>ANTHROPIC_API_KEY</code> en
           <code>.env.local</code>. Lo demás funciona igual.</p>
         </div>`
      : "";

  cards.innerHTML = aviso + words.map((w) => wordCard(w, { blurred: store.settings.tapar })).join("");

  const faltanObjetivo = Math.max(store.settings.daily - words.length, 0);
  // Aquí solo van las tres herramientas que actúan sobre las tarjetas, y por
  // eso van encima de ellas. El "Repasar ahora" que había se quitó: la barra
  // del día, justo arriba, ya dice "Repasar N" y está en todas las secciones,
  // así que era el mismo botón dos veces y empujaba las palabras fuera de la
  // pantalla.
  actions.innerHTML = `
    <button class="btn btn-ghost" id="listen-all"><span aria-hidden="true">🔊</span> Escuchar</button>
    <button class="btn btn-ghost" id="more-words">+ ${faltanObjetivo ? `Completar objetivo · ${faltanObjetivo}` : "Más palabras"}</button>
    <button class="btn btn-quiet" id="toggle-tapar">${store.settings.tapar ? "👁 Mostrar" : "🙈 Ocultar"}</button>`;

  $("#listen-all").onclick = async () => {
    const btn = $("#listen-all");
    const run = ++speechRun;
    btn.disabled = true;
    btn.innerHTML = `<span aria-hidden="true">🔊</span> Escuchando…`;
    speechSynthesis.cancel();
    for (const w of words) {
      if (run !== speechRun) break;
      await speak(w.en, { cancel: false });
    }
    btn.disabled = false;
    btn.innerHTML = `<span aria-hidden="true">🔊</span> Escuchar`;
  };
  $("#more-words").onclick = () => addMoreWords();
  $("#toggle-tapar").onclick = () => {
    store.settings.tapar = !store.settings.tapar;
    save();
    renderHoy();
    toast(store.settings.tapar ? "Toca cada tarjeta para descubrirla" : "Traducciones a la vista");
  };

  updateChrome();
}

/** Pide otra tanda de palabras sin esperar a mañana (útil al cambiar de tema). */
async function addMoreWords() {
  const btn = $("#more-words");
  btn.disabled = true;
  btn.textContent = "Generando…";
  try {
    const hoy = store.daily.date === todayStr() ? store.daily.ids.map(byId).filter(Boolean).length : 0;
    const faltanObjetivo = Math.max(store.settings.daily - hoy, 0);
    const cantidad = faltanObjetivo || store.settings.daily;
    const { words: incoming, source } = await obtenerPalabras(cantidad);
    const added = incoming.map(addWord).filter(Boolean);

    if (!added.length) {
      toast("No quedan palabras nuevas de ese tipo en la lista local.");
      return;
    }

    store.daily.ids.push(...added.map((w) => w.id));
    save();
    $("#hoy-cards").insertAdjacentHTML(
      "beforeend",
      added.map((w) => wordCard(w, { blurred: store.settings.tapar })).join(""),
    );
    $("#hoy-sub").textContent = `${store.daily.ids.length} palabras hoy · ${nombreCategoria(store.settings.category).toLowerCase()}`;
    toast(`+${added.length} ${source === "seed" ? "de la lista local" : "palabras nuevas"}`);
  } finally {
    btn.disabled = false;
    updateMoreButtonLabel();
  }
  updateChrome();
}

/* ------------------------------------------------------------------ *
 * Vista: Repaso (tarjetas)
 * ------------------------------------------------------------------ */

let queue = [];
let queueTotal = 0;
let aplazadas = 0; // vencidas que no caben hoy: van las primeras mañana
let repaso = null; // pregunta en curso: { escribir, opciones, resuelto, acertada… }
let repasoExtra = false; // vuelta voluntaria: no toca las fechas de repaso

/**
 * A partir de esta caja la palabra deja de salir con opciones y hay que
 * escribirla.
 *
 * Elegir entre tres es reconocer; escribirla de cero es recordar, que graba
 * mucho más. Pero recordar de cero una palabra que viste ayer solo produce
 * bloqueo. Así que las nuevas salen con opciones y, según se asientan, se
 * retira la ayuda.
 */
const CAJA_ESCRIBIR = 3;

function prepararPregunta() {
  const w = queue[0].w;
  repaso = {
    escribir: w.box >= CAJA_ESCRIBIR,
    opciones: null,
    resuelto: false,
    acertada: false,
    rendida: false,
    texto: "",
    sinonimo: null,
  };
  // Dos opciones falsas de significado distinto: si saliera un sinónimo,
  // habría dos respuestas buenas y una contaría como fallo.
  if (!repaso.escribir) repaso.opciones = mezclar([w, ...distractores(gamePool(), w, 2)]);
}

/**
 * Pasa a la siguiente. nivel 0 = fallada (vuelve a la cola), 1 = bien, 2 = fácil.
 *
 * En repaso extra no se califica al acertar: adelantar la fecha de una palabra
 * solo porque la repasas de más rompería el espaciado, que es justo lo que
 * hace que funcione. Fallar sí cuenta siempre (ya lo hizo penalizar): si no la
 * sabes, no la sabes, y da igual que sea una vuelta voluntaria.
 */
function avanzarRepaso(nivel) {
  if (!repasoExtra) grade(queue[0].w, nivel);
  if (nivel === 0) queue.push(queue.shift());
  else queue.shift();
  repaso = null;
  renderRepaso(false);
}

/** Monta una vuelta extra con palabras que ya sabes, sin tocar sus fechas. */
function iniciarRepasoExtra() {
  const suyas = store.words.filter((w) => w.en);
  if (!suyas.length) return;
  repasoExtra = true;
  queue = mezclar(suyas)
    .slice(0, 20)
    .map((w) => ({ w, dir: w.box > 0 && Math.random() < 0.34 ? "es-en" : "en-es" }));
  queueTotal = queue.length;
  repaso = null;
  renderRepaso(false);
}

function resolverRepaso({ acertada, rendida = false, texto = "", sinonimo = null }) {
  Object.assign(repaso, { resuelto: true, acertada, rendida, texto, sinonimo });
  const w = queue[0].w;
  if (!acertada) penalizar(w);
  renderRepaso(false);
  speak(w.en); // oír la palabra justo al descubrirla ayuda a fijarla
}

function renderRepaso(restart = true) {
  const box = $("#quiz");
  const sub = $("#repaso-sub");

  if (restart) {
    repasoExtra = false;
    // Una de cada tres sale al revés (español → inglés), que cuesta más y fija mejor.
    // Las palabras nuevas (caja 0) siempre salen de inglés a español.
    //
    // Las que se te resisten van primero: son las que menos veces has visto
    // bien y las que más se benefician de que las pilles con la cabeza fresca,
    // no al final de la sesión cuando ya estás cansado.
    // colaDeHoy() ya viene ordenada por prioridad y cortada por el tope: las
    // que más te cuestan delante, y nunca más palabras de las que caben en una
    // sesión. Aquí solo se baraja DENTRO de bloques de misma prioridad, para
    // que no salga siempre el mismo orden sin romper la prioridad.
    queue = colaDeHoy()
      .map((w) => ({ w, r: Math.random() }))
      .sort((a, b) => prioridad(b.w) - prioridad(a.w) || a.r - b.r)
      .map(({ w }) => ({ w, dir: w.box > 0 && Math.random() < 0.34 ? "es-en" : "en-es" }));
    queueTotal = queue.length;
    aplazadas = Math.max(0, dueWords().length - queue.length);
    repaso = null;
  }

  if (!queue.length) {
    const proxima = store.words
      .map((w) => w.due)
      .sort()
      .find((d) => d > todayStr());
    const puedeRepetir = store.words.length >= 4;
    // Terminar el repaso no es terminar la sesión: en vez de dejarte mirando
    // un "ya está" sin salida, se encadena con el juego que te viene bien.
    // (Las palabras nuevas no hacen falta ofrecerlas aquí: ensureDailyBatch
    // las prepara al arrancar, así que a estas alturas ya las tienes.)
    const sugerido = juegoRecomendado();
    sub.textContent = "";
    box.innerHTML = `
      <div class="empty">
        <span class="big">✅</span>
        ${repasoExtra ? "Vuelta extra terminada." : "Repaso al día."}
        ${proxima ? `<br />Vuelve el ${new Date(proxima).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}.` : ""}
      </div>
      ${
        sugerido
          ? `<button class="sugerido" data-juego="${esc(sugerido.id)}">
               <span class="sugerido-eyebrow">Sigue la sesión</span>
               <span class="sugerido-nombre">${sugerido.def.emoji} ${esc(sugerido.def.nombre)}</span>
               <span class="sugerido-motivo">${esc(sugerido.motivo)}</span>
             </button>`
          : ""
      }
      ${
        puedeRepetir
          ? `<div class="row-actions">
               <button class="btn btn-ghost" id="repetir-repaso">🔁 Repasar otra vez</button>
             </div>
             <p class="hint-line">
               Una vuelta voluntaria con tus palabras. No cambia las fechas de
               repaso: acertar aquí no aleja la palabra, pero fallarla sí la
               devuelve a la cola de hoy.
             </p>`
          : ""
      }`;
    if (puedeRepetir) $("#repetir-repaso").onclick = () => iniciarRepasoExtra();
    updateChrome();
    return;
  }

  if (!repaso) prepararPregunta();

  const { w, dir } = queue[0];
  const hechas = queueTotal - queue.length;
  // Escribir siempre va del español al inglés: producir la palabra es lo que cuesta.
  const alReves = repaso.escribir || dir === "es-en";
  sub.textContent =
    `${hechas + 1} de ${queueTotal}` +
    (repasoExtra ? " · vuelta extra, no cuenta para las fechas" : "") +
    (aplazadas ? ` · ${aplazadas} ${aplazadas === 1 ? "queda" : "quedan"} para mañana` : "");

  const progreso = `<div class="quiz-progress"><span style="width:${(hechas / queueTotal) * 100}%"></span></div>`;

  // Cara vista mientras respondes
  const pregunta = alReves
    ? `<p class="quiz-dir">español → inglés</p>
       <p class="word">${esc(w.es)}</p>`
    : `<p class="word" lang="en">${esc(w.en)}</p>
       <button class="speak" data-speak="${esc(w.en)}" aria-label="Escuchar">🔊</button>`;

  // Ficha completa, ya resuelta
  const ficha = `
    <p class="word" lang="en">${esc(w.en)}</p>
    <span class="pron">${esc(w.pron || "—")}</span>
    <p class="translation">${esc(w.es)}</p>
    ${w.example ? `<p class="example" lang="en">${esc(w.example)}<em lang="es">${esc(w.exampleEs)}</em></p>` : ""}
    <button class="speak" data-speak="${esc(w.en)}" aria-label="Escuchar">🔊</button>`;

  if (!repaso.resuelto) {
    box.innerHTML = `
      ${progreso}
      <article class="card quiz-card" data-id="${w.id}">
        ${pregunta}
        <p class="quiz-hint">${repaso.escribir ? "Ya la dominas: escríbela sin ayuda." : alReves ? "¿Cómo se dice en inglés?" : "¿Qué significa?"}</p>
      </article>
      ${
        repaso.escribir
          ? `<input id="resp-repaso" class="input input-big" type="text" placeholder="Escribe aquí…"
                    autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" />
             <div class="row-actions">
               <button class="btn" id="comprobar-repaso">Comprobar</button>
               <button class="btn btn-nose" id="nose">🤷 No la sé</button>
             </div>`
          : `<div class="options" id="op-repaso">
               ${repaso.opciones
                 .map((o) => `<button class="option" data-en="${esc(o.en)}">${esc(alReves ? o.en : o.es)}</button>`)
                 .join("")}
             </div>
             <button class="btn btn-nose" id="nose">🤷 No lo sé</button>`
      }`;

    if (repaso.escribir) {
      const input = $("#resp-repaso");
      input.focus({ preventScroll: true });
      // Vale cualquier palabra con el mismo significado: para "casi" valen
      // "almost" y "nearly", y dar una por fallo sería injusto.
      const validas = [w, ...gamePool().filter((x) => x.en !== w.en && mismoEs(x, w))];
      const comprobar = () => {
        const acierto = validas.find((x) => norm(input.value) === norm(x.en));
        resolverRepaso({
          acertada: Boolean(acierto),
          texto: input.value,
          sinonimo: acierto && acierto.en !== w.en ? w.en : null,
        });
      };
      input.onkeydown = (e) => {
        if (e.key === "Enter") comprobar();
      };
      $("#comprobar-repaso").onclick = comprobar;
    } else {
      $$("#op-repaso .option").forEach((b) => {
        b.onclick = () => {
          const acertada = b.dataset.en === w.en;
          if (!acertada) registrarConfusion(w.en, b.dataset.en);
          resolverRepaso({ acertada });
        };
      });
    }
    $("#nose").onclick = () => resolverRepaso({ acertada: false, rendida: true });
    return;
  }

  // --- Resuelta ---
  const tono = repaso.acertada ? "ok" : repaso.rendida ? "nose" : "ko";
  const titulo = repaso.acertada
    ? "Correcto"
    : repaso.rendida
      ? "Bien reconocerlo — la repites hoy"
      : "No era esa — la repites hoy";

  box.innerHTML = `
    ${progreso}
    <article class="card quiz-card" data-id="${w.id}">${ficha}</article>
    <div class="explain ${tono}" aria-live="polite">
      <b>${titulo}</b>
      ${repaso.sinonimo ? `<p>También vale <b lang="en">${esc(repaso.sinonimo)}</b>.</p>` : ""}
      ${!repaso.acertada && repaso.texto ? `<p>Escribiste «${esc(repaso.texto)}».</p>` : ""}
    </div>
    <div class="row-actions">
      ${
        repaso.acertada
          ? `<button class="btn btn-good" data-grade="1">Bien</button>
             <button class="btn btn-easy" data-grade="2">Fácil</button>`
          : `<button class="btn" id="next-repaso">Siguiente</button>`
      }
    </div>`;

  if (repaso.acertada) {
    $$("[data-grade]", box).forEach((btn) => {
      btn.onclick = () => avanzarRepaso(Number(btn.dataset.grade));
    });
  } else {
    $("#next-repaso").onclick = () => avanzarRepaso(0);
  }
}

/* ------------------------------------------------------------------ *
 * Vista: Lista
 * ------------------------------------------------------------------ */

const esDificil = (w) => w.lapses >= 2;

function renderLista() {
  const q = $("#buscador").value.trim().toLowerCase();
  const filtro = $("#filtro-lista").value;

  const items = store.words
    .filter((w) => !q || w.en.includes(q) || w.es.toLowerCase().includes(q))
    .filter((w) => {
      if (filtro === "dificiles") return esDificil(w);
      if (filtro === "hoy") return w.due <= todayStr();
      if (filtro === "dominadas") return w.box >= 4;
      return true;
    })
    .sort((a, b) => (a.added < b.added ? 1 : -1));

  const dificiles = store.words.filter(esDificil).length;
  $("#lista-sub").textContent =
    `${store.words.length} palabras · ${learnedWords().length} dominadas` +
    (dificiles ? ` · ${dificiles} que se te resisten` : "");

  $("#lista").innerHTML = items.length
    ? items
        .map((w) => {
          const estado = w.box >= 4 ? "learned" : w.due <= todayStr() ? "due" : "";
          const titulo =
            estado === "learned" ? "Ya dominada" : estado === "due" ? "Toca repasarla" : "En repaso";
          const marca = esDificil(w) ? ` <span class="dificil" title="La has fallado ${w.lapses} veces">difícil</span>` : "";
          return `<tr>
            <td class="cell-en"><span class="dot ${estado}" title="${titulo}"></span>${esc(w.en)}${marca}</td>
            <td class="cell-pron">(${esc(w.pron || "—")})</td>
            <td class="cell-es">${esc(w.es)}</td>
            <td class="cell-audio">
              <button class="speak speak-sm" data-speak="${esc(w.en)}" aria-label="Escuchar ${esc(w.en)}">🔊</button>
              <button class="speak speak-sm speak-del" data-borrar="${w.id}" aria-label="Borrar ${esc(w.en)}" title="Borrar">✕</button>
            </td>
          </tr>`;
        })
        .join("")
    : `<tr><td colspan="4"><div class="empty">Sin resultados.</div></td></tr>`;
}

/* ------------------------------------------------------------------ *
 * Explorar: ojear vocabulario por categoría, sin límite, a tu ritmo.
 * No es una lección ni un juego: no puntúa, no corrige, no presiona. Solo
 * pasas palabras, y la que te interese la añades a tus palabras con un toque.
 * ------------------------------------------------------------------ */

let explorar = { cat: "mixto", pool: [], idx: 0, vueltas: 0 };
let listaModo = "mis"; // "mis" | "explorar"

/** Baraja del banco para una categoría. Vacío si esa categoría aún no tiene palabras. */
function poolExplorar(cat) {
  return mezclar(listaLocalPorCat(cat));
}

function iniciarExplorar(cat = explorar.cat) {
  explorar = { cat, pool: poolExplorar(cat), idx: 0, vueltas: 0 };
  renderExplorarChips();
  renderExplorarCard();
}

function renderExplorarChips() {
  const cont = $("#chips-explorar");
  cont.innerHTML = CATEGORIAS.map(
    (c) =>
      `<button class="chip ${explorar.cat === c.id ? "is-active" : ""}" data-cat="${c.id}" aria-pressed="${explorar.cat === c.id}">${esc(c.nombre)}</button>`,
  ).join("");

  $$(".chip", cont).forEach((b) => {
    b.onclick = () => {
      if (explorar.cat === b.dataset.cat) return;
      iniciarExplorar(b.dataset.cat);
    };
  });
}

/** delta=+1 siguiente, -1 anterior. Al pasar del final, se reordena y sigue: nunca se acaba. */
function moverExplorar(delta) {
  if (!explorar.pool.length) return;
  explorar.idx += delta;
  if (explorar.idx >= explorar.pool.length) {
    explorar.pool = poolExplorar(explorar.cat);
    explorar.idx = 0;
    explorar.vueltas += 1;
  } else if (explorar.idx < 0) {
    explorar.pool = poolExplorar(explorar.cat);
    explorar.idx = explorar.pool.length - 1;
  }
  renderExplorarCard();
}

function renderExplorarCard() {
  const box = $("#explorar-card");
  if (!box) return;

  if (!explorar.pool.length) {
    box.innerHTML = `
      <div class="empty">
        <span class="big">🔍</span>
        Aún no hay palabras de «${esc(nombreCategoria(explorar.cat))}» en la lista local.
        <br />Prueba con otra categoría, o genera el banco completo con <code>npm run vocabulario</code>.
      </div>
      <div class="row-actions">
        <button class="btn btn-ghost" id="explorar-mixto">Ver «Un poco de todo»</button>
      </div>`;
    $("#explorar-mixto").onclick = () => iniciarExplorar("mixto");
    return;
  }

  const w = explorar.pool[explorar.idx];
  const yaLaTiene = store.words.some((x) => x.en === w.en);

  box.innerHTML = `
    <div class="game-hud">
      <span class="hud-time">${explorar.idx + 1} / ${explorar.pool.length}${explorar.vueltas ? ` · vuelta ${explorar.vueltas + 1}` : ""}</span>
      <span class="hud-score">${esc(nombreCategoria(explorar.cat))}</span>
    </div>
    ${wordCard(w)}
    <div class="row-actions">
      <button class="btn btn-ghost" id="explorar-anterior">← Anterior</button>
      <button class="btn" id="explorar-siguiente">Siguiente →</button>
    </div>
    <button class="btn ${yaLaTiene ? "btn-ghost" : ""}" id="explorar-add" ${yaLaTiene ? "disabled" : ""}>
      ${yaLaTiene ? "✓ Ya la tienes" : "+ Añadir a mis palabras"}
    </button>`;

  $("#explorar-anterior").onclick = () => moverExplorar(-1);
  $("#explorar-siguiente").onclick = () => moverExplorar(1);
  if (!yaLaTiene) {
    $("#explorar-add").onclick = () => {
      const nueva = addWord(w);
      if (!nueva) return;
      registerStudyDay();
      save();
      toast(`«${w.en}» añadida a tus palabras`);
      renderExplorarCard();
      updateChrome();
    };
  }
}

function cambiarModoLista(modo) {
  listaModo = modo;
  const modos = { mis: "#modo-mis-palabras", explorar: "#modo-explorar", verbos: "#modo-verbos" };
  for (const [id, sel] of Object.entries(modos)) {
    $(sel).classList.toggle("is-active", modo === id);
    $(sel).setAttribute("aria-selected", String(modo === id));
  }
  $("#panel-mis-palabras").hidden = modo !== "mis";
  $("#panel-explorar").hidden = modo !== "explorar";
  $("#panel-verbos").hidden = modo !== "verbos";

  if (modo === "explorar") {
    if (!explorar.pool.length) iniciarExplorar();
    else renderExplorarCard(); // por si has añadido/borrado palabras mientras tanto
  }
  if (modo === "verbos") renderPanelVerbos();
}

/* ------------------------------------------------------------------ *
 * Verbos: irregulares y tabla de tiempos
 *
 * Un español ve "he goes" y "he went" como dos cosas sueltas. Verlas en una
 * sola tabla enseña de golpe lo que de verdad pasa: el inglés casi no
 * conjuga, monta los tiempos con auxiliares y solo cambian cinco formas.
 * ------------------------------------------------------------------ */

let verboAbierto = null;
let filtroVerbo = "";
let tipoVerbo = "todos"; // todos | irregulares | regulares

// Los irregulares se pintan enteros: son la lista que se memoriza y hay que
// poder recorrerla de arriba abajo. Los regulares no, que son cientos y todos
// hacen lo mismo: ahí se busca el que quieras y punto.
const TOPE_REGULARES = 80;

function renderPanelVerbos() {
  const lista = verbosConjugables(listaLocal());
  const q = norm(filtroVerbo);
  const delTipo = lista.filter(
    (v) => tipoVerbo === "todos" || (tipoVerbo === "irregulares" ? v.irregular : !v.irregular),
  );
  const casan = q ? delTipo.filter((v) => v.base.startsWith(q) || norm(v.es).includes(q)) : delTipo;
  const tope = tipoVerbo === "irregulares" ? casan.length : TOPE_REGULARES;
  const visibles = casan.slice(0, tope);

  $$("#chips-verbos .chip").forEach((c) => c.classList.toggle("is-active", c.dataset.tipo === tipoVerbo));

  const nIrr = lista.filter((v) => v.irregular).length;
  $("#verbos-cuenta").textContent = !casan.length
    ? ""
    : visibles.length < casan.length
      ? `Mostrando ${visibles.length} de ${casan.length}. Busca arriba para llegar al que quieras.`
      : tipoVerbo === "irregulares"
        ? `Los ${casan.length} verbos irregulares, de la a a la z.`
        : `${casan.length} verbos · ${nIrr} irregulares (★).`;

  $("#lista-verbos").innerHTML = visibles.length
    ? visibles
        .map(
          (v) =>
            `<button class="verb-chip ${v.base === verboAbierto ? "is-active" : ""} ${v.irregular ? "is-irregular" : ""}" data-verbo="${esc(v.base)}">
               ${esc(v.base)}${v.irregular ? '<span class="verb-mark" title="Irregular">★</span>' : ""}
             </button>`,
        )
        .join("")
    : `<p class="muted">Ningún verbo con «${esc(filtroVerbo)}».</p>`;

  $$("#lista-verbos [data-verbo]").forEach((b) => {
    b.onclick = () => {
      verboAbierto = b.dataset.verbo;
      renderPanelVerbos();
      $("#verbo-detalle").scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
  });

  renderVerboDetalle(lista);
}

function renderVerboDetalle(lista) {
  const box = $("#verbo-detalle");
  if (!verboAbierto) {
    box.innerHTML = `<div class="empty"><span class="big">🔤</span>Toca un verbo para ver todos sus tiempos.<br />Los marcados con ★ son irregulares.</div>`;
    return;
  }

  const meta = lista.find((v) => v.base === verboAbierto);
  const c = conjugar(verboAbierto, { es: meta?.es || "" });
  if (!c) return;

  const f = c.formas;
  // Solo los irregulares traen pronunciación de las tres formas: es justo
  // donde no se adivina (read → "red", wound → "uáund").
  const prons = c.pron ? c.pron.split(" · ") : [];
  const dice = (n) => (prons[n] ? `<span class="verbo-pron">${esc(prons[n])}</span>` : "");

  box.innerHTML = `
    <article class="card verbo-card">
      <div class="verbo-head">
        <div>
          <p class="word" lang="en">${esc(c.base)}</p>
          <p class="translation">${esc(c.es)}</p>
        </div>
        <span class="verbo-tag ${c.irregular ? "is-irregular" : c.modal ? "is-modal" : ""}">
          ${c.modal ? "Modal" : c.irregular ? "★ Irregular" : "Regular"}
        </span>
      </div>

      <div class="verbo-formas">
        <div><small>infinitivo</small><b lang="en">${esc(c.base)}</b>${dice(0)}</div>
        <div><small>3ª persona</small><b lang="en">${esc(f.tercera)}</b></div>
        <div><small>gerundio</small><b lang="en">${esc(f.gerundio || "—")}</b></div>
        <div><small>pasado</small><b lang="en">${esc(f.pasado)}</b>${dice(1)}</div>
        <div><small>participio</small><b lang="en">${esc(f.participio)}</b>${dice(2)}</div>
      </div>

      ${
        c.irregular
          ? `<button class="btn btn-ghost btn-oir-tres" data-speak="${esc(c.base)} , ${esc(String(f.pasado).replace("/", " or "))} , ${esc(f.participio)}">🔊 Oír las tres formas seguidas</button>`
          : ""
      }
      ${c.nota ? `<p class="verbo-aviso">💡 ${esc(c.nota)}</p>` : ""}

      <div class="table-wrap">
        <table class="word-table verbo-tabla">
          <thead>
            <tr><th>Tiempo</th><th>yo</th><th>él / ella</th></tr>
          </thead>
          <tbody>
            ${c.tiempos
              .map(
                // data-quien reetiqueta las columnas en móvil, donde la tabla
                // se apila en bloques y la cabecera deja de verse.
                (t) => `<tr>
                  <td class="cell-en">${esc(t.nombre)}<small class="verbo-nota">${esc(t.nota)}</small></td>
                  <td lang="en" data-quien="yo">${esc(t.yo)}<button class="speak speak-sm" data-speak="${esc(t.yo)}" aria-label="Escuchar">🔊</button></td>
                  <td lang="en" data-quien="él / ella">${esc(t.el)}<button class="speak speak-sm" data-speak="${esc(t.el)}" aria-label="Escuchar">🔊</button></td>
                </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </article>`;
}

/* ------------------------------------------------------------------ *
 * Vista: Juegos
 * ------------------------------------------------------------------ */

const JUEGOS = [
  {
    id: "rapida",
    emoji: "⚡",
    nombre: "Respuesta rápida",
    desc: "60 segundos. Te doy la traducción, eliges la palabra en inglés.",
    minimo: 4,
    record: "puntos",
  },
  {
    id: "hueco",
    emoji: "🎯",
    nombre: "Completa la frase",
    desc: "Una frase real con un hueco. Elige la palabra que encaja.",
    minimo: 4,
    record: "aciertos",
  },
  {
    id: "escribe",
    emoji: "✍️",
    nombre: "Escríbela",
    desc: "Escuchas y ves el significado. Tú la escribes en inglés.",
    minimo: 4,
    record: "aciertos",
  },
  {
    id: "parejas",
    emoji: "🔗",
    nombre: "Emparejar",
    desc: "Seis parejas inglés–español contra el reloj.",
    minimo: 6,
    record: "tiempo",
  },
  {
    id: "escucha",
    emoji: "🎧",
    nombre: "Escucha y elige",
    desc: "Oyes la palabra, sin verla escrita. Adivina qué significa entre cuatro opciones.",
    minimo: 4,
    record: "aciertos",
  },
  {
    id: "ordena",
    emoji: "🔤",
    nombre: "Ordena las letras",
    desc: "Toca las letras en el orden correcto para formar la palabra en inglés. Si te atascas, la pista te coloca la siguiente.",
    minimo: 4,
    record: "aciertos",
  },
  {
    id: "hablar",
    emoji: "🎤",
    nombre: "Pronúncialo",
    desc: "La lees en voz alta y el móvil te dice si te ha entendido. Y qué ha oído en su lugar.",
    minimo: 4,
    record: "aciertos",
  },
  {
    id: "dictado",
    emoji: "✏️",
    nombre: "Dictado",
    desc: "Escuchas una frase entera y la escribes. Aquí es donde el inglés se encadena y cuesta.",
    minimo: 4,
    record: "aciertos",
  },
  {
    id: "irregulares",
    emoji: "🧩",
    nombre: "Verbos irregulares",
    desc: `go · went · gone. Te falta una forma y la escribes. Los ${IRREGULARES.length} verbos irregulares.`,
    minimo: 0,
    record: "aciertos",
  },
  {
    id: "modales",
    emoji: "🔑",
    nombre: "Verbos modales",
    desc: "can, must, should, would… Las tres opciones son posibles: decide el sentido.",
    minimo: 0,
    record: "aciertos",
  },
  {
    id: "frases",
    emoji: "🗣️",
    nombre: "Frases hechas",
    desc: "Te doy la situación y eliges qué se dice de verdad en inglés. Con el porqué al final.",
    minimo: 0,
    record: "aciertos",
  },
  {
    id: "falsos",
    emoji: "🎭",
    nombre: "Falsos amigos",
    desc: "Palabras que se parecen a una española y significan otra cosa. El error más típico del que habla español.",
    minimo: 0,
    record: "aciertos",
  },
  {
    id: "confusas",
    emoji: "🔀",
    nombre: "Las que confundes",
    desc: "Se apunta qué palabra cambias por cuál y te las pone cara a cara.",
    minimo: 0,
    record: "aciertos",
  },
];

/** Los juegos, ordenados por la destreza que entrenan. */
const GRUPOS_JUEGOS = [
  { nombre: "Significado", pista: "saber qué quiere decir", juegos: ["rapida", "hueco"] },
  { nombre: "Oído y pronunciación", pista: "reconocerla y decirla", juegos: ["escucha", "hablar", "dictado"] },
  { nombre: "Escritura", pista: "producirla tú, sin ayuda", juegos: ["escribe", "ordena"] },
  { nombre: "Gramática", pista: "las formas que no se deducen", juegos: ["irregulares", "modales"] },
  { nombre: "Cómo se dice", pista: "lo que sale entero, sin traducir", juegos: ["frases"] },
  { nombre: "Tus errores", pista: "justo lo que se te resiste", juegos: ["falsos", "confusas"] },
  { nombre: "Memoria", pista: "a contrarreloj", juegos: ["parejas"] },
];

let juego = null; // estado del juego en curso
let gameTimer = null;

function pararJuego() {
  clearInterval(gameTimer);
  gameTimer = null;
  pararEscucha();
  juego = null;
}

/* ---------- Reconocimiento de voz ---------- */

// Lo trae el propio navegador: no hay API de pago ni se envía nada a ningún
// sitio nuestro. En Chrome va con prefijo.
const Reconocimiento = window.SpeechRecognition || window.webkitSpeechRecognition;

// En iOS (iPhone y iPad), Apple obliga a TODOS los navegadores —Safari,
// Chrome, Firefox— a usar su mismo motor interno, que no tiene terminado el
// reconocimiento de voz para páginas web. El objeto webkitSpeechRecognition
// existe igualmente (por eso Boolean(Reconocimiento) solo no basta), pero
// falla nada más pulsar en vez de avisar de que no está disponible.
const esIOS =
  /iP(hone|od|ad)/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); // iPad moderno se identifica como Mac
const hayMicrofono = Boolean(Reconocimiento) && !esIOS;
let oyente = null;

function pararEscucha() {
  if (!oyente) return;
  try {
    oyente.onresult = oyente.onerror = oyente.onend = null;
    oyente.abort();
  } catch {
    /* ya estaba parado */
  }
  oyente = null;
}

/**
 * Escucha una vez y devuelve lo que ha entendido.
 * Pide varias alternativas: si la primera no cuadra, a lo mejor lo dijiste
 * bien y el motor se quedó con otra interpretación.
 */
function escucharUnaVez() {
  return new Promise((resolve) => {
    pararEscucha();
    speechSynthesis.cancel(); // no puede oírte mientras habla él
    const r = new Reconocimiento();
    oyente = r;
    r.lang = "en-US";
    r.interimResults = false;
    r.maxAlternatives = 5;
    r.continuous = false;

    let resuelto = false;
    const acabar = (res) => {
      if (resuelto) return;
      resuelto = true;
      oyente = null;
      resolve(res);
    };

    r.onresult = (ev) => {
      const alternativas = [...ev.results[0]].map((a) => a.transcript.trim()).filter(Boolean);
      acabar({ alternativas });
    };
    r.onerror = (ev) => acabar({ error: ev.error });
    r.onend = () => acabar({ alternativas: [] });

    try {
      r.start();
    } catch (err) {
      acabar({ error: "no-start" });
    }
  });
}

const MENSAJE_MICRO = {
  "not-allowed": "No has dado permiso al micrófono. Actívalo en el candado de la barra de direcciones.",
  "service-not-allowed": "El navegador ha bloqueado el micrófono.",
  "no-speech": "No he oído nada. Acerca el móvil y habla un poco más fuerte.",
  "audio-capture": "No encuentro ningún micrófono.",
  network: "El reconocimiento necesita conexión.",
  "no-start": "No he podido encender el micrófono. Prueba a recargar.",
};

// Categoría con la que se juega ahora mismo. "mixto" = todas mezcladas.
// No se guarda entre sesiones a propósito: es un filtro de "ahora quiero
// practicar esto", no un ajuste permanente como el de la sección Hoy.
let juegoCat = "mixto";

/** Material para jugar: tus palabras (de esa categoría) y, si tienes pocas, se completa con la lista base. */
function gamePool() {
  const propias =
    juegoCat === "mixto" ? store.words : store.words.filter((w) => w.cat === juegoCat);
  if (propias.length >= 12) return propias;
  const known = new Set(store.words.map((w) => w.en));
  const extra = listaLocalPorCat(juegoCat)
    .filter((w) => !known.has(w.en))
    .slice(0, 60)
    .map((w) => ({ ...w, id: null }));
  return [...propias, ...extra];
}

const mezclar = (arr) => [...arr].sort(() => Math.random() - 0.5);
/** Escapa los caracteres que tienen significado especial dentro de una expresión regular. */
const escRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const record = (id) => store.games?.[id] ?? 0;

function guardarRecord(id, valor, menorEsMejor = false) {
  store.games = store.games || {};
  const actual = store.games[id];
  // Sin marca previa cuenta como récord, pero un cero no: ni la primera
  // partida debería celebrar un 0 de 10, ni una resuelta entera a base de
  // pistas, que para el récord vale lo mismo que un cero.
  const esMarca = menorEsMejor || valor > 0;
  const mejor =
    actual === undefined ? esMarca : menorEsMejor ? valor < actual : valor > actual;
  if (mejor) store.games[id] = valor;
  // Se apunta siempre, aunque no sea récord: es lo que permite recomendarte la
  // destreza que llevas más tiempo sin tocar.
  store.gamesLast = store.gamesLast || {};
  store.gamesLast[id] = todayStr();
  registerStudyDay();
  save();
  return mejor;
}

/**
 * Fallar una palabra en un juego la devuelve a la cola de repaso.
 *
 * Si venía del banco y aún no la seguías, se añade ahora a tus palabras. Así
 * jugar también sirve para descubrir vocabulario: lo que fallas se queda, y la
 * promesa de "fallar una la devuelve al repaso" se cumple siempre.
 */
function penalizar(w) {
  if (!w?.en) return;
  // Se apunta para el resumen del final: terminar una partida sabiendo el
  // marcador pero no QUÉ fallaste no sirve de nada.
  if (juego) {
    juego.falladas = juego.falladas || [];
    if (!juego.falladas.some((x) => x.en === w.en)) {
      juego.falladas.push({ en: w.en, es: w.es, pron: w.pron });
    }
  }
  // Si ya es tuya, vuelve al repaso y punto. Si NO lo es, se añade solo si hoy
  // queda hueco bajo el tope: jugando se fallan muchas, y añadirlas todas es
  // justo lo que hacía que un día 3 con objetivo de 5 acabara en 68 por
  // repasar. Fallarla sigue contando en la partida y sale en el resumen.
  const tuya = w.id ? byId(w.id) : store.words.find((x) => x.en === w.en);
  const real = tuya || (huecoParaNuevas() > 0 ? addWord(w) : null);
  if (!real) return;
  real.box = 0;
  real.due = todayStr();
  save();
  updateChrome();
}

/**
 * Apunta que has cambiado una palabra por otra.
 *
 * Fallar sin más dice poco; fallar SIEMPRE cambiando "borrow" por "lend" dice
 * exactamente qué tienes que arreglar. Con esto se puede enfrentar cada par en
 * el juego "Las que confundes".
 */
function registrarConfusion(correcta, elegida) {
  if (!correcta || !elegida || correcta === elegida || elegida === NO_LO_SE) return;
  store.confusiones = store.confusiones || {};
  const clave = [correcta, elegida].sort().join("|");
  store.confusiones[clave] = (store.confusiones[clave] || 0) + 1;
  save();
}

/** Pares que confundes de verdad, ya emparejados con sus palabras. */
function paresConfusos() {
  const pool = gamePool();
  const busca = (en) => pool.find((w) => w.en === en);
  return Object.entries(store.confusiones || {})
    .map(([clave, veces]) => {
      const [a, b] = clave.split("|");
      return { a: busca(a), b: busca(b), veces };
    })
    .filter((p) => p.a && p.b)
    .sort((x, y) => y.veces - x.veces);
}

const norm = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Dos palabras "significan lo mismo" si comparten alguna acepción. Las
 * traducciones vienen con varias separadas por / o coma ("problema / asunto"),
 * así que se comparan una a una.
 */
function mismoEs(a, b) {
  const trocear = (t) =>
    String(t)
      .split(/[\/,;]| o /)
      .map(norm)
      .filter(Boolean);
  const unos = trocear(a.es);
  return trocear(b.es).some((x) => unos.includes(x));
}

/**
 * Opciones falsas para una pregunta de test.
 *
 * Descarta las que significan lo mismo que la correcta. Sin esto la pregunta
 * puede no tener respuesta única: "though", "although" y "even though" son las
 * tres "aunque", así que salían dos opciones idénticas y una contaba como fallo.
 */
/**
 * Palabras que suenan igual: see y sea, right y write, their y there.
 *
 * El inglés tiene un montón, y en cualquier juego de OÍDO son un problema
 * serio: si oyes «sii» y entre las opciones están «mar» y «ver», la pregunta
 * no tiene respuesta posible. Se compara por la propia pronunciación figurada,
 * que es justo lo que el altavoz va a decir.
 */
const clavePron = (w) => String(w?.pron || "").replace(/-/g, "").toLowerCase();
const suenanIgual = (a, b) => {
  const x = clavePron(a);
  return Boolean(x) && x === clavePron(b) && a.en !== b.en;
};

/** Todas las palabras del banco que suenan igual que esta. */
function homofonasDe(en) {
  const w = [...listaLocal(), ...store.words].find((x) => x.en === en);
  if (!w) return [];
  const clave = clavePron(w);
  if (!clave) return [];
  return [...listaLocal(), ...store.words]
    .filter((x) => x.en !== en && clavePron(x) === clave)
    .map((x) => x.en);
}

function distractores(pool, correcta, n) {
  const elegidas = [];
  for (const w of mezclar(pool)) {
    if (w.en === correcta.en || mismoEs(w, correcta)) continue;
    // Ni la correcta ni las ya elegidas pueden tener una homófona al lado: la
    // pregunta dejaría de tener una sola respuesta buena.
    if (suenanIgual(w, correcta)) continue;
    if (elegidas.some((x) => x.en === w.en || mismoEs(x, w) || suenanIgual(x, w))) continue;
    elegidas.push(w);
    if (elegidas.length === n) break;
  }
  return elegidas;
}

/**
 * Las opciones se sortean UNA sola vez por pregunta.
 *
 * Se rebarajaban en cada repintado, y como `distractores` elige al azar, al
 * responder no solo cambiaban de sitio: podían cambiar de contenido. La opción
 * que acababas de fallar desaparecía de la lista y nunca llegabas a ver tu
 * propio error marcado en rojo. Ahora se guardan con el índice de la pregunta.
 */
function opcionesFijas(construir) {
  if (juego.opcionesIdx !== juego.i) {
    juego.opciones = construir();
    juego.opcionesIdx = juego.i;
  }
  return juego.opciones;
}


function renderChipsJuegos() {
  const cont = $("#chips-juegos");
  cont.innerHTML = CATEGORIAS.map(
    (c) =>
      `<button class="chip ${juegoCat === c.id ? "is-active" : ""}" data-cat="${c.id}" aria-pressed="${juegoCat === c.id}">${esc(c.nombre)}</button>`,
  ).join("");

  $$(".chip", cont).forEach((b) => {
    b.onclick = () => {
      if (juegoCat === b.dataset.cat) return;
      juegoCat = b.dataset.cat;
      renderJuegosIndex();
    };
  });
}

/**
 * Qué juego te conviene ahora.
 *
 * Con doce juegos elegías a ciegas, y la app ya sabe lo que llevas flojo:
 *   1. Si has mezclado palabras, eso es lo más rentable: es tu error concreto.
 *   2. Si no, el juego que no hayas tocado nunca —para que no se quede ninguna
 *      destreza sin practicar— y luego el que lleve más tiempo sin jugarse.
 * Solo se proponen juegos que ahora mismo se pueden jugar con tu vocabulario.
 */
function juegoRecomendado() {
  const pool = gamePool().length;
  const jugables = JUEGOS.filter((g) => pool >= g.minimo && (g.id !== "hablar" || hayMicrofono));
  if (!jugables.length) return null;

  if (paresConfusos().length && jugables.some((g) => g.id === "confusas")) {
    const n = paresConfusos().length;
    return {
      id: "confusas",
      def: JUEGOS.find((g) => g.id === "confusas"),
      motivo: `Llevas ${n} ${n === 1 ? "pareja apuntada" : "parejas apuntadas"} que mezclas. Es lo que más te renta ahora.`,
    };
  }

  const ultima = store.gamesLast || {};
  const nunca = jugables.filter((g) => !ultima[g.id]);
  if (nunca.length) {
    const g = nunca[0];
    return { id: g.id, def: g, motivo: "Todavía no lo has probado, y entrena algo que no tocas en los demás." };
  }

  const conDias = jugables
    .map((g) => ({ g, dias: diffDays(todayStr(), ultima[g.id]) }))
    .sort((a, b) => b.dias - a.dias);
  const { g, dias } = conDias[0];
  if (dias < 2) return null; // los has tocado todos hace nada: no hay nada que recomendar
  return { id: g.id, def: g, motivo: `Llevas ${dias} días sin jugarlo.` };
}

function renderJuegoSugerido() {
  const caja = $("#juego-sugerido");
  const s = juegoRecomendado();
  if (!s) {
    caja.innerHTML = "";
    return;
  }
  caja.innerHTML = `
    <button class="sugerido" data-juego="${esc(s.id)}">
      <span class="sugerido-eyebrow">Hoy te toca</span>
      <span class="sugerido-nombre">${s.def.emoji} ${esc(s.def.nombre)}</span>
      <span class="sugerido-motivo">${esc(s.motivo)}</span>
    </button>`;
  // Lo abre el listener global de [data-juego]: poner aquí otro onclick
  // lanzaría la partida dos veces.
}

function renderJuegosIndex() {
  pararJuego();
  $("#juego-activo").hidden = true;
  $("#juegos-index").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });

  renderChipsJuegos();
  renderJuegoSugerido();

  const pool = gamePool().length;
  const lios = paresConfusos().length;
  const filtro = juegoCat === "mixto" ? "" : ` de ${nombreCategoria(juegoCat).toLowerCase()}`;
  $("#juegos-sub").textContent =
    `${pool} palabras${filtro} en juego · fallar una la devuelve al repaso` +
    (lios ? ` · ${lios} ${lios === 1 ? "pareja que mezclas" : "parejas que mezclas"}` : "");

  const tarjeta = (g) => {
    const r = record(g.id);
    const marca = !r
      ? ""
      : g.record === "tiempo"
        ? `<span class="game-record">⏱ ${(r / 1000).toFixed(1)}s</span>`
        : `<span class="game-record">★ ${r}</span>`;
    return `<button class="game-card" data-juego="${g.id}">
      <span class="game-emoji">${g.emoji}</span>
      <span class="game-name">${esc(g.nombre)}</span>
      <span class="game-desc">${esc(g.desc)}</span>
      ${marca}
    </button>`;
  };

  // Agrupados por lo que entrena cada uno: con ocho seguidos no se sabe cuál
  // coger, y no es lo mismo querer practicar oído que ortografía.
  $("#juegos-lista").innerHTML = GRUPOS_JUEGOS.map((grupo) => {
    const suyos = JUEGOS.filter((g) => grupo.juegos.includes(g.id));
    if (!suyos.length) return "";
    return `<section class="game-group">
      <h3 class="game-group-title">${esc(grupo.nombre)} <small>${esc(grupo.pista)}</small></h3>
      <div class="game-grid">${suyos.map(tarjeta).join("")}</div>
    </section>`;
  }).join("");
}

function abrirJuego(id) {
  const def = JUEGOS.find((g) => g.id === id);
  const pool = gamePool();
  if (pool.length < def.minimo) {
    toast(
      juegoCat === "mixto"
        ? `Necesitas al menos ${def.minimo} palabras para este juego.`
        : `Muy pocas palabras de «${nombreCategoria(juegoCat).toLowerCase()}» para este juego. Prueba con «Un poco de todo».`,
    );
    return;
  }

  pararJuego();
  // Se puede llegar desde fuera de Juegos (la sugerencia al acabar el repaso),
  // así que la sección tiene que estar delante o la partida se montaría dentro
  // de una vista oculta y no la verías.
  activarVista("juegos");
  $("#juegos-index").hidden = true;
  const box = $("#juego-activo");
  box.hidden = false;
  box.innerHTML = `
    <button class="btn-back" id="back-juegos">← Juegos</button>
    <div class="view-head">
      <h2>${def.emoji} ${esc(def.nombre)}</h2>
      <p class="muted">${esc(def.desc)}</p>
    </div>
    <div id="game-box"></div>`;

  $("#back-juegos").onclick = () => renderJuegosIndex();

  if (id === "rapida") iniciarRapida(pool);
  if (id === "hueco") iniciarHueco(pool);
  if (id === "escribe") iniciarEscribe(pool);
  if (id === "parejas") iniciarParejas(pool);
  if (id === "escucha") iniciarEscucha(pool);
  if (id === "ordena") iniciarOrdena(pool);
  if (id === "hablar") iniciarHablar(pool);
  if (id === "dictado") iniciarDictado(pool);
  if (id === "irregulares") iniciarIrregulares(pool);
  if (id === "modales") iniciarModales(pool);
  if (id === "frases") iniciarFrasesJuego(pool);
  if (id === "falsos") iniciarFalsos(pool);
  if (id === "confusas") iniciarConfusas(pool);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Desglose honesto: aciertos, fallos, pistas y las que reconociste no saber. */
function detalle(j, esRecord) {
  const partes = [];
  if (j.fallos) partes.push(`${j.fallos} ${j.fallos === 1 ? "fallo" : "fallos"}`);
  if (j.nose) partes.push(`${j.nose} sin saber`);
  if (j.pistas) partes.push(`${j.pistas} con pista${j.conPista ? " (no cuentan para el récord)" : ""}`);
  if (esRecord) partes.push("nuevo récord");
  return partes.length ? partes.join(" · ") : "Sin un solo fallo, y sin pistas";
}

/**
 * Suma un acierto, y apunta si venía con pista.
 *
 * El marcador de la partida los cuenta todos —los has respondido tú—, pero el
 * récord no: si valiera pedir pista diez veces, dejaría de medir nada y nunca
 * más podrías batirlo sin pistas.
 */
function acertar() {
  juego.aciertos += 1;
  if (juego.pista) juego.conPista = (juego.conPista || 0) + 1;
}

/** Lo que cuenta para el récord: los aciertos que te salieron solo. */
const limpios = (j) => j.aciertos - (j.conPista || 0);

/* ---------- 💡 Pistas ---------- */

/**
 * Una pista es un empujón, no la respuesta.
 *
 * Dar la primera letra, o la frase en español, es una *pista de recuperación*:
 * te obliga a sacar la palabra de tu memoria igualmente, y eso es justo lo que
 * fija el recuerdo. Ver la respuesta entera no enseña nada, y por eso "No lo
 * sé" sigue existiendo aparte y cuenta distinto: manda la palabra al repaso.
 *
 * Acertar con pista cuenta como acierto —has llegado tú— pero se apunta y sale
 * en el resultado. Si necesitas pista en ocho de diez, te interesa saberlo.
 *
 * No todos los juegos la llevan: en Emparejar es un juego de memoria contra el
 * reloj, en Falsos amigos solo hay tres opciones y una es la trampa, y en Las
 * que confundes distinguir las dos ES el ejercicio. Ahí una pista lo rompe.
 */
function botonPista(niveles = 1) {
  const usadas = juego?.pista || 0;
  if (usadas >= niveles) return "";
  return `<button class="btn btn-pista" id="pista">💡 Pista${niveles > 1 ? ` (${usadas + 1} de ${niveles})` : ""}</button>`;
}

function cajaPista(texto) {
  return juego?.pista && texto ? `<p class="pista-box" aria-live="polite">💡 ${texto}</p>` : "";
}

/** Apunta la pista y repinta. Cuenta preguntas con pista, no clics. */
function usarPista(repintar) {
  if (!juego) return;
  if (!juego.pista) juego.pistas = (juego.pistas || 0) + 1;
  juego.pista = (juego.pista || 0) + 1;
  repintar();
}

/** "Empieza por «h» y tiene 5 letras" / "Son 2 palabras y empieza por «g»". */
function pistaInicial(en) {
  const trozos = String(en).trim().split(/\s+/);
  if (trozos.length > 1) return `Son ${trozos.length} palabras y empieza por «<b>${esc(trozos[0][0])}</b>».`;
  const n = trozos[0].length;
  return `Empieza por «<b>${esc(trozos[0][0])}</b>» y tiene ${n} ${n === 1 ? "letra" : "letras"}.`;
}

/** h _ _ _ _ → ho _ _ _. Se enseñan las n primeras letras y el resto en huecos. */
function esqueleto(en, n) {
  return String(en)
    .split("")
    .map((ch, i) => (/\s/.test(ch) ? "&nbsp;&nbsp;" : i < n ? esc(ch) : "_"))
    .join(" ");
}

/**
 * Repinta un juego de escribir sin perder lo que llevabas tecleado.
 *
 * Pedir pista vuelve a montar el HTML entero, así que el campo nacería vacío y
 * te borraría media respuesta justo cuando pides ayuda.
 */
function repintarConTexto(repintar, selector, texto) {
  repintar();
  const campo = $(selector);
  if (!campo) return;
  campo.value = texto;
  campo.focus({ preventScroll: true });
}

function pantallaFinal(titulo, detalle, esRecord, reiniciar) {
  const falladas = (juego?.falladas || []).slice(0, 10);

  $("#game-box").innerHTML = `
    <div class="card quiz-result" aria-live="polite">
      <p class="result-emoji">${esRecord ? "🏆" : "👏"}</p>
      <p class="result-score">${esc(titulo)}</p>
      <p class="muted">${esc(detalle)}</p>
      <div class="row-actions">
        <button class="btn" id="rejugar">Otra partida</button>
        <button class="btn btn-ghost" id="volver-juegos">Otros juegos</button>
      </div>
    </div>
    ${
      falladas.length
        ? `<div class="card repasar-luego">
             <b>Las que se te han resistido</b>
             <ul>
               ${falladas
                 .map(
                   (w) => `<li>
                     <span class="rl-en" lang="en">${esc(w.en)}</span>
                     <span class="rl-pron">${esc(w.pron || "—")}</span>
                     <span class="rl-es">${esc(w.es)}</span>
                     <button class="speak speak-sm" data-speak="${esc(w.en)}" aria-label="Escuchar ${esc(w.en)}">🔊</button>
                   </li>`,
                 )
                 .join("")}
             </ul>
             <p class="muted">Ya están en tu cola de repaso para hoy.</p>
           </div>`
        : ""
    }`;
  $("#rejugar").onclick = reiniciar;
  $("#volver-juegos").onclick = () => renderJuegosIndex();
  updateChrome();
}

/* ---------- ⚡ Respuesta rápida ---------- */

function iniciarRapida(pool) {
  juego = { pool, aciertos: 0, fallos: 0, nose: 0, pistas: 0, pista: 0, restante: 60, actual: null, bloqueado: false };
  clearInterval(gameTimer);
  gameTimer = setInterval(() => {
    if (!juego) return clearInterval(gameTimer);
    juego.restante -= 1;
    const reloj = $("#reloj");
    if (reloj) reloj.textContent = juego.restante;
    if (juego.restante <= 0) {
      clearInterval(gameTimer);
      const esRecord = guardarRecord("rapida", limpios(juego));
      pantallaFinal(
        `${juego.aciertos} aciertos`,
        detalle(juego, esRecord),
        esRecord,
        () => iniciarRapida(pool),
      );
      juego = null;
    }
  }, 1000);
  siguienteRapida();
}

function siguienteRapida(mantenerPista = false) {
  if (!juego) return;
  const candidatas = juego.pool.filter((x) => x.en !== juego.actual?.en);
  const w = mantenerPista ? juego.actual : mezclar(candidatas.length ? candidatas : juego.pool)[0];
  // Con pista puesta hay que repintar la MISMA pregunta y las MISMAS opciones:
  // volver a barajar mientras miras la pista sería tramposo y desconcertante.
  const opciones = mantenerPista ? juego.opciones : mezclar([w, ...distractores(juego.pool, w, 3)]);
  juego.actual = w;
  juego.opciones = opciones;
  juego.bloqueado = false;
  if (!mantenerPista) juego.pista = 0;

  $("#game-box").innerHTML = `
    <div class="game-hud">
      <span class="hud-time">⏱ <b id="reloj">${juego.restante}</b>s</span>
      <span class="hud-score">${juego.aciertos} aciertos</span>
    </div>
    <div class="card quiz-card">
      <p class="quiz-count">¿Cómo se dice…?</p>
      <p class="word">${esc(w.es)}</p>
    </div>
    ${cajaPista(pistaInicial(w.en))}
    <div class="options" id="op-rapida">
      ${opciones.map((o) => `<button class="option" data-en="${esc(o.en)}">${esc(o.en)}</button>`).join("")}
    </div>
    <div class="row-actions">
      ${botonPista()}
      <button class="btn btn-nose" id="nose">🤷 No lo sé</button>
    </div>`;

  if ($("#pista")) $("#pista").onclick = () => usarPista(() => siguienteRapida(true));

  const marcarCorrecta = () =>
    $$("#op-rapida .option").forEach((x) => {
      if (x.dataset.en === juego.actual.en) x.classList.add("is-right");
    });

  $$("#op-rapida .option").forEach((b) => {
    b.onclick = () => {
      if (!juego || juego.bloqueado) return;
      juego.bloqueado = true;
      const bien = b.dataset.en === juego.actual.en;
      if (bien) acertar();
      else {
        juego.fallos += 1;
        registrarConfusion(juego.actual.en, b.dataset.en);
        penalizar(juego.actual);
        marcarCorrecta();
      }
      b.classList.add(bien ? "is-right" : "is-wrong");
      setTimeout(() => juego && siguienteRapida(), bien ? 250 : 900);
    };
  });

  // Decir "no lo sé" es mejor que acertar de chiripa: la palabra vuelve al
  // repaso y de paso ves la respuesta buena.
  $("#nose").onclick = () => {
    if (!juego || juego.bloqueado) return;
    juego.bloqueado = true;
    juego.nose += 1;
    penalizar(juego.actual);
    marcarCorrecta();
    setTimeout(() => juego && siguienteRapida(), 1200);
  };
}

/* ---------- 🎯 Completa la frase ---------- */

/**
 * ¿Aparece la palabra ENTERA en la frase, no como trozo de otra?
 *
 * Sin límites de palabra, "a" hacía huecos dentro de "break" y "make" dejaba
 * suelta la "s" de "makes": la frase quedaba destrozada y de paso se filtraba
 * parte de la respuesta. Los phrasal verbs con espacio ("give up") funcionan
 * igual: \b también delimita en los espacios.
 */
const regexPalabra = (palabra) => new RegExp(`\\b${escRegex(palabra)}\\b`, "ig");
const contienePalabra = (frase, palabra) => regexPalabra(palabra).test(frase);

/**
 * Las formas con las que una palabra puede salir en su frase de ejemplo.
 *
 * Las frases están escritas en inglés natural, así que la palabra casi nunca
 * aparece en su forma de diccionario: «accept» sale como «They ACCEPTED our
 * offer» y «animal» como «Wild ANIMALS live here». Buscando solo la forma
 * exacta se quedaban fuera 160 de las 1282 —el 12 %— y ninguna podía salir
 * nunca en este juego.
 *
 * No hace falta inventar nada: el conjugador y el mapa de irregulares ya están
 * en la app. La base va la PRIMERA para que, si la frase trae las dos, el hueco
 * se abra sobre ella.
 */
function formasDe(en) {
  const partes = String(en).trim().split(/\s+/);
  const base = partes[0];
  const resto = partes.slice(1).join(" ");
  const formas = new Set([base]);
  try {
    for (const f of [tercera(base), gerundio(base), pasado(base), participio(base)]) {
      if (f) String(f).split("/").forEach((x) => formas.add(x.trim()));
    }
  } catch {
    /* si el conjugador no sabe con esta, nos quedamos con la base */
  }
  // Plural de los sustantivos, que el conjugador no cubre
  formas.add(/[^aeiou]y$/i.test(base) ? base.slice(0, -1) + "ies" : base + "s");
  formas.add(base + "es");
  return [...formas].filter(Boolean).map((f) => (resto ? `${f} ${resto}` : f));
}

/** El regex de la forma que DE VERDAD aparece en la frase, o null si ninguna. */
function regexEnFrase(frase, en) {
  for (const forma of formasDe(en)) {
    if (contienePalabra(frase, forma)) return regexPalabra(forma);
  }
  return null;
}

function iniciarHueco(pool) {
  // Solo sirven las palabras cuya frase de ejemplo las contiene, en la forma
  // que sea.
  const validas = pool.filter((w) => w.example && regexEnFrase(w.example, w.en));
  if (validas.length < 4) {
    $("#game-box").innerHTML = `<div class="empty">Aún no hay frases suficientes. Añade más palabras.</div>`;
    return;
  }
  juego = { pool, items: mezclar(validas).slice(0, 10), i: 0, aciertos: 0, fallos: 0, nose: 0, pistas: 0, pista: 0, elegida: null };
  renderHueco();
}

function renderHueco() {
  if (!juego) return;
  const { items, i } = juego;

  if (i >= items.length) {
    const esRecord = guardarRecord("hueco", limpios(juego));
    const pool = juego.pool;
    pantallaFinal(
      `${juego.aciertos} de ${items.length}`,
      detalle(juego, esRecord),
      esRecord,
      () => iniciarHueco(pool),
    );
    juego = null;
    return;
  }

  const w = items[i];
  // El hueco se abre sobre la forma que sale en la frase, pero las opciones
  // siguen siendo formas de diccionario: si la correcta apareciera conjugada y
  // las demás no, cantaría cuál es. Al responder se enseña la frase entera con
  // su forma real, que es donde se ve el plural o el pasado.
  const enFrase = regexEnFrase(w.example, w.en);
  const hueco = enFrase ? w.example.replace(enFrase, "______") : w.example;
  const opciones = opcionesFijas(() => mezclar([w, ...distractores(juego.pool, w, 2)]));
  const respondida = juego.elegida !== null;
  const noLaSabia = juego.elegida === NO_LO_SE;

  $("#game-box").innerHTML = `
    <div class="game-hud"><span class="hud-time">${i + 1} / ${items.length}</span><span class="hud-score">${juego.aciertos} aciertos</span></div>
    <div class="card">
      <p class="quiz-q">${esc(hueco)}</p>
      ${respondida ? `<p class="muted">${esc(w.exampleEs)}</p>` : ""}
    </div>
    ${respondida ? "" : cajaPista(`La frase dice: <em>${esc(w.exampleEs)}</em>`)}
    <div class="options" id="op-hueco">
      ${opciones
        .map((o) => {
          let cls = "option";
          if (respondida && o.en === w.en) cls += " is-right";
          else if (respondida && o.en === juego.elegida) cls += " is-wrong";
          return `<button class="${cls}" data-en="${esc(o.en)}" ${respondida ? "disabled" : ""}>${esc(o.en)}</button>`;
        })
        .join("")}
    </div>
    ${
      respondida
        ? ""
        : `<div class="row-actions">
             ${botonPista()}
             <button class="btn btn-nose" id="nose">🤷 No lo sé</button>
           </div>`
    }
    ${
      respondida
        ? `<div class="explain ${juego.elegida === w.en ? "ok" : noLaSabia ? "nose" : "ko"}" aria-live="polite">
             <b>${noLaSabia ? "Bien reconocerlo — vuelve al repaso" : `${w.en} — ${esc(w.es)}`}</b>
             <p>${noLaSabia ? `<b>${esc(w.en)}</b> (${esc(w.pron || "—")}) — ${esc(w.es)}` : ""}</p>
             <p>${esc(w.example)}<br><em>${esc(w.exampleEs)}</em></p>
           </div>
           <button class="btn" id="next-hueco">${i + 1 === items.length ? "Ver resultado" : "Siguiente"}</button>`
        : ""
    }`;

  if (!respondida) {
    $$("#op-hueco .option").forEach((b) => {
      b.onclick = () => {
        juego.elegida = b.dataset.en;
        if (juego.elegida === w.en) acertar();
        else {
          juego.fallos += 1;
          registrarConfusion(w.en, juego.elegida);
          penalizar(w);
        }
        renderHueco();
      };
    });
    $("#nose").onclick = () => {
      juego.elegida = NO_LO_SE;
      juego.nose += 1;
      penalizar(w);
      renderHueco();
    };
    if ($("#pista")) $("#pista").onclick = () => usarPista(renderHueco);
  } else {
    $("#next-hueco").onclick = () => {
      juego.i += 1;
      juego.elegida = null;
      juego.pista = 0;
      renderHueco();
    };
  }
}

/* ---------- ✍️ Escríbela ---------- */

function iniciarEscribe(pool) {
  juego = { pool, items: mezclar(pool).slice(0, 10), i: 0, aciertos: 0, fallos: 0, nose: 0, pistas: 0, pista: 0, resultado: null };
  renderEscribe();
}

function renderEscribe() {
  if (!juego) return;
  const { items, i } = juego;

  if (i >= items.length) {
    const esRecord = guardarRecord("escribe", limpios(juego));
    const pool = juego.pool;
    pantallaFinal(
      `${juego.aciertos} de ${items.length}`,
      detalle(juego, esRecord),
      esRecord,
      () => iniciarEscribe(pool),
    );
    juego = null;
    return;
  }

  const w = items[i];
  const r = juego.resultado;

  // Primero cuántas letras y por dónde empieza; si aún así no sale, la mitad.
  // Con la mitad delante todavía tienes que recordar el final, que es donde
  // están las trampas de ortografía inglesas.
  const letras = w.en.length;
  const pistaEscribe =
    juego.pista >= 2
      ? `${esqueleto(w.en, Math.ceil(letras / 2))} &nbsp;·&nbsp; suena <b>${esc(w.pron || "—")}</b>`
      : `${esqueleto(w.en, 1)}`;

  $("#game-box").innerHTML = `
    <div class="game-hud"><span class="hud-time">${i + 1} / ${items.length}</span><span class="hud-score">${juego.aciertos} aciertos</span></div>
    <div class="card quiz-card">
      <p class="quiz-count">Escríbelo en inglés</p>
      <p class="word">${esc(w.es)}</p>
      <button class="speak" data-speak="${esc(w.en)}" aria-label="Escuchar">🔊</button>
    </div>
    ${r ? "" : cajaPista(`<span class="pista-letras">${pistaEscribe}</span>`)}
    <input id="resp-escribe" class="input input-big" type="text" placeholder="Escribe aquí…"
           autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
           ${r ? "disabled" : ""} value="${r ? esc(r.texto) : ""}" />
    ${
      r
        ? `<div class="explain ${r.bien ? "ok" : r.rendida ? "nose" : "ko"}" aria-live="polite">
             <b>${r.bien ? "¡Correcto!" : (r.rendida ? "Es: " : "Era: ") + esc(w.en)}</b>
             ${r.sinonimo ? `<p>También vale <b lang="en">${esc(r.sinonimo)}</b>.</p>` : ""}
             <p>${esc(w.pron ? "(" + w.pron + ") " : "")}${esc(w.example || "")}</p>
           </div>
           <button class="btn" id="next-escribe">${i + 1 === items.length ? "Ver resultado" : "Siguiente"}</button>`
        : `<div class="row-actions">
             <button class="btn" id="comprobar">Comprobar</button>
             ${botonPista(2)}
             <button class="btn btn-nose" id="paso">🤷 No la sé</button>
           </div>`
    }`;

  if (!r) {
    const input = $("#resp-escribe");
    // Sin preventScroll el navegador desplaza la página para centrar el campo,
    // y la vista pega un salto en cada pregunta.
    input.focus({ preventScroll: true });
    // Te doy el español y escribes el inglés, pero puede haber varias palabras
    // válidas: para "casi" valen "almost" y "nearly". Marcar fallo por escribir
    // el sinónimo sería injusto, así que se aceptan todas las del banco.
    const validas = [w, ...juego.pool.filter((x) => x.en !== w.en && mismoEs(x, w))];
    const comprobar = (texto, rendida = false) => {
      const acertada = rendida ? null : validas.find((x) => norm(texto) === norm(x.en));
      const bien = Boolean(acertada);
      if (bien) acertar();
      else {
        if (rendida) juego.nose += 1;
        else juego.fallos += 1;
        penalizar(w);
      }
      juego.resultado = {
        bien,
        texto,
        rendida,
        sinonimo: bien && acertada.en !== w.en ? w.en : null,
      };
      renderEscribe();
    };
    input.onkeydown = (e) => {
      if (e.key === "Enter") comprobar(input.value);
    };
    $("#comprobar").onclick = () => comprobar(input.value);
    $("#paso").onclick = () => comprobar("", true);
    if ($("#pista")) $("#pista").onclick = () => usarPista(() => repintarConTexto(renderEscribe, "#resp-escribe", input.value));
  } else {
    $("#next-escribe").onclick = () => {
      juego.i += 1;
      juego.resultado = null;
      juego.pista = 0;
      renderEscribe();
    };
  }
}

/* ---------- 🔗 Emparejar ---------- */

/**
 * Palabras válidas para Emparejar: las doce fichas tienen que ser distintas.
 *
 * Aquí se enseñan las dos caras a la vez, así que no basta con evitar
 * sinónimos. Hay 16 palabras cuya traducción es idéntica al inglés (hotel →
 * hotel, idea → idea, chocolate → chocolate): sacan dos fichas iguales y la
 * pareja se resuelve sola. Y hay algo peor: «eleven» se traduce «once», que
 * ADEMÁS es una palabra inglesa («una vez»). Si salían las dos, emparejabas lo
 * lógico y el juego te lo daba por fallo.
 */
function sinFichasIguales(pool, n) {
  const norma = (s) => norm(String(s || ""));
  const elegidas = [];
  const usados = new Set();
  for (const w of mezclar(pool)) {
    const en = norma(w.en);
    const es = norma(w.es);
    if (en === es) continue; // hotel / hotel: dos fichas idénticas
    if (usados.has(en) || usados.has(es)) continue; // choca con otra ficha ya puesta
    if (elegidas.some((x) => mismoEs(x, w))) continue; // big / large: dos «grande»
    elegidas.push(w);
    usados.add(en);
    usados.add(es);
    if (elegidas.length === n) break;
  }
  return elegidas;
}

function iniciarParejas(pool) {
  // Sin sinónimos y sin fichas repetidas: si salen "big" y "large" (ambas
  // "grande"), o "hotel" (que se traduce igual), emparejar bien pasa a ser
  // cuestión de suerte.
  const elegidas = sinFichasIguales(pool, 6);
  if (elegidas.length < 6) {
    $("#game-box").innerHTML = `<div class="empty">Necesitas más palabras con significados distintos para este juego.</div>`;
    return;
  }
  const fichas = mezclar([
    ...elegidas.map((w, n) => ({ par: n, cara: "en", texto: w.en, w })),
    ...elegidas.map((w, n) => ({ par: n, cara: "es", texto: w.es, w })),
  ]);
  juego = { pool, fichas, sel: null, resueltas: 0, fallos: 0, inicio: Date.now() };

  clearInterval(gameTimer);
  gameTimer = setInterval(() => {
    const el = $("#reloj");
    if (el && juego) el.textContent = ((Date.now() - juego.inicio) / 1000).toFixed(1);
  }, 100);

  renderParejas();
}

function renderParejas() {
  if (!juego) return;

  $("#game-box").innerHTML = `
    <div class="game-hud">
      <span class="hud-time">⏱ <b id="reloj">0.0</b>s</span>
      <span class="hud-score">${juego.resueltas} / 6</span>
    </div>
    <div class="tiles" id="tiles">
      ${juego.fichas
        .map((f, idx) =>
          f.hecha
            ? `<div class="tile is-done">${esc(f.texto)}</div>`
            : `<button class="tile ${juego.sel === idx ? "is-sel" : ""} ${f.mal ? "is-bad" : ""}" data-ficha="${idx}">${esc(f.texto)}</button>`,
        )
        .join("")}
    </div>`;

  $$("#tiles [data-ficha]").forEach((b) => {
    b.onclick = () => {
      const idx = Number(b.dataset.ficha);
      if (juego.sel === null) {
        juego.sel = idx;
        renderParejas();
        return;
      }
      if (juego.sel === idx) {
        juego.sel = null;
        renderParejas();
        return;
      }

      const a = juego.fichas[juego.sel];
      const c = juego.fichas[idx];

      if (a.par === c.par && a.cara !== c.cara) {
        a.hecha = c.hecha = true;
        juego.sel = null;
        juego.resueltas += 1;

        if (juego.resueltas === 6) {
          clearInterval(gameTimer);
          const ms = Date.now() - juego.inicio;
          const esRecord = guardarRecord("parejas", ms, true);
          const pool = juego.pool;
          pantallaFinal(
            `${(ms / 1000).toFixed(1)} segundos`,
            juego.fallos
              ? `${juego.fallos} fallo${juego.fallos > 1 ? "s" : ""}${esRecord ? " · nuevo récord" : ""}`
              : `Sin fallos${esRecord ? " · nuevo récord" : ""}`,
            esRecord,
            () => iniciarParejas(pool),
          );
          juego = null;
          return;
        }
        renderParejas();
      } else {
        juego.fallos += 1;
        penalizar(c.w);
        a.mal = c.mal = true;
        renderParejas();
        setTimeout(() => {
          if (!juego) return;
          a.mal = c.mal = false;
          juego.sel = null;
          renderParejas();
        }, 550);
      }
    };
  });
}

/* ---------- 🎧 Escucha y elige ---------- */

function iniciarEscucha(pool) {
  juego = { pool, items: mezclar(pool).slice(0, 10), i: 0, aciertos: 0, fallos: 0, nose: 0, pistas: 0, pista: 0, elegida: null, audioIdx: -1 };
  renderEscucha();
}

function renderEscucha() {
  if (!juego) return;
  const { items, i } = juego;

  if (i >= items.length) {
    const esRecord = guardarRecord("escucha", limpios(juego));
    const pool = juego.pool;
    pantallaFinal(
      `${juego.aciertos} de ${items.length}`,
      detalle(juego, esRecord),
      esRecord,
      () => iniciarEscucha(pool),
    );
    juego = null;
    return;
  }

  const w = items[i];
  const respondida = juego.elegida !== null;
  const noLaSabia = juego.elegida === NO_LO_SE;
  const opciones = opcionesFijas(() => mezclar([w, ...distractores(juego.pool, w, 3)]));

  $("#game-box").innerHTML = `
    <div class="game-hud"><span class="hud-time">${i + 1} / ${items.length}</span><span class="hud-score">${juego.aciertos} aciertos</span></div>
    <div class="card quiz-card">
      <p class="quiz-count">Escucha y elige el significado</p>
      <button class="speak speak-lg" id="repetir" aria-label="Volver a escuchar">🔊</button>
      ${respondida ? `<p class="word" lang="en">${esc(w.en)}</p><span class="pron">${esc(w.pron || "—")}</span>` : `<p class="quiz-hint">Toca el altavoz cuantas veces quieras.</p>`}
    </div>
    ${respondida ? "" : cajaPista(`Se escribe <b lang="en">${esc(w.en)}</b> — pero el significado lo pones tú.`)}
    <div class="options" id="op-escucha">
      ${opciones
        .map((o) => {
          let cls = "option";
          if (respondida && o.en === w.en) cls += " is-right";
          else if (respondida && o.en === juego.elegida) cls += " is-wrong";
          return `<button class="${cls}" data-en="${esc(o.en)}" ${respondida ? "disabled" : ""}>${esc(o.es)}</button>`;
        })
        .join("")}
    </div>
    ${
      respondida
        ? ""
        : `<div class="row-actions">
             ${botonPista()}
             <button class="btn btn-nose" id="nose">🤷 No lo sé</button>
           </div>`
    }
    ${
      respondida
        ? `<div class="explain ${juego.elegida === w.en ? "ok" : noLaSabia ? "nose" : "ko"}" aria-live="polite">
             <b>${noLaSabia ? "Bien reconocerlo — vuelve al repaso" : juego.elegida === w.en ? "Correcto" : `Era: ${esc(w.en)}`}</b>
             <p>${esc(w.example || "")}${w.exampleEs ? `<br><em>${esc(w.exampleEs)}</em>` : ""}</p>
           </div>
           <button class="btn" id="next-escucha">${i + 1 === items.length ? "Ver resultado" : "Siguiente"}</button>`
        : ""
    }`;

  // Se reproduce sola al entrar en una pregunta nueva, nunca al repintar la respuesta.
  if (juego.audioIdx !== i) {
    juego.audioIdx = i;
    speak(w.en);
  }
  $("#repetir").onclick = () => speak(w.en);

  if (!respondida) {
    $$("#op-escucha .option").forEach((b) => {
      b.onclick = () => {
        juego.elegida = b.dataset.en;
        if (juego.elegida === w.en) acertar();
        else {
          juego.fallos += 1;
          registrarConfusion(w.en, juego.elegida);
          penalizar(w);
        }
        renderEscucha();
      };
    });
    $("#nose").onclick = () => {
      juego.elegida = NO_LO_SE;
      juego.nose += 1;
      penalizar(w);
      renderEscucha();
    };
    if ($("#pista")) $("#pista").onclick = () => usarPista(renderEscucha);
  } else {
    $("#next-escucha").onclick = () => {
      juego.i += 1;
      juego.elegida = null;
      juego.pista = 0;
      renderEscucha();
    };
  }
}

/* ---------- 🔤 Ordena las letras ---------- */

// Solo palabras de un único token, letras inglesas: las expresiones con
// espacios o apóstrofes no encajan bien en fichas de letras sueltas.
const esOrdenable = (w) => /^[a-z]{3,14}$/i.test(w.en.trim());

function iniciarOrdena(pool) {
  const validas = pool.filter(esOrdenable);
  if (validas.length < 4) {
    $("#game-box").innerHTML = `<div class="empty">Aún no hay suficientes palabras cortas de una sola pieza. Añade más palabras o prueba otro juego.</div>`;
    return;
  }
  juego = { pool, items: mezclar(validas).slice(0, 8), i: 0, aciertos: 0, fallos: 0, nose: 0, pistas: 0, pista: 0, disponibles: [], construida: [], resultado: null };
  prepararLetras();
  renderOrdena();
}

/** Baraja las letras de la palabra actual, evitando que salga en su orden real. */
function prepararLetras() {
  const w = juego.items[juego.i];
  const letras = w.en.trim().toLowerCase().split("");
  let barajadas = mezclar(letras);
  if (letras.length > 3) {
    let intentos = 0;
    while (barajadas.join("") === letras.join("") && intentos < 10) {
      barajadas = mezclar(letras);
      intentos += 1;
    }
  }
  juego.disponibles = barajadas.map((char, idx) => ({ char, idx }));
  juego.construida = [];
}

function renderOrdena() {
  if (!juego) return;
  const { items, i } = juego;

  if (i >= items.length) {
    const esRecord = guardarRecord("ordena", limpios(juego));
    const pool = juego.pool;
    pantallaFinal(
      `${juego.aciertos} de ${items.length}`,
      detalle(juego, esRecord),
      esRecord,
      () => iniciarOrdena(pool),
    );
    juego = null;
    return;
  }

  const w = items[i];
  const r = juego.resultado;
  const palabraObjetivo = w.en.trim().toLowerCase();

  $("#game-box").innerHTML = `
    <div class="game-hud"><span class="hud-time">${i + 1} / ${items.length}</span><span class="hud-score">${juego.aciertos} aciertos</span></div>
    <div class="card quiz-card">
      <p class="quiz-count">Ordena las letras</p>
      <p class="word">${esc(w.es)}</p>
      <button class="speak" data-speak="${esc(w.en)}" aria-label="Escuchar">🔊</button>
    </div>
    <div class="scramble-built" id="construida" aria-label="Palabra que estás formando">
      ${
        juego.construida.length
          ? juego.construida
              .map((f, pos) => `<button class="letter-tile is-filled" data-pos="${pos}" ${r ? "disabled" : ""}>${esc(f.char)}</button>`)
              .join("")
          : `<span class="scramble-empty">Toca las letras de abajo</span>`
      }
    </div>
    <div class="scramble-pool" id="disponibles">
      ${juego.disponibles.map((f) => `<button class="letter-tile" data-idx="${f.idx}" ${r ? "disabled" : ""}>${esc(f.char)}</button>`).join("")}
    </div>
    <div class="row-actions">
      <button class="btn btn-ghost" id="borrar-letra" ${juego.construida.length && !r ? "" : "disabled"}>⌫ Borrar letra</button>
      ${r ? "" : botonPista(topePistasOrdena(palabraObjetivo))}
      ${r ? "" : `<button class="btn btn-nose" id="nose">🤷 No la sé</button>`}
    </div>
    ${
      r
        ? `<div class="explain ${r.bien ? "ok" : r.rendida ? "nose" : "ko"}" aria-live="polite">
             <b>${r.bien ? "¡Correcto!" : (r.rendida ? "Es: " : "Era: ") + esc(w.en)}</b>
             <p>${esc(w.pron ? "(" + w.pron + ") " : "")}${esc(w.example || "")}</p>
           </div>
           <button class="btn" id="next-ordena">${i + 1 === items.length ? "Ver resultado" : "Siguiente"}</button>`
        : ""
    }`;

  const terminar = (rendida = false) => {
    const bien = !rendida && juego.construida.map((f) => f.char).join("") === palabraObjetivo;
    if (bien) acertar();
    else {
      if (rendida) juego.nose += 1;
      else juego.fallos += 1;
      penalizar(w);
    }
    juego.resultado = { bien, rendida };
    renderOrdena();
  };

  if (!r) {
    $$("#disponibles [data-idx]").forEach((b) => {
      b.onclick = () => {
        const idx = Number(b.dataset.idx);
        const ficha = juego.disponibles.find((f) => f.idx === idx);
        if (!ficha) return;
        juego.disponibles = juego.disponibles.filter((f) => f.idx !== idx);
        juego.construida.push(ficha);
        if (juego.construida.length === palabraObjetivo.length) terminar(false);
        else renderOrdena();
      };
    });
    $$("#construida [data-pos]").forEach((b) => {
      b.onclick = () => {
        const pos = Number(b.dataset.pos);
        const [ficha] = juego.construida.splice(pos, 1);
        if (ficha) juego.disponibles.push(ficha);
        renderOrdena();
      };
    });
    $("#borrar-letra").onclick = () => {
      const ficha = juego.construida.pop();
      if (ficha) juego.disponibles.push(ficha);
      renderOrdena();
    };
    $("#nose").onclick = () => terminar(true);

    // La pista aquí no se lee: coloca por ti la siguiente letra buena.
    if ($("#pista")) {
      $("#pista").onclick = () => {
        // Si lo que llevas construido ya se fue del camino, primero se deshace
        // hasta el último trozo correcto: si no, no hay "siguiente letra".
        while (
          juego.construida.length &&
          juego.construida.map((f) => f.char).join("") !== palabraObjetivo.slice(0, juego.construida.length)
        ) {
          juego.disponibles.push(juego.construida.pop());
        }
        const ficha = juego.disponibles.find((f) => f.char === palabraObjetivo[juego.construida.length]);
        if (!ficha) return;
        juego.disponibles = juego.disponibles.filter((f) => f.idx !== ficha.idx);
        juego.construida.push(ficha);
        usarPista(() => {
          if (juego.construida.length === palabraObjetivo.length) terminar(false);
          else renderOrdena();
        });
      };
    }
  } else {
    $("#next-ordena").onclick = () => {
      juego.i += 1;
      juego.resultado = null;
      juego.pista = 0;
      if (juego.i < items.length) prepararLetras();
      renderOrdena();
    };
  }
}

/**
 * Cuántas letras te puede colocar la pista: como mucho la mitad, y nunca más
 * de tres. Con eso desatasca sin llegar a resolver la palabra por ti.
 */
function topePistasOrdena(palabra) {
  return Math.max(1, Math.min(3, Math.floor(palabra.length / 2)));
}

/* ---------- 🎤 Pronúncialo ---------- */

// Frases enteras no las reconoce bien; una palabra o dos sí.
const esDecible = (w) => /^[a-z][a-z' ]{1,18}$/i.test(w.en.trim()) && w.en.trim().split(" ").length <= 2;

function iniciarHablar(pool) {
  if (!hayMicrofono) {
    $("#game-box").innerHTML = `
      <div class="empty">
        <span class="big">🎤</span>
        ${
          esIOS
            ? `En iPhone y iPad no está disponible: Apple no ha añadido el
               reconocimiento de voz a su motor de navegador, y afecta por
               igual a Safari, Chrome y cualquier otro que uses en iOS.
               No es un permiso que falte, es que ahí no existe.`
            : `Este navegador no trae reconocimiento de voz.`
        }
        <br />Funciona en Chrome o Edge, tanto en Android como en ordenador
        (Windows, Mac o Linux). Ábrela ahí y podrás practicar en voz alta.
      </div>`;
    return;
  }

  const validas = pool.filter(esDecible);
  if (validas.length < 4) {
    $("#game-box").innerHTML = `<div class="empty">Aún no hay suficientes palabras cortas para este juego.</div>`;
    return;
  }

  juego = {
    pool,
    items: mezclar(validas).slice(0, 8),
    i: 0,
    aciertos: 0,
    fallos: 0,
    nose: 0,
    estado: "listo", // listo | oyendo | resuelto
    oido: null,
    error: null,
  };
  renderHablar();
}

function renderHablar() {
  if (!juego) return;
  const { items, i } = juego;

  if (i >= items.length) {
    const esRecord = guardarRecord("hablar", juego.aciertos);
    const pool = juego.pool;
    pantallaFinal(
      `${juego.aciertos} de ${items.length}`,
      detalle(juego, esRecord),
      esRecord,
      () => iniciarHablar(pool),
    );
    juego = null;
    return;
  }

  const w = items[i];
  const resuelto = juego.estado === "resuelto";
  const oyendo = juego.estado === "oyendo";
  const acerto = resuelto && juego.acertada;

  $("#game-box").innerHTML = `
    <div class="game-hud"><span class="hud-time">${i + 1} / ${items.length}</span><span class="hud-score">${juego.aciertos} aciertos</span></div>
    <div class="card quiz-card">
      <p class="quiz-count">Léela en voz alta</p>
      <p class="word" lang="en">${esc(w.en)}</p>
      <span class="pron">${esc(w.pron || "—")}</span>
      <p class="translation">${esc(w.es)}</p>
      <button class="speak" data-speak="${esc(w.en)}" aria-label="Oírla primero">🔊 Oírla primero</button>
    </div>
    <button class="btn btn-mic ${oyendo ? "is-listening" : ""}" id="hablar-btn" ${oyendo || resuelto ? "disabled" : ""}>
      ${oyendo ? "🎙️ Escuchando… habla ahora" : "🎤 Hablar"}
    </button>
    ${
      resuelto
        ? `<div class="explain ${acerto ? "ok" : juego.rendida ? "nose" : "ko"}" aria-live="polite">
             <b>${acerto ? "¡Te ha entendido!" : juego.rendida ? "La saltas" : "No te ha entendido"}</b>
             ${juego.oido ? `<p>He oído: «<b lang="en">${esc(juego.oido)}</b>»</p>` : ""}
             ${juego.error ? `<p>${esc(MENSAJE_MICRO[juego.error] || "No he podido escucharte.")}</p>` : ""}
             ${!acerto && !juego.error ? `<p>Fíjate en la pronunciación figurada: <b>${esc(w.pron || "—")}</b>. Vuelve a oírla y repite.</p>` : ""}
           </div>
           <button class="btn" id="next-hablar">${i + 1 === items.length ? "Ver resultado" : "Siguiente"}</button>`
        : `<button class="btn btn-nose" id="nose" ${oyendo ? "disabled" : ""}>🤷 Saltar esta</button>`
    }`;

  if (resuelto) {
    $("#next-hablar").onclick = () => {
      juego.i += 1;
      Object.assign(juego, { estado: "listo", oido: null, error: null, acertada: false, rendida: false });
      renderHablar();
    };
    return;
  }

  $("#hablar-btn").onclick = async () => {
    if (!juego || juego.estado !== "listo") return;
    juego.estado = "oyendo";
    renderHablar();

    const res = await escucharUnaVez();
    if (!juego) return; // te has salido del juego mientras escuchaba

    // El reconocedor devuelve texto, y ante dos palabras que suenan igual
    // elige una cualquiera: si dices «write» perfectamente puede escribir
    // «right». Marcarlo como fallo sería injusto, porque lo has pronunciado
    // bien: es lo único que este juego mide.
    const validas = [norm(w.en), ...homofonasDe(w.en).map(norm)];
    const dichas = (res.alternativas || []).map(norm);
    const acertada = dichas.some((d) => validas.includes(d));

    juego.estado = "resuelto";
    juego.acertada = acertada;
    juego.rendida = false;
    juego.oido = res.alternativas?.[0] || null;
    juego.error = res.error || null;

    if (acertada) acertar();
    else if (!res.error) {
      juego.fallos += 1;
      penalizar(w);
    }
    renderHablar();
  };

  $("#nose").onclick = () => {
    juego.estado = "resuelto";
    juego.acertada = false;
    juego.rendida = true;
    juego.nose += 1;
    penalizar(w);
    renderHablar();
  };
}

/* ---------- ✏️ Dictado ---------- */

const palabrasDe = (frase) => norm(frase).split(" ").filter(Boolean);

function iniciarDictado(pool) {
  // Frases de verdad, ni de una palabra ni kilométricas.
  const validas = pool.filter((w) => {
    const n = w.example ? palabrasDe(w.example).length : 0;
    return n >= 3 && n <= 9;
  });
  if (validas.length < 4) {
    $("#game-box").innerHTML = `<div class="empty">Aún no hay suficientes frases de ejemplo para este juego.</div>`;
    return;
  }
  juego = { pool, items: mezclar(validas).slice(0, 8), i: 0, aciertos: 0, fallos: 0, nose: 0, pistas: 0, pista: 0, resultado: null, audioIdx: -1 };
  renderDictado();
}

function renderDictado() {
  if (!juego) return;
  const { items, i } = juego;

  if (i >= items.length) {
    const esRecord = guardarRecord("dictado", limpios(juego));
    const pool = juego.pool;
    pantallaFinal(
      `${juego.aciertos} de ${items.length}`,
      detalle(juego, esRecord),
      esRecord,
      () => iniciarDictado(pool),
    );
    juego = null;
    return;
  }

  const w = items[i];
  const r = juego.resultado;

  // Palabra a palabra: así ves cuál se te escapó, que suele ser la átona.
  // El verde y el rojo tienen que decir lo mismo que el marcador: si «there»
  // vale por «their», aquí también sale en verde.
  const marcado = r
    ? palabrasDe(w.example)
        .map((p, n) => {
          const bien = r.tuyas[n] === p || homofonasDe(p).map(norm).includes(r.tuyas[n]);
          return `<span class="${bien ? "dic-ok" : "dic-ko"}">${esc(p)}</span>`;
        })
        .join(" ")
    : "";

  // Primero cuántas palabras hay y por cuál empieza: lo que más se pierde al
  // oír inglés seguido es dónde acaba una palabra y empieza la siguiente.
  // Si con eso no basta, la frase en español y a reconstruirla.
  const trozos = palabrasDe(w.example);
  const pistaDictado =
    juego.pista >= 2
      ? `Dice: <em>${esc(w.exampleEs || "")}</em>`
      : `Son <b>${trozos.length} palabras</b> y empieza por «<b lang="en">${esc(trozos[0])}</b>».`;

  $("#game-box").innerHTML = `
    <div class="game-hud"><span class="hud-time">${i + 1} / ${items.length}</span><span class="hud-score">${juego.aciertos} aciertos</span></div>
    <div class="card quiz-card">
      <p class="quiz-count">Escucha la frase y escríbela</p>
      <button class="speak speak-lg" id="repetir" aria-label="Volver a escuchar">🔊</button>
      <p class="quiz-hint">Escúchala las veces que quieras.</p>
    </div>
    ${r ? "" : cajaPista(pistaDictado)}
    <input id="resp-dictado" class="input input-big" type="text" placeholder="Escribe la frase…"
           autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
           ${r ? "disabled" : ""} value="${r ? esc(r.texto) : ""}" />
    ${
      r
        ? `<div class="explain ${r.bien ? "ok" : r.rendida ? "nose" : "ko"}" aria-live="polite">
             <b>${r.bien ? "¡Clavada!" : r.rendida ? "La frase era:" : `${r.aciertos} de ${r.total} palabras`}</b>
             <p class="dictado-frase">${marcado}</p>
             <p><em>${esc(w.exampleEs || "")}</em></p>
           </div>
           <button class="btn" id="next-dictado">${i + 1 === items.length ? "Ver resultado" : "Siguiente"}</button>`
        : `<div class="row-actions">
             <button class="btn" id="comprobar-dictado">Comprobar</button>
             ${botonPista(2)}
             <button class="btn btn-nose" id="nose">🤷 No la pillo</button>
           </div>`
    }`;

  if (juego.audioIdx !== i) {
    juego.audioIdx = i;
    speak(w.example);
  }
  $("#repetir").onclick = () => speak(w.example);

  if (!r) {
    const input = $("#resp-dictado");
    input.focus({ preventScroll: true });
    const comprobar = (rendida = false) => {
      const objetivo = palabrasDe(w.example);
      const tuyas = palabrasDe(input.value);
      // Un dictado se juzga por lo que has OÍDO. Si la frase lleva «their» y
      // escribes «there», has oído bien: suenan exactamente igual y solo el
      // sentido las separa, que es otro ejercicio. Vale la homófona.
      const vale = (n, escrita) =>
        escrita === objetivo[n] || homofonasDe(objetivo[n]).map(norm).includes(escrita);
      const aciertos = rendida ? 0 : objetivo.filter((p, n) => vale(n, tuyas[n])).length;
      const bien = !rendida && aciertos === objetivo.length && tuyas.length === objetivo.length;
      if (bien) acertar();
      else {
        if (rendida) juego.nose += 1;
        else juego.fallos += 1;
        penalizar(w);
      }
      juego.resultado = { bien, rendida, texto: input.value, tuyas, aciertos, total: objetivo.length };
      renderDictado();
    };
    input.onkeydown = (e) => {
      if (e.key === "Enter") comprobar();
    };
    $("#comprobar-dictado").onclick = () => comprobar();
    $("#nose").onclick = () => comprobar(true);
    if ($("#pista")) $("#pista").onclick = () => usarPista(() => repintarConTexto(renderDictado, "#resp-dictado", input.value));
  } else {
    $("#next-dictado").onclick = () => {
      juego.i += 1;
      juego.resultado = null;
      juego.pista = 0;
      renderDictado();
    };
  }
}

/* ---------- 🧩 Verbos irregulares ---------- */

function iniciarIrregulares(pool) {
  juego = {
    pool,
    items: mezclar(IRREGULARES)
      .slice(0, 10)
      // Se esconde el pasado o el participio, al azar: saberse uno no es
      // saberse el otro, y en "have been" el que falla es el segundo.
      .map((v) => ({ v, hueco: Math.random() < 0.5 ? "pasado" : "participio" })),
    i: 0,
    aciertos: 0,
    fallos: 0,
    nose: 0,
    pistas: 0,
    pista: 0,
    falladas: [],
    resultado: null,
  };
  renderIrregulares();
}

function renderIrregulares() {
  if (!juego) return;
  const { items, i } = juego;

  if (i >= items.length) {
    const esRecord = guardarRecord("irregulares", limpios(juego));
    const pool = juego.pool;
    pantallaFinal(
      `${juego.aciertos} de ${items.length}`,
      detalle(juego, esRecord),
      esRecord,
      () => iniciarIrregulares(pool),
    );
    juego = null;
    return;
  }

  const { v, hueco } = items[i];
  const r = juego.resultado;
  const prons = v.pron.split(" · ");
  const esperado = hueco === "pasado" ? v.pasado : v.participio;

  const celda = (valor, cual, n) => {
    if (cual !== hueco) return `<span class="irr-forma" lang="en">${esc(valor)}</span><span class="irr-pron">${esc(prons[n] || "")}</span>`;
    if (r) return `<span class="irr-forma ${r.bien ? "irr-ok" : "irr-ko"}" lang="en">${esc(valor)}</span><span class="irr-pron">${esc(prons[n] || "")}</span>`;
    return `<span class="irr-forma irr-hueco">?</span><span class="irr-pron">&nbsp;</span>`;
  };

  $("#game-box").innerHTML = `
    <div class="game-hud"><span class="hud-time">${i + 1} / ${items.length}</span><span class="hud-score">${juego.aciertos} aciertos</span></div>
    <div class="card quiz-card">
      <p class="quiz-count">${hueco === "pasado" ? "Falta el pasado simple" : "Falta el participio"}</p>
      <p class="translation">${esc(v.es)}</p>
      <div class="irr-tabla">
        <div class="irr-col"><small>infinitivo</small>${celda(v.base, "base", 0)}</div>
        <div class="irr-col"><small>pasado</small>${celda(v.pasado, "pasado", 1)}</div>
        <div class="irr-col"><small>participio</small>${celda(v.participio, "participio", 2)}</div>
      </div>
      <button class="speak" data-speak="${esc(v.base)}" aria-label="Escuchar">🔊</button>
    </div>
    ${
      r
        ? ""
        : cajaPista(
            `${pistaInicial(esperado.split("/")[0])} Suena <b>${esc(prons[hueco === "pasado" ? 1 : 2] || "—")}</b>.`,
          )
    }
    <input id="resp-irr" class="input input-big" type="text" placeholder="Escribe la forma que falta…"
           autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
           ${r ? "disabled" : ""} value="${r ? esc(r.texto) : ""}" />
    ${
      r
        ? `<div class="explain ${r.bien ? "ok" : r.rendida ? "nose" : "ko"}" aria-live="polite">
             <b>${r.bien ? "¡Correcto!" : (r.rendida ? "Es: " : "Era: ") + esc(esperado)}</b>
             <p><b lang="en">${esc(v.base)}</b> · <b lang="en">${esc(v.pasado)}</b> · <b lang="en">${esc(v.participio)}</b></p>
             <p>${esc(v.pron)}</p>
           </div>
           <div class="row-actions">
             <button class="btn btn-ghost" data-speak="${esc(v.base)} , ${esc(v.pasado.replace("/", " or "))} , ${esc(v.participio)}">🔊 Oír las tres</button>
             <button class="btn" id="next-irr">${i + 1 === items.length ? "Ver resultado" : "Siguiente"}</button>
           </div>`
        : `<div class="row-actions">
             <button class="btn" id="comprobar-irr">Comprobar</button>
             ${botonPista()}
             <button class="btn btn-nose" id="nose">🤷 No la sé</button>
           </div>`
    }`;

  if (!r) {
    const input = $("#resp-irr");
    input.focus({ preventScroll: true });
    const comprobar = (rendida = false) => {
      // "was/were" vale entero o cualquiera de las dos por separado.
      const validas = [esperado, ...esperado.split("/")].map((s) => norm(s));
      const bien = !rendida && validas.includes(norm(input.value));
      if (bien) acertar();
      else {
        if (rendida) juego.nose += 1;
        else juego.fallos += 1;
        juego.falladas.push({ en: `${v.base} · ${v.pasado} · ${v.participio}`, es: v.es, pron: v.pron });
      }
      juego.resultado = { bien, rendida, texto: input.value };
      renderIrregulares();
    };
    input.onkeydown = (e) => {
      if (e.key === "Enter") comprobar();
    };
    $("#comprobar-irr").onclick = () => comprobar();
    $("#nose").onclick = () => comprobar(true);
    if ($("#pista")) $("#pista").onclick = () => usarPista(() => repintarConTexto(renderIrregulares, "#resp-irr", input.value));
  } else {
    $("#next-irr").onclick = () => {
      juego.i += 1;
      juego.resultado = null;
      juego.pista = 0;
      renderIrregulares();
    };
  }
}

/* ---------- 🔑 Verbos modales ---------- */

function iniciarModales(pool) {
  juego = {
    pool,
    items: mezclar(EJERCICIOS_MODALES).slice(0, 10),
    i: 0,
    aciertos: 0,
    fallos: 0,
    nose: 0,
    pistas: 0,
    pista: 0,
    falladas: [],
    elegida: null,
  };
  renderModales();
}

function renderModales() {
  if (!juego) return;
  const { items, i } = juego;

  if (i >= items.length) {
    const esRecord = guardarRecord("modales", limpios(juego));
    const pool = juego.pool;
    pantallaFinal(
      `${juego.aciertos} de ${items.length}`,
      detalle(juego, esRecord),
      esRecord,
      () => iniciarModales(pool),
    );
    juego = null;
    return;
  }

  const ej = items[i];
  const respondida = juego.elegida !== null;
  const noLaSabia = juego.elegida === NO_LO_SE;
  const acerto = juego.elegida === ej.correcta;
  // La frase completa, con el modal correcto puesto, para oírla bien dicha.
  const completa = ej.frase.replace("___", ej.opciones[ej.correcta]);

  $("#game-box").innerHTML = `
    <div class="game-hud"><span class="hud-time">${i + 1} / ${items.length}</span><span class="hud-score">${juego.aciertos} aciertos</span></div>
    <div class="card">
      <p class="quiz-count">¿Qué modal encaja?</p>
      <p class="quiz-q" lang="en">${esc(ej.frase)}</p>
      ${respondida ? `<p class="muted">${esc(ej.es)}</p>` : ""}
    </div>
    ${respondida ? "" : cajaPista(esc(ej.pista))}
    <div class="options" id="op-modales">
      ${ej.opciones
        .map((o, n) => {
          let cls = "option";
          if (respondida && n === ej.correcta) cls += " is-right";
          else if (respondida && n === juego.elegida) cls += " is-wrong";
          return `<button class="${cls}" data-op="${n}" ${respondida ? "disabled" : ""} lang="en">${esc(o)}</button>`;
        })
        .join("")}
    </div>
    ${
      respondida
        ? ""
        : `<div class="row-actions">
             ${botonPista()}
             <button class="btn btn-nose" id="nose">🤷 No lo sé</button>
           </div>`
    }
    ${
      respondida
        ? `<div class="explain ${acerto ? "ok" : noLaSabia ? "nose" : "ko"}" aria-live="polite">
             <b>${acerto ? "Correcto" : noLaSabia ? `Es «${esc(ej.opciones[ej.correcta])}»` : `Era «${esc(ej.opciones[ej.correcta])}»`}</b>
             <p>${esc(ej.why)}</p>
             <p lang="en">${esc(completa)}<br><em lang="es">${esc(ej.es)}</em></p>
           </div>
           <div class="row-actions">
             <button class="btn btn-ghost" data-speak="${esc(completa)}">🔊 Oír la frase</button>
             <button class="btn" id="next-modales">${i + 1 === items.length ? "Ver resultado" : "Siguiente"}</button>
           </div>`
        : ""
    }`;

  if (!respondida) {
    $$("#op-modales .option").forEach((b) => {
      b.onclick = () => {
        juego.elegida = Number(b.dataset.op);
        if (juego.elegida === ej.correcta) acertar();
        else {
          juego.fallos += 1;
          juego.falladas.push({ en: ej.opciones[ej.correcta], es: ej.es, pron: "" });
        }
        renderModales();
      };
    });
    $("#nose").onclick = () => {
      juego.elegida = NO_LO_SE;
      juego.nose += 1;
      juego.falladas.push({ en: ej.opciones[ej.correcta], es: ej.es, pron: "" });
      renderModales();
    };
    if ($("#pista")) $("#pista").onclick = () => usarPista(renderModales);
  } else {
    $("#next-modales").onclick = () => {
      juego.i += 1;
      juego.elegida = null;
      juego.pista = 0;
      renderModales();
    };
  }
}

/* ---------- 🗣️ Frases hechas ---------- */

function iniciarFrasesJuego(pool) {
  juego = {
    pool,
    items: mezclar(FRASES).slice(0, 10),
    i: 0,
    aciertos: 0,
    fallos: 0,
    nose: 0,
    pistas: 0,
    pista: 0,
    falladas: [],
    elegida: null,
  };
  renderFrasesJuego();
}

function renderFrasesJuego() {
  if (!juego) return;
  const { items, i } = juego;

  if (i >= items.length) {
    const esRecord = guardarRecord("frases", limpios(juego));
    const pool = juego.pool;
    pantallaFinal(`${juego.aciertos} de ${items.length}`, detalle(juego, esRecord), esRecord, () => iniciarFrasesJuego(pool));
    juego = null;
    return;
  }

  const f = items[i];
  const respondida = juego.elegida !== null;
  const noLaSabia = juego.elegida === NO_LO_SE;
  const acerto = juego.elegida === f.en;

  // Los distractores son frases REALES de otras situaciones. Así el juego no
  // se gana descartando lo que suena mal, sino sabiendo cuál encaja aquí.
  const opciones = opcionesFijas(() =>
    mezclar([f, ...mezclar(FRASES.filter((x) => x.id !== f.id && x.es !== f.es)).slice(0, 2)]),
  );

  $("#game-box").innerHTML = `
    <div class="game-hud"><span class="hud-time">${i + 1} / ${items.length}</span><span class="hud-score">${juego.aciertos} aciertos</span></div>
    <div class="card">
      <p class="quiz-count">¿Qué se dice en inglés?</p>
      <p class="quiz-q">${esc(f.situacion)}</p>
    </div>
    ${respondida ? "" : cajaPista(`En español sería: <em>${esc(f.es)}</em>`)}
    <div class="options" id="op-frases">
      ${opciones
        .map((o) => {
          let cls = "option option-frase";
          if (respondida && o.en === f.en) cls += " is-right";
          else if (respondida && o.en === juego.elegida) cls += " is-wrong";
          return `<button class="${cls}" data-en="${esc(o.en)}" ${respondida ? "disabled" : ""} lang="en">${esc(o.en)}</button>`;
        })
        .join("")}
    </div>
    ${
      respondida
        ? ""
        : `<div class="row-actions">
             ${botonPista()}
             <button class="btn btn-nose" id="nose">🤷 No lo sé</button>
           </div>`
    }
    ${
      respondida
        ? `<div class="explain ${acerto ? "ok" : noLaSabia ? "nose" : "ko"}" aria-live="polite">
             <b>${acerto ? "Correcto" : `Es: ${esc(f.en)}`}</b>
             <p>${esc(f.pron)} — ${esc(f.es)}</p>
             <p>${esc(f.porque)}</p>
             ${f.ojo ? `<p><b>⚠️ Ojo:</b> ${esc(f.ojo)}</p>` : ""}
           </div>
           <div class="row-actions">
             <button class="btn btn-ghost" data-speak="${esc(f.en)}">🔊 Oírla</button>
             <button class="btn" id="next-frases">${i + 1 === items.length ? "Ver resultado" : "Siguiente"}</button>
           </div>`
        : ""
    }`;

  if (!respondida) {
    $$("#op-frases .option").forEach((b) => {
      b.onclick = () => {
        juego.elegida = b.dataset.en;
        if (juego.elegida === f.en) acertar();
        else {
          juego.fallos += 1;
          juego.falladas.push({ en: f.en, es: f.es, pron: f.pron });
        }
        renderFrasesJuego();
      };
    });
    $("#nose").onclick = () => {
      juego.elegida = NO_LO_SE;
      juego.nose += 1;
      juego.falladas.push({ en: f.en, es: f.es, pron: f.pron });
      renderFrasesJuego();
    };
    if ($("#pista")) $("#pista").onclick = () => usarPista(renderFrasesJuego);
  } else {
    $("#next-frases").onclick = () => {
      juego.i += 1;
      juego.elegida = null;
      juego.pista = 0;
      renderFrasesJuego();
    };
  }
}

/* ---------- 🎭 Falsos amigos ---------- */

function iniciarFalsos(pool) {
  juego = {
    pool,
    items: mezclar(FALSOS_AMIGOS).slice(0, 10),
    i: 0,
    aciertos: 0,
    fallos: 0,
    nose: 0,
    elegida: null,
    opciones: [],
  };
  prepararFalsos();
  renderFalsos();
}

/** Tres opciones fijas: el significado real, la trampa y una ajena. */
function prepararFalsos() {
  const f = juego.items[juego.i];
  const ajena = mezclar(FALSOS_AMIGOS.filter((x) => x.en !== f.en && x.es !== f.es))[0];
  juego.opciones = mezclar([
    { txt: f.es, tipo: "bien" },
    { txt: f.trampa, tipo: "trampa" },
    { txt: ajena.es, tipo: "otra" },
  ]);
  juego.elegida = null;
}

function renderFalsos() {
  if (!juego) return;
  const { items, i } = juego;

  if (i >= items.length) {
    const esRecord = guardarRecord("falsos", juego.aciertos);
    const pool = juego.pool;
    pantallaFinal(
      `${juego.aciertos} de ${items.length}`,
      detalle(juego, esRecord),
      esRecord,
      () => iniciarFalsos(pool),
    );
    juego = null;
    return;
  }

  const f = items[i];
  const respondida = juego.elegida !== null;
  const noLaSabia = juego.elegida === NO_LO_SE;
  const cayo = juego.elegida === "trampa";

  $("#game-box").innerHTML = `
    <div class="game-hud"><span class="hud-time">${i + 1} / ${items.length}</span><span class="hud-score">${juego.aciertos} aciertos</span></div>
    <div class="card quiz-card">
      <p class="quiz-count">¿Qué significa de verdad?</p>
      <p class="word" lang="en">${esc(f.en)}</p>
      ${respondida ? `<span class="pron">${esc(f.pron)}</span>` : ""}
      <button class="speak" data-speak="${esc(f.en)}" aria-label="Escuchar">🔊</button>
    </div>
    <div class="options" id="op-falsos">
      ${juego.opciones
        .map((o) => {
          let cls = "option";
          if (respondida && o.tipo === "bien") cls += " is-right";
          else if (respondida && o.tipo === juego.elegida) cls += " is-wrong";
          return `<button class="${cls}" data-tipo="${o.tipo}" ${respondida ? "disabled" : ""}>${esc(o.txt)}</button>`;
        })
        .join("")}
    </div>
    ${respondida ? "" : `<button class="btn btn-nose" id="nose">🤷 No lo sé</button>`}
    ${
      respondida
        ? `<div class="explain ${juego.elegida === "bien" ? "ok" : noLaSabia ? "nose" : "ko"}" aria-live="polite">
             <b>${juego.elegida === "bien" ? "Correcto" : cayo ? "Ahí está la trampa" : noLaSabia ? "Bien reconocerlo" : "No es eso"}</b>
             <p><b lang="en">${esc(f.en)}</b> (${esc(f.pron)}) significa <b>${esc(f.es)}</b>.</p>
             <p>«${esc(f.trampa)}» se dice <b lang="en">${esc(f.real)}</b> (${esc(f.realPron)}).</p>
             <p>${esc(f.example)}<br><em>${esc(f.exampleEs)}</em></p>
           </div>
           <button class="btn" id="next-falsos">${i + 1 === items.length ? "Ver resultado" : "Siguiente"}</button>`
        : ""
    }`;

  if (!respondida) {
    $$("#op-falsos .option").forEach((b) => {
      b.onclick = () => {
        juego.elegida = b.dataset.tipo;
        if (juego.elegida === "bien") acertar();
        else {
          juego.fallos += 1;
          // Se queda en tu repaso: son justo las que hay que machacar.
          penalizar({ en: f.en, es: f.es, pron: f.pron, example: f.example, exampleEs: f.exampleEs, cat: "mixto" });
        }
        renderFalsos();
      };
    });
    $("#nose").onclick = () => {
      juego.elegida = NO_LO_SE;
      juego.nose += 1;
      penalizar({ en: f.en, es: f.es, pron: f.pron, example: f.example, exampleEs: f.exampleEs, cat: "mixto" });
      renderFalsos();
    };
  } else {
    $("#next-falsos").onclick = () => {
      juego.i += 1;
      if (juego.i < items.length) prepararFalsos();
      renderFalsos();
    };
  }
}

/* ---------- 🔀 Las que confundes ---------- */

/** Acertar el par baja el contador; cuando llega a cero deja de salir. */
function aflojarConfusion(a, b) {
  const clave = [a, b].sort().join("|");
  if (!store.confusiones?.[clave]) return;
  store.confusiones[clave] -= 1;
  if (store.confusiones[clave] <= 0) delete store.confusiones[clave];
  save();
}

function iniciarConfusas(pool) {
  const pares = paresConfusos();
  if (!pares.length) {
    $("#game-box").innerHTML = `
      <div class="empty">
        <span class="big">🔀</span>
        Todavía no hay ninguna pareja apuntada.
        <br />Repasa o juega: en cuanto cambies una palabra por otra, las dos
        aparecerán aquí enfrentadas hasta que dejes de mezclarlas.
      </div>`;
    return;
  }

  // Cada par se pregunta en las dos direcciones: saber cuál es "borrow" no es
  // lo mismo que saber cuál es "lend".
  const items = pares.flatMap((p) => [
    { w: p.a, otra: p.b },
    { w: p.b, otra: p.a },
  ]);
  juego = { pool, items: mezclar(items).slice(0, 12), i: 0, aciertos: 0, fallos: 0, nose: 0, elegida: null };
  renderConfusas();
}

function renderConfusas() {
  if (!juego) return;
  const { items, i } = juego;

  if (i >= items.length) {
    const esRecord = guardarRecord("confusas", juego.aciertos);
    const pool = juego.pool;
    const quedan = paresConfusos().length;
    pantallaFinal(
      `${juego.aciertos} de ${items.length}`,
      `${detalle(juego, esRecord)} · ${quedan ? `${quedan} ${quedan === 1 ? "pareja" : "parejas"} por pulir` : "ninguna pareja pendiente"}`,
      esRecord,
      () => iniciarConfusas(pool),
    );
    juego = null;
    return;
  }

  const { w, otra } = items[i];
  const respondida = juego.elegida !== null;
  const noLaSabia = juego.elegida === NO_LO_SE;
  const opciones = opcionesFijas(() => mezclar([w, otra]));

  $("#game-box").innerHTML = `
    <div class="game-hud"><span class="hud-time">${i + 1} / ${items.length}</span><span class="hud-score">${juego.aciertos} aciertos</span></div>
    <div class="card quiz-card">
      <p class="quiz-count">Estas dos las mezclas. ¿Cuál es cuál?</p>
      <p class="word" lang="en">${esc(w.en)}</p>
      ${respondida ? `<span class="pron">${esc(w.pron || "—")}</span>` : ""}
      <button class="speak" data-speak="${esc(w.en)}" aria-label="Escuchar">🔊</button>
    </div>
    <div class="options" id="op-confusas">
      ${opciones
        .map((o) => {
          let cls = "option";
          if (respondida && o.en === w.en) cls += " is-right";
          else if (respondida && o.en === juego.elegida) cls += " is-wrong";
          return `<button class="${cls}" data-en="${esc(o.en)}" ${respondida ? "disabled" : ""}>${esc(o.es)}</button>`;
        })
        .join("")}
    </div>
    ${respondida ? "" : `<button class="btn btn-nose" id="nose">🤷 No lo sé</button>`}
    ${
      respondida
        ? `<div class="explain ${juego.elegida === w.en ? "ok" : noLaSabia ? "nose" : "ko"}" aria-live="polite">
             <b>${juego.elegida === w.en ? "Correcto" : "Justo al revés"}</b>
             <p><b lang="en">${esc(w.en)}</b> = ${esc(w.es)}</p>
             <p><b lang="en">${esc(otra.en)}</b> = ${esc(otra.es)}</p>
             ${w.example ? `<p>${esc(w.example)}<br><em>${esc(w.exampleEs || "")}</em></p>` : ""}
           </div>
           <button class="btn" id="next-confusas">${i + 1 === items.length ? "Ver resultado" : "Siguiente"}</button>`
        : ""
    }`;

  if (!respondida) {
    $$("#op-confusas .option").forEach((b) => {
      b.onclick = () => {
        juego.elegida = b.dataset.en;
        if (juego.elegida === w.en) {
          acertar();
          aflojarConfusion(w.en, otra.en);
        } else {
          juego.fallos += 1;
          registrarConfusion(w.en, otra.en);
          penalizar(w);
        }
        renderConfusas();
      };
    });
    $("#nose").onclick = () => {
      juego.elegida = NO_LO_SE;
      juego.nose += 1;
      penalizar(w);
      renderConfusas();
    };
  } else {
    $("#next-confusas").onclick = () => {
      juego.i += 1;
      juego.elegida = null;
      renderConfusas();
    };
  }
}

/* ------------------------------------------------------------------ *
 * Vista: Lecciones
 * ------------------------------------------------------------------ */

/** Marca de "no lo sé": ni acierto ni fallo, pero la palabra vuelve al repaso. */
const NO_LO_SE = "__no_lo_se__";

let quiz = null; // { lesson, items, i, aciertos, elegida }

function lessonProgress(id) {
  return store.lessons[id] || { best: 0, done: false, last: null };
}

async function renderLeccionesIndex() {
  await cargarLecciones();
  $("#leccion-detalle").hidden = true;
  $("#lectura-detalle").hidden = true;
  $("#lecciones-index").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });

  const hechas = LESSONS.filter((l) => lessonProgress(l.id).done).length;
  $("#lecciones-sub").textContent =
    `${hechas} de ${LESSONS.length} lecciones superadas · ${FRASES.length} frases hechas · ${CUENTOS.length + LECTURAS.length} textos`;
  renderLecturasIndex();

  $("#lecciones-lista").innerHTML = LESSONS.map((l) => {
    const p = lessonProgress(l.id);
    const estado = p.done
      ? `<span class="lesson-score is-done">✓ ${p.best}%</span>`
      : p.best
        ? `<span class="lesson-score">${p.best}%</span>`
        : "";
    return `<button class="lesson-card" data-lesson="${l.id}">
      <span class="lesson-tag">${esc(l.tag)}</span>
      <span class="lesson-title">${esc(l.title)}</span>
      <span class="lesson-goal">${esc(l.goal)}</span>
      ${estado}
    </button>`;
  }).join("");
}

/**
 * Un bloque mal formado no puede tumbar la lección entera.
 *
 * Pasó: una lección traía un bloque «formula» con `text` en vez de `parts`, y
 * el `.map` de undefined reventaba el render. La lección salía en blanco, sin
 * ejemplos y sin ninguna pista de por qué. Ahora ese bloque se salta y el
 * resto se pinta igual; el aviso queda en consola para arreglarlo.
 */
function blockHtml(b) {
  try {
    return pintarBloque(b);
  } catch (e) {
    console.warn(`[vocab] bloque «${b?.t}» mal formado, se omite:`, e.message);
    return "";
  }
}

function pintarBloque(b) {
  switch (b.t) {
    case "p":
      return `<p class="lesson-p">${esc(b.text)}</p>`;

    case "formula":
      return `<div class="formula">
        <div class="formula-parts">${b.parts.map((p) => `<span>${esc(p)}</span>`).join('<i>+</i>')}</div>
        <div class="formula-example">${esc(b.example)}
          <button class="speak speak-sm" data-speak="${esc(b.example)}" aria-label="Escuchar">🔊</button>
        </div>
      </div>`;

    case "table":
      return `<div class="table-wrap lesson-table-wrap">
        <table class="word-table">
          <thead><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
          <tbody>${b.rows
            .map((r) => `<tr>${r.map((c, i) => `<td class="${i === 0 ? "cell-en" : ""}">${esc(c)}</td>`).join("")}</tr>`)
            .join("")}</tbody>
        </table>
      </div>`;

    case "examples":
      return `<div class="lesson-examples">${b.items
        .map(
          (it) => `<div class="lesson-example">
            <div class="le-top">
              <span class="le-en">${esc(it.en)}</span>
              <button class="speak speak-sm" data-speak="${esc(it.en)}" aria-label="Escuchar">🔊</button>
            </div>
            <span class="le-pron">(${esc(it.pron)})</span>
            <span class="le-es">${esc(it.es)}</span>
          </div>`,
        )
        .join("")}</div>`;

    case "tip":
      return `<div class="callout callout-tip"><b>Truco</b><p>${esc(b.text)}</p></div>`;

    case "error":
      return `<div class="callout callout-error">
        <b>Error típico</b>
        <p class="bad">✗ ${esc(b.wrong)}</p>
        <p class="good">✓ ${esc(b.right)}</p>
        <p>${esc(b.why)}</p>
      </div>`;

    default:
      return "";
  }
}

async function openLeccion(id) {
  await cargarLecciones();
  const lesson = getLesson(id);
  if (!lesson) return;

  const p = lessonProgress(id);
  $("#lecciones-index").hidden = true;
  const box = $("#leccion-detalle");
  box.hidden = false;

  box.innerHTML = `
    <button class="btn-back" id="back-lecciones">← Lecciones</button>
    <div class="view-head">
      <span class="lesson-tag">${esc(lesson.tag)}</span>
      <h2>${esc(lesson.title)}</h2>
      <p class="muted">${esc(lesson.goal)}</p>
    </div>
    <article class="lesson-body">${lesson.blocks.map(blockHtml).join("")}</article>
    <div class="row-actions">
      <button class="btn" id="start-quiz">${p.done ? "Practicar otra vez" : "Practicar"}</button>
      <button class="btn btn-ghost" id="ai-quiz">Ejercicios nuevos</button>
    </div>
    <div id="quiz-box"></div>`;

  $("#back-lecciones").onclick = () => {
    quiz = null;
    renderLeccionesIndex();
  };
  $("#start-quiz").onclick = () => startQuiz(lesson, lesson.quiz);
  $("#ai-quiz").onclick = () => aiQuiz(lesson);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Pide ejercicios nuevos a Claude sobre esta lección. */
async function aiQuiz(lesson) {
  const btn = $("#ai-quiz");
  btn.disabled = true;
  btn.textContent = "Generando…";
  try {
    const res = await fetch("/api/practice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: lesson.title,
        goal: lesson.goal,
        count: 5,
        seen: lesson.quiz.map((q) => q.q),
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Error ${res.status}`);
    }
    const { exercises } = await res.json();
    // Se comprueba la forma de cada ejercicio, no solo que la lista traiga algo.
    //
    // renderQuiz hace items[i].options.map(...), así que uno sin opciones
    // reventaba ahí — y como el mensaje del error acababa en el toast, el
    // usuario leía «Cannot read properties of undefined (reading 'map')».
    // También se exige que las tres opciones sean distintas: con dos iguales
    // puedes marcar la buena y que te la den por mala.
    const utiles = (exercises ?? []).filter((e) => {
      if (!e || typeof e.q !== "string" || !e.q.trim()) return false;
      if (!Array.isArray(e.options) || e.options.length < 2) return false;
      if (e.options.some((o) => typeof o !== "string" || !o.trim())) return false;
      if (new Set(e.options.map((o) => o.trim().toLowerCase())).size !== e.options.length) return false;
      return Number.isInteger(e.answer) && e.answer >= 0 && e.answer < e.options.length;
    });
    if (!utiles.length) throw new Error("No llegó ningún ejercicio");
    startQuiz(lesson, utiles, { ia: true });
  } catch (err) {
    // Los mensajes propios están en español y explican qué pasó; los del
    // navegador («Failed to fetch») no le dicen nada a nadie.
    const nuestro = /ejercicio|peticion|petición|límite|limite|clave|rechaz/i.test(err.message);
    toast(nuestro ? err.message : "No se pudieron generar los ejercicios. Inténtalo otra vez.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Ejercicios nuevos";
  }
}

function startQuiz(lesson, items, { ia = false } = {}) {
  quiz = { lesson, items, i: 0, aciertos: 0, nose: 0, elegida: null, ia };
  renderQuiz();
}

function renderQuiz() {
  const box = $("#quiz-box");
  if (!quiz) return (box.innerHTML = "");

  const { items, i, elegida } = quiz;

  // Final
  if (i >= items.length) {
    const pct = Math.round((quiz.aciertos / items.length) * 100);
    const prev = lessonProgress(quiz.lesson.id);
    store.lessons[quiz.lesson.id] = {
      best: Math.max(prev.best, pct),
      done: prev.done || pct >= 80,
      last: todayStr(),
    };
    registerStudyDay();
    save();

    box.innerHTML = `
      <div class="card quiz-result" aria-live="polite">
        <p class="result-emoji">${pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</p>
        <p class="result-score">${quiz.aciertos} de ${items.length} · ${pct}%</p>
        <p class="muted">${pct >= 80 ? "Lección superada." : "Repasa la teoría y vuelve a intentarlo."}${
          quiz.nose ? ` · ${quiz.nose} ${quiz.nose === 1 ? "no la sabías" : "no las sabías"}` : ""
        }</p>
        <div class="row-actions">
          <button class="btn" id="retry-quiz">Repetir</button>
          <button class="btn btn-ghost" id="more-quiz">Ejercicios nuevos</button>
        </div>
      </div>`;

    $("#retry-quiz").onclick = () => startQuiz(quiz.lesson, quiz.lesson.quiz);
    $("#more-quiz").onclick = () => aiQuiz(quiz.lesson);
    updateChrome();
    box.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const item = items[i];
  const respondida = elegida !== null;
  const acertada = respondida && elegida === item.answer;
  const noLaSabia = elegida === NO_LO_SE;

  box.innerHTML = `
    <div class="card quiz-ex">
      <div class="quiz-progress"><span style="width:${(i / items.length) * 100}%"></span></div>
      <p class="quiz-count">${i + 1} de ${items.length}${quiz.ia ? " · generados ahora" : ""}</p>
      <p class="quiz-q">${esc(item.q)}</p>
      <div class="options">
        ${item.options
          .map((opt, idx) => {
            let cls = "option";
            if (respondida && idx === item.answer) cls += " is-right";
            else if (respondida && idx === elegida) cls += " is-wrong";
            return `<button class="${cls}" data-opt="${idx}" ${respondida ? "disabled" : ""}>${esc(opt)}</button>`;
          })
          .join("")}
      </div>
      ${respondida ? "" : `<button class="btn btn-nose" id="nose">🤷 No lo sé</button>`}
      ${
        respondida
          ? `<div class="explain ${acertada ? "ok" : noLaSabia ? "nose" : "ko"}" aria-live="polite">
               <b>${acertada ? "Correcto" : noLaSabia ? `La respuesta es: ${esc(item.options[item.answer])}` : "No exactamente"}</b>
               <p>${esc(item.why || "")}</p>
             </div>
             <button class="btn" id="next-q">${i + 1 === items.length ? "Ver resultado" : "Siguiente"}</button>`
          : ""
      }
    </div>`;

  if (!respondida) {
    $$("[data-opt]", box).forEach((b) => {
      b.onclick = () => {
        quiz.elegida = Number(b.dataset.opt);
        if (quiz.elegida === item.answer) quiz.aciertos += 1;
        renderQuiz();
      };
    });
    $("#nose").onclick = () => {
      quiz.elegida = NO_LO_SE;
      quiz.nose += 1;
      renderQuiz();
    };
  } else {
    $("#next-q").onclick = () => {
      quiz.i += 1;
      quiz.elegida = null;
      renderQuiz();
    };
  }
}

/* ------------------------------------------------------------------ *
 * Lecturas: input comprensible
 *
 * El resto de la app te hace recuperar lo que ya viste. Esto es lo contrario:
 * texto seguido donde las palabras aparecen en contexto. Tocas la que no
 * conoces, la ves, y si te interesa se va a tu repaso.
 * ------------------------------------------------------------------ */

let modoAprender = "gramatica"; // "gramatica" | "lecturas"
let lecturaAbierta = null;

function cambiarModoAprender(modo) {
  modoAprender = modo;
  for (const [id, sel] of [
    ["gramatica", "#modo-gramatica"],
    ["frases", "#modo-frases"],
    ["lecturas", "#modo-lecturas"],
  ]) {
    $(sel).classList.toggle("is-active", modo === id);
    $(sel).setAttribute("aria-selected", String(modo === id));
  }
  $("#panel-gramatica").hidden = modo !== "gramatica";
  $("#panel-frases").hidden = modo !== "frases";
  $("#panel-lecturas").hidden = modo !== "lecturas";
  if (modo === "frases") renderFrases();
}

/* ------------------------------------------------------------------ *
 * Frases hechas
 *
 * Hay frases que un nativo suelta enteras y que palabra por palabra no
 * significan nada. Aquí van explicadas por dentro: de dónde sale la forma, en
 * qué situación cabe y dónde está la trampa para quien viene del español.
 * ------------------------------------------------------------------ */

let catFrase = "idioms";
let fraseAbierta = null;

function renderChipsFrases() {
  const cont = $("#chips-frases");
  cont.innerHTML = CATEGORIAS_FRASES.map(
    (c) =>
      `<button class="chip ${catFrase === c.id ? "is-active" : ""}" data-catfrase="${c.id}" aria-pressed="${catFrase === c.id}">${c.emoji} ${esc(c.nombre)}</button>`,
  ).join("");
  $$("[data-catfrase]", cont).forEach((b) => {
    b.onclick = () => {
      if (catFrase === b.dataset.catfrase) return;
      catFrase = b.dataset.catfrase;
      fraseAbierta = null;
      renderFrases();
    };
  });
}

function renderFrases() {
  renderChipsFrases();
  const cat = CATEGORIAS_FRASES.find((c) => c.id === catFrase);
  const suyas = FRASES.filter((f) => f.cat === catFrase);

  // Las de situación van agrupadas por contexto (restaurante, aeropuerto…):
  // es como se buscan de verdad, cuando estás a punto de meterte en una.
  const contextos = contextosDe(catFrase);
  const grupos = contextos.length
    ? contextos.map((ctx) => ({ titulo: ctx, frases: suyas.filter((f) => f.contexto === ctx) }))
    : [{ titulo: "", frases: suyas }];

  $("#frases-lista").innerHTML = `
    <p class="frases-sub">${suyas.length} frases · ${esc(cat.pista)}</p>
    ${grupos
      .map(
        (g) => `
      ${g.titulo ? `<h3 class="frase-grupo">${esc(g.titulo)}</h3>` : ""}
      <div class="frase-grid">${g.frases.map(tarjetaFrase).join("")}</div>`,
      )
      .join("")}`;

  $$("#frases-lista [data-frase]").forEach((b) => {
    b.onclick = (e) => {
      if (e.target.closest("[data-speak]")) return; // el altavoz no abre ni cierra
      fraseAbierta = fraseAbierta === b.dataset.frase ? null : b.dataset.frase;
      renderFrases();
    };
  });
}

function tarjetaFrase(f) {
  const abierta = fraseAbierta === f.id;
  return `
    <article class="frase-card ${abierta ? "is-open" : ""}" data-frase="${esc(f.id)}" role="button" tabindex="0" aria-expanded="${abierta}">
      <div class="frase-head">
        <div class="frase-textos">
          ${f.mal ? `<p class="frase-mal"><s lang="en">${esc(f.mal)}</s></p>` : ""}
          <p class="frase-en" lang="en">${esc(f.en)}</p>
          <p class="frase-pron">${esc(f.pron)}</p>
          <p class="frase-es">${esc(f.es)}</p>
        </div>
        <button class="speak" data-speak="${esc(f.en)}" aria-label="Escuchar">🔊</button>
      </div>
      ${
        abierta
          ? `<div class="frase-detalle">
               ${f.literal ? `<p class="frase-literal"><b>Palabra por palabra:</b> ${esc(f.literal)} <em>— y por eso no se puede traducir así.</em></p>` : ""}
               <p><b>De dónde sale</b><br>${esc(f.porque)}</p>
               <p><b>Cuándo se dice</b><br>${esc(f.cuando)}</p>
               ${f.ojo ? `<p class="frase-ojo"><b>⚠️ Ojo</b><br>${esc(f.ojo)}</p>` : ""}
               <div class="frase-ejemplos">
                 ${f.ejemplos
                   .map(
                     ([en, es]) => `<p class="frase-ejemplo">
                        <span lang="en">${esc(en)}</span>
                        <button class="speak speak-sm" data-speak="${esc(en)}" aria-label="Escuchar">🔊</button>
                        <em>${esc(es)}</em>
                      </p>`,
                   )
                   .join("")}
               </div>
             </div>`
          : `<p class="frase-mas">Tocar para ver por qué se dice así</p>`
      }
    </article>`;
}

const NIVEL_NOMBRE = { basico: "Básico", intermedio: "Intermedio", avanzado: "Avanzado" };

// Cuentos y lecturas comparten pantalla porque se leen igual; lo que cambia es
// el formato: el cuento tiene principio, giro y final, y eso tira de ti hasta
// el último párrafo aunque no entiendas todas las palabras.
const TEXTOS = [
  ...CUENTOS.map((c) => ({ ...c, tipo: "cuento" })),
  ...LECTURAS.map((l) => ({ ...l, tipo: "lectura" })),
];
const getTexto = (id) => TEXTOS.find((t) => t.id === id);

const GRUPOS_TEXTO = [
  { tipo: "cuento", nombre: "Cuentos", pista: "con historia: engancha y arrastra" },
  { tipo: "lectura", nombre: "Textos cortos", pista: "escenas del día a día" },
];

function tarjetaTexto(l) {
  const leida = store.lecturas?.[l.id];
  const frases = l.frases.length;
  return `<button class="reading-card" data-lectura="${l.id}">
    <span class="lesson-tag">${esc(NIVEL_NOMBRE[l.nivel] || l.nivel)} · ${frases} frases</span>
    <span class="lesson-title">${esc(l.titulo)}</span>
    <span class="lesson-goal">${esc(l.resumen)}</span>
    ${leida ? `<span class="lesson-score is-done">✓ leída</span>` : ""}
  </button>`;
}

function renderLecturasIndex() {
  $("#lecturas-lista").innerHTML = GRUPOS_TEXTO.map((g) => {
    const suyos = TEXTOS.filter((t) => t.tipo === g.tipo);
    if (!suyos.length) return "";
    return `<section class="text-group">
      <h3 class="text-group-title">${esc(g.nombre)} <small>${esc(g.pista)}</small></h3>
      <div class="lesson-grid">${suyos.map(tarjetaTexto).join("")}</div>
    </section>`;
  }).join("");
}

/**
 * Busca una palabra del texto en tus palabras o en el banco.
 *
 * Un texto real no trae infinitivos: trae "went", "told", "couldn't",
 * "boxes". Y resulta que los verbos irregulares son justo los más frecuentes,
 * así que sin resolverlos media lectura se quedaba sin encontrar.
 *
 * Orden: la palabra tal cual → sin contracción → forma irregular →
 * terminaciones regulares.
 */
function buscarPalabra(token) {
  // Los falsos amigos también son vocabulario: si sale "carpet" en un texto,
  // lo suyo es que puedas tocarlo y ver la trampa, no que no aparezca.
  const fuentes = [
    ...store.words,
    ...listaLocal(),
    ...FALSOS_AMIGOS.map((f) => ({ en: f.en, es: f.es, pron: f.pron, example: f.example, exampleEs: f.exampleEs, cat: "mixto" })),
    ...IRREGULARES.map((v) => ({ en: v.base, es: v.es, pron: v.pron.split(" · ")[0], example: "", exampleEs: "", cat: "verbos" })),
  ];
  const halla = (t) => {
    const n = norm(t);
    return n ? fuentes.find((w) => norm(w.en) === n) : null;
  };

  const crudo = String(token).toLowerCase().replace(/^['']+|['']+$/g, "").trim();
  if (!crudo) return null;

  // Candidatos por contracción: "couldn't" → "could", "they're" → "they".
  // Algunas no salen de quitar lo de detrás del apóstrofo ("won't" → "will").
  const candidatos = [crudo];
  if (CONTRACCIONES[crudo]) candidatos.push(CONTRACCIONES[crudo]);
  const corte = crudo.match(/^(.+?)(?:n['']?t|['](?:s|re|ve|ll|d|m))$/);
  if (corte) candidatos.push(corte[1]);

  for (const c of candidatos) {
    const directa = halla(c);
    if (directa) return directa;

    // Irregulares: "went" → "go", "understood" → "understand".
    const base = FORMA_A_BASE.get(norm(c));
    if (base) {
      const porBase = halla(base);
      if (porBase) return porBase;
    }

    const n = norm(c);
    const variantes = [
      // plurales y tercera persona
      n.replace(/ies$/, "y"),
      n.replace(/es$/, ""),
      n.replace(/s$/, ""),
      // pasados y gerundios regulares
      n.replace(/ied$/, "y"),
      n.replace(/ed$/, ""),
      n.replace(/ed$/, "e"),
      n.replace(/ing$/, ""),
      n.replace(/ing$/, "e"),
      n.replace(/(.)\1(ed|ing)$/, "$1"),
      // comparativos y superlativos: harder, easier, biggest
      n.replace(/ier$/, "y"),
      n.replace(/iest$/, "y"),
      n.replace(/er$/, ""),
      n.replace(/er$/, "e"),
      n.replace(/est$/, ""),
      n.replace(/est$/, "e"),
      n.replace(/(.)\1(er|est)$/, "$1"),
      // adverbios: genuinely, entirely, easily
      n.replace(/ily$/, "y"),
      n.replace(/ly$/, ""),
      n.replace(/ly$/, "le"),
      // sustantivos derivados: connection → connect, education → educate
      n.replace(/ation$/, "ate"),
      n.replace(/ion$/, ""),
      n.replace(/ment$/, ""),
    ];
    for (const v of variantes) {
      if (v.length < 3 || v === n) continue;
      const m = halla(v);
      if (m) return m;
    }
  }
  return null;
}

/** Parte la frase en palabras (tocables) y el resto (comas, puntos, espacios). */
const trocearFrase = (frase) =>
  frase
    .split(/([A-Za-z']+)/)
    .filter(Boolean)
    .map((t) => (/^[A-Za-z']+$/.test(t) ? `<button class="rword">${esc(t)}</button>` : esc(t)))
    .join("");

function abrirLectura(id) {
  const l = getTexto(id);
  if (!l) return;
  lecturaAbierta = l;

  $("#lecciones-index").hidden = true;
  $("#leccion-detalle").hidden = true;
  const box = $("#lectura-detalle");
  box.hidden = false;

  box.innerHTML = `
    <button class="btn-back" id="back-lecturas">← Lecturas</button>
    <div class="view-head">
      <span class="lesson-tag">${esc(NIVEL_NOMBRE[l.nivel] || l.nivel)}</span>
      <h2>${esc(l.titulo)}</h2>
      <p class="muted">Toca una palabra para verla. Toca la frase para traducirla entera.</p>
    </div>
    <article class="lectura">
      ${l.frases
        .map(
          ([en, es], n) => `<p class="lect-frase" data-n="${n}">
            <span class="lect-en" lang="en">${trocearFrase(en)}</span>
            <button class="lect-audio" data-speak="${esc(en)}" aria-label="Escuchar la frase">🔊</button>
            <em class="lect-es" hidden>${esc(es)}</em>
          </p>`,
        )
        .join("")}
    </article>
    <div class="row-actions">
      <button class="btn btn-ghost" id="lect-todo">Ver todas las traducciones</button>
      <button class="btn" id="lect-hecha">✓ Marcar como leída</button>
    </div>
    <div id="lect-pop" class="wordpop" hidden></div>`;

  $("#back-lecturas").onclick = () => {
    lecturaAbierta = null;
    cerrarPop();
    renderLeccionesIndex();
    cambiarModoAprender("lecturas");
  };

  $("#lect-todo").onclick = () => {
    const ocultas = $$(".lect-es", box).some((e) => e.hidden);
    $$(".lect-es", box).forEach((e) => (e.hidden = !ocultas));
    $("#lect-todo").textContent = ocultas ? "Ocultar traducciones" : "Ver todas las traducciones";
  };

  $("#lect-hecha").onclick = () => {
    store.lecturas = store.lecturas || {};
    store.lecturas[l.id] = todayStr();
    registerStudyDay();
    save();
    toast("Lectura marcada como leída");
    lecturaAbierta = null;
    renderLeccionesIndex();
    cambiarModoAprender("lecturas");
    updateChrome();
  };

  // Tocar palabra: la busca. Tocar el resto de la frase: traduce esa frase.
  //
  // Con addEventListener se acumulaba uno por cada lectura abierta: a la
  // segunda, el clic alternaba la traducción dos veces y parecía no hacer
  // nada. onclick sustituye al anterior en vez de sumarse.
  box.onclick = (e) => {
    const palabra = e.target.closest(".rword");
    if (palabra) {
      mostrarPalabra(palabra.textContent);
      return;
    }
    if (e.target.closest(".lect-audio") || e.target.closest("button")) return;
    const frase = e.target.closest(".lect-frase");
    if (frase) {
      const es = $(".lect-es", frase);
      es.hidden = !es.hidden;
    }
  };

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cerrarPop() {
  const pop = $("#lect-pop");
  if (pop) pop.hidden = true;
}

function mostrarPalabra(token) {
  const pop = $("#lect-pop");
  if (!pop) return;
  const w = buscarPalabra(token);

  if (!w) {
    pop.innerHTML = `
      <button class="wordpop-x" id="pop-x" aria-label="Cerrar">✕</button>
      <p class="wordpop-en" lang="en">${esc(token)}</p>
      <p class="muted">No la tengo en el banco. Puedes oírla igualmente.</p>
      <div class="row-actions">
        <button class="btn btn-ghost" data-speak="${esc(token)}">🔊 Escuchar</button>
      </div>`;
    pop.hidden = false;
    $("#pop-x").onclick = cerrarPop;
    return;
  }

  const yaLaTiene = store.words.some((x) => x.en === w.en);
  pop.innerHTML = `
    <button class="wordpop-x" id="pop-x" aria-label="Cerrar">✕</button>
    <p class="wordpop-en" lang="en">${esc(w.en)} <span class="pron">${esc(w.pron || "—")}</span></p>
    <p class="wordpop-es">${esc(w.es)}</p>
    <div class="row-actions">
      <button class="btn btn-ghost" data-speak="${esc(w.en)}">🔊 Escuchar</button>
      <button class="btn ${yaLaTiene ? "btn-ghost" : ""}" id="pop-add" ${yaLaTiene ? "disabled" : ""}>
        ${yaLaTiene ? "✓ Ya la tienes" : "+ Añadir a mis palabras"}
      </button>
    </div>`;
  pop.hidden = false;
  $("#pop-x").onclick = cerrarPop;
  if (!yaLaTiene) {
    $("#pop-add").onclick = () => {
      if (!addWord(w)) return;
      registerStudyDay();
      save();
      toast(`«${w.en}» añadida a tus palabras`);
      mostrarPalabra(token);
      updateChrome();
    };
  }
}

/* ------------------------------------------------------------------ *
 * Vista: Ajustes
 * ------------------------------------------------------------------ */

/**
 * Aplica el tema elegido. "auto" quita el atributo y deja mandar al móvil;
 * claro y oscuro lo fuerzan por encima de lo que diga el sistema.
 */
function aplicarTema() {
  const modo = store.settings.tema || "auto";
  const raiz = document.documentElement;
  if (modo === "claro") raiz.dataset.tema = "light";
  else if (modo === "oscuro") raiz.dataset.tema = "dark";
  else delete raiz.dataset.tema;

  // La barra del navegador en el móvil tiene que ir a juego con la app.
  const oscuro =
    modo === "oscuro" ||
    (modo === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  $('meta[name="theme-color"]')?.setAttribute("content", oscuro ? "#0b1020" : "#f3f5fa");

  $$("#seg-tema .seg-btn").forEach((b) => {
    const activo = b.dataset.tema === modo;
    b.classList.toggle("is-active", activo);
    b.setAttribute("aria-pressed", String(activo));
  });
}

async function renderAjustes() {
  await cargarLecciones();
  aplicarTema();
  $("#set-categoria").innerHTML = CATEGORIAS.map(
    (c) => `<option value="${c.id}">${esc(c.nombre)}</option>`,
  ).join("");
  $("#set-categoria").value = store.settings.category;
  $("#set-level").value = store.settings.level;
  $("#set-max-repaso").value = String(store.settings.maxRepaso ?? 25);
  $("#set-daily").value = String(store.settings.daily);
  $("#daily-valor").textContent = store.settings.daily;
  $("#set-topic").value = store.settings.topic || "";
  $("#stats").innerHTML = `
    <div class="stat"><b>${store.words.length}</b><span>palabras</span></div>
    <div class="stat"><b>${learnedWords().length}</b><span>dominadas</span></div>
    <div class="stat"><b>${LESSONS.filter((l) => lessonProgress(l.id).done).length}/${LESSONS.length}</b><span>lecciones</span></div>
    <div class="stat"><b>${store.stats.streak}</b><span>días seguidos</span></div>
    <div class="stat"><b>${store.stats.best}</b><span>mejor racha</span></div>`;
}

/* ------------------------------------------------------------------ *
 * Navegación
 * ------------------------------------------------------------------ */

/**
 * Pone una sección delante, sin repintarla.
 *
 * Separado de showView porque se puede abrir un juego desde fuera de Juegos
 * (la sugerencia al terminar el repaso): hay que traer la sección al frente,
 * pero repintar su índice borraría la partida que se acaba de montar.
 */
function activarVista(name) {
  $$(".tab").forEach((t) => {
    const active = t.dataset.view === name;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-current", active ? "page" : "false");
  });
  // Ajustes ya no es una pestaña: su estado activo lo marca el engranaje.
  $("#btn-ajustes").classList.toggle("is-active", name === "ajustes");
  $("#btn-ajustes").setAttribute("aria-current", name === "ajustes" ? "page" : "false");
  $$(".view").forEach((v) => v.classList.toggle("is-active", v.dataset.view === name));
}

function showView(name) {
  if (name !== "juegos") pararJuego();
  activarVista(name);
  if (name === "hoy") renderHoy();
  if (name === "repaso") renderRepaso(true);
  if (name === "juegos") renderJuegosIndex();
  if (name === "lecciones") renderLeccionesIndex();
  if (name === "lista") {
    renderLista();
    if (listaModo === "explorar") renderExplorarCard();
  }
  if (name === "ajustes") renderAjustes();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * El siguiente paso de la sesión, en un sitio solo.
 *
 * Hay cuatro sitios donde practicar (Hoy, Repaso, Juegos, Aprender) y antes
 * nada te decía cuál tocaba: la barra del día era texto muerto. Ahora es el
 * botón principal y encadena la sesión entera —nuevas → repaso → juego—, que
 * es lo que convierte dos pestañas sueltas en un hábito.
 */
function siguientePaso() {
  // Se anuncia lo que vas a hacer HOY, no todo lo vencido: prometer 68 cuando
  // la sesión son 25 asusta sin motivo y encima es mentira.
  const hoy = colaDeHoy().length;
  const sobran = dueWords().length - hoy;
  if (hoy) {
    return {
      vista: "repaso",
      texto:
        `Repasar <b>${hoy}</b> ${hoy === 1 ? "palabra" : "palabras"}` +
        (sobran ? ` <span class="daybar-resto">+${sobran} mañana</span>` : ""),
      cta: "▶",
    };
  }
  if (store.daily.date !== todayStr()) {
    return {
      vista: "hoy",
      texto: `Empezar con <b>${store.settings.daily}</b> ${store.settings.daily === 1 ? "palabra nueva" : "palabras nuevas"}`,
      cta: "▶",
    };
  }
  // Solo lleva a Juegos: la recomendación concreta está arriba del todo ahí,
  // así que no hace falta abrir la partida a bocajarro desde la cabecera.
  const j = juegoRecomendado();
  return {
    vista: "juegos",
    texto: `Día hecho ✓ · ${j ? `prueba ${esc(j.def.emoji)} ${esc(j.def.nombre)}` : "juega un rato"}`,
    cta: "🎮",
  };
}

function updateChrome() {
  // La chapa de la pestaña muestra lo de HOY, no todo lo vencido: es lo que
  // vas a hacer, y un 68 cuando la sesión son 25 solo agobia.
  const pendientes = colaDeHoy().length;
  const badge = $("#due-badge");
  badge.textContent = pendientes;
  badge.hidden = pendientes === 0;

  $("#streak-count").textContent = store.stats.streak;
  $("#streak-badge").classList.toggle("is-on", store.stats.streak > 0);

  const hora = new Date().getHours();
  $("#saludo").textContent =
    hora < 6 ? "Qué horas" : hora < 13 ? "Buenos días" : hora < 21 ? "Buenas tardes" : "Buenas noches";

  const hechas = store.daily.date === todayStr() ? store.daily.done || 0 : 0;
  const total = pendientes + hechas;
  const pct = total ? Math.round((hechas / total) * 100) : store.words.length ? 100 : 0;

  $("#daybar-fill").style.width = `${pct}%`;
  $("#daybar-track").setAttribute("aria-valuenow", String(pct));

  const paso = siguientePaso();
  $("#daybar-text").innerHTML = `${paso.texto}${hechas ? ` · ${hechas} ${hechas === 1 ? "hecha" : "hechas"} hoy` : ""}`;
  $("#daybar-go").textContent = paso.cta;
  $("#daybar-btn").dataset.vista = paso.vista;
}

/* ------------------------------------------------------------------ *
 * Eventos globales
 * ------------------------------------------------------------------ */

$("#tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (tab) showView(tab.dataset.view);
});

// La barra del día lleva a lo que toca ahora.
$("#daybar-btn").addEventListener("click", () => showView($("#daybar-btn").dataset.vista || "hoy"));

// Ajustes vive en la cabecera, no en la barra de abajo.
$("#btn-ajustes").addEventListener("click", () => showView("ajustes"));

$("#plan-toggle").addEventListener("click", () => togglePlan());

/**
 * La cabecera encoge al bajar.
 *
 * Es pegajosa y ocupaba 91px siempre; con la barra del día y la navegación,
 * casi un tercio de la pantalla del móvil era cromo. Al bajar, la marca sobra
 * —ya sabes en qué app estás— y se queda en una línea con la racha.
 */
let cabeceraEncogida = false;
addEventListener(
  "scroll",
  () => {
    const encoger = window.scrollY > 40;
    if (encoger === cabeceraEncogida) return;
    cabeceraEncogida = encoger;
    $(".topbar").classList.toggle("is-compact", encoger);
  },
  { passive: true },
);

// Un solo listener para todos los botones de audio, presentes o futuros.
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-speak]");
  if (btn) speak(btn.dataset.speak);

  const card = e.target.closest("[data-lesson]");
  if (card) openLeccion(card.dataset.lesson);

  const lect = e.target.closest("[data-lectura]");
  if (lect) abrirLectura(lect.dataset.lectura);

  const game = e.target.closest("[data-juego]");
  if (game) abrirJuego(game.dataset.juego);

  // Tocar una tarjeta tapada la descubre.
  const tapada = e.target.closest(".card.is-tapada");
  if (tapada && !btn) {
    tapada.classList.remove("is-tapada");
    $$(".hidden-until-reveal", tapada).forEach((el) => el.classList.remove("hidden-until-reveal"));
    $(".tap-hint", tapada)?.remove();
  }

  const del = e.target.closest("[data-borrar]");
  if (del) borrarPalabra(del.dataset.borrar);
});

function borrarPalabra(id) {
  const w = byId(id);
  if (!w) return;
  if (!confirm(`¿Borrar «${w.en}»? Se quita de tus palabras y del repaso.`)) return;
  store.words = store.words.filter((x) => x.id !== id);
  store.daily.ids = store.daily.ids.filter((x) => x !== id);
  save();
  renderLista();
  updateChrome();
  toast(`«${w.en}» borrada`);
}

$("#buscador").addEventListener("input", renderLista);
$("#filtro-lista").addEventListener("change", renderLista);
$("#modo-mis-palabras").addEventListener("click", () => cambiarModoLista("mis"));
$("#modo-explorar").addEventListener("click", () => cambiarModoLista("explorar"));
$("#modo-verbos").addEventListener("click", () => cambiarModoLista("verbos"));
$("#buscar-verbo").addEventListener("input", (e) => {
  filtroVerbo = e.target.value;
  renderPanelVerbos();
});
$("#chips-verbos").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  tipoVerbo = chip.dataset.tipo;
  renderPanelVerbos();
});
$("#modo-gramatica").addEventListener("click", () => cambiarModoAprender("gramatica"));
$("#modo-frases").addEventListener("click", () => cambiarModoAprender("frases"));
$("#modo-lecturas").addEventListener("click", () => cambiarModoAprender("lecturas"));

$("#set-level").addEventListener("change", (e) => {
  store.settings.level = e.target.value;
  save();
  toast("Nivel actualizado. Se aplica a las palabras de mañana.");
});

$("#set-max-repaso").addEventListener("change", (e) => {
  store.settings.maxRepaso = Number(e.target.value);
  save();
  updateChrome();
  const n = store.settings.maxRepaso;
  toast(n ? `Máximo ${n} palabras por sesión` : "Repaso sin límite: cuidado, puede crecer mucho");
});

$("#set-categoria").addEventListener("change", (e) => {
  store.settings.category = e.target.value;
  save();
  renderChipsCategoria();
  toast(`Ahora aprenderás: ${nombreCategoria(store.settings.category).toLowerCase()}`);
});

$("#set-topic").addEventListener("change", (e) => {
  store.settings.topic = e.target.value.trim();
  save();
  toast(
    store.settings.topic
      ? `Tema: ${store.settings.topic}. Pulsa "+ Más palabras" en Hoy para pedirlas ya.`
      : "Tema quitado: vocabulario general.",
  );
});

$("#set-daily").addEventListener("input", (e) => {
  $("#daily-valor").textContent = e.target.value;
});
$("#set-daily").addEventListener("change", (e) => {
  cambiarDiarias(Number(e.target.value));
  toast(`${store.settings.daily} palabras nuevas al día`);
});

$("#seg-tema").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-tema]");
  if (!btn) return;
  store.settings.tema = btn.dataset.tema;
  save();
  aplicarTema();
});

// Si estás en automático y el móvil cambia de tema (de noche, por ejemplo),
// la barra del navegador tiene que seguirlo.
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if ((store.settings.tema || "auto") === "auto") aplicarTema();
});

$("#menos").addEventListener("click", () => cambiarDiarias(store.settings.daily - 1));
$("#mas").addEventListener("click", () => cambiarDiarias(store.settings.daily + 1));

$("#btn-export").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `vocab-ingles-${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
});

$("#btn-import").addEventListener("click", () => $("#file-import").click());

$("#file-import").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const datos = JSON.parse(await file.text());
    if (!Array.isArray(datos.words)) throw new Error("El archivo no parece una copia de Vocab");
    // Se sanea ANTES de contar, para que el número del aviso sea el de las
    // palabras que de verdad se van a restaurar y no incluya las rotas.
    const palabras = sanearPalabras(datos.words);
    if (!palabras.length) throw new Error("La copia no tiene ninguna palabra utilizable");
    const rotas = datos.words.length - palabras.length;
    const aviso = `La copia tiene ${palabras.length} palabras${rotas ? ` (${rotas} rotas, se descartan)` : ""}. Se sustituirá lo que tengas ahora. ¿Seguir?`;
    if (!confirm(aviso)) return;
    store = { ...defaults(), ...datos, settings: { ...defaults().settings, ...datos.settings }, words: palabras };
    save();
    toast("Copia restaurada");
    showView("hoy");
  } catch (err) {
    toast(`No se pudo restaurar: ${err.message}`);
  } finally {
    e.target.value = "";
  }
});

$("#btn-reset").addEventListener("click", () => {
  if (!confirm("Se borrarán todas tus palabras y tu racha. ¿Seguro?")) return;
  localStorage.removeItem(KEY);
  store = defaults();
  save();
  toast("Todo borrado.");
  showView("hoy");
});

/**
 * Atajos de teclado:
 *   1 2 3    → elegir opción (repaso, tests y juegos) o calificar
 *   0        → no lo sé
 *   p        → pista (en los juegos que la tienen)
 *   enter    → siguiente
 *   ← → a    → moverse por Explorar y añadir la palabra
 *
 * Las vistas inactivas siguen en el DOM con su último contenido, así que todo
 * se busca dentro de la vista activa. Si no, el botón de una pantalla oculta
 * se queda con la tecla: el «Comprobar» del repaso robaba el Enter del test
 * de las lecciones.
 */
document.addEventListener("keydown", (e) => {
  if (e.target.matches("input, textarea, select")) return;
  const vista = $(".view.is-active");
  if (!vista) return;

  const explorarVisible =
    $('.view[data-view="lista"]').classList.contains("is-active") && listaModo === "explorar";
  if (explorarVisible) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moverExplorar(1);
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      moverExplorar(-1);
      return;
    }
    if (e.key.toLowerCase() === "a") {
      e.preventDefault();
      $("#explorar-add")?.click();
      return;
    }
  }

  if (e.key === "Enter") {
    const seguir = $(
      "#next-q, #next-hueco, #next-escribe, #next-repaso, #comprobar-repaso, #rejugar",
      vista,
    );
    if (seguir) {
      e.preventDefault();
      seguir.click();
    }
    return;
  }

  if (e.key === "0") {
    const nose = $("#nose, #paso", vista);
    if (nose) {
      e.preventDefault();
      nose.click();
    }
    return;
  }

  if (e.key.toLowerCase() === "p") {
    const pista = $("#pista", vista);
    if (pista) {
      e.preventDefault();
      pista.click();
    }
    return;
  }

  if (["1", "2", "3", "4"].includes(e.key)) {
    const n = Number(e.key) - 1;
    const opciones = $$(".options .option:not([disabled]), [data-grade]", vista);
    if (opciones[n]) {
      e.preventDefault();
      opciones[n].click();
    }
  }
});

/* ------------------------------------------------------------------ *
 * Arranque
 * ------------------------------------------------------------------ */

aplicarTema();
await cargarBanco();
updateChrome();
renderHoy();

// Las lecciones, en cuanto la app está quieta. Cargarlas perezosamente evita
// medio mega en el arranque, pero si esperásemos a que pulses «Lecciones»,
// esa pantalla tardaría en abrirse justo lo que hemos ahorrado. Bajándolas
// aquí, en segundo plano, ya están listas cuando llegas.
const precargar = () => cargarLecciones().catch(() => {});
if ("requestIdleCallback" in window) requestIdleCallback(precargar, { timeout: 3000 });
else setTimeout(precargar, 1200);

// Sin conexión: hace falta contexto seguro (https o localhost).
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  navigator.serviceWorker.register("./sw.js").catch(() => {
    /* si falla, la app va igual, solo que sin modo offline */
  });

  // Cuando se activa una versión nueva, esta pestaña sigue con el código
  // anterior: puede tener botones en pantalla que su JS no sabe manejar. En
  // vez de dejarte tocando algo que no responde, se ofrece recargar.
  navigator.serviceWorker.addEventListener("message", (e) => {
    if (e.data?.tipo !== "version-nueva") return;
    avisarVersionNueva();
  });
}

/**
 * La barra de «esto ya no está al día, ¿recargas?».
 *
 * La usan dos avisos distintos: que hay una versión nueva de la app, y que has
 * tocado algo en otra pestaña. Los dos se resuelven igual —recargando— y los
 * dos se pueden cerrar, porque si estás a mitad de un ejercicio recargar te lo
 * corta.
 */
function avisarRecarga(id, mensaje) {
  if ($(`#${id}`)) return;
  const barra = document.createElement("div");
  barra.id = id;
  barra.className = "aviso-version";
  barra.setAttribute("role", "status");
  barra.innerHTML = `
    <span>${esc(mensaje)}</span>
    <button class="btn" data-recargar>Recargar</button>
    <button class="aviso-cerrar" data-cerrar aria-label="Ahora no">✕</button>`;
  document.body.appendChild(barra);
  $("[data-recargar]", barra).onclick = () => location.reload();
  $("[data-cerrar]", barra).onclick = () => barra.remove();
}

const avisarVersionNueva = () => avisarRecarga("aviso-version", "Versión nueva disponible");

/**
 * Otra pestaña ha cambiado tus datos.
 *
 * save() escribe el estado ENTERO que esta pestaña tiene en memoria, así que con
 * dos abiertas la segunda en guardar pisa el trabajo de la primera. Comprobado:
 * añades una palabra en cada una y solo sobrevive la de la última.
 *
 * No se intenta fusionar los dos estados. Decidir qué caja gana, qué racha vale
 * y qué hacer con una palabra que una pestaña borró y la otra todavía tiene
 * tiene más formas de salir mal que bien, y resucitar algo que acabas de borrar
 * es peor que perder una palabra recién añadida. Lo que sí se arregla es que
 * pasara EN SILENCIO: ahora se avisa y decides tú.
 *
 * El evento storage solo llega a las OTRAS pestañas, nunca a la que escribió,
 * así que esto no se dispara por lo que haces aquí.
 */
window.addEventListener("storage", (e) => {
  if (e.key !== KEY || !e.newValue) return;
  avisarRecarga("aviso-otra-pestana", "Has cambiado algo en otra pestaña");
});
