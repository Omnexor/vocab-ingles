import { reviewCorrect } from './game-learning.js';

// Curated, bounded-response tasks. Each target has separate initial, final and
// delayed contexts. These check constrained use, not free conversation or CEFR.
const task = (prompt, answer) => ({ prompt, accepted: answer.split('|'), exact: true });
const target = (id, answer, meaning, example, explanation, distractors, contexts) => ({
  id, answer, meaning, example, explanation, options: [answer, ...distractors],
  recall: task(`Escribe en inglés: ${meaning}`, answer),
  baseline: task(contexts[0], answer), transfer: task(contexts[1], answer),
  variants: contexts.slice(2).map(prompt => ({ ...task(prompt, answer), explanation })),
});
const listeningTask = (prompt, audio, answers, options) => {
  const question = { ...task(prompt, answers), audio, options };
  const [number, word] = question.accepted;
  if (/hora|apertura|cierre/i.test(prompt)) question.accepted.push(`${number}:00`, `${number.padStart(2, '0')}:00`, `${word} o'clock`);
  return question;
};
const listeningItem = (id, meaning, example, explanation, rows) => {
  const [baseline, choice, recall, transfer, ...variants] = rows.map(row => listeningTask(...row));
  return { id, meaning, example, explanation, answer: choice.accepted[0], options: choice.options, baseline, choice, recall, transfer,
    variants: variants.map(q => ({ ...q, explanation })) };
};
export const MISSIONS = [
  { id: 'travel-words', title: 'Prepara tu viaje', level: 'A1 · vocabulario', goal: 'Recordar y usar tres palabras de viaje sin opciones.', games: ['rapida', 'parejas', 'escribe', 'hueco', 'ordena'], items: [
    target('ticket', 'ticket', 'billete (para viajar)', 'I have a train ticket. — Tengo un billete de tren.', 'Ticket es el billete; station es la estación y suitcase, la maleta.', ['station', 'suitcase'], [
      'Completa con «billete»: I need a bus ___.', 'Ahora en el aeropuerto: Show your ___ before boarding. (billete)', 'Viajas en ferry: Keep your ___ until the end of the trip. (billete)', 'En la taquilla: A single ___ to Oxford, please. (billete)',
    ]),
    target('station', 'station', 'estación (de transporte)', 'The train is at the station. — El tren está en la estación.', 'Station nombra la estación, no el billete ni el equipaje.', ['ticket', 'suitcase'], [
      'Completa con «estación»: Where is the train ___?', 'Vas a recoger a una amiga: Meet me outside the ___. (estación)', 'Miras un mapa: The bus ___ is next to the park. (estación)', 'Llegas andando: It takes ten minutes to reach the ___. (estación)',
    ]),
    target('suitcase', 'suitcase', 'maleta', 'My suitcase is blue. — Mi maleta es azul.', 'Suitcase es una maleta. Ticket es el billete, no el equipaje.', ['station', 'ticket'], [
      'Completa con «maleta»: This ___ is heavy.', 'Preparas el equipaje: Put your clothes in the ___. (maleta)', 'Buscas tu equipaje: There is a red ___ on the belt. (maleta)', 'En el hotel: Leave your ___ in your room. (maleta)',
    ]),
  ] },
  { id: 'yesterday', title: 'Cuenta lo que hiciste ayer', level: 'A2 · pasado', goal: 'Recuperar tres pasados irregulares y usarlos en otra situación.', games: ['irregulares', 'escribe', 'hueco'], items: [
    target('bought', 'bought', 'compré / compró (pasado de buy)', 'Yesterday I bought bread. — Ayer compré pan.', 'Buy cambia a bought en pasado simple; no se añade -ed. El sujeto no cambia esta forma.', ['buyed', 'buy'], [
      'Yesterday Leo ___ a new phone. (buy, pasado simple)', 'Last Friday we ___ the train tickets online. (buy, pasado simple)', 'Maya ___ flowers for her sister last week. (buy, pasado simple)', 'Two days ago I ___ a winter coat. (buy, pasado simple)',
    ]),
    target('went', 'went', 'fui / fue (pasado de go)', 'I went to the market. — Fui al mercado.', 'Go cambia a went en pasado simple. Gone es participio: no sirve aquí sin un auxiliar.', ['gone', 'goed'], [
      'Last night Sam ___ home early. (go, pasado simple)', 'On Sunday my cousins ___ to the beach. (go, pasado simple)', 'Yesterday the class ___ to a museum. (go, pasado simple)', 'Last summer I ___ to Scotland. (go, pasado simple)',
    ]),
    target('saw', 'saw', 'vi / vio (pasado de see)', 'We saw a film yesterday. — Vimos una película ayer.', 'See cambia a saw en pasado simple. Seen es participio; no lo uses aquí sin auxiliar.', ['seen', 'seed'], [
      'Yesterday I ___ your brother. (see, pasado simple)', 'During our walk we ___ a fox. (see, pasado simple)', 'Last Tuesday Ana ___ her doctor. (see, pasado simple)', 'On the trip they ___ the northern lights. (see, pasado simple)',
    ]),
  ] },
  { id: 'modals', title: 'Consejos, capacidad y normas', level: 'A2 · modales', goal: 'Elegir el modal por su intención y recuperarlo sin opciones.', games: ['modales', 'hueco'], items: [
    target('should', 'should', 'debería (modal de consejo, una palabra)', 'You should rest. — Deberías descansar.', 'Should + verbo base da un consejo. Must expresa obligación fuerte; can, capacidad o permiso.', ['must', 'can'], [
      'Da un consejo, no una orden: You ___ drink more water. (modal, una palabra)', 'Un amigo está cansado. Aconséjale: You ___ go to bed earlier. (modal de consejo)', 'Sugiere llevar un mapa: We ___ take a map. (modal de consejo)', 'Recomienda practicar: She ___ practise every day. (modal de consejo)',
    ]),
    target('can', 'can', 'puedo / puede (modal de capacidad presente)', 'I can swim. — Sé nadar.', 'Can + verbo base expresa capacidad presente. No lleva -s con he o she.', ['should', 'must'], [
      'Expresa capacidad presente: My sister ___ speak French. (modal, una palabra)', 'Describe una habilidad: Leo ___ play the piano. (modal de capacidad presente)', 'Describe lo que sabes hacer: I ___ ride a bike. (capacidad presente)', 'Habla de una habilidad: Our teacher ___ speak Japanese. (capacidad presente)',
    ]),
    target('must', 'must', 'debe / debes (modal de obligación fuerte, una palabra)', 'You must wear a helmet. — Debes llevar casco.', 'Must + verbo base expresa aquí una obligación, no una simple recomendación. Have to también expresa obligación, pero tiene dos palabras.', ['can', 'should'], [
      'Expresa obligación fuerte con un modal de una palabra: Visitors ___ show their ID.', 'Es una norma obligatoria: Drivers ___ stop at a red light. (modal de obligación, una palabra)', 'Norma de seguridad: Everyone ___ leave through this exit. (modal de obligación, una palabra)', 'La entrega es obligatoria hoy: You ___ submit the form today. (modal de obligación, una palabra)',
    ]),
  ] },
  { id: 'cafe', title: 'Pide en una cafetería', level: 'A1–A2 · expresiones', goal: 'Recuperar tres expresiones corteses en situaciones distintas.', games: ['frases', 'escribe'], items: [
    target('would-like', "I'd like", 'me gustaría / quisiera (forma contraída)', "I'd like a coffee, please. — Quisiera un café, por favor.", "I'd like = I would like. Es una forma cortés de pedir; I like expresa un gusto habitual. Practicamos la forma contraída.", ['I like', 'I am like'], [
      "Pide un té: ___ a tea, please. (quisiera, forma contraída)", "En una panadería, pide pan: ___ some bread, please. (quisiera, forma contraída)", "En un restaurante: ___ a table for two, please. (quisiera, forma contraída)", "Pide agua: ___ a glass of water, please. (quisiera, forma contraída)",
    ]),
    target('how-much', 'How much', 'cuánto (preguntar un precio)', 'How much is the coffee? — ¿Cuánto cuesta el café?', 'How much pregunta el precio. How many pregunta cuántas unidades hay.', ['How many', 'How old'], [
      'Pregunta el precio: ___ is this sandwich? (cuánto)', 'En una tienda: ___ does this notebook cost? (pregunta el precio)', 'En la taquilla: ___ is a return ticket? (pregunta el precio)', 'Antes de pagar: ___ is the total? (cuánto)',
    ]),
    target('thank-you', 'Thank you', 'gracias (usa dos palabras)', 'Thank you for the coffee. — Gracias por el café.', 'Thank you son dos palabras. Thanks también es correcto, pero aquí recuperamos la expresión de dos palabras.', ['Please', 'Excuse me'], [
      'Agradece la ayuda: ___ for your help. (gracias, dos palabras)', 'Te traen la comida: ___ for the meal. (gracias, dos palabras)', 'Recibes un regalo: ___ for the present. (gracias, dos palabras)', 'Alguien te espera: ___ for waiting. (gracias, dos palabras)',
    ]),
  ] },
  { id: 'false-friends', title: 'Evita tres malentendidos', level: 'A2 · palabras que se confunden', goal: 'Distinguir falsos amigos y utilizarlos con su significado real.', games: ['falsos', 'confusas', 'escribe'], items: [
    target('actually', 'actually', 'en realidad (una palabra)', 'Actually, I live in Madrid. — En realidad, vivo en Madrid.', 'Actually significa en realidad, no actualmente. Para actualmente se usa currently.', ['currently', 'eventually'], [
      'Corrige una suposición: ___, I am from Peru. (en realidad, una palabra)', 'Aclara un dato: The museum is ___ free. (en realidad, una palabra)', 'Corrige el horario: The shop ___ closes at six. (en realidad, una palabra)', 'Matiza una opinión: It is ___ quite easy. (en realidad, una palabra)',
    ]),
    target('library', 'library', 'biblioteca', 'I borrow books from the library. — Tomo libros prestados de la biblioteca.', 'Library es biblioteca. Una librería donde compras libros es bookshop o bookstore.', ['bookshop', 'factory'], [
      'You can borrow books from the ___. (biblioteca)', 'Estudias en silencio: I study at the public ___. (biblioteca)', 'Devuelves un préstamo: Return this book to the ___. (biblioteca)', 'Buscas una sala de lectura: The ___ opens at nine. (biblioteca)',
    ]),
    target('sensible', 'sensible', 'sensato / sensata', 'That is a sensible decision. — Es una decisión sensata.', 'Sensible significa sensato. Sensitive significa sensible emocionalmente o delicado.', ['sensitive', 'sensational'], [
      'Una elección prudente: That is a ___ choice. (sensata)', 'Llevar abrigo con frío: Wearing a coat is ___. (sensato)', 'Reconoce un buen consejo: This is ___ advice. (sensato)', 'Describe un plan prudente: We need a ___ plan. (sensato)',
    ]),
  ] },
  { id: 'listen-cafe', mode: 'listening', title: 'Escucha tu pedido', level: 'A1–A2 · escucha', goal: 'Escuchar un pedido y encontrar el precio, la cantidad y la hora.', games: ['escucha', 'dictado'], items: [
    listeningItem('price', 'Encuentra el precio', 'The coffee costs five pounds. — El café cuesta cinco libras.', 'Busca el precio después de costs o total. Escribe solo el número, en cifras o en inglés; no hace falta la moneda.', [
      ['Pedido inicial: ¿cuántas libras cuesta?','Your lunch costs fifteen pounds.','15|fifteen'],
      ['Escucha y elige el precio, en libras.','The total is fifty pounds.','50|fifty',['15','50','5']],
      ['Otro pedido: escribe el precio en libras.','The sandwiches cost thirteen pounds.','13|thirteen'],
      ['Ahora en una panadería: ¿cuántas libras pagarás?','The bread and cakes cost thirty pounds in total.','30|thirty'],
      ['Repaso en una cafetería: ¿cuántas libras cuesta?','Your breakfast costs eighteen pounds.','18|eighteen'],
      ['Repaso de una cuenta: ¿cuántas libras pagarás?','The total for your group is eighty pounds.','80|eighty'],
    ]),
    listeningItem('quantity', 'Encuentra la cantidad', 'We would like two coffees. — Quisiéramos dos cafés.', 'Escucha el número que acompaña al producto preguntado. Puede haber otros números: no elijas el primero sin comprobar qué cuenta.', [
      ['Pedido inicial: ¿cuántos tés quieren?','We would like three teas and one coffee.','3|three'],
      ['Elige cuántos cafés piden.','Two sandwiches and four coffees, please.','4|four',['2','4','6']],
      ['Otro pedido: escribe cuántos bocadillos piden.','Five sandwiches and two teas, please.','5|five'],
      ['Una mesa nueva: ¿cuántos zumos quieren?','We need six juices and three coffees.','6|six'],
      ['Repaso del pedido: ¿cuántos pasteles piden?','Seven cakes and two coffees, please.','7|seven'],
      ['Repaso de una mesa: ¿cuántos tés quieren?','We would like eight teas and four sandwiches.','8|eight'],
    ]),
    listeningItem('time', 'Encuentra la hora', 'We open at nine. — Abrimos a las nueve.', 'Distingue opens de closes: son la apertura y el cierre. Escribe solo la hora que se pregunta, en cifras o en inglés.', [
      ['Horario inicial: ¿a qué hora abren?','We open at eight and close at six.','8|eight'],
      ['Elige la hora de cierre.','The cafe opens at seven and closes at five.','5|five',['7','5','2']],
      ['Otro horario: escribe la hora de apertura.','Our bakery opens at six and closes at four.','6|six'],
      ['En un restaurante: ¿a qué hora cierran?','The restaurant opens at eleven and closes at ten.','10|ten'],
      ['Repaso del horario: ¿a qué hora abren?','The tea room opens at ten and closes at seven.','10|ten'],
      ['Repaso del cierre: ¿a qué hora cierran?','We open at nine and close at eight.','8|eight'],
    ]),
  ] },
  { id: 'listen-station', mode: 'listening', title: 'Entiende el anuncio de la estación', level: 'A2 · escucha', goal: 'Extraer el andén, la salida y el retraso de anuncios breves.', games: ['escucha', 'dictado'], items: [
    listeningItem('platform', 'Identifica el andén', 'The train leaves from platform two. — El tren sale del andén dos.', 'Platform significa andén. Busca el número del andén, no la hora de salida.', [
      ['Anuncio inicial: ¿de qué andén sale?','The train to York leaves at nine from platform three.','3|three'],
      ['Escucha y elige el andén.','The Oxford train leaves from platform eight at ten.','8|eight',['8','10','18']],
      ['Otro anuncio: escribe el andén.','The train to Bath leaves at eleven from platform five.','5|five'],
      ['Cambio de tren: ¿de qué andén sale el tren a Leeds?','The Leeds service leaves from platform twelve at eight.','12|twelve'],
      ['Repaso del anuncio: ¿cuál es el andén?','The train to Bristol leaves from platform four at seven.','4|four'],
      ['Repaso de otra salida: ¿cuál es el andén?','The train to London leaves at six from platform nine.','9|nine'],
    ]),
    listeningItem('departure', 'Identifica la salida', 'The train leaves at ten. — El tren sale a las diez.', 'Leaves es la salida; arrives, la llegada. Escribe la hora de salida, no la de llegada ni el andén.', [
      ['Horario inicial: ¿a qué hora sale?','The train leaves at seven and arrives at nine.','7|seven'],
      ['Escucha y elige la hora de salida.','The train leaves at eight and arrives at ten.','8|eight',['8','10','18']],
      ['Otro trayecto: escribe la hora de salida.','The train leaves at six and arrives at eight.','6|six'],
      ['Un nuevo viaje: ¿a qué hora sale?','The train arrives at ten. It leaves at nine.','9|nine'],
      ['Repaso de un trayecto: ¿a qué hora sale?','The train leaves at eleven and arrives at twelve.','11|eleven'],
      ['Repaso de otra ruta: ¿a qué hora sale?','Arrival is at seven. The train leaves at five.','5|five'],
    ]),
    listeningItem('delay', 'Identifica el retraso', 'The train is ten minutes late. — El tren lleva diez minutos de retraso.', 'Late y delayed indican retraso. Busca los minutos, no el número del andén. Los números pueden cambiar en cada anuncio.', [
      ['Anuncio inicial: ¿cuántos minutos de retraso hay?','The train on platform two is fifteen minutes late.','15|fifteen'],
      ['Elige los minutos de retraso.','The train on platform five is delayed by fifty minutes.','50|fifty',['5','15','50']],
      ['Otro anuncio: escribe los minutos de retraso.','The service on platform four is thirteen minutes late.','13|thirteen'],
      ['En otra estación: ¿cuántos minutos se retrasa?','The train on platform six is delayed by thirty minutes.','30|thirty'],
      ['Repaso del retraso: ¿cuántos minutos son?','The train on platform three is eighteen minutes late.','18|eighteen'],
      ['Repaso de otro anuncio: ¿cuántos minutos son?','The train on platform eight is delayed by twenty minutes.','20|twenty'],
    ]),
  ] },
];

