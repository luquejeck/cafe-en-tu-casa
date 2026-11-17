# Aprendizajes de Instagram — Café en tu Casa

Reglas que salen de los datos de @cafentucasa. Las lee el reporte semanal y las aplica
el Claude que diseña y programa el contenido. Cada regla dice de dónde sale y qué tan
firme es. Cuando un dato nuevo la contradice, se corrige acá.

Firmeza: **señal** (1–2 piezas) · **probado** (3+ piezas o 3+ semanas) · **regla** (se cumple siempre).

## Reels

| Regla | Por qué | Firmeza |
|---|---|---|
| El gancho va en el primer segundo y, si se puede, con un **número concreto** en pantalla ("$240.000 por mes"). Nunca el nombre del modelo solo. | Semana 19-25/10: el reel "Hacé la cuenta" ($210.000 vs $8.308) fue el único que pasó los 10 s de tiempo medio (10,7 s); el resto, 3,3 a 4,7 s. | probado |
| El dato que vende (precio, 20% OFF, beneficio) aparece antes del segundo 6. | Se miran 3 a 5 s: lo que va después del seg. 6 casi nadie lo ve. Reel Día de la Madre (16/10): 103 cuentas, 3,2 s. | probado |
| Duración objetivo: **9 s** (el reporte del 16/11 pide 7 a 9; la regla fija de la rutina es 9 a 12: 9 s cumple las dos). Antes 14 a 25. | 6+ reels medidos entre 98 y 177 vistas, todos abandonados antes de la mitad. Prueba de cápsulas (5/11, mismo tema): 7,7 s → 205 vistas; 13,1 s → 137; 18,5 s → 123. | probado (7 a 9 s: señal) |
| Reels de lista o información ("¿Entra en tu mesada?", "4 preguntas", "Pagaste") mueren a los 3 s: 63 a 83 vistas. Lo que retiene son historias con plata o conflicto ("Dos vecinos", 1.227) y el "por dentro" de la máquina (1.310). Para Navidad, como mucho un reel de lista o información por semana. | Semanas 2-15/11. | probado |
| Cierre en pantalla en el último segundo (no solo en el texto) y pedir compartir: "Mandáselo a …" + una pregunta fácil (A o B). | Guardados y compartidos en CERO dos semanas seguidas (12-25/10) con "Guardalo". | probado |
| Los reels con **historia y voz** (personajes, un conflicto con números) retienen mucho más que los de producto: ir por ahí. Arrancar con el conflicto en movimiento, no con un plano quieto. | "Dos vecinos" (plano, voz de Valeria, 31 s, 27-28/10): pierde 30 % en el primer segundo y queda en 47 % a los 5 s, pero después baja muy poco: 42 % a los 9 s, 33 % a los 19 s, 27 % a los 27 s. El 88 % de las vistas vino de la pestaña Reels (gente que no sigue la cuenta). La caída final es en el cierre "Comentá CAFÉ". | prueba |
| Los reels llevan música de fondo: lo-fi de `instagram/musica.py` (sin derechos), alternando los temas mañana, tarde y sobremesa. `filmar.mjs` la agrega sola. | Pedido de Lucas, 23/10: sin sonido son aburridos. El catálogo de Instagram vía Metricool da error. | regla |
| Sin montos en videos, salvo el reel de "la cuenta", que lleva los números en pantalla con fecha ("precios del sitio al 27/10") y "valores aproximados". | Los videos quedan viejos; la cuenta es el gancho que funciona. | regla |

## Carruseles

