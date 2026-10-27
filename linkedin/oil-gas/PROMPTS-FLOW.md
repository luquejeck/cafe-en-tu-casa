# Prompts para Google Flow · carrusel IA en Oil & Gas

Una imagen por placa. Generá 4 variantes de cada una y elegí la mejor.
Guardalas como `linkedin/oil-gas/imagenes/01.jpg`, `02.jpg`… (sirve también .png o .webp)
y corré `node linkedin/oil-gas/generar.js`: el carrusel las toma solo.

## El estilo que se repite en todas

Está incluido en cada prompt, para que las 8 fotos se vean de la misma serie:

> photorealistic editorial photography, Patagonian landscape of Argentina, soft natural light,
> muted earthy palette with warm orange accents, calm and premium, shallow depth of field,
> shot on 35mm, no text, no logos, no brand names

**Formato:**
- Placas 01 y 09 (portada y cierre, foto a pantalla completa): **vertical 9:16**.
- Placas 02 a 07 (foto en recuadro): **horizontal 16:9**. Se recorta un poco a los costados, así que dejá lo importante en el centro.

**Tip:** si una persona sale con un logo o una cara rara en el casco o la ropa, pedí "plain unbranded workwear". Y si sale texto en pantallas, "screens with abstract charts only, no readable text".

---

### 01 · Portada (vertical 9:16)
```
Wide cinematic view of an oil field in the Patagonian desert of Argentina at dawn, rows of pumpjacks silhouetted against a soft orange and blue sky, long gentle shadows, vast flat land, a thin layer of mist, faint glowing data lines subtly flowing between the pumpjacks like an invisible network, photorealistic editorial photography, muted earthy palette with warm orange accents, calm and premium, shot on 35mm, lots of empty sky at the top and empty ground at the bottom for text, no text, no logos, no brand names
```

### 02 · Los datos (horizontal 16:9)
```
Modern oil and gas operations control room with large screens showing abstract time series charts and maps, soft daylight from large windows overlooking a Patagonian desert oil field, an engineer seen from behind looking at the screens, clean minimal interior, photorealistic editorial photography, muted earthy palette with warm orange accents, calm and premium, shallow depth of field, shot on 35mm, screens with abstract charts only, no readable text, no logos
```

### 03 · Mantenimiento (horizontal 16:9)
```
Close-up of an industrial pump and compressor skid at an oil field in Patagonia, a maintenance technician in plain unbranded orange coveralls and white helmet placing a small wireless vibration sensor on the pump, warm late afternoon side light, metal textures and bolts in sharp detail, background softly blurred, photorealistic editorial photography, muted earthy palette with warm orange accents, calm and premium, shallow depth of field, shot on 35mm, no text, no logos, no brand names
```

### 04 · Producción (horizontal 16:9)
```
A long row of pumpjacks working in the Patagonian desert of Argentina at golden hour, each wellhead with a small sensor light glowing softly, dramatic but calm sky, wide composition with the row receding to the horizon, photorealistic editorial photography, muted earthy palette with warm orange accents, calm and premium, shot on 35mm, no text, no logos, no brand names
```

### 05 · Perforación y reservorio (horizontal 16:9)
```
A drilling rig standing in the Patagonian desert at blue hour, lights on, viewed from a distance, with a subtle translucent visualization of underground rock layers and well paths beneath the ground, like a clean geological cross-section blending into the photo, photorealistic editorial photography with a minimal data visualization overlay, muted earthy palette with warm orange accents, calm and premium, shot on 35mm, no text, no logos, no brand names
```

### 06 · Seguridad y emisiones (horizontal 16:9)
```
A small inspection drone hovering over an oil and gas processing facility in Patagonia, a field operator in plain unbranded workwear and white helmet watching it from the ground holding a tablet, clear morning light, pipes and tanks in the background, sense of safety and control, photorealistic editorial photography, muted earthy palette with warm orange accents, calm and premium, shallow depth of field, shot on 35mm, no readable text on the tablet, no logos, no brand names
```

### 07 · Conocimiento (horizontal 16:9)
```
An experienced senior field operator in his sixties with a grey beard and a young female engineer in plain unbranded workwear and white helmets, standing next to a wellhead in Patagonia, he is explaining something pointing at the equipment while she looks at a tablet, warm afternoon light, genuine moment of mentoring, photorealistic editorial photography, muted earthy palette with warm orange accents, calm and premium, shallow depth of field, shot on 35mm, no readable text on the tablet, no logos, no brand names
```

### 09 · Cierre (vertical 9:16)
```
Silhouette of a single field engineer in a helmet standing on a small hill looking over a Patagonian oil field at sunset, pumpjacks and facility lights in the distance, warm orange sky fading to deep blue, peaceful and reflective mood, photorealistic editorial photography, muted earthy palette with warm orange accents, calm and premium, shot on 35mm, lots of empty sky at the top and darker ground at the bottom for text, no text, no logos, no brand names
```

La placa 08 (mi opinión) va sin foto, a propósito: es la placa de la idea.
