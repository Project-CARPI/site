import { useCallback } from "react";

import { PlannerAction } from "@/core/workspace/reducers/planner";
import generateEmptySemester from "@/core/workspace/utils/generateEmptySemester";
import { UserCourse, SemesterType, SemesterSeason } from "@/lib/types";

export const usePlannerActions = (
  dispatch: React.Dispatch<PlannerAction>,
  plannerSemesters: SemesterType[],
) => {
  const addCourseToSemester = useCallback(
    (semesterID: string, course: UserCourse, index?: number) => {
      dispatch({
        type: "SEMESTER_ACTION",
        payload: {
          semesterID,
          action: { type: "ADD_COURSE", payload: { course, index } },
        },
      });
    },
    [dispatch],
  );

  const removeCourseFromSemester = useCallback(
    (semesterID: string, courseID: string) => {
      dispatch({
        type: "SEMESTER_ACTION",
        payload: {
          semesterID,
          action: { type: "REMOVE_COURSE", payload: { courseID } },
        },
      });
    },
    [dispatch],
  );

  const moveCourseInSemester = useCallback(
    (semesterID: string, fromIndex: number, toIndex: number) => {
      dispatch({
        type: "SEMESTER_ACTION",
        payload: {
          semesterID,
          action: {
            type: "MOVE_COURSE",
            payload: { fromIndex, toIndex },
          },
        },
      });
    },
    [dispatch],
  );

  const updateSemesterName = useCallback(
    (semesterID: string, newName: string) => {
      dispatch({
        type: "SEMESTER_ACTION",
        payload: {
          semesterID,
          action: { type: "UPDATE_TITLE", payload: { newName } },
        },
      });
    },
    [dispatch],
  );

  const updateSemesterSeason = useCallback(
    (semesterID: string, newSeason: SemesterSeason) => {
      dispatch({
        type: "SEMESTER_ACTION",
        payload: {
          semesterID,
          action: { type: "UPDATE_SEASON", payload: { newSeason } },
        },
      });
    },
    [dispatch],
  );

  const addSemester = useCallback(() => {
    const maxSemesterNumber = plannerSemesters.reduce(
      (max, s) => Math.max(max, s.semesterNumber),
      0,
    );
    dispatch({
      type: "ADD_SEMESTER",
      payload: {
        semester: generateEmptySemester(maxSemesterNumber + 1),
      },
    });
  }, [dispatch, plannerSemesters]);

  const moveSemester = useCallback(
    (fromIndex: number, toIndex: number) => {
      dispatch({
        type: "MOVE_SEMESTER",
        payload: { fromIndex, toIndex },
      });
    },
    [dispatch],
  );

  const deleteSemester = useCallback(
    (semesterID: string) => {
      dispatch({
        type: "REMOVE_SEMESTER",
        payload: { semesterID },
      });
    },
    [dispatch],
  );

  const resetPlanner = useCallback(
    (semesters: SemesterType[]) => {
      semesters.forEach((semester) => {
        dispatch({
          type: "UPDATE_SEMESTER",
          payload: {
            semesterID: semester.semesterID,
            updatedSemester: semester,
          },
        });
      });
    },
    [dispatch],
  );

  return {
    addCourseToSemester,
    removeCourseFromSemester,
    moveCourseInSemester,
    updateSemesterName,
    updateSemesterSeason,
    addSemester,
    moveSemester,
    deleteSemester,
    resetPlanner,
  };
};
