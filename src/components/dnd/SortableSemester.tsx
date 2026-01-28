import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SemesterType } from "../../types/interfaces/Semester.interface";

interface SortableSemesterProps {
  id: string;
  children: React.ReactNode;
  data: SemesterType;
}

export const SortableSemester = ({
  id,
  children,
  data,
}: SortableSemesterProps) => {
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
      type: "Semester",
      ...data,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};
