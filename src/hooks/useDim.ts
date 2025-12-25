import { useEffect, useState, type RefObject } from "react";
import * as THREE from "three";

const getElem = (
  elementRef?: RefObject<HTMLElement | null>,
  parent: boolean = false
) => {
  return parent
    ? elementRef?.current?.parentElement || null
    : elementRef?.current || null;
};

export const getDim = (element: HTMLElement | null): THREE.Vector2 => {
  const rect = element?.getBoundingClientRect();

  return new THREE.Vector2(
    rect?.width || window.innerWidth,
    rect?.height || window.innerHeight
  );
};

const useDim = (
  elementRef: RefObject<HTMLElement | null>,
  zoom: number,
  parent: boolean = false
) => {
  const [dim, setDim] = useState<THREE.Vector2>(new THREE.Vector2());
  const [scale, setScale] = useState(() => new THREE.Vector2(2, 2));

  const minScale = 2 / zoom;
  const elem = getElem(elementRef, parent);

  useEffect(() => {
    setDim(getDim(elem));
  }, [elem]);

  useEffect(() => {
    const updateDim = () => {
      const newDim = getDim(elem);
      setDim(newDim);

      const minDim = Math.min(newDim.x, newDim.y);

      const newScale = new THREE.Vector2(
        (minScale * newDim.x) / minDim,
        (minScale * newDim.y) / minDim
      );

      setScale(newScale);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateDim();
    });

    updateDim();
    if (!elem) return;

    resizeObserver.observe(elem);

    return () => {
      resizeObserver.unobserve(elem);
    };
  }, [minScale, elem]);

  return [dim, scale];
};

export default useDim;
