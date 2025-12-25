import * as THREE from "three";
import Draggable from "react-draggable";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { normalToRawScreen, normalizeRawScreen } from "../util/coords";

export const DraggableDot = ({
  dragPos,
  setDragPos,
  zoom,
  offset,
  canvasRef,
  dim,
}: {
  dragPos: THREE.Vector2;
  setDragPos: Dispatch<SetStateAction<THREE.Vector2>>;
  zoom: number;
  offset: THREE.Vector2;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  dim: THREE.Vector2;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const prevZoomOffset = useRef({ zoom: zoom, offset: offset.clone() });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.target !== canvasRef.current) return;

      // update state immediately
      const newPos = normalizeRawScreen(
        new THREE.Vector2(e.clientX, e.clientY - dim.y),
        dim
      );
      setDragPos(newPos);

      // if the draggable node exists, synthesize a mousedown on it so react-draggable begins dragging
      if (ref.current) {
        const synthetic = new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: e.clientX,
          clientY: e.clientY,
          button: 0,
        });

        ref.current.dispatchEvent(synthetic);
      }

      prevZoomOffset.current = { zoom: zoom, offset: offset.clone() };
    };

    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, [offset, dragPos, setDragPos, canvasRef, dim, zoom]);

  useLayoutEffect(() => {
    setDragPos((prev) => {
      if (
        prevZoomOffset.current.zoom === zoom &&
        prevZoomOffset.current.offset.equals(offset)
      )
        return prev;

      // Update drag pos based on new zoom level
      const normalized = prev
        .clone()
        .add(prevZoomOffset.current.offset)
        .divideScalar(prevZoomOffset.current.zoom)
        .multiplyScalar(zoom)
        .sub(offset);

      return normalized;
    });

    return () => {
      prevZoomOffset.current = { zoom: zoom, offset: offset.clone() };
    };
  }, [zoom, offset, prevZoomOffset, setDragPos]);

  return (
    <Draggable
      nodeRef={ref}
      position={normalToRawScreen(new THREE.Vector2(dragPos.x, dragPos.y), dim)}
      onDrag={(_, data) => {
        setDragPos(normalizeRawScreen(new THREE.Vector2(data.x, data.y), dim));
      }}
      bounds="parent"
    >
      <div
        ref={ref}
        className="w-4 h-4 rounded-full z-10 absolute -translate-1/2 bg-white/60 hover:bg-white/80 [.react-draggable-dragging]:bg-white border-2 border-white mix-blend-difference"
      ></div>
    </Draggable>
  );
};

export default DraggableDot;
