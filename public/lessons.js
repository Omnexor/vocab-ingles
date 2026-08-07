// Curso de gramática. Contenido fijo (no depende de la API) para que siempre
// esté disponible y sea correcto. Los ejercicios extra sí se generan con Claude.
//
// Tipos de bloque:
//   p        -> párrafo
//   formula  -> esquema de la estructura + ejemplo
//   table    -> tabla (head + rows)
//   examples -> frases de ejemplo con pronunciación y traducción
//   tip      -> consejo destacado
//   error    -> error típico de hispanohablantes (mal / bien / por qué)

export const LESSONS = [
  /* ------------------------------------------------------------------ */
  {
    id: "leer-pronunciacion",
    title: "Cómo leer las pronunciaciones",
    tag: "Empieza aquí",
    goal: "Entender el código que usa la app para escribir los sonidos ingleses.",
    blocks: [
      {
        t: "p",
        text: "Aquí no se usan símbolos fonéticos raros. Todo está escrito para que lo leas en voz alta con las reglas del español de España. Pero hay ocho sonidos ingleses que no existen en español, y conviene saber cómo se representan.",
      },
      {
        t: "table",
        head: ["Se escribe", "Suena como", "Ejemplo"],
        rows: [
          ["z", "la z española de «zapato» — la th de think", "worth = uérz"],
          ["d", "la d suave de «nada» — la th de this", "the = de, mother = máder"],
          ["j", "la j de «jamón», pero mucho más suave", "have = jav, here = jíer"],
          ["u", "la w inglesa", "what = uót, work = uérk"],
          ["v", "labiodental, mordiendo el labio (no es b)", "very = véri"],
          ["sh", "como en «Shakira»", "she = shi"],
          ["y", "la y de «yo»", "job = yob"],
          ["ii / uu", "vocal larga, se estira", "see = sii, food = fuud"],
        ],
      },
      {
        t: "tip",
        text: "La h española es muda, así que nunca se usa: «have» se escribe «jav», no «hav». Si ves una h en una pronunciación de esta app, es un error.",
      },
      {
        t: "error",
        wrong: "although = olzóu",
        right: "although = oldóu",
        why: "Hay dos «th» distintas en inglés. La sorda (think, worth, thought) se escribe con z porque en España la z suena igual. La sonora (this, that, the, although, therefore) vibra, y se escribe con d. Confundirlas es el fallo más común.",
      },
      {
        t: "examples",
        items: [
          { en: "I think that's worth it.", pron: "ai zink dats uérz it", es: "Creo que vale la pena." },
          { en: "The other one is here.", pron: "de á-der uán is jier", es: "El otro está aquí." },
        ],
      },
      {
        t: "p",
        text: "La tilde marca dónde va el golpe de voz. En inglés la sílaba fuerte importa muchísimo: si la pones donde no es, cuesta entenderte aunque los sonidos estén bien.",
      },
      {
        t: "examples",
        items: [
          { en: "Think about the weather.", pron: "zink a-báut de ué-der", es: "Piensa en el tiempo." },
          { en: "My brother has a house.", pron: "mái brá-der jas a jáus", es: "Mi hermano tiene una casa." },
          { en: "We work every week.", pron: "ui uérk év-ri uiik", es: "Trabajamos todas las semanas." },
        ],
      },
      {
        t: "tip",
        text: "Las tres que más te delatan: la H se pronuncia (jáus, no «aus»), la V no es B (very, no «beri») y la TH nunca es T ni D española pura: saca la lengua entre los dientes.",
      },
      {
        t: "p",
        text: "Los guiones parten las sílabas, y ahí hay una trampa española: tendemos a pronunciar todas las vocales que vemos escritas. En inglés muchas se caen. «Family» no es fa-mi-ly: son dos sílabas, fám-li. Cuenta los guiones y no metas ninguna de más.",
      },
      {
        t: "table",
        head: ["Palabra", "Lo que decimos", "Lo que es"],
        rows: [
          ["family", "fa-mi-li (3)", "fám-li (2)"],
          ["different", "di-fe-rent (3)", "dí-frent (2)"],
          ["chocolate", "cho-co-lat (3)", "chó-klat (2)"],
          ["restaurant", "res-to-rant (3)", "rés-trant (2)"],
          ["every", "e-ve-ri (3)", "év-ri (2)"],
          ["comfortable", "com-for-ta-bol (4)", "kámf-ta-bol (3)"],
        ],
      },
      {
        t: "p",
        text: "Y hay un sonido americano que no tiene letra propia: la T entre vocales. En Estados Unidos no suena T, suena exactamente como la R española de «pero». Por eso en esta app la verás escrita con r.",
      },
      {
        t: "examples",
        items: [
          { en: "I need some water.", pron: "ái niid sam uó-rer", es: "Necesito agua." },
          { en: "This city is better.", pron: "dis sí-ri is bé-rer", es: "Esta ciudad es mejor." },
          { en: "It's made of metal.", pron: "its méid ov mé-ral", es: "Está hecho de metal." },
        ],
      },
      {
        t: "error",
        wrong: "return = ri-térn ✓ (no cambia)",
        right: "water = uó-rer ✓ (sí cambia)",
        why: "La T solo se convierte en R cuando la sílaba de detrás es débil. En «return» la fuerza cae justo en «-turn», así que ahí la T suena T de verdad. Igual en hotel, attend o protect.",
      },
      {
        t: "tip",
        text: "La misma R aparece antes de L: little es «lí-rol» y bottle es «bó-rol», no «lítel» ni «bótel». En cambio detrás de otra R (thirty, forty, dirty) aquí se escribe con T aposta: «zér-ri» lo leerías con la rr de «perro», y eso suena peor que la t.",
      },
      {
        t: "p",
        text: "Un último aviso honesto: el inglés tiene DOS «a» y el español solo una, así que aquí las dos se escriben igual. La de «run» o «cut» es la a española de siempre. La de «ran» o «cat» se hace abriendo más la boca y adelantando la lengua, tirando a «e». Por eso drank y drunk salen los dos como «drank».",
      },
      {
        t: "examples",
        items: [
          { en: "I ran, and now I run every day.", pron: "ái ran, and náu ái ran év-ri déi", es: "Corrí, y ahora corro todos los días." },
          { en: "The cat cut its paw.", pron: "de kat kat its po", es: "El gato se cortó la pata." },
          { en: "She drank it, so it's drunk.", pron: "shi drank it, sóu its drank", es: "Se lo bebió, así que está bebido." },
        ],
      },
      {
        t: "tip",
        text: "Truco para las dos «a»: si en la palabra escrita hay una A (ran, cat, drank, sang), abre la boca. Si hay U (run, cut, drunk, sung), es la a española normal. Los verbos irregulares afectados lo avisan en su ficha.",
      },
    ],
    quiz: [
      { q: "«think» se escribe…", options: ["dink", "zink", "sink"], answer: 1, why: "Es th sorda: se escribe con z, que en España suena exactamente así." },
      { q: "«this» se escribe…", options: ["dis", "zis", "this"], answer: 0, why: "Es th sonora: siempre con d." },
      { q: "«have» se escribe…", options: ["hav", "jav", "av"], answer: 1, why: "La h española es muda, así que se usa j (suave)." },
      { q: "«what» se escribe…", options: ["guát", "uót", "juát"], answer: 1, why: "La w inglesa se representa con u." },
      { q: "¿Qué significa la tilde en «míiting»?", options: ["Que se alarga la i", "Dónde va el golpe de voz", "Que es plural"], answer: 1, why: "La tilde marca la sílaba tónica; la vocal larga se marca repitiendo la letra." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "orden-frase",
    title: "Cómo se ordena una frase",
    tag: "Base",
    goal: "Montar frases afirmativas, negativas y preguntas sin pensarlo.",
    blocks: [
      {
        t: "p",
        text: "El inglés es mucho más rígido que el español: el orden casi nunca cambia. Si te aprendes este esquema, tienes media batalla ganada.",
      },
      {
        t: "formula",
        parts: ["Sujeto", "Verbo", "Complemento"],
        example: "I drink coffee every morning.",
      },
      {
        t: "p",
        text: "En español puedes decir «café bebo yo por las mañanas» y se entiende. En inglés no: el sujeto va SIEMPRE delante del verbo, y nunca se omite.",
      },
      {
        t: "error",
        wrong: "Is raining.",
        right: "It is raining.",
        why: "En español el sujeto se puede omitir («llueve»). En inglés no: siempre hay que ponerlo, aunque no signifique nada. Ese «it» es obligatorio.",
      },
      {
        t: "p",
        text: "Para negar y para preguntar el inglés usa un verbo auxiliar (do, does, did, am/is/are, have, will, can…). El auxiliar es la pieza que se mueve.",
      },
      {
        t: "table",
        head: ["", "Estructura", "Ejemplo"],
        rows: [
          ["Afirmativa", "Sujeto + verbo", "She works here."],
          ["Negativa", "Sujeto + auxiliar + not + verbo", "She does not work here."],
          ["Pregunta", "Auxiliar + sujeto + verbo", "Does she work here?"],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "They live in Madrid.", pron: "déi liv in ma-drid", es: "Viven en Madrid." },
          { en: "They don't live in Madrid.", pron: "déi dount liv in ma-drid", es: "No viven en Madrid." },
          { en: "Do they live in Madrid?", pron: "du déi liv in ma-drid", es: "¿Viven en Madrid?" },
        ],
      },
      {
        t: "tip",
        text: "Cuando el auxiliar aparece, el verbo principal vuelve a su forma base: «Does she works?» está mal; es «Does she work?». La -s ya la lleva el «does».",
      },
    ],
    quiz: [
      { q: "¿Cuál está bien escrita?", options: ["Works she here?", "Does she work here?", "Does she works here?"], answer: 1, why: "El auxiliar «does» ya lleva la marca de tercera persona, así que el verbo va en forma base." },
      { q: "Completa: «___ is cold today.»", options: ["Ø (nada)", "It", "There"], answer: 1, why: "El inglés siempre necesita sujeto, aunque no signifique nada. «It is cold today.»" },
      { q: "Pasa a negativa: «We understand.»", options: ["We not understand.", "We don't understand.", "We doesn't understand."], answer: 1, why: "Con «we» el auxiliar es «do» → «don't»." },
      { q: "¿Dónde va el sujeto en una pregunta?", options: ["Delante del auxiliar", "Entre el auxiliar y el verbo", "Al final"], answer: 1, why: "Auxiliar + sujeto + verbo: «Do you know?»" },
      { q: "¿Cuál es correcta?", options: ["Every day I coffee drink.", "I drink coffee every day.", "Coffee I drink every day."], answer: 1, why: "Sujeto + verbo + complemento. El tiempo (every day) va al principio o al final, nunca en medio." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "presente-simple",
    title: "Presente simple",
    tag: "Presente",
    goal: "Hablar de rutinas, hechos y cosas que son verdad siempre.",
    blocks: [
      {
        t: "p",
        text: "Se usa para lo habitual y lo permanente: lo que haces cada día, lo que eres, lo que es verdad en general.",
      },
      {
        t: "table",
        head: ["", "Forma", "Ejemplo"],
        rows: [
          ["I / you / we / they", "verbo base", "I work from home."],
          ["he / she / it", "verbo + -s", "He works from home."],
          ["Negativa", "don't / doesn't + base", "She doesn't work on Fridays."],
          ["Pregunta", "Do / Does + sujeto + base", "Do you work here?"],
        ],
      },
      {
        t: "tip",
        text: "La -s de la tercera persona es el error número uno de los hispanohablantes. Truco: he, she e it son «egoístas», siempre se quedan con la s.",
      },
      {
        t: "error",
        wrong: "He live in Barcelona.",
        right: "He lives in Barcelona.",
        why: "Tercera persona del singular: siempre -s. Y si el verbo acaba en -o, -ch, -sh, -ss o -x, se añade -es: goes, watches, finishes.",
      },
      {
        t: "examples",
        items: [
          { en: "I usually get up at seven.", pron: "ai yú-shua-li guet ap at sé-ven", es: "Normalmente me levanto a las siete." },
          { en: "She doesn't drink coffee.", pron: "shi dá-sent drink có-fi", es: "Ella no bebe café." },
          { en: "Does it rain a lot here?", pron: "das it réin a lot jier", es: "¿Llueve mucho aquí?" },
        ],
      },
      {
        t: "p",
        text: "Palabras que suelen acompañarlo: always, usually, often, sometimes, never, every day. Van delante del verbo principal (I always work) pero detrás del verbo «to be» (I am always late).",
      },
    ],
    quiz: [
      { q: "«My brother ___ in a bank.»", options: ["work", "works", "working"], answer: 1, why: "«My brother» = he → verbo + -s." },
      { q: "«They ___ TV in the morning.»", options: ["doesn't watch", "don't watch", "don't watches"], answer: 1, why: "Con «they» el auxiliar es «don't», y el verbo va en base." },
      { q: "¿Cuál lleva -es?", options: ["run", "go", "read"], answer: 1, why: "Verbos acabados en -o llevan -es: goes. También watches, finishes, misses." },
      { q: "¿Dónde va «always»?", options: ["I go always to the gym.", "I always go to the gym.", "Always I go to the gym."], answer: 1, why: "Los adverbios de frecuencia van entre el sujeto y el verbo principal." },
      { q: "«___ she speak French?»", options: ["Do", "Does", "Is"], answer: 1, why: "Tercera persona del singular en pregunta: «Does»." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "presente-continuo",
    title: "Presente continuo",
    tag: "Presente",
    goal: "Decir qué está pasando ahora mismo o estos días.",
    blocks: [
      {
        t: "formula",
        parts: ["Sujeto", "am / is / are", "verbo + -ing"],
        example: "I am working right now.",
      },
      {
        t: "p",
        text: "Es el equivalente a «estoy haciendo». Se usa para lo que ocurre en este momento, o para algo temporal que está pasando estos días aunque no justo ahora.",
      },
      {
        t: "table",
        head: ["", "Ejemplo", "Traducción"],
        rows: [
          ["Ahora mismo", "She is calling her boss.", "Está llamando a su jefe."],
          ["Estos días", "I'm learning English.", "Estoy aprendiendo inglés."],
          ["Plan cerrado", "We're flying to Rome on Friday.", "Volamos a Roma el viernes."],
        ],
      },
      {
        t: "tip",
        text: "Presente simple = costumbre. Presente continuo = ahora o temporal. «I work in a hotel» (es mi trabajo) vs «I'm working in a hotel» (este verano, temporalmente).",
      },
      {
        t: "error",
        wrong: "I am wanting a coffee.",
        right: "I want a coffee.",
        why: "Los verbos de estado no van en continuo: want, need, like, love, hate, know, believe, understand, remember, seem, belong.",
      },
      {
        t: "examples",
        items: [
          { en: "What are you doing?", pron: "uót ar yu dú-ing", es: "¿Qué estás haciendo?" },
          { en: "He isn't listening to me.", pron: "ji í-sent lí-se-ning tu mi", es: "No me está escuchando." },
          { en: "They're not coming tonight.", pron: "déir not cá-ming tu-náit", es: "No vienen esta noche." },
        ],
      },
    ],
    quiz: [
      { q: "«Look! It ___.»", options: ["rains", "is raining", "rain"], answer: 1, why: "Está pasando ahora mismo → presente continuo." },
      { q: "¿Cuál está MAL?", options: ["I'm knowing the answer.", "I'm reading a book.", "I'm staying with friends."], answer: 0, why: "«Know» es verbo de estado: se dice «I know the answer»." },
      { q: "«She ___ to work by bus every day.»", options: ["is going", "goes", "go"], answer: 1, why: "«Every day» indica costumbre → presente simple." },
      { q: "Forma -ing de «write»:", options: ["writeing", "writing", "writting"], answer: 1, why: "Los verbos acabados en -e muda pierden la e: write → writing, make → making." },
      { q: "«We ___ dinner at eight tonight.» (plan cerrado)", options: ["are having", "have", "will have"], answer: 0, why: "Para planes ya acordados con hora y fecha se usa el presente continuo." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "pasado-simple",
    title: "Pasado simple",
    tag: "Pasado",
    goal: "Contar lo que pasó: ayer, el año pasado, hace dos horas.",
    blocks: [
      {
        t: "p",
        text: "Acciones terminadas en un momento concreto del pasado. Si puedes decir cuándo pasó y ya acabó, es pasado simple.",
      },
      {
        t: "table",
        head: ["", "Estructura", "Ejemplo"],
        rows: [
          ["Afirmativa (regular)", "verbo + -ed", "I worked late yesterday."],
          ["Afirmativa (irregular)", "forma propia", "I went to Paris."],
          ["Negativa", "didn't + base", "I didn't go to Paris."],
          ["Pregunta", "Did + sujeto + base", "Did you go to Paris?"],
        ],
      },
      {
        t: "tip",
        text: "Con «did» y «didn't», el verbo vuelve a la forma base. «I didn't went» está mal; es «I didn't go». El pasado ya lo marca el «did».",
      },
      {
        t: "p",
        text: "Los irregulares hay que aprendérselos, no hay atajo. Estos son los que más vas a usar:",
      },
      {
        t: "table",
        head: ["Base", "Pasado", "Significado"],
        rows: [
          ["go", "went", "ir"],
          ["have", "had", "tener"],
          ["do", "did", "hacer"],
          ["say", "said", "decir"],
          ["get", "got", "conseguir / recibir"],
          ["make", "made", "hacer / fabricar"],
          ["take", "took", "coger / llevar"],
          ["see", "saw", "ver"],
          ["come", "came", "venir"],
          ["think", "thought", "pensar"],
          ["buy", "bought", "comprar"],
          ["give", "gave", "dar"],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "I saw her last night.", pron: "ai so jer last náit", es: "La vi anoche." },
          { en: "We didn't have time.", pron: "uí dí-dent jav táim", es: "No tuvimos tiempo." },
          { en: "Did you call him?", pron: "did yu col jim", es: "¿Le llamaste?" },
        ],
      },
      {
        t: "error",
        wrong: "Yesterday I have gone to the cinema.",
        right: "Yesterday I went to the cinema.",
        why: "Si dices cuándo pasó (yesterday, last week, in 2019, two hours ago), va en pasado simple, nunca en present perfect.",
      },
    ],
    quiz: [
      { q: "«She ___ me yesterday.»", options: ["call", "called", "did called"], answer: 1, why: "Verbo regular en pasado: call → called." },
      { q: "«I ___ understand the question.»", options: ["didn't understood", "didn't understand", "not understood"], answer: 1, why: "Después de «didn't» el verbo va en forma base." },
      { q: "Pasado de «buy»:", options: ["buyed", "bought", "buied"], answer: 1, why: "Irregular: buy → bought." },
      { q: "«___ they finish the project?»", options: ["Did", "Do", "Were"], answer: 0, why: "Pregunta en pasado con verbo normal → «Did»." },
      { q: "¿Cuál pide pasado simple?", options: ["I've lived here for years.", "I lived there in 2015.", "I have just arrived."], answer: 1, why: "«In 2015» es un momento concreto y terminado." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "pasado-continuo",
    title: "Pasado continuo",
    tag: "Pasado",
    goal: "Describir lo que estaba pasando cuando ocurrió otra cosa.",
    blocks: [
      {
        t: "formula",
        parts: ["Sujeto", "was / were", "verbo + -ing"],
        example: "I was cooking when you called.",
      },
      {
        t: "table",
        head: ["Sujeto", "Auxiliar"],
        rows: [
          ["I / he / she / it", "was"],
          ["you / we / they", "were"],
        ],
      },
      {
        t: "p",
        text: "Su uso estrella es combinarlo con el pasado simple: lo largo (lo que estaba pasando) va en continuo, y lo corto que lo interrumpe va en pasado simple.",
      },
      {
        t: "examples",
        items: [
          { en: "I was walking home when it started to rain.", pron: "ai uós uó-king jóum uén it stár-ted tu réin", es: "Iba andando a casa cuando empezó a llover." },
          { en: "What were you doing at ten?", pron: "uót uér yu dú-ing at ten", es: "¿Qué estabas haciendo a las diez?" },
          { en: "They weren't listening.", pron: "déi ué-rent lí-se-ning", es: "No estaban escuchando." },
        ],
      },
      {
        t: "tip",
        text: "«While» suele ir con el continuo y «when» con el simple: While I was working, the phone rang. When the phone rang, I was working.",
      },
    ],
    quiz: [
      { q: "«She ___ TV when I arrived.»", options: ["watched", "was watching", "is watching"], answer: 1, why: "La acción larga interrumpida va en pasado continuo." },
      { q: "«They ___ at the office at nine.»", options: ["was working", "were working", "were work"], answer: 1, why: "Con «they» el auxiliar es «were»." },
      { q: "Completa: «While I ___, the doorbell rang.»", options: ["slept", "was sleeping", "sleep"], answer: 1, why: "«While» pide normalmente el continuo." },
      { q: "¿Cuál es la acción corta?", options: ["I was reading", "the lights went out", "ambas"], answer: 1, why: "«The lights went out» interrumpe; va en pasado simple." },
      { q: "«___ you waiting for me?»", options: ["Was", "Were", "Did"], answer: 1, why: "Con «you» siempre «were», también en singular." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "present-perfect",
    title: "Present perfect (have + participio)",
    tag: "Pasado",
    goal: "Distinguir «I did» de «I have done», el lío clásico del español.",
    blocks: [
      {
        t: "formula",
        parts: ["Sujeto", "have / has", "participio"],
        example: "I have finished the report.",
      },
      {
        t: "p",
        text: "Se usa cuando el pasado conecta con el presente: no dices cuándo pasó, o la acción sigue teniendo efecto ahora. Es el tiempo que peor se traduce del español, así que fíate de la regla, no de la traducción.",
      },
      {
        t: "table",
        head: ["Uso", "Ejemplo", "Traducción"],
        rows: [
          ["Experiencia de vida", "I've been to Japan.", "He estado en Japón."],
          ["Resultado que se nota ahora", "She has lost her keys.", "Ha perdido las llaves (sigue sin ellas)."],
          ["Algo que sigue pasando", "We've lived here for ten years.", "Llevamos diez años viviendo aquí."],
          ["Muy reciente", "He has just left.", "Acaba de irse."],
        ],
      },
      {
        t: "tip",
        text: "La regla de oro: si dices CUÁNDO pasó, usa pasado simple. Si no lo dices, present perfect. «I have seen it yesterday» está mal → «I saw it yesterday».",
      },
      {
        t: "table",
        head: ["Palabra", "Uso", "Ejemplo"],
        rows: [
          ["ever", "en preguntas", "Have you ever tried sushi?"],
          ["never", "negación", "I've never been to London."],
          ["just", "hace un momento", "I've just finished."],
          ["already", "antes de lo esperado", "She has already left."],
          ["yet", "todavía (neg./preg., al final)", "Have you finished yet?"],
          ["for", "duración", "for three years"],
          ["since", "punto de inicio", "since 2020"],
        ],
      },
      {
        t: "error",
        wrong: "I am here since Monday.",
        right: "I have been here since Monday.",
        why: "Para algo que empezó en el pasado y sigue, el inglés usa present perfect, no presente. «Llevo aquí desde el lunes».",
      },
      {
        t: "examples",
        items: [
          { en: "Have you ever worked abroad?", pron: "jav yu é-ver uérkt a-bród", es: "¿Has trabajado alguna vez en el extranjero?" },
          { en: "I haven't seen him for weeks.", pron: "ai já-vent siin jim for uíiks", es: "Hace semanas que no lo veo." },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "I have lost my keys.", pron: "ai jav lost mái kiis", es: "He perdido las llaves (y sigo sin ellas)." },
          { en: "She has just arrived.", pron: "shi jas yast a-ráivd", es: "Acaba de llegar." },
          { en: "Have you ever tried sushi?", pron: "jav yu é-ver tráid sú-shi", es: "¿Has probado sushi alguna vez?" },
        ],
      },
      {
        t: "tip",
        text: "Si puedes añadir «cuándo» exacto (ayer, en 2019, a las cinco), NO es present perfect: es pasado simple. El present perfect vive en el «alguna vez / todavía / ya», sin fecha.",
      },
    ],
    quiz: [
      { q: "«I ___ my keys. I can't open the door.»", options: ["lost", "have lost", "was losing"], answer: 1, why: "El resultado afecta al presente: sigues sin poder abrir." },
      { q: "«She ___ to Italy last summer.»", options: ["has gone", "went", "has been"], answer: 1, why: "«Last summer» es un momento concreto → pasado simple." },
      { q: "¿for o since? «I've worked here ___ 2019.»", options: ["for", "since", "ago"], answer: 1, why: "«Since» + punto de inicio; «for» + duración (for five years)." },
      { q: "¿Dónde va «yet»?", options: ["Have you yet finished?", "Have you finished yet?", "Yet have you finished?"], answer: 1, why: "«Yet» va al final de la frase, en negativas y preguntas." },
      { q: "«He ___ arrived, he's in the hall.»", options: ["has just", "just has", "is just"], answer: 0, why: "«Just» va entre el auxiliar y el participio." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "futuro",
    title: "Futuro: will, going to y presente continuo",
    tag: "Futuro",
    goal: "Elegir bien entre las tres formas de hablar del futuro.",
    blocks: [
      {
        t: "p",
        text: "El inglés tiene tres futuros y no son intercambiables. La diferencia está en cuánta decisión previa hay.",
      },
      {
        t: "table",
        head: ["Forma", "Cuándo se usa", "Ejemplo"],
        rows: [
          ["will + base", "decisión en el momento, predicción, promesa, oferta", "I'll help you with that."],
          ["be going to + base", "intención ya decidida, o evidencia clara", "I'm going to start the gym."],
          ["presente continuo", "plan cerrado con fecha/hora", "I'm meeting Ana at six."],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "The phone is ringing — I'll get it.", pron: "de fóun is rín-ging — ail guet it", es: "Suena el teléfono, ya lo cojo yo." },
          { en: "Look at those clouds. It's going to rain.", pron: "luk at dóus cláuds. its góing tu réin", es: "Mira esas nubes. Va a llover." },
          { en: "We're flying to Lisbon on Monday.", pron: "uír fláiing tu lís-bon on mán-dei", es: "Volamos a Lisboa el lunes." },
        ],
      },
      {
        t: "tip",
        text: "¿Lo has decidido antes de esta conversación? → going to. ¿Lo decides ahora mismo, al hablar? → will.",
      },
      {
        t: "error",
        wrong: "When I will arrive, I'll call you.",
        right: "When I arrive, I'll call you.",
        why: "Después de when, if, as soon as, until, before y after NO se usa «will»: va presente aunque el sentido sea futuro.",
      },
      {
        t: "p",
        text: "Negativa y pregunta: won't (will not) y «Will you…?». Con going to: «I'm not going to…» / «Are you going to…?».",
      },
    ],
    quiz: [
      { q: "Alguien llama a la puerta. «___ open it.»", options: ["I'm going to", "I'll", "I open"], answer: 1, why: "Decisión tomada en el momento → will." },
      { q: "«I've bought the tickets. We ___ see the match on Sunday.»", options: ["will", "are going to", "go"], answer: 1, why: "Ya estaba decidido y hay pruebas (las entradas) → going to." },
      { q: "«Call me as soon as you ___.»", options: ["will arrive", "arrive", "are arriving"], answer: 1, why: "Después de «as soon as» no se usa will: va presente." },
      { q: "Negativa de «will»:", options: ["willn't", "won't", "don't will"], answer: 1, why: "will not → won't." },
      { q: "«I ___ the dentist at four tomorrow.» (cita cerrada)", options: ["will see", "am seeing", "see"], answer: 1, why: "Plan con hora y fecha ya acordado → presente continuo." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "modales",
    title: "Verbos modales",
    tag: "Modales",
    goal: "Expresar poder, deber, posibilidad y consejo.",
    blocks: [
      {
        t: "p",
        text: "Los modales (can, could, must, should, may, might, would) son especiales: nunca llevan -s, nunca llevan «to» detrás, y no necesitan «do» para negar o preguntar.",
      },
      {
        t: "formula",
        parts: ["Sujeto", "modal", "verbo base"],
        example: "She can speak three languages.",
      },
      {
        t: "table",
        head: ["Modal", "Significado", "Ejemplo"],
        rows: [
          ["can", "poder / saber hacer", "I can swim."],
          ["could", "podría / pasado de can / petición educada", "Could you help me?"],
          ["must", "obligación fuerte o deducción segura", "You must be tired."],
          ["have to", "obligación externa (norma, regla)", "I have to wear a uniform."],
          ["should", "consejo, recomendación", "You should see a doctor."],
          ["may", "permiso formal o posibilidad", "May I come in?"],
          ["might", "posibilidad más floja", "It might rain later."],
          ["would", "condicional, ofrecimientos", "I would love to come."],
        ],
      },
      {
        t: "error",
        wrong: "She can to drive. / He cans drive.",
        right: "She can drive.",
        why: "Después de un modal va el verbo desnudo: sin «to» y sin «-s», da igual la persona.",
      },
      {
        t: "tip",
        text: "must vs have to: «must» sale de ti (I must stop smoking), «have to» viene de fuera (I have to clock in at nine). Y ojo: «mustn't» es prohibición, «don't have to» es que no hace falta.",
      },
      {
        t: "examples",
        items: [
          { en: "You mustn't park here.", pron: "yu má-sent park jier", es: "No debes aparcar aquí (prohibido)." },
          { en: "You don't have to park here.", pron: "yu dount jav tu park jier", es: "No hace falta que aparques aquí." },
          { en: "Could you say that again, please?", pron: "cud yu séi dat a-guén plíis", es: "¿Podría repetirlo, por favor?" },
        ],
      },
    ],
    quiz: [
      { q: "«He can ___ the piano.»", options: ["to play", "play", "plays"], answer: 1, why: "Tras un modal, verbo base sin «to» y sin «-s»." },
      { q: "Prohibición: «You ___ smoke here.»", options: ["don't have to", "mustn't", "shouldn't"], answer: 1, why: "«Mustn't» = está prohibido. «Don't have to» = no es necesario." },
      { q: "Consejo: «You ___ take an umbrella.»", options: ["should", "must", "can"], answer: 0, why: "«Should» es la forma normal de aconsejar." },
      { q: "Petición educada:", options: ["Can you pass the salt?", "Could you pass the salt?", "Las dos, pero la 2ª es más educada"], answer: 2, why: "«Could» suena más cortés que «can», aunque ambas funcionan." },
      { q: "«It ___ rain, but I'm not sure.»", options: ["must", "might", "has to"], answer: 1, why: "«Might» expresa posibilidad no segura." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "condicionales",
    title: "Condicionales (if)",
    tag: "Estructuras",
    goal: "Hablar de hipótesis: lo que pasa, lo que pasará y lo que habría pasado.",
    blocks: [
      {
        t: "table",
        head: ["Tipo", "Estructura", "Ejemplo"],
        rows: [
          ["0 — verdad general", "If + presente, presente", "If you heat water, it boils."],
          ["1 — futuro posible", "If + presente, will + base", "If it rains, we'll stay home."],
          ["2 — hipótesis irreal", "If + pasado, would + base", "If I had money, I would travel."],
          ["3 — pasado imposible", "If + had + participio, would have + participio", "If I had studied, I would have passed."],
        ],
      },
      {
        t: "error",
        wrong: "If I will have time, I will call you.",
        right: "If I have time, I will call you.",
        why: "En la parte del «if» nunca va «will». El futuro solo aparece en la otra mitad de la frase.",
      },
      {
        t: "p",
        text: "El orden de las dos mitades da igual. Si empiezas por el «if», se separa con coma: «If it rains, we'll stay home» = «We'll stay home if it rains».",
      },
      {
        t: "examples",
        items: [
          { en: "If I were you, I'd accept the offer.", pron: "if ai uér yu, aid ak-sépt di ó-fer", es: "Yo que tú, aceptaría la oferta." },
          { en: "We would have come if we had known.", pron: "uí ud jav cam if uí jad nóun", es: "Habríamos venido si lo hubiéramos sabido." },
        ],
      },
      {
        t: "tip",
        text: "En el condicional 2 se dice «If I were» para todas las personas, no «If I was». Es la fórmula fija para dar consejos: «If I were you…».",
      },
      {
        t: "examples",
        items: [
          { en: "If it rains, we stay home.", pron: "if it réins ui stéi jóum", es: "Si llueve, nos quedamos en casa." },
          { en: "If I had money, I would travel.", pron: "if ai jad má-ni ai uúd trá-vel", es: "Si tuviera dinero, viajaría." },
          { en: "If I had studied, I would have passed.", pron: "if ai jad stá-did ai uúd jav past", es: "Si hubiera estudiado, habría aprobado." },
        ],
      },
      {
        t: "tip",
        text: "Nunca metas «will» en la parte del «if». Se dice «If it rains», no «If it will rain». El futuro va solo en la otra mitad de la frase.",
      },
    ],
    quiz: [
      { q: "«If it ___ tomorrow, we'll cancel.»", options: ["will rain", "rains", "rained"], answer: 1, why: "Condicional 1: if + presente, will + base." },
      { q: "«If I ___ rich, I would buy a boat.»", options: ["am", "was", "were"], answer: 2, why: "Condicional 2: se usa «were» para todas las personas." },
      { q: "«If she had left earlier, she ___ the train.»", options: ["would catch", "would have caught", "caught"], answer: 1, why: "Condicional 3: would have + participio." },
      { q: "«If you press this button, the machine ___.»", options: ["stops", "will stop", "would stop"], answer: 0, why: "Condicional 0: es una verdad que pasa siempre." },
      { q: "¿Qué está mal?", options: ["If I see him, I'll tell him.", "If I will see him, I'll tell him.", "I'll tell him if I see him."], answer: 1, why: "Nunca «will» dentro de la cláusula del if." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "preguntas",
    title: "Preguntas y respuestas cortas",
    tag: "Estructuras",
    goal: "Preguntar con naturalidad y contestar como un nativo.",
    blocks: [
      {
        t: "p",
        text: "Hay dos tipos: las de sí o no (empiezan por auxiliar) y las de información (empiezan por una palabra WH-).",
      },
      {
        t: "formula",
        parts: ["WH-", "auxiliar", "sujeto", "verbo"],
        example: "Where did you buy that?",
      },
      {
        t: "table",
        head: ["Palabra", "Pregunta por", "Ejemplo"],
        rows: [
          ["what", "qué", "What do you want?"],
          ["where", "dónde", "Where are you from?"],
          ["when", "cuándo", "When does it start?"],
          ["why", "por qué", "Why is he late?"],
          ["who", "quién", "Who called you?"],
          ["how", "cómo", "How did you find it?"],
          ["how long", "cuánto tiempo", "How long have you lived here?"],
          ["how much / many", "cuánto / cuántos", "How much does it cost?"],
        ],
      },
      {
        t: "error",
        wrong: "Where you are working?",
        right: "Where are you working?",
        why: "En inglés el auxiliar va delante del sujeto también en las preguntas con WH-. El orden es la parte que más cuesta.",
      },
      {
        t: "p",
        text: "Las respuestas cortas repiten el auxiliar, no el verbo. Contestar solo «Yes» suena seco.",
      },
      {
        t: "table",
        head: ["Pregunta", "Sí", "No"],
        rows: [
          ["Do you like it?", "Yes, I do.", "No, I don't."],
          ["Is she coming?", "Yes, she is.", "No, she isn't."],
          ["Have you finished?", "Yes, I have.", "No, I haven't."],
          ["Can he drive?", "Yes, he can.", "No, he can't."],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "How long have you been waiting?", pron: "jáu long jav yu bin uéi-ting", es: "¿Cuánto tiempo llevas esperando?" },
          { en: "What time does the meeting start?", pron: "uót táim das de míi-ting start", es: "¿A qué hora empieza la reunión?" },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "Where do you live?", pron: "uér du yu liv", es: "¿Dónde vives?" },
          { en: "What time does it start?", pron: "uót táim das it start", es: "¿A qué hora empieza?" },
          { en: "Why didn't you call me?", pron: "uái dí-dent yu kol mi", es: "¿Por qué no me llamaste?" },
        ],
      },
      {
        t: "tip",
        text: "Orden fijo: pregunta + auxiliar + sujeto + verbo. «Where DO YOU live». Si te sale «Where you live?», te falta el auxiliar, que es lo que más se olvida.",
      },
    ],
    quiz: [
      { q: "¿Cuál está bien?", options: ["Where you live?", "Where do you live?", "Where do you lives?"], answer: 1, why: "WH- + auxiliar + sujeto + verbo base." },
      { q: "Respuesta corta a «Are you ready?»", options: ["Yes, I'm.", "Yes, I am.", "Yes, I do."], answer: 1, why: "En las respuestas cortas afirmativas no se contrae: «Yes, I am»." },
      { q: "«___ does it cost?»", options: ["How many", "How much", "How long"], answer: 1, why: "«How much» para precio y para incontables." },
      { q: "Respuesta corta a «Has she called?»", options: ["No, she hasn't.", "No, she doesn't.", "No, she didn't."], answer: 0, why: "Se repite el mismo auxiliar de la pregunta: has → hasn't." },
      { q: "«___ told you that?» (pregunta por el sujeto)", options: ["Who did", "Who", "Whom did"], answer: 1, why: "Cuando preguntas por el sujeto no hace falta auxiliar: «Who told you that?»" },
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    id: "comparativos",
    title: "Comparativos y superlativos (-er / more)",
    tag: "Palabras",
    goal: "Saber cuándo es «taller» y cuándo «more expensive».",
    blocks: [
      {
        t: "p",
        text: "En español siempre decimos «más + adjetivo». En inglés depende del tamaño de la palabra: las cortas cambian de forma, las largas llevan «more» delante. Decir «more tall» suena tan raro como decir «más alto» en plan «alto más».",
      },
      {
        t: "table",
        head: ["Adjetivo", "Comparativo", "Superlativo"],
        rows: [
          ["1 sílaba: tall", "taller", "the tallest"],
          ["1 sílaba: cheap", "cheaper", "the cheapest"],
          ["Acaba en -y: happy", "happier", "the happiest"],
          ["Acaba en -y: easy", "easier", "the easiest"],
          ["2+ sílabas: expensive", "more expensive", "the most expensive"],
          ["2+ sílabas: difficult", "more difficult", "the most difficult"],
        ],
      },
      {
        t: "tip",
        text: "Regla rápida: si el adjetivo tiene una sílaba, o dos acabando en -y, se le pega -er. Todo lo demás lleva more. Con dos sílabas que no acaban en -y (quiet, clever, simple) valen las dos formas.",
      },
      {
        t: "p",
        text: "Si el adjetivo corto acaba en consonante + vocal + consonante, la última consonante se dobla: big → bigger, hot → hotter, thin → thinner.",
      },
      {
        t: "table",
        head: ["Irregular", "Comparativo", "Superlativo"],
        rows: [
          ["good", "better", "the best"],
          ["bad", "worse", "the worst"],
          ["far", "further / farther", "the furthest / farthest"],
          ["little", "less", "the least"],
          ["much / many", "more", "the most"],
        ],
      },
      {
        t: "formula",
        parts: ["A", "comparativo", "than", "B"],
        example: "This car is cheaper than mine.",
      },
      {
        t: "error",
        wrong: "She is more tall than me. / He is more better.",
        right: "She is taller than me. / He is better.",
        why: "Nunca se juntan las dos marcas. O cambias el adjetivo (-er) o pones «more», jamás las dos a la vez. Y «better» ya es comparativo por sí solo.",
      },
      {
        t: "p",
        text: "Para decir que dos cosas son iguales se usa «as … as», y para decir que no lo son, «not as … as».",
      },
      {
        t: "examples",
        items: [
          { en: "Today is hotter than yesterday.", pron: "tu-déi is jó-ter dan yés-ter-dei", es: "Hoy hace más calor que ayer." },
          { en: "It's the most expensive one.", pron: "its de móust iks-pén-siv uán", es: "Es el más caro." },
          { en: "She's as tall as her brother.", pron: "shis as tol as jer brá-der", es: "Es tan alta como su hermano." },
        ],
      },
    ],
    quiz: [
      { q: "«This bag is ___ than that one.» (cheap)", options: ["more cheap", "cheaper", "cheapest"], answer: 1, why: "«Cheap» tiene una sílaba: se le añade -er." },
      { q: "«It's the ___ movie of the year.» (interesting)", options: ["interestingest", "most interesting", "more interesting"], answer: 1, why: "Adjetivo largo: superlativo con «the most»." },
      { q: "Comparativo de «big»:", options: ["biger", "bigger", "more big"], answer: 1, why: "Consonante + vocal + consonante: se dobla la última letra." },
      { q: "Comparativo de «good»:", options: ["gooder", "more good", "better"], answer: 2, why: "Es irregular: good → better → the best." },
      { q: "«He isn't ___ as his sister.» (fast)", options: ["as fast", "faster", "more fast"], answer: 0, why: "La estructura de igualdad es «as + adjetivo + as»." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "plurales",
    title: "Plurales e incontables",
    tag: "Palabras",
    goal: "Formar plurales y dejar de decir «informations».",
    blocks: [
      {
        t: "table",
        head: ["Regla", "Ejemplo", "Plural"],
        rows: [
          ["Normal: + s", "book", "books"],
          ["Acaba en -s, -x, -ch, -sh: + es", "watch", "watches"],
          ["Consonante + y: -ies", "city", "cities"],
          ["Vocal + y: solo + s", "boy", "boys"],
          ["Acaba en -f / -fe: -ves", "knife", "knives"],
          ["Acaba en -o: + es (casi siempre)", "tomato", "tomatoes"],
        ],
      },
      {
        t: "table",
        head: ["Irregular", "Plural"],
        rows: [
          ["child", "children"],
          ["person", "people"],
          ["man / woman", "men / women"],
          ["foot / tooth", "feet / teeth"],
          ["mouse", "mice"],
          ["fish / sheep", "fish / sheep (no cambian)"],
        ],
      },
      {
        t: "p",
        text: "Y luego están los incontables: palabras que en inglés no tienen plural aunque en español sí. Es de los errores que más delatan a un español.",
      },
      {
        t: "error",
        wrong: "I need some informations. / He gave me two advices.",
        right: "I need some information. / He gave me two pieces of advice.",
        why: "Information, advice, news, money, furniture, luggage, homework, bread y work son incontables: nunca llevan -s ni «a». Para contarlos se usa «a piece of», «a bit of».",
      },
      {
        t: "tip",
        text: "«News» acaba en -s pero es singular: «The news is good», no «are good». Lo mismo con «mathematics» o «economics».",
      },
      {
        t: "examples",
        items: [
          { en: "There are three people waiting.", pron: "der ar zrii píi-pol uéi-ting", es: "Hay tres personas esperando." },
          { en: "I have a lot of homework.", pron: "ai jav a lot ov jóum-uerk", es: "Tengo muchos deberes." },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "The children are playing.", pron: "de chíl-dren ar pléiing", es: "Los niños están jugando." },
          { en: "I need two knives.", pron: "ai niid tuu náivs", es: "Necesito dos cuchillos." },
          { en: "The news is good.", pron: "de niús is gud", es: "La noticia es buena." },
        ],
      },
      {
        t: "tip",
        text: "«News», «information», «advice» y «furniture» son incontables: no llevan -s y van con verbo en singular. Decir «informations» es de los errores que más suenan a español.",
      },
    ],
    quiz: [
      { q: "Plural de «city»:", options: ["citys", "cities", "cityes"], answer: 1, why: "Consonante + y → se cambia por -ies." },
      { q: "Plural de «person»:", options: ["persons", "people", "peoples"], answer: 1, why: "Irregular: person → people." },
      { q: "¿Cuál está bien?", options: ["I need two informations.", "I need some information.", "I need an information."], answer: 1, why: "«Information» es incontable: ni plural ni «a»." },
      { q: "«The news ___ good.»", options: ["are", "is", "were"], answer: 1, why: "Aunque acabe en -s, «news» es singular." },
      { q: "Plural de «knife»:", options: ["knifes", "knives", "knifs"], answer: 1, why: "Acabados en -f o -fe cambian a -ves." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "ed-ing",
    title: "Adjetivos en -ed y en -ing",
    tag: "Palabras",
    goal: "No volver a decir «I am boring» queriendo decir otra cosa.",
    blocks: [
      {
        t: "p",
        text: "Muchos adjetivos ingleses vienen en pareja: uno acaba en -ed y otro en -ing. No significan lo mismo, y confundirlos cambia la frase por completo.",
      },
      {
        t: "formula",
        parts: ["-ed = cómo me siento", "-ing = cómo es la cosa"],
        example: "I'm bored because the movie is boring.",
      },
      {
        t: "table",
        head: ["-ed (persona)", "-ing (cosa)", "Significado"],
        rows: [
          ["bored", "boring", "aburrido / aburrida"],
          ["interested", "interesting", "interesado / interesante"],
          ["tired", "tiring", "cansado / cansador"],
          ["confused", "confusing", "confundido / confuso"],
          ["excited", "exciting", "ilusionado / emocionante"],
          ["surprised", "surprising", "sorprendido / sorprendente"],
          ["worried", "worrying", "preocupado / preocupante"],
        ],
      },
      {
        t: "error",
        wrong: "I am boring.",
        right: "I am bored.",
        why: "«I am boring» significa «soy una persona aburrida», que no es lo que querías decir. Si hablas de cómo TE SIENTES, siempre -ed.",
      },
      {
        t: "tip",
        text: "Truco: las personas sienten (-ed), las cosas provocan (-ing). Si puedes sustituirlo por «estoy…», va con -ed.",
      },
      {
        t: "examples",
        items: [
          { en: "I'm interested in this job.", pron: "aim ín-tres-tid in dis yob", es: "Me interesa este trabajo." },
          { en: "The trip was tiring.", pron: "de trip uós tái-ring", es: "El viaje fue agotador." },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "I'm interested in history.", pron: "aim ín-tres-ted in jís-to-ri", es: "Me interesa la historia." },
          { en: "The trip was tiring.", pron: "de trip uós tái-ring", es: "El viaje fue agotador." },
          { en: "She looked surprised.", pron: "shi lukt so-práisd", es: "Parecía sorprendida." },
        ],
      },
      {
        t: "tip",
        text: "-ED es lo que sientes tú (persona), -ING es lo que provoca la cosa. «I am bored» = me aburro; «I am boring» = soy aburrido. Confundirlos cambia mucho lo que dices de ti.",
      },
    ],
    quiz: [
      { q: "«The lesson was very ___.»", options: ["interested", "interesting", "interest"], answer: 1, why: "La lección es la cosa que provoca el interés: -ing." },
      { q: "«I was ___ by the news.»", options: ["surprising", "surprised", "surprise"], answer: 1, why: "Tú sientes la sorpresa: -ed." },
      { q: "«I am boring» significa…", options: ["Estoy aburrido", "Soy aburrido", "Me aburro"], answer: 1, why: "Con -ing describes cómo eres tú para los demás." },
      { q: "«That trip was really ___.»", options: ["tired", "tiring", "tire"], answer: 1, why: "El viaje causa el cansancio: -ing." },
      { q: "«She looks ___.» (preocupada)", options: ["worrying", "worried", "worry"], answer: 1, why: "Ella siente la preocupación: -ed." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "prefijos-sufijos",
    title: "Fabricar palabras: prefijos y sufijos",
    tag: "Palabras",
    goal: "Sacar cuatro palabras de una sola y entender las que no conoces.",
    blocks: [
      {
        t: "p",
        text: "Muchísimo vocabulario inglés se construye pegando piezas. Si te aprendes las piezas, multiplicas las palabras que entiendes sin estudiarlas una a una.",
      },
      {
        t: "table",
        head: ["Sufijo", "Convierte en", "Ejemplo"],
        rows: [
          ["-er / -or", "quien lo hace", "teach → teacher, act → actor"],
          ["-ly", "adverbio (cómo)", "quick → quickly, easy → easily"],
          ["-ness", "sustantivo abstracto", "happy → happiness, dark → darkness"],
          ["-ful", "lleno de", "help → helpful, care → careful"],
          ["-less", "sin", "help → helpless, use → useless"],
          ["-able / -ible", "que se puede", "comfort → comfortable"],
          ["-tion / -sion", "sustantivo de acción", "inform → information"],
          ["-ment", "sustantivo de acción", "improve → improvement"],
        ],
      },
      {
        t: "table",
        head: ["Prefijo", "Significa", "Ejemplo"],
        rows: [
          ["un-", "no / lo contrario", "happy → unhappy"],
          ["in- / im- / il- / ir-", "no", "possible → impossible, legal → illegal"],
          ["dis-", "lo contrario", "agree → disagree, like → dislike"],
          ["re-", "otra vez", "do → redo, read → reread"],
          ["over-", "de más", "work → overwork, cook → overcook"],
          ["under-", "de menos", "paid → underpaid"],
          ["mis-", "mal", "understand → misunderstand"],
        ],
      },
      {
        t: "tip",
        text: "Ojo con -ly: no todo lo que acaba en -ly es adverbio. «Friendly», «lovely» y «lonely» son adjetivos. Y «hard» ya es adverbio: «he works hard». «Hardly» significa otra cosa: «apenas».",
      },
      {
        t: "error",
        wrong: "He speaks very good English... he speaks English good.",
        right: "He speaks English well.",
        why: "«Good» es adjetivo y «well» es el adverbio. Los verbos se acompañan de adverbios: speak well, drive carefully, work hard.",
      },
      {
        t: "examples",
        items: [
          { en: "That's completely useless.", pron: "dats kam-plíit-li yúus-les", es: "Eso es completamente inútil." },
          { en: "I misunderstood the question.", pron: "ai mi-san-ders-túd de kués-chon", es: "Entendí mal la pregunta." },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "That's impossible to fix.", pron: "dats im-pó-si-bol tu fiks", es: "Eso es imposible de arreglar." },
          { en: "He was very careless.", pron: "ji uós vé-ri kér-les", es: "Fue muy descuidado." },
          { en: "Happiness is a choice.", pron: "já-pi-nes is a chóis", es: "La felicidad es una elección." },
        ],
      },
      {
        t: "tip",
        text: "-FUL es «lleno de» y -LESS es «sin»: careful (con cuidado) y careless (sin cuidado) son opuestos y solo cambian al final. Fíjate en la última sílaba antes de traducir.",
      },
    ],
    quiz: [
      { q: "Adverbio de «careful»:", options: ["carefuly", "carefully", "carefull"], answer: 1, why: "Se añade -ly a la palabra completa: careful + ly." },
      { q: "Lo contrario de «possible»:", options: ["unpossible", "impossible", "dispossible"], answer: 1, why: "Delante de p suele ir im-: impossible, impatient." },
      { q: "«Useless» significa…", options: ["muy útil", "inútil", "usado"], answer: 1, why: "-less significa «sin»: sin uso, inútil." },
      { q: "«He plays the guitar ___.»", options: ["good", "well", "goodly"], answer: 1, why: "Los verbos llevan adverbio: «well», no «good»." },
      { q: "¿Cuál NO es un adverbio?", options: ["quickly", "friendly", "slowly"], answer: 1, why: "«Friendly» acaba en -ly pero es adjetivo (simpático)." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "adjetivos-orden",
    title: "Adjetivos: dónde van y en qué orden",
    tag: "Palabras",
    goal: "Colocar los adjetivos donde los pone un nativo.",
    blocks: [
      {
        t: "p",
        text: "En español el adjetivo suele ir detrás («un coche rojo»). En inglés va SIEMPRE delante del sustantivo, y nunca lleva plural.",
      },
      {
        t: "error",
        wrong: "I have a car red. / Two reds cars.",
        right: "I have a red car. / Two red cars.",
        why: "El adjetivo va delante y es invariable: ni plural ni femenino, da igual el sustantivo.",
      },
      {
        t: "p",
        text: "Cuando hay varios, siguen un orden fijo que los nativos usan sin pensar. Rara vez se juntan más de tres, pero conviene conocerlo:",
      },
      {
        t: "formula",
        parts: ["opinión", "tamaño", "edad", "forma", "color", "origen", "material"],
        example: "a beautiful big old round brown Italian leather bag",
      },
      {
        t: "table",
        head: ["Tipo", "Ejemplos"],
        rows: [
          ["Opinión", "nice, beautiful, horrible, boring"],
          ["Tamaño", "big, small, tall, huge"],
          ["Edad", "new, old, young, ancient"],
          ["Color", "red, black, green"],
          ["Origen", "Spanish, American, Italian"],
          ["Material", "wooden, plastic, leather, metal"],
        ],
      },
      {
        t: "tip",
        text: "El adjetivo también puede ir detrás, pero solo después de verbos como be, seem, look, feel, sound: «The car is red», «You look tired».",
      },
      {
        t: "examples",
        items: [
          { en: "A nice little Spanish restaurant.", pron: "a náis lí-tel spá-nish rés-to-rant", es: "Un bonito restaurante español pequeño." },
          { en: "Those old wooden doors are heavy.", pron: "dóus óuld uú-den dors ar jé-vi", es: "Esas viejas puertas de madera pesan." },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "A beautiful old wooden table.", pron: "a biúu-ti-ful óuld uú-den téi-bol", es: "Una mesa de madera antigua y preciosa." },
          { en: "She has long dark hair.", pron: "shi jas long dark jer", es: "Tiene el pelo largo y oscuro." },
          { en: "It's a small red car.", pron: "its a smol red kar", es: "Es un coche rojo pequeño." },
        ],
      },
      {
        t: "tip",
        text: "Orden: opinión → tamaño → edad → color → material. «Nice big old brown leather bag». Si dudas, la opinión («nice», «beautiful») va siempre la primera.",
      },
    ],
    quiz: [
      { q: "¿Cuál está bien?", options: ["a house big", "a big house", "a big houses"], answer: 1, why: "El adjetivo va delante y el sustantivo mantiene su número." },
      { q: "«Tengo dos coches rojos»:", options: ["I have two reds cars.", "I have two red cars.", "I have two cars reds."], answer: 1, why: "Los adjetivos ingleses nunca llevan -s." },
      { q: "Orden correcto:", options: ["a leather black new bag", "a new black leather bag", "a black new leather bag"], answer: 1, why: "Edad → color → material." },
      { q: "¿Dónde puede ir detrás?", options: ["The red is car.", "The car is red.", "The car red is."], answer: 1, why: "Detrás de «be» y verbos de percepción sí va el adjetivo." },
      { q: "«a ___ table» (redonda, pequeña)", options: ["round small", "small round", "smalls round"], answer: 1, why: "Tamaño antes que forma: small round table." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "articulos",
    title: "Artículos: a, an, the y ninguno",
    tag: "Palabras",
    goal: "Quitar los «the» que sobran, que son muchos.",
    blocks: [
      {
        t: "table",
        head: ["Artículo", "Cuándo", "Ejemplo"],
        rows: [
          ["a / an", "uno cualquiera, la primera vez que se menciona", "I saw a dog."],
          ["the", "ese en concreto, ya sabemos cuál", "The dog was barking."],
          ["ninguno", "en general, en plural o incontable", "Dogs are loyal."],
        ],
      },
      {
        t: "tip",
        text: "«An» no depende de la letra sino del sonido: an hour (la h es muda), an MBA (se lee «em»), pero a university (suena «yu-») y a European country.",
      },
      {
        t: "p",
        text: "El error más común del español es meter «the» donde el inglés no pone nada. Cuando hablas de algo EN GENERAL, no lleva artículo.",
      },
      {
        t: "error",
        wrong: "The life is hard. / I like the music. / I play the soccer.",
        right: "Life is hard. / I like music. / I play soccer.",
        why: "Generalizaciones, incontables y plurales genéricos van sin artículo. Ojo con los instrumentos, que sí lo llevan: «I play the piano».",
      },
      {
        t: "table",
        head: ["Sin artículo", "Ejemplo"],
        rows: [
          ["Idiomas", "I speak English."],
          ["Comidas", "We had breakfast at eight."],
          ["Días y meses", "See you on Monday."],
          ["Deportes", "She plays tennis."],
          ["Países (casi todos)", "I live in Spain."],
          ["Ir a un sitio por su función", "go to school / to work / to bed"],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "I go to work by car.", pron: "ai góu tu uérk bai car", es: "Voy al trabajo en coche." },
          { en: "Money isn't everything.", pron: "má-ni í-sent év-ri-zing", es: "El dinero no lo es todo." },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "I go to school by bus.", pron: "ai góu tu skuul bái bas", es: "Voy al colegio en autobús." },
          { en: "She plays the piano.", pron: "shi pléis de piá-nou", es: "Toca el piano." },
          { en: "Life is beautiful.", pron: "láif is biúu-ti-ful", es: "La vida es bella." },
        ],
      },
      {
        t: "tip",
        text: "En generalizaciones el inglés quita el artículo: «Life is hard», «I like music», «Dogs are loyal». El español lo pone y ahí es donde se cuela el error.",
      },
    ],
    quiz: [
      { q: "«___ life is beautiful.» (en general)", options: ["The", "A", "(nada)"], answer: 2, why: "Generalización con incontable: sin artículo." },
      { q: "«I need ___ umbrella.»", options: ["a", "an", "the"], answer: 1, why: "«Umbrella» empieza por sonido vocálico: an." },
      { q: "«She's ___ university student.»", options: ["a", "an", "the"], answer: 0, why: "«University» suena «yu-», que es sonido consonántico: a." },
      { q: "«I play ___ guitar.»", options: ["(nada)", "the", "a"], answer: 1, why: "Los instrumentos musicales sí llevan «the»." },
      { q: "«He goes to ___ bed at eleven.»", options: ["the", "a", "(nada)"], answer: 2, why: "«Go to bed», «go to work», «go to school»: sin artículo." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "past-perfect",
    title: "Past perfect (had + participio)",
    tag: "Pasado",
    goal: "Contar qué había pasado antes de otro momento del pasado.",
    blocks: [
      {
        t: "p",
        text: "Es el pasado del pasado: sirve para marcar cuál de dos acciones pasadas ocurrió ANTES. Si cuentas dos cosas que pasaron hace tiempo, la más antigua va en past perfect.",
      },
      {
        t: "formula",
        parts: ["Sujeto", "had", "participio"],
        example: "The train had already left when I arrived.",
      },
      {
        t: "table",
        head: ["Acción", "Tiempo"],
        rows: [
          ["La más antigua (pasó primero)", "had + participio"],
          ["La más reciente (pasó después)", "pasado simple"],
        ],
      },
      {
        t: "tip",
        text: "«Had» es igual para todas las personas, y el participio es el mismo que usas en present perfect: had gone, had eaten, had finished.",
      },
      {
        t: "error",
        wrong: "When I arrived, the movie already started.",
        right: "When I arrived, the movie had already started.",
        why: "Dos pasados simples no dejan claro cuál ocurrió antes. «Had» marca sin ambigüedad la acción anterior.",
      },
      {
        t: "examples",
        items: [
          { en: "The train had already left when I arrived.", pron: "de tréin jad ol-ré-di left uen ai a-ráivd", es: "El tren ya se había ido cuando llegué." },
          { en: "I had never seen snow before.", pron: "ai jad né-ver siin snóu bi-fór", es: "Nunca había visto nieve antes." },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "The movie had started when we arrived.", pron: "de múu-vi jad stár-ted uen ui a-ráivd", es: "La película había empezado cuando llegamos." },
          { en: "I had never seen the sea.", pron: "ai jad né-ver siin de sii", es: "Nunca había visto el mar." },
          { en: "She had finished before noon.", pron: "shi jad fí-nisht bi-fór nuun", es: "Había terminado antes del mediodía." },
        ],
      },
      {
        t: "tip",
        text: "Es el «pasado del pasado». Si en una historia ya estás en pasado y necesitas ir aún más atrás, ahí entra «had + participio».",
      },
    ],
    quiz: [
      { q: "«By the time we arrived, the movie ___.» (start)", options: ["started", "had started", "has started"], answer: 1, why: "La película empezó ANTES de que llegáramos: had + participio." },
      { q: "Elige el orden correcto:", options: ["I had already eaten breakfast.", "I already had eaten breakfast.", "I had eaten already breakfast."], answer: 0, why: "«Already» va entre had y el participio." },
      { q: "Past perfect de «go» (ella):", options: ["she had went", "she had gone", "she has gone"], answer: 1, why: "El participio de go es gone, no went (que es el pasado simple)." },
      { q: "«She had left before I arrived.» ¿Qué pasó primero?", options: ["Ella se fue", "Yo llegué", "Pasaron a la vez"], answer: 0, why: "Had + participio marca la acción anterior: ella se fue primero." },
      { q: "«I ___ never flown before that trip.»", options: ["was", "had", "have"], answer: 1, why: "Hecho anterior a un momento pasado (that trip) → past perfect con had." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "present-perfect-continuous",
    title: "Present perfect continuous (have been + -ing)",
    tag: "Pasado",
    goal: "Poner el foco en cuánto tiempo llevas haciendo algo, no solo en el resultado.",
    blocks: [
      {
        t: "p",
        text: "Se usa cuando importa la DURACIÓN o el proceso, no el resultado o la cantidad. Compáralo con el present perfect simple que ya conoces.",
      },
      {
        t: "formula",
        parts: ["Sujeto", "have/has", "been", "verbo-ing"],
        example: "I have been studying English for two years.",
      },
      {
        t: "table",
        head: ["", "Present perfect simple", "Present perfect continuous"],
        rows: [
          ["Foco", "el resultado, cuántas veces", "la duración, el proceso"],
          ["Ejemplo", "I've read three books.", "I've been reading all day."],
        ],
      },
      {
        t: "tip",
        text: "Los verbos de estado (know, believe, love, want) no van en continuo, ni siquiera aquí: se dice «I have known her for years», nunca «I have been knowing».",
      },
      {
        t: "error",
        wrong: "I know her since 2015.",
        right: "I've known her since 2015.",
        why: "Con since/for y una acción que sigue, hace falta present perfect (simple o continuo), nunca presente simple.",
      },
      {
        t: "examples",
        items: [
          { en: "It's been raining all morning.", pron: "its bin réi-ning ol mór-ning", es: "Ha estado lloviendo toda la mañana." },
          { en: "How long have you been waiting?", pron: "jáu long jav yu bin uéi-ting", es: "¿Cuánto tiempo llevas esperando?" },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "I've been waiting for an hour.", pron: "aiv bin uéi-ting for an áu-er", es: "Llevo una hora esperando." },
          { en: "She's been working here since May.", pron: "shis bin uér-king jier sins méi", es: "Lleva trabajando aquí desde mayo." },
          { en: "It's been raining all day.", pron: "its bin réi-ning ol déi", es: "Lleva lloviendo todo el día." },
        ],
      },
      {
        t: "tip",
        text: "Es el «llevo + gerundio» del español: «llevo una hora esperando» = «I've been waiting for an hour». En cuanto veas «llevo… haciendo», es este tiempo.",
      },
    ],
    quiz: [
      { q: "«I ___ for you for twenty minutes!»", options: ["wait", "have been waiting", "am waiting"], answer: 1, why: "Duración desde el pasado hasta ahora, con foco en el proceso → present perfect continuous." },
      { q: "¿Cuál pone el foco en el RESULTADO, no en la duración?", options: ["I've been cleaning the house.", "I've cleaned the house.", "I'm cleaning the house."], answer: 1, why: "El present perfect simple (sin been+ing) se centra en que ya está hecho." },
      { q: "«She's been working here ___ 2020.»", options: ["for", "since", "during"], answer: 1, why: "Since + punto de inicio, igual que en present perfect simple." },
      { q: "¿Cuál está mal?", options: ["I've been knowing him for years.", "I've known him for years.", "I've been living here for years."], answer: 0, why: "Know es verbo de estado: nunca en forma continua." },
      { q: "«Why are you out of breath? — ___»", options: ["I run.", "I've been running.", "I am running since an hour."], answer: 1, why: "Explica una acción reciente cuyo efecto se nota ahora, sin aliento." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "voz-pasiva",
    title: "Voz pasiva (be + participio)",
    tag: "Estructuras",
    goal: "Poner el foco en la acción o en quién la recibe, no en quién la hace.",
    blocks: [
      {
        t: "p",
        text: "En español decimos «se construyó» o «fue construido»; en inglés, be (en el tiempo que toque) + participio. Se usa mucho cuando no importa o no se sabe quién hizo la acción.",
      },
      {
        t: "formula",
        parts: ["Sujeto (quien recibe)", "be", "participio"],
        example: "The house was built in 1990.",
      },
      {
        t: "table",
        head: ["Tiempo", "Activa", "Pasiva"],
        rows: [
          ["Presente simple", "They clean the office every day.", "The office is cleaned every day."],
          ["Pasado simple", "Someone stole my bike.", "My bike was stolen."],
          ["Present perfect", "They have canceled the flight.", "The flight has been canceled."],
          ["Futuro (will)", "They will announce the results.", "The results will be announced."],
        ],
      },
      {
        t: "tip",
        text: "«By + agente» solo se añade si importa decir quién hizo la acción: «The window was broken by my brother.» Si no importa o no se sabe, se omite.",
      },
      {
        t: "error",
        wrong: "The letter was wrote yesterday.",
        right: "The letter was written yesterday.",
        why: "Tras «be» siempre va el PARTICIPIO (written), no el pasado simple (wrote).",
      },
      {
        t: "examples",
        items: [
          { en: "English is spoken all over the world.", pron: "ín-glish is spóu-ken ol óu-ver de uérld", es: "El inglés se habla en todo el mundo." },
          { en: "This song was written by a famous band.", pron: "dis song uós rí-ten bai a féi-mos band", es: "Esta canción fue escrita por una banda famosa." },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "The house was built in 1920.", pron: "de jáus uós bilt in náin-tíin tuén-ti", es: "La casa fue construida en 1920." },
          { en: "English is spoken here.", pron: "ín-glish is spóu-ken jier", es: "Aquí se habla inglés." },
          { en: "My car has been stolen.", pron: "mái kar jas bin stóu-len", es: "Me han robado el coche." },
        ],
      },
      {
        t: "tip",
        text: "El «se» impersonal del español suele ser pasiva en inglés: «se habla inglés» → «English is spoken». No lo traduzcas con «it».",
      },
    ],
    quiz: [
      { q: "«The car ___ in Germany.»", options: ["makes", "is made", "made"], answer: 1, why: "No importa quién lo fabrica, el coche RECIBE la acción → be + participio." },
      { q: "Pasiva de «Someone broke the window.»", options: ["The window broke.", "The window was broken.", "The window is breaking."], answer: 1, why: "Be (was) + participio (broken)." },
      { q: "¿Cuándo se usa «by»?", options: ["Siempre, es obligatorio", "Solo si importa decir quién hizo la acción", "Nunca en pasiva"], answer: 1, why: "By + agente es opcional; se añade solo cuando aporta información relevante." },
      { q: "«The results ___ announced tomorrow.»", options: ["will", "will be", "are"], answer: 1, why: "Futuro en pasiva: will + be + participio." },
      { q: "¿Cuál está bien?", options: ["The email was sent yesterday.", "The email was send yesterday.", "The email was sended yesterday."], answer: 0, why: "El participio de send es sent, no send ni sended." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "estilo-indirecto",
    title: "Estilo indirecto (reported speech)",
    tag: "Estructuras",
    goal: "Contar lo que alguien dijo, sin citarlo entre comillas.",
    blocks: [
      {
        t: "p",
        text: "Cuando cuentas lo que alguien dijo (sin comillas), casi todo se mueve un paso hacia atrás en el tiempo: el presente pasa a pasado, el pasado a past perfect, etc. Es el «reported speech» o estilo indirecto.",
      },
      {
        t: "formula",
        parts: ["said/told", "that", "[tiempo un paso atrás]"],
        example: "\"I'm tired\" → She said (that) she was tired.",
      },
      {
        t: "table",
        head: ["Dijo (estilo directo)", "Cuentas (estilo indirecto)"],
        rows: [
          ["\"I am tired.\"", "She said she was tired."],
          ["\"I work here.\"", "He said he worked there."],
          ["\"I have finished.\"", "She said she had finished."],
          ["\"I will call you.\"", "He said he would call me."],
          ["\"I can help.\"", "She said she could help."],
        ],
      },
      {
        t: "tip",
        text: "También cambian palabras de lugar y tiempo: «here» → there, «now» → then, «today» → that day, «tomorrow» → the next day.",
      },
      {
        t: "error",
        wrong: "She said that she is happy.",
        right: "She said that she was happy.",
        why: "Al contar lo que alguien dijo, el presente retrocede a pasado, aunque en español digamos «dijo que está contenta» tal cual.",
      },
      {
        t: "examples",
        items: [
          { en: "He said he would be late.", pron: "ji sed ji uud bi léit", es: "Dijo que llegaría tarde." },
          { en: "She told me she had already eaten.", pron: "shi tóuld mi shi jad ol-ré-di í-ten", es: "Me dijo que ya había comido." },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "He said he was tired.", pron: "ji sed ji uós tái-erd", es: "Dijo que estaba cansado." },
          { en: "She told me she would come.", pron: "shi tóuld mi shi uúd kam", es: "Me dijo que vendría." },
          { en: "They asked where I lived.", pron: "déi askt uér ai livd", es: "Preguntaron dónde vivía." },
        ],
      },
      {
        t: "tip",
        text: "Todo retrocede un paso: presente → pasado, will → would, can → could. Y en las preguntas indirectas desaparece el auxiliar: «where I lived», no «where did I live».",
      },
    ],
    quiz: [
      { q: "\"I live in Madrid.\" → He said…", options: ["he lives in Madrid.", "he lived in Madrid.", "he live in Madrid."], answer: 1, why: "Presente → pasado en estilo indirecto." },
      { q: "\"I will help you.\" → She said…", options: ["she will help me.", "she would help me.", "she helped me."], answer: 1, why: "Will → would." },
      { q: "\"I can swim.\" → He said…", options: ["he can swim.", "he could swim.", "he cans swim."], answer: 1, why: "Can → could." },
      { q: "Say vs tell: ¿cuál lleva a la persona justo detrás?", options: ["say", "tell", "las dos igual"], answer: 1, why: "«Tell someone» (tell me, tell her); «say» no lleva a la persona directamente (say to me)." },
      { q: "\"I am working today.\" → He said…", options: ["he was working today.", "he was working that day.", "he is working that day."], answer: 1, why: "Presente → pasado, y today → that day." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "gerundio-infinitivo",
    title: "Gerundio o infinitivo: -ing o to + verbo",
    tag: "Palabras",
    goal: "Saber si después de un verbo va -ing o to + infinitivo.",
    blocks: [
      {
        t: "p",
        text: "Algunos verbos siempre van seguidos de -ing, otros siempre de to + infinitivo, y unos pocos aceptan las dos formas, a veces cambiando el significado. No hay una regla única: hay que aprenderse los grupos.",
      },
      {
        t: "table",
        head: ["Verbo + -ing", "Ejemplo"],
        rows: [
          ["enjoy", "I enjoy reading."],
          ["finish", "She finished working at six."],
          ["avoid", "We avoided talking about it."],
          ["suggest", "He suggested going by train."],
          ["mind", "Do you mind waiting?"],
        ],
      },
      {
        t: "table",
        head: ["Verbo + to + infinitivo", "Ejemplo"],
        rows: [
          ["want", "I want to travel."],
          ["decide", "They decided to leave."],
          ["hope", "She hopes to pass the exam."],
          ["promise", "I promise to call you."],
          ["need", "We need to talk."],
        ],
      },
      {
        t: "tip",
        text: "Después de una preposición siempre va -ing, nunca to + infinitivo: «I'm interested in learning English», no «to learn».",
      },
      {
        t: "p",
        text: "Ojo con los que cambian de significado: «stop doing» es dejar de hacer algo; «stop to do» es parar PARA hacer otra cosa. «I stopped smoking» (dejé de fumar) no es lo mismo que «I stopped to smoke» (paré para fumar).",
      },
      {
        t: "error",
        wrong: "I enjoy to cook.",
        right: "I enjoy cooking.",
        why: "Enjoy siempre va con -ing, nunca con to + infinitivo.",
      },
      {
        t: "examples",
        items: [
          { en: "I'm thinking of moving abroad.", pron: "aim zín-king ov múu-ving a-bród", es: "Estoy pensando en mudarme al extranjero." },
          { en: "She stopped to answer the phone.", pron: "shi stopt tu án-ser de fóun", es: "Dejó lo que hacía para contestar al teléfono." },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "I enjoy cooking.", pron: "ai in-yói kú-king", es: "Disfruto cocinando." },
          { en: "We decided to leave.", pron: "ui di-sái-ded tu liiv", es: "Decidimos irnos." },
          { en: "I'm looking forward to seeing you.", pron: "aim lú-king fór-uard tu síing yu", es: "Tengo ganas de verte." },
        ],
      },
      {
        t: "tip",
        text: "Tras preposición, SIEMPRE gerundio: «good at cooking», «before leaving», «looking forward to seeing». El «to» de «looking forward to» es preposición, no infinitivo: por eso lleva -ing.",
      },
    ],
    quiz: [
      { q: "«I enjoy ___ before bed.» (read)", options: ["read", "to read", "reading"], answer: 2, why: "Enjoy siempre va con -ing." },
      { q: "«She decided ___ medicine.» (study)", options: ["studying", "to study", "study"], answer: 1, why: "Decide siempre va con to + infinitivo." },
      { q: "«I'm not interested in ___ a new car.» (buy)", options: ["buy", "to buy", "buying"], answer: 2, why: "Tras preposición (in) siempre -ing." },
      { q: "«I stopped ___ two years ago.» (dejé de fumar)", options: ["to smoke", "smoking", "smoke"], answer: 1, why: "Stop + -ing = dejar de hacer algo; stop + to = parar PARA hacer otra cosa." },
      { q: "¿Cuál está mal?", options: ["We avoided answering.", "We avoided to answer.", "We avoided the question."], answer: 1, why: "Avoid nunca lleva to + infinitivo, solo -ing o un sustantivo directo." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "pronombres-relativos",
    title: "Pronombres relativos: who, which, that, where",
    tag: "Estructuras",
    goal: "Unir dos frases dando información extra sobre una persona, cosa o lugar.",
    blocks: [
      {
        t: "p",
        text: "Sirven para no repetir el sustantivo y dar más información en la misma frase, como «que» o «donde» en español.",
      },
      {
        t: "table",
        head: ["Pronombre", "Para", "Ejemplo"],
        rows: [
          ["who", "personas", "The man who called is my uncle."],
          ["which", "cosas y animales", "The book which I bought is great."],
          ["that", "personas o cosas (más informal)", "The car that I sold was old."],
          ["whose", "posesión (de quien)", "That's the girl whose dog got lost."],
          ["where", "lugares", "This is the house where I grew up."],
        ],
      },
      {
        t: "tip",
        text: "«That» puede sustituir a «who» o «which» en frases especificativas (las que identifican de quién o qué hablamos), y es la opción más natural al hablar.",
      },
      {
        t: "p",
        text: "Cuando el pronombre relativo NO es el sujeto de su propia frase, se puede omitir: «The book (that) I bought is great» — aquí «I» ya es el sujeto, así que «that» es opcional.",
      },
      {
        t: "error",
        wrong: "The woman which called was rude.",
        right: "The woman who called was rude.",
        why: "Para personas se usa who (o that), nunca which — which es solo para cosas y animales.",
      },
      {
        t: "examples",
        items: [
          { en: "That's the restaurant where we met.", pron: "dats de rés-to-rant uér uí met", es: "Ese es el restaurante donde nos conocimos." },
          { en: "I have a friend whose brother is a doctor.", pron: "ai jav a frend jus brá-der is a dóc-tor", es: "Tengo un amigo cuyo hermano es médico." },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "The man who called is my boss.", pron: "de man juu kold is mái bos", es: "El hombre que llamó es mi jefe." },
          { en: "The book that I read was great.", pron: "de buk dat ai red uós gréit", es: "El libro que leí era genial." },
          { en: "That's the place where we met.", pron: "dats de pléis uér ui met", es: "Ese es el sitio donde nos conocimos." },
        ],
      },
      {
        t: "tip",
        text: "En español todo es «que». En inglés depende: WHO para personas, THAT/WHICH para cosas, WHERE para lugares y WHOSE para posesión.",
      },
    ],
    quiz: [
      { q: "«The man ___ lives next door is a teacher.»", options: ["which", "who", "where"], answer: 1, why: "Persona → who." },
      { q: "«This is the café ___ we had our first date.»", options: ["who", "which", "where"], answer: 2, why: "Lugar → where." },
      { q: "«I lost the keys ___ you gave me.»", options: ["who", "that", "whose"], answer: 1, why: "Cosa → that (o which); who es solo para personas." },
      { q: "¿Se puede omitir el relativo en «The movie (that) I watched was great»?", options: ["Sí, porque that no es el sujeto de su propia frase", "No, nunca se puede omitir", "Solo en preguntas"], answer: 0, why: "Cuando el relativo no hace de sujeto en su propia cláusula, es opcional." },
      { q: "«That's the man ___ car was stolen.»", options: ["who", "whose", "which"], answer: 1, why: "Posesión (el coche DE ese hombre) → whose." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "used-to-would",
    title: "Used to y would para hábitos pasados",
    tag: "Pasado",
    goal: "Hablar de cosas que hacías antes y ya no haces.",
    blocks: [
      {
        t: "p",
        text: "«Used to» describe algo que era verdad o pasaba habitualmente en el pasado, pero ya no. Se traduce como «solía» o «antes + imperfecto».",
      },
      {
        t: "formula",
        parts: ["Sujeto", "used to", "verbo base"],
        example: "I used to play soccer every weekend.",
      },
      {
        t: "table",
        head: ["", "Estructura", "Ejemplo"],
        rows: [
          ["Afirmativa", "used to + base", "She used to smoke."],
          ["Negativa", "didn't use to + base", "She didn't use to smoke."],
          ["Pregunta", "Did…use to + base", "Did she use to smoke?"],
        ],
      },
      {
        t: "tip",
        text: "En negativa y pregunta se usa «use to» (sin d), porque el «did» ya marca el pasado — igual que con cualquier otro verbo detrás de did.",
      },
      {
        t: "p",
        text: "«Would» también sirve para hábitos pasados, pero solo para acciones repetidas, no para estados: se puede decir «I would visit my grandma every summer», pero no «I would live in Paris» — para estados hace falta used to.",
      },
      {
        t: "error",
        wrong: "I use to live in Paris.",
        right: "I used to live in Paris.",
        why: "En afirmativa siempre lleva la -d: used to. Sin ella, «use to» no es correcto ahí.",
      },
      {
        t: "examples",
        items: [
          { en: "We used to go camping every summer.", pron: "uí yuus-tu góu cám-ping év-ri sá-mer", es: "Antes íbamos de camping todos los veranos." },
          { en: "I didn't use to like coffee.", pron: "ai dí-dent yuus-tu láik có-fi", es: "Antes no me gustaba el café." },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "I used to smoke.", pron: "ai iúusd tu smóuk", es: "Antes fumaba." },
          { en: "We would go to the beach every summer.", pron: "ui uúd góu tu de biich év-ri sá-mer", es: "Íbamos a la playa cada verano." },
          { en: "She used to live in Paris.", pron: "shi iúusd tu liv in pá-ris", es: "Antes vivía en París." },
        ],
      },
      {
        t: "tip",
        text: "«Used to» vale para todo lo que ya no haces. «Would» solo para acciones repetidas, nunca para estados: se dice «I used to have a car», no «I would have a car».",
      },
    ],
    quiz: [
      { q: "«I ___ hate vegetables, but now I love them.»", options: ["use to", "used to", "was used to"], answer: 1, why: "Afirmativa siempre con -d: used to." },
      { q: "Negativa correcta:", options: ["She didn't used to travel much.", "She didn't use to travel much.", "She usedn't to travel much."], answer: 1, why: "Con did, el verbo vuelve a su forma base: use to (sin d)." },
      { q: "¿Cuál NO se puede decir con would?", options: ["I would visit my cousins every August.", "I would live in a small village.", "We would play cards after dinner."], answer: 1, why: "Would no se usa para ESTADOS (vivir en un sitio), solo para acciones repetidas; ahí hace falta used to." },
      { q: "«Did you ___ play an instrument as a kid?»", options: ["used to", "use to", "using to"], answer: 1, why: "Tras did, forma base: use to." },
      { q: "¿Qué NO expresa «used to»?", options: ["Un hábito pasado que ya no ocurre", "Un estado pasado que ya no es cierto", "Algo que sigue pasando ahora"], answer: 2, why: "Used to siempre marca algo que ya NO es así; para lo que sigue pasando se usa presente." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "cuantificadores",
    title: "Cuantificadores: much, many, some, any, a few, a little",
    tag: "Palabras",
    goal: "Elegir la palabra de cantidad correcta según el sustantivo y el tipo de frase.",
    blocks: [
      {
        t: "p",
        text: "Para decir «mucho/a», «poco/a» o «algo de» en inglés, hay que fijarse primero en si el sustantivo es contable (se puede contar: apples, books) o incontable (no se puede contar uno a uno: water, money, information).",
      },
      {
        t: "table",
        head: ["", "Contables (many)", "Incontables (much)"],
        rows: [
          ["Mucho/a", "many books", "much water"],
          ["Poco/a (casi nada)", "few books", "little water"],
          ["Un poco de (sí hay algo)", "a few books", "a little water"],
          ["Un montón de (vale para los dos)", "a lot of books", "a lot of water"],
        ],
      },
      {
        t: "tip",
        text: "«A few» y «few» no significan lo mismo: «a few» es positivo (tengo algunos, suficientes), «few» es negativo (casi no tengo). Lo mismo con «a little» y «little».",
      },
      {
        t: "p",
        text: "«Some» y «any» dependen del tipo de frase, no del sustantivo: some en afirmativas y ofrecimientos, any en negativas y preguntas normales.",
      },
      {
        t: "table",
        head: ["Tipo de frase", "Se usa", "Ejemplo"],
        rows: [
          ["Afirmativa", "some", "I have some money."],
          ["Negativa", "any", "I don't have any money."],
          ["Pregunta normal", "any", "Do you have any money?"],
          ["Ofrecimiento o petición", "some", "Could I have some water?"],
        ],
      },
      {
        t: "error",
        wrong: "I have any friends here.",
        right: "I have some friends here.",
        why: "En afirmativa se usa some, no any. Any va con negativas y preguntas.",
      },
      {
        t: "examples",
        items: [
          { en: "There isn't much time left.", pron: "der í-sent mach táim left", es: "No queda mucho tiempo." },
          { en: "I have a few questions.", pron: "ai jav a fiú kués-chons", es: "Tengo algunas preguntas." },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "There isn't much time.", pron: "der í-sent mach táim", es: "No hay mucho tiempo." },
          { en: "How many people came?", pron: "jáu mé-ni píi-pol kéim", es: "¿Cuánta gente vino?" },
          { en: "I have a few friends here.", pron: "ai jav a fiú frends jier", es: "Tengo algunos amigos aquí." },
        ],
      },
      {
        t: "tip",
        text: "MUCH para lo que no se cuenta (time, money, water), MANY para lo que sí (people, books, hours). Si puedes decir «dos», va MANY.",
      },
    ],
    quiz: [
      { q: "«How ___ sugar do you want?»", options: ["many", "much", "some"], answer: 1, why: "Sugar es incontable → much." },
      { q: "«There are ___ people in the room.»", options: ["much", "many", "little"], answer: 1, why: "People es contable (plural) → many." },
      { q: "«I have ___ money, so I can't buy it.» (casi nada)", options: ["a little", "little", "a few"], answer: 1, why: "«Little» (sin a) es negativo: casi no tengo." },
      { q: "«Would you like ___ coffee?» (ofrecimiento)", options: ["any", "some", "much"], answer: 1, why: "En ofrecimientos y peticiones, some, aunque sea pregunta." },
      { q: "«I don't have ___ questions.»", options: ["some", "any", "much"], answer: 1, why: "Negativa → any." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "preposiciones-tiempo-lugar",
    title: "Preposiciones de tiempo y lugar: in, on, at",
    tag: "Palabras",
    goal: "Saber cuál de las tres usar sin tener que pensarlo.",
    blocks: [
      {
        t: "p",
        text: "Son de las palabras más pequeñas y más difíciles de acertar en inglés, porque no siguen la lógica del español. Van de lo más general (in) a lo más concreto (at).",
      },
      {
        t: "table",
        head: ["Preposición", "Se usa con", "Ejemplo"],
        rows: [
          ["in", "meses, años, estaciones, partes del día", "in July, in 2020, in the morning"],
          ["on", "días y fechas concretas", "on Monday, on my birthday"],
          ["at", "horas concretas y momentos puntuales", "at six o'clock, at night, at Christmas"],
        ],
      },
      {
        t: "table",
        head: ["Preposición", "Se usa con (lugar)", "Ejemplo"],
        rows: [
          ["in", "espacios cerrados o grandes: ciudades, países", "in London, in the box"],
          ["on", "superficies: encima de algo", "on the table, on the wall"],
          ["at", "un punto concreto, una dirección", "at the bus stop, at 21 Baker Street"],
        ],
      },
      {
        t: "tip",
        text: "«At night» es una excepción que conviene memorizar: aunque night parece parte del día (como morning/afternoon, que van con in), night va con at.",
      },
      {
        t: "error",
        wrong: "I'll see you in Monday.",
        right: "I'll see you on Monday.",
        why: "Los días de la semana siempre van con on, no in.",
      },
      {
        t: "examples",
        items: [
          { en: "The meeting is at three o'clock on Friday.", pron: "de míi-ting is at zrii o-clók on frái-dei", es: "La reunión es a las tres el viernes." },
          { en: "I left my keys on the table.", pron: "ai left mai kiis on de téi-bol", es: "Dejé las llaves en la mesa." },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "I'll see you on Monday.", pron: "áil sii yu on mán-dei", es: "Te veo el lunes." },
          { en: "The meeting is at three.", pron: "de míi-ting is at zrii", es: "La reunión es a las tres." },
          { en: "She was born in July.", pron: "shi uós born in yu-lái", es: "Nació en julio." },
        ],
      },
      {
        t: "tip",
        text: "De grande a pequeño: IN para meses y años, ON para días y fechas, AT para horas y momentos concretos. Cuanto más preciso el momento, más corta la preposición.",
      },
    ],
    quiz: [
      { q: "«My birthday is ___ July.»", options: ["on", "in", "at"], answer: 1, why: "Meses → in." },
      { q: "«See you ___ Monday!»", options: ["in", "on", "at"], answer: 1, why: "Días de la semana → on." },
      { q: "«The shop closes ___ 9 pm.»", options: ["in", "on", "at"], answer: 2, why: "Horas concretas → at." },
      { q: "«I was born ___ Madrid.»", options: ["at", "on", "in"], answer: 2, why: "Ciudades → in." },
      { q: "«There's a picture ___ the wall.»", options: ["in", "on", "at"], answer: 1, why: "Superficie (encima de) → on." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "question-tags",
    title: "Preguntas coletilla: isn't it?, don't you?",
    tag: "Estructuras",
    goal: "Añadir ese «¿verdad?» o «¿no?» final que tanto se usa al hablar.",
    blocks: [
      {
        t: "p",
        text: "Son esas mini-preguntas que se añaden al final de una frase para confirmar algo o buscar que el otro esté de acuerdo, como «¿verdad?» en español. La regla de oro: si la frase es afirmativa, la coletilla es negativa, y al revés.",
      },
      {
        t: "formula",
        parts: ["Frase afirmativa", "+", "auxiliar negativo + pronombre"],
        example: "It's cold, isn't it?",
      },
      {
        t: "table",
        head: ["Frase", "Coletilla", "Por qué"],
        rows: [
          ["You're tired,", "aren't you?", "afirmativa → coletilla negativa"],
          ["She isn't coming,", "is she?", "negativa → coletilla afirmativa"],
          ["They can swim,", "can't they?", "usa el mismo auxiliar o modal de la frase"],
          ["You like pizza,", "don't you?", "sin auxiliar visible: se usa do/does/did"],
        ],
      },
      {
        t: "tip",
        text: "El auxiliar de la coletilla es siempre el mismo que llevaría esa frase en pregunta normal: si la frase usa «can», la coletilla usa can; si no hay auxiliar (presente o pasado simple), se usa do/does/did.",
      },
      {
        t: "error",
        wrong: "You are from Spain, isn't it?",
        right: "You are from Spain, aren't you?",
        why: "La coletilla concuerda con el SUJETO de la frase (you → you); no es una fórmula fija como en español.",
      },
      {
        t: "examples",
        items: [
          { en: "This is delicious, isn't it?", pron: "dis is di-lí-shos, í-sent it", es: "Esto está delicioso, ¿verdad?" },
          { en: "You haven't finished yet, have you?", pron: "yu já-vent fí-nisht yet, jav yu", es: "No has terminado todavía, ¿verdad?" },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "You're coming, aren't you?", pron: "yur ká-ming á-rent yu", es: "Vienes, ¿no?" },
          { en: "She doesn't smoke, does she?", pron: "shi dá-sent smóuk das shi", es: "No fuma, ¿verdad?" },
          { en: "It was expensive, wasn't it?", pron: "it uós iks-pén-siv uó-sent it", es: "Fue caro, ¿verdad?" },
        ],
      },
      {
        t: "tip",
        text: "En español todo es «¿no?» o «¿verdad?». En inglés la coletilla va al revés que la frase: afirmativa → negativa, y negativa → afirmativa. Siempre con el mismo auxiliar.",
      },
    ],
    quiz: [
      { q: "«It's a beautiful day, ___?»", options: ["is it", "isn't it", "isn't he"], answer: 1, why: "Afirmativa → coletilla negativa, mismo sujeto (it)." },
      { q: "«They don't live here, ___?»", options: ["do they", "don't they", "are they"], answer: 0, why: "Negativa → coletilla afirmativa: do they." },
      { q: "«She can drive, ___?»", options: ["can't she", "doesn't she", "isn't she"], answer: 0, why: "Se repite el mismo auxiliar o modal de la frase: can." },
      { q: "«You went to the party, ___?»", options: ["didn't you", "weren't you", "don't you"], answer: 0, why: "Pasado simple sin auxiliar visible → se usa did." },
      { q: "«Let's go, ___?»", options: ["don't we", "shall we", "won't we"], answer: 1, why: "Con «let's», la coletilla fija es siempre «shall we?»." },
    ],
  },
  {
    id: "there-is-are",
    title: "«Hay»: there is / there are",
    tag: "Estructuras",
    goal: "Dejar de decir «it has» cuando quieres decir «hay».",
    blocks: [
      {
        t: "p",
        text: "En español «hay» vale para uno y para muchos: hay un coche, hay tres coches. En inglés hay que elegir según lo que venga detrás, y además nunca se usa «have» para esto. «It has a problem» significa «él tiene un problema», no «hay un problema».",
      },
      {
        t: "formula",
        parts: ["There is", "singular / incontable"],
        example: "There is a problem with the car.",
      },
      {
        t: "formula",
        parts: ["There are", "plural"],
        example: "There are three people waiting.",
      },
      {
        t: "table",
        head: ["Tiempo", "Singular", "Plural"],
        rows: [
          ["Presente", "there is / there's", "there are"],
          ["Pasado", "there was", "there were"],
          ["Futuro", "there will be", "there will be"],
          ["Perfecto", "there has been", "there have been"],
          ["Con modal", "there might be", "there might be"],
        ],
      },
      {
        t: "tip",
        text: "En una lista, el verbo concuerda con lo PRIMERO que nombras: «There is a table and four chairs» (empieza en singular) pero «There are four chairs and a table».",
      },
      {
        t: "examples",
        items: [
          { en: "There's no milk left.", pron: "ders nóu milk left", es: "No queda leche." },
          { en: "There were a lot of people.", pron: "der uer a lot ov píi-pol", es: "Había mucha gente." },
          { en: "There will be a meeting on Friday.", pron: "der uil bi a míi-ting on frái-dei", es: "Habrá una reunión el viernes." },
        ],
      },
      {
        t: "error",
        wrong: "It has a lot of traffic today. / Have a problem.",
        right: "There is a lot of traffic today. / There is a problem.",
        why: "«Hay» nunca es «have». Se traduce por «there is/are», y el sujeto es siempre «there».",
      },
    ],
    quiz: [
      { q: "«___ two messages for you.»", options: ["There is", "There are", "It has"], answer: 1, why: "«two messages» es plural → there are." },
      { q: "«___ a lot of noise last night.»", options: ["There was", "There were", "There is"], answer: 0, why: "«noise» es incontable y es pasado → there was." },
      { q: "¿Cómo se dice «Hay un problema»?", options: ["It has a problem", "There is a problem", "Have a problem"], answer: 1, why: "«Hay» es there is, nunca have." },
      { q: "«___ a table and six chairs in the room.»", options: ["There are", "There is", "There have"], answer: 1, why: "Concuerda con lo primero de la lista: «a table», singular." },
      { q: "«___ been three complaints this week.»", options: ["There has", "There have", "There is"], answer: 1, why: "«three complaints» es plural → there have been." },
    ],
  },

  {
    id: "say-tell",
    title: "say, tell, speak y talk",
    tag: "Palabras",
    goal: "Cuatro verbos ingleses para lo que en español son dos.",
    blocks: [
      {
        t: "p",
        text: "«Decir» y «hablar» se reparten en cuatro verbos, y la diferencia no es de significado sino de qué va detrás. Lo que decide es si mencionas a la persona a la que hablas.",
      },
      {
        t: "table",
        head: ["Verbo", "Qué lleva detrás", "Ejemplo"],
        rows: [
          ["say", "lo dicho (sin persona)", "He said hello."],
          ["say to", "lo dicho + to + persona", "He said hello to me."],
          ["tell", "persona + lo dicho", "He told me the truth."],
          ["speak", "idiomas, formal, hablar con", "I speak English."],
          ["talk", "conversar, informal", "We talked about work."],
        ],
      },
      {
        t: "tip",
        text: "Truco: TELL lleva a alguien pegado detrás sin preposición (tell me, tell him). SAY no: si quieres la persona, necesitas «to» (say to me). Si dudas, mira si hay persona justo después del verbo.",
      },
      {
        t: "p",
        text: "Hay combinaciones fijas que hay que aprenderse tal cual: tell a story, tell a lie, tell the truth, tell the time, say sorry, say a word, say your name.",
      },
      {
        t: "examples",
        items: [
          { en: "She told me she was tired.", pron: "shi tóuld mi shi uós tái-erd", es: "Me dijo que estaba cansada." },
          { en: "What did he say?", pron: "uót did ji séi", es: "¿Qué dijo?" },
          { en: "Can I speak to the manager?", pron: "kan ai spiik tu de má-ni-yer", es: "¿Puedo hablar con el encargado?" },
        ],
      },
      {
        t: "error",
        wrong: "He said me the truth. / She told that she was late.",
        right: "He told me the truth. / She said that she was late.",
        why: "Con persona detrás: tell. Sin persona: say. Es lo único que hay que mirar.",
      },
    ],
    quiz: [
      { q: "«She ___ me she was leaving.»", options: ["said", "told", "spoke"], answer: 1, why: "Va seguido de «me» (persona) sin preposición → tell." },
      { q: "«He didn't ___ anything.»", options: ["tell", "say", "talk"], answer: 1, why: "No hay persona detrás, solo lo dicho → say." },
      { q: "«Do you ___ French?»", options: ["talk", "say", "speak"], answer: 2, why: "Con idiomas siempre speak." },
      { q: "«We ___ about the project for an hour.»", options: ["talked", "told", "said"], answer: 0, why: "Conversar sobre algo: talk about." },
      { q: "«Please ___ the truth.»", options: ["say", "tell", "speak"], answer: 1, why: "«tell the truth» es una combinación fija." },
    ],
  },

  {
    id: "make-do",
    title: "make y do: los dos «hacer»",
    tag: "Palabras",
    goal: "Saber cuál toca sin ir probando.",
    blocks: [
      {
        t: "p",
        text: "«Hacer» se parte en dos. La idea general: MAKE es crear algo que antes no existía; DO es realizar una actividad o una tarea. No siempre encaja, pero acierta la mayoría de las veces.",
      },
      {
        t: "table",
        head: ["MAKE (crear, producir)", "DO (actividad, tarea)"],
        rows: [
          ["make a mistake", "do your homework"],
          ["make a decision", "do the shopping"],
          ["make a noise", "do the dishes"],
          ["make money", "do exercise"],
          ["make a plan", "do business"],
          ["make friends", "do a favor"],
          ["make dinner", "do your best"],
          ["make an effort", "do nothing"],
        ],
      },
      {
        t: "tip",
        text: "Si al final queda algo nuevo que puedes señalar (una cena, un plan, un ruido, un error), es MAKE. Si es una tarea que se hace y ya está (los deberes, la compra, ejercicio), es DO.",
      },
      {
        t: "examples",
        items: [
          { en: "I made a mistake in the email.", pron: "ai méid a mis-téik in di íi-meil", es: "Cometí un error en el correo." },
          { en: "Can you do me a favor?", pron: "kan yu du mi a féi-vor", es: "¿Me haces un favor?" },
          { en: "We need to make a decision today.", pron: "ui niid tu méik a di-sí-shon tu-déi", es: "Tenemos que tomar una decisión hoy." },
        ],
      },
      {
        t: "error",
        wrong: "I did a mistake. / Let's make the shopping.",
        right: "I made a mistake. / Let's do the shopping.",
        why: "Un error se «crea» sin querer: make. La compra es una tarea: do.",
      },
    ],
    quiz: [
      { q: "«I ___ a mistake.»", options: ["did", "made", "make"], answer: 1, why: "make a mistake, siempre." },
      { q: "«Can you ___ me a favor?»", options: ["make", "do", "give"], answer: 1, why: "do someone a favor es fijo." },
      { q: "«She ___ the dishes every night.»", options: ["makes", "does", "make"], answer: 1, why: "Tarea de casa → do the dishes." },
      { q: "«They want to ___ a decision.»", options: ["do", "make", "take"], answer: 1, why: "En inglés la decisión se «hace»: make a decision (no take)." },
      { q: "«He is ___ his homework.»", options: ["making", "doing", "does"], answer: 1, why: "do your homework, y en continuo: doing." },
    ],
  },

  {
    id: "for-since-ago",
    title: "for, since y ago",
    tag: "Pasado",
    goal: "Traducir «desde» y «hace» sin equivocarte.",
    blocks: [
      {
        t: "p",
        text: "En español usamos «hace» y «desde» con bastante libertad. En inglés cada uno pide una cosa distinta detrás y un tiempo verbal distinto, así que confundirlos cambia la frase entera.",
      },
      {
        t: "table",
        head: ["Palabra", "Qué lleva detrás", "Significa", "Ejemplo"],
        rows: [
          ["for", "cuánto tiempo (duración)", "durante / desde hace", "for three years"],
          ["since", "cuándo empezó (punto)", "desde", "since 2019, since Monday"],
          ["ago", "va DETRÁS del tiempo", "hace", "three years ago"],
        ],
      },
      {
        t: "formula",
        parts: ["have/has", "participio", "for / since"],
        example: "I have lived here for ten years.",
      },
      {
        t: "tip",
        text: "«ago» va siempre con pasado simple y siempre detrás: «two hours ago», nunca «ago two hours». Y no se mezcla con present perfect: se dice «I saw her two days ago», no «I have seen her two days ago».",
      },
      {
        t: "examples",
        items: [
          { en: "I have worked here since 2020.", pron: "ai jav uérkt jier sins tuén-ti tuén-ti", es: "Trabajo aquí desde 2020." },
          { en: "We waited for two hours.", pron: "ui uéi-ted for tuu áu-ers", es: "Esperamos dos horas." },
          { en: "She called me ten minutes ago.", pron: "shi kold mi ten mí-nits a-góu", es: "Me llamó hace diez minutos." },
        ],
      },
      {
        t: "error",
        wrong: "I live here since three years. / Ago two days I saw him.",
        right: "I have lived here for three years. / I saw him two days ago.",
        why: "«three years» es duración → for. Y «ago» va detrás del tiempo, con pasado simple.",
      },
    ],
    quiz: [
      { q: "«I have known her ___ 2015.»", options: ["for", "since", "ago"], answer: 1, why: "2015 es un punto en el tiempo → since." },
      { q: "«We talked ___ an hour.»", options: ["since", "ago", "for"], answer: 2, why: "«an hour» es duración → for." },
      { q: "«He left the company two months ___.»", options: ["ago", "since", "before"], answer: 0, why: "«hace dos meses» → two months ago, detrás." },
      { q: "«She has been ill ___ Monday.»", options: ["for", "since", "ago"], answer: 1, why: "Monday es cuándo empezó → since." },
      { q: "¿Cuál es correcta?", options: ["I have seen him yesterday", "I saw him yesterday", "I have saw him yesterday"], answer: 1, why: "Un momento pasado y cerrado pide pasado simple, no present perfect." },
    ],
  },

  {
    id: "some-any",
    title: "some, any y no",
    tag: "Palabras",
    goal: "Cuándo va «some» y cuándo «any».",
    blocks: [
      {
        t: "p",
        text: "En español muchas veces no ponemos nada: «¿Tienes hermanos?», «Quiero agua». En inglés casi siempre hay que poner algo delante, y elegir entre some y any.",
      },
      {
        t: "table",
        head: ["Frase", "Se usa", "Ejemplo"],
        rows: [
          ["Afirmativa", "some", "I have some questions."],
          ["Negativa", "any", "I don't have any questions."],
          ["Pregunta", "any", "Do you have any questions?"],
          ["Ofrecer o pedir", "some", "Would you like some coffee?"],
        ],
      },
      {
        t: "tip",
        text: "La excepción importante: en preguntas que son un ofrecimiento o una petición se usa SOME, no any. «Would you like some tea?» suena amable; «any tea» suena a que dudas de que quede té.",
      },
      {
        t: "p",
        text: "«no» equivale a «not any» y es más corto: «I have no money» = «I don't have any money». Ojo: no se pueden usar los dos a la vez.",
      },
      {
        t: "examples",
        items: [
          { en: "There are some messages for you.", pron: "der ar sam mé-si-chis for yu", es: "Hay algunos mensajes para ti." },
          { en: "I didn't buy anything.", pron: "ai dí-dent bái é-ni-zing", es: "No compré nada." },
          { en: "Would you like some help?", pron: "uúd yu láik sam jelp", es: "¿Quieres ayuda?" },
        ],
      },
      {
        t: "error",
        wrong: "I don't have no money. / Do you have some time?",
        right: "I don't have any money. / Do you have any time?",
        why: "En inglés no se doblan las negaciones. Y en preguntas normales va any.",
      },
    ],
    quiz: [
      { q: "«I need ___ help.»", options: ["any", "some", "no any"], answer: 1, why: "Frase afirmativa → some." },
      { q: "«Is there ___ milk left?»", options: ["some", "any", "no"], answer: 1, why: "Pregunta normal → any." },
      { q: "«Would you like ___ water?»", options: ["any", "some", "no"], answer: 1, why: "Es un ofrecimiento → some, aunque sea pregunta." },
      { q: "«We don't have ___ time.»", options: ["some", "any", "no any"], answer: 1, why: "Negativa → any (o «we have no time»)." },
      { q: "¿Cuál es correcta?", options: ["I don't know nothing", "I don't know anything", "I don't know no thing"], answer: 1, why: "Una sola negación por frase: don't + anything." },
    ],
  },

  {
    id: "verbos-preposicion",
    title: "Verbos con su preposición fija",
    tag: "Palabras",
    goal: "Dejar de traducir la preposición del español.",
    blocks: [
      {
        t: "p",
        text: "Muchos verbos ingleses llevan siempre la misma preposición pegada, y casi nunca es la que usaríamos en español. «Depender de» no es «depend of», es «depend on». Estas hay que memorizarlas con el verbo, como si fueran una sola palabra.",
      },
      {
        t: "table",
        head: ["Inglés", "Español", "Trampa"],
        rows: [
          ["depend on", "depender de", "no «of»"],
          ["listen to", "escuchar", "el español no lleva nada"],
          ["wait for", "esperar a", "no «wait to»"],
          ["look for", "buscar", "el español no lleva nada"],
          ["think about", "pensar en", "no «in»"],
          ["ask for", "pedir", "no «ask por»"],
          ["belong to", "pertenecer a", "igual que en español"],
          ["arrive in / at", "llegar a", "nunca «arrive to»"],
          ["laugh at", "reírse de", "no «of»"],
          ["dream about", "soñar con", "no «with»"],
        ],
      },
      {
        t: "tip",
        text: "Con adjetivos pasa lo mismo: good at (no «good in»), interested in (no «interested for»), afraid of, married to, proud of, responsible for. Apréndelos como bloque cerrado.",
      },
      {
        t: "examples",
        items: [
          { en: "It depends on the price.", pron: "it di-pénds on de práis", es: "Depende del precio." },
          { en: "I am waiting for the bus.", pron: "ai am uéi-ting for de bas", es: "Estoy esperando el autobús." },
          { en: "She is good at math.", pron: "shi is gud at maz", es: "Se le dan bien las matemáticas." },
        ],
      },
      {
        t: "error",
        wrong: "It depends of you. / I am listening the radio. / We arrived to Madrid.",
        right: "It depends on you. / I am listening to the radio. / We arrived in Madrid.",
        why: "La preposición inglesa no se deduce de la española: va aprendida con el verbo.",
      },
    ],
    quiz: [
      { q: "«It depends ___ the weather.»", options: ["of", "on", "in"], answer: 1, why: "depend on, siempre." },
      { q: "«I'm looking ___ my keys.»", options: ["for", "to", "at"], answer: 0, why: "look for = buscar." },
      { q: "«She is very good ___ drawing.»", options: ["in", "on", "at"], answer: 2, why: "good at + actividad." },
      { q: "«We arrived ___ the airport at six.»", options: ["to", "at", "in"], answer: 1, why: "arrive at con lugares concretos; arrive in con ciudades. Nunca «arrive to»." },
      { q: "«Are you interested ___ the job?»", options: ["for", "in", "on"], answer: 1, why: "interested in, fijo." },
    ],
  },

  {
    id: "genitivo-sajon",
    title: "El apóstrofo posesivo ('s)",
    tag: "Estructuras",
    goal: "Decir «el coche de mi hermano» al revés, como se dice en inglés.",
    blocks: [
      {
        t: "p",
        text: "En español el poseedor va detrás: «el coche DE MI HERMANO». En inglés va delante y lleva 's: «my brother's car». Traducir con «of» suena raro cuando el poseedor es una persona.",
      },
      {
        t: "formula",
        parts: ["poseedor", "+ 's", "cosa poseída"],
        example: "My brother's car is new.",
      },
      {
        t: "table",
        head: ["Caso", "Cómo se escribe", "Ejemplo"],
        rows: [
          ["Singular", "+ 's", "the dog's name"],
          ["Plural acabado en -s", "solo apóstrofo", "the students' books"],
          ["Plural irregular", "+ 's", "the children's room"],
          ["Nombre propio", "+ 's", "Anna's phone"],
          ["Dos poseedores juntos", "'s solo en el último", "Anna and Paul's house"],
        ],
      },
      {
        t: "tip",
        text: "Para cosas y conceptos se sigue usando «of»: the end of the street, the name of the book. El apóstrofo es sobre todo para personas, animales y expresiones de tiempo (today's news, a week's vacation).",
      },
      {
        t: "examples",
        items: [
          { en: "That's my sister's bag.", pron: "dats mái sís-ters bag", es: "Esa es la bolsa de mi hermana." },
          { en: "The children's school is closed.", pron: "de chíl-drens skuul is klóusd", es: "El colegio de los niños está cerrado." },
          { en: "It's a five minutes' walk.", pron: "its a fáiv mí-nits uok", es: "Está a cinco minutos andando." },
        ],
      },
      {
        t: "error",
        wrong: "The car of my brother. / The book of Anna.",
        right: "My brother's car. / Anna's book.",
        why: "Con personas, el poseedor va delante con 's. «of» suena a traducción literal.",
      },
    ],
    quiz: [
      { q: "¿Cómo se dice «el perro de Ana»?", options: ["the dog of Ana", "Ana's dog", "Ana dog's"], answer: 1, why: "Poseedor delante + 's." },
      { q: "«The ___ toys are on the floor.» (de los niños)", options: ["childrens'", "children's", "childrens"], answer: 1, why: "«children» ya es plural irregular → children's." },
      { q: "«The ___ books» (de los alumnos, en plural)", options: ["students's", "student's", "students'"], answer: 2, why: "Plural que ya acaba en -s: solo apóstrofo." },
      { q: "¿Cuál suena natural?", options: ["the end of the street", "the street's end", "the street of end"], answer: 0, why: "Con cosas se prefiere «of»." },
      { q: "«___ house is big.» (de Ana y Pablo, la misma casa)", options: ["Ana's and Paul's", "Ana and Paul's", "Ana and Paul"], answer: 1, why: "Si la casa es de los dos, el 's va solo en el último." },
    ],
  },

  {
    id: "phrasal-separables",
    title: "Phrasal verbs: dónde va el objeto",
    tag: "Verbos",
    goal: "Saber si es «turn it off» o «turn off it».",
    blocks: [
      {
        t: "p",
        text: "Un phrasal verb es un verbo con una partícula (up, off, out…) que juntos significan otra cosa. Lo que más se falla no es el significado: es dónde colocar el objeto.",
      },
      {
        t: "table",
        head: ["Tipo", "Regla", "Ejemplo"],
        rows: [
          ["Separable", "el objeto puede ir en medio", "turn the TV off / turn off the TV"],
          ["Separable + pronombre", "OBLIGATORIO en medio", "turn it off (nunca «turn off it»)"],
          ["Inseparable", "el objeto va siempre detrás", "look after the baby"],
          ["Sin objeto", "no lleva nada", "The car broke down."],
        ],
      },
      {
        t: "tip",
        text: "La regla que salva: si el objeto es un pronombre (it, them, him, her), en los separables va SIEMPRE en medio. «Pick it up», «turn them off», «throw it away». Decir «pick up it» suena mal a cualquier nativo.",
      },
      {
        t: "p",
        text: "Los que llevan dos partículas (look forward to, put up with, run out of, get along with) son inseparables: el objeto va siempre al final.",
      },
      {
        t: "examples",
        items: [
          { en: "Can you turn it off?", pron: "kan yu tern it of", es: "¿Puedes apagarlo?" },
          { en: "I'll pick you up at eight.", pron: "áil pik yu ap at éit", es: "Te recojo a las ocho." },
          { en: "I can't put up with the noise.", pron: "ai kant put ap uid de nóis", es: "No aguanto el ruido." },
        ],
      },
      {
        t: "error",
        wrong: "Turn off it. / Pick up me at nine. / I look after it the baby.",
        right: "Turn it off. / Pick me up at nine. / I look after the baby.",
        why: "Con pronombre y phrasal separable, el pronombre va en medio. Los inseparables no se parten nunca.",
      },
    ],
    quiz: [
      { q: "¿Cuál es correcta?", options: ["Turn off it", "Turn it off", "It turn off"], answer: 1, why: "Pronombre + separable → siempre en medio." },
      { q: "«I'll ___ at seven.» (recogerte)", options: ["pick up you", "pick you up", "pick you"], answer: 1, why: "«you» es pronombre → en medio." },
      { q: "«She ___ her little brother.» (cuida de)", options: ["looks after", "looks him after", "after looks"], answer: 0, why: "look after es inseparable: el objeto va detrás." },
      { q: "¿Cuál es correcta?", options: ["I can't put up with it", "I can't put it up with", "I can't put up it with"], answer: 0, why: "Con dos partículas es inseparable: el objeto al final." },
      { q: "«The car ___ on the highway.»", options: ["broke it down", "broke down", "broke down it"], answer: 1, why: "break down aquí no lleva objeto." },
    ],
  },

  {
    id: "pronunciacion-ed",
    title: "Cómo suena la terminación -ed",
    tag: "Empieza aquí",
    goal: "Tres sonidos distintos, y ninguno es «ed» como lo lees.",
    blocks: [
      {
        t: "p",
        text: "En pasado casi todos los verbos acaban en -ed, pero eso NO se pronuncia «ed» salvo en un caso concreto. Un español que lee «worked» como «uórked» se delata en la primera frase. Suena «uérkt».",
      },
      {
        t: "table",
        head: ["Si el verbo acaba en...", "-ed suena", "Ejemplo"],
        rows: [
          ["sonido sordo (p, k, f, s, sh, ch)", "t", "worked = uérkt"],
          ["sonido sonoro (b, g, v, m, n, l, r, vocal)", "d", "played = pléid"],
          ["t o d", "id (sílaba aparte)", "wanted = uónted"],
        ],
      },
      {
        t: "tip",
        text: "Regla práctica: solo añade una sílaba cuando el verbo ya acaba en T o D. En todos los demás casos, -ed es un sonido pegado al final, no una sílaba nueva. «Stopped» tiene UNA sílaba, no dos.",
      },
      {
        t: "examples",
        items: [
          { en: "I stopped at the corner.", pron: "ai stopt at de kór-ner", es: "Paré en la esquina." },
          { en: "She called me yesterday.", pron: "shi kold mi yés-ter-dei", es: "Me llamó ayer." },
          { en: "We needed more time.", pron: "ui níi-ded mor táim", es: "Necesitábamos más tiempo." },
        ],
      },
      {
        t: "error",
        wrong: "«asked» leído «ásked» / «finished» leído «fínished»",
        right: "«asked» = «askt» / «finished» = «fínisht»",
        why: "Tras sonido sordo, -ed suena T y no añade sílaba. Es el error de pronunciación más frecuente en español.",
      },
    ],
    quiz: [
      { q: "¿Cómo suena «worked»?", options: ["uórked", "uérkt", "uérked"], answer: 1, why: "Acaba en sonido sordo (k) → -ed suena T, sin sílaba nueva." },
      { q: "¿Cómo suena «played»?", options: ["pléided", "pléit", "pléid"], answer: 2, why: "Acaba en vocal (sonora) → -ed suena D." },
      { q: "¿Cómo suena «wanted»?", options: ["uónt", "uónted", "uónd"], answer: 1, why: "Acaba en T → -ed añade sílaba: «id»." },
      { q: "¿Cuántas sílabas tiene «stopped»?", options: ["una", "dos", "tres"], answer: 0, why: "«stopt»: -ed no añade sílaba salvo tras T o D." },
      { q: "¿Cuál añade sílaba al pasado?", options: ["watched", "decided", "loved"], answer: 1, why: "«decide» acaba en D → decided suena «disáided», con sílaba nueva." },
    ],
  },

  {
    id: "acento-palabra",
    title: "La sílaba fuerte de cada palabra",
    tag: "Empieza aquí",
    goal: "Colocar el acento donde va, que cambia más que los sonidos.",
    blocks: [
      {
        t: "p",
        text: "En inglés una sílaba manda y las demás se comen. Si pones el acento donde no va, no te entienden aunque los sonidos sean correctos. Es más importante que pronunciar bien la th.",
      },
      {
        t: "p",
        text: "Además, las sílabas sin acento se relajan casi todas al mismo sonido flojo, una especie de «a» sorda. Por eso «banana» no suena «ba-na-na» con tres aes iguales, sino «banána», con la del medio fuerte y las otras dos apagadas.",
      },
      {
        t: "table",
        head: ["Tipo de palabra", "Dónde cae el acento", "Ejemplo"],
        rows: [
          ["2 sílabas, sustantivo", "en la primera", "TAble, OFFice, PROblem"],
          ["2 sílabas, verbo", "en la segunda", "reLAX, deCIDE, forGET"],
          ["Acaba en -tion, -sion", "justo antes", "informAtion, deciSion"],
          ["Acaba en -ity, -ical", "dos antes del final", "abIlity, poLItical"],
          ["Palabra compuesta", "en la primera parte", "AIRport, HOMEwork"],
        ],
      },
      {
        t: "tip",
        text: "Hay parejas que solo se distinguen por el acento: PREsent (regalo) frente a preSENT (presentar); REcord (disco) frente a reCORD (grabar). Regla general: sustantivo delante, verbo detrás.",
      },
      {
        t: "examples",
        items: [
          { en: "I need more information.", pron: "ai niid mor in-for-méi-shon", es: "Necesito más información." },
          { en: "Let me present the report.", pron: "let mi pri-sént de ri-pórt", es: "Déjame presentar el informe." },
          { en: "The airport is closed.", pron: "di ér-port is klóusd", es: "El aeropuerto está cerrado." },
        ],
      },
      {
        t: "error",
        wrong: "«HOtel» / «inforMAtion» / «comFORtable»",
        right: "«hoTEL» / «informAtion» / «COMfortable»",
        why: "El español tiende a acentuar donde acentuaría en español. En la app, la tilde de la pronunciación te marca siempre la sílaba fuerte: fíjate en ella.",
      },
    ],
    quiz: [
      { q: "¿Dónde va el acento en «information»?", options: ["INformation", "informAtion", "informatION"], answer: 1, why: "Las acabadas en -tion acentúan la sílaba justo anterior." },
      { q: "«REcord» con acento delante es...", options: ["grabar (verbo)", "un disco (sustantivo)", "lo mismo"], answer: 1, why: "Sustantivo delante, verbo detrás: REcord / reCORD." },
      { q: "¿Dónde va el acento en «hotel»?", options: ["HOtel", "hoTEL", "da igual"], answer: 1, why: "hoTEL, en la segunda. En español lo diríamos al revés." },
      { q: "¿Y en «airport»?", options: ["AIRport", "airPORT", "las dos"], answer: 0, why: "En las palabras compuestas manda la primera parte." },
      { q: "¿Por qué importa el acento?", options: ["Por elegancia", "Porque sin él pueden no entenderte", "Solo importa en exámenes"], answer: 1, why: "Un acento mal puesto rompe la palabra para el oído nativo, más que un sonido regular." },
    ],
  },
  {
    id: "modales-obligacion",
    title: "must, have to y should: los tres «deber»",
    tag: "Modales",
    goal: "Distinguir obligación, norma externa y consejo.",
    blocks: [
      {
        t: "p",
        text: "En español «deber» sirve para todo: «debes parar», «debo trabajar», «deberías descansar». En inglés se reparte en tres, y elegir mal cambia el tono de la frase: puedes sonar mandón sin querer, o quitarle importancia a algo obligatorio.",
      },
      {
        t: "table",
        head: ["Se usa", "Qué expresa", "Ejemplo"],
        rows: [
          ["must", "obligación que sientes tú, o norma fuerte", "I must call my mother."],
          ["have to", "obligación que viene de fuera", "I have to wear a uniform."],
          ["should", "consejo, recomendación", "You should rest."],
          ["mustn't", "prohibido", "You mustn't smoke here."],
          ["don't have to", "no hace falta (pero puedes)", "You don't have to come."],
          ["shouldn't", "no conviene", "You shouldn't eat so late."],
        ],
      },
      {
        t: "error",
        wrong: "You mustn't come if you're busy.",
        right: "You don't have to come if you're busy.",
        why: "«Mustn't» prohíbe; «don't have to» libera. Son opuestos, y este es el error más caro de los tres: le estarías prohibiendo venir a alguien a quien querías dar libertad.",
      },
      {
        t: "tip",
        text: "Truco: MUST sale de dentro (yo lo veo necesario), HAVE TO viene de fuera (lo manda el jefe, la ley, el horario). Y en negativo cambian de significado del todo, no solo de fuerza.",
      },
      {
        t: "examples",
        items: [
          { en: "I must finish this today.", pron: "ai mast fí-nish dis tu-déi", es: "Tengo que terminar esto hoy." },
          { en: "She has to work on Saturdays.", pron: "shi jas tu uérk on sá-ter-deis", es: "Tiene que trabajar los sábados." },
          { en: "You should see a doctor.", pron: "yu shud sii a dók-tor", es: "Deberías ver a un médico." },
          { en: "You mustn't touch that.", pron: "yu má-sent tach dat", es: "No debes tocar eso." },
          { en: "We don't have to hurry.", pron: "ui dóunt jav tu já-ri", es: "No hace falta que nos demos prisa." },
        ],
      },
      {
        t: "p",
        text: "En pasado, «must» y «have to» se juntan en uno solo: «had to». No existe «musted». Y para el futuro, «will have to».",
      },
    ],
    quiz: [
      { q: "«You ___ wear a helmet. It's the law.»", options: ["should", "must", "might"], answer: 1, why: "Norma fuerte y legal: must." },
      { q: "«It's optional, you ___ come.»", options: ["mustn't", "don't have to", "shouldn't"], answer: 1, why: "No hace falta, pero puedes: don't have to." },
      { q: "«You look ill. You ___ go home.»", options: ["should", "must", "have to"], answer: 0, why: "Es un consejo, no una orden: should." },
      { q: "Pasado de «I must go»:", options: ["I musted go", "I had to go", "I must went"], answer: 1, why: "«Must» no tiene pasado: se usa «had to»." },
      { q: "«You ___ park here, it's forbidden.»", options: ["don't have to", "mustn't", "shouldn't"], answer: 1, why: "Prohibición tajante: mustn't." },
    ],
  },

  {
    id: "there-their-theyre",
    title: "there, their y they're",
    tag: "Palabras",
    goal: "Tres palabras que suenan igual y significan cosas distintas.",
    blocks: [
      {
        t: "p",
        text: "Se pronuncian prácticamente igual («der»), así que al oído no se distinguen: hay que decidir por el sentido. Es de los errores que más se ven escritos, incluso entre nativos.",
      },
      {
        t: "table",
        head: ["Palabra", "Qué es", "Significa", "Ejemplo"],
        rows: [
          ["there", "lugar o «hay»", "allí / hay", "There is a problem."],
          ["their", "posesivo", "su (de ellos)", "Their house is big."],
          ["they're", "they + are", "ellos son/están", "They're late."],
        ],
      },
      {
        t: "tip",
        text: "Truco para no fallar: si puedes cambiarlo por «they are», es THEY'RE. Si puedes cambiarlo por «our» o «my», es THEIR. Y si no es ninguna de las dos, es THERE.",
      },
      {
        t: "examples",
        items: [
          { en: "There are two options.", pron: "der ar tuu óp-shons", es: "Hay dos opciones." },
          { en: "Their car is new.", pron: "der kar is niú", es: "Su coche es nuevo." },
          { en: "They're waiting outside.", pron: "der uéi-ting aut-sáid", es: "Están esperando fuera." },
          { en: "Their kids are over there.", pron: "der kids ar óu-ver der", es: "Sus hijos están allí." },
        ],
      },
      {
        t: "error",
        wrong: "Their is a problem. / They're house is big.",
        right: "There is a problem. / Their house is big.",
        why: "«Their» siempre lleva un sustantivo detrás (their house, their car). Si no lo lleva, no es «their».",
      },
    ],
    quiz: [
      { q: "«___ going to be late.»", options: ["There", "Their", "They're"], answer: 2, why: "Equivale a «they are going»: they're." },
      { q: "«___ house has a garden.»", options: ["There", "Their", "They're"], answer: 1, why: "Lleva sustantivo detrás (house): posesivo their." },
      { q: "«Is ___ any milk left?»", options: ["there", "their", "they're"], answer: 0, why: "«¿Queda leche?» → there is/are." },
      { q: "«The keys are over ___.»", options: ["there", "their", "they're"], answer: 0, why: "Lugar: allí → there." },
      { q: "¿Cuál puedes cambiar por «they are»?", options: ["there", "their", "they're"], answer: 2, why: "They're es literalmente la contracción de they are." },
    ],
  },

  {
    id: "tiempos-resumen",
    title: "Todos los tiempos de un vistazo",
    tag: "Base",
    goal: "Ver el mapa completo antes de perderte en los detalles.",
    blocks: [
      {
        t: "p",
        text: "El inglés casi no conjuga: el verbo apenas cambia y los tiempos se montan con auxiliares (do, be, have, will). Eso asusta al principio, pero es una ventaja: en vez de memorizar terminaciones, aprendes cuatro piezas y las combinas.",
      },
      {
        t: "table",
        head: ["Tiempo", "Cómo se forma", "Ejemplo con «work»"],
        rows: [
          ["Presente simple", "verbo (+s en 3ª)", "I work / he works"],
          ["Presente continuo", "am/is/are + -ing", "I am working"],
          ["Pasado simple", "-ed o forma irregular", "I worked / I went"],
          ["Pasado continuo", "was/were + -ing", "I was working"],
          ["Present perfect", "have/has + participio", "I have worked"],
          ["Past perfect", "had + participio", "I had worked"],
          ["Futuro (will)", "will + infinitivo", "I will work"],
          ["Futuro (going to)", "am/is/are going to + inf.", "I am going to work"],
          ["Condicional", "would + infinitivo", "I would work"],
        ],
      },
      {
        t: "tip",
        text: "Fíjate en el patrón: el verbo solo tiene cinco formas (work, works, working, worked, worked). Todo lo demás lo aporta el auxiliar. En Palabras → Verbos puedes ver cualquier verbo con toda esta tabla ya rellenada.",
      },
      {
        t: "examples",
        items: [
          { en: "I work here.", pron: "ai uérk jier", es: "Trabajo aquí." },
          { en: "I am working now.", pron: "aim uér-king náu", es: "Estoy trabajando ahora." },
          { en: "I worked yesterday.", pron: "ai uérkt yés-ter-dei", es: "Trabajé ayer." },
          { en: "I have worked here for years.", pron: "ai jav uérkt jier for yiers", es: "Llevo años trabajando aquí." },
          { en: "I will work tomorrow.", pron: "ai uil uérk tu-mó-rou", es: "Trabajaré mañana." },
        ],
      },
      {
        t: "error",
        wrong: "He is work. / I have work here for years.",
        right: "He is working. / I have worked here for years.",
        why: "Cada auxiliar exige una forma concreta: «be» pide -ing, «have» pide participio. Si te sale el infinitivo pelado detrás de un auxiliar, algo falla.",
      },
    ],
    quiz: [
      { q: "¿Qué forma pide «have» detrás?", options: ["infinitivo", "participio", "gerundio"], answer: 1, why: "have/has + participio: I have worked, she has gone." },
      { q: "¿Qué forma pide «be» detrás para el continuo?", options: ["gerundio (-ing)", "participio", "pasado"], answer: 0, why: "am/is/are + -ing: I am working." },
      { q: "«I will ___ tomorrow.»", options: ["working", "worked", "work"], answer: 2, why: "Tras will, infinitivo sin «to»." },
      { q: "¿Cuántas formas distintas tiene un verbo regular en inglés?", options: ["cinco", "doce", "más de veinte"], answer: 0, why: "work, works, working, worked, worked. El resto lo montan los auxiliares." },
      { q: "«She ___ been waiting.»", options: ["have", "has", "is"], answer: 1, why: "Tercera persona: has. Y «been» es el participio de be." },
    ],
  },
  {
    id: "familia-ough",
    title: "-ough: cuatro letras, siete sonidos",
    tag: "Pronunciación",
    goal: "Dejar de confundir tough, though, thought, through y thorough.",
    blocks: [
      {
        t: "p",
        text: "No hay ninguna regla: las mismas cuatro letras se leen de siete maneras distintas y hay que aprenderlas de memoria. La buena noticia es que son pocas palabras y muy frecuentes, así que se aprenden de una vez y para siempre.",
      },
      {
        t: "table",
        head: ["Se escribe", "Suena", "Qué es"],
        rows: [
          ["tough", "taf", "duro, difícil"],
          ["though", "dóu", "aunque"],
          ["thought", "zot", "pensamiento / pensé"],
          ["through", "zruu", "a través de"],
          ["thorough", "zé-rou", "minucioso"],
          ["throughout", "zru-áut", "durante todo"],
          ["enough", "i-náf", "suficiente"],
          ["cough", "kof", "toser"],
          ["dough", "dóu", "masa (suena igual que though)"],
        ],
      },
      {
        t: "tip",
        text: "Agrúpalas de dos en dos por el sonido, no por cómo se escriben: tough y enough riman (-af). Though y dough riman (-óu). Thought y bought riman (-ot). Through no rima con ninguna: es -uu.",
      },
      {
        t: "error",
        wrong: "thorough = zrou",
        right: "thorough = zé-rou",
        why: "Es el fallo más repetido, y se ve incluso en vídeos de inglés: «thorough» NO empieza como «through». Son dos sílabas y la primera es «ze-», no «zru-». Si dices «zrou» estás diciendo «throw», tirar.",
      },
      {
        t: "examples",
        items: [
          { en: "It was tough, though.", pron: "it uós taf, dóu", es: "Fue duro, eso sí." },
          { en: "I thought we went through this.", pron: "ái zot ui uent zruu dis", es: "Pensaba que ya habíamos pasado por esto." },
          { en: "She did a thorough check.", pron: "shi did a zé-rou chek", es: "Hizo una revisión minuciosa." },
        ],
      },
      {
        t: "p",
        text: "Ojo con la th: en though y en dough vibra (por eso se escribe con d), y en thought, through y thorough no vibra (por eso se escribe con z). Cambiar una por otra es lo que más canta.",
      },
    ],
    quiz: [
      { q: "«tough» suena…", options: ["tof", "taf", "tug"], answer: 1, why: "Rima con enough: i-náf / taf." },
      { q: "«thorough» suena…", options: ["zruu", "zé-rou", "zrou"], answer: 1, why: "Dos sílabas. «zrou» sería «throw», tirar." },
      { q: "¿Cuáles riman entre sí?", options: ["though y through", "though y dough", "tough y though"], answer: 1, why: "Las dos son «dóu». Through es «zruu» y tough es «taf»." },
      { q: "«thought» lleva la th…", options: ["sorda, con z", "sonora, con d", "muda"], answer: 0, why: "No vibra: zot. La sonora es la de though, dóu." },
      { q: "«throughout» suena…", options: ["zró-aut", "zru-áut", "zrau-t"], answer: 1, why: "Es through + out pegados: zru-áut, con la fuerza en áut." },
    ],
  },
];

export const getLesson = (id) => LESSONS.find((l) => l.id === id);
