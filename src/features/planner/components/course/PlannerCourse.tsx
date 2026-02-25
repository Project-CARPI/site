import { useState } from "react";

import * as ContextMenu from "@radix-ui/react-context-menu";
import * as Popover from "@radix-ui/react-popover";
import { motion } from "framer-motion";
import { MdOutlineMoreHoriz, MdDragIndicator } from "react-icons/md";

import CourseLabel from "@/components/course/CourseLabel";
import CourseMenuContent from "@/features/planner/components/course/CourseMenuContent";
import { usePlannerCourse } from "@/features/planner/usePlannerCourse";
import { cn } from "@/lib/classnames";
import { UserCourse } from "@/lib/types";

interface PlannerCourseProps {
  course: UserCourse;
  semesterId: string | null;
  isFirstSemester?: boolean;
  isLastSemester?: boolean;
  isDragging?: boolean;
}

export default function PlannerCourse({
  course,
  semesterId,
  isDragging,
}: PlannerCourseProps) {
  const menuOptions = usePlannerCourse({ course, semesterId });
  const [popoverOpen, setPopoverOpen] = useState(false);

  const menuClassName =
    "bg-carpipink rounded-xl border border-darkblue text-darkblue text-xs p-1.5 shadow-lg z-50 flex flex-col w-fit";

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <motion.div
          layout
          className={cn(
            "relative flex justify-between bg-darkblue rounded-2xl text-carpipink gap-4 px-2 py-3",
            "hover:shadow-lg",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          <div className="flex gap-2 items-center">
            <MdDragIndicator size={22} />
            <CourseLabel course={course.data} showCredits />
          </div>

          <Popover.Root
            open={popoverOpen && !isDragging}
            onOpenChange={setPopoverOpen}
          >
            <Popover.Trigger asChild>
              <button className="outline-none">
                <MdOutlineMoreHoriz className="cursor-pointer text-2xl" />
              </button>
            </Popover.Trigger>
            <Popover.Content
              className={menuClassName}
              side="bottom"
              align="end"
            >
              <CourseMenuContent
                options={menuOptions}
                onItemSelect={() => setPopoverOpen(false)}
                ItemComponent="button"
                SeparatorComponent="div"
              />
            </Popover.Content>
          </Popover.Root>
        </motion.div>
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content className={menuClassName}>
          <CourseMenuContent
            options={menuOptions}
            ItemComponent={ContextMenu.Item}
            SeparatorComponent={ContextMenu.Separator}
          />
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
