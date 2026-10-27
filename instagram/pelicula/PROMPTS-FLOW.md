# "Para alguien" — Guía de producción en Google Flow

Brand film de Café en tu Casa. Formato master **16:9**, ~2:30 min, ~20 tomas de 8 s (se recortan en edición).

Los prompts están **en inglés** porque Veo e Imagen responden mucho mejor así. Los diálogos NO se generan en Flow: van con las voces de ElevenLabs que están en `voces/`.

---

## Cómo trabajar (el orden importa para que todo sea coherente)

1. **Paso 0 — Referencias ("ingredientes").** Antes de cualquier toma, generá en Flow las 5 imágenes de referencia de abajo (Roberto, Laura, Laura nena, Marta, la cocina) y subí la foto real de la cafetera (`assets/img/magnifica-s.webp`). Elegí la mejor de cada una y **usala como referencia en TODAS las imágenes** donde aparezca ese personaje o lugar.
2. **Paso 1 — Imagen inicial** de cada toma: pegá el prompt completo + adjuntá las referencias que indica.
3. **Paso 2 — Imagen final:** no la generes de cero. **Editá la imagen inicial** con la instrucción de "Imagen final". Así se mantienen la cara, la ropa y la luz idénticas.
4. **Paso 3 — Video:** en Flow, modo *Frames to Video*, cargá inicial + final y pegá el prompt de video.
5. **Paso 4 — Mandame los clips** (MP4) y armo el montaje con las voces, el sonido y la música.

**Reglas de oro**
- Siempre el mismo bloque de estilo (ya está incluido en cada prompt; no lo cambies).
- Nadie habla a cámara: los diálogos están planificados de espaldas, fuera de cuadro o tapados (diario, beso en la cabeza). Así no hay problema de sincronía de labios con las voces de ElevenLabs.
- Pedile a Flow que **no genere música ni voces** (ya está en cada prompt). Si igual las agrega, no importa: en edición uso solo la imagen.
- Nada de texto ni logos legibles: la IA los deforma. La marca aparece solo en el cierre, que armo yo.
- La cafetera: usá siempre la foto real como referencia. Si los planos macro del producto no salen fieles, conviene filmarlos de verdad con el celular (cámara lenta, luz de ventana) — se mezclan bien con el resto.

---

## Lo que aprendimos generando los videos (octubre 2026)

La primera tanda (Omni Flash, inicial + final distintas, varias acciones por toma) salió casi toda inservible: gente que atraviesa objetos, tazas que aparecen o cambian de mano, movimientos irreales. Lo que funcionó:

1. **La IA nunca hace la manipulación.** Cada clip arranca con los objetos *ya en su estado final* (por ejemplo, Roberto ya con las dos tazas en la mano) y solo se mueven la cara, la respiración, la luz o la cámara. El gesto de agarrar, guardar o servir se cuenta con un corte o se filma de verdad.
2. **Una sola acción chica por clip.** Nada de "saca, duda, guarda, cierra". Si hace falta más, se divide en dos planos cortos (como la 11a y la 11b).
3. **Imagen final casi igual a la inicial, o sin final.** Si las dos imágenes están muy lejos (cruzar la cocina, pararse, sacarse el saco), el modelo inventa la transición y ahí se rompe la física.
4. **Sin contacto entre personas.** Las manos que se tocan (la 06) fallaron siempre; lo resolvimos con la mano de la madre apoyada cerca, sin tocar.
5. **Sin dedos tocando la máquina.** En la 13 el dedo apretaba en cualquier lado; se resolvió con un primer plano solo de cara.
6. **El método pesa más que el modelo.** Con este criterio, Veo 3.1 Fast (20 puntos) alcanzó; Quality (100) no arregló los errores de manos.
7. **En el prompt de video:** "locked-off camera", "exactly as in the frame", "nothing appears or disappears", "hands and objects do not move".
8. **Imágenes con Nano Banana Pro:** tiene límite de uso diario. Cuando se agota, Nano Banana 2.1 (0 puntos) sirve bien para editar.
9. **Ojo con los ajustes de Flow:** al cambiar entre Imagen y Video, a veces vuelve a "x4" o a "Ingredientes" (cuatro veces el costo). Revisá siempre el costo antes de enviar.

