// Renderiza linkedin/oil-gas/carrusel.html a PNG (una por placa) y a un PDF para
// subir a LinkedIn como documento. Uso: node linkedin/oil-gas/generar.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const dir = __dirname;
  fs.mkdirSync(path.join(dir, 'placas'), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  await page.goto('file://' + path.join(dir, 'carrusel.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.FOTOS);  // espera a que carguen las fotos de imagenes/

  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    await slides[i].screenshot({ path: path.join(dir, 'placas', `placa-${i + 1}.png`) });
  }
  // El PDF se arma con las mismas imágenes de cada placa: así se ve idéntico a los PNG
  // (en modo impresión el navegador acomoda algunas placas distinto).
  const html = '<!doctype html><style>@page{size:1080px 1350px;margin:0}*{margin:0}img{display:block;width:1080px;height:1350px;page-break-after:always}</style>' +
    slides.map((_, i) => `<img src="file://${path.join(dir, 'placas', `placa-${i + 1}.png`)}">`).join('');
  const hoja = path.join(dir, 'placas', 'pdf.html');
  fs.writeFileSync(hoja, html);
  await page.goto('file://' + hoja, { waitUntil: 'load' });
  await page.pdf({
    path: path.join(dir, 'ia-en-oil-and-gas.pdf'),
    width: '1080px', height: '1350px', printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  fs.rmSync(hoja);
  await browser.close();
  console.log(`${slides.length} placas y PDF listos`);
})();
