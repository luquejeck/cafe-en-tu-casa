// Filma el reel de prueba v2 "Expectativa vs. realidad" (41 s).
//   node instagram/reel-prueba/filmar2.mjs [voz.m4a|voz.wav]
// Sin voz sale el borrador para grabar encima (música, golpes y subtítulos).
// Con la grabación de Lucas, la mezcla arriba de la música (que baja cuando habla).
// Salida: instagram/reel-prueba/reel-prueba-v2[-con-voz].mp4 (no va al perfil).
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const { chromium } = createRequire(import.meta.url)("playwright");
const aqui = path.dirname(fileURLToPath(import.meta.url));
const voz = process.argv[2] ? path.resolve(process.argv[2]) : "";
const G = JSON.parse(fs.readFileSync(path.join(aqui, "guion2.json"), "utf8"));
const mudo = path.join(aqui, "mudo2.mp4");
const destino = path.join(aqui, voz ? "reel-prueba-v2-con-voz.mp4" : "reel-prueba-v2.mp4");

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1920 } });
pagina.on("pageerror", (e) => console.error("ERROR en la página:", e.message));
await pagina.goto(pathToFileURL(path.join(aqui, "reel2.html")).href);
await pagina.evaluate(() => window.listo);
const total = await pagina.evaluate((g) => window.armar(g), G);

const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-",
  "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mudo], { stdio: ["pipe", "inherit", "inherit"] });
for (let f = 0; f < total; f++) {
  await pagina.evaluate((f) => window.cuadro(f), f);
  const buf = await pagina.screenshot({ type: "jpeg", quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await navegador.close();

const r = spawnSync("python3", [path.join(aqui, "mezclar2.py"), mudo, destino, voz], { stdio: "inherit" });
if (r.status) process.exit(r.status);
fs.rmSync(mudo);
console.log("→", path.relative(path.join(aqui, "..", ".."), destino), (total / 30).toFixed(1), "s");
