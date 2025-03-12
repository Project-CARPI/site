import React from "react";
import { Draggable } from "@hello-pangea/dnd";
// import type {
//   DraggableProvided,
//   DraggableStateSnapshot,
// } from "@hello-pangea/dnd";

interface ToolboxCourseProps {
  name: string;
  count: number;
  index: number;
  isDragging: boolean;
  // provided: DraggableProvided;
  // snapshot: DraggableStateSnapshot;
}

const ToolboxCourse: React.FC<ToolboxCourseProps> = ({
  name,
  count,
  index,
  isDragging,
}) => {
  const courseId = name.slice(0, 8);
  return (
    <>
      <Draggable key={courseId} draggableId={courseId} index={index}>
        {(provided, snapshot) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`bg-[#D9D9D9] w-fit px-3 rounded-lg py-1 relative mx-2 whitespace-nowrap overflow-visible transition-transform ease-in-out z-200 
                ${isDragging ? (snapshot.isDragging ? "brightness-125 scale-105 shadow-sm shadow-carpipink" : "brightness-50") : ""}`}
            >
              <div
                className={`${
                  count === 1 ? "hidden" : ""
                } absolute -top-2 -right-2  rounded-full bg-[#78A1BB] w-6 h-6 flex justify-center items-center text-white text-sm`}
              >
                <p>{count}</p>
              </div>
              {name}
            </div>
          );
        }}
      </Draggable>
    </>
  );
};

export default ToolboxCourse;
