import { useCallback } from "react";

import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import {
  cleanCourseForExport,
  enrichPlannerForImport,
} from "@/core/workspace/utils/io/inputOutput";

export const useInputOutput = () => {
  const { plannerCourses, resetPlanner, resetToolbox } = useCourseWorkspace();

  /* EXPORT */
  const exportPlan = useCallback(() => {
    const cleanPlanner = plannerCourses.map((sem) => ({
      semester_number: sem.semesterNumber,
      semester_title: sem.semesterTitle,
      season: sem.season,
      total_credits: sem.creditsTotal,
      courseList: sem.courseList.map(cleanCourseForExport),
    }));

    const data = {
      version: 1,
      timestamp: new Date().toISOString(),
      planner: cleanPlanner,
    };

    // download as JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `carpi-plan-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [plannerCourses]);

  /* IMPORT */
  const performImport = useCallback(
    (jsonData: any) => {
      const importedPlanner = enrichPlannerForImport(jsonData.planner);
      resetPlanner(importedPlanner);
      resetToolbox([]);
    },
    [resetPlanner, resetToolbox],
  );

  return { exportPlan, performImport };
};
