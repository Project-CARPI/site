import { useDndContext, useDroppable } from "@dnd-kit/core";
import { MdDelete } from "react-icons/md";

import { cn } from "@/lib/classnames";

export default function GarbageBin() {
  const { setNodeRef, isOver } = useDroppable({
    id: "garbage",
  });

  const { active } = useDndContext();

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-fit transition-opacity duration-200",
        active ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div
        className={cn(
          "rounded-full m-4 p-4 text-5xl transition-transform ease-in-out w-fit",
          isOver ? "bg-red-500 scale-115" : "bg-red-400",
        )}
      >
        <MdDelete />
      </div>
    </div>
  );
}
