import { ReactNode, useEffect, useMemo, useReducer } from "react";

import { usePlannerActions } from "@/core/workspace/actions/usePlannerActions";
import { useToolboxActions } from "@/core/workspace/actions/useToolboxActions";
import { CourseWorkspaceContext } from "@/core/workspace/context";
import { PlannerReducer } from "@/core/workspace/reducers/planner";
import { ToolboxReducer } from "@/core/workspace/reducers/toolbox";
import generateEmptySemester from "@/core/workspace/utils/generateEmptySemester";
import {
  ToolboxStorageSchema,
  PlannerStorageSchema,
} from "@/core/workspace/utils/schemas";

const PLANNER_KEY = "carpi_planner_data";
const TOOLBOX_KEY = "carpi_toolbox_data";

function createInitialPlannerState(numSemesters: number) {
  const semesters = [];
  for (let i = 1; i <= numSemesters; i++) {
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
        if (!stored || !stored.trim()) return initialState;

        const parsed = JSON.parse(stored);

        // validate parsed data
        const validation = ToolboxStorageSchema.safeParse(parsed);
        if (validation.success) {
          return validation.data;
        } else {
          console.warn("Toolbox data corrupted, resetting:", validation.error);
          return initialState;
        }
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
        if (!stored || !stored.trim()) {
          return createInitialPlannerState(defaultSemesterCount);
        }

        const parsed = JSON.parse(stored);

        // validate parsed data
        const validation = PlannerStorageSchema.safeParse(parsed);
        if (validation.success) {
          return validation.data;
        } else {
          console.warn("Planner data corrupted, resetting:", validation.error);
          return createInitialPlannerState(defaultSemesterCount);
        }
      } catch (e) {
        console.error("Failed to load planner from localStorage", e);
        return createInitialPlannerState(defaultSemesterCount);
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
