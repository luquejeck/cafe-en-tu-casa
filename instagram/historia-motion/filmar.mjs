// Filma historia.html cuadro por cuadro y le pone la música «mañana».
//   node instagram/historia-motion/filmar.mjs
// Salida: assets/img/ig/h1-motion-presentacion.mp4 (1080x1920, 15 s, 30 cuadros)
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const { chromium } = createRequire(import.meta.url)("playwright");
const aqui = path.dirname(fileURLToPath(import.meta.url));
const destino = path.join(aqui, "..", "..", "assets/img/ig/h1-motion-presentacion.mp4");

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1920 } });
pagina.on("pageerror", (e) => console.error("ERROR en la página:", e.message));
await pagina.goto(pathToFileURL(path.join(aqui, "historia.html")).href);
await pagina.waitForFunction(() => window.listo);
const total = await pagina.evaluate(() => window.TOTAL);

const ff = spawn("ffmpeg", [
  "-y", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-",
  "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
  "-profile:v", "high", "-level", "4.1", "-movflags", "+faststart", destino,
], { stdio: ["pipe", "inherit", "inherit"] });
for (let f = 0; f < total; f++) {
  await pagina.evaluate((f) => window.cuadro(f), f);
  const buf = await pagina.screenshot({ type: "jpeg", quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await navegador.close();

spawnSync("python3", [path.join(aqui, "..", "musica.py"), "--video", destino, "manana"], { stdio: "inherit" });
console.log("→", path.relative(path.join(aqui, "..", ".."), destino));
