// Filma reel.html cuadro por cuadro y lo pasa a MP4 1080x1920 a 30 cuadros, con música y efectos (sonido.py).
// Salida: assets/img/ig/k1-capsulas-en-un-kilo.mp4 y su portada (-portada.jpg).
//
//   node instagram/reel-capsulas-kilo/filmar.js          versión de 9 s (reel.html)
//   node instagram/reel-capsulas-kilo/filmar.js --20     versión de 20 s (reel-20.html)
//   agregá --mudo para sacarlo sin sonido
//
// Necesita playwright y ffmpeg (el del sistema, o ffmpeg-static si está instalado).
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const aqui = __dirname;
const raiz = path.join(aqui, '..', '..');
const VERSIONES = {
  '9':  { html: 'reel.html',    salida: 'k1-capsulas-en-un-kilo.mp4',     portada: 4.6 },
  '20': { html: 'reel-20.html', salida: 'k2-capsulas-en-un-kilo-20s.mp4', portada: 10.2 },
};
const V = VERSIONES[process.argv.includes('--20') ? '20' : '9'];
const destino = path.join(raiz, 'assets', 'img', 'ig', V.salida);
let ffmpeg = 'ffmpeg';
try { ffmpeg = require('ffmpeg-static'); } catch {}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('ERROR en la página:', e.message));
  await page.goto(pathToFileURL(path.join(aqui, V.html)).href);
  await page.evaluate(() => document.fonts.ready);
  const total = await page.evaluate(() => window.TOTAL);
  console.log(total, 'cuadros =', (total / 30).toFixed(1), 's');

  const ff = spawn(ffmpeg, [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
    '-shortest', '-map', '0:v', '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p',
    '-profile:v', 'high', '-level', '4.1', '-movflags', '+faststart',
    '-c:a', 'aac', '-b:a', '128k', destino,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  for (let f = 0; f < total; f++) {
    await page.evaluate(f => window.cuadro(f), f);
    const buf = await page.screenshot({ type: 'jpeg', quality: 96 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));

  // Portada: el contador ya completo, donde está el dato que vende
  await page.evaluate(f => window.cuadro(f), Math.round(V.portada * 30));
  await page.screenshot({ path: destino.replace('.mp4', '-portada.jpg'), type: 'jpeg', quality: 92 });
  const eventos = await page.evaluate(() => window.EVENTOS);
  await browser.close();

  if (!process.argv.includes('--mudo')) {
    // música + efectos sincronizados con la animación (los eventos salen de reel.html)
    const ev = path.join(aqui, 'eventos.json');
    fs.writeFileSync(ev, JSON.stringify(eventos));
    const r = spawnSync('python3', [path.join(aqui, 'sonido.py'), ev, destino], { stdio: 'inherit' });
    if (r.status) throw new Error('sonido.py falló');
  }
  console.log('Listo:', path.relative(raiz, destino));
})();
