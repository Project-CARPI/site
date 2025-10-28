import React, { useState, useEffect } from "react";
import useIsDesktop from "../../hooks/useIsDesktop";

import ToolboxButton from "./ToolboxButton";
import NavButton from "./NavButton";
import { Droppable } from "@hello-pangea/dnd";
import { IoIosArrowDown } from "react-icons/io";
import GarbageBin from "../GarbageBin";
import DraggableItem from "../DraggableItem";
import { useCourseWorkspace } from "../../hooks/useCourseWorkspace";

const Toolbox: React.FC = () => {
  const isDesktop = useIsDesktop();
  const [isOpen, setIsOpen] = useState(isDesktop);
  const [count, setCount] = useState(0);

  const { toolboxCourses, isDragging } = useCourseWorkspace();

  useEffect(() => {
    setCount(
      toolboxCourses.reduce((total, course) => total + (course.count || 0), 0)
    );
  }, [toolboxCourses]);

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
        className={`w-full bg-[#283044] rounded-t-xl transition-transform duration-300 ease-in-out pointer-events-auto ${
          isOpen
            ? ""
            : isDesktop
              ? "transform translate-y-[calc(100%-52px)]"
              : "transform translate-y-full"
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
                className={`courses gap-4 pt-3 h-[75px] md:min-h-[50px] scrollbar-none flex justify-items-center w-full overflow-x-auto px-4 pb-2 transition-colors`}
              >
                {toolboxCourses.map((course, index) => (
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
