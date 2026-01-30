import { UserCourse } from "@/lib/types";

export type SemesterSeason = "Fall" | "Spring" | "Summer" | "";

export interface SemesterType {
  semesterTitle: string;
  semesterNumber: number;
  semesterID: string;
  season: SemesterSeason;
  creditsTotal: number;
  courseList: UserCourse[];
}
