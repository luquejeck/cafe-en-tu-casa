"""Voz en off del reel de prueba "Antes / después" (Kokoro, sin conexión).

Uso:  python3 instagram/reel-prueba/narrar.py [voz] [velocidad]
      voz: em_alex (por defecto), em_santa o ef_dora · velocidad: 1.08 por defecto (ritmo de reel)

Lee guion.json, deja un .wav por frase en voz/ y escribe en guion.json cuánto dura cada una,
que es lo que usa reel.html para armar los tiempos. El modelo se baja de npm la primera vez
y queda en instagram/.voz/ (igual que narrar-modelo.py).
"""
import json, os, subprocess, sys, tarfile, tempfile, wave
import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(AQUI, '..', '.voz')
VOCES = ['ef_dora', 'em_alex', 'em_santa']


def npm_pack(paquete, destino):
    salida = subprocess.run(['npm', 'pack', paquete, '--silent'], cwd=destino, capture_output=True, text=True, check=True)
    return os.path.join(destino, salida.stdout.strip().splitlines()[-1])


def preparar():
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
            datos = {v: np.frombuffer(t.extractfile(f'package/voices/{v}.bin').read(), np.float32).reshape(510, 1, 256) for v in VOCES}
        np.savez(voces, **datos)
    return modelo, voces


def main(voz='em_alex', velocidad=1.08):
    from kokoro_onnx import Kokoro
    k = Kokoro(*preparar())
    ruta = os.path.join(AQUI, 'guion.json')
    G = json.load(open(ruta, encoding='utf-8'))
    os.makedirs(os.path.join(AQUI, 'voz'), exist_ok=True)
    for fr in G['frases']:
        audio, sr = k.create(fr['dice'], voice=voz, speed=velocidad, lang='es-419')
        sonido = np.where(np.abs(audio) > .01)[0]
        if len(sonido): audio = audio[max(0, sonido[0] - 400): sonido[-1] + 1600]
        audio = audio / (np.abs(audio).max() or 1) * .9
        with wave.open(os.path.join(AQUI, 'voz', f"{fr['id']}.wav"), 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
            w.writeframes((audio * 32767).astype(np.int16).tobytes())
        fr['dur'] = round(len(audio) / sr, 2)
        print(f"{fr['id']:10s} {fr['dur']:4.1f} s  {fr['dice']}")
    G['voz'] = voz
    json.dump(G, open(ruta, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print('total voz:', round(sum(f['dur'] for f in G['frases']), 1), 's')


if __name__ == '__main__':
    main(*(sys.argv[1:2] or []), *([float(sys.argv[2])] if len(sys.argv) > 2 else []))
