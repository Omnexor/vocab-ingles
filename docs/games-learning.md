# Juegos: revisión orientada al aprendizaje

## Problemas encontrados y cambios

- **Errores que desaparecían.** Irregulares, modales y frases solo los mostraban al acabar. Ahora todos los juegos guardan sus errores al responder, también los aciertos que requirieron pistas. Salir o recargar no elimina esos pendientes.
- **Promesa de repaso incorrecta.** El resumen afirmaba que todo estaba en la cola de vocabulario, aunque existe un cupo de altas. La nueva cola `gameReview` es independiente de ese cupo y permite recuperar los errores por escrito.
- **Velocidad antes que comprensión.** Respuesta rápida y Emparejar empiezan sin reloj. El reto cronometrado es opcional. En Respuesta rápida, la corrección permanece hasta pulsar Continuar, incluso cuando termina el reloj.
- **Confusión entre marcador y aprendizaje.** El resultado separa respuestas independientes, respuestas con ayuda, errores y desconocidas. Las marcas anteriores se conservan; las sesiones sin reloj no compiten con sus récords cronometrados. El panel explica que reconocer, ordenar letras y pronunciar no evalúan lo mismo.
- **Ayudas invisibles.** Escuchar la palabra en Escríbela cuenta como apoyo. En Emparejar, las parejas reveladas tras un error se consideran guiadas al resolverlas.
- **Dictado injusto o demasiado permisivo.** Ya no acepta their/there o cant/can't indistintamente. La alineación de palabras señala omisiones y palabras extra sin convertir todas las siguientes en errores. Se muestra el modelo completo.
- **Opciones sin intención suficiente.** En modales se muestra la intención en español desde el principio y se equilibran/barajan las opciones. En Completa la frase se indica el sentido buscado y que se elige una forma de diccionario, evitando rechazar otra palabra solo porque también encajaba gramaticalmente.
- **Interacciones que interrumpían la corrección.** Emparejar bloquea clics durante el feedback y requiere continuar explícitamente. Se amplían los atajos Enter a los juegos, sin interceptar la escritura. Un resultado tardío del reconocedor no afecta a otra partida.

## Repaso escrito

Los errores y respuestas con ayuda se programan para el día siguiente. También se programan los tres objetivos de una misión terminada, aunque se hayan acertado. Una respuesta sin ayuda en fecha vencida avanza una etapa: espera inicial de 1 día, después 3 días, después 7 y, tras tres comprobaciones, mantenimiento cada 30 días. Un fallo o ayuda reinicia las etapas y programa mañana. Acertar antes de la fecha o repetir el mismo día no avanza. Los registros anteriores, sin etapa, empiezan en cero sin perder sus preguntas ni fechas.

Los intervalos son decisiones de producto, no una pauta óptima validada. El repaso de hoy solo incluye objetivos vencidos (hasta diez, empezando por los más antiguos); sin vencidos se permite practicar anticipadamente. Las misiones alternan dos contextos de repaso distintos del contexto final. Los juegos libres conservan su pregunta de recuperación original. Las respuestas se comparan con la expresión practicada y variantes conocidas: no se evalúa cualquier respuesta libre posible. Dictado exige la escritura del modelo, ignorando mayúsculas y puntuación no significativa.

Los errores se conservan; el orden completo de una partida libre no se restaura al recargar. Sus estadísticas se registran al terminar. Las misiones y el repaso escrito sí guardan orden, borrador, ayuda y respuesta ya evaluada; la sesión de repaso se renueva al cambiar de día. La pronunciación mediante reconocimiento de voz sigue dependiendo del navegador, dispositivo y servicio: el texto reconocido es una señal aproximada, no un diagnóstico fonético.

## Ruta inicial de misiones

Siete misiones curadas, con tres objetivos cada una: viaje, pasado irregular, modales, cafetería, falsos amigos y dos misiones auditivas (pedido en cafetería y anuncio de estación). En las cinco escritas, cada objetivo incluye un contexto inicial, un ejemplo explicado, tres opciones, recuperación escrita, contexto final y dos contextos para días posteriores: 60 contextos de evaluación/repaso. Las dos auditivas añaden 36 anuncios, con datos diferentes entre fases y 6 ejemplos explicados. El nivel A1/A2 es orientativo del contenido, no una evaluación CEFR del alumno.

1. Tres intentos iniciales sin ayudas. No se muestran modelos hasta terminar los tres.
2. Ejemplo y juego de reconocimiento. Si el objetivo ya salió en el intento inicial, se omite su elección múltiple.
3. Recuperación escrita de los tres objetivos, sin opciones. Puede pedirse modelo, registrado como ayuda.
4. Un reintento adicional por cada objetivo fallado o asistido, después de las primeras recuperaciones. No cambia la nota del primer intento.
5. Tres frases finales diferentes de las iniciales y de los ejemplos; las ayudas siguen separadas de los aciertos independientes.
6. Repasos espaciados de todos los objetivos, incluidos los acertados.

La ruta sugiere primero repasos vencidos, después una misión en curso, una misión de otro día con menos de dos de tres aciertos independientes en el contexto final, la primera no practicada o la terminada menos recientemente. Este umbral es una decisión de producto. Todas las misiones se pueden elegir sin bloqueo. Los juegos libres relacionados quedan disponibles al final y en el catálogo; sus resultados también enlazan a una misión relacionada, manteniendo los errores por delante. Esto es una ruta inicial de vocabulario, escritura y escucha acotada, **no un currículo completo de inglés ni de conversación**. La pronunciación no se valida mediante estas misiones.

### Escucha con datos variables

