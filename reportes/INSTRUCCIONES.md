# Reporte semanal de Instagram — instructivo del agente

Corre **todos los lunes a las 8:47 (hora de Buenos Aires)**. Manda un mail corto con
las métricas de la semana anterior, la estrategia de la semana que viene y un **prompt
listo para pegarle al Claude que diseña y programa el contenido**.

## Datos de la cuenta

| Dato | Valor |
|---|---|
| Marca en Metricool | `luquejeck` — brandId `7276711` |
| Instagram | `@cafentucasa` |
| Zona horaria | `America/Buenos_Aires` |
| Destino del reporte | lucasjeckeln@gmail.com |
| Asunto | `Reporte semanal Instagram · Café en tu Casa · del dd/mm al dd/mm` |
| Contenido | `instagram/contenido.js` (carruseles, posts e historias), `instagram/videos.js` (reels), artifact "Café en tu Casa en Instagram" |
| Reglas | Manual de marca (en el artifact) + `reportes/APRENDIZAJES.md` (gana si chocan) |

## Pasos

1. **Memoria**: leer `reportes/APRENDIZAJES.md` y el último reporte en Gmail
   (`subject:"Reporte semanal Instagram"`): números de la semana anterior y qué se pidió.
2. **Métricas** de lunes a domingo (Metricool `getAnalyticsDataByMetrics`):
   - Cuenta: `IGEV01` seguidores, `IGEV43` ganados, `IGEV44` perdidos, `IGEV05` vistas, `IGEV06` alcance, `IGEV42` cuentas que interactuaron.
   - Reels: `IGRE02`, `IGRE03`, `IGRE06`, `IGRE23` vistas, `IGRE11` alcance, `IGRE10`, `IGRE07`, `IGRE12` guardados, `IGRE21` compartidos, `IGRE24` tiempo medio.
   - Posts/carruseles: `IGPO02`, `IGPO03`, `IGPO06`, `IGPO28`, `IGPO14`, `IGPO13`, `IGPO08`, `IGPO15`, `IGPO27`, `IGPO29` seguidores ganados.
   - Historias: `IGST02`, `IGST10` alcance, `IGST08` salidas, `IGST11` respuestas, `IGST13` taps adelante.
   - Audiencia (una vez por mes): `IGAG01..03`, `IGDC01..02`.
3. **Calendario**: `getScheduledPosts` de los próximos 10 días y `getBestTimeToPostByNetwork`.
   Para entender cada reel (duración, en qué segundo aparece cada cosa), mirar sus escenas en `instagram/videos.js`.
4. **Aprender**: confirmar, corregir o sumar reglas en `APRENDIZAJES.md` (señal → probado → regla).
   Comparar cada pieza contra el promedio de su formato. Con pocas piezas, decir que son señales.
5. **Mandar el mail** y **no tocar** Metricool: los cambios los aplica el Claude de contenido con el prompt.

## Formato del mail (que se lea en 1 minuto)

Modelo: `reportes/2026-10-08-prueba.html` (lo arma `reportes/armar.py`: cambiar las cifras, la línea, la estrategia y la tabla, y correr `python3 armar.py <prompt.txt> > <fecha>.html`).

1. **4 cifras** en grilla de 2×2: seguidores, alcance, tiempo de reel u otra clave, guardados+compartidos. Con ▲▼ vs semana anterior.
2. **En una línea**: qué pasó y qué es lo más urgente.
3. **La estrategia de la semana que viene**: 3 o 4 puntos, como mucho.
4. **Tabla día por día**: pieza y qué cambia (horario, reemplazo, NUEVO).
5. **Prompt para el Claude de contenido**, en un bloque oscuro y también adjunto como `.txt`. Tiene que ser autosuficiente:
   - Contexto con los números que justifican cada cambio.
   - "Leé reportes/APRENDIZAJES.md".
   - 1) Piezas nuevas (qué, para qué día, gancho, duración, cierre).
   - 2) Cambios a lo programado en Metricool, día por día.
   - 3) Cambios de fórmula para lo que viene.
   - Pedir que devuelva una tabla y que actualice el artifact.
   - Nada inventado: precios del sitio el mismo día; las fechas de entrega se confirman con Lucas.

Ejemplo de prompt: `reportes/2026-10-08-prompt.txt`.
