import React from "react";

import { SemesterType } from "../../types/interfaces/Semester.interface";
import { Droppable } from "@hello-pangea/dnd";
import PlannerCourseHolder from "./PlannerCourseHolder";
import DraggableItem from "../DraggableItem";
import { useCourseWorkspace } from "../../hooks/useCourseWorkspace";

const seasons: string[] = ["Fall", "Spring", "Summer", "Misc"];

export interface SemesterBlockProps {
  index: number;
  semester: SemesterType;
}

const SemesterBlock: React.FC<SemesterBlockProps> = ({ index, semester }) => {
  const { setPlannerCourses, setToolboxCourses } = useCourseWorkspace();

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
    <div className="flex flex-grow flex-col space-y-2">
      <div className="flex justify-between">
        <span className="text-md font-bold">
          Semester {semester.semesterNumber}
        </span>

        <div className="flex space-x-2 items-center">
          <select
            value={semester.semesterSeason}
            onChange={seasonDropdown}
            className="border-1 border-black rounded-full px-2 py-0 h-fit w-fit min-w-0 font-medium text-sm"
          >
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>

          <div className="">{semester.creditsTotal} credits</div>
        </div>
      </div>

      <Droppable droppableId={`planner-${index + 1}`} direction="vertical">
        {(provided, snapshot) => {
          const isEmpty = semester.courseList.length === 0;
          const isHovering = snapshot.isDraggingOver;

          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col space-y-2 h-full"
            >
              {isEmpty && !isHovering && (
                <PlannerCourseHolder isHover={false} />
              )}
              {isEmpty && isHovering && <PlannerCourseHolder isHover={true} />}
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
  );
};

export default SemesterBlock;
