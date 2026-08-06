/**
 * Falsos amigos: palabras inglesas que se parecen a una española pero
 * significan otra cosa. Es el error más persistente del hispanohablante,
 * porque la palabra "suena bien" y nadie te corrige.
 *
 * Cada entrada lleva las dos direcciones, que es lo que de verdad arregla el
 * error: qué significa la inglesa, y cómo se dice en inglés la española con
 * la que la confundes.
 *
 *   en / pron / es      la palabra inglesa y lo que significa DE VERDAD
 *   trampa              la palabra española que parece pero no es
 *   real / realPron     cómo se dice "trampa" en inglés
 */
export const FALSOS_AMIGOS = [
  { en: "embarrassed", pron: "imbárasd", es: "avergonzado",
    trampa: "embarazada", real: "pregnant", realPron: "prégnant",
    example: "I was so embarrassed.", exampleEs: "Me dio muchísima vergüenza." },

  { en: "actually", pron: "ákchuali", es: "en realidad",
    trampa: "actualmente", real: "currently", realPron: "kárentli",
    example: "Actually, I disagree.", exampleEs: "En realidad, no estoy de acuerdo." },

  { en: "eventually", pron: "ivénchuali", es: "al final, con el tiempo",
    trampa: "eventualmente", real: "occasionally", realPron: "okéishonali",
    example: "Eventually he agreed.", exampleEs: "Al final acabó aceptando." },

  { en: "carpet", pron: "kárpet", es: "alfombra",
    trampa: "carpeta", real: "folder", realPron: "fóulder",
    example: "Don't walk on the carpet.", exampleEs: "No pises la alfombra." },

  { en: "constipated", pron: "kónstipeited", es: "estreñido",
    trampa: "constipado", real: "to have a cold", realPron: "tu jav a kóuld",
    example: "The medicine made him constipated.", exampleEs: "La medicina le estriñó." },

  { en: "exit", pron: "éksit", es: "salida",
    trampa: "éxito", real: "success", realPron: "saksés",
    example: "Take the second exit.", exampleEs: "Coge la segunda salida." },

  { en: "sensible", pron: "sénsibol", es: "sensato",
    trampa: "sensible", real: "sensitive", realPron: "sénsitiv",
    example: "That's a sensible decision.", exampleEs: "Es una decisión sensata." },

  { en: "sympathetic", pron: "simpazétik", es: "comprensivo",
    trampa: "simpático", real: "friendly", realPron: "fréndli",
    example: "She was very sympathetic.", exampleEs: "Fue muy comprensiva." },

  { en: "realize", pron: "ríalais", es: "darse cuenta",
    trampa: "realizar", real: "to carry out", realPron: "tu kári áut",
    example: "I didn't realize you were here.", exampleEs: "No me di cuenta de que estabas aquí." },

  { en: "assist", pron: "asíst", es: "ayudar",
    trampa: "asistir (a un sitio)", real: "to attend", realPron: "tu aténd",
    example: "Can you assist me?", exampleEs: "¿Puedes ayudarme?" },

  { en: "support", pron: "sopórt", es: "apoyar",
    trampa: "soportar (aguantar)", real: "to put up with", realPron: "tu put ap uid",
    example: "We support your idea.", exampleEs: "Apoyamos tu idea." },

  { en: "library", pron: "láibrari", es: "biblioteca",
    trampa: "librería", real: "bookstore", realPron: "búkstor",
    example: "I study at the library.", exampleEs: "Estudio en la biblioteca." },

  { en: "large", pron: "lartch", es: "grande",
    trampa: "largo", real: "long", realPron: "long",
    example: "A large coffee, please.", exampleEs: "Un café grande, por favor." },

  { en: "fabric", pron: "fábrik", es: "tela",
    trampa: "fábrica", real: "factory", realPron: "fáktori",
    example: "This fabric is soft.", exampleEs: "Esta tela es suave." },

  { en: "introduce", pron: "introdiúus", es: "presentar (a alguien)",
    trampa: "introducir (meter)", real: "to insert", realPron: "tu insért",
    example: "Let me introduce my colleague.", exampleEs: "Déjame presentarte a mi compañero." },

  { en: "remove", pron: "rimúuv", es: "quitar",
    trampa: "remover (revolver)", real: "to stir", realPron: "tu ster",
    example: "Remove your shoes here.", exampleEs: "Quítate los zapatos aquí." },

  { en: "resume", pron: "risiúum", es: "reanudar",
    trampa: "resumir", real: "to summarize", realPron: "tu sámaraiz",
    example: "Let's resume the meeting.", exampleEs: "Reanudemos la reunión." },

  { en: "pretend", pron: "priténd", es: "fingir",
    trampa: "pretender", real: "to intend", realPron: "tu inténd",
    example: "He pretended to be asleep.", exampleEs: "Fingió estar dormido." },

  { en: "record", pron: "rikórd", es: "grabar",
    trampa: "recordar", real: "to remember", realPron: "tu rimémber",
    example: "They recorded the concert.", exampleEs: "Grabaron el concierto." },

  { en: "advertisement", pron: "advértisment", es: "anuncio (publicidad)",
    trampa: "advertencia", real: "warning", realPron: "uórning",
    example: "I saw the advertisement online.", exampleEs: "Vi el anuncio en internet." },

  { en: "argument", pron: "árguiument", es: "discusión, pelea",
    trampa: "argumento (de una obra)", real: "plot", realPron: "plot",
    example: "They had a big argument.", exampleEs: "Tuvieron una buena discusión." },

  { en: "compromise", pron: "kómpromais", es: "acuerdo con cesiones",
    trampa: "compromiso (obligación)", real: "commitment", realPron: "kamítment",
    example: "We reached a compromise.", exampleEs: "Llegamos a un acuerdo." },

  { en: "deception", pron: "disépshon", es: "engaño",
    trampa: "decepción", real: "disappointment", realPron: "disapóintment",
    example: "It was a deliberate deception.", exampleEs: "Fue un engaño deliberado." },

  { en: "quiet", pron: "kuáiet", es: "callado, silencioso",
    trampa: "quieto", real: "still", realPron: "stil",
    example: "Please be quiet.", exampleEs: "Por favor, callaos." },

  { en: "rope", pron: "róup", es: "cuerda",
    trampa: "ropa", real: "clothes", realPron: "klóuds",
    example: "Tie it with a rope.", exampleEs: "Átalo con una cuerda." },

  { en: "soap", pron: "sóup", es: "jabón",
    trampa: "sopa", real: "soup", realPron: "suup",
    example: "There's no soap left.", exampleEs: "No queda jabón." },

  { en: "lecture", pron: "lékcher", es: "clase, conferencia",
    trampa: "lectura", real: "reading", realPron: "ríiding",
    example: "The lecture starts at ten.", exampleEs: "La clase empieza a las diez." },

  { en: "parents", pron: "pérents", es: "padres",
    trampa: "parientes", real: "relatives", realPron: "rélativs",
    example: "My parents live in Cádiz.", exampleEs: "Mis padres viven en Cádiz." },

  { en: "college", pron: "kólich", es: "universidad",
    trampa: "colegio", real: "school", realPron: "skuul",
    example: "She's still at college.", exampleEs: "Todavía está en la universidad." },

  { en: "conductor", pron: "kondáktor", es: "director de orquesta, revisor",
    trampa: "conductor", real: "driver", realPron: "dráiver",
    example: "The conductor raised his arms.", exampleEs: "El director levantó los brazos." },

  { en: "casualty", pron: "káshualti", es: "víctima, herido",
    trampa: "casualidad", real: "coincidence", realPron: "kouínsidens",
    example: "There were no casualties.", exampleEs: "No hubo víctimas." },

  { en: "idiom", pron: "ídiom", es: "modismo, expresión hecha",
    trampa: "idioma", real: "language", realPron: "lánguich",
    example: "That's a common English idiom.", exampleEs: "Es un modismo inglés muy común." },

  { en: "billion", pron: "bílion", es: "mil millones",
    trampa: "billón", real: "trillion", realPron: "trílion",
    example: "The company is worth a billion.", exampleEs: "La empresa vale mil millones." },

  { en: "bland", pron: "bland", es: "soso, sin sabor",
    trampa: "blando", real: "soft", realPron: "soft",
    example: "The soup is a bit bland.", exampleEs: "La sopa está algo sosa." },

  { en: "facility", pron: "fasíliti", es: "instalación",
    trampa: "facilidad", real: "ease", realPron: "iis",
    example: "The sports facility is new.", exampleEs: "La instalación deportiva es nueva." },

  { en: "topic", pron: "tópik", es: "tema",
    trampa: "tópico (cliché)", real: "cliché", realPron: "klishéi",
    example: "Let's change the topic.", exampleEs: "Cambiemos de tema." },

  { en: "ultimately", pron: "áltimatli", es: "en última instancia",
    trampa: "últimamente", real: "lately", realPron: "léitli",
    example: "Ultimately, it's your choice.", exampleEs: "En última instancia, tú decides." },

  { en: "contest", pron: "kóntest", es: "concurso",
    trampa: "contestar", real: "to answer", realPron: "tu ánser",
    example: "She won the contest.", exampleEs: "Ganó el concurso." },

  { en: "dinner", pron: "díner", es: "cena",
    trampa: "dinero", real: "money", realPron: "máni",
    example: "Dinner is ready.", exampleEs: "La cena está lista." },

  { en: "once", pron: "uáns", es: "una vez",
    trampa: "once (el número 11)", real: "eleven", realPron: "iléven",
    example: "I go once a week.", exampleEs: "Voy una vez por semana." },

  { en: "actual", pron: "ákchual", es: "real, verdadero",
    trampa: "actual (de ahora)", real: "current", realPron: "kárent",
    example: "What's the actual cost?", exampleEs: "¿Cuál es el coste real?" },

  { en: "terrific", pron: "terífik", es: "estupendo",
    trampa: "terrorífico", real: "terrifying", realPron: "térifaiing",
    example: "You did a terrific job.", exampleEs: "Has hecho un trabajo estupendo." },

  { en: "balloon", pron: "balúun", es: "globo",
    trampa: "balón", real: "ball", realPron: "bol",
    example: "The child wants a balloon.", exampleEs: "El niño quiere un globo." },

  { en: "cartoon", pron: "kartúun", es: "dibujos animados",
    trampa: "cartón", real: "cardboard", realPron: "kárdbord",
    example: "The kids are watching cartoons.", exampleEs: "Los niños ven dibujos animados." },

  { en: "choke", pron: "chóuk", es: "atragantarse, ahogar",
    trampa: "chocar", real: "to crash", realPron: "tu krash",
    example: "He choked on a bone.", exampleEs: "Se atragantó con una espina." },

  { en: "collar", pron: "kólar", es: "cuello (de camisa)",
    trampa: "collar", real: "necklace", realPron: "néklas",
    example: "Your collar is dirty.", exampleEs: "Tienes el cuello sucio." },

  { en: "curse", pron: "kers", es: "maldición",
    trampa: "curso", real: "course", realPron: "kors",
    example: "It sounded like a curse.", exampleEs: "Sonó como una maldición." },

  { en: "desert", pron: "désert", es: "desierto",
    trampa: "postre", real: "dessert", realPron: "disért",
    example: "They crossed the desert.", exampleEs: "Cruzaron el desierto." },

  { en: "disgust", pron: "disgást", es: "asco, repugnancia",
    trampa: "disgusto", real: "upset", realPron: "apsét",
    example: "She looked at it with disgust.", exampleEs: "Lo miró con asco." },

  { en: "familiar", pron: "famílier", es: "conocido, familiar (de sonarte)",
    trampa: "familiar (pariente)", real: "relative", realPron: "rélativ",
    example: "Your face looks familiar.", exampleEs: "Tu cara me suena." },

  { en: "gracious", pron: "gréishos", es: "cortés, amable",
    trampa: "gracioso", real: "funny", realPron: "fáni",
    example: "That was a gracious gesture.", exampleEs: "Fue un gesto muy cortés." },

  { en: "involve", pron: "invólv", es: "implicar, conllevar",
    trampa: "envolver", real: "to wrap", realPron: "tu rap",
    example: "The job involves traveling.", exampleEs: "El trabajo implica viajar." },

  { en: "jam", pron: "yam", es: "mermelada",
    trampa: "jamón", real: "ham", realPron: "jam",
    example: "Toast with jam, please.", exampleEs: "Tostada con mermelada, por favor." },

  { en: "mayor", pron: "méier", es: "alcalde",
    trampa: "mayor (más grande)", real: "bigger", realPron: "bíguer",
    example: "The mayor gave a speech.", exampleEs: "El alcalde dio un discurso." },

  { en: "notice", pron: "nóutis", es: "darse cuenta, aviso",
    trampa: "noticia", real: "news", realPron: "niús",
    example: "I didn't notice the sign.", exampleEs: "No me di cuenta de la señal." },

  { en: "preservative", pron: "prisérvativ", es: "conservante",
    trampa: "preservativo", real: "condom", realPron: "kóndom",
    example: "No artificial preservatives.", exampleEs: "Sin conservantes artificiales." },

  { en: "scholar", pron: "skólar", es: "erudito, estudioso",
    trampa: "escolar (alumno)", real: "schoolchild", realPron: "skúulchaild",
    example: "He's a respected scholar.", exampleEs: "Es un erudito respetado." },

  { en: "signature", pron: "sígnacher", es: "firma",
    trampa: "asignatura", real: "subject", realPron: "sábyekt",
    example: "I need your signature here.", exampleEs: "Necesito tu firma aquí." },

  { en: "target", pron: "tárguet", es: "objetivo, diana",
    trampa: "tarjeta", real: "card", realPron: "kard",
    example: "We hit our sales target.", exampleEs: "Alcanzamos nuestro objetivo de ventas." },

  { en: "vase", pron: "vaas", es: "jarrón",
    trampa: "vaso", real: "glass", realPron: "glas",
    example: "Put the flowers in the vase.", exampleEs: "Pon las flores en el jarrón." },

  { en: "misery", pron: "mísari", es: "sufrimiento, desdicha",
    trampa: "miseria (pobreza)", real: "poverty", realPron: "póverti",
    example: "He lived in misery for years.", exampleEs: "Vivió años de sufrimiento." },

  { en: "estate", pron: "istéit", es: "finca, propiedad",
    trampa: "estado", real: "state", realPron: "stéit",
    example: "They sold the family estate.", exampleEs: "Vendieron la finca familiar." },

  { en: "grocery", pron: "gróusari", es: "tienda de comestibles",
    trampa: "grosería", real: "rude remark", realPron: "ruud rimárk",
    example: "I'm going to the grocery store.", exampleEs: "Voy a la tienda de comestibles." },

  { en: "regular", pron: "réguiular", es: "habitual, normal",
    trampa: "regular (así así)", real: "so-so", realPron: "sóu sóu",
    example: "He's a regular customer.", exampleEs: "Es un cliente habitual." },

  { en: "camp", pron: "kamp", es: "campamento",
    trampa: "campo", real: "field", realPron: "fiild",
    example: "We stayed at a summer camp.", exampleEs: "Estuvimos en un campamento de verano." },
];

export const totalFalsosAmigos = () => FALSOS_AMIGOS.length;
