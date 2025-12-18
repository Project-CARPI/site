import React from "react";
import { UserCourse } from "../../types/interfaces/Course.interface";

interface ToolboxCourseProps {
  course: UserCourse;
}

const ToolboxCourse: React.FC<ToolboxCourseProps> = ({ course }) => {
  return (
    <div
      className={`relative bg-carpipink text-nowrap rounded-md w-fit px-3 py-1`}
    >
      <div
        className={`absolute -top-2 -right-2  rounded-full bg-steelblue w-6 h-6 flex justify-center items-center text-white text-sm ${
          course.count === 1 ? "hidden" : ""
        }`}
      >
        <p>{course.count}</p>
      </div>
      {course.name}
    </div>
  );
};

export default ToolboxCourse;
