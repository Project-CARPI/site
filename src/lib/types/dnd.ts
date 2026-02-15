import { UserCourse, SemesterType } from "@/lib/types";

export type DraggableData =
  | { type: "course"; payload: UserCourse; sortable?: { index: number } }
  | { type: "semester"; payload: SemesterType; sortable?: { index: number } };

// Helper to safely access this data from dnd-kit's generic 'Data' type
export const isDraggableData = (data: unknown): data is DraggableData => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  // check for required 'type' and 'payload' properties
  const maybe = data as {
    type?: unknown;
    payload?: unknown;
    sortable?: unknown;
  };

  if (maybe.type !== "course" && maybe.type !== "semester") {
    return false;
  }

  if (maybe.payload === undefined) {
    return false;
  }

  if (maybe.sortable !== undefined) {
    if (typeof maybe.sortable !== "object" || maybe.sortable === null) {
      return false;
    }
    const sortable = maybe.sortable as { index?: unknown };
    if (typeof sortable.index !== "number") {
      return false;
    }
  }

  return true;
};
