// Video "El grupo de la familia" (edit/grupo-familia): un chat familiar que se escribe solo.
// Papá se compró una cafetera de un palo y medio; todos lo bardean… hasta que manda la foto del latte.
// Los tiempos salen de edit/grupo-familia/chat.json (el mismo archivo arma los sonidos en sonido.py).
// Estética de chat de mensajería en modo claro, sin logo ni nombre de ninguna app real: el verde es el de la marca.
// Dirección de motion (v4): público de 45–60 años con gusto premium. Movimiento lento y preciso, sin rebotes,
// sin sacudones ni partículas. Un solo momento fuerte: el «¿Qué?» de Mamá en tipografía grande y liviana.
// La foto es el momento lujoso: acercamiento lento, foco que se asienta. El cierre es la hoja de reenviar.
import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import chat from "../../edit/grupo-familia/chat.json";
import latte from "../../assets/img/escenas/feed-magnifica-latte-art.jpg";

const { fontFamily } = loadFont("normal", { weights: ["200", "300", "400", "500", "600", "700"], subsets: ["latin"] });
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
const SOFT = Easing.bezier(0.22, 1, 0.36, 1); // salida suave, sin rebote
const SLOW = Easing.bezier(0.65, 0, 0.35, 1); // movimientos de cámara
const FS = 54; // tamaño del texto de los mensajes

type Msg = {
  t: number; de?: string; texto?: string; foto?: boolean; sistema?: string; instant?: boolean;
  escribe?: number; hora?: string; reac?: [number, string][];
};
const MSGS = chat.mensajes as Msg[];
// Entrada suave de 0 a 1 en `dur` segundos desde `at`
const ease = (t: number, at: number, dur = 0.45) => interpolate(t, [at, at + dur], [0, 1], { ...clamp, easing: SOFT });

export type GrupoFamiliaProps = { gancho?: string };

// Fondo con dibujitos de café (granos, tazas, vapor), muy suaves
const Wallpaper: React.FC = () => (
  <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <pattern id="doodle" width="240" height="240" patternUnits="userSpaceOnUse">
        <g fill="none" stroke="#5a4636" strokeOpacity="0.075" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
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
  <div style={{ position: "relative", display: "flex", gap: 12, padding: "30px 36px", background: IN, borderRadius: 26, borderTopLeftRadius: 0, boxShadow: "0 2px 2px rgba(0,0,0,.06)" }}>
    <Tail yo={false} />
    {[0, 1, 2].map((i) => {
      const k = (Math.sin(t * 6 - i * 0.9) + 1) / 2;
      return <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: "#9AA5AC", opacity: 0.35 + k * 0.55 }} />;
    })}
  </div>
);

