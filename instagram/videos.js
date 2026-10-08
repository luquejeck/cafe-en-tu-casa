/* ============================================================
   CAFÉ EN TU CASA — Videos (reels que también van a historias)
   ------------------------------------------------------------
   Cada video es una lista de escenas con su duración en segundos (d).
   Lo que lleva data-a entra animado, en el orden en que aparece;
   data-t fija el momento (segundos desde que arranca la escena).
   Se filman con:   node instagram/filmar.mjs --videos
   Fórmula (reportes/APRENDIZAJES.md): 9 a 12 s en total, gancho en el
   primer segundo y el dato que vende (con el precio) antes del segundo 6.
   El precio sale de productos.js: si cambia, hay que volver a filmar.
   El texto cierra pidiendo guardar o compartir, más una pregunta.
   ============================================================ */

const VM = getProducto('magnifica-s');
const VD = getProducto('dedica');   // la más barata: el "desde"
const V_OFF = TIENDA.descuentoTransferencia * 100;
const vPrecios = p =>
  `💸 ${fmt(P.transferencia(p))} por transferencia (${V_OFF}% OFF)\n` +
  `💳 o ${p.cuotas} cuotas sin interés de ${fmt(P.cuota(p))} en Mercado Libre\n` +
  `📦 Envío gratis a todo el país`;
/* Cierre de los textos: guardar o compartir, y una pregunta fácil */
const vCierre = (pide, pregunta) => `${pide}\n\n${pregunta}`;

/* ---------- Piezas que se repiten ---------- */
const V = {
  ep:     (t, x = '') => `<p class="ep" data-a="sube" ${x}>${t}</p>`,
  titulo: (t, tam = '', x = '') => `<h1 class="${tam}" data-a="palabras" ${x}>${t}</h1>`,
  sub:    (t, x = '') => `<p class="sub" data-a="sube" ${x}>${t}</p>`,
  boton:  (t, x = '') => `<p class="boton" data-a="pop" ${x}>${t}</p>`,
  precio: (p, t = 1, antes = '') => `<p class="precio" data-a="pop" data-t="${t}">${antes}<b>${fmt(P.transferencia(p))}</b> por transferencia · ${V_OFF}% OFF</p>`,
  chips:  (lista, t0 = .9) => `<div class="chips">${lista.map((c, i) => `<span class="chip" data-a="pop" data-t="${(t0 + i * .22).toFixed(2)}">${c}</span>`).join('')}</div>`,
  foto:   (src, flotan = [], clase = '') => `<div class="foto ${clase}" data-a="pop"><img src="../${src}" data-a="acerca" alt="">${flotan.map(f =>
            `<span class="flota" data-a="pop" data-t="${f.t}" style="${f.pos}">${f.txt}</span>`).join('')}</div>`,
  numero: (n, unidad = '', x = '') => `<p class="num" data-a="cuenta" data-n="${n}" data-dur="1.1" ${x}>0${unidad ? `<small>${unidad}</small>` : ''}</p>`,
  pasos:  (lista, viajero = false) => `<div class="pasos"><div class="linea" data-a="crece-y" data-t=".5" data-dur="${(lista.length * .75).toFixed(2)}"></div>
            ${viajero ? `<div class="viajero" data-a="baja" data-t=".5" data-dur="${(lista.length * .75).toFixed(2)}"></div>` : ''}
            ${lista.map((p, i) => `<div class="p" data-a="izq" data-t="${(.55 + i * .75).toFixed(2)}">${viajero ? '' : `<i>${i + 1}</i>`}<b>${p[0]}</b><span>${p[1]}</span></div>`).join('')}</div>`,
  duo:    (a, b) => `<div class="duo">
            <div class="tarjeta fuerte" data-a="izq" data-t=".5"><p class="ep">${a[0]}</p><b>${a[1]}</b><span>${a[2]}</span></div>
            <div class="tarjeta" data-a="der" data-t=".95"><p class="ep">${b[0]}</p><b>${b[1]}</b><span>${b[2]}</span></div></div>`,
  checks: (lista, t0 = .6, paso = .55) => `<div class="checks">${lista.map((c, i) => { const t = t0 + i * paso; return `
            <div class="check" data-a="izq" data-t="${t.toFixed(2)}"><svg viewBox="0 0 70 70"><circle cx="35" cy="35" r="35"/><path pathLength="1" d="M20 36l10 10 20-22" data-a="trazo" data-t="${(t + .3).toFixed(2)}" data-dur=".45"/></svg>${c}</div>`; }).join('')}</div>`,
  /* dial con 13 marcas: la aguja va de -120° (fina) a 120° (gruesa) */
  dial:   (desde, hasta) => `<div class="dial" data-a="pop"><svg viewBox="0 0 620 620">
            ${Array.from({ length: 13 }, (_, i) => { const a = (-120 + i * 20 - 90) * Math.PI / 180;
              const on = (hasta < 0 ? i <= 3 : i >= 9);
              return `<line class="tick ${on ? 'on' : ''}" x1="${310 + 250 * Math.cos(a)}" y1="${310 + 250 * Math.sin(a)}" x2="${310 + 295 * Math.cos(a)}" y2="${310 + 295 * Math.sin(a)}"/>`; }).join('')}
            <circle class="perilla" cx="310" cy="310" r="205"/>
            <g class="aguja" data-a="gira" data-desde="${desde}" data-hasta="${hasta}" data-t=".7" data-dur="1.3"><line x1="310" y1="310" x2="310" y2="140"/></g>
            <circle class="centro" cx="310" cy="310" r="26"/></svg></div>
            <div class="dial-extremos" data-a="sube"><span>Fina</span><span>Gruesa</span></div>`,
  /* vaso: capas de abajo hacia arriba, en % del alto */
  vaso:   (capas, paso = .7) => { let t = .6; return `<div class="vaso-fila"><div class="vaso" data-a="pop" data-t=".2">
            ${capas.map(c => { const s = `<div class="capa ${c[0]}" data-a="llena" data-h="${c[1]}" data-t="${t.toFixed(2)}" data-dur=".8"></div>`; t += paso; return s; }).join('')}</div>
            <div class="leyenda">${[...capas].reverse().map((c, i) => `<div data-a="der" data-t="${(.6 + (capas.length - 1 - i) * paso).toFixed(2)}"><i class="capa ${c[0]}"></i>${c[2]}</div>`).join('')}</div></div>`; },
  cierre: ({ ep = 'Café en tu Casa', h, sub, boton = 'Guardalo · Compartilo', tono = 'oscuro', d = 2.4 }) => ({ d, tono,
            html: `${V.ep(ep)}${V.titulo(h, 'm')}${sub ? V.sub(sub) : ''}${V.boton(boton)}` })
};

