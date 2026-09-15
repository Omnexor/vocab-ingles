import { normalizeAnswer, dayAfter } from './learning-engine.js';

export const GAME_OBJECTIVES = {
  rapida: 'Recupera el significado. Empieza sin reloj; la velocidad es un reto opcional, no una medida de dominio.',
  hueco: 'Elige el vocabulario por el contexto. Las opciones son formas de diccionario; después verás la forma usada en la frase.',
  escribe: 'Recupera y escribe la palabra. Escucharla o pedir letras es una ayuda y se separa de los aciertos independientes.',
  parejas: 'Relaciona forma y significado. Resolver parejas visibles entrena reconocimiento, no demuestra recuerdo sin ayuda.',
  escucha: 'Distingue el significado al escuchar. Puedes repetir el audio; una pista visual cuenta como ayuda.',
  ordena: 'Practica la secuencia de letras. Después prueba Escríbela para recuperarla sin fichas.',
  hablar: 'Compara tu voz con el modelo. Que el reconocedor entienda una palabra no certifica tu pronunciación; el ruido también influye.',
  dictado: 'Escucha, escribe y revisa el significado. Los homófonos no son intercambiables dentro de una frase.',
  irregulares: 'Distingue pasado simple y participio. No basta con reconocer la tabla: recupera la forma que falta.',
  modales: 'Relaciona cada modal con la intención indicada en español, no solo con una frase gramaticalmente posible.',
  frases: 'Recupera una expresión para una situación concreta. Después intenta usarla en una situación tuya.',
  falsos: 'Contrasta el significado real con la palabra española que te confunde.',
  confusas: 'Distingue las dos palabras. Un acierto inmediato reduce el contador, pero no certifica que ya no las confundirás.',
};
export function validReview(item) {
  return item && typeof item.key === 'string' && typeof item.prompt === 'string'
    && Array.isArray(item.accepted) && item.accepted.length && item.accepted.every(a => typeof a === 'string' && a.trim())
    && typeof item.explanation === 'string' && validReviewDay(item.due);
}
function validReviewDay(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export const reviewCards = queue => Object.values(queue || {}).filter(validReview);
export const dueCards = (queue, day) => reviewCards(queue).filter(c => c.due <= day);
export function reviewPlan(queue, day) {
  const cards = reviewCards(queue);
  const due = cards.filter(c => c.due <= day);
  const future = cards.filter(c => c.due > day).sort((a, b) => a.due.localeCompare(b.due));
  const groups = new Map();
  const today = { independent: 0, assisted: 0, wrong: 0, early: 0 };
  for (const card of cards) {
    const key = card.mission ? `mission:${card.mission}` : `game:${card.game || 'other'}`;
    if (!groups.has(key)) groups.set(key, { key, mission: card.mission || null, game: card.mission ? null : card.game || null, total: 0, due: 0, maintenance: 0, support: 0, next: card.due });
    const group = groups.get(key);
    group.total++; group.due += Number(card.due <= day);
    group.maintenance += Number(reviewStage(card) === 3);
    group.next = group.next < card.due ? group.next : card.due;
    const history = Array.isArray(card.history) ? card.history.filter(h => h && typeof h.date === 'string') : [];
    const last = history.at(-1);
    group.support += Number(Boolean(card.needsSupport) || (reviewStage(card) === 0 && (last?.assisted || last?.correct === false || (!last && card.misses > 0))));
    // One first attempt per target per day, not every replay of the same card.
    const first = card.dailyResult?.date === day ? card.dailyResult : history.find(h => h.date === day);
    if (first) {
      if (!first.eligible) today.early++;
      else if (!first.correct) today.wrong++;
      else if (first.assisted) today.assisted++;
      else today.independent++;
    }
  }
  return { total: cards.length, due: due.length, upcoming: future.length, next: future[0]?.due || null, today,
    groups: [...groups.values()].sort((a, b) => Number(b.due > 0) - Number(a.due > 0) || a.next.localeCompare(b.next) || a.key.localeCompare(b.key)) };
}
export function reviewSessionValid(run, cards, day, gameId = null, missionId = null) {
  return Boolean(run && run.date === day && run.gameId === gameId && (run.missionId || null) === missionId
    && Array.isArray(run.items) && run.items.length > 0 && run.items.length <= 10
    && Number.isInteger(run.i) && run.i >= 0 && run.i < run.items.length
    && run.items.every(c => validReview(c) && cards.some(saved => saved.key === c.key))
    && (!run.response || typeof run.response.correct === 'boolean'));
}
// Product defaults, not scientifically optimized intervals: 1, then 3, then 7
// days between independent checks. Continue with monthly maintenance.
export const GAME_REVIEW_GAPS = [1, 3, 7, 30];
export const reviewStage = card => Math.max(0, Math.min(3, Number.isInteger(card?.stage) ? card.stage : 0));
export function schedulePractice(queue, card, day) {
  if (validReview(queue?.[card.key])) return { ...queue };
  return { ...(queue || {}), [card.key]: { ...card, due: dayAfter(day, 1), stage: 0, misses: 0, needsSupport: false, history: [] } };
}
export function scheduleMistake(queue, card, day) {
  const next = { ...(queue || {}) };
  const previous = next[card.key];
  next[card.key] = { ...previous, ...card, due: dayAfter(day, 1), stage: 0, needsSupport: true, misses: (Number(previous?.misses) || 0) + 1 };
  return next;
}
export function answerReview(queue, key, correct, day, assisted = false) {
  const next = { ...(queue || {}) };
  if (!validReview(next[key])) return next;
  const card = next[key];
  const eligible = card.due <= day && card.lastReviewed !== day;
  const independent = correct && !assisted;
  const result = { date: day, correct, assisted, eligible };
  const history = Array.isArray(card.history) ? card.history.filter(h => h && typeof h === 'object') : [];
  const stage = independent && eligible ? Math.min(3, reviewStage(card) + 1) : independent ? reviewStage(card) : 0;
  next[key] = { ...card, stage,
    needsSupport: !independent || (!eligible && Boolean(card.needsSupport)),
    dailyResult: card.dailyResult?.date === day ? card.dailyResult : history.find(h => h.date === day) || result,
    due: independent ? eligible ? dayAfter(day, GAME_REVIEW_GAPS[stage]) : card.due : dayAfter(day, 1),
    misses: (Number(card.misses) || 0) + Number(!correct),
    lastReviewed: eligible ? day : card.lastReviewed,
    history: [...history, result].slice(-12),
  };
  return next;
}
export function reviewExercise(card) {
  const variants = Array.isArray(card.variants) ? card.variants.filter(v => v && typeof v.prompt === 'string' && Array.isArray(v.accepted) && v.accepted.length && v.accepted.every(a => typeof a === 'string' && a.trim()) && typeof v.explanation === 'string') : [];
  return variants.length ? { ...card, ...variants[reviewStage(card) % variants.length] } : card;
}
export function gameSummary(game) {
  const correct = game.aciertos ?? game.resueltas ?? 0;
  const assisted = Math.min(correct, game.conPista || 0);
  const wrong = game.fallos || 0;
  const unknown = game.nose || 0;
  const total = correct + wrong + unknown;
  return { correct, assisted, independent: correct - assisted, wrong, unknown, total,
    accuracy: total ? Math.round((correct - assisted) / total * 100) : null };
}
// Mantiene apóstrofos internos: cant/can't y its/it's no son la misma escritura.
export const spelling = text => String(text).normalize('NFKC').toLowerCase().replace(/[‘’]/g, "'")
  .replace(/[^\p{L}\p{N}'\s-]/gu, ' ').replace(/\s+/g, ' ').trim();
export function assessDictation(expected, supplied) {
  const wanted = spelling(expected).split(' ').filter(Boolean);
  const actual = spelling(supplied).split(' ').filter(Boolean);
  // Alineación mínima: omitir una palabra no convierte todas las siguientes en errores.
  const dp = Array.from({ length: wanted.length + 1 }, () => Array(actual.length + 1).fill(0));
  for (let i = 0; i <= wanted.length; i++) dp[i][0] = i;
  for (let j = 0; j <= actual.length; j++) dp[0][j] = j;
  for (let i = 1; i <= wanted.length; i++) for (let j = 1; j <= actual.length; j++) {
    dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + Number(wanted[i - 1] !== actual[j - 1]));
  }
  const tokens = [];
  let i = wanted.length, j = actual.length;
  while (i || j) {
    if (i && j && dp[i][j] === dp[i - 1][j - 1] + Number(wanted[i - 1] !== actual[j - 1])) {
      tokens.unshift({ text: wanted[i - 1], correct: wanted[i - 1] === actual[j - 1] }); i--; j--;
    } else if (i && dp[i][j] === dp[i - 1][j] + 1) { tokens.unshift({ text: wanted[--i], correct: false }); }
    else { tokens.unshift({ text: actual[--j], extra: true, correct: false }); }
  }
  return { correct: spelling(expected) === spelling(supplied), tokens, matched: tokens.filter(t => t.correct).length, total: wanted.length };
}
export const reviewCorrect = (card, value) => card.accepted.some(a => card.exact
  ? spelling(a) === spelling(value) : normalizeAnswer(a) === normalizeAnswer(value));