// Reacciones: la píldora aparece con un fundido corto; el número se actualiza sin saltos
const Reacciones: React.FC<{ reac: [number, string][]; t: number; yo: boolean }> = ({ reac, t, yo }) => {
  const llegadas = reac.filter(([at]) => t >= at);
  if (!llegadas.length) return null;
  const k = ease(t, llegadas[0][0], 0.35);
  const emojis = [...new Set(llegadas.map(([, e]) => e))].join("");
  return (
    <div style={{ position: "absolute", bottom: -40, [yo ? "right" : "left"]: 26, opacity: k, transform: `translateY(${(1 - k) * 8}px) scale(${0.92 + 0.08 * k})`, background: IN, border: `4px solid ${WALL}`, borderRadius: 30, padding: "4px 16px", fontSize: 36, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 4px rgba(0,0,0,.08)" }}>
      <span>{emojis}</span>
      {llegadas.length > 1 && <span style={{ fontSize: 28, fontWeight: 500, color: MUTED }}>{llegadas.length}</span>}
    </div>
  );
};

// Foto: entra con el foco abierto y se asienta, con un acercamiento lento dentro del cuadro
const Foto: React.FC<{ local: number }> = ({ local }) => {
  const foco = interpolate(local, [0, 0.9], [14, 0], { ...clamp, easing: SOFT });
  const zoom = interpolate(local, [0, 3.2], [1.08, 1.0], { ...clamp, easing: SLOW });
  const luz = interpolate(local, [0, 0.9], [0.92, 1], { ...clamp, easing: SOFT });
  return (
    <div style={{ position: "relative", width: 664, height: 760, borderRadius: 20, overflow: "hidden", background: "#e9e2d8" }}>
      <Img src={latte} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 70%", display: "block", filter: `blur(${foco}px) brightness(${luz})`, transform: `scale(${zoom})` }} />
    </div>
  );
};

const Bubble: React.FC<{ m: Msg; first: boolean; hora: string; t: number }> = ({ m, first, hora, t }) => {
  if (m.sistema) {
    return (
      <div style={{ alignSelf: "center", background: "#FFF5C4", color: "#54656F", fontSize: 32, fontWeight: 500, padding: "14px 30px", borderRadius: 18, margin: "14px 0", boxShadow: "0 2px 2px rgba(0,0,0,.05)" }}>
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
          boxShadow: "0 2px 2px rgba(0,0,0,.06)",
        }}
      >
        {first && <Tail yo={yo} />}
        {!yo && first && (
          <div style={{ fontSize: 34, fontWeight: 600, color: NAME[m.de!] ?? GREEN_DK, marginBottom: 4, padding: m.foto ? "8px 22px 8px" : 0 }}>{m.de}</div>
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
  <svg width={size} height={size} viewBox="0 0 24 24"><path d={d} fill="none" stroke={TEXT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// El momento fuerte: «¿Qué?» de Mamá a pantalla completa, en tipografía grande y liviana.
// Las letras llegan con el espaciado cerrándose y un acercamiento lento; nada salta.
const QueTakeover: React.FC<{ t: number }> = ({ t }) => {
  const { t: t0, fin } = chat.que;
  if (t < t0 - 0.12 || t >= fin) return null;
  const entra = interpolate(t, [t0 - 0.12, t0], [0, 1], { ...clamp, easing: SOFT });
  const sale = interpolate(t, [fin - 0.2, fin], [0, 1], { ...clamp, easing: SLOW });
  const q = t - t0;
  const tracking = interpolate(q, [0, 0.55], [60, -6], { ...clamp, easing: SOFT });
  const push = interpolate(q, [0, fin - t0], [1.0, 1.06], clamp);
  const linea = ease(t, t0 + 0.2, 0.4);
  const firma = ease(t, t0 + 0.28, 0.4);
  return (
    <AbsoluteFill style={{ background: "rgba(16,16,18,.78)", backdropFilter: "blur(36px) saturate(1.2)", opacity: entra * (1 - sale), overflow: "hidden" }}>
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", transform: `scale(${push})` }}>
        <div style={{ fontSize: 300, fontWeight: 200, color: LIGHT, letterSpacing: tracking, lineHeight: 1, opacity: ease(t, t0, 0.3), filter: `blur(${(1 - ease(t, t0, 0.35)) * 10}px)` }}>
          ¿Qué?
        </div>
        <div style={{ width: 220 * linea, height: 3, background: GREEN, marginTop: 56, borderRadius: 2 }} />
        <div style={{ marginTop: 30, fontSize: 40, fontWeight: 300, color: LIGHT, letterSpacing: 2, opacity: firma * 0.85 }}>Mamá</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// La foto sale del chat a pantalla completa (transición de elemento compartido), aparecen dos notas
// en vidrio esmerilado con una línea fina que señala la máquina, y la foto vuelve a su burbuja.
type Nota = { t: number; texto: string; caja: number[]; punto: number[] };
const FotoHero: React.FC<{ t: number }> = ({ t }) => {
  const h = chat.hero;
  if (t < h.t || t >= h.fin) return null;
  const [rx, ry, rw, rh] = h.rect;
  const abre = interpolate(t, [h.t, h.t + 0.55], [0, 1], { ...clamp, easing: SLOW });
  const cierra = interpolate(t, [h.fin - 0.42, h.fin], [0, 1], { ...clamp, easing: SLOW });
  const k = abre * (1 - cierra);
  const x = rx * (1 - k), y = ry * (1 - k), w = rw + (1080 - rw) * k, hh = rh + (1920 - rh) * k;
  const kb = interpolate(t, [h.t, h.fin], [1.0, 1.07], clamp); // acercamiento lento tipo Ken Burns
  const notasOut = interpolate(t, [h.fin - 0.62, h.fin - 0.42], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `rgba(16,16,18,${0.5 * k})` }} />
      <div style={{ position: "absolute", left: x, top: y, width: w, height: hh, borderRadius: 20 * (1 - k), overflow: "hidden", boxShadow: `0 30px 80px rgba(0,0,0,${0.35 * k})` }}>
        <Img src={latte} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${50 - 32 * k}% ${70 - 20 * k}%`, transform: `scale(${kb})`, transformOrigin: "35% 45%" }} />
        {/* Velo arriba para que se lea el texto */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(16,16,18,.35) 0%, rgba(16,16,18,0) 35%)", opacity: k }} />
      </div>
      {(h.notas as Nota[]).map((n, i) => {
        const a = ease(t, n.t, 0.5) * notasOut;
        const lineaK = ease(t, n.t - 0.1, 0.55) * notasOut;
        const [bx, by] = n.caja;
        const [px, py] = n.punto;
        const cx = bx + 40, cy = py < by ? by : by + 110; // la línea sale del borde de la caja que mira al punto
        return (
          <div key={i}>
            <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
              <line x1={cx} y1={cy} x2={cx + (px - cx) * lineaK} y2={cy + (py - cy) * lineaK} stroke="#fff" strokeWidth="3" strokeOpacity="0.9" />
              <circle cx={px} cy={py} r={14 * ease(t, n.t + 0.3, 0.4) * notasOut} fill="none" stroke="#fff" strokeWidth="3" />
              <circle cx={px} cy={py} r={5 * ease(t, n.t + 0.3, 0.4) * notasOut} fill="#fff" />
            </svg>
            <div style={{ position: "absolute", left: bx, top: by, opacity: a, transform: `translateY(${(1 - a) * 14}px)`, filter: `blur(${(1 - a) * 6}px)`, background: "rgba(255,255,255,.62)", backdropFilter: "blur(24px) saturate(1.4)", border: "1.5px solid rgba(255,255,255,.7)", borderRadius: 30, padding: "22px 34px", fontSize: 58, fontWeight: 600, letterSpacing: -1, color: DARK, boxShadow: "0 10px 30px rgba(0,0,0,.12)", whiteSpace: "nowrap" }}>
              {n.texto}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Cierre: la hoja de reenviar sube despacio y se elige «Familia»
const Reenviar: React.FC<{ t: number }> = ({ t }) => {
  const c = chat.cierre;
  if (t < c.t) return null;
  const k = interpolate(t, [c.t, c.t + 0.6], [0, 1], { ...clamp, easing: SOFT });
  const dim = interpolate(t, [c.t, c.t + 0.5], [0, 0.42], clamp);
  const sel = ease(t, c.tap, 0.3);
  const marca = ease(t, c.tap + 0.2, 0.5);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(16,16,18,${dim})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", opacity: marca, transform: `translateY(${(1 - marca) * 16}px)` }}>
        <div style={{ background: "rgba(16,16,18,.82)", color: LIGHT, borderRadius: 40, padding: "16px 36px", fontSize: 36, fontWeight: 400, letterSpacing: 0.5 }}>
          Café en tu Casa <span style={{ color: GREEN, fontWeight: 500 }}>@cafentucasa</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, bottom: 0, background: IN, borderTopLeftRadius: 48, borderTopRightRadius: 48, transform: `translateY(${(1 - k) * 1250}px)`, padding: "26px 56px 0", boxShadow: "0 -10px 40px rgba(0,0,0,.16)" }}>
        <div style={{ width: 110, height: 8, borderRadius: 4, background: "#D7DCDF", margin: "0 auto 44px" }} />
        <div style={{ fontSize: 56, fontWeight: 600, color: DARK, lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 34 }}>{c.texto}</div>
        {c.chats.map(([emoji, nombre], i) => {
          const elegido = i === 0;
          const kRow = ease(t, c.t + 0.2 + i * 0.08, 0.5);
          return (
            <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", gap: 28, height: 140, opacity: kRow, transform: `translateY(${(1 - kRow) * 20}px)` }}>
              {elegido && (
                <div style={{ position: "absolute", left: -30, right: -30, top: 10, bottom: 10, borderRadius: 24, background: `rgba(163,194,106,${0.18 * sel})` }} />
              )}
              <div style={{ position: "relative", width: 60, height: 60, borderRadius: 30, border: `3px solid ${elegido && sel > 0 ? GREEN_DK : "#C5CCD0"}`, background: elegido ? `rgba(91,110,50,${sel})` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {elegido && sel > 0 && (
                  <svg width="36" height="36" viewBox="0 0 24 24"><path d="M5 12.5 l4.5 4.5 L19 7" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="22" strokeDashoffset={22 * (1 - sel)} /></svg>
                )}
              </div>
              <div style={{ position: "relative", width: 100, height: 100, borderRadius: 50, background: elegido ? GREEN : "#EDE6DC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, flexShrink: 0 }}>{emoji}</div>
              <div style={{ position: "relative", fontSize: 46, fontWeight: elegido ? 600 : 400, color: TEXT }}>{nombre}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const ReelGrupoFamilia: React.FC<GrupoFamiliaProps> = ({ gancho }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;

  const visibles = MSGS.filter((m) => m.t <= t);
  const escribiendo = MSGS.find((m) => m.escribe && t >= m.t - m.escribe && t < m.t);
  const marta = MSGS.find((m) => m.sistema)!;
  const miembros = t >= marta.t ? chat.miembrosDespues : chat.miembrosAntes;
  const sub = escribiendo ? `${escribiendo.de} está escribiendo…` : miembros;

  // Cámara: arranca cerca del primer mensaje (el gancho se lee grande en el cuadro 0) y se abre con calma
  const zoom = interpolate(t, [0, 1.0, 2.4], [1.3, 1.28, 1], { ...clamp, easing: SLOW });
  const lift = (zoom - 1) / 0.3;

  const textoGancho = gancho ?? chat.gancho;
  const ganchoOut = interpolate(t, [0.85, 1.1], [1, 0], { ...clamp, easing: SLOW });

  return (
    <AbsoluteFill style={{ background: WALL, fontFamily: FONT, color: TEXT, overflow: "hidden" }}>
      <AbsoluteFill>
        <AbsoluteFill style={{ transformOrigin: "40px 1400px", transform: `translateY(${-300 * lift}px) scale(${zoom})` }}>
          <Wallpaper />
          {/* Mensajes: anclados abajo; cada uno nuevo empuja al resto hacia arriba.
              Margen derecho amplio: abajo a la derecha Instagram pone sus botones. */}
          <div style={{ position: "absolute", left: 40, right: 110, top: 330, bottom: 520, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden", gap: 8, paddingLeft: 18, paddingRight: 18, paddingTop: 20 }}>
            {visibles.map((m, i) => {
              const k = m.instant ? 1 : ease(t, m.t, 0.42);
              const grow = m.instant ? 1 : ease(t, m.t, 0.3);
              const yo = m.de === "Vos";
              const prev = visibles[i - 1];
              const first = !prev || !!prev.sistema || prev.de !== m.de;
              const hora = m.hora ?? `10:${String(2 + Math.floor(m.t / 3)).padStart(2, "0")}`;
              return (
                <div key={i} style={{ maxHeight: grow * 1300, flexShrink: 0 }}>
                  <div style={{ transform: `translateY(${(1 - k) * 18}px) scale(${0.97 + 0.03 * k})`, opacity: k, transformOrigin: m.sistema ? "50% 100%" : yo ? "100% 100%" : "0% 100%", display: "flex", flexDirection: "column" }}>
                    <Bubble m={m} first={first} hora={hora} t={t} />
                  </div>
                </div>
              );
            })}
            {escribiendo && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: 18, flexShrink: 0, opacity: ease(t, escribiendo.t - escribiendo.escribe!, 0.25) }}>
                <Typing t={t} />
              </div>
            )}
          </div>

          {/* Cabecera del grupo (debajo de la zona que tapa Instagram arriba) */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 320, display: "flex", alignItems: "center", gap: 22, padding: "150px 40px 0 26px", background: "#FFFFFF", boxShadow: "0 1px 0 rgba(0,0,0,.06)" }}>
            <Icon d="M15 5 L8 12 L15 19" size={60} />
            <div style={{ width: 112, height: 112, borderRadius: 56, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, flexShrink: 0 }}>🏠</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 50, fontWeight: 600 }}>{chat.titulo}</div>
              <div style={{ fontSize: 31, fontWeight: 400, color: escribiendo ? GREEN_DK : MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>
            </div>
            <Icon d="M3 7 h12 v10 H3 z M15 11 l6 -3 v8 l-6 -3" />
            <Icon d="M5 4 h4 l2 5 -2.5 1.5 a11 11 0 0 0 5 5 L15 13 l5 2 v4 a2 2 0 0 1 -2 2 A16 16 0 0 1 3 6 a2 2 0 0 1 2 -2" />
          </div>

          {/* Barra para escribir (decorativa) */}
          <div style={{ position: "absolute", left: 30, right: 30, top: 1420, height: 104, display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ flex: 1, height: 104, borderRadius: 52, background: "#FFFFFF", display: "flex", alignItems: "center", gap: 20, padding: "0 32px", color: MUTED, fontSize: 38, boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
              <span style={{ fontSize: 44, filter: "grayscale(1)", opacity: 0.55 }}>🙂</span> Mensaje
            </div>
            <div style={{ width: 104, height: 104, borderRadius: 52, background: GREEN_DK, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="50" height="50" viewBox="0 0 24 24"><path d="M12 3 a3 3 0 0 1 3 3 v6 a3 3 0 0 1 -6 0 V6 a3 3 0 0 1 3 -3 z M6 11 a6 6 0 0 0 12 0 M12 17 v4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Gancho en texto arriba: completo desde el cuadro 0, sobrio, se va con un fundido */}
      {ganchoOut > 0 && (
        <div style={{ position: "absolute", left: 70, right: 70, top: 450, display: "flex", justifyContent: "center", opacity: ganchoOut, transform: `translateY(${(1 - ganchoOut) * -16}px)` }}>
          <div style={{ background: "rgba(16,16,18,.88)", color: LIGHT, fontSize: 58, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.18, padding: "26px 44px", borderRadius: 32, textAlign: "center" }}>
            {textoGancho}
          </div>
        </div>
      )}

      <FotoHero t={t} />
      <QueTakeover t={t} />
      <Reenviar t={t} />
    </AbsoluteFill>
  );
};
