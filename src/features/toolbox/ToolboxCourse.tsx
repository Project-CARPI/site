import { useSortable } from "@dnd-kit/react/sortable";

import CourseBadge from "@/components/course/CourseBadge";
import CourseLabel from "@/components/course/CourseLabel";
import { SortableItemProps } from "@/features/dnd/props";
import { UserCourse } from "@/lib/types";

type ToolboxCourseProps = SortableItemProps & {
  course: UserCourse;
};

export default function ToolboxCourse({
  id,
  index,
  group,
  course,
}: ToolboxCourseProps) {
  const { ref, isDragging } = useSortable({
    id,
    group,
    accept: "toolbox-course",
    type: "toolbox-course",
    feedback: "clone",
    index,
    data: { type: "toolbox-course", course },
  });

  return (
    <div
      ref={ref}
      data-shadow={isDragging || undefined}
      className="relative bg-carpipink text-nowrap rounded-md w-fit px-3 py-1 hover:cursor-grab active:cursor-grabbing select-none"
    >
      <CourseBadge count={course.count} className="absolute -top-2 -right-2" />
      <CourseLabel course={course.data} horizontal />
    </div>
  );
}
