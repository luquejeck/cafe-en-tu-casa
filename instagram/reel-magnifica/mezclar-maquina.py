"""Sonido del reel "el viaje del grano": voz, un beat electrónico suave y sonidos
de máquina (molienda, agua, bomba, goteo) sincronizados con la animación.

Uso (lo llama reel-prueba/filmar3.mjs cuando la página define window.MEZCLA):
  python3 mezclar-maquina.py mudo.mp4 salida.mp4 <segundos> '<sfx json>' voz.mp3 <desde>
sfx: [segundo, tipo]; tipos propios: despiece, click, molienda, agua, bomba, goteo,
beat (arranca el beat), corte (lo baja), y los de reel-prueba/mezclar3.py.
"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, '..', 'reel-prueba'))
sys.path.insert(0, os.path.join(AQUI, '..'))
import musica  # noqa: E402
import mezclar3  # noqa: E402

SR = musica.SR
rng = np.random.default_rng(5)
t_ = lambda n: np.arange(n) / SR


def env(n, a, d):
    t = t_(n); return np.minimum(1, t / a) * np.exp(-t / d)


def despiece():
    """Golpe grave + chasquidos metálicos de piezas que se separan (1,6 s)."""
    n = int(1.6 * SR); x = np.zeros(n); g = mezclar3.golpe(rng)[:n]; x[:len(g)] += g * .9
    for i in range(7):
        k = int((.05 + i * .12 + rng.random() * .05) * SR); m = int(.25 * SR)
        f = 1800 + rng.random() * 2500
        x[k:k + m] += np.sin(2 * np.pi * f * t_(m)) * env(m, .001, .05) * .25
    return x


def click():
    n = int(.08 * SR); return musica.pasaaltos(rng.standard_normal(n), 2000) * env(n, .0005, .008) * .8


def molienda():
    """Molinillo: ruido granulado que vibra (3 s)."""
    n = int(3.0 * SR); t = t_(n)
    base = musica.pasabajos(musica.pasaaltos(rng.standard_normal(n), 300), 3500)
    vib = .6 + .4 * np.sign(np.sin(2 * np.pi * 38 * t))
    return base * vib * np.minimum(1, t / .1) * np.minimum(1, (t[-1] - t) / .3) * .32


def agua():
    """Agua que corre y burbujea (2,5 s)."""
    n = int(2.5 * SR); t = t_(n); x = musica.pasabajos(rng.standard_normal(n), 1800) * .12
    for i in range(30):
        k = int(rng.random() * (n - SR // 10)); m = int(.04 * SR); f = 500 + rng.random() * 900
        x[k:k + m] += np.sin(2 * np.pi * np.cumsum(np.linspace(f, f * 1.6, m)) / SR) * env(m, .002, .015) * .2
    return x * np.minimum(1, t / .2) * np.minimum(1, (t[-1] - t) / .4)


def bomba():
    """Bomba vibratoria: zumbido grave que sube (3 s)."""
    n = int(3.0 * SR); t = t_(n); f = 50 + 8 * t
    x = np.tanh(2 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * .3 + musica.pasabajos(rng.standard_normal(n), 400) * .2
    return x * np.minimum(1, t / .15) * np.minimum(1, (t[-1] - t) / .3)


def goteo():
    n = int(2.0 * SR); x = np.zeros(n)
    for i in range(8):
        k = int((i * .24 + rng.random() * .05) * SR); m = int(.15 * SR); f = 900 + rng.random() * 300
        x[k:k + m] += np.sin(2 * np.pi * np.cumsum(np.linspace(f * 1.5, f, m)) / SR) * env(m, .001, .03) * .3
    return x


TIPOS = {'despiece': despiece, 'click': click, 'molienda': molienda, 'agua': agua, 'bomba': bomba, 'goteo': goteo}


def beat(seg, bpm, tramos):
    """Beat electrónico suave: bombo, contratiempo, palmas y bajo. tramos = [(desde, hasta, volumen)]."""
    n = int(seg * SR); x = np.zeros(n); paso = 60 / bpm
    bombo = musica.bombo(rng)[:int(.45 * SR)] * .9
    m = int(.04 * SR); hat = musica.pasaaltos(rng.standard_normal(m), 6000) * env(m, .0005, .012) * .25
    m2 = int(.18 * SR); palma = musica.pasaaltos(musica.pasabajos(rng.standard_normal(m2), 2500), 800) * env(m2, .001, .05) * .35
    notas = [41.2, 41.2, 49.0, 36.7]
    b = 0
    while b * paso < seg:
        k = int(b * paso * SR)
        vol = max([v for a, h, v in tramos if a <= b * paso < h] or [0])
        if vol:
            if b % 2 == 0: x[k:k + len(bombo)] += bombo[: max(0, n - k)] * vol
            if b % 4 == 2: x[k:k + m2] += palma[: max(0, n - k)] * vol
            kk = int((b + .5) * paso * SR); x[kk:kk + m] += hat[: max(0, n - kk)] * vol
            mb = int(paso * SR * .9); f = notas[(b // 4) % 4]
            x[k:k + mb] += (np.sin(2 * np.pi * f * t_(mb)) * env(mb, .01, .25) * .35 * vol)[: max(0, n - k)]
        b += 1
    return x


def main(mudo, salida, segundos, sfx, voz, desde):
    seg = float(segundos); n = int(seg * SR)
    eventos = json.loads(sfx)
    fx = np.zeros(n); tramos = []; ini = None
    for t, tipo in eventos:
        if tipo == 'beat': ini = t; continue
        if tipo == 'corte': tramos.append((ini, t, 1.0)); ini = None; continue
        x = TIPOS[tipo]() if tipo in TIPOS else mezclar3.TIPOS[tipo](rng)
        i = max(0, int((t - (.3 if tipo == 'whoosh' else 0)) * SR)); fx[i:i + len(x)] += x[: max(0, n - i)]
    if ini is not None: tramos.append((ini, seg, 1.0))
    ritmo = beat(seg, 104, tramos)
    with tempfile.TemporaryDirectory() as tmp:
        wv = os.path.join(tmp, 'v.wav')
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', voz, '-ac', '1', '-ar', str(SR), wv], check=True)
        with wave.open(wv) as w: v = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
        pista = np.zeros(n); i = int(float(desde) * SR); pista[i:i + len(v)] = v[: max(0, n - i)]
        pista /= np.abs(pista).max() or 1
        mezcla = pista + ritmo * .22 + fx * .35
        mezcla /= np.abs(mezcla).max() or 1
        wav = os.path.join(tmp, 'a.wav'); musica.guardar(mezcla * .9, wav)
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', mudo, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                        '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', '-shortest',
                        '-movflags', '+faststart', salida], check=True)


if __name__ == '__main__':
    main(*sys.argv[1:7])
