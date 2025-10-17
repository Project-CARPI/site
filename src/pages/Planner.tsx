import React, { Dispatch, SetStateAction } from "react";
import SemesterBlock from "../components/PlannerComponents/SemesterBlocks/SemesterBlock";
import { SemesterType } from "../types/interfaces/Semester.interface";
import { CourseEntry } from "../types/interfaces/Course.interface";
import AddSemester from "../components/PlannerComponents/AddSemester";
import DeleteSemester from "../components/PlannerComponents/DeleteSemester";

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
  const handleDeleteSemester = (semesterNumber: number) => {
    setPlannerCourses((prev) =>
      prev
        .filter((s) => s.semesterNumber !== semesterNumber)
        .map((s, idx) => ({ ...s, semesterNumber: idx + 1 }))
    );
  };

  return (
    <div className="h-[calc(100vh-10rem)] overflow-hidden">
      <div className="h-full w-full overflow-y-auto scrollbar-hide pr-4 flex flex-col gap-4 p-4">
        {plannerCourses.map((semester, index) => (
          <div key={semester.semesterNumber}>
            <SemesterBlock
              semester={semester}
              index={index}
              key={semester.semesterNumber}
              setPlannerCourses={setPlannerCourses}
              setToolboxCourses={setToolboxCourses}
            />
            <DeleteSemester
              semesterNumber={semester.semesterNumber}
              onDelete={handleDeleteSemester}
            />
            <hr className="border-[calc(0.05px)] border-[#c3a9a9] w-full mt-4 text-[#c3a9a9] " />
          </div>
        ))}
        <AddSemester setPlannerCourses={setPlannerCourses} />
      </div>
    </div>
  );
};

export default Planner;
