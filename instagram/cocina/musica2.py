"""Música del montaje 2 (lo-fi con acentos en cada corte), con el sintetizador del kit kinetic-cut-video.

Uso:  PYTHONPATH=<kit>/scripts python3 instagram/cocina/musica2.py salida.wav
Los cortes salen de golpes.js (más GANCHO segundos, igual que montaje2.html).
"""
import json, re, sys, os
from audio_lib import Mix, chord, note as n

AQUI = os.path.dirname(os.path.abspath(__file__))
GANCHO = 1.2
js = open(os.path.join(AQUI, 'golpes.js'), encoding='utf-8').read()
G = json.loads(re.search(r'const GOLPES = (\[.*?\]);', js).group(1))
DUR = GANCHO + float(re.search(r'DURACION = ([\d.]+)', js).group(1)) + .4
t = {g['id']: g['t0'] + GANCHO for g in G}
BPM = 96
m = Mix(duration=DUR, bpm=BPM)
m.vinyl(0, DUR, .018)
# gancho: subida y golpe cuando arranca la voz
m.riser(GANCHO, 1.1, .1); m.boom(GANCHO, .26)
# base lo-fi: acordes pulsados con swing; se corta antes de la caja para el silencio del remate
acordes = ['Am9', 'Fmaj7', 'Cmaj9', 'G6']
fin_base = t['caja'] - .35
compas = 60 / BPM * 4
k, c0 = 0, GANCHO
while c0 < DUR:
    if not (fin_base <= c0 < t['caja'] + .6):
        m.chord_hit(c0, chord(acordes[k % 4], 3), voice='piano', amp=.05, dur=compas * .95)
    k += 1; c0 += compas
m.beat(GANCHO, fin_base, n(-15), kick=.13, bass=.06, hat=.014, snare=.035, swing=.18, pattern='four')
m.beat(t['caja'] + 1.0, DUR - .2, n(-15), kick=.11, bass=.05, hat=.012, snare=.03, swing=.18, pattern='four')
# acento en cada corte (más fuerte en las soluciones)
for g in G:
    tc = g['t0'] + GANCHO
    if g['tipo'] == 'solucion': m.clap(tc, .05); m.pluck(tc, n(7 + (len(g['id']) % 5)), .07, .8)
    else: m.tick(tc, .03)
# las siete: whoosh largo; la caja: golpe grande y campanita
m.whoosh(t['caja'], .9, .12); m.boom(t['caja'], .34); m.bell(t['caja'] + .2, n(19), .1, 1.6)
m.render(sys.argv[1], rms=.12)
print('música', round(DUR, 2), 's')
