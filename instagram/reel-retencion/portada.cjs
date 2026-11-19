// Portada del reel "5° B vs 3° A" (9:16 y su recorte 4:5).
const { chromium } = require("playwright"), path = require("path");
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto("file://" + path.join(__dirname, "reel-retencion.html")); await p.evaluate(() => window.listo);
  await p.evaluate(() => { window.cuadro(Math.round(23.25 * 30)); const s = document.getElementById("subs"); s.innerHTML = '<span>¿De</span><span>qué</span><span class="o">piso</span><span>sos?</span>'; [...s.children].forEach((e) => { e.style.opacity = 1; e.style.transform = "none"; }); document.getElementById("nota").style.opacity = 0; });
  await p.screenshot({ path: path.join(__dirname, "portada-5B-vs-3A.png") });
  await p.screenshot({ path: path.join(__dirname, "portada-5B-vs-3A-4x5.png"), clip: { x: 0, y: 285, width: 1080, height: 1350 } });
  await b.close();
})();
