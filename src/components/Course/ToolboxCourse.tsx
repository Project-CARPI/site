import React from "react";
import { APICourse } from "../../types/interfaces/Course.interface";
import { MdDragIndicator } from "react-icons/md";

interface ToolboxCourseProps {
  name: string;
  count: number;
  index: number;
  isDragging: boolean;
  course: APICourse;
}

const ToolboxCourse: React.FC<ToolboxCourseProps> = ({
  name,
  count,
  isDragging,
  course,
}) => {
  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isDragging) {
    return (
      <div className="flex justify-between bg-[#283044] rounded-2xl text-[#F5CECE] gap-4 px-2 py-3">
        <div className={`flex gap-2 items-center`}>
          <MdDragIndicator className="text-2xl" />
          <div className={`text-sm`}>
            <b>
              {course.subj_code}-{course.code_num}
            </b>
            <p>{toTitleCase(course.title)}</p>
          </div>
        </div>

        <div className={`flex gap-1 items-center`}>
          <div
            className={`rounded-full bg-[#F5CECE] text-[#283044] w-5 h-5 flex items-center justify-center text-sm`}
          >
            <p>{course.credit_max}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-carpipink text-nowrap rounded-md w-fit px-3 py-1`}
    >
      <div
        className={`absolute -top-2 -right-2  rounded-full bg-[#78A1BB] w-6 h-6 flex justify-center items-center text-white text-sm ${
          count === 1 ? "hidden" : ""
        }`}
      >
        <p>{count}</p>
      </div>
      {name}
    </div>
  );
};

export default ToolboxCourse;
