"""Arma la voz en off final del video de LinkedIn a partir de dos grabaciones de ElevenLabs
(voz "Dante", modelo v4):

  voz-dante.mp3   la grabación original, entera.
  voz-dante-2.mp3 la regrabación de dos partes (el agente y los datos), separadas por una pausa larga.

De la original se saca "Y nunca fui community manager" y se reemplazan esas dos partes.
Los cortes caen siempre en pausas (medidas con silencedetect), así no se nota el empalme.

Uso:  python3 linkedin/voz/armar-voz.py      ->  linkedin/voz/voz-final.wav
"""
import os, subprocess
import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
SR = 44100


def leer(nombre):
    crudo = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(AQUI, nombre), '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                           capture_output=True, check=True).stdout
    return np.frombuffer(crudo, dtype='<i2').astype(np.float32)


def pausas(x, umbral_db=-38, minimo=.25):
    """Intervalos [inicio, fin] en segundos donde la voz está callada."""
    ventana = int(.01 * SR)
    n = len(x) // ventana
    rms = np.sqrt(np.mean(x[: n * ventana].reshape(n, ventana) ** 2, axis=1)) / 32768
    calla = 20 * np.log10(rms + 1e-9) < umbral_db
    out, ini = [], None
    for i, c in enumerate(calla):
        if c and ini is None: ini = i
        if not c and ini is not None:
            if (i - ini) * .01 >= minimo: out.append([ini * .01, i * .01])
            ini = None
    return out


def tramo(x, a, b):
    """De a a b segundos, con entradas y salidas de 15 ms para que no haya clics."""
    y = x[int(a * SR): int(b * SR)].copy()
    f = int(.015 * SR)
    y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
    return y


def silencio(s): return np.zeros(int(s * SR), dtype=np.float32)


orig = leer('voz-dante.mp3')
nueva = leer('voz-dante-2.mp3')

# la pausa más larga de la regrabación separa la parte del agente de la de los datos
p = max(pausas(nueva), key=lambda q: q[1] - q[0])
agente = tramo(nueva, 0, p[0] + .05)
# recorte del silencio del final de los datos
cola = [q for q in pausas(nueva) if q[0] > p[1] and q[1] >= len(nueva) / SR - .05]
fin_datos = cola[0][0] if cola else len(nueva) / SR
datos = tramo(nueva, p[1] - .05, min(fin_datos + .1, len(nueva) / SR))

partes = [
    tramo(orig, 0, 2.62),          # "No sé programar. No sé diseñar."
    silencio(.25),
    tramo(orig, 5.30, 26.40),      # "Pero armé…" hasta "…listas antes de empezar."
    silencio(.35),
    agente,                        # NUEVO: el agente
    silencio(.45),
    tramo(orig, 33.90, 36.65),     # "Rediseñé la marca, con su propio manual."
    silencio(.35),
    datos,                         # NUEVO: los datos me corrigieron
    silencio(.45),
    tramo(orig, 43.40, len(orig) / SR),   # "La IA no hizo el negocio por mí…" hasta el final
]
marcas, t = [], 0
for x in partes:
    marcas.append(round(t, 2)); t += len(x) / SR
final = np.concatenate(partes)
# las dos grabaciones al mismo volumen
final = final / np.max(np.abs(final)) * 32767 * .9

subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', os.path.join(AQUI, 'voz-final.wav')],
               input=final.astype('<i2').tobytes(), check=True)
print('largo', round(len(final) / SR, 2), 's')
print('inicio de cada parte:', marcas)
print('pausas de la parte nueva:', pausas(nueva))
