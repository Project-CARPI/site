import { useEffect } from "react";

import { CollisionPriority } from "@dnd-kit/abstract";
import { AutoScroller } from "@dnd-kit/dom";
import {
  useDroppable,
  useDragOperation,
  useDragDropManager,
} from "@dnd-kit/react";
import { MdDelete } from "react-icons/md";

import { cn } from "@/lib/classnames";

export default function GarbageBin() {
  const { ref, isDropTarget } = useDroppable({
    id: "garbage",
    type: "garbage",
    accept: ["planner-course", "toolbox-course"],
    collisionPriority: CollisionPriority.Highest,
  });

  const operation = useDragOperation();
  const manager = useDragDropManager();

  const draggedType = operation?.source?.data?.type as string | undefined;
  const showBin =
    draggedType === "planner-course" || draggedType === "toolbox-course";

  useEffect(() => {
    if (!manager) return;

    // Grab the active AutoScroller plugin from the core registry
    const autoScroller = manager.registry.plugins.get(AutoScroller);

    if (autoScroller) {
      autoScroller.disabled = isDropTarget;
    }

    // Safety cleanup: Ensure autoscrolling is re-enabled if the bin
    // unmounts or the drag ends while still hovering.
    return () => {
      if (autoScroller && isDropTarget) {
        autoScroller.disabled = false;
      }
    };
  }, [isDropTarget, manager]);

  return (
    <button
      ref={ref}
      className={cn(
        "w-fit transition-opacity duration-200",
        showBin ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div
        className={cn(
          "rounded-full p-4 text-5xl transition-transform ease-in-out w-fit",
          isDropTarget ? "bg-red-500 scale-110" : "bg-red-400",
        )}
      >
        <MdDelete />
      </div>
    </button>
  );
}
