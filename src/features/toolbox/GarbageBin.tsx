import { useState } from "react";

import type { Draggable } from "@dnd-kit/abstract";
import { useDroppable, useDragDropMonitor } from "@dnd-kit/react";
import { MdDelete } from "react-icons/md";

import { cn } from "@/lib/classnames";
import useIsDesktop from "@/lib/hooks/useIsDesktop";

export default function GarbageBin() {
  const isDesktop = useIsDesktop();
  const { ref, isDropTarget } = useDroppable({
    id: "garbage",
  });

  const [draggingItem, setDraggingItem] = useState<Draggable | null>(null);

  useDragDropMonitor({
    onDragStart: (event) => {
      const source = event.operation.source;
      setDraggingItem(source);
    },
    onDragEnd: () => {
      setDraggingItem(null);
    },
  });

  const draggedType =
    draggingItem?.data?.type || draggingItem?.data?.current?.type;

  const showBin = (isDesktop && draggingItem) || draggedType === "course";

  return (
    <div
      ref={ref}
      className={cn(
        "w-fit transition-opacity duration-200",
        showBin ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div
        className={cn(
          "rounded-full m-4 p-4 text-5xl transition-transform ease-in-out w-fit",
          // FIX 2: Replaced 'scale-115' with 'scale-[1.15]'
          isDropTarget ? "bg-red-500 scale-[1.15]" : "bg-red-400",
        )}
      >
        <MdDelete />
      </div>
    </div>
  );
}
