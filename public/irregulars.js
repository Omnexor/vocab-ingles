/**
 * Verbos irregulares.
 *
 * Sirven para dos cosas:
 *  - Buscar palabras en las lecturas. Los textos llevan "went", "told",
 *    "understood"… y son justo los verbos más frecuentes, así que sin esto
 *    media lectura queda sin encontrar.
 *  - El juego de irregulares, que es el hueso clásico del que aprende inglés.
 *
 * pron lleva las tres formas separadas por " · ", en el mismo orden.
 */
export const IRREGULARES = [
  { base: "be", pasado: "was/were", participio: "been", es: "ser / estar", pron: "bi · uós/uér · bin" },
  { base: "become", pasado: "became", participio: "become", es: "convertirse en", pron: "bikám · bikéim · bikám" },
  { base: "begin", pasado: "began", participio: "begun", es: "empezar", pron: "biguín · bigán · bigán" },
  { base: "bite", pasado: "bit", participio: "bitten", es: "morder", pron: "báit · bit · bíten" },
  { base: "blow", pasado: "blew", participio: "blown", es: "soplar", pron: "blóu · bluu · blóun" },
  { base: "break", pasado: "broke", participio: "broken", es: "romper", pron: "bréik · bróuk · bróuken" },
  { base: "bring", pasado: "brought", participio: "brought", es: "traer", pron: "bring · brot · brot" },
  { base: "build", pasado: "built", participio: "built", es: "construir", pron: "bild · bilt · bilt" },
  { base: "burn", pasado: "burnt", participio: "burnt", es: "quemar", pron: "bern · bernt · bernt" },
  { base: "buy", pasado: "bought", participio: "bought", es: "comprar", pron: "bái · bot · bot" },
  { base: "catch", pasado: "caught", participio: "caught", es: "coger / atrapar", pron: "kach · kot · kot" },
  { base: "choose", pasado: "chose", participio: "chosen", es: "elegir", pron: "chuus · chóus · chóusen" },
  { base: "come", pasado: "came", participio: "come", es: "venir", pron: "kam · kéim · kam" },
  { base: "cost", pasado: "cost", participio: "cost", es: "costar", pron: "kost · kost · kost" },
  { base: "cut", pasado: "cut", participio: "cut", es: "cortar", pron: "kat · kat · kat" },
  { base: "deal", pasado: "dealt", participio: "dealt", es: "tratar / lidiar", pron: "diil · delt · delt" },
  { base: "dig", pasado: "dug", participio: "dug", es: "cavar", pron: "dig · dag · dag" },
  { base: "do", pasado: "did", participio: "done", es: "hacer", pron: "du · did · dan" },
  { base: "draw", pasado: "drew", participio: "drawn", es: "dibujar", pron: "dro · druu · dron" },
  { base: "drink", pasado: "drank", participio: "drunk", es: "beber", pron: "drink · drank · drank" },
  { base: "drive", pasado: "drove", participio: "driven", es: "conducir", pron: "dráiv · dróuv · dríven" },
  { base: "eat", pasado: "ate", participio: "eaten", es: "comer", pron: "iit · éit · íiten" },
  { base: "fall", pasado: "fell", participio: "fallen", es: "caer", pron: "fol · fel · fólen" },
  { base: "feed", pasado: "fed", participio: "fed", es: "alimentar", pron: "fiid · fed · fed" },
  { base: "feel", pasado: "felt", participio: "felt", es: "sentir", pron: "fiil · felt · felt" },
  { base: "fight", pasado: "fought", participio: "fought", es: "pelear", pron: "fáit · fot · fot" },
  { base: "find", pasado: "found", participio: "found", es: "encontrar", pron: "fáind · fáund · fáund" },
  { base: "fly", pasado: "flew", participio: "flown", es: "volar", pron: "flái · fluu · flóun" },
  { base: "forget", pasado: "forgot", participio: "forgotten", es: "olvidar", pron: "forguét · forgót · forgóten" },
  { base: "forgive", pasado: "forgave", participio: "forgiven", es: "perdonar", pron: "forguív · forguéiv · forguíven" },
  { base: "freeze", pasado: "froze", participio: "frozen", es: "congelar", pron: "friis · fróus · fróusen" },
  { base: "get", pasado: "got", participio: "gotten", es: "conseguir", pron: "guet · got · góten" },
  { base: "give", pasado: "gave", participio: "given", es: "dar", pron: "guiv · guéiv · guíven" },
  { base: "go", pasado: "went", participio: "gone", es: "ir", pron: "góu · uent · gon" },
  { base: "grow", pasado: "grew", participio: "grown", es: "crecer", pron: "gróu · gruu · gróun" },
  { base: "hang", pasado: "hung", participio: "hung", es: "colgar", pron: "jang · jang · jang" },
  { base: "have", pasado: "had", participio: "had", es: "tener", pron: "jav · jad · jad" },
  { base: "hear", pasado: "heard", participio: "heard", es: "oír", pron: "jíer · jerd · jerd" },
  { base: "hide", pasado: "hid", participio: "hidden", es: "esconder", pron: "jáid · jid · jíden" },
  { base: "hit", pasado: "hit", participio: "hit", es: "golpear", pron: "jit · jit · jit" },
  { base: "hold", pasado: "held", participio: "held", es: "sostener", pron: "jóuld · jeld · jeld" },
  { base: "hurt", pasado: "hurt", participio: "hurt", es: "doler / herir", pron: "jert · jert · jert" },
  { base: "keep", pasado: "kept", participio: "kept", es: "guardar", pron: "kiip · kept · kept" },
  { base: "know", pasado: "knew", participio: "known", es: "saber", pron: "nóu · niú · nóun" },
  { base: "lay", pasado: "laid", participio: "laid", es: "colocar", pron: "léi · léid · léid" },
  { base: "lead", pasado: "led", participio: "led", es: "liderar", pron: "liid · led · led" },
  { base: "learn", pasado: "learnt", participio: "learnt", es: "aprender", pron: "lern · lernt · lernt" },
  { base: "leave", pasado: "left", participio: "left", es: "irse / dejar", pron: "liiv · left · left" },
  { base: "lend", pasado: "lent", participio: "lent", es: "prestar", pron: "lend · lent · lent" },
  { base: "let", pasado: "let", participio: "let", es: "dejar", pron: "let · let · let" },
  { base: "lie", pasado: "lay", participio: "lain", es: "tumbarse", pron: "lái · léi · léin" },
  { base: "light", pasado: "lit", participio: "lit", es: "encender", pron: "láit · lit · lit" },
  { base: "lose", pasado: "lost", participio: "lost", es: "perder", pron: "luus · lost · lost" },
  { base: "make", pasado: "made", participio: "made", es: "hacer", pron: "méik · méid · méid" },
  { base: "mean", pasado: "meant", participio: "meant", es: "significar", pron: "miin · ment · ment" },
  { base: "meet", pasado: "met", participio: "met", es: "conocer / quedar", pron: "miit · met · met" },
  { base: "pay", pasado: "paid", participio: "paid", es: "pagar", pron: "péi · péid · péid" },
  { base: "put", pasado: "put", participio: "put", es: "poner", pron: "put · put · put" },
  { base: "quit", pasado: "quit", participio: "quit", es: "dejar (algo)", pron: "kuit · kuit · kuit" },
  { base: "read", pasado: "read", participio: "read", es: "leer", pron: "riid · red · red" },
  { base: "ride", pasado: "rode", participio: "ridden", es: "montar", pron: "ráid · róud · ríden" },
  { base: "ring", pasado: "rang", participio: "rung", es: "sonar / llamar", pron: "ring · rang · rang" },
  { base: "rise", pasado: "rose", participio: "risen", es: "subir", pron: "ráis · róus · rísen" },
  { base: "run", pasado: "ran", participio: "run", es: "correr", pron: "ran · ran · ran" },
  { base: "say", pasado: "said", participio: "said", es: "decir", pron: "séi · sed · sed" },
  { base: "see", pasado: "saw", participio: "seen", es: "ver", pron: "sii · so · siin" },
  { base: "seek", pasado: "sought", participio: "sought", es: "buscar", pron: "siik · sot · sot" },
  { base: "sell", pasado: "sold", participio: "sold", es: "vender", pron: "sel · sóuld · sóuld" },
  { base: "send", pasado: "sent", participio: "sent", es: "enviar", pron: "send · sent · sent" },
  { base: "set", pasado: "set", participio: "set", es: "fijar / poner", pron: "set · set · set" },
  { base: "shake", pasado: "shook", participio: "shaken", es: "agitar", pron: "shéik · shuk · shéiken" },
  { base: "shine", pasado: "shone", participio: "shone", es: "brillar", pron: "sháin · shon · shon" },
  { base: "shoot", pasado: "shot", participio: "shot", es: "disparar", pron: "shuut · shot · shot" },
  { base: "show", pasado: "showed", participio: "shown", es: "mostrar", pron: "shóu · shóud · shóun" },
  { base: "shut", pasado: "shut", participio: "shut", es: "cerrar", pron: "shat · shat · shat" },
  { base: "sing", pasado: "sang", participio: "sung", es: "cantar", pron: "sing · sang · sang" },
  { base: "sit", pasado: "sat", participio: "sat", es: "sentarse", pron: "sit · sat · sat" },
  { base: "sleep", pasado: "slept", participio: "slept", es: "dormir", pron: "sliip · slept · slept" },
  { base: "speak", pasado: "spoke", participio: "spoken", es: "hablar", pron: "spiik · spóuk · spóuken" },
  { base: "spend", pasado: "spent", participio: "spent", es: "gastar / pasar", pron: "spend · spent · spent" },
  { base: "stand", pasado: "stood", participio: "stood", es: "estar de pie", pron: "stand · stud · stud" },
  { base: "steal", pasado: "stole", participio: "stolen", es: "robar", pron: "stiil · stóul · stóulen" },
  { base: "stick", pasado: "stuck", participio: "stuck", es: "pegar / atascarse", pron: "stik · stak · stak" },
  { base: "strike", pasado: "struck", participio: "struck", es: "golpear", pron: "stráik · strak · strak" },
  { base: "swim", pasado: "swam", participio: "swum", es: "nadar", pron: "suim · suam · suam" },
  { base: "take", pasado: "took", participio: "taken", es: "coger / tomar", pron: "téik · tuk · téiken" },
  { base: "teach", pasado: "taught", participio: "taught", es: "enseñar", pron: "tiich · tot · tot" },
  { base: "tear", pasado: "tore", participio: "torn", es: "rasgar", pron: "ter · tor · torn" },
  { base: "tell", pasado: "told", participio: "told", es: "contar / decir", pron: "tel · tóuld · tóuld" },
  { base: "think", pasado: "thought", participio: "thought", es: "pensar", pron: "zink · zot · zot" },
  { base: "throw", pasado: "threw", participio: "thrown", es: "lanzar", pron: "zróu · zruu · zróun" },
  { base: "understand", pasado: "understood", participio: "understood", es: "entender", pron: "anderstánd · anderstúd · anderstúd" },
  { base: "wake", pasado: "woke", participio: "woken", es: "despertarse", pron: "uéik · uóuk · uóuken" },
  { base: "wear", pasado: "wore", participio: "worn", es: "llevar puesto", pron: "uer · uor · uorn" },
  { base: "win", pasado: "won", participio: "won", es: "ganar", pron: "uin · uan · uan" },
  { base: "write", pasado: "wrote", participio: "written", es: "escribir", pron: "ráit · róut · ríten" },
];

