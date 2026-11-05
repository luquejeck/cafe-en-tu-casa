# Cápsulas v4: gancho con el dato en el cuadro 0

## Sesión
- 05/11/2026. La v3 (27,6 s, gancho «La verdad incómoda») se publicó y retuvo poco: la gente se iba en el gancho.
- Diagnóstico de la v3: ~0,6 s de silencio al arrancar, el remate («Chau, cápsulas») antes del planteo, promesa vaga sin dato, «café viejo» recién en el seg. 8–10, 26 s de duración. Rompe las tres reglas probadas de `reportes/APRENDIZAJES.md`.
- Mismas tomas que la v3 (subidas de nuevo por Lucas; se identificaron por tamaño de archivo). Fuentes en `edit/capsulas/src/` (no van a git).

## Estrategia
Dato primero → solución → remate con pregunta. 8,8 s.
1. 0–2,6 s · `103d7c21` «Estamos pagando por café viejo y encima guardado en un pote de plástico.» Se habla desde el cuadro 0, y el titular «Café de cápsula: / molido hace meses.» ya está completo en el cuadro 0 (sin animación de entrada).
2. 2,6–5,7 s · `60d896c4` «Por eso, con una automática tocás un solo botón y te hace todo el trabajo por vos.» Punch-in en «tocás».
3. 5,7–8,8 s · `eb5845be` el tiro (cámara lenta x0,5) con «Chau, cápsulas.» y la sonrisa a cámara con «¿Cápsula o grano?».

## Decisiones
- Se dejó afuera el giro («El verdadero lujo es…»): es la parte abstracta y no se puede empalmar entre tomas a mitad de frase (habla continua, sin 0,1 s de silencio en `57ee6e8d` 3,24 ni en `38a2542b` 2,32).
- Sin «la verdad» en todo el video.
- Subtítulos «Typewriter» solo en la frase 2: en el gancho la cara llena el cuadro (mentón en y≈1450) y no entran; el titular los reemplaza. En el remate no hay habla.
- Habla a x1,18 (como la v3). Color: la corrección suave de la v3 (el balance sugerido enfriaba la piel).
- Sin B-roll de la Krups. La Krups se ve de fondo en todas las tomas a cámara (no se puede sacar).
- Sonido: golpe grave en el cuadro 0, whoosh en el tiro, clic en la pregunta, pad propio 17 dB debajo de la voz (`sfx/make.sh`, sin derechos). Master −14,3 LUFS, pico −1,4 dBFS.
- Composición: `reels/src/ReelCapsulasV4.tsx` (ReelKit + textos propios).

## Controles
- Bordes por audio (`speech_mask.py --edl`): 2 avisos, revisados en la forma de onda: «Estamos» cae en un hueco de 50 ms; el sonido antes del tiro es el bowl (−35 dB), no habla.
- Auditoría de caras del render: 0 superposiciones.

## Pendientes
- La Krups Roma está sin stock y se ve de fondo. Confirmar con Lucas.
- Publicar solo con el «sí» de Lucas. Texto sugerido para la publicación: «¿Sabías que el café de cápsula se muele meses antes de que lo tomes? Con una automática molés el grano en el momento, con un solo botón. ¿Vos sos de cápsula o de grano?»
