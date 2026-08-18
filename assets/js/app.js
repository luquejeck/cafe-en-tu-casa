/* ============================================================
   CAFÉ EN TU CASA — Lógica de la tienda
   Renderiza tiles del home, tabla comparativa y ficha de producto
   a partir de assets/js/productos.js
   ============================================================ */

/* ---------- Iconos ---------- */
const ICO = {
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z"/><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.53 3.7-8.22 8.24-8.22a8.18 8.18 0 0 1 5.81 2.41 8.16 8.16 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23Z"/></svg>',
  tarjeta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/></svg>',
  banco: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10h18L12 3 3 10Z"/><path d="M5 10v8m5-8v8m4-8v8m5-8v8M3 21h18"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 13 4 4L19 7"/></svg>',
  camion: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16V6a1 1 0 0 1 1-1h11v11M15 9h4l2 3v4h-3"/><circle cx="7.5" cy="17.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/></svg>',
  escudo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4.5 6v5.5c0 4.4 3.1 8.4 7.5 9.5 4.4-1.1 7.5-5.1 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  cambio: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/></svg>',
  grano: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="12" rx="6" ry="9" transform="rotate(35 12 12)"/><path d="M8 17c3-2.5 5-7 5-10"/></svg>'
};

/* ---------- Bloque de opciones de pago ---------- */
function pagosHTML(p) {
  const transf = P.transferencia(p);
  const off = TIENDA.descuentoTransferencia * 100;

  return `
  <div class="pagos pagos-2">

    <article class="pago pago-destacado">
      <span class="pago-tag">${off}% OFF</span>
      <h3 class="pago-titulo">${ICO.banco} Transferencia o efectivo</h3>
      <div class="pago-tachado">${fmt(p.precioML)}</div>
      <div class="pago-monto">${fmt(transf)}</div>
      <div class="pago-ahorro">Ahorrás ${fmt(P.ahorro(p))}</div>
      <ul class="pago-lista">
        <li>Coordinás por WhatsApp</li>
        <li>Despachamos el mismo día hábil</li>
      </ul>
      <a class="btn btn-wa btn-bloque pago-cta" href="${waProducto(p)}"
         target="_blank" rel="noopener"
         data-evento="wa-comprar" data-producto="${p.id}">
        ${ICO.wa} Comprar por WhatsApp
      </a>
    </article>

    <article class="pago">
      <span class="pago-tag pago-tag-ml">Cuotas</span>
      <h3 class="pago-titulo">${ICO.tarjeta} Tarjeta en Mercado Libre</h3>
      ${P.tieneOferta(p) ? `<div class="pago-tachado">${fmt(p.precioLista)}</div>` : ''}
      <div class="pago-monto">${fmt(p.precioML)}</div>
      <p class="pago-sub"><span class="verde">${p.cuotas} cuotas sin interés de ${fmt(P.cuota(p))}</span></p>
      <ul class="pago-lista">
        <li>Débito, crédito o dinero en cuenta</li>
        <li>Con Compra Protegida</li>
      </ul>
      <a class="btn btn-ml btn-bloque pago-cta" href="${p.linkML}"
         target="_blank" rel="noopener"
         data-evento="ml-comprar" data-producto="${p.id}">
        Comprar en Mercado Libre
      </a>
    </article>

  </div>`;
}

/* ---------- Tiles del home ---------- */
function renderTiles(cont) {
  cont.innerHTML = PRODUCTOS.map((p, i) => {
    const ancho = i === 0 ? ' tile-ancho' : '';
    const cinta = `<span class="tile-cinta">${TIENDA.descuentoTransferencia * 100}% OFF transferencia</span>`;

    return `
    <article class="tile${ancho} aparece" data-retraso="${Math.min(i, 3)}">
      ${cinta}
      <div class="tile-cab">
        <p class="tile-etiqueta">${p.etiqueta} · ${p.tipo}</p>
        <h3>${p.marca} ${p.modelo}</h3>
        <p>${p.tagline}</p>
        <p class="tile-precio">
          Desde <b>${fmt(P.transferencia(p))}</b> con transferencia
          <br><span class="cuota">o ${p.cuotas} cuotas sin interés de ${fmt(P.cuota(p))}</span>
        </p>
        <div class="tile-acciones">
          <a class="enlace" href="${P.url(p)}">Ver detalle</a>
          <a class="enlace" href="${waProducto(p)}" target="_blank" rel="noopener"
             data-evento="wa-tile" data-producto="${p.id}">Comprar con ${TIENDA.descuentoTransferencia * 100}% OFF</a>
        </div>
      </div>
      <div class="tile-img">
        <img src="${p.imgs[0]}" alt="${p.marca} ${p.modelo}" loading="lazy" width="600" height="600">
      </div>
    </article>`;
  }).join('');
}