## Estado de producción

| Toma | Estado | Archivo |
|---|---|---|
| 01 | ✅ IA (Veo Fast, arranca con las dos tazas en la mano) | `clips/toma-01.mp4` |
| 02 | 📱 Filmar: manos guardando una taza | — |
| 03 | 📱 Filmar: revolver café instantáneo | — |
| 04 | ✅ IA (Veo Fast) | `clips/toma-04.mp4` |
| 05 | ✅ IA (Veo Fast) | `clips/toma-05.mp4` |
| 06 | ✅ IA (Veo Fast, manos sin tocarse) | `clips/toma-06.mp4` |
| 07 | 📱 Filmar: café a la pileta | — |
| 08 | ✅ IA (Veo Fast) | `clips/toma-08.mp4` |
| 09 | ✅ IA (Veo Quality, final cercana) | `clips/toma-09.mp4` |
| 10 | 🎬 Montaje: fundido entre las imágenes de mañana y noche | `frames/toma-10-*.png` |
| 11 | ✅ IA en dos planos (leyendo / junto a la máquina) | `clips/toma-11a.mp4`, `clips/toma-11b.mp4` |
| 12 | 📱 Filmar: granos cayendo en la tolva | — |
| 13 | ✅ IA (Veo Fast, primer plano sin manos) | `clips/toma-13.mp4` |
| 14 | 📱 Filmar: espresso cayendo (la Magnifica real) | — |
| 15–19 | ✅ IA (Veo Fast) | `clips/toma-15.mp4` … `clips/toma-19.mp4` |

Las imágenes de cada toma están en `frames/` (`toma-XX-inicial.png` / `toma-XX-final.png`). Todo vive también en el proyecto de Google Flow.

---

## Bloques de estilo (referencia; ya están pegados en cada prompt)

**PRESENTE**
> Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, soft natural window light from camera left, muted warm palette of faded olive green, ochre, cream and coffee brown, subtle film grain, gentle halation, shallow depth of field, realistic skin texture, no makeup look, authentic lived-in details, quiet melancholic mood, contemporary Argentine auteur cinema. No text, no logos, no watermarks.

**RECUERDO (1989)**
> Cinematic film still, 16:9, year 1989, shot on 16mm Kodak film, warm golden late-morning sunlight, nostalgic warm tones of amber, honey and terracotta, visible film grain, soft halation around highlights, slightly faded colors like an old family photograph, shallow depth of field, tender joyful mood. No text, no logos, no watermarks.

---

## Paso 0 — Imágenes de referencia

**REF-ROBERTO**
> Character reference portrait of Roberto, a 72-year-old Argentine man of Italian descent, lean build, slightly stooped shoulders, short thinning white hair combed back, white two-day stubble, deep wrinkles around tired kind eyes, large weathered hands of a retired lathe operator, thick brown tortoiseshell reading glasses, wearing a faded navy-blue wool cardigan over a light-blue checked cotton shirt, grey wool trousers and brown leather slippers. Three-quarter view, standing in a modest kitchen, neutral expression of quiet grief. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, soft natural window light from camera left, muted warm palette of faded olive green, ochre, cream and coffee brown, subtle film grain, realistic skin texture, no makeup look. No text, no logos, no watermarks.

**REF-LAURA**
> Character reference portrait of Laura, a 42-year-old Argentine woman, shoulder-length dark brown wavy hair loosely tied back with a few loose strands, natural face with light freckles, warm brown eyes, no makeup look, small gold hoop earrings, wearing a camel trench coat over a cream cable-knit sweater and dark jeans. Three-quarter view, standing in a hallway with patterned cement floor tiles, soft serious expression. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, soft natural window light from camera left, muted warm palette of faded olive green, ochre, cream and coffee brown, subtle film grain, realistic skin texture. No text, no logos, no watermarks.

**REF-LAURA-NENA**
> Character reference of a 7-year-old Argentine girl (young Laura) in 1989, dark brown wavy hair in two braids, light freckles, warm brown eyes, wearing a mustard-yellow hand-knitted sweater and corduroy pants, sitting on a wooden kitchen chair, curious smile. Cinematic film still, 16:9, year 1989, shot on 16mm Kodak film, warm golden late-morning sunlight, nostalgic warm tones of amber, honey and terracotta, visible film grain, soft halation, slightly faded colors like an old family photograph. No text, no logos, no watermarks.

