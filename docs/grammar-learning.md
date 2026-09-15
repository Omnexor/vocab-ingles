# Gramática: revisión de aprendizaje

## Cambios

- Las 83 lecciones mantienen sus identificadores. La ruta separa 75 lecciones de gramática y 8 de pronunciación; empieza por be, pronombres y orden de frase. Los conocimientos previos son recomendaciones, no bloqueos ni niveles CEFR certificados.
- Los 865 ejercicios de reconocimiento se barajan al empezar y equilibran las posiciones correctas. La sesión conserva el orden exacto y sus respuestas al recargar. Ninguna lección se aprueba pulsando siempre la misma posición.
- Se añaden 450 ejercicios escritos, seis por lección de gramática: dos de aplicación y dos para cada uno de los primeros dos repasos diferidos. Incluyen huecos, transformaciones y reconstrucción escrita. Cada respuesta incluye una explicación y variantes explícitas cuando procede.
- Hay ordenación guiada de palabras y una frase personal guardada. Comparar el modelo es autoevaluación, no corrección automática de texto libre.
- Se corrigen los problemas identificados en HELP, condicionales, sujeto y auxiliares, posición del adjetivo, verbos de estado, acento de hotel, helpful/helpless, be able to, ask, negación estándar y subjuntivo. También se ajustan afirmaciones relacionadas que contradecían esas correcciones.

## Qué significa el progreso

1. **Practicada:** hay un intento, no necesariamente superado.
2. **Prueba superada:** al menos 80% en el test actual de reconocimiento.
3. **En consolidación:** test superado y 2/2 en aplicación escrita. Primer repaso a los dos días.
4. **Consolidada en la práctica:** dos repasos completos de 2/2, separados primero por dos días y después por siete. Se programa mantenimiento a los treinta días.

Los intervalos son decisiones del producto, no una receta óptima demostrada para cada alumno. Estos pocos ítems no certifican dominio general de la lección ni fluidez. El banco es finito: los primeros repasos usan enunciados distintos a la aplicación; en posteriores ciclos se reutilizan.

Un repaso temprano, generado por IA, parcial de errores o realizado consultando la teoría no acredita retención. Fallar una evaluación actual devuelve la lección a refuerzo sin borrar la mejor nota histórica. Los errores escritos y de reconocimiento pendientes no se eliminan por completar una práctica distinta.

## Compatibilidad y límites

- Se conserva `lessons.best/done/last`; `done` antiguo es historial, no dominio nuevo. No se convierten notas anteriores automáticamente en progreso de la nueva ruta.
- Las sesiones antiguas válidas pueden retomarse como entrenamiento; se advierte de que pueden conservar contenido anterior. Las nuevas guardan modo, elegibilidad, orden, respuestas y texto en curso.
- Contracciones equivalentes, mayúsculas y puntuación final se aceptan; si se pide explícitamente una contracción, se exige esa forma. No se ignoran apóstrofos posesivos ni se aplica coincidencia difusa a respuestas con significado distinto.
- Todo este recorrido funciona localmente y sin conexión después de una primera carga. La IA sigue siendo opcional y requiere su configuración habitual.
- Las pruebas automáticas validan cobertura, estructura y comportamiento, no certifican por sí solas la corrección pedagógica exhaustiva de cada frase del curso.

## Fuentes de contraste

- [Cambridge: help con o sin to](https://dictionary.cambridge.org/us/grammar/british-grammar/help-somebody).
- [British Council: condicionales cero, primero y segundo](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/conditionals-zero-first-second).
- [IES: organización del aprendizaje, práctica espaciada y recuperación mediante preguntas](https://ies.ed.gov/ncee/wwc/PracticeGuide/1).

## Verificación reproducible

Con el servidor local en el puerto 3000 y Playwright instalado (o `PLAYWRIGHT_MODULE` apuntando a su módulo):

```text
node scripts/check-grammar-engine.mjs
node scripts/check-learning.mjs
node scripts/check-mobile.mjs
node scripts/check-grammar-offline.mjs
node scripts/check-offline-assets.mjs
```

Gramática se verifica en 320, 390, 430 oscuro y 1280 px: navegación, borradores, cancelación/reinicio, errores, escritura, notas propias, migración, fechas simuladas y ausencia de desbordamiento horizontal. El test offline usa un contexto nuevo y desconecta la red antes de abrir y retomar una práctica.
