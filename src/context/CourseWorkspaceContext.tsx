import React, { createContext } from "react";
import { CourseEntry } from "../types/interfaces/Course.interface.ts";
import { SemesterType } from "../types/interfaces/Semester.interface.ts";
import { OnDragStartResponder, OnDragEndResponder } from "@hello-pangea/dnd";

export interface CourseWorkspaceContextType {
  plannerCourses: SemesterType[];
  setPlannerCourses: React.Dispatch<React.SetStateAction<SemesterType[]>>;
  toolboxCourses: CourseEntry[];
  setToolboxCourses: React.Dispatch<React.SetStateAction<CourseEntry[]>>;
  isDragging: boolean;
  onDragStart: OnDragStartResponder;
  onDragEnd: OnDragEndResponder;
}

const CourseWorkspaceContext = createContext<CourseWorkspaceContextType | null>(
  null
);

export default CourseWorkspaceContext;