**REF-MARTA**
> Character reference of Marta, an Argentine woman in her late 30s in 1989, dark curly shoulder-length hair held with a tortoiseshell clip, warm smile, wearing a floral cotton apron over a burgundy blouse, thin gold wedding ring, hands slightly floury. Medium shot in a sunny kitchen, face softly lit. Cinematic film still, 16:9, year 1989, shot on 16mm Kodak film, warm golden late-morning sunlight, nostalgic warm tones of amber, honey and terracotta, visible film grain, soft halation, slightly faded colors like an old family photograph. No text, no logos, no watermarks.

**REF-COCINA**
> Wide establishing shot of a modest 1970s kitchen in a Buenos Aires "PH" row house in Villa Devoto: pale green and white square ceramic wall tiles, a cream formica table with chrome edges and two mismatched wooden chairs, a white enamel gas stove, a wooden cabinet with glass doors holding mismatched cups, a paper butcher-shop calendar on the wall, a stainless steel sink under a window that looks onto a small tiled patio with terracotta pots of geraniums, an old radio on a shelf. Empty room, early morning. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, soft natural window light from camera left, muted warm palette of faded olive green, ochre, cream and coffee brown, subtle film grain, gentle halation, authentic lived-in details. No text, no logos, no watermarks.

**Generadas en Canva (versión 1, pendientes de aprobación):**
REF-ROBERTO `MAHZJxlYMcU` · REF-LAURA `MAHZJyspFno` · REF-LAURA-NENA `MAHZJ92X0HQ` · REF-MARTA `MAHZJ7mWH4Q` · REF-COCINA `MAHZJ6Ja8Fo`
(se abren en `https://www.canva.com/M/<id>`)

**REF-CAFETERA:** subí la foto `assets/img/magnifica-s.webp` (no la generes).

---

## Tomas

Referencias a adjuntar entre corchetes. En las tomas de recuerdo, la cocina es la misma pero 35 años más nueva.

### TOMA 01 — Las dos tazas (0:00) · [REF-ROBERTO, REF-COCINA]
**Imagen inicial**
> Roberto, a 72-year-old Argentine man with thinning white hair, white stubble, brown tortoiseshell glasses, faded navy-blue cardigan over a light-blue checked shirt, stands in front of an open wooden kitchen cabinet with glass doors, reaching for cups, seen from behind at a three-quarter angle. Pale green ceramic tiles, formica table in the foreground slightly out of focus, cold blue pre-dawn light mixing with a single warm bulb. Medium shot, 40mm lens, camera at chest height. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, soft natural window light from camera left, muted warm palette of faded olive green, ochre, cream and coffee brown, subtle film grain, gentle halation, shallow depth of field, realistic skin texture, quiet melancholic mood, contemporary Argentine auteur cinema. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same shot, same person, same light. He now holds two white ceramic cups, one in each hand, and has turned slightly toward camera, looking down at them with a still, sad expression.

**Video**
> Static camera, medium shot. An elderly man in a navy cardigan slowly takes two white cups out of a wooden kitchen cabinet, out of habit, then stops and looks down at them in silence for a long beat. Very slow, natural, unhurried movement; tiny hesitation in his hands. Blue pre-dawn light from the window, soft film grain, cinematic realism. Keep face, clothing and lighting identical to the frames. Audio: quiet room tone, a refrigerator hum and a distant bus; no music, no dialogue, no voices.

### TOMA 02 — Guarda una (0:06) · [REF-ROBERTO, REF-COCINA]
**Imagen inicial**
> Close-up of the weathered hands of a 72-year-old man in a faded navy-blue wool cardigan holding two white ceramic cups in front of an open wooden cabinet with glass doors, pale green tiles behind. Cold blue morning light, 85mm lens, shallow depth of field. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, soft natural window light from camera left, muted warm palette of faded olive green, ochre, cream and coffee brown, subtle film grain, gentle halation, realistic skin texture, quiet melancholic mood. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same framing and light. Only one cup remains in his hand; the other has been placed back on the cabinet shelf and the glass door is closed.

