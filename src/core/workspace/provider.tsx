import { ReactNode, useEffect, useMemo, useReducer, useRef } from "react";

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
import {
  loadVersionedData,
  saveVersionedData,
} from "@/core/workspace/utils/storage";

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
  /* INITIALIZATION */
  const [toolboxCourses, dispatchToolbox] = useReducer(
    ToolboxReducer,
    [],
    (initialState) => {
      const loaded = loadVersionedData(TOOLBOX_KEY, ToolboxStorageSchema);
      return loaded !== null ? loaded : initialState;
    },
  );

  const [plannerCourses, dispatchPlanner] = useReducer(
    PlannerReducer,
    6,
    (defaultSemesterCount) => {
      const loaded = loadVersionedData(PLANNER_KEY, PlannerStorageSchema);
      return loaded !== null
        ? loaded
        : createInitialPlannerState(defaultSemesterCount);
    },
  );

  /* LOCAL STORAGE PERSISTENCE */
  const isToolboxMounted = useRef(false);
  const isPlannerMounted = useRef(false);

  useEffect(() => {
    if (!isToolboxMounted.current) {
      isToolboxMounted.current = true;
      return;
    }

    saveVersionedData(TOOLBOX_KEY, toolboxCourses);
  }, [toolboxCourses]);

  useEffect(() => {
    if (!isPlannerMounted.current) {
      isPlannerMounted.current = true;
      return;
    }

    saveVersionedData(PLANNER_KEY, plannerCourses);
  }, [plannerCourses]);

  /* ACTIONS */
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
