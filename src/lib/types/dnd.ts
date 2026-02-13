import { UserCourse, SemesterType } from "@/lib/types";

export type DraggableData =
  | { type: "course"; payload: UserCourse; sortable?: { index: number } }
  | { type: "semester"; payload: SemesterType; sortable?: { index: number } };

// Helper to safely access this data from dnd-kit's generic 'Data' type
export const isDraggableData = (data: unknown): data is DraggableData => {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    "payload" in data
  );
};
