/**
 * Frases hechas del inglés, explicadas.
 *
 * El vocabulario suelto no basta: hay frases que un nativo suelta enteras, sin
 * pensarlas, y que traducidas palabra por palabra no significan nada. Esta
 * sección va de eso — de por qué se dicen así, qué quieren decir de verdad y
 * en qué situación caben.
 *
 * Cuatro familias, y cada una falla por un motivo distinto:
 *   idioms      – la traducción literal es absurda ("raining cats and dogs")
 *   situaciones – la fórmula es fija y en español diríamos otra cosa
 *   moldes      – estructuras donde solo cambias el final
 *   errores     – lo que decimos mal por calcar del español
 *
 * Campos:
 *   en        la frase
 *   pron      pronunciación figurada, con las mismas reglas que el resto de la app
 *   es        qué significa de verdad
 *   literal   traducción palabra por palabra, para ver por qué chirría (idioms)
 *   mal       lo que dice un español y suena raro (errores)
 *   porque    de dónde sale la forma: origen, lógica gramatical, historia
 *   cuando    registro y contexto: con quién sí y con quién no
 *   ojo       la trampa concreta, cuando la hay
 *   situacion la escena en español, para el juego
 *   ejemplos  la frase metida en una conversación
 *
 * Todo en inglés americano.
 */

export const CATEGORIAS_FRASES = [
  { id: "idioms", nombre: "Expresiones", emoji: "🎭", pista: "no se traducen palabra por palabra" },
  { id: "situaciones", nombre: "Situaciones", emoji: "💬", pista: "lo que se dice de verdad en cada sitio" },
  { id: "moldes", nombre: "Moldes", emoji: "🧩", pista: "cambias el final y sirve para todo" },
  { id: "errores", nombre: "Errores típicos", emoji: "⚠️", pista: "lo que calcamos del español" },
];

