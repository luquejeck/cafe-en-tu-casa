"""Genera la voz en off de un video de modelo con Kokoro (voz neuronal, sin conexión).

Uso:  python3 instagram/narrar-modelo.py instagram/modelos/magnifica-s.json [voz] [velocidad]

- voz: ef_dora (femenina, por defecto), em_alex o em_santa (masculinas).
- velocidad: 1.0 normal; 0.9 más pausado (por defecto 0.92, tono ASMR).

Lee las frases de "narracion" del JSON y deja un .wav por frase en instagram/modelos/<carpeta>/.
Pronuncia en español latinoamericano (espeak-ng "es-419": seseo, sin la "z" española).

Necesita:  pip install kokoro-onnx
El modelo (Apache-2.0) y las voces se bajan de npm la primera vez y quedan en instagram/.voz/
(no se suben al repo): kokoro-q8-shards (pesos) y kokoro-js (voces).
"""
import json, os, subprocess, sys, tarfile, tempfile, wave
import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(AQUI, '.voz')
VOCES = ['ef_dora', 'em_alex', 'em_santa']


def npm_pack(paquete, destino):
    salida = subprocess.run(['npm', 'pack', paquete, '--silent'], cwd=destino, capture_output=True, text=True, check=True)
    return os.path.join(destino, salida.stdout.strip().splitlines()[-1])

def preparar():
    """Arma kokoro-q8.onnx y voces.npz en instagram/.voz/ si todavía no están."""
    modelo, voces = os.path.join(CACHE, 'kokoro-q8.onnx'), os.path.join(CACHE, 'voces.npz')
    if os.path.exists(modelo) and os.path.exists(voces):
        return modelo, voces
    os.makedirs(CACHE, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        with tarfile.open(npm_pack('kokoro-q8-shards@1.0.0', tmp)) as t:
            with open(modelo, 'wb') as out:
                for i in range(6):
                    out.write(t.extractfile(f'package/kokoro-q8.part{i}.bin').read())
        with tarfile.open(npm_pack('kokoro-js@1.2.1', tmp)) as t:
            # cada voz: 510 x 1 x 256 float32 (un estilo por largo de frase)
            datos = {v: np.frombuffer(t.extractfile(f'package/voices/{v}.bin').read(), np.float32).reshape(510, 1, 256) for v in VOCES}
        np.savez(voces, **datos)
    return modelo, voces

def main(ruta_json, voz='ef_dora', velocidad=0.92):
    from kokoro_onnx import Kokoro
    M = json.load(open(ruta_json, encoding='utf-8'))
    cfg = M['narracion']
    carpeta = os.path.join(os.path.dirname(ruta_json), cfg['carpeta'])
    os.makedirs(carpeta, exist_ok=True)
    modelo, voces = preparar()
    k = Kokoro(modelo, voces)
    # tiempo disponible de cada frase: hasta que arranca la siguiente (o termina el video)
    total = sum(p['d'] for p in M['pasos'])
    frases = cfg['frases']
    for i, fr in enumerate(frases):
        lugar = (frases[i + 1]['t'] if i + 1 < len(frases) else total) - fr['t'] - .15
        vel = velocidad
        while True:
            audio, sr = k.create(fr['texto'].replace('…', ','), voice=voz, speed=vel, lang='es-419', sentence_pause=.3, clause_pause=.18)
            dur = len(audio) / sr
            if dur <= lugar or vel >= 1.15: break
            vel += .03   # si no entra en su paso, apenas más rápido
        audio = audio / (np.abs(audio).max() or 1) * .9
        with wave.open(os.path.join(carpeta, f"{fr['id']}.wav"), 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
            w.writeframes((audio * 32767).astype(np.int16).tobytes())
        aviso = '' if dur <= lugar else '  ← NO ENTRA, acortá la frase'
        print(f"{fr['id']:9s} {dur:4.1f} s de {lugar:4.1f} s  (velocidad {vel:.2f}){aviso}")

if __name__ == '__main__':
    main(sys.argv[1], *(sys.argv[2:3] or []), *([float(sys.argv[3])] if len(sys.argv) > 3 else []))
