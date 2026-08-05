import { SEED_WORDS, CATEGORIAS, nombreCategoria } from "./seed.js";
import { LESSONS, getLesson } from "./lessons.js";

/* ------------------------------------------------------------------ *
 * Estado
 * ------------------------------------------------------------------ */

const KEY = "vocab-ingles:v1";
// Intervalos de repaso espaciado, en días. El índice es la "caja" de la palabra.
const INTERVALOS = [0, 1, 3, 7, 16, 35, 90];

const defaults = () => ({
  version: 1,
  settings: { level: "intermedio", daily: 5, topic: "", category: "mixto", tapar: false },
  stats: { streak: 0, best: 0, lastStudy: null },
  daily: { date: null, ids: [], done: 0 },
  words: [],
  lessons: {}, // id -> { best: 0-100, done: bool, last: "YYYY-MM-DD" }
  games: {}, // id -> mejor marca
});

let store = load();

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
    };
  } catch {
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
const dueWords = () => store.words.filter((w) => w.due <= todayStr());
const learnedWords = () => store.words.filter((w) => w.box >= 4);

function addWord(raw) {
  const en = String(raw.en || "").trim().toLowerCase();
  if (!en) return null;
  if (store.words.some((w) => w.en === en)) return null;

  const word = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    en,
    es: String(raw.es || "").trim(),
    pron: String(raw.pron || "").trim(),
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
  if (!Array.isArray(data.words) || data.words.length === 0) throw new Error("Respuesta vacía");
  return data.words;
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
  } catch {
    // Sin banco: seguimos con SEED_WORDS.
  }
}

const listaLocal = () => (BANCO.length ? BANCO : SEED_WORDS);

function fetchSeedWords(count) {
  const known = new Set(knownWords());
  const cat = store.settings.category;
  const libres = listaLocal().filter((w) => !known.has(w.en));
  const deLaCategoria = cat === "mixto" ? libres : libres.filter((w) => w.cat === cat);
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

  const { words: incoming, source } = await obtenerPalabras(store.settings.daily);
  const added = incoming.map(addWord).filter(Boolean);
  store.daily = { date: t, ids: added.map((w) => w.id), done: 0 };
  registerStudyDay();
  save();

  return { words: added, source };
}

/* ------------------------------------------------------------------ *
 * Audio
 * ------------------------------------------------------------------ */

let voice = null;
let speechRun = 0;
function pickVoice() {
  const voices = speechSynthesis.getVoices();
  voice =
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => v.lang?.startsWith("en")) ||
    null;
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
    cards.innerHTML = `<div class="empty"><span class="big">🎉</span>Ya has visto todas las palabras disponibles.<br />Configura la API para recibir palabras nuevas.</div>`;
    sub.textContent = "";
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

  const pendientes = dueWords().length;
  const faltanObjetivo = Math.max(store.settings.daily - words.length, 0);
  actions.innerHTML = `
    <button class="btn" id="go-repaso">${pendientes ? `Repasar ahora · ${pendientes}` : "Repaso al día ✓"}</button>
    <button class="btn btn-ghost" id="listen-all"><span aria-hidden="true">🔊</span> Escuchar</button>
    <button class="btn btn-ghost" id="more-words">+ ${faltanObjetivo ? `Completar objetivo · ${faltanObjetivo}` : "Más palabras"}</button>
    <button class="btn btn-quiet" id="toggle-tapar">${store.settings.tapar ? "👁 Mostrar respuestas" : "🙈 Ocultar respuestas"}</button>`;

  $("#go-repaso").disabled = !pendientes;
  $("#go-repaso").onclick = () => showView("repaso");
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
let revealed = false;

