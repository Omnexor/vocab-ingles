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
          { en: "The other one is here.", pron: "de áder uán is jíer", es: "El otro está aquí." },
        ],
      },
      {
        t: "p",
        text: "La tilde marca dónde va el golpe de voz. En inglés la sílaba fuerte importa muchísimo: si la pones donde no es, cuesta entenderte aunque los sonidos estén bien.",
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
          { en: "They live in Madrid.", pron: "déi liv in madrid", es: "Viven en Madrid." },
          { en: "They don't live in Madrid.", pron: "déi dount liv in madrid", es: "No viven en Madrid." },
          { en: "Do they live in Madrid?", pron: "du déi liv in madrid", es: "¿Viven en Madrid?" },
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
          { en: "I usually get up at seven.", pron: "ai yúshuali guet ap at séven", es: "Normalmente me levanto a las siete." },
          { en: "She doesn't drink coffee.", pron: "shi dásent drink cófi", es: "Ella no bebe café." },
          { en: "Does it rain a lot here?", pron: "das it réin a lot jíer", es: "¿Llueve mucho aquí?" },
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
          { en: "What are you doing?", pron: "uót ar yu dúing", es: "¿Qué estás haciendo?" },
          { en: "He isn't listening to me.", pron: "ji ísent lísening tu mi", es: "No me está escuchando." },
          { en: "They're not coming tonight.", pron: "déir not cáming tunáit", es: "No vienen esta noche." },
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
          { en: "We didn't have time.", pron: "uí dídent jav táim", es: "No tuvimos tiempo." },
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
          { en: "I was walking home when it started to rain.", pron: "ai uós uóking jóum uén it stárted tu réin", es: "Iba andando a casa cuando empezó a llover." },
          { en: "What were you doing at ten?", pron: "uót uér yu dúing at ten", es: "¿Qué estabas haciendo a las diez?" },
          { en: "They weren't listening.", pron: "déi uérent lísening", es: "No estaban escuchando." },
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
          { en: "Have you ever worked abroad?", pron: "jav yu éver uérkt abród", es: "¿Has trabajado alguna vez en el extranjero?" },
          { en: "I haven't seen him for weeks.", pron: "ai jávent siin jim for uíiks", es: "Hace semanas que no lo veo." },
        ],
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
          { en: "The phone is ringing — I'll get it.", pron: "de fóun is rínging — ail guet it", es: "Suena el teléfono, ya lo cojo yo." },
          { en: "Look at those clouds. It's going to rain.", pron: "luk at dóus cláuds. its góing tu réin", es: "Mira esas nubes. Va a llover." },
          { en: "We're flying to Lisbon on Monday.", pron: "uír fláiing tu lísbon on mándei", es: "Volamos a Lisboa el lunes." },
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
          { en: "You mustn't park here.", pron: "yu másent park jíer", es: "No debes aparcar aquí (prohibido)." },
          { en: "You don't have to park here.", pron: "yu dount jav tu park jíer", es: "No hace falta que aparques aquí." },
          { en: "Could you say that again, please?", pron: "cud yu séi dat aguén plíis", es: "¿Podría repetirlo, por favor?" },
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
          { en: "If I were you, I'd accept the offer.", pron: "if ai uér yu, aid aksépt di ófer", es: "Yo que tú, aceptaría la oferta." },
          { en: "We would have come if we had known.", pron: "uí ud jav cam if uí jad nóun", es: "Habríamos venido si lo hubiéramos sabido." },
        ],
      },
      {
        t: "tip",
        text: "En el condicional 2 se dice «If I were» para todas las personas, no «If I was». Es la fórmula fija para dar consejos: «If I were you…».",
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
          { en: "How long have you been waiting?", pron: "jáu long jav yu bin uéiting", es: "¿Cuánto tiempo llevas esperando?" },
          { en: "What time does the meeting start?", pron: "uót táim das de míiting start", es: "¿A qué hora empieza la reunión?" },
        ],
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
          { en: "Today is hotter than yesterday.", pron: "tudéi is jóter dan yésterdei", es: "Hoy hace más calor que ayer." },
          { en: "It's the most expensive one.", pron: "its de móust ikspénsiv uán", es: "Es el más caro." },
          { en: "She's as tall as her brother.", pron: "shis as tol as jer bráder", es: "Es tan alta como su hermano." },
        ],
      },
    ],
    quiz: [
      { q: "«This bag is ___ than that one.» (cheap)", options: ["more cheap", "cheaper", "cheapest"], answer: 1, why: "«Cheap» tiene una sílaba: se le añade -er." },
      { q: "«It's the ___ film of the year.» (interesting)", options: ["interestingest", "most interesting", "more interesting"], answer: 1, why: "Adjetivo largo: superlativo con «the most»." },
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
          { en: "There are three people waiting.", pron: "der ar zrii píipol uéiting", es: "Hay tres personas esperando." },
          { en: "I have a lot of homework.", pron: "ai jav a lot ov jóumuerk", es: "Tengo muchos deberes." },
        ],
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
        example: "I'm bored because the film is boring.",
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
          { en: "I'm interested in this job.", pron: "aim íntrestid in dis yob", es: "Me interesa este trabajo." },
          { en: "The trip was tiring.", pron: "de trip uós táiring", es: "El viaje fue agotador." },
        ],
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
          { en: "That's completely useless.", pron: "dats kamplíitli yúusles", es: "Eso es completamente inútil." },
          { en: "I misunderstood the question.", pron: "ai misanderstúd de kuéschon", es: "Entendí mal la pregunta." },
        ],
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
          { en: "A nice little Spanish restaurant.", pron: "a náis lítel spánish réstorant", es: "Un bonito restaurante español pequeño." },
          { en: "Those old wooden doors are heavy.", pron: "dóus óuld uúden dors ar jévi", es: "Esas viejas puertas de madera pesan." },
        ],
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
        wrong: "The life is hard. / I like the music. / I play the football.",
        right: "Life is hard. / I like music. / I play football.",
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
          { en: "Money isn't everything.", pron: "máni ísent évrizing", es: "El dinero no lo es todo." },
        ],
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
];

export const getLesson = (id) => LESSONS.find((l) => l.id === id);
