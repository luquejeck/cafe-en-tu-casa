/* ============================================================
   CAFÉ EN TU CASA — Contenido de Instagram (un mes)
   ------------------------------------------------------------
   Cada PIEZA es una publicación. Sus PLACAS son las imágenes:
     · carrusel  -> varias placas 1080x1350
     · post      -> una placa 1080x1350
     · historia  -> una placa 1080x1920
     · reel      -> cuadros 1080x1920 (después se arman como video)
   Los datos de producto salen de assets/js/productos.js: si cambia
   un precio o una cuota, se regenera y listo.
   Para generar las imágenes:  instagram\generar.ps1
   ============================================================ */

const M = getProducto('magnifica-s');
const K = getProducto('krups-roma');
const D = getProducto('dedica');

// Solo las que tienen stock: las piezas que muestran "todas" usan esta lista
const DISP = PRODUCTOS.filter(p => p.stock);
const CUANTAS = ['Una', 'Dos', 'Tres', 'Cuatro'][DISP.length - 1];
const SUPER = DISP.filter(p => p.tipo === 'Superautomática');
const DESDE = Math.min(...DISP.map(p => P.transferencia(p)));
const nombres = DISP.map(p => p.modelo).join(' o ');
// Una placa por cafetera con los dos precios (transferencia y cuotas, sin combinar)
const placaPrecio = p => ({ t: 'foto', tono: 'gris', ep: p.etiqueta, h: p.modelo,
  sub: `${fmt(P.transferencia(p))} por transferencia (${OFF}% OFF)`, img: p.imgs[0],
  pildora: `o ${p.cuotas} cuotas sin interés de ${fmt(P.cuota(p))} en Mercado Libre` });
const preciosCortos = p =>
  `${p.modelo}\n💸 ${fmt(P.transferencia(p))} por transferencia (${OFF}% OFF)\n` +
  `💳 o ${p.cuotas} cuotas sin interés de ${fmt(P.cuota(p))} en Mercado Libre`;

const OFF = TIENDA.descuentoTransferencia * 100;
const COMO_PAGAR = `El ${OFF}% OFF es pagando por transferencia o efectivo; las cuotas son en Mercado Libre. No se combinan.`;
const cm  = n => String(n).replace('.', ',') + ' cm';
const pagoCorto = p => `${OFF}% OFF por transferencia · ${p.cuotas} cuotas sin interés`;
const precios = p =>
  `💸 ${fmt(P.transferencia(p))} por transferencia (${OFF}% OFF)\n` +
  `💳 o ${p.cuotas} cuotas sin interés de ${fmt(P.cuota(p))} en Mercado Libre\n` +
  `📦 Envío gratis a todo el país · ${TIENDA.garantiaMeses} meses de garantía oficial`;
const pagoCta = p => `${OFF}% OFF por transferencia<br>o ${p.cuotas} cuotas sin interés`;
const lema = p => p.tagline.replace('. ', '.<br>');
const CIERRE = 'Escribinos por WhatsApp desde el link de la bio.';
/* Desde el 12/10 los textos de feed cierran pidiendo guardar o compartir, más
   una pregunta fácil (reportes/APRENDIZAJES.md). El WhatsApp va en el cuerpo. */
const cierre = (pide, pregunta) => `${pide}\n\n${pregunta}`;
const WA = `Consultas por WhatsApp al ${TIENDA.whatsappVisible}.`;

/* La cuenta del café (mismos números que la calculadora del sitio) */
const costoCasa   = TIENDA.precioKiloCafe / TIENDA.cafesPorKilo;
const CAFES_DIA   = 2;
const mesAfuera   = TIENDA.precioCafeAfuera * CAFES_DIA * 30;
const mesCasa     = costoCasa * CAFES_DIA * 30;
const mesesAmort  = Math.ceil(P.transferencia(M) / (mesAfuera - mesCasa));
const MESES_DEDICA = Math.ceil(P.transferencia(D) / (mesAfuera - mesCasa));
const ANIO_AFUERA  = TIENDA.precioCafeAfuera * CAFES_DIA * 365;
const ANIO_CASA    = costoCasa * CAFES_DIA * 365;
const F = 'instagram/fotos/';   // fotos de Google Flow

