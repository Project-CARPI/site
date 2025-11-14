import { Dispatch, SetStateAction } from "react";
import { SemesterType } from "../types/interfaces/Semester.interface";
import { CourseEntry, CourseType } from "../types/interfaces/Course.interface";

interface UsePlannerCourseProps {
  setPlannerCourses: Dispatch<SetStateAction<SemesterType[]>>;
  setToolboxCourses: Dispatch<SetStateAction<CourseEntry[]>>;
  semesterIndex: number; // 1-based index
  courseIndex: number; // 0-based index
  course: CourseType;
  name: string;
  count: number;
}

export const usePlannerCourse = ({
  setPlannerCourses,
  setToolboxCourses,
  semesterIndex,
  courseIndex,
  course,
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
                  name: getNextName(name), // Use prop
                  count: count, // Use prop
                  data: course, // Use prop
                },
                ...semester.courseList.slice(courseIndex + 1),
              ],
            }
          : semester,
      ),
    );
  };

  const handleMoveNext = () => {
    setPlannerCourses((prev) => {
      const courseCopy = { name, count, data: course };

      const updatedPlanner = prev.map((semester, i) =>
        i === semesterIndex - 1
          ? {
              ...semester,
              courseList: semester.courseList.filter(
                (_, idx) => idx !== courseIndex,
              ),
              creditsTotal: semester.creditsTotal - course.credit_max,
            }
          : semester,
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
          : semester,
      );
    });
  };

  const handleMoveToolbox = () => {
    setPlannerCourses((prev) => {
      const courseToMove = { name, count, data: course };
      const cleanedName = courseToMove.name.split("-")[0];
      const cleanedCourse = {
        ...courseToMove,
        name: cleanedName,
      };

      const updatedPlanner = prev.map((semester, i) =>
        i === semesterIndex - 1
          ? {
              ...semester,
              courseList: semester.courseList.filter(
                (_, idx) => idx !== courseIndex,
              ),
              creditsTotal:
                semester.creditsTotal - courseToMove.data.credit_max,
            }
          : semester,
      );

      setToolboxCourses((toolboxPrev) => {
        const existingIndex = toolboxPrev.findIndex(
          (entry) => entry.name === cleanedName,
        );

        if (existingIndex !== -1) {
          const updated = [...toolboxPrev];
          updated[existingIndex].count += cleanedCourse.count;
          return updated;
        } else {
          return [...toolboxPrev, cleanedCourse];
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
                (_, idx) => idx !== courseIndex,
              ),
              creditsTotal: semester.creditsTotal - course.credit_max,
            }
          : semester,
      ),
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
