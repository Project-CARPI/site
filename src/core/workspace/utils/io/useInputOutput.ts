import { useCallback } from "react";

import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import {
  cleanCourseForExport,
  enrichPlannerForImport,
  SaveFileSchema,
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
  const importPlan = useCallback(
    (file: File) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);

          // Validate against schema
          const result = SaveFileSchema.safeParse(json);
          if (!result.success) {
            alert("Error: The selected file is not a valid Carpi plan.");
            console.error(result.error);
            return;
          }

          if (
            !confirm(
              "Importing will overwrite your current plan. Are you sure?",
            )
          ) {
            return;
          }

          // Clean Data and Update State
          const importedPlanner = enrichPlannerForImport(result.data.planner);

          resetPlanner(importedPlanner);
          resetToolbox([]);
        } catch (err) {
          console.error(err);
          alert("Failed to parse file.");
        }
      };

      reader.readAsText(file);
    },
    [resetPlanner, resetToolbox],
  );

  return { exportPlan, importPlan };
};
