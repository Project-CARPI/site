import {CourseType} from "../../components/PlannerComponents/PlannerCourse";

export interface SemesterType {
    semesterNumber: number;
    semesterSeason: string;
    creditsTotal: number;
    courseList: CourseType[];
}
  
  