import { useCallback } from "react";

import { v4 as uuidv4 } from "uuid";

import { ToolboxAction } from "@/core/workspace/reducers/toolbox";
import { UserCourse, APICourse } from "@/lib/types";

export const useToolboxActions = (
  dispatch: React.Dispatch<ToolboxAction>,
  toolboxCourses: UserCourse[],
) => {
  const addCourseToToolbox = useCallback(
    (courseData: APICourse) => {
      const existingCourse = toolboxCourses.find(
        (c) =>
          c.data.subj_code === courseData.subj_code &&
          c.data.code_num === courseData.code_num,
      );

      if (existingCourse) {
        dispatch({
          type: "UPDATE_COURSE",
          payload: {
            courseID: existingCourse.id,
            updatedCourse: {
              ...existingCourse,
              count: existingCourse.count + 1,
            },
          },
        });
      } else {
        const newCourse: UserCourse = {
          id: uuidv4(),
          name: `${courseData.subj_code} ${courseData.code_num}`,
          count: 1,
          data: courseData,
          credits: courseData.credit_max,
        };

        dispatch({
          type: "INSERT_COURSE",
          payload: { course: newCourse, index: toolboxCourses.length },
        });
      }
    },
    [toolboxCourses, dispatch],
  );

  // 2. Wrap simple dnd-kit actions to keep the component API clean
  const insertCourseIntoToolbox = useCallback(
    (course: UserCourse, index: number) => {
      dispatch({ type: "INSERT_COURSE", payload: { course, index } });
    },
    [dispatch],
  );

  const removeCourseFromToolbox = useCallback(
    (courseID: string) => {
      const index = toolboxCourses.findIndex((c) => c.id === courseID);
      const course = toolboxCourses[index];
      if (!course) return;

      if (course.count > 1) {
        // if there are multiple copies of this course, create a new
        // entry with count - 1 instead of removing entirely
        dispatch({ type: "REMOVE_COURSE", payload: { courseID } });
        const updatedCourse: UserCourse = {
          ...course,
          id: uuidv4(),
          count: course.count - 1,
        };
        dispatch({
          type: "INSERT_COURSE",
          payload: { course: updatedCourse, index: index },
        });
      } else {
        dispatch({ type: "REMOVE_COURSE", payload: { courseID } });
      }
    },
    [dispatch, toolboxCourses],
  );

  const moveCourseInToolbox = useCallback(
    (fromIndex: number, toIndex: number) => {
      dispatch({ type: "MOVE_COURSE", payload: { fromIndex, toIndex } });
    },
    [dispatch],
  );

  const consolidateToolbox = useCallback(() => {
    dispatch({ type: "CONSOLIDATE_COURSES" });
  }, [dispatch]);

  const resetToolbox = useCallback(
    (courses: UserCourse[]) => {
      dispatch({ type: "SET_COURSES", payload: { courses } });
    },
    [dispatch],
  );

  // 3. Helper (Selector) - Doesn't dispatch, just reads data
  const getCourseCount = useCallback(
    (courseName: string) => {
      return toolboxCourses.find((c) => c.name === courseName)?.count || 0;
    },
    [toolboxCourses],
  );

  return {
    getCourseCount,
    addCourseToToolbox,
    insertCourseIntoToolbox,
    moveCourseInToolbox,
    removeCourseFromToolbox,
    consolidateToolbox,
    resetToolbox,
  };
};
