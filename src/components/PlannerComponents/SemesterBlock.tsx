import React from "react";
import PlannerCourse, { CourseType } from "../PlannerComponents/PlannerCourse"
import { SemesterType } from "../../types/interfaces/Semester.interface";

interface SemesterBlockProps  {
  semester: SemesterType;
}

const SemesterBlock: React.FC<SemesterBlockProps> = ({ semester }) => {
  return (
    <div className = "bg-[#F5CECE] p-4 rounded-lg">
        <div className = "flex justify-between items-center mb-4">
            <div className = "text-2xl font-bold"> SEM {semester.semesterNumber}</div>
            <button className = "border-2 border-black rounded-full px-4 py-1">{semester.semesterSeason}</button>
            <div className = "text-lg fontbold">credits: {semester.creditsTotal}</div>
        </div>

        <div className = "space-y-4">
            {semester.courseList.map((course) => (
                <PlannerCourse key ={course.id} course={course} />
            ))}
        </div>

    </div>
  );
};

export default SemesterBlock;
