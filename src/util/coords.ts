import * as THREE from "three";

/*
  Utility functions for converting between different coordinate systems:
  - Raw Screen Coordinates: (0,0) at top-left corner of the canvas, in pixels
  - Raw Offset: pixel offset from dragging, which is inverted on the x axis

  - Normalized Screen Coordinates: (0,0) at center of the canvas, in pixels
  - Normalized Offset: pixel offset from dragging, with positive x moving the 
    center to the right (picture shifts left) and positive y moving the center 
    to the bottom (picture shifts up)

  - World Coordinates: Actual coordinates in shader space
  - World Offset: Actual offset in shader space
*/

// Converts raw screen coordinates (pixels) to normalized screen coordinates ((0, 0) at center)
export const rawScreenToNormal = (
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

// Converts normalized screen coordinates to raw screen coordinates (pixels) ((0, 0) at top-left)
export const normalToRawScreen = (
  normScreenPos: THREE.Vector2,
  dim: THREE.Vector2
): THREE.Vector2 => {
  return new THREE.Vector2(
    normScreenPos.x + dim.x / 2,
    -normScreenPos.y - dim.y / 2
  );
};

// Converts raw offset (pixels) to normalized offset (move to right is positive x, move to bottom is positive y)
export const rawOffsetToNormal = (rawOffset: THREE.Vector2): THREE.Vector2 => {
  // offset.x: move center to left is positive, move center to right is negative
  // offset.y: move center to top is negative, move center to bottom is positive
  return new THREE.Vector2(-rawOffset.x, rawOffset.y);
};

// Converts normalized screen position (with (0,0) at center, pixels) to world position (actual coordinates in shader space)
export const normalToWorld = (
  screenPos: THREE.Vector2,
  scale: THREE.Vector2,
  dim: THREE.Vector2,
  offset: THREE.Vector2
): THREE.Vector2 => {
  return screenPos.clone().add(offset).divide(dim).multiply(scale);
};

// Converts world position (actual coordinates in shader space) to normalized screen position (with (0,0) at center, pixels)
export const worldToNormal = (
  worldPos: THREE.Vector2,
  scale: THREE.Vector2,
  dim: THREE.Vector2,
  offset: THREE.Vector2
): THREE.Vector2 => {
  return worldPos.clone().divide(scale).multiply(dim).sub(offset);
};

// Converts normalized offset (move to right is +x, move to bottom is +y, pixels) to world offset (actual offset in shader space)
export const offsetToWorld = (
  offset: THREE.Vector2,
  scale: THREE.Vector2,
  dim: THREE.Vector2
): THREE.Vector2 => {
  return normalToWorld(
    offset,
    scale,
    dim,
    new THREE.Vector2(0, 0)
  ).multiplyScalar(2.0);
};

// Converts world offset (actual offset in shader space) to normalized offset (move to right is +x, move to bottom is +y, pixels)
export const worldToOffset = (
  worldOffset: THREE.Vector2,
  scale: THREE.Vector2,
  dim: THREE.Vector2
): THREE.Vector2 => {
  return worldToNormal(
    worldOffset.divideScalar(2.0),
    scale,
    dim,
    new THREE.Vector2(0, 0)
  );
};
