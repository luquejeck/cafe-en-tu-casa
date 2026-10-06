/* Genera las imágenes de Instagram a partir de contenido.js.
   Salida: assets/img/ig/<id-de-la-pieza>-<nº de placa>.jpg

   Uso:   node instagram/generar.js              -> todo el mes
          node instagram/generar.js s2-          -> solo las piezas cuyo id empieza con "s2-"
   Necesita Chrome o Edge instalado (los usa sin abrir ventana). */

const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { execFile, execFileSync } = require('child_process');

const raiz   = path.join(__dirname, '..');
const salida = path.join(raiz, 'assets', 'img', 'ig');
const tmp    = fs.mkdtempSync(path.join(os.tmpdir(), 'ig-'));

const chrome = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

// productos.js y contenido.js son scripts de navegador: se evalúan juntos
const fuente = ['assets/js/productos.js', 'instagram/contenido.js']
  .map(f => fs.readFileSync(path.join(raiz, f), 'utf8')).join('\n');
const PIEZAS = vm.runInNewContext(fuente + '\nPIEZAS', { module: {} });

const filtro = process.argv[2] || '';
const tareas = [];
for (const p of PIEZAS.filter(p => p.id.startsWith(filtro))) {
  const alto = p.tipo === 'historia' || p.tipo === 'reel' ? 1920 : 1350;
  p.placas.forEach((_, n) => tareas.push({ nombre: `${p.id}-${n + 1}`, id: p.id, n, alto }));
}

const plantilla = 'file:///' + path.join(__dirname, 'pieza.html').replace(/\\/g, '/').replace(/ /g, '%20');

const captura = t => new Promise((ok, mal) => {
  const png = path.join(tmp, t.nombre + '.png');
  execFile(chrome, [
    '--headless=new', '--hide-scrollbars', '--force-device-scale-factor=1',
    `--user-data-dir=${path.join(tmp, 'perfil-' + t.nombre)}`,
    `--window-size=1080,${t.alto}`, '--virtual-time-budget=8000',
    `--screenshot=${png}`, `${plantilla}?id=${t.id}&n=${t.n}`
  ], err => fs.existsSync(png) ? ok() : mal(err || new Error('sin captura: ' + t.nombre)));
});

(async () => {
  fs.mkdirSync(salida, { recursive: true });
  const cola = [...tareas];
  await Promise.all(Array.from({ length: 4 }, async () => {
    for (let t; (t = cola.shift());) { await captura(t); process.stdout.write('.'); }
  }));

  // Instagram solo acepta JPG: se convierte con lo que ya trae Windows
  execFileSync('powershell', ['-NoProfile', '-Command', `
    Add-Type -AssemblyName System.Drawing
    $jpg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $q = New-Object System.Drawing.Imaging.EncoderParameters 1
    $q.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]92)
    Get-ChildItem '${tmp}' -Filter *.png | ForEach-Object {
      $i = [System.Drawing.Image]::FromFile($_.FullName)
      $i.Save((Join-Path '${salida}' ($_.BaseName + '.jpg')), $jpg, $q)
      $i.Dispose()
    }`]);

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`\n${tareas.length} imágenes en assets/img/ig/`);
})();
