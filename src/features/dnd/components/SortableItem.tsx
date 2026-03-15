import { useSortable } from "@dnd-kit/react/sortable";

import { UserCourse, SemesterType } from "@/lib/types";
import { DraggableData } from "@/lib/types/dnd";

interface SortableItemProps {
  id: string;
  index: number;
  group: string;
  type?: "course" | "semester";
  // 1. Update children to accept a function
  children: React.ReactNode | ((isDragging: boolean) => React.ReactNode);
  data: UserCourse | SemesterType;
}

export const SortableItem = ({
  id,
  children,
  data,
  type,
  index,
  group,
}: SortableItemProps) => {
  const dndData = {
    type: type || ("semesterID" in data ? "semester" : "course"),
    payload: data,
    group,
  } as DraggableData;

  const { ref, isDragging } = useSortable({
    id,
    group,
    type,
    accept: type === "course" ? "course" : "semester",
    feedback: "clone", // 2. Make sure clone feedback is enabled!
    index,
    data: dndData,
  });

  return (
    <div
      ref={ref}
      data-shadow={isDragging || undefined}
      data-dragging={isDragging}
      data-group={group} // 3. Attach the group so we can target it in CSS
    >
      {/* 4. Execute the function if children is a render prop */}
      {typeof children === "function" ? children(isDragging) : children}
    </div>
  );
};
