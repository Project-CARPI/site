import { useSortable } from "@dnd-kit/react/sortable";

import { UserCourse, SemesterType } from "@/lib/types";
import { DraggableData } from "@/lib/types/dnd";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  data: UserCourse | SemesterType;
  type?: "course" | "semester";
  useHandle?: boolean;
  index: number;
}

export const SortableItem = ({
  id,
  children,
  data,
  type,
  index,
}: SortableItemProps) => {
  const dndData = {
    type: type || ("semesterID" in data ? "semester" : "course"),
    payload: data,
  } as DraggableData;

  const { ref, isDragging } = useSortable({
    id,
    index,
    data: dndData,
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={ref} style={style} data-dragging={isDragging}>
      {children}
    </div>
  );
};
