const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto("file:///home/user/cafe-en-tu-casa/instagram/reel-iso/reel-iso2.html"); await p.evaluate(() => window.listo);
  await p.evaluate(() => {
    // la cámara un poco más abajo para que el edificio quede en el centro del recorte 4:5 del perfil
    window.cuadro(Math.round((9.4 + .25) * 30));
    document.querySelectorAll(".tit,.ep").forEach((e) => (e.style.display = "none"));
    const banda = document.getElementById("banda"); banda.style.height = "720px";
    const ep = document.createElement("div"); ep.className = "ep"; ep.style.top = "330px"; ep.style.opacity = 1; ep.textContent = "5° B  vs.  3° A";
    const t = document.createElement("div"); t.className = "tit"; t.style.top = "390px"; t.style.fontSize = "104px";
    t.innerHTML = 'Dos vecinos.<br>Mismo <span class="s">edificio.</span>';
    document.body.append(ep, t);
  });
  await p.screenshot({ path: "portada-dos-vecinos.png" });
  await p.screenshot({ path: "portada-dos-vecinos-4x5.png", clip: { x: 0, y: 285, width: 1080, height: 1350 } });
  await b.close();
})();
