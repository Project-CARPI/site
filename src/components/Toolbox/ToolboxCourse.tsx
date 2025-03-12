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
  // provided: DraggableProvided;
  // snapshot: DraggableStateSnapshot;
}

const ToolboxCourse: React.FC<ToolboxCourseProps> = ({
  name,
  count,
  index,
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
              className={`bg-[#D9D9D9] w-fit px-3 rounded-lg py-1 relative mx-2 whitespace-nowrap overflow-visible`}
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
