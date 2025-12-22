import React, { useState, ReactNode, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

import { UserCourse } from "../types/interfaces/Course.interface.ts";
import { SemesterType } from "../types/interfaces/Semester.interface.ts";
import CourseWorkspaceContext from "./CourseWorkspaceContext.tsx";

export const CourseWorkspaceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // all states
  const [toolboxCourses, setToolboxCourses] = useState<UserCourse[]>([]);
  const [plannerCourses, setPlannerCourses] = useState<SemesterType[]>([
    {
      semesterNumber: 1,
      semesterTitle: "Semester 1",
      semesterID: uuidv4(),
      season: "Fall",
      creditsTotal: 0,
      courseList: [],
    },
    {
      semesterNumber: 2,
      semesterTitle: "Semester 2",
      semesterID: uuidv4(),
      season: "Spring",
      creditsTotal: 0,
      courseList: [],
    },
    {
      semesterNumber: 3,
      semesterTitle: "Semester 3",
      semesterID: uuidv4(),
      season: "Fall",
      creditsTotal: 0,
      courseList: [],
    },
    {
      semesterNumber: 4,
      semesterTitle: "Semester 4",
      semesterID: uuidv4(),
      season: "Spring",
      creditsTotal: 0,
      courseList: [],
    },
  ]);

  const value = useMemo(
    () => ({
      plannerCourses,
      setPlannerCourses,
      toolboxCourses,
      setToolboxCourses,
    }),
    [plannerCourses, toolboxCourses]
  );

  return (
    <CourseWorkspaceContext.Provider value={value}>
      {children}
    </CourseWorkspaceContext.Provider>
  );
};
