// Métricas objetivas de cada variante, medidas sobre el diseño renderizado.
//   node marca/carta-agradecimiento/evaluacion/metricas.mjs
// Salida: evaluacion/metricas.json
import { createRequire } from "node:module"; import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const { chromium } = createRequire("/opt/node22/lib/node_modules/")("playwright");
const aqui = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 794, height: 1123 } });
await page.goto("file://" + path.join(aqui, "..", "variantes.html")); await page.evaluate(() => document.fonts.ready);
const datos = await page.evaluate(() => {
  const MM = 96 / 25.4;
  const silabas = w => (w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").match(/[aeiouy]+/g) || []).length || 1;
  return [...document.querySelectorAll(".hoja")].map((h, i) => {
    const r0 = h.getBoundingClientRect();
    const texto = h.innerText.replace(/\s+/g, " ").trim();
    const palabras = texto.split(" ").filter(w => /\p{L}/u.test(w));
    const oraciones = Math.max(1, (texto.match(/[.!?]+/g) || []).length);
    const sil = palabras.reduce((s, w) => s + silabas(w), 0);
    // Fernández-Huerta (lecturabilidad en español; >70 = fácil)
    const fh = 206.84 - 60 * (sil / palabras.length) - 1.02 * (palabras.length / oraciones);
    const qrs = [...h.querySelectorAll('img[src="qr-opinar.svg"]')].map(q => q.getBoundingClientRect());
    const qr = qrs[0];
    // en la variante 2 la mitad de arriba está girada: lo que se lee primero es la tapa
    const qrArea = (qr.width / MM) * (qr.height / MM);
    const qrCentroY = ((qr.top + qr.height / 2 - r0.top) / r0.height) * 100;
    // palabras antes del pedido de opinión (en orden de lectura del DOM)
    // palabras que se leen antes de la primera mención de "opinión"
    const corte = texto.search(/opini/i);
    const antes = corte < 0 ? palabras.length : texto.slice(0, corte).split(" ").filter(w => /\p{L}/u.test(w)).length;
    const tituloMax = Math.max(...[...h.querySelectorAll("h1,.gigante")].map(e => parseFloat(getComputedStyle(e).fontSize) / MM));
    const acciones = new Set();
    if (/opini/i.test(texto)) acciones.add("opinar"); if (/@cafentucasa/.test(texto)) acciones.add("instagram");
    if (/recort/i.test(texto)) acciones.add("recortar"); if (/dobl/i.test(texto)) acciones.add("doblar");
    return { variante: i + 1, palabras: palabras.length, lecturabilidad_FH: Math.round(fh), palabras_antes_del_pedido: antes,
      qr_opinar_mm2: Math.round(qrArea), qr_opinar_pct_hoja: +(qrArea / (210 * 297) * 100).toFixed(1), qr_centro_vertical_pct: Math.round(qrCentroY),
      titulo_mm: +tituloMax.toFixed(1), acciones: [...acciones], pasos_explicados: h.querySelectorAll(".paso").length > 0, ruta_escrita: !!h.querySelector(".ruta") };
  });
});
fs.writeFileSync(path.join(aqui, "metricas.json"), JSON.stringify(datos, null, 1));
console.table(datos.map(d => ({ ...d, acciones: d.acciones.join("+") })));
await b.close();
