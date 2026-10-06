// Filma los reels de contenido.js cuadro por cuadro y los pasa a MP4.
// Salida: assets/img/ig/<id-del-reel>.mp4 (la portada es su placa 1, que saca generar.js).
//
//   node instagram/filmar.mjs                 todos
//   node instagram/filmar.mjs s2-             solo los que empiezan con "s2-"
//
// Sale 1080x1920 a 30 cuadros, H.264 y con una pista de audio muda: sin
// audio, algunas versiones de Instagram no dejan agregarle música.
//
// Usa playwright y ffmpeg-static. Si no están instalados acá, toma los
// del proyecto de Piel con Valen, que ya los tiene.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const salida = path.join(aqui, "..", "assets", "img", "ig");

function traer(nombre) {
  for (const base of [aqui, "C:/Users/lucas/Piel con Valen/instagram"]) {
    try { return createRequire(pathToFileURL(path.join(base, "x.js")))(nombre); } catch {}
  }
  throw new Error(`Falta ${nombre}: corré "npm install playwright ffmpeg-static" en la carpeta instagram.`);
}
const { chromium } = traer("playwright");
const ffmpeg = traer("ffmpeg-static");

const filtro = process.argv[2] || "";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.error("ERROR en la página:", e.message));
await page.goto(pathToFileURL(path.join(aqui, "reel.html")).href);
const reels = await page.evaluate(() => PIEZAS.filter((p) => p.tipo === "reel").map((p) => p.id));
const marco = { x: 0, y: 0, width: 1080, height: 1920 };
fs.mkdirSync(salida, { recursive: true });

for (const id of reels.filter((r) => r.startsWith(filtro))) {
  const total = await page.evaluate((id) => window.prepararReel(id), id);
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
    const buf = await page.screenshot({ type: "jpeg", quality: 96, clip: marco });
    if (!ff.stdin.write(buf)) await new Promise((res) => ff.stdin.once("drain", res));
  }
  ff.stdin.end();
  await new Promise((res) => ff.on("close", res));
  console.log("  →", path.relative(path.join(aqui, ".."), destino));
}
await browser.close();
