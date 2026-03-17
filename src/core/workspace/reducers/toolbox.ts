import arrayMove from "@/core/workspace/utils/arrayMove";
import { UserCourse } from "@/lib/types";

export type ToolboxAction =
  | { type: "INSERT_COURSE"; payload: { course: UserCourse; index: number } }
  | { type: "MOVE_COURSE"; payload: { fromIndex: number; toIndex: number } }
  | { type: "REMOVE_COURSE"; payload: { courseID: string } }
  | {
      type: "UPDATE_COURSE";
      payload: { courseID: string; updatedCourse: UserCourse };
    }
  | { type: "CONSOLIDATE_COURSES" }
  | { type: "SET_COURSES"; payload: { courses: UserCourse[] } };

export const ToolboxReducer = (
  state: UserCourse[],
  action: ToolboxAction,
): UserCourse[] => {
  switch (action.type) {
    case "INSERT_COURSE": {
      const newCourses = [...state];
      const safeIndex = Math.min(
        Math.max(action.payload.index, 0),
        newCourses.length,
      );
      newCourses.splice(safeIndex, 0, action.payload.course);
      return newCourses;
    }

    case "MOVE_COURSE":
      return arrayMove(
        state,
        action.payload.fromIndex,
        action.payload.toIndex,
      ) as UserCourse[];

    case "REMOVE_COURSE":
      return state.filter((c) => c.id !== action.payload.courseID);

    case "UPDATE_COURSE":
      return state.map((c) =>
        c.id === action.payload.courseID ? action.payload.updatedCourse : c,
      );

    case "CONSOLIDATE_COURSES": {
      const uniqueMap = new Map<string, UserCourse>();

      for (const course of state) {
        if (uniqueMap.has(course.name)) {
          const existing = uniqueMap.get(course.name)!;
          existing.count += course.count;
        } else {
          uniqueMap.set(course.name, { ...course });
        }
      }
      return Array.from(uniqueMap.values());
    }

    case "SET_COURSES":
      return action.payload.courses;

    default:
      return state;
  }
};
