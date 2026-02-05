import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { SortableItemContext } from "@/features/dnd/useSortableItem";
import { UserCourse, SemesterType } from "@/lib/types";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  data: UserCourse | SemesterType;
  type?: "Course" | "Semester";
  useHandle?: boolean;
}

export const SortableItem = ({
  id,
  children,
  data,
  type,
  useHandle = false,
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
      ...data,
      type: type || ("semesterID" in data ? "Semester" : "Course"),
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const listenersProp = useHandle ? {} : listeners;

  return (
    <SortableItemContext.Provider value={{ listeners, attributes }}>
      <div ref={setNodeRef} style={style} {...attributes} {...listenersProp}>
        {children}
      </div>
    </SortableItemContext.Provider>
  );
};
