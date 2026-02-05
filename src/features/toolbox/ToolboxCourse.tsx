import CourseBadge from "@/components/course/CourseBadge";
import CourseLabel from "@/components/course/CourseLabel";
import { UserCourse } from "@/lib/types";

interface ToolboxCourseProps {
  course: UserCourse;
}

export default function ToolboxCourse({ course }: ToolboxCourseProps) {
  return (
    <div className="relative bg-carpipink text-nowrap rounded-md w-fit px-3 py-1 hover:cursor-grab active:cursor-grabbing select-none">
      <CourseBadge count={course.count} className="absolute -top-2 -right-2" />
      <CourseLabel course={course.data} horizontal />
    </div>
  );
}
