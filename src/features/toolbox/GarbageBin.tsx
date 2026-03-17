import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable, useDragOperation } from "@dnd-kit/react";
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

  const draggedType = operation?.source?.data?.type as string | undefined;
  const showBin =
    draggedType === "planner-course" || draggedType === "toolbox-course";

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
