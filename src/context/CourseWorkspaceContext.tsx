import React, { createContext } from "react";
import { UserCourse } from "../types/interfaces/Course.interface.ts";
import { SemesterType } from "../types/interfaces/Semester.interface.ts";
import { OnDragStartResponder, OnDragEndResponder } from "@hello-pangea/dnd";

export interface CourseWorkspaceContextType {
  plannerCourses: SemesterType[];
  setPlannerCourses: React.Dispatch<React.SetStateAction<SemesterType[]>>;
  toolboxCourses: UserCourse[];
  setToolboxCourses: React.Dispatch<React.SetStateAction<UserCourse[]>>;
  isDragging: boolean;
  onDragStart: OnDragStartResponder;
  onDragEnd: OnDragEndResponder;
}

const CourseWorkspaceContext = createContext<CourseWorkspaceContextType | null>(
  null
);

export default CourseWorkspaceContext;
