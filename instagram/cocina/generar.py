"""Genera las escenas del reel con Gemini (modelos de imagen de Google, los mismos de Flow).

Uso:  GEMINI_API_KEY=... python3 instagram/cocina/generar.py <id> "<prompt>" [referencia.png ...]
Deja instagram/cocina/escenas/<id>.png (9:16). La clave se lee de la variable de entorno; nunca va al repo.
"""
import base64, json, os, sys, urllib.request

MODELO = os.environ.get('MODELO', 'gemini-3-pro-image')
AQUI = os.path.dirname(os.path.abspath(__file__))
ESTILO = ("3D animated feature film style (Pixar-like), soft global illumination, warm golden morning light, "
          "vertical 9:16 frame, the man and the kitchen island in the lower two thirds, calm wall area at the top. No text, no letters, no watermark.")

def main(id_, prompt, *refs):
    partes = [{'text': f'{prompt}\n\n{ESTILO}'}]
    for r in refs:
        partes.append({'inline_data': {'mime_type': 'image/png' if r.endswith('png') else 'image/jpeg',
                                       'data': base64.b64encode(open(r, 'rb').read()).decode()}})
    cuerpo = {'contents': [{'parts': partes}],
              'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': '9:16'}}}
    req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{MODELO}:generateContent',
                                 data=json.dumps(cuerpo).encode(), method='POST',
                                 headers={'content-type': 'application/json', 'x-goog-api-key': os.environ['GEMINI_API_KEY']})
    r = json.load(urllib.request.urlopen(req, timeout=300))
    for c in r.get('candidates', []):
        for p in c.get('content', {}).get('parts', []):
            d = p.get('inlineData') or p.get('inline_data')
            if d:
                out = os.path.join(AQUI, 'escenas', f'{id_}.png')
                open(out, 'wb').write(base64.b64decode(d['data'])); print('ok', out); return
    print('SIN IMAGEN', json.dumps(r)[:600]); sys.exit(1)

main(*sys.argv[1:])
