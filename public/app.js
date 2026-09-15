import { SEED_WORDS, CATEGORIAS, nombreCategoria } from "./seed.js";
import { FALSOS_AMIGOS } from "./false-friends.js";
import { LECTURAS } from "./readings.js";
import { CUENTOS } from "./stories.js";
import { IRREGULARES, FORMA_A_BASE, CONTRACCIONES } from "./irregulars.js";
import { conjugar, verbosConjugables, tercera, gerundio, pasado, participio } from "./conjugar.js";
import { EJERCICIOS_MODALES } from "./modals.js";
import { FRASES, CATEGORIAS_FRASES, contextosDe } from "./phrases.js";
import { conGuiones } from "./silabas.js";
import { PATH, isPronunciation, orderedLessons, prerequisites, prepareQuiz, shuffled, isCorrect, correctAnswer, dueReview, learningState, recordLearning } from "./learning-engine.js";
import { GAME_OBJECTIVES, reviewCards, dueCards, scheduleMistake, schedulePractice, answerReview, reviewStage, reviewExercise, reviewPlan, reviewSessionValid, gameSummary, spelling, assessDictation, reviewCorrect } from "./game-learning.js";
import { MISSIONS, missionById, newMission, validMissionRun, missionQuestion, answerMission, advanceMission, missionSummary, missionCard, recommendMission } from "./game-missions.js";
import { createGameAudio } from './game-audio.js';

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
let productionItems = () => [];
let cargaLecciones = null;

function cargarLecciones() {
  if (!cargaLecciones) {
    cargaLecciones = Promise.all([import("./lessons.js"), import("./grammar-practice.js")]).then(([m, practice]) => {
      LESSONS = orderedLessons(m.LESSONS);
      getLesson = m.getLesson;
      productionItems = practice.productionItems;
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
  lessonSessions: {}, // prácticas en curso, guardadas en este navegador
  lessonMistakes: {}, // ejercicios pendientes del último intento
  lessonNotes: {}, // frases propias: autoevaluación, no una nota automática
  lecturas: {}, // id -> fecha en que la leíste
  games: {}, // id -> mejor marca
  gamesLast: {}, // id -> fecha de la última partida, para saber qué tienes olvidado
  gameLearning: {}, // últimas sesiones: aciertos independientes, ayudas y errores
  gameReview: {}, // errores de juegos; no depende del cupo de palabras nuevas
  gameMode: "learn",
  missionSessions: {}, // complete route and feedback survive reloads
  missionProgress: {}, // first baseline and bounded history, kept on device
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

/**
 * Guarda el estado, y avisa si el navegador se niega.
 *
 * setItem lanza QuotaExceededError cuando se agota el sitio del origen, y esa
 * excepción subía sin capturar por donde hubieran llamado a save(): grade(),
 * addWord(), borrarPalabra()… Lo peor no era el error, era el silencio.
 * Añadías una palabra, la veías aparecer en pantalla porque el estado en
 * memoria sí cambia, y al recargar no estaba. Trabajo perdido sin una pista.
 *
 * Ahora se avisa una sola vez —repetirlo en cada respuesta del repaso sería
 * insoportable— y con algo que se pueda hacer: exportar la copia y hacer
 * hueco. El aviso vuelve a armarse en cuanto un guardado sale bien.
 */
let sinSitio = false;
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
    sinSitio = false;
  } catch (err) {
    console.error("[vocab] no se pudo guardar:", err);
    if (sinSitio) return;
    sinSitio = true;
    // Se aplaza a propósito. Quien llama a save() suele enseñar su propio
    // mensaje justo después («añadida a tus palabras»), y ese pisaba a este:
    // el usuario se quedaba leyendo que todo había ido bien. Saliendo al final
    // gana el aviso que de verdad importa.
    setTimeout(
      () => toast("No se ha podido guardar: no queda sitio. Exporta una copia en Ajustes y borra palabras que ya domines."),
      0,
    );
  }
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

const TODAY_TOOL_ICONS = {
  listen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 7 8H4v8h3l4 3V5Z"/><path d="M15 9a4 4 0 0 1 0 6M17.7 6.4a8 8 0 0 1 0 11.2"/></svg>',
  add: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  hide: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.2A10.6 10.6 0 0 1 12 5c5.5 0 9 7 9 7a17 17 0 0 1-2.1 3M6.6 6.6C4.3 8.2 3 12 3 12s3.5 7 9 7c1.1 0 2.1-.3 3-.7"/></svg>',
  show: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z"/><circle cx="12" cy="12" r="2.5"/></svg>',
  delete: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>',
};

/** Herramientas de Hoy con jerarquía constante: icono, acción y contexto. */
function todayTool(icon, title, detail) {
  return `<span class="today-tool-icon" aria-hidden="true">${TODAY_TOOL_ICONS[icon]}</span>
    <span class="today-tool-copy"><b>${title}</b><small>${detail}</small></span>`;
}

/**
 * Lleva una pantalla o detalle al inicio respetando la preferencia de
 * movimiento, y coloca el foco en su título para navegación accesible.
 */
let inicioFocusVersion = 0;
function irAlInicio(contenedor = null) {
  const version = ++inicioFocusVersion;
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reducido ? "auto" : "smooth" });
  if (!contenedor) return;
  const focoInicial = document.activeElement;
  requestAnimationFrame(() => {
    if (version !== inicioFocusVersion || !contenedor.isConnected || contenedor.hidden) return;
    const vista = contenedor.closest('.view');
    if (vista && !vista.classList.contains('is-active')) return;
    const focoActual = document.activeElement;
    // A late animation frame must not steal focus after the learner starts
    // typing or chooses another control (especially with a mobile keyboard).
    if (focoActual?.matches('input, textarea, select, [contenteditable="true"]')) return;
    if (focoActual !== focoInicial && focoActual !== document.body) return;
    const titulo = $(".view-head h2", contenedor);
    if (!titulo) return;
    titulo.tabIndex = -1;
    titulo.focus({ preventScroll: true });
  });
}

let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  // Los mensajes largos necesitan algo más de tiempo para poder leerse sin
  // prisa; los cortos siguen desapareciendo rápido.
  const duracion = Math.min(6000, Math.max(2600, String(msg).length * 45));
  toastTimer = setTimeout(() => (el.hidden = true), duracion);
}

function wordCard(w, { blurred = false, position = null, total = null } = {}) {
  const hasPosition = Number.isInteger(position) && Number.isInteger(total);
  const positionMarkup = hasPosition
    ? `<span class="card-position" aria-hidden="true"><b>${position}</b><span>/${total}</span></span>`
    : "";
  const cardLabel = hasPosition ? ` aria-label="Palabra ${position} de ${total}: ${esc(w.en)}"` : "";
  return `
    <article class="card${blurred ? " is-tapada" : ""}" data-id="${w.id}"${cardLabel}>
      <div class="card-top">
        <div>
          <p class="word" lang="en">${esc(w.en)}</p>
          <div class="meta-row">
            <span class="pron card-pron" ${blurred ? "hidden" : ""}>${esc(w.pron || "—")}</span>
            ${w.cat && w.cat !== "mixto" ? `<span class="cat-chip">${esc(nombreCategoria(w.cat))}</span>` : ""}
          </div>
        </div>
        <div class="card-tools">
          ${positionMarkup}
          <button class="speak" data-speak="${esc(w.en)}" title="Escuchar" aria-label="Escuchar ${esc(w.en)}">${TODAY_TOOL_ICONS.listen}</button>
        </div>
      </div>
      ${hasPosition ? `<p class="card-recall-hint" ${blurred ? "" : "hidden"}>¿Recuerdas qué significa?</p>
        <button class="card-reveal" data-reveal aria-expanded="${!blurred}" aria-controls="answer-${esc(w.id)}" ${blurred ? "" : "hidden"}>${TODAY_TOOL_ICONS.show}<span>Ver traducción</span></button>` : ""}
      <div class="card-answer" ${hasPosition ? `id="answer-${esc(w.id)}"` : ""} ${blurred ? "hidden" : ""}>
      <p class="translation">${esc(w.es)}</p>
      ${
        w.example
          ? `<p class="example" lang="en">${esc(w.example)}<em lang="es">${esc(w.exampleEs)}</em></p>`
          : ""
      }
      </div>
    </article>`;
}

function setCardRevealed(card, revealed) {
  card.classList.toggle("is-tapada", !revealed);
  $(".card-answer", card).hidden = !revealed;
  $(".card-pron", card).hidden = !revealed;
  const hint = $(".card-recall-hint", card);
  if (hint) hint.hidden = revealed;
  const button = $("[data-reveal]", card);
  if (button) {
    button.setAttribute("aria-expanded", String(revealed));
    button.innerHTML = `${TODAY_TOOL_ICONS[revealed ? "hide" : "show"]}<span>${revealed ? "Ocultar traducción" : "Ver traducción"}</span>`;
  }
}

function syncPracticeMode() {
  const practice = !!store.settings.tapar;
  const button = $("#toggle-tapar");
  if (button) {
    button.setAttribute("aria-pressed", String(practice));
    button.innerHTML = todayTool("hide", "Practicar", practice ? "activado" : "sin respuestas");
  }
  $("#hoy-mode-hint").textContent = practice
    ? "Intenta recordar. Después, toca Ver traducción."
    : "Escucha, lee el ejemplo y activa Practicar para ponerte a prueba.";
  $$("#hoy-cards .card[data-id]").forEach(card => {
    setCardRevealed(card, !practice);
    $("[data-reveal]", card).hidden = !practice;
  });
}

/** Mantiene correctos los contadores si se añaden palabras sin repintar todo. */
function updateTodayCardPositions() {
  const cards = $$(".card[data-id]", $("#hoy-cards"));
  cards.forEach((card, indice) => {
    const current = $(".card-position b", card);
    const total = $(".card-position span", card);
    const word = $(".word", card)?.textContent || "";
    if (current) current.textContent = indice + 1;
    if (total) total.textContent = `/${cards.length}`;
    card.setAttribute("aria-label", `Palabra ${indice + 1} de ${cards.length}: ${word}`);
  });
}

/** Estado de carga con la misma geometría que las tarjetas reales. Evita que
 * el contenido salte cuando llegan las palabras y hace visible el progreso. */
function wordSkeletons() {
  return Array.from({ length: 2 }, () => `
    <article class="card skeleton-card" aria-hidden="true">
      <div class="skeleton-row">
        <span class="skeleton-line skeleton-word"></span>
        <span class="skeleton-circle"></span>
      </div>
      <span class="skeleton-line skeleton-pron"></span>
      <span class="skeleton-line skeleton-translation"></span>
      <div class="skeleton-example">
        <span class="skeleton-line"></span>
        <span class="skeleton-line skeleton-short"></span>
      </div>
    </article>`).join("");
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
  btn.innerHTML = todayTool("add", faltan ? "Completar" : "Añadir", faltan ? `${faltan} para el objetivo` : "más palabras");
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

  cards.innerHTML = wordSkeletons();
  cards.setAttribute("aria-busy", "true");
  actions.innerHTML = "";
  $("#hoy-source").innerHTML = "";
  $("#hoy-mode-hint").textContent = "";
  sub.textContent = "Preparando tus palabras…";

  const { words, source } = await ensureDailyBatch();
  cards.setAttribute("aria-busy", "false");

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
      ? `<details class="source-note">
           <summary>Estás usando la colección incluida</summary>
           <p>Puedes escuchar, practicar y guardar tu progreso con estas palabras.
           Para generar vocabulario nuevo con IA, configura <code>ANTHROPIC_API_KEY</code>
           en <code>.env.local</code> del servidor.</p>
         </details>`
      : "";

  $("#hoy-source").innerHTML = aviso;
  cards.innerHTML = words.map((w, indice) => wordCard(w, {
    blurred: store.settings.tapar,
    position: indice + 1,
    total: words.length,
  })).join("");

  const faltanObjetivo = Math.max(store.settings.daily - words.length, 0);
  // Aquí solo van las tres herramientas que actúan sobre las tarjetas, y por
  // eso van encima de ellas. El "Repasar ahora" que había se quitó: la barra
  // del día, justo arriba, ya dice "Repasar N" y está en todas las secciones,
  // así que era el mismo botón dos veces y empujaba las palabras fuera de la
  // pantalla.
  actions.innerHTML = `
    <button class="btn btn-ghost" id="listen-all">${todayTool("listen", "Escuchar", `${words.length} ${words.length === 1 ? "palabra" : "palabras"}`)}</button>
    <button class="btn btn-ghost" id="more-words">${todayTool("add", faltanObjetivo ? "Completar" : "Añadir", faltanObjetivo ? `${faltanObjetivo} para el objetivo` : "más palabras")}</button>
    <button class="btn btn-quiet" id="toggle-tapar" aria-pressed="${!!store.settings.tapar}" aria-controls="hoy-cards" aria-describedby="hoy-mode-hint">${todayTool("hide", "Practicar", "sin respuestas")}</button>`;

  syncPracticeMode();

  $("#listen-all").onclick = async () => {
    const btn = $("#listen-all");
    const run = ++speechRun;
    btn.disabled = true;
    btn.innerHTML = todayTool("listen", "Escuchando…", "una por una");
    speechSynthesis.cancel();
    for (const w of words) {
      if (run !== speechRun) break;
      await speak(w.en, { cancel: false });
    }
    btn.disabled = false;
    btn.innerHTML = todayTool("listen", "Escuchar", `${words.length} ${words.length === 1 ? "palabra" : "palabras"}`);
  };
  $("#more-words").onclick = () => addMoreWords();
  $("#toggle-tapar").onclick = () => {
    store.settings.tapar = !store.settings.tapar;
    save();
    syncPracticeMode();
  };

  updateChrome();
}

