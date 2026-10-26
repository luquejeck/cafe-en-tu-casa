// Filma el reel de prueba v3 "1.460 cafés por año" (motion graphics, sin voz).
//   node instagram/reel-prueba/filmar3.mjs
// Salida: instagram/reel-prueba/reel-prueba-v3-1460-cafes.mp4 (no va al perfil).
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const { chromium } = createRequire(import.meta.url)("playwright");
const aqui = path.dirname(fileURLToPath(import.meta.url));
const mudo = path.join(aqui, "mudo3.mp4"), destino = path.join(aqui, "reel-prueba-v3-1460-cafes.mp4");

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1920 } });
pagina.on("pageerror", (e) => console.error("ERROR en la página:", e.message));
await pagina.goto(pathToFileURL(path.join(aqui, "reel3.html")).href);
await pagina.evaluate(() => window.listo);
const { total, sfx } = await pagina.evaluate(() => ({ total: window.TOTAL, sfx: window.SFX }));

const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-",
  "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mudo], { stdio: ["pipe", "inherit", "inherit"] });
for (let f = 0; f < total; f++) {
  await pagina.evaluate((f) => window.cuadro(f), f);
  const buf = await pagina.screenshot({ type: "jpeg", quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await navegador.close();

const r = spawnSync("python3", [path.join(aqui, "mezclar3.py"), mudo, destino, String(total / 30), JSON.stringify(sfx)], { stdio: "inherit" });
if (r.status) process.exit(r.status);
fs.rmSync(mudo);
console.log("→", path.relative(path.join(aqui, "..", ".."), destino), (total / 30).toFixed(1), "s");
