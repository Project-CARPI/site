import { MdUnfoldMore, MdUnfoldLess } from "react-icons/md";

import AddSemester from "@/features/planner/components/AddSemester";
import { cn } from "@/lib/classnames";

interface ActionMenuProps {
  isAllCollapsed: boolean;
  toggleCollapse: () => void;
}

export default function ActionMenu({
  isAllCollapsed,
  toggleCollapse,
}: ActionMenuProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleCollapse}
        className={cn(
          "flex items-center justify-center gap-1",
          "border-1 border-black rounded-full pl-3 pr-4 py-2 w-fit text-xs font-medium hover:bg-darkblue/20 transition-colors",
        )}
        title={isAllCollapsed ? "Expand All" : "Collapse All"}
      >
        {isAllCollapsed ? (
          <>
            <MdUnfoldMore size={16} />
            <span>Expand All</span>
          </>
        ) : (
          <>
            <MdUnfoldLess size={16} />
            <span>Collapse All</span>
          </>
        )}
      </button>
      <AddSemester />
    </div>
  );
}
