import React from "react";
import PlannerCourse, { CourseType } from "../PlannerComponents/PlannerCourse";
import { SemesterType } from "../../types/interfaces/Semester.interface";

interface SemesterBlockProps {
  semester: SemesterType;
}

const SemesterBlock: React.FC<SemesterBlockProps> = ({ semester }) => {
  return (

    <>
    <div className="flex mt-4">
    <div className="flex mb-4">
    <div className="flex  space-x-2">
       <div className="flex flex-col items-center justify-start">
         <span className="text-lg">SEM</span>
         <span className="text-2xl font-bold ">{semester.semesterNumber}</span>
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
    
     <div className="flex flex-col space-y-2 w-full">
       {semester.courseList.map((course) => (
         <PlannerCourse key={course.id} course={course} />
       ))}
     </div>

     <hr className = "border-[calc(0.05px)] border-[#c3a9a9] w-full mt-4 text-[#c3a9a9] "/>
   </div></div>
    </>
      
     
  );
};

export default SemesterBlock;
