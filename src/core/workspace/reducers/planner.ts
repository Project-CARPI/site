import { arrayMove } from "@dnd-kit/sortable";

import {
  SemesterReducer,
  SemesterAction,
} from "@/core/workspace/reducers/semester";
import { SemesterType } from "@/lib/types";

export type PlannerAction =
  | { type: "ADD_SEMESTER"; payload: { semester: SemesterType } }
  | { type: "REMOVE_SEMESTER"; payload: { semesterID: string } }
  | { type: "MOVE_SEMESTER"; payload: { fromIndex: number; toIndex: number } }
  | {
      type: "UPDATE_SEMESTER";
      payload: { semesterID: string; updatedSemester: SemesterType };
    }
  | {
      type: "SEMESTER_ACTION";
      payload: { semesterID: string; action: SemesterAction };
    };

export const PlannerReducer = (
  state: SemesterType[],
  action: PlannerAction,
): SemesterType[] => {
  switch (action.type) {
    case "ADD_SEMESTER":
      return [...state, action.payload.semester];

    case "REMOVE_SEMESTER":
      return state.filter((s) => s.semesterID !== action.payload.semesterID);

    case "MOVE_SEMESTER":
      return arrayMove(state, action.payload.fromIndex, action.payload.toIndex);

    case "UPDATE_SEMESTER":
      return state.map((s) =>
        s.semesterID === action.payload.semesterID
          ? action.payload.updatedSemester
          : s,
      );

    case "SEMESTER_ACTION":
      return state.map((s) =>
        s.semesterID === action.payload.semesterID
          ? SemesterReducer(s, action.payload.action)
          : s,
      );

    default:
      return state;
  }
};
