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
| Duración objetivo: 9 a 12 segundos (antes 14 a 25). | 6+ reels medidos entre 98 y 177 vistas, todos abandonados antes de la mitad. | probado |
| Cierre en pantalla en el último segundo (no solo en el texto) y pedir compartir: "Mandáselo a …" + una pregunta fácil (A o B). **Prueba de una semana (26/10 al 1/11).** | Guardados y compartidos en CERO dos semanas seguidas (12-25/10) con "Guardalo". | prueba |
| Los reels con **historia y voz** (personajes, un conflicto con números) retienen mucho más que los de producto: ir por ahí. Arrancar con el conflicto en movimiento, no con un plano quieto. | "Dos vecinos" (plano, voz de Valeria, 31 s, 27-28/10): pierde 30 % en el primer segundo y queda en 47 % a los 5 s, pero después baja muy poco: 42 % a los 9 s, 33 % a los 19 s, 27 % a los 27 s. El 88 % de las vistas vino de la pestaña Reels (gente que no sigue la cuenta). La caída final es en el cierre "Comentá CAFÉ". | prueba |
| Los reels llevan música de fondo: lo-fi de `instagram/musica.py` (sin derechos), alternando los temas mañana, tarde y sobremesa. `filmar.mjs` la agrega sola. | Pedido de Lucas, 23/10: sin sonido son aburridos. El catálogo de Instagram vía Metricool da error. | regla |
| Sin montos en videos, salvo el reel de "la cuenta", que lleva los números en pantalla con fecha ("precios del sitio al 27/10") y "valores aproximados". | Los videos quedan viejos; la cuenta es el gancho que funciona. | regla |

## Carruseles

| Regla | Por qué | Firmeza |
|---|---|---|
| Priorizar carruseles con precios y comparativas: son lo que más alcanza. Precio en la primera placa. | Día de la Madre (13/10): 430 vistas. Semana 19-25/10: "Las 3 cafeteras, lado a lado" 249 vistas, "Dos cafeteras" 182; todos los reels 68-73. | probado |
| Fotos de ambiente (Google Flow) intercaladas con carruseles y reels, nunca dos del mismo tipo seguidas; marcadas como IA en Metricool y con precio cuando venden un modelo. **Como mínimo 2 por semana, y nunca se sacan del feed para poner un reel** (si hace falta lugar, se mueven de día). | Pedido de Lucas, 23/10 y 2/11: mirando el feed no se entiende qué vendemos; a la gente le gusta ver la cafetera en la casa donde se usaría. | regla |
| Todo post con precio dice cómo pagar: transferencia o efectivo 20% OFF, o cuotas sin interés en Mercado Libre. No se combinan. | Para que nadie espere las dos cosas juntas. | regla |
| Solo modelos con stock. Hoy la Krups Roma está sin stock: no aparece en piezas nuevas (las piezas toman `DISP` en contenido.js). | Pedido de Lucas, 14/10. | regla |
| No decir "garantía oficial", "sellada de fábrica" ni "30 días para devolverla". Solo las políticas de Mercado Libre. | Pedido de Lucas, 14/10: no es así. | regla |

## Textos

| Regla | Por qué | Firmeza |
|---|---|---|
| Terminar con una pregunta fácil de contestar ("¿Vos sos de cortado o de latte?"). | 0 comentarios en la primera pieza. | señal |
| No repetir el mismo tema dos días seguidos (ej. "transferencia o cuotas" + "dos formas de pagar"). | Calendario de octubre. | regla |
| Contenido de "cómo se compra" (pagos, envíos, pasos): como mucho 1 por semana. Los tips de café sirven más para guardar y compartir. | Hay 5 piezas de "cómo se compra" en 3 semanas. | señal |

## Horarios

| Regla | Por qué | Firmeza |
|---|---|---|
| **EN PRUEBA del 3 al 13/11: 10:00 contra 18:00.** No mover de hora las piezas del test hasta que termine (ver "Test de horario" abajo). | "Dos vecinos", mismo video: 130 vistas a las 9:00 y 1.210 a las 17:06. "¡Apretaron el botón!" a las 21:58: 1.303. Todo lo de las 10:00 entre 70 y 435. Metricool marca las 10 como pico de audiencia conectada, pero los datos de la cuenta dicen otra cosa. | prueba |
| Sábado y domingo: solo historias (la del domingo, solo si hay algo para preguntar). | La audiencia activa del finde es la mitad. | probado |
| Las historias salen solas desde Metricool. Si llevan sticker (encuesta, preguntas, cuenta regresiva), se programan con aviso al celular, nunca en borrador. | Semanas 12-18 y 19-25/10: las historias en borrador no salieron; la semana 19-25 no salió ninguna. | regla |
| Contar los créditos de Metricool antes de programar (20 por mes, historias incluidas; se gastan al publicarse, los borradores no cuentan). Reservar para Black Friday y Navidad. | Del 26 al 31/10 fallaron 7 publicaciones con "You have reached your Metricool account limit": esa semana no salió casi nada desde Metricool. | regla |
| Una pieza de feed por día, como máximo. | Que no compitan entre sí. | regla |

### Test de horario (3 al 13/11)

Todo sale desde Metricool (mismo canal) para que la única diferencia sea la hora. Se compara cada pieza contra las de su mismo formato.

| Día | Pieza | Formato | Hora |
|---|---|---|---|
| Mar 3 | Home office (Flow) | foto | 18:00 |
| Mié 4 | Dedica EC685 a fondo | carrusel | 10:00 |
| Jue 5 | Recién molido (Flow) | foto | 18:00 |
| Vie 6 | Pagaste, ¿y ahora? | reel | 10:00 |
| Lun 9 | Una mañana sin apuro (Flow) | foto | 10:00 |
| Mar 10 | ¿Entra en tu mesada? | reel | 18:00 |
| Mié 11 | Preguntas frecuentes | carrusel | 10:00 |
| Jue 12 | 4 preguntas | reel | 18:00 |
| Mar 17 | 5 cosas de la Magnifica S (control) | reel | 10:00 |
| Jue 19 | Sobremesa (Flow) | foto | 10:00 |

Se mide a las 72 h de cada pieza: vistas (IGPO28 / IGRE23), alcance, guardados + compartidos y tiempo medio en reels. Decide el reporte del lunes 16/11 (con el jue 19 se confirma la foto de las 10:00).
Gana el horario que saque más vistas **en el mismo formato** en al menos 2 de los 3 formatos. Si la diferencia es menor al 30%, empate: se sigue con 10:00 y se prueba 21:00.
Confundidor a tener en cuenta: los dos reels ganadores de la tarde (27 y 28/10) se subieron a mano desde la app, no por Metricool.

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

---
Última actualización: 2/11/2026 (test de horario y mezcla del feed). Anterior: 26/10/2026 (semana 19-25/10: 1.033 vistas, 435 alcanzadas, 28 interacciones, 812 seguidores; 0 guardados y compartidos por segunda semana).
