// Video "El grupo de la familia" (edit/grupo-familia): un chat familiar que se escribe solo.
// Papá se compró una cafetera de un palo y medio; todos lo bardean… hasta que manda la foto del latte.
// Los tiempos salen de edit/grupo-familia/chat.json (el mismo archivo arma los sonidos en sonido.py).
// Estética de chat de mensajería en modo claro, sin logo ni nombre de ninguna app real: el verde es el de la marca.
// Motion: un solo momento fuerte (el «QUÉ» de Mamá ocupa la pantalla); el resto son gestos de chat
// (reacciones que saltan, la foto que se descarga, la cámara que se acerca) y el cierre es la hoja de reenviar.
import { AbsoluteFill, Easing, Img, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import chat from "../../edit/grupo-familia/chat.json";
import latte from "../../assets/img/escenas/feed-magnifica-latte-art.jpg";

const { fontFamily } = loadFont("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"] });
const FONT = `${fontFamily}, "Noto Color Emoji", sans-serif`;

const DARK = "#101012";
const LIGHT = "#F5F5F7";
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
const outC = Easing.out(Easing.cubic);
const FS = 54; // tamaño del texto de los mensajes
const FPS = 30;

type Msg = {
  t: number; de?: string; texto?: string; foto?: boolean; sistema?: string; instant?: boolean;
  escribe?: number; hora?: string; reac?: [number, string][]; corazones?: boolean;
};
const MSGS = chat.mensajes as Msg[];
const pop = (t: number, at: number, cfg = { damping: 11, stiffness: 220, mass: 0.6 }) =>
  spring({ frame: Math.round((t - at) * FPS), fps: FPS, config: cfg });

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

// Reacciones: la píldora aparece con la primera y rebota con cada una nueva
const Reacciones: React.FC<{ reac: [number, string][]; t: number; yo: boolean }> = ({ reac, t, yo }) => {
  const llegadas = reac.filter(([at]) => t >= at);
  if (!llegadas.length) return null;
  const ultima = llegadas[llegadas.length - 1][0];
  const k = pop(t, llegadas[0][0]);
  const bump = 1 + 0.25 * Math.max(0, 1 - (t - ultima) * 5) * (llegadas.length > 1 ? 1 : 0);
  const emojis = [...new Set(llegadas.map(([, e]) => e))].join("");
  return (
    <div style={{ position: "absolute", bottom: -40, [yo ? "right" : "left"]: 26, transform: `scale(${k * bump})`, transformOrigin: "50% 50%", background: IN, border: `4px solid ${WALL}`, borderRadius: 30, padding: "4px 16px", fontSize: 38, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 4px rgba(0,0,0,.1)" }}>
      <span>{emojis}</span>
      {llegadas.length > 1 && <span style={{ fontSize: 30, fontWeight: 600, color: MUTED }}>{llegadas.length}</span>}
    </div>
  );
};

// Foto que se descarga: arranca borrosa con un anillo de progreso y se enfoca
const Foto: React.FC<{ local: number }> = ({ local }) => {
  const p = interpolate(local, [0.05, 0.55], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const blur = interpolate(local, [0.45, 0.75], [26, 0], clamp);
  const ring = interpolate(local, [0.55, 0.7], [1, 0], clamp);
  const r = 46;
  return (
    <div style={{ position: "relative", width: 664, height: 760, borderRadius: 20, overflow: "hidden" }}>
      <Img src={latte} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 70%", display: "block", filter: `blur(${blur}px)`, transform: `scale(${1 + blur / 300})` }} />
      {ring > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: ring }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="62" fill="rgba(16,16,18,.55)" />
            <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="8" />
            <circle cx="70" cy="70" r={r} fill="none" stroke={GREEN} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * r} strokeDashoffset={(1 - p) * 2 * Math.PI * r} transform="rotate(-90 70 70)" />
          </svg>
        </div>
      )}
    </div>
  );
};

