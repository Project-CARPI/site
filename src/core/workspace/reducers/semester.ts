import arrayMove from "@/core/workspace/utils/arrayMove";
import { SemesterType, SemesterSeason, UserCourse } from "@/lib/types";

export type SemesterAction =
  | { type: "UPDATE_TITLE"; payload: { newName: string } }
  | { type: "UPDATE_SEASON"; payload: { newSeason: SemesterSeason } }
  | { type: "ADD_COURSE"; payload: { course: UserCourse; index?: number } }
  | { type: "REMOVE_COURSE"; payload: { courseID: string } }
  | { type: "MOVE_COURSE"; payload: { fromIndex: number; toIndex: number } };

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
      if (action.payload.index !== undefined) {
        newCourseList.splice(action.payload.index, 0, action.payload.course);
      } else {
        newCourseList.push(action.payload.course);
      }

      return {
        ...state,
        courseList: newCourseList,
        creditsTotal:
          state.creditsTotal + action.payload.course.data.credit_max,
      };
    }

    case "REMOVE_COURSE": {
      const removedCourse = state.courseList.find(
        (c) => c.id === action.payload.courseID,
      );

      return {
        ...state,
        courseList: state.courseList.filter(
          (c) => c.id !== action.payload.courseID,
        ),
        creditsTotal:
          state.creditsTotal - (removedCourse?.data.credit_max || 0),
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
