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

const OFF = TIENDA.descuentoTransferencia * 100;
const cm  = n => String(n).replace('.', ',') + ' cm';
const pagoCorto = p => `${OFF}% OFF por transferencia · ${p.cuotas} cuotas sin interés`;
const precios = p =>
  `💸 ${fmt(P.transferencia(p))} por transferencia (${OFF}% OFF)\n` +
  `💳 o ${p.cuotas} cuotas sin interés de ${fmt(P.cuota(p))} en Mercado Libre\n` +
  `📦 Envío gratis a todo el país · ${TIENDA.garantiaMeses} meses de garantía oficial`;
const pagoCta = p => `${OFF}% OFF por transferencia<br>o ${p.cuotas} cuotas sin interés`;
const lema = p => p.tagline.replace('. ', '.<br>');
const CIERRE = 'Escribinos por WhatsApp desde el link de la bio.';

/* La cuenta del café (mismos números que la calculadora del sitio) */
const costoCasa   = TIENDA.precioKiloCafe / TIENDA.cafesPorKilo;
const CAFES_DIA   = 2;
const mesAfuera   = TIENDA.precioCafeAfuera * CAFES_DIA * 30;
const mesCasa     = costoCasa * CAFES_DIA * 30;
const mesesAmort  = Math.ceil(P.transferencia(M) / (mesAfuera - mesCasa));

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
    titulo: 'Tres cafeteras. Una es la tuya.',
    caption:
      'Tres cafeteras. Una es la tuya. ☕\n\n' +
      `Magnifica S: muele el grano en el momento y hace todo con un botón.\n` +
      `Krups Roma: la superautomática más accesible, y entra en mesadas justas.\n` +
      `Dedica: 15 cm de ancho para los que disfrutan preparar el espresso a mano.\n\n` +
      `Las tres con ${OFF}% OFF por transferencia o cuotas sin interés, envío gratis y ${TIENDA.garantiaMeses} meses de garantía oficial.\n\n` +
      '¿No sabés cuál? Hacé el test de 4 preguntas desde el link de la bio.\n\n' +
      '#cafeencasa #cafetera #espresso #delonghi #krups',
    placas: [
      { t: 'portada', ep: 'Elegí la tuya', h: 'Tres cafeteras. Una es la tuya.', sub: 'Te las presentamos en un minuto.' },
      { t: 'foto', tono: 'gris', ep: M.etiqueta, h: M.modelo, sub: lema(M), img: M.imgs[0] },
      { t: 'foto', tono: 'gris', ep: K.etiqueta, h: K.modelo, sub: lema(K), img: K.imgs[0] },
      { t: 'foto', tono: 'gris', ep: D.etiqueta, h: D.modelo, sub: lema(D), img: D.imgs[0] },
      { t: 'trio', h: '¿Para quién es cada una?',
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
      CIERRE,
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
      precios(M) + '\n\n' + CIERRE + '\n\n#cafeencasa #cafetera #delonghi #magnificas #espresso',
    placas: [
      { t: 'portada', tono: 'oscuro', ep: M.modelo, h: 'Del grano a la taza.', sub: 'Con un botón.' },
      { t: 'foto', tono: 'gris', ep: 'Paso 1', h: 'Cargás el grano', sub: 'Lo muele en el momento, en cada taza.', img: M.imgs[0] },
      { t: 'foto', tono: 'gris', ep: 'Paso 2', h: 'Apretás un botón', sub: 'Sin menús ni pantallas.', img: M.imgs[3] },
      { t: 'foto', tono: 'gris', ep: 'Paso 3', h: 'Sale el espresso', sub: 'Simple o doble.', img: M.imgs[1] },
      { t: 'foto', tono: 'gris', ep: 'Paso 4', h: 'Espumás la leche', sub: 'Para cappuccino y latte.', img: M.imgs[2] },
      { t: 'cta', tono: 'oscuro', ep: P.nombre(M), h: 'Café de cafetería, en tu casa.', sub: pagoCta(M), boton: 'Link en la bio' }
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
      precios(M) + '\n\n' + CIERRE + '\n\n#delonghi #magnificas #cafeencasa #cafetera #cafeengrano',
    placas: [
      { t: 'portada', ep: M.etiqueta, h: M.modelo, sub: lema(M), img: M.imgs[0] },
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
      'Los valores son aproximados: en el sitio tenés la calculadora para poner tus números. Link en la bio.\n\n#cafeencasa #cafetera #ahorro',
    placas: [
      { t: 'portada', tono: 'oscuro', ep: 'Hacé la cuenta', h: '¿Cuánto gastás en café por mes?', sub: `Con ${CAFES_DIA} cafés por día.` },
      { t: 'dato', tono: 'gris', ep: 'En un bar', num: fmt(TIENDA.precioCafeAfuera), sub: 'cada café, aproximadamente' },
      { t: 'dato', tono: 'gris', ep: 'En tu casa, con grano', num: fmt(costoCasa), sub: 'cada café, aproximadamente' },
      { t: 'barras', ep: 'Por mes', h: `${CAFES_DIA} cafés por día`,
        items: [['Afuera', fmt(mesAfuera), mesAfuera, true], ['En casa', fmt(mesCasa), mesCasa]] },
      { t: 'dato', tono: 'oscuro', ep: `${M.modelo} por transferencia`, num: mesesAmort, unidad: 'meses', sub: 'y se pagó sola.', p: 'Calculá tu caso en el sitio · link en la bio' }
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
      `Tenemos las dos: ${M.modelo} y ${K.modelo} (superautomáticas) y ${D.modelo} (manual).\n\n` +
      '¿Dudás? El test de 4 preguntas está en el link de la bio.\n\n#cafeencasa #espresso #cafetera #barista',
    placas: [
      { t: 'portada', ep: 'Guía rápida', h: '¿Superautomática o espresso manual?', sub: 'Dos formas distintas de tomar café.' },
      { t: 'dos', tono: 'gris', h: 'La diferencia',
        cols: [
          { ep: 'Superautomática', h: 'Apretás un botón', items: ['Muele el grano sola', 'Siempre sale igual', 'Varios cafés seguidos'] },
          { ep: 'Espresso manual', h: 'Lo preparás vos', items: ['Usás café molido', 'Vos manejás el resultado', 'Ocupa muy poco lugar'] }
        ] },
      { t: 'lista', ep: 'Superautomática', h: 'Es para vos si…',
        items: [['Tomás varios cafés por día', ''], ['Querés el café listo en un minuto', ''], ['En tu casa toman varios', '']] },
      { t: 'lista', ep: 'Espresso manual', h: 'Es para vos si…',
        items: [['Disfrutás el ritual de prepararlo', ''], ['Tenés poco lugar en la mesada', ''], ['Tomás uno o dos cafés por día', '']] },
      { t: 'trio', tono: 'gris', h: 'Tenemos las dos', linea: p => p.tipo },
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
      PRODUCTOS.map(p => `${p.modelo}: ${cm(p.medidas.ancho)} de ancho`).join('\n') + '\n\n' +
      'El ancho es lo que más devoluciones evita. Las medidas completas están en cada ficha del sitio. Link en la bio.\n\n#cafeencasa #cafetera #cocina',
    placas: [
      { t: 'portada', tono: 'oscuro', ep: 'Antes de comprar', h: '¿Entra en tu mesada?', sub: 'Medí el ancho libre que tenés.' },
      { t: 'barras', ep: 'Ancho de cada una', h: 'Las tres, lado a lado',
        items: PRODUCTOS.map(p => [p.modelo, cm(p.medidas.ancho), p.medidas.ancho]) },
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
      '¿Son originales? Sí: nuevas, selladas de fábrica y con garantía oficial.\n' +
      '¿Envían a todo el país? Sí, gratis y con seguimiento.\n' +
      '¿Cuánto tarda? 24 a 72 h en AMBA y hasta 5 días hábiles en el interior.\n' +
      '¿Puedo devolverla? Tenés 30 días, sin costo.\n\n' +
      '¿Te quedó otra duda? ' + CIERRE,
    placas: [
      { t: 'portada', ep: 'Preguntas frecuentes', h: 'Lo que siempre nos preguntan.', sub: 'Respondido en cinco placas.' },
      { t: 'texto', tono: 'gris', ep: '¿Son originales?', h: 'Nuevas y selladas de fábrica.', p: `Con ${TIENDA.garantiaMeses} meses de garantía oficial del fabricante y servicio técnico en el país.` },
      { t: 'texto', ep: '¿Envían a todo el país?', h: 'Sí, y el envío es gratis.', p: 'Despachamos por Mercado Envíos y te pasamos el número de seguimiento.' },
      { t: 'texto', tono: 'gris', ep: '¿Cuánto tarda?', h: '24 a 72 h en AMBA.', p: 'Hasta 5 días hábiles en el interior. Sale el mismo día si el pago se acredita antes de las 15 h.' },
      { t: 'texto', ep: '¿Y si no me convence?', h: '30 días para devolverla.', p: 'Sin costo, siempre que esté en las mismas condiciones en las que llegó.' },
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
  }
];

/* Para generar.ps1 (corre con Node): lista "id n ancho alto" */
if (typeof module !== 'undefined') module.exports = PIEZAS;
