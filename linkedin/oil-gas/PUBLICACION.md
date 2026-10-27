# LinkedIn · IA en Oil & Gas

Publicación de opinión personal (no de Café en tu Casa ni de la empresa).
Estilo "documento técnico" pensado para gente de ingeniería y de IA: diagramas de flujo de cada caso, técnicas con su nombre, monoespaciada y un solo color de acento.

- **Carrusel:** `ia-en-oil-and-gas.pdf` (9 placas de 1080×1350, también sueltas en `placas/`).
  Se sube con *Agregar documento*; título sugerido: "Cómo la IA va a cambiar Oil & Gas".
- **Para rehacerlo** después de editar `carrusel.html`: `node linkedin/oil-gas/generar.js`.

| Placa | Tema | Diseño |
|---|---|---|
| 1 | Cómo trabajamos hoy. Cómo vamos a trabajar mañana. | Foto arriba a sangre, título abajo |
| 2 | Más datos que nunca; menos del 1% llega a quien decide | Solo tipografía, cifra gigante y foto redonda |
| 3 | Problema 01 · Paradas no planificadas (US$ 38 M/año) | Pantalla partida vertical |
| 4 | Problema 02 · Datos dispersos que nadie cruza | Foto ancha arriba, hoy/mañana lado a lado |
| 5 | Problema 03 · Horas en tareas que no agregan valor | Foto recuadrada al medio |
| 6 | Problema 04 · El conocimiento que se jubila | Foto a sangre con tarjeta encima |
| 7 | Eficiencia y eficacia | Solo tipografía, fondo arena |
| 8 | Cuatro pasos para usar la IA y tener mejores resultados | Collage de tres fotos + pasos |
| 9 | Hoy y mañana, en una sola placa | Tabla para guardar |
| 10 | ¿Cuál de estos problemas resolverías primero? | Foto a sangre con la pregunta |

**Cifras y fuentes** (verificadas):
- Menos del 1% de los datos de una plataforma offshore llega a quien decide: McKinsey & Company
  ([PDF](https://www.mckinsey.com.br/~/media/McKinsey/Industries/Oil%20and%20Gas/Our%20Insights/Why%20oil%20and%20gas%20companies%20must%20act%20on%20analytics/Why-oil-and-gas-companies-must-act-on-analytics.pdf), [CNBC](https://www.cnbc.com/2015/03/05/us-energy-industry-collects-a-lot-of-operational-data-but-doesnt-use-it.html)).
- US$ 38 M por año de impacto promedio de las paradas no planificadas en operadores offshore, y 36% menos paradas
  con mantenimiento predictivo: Kimberlite, 2016 ([estudio citado por GE](https://nisusacorp.com/sites/default/files/2017-12/impact-of-digital-on-unplanned-downtime-study.pdf)).
  Son cifras de hace unos años: sirven como orden de magnitud.

Los gráficos y las fotos son ilustrativos (generados con Google Flow): no muestran ninguna operación real.

## Texto

```
Trabajo en Oil & Gas y cada vez me convenzo más de algo: el próximo gran salto del rubro no va a venir de un equipo nuevo. Va a venir de cómo usamos lo que ya tenemos.

Hoy generamos más datos que nunca. Pero según McKinsey, menos del 1% de los datos de una plataforma offshore llega a quien toma las decisiones. Seguimos decidiendo con el reporte de ayer.

Veo cuatro problemas que se repiten en casi cualquier operación:

Paradas no planificadas. Hoy, el equipo falla y recién ahí actuamos. Mañana, un modelo detecta el desvío días antes y la intervención se planifica. Un estudio de Kimberlite estimó en US$ 38 millones por año el impacto promedio de estas paradas en operadores offshore, y 36% menos paradas en quienes trabajan con mantenimiento predictivo.

Datos dispersos. Hoy la información vive en el SCADA, en planillas, en mails y en reportes que nadie cruza. Mañana, todo en una sola vista, con alertas cuando algo se desvía.

Tareas manuales. Hoy se van horas armando reportes, cargando datos y buscando información. Mañana, la IA arma el borrador y las personas usan ese tiempo para analizar y decidir.

Conocimiento que se pierde. Hoy, cuando alguien con treinta años de campo se retira, se va con lo que sabe. Mañana, sus lecciones e historiales quedan y se pueden consultar con una pregunta.

En el fondo, se trata de dos cosas: ser más eficientes (hacer lo mismo con menos horas, menos paradas, menos costo) y más eficaces (decidir mejor dónde intervenir y qué priorizar).

¿Cómo se empieza? Por lo que veo, con cuatro pasos:
1. Elegir un problema que duela y se pueda medir.
2. Ordenar los datos de ese problema, no los de toda la empresa.
3. Sumar a la gente de campo desde el primer día.
4. Probar en chico, medir, y recién ahí escalar.

La tecnología ya está. Lo que va a marcar la diferencia es cómo la aplicamos.

¿Cuál de estos cuatro problemas resolverías primero en tu operación? Te leo en los comentarios.

#OilAndGas #InteligenciaArtificial #Energía #TransformaciónDigital #Eficiencia
```
