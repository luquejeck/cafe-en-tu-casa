/* Cómo se dibuja cada tipo de placa. Lo usan pieza.html (imágenes) y
   reel.html (videos). Necesita productos.js y contenido.js cargados antes. */

const img = src => `<img src="../${src}" alt="">`;
const ep  = t => t ? `<p class="ep">${t}</p>` : '';
const sub = t => t ? `<p class="sub">${t}</p>` : '';
const par = t => t ? `<p class="p">${t}</p>` : '';
const pil = t => t ? `<p class="pildora">${t}</p>` : '';
const chica = t => t ? `<p class="chica">${t}</p>` : '';

const CUERPO = {
  portada: s => `${ep(s.ep)}<h1>${s.h}</h1>${sub(s.sub)}${s.img ? `<div class="foto">${img(s.img)}</div>` : ''}${pil(s.pildora)}`,
  foto:    s => `${ep(s.ep)}<h2>${s.h}</h2>${sub(s.sub)}<div class="foto ${s.llena ? 'llena' : ''}">${img(s.img)}</div>${pil(s.pildora)}${chica(s.chica)}`,
  texto:   s => `${ep(s.ep)}<h2>${s.h}</h2>${par(s.p)}${pil(s.pildora)}${chica(s.chica)}`,
  dato:    s => `${ep(s.ep)}<p class="num">${s.num}${s.unidad ? `<small>${s.unidad}</small>` : ''}</p>${sub(s.sub)}${par(s.p)}`,
  lista:   s => `${ep(s.ep)}<h2>${s.h}</h2><ul class="lista">${s.items.map((it, i) =>
             `<li><i>${s.numerada ? i + 1 : '✓'}</i><div><b>${it[0]}</b>${it[1] ? `<span>${it[1]}</span>` : ''}</div></li>`).join('')}</ul>${chica(s.chica)}`,
  trio:    s => `${ep(s.ep)}<h2>${s.h}</h2><div class="cols">${PRODUCTOS.map(p =>
             `<div class="col"><div class="mini">${img(p.imgs[0])}</div><p class="ep">${p.etiqueta}</p><h3>${p.modelo}</h3><p>${s.linea(p)}</p>${s.pie ? `<p class="g">${s.pie(p)}</p>` : ''}</div>`).join('')}</div>`,
  dos:     s => `${ep(s.ep)}<h2>${s.h}</h2><div class="cols dos">${s.cols.map(c =>
             `<div class="col ${c.destacada ? 'destacada' : ''}">${ep(c.ep)}<h3>${c.h}</h3>${c.items.map(t => `<p>${t}</p>`).join('')}</div>`).join('')}</div>`,
  barras:  s => { const max = Math.max(...s.items.map(i => i[2]));
             return `${ep(s.ep)}<h2>${s.h}</h2><div class="barras">${s.items.map(i =>
             `<div class="barra ${i[3] ? 'suave' : ''}"><div>${i[0]}<span>${i[1]}</span></div><u style="width:${Math.max(3, i[2] / max * 100)}%"></u></div>`).join('')}</div>${par(s.p)}`; },
  opciones:s => `${ep(s.ep)}<h2>${s.h}</h2><div class="opciones">${s.ops.map(o => `<div>${o}</div>`).join('')}</div>${par(s.p)}`,
  cta:     s => `${ep(s.ep)}<h1>${s.h}</h1>${sub(s.sub)}<p class="boton">${s.boton}</p>${chica(s.chica)}`,

  /* ---- Estilo "pop" (diciembre): juegos y ganchos ---- */
  gancho:  s => `${ep(s.ep)}<h1>${s.h}</h1>${sub(s.sub)}${s.img ? `<div class="foto ${s.llena ? 'llena' : ''}">${img(s.img)}</div>` : ''}${s.sticker ? `<p class="sticker">${s.sticker}</p>` : ''}`,
  quiz:    s => `${ep(s.ep)}<h2>${s.h}</h2><div class="quiz">${s.ops.map((o, i) =>
             `<div class="${s.ok === i ? 'ok' : ''}"><i>${'ABCD'[i]}</i>${o}</div>`).join('')}</div>${par(s.p)}`,
  revela:  s => `${ep(s.ep)}${s.tachado ? `<p class="tachado">${s.tachado}</p>` : ''}<p class="revela">${s.num}</p>${sub(s.sub)}${par(s.p)}`,
  error:   s => `<p class="gigante">${s.n}<small>/${s.de}</small></p><h2>${s.h}</h2>${par(s.p)}${s.evitar ? `<div class="evitar"><b>${s.titEvitar || 'Cómo evitarlo'}</b>${s.evitar}</div>` : ''}`,
  chat:    s => `${ep(s.ep)}${s.h ? `<h2>${s.h}</h2>` : ''}<div class="chat">${s.grupo ? `<p class="grupo">${s.grupo}</p>` : ''}${s.msjs.map(m =>
             `<p class="${m[0] === 'yo' ? 'yo' : ''}">${m[0] === 'yo' ? '' : `<b>${m[0]}</b>`}${m[1]}</p>`).join('')}</div>`,
  ticket:  s => `${ep(s.ep)}<h2>${s.h}</h2><div class="ticket"><p class="t">${s.titulo}</p>${s.lineas.map(l =>
             `<p class="l"><span>${l[0]}</span><span>${l[1]}</span></p>`).join('')}<p class="l tot"><span>${s.total[0]}</span><span>${s.total[1]}</span></p></div>${chica(s.chica)}`
};

/** Una placa entera: el lienzo con la marca, el cuerpo y los puntitos del carrusel. */
function placaHTML(pieza, n) {
  const s = pieza.placas[n];
  const vertical = pieza.tipo === 'historia' || pieza.tipo === 'reel';
  const puntos = pieza.tipo === 'carrusel'
    ? `<div class="pie">${pieza.placas.map((_, i) => `<b class="${i === n ? 'on' : ''}"></b>`).join('')}${n === 0 ? '<span>Deslizá →</span>' : ''}</div>`
    : '';
  if (pieza.estilo === 'pop') {
    const total = pieza.placas.length;
    const pie = `<div class="pie"><div class="puntos">${pieza.placas.map((_, i) => `<b class="${i === n ? 'on' : ''}"></b>`).join('')}</div>${
      s.sigue ? `<span class="sigue">${s.sigue} →</span>` : ''}</div>`;
    return `<div class="lienzo pop ${s.tono || ''}">
    <div class="marca"><i></i> Café en tu Casa</div><p class="contador">${n + 1}/${total}</p><main>${CUERPO[s.t](s)}</main>${pie}</div>`;
  }
  return `<div class="lienzo ${vertical ? 'vertical' : ''} ${s.tono || ''}">
    <div class="marca"><i></i> Café en tu Casa</div><main>${CUERPO[s.t](s)}</main>${puntos}</div>`;
}
