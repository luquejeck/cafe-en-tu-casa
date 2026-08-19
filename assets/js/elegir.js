/* ============================================================
   RECOMENDADOR — "¿Cuál es tu cafetera?"
   4 preguntas -> una ganadora + una segunda opción.

   CÓMO FUNCIONA EL PUNTAJE
   Cada producto arranca con los puntos de SESGO y va sumando
   según lo que responde la persona. Gana el que más junta.

   Hay una sola regla que está por encima del puntaje: si alguien
   dice que tiene menos de 20 cm de mesada, las dos superautomáticas
   quedan descartadas porque FÍSICAMENTE no entran (miden 24 cm).
   Recomendar algo que no entra vuelve como devolución.
   ============================================================ */

/* Ventaja inicial de la Magnifica S: ante empate o duda, gana ella.
   La Krups conserva su nicho real (poco volumen y mesada justa) para que
   el test no termine dando siempre el mismo resultado, que se nota enseguida. */
const SESGO = {
  'magnifica-s': 3,
  'krups-roma': 2,
  'dedica': 0
};

const PREGUNTAS = [
  {
    id: 'cafes',
    titulo: '¿Cuántos cafés se toman por día en tu casa?',
    ayuda: 'Contando a todos los que viven con vos.',
    opciones: [
      { txt: '1 o 2',        pie: 'Uno a la mañana y poco más',      resumen: '1 o 2 cafés por día',
        puntos: { 'magnifica-s': 0, 'krups-roma': 3, 'dedica': 2 } },
      { txt: '3 a 5',        pie: 'Somos dos y repetimos',           resumen: '3 a 5 cafés por día',
        puntos: { 'magnifica-s': 3, 'krups-roma': 2, 'dedica': -1 } },
      { txt: 'Más de 5',     pie: 'Casa con movimiento',             resumen: 'más de 5 cafés por día',
        puntos: { 'magnifica-s': 5, 'krups-roma': 1, 'dedica': -3 } }
    ]
  },
  {
    id: 'leche',
    titulo: '¿Tomás el café con leche?',
    ayuda: 'Cappuccino, latte, flat white, cortado.',
    opciones: [
      { txt: 'Sí, casi siempre', pie: 'Cappuccino o latte todos los días', resumen: 'tomo con leche casi siempre',
        puntos: { 'magnifica-s': 3, 'krups-roma': 3, 'dedica': 0 } },
      { txt: 'A veces',          pie: 'Depende del día',                   resumen: 'a veces con leche',
        puntos: { 'magnifica-s': 3, 'krups-roma': 2, 'dedica': 1 } },
      { txt: 'No, solo negro',   pie: 'Espresso puro',                     resumen: 'tomo solo café negro',
        puntos: { 'magnifica-s': 1, 'krups-roma': 1, 'dedica': 3 } }
    ]
  },
  {
    id: 'espacio',
    titulo: '¿Cuánto lugar libre tenés en la mesada?',
    ayuda: 'Medí el ancho disponible. Es lo que más devoluciones evita.',
    opciones: [
      { txt: 'Menos de 20 cm', pie: 'Justo, muy justo',    resumen: 'tengo menos de 20 cm de mesada',
        puntos: { 'dedica': 4 }, descarta: ['magnifica-s', 'krups-roma'] },
      { txt: '20 a 30 cm',     pie: 'Entra algo mediano',  resumen: 'tengo entre 20 y 30 cm',
        puntos: { 'magnifica-s': 0, 'krups-roma': 3, 'dedica': 2 } },
      { txt: 'De sobra',       pie: 'Espacio no es problema', resumen: 'tengo lugar de sobra',
        puntos: { 'magnifica-s': 4, 'krups-roma': 1, 'dedica': 0 } }
    ]
  },
  {
    id: 'ritual',
    titulo: 'A la hora de prepararlo, ¿qué preferís?',
    ayuda: 'No hay respuesta correcta: son dos formas distintas de tomar café.',
    opciones: [
      { txt: 'Apretar un botón',    pie: 'Que la máquina haga todo',        resumen: 'quiero apretar un botón',
        puntos: { 'magnifica-s': 4, 'krups-roma': 4, 'dedica': -3 } },
      { txt: 'Prepararlo yo',       pie: 'Me gusta el ritual del barista',  resumen: 'me gusta prepararlo yo',
        puntos: { 'magnifica-s': -1, 'krups-roma': -1, 'dedica': 6 } },
      { txt: 'Me da igual',         pie: 'Con que salga rico',              resumen: 'me da igual el método',
        puntos: { 'magnifica-s': 3, 'krups-roma': 2, 'dedica': 0 } }
    ]
  }
];

/* ---------- Estado ---------- */
let paso = 0;                 // 0..3 preguntas, 4 = resultado
const elegidas = [];          // opción elegida en cada paso

const $ = s => document.querySelector(s);

