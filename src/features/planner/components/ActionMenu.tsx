import { MdUnfoldMore, MdUnfoldLess } from "react-icons/md";

import AddSemester from "@/features/planner/components/AddSemester";
import { usePlannerLayoutStore } from "@/features/planner/PlannerLayoutStore";
import { cn } from "@/lib/classnames";

export default function ActionMenu() {
  const { allExpanded, setAllExpanded } = usePlannerLayoutStore();
  const toggleExpanded = () => setAllExpanded(!allExpanded);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleExpanded}
        className={cn(
          "flex items-center justify-center gap-1",
          "border-1 border-black rounded-full pl-3 pr-4 py-2 w-fit text-xs font-medium hover:bg-darkblue/20 transition-colors",
        )}
        title={allExpanded ? "Collapse All" : "Expand All"}
      >
        {allExpanded ? (
          <>
            <MdUnfoldLess size={16} />
            <span>Collapse All</span>
          </>
        ) : (
          <>
            <MdUnfoldMore size={16} />
            <span>Expand All</span>
          </>
        )}
      </button>
      <AddSemester />
    </div>
  );
}