**Video**
> Static close-up on an old man's hands. He slowly places one of the two cups back on the shelf and gently closes the glass cabinet door, keeping only one cup. Slow, deliberate, resigned gesture. Cinematic realism, film grain. Keep hands, cardigan and lighting identical to the frames. Audio: soft clink of ceramic on wood, the small click of the cabinet door, room tone; no music, no voices.

### TOMA 03 — Café instantáneo (0:12) · [REF-ROBERTO, REF-COCINA]
**Imagen inicial**
> Tight close-up on a cream formica table with chrome edge: a single white cup next to a generic glass jar of instant coffee with a plain unlabeled lid, a metal teaspoon and an electric kettle steaming slightly. An old man's hand in a navy cardigan sleeve enters frame holding the spoon. Cold flat morning light, 85mm lens. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, muted palette of faded olive green, ochre, cream and coffee brown, subtle film grain, shallow depth of field. No text, no logos, no labels, no watermarks.

**Imagen final (editar la inicial)**
> Same framing. Hot water has been poured; the spoon is stirring a thin dark instant coffee with no crema, small bubbles on the surface.

**Video**
> Static macro close-up. An old man's hand drops a spoonful of instant coffee granules into a white cup, pours hot water from an electric kettle and stirs mechanically; the coffee is thin and flat, no crema. Lonely, monotonous rhythm. Cinematic realism, film grain. Audio: only the repetitive metallic clink of the spoon against the cup, clin, clin, clin, and the kettle; no music, no voices.

### TOMA 04 — Toma de parado (0:18) · [REF-ROBERTO, REF-COCINA]
**Imagen inicial**
> Medium shot from inside the kitchen: Roberto, a 72-year-old man with thinning white hair, glasses and faded navy cardigan, stands by the window over the sink holding a cup, seen in profile, looking out at a small tiled patio with dry, neglected terracotta pots of geraniums. Cold morning light on his face, the room around him in shadow. 50mm lens. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, soft natural window light, muted warm palette of faded olive green, ochre, cream and coffee brown, subtle film grain, gentle halation, realistic skin texture, quiet melancholic mood, contemporary Argentine auteur cinema. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same shot and light. He has lowered the cup and his gaze, eyes half closed, a little more stooped.

**Video**
> Very slow push-in (dolly) toward an elderly man drinking coffee standing up by the kitchen window, in profile, staring at a neglected patio. He sips once, without pleasure, then lowers the cup and his gaze. Stillness, loneliness, natural breathing. Cinematic realism, film grain. Keep face, clothing and light identical to the frames. Audio: distant street ambience, a dog barking far away, room tone; no music, no voices.

### TOMA 05 — RECUERDO: el molinillo (0:22) · [REF-MARTA, REF-COCINA]
**Imagen inicial**
> 1989. Close-up of a woman's hands with a thin gold wedding ring turning the brass crank of an old wooden box coffee grinder held between her knees, over a floral cotton apron. Whole roasted coffee beans in the brass bowl on top. Warm golden sunlight streaming in, dust particles in the air, the same pale green tiled kitchen softly blurred behind. 85mm lens. Cinematic film still, 16:9, year 1989, shot on 16mm Kodak film, warm golden late-morning sunlight, nostalgic warm tones of amber, honey and terracotta, visible film grain, soft halation around highlights, slightly faded colors like an old family photograph, shallow depth of field, tender joyful mood. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same framing and light. The small wooden drawer of the grinder is pulled open, full of freshly ground coffee, a few grounds on the apron.

**Video**
> 1989, warm nostalgic 16mm look. Close-up of a woman's hands steadily turning the crank of a wooden manual coffee grinder held between her knees; beans sink into the grinder; at the end she pulls open the little drawer full of fresh ground coffee. Golden sunlight, floating dust, gentle handheld movement. Audio: the rhythmic, irregular crunching of the hand grinder, crr crr crr, and birds outside; no music, no voices.

