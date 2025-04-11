import { CourseType } from "./Course.interface";

export interface SemesterType {
  semesterNumber: number;
  semesterSeason: string;
  creditsTotal: number;
  courseList: CourseType[];
}
