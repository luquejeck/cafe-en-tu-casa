// Arma la página del calendario (instagram/calendario/index.html) con todo
// lo de assets/img/ig/: es lo que se publica como artifact.
// Correr después de generar.js y filmar.mjs:   node instagram/calendario.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.join(aqui, "..");
const IG = "assets/img/ig";

/* El mes arranca este lunes; cada pieza cae según su semana y su día. */
const INICIO = "2026-10-12";
const DIA = { Lunes: 0, Martes: 1, Miércoles: 2, Jueves: 3, Viernes: 4, Sábado: 5 };
const CORTO = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
const SEMANAS = [
  { tema: "Arranque con videos", bajada: "Tres videos antes de que empiece el calendario" },
  { tema: "Presentación", bajada: "Las tres cafeteras, cómo se compra y el test" },
  { tema: "Magnifica S", bajada: "La más vendida, a fondo, y la cuenta del café" },
  { tema: "Krups Roma y guía de compra", bajada: "La más accesible, y cómo elegir entre automática y manual" },
  { tema: "Dedica y confianza", bajada: "La ultracompacta, envíos, garantía y preguntas frecuentes" },
];
const NOTAS = {
  reel: "Va sin música: agregala en Instagram al subirlo (Agregar audio). La portada se descarga aparte.",
  opciones: "Es el fondo: sumale el sticker de encuesta o de preguntas desde Instagram.",
};

const leer = (f) => fs.readFileSync(path.join(raiz, f), "utf8");
const PIEZAS = vm.runInNewContext(leer("assets/js/productos.js") + "\n" + leer("instagram/contenido.js") + "\nPIEZAS", { module: {} });
const VIDEOS = vm.runInNewContext(leer("assets/js/productos.js") + "\n" + leer("instagram/videos.js") + "\nVIDEOS", { module: {} });

const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const archivos = {}; // ruta publicada -> archivo en disco (relativo a la raíz del proyecto)
function medio(nombre) {
  const origen = `${IG}/${nombre}`;
  if (!fs.existsSync(path.join(raiz, origen))) throw new Error(`Falta ${origen}: corré generar.js y filmar.mjs`);
  archivos[`media/${nombre}`] = origen;
  return `media/${nombre}`;
}

const piezas = PIEZAS.map((p) => {
  const d = new Date(INICIO + "T12:00:00");
  d.setDate(d.getDate() + (p.semana - 1) * 7 + DIA[p.dia]);
  const fecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const archivo = `${fecha.slice(5)}-${CORTO[d.getDay()]}-${slug(p.titulo)}`;
  const esReel = p.tipo === "reel";
  const placas = esReel ? [] : p.placas.map((_, n) => ({
    src: medio(`${p.id}-${n + 1}.jpg`),
    nombre: `${archivo}-${String(n + 1).padStart(2, "0")}.jpg`,
  }));
  const portada = esReel ? medio(`${p.id}-1.jpg`) : null;
  return {
    id: p.id, semana: p.semana + 1, fecha, tipo: p.tipo, titulo: p.titulo, archivo,
    hora: p.tipo === "historia" ? "A la mañana" : "10:00",
    tapa: portada || placas[0].src,
    placas,
    video: esReel ? { src: medio(`${p.id}.mp4`), nombre: `${archivo}.mp4`, portada, portadaNombre: `${archivo}-portada.jpg` } : null,
    texto: p.caption.trim(),
    nota: esReel ? NOTAS.reel : p.placas[0].t === "opciones" ? NOTAS.opciones : "",
  };
});

/* Los videos: tres por semana, a las 18:00 para no pisarse con lo de la
   mañana. Arrancan el jueves 8/10 y se intercalan uno de compra o producto
   con uno de tips. */
const FECHAS_VIDEOS = {
  "v04-magnifica-s-en-15-segundos": "2026-10-08",
  "v07-cortado-cappuccino-o-latte": "2026-10-09",
  "v01-comprar-en-3-pasos": "2026-10-10",
  "v06-molienda-fina-o-gruesa": "2026-10-12",
  "v02-transferencia-o-cuotas": "2026-10-14",
  "v09-3-habitos-para-un-cafe-mejor": "2026-10-16",
  "v05-5-cosas-de-la-magnifica-s": "2026-10-19",
  "v08-grano-entero-o-molido": "2026-10-21",
  "v03-pagaste-y-ahora": "2026-10-23",
  "v10-la-magnifica-s-es-para-vos": "2026-10-26",
};
const videos = VIDEOS.map((v) => {
  const fecha = FECHAS_VIDEOS[v.id];
  const d = new Date(fecha + "T12:00:00");
  const semana = Math.floor((d - new Date("2026-10-05T12:00:00")) / (7 * 864e5)) + 1;
  const archivo = `${fecha.slice(5)}-${CORTO[d.getDay()]}-${slug(v.titulo)}`;
  const portada = medio(`${v.id}-portada.jpg`);
  return {
    id: v.id, semana, fecha, hora: "18:00", tipo: "reel", titulo: v.titulo, archivo, tapa: portada, placas: [],
    video: { src: medio(`${v.id}.mp4`), nombre: `${archivo}.mp4`, portada, portadaNombre: `${archivo}-portada.jpg` },
    texto: v.caption.trim(),
    nota: "Sale como reel y se comparte en historias. Va sin música: agregala en Instagram al subirlo (Agregar audio).",
  };
});

// Todo junto, en el orden en que sale
const orden = (p) => `${p.fecha} ${p.hora === "A la mañana" ? "09:00" : p.hora}`;
const todas = [...piezas, ...videos].sort((a, b) => orden(a).localeCompare(orden(b)));

const out = path.join(aqui, "calendario");
fs.mkdirSync(out, { recursive: true });
const json = JSON.stringify({ semanas: SEMANAS, piezas: todas }).replace(/</g, "\\u003c");
const plantilla = fs.readFileSync(path.join(aqui, "calendario.plantilla.html"), "utf8");
fs.writeFileSync(path.join(out, "index.html"), plantilla.replace("__DATOS__", () => json));
fs.writeFileSync(path.join(out, "archivos.json"), JSON.stringify(archivos, null, 1));

const peso = Object.values(archivos).reduce((s, f) => s + fs.statSync(path.join(raiz, f)).size, 0);
console.log(Object.keys(archivos).length, "archivos,", (peso / 1048576).toFixed(1), "MB");
