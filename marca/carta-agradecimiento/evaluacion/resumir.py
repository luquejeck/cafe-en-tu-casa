"""Junta las respuestas del panel simulado, deshace el ciego y promedia por variante.
   python3 resumir.py <carpeta con evaluador-N.json y mapa.json>"""
import json, sys, glob, os, statistics as st
d = sys.argv[1]
mapa = json.load(open(os.path.join(d, "mapa.json")))
met = ["lee_hasta_el_final_0a100", "escanea_qr_opinion_0a100", "deja_opinion_ml_0a100", "sigue_instagram_0a100",
       "recuerda_marca_en_una_semana_0a100", "atractivo_visual_1a10", "claridad_del_pedido_1a10"]
por = {v: {m: [] for m in met} for v in range(1, 6)}
puestos = {v: [] for v in range(1, 6)}
notas = {v: [] for v in range(1, 6)}
for f in sorted(glob.glob(os.path.join(d, "evaluador-*.json"))):
    r = json.load(open(f)); e = str(r["evaluador"]); m = mapa[e]
    for letra, c in r["cartas"].items():
        v = m[letra]
        for k in met: por[v][k].append(c[k])
        notas[v].append((e, c.get("frase_que_mas_engancha", ""), c.get("lo_que_frena", ""), c.get("una_mejora", "")))
    for i, letra in enumerate(r["ranking_de_mejor_a_peor_para_conseguir_opiniones"]):
        puestos[m[letra]].append(i + 1)
res = []
for v in range(1, 6):
    fila = {"variante": v, "n": len(por[v][met[0]])}
    for k in met: fila[k] = round(st.mean(por[v][k]), 1) if por[v][k] else None
    fila["puesto_promedio"] = round(st.mean(puestos[v]), 2) if puestos[v] else None
    fila["veces_primera"] = puestos[v].count(1)
    res.append(fila)
json.dump({"resumen": res, "notas": notas}, open(os.path.join(d, "resultado.json"), "w"), ensure_ascii=False, indent=1)
for f in sorted(res, key=lambda x: -x["deja_opinion_ml_0a100"]): print(f)