const PIEZAS = [

  /* ======================= SEMANA 1 — Presentación ======================= */
  {
    id: 's1-lun-historia-test', semana: 1, dia: 'Lunes', tipo: 'historia',
    titulo: '¿Cuál es tu cafetera?',
    caption: '',
    placas: [
      { t: 'cta', tono: 'oscuro', ep: 'Test de 4 preguntas', h: '¿Cuál es tu cafetera?',
        sub: 'Contanos cómo tomás el café y te decimos cuál te conviene.', boton: 'Hacé el test · link en la bio' }
    ]
  },
  {
    id: 's1-mar-carrusel-las-tres', semana: 1, dia: 'Martes', tipo: 'carrusel',
    titulo: `${CUANTAS} cafeteras. Una es la tuya.`,
    caption:
      `${CUANTAS} cafeteras. Una es la tuya. ☕\n\n` +
      DISP.map(p => ({
        'magnifica-s': 'Magnifica S: muele el grano en el momento y hace todo con un botón.',
        'krups-roma':  'Krups Roma: la superautomática más accesible, y entra en mesadas justas.',
        'dedica':      'Dedica: 15 cm de ancho para los que disfrutan preparar el espresso a mano.' })[p.id]).join('\n') + '\n\n' +
      `${DISP.length === 2 ? 'Las dos' : 'Todas'} con ${OFF}% OFF por transferencia o cuotas sin interés, y envío gratis.\n\n` +
      '¿No sabés cuál? Hacé el test de 4 preguntas desde el link de la bio.\n\n' +
      '#cafeencasa #cafetera #espresso #delonghi' + (K.stock ? ' #krups' : ''),
    placas: [
      { t: 'portada', ep: 'Elegí la tuya', h: `${CUANTAS} cafeteras. Una es la tuya.`, sub: 'Te las presentamos en un minuto.',
        pildora: `Desde ${fmt(DESDE)} por transferencia` },
      ...DISP.map(p => ({ t: 'foto', tono: 'gris', ep: p.etiqueta, h: p.modelo, sub: lema(p), img: p.imgs[0] })),
      { t: 'trio', h: '¿Para quién es cada una?', productos: DISP,
        linea: p => ({ 'magnifica-s': 'Varios cafés por día y lugar en la mesada.',
                       'krups-roma':  'Uno o dos cafés por día, sin vueltas.',
                       'dedica':      'Poco espacio y ganas de prepararlo vos.' })[p.id] },
      { t: 'cta', tono: 'oscuro', ep: '¿Todavía dudás?', h: 'Hacé el test de 4 preguntas.',
        sub: 'Te recomendamos una y te contamos por qué.', boton: 'Link en la bio' }
    ]
  },
  {
    id: 's1-mie-historia-como-tomas', semana: 1, dia: 'Miércoles', tipo: 'historia',
    titulo: '¿Cómo tomás el café?',
    caption: '',
    placas: [
      { t: 'opciones', tono: 'gris', ep: 'Pregunta del día', h: '¿Cómo tomás el café?',
        ops: ['Solo, espresso puro', 'Cortado', 'Cappuccino o latte'], p: 'Respondenos por mensaje y te decimos qué cafetera va con vos.' }
    ]
  },
  {
    id: 's1-jue-carrusel-como-comprar', semana: 1, dia: 'Jueves', tipo: 'carrusel',
    titulo: 'Dos formas de pagar',
    caption:
      `Dos formas de pagar, vos elegís. 👇\n\n` +
      `1) Transferencia o efectivo con ${OFF}% OFF: nos escribís por WhatsApp, te confirmamos stock y despachamos apenas se acredita.\n` +
      `2) Cuotas sin interés con tarjeta, desde nuestra publicación oficial en Mercado Libre.\n\n` +
      'El descuento por transferencia no se combina con las cuotas.\n' +
      `En los dos casos: envío gratis, máquina nueva y sellada, y ${TIENDA.garantiaMeses} meses de garantía oficial.\n\n` +
      WA + '\n\n' +
      cierre('Guardalo para cuando vayas a comprar, o compartilo con quien está por hacerlo.', '¿Vos pagarías por transferencia o en cuotas?'),
    placas: [
      { t: 'portada', ep: 'Cómo comprar', h: 'Dos formas de pagar.', sub: 'Las dos con envío gratis y garantía oficial.' },
      { t: 'dos', tono: 'gris', h: 'Vos elegís',
        cols: [
          { destacada: true, ep: 'Mejor precio', h: `${OFF}% OFF`, items: ['Transferencia o efectivo', 'Se coordina por WhatsApp'] },
          { ep: 'Financiado', h: 'Cuotas sin interés', items: ['Con tarjeta de crédito', 'En Mercado Libre'] }
        ] },
      { t: 'lista', numerada: true, ep: `Con ${OFF}% OFF`, h: 'Por transferencia',
        items: [['Nos escribís por WhatsApp', 'El mensaje ya viene armado con el modelo y el precio.'],
                ['Te confirmamos el stock', 'Y te pasamos los datos de la cuenta.'],
                ['Despachamos', 'Apenas se acredita la transferencia.']] },
      { t: 'lista', numerada: true, ep: 'Sin interés', h: 'En cuotas',
        items: [['Entrás a la ficha del producto', 'Desde el link de la bio.'],
                ['Tocás el botón de cuotas', 'Te lleva a nuestra publicación oficial en Mercado Libre.'],
                ['Pagás con tarjeta', `Hasta ${Math.max(...PRODUCTOS.map(p => p.cuotas))} cuotas sin interés según el modelo.`]] },
      { t: 'lista', tono: 'gris', ep: 'Siempre', h: 'Compres como compres',
        items: [['Envío gratis a todo el país', 'Con número de seguimiento.'],
                ['Máquina nueva y sellada', 'No vendemos reacondicionados.'],
                [`${TIENDA.garantiaMeses} meses de garantía oficial`, 'Con servicio técnico en el país.'],
                ['30 días para devolverla', 'Sin costo, si no te convence.']] },
      { t: 'cta', tono: 'oscuro', h: '¿Arrancamos?', sub: 'Elegí tu cafetera y la forma de pago.', boton: 'Link en la bio' }
    ]
  },
  {
    id: 's1-vie-historia-20-off', semana: 1, dia: 'Viernes', tipo: 'historia',
    titulo: '20% OFF por transferencia',
    caption: '',
    placas: [
      { t: 'dato', tono: 'oscuro', ep: 'Pagando por transferencia', num: OFF, unidad: '% OFF',
        sub: 'En las tres cafeteras, todos los días.', p: 'Escribinos por WhatsApp · link en la bio' }
    ]
  },
  {
    id: 's1-sab-reel-del-grano-a-la-taza', semana: 1, dia: 'Sábado', tipo: 'reel',
    titulo: 'Del grano a la taza, con un botón',
    caption:
      'Del grano a la taza, con un botón. ☕\n\n' +
      `La ${P.nombre(M)} muele en el momento, prepara el espresso y espuma la leche para el cappuccino.\n\n` +
      precios(M) + '\n\n' + WA + '\n\n' +
      cierre('Guardalo, o compartilo con quien toma café de cafetería todos los días.', '¿Vos cuántos cafés tomás por día?') +
      '\n\n#cafeencasa #cafetera #delonghi #magnificas #espresso',
    /* 10,2 s (antes ~21): 20% OFF y cuotas a los 2,4 s. Sin montos: van en el texto */
    placas: [
      { t: 'portada', tono: 'oscuro', ep: M.modelo, h: 'Del grano a la taza.', sub: 'Con un botón.', d: 1.8 },
      { t: 'foto', tono: 'gris', ep: 'Muele en el momento', h: 'Un botón por taza', img: M.imgs[1],
        pildora: `${OFF}% OFF por transferencia · ${M.cuotas} cuotas sin interés`, d: 3.2 },
      { t: 'foto', tono: 'gris', ep: 'Y espuma la leche', h: 'Cappuccino y latte', img: M.imgs[2], d: 2.6 },
      { t: 'cta', tono: 'oscuro', ep: P.nombre(M), h: '¿Cuántos cafés tomás por día?', sub: 'Café de cafetería, en tu casa.', boton: 'Guardalo · Compartilo', d: 2.6 }
    ]
  },

  /* ======================= SEMANA 2 — Magnifica S ======================= */
  {
    id: 's2-lun-historia-magnifica', semana: 2, dia: 'Lunes', tipo: 'historia',
    titulo: 'Magnifica S con precio',
    caption: '',
    placas: [
      { t: 'foto', ep: M.etiqueta, h: M.modelo, sub: `${fmt(P.transferencia(M))} por transferencia`, img: M.imgs[0],
        pildora: `o ${M.cuotas} cuotas sin interés de ${fmt(P.cuota(M))}` }
    ]
  },
  {
    id: 's2-mar-carrusel-magnifica-a-fondo', semana: 2, dia: 'Martes', tipo: 'carrusel',
    titulo: 'Magnifica S, a fondo',
    caption:
      `${P.nombre(M)}: la superautomática más vendida, por algo. 👇\n\n` +
      M.highlights.map(h => '· ' + h).join('\n') + '\n\n' +
      precios(M) + '\n\n' + WA + '\n\n' +
      cierre('Guardalo para comparar, o compartilo con quien está buscando cafetera.', '¿Qué es lo primero que te fijás en una cafetera?') +
      '\n\n#delonghi #magnificas #cafeencasa #cafetera #cafeengrano',
    placas: [
      { t: 'portada', ep: M.etiqueta, h: M.modelo, sub: lema(M), img: M.imgs[0],
        pildora: `${fmt(P.transferencia(M))} por transferencia · o ${M.cuotas} cuotas sin interés` },
      { t: 'foto', tono: 'gris', ep: 'Molinillo integrado', h: 'Muele en el momento', sub: 'El aroma no se pierde en un paquete abierto.', img: M.imgs[1] },
      { t: 'dato', tono: 'oscuro', ep: 'Molinillo cónico de acero', num: 13, sub: 'niveles de molienda', p: 'Ajustás el cuerpo de la taza a tu gusto con un dial.' },
      { t: 'foto', tono: 'gris', ep: 'Sin menús ni pantallas', h: 'Un botón por taza', sub: 'Panel analógico: apretás y listo.', img: M.imgs[3] },
      { t: 'foto', tono: 'gris', ep: 'Vaporizador manual', h: 'Espuma de verdad', sub: 'Para cappuccino, latte y flat white.', img: M.imgs[2] },
      { t: 'lista', ep: 'Ficha técnica', h: 'Los números',
        items: [['15 bares de presión', ''],
                ['Depósito de agua de 1,8 L', 'Extraíble.'],
                ['250 g de granos', 'También acepta café pre-molido.'],
                [`${cm(M.medidas.ancho)} de ancho`, `${cm(M.medidas.profundidad)} de fondo y ${cm(M.medidas.alto)} de alto.`]] },
      { t: 'cta', tono: 'oscuro', ep: P.nombre(M), h: 'Llevala a tu casa.', sub: pagoCta(M), boton: 'Link en la bio' }
    ]
  },
  {
    id: 's2-mie-historia-13-niveles', semana: 2, dia: 'Miércoles', tipo: 'historia',
    titulo: '13 niveles de molienda',
    caption: '',
    placas: [
      { t: 'dato', tono: 'gris', ep: M.modelo, num: 13, sub: 'niveles de molienda', p: 'Más fino, más cuerpo. Más grueso, más suave. Lo elegís vos.' }
    ]
  },
  {
    id: 's2-jue-post-magnifica', semana: 2, dia: 'Jueves', tipo: 'post',
    titulo: 'Magnifica S (post)',
    caption:
      `${M.tagline} ☕\n\n` +
      `La ${P.nombre(M)} muele en el momento, en cada taza: 13 niveles de molienda y espumador para cappuccino y latte.\n\n` +
      precios(M) + '\n\n' + CIERRE,
    placas: [
      { t: 'foto', ep: M.etiqueta, h: M.modelo, sub: lema(M), img: M.imgs[1], pildora: pagoCorto(M) }
    ]
  },
  {
    id: 's2-vie-historia-grano-o-molido', semana: 2, dia: 'Viernes', tipo: 'historia',
    titulo: '¿Grano entero o molido?',
    caption: '',
    placas: [
      { t: 'opciones', ep: 'Pregunta del día', h: '¿Grano entero o café molido?',
        ops: ['Grano entero', 'Ya molido', 'Lo que haya'], p: `La ${M.modelo} acepta los dos.` }
    ]
  },
  {
    id: 's2-sab-reel-la-cuenta-del-cafe', semana: 2, dia: 'Sábado', tipo: 'reel',
    titulo: 'La cuenta del café',
    caption:
      'Hacé la cuenta. 🧮\n\n' +
      `Dos cafés por día en un bar son unos ${fmt(mesAfuera)} por mes. Los mismos dos cafés, hechos en casa con grano, salen cerca de ${fmt(mesCasa)}.\n\n` +
      `Con esa diferencia, la ${M.modelo} por transferencia se paga sola en unos ${mesesAmort} meses.\n\n` +
      'Los valores son aproximados: en el sitio tenés la calculadora para poner tus números.\n\n' +
      cierre('Guardalo para hacer tu cuenta, o compartilo con quien vive en el bar.', '¿Cuántos cafés tomás afuera por semana?') +
      '\n\n#cafeencasa #cafetera #ahorro',
    /* 11,4 s · sin montos en el video (quedan viejos): los números van en el texto */
    placas: [
      { t: 'portada', tono: 'oscuro', ep: 'Hacé la cuenta', h: '¿Cuánto gastás en café por mes?', sub: `Con ${CAFES_DIA} cafés por día.`, d: 1.8 },
      { t: 'dato', tono: 'gris', ep: 'Afuera', num: CAFES_DIA * 30, unidad: 'cafés', sub: 'por mes, pagados en un bar.', d: 2.4 },
      { t: 'texto', tono: 'gris', ep: 'En tu casa, con grano', h: 'Cada taza sale una fracción.', p: 'Recién molida, como en la cafetería.', d: 2.4 },
      { t: 'texto', tono: 'oscuro', ep: `Con la ${M.modelo}`, h: 'La diferencia paga la cafetera.', p: 'Hacé tu cuenta con la calculadora del sitio.', d: 2.4 },
      { t: 'cta', tono: 'oscuro', ep: 'Hacé la cuenta', h: '¿Cuántos cafés tomás afuera por semana?', boton: 'Guardalo · Compartilo', d: 2.4 }
    ]
  },

  {
    /* Semana 26/10: el reel de la cuenta fue el único que pasó los 10 s de
       tiempo visto (10,7 s). Esta versión lleva los números EN PANTALLA,
       a pedido (excepción a "sin montos en video"): precios del sitio al 27/10. */
    id: 'r1-mar-reel-la-cuenta-dedica', semana: 3, dia: 'Martes', tipo: 'reel', fecha: '2026-10-27',
    titulo: 'La cuenta, versión Dedica',
    caption:
      `2 cafés por día en un bar: ${fmt(mesAfuera)} por mes. 🧮\n\n` +
      `En casa, los mismos 2 cafés salen unos ${fmt(Math.round(mesCasa))}. La ${D.modelo} por transferencia (${fmt(P.transferencia(D))}) se paga sola en unos ${Math.round(P.transferencia(D) / (mesAfuera - mesCasa))} meses.\n\n` +
      `Valores aproximados, con los precios del sitio al 27/10. El 20% OFF es pagando por transferencia o efectivo; las cuotas son en Mercado Libre. No se combinan.\n\n` +
      'Mandáselo a quien vive en el bar.\n\n¿Cuántos cafés tomás afuera por semana?\n\n#cafeencasa #cafetera #dedica #delonghi #ahorro',
    placas: [
      { t: 'dato', tono: 'oscuro', ep: '2 cafés por día en un bar', num: `<span style="font-size:.56em">${fmt(mesAfuera)}</span>`, sub: 'por mes.', d: 2.4 },
      { t: 'dato', tono: 'gris', ep: 'En casa, con grano', num: `<span style="font-size:.56em">${fmt(Math.round(mesCasa))}</span>`, sub: 'por mes. Los mismos 2 cafés.', d: 2.4 },
      { t: 'texto', tono: 'oscuro', ep: `${D.modelo} · ${fmt(P.transferencia(D))} por transferencia`, h: `Se paga sola en unos ${Math.round(P.transferencia(D) / (mesAfuera - mesCasa))} meses.`, p: 'Valores aproximados. Precios del sitio al 27/10.', d: 3.2 },
      { t: 'cta', tono: 'oscuro', ep: 'Hacé la cuenta', h: 'Mandáselo a quien vive en el bar.', sub: '¿Cuántos cafés tomás afuera por semana?', boton: 'Compartilo ↗', d: 2.6 }
    ]
  },

  /* Historias del fin de semana del CyberMonday (2 al 4/11, CACE). Las que
     llevan sticker (cuenta regresiva, preguntas) se suben con aviso al celular. */
  {
    id: 'r1-sab-historia-cuenta-regresiva', semana: 3, dia: 'Sábado', tipo: 'historia', fecha: '2026-10-31',
    titulo: 'Cuenta regresiva al CyberMonday',
    caption: '',
    nota: 'Sumar en Instagram el sticker de cuenta regresiva (CyberMonday, lun 2/11 00:00) y la caja de preguntas "¿Qué cafetera estás mirando?".',
    placas: [
      { t: 'texto', tono: 'oscuro', ep: 'CyberMonday · lunes 2/11', h: `Acá el ${OFF}% OFF por transferencia es todo el año.`,
        p: 'Activá el recordatorio y contanos qué estás mirando ↓' }
    ]
  },
  {
    id: 'r1-dom-historia-transferencia-o-cuotas', semana: 3, dia: 'Domingo', tipo: 'historia', fecha: '2026-11-01',
    titulo: '¿Transferencia o cuotas?',
    caption: '',
    placas: [
      { t: 'opciones', tono: 'gris', ep: M.modelo, h: '¿Transferencia o cuotas?',
        ops: [`1 · ${fmt(P.transferencia(M))} por transferencia (${OFF}% OFF)`, `2 · ${M.cuotas} cuotas sin interés de ${fmt(P.cuota(M))} en Mercado Libre`],
        p: 'Contestanos por mensaje: ¿1 o 2? No se combinan.' }
    ]
  },
  {
    id: 'r1-lun-historia-hoy-cybermonday', semana: 3, dia: 'Lunes', tipo: 'historia', fecha: '2026-11-02',
    titulo: 'Hoy es CyberMonday',
    caption: '',
    nota: 'Confirmar en cybermonday.com.ar que arranca el lunes 2/11 antes de publicar.',
    placas: [
      { t: 'texto', tono: 'oscuro', ep: 'CyberMonday · 2 al 4/11', h: `Hoy es CyberMonday: acá el ${OFF}% OFF es todos los días.`,
        p: 'Pagando por transferencia o efectivo. Escribinos por WhatsApp · link en la bio' }
    ]
  },

  /* ======================= SEMANA 3 — Krups Roma + guía ======================= */
  {
    id: 's3-lun-historia-krups', semana: 3, dia: 'Lunes', tipo: 'historia',
    titulo: 'Krups Roma con precio',
    caption: '',
    placas: [
      { t: 'foto', ep: K.etiqueta, h: K.modelo, sub: `${fmt(P.transferencia(K))} por transferencia`, img: K.imgs[0],
        pildora: `o ${K.cuotas} cuotas sin interés de ${fmt(P.cuota(K))}` }
    ]
  },
  {
    id: 's3-mar-carrusel-krups-a-fondo', semana: 3, dia: 'Martes', tipo: 'carrusel',
    titulo: 'Krups Roma, a fondo',
    caption:
      `${P.nombre(K)}: del instantáneo al espresso de grano, sin resignar mesada. 👇\n\n` +
      K.highlights.map(h => '· ' + h).join('\n') + '\n\n' +
      precios(K) + '\n\n' + CIERRE + '\n\n#krups #cafeencasa #cafetera #espresso #cafeengrano',
    placas: [
      { t: 'portada', ep: K.etiqueta, h: K.modelo, sub: lema(K), img: K.imgs[0] },
      { t: 'texto', tono: 'gris', ep: 'Superautomática', h: 'Cargás granos, apretás un botón.', p: 'La máquina muele, compacta y extrae sola.' },
      { t: 'dato', tono: 'oscuro', ep: 'Volumen de taza', num: '20–220', unidad: 'ml', sub: 'Del ristretto a la taza grande.', p: 'Lo regulás con el selector frontal.' },
      { t: 'lista', ep: 'Lo que trae', h: 'Simple, y completa',
        items: [['Thermoblock compacto', 'Lista desde la primera taza.'],
                ['3 niveles de molienda', 'Regulables.'],
                ['Vaporizador lateral', 'Para espumar leche en la jarra.'],
                ['Calientatazas superior', 'Para que el café no se enfríe al servirlo.']] },
      { t: 'dato', tono: 'gris', ep: 'Entra en mesadas justas', num: String(K.medidas.ancho).replace('.', ','), unidad: 'cm', sub: 'de ancho',
        p: `${cm(K.medidas.profundidad)} de fondo y ${cm(K.medidas.alto)} de alto.` },
      { t: 'cta', tono: 'oscuro', ep: P.nombre(K), h: 'La más accesible del catálogo.', sub: pagoCta(K), boton: 'Link en la bio' }
    ]
  },
  {
    id: 's3-mie-historia-envio', semana: 3, dia: 'Miércoles', tipo: 'historia',
    titulo: 'Envío gratis',
    caption: '',
    placas: [
      { t: 'lista', tono: 'gris', ep: 'Envío gratis', h: 'A todo el país',
        items: [['Despacho en el día', 'Si el pago se acredita antes de las 15 h.'],
                ['24 a 72 h en AMBA', ''],
                ['Hasta 5 días hábiles', 'En el interior del país.'],
                ['Con seguimiento', 'Te pasamos el número apenas sale.']] }
    ]
  },
  {
    id: 's3-jue-carrusel-super-o-manual', semana: 3, dia: 'Jueves', tipo: 'carrusel',
    titulo: 'Superautomática o espresso manual',
    caption:
      '¿Superautomática o espresso manual? No hay una mejor: son dos formas distintas de tomar café. 👇\n\n' +
      'Superautomática: cargás granos y apretás un botón. Ideal si tomás varios cafés por día o si en tu casa toman varios.\n' +
      'Espresso manual: dosificás, tampeás y extraés vos. Ideal si disfrutás el proceso y tenés poco espacio.\n\n' +
      `Tenemos las dos: ${SUPER.map(p => p.modelo).join(' y ')} (${SUPER.length > 1 ? 'superautomáticas' : 'superautomática'}) y ${D.modelo} (manual).\n\n` +
      '¿Dudás? El test de 4 preguntas está en el link de la bio.\n\n#cafeencasa #espresso #cafetera #barista',
    placas: [
      { t: 'portada', ep: 'Superautomática o espresso manual', h: '¿De botón o a mano?', sub: 'Dos formas distintas de tomar café. ¿Cuál es la tuya?' },
      { t: 'dos', tono: 'gris', h: 'La diferencia',
        cols: [
          { ep: 'Superautomática', h: 'Apretás un botón', items: ['Muele el grano sola', 'Siempre sale igual', 'Varios cafés seguidos'] },
          { ep: 'Espresso manual', h: 'Lo preparás vos', items: ['Usás café molido', 'Vos manejás el resultado', 'Ocupa muy poco lugar'] }
        ] },
      { t: 'lista', ep: 'Superautomática', h: 'Es para vos si…',
        items: [['Tomás varios cafés por día', ''], ['Querés el café listo en un minuto', ''], ['En tu casa toman varios', '']] },
      { t: 'lista', ep: 'Espresso manual', h: 'Es para vos si…',
        items: [['Disfrutás el ritual de prepararlo', ''], ['Tenés poco lugar en la mesada', ''], ['Tomás uno o dos cafés por día', '']] },
      { t: 'trio', tono: 'gris', h: 'Tenemos las dos', linea: p => p.tipo, productos: DISP },
      { t: 'cta', tono: 'oscuro', ep: '¿Seguís dudando?', h: 'El test te lo resuelve.', sub: '4 preguntas, un minuto.', boton: 'Link en la bio' }
    ]
  },
  {
    id: 's3-vie-historia-ritual', semana: 3, dia: 'Viernes', tipo: 'historia',
    titulo: '¿Botón o ritual?',
    caption: '',
    placas: [
      { t: 'opciones', tono: 'oscuro', ep: 'Pregunta del día', h: 'A la hora del café, ¿qué preferís?',
        ops: ['Apretar un botón', 'Prepararlo yo'], p: 'Respondenos por mensaje.' }
    ]
  },
  {
    id: 's3-sab-reel-entra-en-tu-mesada', semana: 3, dia: 'Sábado', tipo: 'reel',
    titulo: '¿Entra en tu mesada?',
    caption:
      '¿Entra en tu mesada? Medí antes de comprar. 📏\n\n' +
      DISP.map(p => `${p.modelo}: ${cm(p.medidas.ancho)} de ancho`).join('\n') + '\n\n' +
      'El ancho es lo que más devoluciones evita. Las medidas completas están en cada ficha del sitio. Link en la bio.\n\n#cafeencasa #cafetera #cocina',
    placas: [
      { t: 'portada', tono: 'oscuro', ep: 'Antes de comprar', h: '¿Entra en tu mesada?', sub: 'Medí el ancho libre que tenés.' },
      { t: 'barras', ep: 'Ancho de cada una', h: 'Lado a lado',
        items: DISP.map(p => [p.modelo, cm(p.medidas.ancho), p.medidas.ancho]) },
      { t: 'foto', tono: 'gris', ep: D.etiqueta, h: cm(D.medidas.ancho), sub: `La ${D.modelo} entra donde no entra nada.`, img: D.imgs[0] },
      { t: 'texto', tono: 'gris', ep: 'Un consejo', h: 'Dejá aire arriba.', p: 'Para cargar el agua y los granos necesitás abrir la tapa superior.' },
      { t: 'cta', tono: 'oscuro', h: 'Las medidas completas están en el sitio.', sub: 'Ancho, fondo y alto de cada modelo.', boton: 'Link en la bio' }
    ]
  },

  /* ======================= SEMANA 4 — Dedica + confianza ======================= */
  {
    id: 's4-lun-historia-dedica', semana: 4, dia: 'Lunes', tipo: 'historia',
    titulo: 'Dedica con precio',
    caption: '',
    placas: [
      { t: 'foto', ep: D.etiqueta, h: D.modelo, sub: `${fmt(P.transferencia(D))} por transferencia`, img: D.imgs[0],
        pildora: `o ${D.cuotas} cuotas sin interés de ${fmt(P.cuota(D))}` }
    ]
  },
  {
    id: 's4-mar-carrusel-dedica-a-fondo', semana: 4, dia: 'Martes', tipo: 'carrusel',
    titulo: 'Dedica, a fondo',
    caption:
      `${P.nombre(D)}: para el que disfruta el proceso. 👇\n\n` +
      D.highlights.map(h => '· ' + h).join('\n') + '\n\n' +
      precios(D) + '\n\n' + CIERRE + '\n\n#delonghi #dedica #espresso #barista #cafeencasa',
    placas: [
      { t: 'portada', ep: D.etiqueta, h: D.modelo, sub: lema(D), img: D.imgs[0] },
      { t: 'dato', tono: 'oscuro', ep: 'Ultracompacta', num: '15', unidad: 'cm', sub: 'de ancho', p: 'Una de las espresso más finas del mercado.' },
      { t: 'lista', numerada: true, tono: 'gris', ep: 'El ritual', h: 'Lo preparás vos',
        items: [['Dosificás el café', ''], ['Tampeás', ''], ['Colocás el portafiltro', ''], ['Y ves caer el espresso', '']] },
      { t: 'dato', ep: 'Thermoblock', num: '40', unidad: 'seg', sub: 'y está lista.', p: 'Sin la espera larga de las máquinas con caldera.' },
      { t: 'lista', ep: 'Lo que trae', h: 'Chica, y completa',
        items: [['15 bares de presión', ''],
                ['Cappuccino System regulable', 'De leche caliente a espuma para cappuccino.'],
                ['Café molido o cápsulas E.S.E.', 'Para cuando querés la vía rápida.'],
                ['Depósito de 1,1 L', 'Extraíble.']] },
      { t: 'cta', tono: 'oscuro', ep: P.nombre(D), h: 'Todo el ritual, en 15 cm.', sub: pagoCta(D), boton: 'Link en la bio' }
    ]
  },
  {
    id: 's4-mie-historia-garantia', semana: 4, dia: 'Miércoles', tipo: 'historia',
    titulo: 'Garantía oficial',
    caption: '',
    placas: [
      { t: 'dato', tono: 'gris', ep: 'Garantía oficial', num: TIENDA.garantiaMeses, unidad: 'meses',
        sub: 'Con servicio técnico en el país.', p: 'Todas las máquinas son nuevas y vienen selladas de fábrica.' }
    ]
  },
  {
    id: 's4-jue-carrusel-preguntas', semana: 4, dia: 'Jueves', tipo: 'carrusel',
    titulo: 'Lo que siempre nos preguntan',
    caption:
      'Lo que siempre nos preguntan, respondido. 👇\n\n' +
      '¿Son originales? Sí: cafeteras De\'Longhi nuevas, en su caja.\n' +
      '¿Envían a todo el país? Sí, gratis y con seguimiento.\n' +
      '¿Cuánto tarda? 24 a 72 h en AMBA y hasta 5 días hábiles en el interior.\n' +
      '¿Puedo devolverla? Sí, según la política de devoluciones de Mercado Libre.\n\n' +
      '¿Te quedó otra duda? ' + CIERRE,
    placas: [
      { t: 'portada', ep: 'Preguntas frecuentes', h: 'Lo que siempre nos preguntan.', sub: 'Respondido en cinco placas.' },
      { t: 'texto', tono: 'gris', ep: '¿Son originales?', h: 'Sí, De\'Longhi originales.', p: 'Nuevas, en su caja. Y cada compra tiene la protección de Mercado Libre.' },
      { t: 'texto', ep: '¿Envían a todo el país?', h: 'Sí, y el envío es gratis.', p: 'Despachamos por Mercado Envíos y te pasamos el número de seguimiento.' },
      { t: 'texto', tono: 'gris', ep: '¿Cuánto tarda?', h: '24 a 72 h en AMBA.', p: 'Hasta 5 días hábiles en el interior. Sale el mismo día si el pago se acredita antes de las 15 h.' },
      { t: 'texto', ep: '¿Y si no me convence?', h: 'Podés devolverla.', p: 'Según la política de devoluciones de Mercado Libre. Ante cualquier duda, escribinos antes.' },
      { t: 'cta', tono: 'oscuro', ep: '¿Otra duda?', h: 'Escribinos.', sub: 'Contestamos en el día.', boton: 'WhatsApp · link en la bio' }
    ]
  },
  {
    id: 's4-vie-historia-asesoramiento', semana: 4, dia: 'Viernes', tipo: 'historia',
    titulo: 'Te ayudamos a elegir',
    caption: '',
    placas: [
      { t: 'cta', ep: 'Asesoramiento', h: '¿No sabés cuál elegir?',
        sub: 'Contanos cuántos cafés tomás y cuánto lugar tenés. Te recomendamos una.', boton: 'Escribinos · link en la bio' }
    ]
  },
  {
    id: 's4-sab-reel-4-preguntas', semana: 4, dia: 'Sábado', tipo: 'reel',
    titulo: '4 preguntas para elegir tu cafetera',
    caption:
      '4 preguntas para elegir tu cafetera. ☕\n\n' +
      '1. ¿Cuántos cafés se toman por día en tu casa?\n' +
      '2. ¿Lo tomás con leche?\n' +
      '3. ¿Cuánto lugar libre tenés en la mesada?\n' +
      '4. ¿Preferís apretar un botón o prepararlo vos?\n\n' +
      'Respondelas en el test del sitio y te decimos cuál es la tuya. Link en la bio.\n\n#cafeencasa #cafetera #espresso',
    placas: [
      { t: 'portada', tono: 'oscuro', ep: 'Antes de comprar', h: '4 preguntas para elegir tu cafetera.' },
      { t: 'texto', tono: 'gris', ep: 'Pregunta 1', h: '¿Cuántos cafés se toman por día en tu casa?', p: 'Contando a todos los que viven con vos.' },
      { t: 'texto', tono: 'gris', ep: 'Pregunta 2', h: '¿Lo tomás con leche?', p: 'Cappuccino, latte, flat white, cortado.' },
      { t: 'texto', tono: 'gris', ep: 'Pregunta 3', h: '¿Cuánto lugar libre tenés en la mesada?', p: 'Medí el ancho disponible.' },
      { t: 'texto', tono: 'gris', ep: 'Pregunta 4', h: '¿Apretar un botón o prepararlo vos?', p: 'No hay respuesta correcta.' },
      { t: 'cta', tono: 'oscuro', ep: 'Test de 4 preguntas', h: 'Te decimos cuál es la tuya.', sub: 'Un minuto, desde el sitio.', boton: 'Link en la bio' }
    ]
  },
  /* ======================= OCTUBRE-NOVIEMBRE — piezas del reporte del 19/10 ======================= */
  {
    id: 'x1-jue-carrusel-lado-a-lado', semana: 5, dia: 'Jueves', tipo: 'carrusel',
    titulo: '¿Cuál es la tuya? Lado a lado',
    caption:
      '¿Cuál es la tuya? Lado a lado, con precio. ☕\n\n' +
      DISP.map(preciosCortos).join('\n\n') + '\n\n' +
      COMO_PAGAR + ' Envío gratis a todo el país.\n\n' +
      'Guardalo para comparar.\n\n' +
      `¿Cuál te llevarías: ${nombres}?\n\n#cafeencasa #cafetera #espresso #delonghi`,
    placas: [
      { t: 'portada', ep: 'Lado a lado', h: '¿Cuál es la tuya?', sub: 'Precio y diferencias, en un minuto.',
        pildora: `Desde ${fmt(DESDE)} por transferencia` },
      ...DISP.map(placaPrecio),
      { t: 'dos', tono: 'gris', h: 'La diferencia',
        cols: DISP.map(p => ({ ep: p.tipo, h: p.modelo, items: [
          `${cm(p.medidas.ancho)} de ancho`,
          p.id === 'dedica' ? 'Usás café molido' : 'Muele el grano sola',
          p.id === 'dedica' ? 'Cappuccino System' : 'Vaporizador para leche',
          p.id === 'dedica' ? 'Para prepararlo vos' : 'Varios cafés por día'] })) },
      { t: 'cta', tono: 'oscuro', ep: 'Para decidir tranquilo', h: 'Guardalo para comparar.',
        sub: `¿${nombres}?`, boton: 'Link en la bio' }
    ]
  },
  {
    id: 'x1-sab-historia-molienda', semana: 5, dia: 'Sábado', tipo: 'historia',
    titulo: '¿Molienda fina o gruesa? (encuesta)',
    caption: '',
    placas: [
      { t: 'texto', ep: 'Encuesta', h: '¿Molienda fina o gruesa?',
        p: 'Fina: más cuerpo. Gruesa: más suave. Votá acá abajo 👇' }
    ]
  },
  {
    id: 'x1-dom-historia-preguntas', semana: 5, dia: 'Domingo', tipo: 'historia',
    titulo: '¿Qué querés saber antes de comprar? (caja de preguntas)',
    caption: '',
    placas: [
      { t: 'texto', tono: 'oscuro', ep: 'Preguntanos', h: '¿Qué querés saber antes de comprar?',
        p: 'Escribilo acá abajo y te respondemos en historias 👇' }
    ]
  },
  {
    id: 'x2-lun-carrusel-ofertas', semana: 6, dia: 'Lunes', tipo: 'carrusel',
    titulo: 'Semana de ofertas: transferencia o cuotas',
    caption:
      '¿Esperabas el CyberMonday para comprar tu cafetera? ☕\n\n' +
      `Acá el ${OFF}% OFF por transferencia es todos los días. Y si preferís financiar, tenés cuotas sin interés en Mercado Libre.\n\n` +
      DISP.map(preciosCortos).join('\n\n') + '\n\n' +
      COMO_PAGAR + ' Envío gratis a todo el país. Consultá la fecha de entrega por WhatsApp antes de comprar.\n\n' +
      'Guardalo para comparar.\n\n' +
      '¿Vos qué elegís: transferencia o cuotas?\n\n#cafeencasa #cafetera #espresso',
    placas: [
      { t: 'portada', tono: 'oscuro', ep: 'Semana de ofertas', h: '¿Esperabas esta semana para comprar?',
        sub: `Acá el ${OFF}% OFF por transferencia es todos los días.` },
      ...DISP.map(placaPrecio),
      { t: 'dos', tono: 'gris', h: 'Transferencia o cuotas',
        cols: [
          { ep: 'Transferencia o efectivo', h: `${OFF}% OFF`, destacada: true,
            items: ['Coordinás por WhatsApp', 'Despachamos apenas se acredita', 'Envío gratis'] },
          { ep: 'Mercado Libre', h: 'Cuotas sin interés', items: [
            `Hasta ${Math.max(...DISP.map(p => p.cuotas))} cuotas según el modelo`, 'Con tarjeta', 'Envío gratis'] }
        ] },
      { t: 'cta', tono: 'oscuro', ep: 'No se combinan', h: 'Guardalo para comparar.',
        sub: '¿Transferencia o cuotas?', boton: 'Link en la bio' }
    ]
  },
  {
    id: 'x2-mie-historia-todos-los-dias', semana: 6, dia: 'Miércoles', tipo: 'historia',
    titulo: '20% OFF todos los días',
    caption: '',
    placas: [
      { t: 'dato', tono: 'oscuro', ep: 'Pagando por transferencia', num: OFF, unidad: '% OFF',
        sub: 'Todos los días, no solo esta semana.', p: 'Escribinos por WhatsApp · link en la bio' }
    ]
  },

  /* ======================= Historias con fotos de ambiente (29/10) =======================
     Las fotos de assets/img/escenas ya están en 9:16 con aire arriba para el texto. */
  {
    id: 'x3-historia-magnifica-casa', semana: 6, dia: 'A definir', tipo: 'historia',
    titulo: 'Magnifica S en casa (fotos de ambiente)',
    caption: '',
    placas: [
      { t: 'escena', img: 'assets/img/escenas/magnifica-home-office.jpg',
        ep: M.modelo, h: 'Home office,<br><em>café de verdad.</em>' },
      { t: 'escena', img: 'assets/img/escenas/magnifica-desayuno-familia.jpg',
        ep: M.etiqueta, h: 'Ellos desayunan.<br><em>Tu café ya está.</em>',
        precio: fmt(P.transferencia(M)), nota: `por transferencia · ${OFF}% OFF`,
        cuotas: `o ${M.cuotas} cuotas sin interés de ${fmt(P.cuota(M))} en Mercado Libre` }
    ]
  },
  {
    id: 'x3-historia-dedica-encuesta', semana: 6, dia: 'A definir', tipo: 'historia',
    titulo: 'Dedica + encuesta ¿mate o café?',
    caption: '',
    placas: [
      { t: 'escena', img: 'assets/img/escenas/dedica-ventana.jpg',
        ep: `${D.modelo.split(' ')[0]} · ${cm(D.medidas.ancho)} de ancho`, h: 'Tu rincón,<br><em>tu ritual.</em>',
        precio: fmt(P.transferencia(D)), nota: `por transferencia · ${OFF}% OFF`,
        cuotas: `o ${D.cuotas} cuotas sin interés de ${fmt(P.cuota(D))} en Mercado Libre` },
      { t: 'escena', tono: 'oscuro', img: 'assets/img/escenas/magnifica-estudio-noche.jpg',
        ep: 'Encuesta · votá abajo 👇', h: 'Noche de estudio:<br><em>¿mate o café?</em>' }
    ]
  },
  {
    id: 'x3-dom-historia-post-halloween', semana: 5, dia: 'Domingo', tipo: 'historia',
    titulo: 'Domingo post Halloween',
    caption: '',
    placas: [
      { t: 'escena', img: 'assets/img/escenas/dedica-ventana.jpg',
        ep: 'Domingo post Halloween 🎃', h: '¿Mucho susto anoche?<br><em>Hoy, café tranquilo.</em>' }
    ]
  },
  {
    id: 'x3-historia-halloween', semana: 5, dia: 'Halloween', tipo: 'historia',
    titulo: 'Halloween en casa',
    caption: '',
    placas: [
      { t: 'escena', img: 'assets/img/escenas/halloween-familia.jpg',
        ep: 'Dulce o truco 🎃', h: 'Ellos, dulces.<br><em>Vos, café.</em>', grande: true, bajar: 40 }
    ]
  },

  /* ======================= NOVIEMBRE — fotos de ambiente en el feed ======================= */
  {
    id: 'x3-vie-carrusel-dedica-ambiente', semana: 7, dia: 'Viernes', tipo: 'carrusel',
    titulo: 'Dedica en casa (fotos de ambiente)',
    caption:
      'Poco lugar. Mucho café. ☕\n\n' +
      `La ${P.nombre(D)} mide ${cm(D.medidas.ancho)} de ancho: entra en cualquier mesada y en unos 40 segundos está lista para el espresso. ` +
      'Con el Cappuccino System hacés la espuma para el cortado o el latte.\n\n' +
      preciosCortos(D) + '\n\n' +
      COMO_PAGAR + ' Envío gratis a todo el país.\n\n' +
      'Guardalo para comparar.\n\n' +
      '¿Vos sos de cortado o de latte?\n\n#delonghi #dedica #espresso #cafeencasa #barista',
    placas: [
      { t: 'escena', estilo: 'tarjeta', img: 'assets/img/escenas/feed-dedica-blanca-espumando.jpg',
        ep: `${D.modelo.split(' ')[0]} · ${cm(D.medidas.ancho)} de ancho`, h: 'Poco lugar.<br><em>Mucho café.</em>' },
      { t: 'escena', estilo: 'limpia', img: 'assets/img/escenas/feed-dedica-negra-espresso.jpg' },
      placaPrecio(D),
      { t: 'cta', tono: 'oscuro', ep: 'Para decidir tranquilo', h: 'Guardalo para comparar.',
        sub: '¿Cortado o latte?', boton: 'Link en la bio' }
    ]
  },
  {
    id: 'x4-lun-carrusel-magnifica-ambiente', semana: 8, dia: 'Lunes', tipo: 'carrusel',
    titulo: 'Magnifica S en casa (fotos de ambiente)',
    caption:
      'Dos cafés, un botón. ☕\n\n' +
      `La ${P.nombre(M)} muele el grano en el momento y prepara el espresso sola. ` +
      'Con el vaporizador espumás la leche para el cappuccino o el latte.\n\n' +
      preciosCortos(M) + '\n\n' +
      COMO_PAGAR + ' Envío gratis a todo el país.\n\n' +
      'Guardalo para comparar.\n\n' +
      '¿Vos, con leche o sin leche?\n\n#delonghi #magnificas #cafeencasa #cafetera #latteart',
    placas: [
      { t: 'escena', estilo: 'tarjeta', img: 'assets/img/escenas/feed-magnifica-desayuno-pareja.jpg',
        ep: M.modelo, h: 'Dos cafés,<br><em>un botón.</em>' },
      { t: 'escena', estilo: 'limpia', img: 'assets/img/escenas/feed-magnifica-latte-art.jpg' },
      { t: 'escena', estilo: 'limpia', img: 'assets/img/escenas/feed-magnifica-sillon.jpg' },
      placaPrecio(M),
      { t: 'cta', tono: 'oscuro', ep: 'Para decidir tranquilo', h: 'Guardalo para comparar.',
        sub: '¿Con leche o sin leche?', boton: 'Link en la bio' }
    ]
  },

  /* ======================= NOVIEMBRE-DICIEMBRE — fotos de ambiente ======================= */
  ...(() => {
    const E = n => `assets/img/escenas/feed-${n}.jpg`;
    const foto = n => ({ t: 'escena', estilo: 'limpia', img: E(n) });
    const tarjeta = (n, ep, h, extra = {}) => ({ t: 'escena', estilo: 'tarjeta', img: E(n), ep, h, ...extra });
    const cierre = sub => ({ t: 'cta', tono: 'oscuro', ep: 'Para decidir tranquilo', h: 'Guardalo para comparar.', sub, boton: 'Link en la bio' });
    // Cierre con un motivo concreto (regla del calendario: nada de "Guardalo para comparar")
    const cierreE = (accion, motivo, sub) => ({ t: 'cta', tono: 'oscuro', ep: 'Antes de irte', h: `${accion}<br>${motivo}`, sub, boton: 'Link en la bio' });
    const pago = ps => ps.map(preciosCortos).join('\n\n') + '\n\n' + COMO_PAGAR + ' Envío gratis a todo el país.';
    const texto = (gancho, cuerpo, ps, accion, pregunta, tags) =>
      [gancho, cuerpo, pago(ps), accion, pregunta, tags].filter(Boolean).join('\n\n');
    const pieza = (id, tipo, titulo, caption, placas) => ({ id, semana: 9, dia: 'Lunes', tipo, titulo, caption, placas });
    const ENTREGA = 'Si es para regalar, consultá por WhatsApp la fecha de entrega antes de comprar.';
    return [
      pieza('f1118-carrusel-cual-va', 'carrusel', '¿Cuál va con tu casa?',
        texto('¿Cuál va con tu casa? ☕',
          `${M.modelo}: apretás un botón y muele el grano en el momento.\n${D.modelo}: ${cm(D.medidas.ancho)} de ancho, para los que disfrutan prepararlo a mano.`,
          DISP, 'Guardalo para comparar.', `¿Botón o ritual?`, '#cafeencasa #delonghi #magnificas #dedica #cafetera'),
        [tarjeta('magnifica-mueble', 'Dos formas de tomar café', '¿Cuál va<br><em>con tu casa?</em>'),
         foto('magnifica-desayuno-pareja'), foto('dedica-blanca-espumando'), ...DISP.map(placaPrecio), cierre('¿Botón o ritual?')]),
      pieza('f1120-post-magnifica-mueble', 'post', 'Magnifica S en el mueble (foto sola)',
        texto('Un lugar en la casa para el café. ☕', `La ${P.nombre(M)}: ${cm(M.medidas.ancho)} de ancho, molinillo integrado y un botón por taza.`,
          [M], 'Guardalo para cuando armes tu rincón del café.', '¿En la cocina o en el living?', '#delonghi #magnificas #cafeencasa #deco'),
        [foto('magnifica-mueble')]),
      pieza('f1123-post-dedica-ventana', 'post', 'Dedica junto a la ventana',
        texto('Tu rincón, tu ritual. ☕', `La ${P.nombre(D)} entra en ${cm(D.medidas.ancho)} y está lista en unos 40 segundos.`,
          [D], 'Guardalo para comparar.', '¿Café en la ventana o en la mesa?', '#delonghi #dedica #cafeencasa #espresso'),
        [tarjeta('dedica-ventana', `Dedica · ${cm(D.medidas.ancho)} de ancho`, 'Tu rincón,<br><em>tu ritual.</em>')]),
      pieza('f1127-carrusel-black-friday', 'carrusel', 'Black Friday',
        texto('¿Esperabas el Black Friday? ☕', `Acá el ${OFF}% OFF por transferencia es todos los días. Y si preferís financiar, tenés cuotas sin interés en Mercado Libre.`,
          DISP, 'Guardalo para comparar.', '¿Vos qué elegís: transferencia o cuotas?', '#blackfriday #cafeencasa #delonghi #cafetera'),
        [tarjeta('magnifica-latte-art', 'Black Friday', `${OFF}% OFF,<br><em>todos los días.</em>`, { pildora: 'Pagando por transferencia o efectivo' }),
         foto('dedica-negra-espresso'), ...DISP.map(placaPrecio), cierre('¿Transferencia o cuotas?')]),
      pieza('f1130-post-magnifica-estudio', 'post', 'Magnifica S, último sprint del año',
        texto('Último sprint del año. ☕', `Para las tardes largas de estudio o de trabajo, la ${P.nombre(M)} muele el grano en el momento y te deja el espresso con un botón.`,
          [M], 'Guardalo para comparar.', '¿Vos estudiás o trabajás con café?', '#delonghi #magnificas #cafeencasa #estudio'),
        [tarjeta('magnifica-estudio', 'Fin de año', 'Último sprint,<br><em>buen café.</em>')]),

      pieza('f1201-carrusel-regalo-navidad', 'carrusel', 'Regalo de Navidad',
        texto('El regalo que se usa todos los días. 🎄', `Una cafetera para la casa: ${M.modelo} si quieren un botón, ${D.modelo} si les gusta prepararlo.\n\n${ENTREGA}`,
          DISP, 'Mandáselo a quien todavía no sabe qué regalar.', '¿Para quién sería: para vos o para regalar?', '#navidad #regalodenavidad #cafeencasa #delonghi'),
        [tarjeta('magnifica-desayuno-familia', 'Navidad', 'El regalo que se usa<br><em>todos los días.</em>'),
         foto('magnifica-sillon'), foto('dedica-ventana'), ...DISP.map(placaPrecio), cierre('¿Para vos o para regalar?')]),
      pieza('f1204-post-dedica-espresso', 'post', 'Dedica negra, espresso (foto sola)',
        texto('Espresso de verdad, en tu casa. ☕', `La ${P.nombre(D)}: portafiltro, 15 bares y lista en unos 40 segundos.`,
          [D], 'Guardalo para comparar.', '¿Simple o doble?', '#delonghi #dedica #espresso #cafeencasa'),
        [foto('dedica-negra-espresso')]),
      pieza('f1209-post-magnifica-home-office', 'post', 'Magnifica S, home office',
        texto('La última semana de laburo, con buen café. ☕', `La ${P.nombre(M)} lo hace con un botón, entre reunión y reunión.`,
          [M], 'Guardalo para tu próximo día de home office.', '¿Cuántos cafés tomás en un día de trabajo: uno o más de dos?', '#homeoffice #delonghi #magnificas #cafeencasa'),
        [tarjeta('magnifica-home-office', 'Home office', 'Entre reunión<br><em>y reunión.</em>')]),
      pieza('f1211-post-dedica-espumando', 'post', 'Dedica blanca espumando (foto sola)',
        texto('La espuma, en casa. ☕', `Con el Cappuccino System de la ${P.nombre(D)} hacés la leche para el cortado, el cappuccino o el latte.`,
          [D], 'Guardalo para comparar.', '¿Cortado o latte?', '#delonghi #dedica #cappuccino #cafeencasa'),
        [foto('dedica-blanca-espumando')]),
      pieza('f1215-carrusel-antes-de-navidad', 'carrusel', 'Antes de Navidad',
        texto('Faltan 10 días para Navidad. 🎄', `Si la querés para regalar, escribinos por WhatsApp y te confirmamos la fecha de entrega antes de comprar.`,
          DISP, 'Mandáselo a quien está armando los regalos.', '¿Ya tenés los regalos o vas a último momento?', '#navidad #regalodenavidad #cafeencasa #delonghi'),
        [tarjeta('magnifica-desayuno', 'Faltan 10 días', 'Regalá café<br><em>de cafetería.</em>', { pildora: 'Consultá la fecha de entrega por WhatsApp' }),
         foto('magnifica-latte-art'), ...DISP.map(placaPrecio), cierre('¿Para vos o para regalar?')]),
      pieza('f1218-post-magnifica-sillon', 'post', 'Magnifica S, sillón (foto sola)',
        texto('Regalátela. ☕', `Después de un año largo, el café de cafetería en tu casa. La ${P.nombre(M)} lo hace con un botón.`,
          [M], 'Guardalo para comparar.', '¿Con leche o sin leche?', '#delonghi #magnificas #cafeencasa #regalo'),
        [foto('magnifica-sillon')]),
      pieza('f1221-post-dedica-ventana-navidad', 'post', 'Dedica, última semana para regalar',
        texto('Última semana para regalar. 🎄', `La ${P.nombre(D)}: ${cm(D.medidas.ancho)} de ancho y todo el ritual del espresso.\n\n${ENTREGA}`,
          [D], 'Mandáselo a quien te pidió ideas de regalo.', '¿Para vos o para regalar?', '#navidad #regalodenavidad #delonghi #dedica'),
        [tarjeta('dedica-blanca-espumando', 'Última semana', 'El regalo<br><em>más rico.</em>')]),
      pieza('f1229-post-magnifica-noche', 'post', 'Magnifica S, fin de año',
        texto('Para arrancar el 2027 con buen café. ☕', `La ${P.nombre(M)} muele el grano en el momento: el café de cafetería, todos los días del año que viene.`,
          [M], 'Guardalo para comparar.', '¿El año que viene: más cafés o mejores cafés?', '#añonuevo #delonghi #magnificas #cafeencasa'),
        [tarjeta('magnifica-estudio-noche', 'Fin de año', 'El 2027 arranca<br><em>con buen café.</em>')]),

      /* ---- Estrategia emocional (marca/ESTRATEGIA.md): "El lujo de todos los días" ---- */
      pieza('e1124-carrusel-lujo-de-todos-los-dias', 'carrusel', 'El lujo de todos los días',
        texto('El lujo de todos los días. ☕',
          'El lujo no es algo que se guarda para una ocasión especial. Es el primer café de la mañana, hecho como te gusta, en tu casa.\n\nGanás tiempo, sabor y buen humor. Todos los días.',
          DISP, 'Guardalo para la próxima vez que pienses "algún día".', '¿Cuál es tu primer café del día?', '#cafeencasa #delonghi #buenamañana #cafetera'),
        [tarjeta('magnifica-desayuno', 'Café en tu Casa', 'El lujo<br><em>de todos los días.</em>'),
         { t: 'lista', tono: 'gris', ep: 'Lo que ganás', h: 'Cada mañana',
           items: [['Tiempo', 'No salís a buscarlo. Apretás un botón.'],
                   ['Sabor', 'El grano se muele en el momento, para cada taza.'],
                   ['Buen humor', 'El día arranca bien. Y se nota.']] },
         foto('magnifica-latte-art'), ...DISP.map(placaPrecio), cierreE('Mandáselo a quien', 'arranca el día con café.', '¿Cuál es tu primer café?')]),
      pieza('e1130-post-vos-tambien', 'post', 'Tu casa merece café de verdad',
        texto('Tu casa merece café de verdad. Vos también. ☕',
          `Trabajaste todo el año. Una buena mañana empieza con un buen café, y ese café lo podés tener en tu cocina. La ${P.nombre(M)} muele el grano en el momento y te lo sirve con un botón.`,
          [M], 'Mandáselo a quien se merece un buen café este año.', '¿Hace cuánto que te debés un buen café en casa?', '#cafeencasa #delonghi #magnificas #telomereces'),
        [tarjeta('magnifica-desayuno-pareja', 'Café de cafetería, en tu casa', 'Tu casa merece café de verdad.<br><em>Vos también.</em>')]),
      pieza('e1204-carrusel-no-viene-en-capsulas', 'carrusel', 'Una buena mañana no viene en cápsulas',
        texto('Una buena mañana no viene en cápsulas. ☕',
          `No es otra cafetera. Es otro café.\n\nLa cápsula trae café que se molió en la fábrica. En una superautomática el grano se muele segundos antes de cada taza. Vos elegís el grano, la molienda y si va con leche. Y no te queda una cápsula por cada café.\n\nCon un kilo de grano a ${fmt(TIENDA.precioKiloCafe)}, cada taza te sale unos ${fmt(costoCasa)}.`,
          DISP, '', '¿Cápsula o grano? Escribinos por WhatsApp desde el link de la bio y te ayudamos a pasarte al grano 👇', '#cafeengrano #capsulas #cafeencasa #delonghi'),
        [tarjeta('magnifica-latte-art', 'La diferencia', 'Una buena mañana<br><em>no viene en cápsulas.</em>'),
         { t: 'dos', tono: 'gris', h: 'No es otra cafetera. Es otro café.',
           cols: [
             { ep: 'Cápsula', h: 'Molido hace meses', items: ['Siempre el mismo sabor', 'Una cápsula por taza'] },
             { destacada: true, ep: 'Grano', h: 'Molido en el momento', items: ['Vos elegís grano y molienda', 'Queda borra, para las plantas'] }
           ] },
         { t: 'dato', tono: 'oscuro', ep: 'Cada taza de grano, aprox.', num: fmt(costoCasa),
           sub: `Con un kilo a ${fmt(TIENDA.precioKiloCafe)} y ${TIENDA.cafesPorKilo} tazas por kilo.`, p: 'Valor aproximado, con precio de grano relevado el 26/10.' },
         ...DISP.map(placaPrecio), { t: 'cta', tono: 'oscuro', ep: 'Contanos', h: '¿Cápsula o grano?', sub: 'Escribinos y te ayudamos a pasarte al grano.', boton: 'Escribinos por WhatsApp' }]),
      pieza('e1214-post-te-das-el-gusto', 'post', 'Te das el gusto porque podés',
        texto('Te das el gusto porque podés. ☕',
          `Este año el regalo es para vos. Es de los que se usan todas las mañanas, durante años. La ${P.nombre(M)}: un botón, grano recién molido, el café de cafetería en tu casa.`,
          [M], '', '¿Te la regalás o te la regalan? Escribinos por WhatsApp desde el link de la bio 👇', '#cafeencasa #delonghi #magnificas #regalo #telomereces'),
        [tarjeta('magnifica-sillon', 'Esto es para vos', 'Te das el gusto<br><em>porque podés.</em>')]),
      pieza('e1223-carrusel-cada-manana-distinta', 'carrusel', 'Cada mañana arranca distinto',
        texto('Cada mañana arranca distinto. ☕',
          'El lunes, un espresso corto para arrancar. El miércoles, un latte sin apuro. El domingo, un cortado para dos.\n\nCon la cápsula es siempre lo mismo. Con tu cafetera, elegís cada mañana.',
          DISP, '', '¿Cuál es tu café del domingo? Escribinos por WhatsApp y te decimos qué cafetera va con tu semana 👇', '#cafeencasa #delonghi #espresso #latte #buenamañana'),
        [tarjeta('dedica-negra-espresso', 'Lunes', 'Un espresso corto<br><em>para arrancar.</em>'),
         tarjeta('dedica-blanca-espumando', 'Miércoles', 'Un latte<br><em>sin apuro.</em>'),
         tarjeta('magnifica-desayuno-familia', 'Domingo', 'Un cortado<br><em>para compartir.</em>'),
         ...DISP.map(placaPrecio), { t: 'cta', tono: 'oscuro', ep: 'Contanos', h: '¿Cuál es tu café del domingo?', sub: 'Escribinos y te decimos qué cafetera va con tu semana.', boton: 'Escribinos por WhatsApp' }])
    ];
  })(),

  /* ================= DÍA DE LA MADRE (domingo 18/10) =================
     Se le habla al que compra el regalo. Las fechas de entrega NO se
     prometen acá: se confirman con Lucas y se contestan por WhatsApp. */
  {
    id: 'dm-mar-carrusel-regalo-mama', semana: 1, dia: 'Martes', tipo: 'carrusel', fecha: '2026-10-13',
    titulo: 'El regalo que mamá usa todos los días',
    caption:
      'El regalo que mamá usa todos los días. ☕\n\n' +
      'Para el Día de la Madre (domingo 18/10), tres cafeteras:\n\n' +
      PRODUCTOS.map(p => `${p.modelo}: ${fmt(P.transferencia(p))} por transferencia (${OFF}% OFF) o ${p.cuotas} cuotas sin interés de ${fmt(P.cuota(p))} en Mercado Libre.`).join('\n') + '\n\n' +
      `Las tres con envío gratis a todo el país y ${TIENDA.garantiaMeses} meses de garantía oficial. Nuevas y selladas de fábrica.\n\n` +
      WA + '\n\n' +
      cierre('Guardalo para regalar, o compartilo con quien lo va a regalar con vos.', '¿Quién es la mamá cafetera de tu casa? 👇') +
      '\n\n#diadelamadre #regalodiadelamadre #cafeencasa #cafetera #delonghi #krups',
    placas: [
      { t: 'portada', ep: 'Día de la Madre · domingo 18/10', h: 'El regalo que mamá usa todos los días.', sub: 'Tres cafeteras para regalar.', img: M.imgs[1] },
      ...PRODUCTOS.map(p => ({ t: 'foto', tono: 'gris', ep: `${p.modelo} · ${OFF}% OFF`, h: fmt(P.transferencia(p)),
        sub: `por transferencia, o ${p.cuotas} cuotas sin interés de ${fmt(P.cuota(p))} en Mercado Libre.`, img: p.imgs[0] })),
      { t: 'lista', tono: 'gris', ep: 'Para regalar tranquilo', h: 'Las tres, con todo',
        items: [['Envío gratis a todo el país', 'Con número de seguimiento.'],
                [`${TIENDA.garantiaMeses} meses de garantía oficial`, 'Con servicio técnico en el país.'],
                ['Nueva y sellada de fábrica', 'Lista para envolver.']] },
      { t: 'cta', tono: 'oscuro', ep: 'Guardalo para regalar', h: '¿Quién es la mamá cafetera de tu casa?', sub: 'Contanos en los comentarios.', boton: 'Guardalo · Compartilo' }
    ]
  },
  {
    id: 'dm-sab-historia-manana', semana: 1, dia: 'Sábado', tipo: 'historia', fecha: '2026-10-17',
    titulo: 'Mañana es el Día de la Madre',
    caption: '',
    nota: 'Al publicarla: sticker de preguntas ("¿Qué le regalás a mamá?") o encuesta (¿Magnifica, Krups o Dedica?) en el espacio libre, y sticker de link a WhatsApp.',
    placas: [
      { t: 'texto', tono: 'oscuro', ep: 'Mañana es el Día de la Madre', h: '¿Ya tenés el regalo?',
        p: 'Dejanos tu pregunta acá abajo o escribinos por WhatsApp: te ayudamos a elegir.', pildora: `WhatsApp ${TIENDA.whatsappVisible}` }
    ]
  },
  {
    id: 'dm-dom-historia-feliz-dia', semana: 1, dia: 'Domingo', tipo: 'historia', fecha: '2026-10-18',
    titulo: 'Feliz Día de la Madre',
    caption: '',
    nota: 'Al publicarla: sticker de link a WhatsApp (wa.me/' + TIENDA.whatsapp + ').',
    placas: [
      { t: 'cta', tono: 'oscuro', ep: 'Domingo 18 de octubre', h: 'Feliz día, mamá. ☕',
        sub: '¿Consultas? Escribinos por WhatsApp, también hoy.', boton: `WhatsApp ${TIENDA.whatsappVisible}` }
    ]
  }
,
  {
    /* Carrusel de dudas reales (mismo formato que el FAQ del 11/11, 213 vistas).
       Reporte del 16/11: para diciembre, en borrador hasta que haya crédito y
       Lucas confirme la fecha límite de compra para que llegue en Navidad. */
    id: 'dic-jue-carrusel-dudas-antes-de-comprar', semana: 0, dia: 'Jueves', tipo: 'carrusel', fecha: '2026-12-03',
    titulo: 'Antes de comprar: las 4 dudas',
    caption:
      'Las 4 dudas antes de comprar, respondidas. 👇\n\n' +
      '¿Llega para Navidad? Escribinos antes de comprar y te confirmamos la fecha de entrega.\n' +
      '¿Puedo pagar la mitad en cuotas? No: el 20% OFF es por transferencia o efectivo y las cuotas sin interés son en Mercado Libre. No se combinan.\n' +
      '¿Es original? Sí: De\'Longhi nueva, en su caja.\n' +
      '¿Y si llega mal? Te cubre la política de Mercado Libre. Escribinos apenas la recibís.\n\n' +
      'Mandáselo a quien está por comprar el regalo.\n\n' +
      '¿Cuál de las cuatro era tu duda?\n\n#cafeencasa #cafetera #delonghi #navidad',
    placas: [
      { t: 'portada', ep: 'Antes de comprar', h: 'Las 4 dudas de siempre.', sub: 'Respondidas en cuatro placas.' },
      { t: 'texto', tono: 'gris', ep: '¿Llega para Navidad?', h: 'Te confirmamos la fecha.', p: 'Escribinos por WhatsApp antes de comprar y te decimos cuándo llega a tu ciudad.' },
      { t: 'texto', ep: '¿Puedo pagar la mitad en cuotas?', h: 'No: se elige una.', p: '20% OFF por transferencia o efectivo, o cuotas sin interés en Mercado Libre. No se combinan.' },
      { t: 'texto', tono: 'gris', ep: '¿Es original?', h: 'Sí, De\'Longhi original.', p: 'Nueva, en su caja. Y cada compra tiene la protección de Mercado Libre.' },
      { t: 'texto', ep: '¿Y si llega mal?', h: 'Te cubre Mercado Libre.', p: 'Según su política de devoluciones. Escribinos apenas la recibís y lo resolvemos.' },
      { t: 'cta', tono: 'oscuro', ep: '¿Otra duda?', h: 'Escribinos.', sub: 'Contestamos en el día.', boton: 'WhatsApp · link en la bio' }
    ]
  }


,

  /* ================= DICIEMBRE · 5 carruseles (estrategia del 17/11) =================
     Objetivo: alcance nuevo. Público: el que se la compra para sí. Foco: Magnifica S.
     Tono mixto: humor en el gancho y el cierre, datos sobrios en el medio.
     Mecánicas: contador, frase al pie ("sigue"), quiz con la respuesta en la
     placa siguiente, chat y ticket. Estética de la marca (estilo 'pop' en
     pieza.css: blanco, gris, oscuro y un solo acento oliva).
     Precio solo al final. Cierre: Escribinos por WhatsApp + pregunta fácil.
     Fotos de Flow (marcar como IA en Metricool): instagram/fotos/. */
  {
    id: 'dic-lun-carrusel-regalatela', semana: 0, dia: 'Martes', tipo: 'carrusel', fecha: '2026-12-08', estilo: 'pop',
    titulo: 'Este año, el regalo es para vos',
    caption:
      'Este año, el regalo es para vos. ☕🎄\n\n' +
      'Test de 20 segundos: ¿cómo es tu mañana?\n' +
      'A) Abrís un ojo y querés el café YA → Magnifica S: apretás un botón y muele el grano en el momento.\n' +
      `B) El café es tu ceremonia → Dedica EC685: ${cm(D.medidas.ancho)} de ancho y todo el ritual.\n\n` +
      `Magnifica S\n💸 ${fmt(P.transferencia(M))} por transferencia (${OFF}% OFF)\n💳 o ${M.cuotas} cuotas sin interés de ${fmt(P.cuota(M))} en Mercado Libre\n\n` +
      `Dedica EC685\n💸 ${fmt(P.transferencia(D))} por transferencia (${OFF}% OFF)\n💳 o ${D.cuotas} cuotas sin interés de ${fmt(P.cuota(D))} en Mercado Libre\n\n` +
      `El ${OFF}% OFF es pagando por transferencia o efectivo; las cuotas son en Mercado Libre. No se combinan. Envío gratis a todo el país.\n\n` +
      '¿Sos A o B? Escribinos por WhatsApp desde el link de la bio y te ayudamos a elegir 👇\n\n#cafeencasa #regalodenavidad #delonghi #magnificas #dedica',
    placas: [
      { t: 'tapa', ep: 'Navidad · para vos', h: 'Este año, el regalo es <mark>para vos</mark>.',
        sub: 'Test de 20 segundos: ¿qué cafetera va con tu mañana?', img: F + 'regalatela-magnifica.jpg', desliza: 'Hacé el test' },
      { t: 'chat', tono: 'gris', ep: '¿Te suena?', grupo: 'Hoy, 8:05',
        msjs: [['Vos', 'Un cortadito rápido en el bar y salgo.'], ['Tu billetera', 'Ayer dijiste lo mismo.'],
               ['Vos', 'Son $4.000 nomás.'], ['yo', 'Este año me regalo la cafetera.']], sigue: '¿Qué cafetero sos?' },
      { t: 'quiz', ep: 'El test', h: '¿Cómo es tu mañana?',
        ops: ['Abrís un ojo y querés el café YA', 'El café es tu ceremonia'], sigue: 'Si sos A' },
      { t: 'foto', tono: 'gris', ep: 'Si sos A · el del botón', h: 'Magnifica S', sub: 'Apretás un botón y muele el grano en el momento.',
        img: F + 'magnifica-latte-cenital.jpg', llena: true, sigue: 'Si sos B' },
      { t: 'foto', ep: 'Si sos B · el del ritual', h: 'Dedica EC685', sub: `${cm(D.medidas.ancho)} de ancho. Vos dosificás, vos preparás.`,
        img: F + 'dedica-espresso-travertino.jpg', llena: true, sigue: 'Punto por punto' },
      { t: 'texto', tono: 'gris', ep: 'Punto por punto', h: '¿Cuál va con vos?', graf: 'comparativa', sigue: 'Cuánto salen' },
      { t: 'lista', ep: 'Cuánto salen', h: 'Por transferencia',
        items: [[`Magnifica S · ${fmt(P.transferencia(M))}`, `o ${M.cuotas} cuotas sin interés de ${fmt(P.cuota(M))} en Mercado Libre.`],
                [`Dedica EC685 · ${fmt(P.transferencia(D))}`, `o ${D.cuotas} cuotas sin interés de ${fmt(P.cuota(D))} en Mercado Libre.`]],
        chica: `El ${OFF}% OFF es por transferencia o efectivo; las cuotas, en Mercado Libre. No se combinan. Envío gratis a todo el país.`, sigue: 'Última' },
      { t: 'cta', tono: 'oscuro', ep: '¿Sos A o B?', h: 'Contanos y te asesoramos.',
        sub: 'Escribinos con la letra: te decimos cuál va con vos.', boton: 'Escribinos por WhatsApp' }
    ]
  },
  {
    /* La historia de plata que mejor anduvo ("Dos vecinos", 1.231 vistas), con quiz.
       Mismos números que la calculadora del sitio (TIENDA). */
    id: 'dic-jue-carrusel-dos-vecinos', semana: 0, dia: 'Jueves', tipo: 'carrusel', fecha: '2026-12-10', estilo: 'pop',
    titulo: 'Dos vecinos: adiviná cuánto gasta 3° A',
    caption:
      `5° B gasta ${fmt(ANIO_AFUERA)} por año en café. ¿Y 3° A? 🏢☕\n\n` +
      'Mismo edificio, mismos 2 cafés por día. Uno baja al bar; el otro baja en pantuflas… a su cocina.\n\n' +
      'Adiviná antes de deslizar: ¿A, B o C? La respuesta está en la placa 4.\n\n' +
      `Con la diferencia, la Magnifica S se paga en unos ${mesesAmort} meses y la Dedica en unos ${MESES_DEDICA}.\n` +
      'Valores aproximados, con precios de café relevados el 26/10. En el sitio tenés la calculadora para hacer tu cuenta.\n\n' +
      `Magnifica S: ${fmt(P.transferencia(M))} por transferencia (${OFF}% OFF) o ${M.cuotas} cuotas sin interés de ${fmt(P.cuota(M))} en Mercado Libre.\n` +
      `Dedica EC685: ${fmt(P.transferencia(D))} por transferencia (${OFF}% OFF) o ${D.cuotas} cuotas sin interés de ${fmt(P.cuota(D))} en Mercado Libre.\n` +
      'No se combinan. Envío gratis a todo el país.\n\n' +
      '¿Sos 5° B o 3° A? Escribinos por WhatsApp y te hacemos la cuenta con tus números 👇\n\n#cafeencasa #ahorro #delonghi #magnificas',
    placas: [
      { t: 'tapa', ep: 'Dos vecinos · mismo edificio', h: `5° B gasta <mark>${fmt(ANIO_AFUERA)}</mark> por año en café.`,
        sub: '3° A toma el mismo café. Adiviná cuánto gasta él.', img: F + 'dos-vecinos.jpg', desliza: 'Adiviná' },
      { t: 'dos', tono: 'gris', h: 'El mismo café, todas las mañanas',
        cols: [
          { ep: '5° B', h: 'Baja al bar', items: [`${CAFES_DIA} cafés por día, a ${fmt(TIENDA.precioCafeAfuera)}`, 'El barista ya sabe su nombre'] },
          { destacada: true, ep: '3° A', h: 'Baja en pantuflas', items: [`Los mismos ${CAFES_DIA} cafés`, 'A su propia cocina'] }
        ], sigue: 'Tu turno' },
      { t: 'quiz', ep: 'Adiviná', h: '¿Cuánto gasta 3° A por año?',
        ops: ['Más de $1.000.000', 'Unos $600.000', 'Menos de $350.000'], sigue: 'La respuesta' },
      { t: 'revela', tono: 'gris', ep: 'Respuesta: C', num: fmt(ANIO_CASA), sub: 'por año, con grano recién molido.',
        p: `Unos ${fmt(costoCasa)} por taza, contra ${fmt(TIENDA.precioCafeAfuera)} en el bar.`, sigue: 'El ticket de 5° B' },
      { t: 'ticket', tono: 'oscuro', ep: 'Mientras tanto, en 5° B…', h: 'El ticket del año', titulo: 'BAR DE LA ESQUINA',
        lineas: [[`${CAFES_DIA * 365} cafés × ${fmt(TIENDA.precioCafeAfuera)}`, fmt(ANIO_AFUERA)], ['Medialunas "solo por hoy"', 'sin contar'], ['Paraguas olvidados', 'varios']],
        total: ['TOTAL', fmt(ANIO_AFUERA)], sigue: 'Plot twist' },
      { t: 'texto', ep: 'Plot twist', h: 'La Magnifica S <mark>se paga sola</mark>', graf: 'amortizacion',
        chica: `Magnifica S a ${fmt(P.transferencia(M))} por transferencia. La Dedica (${fmt(P.transferencia(D))}) se paga en unos ${MESES_DEDICA} meses. Valores aproximados (precios al 26/10).`,
        sigue: 'Última pregunta' },
      { t: 'cta', tono: 'oscuro', ep: 'Sin juzgar (bueno, un poco)', h: '¿Sos 5° B o 3° A?',
        sub: 'Escribinos y te hacemos la cuenta con tus números.', boton: 'Escribinos por WhatsApp' }
    ]
  },
  {
    id: 'dic-jue-carrusel-errores-primera-cafetera', semana: 0, dia: 'Jueves', tipo: 'carrusel', fecha: '2026-12-17', estilo: 'pop',
    titulo: 'Llegó la cafetera. No entraba.',
    caption:
      'Llegó la cafetera. No entraba. 😬\n\n' +
      '5 errores con la primera cafetera (y cómo no cometerlos):\n\n' +
      '1. No medir la mesada… ni la altura bajo la alacena.\n' +
      '2. Mirar solo el precio de la máquina y no lo que gastás en el bar.\n' +
      '3. Olvidarte de la leche, si sos de cortado.\n' +
      '4. Comprar molido en paquetes gigantes.\n' +
      '5. No preguntar cuándo llega.\n\n' +
      'Al final está la checklist: guardala para el día que compres.\n\n' +
      '¿Cuál casi te pasa? Escribinos por WhatsApp antes de comprar y te ayudamos a medir y elegir 👇\n\n#cafeencasa #cafetera #espresso #delonghi',
    placas: [
      { t: 'tapa', ep: 'Antes de comprar', h: 'Llegó la cafetera. <mark>No entraba.</mark>',
        sub: '5 errores con la primera cafetera, y cómo no cometerlos.', img: F + 'no-entraba-magnifica.jpg', desliza: 'Ver los 5' },
      { t: 'error', tono: 'gris', icono: 'regla', n: 1, de: 5, h: 'No medir la mesada.', p: 'Ni la altura bajo la alacena. Así son, a escala:', graf: 'medidas', sigue: 'El 2 duele' },
      { t: 'error', icono: 'bar', n: 2, de: 5, h: 'Mirar solo el precio de la máquina.',
        p: 'Lo caro es lo que gastás en café todos los meses.', graf: 'mes', sigue: 'Para los de cortado' },
      { t: 'error', tono: 'gris', icono: 'leche', n: 3, de: 5, h: 'Olvidarte de la leche.', p: 'Si sos de cortado, cappuccino o latte, el espumador no es un detalle.',
        evitar: 'Fijate que tenga vaporizador. La Magnifica S y la Dedica lo traen.', img: F + 'pedido-bar-tazas.jpg', sigue: 'El 4 está en tu alacena' },
      { t: 'error', icono: 'frasco', n: 4, de: 5, h: 'Comprar molido en paquetes gigantes.', p: 'El café pierde aroma apenas se muele. El kilo abierto en marzo… ya sabés.',
        evitar: 'Comprá de a poco, o en grano y molelo en el momento.', sigue: 'El último' },
      { t: 'error', tono: 'oscuro', icono: 'calendario', n: 5, de: 5, h: 'No preguntar cuándo llega.', p: 'Sobre todo en diciembre.',
        evitar: 'Escribinos por WhatsApp antes de comprar y te confirmamos la fecha de entrega.', sigue: 'La checklist' },
      { t: 'lista', tono: 'gris', ep: 'Guardala para el día que compres', h: 'La checklist',
        items: [['Medí ancho y alto', 'Bajo la alacena también.'], ['Hacé la cuenta del bar', `${CAFES_DIA} cafés por día suman.`],
                ['¿Con leche? Que tenga espumador', ''], ['Café fresco, de a poco', ''], ['Fecha de entrega', 'Preguntá antes de comprar.']],
        sigue: 'Una pregunta' },
      { t: 'cta', tono: 'oscuro', ep: 'El 4 no cuenta: lo hicimos todos', h: '¿Cuál casi te pasa?',
        sub: 'Escribinos antes de comprar: te ayudamos a medir y elegir.', boton: 'Escribinos por WhatsApp',
        chica: `Magnifica S ${fmt(P.transferencia(M))} · Dedica ${fmt(P.transferencia(D))} por transferencia (${OFF}% OFF), o cuotas sin interés en Mercado Libre. No se combinan.` }
    ]
  },
  {
    /* El "por dentro" fue lo que más retuvo en reels (1.330 vistas, 28/10). */
    id: 'dic-mar-carrusel-por-dentro', semana: 0, dia: 'Martes', tipo: 'carrusel', fecha: '2026-12-22', estilo: 'pop',
    titulo: 'Apretás un botón. Adentro pasan 4 cosas.',
    caption:
      'Apretás un botón. Adentro de la Magnifica S pasan 4 cosas. 🤔☕\n\n' +
      '1. Muele: molinillo cónico de acero, 13 niveles.\n' +
      '2. Calienta: el Thermoblock lleva el agua a unos 90 °C al instante.\n' +
      '3. Prensa: compacta el café como un barista (y no te pide propina).\n' +
      '4. Extrae: hasta 15 bares de presión. Una rueda de auto anda por los 2.\n\n' +
      '¿Y la crema dorada? Son los aceites y el gas del grano recién molido, mezclados a presión.\n\n' +
      `Magnifica S\n💸 ${fmt(P.transferencia(M))} por transferencia (${OFF}% OFF)\n💳 o ${M.cuotas} cuotas sin interés de ${fmt(P.cuota(M))} en Mercado Libre\n\n` +
      `El ${OFF}% OFF es pagando por transferencia o efectivo; las cuotas son en Mercado Libre. No se combinan. Envío gratis a todo el país.\n\n` +
      '¿Cuál de los 4 no sabías? Escribinos por WhatsApp y te contamos más 👇\n\n#cafeencasa #delonghi #magnificas #espresso #comofunciona',
    placas: [
      { t: 'tapa', ep: 'Magnifica S · por dentro', h: 'Apretás un botón. Adentro pasan <mark>4 cosas</mark>.',
        sub: 'En lo que tardás en buscar la taza.', img: F + 'magnifica-latte-cenital.jpg', desliza: 'Paso 1' },
      { t: 'error', icono: 'molinillo', n: 1, de: 4, h: 'Muele.', p: 'Un molinillo cónico de acero muele el grano justo antes de cada taza.',
        titEvitar: 'Dato de sobremesa', evitar: '13 niveles: de más suave a más intenso.', sigue: 'Paso 2' },
      { t: 'error', tono: 'gris', icono: 'termometro', n: 2, de: 4, h: 'Calienta.', p: 'El Thermoblock lleva el agua a unos 90 °C al instante.',
        titEvitar: 'Dato de sobremesa', evitar: 'Sin esperar, como con la pava.', sigue: 'Paso 3' },
      { t: 'error', icono: 'prensa', n: 3, de: 4, h: 'Prensa.', p: 'Compacta el café molido, como el barista con el tamper.',
        titEvitar: 'Dato de sobremesa', evitar: 'Como un barista, pero no te pide propina.', sigue: 'Paso 4' },
      { t: 'error', tono: 'gris', icono: 'presion', n: 4, de: 4, h: 'Extrae.', p: 'La bomba empuja el agua a través del café con hasta 15 bares.',
        titEvitar: 'Dato de sobremesa', evitar: 'Una rueda de auto anda por los 2 bares.', sigue: '¿Y la crema?' },
      { t: 'texto', ep: '¿Y la crema dorada?', h: 'Sale del grano <mark>recién molido</mark>.',
        p: 'Son sus aceites y su gas, mezclados a presión. Por eso moler en el momento hace la diferencia.', graf: 'flujo', sigue: 'Cuánto sale' },
      { t: 'cta', tono: 'oscuro', ep: `Magnifica S · ${fmt(P.transferencia(M))} por transferencia`, h: '¿Cuál de los 4 no sabías?',
        sub: 'Escribinos y te contamos más.', boton: 'Escribinos por WhatsApp',
        chica: `o ${M.cuotas} cuotas sin interés de ${fmt(P.cuota(M))} en Mercado Libre. No se combinan. Envío gratis.` }
    ]
  },
  {
    /* Verano: café frío en casa. Fotos de Flow con la Dedica (17/11). */
    id: 'dic-lun-carrusel-iced-latte', semana: 0, dia: 'Lunes', tipo: 'carrusel', fecha: '2026-12-28', estilo: 'pop',
    titulo: 'Tu iced latte en casa, en 3 pasos',
    caption:
      'Se viene el calor: tu iced latte en casa, en 3 pasos. 🧊☕\n\n' +
      '1. Vaso alto con hielo hasta arriba.\n' +
      '2. Leche fría, unos 150 ml.\n' +
      '3. Espresso doble recién hecho, despacio y por encima.\n\n' +
      'Si lo querés dulce, el azúcar va en el espresso caliente: en la leche fría no se disuelve.\n\n' +
      `Magnifica S: ${fmt(P.transferencia(M))} por transferencia (${OFF}% OFF) o ${M.cuotas} cuotas sin interés de ${fmt(P.cuota(M))} en Mercado Libre.\n` +
      `Dedica EC685: ${fmt(P.transferencia(D))} por transferencia (${OFF}% OFF) o ${D.cuotas} cuotas sin interés de ${fmt(P.cuota(D))} en Mercado Libre.\n` +
      'No se combinan. Envío gratis a todo el país.\n\n' +
      '¿Iced latte o espresso aunque haga 35°? Escribinos por WhatsApp desde el link de la bio 👇\n\n#icedlatte #cafeencasa #verano #delonghi #dedica',
    placas: [
      { t: 'tapa', ep: 'Se viene el calor', h: 'Tu iced latte, <mark>en casa</mark>, en 3 pasos.',
        sub: 'Sin fila y sin vasito de plástico.', img: F + 'dedica-iced-latte.jpg', desliza: 'Primero, un quiz' },
      { t: 'quiz', tono: 'gris', ep: 'Adiviná', h: '¿Qué va primero en el vaso?',
        ops: ['El espresso', 'La leche', 'El hielo'], sigue: 'La respuesta' },
      { t: 'revela', ep: 'Respuesta: C', num: 'El hielo', sub: 'Después la leche y, al final, el espresso.', graf: 'iced', sigue: 'Paso 1' },
      { t: 'error', tono: 'gris', icono: 'hielo', n: 1, de: 3, h: 'Hielo hasta arriba.', p: 'En un vaso alto.',
        titEvitar: 'Tip', evitar: 'Vaso 10 minutos en el freezer y dura más frío.', sigue: 'Paso 2' },
      { t: 'error', icono: 'leche', n: 2, de: 3, h: 'Leche fría.', p: 'Unos 150 ml, o la vegetal que uses.',
        titEvitar: 'Tip', evitar: 'Si lo querés dulce, el azúcar va en el espresso caliente: en la leche fría no se disuelve.', sigue: 'Paso 3' },
      { t: 'error', tono: 'gris', icono: 'taza', n: 3, de: 3, h: 'Espresso doble, encima.', p: 'Recién hecho y despacio: vas a ver la mezcla bajando.',
        titEvitar: 'Tip', evitar: 'Con la Magnifica S o la Dedica, un botón.', img: F + 'dedica-espresso-travertino.jpg', sigue: 'Así queda' },
      { t: 'foto', ep: 'Resultado', h: 'Así queda.', sub: 'Y el segundo te sale mejor.', img: F + 'dedica-iced-latte-living.jpg', llena: true, sigue: 'Con qué hacerlo' },
      { t: 'lista', tono: 'gris', ep: 'Con qué hacerlo', h: 'Por transferencia',
        items: [[`Magnifica S · ${fmt(P.transferencia(M))}`, `o ${M.cuotas} cuotas sin interés de ${fmt(P.cuota(M))} en Mercado Libre.`],
                [`Dedica EC685 · ${fmt(P.transferencia(D))}`, `o ${D.cuotas} cuotas sin interés de ${fmt(P.cuota(D))} en Mercado Libre.`]],
        chica: `El ${OFF}% OFF es por transferencia o efectivo; las cuotas, en Mercado Libre. No se combinan. Envío gratis a todo el país.`, sigue: 'Última' },
      { t: 'cta', tono: 'oscuro', ep: 'Guardalo para el primer día de calor', h: '¿Iced latte o espresso, aunque haga 35°?',
        sub: 'Contestá en los comentarios. ¿Dudas con tu cafetera? Escribinos.', boton: 'Escribinos por WhatsApp' }
    ]
  }
,

  /* ================= ENERO 2027 · 5 carruseles más (17/11) =================
     Misma estrategia y diseño que los de diciembre. Los de referencia (guía,
     mitos, cuidado) cierran pidiendo guardar; los de producto, WhatsApp.
     Las fotos que todavía no existen (prompts en instagram/fotos/PROMPTS-diciembre.md)
     no rompen nada: la placa se arma sin ellas hasta que estén. */
  {
    id: 'ene-mar-carrusel-capsula-o-grano', semana: 0, dia: 'Martes', tipo: 'carrusel', fecha: '2027-01-05', estilo: 'pop',
    titulo: 'Tu café de cápsula se molió hace meses',
    caption:
      'Tu café de cápsula se molió hace meses. ☕\n\n' +
      'El café empieza a perder aroma apenas se muele. La cápsula se muele en fábrica y después viaja y espera en la alacena. El grano lo molés vos, taza por taza.\n\n' +
      'La cápsula gana en algo: es rápida. Una superautomática también: apretás un botón y muele en el momento.\n\n' +
      `Magnifica S\n💸 ${fmt(P.transferencia(M))} por transferencia (${OFF}% OFF)\n💳 o ${M.cuotas} cuotas sin interés de ${fmt(P.cuota(M))} en Mercado Libre\n` +
      'No se combinan. Envío gratis a todo el país.\n\n' +
      '¿Cápsula o grano? Escribinos por WhatsApp y te ayudamos a pasarte al grano 👇\n\n#cafeengrano #capsulas #cafeencasa #delonghi #magnificas',
    placas: [
      { t: 'tapa', ep: 'Cápsula o grano', h: 'Tu café de cápsula <mark>se molió hace meses</mark>.',
        sub: 'Qué cambia en la taza, en un minuto.', img: F + 'capsula-vs-grano.jpg', desliza: 'Primero, un quiz' },
      { t: 'quiz', tono: 'gris', ep: 'Adiviná', h: '¿Cuándo empieza a perder aroma el café?',
        ops: ['Cuando vence el paquete', 'Apenas se muele', 'Cuando se enfría la taza'], sigue: 'La respuesta' },
      { t: 'revela', ep: 'Respuesta: B', num: 'Al molerlo', sub: 'el aroma empieza a irse.', graf: 'aroma', sigue: 'Cápsula vs grano' },
      { t: 'dos', tono: 'gris', h: 'Cuándo se muele',
        cols: [
          { ep: 'Cápsula', h: 'En la fábrica', items: ['Después viaja', 'Y espera en la alacena'] },
          { destacada: true, ep: 'Grano', h: 'En tu cocina', items: ['Justo antes de la taza', 'Taza por taza'] }
        ], sigue: 'Lo que ganás' },
      { t: 'lista', ep: 'Con grano', h: 'Lo que ganás',
        items: [['Aroma recién molido', 'En cada taza.'], ['Elegís tu café', 'Tostador, origen, intensidad.'],
                ['Ajustás la molienda', '13 niveles en la Magnifica S.'], ['Menos cápsulas a la basura', '']], sigue: 'Lo justo' },
      { t: 'texto', tono: 'gris', ep: 'Para ser justos', h: 'La cápsula gana en algo: <mark>es rápida</mark>.',
        p: 'Una superautomática también: apretás un botón y muele el grano en el momento.', img: F + 'magnifica-latte-cenital.jpg', sigue: 'Cuánto sale' },
      { t: 'cta', tono: 'oscuro', ep: `Magnifica S · ${fmt(P.transferencia(M))} por transferencia`, h: '¿Cápsula o grano?',
        sub: 'Escribinos y te ayudamos a pasarte al grano.', boton: 'Escribinos por WhatsApp',
        chica: `o ${M.cuotas} cuotas sin interés de ${fmt(P.cuota(M))} en Mercado Libre. No se combinan. Envío gratis.` }
    ]
  },
  {
    id: 'ene-jue-carrusel-tu-pedido-del-bar', semana: 0, dia: 'Jueves', tipo: 'carrusel', fecha: '2027-01-07', estilo: 'pop',
    titulo: 'Lo que pedís en el bar, en casa',
    caption:
      '¿Cortado, lágrima o flat white? Lo que pedís en el bar, en casa. ☕\n\n' +
      'Cortado: espresso con un poco de leche.\n' +
      'Lágrima: mucha leche y unas gotas de café.\n' +
      'Cappuccino: espresso, leche y espuma en partes parecidas.\n' +
      'Latte: espresso, mucha leche y una capa fina de espuma.\n' +
      'Flat white: espresso doble y leche cremosa, casi sin espuma.\n\n' +
      'Con la Magnifica S salen los cinco: el espresso con un botón y la leche con el vaporizador.\n\n' +
      'Guardalo para tu próximo café.\n\n' +
      '¿Cuál es el tuyo? Contestá en los comentarios 👇\n\n#cortado #cappuccino #flatwhite #cafeencasa #delonghi',
    placas: [
      { t: 'tapa', ep: 'Guía de bar', h: 'Lo que pedís en el bar, <mark>en casa</mark>.',
        sub: '5 cafés y qué lleva cada uno.', img: F + 'pedido-bar-tazas.jpg', desliza: 'Ver la guía' },
      { t: 'receta', tono: 'gris', ep: '1 · El clásico', h: 'Cortado', capas: [['cafe', 3, 'Espresso'], ['leche', 1, 'Leche']],
        p: 'Espresso con un poco de leche caliente.', sigue: 'El del desayuno' },
      { t: 'receta', ep: '2 · El del desayuno', h: 'Lágrima', capas: [['cafe', 0.6, ''], ['leche', 4, 'Leche']],
        p: 'Mucha leche y unas gotas de café.', sigue: 'El de la espuma' },
      { t: 'receta', tono: 'gris', ep: '3 · El de la espuma', h: 'Cappuccino', capas: [['cafe', 1, 'Espresso'], ['leche', 1, 'Leche'], ['espuma', 1, 'Espuma']],
        p: 'Espresso, leche y espuma en partes parecidas.', sigue: 'El más suave' },
      { t: 'receta', ep: '4 · El más suave', h: 'Latte', capas: [['cafe', 1, 'Espresso'], ['leche', 3, 'Leche'], ['espuma', 0.6, '']],
        p: 'Espresso, mucha leche y una capa fina de espuma.', sigue: 'El de moda' },
      { t: 'receta', tono: 'gris', ep: '5 · El de moda', h: 'Flat white', capas: [['cafe', 2, 'Doble'], ['leche', 2, 'Leche'], ['espuma', 0.35, '']],
        p: 'Espresso doble y leche cremosa, casi sin espuma.', sigue: '¿Y en casa?' },
      { t: 'texto', ep: 'Con la Magnifica S', h: 'Salen los cinco: <mark>un botón y el vaporizador</mark>.',
        p: 'El espresso sale solo; la leche la espumás vos, a tu gusto.', img: F + 'pedido-bar-tazas-2.jpg', sigue: 'Última' },
      { t: 'cta', tono: 'oscuro', ep: 'Guardalo para tu próximo café', h: '¿Cuál es el tuyo?',
        sub: 'Contestá en los comentarios. ¿Querés hacerlos en casa? Escribinos.', boton: 'Escribinos por WhatsApp',
        chica: `Magnifica S: ${fmt(P.transferencia(M))} por transferencia (${OFF}% OFF) o ${M.cuotas} cuotas sin interés en Mercado Libre. No se combinan.` }
    ]
  },
  {
    id: 'ene-mar-carrusel-mitos-del-cafe', semana: 0, dia: 'Martes', tipo: 'carrusel', fecha: '2027-01-12', estilo: 'pop',
    titulo: '5 cosas que creemos del café y no son así',
    caption:
      '5 cosas que creemos del café… y no son así. ☕🤔\n\n' +
      '1. "Se guarda en la heladera." Falso: mejor en un frasco hermético, lejos de la luz y del calor.\n' +
      '2. "Un espresso tiene más cafeína que un café de filtro." Falso, por taza: es más concentrado, pero es poquito.\n' +
      '3. "Más oscuro, más fuerte." Falso: el tostado cambia el sabor, no la cafeína.\n' +
      '4. "Se hace con agua hirviendo." Falso: unos 90 °C.\n' +
      '5. "Recién molido sabe mejor." Verdadero.\n\n' +
      'Guardalo para la próxima discusión de sobremesa.\n\n' +
      '¿Cuál creías? Contestá con el número 👇\n\n#mitosdelcafe #cafeencasa #espresso #delonghi',
    placas: [
      { t: 'tapa', ep: 'Verdadero o falso', h: '5 cosas que creemos del café <mark>y no son así</mark>.',
        sub: 'La 2 la discutimos en todas las sobremesas.', img: F + 'mitos-frasco.jpg', desliza: 'Empezá' },
      { t: 'mito', tono: 'gris', icono: 'frasco', mito: 'El café se guarda en la heladera.', h: 'Mejor en un frasco hermético.',
        p: 'La heladera le pasa humedad y olores. Guardalo lejos de la luz y del calor.', sigue: 'La de la cafeína' },
      { t: 'mito', mito: 'Un espresso tiene más cafeína que un café de filtro.', h: 'Por taza, tiene menos.',
        p: 'Es más concentrado, pero es poquito.', graf: 'cafeina', sigue: 'La del tostado' },
      { t: 'mito', tono: 'gris', icono: 'grano', mito: 'Más oscuro, más fuerte.', h: 'Más tostado no es más cafeína.',
        p: 'El tostado oscuro cambia el sabor, más amargo. No lo hace más fuerte.', sigue: 'La del agua' },
      { t: 'mito', mito: 'El café se hace con agua hirviendo.', h: 'Un poco menos: unos 90 °C.',
        p: 'El agua hirviendo quema el café y lo amarga.', graf: 'termometro', sigue: 'Una verdadera' },
      { t: 'mito', ok: true, tono: 'gris', mito: 'Recién molido sabe mejor.', h: 'Sí: el aroma se va al moler.',
        p: 'Por eso la Magnifica S muele el grano en cada taza.', img: F + 'magnifica-latte-cenital.jpg', sigue: 'Última' },
      { t: 'cta', tono: 'oscuro', ep: 'Guardalo para la próxima sobremesa', h: '¿Cuál creías?',
        sub: 'Contestá con el número. ¿Querés café recién molido en casa? Escribinos.', boton: 'Escribinos por WhatsApp',
        chica: `Magnifica S: ${fmt(P.transferencia(M))} por transferencia (${OFF}% OFF) o ${M.cuotas} cuotas sin interés en Mercado Libre. No se combinan.` }
    ]
  },
  {
    id: 'ene-jue-carrusel-cuidala', semana: 0, dia: 'Jueves', tipo: 'carrusel', fecha: '2027-01-14', estilo: 'pop',
    titulo: 'Cuidala 5 minutos y te dura años',
    caption:
      'Cuidá tu cafetera 5 minutos y te dura años. ☕🧽\n\n' +
      'Todos los días: vaciá el cajón de residuos y la bandeja.\n' +
      'Después de cada leche: purgá y limpiá el vaporizador.\n' +
      'Una vez por semana: enjuagá la unidad de infusión (en la Magnifica S se saca) o el portafiltro (en la Dedica).\n' +
      'Cuando la máquina lo pida: descalcificá, con el producto que indica el manual.\n\n' +
      'Guardalo y pegalo en la heladera.\n\n' +
      '¿Cada cuánto la limpiás? Sin mentir 👇 ¿Dudas con tu máquina? Escribinos por WhatsApp.\n\n#cafeencasa #delonghi #magnificas #tipsdecafe',
    placas: [
      { t: 'tapa', ep: 'Mantenimiento', h: 'Cuidala 5 minutos y <mark>te dura años</mark>.',
        sub: '4 hábitos: de todos los días a cuando ella te avise.', img: F + 'limpieza-magnifica.jpg', desliza: 'Hábito 1' },
      { t: 'error', tono: 'gris', icono: 'bandeja', n: 1, de: 4, h: 'Vaciá el cajón y la bandeja.', p: 'Todos los días. Los restos húmedos son lo primero que cambia el sabor.',
        titEvitar: 'Tip', evitar: 'Secalos bien antes de volver a ponerlos.', sigue: 'Para los de leche' },
      { t: 'error', icono: 'vapor', n: 2, de: 4, h: 'Purgá el vaporizador.', p: 'Después de cada leche: un chorrito de vapor y un paño húmedo.',
        titEvitar: 'Tip', evitar: 'Si lo hacés en el momento, la leche no se seca adentro.', sigue: 'Una vez por semana' },
      { t: 'error', tono: 'gris', icono: 'engranaje', n: 3, de: 4, h: 'Enjuagá la unidad de infusión.', p: 'Una vez por semana. En la Magnifica S se saca: agua tibia, sin detergente.',
        titEvitar: 'En la Dedica', evitar: 'Lavá el portafiltro y pasale un paño a la ducha.', sigue: 'Cuando te avise' },
      { t: 'error', icono: 'gota', n: 4, de: 4, h: 'Descalcificá.', p: 'Cuando la máquina lo pida. El sarro tapa los conductos y enfría el café.',
        titEvitar: 'Tip', evitar: 'Usá el descalcificante que indica el manual y cambiá seguido el agua del depósito.', sigue: 'La rutina' },
      { t: 'texto', tono: 'gris', ep: 'Para pegar en la heladera', h: 'Tu rutina', graf: 'rutina', sigue: 'Última' },
      { t: 'cta', tono: 'oscuro', ep: 'Guardalo y pegalo en la heladera', h: '¿Cada cuánto la limpiás?',
        sub: 'Sin mentir. ¿Dudas con tu máquina? Escribinos.', boton: 'Escribinos por WhatsApp' }
    ]
  },
  {
    id: 'ene-mar-carrusel-un-dia-con-la-magnifica', semana: 0, dia: 'Martes', tipo: 'carrusel', fecha: '2027-01-19', estilo: 'pop',
    titulo: 'Un día con la Magnifica S: 4 cafés, 0 filas',
    caption:
      'Un día con la Magnifica S: 4 cafés, 0 filas. ☕\n\n' +
      '7:30 · Espresso, antes de despertarte del todo.\n' +
      '11:00 · Cortado, entre reunión y reunión.\n' +
      '17:00 · Cappuccino de merienda.\n' +
      '22:00 · Uno corto, de sobremesa.\n\n' +
      `En el bar serían unos ${fmt(TIENDA.precioCafeAfuera * 4)} por día. En casa, con grano, unos ${fmt(costoCasa * 4)}.\n` +
      'Valores aproximados (precios al 26/10).\n\n' +
      `Magnifica S\n💸 ${fmt(P.transferencia(M))} por transferencia (${OFF}% OFF)\n💳 o ${M.cuotas} cuotas sin interés de ${fmt(P.cuota(M))} en Mercado Libre\n` +
      'No se combinan. Envío gratis a todo el país.\n\n' +
      '¿Cuántos cafés tomás por día? Escribinos por WhatsApp y te ayudamos a elegir 👇\n\n#cafeencasa #delonghi #magnificas #homeoffice',
    placas: [
      { t: 'tapa', ep: 'Un día con la Magnifica S', h: '4 cafés. <mark>0 filas.</mark>',
        sub: 'De las 7:30 a las 22, sin salir de casa.', img: F + 'espresso-magnifica.jpg', desliza: 'Arranca el día' },
      { t: 'foto', tono: 'gris', ep: '7:30', h: 'Espresso.', sub: 'Antes de despertarte del todo. Un botón.', img: F + 'pareja-magnifica.jpg', llena: true, sigue: '11:00' },
      { t: 'foto', ep: '11:00', h: 'Cortado.', sub: 'Entre reunión y reunión.', img: F + 'home-office-magnifica.jpg', llena: true, sigue: '17:00' },
      { t: 'foto', tono: 'gris', ep: '17:00', h: 'Cappuccino.', sub: 'De merienda, con la leche espumada por vos.', img: F + 'magnifica-latte-cenital.jpg', llena: true, sigue: '22:00' },
      { t: 'foto', ep: '22:00', h: 'Uno corto.', sub: 'De sobremesa, sin salir a buscarlo.', img: F + 'magnifica-sobremesa-noche.jpg', llena: true, sigue: 'Si fueran del bar' },
      { t: 'ticket', tono: 'oscuro', ep: 'Si los 4 fueran del bar…', h: 'El ticket del día', titulo: 'BAR DE LA ESQUINA',
        lineas: [['Espresso', fmt(TIENDA.precioCafeAfuera)], ['Cortado', fmt(TIENDA.precioCafeAfuera)], ['Cappuccino', fmt(TIENDA.precioCafeAfuera)], ['Uno corto', fmt(TIENDA.precioCafeAfuera)]],
        total: ['TOTAL', fmt(TIENDA.precioCafeAfuera * 4)],
        chica: `En casa, con grano, los mismos 4: unos ${fmt(costoCasa * 4)}. Valores aproximados (precios al 26/10).`, sigue: 'Cuánto sale' },
      { t: 'lista', tono: 'gris', ep: 'La que hace los 4', h: 'Magnifica S',
        items: [[`${fmt(P.transferencia(M))} por transferencia`, `Con ${OFF}% OFF, pagando por transferencia o efectivo.`],
                [`o ${M.cuotas} cuotas sin interés de ${fmt(P.cuota(M))}`, 'En Mercado Libre. No se combina con el descuento.']],
        chica: 'Envío gratis a todo el país.', sigue: 'Última' },
      { t: 'cta', tono: 'oscuro', ep: 'Contanos', h: '¿Cuántos cafés tomás por día?',
        sub: 'Escribinos y te decimos si la Magnifica S va con tu ritmo.', boton: 'Escribinos por WhatsApp' }
    ]
  }
];

/* Para generar.ps1 (corre con Node): lista "id n ancho alto" */
if (typeof module !== 'undefined') module.exports = PIEZAS;
