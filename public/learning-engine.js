// Fechas locales e intervalos de producto, no una certificación de nivel.
export const LEARNING_VERSION = 2;
export const PATH = [
  ['Fundamentos', 'verbo-be ser-estar-tener pronombres-completo orden-frase this-that-these-those articulos plurales there-is-are genitivo-sajon adjetivos-orden'],
  ['Hablar del día a día', 'presente-simple adverbios-frecuencia preguntas imperativo-peticiones presente-continuo verbos-estado like-gustar contracciones concordancia familia-how numeros-horas-fechas'],
  ['Describir y relacionar', 'cuantificadores some-any doble-negacion comparativos adverbios-modo preposiciones-tiempo-lugar preposiciones-movimiento preposicion-al-final orden-complementos dos-objetos so-such-too-enough tambien-tampoco also-too-aswell'],
  ['Contar experiencias', 'pasado-simple pasado-continuo used-to-would present-perfect for-since-ago still-yet-already past-perfect present-perfect-continuous tiempos-resumen'],
  ['Planes y posibilidades', 'futuro modales modales-obligacion can-be-able condicionales oraciones-tiempo futuro-avanzado modales-pasado wish-ojala question-tags'],
  ['Construir frases complejas', 'gerundio-infinitivo gerundio-sujeto verbo-persona-infinitivo verbos-cambian-significado causativos voz-pasiva estilo-indirecto preguntas-indirectas pronombres-relativos conectores-contraste conectores-causa'],
  ['Precisión y vocabulario', 'say-tell make-do verbo-get verbos-preposicion adjetivos-preposicion phrasal-separables ed-ing prefijos-sufijos sustantivos-compuestos ortografia-terminaciones there-their-theyre'],
  ['Pronunciación · ruta independiente', 'leer-pronunciacion pronunciacion-ed pronunciacion-s acento-palabra palabras-enlazadas vocales-parecidas letras-mudas familia-ough'],
].map(([title, ids], index) => ({ title, ids: ids.split(' '), pronunciation: index === 7 }));
export const isPronunciation = id => PATH[7].ids.includes(id);
export const orderedLessons = lessons => PATH.flatMap(g => g.ids.map(id => lessons.find(l => l.id === id)).filter(Boolean));
const PREREQUISITES = {
  'ser-estar-tener': ['verbo-be'],
  'pronombres-completo': ['verbo-be'],
  'orden-frase': ['pronombres-completo'],
  'this-that-these-those': ['pronombres-completo'],
  'there-is-are': ['verbo-be', 'plurales'],
  'genitivo-sajon': ['pronombres-completo', 'plurales'],
  'presente-simple': ['orden-frase'],
  'preguntas': ['verbo-be', 'presente-simple'],
  'imperativo-peticiones': ['verbo-be', 'preguntas'],
  'presente-continuo': ['verbo-be', 'presente-simple'],
  'verbos-estado': ['presente-simple', 'presente-continuo'],
  'cuantificadores': ['articulos', 'plurales'],
  'comparativos': ['adjetivos-orden'],
  'tambien-tampoco': ['preguntas'],
  'pasado-simple': ['presente-simple', 'preguntas'],
  'pasado-continuo': ['pasado-simple', 'presente-continuo'],
  'used-to-would': ['pasado-simple'],
  'present-perfect': ['pasado-simple'],
  'past-perfect': ['pasado-simple', 'present-perfect'],
  'present-perfect-continuous': ['present-perfect', 'presente-continuo'],
  'futuro': ['presente-simple', 'presente-continuo'],
  'modales': ['verbo-be', 'preguntas'],
  'can-be-able': ['modales', 'futuro'],
  'condicionales': ['pasado-simple', 'past-perfect', 'futuro', 'modales'],
  'oraciones-tiempo': ['presente-simple', 'futuro'],
  'futuro-avanzado': ['futuro', 'present-perfect', 'presente-continuo'],
  'modales-pasado': ['modales', 'present-perfect'],
  'wish-ojala': ['condicionales'],
  'question-tags': ['preguntas', 'modales'],
  'gerundio-infinitivo': ['presente-simple', 'presente-continuo'],
  'verbo-persona-infinitivo': ['pronombres-completo', 'gerundio-infinitivo'],
  'causativos': ['verbo-persona-infinitivo'],
  'voz-pasiva': ['verbo-be', 'present-perfect'],
  'estilo-indirecto': ['preguntas', 'past-perfect'],
  'preguntas-indirectas': ['preguntas', 'orden-frase'],
  'pronombres-relativos': ['pronombres-completo', 'orden-frase'],
  'phrasal-separables': ['pronombres-completo', 'verbos-preposicion'],
};
export function prerequisites(id) {
  if (PREREQUISITES[id]) return PREREQUISITES[id];
  const group = PATH.find(g => g.ids.includes(id));
  if (!group || group.pronunciation) return [];
  const i = group.ids.indexOf(id);
  return i ? [group.ids[i - 1]] : group === PATH[0] ? [] : [PATH[0].ids[0], 'orden-frase'];
}
export function shuffled(items, random = Math.random) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
// Balancear posiciones evita aprobar pulsando siempre el mismo botón.
export function prepareQuiz(items, random = Math.random) {
  const counts = new Map();
  return shuffled(items, random).map(item => {
    if (item.type === 'write') return { ...item };
    const n = item.options.length;
    if (!counts.has(n) || !counts.get(n).length) counts.set(n, shuffled(Array.from({ length: n }, (_, i) => i), random));
    const answer = counts.get(n).pop();
    const options = shuffled(item.options.filter((_, i) => i !== item.answer), random);
    options.splice(answer, 0, item.options[item.answer]);
    return { ...item, options, answer };
  });
}
export function normalizeAnswer(value) {
  return String(value).normalize('NFKC').trim().toLowerCase().replace(/[‘’]/g, "'")
    .replace(/\bwon't\b/g, 'will not').replace(/\bcan't\b/g, 'cannot')
    .replace(/\bcan not\b/g, 'cannot').replace(/n't\b/g, ' not')
    .replace(/\bi'm\b/g, 'i am').replace(/\b(you|we|they)'re\b/g, '$1 are')
    .replace(/\b(i|you|we|they)'ve\b/g, '$1 have').replace(/\b(i|you|he|she|it|we|they)'ll\b/g, '$1 will')
    .replace(/[.!?]+$/g, '').replace(/\s+/g, ' ').trim();
}
export const correctAnswer = item => item.type === 'write' ? item.accepted[0] : item.options[item.answer];
function answerForms(value) {
  // 's y 'd son ambiguos: nunca borres un apóstrofo posesivo para "corregirlo".
  let forms = [normalizeAnswer(value)];
  for (const [pattern, endings] of [[/\b(he|she|it|that|there|what|who)'s\b/g, ['is', 'has']], [/\b(i|you|he|she|it|we|they)'d\b/g, ['would', 'had']]]) {
    forms = forms.flatMap(form => endings.map(ending => form.replace(pattern, `$1 ${ending}`)));
  }
  return forms;
}
export const isCorrect = (item, response) => response !== '__no_lo_se__' && (item.type === 'write'
  ? typeof response === 'string' && item.accepted.some(a => item.strict
    ? a.toLowerCase() === response.trim().toLowerCase().replace(/[‘’]/g, "'").replace(/[.!?]+$/g, '')
    : answerForms(a).some(expected => answerForms(response).includes(expected)))
  : response === item.answer);
export function dayAfter(day, days) {
  const [y, m, d] = day.split('-').map(Number);
  const date = new Date(y, m - 1, d + days, 12);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export const dueReview = (p, day) => !!p.nextReview && p.nextReview <= day;
export function learningState(p, day) {
  if (dueReview(p, day)) return 'Repaso pendiente';
  if (p.retentionPasses >= 2) return 'Consolidada en la práctica';
  if (p.productionPassedAt && p.testPassedAt) return 'En consolidación';
  if (p.testPassedAt) return 'Prueba superada · falta aplicar';
  if (p.done) return 'Nota anterior conservada';
  return p.last ? 'Practicada' : 'Sin empezar';
}
export function recordLearning(previous, { mode, percent, day, eligible = true, pronunciation = false }) {
  const p = { best: 0, done: false, ...previous };
  if (!eligible || mode === 'errors' || mode === 'ai') return p;
  p.last = day;
  if (mode === 'test') {
    p.best = Math.max(p.best, percent);
    p.done ||= percent >= 80;
    if (percent >= 80) p.testPassedAt = day;
  }
  if (mode === 'production' && percent === 100) p.productionPassedAt = day;
  if (mode === 'retention' && p.testPassedAt && p.productionPassedAt && dueReview(p, day)) {
    if (percent === 100) {
      p.retentionPasses = (p.retentionPasses || 0) + 1;
      p.nextReview = dayAfter(day, p.retentionPasses >= 2 ? 30 : 7);
    } else {
      p.retentionPasses = 0;
      p.nextReview = dayAfter(day, 1);
    }
  }
  if (((mode === 'test' && percent < 80) || (mode === 'production' && percent < 100)) && p.nextReview) {
    p.retentionPasses = 0;
    p.nextReview = dayAfter(day, 1);
  }
  if (!pronunciation && p.testPassedAt && p.productionPassedAt && !p.nextReview) {
    p.retentionPasses = 0;
    p.nextReview = dayAfter(day, 2);
  }
  return p;
}
