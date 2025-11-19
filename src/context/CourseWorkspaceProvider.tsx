import React, { useState, ReactNode } from "react";
import { UserCourse } from "../types/interfaces/Course.interface.ts";
import { SemesterType } from "../types/interfaces/Semester.interface.ts";
import { useDragAndDrop } from "../hooks/useDragAndDrop.ts";
import CourseWorkspaceContext from "./CourseWorkspaceContext.tsx";

export const CourseWorkspaceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // all states
  const [toolboxCourses, setToolboxCourses] = useState<UserCourse[]>([]);
  const [plannerCourses, setPlannerCourses] = useState<SemesterType[]>([
    {
      semesterNumber: 1,
      semesterID: "semester-1",
      semesterSeason: "fall",
      creditsTotal: 0,
      courseList: [],
    },
  ]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { onDragStart, onDragEnd } = useDragAndDrop({
    toolboxCourses,
    setToolboxCourses,
    plannerCourses,
    setPlannerCourses,
    setIsDragging,
  });

  const value = {
    plannerCourses,
    setPlannerCourses,
    toolboxCourses,
    setToolboxCourses,
    isDragging,
    onDragStart,
    onDragEnd,
  };

  return (
    <CourseWorkspaceContext.Provider value={value}>
      {children}
    </CourseWorkspaceContext.Provider>
  );
};
