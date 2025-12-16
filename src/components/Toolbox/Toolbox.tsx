import React, { useState, useEffect } from "react";
import useIsDesktop from "../../hooks/useIsDesktop";

import ToolboxButton from "./ToolboxButton";
import NavButton from "./NavButton";
import { IoIosArrowUp } from "react-icons/io";
import GarbageBin from "../GarbageBin";
import { useCourseWorkspace } from "../../hooks/useCourseWorkspace";

import { SortableItem } from "../dnd/SortableItem";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import ToolboxCourse from "../Course/ToolboxCourse";
// import SortableToolboxItem from "../dnd/SortableToolboxItem";

const Toolbox: React.FC = () => {
  const { setNodeRef } = useDroppable({ id: "toolbox" });

  const isDesktop = useIsDesktop();
  const [isOpen, setIsOpen] = useState(isDesktop);
  const [count, setCount] = useState(0);

  const { toolboxCourses } = useCourseWorkspace();

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
        className={`w-full bg-[#283044] rounded-t-xl h-auto transition-transform duration-300 ease-in-out pointer-events-auto ${
          isOpen
            ? "transform translate-y-0"
            : isDesktop
              ? "transform translate-y-[calc(100%-52px)]"
              : "transform translate-y-full"
        }`}
      >
        <GarbageBin />

        {/* Header */}
        <div className="flex items-center gap-4 p-3 mx-2 cursor-pointer">
          <div className="flex items-center">
            <h2 className="text-[#F5CECE] font-semibold text-xl">TOOLBOX</h2>
            <IoIosArrowUp
              className={`ml-2 text-2xl text-[#F5CECE] transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
              onClick={toggleToolbox}
              role="button"
              aria-expanded={isOpen}
              aria-controls="hideable-toolbox-content"
            />
          </div>

          {count > 0 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-steelblue text-sm font-medium text-white">
              {count}
            </div>
          )}
        </div>

        {/* Collapsible content */}
        <div
          className={`${isOpen ? "block" : "hidden"}`}
          id="hideable-toolbox-content"
        >
          <div
            ref={setNodeRef}
            className="courses gap-4 pt-3 md:h-[75px] h-[100px] md:min-h-[50px] scrollbar-none flex justify-items-center w-full overflow-x-auto px-4 pb-2 transition-colors relative"
          >
            {/* 2. Provide the sorting context */}
            <SortableContext
              items={toolboxCourses.map((c) => c.name)}
              strategy={horizontalListSortingStrategy}
            >
              {toolboxCourses.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[#F5CECE] opacity-60 text-sm md:text-base font-medium italic">
                    Add courses to plan your semester
                  </span>
                </div>
              ) : (
                toolboxCourses.map((course, index) => (
                  <SortableItem
                    key={course.name}
                    id={course.name}
                    data={course}
                  >
                    <ToolboxCourse
                      course={course.data}
                      name={course.name}
                      count={course.count}
                      index={index}
                      isDragging={false}
                    />
                  </SortableItem>
                ))
              )}
            </SortableContext>
          </div>

          {/* <Droppable droppableId="toolbox" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`courses gap-4 pt-3 md:h-[75px] h-[100px] md:min-h-[50px] scrollbar-none flex justify-items-center w-full overflow-x-auto px-4 pb-2 transition-colors relative`}
              >
                {toolboxCourses.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[#F5CECE] opacity-60 text-sm md:text-base font-medium italic">
                      Add courses to plan your semester
                    </span>
                  </div>
                ) : (
                  toolboxCourses.map((course, index) => (
                    <DraggableItem
                      key={course.name}
                      name={course.name}
                      count={course.count}
                      index={index}
                      course={course.data}
                      location="toolbox"
                      semesterIndex={null}
                    />
                  ))
                )}

                {provided.placeholder}
              </div>
            )}
          </Droppable> */}
        </div>
      </div>

      {!isDesktop && <NavButton />}
    </div>
  );
};

export default Toolbox;
