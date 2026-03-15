import { useSortable } from "@dnd-kit/react/sortable";

import { UserCourse, SemesterType } from "@/lib/types";
import { DraggableData } from "@/lib/types/dnd";

type SortableCourseProps = {
  id: string;
  index: number;
  group: string;
  children: React.ReactNode;
  data: UserCourse | SemesterType;
};

export default function SortableCourse({
  id,
  children,
  data,
  index,
  group,
}: SortableCourseProps) {
  const dndData = {
    type: "course",
    payload: data,
    group,
  } as DraggableData;

  const { ref, isDragging } = useSortable({
    id,
    group,
    accept: "course",
    type: "course",
    feedback: "clone",
    index,
    data: dndData,
  });

  return (
    <div
      ref={ref}
      data-shadow={isDragging || undefined}
      data-dragging={isDragging}
    >
      {children}
    </div>
  );
}
