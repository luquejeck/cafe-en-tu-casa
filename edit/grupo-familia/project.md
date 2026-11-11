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
