// Video "El grupo de la familia" (edit/grupo-familia): un chat familiar que se escribe solo.
// Papá se compró una cafetera de un palo y medio; todos lo bardean… hasta que manda la foto del latte.
// Los tiempos salen de edit/grupo-familia/chat.json (el mismo archivo arma los sonidos en sonido.py).
// Estética de chat de mensajería en modo claro (fondo cálido con dibujos, burbujas con colita, hora y tildes),
// pero sin logo ni nombre de ninguna app real: el verde es el de la marca.
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import chat from "../../edit/grupo-familia/chat.json";
import latte from "../../assets/img/escenas/feed-magnifica-latte-art.jpg";

const { fontFamily } = loadFont("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
const FONT = `${fontFamily}, "Noto Color Emoji", sans-serif`;

const DARK = "#101012";
const GREEN = "#A3C26A"; // acento de marca
const GREEN_DK = "#5B6E32"; // verde oscuro de marca
const OUT = "#E1F0C4"; // burbuja propia: verde de marca aclarado
const IN = "#FFFFFF";
const WALL = "#EFE7DD";
const TEXT = "#111B21";
const MUTED = "#667781";
const TICK = "#53BDEB";
const NAME: Record<string, string> = { "Papá": "#1F7A4D", "Mamá": "#C2185B", "Sofi": "#6A4BC4", "Tía Marta": "#D9730D" };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FS = 54; // tamaño del texto de los mensajes

type Msg = { t: number; de?: string; texto?: string; foto?: boolean; sistema?: string; instant?: boolean; escribe?: number; hora?: string };
const MSGS = chat.mensajes as Msg[];

// Fondo con dibujitos de café (granos, tazas, vapor), muy suaves
const Wallpaper: React.FC = () => (
  <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <pattern id="doodle" width="240" height="240" patternUnits="userSpaceOnUse">
        <g fill="none" stroke="#5a4636" strokeOpacity="0.09" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="50" cy="50" rx="18" ry="26" transform="rotate(-25 50 50)" />
          <path d="M42 30 C56 44, 44 58, 58 72" />
          <path d="M140 120 h56 v26 a28 28 0 0 1 -56 0 z" />
          <path d="M196 128 a12 12 0 0 1 0 22" />
          <path d="M156 104 c-6 -8 6 -12 0 -20 M176 104 c-6 -8 6 -12 0 -20" />
          <path d="M60 190 c-10 -14 -30 -2 -16 14 l16 14 l16 -14 c14 -16 -6 -28 -16 -14 z" />
          <ellipse cx="200" cy="40" rx="11" ry="16" transform="rotate(30 200 40)" />
          <path d="M195 27 C205 36, 195 44, 205 53" />
        </g>
      </pattern>
    </defs>
    <rect width="1080" height="1920" fill={WALL} />
    <rect width="1080" height="1920" fill="url(#doodle)" />
  </svg>
);

const Ticks: React.FC = () => (
  <svg width="34" height="22" viewBox="0 0 34 22" style={{ marginLeft: 6 }}>
    <path d="M2 12 l6 6 L20 4" fill="none" stroke={TICK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 16 l2 2 L28 4" fill="none" stroke={TICK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Colita de la burbuja (arriba, del lado del que habla)
const Tail: React.FC<{ yo: boolean }> = ({ yo }) => (
  <svg width="26" height="30" viewBox="0 0 26 30" style={{ position: "absolute", top: 0, [yo ? "right" : "left"]: -18 }}>
    <path d={yo ? "M0 0 H26 L4 26 Z" : "M26 0 H0 L22 26 Z"} fill={yo ? OUT : IN} />
  </svg>
);

const Meta: React.FC<{ hora: string; yo: boolean }> = ({ hora, yo }) => (
  <span style={{ display: "inline-flex", alignItems: "center", float: "right", margin: "18px 0 -8px 22px", fontSize: 28, fontWeight: 500, color: MUTED }}>
    {hora}
    {yo && <Ticks />}
  </span>
);

const Typing: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "relative", display: "flex", gap: 12, padding: "30px 36px", background: IN, borderRadius: 26, borderTopLeftRadius: 0, boxShadow: "0 2px 2px rgba(0,0,0,.08)" }}>
    <Tail yo={false} />
    {[0, 1, 2].map((i) => {
      const k = (Math.sin(t * 9 - i * 0.9) + 1) / 2;
      return <div key={i} style={{ width: 18, height: 18, borderRadius: 9, background: "#9AA5AC", opacity: 0.45 + k * 0.55, transform: `translateY(${-k * 8}px)` }} />;
    })}
  </div>
);

