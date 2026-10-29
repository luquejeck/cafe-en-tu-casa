"""Pasa una foto 3:4 a 9:16 sin recortarla: la foto va abajo y el cielo de arriba
se completa estirando y desenfocando la franja superior de la misma foto."""
import sys
from PIL import Image, ImageFilter
src, out, top = sys.argv[1], sys.argv[2], int(sys.argv[3])
W, H = 1080, 1920
foto = Image.open(src).convert('RGB')
foto = foto.resize((W, round(foto.height * W / foto.width)), Image.LANCZOS)
lienzo = Image.new('RGB', (W, H))
franja = foto.crop((0, 0, W, 6)).resize((W, top + 300), Image.BICUBIC).filter(ImageFilter.GaussianBlur(8))
lienzo.paste(franja, (0, 0))
fundido = 280
mascara = Image.linear_gradient('L').resize((W, fundido))
m = Image.new('L', foto.size, 255); m.paste(mascara, (0, 0))
lienzo.paste(foto, (0, top), m)
lienzo.save(out, quality=88, optimize=True)
