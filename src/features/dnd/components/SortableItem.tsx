import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { UserCourse } from "@/features/course/interfaces";
import { SemesterType } from "@/features/planner/interfaces";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  data: UserCourse | SemesterType;
  type: "Course" | "Semester";
}

export const SortableItem = ({
  id,
  children,
  data,
  type,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type,
      ...data,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};
