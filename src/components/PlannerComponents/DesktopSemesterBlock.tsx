import React, { Dispatch, SetStateAction } from "react";
import { SemesterType } from "../../types/interfaces/Semester.interface";
import { Droppable } from "@hello-pangea/dnd";
import PlannerCourseHolder from "./PlannerCourseHolder";
import DraggableItem from "../DraggableItem";
import { CourseEntry } from "../../types/interfaces/Course.interface";

interface SemesterBlockProps {
  semester: SemesterType;
  index: number;
  setPlannerCourses: Dispatch<SetStateAction<SemesterType[]>>;
  setToolboxCourses: Dispatch<SetStateAction<CourseEntry[]>>;
}

const DesktopSemesterBlock: React.FC<SemesterBlockProps> = ({
  semester,
  index,
  setPlannerCourses,
  setToolboxCourses,
}) => {
  return (
    <div className="flex w-[49%] flex-col space-y-2">
      <div className="flex justify-between">
        <span className="text-md font-bold">
          Semester {semester.semesterNumber}
        </span>
        <div className="flex space-x-2 items-center">
          <button className="border-1 border-black rounded-full px-3 py-0 h-fit font-medium text-sm ">
            {semester.semesterSeason}
          </button>
          <div className="">{semester.creditsTotal} credits</div>
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
              {isEmpty && isHovering && <PlannerCourseHolder isHover={true} />}
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
    </div>
  );
};

export default DesktopSemesterBlock;
