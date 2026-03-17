import { useState } from "react";

import { useSortable } from "@dnd-kit/react/sortable";
import * as ContextMenu from "@radix-ui/react-context-menu";
import * as Popover from "@radix-ui/react-popover";
import { MdOutlineMoreHoriz, MdDragIndicator } from "react-icons/md";

import CourseBadge from "@/components/course/CourseBadge";
import CourseLabel from "@/components/course/CourseLabel";
import { SortableItemProps } from "@/features/dnd/props";
import CourseMenuContent from "@/features/planner/components/course/CourseMenuContent";
import CreditSelector from "@/features/planner/components/CreditSelector";
import { usePlannerCourse } from "@/features/planner/usePlannerCourse";
import { cn } from "@/lib/classnames";
import { UserCourse } from "@/lib/types";

type CourseVariant = "toolbox" | "planner";

export type CourseProps = SortableItemProps & {
  course: UserCourse;
  variant: CourseVariant;
  semesterId?: string | null;
};

export default function Course({
  id,
  index,
  group,
  course,
  variant,
  semesterId = null,
}: CourseProps) {
  const dndType = `${variant}-course`;

  const { handleRef, ref, isDragging } = useSortable({
    id,
    group,
    accept: dndType,
    type: dndType,
    feedback: "clone",
    index,
    data: { type: dndType, course },
  });

  if (variant === "toolbox") {
    return (
      <ToolboxCourseView
        innerRef={ref}
        isDragging={isDragging}
        course={course}
      />
    );
  }

  return (
    <PlannerCourseView
      innerRef={ref}
      handleRef={handleRef}
      isDragging={isDragging}
      course={course}
      semesterId={semesterId}
    />
  );
}

type ViewProps = {
  innerRef?: (element: HTMLElement | null) => void;
  handleRef?: (element: HTMLElement | null) => void;
  isDragging: boolean;
  course: UserCourse;
  semesterId?: string | null;
};

function ToolboxCourseView({ innerRef, isDragging, course }: ViewProps) {
  return (
    <div
      ref={innerRef}
      data-shadow={isDragging || undefined}
      className="relative bg-carpipink text-nowrap rounded-md w-fit px-3 py-1 hover:cursor-grab active:cursor-grabbing select-none"
    >
      <CourseBadge count={course.count} className="absolute -top-2 -right-2" />
      <CourseLabel course={course.data} horizontal />
    </div>
  );
}

function PlannerCourseView({
  innerRef,
  handleRef,
  isDragging,
  course,
  semesterId,
}: ViewProps) {
  const menuOptions = usePlannerCourse({
    course,
    semesterId: semesterId ?? null,
  });
  const [popoverOpen, setPopoverOpen] = useState(false);

  if (!semesterId) {
    console.warn(
      "PlannerCourseView rendered without semesterId. Context menu actions may not work properly.",
    );
    return;
  }

  const menuClassName =
    "bg-carpipink rounded-xl border border-darkblue text-darkblue text-xs p-1.5 shadow-lg z-50 flex flex-col w-fit";

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div
          ref={innerRef}
          className={cn(
            "relative flex justify-between bg-darkblue rounded-2xl text-carpipink gap-4 px-2 py-3",
            "hover:shadow-lg",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          <div className="flex gap-2 items-center">
            <button ref={handleRef}>
              <MdDragIndicator size={22} />
            </button>
            <CourseLabel course={course.data} showCredits />
          </div>

          <div className="items-center flex">
            <CreditSelector
              semesterId={semesterId}
              courseId={course.id}
              currentCredits={course.credits}
              minCredits={course.data.credit_min}
              maxCredits={course.data.credit_max}
            />
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
        </div>
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
