"""Sonido del reel "El grupo de la familia": todo sintetizado acá, sin derechos de terceros.
Lee los tiempos de chat.json y escribe:
  sfx.wav     -> voces + efectos, sin música. Para sumar un audio en Edits.
  mezcla.wav  -> voces + efectos + base musical propia (piano eléctrico cálido, 76 bpm), que baja cuando alguien habla.
Las voces (ElevenLabs, acento argentino) están en voces/; si falta alguna, se avisa y se sigue sin ella.
Uso: python3 -I edit/grupo-familia/sonido.py
"""
import json, os, subprocess, wave
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

# Voces: cada mensaje con "voz": [archivo, segundo]. Se recorta el silencio del principio.
def leer_voz(ruta):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", ruta, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
    umbral = 10 ** (-40 / 20)
    i = int(np.argmax(np.abs(x) > umbral))
    x = x[max(0, i - int(0.02 * SR)):]
    return x / (np.abs(x).max() + 1e-9) * 10 ** (-4 / 20)

voces = np.zeros(N)
faltan = []
for m in chat["mensajes"]:
    if "voz" not in m:
        continue
    archivo, at = m["voz"]
    ruta = os.path.join(AQUI, "voces", archivo)
    if not os.path.exists(ruta):
        faltan.append(archivo)
        continue
    poner(voces, leer_voz(ruta), at)
if faltan:
    print("Faltan voces:", ", ".join(faltan))
# Con voces los pops van más bajos para no competir
sfx *= 0.55

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
# «¿Qué?» de Mamá: golpe grave profundo y largo (cine, no caricatura) + un aire que se abre
que = chat["que"]["t"]
poner(sfx, tono(70, 38, 1.2, d=0.45), que, 0.8)
n = int(SR * 0.6)
aire = np.convolve(rng.standard_normal(n), np.ones(40) / 40, "same") * np.sin(np.linspace(0, np.pi, n)) ** 2
poner(sfx, aire, que - 0.12, 0.35)
# Foto a pantalla completa: un aire que se abre al expandirse y otro más corto al volver
h = chat["hero"]
for at, dur, g in [(h["t"] - 0.05, 0.8, 0.4), (h["fin"] - 0.45, 0.5, 0.25)]:
    n = int(SR * dur)
    a = np.convolve(rng.standard_normal(n), np.ones(50) / 50, "same") * np.sin(np.linspace(0, np.pi, n)) ** 2
    poner(sfx, a, at, g)
for nota in h["notas"]:  # tic de vidrio en cada nota
    poner(sfx, tono(2093, 2093, 0.3, d=0.06) + 0.4 * tono(3136, 3136, 0.3, d=0.04), nota["t"], 0.12)
# Tarjeta final: acorde brillante y suave
fin = chat["final"]["t"]
for j, nota in enumerate([72, 76, 79, 84]):
    poner(sfx, tono(440 * 2 ** ((nota - 69) / 12), 440 * 2 ** ((nota - 69) / 12), 1.6, d=0.6, forma="arm"), fin + 0.1 + j * 0.04, 0.12)
# Cierre: la hoja sube con un aire suave
n = int(SR * 0.6)
w = np.convolve(rng.standard_normal(n), np.ones(40) / 40, "same") * np.sin(np.linspace(0, np.pi, n)) ** 2
poner(sfx, w, chat["cierre"]["t"] - 0.1, 0.45)

# Base: piano eléctrico cálido, 76 bpm, acordes de cuatro notas (Cmaj9 – Am9 – Fmaj7 – G6), ataque suave
hz = lambda nota: 440 * 2 ** ((nota - 69) / 12)
def epiano(f, dur):
    nn = int(SR * dur)
    tt = np.arange(nn) / SR
    w = np.sin(2 * np.pi * f * tt) + 0.18 * np.sin(2 * np.pi * 2 * f * tt) + 0.05 * np.sin(2 * np.pi * 3 * f * tt)
    trem = 1 + 0.08 * np.sin(2 * np.pi * 4.2 * tt)
    return w * trem * np.minimum(1, tt / 0.03) * np.exp(-tt / 1.4)
BPM = 76
compas = 4 * 60 / BPM
acordes = [[48, 64, 67, 71, 74], [45, 60, 64, 67, 71], [41, 57, 60, 64, 69], [43, 59, 62, 64, 67]]
mus = np.zeros(N)
k = 0
t = 0.0
while t < DUR:
    ac = acordes[k % 4]
    for j, nota in enumerate(ac):
        poner(mus, epiano(hz(nota), compas + 0.6), t + j * 0.018, 0.9 if j == 0 else 0.45)
    # una nota suelta arriba a mitad del compás
    poner(mus, epiano(hz(ac[-1] + 12), compas / 2 + 0.6), t + compas / 2, 0.22)
    k += 1
    t += compas
# Se apaga bajo el «¿Qué?» (silencio dramático) y vuelve después
tt = np.arange(N) / SR
hueco = 1 - 0.85 * np.clip(1 - np.abs(tt - (que + 0.3)) / 0.45, 0, 1)
mus *= np.clip(tt / 0.4, 0, 1) * np.clip((DUR - tt) / 0.8, 0, 1) * hueco


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


# Ducking: la música baja ~9 dB mientras alguien habla
nivel = np.convolve(np.abs(voces), np.ones(int(0.05 * SR)) / int(0.05 * SR), "same")
habla = np.clip(nivel / 0.02, 0, 1)
k = int(0.25 * SR)
habla = np.convolve(habla, np.ones(k) / k, "same")
duck = 1 - 0.65 * np.clip(habla, 0, 1)

sfx = normal(sfx, -9) + voces
guardar("sfx.wav", normal(sfx, -1.5))
guardar("mezcla.wav", normal(sfx + normal(mus, -15) * duck, -1.5))
print("ok", DUR, "s")
