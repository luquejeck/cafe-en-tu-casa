import html, sys
prompt = open(sys.argv[1], encoding='utf-8').read().strip()
C = 'font-family:Arial,Helvetica,sans-serif'
def kpi(n, t, s):
    return f'<td style="width:50%;padding:10px 6px;text-align:center;background:#f5f5f7;border-radius:10px"><div style="font-size:22px;font-weight:bold;color:#1d1d1f">{n}</div><div style="font-size:12px;color:#6e6e73">{t}</div><div style="font-size:11px;color:{"#c0271c" if s.startswith("!") else "#6e6e73"}">{s.lstrip("!")}</div></td>'
filas = [
 ("Vie 9", "Reel cortado/latte", "11:30 → 10:00 + pregunta"),
 ("Dom 11", "Reel 3 pasos", "Se saca (domingo)"),
 ("Lun 12", "Reel molienda", "18:00 → 10:00"),
 ("Mar 13", "Carrusel Día de la Madre", "NUEVO · 10:00"),
 ("Mié 14", "Reel Día de la Madre", "NUEVO · reemplaza Transferencia"),
 ("Jue 15", "Carrusel pagos + Reel hábitos", "10:00 y 18:00"),
 ("Vie 16", "Reel Del grano a la taza", "Dom 18 → Vie 16, ángulo regalo"),
 ("Sáb 17", "Historia cuenta regresiva", "NUEVA · desde el celu"),
]
tabla = ''.join(f'<tr style="background:{"#f5f5f7" if i%2==0 else "#fff"}"><td style="padding:6px 8px;"><b>{d}</b></td><td style="padding:6px 8px">{p}</td><td style="padding:6px 8px;color:#455426">{c}</td></tr>' for i,(d,p,c) in enumerate(filas))
out = f'''<div style="{C};max-width:600px;margin:0 auto;color:#1d1d1f;font-size:15px;line-height:1.5">
<div style="padding:18px 4px 6px"><span style="color:#5b6e32;font-size:12px;font-weight:bold;letter-spacing:1px">● CAFÉ EN TU CASA · REPORTE SEMANAL</span>
<div style="font-size:22px;font-weight:bold;margin-top:4px">Semana del 1 al 8 de octubre</div></div>

<table style="width:100%;table-layout:fixed;border-collapse:separate;border-spacing:6px"><tr>
{kpi("817","seguidores","+0 esta semana")}{kpi("79","alcance del reel","10% de seguidores")}</tr><tr>{kpi("7 s","vieron del reel","!de ~14 s")}{kpi("0","guardados y compartidos","!sin distribución")}
</tr></table>

<div style="background:#f5f5f7;border-radius:12px;padding:14px 16px;margin:10px 0">
<b>En una línea:</b> el reel gustó (11 likes) pero nadie lo guardó ni lo compartió, y la mitad se fue antes de ver el precio. Además, el <b>domingo 18 es el Día de la Madre</b> y no tenemos nada.
</div>

<div style="font-size:17px;font-weight:bold;margin:18px 0 6px">La estrategia de la semana que viene</div>
<ol style="margin:0;padding-left:20px">
<li><b>Día de la Madre</b>: un carrusel y un reel nuevos el martes y el miércoles, y cuenta regresiva el sábado.</li>
<li><b>Reels con gancho</b>: el precio o una pregunta en el primer segundo; el dato antes del segundo 6; de 9 a 12 s.</li>
<li><b>Todo a las 10:00 de lunes a viernes.</b> El domingo descansa.</li>
<li><b>Cerrar pidiendo guardar o compartir</b>, más una pregunta en el texto.</li>
</ol>

<table style="width:100%;table-layout:fixed;border-collapse:collapse;font-size:13px;margin-top:12px"><col style="width:62px"><col><col>{tabla}</table>

<div style="font-size:17px;font-weight:bold;margin:22px 0 4px">Prompt para el Claude de contenido</div>
<div style="font-size:13px;color:#6e6e73;margin-bottom:8px">Copialo entero (también va adjunto como .txt) y pegáselo al Claude que te diseña y programa.</div>
<pre style="white-space:pre-wrap;word-wrap:break-word;background:#101012;color:#f5f5f7;border-radius:12px;padding:16px;font-size:12.5px;line-height:1.5;font-family:ui-monospace,Menlo,Consolas,monospace;margin:0">{html.escape(prompt)}</pre>

<p style="font-size:12px;color:#6e6e73;margin:16px 4px 0">Datos de Metricool al 8/10. Con una sola pieza medida, son señales: las reglas se van confirmando o corrigiendo semana a semana en reportes/APRENDIZAJES.md.</p>
</div>'''
print(out)
