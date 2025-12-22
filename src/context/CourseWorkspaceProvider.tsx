import React, { useState, ReactNode, useMemo, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";

import { APICourse, UserCourse } from "../types/interfaces/Course.interface";
import { SemesterType } from "../types/interfaces/Semester.interface";
import CourseWorkspaceContext from "./CourseWorkspaceContext";

export const CourseWorkspaceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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

  // --- Helper to Recalculate Credits ---
  const calculateCredits = (courses: UserCourse[]) => {
    return courses.reduce((acc, c) => acc + c.data.credit_max, 0);
  };

  const getCourseCountInToolbox = useCallback(
    (courseData: APICourse) => {
      const courseInToolbox = toolboxCourses.find(
        (c) =>
          c.data.subj_code === courseData.subj_code &&
          c.data.code_num === courseData.code_num,
      );
      return courseInToolbox ? courseInToolbox.count : 0;
    },
    [toolboxCourses],
  );

  // ==========================
  // PLANNER ACTIONS
  // ==========================

  const addCourseToSemester = useCallback(
    (semesterId: string, course: UserCourse, index?: number) => {
      setPlannerCourses((prev) =>
        prev.map((sem) => {
          if (sem.semesterID !== semesterId) return sem;

          const newCourseList = [...sem.courseList];
          // If index is provided, insert there; otherwise push to end
          if (index !== undefined && index >= 0) {
            newCourseList.splice(index, 0, course);
          } else {
            newCourseList.push(course);
          }

          return {
            ...sem,
            courseList: newCourseList,
            creditsTotal: calculateCredits(newCourseList),
          };
        }),
      );
    },
    [],
  );

  const removeCourseFromSemester = useCallback(
    (semesterId: string, courseId: string) => {
      setPlannerCourses((prev) =>
        prev.map((sem) => {
          if (sem.semesterID !== semesterId) return sem;
          const newCourseList = sem.courseList.filter((c) => c.id !== courseId);
          return {
            ...sem,
            courseList: newCourseList,
            creditsTotal: calculateCredits(newCourseList),
          };
        }),
      );
    },
    [],
  );

  const moveCourseInSemester = useCallback(
    (semesterId: string, fromIndex: number, toIndex: number) => {
      setPlannerCourses((prev) =>
        prev.map((sem) => {
          if (sem.semesterID !== semesterId) return sem;
          const newCourseList = arrayMove(sem.courseList, fromIndex, toIndex);
          return {
            ...sem,
            courseList: newCourseList,
          };
        }),
      );
    },
    [],
  );

  const addSemester = useCallback(() => {
    setPlannerCourses((prev) => [
      ...prev,
      {
        semesterNumber: prev.length + 1,
        semesterTitle: `Semester ${prev.length + 1}`,
        semesterID: uuidv4(),
        season: prev.length % 2 === 0 ? "Fall" : "Spring",
        creditsTotal: 0,
        courseList: [],
      },
    ]);
  }, []);

  const updateSemesterName = useCallback(
    (semesterId: string, newName: string) => {
      setPlannerCourses((prev) =>
        prev.map((sem) =>
          sem.semesterID === semesterId
            ? { ...sem, semesterTitle: newName }
            : sem,
        ),
      );
    },
    [],
  );

  const updateSemesterSeason = useCallback(
    (semesterId: string, newSeason: SemesterType["season"]) => {
      setPlannerCourses((prev) =>
        prev.map((sem) =>
          sem.semesterID === semesterId ? { ...sem, season: newSeason } : sem,
        ),
      );
    },
    [],
  );

  const deleteSemester = useCallback((semesterId: string) => {
    setPlannerCourses((prev) =>
      prev.filter((sem) => sem.semesterID !== semesterId),
    );
  }, []);

  // ==========================
  // TOOLBOX ACTIONS
  // ==========================

  // Smart Add: Checks for existing course to increment count
  const addCourseToToolbox = useCallback((courseData: APICourse) => {
    const courseCode = `${courseData.subj_code} ${courseData.code_num}`;
    setToolboxCourses((prev) => {
      // Check based on Subject+Code
      const existingIndex = prev.findIndex(
        (c) =>
          c.data.subj_code === courseData.subj_code &&
          c.data.code_num === courseData.code_num,
      );

      if (existingIndex !== -1) {
        return prev.map((c, i) =>
          i === existingIndex ? { ...c, count: c.count + 1 } : c,
        );
      } else {
        // Ensure new ID and count 1
        return [
          ...prev,
          {
            id: uuidv4(),
            name: courseCode,
            data: courseData,
            count: 1,
          },
        ];
      }
    });
  }, []);

  // Raw Insert: Used by Drag and Drop to place item at specific visual index
  const insertCourseIntoToolbox = useCallback(
    (course: UserCourse, index: number) => {
      setToolboxCourses((prev) => {
        const next = [...prev];
        const safeIndex = Math.min(index, next.length);
        next.splice(safeIndex, 0, course);
        return next;
      });
    },
    [],
  );

  const removeCourseFromToolbox = useCallback((courseId: string) => {
    setToolboxCourses((prev) => prev.filter((c) => c.id !== courseId));
  }, []);

  const updateToolboxCourse = useCallback((updatedCourse: UserCourse) => {
    setToolboxCourses((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)),
    );
  }, []);

  const moveCourseInToolbox = useCallback(
    (fromIndex: number, toIndex: number) => {
      setToolboxCourses((prev) => arrayMove(prev, fromIndex, toIndex));
    },
    [],
  );

  const consolidateToolboxCourses = useCallback(() => {
    setToolboxCourses((prev) => {
      const uniqueMap = new Map<string, UserCourse>();

      for (const course of prev) {
        // Create unique key based on course content
        const key = `${course.data.subj_code}-${course.data.code_num}`;

        if (uniqueMap.has(key)) {
          const existing = uniqueMap.get(key)!;
          existing.count += course.count;
        } else {
          uniqueMap.set(key, { ...course });
        }
      }
      return Array.from(uniqueMap.values());
    });
  }, []);

  const resetToolbox = useCallback((courses: UserCourse[]) => {
    setToolboxCourses(courses);
  }, []);

  const value = useMemo(
    () => ({
      plannerCourses,
      toolboxCourses,
      // Planner Actions
      addCourseToSemester,
      removeCourseFromSemester,
      moveCourseInSemester,
      updateSemesterName,
      updateSemesterSeason,
      deleteSemester,
      addSemester,
      // Toolbox Actions
      addCourseToToolbox,
      insertCourseIntoToolbox,
      removeCourseFromToolbox,
      updateToolboxCourse,
      moveCourseInToolbox,
      consolidateToolboxCourses,
      resetToolbox,
      getCourseCountInToolbox,
    }),
    [
      plannerCourses,
      toolboxCourses,
      addCourseToSemester,
      removeCourseFromSemester,
      moveCourseInSemester,
      updateSemesterName,
      updateSemesterSeason,
      deleteSemester,
      addSemester,
      addCourseToToolbox,
      insertCourseIntoToolbox,
      removeCourseFromToolbox,
      updateToolboxCourse,
      moveCourseInToolbox,
      consolidateToolboxCourses,
      resetToolbox,
      getCourseCountInToolbox,
    ],
  );

  return (
    <CourseWorkspaceContext.Provider value={value}>
      {children}
    </CourseWorkspaceContext.Provider>
  );
};
