"""Música de fondo para el video de LinkedIn, generada con numpy (sin muestras ni derechos).

Uso:  python3 linkedin/musica.py salida.wav <segundos> <inicio de cada escena, separados por coma>

Un piano eléctrico tranquilo con acordes de café de mañana, bajo redondo, un pulso
suave de bombo y escobilla, y una campanita apenas audible en cada cambio de escena.
"""
import sys, wave
import numpy as np

SR = 44100
BPM = 92
rng = np.random.default_rng(3)


def hz(n):
    nombres = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
    semi = nombres[n[0]] + (1 if '#' in n else -1 if 'b' in n[1:] else 0)
    return 440 * 2 ** ((semi - 9) / 12 + (int(n[-1]) - 4))


def suma(dest, x, t):
    i = int(t * SR)
    if i >= len(dest): return
    x = x[: len(dest) - i]
    dest[i:i + len(x)] += x


def epiano(f, dur, vel=1.0):
    """Piano eléctrico: fundamental + armónicos que se apagan antes, con un leve trémolo."""
    n = int(dur * SR); t = np.arange(n) / SR
    tono = (np.sin(2 * np.pi * f * t)
            + .35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 3)
            + .12 * np.sin(2 * np.pi * 3.01 * f * t) * np.exp(-t * 6))
    env = np.exp(-t * 1.1) * (1 - np.exp(-t * 300))
    env[-int(.08 * SR):] *= np.linspace(1, 0, int(.08 * SR))
    return tono * env * (1 + .08 * np.sin(2 * np.pi * 4.5 * t)) * vel


def bajo(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    env = (1 - np.exp(-t * 80)) * np.exp(-t * 1.6)
    env[-int(.05 * SR):] *= np.linspace(1, 0, int(.05 * SR))
    return (np.sin(2 * np.pi * f * t) + .2 * np.sin(2 * np.pi * 2 * f * t)) * env


def bombo():
    n = int(.35 * SR); t = np.arange(n) / SR
    f = 52 + 70 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)


def escobilla(largo=.12):
    n = int(largo * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    x = np.diff(np.concatenate([[0], x]))  # saca graves: suena a escobilla, no a ruido
    return x * np.exp(-t * 35) * (1 - np.exp(-t * 400))


def campanita(f):
    n = int(1.6 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t * 4)) * np.exp(-t * 2.6) * (1 - np.exp(-t * 500))


def reverb(x, mezcla=.22):
    """Reverb corta con unos ecos que se van apagando."""
    y = x.copy()
    for ret, g in [(.031, .5), (.047, .42), (.071, .33), (.113, .25), (.167, .17), (.241, .1)]:
        d = int(ret * SR); y[d:] += x[:-d] * g * mezcla * 2
    return y


def main(salida, total, escenas):
    n = int((total + 1) * SR)
    teclas, graves, ritmo, efectos = (np.zeros(n) for _ in range(4))
    pulso = 60 / BPM
    compas = 4 * pulso

    # Fmaj7 · Em7 · Dm7 · Cmaj7(9): cálido, en movimiento, sin dramatismo
    acordes = [(['F3', 'A3', 'C4', 'E4'], 'F2'), (['E3', 'G3', 'B3', 'D4'], 'E2'),
               (['D3', 'F3', 'A3', 'C4'], 'D2'), (['C3', 'E3', 'G3', 'B3', 'D4'], 'C2')]
    arpegio = [0, 2, 1, 3, 2, 1, 3, 2]   # índices dentro del acorde, en corcheas

    c = 0
    while c * compas < total:
        notas, raiz = acordes[c % len(acordes)]
        t0 = c * compas
        for nn in notas:                               # acorde largo de fondo
            suma(teclas, epiano(hz(nn), compas * .98, .22), t0)
        for k, idx in enumerate(arpegio):              # arpegio arriba, una octava más
            f = hz(notas[idx % len(notas)]) * 2
            suma(teclas, epiano(f, pulso * 1.6, .13 if k % 2 else .17), t0 + k * pulso / 2)
        suma(graves, bajo(hz(raiz), pulso * 2.4), t0)
        suma(graves, bajo(hz(raiz) * 1.5, pulso * 1.4), t0 + 2.5 * pulso)
        if t0 >= compas * 1:                           # el ritmo entra en el compás 2
            for b in range(4):
                if b in (0, 2): suma(ritmo, bombo() * .55, t0 + b * pulso)
                suma(ritmo, escobilla() * (.12 if b % 2 else .07), t0 + b * pulso + pulso / 2)
        c += 1

    # una campanita en cada cambio de escena (menos al arrancar)
    for i, e in enumerate(escenas[1:]):
        suma(efectos, campanita(hz(['C6', 'E6', 'G6', 'A6'][i % 4])) * .1, e - .05)

    mezcla = reverb(teclas) * .55 + graves * .38 + ritmo * .5 + reverb(efectos, .4)
    mezcla = mezcla[: int(total * SR)]
    # entrada y salida suaves
    fi, fo = int(.8 * SR), int(2.5 * SR)
    mezcla[:fi] *= np.linspace(0, 1, fi)
    mezcla[-fo:] *= np.linspace(1, 0, fo) ** 1.5
    mezcla = np.tanh(mezcla / np.max(np.abs(mezcla)) * 1.2) * .7   # techo blando, sin picos
    est = np.stack([mezcla, np.roll(mezcla, int(.012 * SR)) * .97], axis=1)  # un poco de abierto
    with wave.open(salida, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((est * 32767).astype('<i2').tobytes())


if __name__ == '__main__':
    main(sys.argv[1], float(sys.argv[2]), [float(x) for x in sys.argv[3].split(',')])