/** Pide otra tanda de palabras sin esperar a mañana (útil al cambiar de tema). */
async function addMoreWords() {
  const btn = $("#more-words");
  btn.disabled = true;
  btn.innerHTML = todayTool("add", "Generando…", "un momento");
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
    const cards = $("#hoy-cards");
    const anteriores = $$(".card[data-id]", cards).length;
    const total = anteriores + added.length;
    cards.insertAdjacentHTML(
      "beforeend",
      added.map((w, indice) => wordCard(w, {
        blurred: store.settings.tapar,
        position: anteriores + indice + 1,
        total,
      })).join(""),
    );
    updateTodayCardPositions();
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
    `${queueTotal} ${queueTotal === 1 ? "palabra" : "palabras"} en esta sesión` +
    (repasoExtra ? " · vuelta extra, no cuenta para las fechas" : "") +
    (aplazadas ? ` · ${aplazadas} ${aplazadas === 1 ? "queda" : "quedan"} para mañana` : "");

  const porcentaje = Math.round((hechas / queueTotal) * 100);
  const despues = Math.max(queue.length - 1, 0);
  const progreso = `
    <div class="quiz-progress-wrap">
      <div class="quiz-progress-meta">
        <span>Pregunta <b>${hechas + 1}</b> de ${queueTotal}</span>
        <span>${despues ? `${despues} ${despues === 1 ? "pendiente" : "pendientes"}` : "Última"}</span>
      </div>
      <div class="quiz-progress" role="progressbar" aria-label="Progreso del repaso" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${porcentaje}">
        <span style="width:${porcentaje}%"></span>
      </div>
    </div>`;

  // Cara vista mientras respondes
  const pregunta = alReves
    ? `<p class="quiz-dir">español → inglés</p>
       <p class="word">${esc(w.es)}</p>`
    : `<p class="word" lang="en">${esc(w.en)}</p>
       <button class="speak" data-speak="${esc(w.en)}" aria-label="Escuchar ${esc(w.en)}">${TODAY_TOOL_ICONS.listen}</button>`;

  // Ficha completa, ya resuelta
  const ficha = `
    <p class="word" lang="en">${esc(w.en)}</p>
    <span class="pron">${esc(w.pron || "—")}</span>
    <p class="translation">${esc(w.es)}</p>
    ${w.example ? `<p class="example" lang="en">${esc(w.example)}<em lang="es">${esc(w.exampleEs)}</em></p>` : ""}
    <button class="speak" data-speak="${esc(w.en)}" aria-label="Escuchar ${esc(w.en)}">${TODAY_TOOL_ICONS.listen}</button>`;

  if (!repaso.resuelto) {
    box.innerHTML = `
      ${progreso}
      <article class="card quiz-card" data-id="${w.id}">
        ${pregunta}
        <p class="quiz-hint">${repaso.escribir ? "Ya la dominas: escríbela sin ayuda." : alReves ? "¿Cómo se dice en inglés?" : "¿Qué significa?"}</p>
      </article>
      ${
        repaso.escribir
          ? `<label class="sr-only" for="resp-repaso">Tu respuesta en inglés</label>
             <input id="resp-repaso" class="input input-big" type="text" placeholder="Escribe la palabra en inglés…"
                    autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" />
             <div class="row-actions">
               <button class="btn" id="comprobar-repaso">Comprobar</button>
               <button class="btn btn-nose" id="nose"><span class="nose-icon" aria-hidden="true">?</span>No la sé</button>
             </div>`
          : `<div class="options" id="op-repaso">
               ${repaso.opciones
                 .map((o, indice) => `<button class="option" data-en="${esc(o.en)}"><span class="option-key" aria-hidden="true">${indice + 1}</span><span>${esc(alReves ? o.en : o.es)}</span></button>`)
                 .join("")}
             </div>
             <button class="btn btn-nose" id="nose"><span class="nose-icon" aria-hidden="true">?</span>No lo sé</button>`
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
      <b class="feedback-title"><span class="feedback-icon" aria-hidden="true">${repaso.acertada ? "✓" : repaso.rendida ? "?" : "!"}</span>${titulo}</b>
      ${repaso.sinonimo ? `<p>También vale <b lang="en">${esc(repaso.sinonimo)}</b>.</p>` : ""}
      ${!repaso.acertada && repaso.texto ? `<p>Escribiste «${esc(repaso.texto)}».</p>` : ""}
    </div>
    <div class="row-actions">
      ${
        repaso.acertada
          ? `<button class="btn btn-good" data-grade="1"><span class="btn-key" aria-hidden="true">1</span>Bien</button>
             <button class="btn btn-easy" data-grade="2"><span class="btn-key" aria-hidden="true">2</span>Fácil</button>`
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
let listaFiltro = "todas";

function renderLista() {
  const query = $("#buscador").value.trim();
  const q = query.toLowerCase();
  const filtro = listaFiltro;

  const items = store.words
    .filter((w) => !q || w.en.toLowerCase().includes(q) || w.es.toLowerCase().includes(q))
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

  const filterCounts = {
    todas: store.words.length,
    hoy: store.words.filter((w) => w.due <= todayStr()).length,
    dificiles,
    dominadas: store.words.filter((w) => w.box >= 4).length,
  };
  $$("[data-list-filter]", $("#filtros-lista")).forEach((button) => {
    const active = button.dataset.listFilter === filtro;
    const count = filterCounts[button.dataset.listFilter] || 0;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    $(".filter-count", button).textContent = count;
    button.setAttribute("aria-label", `${button.dataset.listLabel}: ${count}`);
  });
  $("#limpiar-busqueda").hidden = !q;
  const filtrando = q || filtro !== "todas";
  $("#lista-cuenta").textContent = filtrando
    ? `${items.length} ${items.length === 1 ? "resultado" : "resultados"}`
    : `${items.length} ${items.length === 1 ? "palabra guardada" : "palabras guardadas"}`;

  $("#lista").innerHTML = items.length
    ? items
        .map((w) => {
          const estado = w.box >= 4 ? "learned" : w.due <= todayStr() ? "due" : "";
          const titulo =
            estado === "learned" ? "Ya dominada" : estado === "due" ? "Toca repasarla" : "En repaso";
          const marca = esDificil(w) ? ` <span class="dificil" title="La has fallado ${w.lapses} veces">difícil</span>` : "";
          return `<tr data-word-state="${estado || "learning"}">
            <td class="cell-en"><span class="dot ${estado}" title="${titulo}"></span>${esc(w.en)}${marca}</td>
            <td class="cell-pron">(${esc(w.pron || "—")})</td>
            <td class="cell-es"><span>${esc(w.es)}</span><span class="word-status ${estado || "learning"}">${titulo}</span></td>
            <td class="cell-audio">
              <button class="speak speak-sm" data-speak="${esc(w.en)}" aria-label="Escuchar ${esc(w.en)}">${TODAY_TOOL_ICONS.listen}</button>
              <button class="speak speak-sm speak-del" data-borrar="${w.id}" aria-label="Borrar ${esc(w.en)}" title="Borrar">${TODAY_TOOL_ICONS.delete}</button>
            </td>
          </tr>`;
        })
        .join("")
    : `<tr><td colspan="4"><div class="empty"><span class="big">⌕</span>${q ? `No hay coincidencias para «${esc(query)}».` : "No hay palabras en este filtro."}</div></td></tr>`;
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

  if (modo === "mis") renderLista();
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
    desc: "Recupera la palabra sin prisa. El reto de 60 segundos es opcional.",
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
    desc: "Relaciona seis parejas inglés–español. Sin reloj por defecto.",
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
  { nombre: "Escritura", pista: "de las letras guiadas al recuerdo escrito", juegos: ["escribe", "ordena"] },
  { nombre: "Gramática", pista: "las formas que no se deducen", juegos: ["irregulares", "modales"] },
  { nombre: "Cómo se dice", pista: "lo que sale entero, sin traducir", juegos: ["frases"] },
  { nombre: "Tus errores", pista: "justo lo que se te resiste", juegos: ["falsos", "confusas"] },
  { nombre: "Memoria", pista: "relacionar forma y significado", juegos: ["parejas"] },
];

let juego = null; // estado del juego en curso
let gameTimer = null;
let activeGameId = null;
let gameReviewRun = null;
const missionAudio = createGameAudio(window);

function pararJuego() {
  missionAudio.stop();
  clearInterval(gameTimer);
  gameTimer = null;
  pararEscucha();
  juego = null;
  gameReviewRun = null;
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

const mezclar = (arr) => shuffled(arr);
/** Escapa los caracteres que tienen significado especial dentro de una expresión regular. */
const escRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const record = (id) => store.games?.[id] ?? 0;

function estadoJuego(g) {
  if (g.id === "hablar" && !hayMicrofono) return { texto: "No disponible aquí", warning: true };
  const mejor = record(g.id);
  if (mejor) {
    return {
      texto: g.record === "tiempo" ? `Mejor ${(mejor / 1000).toFixed(1)} s` : `Récord ${mejor}`,
      warning: false,
    };
  }
  return { texto: store.gamesLast?.[g.id] ? "Sin marca todavía" : "Nuevo", warning: false };
}

function guardarRecord(id, valor, menorEsMejor = false) {
  const summary = gameSummary(juego || {});
  store.gameLearning = store.gameLearning || {};
  store.gameLearning[id] = { ...summary, date: todayStr() };
  store.games = store.games || {};
  const actual = store.games[id];
  // Sin marca previa cuenta como récord, pero un cero no: ni la primera
  // partida debería celebrar un 0 de 10, ni una resuelta entera a base de
  // pistas, que para el récord vale lo mismo que un cero.
  const esMarca = menorEsMejor || valor > 0;
  const comparable = !["rapida", "parejas"].includes(id) || store.gameMode === "challenge";
  const mejor = comparable && (actual === undefined ? esMarca : menorEsMejor ? valor < actual : valor > actual);
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
  guardarErrorJuego(w);
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

function guardarErrorJuego(word = null) {
  if (!juego || !activeGameId) return;
  const item = juego.items?.[juego.i];
  const w = word || (activeGameId === "rapida" ? juego.actual : item?.w || item);
  let card;
  if (activeGameId === "irregulares" && item?.v) {
    const { v, hueco } = item;
    card = { prompt: `Escribe el ${hueco === "pasado" ? "pasado simple" : "participio"} de ${v.base} (${v.es}).`, accepted: [v[hueco], ...v[hueco].split("/")], explanation: `${v.base} · ${v.pasado} · ${v.participio}. El participio se usa, por ejemplo, después de have; el pasado simple sitúa una acción pasada.` };
  } else if (activeGameId === "modales" && item?.frase) {
    card = { prompt: `${item.frase} — ${item.es} Escribe el modal que expresa esta intención.`, accepted: [item.opciones[item.correcta]], explanation: item.why };
  } else if (activeGameId === "frases" && item?.en) {
    card = { prompt: `Recupera la expresión practicada: ${item.situacion} (${item.es})`, accepted: [item.en], explanation: `${item.porque} Comparamos la expresión del juego; pueden existir otras formas válidas de responder a esta situación.` };
  } else if (activeGameId === "dictado" && w?.example) {
    card = { prompt: `Recupera la frase del dictado: ${w.exampleEs || "Escucha el modelo si necesitas ayuda"}`, accepted: [w.example], explanation: `${w.example} — ${w.exampleEs || ""}. Revisa el sentido además del sonido.`, exact: true };
  } else if (w?.en && w?.es) {
    const synonyms = (juego.pool || []).filter(x => mismoEs(x, w)).map(x => x.en);
    card = { prompt: `Escribe en inglés (forma de diccionario): ${w.es}`, accepted: [...new Set([w.en, ...synonyms])], explanation: `${w.en} — ${w.es}.${w.example ? ` ${w.example} — ${w.exampleEs || ""}` : ""}` };
  }
  if (!card) return;
  card.key = `${activeGameId}|${card.prompt}`;
  card.game = activeGameId;
  store.gameReview = scheduleMistake(store.gameReview, card, todayStr());
  save();
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
  const weak = jugables.filter(g => store.gameLearning?.[g.id]?.accuracy != null && store.gameLearning[g.id].accuracy < 80 && ultima[g.id] !== todayStr())
    .sort((a, b) => store.gameLearning[a.id].accuracy - store.gameLearning[b.id].accuracy)[0];
  if (weak) return { id: weak.id, def: weak, motivo: "En tu última sesión necesitaste más ayuda. Practica con calma y revisa las explicaciones." };
  const nunca = jugables.filter((g) => !ultima[g.id]).sort((a, b) => Number(b.id === "escribe") - Number(a.id === "escribe"));
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
  const estado = estadoJuego(s.def);
  caja.innerHTML = `
    <button class="sugerido" data-juego="${esc(s.id)}">
      <span class="sugerido-eyebrow">Hoy te toca</span>
      <span class="sugerido-nombre">${s.def.emoji} ${esc(s.def.nombre)}</span>
      <span class="sugerido-motivo">${esc(s.motivo)}</span>
      <span class="sugerido-footer">
        <span>${esc(estado.texto)}</span>
        <span class="sugerido-cta">Jugar <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 7l5 5-5 5"/></svg></span>
      </span>
    </button>`;
  // Lo abre el listener global de [data-juego]: poner aquí otro onclick
  // lanzaría la partida dos veces.
}

function renderJuegosIndex() {
  pararJuego();
  $("#juego-activo").hidden = true;
  $("#juegos-index").hidden = false;
  document.title = "Juegos · Vocab";
  irAlInicio($("#juegos-index"));

  renderChipsJuegos();
  renderJuegoSugerido();
  renderMissionHub();
  renderGameReviewPlan();
  if (!$("#game-learning-hub")) $("#juego-sugerido").insertAdjacentHTML("beforebegin", '<div id="game-learning-hub"></div>');
  $("#game-learning-hub").innerHTML = `<section class="game-learning-panel">
    <label for="game-mode">Tu ritmo en Respuesta rápida y Emparejar</label>
    <select id="game-mode"><option value="learn" ${store.gameMode !== "challenge" ? "selected" : ""}>Aprender sin reloj</option><option value="challenge" ${store.gameMode === "challenge" ? "selected" : ""}>Reto con reloj</option></select>
    <p>Un récord mide una partida, no dominio. Los errores se guardan para volver a recordarlos.</p>
  </section>`;
  $("#game-mode").onchange = event => { store.gameMode = event.target.value; save(); };

  const pool = gamePool().length;
  const lios = paresConfusos().length;
  const filtro = juegoCat === "mixto" ? "" : ` de ${nombreCategoria(juegoCat).toLowerCase()}`;
  $("#juegos-sub").textContent =
    `${pool} palabras${filtro} en juego · aprende, corrige y vuelve a recordar` +
    (lios ? ` · ${lios} ${lios === 1 ? "pareja que mezclas" : "parejas que mezclas"}` : "");

  const tarjeta = (g) => {
    const estado = estadoJuego(g);
    const requisito = g.minimo ? `${g.minimo}+ palabras` : "Siempre disponible";
    return `<button class="game-card${estado.warning ? " has-warning" : ""}" data-juego="${g.id}" aria-label="${esc(g.nombre)}. ${esc(g.desc)}. ${esc(estado.texto)}">
      <span class="game-emoji">${g.emoji}</span>
      <span class="game-copy">
        <span class="game-name">${esc(g.nombre)}</span>
        <span class="game-desc">${esc(g.desc)}</span>
      </span>
      <span class="game-meta">
        <span class="game-state${estado.warning ? " is-warning" : ""}">${esc(estado.texto)}</span>
        ${store.gameLearning?.[g.id]?.total ? `<span class="game-learning-last">Última: ${store.gameLearning[g.id].independent}/${store.gameLearning[g.id].total} sin ayuda</span>` : ""}
        <span class="game-requirement">${esc(requisito)}</span>
        <span class="game-play">${estado.warning ? "Ver motivo" : "Jugar"} <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 7l5 5-5 5"/></svg></span>
      </span>
    </button>`;
  };

  // Agrupados por lo que entrena cada uno: con ocho seguidos no se sabe cuál
  // coger, y no es lo mismo querer practicar oído que ortografía.
  $("#juegos-lista").innerHTML = GRUPOS_JUEGOS.map((grupo) => {
    const suyos = JUEGOS.filter((g) => grupo.juegos.includes(g.id));
    if (!suyos.length) return "";
    return `<section class="game-group">
      <h3 class="game-group-title">
        <span><b>${esc(grupo.nombre)}</b><small>${esc(grupo.pista)}</small></span>
        <em>${suyos.length} ${suyos.length === 1 ? "juego" : "juegos"}</em>
      </h3>
      <div class="game-grid">${suyos.map(tarjeta).join("")}</div>
    </section>`;
  }).join("");
}

/* ---------- Misiones: una ruta, no un marcador de velocidad ---------- */
function reviewDateLabel(day) {
  if (day <= todayStr()) return 'Hoy';
  if (day === addDays(1)) return 'Mañana';
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' }).format(new Date(`${day}T12:00:00`));
}
function renderGameReviewPlan() {
  if (!$('#game-review-plan')) $('#mission-hub').insertAdjacentHTML('beforebegin', '<div id="game-review-plan"></div>');
  const plan = reviewPlan(store.gameReview, todayStr());
  const box = $('#game-review-plan');
  box.hidden = !plan.total;
  if (!plan.total) { box.innerHTML = ''; return; }
  const firstAttempts = plan.today.independent + plan.today.assisted + plan.today.wrong;
  box.innerHTML = `<section class="card review-plan">
    <p class="eyebrow">Tu plan de repaso</p><h3>${plan.due ? `${plan.due} ${plan.due === 1 ? 'objetivo' : 'objetivos'} para hoy` : 'Por hoy, al día'}</h3>
    <p>${plan.due ? `Una ronda incluye hasta 10 objetivos. ${plan.upcoming} ${plan.upcoming === 1 ? 'queda programado' : 'quedan programados'} para después.` : `Próxima comprobación: ${esc(reviewDateLabel(plan.next))}. Tienes ${plan.upcoming} ${plan.upcoming === 1 ? 'objetivo programado' : 'objetivos programados'}.`}</p>
    ${firstAttempts ? `<p class="review-day-summary">En los repasos que tocaban hoy: <b>${plan.today.independent}/${firstAttempts} sin ayuda</b> · ${plan.today.assisted} con ayuda · ${plan.today.wrong} ${plan.today.wrong === 1 ? 'fallo' : 'fallos'}. Solo cuenta el primer intento.</p>` : ''}
    <button class="btn ${plan.due ? '' : 'btn-ghost'}" id="open-game-review">${plan.due ? `Repasar ahora · ${Math.min(10, plan.due)}` : 'Practicar antes de la fecha'}</button>
    <p class="muted">${plan.due ? 'Los objetivos de hoy van primero. Los futuros no se mezclan en esta ronda.' : 'Es opcional. Ensayar ahora no adelanta las comprobaciones de otros días.'}</p>
    <details><summary>Ver objetivos y próximas fechas</summary><div class="review-plan-groups">${plan.groups.map((group, i) => {
      const label = group.mission ? missionById(group.mission)?.title || 'Misión guardada' : JUEGOS.find(g => g.id === group.game)?.nombre || 'Práctica guardada';
      return `<article><h4>${esc(label)}</h4><p>${group.total} ${group.total === 1 ? 'objetivo' : 'objetivos'} · ${group.due ? `${group.due} para hoy` : esc(reviewDateLabel(group.next))}</p><p class="muted">${group.support ? `${group.support} ${group.support === 1 ? 'necesita' : 'necesitan'} refuerzo. ` : ''}${group.maintenance ? `${group.maintenance} en mantenimiento.` : 'Comprobaciones espaciadas en curso.'}</p><button class="btn btn-ghost" data-review-group="${i}">${group.due ? 'Repasar este grupo' : 'Practicar este grupo antes'}</button></article>`;
    }).join('')}</div><p class="muted">No mostramos las respuestas antes de practicar. Estar al día no significa haber dominado todos los objetivos.</p></details>
  </section>`;
  $('#open-game-review').onclick = () => abrirRepasoJuegos();
  $$('[data-review-group]', box).forEach(button => button.onclick = () => {
    const group = plan.groups[Number(button.dataset.reviewGroup)];
    abrirRepasoJuegos(group.game, group.mission);
  });
}

function missionAudioMarkup(question, run) {
  if (!question.audio) return '';
  return `<div class="mission-audio"><div class="row-actions"><button class="btn" id="task-listen">${run.listenedTo === question.audio ? 'Repetir audio' : 'Escuchar'}</button><button class="btn btn-ghost" id="task-slow">Lento (ayuda)</button></div>
    <p id="task-audio-status" role="status">${run.audioFailed ? 'El audio no ha respondido. Reintenta o practica leyendo la transcripción.' : run.listenedTo === question.audio ? 'Audio reproducido. Puedes responder.' : 'Pulsa Escuchar. No necesitas micrófono.'}</p>
    <button class="btn btn-ghost" id="task-transcript">${run.transcript ? 'Texto consultado · con ayuda' : 'Ver transcripción (ayuda)'}</button>
    ${run.transcript ? `<p class="pista-box" lang="en">${esc(question.audio)}</p>` : ''}
    <p class="muted">Puedes repetir. Lento y texto cuentan como ayuda.</p></div>`;
}
function bindMissionAudio(question, run, render) {
  if (!question.audio || !$('#task-listen')) return;
  const play = slow => {
    if (slow) run.help = true;
    save();
    $('#task-audio-status').textContent = 'Reproduciendo…';
    missionAudio.play(question.audio, { slow,
      onComplete: () => { run.listenedTo = question.audio; run.audioFailed = false; save(); render(); },
      onError: () => { run.audioFailed = true; save(); render(); },
    });
  };
  $('#task-listen').onclick = () => play(false);
  $('#task-slow').onclick = () => play(true);
  $('#task-transcript').onclick = () => { missionAudio.stop(); run.help = true; run.transcript = true; save(); render(); };
}

function renderMissionHub() {
  if (!$("#mission-hub")) $("#juego-sugerido").insertAdjacentHTML('beforebegin', '<div id="mission-hub"></div>');
  const sessions = store.missionSessions || {};
  const progress = store.missionProgress || {};
  const recommendation = recommendMission(MISSIONS, sessions, progress, todayStr());
  const { mission: next, resumed } = recommendation;
  const due = dueCards(store.gameReview, todayStr()).length;
  const complete = MISSIONS.filter(m => progress[m.id]).length;
  $("#mission-hub").innerHTML = `<section class="mission-hub card">
    <p class="eyebrow">Aprende jugando · ruta guiada</p>
    <h3>${esc(next.title)}</h3><p>${esc(next.goal)}</p>
    <p class="muted">${esc(recommendation.reason)}</p>
    <ol class="mission-path" aria-label="Recorrido de una misión"><li>Explora</li><li>Reconoce</li><li>Recuerda</li><li>Aplica</li></ol>
    <p class="muted">${esc(next.level)} · 3 objetivos · sin reloj. Puedes salir y retomar.</p>
    ${due ? `<button class="btn" id="mission-review">Primero, repaso de hoy · ${due}</button>` : ''}
    <button class="btn ${due ? 'btn-ghost' : ''}" id="mission-start">${resumed ? 'Continuar misión' : 'Empezar misión'}</button>
    <p class="muted">${complete} de ${MISSIONS.length} misiones practicadas. Completar no significa dominar: después comprobarás qué recuerdas en otros días.</p>
    <details><summary>Elegir misión y ver mi progreso</summary><div class="mission-list">${MISSIONS.map(m => {
      const p = progress[m.id];
      const cards = reviewCards(store.gameReview).filter(c => c.mission === m.id);
      const checked = cards.filter(c => reviewStage(c) === 3).length;
      return `<article><h4>${esc(m.title)}</h4><p class="muted">${esc(m.level)}</p>${p ? `<p>Inicio: ${p.firstBaseline}/3 · último contexto final: ${p.last.transfer}/3 sin ayuda.</p><p>${checked}/3 objetivos con tres comprobaciones espaciadas; continúan en mantenimiento.</p>` : '<p>Todavía sin medición inicial.</p>'}<button class="btn btn-ghost" data-mission="${m.id}">${sessions[m.id] && !sessions[m.id].completed ? 'Retomar' : p ? 'Volver a practicar' : 'Empezar'}</button></article>`;
    }).join('')}</div><p class="muted">Datos guardados solo en este navegador. Comparamos tareas distintas sobre los mismos objetivos, no pruebas equivalentes ni un nivel oficial. Al repetir una misión, sus contextos ya pueden ser familiares.</p></details>
  </section>`;
  $("#mission-start").onclick = () => abrirMision(next.id);
  if ($("#mission-review")) $("#mission-review").onclick = () => abrirRepasoJuegos();
  $$('[data-mission]', $("#mission-hub")).forEach(button => button.onclick = () => abrirMision(button.dataset.mission));
  // Keep free play available, with lower priority than the structured route.
  $("#juego-sugerido").hidden = true;
}

function abrirMision(id) {
  const mission = missionById(id);
  if (!mission) return;
  pararJuego(); activarVista('juegos');
  store.missionSessions ||= {};
  const previous = store.missionSessions[id];
  if (!validMissionRun(previous, mission) || previous.completed) store.missionSessions[id] = newMission(mission, todayStr());
  save();
  $("#juegos-index").hidden = true;
  const box = $("#juego-activo"); box.hidden = false;
  box.innerHTML = `<button class="btn-back" id="back-juegos">← Guardar y salir</button><div class="view-head"><h2>${esc(mission.title)}</h2><p class="muted">${esc(mission.goal)}</p></div><div id="mission-box"></div>`;
  $("#back-juegos").onclick = renderJuegosIndex;
  document.title = `${mission.title} · Vocab`;
  renderMision(mission); irAlInicio(box);
}

function renderMision(mission) {
  missionAudio.stop();
  const run = store.missionSessions[mission.id];
  const box = $("#mission-box");
  if (run.i >= run.steps.length) {
    if (!run.completed) {
      run.completed = todayStr();
      const result = missionSummary(run);
      store.missionProgress ||= {};
      const previous = store.missionProgress[mission.id];
      store.missionProgress[mission.id] = { firstBaseline: previous?.firstBaseline ?? result.baseline, last: result, history: [...(previous?.history || []), result].slice(-20) };
      for (const item of mission.items) store.gameReview = schedulePractice(store.gameReview, missionCard(mission, item), todayStr());
      registerStudyDay(); save(); updateChrome();
    }
    const result = missionSummary(run);
    box.innerHTML = `<section class="card mission-result"><p class="eyebrow">Misión practicada</p><h3 tabindex="-1">${result.transfer === 3 ? 'Lo has aplicado sin ayuda' : 'Ya sabes qué reforzar'}</h3>
      <dl class="mission-metrics"><div><dt>Antes de practicar</dt><dd>${result.baseline}/3</dd></div><div><dt>${mission.mode === 'listening' ? 'Escucha y escribe' : 'Recuerdo escrito'}</dt><dd>${result.recall}/3</dd></div><div><dt>Otro contexto</dt><dd>${result.transfer}/3</dd></div></dl>
      <p>Son primeros intentos sin ayuda. Las pistas y los reintentos sirven para practicar, pero no elevan estas cifras.</p>
      <h4>La siguiente meta: recordarlo otro día</h4><p>Los tres objetivos están en tu repaso. Harás tres comprobaciones sin ayuda, separadas por 1, 3 y 7 días; después habrá mantenimiento. Si necesitas ayuda, volverás a reforzarlo.</p>
      <p class="muted">Estos resultados no demuestran dominio ni eficacia del método. ${mission.mode === 'listening' ? 'Se evalúa extraer datos de audios sintéticos breves, no comprender cualquier conversación real.' : 'Los contextos son ejercicios escritos acotados, no conversación libre.'}</p>
      <button class="btn" id="mission-done">Ver mi ruta y próximos repasos</button>
      <details><summary>Seguir jugando libremente</summary><p>Practican destrezas relacionadas; las partidas libres no sustituyen las comprobaciones de la misión.</p><div class="row-actions">${mission.games.map(id => { const g = JUEGOS.find(g => g.id === id); return g ? `<button class="btn btn-ghost" data-juego="${id}">${esc(g.nombre)}</button>` : ''; }).join('')}</div></details>
    </section>`;
    $("#mission-done").onclick = renderJuegosIndex;
    $('h3', box).focus({ preventScroll: true }); return;
  }
  const step = run.steps[run.i];
  const item = mission.items[step.item];
  const response = run.answers[run.i];
  const labels = { baseline: 'Punto de partida', example: 'Explora el ejemplo', choice: 'Reconoce el significado', recall: 'Recuerda sin opciones', retry: 'Otra oportunidad de práctica', transfer: 'Aplica en otro contexto' };
  const question = missionQuestion(mission, step);
  box.innerHTML = `<section class="card mission-exercise">
    <p class="quiz-count">${esc(labels[step.kind])} · objetivo ${step.item + 1} de 3</p>
    <progress value="${run.i}" max="${run.steps.length}" aria-label="Avance de la misión"></progress>
    ${step.kind === 'example' ? `<h3 tabindex="-1">${esc(item.meaning)}</h3><p class="mission-example" lang="en">${esc(item.example)}</p><p>${esc(item.explanation)}</p><button class="btn btn-ghost" data-speak="${esc(item.example.split(' — ')[0])}">Escuchar el ejemplo</button><button class="btn" id="mission-next">Lo he leído · continuar</button>` : `
    <h3 tabindex="-1">${esc(question.prompt)}</h3>
    ${!response ? missionAudioMarkup(question, run) : ''}
    ${question.audio ? '<p class="muted">Busca solo el dato preguntado. Puedes escribir cifras o números en inglés; los datos cambian en cada situación.</p>' : step.kind === 'baseline' ? '<p class="muted">Prueba sin pistas. Si no lo sabes, está bien: lo aprenderás después. Esta comprobación no bloquea ninguna misión.</p>' : step.kind === 'retry' ? '<p class="muted">Volvemos a lo que costó más. Este reintento no cambia tu primer resultado.</p>' : '<p class="muted">Recupera la palabra o expresión practicada. No hace falta escribir la frase completa.</p>'}
    ${response ? `<div class="explain ${step.kind === 'baseline' ? '' : response.correct ? 'ok' : 'ko'}" tabindex="-1"><b>${step.kind === 'baseline' ? 'Respuesta guardada' : response.correct ? response.assisted ? 'Correcto con ayuda' : 'Correcto, sin ayuda' : `Modelo: ${esc(question.accepted[0])}`}</b><p>${step.kind === 'baseline' ? 'Verás los modelos al terminar los tres intentos iniciales.' : esc(item.explanation)}</p>${question.audio && step.kind !== 'baseline' ? `<p lang="en">${esc(question.audio)}</p><p>Dato esperado: ${esc(question.accepted[0])}</p>` : ''}</div><button class="btn" id="mission-next">Continuar</button>` : step.kind === 'choice' ? `<div class="quiz-options">${mezclar(question.options).map(value => `<button class="quiz-option" data-mission-answer="${esc(value)}">${esc(value)}</button>`).join('')}</div><button class="btn btn-nose" id="mission-skip">No lo sé</button>` : `<form id="mission-form"><label for="mission-answer">${question.audio ? 'El dato que has oído (cifras o inglés)' : 'Tu respuesta en inglés'}</label><input id="mission-answer" lang="en" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="120" required value="${esc(run.draft || '')}"><button class="btn" type="submit">${step.kind === 'baseline' ? 'Guardar respuesta' : 'Comprobar'}</button></form>
    ${step.kind !== 'baseline' && !question.audio ? `<button class="btn btn-ghost" id="mission-help">${run.help ? 'Modelo consultado · cuenta como ayuda' : 'Necesito una pista'}</button>${run.help ? `<p class="pista-box">${esc(question.accepted[0])} — ${esc(item.explanation)}</p>` : ''}` : ''}<button class="btn btn-nose" id="mission-skip">No lo sé</button>`}`}
    <p class="quiz-save-note">${sinSitio ? 'No se ha podido guardar. Mantén la app abierta y exporta una copia en Ajustes.' : 'Tu avance se guarda en este navegador. Puedes salir y continuar después.'}</p>
  </section>`;
  const next = $('#mission-next');
  if (next) next.onclick = () => { store.missionSessions[mission.id] = advanceMission(run); save(); renderMision(mission); irAlInicio(box); };
  const input = $('#mission-answer');
  if (input) input.oninput = () => { run.draft = input.value; save(); };
  const submit = (value, unknown = false) => {
    if (run.answers[run.i] || (!unknown && !value.trim())) return;
    if (question.audio && !unknown && !run.help && run.listenedTo !== question.audio) { $('#task-audio-status').textContent = 'Primero escucha el audio completo o consulta la transcripción.'; $('#task-listen').focus(); return; }
    const updated = answerMission(run, mission, value, todayStr(), unknown);
    store.missionSessions[mission.id] = updated;
    const answer = updated.answers[updated.i];
    if (step.kind !== 'baseline' && (!answer.correct || answer.assisted)) store.gameReview = scheduleMistake(store.gameReview, missionCard(mission, item), todayStr());
    save(); renderMision(mission);
  };
  if ($('#mission-form')) $('#mission-form').onsubmit = event => { event.preventDefault(); submit(input.value); };
  $$('[data-mission-answer]', box).forEach(button => button.onclick = () => submit(button.dataset.missionAnswer));
  if ($('#mission-skip')) $('#mission-skip').onclick = () => submit('', true);
  if ($('#mission-help')) $('#mission-help').onclick = () => { run.help = true; save(); renderMision(mission); };
  bindMissionAudio(question, run, () => renderMision(mission));
  (response ? $('.explain', box) : $('h3', box))?.focus({ preventScroll: true });
}

function abrirJuego(id) {
  const def = JUEGOS.find((g) => g.id === id);
  if (!def) return;
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
  activeGameId = id;
  // Se puede llegar desde fuera de Juegos (la sugerencia al acabar el repaso),
  // así que la sección tiene que estar delante o la partida se montaría dentro
  // de una vista oculta y no la verías.
  activarVista("juegos");
  $("#juegos-index").hidden = true;
  const box = $("#juego-activo");
  box.hidden = false;
  document.title = `${def.nombre} · Vocab`;
  box.innerHTML = `
    <button class="btn-back" id="back-juegos">← Juegos</button>
    <div class="view-head">
      <h2>${def.emoji} ${esc(def.nombre)}</h2>
      <p class="muted">${esc(def.desc)}</p>
    </div>
    <details class="game-purpose"><summary>Qué estás practicando</summary><p>${esc(GAME_OBJECTIVES[id])}</p></details>
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

  irAlInicio(box);
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
  if (juego.pista) {
    juego.conPista = (juego.conPista || 0) + 1;
    guardarErrorJuego();
  }
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

function abrirRepasoJuegos(gameId = null, missionId = null) {
  const cards = reviewCards(store.gameReview).filter(c => (!gameId || c.game === gameId) && (!missionId || c.mission === missionId));
  if (!cards.length) return;
  pararJuego();
  activarVista("juegos");
  $("#juegos-index").hidden = true;
  $("#juego-activo").hidden = false;
  $("#juego-activo").innerHTML = '<button class="btn-back" id="back-juegos">← Juegos</button><div class="view-head"><h2>Recuerda lo aprendido</h2><p class="muted">Escribe sin opciones. Cada objetivo pasa por tres comprobaciones en días separados y después continúa en mantenimiento.</p></div><div id="game-box"></div>';
  const previous = store.gameReviewSession;
  const due = cards.filter(c => c.due <= todayStr());
  const selection = mezclar(due.length ? due : cards).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 10);
  gameReviewRun = reviewSessionValid(previous, cards, todayStr(), gameId, missionId)
    ? previous : { date: todayStr(), gameId, missionId, items: selection.map(reviewExercise), i: 0, independent: 0, response: null, help: false };
  store.gameReviewSession = gameReviewRun; save();
  $("#back-juegos").onclick = renderJuegosIndex;
  renderRepasoJuegos();
  irAlInicio($("#juego-activo"));
}

function renderRepasoJuegos() {
  missionAudio.stop();
  const run = gameReviewRun;
  if (!run) return;
  const box = $("#game-box");
  if (run.i >= run.items.length) {
    store.gameReviewSession = null;
    const remaining = dueCards(store.gameReview, todayStr()).length;
    const plan = reviewPlan(store.gameReview, todayStr());
    box.innerHTML = `<section class="card quiz-result"><h3 tabindex="-1">Repaso terminado</h3><p>${run.independent} de ${run.items.length} respuestas sin ayuda.</p><p>${remaining ? `${remaining} objetivos pendientes para hoy.` : 'Ya no quedan objetivos pendientes para hoy.'} ${plan.next ? `Próxima fecha: ${esc(reviewDateLabel(plan.next))}.` : ''}</p><p>Los objetivos siguen programados. Ensayar antes de la fecha no adelanta las etapas.</p>${remaining ? `<button class="btn" id="review-continue">Continuar con ${Math.min(10, remaining)} pendientes</button>` : ''}<button class="btn ${remaining ? 'btn-ghost' : ''}" id="review-done">Ver mi plan de repaso</button></section>`;
    if ($('#review-continue')) $('#review-continue').onclick = () => abrirRepasoJuegos();
    $("#review-done").onclick = renderJuegosIndex;
    $("h3", box).focus();
    registerStudyDay(); save(); updateChrome();
    return;
  }
  const card = run.items[run.i];
  const modelViewed = run.modelViewed ?? (!card.audio && run.help);
  box.innerHTML = `<section class="card game-written-review">
    <p class="quiz-count">${run.i + 1} de ${run.items.length} · ${card.due <= todayStr() ? "Repaso de hoy" : "Práctica anticipada"}</p>
    <p class="muted">${reviewStage(card) === 3 ? 'Mantenimiento del recuerdo' : `Comprobación espaciada ${reviewStage(card) + 1} de 3`} · ${esc(card.due)}${card.mission ? card.audio ? ' · escucha otro anuncio' : ' · otro contexto escrito' : ''}</p>
    <h3>${esc(card.prompt)}</h3>
    ${!run.response ? missionAudioMarkup(card, run) : card.audio ? `<p lang="en">${esc(card.audio)}</p>` : ''}
    <form id="game-review-form"><label for="game-review-answer">${card.audio ? 'El dato que has oído (cifras o inglés)' : 'Tu respuesta en inglés'}</label><input id="game-review-answer" maxlength="500" autocomplete="off" autocapitalize="off" spellcheck="false" lang="en" required ${run.response ? "disabled" : ""} value="${esc(run.input || "")}">
      ${run.response ? "" : '<button class="btn" type="submit">Comprobar</button>'}</form>
    ${run.response ? `<div class="explain ${run.response.correct ? "ok" : "ko"}" tabindex="-1"><b>${run.response.correct ? run.help ? "Correcto con ayuda" : "Correcto" : "Respuesta esperada: " + esc(card.accepted[0])}</b><p>${esc(card.explanation)}</p><p>${run.help || !run.response.correct ? 'Lo reforzaremos mañana desde la primera comprobación.' : card.due <= todayStr() ? 'Próxima comprobación: ' + esc(store.gameReview[card.key].due) : 'Buen ensayo. La fecha pendiente se mantiene.'}</p></div><button class="btn" id="game-review-next">${run.i + 1 === run.items.length ? "Ver resultado" : "Siguiente"}</button>` : `<button class="btn btn-ghost" id="game-review-model">Consultar modelo (ayuda)</button><p id="game-review-model-text" ${modelViewed ? '' : 'hidden'}>${modelViewed ? esc(card.accepted[0] + ' — ' + card.explanation) : ''}</p><button class="btn btn-nose" id="game-review-skip">No lo sé</button>`}
    <p class="muted">${sinSitio ? "No se ha podido guardar. Mantén la app abierta." : "Tu repaso se guarda en este navegador."}</p>
  </section>`;
  if (run.response) {
    $(".explain", box).focus({ preventScroll: true });
    $("#game-review-next").onclick = () => { run.i++; run.response = null; run.help = false; run.modelViewed = false; run.input = ""; run.listenedTo = null; run.transcript = false; run.audioFailed = false; save(); renderRepasoJuegos(); };
    return;
  }
  const input = $("#game-review-answer");
  input.oninput = () => { run.input = input.value; save(); };
  const submit = (unknown = false) => {
    if (run.response || (!unknown && !input.value.trim())) return;
    if (card.audio && !unknown && !run.help && run.listenedTo !== card.audio) { $('#task-audio-status').textContent = 'Primero escucha el audio completo o consulta la transcripción.'; $('#task-listen').focus(); return; }
    const correct = !unknown && reviewCorrect(card, input.value);
    if (correct && !run.help) run.independent++;
    store.gameReview = answerReview(store.gameReview, card.key, correct, todayStr(), run.help);
    run.response = { correct }; run.input = input.value;
    save(); renderRepasoJuegos();
  };
  $("#game-review-form").onsubmit = event => { event.preventDefault(); submit(); };
  $("#game-review-skip").onclick = () => submit(true);
  $("#game-review-model").onclick = () => {
    run.help = true; run.modelViewed = true; save();
    $("#game-review-model-text").hidden = false;
    $("#game-review-model-text").textContent = `${card.accepted[0]} — ${card.explanation}`;
  };
  bindMissionAudio(card, run, renderRepasoJuegos);
}

function pantallaFinal(titulo, detalle, esRecord, reiniciar) {
  const falladas = (juego?.falladas || []).slice(0, 10);
  const summary = gameSummary(juego || {});
  const pending = reviewCards(store.gameReview).filter(c => c.game === activeGameId);
  const guided = recommendMission(MISSIONS.filter(m => m.games.includes(activeGameId)), store.missionSessions || {}, store.missionProgress || {}, todayStr());

  $("#game-box").innerHTML = `
    <div class="card quiz-result" aria-live="polite">
      <p class="result-emoji">${esRecord ? "🏆" : "👏"}</p>
      <p class="result-score">${esc(titulo)}</p>
      <p class="muted">${esc(detalle)}</p>
      <p class="game-learning-summary"><b>${summary.independent}/${summary.total} sin ayuda</b> · ${summary.assisted} con ayuda · ${summary.wrong} fallos · ${summary.unknown} sin saber</p>
      <p class="muted">${activeGameId === "parejas" ? "En parejas, la cifra compara emparejamientos correctos con intentos; no mide recuerdo sin ver las fichas." : "Es el resultado de esta práctica, no una certificación de dominio."}</p>
      <div class="row-actions">
        ${pending.length ? `<button class="btn" id="review-game-errors">Reforzar ${pending.length} errores guardados</button>` : ""}
        ${guided ? `<button class="btn" id="game-guided-mission">Misión relacionada: ${esc(guided.mission.title)}</button>` : ''}
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
             <p class="muted">${sinSitio ? "No se ha podido guardar. Mantén la app abierta y revisa el espacio del navegador." : "Los errores están guardados en Juegos, aunque no haya cupo para añadir palabras al repaso de vocabulario."}</p>
           </div>`
        : ""
    }`;
  $("#rejugar").onclick = reiniciar;
  if ($('#game-guided-mission')) $('#game-guided-mission').onclick = () => abrirMision(guided.mission.id);
  if ($("#review-game-errors")) $("#review-game-errors").onclick = () => abrirRepasoJuegos(activeGameId);
  $("#volver-juegos").onclick = () => renderJuegosIndex();
  updateChrome();
}

/* ---------- ⚡ Respuesta rápida ---------- */

function iniciarRapida(pool) {
  juego = { pool, items: mezclar(pool).slice(0, 10), i: 0, aciertos: 0, fallos: 0, nose: 0, pistas: 0, pista: 0, restante: 60, actual: null, bloqueado: false, timed: store.gameMode === "challenge" };
  const session = juego;
  clearInterval(gameTimer);
  if (juego.timed) gameTimer = setInterval(() => {
    if (juego !== session) return;
    if (document.hidden || juego.restante <= 0) return;
    juego.restante = Math.max(0, juego.restante - 1);
    const reloj = $("#reloj");
    if (reloj) reloj.textContent = juego.restante;
    if (juego.restante <= 0) {
      clearInterval(gameTimer);
      // Deja leer la corrección de la última respuesta antes del resultado.
      if (!juego.bloqueado) terminarRapida();
    }
  }, 1000);
  siguienteRapida();
}

function terminarRapida() {
  if (!juego) return;
  clearInterval(gameTimer);
  const pool = juego.pool;
  const esRecord = guardarRecord("rapida", limpios(juego));
  pantallaFinal(`${juego.aciertos} aciertos`, detalle(juego, esRecord), esRecord, () => iniciarRapida(pool));
  juego = null;
}

function siguienteRapida(mantenerPista = false) {
  if (!juego) return;
  if (!mantenerPista && ((!juego.timed && juego.i >= juego.items.length) || (juego.timed && juego.restante <= 0))) return terminarRapida();
  const candidatas = juego.pool.filter((x) => x.en !== juego.actual?.en);
  const w = mantenerPista ? juego.actual : juego.timed ? mezclar(candidatas.length ? candidatas : juego.pool)[0] : juego.items[juego.i];
  // Con pista puesta hay que repintar la MISMA pregunta y las MISMAS opciones:
  // volver a barajar mientras miras la pista sería tramposo y desconcertante.
  const opciones = mantenerPista ? juego.opciones : mezclar([w, ...distractores(juego.pool, w, 3)]);
  juego.actual = w;
  juego.opciones = opciones;
  juego.bloqueado = false;
  if (!mantenerPista) juego.pista = 0;

  $("#game-box").innerHTML = `
    <div class="game-hud">
      <span class="hud-time">${juego.timed ? `⏱ <b id="reloj">${juego.restante}</b>s` : `${juego.i + 1} / ${juego.items.length} · Sin reloj`}</span>
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
    </div><div id="rapid-feedback"></div>`;

  if ($("#pista")) $("#pista").onclick = () => usarPista(() => siguienteRapida(true));

  const marcarCorrecta = () =>
    $$("#op-rapida .option").forEach((x) => {
      if (x.dataset.en === juego.actual.en) x.classList.add("is-right");
    });

  const explicar = () => {
    $$("#op-rapida button").forEach(button => { button.disabled = true; });
    if ($("#pista")) $("#pista").hidden = true;
    $("#nose").hidden = true;
    marcarCorrecta();
    $("#rapid-feedback").innerHTML = `<div class="explain" tabindex="-1"><b>${esc(w.en)} — ${esc(w.es)}</b><p>${esc(w.example || "Recuerda la palabra e intenta usarla en una frase propia.")}</p><p>${esc(w.exampleEs || "")}</p></div><button class="btn" id="next-rapid">Continuar</button>`;
    $("#rapid-feedback .explain").focus({ preventScroll: true });
    $("#rapid-feedback").scrollIntoView({ block: "nearest", behavior: "instant" });
    $("#next-rapid").onclick = () => { juego.i++; siguienteRapida(); };
  };

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
      explicar();
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
    explicar();
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
      <p class="quiz-count">Elige la palabra de diccionario; después verás su forma en la frase.</p>
      <p class="quiz-q">${esc(hueco)}</p>
      <p class="muted">Sentido buscado: ${esc(w.exampleEs || w.es)}</p>
    </div>
    ${respondida ? "" : cajaPista(`La palabra significa: <em>${esc(w.es)}</em>`)}
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
             <b>${noLaSabia ? "Vamos a repasarla" : `${esc(w.en)} — ${esc(w.es)}`}</b>
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
      if (!rendida && !texto.trim()) return;
      const acertada = rendida ? null : validas.find((x) => spelling(texto) === spelling(x.en));
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
    $("#game-box [data-speak]").onclick = () => {
      if (!juego.pista) juego.pistas++;
      juego.pista = Math.max(juego.pista, 1);
    };
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
  juego = { pool, fichas, sel: null, resueltas: 0, fallos: 0, conPista: 0, bloqueado: false, inicio: Date.now(), timed: store.gameMode === "challenge" };

  clearInterval(gameTimer);
  if (juego.timed) gameTimer = setInterval(() => {
    const el = $("#reloj");
    if (el && juego) el.textContent = ((Date.now() - juego.inicio) / 1000).toFixed(1);
  }, 100);

  renderParejas();
}

function renderParejas() {
  if (!juego) return;

  $("#game-box").innerHTML = `
    <div class="game-hud">
      <span class="hud-time">${juego.timed ? '⏱ <b id="reloj">0.0</b>s' : "Sin reloj"}</span>
      <span class="hud-score">${juego.resueltas} / 6</span>
    </div>
    <div class="tiles" id="tiles">
      ${juego.fichas
        .map((f, idx) =>
          f.hecha
            ? `<div class="tile is-done">${esc(f.texto)}</div>`
            : `<button class="tile ${juego.sel === idx ? "is-sel" : ""} ${f.mal ? "is-bad" : ""}" data-ficha="${idx}" ${juego.bloqueado ? "disabled" : ""}>${esc(f.texto)}</button>`,
        )
        .join("")}
    </div><div id="pair-feedback"></div>`;

  $$("#tiles [data-ficha]").forEach((b) => {
    b.onclick = () => {
      if (!juego || juego.bloqueado) return;
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
      if (a.cara === c.cara) { juego.sel = idx; renderParejas(); return; }

      if (a.par === c.par && a.cara !== c.cara) {
        a.hecha = c.hecha = true;
        juego.sel = null;
        juego.resueltas += 1;
        if (a.revealed || c.revealed) juego.conPista++;

        if (juego.resueltas === 6) {
          clearInterval(gameTimer);
          const ms = Date.now() - juego.inicio;
          const esRecord = guardarRecord("parejas", ms, true);
          const pool = juego.pool;
          pantallaFinal(
            juego.timed ? `${(ms / 1000).toFixed(1)} segundos` : "6 parejas relacionadas",
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
        juego.bloqueado = true;
        penalizar(a.w);
        penalizar(c.w);
        juego.fichas.filter(f => f.par === a.par || f.par === c.par).forEach(f => { f.revealed = true; });
        a.mal = c.mal = true;
        renderParejas();
        $("#pair-feedback").innerHTML = `<div class="explain" tabindex="-1"><b>Estas son las relaciones correctas</b><p>${esc(a.w.en)} — ${esc(a.w.es)}</p><p>${esc(c.w.en)} — ${esc(c.w.es)}</p></div><button class="btn" id="pair-continue">Entendido, continuar</button>`;
        $("#pair-feedback .explain").focus({ preventScroll: true });
        $("#pair-feedback").scrollIntoView({ block: "nearest", behavior: "instant" });
        $("#pair-continue").onclick = () => {
          a.mal = c.mal = false;
          juego.sel = null;
          juego.bloqueado = false;
          renderParejas();
        };
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
  if (letras.length > 1) {
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

    const session = juego;
    const res = await escucharUnaVez();
    if (juego !== session) return; // un resultado antiguo no afecta a otra partida

    // El reconocedor devuelve texto, y ante dos palabras que suenan igual
    // elige una cualquiera: si dices «write» perfectamente puede escribir
    // «right». No penalizamos esa elección ortográfica del motor.
    // El texto reconocido es una señal aproximada, no una evaluación fonética.
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
    ? r.tokens.map(token => `<span class="${token.correct ? "dic-ok" : "dic-ko"}">${token.extra ? "[sobra: " : ""}${esc(token.text)}${token.extra ? "]" : ""}</span>`)
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
             <p>Modelo: <span lang="en">${esc(w.example)}</span></p>
             <p>Revisa las palabras marcadas. Los homófonos pueden sonar igual pero cambiar el significado; una omisión no invalida las palabras siguientes.</p>
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
      if (!rendida && !input.value.trim()) return;
      const assessment = assessDictation(w.example, rendida ? "" : input.value);
      const bien = !rendida && assessment.correct;
      if (bien) acertar();
      else {
        if (rendida) juego.nose += 1;
        else juego.fallos += 1;
        penalizar(w);
      }
      juego.resultado = { bien, rendida, texto: input.value, tokens: assessment.tokens, aciertos: assessment.matched, total: assessment.total };
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
    if (!r && cual !== hueco && cual !== "base" && valor === esperado) return '<span class="irr-forma">—</span><span class="irr-pron">Después de responder</span>';
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
      if (!rendida && !input.value.trim()) return;
      const validas = [esperado, ...esperado.split("/")].map((s) => norm(s));
      const bien = !rendida && validas.includes(norm(input.value));
      if (bien) acertar();
      else {
        if (rendida) juego.nose += 1;
        else juego.fallos += 1;
        juego.falladas.push({ en: `${v.base} · ${v.pasado} · ${v.participio}`, es: v.es, pron: v.pron });
        guardarErrorJuego();
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
    items: prepareQuiz(EJERCICIOS_MODALES.map(e => ({ ...e, q: e.frase, options: e.opciones, answer: e.correcta })))
      .slice(0, 10).map(e => ({ ...e, opciones: e.options, correcta: e.answer })),
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
      <p class="muted">Intención: ${esc(ej.es)}</p>
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
          guardarErrorJuego();
        }
        renderModales();
      };
    });
    $("#nose").onclick = () => {
      juego.elegida = NO_LO_SE;
      juego.nose += 1;
      juego.falladas.push({ en: ej.opciones[ej.correcta], es: ej.es, pron: "" });
      guardarErrorJuego();
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
          guardarErrorJuego();
        }
        renderFrasesJuego();
      };
    });
    $("#nose").onclick = () => {
      juego.elegida = NO_LO_SE;
      juego.nose += 1;
      juego.falladas.push({ en: f.en, es: f.es, pron: f.pron });
      guardarErrorJuego();
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
let learningLane = "grammar";
let learningQuery = "";
let learningFilter = "all";
let learningReturn = null;
const learningUnitsOpen = new Map();
const learningText = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const learningLaneLessons = () => LESSONS.filter(l => isPronunciation(l.id) === (learningLane === "pronunciation"));
const initialPracticeComplete = l => {
  const p = lessonProgress(l.id);
  return !!p.testPassedAt && (isPronunciation(l.id) || !!p.productionPassedAt);
};
const matchesLearningFilter = (l, filter) => {
  const p = lessonProgress(l.id);
  if (filter === "review") return dueReview(p, todayStr()) || !!lessonMistakes(l.id);
  if (filter === "active") return !!lessonSession(l.id) || !!lessonMistakes(l.id)
    || (!!p.last || !!p.testPassedAt || !!p.productionPassedAt) && !initialPracticeComplete(l);
  return true;
};

function nextLearningLesson() {
  const lane = learningLaneLessons();
  return lane.filter(l => lessonSession(l.id)).sort((a, b) => lessonSession(b.id).updatedAt - lessonSession(a.id).updatedAt)[0]
    || lane.filter(l => dueReview(lessonProgress(l.id), todayStr())).sort((a, b) => lessonProgress(a.id).nextReview.localeCompare(lessonProgress(b.id).nextReview))[0]
    || lane.find(l => lessonMistakes(l.id))
    || lane.find(l => !initialPracticeComplete(l));
}

function lessonSteps(lesson) {
  const p = lessonProgress(lesson.id);
  const steps = isPronunciation(lesson.id)
    ? [["Escucha", "Ejemplos con audio", false], ["Reconoce", "Comprueba lo aprendido", !!p.testPassedAt]]
    : [["Reconoce", "Comprende la regla", !!p.testPassedAt], ["Escribe", "Aplica en dos frases", !!p.productionPassedAt], ["Recuerda", "Repasos en otros días", p.retentionPasses >= 2]];
  const current = isPronunciation(lesson.id) ? -1 : steps.findIndex(([, , complete]) => !complete);
  return `<ol class="lesson-steps" aria-label="Etapas de la lección">${steps.map(([title, hint, complete], i) => `<li class="${complete ? "is-complete" : i === current ? "is-current" : ""}" ${i === current ? 'aria-current="step"' : ""}><span class="lesson-step-number" aria-hidden="true">${complete ? "✓" : i + 1}</span><span><b>${title}</b><small>${complete ? "Completado" : hint}</small></span></li>`).join("")}</ol>`;
}

function renderLearningCatalog() {
  const lane = learningLaneLessons();
  const next = nextLearningLesson();
  const query = learningText(learningQuery.trim());
  const matching = lane.filter(l => matchesLearningFilter(l, learningFilter)
    && learningText(`${l.title} ${l.goal} ${l.tag} ${PATH.find(g => g.ids.includes(l.id))?.title || ""}`).includes(query));
  const ids = new Set(matching.map(l => l.id));
  const filtering = !!query || learningFilter !== "all";
  $("#learning-route-progress").textContent = `${lane.filter(initialPracticeComplete).length} de ${lane.length} con práctica inicial completa`;
  $$("[data-learning-filter]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.learningFilter === learningFilter));
    $("span", button).textContent = lane.filter(l => matchesLearningFilter(l, button.dataset.learningFilter)).length;
  });
  $("#learning-results").textContent = filtering
    ? `${matching.length} ${matching.length === 1 ? "lección encontrada" : "lecciones encontradas"}${learningQuery.trim() ? ` para «${learningQuery.trim()}»` : ""}`
    : "Elige una unidad. Puedes explorar a tu ritmo.";
  const card = l => {
    const p = lessonProgress(l.id);
    const session = lessonSession(l.id);
    const pending = lessonMistakes(l.id);
    const status = session ? `En curso · ejercicio ${session.i + 1}/${session.items.length}` : isPronunciation(l.id) && p.testPassedAt ? "Reconocimiento superado" : learningState(p, todayStr());
    return `<button class="lesson-card${l.id === next?.id ? " is-next" : ""}" data-lesson="${l.id}" aria-label="${esc(l.title)}. ${esc(l.goal)}. ${esc(status)}">
      <span class="lesson-card-top"><span class="lesson-position">${String(lane.indexOf(l) + 1).padStart(2, "0")}</span><span class="lesson-tag">${l.id === next?.id ? "Siguiente paso" : esc(l.tag)}</span></span>
      <span class="lesson-title">${esc(l.title)}</span><span class="lesson-goal">${esc(l.goal)}</span>
      ${pending ? `<span class="lesson-pending">${pending.items.length} para reforzar</span>` : ""}
      <span class="lesson-meta"><span class="lesson-state${p.retentionPasses >= 2 ? " is-done" : ""}">${esc(status)}</span><span class="lesson-open" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 7l5 5-5 5"/></svg></span></span>
    </button>`;
  };
  $("#lecciones-lista").innerHTML = matching.length ? PATH.filter(g => g.pronunciation === (learningLane === "pronunciation")).map((g, i) => {
    const lessons = g.ids.map(getLesson).filter(l => l && ids.has(l.id));
    if (!lessons.length) return "";
    const unitKey = `${learningLane}-${i}`;
    const complete = g.ids.map(getLesson).filter(initialPracticeComplete).length;
    const open = filtering || (learningUnitsOpen.get(unitKey) ?? (g.ids.includes(next?.id) || !next && i === 0));
    return `<details class="learning-unit" data-learning-unit="${unitKey}" ${open ? "open" : ""}>
      <summary><span class="learning-unit-number" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span><span class="learning-unit-title"><b>${esc(g.title)}</b><small>${complete}/${g.ids.length} practicadas${filtering ? ` · ${lessons.length} visibles` : ""}</small><progress max="${g.ids.length}" value="${complete}" aria-label="Práctica inicial de ${esc(g.title)}"></progress></span><svg class="learning-unit-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></summary>
      <div class="lesson-grid">${lessons.map(card).join("")}</div></details>`;
  }).join("") : `<div class="learning-empty"><h4>${query ? "No encontramos esa lección" : learningFilter === "review" ? "Sin repasos pendientes" : "Todavía no hay lecciones en curso"}</h4><p>${query ? "Prueba con otra palabra o vuelve a ver toda la ruta." : learningFilter === "review" ? "Aquí aparecerán tus repasos programados y los ejercicios que necesites reforzar." : "Empieza por la recomendación o explora una unidad. Tu práctica se guardará para continuar después."}</p><button class="btn btn-ghost" id="learning-clear">Ver todas las lecciones</button></div>`;
  $$("[data-learning-unit]").forEach(unit => {
    const initialOpen = unit.open;
    unit.ontoggle = () => { if (!filtering && (learningUnitsOpen.has(unit.dataset.learningUnit) || unit.open !== initialOpen)) learningUnitsOpen.set(unit.dataset.learningUnit, unit.open); };
  });
  if ($("#learning-clear")) $("#learning-clear").onclick = () => {
    learningQuery = "";
    learningFilter = "all";
    $("#learning-search").value = "";
    renderLearningCatalog();
    $("#learning-search").focus({ preventScroll: true });
  };
}

function lessonProgress(id) {
  return store.lessons[id] || { best: 0, done: false, last: null };
}

function validQuizItems(items) {
  return Array.isArray(items) && items.length > 0 && items.length <= 200 && items.every(item =>
    item && typeof item.q === "string" && item.q.trim() && (item.type === "write"
      ? Array.isArray(item.accepted) && item.accepted.length > 0 && item.accepted.every(a => typeof a === "string" && a.trim())
      : Array.isArray(item.options)
    && item.options.length >= 2 && item.options.every(option => typeof option === "string" && option.trim())
    && Number.isInteger(item.answer) && item.answer >= 0 && item.answer < item.options.length)
    && (item.why == null || typeof item.why === "string"));
}

// Los contadores se reconstruyen desde las respuestas, nunca desde una nota guardada.
function lessonSession(id) {
  const draft = store.lessonSessions?.[id];
  if (!draft || ![1, 2].includes(draft.version) || !validQuizItems(draft.items)
    || !Number.isInteger(draft.i) || draft.i < 0 || draft.i >= draft.items.length
    || !Array.isArray(draft.answers) || ![draft.i, draft.i + 1].includes(draft.answers.length)
    || typeof draft.ia !== "boolean" || typeof draft.review !== "boolean" || !Number.isFinite(draft.updatedAt)
    || !draft.answers.every((answer, index) => answer === NO_LO_SE
      || (draft.items[index].type === "write" ? typeof answer === "string" && answer.length <= 500
        : Number.isInteger(answer) && answer >= 0 && answer < draft.items[index].options.length))) return null;
  if (draft.version === 2 && !["test", "production", "retention", "errors", "ai"].includes(draft.mode)) return null;
  return draft;
}

function lessonMistakes(id) {
  const mistakes = store.lessonMistakes?.[id];
  return mistakes && typeof mistakes.ia === "boolean" && validQuizItems(mistakes.items) ? mistakes : null;
}

function quizItemKey(item) {
  return item.type === "write" ? item.id || item.q : JSON.stringify([item.q, [...item.options].sort()]);
}

function saveLessonSession() {
  if (!store.lessonSessions || typeof store.lessonSessions !== "object" || Array.isArray(store.lessonSessions)) store.lessonSessions = {};
  store.lessonSessions[quiz.lesson.id] = {
    version: 2, items: quiz.items, answers: [...quiz.answers], i: quiz.i,
    ia: quiz.ia, review: quiz.review, mode: quiz.mode, eligible: quiz.eligible,
    input: quiz.input || "", updatedAt: Date.now(),
  };
  save();
}

async function renderLeccionesIndex({ restore = false } = {}) {
  await cargarLecciones();
  quiz = null;
  $("#leccion-detalle").hidden = true;
  $("#lectura-detalle").hidden = true;
  $("#lecciones-index").hidden = false;
  document.title = "Aprender · Vocab";
  if (!restore) { learningReturn = null; irAlInicio($("#lecciones-index")); }

  const grammar = LESSONS.filter(l => !isPronunciation(l.id));
  const hechas = grammar.filter(l => lessonProgress(l.id).retentionPasses >= 2).length;
  const textosLeidos = TEXTOS.filter((texto) => store.lecturas?.[texto.id]).length;
  $("#lecciones-sub").textContent = hechas || textosLeidos
    ? `${hechas} consolidadas en la práctica · ${textosLeidos} lecturas terminadas`
    : "Comprende, aplica y vuelve a recordar. Sin prisa.";
  $("#count-gramatica").textContent = `${grammar.length} lecciones`;
  $("#count-frases").textContent = `${FRASES.length} expresiones`;
  $("#count-lecturas").textContent = `${TEXTOS.length} textos`;
  renderLecturasIndex();

  const siguiente = nextLearningLesson();
  const draft = siguiente && lessonSession(siguiente.id);
  const mistakes = siguiente && lessonMistakes(siguiente.id);
  const progress = siguiente && lessonProgress(siguiente.id);
  const due = siguiente && dueReview(progress, todayStr());
  const needsWriting = siguiente && !isPronunciation(siguiente.id) && progress.testPassedAt && !progress.productionPassedAt;
  const action = draft ? "resume-quiz" : due ? "start-retention" : mistakes ? "saved-mistakes" : needsWriting ? "start-production" : "";
  $("#learning-next").innerHTML = siguiente ? `
    <section class="learning-next-card" aria-label="Tu siguiente paso">
      <div class="learning-next-top"><span class="eyebrow">${draft ? "Donde lo dejaste" : due ? "Hoy toca recordar" : mistakes ? "Refuerza lo aprendido" : needsWriting ? "Ahora, con tus palabras" : "Tu siguiente paso"}</span><span class="learning-next-unit">${esc(PATH.find(g => g.ids.includes(siguiente.id)).title.replace(" · ruta independiente", ""))}</span></div>
      <h3>${esc(siguiente.title)}</h3>
      <p>${draft ? `Ejercicio ${draft.i + 1} de ${draft.items.length}. ${sinSitio ? "No se ha podido guardar el avance. Mantén la app abierta." : "Continúa exactamente donde lo dejaste."}` : due ? "Comprueba qué recuerdas con dos enunciados distintos. Inténtalo sin consultar la teoría." : mistakes ? `${mistakes.items.length} ${mistakes.items.length === 1 ? "ejercicio" : "ejercicios"} para reforzar, con explicación y un nuevo intento.` : needsWriting ? "Ya superaste el test. Ahora aplica la regla en dos frases sin opciones." : esc(siguiente.goal)}</p>
      <button class="btn" data-lesson="${siguiente.id}" data-learning-action="${action}">${draft ? "Continuar práctica" : due ? "Hacer el repaso de hoy" : mistakes ? "Reforzar mis errores" : needsWriting ? "Aplicar por escrito" : "Empezar lección"}<span aria-hidden="true">→</span></button>
      <span class="learning-next-note">${draft ? "Tu práctica continúa desde la última respuesta" : due ? "2 ejercicios · repaso espaciado" : needsWriting ? "2 ejercicios · respuesta escrita" : mistakes ? "Practica a tu ritmo, sin reloj" : isPronunciation(siguiente.id) ? "Escucha los ejemplos y practica en voz alta" : "Comprende la regla, practica y vuelve a recordar"}</span>
    </section>` : `<section class="learning-next-card"><span class="eyebrow">Buen trabajo</span><h3>Al día con esta ruta</h3><p>Los repasos aparecerán cuando toque. Sigue aplicando lo aprendido en un texto.</p><button class="btn" id="learning-read-next">Practicar con una lectura <span aria-hidden="true">→</span></button></section>`;
  if ($("#learning-read-next")) $("#learning-read-next").onclick = () => { cambiarModoAprender("lecturas"); $("#modo-lecturas").focus(); };
  $("#learning-lane").value = learningLane;
  $("#learning-lane").onchange = event => {
    learningLane = event.target.value;
    learningQuery = "";
    learningFilter = "all";
    renderLeccionesIndex();
  };
  $("#learning-search").value = learningQuery;
  $("#learning-search").onfocus = () => {
    if (window.matchMedia("(max-width: 719px)").matches) $(".learning-catalog").scrollIntoView({ block: "start", behavior: "instant" });
  };
  $("#learning-search").oninput = event => { learningQuery = event.target.value; renderLearningCatalog(); };
  $$("[data-learning-filter]").forEach(button => { button.onclick = () => { learningFilter = button.dataset.learningFilter; renderLearningCatalog(); }; });
  renderLearningCatalog();
  if (restore && learningReturn) {
    const previous = learningReturn;
    learningReturn = null;
    requestAnimationFrame(() => {
      const card = $(`[data-lesson="${previous.id}"]`, $("#lecciones-lista"));
      if (card?.checkVisibility()) card.focus({ preventScroll: true });
      window.scrollTo({ top: previous.scroll, behavior: "instant" });
    });
  }
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

async function openLeccion(id, action = "") {
  await cargarLecciones();
  const lesson = getLesson(id);
  if (!lesson) return;

  if (!$("#lecciones-index").hidden) learningReturn = { id, scroll: window.scrollY };

  const p = lessonProgress(id);
  const draft = lessonSession(id);
  const mistakes = lessonMistakes(id);
  const pronunciation = isPronunciation(id);
  const prerequisite = prerequisites(id).map(getLesson).filter(Boolean);
  const due = dueReview(p, todayStr());
  const needsWriting = !pronunciation && p.testPassedAt && !p.productionPassedAt;
  const primary = draft ? "resume" : due ? "retention" : mistakes ? "mistakes" : needsWriting ? "production" : "test";
  const example = lesson.blocks.filter(b => b.t === "examples").flatMap(b => b.items)[0];
  $("#lecciones-index").hidden = true;
  const box = $("#leccion-detalle");
  box.hidden = false;
  box.dataset.lessonId = id;
  quiz = null;
  document.title = `${lesson.title} · Vocab`;

  box.innerHTML = `
    <div class="lesson-toolbar">
      <button class="btn-back" id="back-lecciones">← Aprender</button>
      <button class="lesson-theory-toggle" id="lesson-theory-toggle" aria-expanded="false" aria-controls="lesson-theory" hidden>Consultar teoría</button>
    </div>
    <div class="view-head">
      <span class="lesson-tag">${esc(lesson.tag)}</span>
      <h2>${esc(lesson.title)}</h2>
      <p class="muted">${esc(lesson.goal)}</p>
    </div>
    <div class="lesson-overview" id="lesson-overview">
      ${draft ? `<div class="lesson-resume">
        <span class="eyebrow">${draft.review ? "Repaso guardado" : "Práctica guardada"}</span>
        <h3>Continúa en el ejercicio ${draft.i + 1} de ${draft.items.length}</h3>
        <p>${draft.answers.length > draft.i ? "Tu última respuesta está guardada. Verás la explicación antes de seguir." : "Puedes seguir desde aquí, aunque hayas cerrado la app."}</p>
        <button class="btn" id="resume-quiz">Continuar práctica</button>
      </div>` : ""}
      <p class="lesson-learning-state"><b>${esc(pronunciation && p.testPassedAt ? "Prueba de reconocimiento superada" : learningState(p, todayStr()))}</b></p>
      ${lessonSteps(lesson)}
      ${!draft ? `<div class="lesson-next-guidance"><h3>${due ? "Es momento de recordar" : mistakes ? "Da otra vuelta a lo que costó" : needsWriting ? "Ya lo reconoces. Ahora escríbelo." : pronunciation ? "Escucha, imita y reconoce" : "Comprende la regla y ponla a prueba"}</h3><p>${due ? "Dos enunciados nuevos para comprobar qué recuerdas. Inténtalo sin consultar la teoría." : mistakes ? "Revisa la explicación y vuelve a intentarlo. Cada error te muestra qué practicar." : needsWriting ? "Aplica la regla en dos frases sin opciones. Después programaremos tu repaso." : pronunciation ? "Escucha los ejemplos y repítelos en voz alta antes de hacer la prueba." : `${lesson.quiz.length} preguntas con explicación. Puedes leer los ejemplos antes de empezar.`}</p></div>` : ""}
      <div class="lesson-practice-actions">
        ${due ? `<button class="btn ${primary === "retention" ? "" : "btn-ghost"}" id="start-retention">Hacer el repaso de hoy</button>` : ""}
        ${mistakes ? `<button class="btn ${primary === "mistakes" ? "" : "btn-ghost"}" id="saved-mistakes">Reforzar ${mistakes.items.length} ${mistakes.items.length === 1 ? "ejercicio" : "ejercicios"}</button>` : ""}
        ${needsWriting ? '<button class="btn ' + (primary === "production" ? '' : 'btn-ghost') + '" id="start-production">Aplicar por escrito · 2 ejercicios</button>' : ""}
        <button class="btn ${primary === "test" ? "" : "btn-ghost"}" id="start-quiz">${draft ? "Empezar de nuevo" : p.testPassedAt ? "Repetir prueba de reconocimiento" : "Empezar práctica"}</button>
        <button class="btn btn-ghost" id="read-lesson-theory">${pronunciation ? "Escuchar los ejemplos" : "Leer explicación y ejemplos"}</button>
        ${!pronunciation && !needsWriting ? '<button class="btn btn-ghost lesson-secondary-action" id="start-production">Aplicar por escrito · 2 ejercicios</button>' : ""}
      </div>
      ${!pronunciation && p.nextReview && !due ? `<p class="lesson-review-date">Próximo repaso: <b>${esc(reviewDateLabel(p.nextReview))}</b></p>` : ""}
      ${p.done && !p.testPassedAt ? '<p class="muted">Tu nota anterior se conserva. Completa una prueba actual y la práctica escrita para avanzar en esta ruta.</p>' : ""}
      ${draft && (draft.version === 1 || draft.eligible === false) ? '<p class="muted">Esta práctica cuenta como entrenamiento, no como evaluación de retención. Tu historial se conserva.</p>' : ""}
      ${store.lessonSessions?.[id] && !draft ? '<p class="muted">No se puede retomar esta práctica guardada. Puedes empezar otra; tu mejor nota se conserva.</p>' : ""}
      <details class="lesson-method"><summary>Cómo avanzar en esta lección</summary>
        <p>${pronunciation ? "El test comprueba el reconocimiento; no evalúa tu pronunciación hablada. Sigue escuchando e imitando los ejemplos." : "Supera el test con un 80% y resuelve los dos ejercicios escritos. Después vuelve a recordar con otros enunciados: primero a los 2 días y después a los 7. Dos repasos diferidos correctos consolidan la lección en la práctica."}</p>
        ${p.best ? `<p>Mejor prueba de reconocimiento: <b>${p.best}%</b>.</p>` : ""}
        ${!pronunciation ? '<p>Repetir hoy te ayuda a practicar. Para comprobar retención, espera al repaso programado e inténtalo sin consultar la teoría. La ruta no certifica un nivel.</p>' : ""}
        ${prerequisite.length ? `<p class="lesson-prerequisites">Antes te puede ayudar: ${prerequisite.map(l => `<button class="btn-back" data-lesson="${l.id}">${esc(l.title)}</button>`).join(" ")}</p>` : ""}
      </details>
    </div>
    <div id="lesson-theory">
      <article class="lesson-body">${lesson.blocks.map(blockHtml).join("")}</article>
      ${!pronunciation ? `<section class="lesson-transfer card" aria-labelledby="transfer-title">
        <h3 id="transfer-title">Llévalo a tu vida</h3>
        <p>Escribe una frase sobre ti usando esta regla. Esta parte es de autoevaluación: no recibe una nota automática.</p>
        <label for="lesson-note">Tu frase en inglés</label>
        <textarea id="lesson-note" maxlength="1000" rows="3" lang="en" placeholder="Escribe tu propio ejemplo…">${esc(typeof store.lessonNotes?.[id] === "string" ? store.lessonNotes[id] : "")}</textarea>
        <p id="note-status" class="muted" role="status"></p>
        <details><summary>Revisar mi frase</summary><p>¿Expresa lo que querías decir? ¿Has usado la estructura de la lección? Revisa sujeto, verbo y complementos. Si no estás seguro, contrástala con un profesor: comparar un modelo no valida todas las frases posibles.</p>${example ? `<p lang="en">Modelo: ${esc(example.en)}</p><p>${esc(example.es)}</p>` : ""}</details>
        ${example ? `<details id="order-practice"><summary>Construir un ejemplo con palabras</summary><p>Ordena las palabras y compara con el modelo. Práctica guiada, sin nota.</p><p>${esc(example.es)}</p><div id="order-words" class="order-words"></div><output id="order-output" aria-live="polite"></output><button class="btn btn-ghost" id="order-reset">Volver a ordenar</button><details><summary>Ver modelo</summary><p lang="en">${esc(example.en)}</p></details></details>` : ""}
      </section>` : ""}
      <div class="row-actions lesson-extra-actions"><button class="btn" id="start-quiz-bottom">Practicar lo aprendido</button><button class="btn btn-ghost" id="ai-quiz">Ejercicios nuevos con IA</button></div>
    </div>
    <div id="quiz-box"></div>`;

  $("#back-lecciones").onclick = () => {
    quiz = null;
    renderLeccionesIndex({ restore: true });
  };
  $("#start-quiz").onclick = () => startQuiz(lesson, lesson.quiz);
  $("#read-lesson-theory").onclick = () => {
    const theory = $("#lesson-theory");
    theory.setAttribute("tabindex", "-1");
    theory.focus({ preventScroll: true });
    theory.scrollIntoView({ block: "start", behavior: "instant" });
  };
  if ($("#resume-quiz")) $("#resume-quiz").onclick = () => startQuiz(lesson, draft.items, { ia: draft.ia, review: draft.review, mode: draft.mode, resume: draft });
  if ($("#start-production")) $("#start-production").onclick = () => startQuiz(lesson, productionItems(lesson), { mode: "production" });
  if ($("#start-retention")) $("#start-retention").onclick = () => startQuiz(lesson, productionItems(lesson, (p.retentionPasses || 0) % 2 + 1), { mode: "retention" });
  if ($("#lesson-note")) $("#lesson-note").oninput = event => {
    if (!store.lessonNotes || typeof store.lessonNotes !== "object" || Array.isArray(store.lessonNotes)) store.lessonNotes = {};
    store.lessonNotes[id] = event.target.value;
    save();
    $("#note-status").textContent = sinSitio ? "No se ha podido guardar. Copia tu frase antes de salir." : "Frase guardada en este navegador.";
  };
  if ($("#order-words")) {
    const resetOrder = () => {
      $("#order-output").textContent = "";
      $("#order-words").innerHTML = shuffled(example.en.split(/\s+/)).map(word => `<button class="btn btn-ghost" type="button" lang="en">${esc(word)}</button>`).join("");
      $$("#order-words button").forEach(button => { button.onclick = () => {
        $("#order-output").textContent += `${$("#order-output").textContent ? " " : ""}${button.textContent}`;
        button.disabled = true;
      }; });
    };
    resetOrder();
    $("#order-reset").onclick = resetOrder;
  }
  if ($("#saved-mistakes")) $("#saved-mistakes").onclick = () => startQuiz(lesson, mistakes.items, { ia: mistakes.ia, review: true });
  $("#start-quiz-bottom").onclick = () => startQuiz(lesson, lesson.quiz);
  $("#ai-quiz").onclick = () => aiQuiz(lesson);
  $("#lesson-theory-toggle").onclick = () => {
    const theory = $("#lesson-theory");
    theory.hidden = !theory.hidden;
    if (!theory.hidden && quiz.mode === "retention" && quiz.i < quiz.items.length) {
      quiz.eligible = false;
      saveLessonSession();
      toast("Consultar la teoría convierte este repaso en entrenamiento. Podrás volver a intentarlo.");
    }
    $("#quiz-box").hidden = !theory.hidden;
    $("#lesson-theory-toggle").setAttribute("aria-expanded", String(!theory.hidden));
    $("#lesson-theory-toggle").textContent = theory.hidden ? "Consultar teoría" : quiz.i >= quiz.items.length ? "Volver al resultado" : "Volver al ejercicio";
    if (theory.hidden) focusLessonQuiz();
    else theory.scrollIntoView({ block: "start", behavior: "instant" });
  };

  irAlInicio(box);
  if (["resume-quiz", "start-retention", "saved-mistakes", "start-production"].includes(action)) $(`#${action}`, box)?.click();
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
    const detail = $("#leccion-detalle");
    if (!detail.hidden && detail.closest(".view.is-active") && detail.dataset.lessonId === lesson.id) startQuiz(lesson, utiles, { ia: true });
  } catch (err) {
    // Los mensajes propios están en español y explican qué pasó; los del
    // navegador («Failed to fetch») no le dicen nada a nadie.
    const nuestro = /ejercicio|peticion|petición|límite|limite|clave|rechaz/i.test(err.message);
    toast(nuestro ? err.message : "No se pudieron generar los ejercicios. Inténtalo otra vez.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Ejercicios nuevos con IA";
  }
}

