/**
 * Service worker: que la app funcione en el metro.
 *
 * Estrategia: red primero, caché de reserva. Al revés (caché primero) sería
 * más rápido, pero después de cada despliegue verías la versión vieja hasta
 * recargar dos veces. Con red primero, si tienes cobertura siempre ves lo
 * último; si no tienes, sigue funcionando con lo último que viste.
 *
 * Las llamadas a /api/ nunca se cachean: generan palabras nuevas y una
 * respuesta guardada no tendría ningún sentido.
 *
 * OJO CON MEZCLAR VERSIONES. Cada archivo se guarda por su cuenta, así que si
 * una sola petición se cae (cobertura mala en el móvil) esa vuelve de la caché
 * mientras las demás llegan frescas. El resultado es un Frankenstein: el
 * index.html nuevo con el app.js de antes. Pasó de verdad: el engranaje de
 * Ajustes aparecía pero no hacía nada, porque el HTML ya lo traía y el JS
 * viejo no tenía su manejador, y sin ningún error en consola.
 *
 * Contra eso hay tres cosas aquí:
 *  - VERSION va en el nombre de la caché: al subirla, el activate borra entera
 *    la anterior y no queda nada viejo que mezclar.
 *  - Cada vez que se carga la app con red, se refresca el núcleo entero de
 *    golpe, para que lo guardado sea siempre de una misma generación.
 *  - Al activarse una versión nueva se avisa a las pestañas abiertas, que ya
 *    están corriendo el código anterior.
 *
 * AL TOCAR CUALQUIER ARCHIVO DE BASICOS, SUBE VERSION. No solo los de NUCLEO:
 * app.js importa nueve módulos y una versión desparejada de cualquiera de ellos
 * rompe igual. Esto no se confía a la memoria — revision-final.mjs guarda una
 * huella de todos y da error si cambian sin subir VERSION.
 */
const VERSION = 18;
const CACHE = `vocab-v${VERSION}`;
// Huella de los archivos de BASICOS con esta VERSION. La calcula el script de
// revisión; si no cuadra, es que algo cambió y la versión se quedó atrás.
const SELLO = "142294465af81499";

// El núcleo se refresca junto: son los archivos que se rompen si no encajan
// entre sí. El resto (lecturas, cuentos…) puede envejecer sin romper nada.
const NUCLEO = ["./", "./index.html", "./styles.css", "./app.js"];

const BASICOS = [
  ...NUCLEO,
  "./seed.js",
  "./lessons.js",
  "./false-friends.js",
  "./readings.js",
  "./stories.js",
  "./irregulars.js",
  "./conjugar.js",
  "./modals.js",
  "./phrases.js",
  "./silabas.js",
  "./vocabulario.json",
  "./manifest.json",
  "./icon.svg",
];

/** Baja el núcleo entero de la red y lo guarda de una vez. */
async function refrescarNucleo() {
  const cache = await caches.open(CACHE);
  await Promise.all(
    NUCLEO.map(async (url) => {
      try {
        const res = await fetch(url, { cache: "reload" });
        if (res && res.ok) await cache.put(url, res);
      } catch {
        /* sin red: se queda lo que hubiera, que es coherente entre sí */
      }
    }),
  );
}

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // Uno a uno: si algún archivo falla, addAll entero se vendría abajo y
      // nos quedaríamos sin caché ninguna.
      await Promise.all(
        BASICOS.map((url) => cache.add(url).catch(() => {})),
      );
      self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const viejas = (await caches.keys()).filter((k) => k !== CACHE);
      // Solo es una ACTUALIZACIÓN si ya había una versión antes. En la primera
      // visita no hay caché anterior y avisar de "versión nueva" sería absurdo
      // (y el aviso tapaba los botones de abajo de la pantalla).
      const esActualizacion = viejas.length > 0;
      await Promise.all(viejas.map((k) => caches.delete(k)));
      await self.clients.claim();

      if (!esActualizacion) return;
      // Las pestañas que ya estaban abiertas siguen ejecutando el código
      // anterior. Se les avisa para que ofrezcan recargar en vez de dejarte
      // con media app vieja y media nueva.
      const abiertas = await self.clients.matchAll({ type: "window" });
      for (const c of abiertas) c.postMessage({ tipo: "version-nueva", version: VERSION });
    })(),
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // Al abrir la app con red, se pone al día el núcleo entero. Así lo guardado
  // es siempre de una misma generación y nunca se puede servir el HTML nuevo
  // con el JS anterior.
  if (e.request.mode === "navigate") e.waitUntil(refrescarNucleo());

  e.respondWith(
    (async () => {
      try {
        const res = await fetch(e.request);
        if (res && res.ok) {
          const cache = await caches.open(CACHE);
          cache.put(e.request, res.clone());
        }
        return res;
      } catch {
        const guardada = await caches.match(e.request);
        if (guardada) return guardada;
        // Navegación sin red y sin esa página guardada: al menos la portada.
        if (e.request.mode === "navigate") {
          const portada = await caches.match("./index.html");
          if (portada) return portada;
        }
        throw new Error("sin conexión y sin copia guardada");
      }
    })(),
  );
});
