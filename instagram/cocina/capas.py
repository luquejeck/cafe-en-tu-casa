"""Separa cada escena en tres capas para el parallax 2.5D del montaje.

  fondo  (NN-fondo.jpg): la cocina, con el hombre y la mesada rellenados (inpaint) para que no queden huecos
  hombre (NN-hombre.png): el personaje recortado, con borde suave
  frente (NN-frente.png): la mesada y lo que está sobre ella, de la línea de la isla para abajo

Uso:  python3 instagram/cocina/capas.py <modelo-segmentacion.tflite>
(selfie_multiclass_256x256.tflite de MediaPipe; necesita mediapipe, opencv-python-headless y libegl1)
"""
import os, sys, glob
import numpy as np, cv2, mediapipe as mp
from mediapipe.tasks.python import vision, BaseOptions

AQUI = os.path.dirname(os.path.abspath(__file__))
seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
    base_options=BaseOptions(model_asset_path=sys.argv[1]), output_confidence_masks=True))

for ruta in sorted(glob.glob(os.path.join(AQUI, 'escenas', '*.jpg'))):
    n = os.path.basename(ruta)[:2]
    img = cv2.imread(ruta); h, w = img.shape[:2]
    r = seg.segment(mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(img, cv2.COLOR_BGR2RGB)))
    m = np.squeeze(1 - r.confidence_masks[0].numpy_view()).astype(np.float32)
    m = cv2.resize(m, (w, h))
    duro = (m > .5).astype(np.uint8)
    # quedarse con la mancha más grande (el hombre)
    k, lab, st, _ = cv2.connectedComponentsWithStats(duro)
    if k > 1:
        big = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]); duro = (lab == big).astype(np.uint8)
    filas = np.where(duro.sum(1) > w * .03)[0]
    linea = int(filas.max()) if len(filas) else int(h * .62)          # donde el hombre "entra" en la isla
    linea = min(max(linea, int(h * .45)), int(h * .85))
    # capas con borde suave
    hombre_a = cv2.GaussianBlur(duro.astype(np.float32), (0, 0), 1.6)
    frente_a = np.zeros((h, w), np.float32); frente_a[linea - 6:, :] = 1
    frente_a = cv2.GaussianBlur(frente_a, (0, 0), 3) * (1 - hombre_a * (np.arange(h)[:, None] < linea + 30))
    # fondo: rellenar el hombre y una franja de la isla (lo que puede quedar al descubierto)
    hueco = cv2.dilate(duro, np.ones((25, 25), np.uint8)); hueco[linea - 40:linea + 30, :] = 1
    chico = cv2.resize(img, (w // 2, h // 2)); hueco_c = cv2.resize(hueco, (w // 2, h // 2), interpolation=cv2.INTER_NEAREST)
    relleno = cv2.resize(cv2.inpaint(chico, hueco_c, 9, cv2.INPAINT_TELEA), (w, h))
    fondo = np.where(hueco[..., None] > 0, relleno, img)
    cv2.imwrite(os.path.join(AQUI, 'capas', f'{n}-fondo.jpg'), fondo, [cv2.IMWRITE_JPEG_QUALITY, 90])
    for nom, a in (('hombre', hombre_a), ('frente', frente_a)):
        rgba = np.dstack([img, (np.clip(a, 0, 1) * 255).astype(np.uint8)])
        cv2.imwrite(os.path.join(AQUI, 'capas', f'{n}-{nom}.png'), rgba)
    print(n, 'línea de la isla', linea, '/', h)
os._exit(0)
