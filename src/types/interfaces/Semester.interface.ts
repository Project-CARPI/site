import { UserCourse } from "./Course.interface";

export interface SemesterType {
  semesterNumber: number;
  semesterID: string;
  semesterSeason: string;
  creditsTotal: number;
  courseList: UserCourse[];
}
