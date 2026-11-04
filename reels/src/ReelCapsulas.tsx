// Video "La verdad incómoda sobre las cápsulas" (edit/capsulas): ReelKit + remates graciosos.
// Los tiempos salen de las palabras de captions.json (props.captions), no a ojo.
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ReelKit, ReelKitProps } from "./ReelKit";

type Word = { text: string; start: number; end: number };
const norm = (s: string) => s.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
const wordsOf = (p: ReelKitProps): Word[] => ((p as any).captions?.words ?? []) as Word[];
const atWord = (ws: Word[], w: string, n = 1, edge: "start" | "end" = "start") => {
  const hits = ws.filter((x) => norm(x.text) === norm(w));
  if (hits.length < n) throw new Error(`no word “${w}” #${n}`);
  return hits[n - 1][edge];
};

const INK = "#101012";
const ACCENT = "#a3c26a";
const FONT = "Inter, sans-serif";

/** Sticker de remate: entra con rebote, queda torcido y sale rápido. Es la marca de "esto es chiste". */
const Remate: React.FC<{ from: number; to: number; text: string; x: number; y: number; rot?: number; size?: number; bg?: string; color?: string }> = (
  { from, to, text, x, y, rot = -6, size = 74, bg = ACCENT, color = INK }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = Math.round(from * fps), b = Math.round(to * fps);
  if (f < a || f > b) return null;
  const pop = spring({ frame: f - a, fps, config: { damping: 9, stiffness: 180, mass: 0.6 } });
  const out = interpolate(f, [b - 6, b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const wob = Math.sin((f - a) / 5) * 1.5;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot + wob}deg) scale(${pop * out})`,
      background: bg, color, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: "-0.03em", lineHeight: 1,
      padding: "22px 34px 24px", borderRadius: 26, whiteSpace: "nowrap", boxShadow: "0 14px 0 rgba(16,16,18,.9)" }}>
      {text}
    </div>
  );
};

/** Burbuja chica en cursiva para los silencios de la toma fallida. */
const Silencio: React.FC<{ from: number; to: number; text: string; x?: number; y: number }> = ({ from, to, text, x = 540, y }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = Math.round(from * fps), b = Math.round(to * fps);
  if (f < a || f > b) return null;
  const k = interpolate(f, [a, a + 6, b - 4, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dots = ".".repeat(1 + (Math.floor((f - a) / 8) % 3));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * k})`, opacity: k,
      background: "rgba(16,16,18,.82)", color: "#f5f5f7", fontFamily: FONT, fontStyle: "italic", fontWeight: 700, fontSize: 48,
      padding: "16px 30px", borderRadius: 999, whiteSpace: "nowrap" }}>
      {text}{dots}
    </div>
  );
};

/** Marco de "toma fallida": REC parpadeando, número de toma y el video en tono lavado. */
const TomaFallida: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = Math.round(from * fps), b = Math.round(to * fps);
  if (f < a || f > b) return null;
  const on = Math.floor((f - a) / 15) % 2 === 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ border: "10px solid rgba(245,245,247,.85)", margin: 40, borderRadius: 30 }} />
      <div style={{ position: "absolute", left: 90, top: 250, display: "flex", alignItems: "center", gap: 14,
        fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#f5f5f7", letterSpacing: "0.08em" }}>
        <span style={{ width: 26, height: 26, borderRadius: 13, background: "#ff3b30", opacity: on ? 1 : 0.2 }} />
        REC · TOMA 7
      </div>
    </AbsoluteFill>
  );
};

export const ReelCapsulas: React.FC<ReelKitProps> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ws = wordsOf(p);
  const t = f / fps;

  // tiempos del video terminado, anclados a palabras
  const cocina = atWord(ws, "cocina", 1, "end");      // fin del gancho: después vuela el bowl
  const es = atWord(ws, "Es", 1);                     // vuelve a hablar
  const tiro = cocina + 0.75;                          // el bowl sale despedido
  const ya = atWord(ws, "ya", 1);
  const toma = atWord(ws, "por", 5);                   // arranca la toma fallida
  const tomar = atWord(ws, "tomar", 2);
  const cafe = atWord(ws, "café", 4, "end");
  const bueno = atWord(ws, "bueno", 2);
  const fin = toma + 3.833;

  // sacudón de cámara en el tiro (8 frames)
  const sh = f >= Math.round(tiro * fps) && f < Math.round(tiro * fps) + 8
    ? Math.sin((f - tiro * fps) * 2.4) * 10 * (1 - (f - tiro * fps) / 8) : 0;
  // flash blanco suave en el tiro
  const flash = interpolate(t, [tiro - 0.02, tiro + 0.03, tiro + 0.25], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // la toma fallida en tono lavado
  const blooper = t >= toma && t <= fin;

  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      <AbsoluteFill style={{ transform: `translate(${sh}px, ${sh * 0.6}px)`,
        filter: blooper ? "grayscale(0.85) contrast(1.08) brightness(0.95)" : undefined }}>
        <ReelKit {...p} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />

      <Remate from={tiro - 0.05} to={es - 0.1} text="¡Chau, cápsulas! 👋" x={540} y={380} rot={-7} />
      <Remate from={ya} to={ya + 0.75} text="¡YA! 😁" x={790} y={330} rot={8} size={88} />

      <TomaFallida from={toma} to={fin} />
      <Remate from={toma + 0.05} to={fin} text="Lo que no viste 😅" x={735} y={340} rot={-4} size={60} />
      <Silencio from={toma + 0.35} to={tomar - 0.05} text="silencio incómodo" x={760} y={1000} />
      <Silencio from={cafe + 0.15} to={bueno - 0.05} text="sigue pensando" x={760} y={1000} />
    </AbsoluteFill>
  );
};
