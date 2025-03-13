import { Droppable } from "@hello-pangea/dnd";
import React from "react";
import { MdDelete } from "react-icons/md";

interface GarbageBinProps {
  isDragging: boolean;
}

const GarbageBin: React.FC<GarbageBinProps> = ({ isDragging }) => {
  return (
    <Droppable droppableId={`garbage`}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`absolute bottom-35 ${isDragging ? "" : "invisible"} w-fit`}
          >
            {provided.placeholder}
            <div
              className={` rounded-full border-2 m-4 p-4 border-red-600 text-5xl
                transition-transform ease-in-out w-fit 
                ${snapshot.isDraggingOver ? "bg-red-500 scale-115" : "bg-red-400"}`}
            >
              <MdDelete />
            </div>
          </div>
        );
      }}
    </Droppable>
  );
};

export default GarbageBin;
