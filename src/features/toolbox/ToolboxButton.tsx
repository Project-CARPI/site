import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";
import { PiToolbox } from "react-icons/pi";

import { cn } from "@/lib/classnames";

interface ToolboxButtonProps {
  toggleToolbox: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isOpen: boolean;
  count: number;
}
export default function ToolboxButton({
  toggleToolbox,
  isOpen,
  count,
}: ToolboxButtonProps) {
  const { ref, isDropTarget } = useDroppable({
    id: "toolbox-button",
    type: "toolbox-button",
    accept: ["planner-course", "toolbox-course"],
    collisionPriority: CollisionPriority.Highest,
  });

  return (
    <button
      ref={ref}
      onClick={toggleToolbox}
      className={cn(
        "relative bg-darkblue rounded-full text-carpipink text-5xl p-4 border-carpipink border hover:cursor-pointer transition-transform ease-in-out",
        isOpen && "hidden",
        isDropTarget && "scale-110",
      )}
    >
      <div
        className={cn(
          count === 0 && "hidden",
          "absolute -top-1 -right-2  rounded-full bg-steelblue w-8 h-8 flex justify-center items-center text-white text-lg",
        )}
      >
        <p>{count}</p>
      </div>
      <PiToolbox />
    </button>
  );
}
