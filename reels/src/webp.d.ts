// Imágenes .webp importadas desde el código (Remotion las sirve con webpack)
declare module "*.webp" {
  const src: string;
  export default src;
}
