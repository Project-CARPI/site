import { useDroppable } from "@dnd-kit/core";
import { MdDelete } from "react-icons/md";

interface GarbageBinProps {
  // You can pass a prop to control visibility if needed,
  // though dnd-kit usually handles this via active state in the parent
  isVisible?: boolean;
}

const GarbageBin: React.FC<GarbageBinProps> = ({ isVisible = true }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "garbage",
  });

  return (
    <div
      ref={setNodeRef}
      className={`absolute bottom-47 w-fit transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`rounded-full border-2 m-4 p-3 border-red-600 text-5xl
          transition-transform ease-in-out w-fit 
          ${isOver ? "bg-red-500 scale-115" : "bg-red-400"}`}
      >
        <MdDelete />
      </div>
    </div>
  );
};

export default GarbageBin;
