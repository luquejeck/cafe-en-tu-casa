// Filma el reel de prueba v3 "1.460 cafés por año" (motion graphics, sin voz).
//   node instagram/reel-prueba/filmar3.mjs [página.html salida.mp4]
// Con ?voz=original|particulas|calendario filma la versión con voz.
// Sin argumentos filma reel3.html → reel-prueba-v3-1460-cafes.mp4 (no va al perfil).
// Las alternativas: reel3a.html → reel-prueba-v3a-particulas.mp4,
// reel3b.html → reel-prueba-v3b-plata.mp4, reel3c.html → reel-prueba-v3c-calendario.mp4.
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const { chromium } = createRequire(import.meta.url)("playwright");
const aqui = path.dirname(fileURLToPath(import.meta.url));
const [pag = "reel3.html", sale = "reel-prueba-v3-1460-cafes.mp4"] = process.argv.slice(2);
const destino = path.resolve(aqui, sale), mudo = destino.replace(/\.mp4$/, "-mudo.mp4");

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1920 } });
pagina.on("pageerror", (e) => console.error("ERROR en la página:", e.message));
const [archivo, consulta = ""] = pag.split("?");   // reel3.html?voz=original → versión con voz (voz3.js)
await pagina.goto(pathToFileURL(path.resolve(aqui, archivo)).href + (consulta && "?" + consulta));
await pagina.evaluate(() => window.listo);
const { total, sfx, voz, mezcla } = await pagina.evaluate(() => ({ total: window.TOTAL, sfx: window.SFX, voz: window.VOZ, mezcla: window.MEZCLA }));

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

const r = spawnSync("python3", [path.resolve(aqui, mezcla || "mezclar3.py"),   // una página puede traer su propia mezcla
   mudo, destino, String(total / 30), JSON.stringify(sfx), ...(voz ? [path.resolve(aqui, voz[0]), String(voz[1])] : [])], { stdio: "inherit" });
if (r.status) process.exit(r.status);
fs.rmSync(mudo);
console.log("→", path.relative(path.join(aqui, "..", ".."), destino), (total / 30).toFixed(1), "s");
