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
  { tema: "Presentación", bajada: "Las tres cafeteras, cómo se compra y el test" },
  { tema: "Magnifica S", bajada: "La más vendida, a fondo, y la cuenta del café" },
  { tema: "Krups Roma y guía de compra", bajada: "La más accesible, y cómo elegir entre automática y manual" },
  { tema: "Dedica y confianza", bajada: "La ultracompacta, envíos, garantía y preguntas frecuentes" },
];
const NOTAS = {
  reel: "Va sin música: agregala en Instagram al subirlo (Agregar audio). La portada se descarga aparte.",
  opciones: "Es el fondo: sumale el sticker de encuesta o de preguntas desde Instagram.",
};

const fuente = ["assets/js/productos.js", "instagram/contenido.js"].map((f) => fs.readFileSync(path.join(raiz, f), "utf8")).join("\n");
const PIEZAS = vm.runInNewContext(fuente + "\nPIEZAS", { module: {} });

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
    id: p.id, semana: p.semana, fecha, tipo: p.tipo, titulo: p.titulo, archivo,
    hora: p.tipo === "historia" ? "A la mañana" : "10:00",
    tapa: portada || placas[0].src,
    placas,
    video: esReel ? { src: medio(`${p.id}.mp4`), nombre: `${archivo}.mp4`, portada, portadaNombre: `${archivo}-portada.jpg` } : null,
    texto: p.caption.trim(),
    nota: esReel ? NOTAS.reel : p.placas[0].t === "opciones" ? NOTAS.opciones : "",
  };
});

const out = path.join(aqui, "calendario");
fs.mkdirSync(out, { recursive: true });
const json = JSON.stringify({ semanas: SEMANAS, piezas }).replace(/</g, "\\u003c");
const plantilla = fs.readFileSync(path.join(aqui, "calendario.plantilla.html"), "utf8");
fs.writeFileSync(path.join(out, "index.html"), plantilla.replace("__DATOS__", () => json));
fs.writeFileSync(path.join(out, "archivos.json"), JSON.stringify(archivos, null, 1));

const peso = Object.values(archivos).reduce((s, f) => s + fs.statSync(path.join(raiz, f)).size, 0);
console.log(Object.keys(archivos).length, "archivos,", (peso / 1048576).toFixed(1), "MB");
