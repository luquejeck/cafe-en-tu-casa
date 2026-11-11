"""Sonido del reel "El grupo de la familia".
Lee los tiempos de chat.json y escribe:
  sfx.wav     -> efectos (y voces, si hay), sin música. Para sumar un audio en Edits.
  mezcla.wav  -> efectos + base musical propia (piano eléctrico con pad, bajo y reverb, 76 bpm).
Efectos reales: sfx/*.wav, de la librería de sonidos de Remotion (remotion.media, uso libre sin atribución).
Lo demás (pops, golpe grave, música) se sintetiza acá: sin derechos de terceros.
Voces opcionales: "voz": [archivo, segundo] en un mensaje, con el archivo en voces/.
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
hz = lambda nota: 440 * 2 ** ((nota - 69) / 12)


def leer(ruta):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", ruta, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def efecto(nombre, velocidad=1.0):
    """Un efecto de sfx/, normalizado y con cambio de velocidad (y tono) opcional."""
    x = leer(os.path.join(AQUI, "sfx", nombre + ".wav"))
    if velocidad != 1.0:
        idx = np.arange(0, len(x) - 1, velocidad)
        x = np.interp(idx, np.arange(len(x)), x)
    return x / (np.abs(x).max() + 1e-9)


def poner(buf, x, t, g=1.0):
    i = int(t * SR)
    if i < 0:
        x, i = x[-i:], 0
    if i >= len(buf):
        return
    x = x[: len(buf) - i]
    buf[i : i + len(x)] += g * x


def env(n, a=0.003, d=0.12):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)


def pasabajos(x, corte):
    """Filtro pasabajos de un polo (vía FFT para que sea rápido)."""
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(np.fft.rfft(x) / (1 + 1j * f / corte), len(x))


def gota(f0=1150, f1=420, dur=0.07):
    """Pop de burbuja tipo gota: seno con caída rápida de tono, ataque suave."""
    n = int(SR * dur)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.012)
    w = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return w * np.minimum(1, t / 0.002) * np.exp(-t / 0.022)


def golpe(dur=1.4):
    """Golpe grave de cine: sub con caída de tono + cuerpo filtrado."""
    n = int(SR * dur)
    t = np.arange(n) / SR
    f = 34 + 70 * np.exp(-t / 0.08)
    out = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.5)
    m = int(SR * 0.25)
    cuerpo = pasabajos(rng.standard_normal(m), 300) * env(m, a=0.001, d=0.05)
    out[:m] += 2.5 * cuerpo / (np.abs(cuerpo).max() + 1e-9) * 0.4
    return out * np.minimum(1, t / 0.004)


def reverb(x, largo=1.8, mezcla=0.22):
    """Reverb simple por convolución con ruido que decae (FFT)."""
    n = int(SR * largo)
    t = np.arange(n) / SR
    ir = pasabajos(rng.standard_normal(n), 5000) * np.exp(-t / (largo / 6.9))
    ir /= np.sqrt((ir ** 2).sum())
    m = len(x) + n
    y = np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(ir, m), m)[: len(x)]
    return x * (1 - mezcla) + y * mezcla


# ---------------------------------------------------------------- efectos
sfx = np.zeros(N)
que = chat["que"]["t"]

for m in chat["mensajes"]:
    t = 0.02 if m.get("instant") else m["t"]
    if m.get("sistema"):  # alguien se une: ding suave y más grave
        poner(sfx, efecto("ding", 0.8), t, 0.16)
        continue
    if m.get("escribe"):  # tipeo: clics cortos, bajos y con tono variable
        for k in np.arange(t - m["escribe"], t - 0.08, 0.09):
            c = efecto("mouse-click", rng.uniform(1.3, 1.7))[: int(0.05 * SR)]
            poner(sfx, c * np.linspace(1, 0, len(c)), k + rng.uniform(-0.015, 0.015), 0.10)
    if m.get("de") == "Vos":  # enviado: whoosh corto
        poner(sfx, efecto("whoosh", 1.15), t - 0.03, 0.35)
    elif m.get("de") and abs(m["t"] - que) > 0.01:  # recibido: gota (el «¿Qué?» tiene su propio golpe)
        poner(sfx, gota(), t, 0.42)

# Reacciones: switch muy bajo y agudo
for m in chat["mensajes"]:
    for at, _ in m.get("reac", []):
        poner(sfx, efecto("switch", 1.25), at, 0.10)

# «¿Qué?»: subida (whoosh al revés, lento) que desemboca en un golpe grave
subida = efecto("whoosh", 0.45)[::-1]
poner(sfx, subida, que - len(subida) / SR + 0.02, 0.45)
poner(sfx, golpe(), que, 0.6)

# Foto a pantalla completa: whoosh lento al abrir, más corto al volver; tic en cada nota
h = chat["hero"]
poner(sfx, efecto("whoosh", 0.55), h["t"] - 0.02, 0.45)
poner(sfx, efecto("whoosh", 0.8), h["fin"] - 0.42, 0.25)
for nota in h["notas"]:
    poner(sfx, efecto("switch", 1.1), nota["t"], 0.16)

# Cierre: la hoja sube con un whoosh; toque en «Familia» y check
c = chat["cierre"]
poner(sfx, efecto("whoosh", 0.7), c["t"] - 0.05, 0.3)
poner(sfx, efecto("mouse-click"), c["tap"], 0.35)
poner(sfx, efecto("switch", 0.9), c["tap"] + 0.08, 0.2)

# Tarjeta final: ding cálido (más lento = más grave)
poner(sfx, efecto("ding", 0.75), chat["final"]["t"] + 0.1, 0.22)

sfx = reverb(sfx, largo=1.2, mezcla=0.15)

# ---------------------------------------------------------------- voces (opcionales)
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
    x = leer(ruta)
    i = int(np.argmax(np.abs(x) > 10 ** (-40 / 20)))
    x = x[max(0, i - int(0.02 * SR)):]
    poner(voces, x / (np.abs(x).max() + 1e-9) * 10 ** (-4 / 20), at)
if faltan:
    print("Faltan voces:", ", ".join(faltan))


# ---------------------------------------------------------------- música
def epiano(f, dur):
    n = int(SR * dur)
    t = np.arange(n) / SR
    w = (np.sin(2 * np.pi * f * t)
         + 0.22 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.4)
         + 0.06 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t / 0.2))
    trem = 1 + 0.07 * np.sin(2 * np.pi * 4.0 * t)
    return w * trem * np.minimum(1, t / 0.012) * np.exp(-t / 1.6)


def pad(f, dur):
    n = int(SR * dur)
    t = np.arange(n) / SR
    w = sum(np.sin(2 * np.pi * f * (1 + d) * t + p) for d, p in [(-0.004, 0), (0, 1.3), (0.005, 2.1)])
    return w / 3 * np.minimum(1, t / 0.6) * np.clip((dur - t) / 0.6, 0, 1)


BPM = 76
negra = 60 / BPM
compas = 4 * negra
acordes = [[48, 64, 67, 71, 74], [45, 60, 64, 67, 71], [41, 57, 60, 64, 69], [43, 59, 62, 65, 69]]
mus = np.zeros(N)
k = 0
t = 0.0
while t < DUR:
    ac = acordes[k % 4]
    for j, nota in enumerate(ac[1:]):  # piano: acorde apenas arpegiado
        poner(mus, epiano(hz(nota), compas + 0.8), t + j * 0.025, 0.42)
    poner(mus, epiano(hz(ac[-1] + 12), compas / 2 + 0.8), t + negra * 2.5, 0.16)
    for nota in ac[1:4]:  # pad debajo
        poner(mus, pad(hz(nota), compas + 0.6), t, 0.10)
    for at in (0, negra * 2.5):  # bajo redondo
        n = int(SR * negra * 1.4)
        tt = np.arange(n) / SR
        poner(mus, np.sin(2 * np.pi * hz(ac[0] - 12) * tt) * np.minimum(1, tt / 0.01) * np.exp(-tt / 0.6), t + at, 0.55)
    for i in range(8):  # platillo suave en corcheas, con swing leve
        n = int(SR * 0.06)
        ch = np.diff(rng.standard_normal(n + 1)) * env(n, a=0.001, d=0.018)
        poner(mus, ch, t + i * negra / 2 + (0.03 if i % 2 else 0), 0.05 if i % 2 else 0.035)
    k += 1
    t += compas
mus = reverb(mus, largo=2.4, mezcla=0.28)

tt = np.arange(N) / SR
hueco = 1 - 0.9 * np.clip(1 - np.abs(tt - (que + 0.35)) / 0.5, 0, 1)  # silencio bajo el «¿Qué?»
mus *= np.clip(tt / 0.5, 0, 1) * np.clip((DUR - tt) / 1.0, 0, 1) * hueco


# ---------------------------------------------------------------- mezcla
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
k = int(0.25 * SR)
duck = 1 - 0.65 * np.clip(np.convolve(np.clip(nivel / 0.02, 0, 1), np.ones(k) / k, "same"), 0, 1)

fx = normal(sfx, -6 if np.abs(voces).max() > 0 else -3) + voces
guardar("sfx.wav", normal(fx, -1.5))
guardar("mezcla.wav", normal(fx + normal(mus, -11) * duck, -1.5))
print("ok", DUR, "s")
