import React from "react";
import { Dispatch, SetStateAction } from "react";

import SemesterBlock from "../components/PlannerComponents/SemesterBlocks/SemesterBlock";
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
    <div className="flex flex-col">
      <div
        className={`p-4 flex justify-between flex-wrap gap-y-4 z-0 ${isDragging || isDragging ? "brightness-50" : ""}`}
      >
        {plannerCourses.map((semester, index) => {
          return (
            <SemesterBlock
              semester={semester}
              index={index}
              key={semester.semesterNumber}
              setPlannerCourses={setPlannerCourses}
              setToolboxCourses={setToolboxCourses}
            />
          );
        })}
      </div>
      <AddSemester setPlannerCourses={setPlannerCourses} />
    </div>
  );
};

export default Planner;
