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
      { q: "¿Por qué esta app no usa el alfabeto fonético (IPA)?", options: ["Porque es menos preciso","Porque hay que estudiarlo aparte y aquí lees en español directamente","Porque no cabe en pantalla"], answer: 1, why: "El objetivo es que puedas leer la pronunciación sin aprender un sistema nuevo." },
      { q: "La «j» de estas pronunciaciones suena como…", options: ["la j española de «jamón»","una h aspirada suave","una y"], answer: 0, why: "Se usa la j española porque el sonido inglés /h/ se le parece lo bastante." },
      { q: "¿Por qué nunca verás una «h» en estas pronunciaciones?", options: ["Por economía de letras","Porque la h española es muda y no diría nada","Porque el inglés no tiene ese sonido"], answer: 1, why: "Si la h es muda en español, escribirla sería no escribir nada." },
      { q: "«uó-rer» (water) lleva una r en medio porque…", options: ["es un error","la t entre vocales suena como una r suave en inglés americano","la palabra lleva dos erres"], answer: 1, why: "Es la T americana: water, better, city suenan con una erre suave." },
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
      { q: "«Llueve» (sin sujeto en español) es…", options: ["Is raining", "It is raining", "Rains"], answer: 1, why: "El español puede omitir el sujeto; el inglés no. Hace falta «it» aunque no signifique nada." },
      { q: "«Está cansada» es…", options: ["Is tired", "She is tired", "Tired is"], answer: 1, why: "En español el verbo ya dice quién; en inglés el sujeto es obligatorio siempre." },
      { q: "¿Por qué «Es difícil» no es «Is difficult»?", options: ["Porque falta el sujeto «it»", "Porque falta un artículo", "Porque el orden está mal"], answer: 0, why: "Toda frase inglesa necesita sujeto: «It is difficult»." },
      { q: "«Son las tres» es…", options: ["Are three o'clock", "It's three o'clock", "There are three o'clock"], answer: 1, why: "La hora, el tiempo y el clima llevan «it» como sujeto vacío." },
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
        t: "p",
        text: "Lo primero que hay que asumir viniendo del español: el verbo inglés casi no se conjuga. Donde el español tiene seis formas distintas, el inglés tiene DOS. Toda la conjugación del presente inglés se reduce a poner o no poner una -s.",
      },
      {
        t: "table",
        head: ["Persona", "Español", "Inglés"],
        rows: [
          ["yo", "trabajo", "I work"],
          ["tú", "trabajas", "you work"],
          ["él / ella", "trabaja", "he / she works"],
          ["nosotros", "trabajamos", "we work"],
          ["vosotros", "trabajáis", "you work"],
          ["ellos", "trabajan", "they work"],
        ],
      },
      {
        t: "tip",
        text: "Seis formas en español, dos en inglés: «work» y «works». Esa es toda la conjugación. La buena noticia es que hay muy poco que memorizar; la mala es que la única marca que queda, la -s de he/she/it, se olvida constantemente precisamente porque es la única.",
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
        t: "p",
        text: "Y ahora la parte que más desconcierta: el «do» de las preguntas y las negativas NO SE TRADUCE. No significa «hacer» ahí. Es una pieza que el inglés necesita para construir la frase y que en español simplemente no existe. Si intentas traducirlo, no encuentras por dónde: desaparece.",
      },
      {
        t: "table",
        head: ["Inglés", "Español", "Qué pasó con el «do»"],
        rows: [
          ["Do you work here?", "¿Trabajas aquí?", "Desaparece: el español pregunta con la entonación."],
          ["I don't work here.", "No trabajo aquí.", "«don't» pasa a ser solo «no»."],
          ["Does she work here?", "¿Trabaja ella aquí?", "Desaparece; la -s se va con él."],
          ["She doesn't work here.", "Ella no trabaja aquí.", "«doesn't» es «no», y se lleva la -s."],
        ],
      },
      {
        t: "tip",
        text: "Ojo con esto: cuando aparece «does» o «doesn't», la -s YA ESTÁ en el auxiliar, así que el verbo vuelve a la forma base. Se dice «She doesn't work», nunca «She doesn't works». La -s solo se pone una vez, y la lleva el primero de los dos.",
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
      { q: "¿Cuántas formas distintas tiene un verbo inglés en presente?", options: ["Seis, como en español", "Dos: base y base + -s", "Una sola"], answer: 1, why: "Solo «work» y «works». El español tiene seis; el inglés, dos." },
      { q: "«Do you work here?» ¿Cómo se traduce el «do»?", options: ["Como «hacer»", "No se traduce: desaparece en español", "Como «sí»"], answer: 1, why: "Es una pieza gramatical del inglés que el español no tiene: «¿Trabajas aquí?»" },
      { q: "¿Cuál está bien?", options: ["She doesn't works here", "She doesn't work here", "She don't works here"], answer: 1, why: "La -s ya está en «doesn't», así que el verbo vuelve a la base." },
      { q: "«No trabajo los viernes» es…", options: ["I no work on Fridays", "I don't work on Fridays", "I not work on Fridays"], answer: 1, why: "El «no» español se convierte en «don't», no en «no» suelto." },
      { q: "«Ellos no ven la tele» es…", options: ["They doesn't watch TV", "They don't watch TV", "They don't watches TV"], answer: 1, why: "Con they el auxiliar es don't, y el verbo va en base." },
      { q: "Tercera persona de «finish»:", options: ["finishs", "finishes", "finish"], answer: 1, why: "Acabados en -sh, -ch, -ss, -x y -o llevan -es: finishes, watches, goes." },
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
        t: "p",
        text: "La traducción es mecánica y encaja pieza por pieza con el español. «am / is / are» es el verbo ESTAR, y la terminación «-ing» es exactamente el «-ando / -iendo» español. No hay nada que interpretar: se sustituye una pieza por otra.",
      },
      {
        t: "table",
        head: ["Inglés", "Español", "Pieza por pieza"],
        rows: [
          ["I am working", "Estoy trabajando", "am = estoy · work-ing = trabaj-ando"],
          ["She is eating", "Está comiendo", "is = está · eat-ing = com-iendo"],
          ["We are waiting", "Estamos esperando", "are = estamos · wait-ing = esper-ando"],
          ["They are living here", "Están viviendo aquí", "are = están · liv-ing = viv-iendo"],
        ],
      },
      {
        t: "tip",
        text: "El error más típico del español es comerse el verbo «to be»: decir «I working» en vez de «I am working». En español el «estoy» se puede omitir en algunos contextos, pero en inglés NUNCA: sin am/is/are la frase no existe. Si dices «-ing», antes tiene que ir am, is o are sí o sí.",
      },
      {
        t: "error",
        wrong: "I working right now. / She working.",
        right: "I am working right now. / She is working.",
        why: "El -ing solo nunca basta: necesita am, is o are delante. Es el equivalente a decir «yo trabajando» en vez de «estoy trabajando».",
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
      { q: "La terminación «-ing» equivale en español a…", options: ["-ar / -er / -ir (infinitivo)", "-ando / -iendo", "-ado / -ido (participio)"], answer: 1, why: "work-ing = trabaj-ando, eat-ing = com-iendo." },
      { q: "«Estoy trabajando» es…", options: ["I working", "I am working", "I work"], answer: 1, why: "am/is/are es el «estoy/está/estamos»: sin él la frase no existe." },
      { q: "¿Qué falta en «She working now»?", options: ["Nada, está bien", "Falta «is» delante", "Sobra el -ing"], answer: 1, why: "El -ing siempre necesita am, is o are delante." },
      { q: "«Están viviendo aquí» es…", options: ["They living here", "They are living here", "They live here"], answer: 1, why: "are = están, living = viviendo. Las dos piezas hacen falta." },
      { q: "«I work in a hotel» y «I'm working in a hotel»…", options: ["significan lo mismo", "el primero es mi trabajo, el segundo es temporal", "el segundo está mal"], answer: 1, why: "Simple = costumbre o hecho permanente; continuo = ahora o temporal." },
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
        text: "Aquí hay una simplificación enorme respecto al español, y conviene verla para no complicarse: el pasado inglés tiene UNA sola forma para todas las personas. Donde el español dice hablé, hablaste, habló, hablamos, hablasteis, hablaron, el inglés dice «talked» seis veces.",
      },
      {
        t: "table",
        head: ["Persona", "Español", "Inglés"],
        rows: [
          ["yo", "hablé", "I talked"],
          ["tú", "hablaste", "you talked"],
          ["él / ella", "habló", "he / she talked"],
          ["nosotros", "hablamos", "we talked"],
          ["vosotros", "hablasteis", "you talked"],
          ["ellos", "hablaron", "they talked"],
        ],
      },
      {
        t: "p",
        text: "Y otra simplificación que despista al principio: el español tiene DOS pasados que se usan a todas horas —el indefinido (hablé) y el imperfecto (hablaba)— y el inglés los mete a los dos en la misma forma. «I worked there» puede ser «trabajé allí» o «trabajaba allí»: lo decide el contexto, no el verbo.",
      },
      {
        t: "table",
        head: ["Inglés", "Puede ser", "O también"],
        rows: [
          ["I worked in Madrid.", "Trabajé en Madrid.", "Trabajaba en Madrid."],
          ["She lived alone.", "Vivió sola.", "Vivía sola."],
          ["We ate at eight.", "Comimos a las ocho.", "Comíamos a las ocho."],
        ],
      },
      {
        t: "tip",
        text: "Si quieres marcar claramente el imperfecto español («trabajaba», en el sentido de costumbre pasada), el inglés tiene una forma específica: «used to work». Eso ya no es ambiguo: significa siempre «solía trabajar / trabajaba antes». Lo tienes entero en la lección «used to y would».",
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
      { q: "¿Cuántas formas tiene un verbo regular inglés en pasado?", options: ["Seis, una por persona", "Una sola para todas las personas", "Dos"], answer: 1, why: "«talked» vale para I, you, he, we, you y they." },
      { q: "«I worked in Madrid» puede significar…", options: ["solo «trabajé en Madrid»", "«trabajé» o «trabajaba»: lo decide el contexto", "solo «trabajaba en Madrid»"], answer: 1, why: "El inglés no distingue indefinido e imperfecto en esta forma." },
      { q: "Para dejar claro «trabajaba antes» (costumbre pasada) se usa…", options: ["I worked", "I used to work", "I was working"], answer: 1, why: "«Used to» marca la costumbre pasada sin ambigüedad." },
      { q: "«Ellos vinieron ayer» es…", options: ["They comed yesterday", "They came yesterday", "They did came yesterday"], answer: 1, why: "come es irregular: came. Y no lleva «did» en afirmativa." },
      { q: "«¿Compraste el pan?» es…", options: ["Did you buy the bread?", "Did you bought the bread?", "You bought the bread?"], answer: 0, why: "Con «did» el verbo vuelve a la base: buy, no bought." },
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
      { q: "«was / were + -ing» equivale en español a…", options: ["estaba + -ando/-iendo","he estado + -ando","estaría + -ando"], answer: 0, why: "I was working = estaba trabajando." },
      { q: "«Estábamos comiendo» es…", options: ["We was eating","We were eating","We are eating"], answer: 1, why: "Con we, you y they siempre «were»." },
      { q: "En «Mientras cocinaba, sonó el teléfono», ¿cuál va en continuo?", options: ["cocinaba","sonó","las dos"], answer: 0, why: "La acción larga va en continuo; la corta que la interrumpe, en pasado simple." },
      { q: "«¿Qué estabas haciendo?» es…", options: ["What did you do?","What were you doing?","What was you doing?"], answer: 1, why: "Con «you» siempre were, también en singular." },
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
        t: "p",
        text: "Pieza por pieza sí encaja: «have / has» es el verbo HABER y el participio es el «-ado / -ido» español. I have finished = «he terminado». El problema no es la forma, es CUÁNDO se usa: el español y el inglés no lo reparten igual, y ahí es donde un español mete la pata.",
      },
      {
        t: "table",
        head: ["Inglés", "Español", "Pieza por pieza"],
        rows: [
          ["I have finished", "He terminado", "have = he · finish-ed = termin-ado"],
          ["She has eaten", "Ha comido", "has = ha · eat-en = com-ido"],
          ["We have lived here", "Hemos vivido aquí", "have = hemos · liv-ed = viv-ido"],
          ["They haven't arrived", "No han llegado", "haven't = no han"],
        ],
      },
      {
        t: "p",
        text: "Donde se rompe la equivalencia es en España, porque el español de España usa «he hecho» muchísimo más que el inglés usa «I have done». Nosotros decimos «he ido al cine ayer» sin ningún problema; en inglés eso está MAL. Si dices cuándo pasó, el inglés te obliga al pasado simple, sin excepción. Traducir literalmente desde el español de España es justo lo que produce el error.",
      },
      {
        t: "table",
        head: ["En español (España)", "En inglés", "Por qué"],
        rows: [
          ["He ido al cine ayer.", "I went to the cinema yesterday.", "Dices «ayer» → pasado simple obligatorio."],
          ["He ido al cine.", "I have been to the cinema.", "Sin cuándo → present perfect."],
          ["Esta mañana he desayunado tarde.", "I had breakfast late this morning.", "Si la mañana ya acabó, es pasado simple."],
          ["He perdido las llaves.", "I have lost my keys.", "Sigue teniendo efecto ahora: no las tengo."],
        ],
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
      { q: "En «I have finished», ¿a qué equivale «have»?", options: ["al verbo tener", "al verbo haber", "no se traduce"], answer: 1, why: "have + participio = haber + participio: he terminado." },
      { q: "«He ido al cine ayer» en inglés correcto es…", options: ["I have gone to the cinema yesterday", "I went to the cinema yesterday", "I have been to the cinema yesterday"], answer: 1, why: "Con «yesterday» el inglés obliga al pasado simple, aunque el español use «he ido»." },
      { q: "¿Por qué falla tanto este tiempo a los españoles?", options: ["Porque la forma es distinta", "Porque en España se usa «he hecho» mucho más que «I have done»", "Porque no existe en español"], answer: 1, why: "La forma encaja; lo que no encaja es cuándo se usa cada uno." },
      { q: "«He perdido las llaves» (y sigo sin ellas) es…", options: ["I lost my keys", "I have lost my keys", "I was losing my keys"], answer: 1, why: "El efecto sigue en el presente y no dices cuándo: present perfect." },
      { q: "El participio «-ed / -en» equivale en español a…", options: ["-ando / -iendo", "-ado / -ido", "-aré / -eré"], answer: 1, why: "finish-ed = termin-ado, eat-en = com-ido." },
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
        t: "p",
        text: "La traducción literal ayuda a colocarlos, porque el español también tiene dos futuros y se reparten casi igual. WILL + verbo es la terminación -É / -Á del español (I will go = iré, it will be = será), exactamente el mismo mecanismo que el -ía de «would». Y BE GOING TO es literalmente «ir a»: I am going to eat = «voy a comer», pieza por pieza.",
      },
      {
        t: "table",
        head: ["Inglés", "Español", "Qué pasó"],
        rows: [
          ["I will go", "Iré", "go → ir + é"],
          ["It will be easy", "Será fácil", "be → ser + á"],
          ["They will call you", "Te llamarán", "call → llamar + án"],
          ["I am going to eat", "Voy a comer", "am going to = voy a"],
          ["She is going to study", "Va a estudiar", "is going to = va a"],
        ],
      },
      {
        t: "tip",
        text: "Los tres modales del -ÍA y el del -É son el mismo truco: el inglés añade una palabra delante donde el español cambia la terminación. WILL = -é / -á (iré). WOULD = -ía (iría). Si te sabes esa pareja, ya sabes cuándo va cada uno: pregúntate si en español dirías «iré» o «iría».",
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
      { q: "«Will» equivale a qué terminación española?", options: ["-ía (iría)", "-é / -á (iré, será)", "-ando (yendo)"], answer: 1, why: "will go = iré, will be = será. El -ía es «would»." },
      { q: "«Será fácil» es…", options: ["It would be easy", "It will be easy", "It is going to easy"], answer: 1, why: "Ser-Á lleva -á: will be." },
      { q: "«Sería fácil» (condicional) es…", options: ["It will be easy", "It would be easy", "It is easy"], answer: 1, why: "Ser-ÍA lleva -ía: would be." },
      { q: "«Voy a comer» se traduce literalmente como…", options: ["I will eat", "I am going to eat", "I go to eat"], answer: 1, why: "«be going to» es literalmente «ir a»: am going to = voy a." },
      { q: "«Te llamarán mañana» es…", options: ["They will call you tomorrow", "They would call you tomorrow", "They are calling you tomorrow"], answer: 0, why: "Llamar-ÁN lleva -án: will call." },
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
        t: "p",
        text: "En español un solo verbo, «deber», hace de todo: obligación («debes irte»), consejo («deberías descansar») e incluso conjetura («debe de ser tarde»). El inglés reparte eso en piezas que no se pueden intercambiar: poner «must» donde tocaba «should» suena a orden; poner «should» donde tocaba «must» hace que algo obligatorio parezca opcional. Aprender los modales es sobre todo aprender ESE reparto.",
      },
      {
        t: "formula",
        parts: ["Sujeto", "modal", "verbo base"],
        example: "She can speak three languages.",
      },
      {
        t: "p",
        text: "Antes que nada, la traducción literal de cada uno. Un modal NO se traduce por un verbo suelto: se traduce por una FORMA del verbo que va detrás. En «I would go», la palabra «would» no significa nada por sí sola — lo que hace es convertir «go» en «iría». Por eso conviene aprenderse el modal junto a lo que le hace al verbo español.",
      },
      {
        t: "table",
        head: ["Modal", "Traducción literal", "Ejemplo", "En español"],
        rows: [
          ["can", "puedo / sé", "I can swim.", "Sé nadar."],
          ["could", "podría / podía", "I could help you.", "Podría ayudarte."],
          ["must", "debo / tengo que", "I must go.", "Tengo que irme."],
          ["have to", "tengo que", "I have to go.", "Tengo que irme."],
          ["should", "debería", "I should go.", "Debería irme."],
          ["may", "puede que / puedo", "It may rain.", "Puede que llueva."],
          ["might", "puede que (más flojo)", "It might rain.", "Puede que llueva (menos probable)."],
          ["will", "(futuro: -é, -á)", "I will go.", "Iré."],
          ["would", "(condicional: -ía)", "I would go.", "Iría."],
        ],
      },
      {
        t: "p",
        text: "Fíjate en los tres últimos de la tabla, porque ahí está el mecanismo que más se le escapa a un español: WOULD, COULD y SHOULD no se traducen por una palabra, sino por la TERMINACIÓN -ÍA del verbo español. Donde el inglés añade una palabra delante, el español cambia el final del verbo. Son exactamente la misma operación.",
      },
      {
        t: "formula",
        parts: ["would", "verbo base"],
        example: "I would go = Ir-ÍA",
      },
      {
        t: "table",
        head: ["Inglés", "Español", "Qué pasó"],
        rows: [
          ["I would go", "Iría", "go → ir + ía"],
          ["I would like to go to Paris", "Me gustaría ir a París", "like → gustar + ía"],
          ["It would be better", "Sería mejor", "be → ser + ía"],
          ["She would never say that", "Nunca diría eso", "say → decir + ía"],
          ["I could help you", "Podría ayudarte", "could → poder + ía"],
          ["You should call her", "Deberías llamarla", "should → deber + ía"],
        ],
      },
      {
        t: "tip",
        text: "Truco para no fallar nunca con «would»: si en español te sale un verbo acabado en -ía (haría, tendría, sería, gustaría, viviría), en inglés eso es WOULD + verbo base. Y al revés: si ves «would», busca el -ía. «I would travel» no es «yo viajar», es «viajaría». El error clásico del español es traducir would por «quisiera» o dejarlo sin traducir.",
      },
      {
        t: "p",
        text: "«May» y «might» funcionan distinto: se traducen con «puede que», y eso arrastra un subjuntivo en español. «It may rain» no es «puede llover», es «puede QUE LLUEVA». La diferencia entre los dos es solo de probabilidad: «may» es una posibilidad razonable, «might» es más remota. En español eso se nota poniendo «quizá» o «a lo mejor» delante.",
      },
      {
        t: "table",
        head: ["Modal", "Fuerza", "Ejemplo", "En español"],
        rows: [
          ["will", "seguro", "It will rain.", "Va a llover / lloverá."],
          ["may", "posible, razonable", "It may rain.", "Puede que llueva."],
          ["might", "posible, más remoto", "It might rain.", "A lo mejor llueve."],
          ["can't", "imposible", "It can't be true.", "No puede ser verdad."],
        ],
      },
      {
        t: "table",
        head: ["Modal", "Qué expresa exactamente", "Ejemplo"],
        rows: [
          ["can", "capacidad o permiso informal: «puedo / sé»", "I can swim."],
          ["could", "capacidad en pasado, o petición educada", "Could you help me?"],
          ["must", "obligación que te impones tú, o certeza casi total", "You must be tired."],
          ["have to", "obligación que viene de fuera: norma, ley, horario", "I have to wear a uniform."],
          ["should", "consejo o recomendación, sin obligar", "You should see a doctor."],
          ["may", "permiso formal, o posibilidad moderada", "May I come in?"],
          ["might", "posibilidad floja, menos segura que may", "It might rain later."],
          ["would", "condicional, ofrecimientos, cortesía", "I would love to come."],
        ],
      },
      {
        t: "tip",
        text: "«Must» hace el trabajo de dos verbos españoles que no tienen nada que ver entre sí. Cuando es obligación, must = «debo / tengo que» (I must call her = Debo llamarla). Cuando es una certeza casi segura sobre algo que no has comprobado, must = «debe DE» (She must be home = Debe de estar en casa: estás casi seguro, no se lo estás mandando a nadie). Es el mismo lío que hay en español entre «debes venir» y «debe de haber salido»: el inglés usa la MISMA palabra para las dos cosas, así que solo el contexto las distingue.",
      },
      {
        t: "table",
        head: ["Frase con must", "Sentido", "Cómo lo sabes"],
        rows: [
          ["You must wear a helmet.", "obligación — tienes que", "Habla de una norma, no de una suposición."],
          ["She must be tired.", "deducción — debe de estar", "Nadie manda cómo se siente ella: es una conclusión."],
          ["He must know the answer.", "deducción — seguro que sabe", "No es una orden, es algo que deduces de los datos."],
          ["You must finish this by Friday.", "obligación — tienes que", "Hay una fecha límite real de por medio."],
        ],
      },
      {
        t: "error",
        wrong: "She can to drive. / He cans drive.",
        right: "She can drive.",
        why: "Después de un modal va el verbo desnudo: sin «to» y sin «-s», da igual la persona.",
      },
      {
        t: "p",
        text: "Escala de fuerza, de más exigente a más suave: MUST y HAVE TO mandan (obligatorio), SHOULD aconseja (recomendable, pero se puede ignorar), MAY / MIGHT / COULD abren posibilidad (quizá). Si dudas entre dos modales, pregúntate cuánta fuerza le quieres dar a la frase: «you should call her» es un consejo que puede no seguir; «you must call her» casi no le deja opción.",
      },
      {
        t: "tip",
        text: "must vs have to, en corto: MUST sale de ti, HAVE TO viene de fuera. Y sus negativos NO son intercambiables: «mustn't» prohíbe, «don't have to» libera. El detalle completo, con más ejercicios, está en la lección «must, have to y should».",
      },
      {
        t: "examples",
        items: [
          { en: "You mustn't park here.", pron: "yu má-sent park jier", es: "No debes aparcar aquí (prohibido)." },
          { en: "You don't have to park here.", pron: "yu dount jav tu park jier", es: "No hace falta que aparques aquí." },
          { en: "Could you say that again, please?", pron: "cud yu séi dat a-guén plíis", es: "¿Podría repetirlo, por favor?" },
          { en: "She isn't answering. She must be busy.", pron: "shi í-sent án-se-ring. shi mast bi bí-si.", es: "No contesta. Debe de estar ocupada." },
          { en: "You must wear a seatbelt in this car.", pron: "yu mast uér a síit-belt in dis kar.", es: "Tienes que llevar el cinturón en este coche." },
          { en: "I might come to the party, I'm not sure yet.", pron: "ai máit kam tu de pár-ti, aim not shur yet.", es: "Puede que vaya a la fiesta, todavía no lo sé." },
          { en: "I would like to go to Paris.", pron: "ai uúd láik tu góu tu pá-ris", es: "Me gustaría ir a París." },
          { en: "It would be better to wait.", pron: "it uúd bi bé-rer tu uéit", es: "Sería mejor esperar." },
          { en: "She would never say that.", pron: "shi uúd né-ver séi dat", es: "Nunca diría eso." },
          { en: "May I ask a question?", pron: "méi ai ask a kués-chon", es: "¿Puedo hacer una pregunta?" },
        ],
      },
    ],
    quiz: [
      { q: "«He can ___ the piano.»", options: ["to play", "play", "plays"], answer: 1, why: "Tras un modal, verbo base sin «to» y sin «-s»." },
      { q: "Prohibición: «You ___ smoke here.»", options: ["don't have to", "mustn't", "shouldn't"], answer: 1, why: "«Mustn't» = está prohibido. «Don't have to» = no es necesario." },
      { q: "Consejo: «You ___ take an umbrella.»", options: ["should", "must", "can"], answer: 0, why: "«Should» es la forma normal de aconsejar." },
      { q: "Petición educada:", options: ["Can you pass the salt?", "Could you pass the salt?", "Las dos, pero la 2ª es más educada"], answer: 2, why: "«Could» suena más cortés que «can», aunque ambas funcionan." },
      { q: "«It ___ rain, but I'm not sure.»", options: ["must", "might", "has to"], answer: 1, why: "«Might» expresa posibilidad no segura." },
      { q: "«She's not picking up the phone. She ___ be in a meeting.» (lo deduces)", options: ["must", "should", "can"], answer: 0, why: "Es una conclusión sobre algo que no ves: must de deducción, «debe de»." },
      { q: "«You ___ show your ID at the door. It's the rule.» (norma real)", options: ["might", "must", "could"], answer: 1, why: "Norma real, no suposición: must de obligación, «tienes que»." },
      { q: "«He must be at least 40.» ¿Es obligación o deducción?", options: ["Obligación: tiene que", "Deducción: debe de tener", "Da igual, es lo mismo"], answer: 1, why: "Hablas de una edad que calculas, no que le impones a nadie: es «debe de»." },
      { q: "¿Cuál de los dos pide más?", options: ["must exige más que should", "should exige más que must", "exigen lo mismo"], answer: 0, why: "«Should» es un consejo que puedes ignorar; «must» casi no deja opción." },
      { q: "«Mustn't» y «don't have to», ¿significan lo mismo?", options: ["Sí, las dos son «no hace falta»", "No: mustn't prohíbe, don't have to libera", "Las dos prohíben"], answer: 1, why: "Son opuestos, y es el error más caro de los modales." },
      { q: "¿Cuál suena MENOS seguro?", options: ["may", "might", "las dos igual"], answer: 1, why: "«Might» es un peldaño más flojo que «may»: la posibilidad es más remota." },
      { q: "«I would love to come» expresa…", options: ["una orden", "un ofrecimiento educado o un deseo", "una prohibición"], answer: 1, why: "«Would» aquí suaviza y muestra disposición, no manda nada." },
      { q: "«___ I come in?» (pidiendo permiso formal)", options: ["Must", "May", "Should"], answer: 1, why: "Para permiso formal, el modal es «may»." },
      { q: "«Me gustaría ir a París» es…", options: ["I like to go to Paris", "I would like to go to Paris", "I will like to go to Paris"], answer: 1, why: "El -ía de «gustaría» es WOULD: would + like." },
      { q: "«Iría, pero no tengo tiempo» empieza por…", options: ["I go", "I will go", "I would go"], answer: 2, why: "«Iría» lleva -ía, así que en inglés es would + verbo base." },
      { q: "¿Qué le hace «would» al verbo español que va detrás?", options: ["Lo pone en pasado", "Le añade la terminación -ía", "Le añade -é (futuro)"], answer: 1, why: "would + base = verbo en condicional: would go = iría, would be = sería." },
      { q: "«Sería mejor esperar» es…", options: ["It would be better to wait", "It will be better to wait", "It is better to wait"], answer: 0, why: "Sería = would be. El -ía delata al would." },
      { q: "«It may rain» se traduce mejor como…", options: ["Puede llover", "Puede que llueva", "Podría haber llovido"], answer: 1, why: "May/might piden «puede que» + subjuntivo en español." },
      { q: "¿Cuál expresa MÁS seguridad de que va a llover?", options: ["It might rain", "It may rain", "It will rain"], answer: 2, why: "Will es lo seguro; may es posible; might es lo más remoto." },
      { q: "«Podría ayudarte» (ofrecimiento) es…", options: ["I can help you", "I could help you", "I must help you"], answer: 1, why: "Podr-ÍA lleva -ía: es «could», el condicional de can." },
      { q: "«Deberías llamarla» es…", options: ["You must call her", "You should call her", "You would call her"], answer: 1, why: "Deber-ÍA es «should»: consejo con la terminación -ía." },
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
        t: "p",
        text: "Traducido pieza por pieza se entiende mucho mejor, porque el español hace lo mismo pero con otras herramientas. Donde el inglés pone un PASADO detrás del «if», el español pone un SUBJUNTIVO. Y donde el inglés pone «would», el español pone la terminación -ía. Son dos cambios, uno en cada mitad de la frase.",
      },
      {
        t: "table",
        head: ["Inglés", "Español", "Las dos mitades"],
        rows: [
          ["If I had money, I would travel.", "Si tuviera dinero, viajaría.", "had → tuviera (subjuntivo) · would travel → viajaría"],
          ["If I were you, I would accept.", "Si fuera tú, aceptaría.", "were → fuera · would accept → aceptaría"],
          ["If she called, I would answer.", "Si llamara, contestaría.", "called → llamara · would answer → contestaría"],
          ["If I had studied, I would have passed.", "Si hubiera estudiado, habría aprobado.", "had studied → hubiera estudiado · would have passed → habría aprobado"],
        ],
      },
      {
        t: "tip",
        text: "Truco práctico: si en español te sale un «-ía» (viajaría, aceptaría, contestaría), esa mitad lleva WOULD. Y si te sale un subjuntivo («tuviera», «fuera», «llamara»), esa mitad lleva PASADO en inglés, no «would». El error más típico del español es meter «would» en las dos mitades: «If I would have money» está mal, es «If I had money».",
      },
      {
        t: "error",
        wrong: "If I would have money, I would travel.",
        right: "If I had money, I would travel.",
        why: "«Would» va solo en la mitad del resultado, nunca detrás del «if». En la parte del if va pasado, que es lo que traduce el subjuntivo español.",
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
      { q: "El subjuntivo español («si tuviera») se traduce al inglés con…", options: ["would + verbo", "el pasado simple (had)", "el presente"], answer: 1, why: "«Si tuviera» = «If I had». El inglés usa pasado donde el español usa subjuntivo." },
      { q: "«Si fuera tú, aceptaría» es…", options: ["If I would be you, I would accept", "If I were you, I would accept", "If I am you, I will accept"], answer: 1, why: "Subjuntivo → pasado (were); el -ía de «aceptaría» → would." },
      { q: "¿Dónde va «would» en un condicional 2?", options: ["En las dos mitades", "Solo en la mitad del resultado", "Solo detrás del if"], answer: 1, why: "Would marca el -ía del resultado; detrás del if va pasado." },
      { q: "«Si hubiera estudiado, habría aprobado» es…", options: ["If I studied, I would pass", "If I had studied, I would have passed", "If I would study, I would pass"], answer: 1, why: "Condicional 3: had + participio / would have + participio." },
      { q: "«Viajaría» delata que esa mitad lleva…", options: ["would", "will", "pasado simple"], answer: 0, why: "El -ía siempre es «would»." },
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
        t: "p",
        text: "La diferencia de fondo con el español es esta: nosotros preguntamos con la ENTONACIÓN, sin tocar el orden. «Trabajas aquí» y «¿Trabajas aquí?» son las mismas palabras en el mismo orden. El inglés no puede hacer eso: tiene que mover piezas o meter un auxiliar. Por eso te sale «Where you live?», porque en español bastaría.",
      },
      {
        t: "table",
        head: ["Afirmación", "Pregunta", "Qué se movió"],
        rows: [
          ["You live here.", "Do you live here?", "Aparece «do» delante."],
          ["She works here.", "Does she work here?", "«Does» se lleva la -s del verbo."],
          ["You are ready.", "Are you ready?", "«Are» salta delante del sujeto."],
          ["He has finished.", "Has he finished?", "«Has» salta delante del sujeto."],
          ["They will come.", "Will they come?", "«Will» salta delante del sujeto."],
        ],
      },
      {
        t: "tip",
        text: "Fíjate en el patrón: si la frase YA tiene un auxiliar (are, has, will, can), ese auxiliar salta delante del sujeto y ya está. Si NO lo tiene (verbos normales en presente o pasado), hay que traer uno de fuera: do, does o did. Esa es toda la mecánica de las preguntas inglesas.",
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
      { q: "¿Cómo pregunta el español que el inglés no puede copiar?", options: ["Cambiando el orden", "Solo con la entonación", "Añadiendo un auxiliar"], answer: 1, why: "«¿Trabajas aquí?» son las mismas palabras en el mismo orden: el inglés necesita mover piezas." },
      { q: "«She is ready» en pregunta es…", options: ["Does she is ready?", "Is she ready?", "She is ready?"], answer: 1, why: "Ya hay auxiliar (is): salta delante del sujeto, sin traer «do»." },
      { q: "«They will come» en pregunta es…", options: ["Will they come?", "Do they will come?", "They will come?"], answer: 0, why: "«Will» ya es auxiliar: se adelanta y ya está." },
      { q: "¿Cuándo hay que traer «do / does / did»?", options: ["Siempre", "Solo si la frase no tiene ya un auxiliar", "Solo en preguntas WH-"], answer: 1, why: "Con are, has, will o can basta con adelantarlos; sin ellos hace falta do." },
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
        head: ["Inglés", "Español", "Qué hizo el inglés"],
        rows: [
          ["taller", "más alto", "-er hace el trabajo de «más»"],
          ["the tallest", "el más alto", "-est hace el trabajo de «el más»"],
          ["more expensive", "más caro", "aquí sí usa «more», como el español"],
          ["the most expensive", "el más caro", "«the most» = «el más»"],
          ["as tall as", "tan alto como", "as … as = tan … como"],
          ["taller than", "más alto que", "«than» = «que» comparativo"],
        ],
      },
      {
        t: "tip",
        text: "Ojo con «than» y «then», que se pronuncian casi igual pero no son lo mismo: THAN es el «que» de comparar (bigger than), THEN es «entonces / luego». Escribir «bigger then me» es un error habitual incluso entre nativos.",
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
      { q: "En «taller», ¿qué pieza hace el trabajo del «más» español?", options: ["la palabra more", "la terminación -er", "la palabra the"], answer: 1, why: "-er ya significa «más»: por eso «more taller» sobra." },
      { q: "«Tan alto como su hermano» es…", options: ["as tall as his brother", "so tall as his brother", "more tall than his brother"], answer: 0, why: "as … as = tan … como." },
      { q: "El «que» de comparar (más alto QUE) es…", options: ["then", "than", "that"], answer: 1, why: "«Than» compara; «then» es «entonces»; «that» es «que» de otras cosas." },
      { q: "«El más caro» es…", options: ["the more expensive", "the most expensive", "most expensive"], answer: 1, why: "«The most» traduce «el más» en adjetivos largos." },
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
      { q: "«Un consejo» es…", options: ["an advice", "a piece of advice", "one advice"], answer: 1, why: "«Advice» es incontable: para contarlo se usa «a piece of»." },
      { q: "«Muchos deberes» es…", options: ["many homeworks", "a lot of homework", "much homeworks"], answer: 1, why: "«Homework» es incontable: ni plural ni many." },
      { q: "«People» lleva verbo…", options: ["en singular: people is", "en plural: people are", "cualquiera"], answer: 1, why: "«People» ya es plural: «people are», nunca «people is»." },
      { q: "¿Por qué decimos «informations» los españoles?", options: ["Porque en español «información» sí tiene plural", "Porque suena mejor", "Porque es una excepción"], answer: 0, why: "Calcamos el plural español a una palabra que en inglés es incontable." },
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
      { q: "En español los dos son «aburrido». ¿Qué distingue -ed de -ing?", options: ["El registro", "Quién siente (-ed) y qué lo provoca (-ing)", "El tiempo verbal"], answer: 1, why: "Las personas sienten (-ed), las cosas provocan (-ing)." },
      { q: "«Estoy cansado» es…", options: ["I am tiring", "I am tired", "I am tire"], answer: 1, why: "Tú sientes el cansancio: -ed." },
      { q: "«El viaje fue agotador» es…", options: ["The trip was tired", "The trip was tiring", "The trip was tire"], answer: 1, why: "El viaje provoca el cansancio: -ing." },
      { q: "Si puedes cambiarlo por «estoy…», el adjetivo va con…", options: ["-ed", "-ing", "sin terminación"], answer: 0, why: "«Estoy aburrido» = I'm bored. «Soy aburrido» = I'm boring." },
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
      { q: "«Unhappy» significa…", options: ["muy feliz","no feliz","antes feliz"], answer: 1, why: "El prefijo «un-» niega: happy → unhappy." },
      { q: "Para decir «volver a hacer algo» el prefijo es…", options: ["un-","re-","mis-"], answer: 1, why: "«Re-» es «otra vez»: redo, rewrite, reread." },
      { q: "«Careless» significa…", options: ["con cuidado","sin cuidado","más cuidado"], answer: 1, why: "«-less» es «sin»: careless, useless, homeless." },
      { q: "Si te sabes las piezas, ¿qué ganas?", options: ["Pronunciar mejor","Entender palabras que nunca has estudiado","Escribir más rápido"], answer: 1, why: "Reconocer prefijos y sufijos multiplica lo que entiendes sin memorizar." },
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
      { q: "«Un coche rojo»: ¿qué palabra va primero en inglés?", options: ["car", "red", "da igual"], answer: 1, why: "El adjetivo inglés va SIEMPRE delante: a red car. Justo al revés que en español." },
      { q: "Los adjetivos ingleses, ¿cambian en plural?", options: ["Sí, llevan -s", "No, nunca cambian", "Solo algunos"], answer: 1, why: "«Two red cars», nunca «two reds cars»." },
      { q: "Los adjetivos ingleses, ¿tienen masculino y femenino?", options: ["Sí", "No, son invariables", "Solo con personas"], answer: 1, why: "«A tall man» y «a tall woman»: la misma palabra sin cambios." },
      { q: "«Unas chicas altas» es…", options: ["some talls girls", "some tall girls", "some girls tall"], answer: 1, why: "Delante, sin -s y sin género: tall girls." },
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
        t: "p",
        text: "Empecemos por la traducción literal, que ya avisa del problema. «A / an» es «un / una», y «the» es «el / la / los / las» — los cuatro en una sola palabra, porque el inglés no tiene ni género ni número en el artículo. Eso es lo fácil. Lo difícil es que el inglés tiene una cuarta opción que el español casi no usa: NINGÚN artículo.",
      },
      {
        t: "table",
        head: ["Inglés", "Español", "Detalle"],
        rows: [
          ["a dog", "un perro", "«a» = un / una, sin distinguir género."],
          ["the dog", "el perro", "«the» = el, la, los, las: una palabra para las cuatro."],
          ["the dogs", "los perros", "«the» no cambia en plural."],
          ["dogs", "los perros (en general)", "Sin artículo: el español pone «los», el inglés nada."],
        ],
      },
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
      { q: "«The» se traduce por…", options: ["solo «el»", "el, la, los y las: las cuatro", "un y una"], answer: 1, why: "El inglés no marca género ni número en el artículo: «the» vale para todo." },
      { q: "«Los perros son leales» (en general) es…", options: ["The dogs are loyal", "Dogs are loyal", "A dogs are loyal"], answer: 1, why: "En generalizaciones el inglés quita el artículo aunque el español lo ponga." },
      { q: "«Me gusta la música» es…", options: ["I like the music", "I like music", "I like a music"], answer: 1, why: "Hablas de la música en general: sin artículo." },
      { q: "¿Cuál es la opción que el español casi nunca usa y el inglés sí?", options: ["a / an", "the", "ningún artículo"], answer: 2, why: "El español pone artículo casi siempre; el inglés lo omite en generalizaciones." },
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
      { q: "«had + participio» equivale en español a…", options: ["he comido", "había comido", "comería"], answer: 1, why: "had = había. Es el pluscuamperfecto, igual que en español." },
      { q: "«Cuando llegué, ya se había ido» es…", options: ["When I arrived, he already left", "When I arrived, he had already gone", "When I arrived, he has already gone"], answer: 1, why: "Lo anterior a otro pasado: had + participio." },
      { q: "El past perfect sirve para…", options: ["el pasado más reciente", "el pasado ANTERIOR a otro pasado", "el futuro en el pasado"], answer: 1, why: "Marca cuál de los dos hechos pasados ocurrió primero." },
      { q: "«Had» cambia según la persona?", options: ["Sí: had / hads", "No, es «had» para todos", "Solo en tercera persona"], answer: 1, why: "I had, she had, they had: una sola forma." },
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
      { q: "«have been + -ing» equivale a…", options: ["llevo + -ando","había + participio","estaría + -ando"], answer: 0, why: "I have been working = llevo trabajando." },
      { q: "«Llevo dos horas esperando» es…", options: ["I wait for two hours","I have been waiting for two hours","I am waiting for two hours"], answer: 1, why: "«Llevar + tiempo + gerundio» es el present perfect continuo." },
      { q: "La diferencia con el present perfect normal es que el continuo insiste en…", options: ["el resultado","la duración y que sigue","el pasado lejano"], answer: 1, why: "«I've read it» (resultado) frente a «I've been reading it» (llevo un rato y sigo)." },
      { q: "«Estoy sin aliento porque he estado corriendo» usa el continuo porque…", options: ["es más formal","explica una actividad reciente que deja huella ahora","es obligatorio con «because»"], answer: 1, why: "El continuo conecta la actividad con el efecto visible en el presente." },
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
        t: "p",
        text: "La traducción literal es «ser + participio», y encaja: was built = fue construida. Pero aquí hay algo más importante que la forma: el español casi nunca la usa así. Nosotros preferimos el «se» impersonal, y el inglés no tiene esa opción. Por eso el inglés usa la pasiva muchísimo más que nosotros, y por eso suena natural en sitios donde en español chirriaría.",
      },
      {
        t: "table",
        head: ["Inglés", "Español natural", "Español literal (raro)"],
        rows: [
          ["The house was built in 1990.", "La casa se construyó en 1990.", "La casa fue construida en 1990."],
          ["English is spoken here.", "Aquí se habla inglés.", "El inglés es hablado aquí."],
          ["The car is made in Germany.", "El coche se fabrica en Alemania.", "El coche es fabricado en Alemania."],
          ["My wallet was stolen.", "Me robaron la cartera.", "Mi cartera fue robada."],
        ],
      },
      {
        t: "tip",
        text: "Si en español te sale un «se» impersonal («se habla», «se vende», «se construyó») o un «me robaron / te dijeron» sin sujeto claro, en inglés eso suele ser una PASIVA. Es la señal más fiable: donde nosotros escondemos al culpable con un «se», el inglés lo esconde con be + participio.",
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
      { q: "«Aquí se habla inglés» es…", options: ["Here speaks English", "English is spoken here", "Here is speaking English"], answer: 1, why: "El «se» impersonal español se traduce con pasiva: be + participio." },
      { q: "El «se» impersonal español («se vende», «se construyó») suele traducirse…", options: ["con una pasiva inglesa", "con «it»", "con «one»"], answer: 0, why: "El inglés no tiene ese «se»: usa be + participio para esconder al agente." },
      { q: "«Me robaron la cartera» suena natural en inglés como…", options: ["They stole me the wallet", "My wallet was stolen", "It stole my wallet"], answer: 1, why: "Sin culpable concreto, el inglés va a la pasiva." },
      { q: "¿Quién usa más la pasiva?", options: ["El español", "El inglés", "Los dos igual"], answer: 1, why: "El español prefiere el «se» impersonal; el inglés recurre a la pasiva mucho más." },
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
      { q: "En estilo indirecto, el presente pasa a…", options: ["futuro", "pasado", "no cambia"], answer: 1, why: "«I live» → he lived. Todo retrocede un tiempo." },
      { q: "«Will» en estilo indirecto pasa a…", options: ["would", "will", "shall"], answer: 0, why: "Y ahí vuelve a salir el -ía: dijo que vendría = he said he would come." },
      { q: "«Can» en estilo indirecto pasa a…", options: ["can", "could", "may"], answer: 1, why: "He said he could swim: otra vez el retroceso de un tiempo." },
      { q: "«Tomorrow» en estilo indirecto suele pasar a…", options: ["tomorrow", "the next day", "that day"], answer: 1, why: "Los marcadores de tiempo también se desplazan." },
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
        t: "p",
        text: "Lo primero es entender por qué esto es un problema SOLO para nosotros: en español, detrás de un verbo va siempre el infinitivo. «Quiero comer», «disfruto leyendo»... bueno, ahí ya no. El español también reparte entre infinitivo y gerundio, pero NO en los mismos verbos, así que la intuición española te traiciona en vez de ayudarte. Por eso hay que aprenderse las listas: no puedes deducirlas.",
      },
      {
        t: "table",
        head: ["Inglés", "Español", "Ojo"],
        rows: [
          ["I want to eat.", "Quiero comer.", "Aquí coincide: los dos usan infinitivo."],
          ["I enjoy reading.", "Disfruto leyendo.", "Aquí también coincide, por suerte."],
          ["I finished working.", "Terminé de trabajar.", "El español usa infinitivo y el inglés -ing."],
          ["I avoid talking about it.", "Evito hablar de ello.", "El español usa infinitivo y el inglés -ing."],
          ["I decided to leave.", "Decidí irme.", "Aquí vuelven a coincidir."],
        ],
      },
      {
        t: "tip",
        text: "La única regla que SÍ es automática y no falla nunca: detrás de una preposición (in, at, on, of, about, for, before, after, without) siempre va -ing. «Before leaving», «good at cooking», «without saying». En español ahí ponemos infinitivo («antes de salir»), así que es el error más mecánico y el más fácil de corregir de golpe.",
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
      { q: "«Antes de salir» es…", options: ["before to leave", "before leaving", "before leave"], answer: 1, why: "Tras preposición siempre -ing, aunque el español ponga infinitivo." },
      { q: "¿Cuál es la única regla que nunca falla?", options: ["Tras preposición, siempre -ing", "Tras verbo, siempre to", "Tras verbo, siempre -ing"], answer: 0, why: "Es la única automática: in, at, on, about, before, after + -ing." },
      { q: "«Terminé de trabajar» es…", options: ["I finished to work", "I finished working", "I finished work to"], answer: 1, why: "Finish va con -ing, aunque el español use infinitivo." },
      { q: "«Se me da bien cocinar» es…", options: ["I'm good at cook", "I'm good at to cook", "I'm good at cooking"], answer: 2, why: "«At» es preposición, así que detrás va -ing." },
      { q: "¿Por qué no sirve la intuición española aquí?", options: ["Porque el español solo usa infinitivo", "Porque reparte infinitivo y gerundio en verbos distintos", "Porque el español no tiene gerundio"], answer: 1, why: "Los dos idiomas reparten, pero no en los mismos verbos: hay que aprender las listas." },
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
      { q: "El «que» español se reparte en inglés según…", options: ["si es persona o cosa", "si es singular o plural", "si es formal"], answer: 0, why: "«Who» para personas, «which» para cosas, «that» para las dos." },
      { q: "«El hombre que vive aquí» es…", options: ["The man which lives here", "The man who lives here", "The man what lives here"], answer: 1, why: "Persona → who (o that)." },
      { q: "«El libro que compré» es…", options: ["The book who I bought", "The book which I bought", "The book what I bought"], answer: 1, why: "Cosa → which (o that). «What» nunca es pronombre relativo." },
      { q: "«That» sirve para…", options: ["solo personas", "solo cosas", "personas y cosas, en frases especificativas"], answer: 2, why: "Es la opción cómoda: vale para los dos." },
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
      { q: "«Used to» equivale en español a…", options: ["el imperfecto: solía / -aba", "el indefinido: hice", "el condicional: haría"], answer: 0, why: "«I used to work» = «trabajaba / solía trabajar»." },
      { q: "«Antes fumaba» es…", options: ["I use to smoke", "I used to smoke", "I am used to smoke"], answer: 1, why: "Siempre «used to», con -d, aunque la frase sea afirmativa." },
      { q: "«Used to» y «be used to» significan…", options: ["lo mismo", "cosas distintas: solía / estoy acostumbrado a", "solo cambia el registro"], answer: 1, why: "«I used to work» = trabajaba. «I'm used to working» = estoy acostumbrado a trabajar." },
      { q: "«Estoy acostumbrado a madrugar» es…", options: ["I used to get up early", "I'm used to getting up early", "I use to get up early"], answer: 1, why: "«Be used to» + -ing: estar acostumbrado a." },
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
      { q: "«Mucho» se dice de dos maneras en inglés según…", options: ["si es formal o informal", "si el sustantivo se puede contar o no", "si es presente o pasado"], answer: 1, why: "Many para contables (many books), much para incontables (much time)." },
      { q: "«Mucho tiempo» es…", options: ["many time", "much time", "many times"], answer: 1, why: "«Time» aquí es incontable: much." },
      { q: "«Muchos amigos» es…", options: ["much friends", "many friends", "much of friends"], answer: 1, why: "«Friends» se puede contar: many." },
      { q: "«A lot of» sirve para…", options: ["solo contables", "solo incontables", "para los dos"], answer: 2, why: "Por eso es la salida segura cuando dudas entre much y many." },
      { q: "«Pocas sillas» (contable) es…", options: ["little chairs", "few chairs", "much chairs"], answer: 1, why: "Few para contables, little para incontables (little time)." },
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
        t: "p",
        text: "El motivo de fondo es demoledor de sencillo: las TRES se traducen por «en». El español usa una sola palabra donde el inglés usa tres, así que la traducción no te da ninguna pista y hay que aprenderse cuál va con qué. No es que las uses mal: es que en español no existe la distinción.",
      },
      {
        t: "table",
        head: ["Español", "Inglés", "Por qué esa"],
        rows: [
          ["en julio", "in July", "Mes → in"],
          ["en 2020", "in 2020", "Año → in"],
          ["en lunes", "on Monday", "Día de la semana → on"],
          ["en mi cumpleaños", "on my birthday", "Fecha concreta → on"],
          ["a las seis", "at six", "Hora concreta → at"],
          ["en la mesa", "on the table", "Superficie → on"],
          ["en la caja", "in the box", "Dentro → in"],
          ["en la parada", "at the bus stop", "Punto concreto → at"],
        ],
      },
      {
        t: "tip",
        text: "Imagen que ayuda: IN es dentro de algo (un mes, un año, una caja, una ciudad). ON es encima o pegado a una superficie (una mesa, una pared, y por extensión un día del calendario). AT es un punto exacto en el mapa o en el reloj (las seis, la parada, la puerta). De más grande a más pequeño: in → on → at.",
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
      { q: "¿Por qué in, on y at cuestan tanto a un español?", options: ["Porque no existen en español", "Porque las tres se traducen por «en»", "Porque cambian según la región"], answer: 1, why: "El español usa una sola palabra donde el inglés distingue tres." },
      { q: "«En julio» es…", options: ["on July", "in July", "at July"], answer: 1, why: "Los meses van con «in»." },
      { q: "«El lunes» (día de la semana) es…", options: ["in Monday", "at Monday", "on Monday"], answer: 2, why: "Los días de la semana y las fechas van con «on»." },
      { q: "«A las seis» es…", options: ["at six", "in six", "on six"], answer: 0, why: "Las horas concretas van con «at»." },
      { q: "De más grande a más concreto, el orden es…", options: ["at → on → in", "in → on → at", "on → in → at"], answer: 1, why: "In (dentro), on (superficie o día), at (punto exacto)." },
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
      { q: "El español tiene «¿verdad?» y «¿no?». ¿Cuántas coletillas tiene el inglés?", options: ["Dos, igual", "Una sola", "Una distinta para cada frase"], answer: 2, why: "La coletilla se fabrica con el auxiliar de la frase: cambia en cada caso." },
      { q: "La regla básica de las coletillas es…", options: ["repetir el verbo principal", "frase afirmativa → coletilla negativa, y al revés", "usar siempre «right?»"], answer: 1, why: "«You're tired, aren't you?» / «You aren't tired, are you?»" },
      { q: "«Eres español, ¿verdad?» es…", options: ["You are Spanish, are you?", "You are Spanish, aren't you?", "You are Spanish, no?"], answer: 1, why: "Afirmativa → coletilla negativa, con el mismo auxiliar (are → aren't)." },
      { q: "«She works here, ___?»", options: ["doesn't she", "does she", "isn't she"], answer: 0, why: "No hay auxiliar en la frase, así que se trae «does», y en negativo." },
      { q: "En la conversación real, ¿para qué sirven sobre todo?", options: ["Para preguntar de verdad", "Para buscar confirmación o dar conversación", "Para sonar formal"], answer: 1, why: "Casi nunca preguntan en serio: buscan acuerdo o mantienen el intercambio." },
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
        t: "p",
        text: "La traducción literal aclara de dónde sale el error: «there is / there are» es «hay», pero palabra por palabra significa «ahí está / ahí están». No tiene nada que ver con tener. Muchos hispanohablantes traducen «hay» por «it has» porque en catalán, francés o italiano sí se usa un verbo de posesión (hi ha, il y a, c'è). En inglés no: «hay» es SIEMPRE «there is / there are».",
      },
      {
        t: "table",
        head: ["Español", "Inglés", "Nunca digas"],
        rows: [
          ["Hay un problema.", "There is a problem.", "It has a problem."],
          ["Hay tres coches.", "There are three cars.", "There is three cars."],
          ["Había mucha gente.", "There were a lot of people.", "It had a lot of people."],
          ["No hay tiempo.", "There isn't any time.", "It hasn't time."],
          ["¿Hay algún problema?", "Is there a problem?", "Has it a problem?"],
        ],
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
      { q: "«There is» significa literalmente…", options: ["ello tiene", "ahí está", "es allí"], answer: 1, why: "Literalmente «ahí está»; nada que ver con tener." },
      { q: "«Había mucha gente» es…", options: ["It had a lot of people", "There were a lot of people", "There was a lot of people"], answer: 1, why: "«people» es plural en inglés, así que en pasado va «were»." },
      { q: "«¿Hay algún problema?» es…", options: ["Has it a problem?", "Is there a problem?", "There is a problem?"], answer: 1, why: "Para preguntar se invierte: Is there…?" },
      { q: "¿Por qué muchos hispanohablantes dicen «it has» para «hay»?", options: ["Porque en inglés también vale", "Porque en catalán, francés e italiano se usa un verbo de posesión", "Porque es más formal"], answer: 1, why: "hi ha, il y a, c'è… pero el inglés no funciona así." },
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
      { q: "Lo que decide entre SAY y TELL es…", options: ["el significado", "si mencionas a la persona justo detrás", "el tiempo verbal"], answer: 1, why: "Con persona detrás, tell (tell me). Sin persona, say (say something)." },
      { q: "«Me dijo la verdad» es…", options: ["He said me the truth", "He told me the truth", "He spoke me the truth"], answer: 1, why: "Hay persona («me») justo detrás: tell." },
      { q: "«Dijo que estaba cansado» es…", options: ["He said he was tired", "He told he was tired", "He spoke he was tired"], answer: 0, why: "Sin persona detrás: say." },
      { q: "«Hablo inglés» es…", options: ["I say English", "I tell English", "I speak English"], answer: 2, why: "Para idiomas siempre «speak»." },
      { q: "«Estuvimos hablando una hora» (conversación) es…", options: ["We said for an hour", "We talked for an hour", "We told for an hour"], answer: 1, why: "«Talk» es conversar; say y tell son «decir»." },
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
      { q: "¿Por qué make y do se confunden tanto?", options: ["Porque suenan parecido", "Porque los dos se traducen por «hacer»", "Porque son irregulares"], answer: 1, why: "El español tiene un solo verbo donde el inglés tiene dos." },
      { q: "MAKE se acerca más a la idea de…", options: ["crear algo que antes no existía", "cumplir una tarea", "empezar algo"], answer: 0, why: "Make = fabricar, producir, crear: make a cake, make a decision." },
      { q: "DO se acerca más a la idea de…", options: ["crear un objeto", "realizar una actividad o tarea", "terminar algo"], answer: 1, why: "Do = llevar a cabo: do your homework, do the dishes, do exercise." },
      { q: "«Hacer una foto» es…", options: ["do a photo", "make a photo", "take a photo"], answer: 2, why: "Ojo: aquí no es ni make ni do. El inglés usa «take» para las fotos." },
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
      { q: "«Desde 2019» es…", options: ["for 2019", "since 2019", "ago 2019"], answer: 1, why: "«Since» marca el punto de inicio: desde." },
      { q: "«Durante cinco años» es…", options: ["since five years", "for five years", "five years ago"], answer: 1, why: "«For» marca la duración: durante." },
      { q: "«Hace dos horas» es…", options: ["since two hours", "for two hours", "two hours ago"], answer: 2, why: "«Ago» va DETRÁS de la cantidad y pide pasado simple." },
      { q: "«Llevo dos años aquí» es…", options: ["I am here since two years", "I have been here for two years", "I am here for two years"], answer: 1, why: "«Llevo + tiempo» es present perfect con for, nunca presente." },
      { q: "¿Dónde va «ago» en la frase?", options: ["Delante de la cantidad", "Detrás de la cantidad", "Al principio de la frase"], answer: 1, why: "«Two hours ago», nunca «ago two hours»." },
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
      { q: "«Quiero agua» (en español no ponemos nada delante) es…", options: ["I want water", "I want some water", "Las dos valen, «some» suena más natural"], answer: 2, why: "El inglés casi siempre pone algo delante; «some water» es lo natural." },
      { q: "En afirmativa se usa…", options: ["some", "any", "cualquiera"], answer: 0, why: "Some en afirmativa; any en negativa y pregunta." },
      { q: "«¿Tienes hermanos?» es…", options: ["Do you have some brothers?", "Do you have any brothers?", "Do you have brothers?"], answer: 1, why: "Pregunta normal → any." },
      { q: "¿Por qué a un español se le olvida some/any?", options: ["Porque son difíciles de pronunciar", "Porque en español muchas veces no ponemos nada delante", "Porque no existen"], answer: 1, why: "«Quiero agua», «¿Tienes hermanos?»: el español va sin determinante y el inglés no." },
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
      { q: "«Depender de» es…", options: ["depend of","depend on","depend from"], answer: 1, why: "La preposición no se traduce literalmente: depend ON." },
      { q: "«Pensar en algo» es…", options: ["think in","think about","think on"], answer: 1, why: "«Think about», nunca «think in», que es el calco directo del español." },
      { q: "«Llegar a Madrid» es…", options: ["arrive to Madrid","arrive in Madrid","arrive at Madrid"], answer: 1, why: "Nunca «arrive to». Ciudades y países con «in»; sitios concretos con «at»." },
      { q: "¿Por qué fallan tanto estas preposiciones?", options: ["Porque son irregulares","Porque cada idioma elige la suya sin lógica común","Porque cambian con el tiempo"], answer: 1, why: "Hay que aprenderse el verbo Y su preposición como una sola pieza." },
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
      { q: "En «el coche de mi hermano», ¿qué va primero en inglés?", options: ["car", "my brother", "da igual"], answer: 1, why: "El inglés invierte el orden respecto al español: my brother's car." },
      { q: "El «de» de posesión con personas se convierte en…", options: ["of", "'s", "from"], answer: 1, why: "«De mi hermano» = «my brother's», con el orden dado la vuelta." },
      { q: "«La habitación de mi hermana» es…", options: ["The room of my sister", "My sister's room", "The my sister room"], answer: 1, why: "Persona → 's, y el poseedor delante." },
      { q: "¿Por qué «the dog of Ana» suena mal?", options: ["Porque «of» no existe", "Porque con personas el inglés usa 's", "Porque falta un artículo"], answer: 1, why: "«Of» se reserva sobre todo para cosas; con personas se usa 's." },
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
      { q: "«Apágala» (la tele) es…", options: ["Turn off it", "Turn it off", "It turn off"], answer: 1, why: "Con pronombre (it, them, him) el objeto va SIEMPRE en medio." },
      { q: "«Apaga la tele» admite…", options: ["solo «turn off the TV»", "solo «turn the TV off»", "las dos formas"], answer: 2, why: "Con sustantivo puede ir en medio o al final; solo el pronombre obliga." },
      { q: "¿Por qué «turn off it» suena mal?", options: ["Porque «it» es demasiado corto para ir al final", "Porque «off» va siempre al final", "Porque falta un artículo"], answer: 0, why: "Los pronombres átonos no soportan la posición final: se meten en medio." },
      { q: "En un phrasal INSEPARABLE, el objeto va…", options: ["en medio", "siempre detrás de la partícula", "donde quieras"], answer: 1, why: "«Look after the kids», nunca «look the kids after»." },
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
      { q: "«Worked» se pronuncia…", options: ["uór-ked, dos sílabas","uerkt, una sílaba","uór-kid"], answer: 1, why: "La -ed solo suena como sílaba aparte tras t o d." },
      { q: "¿Tras qué sonidos la -ed añade una sílaba entera?", options: ["tras t y d","tras k y p","tras s y sh"], answer: 0, why: "wanted, needed, started: ahí sí se oye «-id»." },
      { q: "«Played» tiene…", options: ["una sílaba","dos sílabas","tres sílabas"], answer: 0, why: "Pléid: la -ed se pega y no suena aparte." },
      { q: "El error típico del español con la -ed es…", options: ["pronunciarla siempre como sílaba","no pronunciarla nunca","cambiarla por -id"], answer: 0, why: "Decir «uór-ked» en vez de «uerkt» delata enseguida." },
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
      { q: "En español el acento casi siempre cae en…", options: ["la última o la penúltima sílaba","la primera siempre","donde quieras"], answer: 0, why: "Por eso desplazamos el acento inglés sin darnos cuenta." },
      { q: "«Hotel» en inglés lleva el acento en…", options: ["HO-tel","ho-TEL","las dos valen"], answer: 1, why: "Igual que en español, pero muchas palabras no coinciden." },
      { q: "En las palabras compuestas (airport, bedroom) manda…", options: ["la primera parte","la segunda parte","ninguna"], answer: 0, why: "AIRport, BEDroom: el golpe va delante." },
      { q: "Un acento mal puesto…", options: ["se entiende igual","puede hacer que no te entiendan aunque los sonidos estén bien","solo importa por escrito"], answer: 1, why: "El oído nativo reconoce las palabras por su ritmo antes que por sus sonidos." },
    ],
  },
  {
    id: "modales-obligacion",
    title: "must, have to y should: los tres «deber»",
    tag: "Modales",
    goal: "Distinguir obligación, norma externa, consejo y deducción.",
    blocks: [
      {
        t: "p",
        text: "En español «deber» sirve para todo: «debes parar», «debo trabajar», «deberías descansar», «debe de ser tarde». En inglés se reparte en piezas que no se pueden intercambiar, y elegir mal cambia el tono de la frase: puedes sonar mandón sin querer, o quitarle importancia a algo obligatorio.",
      },
      {
        t: "table",
        head: ["Inglés", "Traducción literal", "Ejemplo", "En español"],
        rows: [
          ["must", "debo / tengo que", "I must call my mother.", "Tengo que llamar a mi madre."],
          ["have to", "tengo que", "I have to wear a uniform.", "Tengo que llevar uniforme."],
          ["should", "debería", "You should rest.", "Deberías descansar."],
          ["mustn't", "no debo / no puedo", "You mustn't smoke here.", "No puedes fumar aquí."],
          ["don't have to", "no hace falta que", "You don't have to come.", "No hace falta que vengas."],
          ["shouldn't", "no debería", "You shouldn't eat so late.", "No deberías cenar tan tarde."],
        ],
      },
      {
        t: "tip",
        text: "Fíjate en que «should» y «shouldn't» se traducen con -ÍA (debería, no debería), igual que would y could. Es el mismo mecanismo: el inglés pone una palabra delante y el español cambia la terminación del verbo. Si en español te sale «debería», en inglés es «should» — nunca «must», que sería «debo».",
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
        t: "p",
        text: "«Must» tiene dos usos que no tienen nada que ver entre sí: obligación (lo exiges tú, o lo exige una norma) y deducción (estás casi seguro de algo que no has comprobado). En español son dos construcciones distintas — «debes» y «debe DE» — pero el inglés usa la misma palabra para las dos. El resto de esta lección trata sobre todo el uso de OBLIGACIÓN; aquí tienes las dos una al lado de la otra para que no se te mezclen nunca más.",
      },
      {
        t: "table",
        head: ["Sentido de must", "Se traduce", "Ejemplo"],
        rows: [
          ["obligación (tú lo exiges, o una norma)", "debo / tengo que", "I must call her before 6."],
          ["deducción (casi seguro, sin comprobarlo)", "debe de", "She must be at home, her car is outside."],
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
        text: "Truco: MUST sale de dentro (yo lo veo necesario), HAVE TO viene de fuera (lo manda el jefe, la ley, el horario). Y en negativo cambian de significado del todo, no solo de fuerza: no lo confundas con una simple diferencia de intensidad.",
      },
      {
        t: "tip",
        text: "«Should» no es solo consejo: también sirve para una expectativa razonable, algo que se espera que pase aunque no sea seguro al cien por cien. «The package should arrive tomorrow» no es un consejo al paquete, es «se espera que llegue mañana».",
      },
      {
        t: "examples",
        items: [
          { en: "I must finish this today.", pron: "ai mast fí-nish dis tu-déi", es: "Tengo que terminar esto hoy." },
          { en: "She has to work on Saturdays.", pron: "shi jas tu uérk on sá-ter-deis", es: "Tiene que trabajar los sábados." },
          { en: "You should see a doctor.", pron: "yu shud sii a dók-tor", es: "Deberías ver a un médico." },
          { en: "You mustn't touch that.", pron: "yu má-sent tach dat", es: "No debes tocar eso." },
          { en: "We don't have to hurry.", pron: "ui dóunt jav tu já-ri", es: "No hace falta que nos demos prisa." },
          { en: "She must be around thirty.", pron: "shi mast bi a-ráund zér-ti", es: "Debe de rondar los treinta." },
          { en: "The package should arrive tomorrow.", pron: "de pá-kich shud a-ráiv tu-mó-rou", es: "El paquete debería llegar mañana." },
          { en: "Next year I'll have to pay for my own insurance.", pron: "nekst yier ail jav tu péi for mai óun in-shú-rens", es: "El año que viene tendré que pagar mi propio seguro." },
        ],
      },
      {
        t: "p",
        text: "En pasado, «must» y «have to» se juntan en uno solo: «had to». No existe «musted». Y para el futuro, «will have to» — must no tiene forma propia en ninguno de los dos tiempos.",
      },
    ],
    quiz: [
      { q: "«You ___ wear a helmet. It's the law.»", options: ["should", "must", "might"], answer: 1, why: "Norma fuerte y legal: must." },
      { q: "«It's optional, you ___ come.»", options: ["mustn't", "don't have to", "shouldn't"], answer: 1, why: "No hace falta, pero puedes: don't have to." },
      { q: "«You look ill. You ___ go home.»", options: ["should", "must", "have to"], answer: 0, why: "Es un consejo, no una orden: should." },
      { q: "Pasado de «I must go»:", options: ["I musted go", "I had to go", "I must went"], answer: 1, why: "«Must» no tiene pasado: se usa «had to»." },
      { q: "«You ___ park here, it's forbidden.»", options: ["don't have to", "mustn't", "shouldn't"], answer: 1, why: "Prohibición tajante: mustn't." },
      { q: "«Look at those dark clouds. It ___ rain soon.» (lo deduces del cielo)", options: ["must", "have to", "should"], answer: 0, why: "Deducción con must: «debe de llover»." },
      { q: "«All visitors ___ sign in at reception.» (norma del edificio, no algo que tú exijas)", options: ["must", "have to", "should"], answer: 1, why: "Viene de una norma externa, no de ti: have to." },
      { q: "«She ___ be exhausted after that flight.» (lo deduces)", options: ["has to", "must", "should"], answer: 1, why: "Deducción sobre cómo se sentirá: must, «debe de estar»." },
      { q: "«Debe de haber mucho tráfico» (presente, no pasado) es…", options: ["There must be a lot of traffic.", "There has to be a lot of traffic.", "There should be a lot of traffic."], answer: 0, why: "Deducción en presente: there must be." },
      { q: "«The package ___ arrive tomorrow.» (se espera, sin certeza total)", options: ["must", "should", "have to"], answer: 1, why: "«Should» de expectativa, no de consejo: se espera que pase." },
      { q: "«Next year I ___ pay for my own insurance.» (futuro)", options: ["will must", "will have to", "must"], answer: 1, why: "Must no tiene futuro propio: se usa will have to." },
      { q: "«You don't have to» significa…", options: ["Está prohibido", "No es necesario, pero puedes si quieres", "Es obligatorio"], answer: 1, why: "Libera de la obligación, no prohíbe nada." },
      { q: "El opuesto de MUSTN'T (prohibición) es…", options: ["don't have to", "can", "must"], answer: 0, why: "Mustn't prohíbe; don't have to libera. Es el matiz más caro de esta lección." },
      { q: "«Debería descansar» (con -ía) es…", options: ["I must rest", "I should rest", "I have to rest"], answer: 1, why: "El -ía de «debería» delata a should. «Debo» sería must." },
      { q: "«Debo llamarla» (sin -ía) es…", options: ["I should call her", "I must call her", "I would call her"], answer: 1, why: "Sin -ía es obligación directa: must." },
      { q: "«No deberías cenar tan tarde» es…", options: ["You mustn't eat so late", "You shouldn't eat so late", "You don't have to eat so late"], answer: 1, why: "«No debería» lleva -ía: shouldn't. Mustn't sería prohibirlo." },
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
      { q: "«Su casa» (de ellos) es…", options: ["there house", "their house", "they're house"], answer: 1, why: "«Their» es el posesivo y siempre lleva sustantivo detrás." },
      { q: "«Hay un problema» empieza por…", options: ["There", "Their", "They're"], answer: 0, why: "«There is» = hay. Nada que ver con el posesivo." },
      { q: "Si detrás NO hay sustantivo, seguro que no es…", options: ["there", "their", "they're"], answer: 1, why: "«Their» exige un sustantivo detrás: their car, their idea." },
      { q: "«Están esperando fuera» es…", options: ["There waiting outside", "Their waiting outside", "They're waiting outside"], answer: 2, why: "Equivale a «they are waiting»." },
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
      { q: "¿Cuántas formas del verbo hacen falta para montar todos los tiempos?", options: ["Una","Cinco: base, -s, -ing, pasado y participio","Doce"], answer: 1, why: "De esas cinco piezas sale toda la conjugación inglesa." },
      { q: "El auxiliar de los tiempos continuos es…", options: ["have","be","do"], answer: 1, why: "Be + -ing: am working, was working, will be working." },
      { q: "El auxiliar de los tiempos perfectos es…", options: ["be","have","will"], answer: 1, why: "Have + participio: have finished, had finished, will have finished." },
      { q: "Si juntas los dos (perfecto y continuo) sale…", options: ["have been + -ing","be have + -ing","have being"], answer: 0, why: "I have been working: primero el perfecto, luego el continuo." },
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
      { q: "La familia -ough es difícil porque…", options: ["se pronuncia siempre igual","las mismas cuatro letras suenan de varias maneras","no existe en americano"], answer: 1, why: "Though, through, tough, thought: mismas letras, sonidos distintos." },
      { q: "«Tough» rima con…", options: ["go","stuff","true"], answer: 1, why: "Taf: suena como «stuff»." },
      { q: "«Though» suena…", options: ["dóu","zruu","taf"], answer: 0, why: "Rima con «go»." },
      { q: "¿Cuál es la única salida con esta familia?", options: ["Deducirlas por la escritura","Aprenderse cada palabra por separado","Evitarlas"], answer: 1, why: "No hay regla: la escritura no predice el sonido." },
    ],
  },
  {
    "id": "verbos-estado",
    "title": "Verbos que nunca llevan -ing",
    "tag": "Presente",
    "goal": "Dejar de decir «I am knowing» y «I am wanting».",
    "blocks": [
      {
        "t": "p",
        "text": "El presente continuo sirve para lo que está pasando ahora. Pero hay un grupo de verbos que no describen una acción, sino un estado: saber, querer, gustar, creer. Un estado no está «en curso», simplemente es. Por eso estos verbos casi nunca llevan -ing, aunque en español digamos «estoy queriendo» sin problema."
      },
      {
        "t": "table",
        "head": [
          "Grupo",
          "Verbos",
          "Ejemplo"
        ],
        "rows": [
          [
            "Cabeza",
            "know, think (opinar), believe, remember, forget, understand, mean",
            "I know the answer."
          ],
          [
            "Gustos",
            "like, love, hate, prefer, want, need",
            "I want a coffee."
          ],
          [
            "Sentidos",
            "see, hear, smell, taste, seem, look (parecer)",
            "It smells good."
          ],
          [
            "Tener y ser",
            "be, have (poseer), own, belong, cost",
            "This costs ten dollars."
          ]
        ]
      },
      {
        "t": "error",
        "wrong": "I am knowing the answer.",
        "right": "I know the answer.",
        "why": "«Know» es un estado, no algo que estés haciendo. En español decimos «lo estoy sabiendo»… tampoco, y ahí se ve: es el mismo instinto."
      },
      {
        "t": "tip",
        "text": "Truco: si puedes preguntarte «¿y eso se hace?» y la respuesta es no, el verbo no lleva -ing. Saber no se hace. Correr sí."
      },
      {
        "t": "p",
        "text": "Ojo, algunos cambian de significado con -ing, y ahí sí valen. «I think it's fine» es opinar; «I'm thinking about it» es darle vueltas ahora. «I have a car» es poseer; «I'm having lunch» es comer."
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "I don't understand this.",
            "pron": "ai dount an-ders-tand dis",
            "es": "No entiendo esto."
          },
          {
            "en": "She has two brothers.",
            "pron": "shi jas tu brá-ders",
            "es": "Tiene dos hermanos."
          },
          {
            "en": "I'm having dinner right now.",
            "pron": "aim já-ving dí-ner ráit náu",
            "es": "Estoy cenando ahora mismo."
          }
        ]
      }
    ],
    "quiz": [
      {
        "q": "«Quiero un café» es…",
        "options": [
          "I am wanting a coffee",
          "I want a coffee",
          "I wanting a coffee"
        ],
        "answer": 1,
        "why": "«Want» es un estado: nunca lleva -ing."
      },
      {
        "q": "¿Cuál está bien?",
        "options": [
          "I am knowing him",
          "I know him",
          "I knowing him"
        ],
        "answer": 1,
        "why": "Saber es un estado, no una acción en curso."
      },
      {
        "q": "«I'm having lunch» significa…",
        "options": [
          "Tengo comida",
          "Estoy comiendo",
          "Es incorrecto"
        ],
        "answer": 1,
        "why": "«Have» con -ing cambia de sentido: pasa de poseer a tomar."
      },
      {
        "q": "¿Cuál SÍ admite -ing normalmente?",
        "options": [
          "belong",
          "run",
          "cost"
        ],
        "answer": 1,
        "why": "Correr es una acción; pertenecer y costar son estados."
      },
      {
        "q": "«Esto huele bien» es…",
        "options": [
          "This is smelling good",
          "This smells good",
          "This smell good"
        ],
        "answer": 1,
        "why": "Los sentidos van en presente simple: smells."
      },
      { q: "«Quiero un café» es…", options: ["I am wanting a coffee", "I want a coffee", "I do want a coffee"], answer: 1, why: "«Want» es de estado: nunca va en continuo." },
      { q: "¿Por qué a un español le sale «I am wanting»?", options: ["Porque en español decimos «estoy queriendo»", "Porque el continuo suena más educado", "Porque copia el orden del francés"], answer: 0, why: "En español sí se puede decir; en inglés los verbos de estado lo prohíben." },
      { q: "¿Cuál NO puede ir en continuo?", options: ["work", "know", "run"], answer: 1, why: "«Know» describe un estado mental, no una acción." },
      { q: "«I'm thinking about it» está bien porque…", options: ["think siempre admite continuo", "aquí «think» es una acción (darle vueltas), no una opinión", "es una excepción sin regla"], answer: 1, why: "«I think it's good» (opinión, estado) frente a «I'm thinking» (proceso, acción)." }
    ]
  },
  {
    "id": "preguntas-indirectas",
    "title": "Preguntas dentro de otra frase",
    "tag": "Estructuras",
    "goal": "Dejar de invertir el verbo cuando la pregunta va dentro de otra.",
    "blocks": [
      {
        "t": "p",
        "text": "Una pregunta normal invierte el verbo: «Where IS the bank?». Pero cuando esa pregunta va metida dentro de otra frase, el orden vuelve a ser el de una frase normal: sujeto y luego verbo. Es lo contrario de lo que pide el instinto."
      },
      {
        "t": "formula",
        "parts": ["Do you know","where the bank IS"],
      "example": "Do you know where the bank is?"
      },
      {
        "t": "table",
        "head": [
          "Pregunta suelta",
          "Dentro de otra frase"
        ],
        "rows": [
          [
            "Where is the station?",
            "Do you know where the station is?"
          ],
          [
            "What time does it open?",
            "Can you tell me what time it opens?"
          ],
          [
            "Why did she leave?",
            "I don't know why she left."
          ],
          [
            "Is he coming?",
            "I wonder if he is coming."
          ]
        ]
      },
      {
        "t": "error",
        "wrong": "Do you know where is the bank?",
        "right": "Do you know where the bank is?",
        "why": "La inversión ya la ha hecho el «Do you know». Dentro, la pregunta se comporta como una frase normal: the bank is."
      },
      {
        "t": "tip",
        "text": "Y desaparecen el do/does/did: «What time does it open?» pero «Tell me what time it opens». Si ves un do dentro, sobra."
      },
      {
        "t": "p",
        "text": "Para preguntas de sí o no, dentro se usa «if» o «whether»: «Is it open?» pasa a «Do you know if it's open?»."
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "Could you tell me where the exit is?",
            "pron": "kud yu tel mi uer di ék-sit is",
            "es": "¿Me puede decir dónde está la salida?"
          },
          {
            "en": "I don't know what he wants.",
            "pron": "ai dount nóu uót ji uónts",
            "es": "No sé qué quiere."
          },
          {
            "en": "Do you know if the store is open?",
            "pron": "du yu nóu if de stor is óu-pen",
            "es": "¿Sabes si la tienda está abierta?"
          }
        ]
      }
    ],
    "quiz": [
      {
        "q": "¿Cuál está bien?",
        "options": [
          "Do you know where is it?",
          "Do you know where it is?",
          "Do you know where is?"
        ],
        "answer": 1,
        "why": "Dentro de otra frase, sujeto antes que verbo: where it is."
      },
      {
        "q": "«No sé qué hora es» es…",
        "options": [
          "I don't know what time is it",
          "I don't know what time it is",
          "I don't know what time is"
        ],
        "answer": 1,
        "why": "Sin inversión: what time it is."
      },
      {
        "q": "«Is it open?» dentro de otra frase pide…",
        "options": [
          "that",
          "if",
          "what"
        ],
        "answer": 1,
        "why": "Las preguntas de sí o no llevan if (o whether)."
      },
      {
        "q": "¿Qué le sobra a «Tell me where does he live»?",
        "options": [
          "el where",
          "el does",
          "el me"
        ],
        "answer": 1,
        "why": "El auxiliar do/does/did desaparece dentro: where he lives."
      },
      {
        "q": "«Can you tell me what time it ___?»",
        "options": [
          "opens",
          "does open",
          "is open"
        ],
        "answer": 0,
        "why": "Frase normal: sujeto (it) y verbo conjugado (opens)."
      },
      { q: "En una pregunta indirecta, el orden vuelve a ser…", options: ["auxiliar + sujeto + verbo","sujeto + verbo, como una frase normal","verbo + sujeto"], answer: 1, why: "«Do you know where the bank IS», no «where is the bank»." },
      { q: "«¿Sabes dónde está el banco?» es…", options: ["Do you know where is the bank?","Do you know where the bank is?","Do you know where the bank?"], answer: 1, why: "Dentro de otra frase no se invierte." },
      { q: "¿Por qué se falla tanto?", options: ["Porque en español también se invierte y lo arrastramos","Porque es una excepción rara","Porque cambia según el país"], answer: 0, why: "Decimos «¿sabes dónde está el banco?» con el verbo delante y lo copiamos." },
      { q: "En preguntas indirectas de sí/no se usa…", options: ["that","if / whether","what"], answer: 1, why: "«I wonder if he's coming»." },
    ]
  },
  {
    id: "modales-pasado",
    title: "must have, should have, could have",
    tag: "Modales",
    goal: "Hablar de lo que pudo, debió o debería haber pasado.",
    blocks: [
      {
        t: "p",
        text: "Los modales no tienen pasado propio: para hablar del pasado se les añade «have + participio». La fórmula es siempre la misma y solo cambia el modal de delante, que es el que pone el significado.",
      },
      {
        t: "formula",
        parts: ["modal", "have", "participio"],
        example: "You should have called me.",
      },
      {
        t: "p",
        text: "La traducción literal es más mecánica de lo que parece: «have + participio» equivale siempre al «haber + participio» del español. Lo único que cambia es el modal de delante, que se traduce igual que en presente pero arrastrando el -ía. Should have = deber-ÍA haber. Could have = podr-ÍA haber. Would have = habr-ÍA. Si te sabes el modal suelto, esta lección es solo añadirle «haber».",
      },
      {
        t: "table",
        head: ["Inglés", "Se traduce", "Ejemplo", "En español"],
        rows: [
          ["should have", "debería haber", "You should have called.", "Deberías haber llamado."],
          ["could have", "podría haber", "You could have called.", "Podrías haber llamado."],
          ["would have", "habría", "I would have called.", "Habría llamado."],
          ["must have", "debe de haber", "She must have called.", "Debe de haber llamado."],
          ["might have", "puede que haya", "She might have called.", "Puede que haya llamado."],
          ["can't have", "no puede haber", "She can't have called.", "No puede haber llamado."],
        ],
      },
      {
        t: "table",
        head: ["Fórmula", "Qué dice", "Español"],
        rows: [
          ["must have", "deducción: estoy seguro de que pasó", "debe de haber…"],
          ["can't have", "deducción negativa: es imposible", "no puede haber…"],
          ["might / may have", "posibilidad: quizá pasó", "puede que haya…"],
          ["should have", "reproche: lo correcto era hacerlo y no se hizo", "debería haber…"],
          ["shouldn't have", "reproche al revés: lo hiciste y no debías", "no debería haber…"],
          ["could have", "era posible y no pasó (o reproche por no ayudar)", "podría haber…"],
        ],
      },
      {
        t: "error",
        wrong: "I should call you yesterday.",
        right: "I should have called you yesterday.",
        why: "Sin «have + participio» estás hablando del presente. El reproche por algo no hecho necesita la fórmula entera.",
      },
      {
        t: "error",
        wrong: "You should have go.",
        right: "You should have gone.",
        why: "Detrás de «have» siempre va el participio, nunca el verbo base: have + gone, no have + go.",
      },
      {
        t: "tip",
        text: "Al hablar se contraen y suenan casi igual: «should have» se dice «shoulda», «could have» «coulda», «must have» «musta». Por eso mucha gente lo escribe mal como «should of», que no existe.",
      },
      {
        t: "p",
        text: "«Could have» tiene dos aires distintos y el contexto es lo único que los separa: posibilidad que no se cumplió («podría haber pasado, pero no pasó») y reproche cuando alguien tenía la opción de ayudar y no lo hizo («¡podrías haberme avisado!»). La gramática es idéntica en los dos casos.",
      },
      {
        t: "examples",
        items: [
          { en: "She must have forgotten.", pron: "shi mast jav for-gó-ten", es: "Se le debe de haber olvidado." },
          { en: "You should have told me.", pron: "yu shud jav tóuld mi", es: "Deberías habérmelo dicho." },
          { en: "He can't have finished already.", pron: "ji kant jav fí-nisht ol-ré-di", es: "No puede haber terminado ya." },
          { en: "You shouldn't have shouted at him.", pron: "yu shú-dent jav sháu-ted at jim", es: "No deberías haberle gritado." },
          { en: "You could have told me!", pron: "yu kud jav tóuld mi", es: "¡Podrías haberme avisado!" },
          { en: "They could have won, but they didn't try hard enough.", pron: "déi kud jav uan, bat déi dí-dent trái jard i-náf", es: "Podrían haber ganado, pero no se esforzaron lo suficiente." },
          { en: "She might have left already.", pron: "shi máit jav left ol-ré-di", es: "Puede que ya se haya ido." },
        ],
      },
    ],
    quiz: [
      { q: "«Deberías haber venido» es…", options: ["You should come", "You should have come", "You should came"], answer: 1, why: "Reproche por el pasado: should + have + participio." },
      { q: "«Se le debe de haber olvidado» es…", options: ["She must forget", "She must have forgotten", "She must forgot"], answer: 1, why: "Deducción sobre el pasado: must have + participio." },
      { q: "«No puede haberlo hecho» es…", options: ["He mustn't have done it", "He can't have done it", "He couldn't do it"], answer: 1, why: "La deducción negativa es can't have, no mustn't have." },
      { q: "Detrás del modal siempre va…", options: ["had", "have", "has"], answer: 1, why: "Siempre «have», sin conjugar: he must have, no he must has." },
      { q: "«Should of» es…", options: ["Correcto en informal", "Un error de escritura de should have", "Otro significado"], answer: 1, why: "No existe. Sale de que «should have» suena «shoulda»." },
      { q: "«No deberías haber gritado» es…", options: ["You shouldn't shout", "You shouldn't have shouted", "You didn't should shout"], answer: 1, why: "Reproche al revés: lo hiciste y no debías, con la fórmula entera." },
      { q: "«¡Podrías haberme avisado!» (reproche) es…", options: ["You could tell me!", "You could have told me!", "You should telling me!"], answer: 1, why: "Reproche por algo que era posible y no hiciste: could have." },
      { q: "Detrás de «should have» va…", options: ["el verbo base", "el gerundio", "el participio"], answer: 2, why: "Should have + participio, nunca base ni -ing: should have gone, no should have go." },
      { q: "«Puede que ya haya salido» (posibilidad, no certeza) es…", options: ["She must have left", "She might have left", "She should have left"], answer: 1, why: "«Might have» es posibilidad; «must have» sería casi seguro." },
      { q: "«Musta» al hablar es la forma corta de…", options: ["might have", "must have", "mustn't have"], answer: 1, why: "Must have se contrae y suena «musta»." },
      { q: "«They could have won, but they didn't try hard enough.» ¿Ganaron?", options: ["Sí, ganaron", "No, no ganaron", "No lo dice"], answer: 1, why: "«Could have» describe algo que era posible y NO llegó a pasar." },
      { q: "El opuesto de «must have» (deducción positiva) es…", options: ["mustn't have", "can't have", "shouldn't have"], answer: 1, why: "La deducción negativa segura es can't have, no mustn't have." },
      { q: "«Habría llamado, pero no tenía tu número» empieza por…", options: ["I should have called", "I would have called", "I must have called"], answer: 1, why: "«Habría» es el condicional de haber: would have." },
      { q: "En «should have», el «have» corresponde en español a…", options: ["tener", "haber", "no se traduce"], answer: 1, why: "have + participio = haber + participio: debería HABER llamado." },
      { q: "«Podrías haber avisado» es…", options: ["You could have told me", "You should have told me", "You would have told me"], answer: 0, why: "Podr-ía haber = could have." },
    ],
  },
  {
    id: "can-be-able",
    title: "can, could y be able to",
    tag: "Modales",
    goal: "Decir «poder» en cualquier tiempo, no solo en presente.",
    blocks: [
      {
        t: "p",
        text: "«Can» solo existe en presente y pasado (could). No tiene infinitivo ni participio, así que para el futuro, el perfecto o después de otro verbo hay que cambiar a «be able to», que sí se conjuga entero.",
      },
      {
        t: "p",
        text: "Antes del cuándo, el QUÉ significa. «Can» tiene dos traducciones en español y elegir mal se nota: cuando hablas de algo que aprendiste (nadar, conducir, un idioma) el español dice SÉ, no «puedo». «I can swim» es «sé nadar»; «I can drive» es «sé conducir». «Puedo nadar» en español significa otra cosa: que ahora mismo tengo permiso o las condiciones para hacerlo. El inglés no distingue las dos, así que usa «can» para ambas y eres tú quien decide la traducción.",
      },
      {
        t: "table",
        head: ["Inglés", "Traducción literal", "Cuándo se usa esa"],
        rows: [
          ["I can swim.", "Sé nadar.", "Habilidad aprendida, la tienes siempre."],
          ["I can swim today.", "Puedo nadar hoy.", "Circunstancia: hoy sí, las condiciones lo permiten."],
          ["I can speak French.", "Sé hablar francés.", "Habilidad aprendida."],
          ["Can I use your phone?", "¿Puedo usar tu teléfono?", "Permiso: aquí nunca es «sé»."],
        ],
      },
      {
        t: "tip",
        text: "Regla rápida: si en español dirías «sé + verbo», en inglés es «can». El error del hispanohablante va al revés — traducir «sé nadar» como «I know to swim», que no existe. «Know» es saber INFORMACIÓN (I know the answer), no saber HACER algo. Para saber hacer algo siempre es «can».",
      },
      {
        t: "error",
        wrong: "I know to swim. / I know swim.",
        right: "I can swim.",
        why: "«Saber hacer algo» es «can», no «know». «Know» solo vale para saber datos: I know the answer, I know your name.",
      },
      {
        t: "table",
        head: ["Cuándo", "Se dice", "Ejemplo"],
        rows: [
          ["Presente", "can", "I can swim."],
          ["Pasado (habilidad)", "could", "I could swim at five."],
          ["Pasado (una vez concreta)", "was able to / managed to", "I was able to fix it."],
          ["Futuro", "will be able to", "I'll be able to help tomorrow."],
          ["Perfecto", "have been able to", "I haven't been able to sleep."],
          ["Tras otro verbo", "to be able to", "I want to be able to travel."],
        ],
      },
      {
        t: "p",
        text: "«Managed to» y «was able to» no son intercambiables al cien por cien: «managed to» añade la idea de que costó, de que hubo un obstáculo que superaste. «I managed to fix it» suena a «lo conseguí, a pesar de todo»; «I was able to fix it» solo informa de que pudiste, sin dramatismo.",
      },
      {
        t: "error",
        wrong: "I will can help you.",
        right: "I will be able to help you.",
        why: "Dos modales seguidos no se pueden. Como «can» no tiene infinitivo, el futuro pide be able to.",
      },
      {
        t: "tip",
        text: "Ojo con «could» en pasado: sirve para una habilidad general (I could run for hours) pero NO para un logro puntual. «Ayer conseguí abrirlo» es «I was able to open it», no «I could open it». En negativo esta regla se relaja: «I couldn't open it» sí vale para una vez concreta.",
      },
      {
        t: "table",
        head: ["Negativo de can", "Cuándo", "Ejemplo"],
        rows: [
          ["can't", "presente", "I can't swim today, I'm injured."],
          ["couldn't", "pasado, general o puntual", "I couldn't sleep last night."],
          ["wasn't able to / didn't manage to", "pasado, alternativa a couldn't", "She wasn't able to finish in time."],
          ["won't be able to", "futuro", "I won't be able to come tomorrow."],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "I won't be able to come.", pron: "ai uóunt bi éi-bol tu kam", es: "No voy a poder venir." },
          { en: "She was able to finish on time.", pron: "shi uós éi-bol tu fí-nish on táim", es: "Consiguió terminar a tiempo." },
          { en: "I'd like to be able to read this.", pron: "aid láik tu bi éi-bol tu riid dis", es: "Me gustaría poder leer esto." },
          { en: "I managed to pass the exam.", pron: "ai má-nichd tu pas di ig-sám", es: "Conseguí aprobar el examen." },
          { en: "She wasn't able to open the door.", pron: "shi uó-sent éi-bol tu óu-pen de dor", es: "No consiguió abrir la puerta." },
          { en: "I won't be able to swim as fast as before.", pron: "ai uóunt bi éi-bol tu suim as fast as bi-fór", es: "No podré nadar tan rápido como antes." },
          { en: "Can I use your phone?", pron: "kan ai iúus yor fóun", es: "¿Puedo usar tu teléfono?" },
        ],
      },
    ],
    quiz: [
      { q: "«Podré ayudarte mañana» es…", options: ["I will can help you", "I will be able to help you", "I can help you tomorrow"], answer: 1, why: "Dos modales seguidos no se pueden: el futuro de can es will be able to." },
      { q: "«Conseguí arreglarlo» (una vez) es…", options: ["I could fix it", "I was able to fix it", "I can fix it"], answer: 1, why: "Could vale para habilidad general; un logro puntual pide was able to." },
      { q: "«Quiero poder viajar» es…", options: ["I want to can travel", "I want to be able to travel", "I want can travel"], answer: 1, why: "Detrás de «to» hace falta un infinitivo, y can no lo tiene." },
      { q: "«No he podido dormir» es…", options: ["I haven't could sleep", "I haven't been able to sleep", "I couldn't sleep"], answer: 1, why: "En perfecto, can pasa a been able to." },
      { q: "«De pequeño sabía nadar» es…", options: ["I could swim", "I was able to swim once", "I can swim then"], answer: 0, why: "Habilidad general en el pasado: could." },
      { q: "«Managed to» frente a «was able to» añade la idea de…", options: ["que costó esfuerzo", "que fue fácil", "ninguna diferencia"], answer: 0, why: "Managed to sugiere que había un obstáculo y lo superaste." },
      { q: "Negativo de «could» en pasado, para habilidad general:", options: ["wasn't able to", "couldn't", "didn't can"], answer: 1, why: "En negativo, «couldn't» sí funciona tanto para lo general como para lo puntual." },
      { q: "«No pudo abrir la puerta» (una vez, no general) suena natural como…", options: ["She couldn't open the door", "She can't opened the door", "She not could open"], answer: 0, why: "En negativo, a diferencia del afirmativo, «couldn't» también vale para un caso puntual." },
      { q: "Futuro negativo de can:", options: ["won't can", "won't be able to", "don't will can"], answer: 1, why: "El futuro de can, en negativo, sigue siendo be able to: won't be able to." },
      { q: "«Podré nadar mejor cuando practique más» (futuro) es…", options: ["I'll can swim better", "I'll be able to swim better", "I can swim better then"], answer: 1, why: "Can no tiene futuro propio: se usa will be able to." },
      { q: "¿Cuál suena más neutro, sin remarcar el esfuerzo?", options: ["I managed to pass the exam", "I was able to pass the exam", "las dos remarcan el esfuerzo igual"], answer: 1, why: "«Was able to» informa sin dramatismo; «managed to» sugiere que costó." },
      { q: "¿Cuál de estas usa «can» para PERMISO, no para habilidad?", options: ["Can I use your phone?", "I can speak French", "She can run fast"], answer: 0, why: "Aquí «can» pide permiso; en las otras dos describe una capacidad." },
      { q: "«Sé nadar» es…", options: ["I know to swim", "I can swim", "I know swim"], answer: 1, why: "Saber HACER algo es «can». «Know» es saber información, no habilidades." },
      { q: "«I can speak French» se traduce mejor como…", options: ["Puedo hablar francés", "Sé hablar francés", "Hablaría francés"], answer: 1, why: "Es una habilidad aprendida: en español eso es «sé», no «puedo»." },
      { q: "«I know the answer» usa «know» porque…", options: ["es una habilidad aprendida", "es información, un dato que conoces", "es lo mismo que can"], answer: 1, why: "Know sirve para datos; para saber hacer algo se usa can." },
      { q: "«Could» se traduce con -ía porque…", options: ["es el condicional de can: podría", "es un pasado normal", "no tiene traducción"], answer: 0, why: "Could es a can lo que «podría» es a «puedo»: mismo mecanismo del -ía." },
    ],
  },
  {
    "id": "futuro-avanzado",
    "title": "Futuro perfecto y futuro continuo",
    "tag": "Futuro",
    "goal": "Decir «lo habré terminado» y «estaré trabajando».",
    "blocks": [
      {
        "t": "p",
        "text": "Además del futuro normal hay dos más, y los dos se montan igual que en español: uno para lo que estará en marcha en un momento futuro, y otro para lo que ya estará terminado antes de ese momento."
      },
      {
        "t": "formula",
        "parts": ["will have","participio"],
      "example": "By Friday I will have finished."
      },
      {
        "t": "table",
        "head": [
          "Fórmula",
          "Cuándo",
          "Ejemplo"
        ],
        "rows": [
          [
            "will be + -ing",
            "en marcha en ese momento",
            "At 8 I'll be driving."
          ],
          [
            "will have + participio",
            "terminado antes de ese momento",
            "By Friday I'll have finished."
          ],
          [
            "will have been + -ing",
            "duración hasta ese momento",
            "By June I'll have been working here a year."
          ]
        ]
      },
      {
        "t": "tip",
        "text": "La palabra clave del futuro perfecto es «by»: by tomorrow, by Friday, by the time you arrive. Si ves «by» + momento futuro, casi seguro pide will have."
      },
      {
        "t": "error",
        "wrong": "By Friday I will finish it.",
        "right": "By Friday I will have finished it.",
        "why": "«By Friday» marca un límite: para entonces ya estará hecho. El futuro simple diría solo que lo harás el viernes."
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "This time tomorrow I'll be flying.",
            "pron": "dis táim tu-mó-rou ail bi fláiing",
            "es": "Mañana a esta hora estaré volando."
          },
          {
            "en": "By then we'll have moved.",
            "pron": "bái den uil jav muuvd",
            "es": "Para entonces ya nos habremos mudado."
          },
          {
            "en": "Don't call at nine, I'll be sleeping.",
            "pron": "dount kol at náin, ail bi slíi-ping",
            "es": "No llames a las nueve, estaré durmiendo."
          }
        ]
      }
    ],
    "quiz": [
      {
        "q": "«Para el viernes lo habré terminado» es…",
        "options": [
          "By Friday I'll finish it",
          "By Friday I'll have finished it",
          "By Friday I'm finishing it"
        ],
        "answer": 1,
        "why": "«By» + futuro pide will have + participio."
      },
      {
        "q": "«A las ocho estaré conduciendo» es…",
        "options": [
          "At 8 I'll drive",
          "At 8 I'll be driving",
          "At 8 I drive"
        ],
        "answer": 1,
        "why": "En marcha en ese momento: will be + -ing."
      },
      {
        "q": "Detrás de «will have» va…",
        "options": [
          "el infinitivo",
          "el participio",
          "-ing"
        ],
        "answer": 1,
        "why": "will have + participio: will have finished."
      },
      {
        "q": "La palabra que anuncia el futuro perfecto es…",
        "options": [
          "by",
          "at",
          "in"
        ],
        "answer": 0,
        "why": "«By Friday», «by then»: marca el límite antes del cual estará hecho."
      },
      {
        "q": "«Llevaré un año trabajando aquí» es…",
        "options": [
          "I'll work here a year",
          "I'll have been working here a year",
          "I'm working here a year"
        ],
        "answer": 1,
        "why": "Duración hasta un punto futuro: will have been + -ing."
      },
      { q: "«will have + participio» equivale a…", options: ["habré terminado","estaré terminando","terminaría"], answer: 0, why: "Futuro perfecto: para el viernes habré terminado." },
      { q: "«will be + -ing» equivale a…", options: ["habré trabajado","estaré trabajando","trabajaría"], answer: 1, why: "Futuro continuo: mañana a las diez estaré trabajando." },
      { q: "«Para el viernes habré acabado» es…", options: ["By Friday I will finish","By Friday I will have finished","By Friday I am finishing"], answer: 1, why: "Acción terminada ANTES de un momento futuro: will have + participio." },
      { q: "«A esta hora mañana estaré volando» es…", options: ["This time tomorrow I will fly","This time tomorrow I will be flying","This time tomorrow I fly"], answer: 1, why: "En marcha en un momento concreto del futuro: will be + -ing." },
    ]
  },
  {
    "id": "pronombres-completo",
    "title": "I, me, my, mine, myself",
    "tag": "Palabras",
    "goal": "Elegir la forma correcta del pronombre sin dudar.",
    "blocks": [
      {
        "t": "p",
        "text": "El español reparte esto entre yo, me, mi, mío y mí mismo, y el inglés hace lo mismo pero con reglas más rígidas: cada columna tiene su sitio en la frase y no se pueden mezclar."
      },
      {
        "t": "table",
        "head": [
          "Sujeto",
          "Objeto",
          "Posesivo",
          "Solo",
          "Reflexivo"
        ],
        "rows": [
          [
            "I",
            "me",
            "my",
            "mine",
            "myself"
          ],
          [
            "you",
            "you",
            "your",
            "yours",
            "yourself"
          ],
          [
            "he",
            "him",
            "his",
            "his",
            "himself"
          ],
          [
            "she",
            "her",
            "her",
            "hers",
            "herself"
          ],
          [
            "it",
            "it",
            "its",
            "—",
            "itself"
          ],
          [
            "we",
            "us",
            "our",
            "ours",
            "ourselves"
          ],
          [
            "they",
            "them",
            "their",
            "theirs",
            "themselves"
          ]
        ]
      },
      {
        "t": "p",
        "text": "El posesivo va SIEMPRE pegado a un sustantivo (my car). La forma «sola» va sin él (that car is mine). Y el reflexivo es cuando el sujeto y el objeto son la misma persona (I hurt myself)."
      },
      {
        "t": "error",
        "wrong": "This book is my.",
        "right": "This book is mine.",
        "why": "Sin sustantivo detrás hay que usar la forma sola: mine, yours, hers. «My» siempre necesita algo a lo que acompañar."
      },
      {
        "t": "tip",
        "text": "Ojo con its y it's: «its» es el posesivo (the dog and its bone) y «it's» es «it is». El apóstrofo aquí NO es de posesión."
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "She told me it was hers.",
            "pron": "shi tóuld mi it uós jers",
            "es": "Me dijo que era suyo."
          },
          {
            "en": "We did it ourselves.",
            "pron": "ui did it au-ar-sélvs",
            "es": "Lo hicimos nosotros mismos."
          },
          {
            "en": "Their house is bigger than ours.",
            "pron": "der jáus is bí-guer dan áu-ars",
            "es": "Su casa es más grande que la nuestra."
          }
        ]
      }
    ],
    "quiz": [
      {
        "q": "«Este libro es mío» es…",
        "options": [
          "This book is my",
          "This book is mine",
          "This book is me"
        ],
        "answer": 1,
        "why": "Sin sustantivo detrás: mine."
      },
      {
        "q": "«Me lo dio a mí» es…",
        "options": [
          "He gave it to I",
          "He gave it to me",
          "He gave it to my"
        ],
        "answer": 1,
        "why": "Detrás de preposición va la forma de objeto: me."
      },
      {
        "q": "«Su casa» (de ella) es…",
        "options": [
          "hers house",
          "her house",
          "she house"
        ],
        "answer": 1,
        "why": "Delante de sustantivo va el posesivo: her."
      },
      {
        "q": "«Me corté» es…",
        "options": [
          "I cut me",
          "I cut myself",
          "I cut mine"
        ],
        "answer": 1,
        "why": "Sujeto y objeto son la misma persona: reflexivo."
      },
      {
        "q": "«its» es…",
        "options": [
          "it is",
          "el posesivo de it",
          "un error"
        ],
        "answer": 1,
        "why": "«it's» es it is; «its» sin apóstrofo es el posesivo."
      },
      { q: "«Mi coche» y «el mío» son en inglés…", options: ["los dos «my»", "my car / mine", "los dos «mine»"], answer: 1, why: "«My» siempre lleva sustantivo detrás; «mine» va solo." },
      { q: "«Es mío» es…", options: ["It's my", "It's mine", "It's me"], answer: 1, why: "Sin sustantivo detrás se usa la forma larga: mine." },
      { q: "«Me lo dio a mí» — ¿qué forma va detrás del verbo?", options: ["I", "me", "my"], answer: 1, why: "Detrás del verbo o de una preposición va la forma objeto: me, him, her, us, them." },
      { q: "«Lo hice yo mismo» es…", options: ["I did it me", "I did it myself", "I did it my"], answer: 1, why: "Los reflexivos acaban en -self / -selves: myself, yourself, themselves." }
    ]
  },
  {
    "id": "still-yet-already",
    "title": "still, yet y already",
    "tag": "Palabras",
    "goal": "Los tres se traducen «ya» o «todavía» y no son intercambiables.",
    "blocks": [
      {
        "t": "p",
        "text": "Los tres hablan de si algo ha pasado ya o sigue pasando, y los tres caen en «ya» o «todavía» en español. Lo que los separa es la actitud: si esperabas que hubiera terminado, si te sorprende que no, o si te sorprende que sí."
      },
      {
        "t": "table",
        "head": [
          "Palabra",
          "Significa",
          "Dónde va",
          "Ejemplo"
        ],
        "rows": [
          [
            "still",
            "todavía (sigue pasando)",
            "antes del verbo",
            "I still live here."
          ],
          [
            "yet",
            "todavía no / ya (en preguntas)",
            "al final",
            "Have you finished yet?"
          ],
          [
            "already",
            "ya (antes de lo esperado)",
            "antes del verbo o al final",
            "I've already eaten."
          ]
        ]
      },
      {
        "t": "error",
        "wrong": "I haven't finished already.",
        "right": "I haven't finished yet.",
        "why": "En negativa se usa «yet», al final. «Already» es para afirmar que algo pasó, y encima antes de lo previsto."
      },
      {
        "t": "tip",
        "text": "Regla rápida: yet va al final y solo en preguntas y negativas. Already y still van en medio y en frases afirmativas. Si dudas, mira si la frase lleva not o interrogación."
      },
      {
        "t": "p",
        "text": "«Still» en negativa expresa impaciencia: «He still hasn't called» suena a «sigue sin llamar, y ya vale». Con yet sería neutro: «He hasn't called yet»."
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "Are you still working here?",
            "pron": "ar yu stil uér-king jí-er",
            "es": "¿Sigues trabajando aquí?"
          },
          {
            "en": "I haven't seen it yet.",
            "pron": "ai já-vent siin it yet",
            "es": "Todavía no lo he visto."
          },
          {
            "en": "She has already left.",
            "pron": "shi jas ol-ré-di left",
            "es": "Ya se ha ido."
          }
        ]
      }
    ],
    "quiz": [
      {
        "q": "«Todavía no he comido» es…",
        "options": [
          "I haven't eaten still",
          "I haven't eaten yet",
          "I haven't eaten already"
        ],
        "answer": 1,
        "why": "Negativa: yet, y al final."
      },
      {
        "q": "«Sigo viviendo aquí» es…",
        "options": [
          "I still live here",
          "I yet live here",
          "I already live here"
        ],
        "answer": 0,
        "why": "Algo que continúa: still, antes del verbo."
      },
      {
        "q": "«Ya he terminado» es…",
        "options": [
          "I've finished yet",
          "I've already finished",
          "I've still finished"
        ],
        "answer": 1,
        "why": "Afirmar que ya pasó: already."
      },
      {
        "q": "«Yet» va normalmente…",
        "options": [
          "al principio",
          "al final",
          "antes del verbo"
        ],
        "answer": 1,
        "why": "Al final de la frase: Have you finished yet?"
      },
      {
        "q": "«He still hasn't called» transmite…",
        "options": [
          "Neutralidad",
          "Impaciencia",
          "Alegría"
        ],
        "answer": 1,
        "why": "Still en negativa añade el matiz de «y ya está tardando»."
      },
      { q: "«Todavía» (sigue pasando) es…", options: ["still", "yet", "already"], answer: 0, why: "«I still live here» = todavía vivo aquí." },
      { q: "«¿Ya has terminado?» es…", options: ["Have you already finished?", "Have you finished yet?", "Have you still finished?"], answer: 1, why: "En preguntas, «ya» es «yet» y va al final." },
      { q: "«Ya he comido» (antes de lo esperado) es…", options: ["I have eaten yet", "I have already eaten", "I still have eaten"], answer: 1, why: "En afirmativa, «ya» es «already»." },
      { q: "¿Dónde va «yet» en la frase?", options: ["Al principio", "Al final", "Entre el auxiliar y el verbo"], answer: 1, why: "«Yet» va siempre al final, en negativas y preguntas." }
    ]
  },
  {
    "id": "adverbios-frecuencia",
    "title": "Dónde van always, never y usually",
    "tag": "Palabras",
    "goal": "Colocar los adverbios de frecuencia en su sitio exacto.",
    "blocks": [
      {
        "t": "p",
        "text": "En español el adverbio se mueve casi libre: «siempre llego tarde», «llego siempre tarde», «llego tarde siempre». En inglés tiene un sitio fijo, y ponerlo mal se nota mucho."
      },
      {
        "t": "formula",
        "parts": ["sujeto","adverbio","verbo"],
      "example": "I always arrive late."
      },
      {
        "t": "table",
        "head": [
          "Adverbio",
          "Cuánto",
          "Ejemplo"
        ],
        "rows": [
          [
            "always",
            "100%",
            "She always works late."
          ],
          [
            "usually / normally",
            "80%",
            "I usually walk."
          ],
          [
            "often",
            "60%",
            "We often meet here."
          ],
          [
            "sometimes",
            "40%",
            "He sometimes calls."
          ],
          [
            "rarely / seldom",
            "10%",
            "They rarely go out."
          ],
          [
            "never",
            "0%",
            "I never smoke."
          ]
        ]
      },
      {
        "t": "error",
        "wrong": "I go always to the gym.",
        "right": "I always go to the gym.",
        "why": "Va DELANTE del verbo normal. Detrás suena a traducción del español."
      },
      {
        "t": "tip",
        "text": "La excepción es el verbo «be»: ahí el adverbio va DETRÁS. «I am always tired», no «I always am tired». Y con auxiliares, en medio: «I have never been there»."
      },
      {
        "t": "p",
        "text": "«Sometimes» y «usually» son los únicos que también pueden ir al principio de la frase para dar énfasis: «Sometimes I work from home». Con «always» y «never» eso no se hace."
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "I never eat breakfast.",
            "pron": "ai né-ver iit brék-fast",
            "es": "Nunca desayuno."
          },
          {
            "en": "He is always late.",
            "pron": "ji is ól-uis léit",
            "es": "Siempre llega tarde."
          },
          {
            "en": "We have never been to Japan.",
            "pron": "ui jav né-ver bin tu ya-pán",
            "es": "Nunca hemos estado en Japón."
          }
        ]
      }
    ],
    "quiz": [
      {
        "q": "«Siempre voy al gimnasio» es…",
        "options": [
          "I go always to the gym",
          "I always go to the gym",
          "Always I go to the gym"
        ],
        "answer": 1,
        "why": "Delante del verbo normal."
      },
      {
        "q": "Con el verbo «be», el adverbio va…",
        "options": [
          "delante",
          "detrás",
          "al final"
        ],
        "answer": 1,
        "why": "I am always tired, no I always am tired."
      },
      {
        "q": "«Nunca he estado allí» es…",
        "options": [
          "I never have been there",
          "I have never been there",
          "I have been never there"
        ],
        "answer": 1,
        "why": "Con auxiliar, el adverbio va en medio: have never been."
      },
      {
        "q": "¿Cuál puede ir al principio de la frase?",
        "options": [
          "always",
          "never",
          "sometimes"
        ],
        "answer": 2,
        "why": "Sometimes y usually sí; always y never no."
      },
      {
        "q": "«Rarely» significa…",
        "options": [
          "muy a menudo",
          "casi nunca",
          "raro"
        ],
        "answer": 1,
        "why": "Es frecuencia baja, no rareza."
      },
      { q: "Los adverbios de frecuencia van…", options: ["al final de la frase","entre el sujeto y el verbo","delante del sujeto"], answer: 1, why: "I always go, she never eats." },
      { q: "Con el verbo «to be», el adverbio va…", options: ["delante de is/are","detrás de is/are","al final"], answer: 1, why: "«I am always late», no «I always am late»." },
      { q: "«Voy siempre al gimnasio» es…", options: ["I go always to the gym","I always go to the gym","Always I go to the gym"], answer: 1, why: "Entre el sujeto y el verbo principal." },
      { q: "Con un auxiliar (have, can, will), el adverbio va…", options: ["delante del auxiliar","entre el auxiliar y el verbo","al final"], answer: 1, why: "«I have never been there», «I can never remember»." },
    ]
  },
  {
    "id": "so-such-too-enough",
    "title": "so, such, too y enough",
    "tag": "Estructuras",
    "goal": "Decir «tan», «tanto», «demasiado» y «suficiente» sin liarlos.",
    "blocks": [
      {
        "t": "p",
        "text": "Cuatro palabras para graduar. La confusión típica es entre «so» y «such» (los dos son «tan») y entre «too» y «very» (demasiado no es lo mismo que muy)."
      },
      {
        "t": "table",
        "head": [
          "Palabra",
          "Va con",
          "Ejemplo"
        ],
        "rows": [
          [
            "so",
            "adjetivo o adverbio solo",
            "It's so cold."
          ],
          [
            "such",
            "(a/an) + adjetivo + sustantivo",
            "It's such a cold day."
          ],
          [
            "too",
            "adjetivo: más de lo aceptable",
            "It's too cold to go out."
          ],
          [
            "enough",
            "DETRÁS del adjetivo",
            "It's not warm enough."
          ]
        ]
      },
      {
        "t": "error",
        "wrong": "It's a so cold day.",
        "right": "It's such a cold day.",
        "why": "Si hay sustantivo detrás (day), toca «such». «So» solo acompaña al adjetivo cuando va suelto."
      },
      {
        "t": "tip",
        "text": "«Too» NO es «muy»: es «demasiado», y siempre es negativo. «This coffee is too hot» significa que no te lo puedes beber. Si solo quieres decir que está muy caliente, es «very hot»."
      },
      {
        "t": "p",
        "text": "«Enough» es el único que va detrás del adjetivo (old enough, good enough), pero delante del sustantivo (enough money). Es justo al revés que en español."
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "It's too late to call her.",
            "pron": "its tu léit tu kol jer",
            "es": "Es demasiado tarde para llamarla."
          },
          {
            "en": "He's not old enough to drive.",
            "pron": "jis not óuld i-náf tu dráiv",
            "es": "No tiene edad suficiente para conducir."
          },
          {
            "en": "It was such a good movie.",
            "pron": "it uós sach a gud múu-vi",
            "es": "Fue una película tan buena."
          }
        ]
      }
    ],
    "quiz": [
      {
        "q": "«Hace un día tan bonito» es…",
        "options": [
          "It's a so nice day",
          "It's such a nice day",
          "It's so a nice day"
        ],
        "answer": 1,
        "why": "Con sustantivo detrás: such a + adjetivo + sustantivo."
      },
      {
        "q": "«Este café está demasiado caliente» es…",
        "options": [
          "This coffee is very hot",
          "This coffee is too hot",
          "This coffee is so hot"
        ],
        "answer": 1,
        "why": "Too = más de lo aceptable, no te lo puedes beber."
      },
      {
        "q": "«Enough» con un adjetivo va…",
        "options": [
          "delante",
          "detrás",
          "da igual"
        ],
        "answer": 1,
        "why": "old enough, good enough: siempre detrás del adjetivo."
      },
      {
        "q": "«No tengo suficiente dinero» es…",
        "options": [
          "I don't have money enough",
          "I don't have enough money",
          "I don't have too money"
        ],
        "answer": 1,
        "why": "Con sustantivo, enough va delante."
      },
      {
        "q": "«Too» y «very» son…",
        "options": [
          "Lo mismo",
          "Distintos: too es negativo",
          "Too es más formal"
        ],
        "answer": 1,
        "why": "Very solo intensifica; too dice que se pasa de la raya."
      },
      { q: "«Demasiado caro» es…", options: ["very expensive","too expensive","so expensive"], answer: 1, why: "«Too» tiene sentido negativo: pasa del límite." },
      { q: "«Muy caro» es…", options: ["too expensive","very expensive","such expensive"], answer: 1, why: "«Very» solo intensifica, sin juzgar." },
      { q: "«Lo bastante mayor» es…", options: ["enough old","old enough","too old"], answer: 1, why: "«Enough» va DETRÁS del adjetivo, al revés que en español." },
      { q: "«Such» se usa con…", options: ["adjetivo solo","sustantivo (con o sin adjetivo)","verbos"], answer: 1, why: "«Such a good movie» frente a «so good»." },
    ]
  },
  {
    "id": "doble-negacion",
    "title": "En inglés no hay doble negación",
    "tag": "Estructuras",
    "goal": "Dejar de decir «I don't know nothing».",
    "blocks": [
      {
        "t": "p",
        "text": "En español la doble negación es obligatoria: «no sé nada», «no he visto a nadie». En inglés es al revés: una sola negación por frase. Si el verbo ya va en negativo, lo de detrás tiene que ser positivo."
      },
      {
        "t": "formula",
        "parts": ["don't","anything / anyone / anywhere"],
      "example": "I don't know anything."
      },
      {
        "t": "table",
        "head": [
          "Español",
          "Inglés correcto",
          "El calco típico"
        ],
        "rows": [
          [
            "No sé nada",
            "I don't know anything",
            "I don't know nothing"
          ],
          [
            "No he visto a nadie",
            "I haven't seen anyone",
            "I haven't seen nobody"
          ],
          [
            "No fui a ninguna parte",
            "I didn't go anywhere",
            "I didn't go nowhere"
          ],
          [
            "Tampoco tengo",
            "I don't have any either",
            "I don't have neither"
          ]
        ]
      },
      {
        "t": "tip",
        "text": "La otra opción es dejar el verbo en positivo y negar con la palabra: «I know nothing» es correcto y suena más literario. Lo que no vale es negar dos veces: «I don't know nothing»."
      },
      {
        "t": "error",
        "wrong": "I don't want nothing.",
        "right": "I don't want anything.",
        "why": "El «don't» ya niega. Detrás va anything, no nothing. También valdría «I want nothing»."
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "I didn't see anyone there.",
            "pron": "ai dí-dent sii é-ni-uan der",
            "es": "No vi a nadie allí."
          },
          {
            "en": "There isn't anything left.",
            "pron": "der í-sent é-ni-zing left",
            "es": "No queda nada."
          },
          {
            "en": "She never says anything.",
            "pron": "shi né-ver ses é-ni-zing",
            "es": "Nunca dice nada."
          }
        ]
      }
    ],
    "quiz": [
      {
        "q": "«No sé nada» es…",
        "options": [
          "I don't know nothing",
          "I don't know anything",
          "I know not nothing"
        ],
        "answer": 1,
        "why": "Una sola negación: el don't ya niega."
      },
      {
        "q": "«No vi a nadie» es…",
        "options": [
          "I didn't see nobody",
          "I didn't see anyone",
          "I saw nobody not"
        ],
        "answer": 1,
        "why": "Con verbo negativo, detrás va anyone."
      },
      {
        "q": "«I know nothing» es…",
        "options": [
          "Incorrecto",
          "Correcto, con el verbo en positivo",
          "Lo mismo que I don't know nothing"
        ],
        "answer": 1,
        "why": "Negar con la palabra y dejar el verbo positivo también vale."
      },
      {
        "q": "«Nunca dice nada» es…",
        "options": [
          "She never says nothing",
          "She never says anything",
          "She doesn't never say"
        ],
        "answer": 1,
        "why": "«Never» ya es la negación, así que detrás anything."
      },
      {
        "q": "¿Cuántas negaciones caben en una frase inglesa?",
        "options": [
          "Una",
          "Dos",
          "Las que hagan falta"
        ],
        "answer": 0,
        "why": "Una. Dos se anulan y suena a inglés mal aprendido."
      },
      { q: "«No he visto a nadie» es…", options: ["I haven't seen nobody", "I haven't seen anybody", "I have seen nobody not"], answer: 1, why: "El «no» ya está en «haven't»: detrás va anybody, no nobody." },
      { q: "«No quiero nada» es…", options: ["I don't want nothing", "I don't want anything", "I want nothing not"], answer: 1, why: "Una negación por frase: don't + anything." },
      { q: "«I want nothing» ¿está bien?", options: ["No, nunca", "Sí: la negación la lleva «nothing» y el verbo va en positivo", "Solo en poesía"], answer: 1, why: "Vale mientras haya UNA sola negación: o don't + anything, o nothing con el verbo afirmativo." },
      { q: "¿Por qué a un español le sale la doble negación?", options: ["Porque en español es obligatoria", "Porque suena más enfático", "Porque el inglés la permitía antes"], answer: 0, why: "«No he visto a nadie» lleva dos negativos en español y es lo correcto; en inglés no." }
    ]
  },
  {
    "id": "this-that-these-those",
    "title": "this, that, these y those",
    "tag": "Palabras",
    "goal": "Señalar bien: cerca o lejos, uno o varios.",
    "blocks": [
      {
        "t": "p",
        "text": "Solo hay cuatro, y se eligen con dos preguntas: ¿está cerca o lejos? y ¿es uno o son varios? El español tiene tres distancias (este, ese, aquel) y el inglés solo dos, así que «ese» y «aquel» caen los dos en «that»."
      },
      {
        "t": "table",
        "head": [
          "",
          "Cerca",
          "Lejos"
        ],
        "rows": [
          [
            "Uno",
            "this (este)",
            "that (ese, aquel)"
          ],
          [
            "Varios",
            "these (estos)",
            "those (esos, aquellos)"
          ]
        ]
      },
      {
        "t": "tip",
        "text": "Truco de sonido: las de cerca llevan «i» corta y las de lejos suenan más abiertas. Y las de plural acaban en -se: these, those."
      },
      {
        "t": "error",
        "wrong": "I like this shoes.",
        "right": "I like these shoes.",
        "why": "«Shoes» es plural, así que el demostrativo también: these. Es el fallo más repetido, porque en español «este» y «estos» se parecen poco pero this y these mucho."
      },
      {
        "t": "p",
        "text": "Al teléfono el inglés usa «this»: «Hi, this is Ana» para presentarte, y «Who's this?» para preguntar quién llama. En español diríamos «soy Ana»."
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "These are my keys.",
            "pron": "diis ar mái kiis",
            "es": "Estas son mis llaves."
          },
          {
            "en": "Look at those birds.",
            "pron": "luk at dóus berds",
            "es": "Mira esos pájaros."
          },
          {
            "en": "Hi, this is Ana.",
            "pron": "jái, dis is á-na",
            "es": "Hola, soy Ana."
          }
        ]
      }
    ],
    "quiz": [
      {
        "q": "«Estos zapatos» es…",
        "options": [
          "this shoes",
          "these shoes",
          "those shoes"
        ],
        "answer": 1,
        "why": "Plural y cerca: these."
      },
      {
        "q": "«Aquellas casas» es…",
        "options": [
          "these houses",
          "those houses",
          "that houses"
        ],
        "answer": 1,
        "why": "Plural y lejos: those."
      },
      {
        "q": "El inglés distingue…",
        "options": [
          "tres distancias",
          "dos distancias",
          "cuatro distancias"
        ],
        "answer": 1,
        "why": "Solo cerca y lejos: «ese» y «aquel» son los dos that."
      },
      {
        "q": "Al teléfono, «soy Ana» es…",
        "options": [
          "I am Ana",
          "This is Ana",
          "That is Ana"
        ],
        "answer": 1,
        "why": "Fórmula fija del inglés: this is + nombre."
      },
      {
        "q": "«That» puede ser…",
        "options": [
          "solo singular",
          "singular y plural",
          "solo plural"
        ],
        "answer": 0,
        "why": "El plural de that es those."
      },
      { q: "El español tiene tres distancias (este, ese, aquel). ¿Cuántas tiene el inglés?", options: ["Tres también", "Dos: cerca y lejos", "Una sola"], answer: 1, why: "This/these (cerca) y that/those (lejos). «Ese» y «aquel» caen los dos en «that»." },
      { q: "«Estos libros» es…", options: ["this books", "these books", "those books"], answer: 1, why: "Cerca y plural: these." },
      { q: "«Aquellas casas» es…", options: ["these houses", "those houses", "that houses"], answer: 1, why: "Lejos y plural: those. «Ese» y «aquel» comparten palabra en inglés." },
      { q: "«This» y «these» se diferencian en…", options: ["la distancia", "el número (uno o varios)", "el género"], answer: 1, why: "Los dos son «cerca»; this es singular y these plural." }
    ]
  },
  {
    "id": "palabras-enlazadas",
    "title": "Por qué no entiendes lo que oyes",
    "tag": "Pronunciación",
    "goal": "Reconocer cómo se pegan las palabras al hablar rápido.",
    "blocks": [
      {
        "t": "p",
        "text": "Sabes las palabras, las lees sin problema, y luego un nativo habla y no entiendes nada. No es tu oído: es que el inglés hablado pega las palabras unas con otras, y lo que oyes no se parece a lo que verías escrito."
      },
      {
        "t": "table",
        "head": [
          "Se escribe",
          "Se dice",
          "Qué ha pasado"
        ],
        "rows": [
          [
            "an apple",
            "a-nápol",
            "la consonante salta a la vocal siguiente"
          ],
          [
            "want to",
            "uóna",
            "want to se funde en wanna"
          ],
          [
            "going to",
            "góna",
            "going to se funde en gonna"
          ],
          [
            "got to",
            "góra",
            "got to se funde en gotta"
          ],
          [
            "what do you",
            "uó-ra-yu",
            "se come casi todo"
          ],
          [
            "did you",
            "dí-yu",
            "la d y la y se juntan en una sola"
          ]
        ]
      },
      {
        "t": "p",
        "text": "La regla principal es esa primera: si una palabra acaba en consonante y la siguiente empieza por vocal, la consonante se va con la vocal. «Turn it off» no suena «turn it off», suena «ter-ni-tof». Por eso te parece que hablan rapidísimo: no hay huecos donde tú los esperas."
      },
      {
        "t": "tip",
        "text": "Practicarlo al revés funciona muy bien: intenta TÚ pegar las palabras al hablar. Di «ter-ni-tof» en vez de «turn it off» y de repente empiezas a reconocerlo cuando lo oyes."
      },
      {
        "t": "error",
        "wrong": "Esperar oír cada palabra separada",
        "right": "Esperar bloques pegados",
        "why": "Si escuchas buscando palabras sueltas, no las vas a encontrar nunca. Lo que hay que reconocer son grupos: «an apple» es un solo bloque, «a-nápol»."
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "Turn it off.",
            "pron": "ter-ni-tof",
            "es": "Apágalo."
          },
          {
            "en": "What are you doing?",
            "pron": "uó-ra-yu dú-ing",
            "es": "¿Qué estás haciendo?"
          },
          {
            "en": "I'm going to call him.",
            "pron": "aim gó-na kol im",
            "es": "Voy a llamarle."
          }
        ]
      }
    ],
    "quiz": [
      {
        "q": "«an apple» suena…",
        "options": [
          "an-apol",
          "a-nápol",
          "an-ápol"
        ],
        "answer": 1,
        "why": "La n salta a la vocal siguiente: es un solo bloque."
      },
      {
        "q": "«going to» hablado suena…",
        "options": [
          "góing tu",
          "góna",
          "gou-tu"
        ],
        "answer": 1,
        "why": "Se funde en «gonna», y es lo normal al hablar."
      },
      {
        "q": "La regla principal del enlace es…",
        "options": [
          "Consonante + vocal se pegan",
          "Se comen las vocales",
          "Se acelera el final"
        ],
        "answer": 0,
        "why": "Si acaba en consonante y sigue vocal, la consonante se va con la vocal."
      },
      {
        "q": "«Turn it off» suena…",
        "options": [
          "turn it of",
          "ter-ni-tof",
          "turni-tof"
        ],
        "answer": 1,
        "why": "Tres palabras que se reparten en tres sílabas nuevas."
      },
      {
        "q": "Lo mejor para entrenar el oído es…",
        "options": [
          "Escuchar más despacio",
          "Practicar tú a pegar las palabras",
          "Leer más"
        ],
        "answer": 1,
        "why": "Producirlo tú es lo que te enseña a reconocerlo."
      },
      { q: "¿Por qué no entiendes lo que oyes aunque sepas las palabras?", options: ["Hablan demasiado rápido","Porque las palabras se enlazan y suenan como una sola","Porque usan palabras raras"], answer: 1, why: "«What are you doing» suena «uó-ra-yu-dú-ing»." },
      { q: "«Want to» en habla rápida suena…", options: ["uónt tu","uá-na","uón-tu"], answer: 1, why: "Wanna. Igual que «going to» → gonna." },
      { q: "Cuando una palabra acaba en consonante y la siguiente empieza por vocal…", options: ["se separan más","se enlazan","desaparece la consonante"], answer: 1, why: "«An apple» suena «a-ná-pol»." },
      { q: "¿Qué conviene entrenar además del vocabulario?", options: ["Solo leer","Escuchar mucho para acostumbrar el oído al enlace","Escribir a mano"], answer: 1, why: "El enlace solo se domina oyéndolo, no estudiándolo." },
    ]
  },
  /* ------------------------------------------------------------------ *
   * DIEZ LECCIONES NUEVAS
   *
   * Todas nacen del mismo sitio: cosas que el español reparte de una manera
   * y el inglés de otra, y que hasta ahora no tenían lección propia.
   * ------------------------------------------------------------------ */

  {
    id: "ser-estar-tener",
    title: "ser, estar y tener: casi todo es «be»",
    tag: "Base",
    goal: "Dejar de decir «I have 30 years» y «I have hungry».",
    blocks: [
      {
        t: "p",
        text: "El español tiene «ser» y «estar», y el inglés solo tiene «be» para los dos. Eso es una buena noticia: donde nosotros dudamos («es aburrido» o «está aburrido»), el inglés no tiene que elegir. La mala noticia viene después: un montón de cosas que en español van con TENER, en inglés también van con «be».",
      },
      {
        t: "table",
        head: ["Español", "Inglés", "Qué verbo usa cada uno"],
        rows: [
          ["Soy español.", "I am Spanish.", "ser → be"],
          ["Estoy cansado.", "I am tired.", "estar → be"],
          ["Tengo 30 años.", "I am 30 years old.", "tener → ¡be!"],
          ["Tengo hambre.", "I am hungry.", "tener → ¡be!"],
          ["Tengo frío.", "I am cold.", "tener → ¡be!"],
          ["Tengo razón.", "I am right.", "tener → ¡be!"],
        ],
      },
      {
        t: "p",
        text: "El motivo es sencillo cuando lo ves: en inglés «hungry», «cold», «afraid» o «right» son ADJETIVOS, no sustantivos. Son «hambriento», «frío» en el sentido de «friolento», «asustado», «acertado». Y a un adjetivo le corresponde el verbo «be», igual que en «estoy cansado». El español eligió decirlo con sustantivos («tengo hambre» = poseo hambre) y por eso usa «tener».",
      },
      {
        t: "error",
        wrong: "I have 30 years. / I have hungry. / I have cold.",
        right: "I am 30 years old. / I am hungry. / I am cold.",
        why: "Con la edad, el hambre, la sed, el frío, el calor, el miedo, la razón y la prisa, el inglés usa «be». «I have hungry» ni siquiera es una frase: hungry es un adjetivo, no una cosa que se pueda tener.",
      },
      {
        t: "table",
        head: ["Español con TENER", "Inglés con BE", "Literalmente"],
        rows: [
          ["Tengo sed.", "I am thirsty.", "Estoy sediento."],
          ["Tengo calor.", "I am hot.", "Estoy acalorado."],
          ["Tengo miedo.", "I am afraid.", "Estoy asustado."],
          ["Tengo sueño.", "I am sleepy.", "Estoy soñoliento."],
          ["Tengo prisa.", "I am in a hurry.", "Estoy con prisa."],
          ["Tienes razón.", "You are right.", "Estás en lo cierto."],
          ["No tienes razón.", "You are wrong.", "Estás equivocado."],
          ["Tiene suerte.", "He is lucky.", "Es afortunado."],
        ],
      },
      {
        t: "tip",
        text: "Truco para acordarte: si en español la frase es «tengo + sustantivo» y ese sustantivo describe cómo te sientes o cómo estás, en inglés casi seguro que es «be + adjetivo». Con «tener» solo se quedan las posesiones de verdad: I have a car, I have a brother, I have time.",
      },
      {
        t: "p",
        text: "Y para la edad hay un detalle más: «I am 30 years old» se puede acortar a «I am 30», pero NUNCA a «I have 30». Y la pregunta también cambia de verbo: no es «¿cuántos años tienes?» sino «How OLD ARE you?», literalmente «¿cómo de viejo eres?».",
      },
      {
        t: "examples",
        items: [
          { en: "How old are you?", pron: "jáu óuld ar yu", es: "¿Cuántos años tienes?" },
          { en: "I'm thirty years old.", pron: "áim zér-ti yiers óuld", es: "Tengo treinta años." },
          { en: "I'm hungry and thirsty.", pron: "áim ján-gri and zérs-ti", es: "Tengo hambre y sed." },
          { en: "Are you cold?", pron: "ar yu kóuld", es: "¿Tienes frío?" },
          { en: "She's afraid of dogs.", pron: "shis a-fréid ov dogs", es: "Le tienen miedo los perros." },
          { en: "You're right, I'm sorry.", pron: "yur ráit, áim só-ri", es: "Tienes razón, lo siento." },
          { en: "I'm in a hurry.", pron: "áim in a já-ri", es: "Tengo prisa." },
          { en: "But I have a car and a house.", pron: "bat ai jav a kar and a jáus", es: "Pero tengo un coche y una casa." },
        ],
      },
    ],
    quiz: [
      { q: "«Tengo 25 años» es…", options: ["I have 25 years", "I am 25 years old", "I have 25 years old"], answer: 1, why: "La edad va con «be», nunca con «have»." },
      { q: "«Tengo hambre» es…", options: ["I have hunger", "I have hungry", "I am hungry"], answer: 2, why: "«Hungry» es un adjetivo: pide «be»." },
      { q: "¿Por qué «I have hungry» no existe?", options: ["Porque falta un artículo", "Porque «hungry» es adjetivo, no sustantivo", "Porque el orden está mal"], answer: 1, why: "No puedes «tener» un adjetivo: hungry es «hambriento»." },
      { q: "«¿Cuántos años tienes?» es…", options: ["How many years do you have?", "How old are you?", "What age do you have?"], answer: 1, why: "Literalmente «¿cómo de viejo eres?»." },
      { q: "«Tengo frío» es…", options: ["I have cold", "I am cold", "It is cold"], answer: 1, why: "«I am cold» = yo tengo frío. «It is cold» sería «hace frío»." },
      { q: "«Tienes razón» es…", options: ["You have reason", "You are right", "You have right"], answer: 1, why: "«Right» es adjetivo: estás en lo cierto." },
      { q: "«Ser» y «estar» en inglés…", options: ["son dos verbos distintos", "son el mismo verbo: be", "no existen"], answer: 1, why: "«I am Spanish» y «I am tired» usan el mismo verbo." },
      { q: "¿Cuál SÍ lleva «have»?", options: ["Tengo sed", "Tengo un coche", "Tengo prisa"], answer: 1, why: "«Have» se queda con las posesiones de verdad: I have a car." },
      { q: "«Tengo miedo» es…", options: ["I have fear", "I am afraid", "I have afraid"], answer: 1, why: "Afraid es adjetivo: be afraid." },
      { q: "«Tengo prisa» es…", options: ["I have hurry", "I am in a hurry", "I am hurry"], answer: 1, why: "La fórmula fija es «be in a hurry»." },
      { q: "«Hace frío hoy» (el tiempo, no tú) es…", options: ["I am cold today", "It is cold today", "There is cold today"], answer: 1, why: "Para el clima el sujeto es «it»: it is cold." },
      { q: "«Tiene suerte» es…", options: ["He has luck", "He is lucky", "He has lucky"], answer: 1, why: "«Lucky» es adjetivo: be lucky." },
    ],
  },

  {
    id: "like-gustar",
    title: "like y «gustar»: el sujeto cambia de sitio",
    tag: "Estructuras",
    goal: "Traducir «me gusta» sin darle la vuelta a la frase.",
    blocks: [
      {
        t: "p",
        text: "Esta es de las traducciones que más engañan, porque no basta con cambiar las palabras: hay que cambiar QUIÉN manda en la frase. En «me gusta el café», el sujeto es EL CAFÉ (el café me gusta a mí) y yo soy el complemento. En inglés es exactamente al revés: «I like coffee», donde el sujeto soy YO y el café es lo que recibe la acción.",
      },
      {
        t: "table",
        head: ["Español", "Quién es el sujeto", "Inglés", "Quién es el sujeto"],
        rows: [
          ["Me gusta el café.", "el café", "I like coffee.", "yo"],
          ["Me gustan los perros.", "los perros", "I like dogs.", "yo"],
          ["Le gusta bailar.", "bailar", "She likes dancing.", "ella"],
          ["Nos gusta la música.", "la música", "We like music.", "nosotros"],
          ["No les gusta esperar.", "esperar", "They don't like waiting.", "ellos"],
        ],
      },
      {
        t: "error",
        wrong: "Me like coffee. / The coffee likes me.",
        right: "I like coffee.",
        why: "«Me» no puede ser sujeto en inglés: el sujeto es «I». Y «the coffee likes me» significaría que al café le gustas tú, que es justo lo contrario.",
      },
      {
        t: "p",
        text: "De aquí sale otra consecuencia que se falla mucho: como el sujeto es la persona, la -s de la tercera persona va en «like», no en la cosa. «A ella le gusta el café» es «She likeS coffee». Si te fijas en el español, la -s parece que debería ir con la cosa («le gustaN los perros»), y por eso sale mal.",
      },
      {
        t: "table",
        head: ["Español", "Inglés", "Dónde va la -s"],
        rows: [
          ["Le gusta el café.", "She likes coffee.", "en «likes», porque el sujeto es ella"],
          ["Le gustan los perros.", "She likes dogs.", "sigue en «likes»: el sujeto no cambió"],
          ["Me gustan los perros.", "I like dogs.", "sin -s: el sujeto soy yo"],
        ],
      },
      {
        t: "p",
        text: "Y ojo con lo que va detrás de «like»: si es un verbo, se pone en -ing, no en infinitivo. «Me gusta leer» es «I like reading». También vale «I like to read», pero «I like read» no existe nunca.",
      },
      {
        t: "table",
        head: ["Expresión", "Significa", "Ejemplo"],
        rows: [
          ["would like", "querría / me gustaría", "I would like a coffee."],
          ["look like", "parecerse a", "She looks like her mother."],
          ["feel like", "apetecer", "I feel like a coffee."],
          ["be like", "cómo es (carácter)", "What is she like?"],
          ["like", "como (comparación)", "He runs like a machine."],
        ],
      },
      {
        t: "tip",
        text: "Ojo con «would like» y «like» a secas, que no significan lo mismo: «I like coffee» es «me gusta el café» en general, y «I would like a coffee» es «querría un café» ahora mismo, pidiéndolo. En un bar, decir «I like a coffee» suena raro; lo natural es «I'd like a coffee, please».",
      },
      {
        t: "examples",
        items: [
          { en: "I like coffee.", pron: "ai láik kó-fi", es: "Me gusta el café." },
          { en: "She likes dogs.", pron: "shi láiks dogs", es: "Le gustan los perros." },
          { en: "We don't like waiting.", pron: "ui dóunt láik uéi-ting", es: "No nos gusta esperar." },
          { en: "Do you like music?", pron: "du yu láik miúu-sik", es: "¿Te gusta la música?" },
          { en: "I'd like a coffee, please.", pron: "áid láik a kó-fi, pliis", es: "Querría un café, por favor." },
          { en: "She looks like her mother.", pron: "shi luks láik jer má-der", es: "Se parece a su madre." },
          { en: "I feel like a coffee.", pron: "ai fiil láik a kó-fi", es: "Me apetece un café." },
        ],
      },
    ],
    quiz: [
      { q: "«Me gusta el café» es…", options: ["Me like coffee", "I like coffee", "The coffee likes me"], answer: 1, why: "En inglés el sujeto es la persona: I like." },
      { q: "¿Por qué en español decimos «me gustaN los perros», en plural?", options: ["Porque el sujeto son los perros, no yo", "Porque «me» es plural", "Porque suena mejor"], answer: 0, why: "El verbo concuerda con lo que gusta. En inglés no: el sujeto es la persona y el verbo no cambia." },
      { q: "«Le gustan los perros» es…", options: ["She like dogs", "She likes dogs", "She likes dog"], answer: 1, why: "La -s va en el verbo porque el sujeto es ella, aunque en español el plural esté en «gustan»." },
      { q: "«Me gusta leer» es…", options: ["I like read", "I like reading", "I like to reading"], answer: 1, why: "Detrás de like va -ing (o «to read»), nunca el verbo desnudo." },
      { q: "En un bar, para pedir un café dices…", options: ["I like a coffee", "I'd like a coffee", "I am liking a coffee"], answer: 1, why: "«Would like» es «querría»; «like» a secas es un gusto general." },
      { q: "«Se parece a su madre» es…", options: ["She likes her mother", "She looks like her mother", "She is like her mother"], answer: 1, why: "«Look like» es parecerse físicamente." },
      { q: "«Me apetece un café» es…", options: ["I feel like a coffee", "I like a coffee", "I would a coffee"], answer: 0, why: "«Feel like» es apetecer." },
      { q: "«¿Cómo es ella?» (de carácter) es…", options: ["How is she?", "What is she like?", "What does she like?"], answer: 1, why: "«What is she like?» pregunta cómo es. «What does she like?» pregunta qué le gusta." },
      { q: "«What does she like?» pregunta…", options: ["cómo es ella", "qué le gusta", "a quién se parece"], answer: 1, why: "Con «does» es el verbo «like»: qué le gusta." },
      { q: "¿Por qué falla tanto esta estructura?", options: ["Porque «like» es irregular", "Porque el sujeto está en un sitio distinto en cada idioma", "Porque se pronuncia raro"], answer: 1, why: "En español manda la cosa; en inglés, la persona." },
      { q: "«No nos gusta esperar» es…", options: ["We not like wait", "We don't like waiting", "Us don't like waiting"], answer: 1, why: "Sujeto «we», negación con don't y el verbo detrás en -ing." },
    ],
  },

  {
    id: "verbo-get",
    title: "get: el verbo que sirve para todo",
    tag: "Verbos",
    goal: "Entender un verbo que no tiene una sola traducción.",
    blocks: [
      {
        t: "p",
        text: "«Get» es probablemente el verbo más usado del inglés hablado, y es justo el que peor se enseña, porque no tiene UNA traducción: tiene una docena. La buena noticia es que no hay que memorizarlas sueltas — lo que decide el significado es qué clase de palabra va detrás.",
      },
      {
        t: "table",
        head: ["Detrás de get va…", "Significa", "Ejemplo", "En español"],
        rows: [
          ["un sustantivo", "conseguir, recibir", "I got a letter.", "Recibí una carta."],
          ["un adjetivo", "ponerse, volverse", "It's getting cold.", "Está empezando a hacer frío."],
          ["un lugar", "llegar", "I got home late.", "Llegué tarde a casa."],
          ["un participio", "pasiva informal", "He got fired.", "Lo despidieron."],
          ["una persona + a", "traer, ir a por", "I'll get you a coffee.", "Te traigo un café."],
        ],
      },
      {
        t: "tip",
        text: "La regla que resuelve la mitad de los casos: GET + ADJETIVO significa CAMBIAR de estado, no estar en él. «I am tired» es «estoy cansado»; «I get tired» es «me canso». «She is angry» es «está enfadada»; «she gets angry» es «se enfada». Ese matiz de cambio es lo que en español expresamos con «ponerse», «volverse» o un verbo reflexivo.",
      },
      {
        t: "table",
        head: ["be + adjetivo (estado)", "get + adjetivo (cambio)"],
        rows: [
          ["I am tired. — Estoy cansado.", "I get tired. — Me canso."],
          ["She is angry. — Está enfadada.", "She gets angry. — Se enfada."],
          ["It is dark. — Está oscuro.", "It gets dark. — Oscurece."],
          ["He is better. — Está mejor.", "He gets better. — Mejora."],
        ],
      },
      {
        t: "p",
        text: "Y luego está la familia de phrasal verbs con get, que son de los más frecuentes del idioma. Aquí el significado ya no se deduce: hay que aprendérselos, pero son pocos y salen constantemente.",
      },
      {
        t: "table",
        head: ["Phrasal", "Significa", "Ejemplo"],
        rows: [
          ["get up", "levantarse", "I get up at seven."],
          ["get on / get off", "subir / bajar (transporte)", "Get on the bus."],
          ["get in / get out", "entrar / salir (coche)", "Get in the car."],
          ["get along with", "llevarse bien con", "I get along with my boss."],
          ["get over", "superar algo", "She got over the flu."],
          ["get back", "volver / recuperar", "I got back at ten."],
          ["get rid of", "deshacerse de", "Get rid of that box."],
        ],
      },
      {
        t: "error",
        wrong: "I am getting 30 years. / I get angry with you? (queriendo decir «¿estás enfadado?»)",
        right: "I am 30 years old. / Are you angry?",
        why: "«Get» marca el CAMBIO, no el estado. Si quieres decir cómo está alguien ahora, va «be»; «get» es cómo llegó a estarlo.",
      },
      {
        t: "examples",
        items: [
          { en: "I got a message from her.", pron: "ai got a mé-sich from jer", es: "Recibí un mensaje suyo." },
          { en: "It's getting late.", pron: "its gué-ring léit", es: "Se está haciendo tarde." },
          { en: "What time did you get home?", pron: "uót táim did yu guet jóum", es: "¿A qué hora llegaste a casa?" },
          { en: "I get tired very quickly.", pron: "ai guet tái-erd vé-ri kuík-li", es: "Me canso muy rápido." },
          { en: "We get along really well.", pron: "ui guet a-lóng ríi-li uel", es: "Nos llevamos muy bien." },
          { en: "I'll get you a glass of water.", pron: "ail guet yu a glas ov uó-rer", es: "Te traigo un vaso de agua." },
        ],
      },
    ],
    quiz: [
      { q: "¿Qué decide el significado de «get»?", options: ["El tiempo verbal", "Qué clase de palabra va detrás", "Si es formal o informal"], answer: 1, why: "Sustantivo, adjetivo, lugar o participio: cada uno le da un sentido." },
      { q: "«I get tired» significa…", options: ["Estoy cansado", "Me canso", "Estuve cansado"], answer: 1, why: "Get + adjetivo es el CAMBIO de estado, no el estado." },
      { q: "«Estoy cansado» es…", options: ["I get tired", "I am tired", "I have tired"], answer: 1, why: "Para el estado va «be»; «get» sería «me canso»." },
      { q: "«It's getting dark» es…", options: ["Está oscuro", "Está oscureciendo", "Estaba oscuro"], answer: 1, why: "El cambio en marcha: se está haciendo de noche." },
      { q: "«I got home at ten» significa…", options: ["Conseguí una casa a las diez", "Llegué a casa a las diez", "Me fui de casa a las diez"], answer: 1, why: "Get + lugar = llegar." },
      { q: "«He got fired» significa…", options: ["Consiguió fuego", "Lo despidieron", "Se enfadó"], answer: 1, why: "Get + participio es una pasiva informal: fue despedido." },
      { q: "«Nos llevamos bien» es…", options: ["We get up well", "We get along well", "We get over well"], answer: 1, why: "«Get along with» es llevarse bien." },
      { q: "«Levantarse» (de la cama) es…", options: ["get up", "get in", "get on"], answer: 0, why: "Get up. «Get on» es subirse a un transporte." },
      { q: "«Superar una gripe» es…", options: ["get over the flu", "get off the flu", "get up the flu"], answer: 0, why: "«Get over» es superar algo, físico o emocional." },
      { q: "«She gets angry» es…", options: ["Está enfadada", "Se enfada", "Estaba enfadada"], answer: 1, why: "Otra vez el cambio: se enfada, no está enfadada." },
      { q: "«Deshacerse de algo» es…", options: ["get rid of", "get out of", "get back of"], answer: 0, why: "«Get rid of» es la fórmula fija." },
      { q: "«Te traigo un café» es…", options: ["I'll get you a coffee", "I'll get a coffee you", "I'll take you a coffee"], answer: 0, why: "Get + persona + cosa: traer algo a alguien." },
    ],
  },

  {
    id: "numeros-horas-fechas",
    title: "Números, horas y fechas",
    tag: "Palabras",
    goal: "Decir la hora, el año y la fecha sin bloquearte.",
    blocks: [
      {
        t: "p",
        text: "Es de lo primero que necesitas en la vida real —una hora, una fecha, un precio— y de lo que menos se practica. Además tiene varias trampas donde el español no ayuda nada.",
      },
      {
        t: "p",
        text: "Empecemos por la hora. El inglés tiene dos maneras y las dos se usan: la fácil (decir los números seguidos) y la clásica (con past y to). La fácil funciona siempre, así que si dudas, tira de ella.",
      },
      {
        t: "table",
        head: ["Hora", "Forma fácil", "Forma clásica"],
        rows: [
          ["3:00", "three o'clock", "three o'clock"],
          ["3:15", "three fifteen", "a quarter past three"],
          ["3:30", "three thirty", "half past three"],
          ["3:45", "three forty-five", "a quarter to four"],
          ["3:20", "three twenty", "twenty past three"],
          ["3:50", "three fifty", "ten to four"],
        ],
      },
      {
        t: "tip",
        text: "Ojo con «past» y «to»: PAST es «y» (past three = y tres) y TO es «menos», pero contando hacia la hora SIGUIENTE. «Las cuatro menos cuarto» es «a quarter to FOUR», no «to three». En español nombramos la hora que viene igual, así que aquí sí coincidimos.",
      },
      {
        t: "p",
        text: "Los años son la trampa más famosa. Hasta 1999 se dicen en dos parejas de cifras: 1990 no es «one thousand nine hundred ninety», es «nineteen ninety» (diecinueve-noventa). A partir de 2000 hay dos costumbres, y las dos son correctas.",
      },
      {
        t: "table",
        head: ["Año", "Se dice", "Literalmente"],
        rows: [
          ["1985", "nineteen eighty-five", "diecinueve ochenta y cinco"],
          ["1990", "nineteen ninety", "diecinueve noventa"],
          ["2000", "two thousand", "dos mil"],
          ["2005", "two thousand five", "dos mil cinco"],
          ["2024", "twenty twenty-four", "veinte veinticuatro"],
        ],
      },
      {
        t: "p",
        text: "Las fechas llevan número ordinal: no es «five of May», es «May fifth» o «the fifth of May». Y en Estados Unidos el mes va DELANTE, tanto al hablar como al escribir en cifras: 03/07 es el 7 de marzo, no el 3 de julio.",
      },
      {
        t: "table",
        head: ["Fecha", "Americano", "Ojo"],
        rows: [
          ["5 de mayo", "May fifth", "mes + ordinal"],
          ["1 de enero", "January first", "no «January one»"],
          ["3 de julio en cifras", "7/3 en España, 3/7 en EE. UU.", "el mes va primero"],
          ["en 2020", "in 2020", "los años llevan «in»"],
          ["el lunes", "on Monday", "los días llevan «on»"],
        ],
      },
      {
        t: "error",
        wrong: "I was born the 5 of May of 1990. / It's the three and a half.",
        right: "I was born on May fifth, 1990. / It's three thirty.",
        why: "Las fechas van con ordinal y sin «of» delante del año. Y la media hora no es «and a half»: es «half past three» o directamente «three thirty».",
      },
      {
        t: "tip",
        text: "Los números grandes NO llevan «and» en el sitio donde el español pone «y»: 250 es «two hundred fifty» en americano. Y «hundred», «thousand» y «million» nunca llevan -s cuando van con un número: «two hundred», no «two hundreds».",
      },
      {
        t: "examples",
        items: [
          { en: "It's half past three.", pron: "its jaf past zrii", es: "Son las tres y media." },
          { en: "The meeting is at a quarter to five.", pron: "de míi-ring is at a kuór-ter tu fáiv", es: "La reunión es a las cinco menos cuarto." },
          { en: "I was born in nineteen ninety.", pron: "ai uós born in náin-tíin náin-ti", es: "Nací en 1990." },
          { en: "My birthday is on May fifth.", pron: "mai bérz-dei is on méi fifz", es: "Mi cumpleaños es el 5 de mayo." },
          { en: "There are two hundred fifty people.", pron: "der ar tuu ján-dred fíf-ti píi-pol", es: "Hay doscientas cincuenta personas." },
          { en: "See you at seven thirty.", pron: "sii yu at sé-ven zér-ti", es: "Nos vemos a las siete y media." },
        ],
      },
    ],
    quiz: [
      { q: "«1990» se dice…", options: ["one thousand nine hundred ninety", "nineteen ninety", "nine hundred ninety"], answer: 1, why: "Los años hasta 1999 van en dos parejas: nineteen ninety." },
      { q: "«Las tres y media» es…", options: ["three and a half", "half past three", "three past half"], answer: 1, why: "«Half past three», o directamente «three thirty»." },
      { q: "«Las cuatro menos cuarto» es…", options: ["a quarter to three", "a quarter to four", "a quarter past three"], answer: 1, why: "«To» cuenta hacia la hora siguiente: to FOUR." },
      { q: "«Past» significa…", options: ["menos", "y", "en punto"], answer: 1, why: "«Ten past three» = las tres y diez." },
      { q: "«El 5 de mayo» es…", options: ["the five of May", "May fifth", "May five"], answer: 1, why: "Las fechas llevan número ordinal: fifth." },
      { q: "En Estados Unidos, «03/07» es…", options: ["3 de julio", "7 de marzo", "depende"], answer: 1, why: "El mes va delante en el formato americano." },
      { q: "«250» en americano es…", options: ["two hundred and fifty", "two hundred fifty", "two hundreds fifty"], answer: 1, why: "Sin «and» y sin -s en hundred." },
      { q: "«Doscientos» nunca es…", options: ["two hundred", "two hundreds", "200"], answer: 1, why: "Hundred, thousand y million no llevan -s tras un número." },
      { q: "«En 2020» es…", options: ["on 2020", "at 2020", "in 2020"], answer: 2, why: "Los años llevan «in»." },
      { q: "«2024» se suele decir…", options: ["two zero two four", "twenty twenty-four", "two thousand and twenty-four"], answer: 1, why: "Desde 2010 lo normal es leerlo en dos parejas otra vez." },
      { q: "Si dudas con la hora, la forma segura es…", options: ["decir los números seguidos", "usar siempre past", "usar siempre to"], answer: 0, why: "«Three forty-five» siempre funciona y nadie lo dice mal." },
    ],
  },

  {
    id: "tambien-tampoco",
    title: "«Yo también» y «yo tampoco»",
    tag: "Estructuras",
    goal: "Contestar «So do I» y «Neither do I» sin pensarlo.",
    blocks: [
      {
        t: "p",
        text: "En español tienes dos frases y te sirven para toda la vida: «yo también» y «yo tampoco». En inglés no hay una fórmula fija: la respuesta se construye con el AUXILIAR de la frase que acabas de oír, así que cambia en cada caso. Es de las cosas que más delatan a un hispanohablante, porque nos quedamos en «me too» para todo.",
      },
      {
        t: "formula",
        parts: ["So / Neither", "auxiliar", "sujeto"],
        example: "I love coffee. — So do I.",
      },
      {
        t: "table",
        head: ["Frase", "«Yo también»", "Por qué ese auxiliar"],
        rows: [
          ["I like coffee.", "So do I.", "Presente simple → do"],
          ["I am tired.", "So am I.", "El verbo be se repite tal cual"],
          ["I went there.", "So did I.", "Pasado simple → did"],
          ["I have finished.", "So have I.", "Present perfect → have"],
          ["I can swim.", "So can I.", "El modal se repite"],
          ["I will come.", "So will I.", "Futuro → will"],
        ],
      },
      {
        t: "p",
        text: "Para «yo tampoco» se usa NEITHER, y aquí hay una trampa: el auxiliar va en POSITIVO aunque la idea sea negativa. La negación ya la lleva «neither», y en inglés no caben dos negaciones en la misma frase.",
      },
      {
        t: "table",
        head: ["Frase negativa", "«Yo tampoco»", "Nunca"],
        rows: [
          ["I don't like it.", "Neither do I.", "Neither don't I."],
          ["I'm not tired.", "Neither am I.", "Neither am not I."],
          ["I didn't go.", "Neither did I.", "Neither didn't I."],
          ["I can't swim.", "Neither can I.", "Neither can't I."],
        ],
      },
      {
        t: "error",
        wrong: "I don't like it. — Me neither do. / Also I.",
        right: "I don't like it. — Neither do I. / Me neither.",
        why: "«Me too» y «me neither» existen y son correctos, pero solo en registro informal y sin nada detrás. Si empiezas con «so» o «neither», detrás va auxiliar + sujeto, en ese orden y con el verbo invertido.",
      },
      {
        t: "tip",
        text: "La versión de bolsillo, para salir del paso en cualquier conversación informal: «Me too» para lo afirmativo y «Me neither» para lo negativo. Siempre funcionan. Pero «so do I» y «neither do I» suenan bastante mejor, y como el auxiliar es el mismo que usarías para hacer la pregunta, ya te lo sabes.",
      },
      {
        t: "p",
        text: "Y si quieres decir lo CONTRARIO —«pues yo no» o «pues yo sí»— la fórmula es todavía más corta: sujeto + auxiliar, sin darle la vuelta. «I love coffee» — «I don't». «I don't like it» — «I do».",
      },
      {
        t: "examples",
        items: [
          { en: "I love this song. — So do I.", pron: "ai lav dis song. — sóu du ai", es: "Me encanta esta canción. — Y a mí." },
          { en: "I'm really tired. — So am I.", pron: "áim ríi-li tái-erd. — sóu am ai", es: "Estoy muy cansado. — Yo también." },
          { en: "I can't drive. — Neither can I.", pron: "ai kant dráiv. — nái-der kan ai", es: "No sé conducir. — Yo tampoco." },
          { en: "I didn't like the movie. — Neither did I.", pron: "ai dí-dent láik de múu-vi. — nái-der did ai", es: "No me gustó la película. — A mí tampoco." },
          { en: "I love coffee. — I don't.", pron: "ai lav kó-fi. — ai dóunt", es: "Me encanta el café. — Pues a mí no." },
        ],
      },
    ],
    quiz: [
      { q: "«I like coffee» — «Yo también» es…", options: ["So do I", "So I do", "Also I"], answer: 0, why: "So + auxiliar + sujeto, con el verbo invertido." },
      { q: "«I am tired» — «Yo también» es…", options: ["So do I", "So am I", "So I am"], answer: 1, why: "Con «be» se repite el propio verbo: so am I." },
      { q: "«I went there» — «Yo también» es…", options: ["So do I", "So did I", "So went I"], answer: 1, why: "Pasado simple → el auxiliar es «did»." },
      { q: "«I don't like it» — «Yo tampoco» es…", options: ["Neither don't I", "Neither do I", "So don't I"], answer: 1, why: "«Neither» ya niega: el auxiliar va en positivo." },
      { q: "¿Por qué «Neither don't I» está mal?", options: ["Porque el orden es otro", "Porque habría dos negaciones en la misma frase", "Porque «neither» no existe"], answer: 1, why: "En inglés solo cabe una negación por frase." },
      { q: "«I can't swim» — «Yo tampoco» es…", options: ["Neither can I", "Neither can't I", "So can I"], answer: 0, why: "El modal se repite en positivo detrás de neither." },
      { q: "«Me too» y «Me neither»…", options: ["están mal", "valen, pero son informales", "solo valen por escrito"], answer: 1, why: "Son correctos en conversación informal y siempre funcionan." },
      { q: "«I love coffee» — «Pues yo no» es…", options: ["I don't", "So don't I", "Neither do I"], answer: 0, why: "Para lo contrario: sujeto + auxiliar, sin invertir." },
      { q: "«I have finished» — «Yo también» es…", options: ["So do I", "So have I", "So am I"], answer: 1, why: "Se repite el auxiliar de la frase: have." },
      { q: "¿De dónde sale el auxiliar de la respuesta?", options: ["Siempre es «do»", "Del verbo de la frase que acabas de oír", "Del sujeto"], answer: 1, why: "Es el mismo que usarías para hacer la pregunta de esa frase." },
      { q: "«I don't like it» — «Pues a mí sí» es…", options: ["I do", "So do I", "Neither do I"], answer: 0, why: "Para llevar la contraria en positivo: I do." },
    ],
  },

  {
    id: "contracciones",
    title: "Contracciones: I'm, don't, it's",
    tag: "Base",
    goal: "Entender las formas cortas, que son las normales al hablar.",
    blocks: [
      {
        t: "p",
        text: "En los libros ves «I am», «do not», «she will». En la calle nadie habla así: se dice «I'm», «don't», «she'll». Las contracciones no son inglés descuidado — son el inglés normal. Usar siempre la forma larga suena raro y, sobre todo, si no las reconoces al oído no entiendes nada, porque son justo las palabras que más se repiten.",
      },
      {
        t: "table",
        head: ["Larga", "Corta", "Ejemplo"],
        rows: [
          ["I am", "I'm", "I'm ready."],
          ["you are", "you're", "You're late."],
          ["he is / he has", "he's", "He's here."],
          ["we are", "we're", "We're waiting."],
          ["they are", "they're", "They're coming."],
          ["do not", "don't", "I don't know."],
          ["does not", "doesn't", "She doesn't care."],
          ["did not", "didn't", "We didn't go."],
          ["cannot", "can't", "I can't swim."],
          ["will not", "won't", "He won't come."],
          ["I would / I had", "I'd", "I'd like a coffee."],
          ["I will", "I'll", "I'll call you."],
        ],
      },
      {
        t: "p",
        text: "Hay dos contracciones que valen para DOS cosas distintas, y solo el contexto las separa. «'s» puede ser «is» o «has». Y «'d» puede ser «would» o «had». Lo que decide es lo que viene detrás.",
      },
      {
        t: "table",
        head: ["Ves", "Es", "Cómo lo sabes"],
        rows: [
          ["He's tired.", "He is tired.", "Detrás va un adjetivo → is"],
          ["He's finished.", "He has finished.", "Detrás va un participio → has"],
          ["I'd like it.", "I would like it.", "Detrás va un verbo base → would"],
          ["I'd finished.", "I had finished.", "Detrás va un participio → had"],
        ],
      },
      {
        t: "error",
        wrong: "Its raining. / The dog wagged it's tail.",
        right: "It's raining. / The dog wagged its tail.",
        why: "«It's» con apóstrofo es «it is» o «it has». «Its» sin apóstrofo es el posesivo (su). Es el error de escritura más frecuente del inglés, y lo cometen también los nativos.",
      },
      {
        t: "tip",
        text: "Una que sorprende: «won't» viene de «will not», aunque no lo parezca. Es un resto del inglés antiguo, donde «will» se decía «wol». No intentes deducirla — es la única irregular de la lista, y hay que aprenderla suelta.",
      },
      {
        t: "p",
        text: "En respuestas cortas afirmativas NO se contrae nunca: se dice «Yes, I am», no «Yes, I'm». La contracción necesita algo detrás donde apoyarse; si la frase acaba ahí, la palabra recupera su forma larga. En negativo sí se contrae: «No, I'm not».",
      },
      {
        t: "examples",
        items: [
          { en: "I'm not sure.", pron: "áim not shur", es: "No estoy seguro." },
          { en: "She doesn't live here anymore.", pron: "shi dá-sent liv jier e-ni-mór", es: "Ya no vive aquí." },
          { en: "We won't be late.", pron: "ui uóunt bi léit", es: "No llegaremos tarde." },
          { en: "He's already left.", pron: "jis ol-ré-di left", es: "Ya se ha ido." },
          { en: "I'd like to help.", pron: "áid láik tu jelp", es: "Me gustaría ayudar." },
          { en: "It's raining and its color is gray.", pron: "its réi-ning and its ká-lor is gréi", es: "Está lloviendo y su color es gris." },
        ],
      },
    ],
    quiz: [
      { q: "«Don't» es la forma corta de…", options: ["do not", "does not", "did not"], answer: 0, why: "Does not → doesn't; did not → didn't." },
      { q: "En «He's finished», el «'s» es…", options: ["is", "has", "does"], answer: 1, why: "Detrás va un participio, así que es «has finished»." },
      { q: "En «He's tired», el «'s» es…", options: ["is", "has", "was"], answer: 0, why: "Detrás va un adjetivo: he is tired." },
      { q: "«Won't» viene de…", options: ["would not", "will not", "want not"], answer: 1, why: "Es irregular por razones históricas: hay que aprenderla suelta." },
      { q: "«Its» sin apóstrofo es…", options: ["it is", "el posesivo (su)", "it has"], answer: 1, why: "«It's» con apóstrofo es it is / it has." },
      { q: "«Está lloviendo» es…", options: ["Its raining", "It's raining", "Its' raining"], answer: 1, why: "Aquí es «it is», así que lleva apóstrofo." },
      { q: "En «I'd like a coffee», el «'d» es…", options: ["had", "would", "did"], answer: 1, why: "Detrás va un verbo base (like) → would." },
      { q: "Respuesta corta a «Are you ready?»", options: ["Yes, I'm.", "Yes, I am.", "Yes, am I."], answer: 1, why: "En afirmativas cortas no se contrae nunca." },
      { q: "Las contracciones son…", options: ["inglés incorrecto", "el inglés normal al hablar", "solo de Estados Unidos"], answer: 1, why: "Usar siempre la forma larga suena artificial." },
      { q: "«She doesn't care» en forma larga es…", options: ["She does not care", "She do not care", "She did not care"], answer: 0, why: "doesn't = does not." },
      { q: "¿Por qué importa reconocerlas al oído?", options: ["Porque se escriben distinto", "Porque son las palabras que más se repiten al hablar", "Porque son más formales"], answer: 1, why: "Si no las identificas, pierdes el hilo de la frase entera." },
    ],
  },

  {
    id: "adverbios-modo",
    title: "Adverbios: la terminación -ly",
    tag: "Palabras",
    goal: "Saber cuándo es «good» y cuándo «well».",
    blocks: [
      {
        t: "p",
        text: "Aquí la correspondencia con el español es directa y muy cómoda: la terminación inglesa «-ly» es nuestro «-mente». Slow → slowly = lento → lentamente. Si te sabes el adjetivo, te sabes el adverbio.",
      },
      {
        t: "table",
        head: ["Adjetivo", "Adverbio", "Español"],
        rows: [
          ["slow", "slowly", "lento → lentamente"],
          ["quick", "quickly", "rápido → rápidamente"],
          ["careful", "carefully", "cuidadoso → cuidadosamente"],
          ["easy", "easily", "fácil → fácilmente (la y pasa a i)"],
          ["happy", "happily", "feliz → felizmente"],
          ["terrible", "terribly", "terrible → terriblemente (pierde la e)"],
        ],
      },
      {
        t: "p",
        text: "La diferencia de fondo: el ADJETIVO describe una cosa o una persona (a slow car), y el ADVERBIO describe cómo se hace algo (he drives slowly). En español lo distinguimos igual, así que la lógica ya la tienes; lo que falla es que el inglés es más estricto y no te deja usar el adjetivo en lugar del adverbio.",
      },
      {
        t: "error",
        wrong: "She sings good. / He drives very careful.",
        right: "She sings well. / He drives very carefully.",
        why: "«Good» es adjetivo y «well» es su adverbio, y son palabras distintas. Si describe CÓMO se hace algo, hace falta el adverbio.",
      },
      {
        t: "table",
        head: ["Adjetivo", "Adverbio", "Ejemplo"],
        rows: [
          ["good (bueno)", "well (bien)", "a good singer / she sings well"],
          ["fast (rápido)", "fast (rápido)", "a fast car / he drives fast"],
          ["hard (duro)", "hard (duro)", "hard work / he works hard"],
          ["late (tarde)", "late (tarde)", "a late train / he arrived late"],
          ["early (temprano)", "early (temprano)", "an early flight / I got up early"],
        ],
      },
      {
        t: "tip",
        text: "Ojo con «hard» y «hardly», que parecen pareja y no lo son. «He works hard» es «trabaja duro». «He hardly works» es «apenas trabaja» — justo lo contrario. Lo mismo con «late» y «lately»: «lately» no es «tarde», es «últimamente».",
      },
      {
        t: "p",
        text: "Y al revés: no todo lo que acaba en -ly es adverbio. «Friendly», «lovely», «lonely» y «silly» son ADJETIVOS, aunque lleven la terminación. Por eso no puedes decir «he smiled friendly»; hay que rodearlo: «he smiled in a friendly way».",
      },
      {
        t: "table",
        head: ["Palabra", "Qué es", "Cuidado"],
        rows: [
          ["friendly", "adjetivo", "a friendly dog, no «he barked friendly»"],
          ["lovely", "adjetivo", "a lovely day"],
          ["lonely", "adjetivo", "a lonely street"],
          ["hardly", "adverbio", "apenas, no «duramente»"],
          ["lately", "adverbio", "últimamente, no «tarde»"],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "Please speak slowly.", pron: "pliis spiik slóu-li", es: "Habla despacio, por favor." },
          { en: "She sings very well.", pron: "shi sings vé-ri uel", es: "Canta muy bien." },
          { en: "He works hard every day.", pron: "ji uérks jard év-ri déi", es: "Trabaja duro todos los días." },
          { en: "I hardly know him.", pron: "ai járd-li nóu jim", es: "Apenas lo conozco." },
          { en: "Read the instructions carefully.", pron: "riid di ins-trák-shons kér-fu-li", es: "Lee las instrucciones con atención." },
          { en: "They arrived late.", pron: "déi a-ráivd léit", es: "Llegaron tarde." },
        ],
      },
    ],
    quiz: [
      { q: "La terminación «-ly» equivale en español a…", options: ["-mente", "-ando", "-ado"], answer: 0, why: "slow → slowly = lento → lentamente." },
      { q: "«Canta bien» es…", options: ["She sings good", "She sings well", "She sings goodly"], answer: 1, why: "«Well» es el adverbio de «good»; son palabras distintas." },
      { q: "Adverbio de «easy»:", options: ["easyly", "easily", "easy"], answer: 1, why: "La -y pasa a -i antes de -ly: easily." },
      { q: "«He works hard» significa…", options: ["Apenas trabaja", "Trabaja duro", "Trabaja tarde"], answer: 1, why: "«Hard» es adjetivo y adverbio a la vez: duro." },
      { q: "«He hardly works» significa…", options: ["Trabaja duro", "Apenas trabaja", "Trabaja bien"], answer: 1, why: "«Hardly» es «apenas», lo contrario de lo que parece." },
      { q: "«Friendly» es…", options: ["un adverbio", "un adjetivo, aunque acabe en -ly", "las dos cosas"], answer: 1, why: "Como lovely, lonely y silly: adjetivos con terminación -ly." },
      { q: "«Lately» significa…", options: ["tarde", "últimamente", "lentamente"], answer: 1, why: "«Tarde» es «late»; «lately» es últimamente." },
      { q: "«Conduce rápido» es…", options: ["He drives fastly", "He drives fast", "He drives quick"], answer: 1, why: "«Fast» no tiene forma en -ly: sirve para las dos cosas." },
      { q: "¿Qué describe un adverbio?", options: ["Una cosa o persona", "Cómo se hace algo", "Cuántos hay"], answer: 1, why: "El adjetivo describe la cosa; el adverbio, la acción." },
      { q: "«Lee con atención» es…", options: ["Read careful", "Read carefully", "Read with care attention"], answer: 1, why: "Describe cómo leer: hace falta el adverbio." },
      { q: "«Un perro amistoso» es…", options: ["a friendly dog", "a friendlyly dog", "a friend dog"], answer: 0, why: "«Friendly» ya es el adjetivo." },
    ],
  },

  {
    id: "dos-objetos",
    title: "Dos objetos: «give me the book»",
    tag: "Estructuras",
    goal: "Colocar bien «me lo dio» y «se lo di a ella».",
    blocks: [
      {
        t: "p",
        text: "Hay verbos que llevan dos complementos a la vez: alguien da ALGO a ALGUIEN. En español resolvemos esto con pronombres pegados al verbo («me lo dio», «dáselo»), y el inglés no puede hacer eso: tiene que colocar las palabras en un orden concreto, y hay dos órdenes posibles.",
      },
      {
        t: "formula",
        parts: ["verbo", "persona", "cosa"],
        example: "He gave me the book.",
      },
      {
        t: "formula",
        parts: ["verbo", "cosa", "to / for", "persona"],
        example: "He gave the book to me.",
      },
      {
        t: "table",
        head: ["Orden", "Ejemplo", "En español"],
        rows: [
          ["persona + cosa", "She sent me an email.", "Me mandó un correo."],
          ["cosa + to + persona", "She sent an email to me.", "Mandó un correo a mí."],
          ["persona + cosa", "Can you pass me the salt?", "¿Me pasas la sal?"],
          ["cosa + to + persona", "Can you pass the salt to me?", "¿Le pasas la sal a él?"],
        ],
      },
      {
        t: "tip",
        text: "La clave es la preposición: si la persona va DELANTE, no lleva nada («give me the book»). Si va DETRÁS, necesita «to» o «for» («give the book to me»). Poner las dos cosas a la vez es el error más común: «give to me the book» no existe.",
      },
      {
        t: "error",
        wrong: "He gave to me the book. / He explained me the problem.",
        right: "He gave me the book. / He explained the problem to me.",
        why: "Con la persona delante no se pone «to». Y ojo: no todos los verbos admiten los dos órdenes. «Explain», «say», «describe» y «suggest» SIEMPRE necesitan la preposición: explain something TO someone.",
      },
      {
        t: "table",
        head: ["Verbo", "¿Admite «verbo + persona + cosa»?", "Ejemplo correcto"],
        rows: [
          ["give", "sí", "give me the book"],
          ["send", "sí", "send me an email"],
          ["tell", "sí", "tell me the truth"],
          ["buy", "sí (con for)", "buy me a coffee"],
          ["explain", "NO", "explain the problem to me"],
          ["say", "NO", "say something to me"],
          ["describe", "NO", "describe the house to me"],
          ["suggest", "NO", "suggest a place to me"],
        ],
      },
      {
        t: "p",
        text: "¿Y cuándo se elige cada orden? Cuando las dos formas valen, el inglés pone al final la información NUEVA o la más importante. «I gave John the keys» pone el foco en las llaves; «I gave the keys to John» lo pone en John. Si uno de los dos es un pronombre corto (me, him, it), casi siempre va delante, porque lo conocido va primero.",
      },
      {
        t: "examples",
        items: [
          { en: "Can you pass me the salt?", pron: "kan yu pas mi de solt", es: "¿Me pasas la sal?" },
          { en: "She sent me a message.", pron: "shi sent mi a mé-sich", es: "Me mandó un mensaje." },
          { en: "I'll buy you a coffee.", pron: "ail bái yu a kó-fi", es: "Te invito a un café." },
          { en: "He explained the rules to us.", pron: "ji iks-pléind de ruuls tu as", es: "Nos explicó las normas." },
          { en: "Tell me the truth.", pron: "tel mi de truz", es: "Dime la verdad." },
          { en: "Give the keys to John, not to me.", pron: "guiv de kiis tu yon, not tu mi", es: "Dale las llaves a John, no a mí." },
        ],
      },
    ],
    quiz: [
      { q: "«Me dio el libro» es…", options: ["He gave to me the book", "He gave me the book", "He gave the book me"], answer: 1, why: "Con la persona delante no se pone «to»." },
      { q: "«Dio el libro a María» es…", options: ["He gave the book to Maria", "He gave to Maria the book", "He gave the book Maria"], answer: 0, why: "Con la persona detrás hace falta «to»." },
      { q: "¿Cuál es el error más típico?", options: ["Olvidar el artículo", "Poner «to» con la persona delante", "Usar el plural"], answer: 1, why: "«Give to me the book» junta los dos órdenes y no existe." },
      { q: "«Me explicó el problema» es…", options: ["He explained me the problem", "He explained the problem to me", "He explained to me the problem"], answer: 1, why: "«Explain» SIEMPRE lleva la persona detrás con «to»." },
      { q: "¿Cuál de estos verbos NO admite «verbo + persona + cosa»?", options: ["give", "send", "explain"], answer: 2, why: "Explain, say, describe y suggest necesitan siempre la preposición." },
      { q: "«¿Me pasas la sal?» es…", options: ["Can you pass to me the salt?", "Can you pass me the salt?", "Can you pass the salt me?"], answer: 1, why: "Persona delante, sin preposición." },
      { q: "«Te invito a un café» (te compro un café) es…", options: ["I'll buy you a coffee", "I'll buy to you a coffee", "I'll buy a coffee you"], answer: 0, why: "«Buy» admite persona + cosa; con la persona detrás sería «for you»." },
      { q: "Con «buy», si la persona va detrás lleva…", options: ["to", "for", "nada"], answer: 1, why: "«Buy a coffee FOR you»: algunos verbos usan for en vez de to." },
      { q: "«Dime la verdad» es…", options: ["Say me the truth", "Tell me the truth", "Tell to me the truth"], answer: 1, why: "«Tell» admite persona delante; «say» no." },
      { q: "Cuando valen los dos órdenes, al final va…", options: ["lo más corto", "la información nueva o más importante", "siempre la persona"], answer: 1, why: "El inglés cierra la frase con lo que quiere destacar." },
      { q: "Un pronombre corto (me, him, it) suele ir…", options: ["delante", "detrás", "da igual"], answer: 0, why: "Lo ya conocido va primero: «give me the book»." },
    ],
  },

  {
    id: "imperativo-peticiones",
    title: "Órdenes, «let's» y peticiones educadas",
    tag: "Estructuras",
    goal: "Pedir cosas sin sonar borde.",
    blocks: [
      {
        t: "p",
        text: "El imperativo inglés es lo más fácil de toda la gramática: es el verbo base, tal cual, sin sujeto y sin cambiar nada. «Come», «wait», «open the door». No hay tú/usted ni vosotros/ustedes: una sola forma para todo el mundo.",
      },
      {
        t: "table",
        head: ["Español", "Inglés", "Detalle"],
        rows: [
          ["Espera.", "Wait.", "Verbo base, sin sujeto."],
          ["Esperad.", "Wait.", "La misma forma: no hay plural."],
          ["Espere usted.", "Wait.", "Tampoco hay forma de cortesía."],
          ["No esperes.", "Don't wait.", "El negativo se hace con «don't»."],
          ["No abras la puerta.", "Don't open the door.", "Siempre «don't», también en plural."],
        ],
      },
      {
        t: "p",
        text: "Para el «vamos a…» que incluye al que habla, el inglés usa LET'S, que es la contracción de «let us» (déjanos). «Vamos a comer» es «Let's eat». El negativo es «Let's not»: «Let's not talk about it».",
      },
      {
        t: "error",
        wrong: "We go to eat. / Let's to eat. / Let's eating.",
        right: "Let's eat.",
        why: "Detrás de «let's» va el verbo base pelado: ni «to» ni «-ing». Y «we go» es una afirmación («vamos», en el sentido de que lo hacemos), no una propuesta.",
      },
      {
        t: "p",
        text: "Ahora la parte que de verdad importa: el imperativo a secas suena BRUSCO en inglés, bastante más que en español. «Give me a coffee» en un bar suena a orden militar. El inglés compensa esa brusquedad con fórmulas de cortesía, y usarlas no es opcional: es lo que separa sonar educado de sonar borde sin querer.",
      },
      {
        t: "table",
        head: ["Fórmula", "Nivel", "Ejemplo"],
        rows: [
          ["Imperativo + please", "directo pero aceptable", "Open the window, please."],
          ["Can you…?", "informal, normal entre amigos", "Can you open the window?"],
          ["Could you…?", "educado, sirve para todo", "Could you open the window?"],
          ["Would you mind…?", "muy educado (+ -ing)", "Would you mind opening the window?"],
          ["I was wondering if…", "el más formal", "I was wondering if you could help."],
        ],
      },
      {
        t: "tip",
        text: "Si solo te quedas con una, quédate con «Could you…, please?»: funciona en cualquier situación, con cualquier persona, y nunca suena ni brusco ni excesivo. Y ojo con «Would you mind…?», que lleva trampa: significa «¿te importaría…?», así que la respuesta afirmativa es «No, not at all» — decir «yes» sería «sí me importa».",
      },
      {
        t: "p",
        text: "El imperativo también se usa para cosas que no son órdenes, y ahí no suena brusco en absoluto: instrucciones (Mix the eggs), indicaciones (Turn left), avisos (Be careful), invitaciones (Have a seat) y buenos deseos (Have a nice day).",
      },
      {
        t: "examples",
        items: [
          { en: "Could you help me, please?", pron: "kud yu jelp mi, pliis", es: "¿Podrías ayudarme, por favor?" },
          { en: "Let's go home.", pron: "lets góu jóum", es: "Vámonos a casa." },
          { en: "Don't worry about it.", pron: "dóunt uó-ri a-báut it", es: "No te preocupes por eso." },
          { en: "Would you mind waiting a moment?", pron: "uúd yu máind uéi-ting a móu-ment", es: "¿Te importaría esperar un momento?" },
          { en: "Turn left at the traffic light.", pron: "tern left at de trá-fik láit", es: "Gira a la izquierda en el semáforo." },
          { en: "Have a nice day!", pron: "jav a náis déi", es: "¡Que tengas un buen día!" },
        ],
      },
    ],
    quiz: [
      { q: "El imperativo inglés es…", options: ["el verbo base sin sujeto", "el verbo con -s", "el verbo con to"], answer: 0, why: "«Wait», «come», «open»: nada más." },
      { q: "«Esperad» (a varias personas) es…", options: ["Waits", "Wait", "You wait"], answer: 1, why: "Hay una sola forma para singular y plural." },
      { q: "«No abras la puerta» es…", options: ["Not open the door", "Don't open the door", "No open the door"], answer: 1, why: "El imperativo negativo se hace con «don't»." },
      { q: "«Vamos a comer» (propuesta) es…", options: ["We go to eat", "Let's eat", "Let's to eat"], answer: 1, why: "«Let's» + verbo base, sin «to»." },
      { q: "«Let's» es la contracción de…", options: ["let is", "let us", "let as"], answer: 1, why: "Literalmente «déjanos»." },
      { q: "El negativo de «let's» es…", options: ["Let's don't", "Let's not", "Don't let's"], answer: 1, why: "«Let's not talk about it»." },
      { q: "En un bar, «Give me a coffee» suena…", options: ["educado", "brusco, como una orden", "formal"], answer: 1, why: "El imperativo pelado es más brusco en inglés que en español." },
      { q: "La fórmula que sirve para casi todo es…", options: ["Give me…", "Could you…, please?", "You must…"], answer: 1, why: "Educada sin resultar excesiva, en cualquier contexto." },
      { q: "Detrás de «Would you mind» va…", options: ["el verbo base", "to + infinitivo", "el verbo en -ing"], answer: 2, why: "«Would you mind waiting?»" },
      { q: "A «Would you mind opening the window?» se contesta que sí con…", options: ["Yes, of course", "No, not at all", "Yes, I mind"], answer: 1, why: "Pregunta si te IMPORTA: decir «no» es acceder." },
      { q: "¿Cuál NO es una orden aunque use imperativo?", options: ["Have a nice day!", "Open the door!", "Wait here!"], answer: 0, why: "El imperativo también sirve para deseos, avisos e instrucciones." },
    ],
  },

  {
    id: "wish-ojala",
    title: "wish y hope: los dos «ojalá»",
    tag: "Estructuras",
    goal: "Decir «ojalá» según sea posible o imposible.",
    blocks: [
      {
        t: "p",
        text: "«Ojalá» sirve en español para dos cosas muy distintas: para algo que todavía puede pasar («ojalá venga mañana») y para lamentarse de algo que ya no tiene arreglo («ojalá tuviera más tiempo»). El inglés las separa en dos verbos, y elegir mal cambia por completo lo que estás diciendo.",
      },
      {
        t: "table",
        head: ["Verbo", "Se usa para", "Ejemplo", "En español"],
        rows: [
          ["hope", "algo posible, que aún puede pasar", "I hope it doesn't rain.", "Ojalá no llueva."],
          ["wish", "algo imposible o un lamento", "I wish I had more time.", "Ojalá tuviera más tiempo."],
        ],
      },
      {
        t: "p",
        text: "La gramática también los separa. HOPE va con presente o futuro normal, como cualquier verbo. WISH, en cambio, arrastra el verbo un tiempo hacia atrás, exactamente igual que el condicional 2: si hablas del presente, el verbo va en pasado; si hablas del pasado, va en past perfect.",
      },
      {
        t: "table",
        head: ["Cuándo", "Fórmula", "Ejemplo", "En español"],
        rows: [
          ["presente imposible", "wish + pasado", "I wish I knew the answer.", "Ojalá supiera la respuesta."],
          ["presente imposible (be)", "wish + were", "I wish I were taller.", "Ojalá fuera más alto."],
          ["pasado (arrepentimiento)", "wish + had + participio", "I wish I had studied.", "Ojalá hubiera estudiado."],
          ["molestia con alguien", "wish + would", "I wish you would listen.", "Ojalá me escucharas."],
        ],
      },
      {
        t: "tip",
        text: "Si te acuerdas de los condicionales, esto ya te lo sabes: WISH usa exactamente el mismo desplazamiento. Donde el español pone subjuntivo («supiera», «fuera», «hubiera estudiado»), el inglés pone un tiempo pasado. Es el mismo mecanismo que en «If I had money, I would travel».",
      },
      {
        t: "error",
        wrong: "I wish it doesn't rain tomorrow. / I hope I had more money.",
        right: "I hope it doesn't rain tomorrow. / I wish I had more money.",
        why: "Mañana todavía puede no llover: eso es posible, así que va «hope». Y tener más dinero ahora mismo no depende de ti: eso es un deseo imposible, así que va «wish». Cambiarlos suena raro y confunde al que escucha.",
      },
      {
        t: "p",
        text: "Un detalle que sorprende: con «wish» se usa «were» para todas las personas, también con I, he y she. «I wish I were rich», no «I wish I was rich». En conversación muy informal se oye «was», pero «were» es la forma correcta y la que se espera por escrito. Es el mismo «were» de «If I were you».",
      },
      {
        t: "p",
        text: "Y una fórmula más, «I wish you…», que no lleva ningún desplazamiento porque no es un lamento sino un buen deseo: «I wish you luck», «I wish you a happy birthday». Ahí «wish» significa simplemente «desear».",
      },
      {
        t: "examples",
        items: [
          { en: "I hope you feel better soon.", pron: "ai jóup yu fiil bé-rer suun", es: "Ojalá te mejores pronto." },
          { en: "I wish I had more time.", pron: "ai uish ai jad mor táim", es: "Ojalá tuviera más tiempo." },
          { en: "I wish I were taller.", pron: "ai uish ai uér tó-ler", es: "Ojalá fuera más alto." },
          { en: "I wish I had studied more.", pron: "ai uish ai jad stá-did mor", es: "Ojalá hubiera estudiado más." },
          { en: "I hope it doesn't rain tomorrow.", pron: "ai jóup it dá-sent réin tu-mó-rou", es: "Ojalá no llueva mañana." },
          { en: "I wish you good luck.", pron: "ai uish yu gud lak", es: "Te deseo buena suerte." },
        ],
      },
    ],
    quiz: [
      { q: "«Ojalá no llueva mañana» (todavía es posible) es…", options: ["I wish it doesn't rain", "I hope it doesn't rain", "I wish it wouldn't rain"], answer: 1, why: "Algo que aún puede pasar va con «hope»." },
      { q: "«Ojalá tuviera más tiempo» es…", options: ["I hope I have more time", "I wish I had more time", "I wish I have more time"], answer: 1, why: "Deseo imposible ahora mismo: wish + pasado." },
      { q: "¿Qué diferencia a «hope» de «wish»?", options: ["El registro", "Si lo deseado es posible o imposible", "El tiempo verbal solamente"], answer: 1, why: "Hope para lo posible; wish para lo imposible o el lamento." },
      { q: "Detrás de «wish», hablando del presente, va…", options: ["presente", "pasado", "futuro"], answer: 1, why: "«I wish I knew»: el verbo retrocede un tiempo." },
      { q: "«Ojalá fuera más alto» es…", options: ["I wish I am taller", "I wish I were taller", "I hope I were taller"], answer: 1, why: "Con wish se usa «were» para todas las personas." },
      { q: "«Ojalá hubiera estudiado» es…", options: ["I wish I studied", "I wish I had studied", "I hope I studied"], answer: 1, why: "Arrepentimiento del pasado: wish + had + participio." },
      { q: "El desplazamiento de «wish» es el mismo que el de…", options: ["el present perfect", "los condicionales 2 y 3", "el futuro"], answer: 1, why: "Donde el español pone subjuntivo, el inglés pone pasado." },
      { q: "«I wish you would listen» expresa…", options: ["un buen deseo", "molestia con alguien que no cambia", "una posibilidad"], answer: 1, why: "«Wish + would» se usa para lo que te fastidia de la conducta de otro." },
      { q: "«I wish you luck» lleva…", options: ["desplazamiento de tiempo", "ningún desplazamiento: es un buen deseo", "subjuntivo"], answer: 1, why: "Ahí «wish» significa simplemente «desear»." },
      { q: "«Espero que te mejores» es…", options: ["I wish you feel better", "I hope you feel better", "I wish you felt better"], answer: 1, why: "Mejorar todavía es posible: hope." },
      { q: "«I wish I was rich» frente a «I wish I were rich»:", options: ["solo vale «was»", "«were» es la forma correcta, aunque se oiga «was»", "las dos son incorrectas"], answer: 1, why: "Es el mismo «were» de «If I were you»." },
    ],
  },


  /* ------------------------------------------------------------------ *
   * SEGUNDA TANDA DE DIEZ
   *
   * Los huecos que quedaban tras las 63: ortografía, movimiento, causativos,
   * orden de complementos y cuatro de pronunciación fina.
   * ------------------------------------------------------------------ */

  {
    id: "ortografia-terminaciones",
    title: "Cómo se escriben -s, -ed y -ing",
    tag: "Base",
    goal: "Dejar de dudar entre «stoped» y «stopped».",
    blocks: [
      {
        t: "p",
        text: "El inglés añade tres terminaciones constantemente: la -s de la tercera persona y los plurales, la -ed del pasado y la -ing del continuo. Al pegarlas, la palabra a veces cambia de forma. No son caprichos: hay cuatro reglas y con ellas se resuelve todo.",
      },
      {
        t: "table",
        head: ["Regla", "Cuándo", "Ejemplo"],
        rows: [
          ["Se dobla la última letra", "consonante + vocal + consonante y sílaba tónica al final", "stop → stopped, big → bigger"],
          ["La -e muda desaparece", "el verbo acaba en -e", "make → making, live → living"],
          ["La -y pasa a -i", "consonante + y", "study → studies, happy → happier"],
          ["La -y se queda", "vocal + y", "play → played, boy → boys"],
        ],
      },
      {
        t: "p",
        text: "La primera es la que más se falla, y tiene truco: solo se dobla si las tres últimas letras son consonante + vocal + consonante Y el golpe de voz cae en esa última sílaba. Por eso «stop» dobla (una sílaba, así que el golpe está ahí) y «visit» no (el golpe está en VI-sit, no en -sit).",
      },
      {
        t: "table",
        head: ["Verbo", "Se dobla", "Por qué"],
        rows: [
          ["stop → stopped", "sí", "s-t-o-p: consonante, vocal, consonante, y una sílaba"],
          ["plan → planned", "sí", "p-l-a-n, y una sílaba"],
          ["begin → beginning", "sí", "el golpe cae en -GIN, la última sílaba"],
          ["visit → visited", "no", "el golpe cae en VI-, no en la última"],
          ["open → opened", "no", "el golpe cae en O-, no en -pen"],
          ["rain → rained", "no", "acaba en dos vocales + consonante, no en CVC"],
        ],
      },
      {
        t: "error",
        wrong: "He stoped. / She is makeing dinner. / He studys English.",
        right: "He stopped. / She is making dinner. / He studies English.",
        why: "Las tres reglas juntas: stop dobla la p, make pierde la e y study cambia la y por -ies.",
      },
      {
        t: "tip",
        text: "Con la -ing hay una que se olvida siempre: la -e desaparece pero la -y NUNCA cambia. «Study» hace «studies» en presente, pero «studying» en continuo, con la y intacta. Lo mismo con «play → playing» y «try → trying». La y solo se toca cuando detrás va -s o -ed.",
      },
      {
        t: "table",
        head: ["Verbo", "+ -s", "+ -ed", "+ -ing"],
        rows: [
          ["stop", "stops", "stopped", "stopping"],
          ["make", "makes", "(made)", "making"],
          ["study", "studies", "studied", "studying"],
          ["play", "plays", "played", "playing"],
          ["watch", "watches", "watched", "watching"],
          ["go", "goes", "(went)", "going"],
        ],
      },
      {
        t: "p",
        text: "Y para la -s hay una regla extra: si la palabra acaba en un sonido silbante (-s, -sh, -ch, -x, -z) o en -o, se añade -ES y no solo -s. Es lo mismo que en español con «lápiz → lápices»: el idioma mete una vocal para poder pronunciarlo.",
      },
      {
        t: "examples",
        items: [
          { en: "He stopped the car.", pron: "ji stopt de kar", es: "Paró el coche." },
          { en: "She's making dinner.", pron: "shis méi-king dí-ner", es: "Está haciendo la cena." },
          { en: "He studies every night.", pron: "ji stá-dis év-ri náit", es: "Estudia todas las noches." },
          { en: "I'm studying English.", pron: "aim stá-diing ín-glish", es: "Estoy estudiando inglés." },
          { en: "She watches the news.", pron: "shi uó-chis de niús", es: "Ve las noticias." },
          { en: "They played all day.", pron: "déi pléid ol déi", es: "Jugaron todo el día." },
        ],
      },
    ],
    quiz: [
      { q: "Pasado de «stop»:", options: ["stoped", "stopped", "stopt"], answer: 1, why: "Consonante + vocal + consonante en sílaba tónica: se dobla." },
      { q: "Forma -ing de «make»:", options: ["makeing", "making", "makking"], answer: 1, why: "La -e muda desaparece." },
      { q: "Tercera persona de «study»:", options: ["studys", "studies", "studyes"], answer: 1, why: "Consonante + y → -ies." },
      { q: "Forma -ing de «study»:", options: ["studing", "studiing", "studying"], answer: 2, why: "Con -ing la y nunca cambia: studying." },
      { q: "Pasado de «play»:", options: ["plaied", "played", "playd"], answer: 1, why: "Vocal + y: la y se queda tal cual." },
      { q: "¿Por qué «visit» NO dobla la t?", options: ["Porque acaba en t", "Porque el golpe de voz no cae en la última sílaba", "Porque es irregular"], answer: 1, why: "VI-sit lleva el acento delante: visited, con una sola t." },
      { q: "¿Por qué «begin» SÍ dobla la n?", options: ["Porque es corto", "Porque el golpe cae en -GIN, la última sílaba", "Porque es irregular"], answer: 1, why: "beGINning: acento al final y CVC." },
      { q: "Tercera persona de «watch»:", options: ["watchs", "watches", "watchies"], answer: 1, why: "Acabado en sonido silbante: se añade -es." },
      { q: "Forma -ing de «live»:", options: ["liveing", "living", "livving"], answer: 1, why: "Pierde la -e muda." },
      { q: "«Rain» en pasado es «rained», sin doblar, porque…", options: ["acaba en dos vocales + consonante", "es irregular", "tiene dos sílabas"], answer: 0, why: "La regla pide consonante + vocal + consonante; «ain» no lo es." },
      { q: "La -y solo cambia cuando detrás va…", options: ["-ing", "-s o -ed", "cualquier terminación"], answer: 1, why: "studies, studied… pero studying." },
    ],
  },

  {
    id: "preposiciones-movimiento",
    title: "Preposiciones de movimiento: to, into, from",
    tag: "Palabras",
    goal: "Saber cuándo hace falta «to» y cuándo sobra.",
    blocks: [
      {
        t: "p",
        text: "Las preposiciones de lugar (in, on, at) dicen DÓNDE estás. Estas dicen HACIA dónde vas, y funcionan distinto. La buena noticia es que aquí el español ayuda bastante: «to» es «a» y «from» es «de/desde», casi siempre.",
      },
      {
        t: "table",
        head: ["Inglés", "Español", "Ejemplo"],
        rows: [
          ["to", "a (destino)", "I'm going to the office."],
          ["from", "de, desde (origen)", "I'm coming from work."],
          ["into", "dentro de (entrando)", "She walked into the room."],
          ["out of", "fuera de (saliendo)", "He ran out of the house."],
          ["through", "a través de", "We drove through the city."],
          ["across", "al otro lado de", "We walked across the street."],
          ["toward", "hacia", "He walked toward me."],
        ],
      },
      {
        t: "p",
        text: "El problema no es entenderlas: es que hay tres palabras muy comunes que NO llevan «to», y a un español le sale ponérselo porque en español sí decimos «a». Son home, here y there.",
      },
      {
        t: "error",
        wrong: "I'm going to home. / Come to here.",
        right: "I'm going home. / Come here.",
        why: "«Home», «here» y «there» ya llevan la idea de dirección dentro, así que no necesitan preposición. Pero ojo: «I'm going to my house» SÍ lleva «to», porque «house» es un sustantivo normal.",
      },
      {
        t: "table",
        head: ["Con «to»", "Sin «to»"],
        rows: [
          ["go to the office", "go home"],
          ["go to school", "go there"],
          ["go to my house", "come here"],
          ["go to bed", "go abroad"],
          ["go to work", "go upstairs"],
        ],
      },
      {
        t: "p",
        text: "Otra pareja que se confunde: IN y INTO. «In» es dónde estás (quieto), «into» es entrar (movimiento). «She is in the room» es que está dentro; «she walked into the room» es que entró. En español la diferencia la marca el verbo («está en» / «entró en»), y por eso no la notamos.",
      },
      {
        t: "table",
        head: ["Quieto (in / on / at)", "En movimiento (into / onto / to)"],
        rows: [
          ["He is in the car.", "He got into the car."],
          ["The book is on the table.", "I put the book onto the table."],
          ["She is at the office.", "She went to the office."],
        ],
      },
      {
        t: "tip",
        text: "Y el verbo «arrive» tiene su propia trampa: nunca lleva «to». Es «arrive IN» con ciudades y países, y «arrive AT» con sitios concretos. «I arrived to Madrid» es de los errores que más delatan a un hispanohablante, porque en español decimos «llegué A Madrid».",
      },
      {
        t: "examples",
        items: [
          { en: "I'm going home now.", pron: "aim góing jóum náu", es: "Me voy a casa ahora." },
          { en: "She walked into the room.", pron: "shi uokt ín-tu de ruum", es: "Entró en la habitación." },
          { en: "We arrived in Madrid at ten.", pron: "ui a-ráivd in ma-drid at ten", es: "Llegamos a Madrid a las diez." },
          { en: "He came from the office.", pron: "ji kéim from di ó-fis", es: "Vino de la oficina." },
          { en: "We walked across the park.", pron: "ui uokt a-krós de park", es: "Cruzamos el parque." },
          { en: "Get into the car, please.", pron: "guet ín-tu de kar, pliis", es: "Métete en el coche, por favor." },
        ],
      },
    ],
    quiz: [
      { q: "«Me voy a casa» es…", options: ["I'm going to home", "I'm going home", "I'm going at home"], answer: 1, why: "«Home» no lleva preposición cuando indica dirección." },
      { q: "«Voy a mi casa» es…", options: ["I'm going my house", "I'm going to my house", "I'm going at my house"], answer: 1, why: "«House» sí es un sustantivo normal: lleva «to»." },
      { q: "«Ven aquí» es…", options: ["Come to here", "Come here", "Come at here"], answer: 1, why: "«Here» y «there» tampoco llevan preposición." },
      { q: "«Llegué a Madrid» es…", options: ["I arrived to Madrid", "I arrived in Madrid", "I arrived at Madrid"], answer: 1, why: "«Arrive» nunca lleva «to». Con ciudades y países va «in»." },
      { q: "«Llegué a la estación» es…", options: ["I arrived to the station", "I arrived at the station", "I arrived in the station"], answer: 1, why: "Con sitios concretos, «arrive at»." },
      { q: "«Entró en la habitación» es…", options: ["She walked in the room", "She walked into the room", "She walked at the room"], answer: 1, why: "Hay movimiento de fuera a dentro: into." },
      { q: "«Está en el coche» (quieto) es…", options: ["He is into the car", "He is in the car", "He is to the car"], answer: 1, why: "Sin movimiento: in." },
      { q: "«From» equivale en español a…", options: ["a", "de, desde", "hacia"], answer: 1, why: "Marca el origen: I come from Spain." },
      { q: "«Cruzamos la calle» es…", options: ["We walked across the street", "We walked through the street", "We walked into the street"], answer: 0, why: "«Across» es de un lado al otro; «through» es atravesar por dentro." },
      { q: "¿Cuál NO lleva «to»?", options: ["go ___ school", "go ___ bed", "go ___ upstairs"], answer: 2, why: "Upstairs, home, here, there y abroad van sin preposición." },
      { q: "¿Por qué a un español le sale «to home»?", options: ["Porque suena mejor", "Porque en español decimos «a casa»", "Porque es lo correcto en británico"], answer: 1, why: "Calcamos la «a» española, que ahí no existe en inglés." },
    ],
  },

  {
    id: "preposicion-al-final",
    title: "La preposición al final: «Who are you talking to?»",
    tag: "Estructuras",
    goal: "Preguntar sin colocar la preposición donde la pone el español.",
    blocks: [
      {
        t: "p",
        text: "En español la preposición va DELANTE de la palabra que pregunta: «¿CON quién hablas?», «¿DE qué estás hablando?». En inglés se queda al final de la frase, colgando: «Who are you talking TO?». A un hispanohablante le parece que la frase está incompleta, y por eso tiende a moverla al principio.",
      },
      {
        t: "table",
        head: ["Español", "Inglés", "Dónde acabó la preposición"],
        rows: [
          ["¿Con quién hablas?", "Who are you talking to?", "al final"],
          ["¿De qué estás hablando?", "What are you talking about?", "al final"],
          ["¿A quién se lo diste?", "Who did you give it to?", "al final"],
          ["¿De dónde eres?", "Where are you from?", "al final"],
          ["¿En qué estás pensando?", "What are you thinking about?", "al final"],
          ["¿A qué hora?", "What time?", "aquí no hay preposición"],
        ],
      },
      {
        t: "error",
        wrong: "With who are you talking? / About what are you thinking?",
        right: "Who are you talking with? / What are you thinking about?",
        why: "Poner la preposición delante no es incorrecto del todo, pero suena antiguo y libresco. Nadie habla así. En inglés hablado va SIEMPRE al final.",
      },
      {
        t: "p",
        text: "La forma más segura de construirlas es partir de la frase afirmativa y quedarte con la preposición donde estaba. «I'm talking to Ana» → quito «Ana», pongo «Who» delante e invierto: «Who am I talking to?». La preposición no se mueve nunca de su sitio.",
      },
      {
        t: "formula",
        parts: ["WH-", "auxiliar", "sujeto", "verbo", "preposición"],
        example: "What are you looking for?",
      },
      {
        t: "table",
        head: ["Afirmación", "Pregunta", "La preposición se quedó"],
        rows: [
          ["I'm looking for my keys.", "What are you looking for?", "con «look»"],
          ["She's waiting for John.", "Who is she waiting for?", "con «wait»"],
          ["He comes from Italy.", "Where does he come from?", "con «come»"],
          ["I'm thinking about work.", "What are you thinking about?", "con «think»"],
        ],
      },
      {
        t: "tip",
        text: "Esto pasa sobre todo con verbos que llevan preposición fija: look FOR, wait FOR, talk TO, think ABOUT, listen TO, depend ON. Si te sabes el verbo con su preposición pegada, la pregunta sale sola: solo tienes que dejarla donde estaba.",
      },
      {
        t: "p",
        text: "También ocurre fuera de las preguntas, en frases con «that» o sin nada: «This is the house I told you about» («la casa DE LA QUE te hablé»). Igual que antes, la preposición se queda al final y en español viaja al principio.",
      },
      {
        t: "examples",
        items: [
          { en: "Who are you talking to?", pron: "juu ar yu tó-king tu", es: "¿Con quién hablas?" },
          { en: "What are you looking for?", pron: "uót ar yu lú-king for", es: "¿Qué estás buscando?" },
          { en: "Where are you from?", pron: "uér ar yu from", es: "¿De dónde eres?" },
          { en: "Who is this present for?", pron: "juu is dis pré-sent for", es: "¿Para quién es este regalo?" },
          { en: "What are you thinking about?", pron: "uót ar yu zín-king a-báut", es: "¿En qué estás pensando?" },
          { en: "This is the book I told you about.", pron: "dis is de buk ai tóuld yu a-báut", es: "Este es el libro del que te hablé." },
        ],
      },
    ],
    quiz: [
      { q: "«¿Con quién hablas?» es…", options: ["With who are you talking?", "Who are you talking with?", "Who with are you talking?"], answer: 1, why: "La preposición va al final en inglés hablado." },
      { q: "«¿De dónde eres?» es…", options: ["From where are you?", "Where are you from?", "Where from are you?"], answer: 1, why: "«From» se queda al final." },
      { q: "«¿Qué estás buscando?» es…", options: ["What are you looking?", "For what are you looking?", "What are you looking for?"], answer: 2, why: "«Look for» es buscar: la preposición no se separa del verbo." },
      { q: "¿Por qué a un español le sale ponerla delante?", options: ["Porque suena más formal", "Porque en español va delante: «¿CON quién?»", "Porque el inglés antiguo lo hacía"], answer: 1, why: "Copiamos la posición española sin darnos cuenta." },
      { q: "«With whom are you speaking?» es…", options: ["incorrecto", "correcto pero suena antiguo y libresco", "lo normal al hablar"], answer: 1, why: "Existe, pero nadie habla así en el día a día." },
      { q: "«¿En qué estás pensando?» es…", options: ["What are you thinking about?", "In what are you thinking?", "About what you think?"], answer: 0, why: "«Think about», con «about» al final." },
      { q: "El truco para construirlas es…", options: ["mover la preposición al principio", "partir de la frase afirmativa y dejarla donde estaba", "quitarla"], answer: 1, why: "«I'm looking for X» → «What are you looking for?»" },
      { q: "«¿Para quién es esto?» es…", options: ["For who is this?", "Who is this for?", "Who for is this?"], answer: 1, why: "«For» al final, igual que las demás." },
      { q: "«El libro del que te hablé» es…", options: ["The book about I told you", "The book I told you about", "About the book I told you"], answer: 1, why: "Fuera de las preguntas pasa lo mismo: la preposición cierra la frase." },
      { q: "¿Con qué verbos ocurre más?", options: ["Con los irregulares", "Con los que llevan preposición fija (look for, wait for, talk to)", "Con los modales"], answer: 1, why: "Si te sabes el verbo con su preposición, la pregunta sale sola." },
      { q: "«¿A quién esperas?» es…", options: ["Who are you waiting for?", "For who are you waiting?", "Who do you wait?"], answer: 0, why: "«Wait for» es esperar a alguien." },
    ],
  },

  {
    id: "causativos",
    title: "make, let y have: «hacer que alguien haga»",
    tag: "Verbos",
    goal: "Decir que alguien te obligó, te dejó o te lo mandó hacer.",
    blocks: [
      {
        t: "p",
        text: "En español decimos «hacer que alguien haga algo», «dejar que alguien haga algo». Ese «que» pide subjuntivo y complica la frase. El inglés lo resuelve mucho más corto: pone el verbo pelado detrás de la persona, sin «que» y sin «to».",
      },
      {
        t: "formula",
        parts: ["make / let / have", "persona", "verbo base"],
        example: "My mom made me clean my room.",
      },
      {
        t: "table",
        head: ["Verbo", "Significa", "Ejemplo", "En español"],
        rows: [
          ["make", "obligar, hacer que", "She made me wait.", "Me hizo esperar."],
          ["let", "dejar, permitir", "They let me go.", "Me dejaron ir."],
          ["have", "mandar hacer (a un profesional)", "I had him fix the car.", "Le mandé arreglar el coche."],
          ["get", "convencer para que", "I got him to help me.", "Conseguí que me ayudara."],
          ["help", "ayudar a", "She helped me carry it.", "Me ayudó a llevarlo."],
        ],
      },
      {
        t: "tip",
        text: "Ojo con la excepción, porque es la que más se falla: MAKE, LET y HAVE van con el verbo base pelado, pero GET va con «to». «She made me wait» pero «She got me TO wait». No hay lógica que lo explique — es así y hay que aprenderlo suelto. «Help» admite las dos: «help me carry» y «help me to carry» son correctas.",
      },
      {
        t: "error",
        wrong: "She made me to wait. / They let me to go. / My mom made that I clean my room.",
        right: "She made me wait. / They let me go. / My mom made me clean my room.",
        why: "Ni «to» ni «that». El inglés encadena persona + verbo base directamente. El «que» del español no se traduce por nada aquí.",
      },
      {
        t: "p",
        text: "Hay una diferencia importante entre MAKE y HAVE que en español no se nota, porque los dos caen en «hacer que». MAKE implica que la persona no tenía elección — hay presión. HAVE es neutro: es encargar algo a quien le corresponde hacerlo, normalmente porque le pagas o es su trabajo.",
      },
      {
        t: "table",
        head: ["Frase", "Qué transmite"],
        rows: [
          ["The teacher made us stay late.", "No nos dejó elegir: hubo obligación."],
          ["I had the mechanic check the brakes.", "Se lo encargué: es su trabajo, sin presión."],
          ["My boss made me work on Sunday.", "Me obligó, y no me hizo gracia."],
          ["I had my hair cut.", "Fui a que me lo cortaran: encargo normal."],
        ],
      },
      {
        t: "p",
        text: "Y en pasiva, «make» recupera el «to» que no llevaba en activa: «They made me wait» pasa a «I was made TO wait». Es una rareza que solo afecta a make, y la ves sobre todo en textos escritos.",
      },
      {
        t: "examples",
        items: [
          { en: "My mom made me clean my room.", pron: "mai mam méid mi kliin mai ruum", es: "Mi madre me hizo limpiar mi cuarto." },
          { en: "They didn't let me go.", pron: "déi dí-dent let mi góu", es: "No me dejaron ir." },
          { en: "I had someone repair the roof.", pron: "ai jad sám-uan ri-pér de ruf", es: "Mandé que me arreglaran el tejado." },
          { en: "She helped me carry the bags.", pron: "shi jelpt mi ká-ri de bags", es: "Me ayudó a llevar las bolsas." },
          { en: "I got him to change his mind.", pron: "ai got jim tu chéinch jis máind", es: "Conseguí que cambiara de opinión." },
          { en: "Let me help you.", pron: "let mi jelp yu", es: "Déjame ayudarte." },
        ],
      },
    ],
    quiz: [
      { q: "«Me hizo esperar» es…", options: ["She made me to wait", "She made me wait", "She made that I wait"], answer: 1, why: "Make + persona + verbo base, sin «to» y sin «que»." },
      { q: "«Me dejaron ir» es…", options: ["They let me to go", "They let me go", "They let that I go"], answer: 1, why: "Let también va con el verbo pelado." },
      { q: "¿Cuál de estos SÍ lleva «to»?", options: ["make", "let", "get"], answer: 2, why: "«I got him TO help me». Es la excepción del grupo." },
      { q: "El «que» de «hacer que alguien haga» se traduce…", options: ["por «that»", "por nada: no se traduce", "por «to»"], answer: 1, why: "El inglés encadena persona + verbo directamente." },
      { q: "«Le mandé arreglar el coche» (a un mecánico) es…", options: ["I made him fix the car", "I had him fix the car", "I let him fix the car"], answer: 1, why: "«Have» es encargar algo a quien le corresponde hacerlo." },
      { q: "«The teacher made us stay» transmite…", options: ["que nos lo encargó amablemente", "que no tuvimos elección", "que nos dejó quedarnos"], answer: 1, why: "«Make» implica obligación o presión." },
      { q: "«Déjame ayudarte» es…", options: ["Let me to help you", "Let me help you", "Let me helping you"], answer: 1, why: "Let + persona + verbo base." },
      { q: "«Conseguí que me ayudara» es…", options: ["I got him help me", "I got him to help me", "I made him to help me"], answer: 1, why: "«Get» es el único del grupo que pide «to»." },
      { q: "«Help» admite…", options: ["solo verbo base", "solo «to»", "las dos formas"], answer: 2, why: "«Help me carry» y «help me to carry» son correctas." },
      { q: "En pasiva, «They made me wait» pasa a…", options: ["I was made wait", "I was made to wait", "I was make to wait"], answer: 1, why: "«Make» recupera el «to» en la pasiva: es una rareza propia suya." },
      { q: "«I had my hair cut» significa…", options: ["Me corté el pelo yo mismo", "Fui a que me lo cortaran", "Le corté el pelo a alguien"], answer: 1, why: "«Have» + cosa + participio: encargar un servicio." },
    ],
  },

  {
    id: "sustantivos-compuestos",
    title: "«a five-year-old boy»: el sustantivo que no lleva plural",
    tag: "Palabras",
    goal: "Formar «una reunión de dos horas» sin poner la -s.",
    blocks: [
      {
        t: "p",
        text: "Cuando un sustantivo hace de adjetivo delante de otro, se comporta como un adjetivo inglés: se queda invariable. Y como los adjetivos ingleses nunca llevan plural, ese sustantivo tampoco lo lleva, aunque el número que tenga delante sea claramente plural.",
      },
      {
        t: "table",
        head: ["Español", "Inglés", "Nunca"],
        rows: [
          ["una reunión de dos horas", "a two-hour meeting", "a two-hours meeting"],
          ["un niño de cinco años", "a five-year-old boy", "a five-years-old boy"],
          ["un viaje de tres días", "a three-day trip", "a three-days trip"],
          ["un billete de diez euros", "a ten-euro note", "a ten-euros note"],
          ["un descanso de veinte minutos", "a twenty-minute break", "a twenty-minutes break"],
        ],
      },
      {
        t: "p",
        text: "Fíjate en el orden, que también se da la vuelta: el español dice «reunión DE dos horas» (primero la cosa, luego la medida) y el inglés dice «two-hour meeting» (primero la medida, luego la cosa). Es el mismo giro que ya viste con el genitivo sajón y con los adjetivos: en inglés, lo que describe va DELANTE.",
      },
      {
        t: "error",
        wrong: "a two-hours meeting / He is a five-years-old boy.",
        right: "a two-hour meeting / He is a five-year-old boy.",
        why: "Delante del sustantivo, «hour» y «year» son adjetivos, y los adjetivos ingleses no tienen plural. La -s solo vuelve si dices la edad de la forma normal: «He is five years old», sin guiones y sin sustantivo detrás.",
      },
      {
        t: "table",
        head: ["Como adjetivo (sin -s)", "Como frase normal (con -s)"],
        rows: [
          ["a five-year-old boy", "The boy is five years old."],
          ["a two-hour meeting", "The meeting lasted two hours."],
          ["a three-day trip", "The trip lasted three days."],
        ],
      },
      {
        t: "tip",
        text: "Los guiones son la señal: si la expresión va con guiones delante de un sustantivo, es un bloque que funciona como adjetivo, y ahí nunca hay -s. Si no hay guiones y la expresión va suelta detrás del verbo, es una frase normal y sí lleva plural.",
      },
      {
        t: "p",
        text: "Este mismo mecanismo explica un montón de palabras que ya usas sin pensarlas: «toothbrush» (cepillo de dientes, no «teethbrush»), «shoe shop» (zapatería), «car keys» (llaves del coche). El primer sustantivo va en singular y describe; el segundo es la cosa de verdad, y es el que puede llevar plural.",
      },
      {
        t: "examples",
        items: [
          { en: "It was a two-hour meeting.", pron: "it uós a tuu áu-er míi-ring", es: "Fue una reunión de dos horas." },
          { en: "He has a five-year-old son.", pron: "ji jas a fáiv yier óuld san", es: "Tiene un hijo de cinco años." },
          { en: "My son is five years old.", pron: "mai san is fáiv yiers óuld", es: "Mi hijo tiene cinco años." },
          { en: "We took a three-day trip.", pron: "ui tuk a zrii-déi trip", es: "Hicimos un viaje de tres días." },
          { en: "Where are the car keys?", pron: "uér ar de kar kiis", es: "¿Dónde están las llaves del coche?" },
          { en: "I need a new toothbrush.", pron: "ai niid a niú túuz-brash", es: "Necesito un cepillo de dientes nuevo." },
        ],
      },
    ],
    quiz: [
      { q: "«Una reunión de dos horas» es…", options: ["a two-hours meeting", "a two-hour meeting", "a meeting of two hours"], answer: 1, why: "Delante del sustantivo, «hour» hace de adjetivo y no lleva -s." },
      { q: "«Un niño de cinco años» es…", options: ["a five-years-old boy", "a five-year-old boy", "a boy of five years"], answer: 1, why: "Sin -s, con guiones, y delante del sustantivo." },
      { q: "«Mi hijo tiene cinco años» es…", options: ["My son is five year old", "My son is five years old", "My son has five years"], answer: 1, why: "Aquí sí lleva -s: es una frase normal, no un adjetivo compuesto." },
      { q: "¿Por qué no lleva -s en «a two-hour meeting»?", options: ["Porque «hour» es incontable", "Porque hace de adjetivo, y los adjetivos ingleses no tienen plural", "Porque va con guion"], answer: 1, why: "Es el mismo motivo que «two red cars», nunca «reds»." },
      { q: "El orden en inglés es…", options: ["cosa + de + medida", "medida + cosa", "da igual"], answer: 1, why: "«Two-hour meeting»: lo que describe va delante, como todos los adjetivos." },
      { q: "«Un viaje de tres días» es…", options: ["a three-days trip", "a three-day trip", "a trip of three days"], answer: 1, why: "Singular delante del sustantivo." },
      { q: "«Cepillo de dientes» es…", options: ["teethbrush", "toothbrush", "teeth brush"], answer: 1, why: "El primer sustantivo va en singular aunque sean varios dientes." },
      { q: "En un compuesto, ¿cuál puede llevar plural?", options: ["el primero", "el segundo", "ninguno"], answer: 1, why: "«Car keys»: el segundo es la cosa de verdad." },
      { q: "Los guiones indican que…", options: ["la expresión funciona como un adjetivo", "hay un error", "es plural"], answer: 0, why: "Con guiones y delante de un sustantivo: bloque adjetivo, sin -s." },
      { q: "«Un descanso de veinte minutos» es…", options: ["a twenty-minutes break", "a twenty-minute break", "a break of twenty minutes"], answer: 1, why: "Minute en singular al hacer de adjetivo." },
      { q: "«The trip lasted three ___.»", options: ["day", "days", "day's"], answer: 1, why: "Aquí «days» va suelto detrás del verbo: plural normal." },
    ],
  },

  {
    id: "also-too-aswell",
    title: "also, too, as well y either: los cuatro «también»",
    tag: "Palabras",
    goal: "Colocar «también» donde toca en cada caso.",
    blocks: [
      {
        t: "p",
        text: "El español tiene «también» y «tampoco», y con eso resuelve todo. El inglés tiene cuatro palabras para «también» y una para «tampoco», y lo que las separa no es el significado —significan lo mismo— sino DÓNDE van en la frase y en qué registro se usan.",
      },
      {
        t: "table",
        head: ["Palabra", "Dónde va", "Registro", "Ejemplo"],
        rows: [
          ["also", "en medio, antes del verbo", "más formal, escrito", "I also speak French."],
          ["too", "al final de la frase", "el más normal al hablar", "I speak French too."],
          ["as well", "al final de la frase", "muy natural, informal", "I speak French as well."],
          ["either", "al final, en NEGATIVAS", "es el «tampoco»", "I don't speak French either."],
        ],
      },
      {
        t: "p",
        text: "La regla que resuelve el 90 % de los casos: TOO y AS WELL van al final; ALSO va en medio. Y «also» sigue exactamente la misma regla de posición que «always» o «never»: entre el sujeto y el verbo principal, pero DETRÁS del verbo «to be».",
      },
      {
        t: "table",
        head: ["Frase", "Dónde cae «also»", "Por qué"],
        rows: [
          ["I also work here.", "antes del verbo", "verbo normal"],
          ["I am also tired.", "detrás de «am»", "con «be» va detrás"],
          ["I have also finished.", "detrás del auxiliar", "con auxiliar, detrás del primero"],
          ["I can also swim.", "detrás del modal", "el modal es el auxiliar"],
        ],
      },
      {
        t: "error",
        wrong: "I speak French also. / I don't speak French too.",
        right: "I speak French too. / I don't speak French either.",
        why: "«Also» no va al final de la frase, y en negativa el «también» se convierte en «either». Decir «too» en una frase negativa es de los errores más frecuentes del hispanohablante.",
      },
      {
        t: "tip",
        text: "Para el «tampoco» hay dos opciones y conviene no mezclarlas: si la frase ya es negativa, va EITHER al final («I don't like it either»). Si empiezas la respuesta de cero, va NEITHER al principio con el verbo invertido («Neither do I»). Son la misma idea con dos construcciones distintas.",
      },
      {
        t: "p",
        text: "Y ojo con «too», que tiene otro significado completamente distinto según dónde esté: al final de la frase es «también», pero delante de un adjetivo es «demasiado». «It's expensive too» es «también es caro»; «It's too expensive» es «es demasiado caro». La posición lo cambia todo.",
      },
      {
        t: "table",
        head: ["Frase", "Significa"],
        rows: [
          ["It's expensive too.", "También es caro."],
          ["It's too expensive.", "Es demasiado caro."],
          ["I'm tired too.", "Yo también estoy cansado."],
          ["I'm too tired.", "Estoy demasiado cansado."],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "I speak French too.", pron: "ai spiik french tuu", es: "También hablo francés." },
          { en: "I also speak French.", pron: "ai ól-sou spiik french", es: "También hablo francés." },
          { en: "She's coming as well.", pron: "shis ká-ming as uel", es: "Ella también viene." },
          { en: "I don't like it either.", pron: "ai dóunt láik it ái-der", es: "A mí tampoco me gusta." },
          { en: "I am also tired.", pron: "ai am ól-sou tái-erd", es: "Yo también estoy cansado." },
          { en: "It's too expensive.", pron: "its tuu iks-pén-siv", es: "Es demasiado caro." },
        ],
      },
    ],
    quiz: [
      { q: "«También hablo francés» (al hablar, lo más normal) es…", options: ["I also speak French", "I speak French too", "I speak French also"], answer: 1, why: "«Too» al final es lo más natural en conversación." },
      { q: "¿Dónde va «also»?", options: ["al final", "en medio, antes del verbo principal", "al principio"], answer: 1, why: "Sigue la regla de «always»: entre sujeto y verbo." },
      { q: "«Yo también estoy cansado» con «also» es…", options: ["I also am tired", "I am also tired", "I am tired also"], answer: 1, why: "Con el verbo «be», «also» va DETRÁS." },
      { q: "«A mí tampoco me gusta» es…", options: ["I don't like it too", "I don't like it either", "I don't like it also"], answer: 1, why: "En negativas, «también» se convierte en «either»." },
      { q: "¿Qué palabra es el «tampoco» al final de una frase?", options: ["too", "either", "as well"], answer: 1, why: "«Either» solo aparece en negativas." },
      { q: "«It's too expensive» significa…", options: ["También es caro", "Es demasiado caro", "Es bastante caro"], answer: 1, why: "«Too» delante de un adjetivo es «demasiado»." },
      { q: "«It's expensive too» significa…", options: ["También es caro", "Es demasiado caro", "Es carísimo"], answer: 0, why: "Al final de la frase, «too» es «también»." },
      { q: "«As well» va…", options: ["al final", "en medio", "al principio"], answer: 0, why: "Como «too», cierra la frase." },
      { q: "¿Cuál es más formal o de escrito?", options: ["too", "as well", "also"], answer: 2, why: "«Also» es el más formal de los tres." },
      { q: "«I don't speak French ___» (tampoco)", options: ["too", "either", "also"], answer: 1, why: "Frase negativa: either." },
      { q: "Si empiezas la respuesta de cero, «yo tampoco» es…", options: ["Either do I", "Neither do I", "Too do I"], answer: 1, why: "«Either» va al final de una frase; «neither» abre la respuesta." },
    ],
  },

  {
    id: "orden-complementos",
    title: "El orden de los complementos: cómo, dónde, cuándo",
    tag: "Base",
    goal: "Colocar los complementos en el orden que espera un nativo.",
    blocks: [
      {
        t: "p",
        text: "Ya sabes que el inglés fija el orden sujeto + verbo + objeto. Lo que casi nunca se explica es que los complementos que van DETRÁS también tienen un orden fijo, y el español no lo tiene: nosotros los movemos libremente y suena igual de bien. En inglés no.",
      },
      {
        t: "formula",
        parts: ["verbo", "objeto", "cómo", "dónde", "cuándo"],
        example: "She sang the song beautifully at the party last night.",
      },
      {
        t: "table",
        head: ["Posición", "Responde a", "Ejemplo"],
        rows: [
          ["1. modo", "¿cómo?", "quietly, well, carefully"],
          ["2. lugar", "¿dónde?", "at home, in Madrid, here"],
          ["3. tiempo", "¿cuándo?", "yesterday, at six, every day"],
        ],
      },
      {
        t: "p",
        text: "El error clásico del hispanohablante es meter el tiempo antes del lugar, porque en español lo hacemos constantemente: «estudié ayer en casa» suena perfecto. En inglés hay que decir «I studied at home yesterday»: primero dónde, después cuándo.",
      },
      {
        t: "error",
        wrong: "I studied yesterday at home. / She works every day in an office.",
        right: "I studied at home yesterday. / She works in an office every day.",
        why: "El orden es lugar y luego tiempo, nunca al revés. En español los dos órdenes suenan bien, así que hay que corregirlo a conciencia.",
      },
      {
        t: "p",
        text: "Hay una excepción muy usada: el complemento de tiempo puede irse al PRINCIPIO de la frase, y ahí suena perfectamente natural. Se hace cuando quieres darle importancia o situar la escena. Lo que no puede es quedarse en medio.",
      },
      {
        t: "table",
        head: ["Correcto", "Correcto", "Incorrecto"],
        rows: [
          ["I studied at home yesterday.", "Yesterday I studied at home.", "I studied yesterday at home."],
          ["We met in Madrid last year.", "Last year we met in Madrid.", "We met last year in Madrid."],
        ],
      },
      {
        t: "tip",
        text: "Y una regla que se salta todo lo anterior: NADA se mete entre el verbo y su objeto directo. «I like very much coffee» está mal por eso; es «I like coffee very much». Si dudas, primero cierra el verbo con su objeto y luego añade lo demás.",
      },
      {
        t: "error",
        wrong: "I like very much this city. / He speaks very well English.",
        right: "I like this city very much. / He speaks English very well.",
        why: "El objeto va pegado al verbo. Los adverbios y complementos esperan su turno detrás.",
      },
      {
        t: "examples",
        items: [
          { en: "I studied at home yesterday.", pron: "ai stá-did at jóum yés-ter-dei", es: "Estudié ayer en casa." },
          { en: "She works in an office every day.", pron: "shi uérks in an ó-fis év-ri déi", es: "Trabaja todos los días en una oficina." },
          { en: "He speaks English very well.", pron: "ji spiiks ín-glish vé-ri uel", es: "Habla inglés muy bien." },
          { en: "Last year we met in Madrid.", pron: "last yier ui met in ma-drid", es: "El año pasado nos conocimos en Madrid." },
          { en: "I like this city very much.", pron: "ai láik dis sí-ri vé-ri mach", es: "Me gusta mucho esta ciudad." },
          { en: "They arrived here late last night.", pron: "déi a-ráivd jier léit last náit", es: "Llegaron aquí tarde anoche." },
        ],
      },
    ],
    quiz: [
      { q: "El orden de los complementos es…", options: ["cuándo, dónde, cómo", "cómo, dónde, cuándo", "dónde, cuándo, cómo"], answer: 1, why: "Modo, lugar y tiempo, en ese orden." },
      { q: "«Estudié ayer en casa» es…", options: ["I studied yesterday at home", "I studied at home yesterday", "I yesterday studied at home"], answer: 1, why: "Primero el lugar, después el tiempo." },
      { q: "¿Dónde SÍ puede ir el tiempo, aparte del final?", options: ["en medio", "al principio de la frase", "entre el verbo y el objeto"], answer: 1, why: "«Yesterday I studied at home» es perfectamente natural." },
      { q: "«Me gusta mucho esta ciudad» es…", options: ["I like very much this city", "I like this city very much", "I very much like this city"], answer: 1, why: "Nada se mete entre el verbo y su objeto directo." },
      { q: "«Habla inglés muy bien» es…", options: ["He speaks very well English", "He speaks English very well", "He very well speaks English"], answer: 1, why: "Primero el objeto (English), luego el adverbio." },
      { q: "¿Por qué a un español le sale «yesterday at home»?", options: ["Porque es más corto", "Porque en español los dos órdenes suenan bien", "Porque es lo correcto en británico"], answer: 1, why: "El español no fija ese orden, así que no lo notamos." },
      { q: "«Trabaja todos los días en una oficina» es…", options: ["She works every day in an office", "She works in an office every day", "She every day works in an office"], answer: 1, why: "Lugar antes que tiempo." },
      { q: "La regla que se salta a todas las demás es…", options: ["el tiempo va siempre al final", "nada se mete entre el verbo y su objeto", "el modo va primero"], answer: 1, why: "Cierra el verbo con su objeto y luego añade lo demás." },
      { q: "«Cantó la canción maravillosamente» — ¿dónde va «beautifully»?", options: ["antes de «the song»", "después de «the song»", "al principio"], answer: 1, why: "Detrás del objeto: «She sang the song beautifully»." },
      { q: "«Llegaron aquí anoche» es…", options: ["They arrived last night here", "They arrived here last night", "They here arrived last night"], answer: 1, why: "«Here» es lugar y va antes que el tiempo." },
      { q: "En español este orden…", options: ["es igual de estricto", "no está fijado, por eso cuesta", "no existe"], answer: 1, why: "Podemos decirlo de varias maneras y todas suenan bien." },
    ],
  },

  {
    id: "pronunciacion-s",
    title: "Cómo suena la -s final",
    tag: "Empieza aquí",
    goal: "Saber si la -s suena «s», «z» o «is».",
    blocks: [
      {
        t: "p",
        text: "La -s aparece por todas partes: plurales, tercera persona, posesivos. Y no suena siempre igual — tiene tres pronunciaciones distintas, exactamente igual que la -ed del pasado. La buena noticia es que no hay que elegir: sale sola según el sonido que va antes.",
      },
      {
        t: "table",
        head: ["Suena", "Cuándo", "Ejemplos"],
        rows: [
          ["/s/ como en español", "tras sonido sordo: p, t, k, f", "books, cats, stops, laughs"],
          ["/z/ zumbando", "tras sonido sonoro: vocales, b, d, g, l, m, n, r, v", "dogs, cars, plays, gives"],
          ["/ɪz/ una sílaba entera", "tras sonido silbante: s, z, sh, ch, x, ge", "buses, watches, boxes, changes"],
        ],
      },
      {
        t: "p",
        text: "El caso importante es el tercero, porque cambia el número de sílabas. «Watch» tiene una sílaba y «watches» tiene dos. Si no lo haces, la palabra no se entiende: «watches» dicho como «uochs» no suena a nada.",
      },
      {
        t: "table",
        head: ["Palabra", "Con -s", "Sílabas"],
        rows: [
          ["book", "books (buks)", "1 → 1"],
          ["dog", "dogs (dogs, con la s zumbando)", "1 → 1"],
          ["watch", "watches (uó-chis)", "1 → 2"],
          ["bus", "buses (bá-sis)", "1 → 2"],
          ["box", "boxes (bók-sis)", "1 → 2"],
          ["page", "pages (péi-yis)", "1 → 2"],
        ],
      },
      {
        t: "tip",
        text: "El truco para no tener que pensarlo: pon la mano en la garganta. Si la última letra hace vibrar (dog, car, play), la -s vibra también y suena /z/. Si no vibra (book, cat, stop), la -s tampoco y suena /s/. Es el mismo mecanismo que la -ed, así que si ya te sabes aquella, esta es gratis.",
      },
      {
        t: "error",
        wrong: "«watches» dicho «uochs» / «buses» dicho «bass»",
        right: "«watches» = uó-chis / «buses» = bá-sis",
        why: "Tras un sonido silbante la -s necesita una vocal delante para poder pronunciarse, y eso añade una sílaba entera. Es lo mismo que en español con «lápiz → lápices».",
      },
      {
        t: "p",
        text: "Para un hispanohablante lo más difícil no es el tercer caso, sino el segundo: la -s que ZUMBA. En español la ese nunca vibra, así que decimos «dogs» con la ese española. No es un error grave y se te entiende, pero es una de las cosas que más marcan el acento extranjero. Practicarlo es fácil: alarga la ese de «dogs» hasta que notes el cosquilleo.",
      },
      {
        t: "examples",
        items: [
          { en: "The books are on the table.", pron: "de buks ar on de téi-bol", es: "Los libros están en la mesa." },
          { en: "My dogs love the park.", pron: "mai dogs lav de park", es: "A mis perros les encanta el parque." },
          { en: "She watches the news.", pron: "shi uó-chis de niús", es: "Ve las noticias." },
          { en: "There are two buses.", pron: "der ar tuu bá-sis", es: "Hay dos autobuses." },
          { en: "He always changes his mind.", pron: "ji ól-ueis chéin-yis jis máind", es: "Siempre cambia de opinión." },
          { en: "The cats are sleeping.", pron: "de kats ar slíi-ping", es: "Los gatos están durmiendo." },
        ],
      },
    ],
    quiz: [
      { q: "¿Cuántas maneras hay de pronunciar la -s final?", options: ["Una", "Dos", "Tres"], answer: 2, why: "/s/, /z/ y /ɪz/, según el sonido que va antes." },
      { q: "En «books» la -s suena…", options: ["como la ese española", "zumbando (/z/)", "como una sílaba aparte"], answer: 0, why: "Tras un sonido sordo (k), la -s es sorda." },
      { q: "En «dogs» la -s suena…", options: ["como la ese española", "zumbando (/z/)", "como una sílaba aparte"], answer: 1, why: "Tras un sonido sonoro (g), la -s vibra." },
      { q: "«Watches» tiene…", options: ["una sílaba", "dos sílabas", "tres sílabas"], answer: 1, why: "uó-chis: tras un silbante, la -s añade sílaba." },
      { q: "¿Tras qué sonidos la -s añade una sílaba entera?", options: ["p, t, k", "s, sh, ch, x, ge", "vocales"], answer: 1, why: "Los silbantes necesitan una vocal para poder pegar la -s." },
      { q: "«Buses» se pronuncia…", options: ["bass", "bá-sis", "biu-ses"], answer: 1, why: "Dos sílabas: bá-sis." },
      { q: "El truco para saber si zumba es…", options: ["contar las letras", "poner la mano en la garganta", "mirar si es plural"], answer: 1, why: "Si la letra anterior vibra, la -s vibra." },
      { q: "Esta regla es la misma que la de…", options: ["la -ed del pasado", "la -ing", "los artículos"], answer: 0, why: "Sordo/sonoro/silbante: idéntico mecanismo." },
      { q: "Lo que más marca el acento español aquí es…", options: ["no añadir la sílaba", "no hacer zumbar la -s", "pronunciarla muy fuerte"], answer: 1, why: "En español la ese nunca vibra, y se nota." },
      { q: "«Boxes» tiene…", options: ["una sílaba", "dos sílabas", "tres sílabas"], answer: 1, why: "bók-sis: la x es silbante." },
      { q: "«Cats» y «dogs» se pronuncian…", options: ["las dos con ese española", "cats con /s/ y dogs con /z/", "las dos zumbando"], answer: 1, why: "La t es sorda y la g es sonora." },
    ],
  },

  {
    id: "vocales-parecidas",
    title: "sheep o ship: las vocales que confundes",
    tag: "Pronunciación",
    goal: "Distinguir las parejas de vocales que en español son una sola.",
    blocks: [
      {
        t: "p",
        text: "El español tiene cinco vocales y el inglés tiene el doble. Eso significa que hay parejas de sonidos ingleses que a tu oído le llegan como una sola vocal española, y por eso confundes palabras que para un nativo no se parecen en nada. No es que oigas mal: es que tu idioma nunca te pidió distinguirlos.",
      },
      {
        t: "table",
        head: ["Pareja", "Corta", "Larga", "En esta app"],
        rows: [
          ["i", "ship (barco)", "sheep (oveja)", "ship / shiip"],
          ["i", "sit (sentarse)", "seat (asiento)", "sit / siit"],
          ["i", "live (vivir)", "leave (irse)", "liv / liiv"],
          ["u", "full (lleno)", "fool (tonto)", "ful / fuul"],
          ["a", "cat (gato)", "cut (cortar)", "kat / kat"],
        ],
      },
      {
        t: "p",
        text: "La primera pareja es la famosa, y la diferencia no es solo de duración aunque lo parezca. La corta (ship) se dice con la boca más relajada y el sonido tira ligeramente hacia la «e» española. La larga (sheep) es una i tensa y estirada, como cuando dices «sííí». Si solo alargas la i española, se entiende, pero el contraste no queda claro.",
      },
      {
        t: "tip",
        text: "Truco práctico: para la corta, relaja la mandíbula y piensa en una i que se acerca a la e — algo entre «ship» y «shep». Para la larga, sonríe y tensa. Suena exagerado al principio, y precisamente por eso funciona: los hispanohablantes tendemos a quedarnos en el punto medio, que es donde no se distingue nada.",
      },
      {
        t: "p",
        text: "La última fila de la tabla es la que peor se lleva esta notación, y conviene decirlo claro: «cat» y «cut» se escriben los dos «kat» en esta app, porque el español no tiene ninguna letra para el sonido de «cat». Es una a más abierta, dicha con la boca ancha, tirando a «e». En «cut» es la a española normal.",
      },
      {
        t: "table",
        head: ["Palabra", "Cómo se escribe aquí", "Cómo suena de verdad"],
        rows: [
          ["cat", "kat", "a muy abierta, tirando a «e»"],
          ["cut", "kat", "a española normal"],
          ["bad", "bad", "a muy abierta, tirando a «e»"],
          ["bed", "bed", "e española normal"],
          ["man", "man", "a muy abierta"],
          ["men", "men", "e española normal"],
        ],
      },
      {
        t: "error",
        wrong: "Decir «I want a sheet of paper» con la i corta.",
        right: "Alarga la i: shiit, no «shit».",
        why: "Es el ejemplo que se pone siempre porque el malentendido es real y muy incómodo. Lo mismo pasa con «beach» y «sheet»: si acortas la i, dices otra palabra bastante distinta.",
      },
      {
        t: "p",
        text: "No hace falta dominar esto para que te entiendan — el contexto salva casi todo. Pero saber que la distinción EXISTE ya cambia cómo escuchas: a partir de ahora las vas a oír, y oírlas es el primer paso para decirlas.",
      },
      {
        t: "examples",
        items: [
          { en: "The ship is big.", pron: "de ship is big", es: "El barco es grande." },
          { en: "The sheep is white.", pron: "de shiip is uáit", es: "La oveja es blanca." },
          { en: "Please sit on this seat.", pron: "pliis sit on dis siit", es: "Siéntate en este asiento, por favor." },
          { en: "I live here, I won't leave.", pron: "ai liv jier, ai uóunt liiv", es: "Vivo aquí, no me voy a ir." },
          { en: "The glass is full.", pron: "de glas is ful", es: "El vaso está lleno." },
          { en: "I need a sheet of paper.", pron: "ai niid a shiit ov péi-per", es: "Necesito una hoja de papel." },
        ],
      },
    ],
    quiz: [
      { q: "¿Por qué confundimos «ship» y «sheep»?", options: ["Porque se escriben parecido", "Porque el español tiene una sola i y el inglés dos", "Porque son sinónimos"], answer: 1, why: "Tu idioma nunca te pidió distinguir esos dos sonidos." },
      { q: "«Sheep» (oveja) lleva la i…", options: ["corta y relajada", "larga y tensa", "igual que en español"], answer: 1, why: "shiip: i estirada, como cuando dices «sííí»." },
      { q: "«Ship» (barco) lleva la i…", options: ["larga y tensa", "corta y relajada, tirando a «e»", "muda"], answer: 1, why: "Boca más relajada, sonido entre i y e." },
      { q: "«Leave» significa…", options: ["vivir", "irse", "dejar caer"], answer: 1, why: "«Live» (liv) es vivir; «leave» (liiv) es irse." },
      { q: "¿Cuántas vocales tiene el inglés frente al español?", options: ["Las mismas cinco", "Aproximadamente el doble", "Menos"], answer: 1, why: "De ahí que varias parejas suenen iguales a nuestro oído." },
      { q: "«Cat» y «cut» en esta app se escriben…", options: ["distinto", "igual, «kat», porque el español no tiene esa vocal", "no aparecen"], answer: 1, why: "La a de «cat» es más abierta y no hay letra española para ella." },
      { q: "La «a» de «cat» tira hacia…", options: ["la o", "la e", "la u"], answer: 1, why: "Es una a muy abierta, con la boca ancha, cercana a la e." },
      { q: "La «a» de «cut» es…", options: ["la a española normal", "muy abierta", "una e"], answer: 0, why: "Por eso «cut» y «cat» se escriben igual aquí pero no suenan igual." },
      { q: "El error del hispanohablante suele ser…", options: ["exagerar la diferencia", "quedarse en un punto medio donde no se distingue", "no pronunciar la vocal"], answer: 1, why: "Exagerar al principio es justo lo que ayuda." },
      { q: "«Full» y «fool» se diferencian en…", options: ["la consonante", "la duración y tensión de la u", "el acento"], answer: 1, why: "ful (corta) frente a fuul (larga)." },
      { q: "Saber que la distinción existe sirve para…", options: ["nada, si no la dices", "empezar a OÍRLA, que es el primer paso", "aprobar exámenes"], answer: 1, why: "Oírlas es lo que después te permite decirlas." },
    ],
  },

  {
    id: "letras-mudas",
    title: "Letras que no se pronuncian",
    tag: "Pronunciación",
    goal: "Dejar de pronunciar la k de «knife» y la b de «climb».",
    blocks: [
      {
        t: "p",
        text: "El inglés escribe letras que no dice. No son excepciones sueltas: son grupos con patrón, casi todos restos de cómo se pronunciaban las palabras hace siglos. Si te aprendes los grupos, dejas de fallar en decenas de palabras a la vez.",
      },
      {
        t: "table",
        head: ["Grupo", "Muda", "Ejemplos"],
        rows: [
          ["kn-", "la k", "know (nóu), knife (náif), knee, knock"],
          ["wr-", "la w", "write (ráit), wrong (rong), wrist"],
          ["-mb", "la b final", "climb (kláim), thumb, lamb, comb"],
          ["-gh", "casi siempre muda", "night (náit), light, though (dóu)"],
          ["h- inicial", "en algunas", "hour (áu-er), honest (ó-nest)"],
          ["-t- en -sten", "la t", "listen (lí-sen), castle, whistle"],
          ["ps-", "la p", "psychology, psychiatrist"],
        ],
      },
      {
        t: "p",
        text: "Ojo con la «h», porque va justo al revés de lo que espera un español. En español la h NUNCA suena; en inglés casi siempre SÍ suena (house, have, help), y solo enmudece en un puñado de palabras: hour, honest, honor, heir. Es decir, el error del hispanohablante aquí es el contrario del habitual: se come una h que sí había que decir.",
      },
      {
        t: "error",
        wrong: "«have» dicho «av» / «know» dicho «kanou» / «climb» dicho «klaimb»",
        right: "jav / nóu / kláim",
        why: "La h inglesa se pronuncia (en esta app se escribe «j»), pero la k de kn- y la b de -mb son mudas del todo.",
      },
      {
        t: "tip",
        text: "Regla práctica para la «gh»: casi nunca suena. En «night», «light», «through» o «though» no se dice nada. Solo suena, y como una F, en un grupito pequeño: «enough» (i-náf), «laugh» (laf), «cough», «tough» (taf). Si ves «gh» y no es una de esas, no la digas.",
      },
      {
        t: "table",
        head: ["Palabra", "Se escribe", "Se dice", "Letra muda"],
        rows: [
          ["knife", "k-n-i-f-e", "náif", "k y e"],
          ["write", "w-r-i-t-e", "ráit", "w y e"],
          ["climb", "c-l-i-m-b", "kláim", "b"],
          ["hour", "h-o-u-r", "áu-er", "h"],
          ["listen", "l-i-s-t-e-n", "lí-sen", "t"],
          ["island", "i-s-l-a-n-d", "ái-land", "s"],
          ["answer", "a-n-s-w-e-r", "án-ser", "w"],
          ["half", "h-a-l-f", "jaf", "l"],
        ],
      },
      {
        t: "p",
        text: "Y la más silenciosa de todas: la -e final. Casi nunca se pronuncia, pero no está de adorno — su trabajo es alargar la vocal de antes. «Hat» es «jat» y «hate» es «jéit»; «bit» es «bit» y «bite» es «báit». La e no suena, pero cambia la palabra entera.",
      },
      {
        t: "examples",
        items: [
          { en: "I know how to write.", pron: "ai nóu jáu tu ráit", es: "Sé escribir." },
          { en: "Be careful with that knife.", pron: "bi kér-ful uid dat náif", es: "Ten cuidado con ese cuchillo." },
          { en: "It took an hour and a half.", pron: "it tuk an áu-er and a jaf", es: "Llevó una hora y media." },
          { en: "Listen to the answer.", pron: "lí-sen tu di án-ser", es: "Escucha la respuesta." },
          { en: "He's an honest man.", pron: "jis an ó-nest man", es: "Es un hombre honesto." },
          { en: "That's the wrong island.", pron: "dats de rong ái-land", es: "Esa es la isla equivocada." },
        ],
      },
    ],
    quiz: [
      { q: "En «knife», ¿qué letra no suena?", options: ["la f", "la k", "la i"], answer: 1, why: "El grupo kn- siempre pierde la k: náif." },
      { q: "En «write», ¿qué letra no suena?", options: ["la w", "la r", "la t"], answer: 0, why: "El grupo wr- pierde la w: ráit." },
      { q: "En «climb», ¿qué letra no suena?", options: ["la c", "la l", "la b final"], answer: 2, why: "El grupo -mb pierde la b: kláim." },
      { q: "La «h» inglesa…", options: ["nunca suena, como en español", "casi siempre suena", "solo suena al final"], answer: 1, why: "House, have, help sí suenan; solo enmudece en hour, honest y poco más." },
      { q: "«Hour» se pronuncia…", options: ["jáu-er", "áu-er", "jor"], answer: 1, why: "Es una de las pocas con h muda." },
      { q: "El grupo «gh»…", options: ["siempre suena como g", "casi nunca suena", "siempre suena como f"], answer: 1, why: "En night, light y though no se dice nada." },
      { q: "¿En cuál suena la «gh», y como F?", options: ["night", "though", "enough"], answer: 2, why: "enough (i-náf), laugh, tough y cough." },
      { q: "En «listen», ¿qué letra no suena?", options: ["la s", "la t", "la n"], answer: 1, why: "lí-sen, sin la t. Igual que castle y whistle." },
      { q: "¿Para qué sirve la -e final muda?", options: ["Para nada, es decorativa", "Para alargar la vocal de antes", "Para marcar el plural"], answer: 1, why: "hat/hate, bit/bite: la e no suena pero cambia la vocal." },
      { q: "El error típico del español con la h es…", options: ["pronunciarla cuando no toca", "comérsela cuando sí hay que decirla", "cambiarla por f"], answer: 1, why: "Como en español es muda, decimos «av» en vez de «jav»." },
      { q: "En «answer», ¿qué letra no suena?", options: ["la w", "la s", "la r"], answer: 0, why: "án-ser, sin la w." },
    ],
  },


];

export const getLesson = (id) => LESSONS.find((l) => l.id === id);
