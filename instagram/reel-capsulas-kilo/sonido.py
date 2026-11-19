"""Banda de sonido del reel de las cápsulas: música lo-fi de musica.py + efectos sincronizados.

Uso:  python3 instagram/reel-capsulas-kilo/sonido.py eventos.json video.mp4

eventos.json lo escribe filmar.js con window.EVENTOS de reel.html: cada evento tiene el segundo
exacto en que pasa algo en pantalla (una cápsula que cae, un cambio de escena, el "160+").
Todo se sintetiza acá, sin samples ni derechos de autor.
"""
import json, os, subprocess, sys, tempfile
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import musica as M  # noqa: E402

SR = M.SR
rng = np.random.default_rng(7)


def env(n, ataque, caida):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(ataque, 1e-4)) * np.exp(-t / caida)


def tic(altura=.5, suave=False):
    """Cápsula de aluminio que cae: un 'clic' metálico corto, más agudo cuanto más llena la grilla."""
    n = int(.09 * SR)
    t = np.arange(n) / SR
    f = 1700 + 1500 * altura
    tono = sum(np.sin(2 * np.pi * f * r * t) * a for r, a in ((1, 1), (2.76, .5), (5.4, .25)))
    ruido = M.pasaaltos(rng.standard_normal(n), 3000) * .35
    x = (tono + ruido) * env(n, .0008, .018 if not suave else .03)
    return x * (.28 if suave else .22)


def whoosh(dur=.38):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ruido = rng.standard_normal(n)
    # ruido que sube y baja de brillo: el aire de la transición
    x = M.pasabajos(ruido, 2600) * np.sin(np.pi * t / dur) ** 2
    return x / np.abs(x).max() * .2


def golpe():
    """Arranque: un golpe grave y redondo para el gancho del segundo 0."""
    n = int(.6 * SR)
    t = np.arange(n) / SR
    f = 95 * np.exp(-t * 5) + 45
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .18)
    return x * .45


def campana():
    """El '160+': dos notas brillantes, como una caja registradora suave."""
    out = np.zeros(int(1.4 * SR))
    for k, (nt, ret) in enumerate((("E6", 0), ("B6", .09))):
        f = M.nota(nt)
        n = int(1.2 * SR)
        t = np.arange(n) / SR
        s = (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 2.0 * t) + .15 * np.sin(2 * np.pi * f * 3.01 * t))
        s *= env(n, .002, .35)
        i = int(ret * SR)
        out[i:i + n] += s
    return out * .18


def pop():
    n = int(.12 * SR)
    t = np.arange(n) / SR
    f = 600 * np.exp(-t * 30) + 180
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .001, .03) * .25


def acorde():
    """Cierre: acorde cálido de piano eléctrico, el mismo color que la música."""
    x = sum(M.rhodes(M.nota(nt), 1.5, .6) for nt in ("D4", "F#4", "A4", "C#5", "E5"))
    return x / np.abs(x).max() * .3


SONIDOS = {"tic": tic, "whoosh": whoosh, "golpe": golpe, "campana": campana, "pop": pop, "acorde": acorde}


def banda(eventos, segundos):
    n = int(segundos * SR)
    musica = M.componer("sobremesa", segundos)[:n]
    musica = np.pad(musica, (0, n - len(musica)))
    efectos = np.zeros(n + 2 * SR)
    for e in eventos:
        f = SONIDOS[e["tipo"]]
        s = f(e.get("altura", .5), e.get("suave", False)) if e["tipo"] == "tic" else f()
        i = int(e["t"] * SR)
        efectos[i:i + len(s)] += s[: len(efectos) - i]
    efectos = efectos[:n]
    # la música baja un poco cuando suenan los efectos fuertes (ducking suave)
    nivel = M.pasabajos(np.abs(efectos), 8)
    nivel /= max(1e-9, nivel.max())
    mezcla = musica * (1 - .2 * nivel) * 1.25 + efectos * .8
    # salida: que no corte seco al final
    t = np.arange(n) / SR
    mezcla *= np.minimum(1, (segundos - t) / .35).clip(0)
    return mezcla / np.abs(mezcla).max() * .9


def main(ruta_eventos, video):
    eventos = json.load(open(ruta_eventos))
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video],
                               capture_output=True, text=True, check=True).stdout)
    with tempfile.TemporaryDirectory() as tmp:
        wav, mp4 = os.path.join(tmp, "banda.wav"), os.path.join(tmp, "salida.mp4")
        M.guardar(banda(eventos, dur), wav)
        subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", video, "-i", wav, "-map", "0:v", "-map", "1:a",
                        "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "44100", "-c:a", "aac", "-b:a", "192k",
                        "-shortest", "-movflags", "+faststart", mp4], check=True)
        os.replace(mp4, video)
    print(f"{os.path.basename(video)}: música + {len(eventos)} efectos, {dur:.1f} s")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
