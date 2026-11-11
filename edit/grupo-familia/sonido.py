"""Sonido del reel "El grupo de la familia": todo sintetizado acá, sin derechos de terceros.
Lee los tiempos de chat.json y escribe:
  sfx.wav     -> solo efectos (pops de mensajes, tipeo, golpe en el QUÉ, whoosh del cierre). Para sumar música en Edits.
  mezcla.wav  -> efectos + base musical propia (marimba liviana, 112 bpm), bien abajo.
Uso: python3 -I edit/grupo-familia/sonido.py
"""
import json, os, wave
import numpy as np

SR = 48000
AQUI = os.path.dirname(os.path.abspath(__file__))
chat = json.load(open(os.path.join(AQUI, "chat.json"), encoding="utf-8"))
DUR = chat["duracion"]
N = int(SR * DUR)
rng = np.random.default_rng(7)


def env(n, a=0.003, d=0.12):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)


def tono(f0, f1, dur, d=0.08, forma="sin"):
    n = int(SR * dur)
    f = np.linspace(f0, f1, n)
    ph = 2 * np.pi * np.cumsum(f) / SR
    w = np.sin(ph) if forma == "sin" else np.sin(ph) + 0.25 * np.sin(2 * ph)
    return w * env(n, d=d)


def poner(buf, x, t, g=1.0):
    i = int(t * SR)
    if i >= len(buf):
        return
    x = x[: len(buf) - i]
    buf[i : i + len(x)] += g * x


sfx = np.zeros(N)
for m in chat["mensajes"]:
    t = m["t"]
    if m.get("instant"):
        t = 0.02
    if m.get("sistema"):  # campanita suave
        poner(sfx, tono(1320, 1320, 0.5, d=0.18) + 0.5 * tono(1980, 1980, 0.5, d=0.12), t, 0.22)
        continue
    if m.get("escribe"):  # tipeo: clics cortos de ruido filtrado
        t0 = t - m["escribe"]
        for k in np.arange(t0, t - 0.05, 0.075):
            n = int(SR * 0.018)
            c = rng.standard_normal(n) * env(n, a=0.0005, d=0.004)
            poner(sfx, np.convolve(c, np.ones(6) / 6, "same"), k + rng.uniform(-0.01, 0.01), 0.35)
    if m.get("de") == "Vos":  # enviado: "fiu" hacia arriba
        poner(sfx, tono(520, 1250, 0.13, d=0.05), t, 0.4)
    else:  # recibido: pop de dos notas
        poner(sfx, tono(880, 760, 0.09, d=0.035), t, 0.45)
        poner(sfx, tono(1175, 1100, 0.12, d=0.045), t + 0.045, 0.35)

# Reacciones: un "blup" corto y agudo
for m in chat["mensajes"]:
    for at, _ in m.get("reac", []):
        poner(sfx, tono(1400, 1900, 0.07, d=0.025), at, 0.25)
# Corazones: tres destellos
for m in chat["mensajes"]:
    if m.get("corazones"):
        for j, fr in enumerate([1568, 1976, 2349]):
            poner(sfx, tono(fr, fr, 0.4, d=0.12), m["t"] + 0.3 + j * 0.08, 0.15)
# Toque en «Familia» y check
poner(sfx, tono(300, 180, 0.05, d=0.012), chat["cierre"]["tap"], 0.6)
poner(sfx, tono(990, 1320, 0.18, d=0.07), chat["cierre"]["tap"] + 0.06, 0.3)
# Golpe grave en el «QUÉ» de Mamá
que = chat["mensajes"][1]["t"]
poner(sfx, tono(120, 45, 0.45, d=0.16), que, 0.9)
# Ráfaga en los signos del QUÉ
n = int(SR * 0.4)
r = np.convolve(rng.standard_normal(n), np.ones(12) / 12, "same") * np.exp(-np.arange(n) / SR / 0.12)
poner(sfx, r, que + 0.05, 0.6)
# Whoosh del cierre
n = int(SR * 0.5)
w = rng.standard_normal(n)
w = np.convolve(w, np.ones(30) / 30, "same") * np.sin(np.linspace(0, np.pi, n)) ** 2
poner(sfx, w, chat["cierre"]["t"] - 0.15, 0.9)
poner(sfx, tono(660, 990, 0.5, d=0.25, forma="arm"), chat["cierre"]["t"], 0.25)

# Base: marimba en Do mayor, 112 bpm, I–vi–IV–V
BPM = 112
paso = 60 / BPM / 2  # corcheas
acordes = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]]
patron = [0, 2, 1, 2, 0, 2, 1, 2]
mus = np.zeros(N)
hz = lambda nota: 440 * 2 ** ((nota - 69) / 12)
k = 0
t = 0.0
while t < DUR:
    ac = acordes[(k // 8) % 4]
    nota = ac[patron[k % 8]] + 12
    poner(mus, tono(hz(nota), hz(nota), 0.35, d=0.11, forma="arm"), t, 0.5)
    if k % 8 == 0:  # bajo
        poner(mus, tono(hz(ac[0] - 24), hz(ac[0] - 24), 0.8, d=0.3), t, 0.7)
    if k % 2 == 1:  # shaker
        nn = int(SR * 0.04)
        poner(mus, np.diff(rng.standard_normal(nn + 1)) * env(nn, a=0.002, d=0.01), t, 0.12)
    k += 1
    t += paso
# Entra con un fundido corto, se apaga en el cierre y deja solo el remate
tt = np.arange(N) / SR
mus *= np.clip(tt / 0.3, 0, 1) * np.clip((DUR - tt) / 0.6, 0, 1)


def normal(x, pico_db):
    return x / (np.abs(x).max() + 1e-9) * 10 ** (pico_db / 20)


def guardar(nombre, x):
    x = np.clip(x, -1, 1)
    est = (np.stack([x, x], 1) * 32767).astype(np.int16)
    with wave.open(os.path.join(AQUI, nombre), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(est.tobytes())


sfx = normal(sfx, -3)
guardar("sfx.wav", sfx)
guardar("mezcla.wav", normal(sfx + normal(mus, -14), -1.5))
print("ok", DUR, "s")
