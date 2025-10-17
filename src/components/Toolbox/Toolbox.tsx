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
  const isDesktop = useIsDesktop();
  const [isOpen, setIsOpen] = useState(isDesktop);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(courses.length);
  }, [courses]);

  useEffect(() => {
    setIsOpen(isDesktop);
  }, [isDesktop]);

  const toggleToolbox = () => {
    setIsOpen((open) => !open);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 flex flex-col items-center justify-center w-screen z-50 ${
        !isOpen && isDesktop ? "pointer-events-none" : "pointer-events-auto"
      }`}
    >
      {!isDesktop && !isOpen && (
        <ToolboxButton
          isOpen={isOpen}
          toggleToolbox={toggleToolbox}
          count={count}
        />
      )}

      <div
        className={`w-full transform bg-[#283044] rounded-t-xl transition-transform duration-300 ease-in-out pointer-events-auto ${
          isOpen
            ? "translate-y-0"
            : isDesktop
              ? "translate-y-[calc(100%-52px)]"
              : "translate-y-full"
        }`}
      >
        <GarbageBin isDragging={isDragging} />

        <div
          className="flex items-center gap-4 p-3 mx-2 cursor-pointer"
          onClick={toggleToolbox}
          role="button"
          aria-expanded={isOpen}
          aria-controls="toolbox-content"
        >
          <div className="flex items-center">
            <h2 className="text-[#F5CECE] font-semibold text-xl">TOOLBOX</h2>
            <IoIosArrowDown
              className={`ml-2 text-2xl text-[#F5CECE] transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          {count > 0 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#78A1BB] text-sm font-medium text-white">
              {count}
            </div>
          )}
        </div>

        <div id="toolbox-content">
          <Droppable droppableId="toolbox" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`courses flex items-center scrollbar-thumb-darkblue scrollbar-track-darkblue scrollbar-thin overflow-x-auto whitespace-nowrap px-4 pb-2 scrollbar-hide transition-colors`}
                style={{ minHeight: "50px" }}
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
            )}
          </Droppable>
        </div>
      </div>

      {!isDesktop && <NavButton />}
    </div>
  );
};

export default Toolbox;
