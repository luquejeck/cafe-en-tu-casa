import { Composition } from "remotion";
import { KIT_FPS, ReelCover, ReelKit, reelCoverDefaults, reelKitDefaults, reelKitMetadata } from "./ReelKit";
import { GEN } from "./gen/registry";
import { ReelCapsulas } from "./ReelCapsulas";
import capsulasProps from "../../edit/capsulas/reelkit-props.json";
import { ReelCapsulasV4 } from "./ReelCapsulasV4";
import { ReelCapsulasVar } from "./ReelCapsulasVar";
import capsulasV4Props from "../../edit/capsulas-v4/reelkit-props.json";
import { ReelGrupoFamilia } from "./ReelGrupoFamilia";
import grupoChat from "../../edit/grupo-familia/chat.json";

// Created by kit.py new. The kit (src/ReelKit.tsx, src/kit/) is updated by kit.py update; this file is yours.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* The template for any brand: the data comes as props (visual_plan.py export --props):
          npx remotion render ReelKit out/<name>.mp4 --props=edit/<id>/reelkit-props.json */}
      <Composition
        id="ReelKit"
        component={ReelKit}
        durationInFrames={90}
        fps={KIT_FPS}
        width={1080}
        height={1920}
        defaultProps={reelKitDefaults}
        calculateMetadata={reelKitMetadata}
      />
      {/* The cover (a still): a video frame + the hook, same props as ReelKit:
          npx remotion still ReelCover edit/<id>/cover.png --props=edit/<id>/reelkit-props.json */}
      <Composition id="ReelCover" component={ReelCover} durationInFrames={1} fps={KIT_FPS} width={1080} height={1920}
        defaultProps={reelCoverDefaults} />
      {/* Video "La verdad incómoda sobre las cápsulas": ReelKit + remates graciosos (edit/capsulas) */}
      <Composition id="ReelCapsulas" component={ReelCapsulas} durationInFrames={90} fps={KIT_FPS} width={1080} height={1920}
        defaultProps={capsulasProps as any} calculateMetadata={reelKitMetadata as any} />
      {/* Video "Cápsulas v4": gancho con el dato en el cuadro 0, 9 s (edit/capsulas-v4) */}
      <Composition id="ReelCapsulasV4" component={ReelCapsulasV4} durationInFrames={90} fps={KIT_FPS} width={1080} height={1920}
        defaultProps={capsulasV4Props as any} calculateMetadata={reelKitMetadata as any} />
      {/* Tres versiones de prueba (corta / media / larga) con estilos distintos: props de edit/capsulas-<v>/reelkit-props.json */}
      <Composition id="ReelCapsulasVar" component={ReelCapsulasVar} durationInFrames={90} fps={KIT_FPS} width={1080} height={1920}
        defaultProps={capsulasV4Props as any} calculateMetadata={reelKitMetadata as any} />
      {/* Video "El grupo de la familia": chat que se escribe solo, sin filmar (edit/grupo-familia/chat.json) */}
      <Composition id="ReelGrupoFamilia" component={ReelGrupoFamilia} defaultProps={{}} durationInFrames={Math.round(grupoChat.duracion * 30)} fps={30} width={1080} height={1920} />
      {/* Code scenes for B-roll (codescene.py scaffold / render) */}
      {GEN.map((g) => (
        <Composition key={g.id} id={g.id} component={g.component} durationInFrames={g.durationInFrames} fps={30} width={1080} height={1920} />
      ))}
    </>
  );
};