/* ---------- Tabla comparativa ---------- */
function renderComparativa(tabla) {
  const filas = [
    ['Tipo',              p => p.tipo],
    ['Molinillo',         p => p.id === 'dedica' ? 'No (café molido)' : 'Integrado'],
    ['Leche',             p => p.id === 'dedica' ? 'Cappuccino System' : 'Vaporizador manual'],
    ['Ideal para',        p => p.id === 'dedica'
                                ? 'Disfrutar el ritual manual'
                                : (p.id === 'magnifica-s' ? 'Café de grano sin esfuerzo' : 'Entrar al mundo del grano')],
    ['Precio transferencia', p => `${fmt(P.transferencia(p))}<span class="comparativa-mini">${TIENDA.descuentoTransferencia * 100}% OFF</span>`, 'fila-precio'],
    ['Cuotas en ML',      p => `${p.cuotas} sin interés<span class="comparativa-mini">de ${fmt(P.cuota(p))}</span>`]
  ];

  tabla.innerHTML = `
    <thead>
      <tr>
        <th>Comparar</th>
        ${PRODUCTOS.map(p => `<th>${p.marca}<br>${p.modelo}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${filas.map(([etiqueta, fn, clase]) => `
        <tr class="${clase || ''}">
          <th scope="row">${etiqueta}</th>
          ${PRODUCTOS.map(p => `<td>${fn(p)}</td>`).join('')}
        </tr>`).join('')}
      <tr>
        <th scope="row"></th>
        ${PRODUCTOS.map(p => `<td><a class="enlace" href="${P.url(p)}">Ver ficha</a></td>`).join('')}
      </tr>
    </tbody>`;
}

/* ---------- Ficha de producto ---------- */
function renderPDP(id) {
  const p = getProducto(id);
  if (!p) return;

  const nombre = P.nombre(p);
  document.querySelectorAll('[data-slot="nombre"]').forEach(el => el.textContent = nombre);

  /* Galería */
  const galeria = document.querySelector('[data-slot="galeria"]');
  if (galeria) {
    galeria.innerHTML = `
      <div class="galeria-marco">
        <img id="img-principal" src="${p.imgs[0]}" alt="${nombre}" width="900" height="900">
      </div>
      ${p.imgs.length > 1 ? `
        <div class="galeria-miniaturas" role="tablist" aria-label="Fotos del producto">
          ${p.imgs.map((src, i) => `
            <button type="button" role="tab" aria-selected="${i === 0}"
                    aria-label="Foto ${i + 1}" data-src="${src}">
              <img src="${src}" alt="" loading="lazy">
            </button>`).join('')}
        </div>` : ''}`;

    galeria.querySelectorAll('.galeria-miniaturas button').forEach(b => {
      b.addEventListener('click', () => {
        galeria.querySelector('#img-principal').src = b.dataset.src;
        galeria.querySelectorAll('[role="tab"]').forEach(x => x.setAttribute('aria-selected', x === b));
      });
    });
  }

  /* Buy box */
  const compra = document.querySelector('[data-slot="compra"]');
  if (compra) {
    compra.innerHTML = `
      <p class="compra-tipo">${p.tipo} · ${p.marca} · ${p.sku}</p>
      <h1>${nombre}</h1>
      <p class="compra-tagline">${p.tagline}</p>

      <p class="estado-stock${p.stock ? '' : ' agotado'}">
        ${p.stock ? 'Stock disponible · Envío inmediato' : 'Sin stock por el momento'}
      </p>

      ${pagosHTML(p)}

      <div class="beneficios-lista">
        <div class="beneficio">${ICO.camion}<span><b>Envío gratis a todo el país.</b> Por Mercado Envíos, con seguimiento.</span></div>
        <div class="beneficio">${ICO.escudo}<span><b>${TIENDA.garantiaMeses} meses de garantía oficial.</b> Producto nuevo, sellado de fábrica.</span></div>
        <div class="beneficio">${ICO.cambio}<span><b>Devolución gratis.</b> Tenés 30 días desde que la recibís.</span></div>
      </div>

      <div class="destacados">
        ${p.highlights.map(h => `<p class="destacado">${h}</p>`).join('')}
      </div>`;
  }

  /* Especificaciones */
  const specs = document.querySelector('[data-slot="specs"]');
  if (specs) {
    specs.innerHTML = `<tbody>${p.specs.map(([k, v]) =>
      `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody>`;
  }

  /* Descripción */
  const desc = document.querySelector('[data-slot="descripcion"]');
  if (desc) {
    desc.innerHTML = p.descripcion.split('\n\n').map(t => `<p>${t}</p>`).join('');
  }

  /* Otros productos */
  const otros = document.querySelector('[data-slot="otros"]');
  if (otros) {
    otros.innerHTML = PRODUCTOS.filter(o => o.id !== p.id).map((o, i) => `
      <article class="tile aparece" data-retraso="${i}">
        <div class="tile-cab">
          <p class="tile-etiqueta">${o.tipo}</p>
          <h3>${o.marca} ${o.modelo}</h3>
          <p>${o.tagline}</p>
          <p class="tile-precio">Desde <b>${fmt(P.transferencia(o))}</b> con transferencia</p>
          <div class="tile-acciones"><a class="enlace" href="${P.url(o)}">Ver detalle</a></div>
        </div>
        <div class="tile-img">
          <img src="${o.imgs[0]}" alt="${P.nombre(o)}" loading="lazy" width="600" height="600">
        </div>
      </article>`).join('');
  }

  /* Barra móvil */
  const barra = document.querySelector('[data-slot="barra-movil"]');
  if (barra) {
    barra.innerHTML = `
      <div class="barra-movil-precio">
        <b>${fmt(P.transferencia(p))}</b>
        <small>${TIENDA.descuentoTransferencia * 100}% OFF transferencia</small>
      </div>
      <a class="btn btn-wa" href="${waProducto(p)}" target="_blank" rel="noopener"
         data-evento="wa-barra" data-producto="${p.id}">${ICO.wa} WhatsApp</a>
      <a class="btn btn-ml" href="${p.linkML}" target="_blank" rel="noopener"
         data-evento="ml-barra" data-producto="${p.id}">Cuotas</a>`;
    document.body.classList.add('tiene-barra');
  }

  /* SEO: meta descripción y datos estructurados (el <title> ya viene en el HTML) */
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = `${nombre}. ${p.resumen} ${fmt(P.transferencia(p))} con transferencia (${TIENDA.descuentoTransferencia * 100}% OFF) o ${p.cuotas} cuotas sin interés. Envío gratis a todo el país.`;

  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: nombre,
    image: [new URL(p.imgs[0], location.href).href],
    description: p.resumen,
    sku: p.sku,
    brand: { '@type': 'Brand', name: p.marca },
    offers: {
      '@type': 'Offer',
      url: location.href,
      priceCurrency: 'ARS',
      price: P.transferencia(p),
      availability: p.stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: TIENDA.nombre }
    }
  });
  document.head.appendChild(ld);
}

