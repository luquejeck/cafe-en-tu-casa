# El grupo de la familia

## Idea
Chat familiar que se escribe solo, sin filmar. Versión 2: modo claro, estética de chat de mensajería (fondo con dibujos de café, colitas, hora, tildes), texto más grande, gancho en texto «Mi viejo en el grupo familiar 💀». Papá se compró una cafetera «de un palo y medio» (precio de la Magnifica S en ML ≈ $1,5 M), todos lo bardean, manda la foto del latte y al final todos quieren ir (hasta la Tía Marta, que se une al grupo).
Mecanismo viral: identificación («mi familia es así») + envío («mandáselo a tu grupo familiar»).

## Reglas aplicadas (reportes/APRENDIZAJES.md)
- Gancho legible en el cuadro 0 (cámara arranca con zoom sobre el mensaje de Papá).
- Beneficio («muele el grano en el momento. un botón.») a los 4,35 s, antes del seg. 6.
- 12 s. Cierre con una acción (mandarlo al grupo) y pregunta A/B en el texto.
- Solo la Magnifica S (con stock). Chat genérico con colores de marca: no imita ninguna app real.

## Archivos
- `chat.json`: guion y tiempos (lo leen el video y el sonido).
- `reels/src/ReelGrupoFamilia.tsx`: composición Remotion `ReelGrupoFamilia`.
- `sonido.py`: efectos y base musical sintetizados (sin derechos de terceros).
- `cover.jpg`, `caption.txt`.

## Armar
    python3 -I edit/grupo-familia/sonido.py
    cd reels && npx remotion render ReelGrupoFamilia out/grupo-familia-mudo.mp4
    ffmpeg -i reels/out/grupo-familia-mudo.mp4 -i edit/grupo-familia/mezcla.wav -map 0:v -map 1:a -c:v copy -c:a aac -af loudnorm=I=-14:TP=-1.5 -shortest edit/grupo-familia/grupo-familia-mezcla.mp4
(con `sfx.wav` sale la versión sin música, para sumar un audio en Edits).

## Pendiente
- Publicar solo con el «sí» de Lucas. Sugerido: como Reel de prueba (Trial Reel), a las 10:00 de un día hábil.

## Versión 3 (pedido: más llamativo, motion graphics)
- Un solo momento fuerte: el «QUÉ» de Mamá toma la pantalla (1,15–1,8 s): fondo #101012, letras Inter 900 a 400 px que golpean una por una, sacudón y signos «?» verdes y blancos que vuelan.
- Gestos de chat: reacciones que saltan y cuentan (😱 ×3 en Papá, 😂 en Sofi, 😍❤️ en la foto), la foto se «descarga» (anillo verde + desenfoque que se aclara) mientras la cámara se acerca, golpecito de cámara con cada mensaje, corazones que suben con el «ahora sí me quieren».
- Cierre: hoja de «reenviar» con el texto «Mandáselo a tu grupo familiar 👀»; se toca «Familia 🏠» (onda + check verde) y aparece la marca.
- Sonido: blups de reacciones, ráfaga en los signos, destellos en los corazones, toque y check en el cierre.

## Versión 4 (pedido: motion para público de 45–60 con gusto premium) + prueba de ganchos
- Movimiento lento y preciso (curvas suaves, sin rebotes); sin sacudón, sin signos volando, sin corazones flotando, sin golpecito de cámara.
- «¿Qué?» de Mamá en Inter 200 a 300 px: el espaciado se cierra, foco que se asienta, línea verde fina y «Mamá». Silencio musical debajo + golpe grave largo.
- Foto: foco que se asienta y acercamiento lento (sin anillo de descarga). Reacciones con fundido. «ahora sí me quieren» con ❤️ 3.
- Cierre: la hoja de reenviar sube despacio; «Familia 🏠» se marca con un check que se dibuja.
- Música: piano eléctrico cálido, 76 bpm (Cmaj9 – Am9 – Fmaj7 – G6).
- Ganchos para Reels de prueba (`ganchos` en chat.json): **A** «Esperá a ver qué contesta mamá 👀» · **D** «Mi viejo en el grupo familiar». Medir retención a los 3 s y quedarse con el mejor.
  Render: `npx remotion render ReelGrupoFamilia out/gf-a.mp4 --props=out/props-a.json` (props = `{"gancho": "..."}`).

## Versión 5 (pedido: más motion graphics, mismo estilo Apple)
- La foto de Papá sale del chat a pantalla completa (4,6–6,45 s): transición de elemento compartido desde la burbuja, acercamiento lento, y dos notas en vidrio esmerilado con línea fina y punto que señalan la máquina: «Grano recién molido.» (tolva) y «Con un solo botón.» (panel). Vuelve exacto a su burbuja.
- El «¿Qué?» ahora va sobre el chat desenfocado (vidrio oscuro) en lugar de negro plano.
- Sonido: aire suave al abrir y cerrar la foto, tic de vidrio en cada nota.
- Tiempos corridos: Mamá escribe desde 6,55 s, el resto del chat igual de rápido; cierre a 10,95 s.

## Versión 6 (pedido: 15 s o más, CTA o buen cierre, voces)
- 24,2 s (tiempos ajustados a las voces reales). Remate nuevo de Mamá: «y traé medialunas 🥐». Tía Marta: «¡yo también, querido!».
- Cierre en dos tiempos: hoja de reenviar («Mandáselo a tu grupo familiar 👀», se elige Familia) y tarjeta final sobre blanco: «Café de cafetería, en tu casa.» + Magnifica S + «Link en la bio · @cafentucasa».
- Voces ElevenLabs (eleven_v4), acento argentino: Papá = Franco, Mamá = Sol, Sofi = Cande, Vos = Renzo, Tía Marta = Nieve. Archivos en `voces/`; `chat.json` dice en qué segundo entra cada una (`voz`). La música baja ~9 dB cuando alguien habla.
- Pendientes (el cupo gratuito de ElevenLabs estaba saturado): papa-compre, mama-que, sofi-crisis, mama-capuchino, vos-voy, papa-quieren, mama-medialunas.
