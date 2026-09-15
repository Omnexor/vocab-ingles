# Aprender: frases y lecturas

## Frases en contexto

La búsqueda combina expresión inglesa, significado, situación y contexto. Puede usarse junto a las categorías y no distingue mayúsculas ni tildes. Las tarjetas usan botones independientes para escuchar, desplegar la explicación y practicar; el despliegue también funciona con teclado.

«Practicar» muestra la situación en español y oculta la expresión de esa tarjeta. El alumno escribe una respuesta antes de comparar, o elige «No lo sé». El ejemplo explica el registro y las precauciones del uso. No se corrige automáticamente el texto libre: otras formulaciones pueden ser válidas. Esta autoevaluación no concede puntos ni consolida lecciones.

Los borradores se guardan en `phraseDrafts` por identificador. Recargar conserva el intento pero vuelve a ocultar el modelo. «Intentar de nuevo» inicia un intento vacío para esa expresión. Si falla el almacenamiento se muestra un aviso junto al campo.

## Continuidad de lectura

- Filtros de nivel y estado, con recomendación dentro de los filtros actuales.
- El texto abierto más recientemente tiene prioridad si hay una sesión guardada. Las tarjetas distinguen «En curso», «Releyendo», «Pendiente» y «Leída».
- `readingSessions` guarda la frase que queda bajo la barra de lectura y la fecha de uso. El guardado durante el desplazamiento se agrupa y se vacía al salir de la lectura, ocultar la pestaña o abandonar la página.
- Al retomar se restaura el punto y se ocultan las traducciones. «Desde el principio» permite volver al inicio. La posición no se interpreta como comprensión ni marca un texto como leído.
- El resumen opcional se guarda en `readingNotes`. No se evalúa automáticamente y se conserva al terminar. Solo «Marcar como leída» registra la finalización y elimina el marcador de esa lectura.

Los campos nuevos conservan los datos anteriores, viajan en la copia de seguridad general y funcionan sin conexión después de cargar la app. Los marcadores inválidos se ignoran y los campos de texto solo muestran cadenas.

## Comprensión de lecturas

Las 14 lecturas y cuentos incluyen tres preguntas cada uno (42 en total). Primero se comprueba la idea principal; después, un detalle y otra pista, significado contextual o inferencia. Las preguntas están redactadas en español para separar la comprensión del texto inglés de la dificultad de entender la consigna.

Antes de contestar se puede consultar el texto original y sus traducciones. Esa respuesta queda identificada como apoyada; abrir la explicación después de responder no cambia la clasificación. Cada devolución cita las frases originales que justifican la respuesta, con su traducción. «No lo sé» tiene un registro propio, distinto de una elección incorrecta.

`readingChecks` conserva el orden de las opciones, las respuestas, los apoyos y el primer resultado completo. Los reintentos mantienen ese primer resultado y avisan de que se repiten las mismas preguntas. Tres respuestas no certifican dominio ni retención: no conceden dominio gramatical ni marcan automáticamente el texto como leído. El marcador de lectura y el resumen personal se conservan mientras se practica.

Las sesiones inválidas o de otra versión se reinician al entrar; un fallo de almacenamiento se avisa dentro del ejercicio. El módulo de preguntas forma parte del núcleo offline.

### Del resultado al refuerzo

Al terminar se pueden desplegar las tres respuestas, ordenadas por errores, «No lo sé», aciertos con apoyo y aciertos sin consultar. Se muestra qué eligió el alumno, la respuesta correcta y sus evidencias, sin cambiar la puntuación. «Releer desde la frase…» lleva al pasaje original y coloca el foco bajo la barra de lectura. Desde esa barra se vuelve a las respuestas sin buscar el final del texto.

La biblioteca separa el estado de lectura del estado de comprensión. Permite filtrar comprobaciones pendientes y textos con respuestas incorrectas o desconocidas en el intento actual. Los aciertos con apoyo no se presentan como errores. La recomendación prioriza comprobaciones pendientes y después respuestas para reforzar, siempre dentro de los filtros elegidos; los botones acceden directamente al intento guardado.

Volver al texto antes de responder una pregunta también registra apoyo. Volver después de responder no altera el registro. La revisión detallada solo está disponible al completar las tres preguntas, para no revelar respuestas futuras.

## Verificación

Con el servidor local en el puerto 3000 y Playwright disponible, o `PLAYWRIGHT_MODULE` apuntando a su módulo:

```text
node scripts/check-context-learning-ui.mjs
node scripts/check-reading-practice.mjs
node scripts/check-reading-comprehension-ui.mjs
node scripts/check-mobile.mjs
node scripts/check-learning-hub-ui.mjs
node scripts/check-grammar-offline.mjs
node scripts/check-offline-assets.mjs
```

El recorrido de contexto se verifica a 320, 390, 430 oscuro y 1280 px. Cubre teclado, búsqueda, respuestas ocultas, borradores, edición tras comparar, reintentos, filtros, restauración de posición, reinicio de lectura, notas, finalización explícita y ausencia de desbordamiento. A 390 px también prueba movimiento normal, recarga sin conexión y un fallo simulado de almacenamiento.
