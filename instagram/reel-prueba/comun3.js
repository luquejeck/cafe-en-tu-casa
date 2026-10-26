/* Lo que comparten las alternativas del reel "1.460 cafés por año"
   (reel3a/b/c.html): tiempos, curvas, palabras que entran, barridos,
   temblor y la lista de efectos de sonido que lee mezclar3.py. */
const FPS = 30;
const $ = (id) => document.getElementById(id);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const tramo = (t, a, b) => clamp((t - a) / (b - a));
const suave = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const salida = (x) => 1 - Math.pow(1 - clamp(x), 4);
const rebote = (x, c = 1.5) => { x = clamp(x); return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const fmt = (n) => Math.round(n).toLocaleString("es-AR");
const COL = { crema: "#f3ede2", crema2: "#e9e0cf", tinta: "#1f1d1a", gris: "#7d776c", oliva: "#5b6e32", olivaOsc: "#2e3a17", olivaClaro: "#a3c26a", terra: "#c8643b" };
const ruido = (t, s) => Math.sin(t * 91.7 + s) * Math.sin(t * 57.3 + s * 2.1);
// semilla fija: la animación sale igual cada vez que se filma
let _s = 7; const azar = () => ((_s = (_s * 16807) % 2147483647) / 2147483647);

/** Parte un texto en palabras (respeta <br> y <span> con estilo). */
function partir(id) {
  const el = $(id), out = [];
  const recorrer = (nodo, destino, estilo) => {
    [...nodo.childNodes].forEach((n) => {
      if (n.nodeType === 3) n.textContent.split(/(\s+)/).filter(Boolean).forEach((w) => {
        if (/^\s+$/.test(w)) { destino.append(" "); return; }
        const s = document.createElement("span"); s.textContent = w; if (estilo) s.style.cssText = estilo;
        destino.append(s); out.push(s);
      });
      else if (n.tagName === "BR") destino.append(document.createElement("br"));
      else recorrer(n, destino, n.getAttribute("style"));
    });
  };
  const copia = el.cloneNode(true); el.innerHTML = ""; recorrer(copia, el, "");
  return out;
}
/** Entrada suave (estilo de la marca) o de golpe (escala desde grande). */
function entrar(spans, t, a, paso = .08, d = .5) {
  spans.forEach((s, i) => {
    const k = salida(tramo(t, a + i * paso, a + i * paso + d));
    s.style.opacity = k; s.style.transform = `translateY(${(1 - k) * 60}px)`; s.style.filter = `blur(${(1 - k) * 8}px)`;
  });
}
function golpear(spans, t, a, paso = .14) {
  spans.forEach((s, i) => {
    const x = tramo(t, a + i * paso, a + i * paso + .22);
    s.style.opacity = clamp(x * 4);
    s.style.transform = `scale(${2.6 - 1.6 * rebote(x, 1.2)})`;
    s.style.filter = "none";
  });
}
/** Temblor de cámara después de cada golpe. */
function temblor(el, t, golpes, fuerza = 18) {
  const k = Math.max(0, ...golpes.map((g) => (t >= g ? clamp(1 - (t - g) / .3) : 0)));
  el.style.transform = k ? `translate(${ruido(t, 1) * fuerza * k}px, ${ruido(t, 2) * fuerza * k}px)` : "none";
}
/** Círculo que barre la pantalla entera en cada corte grande. */
function barrido(ctx, t, cortes) {
  ctx.clearRect(0, 0, 1080, 1920);
  cortes.forEach(([c, col, desde = [540, 1920]]) => {
    const k = tramo(t, c - .3, c + .3);
    if (k <= 0 || k >= 1) return;
    const crece = suave(clamp(k * 2)), achica = suave(clamp(k * 2 - 1));
    ctx.fillStyle = col; ctx.beginPath();
    ctx.arc(desde[0], desde[1] - desde[1] * achica, 2300 * crece * (1 - achica) + 1, 0, Math.PI * 2); ctx.fill();
  });
}
/** Ola de líquido (café) que sube y tapa la pantalla. */
function liquido(ctx, t, a, b, col) {
  const k = suave(tramo(t, a, b));
  if (k <= 0) return;
  const y = 1920 * (1 - k) - 80;
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 1920);
  for (let x = 0; x <= 1080; x += 20) ctx.lineTo(x, y + Math.sin(x / 120 + t * 7) * 34 * (1 - k * .6) + Math.sin(x / 47 - t * 9) * 12);
  ctx.lineTo(1080, 1920); ctx.closePath(); ctx.fill();
}
window.listo = Promise.all([document.fonts.ready, ...[...document.images].map((i) => i.decode().catch(() => {}))]);
