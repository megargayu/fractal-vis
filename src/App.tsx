import * as THREE from "three";
import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import useZoomAndPan from "./hooks/useZoomAndPan";
import { normalToWorld, offsetToWorld } from "./util/coords";
import useDim from "./hooks/useDim";
import { Stats } from "@react-three/drei";

import DraggableDot from "./components/DraggableDotComponent";
import FullscreenShader from "./components/FullscreenShaderComponent";
import BottomBarComponent from "./components/BottomBarComponent";
import formatNumber from "./util/formatNumber";

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [dim, scale] = useDim(canvasRef, zoom, true);
  const { offset, setOffset } = useZoomAndPan(zoom, setZoom, scale, dim);

  const [dragPos, setDragPos] = useState(() => new THREE.Vector2(100, 0));

  const c = normalToWorld(dragPos, scale, dim, offset);
  const shaderOffset = offsetToWorld(offset, scale, dim);

  return (
    <div
      className="w-full h-full bg-slate-950 relative overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas className="w-full h-full" ref={canvasRef}>
        <FullscreenShader c={c} offset={shaderOffset} scale={scale} />
        <Stats className="rounded-2xl translate-1" />
      </Canvas>
      <DraggableDot
        dragPos={dragPos}
        setDragPos={setDragPos}
        offset={offset}
        canvasRef={canvasRef}
        zoom={zoom}
        dim={dim}
      />
      <div className="absolute right-4 top-4 text-center bg-black/70 p-3 rounded-xl w-52">
        <h1 className="text-white font-serif font-bold">fractal-vis v0.0.1</h1>
        <h1 className="text-white font-mono">
          c: {formatNumber(c.x, 3)}, {formatNumber(c.y, 3)}
        </h1>
        <h1 className="text-white font-mono">zoom: {formatNumber(zoom, 3)}x</h1>
        <h1 className="text-white font-mono">
          offset: {formatNumber(shaderOffset.x, 3)}, {formatNumber(shaderOffset.y, 3)}
        </h1>
        <h1 className="text-red-400 font-mono">
          raw: {formatNumber(dragPos.x, 3)}, {formatNumber(dragPos.y, 3)}
        </h1>
      </div>
      <BottomBarComponent
        zoom={zoom}
        setZoom={setZoom}
        c={c}
        scale={scale}
        dim={dim}
        offset={offset}
        setOffset={setOffset}
        shaderOffset={shaderOffset}
        dragPos={dragPos}
        setDragPos={setDragPos}
      />
    </div>
  );
};

export default App;
