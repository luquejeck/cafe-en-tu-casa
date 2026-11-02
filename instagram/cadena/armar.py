"""Arma el reel "Cómo inventar una cafetera automática" (formato cadena: problema → entonces).

Toma las piezas del modelo 3D (modelos/magnifica-s.json) y el guion de abajo, y escribe
modelos/magnifica-s-cadena.json, que dibuja instagram/cadena.html y filma filmar-modelo.mjs.

Los tiempos salen de la voz: cadena/palabras.json (transcripción con tiempos por palabra).
Si todavía no hay voz, los estima a 2,7 palabras por segundo para poder previsualizar.

Uso:  python3 instagram/cadena/armar.py
"""
import json, os, re

AQUI = os.path.dirname(os.path.abspath(__file__))
MODELOS = os.path.join(AQUI, '..', 'modelos')

# tipo: gancho · problema (PERO) · solucion (ENTONCES, suma 1 al contador) · neutro
# agrega: piezas que aparecen en ese golpe · mira/zoom: a dónde va la cámara
GUION = [
    dict(t='gancho', frase='Tenés un grano de café.', agrega=['tolva'], mira=[80, 250, 300], zoom=2.3,
         acciones=[dict(tipo='particulas', camino='carga_granos', forma='grano', n=7, t0=0, dur=1.2, viaje=.5)]),
    dict(t='problema', frase='Así no se toma.', mira=[80, 250, 300], zoom=2.5,
         acciones=[dict(tipo='vibrar', parte='tolva', t0=0, dur=.5)], sonido=[('golpe', 0, .4, .2)]),
    dict(t='solucion', frase='Entonces lo molés.', agrega=['molinillo', 'conducto'], mira=[80, 255, 230], zoom=2.0,
         acciones=[dict(tipo='girar', parte='molinillo', grados=1400, t0=0, dur=1.4),
                   dict(tipo='particulas', camino='a_molinillo', forma='grano', n=6, t0=.1, dur=1.2, viaje=.45),
                   dict(tipo='particulas', camino='molido', forma='polvo', color='molido', n=24, t0=.4, dur=1.2, viaje=.5)],
         sonido=[('molinillo', .1, 1.3, .22)]),
    dict(t='problema', frase='Pero molido pierde el aroma.', mira=[80, 250, 190], zoom=2.0,
         acciones=[dict(tipo='particulas', camino='molido', forma='burbuja', color='leche', n=22, t0=0, dur=2.2, viaje=.7)]),
    dict(t='solucion', frase='Entonces, recién molido, taza por taza.', mira=[80, 255, 230], zoom=2.1,
         acciones=[dict(tipo='girar', parte='molinillo', grados=1600, t0=0, dur=1.8), dict(tipo='pulso', parte='molinillo', t0=.1),
                   dict(tipo='particulas', camino='a_molinillo', forma='grano', n=8, t0=0, dur=1.6, viaje=.45),
                   dict(tipo='particulas', camino='molido', forma='polvo', color='molido', n=30, t0=.3, dur=1.6, viaje=.5)],
         sonido=[('molinillo', 0, 1.8, .22)]),
    dict(t='problema', frase='Pero cada uno lo quiere distinto.', mira=[110, 120, 300], zoom=1.6),
    dict(t='solucion', frase='Entonces, trece niveles.', agrega=['panel', 'dial'], mira=[120, -10, 325], zoom=2.4,
         acciones=[dict(tipo='girar', parte='dial', grados=260, t0=.2, dur=1.2)], sonido=[('dial', .2, 1.2, .16)]),
    dict(t='problema', frase='Pero el agua pasa de largo.', agrega=['unidad'], mira=[80, 220, 200], zoom=2.0,
         acciones=[dict(tipo='llenar', parte='unidad', a=.8, t0=0, dur=1.0)]),
    dict(t='solucion', frase='Entonces lo prensás.', agrega=['piston'], mira=[80, 210, 205], zoom=2.2,
         acciones=[dict(tipo='mover', parte='piston', dz=-20, t0=.15, dur=.5)], sonido=[('golpe', .5, .4, .26)]),
    dict(t='problema', frase='Pero el agua está fría.', agrega=['deposito', 'canos'], mira=[160, 220, 230], zoom=1.45,
         acciones=[dict(tipo='llenar', parte='deposito', a=.85, t0=0, dur=1.2),
                   dict(tipo='flujo', camino='agua_a_bomba', color='agua', t0=.2, dur=1.4)], sonido=[('agua', 0, 1.4, .12)]),
    dict(t='solucion', frase='Entonces la calentás al instante.', agrega=['thermoblock'], mira=[110, 340, 120], zoom=2.0,
         acciones=[dict(tipo='calor', parte='thermoblock', t0=.1, dur=1.8),
                   dict(tipo='flujo', camino='agua_a_unidad', color='calor', t0=.5, dur=1.4)]),
    dict(t='problema', frase='Pero no lo atraviesa.', mira=[80, 210, 205], zoom=2.1,
         acciones=[dict(tipo='vibrar', parte='unidad', t0=.3, dur=.6)]),
    dict(t='solucion', frase='Entonces, quince bares.', agrega=['bomba'], mira=[190, 380, 60], zoom=1.9,
         acciones=[dict(tipo='vibrar', parte='bomba', t0=0, dur=2.0), dict(tipo='flujo', camino='agua_a_bomba', color='agua', t0=0, dur=2.0),
                   dict(tipo='flujo', camino='agua_a_unidad', color='calor', t0=.3, dur=1.7)], sonido=[('bomba', 0, 2.0, .05)]),
    dict(t='neutro', frase='Sale espresso. Con crema.', agrega=['surtidor', 'taza', 'bandeja'], mira=[120, 40, 90], zoom=1.9,
         acciones=[dict(tipo='particulas', camino='cafe', forma='gota', color='cafe', n=18, t0=0, dur=1.8, viaje=.35),
                   dict(tipo='particulas', camino='cafe2', forma='gota', color='cafe', n=18, t0=.05, dur=1.8, viaje=.35),
                   dict(tipo='llenar', parte='taza', a=.62, t0=.2, dur=1.6)], sonido=[('goteo', 0, 1.9, .22)]),
    dict(t='problema', frase='Pero queda el café usado.', mira=[80, 200, 190], zoom=2.0,
         acciones=[dict(tipo='pulso', parte='unidad', t0=.2)]),
    dict(t='solucion', frase='Entonces, pastilla al cajón.', agrega=['cajon'], mira=[60, 120, 110], zoom=1.6,
         acciones=[dict(tipo='mover', parte='piston', dz=0, t0=0, dur=.3), dict(tipo='llenar', parte='unidad', a=0, t0=.3, dur=.25),
                   dict(tipo='particulas', camino='pastilla', forma='pastilla', color='molido', n=1, t0=.3, dur=1.0, viaje=1.0),
                   dict(tipo='llenar', parte='cajon', a=.3, t0=1.2, dur=.4)], sonido=[('golpe', 1.2, .4, .2)]),
    dict(t='problema', frase='¿Y el cappuccino?', mira=[0, 70, 260], zoom=1.8),
    dict(t='solucion', frase='Vaporizador.', agrega=['vaporizador', 'jarra'], mira=[-30, 60, 230], zoom=1.9,
         acciones=[dict(tipo='particulas', camino='vapor', forma='burbuja', color='leche', n=22, t0=0, dur=1.6, viaje=.5),
                   dict(tipo='llenar', parte='jarra', a=.72, t0=.1, dur=1.5)], sonido=[('vapor', 0, 1.6, .14)]),
    dict(t='problema', frase='Pero a las siete nadie quiere hacer todo esto.', mira=[110, 200, 180], zoom=1.0),
    dict(t='solucion', frase='Entonces lo metés en una caja. Con un botón.', agrega=['carcasa'], cierre=True,
         marca="De'Longhi Magnifica S", mira=[110, 190, 190], zoom=.95,
         acciones=[dict(tipo='pulso', parte='panel', t0=1.6)], sonido=[('click', 1.6, .1, .22), ('campana', 1.7, 2.2, .14)]),
    dict(t='final', frase='Y cada mañana arranca igual: con un grano.', cierre=True, marca="De'Longhi Magnifica S",
         mira=[80, 250, 300], zoom=2.3, sonido=[('granos', .8, 1.4, .18)]),
]

