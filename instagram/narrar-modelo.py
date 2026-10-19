"""Genera la voz en off de un video de modelo con Kokoro (voz neuronal, sin conexión).

Uso:  python3 instagram/narrar-modelo.py instagram/modelos/magnifica-s.json [voz] [velocidad]

      python3 instagram/narrar-modelo.py instagram/modelos/magnifica-s.json es-AR-ElenaNeural

- voz:
    · Microsoft (acento argentino, recomendadas): es-AR-ElenaNeural (femenina) o es-AR-TomasNeural (masculina).
      Necesitan las variables de entorno AZURE_SPEECH_KEY y AZURE_SPEECH_REGION, y que la red
      deje salir a <región>.tts.speech.microsoft.com.
    · Kokoro (sin conexión, acento neutro): ef_dora, em_alex o em_santa.
- velocidad: 1.0 normal; por defecto 0.92 (más pausado, tono ASMR).

Lee las frases de "narracion" del JSON y deja un .wav por frase en instagram/modelos/<carpeta>/.
Con Kokoro pronuncia en español latinoamericano (espeak-ng "es-419").

Kokoro necesita:  pip install kokoro-onnx
El modelo (Apache-2.0) y las voces se bajan de npm la primera vez y quedan en instagram/.voz/
(no se suben al repo): kokoro-q8-shards (pesos) y kokoro-js (voces).
"""
import io, json, os, subprocess, sys, tarfile, tempfile, urllib.request, wave
from xml.sax.saxutils import escape
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

def azure(texto, voz, velocidad):
    """Voz neuronal de Microsoft por la API REST de Speech. Devuelve (audio float, frecuencia)."""
    clave, region = os.environ.get('AZURE_SPEECH_KEY'), os.environ.get('AZURE_SPEECH_REGION')
    if not clave or not region:
        sys.exit('Faltan AZURE_SPEECH_KEY y AZURE_SPEECH_REGION en el entorno.')
    # "…" se lee como una pausa corta; prosody baja apenas el ritmo y el volumen (tono íntimo)
    partes = [escape(p.strip()) for p in texto.split('…')]
    cuerpo = '<break time="250ms"/>'.join(partes)
    ssml = (f'<speak version="1.0" xml:lang="es-AR" xmlns="http://www.w3.org/2001/10/synthesis">'
            f'<voice name="{voz}"><prosody rate="{round((velocidad - 1) * 100)}%" volume="-10%">{cuerpo}</prosody></voice></speak>')
    req = urllib.request.Request(
        f'https://{region}.tts.speech.microsoft.com/cognitiveservices/v1', data=ssml.encode('utf-8'), method='POST',
        headers={'Ocp-Apim-Subscription-Key': clave, 'Content-Type': 'application/ssml+xml',
                 'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm', 'User-Agent': 'cafe-en-tu-casa'})
    with urllib.request.urlopen(req, timeout=60) as r, wave.open(io.BytesIO(r.read())) as w:
        sr = w.getframerate()
        audio = np.frombuffer(w.readframes(w.getnframes()), np.int16) / 32768
    # recorta silencios de punta
    sonido = np.where(np.abs(audio) > .01)[0]
    if len(sonido): audio = audio[max(0, sonido[0] - 600): sonido[-1] + 2400]
    return audio, sr

def main(ruta_json, voz='es-AR-ElenaNeural', velocidad=0.92):
    M = json.load(open(ruta_json, encoding='utf-8'))
    cfg = M['narracion']
    carpeta = os.path.join(os.path.dirname(ruta_json), cfg['carpeta'])
    os.makedirs(carpeta, exist_ok=True)
    if voz.startswith('es-'):
        sintetizar = lambda texto, vel: azure(texto, voz, vel)
    else:
        from kokoro_onnx import Kokoro
        k = Kokoro(*preparar())
        sintetizar = lambda texto, vel: k.create(texto.replace('…', ','), voice=voz, speed=vel, lang='es-419', sentence_pause=.3, clause_pause=.18)
    # tiempo disponible de cada frase: hasta que arranca la siguiente (o termina el video)
    total = sum(p['d'] for p in M['pasos'])
    frases = cfg['frases']
    for i, fr in enumerate(frases):
        lugar = (frases[i + 1]['t'] if i + 1 < len(frases) else total) - fr['t'] - .15
        vel = velocidad
        while True:
            audio, sr = sintetizar(fr['texto'], vel)
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
