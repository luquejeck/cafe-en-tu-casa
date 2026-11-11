// Video "El grupo de la familia" (edit/grupo-familia): un chat familiar que se escribe solo.
// Papá se compró una cafetera de un palo y medio; todos lo bardean… hasta que manda la foto del latte.
// Los tiempos salen de edit/grupo-familia/chat.json (el mismo archivo arma los sonidos en sonido.py).
// El chat es genérico, con los colores de la marca: no imita la interfaz de ninguna app real.
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import chat from "../../edit/grupo-familia/chat.json";
import latte from "../../assets/img/escenas/feed-magnifica-latte-art.jpg";

const { fontFamily } = loadFont("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });
const FONT = `${fontFamily}, "Noto Color Emoji", sans-serif`;

const DARK = "#101012";
const LIGHT = "#F5F5F7";
const GREEN = "#A3C26A";
const BUBBLE = "#232327";
const MUTED = "#8E8E93";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Msg = { t: number; de?: string; texto?: string; foto?: boolean; sistema?: string; instant?: boolean; escribe?: number };
const MSGS = chat.mensajes as Msg[];

const Typing: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ display: "flex", gap: 12, padding: "30px 34px", background: BUBBLE, borderRadius: 40, borderBottomLeftRadius: 12 }}>
    {[0, 1, 2].map((i) => {
      const k = (Math.sin((t * 9 - i * 0.9)) + 1) / 2;
      return <div key={i} style={{ width: 18, height: 18, borderRadius: 9, background: LIGHT, opacity: 0.35 + k * 0.6, transform: `translateY(${-k * 8}px)` }} />;
    })}
  </div>
);

const Bubble: React.FC<{ m: Msg; prevSame: boolean }> = ({ m, prevSame }) => {
  if (m.sistema) {
    return (
      <div style={{ alignSelf: "center", background: "#1C1C1F", color: MUTED, fontSize: 32, fontWeight: 600, padding: "14px 30px", borderRadius: 30, margin: "10px 0" }}>
        {m.sistema}
      </div>
    );
  }
  const yo = m.de === "Vos";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: yo ? "flex-end" : "flex-start", marginTop: prevSame ? 0 : 14 }}>
      <div
        style={{
          maxWidth: m.foto ? 640 : m.instant ? 700 : 820,
          background: yo ? GREEN : BUBBLE,
          color: yo ? DARK : LIGHT,
          borderRadius: 40,
          [yo ? "borderBottomRightRadius" : "borderBottomLeftRadius"]: 12,
          padding: m.foto ? 12 : "22px 34px 24px",
          fontSize: 50,
          fontWeight: 600,
          lineHeight: 1.22,
        }}
      >
        {!yo && !prevSame && (
          <div style={{ fontSize: 32, fontWeight: 800, color: GREEN, marginBottom: 6, padding: m.foto ? "10px 22px 4px" : 0 }}>{m.de}</div>
        )}
        {m.foto && <Img src={latte} style={{ width: 616, height: 700, objectFit: "cover", objectPosition: "50% 70%", borderRadius: 30, display: "block" }} />}
        {m.texto && <div style={{ padding: m.foto ? "16px 22px 12px" : 0 }}>{m.texto}</div>}
      </div>
    </div>
  );
};

