/* ============================================================
   CAFÉ EN TU CASA — Datos de producto
   ------------------------------------------------------------
   ESTE ES EL ÚNICO ARCHIVO QUE TENÉS QUE TOCAR PARA:
     · cambiar precios            -> precioLista / precioML
     · cambiar cuotas             -> cuotas
     · cambiar el % transferencia -> TIENDA.descuentoTransferencia
     · cambiar links de ML        -> linkML
     · marcar sin stock           -> stock: false
   Todo lo demás (valor de cuota, precio con descuento, ahorro,
   porcentaje OFF) se calcula solo.
   ============================================================ */

const TIENDA = {
  nombre: 'Café en tu Casa',
  whatsapp: '5491136567560',          // sin +, sin espacios ni guiones
  whatsappVisible: '+54 11 3656-7560',
  email: 'stokedstay@gmail.com',
  descuentoTransferencia: 0.20,       // 20% OFF
  garantiaMeses: 12,

  // Para la calculadora de amortizacion. Actualizalos cuando cambien.
  precioCafeAfuera: 3500,   // lo que sale un cafe en un bar, en pesos
  precioKiloCafe: 18000,    // lo que te sale 1 kg de cafe en grano
  cafesPorKilo: 130,        // tazas que salen de 1 kg (aprox 7,5 g por taza)

  url: 'https://cafe-en-tu-casa.vercel.app'
};