function renderRepaso(restart = true) {
  const box = $("#quiz");
  const sub = $("#repaso-sub");

  if (restart) {
    // Una de cada tres sale al revés (español → inglés), que cuesta más y fija mejor.
    // Las palabras nuevas (caja 0) siempre salen de inglés a español.
    queue = dueWords()
      .sort(() => Math.random() - 0.5)
      .map((w) => ({ w, dir: w.box > 0 && Math.random() < 0.34 ? "es-en" : "en-es" }));
    queueTotal = queue.length;
    revealed = false;
  }

  if (!queue.length) {
    const proxima = store.words
      .map((w) => w.due)
      .sort()
      .find((d) => d > todayStr());
    sub.textContent = "";
    box.innerHTML = `
      <div class="empty">
        <span class="big">✅</span>
        Repaso al día.
        ${proxima ? `<br />Vuelve el ${new Date(proxima).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}.` : ""}
      </div>`;
    updateChrome();
    return;
  }

  const { w, dir } = queue[0];
  const hechas = queueTotal - queue.length;
  const alReves = dir === "es-en"; // te doy el español y tú recuerdas el inglés
  sub.textContent = `${hechas + 1} de ${queueTotal}`;

  const cara = alReves
    ? `<p class="word">${esc(w.es)}</p>
       <p class="quiz-dir">español → inglés</p>`
    : `<p class="word" lang="en">${esc(w.en)}</p>`;

  const dorso = alReves
    ? `<p class="translation" lang="en">${esc(w.en)}</p>
       <span class="pron">${esc(w.pron || "—")}</span>`
    : `<span class="pron">${esc(w.pron || "—")}</span>
       <p class="translation">${esc(w.es)}</p>`;

  box.innerHTML = `
    <div class="quiz-progress"><span style="width:${(hechas / queueTotal) * 100}%"></span></div>
    <article class="card quiz-card" data-id="${w.id}">
      ${cara}
      ${revealed ? dorso : ""}
      ${revealed && w.example ? `<p class="example" lang="en">${esc(w.example)}<em lang="es">${esc(w.exampleEs)}</em></p>` : ""}
      ${
        revealed
          ? ""
          : `<p class="quiz-hint">${alReves ? "¿Cómo se dice en inglés?" : "¿Qué significa?"} Piénsalo antes de darle la vuelta.</p>`
      }
    </article>
    <div class="row-actions">
      ${
        revealed
          ? `<button class="btn btn-again" data-grade="0">Otra vez</button>
             <button class="btn btn-good" data-grade="1">Bien</button>
             <button class="btn btn-easy" data-grade="2">Fácil</button>`
          : `<button class="btn" id="reveal">Ver respuesta</button>
             ${alReves ? "" : `<button class="btn btn-ghost" data-speak="${esc(w.en)}">🔊 Escuchar</button>`}`
      }
    </div>`;

  if (!revealed) {
    $("#reveal").onclick = () => {
      revealed = true;
      renderRepaso(false);
      if (alReves) speak(w.en); // al girarla, oyes cómo suena la que buscabas
    };
  } else {
    $$("[data-grade]", box).forEach((btn) => {
      btn.onclick = () => {
        grade(w, Number(btn.dataset.grade));
        if (Number(btn.dataset.grade) === 0) queue.push(queue.shift());
        else queue.shift();
        revealed = false;
        renderRepaso(false);
      };
    });
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
];

let juego = null; // estado del juego en curso
let gameTimer = null;

function pararJuego() {
  clearInterval(gameTimer);
  gameTimer = null;
  juego = null;
}

/** Material para jugar: tus palabras y, si tienes pocas, se completa con la lista base. */
function gamePool() {
  if (store.words.length >= 12) return store.words;
  const known = new Set(store.words.map((w) => w.en));
  const extra = listaLocal()
    .filter((w) => !known.has(w.en))
    .slice(0, 60)
    .map((w) => ({ ...w, id: null }));
  return [...store.words, ...extra];
}

const mezclar = (arr) => [...arr].sort(() => Math.random() - 0.5);
/** Escapa los caracteres que tienen significado especial dentro de una expresión regular. */
const escRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const record = (id) => store.games?.[id] ?? 0;

function guardarRecord(id, valor, menorEsMejor = false) {
  store.games = store.games || {};
  const actual = store.games[id];
  const mejor =
    actual === undefined ? true : menorEsMejor ? valor < actual : valor > actual;
  if (mejor) store.games[id] = valor;
  registerStudyDay();
  save();
  return mejor;
}

/** Fallar una palabra en un juego la devuelve a la cola de repaso. */
function penalizar(w) {
  if (!w?.id) return;
  const real = byId(w.id);
  if (!real) return;
  real.box = 0;
  real.due = todayStr();
  save();
  updateChrome();
}

const norm = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

function renderJuegosIndex() {
  pararJuego();
  $("#juego-activo").hidden = true;
  $("#juegos-index").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });

  const pool = gamePool().length;
  $("#juegos-sub").textContent = `${pool} palabras en juego · fallar una la devuelve al repaso`;

  $("#juegos-lista").innerHTML = JUEGOS.map((g) => {
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
  }).join("");
}