function startQuiz(lesson, items, { ia = false, review = false, resume = null, mode = "test" } = {}) {
  if (!items.length) return;
  if (!resume && lessonSession(lesson.id) && !confirm("Tienes una práctica guardada de esta lección. ¿Sustituirla por una nueva? Tu mejor nota se conserva.")) return;
  const answers = resume ? [...resume.answers] : [];
  const i = resume?.i || 0;
  if (!resume) items = prepareQuiz(items);
  mode = review ? "errors" : ia ? "ai" : mode;
  quiz = {
    lesson, items, i, answers, ia, review, mode, elegida: answers[i] ?? null,
    input: typeof resume?.input === "string" ? resume.input.slice(0, 500) : "",
    eligible: resume ? resume.version === 2 && resume.eligible === true
      : mode !== "retention" || dueReview(lessonProgress(lesson.id), todayStr()),
    aciertos: answers.filter((answer, index) => isCorrect(items[index], answer)).length,
    nose: answers.filter(answer => answer === NO_LO_SE).length,
    missed: items.filter((item, index) => index < answers.length && !isCorrect(item, answers[index])),
  };
  $("#lesson-overview").hidden = true;
  $("#lesson-theory").hidden = true;
  $("#quiz-box").hidden = false;
  $(".lesson-extra-actions").hidden = true;
  $("#lesson-theory-toggle").hidden = false;
  $("#lesson-theory-toggle").setAttribute("aria-expanded", "false");
  $("#lesson-theory-toggle").textContent = "Consultar teoría";
  renderQuiz();
}

