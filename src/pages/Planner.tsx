import React from "react";
import { Dispatch, SetStateAction } from "react";
import SemesterBlock from "../components/PlannerComponents/SemesterBlock";
import { SemesterType } from "../types/interfaces/Semester.interface";
import { CourseEntry } from "../types/interfaces/Course.interface";
import AddSemester from "../components/PlannerComponents/AddSemester";

interface PlannerProps {
  isDragging: boolean;
  plannerCourses: SemesterType[];
  setPlannerCourses: Dispatch<SetStateAction<SemesterType[]>>;
  setToolboxCourses: Dispatch<SetStateAction<CourseEntry[]>>;
}

const Planner: React.FC<PlannerProps> = ({
  isDragging,
  plannerCourses,
  setPlannerCourses,
  setToolboxCourses,
}) => {
  return (
    <>
      <div
        className={`bg-[#F5CECE] p-4 flex min-h-screen h-fit flex-col z-0 relative ${isDragging || isDragging ? "brightness-50" : ""}`}
      >
        {plannerCourses.map((semester, index) => {
          return (
            <SemesterBlock
              semester={semester}
              index={index + 1}
              key={semester.semesterNumber}
              setPlannerCourses={setPlannerCourses}
              setToolboxCourses={setToolboxCourses}
            />
          );
        })}
        <AddSemester setPlannerCourses={setPlannerCourses} />
      </div>
    </>
  );
};

export default Planner;
