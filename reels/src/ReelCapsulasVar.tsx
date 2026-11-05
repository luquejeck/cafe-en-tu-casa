// Tres versiones de prueba del reel de cápsulas (edit/capsulas-corta | -media | -larga): ReelKit + textos propios.
// El estilo y los textos salen de props.variant (lo escribe edit/capsulas-<v>/variant.json en las props).
// Los tiempos salen de los segmentos de captions.json (el "beat" de cada rango de cut.json), no a ojo.
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { ReelKit, ReelKitProps } from "./ReelKit";

const serif = loadSerif("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily;
loadSerif("italic", { weights: ["600"], subsets: ["latin"] });
const sans = loadInter("normal", { weights: ["600", "800", "900"], subsets: ["latin"] }).fontFamily;

const WHITE = "#f5f5f7";
const INK = "#101012";
const GREEN = "#a3c26a";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.out(Easing.cubic);

type Look = "bold" | "marker" | "editorial";
type Card = { from: string; to?: string; small?: string; a: string; b: string; y: number; instant?: boolean };
type Variant = { look: Look; cards: Card[] };
type Seg = { beat: string; out_start: number; out_dur: number };

/** "beat:remate: sonrisa" → el inicio de ese segmento; "beat:...>end" → su final; un número → ese segundo. */
const timeOf = (segs: Seg[], ref: string, end: number): number => {
  if (ref === "end") return end;
  if (!ref.startsWith("beat:")) return Number(ref);
  const [name, edge] = ref.slice(5).split(">");
  const s = segs.find((x) => x.beat.startsWith(name));
  if (!s) throw new Error(`no segment “${name}”`);
  return edge === "end" ? s.out_start + s.out_dur : s.out_start;
};

/** Una tarjeta de dos líneas: «small» (opcional, chica) + a (normal) + b (acento). Cada estilo la dibuja distinto. */
const CardView: React.FC<{ look: Look; c: Card; k: number; o: number }> = ({ look, c, k, o }) => {
  const enter = { opacity: k * o, transform: `translateY(${(1 - k) * 22}px)` };
  if (look === "bold") {
    const fill = interpolate(k, [0.2, 1], [0, 1], clamp); // la barra se llena de izquierda a derecha
    return (
      <div style={{ position: "absolute", left: 64, top: c.y, fontFamily: sans, fontWeight: 900, textTransform: "uppercase",
        letterSpacing: "-0.03em", color: WHITE, ...enter }}>
        {c.small ? <div style={{ fontSize: 50, lineHeight: 1.05, marginBottom: 8 }}>{c.small}</div> : null}
        <div style={{ fontSize: 104, lineHeight: 1.0 }}>
          {c.a}{" "}
          <span style={{ position: "relative", display: "inline-block", color: INK, padding: "0 14px" }}>
            <span style={{ position: "absolute", left: 0, top: "8%", bottom: "4%", width: `${fill * 100}%`, background: GREEN }} />
            <span style={{ position: "relative" }}>{c.b}</span>
          </span>
        </div>
      </div>
    );
  }
  if (look === "marker") {
    const bar = { background: GREEN, color: INK, padding: "4px 18px 8px", borderRadius: 6, display: "inline-block" } as const;
    return (
      <div style={{ position: "absolute", left: 64, top: c.y, fontFamily: sans, letterSpacing: "-0.03em", ...enter }}>
        {c.small ? <div style={{ fontSize: 52, fontWeight: 600, color: WHITE, marginBottom: 10 }}>{c.small}</div> : null}
        <div style={{ fontSize: 82, fontWeight: 800, lineHeight: 1.0 }}>
          {c.a ? <div style={{ ...bar, background: WHITE, marginBottom: 8 }}>{c.a}</div> : null}
          <div style={bar}>{c.b}</div>
        </div>
      </div>
    );
  }
  // editorial: etiqueta en versalitas espaciadas, serif, la segunda línea en itálica verde
  return (
    <div style={{ position: "absolute", left: 72, top: c.y, color: WHITE, ...enter }}>
      {c.small ? (
        <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 30, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.85, marginBottom: 14 }}>
          {c.small}
        </div>
      ) : null}
      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 92, lineHeight: 1.04, letterSpacing: "-0.015em" }}>{c.a}</div>
      <div style={{ fontFamily: serif, fontWeight: 600, fontStyle: "italic", fontSize: 92, lineHeight: 1.08, color: GREEN }}>{c.b}</div>
    </div>
  );
};

export const ReelCapsulasVar: React.FC<ReelKitProps> = (p) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const end = durationInFrames / fps;
  const v = (p as any).variant as Variant;
  const segs = ((p as any).captions?.segments ?? []) as Seg[];

  const cards = v.cards.map((c) => ({ c, from: timeOf(segs, c.from, end), to: timeOf(segs, c.to ?? "end", end) }));
  const top = cards.filter((x) => x.c.y < 900 && t >= x.from && t < x.to);
  const bottom = cards.filter((x) => x.c.y >= 900 && t >= x.from && t < x.to);
  const tiro = timeOf(segs, "beat:remate: arranca", end);

  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      <ReelKit {...p} />
      {/* oscurecido detrás de las tarjetas de arriba (medido: 0.10 alcanza 3:1; se usa más) y de abajo en el remate (0.40) */}
      {top.length ? <AbsoluteFill style={{ background: "linear-gradient(rgba(16,16,18,.6), rgba(16,16,18,0) 36%)" }} /> : null}
      {t >= tiro ? (
        <AbsoluteFill style={{ opacity: interpolate(t, [tiro, tiro + 0.2], [0, 1], clamp),
          background: "linear-gradient(rgba(16,16,18,0) 55%, rgba(16,16,18,.62) 80%, rgba(16,16,18,.62))" }} />
      ) : null}
      {[...top, ...bottom].map(({ c, from, to }, i) => {
        // la tarjeta del cuadro 0 ya está completa (instant): nada que esperar para leer el dato
        const k = c.instant ? 1 : interpolate(t, [from, from + 0.3], [0, 1], { ...clamp, easing: out });
        const o = to >= end - 0.01 ? 1 : interpolate(t, [to - 0.12, to], [1, 0], clamp);
        return <CardView key={i} look={v.look} c={c} k={k} o={o} />;
      })}
    </AbsoluteFill>
  );
};