const Bubble: React.FC<{ m: Msg; first: boolean; hora: string; t: number }> = ({ m, first, hora, t }) => {
  if (m.sistema) {
    return (
      <div style={{ alignSelf: "center", background: "#FFF5C4", color: "#54656F", fontSize: 32, fontWeight: 500, padding: "14px 30px", borderRadius: 18, margin: "14px 0", boxShadow: "0 2px 2px rgba(0,0,0,.06)" }}>
        {m.sistema}
      </div>
    );
  }
  const yo = m.de === "Vos";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: yo ? "flex-end" : "flex-start", marginTop: first ? 18 : 0, marginBottom: m.reac ? 40 : 0 }}>
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
        {m.foto && <Foto local={t - m.t} />}
        {m.texto && (
          <div style={{ padding: m.foto ? "14px 22px 14px" : 0 }}>
            {m.texto}
            <Meta hora={hora} yo={yo} />
          </div>
        )}
        {m.reac && <Reacciones reac={m.reac} t={t} yo={yo} />}
      </div>
    </div>
  );
};

const Icon: React.FC<{ d: string; size?: number }> = ({ d, size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d={d} fill="none" stroke={TEXT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// El momento fuerte: el «QUÉ» de Mamá ocupa toda la pantalla, letra por letra, con signos que vuelan
const QueTakeover: React.FC<{ t: number }> = ({ t }) => {
  const { t: t0, fin } = chat.que;
  if (t < t0 || t >= fin) return null;
  const q = t - t0;
  const salida = interpolate(t, [fin - 0.14, fin], [0, 1], clamp);
  const shake = Math.max(0, 1 - q * 3.5);
  const sx = Math.sin(q * 80) * 22 * shake;
  const sy = Math.cos(q * 67) * 14 * shake;
  const letras = ["Q", "U", "É"];
  const rot0 = [-18, 12, -10];
  return (
    <AbsoluteFill style={{ background: DARK, opacity: 1 - salida, transform: `scale(${1 + salida * 0.25})`, overflow: "hidden" }}>
      {Array.from({ length: 18 }).map((_, i) => {
        const ang = random(`a${i}`) * Math.PI * 2;
        const dist = interpolate(q, [0.05, 0.6], [0, 520 + random(`d${i}`) * 380], { ...clamp, easing: outC });
        const size = 70 + random(`s${i}`) * 130;
        const rot = (random(`r${i}`) - 0.5) * 120 + q * (random(`w${i}`) - 0.5) * 300;
        return (
          <div key={i} style={{ position: "absolute", left: 540 + Math.cos(ang) * dist - size * 0.3, top: 960 + Math.sin(ang) * dist - size * 0.6, fontSize: size, fontWeight: 900, color: i % 3 === 0 ? LIGHT : GREEN, transform: `rotate(${rot}deg)`, opacity: interpolate(q, [0.05, 0.12], [0, 1], clamp) }}>
            ?
          </div>
        );
      })}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transform: `translate(${sx}px, ${sy}px)` }}>
        {letras.map((l, i) => {
          const k = pop(t, t0 + i * 0.06, { damping: 9, stiffness: 260, mass: 0.6 });
          return (
            <span key={i} style={{ display: "inline-block", fontSize: 400, fontWeight: 900, color: LIGHT, letterSpacing: -12, lineHeight: 1, opacity: Math.min(1, k * 3), transform: `scale(${3 - 2 * k}) rotate(${rot0[i] * (1 - k)}deg)` }}>
              {l}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", fontSize: 44, fontWeight: 700, color: GREEN, opacity: interpolate(q, [0.25, 0.35], [0, 1], clamp) }}>
        — Mamá
      </div>
    </AbsoluteFill>
  );
};

// Corazones y emojis que suben desde el último mensaje de Papá
const Corazones: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  if (t < at) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 16 }).map((_, i) => {
        const start = at + i * 0.06;
        const l = t - start;
        if (l < 0 || l > 1.6) return null;
        const y = 1360 - l * (520 + random(`hy${i}`) * 420);
        const x = 160 + random(`hx${i}`) * 420 + Math.sin(l * 6 + i) * 30;
        const e = ["❤️", "😍", "🙄", "❤️"][i % 4];
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, fontSize: 64 + random(`hs${i}`) * 40, opacity: interpolate(l, [0, 0.1, 1.2, 1.6], [0, 1, 1, 0], clamp), transform: `scale(${interpolate(l, [0, 0.2], [0.3, 1], clamp)})` }}>
            {e}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Cierre: la hoja de reenviar sube y se toca «Familia»
const Reenviar: React.FC<{ t: number }> = ({ t }) => {
  const c = chat.cierre;
  if (t < c.t) return null;
  const k = spring({ frame: Math.round((t - c.t) * FPS), fps: FPS, config: { damping: 18, stiffness: 150 } });
  const dim = interpolate(t, [c.t, c.t + 0.3], [0, 0.5], clamp);
  const tap = t - c.tap;
  const ripple = tap >= 0 ? interpolate(tap, [0, 0.45], [0, 1], { ...clamp, easing: outC }) : 0;
  const check = tap >= 0 ? pop(t, c.tap + 0.05) : 0;
  const marca = pop(t, c.tap + 0.25, { damping: 14, stiffness: 160, mass: 0.7 });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(16,16,18,${dim})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", opacity: marca, transform: `translateY(${(1 - marca) * 30}px)` }}>
        <div style={{ background: DARK, color: LIGHT, borderRadius: 28, padding: "14px 30px", fontSize: 36, fontWeight: 700 }}>
          Café en tu Casa <span style={{ color: GREEN }}>@cafentucasa</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, bottom: 0, background: IN, borderTopLeftRadius: 48, borderTopRightRadius: 48, transform: `translateY(${(1 - k) * 1300}px)`, padding: "26px 56px 0", boxShadow: "0 -10px 40px rgba(0,0,0,.2)" }}>
        <div style={{ width: 110, height: 10, borderRadius: 5, background: "#D7DCDF", margin: "0 auto 40px" }} />
        <div style={{ fontSize: 58, fontWeight: 800, color: DARK, lineHeight: 1.12, marginBottom: 34 }}>{c.texto}</div>
        {c.chats.map(([emoji, nombre], i) => {
          const elegido = i === 0;
          const kRow = spring({ frame: Math.round((t - c.t - 0.12 - i * 0.07) * FPS), fps: FPS, config: { damping: 16, stiffness: 170 } });
          return (
            <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", gap: 28, height: 140, opacity: kRow, transform: `translateX(${(1 - kRow) * 80}px)` }}>
              {elegido && ripple > 0 && (
                <div style={{ position: "absolute", left: 30, top: 70, width: 900 * ripple, height: 900 * ripple, marginLeft: -450 * ripple, marginTop: -450 * ripple, borderRadius: "50%", background: GREEN, opacity: 0.35 * (1 - ripple) }} />
              )}
              <div style={{ width: 64, height: 64, borderRadius: 32, border: `5px solid ${elegido && check > 0 ? GREEN_DK : "#C5CCD0"}`, background: elegido ? `rgba(91,110,50,${check})` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {elegido && check > 0 && (
                  <svg width="40" height="40" viewBox="0 0 24 24" style={{ transform: `scale(${check})` }}><path d="M5 12.5 l4.5 4.5 L19 7" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </div>
              <div style={{ width: 100, height: 100, borderRadius: 50, background: elegido ? GREEN : "#EDE6DC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, flexShrink: 0 }}>{emoji}</div>
              <div style={{ fontSize: 48, fontWeight: 600, color: TEXT }}>{nombre}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
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
  const foto = MSGS.find((m) => m.foto)!;
  const ultimo = MSGS.find((m) => m.corazones)!;

  // Cámara: arranca encima del primer mensaje (el gancho se lee grande en el cuadro 0) y se abre al llegar las respuestas
  const zoom = interpolate(t, [0, 1.0, 2.2], [1.3, 1.27, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lift = (zoom - 1) / 0.3;
  // Se acerca a la foto mientras se descarga y se aleja cuando Mamá empieza a escribir
  const push = interpolate(t, [foto.t + 0.2, foto.t + 1.6, 6.0, 6.4], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  // Un golpecito de cámara con cada mensaje nuevo
  const llegado = [...visibles].reverse().find((m) => !m.instant);
  const kick = llegado ? Math.exp(-(t - llegado.t) * 9) * Math.sin((t - llegado.t) * 30) * 6 : 0;

  // Gancho en texto: palabra por palabra
  const palabras = chat.gancho.split(" ");
  const ganchoOut = interpolate(t, [1.0, 1.15], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: WALL, fontFamily: FONT, color: TEXT, overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: "520px 760px", transform: `scale(${1 + 0.13 * push}) translateY(${kick}px)` }}>
        <AbsoluteFill style={{ transformOrigin: "40px 1400px", transform: `translateY(${-300 * lift}px) scale(${zoom})` }}>
          <Wallpaper />
          {/* Mensajes: anclados abajo; cada uno nuevo empuja al resto hacia arriba.
              Margen derecho amplio: abajo a la derecha Instagram pone sus botones. */}
          <div style={{ position: "absolute", left: 40, right: 110, top: 330, bottom: 520, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden", gap: 8, paddingLeft: 18, paddingRight: 18, paddingTop: 20 }}>
            {visibles.map((m, i) => {
              const local = f - Math.round(m.t * fps);
              const k = m.instant ? 1 : spring({ frame: local, fps, config: { damping: 13, stiffness: 210, mass: 0.7 } });
              const grow = m.instant ? 1 : interpolate(local, [0, 6], [0, 1], { ...clamp, easing: outC });
              const yo = m.de === "Vos";
              const prev = visibles[i - 1];
              const first = !prev || !!prev.sistema || prev.de !== m.de;
              const hora = m.hora ?? `10:${String(2 + Math.floor(m.t / 3)).padStart(2, "0")}`;
              return (
                <div key={i} style={{ maxHeight: grow * 1300, flexShrink: 0 }}>
                  <div style={{ transform: `scale(${0.6 + 0.4 * k}) rotate(${(1 - k) * (yo ? 4 : -4)}deg)`, opacity: Math.min(1, k * 1.6), transformOrigin: m.sistema ? "50% 100%" : yo ? "100% 0%" : "0% 0%", display: "flex", flexDirection: "column" }}>
                    <Bubble m={m} first={first} hora={hora} t={t} />
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
      </AbsoluteFill>

      {/* Gancho en texto arriba, palabra por palabra (la primera ya está en el cuadro 0) */}
      {ganchoOut > 0 && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 440, display: "flex", justifyContent: "center", opacity: ganchoOut }}>
          <div style={{ background: DARK, color: LIGHT, fontSize: 64, fontWeight: 800, padding: "22px 40px", borderRadius: 26, transform: "rotate(-2deg)", display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 18 }}>
            {palabras.map((w, i) => {
              // Completo desde el cuadro 0; cada palabra hace un saltito escalonado
              const l = t - i * 0.08;
              const hop = l > 0 && l < 0.3 ? Math.sin((l / 0.3) * Math.PI) : 0;
              return <span key={i} style={{ display: "inline-block", transform: `translateY(${-hop * 16}px)` }}>{w}</span>;
            })}
          </div>
        </div>
      )}

      <Corazones t={t} at={ultimo.t + 0.25} />
      <QueTakeover t={t} />
      <Reenviar t={t} />
    </AbsoluteFill>
  );
};
