/**
 * Parte una pronunciación figurada en sílabas.
 *
 * Como está escrita en ortografía española, valen las reglas españolas de
 * separación, que son deterministas. Lo único propio del sistema de la app es
 * que las vocales dobles (ii, uu) marcan vocal larga, no hiato: «zruu» es una
 * sílaba, no dos.
 *
 * Vive dentro de la app, y no solo en el script que preparó los datos, porque
 * hay pronunciaciones que llegan después: las palabras que genera la IA y las
 * que ya tenías guardadas de antes. Sin esto, en Hoy y en Palabras seguirían
 * saliendo de una pieza mientras en Explorar salían partidas.
 */

const ACENTOS = { á: "a", é: "e", í: "i", ó: "o", ú: "u" };
const base = (c) => ACENTOS[c] || c;
const VOCALES = "aeiou";
const FUERTES = "aeo";
const esVocal = (c) => VOCALES.includes(base(c));
const esFuerte = (c) => FUERTES.includes(base(c));
const tildada = (c) => c in ACENTOS;

// No se separan nunca: dígrafos y grupos consonante + líquida.
const DIGRAFOS = ["ch", "sh", "ll", "rr", "qu", "gu"];
const LIQUIDAS = ["pr", "br", "tr", "dr", "kr", "gr", "fr", "pl", "bl", "kl", "gl", "fl", "cr", "cl"];
const INSEPARABLE = new Set([...DIGRAFOS, ...LIQUIDAS]);

/**
 * ¿Estas dos vocales van en la misma sílaba?
 *  - vocal doble (ii, uu, aa): en este sistema es una vocal larga, no hiato
 *  - diptongo: si al menos una es débil (i, u) y no lleva tilde
 *  - hiato: dos fuertes juntas (a-e-o), o débil tildada → sílabas distintas
 */
function mismaSilaba(a, b) {
  if (base(a) === base(b)) return true; // ii, uu: vocal larga
  if (esFuerte(a) && esFuerte(b)) return false; // hiato
  const debil = esFuerte(a) ? b : a;
  return !tildada(debil);
}

export function silabas(pron) {
  if (!pron) return [];
  const letras = [...pron];
  // 1. Núcleos: grupos de vocales que van juntas.
  //
  // Un núcleo no puede llevar DOS vocales fuertes. En «jauéver» (however) la
  // a y la u forman diptongo, pero la é ya abre sílaba: jau-é-ver, no jaué-ver.
  // Sin este tope salían palabras con una sílaba de menos.
  const nucleos = [];
  for (let i = 0; i < letras.length; i++) {
    if (!esVocal(letras[i])) continue;
    const inicio = i;
    let fuertes = esFuerte(letras[i]) ? 1 : 0;
    while (
      i + 1 < letras.length &&
      esVocal(letras[i + 1]) &&
      mismaSilaba(letras[i], letras[i + 1]) &&
      !(esFuerte(letras[i + 1]) && fuertes >= 1 && base(letras[i]) !== base(letras[i + 1]))
    ) {
      i++;
      if (esFuerte(letras[i])) fuertes += 1;
    }
    nucleos.push([inicio, i]);
  }
  if (nucleos.length <= 1) return [pron];

  // 2. Entre dos núcleos, se decide dónde cae el corte según las consonantes
  const cortes = [];
  for (let n = 0; n < nucleos.length - 1; n++) {
    const desde = nucleos[n][1] + 1;
    const hasta = nucleos[n + 1][0];
    const cons = pron.slice(desde, hasta);

    let corte;
    if (cons.length === 0) corte = hasta; // dos núcleos pegados (hiato)
    else if (cons.length === 1) corte = desde; // V-CV
    else if (cons.length === 2) {
      // VC-CV, salvo dígrafo o consonante + líquida, que van enteros a la 2ª
      corte = INSEPARABLE.has(cons.toLowerCase()) ? desde : desde + 1;
    } else {
      // Tres o más: las dos últimas se van juntas si forman grupo inseparable
      const ultimas = cons.slice(-2).toLowerCase();
      corte = INSEPARABLE.has(ultimas) ? hasta - 2 : hasta - 1;
    }
    cortes.push(corte);
  }

  const trozos = [];
  let desde = 0;
  for (const c of cortes) {
    trozos.push(pron.slice(desde, c));
    desde = c;
  }
  trozos.push(pron.slice(desde));
  return arreglarGlide(trozos.filter(Boolean));
}

/**
 * En este sistema la u delante de vocal es la W inglesa, no una vocal.
 *
 * La regla española V-CV le regalaba la consonante a la sílaba siguiente:
 * «overwhelmed» salía «ou-ve-ruélmd» en vez de «ou-ver-uélmd». Y en inglés la
 * W solo se pega a la consonante anterior en tw, kw, sw, dw y gw (twin, quick,
 * sweet, dwell). Con r, m, l, n, p, b, f, v y demás, la consonante se queda
 * donde estaba: home-work, some-one, other-wise.
 */
const ADMITEN_W = "tksdg";
function arreglarGlide(trozos) {
  for (let n = 1; n < trozos.length; n++) {
    const s = trozos[n];
    // La sílaba empieza por consonante + u + vocal
    const m = s.match(/^([a-zñ])u(?=[aeiouáéíóú])/i);
    if (!m) continue;
    const cons = m[1].toLowerCase();
    if (ADMITEN_W.includes(cons)) continue; // tuíin, kuáier, suéter: se quedan
    // «gu» ante e/i es el dígrafo español (guiv, guet): tampoco se toca
    if (cons === "g" && /^gu[eiéí]/i.test(s)) continue;
    trozos[n - 1] += m[1];
    trozos[n] = s.slice(1);
  }
  return trozos;
}

/**
 * Guiones entre sílabas, espacios entre palabras.
 *
 * En «a lot of» los espacios separan palabras y NO pueden volverse guiones:
 * cada palabra se silabea por su cuenta y se vuelven a unir con el espacio.
 */
/**
 * Compuestos: la costura no se ve en las letras.
 *
 * «password» es pass+word, así que la s se queda con «pas» aunque «sw» sea un
 * grupo válido en inglés (sweet, swim). «throughout» es through+out, y la u y
 * la a no son diptongo. Estos hay que decirlos a mano.
 */
const COMPUESTOS = {
  pásuerd: "pás-uerd",
  zruáut: "zru-áut",
};

export const conGuiones = (pron) =>
  String(pron)
    .split(/\s+/)
    .map((palabra) => {
      const compuesto = COMPUESTOS[palabra.replace(/-/g, "")];
      if (compuesto) return compuesto;
      return conGuionesPalabra(palabra);
    })
    .join(" ");

function conGuionesPalabra(palabra) {
  // Se quitan los guiones que ya hubiera: si no, al pasar el script dos veces
  // salían dobles (uó-rer → uó--rer), porque el guion no es vocal y el
  // silabeador lo trataba como una consonante más.
  const limpia = palabra.replace(/-/g, "");
  // Lo que no son letras (— , . !) se deja tal cual: no son sílabas.
  if (!/[a-záéíóúñ]/i.test(limpia)) return palabra;
  // La puntuación pegada (comas, puntos) no entra en el silabeo.
  const m = limpia.match(/^([^a-záéíóúñ]*)(.*?)([^a-záéíóúñ]*)$/i);
  return m[1] + silabas(m[2]).join("-") + m[3];
}
