import * as THREE from "three";

// Converts raw screen coordinates (pixels) to normalized screen coordinates
export const normalizeRawScreen = (
  rawScreenPos: THREE.Vector2,
  dim: THREE.Vector2
): THREE.Vector2 => {
  // screenX: left to right
  // screenY: bottom to top
  return new THREE.Vector2(
    rawScreenPos.x - dim.x / 2,
    -(rawScreenPos.y + dim.y / 2)
  );
};

// Converts normalized screen coordinates to raw screen coordinates (pixels)
export const normalToRawScreen = (
  normScreenPos: THREE.Vector2,
  dim: THREE.Vector2
): THREE.Vector2 => {
  return new THREE.Vector2(
    normScreenPos.x + dim.x / 2,
    -normScreenPos.y - dim.y / 2
  );
};

// Converts raw offset (pixels) to normalized offset
export const normalizeRawOffset = (rawOffset: THREE.Vector2): THREE.Vector2 => {
  // offset.x: move center to left is positive, move center to right is negative
  // offset.y: move center to top is negative, move center to bottom is positive
  return new THREE.Vector2(-rawOffset.x, rawOffset.y);
};

export const screenPosToWorld = (
  screenPos: THREE.Vector2,
  scale: THREE.Vector2,
  dim: THREE.Vector2,
  offset: THREE.Vector2
): THREE.Vector2 => {
  const transformed = new THREE.Vector2(
    (screenPos.x + offset.x) / dim.x,
    (screenPos.y + offset.y) / dim.y
  );

  transformed.multiply(scale);

  return transformed;
};
