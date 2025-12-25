import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import * as THREE from "three";
import { rawOffsetToNormal } from "../util/coords";

const useZoomAndPan = (
  zoom: number,
  setZoom: Dispatch<SetStateAction<number>>,
  scale: THREE.Vector2,
  dim: THREE.Vector2
): {
  offset: THREE.Vector2;
  setOffset: Dispatch<SetStateAction<THREE.Vector2>>;
} => {
  const [offset, setOffset] = useState(() => new THREE.Vector2(0, 0));

  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 2) return;

      dragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      (e.target as Element)?.setPointerCapture?.(e.pointerId);
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };

      const toAdd = rawOffsetToNormal(new THREE.Vector2(dx, dy));

      setOffset(
        (prev) => new THREE.Vector2(prev.x + toAdd.x, prev.y + toAdd.y)
      );
    };

    const onPointerUp = (e: PointerEvent) => {
      dragging.current = false;
      (e.target as Element)?.releasePointerCapture?.(e.pointerId);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [scale]);

  useEffect(() => {
    const handleZoom = (e: WheelEvent) => {
      e.preventDefault();

      const zoomFactor = Math.exp(-e.deltaY * 0.0005);

      setZoom((prevZoom) => prevZoom * zoomFactor);

      setOffset((prevOffset) => {
        const offsetCenter = new THREE.Vector2(
          dim.x / 2 - e.clientX,
          e.clientY - dim.y / 2
        );

        return new THREE.Vector2(
          offsetCenter.x - zoomFactor * (offsetCenter.x - prevOffset.x),
          offsetCenter.y - zoomFactor * (offsetCenter.y - prevOffset.y)
        );
      });
    };

    const ref = { current: document.body };
    ref.current.addEventListener("wheel", handleZoom);

    return () => ref.current?.removeEventListener("wheel", handleZoom);
  });

  return { offset, setOffset };
};

export default useZoomAndPan;