/* ---------- Navegación móvil ---------- */
function initNav() {
  const burger = document.querySelector('.nav-burger');
  const menu = document.querySelector('.menu-movil');
  if (!burger || !menu) return;

  const cerrar = () => {
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('abierto');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    const abierto = burger.getAttribute('aria-expanded') === 'true';
    if (abierto) { cerrar(); return; }
    menu.style.top = document.querySelector('.nav').getBoundingClientRect().bottom + 'px';
    burger.setAttribute('aria-expanded', 'true');
    menu.classList.add('abierto');
    document.body.style.overflow = 'hidden';
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrar));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });
  window.addEventListener('resize', () => { if (innerWidth > 900) cerrar(); });
}

/* ---------- Animación al hacer scroll ----------
   Se comprueba en cada frame de scroll (con requestAnimationFrame) en lugar de
   usar IntersectionObserver: si el usuario baja de golpe o entra por un ancla,
   el observer no dispara y la sección se queda invisible para siempre.        */
function initScroll() {
  const pendientes = [...document.querySelectorAll('.aparece')];
  if (!pendientes.length) return;

  const revisar = () => {
    const limite = window.innerHeight * 0.92;
    for (let i = pendientes.length - 1; i >= 0; i--) {
      if (pendientes[i].getBoundingClientRect().top < limite) {
        pendientes[i].classList.add('visible');
        pendientes.splice(i, 1);
      }
    }
    if (!pendientes.length) {
      window.removeEventListener('scroll', programar);
      window.removeEventListener('resize', programar);
    }
  };

  let encolado = false;
  function programar() {
    if (encolado) return;
    encolado = true;
    requestAnimationFrame(() => { encolado = false; revisar(); });
  }

  window.addEventListener('scroll', programar, { passive: true });
  window.addEventListener('resize', programar);
  window.addEventListener('load', programar);
  revisar();
}

/* ---------- Datos comunes en el HTML ---------- */
function initComunes() {
  document.querySelectorAll('[data-wa-general]').forEach(a => {
    a.href = waLink(a.dataset.waGeneral || 'Hola! Quiero asesoramiento para elegir una cafetera.');
  });
  document.querySelectorAll('[data-slot="anio"]').forEach(el => el.textContent = new Date().getFullYear());
  document.querySelectorAll('[data-slot="wa-visible"]').forEach(el => el.textContent = TIENDA.whatsappVisible);
  document.querySelectorAll('[data-slot="email"]').forEach(el => {
    el.textContent = TIENDA.email;
    if (el.tagName === 'A') el.href = 'mailto:' + TIENDA.email;
  });
  document.querySelectorAll('[data-slot="off"]').forEach(el => {
    el.textContent = TIENDA.descuentoTransferencia * 100 + '%';
  });
  document.querySelectorAll('[data-ico]').forEach(el => {
    if (ICO[el.dataset.ico]) el.innerHTML = ICO[el.dataset.ico];
  });
}

/* ---------- Arranque ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initComunes();

  const tiles = document.querySelector('[data-slot="tiles"]');
  if (tiles) renderTiles(tiles);

  const comp = document.querySelector('[data-slot="comparativa"]');
  if (comp) renderComparativa(comp);

  const pdpId = document.body.dataset.producto;
  if (pdpId) renderPDP(pdpId);

  initNav();
  initScroll();
});
