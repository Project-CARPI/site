import { ReactNode, useEffect, useMemo, useReducer } from "react";

import { usePlannerActions } from "@/core/workspace/actions/usePlannerActions";
import { useToolboxActions } from "@/core/workspace/actions/useToolboxActions";
import { CourseWorkspaceContext } from "@/core/workspace/context";
import { PlannerReducer } from "@/core/workspace/reducers/planner";
import { ToolboxReducer } from "@/core/workspace/reducers/toolbox";
import generateEmptySemester from "@/core/workspace/utils/generateEmptySemester";

const PLANNER_KEY = "carpi_planner_data";
const TOOLBOX_KEY = "carpi_toolbox_data";

function createInitalPlannerState(numSemsters: number) {
  const semesters = [];
  for (let i = 1; i <= numSemsters; i++) {
    semesters.push(generateEmptySemester(i));
  }
  return semesters;
}

export function CourseWorkspaceProvider({ children }: { children: ReactNode }) {
  const [toolboxCourses, dispatchToolbox] = useReducer(
    ToolboxReducer,
    [],
    (initialState) => {
      try {
        const stored = localStorage.getItem(TOOLBOX_KEY);
        return stored ? JSON.parse(stored) : initialState;
      } catch (e) {
        console.error("Failed to load toolbox from localStorage", e);
        return initialState;
      }
    },
  );

  const [plannerCourses, dispatchPlanner] = useReducer(
    PlannerReducer,
    6,
    (defaultSemesterCount) => {
      try {
        const stored = localStorage.getItem(PLANNER_KEY);
        return stored
          ? JSON.parse(stored)
          : createInitalPlannerState(defaultSemesterCount);
      } catch (e) {
        console.error("Failed to load planner from localStorage", e);
        return createInitalPlannerState(defaultSemesterCount);
      }
    },
  );

  // Persist Toolbox changes
  useEffect(() => {
    localStorage.setItem(TOOLBOX_KEY, JSON.stringify(toolboxCourses));
  }, [toolboxCourses]);

  // Persist Planner changes
  useEffect(() => {
    localStorage.setItem(PLANNER_KEY, JSON.stringify(plannerCourses));
  }, [plannerCourses]);

  const plannerActions = usePlannerActions(dispatchPlanner, plannerCourses);
  const toolboxActions = useToolboxActions(dispatchToolbox, toolboxCourses);

  const value = useMemo(
    () => ({
      plannerCourses,
      toolboxCourses,
      toolboxCourseCount: toolboxCourses.reduce(
        (acc, course) => acc + course.count,
        0,
      ),
      ...plannerActions,
      ...toolboxActions,
    }),
    [plannerCourses, toolboxCourses, plannerActions, toolboxActions],
  );

  return (
    <CourseWorkspaceContext.Provider value={value}>
      {children}
    </CourseWorkspaceContext.Provider>
  );
}
