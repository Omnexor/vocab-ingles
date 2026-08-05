/**
 * Servidor de desarrollo local.
 *
 * Sirve la carpeta public/ y ejecuta las funciones de api/ igual que haría
 * Vercel, pero sin necesitar la CLI de Vercel ni iniciar sesión.
 * En produccion esto no se usa: Vercel ejecuta api/*.js por su cuenta.
 *
 *   node dev-server.mjs
 */

import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(ROOT, "public");
const PORT = Number(process.env.PORT) || 3000;

/* ---------- .env.local ---------- */

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    for (const linea of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m) continue;
      const valor = m[2].replace(/^["']|["']$/g, "");
      if (!process.env[m[1]]) process.env[m[1]] = valor;
    }
  }
}
loadEnv();

/* ---------- estáticos ---------- */

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

async function serveStatic(urlPath, res) {
  const rel = urlPath === "/" ? "index.html" : decodeURIComponent(urlPath).replace(/^\/+/, "");
  const file = path.resolve(PUBLIC, rel);

  // No dejamos salir de public/.
  if (!file.startsWith(PUBLIC)) {
    res.writeHead(403).end("Prohibido");
    return;
  }

  try {
    const data = await fsp.readFile(file);
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("No encontrado: " + rel);
  }
}

/* ---------- funciones de api/ ---------- */

function leerBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

/** Añade a `res` los métodos que esperan las funciones de Vercel. */
function adaptarRes(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (obj) => {
    if (!res.headersSent) res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(obj));
    return res;
  };
  return res;
}

async function serveApi(nombre, req, res) {
  const file = path.resolve(ROOT, "api", `${nombre}.js`);
  if (!file.startsWith(path.join(ROOT, "api")) || !fs.existsSync(file)) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: `No existe /api/${nombre}` }));
    return;
  }

  try {
    // La query evita que Node cachee el módulo entre recargas.
    const mod = await import(`${pathToFileURL(file).href}?t=${Date.now()}`);
    req.body = await leerBody(req);
    await mod.default(req, adaptarRes(res));
  } catch (err) {
    console.error(`\n  ✗ Error en /api/${nombre}:`, err.message, "\n");
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  }
}

/* ---------- servidor ---------- */

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname.startsWith("/api/")) {
    const nombre = pathname.slice(5).replace(/\.js$/, "");
    await serveApi(nombre, req, res);
    return;
  }

  await serveStatic(pathname, res);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n  El puerto ${PORT} ya está ocupado.`);
    console.error(`  Cierra la otra ventana, o arranca con: set PORT=3001 && node dev-server.mjs\n`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  const conIA = Boolean(process.env.ANTHROPIC_API_KEY);
  console.log(`
  Vocab — inglés cada día
  ------------------------------------------
  Abierto en:   http://localhost:${PORT}
  Palabras IA:  ${conIA ? "sí (ANTHROPIC_API_KEY encontrada)" : "no — usando la lista local de 57 palabras"}
  ${conIA ? "" : "                (para activarla: copia .env.local desde .env.example)\n"}
  Para cerrar:  Ctrl + C  o cierra esta ventana
  ------------------------------------------
`);
});