export const ReelGrupoFamilia: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;

  const visibles = MSGS.filter((m) => m.t <= t);
  const escribiendo = MSGS.find((m) => m.escribe && t >= m.t - m.escribe && t < m.t);
  const marta = MSGS.find((m) => m.sistema)!;
  const miembros = t >= marta.t ? chat.miembrosDespues : chat.miembrosAntes;
  const sub = escribiendo ? `${escribiendo.de} está escribiendo…` : miembros;

  // Cierre: una banda verde que sube desde abajo
  const kCierre = spring({ frame: f - Math.round(chat.cierre.t * fps), fps, config: { damping: 14, stiffness: 140 } });
  const dimCierre = interpolate(t, [chat.cierre.t, chat.cierre.t + 0.3], [0, 0.45], clamp);

  // Cámara: arranca encima del primer mensaje (el gancho se lee grande en el cuadro 0) y se abre al llegar las respuestas
  const zoom = interpolate(t, [0, 1.1, 2.4], [1.42, 1.38, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lift = (zoom - 1) / 0.42;
  // Sacudón en el «QUÉ» de Mamá
  const que = MSGS[1].t;
  const shake = t >= que && t < que + 0.3 ? Math.sin((t - que) * 70) * 14 * (1 - (t - que) / 0.3) : 0;

  return (
    <AbsoluteFill style={{ background: DARK, fontFamily: FONT, color: LIGHT }}>
     <AbsoluteFill style={{ transformOrigin: "48px 1450px", transform: `translate(${shake}px, ${-330 * lift}px) scale(${zoom})` }}>
      {/* Mensajes: anclados abajo; cada uno nuevo empuja al resto hacia arriba */}
      <div style={{ position: "absolute", left: 48, right: 48, top: 330, bottom: 470, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden", gap: 10 }}>
        {visibles.map((m, i) => {
          const local = f - Math.round(m.t * fps);
          const k = m.instant ? 1 : spring({ frame: local, fps, config: { damping: 15, stiffness: 190, mass: 0.7 } });
          const grow = m.instant ? 1 : interpolate(local, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const yo = m.de === "Vos";
          const prev = visibles[i - 1];
          const prevSame = !!prev && !prev.sistema && prev.de === m.de;
          return (
            <div key={i} style={{ maxHeight: grow * 1100, flexShrink: 0 }}>
              <div style={{ transform: `scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 1.6), transformOrigin: m.sistema ? "50% 100%" : yo ? "100% 100%" : "0% 100%", display: "flex", flexDirection: "column" }}>
                <Bubble m={m} prevSame={prevSame} />
              </div>
            </div>
          );
        })}
        {escribiendo && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: 14, flexShrink: 0 }}>
            <Typing t={t} />
          </div>
        )}
      </div>

      {/* Cabecera del grupo (debajo de la zona que tapa Instagram arriba) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 160, display: "flex", alignItems: "center", gap: 26, padding: "0 56px", background: DARK, borderBottom: "2px solid #1F1F23" }}>
        <div style={{ width: 104, height: 104, borderRadius: 52, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>🏠</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
          <div style={{ fontSize: 48, fontWeight: 800 }}>{chat.titulo}</div>
          <div style={{ fontSize: 30, fontWeight: 500, color: escribiendo ? GREEN : MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>
        </div>
      </div>

      {/* Barra para escribir (decorativa) */}
      <div style={{ position: "absolute", left: 48, right: 48, top: 1478, height: 96, borderRadius: 48, background: "#1C1C1F", display: "flex", alignItems: "center", padding: "0 38px", color: MUTED, fontSize: 34, fontWeight: 500 }}>
        Mensaje
      </div>
     </AbsoluteFill>

      {/* Cierre */}
      <AbsoluteFill style={{ background: `rgba(0,0,0,${dimCierre})` }} />
      {t >= chat.cierre.t && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 360, transform: `translateY(${(1 - kCierre) * 260}px) rotate(${-2 * kCierre}deg)`, opacity: Math.min(1, kCierre * 2) }}>
          <div style={{ background: GREEN, color: DARK, borderRadius: 34, padding: "34px 40px", fontSize: 62, fontWeight: 800, lineHeight: 1.1, textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}>
            {chat.cierre.texto}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}><div style={{ background: DARK, borderRadius: 26, padding: "10px 26px", fontSize: 32, fontWeight: 700, color: LIGHT }}>Café en tu Casa · @cafentucasa</div></div>
        </div>
      )}
    </AbsoluteFill>
  );
};
