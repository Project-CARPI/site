import { CourseEntry } from "./Course.interface";

export interface SemesterType {
  semesterNumber: number;
  semesterSeason: string;
  creditsTotal: number;
  courseList: CourseEntry[];
}
