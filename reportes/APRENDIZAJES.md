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
| Reels de lista o información ("¿Entra en tu mesada?", "4 preguntas", "Pagaste") mueren a los 3 s: 63 a 83 vistas. Lo que retiene son historias con plata o conflicto ("Dos vecinos", 1.227) y el "por dentro" de la máquina (1.310). **Desde el 21/11 no se hacen reels de lista o información: esa info va a carrusel e historias destacadas.** | Semanas 2-15/11. Diagnóstico 21/11 (Windsor): "Pagaste", "¿Entra en tu mesada?" y "4 preguntas" tienen 83 a 93 % de salteo en los primeros 3 s y menos de 4 s vistos. | regla (21/11) |
| Cierre en pantalla en el último segundo (no solo en el texto) y pedir compartir: "Mandáselo a …" + una pregunta fácil (A o B). | Guardados y compartidos en CERO dos semanas seguidas (12-25/10) con "Guardalo". | probado |
| Los reels con **historia y voz** (personajes, un conflicto con números) retienen mucho más que los de producto: ir por ahí. Arrancar con el conflicto en movimiento, no con un plano quieto. | "Dos vecinos" (plano, voz de Valeria, 31 s, 27-28/10): pierde 30 % en el primer segundo y queda en 47 % a los 5 s, pero después baja muy poco: 42 % a los 9 s, 33 % a los 19 s, 27 % a los 27 s. El 88 % de las vistas vino de la pestaña Reels (gente que no sigue la cuenta). La caída final es en el cierre "Comentá CAFÉ". | prueba |
| Los reels llevan música de fondo: lo-fi de `instagram/musica.py` (sin derechos), alternando los temas mañana, tarde y sobremesa. `filmar.mjs` la agrega sola. | Pedido de Lucas, 23/10: sin sonido son aburridos. El catálogo de Instagram vía Metricool da error. | regla |
| Sin montos en videos, salvo el reel de "la cuenta", que lleva los números en pantalla con fecha ("precios del sitio al 27/10") y "valores aproximados". | Los videos quedan viejos; la cuenta es el gancho que funciona. | regla |
| **Zona segura de los reels (1080×1920):** nada de texto ni dato en los 250 px de arriba (usuario) ni en los 350 px de abajo (texto y botones); a la derecha, nada más allá de x = 940 desde y = 1000 (columna de me gusta, comentar, compartir). Márgenes laterales de 150 px y el logo a 285 px del borde. | Reel de las cápsulas (19/11): "espera meses" se salía del cuadro y la grilla quedaba debajo de los botones. Se controla con un script que mide cada escena. | regla |
| **Prueba de duración (19/11):** reel de las cápsulas en 9 s contra 20 s con quiz, re-gancho a mitad y final que empalma con el principio (`instagram/reel-capsulas-kilo/`). Mismo texto y horario; se mide a las 72 h. Gana la de 20 s si duplica el tiempo medio sin perder más del 30 % a los 3 s. | Pedido de Lucas, 19/11. La skill `reels-script` pone el punto justo entre 15 y 35 s; nuestros datos dicen 9 s. | prueba |
| **Una sola versión por idea.** Nunca varias versiones del mismo reel el mismo día: compiten entre sí. | 5/11: 4 reels de cápsulas el mismo día sumaron 552 de alcance y 4 interacciones; dos quedaron en 0. | probado (21/11) |
| Las vistas solas no alcanzan: cada reel se mide también por **salteo a los 3 s** y **tiempo medio**. Un gancho que trae gente pero la pierde no suma. | "El grano que habla" (29/10): 1.269 de alcance, 89 % de salteo, 8 interacciones. "Dos vecinos": 1.076, 48 % de salteo, 12 s, 33 interacciones. | señal |
| Nada de tendencias que no tengan que ver con el café o la máquina. | "Italianos" (17/11): 552 de alcance, 1,7 s vistos, 0 me gusta. Una sola pieza. | señal |
| El ASMR de la máquina por dentro funciona: es el formato con más compartidos. | "Así funciona por dentro" (26/10, ASMR) y "Qué pasa adentro" (29/10): 2 compartidos cada uno, el máximo del mes. | señal |

