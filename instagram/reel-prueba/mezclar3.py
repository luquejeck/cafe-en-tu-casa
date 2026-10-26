"""Sonido del reel de prueba v3: música lo-fi y efectos sincronizados con la animación.

Uso (lo llama filmar3.mjs):  python3 mezclar3.py mudo.mp4 salida.mp4 <segundos> '<sfx json>'
sfx: lista de [segundo, tipo] con tipo tic (contador), whoosh, pop, golpe o subida.
"""
import json, os, subprocess, sys, tempfile
import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, '..'))
import musica  # noqa: E402

SR = musica.SR


def env(n, ataque, caida):
    t = np.arange(n) / SR
    return np.minimum(1, t / ataque) * np.exp(-t / caida)


def tic(rng):
    """El contador girando: 2 s de clics que se aceleran y frenan."""
    n = int(2.0 * SR); x = np.zeros(n)
    clic = musica.pasaaltos(rng.standard_normal(int(.012 * SR)), 2500) * np.hanning(int(.012 * SR))
    t = 0.0
    while t < 1.95:
        i = int(t * SR); x[i:i + len(clic)] += clic * .5
        t += .03 + .12 * (t / 2) ** 2
    return x


def whoosh(rng):
    n = int(.6 * SR); t = np.arange(n) / SR
    return musica.pasabajos(musica.pasaaltos(rng.standard_normal(n), 400), 5000) * np.sin(np.pi * t / t[-1]) ** 3 * .45


def pop(rng):
    n = int(.18 * SR); t = np.arange(n) / SR
    f = 900 * np.exp(-t * 30) + 380
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .04) * .5


def golpe(rng):
    n = int(.8 * SR); t = np.arange(n) / SR
    f = 42 + 80 * np.exp(-t * 10)
    return np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * env(n, .003, .25) * .9


def subida(rng):
    """Ascenso brillante mientras los puntos se vuelven oliva (3 s)."""
    n = int(3.0 * SR); t = np.arange(n) / SR
    f = 330 * 2 ** (t / 1.5)
    x = sum(np.sin(2 * np.pi * np.cumsum(f * m) / SR) / m for m in (1, 2, 3))
    return x * np.minimum(1, t / 2.6) * np.exp(-np.maximum(0, t - 2.7) * 12) * .12


TIPOS = {'tic': tic, 'whoosh': whoosh, 'pop': pop, 'golpe': golpe, 'subida': subida}


def main(mudo, salida, segundos, sfx):
    seg = float(segundos); n = int(seg * SR)
    rng = np.random.default_rng(11)
    mus = musica.componer('manana', seg)
    mus = np.pad(mus, (0, max(0, n - len(mus))))[:n]
    fx = np.zeros(n)
    for t, tipo in json.loads(sfx):
        x = TIPOS[tipo](rng)
        i = max(0, int((t - (.3 if tipo == 'whoosh' else 0)) * SR))
        fx[i:i + len(x)] += x[: max(0, n - i)]
    mezcla = mus * .75 + fx * .6
    mezcla /= np.abs(mezcla).max() or 1
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, 'a.wav')
        musica.guardar(mezcla * .9, wav)
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', mudo, '-i', wav, '-map', '0:v', '-map', '1:a',
                        '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k',
                        '-shortest', '-movflags', '+faststart', salida], check=True)


if __name__ == '__main__':
    main(*sys.argv[1:5])
