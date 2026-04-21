import { createContext } from "react";

import {
  APICourse,
  UserCourse,
  SemesterType,
  SemesterSeason,
} from "@/lib/types";

export interface CourseWorkspaceContextType {
  // data
  plannerCourses: SemesterType[];
  toolboxCourses: UserCourse[];

  // utils
  resetWorkspace: () => void;

  // planner actions
  addCourseToSemester: (
    semesterID: string,
    course: UserCourse,
    index?: number,
  ) => void;
  removeCourseFromSemester: (semesterID: string, courseID: string) => void;
  updateCourseCredits: (
    semesterID: string,
    courseID: string,
    credits: number,
  ) => void;
  moveCourseInSemester: (
    semesterID: string,
    fromIndex: number,
    toIndex: number,
  ) => void;
  updateSemesterName: (semesterID: string, newName: string) => void;
  updateSemesterSeason: (semesterID: string, newSeason: SemesterSeason) => void;
  deleteSemester: (semesterID: string) => void;
  addSemester: () => void;
  moveSemester: (fromIndex: number, toIndex: number) => void;
  resetPlanner: (semesters: SemesterType[]) => void;

  // toolbox actions
  toolboxCourseCount: number;
  getCourseCount: (courseName: string) => number;
  addCourseToToolbox: (courseData: APICourse) => void; // Smart add (increments count)
  insertCourseIntoToolbox: (course: UserCourse, index: number) => void; // Raw insert (for DnD)
  removeCourseFromToolbox: (courseID: string) => void;
  moveCourseInToolbox: (fromIndex: number, toIndex: number) => void;
  consolidateToolbox: () => void; // Merges duplicates (for Drag End)
  resetToolbox: (courses: UserCourse[]) => void; // For cancelling drags
}

export const CourseWorkspaceContext = createContext<
  CourseWorkspaceContextType | undefined
>(undefined);
