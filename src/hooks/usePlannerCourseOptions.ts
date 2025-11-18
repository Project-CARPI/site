import { Dispatch, SetStateAction } from "react";
import { SemesterType } from "../types/interfaces/Semester.interface";
import { CourseEntry, CourseType } from "../types/interfaces/Course.interface";

interface UsePlannerCourseProps {
  setPlannerCourses: Dispatch<SetStateAction<SemesterType[]>>;
  setToolboxCourses: Dispatch<SetStateAction<CourseEntry[]>>;
  semesterIndex: number; // 1-based index
  courseIndex: number; // 0-based index
  course: CourseType;
  id: string;
  name: string;
  count: number;
}

export const usePlannerCourse = ({
  setPlannerCourses,
  setToolboxCourses,
  semesterIndex,
  courseIndex,
  course,
  id,
  name,
  count,
}: UsePlannerCourseProps) => {
  // --- Helper Functions ---

  const getNextName = (originalName: string): string => {
    const [base, tag] = originalName.split("-");
    if (!tag) {
      return `${base}-A`;
    }
    const nextTag = incrementTag(tag);
    return `${base}-${nextTag}`;
  };

  const incrementTag = (tag: string): string => {
    const chars = tag.toUpperCase().split("");
    let carry = true;
    for (let i = chars.length - 1; i >= 0 && carry; i--) {
      if (chars[i] === "Z") {
        chars[i] = "A";
      } else {
        chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
        carry = false;
      }
    }
    if (carry) {
      chars.unshift("A");
    }
    return chars.join("");
  };

  const toTitleCase = (str: string): string => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // --- Handler Functions ---

  const handleDuplicate = () => {
    setPlannerCourses((prev) =>
      prev.map((semester, i) =>
        i === semesterIndex - 1 // 1-based index
          ? {
              ...semester,
              creditsTotal: semester.creditsTotal + course.credit_max,
              courseList: [
                ...semester.courseList.slice(0, courseIndex + 1),
                {
                  id: `${name}-${Math.random().toString(36).substring(2, 7)}`,
                  name: getNextName(name), // Use prop
                  count: count, // Use prop
                  data: course, // Use prop
                },
                ...semester.courseList.slice(courseIndex + 1),
              ],
            }
          : semester
      )
    );
  };

  const handleMoveNext = () => {
    setPlannerCourses((prev) => {
      const courseCopy = { id, name, count, data: course };

      const updatedPlanner = prev.map((semester, i) =>
        i === semesterIndex - 1
          ? {
              ...semester,
              courseList: semester.courseList.filter(
                (_, idx) => idx !== courseIndex
              ),
              creditsTotal: semester.creditsTotal - course.credit_max,
            }
          : semester
      );

      // Add to next semester
      // Note: This will not work if it's the last semester
      return updatedPlanner.map((semester, i) =>
        i === semesterIndex // 1-based index becomes 0-based index of next sem
          ? {
              ...semester,
              courseList: [...semester.courseList, courseCopy],
              creditsTotal: semester.creditsTotal + courseCopy.data.credit_max,
            }
          : semester
      );
    });
  };

  const handleMoveToolbox = () => {
    setPlannerCourses((prev) => {
      const courseToMove = { id, name, count, data: course };

      const updatedPlanner = prev.map((semester, i) =>
        i === semesterIndex - 1
          ? {
              ...semester,
              courseList: semester.courseList.filter(
                (_, idx) => idx !== courseIndex
              ),
              creditsTotal:
                semester.creditsTotal - courseToMove.data.credit_max,
            }
          : semester
      );

      setToolboxCourses((toolboxPrev) => {
        const existingIndex = toolboxPrev.findIndex((entry) => entry.id === id);

        if (existingIndex !== -1) {
          const updated = [...toolboxPrev];
          updated[existingIndex].count += courseToMove.count;
          return updated;
        } else {
          return [...toolboxPrev, courseToMove];
        }
      });

      return updatedPlanner;
    });
  };

  const handleDelete = () => {
    setPlannerCourses((prev) =>
      prev.map((semester, i) =>
        i === semesterIndex - 1
          ? {
              ...semester,
              courseList: semester.courseList.filter(
                (_, idx) => idx !== courseIndex
              ),
              creditsTotal: semester.creditsTotal - course.credit_max,
            }
          : semester
      )
    );
  };

  // Return all the functions the component needs
  return {
    handleDuplicate,
    handleMoveNext,
    handleMoveToolbox,
    handleDelete,
    toTitleCase,
  };
};
