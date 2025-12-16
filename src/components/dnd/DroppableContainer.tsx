import React from "react";
import {
  AnimateLayoutChanges,
  useSortable,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  id: UniqueIdentifier;
  items: UniqueIdentifier[];
  children: React.ReactNode;
  classname?: string;
}

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export function DroppableContainer({ children, id, items, classname }: Props) {
  // const { isOver, setNodeRef } = useDroppable({
  //   id,
  // });

  const {
    // active,
    // attributes,
    isDragging,
    // listeners,
    // over,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id,
    data: {
      type: "container",
      children: items,
    },
    animateLayoutChanges,
  });

  // const isOverContainer = over
  //   ? (id === over.id && active?.data.current?.type !== "container") ||
  //     items.includes(over.id)
  //   : false;

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={classname}
      aria-label="Droppable region"
    >
      {children}
    </div>
  );
}
