# Vocab — inglés cada día

App web para aprender vocabulario en inglés. Cada palabra se muestra con:

- la palabra **en inglés**
- la **traducción** al español
- la **pronunciación escrita en español** (`though` → `dóu`, `enough` → `ináf`)
- una frase de ejemplo con su traducción y botón de audio

Incluye repaso espaciado, modo tarjetas, racha de días y progreso. Todo se guarda
en el navegador (`localStorage`), no hay cuentas ni base de datos.

Y una sección de **lecciones de gramática** en español: cómo se ordena una frase,
presente, pasado, futuro, verbos modales, condicionales y preguntas — cada una con
teoría, tablas, errores típicos de hispanohablantes y ejercicios tipo test.

## Cómo funciona

- `public/` — la app (HTML + CSS + JS, sin build ni dependencias en el navegador).
- `api/generate.js` — función serverless que llama a la API de Claude para generar
  palabras nuevas según tu nivel, evitando las que ya conoces. **La API key vive
  solo en el servidor**, nunca llega al navegador.
- `api/practice.js` — genera ejercicios nuevos sobre una lección concreta.
- `public/seed.js` — 56 palabras de arranque. Si la API falla o aún no has puesto
  la key, la app sigue funcionando con esta lista.
- `scripts/generar-vocabulario.mjs` — genera un banco de hasta 3000 palabras en
  `public/vocabulario.json`. Ver más abajo.
- `public/lessons.js` — el curso de gramática. Contenido fijo, escrito a mano: no
  depende de la API, funciona siempre y sin coste.

## Las lecciones

17 lecciones, 85 ejercicios base. Una lección se marca como superada al acertar
el 80% o más; el botón **Ejercicios nuevos** pide a Claude cinco ejercicios
distintos sobre esa misma lección, con opciones incorrectas que son errores
reales de hispanohablantes.

| # | Lección | Cubre |
| --- | --- | --- |
| 1 | Cómo leer las pronunciaciones | el código de sonidos, th sorda vs sonora, la h muda |
| 2 | Cómo se ordena una frase | S+V+O, auxiliares, el sujeto obligatorio |
| 3 | Presente simple | rutinas, la -s de tercera persona, do/does |
| 4 | Presente continuo | am/is/are + -ing, verbos de estado |
| 5 | Pasado simple | -ed, irregulares frecuentes, did/didn't |
| 6 | Pasado continuo | was/were + -ing, while vs when |
| 7 | Present perfect | have/has + participio, for/since, vs pasado simple |
| 8 | Futuro | will vs going to vs presente continuo |
| 9 | Verbos modales | can, could, must, have to, should, may, might, would |
| 10 | Condicionales | tipos 0, 1, 2 y 3 |
| 11 | Preguntas | WH-, orden del auxiliar, respuestas cortas |
| 12 | Comparativos y superlativos | taller vs more expensive, better/best, as…as |
| 13 | Plurales e incontables | -ies, -ves, children/people, «informations» no existe |
| 14 | Adjetivos -ed / -ing | bored vs boring |
| 15 | Prefijos y sufijos | -er, -ly, -ness, -ful, -less, un-, im-, dis-, re- |
| 16 | Adjetivos: posición y orden | van delante, nunca en plural, el orden fijo |
| 17 | Artículos | a/an/the y cuándo no se pone ninguno |

## El banco de 3000 palabras

La lista incluida son 56 palabras: suficiente para probar, corta para el uso diario.
Para tener miles disponibles sin conexión, genéralas una vez:

```bash
npm run vocabulario            # 3000 palabras (~20-40 min)
npm run vocabulario -- 500     # o las que quieras
npm run vocabulario -- 3000 --reanudar   # si se cortó, sigue donde iba
```

Necesita tu `ANTHROPIC_API_KEY` en `.env.local`. Va guardando por lotes en
`public/vocabulario.json`, así que puedes cortarlo cuando quieras y reanudar.
Se reparten por frecuencia real de uso: 28% sustantivos, 20% verbos, 15%
adjetivos, 10% phrasal verbs, 8% expresiones, 7% adverbios, 5% conectores, 4%
preposiciones y 3% pronombres.

Cuando el archivo existe, la app lo carga al arrancar y lo usa para las palabras
del día y para los juegos, **sin gastar API en el uso diario**. Si lo subes a
Vercel, viaja con el despliegue.

No están escritas a mano a propósito: la pronunciación es justo donde se cuelan
los errores, y el generador lleva las reglas de lectura española ya corregidas.

## Cuántas palabras al día

En la pantalla Hoy hay un control **«Hoy quiero N palabras nuevas»** con − y +,
de 1 a 50. En Ajustes está el mismo valor como deslizador. Con 5 al día son unas
1.800 palabras en un año.

## Los juegos

