import * as THREE from "three";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { worldToNormal, worldToOffset } from "../util/coords";
import { Button } from "./ui/button";
import {
  ArrowCounterClockwiseIcon,
  ArrowsOutCardinalIcon,
  CaretDownIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { Separator } from "./ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import formatNumber from "@/util/formatNumber";
import { useEffect, useRef, type MouseEventHandler } from "react";

const PopoverInputComponent = ({
  label,
  resetAction,
  ...props
}: {
  label?: string;
  resetAction?: MouseEventHandler<HTMLButtonElement>;
} & React.ComponentProps<typeof Input>) => {
  /* <Slider
      className=""
      value={[zoom < 1 ? zoom : (zoom + 49) / 50]}
      onValueChange={([val]) => setZoom(val < 1 ? val : val * 50 - 49)}
      min={0.001}
      max={2}
      step={0.0002}
    /> */

  return (
    <div className="flex items-center space-x-2">
      {label && <Label className="mr-2 font-bold">{label}</Label>}
      <Input
        type="number"
        className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${props.className}`}
        {...props}
      />
      {resetAction && (
        <Button variant="outline" size="sm" onClick={resetAction}>
          <ArrowCounterClockwiseIcon />
        </Button>
      )}
    </div>
  );
};

const ButtonPopoverComponent = ({
  icon,
  label,
  value,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  children?: React.ReactNode;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default">
          {icon}
          <span className="font-bold">{label}</span> {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 flex flex-col space-y-2 w-full">
        {children}
      </PopoverContent>
    </Popover>
  );
};

const BottomBarComponent = ({
  zoom,
  setZoom,
  c,
  scale,
  dim,
  offset,
  setOffset,
  shaderOffset,
  dragPos,
  setDragPos,
}: {
  zoom: number;
  setZoom: (val: number) => void;
  c: THREE.Vector2;
  scale: THREE.Vector2;
  dim: THREE.Vector2;
  offset: THREE.Vector2;
  setOffset: (val: THREE.Vector2) => void;
  shaderOffset: THREE.Vector2;
  dragPos: THREE.Vector2;
  setDragPos: (val: THREE.Vector2) => void;
}) => {
  return (
    <div className="absolute bottom-8 w-[min(75%,70rem)] rounded-lg bg-black opacity-90 hover:opacity-100 p-3 flex space-x-3 items-center left-1/2 -translate-x-1/2 h-15">
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
    </div>
  );
};

export default BottomBarComponent;
