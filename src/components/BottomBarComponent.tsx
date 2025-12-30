import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  ArrowCounterClockwiseIcon,
  CaretDownIcon,
  GearIcon,
} from "@phosphor-icons/react";
import { Separator } from "./ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  type Dispatch,
  type MouseEventHandler,
  type SetStateAction,
} from "react";

import type {
  ShaderInfo,
  ShaderPropsResult,
  ShaderState,
} from "@/shaders/Shader";

export const PopoverInputComponent = ({
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

export const ButtonPopoverComponent = ({
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
          {(label || value) && (
            <>
              <span className="font-bold">{label}</span> {value}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 flex flex-col space-y-2 w-full">
        {children}
      </PopoverContent>
    </Popover>
  );
};

const BottomBarComponent = <
  S extends ShaderState,
  R extends ShaderPropsResult
>({
  shaderInfo,
  shaderState,
  setShaderState,
  shaderProps,
}: {
  shaderInfo: ShaderInfo<S, R>;
  shaderState: S;
  setShaderState: Dispatch<SetStateAction<S>>;
  shaderProps: R;
}) => {
  return (
    <div className="absolute bottom-8 max-w-3/4 rounded-lg bg-black opacity-90 hover:opacity-100 p-3 flex space-x-3 items-center left-1/2 -translate-x-1/2 h-15">
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

      {shaderInfo.bottomBar(shaderState, setShaderState, shaderProps)}

      <Separator orientation="vertical" />

      <ButtonPopoverComponent
        icon={<GearIcon />}
        label=""
        value=""
      ></ButtonPopoverComponent>
    </div>
  );
};

export default BottomBarComponent;
