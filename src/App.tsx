import * as THREE from "three";
import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import useZoomAndPan from "./hooks/useZoomAndPan";
import { screenPosToWorld } from "./util/coords";
import useDim from "./hooks/useDim";
import { Stats } from "@react-three/drei";

import DraggableDot from "./components/DraggableDotComponent";
import FullscreenShader from "./components/FullscreenShaderComponent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Button } from "./components/ui/button";
import { CaretDownIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Separator } from "./components/ui/separator";
import { Input } from "./components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./components/ui/popover";
import { Slider } from "./components/ui/slider";

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [dim, scale] = useDim(canvasRef, zoom, true);
  const { offset } = useZoomAndPan(zoom, setZoom, scale, dim);

  const [dragPos, setDragPos] = useState(() => new THREE.Vector2(100, 0));

  const c = screenPosToWorld(dragPos, scale, dim, offset);
  const shaderOffset = screenPosToWorld(offset, scale, dim, offset);

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
          c: {c.x.toPrecision(3)}, {c.y.toPrecision(3)}
        </h1>
        <h1 className="text-white font-mono">zoom: {zoom.toPrecision(3)}x</h1>
        <h1 className="text-white font-mono">
          offset: {offset.x.toPrecision(3)}, {offset.y.toPrecision(3)}
        </h1>
        <h1 className="text-red-400 font-mono">
          raw: {dragPos.x.toPrecision(3)}, {dragPos.y.toPrecision(3)}
        </h1>
      </div>
      <div className="absolute bottom-8 w-[min(75%,70rem)] rounded-lg bg-black/80 hover:bg-black/90 p-3 flex space-x-3 items-center left-1/2 -translate-x-1/2 h-15">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default">
              Pick shader
              <CaretDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Mandelbrot Set</DropdownMenuItem>
            <DropdownMenuItem>Julia Set</DropdownMenuItem>
            <DropdownMenuItem>Burning Ship</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="default">
              <MagnifyingGlassIcon />
              <span className="font-bold">Zoom:</span> {zoom.toPrecision(5)}x
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2 flex space-x-2 w-full">
            <Input
              type="number"
              defaultValue={zoom}
              step={0.1}
              min={0.001}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            {/* <Slider
              className=""
              value={[zoom < 1 ? zoom : (zoom + 49) / 50]}
              onValueChange={([val]) => setZoom(val < 1 ? val : val * 50 - 49)}
              min={0.001}
              max={2}
              step={0.0002}
            /> */}
          </PopoverContent>
        </Popover>
        <Button>
          <div className="w-3 h-3 rounded-full z-10 bg-white/60 border-2 border-white mix-blend-difference" />
          <span className="font-bold">C:</span> ({c.x.toPrecision(2)}, {c.y.toPrecision(2)})
        </Button>
      </div>
    </div>
  );
};

export default App;
