// Filma linkedin/video.html cuadro por cuadro y le pone la música de musica.py.
// Salida: linkedin/cafe-en-tu-casa-con-ia.mp4 (1080x1350, 30 cuadros, H.264 + AAC)
// y linkedin/portada-video.jpg (el cuadro que conviene usar de miniatura).
//
//   node linkedin/filmar.mjs
//
// Usa playwright, ffmpeg (el del sistema o ffmpeg-static) y python3 con numpy.
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
let ffmpeg = "ffmpeg";
try { ffmpeg = require("ffmpeg-static"); } catch {}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.error("ERROR en la página:", e.message));
await page.goto(pathToFileURL(path.join(aqui, "video.html")).href, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const { total, fps, escenas } = await page.evaluate(() => ({ total: TOTAL, fps: FPS, escenas: ESCENAS }));
const cuadros = Math.round(total * fps);
console.log(`${cuadros} cuadros = ${total} s`);

// La música se arma a la medida del video, con un golpe suave en cada cambio de escena
const musica = path.join(aqui, "musica.wav");
execFileSync("python3", [path.join(aqui, "musica.py"), musica, String(total), escenas.join(",")], { stdio: "inherit" });

const destino = path.join(aqui, "cafe-en-tu-casa-con-ia.mp4");
const ff = spawn(ffmpeg, [
  "-y", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-",
  "-i", musica, "-map", "0:v", "-map", "1:a", "-shortest",
  "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p",
  "-profile:v", "high", "-level", "4.1", "-movflags", "+faststart",
  "-c:a", "aac", "-b:a", "192k",
  destino,
], { stdio: ["pipe", "inherit", "inherit"] });

for (let f = 0; f < cuadros; f++) {
  await page.evaluate((t) => dibujar(t), f / fps);
  const jpg = await page.screenshot({ type: "jpeg", quality: 95 });
  if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once("drain", r));
  if (f % 150 === 0) console.log(`  ${(f / fps).toFixed(0)} s`);
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));

// Miniatura: el gancho ya armado
await page.evaluate(() => dibujar(4.2));
await page.screenshot({ path: path.join(aqui, "portada-video.jpg"), type: "jpeg", quality: 92 });
await browser.close();
fs.rmSync(musica);
console.log("Listo:", destino);
