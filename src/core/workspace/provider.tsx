import { ReactNode, useMemo, useReducer } from "react";

import { usePlannerActions } from "@/core/workspace/actions/usePlannerActions";
import { useToolboxActions } from "@/core/workspace/actions/useToolboxActions";
import { CourseWorkspaceContext } from "@/core/workspace/context";
import { PlannerReducer } from "@/core/workspace/reducers/planner";
import { ToolboxReducer } from "@/core/workspace/reducers/toolbox";
import generateEmptySemester from "@/core/workspace/utils/generateEmptySemester";

function createInitalPlannerState(numSemsters: number) {
  const semesters = [];
  for (let i = 1; i <= numSemsters; i++) {
    semesters.push(generateEmptySemester(i));
  }
  return semesters;
}

export function CourseWorkspaceProvider({ children }: { children: ReactNode }) {
  const [toolboxCourses, dispatchToolbox] = useReducer(ToolboxReducer, []);
  const [plannerCourses, dispatchPlanner] = useReducer(
    PlannerReducer,
    createInitalPlannerState(6),
  );

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
