import { cn } from "@/lib/classnames";
import { APICourse } from "@/lib/types";

interface CourseLabelProps {
  course: APICourse;
  horizontal?: boolean;
  showCredits?: boolean;
}

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function CourseLabel({
  course,
  horizontal = false,
  showCredits = false,
}: CourseLabelProps) {
  return (
    <div className={cn(horizontal ? "flex gap-1" : "text-sm")}>
      <div className={`flex gap-2 items-baseline`}>
        <b>
          {course.subj_code}-{course.code_num}
        </b>
        {showCredits && (
          <i>
            {course.credit_min !== course.credit_max ? (
              <span className="text-gray-500">
                {course.credit_min}–{course.credit_max} credits
              </span>
            ) : (
              <span className="text-gray-500">{course.credit_max} credits</span>
            )}
          </i>
        )}
      </div>

      <p>{toTitleCase(course.title)}</p>
    </div>
  );
}