Cuatro, todos jugables sin conexión con la IA. Fallar una palabra en cualquiera
de ellos la devuelve automáticamente a la cola de repaso.

| Juego | Qué hace |
| --- | --- |
| ⚡ Respuesta rápida | 60 segundos: te da la traducción, eliges la palabra entre cuatro |
| 🎯 Completa la frase | una frase real con un hueco y tres opciones |
| ✍️ Escríbela | escuchas el audio y la escribes; acepta mayúsculas y espacios de más |
| 🔗 Emparejar | seis parejas inglés–español contra el reloj, guarda tu mejor tiempo |

### El botón «No lo sé»

Con tres o cuatro opciones aciertas una de cada tres por puro azar, y la app se
lo creería: contaría como sabida y dejaría de preguntártela. Por eso todos los
ejercicios con opciones (y los tests de las lecciones) llevan un **🤷 No lo sé**,
o la tecla <kbd>0</kbd>.

Al pulsarlo: no cuenta como acierto ni como fallo, te enseña la respuesta buena
con su pronunciación, y **devuelve la palabra a la cola de repaso de hoy**. El
resumen final separa las tres cosas — «7 aciertos · 2 fallos · 1 sin saber» —
para que el número signifique algo.

## Arrancarla

**Doble clic en `ARRANCAR.bat`.** Comprueba que tengas Node, instala las
dependencias la primera vez y abre el navegador solo. Nada más.

Desde terminal es equivalente:

```bash
npm install
npm run dev      # http://localhost:3000
```

`dev-server.mjs` sirve `public/` y ejecuta las funciones de `api/` igual que hace
Vercel en producción, pero sin necesitar la CLI de Vercel ni iniciar sesión.
(`npm run dev:vercel` usa la CLI de verdad, si algún día quieres comprobar el
comportamiento exacto de producción.)

Para activar las palabras generadas con IA: copia `.env.example` a `.env.local`
y pon dentro tu `ANTHROPIC_API_KEY`. Sin key la app arranca igual, con la lista
local de 56 palabras, los juegos y las 17 lecciones — y te lo avisa tanto en
la ventana negra como dentro de la app.

> Abrir `public/index.html` con doble clic **no** funciona: los módulos JS
> necesitan servirse por HTTP.

## Publicarla

1. Sube la carpeta a un repo de GitHub (organización Omnexor).
2. Conéctalo a Vercel — detecta `public/` y `api/` automáticamente, sin configuración.
3. En Vercel → Settings → Environment Variables, añade `ANTHROPIC_API_KEY`.
4. En el móvil: abrir la URL → "Añadir a pantalla de inicio" y queda como una app.

Despliegue manual: `npm run deploy`.

## Coste

Cada generación de palabras es una petición pequeña a `claude-opus-5` con
`effort: "low"`. Con 5 palabras al día son céntimos al mes.

## Ajustes

- **Nivel**: básico (A1–A2), intermedio (B1–B2) o avanzado (C1–C2). Cambia el tipo
  de vocabulario que pide a Claude. Se aplica a partir del día siguiente.
- **Tipo de palabra**: verbos, phrasal verbs, sustantivos, adjetivos, conectores,
  adverbios, expresiones, preposiciones, pronombres o un poco de todo. Se elige
  con los chips de la pantalla Hoy y las palabras nuevas llegan al instante.
- **Tema** (opcional): "viajes", "reuniones de trabajo"… se combina con el tipo.
  Para pedir palabras sin esperar a mañana, pulsa **+ Más palabras**.
- **Palabras al día**: de 1 a 50, con el deslizador o con los botones − / + de la
  pantalla Hoy.
- **Exportar copia**: descarga un `.json` con todas tus palabras y tu progreso.

## Estilo de la pronunciación

Sin símbolos fonéticos: se escribe tal como lo leería **un español de España**,
con tilde en la sílaba tónica. La primera lección de la app explica el código
entero; el resumen:

| Sonido | Se escribe | Ejemplo |
| --- | --- | --- |
| th de *think* (sorda) | **z** (la z española suena así) | worth → *uérz* |
| th de *this* (sonora) | **d** | although → *oldóu*, therefore → *dérfor* |
| h de *have* | **j** suave (la h española es muda) | have → *jav* |
| w de *we* | **u** | what → *uót* |
| /ʌ/ de *cup* | **a** | result → *risált* |
| vocal larga | letra repetida | see → *sii* |

La pestaña **Mis palabras** lo muestra en tabla de tres columnas: Inglés /
Pronunciación / Significado.

## Repaso espaciado

Cada palabra tiene una "caja". Al acertar sube y tarda más en volver:
mismo día → 1 → 3 → 7 → 16 → 35 → 90 días. "Fácil" salta dos cajas.
"Otra vez" la devuelve al principio y reaparece en la misma sesión.
