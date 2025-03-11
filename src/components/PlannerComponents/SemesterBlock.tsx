import React from "react";
import PlannerCourse, { CourseType } from "../PlannerComponents/PlannerCourse";
import { SemesterType } from "../../types/interfaces/Semester.interface";

interface SemesterBlockProps {
  semester: SemesterType;
}

const SemesterBlock: React.FC<SemesterBlockProps> = ({ semester }) => {
  return (
    <div className="bg-[#F5CECE] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
       <div className="flex items-center space-x-2">
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold">SEM</span>
            <span className="text-3xl font-bold">{semester.semesterNumber}</span>
          </div>

          <button className="border-2 border-black rounded-full px-4 py-1 text-sm font-semibold">
            {semester.semesterSeason}
          </button>

        </div>

        <div className="text-lg font-bold">
          credits: <span className="font-semibold">{semester.creditsTotal}</span>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-3">
        {semester.courseList.map((course) => (
          <PlannerCourse key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default SemesterBlock;