### TOMA 06 — RECUERDO: la nena (0:27) · [REF-MARTA, REF-LAURA-NENA, REF-COCINA]
**Imagen inicial**
> 1989. A 7-year-old girl with two dark braids and a mustard-yellow knitted sweater kneels on a wooden kitchen chair, leaning over a formica table, reaching her small hand toward a steaming aluminum moka pot. In the foreground, out of focus, a woman in a floral apron (face cropped out of frame). Warm golden sunlight, pale green tiles. 50mm lens. Cinematic film still, 16:9, year 1989, shot on 16mm Kodak film, warm golden late-morning sunlight, nostalgic warm tones of amber, honey and terracotta, visible film grain, soft halation around highlights, slightly faded colors like an old family photograph, shallow depth of field, tender joyful mood. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same scene and light. The woman's hand with a gold wedding ring has gently caught the girl's hand; the girl is laughing.

**Video**
> 1989, warm nostalgic 16mm look, slight handheld. A little girl in a yellow sweater reaches toward a steaming moka pot on the kitchen table; her mother's hand, wearing a gold wedding ring, gently intercepts it and the girl bursts into laughter. The mother's face stays out of frame. Tender, joyful, golden light. Audio: soft childish laughter, steam hissing from the moka pot; no music, no spoken words.

### TOMA 07 — A la pileta (0:32) · [REF-ROBERTO, REF-COCINA]
**Imagen inicial**
> Present day. Close-up of an old man's hand in a navy cardigan sleeve tilting a white cup of thin instant coffee over a stainless steel sink. Cold grey morning light from the window. 85mm lens. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, muted palette of faded olive green, ochre, cream and coffee brown, subtle film grain, shallow depth of field, quiet melancholic mood. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same framing. The cup is empty, placed upside down beside the sink.

**Video**
> Static close-up. An elderly man pours the rest of his instant coffee down the sink and leaves the cup upside down. Abrupt return to the cold present after a warm memory. Cinematic realism. Audio: the liquid splashing into the steel sink, a tap opening briefly, then silence; no music, no voices.

### TOMA 08 — Domingo: el frasco (0:38) · [REF-LAURA, REF-ROBERTO, REF-COCINA]
**Imagen inicial**
> Sunday morning, warmer light. Over-the-shoulder shot from behind Laura, a 42-year-old woman with dark wavy hair loosely tied, camel trench coat: she holds up a generic unlabeled jar of instant coffee. Behind the formica table, Roberto (72, white hair, glasses, navy cardigan) sits reading a broadsheet newspaper held up high, covering his face. A paper bakery package with pastries on the table. 40mm lens. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, soft natural window light from camera left, muted warm palette of faded olive green, ochre, cream and coffee brown, subtle film grain, gentle halation, shallow depth of field, realistic skin texture, contemporary Argentine auteur cinema. No text, no logos, no labels, no watermarks.

**Imagen final (editar la inicial)**
> Same shot. Laura has lowered the jar slowly; the newspaper still covers Roberto's face; a long silent pause.

**Video**
> Static over-the-shoulder shot. A woman in a camel coat picks up a jar of instant coffee and looks at it, then at her father, who stays hidden behind his open newspaper at the kitchen table. Neither face is seen speaking. She slowly lowers the jar. Long, quiet, tense pause. Cinematic realism, film grain. Audio: rustle of newspaper pages, a paper bakery bag, room tone; no music, no dialogue, no voices.

### TOMA 09 — La caja (0:58) · [REF-LAURA, REF-ROBERTO, REF-COCINA]
**Imagen inicial**
> Laura, a 42-year-old woman in a camel trench coat, places a large plain brown cardboard box with no printing on the kitchen counter. In the background, Roberto (72, glasses on the tip of his nose, navy cardigan) sits at the formica table and looks at the box over his glasses. Laura's face is turned toward the box, Roberto's mouth partly hidden behind his raised coffee cup. 40mm lens. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, soft natural window light from camera left, muted warm palette of faded olive green, ochre, cream and coffee brown, subtle film grain, gentle halation, shallow depth of field, realistic skin texture, contemporary Argentine auteur cinema. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same scene. Laura now stands behind her seated father, leaning down to kiss the top of his white hair, her face hidden in it, eyes closed; his eyes look down.

**Video**
> Static medium shot. A woman sets a large plain cardboard box on the kitchen counter; her elderly father looks at it over his glasses. She walks behind him and kisses the top of his head tenderly, then exits frame. No visible lip movement from either. Restrained emotion. Cinematic realism, film grain. Audio: cardboard on the counter, footsteps on tiles, a door closing in the distance; no music, no dialogue, no voices.

