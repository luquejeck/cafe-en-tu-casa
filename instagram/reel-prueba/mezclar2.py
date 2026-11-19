"""Sonido del reel de prueba v2: música lo-fi, golpes de meme y (si está) la voz de Lucas.

Uso (lo llama filmar2.mjs):  python3 mezclar2.py mudo.mp4 salida.mp4 [voz]
La voz puede ser cualquier audio (m4a del celular, wav, mp3): empieza en el segundo 0
del video, así que conviene grabarla mirando el borrador.
"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, '..'))
import musica  # noqa: E402

SR = musica.SR


def leer_audio(ruta):
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, 'v.wav')
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', ruta, '-ac', '1', '-ar', str(SR), wav], check=True)
        with wave.open(wav) as w:
            return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768


def boom(rng):
    """Golpe grave de meme: caída de tono con un poco de distorsión y cola."""
    n = int(.9 * SR); t = np.arange(n) / SR
    f = 38 + 90 * np.exp(-t * 9)
    x = np.tanh(2.5 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 3.2)
    x += musica.pasabajos(rng.standard_normal(n), 900) * np.exp(-t * 18) * .4
    return x


def whoosh(rng):
    n = int(.45 * SR); t = np.arange(n) / SR
    return musica.pasabajos(musica.pasaaltos(rng.standard_normal(n), 500), 6000) * np.sin(np.pi * t / t[-1]) ** 3 * .5


def main(mudo, salida, voz=''):
    G = json.load(open(os.path.join(AQUI, 'guion2.json'), encoding='utf-8'))
    n = int(G['total'] * SR)
    rng = np.random.default_rng(9)
    mus = musica.componer('manana', G['total'])
    mus = np.pad(mus, (0, max(0, n - len(mus))))[:n]
    sfx = np.zeros(n)
    for g in G['golpes']:
        x = boom(rng) if g in (6.1, 26.6, 34.0) else whoosh(rng)
        i = max(0, int((g - (0 if g in (6.1, 26.6, 34.0) else .3)) * SR))
        sfx[i:i + len(x)] += x[: max(0, n - i)]
    v = np.zeros(n)
    if voz:
        x = leer_audio(voz); v[:min(n, len(x))] = x[:n]
        v /= np.abs(v).max() or 1
    habla = np.convolve((np.abs(v) > .03).astype(float), np.ones(int(.3 * SR)) / int(.3 * SR), 'same')
    ducking = 1 - .7 * np.clip(habla * 3, 0, 1)
    mezcla = v * 1.0 + mus * ducking * .6 + sfx * .55
    mezcla /= np.abs(mezcla).max() or 1
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, 'a.wav')
        musica.guardar(mezcla * .9, wav)
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', mudo, '-i', wav, '-map', '0:v', '-map', '1:a',
                        '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k',
                        '-shortest', '-movflags', '+faststart', salida], check=True)


if __name__ == '__main__':
    main(*sys.argv[1:4])