const PRODUCTOS = [
  {
    id: 'magnifica-s',
    marca: "De'Longhi",
    modelo: 'Magnifica S',
    sku: 'ECAM11112B',
    tipo: 'Superautomática',
    etiqueta: 'Más vendida',
    tagline: 'Café en grano, recién molido, con un botón.',
    resumen: 'La compañera perfecta para llevar la experiencia del barista a tu casa. Diseñada en Italia, extrae el máximo aroma del grano apretando un solo botón.',
    precioLista: 1500000,
    precioML:    1500000,
    cuotas: 9,
    stock: true,
    color: 'Negro',
    medidas: { ancho: 24, profundidad: 44, alto: 36 },
    linkML: 'https://www.mercadolibre.com.ar/cafetera-delonghi-ecam11112b-magnifica-s-super-auto/up/MLAU3558782080?pdp_filters=item_id:MLA2561979252',
    imgs: [
      'assets/img/magnifica-s-1.webp',   // frente
      'assets/img/magnifica-s-2.webp',   // sirviendo cafe
      'assets/img/magnifica-s-3.webp',   // espumador de leche
      'assets/img/magnifica-s-4.webp',   // panel de control
      'assets/img/magnifica-s.webp'      // foto oficial De'Longhi (borrala si no te gusta)
    ],
    highlights: [
      'Muele el grano en el momento, en cada taza',
      'Molinillo cónico de acero con 13 niveles de molienda',
      'Espumador manual para cappuccino y latte',
      'Acepta grano entero o café pre-molido'
    ],
    specs: [
      ['Tipo de cafetera', 'Superautomática con molinillo integrado'],
      ['Presión', '15 bares'],
      ['Potencia', '1450 W'],
      ['Molinillo', 'Cónico de acero, 13 niveles de molienda'],
      ['Medidas (an x prof x alto)', '24 x 44 x 36 cm'],
      ['Depósito de agua', '1,8 L extraíble'],
      ['Contenedor de granos', '250 g'],
      ['Café admitido', 'Grano entero y pre-molido'],
      ['Sistema de leche', 'Cappuccino System manual (vaporizador)'],
      ['Calentamiento', 'Thermoblock'],
      ['Panel', 'Analógico, control por diales'],
      ['Surtidor', 'Altura regulable'],
      ['Tensión', '220 V']
    ],
    descripcion: 'La Magnifica S es la superautomática más vendida de De’Longhi y la puerta de entrada natural al café de especialidad en casa. El molinillo cónico de acero muele el grano justo antes de cada extracción, así que el aroma no se pierde esperando en un paquete abierto. Con el dial regulás el grosor de molienda entre 13 posiciones y ajustás el cuerpo de la taza a tu gusto.\n\nEl panel es 100% analógico: sin menús ni pantallas. Apretás el botón de la taza que querés y listo. El vaporizador manual te deja texturizar la leche como en una cafetería, para cappuccinos y flat whites con espuma real.\n\nSi alguna vez querés usar café ya molido, tiene una boca aparte para hacerlo sin vaciar el contenedor de granos.'
  },
  {
    id: 'krups-roma',
    marca: 'Krups',
    modelo: 'Roma EA8105',
    sku: 'EA8105',
    tipo: 'Superautomática',
    etiqueta: 'Mejor precio',
    tagline: 'Superautomática, compacta, sin vueltas.',
    resumen: 'Elegancia compacta y rendimiento superior, diseñada en Francia para los que buscan un espresso intenso y equilibrado todos los días.',
    precioLista: 1150000,
    precioML:    1150000,
    cuotas: 6,
    stock: true,
    color: 'Negro',
    medidas: { ancho: 24.5, profundidad: 36.5, alto: 33 },
    linkML: 'https://www.mercadolibre.com.ar/cafetera-krups-roma-ea8105-full-auto-negra-220v/up/MLAU3507170292',
    imgs: ['assets/img/krups-roma.webp'],
    highlights: [
      'La superautomática más accesible del catálogo',
      '3 niveles de molienda regulables',
      'Thermoblock compacto: lista desde la primera taza',
      'Vaporizador lateral para espumar leche'
    ],
    specs: [
      ['Tipo de cafetera', 'Superautomática con molinillo integrado'],
      ['Presión', '15 bares'],
      ['Potencia', '1450 W'],
      ['Molinillo', 'Cónico, 3 niveles de molienda'],
      ['Medidas (an x prof x alto)', '24,5 x 36,5 x 33 cm'],
      ['Depósito de agua', '1,7 L'],
      ['Café admitido', 'Grano entero'],
      ['Sistema de leche', 'Boquilla de vapor lateral orientable'],
      ['Calentamiento', 'Thermoblock compacto'],
      ['Ajustes', 'Volumen de taza (20 a 220 ml) y temperatura'],
      ['Extras', 'Calientatazas superior'],
      ['Tensión', '220 V']
    ],
    descripcion: 'La Krups Roma EA8105 es la forma más directa de pasar del café instantáneo al espresso de grano sin resignar espacio en la mesada. Es una superautomática completa: cargás granos, apretás un botón y la máquina muele, compacta y extrae sola.\n\nEl sistema Thermoblock compacto calienta el agua al instante, así que no hay que esperar a que levante temperatura: la primera taza sale igual de bien que la quinta. Con el selector regulás el volumen en tazas de 20 a 220 ml.\n\nLa boquilla de vapor lateral gira y te permite espumar leche directamente en la jarra para cappuccinos, y la bandeja superior mantiene las tazas tibias para que el café no se enfríe al servirlo.'
  },
  {
    id: 'dedica',
    marca: "De'Longhi",
    modelo: 'Dedica EC685',
    sku: 'EC685',
    tipo: 'Espresso manual',
    etiqueta: 'Ultracompacta',
    tagline: 'Solo 15 cm de ancho. Todo el ritual.',
    resumen: 'El estándar en diseño ultracompacto para quienes disfrutan el ritual manual del café de especialidad.',
    precioLista: 730000,
    precioML:    730000,
    cuotas: 9,
    stock: true,
    color: 'Acero inoxidable',
    medidas: { ancho: 14.9, profundidad: 33, alto: 30.4 },
    linkML: 'https://www.mercadolibre.com.ar/cafetera-express-delonghi-dedica-ec-685-acero-15-bares-color-metal/p/MLA69097041',
    imgs: ['assets/img/dedica.webp'],
    highlights: [
      'Solo 15 cm de ancho: entra en cualquier mesada',
      'Chasis íntegro de acero inoxidable',
      'Lista en unos 40 segundos gracias al Thermoblock',
      'Portafiltro profesional y Cappuccino System regulable'
    ],
    specs: [
      ['Tipo de cafetera', 'Espresso manual con portafiltro'],
      ['Presión', '15 bares'],
      ['Medidas (an x prof x alto)', '14,9 x 33 x 30,4 cm'],
      ['Material', 'Acero inoxidable'],
      ['Depósito de agua', '1,1 L extraíble'],
      ['Café admitido', 'Molido y cápsulas E.S.E.'],
      ['Filtros', 'Presurizados de 1 y 2 tazas'],
      ['Sistema de leche', 'Cappuccino System regulable'],
      ['Calentamiento', 'Thermoblock (listo en ~40 s)'],
      ['Programación', '3 botones: espresso, doble y vapor'],
      ['Tensión', '220 V']
    ],
    descripcion: 'La Dedica EC685 es para el que disfruta el proceso: dosificar, tampear, colocar el portafiltro y ver caer el espresso. Con 15 cm de ancho es una de las espresso más finas del mercado, y el chasis completo de acero inoxidable la hace ver mucho más cara de lo que es.\n\nEl Thermoblock la deja lista en unos 40 segundos, sin la espera larga de las máquinas con caldera. Los tres botones frontales manejan espresso simple, doble y vapor, y las dos primeras se pueden reprogramar al volumen exacto que te guste.\n\nEl Cappuccino System se regula entre leche caliente y cappuccino, así que podés hacer microespuma para cortados y lattes sin técnica de barista. Acepta café molido y también cápsulas E.S.E. si querés la vía rápida.'
  }
];

/* ---------- Helpers de precio (no hace falta tocar) ---------- */
const P = {
  transferencia: p => Math.round(p.precioML * (1 - TIENDA.descuentoTransferencia)),
  ahorro:        p => p.precioML - P.transferencia(p),
  cuota:         p => Math.round(p.precioML / p.cuotas),
  tieneOferta:   p => p.precioLista > p.precioML,
  offPct:        p => Math.round((1 - p.precioML / p.precioLista) * 100),
  nombre:        p => `${p.marca} ${p.modelo}`,
  url:           p => `${p.id}.html`
};

const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');

const waLink = texto => `https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent(texto)}`;

const waProducto = p => waLink(
  `Hola! Quiero comprar la ${P.nombre(p)} por transferencia con el ` +
  `${TIENDA.descuentoTransferencia * 100}% OFF (${fmt(P.transferencia(p))}). ¿Me pasás los datos?`
);

const getProducto = id => PRODUCTOS.find(p => p.id === id);
