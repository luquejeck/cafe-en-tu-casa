// Filma reel.html cuadro por cuadro y lo pasa a MP4 1080x1920 a 30 cuadros, con música de musica.py.
// Salida: assets/img/ig/k1-capsulas-en-un-kilo.mp4 y su portada (-portada.jpg).
//
//   node instagram/reel-capsulas-kilo/filmar.js          con música
//   node instagram/reel-capsulas-kilo/filmar.js --mudo   sin música
//
// Necesita playwright y ffmpeg (el del sistema, o ffmpeg-static si está instalado).
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const aqui = __dirname;
const raiz = path.join(aqui, '..', '..');
const destino = path.join(raiz, 'assets', 'img', 'ig', 'k1-capsulas-en-un-kilo.mp4');
let ffmpeg = 'ffmpeg';
try { ffmpeg = require('ffmpeg-static'); } catch {}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('ERROR en la página:', e.message));
  await page.goto(pathToFileURL(path.join(aqui, 'reel.html')).href);
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

  // Portada: el contador ya completo (segundo 4,6), donde está el dato que vende
  await page.evaluate(f => window.cuadro(f), Math.round(4.6 * 30));
  await page.screenshot({ path: destino.replace('.mp4', '-portada.jpg'), type: 'jpeg', quality: 92 });
  await browser.close();

  if (!process.argv.includes('--mudo')) {
    const r = spawnSync('python3', [path.join(raiz, 'instagram', 'musica.py'), '--video', destino, 'manana'], { stdio: 'inherit' });
    if (r.status) throw new Error('musica.py falló');
  }
  console.log('Listo:', path.relative(raiz, destino));
})();
