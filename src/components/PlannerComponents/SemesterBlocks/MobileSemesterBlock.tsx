import React from "react";

import { Droppable } from "@hello-pangea/dnd";
import PlannerCourseHolder from "../PlannerCourseHolder";
import DraggableItem from "../../DraggableItem";

import { SemesterBlockProps } from "./SemesterBlock";

const SemesterBlock: React.FC<SemesterBlockProps> = ({
  semester,
  index,
  setPlannerCourses,
  setToolboxCourses,
}) => {
  return (
    <div className="flex mt-4">
      <div className="flex mb-4">
        <div className="flex  space-x-2">
          <div className="flex flex-col items-center justify-start">
            <span className="text-lg">SEM</span>
            <span className="text-2xl font-bold ">
              {semester.semesterNumber}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full items-end flex flex-col mt-2 *:pl-6">
        <div className="flex justify-between w-full mb-2 items-center">
          <button className="border-1 border-black rounded-full px-3 py-0 h-fit font-medium text-sm ">
            {semester.semesterSeason}
          </button>

          <div className="text-lg ">
            <span className="font-bold">credits:</span> {semester.creditsTotal}
          </div>
        </div>
        <Droppable droppableId={`planner-${index}`} direction="vertical">
          {(provided, snapshot) => {
            const isEmpty = semester.courseList.length === 0;
            const isHovering = snapshot.isDraggingOver;

            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col space-y-2 w-full"
              >
                {isEmpty && !isHovering && (
                  <PlannerCourseHolder isHover={false} />
                )}
                {isEmpty && isHovering && (
                  <PlannerCourseHolder isHover={true} />
                )}
                {!isEmpty &&
                  semester.courseList.map((course, courseIndex) => (
                    <DraggableItem
                      key={course.name}
                      name={course.name}
                      course={course.data}
                      count={course.count}
                      index={courseIndex}
                      semesterIndex={index}
                      setPlannerCourses={setPlannerCourses}
                      setToolboxCourses={setToolboxCourses}
                      location="planner"
                    />
                  ))}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>

        <hr className="border-[calc(0.05px)] border-[#c3a9a9] w-full mt-4 text-[#c3a9a9] " />
      </div>
    </div>
  );
};

export default SemesterBlock;