/* Piezas que usan solo algunos videos */
V.mitades = (a, b) => `<div class="mitades">
  <div class="mitad a" data-a="izq" data-t=".35"><p class="ep">${a[0]}</p><b>${a[1]}</b><span>${a[2]}</span></div>
  <div class="mitad b" data-a="der" data-t=".8"><p class="ep">${b[0]}</p><b>${b[1]}</b><span>${b[2]}</span></div></div>`;
V.cinta = t => `<div class="cinta" data-a="corre">${(t + ' · ').repeat(4)}</div>`;

/* Cada video tiene su `estilo`, para que no se vean todos iguales:
     fondo:   orbes | puntos | aros | bandas | numero (usa la `n` de cada escena) | liso
     entrada: sube | lado | cortina | zoom      (cómo entra cada escena)
     alinea:  centro | izq                                                        */
const VIDEOS = [

  /* ================= CÓMO SE COMPRA Y PRODUCTO ================= */
  {
    id: 'v01-comprar-en-3-pasos', titulo: 'Comprar tu cafetera, en 3 pasos', tema: 'Cómo se compra',
    estilo: { fondo: 'puntos', entrada: 'lado', alinea: 'izq' },
    /* 10,2 s · el precio (desde, por transferencia) a los 4,7 s */
    caption:
      'Comprar tu cafetera lleva tres pasos. 👇\n\n' +
      '1. Elegís la tuya en el sitio, con medidas y ficha completa.\n' +
      `2. Elegís cómo pagar: transferencia con ${V_OFF}% OFF (desde ${fmt(P.transferencia(VD))}) o cuotas sin interés en Mercado Libre.\n` +
      '3. Te llega a tu casa, con envío gratis y número de seguimiento.\n\n' +
      `Todas son nuevas, vienen selladas de fábrica y tienen ${TIENDA.garantiaMeses} meses de garantía oficial.\n\n` +
      vCierre('Guardalo para cuando te decidas, o compartilo con quien está por comprar una.', '¿Vos pagarías por transferencia o en cuotas?') +
      '\n\n#cafeencasa #cafetera #espresso #comprasonline',
    escenas: [
      { d: 1.8, tono: 'oscuro', html: `${V.ep('Cómo comprar')}${V.titulo('Tu cafetera, en <em>3 pasos.</em>')}` },
      { d: 3.6, tono: 'gris', html: `${V.pasos([
          ['Elegís tu cafetera', 'En el sitio, con medidas y ficha completa.'],
          ['Elegís cómo pagar', `Transferencia con ${V_OFF}% OFF o cuotas sin interés.`],
          ['Te llega a tu casa', 'Envío gratis, con seguimiento.']])}${V.precio(VD, 2.9, 'Desde ')}` },
      { d: 2.4, tono: 'oliva', html: `${V.ep('Siempre')}${V.titulo('Nueva y sellada de fábrica.', 'm')}${V.chips(['Envío gratis', `${TIENDA.garantiaMeses} meses de garantía`], .7)}` },
      V.cierre({ h: '¿Transferencia o cuotas?', sub: 'Guardalo para cuando te decidas.' })
    ]
  },
  {
    id: 'v02-transferencia-o-cuotas', titulo: '¿Transferencia o cuotas?', tema: 'Cómo se compra',
    estilo: { fondo: 'liso', entrada: 'cortina', alinea: 'centro' },
    /* 9,8 s · los dos precios a los 2,15 s y 2,6 s */
    caption:
      '¿Transferencia o cuotas? Vos elegís. 👇\n\n' +
      `Transferencia o efectivo: ${V_OFF}% OFF. La ${VM.modelo} queda en ${fmt(P.transferencia(VM))}. Nos escribís por WhatsApp, te confirmamos stock y despachamos apenas se acredita.\n` +
      `Cuotas sin interés: ${VM.cuotas} de ${fmt(P.cuota(VM))} con tarjeta, desde nuestra publicación en Mercado Libre.\n\n` +
      'El descuento no se combina con las cuotas. En los dos casos, el envío es gratis.\n\n' +
      vCierre('Guardalo para hacer la cuenta, o compartilo con quien está por comprar.', '¿Vos de qué lado estás: transferencia o cuotas?') +
      '\n\n#cafeencasa #cafetera #cuotassininteres',
    escenas: [
      { d: 1.8, tono: 'oliva', html: `${V.ep('Formas de pago')}${V.titulo('¿Transferencia o cuotas?')}` },
      { d: 3.4, tono: 'oscuro', html: V.mitades(
          [`Transferencia · ${V_OFF}% OFF`, fmt(P.transferencia(VM)), `${VM.modelo}, por WhatsApp.`],
          ['Mercado Libre', `${VM.cuotas} × ${fmt(P.cuota(VM))}`, 'Cuotas sin interés, con tarjeta.']) },
      { d: 2.2, html: `${V.ep('En los dos casos')}${V.titulo('Envío <em>gratis</em> a todo el país.', 'm')}` },
      V.cierre({ h: '¿Vos de qué lado estás?', sub: 'Guardalo para hacer la cuenta.', tono: 'oliva' })
    ]
  },
  {
    id: 'v03-pagaste-y-ahora', titulo: 'Pagaste. ¿Y ahora?', tema: 'Cómo se compra',
    estilo: { fondo: 'aros', entrada: 'zoom', alinea: 'centro' },
    caption:
      'Pagaste. ¿Y ahora? Así sigue. 👇\n\n' +
      'Despachamos el mismo día hábil si el pago se acredita antes de las 15 h.\n' +
      'Te pasamos el número de seguimiento apenas sale.\n' +
      'Llega en 24 a 72 h en AMBA y en hasta 5 días hábiles en el interior.\n\n' +
      'El envío es gratis a todo el país, por Mercado Envíos.\n\n' +
      vCierre('Guardalo para cuando compres, o compartilo con quien está esperando un envío.', '¿Desde qué ciudad nos leés?') +
      '\n\n#cafeencasa #cafetera #enviogratis',
    escenas: [
      { d: 2.6, tono: 'oscuro', html: `${V.titulo('Pagaste.<br>¿Y <em>ahora?</em>')}` },
      { d: 6.2, tono: 'oscuro', html: `${V.ep('El recorrido')}${V.pasos([
          ['Despachamos en el día', 'Si el pago se acredita antes de las 15 h.'],
          ['Viaja con seguimiento', 'Te pasamos el número apenas sale.'],
          ['Llega a tu casa', '24 a 72 h en AMBA. Hasta 5 días hábiles en el interior.']], true)}` },
      { d: 3.4, tono: 'oliva', html: `${V.ep('A todo el país')}${V.titulo('Envío <em>gratis.</em>')}${V.sub('Por Mercado Envíos.')}` },
      V.cierre({ h: 'Todo el detalle, en el sitio.' })
    ]
  },
  {
    id: 'v04-magnifica-s-en-15-segundos', titulo: 'La Magnifica S, en segundos', tema: 'Producto',
    estilo: { fondo: 'liso', entrada: 'zoom', alinea: 'izq' },
    caption:
      `${P.nombre(VM)}, en pocas palabras. ☕\n\n` +
      VM.highlights.map(h => '· ' + h).join('\n') + '\n\n' +
      vPrecios(VM) + '\n\n' +
      'Conocela desde el link de la bio.\n\n#delonghi #magnificas #cafeencasa #cafetera #espresso',
    escenas: [
      { d: 3.2, html: `${V.cinta('Magnifica S')}${V.ep(VM.etiqueta)}${V.titulo(VM.modelo)}${V.foto(VM.imgs[0], [], 'alta')}` },
      { d: 4.0, tono: 'gris', html: `${V.cinta('Del grano a la taza')}${V.titulo('Del grano a la taza', 's')}${V.foto(VM.imgs[1], [
          { txt: 'Muele en el momento', t: 1.0, pos: 'top:60px;left:36px' },
          { txt: '13 niveles', t: 1.5, pos: 'top:300px;right:30px' },
          { txt: '15 bares', t: 2.0, pos: 'bottom:70px;left:60px' }], 'alta')}` },
      { d: 3.4, html: `${V.cinta('Cappuccino · Latte')}${V.titulo('Y espuma la leche', 's')}${V.foto(VM.imgs[2], [{ txt: 'Cappuccino y latte', t: 1.1, pos: 'bottom:70px;right:40px' }], 'alta')}` },
      V.cierre({ ep: P.nombre(VM), h: 'Conocela en el sitio.', sub: `${V_OFF}% OFF por transferencia o ${VM.cuotas} cuotas sin interés.` })
    ]
  },
  {
    id: 'v05-5-cosas-de-la-magnifica-s', titulo: '5 cosas que hace la Magnifica S', tema: 'Producto',
    estilo: { fondo: 'numero', entrada: 'lado', alinea: 'izq' },
    caption:
      `5 cosas que hace la ${P.nombre(VM)}. 👇\n\n` +
      '1. Muele el grano en el momento, en cada taza.\n' +
      '2. Tiene 13 niveles de molienda.\n' +
      '3. Prepara el café con un botón, sin menús ni pantallas.\n' +
      '4. Espuma la leche para cappuccino y latte.\n' +
      '5. Acepta grano entero o café ya molido.\n\n' +
      vPrecios(VM) + '\n\n' +
      vCierre('Guardalo para comparar, o compartilo con quien está buscando cafetera.', '¿Cuál de las cinco es la que más te importa?') +
      '\n\n#delonghi #magnificas #cafeencasa #cafetera',
    escenas: [
      { d: 2.8, tono: 'oscuro', html: `${V.numero(5)}${V.sub('cosas que hace la Magnifica S', 'data-t=".9"')}` },
      { d: 3.6, n: 1, tono: 'gris', html: `${V.titulo('Muele el grano en el momento', 's')}${V.foto(VM.imgs[1])}` },
      { d: 3.8, n: 2, html: `${V.titulo('13 niveles de molienda', 's')}${V.dial(-120, 60)}` },
      { d: 3.6, n: 3, tono: 'gris', html: `${V.titulo('Un botón por taza', 's')}${V.foto(VM.imgs[3])}` },
      { d: 3.6, n: 4, html: `${V.titulo('Espuma la leche', 's')}${V.foto(VM.imgs[2])}` },
      { d: 3.6, n: 5, tono: 'oliva', html: `${V.titulo('Grano entero o café molido', 'm')}${V.chips(['Grano entero', 'Café molido'], .9)}${V.sub('Acepta los dos.', 'data-t="1.6"')}` },
      V.cierre({ ep: P.nombre(VM), h: 'La ficha completa, en el sitio.' })
    ]
  },

  /* ================= TIPS DE CAFÉ ================= */
  {
    id: 'v06-molienda-fina-o-gruesa', titulo: '¿Molienda fina o gruesa?', tema: 'Tips de café',
    estilo: { fondo: 'aros', entrada: 'sube', alinea: 'centro' },
    /* 11,5 s · "13 niveles en la Magnifica S" a los 2 s y el precio a los 3 s */
    caption:
      '¿Molienda fina o gruesa? Cambia la taza. ☕\n\n' +
      'Más fina: el café sale con más cuerpo y más intenso.\n' +
      'Más gruesa: sale más suave y liviano.\n\n' +
      `No hay una correcta: es a tu gusto. La ${VM.modelo} tiene 13 niveles para encontrarlo, y sale ${fmt(P.transferencia(VM))} por transferencia (${V_OFF}% OFF).\n\n` +
      vCierre('Guardalo para tu próximo café, o compartilo con alguien que lo toma muy fuerte.', '¿Vos lo preferís con cuerpo o suave?') +
      '\n\n#cafeencasa #molienda #espresso #barista',
    escenas: [
      { d: 1.8, tono: 'oliva', html: `${V.ep('Tip de café')}${V.titulo('¿Molienda fina o <em>gruesa?</em>')}` },
      { d: 2.8, tono: 'oscuro', html: `${V.numero(13)}${V.sub('niveles de molienda en la Magnifica S', 'data-t=".2"')}${V.precio(VM, 1.2)}` },
      { d: 2.3, tono: 'gris', html: `${V.titulo('Más fina', 'm')}${V.dial(60, -100)}${V.sub('Más cuerpo, más intenso.', 'data-t="1.1"')}` },
      { d: 2.3, tono: 'oscuro', html: `${V.titulo('Más gruesa', 'm')}${V.dial(-100, 100)}${V.sub('Más suave, más liviano.', 'data-t="1.1"')}` },
      V.cierre({ h: '¿Con cuerpo o suave?', sub: 'Guardalo para tu próximo café.' })
    ]
  },
  {
    id: 'v07-cortado-cappuccino-o-latte', titulo: 'Cortado, cappuccino o latte', tema: 'Tips de café',
    estilo: { fondo: 'puntos', entrada: 'cortina', alinea: 'centro' },
    /* 11,8 s · el primer vaso al segundo 2,4 y el precio a los 2,8 s */
    caption:
      'Cortado, cappuccino o latte: ¿qué lleva cada uno? ☕\n\n' +
      'Cortado: espresso con un poco de leche.\n' +
      'Cappuccino: espresso, leche y espuma en partes parecidas.\n' +
      'Latte: espresso con mucha leche y una capa fina de espuma.\n\n' +
      `Los tres salen del mismo espresso y de un buen espumador. La ${VM.modelo} trae los dos: ${fmt(P.transferencia(VM))} por transferencia (${V_OFF}% OFF).\n\n` +
      vCierre('Guardalo para la próxima vez que pidas en un bar, o compartilo con quien siempre pide lo mismo.', '¿Vos sos de cortado, cappuccino o latte?') +
      '\n\n#cafeencasa #cappuccino #latte #cortado',
    escenas: [
      { d: 1.8, html: `${V.ep('Tip de café')}${V.titulo('Cortado, cappuccino o latte.', 'm')}` },
      { d: 2.4, tono: 'gris', html: `${V.titulo('Cortado', 'm')}${V.vaso([['espresso', 55, 'Espresso'], ['leche', 22, 'Un poco de leche']], .45)}${V.precio(VM, 1)}` },
      { d: 2.6, html: `${V.titulo('Cappuccino', 'm')}${V.vaso([['espresso', 30, 'Espresso'], ['leche', 30, 'Leche'], ['espuma', 30, 'Espuma']], .45)}` },
      { d: 2.6, tono: 'gris', html: `${V.titulo('Latte', 'm')}${V.vaso([['espresso', 22, 'Espresso'], ['leche', 58, 'Mucha leche'], ['espuma', 10, 'Poca espuma']], .45)}` },
      V.cierre({ h: '¿Vos de cuál sos?', sub: 'Guardalo para la próxima.', tono: 'oliva' })
    ]
  },
  {
    id: 'v08-grano-entero-o-molido', titulo: '¿Grano entero o café molido?', tema: 'Tips de café',
    estilo: { fondo: 'bandas', entrada: 'sube', alinea: 'izq' },
    caption:
      '¿Grano entero o café molido? ☕\n\n' +
      'El café empieza a perder aroma apenas se muele. Por eso el grano entero, molido en el momento, llega más fresco a la taza.\n' +
      'El café ya molido es más práctico: conviene comprar de a poco y usarlo pronto.\n\n' +
      `La ${VM.modelo} muele el grano en cada taza, y también acepta café molido.\n\n` +
      vCierre('Guardalo para tu próxima compra de café, o compartilo con quien compra siempre molido.', '¿Vos comprás en grano o molido?') +
      '\n\n#cafeencasa #cafeengrano #espresso',
    escenas: [
      { d: 3.2, tono: 'oliva', html: `${V.ep('Tip de café')}${V.titulo('El café pierde aroma apenas se muele.', 'm')}` },
      { d: 5.0, tono: 'oscuro', html: V.mitades(
          ['Grano entero', 'Más fresco', 'Se muele en el momento, taza por taza.'],
          ['Ya molido', 'Más práctico', 'Conviene comprar de a poco y usarlo pronto.']) },
      { d: 4.0, html: `${V.titulo('La Magnifica S muele en cada taza', 's')}${V.foto(VM.imgs[1], [{ txt: 'También acepta molido', t: 1.4, pos: 'bottom:70px;left:50px' }])}` },
      V.cierre({ ep: P.nombre(VM), h: 'Conocela en el sitio.' })
    ]
  },
  {
    id: 'v09-3-habitos-para-un-cafe-mejor', titulo: '3 hábitos para un café mejor', tema: 'Tips de café',
    estilo: { fondo: 'numero', entrada: 'cortina', alinea: 'izq' },
    /* 10,6 s · los tres hábitos antes del segundo 6 (1,6 · 3,6 · 5,6); el precio va en el cierre */
    caption:
      '3 hábitos para un café mejor en casa. ☕\n\n' +
      '1. Guardá el café en un frasco hermético, lejos de la luz y el calor.\n' +
      '2. Precalentá la taza: el espresso se enfría rápido.\n' +
      '3. Mantené limpia la cafetera: los restos de café viejo cambian el sabor.\n\n' +
      vCierre('Guardalo para tenerlo a mano, o compartilo con quien te hace el café.', '¿Cuál de los tres ya hacías?') +
      '\n\n#cafeencasa #tipsdecafe #espresso #barista',
    escenas: [
      { d: 1.6, tono: 'oliva', html: `${V.numero(3)}${V.sub('hábitos para un café mejor en casa', 'data-t=".5"')}` },
      { d: 2.0, n: 1, tono: 'oscuro', html: `${V.titulo('Guardá el café en un frasco hermético', 'm')}${V.sub('Lejos de la luz y el calor.', 'data-t=".7"')}` },
      { d: 2.0, n: 2, tono: 'gris', html: `${V.titulo('Precalentá la taza', 'm')}${V.sub('El espresso se enfría rápido.', 'data-t=".6"')}` },
      { d: 2.2, n: 3, tono: 'oscuro', html: `${V.titulo('Mantené limpia la cafetera', 'm')}${V.sub('El café viejo cambia el sabor.', 'data-t=".7"')}` },
      V.cierre({ tono: 'oliva', h: '¿Cuál ya hacías?', sub: `${VM.modelo}: ${fmt(P.transferencia(VM))} por transferencia.`, d: 2.8 })
    ]
  },
  {
    id: 'v10-la-magnifica-s-es-para-vos', titulo: '¿La Magnifica S es para vos?', tema: 'Producto',
    estilo: { fondo: 'orbes', entrada: 'zoom', alinea: 'centro' },
    caption:
      `¿La ${VM.modelo} es para vos? Fijate si te suena. 👇\n\n` +
      '· En tu casa se toman varios cafés por día\n' +
      '· Querés apretar un botón y listo\n' +
      '· Te gusta el café con leche\n' +
      `· Tenés ${String(VM.medidas.ancho).replace('.', ',')} cm libres en la mesada\n\n` +
      'Si todavía dudás, el test de 4 preguntas del sitio te recomienda una. Link en la bio.\n\n#delonghi #magnificas #cafeencasa #cafetera',
    escenas: [
      { d: 3.2, html: `${V.ep('¿Es para vos?')}${V.titulo(VM.modelo)}${V.foto(VM.imgs[0], [], 'alta')}` },
      { d: 5.6, tono: 'gris', html: `${V.titulo('Es para vos si…', 's')}${V.checks([
          'Toman varios cafés por día',
          'Querés apretar un botón',
          'Te gusta el café con leche',
          `Tenés ${String(VM.medidas.ancho).replace('.', ',')} cm de mesada`], .6, .8)}` },
      { d: 2.8, tono: 'oliva', html: `${V.titulo('Entonces <em>sí.</em>')}` },
      V.cierre({ ep: '¿Todavía dudás?', h: 'Hacé el test de 4 preguntas.', sub: 'Te recomendamos una y te contamos por qué.' })
    ]
  },

  /* ================= FECHAS ================= */
  {
    id: 'v11-que-le-regalas-a-mama', titulo: '¿Qué le regalás a mamá?', tema: 'Día de la Madre',
    estilo: { fondo: 'orbes', entrada: 'zoom', alinea: 'centro' },
    /* 10 s · gancho en 0-1 s; Magnifica S + precio con 20% OFF a los 2,8 s */
    caption:
      '¿Qué le regalás a mamá este domingo? ☕\n\n' +
      `La ${P.nombre(VM)}: del grano a la taza con un botón. Muele en el momento, prepara el espresso y espuma la leche para el cappuccino.\n\n` +
      vPrecios(VM) + ` · ${TIENDA.garantiaMeses} meses de garantía oficial\n\n` +
      'Para consultas y fechas de entrega, escribinos por WhatsApp.\n\n' +
      vCierre('Compartilo con quien la va a regalar.', '¿Para quién sería: tu mamá, tu suegra o tu abuela?') +
      '\n\n#diadelamadre #regalodiadelamadre #cafeencasa #delonghi #magnificas',
    escenas: [
      { d: 1.8, tono: 'oscuro', html: `${V.ep('Día de la Madre · 18/10')}${V.titulo('¿Qué le regalás a <em>mamá?</em>')}` },
      { d: 3.4, tono: 'gris', html: `${V.ep(VM.modelo, 'data-t=".05"')}${V.titulo('Del grano a la taza con un botón.', 's', 'data-t=".1"')}${V.foto(VM.imgs[1])}${V.precio(VM, 1)}` },
      { d: 2.2, html: `${V.ep('Para regalar tranquilo')}${V.chips([`${VM.cuotas} cuotas sin interés`, 'Envío gratis', `${TIENDA.garantiaMeses} meses de garantía`], .3)}` },
      V.cierre({ ep: 'Día de la Madre', h: 'Compartilo con quien la va a regalar.', sub: '¿Para quién sería?', boton: 'Compartilo', d: 2.6 })
    ]
  }
];

if (typeof module !== 'undefined') module.exports = VIDEOS;
