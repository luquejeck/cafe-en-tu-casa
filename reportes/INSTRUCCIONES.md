# Reporte semanal de Instagram — instructivo del agente

Este archivo describe la rutina que corre **todos los lunes a las 8:47 (hora de Buenos Aires)**
y manda por mail un reporte con las métricas de la semana anterior y qué mejorar.

## Datos de la cuenta

| Dato | Valor |
|---|---|
| Marca en Metricool | `luquejeck` — brandId `7276711` |
| Instagram | `@cafentucasa` |
| Zona horaria | `America/Buenos_Aires` |
| Destino del reporte | lucasjeckeln@gmail.com |
| Asunto del mail | `Reporte semanal Instagram · Café en tu Casa · <rango de fechas>` |

## Qué mide (Metricool → `getAnalyticsDataByMetrics`)

Ventana: **lunes a domingo de la semana anterior**. Para comparar, la semana previa a esa.

- **Cuenta** (evolution): `IGEV01` seguidores, `IGEV43` ganados, `IGEV44` perdidos,
  `IGEV05` vistas, `IGEV06` alcance, `IGEV42` cuentas que interactuaron, `IGEV37` publicaciones.
- **Reels** (reels): `IGRE02` fecha, `IGRE03` texto, `IGRE06` url, `IGRE23` vistas, `IGRE11` alcance,
  `IGRE10` likes, `IGRE07` comentarios, `IGRE12` guardados, `IGRE21` compartidos,
  `IGRE24` tiempo medio de visualización, `IGRE08` engagement.
- **Posts/carruseles** (posts): `IGPO02`, `IGPO03`, `IGPO06`, `IGPO07`, `IGPO28` vistas, `IGPO14` alcance,
  `IGPO13`, `IGPO08`, `IGPO15`, `IGPO27`, `IGPO29` seguidores ganados por el post, `IGPO10`.
- **Historias** (stories): `IGST02`, `IGST10` alcance, `IGST08` salidas, `IGST11` respuestas,
  `IGST12` taps atrás, `IGST13` taps adelante.
- **Audiencia**: `IGAG01..03` edad/género, `IGDC01..02` ciudades.
- **Mejor horario**: `getBestTimeToPostByNetwork` (instagram) para la semana que viene.
- **Calendario**: `getScheduledPosts` de los próximos 7–14 días.

## Cómo interpretar

- **Alcance / seguidores**: <10% es bajo, 10–30% normal, >30% el contenido está saliendo a no seguidores.
- **Guardados y compartidos** pesan más que los likes para que Instagram reparta el contenido.
  Cero guardados y cero compartidos = el contenido no se está distribuyendo.
- **Tiempo medio de reel**: compararlo con la duración. Si se van antes de la mitad, el gancho
  de los primeros 1–2 segundos no alcanza o el dato importante está muy al final.
- **Historias**: salidas y taps adelante altos = la historia no retiene; respuestas = conversación.
- Comparar cada pieza contra el promedio de su formato, no contra todas.
- Con pocas publicaciones, decirlo: son señales, no conclusiones.

## Estructura del mail

1. Resumen en 3 líneas (lo más importante de la semana).
2. Números de la cuenta vs semana anterior.
3. Tabla pieza por pieza (reels, carruseles, historias) con la mejor y la peor.
4. Audiencia y horarios.
5. **Qué mejorar** — 3 a 5 acciones concretas, ordenadas por impacto.
6. Revisión del calendario de la semana que viene (choques de horario, temas repetidos,
   fechas comerciales que se acercan).
7. Seguimiento: qué se recomendó la semana pasada y si se aplicó.

El agente **no modifica** publicaciones programadas: solo recomienda.

## Memoria entre semanas

Antes de escribir, el agente busca en Gmail los reportes anteriores
(`subject:"Reporte semanal Instagram"`) y los usa para comparar números y seguir las
recomendaciones previas.
