"""Tiempos del reel "Cómo inventar una cafetera automática" (versión cocina en diorama).

Escribe cocina/golpes.js con las palabras de la voz y el comienzo de cada golpe del guion.
Los tiempos salen de cocina/palabras.json (transcripción de la voz con tiempos por palabra);
si todavía no existe, se estiman para poder previsualizar.

Uso:  python3 instagram/cocina/armar.py
"""
import json, os, re

AQUI = os.path.dirname(os.path.abspath(__file__))

# id: qué pasa en la cocina (lo dibuja cocina.html) · tipo: gancho / problema / solucion / neutro / final
GUION = [   # (id, tipo, frase, imagen de escenas/)
    ('grano',     'gancho',   'Tenés un grano de café.', 1),
    ('noseToma',  'problema', 'Así no se toma.', 2),
    ('moler',     'solucion', 'Entonces lo molés.', 3),
    ('aroma',     'problema', 'Pero si lo molés antes, pierde el aroma.', 4),
    ('recien',    'solucion', 'Entonces lo molés en el momento… y moler a mano cansa.', 5),
    ('pasaLargo', 'problema', 'Le tirás agua… y pasa de largo.', 8),
    ('fria',      'problema', 'Encima, fría.', 10),
    ('calentar',  'solucion', 'Entonces la calentás.', 11),
    ('prensar',   'solucion', 'Y prensás el café, para que el agua no se escape.', 9),
    ('noPasa',    'problema', 'Pero ahora el agua no pasa.', 12),
    ('empujar',   'solucion', 'Entonces la empujás con fuerza.', 13),
    ('espresso',  'neutro',   'Sale el espresso.', 14),
    ('borra',     'problema', 'Pero queda la borra pegada.', 15),
    ('tirar',     'solucion', 'Entonces la tirás.', 16),
    ('leche',     'problema', '¿Y si lo querés con leche?', 17),
    ('espumar',   'solucion', 'La calentás y la espumás.', 18),
    ('siete',     'problema', 'Y todo esto… a las siete de la mañana.', 19),
    ('caja',      'solucion', 'Por eso existe una caja que hace todo con un botón.', 20),
    ('final',     'final',    'Muele, calienta, prensa, extrae y tira la borra sola. Vos solo ponés el grano.', 21),
]

limpia = lambda w: re.sub(r'[^\wáéíóúñü]', '', w.lower())


def palabras():
    ruta = os.path.join(AQUI, 'palabras.json')
    if os.path.exists(ruta):
        return json.load(open(ruta, encoding='utf-8')), True
    out, t = [], .2
    for _, _, frase, _ in GUION:
        for w in frase.split():
            d = .16 + .02 * len(w)
            out.append({'text': w, 'start': round(t, 2), 'end': round(t + d, 2)})
            t += d + (.2 if w[-1] in '.?:…,' else .03)
    return out, False


def main():
    P, real = palabras()
    i, inicios = 0, []
    for _, _, frase, _ in GUION:
        ws = [limpia(w) for w in frase.split() if limpia(w)]
        j = i
        while j < len(P) and limpia(P[j]['text']) != ws[0]:
            j += 1
        if j >= len(P):
            raise SystemExit(f'No encuentro "{frase}" en la transcripción')
        inicios.append(max(0, P[j]['start'] - .1) if inicios else 0)
        i = j + len(ws)
    fin = P[-1]['end'] + 1.0
    golpes, n = [], 0
    for k, (gid, tipo, frase, img) in enumerate(GUION):
        n += tipo == 'solucion'
        golpes.append(dict(id=gid, tipo=tipo, img=img, t0=round(inicios[k], 3), d=round((inicios[k + 1] if k + 1 < len(GUION) else fin) - inicios[k], 3), contador=n))
    with open(os.path.join(AQUI, 'golpes.js'), 'w', encoding='utf-8') as f:
        f.write('// Generado por cocina/armar.py: no editar a mano\n')
        f.write(f'const PALABRAS = {json.dumps(P, ensure_ascii=False)};\n')
        f.write(f'const GOLPES = {json.dumps(golpes, ensure_ascii=False)};\n')
        f.write(f'const SOLUCIONES = {n}; const DURACION = {round(fin, 3)};\n')
    # pista de efectos para sonido-modelo.py (música + efectos sincronizados con los golpes)
    efx = {'grano': [('granos', .1, .8, .12)], 'noseToma': [('golpe', .1, .3, .18)], 'moler': [('golpe', 0, .3, .2), ('molinillo', .3, 1.2, .2)],
           'recien': [('molinillo', 0, 1.8, .22)], 'niveles': [('golpe', 0, .3, .2), ('dial', .3, 1.0, .16)],
           'pasaLargo': [('goteo', .4, 1.2, .2)], 'prensar': [('golpe', .6, .35, .26)], 'noPasa': [('golpe', .1, .3, .14)],
           'fria': [('agua', 0, 1.0, .12)], 'calentar': [('golpe', 0, .3, .2), ('vapor', .3, 1.4, .12)],
           'empujar': [('bomba', .2, 1.5, .05)], 'espresso': [('goteo', 0, 1.6, .22)],
           'tirar': [('golpe', .3, .3, .22)], 'espumar': [('vapor', .1, 1.4, .14)],
           'caja': [('golpe', .1, .5, .3), ('click', 1.8, .1, .22), ('campana', 2.2, 2.0, .14)], 'final': [('goteo', .2, 1.6, .16), ('granos', 4.0, .8, .12)],
           }
    efectos = [dict(tipo=t, t0=round(g['t0'] + a, 3), dur=d, volumen=v) for g in golpes for (t, a, d, v) in efx.get(g['id'], [])]
    sonido = dict(pasos=[dict(d=round(fin, 3))], sonido=dict(estilo='asmr', volumen_general_db=-26, ambiente=.1,
        musica=dict(bpm=100, acordes=[["A2", "C#3", "E3", "G#3"], ["F#2", "A2", "C#3", "E3"], ["D2", "F#2", "A2", "C#3"], ["E2", "G#2", "B2", "D3"]], volumen=.17),
        efectos=efectos))
    json.dump(sonido, open(os.path.join(AQUI, 'sonido.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print(f'{len(golpes)} golpes · {n} soluciones · {fin:.1f} s · tiempos {"de la voz" if real else "ESTIMADOS"}')


main()
