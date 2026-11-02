"""Alarga las escenas cortas metiendo silencio en la voz, para que ninguna imagen pase en menos de MIN segundos.

Uso:  python3 instagram/cocina/pausas.py voz-facundo.mp3 voz-final.wav
Lee golpes.js y palabras.json (tiempos de la voz original), corta la voz en el comienzo de cada golpe,
agrega silencio al final de los golpes cortos, reescribe palabras.json con los tiempos nuevos y deja la voz armada.
Después hay que volver a correr armar.py.
"""
import json, re, subprocess, sys, os
AQUI = os.path.dirname(os.path.abspath(__file__)); MIN = 1.75
ent, sal = sys.argv[1:3]
js = open(os.path.join(AQUI, 'golpes.js'), encoding='utf-8').read()
G = json.loads(re.search(r'const GOLPES = (\[.*?\]);', js).group(1))
P = json.load(open(os.path.join(AQUI, 'palabras.json'), encoding='utf-8'))
cortes = [g['t0'] for g in G[1:]]
pads = [round(max(0, MIN - g['d']), 3) for g in G]
partes, filtros, t_prev = [], [], 0.0
for k, g in enumerate(G):
    t_fin = cortes[k] if k < len(cortes) else None
    trim = f"atrim=start={t_prev}" + (f":end={t_fin}" if t_fin else "") + ",asetpts=PTS-STARTPTS"
    pad = f",apad=pad_dur={pads[k]}" if pads[k] > 0 else ""
    filtros.append(f"[0:a]{trim}{pad}[p{k}]"); partes.append(f"[p{k}]")
    t_prev = t_fin
filtro = ";".join(filtros) + ";" + "".join(partes) + f"concat=n={len(G)}:v=0:a=1[o]"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", ent, "-filter_complex", filtro, "-map", "[o]", "-ar", "44100", sal], check=True)
# correr las palabras: cada una se mueve lo que suman los silencios de los golpes anteriores
nuevo = []
for w in P:
    k = sum(1 for c in cortes if w['start'] >= c - 1e-6)
    extra = sum(pads[:k])
    nuevo.append({'text': w['text'], 'start': round(w['start'] + extra, 3), 'end': round(w['end'] + extra, 3)})
json.dump(nuevo, open(os.path.join(AQUI, 'palabras.json'), 'w', encoding='utf-8'), ensure_ascii=False)
print('silencio agregado', round(sum(pads), 2), 's en', sum(1 for p in pads if p), 'escenas')