function focusLessonQuiz() {
  requestAnimationFrame(() => {
    const box = $("#quiz-box");
    if (!box || box.hidden || $("#leccion-detalle").hidden || !box.closest(".view.is-active")) return;
    // Un callback pendiente no debe quitar el foco si ya has empezado a escribir.
    if (box.contains(document.activeElement) && document.activeElement.matches("input, textarea, select")) return;
    const target = $(".explain, .quiz-q, .lesson-result-title", box);
    target?.focus({ preventScroll: true });
    (target?.matches(".explain") ? target : box).scrollIntoView({ block: "start", behavior: "instant" });
  });
}

function renderQuiz() {
  const box = $("#quiz-box");
  if (!quiz) return (box.innerHTML = "");

  const { items, i, elegida } = quiz;

  // Final
  if (i >= items.length) {
    const pct = Math.round((quiz.aciertos / items.length) * 100);
    const prev = lessonProgress(quiz.lesson.id);
    if (!quiz.recorded) store.lessons[quiz.lesson.id] = recordLearning(prev, {
      mode: quiz.mode, percent: pct, day: todayStr(), eligible: quiz.eligible,
      pronunciation: isPronunciation(quiz.lesson.id),
    });
    quiz.recorded = true;
    if (store.lessonSessions) delete store.lessonSessions[quiz.lesson.id];
    if (!store.lessonMistakes || typeof store.lessonMistakes !== "object" || Array.isArray(store.lessonMistakes)) store.lessonMistakes = {};
    const attempted = new Set(items.map(quizItemKey));
    const untouched = (lessonMistakes(quiz.lesson.id)?.items || []).filter(item => !attempted.has(quizItemKey(item)));
    const pending = [...untouched, ...quiz.missed];
    if (pending.length) store.lessonMistakes[quiz.lesson.id] = { items: pending, ia: quiz.ia };
    else delete store.lessonMistakes[quiz.lesson.id];
    registerStudyDay();
    save();

    const current = lessonProgress(quiz.lesson.id);
    const nextLesson = LESSONS.find(l => l.id !== quiz.lesson.id && isPronunciation(l.id) === isPronunciation(quiz.lesson.id) && !lessonProgress(l.id).testPassedAt);
    const needsProduction = !isPronunciation(quiz.lesson.id) && current.testPassedAt && !current.productionPassedAt;
    const canContinue = !quiz.review && pct >= 80 && !needsProduction && nextLesson;

    box.innerHTML = `
      <div class="card quiz-result" aria-live="polite">
        <h3 class="lesson-result-title" tabindex="-1">${quiz.review ? "Repaso de errores terminado" : quiz.ia || !quiz.eligible ? "Entrenamiento terminado" : quiz.mode === "test" ? pct >= 80 ? "Prueba superada" : "Vamos a reforzar lo aprendido" : pct === 100 ? "Práctica escrita completada" : "Practiquemos esta estructura"}</h3>
        <p class="result-score">${quiz.aciertos} de ${items.length} · ${pct}%</p>
        <p class="muted">${quiz.review || quiz.ia || !quiz.eligible ? "Este entrenamiento no acredita dominio ni cambia tu mejor test. Completa la ruta actual para avanzar." : quiz.missed.length ? "Revisa la explicación y vuelve a aplicar la regla. Los errores indican qué conviene practicar." : "Buen trabajo. Comprueba el siguiente paso de tu ruta."}${
          quiz.nose ? ` · ${quiz.nose} ${quiz.nose === 1 ? "no la sabías" : "no las sabías"}` : ""
        }</p>
        <p><b>${esc(isPronunciation(quiz.lesson.id) && current.testPassedAt ? "Reconocimiento superado; practica también en voz alta" : learningState(current, todayStr()))}</b>${current.nextReview ? ` · Próximo repaso: ${esc(current.nextReview)}` : ""}</p>
        <div class="row-actions">
          ${quiz.missed.length ? `<button class="btn" id="review-mistakes">Repasar ${quiz.missed.length} ${quiz.missed.length === 1 ? "ejercicio" : "ejercicios"}</button>` : ""}
          ${canContinue ? `<button class="btn ${quiz.missed.length ? "btn-ghost" : ""}" id="next-lesson">Siguiente lección</button>` : ""}
          ${needsProduction ? '<button class="btn" id="result-production">Ahora aplícalo por escrito</button>' : ""}
          ${["production", "retention"].includes(quiz.mode) && quiz.missed.length ? '<button class="btn btn-ghost" id="retry-written">Repetir práctica escrita completa</button>' : ""}
          <button class="btn ${quiz.missed.length || canContinue ? "btn-ghost" : ""}" id="retry-quiz">Prueba completa</button>
          <button class="btn btn-ghost" id="finish-lesson">Volver a Aprender</button>
        </div>
      </div>`;

    $("#retry-quiz").onclick = () => startQuiz(quiz.lesson, quiz.lesson.quiz);
    if ($("#result-production")) $("#result-production").onclick = () => startQuiz(quiz.lesson, productionItems(quiz.lesson), { mode: "production" });
    if ($("#retry-written")) $("#retry-written").onclick = () => startQuiz(quiz.lesson, quiz.items, { mode: quiz.mode });
    if ($("#review-mistakes")) $("#review-mistakes").onclick = () => startQuiz(quiz.lesson, quiz.missed, { ia: quiz.ia, review: true });
    if ($("#next-lesson")) $("#next-lesson").onclick = () => openLeccion(nextLesson.id);
    $("#finish-lesson").onclick = () => { quiz = null; renderLeccionesIndex(); };
    updateChrome();
    focusLessonQuiz();
    return;
  }

  saveLessonSession();
  const item = items[i];
  const respondida = elegida !== null;
  const acertada = respondida && isCorrect(item, elegida);
  const noLaSabia = elegida === NO_LO_SE;
  const porcentaje = Math.round((i / items.length) * 100);
  const pendientes = Math.max(items.length - i - 1, 0);

  box.innerHTML = `
    <div class="card quiz-ex">
      <div class="quiz-progress-wrap">
        <div class="quiz-progress-meta">
          <span>Ejercicio <b>${i + 1}</b> de ${items.length}</span>
          <span>${quiz.review ? "Repaso de errores" : quiz.ia ? "Generado ahora" : quiz.mode === "production" ? "Aplicar por escrito" : quiz.mode === "retention" ? "Recordar sin opciones" : pendientes ? `${pendientes} ${pendientes === 1 ? "pendiente" : "pendientes"}` : "Último"}</span>
        </div>
        <div class="quiz-progress" role="progressbar" aria-label="Progreso de los ejercicios" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${porcentaje}">
          <span style="width:${porcentaje}%"></span>
        </div>
      </div>
      <p class="quiz-save-note">${sinSitio ? "No se ha podido guardar. Revisa el espacio del navegador." : "Avance guardado en este navegador"}</p>
      <h3 class="quiz-q" tabindex="-1">${esc(item.q)}</h3>
      ${item.type === "write" ? `<form id="written-form" class="written-answer">
        <label for="written-response">Escribe lo que falta en el hueco</label>
        <p class="muted" id="written-hint">${item.strict ? "Usa la contracción pedida." : "Se aceptan mayúsculas, puntuación final y contracciones equivalentes. No se corrigen automáticamente palabras con significado distinto."}</p>
        <input id="written-response" lang="en" type="text" maxlength="500" required autocomplete="off" autocapitalize="off" spellcheck="false" aria-describedby="written-hint" value="${esc(respondida ? noLaSabia ? "" : elegida : quiz.input)}" ${respondida ? "disabled" : ""}>
        ${respondida ? "" : '<button class="btn" type="submit">Comprobar respuesta</button>'}</form>` : `<div class="options">
        ${item.options
          .map((opt, idx) => {
            let cls = "option";
            if (respondida && idx === item.answer) cls += " is-right";
            else if (respondida && idx === elegida) cls += " is-wrong";
            return `<button class="${cls}" data-opt="${idx}" ${respondida ? "disabled" : ""}><span class="option-key" aria-hidden="true">${idx + 1}</span><span>${esc(opt)}</span></button>`;
          })
          .join("")}
      </div>`}
      ${respondida ? "" : `<button class="btn btn-nose" id="nose"><span class="nose-icon" aria-hidden="true">?</span>No lo sé</button>`}
      ${
        respondida
          ? `<div class="explain ${acertada ? "ok" : noLaSabia ? "nose" : "ko"}" tabindex="-1" aria-live="polite">
               <b class="feedback-title"><span class="feedback-icon" aria-hidden="true">${acertada ? "✓" : noLaSabia ? "?" : "!"}</span>${acertada ? "Correcto" : noLaSabia ? `La respuesta es: ${esc(correctAnswer(item))}` : "No exactamente"}</b>
               <p>${esc(item.why || "")}</p>
               ${!acertada && !noLaSabia ? `<p><b>Respuesta esperada:</b> ${esc(correctAnswer(item))}</p>` : ""}
             </div>
             <button class="btn" id="next-q">${i + 1 === items.length ? "Ver resultado" : "Siguiente"}</button>`
          : ""
      }
    </div>`;

  if (!respondida) {
    if ($("#written-form")) {
      $("#written-response").oninput = event => { quiz.input = event.target.value; saveLessonSession(); };
      $("#written-form").onsubmit = event => {
        event.preventDefault();
        const response = $("#written-response").value.trim();
        if (!response || quiz.elegida !== null) return;
        quiz.elegida = response;
        quiz.answers[quiz.i] = response;
        if (isCorrect(item, response)) quiz.aciertos++;
        else quiz.missed.push(item);
        renderQuiz();
      };
    }
    $$("[data-opt]", box).forEach((b) => {
      b.onclick = () => {
        quiz.elegida = Number(b.dataset.opt);
        quiz.answers[quiz.i] = quiz.elegida;
        if (quiz.elegida === item.answer) quiz.aciertos += 1;
        else quiz.missed.push(item);
        renderQuiz();
      };
    });
    $("#nose").onclick = () => {
      quiz.elegida = NO_LO_SE;
      quiz.answers[quiz.i] = NO_LO_SE;
      quiz.nose += 1;
      quiz.missed.push(item);
      renderQuiz();
    };
  } else {
    $("#next-q").onclick = () => {
      quiz.i += 1;
      quiz.elegida = null;
      quiz.input = "";
      renderQuiz();
    };
  }
  focusLessonQuiz();
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
    $(sel).tabIndex = modo === id ? 0 : -1;
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
  const estado = leida ? "Leída" : "Pendiente";
  return `<button class="reading-card" data-lectura="${l.id}" aria-label="${esc(l.titulo)}. ${esc(l.resumen)}. ${estado}">
    <span class="lesson-tag">${esc(NIVEL_NOMBRE[l.nivel] || l.nivel)}</span>
    <span class="lesson-title">${esc(l.titulo)}</span>
    <span class="lesson-goal">${esc(l.resumen)}</span>
    <span class="lesson-meta">
      <span class="lesson-state${leida ? " is-done" : ""}">${estado} · ${frases} frases</span>
      <span class="lesson-open">Leer <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 7l5 5-5 5"/></svg></span>
    </span>
  </button>`;
}

