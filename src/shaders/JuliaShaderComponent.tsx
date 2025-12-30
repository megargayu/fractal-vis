import * as THREE from "three";
import FullscreenShader from "@/components/FullscreenShaderComponent";
import { Canvas } from "@react-three/fiber";

import { useRef } from "react";
import useDim from "@/hooks/useDim";
import useZoomAndPan from "@/hooks/useZoomAndPan";

import {
  normalToWorld,
  offsetToWorld,
  worldToNormal,
  worldToOffset,
} from "@/util/coords";
import { Stats } from "@react-three/drei";
import DraggableDot from "@/components/DraggableDotComponent";
import {
  ArrowsOutCardinalIcon,
  MagnifyingGlassIcon,
  TextSuperscriptIcon,
} from "@phosphor-icons/react";
import {
  ButtonPopoverComponent,
  PopoverInputComponent,
} from "@/components/BottomBarComponent";
import formatNumber from "@/util/formatNumber";
import useMultiStateSetter from "@/util/multiStateSetter";
import type {
  Shader,
  ShaderComponentProps,
  ShaderInfo,
  ShaderPropsResult,
  ShaderState,
} from "./Shader";
import { Separator } from "@/components/ui/separator";

export interface JuliaShaderState extends ShaderState {
  dragPos: THREE.Vector2;
  offset: THREE.Vector2;
  zoom: number;
  power: number;
  dim: THREE.Vector2;
  scale: THREE.Vector2;
}

export interface JuliaShaderPropsResult extends ShaderPropsResult {
  c: THREE.Vector2;
  shaderOffset: THREE.Vector2;
}

const JuliaShaderBottomBar: ShaderInfo<
  JuliaShaderState,
  JuliaShaderPropsResult
>["bottomBar"] = (
  { zoom, offset, scale, dim, dragPos, power },
  setShaderState,
  { c, shaderOffset }
) => {
  const setZoom = useMultiStateSetter(setShaderState, "zoom");
  const setOffset = useMultiStateSetter(setShaderState, "offset");
  const setDragPos = useMultiStateSetter(setShaderState, "dragPos");
  const setPower = useMultiStateSetter(setShaderState, "power");

  return (
    <>
      <ButtonPopoverComponent
        icon={<MagnifyingGlassIcon />}
        label="Zoom:"
        value={formatNumber(zoom, 2) + "x"}
      >
        <PopoverInputComponent
          label="Zoom: "
          value={zoom}
          step={0.1}
          min={0.001}
          onChange={(e) => setZoom(Number(e.target.value))}
          resetAction={() => setZoom(1)}
        />
      </ButtonPopoverComponent>

      <ButtonPopoverComponent
        icon={<ArrowsOutCardinalIcon />}
        label="Offset:"
        value={`(${formatNumber(shaderOffset.x, 2)}, ${formatNumber(
          shaderOffset.y,
          2
        )})`}
      >
        <PopoverInputComponent
          label="X: "
          value={shaderOffset.x}
          step={0.01}
          onChange={(e) =>
            setOffset(
              worldToOffset(
                new THREE.Vector2(Number(e.target.value), shaderOffset.y),
                scale,
                dim
              )
            )
          }
          resetAction={() => setOffset(new THREE.Vector2(0, offset.y))}
        />
        <PopoverInputComponent
          label="Y: "
          value={shaderOffset.y}
          step={0.01}
          onChange={(e) =>
            setOffset(
              worldToOffset(
                new THREE.Vector2(shaderOffset.x, Number(e.target.value)),
                scale,
                dim
              )
            )
          }
          resetAction={() => setOffset(new THREE.Vector2(offset.x, 0))}
        />
      </ButtonPopoverComponent>

      <Separator orientation="vertical" />

      <ButtonPopoverComponent
        icon={
          <div className="w-3.5 h-3.5 rounded-full z-10 bg-white/60 border-2 border-white mix-blend-difference" />
        }
        label="C:"
        value={`(${formatNumber(c.x, 2)}, ${formatNumber(c.y, 2)})`}
      >
        <PopoverInputComponent
          label="X: "
          value={c.x}
          step={0.01}
          onChange={(e) =>
            setDragPos(
              worldToNormal(
                new THREE.Vector2(Number(e.target.value), c.y),
                scale,
                dim,
                offset
              )
            )
          }
          resetAction={() => setDragPos(new THREE.Vector2(0, dragPos.y))}
        />
        <PopoverInputComponent
          label="Y: "
          value={c.y}
          step={0.01}
          onChange={(e) =>
            setDragPos(
              worldToNormal(
                new THREE.Vector2(c.x, Number(e.target.value)),
                scale,
                dim,
                offset
              )
            )
          }
          resetAction={() => setDragPos(new THREE.Vector2(dragPos.x, 0))}
        />
      </ButtonPopoverComponent>

      <ButtonPopoverComponent
        icon={<TextSuperscriptIcon />}
        label="Power:"
        value={formatNumber(power, 2)}
      >
        <PopoverInputComponent
          label="Power: "
          value={power}
          step={0.1}
          min={2}
          onChange={(e) => setPower(Number(e.target.value))}
          resetAction={() => setPower(2)}
        />
      </ButtonPopoverComponent>
    </>
  );
};