const Bubble: React.FC<{ m: Msg; first: boolean; hora: string }> = ({ m, first, hora }) => {
  if (m.sistema) {
    return (
      <div style={{ alignSelf: "center", background: "#FFF5C4", color: "#54656F", fontSize: 32, fontWeight: 500, padding: "14px 30px", borderRadius: 18, margin: "14px 0", boxShadow: "0 2px 2px rgba(0,0,0,.06)" }}>
        {m.sistema}
      </div>
    );
  }
  const yo = m.de === "Vos";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: yo ? "flex-end" : "flex-start", marginTop: first ? 18 : 0 }}>
      <div
        style={{
          position: "relative",
          maxWidth: m.foto ? 680 : m.instant ? 760 : 820,
          background: yo ? OUT : IN,
          color: TEXT,
          borderRadius: 26,
          ...(first ? (yo ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 }) : {}),
          padding: m.foto ? 8 : "18px 30px 22px",
          fontSize: FS,
          fontWeight: 400,
          lineHeight: 1.25,
          boxShadow: "0 2px 2px rgba(0,0,0,.08)",
        }}
      >
        {first && <Tail yo={yo} />}
        {!yo && first && (
          <div style={{ fontSize: 34, fontWeight: 700, color: NAME[m.de!] ?? GREEN_DK, marginBottom: 4, padding: m.foto ? "8px 22px 8px" : 0 }}>{m.de}</div>
        )}
        {m.foto && <Img src={latte} style={{ width: 664, height: 760, objectFit: "cover", objectPosition: "50% 70%", borderRadius: 20, display: "block" }} />}
        {m.texto && (
          <div style={{ padding: m.foto ? "14px 22px 14px" : 0 }}>
            {m.texto}
            <Meta hora={hora} yo={yo} />
          </div>
        )}
      </div>
    </div>
  );
};

