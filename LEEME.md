# Café en tu Casa

Sitio de venta de cafeteras. HTML + CSS + JavaScript puro, sin build ni dependencias:
se publica en Vercel desde GitHub, sin paso de compilación.

---

## 1. Lo que tenés que saber para editar

**Todos los datos de producto viven en un solo archivo: `assets/js/productos.js`.**
No hace falta tocar el HTML para cambiar precios, cuotas ni links.

### Cambiar un precio

Abrí `assets/js/productos.js` y buscá el producto. Cada uno tiene:

```js
precioLista: 1391499,   // precio "tachado" (el de lista en ML)
precioML:    1294094,   // precio real al que se vende en Mercado Libre
cuotas:      9,         // cuántas cuotas sin interés ofrece esa publicación
```

Con eso el sitio calcula solo:

| Se calcula | Cómo |
|---|---|
| Precio por transferencia | `precioML` − 20% |
| Cuánto ahorra el cliente | la diferencia |
| Valor de cada cuota | `precioML` ÷ `cuotas` |
| Mensaje de WhatsApp | se arma con el nombre y el precio final |

**Solo cambiás dos números y se actualiza el home, la ficha, la tabla comparativa,
la barra de compra del celular y los datos para Google.**

### Cambiar el porcentaje de descuento

Arriba de todo, en `TIENDA`:

```js
descuentoTransferencia: 0.20,   // 0.20 = 20%. Para 15% poné 0.15
```

Cambia en todo el sitio de una: barra superior, botones, textos, tabla y preguntas frecuentes.

### Cambiar el WhatsApp o el mail

```js
whatsapp: '5491136567560',        // sin +, sin espacios ni guiones
whatsappVisible: '+54 11 3656-7560',
email: 'stokedstay@gmail.com',
```

### Marcar un producto sin stock

```js
stock: false,
```

La ficha pasa a decir "Sin stock por el momento" en rojo.

### Cambiar el link de Mercado Libre

```js
linkML: 'https://www.mercadolibre.com.ar/...',
```

> Importante: cuando republicás en ML el link cambia. Si el botón azul lleva a una
> publicación vieja o pausada, es esto.

---

## 2. Agregar más fotos a un producto

Hoy cada máquina tiene una sola foto y por eso no aparecen las miniaturas.
Poné las fotos nuevas en `assets/img/` y sumalas al array:

```js
imgs: [
  'assets/img/magnifica-s.webp',
  'assets/img/magnifica-s-2.webp',
  'assets/img/magnifica-s-3.webp'
],
```

Con dos o más fotos aparece sola la galería con miniaturas clickeables.

**Recomendación:** fotos cuadradas, mínimo 1000×1000, fondo blanco.

### Las imágenes de preview (cuando compartís el link)

`assets/img/og.jpg` y `og-*.jpg` son las que se ven al pegar el link en WhatsApp,
Instagram o Facebook. Están armadas a 1200×630, que es la medida que esas apps esperan.

A propósito **no llevan precios**: si los tuvieran, cada cambio de precio te obligaría a
rehacer las 4 imágenes o quedarían mostrando un valor viejo en cada link que compartas.

---

## 3. Agregar un producto nuevo

1. Copiá un bloque entero de `PRODUCTOS` en `productos.js` y cambiale los datos.
   El `id` tiene que ser único y sin espacios (ej: `'dedica-arte'`).
2. Duplicá `magnifica-s.html`, renombralo con ese mismo id (`dedica-arte.html`) y
   cambiale tres cosas en el archivo nuevo:
   - el `<title>` y el `<meta name="description">`
   - las etiquetas `og:` (título, descripción, imagen) y el `<link rel="canonical">`
   - `<body data-producto="dedica-arte">` ← **esto es lo que conecta la página con los datos**
3. Sumalo al menú del pie de página y a `sitemap.xml`.

El home, la tabla comparativa y la sección "Otros modelos" se actualizan solas.

---

## 4. Publicar en Vercel

El sitio se publica desde GitHub: cada vez que subas un cambio, Vercel lo publica solo.

### Una sola vez: conectar el proyecto

