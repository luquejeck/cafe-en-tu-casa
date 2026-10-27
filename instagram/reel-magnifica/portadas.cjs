// Portadas de los dos reels de la Magnifica S (9:16 y su recorte 4:5 del perfil).
//   NODE_PATH=/opt/node22/lib/node_modules node instagram/reel-magnifica/portadas.cjs
const { chromium } = require("playwright");
const path = require("path");
const aqui = __dirname;
(async () => {
  const b = await chromium.launch();
  const sacar = async (html, seg, preparar, nombre) => {
    const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
    await p.goto("file://" + path.join(aqui, html)); await p.evaluate(() => window.listo);
    await p.evaluate((f) => window.cuadro(f), Math.round(seg * 30));
    await p.evaluate(preparar);
    await p.screenshot({ path: path.join(aqui, nombre + ".png") });
    await p.screenshot({ path: path.join(aqui, nombre + "-4x5.png"), clip: { x: 0, y: 285, width: 1080, height: 1350 } });
    await p.close();
  };
  // 1 · "Cómo funciona por dentro": la máquina en rayos X durante la extracción
  await sacar("reel-magnifica.html", 28.45, () => {
    document.querySelectorAll("#subs,#dato,#notas,#caps,#marca").forEach((e) => (e.style.display = "none"));
    document.getElementById("ep").textContent = "Magnifica S · por dentro";
    document.getElementById("ep").style.top = "330px";
    const t = document.getElementById("tit"); t.innerHTML = "¿Qué pasa<br>adentro?"; t.style.top = "380px"; t.style.fontSize = "120px"; t.style.lineHeight = "1";
    const s = document.getElementById("sub"); s.textContent = "Muele · calienta · prensa · extrae"; s.style.top = "1440px"; s.style.fontSize = "40px";
    document.querySelectorAll(".banda")[0].style.height = "640px";
  }, "portada-por-dentro");
  // 2 · "El viaje del grano": el despiece en el aire
  await sacar("reel-grano.html", 1.9, () => {
    document.querySelectorAll("#subs,#reloj,#paso").forEach((e) => (e.style.display = "none"));
    const g = document.getElementById("g1"); g.innerHTML = "Qué pasa cuando<br>apretás <span style='color:#a3c26a'>un botón</span>"; g.style.top = "330px"; g.style.fontSize = "92px"; g.style.transform = "none"; g.style.opacity = 1; g.style.textShadow = "0 0 30px #000, 0 0 60px #000, 0 0 90px #000";
  }, "portada-viaje-del-grano");
  await b.close();
})();
