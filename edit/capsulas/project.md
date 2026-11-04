# La verdad incómoda sobre las cápsulas

## Sesión
- 04/11/2026. 11 clips subidos por Lucas: 9 tomas a cámara del mismo guion, 2 planos de la Krups sirviendo (sin voz).
- `504c9e58` es una edición anterior del mismo video (720p, subtítulos quemados): se usó solo como referencia del guion.
- Pedido: subtítulos con motion graphics, sin silencios ni retomas, buen gancho, edición con sentido y los momentos graciosos marcados con algo distintivo. Libertad creativa; usar Remotion.

## Estrategia
Gancho → problema (premium vs. viejo) → giro (el verdadero lujo) → solución (automática, 3 beneficios) → cierre "hacé el cambio YA" → CTA al perfil → blooper al final (la toma con dudas), que remata el "incómodo" del gancho.

## Decisiones
- Marca `cafe-en-tu-casa`, estilo Marker, subtítulos Accent (palabra hablada en verde).
- Velocidad x1.1 en el habla; el tiro de cápsulas y el blooper a x1.0.
- Tomas elegidas: gancho `eb5845be`; problema `103d7c21`; giro `57ee6e8d` (la toma lenta, con las pausas comprimidas); solución `60d896c4`; cierre `d43939a5` (la que tiene "ya" y la sonrisa); CTA `7028d5a7`. Descartadas: `38a2542b` (sin cortes limpios), `a409b7bb` (sin "ya").
- Color: corrección suave de balance (mitad de la sugerida) para no perder la calidez de la cocina.
- Escenas: gancho grande, "Café premium → Café viejo" en split, lista de 3 beneficios en panel, CTA a pantalla completa.
- Remates (componente `reels/src/ReelCapsulas.tsx`): sticker verde inclinado con rebote = "esto es chiste". Tiro de cápsulas (sacudón + flash + "¡Chau, cápsulas! 👋"), "¡YA! 😁" en la sonrisa, blooper en gris con REC · TOMA 7, "Lo que no viste 😅" y burbujas "silencio incómodo…".
- Sonido: whoosh y pops sintetizados; sin música quemada (elegirla en la app al publicar).

## Pendientes
- La Krups Roma figura sin stock en `reportes/APRENDIZAJES.md` y aparece en el B-roll y de fondo. Confirmar con Lucas si se publica así.
- Publicar solo con el "sí" de Lucas.

## Versión 2 (pedido de Lucas: más limpio, estilo Apple, público ~40 años)
- Gancho: «La verdad / incómoda.» se revela desde un desenfoque sobre un zoom lento, con un oscurecido suave arriba. Sin stickers.
- Sin repetir «la verdad»: se cortó «pero la verdad es que» (queda «…café premium, estamos pagando por café viejo…») y «La verdad es que» del giro (queda «El verdadero lujo es…», corte en 0,90 s de `57ee6e8d`, verificado con transcripción del fragmento).
- Remates sobrios: punch-in + «Chau, cápsulas.» en blanco fino; «¡YA!» solo con zoom; blooper en blanco y negro con «Toma 7 · lo que no viste» chico y «silencio incómodo…» / «sigue pensando…» en píldora de vidrio esmerilado.
- Subtítulos «Typewriter» (frase completa, blancos, sin cajas), oscurecido inferior 0.65 medido.
- Escenas en tono «feature» (entradas deslizadas). Sonido: whoosh en el tiro y un tic al entrar el blooper.
- Duración: 30,9 s. Master −14,2 LUFS, pico −1,4 dBFS.