### TOMA 10 — Pasan los días (1:10) · [REF-COCINA]
**Imagen inicial**
> Static wide shot of a corner of the 1970s kitchen with pale green tiles: a plain closed cardboard box on the floor next to the formica counter, bright morning sunlight falling across it. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, muted warm palette of faded olive green, ochre, cream and coffee brown, subtle film grain, gentle halation, authentic lived-in details. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same exact framing, now at night lit by a single warm bulb; on top of the still-closed box lie a folded newspaper, an envelope and a set of keys.

**Video**
> Locked-off static camera, time-lapse. The same closed cardboard box in a kitchen corner as the light changes from morning sun to afternoon to night; objects appear on top of it one by one: a newspaper, an envelope, keys. Time passing, quiet neglect. Audio: subtle passing-time room tone, a clock ticking softly; no music, no voices.

### TOMA 11 — Abre la caja (1:18) · [REF-ROBERTO, REF-COCINA, REF-CAFETERA]
**Imagen inicial**
> Early morning. Roberto, 72, white hair, navy cardigan, reading glasses on the tip of his nose, sits at the formica table reading a small instruction booklet with concentration, the opened cardboard box beside him, a black super-automatic espresso machine (see reference image: matte black, rectangular, analog dials) half out of the box. Soft warm window light. 50mm lens. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, muted warm palette of faded olive green, ochre, cream and coffee brown, subtle film grain, gentle halation, shallow depth of field, realistic skin texture, contemporary Argentine auteur cinema. No readable text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same scene and light. The espresso machine now stands on the counter by the window; Roberto, glasses still on his nose, stands before it, slightly unsure, one hand resting on top of it.

**Video**
> Slow handheld medium shot. An elderly man studies an instruction booklet through reading glasses, then lifts a black espresso machine out of its box and places it on the kitchen counter with the careful, slightly clumsy hands of a retired lathe operator who won't admit he doesn't know how. Keep the machine's design identical to the reference. Audio: cardboard, paper pages, the machine set down on formica; no music, no voices.

### TOMA 12 — Los granos (1:26) · [REF-ROBERTO, REF-CAFETERA]
**Imagen inicial**
> Macro close-up from above: an old man's weathered hand tilting an open kraft paper bag of whole roasted coffee beans into the bean hopper of a matte black super-automatic espresso machine (see reference). Glossy dark-brown beans catching warm side light. 100mm macro lens. Cinematic film still, 16:9, Kodak Vision3 250D film emulation, warm window light from camera left, palette of coffee brown, black and cream, subtle film grain, very shallow depth of field. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same framing. The hopper is full of beans; the hand closes the lid.

**Video**
> Macro slow motion. Whole roasted coffee beans pour from a kraft paper bag into the hopper of a black espresso machine, bouncing and tumbling, oils shimmering in warm side light; the man's hand then closes the lid. Audio: crisp sound of beans falling like rain on a tin roof, paper bag crackle; no music, no voices.

### TOMA 13 — El botón (1:35) · [REF-ROBERTO, REF-CAFETERA]
**Imagen inicial**
> Close-up of Roberto's face, a 72-year-old man with white stubble and brown tortoiseshell glasses, lit by warm morning light, looking down at the espresso machine just off frame, his finger about to press a button; expression of tired doubt. 85mm lens. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, soft natural window light from camera left, muted warm palette, subtle film grain, gentle halation, shallow depth of field, realistic skin texture, contemporary Argentine auteur cinema. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same close-up and light. His eyes are now closed, his face softened and moved, as if hearing something from long ago; a faint glint of a tear.

**Video**
> Very slow push-in on an elderly man's face. He presses a button off frame; as the grinder starts he freezes, then slowly closes his eyes, overwhelmed by a memory; his face softens, mouth closed. Subtle, restrained performance. Cinematic realism, film grain. Audio: the mechanical whirr of a coffee grinder starting; no music, no voices.

