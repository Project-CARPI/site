import React, { useState, useEffect } from "react";
import useIsDesktop from "../../hooks/useIsDesktop";

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
  const [count, updateCount] = useState(0);
  const isDesktop = useIsDesktop();

  const toggleToolbox = () => {
    setIsOpen((open) => !open);
  };

  useEffect(() => {
    updateCount(courses.length);
  }, [courses]);

  return (
    <div className={`transition-all fixed bottom-0 w-screen z-100`}>
      {!isDesktop && (
        <ToolboxButton
          isOpen={isOpen}
          toggleToolbox={toggleToolbox}
          count={count}
        />
      )}
      <GarbageBin isDragging={isDragging} />
      <div className={`flex justify-center`}>
        <div
          className={`${isDesktop ? (isOpen ? "translate-y-0" : "translate-y-[calc(100%-44px)]") : isOpen ? "" : "hidden"} bg-[#283044] h-36 w-screen rounded-t-xl transition-transform duration-300 ease-in-out`}
        >
          <div className={`close-toolbox`}>
            <button
              className={`flex items-center text-[#F5CECE] font-semibold mt-2 mx-5 text-xl p-1 ${isDesktop ? "cursor-default" : ""}`}
              onClick={toggleToolbox}
            >
              TOOLBOX
              <IoIosArrowDown
                className={`mx-2 transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`}
              />
              <div
                className={`${
                  count === 0 ? "hidden" : ""
                } rounded-full bg-[#78A1BB] w-6 h-6 flex justify-center items-center text-white text-sm font-medium`}
              >
                <p>{count}</p>
              </div>
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

        {!isDesktop && <NavButton />}
      </div>
    </div>
  );
};

export default Toolbox;
