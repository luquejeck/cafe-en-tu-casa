// Video "La verdad incómoda sobre las cápsulas" (edit/capsulas): ReelKit + gancho y remates, estilo sobrio (Apple).
// Los tiempos salen de las palabras de captions.json (props.captions), no a ojo.
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ReelKit, ReelKitProps } from "./ReelKit";

type Word = { text: string; start: number; end: number };
const norm = (s: string) => s.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
const wordsOf = (p: ReelKitProps): Word[] => ((p as any).captions?.words ?? []) as Word[];
const atWord = (ws: Word[], w: string, n = 1, edge: "start" | "end" = "start") => {
  const hits = ws.filter((x) => norm(x.text) === norm(w));
  if (hits.length < n) throw new Error(`no word “${w}” #${n}`);
  return hits[n - 1][edge];
};

const WHITE = "#f5f5f7";
const GREEN = "#a3c26a";
const FONT = "Inter, sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.out(Easing.cubic);

/** Una línea que se revela: de desenfocada y un poco abajo a nítida. Sale con fundido. */
const Revela: React.FC<{ t: number; from: number; to: number; text: string; size: number; weight?: number; color?: string; y: number }> = (
  { t, from, to, text, size, weight = 700, color = WHITE, y }) => {
  if (t < from || t > to) return null;
  const k = interpolate(t, [from, from + 0.45], [0, 1], { ...clamp, easing: out });
  const o = interpolate(t, [to - 0.25, to], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: FONT, fontWeight: weight,
      fontSize: size, lineHeight: 1.02, letterSpacing: "-0.045em", color, opacity: k * o,
      filter: `blur(${(1 - k) * 18}px)`, transform: `translateY(${(1 - k) * 24}px) scale(${0.96 + 0.04 * k})` }}>
      {text}
    </div>
  );
};

/** Texto fino sobre el video, para los remates: sin cajas ni emojis. */
const Nota: React.FC<{ t: number; from: number; to: number; text: string; x?: number; y: number; size?: number; italic?: boolean; align?: "left" | "center" }> = (
  { t, from, to, text, x = 540, y, size = 56, italic = false, align = "center" }) => {
  if (t < from || t > to) return null;
  const k = interpolate(t, [from, from + 0.3], [0, 1], { ...clamp, easing: out });
  const o = interpolate(t, [to - 0.2, to], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: align === "center" ? 0 : x, right: align === "center" ? 0 : undefined, top: y,
      textAlign: align, whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 500, fontStyle: italic ? "italic" : "normal", fontSize: size,
      letterSpacing: "-0.02em", color: WHITE, opacity: k * o, transform: `translateY(${(1 - k) * 14}px)` }}>
      {italic ? (
        <span style={{ display: "inline-block", padding: "14px 28px", borderRadius: 999, background: "rgba(16,16,18,.38)",
          backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>{text}</span>
      ) : text}
    </div>
  );
};

/** «Molido hace meses.»: la primera línea entra fina, «meses.» aparece letra a letra. */
const Meses: React.FC<{ t: number; from: number; to: number; y: number }> = ({ t, from, to, y }) => {
  if (t < from || t > to) return null;
  const o = interpolate(t, [to - 0.2, to], [1, 0], clamp);
  const k = interpolate(t, [from, from + 0.3], [0, 1], { ...clamp, easing: out });
  const word = "meses.";
  const shown = Math.floor(interpolate(t, [from + 0.25, from + 0.85], [0, word.length], clamp));
  return (
    <div style={{ position: "absolute", left: 68, top: y, textAlign: "left", fontFamily: FONT, color: WHITE, opacity: o }}>
      <div style={{ fontSize: 38, fontWeight: 500, letterSpacing: "-0.02em", opacity: k, transform: `translateY(${(1 - k) * 12}px)` }}>Molido hace</div>
      <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: "0.02em", color: GREEN, lineHeight: 1.05 }}>
        {word.split("").map((ch, i) => (
          <span key={i} style={{ opacity: i < shown ? 1 : 0.12 }}>{ch}</span>
        ))}
      </div>
    </div>
  );
};

