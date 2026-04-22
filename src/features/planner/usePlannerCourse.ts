import { useCallback, useMemo } from "react";

import { v4 as uuidv4 } from "uuid";

import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import { UserCourse } from "@/lib/types";

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
  onOpenDetails: () => void;
}

export const usePlannerCourse = ({
  course,
  semesterId,
  onOpenDetails,
}: UsePlannerCourseProps) => {
  const {
    addCourseToSemester,
    removeCourseFromSemester,
    addCourseToToolbox,
    plannerCourses,
  } = useCourseWorkspace();

  /* HELPERS */
  const isFirstSemester = useMemo(() => {
    return semesterId ? plannerCourses[0].semesterID === semesterId : false;
  }, [semesterId, plannerCourses]);

  const isLastSemester = useMemo(() => {
    return semesterId
      ? plannerCourses[plannerCourses.length - 1].semesterID === semesterId
      : false;
  }, [semesterId, plannerCourses]);

  /* HANDLER FUNCTIONS */
  const handleMove = useCallback(
    (direction: "next" | "prev") => {
      if (!semesterId) return;

      // find next/prev semester
      const currentIdx = plannerCourses.findIndex(
        (s) => s.semesterID === semesterId,
      );
      const targetIdx = direction === "next" ? currentIdx + 1 : currentIdx - 1;
      const targetSem = plannerCourses[targetIdx];

      // move course
      if (targetSem) {
        removeCourseFromSemester(semesterId, course.id);
        addCourseToSemester(targetSem.semesterID, course);
      }
    },
    [
      course,
      semesterId,
      plannerCourses,
      removeCourseFromSemester,
      addCourseToSemester,
    ],
  );

  const handleDelete = useCallback(() => {
    // goes into the ether
    if (semesterId) removeCourseFromSemester(semesterId, course.id);
  }, [course, semesterId, removeCourseFromSemester]);

  const handleDuplicate = useCallback(() => {
    if (!semesterId) return;

    // create a new course with a new ID
    const newCourse = { ...course, id: uuidv4(), count: 1 };
    addCourseToSemester(semesterId, newCourse);
  }, [course, semesterId, addCourseToSemester]);

  const handleMoveToolbox = useCallback(() => {
    if (semesterId) removeCourseFromSemester(semesterId, course.id);
    addCourseToToolbox(course.data);
  }, [course, semesterId, removeCourseFromSemester, addCourseToToolbox]);

  /* MENU OPTIONS */
  return useMemo<MenuOption[]>(
    () => [
      {
        label: "View Course Details",
        action: onOpenDetails,
        disabled: semesterId === null,
      },
      {
        label: "Duplicate Course",
        action: handleDuplicate,
        hasSeparatorBefore: true,
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
    ],
  );
};
