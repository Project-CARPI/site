import { SemesterType, UserCourse } from "@/lib/types";

export default function arrayMove(
  list: (SemesterType | UserCourse)[],
  fromIndex: number,
  toIndex: number,
): (SemesterType | UserCourse)[] {
  const result = [...list];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}
