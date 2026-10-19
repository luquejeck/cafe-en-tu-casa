// Filma un modelo animado (instagram/modelos/<nombre>.json) y lo pasa a MP4.
// Salida: assets/img/ig/<id>.mp4 y <id>-portada.jpg
//
//   node instagram/filmar-modelo.mjs magnifica-s v13-como-funciona-la-magnifica-s
//
// Igual que filmar.mjs: 1080x1920, 30 cuadros, H.264 y pista de audio muda.
// Usa playwright y ffmpeg-static (o el ffmpeg del sistema si no están).
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.join(aqui, "..");
const salida = path.join(raiz, "assets", "img", "ig");
const [modelo = "magnifica-s", id = `video-${modelo}`] = process.argv.slice(2);

function traer(nombre) {
  for (const base of [aqui, "C:/Users/lucas/Piel con Valen/instagram", process.env.NODE_PATH || ""]) {
    try { return createRequire(pathToFileURL(path.join(base, "x.js")))(nombre); } catch {}
  }
  return null;
}
const pw = traer("playwright");
if (!pw) throw new Error('Falta playwright: corré "npm install playwright ffmpeg-static" en la carpeta instagram.');
const ffmpeg = traer("ffmpeg-static") || "ffmpeg";

// fetch() no lee archivos locales: se sirve la carpeta del proyecto en un puerto libre
const tipos = { ".html": "text/html", ".json": "application/json", ".js": "text/javascript", ".css": "text/css" };
const server = http.createServer((req, res) => {
  const f = path.join(raiz, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!f.startsWith(raiz) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": tipos[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
}).listen(0);
const puerto = server.address().port;

const browser = await pw.chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.error("ERROR en la página:", e.message));
await page.goto(`http://127.0.0.1:${puerto}/instagram/modelo.html`);
const total = await page.evaluate((m) => window.prepararModelo(m), modelo);
console.log(id, total, "cuadros =", (total / 30).toFixed(1), "s");

const destino = path.join(salida, `${id}.mp4`);
const ff = spawn(ffmpeg, [
  "-y", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-",
  "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
  "-shortest", "-map", "0:v", "-map", "1:a",
  "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
  "-profile:v", "high", "-level", "4.1", "-movflags", "+faststart",
  "-c:a", "aac", "-b:a", "128k",
  destino,
], { stdio: ["pipe", "inherit", "inherit"] });
for (let f = 0; f < total; f++) {
  await page.evaluate((f) => window.cuadro(f), f);
  const buf = await page.screenshot({ type: "jpeg", quality: 96 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
// Portada: la máquina entera con el título, ya armada
await page.evaluate(() => window.cuadro(60));
await page.screenshot({ path: path.join(salida, `${id}-portada.jpg`), type: "jpeg", quality: 92 });
console.log("  →", path.relative(raiz, destino));
await browser.close();
server.close();
