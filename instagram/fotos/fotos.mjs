// Arma los posts de foto (las imágenes de Google Flow con la marca encima)
// en assets/img/ig/:   node instagram/fotos/fotos.mjs
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

// playwright se busca como en filmar.mjs: en instagram/ o vía NODE_PATH
const { chromium } = createRequire(import.meta.url)("playwright");
const aqui = path.dirname(fileURLToPath(import.meta.url));
const salida = path.join(aqui, "..", "..", "assets/img/ig");

export const FOTOS = [
  { id: "f1-espresso-magnifica", foto: "espresso-magnifica.jpg" },
  { id: "f2-pareja-magnifica", foto: "pareja-magnifica.jpg", ep: "Magnifica S", titulo: "Café de cafetería, <em>en tu casa.</em>" },
  { id: "f3-home-office-magnifica", foto: "home-office-magnifica.jpg", ep: "Home office", titulo: "El mejor café del día, <em>sin salir.</em>" },
  { id: "f4-sobremesa-dedica", foto: "sobremesa-dedica.jpg", ep: "Dedica EC685", titulo: "La sobremesa,<br><em>con café de verdad.</em>" },
];

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1350 } });
for (const f of FOTOS) {
  const url = pathToFileURL(path.join(aqui, "foto.html"));
  url.search = new URLSearchParams({ foto: f.foto, ep: f.ep || "", titulo: f.titulo || "" });
  await pagina.goto(url.href);
  await pagina.waitForFunction(() => document.getElementById("foto").complete);
  await pagina.screenshot({ path: path.join(salida, `${f.id}.jpg`), type: "jpeg", quality: 92 });
  console.log(f.id);
}
await navegador.close();