limpia = lambda w: re.sub(r'[^\wáéíóúñü]', '', w.lower())


def palabras():
    ruta = os.path.join(AQUI, 'palabras.json')
    if os.path.exists(ruta):
        return json.load(open(ruta, encoding='utf-8')), True
    out, t = [], .15
    for g in GUION:
        for w in g['frase'].split():
            d = .2 + .018 * len(w)
            out.append({'text': w, 'start': round(t, 2), 'end': round(t + d, 2)})
            t += d + (.22 if w[-1] in '.?:…,' else .03)
    return out, False


def main():
    base = json.load(open(os.path.join(MODELOS, 'magnifica-s.json'), encoding='utf-8'))
    P, real = palabras()
    # cada golpe arranca en su primera palabra: se recorre la transcripción en orden
    i, inicios = 0, []
    for g in GUION:
        ws = [limpia(w) for w in g['frase'].split() if limpia(w)]
        j = i
        while j < len(P) and limpia(P[j]['text']) != ws[0]:
            j += 1
        if j >= len(P):
            raise SystemExit(f'No encuentro "{g["frase"]}" en la transcripción')
        inicios.append(max(0, P[j]['start'] - .08) if inicios else 0)
        i = j + len(ws)
    fin = P[-1]['end'] + 1.3
    inicios.append(fin)

    pasos, recorrido, efectos, n = [], [], [], 0
    for k, g in enumerate(GUION):
        d = round(inicios[k + 1] - inicios[k], 3)
        if g['t'] == 'solucion':
            n += 1
        pasos.append(dict(id=f'g{k}', d=d, tipo=g['t'], contador=n, foco=g.get('agrega', []), agrega=g.get('agrega', []),
                          cierre=g.get('cierre', False), marca=g.get('marca'), acciones=g.get('acciones', []), titulo=''))
        recorrido.append(dict(t=round(inicios[k] + min(.35, d / 3), 3), mira=g['mira'], zoom=g['zoom'], giro=30 + (k % 4) * 6))
        for (tipo, t0, dur, vol) in g.get('sonido', []):
            efectos.append(dict(tipo=tipo, t0=round(inicios[k] + t0, 3), dur=dur, volumen=vol))
    recorrido.insert(0, dict(t=0, mira=GUION[0]['mira'], zoom=GUION[0]['zoom'] * .92, giro=30))
    recorrido.append(dict(t=round(fin, 3), mira=GUION[-1]['mira'], zoom=GUION[-1]['zoom'], giro=30))

    M = {k: base[k] for k in ('colores', 'piezas', 'caminos')}
    M.update(id='magnifica-s-cadena', nombre=base['nombre'], construir=True, pasos=pasos, recorrido=recorrido,
             titulo_fijo='Cómo inventar una cafetera automática', soluciones=n, palabras=P,
             sonido=dict(estilo='asmr', volumen_general_db=-27, ambiente=.12,
                         musica=dict(bpm=96, acordes=[["A2", "C#3", "E3", "G#3"], ["F#2", "A2", "C#3", "E3"],
                                                      ["D2", "F#2", "A2", "C#3"], ["E2", "G#2", "B2", "D3"]], volumen=.16),
                         efectos=efectos))
    json.dump(M, open(os.path.join(MODELOS, 'magnifica-s-cadena.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print(f'{len(pasos)} golpes · {n} soluciones · {fin:.1f} s · tiempos {"de la voz" if real else "ESTIMADOS (falta palabras.json)"}')
    for g, t in zip(GUION, inicios):
        print(f'  {t:5.2f}  {g["t"]:9} {g["frase"]}')


main()