function abrirJuego(id) {
  const def = JUEGOS.find((g) => g.id === id);
  const pool = gamePool();
  if (pool.length < def.minimo) {
    toast(`Necesitas al menos ${def.minimo} palabras para este juego.`);
    return;
  }

  pararJuego();
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

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Desglose honesto: aciertos, fallos y las que reconociste no saber. */
function detalle(j, esRecord) {
  const partes = [];
  if (j.fallos) partes.push(`${j.fallos} ${j.fallos === 1 ? "fallo" : "fallos"}`);
  if (j.nose) partes.push(`${j.nose} sin saber`);
  if (esRecord) partes.push("nuevo récord");
  return partes.length ? partes.join(" · ") : "Sin un solo fallo";
}

function pantallaFinal(titulo, detalle, esRecord, reiniciar) {
  $("#game-box").innerHTML = `
    <div class="card quiz-result">
      <p class="result-emoji">${esRecord ? "🏆" : "👏"}</p>
      <p class="result-score">${esc(titulo)}</p>
      <p class="muted">${esc(detalle)}</p>
      <div class="row-actions">
        <button class="btn" id="rejugar">Otra partida</button>
        <button class="btn btn-ghost" id="volver-juegos">Otros juegos</button>
      </div>
    </div>`;
  $("#rejugar").onclick = reiniciar;
  $("#volver-juegos").onclick = () => renderJuegosIndex();
  updateChrome();
}

/* ---------- ⚡ Respuesta rápida ---------- */

function iniciarRapida(pool) {
  juego = { pool, aciertos: 0, fallos: 0, nose: 0, restante: 60, actual: null, bloqueado: false };
  clearInterval(gameTimer);
  gameTimer = setInterval(() => {
    if (!juego) return clearInterval(gameTimer);
    juego.restante -= 1;
    const reloj = $("#reloj");
    if (reloj) reloj.textContent = juego.restante;
    if (juego.restante <= 0) {
      clearInterval(gameTimer);
      const esRecord = guardarRecord("rapida", juego.aciertos);
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

function siguienteRapida() {
  if (!juego) return;
  const candidatas = juego.pool.filter((x) => x.en !== juego.actual?.en);
  const w = mezclar(candidatas.length ? candidatas : juego.pool)[0];
  const opciones = mezclar([
    w,
    ...mezclar(juego.pool.filter((x) => x.en !== w.en)).slice(0, 3),
  ]);
  juego.actual = w;
  juego.bloqueado = false;

  $("#game-box").innerHTML = `
    <div class="game-hud">
      <span class="hud-time">⏱ <b id="reloj">${juego.restante}</b>s</span>
      <span class="hud-score">${juego.aciertos} aciertos</span>
    </div>
    <div class="card quiz-card">
      <p class="quiz-count">¿Cómo se dice…?</p>
      <p class="word">${esc(w.es)}</p>
    </div>
    <div class="options" id="op-rapida">
      ${opciones.map((o) => `<button class="option" data-en="${esc(o.en)}">${esc(o.en)}</button>`).join("")}
    </div>
    <button class="btn btn-nose" id="nose">🤷 No lo sé</button>`;

  const marcarCorrecta = () =>
    $$("#op-rapida .option").forEach((x) => {
      if (x.dataset.en === juego.actual.en) x.classList.add("is-right");
    });

  $$("#op-rapida .option").forEach((b) => {
    b.onclick = () => {
      if (!juego || juego.bloqueado) return;
      juego.bloqueado = true;
      const bien = b.dataset.en === juego.actual.en;
      if (bien) juego.aciertos += 1;
      else {
        juego.fallos += 1;
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

function iniciarHueco(pool) {
  // Solo sirven las palabras cuya frase de ejemplo las contiene.
  const validas = pool.filter(
    (w) => w.example && w.example.toLowerCase().includes(w.en.toLowerCase()),
  );
  if (validas.length < 4) {
    $("#game-box").innerHTML = `<div class="empty">Aún no hay frases suficientes. Añade más palabras.</div>`;
    return;
  }
  juego = { pool, items: mezclar(validas).slice(0, 10), i: 0, aciertos: 0, fallos: 0, nose: 0, elegida: null };
  renderHueco();
}

function renderHueco() {
  if (!juego) return;
  const { items, i } = juego;

  if (i >= items.length) {
    const esRecord = guardarRecord("hueco", juego.aciertos);
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
  const hueco = w.example.replace(new RegExp(escRegex(w.en), "ig"), "______");
  const opciones = mezclar([w, ...mezclar(juego.pool.filter((x) => x.en !== w.en)).slice(0, 2)]);
  const respondida = juego.elegida !== null;
  const noLaSabia = juego.elegida === NO_LO_SE;

  $("#game-box").innerHTML = `
    <div class="game-hud"><span class="hud-time">${i + 1} / ${items.length}</span><span class="hud-score">${juego.aciertos} aciertos</span></div>
    <div class="card">
      <p class="quiz-q">${esc(hueco)}</p>
      ${respondida ? `<p class="muted">${esc(w.exampleEs)}</p>` : ""}
    </div>
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
    ${respondida ? "" : `<button class="btn btn-nose" id="nose">🤷 No lo sé</button>`}
    ${
      respondida
        ? `<div class="explain ${juego.elegida === w.en ? "ok" : noLaSabia ? "nose" : "ko"}">
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
        if (juego.elegida === w.en) juego.aciertos += 1;
        else {
          juego.fallos += 1;
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
  } else {
    $("#next-hueco").onclick = () => {
      juego.i += 1;
      juego.elegida = null;
      renderHueco();
    };
  }
}

/* ---------- ✍️ Escríbela ---------- */

function iniciarEscribe(pool) {
  juego = { pool, items: mezclar(pool).slice(0, 10), i: 0, aciertos: 0, fallos: 0, nose: 0, resultado: null };
  renderEscribe();
}

function renderEscribe() {
  if (!juego) return;
  const { items, i } = juego;

  if (i >= items.length) {
    const esRecord = guardarRecord("escribe", juego.aciertos);
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

  $("#game-box").innerHTML = `
    <div class="game-hud"><span class="hud-time">${i + 1} / ${items.length}</span><span class="hud-score">${juego.aciertos} aciertos</span></div>
    <div class="card quiz-card">
      <p class="quiz-count">Escríbelo en inglés</p>
      <p class="word">${esc(w.es)}</p>
      <button class="speak" data-speak="${esc(w.en)}" aria-label="Escuchar">🔊</button>
    </div>
    <input id="resp-escribe" class="input input-big" type="text" placeholder="Escribe aquí…"
           autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
           ${r ? "disabled" : ""} value="${r ? esc(r.texto) : ""}" />
    ${
      r
        ? `<div class="explain ${r.bien ? "ok" : r.rendida ? "nose" : "ko"}">
             <b>${r.bien ? "¡Correcto!" : (r.rendida ? "Es: " : "Era: ") + esc(w.en)}</b>
             <p>${esc(w.pron ? "(" + w.pron + ") " : "")}${esc(w.example || "")}</p>
           </div>
           <button class="btn" id="next-escribe">${i + 1 === items.length ? "Ver resultado" : "Siguiente"}</button>`
        : `<div class="row-actions">
             <button class="btn" id="comprobar">Comprobar</button>
             <button class="btn btn-nose" id="paso">🤷 No la sé</button>
           </div>`
    }`;

  if (!r) {
    const input = $("#resp-escribe");
    // Sin preventScroll el navegador desplaza la página para centrar el campo,
    // y la vista pega un salto en cada pregunta.
    input.focus({ preventScroll: true });
    const comprobar = (texto, rendida = false) => {
      const bien = !rendida && norm(texto) === norm(w.en);
      if (bien) juego.aciertos += 1;
      else {
        if (rendida) juego.nose += 1;
        else juego.fallos += 1;
        penalizar(w);
      }
      juego.resultado = { bien, texto, rendida };
      renderEscribe();
    };
    input.onkeydown = (e) => {
      if (e.key === "Enter") comprobar(input.value);
    };
    $("#comprobar").onclick = () => comprobar(input.value);
    $("#paso").onclick = () => comprobar("", true);
  } else {
    $("#next-escribe").onclick = () => {
      juego.i += 1;
      juego.resultado = null;
      renderEscribe();
    };
  }
}

/* ---------- 🔗 Emparejar ---------- */

function iniciarParejas(pool) {
  const elegidas = mezclar(pool).slice(0, 6);
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

/* ------------------------------------------------------------------ *
 * Vista: Lecciones
 * ------------------------------------------------------------------ */

/** Marca de "no lo sé": ni acierto ni fallo, pero la palabra vuelve al repaso. */
const NO_LO_SE = "__no_lo_se__";

let quiz = null; // { lesson, items, i, aciertos, elegida }

function lessonProgress(id) {
  return store.lessons[id] || { best: 0, done: false, last: null };
}

function renderLeccionesIndex() {
  $("#leccion-detalle").hidden = true;
  $("#lecciones-index").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });

  const hechas = LESSONS.filter((l) => lessonProgress(l.id).done).length;
  $("#lecciones-sub").textContent = `${hechas} de ${LESSONS.length} superadas · gramática explicada en español`;

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

function blockHtml(b) {
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

function openLeccion(id) {
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
    if (!exercises?.length) throw new Error("No llegó ningún ejercicio");
    startQuiz(lesson, exercises, { ia: true });
  } catch (err) {
    toast(err.message);
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
      <div class="card quiz-result">
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
          ? `<div class="explain ${acertada ? "ok" : noLaSabia ? "nose" : "ko"}">
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
 * Vista: Ajustes
 * ------------------------------------------------------------------ */

function renderAjustes() {
  $("#set-categoria").innerHTML = CATEGORIAS.map(
    (c) => `<option value="${c.id}">${esc(c.nombre)}</option>`,
  ).join("");
  $("#set-categoria").value = store.settings.category;
  $("#set-level").value = store.settings.level;
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

function showView(name) {
  if (name !== "juegos") pararJuego();
  $$(".tab").forEach((t) => {
    const active = t.dataset.view === name;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-current", active ? "page" : "false");
  });
  $$(".view").forEach((v) => v.classList.toggle("is-active", v.dataset.view === name));
  if (name === "hoy") renderHoy();
  if (name === "repaso") renderRepaso(true);
  if (name === "juegos") renderJuegosIndex();
  if (name === "lecciones") renderLeccionesIndex();
  if (name === "lista") renderLista();
  if (name === "ajustes") renderAjustes();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateChrome() {
  const pendientes = dueWords().length;
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
  $("#daybar-text").innerHTML = pendientes
    ? `<b>${pendientes}</b> ${pendientes === 1 ? "palabra" : "palabras"} por repasar${hechas ? ` · ${hechas} ya ${hechas === 1 ? "hecha" : "hechas"}` : ""}`
    : store.words.length
      ? `Repaso al día ✓${hechas ? ` · ${hechas} ${hechas === 1 ? "repasada" : "repasadas"} hoy` : ""}`
      : "Empieza con las palabras de hoy";
}

/* ------------------------------------------------------------------ *
 * Eventos globales
 * ------------------------------------------------------------------ */

$("#tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (tab) showView(tab.dataset.view);
});

// Un solo listener para todos los botones de audio, presentes o futuros.
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-speak]");
  if (btn) speak(btn.dataset.speak);

  const card = e.target.closest("[data-lesson]");
  if (card) openLeccion(card.dataset.lesson);

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

$("#set-level").addEventListener("change", (e) => {
  store.settings.level = e.target.value;
  save();
  toast("Nivel actualizado. Se aplica a las palabras de mañana.");
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
    if (!confirm(`La copia tiene ${datos.words.length} palabras. Se sustituirá lo que tengas ahora. ¿Seguir?`)) return;
    store = { ...defaults(), ...datos, settings: { ...defaults().settings, ...datos.settings } };
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
 *   espacio  → dar la vuelta a la tarjeta del repaso
 *   1 2 3    → calificar en el repaso, o elegir opción en tests y juegos
 *   enter    → siguiente
 */
document.addEventListener("keydown", (e) => {
  if (e.target.matches("input, textarea, select")) return;

  const repasoVisible = $('.view[data-view="repaso"]').classList.contains("is-active");

  if (e.code === "Space" && repasoVisible && queue.length && !revealed) {
    e.preventDefault();
    revealed = true;
    renderRepaso(false);
    return;
  }

  if (e.key === "Enter") {
    const seguir = $("#next-q, #next-hueco, #next-escribe, #reveal, #rejugar");
    if (seguir) {
      e.preventDefault();
      seguir.click();
    }
    return;
  }

  if (e.key === "0") {
    const nose = $("#nose, #paso");
    if (nose) {
      e.preventDefault();
      nose.click();
    }
    return;
  }

  if (["1", "2", "3", "4"].includes(e.key)) {
    const n = Number(e.key) - 1;
    const opciones = $$(".options .option:not([disabled]), [data-grade]");
    if (opciones[n]) {
      e.preventDefault();
      opciones[n].click();
    }
  }
});

/* ------------------------------------------------------------------ *
 * Arranque
 * ------------------------------------------------------------------ */

await cargarBanco();
updateChrome();
renderHoy();
