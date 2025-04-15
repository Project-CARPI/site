import React, { useState } from "react";
import ToolboxButton from "./ToolboxButton";
import NavButton from "./NavButton";
import { Droppable } from "@hello-pangea/dnd";
import { IoIosArrowDown } from "react-icons/io";
import { CourseEntry } from "../../types/interfaces/Course.interface";
import GarbageBin from "../GarbageBin";
import DraggableItem from "../DraggableItem";

interface ToolboxProps {
  courses: CourseEntry[];
  isDragging: boolean;
}

const Toolbox: React.FC<ToolboxProps> = ({ courses, isDragging }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleToolbox = () => {
    setIsOpen((open) => !open);
  };

  const toolboxSum = () => {
    let sum = 0;
    courses.forEach((course) => (sum += course.count));
    return sum;
  };
  return (
    <>
      <div className={`transition-all fixed bottom-0 w-screen z-100`}>
        <ToolboxButton
          isOpen={isOpen}
          toggleToolbox={toggleToolbox}
          count={toolboxSum()}
        />
        <GarbageBin isDragging={isDragging} />
        <div className={`flex justify-center`}>
          <div
            className={`${isOpen ? "" : "hidden"} bg-[#283044] h-36 w-screen rounded-t-xl`}
          >
            <div className={`close-toolbox`}>
              <button
                className={`flex items-center text-[#F5CECE] font-semibold mt-2 mx-5 text-xl p-1`}
                onClick={toggleToolbox}
              >
                TOOLBOX
                <IoIosArrowDown className={`mx-2`} />
              </button>
            </div>

            <Droppable droppableId={`toolbox`} direction="horizontal">
              {(provided, snapshot) => {
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`courses h-15 flex items-center px-2 w-screen overflow-x-auto whitespace-nowrap scrollbar-hide ${snapshot.isDraggingOver ? "bg-[#7e8eb4]" : ""}`}
                  >
                    {courses.map((course, index) => (
                      <DraggableItem
                        key={course.name}
                        name={course.name}
                        count={course.count}
                        index={index}
                        course={course.data}
                        location="toolbox"
                        setPlannerCourses={null}
                        setToolboxCourses={null}
                        semesterIndex={null}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </div>

          <NavButton />
        </div>
      </div>
    </>
  );
};

export default Toolbox;
