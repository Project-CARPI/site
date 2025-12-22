import { createContext } from "react";
import { APICourse, UserCourse } from "../types/interfaces/Course.interface.ts";
import { SemesterType } from "../types/interfaces/Semester.interface.ts";

export interface CourseWorkspaceContextType {
  // data
  plannerCourses: SemesterType[];
  toolboxCourses: UserCourse[];

  // planner actions
  addCourseToSemester: (
    semesterId: string,
    course: UserCourse,
    index?: number,
  ) => void;
  removeCourseFromSemester: (semesterId: string, courseId: string) => void;
  moveCourseInSemester: (
    semesterId: string,
    fromIndex: number,
    toIndex: number,
  ) => void;
  updateSemesterName: (semesterId: string, newName: string) => void;
  updateSemesterSeason: (
    semesterId: string,
    newSeason: SemesterType["season"],
  ) => void;
  deleteSemester: (semesterId: string) => void;
  addSemester: () => void;

  // toolbox actions
  addCourseToToolbox: (courseData: APICourse) => void; // Smart add (increments count)
  insertCourseIntoToolbox: (course: UserCourse, index: number) => void; // Raw insert (for DnD)
  removeCourseFromToolbox: (courseId: string) => void;
  updateToolboxCourse: (course: UserCourse) => void; // Updates a specific item (e.g. changing count)
  moveCourseInToolbox: (fromIndex: number, toIndex: number) => void;
  consolidateToolboxCourses: () => void; // Merges duplicates (for Drag End)
  resetToolbox: (courses: UserCourse[]) => void; // For cancelling drags
  getCourseCountInToolbox: (courseData: APICourse) => number;
}

const CourseWorkspaceContext = createContext<CourseWorkspaceContextType | null>(
  null,
);

export default CourseWorkspaceContext;