/** Cualquier forma ("went", "gone", "go") → el infinitivo. */
export const FORMA_A_BASE = (() => {
  const m = new Map();
  for (const v of IRREGULARES) {
    m.set(v.base, v.base);
    for (const f of [v.pasado, v.participio]) {
      for (const parte of String(f).split("/")) m.set(parte.trim(), v.base);
    }
  }
  // Formas de 'be' y auxiliares que no salen del patrón base/pasado/participio.
  for (const [f, b] of [
    ["am", "be"], ["is", "be"], ["are", "be"], ["being", "be"],
    ["has", "have"], ["having", "have"], ["does", "do"], ["doing", "do"],
    ["gone", "go"], ["going", "go"], ["got", "get"],
  ]) m.set(f, b);

  // Plurales irregulares: quitar la -s no lleva a ningún sitio con estos.
  for (const [f, b] of [
    ["children", "child"], ["men", "man"], ["women", "woman"],
    ["feet", "foot"], ["teeth", "tooth"], ["mice", "mouse"],
    ["geese", "goose"], ["lives", "life"], ["knives", "knife"],
    ["wives", "wife"], ["leaves", "leaf"], ["shelves", "shelf"],
    ["people", "person"],
  ]) m.set(f, b);
  return m;
})();

/** Contracciones que no salen de quitar lo que va tras el apóstrofo. */
export const CONTRACCIONES = {
  "won't": "will",
  "can't": "can",
  "cannot": "can",
  "shan't": "shall",
  "ain't": "be",
  "let's": "let",
};
