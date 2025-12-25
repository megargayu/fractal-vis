import * as THREE from "three";
import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import fragmentShader from "../julia.frag?raw";

export const vertexShader = `
  uniform vec2 scale;
  uniform vec2 offset;
  varying vec2 pos;

  void main() {
    pos = (uv - vec2(0.5)) * 2.0;
    pos *= scale;
    pos += offset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FullscreenShader = ({
  c,
  scale,
  offset,
}: {
  c: THREE.Vector2;
  scale: THREE.Vector2;
  offset: THREE.Vector2;
}) => {
  const viewport = useThree((state) => state.viewport);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader,
      fragmentShader,
      uniforms: {
        c: { value: c },
        scale: { value: scale },
        offset: { value: offset },
        power: { value: 2 },
      },
      depthWrite: false,
      depthTest: false,
    });
  }, [scale, c, offset]);

  return (
    // plane covers NDC when using size 2x2 and centered camera; frustumCulled false keeps it always rendered
    <mesh material={material} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry />
    </mesh>
  );
};

export default FullscreenShader;
