import { shuffled } from './learning-engine.js';

// Opciones canónicas: la primera es correcta. La sesión reparte las posiciones.
// Las referencias son números de frase (base 1) de readings.js y stories.js.
const question = (kind, q, options, lines, why) => ({ kind, q, options, lines, why });
export const READING_QUESTIONS = {
  'la-maleta': [
    question('Idea principal', '¿Qué desencadena la historia?', ['El narrador se lleva por error la maleta de otra persona.', 'El narrador pierde su vuelo y busca alojamiento.', 'Anna compra una maleta nueva en el aeropuerto.'], [2, 5, 11], 'La ropa no es suya y Anna tiene su maleta: las dos maletas están intercambiadas.'),
    question('Detalle', '¿Cómo consigue contactar con Anna?', ['Encuentra su nombre y teléfono en la etiqueta.', 'Pide su dirección a la estación.', 'Encuentra una carta dentro de la caja azul.'], [7, 8, 9], 'El narrador mira la etiqueta del asa, encuentra el teléfono y la llama.'),
    question('Inferencia', '¿Qué indica que el anillo tenía un valor personal para Anna?', ['Buscó durante dos años el mismo modelo que había perdido su madre.', 'Lo compró porque era el anillo más caro de la tienda.', 'Lo llevaba para venderlo a un desconocido en la cafetería.'], [16, 17, 18], 'El esfuerzo por recuperar el modelo perdido por su madre sugiere un valor sentimental; el precio no aparece en el texto.'),
  ],
  'ultimo-cliente': [
    question('Idea principal', '¿Qué conecta el final con la historia de Carmen?', ['Marta empieza a guardar una barra para el hombre, como hacía Carmen.', 'Marta decide cerrar la panadería para siempre.', 'El hombre compra la panadería de Carmen.'], [8, 16, 17], 'Marta continúa el gesto de Carmen y la visita pasa a formar parte de su rutina.'),
    question('Detalle', '¿Por qué Carmen le guardaba pan?', ['Él terminaba de trabajar tarde.', 'Él no podía comer pan recién hecho.', 'Él trabajaba en esa panadería.'], [8], 'La frase explica directamente que terminaba tarde de trabajar.'),
    question('Inferencia', 'Al entrar, ¿qué parece importarle al hombre más que comprar pan?', ['Saber de Carmen, a quien recordaba.', 'Preguntar por una oferta del día.', 'Protestar por el horario de cierre.'], [4, 5], 'No mira el pan; pregunta por Carmen. Ese contraste señala el motivo de su visita.'),
  ],
  'la-nota': [
    question('Idea principal', '¿Cómo termina la búsqueda sobre la nota?', ['El narrador consigue algunas pistas, pero la historia queda abierta.', 'El narrador identifica al destinatario y le entrega la nota.', 'El librero explica por completo por qué se distanció de su hermano.'], [15, 17, 19, 20], 'Quedan preguntas sin resolver y el narrador valora no conocer todo el final.'),
    question('Detalle', '¿Qué le lleva a preguntar en una librería de Valencia?', ['Un sello dentro de la cubierta y un viaje que ya tenía previsto.', 'Una dirección escrita junto a la firma de la nota.', 'Una llamada del hermano del librero.'], [4, 9, 10], 'La nota no tiene nombre ni fecha. La pista es el sello de la librería y ya iba a viajar a Valencia.'),
    question('Inferencia', '¿Qué se puede afirmar sobre la reacción del librero?', ['No se queda la nota, aunque toma una foto.', 'Rompe la nota porque reconoce al destinatario.', 'Confirma que la nota fue escrita para él.'], [16, 17, 18], 'Su reacción es ambivalente: rechaza quedarse el papel, pero fotografía la nota. No explica todo lo que piensa.'),
  ],
  'habitacion-12': [
    question('Idea principal', '¿Cuál era la explicación del ruido nocturno?', ['Un radiador cuyo metal se expandía al encenderse la calefacción.', 'Un huésped que movía muebles en la habitación.', 'Una persona que golpeaba la puerta a las tres.'], [12, 13, 14], 'La habitación no tenía muebles. El ruido procedía del radiador al encenderse la calefacción.'),
    question('Detalle', '¿Qué hace el narrador la tercera noche?', ['Sube a llamar a la puerta y nadie responde.', 'Pide la llave y entra directamente en la habitación.', 'Cambia de hotel sin hablar con recepción.'], [7, 8, 9, 10], 'Primero llama a la puerta. Pide la llave a la mañana siguiente, no esa noche.'),
    question('Significado en contexto', '¿Cómo se siente al descubrir la causa?', ['Aliviado y un poco decepcionado a la vez.', 'Tan asustado como antes, sin ningún alivio.', 'Enfadado porque la habitación estaba ocupada.'], [15], '«Relieved» significa aliviado y «disappointed», decepcionado. Las dos emociones aparecen juntas.'),
  ],
  'el-gato': [
    question('Idea principal', '¿Qué descubre la familia sobre el gato?', ['Tiene dueño y consigue comida en varias casas.', 'Lleva meses perdido y nadie sabe su nombre.', 'Solo visita una casa porque no tiene comida.'], [11, 15, 17], 'Las notas revelan que come en casa y también visita el número 14: tiene varias familias que lo alimentan.'),
    question('Detalle', '¿Qué pide la primera nota del collar?', ['Que no le den comida, porque ya come dos veces en casa.', 'Que cambien su nombre a Tomate.', 'Que lo lleven al veterinario al día siguiente.'], [11], 'La nota identifica al gato como Otto y pide que no lo alimenten.'),
    question('Inferencia', '¿Qué sugieren la última frase y el comportamiento de la familia?', ['Siguen tratándolo con cariño como parte de su propia casa.', 'Han decidido que no vuelva a entrar nunca.', 'Ya no reconocen al gato cuando aparece.'], [16, 18], 'Siguen dándole comida y la hija continúa llamándolo Tomate, el nombre que le pusieron.'),
  ],
  'la-entrevista': [
    question('Idea principal', 'Según la explicación final, ¿qué destacó de la persona entrevistada?', ['Admitió que no sabía algo.', 'Afirmó dominar todas las tecnologías.', 'Fue la única que prometió aprender rápido.'], [18, 19, 20], 'La jefa distingue la sinceridad de admitir una laguna de la promesa habitual de aprender rápido.'),
    question('Detalle', '¿Qué problema de trabajar allí mencionó un entrevistador?', ['Los plazos eran a menudo poco realistas.', 'No había conexiones de tren a la oficina.', 'Las entrevistas siempre empezaban a las ocho.'], [13, 14, 15], 'Al preguntar por lo más difícil, el entrevistador menciona los plazos poco realistas.'),
    question('Significado en contexto', '¿Qué significa «I could have made something up» en este contexto?', ['Podría haber inventado una respuesta.', 'Podría haber construido una tecnología allí mismo.', 'Podría haber recuperado el tren cancelado.'], [7, 8, 9], 'Ante una tecnología desconocida, considera inventar una respuesta, pero decide reconocer que no la conoce.'),
  ],
  'primer-dia': [
    question('Idea principal', '¿Cómo describe su primer día de trabajo?', ['Difícil al principio, con un momento más fácil al hablar con un compañero.', 'Perfecto desde el principio, porque entendía todo.', 'Aburrido porque no habló con nadie en todo el día.'], [5, 7, 8, 9], 'No comprende a su jefa, pero encuentra una conversación más sencilla durante la comida.'),
    question('Detalle', '¿Por qué llega temprano?', ['Porque está nervioso.', 'Porque su jefa le pide abrir la oficina.', 'Porque tiene una reunión antes de trabajar.'], [2], '«Because I was nervous» da el motivo de llegar temprano.'),
    question('Significado en contexto', '¿A qué se refiere «That was the easy part»?', ['A hablar sobre comida con un compañero.', 'A entender a la jefa cuando hablaba rápido.', 'A esperar fuera veinte minutos.'], [7, 8, 9], '«That» retoma la conversación sobre comida de la frase anterior.'),
  ],
  'vuelo-retrasado': [
    question('Idea principal', '¿Qué resume mejor lo sucedido?', ['Un retraso causa molestias, pero finalmente llegan bien.', 'El vuelo se cancela y no consiguen viajar.', 'El viaje transcurre sin esperas ni dificultades.'], [1, 8, 10], 'El vuelo se retrasa tres horas y llegan a medianoche, cansados pero bien.'),
    question('Detalle', '¿Dónde encuentra un enchufe para el móvil?', ['Detrás de una máquina.', 'Debajo de su asiento en el avión.', 'Dentro del mostrador de información.'], [6, 7], 'La batería está casi agotada y encuentra un enchufe detrás de una máquina.'),
    question('Inferencia', '¿Por qué se sienta en el suelo?', ['El aeropuerto está lleno y no quedan asientos libres.', 'Le han ordenado sentarse junto a la puerta de embarque.', 'Prefiere el suelo porque su vuelo ya está embarcando.'], [4, 5], 'La falta de asientos libres explica que se siente en el suelo junto a la maleta.'),
  ],
  'vecino-ruidoso': [
    question('Idea principal', '¿Cómo se resuelve el problema del ruido?', ['Hablan directamente y el vecino empieza a usar auriculares.', 'El narrador se muda a otro edificio.', 'El edificio prohíbe toda la música.'], [4, 8, 9], 'La conversación directa lleva a una solución sencilla: auriculares después de las once.'),
    question('Detalle', '¿Qué no sabía el vecino?', ['Que las paredes eran tan finas.', 'Que era sábado por la mañana.', 'Que la música estaba prohibida en el edificio.'], [7], 'El vecino dice que no tenía ni idea de lo finas que eran las paredes.'),
    question('Inferencia', '¿Qué sugiere «which surprised me»?', ['El narrador no esperaba que el vecino fuera tan amable.', 'El narrador ya sabía que el vecino no estaba en casa.', 'El narrador se sorprendió de que fuera medianoche.'], [5, 6], 'Lo que le sorprende es la amabilidad del vecino al hablar con él.'),
  ],
  'aprender-idioma': [
    question('Idea principal', '¿Qué problema identifica el narrador en su aprendizaje?', ['Aprobaba exámenes, pero apenas practicaba hablar.', 'Nunca había estudiado gramática ni hecho exámenes.', 'Le resultaba imposible leer cualquier texto.'], [2, 3, 4], 'Contrasta aprobar exámenes con no poder pedir un café y explica que nunca hablaba.'),
    question('Detalle', '¿Qué intenta hacer ahora todos los días?', ['Escuchar algo en inglés.', 'Hacer tres horas de ejercicios escritos.', 'Dejar de escuchar a hablantes nativos.'], [8], 'El cambio que describe es escuchar algo cada día.'),
    question('Significado en contexto', '¿Por qué dice que leer era más fácil?', ['Tenía tiempo para pensar.', 'Todos los textos estaban traducidos.', 'Solo leía palabras que ya conocía.'], [5, 6], 'La lectura le da tiempo para pensar, a diferencia de la dificultad que describe al escuchar.'),
  ],
  'reunion': [
    question('Idea principal', '¿Qué valoración hace el narrador de la reunión?', ['Podría haberse sustituido por un correo.', 'Fue imprescindible para resolver el plazo ese día.', 'Fue útil porque todos estuvieron de acuerdo desde el inicio.'], [7, 8], 'Aplazan la conversación a la semana siguiente y el narrador concluye que bastaba un correo.'),
    question('Detalle', '¿A qué hora empezó realmente?', ['A las nueve y media.', 'A las nueve en punto.', 'A las diez y media.'], [1], 'Estaba prevista para las nueve, pero «half past» indica media hora después.'),
    question('Significado en contexto', '¿Qué hace el grupo cuando se menciona el plazo poco realista?', ['Evita tratar el problema y pasa a otro tema.', 'Ajusta el plazo inmediatamente.', 'Cancela el proyecto en ese momento.'], [5, 6, 7], '«Nobody wanted to deal with that» y «we moved on» indican que evitan ocuparse del problema.'),
  ],
  'mudanza': [
    question('Idea principal', '¿Cómo valora finalmente la mudanza?', ['Fue difícil, pero mereció la pena.', 'Fue muy sencilla y no requirió esfuerzo.', 'Se arrepiente y decide volver al piso anterior.'], [7, 8, 9], 'Tras describir el esfuerzo, menciona el sol de la mañana y concluye que valió la pena.'),
    question('Detalle', '¿Qué hacen para que pase la mesa por la puerta?', ['Le quitan las patas.', 'Quitan la puerta del ascensor.', 'La dejan en el piso anterior.'], [4, 5], 'Los muebles no caben por la puerta y tienen que desmontar las patas de la mesa.'),
    question('Inferencia', '¿Por qué tienen que subir cajas por las escaleras?', ['El ascensor se estropea en el segundo viaje.', 'El piso no tiene ascensor desde el principio.', 'Todas las cajas son demasiado grandes para el ascensor.'], [6, 7], 'El ascensor se avería; por eso describe el esfuerzo de subir las cajas cuatro pisos.'),
  ],
  'malentendido': [
    question('Idea principal', '¿Qué riesgo ilustra el texto?', ['Elegir palabras inglesas por su parecido con palabras españolas.', 'Evitar todas las palabras que resulten familiares.', 'Hablar demasiado despacio en las reuniones.'], [9, 10], 'Las palabras parecen correctas porque resultan familiares, pero ese parecido puede engañar.'),
    question('Detalle', '¿Qué quería pedir quien dijo «carpet»?', ['La carpeta con los documentos.', 'Una alfombra nueva para la sala.', 'El plan que se había llevado a cabo.'], [6, 7, 8], 'Quería una carpeta, «folder», pero «carpet» se entiende como alfombra y todos miran al suelo.'),
    question('Detalle', '¿El narrador usó «embarrassed» por error?', ['No; aclara que era la palabra que quería usar.', 'Sí; quería decir que estaba embarazado.', 'No lo dice y no ofrece ninguna aclaración.'], [1, 2], '«Luckily that was the word I meant» confirma que, en ese caso, sí era la palabra que pretendía usar.'),
  ],
  'habito': [
    question('Idea principal', 'Según el texto, ¿qué conviene priorizar al crear un hábito?', ['Una práctica pequeña que se pueda mantener.', 'Sesiones muy largas desde el primer día.', 'Esperar a tener un día totalmente libre.'], [4, 5, 8, 9], 'El texto propone una práctica sostenible y destaca la continuidad.'),
    question('Detalle', '¿Qué sucede en el ejemplo de estudiar dos horas al día?', ['Un día ocupado interrumpe la rutina y la persona abandona.', 'La persona mantiene ese horario durante muchos años.', 'La persona empieza estudiando solo cinco minutos.'], [2, 3], 'El ejemplo muestra una semana de cumplimiento, seguida de un día ocupado y abandono.'),
    question('Significado en contexto', '¿Qué condición añade «provided that you actually keep going»?', ['Que realmente se siga practicando.', 'Que se duplique el tiempo cada semana.', 'Que nunca aparezca un día ocupado.'], [9], '«Provided that» introduce una condición: continuar de verdad con la práctica.'),
  ],
};