## Carruseles

| Regla | Por qué | Firmeza |
|---|---|---|
| Carrusel de **dudas reales** > carrusel de producto con precio: FAQ "Lo que siempre nos preguntan" (11/11) 213 vistas contra "Dos cafés, un botón" (13/11) 87. Promedio 3 al 13/11 (3 piezas cada uno): carrusel 159 · foto Flow 97 · reel programado 73. | Reporte del 16/11. | probado |
| Priorizar carruseles con precios y comparativas para **los que ya nos siguen**: son lo que más vistas suma por cuenta (3 a 4 vistas por cuenta alcanzada) y lo único con visitas al perfil medibles. Pero llegan a 30–70 cuentas: **el alcance nuevo sale de los reels**, no de los carruseles. Precio en la primera placa (en diciembre, al final: ver abajo). | Día de la Madre (13/10): 430 vistas. Semana 19-25/10: "Las 3 cafeteras, lado a lado" 249 vistas, "Dos cafeteras" 182; todos los reels 68-73. Corregido el 21/11 (Windsor, 21/10–19/11): 5 carruseles con 31 a 71 cuentas alcanzadas; reels de historia, 1.000+. | probado |
| Fotos de ambiente (Google Flow) intercaladas con carruseles y reels, nunca dos del mismo tipo seguidas; marcadas como IA en Metricool y con precio cuando venden un modelo. | Pedido de Lucas, 23/10. | regla |
| **Como mucho 1 foto suelta por semana.** Es el formato más flojo: si una idea entra en carrusel, va en carrusel. | Diagnóstico 21/11: 5 fotos (3, 5, 9, 16 y 19/11) con 27 a 45 de alcance, 1 a 6 me gusta y casi ninguna visita al perfil. | probado (21/11) |
| Todo post con precio dice cómo pagar: transferencia o efectivo 20% OFF, o cuotas sin interés en Mercado Libre. No se combinan. | Para que nadie espere las dos cosas juntas. | regla |
| Solo modelos con stock. Hoy la Krups Roma está sin stock: no aparece en piezas nuevas (las piezas toman `DISP` en contenido.js). | Pedido de Lucas, 14/10. | regla |
| No decir "garantía oficial", "sellada de fábrica" ni "30 días para devolverla". Solo las políticas de Mercado Libre. | Pedido de Lucas, 14/10: no es así. | regla |

## Textos

| Regla | Por qué | Firmeza |
|---|---|---|
| Terminar con una pregunta fácil de contestar ("¿Vos sos de cortado o de latte?"), pero **no contar con los comentarios**: lo que se mide son compartidos, guardados y mensajes por WhatsApp. | 0 comentarios en la primera pieza. Diagnóstico 21/11: 3 comentarios en 30 días con pregunta en casi todas las piezas; "Comentá CAFÉ" en "Dos vecinos", 0. | probado |
| **No usar "Guardalo para comparar".** Cerrar con "Mandáselo a …" o "Guardalo: es/son …" con un motivo concreto. | 0 guardados en todas las piezas, 2 semanas seguidas (2-15/11), con "Guardalo para comparar". | regla (16/11) |
| No repetir el mismo tema dos días seguidos (ej. "transferencia o cuotas" + "dos formas de pagar"). | Calendario de octubre. | regla |
| Contenido de "cómo se compra" (pagos, envíos, pasos): como mucho 1 por semana. Los tips de café sirven más para guardar y compartir. | Hay 5 piezas de "cómo se compra" en 3 semanas. | señal |

## Volumen y mezcla (diagnóstico del 21/11)

Sale de 30 días de datos por pieza vía Windsor.ai (21/10 al 19/11; la prueba gratis no da más atrás).
Informe completo: artifact "Diagnóstico @cafentucasa".

