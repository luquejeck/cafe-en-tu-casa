// Video "Cápsulas v4" (edit/capsulas-v4): ReelKit + gancho fijo desde el cuadro 1, remate del tiro y pregunta A/B.
// Pedido: la v3 perdía a la gente en el gancho. Acá el dato se lee en el cuadro 0, sin entrada, y se habla desde el primer frame.
// Los tiempos salen de las palabras de captions.json (props.captions) y de los cortes de cut.json, no a ojo.
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ReelKit, ReelKitProps } from "./ReelKit";

const WHITE = "#f5f5f7";
const GREEN = "#a3c26a";
const FONT = "Inter, sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.out(Easing.cubic);

// Cortes del armado (edit/capsulas-v4/cut.json → captions.json segments)
const GANCHO_FIN = 2.633; // «Por eso»: cambia la toma
const TIRO = 5.667; // arranca el tiro de cápsulas
const HOLD = 8.067; // sonrisa a cámara

export const ReelCapsulasV4: React.FC<ReelKitProps> = (p) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const por = GANCHO_FIN; // fin del gancho: cambia la toma
  const end = durationInFrames / fps;

  // Gancho: visible y completo en el cuadro 0 (nada de revelar). Solo un leve asentamiento de escala.
  const hookOn = t < por;
  const hookOut = interpolate(t, [por - 0.12, por], [1, 0], clamp);
  const settle = interpolate(t, [0, 0.5], [1.02, 1], { ...clamp, easing: out });

  // Remate: «Chau, cápsulas.» entra cuando el bowl ya está en el aire; la pregunta queda hasta el final.
  const chauFrom = TIRO + 0.15;
  const chauTo = HOLD - 0.85;
  const qFrom = HOLD - 0.8;
  const kChau = interpolate(t, [chauFrom, chauFrom + 0.25], [0, 1], { ...clamp, easing: out });
  const oChau = interpolate(t, [chauTo - 0.12, chauTo], [1, 0], clamp);
  const kQ = interpolate(t, [qFrom, qFrom + 0.3], [0, 1], { ...clamp, easing: out });
  const bottomShade = interpolate(t, [TIRO, TIRO + 0.2, end], [0, 1, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#101012" }}>
      <ReelKit {...p} />

      {/* gancho: oscurecido arriba (medido: 0.10 alcanza 3:1; se usa más para leerlo de un vistazo) + titular */}
      {hookOn ? (
        <>
          <AbsoluteFill style={{ background: "linear-gradient(rgba(16,16,18,.55), rgba(16,16,18,0) 32%)", opacity: hookOut }} />
          <div style={{ position: "absolute", left: 72, top: 282, fontFamily: FONT, color: WHITE, opacity: hookOut,
            transform: `scale(${settle})`, transformOrigin: "left top" }}>
            <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Café de cápsula:</div>
            <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.04, marginTop: 6 }}>
              molido <span style={{ color: GREEN }}>hace meses.</span>
            </div>
          </div>
        </>
      ) : null}

      {/* remate y pregunta: oscurecido abajo (medido: 0.40 para 3:1 en el cuadro más claro) */}
      {t >= TIRO ? (
        <AbsoluteFill style={{ background: "linear-gradient(rgba(16,16,18,0) 55%, rgba(16,16,18,.62) 80%, rgba(16,16,18,.62))", opacity: bottomShade }} />
      ) : null}
      {t >= chauFrom && t <= chauTo ? (
        <div style={{ position: "absolute", left: 72, top: 1250, fontFamily: FONT, fontWeight: 800, fontSize: 88,
          letterSpacing: "-0.045em", color: WHITE, opacity: kChau * oChau, transform: `translateY(${(1 - kChau) * 22}px)` }}>
          Chau, cápsulas.
        </div>
      ) : null}
      {t >= qFrom ? (
        <div style={{ position: "absolute", left: 72, top: 1290, fontFamily: FONT, color: WHITE, opacity: kQ,
          transform: `translateY(${(1 - kQ) * 22}px)` }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.04 }}>
            ¿Cápsula o <span style={{ color: GREEN }}>grano?</span>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
