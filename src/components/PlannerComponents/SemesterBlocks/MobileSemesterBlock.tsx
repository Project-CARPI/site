import React from "react";

import { Droppable } from "@hello-pangea/dnd";
import PlannerCourseHolder from "../PlannerCourseHolder";
import DraggableItem from "../../DraggableItem";

import { SemesterBlockProps } from "./SemesterBlock";
const seasons: string[] = ["fall", "spring", "summer", "misc"];

const SemesterBlock: React.FC<SemesterBlockProps> = ({
  semester,
  index,
  setPlannerCourses,
  setToolboxCourses,
}) => {
  const seasonDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeason = e.target.value;
    setPlannerCourses((prevCourses) =>
      prevCourses.map((sem) =>
        sem.semesterID === semester.semesterID
          ? { ...sem, semesterSeason: newSeason }
          : sem
      )
    );
  };
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
          <div className="relative">
            <select
              value={semester.semesterSeason}
              onChange={seasonDropdown}
              className="border border-black rounded-full px-3 py-0 h-fit font-medium text-sm appearance-none bg-transparent pr-6"
            >
              {seasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>

            {/* Custom arrow */}
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs">
              ▼
            </span>
          </div>

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
                className="flex flex-col space-y-2 h-full w-full"
              >
                {isEmpty && !isHovering && (
                  <PlannerCourseHolder isHover={false} />
                )}
                {isEmpty && isHovering && (
                  <PlannerCourseHolder isHover={true} />
                )}
                {!isEmpty && (
                  <>
                    {semester.courseList.map((course, courseIndex) => (
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
                  </>
                )}
              </div>
            );
          }}
        </Droppable>
      </div>
    </div>
  );
};

export default SemesterBlock;