/** Cápsula dibujada con líneas finas; una línea verde la tacha. */
const CapsulaTachada: React.FC<{ t: number; from: number; tacha: number; to: number; x: number; y: number }> = ({ t, from, tacha, to, x, y }) => {
  if (t < from || t > to) return null;
  const k = interpolate(t, [from, from + 0.3], [0, 1], { ...clamp, easing: out });
  const o = interpolate(t, [to - 0.15, to], [1, 0], clamp);
  const line = interpolate(t, [tacha, tacha + 0.22], [0, 1], { ...clamp, easing: out });
  return (
    <svg width={150} height={150} viewBox="0 0 220 220" style={{ position: "absolute", left: x - 75, top: y - 75, opacity: k * o,
      transform: `scale(${0.9 + 0.1 * k})` }}>
      <g fill="none" stroke={WHITE} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M60 70 H160" />
        <path d="M66 70 L82 168 Q110 180 138 168 L154 70" />
        <path d="M54 60 Q110 46 166 60" />
      </g>
      <path d="M40 180 L180 40" stroke={GREEN} strokeWidth={10} strokeLinecap="round"
        strokeDasharray={200} strokeDashoffset={200 * (1 - line)} />
    </svg>
  );
};

export const ReelCapsulas: React.FC<ReelKitProps> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ws = wordsOf(p);
  const t = f / fps;

  const es = atWord(ws, "Es", 1);                     // vuelve a hablar
  const tiro = es - 1.7;                               // el bowl sale despedido (en cámara lenta, cut.json: eb_slow)
  const viejo = atWord(ws, "viejo", 1);
  const pote = atWord(ws, "pote", 1);
  const plastico = atWord(ws, "plástico", 1);
  const no = atWord(ws, "no", 1);
  const cafe2 = atWord(ws, "por", 2);                  // ahí entra el B-roll: el re-gancho sale antes
  const toma = atWord(ws, "por", ws.filter((w) => norm(w.text) === "por").length); // la última: arranca la toma fallida
  const tomar = atWord(ws, "tomar", 2);
  const cafe = atWord(ws, "café", ws.filter((w) => norm(w.text) === "café").length, "end");
  const bueno = atWord(ws, "bueno", 2);
  const fin = ws[ws.length - 1].end + 0.6;

  // gancho: zoom lento hacia la cara y oscurecido suave arriba para que el blanco se lea
  const hookEnd = 2.3;
  const hookZoom = t < hookEnd ? 1.0 + 0.06 * interpolate(t, [0, hookEnd], [0, 1], clamp) : 1;
  const hookShade = interpolate(t, [0, 0.3, hookEnd - 0.3, hookEnd], [0, 0.42, 0.42, 0], clamp);
  // remate del tiro: zoom de golpe (punch-in) de 1.0 a 1.12 en 4 frames, se sostiene y vuelve
  const punch = interpolate(t, [tiro - 0.05, tiro + 0.08, es - 0.35, es - 0.1], [1, 1.12, 1.12, 1], { ...clamp, easing: out });
  // la toma fallida en blanco y negro
  const blooper = t >= toma - 0.02 && t <= fin;

  return (
    <AbsoluteFill style={{ backgroundColor: "#101012" }}>
      <AbsoluteFill style={{ transform: `scale(${hookZoom * punch})`, filter: blooper ? "grayscale(1) contrast(1.06)" : undefined }}>
        <ReelKit {...p} />
      </AbsoluteFill>

      {/* gancho */}
      <AbsoluteFill style={{ background: "linear-gradient(rgba(16,16,18,1), rgba(16,16,18,0) 45%)", opacity: hookShade }} />
      <Revela t={t} from={0.1} to={hookEnd} text="La verdad" size={96} y={252} />
      <Revela t={t} from={0.5} to={hookEnd} text="incómoda." size={118} weight={800} color={GREEN} y={344} />

      {/* remate del tiro */}
      <Nota t={t} from={tiro + 0.05} to={es - 0.1} text="Chau, cápsulas." y={330} size={72} />

      {/* «café viejo»: Molido hace meses + cápsula tachada (dentro del campo de la escena split) */}
      <Meses t={t} from={viejo + 0.1} to={plastico + 0.12} y={705} />
      <CapsulaTachada t={t} from={pote - 0.05} tacha={plastico} to={plastico + 0.12} x={880} y={790} />

      {/* re-gancho a mitad del video */}
      <Nota t={t} from={no - 0.1} to={cafe2 - 0.05} text="Y lo mejor viene al final…" x={440} y={270} size={40} italic align="left" />

      {/* toma fallida */}
      {blooper ? (
        <Nota t={t} from={toma} to={fin} text="Toma 7 · lo que no viste" x={560} y={250} size={42} align="left" />
      ) : null}
      <Nota t={t} from={toma + 0.35} to={tomar - 0.05} text="silencio incómodo…" x={520} y={1000} size={46} italic align="left" />
      <Nota t={t} from={cafe + 0.15} to={bueno - 0.05} text="sigue pensando…" x={520} y={1000} size={46} italic align="left" />
    </AbsoluteFill>
  );
};
