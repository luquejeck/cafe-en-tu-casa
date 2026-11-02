"""Tiempos del reel "Cómo inventar una cafetera automática" (versión cocina en diorama).

Escribe cocina/golpes.js con las palabras de la voz y el comienzo de cada golpe del guion.
Los tiempos salen de cocina/palabras.json (transcripción de la voz con tiempos por palabra);
si todavía no existe, se estiman para poder previsualizar.

Uso:  python3 instagram/cocina/armar.py
"""
import json, os, re

AQUI = os.path.dirname(os.path.abspath(__file__))

# id: qué pasa en la cocina (lo dibuja cocina.html) · tipo: gancho / problema / solucion / neutro / final
GUION = [
    ('grano',      'gancho',   'Tenés un grano de café.'),
    ('noseToma',   'problema', 'Así no se toma.'),
    ('moler',      'solucion', 'Entonces lo molés.'),
    ('aroma',      'problema', 'Pero molido pierde el aroma.'),
    ('recien',     'solucion', 'Entonces, recién molido, taza por taza.'),
    ('gustos',     'problema', 'Pero cada uno lo quiere distinto.'),
    ('niveles',    'solucion', 'Entonces, trece niveles.'),
    ('pasaLargo',  'problema', 'Pero el agua pasa de largo.'),
    ('prensar',    'solucion', 'Entonces lo prensás.'),
    ('fria',       'problema', 'Pero el agua está fría.'),
    ('calentar',   'solucion', 'Entonces la calentás al instante.'),
    ('noAtraviesa','problema', 'Pero no lo atraviesa.'),
    ('bares',      'solucion', 'Entonces, quince bares.'),
    ('espresso',   'neutro',   'Sale espresso. Con crema.'),
    ('usado',      'problema', 'Pero queda el café usado.'),
    ('cajon',      'solucion', 'Entonces, pastilla al cajón.'),
    ('cappu',      'problema', '¿Y el cappuccino?'),
    ('vapor',      'solucion', 'Vaporizador.'),
    ('siete',      'problema', 'Pero a las siete nadie quiere hacer todo esto.'),
    ('caja',       'solucion', 'Entonces lo metés en una caja. Con un botón.'),
    ('final',      'final',    'Y cada mañana arranca igual: con un grano.'),
]

limpia = lambda w: re.sub(r'[^\wáéíóúñü]', '', w.lower())


def palabras():
    ruta = os.path.join(AQUI, 'palabras.json')
    if os.path.exists(ruta):
        return json.load(open(ruta, encoding='utf-8')), True
    out, t = [], .2
    for _, _, frase in GUION:
        for w in frase.split():
            d = .16 + .02 * len(w)
            out.append({'text': w, 'start': round(t, 2), 'end': round(t + d, 2)})
            t += d + (.2 if w[-1] in '.?:…,' else .03)
    return out, False


def main():
    P, real = palabras()
    i, inicios = 0, []
    for _, _, frase in GUION:
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
    for k, (gid, tipo, frase) in enumerate(GUION):
        n += tipo == 'solucion'
        golpes.append(dict(id=gid, tipo=tipo, t0=round(inicios[k], 3), d=round((inicios[k + 1] if k + 1 < len(GUION) else fin) - inicios[k], 3), contador=n))
    with open(os.path.join(AQUI, 'golpes.js'), 'w', encoding='utf-8') as f:
        f.write('// Generado por cocina/armar.py: no editar a mano\n')
        f.write(f'const PALABRAS = {json.dumps(P, ensure_ascii=False)};\n')
        f.write(f'const GOLPES = {json.dumps(golpes, ensure_ascii=False)};\n')
        f.write(f'const SOLUCIONES = {n}; const DURACION = {round(fin, 3)};\n')
    # pista de efectos para sonido-modelo.py (música + efectos sincronizados con los golpes)
    efx = {'grano': [('granos', .1, .8, .12)], 'noseToma': [('golpe', .1, .3, .18)], 'moler': [('golpe', 0, .3, .2), ('molinillo', .3, 1.2, .2)],
           'recien': [('molinillo', 0, 1.8, .22)], 'niveles': [('golpe', 0, .3, .2), ('dial', .3, 1.0, .16)],
           'pasaLargo': [('goteo', .2, 1.2, .2)], 'prensar': [('golpe', 0, .3, .2), ('golpe', .55, .35, .26)],
           'fria': [('agua', 0, 1.0, .12)], 'calentar': [('golpe', 0, .3, .2), ('vapor', .3, 1.4, .12)],
           'bares': [('golpe', 0, .3, .2), ('bomba', .3, 1.5, .05)], 'espresso': [('goteo', 0, 1.6, .22)],
           'cajon': [('golpe', 0, .3, .2), ('golpe', .9, .3, .22)], 'vapor': [('golpe', 0, .3, .2), ('vapor', .2, 1.4, .14)],
           'caja': [('golpe', .2, .5, .3), ('golpe', .9, .4, .26), ('click', 1.6, .1, .22), ('goteo', 1.8, 1.2, .18), ('campana', 2.4, 2.0, .14)],
           'final': [('granos', .5, .8, .12)]}
    efectos = [dict(tipo=t, t0=round(g['t0'] + a, 3), dur=d, volumen=v) for g in golpes for (t, a, d, v) in efx.get(g['id'], [])]
    sonido = dict(pasos=[dict(d=round(fin, 3))], sonido=dict(estilo='asmr', volumen_general_db=-26, ambiente=.1,
        musica=dict(bpm=100, acordes=[["A2", "C#3", "E3", "G#3"], ["F#2", "A2", "C#3", "E3"], ["D2", "F#2", "A2", "C#3"], ["E2", "G#2", "B2", "D3"]], volumen=.17),
        efectos=efectos))
    json.dump(sonido, open(os.path.join(AQUI, 'sonido.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print(f'{len(golpes)} golpes · {n} soluciones · {fin:.1f} s · tiempos {"de la voz" if real else "ESTIMADOS"}')


main()