export const missionById = id => MISSIONS.find(m => m.id === id);
export function recommendMission(missions, sessions = {}, progress = {}, day) {
  const resumed = missions.find(m => validMissionRun(sessions[m.id], m) && !sessions[m.id].completed);
  if (resumed) return { mission: resumed, reason: 'Retoma justo donde lo dejaste.', resumed: true };
  const weak = missions.filter(m => progress[m.id]?.last?.date < day && progress[m.id]?.last?.transfer < 2)
    .sort((a, b) => progress[a.id].last.transfer - progress[b.id].last.transfer || progress[a.id].last.date.localeCompare(progress[b.id].last.date))[0];
  if (weak) return { mission: weak, reason: 'En el último contexto final necesitaste refuerzo. Hoy puedes volver a practicar.' };
  const next = missions.find(m => !progress[m.id]) || [...missions].sort((a, b) => (progress[a.id]?.last?.date || '').localeCompare(progress[b.id]?.last?.date || ''))[0];
  return next ? { mission: next, reason: progress[next.id] ? 'Es la misión que lleva más tiempo sin practicarse.' : 'Prueba un objetivo que aún no has trabajado en la ruta.' } : null;
}
export function newMission(mission, day) {
  return { version: 1, id: mission.id, date: day, i: 0, draft: '', help: false, answers: {},
    steps: [
      ...mission.items.map((_, item) => ({ kind: 'baseline', item })),
      ...mission.items.flatMap((_, item) => [{ kind: 'example', item }, { kind: 'choice', item }]),
      ...mission.items.map((_, item) => ({ kind: 'recall', item })),
      ...mission.items.map((_, item) => ({ kind: 'transfer', item })),
    ],
  };
}
export function validMissionRun(run, mission) {
  return run?.version === 1 && run.id === mission.id && Array.isArray(run.steps) && run.steps.length >= 15 && run.steps.length <= 18
    && Number.isInteger(run.i) && run.i >= 0 && run.i <= run.steps.length && run.answers && typeof run.answers === 'object'
    && run.steps.every(s => s && ['baseline', 'example', 'choice', 'recall', 'retry', 'transfer'].includes(s.kind) && Number.isInteger(s.item) && mission.items[s.item]);
}
export function missionQuestion(mission, step) {
  const item = mission.items[step.item];
  if (step.kind === 'choice') return item.choice || { prompt: `Elige: ${item.meaning}`, accepted: [item.answer], options: item.options };
  return item[step.kind === 'retry' ? 'recall' : step.kind] || item.recall;
}
export function answerMission(run, mission, value, day, unknown = false) {
  if (run.answers[run.i]) return run;
  const step = run.steps[run.i];
  if (!step || step.kind === 'example') return run;
  const question = missionQuestion(mission, step);
  if (question.audio && !run.help && run.listenedTo !== question.audio && !unknown) return run;
  const correct = !unknown && reviewCorrect(question, value);
  return { ...run, draft: value, answers: { ...run.answers, [run.i]: { kind: step.kind, item: step.item, correct, assisted: Boolean(run.help), unknown, date: day } } };
}
export function advanceMission(run) {
  const step = run.steps[run.i];
  if (!step || (step.kind !== 'example' && !run.answers[run.i])) return run;
  const steps = [...run.steps];
  // Interleave one retrieval retry after all three first recall attempts.
  if (step.kind === 'recall' && step.item === 2) {
    const retry = Object.values(run.answers).filter(a => a.kind === 'recall' && (!a.correct || a.assisted)).map(a => ({ kind: 'retry', item: a.item }));
    steps.splice(run.i + 1, 0, ...retry);
  }
  let i = run.i + 1;
  // Known at baseline: avoid an unnecessary multiple-choice question, but keep
  // unaided recall and the final contextual check for everyone.
  if (steps[i]?.kind === 'choice' && Object.values(run.answers).some(a => a.kind === 'baseline' && a.item === steps[i].item && a.correct && !a.assisted)) i++;
  return { ...run, steps, i, help: false, draft: '', listenedTo: null, transcript: false, audioFailed: false };
}
export function missionSummary(run) {
  const answers = Object.values(run.answers);
  const count = kind => answers.filter(a => a.kind === kind && a.correct && !a.assisted).length;
  return { date: run.completed || run.date, baseline: count('baseline'), recall: count('recall'), transfer: count('transfer'), total: 3,
    assisted: answers.filter(a => a.kind !== 'baseline' && a.assisted).length };
}
export function missionCard(mission, item) {
  return { key: `mission|${mission.id}|${item.id}`, game: 'mission', mission: mission.id,
    ...item.recall, explanation: item.explanation, variants: item.variants };
}
