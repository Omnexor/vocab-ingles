/**
 * Verbos modales.
 *
 * Cuestan porque en español se traducen con verbos normales que sí se
 * conjugan ("poder", "deber"), y porque varios comparten traducción pero
 * significan cosas distintas: "must" y "should" son los dos "deber", pero uno
 * es obligación y el otro consejo.
 *
 * Cada ejercicio da una frase con hueco, tres modales y el porqué. Las tres
 * opciones son siempre gramaticalmente posibles: lo que decide es el sentido,
 * que es justo donde está el aprendizaje.
 */
export const MODALES = [
  { modal: "can", es: "poder (capacidad)", pron: "kan", uso: "Capacidad o permiso informal." },
  { modal: "could", es: "podría / podía", pron: "kud", uso: "Pasado de can, posibilidad o petición educada." },
  { modal: "may", es: "poder (permiso formal)", pron: "méi", uso: "Permiso formal o posibilidad." },
  { modal: "might", es: "puede que", pron: "máit", uso: "Posibilidad más floja que may." },
  { modal: "must", es: "deber (obligación)", pron: "mast", uso: "Obligación fuerte o deducción segura." },
  { modal: "should", es: "debería (consejo)", pron: "shud", uso: "Consejo o recomendación." },
  { modal: "would", es: "-ría (condicional)", pron: "uúd", uso: "Condicional y peticiones educadas." },
  { modal: "will", es: "(futuro)", pron: "uil", uso: "Futuro, decisión del momento." },
  { modal: "have to", es: "tener que", pron: "jav tu", uso: "Obligación que viene de fuera." },
];

export const EJERCICIOS_MODALES = [
  {
    frase: "You ___ stop at a red light. It's the law.",
    es: "Tienes que parar en un semáforo rojo. Es la ley.",
    opciones: ["must", "might", "could"],
    correcta: 0,
    why: "Obligación fuerte, y encima legal: must. «Might» es posibilidad y «could» capacidad.",
  },
  {
    frase: "You look tired. You ___ go to bed earlier.",
    es: "Se te ve cansado. Deberías acostarte antes.",
    opciones: ["must", "should", "can"],
    correcta: 1,
    why: "Es un consejo, no una obligación: should. Con «must» sonaría a orden.",
  },
  {
    frase: "___ you speak Japanese?",
    es: "¿Sabes hablar japonés?",
    opciones: ["Can", "Must", "Should"],
    correcta: 0,
    why: "Capacidad: can. Ojo, en español decimos «saber», pero en inglés es can, no «know».",
  },
  {
    frase: "It's cloudy. It ___ rain later.",
    es: "Está nublado. Puede que llueva luego.",
    opciones: ["must", "might", "should"],
    correcta: 1,
    why: "Posibilidad sin seguridad: might. «Must» sería estar convencido.",
  },
  {
    frase: "___ I use your phone, please?",
    es: "¿Puedo usar tu teléfono, por favor?",
    opciones: ["May", "Must", "Will"],
    correcta: 0,
    why: "Permiso educado: may (o could). «Can» también vale, pero es más informal.",
  },
  {
    frase: "I ___ work on Saturdays. It's in my contract.",
    es: "Tengo que trabajar los sábados. Está en mi contrato.",
    opciones: ["have to", "should", "might"],
    correcta: 0,
    why: "Obligación que viene de fuera (el contrato): have to. Must suena a decisión propia.",
  },
  {
    frase: "She isn't answering. She ___ be busy.",
    es: "No contesta. Debe de estar ocupada.",
    opciones: ["must", "should", "can"],
    correcta: 0,
    why: "Deducción lógica: must. En español es «debe de», que se confunde con «debe».",
  },
  {
    frase: "___ you help me with this box?",
    es: "¿Me ayudas con esta caja?",
    opciones: ["Would", "Must", "Might"],
    correcta: 0,
    why: "Petición educada: would (o could). «Must» sería exigir.",
  },
  {
    frase: "When I was young, I ___ run for hours.",
    es: "Cuando era joven, podía correr durante horas.",
    opciones: ["can", "could", "must"],
    correcta: 1,
    why: "Capacidad en pasado: could, el pasado de can.",
  },
  {
    frase: "You ___ smoke here. It's forbidden.",
    es: "No puedes fumar aquí. Está prohibido.",
    opciones: ["mustn't", "shouldn't", "don't have to"],
    correcta: 0,
    why: "Prohibición: mustn't. Ojo: «don't have to» es lo contrario, significa que no hace falta.",
  },
  {
    frase: "It's Sunday, so you ___ get up early.",
    es: "Es domingo, así que no hace falta que madrugues.",
    opciones: ["mustn't", "don't have to", "shouldn't"],
    correcta: 1,
    why: "No hay obligación (pero puedes si quieres): don't have to. «Mustn't» sería prohibirlo.",
  },
  {
    frase: "I ___ have another coffee. I can't sleep at night.",
    es: "No debería tomar otro café. No duermo por la noche.",
    opciones: ["mustn't", "shouldn't", "couldn't"],
    correcta: 1,
    why: "Consejo en negativo: shouldn't. No está prohibido, es que no conviene.",
  },
  {
    frase: "___ you like something to drink?",
    es: "¿Le apetece algo de beber?",
    opciones: ["Would", "Will", "Should"],
    correcta: 0,
    why: "«Would you like…?» es la fórmula fija para ofrecer. Nunca «do you want» si quieres ser educado.",
  },
  {
    frase: "Don't worry, I ___ help you tomorrow.",
    es: "No te preocupes, te ayudaré mañana.",
    opciones: ["will", "would", "might"],
    correcta: 0,
    why: "Decisión que tomas en el momento: will.",
  },
  {
    frase: "He ___ be at home; his car isn't here.",
    es: "No puede estar en casa; su coche no está.",
    opciones: ["mustn't", "can't", "shouldn't"],
    correcta: 1,
    why: "Deducción negativa (es imposible): can't. El contrario de «must be» es «can't be», no «mustn't be».",
  },
  {
    frase: "You ___ have told me! I had no idea.",
    es: "¡Podrías habérmelo dicho! No tenía ni idea.",
    opciones: ["could", "can", "must"],
    correcta: 0,
    why: "Reproche por algo no hecho: could have + participio.",
  },
  {
    frase: "Students ___ use dictionaries during the exam.",
    es: "Los alumnos pueden usar diccionarios durante el examen.",
    opciones: ["may", "might", "would"],
    correcta: 0,
    why: "Permiso en contexto formal: may. «Might» sería posibilidad, no permiso.",
  },
  {
    frase: "I ___ swim when I was five, but now I can.",
    es: "No sabía nadar cuando tenía cinco años, pero ahora sí.",
    opciones: ["can't", "couldn't", "mustn't"],
    correcta: 1,
    why: "Falta de capacidad en pasado: couldn't.",
  },
  {
    frase: "We ___ book a table? The restaurant gets full.",
    es: "¿Deberíamos reservar mesa? El restaurante se llena.",
    opciones: ["Should", "Must", "Can"],
    correcta: 0,
    why: "Pedir consejo o sugerir: should.",
  },
  {
    frase: "If I had more time, I ___ travel more.",
    es: "Si tuviera más tiempo, viajaría más.",
    opciones: ["will", "would", "should"],
    correcta: 1,
    why: "Condicional: would. Es la terminación «-ría» del español.",
  },
];
