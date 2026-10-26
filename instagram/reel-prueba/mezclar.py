"""Mezcla el sonido del reel de prueba: voz, música lo-fi y golpes en los cortes.

Uso (lo llama filmar.mjs):  python3 mezclar.py '<tiempos json>' <segundos> mudo.mp4 salida.mp4
"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, '..'))
import musica  # noqa: E402

SR = musica.SR


def leer_wav(ruta):
    with wave.open(ruta) as w:
        sr, n = w.getframerate(), w.getnframes()
        x = np.frombuffer(w.readframes(n), np.int16).astype(np.float32) / 32768
    if sr != SR:  # remuestreo lineal a 44,1 kHz
        x = np.interp(np.linspace(0, len(x) - 1, int(len(x) * SR / sr)), np.arange(len(x)), x)
    return x


def golpe(rng):
    """Un "whoosh" corto con un bombo grave al final: marca el cambio de escena."""
    n = int(.42 * SR)
    t = np.arange(n) / SR
    ruido = musica.pasaaltos(rng.standard_normal(n), 400)
    barrido = musica.pasabajos(ruido * np.sin(np.pi * t / t[-1]) ** 2, 5000) * .35
    b = np.zeros(n); k = musica.bombo(rng) * .9
    b[-len(k):] += k[: n] if len(k) <= n else k[:n]
    return barrido + np.roll(b, -int(.05 * SR))


def main(tiempos, segundos, mudo, salida):
    T = json.loads(tiempos)
    n = int(float(segundos) * SR)
    rng = np.random.default_rng(5)
    voz = np.zeros(n)
    for fid, ab in T.items():
        x = leer_wav(os.path.join(AQUI, 'voz', f'{fid}.wav'))
        i = int(ab['a'] * SR); voz[i:i + len(x)] += x[: max(0, n - i)]
    mus = musica.componer('sobremesa', float(segundos))
    mus = np.pad(mus, (0, max(0, n - len(mus))))[:n]
    # la música baja mientras habla la voz (con rampas suaves) y sube al final
    habla = np.convolve((np.abs(voz) > .02).astype(float), np.ones(int(.25 * SR)) / int(.25 * SR), 'same')
    ducking = 1 - .72 * np.clip(habla * 3, 0, 1)
    sfx = np.zeros(n)
    for fid in ('antes', 'pasos', 'remate', 'cierre'):
        g = golpe(rng); i = max(0, int((T[fid]['a'] - .3) * SR))
        sfx[i:i + len(g)] += g[: max(0, n - i)]
    mezcla = voz * 1.0 + mus * ducking * .55 + sfx * .5
    mezcla /= np.abs(mezcla).max() or 1
    mezcla *= .9
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, 'a.wav')
        musica.guardar(mezcla, wav)
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', mudo, '-i', wav, '-map', '0:v', '-map', '1:a',
                        '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k',
                        '-shortest', '-movflags', '+faststart', salida], check=True)


if __name__ == '__main__':
    main(*sys.argv[1:5])