const JuliaShaderInfo: ShaderInfo<JuliaShaderState, JuliaShaderPropsResult> = {
  name: "Julia Set",
  description:
    "A visualization of the Julia set fractal, defined by the iterative function f(z) = z^power + c, where 'c' is a complex constant. Colors are determined by the rate of divergence of each point in the complex plane.",
  uniforms: (shaderState, _, shaderProps) => ({
    c: {
      value: shaderProps.c,
    },
    offset: {
      value: shaderProps.shaderOffset,
    },
    zoom: {
      value: shaderState.zoom,
    },
    power: {
      value: shaderState.power || 2,
    },
  }),
  bottomBar: JuliaShaderBottomBar,
};

const JuliaShaderDefaultState: JuliaShaderState = {
  dragPos: new THREE.Vector2(100, 0),
  offset: new THREE.Vector2(0, 0),
  zoom: 1,
  power: 2,
  dim: new THREE.Vector2(),
  scale: new THREE.Vector2(2, 2),
};

const JuliaShaderProps = ({
  dragPos,
  scale,
  dim,
  offset,
}: JuliaShaderState): JuliaShaderPropsResult => ({
  c: normalToWorld(dragPos, scale, dim, offset),
  shaderOffset: offsetToWorld(offset, scale, dim),
});

const JuliaShaderComponent = ({
  shaderState,
  setShaderState,
  shaderProps,
}: ShaderComponentProps<JuliaShaderState, JuliaShaderPropsResult>) => {
  const { zoom, scale, dim, power } = shaderState;
  const { c, shaderOffset } = shaderProps;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useDim(
    canvasRef,
    zoom,
    useMultiStateSetter(setShaderState, "dim"),
    useMultiStateSetter(setShaderState, "scale"),
    true
  );

  useZoomAndPan(
    useMultiStateSetter(setShaderState, "zoom"),
    useMultiStateSetter(setShaderState, "offset"),
    scale,
    dim
  );

  return (
    <>
      <Canvas className="w-full h-full" ref={canvasRef}>
        <FullscreenShader
          uniforms={{
            c: { value: c },
            offset: { value: shaderOffset },
            scale: { value: scale },
            power: { value: power },
          }}
        />
        <Stats className="rounded-2xl translate-1" />
      </Canvas>
      <DraggableDot
        dragPos={shaderState.dragPos}
        setDragPos={useMultiStateSetter(setShaderState, "dragPos")}
        offset={shaderState.offset}
        canvasRef={canvasRef}
        zoom={shaderState.zoom}
        dim={shaderState.dim}
      />
    </>
  );
};

const JuliaShader: Shader<JuliaShaderState, JuliaShaderPropsResult> = {
  shaderInfo: JuliaShaderInfo,
  shaderDefaultState: JuliaShaderDefaultState,
  shaderProps: JuliaShaderProps,
  shaderComponent: JuliaShaderComponent,
};

export default JuliaShader;