export const READING_CHECK_VERSION = 1;
const validSummary = s => s && s.total === 3 && ['independent', 'assisted', 'wrong', 'unknown'].every(k => Number.isInteger(s[k]) && s[k] >= 0)
  && s.independent + s.assisted + s.wrong + s.unknown === 3;

export function newReadingCheck(id, first = null, random = Math.random) {
  if (!READING_QUESTIONS[id]) return null;
  const answers = shuffled([0, 1, 2], random);
  return { version: READING_CHECK_VERSION, id, position: 0, responses: [], helped: [false, false, false],
    first: validSummary(first) ? { ...first } : null,
    order: answers.map(answer => {
      const options = shuffled([1, 2], random);
      options.splice(answer, 0, 0);
      return options;
    }) };
}

export function validReadingCheck(s, id) {
  return !!READING_QUESTIONS[id] && s?.version === READING_CHECK_VERSION && s.id === id
    && Number.isInteger(s.position) && s.position >= 0 && s.position <= 3
    && Array.isArray(s.responses) && s.responses.length <= 3 && [s.position, s.position + 1].includes(s.responses.length)
    && s.responses.every(x => x === null || Number.isInteger(x) && x >= 0 && x < 3)
    && Array.isArray(s.helped) && s.helped.length === 3 && s.helped.every(x => typeof x === 'boolean')
    && Array.isArray(s.order) && s.order.length === 3 && s.order.every(row => Array.isArray(row) && row.length === 3
      && new Set(row).size === 3 && row.every(x => [0, 1, 2].includes(x)))
    && (s.first === null || validSummary(s.first));
}

