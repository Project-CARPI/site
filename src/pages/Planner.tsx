import React, { Dispatch, SetStateAction } from "react";
import SemesterBlock from "../components/PlannerComponents/SemesterBlock";
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
        .map((s, idx) => ({ ...s, semesterNumber: idx + 1 })),
    );
  };

  return (
    <div
      className={`bg-[#F5CECE] p-4 flex min-h-screen h-fit flex-col z-0 relative ${
        isDragging ? "brightness-50" : ""
      }`}
    >
      {plannerCourses.map((semester, index) => (
        <div key={semester.semesterNumber} className="mb-4">
          <SemesterBlock
            semester={semester}
            index={index + 1}
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
  );
};

export default Planner;
