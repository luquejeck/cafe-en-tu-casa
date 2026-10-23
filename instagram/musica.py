"""Música de fondo para los reels: lo-fi tranquilo, generado con numpy.

Uso:  python3 instagram/musica.py <tema> <segundos> salida.wav

Todo se sintetiza acá (piano eléctrico FM, contrabajo, batería con escobillas
y ruido de vinilo), así que no hay derechos de autor de por medio y Instagram
no silencia el video. Cada tema tiene su tonalidad, tempo y progresión para
que los reels de la semana no suenen todos iguales.
"""
import sys, wave
import numpy as np

SR = 44100

TEMAS = {
    # nombre: (bpm, acordes de un compás cada uno, como listas de notas)
    "manana": (84, [["D3", "F#3", "A3", "C#4", "E4"], ["B2", "D3", "F#3", "A3", "C#4"],
                    ["E3", "G3", "B3", "D4", "F#4"], ["A2", "C#3", "G3", "B3", "E4"]]),
    "tarde":  (78, [["F3", "A3", "C4", "E4", "G4"], ["D3", "F3", "A3", "C4", "E4"],
                    ["G3", "Bb3", "D4", "F4", "A4"], ["C3", "E3", "Bb3", "D4", "G4"]]),
    "sobremesa": (88, [["Eb3", "G3", "Bb3", "D4", "F4"], ["C3", "Eb3", "G3", "Bb3", "D4"],
                       ["F3", "Ab3", "C4", "Eb4", "G4"], ["Bb2", "D3", "Ab3", "C4", "F4"]]),
}


def nota(n):
    pos = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}[n[0]]
    pos += n.count("#") - n[1:].count("b")
    return 440 * 2 ** ((pos - 9) / 12 + int(n[-1]) - 4)


def pasabajos(x, corte):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / (1 + (f / corte) ** 4), len(x))


def pasaaltos(x, corte):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / (1 + (corte / np.maximum(f, 1)) ** 4), len(x))


def rhodes(f, dur, vel=1.0):
    """Piano eléctrico: FM con el brillo que se apaga rápido y un trémolo suave."""
    t = np.arange(int(dur * SR)) / SR
    indice = 1.8 * np.exp(-t * 6) + .25
    y = np.sin(2 * np.pi * f * t + indice * np.sin(2 * np.pi * f * t))
    y += .25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 3)
    env = np.exp(-t * 1.1) * np.minimum(1, t / .008)
    env *= np.minimum(1, (dur - t) / .08).clip(0)
    return y * env * (1 + .08 * np.sin(2 * np.pi * 4.5 * t)) * vel


def bajo(f, dur):
    t = np.arange(int(dur * SR)) / SR
    y = np.tanh(1.6 * (np.sin(2 * np.pi * f * t) + .3 * np.sin(4 * np.pi * f * t)))
    return y * np.exp(-t * 2.2) * np.minimum(1, t / .01) * np.minimum(1, (dur - t) / .05).clip(0)


def bombo(rng):
    t = np.arange(int(.35 * SR)) / SR
    f = 50 + 70 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)


def escobilla(rng, dur=.22, brillo=5000):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return pasabajos(pasaaltos(rng.standard_normal(n), 1200), brillo) * np.exp(-t * 14) * np.minimum(1, t / .01)


def reverb(x, rng, segundos=1.4, mezcla=.22):
    L = int(segundos * SR)
    ir = pasabajos(rng.standard_normal(L), 3000) * np.exp(-np.arange(L) / SR * 4)
    ir /= np.sqrt((ir ** 2).sum())
    n = len(x) + L
    y = np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[:len(x)]
    return x * (1 - mezcla) + y * mezcla * 2


def poner(pista, sonido, inicio):
    i = int(inicio * SR)
    if i >= len(pista):
        return
    j = min(len(pista), i + len(sonido))
    pista[i:j] += sonido[: j - i]


def componer(tema, segundos, semilla=3):
    rng = np.random.default_rng(semilla)
    bpm, acordes = TEMAS[tema]
    negra = 60 / bpm
    compas = 4 * negra
    swing = negra * .58  # la corchea de atrás, un poco tarde
    n = int((segundos + 2) * SR)
    piano, low, bat = np.zeros(n), np.zeros(n), np.zeros(n)

    c = 0
    while c * compas < segundos + 1:
        t0 = c * compas
        acorde = acordes[c % len(acordes)]
        # piano: el acorde en el 1 (un poco arpegiado) y un golpe más suave en el "y" del 2
        for k, nt in enumerate(acorde[1:]):
            poner(piano, rhodes(nota(nt), compas * .95, .55), t0 + k * .012)
        for nt in acorde[2:]:
            poner(piano, rhodes(nota(nt), negra * 1.6, .3), t0 + negra + swing)
        # bajo: raíz en el 1 y en el "y" del 3, quinta antes del cambio
        raiz = nota(acorde[0]) / 2
        poner(low, bajo(raiz, negra * 1.5), t0)
        poner(low, bajo(raiz, negra * .9), t0 + 2 * negra + swing)
        poner(low, bajo(raiz * 1.5, negra * .8), t0 + 3 * negra + swing)
        # batería: bombo en 1 y "y" del 2, escobilla en 2 y 4, shaker en corcheas
        poner(bat, bombo(rng), t0)
        poner(bat, bombo(rng) * .7, t0 + negra + swing)
        for b in (1, 3):
            poner(bat, escobilla(rng) * .55, t0 + b * negra)
        for b in range(4):
            for off, v in ((0, .16), (swing, .1)):
                poner(bat, escobilla(rng, .06, 7000) * v * (1 + .2 * rng.random()), t0 + b * negra + off)
        c += 1

    vinilo = pasabajos(rng.standard_normal(n), 4000) * .012
    chasquidos = (rng.random(n) > .99985) * rng.standard_normal(n) * .25
    mezcla = .9 * piano / max(1e-9, np.abs(piano).max()) + .55 * low / max(1e-9, np.abs(low).max()) \
        + .5 * bat / max(1e-9, np.abs(bat).max())
    mezcla = reverb(mezcla, rng) + vinilo + pasabajos(chasquidos, 3000)
    mezcla = pasabajos(mezcla, 7000)  # cálido, sin agudos filosos
    mezcla = mezcla[: int(segundos * SR)]
    # entrada y salida suaves
    t = np.arange(len(mezcla)) / SR
    mezcla *= np.minimum(1, t / .6) * np.minimum(1, (segundos - t) / 1.2).clip(0)
    mezcla /= np.abs(mezcla).max()
    return mezcla * .7


def guardar(x, ruta):
    # estéreo con un leve corrimiento para que no suene plano
    d = int(.012 * SR)
    izq = x
    der = np.concatenate([x[d:], np.zeros(d)]) * .96 + x * .04
    datos = (np.stack([izq, der], 1) * 32767).astype("<i2")
    with wave.open(ruta, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(datos.tobytes())


if __name__ == "__main__":
    tema, segundos, salida = sys.argv[1], float(sys.argv[2]), sys.argv[3]
    guardar(componer(tema, segundos), salida)
