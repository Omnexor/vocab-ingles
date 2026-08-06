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
 */
const CACHE = "vocab-v1";

const BASICOS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./seed.js",
  "./lessons.js",
  "./false-friends.js",
  "./readings.js",
  "./vocabulario.json",
  "./manifest.json",
  "./icon.svg",
];

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
      await Promise.all(viejas.map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

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
