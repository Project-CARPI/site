import React from "react";
import { UserCourse } from "../../types/interfaces/Course.interface";
import CourseLabel from "./shared/CourseLabel";
import CourseBadge from "./shared/CourseBadge";

interface ToolboxCourseProps {
  course: UserCourse;
}

const ToolboxCourse: React.FC<ToolboxCourseProps> = ({ course }) => {
  return (
    <div
      className={`relative bg-carpipink text-nowrap rounded-md w-fit px-3 py-1`}
    >
      <CourseBadge count={course.count} className="absolute -top-2 -right-2" />
      <CourseLabel course={course.data} horizontal />
    </div>
  );
};

export default ToolboxCourse;
