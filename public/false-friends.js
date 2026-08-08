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
  { en: "embarrassed", pron: "im-bá-rasd", es: "avergonzado",
    trampa: "embarazada", real: "pregnant", realPron: "prég-nant",
    example: "I was so embarrassed.", exampleEs: "Me dio muchísima vergüenza." },

  { en: "actually", pron: "ák-chua-li", es: "en realidad",
    trampa: "actualmente", real: "currently", realPron: "ká-rent-li",
    example: "Actually, I disagree.", exampleEs: "En realidad, no estoy de acuerdo." },

  { en: "eventually", pron: "i-vén-chua-li", es: "al final, con el tiempo",
    trampa: "eventualmente", real: "occasionally", realPron: "o-kéi-sho-na-li",
    example: "Eventually he agreed.", exampleEs: "Al final acabó aceptando." },

  { en: "carpet", pron: "kár-pet", es: "alfombra",
    trampa: "carpeta", real: "folder", realPron: "fóul-der",
    example: "Don't walk on the carpet.", exampleEs: "No pises la alfombra." },

  { en: "constipated", pron: "kóns-ti-pei-ted", es: "estreñido",
    trampa: "constipado", real: "to have a cold", realPron: "tu jav a kóuld",
    example: "The medicine made him constipated.", exampleEs: "La medicina le estriñó." },

  { en: "exit", pron: "ék-sit", es: "salida",
    trampa: "éxito", real: "success", realPron: "sak-sés",
    example: "Take the second exit.", exampleEs: "Coge la segunda salida." },

  { en: "sensible", pron: "sén-si-bol", es: "sensato",
    trampa: "sensible", real: "sensitive", realPron: "sén-si-tiv",
    example: "That's a sensible decision.", exampleEs: "Es una decisión sensata." },

  { en: "sympathetic", pron: "sim-pa-zé-tik", es: "comprensivo",
    trampa: "simpático", real: "friendly", realPron: "frénd-li",
    example: "She was very sympathetic.", exampleEs: "Fue muy comprensiva." },

  { en: "realize", pron: "rí-a-lais", es: "darse cuenta",
    trampa: "realizar", real: "to carry out", realPron: "tu ká-ri áut",
    example: "I didn't realize you were here.", exampleEs: "No me di cuenta de que estabas aquí." },

  { en: "assist", pron: "a-síst", es: "ayudar",
    trampa: "asistir (a un sitio)", real: "to attend", realPron: "tu a-ténd",
    example: "Can you assist me?", exampleEs: "¿Puedes ayudarme?" },

  { en: "support", pron: "so-pórt", es: "apoyar",
    trampa: "soportar (aguantar)", real: "to put up with", realPron: "tu put ap uid",
    example: "We support your idea.", exampleEs: "Apoyamos tu idea." },

  { en: "library", pron: "lái-bra-ri", es: "biblioteca",
    trampa: "librería", real: "bookstore", realPron: "búks-tor",
    example: "I study at the library.", exampleEs: "Estudio en la biblioteca." },

  { en: "large", pron: "lartch", es: "grande",
    trampa: "largo", real: "long", realPron: "long",
    example: "A large coffee, please.", exampleEs: "Un café grande, por favor." },

  { en: "fabric", pron: "fá-brik", es: "tela",
    trampa: "fábrica", real: "factory", realPron: "fák-to-ri",
    example: "This fabric is soft.", exampleEs: "Esta tela es suave." },

  { en: "introduce", pron: "in-tro-diúus", es: "presentar (a alguien)",
    trampa: "introducir (meter)", real: "to insert", realPron: "tu in-sért",
    example: "Let me introduce my colleague.", exampleEs: "Déjame presentarte a mi compañero." },

  { en: "remove", pron: "ri-múuv", es: "quitar",
    trampa: "remover (revolver)", real: "to stir", realPron: "tu ster",
    example: "Remove your shoes here.", exampleEs: "Quítate los zapatos aquí." },

  { en: "resume", pron: "ri-siúum", es: "reanudar",
    trampa: "resumir", real: "to summarize", realPron: "tu sá-ma-raiz",
    example: "Let's resume the meeting.", exampleEs: "Reanudemos la reunión." },

  { en: "pretend", pron: "pri-ténd", es: "fingir",
    trampa: "pretender", real: "to intend", realPron: "tu in-ténd",
    example: "He pretended to be asleep.", exampleEs: "Fingió estar dormido." },

  { en: "record", pron: "ri-kórd", es: "grabar",
    trampa: "recordar", real: "to remember", realPron: "tu ri-mém-ber",
    example: "They recorded the concert.", exampleEs: "Grabaron el concierto." },

  { en: "advertisement", pron: "ad-vér-tis-ment", es: "anuncio (publicidad)",
    trampa: "advertencia", real: "warning", realPron: "uór-ning",
    example: "I saw the advertisement online.", exampleEs: "Vi el anuncio en internet." },

  { en: "argument", pron: "ár-guiu-ment", es: "discusión, pelea",
    trampa: "argumento (de una obra)", real: "plot", realPron: "plot",
    example: "They had a big argument.", exampleEs: "Tuvieron una buena discusión." },

  { en: "compromise", pron: "kóm-pro-mais", es: "acuerdo con cesiones",
    trampa: "compromiso (obligación)", real: "commitment", realPron: "ka-mít-ment",
    example: "We reached a compromise.", exampleEs: "Llegamos a un acuerdo." },

  { en: "deception", pron: "di-sép-shon", es: "engaño",
    trampa: "decepción", real: "disappointment", realPron: "di-sa-póint-ment",
    example: "It was a deliberate deception.", exampleEs: "Fue un engaño deliberado." },

  { en: "quiet", pron: "kuái-et", es: "callado, silencioso",
    trampa: "quieto", real: "still", realPron: "stil",
    example: "Please be quiet.", exampleEs: "Por favor, callaos." },

  { en: "rope", pron: "róup", es: "cuerda",
    trampa: "ropa", real: "clothes", realPron: "klóuds",
    example: "Tie it with a rope.", exampleEs: "Átalo con una cuerda." },

  { en: "soap", pron: "sóup", es: "jabón",
    trampa: "sopa", real: "soup", realPron: "suup",
    example: "There's no soap left.", exampleEs: "No queda jabón." },

  { en: "lecture", pron: "lék-cher", es: "clase, conferencia",
    trampa: "lectura", real: "reading", realPron: "ríi-ding",
    example: "The lecture starts at ten.", exampleEs: "La clase empieza a las diez." },

  { en: "parents", pron: "pé-rents", es: "padres",
    trampa: "parientes", real: "relatives", realPron: "ré-la-tivs",
    example: "My parents live in Cádiz.", exampleEs: "Mis padres viven en Cádiz." },

  { en: "college", pron: "kó-lich", es: "universidad",
    trampa: "colegio", real: "school", realPron: "skuul",
    example: "She's still at college.", exampleEs: "Todavía está en la universidad." },

  { en: "conductor", pron: "kon-dák-tor", es: "director de orquesta, revisor",
    trampa: "conductor", real: "driver", realPron: "drái-ver",
    example: "The conductor raised his arms.", exampleEs: "El director levantó los brazos." },

  { en: "casualty", pron: "ká-shual-ti", es: "víctima, herido",
    trampa: "casualidad", real: "coincidence", realPron: "kouín-si-dens",
    example: "There were no casualties.", exampleEs: "No hubo víctimas." },

  { en: "idiom", pron: "í-diom", es: "modismo, expresión hecha",
    trampa: "idioma", real: "language", realPron: "lán-guich",
    example: "That's a common English idiom.", exampleEs: "Es un modismo inglés muy común." },

  { en: "billion", pron: "bí-lion", es: "mil millones",
    trampa: "billón", real: "trillion", realPron: "trí-lion",
    example: "The company is worth a billion.", exampleEs: "La empresa vale mil millones." },

  { en: "bland", pron: "bland", es: "soso, sin sabor",
    trampa: "blando", real: "soft", realPron: "soft",
    example: "The soup is a bit bland.", exampleEs: "La sopa está algo sosa." },

  { en: "facility", pron: "fa-sí-li-ti", es: "instalación",
    trampa: "facilidad", real: "ease", realPron: "iis",
    example: "The sports facility is new.", exampleEs: "La instalación deportiva es nueva." },

  { en: "topic", pron: "tó-pik", es: "tema",
    trampa: "tópico (cliché)", real: "cliché", realPron: "kli-shéi",
    example: "Let's change the topic.", exampleEs: "Cambiemos de tema." },

  { en: "ultimately", pron: "ál-ti-mat-li", es: "en última instancia",
    trampa: "últimamente", real: "lately", realPron: "léit-li",
    example: "Ultimately, it's your choice.", exampleEs: "En última instancia, tú decides." },

  { en: "contest", pron: "kón-test", es: "concurso",
    trampa: "contestar", real: "to answer", realPron: "tu án-ser",
    example: "She won the contest.", exampleEs: "Ganó el concurso." },

  { en: "dinner", pron: "dí-ner", es: "cena",
    trampa: "dinero", real: "money", realPron: "má-ni",
    example: "Dinner is ready.", exampleEs: "La cena está lista." },

  { en: "once", pron: "uáns", es: "una vez",
    trampa: "once (el número 11)", real: "eleven", realPron: "i-lé-ven",
    example: "I go once a week.", exampleEs: "Voy una vez por semana." },

  { en: "actual", pron: "ák-chual", es: "real, verdadero",
    trampa: "actual (de ahora)", real: "current", realPron: "ká-rent",
    example: "What's the actual cost?", exampleEs: "¿Cuál es el coste real?" },

  { en: "terrific", pron: "te-rí-fik", es: "estupendo",
    trampa: "terrorífico", real: "terrifying", realPron: "té-ri-fai-ing",
    example: "You did a terrific job.", exampleEs: "Has hecho un trabajo estupendo." },

  { en: "balloon", pron: "ba-lúun", es: "globo",
    trampa: "balón", real: "ball", realPron: "bol",
    example: "The child wants a balloon.", exampleEs: "El niño quiere un globo." },

  { en: "cartoon", pron: "kar-túun", es: "dibujos animados",
    trampa: "cartón", real: "cardboard", realPron: "kárd-bord",
    example: "The kids are watching cartoons.", exampleEs: "Los niños ven dibujos animados." },

  { en: "choke", pron: "chóuk", es: "atragantarse, ahogar",
    trampa: "chocar", real: "to crash", realPron: "tu krash",
    example: "He choked on a bone.", exampleEs: "Se atragantó con una espina." },

  { en: "collar", pron: "kó-lar", es: "cuello (de camisa)",
    trampa: "collar", real: "necklace", realPron: "né-klas",
    example: "Your collar is dirty.", exampleEs: "Tienes el cuello sucio." },

  { en: "curse", pron: "kers", es: "maldición",
    trampa: "curso", real: "course", realPron: "kors",
    example: "It sounded like a curse.", exampleEs: "Sonó como una maldición." },

  { en: "desert", pron: "dé-sert", es: "desierto",
    trampa: "postre", real: "dessert", realPron: "di-sért",
    example: "They crossed the desert.", exampleEs: "Cruzaron el desierto." },

  { en: "disgust", pron: "dis-gást", es: "asco, repugnancia",
    trampa: "disgusto", real: "upset", realPron: "ap-sét",
    example: "She looked at it with disgust.", exampleEs: "Lo miró con asco." },

  { en: "familiar", pron: "fa-mí-lier", es: "conocido, familiar (de sonarte)",
    trampa: "familiar (pariente)", real: "relative", realPron: "ré-la-tiv",
    example: "Your face looks familiar.", exampleEs: "Tu cara me suena." },

  { en: "gracious", pron: "gréi-shos", es: "cortés, amable",
    trampa: "gracioso", real: "funny", realPron: "fá-ni",
    example: "That was a gracious gesture.", exampleEs: "Fue un gesto muy cortés." },

  { en: "involve", pron: "in-vólv", es: "implicar, conllevar",
    trampa: "envolver", real: "to wrap", realPron: "tu rap",
    example: "The job involves traveling.", exampleEs: "El trabajo implica viajar." },

  { en: "jam", pron: "yam", es: "mermelada",
    trampa: "jamón", real: "ham", realPron: "jam",
    example: "Toast with jam, please.", exampleEs: "Tostada con mermelada, por favor." },

  { en: "mayor", pron: "méi-er", es: "alcalde",
    trampa: "mayor (más grande)", real: "bigger", realPron: "bí-guer",
    example: "The mayor gave a speech.", exampleEs: "El alcalde dio un discurso." },

  { en: "notice", pron: "nóu-tis", es: "darse cuenta, aviso",
    trampa: "noticia", real: "news", realPron: "niús",
    example: "I didn't notice the sign.", exampleEs: "No me di cuenta de la señal." },

  { en: "preservative", pron: "pri-sér-va-tiv", es: "conservante",
    trampa: "preservativo", real: "condom", realPron: "kón-dom",
    example: "No artificial preservatives.", exampleEs: "Sin conservantes artificiales." },

  { en: "scholar", pron: "skó-lar", es: "erudito, estudioso",
    trampa: "escolar (alumno)", real: "schoolchild", realPron: "skúul-chaild",
    example: "He's a respected scholar.", exampleEs: "Es un erudito respetado." },

  { en: "signature", pron: "síg-na-cher", es: "firma",
    trampa: "asignatura", real: "subject", realPron: "sáb-yekt",
    example: "I need your signature here.", exampleEs: "Necesito tu firma aquí." },

  { en: "target", pron: "tár-guet", es: "objetivo, diana",
    trampa: "tarjeta", real: "card", realPron: "kard",
    example: "We hit our sales target.", exampleEs: "Alcanzamos nuestro objetivo de ventas." },

  { en: "vase", pron: "vaas", es: "jarrón",
    trampa: "vaso", real: "glass", realPron: "glas",
    example: "Put the flowers in the vase.", exampleEs: "Pon las flores en el jarrón." },

  { en: "misery", pron: "mí-sa-ri", es: "sufrimiento, desdicha",
    trampa: "miseria (pobreza)", real: "poverty", realPron: "pó-ver-ti",
    example: "He lived in misery for years.", exampleEs: "Vivió años de sufrimiento." },

  { en: "estate", pron: "is-téit", es: "finca, propiedad",
    trampa: "estado", real: "state", realPron: "stéit",
    example: "They sold the family estate.", exampleEs: "Vendieron la finca familiar." },

  { en: "grocery", pron: "gróu-sa-ri", es: "tienda de comestibles",
    trampa: "grosería", real: "rude remark", realPron: "ruud ri-márk",
    example: "I'm going to the grocery store.", exampleEs: "Voy a la tienda de comestibles." },

  { en: "regular", pron: "ré-guiu-lar", es: "habitual, normal",
    trampa: "regular (así así)", real: "so-so", realPron: "sóu sóu",
    example: "He's a regular customer.", exampleEs: "Es un cliente habitual." },

  { en: "camp", pron: "kamp", es: "campamento",
    trampa: "campo", real: "field", realPron: "fiild",
    example: "We stayed at a summer camp.", exampleEs: "Estuvimos en un campamento de verano." },
];

export const totalFalsosAmigos = () => FALSOS_AMIGOS.length;