| Regla | Por qué | Firmeza |
|---|---|---|
| Carrusel de **dudas reales** > carrusel de producto con precio: FAQ "Lo que siempre nos preguntan" (11/11) 213 vistas contra "Dos cafés, un botón" (13/11) 87. Promedio 3 al 13/11 (3 piezas cada uno): carrusel 159 · foto Flow 97 · reel programado 73. | Reporte del 16/11. | probado |
| Priorizar carruseles con precios y comparativas: son lo que más alcanza. Precio en la primera placa. | Día de la Madre (13/10): 430 vistas. Semana 19-25/10: "Las 3 cafeteras, lado a lado" 249 vistas, "Dos cafeteras" 182; todos los reels 68-73. | probado |
| Fotos de ambiente (Google Flow) intercaladas con carruseles y reels, nunca dos del mismo tipo seguidas; marcadas como IA en Metricool y con precio cuando venden un modelo. | Pedido de Lucas, 23/10. | regla |
| Todo post con precio dice cómo pagar: transferencia o efectivo 20% OFF, o cuotas sin interés en Mercado Libre. No se combinan. | Para que nadie espere las dos cosas juntas. | regla |
| Solo modelos con stock. Hoy la Krups Roma está sin stock: no aparece en piezas nuevas (las piezas toman `DISP` en contenido.js). | Pedido de Lucas, 14/10. | regla |
| No decir "garantía oficial", "sellada de fábrica" ni "30 días para devolverla". Solo las políticas de Mercado Libre. | Pedido de Lucas, 14/10: no es así. | regla |

## Textos

| Regla | Por qué | Firmeza |
|---|---|---|
| Terminar con una pregunta fácil de contestar ("¿Vos sos de cortado o de latte?"). | 0 comentarios en la primera pieza. | señal |
| **No usar "Guardalo para comparar".** Cerrar con "Mandáselo a …" o "Guardalo: es/son …" con un motivo concreto. | 0 guardados en todas las piezas, 2 semanas seguidas (2-15/11), con "Guardalo para comparar". | regla (16/11) |
| No repetir el mismo tema dos días seguidos (ej. "transferencia o cuotas" + "dos formas de pagar"). | Calendario de octubre. | regla |
| Contenido de "cómo se compra" (pagos, envíos, pasos): como mucho 1 por semana. Los tips de café sirven más para guardar y compartir. | Hay 5 piezas de "cómo se compra" en 3 semanas. | señal |

## Horarios

| Regla | Por qué | Firmeza |
|---|---|---|
| Fotos y carruseles a las **10:00**, de lunes a viernes. | Mejor horario de Metricool: pico a las 10 todos los días hábiles. Test 10:00 contra 18:00 (3 al 13/11): fotos 102 vs 94,5; ninguna diferencia pasa el 30 %. | probado |
| **Reels a las 18:00** (prueba del 17/11 al 4/12, mínimo 3 reels de historia o con números). Se compara contra la mediana de los reels de la mañana (**112 vistas**), anotando las vistas a las 72 h. Si pasa el 30 % (146+), queda como regla; si no, vuelven a las 10:00. Primer reel de la prueba: Black Friday, lun 23/11 a las 18:00. | Revisión del 17/11 (7/10 al 16/11): mediana de reels de 16 a 22 h = 180 vistas (9 reels) contra 112 de 9 a 10 h (10 reels). Los cuatro mejores (1.330, 1.231, 205, 191) salieron de tarde o de noche. "Dos vecinos" el 27/10: 130 a las 9:00 y 1.231 a las 17:06 (puede ser otra versión del video). Confundido con el contenido: los reels de lista a las 18:00 murieron igual (66 y 83). | prueba |
| Lo que más pesa no es la hora sino el tipo de pieza: los carruseles a las 10:00 bajaron de ~286 vistas (octubre) a ~195 (noviembre) en el mismo horario, y cada pieza llega a 40–60 de los 813 seguidores. | Revisión del 17/11. | señal |
| Prueba de 21:00 con una pieza: foto "Tu rincón, tu ritual" (mié 25/11). El 23/11 se revisan la foto del 19 y el reel del 17; solo se cambia el horario si una diferencia pasa el 30 %. Metricool da acumulados, no el valor a las 72 h. | Reporte del 16/11. | prueba |
| Sábado y domingo: solo historias (la del domingo, solo si hay algo para preguntar). | La audiencia activa del finde es la mitad. | probado |
| Las historias salen solas desde Metricool. Si llevan sticker (encuesta, preguntas, cuenta regresiva), se programan con aviso al celular, nunca en borrador. | Semanas 12-18 y 19-25/10: las historias en borrador no salieron; la semana 19-25 no salió ninguna. | regla |
| Contar los créditos de Metricool antes de programar (20 por mes). | 26/10: el reel de las 10:00 figuró con error "límite de la cuenta" en Metricool. | regla |
| Una pieza de feed por día, como máximo. | Que no compitan entre sí. | regla |