export const FRASES = [
  /* ---------------- 🎭 EXPRESIONES E IDIOMS ---------------- */
  {
    id: "piece-of-cake",
    cat: "idioms",
    en: "It's a piece of cake.",
    pron: "its a piis of kéik",
    es: "Está tirado. / Es pan comido.",
    literal: "Es un trozo de tarta.",
    porque:
      "Sale de los cakewalks del siglo XIX en Estados Unidos: un concurso de baile cuyo premio era una tarta. Ganarla se veía fácil y agradable, y de ahí quedó «piece of cake» para cualquier cosa que no cuesta nada.",
    cuando:
      "Informal, entre amigos o compañeros. En una entrevista de trabajo di mejor «it's straightforward».",
    ojo: "En español decimos «pan comido»; el inglés usa tarta, no pan. «Piece of bread» no significa nada.",
    situacion: "Alguien te pregunta si el examen fue difícil y para ti fue facilísimo.",
    ejemplos: [
      ["Don't worry about the test — it's a piece of cake.", "No te preocupes por el examen, está tirado."],
    ],
  },
  {
    id: "break-a-leg",
    cat: "idioms",
    en: "Break a leg!",
    pron: "bréik a leg",
    es: "¡Mucha suerte! (antes de actuar)",
    literal: "¡Rómpete una pierna!",
    porque:
      "Viene del teatro, donde desear suerte en voz alta trae mala suerte, así que se desea justo lo contrario. Es la misma superstición que nuestro «mucha mierda».",
    cuando:
      "Antes de una actuación, un concierto, una presentación o una audición. No se dice antes de una operación ni de un examen normal.",
    ojo: "Nunca respondas «thank you» con cara de susto: es un deseo bueno, no una amenaza.",
    situacion: "Tu amiga sale al escenario en cinco minutos y quieres desearle suerte.",
    ejemplos: [["You're on in five minutes. Break a leg!", "Sales en cinco minutos. ¡Mucha suerte!"]],
  },
  {
    id: "under-the-weather",
    cat: "idioms",
    en: "I'm feeling under the weather.",
    pron: "áim fíiling ánder de uéder",
    es: "Estoy pachucho / no me encuentro bien.",
    literal: "Me siento debajo del tiempo.",
    porque:
      "Es de origen marinero: al que se mareaba lo mandaban bajo cubierta, a resguardo del temporal. Quedaba literalmente «bajo el tiempo».",
    cuando:
      "Para un malestar leve: resfriado, cansancio, mala noche. Si estás de verdad enfermo se dice «I'm sick».",
    ojo: "No sirve para el ánimo. Estar triste es «I'm feeling down», no «under the weather».",
    situacion: "Avisas en el trabajo de que hoy no vas porque estás algo malo.",
    ejemplos: [["I'm feeling under the weather, so I'll work from home.", "No me encuentro muy bien, así que trabajo desde casa."]],
  },
  {
    id: "hit-the-books",
    cat: "idioms",
    en: "I need to hit the books.",
    pron: "ái niid tu jit de buks",
    es: "Tengo que ponerme a estudiar.",
    literal: "Necesito golpear los libros.",
    porque:
      "«Hit» se usa en americano para empezar algo con energía: hit the road (largarse), hit the gym, hit the shower. No hay violencia ninguna, es puro empujón.",
    cuando: "Coloquial, sobre todo entre estudiantes.",
    ojo: "Toda la familia funciona igual: «hit the road» es irse, no dar golpes a la carretera.",
    situacion: "Tienes examen el lunes y te vas a casa a estudiar.",
    ejemplos: [["I can't come out tonight — I have to hit the books.", "No puedo salir esta noche, tengo que ponerme a estudiar."]],
  },
  {
    id: "cost-an-arm",
    cat: "idioms",
    en: "It cost an arm and a leg.",
    pron: "it kost an arm and a leg",
    es: "Costó un ojo de la cara / un riñón.",
    literal: "Costó un brazo y una pierna.",
    porque:
      "La idea es la misma que en español: pagar con una parte del cuerpo. Cambia solo qué parte — nosotros ponemos el ojo o el riñón, ellos el brazo y la pierna.",
    cuando: "Informal, para quejarse de un precio.",
    ojo: "El verbo es irregular: cost · cost · cost. Nunca «costed».",
    situacion: "Enseñas tu portátil nuevo y alguien te pregunta cuánto te costó.",
    ejemplos: [["The repair cost an arm and a leg.", "La reparación costó un riñón."]],
  },
  {
    id: "once-in-a-blue-moon",
    cat: "idioms",
    en: "Once in a blue moon.",
    pron: "uáns in a bluu muun",
    es: "Muy de vez en cuando / cada muerte de obispo.",
    literal: "Una vez en una luna azul.",
    porque:
      "Una «blue moon» es la segunda luna llena dentro del mismo mes: pasa cada dos o tres años. De ahí que signifique rarísimo, pero no imposible.",
    cuando: "Neutro. Vale para hablar de costumbres y frecuencias.",
    ojo: "No es «nunca». Es poco, pero pasa.",
    situacion: "Te preguntan si vas al cine a menudo y la verdad es que casi nunca.",
    ejemplos: [["I eat out once in a blue moon.", "Como fuera muy de vez en cuando."]],
  },
  {
    id: "spill-the-beans",
    cat: "idioms",
    en: "Don't spill the beans.",
    pron: "dount spil de biins",
    es: "No cuentes el secreto.",
    literal: "No derrames las alubias.",
    porque:
      "Se atribuye a las votaciones de la Grecia antigua, hechas con alubias en un tarro: volcarlo antes de tiempo revelaba el resultado.",
    cuando: "Informal. Muy típico con sorpresas y regalos.",
    ojo: "Spill es irregular en británico (spilt), pero en americano es regular: spilled.",
    situacion: "Estáis preparando una fiesta sorpresa y alguien está a punto de irse de la lengua.",
    ejemplos: [["She spilled the beans about the party.", "Se fue de la lengua con lo de la fiesta."]],
  },
  {
    id: "on-the-same-page",
    cat: "idioms",
    en: "Are we on the same page?",
    pron: "ar ui on de séim péich",
    es: "¿Estamos de acuerdo? / ¿Lo entendemos igual?",
    literal: "¿Estamos en la misma página?",
    porque:
      "La imagen es la de un coro o una lectura en grupo: si alguien va por otra página, se nota enseguida. Se usa para comprobar que todos entienden lo mismo.",
    cuando:
      "Muy frecuente en el trabajo y en reuniones. Es educado: pregunta sin acusar a nadie de no enterarse.",
    ojo: "No pregunta si estás de acuerdo en opinión, sino si entendéis lo mismo.",
    situacion: "Terminas de explicar un plan en el trabajo y quieres confirmar que todos lo han entendido igual.",
    ejemplos: [["Before we start, let's make sure we're on the same page.", "Antes de empezar, asegurémonos de que lo entendemos igual."]],
  },
  {
    id: "call-it-a-day",
    cat: "idioms",
    en: "Let's call it a day.",
    pron: "lets kol it a déi",
    es: "Lo dejamos por hoy.",
    literal: "Llamémoslo un día.",
    porque:
      "Viene del mundo obrero del siglo XIX: dar por cumplida la jornada aunque no estuviera todo hecho. «Llamar a esto un día (de trabajo)».",
    cuando: "Neutro, muy común en el trabajo y también estudiando.",
    ojo: "No significa acabar del todo, solo parar hasta mañana.",
    situacion: "Son las ocho, lleváis todo el día y decides parar hasta mañana.",
    ejemplos: [["We've done enough. Let's call it a day.", "Ya hemos hecho bastante. Lo dejamos por hoy."]],
  },
  {
    id: "get-the-hang",
    cat: "idioms",
    en: "You'll get the hang of it.",
    pron: "iul guet de jang of it",
    es: "Le vas a coger el truco.",
    literal: "Cogerás el colgar de ello.",
    porque:
      "«Hang» aquí es el modo natural en que algo cae o se maneja, como cuando una tela cae bien. Cogerle el hang es entender cómo se mueve la cosa.",
    cuando: "Para animar a alguien que está aprendiendo. Cálido y muy usado.",
    ojo: "Lleva «of it» al final: sin ese «of» suena incompleto.",
    situacion: "Alguien está aprendiendo algo nuevo y se agobia, y quieres animarlo.",
    ejemplos: [["It's confusing at first, but you'll get the hang of it.", "Al principio lía, pero le cogerás el truco."]],
  },
  {
    id: "make-up-your-mind",
    cat: "idioms",
    en: "Make up your mind.",
    pron: "méik ap ior máind",
    es: "Decídete.",
    literal: "Compón tu mente.",
    porque:
      "«Make up» es componer o formar algo a partir de piezas: aquí, formar una decisión con lo que tienes en la cabeza.",
    cuando: "Informal y algo impaciente. Con un desconocido suena brusco.",
    ojo: "El mismo «make up» significa también inventarse algo y reconciliarse. El contexto lo decide todo.",
    situacion: "Lleváis diez minutos en la carta del restaurante y tu amigo no se decide.",
    ejemplos: [["Come on, make up your mind — the waiter is waiting.", "Venga, decídete, que el camarero espera."]],
  },
  {
    id: "no-big-deal",
    cat: "idioms",
    en: "It's no big deal.",
    pron: "its nóu big diil",
    es: "No pasa nada / no es para tanto.",
    literal: "No es un gran trato.",
    porque:
      "«Deal» es un asunto o negocio; algo que no es «big deal» no merece que le des importancia. Es la respuesta estándar al agradecimiento y a la disculpa.",
    cuando: "Muy informal y muy americano. Se oye todo el rato.",
    ojo: "Como respuesta a «thank you» equivale a «de nada», igual que «no worries».",
    situacion: "Alguien se disculpa mucho por algo que a ti te da igual.",
    ejemplos: [["You forgot? It's no big deal.", "¿Se te olvidó? No pasa nada."]],
  },
  {
    id: "long-story-short",
    cat: "idioms",
    en: "Long story short, we missed the flight.",
    pron: "long stóri short, ui mist de fláit",
    es: "En resumen, perdimos el vuelo.",
    literal: "Larga historia corta.",
    porque:
      "Es la versión recortada de «to make a long story short». El inglés hablado se come el «to make», y quedó la fórmula suelta.",
    cuando: "Conversación normal, cuando cortas los detalles y vas al final.",
    ojo: "Va al principio de la frase, no al final.",
    situacion: "Empiezas a contar algo largo y prefieres saltar al desenlace.",
    ejemplos: [["Long story short, I got the job.", "En resumen, conseguí el trabajo."]],
  },
  {
    id: "hang-in-there",
    cat: "idioms",
    en: "Hang in there.",
    pron: "jang in der",
    es: "Aguanta / ánimo.",
    literal: "Cuélgate ahí dentro.",
    porque:
      "La imagen es la de agarrarse a algo para no caerse. Se popularizó con un póster de los años setenta de un gato colgado de una rama.",
    cuando: "Para dar ánimo en un mal momento. Cálido y muy común.",
    ojo: "No confundir con «hang on», que es «espera un momento».",
    situacion: "Un amigo está pasando una racha mala en el trabajo.",
    ejemplos: [["I know it's hard. Hang in there.", "Sé que es duro. Aguanta."]],
  },
  {
    id: "ring-a-bell",
    cat: "idioms",
    en: "That name rings a bell.",
    pron: "dat néim rings a bel",
    es: "Ese nombre me suena.",
    literal: "Ese nombre toca una campana.",
    porque:
      "En español decimos «me suena»; el inglés también usa el sonido, pero concreta el instrumento. La idea es idéntica: algo despierta un recuerdo vago.",
    cuando: "Conversación normal.",
    ojo: "Ojo con calcarlo al revés: «it sounds me» no existe. Se dice «it rings a bell» o «it sounds familiar».",
    situacion: "Te mencionan a alguien y crees haber oído ese nombre, pero no lo sitúas.",
    ejemplos: [["Hmm, that rings a bell, but I can't place it.", "Mmm, me suena, pero no lo sitúo."]],
  },
  {
    id: "beat-around-bush",
    cat: "idioms",
    en: "Stop beating around the bush.",
    pron: "stop bíiting aráund de bush",
    es: "Deja de andarte por las ramas.",
    literal: "Deja de golpear alrededor del arbusto.",
    porque:
      "Viene de la caza: los ojeadores golpeaban los matorrales alrededor para levantar la pieza, sin entrar de lleno. Rodear en vez de ir al grano.",
    cuando: "Directo, casi impaciente. Con confianza.",
    ojo: "El español usa ramas y el inglés arbustos, pero es la misma idea de rodear.",
    situacion: "Alguien lleva un rato dando vueltas sin decirte lo que ha pasado.",
    ejemplos: [["Just tell me — stop beating around the bush.", "Dímelo ya, deja de andarte por las ramas."]],
  },
  {
    id: "sleep-on-it",
    cat: "idioms",
    en: "Let me sleep on it.",
    pron: "let mi sliip on it",
    es: "Déjame consultarlo con la almohada.",
    literal: "Déjame dormir encima de ello.",
    porque:
      "La idea es que una noche de sueño ordena las ideas. En español lo decimos casi igual, pero con la almohada de por medio.",
    cuando: "Muy útil para ganar tiempo sin decir que no. Sirve en el trabajo.",
    ojo: "La preposición es «on», nunca «over» ni «about».",
    situacion: "Te hacen una oferta y no quieres decidir en caliente.",
    ejemplos: [["It's a big decision. Let me sleep on it.", "Es una decisión importante. Déjame consultarlo con la almohada."]],
  },
  {
    id: "out-of-the-blue",
    cat: "idioms",
    en: "She called me out of the blue.",
    pron: "shi kold mi áut of de bluu",
    es: "Me llamó de repente, sin venir a cuento.",
    literal: "Me llamó fuera del azul.",
    porque:
      "El «blue» es el cielo despejado: viene de «a bolt out of the blue», un rayo con el cielo azul. Lo inesperado por definición.",
    cuando: "Neutro. Para cosas que llegan sin aviso, buenas o malas.",
    ojo: "Se usa con lo inesperado, no con lo rápido. Algo veloz es «all of a sudden».",
    situacion: "Te escribe alguien de quien no sabías nada desde hace años.",
    ejemplos: [["Out of the blue, he offered me a job.", "Sin venir a cuento, me ofreció trabajo."]],
  },
  {
    id: "up-in-the-air",
    cat: "idioms",
    en: "Our plans are still up in the air.",
    pron: "áuar plans ar stil ap in de er",
    es: "Nuestros planes están en el aire.",
    literal: "Nuestros planes están arriba en el aire.",
    porque:
      "Lo que está en el aire aún no ha aterrizado: ni decidido ni descartado. En español lo decimos igual.",
    cuando: "Neutro, muy común al hablar de planes y fechas.",
    ojo: "Es una de las pocas que se traduce casi literal. Aprovecha.",
    situacion: "Te preguntan por las vacaciones y todavía no habéis decidido nada.",
    ejemplos: [["The date is up in the air for now.", "La fecha está en el aire de momento."]],
  },
  {
    id: "cut-to-the-chase",
    cat: "idioms",
    en: "Let's cut to the chase.",
    pron: "lets kat tu de chéis",
    es: "Vamos al grano.",
    literal: "Cortemos a la persecución.",
    porque:
      "Es lenguaje de cine mudo: «cut to the chase» era la orden de montaje para saltar del diálogo aburrido a la escena de persecución. Saltarse el relleno.",
    cuando: "Trabajo y conversación. Directo pero no maleducado.",
    ojo: "El verbo cut es irregular e invariable: cut · cut · cut.",
    situacion: "La reunión lleva veinte minutos de rodeos y quieres ir al asunto.",
    ejemplos: [["We're short on time, so let's cut to the chase.", "Vamos justos de tiempo, así que vamos al grano."]],
  },

  /* ---------------- 💬 FRASES DE SITUACIÓN ---------------- */
  {
    id: "nice-to-meet-you",
    cat: "situaciones",
    contexto: "Presentarse",
    en: "Nice to meet you.",
    pron: "náis tu miit iu",
    es: "Encantado / mucho gusto.",
    porque:
      "«Meet» es conocer a alguien por primera vez, no quedar con él. Por eso esta frase solo vale la primera vez: es literalmente «qué bien conocerte».",
    cuando: "La primera vez que ves a alguien, en cualquier registro.",
    ojo:
      "A partir de la segunda vez se dice «Nice to see you». Decir «nice to meet you» a alguien que ya conoces suena a que no te acuerdas de él.",
    situacion: "Te presentan a un compañero nuevo del trabajo.",
    ejemplos: [
      ["Nice to meet you. I've heard a lot about you.", "Encantado. He oído hablar mucho de ti."],
      ["Nice to see you again!", "¡Qué bien verte otra vez!"],
    ],
  },
  {
    id: "how-are-you-doing",
    cat: "situaciones",
    contexto: "Presentarse",
    en: "How's it going?",
    pron: "jáus it góuing",
    es: "¿Qué tal? / ¿Cómo va?",
    porque:
      "No es una pregunta de verdad, es un saludo. Por eso la respuesta esperada es corta y buena, aunque el día sea horrible.",
    cuando: "Informal y muy americano. Con desconocidos, «How are you?».",
    ojo:
      "Se responde «Good, thanks. You?» y ya. Contar cómo estás de verdad rompe el guion y desconcierta.",
    situacion: "Te cruzas con un compañero por el pasillo.",
    ejemplos: [["— How's it going? — Good, thanks. You?", "— ¿Qué tal? — Bien, gracias. ¿Y tú?"]],
  },
  {
    id: "could-i-get",
    cat: "situaciones",
    contexto: "Restaurante",
    en: "Could I get a coffee, please?",
    pron: "kud ái guet a kófi, pliis",
    es: "¿Me pones un café, por favor?",
    porque:
      "En americano se pide con «Can I get…?» o «Could I get…?». El «get» aquí es recibir, no coger: no estás yendo tú a por ello.",
    cuando: "Bares, restaurantes, cafeterías. Es la fórmula normal en Estados Unidos.",
    ojo:
      "«I want a coffee» suena a orden y a niño pequeño. Y «I would like» es correcto pero más formal, de restaurante caro.",
    situacion: "Estás en una cafetería y quieres pedir.",
    ejemplos: [["Could I get the check, please?", "¿Me trae la cuenta, por favor?"]],
  },
  {
    id: "check-please",
    cat: "situaciones",
    contexto: "Restaurante",
    en: "Can we get the check?",
    pron: "kan ui guet de chek",
    es: "¿Nos trae la cuenta?",
    porque:
      "En Estados Unidos la cuenta del restaurante es «the check». «Bill» es la palabra británica, y en americano significa además factura y billete de dólar.",
    cuando: "Cualquier restaurante en Estados Unidos.",
    ojo:
      "Nunca se llama al camarero con «¡Waiter!» ni con la mano en alto: se busca su mirada y se hace un gesto pequeño.",
    situacion: "Habéis terminado de cenar y queréis pagar.",
    ejemplos: [["Can we get the check when you have a second?", "¿Nos trae la cuenta cuando pueda?"]],
  },
  {
    id: "im-just-looking",
    cat: "situaciones",
    contexto: "Tiendas",
    en: "I'm just looking, thanks.",
    pron: "áim yast lúking, zanks",
    es: "Solo estoy mirando, gracias.",
    porque:
      "Es la respuesta fija a «Can I help you?» en una tienda. El «just» es lo que la hace amable: sin él suena cortante.",
    cuando: "Cualquier tienda. Es lo que se espera oír, no molesta a nadie.",
    ojo: "El presente continuo es obligatorio: «I look» sonaría a costumbre, no a ahora mismo.",
    situacion: "Entras en una tienda y un dependiente se te acerca enseguida.",
    ejemplos: [["— Can I help you? — I'm just looking, thanks.", "— ¿Le ayudo? — Solo estoy mirando, gracias."]],
  },
  {
    id: "how-much-is-this",
    cat: "situaciones",
    contexto: "Tiendas",
    en: "How much is this?",
    pron: "jáu mach is dis",
    es: "¿Cuánto cuesta esto?",
    porque:
      "El inglés pregunta el precio con el verbo «be», no con «cost». Literalmente «¿cuánto es esto?», igual que en español coloquial.",
    cuando: "Cualquier tienda o mercado.",
    ojo:
      "En plural cambia a «How much are these?». Y no confundas «how much» (incontable, dinero) con «how many» (cosas contables).",
    situacion: "Coges algo de una estantería sin etiqueta de precio.",
    ejemplos: [["How much are these?", "¿Cuánto cuestan estos?"]],
  },
  {
    id: "im-calling-about",
    cat: "situaciones",
    contexto: "Teléfono y trabajo",
    en: "Hi, I'm calling about the apartment.",
    pron: "jái, áim kóling abáut di apártment",
    es: "Hola, llamo por lo del piso.",
    porque:
      "Es la fórmula fija para abrir una llamada: primero quién eres, después el motivo con «about». El presente continuo indica que estás llamando ahora.",
    cuando: "Cualquier llamada, formal o informal.",
    ojo: "Es «about», nunca «for». «I'm calling for the apartment» suena a que vas a por el piso físicamente.",
    situacion: "Llamas a un anuncio de alquiler.",
    ejemplos: [["I'm calling about the job posting.", "Llamo por la oferta de trabajo."]],
  },
  {
    id: "can-i-take-a-message",
    cat: "situaciones",
    contexto: "Teléfono y trabajo",
    en: "Can I take a message?",
    pron: "kan ái téik a mésich",
    es: "¿Quiere dejar un recado?",
    porque:
      "El inglés lo dice desde quien atiende («¿puedo coger un mensaje?») y el español desde quien llama («¿quiere dejar…?»). Cambia el sujeto entero.",
    cuando: "Al coger el teléfono cuando la persona buscada no está.",
    ojo:
      "Si eres tú quien llama, la de dejarlo es «Can I leave a message?». Take lo coge quien atiende, leave lo deja quien llama.",
    situacion: "Coges el teléfono en la oficina y preguntan por alguien que no está.",
    ejemplos: [["She's not at her desk. Can I take a message?", "No está en su mesa. ¿Quiere dejar un recado?"]],
  },
  {
    id: "sorry-im-late",
    cat: "situaciones",
    contexto: "Teléfono y trabajo",
    en: "Sorry I'm late — traffic was terrible.",
    pron: "sóri áim léit — trafik uós téribol",
    es: "Perdón por el retraso, había un tráfico horrible.",
    porque:
      "«Late» es adjetivo, así que va con el verbo be: estás tarde, no llegas tarde. Por eso nunca «I have late» ni «I come late».",
    cuando: "Universal. Añadir el motivo justo detrás es lo normal y suena honesto.",
    ojo: "«I'm sorry for the delay» es correcto pero suena a carta o a megafonía de aeropuerto.",
    situacion: "Llegas quince minutos tarde a una reunión.",
    ejemplos: [["Sorry I'm late. The train was delayed.", "Perdón por el retraso, el tren venía con retraso."]],
  },
  {
    id: "boarding-pass",
    cat: "situaciones",
    contexto: "Aeropuerto y viaje",
    en: "Here's my boarding pass.",
    pron: "jíers mái bórding pas",
    es: "Aquí tiene mi tarjeta de embarque.",
    porque:
      "«Board» es subir a bordo de un avión, un barco o un tren, y de ahí sale todo el vocabulario del aeropuerto: boarding pass, boarding gate, now boarding.",
    cuando: "Aeropuertos y estaciones.",
    ojo: "«Here's» (here is) es la forma natural de dar algo. «Take it» suena a orden.",
    situacion: "Estás en la puerta de embarque y te piden la tarjeta.",
    ejemplos: [["Boarding pass and ID, please.", "Tarjeta de embarque y documento, por favor."]],
  },
  {
    id: "aisle-or-window",
    cat: "situaciones",
    contexto: "Aeropuerto y viaje",
    en: "Window seat, please.",
    pron: "uíndou siit, pliis",
    es: "Ventanilla, por favor.",
    porque:
      "Las dos opciones son «window» (ventanilla) y «aisle» (pasillo). Ojo con aisle: se dice «áil», la s no se pronuncia.",
    cuando: "Facturación y aviones.",
    ojo: "«Aisle» es de las palabras peor pronunciadas: no es «áisle», es «áil», igual que «I'll».",
    situacion: "Estás facturando y te preguntan qué asiento prefieres.",
    ejemplos: [["— Window or aisle? — Aisle, please.", "— ¿Ventanilla o pasillo? — Pasillo, por favor."]],
  },
  {
    id: "how-do-i-get-to",
    cat: "situaciones",
    contexto: "Aeropuerto y viaje",
    en: "How do I get to the station?",
    pron: "jáu du ái guet tu de stéishon",
    es: "¿Cómo llego a la estación?",
    porque:
      "«Get to» es llegar a un sitio. Es la fórmula normal para pedir indicaciones, más natural que «how can I arrive».",
    cuando: "En la calle, con cualquiera.",
    ojo: "«Arrive» no lleva «to»: se dice «arrive at the station», nunca «arrive to».",
    situacion: "Estás perdido y paras a alguien en la calle.",
    ejemplos: [["Excuse me, how do I get to the museum?", "Perdone, ¿cómo llego al museo?"]],
  },
  {
    id: "excuse-me-sorry",
    cat: "situaciones",
    contexto: "Cortesía",
    en: "Excuse me, do you have a minute?",
    pron: "ekskiús mi, du iu jav a mínit",
    es: "Perdona, ¿tienes un momento?",
    porque:
      "«Excuse me» se dice ANTES de molestar; «sorry», DESPUÉS de haber molestado. El español usa «perdona» para las dos cosas y ahí está la confusión.",
    cuando: "Universal.",
    ojo:
      "Si pisas a alguien: sorry. Si vas a preguntarle algo o quieres pasar: excuse me. Cambiarlos suena raro, aunque se entiende.",
    situacion: "Quieres interrumpir a alguien para preguntarle algo.",
    ejemplos: [
      ["Excuse me, is this seat taken?", "Perdona, ¿está ocupado este asiento?"],
      ["Sorry! I didn't see you there.", "¡Perdón! No te había visto."],
    ],
  },
  {
    id: "you-are-welcome",
    cat: "situaciones",
    contexto: "Cortesía",
    en: "You're welcome.",
    pron: "iur uélkam",
    es: "De nada.",
    porque:
      "Literalmente «eres bienvenido»: la ayuda que has dado queda a disposición del otro. Es la respuesta estándar a «thank you».",
    cuando: "Universal y siempre correcto.",
    ojo:
      "Entre gente joven se oye más «No problem», «Sure» o «Of course». «You're welcome» nunca queda mal, pero puede sonar algo formal entre amigos.",
    situacion: "Le has sujetado la puerta a alguien y te da las gracias.",
    ejemplos: [["— Thanks so much! — You're welcome.", "— ¡Muchas gracias! — De nada."]],
  },
  {
    id: "no-worries",
    cat: "situaciones",
    contexto: "Cortesía",
    en: "No worries.",
    pron: "nóu uóris",
    es: "Tranquilo / no pasa nada.",
    porque:
      "Vale para dos cosas a la vez: responder a un «gracias» y quitar hierro a una disculpa. Por eso se oye tantísimo.",
    cuando: "Informal, entre amigos y compañeros. Muy común hoy.",
    ojo: "Va siempre en plural: «no worry» no existe.",
    situacion: "Un amigo se disculpa por llegar tarde.",
    ejemplos: [["— Sorry I'm late! — No worries.", "— ¡Perdón por el retraso! — Tranquilo."]],
  },
  {
    id: "could-you-repeat",
    cat: "situaciones",
    contexto: "Cuando no entiendes",
    en: "Sorry, could you say that again?",
    pron: "sóri, kud iu séi dat aguén",
    es: "Perdona, ¿lo puedes repetir?",
    porque:
      "Es más natural que «repeat», que suena a profesor mandando. «Say that again» es lo que se dice de verdad.",
    cuando: "Universal. Imprescindible cuando estás aprendiendo.",
    ojo:
      "Un simple «What?» suena brusco. Si solo dices una palabra, que sea «Sorry?» con entonación de pregunta.",
    situacion: "No has pillado lo que te acaban de decir.",
    ejemplos: [["Sorry, could you say that again more slowly?", "Perdona, ¿lo puedes repetir más despacio?"]],
  },
  {
    id: "what-does-mean",
    cat: "situaciones",
    contexto: "Cuando no entiendes",
    en: "What does that mean?",
    pron: "uót das dat miin",
    es: "¿Qué significa eso?",
    porque:
      "El sujeto es la palabra, no tú: es la palabra la que significa algo. Por eso lleva «does» y el verbo «mean» va en infinitivo.",
    cuando: "Universal.",
    ojo:
      "«What means that?» es el error más repetido por hispanohablantes: falta el auxiliar «does» y el orden está cambiado.",
    situacion: "Alguien usa una palabra que no conoces.",
    ejemplos: [["What does «commute» mean?", "¿Qué significa «commute»?"]],
  },
  {
    id: "im-not-sure",
    cat: "situaciones",
    contexto: "Cuando no entiendes",
    en: "I'm not sure, let me check.",
    pron: "áim not shur, let mi chek",
    es: "No estoy seguro, déjame mirarlo.",
    porque:
      "Es la manera educada y profesional de no saber algo: reconoces la duda y ofreces resolverla. Mucho mejor que decir «I don't know» a secas.",
    cuando: "Trabajo y trato con clientes.",
    ojo: "«I'm not sure» es duda; «I don't know» es desconocimiento total y corta la conversación.",
    situacion: "Un cliente te pregunta algo que no sabes de memoria.",
    ejemplos: [["I'm not sure about the price. Let me check.", "No estoy seguro del precio. Déjame mirarlo."]],
  },
  {
    id: "how-was-your-weekend",
    cat: "situaciones",
    contexto: "Charla informal",
    en: "How was your weekend?",
    pron: "jáu uós ior uíkend",
    es: "¿Qué tal el fin de semana?",
    porque:
      "Es la pregunta ritual de los lunes en cualquier oficina americana. Se espera respuesta corta y una pregunta de vuelta.",
    cuando: "Trabajo, lunes por la mañana.",
    ojo: "Va en pasado («was»), porque el fin de semana ya terminó.",
    situacion: "Es lunes y te encuentras a un compañero en la cocina de la oficina.",
    ejemplos: [["— How was your weekend? — Pretty good, thanks. Yours?", "— ¿Qué tal el finde? — Bastante bien, gracias. ¿El tuyo?"]],
  },
  {
    id: "lets-keep-in-touch",
    cat: "situaciones",
    contexto: "Charla informal",
    en: "Let's keep in touch.",
    pron: "lets kiip in tach",
    es: "A ver si seguimos en contacto.",
    porque:
      "«Touch» aquí es contacto, no tacto. Mantener el contacto se dice «keep in touch», con «in», no «with».",
    cuando: "Al despedirse de alguien que no vas a ver en tiempo.",
    ojo: "Como en español, muchas veces es fórmula de cortesía y no compromiso real.",
    situacion: "Te despides de alguien que se muda a otra ciudad.",
    ejemplos: [["It was great seeing you. Let's keep in touch!", "Me alegro mucho de verte. ¡A ver si seguimos en contacto!"]],
  },

  /* ---------------- 🧩 MOLDES ---------------- */
  {
    id: "id-rather",
    cat: "moldes",
    en: "I'd rather stay home.",
    pron: "áid ráder stéi jóum",
    es: "Prefiero quedarme en casa.",
    porque:
      "«I'd rather» es «would rather»: preferir entre opciones. Lo raro para un español es que detrás va el infinitivo SIN «to» — stay, no to stay.",
    cuando: "Conversación normal. Suaviza un rechazo mejor que «I don't want».",
    ojo:
      "La negativa mete el not en medio: «I'd rather not go». Y para comparar se usa «than»: «I'd rather walk than drive».",
    situacion: "Te proponen salir y prefieres quedarte, sin sonar cortante.",
    ejemplos: [
      ["I'd rather not talk about it.", "Prefiero no hablar de eso."],
      ["I'd rather walk than take the bus.", "Prefiero andar que coger el autobús."],
    ],
  },
  {
    id: "used-to",
    cat: "moldes",
    en: "I used to smoke.",
    pron: "ái iúst tu smóuk",
    es: "Antes fumaba (ya no).",
    porque:
      "Es un molde para costumbres del pasado que ya se acabaron. El español no tiene nada igual: usamos el imperfecto y el «antes» lo pone el contexto.",
    cuando: "Universal, muy frecuente.",
    ojo:
      "No lo confundas con «to be used to» (estar acostumbrado a), que lleva -ing detrás: «I'm used to working late». Se parecen y significan cosas distintas.",
    situacion: "Cuentas algo que hacías hace años y ya no haces.",
    ejemplos: [
      ["I used to live in Madrid.", "Antes vivía en Madrid."],
      ["I'm used to getting up early.", "Estoy acostumbrado a madrugar."],
    ],
  },
  {
    id: "looking-forward",
    cat: "moldes",
    en: "I'm looking forward to seeing you.",
    pron: "áim lúking fóruard tu síing iu",
    es: "Tengo ganas de verte.",
    porque:
      "Aquí «to» es preposición, no parte de un infinitivo. Por eso detrás va -ing y no el verbo pelado: to seeing, no to see.",
    cuando: "Educado y cálido. Se usa muchísimo para cerrar correos.",
    ojo:
      "Es EL error clásico: «looking forward to see you» está mal. Truco: si puedes cambiarlo por un sustantivo («looking forward to the trip»), entonces va -ing.",
    situacion: "Cierras un correo a alguien con quien has quedado.",
    ejemplos: [["I'm looking forward to hearing from you.", "Quedo a la espera de tu respuesta."]],
  },
  {
    id: "how-about",
    cat: "moldes",
    en: "How about Friday?",
    pron: "jáu abáut fráidei",
    es: "¿Qué tal el viernes?",
    porque:
      "Es la manera más ligera de proponer algo. Detrás va un sustantivo o un verbo en -ing, nunca un infinitivo.",
    cuando: "Informal y muy común para quedar.",
    ojo: "«How about to go» está mal. Es «How about going?» o «How about a coffee?».",
    situacion: "Estáis buscando un día para quedar.",
    ejemplos: [["How about going out for dinner?", "¿Qué tal si salimos a cenar?"]],
  },
  {
    id: "would-you-mind",
    cat: "moldes",
    en: "Would you mind closing the window?",
    pron: "uúd iu máind klóusing de uíndou",
    es: "¿Te importaría cerrar la ventana?",
    porque:
      "«Mind» es molestar, así que preguntas si le molestaría. Es la petición más educada del inglés. Detrás, -ing.",
    cuando: "Formal o con desconocidos.",
    ojo:
      "La respuesta se invierte: si aceptas, dices «No, not at all» — «no me importa». Decir «yes» significa que SÍ te molesta.",
    situacion: "Quieres pedir algo a un desconocido de la forma más educada posible.",
    ejemplos: [["— Would you mind helping me? — Not at all.", "— ¿Te importaría ayudarme? — En absoluto."]],
  },
  {
    id: "supposed-to",
    cat: "moldes",
    en: "I'm supposed to be there at nine.",
    pron: "áim sapóust tu bi der at náin",
    es: "Se supone que tengo que estar allí a las nueve.",
    porque:
      "Marca una obligación que viene de fuera —una norma, un acuerdo, lo que se espera de ti— sin que tú la hayas elegido.",
    cuando: "Muy frecuente. Sirve también para quejarse de algo que no se cumplió.",
    ojo: "En pasado sugiere que no pasó: «I was supposed to call her» = tenía que llamarla y no lo hice.",
    situacion: "Explicas un compromiso que te han impuesto.",
    ejemplos: [["You're not supposed to park here.", "Aquí no se puede aparcar."]],
  },
  {
    id: "the-more-the-more",
    cat: "moldes",
    en: "The more you practice, the easier it gets.",
    pron: "de mor iu práktis, di íisier it guets",
    es: "Cuanto más practicas, más fácil se hace.",
    porque:
      "Es un molde doble, con «the» delante de los dos comparativos. Corresponde exacto a nuestro «cuanto más…, más…».",
    cuando: "Neutro. Muy útil y suena avanzado.",
    ojo: "El «the» de delante es obligatorio en las dos mitades. Sin él la frase se rompe.",
    situacion: "Animas a alguien explicándole que con el tiempo cuesta menos.",
    ejemplos: [["The sooner, the better.", "Cuanto antes, mejor."]],
  },
  {
    id: "as-soon-as",
    cat: "moldes",
    en: "I'll call you as soon as I get home.",
    pron: "ail kol iu as suun as ái guet jóum",
    es: "Te llamo en cuanto llegue a casa.",
    porque:
      "Detrás de «as soon as» el inglés usa presente aunque hable de futuro. En español ahí ponemos subjuntivo («llegue»), y por eso cuesta.",
    cuando: "Universal.",
    ojo: "Nunca «as soon as I will get home». Toda la familia (when, until, before, after) funciona igual.",
    situacion: "Prometes hacer algo justo después de otra cosa.",
    ejemplos: [["Text me when you arrive.", "Escríbeme cuando llegues."]],
  },
  {
    id: "not-only-but-also",
    cat: "moldes",
    en: "She's not only smart but also kind.",
    pron: "shis not óunli smart bat ólsou káind",
    es: "No solo es lista, sino también amable.",
    porque: "Molde de dos piezas para sumar cualidades. Se corresponde con nuestro «no solo…, sino también…».",
    cuando: "Neutro, algo cuidado. Bien en escritura y presentaciones.",
    ojo: "Lo que va después de cada mitad tiene que ser del mismo tipo: dos adjetivos, o dos verbos, pero no mezclados.",
    situacion: "Describes a alguien y quieres destacar dos cosas buenas.",
    ejemplos: [["The hotel was not only cheap but also very central.", "El hotel no solo era barato, sino además muy céntrico."]],
  },
  {
    id: "if-i-were-you",
    cat: "moldes",
    en: "If I were you, I'd take the job.",
    pron: "if ái uér iu, áid téik de yob",
    es: "Yo que tú, aceptaría el trabajo.",
    porque:
      "Es la fórmula estándar para dar consejo. Lleva «were» con I, no «was»: es un resto del subjuntivo inglés que aquí sigue vivo.",
    cuando: "Conversación normal. Suena a consejo, no a orden.",
    ojo: "«If I was you» se oye en habla muy informal, pero lo correcto y lo que se espera es «were».",
    situacion: "Un amigo te pide consejo sobre una decisión.",
    ejemplos: [["If I were you, I wouldn't wait.", "Yo que tú, no esperaría."]],
  },
  {
    id: "there-is-there-are",
    cat: "moldes",
    en: "There's a problem with the file.",
    pron: "ders a próblem uíd de fáil",
    es: "Hay un problema con el archivo.",
    porque:
      "El inglés no tiene un verbo «haber» impersonal: monta la frase con «there» + be, y el verbo concuerda con lo que viene detrás.",
    cuando: "Universal, constante.",
    ojo:
      "Singular «there is», plural «there are». Y en pasado, «there was» / «there were». Decir «it has a problem» para «hay» es error de calco.",
    situacion: "Avisas de que algo va mal.",
    ejemplos: [["There are three options.", "Hay tres opciones."]],
  },
  {
    id: "make-vs-do",
    cat: "moldes",
    en: "I have to do my homework and make dinner.",
    pron: "ái jav tu du mái jóumuerk and méik díner",
    es: "Tengo que hacer los deberes y preparar la cena.",
    porque:
      "El español tiene un solo «hacer» y el inglés lo parte en dos: «do» para tareas y trabajo, «make» para crear o producir algo nuevo.",
    cuando: "Universal.",
    ojo:
      "Fijas de memoria: do homework, do the dishes, do a favor, do business. Make dinner, make a decision, make a mistake, make money.",
    situacion: "Enumeras las cosas que tienes pendientes en casa.",
    ejemplos: [["Don't make a decision now — do some research first.", "No decidas ahora, investiga un poco primero."]],
  },
  {
    id: "get-used-to-it",
    cat: "moldes",
    en: "You'll get used to it.",
    pron: "iul guet iúst tu it",
    es: "Te acostumbrarás.",
    porque:
      "Tres formas parecidas y distintas: «used to» (antes lo hacía), «be used to» (estoy acostumbrado) y «get used to» (me estoy acostumbrando).",
    cuando: "Conversación normal, muy común al empezar algo nuevo.",
    ojo: "Con be y get, detrás va -ing o un sustantivo: «get used to waking up early».",
    situacion: "Alguien acaba de empezar en un sitio nuevo y todo le resulta raro.",
    ejemplos: [["It's strange at first, but you'll get used to it.", "Al principio es raro, pero te acostumbrarás."]],
  },
  {
    id: "had-better",
    cat: "moldes",
    en: "You'd better leave now.",
    pron: "iud béter liiv náu",
    es: "Más vale que te vayas ya.",
    porque:
      "«Had better» es un consejo con aviso: si no lo haces, habrá consecuencias. Detrás va infinitivo sin «to».",
    cuando: "Informal y bastante fuerte. Con un jefe o un desconocido, mejor «should».",
    ojo: "Aunque lleva «had», habla del presente y del futuro, nunca del pasado.",
    situacion: "Avisas a alguien de que si no se da prisa perderá el tren.",
    ejemplos: [["We'd better hurry or we'll miss it.", "Más vale que nos demos prisa o lo perdemos."]],
  },
  {
    id: "it-takes",
    cat: "moldes",
    en: "It takes about an hour.",
    pron: "it téiks abáut an áuar",
    es: "Se tarda una hora más o menos.",
    porque:
      "El inglés pone «it» como sujeto y el verbo «take» para el tiempo que algo requiere. El español lo dice con «se tarda», sin sujeto.",
    cuando: "Universal, muy frecuente con viajes y tareas.",
    ojo: "Para decir cuánto tardas tú: «It takes me an hour», con el pronombre en medio.",
    situacion: "Te preguntan cuánto se tarda en llegar.",
    ejemplos: [["It took me two hours to finish.", "Tardé dos horas en terminar."]],
  },

  /* ---------------- ⚠️ ERRORES TÍPICOS ---------------- */
  {
    id: "err-age",
    cat: "errores",
    mal: "I have 30 years.",
    en: "I'm 30 years old.",
    pron: "áim zérti íers óuld",
    es: "Tengo 30 años.",
    porque:
      "La edad en inglés no se tiene, se es. Se usa el verbo «be», igual que con el hambre, el frío o el miedo: I'm hungry, I'm cold, I'm scared.",
    cuando: "Universal.",
    ojo: "«I have 30 years» se entiende como que posees treinta años de algo, y suena a traducción automática.",
    situacion: "Te preguntan la edad.",
    ejemplos: [["How old are you? — I'm 30.", "¿Cuántos años tienes? — Treinta."]],
  },
  {
    id: "err-agree",
    cat: "errores",
    mal: "I'm agree.",
    en: "I agree.",
    pron: "ái agrí",
    es: "Estoy de acuerdo.",
    porque:
      "«Agree» ya es un verbo entero, no un adjetivo. Como decimos «estoy de acuerdo», colocamos un «estoy» que en inglés sobra por completo.",
    cuando: "Universal, y es uno de los errores más repetidos.",
    ojo: "La negativa es «I don't agree» o «I disagree», nunca «I'm not agree».",
    situacion: "Alguien dice algo con lo que estás conforme.",
    ejemplos: [["I completely agree with you.", "Estoy totalmente de acuerdo contigo."]],
  },
  {
    id: "err-explain-me",
    cat: "errores",
    mal: "Explain me this.",
    en: "Explain this to me.",
    pron: "ekspléin dis tu mi",
    es: "Explícame esto.",
    porque:
      "«Explain» no admite persona pegada detrás: hay que meter «to». Lo mismo pasa con say, describe y suggest.",
    cuando: "Universal.",
    ojo:
      "Otros verbos sí lo admiten y por eso lía: «tell me», «give me», «show me» son correctos. Explain no está en ese grupo.",
    situacion: "Pides que te aclaren algo.",
    ejemplos: [["Can you explain the rules to me?", "¿Me puedes explicar las reglas?"]],
  },
  {
    id: "err-people-is",
    cat: "errores",
    mal: "People is nice here.",
    en: "People are nice here.",
    pron: "pípol ar náis jíer",
    es: "La gente es maja aquí.",
    porque:
      "«People» ya es el plural de «person»: son personas, en plural. El español lo trata como singular («la gente es») y de ahí el calco.",
    cuando: "Universal.",
    ojo: "Nunca «peoples» para hablar de personas. Ese plural existe pero significa pueblos o etnias.",
    situacion: "Describes cómo es la gente de un sitio.",
    ejemplos: [["The people I work with are great.", "La gente con la que trabajo es estupenda."]],
  },
  {
    id: "err-actually",
    cat: "errores",
    mal: "Actually I live in Madrid. (queriendo decir «actualmente»)",
    en: "Currently, I live in Madrid.",
    pron: "kérentli, ái liv in madrid",
    es: "Actualmente vivo en Madrid.",
    porque:
      "«Actually» no es «actualmente»: significa «en realidad», y se usa para corregir a alguien. Actualmente es «currently» o «right now».",
    cuando: "Universal. Es el falso amigo más peligroso porque no rompe la frase, la cambia de sentido.",
    ojo: "Si dices «actually, I live in Madrid» estás corrigiendo a tu interlocutor, no situándote en el tiempo.",
    situacion: "Cuentas dónde vives ahora mismo.",
    ejemplos: [["Actually, it's not that expensive.", "En realidad, no es tan caro."]],
  },
  {
    id: "err-how-is-called",
    cat: "errores",
    mal: "How is called this?",
    en: "What's this called?",
    pron: "uóts dis kold",
    es: "¿Cómo se llama esto?",
    porque:
      "El inglés pregunta por el nombre con «what», no con «how». «How» pregunta de qué manera, y un nombre no es una manera.",
    cuando: "Universal, muy útil cuando estás aprendiendo.",
    ojo: "Igual con las personas: «What's your name?», nunca «How is your name?».",
    situacion: "Señalas un objeto cuyo nombre no sabes.",
    ejemplos: [["What's this called in English?", "¿Cómo se llama esto en inglés?"]],
  },
  {
    id: "err-i-have-hunger",
    cat: "errores",
    mal: "I have hunger.",
    en: "I'm hungry.",
    pron: "áim jángri",
    es: "Tengo hambre.",
    porque:
      "Las sensaciones van con «be» y un adjetivo, no con «have» y un sustantivo. En español las tenemos; en inglés se está.",
    cuando: "Universal.",
    ojo: "Toda la familia igual: I'm thirsty (sed), I'm cold (frío), I'm sleepy (sueño), I'm scared (miedo), I'm right (razón).",
    situacion: "Estás en casa de alguien y quieres decir que tienes hambre.",
    ejemplos: [["I'm really thirsty. Do you have water?", "Tengo mucha sed. ¿Tienes agua?"]],
  },
  {
    id: "err-since-for",
    cat: "errores",
    mal: "I live here since 2020.",
    en: "I've lived here since 2020.",
    pron: "áiv livd jíer sins tuénti tuénti",
    es: "Vivo aquí desde 2020.",
    porque:
      "Algo que empezó antes y sigue pasando pide present perfect, no presente. El español usa el presente y por eso lo calcamos.",
    cuando: "Universal, y es un error muy visible.",
    ojo: "«Since» marca el punto de inicio (since 2020) y «for» la duración (for four years). No se mezclan.",
    situacion: "Dices cuánto tiempo llevas viviendo en un sitio.",
    ejemplos: [["I've worked here for three years.", "Llevo tres años trabajando aquí."]],
  },
  {
    id: "err-informations",
    cat: "errores",
    mal: "I need more informations.",
    en: "I need more information.",
    pron: "ái niid mor informéishon",
    es: "Necesito más información.",
    porque:
      "«Information» es incontable en inglés: no tiene plural ni lleva «an». Para contar unidades se dice «a piece of information».",
    cuando: "Universal, sobre todo en el trabajo.",
    ojo:
      "El mismo grupo: advice, news, furniture, luggage, homework, money. Ninguno lleva -s. «Advices» y «furnitures» no existen.",
    situacion: "Pides que te den más datos sobre algo.",
    ejemplos: [["That's very useful advice.", "Es un consejo muy útil."]],
  },
  {
    id: "err-depend-of",
    cat: "errores",
    mal: "It depends of the weather.",
    en: "It depends on the weather.",
    pron: "it dipénds on de uéder",
    es: "Depende del tiempo.",
    porque:
      "Cada verbo inglés lleva su preposición fija y no coincide con la española. «Depend» va con «on», aunque nosotros digamos «de».",
    cuando: "Universal.",
    ojo:
      "Otras del mismo tipo: listen TO (no listen), wait FOR (no wait), think ABOUT, dream ABOUT, arrive AT.",
    situacion: "Te preguntan si iréis a la playa mañana.",
    ejemplos: [["It depends on how much it costs.", "Depende de cuánto cueste."]],
  },
  {
    id: "err-im-boring",
    cat: "errores",
    mal: "I'm boring. (queriendo decir «me aburro»)",
    en: "I'm bored.",
    pron: "áim bord",
    es: "Estoy aburrido.",
    porque:
      "El -ED es lo que sientes tú; el -ING es lo que provoca la cosa. Así que «I'm boring» significa «soy aburrido», que es otra cosa muy distinta.",
    cuando: "Universal, y da lugar a malentendidos divertidos.",
    ojo: "Igual con interested/interesting, tired/tiring, confused/confusing, excited/exciting.",
    situacion: "Llevas una hora esperando sin nada que hacer.",
    ejemplos: [
      ["The movie was boring, so I got bored.", "La película era aburrida, así que me aburrí."],
    ],
  },
  {
    id: "err-do-a-question",
    cat: "errores",
    mal: "Can I do you a question?",
    en: "Can I ask you a question?",
    pron: "kan ái ask iu a kuéschon",
    es: "¿Te puedo hacer una pregunta?",
    porque:
      "Las preguntas no se hacen en inglés, se piden: el verbo es «ask». Es el mismo problema del «hacer» español, que se reparte entre do, make y otros verbos.",
    cuando: "Universal.",
    ojo: "«Ask» ya lleva la persona pegada sin preposición: «ask me», «ask him». Sin «to».",
    situacion: "Quieres preguntar algo en clase o en una reunión.",
    ejemplos: [["Can I ask you something?", "¿Te puedo preguntar una cosa?"]],
  },
  {
    id: "err-the-people",
    cat: "errores",
    mal: "The life is hard.",
    en: "Life is hard.",
    pron: "láif is jard",
    es: "La vida es dura.",
    porque:
      "Para hablar de algo en general, el inglés quita el artículo. El «the» solo aparece cuando se habla de algo concreto y conocido.",
    cuando: "Universal.",
    ojo:
      "Compara: «Life is hard» (la vida en general) frente a «The life of a nurse is hard» (esa vida concreta). Igual con «I like music», no «the music».",
    situacion: "Haces un comentario general sobre la vida.",
    ejemplos: [["I love coffee.", "Me encanta el café."]],
  },
  {
    id: "err-more-better",
    cat: "errores",
    mal: "This one is more better.",
    en: "This one is better.",
    pron: "dis uán is béter",
    es: "Este es mejor.",
    porque:
      "«Better» ya es el comparativo de «good»: lleva el «más» dentro. Ponerle «more» delante es decir «más mejor».",
    cuando: "Universal.",
    ojo:
      "Los adjetivos cortos hacen el comparativo con -er (cheaper, faster) y los largos con «more» (more expensive). Nunca las dos cosas a la vez.",
    situacion: "Comparas dos opciones y una te gusta más.",
    ejemplos: [["This phone is cheaper and more reliable.", "Este móvil es más barato y más fiable."]],
  },
  {
    id: "err-i-am-here-since",
    cat: "errores",
    mal: "I'm living here since two years.",
    en: "I've been living here for two years.",
    pron: "áiv bin líving jíer for tuu íers",
    es: "Llevo dos años viviendo aquí.",
    porque:
      "Nuestro «llevo + tiempo» no existe en inglés: se dice con present perfect continuous y «for» para la duración.",
    cuando: "Universal. Sale en cuanto te presentas a alguien.",
    ojo: "Duración → for. Punto de inicio → since. «Since two years» mezcla las dos y está mal.",
    situacion: "Cuentas cuánto tiempo llevas haciendo algo.",
    ejemplos: [["How long have you been studying English?", "¿Cuánto llevas estudiando inglés?"]],
  },
];

/** Índice rápido por id, para el juego y las tarjetas. */
export const FRASE_POR_ID = new Map(FRASES.map((f) => [f.id, f]));

/** Los contextos de las frases de situación, en el orden en que aparecen. */
export function contextosDe(cat) {
  const vistos = [];
  for (const f of FRASES) {
    if (f.cat === cat && f.contexto && !vistos.includes(f.contexto)) vistos.push(f.contexto);
  }
  return vistos;
}
