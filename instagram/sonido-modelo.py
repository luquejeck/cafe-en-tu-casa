"""Sintetiza el audio de un video de modelo (música + efectos) a partir del bloque "sonido" del JSON.

Uso:  python3 instagram/sonido-modelo.py instagram/modelos/magnifica-s.json salida.wav

Todo se genera con numpy: no usa muestras ni música con derechos.
"""
import json, sys, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)

def nota(n):
    nombres = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
    semi = nombres[n[0]] + (1 if '#' in n else -1 if 'b' in n[1:] else 0)
    octava = int(n[-1])
    return 440 * 2 ** ((semi - 9) / 12 + (octava - 4))

def banda(x, lo=None, hi=None):
    """Filtro pasabanda por FFT (suave en los bordes)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))

def env(n, ataque=.02, caida=.1):
    e = np.ones(n)
    a, c = int(ataque * SR), int(caida * SR)
    if a: e[:a] = np.linspace(0, 1, a)
    if c: e[-c:] *= np.linspace(1, 0, c)
    return e

def ruido(n): return rng.standard_normal(n)

# ---------------------------------------------------------------- efectos
def granos(d):
    n = int(d * SR); x = np.zeros(n)
    for _ in range(int(d * 90)):
        i = rng.integers(0, n - 2000); L = rng.integers(200, 900)
        x[i:i + L] += ruido(L) * np.exp(-np.arange(L) / (L / 5)) * rng.uniform(.3, 1)
    return banda(x, 1500, 9000) * env(n, .05, .3)

def agua(d):
    n = int(d * SR); t = np.arange(n) / SR
    x = banda(ruido(n), 500, 3500) * (0.6 + 0.4 * np.sin(2 * np.pi * 7 * t + np.sin(2 * np.pi * 1.3 * t)))
    return x * env(n, .2, .4)

def click(d):
    n = int(.08 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 2200 * t) * .6 + ruido(n) * .4) * np.exp(-t * 90)

def dial(d):
    n = int(d * SR); x = np.zeros(n)
    for k in range(9):
        i = int(k / 9 * (n - 2000)); c = click(.05) * .5; x[i:i + len(c)] += c
    return x

def molinillo(d):
    n = int(d * SR); t = np.arange(n) / SR
    base = sum(np.sin(2 * np.pi * 115 * h * t) / h for h in range(1, 14))
    grit = banda(ruido(n), 1800, 7000) * (0.5 + 0.5 * np.sin(2 * np.pi * 31 * t) ** 2)
    x = base * .5 + grit * .8
    return x * (0.75 + 0.25 * np.sin(2 * np.pi * 26 * t)) * env(n, .12, .35)

def golpe(d):
    n = int(.4 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 70 * t * (1 - t)) + banda(ruido(n), None, 900) * .3) * np.exp(-t * 14)

def bomba(d):
    n = int(d * SR); t = np.arange(n) / SR
    x = np.sign(np.sin(2 * np.pi * 100 * t)) * .5 + np.sin(2 * np.pi * 200 * t) * .3
    x = banda(x + ruido(n) * .25, 60, 700)
    return x * env(n, .1, .3)

def goteo(d):
    n = int(d * SR); x = banda(ruido(n), 300, 2000) * .25
    for _ in range(int(d * 14)):
        i = rng.integers(0, n - 6000); L = 5000; tt = np.arange(L) / SR
        f0 = rng.uniform(500, 1100)
        x[i:i + L] += np.sin(2 * np.pi * (f0 + 900 * tt) * tt) * np.exp(-tt * 45) * .8
    return x * env(n, .1, .4)

def vapor(d):
    n = int(d * SR); t = np.arange(n) / SR
    x = banda(ruido(n), 2500, 12000) * (0.85 + 0.15 * np.sin(2 * np.pi * 9 * t))
    gorgoteo = banda(ruido(n), 150, 600) * (np.sin(2 * np.pi * 4 * t) > .3) * .4
    return (x + gorgoteo) * env(n, .25, .5)

def campana(d):
    n = int(d * SR); t = np.arange(n) / SR
    return sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, a, k in [(880, .6, 2.2), (1318.5, .35, 3), (1760, .2, 4)])

EFECTOS = dict(granos=granos, agua=agua, click=click, dial=dial, molinillo=molinillo, golpe=golpe,
               bomba=bomba, goteo=goteo, vapor=vapor, campana=campana)

# ---------------------------------------------------------------- música
def musica(cfg, total):
    n = int(total * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    beat = 60 / cfg['bpm']; compas = beat * 4
    for c in range(int(total / compas) + 1):
        acorde = cfg['acordes'][c % len(cfg['acordes'])]
        i0 = int(c * compas * SR); L = min(int(compas * SR), n - i0)
        if L <= 0: break
        tt = np.arange(L) / SR
        # pad suave (con un poco de desafinado para que respire)
        for nn in acorde:
            f = nota(nn)
            x[i0:i0 + L] += (np.sin(2 * np.pi * f * tt) + .5 * np.sin(2 * np.pi * f * 1.003 * tt)) * .12 * env(L, .4, .5)
        # piano eléctrico: arpegio en corcheas
        for k in range(8):
            j = i0 + int(k * beat / 2 * SR); Lk = int(beat * 1.5 * SR)
            if j + Lk > n: break
            f = nota(acorde[k % len(acorde)]) * 2; tk = np.arange(Lk) / SR
            x[j:j + Lk] += (np.sin(2 * np.pi * f * tk) + .3 * np.sin(2 * np.pi * 2 * f * tk)) * np.exp(-tk * 4) * .09
        # bajo
        f = nota(acorde[0]) / 2
        x[i0:i0 + L] += np.sin(2 * np.pi * f * tt) * .18 * env(L, .02, .3)
    # pulso suave: bombo en 1 y 3, hi-hat en contratiempos
    for k in range(int(total / beat)):
        j = int(k * beat * SR)
        if k % 2 == 0:
            L = int(.25 * SR); tk = np.arange(L) / SR
            if j + L < n: x[j:j + L] += np.sin(2 * np.pi * 60 * tk * (1 - tk * 1.5)) * np.exp(-tk * 18) * .35
        jh = int((k + .5) * beat * SR); L = int(.05 * SR)
        if jh + L < n: x[jh:jh + L] += banda(ruido(L), 6000, None) * np.exp(-np.arange(L) / SR * 80) * .05
    return x * env(n, 1.0, 2.0)

def main(ruta_json, salida):
    M = json.load(open(ruta_json, encoding='utf-8'))
    total = sum(p['d'] for p in M['pasos'])
    n = int(total * SR)
    snd = M['sonido']
    mus = musica(snd['musica'], total)
    mus = mus / (np.abs(mus).max() or 1) * snd['musica']['volumen']
    sfx = np.zeros(n)
    for e in snd['efectos']:
        y = EFECTOS[e['tipo']](e['dur'])
        y = y / (np.abs(y).max() or 1) * e['volumen']
        i = int(e['t0'] * SR); L = min(len(y), n - i)
        sfx[i:i + L] += y[:L]
    # la música baja un poco cuando suenan los efectos (ducking)
    nivel = np.convolve(np.abs(sfx), np.ones(4410) / 4410, mode='same')
    duck = 1 - .45 * np.clip(nivel / .08, 0, 1)
    mezcla = mus * duck + sfx
    mezcla = mezcla / (np.abs(mezcla).max() or 1) * .89
    # estéreo: música un poco abierta, efectos al centro
    izq = mezcla + mus * duck * .05
    der = mezcla - mus * duck * .05
    est = np.stack([izq, der], axis=1)
    est = (np.clip(est, -1, 1) * 32767).astype(np.int16)
    with wave.open(salida, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(est.tobytes())
    print(f'{salida}: {total:.1f} s')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
