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

## Verificación

Con el servidor local en el puerto 3000 y Playwright disponible, o `PLAYWRIGHT_MODULE` apuntando a su módulo:

```text
node scripts/check-context-learning-ui.mjs
node scripts/check-mobile.mjs
node scripts/check-learning-hub-ui.mjs
node scripts/check-grammar-offline.mjs
node scripts/check-offline-assets.mjs
```

El recorrido de contexto se verifica a 320, 390, 430 oscuro y 1280 px. Cubre teclado, búsqueda, respuestas ocultas, borradores, edición tras comparar, reintentos, filtros, restauración de posición, reinicio de lectura, notas, finalización explícita y ausencia de desbordamiento. A 390 px también prueba movimiento normal, recarga sin conexión y un fallo simulado de almacenamiento.
