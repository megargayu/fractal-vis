import * as THREE from "three";
import type { Dispatch, SetStateAction } from "react";

export type ShaderState = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
export type ShaderPropsResult = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface ShaderInfo<
  S extends ShaderState,
  R extends ShaderPropsResult
> {
  name: string;
  description: string;
  uniforms: (
    shaderState: S,
    setShaderState: Dispatch<SetStateAction<S>>,
    shaderProps: R
  ) => Record<string, THREE.IUniform>;
  bottomBar: (
    shaderState: S,
    setShaderState: Dispatch<SetStateAction<S>>,
    shaderProps: R
  ) => React.ReactNode;
}

export type ShaderComponentProps<
  S extends ShaderState,
  R extends ShaderPropsResult
> = {
  shaderState: S;
  setShaderState: Dispatch<SetStateAction<S>>;
  shaderProps: R;
};

export interface Shader<S extends ShaderState, R extends ShaderPropsResult> {
  shaderInfo: ShaderInfo<S, R>;
  shaderDefaultState: S;
  shaderProps: (shaderState: S) => R;
  ShaderComponent: React.FC<ShaderComponentProps<S, R>>;
}
