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
  await page.goto('file://' + path.join(dir, 'carrusel.html'), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    await slides[i].screenshot({ path: path.join(dir, 'placas', `placa-${i + 1}.png`) });
  }
  await page.pdf({
    path: path.join(dir, 'ia-en-oil-and-gas.pdf'),
    width: '1080px', height: '1350px', printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  await browser.close();
  console.log(`${slides.length} placas y PDF listos`);
})();