1. Creá un repositorio vacío en [github.com/new](https://github.com/new).
   Ponele `cafe-en-tu-casa`, dejalo **privado** si querés, y **no** marques ninguna opción de
   "Add a README" ni "Add .gitignore" (el repo local ya los tiene).
2. Copiá la URL que te da GitHub y desde esta carpeta corré:

   ```bash
   git remote add origin https://github.com/TU-USUARIO/cafe-en-tu-casa.git
   git push -u origin main
   ```

3. Entrá a [vercel.com/new](https://vercel.com/new), elegí *Import Git Repository* y
   seleccioná el repo.
4. Vercel te va a preguntar el framework: elegí **Other**. Dejá vacíos los campos de
   *Build Command* y *Output Directory* — este sitio no se compila, son archivos sueltos.
5. *Deploy*. En menos de un minuto tenés la URL.

### Cada vez que cambies algo

```bash
git add -A
git commit -m "Actualizo precios"
git push
```

Y listo: Vercel publica solo en unos segundos.

### Cuando sepas la URL definitiva

Reemplazá `https://cafe-en-tu-casa.vercel.app` por la URL real (o tu dominio propio) en:

- `assets/js/productos.js` → campo `url` de `TIENDA`
- `index.html`, `magnifica-s.html`, `krups-roma.html`, `dedica.html` → el `<link rel="canonical">`
  y la etiqueta `og:image` de cada uno
- `robots.txt` y `sitemap.xml`

Son 14 lugares en total. Si me pasás la URL lo hago de una.

> **Importante:** hasta que eso esté corregido, cuando compartas el link por WhatsApp la vista
> previa no va a mostrar la imagen, porque apunta a un dominio que todavía no existe.

### Dar de baja el sitio de Netlify

Como Vercel lo reemplaza, conviene que el viejo no quede online con el mismo contenido:
Google lo lee como contenido duplicado y puede perjudicar a los dos.

En [app.netlify.com](https://app.netlify.com) → tu sitio → *Site configuration* → abajo de todo
*Delete this site*. Si preferís no borrarlo, al menos entrá a *Build & deploy* → *Post processing*
y poné el sitio en modo privado con contraseña.

---

## 5. Ver el sitio en tu compu antes de publicar

No lo abras con doble clic (`file://`) porque el navegador bloquea los scripts.
Abrí una terminal en esta carpeta y corré:

```bash
python -m http.server 4173
```

Después entrá a `http://localhost:4173`.

---

## 6. Estructura de archivos

```
index.html            Home
magnifica-s.html      Ficha De'Longhi Magnifica S
krups-roma.html       Ficha Krups Roma EA8105
dedica.html           Ficha De'Longhi Dedica EC685
404.html              Página de error

assets/css/estilos.css    Todo el diseño (comentado por secciones)
assets/js/productos.js    ← DATOS: precios, specs, links. Es el que vas a tocar
assets/js/app.js          Lógica: arma las páginas con esos datos

vercel.json           Cache y cabeceras de seguridad
.gitignore            Que no subir al repositorio
robots.txt            Permisos para Google
sitemap.xml           Mapa del sitio para Google
```

---

## 7. Cómo está pensada la venta

Cada producto muestra **dos caminos de pago, siempre juntos**:

1. **Transferencia o efectivo (20% OFF)** — tarjeta verde, destacada, arriba.
   El botón abre WhatsApp con un mensaje ya escrito que incluye el modelo y el precio
   final con descuento, así no hay que explicar nada.
2. **Tarjeta en Mercado Libre** — tarjeta azul, con el precio de lista tachado, el precio
   de venta y el valor de la cuota en verde.

Esto aparece en la ficha de cada producto, en el home (sección "Cómo comprar") y —en
celular— en una barra fija abajo de la pantalla con los dos botones siempre a mano.

---

## 8. Pendientes sugeridos

- **Más fotos por producto.** Es lo que más impacto tendría; con una sola foto la galería
  queda pobre comparada con Mercado Libre.
- **La foto de la Dedica es la versión blanca (EC685.W)**, pero el link de Mercado Libre
  apunta a la de acero. Conviene unificar: o cambiás la foto, o cambiás el link.
- **Verificar los links de ML.** Los de Krups y Dedica que pasaste son distintos a los que
  tenía el sitio anterior; están cargados los nuevos.
- **Confirmar "envío gratis" y "devolución gratis"** — están escritos como promesa firme en
  varios lugares. Si no aplica siempre, hay que matizarlo.
- **Google Analytics o Meta Pixel**, si querés medir cuántos tocan cada botón. Los botones ya
  tienen `data-evento` (`wa-comprar`, `ml-comprar`, `wa-barra`, etc.) listos para enganchar.