### TOMA 14 — El café cae (1:48) · [REF-CAFETERA]
**Imagen inicial**
> Extreme macro close-up of the single spout of a matte black super-automatic espresso machine (see reference) as the first thick drops of espresso begin to fall into a thick-walled white ceramic cup. Warm chiaroscuro side light, deep black background, steam rising backlit. 100mm macro lens. Cinematic film still, 16:9, Kodak Vision3 250D film emulation, palette of coffee brown, hazelnut and black, subtle film grain, very shallow depth of field. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same framing and light. The cup is now filled with espresso topped with a thick hazelnut-colored crema with tiger-striped patterns; last drop falling.

**Video**
> Extreme macro, slow motion. Two streams of dark espresso flow from the spout of a black espresso machine into a white ceramic cup, merging into a thick hazelnut crema with tiger stripes; backlit steam curls upward. Warm chiaroscuro, the only "beautiful product shot" of the film. Audio: soft dripping and liquid hitting ceramic; no music, no voices.

### TOMA 15 — La segunda taza (1:58) · [REF-ROBERTO, REF-COCINA]
**Imagen inicial**
> Medium shot of Roberto, 72, navy cardigan, glasses, in front of the open wooden glass-door cabinet, one white cup already in his hand, reaching toward the shelf for a second one; warm golden morning light now fills the kitchen (warmer than the first scenes). 40mm lens. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, soft natural window light from camera left, warm palette of ochre, olive green, cream and coffee brown, subtle film grain, gentle halation, realistic skin texture, contemporary Argentine auteur cinema. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same shot and light. He holds two cups and is placing both on the counter next to the espresso machine; a faint, almost hidden smile.

**Video**
> Static medium shot echoing the opening scene. The elderly man takes a cup from the cabinet, hesitates, then takes a second one, and this time keeps both, placing them side by side on the counter. Faint, restrained smile, mouth closed. Warm golden light. Cinematic realism, film grain. Audio: ceramic clinks, room tone, birds outside; no music, no voices.

### TOMA 16 — Laura llega (2:05) · [REF-LAURA]
**Imagen inicial**
> Sunday. Laura, 42, dark wavy hair loosely tied, camel trench coat, holding a paper bakery package, opens the front door of a Buenos Aires PH and steps into a long narrow hallway with patterned cement tiles in faded red and cream and potted plants along the wall. Shot from inside the hallway toward the door, morning light behind her. 40mm lens. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, soft natural light, muted warm palette of faded olive green, ochre, cream and coffee brown, subtle film grain, gentle halation, shallow depth of field, realistic skin texture. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same hallway, closer on Laura: she has stopped mid-step, eyes glistening with tears, lips closed, surprised and moved, as if she smelled something from her childhood.

**Video**
> Slow dolly backward in a long tiled hallway. A woman in a camel coat walks in, then suddenly stops: the smell of fresh coffee reaches her. Her eyes fill with tears without fully understanding why; mouth closed, a slow breath. Subtle, real performance. Cinematic realism, film grain. Audio: keys, the door closing, footsteps on cement tiles that stop, a soft breath; no music, no dialogue.

### TOMA 17 — "Vení, que se enfría" (2:12) · [REF-LAURA, REF-ROBERTO, REF-COCINA, REF-CAFETERA]
**Imagen inicial**
> Wide shot from the kitchen doorway, from behind Laura's shoulder (camel coat): at the far end, Roberto, 72, sits at the formica table with two white cups of espresso with crema in front of him, looking down at the cups, the black espresso machine on the counter behind him. Warm golden light floods the kitchen. 35mm lens. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, soft natural window light from camera left, warm palette of ochre, olive green, cream and coffee brown, subtle film grain, gentle halation, shallow depth of field, contemporary Argentine auteur cinema. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same scene. Laura has taken off her coat and is pulling out the chair opposite him; he gently pushes one of the cups toward her side of the table.

**Video**
> Static wide shot from the doorway over a woman's shoulder. Her elderly father, seated far away at the kitchen table, looks down at two cups of espresso and gently slides one toward the empty chair. She walks in and pulls out the chair. Faces small in frame, no clear lip movement. Warm golden light. Audio: chair scraping on tiles, cup sliding on formica, room tone; no music, no dialogue, no voices.

