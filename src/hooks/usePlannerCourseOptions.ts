import { v4 as uuidv4 } from "uuid";

import { UserCourse } from "../types/interfaces/Course.interface";
import { useCourseWorkspace } from "../hooks/useCourseWorkspace";

interface UsePlannerCourseProps {
  course: UserCourse;
  semesterId: string | null;
}

export const usePlannerCourse = ({
  course,
  semesterId,
}: UsePlannerCourseProps) => {
  const { setPlannerCourses, setToolboxCourses } = useCourseWorkspace();

  // --- Helper Functions ---
  const calculateCredits = (courses: UserCourse[]) => {
    return courses.reduce((acc, c) => acc + c.data.credit_max, 0);
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
      prev.map((sem) => {
        if (sem.semesterID !== semesterId) return sem;

        const currentIndex = sem.courseList.findIndex(
          (c) => c.id === course.id,
        );
        if (currentIndex === -1) return sem;

        const newCourse: UserCourse = {
          ...course,
          id: uuidv4(), // Generate NEW ID
          count: 1,
        };

        const newCourseList = [...sem.courseList];
        newCourseList.splice(currentIndex + 1, 0, newCourse);

        return {
          ...sem,
          courseList: newCourseList,
          creditsTotal: calculateCredits(newCourseList),
        };
      }),
    );
  };

  const handleMoveNext = () => {
    setPlannerCourses((prev) => {
      const currentSemIndex = prev.findIndex(
        (s) => s.semesterID === semesterId,
      );

      // If semester not found or it's the last semester, do nothing
      if (currentSemIndex === -1 || currentSemIndex === prev.length - 1) {
        return prev;
      }

      const nextSemIndex = currentSemIndex + 1;
      const nextSem = prev[nextSemIndex];
      const currentSem = prev[currentSemIndex];

      // Remove from current
      const newCurrentList = currentSem.courseList.filter(
        (c) => c.id !== course.id,
      );

      // Add to next (at the end)
      const newNextList = [...nextSem.courseList, course];

      const nextState = [...prev];

      nextState[currentSemIndex] = {
        ...currentSem,
        courseList: newCurrentList,
        creditsTotal: calculateCredits(newCurrentList),
      };

      nextState[nextSemIndex] = {
        ...nextSem,
        courseList: newNextList,
        creditsTotal: calculateCredits(newNextList),
      };

      return nextState;
    });
  };

  const handleMovePrev = () => {
    setPlannerCourses((prev) => {
      const currentSemIndex = prev.findIndex(
        (s) => s.semesterID === semesterId,
      );

      // If semester not found or it's the first semester, do nothing
      if (currentSemIndex <= 0) {
        return prev;
      }

      const prevSemIndex = currentSemIndex - 1;
      const prevSem = prev[prevSemIndex];
      const currentSem = prev[currentSemIndex];

      // Remove from current
      const newCurrentList = currentSem.courseList.filter(
        (c) => c.id !== course.id,
      );

      // Add to previous (at the end)
      const newPrevList = [...prevSem.courseList, course];

      const nextState = [...prev];

      nextState[currentSemIndex] = {
        ...currentSem,
        courseList: newCurrentList,
        creditsTotal: calculateCredits(newCurrentList),
      };

      nextState[prevSemIndex] = {
        ...prevSem,
        courseList: newPrevList,
        creditsTotal: calculateCredits(newPrevList),
      };

      return nextState;
    });
  };

  const handleMoveToolbox = () => {
    // A. Remove from Planner
    handleDelete();

    // B. Add to Toolbox with Merge Logic
    setToolboxCourses((prev) => {
      // We match duplicates by CONTENT (Subject + Code), not ID.
      // e.g. "CSCI-1200"
      const existingIndex = prev.findIndex(
        (c) =>
          c.data.subj_code === course.data.subj_code &&
          c.data.code_num === course.data.code_num,
      );

      if (existingIndex !== -1) {
        // Increment count of existing item
        return prev.map((c, i) =>
          i === existingIndex ? { ...c, count: c.count + 1 } : c,
        );
      } else {
        // Add as new item (resetting ID to be clean)
        return [...prev, { ...course, id: uuidv4(), count: 1 }];
      }
    });
  };

  const handleDelete = () => {
    setPlannerCourses((prev) =>
      prev.map((sem) => {
        if (sem.semesterID !== semesterId) return sem;

        const newCourseList = sem.courseList.filter((c) => c.id !== course.id);

        return {
          ...sem,
          courseList: newCourseList,
          creditsTotal: calculateCredits(newCourseList),
        };
      }),
    );
  };

  // Return all the functions the component needs
  return {
    handleDuplicate,
    handleMoveNext,
    handleMovePrev,
    handleMoveToolbox,
    handleDelete,
    toTitleCase,
  };
};