## Estrategia de diciembre (definida con Lucas el 17/11)

| Decisión | Elección |
|---|---|
| Objetivo | Alcance nuevo (gente que no nos sigue). |
| Público | El que se la compra para sí ("Este año, el regalo es para vos"). |
| Producto foco | Magnifica S (la Dedica acompaña). |
| Tono | Mixto: humor en el gancho y el cierre, datos sobrios en el medio. |
| Estética | **La de la marca, siempre**: blanco, gris claro, negro y un solo acento oliva. Se probó una paleta de colores de café y se descartó. |
| Mecánicas | Contador 3/7, frase al pie que invita a seguir, quiz con la respuesta en la placa siguiente, chat y ticket. |
| Precio | Solo al final del carrusel (penúltima o última placa). |
| Cierre | "Escribinos por WhatsApp" + una pregunta fácil (reemplaza a "Mandáselo a …" en los carruseles de diciembre). |
| Imágenes | Fotos de producto + escenas de Google Flow con nuestras cafeteras como referencia (marcar IA en Metricool). |
| Fotos ya programadas | Se dejan y los 5 carruseles se suman (17 de 20 créditos con Reyes). |

## Audiencia

- 56% hombres, 28% mujeres. 76% tiene entre 25 y 54 años; el grupo más grande es hombres de 45–54.
- 39% en CABA; después Mar del Plata, Córdoba y Rosario.
- En fechas de regalo (Día de la Madre, Día del Padre, Navidad) hay que hablarle al que compra el regalo.

## Precios para "la cuenta" (relevamiento 26/10/2026)

- Café en un bar: $3.000 a $5.400 (cortado / café con leche). Usamos **$4.000**.
- Kilo de café en grano: comercial ~$23.000 (La Virginia molido); especialidad $40.000 a $60.000 (Bonafide ~$56.600, tostadores $49.000-59.000; Lavazza grano $75.400). Usamos **$60.000** (Lucas: entre $40.000 y $80.000) y 130 tazas por kilo.
- Con esos valores: 2 cafés por día afuera = $240.000/mes; en casa ≈ $27.692/mes. Dedica se paga en ~3 meses; Magnifica S en ~6. Los valores viven en `assets/js/productos.js` (TIENDA) y los usa también la calculadora del sitio.

## Fechas que vienen

- **Día de la Madre: domingo 18/10/2026.** Piezas de regalo del lunes 12 al viernes 16.
- **CyberMonday: lunes 2 al miércoles 4/11/2026** (CACE; iProUP, Universal Assistance y Turismocity coinciden). Cyber Week hasta el 8/11.
- **Black Friday: viernes 27/11.** Pedir la propuesta el lunes 9/11 (dos semanas antes). No anunciar descuentos distintos al 20% por transferencia.
- Las fechas de entrega se confirman con Lucas; no se prometen en las piezas.
- Diciembre: Navidad y Reyes.

## Créditos de Metricool

- 20 por mes, historias incluidas; se gastan al publicarse. Borradores y errores no cuentan. Cambiar texto, video u hora de algo ya programado no gasta.
- Noviembre 2026: 20 de 20 (14 publicadas + 6 pendientes: 16, 17, 19, 23, 25 y 27). Las historias del finde de Black Friday se suben desde la app.
- Diciembre 2026 (al 16/11): 9 programadas (1, 2, 7, 9, 11, 15, 18, 21 y 29/12), 11 libres. Reservar 2 para Reyes; el resto para Navidad.

---
Última actualización: 16/11/2026 (semana 9-15/11: 1.080 vistas, 531 alcanzadas, 24 interacciones, 813 seguidores; 0 guardados y compartidos). Anterior: 26/10/2026 (semana 19-25/10: 1.033 vistas, 435 alcanzadas, 28 interacciones, 812 seguidores; 0 guardados y compartidos por segunda semana).