### TOMA 18 — La frase (2:20) · [REF-LAURA, REF-ROBERTO, REF-COCINA]
**Imagen inicial**
> Close-up of Laura's face, 42, dark wavy hair loosely tied, cream knit sweater, seated at the kitchen table, holding a white espresso cup with both hands, listening, eyes wet; in the blurred foreground, the back of Roberto's white-haired head and shoulder in a navy cardigan. Warm golden light. 85mm lens. Cinematic film still, 16:9, shot on ARRI Alexa Mini LF with Cooke S4 lenses, Kodak Vision3 250D film emulation, soft natural window light from camera left, warm palette, subtle film grain, gentle halation, shallow depth of field, realistic skin texture, contemporary Argentine auteur cinema. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same close-up. A single tear runs down Laura's cheek; she smiles softly with her lips closed.

**Video**
> Static close-up on a woman's face as she listens to her father (seen only as the out-of-focus back of his head in the foreground). Her eyes fill, a single tear falls, and a small closed-lip smile appears. She does not speak. Deeply restrained emotion. Cinematic realism, film grain. Audio: room tone only, a spoon resting on a saucer; no music, no dialogue, no voices.

### TOMA 19 — Las manos (2:25) · [REF-LAURA, REF-ROBERTO]
**Imagen inicial**
> Top-down close-up on a cream formica table: two white espresso cups with crema, the weathered hand of an old man in a navy cardigan sleeve resting near his cup, and a woman's hand in a cream knit sleeve moving toward it. Warm golden light. 50mm lens. Cinematic film still, 16:9, Kodak Vision3 250D film emulation, warm palette of ochre, cream and coffee brown, subtle film grain, gentle halation, shallow depth of field. No text, no logos, no watermarks.

**Imagen final (editar la inicial)**
> Same framing. Her hand now rests on top of his; his fingers slowly turn to hold hers.

**Video**
> Static top-down close-up. A daughter's hand slowly reaches across the kitchen table and rests on her elderly father's weathered hand; after a beat his fingers turn and hold hers. Two cups of espresso steam gently beside them. Final image, tender and quiet. Audio: room tone, faint steam; no music, no voices.

### CIERRE (2:27) — lo armo yo en edición
Negro + "Café en tu Casa" en blanco, chico, centrado. No hace falta generarlo en Flow.

---

## Voces (ElevenLabs, modelo eleven_v4)

| # | Personaje | Voz ElevenLabs | Texto (con etiquetas de dirección) | Archivo |
|---|---|---|---|---|
| 1 | Marta (recuerdo) | Martina – Warm and Easygoing | `[laughs softly] [warmly] No toques, que te vas a quemar.` | `voces/01-marta-no-toques-a/b.mp3` |
| 2 | Laura | Agustina – Poised and Personable | `[softly] ¿Seguís tomando esto, pa?` | `voces/02-laura-seguis-tomando-a/b.mp3` |
| 3 | Roberto | Octavio – Calm Narrator | `[elderly voice] [tired] Para mí solo... ¿para qué voy a hacer otra cosa?` | `voces/03-roberto-para-mi-solo-a/b.mp3` |
| 4 | Roberto | Octavio – Calm Narrator | `[elderly voice] [softly] No hacía falta, hija.` | **FALTA** (ElevenLabs bloqueó la cuenta gratuita) |
| 5 | Laura | Agustina – Poised and Personable | `[warmly] [softly] Ya sé.` | `voces/05-laura-ya-se-a/b.mp3` |
| 6 | Roberto | Octavio – Calm Narrator | `[elderly voice] [warmly] Vení, que se enfría.` | `voces/06-roberto-veni-a.mp3` |
| 7 | Roberto | Octavio – Calm Narrator | `[elderly voice] [softly] [trembling voice] Tu mamá decía... [pause] que el café se hace para alguien.` | `voces/07-roberto-tu-mama-decia-a/b.mp3` |

Ubicación en el montaje: 1 → toma 06 · 2 y 3 → toma 08 · 4 y 5 → toma 09 · 6 → toma 17 · 7 → toma 18.

## Sonido y música

- **Molinillo de manivela y molienda de la máquina:** lo ideal es grabarlos de verdad con el celular, bien cerca y en una habitación silenciosa. Es el sonido que sostiene toda la historia.
- **Música:** guitarra criolla sola, un arpegio simple, entra recién en la toma 14. Tiene que ser original o libre de derechos.
