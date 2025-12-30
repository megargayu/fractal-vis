import {
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
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
  setDim: Dispatch<SetStateAction<THREE.Vector2>>,
  setScale: Dispatch<SetStateAction<THREE.Vector2>>,
  parent: boolean = false
) => {
  const minScale = 2 / zoom;
  const elem = getElem(elementRef, parent);

  useEffect(() => {
    setDim(getDim(elem));
  }, [elem, setDim]);

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
  }, [minScale, elem, setDim, setScale]);
};

export default useDim;
