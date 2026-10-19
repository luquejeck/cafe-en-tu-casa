"""Sintetiza el audio de un video de modelo (música + efectos + voz) a partir del JSON.

Uso:  python3 instagram/sonido-modelo.py instagram/modelos/magnifica-s.json salida.wav

- "sonido": música y efectos, todo generado con numpy (sin muestras ni música con derechos).
  Con "estilo": "asmr" los sonidos son cercanos y suaves: ataques lentos, sin agudos filosos
  y un poco de ambiente (reverb corta).
- "narracion": si existen los .wav de cada frase (instagram/modelos/<carpeta>/<id>.wav), los
  ubica en su segundo y baja la música y los efectos mientras se habla.
"""
import json, os, sys, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)


# ---------------------------------------------------------------- utilidades
def nota(n):
    nombres = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
    semi = nombres[n[0]] + (1 if '#' in n else -1 if 'b' in n[1:] else 0)
    return 440 * 2 ** ((semi - 9) / 12 + (int(n[-1]) - 4))

def banda(x, lo=None, hi=None, orden=4):
    """Filtro pasabanda por FFT, con bordes suaves."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** orden)
    if hi: m *= 1 / (1 + (f / hi) ** orden)
    return np.fft.irfft(X * m, len(x))

def env(n, ataque=.02, caida=.1):
    e = np.ones(n)
    a, c = min(int(ataque * SR), n), min(int(caida * SR), n)
    if a: e[:a] = np.sin(np.linspace(0, np.pi / 2, a)) ** 2      # entradas y salidas redondeadas
    if c: e[-c:] *= np.cos(np.linspace(0, np.pi / 2, c)) ** 2
    return e

def ruido(n): return rng.standard_normal(n)

def grano_suave(L, lo, hi):
    """Un 'tic' corto y redondo (para granos, molienda, gotas)."""
    t = np.arange(L) / SR
    return banda(ruido(L), lo, hi) * np.sin(np.pi * np.arange(L) / L) ** 2 * np.exp(-t * 30)

def reverb(x, segundos=1.1, mezcla=.16):
    """Ambiente corto y oscuro: convolución con ruido que decae."""
    L = int(segundos * SR)
    ir = banda(ruido(L), None, 3500) * np.exp(-np.arange(L) / SR * 5.5)
    ir /= np.sqrt((ir ** 2).sum())
    n = len(x) + L
    y = np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[:len(x)]
    return x * (1 - mezcla) + y * mezcla * 2.2


# ---------------------------------------------------------------- efectos (versión suave)
def granos(d):
    """Granos que caen y se acomodan: un repiqueteo liviano."""
    n = int(d * SR); x = np.zeros(n)
    for k in range(int(d * 55)):
        i = rng.integers(0, n - 3000); L = int(rng.integers(500, 1400))
        x[i:i + L] += grano_suave(L, 900, 5200) * rng.uniform(.25, 1)
    return x * env(n, .35, .6)

def agua(d):
    """Agua que se vierte despacio."""
    n = int(d * SR); t = np.arange(n) / SR
    x = banda(ruido(n), 350, 2200) * (0.7 + 0.3 * np.sin(2 * np.pi * 3.1 * t + 2 * np.sin(2 * np.pi * .7 * t)))
    return x * env(n, .5, .7)

def click(d):
    """Botón: un toque blando."""
    n = int(.09 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 900 * t) * .7 + banda(ruido(n), 400, 2500) * .3) * np.exp(-t * 70) * env(n, .003, .02)

def dial(d):
    """Dial: un trinquete suave, clic por clic."""
    n = int(d * SR); x = np.zeros(n)
    for k in range(10):
        c = click(.05) * (.45 + .1 * (k % 2)); i = int(k / 10 * (n - len(c))); x[i:i + len(c)] += c
    return x

def molinillo(d):
    """Molienda: crujido granulado y un motor muy por debajo."""
    n = int(d * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for k in range(int(d * 420)):
        i = rng.integers(0, n - 800); L = int(rng.integers(180, 600))
        x[i:i + L] += grano_suave(L, 700, 4200) * rng.uniform(.2, 1)
    motor = (np.sin(2 * np.pi * 95 * t) + .35 * np.sin(2 * np.pi * 190 * t)) * (0.85 + 0.15 * np.sin(2 * np.pi * 6 * t))
    return (x / (np.abs(x).max() or 1) + motor * .18) * env(n, .35, .6)

def golpe(d):
    """Prensa y pastilla: un 'tum' amortiguado."""
    n = int(.45 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 62 * t * (1 - t * .8)) + banda(ruido(n), None, 500) * .2) * np.exp(-t * 11) * env(n, .008, .1)

def bomba(d):
    """Bomba: un zumbido grave y redondo, sin vibración áspera."""
    n = int(d * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 100 * t) + .3 * np.sin(2 * np.pi * 200 * t) + banda(ruido(n), 80, 400) * .25
    return x * (0.85 + 0.15 * np.sin(2 * np.pi * 2.2 * t)) * env(n, .5, .8)

def goteo(d):
    """Espresso cayendo: hilito de líquido y gotas suaves."""
    n = int(d * SR); x = banda(ruido(n), 250, 1500) * .22
    for k in range(int(d * 9)):
        i = rng.integers(0, n - 8000); L = 7000; tt = np.arange(L) / SR
        f0 = rng.uniform(380, 720)
        x[i:i + L] += np.sin(2 * np.pi * (f0 + 420 * tt) * tt) * np.exp(-tt * 28) * env(L, .004, .05) * .7
    return x * env(n, .4, .7)

def vapor(d):
    """Vapor en la leche: siseo suave y burbujeo."""
    n = int(d * SR); t = np.arange(n) / SR
    siseo = banda(ruido(n), 1800, 6000) * (0.8 + 0.2 * np.sin(2 * np.pi * 1.5 * t))
    burbujas = np.zeros(n)
    for k in range(int(d * 30)):
        i = rng.integers(0, n - 3000); L = 2500; tt = np.arange(L) / SR
        burbujas[i:i + L] += np.sin(2 * np.pi * rng.uniform(250, 500) * tt) * np.exp(-tt * 60)
    return (siseo * .6 + burbujas * .5) * env(n, .6, .8)

def campana(d):
    """Cierre: un 'ding' cálido y largo."""
    n = int(d * SR); t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, a, k in [(659.3, .6, 1.6), (987.8, .3, 2.2), (1318.5, .12, 3)])
    return x * env(n, .01, .5)

EFECTOS = dict(granos=granos, agua=agua, click=click, dial=dial, molinillo=molinillo, golpe=golpe,
               bomba=bomba, goteo=goteo, vapor=vapor, campana=campana)


# ---------------------------------------------------------------- música (lofi suave)
def musica(cfg, total):
    n = int(total * SR); x = np.zeros(n)
    beat = 60 / cfg['bpm']; compas = beat * 4
    for c in range(int(total / compas) + 1):
        acorde = cfg['acordes'][c % len(cfg['acordes'])]
        i0 = int(c * compas * SR); L = min(int(compas * SR) + int(.6 * SR), n - i0)
        if L <= 0: break
        tt = np.arange(L) / SR
        for nn in acorde:   # colchón cálido, apenas desafinado
            f = nota(nn)
            x[i0:i0 + L] += (np.sin(2 * np.pi * f * tt) + .4 * np.sin(2 * np.pi * f * 1.004 * tt)) * .1 * env(L, .9, .9)
        for k in range(4):   # piano en negras, muy suave
            j = i0 + int(k * beat * SR); Lk = int(beat * 2 * SR)
            if j + Lk > n: break
            f = nota(acorde[(k * 2 + c) % len(acorde)]) * 2; tk = np.arange(Lk) / SR
            x[j:j + Lk] += (np.sin(2 * np.pi * f * tk) + .15 * np.sin(2 * np.pi * 2 * f * tk)) * np.exp(-tk * 2.6) * env(Lk, .01, .3) * .07
        f = nota(acorde[0]) / 2   # bajo redondo
        x[i0:i0 + L] += np.sin(2 * np.pi * f * tt) * .12 * env(L, .1, .6)
    x = banda(x, 50, 2400)   # sin brillo: que acompañe y no compita
    return x * env(n, 1.5, 2.5)


# ---------------------------------------------------------------- voz en off
def leer_wav(ruta):
    with wave.open(ruta) as w:
        sr, ch, ancho = w.getframerate(), w.getnchannels(), w.getsampwidth()
        x = np.frombuffer(w.readframes(w.getnframes()), {2: np.int16, 4: np.int32}[ancho]).astype(float)
    x = x.reshape(-1, ch).mean(axis=1) / (2 ** (8 * ancho - 1))
    if sr != SR:   # remuestreo simple
        x = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x)
    return x

def narracion(M, base, n):
    cfg = M.get('narracion')
    voz = np.zeros(n)
    if not cfg or not cfg.get('activa', True): return voz, 0   # "activa": false = video sin voz
    carpeta = os.path.join(base, cfg['carpeta']); usadas = 0
    for fr in cfg['frases']:
        ruta = os.path.join(carpeta, f"{fr['id']}.wav")
        if not os.path.exists(ruta): continue
        y = leer_wav(ruta)
        y = banda(y, 70, None)                       # saca retumbe
        y = y / (np.sqrt((y ** 2).mean()) or 1) * .11 * cfg.get('volumen', 1)   # todas las frases al mismo nivel medio
        i = int(fr['t'] * SR); L = min(len(y), n - i)
        voz[i:i + L] += y[:L] * env(L, .01, .05)
        usadas += 1
    return voz, usadas


# ---------------------------------------------------------------- mezcla
def main(ruta_json, salida):
    M = json.load(open(ruta_json, encoding='utf-8'))
    total = sum(p['d'] for p in M['pasos'])
    n = int(total * SR)
    snd = M['sonido']
    asmr = snd.get('estilo') == 'asmr'

    mus = musica(snd['musica'], total)
    mus = mus / (np.abs(mus).max() or 1) * snd['musica']['volumen']
    sfx = np.zeros(n)
    for e in snd['efectos']:
        y = EFECTOS[e['tipo']](e['dur'])
        y = y / (np.abs(y).max() or 1) * e['volumen']
        i = int(e['t0'] * SR); L = min(len(y), n - i)
        sfx[i:i + L] += y[:L]
    if asmr:
        sfx = banda(sfx, 40, 7000, orden=2)          # sin agudos filosos
        sfx = reverb(sfx, mezcla=snd.get('ambiente', .16))
        mus = reverb(mus, segundos=1.6, mezcla=.25)

    # la música baja un poco cuando suenan los efectos
    suav = lambda x, ms: np.convolve(np.abs(x), np.ones(int(SR * ms / 1000)) / int(SR * ms / 1000), mode='same')
    mus *= 1 - .35 * np.clip(suav(sfx, 120) / .05, 0, 1)

    # voz: música y efectos se corren para atrás mientras se habla
    voz, frases = narracion(M, os.path.dirname(ruta_json), n)
    if frases:
        hablando = np.clip(suav(voz, 250) / .03, 0, 1)
        baja = 1 - M['narracion'].get('bajar_resto', .45) * hablando
        mus *= baja; sfx *= baja

    mezcla = mus + sfx + voz
    # compresión suave y volumen general
    # volumen por promedio (no por pico): "volumen_general" es el nivel medio en dBFS
    objetivo = 10 ** (snd.get('volumen_general_db', -24) / 20)
    mezcla = mezcla * objetivo / (np.sqrt((mezcla ** 2).mean()) or 1)
    mezcla = np.tanh(mezcla * 1.2) / 1.2
    est = np.stack([mezcla + mus * .04, mezcla - mus * .04], axis=1)
    est = (np.clip(est, -1, 1) * 32767).astype(np.int16)
    with wave.open(salida, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(est.tobytes())
    print(f'{salida}: {total:.1f} s · voz: {frases} frases')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