/* ---------- Puntaje ---------- */
function calcular() {
  const puntos = {};
  PRODUCTOS.forEach(p => puntos[p.id] = SESGO[p.id] || 0);
  const fuera = new Set();

  elegidas.forEach(o => {
    Object.entries(o.puntos || {}).forEach(([id, n]) => {
      if (puntos[id] !== undefined) puntos[id] += n;
    });
    (o.descarta || []).forEach(id => fuera.add(id));
  });

  return PRODUCTOS
    .map(p => ({ p, puntos: puntos[p.id], fuera: fuera.has(p.id) }))
    .sort((a, b) => (a.fuera - b.fuera) || (b.puntos - a.puntos));
}

/* ---------- Pantallas ---------- */
function pintar() {
  paso >= PREGUNTAS.length ? pintarResultado() : pintarPregunta();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function pintarPregunta() {
  const q = PREGUNTAS[paso];
  const elegida = elegidas[paso];

  $('#quiz').innerHTML = `
    <div class="quiz-progreso" role="progressbar" aria-valuemin="1"
         aria-valuemax="${PREGUNTAS.length}" aria-valuenow="${paso + 1}">
      ${PREGUNTAS.map((_, i) =>
        `<span class="${i < paso ? 'hecho' : i === paso ? 'activo' : ''}"></span>`).join('')}
    </div>

    <p class="quiz-paso">Pregunta ${paso + 1} de ${PREGUNTAS.length}</p>
    <h2 class="t-2 quiz-titulo">${q.titulo}</h2>
    <p class="quiz-ayuda">${q.ayuda}</p>

    <div class="quiz-opciones">
      ${q.opciones.map((o, i) => `
        <button type="button" class="quiz-opcion${elegida === o ? ' elegida' : ''}" data-i="${i}">
          <span class="quiz-opcion-txt">${o.txt}</span>
          <span class="quiz-opcion-pie">${o.pie}</span>
        </button>`).join('')}
    </div>

    ${paso > 0 ? '<button type="button" class="quiz-atras" id="atras">← Volver</button>' : ''}
  `;

  $('#quiz').querySelectorAll('.quiz-opcion').forEach(b => {
    b.addEventListener('click', () => {
      elegidas[paso] = PREGUNTAS[paso].opciones[+b.dataset.i];
      paso++;
      pintar();
    });
  });

  const atras = $('#atras');
  if (atras) atras.addEventListener('click', () => { paso--; pintar(); });
}

function pintarResultado() {
  const orden = calcular();
  const gana = orden[0];
  const segunda = orden[1];
  const p = gana.p;

  const resumen = elegidas.map(o => o.resumen).join(', ');
  const mensajeWa = waLink(
    `Hola! Hice el test en la web: ${resumen}. ` +
    `Me recomendó la ${P.nombre(p)} a ${fmt(P.transferencia(p))} por transferencia. ` +
    `¿Me contás cómo sigo?`
  );

  $('#quiz').innerHTML = `
    <div class="quiz-resultado">
      <p class="epigrafe centro">Tu resultado</p>
      <h2 class="t-1 centro quiz-ganadora-titulo">${P.nombre(p)}</h2>
      <p class="plomo centro quiz-ganadora-bajada">${p.tagline}</p>

      <div class="ganadora">
        <div class="ganadora-img">
          <img src="${p.imgs[0]}" alt="${P.nombre(p)}" width="600" height="600">
        </div>

        <div class="ganadora-datos">
          <p class="ganadora-porque">Te la recomendamos porque dijiste que ${resumen}.</p>

          <ul class="pago-lista">
            ${p.highlights.slice(0, 3).map(h => `<li>${h}</li>`).join('')}
          </ul>

          <div class="ganadora-precio">
            <span class="ganadora-transf">${fmt(P.transferencia(p))}</span>
            <span class="ganadora-etiqueta">con transferencia · ${TIENDA.descuentoTransferencia * 100}% OFF</span>
            <span class="ganadora-cuotas">o ${p.cuotas} cuotas sin interés de ${fmt(P.cuota(p))}</span>
          </div>

          <div class="ganadora-botones">
            <a class="btn btn-wa btn-bloque" href="${mensajeWa}" target="_blank" rel="noopener"
               data-evento="wa-quiz" data-producto="${p.id}">
              ${ICO.wa} Quiero comprarla
            </a>
            <a class="btn btn-fantasma btn-bloque" href="${P.url(p)}"
               data-evento="ficha-quiz" data-producto="${p.id}">Ver la ficha completa</a>
          </div>
        </div>
      </div>

      ${segunda && !segunda.fuera ? `
        <div class="segunda">
          <p class="segunda-titulo">También podría servirte</p>
          <a class="segunda-caja" href="${P.url(segunda.p)}" data-evento="ficha-quiz-2" data-producto="${segunda.p.id}">
            <img src="${segunda.p.imgs[0]}" alt="${P.nombre(segunda.p)}" width="200" height="200" loading="lazy">
            <span class="segunda-datos">
              <b>${P.nombre(segunda.p)}</b>
              <span class="segunda-tagline">${segunda.p.tagline}</span>
              <span class="segunda-precio">Desde ${fmt(P.transferencia(segunda.p))} con transferencia</span>
            </span>
            <span class="segunda-flecha">›</span>
          </a>
        </div>` : ''}

      ${gana.fuera === false && orden.some(o => o.fuera) ? `
        <p class="quiz-nota">Descartamos las superautomáticas porque miden 24 cm de ancho
        y no entran en el espacio que nos dijiste. La Dedica mide 14,9 cm.</p>` : ''}

      <button type="button" class="quiz-rehacer" id="rehacer">Volver a empezar</button>
    </div>
  `;

  $('#rehacer').addEventListener('click', () => {
    paso = 0; elegidas.length = 0; pintar();
  });

  pintarCalculadora(p);
}

/* ---------- Calculadora de amortización ---------- */
function pintarCalculadora(producto) {
  const caja = $('#calculadora');
  if (!caja) return;

  caja.hidden = false;
  caja.dataset.producto = producto.id;
  const porTaza = Math.round(TIENDA.precioKiloCafe / TIENDA.cafesPorKilo);

  caja.innerHTML = `
    <h2 class="t-3">¿En cuánto se paga sola?</h2>
    <p class="chico">Movés los números según tu caso y calcula al instante.</p>

    <div class="calc-campos">
      <label class="calc-campo">
        <span>Cafés que comprás afuera por semana</span>
        <input type="number" id="calc-cantidad" min="0" max="100" step="1" value="10" inputmode="numeric">
      </label>
      <label class="calc-campo">
        <span>Lo que te sale cada uno</span>
        <input type="number" id="calc-precio" min="0" step="100" value="${TIENDA.precioCafeAfuera}" inputmode="numeric">
      </label>
    </div>

    <div class="calc-resultado" id="calc-resultado"></div>

    <p class="mini calc-letra">Tomamos el café en casa a ${fmt(porTaza)} la taza
    (${fmt(TIENDA.precioKiloCafe)} el kilo de grano, ${TIENDA.cafesPorKilo} tazas por kilo)
    y el precio de la ${P.nombre(producto)} pagando por transferencia.
    Es una estimación para darte una idea, no una promesa.</p>
  `;

  const recalcular = () => {
    const cantidad = Math.max(0, +$('#calc-cantidad').value || 0);
    const precio = Math.max(0, +$('#calc-precio').value || 0);
    const porTazaCasa = TIENDA.precioKiloCafe / TIENDA.cafesPorKilo;
    const ahorroMes = cantidad * 4.33 * (precio - porTazaCasa);
    const costo = P.transferencia(producto);
    const salida = $('#calc-resultado');

    if (ahorroMes <= 0) {
      salida.innerHTML = `<p class="calc-vacio">Poné cuántos cafés comprás afuera y cuánto te sale cada uno.</p>`;
      return;
    }

    const meses = costo / ahorroMes;
    const texto = meses < 1
      ? 'menos de un mes'
      : meses < 24
        ? `${Math.round(meses)} ${Math.round(meses) === 1 ? 'mes' : 'meses'}`
        : `${(meses / 12).toFixed(1)} años`;

    salida.innerHTML = `
      <div class="calc-numero">
        <span class="calc-numero-grande">${texto}</span>
        <span class="calc-numero-pie">es lo que tarda en pagarse sola</span>
      </div>
      <div class="calc-detalle">
        <span>Gastás afuera <b>${fmt(cantidad * 4.33 * precio)}</b> por mes</span>
        <span>En casa te saldría <b>${fmt(cantidad * 4.33 * porTazaCasa)}</b></span>
        <span class="calc-ahorro">Ahorrás <b>${fmt(ahorroMes)}</b> por mes</span>
      </div>`;
  };

  $('#calc-cantidad').addEventListener('input', recalcular);
  $('#calc-precio').addEventListener('input', recalcular);
  recalcular();
}

/* ---------- Comparación de medidas ---------- */
function pintarMedidas() {
  const caja = $('[data-slot="medidas"]');
  if (!caja) return;

  const conMedidas = PRODUCTOS.filter(p => p.medidas);
  const maximo = Math.max(...conMedidas.map(p => p.medidas.ancho), 30);
  const A4 = 29.7;

  caja.innerHTML = conMedidas
    .slice()
    .sort((a, b) => a.medidas.ancho - b.medidas.ancho)
    .map(p => `
      <div class="medida">
        <div class="medida-cab">
          <b>${P.nombre(p)}</b>
          <span>${String(p.medidas.ancho).replace('.', ',')} cm de ancho</span>
        </div>
        <div class="medida-barra">
          <div class="medida-relleno" style="width:${(p.medidas.ancho / maximo) * 100}%"></div>
        </div>
        <p class="mini">Profundidad ${String(p.medidas.profundidad).replace('.', ',')} cm ·
        Alto ${String(p.medidas.alto).replace('.', ',')} cm</p>
      </div>`).join('') + `
      <p class="medida-ref">Para que te des una idea: una hoja A4 acostada mide ${String(A4).replace('.', ',')} cm.
      Medí tu mesada antes de decidir.</p>`;
}

/* ---------- Arranque ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if ($('#quiz')) pintar();
  pintarMedidas();
});
