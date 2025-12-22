import { v4 as uuidv4 } from "uuid";
import { useCallback, useMemo } from "react";
import { UserCourse } from "../types/interfaces/Course.interface";
import { useCourseWorkspace } from "../hooks/useCourseWorkspace";

export interface MenuOption {
  label: string;
  action: () => void;
  isDanger?: boolean;
  disabled?: boolean;
  hasSeparatorBefore?: boolean;
}

interface UsePlannerCourseProps {
  course: UserCourse;
  semesterId: string | null;
  isFirstSemester?: boolean;
  isLastSemester?: boolean;
}

export const usePlannerCourse = ({
  course,
  semesterId,
  isFirstSemester = false,
  isLastSemester = false,
}: UsePlannerCourseProps) => {
  const { setPlannerCourses, setToolboxCourses } = useCourseWorkspace();

  /* HELPER FUNCTIONS */
  const calculateCredits = (courses: UserCourse[]) => {
    return courses.reduce((acc, c) => acc + c.data.credit_max, 0);
  };

  /* HANDLER FUNCTIONS */
  const handleMove = useCallback(
    (direction: "next" | "prev") => {
      setPlannerCourses((prev) => {
        const currentSemIndex = prev.findIndex(
          (s) => s.semesterID === semesterId
        );
        if (currentSemIndex === -1) return prev;

        // determine target semester index
        const offset = direction === "next" ? 1 : -1;
        const targetSemIndex = currentSemIndex + offset;

        // boundary check
        if (targetSemIndex < 0 || targetSemIndex >= prev.length) {
          return prev;
        }

        const currentSem = prev[currentSemIndex];
        const targetSem = prev[targetSemIndex];

        // remove from current
        const newCurrentList = currentSem.courseList.filter(
          (c) => c.id !== course.id
        );

        // add to target
        const newTargetList = [...targetSem.courseList, course];
        const nextState = [...prev];

        nextState[currentSemIndex] = {
          ...currentSem,
          courseList: newCurrentList,
          creditsTotal: calculateCredits(newCurrentList),
        };

        nextState[targetSemIndex] = {
          ...targetSem,
          courseList: newTargetList,
          creditsTotal: calculateCredits(newTargetList),
        };

        return nextState;
      });
    },
    [course, semesterId, setPlannerCourses]
  );

  const handleDelete = useCallback(() => {
    setPlannerCourses((prev) =>
      prev.map((sem) => {
        if (sem.semesterID !== semesterId) return sem;
        const newCourseList = sem.courseList.filter((c) => c.id !== course.id);
        return {
          ...sem,
          courseList: newCourseList,
          creditsTotal: calculateCredits(newCourseList),
        };
      })
    );
  }, [course, semesterId, setPlannerCourses]);

  const handleDuplicate = useCallback(() => {
    setPlannerCourses((prev) =>
      prev.map((sem) => {
        if (sem.semesterID !== semesterId) return sem;
        const currentIndex = sem.courseList.findIndex(
          (c) => c.id === course.id
        );
        if (currentIndex === -1) return sem;

        const newCourse: UserCourse = { ...course, id: uuidv4(), count: 1 };
        const newCourseList = [...sem.courseList];
        newCourseList.splice(currentIndex + 1, 0, newCourse);

        return {
          ...sem,
          courseList: newCourseList,
          creditsTotal: calculateCredits(newCourseList),
        };
      })
    );
  }, [course, semesterId, setPlannerCourses]);

  const handleMoveToolbox = useCallback(() => {
    handleDelete();
    setToolboxCourses((prev) => {
      const existingIndex = prev.findIndex(
        (c) =>
          c.data.subj_code === course.data.subj_code &&
          c.data.code_num === course.data.code_num
      );
      if (existingIndex !== -1) {
        return prev.map((c, i) =>
          i === existingIndex ? { ...c, count: c.count + 1 } : c
        );
      } else {
        return [...prev, { ...course, id: uuidv4(), count: 1 }];
      }
    });
  }, [course, handleDelete, setToolboxCourses]);

  /* MENU OPTIONS */
  return useMemo<MenuOption[]>(
    () => [
      {
        label: "Duplicate Course",
        action: handleDuplicate,
      },
      {
        label: "Move to Next Semester",
        // 2. Just call the generic function with the argument
        action: () => handleMove("next"),
        disabled: semesterId === null || isLastSemester,
      },
      {
        label: "Move to Previous Semester",
        action: () => handleMove("prev"),
        disabled: semesterId === null || isFirstSemester,
      },
      {
        label: "Move to Toolbox",
        action: handleMoveToolbox,
        hasSeparatorBefore: true,
      },
      {
        label: "Delete Course",
        action: handleDelete,
        isDanger: true,
      },
    ],
    [
      handleDuplicate,
      handleMove,
      handleMoveToolbox,
      handleDelete,
      semesterId,
      isFirstSemester,
      isLastSemester,
    ]
  );
};