export function readingCheckSummary(s) {
  const result = { total: 3, independent: 0, assisted: 0, wrong: 0, unknown: 0 };
  s.responses.forEach((response, i) => {
    if (response === null) result.unknown++;
    else if (s.order[i][response] !== 0) result.wrong++;
    else result[s.helped[i] ? 'assisted' : 'independent']++;
  });
  return result;
}

export function supportReadingCheck(s) {
  if (s.position >= 3 || s.responses.length !== s.position) return s;
  return { ...s, helped: s.helped.map((value, i) => i === s.position || value) };
}

export function answerReadingCheck(s, choice) {
  if (s.position >= 3 || s.responses.length !== s.position || !(choice === null || Number.isInteger(choice) && choice >= 0 && choice < 3)) return s;
  return { ...s, responses: [...s.responses, choice] };
}

export function advanceReadingCheck(s) {
  if (s.position >= 3 || s.responses.length !== s.position + 1) return s;
  return { ...s, position: s.position + 1, first: s.position === 2 && !s.first ? readingCheckSummary(s) : s.first };
}

// Review only completed attempts: never expose a future answer in an active check.
export function readingCheckReview(s, id) {
  if (!validReadingCheck(s, id) || s.position !== 3) return [];
  const priority = { wrong: 0, unknown: 1, assisted: 2, independent: 3 };
  return READING_QUESTIONS[id].map((question, index) => {
    const response = s.responses[index];
    const outcome = response === null ? 'unknown' : s.order[index][response] !== 0 ? 'wrong' : s.helped[index] ? 'assisted' : 'independent';
    return { index, question, outcome, selected: response === null ? null : question.options[s.order[index][response]] };
  }).sort((a, b) => priority[a.outcome] - priority[b.outcome] || a.index - b.index);
}

export function readingCheckState(s, id) {
  if (!validReadingCheck(s, id)) return { mode: 'none', label: 'Comprensión sin practicar', action: null };
  if (s.position < 3) return { mode: 'active', label: `Comprensión · ${s.position} de 3 revisadas`, action: 'Continuar comprobación' };
  const { independent, assisted, wrong, unknown } = readingCheckSummary(s);
  const needs = wrong + unknown;
  return { mode: needs ? 'reinforce' : 'complete',
    label: needs ? `${needs} ${needs === 1 ? 'respuesta para reforzar' : 'respuestas para reforzar'}` : assisted ? `${assisted} ${assisted === 1 ? 'acierto con apoyo' : 'aciertos con apoyo'} · ${independent} sin consultar` : '3 aciertos sin consultar · este intento',
    action: needs ? 'Revisar respuestas' : 'Ver comprobación' };
}