| Regla | Por qué | Firmeza |
|---|---|---|
| **Por semana: 3 reels y 2 carruseles** (más historias). Menos piezas, mejor hechas. | 25 piezas en 30 días: 6.048 de alcance, 197 interacciones, 1 seguidor nuevo. El alcance cayó 43 % en la segunda quincena (3.857 → 2.191) cuando no hubo un reel de historia. | probado |
| Los **reels de historia o de la máquina por dentro son lo único que trae gente nueva**. Si el objetivo es alcance nuevo (diciembre), tiene que haber reels de esos en el calendario. | Los dos picos del mes (27 y 29/10) son "Dos vecinos" y "El grano que habla". Fuera de esos días, el alcance diario queda entre 20 y 200. | probado |
| Precio y dudas frecuentes en carruseles e historias destacadas; reels sin precio en pantalla (salvo "la cuenta"). | Ver Reels y Carruseles. | regla |

### Pruebas abiertas (del 24/11 al 5/12)

| Prueba | Qué es | Cómo se mide | Referencia |
|---|---|---|---|
| Lo-Fi: la mañana real | Manos, molinillo y crema cayendo, grabado con el celular, sonido ambiente, sin edición. | Salteo a los 3 s **menor a 60 %** y tiempo medio **mayor a 8 s**. | Mediana del mes: 75 % de salteo, 4,9 s. |
| "Dos vecinos", segunda parte | Misma historia con otros personajes (la oficina, la pareja, el de las cápsulas). Una por semana. Se puede subir como reel de prueba (solo no seguidores). | (Guardados + compartidos) cada 1.000 cuentas alcanzadas. | "Dos vecinos": ≈1,9. |
| Detrás de escena con Lucas a cámara | Armar y despachar un pedido mientras cuenta algo. | Comentarios y mensajes por WhatsApp que genera. | Hoy ≈ 0. |

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

## Estrategia de marca (19/11)

El concepto y la postura de venta están en `marca/ESTRATEGIA.md`: **"El lujo de todos los días"**, compra
emocional ("me lo merezco, lo quiero, puedo"), público de 40 a 60 años y "cápsulas no" como diferencia
principal. La sección 9 de ese archivo cruza la estrategia con estas reglas: si chocan, mandan los datos
de acá.

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
| Concepto (19/11) | "El lujo de todos los días": 3 piezas emocionales en los 3 créditos libres (4, 14 y 23/12). Ver `marca/calendario-dic-2026.md`. |

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
- Diciembre 2026 (al 19/11): 14 programadas (1, 2, 7, 8, 9, 10, 11, 15, 17, 18, 21, 22, 28 y 29/12) + el borrador del 3/12 = 15. Se suman 3 de la estrategia de marca (4, 14 y 23/12) = 18, más 2 reservados para Reyes = 20. **Diciembre queda lleno.**
- Las 2 piezas de noviembre de la estrategia de marca (24 y 30/11) no tienen crédito: se suben a mano desde la app de Instagram, o pasan a enero.
- Enero 2027 (al 17/11): 5 carruseles programados (5, 7, 12, 14 y 19/1, a las 10:00). Quedan 15 libres.
- Imágenes para Metricool: links públicos del repo en GitHub (raw.githubusercontent.com con el hash del commit). Metricool las copia a sus servidores al programar.

---
Última actualización: 21/11/2026 (diagnóstico de 30 días con Windsor.ai: reels de lista fuera, una versión por idea, como mucho 1 foto suelta por semana, mezcla de 3 reels + 2 carruseles, tres pruebas abiertas). Anterior: 16/11/2026 (semana 9-15/11: 1.080 vistas, 531 alcanzadas, 24 interacciones, 813 seguidores; 0 guardados y compartidos). Anterior: 26/10/2026 (semana 19-25/10: 1.033 vistas, 435 alcanzadas, 28 interacciones, 812 seguidores; 0 guardados y compartidos por segunda semana).
