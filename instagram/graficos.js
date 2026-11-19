/* Dibujos y gráficos de las placas "pop" (17/11). Línea fina, color de la
   marca (currentColor / var(--brand)), nada de colores nuevos.
   Se cargan después de productos.js y contenido.js (usan M, D, P, TIENDA). */

const _s = (vb, cuerpo, cls = '') => `<svg class="${cls}" viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${cuerpo}</svg>`;

/* ---- Íconos de línea, 64 x 64 ---- */
const ICONOS = {
  molinillo: '<path d="M18 10h28l-7 16H25z"/><path d="M22 26h20v18H22z"/><path d="M28 44v6h8v-6"/><path d="M32 4v6"/><path d="M27 33h10"/>',
  termometro: '<path d="M28 12a4 4 0 0 1 8 0v26a9 9 0 1 1-8 0z"/><path d="M32 22v24"/><path d="M42 16h6M42 24h6M42 32h4"/>',
  prensa: '<path d="M24 8h16v10H24z"/><path d="M32 18v12"/><path d="M18 30h28v6H18z"/><path d="M14 42h36l-5 14H19z"/>',
  presion: '<circle cx="32" cy="34" r="20"/><path d="M32 34l10-10"/><path d="M18 34h3M43 34h3M32 20v3"/><path d="M26 54h12"/>',
  taza: '<path d="M12 26h34v10a14 14 0 0 1-14 14h-6A14 14 0 0 1 12 36z"/><path d="M46 30h4a6 6 0 0 1 0 12h-5"/><path d="M22 10c-2 3 2 5 0 9M30 10c-2 3 2 5 0 9M38 10c-2 3 2 5 0 9"/><path d="M10 56h40"/>',
  hielo: '<path d="M14 24l18-10 18 10v18L32 52 14 42z"/><path d="M14 24l18 10 18-10M32 34v18"/>',
  leche: '<path d="M22 8h20v8l6 10v30H16V26l6-10z"/><path d="M22 16h20"/><path d="M16 34h32"/>',
  frasco: '<path d="M20 12h24v8H20z"/><path d="M18 20h28v34a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z"/><path d="M26 32c3 2 3 6 0 8M36 38c3 2 3 6 0 8M30 46c2 1 2 4 0 5"/>',
  regla: '<path d="M8 40L40 8l16 16-32 32z"/><path d="M16 32l5 5M22 26l3 3M28 20l5 5M34 14l3 3"/>',
  reloj: '<circle cx="32" cy="32" r="22"/><path d="M32 18v14l9 6"/>',
  bandeja: '<path d="M8 28h48l-4 18H12z"/><path d="M14 36h4M24 36h4M34 36h4M44 36h4"/><path d="M20 20h24"/>',
  vapor: '<path d="M26 8h12v12H26z"/><path d="M30 20v18a6 6 0 0 0 12 0"/><path d="M48 42c-2 3 2 5 0 9M54 40c-2 3 2 5 0 9"/>',
  engranaje: '<circle cx="32" cy="32" r="8"/><path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M15 49l6-6M43 21l6-6"/>',
  gota: '<path d="M32 8C24 22 18 30 18 38a14 14 0 0 0 28 0c0-8-6-16-14-30z"/><path d="M26 40a6 6 0 0 0 6 6"/>',
  grano: '<ellipse cx="32" cy="32" rx="16" ry="22" transform="rotate(30 32 32)"/><path d="M24 14c10 10 6 26 16 36"/>',
  boton: '<circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="10"/><path d="M32 4v6"/>',
  mano: '<path d="M22 34V14a4 4 0 0 1 8 0v16"/><path d="M30 28v-4a4 4 0 0 1 8 0v6"/><path d="M38 30a4 4 0 0 1 8 0v8c0 10-6 18-16 18h-2c-6 0-10-4-13-9l-5-9a4 4 0 0 1 7-4l5 6"/>',
  casa: '<path d="M10 30L32 12l22 18"/><path d="M16 26v28h32V26"/><path d="M27 54V40h10v14"/>',
  bar: '<path d="M8 22h48l-4-10H12z"/><path d="M8 22c0 4 6 4 8 0 2 4 6 4 8 0 2 4 6 4 8 0 2 4 6 4 8 0 2 4 6 4 8 0 2 4 6 4 8 0"/><path d="M12 26v28h40V26"/><path d="M26 54V40h12v14"/>',
  capsula: '<path d="M20 16h24l-4 32H24z"/><path d="M16 16h32"/><path d="M26 48h12"/>',
  calendario: '<path d="M10 16h44v38H10z"/><path d="M10 26h44"/><path d="M20 10v10M44 10v10"/><path d="M18 34h6M30 34h6M42 34h4M18 44h6M30 44h6"/>',
  vaso: '<path d="M16 10h32l-4 46H20z"/><path d="M18 26h28"/><path d="M24 34h6v6h-6zM34 38h6v6h-6z"/>'
};
const icono = (n, cls = 'icono') => ICONOS[n] ? _s('0 0 64 64', ICONOS[n], cls) : '';

