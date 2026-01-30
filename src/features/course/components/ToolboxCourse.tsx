import CourseBadge from "@/features/course/components/layout/CourseBadge";
import CourseLabel from "@/features/course/components/layout/CourseLabel";
import { UserCourse } from "@/features/course/interfaces";

interface ToolboxCourseProps {
  course: UserCourse;
}

export default function ToolboxCourse({ course }: ToolboxCourseProps) {
  return (
    <div
      className={`relative bg-carpipink text-nowrap rounded-md w-fit px-3 py-1`}
    >
      <CourseBadge count={course.count} className="absolute -top-2 -right-2" />
      <CourseLabel course={course.data} horizontal />
    </div>
  );
}