function renderLecturasIndex() {
  $("#lecturas-lista").innerHTML = GRUPOS_TEXTO.map((g) => {
    const suyos = TEXTOS.filter((t) => t.tipo === g.tipo);
    if (!suyos.length) return "";
    return `<section class="text-group">
      <h3 class="text-group-title"><span><b>${esc(g.nombre)}</b><small>${esc(g.pista)}</small></span><em>${suyos.length}</em></h3>
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
  document.title = `${l.titulo} · Vocab`;

  box.innerHTML = `
    <div class="reader-toolbar">
      <div class="reader-toolbar-row">
        <button class="btn-back" id="back-lecturas">← Lecturas</button>
        <button class="reader-toggle" id="lect-todo" aria-pressed="false" aria-controls="reader-text">Traducir todo</button>
      </div>
      <div class="reader-location"><span id="reader-position">Frase 1 de ${l.frases.length}</span><span>${esc(NIVEL_NOMBRE[l.nivel] || l.nivel)}</span></div>
      <div class="reader-track" aria-hidden="true"><span id="reader-fill"></span></div>
    </div>
    <div class="view-head">
      <span class="eyebrow">${l.tipo === "cuento" ? "Un cuento en inglés" : "Inglés en contexto"}</span>
      <h2>${esc(l.titulo)}</h2>
      <p class="muted">Toca una palabra para consultar su significado. Traduce cada frase cuando lo necesites.</p>
    </div>
    <article class="lectura" id="reader-text" aria-label="Texto de la lectura">
      ${l.frases
        .map(
          ([en, es], n) => `<section class="lect-frase" data-n="${n}" aria-label="Frase ${n + 1}">
            <div class="reader-sentence-head">
              <span class="reader-number" aria-hidden="true">${String(n + 1).padStart(2, "0")}</span>
              <div class="reader-sentence-actions">
                <button class="reader-translate" data-translate="${n}" aria-expanded="false" aria-controls="reader-es-${n}" aria-label="Traducir frase ${n + 1}">Traducir</button>
                <button class="lect-audio" data-speak="${esc(en)}" aria-label="Escuchar frase ${n + 1}">${TODAY_TOOL_ICONS.listen}</button>
              </div>
            </div>
            <p class="lect-en" lang="en">${trocearFrase(en)}</p>
            <p class="lect-es" id="reader-es-${n}" lang="es" hidden>${esc(es)}</p>
          </section>`,
        )
        .join("")}
    </article>
    <div class="reader-finish">
      <p>Has llegado al final</p>
      <span>Vuelve a las frases que quieras practicar o guarda esta lectura como terminada.</span>
      <button class="btn" id="lect-hecha">✓ ${store.lecturas?.[l.id] ? "Leída · volver a lecturas" : "Marcar como leída"}</button>
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
    sincronizarTraducciones();
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
    const traducir = e.target.closest("[data-translate]");
    if (traducir) {
      const traduccion = $(".lect-es", traducir.closest(".lect-frase"));
      traduccion.hidden = !traduccion.hidden;
      sincronizarTraducciones();
      return;
    }
    if (e.target.closest(".lect-audio") || e.target.closest("button")) return;
    const frase = e.target.closest(".lect-frase");
    if (frase) {
      const es = $(".lect-es", frase);
      es.hidden = !es.hidden;
      sincronizarTraducciones();
    }
  };

  irAlInicio(box);
  programarPosicionLectura();
}

/** Los controles individuales y el general reflejan la misma visibilidad. */
function sincronizarTraducciones() {
  const box = $("#lectura-detalle");
  const frases = $$(".lect-frase", box);
  frases.forEach((frase, n) => {
    const visible = !$(".lect-es", frase).hidden;
    const boton = $("[data-translate]", frase);
    boton.setAttribute("aria-expanded", String(visible));
    boton.setAttribute("aria-label", `${visible ? "Ocultar traducción de" : "Traducir"} frase ${n + 1}`);
    boton.textContent = visible ? "Ocultar" : "Traducir";
    frase.classList.toggle("is-translated", visible);
  });
  const todas = frases.length > 0 && frases.every((frase) => !$(".lect-es", frase).hidden);
  $("#lect-todo").setAttribute("aria-pressed", String(todas));
  $("#lect-todo").textContent = todas ? "Ocultar todo" : "Traducir todo";
  programarPosicionLectura();
}

// Indica posición en el texto, sin marcar la lectura como terminada por scroll.
let readerFrame = null;
function programarPosicionLectura() {
  if (readerFrame !== null) return;
  readerFrame = requestAnimationFrame(() => {
    readerFrame = null;
    const box = $("#lectura-detalle");
    if (!lecturaAbierta || box.hidden || !box.closest(".view.is-active")) return;
    const frases = $$(".lect-frase", box);
    if (!frases.length) return;
    const linea = Math.max($(".reader-toolbar", box).getBoundingClientRect().bottom + 24, innerHeight * .4);
    let actual = 0;
    frases.forEach((frase, n) => {
      if (frase.getBoundingClientRect().top <= linea) actual = n;
    });
    $("#reader-position").textContent = `Frase ${actual + 1} de ${frases.length}`;
    $("#reader-fill").style.width = `${((actual + 1) / frases.length) * 100}%`;
  });
}
addEventListener("scroll", programarPosicionLectura, { passive: true });
addEventListener("resize", programarPosicionLectura);

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
  $('meta[name="theme-color"]')?.setAttribute("content", oscuro ? "#0b1020" : "#f6f5f0");

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
    <div class="stat"><b>${LESSONS.filter(l => !isPronunciation(l.id) && lessonProgress(l.id).retentionPasses >= 2).length}/${LESSONS.filter(l => !isPronunciation(l.id)).length}</b><span>gramática consolidada</span></div>
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
  const nombres = {
    hoy: "Vocab — inglés cada día",
    repaso: "Repaso · Vocab",
    juegos: "Juegos · Vocab",
    lecciones: "Aprender · Vocab",
    lista: "Palabras · Vocab",
    ajustes: "Ajustes · Vocab",
  };
  document.title = nombres[name] || "Vocab — inglés cada día";
  $$(".tab").forEach((t) => {
    const active = t.dataset.view === name;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-current", active ? "page" : "false");
  });
  // Ajustes ya no es una pestaña: su estado activo lo marca el engranaje.
  $("#btn-ajustes").classList.toggle("is-active", name === "ajustes");
  $("#btn-ajustes").setAttribute("aria-current", name === "ajustes" ? "page" : "false");
  $$(".view").forEach((v) => {
    const activa = v.dataset.view === name;
    v.classList.toggle("is-active", activa);
    v.setAttribute("aria-hidden", String(!activa));
  });
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
  irAlInicio($(`.view[data-view="${name}"]`));
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
  $("#daybar-go").innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 7l5 5-5 5"/></svg>`;
  $("#daybar-btn").dataset.vista = paso.vista;
  $("#daybar-btn").setAttribute("aria-label", $("#daybar-text").textContent.trim());

  const pasos = ["hoy", "repaso", "juegos"];
  const pasoActual = Math.max(0, pasos.indexOf(paso.vista));
  $$(".session-step").forEach((el, indice) => {
    el.classList.toggle("is-done", indice < pasoActual);
    el.classList.toggle("is-current", indice === pasoActual);
  });
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
  if (card) openLeccion(card.dataset.lesson, card.dataset.learningAction);

  const lect = e.target.closest("[data-lectura]");
  if (lect) abrirLectura(lect.dataset.lectura);

  const game = e.target.closest("[data-juego]");
  if (game) abrirJuego(game.dataset.juego);

  const reveal = e.target.closest("[data-reveal]");
  if (reveal) {
    setCardRevealed(reveal.closest(".card"), reveal.getAttribute("aria-expanded") !== "true");
    return;
  }
  // El gesto de tocar la tarjeta sigue disponible, además del botón accesible.
  const tapada = e.target.closest(".card.is-tapada");
  if (tapada && !btn) {
    setCardRevealed(tapada, true);
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
$("#limpiar-busqueda").addEventListener("click", () => {
  $("#buscador").value = "";
  renderLista();
  $("#buscador").focus();
});
$("#filtros-lista").addEventListener("click", (e) => {
  const button = e.target.closest("[data-list-filter]");
  if (!button || button.dataset.listFilter === listaFiltro) return;
  listaFiltro = button.dataset.listFilter;
  renderLista();
});
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
$(".learning-tabs").addEventListener("keydown", event => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const tabs = $$("[role=tab]", event.currentTarget);
  const index = tabs.indexOf(event.target);
  if (index < 0) return;
  event.preventDefault();
  const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].click();
  tabs[next].focus();
});

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
  if ((e.key === "Enter" || e.key === " ") && e.target.closest("button, summary, a")) return;
  const vista = $(".view.is-active");
  if (!vista) return;
  if (vista.dataset.view === "lecciones" && (!quiz || $("#quiz-box")?.hidden || $("#leccion-detalle").hidden)) return;

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
      "#next-q, #next-hueco, #next-escribe, #next-rapid, #next-escucha, #next-ordena, #next-hablar, #next-dictado, #next-irr, #next-modales, #next-frases, #next-falsos, #next-confusas, #game-review-next, #pair-continue, #next-repaso, #comprobar-repaso, #rejugar",
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
activarVista("hoy");
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