const plata = n => '$' + Math.round(n).toLocaleString('es-AR');
const millones = n => '$' + (n / 1e6).toLocaleString('es-AR', { maximumFractionDigits: 1 }) + ' M';

/* ---- Gráficos ---- */
const GRAFICOS = {

  /* Gasto acumulado: bar contra casa + Magnifica S. Mismos números que la calculadora. */
  amortizacion: () => {
    const W = 900, H = 560, x0 = 110, x1 = 860, y0 = 470, y1 = 40, meses = 12;
    const mesBar = TIENDA.precioCafeAfuera * 2 * 30, mesCasa = TIENDA.precioKiloCafe / TIENDA.cafesPorKilo * 2 * 30;
    const maq = P.transferencia(M), max = 3e6;
    const X = m => x0 + (x1 - x0) * m / meses, Y = v => y0 - (y0 - y1) * v / max;
    const bar = [...Array(meses + 1)].map((_, m) => [X(m), Y(mesBar * m)]);
    const casa = [...Array(meses + 1)].map((_, m) => [X(m), Y(maq + mesCasa * m)]);
    const cruce = maq / (mesBar - mesCasa);
    const cx = X(cruce), cy = Y(mesBar * cruce);
    const linea = pts => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    let g = '';
    for (const v of [0, 1e6, 2e6, 3e6]) g += `<line class="g-grilla" x1="${x0}" x2="${x1}" y1="${Y(v)}" y2="${Y(v)}"/><text class="g-eje" x="${x0 - 16}" y="${Y(v) + 9}" text-anchor="end">${v ? millones(v) : '$0'}</text>`;
    for (const m of [0, 3, 6, 9, 12]) g += `<text class="g-eje" x="${X(m)}" y="${y0 + 44}" text-anchor="middle">${m === 0 ? 'Hoy' : 'Mes ' + m}</text>`;
    g += `<path class="g-zona" d="${linea(bar.filter(p => p[0] >= cx))} L ${X(meses)} ${Y(maq + mesCasa * meses)} ${linea(casa.filter(p => p[0] >= cx).reverse()).replace('M', 'L')} Z"/>`;
    g += `<path class="g-bar" d="${linea(bar)}"/><path class="g-casa" d="${linea(casa)}"/>`;
    g += `<circle class="g-punto" cx="${cx}" cy="${cy}" r="11"/><line class="g-guia" x1="${cx}" x2="${cx}" y1="${cy + 14}" y2="${y0}"/>`;
    g += `<text class="g-nota" x="${cx + 4}" y="${y0 - 24}" text-anchor="start" dx="18">Mes ${Math.ceil(cruce)}: ya se pagó</text>`;
    g += `<text class="g-rot g-rot-bar" x="${x1}" y="${Y(mesBar * meses) - 22}" text-anchor="end">En el bar · ${millones(mesBar * meses)}</text>`;
    g += `<text class="g-rot g-rot-casa" x="${x0 + 10}" y="${Y(maq) - 26}">Magnifica S + café</text>`;
    g += `<text class="g-rot g-rot-casa" x="${x1}" y="${Y(maq + mesCasa * meses) - 22}" text-anchor="end">${millones(maq + mesCasa * meses)}</text>`;
    return `<svg class="grafico" viewBox="0 0 ${W} ${H}" aria-hidden="true">${g}</svg>`;
  },

  /* Lo que se va en café por mes */
  mes: () => {
    const a = TIENDA.precioCafeAfuera * 2 * 30, b = TIENDA.precioKiloCafe / TIENDA.cafesPorKilo * 2 * 30;
    return `<div class="hbarras">
      <div class="hb"><div class="hb-l">${icono('bar', 'ico-chico')}En el bar</div><div class="hb-v">${plata(a)}</div><u style="width:100%"></u></div>
      <div class="hb casa"><div class="hb-l">${icono('casa', 'ico-chico')}En casa</div><div class="hb-v">${plata(b)}</div><u style="width:${Math.max(4, b / a * 100)}%"></u></div>
      <p class="g-pie">2 cafés por día, durante un mes. Valores aproximados.</p></div>`;
  },

  /* Las dos máquinas dibujadas a escala (1 cm = 13 px) */
  medidas: () => {
    const k = 13, base = 520;
    const m = { w: M.medidas.ancho * k, h: M.medidas.alto * k }, d = { w: D.medidas.ancho * k, h: D.medidas.alto * k };
    const mx = 130, dx = mx + m.w + 150;
    const cm = n => String(n).replace('.', ',') + ' cm';
    const mag = `<g class="g-maq"><rect x="${mx}" y="${base - m.h}" width="${m.w}" height="${m.h}" rx="16"/>
      <rect x="${mx + 40}" y="${base - m.h + 40}" width="${m.w - 80}" height="70" rx="8"/><circle cx="${mx + m.w / 2}" cy="${base - m.h + 75}" r="18"/>
      <path d="M${mx + m.w / 2 - 22} ${base - m.h + 150}v70M${mx + m.w / 2 + 22} ${base - m.h + 150}v70"/><path d="M${mx + 20} ${base - 60}h${m.w - 40}"/></g>`;
    const ded = `<g class="g-maq"><rect x="${dx}" y="${base - d.h}" width="${d.w}" height="${d.h * .42}" rx="14"/>
      <rect x="${dx + 18}" y="${base - d.h + d.h * .42}" width="${d.w - 36}" height="${d.h * .46}"/><path d="M${dx - 10} ${base - 50}h${d.w + 20}v50H${dx - 10}z"/>
      <path d="M${dx + d.w / 2 - 30} ${base - d.h + d.h * .5}h60M${dx + d.w / 2 + 30} ${base - d.h + d.h * .5}h55"/></g>`;
    const cota = (x, w, t) => `<path class="g-cota" d="M${x} ${base + 30}v20M${x + w} ${base + 30}v20M${x} ${base + 40}h${w}"/><text class="g-cotat" x="${x + w / 2}" y="${base + 82}" text-anchor="middle">${t}</text>`;
    const alto = (x, h, t) => `<path class="g-cota" d="M${x} ${base}h-20M${x} ${base - h}h-20M${x - 10} ${base}v-${h}"/><text class="g-cotas" x="${x - 22}" y="${base - h / 2 + 8}" text-anchor="end">${t}</text>`;
    return `<svg class="grafico" viewBox="0 0 900 620" fill="none" aria-hidden="true">${mag}${ded}
      ${cota(mx, m.w, cm(M.medidas.ancho))}${cota(dx, d.w, cm(D.medidas.ancho))}${alto(mx, m.h, cm(M.medidas.alto))}${alto(dx, d.h, cm(D.medidas.alto))}
      <text class="g-nom" x="${mx + m.w / 2}" y="${base - m.h - 22}" text-anchor="middle">Magnifica S</text><text class="g-nom" x="${dx + d.w / 2}" y="${base - d.h - 22}" text-anchor="middle">Dedica</text>
      <line class="g-piso" x1="40" x2="860" y1="${base}" y2="${base}"/></svg>`;
  },

  /* Aroma del café desde que se muele (curva ilustrativa, sin números) */
  aroma: () => `<svg class="grafico" viewBox="0 0 900 520" aria-hidden="true">
      <line class="g-grilla" x1="90" x2="860" y1="420" y2="420"/><line class="g-grilla" x1="90" x2="90" y1="60" y2="420"/>
      <text class="g-eje" x="70" y="80" text-anchor="end">+</text><text class="g-eje" x="70" y="420" text-anchor="end">−</text>
      <text class="g-eje g-ejev" x="40" y="250" transform="rotate(-90 40 250)" text-anchor="middle">Aroma</text>
      <path class="g-zona" d="M90 80 C 170 90, 220 250, 330 300 S 600 370, 860 390 L 860 420 L 90 420 Z"/>
      <path class="g-casa" d="M90 80 C 170 90, 220 250, 330 300 S 600 370, 860 390"/>
      <circle class="g-punto" cx="90" cy="80" r="12"/><circle class="g-punto g-punto-gris" cx="860" cy="390" r="12"/>
      <text class="g-nota" x="120" y="66">Molido en el momento</text><text class="g-nota g-nota-gris" x="850" y="352" text-anchor="end">Molido hace meses</text>
      <text class="g-eje" x="90" y="468" text-anchor="middle">Al moler</text><text class="g-eje" x="330" y="468" text-anchor="middle">Horas</text>
      <text class="g-eje" x="600" y="468" text-anchor="middle">Semanas</text><text class="g-eje" x="860" y="468" text-anchor="end">Meses</text>
      <text class="g-chica" x="860" y="510" text-anchor="end">Ilustrativo</text></svg>`,

  /* Cafeína por taza (valores de referencia aproximados) */
  cafeina: () => {
    const it = [['Espresso', '30 ml', 63], ['Café de filtro', '240 ml', 95]], max = 110, h = 300;
    return `<svg class="grafico" viewBox="0 0 900 470" aria-hidden="true">${it.map((v, i) => {
      const x = 210 + i * 330, bh = h * v[2] / max;
      return `<rect class="${i ? 'g-barra' : 'g-barra g-barra-gris'}" x="${x}" y="${370 - bh}" width="150" height="${bh}" rx="14"/>
        <text class="g-val" x="${x + 75}" y="${370 - bh - 22}" text-anchor="middle">~${v[2]} mg</text>
        <text class="g-nom" x="${x + 75}" y="412" text-anchor="middle">${v[0]}</text><text class="g-eje" x="${x + 75}" y="448" text-anchor="middle">${v[1]}</text>`; }).join('')}
      <line class="g-piso" x1="120" x2="780" y1="370" y2="370"/></svg>`;
  },

  /* Termómetro: hervir contra la zona ideal */
  termometro: () => {
    const Y = t => 440 - (t - 70) * 12.5;
    return `<svg class="grafico" viewBox="0 0 900 520" aria-hidden="true">
      <rect class="g-tubo" x="410" y="${Y(102) - 10}" width="80" height="${Y(70) - Y(102) + 10}" rx="40"/>
      <circle class="g-tubo" cx="450" cy="470" r="46"/><circle class="g-bulbo" cx="450" cy="470" r="32"/>
      <rect class="g-nivel" x="434" y="${Y(91)}" width="32" height="${470 - Y(91)}" rx="16"/>
      <rect class="g-zonaideal" x="400" y="${Y(94)}" width="100" height="${Y(88) - Y(94)}" rx="8"/>
      ${[70, 80, 90, 100].map(t => `<line class="g-cota" x1="500" x2="530" y1="${Y(t)}" y2="${Y(t)}"/><text class="g-eje" x="545" y="${Y(t) + 9}">${t} °C</text>`).join('')}
      <text class="g-nota" x="380" y="${Y(91) + 10}" text-anchor="end">Ideal: unos 90 °C</text>
      <text class="g-nota g-nota-gris" x="380" y="${Y(100) + 10}" text-anchor="end">Hierve: 100 °C</text></svg>`;
  },

  /* Del grano a la taza en 4 pasos */
  flujo: () => `<div class="flujo">${[['molinillo', 'Muele'], ['termometro', 'Calienta'], ['prensa', 'Prensa'], ['presion', 'Extrae'], ['taza', 'Tu café']]
      .map((p, i) => `<div class="fl${i === 4 ? ' fin' : ''}">${icono(p[0])}<span>${p[1]}</span></div>`).join('<i class="fl-flecha">→</i>')}</div>`,

  /* Rutina de limpieza en 4 tarjetas */
  rutina: () => `<div class="rutina">${[['bandeja', 'Todos los días', 'Cajón y bandeja'], ['vapor', 'Después de la leche', 'Vaporizador'],
      ['engranaje', 'Una vez por semana', 'Unidad de infusión'], ['gota', 'Cuando avise', 'Descalcificar']]
      .map(r => `<div class="ru">${icono(r[0])}<b>${r[1]}</b><span>${r[2]}</span></div>`).join('')}</div>`,

  /* Magnifica S contra Dedica, punto por punto */
  comparativa: () => `<table class="compa"><thead><tr><th></th><th>Magnifica S</th><th>Dedica</th></tr></thead><tbody>
      ${[['boton', 'Cómo se prepara', 'Un botón', 'Vos, a mano'], ['molinillo', 'Molinillo', 'Integrado, 13 niveles', 'Usa café molido'],
         ['regla', 'Ancho', String(M.medidas.ancho).replace('.', ',') + ' cm', String(D.medidas.ancho).replace('.', ',') + ' cm'],
         ['leche', 'Leche', 'Vaporizador', 'Cappuccino System'], ['taza', 'Ideal para', 'Varios cafés por día', 'El que disfruta el ritual']]
        .map(f => `<tr><th>${icono(f[0], 'ico-chico')}${f[1]}</th><td>${f[2]}</td><td>${f[3]}</td></tr>`).join('')}</tbody></table>`,

  /* El vaso del iced latte por capas */
  iced: () => `<svg class="grafico" viewBox="0 0 900 560" aria-hidden="true">
      <path class="g-vaso" d="M330 40 h240 l-26 480 h-188 z"/>
      <path class="g-leche" d="M337 230 h226 l-16 285 h-194 z"/>
      <path class="g-espresso" d="M341 170 h218 l-3 60 h-212 z"/>
      ${[[370, 80], [470, 95], [410, 300], [480, 380], [380, 430]].map(c => `<rect class="g-hielo" x="${c[0]}" y="${c[1]}" width="62" height="62" rx="10" transform="rotate(${c[0] % 3 * 8 - 8} ${c[0] + 31} ${c[1] + 31})"/>`).join('')}
      <text class="g-nota" x="600" y="210">3 · Espresso doble</text><text class="g-nota" x="600" y="380">2 · Leche fría</text><text class="g-nota" x="300" y="120" text-anchor="end">1 · Hielo</text>
      <path class="g-cota" d="M575 205h20M562 375h33M325 115h-20"/></svg>`
};
const grafico = s => s.graf && GRAFICOS[s.graf] ? `<div class="graf">${GRAFICOS[s.graf]()}</div>` : '';
