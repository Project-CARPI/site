import arrayMove from "@/core/workspace/utils/arrayMove";
import { SemesterType, SemesterSeason, UserCourse } from "@/lib/types";

export type SemesterAction =
  | { type: "UPDATE_TITLE"; payload: { newName: string } }
  | { type: "UPDATE_SEASON"; payload: { newSeason: SemesterSeason } }
  | { type: "ADD_COURSE"; payload: { course: UserCourse; index?: number } }
  | { type: "REMOVE_COURSE"; payload: { courseID: string } }
  | { type: "MOVE_COURSE"; payload: { fromIndex: number; toIndex: number } }
  | { type: "UPDATE_CREDITS"; payload: { courseID: string; credits: number } };

export const SemesterReducer = (
  state: SemesterType,
  action: SemesterAction,
): SemesterType => {
  switch (action.type) {
    case "UPDATE_TITLE":
      return { ...state, semesterTitle: action.payload.newName };

    case "UPDATE_SEASON":
      return { ...state, season: action.payload.newSeason };

    case "ADD_COURSE": {
      const newCourseList = [...state.courseList];
      const courseCredits =
        action.payload.course.credits ?? action.payload.course.data.credit_max;

      if (action.payload.index !== undefined) {
        newCourseList.splice(action.payload.index, 0, action.payload.course);
      } else {
        newCourseList.push(action.payload.course);
      }

      return {
        ...state,
        courseList: newCourseList,
        creditsTotal: state.creditsTotal + courseCredits,
      };
    }

    case "REMOVE_COURSE": {
      const removedCourse = state.courseList.find(
        (c) => c.id === action.payload.courseID,
      );
      const removedCredits =
        removedCourse?.credits ?? removedCourse?.data.credit_max ?? 0;

      return {
        ...state,
        courseList: state.courseList.filter(
          (c) => c.id !== action.payload.courseID,
        ),
        creditsTotal: state.creditsTotal - removedCredits,
      };
    }

    case "UPDATE_CREDITS": {
      const { courseID, credits } = action.payload;

      // Find the course to update
      const courseToUpdate = state.courseList.find((c) => c.id === courseID);
      if (!courseToUpdate) {
        return state;
      }

      // Update the credits for the specified course
      const updatedCourseList = state.courseList.map((c) =>
        c.id === courseID ? { ...c, credits } : c,
      );

      // Calculate the new total credits for the semester
      const oldTotal =
        state.courseList.find((c) => c.id === courseID)?.credits ?? 0;
      const newTotal = credits;

      return {
        ...state,
        courseList: updatedCourseList,
        creditsTotal: state.creditsTotal - oldTotal + newTotal,
      };
    }

    case "MOVE_COURSE":
      return {
        ...state,
        courseList: arrayMove(
          state.courseList,
          action.payload.fromIndex,
          action.payload.toIndex,
        ) as UserCourse[],
      };

    default:
      return state;
  }
};