En las dos misiones auditivas se extraen precios, cantidades, horas, andenes y retrasos. Los anuncios contienen datos distractores (por ejemplo, hora y andén) y cambian de respuesta entre fases: memorizar un número no resuelve el siguiente anuncio. Se aceptan cifras y números en inglés; para horas también el formato 08:00 y expresiones como eight o'clock.

No se muestra el anuncio en el texto o atributos de la interfaz antes de responder, salvo si se solicita la transcripción. El navegador sintetiza la voz en inglés tras tocar Escuchar. Se necesita completar una reproducción o recurrir a una ayuda antes de registrar una respuesta correcta. La transcripción y el audio lento cuentan como ayuda, incluso en el intento inicial, y permanecen marcados tras recargar. Repetir a velocidad normal no cuenta como ayuda. Los callbacks tardíos se invalidan al cambiar de ejercicio o salir; un error, API ausente o espera de 20 segundos ofrece la transcripción. No se usa micrófono.

El repaso de estas misiones conserva la modalidad auditiva, con anuncios distintos del contexto final y la misma distinción entre escucha y lectura asistida. Las etapas son comprobaciones de extracción de datos concretos, no una medida de comprensión general. La voz disponible, su naturalidad, sus contrastes y su funcionamiento sin red dependen del dispositivo; los ejercicios y la transcripción sí quedan en caché. Las pruebas automatizadas simulan la voz y sus fallos, **no validan cómo suena en dispositivos reales**.

La navegación descarta los cambios de foco diferidos de pantallas anteriores y no devuelve el foco al título si el alumno ya escribe o eligió otro control. Una prueba reproduce explícitamente ese retraso y comprueba Enter en la misión y la escritura al cambiar de pantalla.

## Medición y límites

### Plan de repaso y rondas

El plan de repaso aparece antes de las misiones cuando hay objetivos guardados y separado de los ajustes del cronómetro. Distingue objetivos de hoy y futuros, muestra la próxima fecha y permite practicar por juego o misión. Los grupos muestran cuántos objetivos necesitan refuerzo y cuántos están en mantenimiento, sin adelantar respuestas. Una ronda contiene hasta diez objetivos; si quedan vencidos, el resultado permite continuar con los siguientes. La práctica anticipada se identifica como opcional y no avanza etapas.

El resumen diario cuenta el primer intento por objetivo de los repasos que tocaban ese día, separando respuestas independientes, asistidas y fallidas. Las prácticas anticipadas se excluyen de ese resumen. `dailyResult` conserva ese primer intento aunque muchos ensayos posteriores salgan del historial limitado a doce entradas. Los datos anteriores usan la primera entrada disponible del día; no se inventan resultados ausentes. `needsSupport` conserva el refuerzo pendiente incluso si el último error procede de una partida libre.

Las sesiones de repaso se validan antes de retomarlas (fecha, filtro, índices y tarjetas); una sesión dañada se reconstruye a partir de la cola conservada. Las tarjetas con fechas imposibles se omiten de la interfaz sin borrar el registro original. Al volver de otro día no se reutiliza una ronda de la fecha anterior.

En el repaso auditivo, `modelViewed` es independiente de `help`: escuchar lento no revela la respuesta escrita. La transcripción solo se muestra si se pide texto, y el modelo de respuesta solo cuando se solicita expresamente. Las tres ayudas siguen sin contar como aciertos independientes.

`missionProgress` guarda la primera comprobación inicial y hasta 20 resultados de misión: inicio, recuerdo escrito y contexto final, siempre primeros intentos sin ayuda. `gameReview` conserva etapa, próxima fecha y hasta 12 intentos de repaso por objetivo, con fecha, corrección, ayuda y elegibilidad. No hay envío de estos datos ni analítica externa. Forman parte de la copia de seguridad existente.

El panel muestra los resultados y cuántos objetivos han completado tres comprobaciones separadas. No asigna dominio, ganancia causal ni un nivel oficial. Las tareas iniciales/finales son distintas pero no están calibradas como tests equivalentes. Los contextos se repiten cuando se vuelve a jugar: una repetición no cuenta como prueba desconocida. El reconocimiento no sustituye al recuerdo escrito. La transferencia comprobada es estrecha (otra frase con traducción/intención), no producción libre.

### Validación con personas: pendiente

Antes de afirmar eficacia, realizar un piloto consentido con aprendices del público objetivo: registrar conocimiento inicial, uso de ayudas y abandonos; evaluar con tareas nuevas comparables al terminar y una semana después; recoger dificultades móviles y motivación. Para atribuir mejoras al método hace falta una comparación apropiada con igual tiempo/contenido de práctica, no solo observar una subida. Revisar también la aceptación de alternativas lingüísticas con un docente. Estas pruebas no se han realizado ni se sustituyen por automatización.

Fundamento general: recuperación activa y práctica espaciada en [IES / What Works Clearinghouse](https://ies.ed.gov/ncee/wwc/practiceguide/1). Esa evidencia no valida esta implementación concreta ni sus intervalos.

## Verificación

```text
node scripts/check-game-learning.mjs
node scripts/check-game-missions.mjs
node scripts/check-game-audio.mjs
node scripts/check-game-focus-ui.mjs
node scripts/check-game-review-plan.mjs
node scripts/check-review-plan-ui.mjs
node scripts/check-listening-missions-ui.mjs
node scripts/check-missions-ui.mjs
node scripts/check-games-ui.mjs
node scripts/check-grammar-engine.mjs
node scripts/check-learning.mjs
node scripts/check-grammar-offline.mjs
node scripts/check-offline-assets.mjs
```

Las pruebas de interfaz usan Playwright en 320/390/430 oscuro/1280 px con vocabulario sintético, reloj simulado y síntesis de voz simulada. Recorren los doce juegos sin micrófono y el estado no disponible del juego de voz. No sustituyen una prueba auditiva humana ni validan la calidad real del reconocimiento de pronunciación.