const Icon: React.FC<{ d: string; size?: number }> = ({ d, size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d={d} fill="none" stroke={TEXT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export const ReelGrupoFamilia: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;

  const visibles = MSGS.filter((m) => m.t <= t);
  const escribiendo = MSGS.find((m) => m.escribe && t >= m.t - m.escribe && t < m.t);
  const marta = MSGS.find((m) => m.sistema)!;
  const miembros = t >= marta.t ? chat.miembrosDespues : chat.miembrosAntes;
  const sub = escribiendo ? `${escribiendo.de} está escribiendo…` : miembros;

  // Cámara: arranca encima del primer mensaje (el gancho se lee grande en el cuadro 0) y se abre al llegar las respuestas
  const zoom = interpolate(t, [0, 1.0, 2.2], [1.3, 1.27, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lift = (zoom - 1) / 0.3;
  // Sacudón en el «QUÉ» de Mamá
  const que = MSGS[1].t;
  const shake = t >= que && t < que + 0.3 ? Math.sin((t - que) * 70) * 14 * (1 - (t - que) / 0.3) : 0;

  // Cierre: tarjeta oscura de marca que sube
  const kCierre = spring({ frame: f - Math.round(chat.cierre.t * fps), fps, config: { damping: 14, stiffness: 140 } });
  const dimCierre = interpolate(t, [chat.cierre.t, chat.cierre.t + 0.3], [0, 0.35], clamp);

  return (
    <AbsoluteFill style={{ background: WALL, fontFamily: FONT, color: TEXT }}>
      <AbsoluteFill style={{ transformOrigin: "40px 1400px", transform: `translate(${shake}px, ${-300 * lift}px) scale(${zoom})` }}>
        <Wallpaper />
        {/* Mensajes: anclados abajo; cada uno nuevo empuja al resto hacia arriba.
            Margen derecho amplio: abajo a la derecha Instagram pone sus botones. */}
        <div style={{ position: "absolute", left: 40, right: 110, top: 330, bottom: 520, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden", gap: 8, paddingLeft: 18, paddingRight: 18 }}>
          {visibles.map((m, i) => {
            const local = f - Math.round(m.t * fps);
            const k = m.instant ? 1 : spring({ frame: local, fps, config: { damping: 15, stiffness: 190, mass: 0.7 } });
            const grow = m.instant ? 1 : interpolate(local, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
            const yo = m.de === "Vos";
            const prev = visibles[i - 1];
            const first = !prev || !!prev.sistema || prev.de !== m.de;
            const hora = m.hora ?? `10:${String(2 + Math.floor(m.t / 3)).padStart(2, "0")}`;
            return (
              <div key={i} style={{ maxHeight: grow * 1200, flexShrink: 0 }}>
                <div style={{ transform: `scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 1.6), transformOrigin: m.sistema ? "50% 100%" : yo ? "100% 0%" : "0% 0%", display: "flex", flexDirection: "column" }}>
                  <Bubble m={m} first={first} hora={hora} />
                </div>
              </div>
            );
          })}
          {escribiendo && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: 18, flexShrink: 0 }}>
              <Typing t={t} />
            </div>
          )}
        </div>

        {/* Cabecera del grupo (debajo de la zona que tapa Instagram arriba) */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 320, display: "flex", alignItems: "center", gap: 22, padding: "150px 40px 0 26px", background: "#FFFFFF", boxShadow: "0 2px 6px rgba(0,0,0,.08)" }}>
          <Icon d="M15 5 L8 12 L15 19" size={60} />
          <div style={{ width: 112, height: 112, borderRadius: 56, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, flexShrink: 0 }}>🏠</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 50, fontWeight: 700 }}>{chat.titulo}</div>
            <div style={{ fontSize: 31, fontWeight: 500, color: escribiendo ? GREEN_DK : MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>
          </div>
          <Icon d="M3 7 h12 v10 H3 z M15 11 l6 -3 v8 l-6 -3" />
          <Icon d="M5 4 h4 l2 5 -2.5 1.5 a11 11 0 0 0 5 5 L15 13 l5 2 v4 a2 2 0 0 1 -2 2 A16 16 0 0 1 3 6 a2 2 0 0 1 2 -2" />
        </div>

        {/* Barra para escribir (decorativa) */}
        <div style={{ position: "absolute", left: 30, right: 30, top: 1420, height: 104, display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ flex: 1, height: 104, borderRadius: 52, background: "#FFFFFF", display: "flex", alignItems: "center", gap: 20, padding: "0 32px", color: MUTED, fontSize: 38, boxShadow: "0 2px 2px rgba(0,0,0,.06)" }}>
            <span style={{ fontSize: 44, filter: "grayscale(1)", opacity: 0.6 }}>🙂</span> Mensaje
          </div>
          <div style={{ width: 104, height: 104, borderRadius: 52, background: GREEN_DK, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="50" height="50" viewBox="0 0 24 24"><path d="M12 3 a3 3 0 0 1 3 3 v6 a3 3 0 0 1 -6 0 V6 a3 3 0 0 1 3 -3 z M6 11 a6 6 0 0 0 12 0 M12 17 v4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
        </div>
      </AbsoluteFill>

      {/* Gancho en texto arriba, solo mientras la cámara está cerca del primer mensaje */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", opacity: interpolate(t, [1.6, 2.0], [1, 0], clamp), transform: `translateY(${interpolate(t, [1.6, 2.0], [0, -40], clamp)}px)` }}>
        <div style={{ background: DARK, color: "#F5F5F7", fontSize: 64, fontWeight: 800, padding: "22px 40px", borderRadius: 26, transform: "rotate(-2deg)" }}>
          Mi viejo en el <span style={{ color: GREEN }}>grupo familiar</span> 💀
        </div>
      </div>

      {/* Cierre */}
      <AbsoluteFill style={{ background: `rgba(16,16,18,${dimCierre})` }} />
      {t >= chat.cierre.t && (
        <div style={{ position: "absolute", left: 70, right: 70, top: 620, transform: `translateY(${(1 - kCierre) * 260}px) rotate(${-2 * kCierre}deg)`, opacity: Math.min(1, kCierre * 2) }}>
          <div style={{ background: DARK, color: "#F5F5F7", borderRadius: 34, padding: "40px 44px", fontSize: 66, fontWeight: 800, lineHeight: 1.1, textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,.35)" }}>
            Mandáselo a tu <span style={{ background: GREEN, color: DARK, padding: "0 14px", borderRadius: 12 }}>grupo familiar</span> 👀
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
            <div style={{ background: "#FFFFFF", borderRadius: 26, padding: "10px 26px", fontSize: 32, fontWeight: 700, color: DARK }}>Café en tu Casa · @cafentucasa</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
