import { useState, useCallback, useRef } from "react";

import { PointerSensor, KeyboardSensor } from "@dnd-kit/dom";
import { move } from "@dnd-kit/helpers";
import {
  DragDropProvider,
  DragDropEventHandlers,
  DragOverlay,
} from "@dnd-kit/react";
import { v4 as uuidv4 } from "uuid";

import Course from "@/components/course/Course";
import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import { UserCourse } from "@/lib/types";

export default function WorkspaceDndProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    plannerCourses,
    toolboxCourses,
    moveSemester,
    addCourseToSemester,
    removeCourseFromSemester,
    addCourseToToolbox,
    removeCourseFromToolbox,
    updateSemesterCourselist,
    resetPlanner,
    resetToolbox,
  } = useCourseWorkspace();

  const [activeItem, setActiveItem] = useState<any | null>(null);
  const snapshotToolbox = useRef(structuredClone(toolboxCourses));
  const snapshotPlanner = useRef(structuredClone(plannerCourses));

  // PointerSensor configured correctly for the new DOM API
  const [sensors] = useState(() => [
    PointerSensor.configure({
      activatorElements(source) {
        return [source.element, source.handle];
      },
    }),
    KeyboardSensor,
  ]);

  const handleDragStart = useCallback<DragDropEventHandlers["onDragStart"]>(
    (event) => {
      console.log("Drag started:", event);
      setActiveItem(event.operation.source);
      snapshotPlanner.current = structuredClone(plannerCourses);
      snapshotToolbox.current = structuredClone(toolboxCourses);
    },
    [snapshotPlanner, snapshotToolbox, plannerCourses, toolboxCourses],
  );

  const handleDragOver = useCallback<DragDropEventHandlers["onDragOver"]>(
    (event) => {
      const { source, target } = event.operation;

      if (!source || !target) return;
      else if (source.type === "semester") {
        return;
      }

      const sourceId = source.id as string;
      const targetId = target.id as string;

      if (sourceId === targetId) return;

      const sourceData = source.data;
      const targetData = target.data;

      const sourceType = sourceData?.type;
      const targetType = targetData?.type;

      const sourceCourse = sourceData?.course as UserCourse | undefined;
      if (!sourceCourse) return;

      const findSemesterIdForCourse = (courseId: string) => {
        return plannerCourses.find((s) =>
          s.courseList.some((c) => c.id === courseId),
        )?.semesterID;
      };

      // --- 2. PLANNER TO TOOLBOX (Returning a course) ---
      if (targetId === "toolbox" || targetType === "toolbox-course") {
        if (sourceType === "planner-course") {
          const sourceSemesterId = findSemesterIdForCourse(sourceId);
          if (sourceSemesterId) {
            removeCourseFromSemester(sourceSemesterId, sourceId);
            addCourseToToolbox(sourceCourse.data);
          }
        }
        return;
      }

      // --- FIND TARGET DESTINATION IN PLANNER ---
      let targetSemesterId: string | undefined = undefined;
      let targetIndex: number | undefined = undefined;

      if (targetType === "semester") {
        targetSemesterId = targetData?.semesterId || targetId;
        const targetSemester = plannerCourses.find(
          (s) => s.semesterID === targetSemesterId,
        );
        targetIndex = targetSemester?.courseList.length || 0;
      } else if (targetType === "planner-course") {
        targetSemesterId = findSemesterIdForCourse(targetId);

        // Grab the precise destination index from the new API, fallback if unavailable
        targetIndex =
          target.index !== undefined
            ? target.index
            : plannerCourses
                .find((s) => s.semesterID === targetSemesterId)
                ?.courseList.findIndex((c) => c.id === targetId);
      }

      if (!targetSemesterId) return;

      if (sourceType === "toolbox-course") {
        removeCourseFromToolbox(sourceId);

        const newCourseId = uuidv4();
        addCourseToSemester(
          targetSemesterId,
          { ...sourceCourse, id: newCourseId, count: 1 },
          targetIndex,
        );
      } else if (sourceType === "planner-course") {
        const sourceSemesterId = findSemesterIdForCourse(sourceId);
        if (!sourceSemesterId) return;

        const sourceSemester = plannerCourses.find(
          (s) => s.semesterID === sourceSemesterId,
        );

        if (sourceSemesterId === targetSemesterId) {
          updateSemesterCourselist(
            sourceSemesterId,
            move(sourceSemester?.courseList || [], event),
          );
        } else {
          removeCourseFromSemester(sourceSemesterId, sourceId);

          if (targetIndex === undefined || targetIndex < 0) {
            const targetSemester = plannerCourses.find(
              (s) => s.semesterID === targetSemesterId,
            );
            targetIndex = targetSemester?.courseList.length || 0;
          }

          addCourseToSemester(targetSemesterId, sourceCourse, targetIndex);
        }
      }
    },
    [plannerCourses, addCourseToSemester, removeCourseFromToolbox],
  );

  const handleDragEnd = useCallback<DragDropEventHandlers["onDragEnd"]>(
    (event) => {
      const { source, target } = event.operation;

      setActiveItem(null);

      console.log("dragging");

      // If the drag was canceled (e.g. via ESC key) or dropped in void space
      if (event.canceled || !target) {
        resetPlanner(snapshotPlanner.current);
        resetToolbox(snapshotToolbox.current);
        console.log(
          "Drag canceled or dropped outside valid targets. State reset.",
        );
        return;
      }

      console.log("Drag ended with source and target:", { source, target });

      const sourceId = source.id as string;
      const targetId = target.id as string;

      if (sourceId === targetId) return;

      // In the new API, we can access data directly without `.current`
      const sourceData = source.data as any;
      const targetData = target.data as any;

      const sourceType = sourceData?.type;
      const targetType = targetData?.type;

      // ==========================================
      // 1. SEMESTER REORDERING
      // ==========================================
      if (sourceType === "semester" && targetType === "semester") {
        const fromIndex = plannerCourses.findIndex(
          (s) => s.semesterID === sourceId,
        );
        const toIndex = plannerCourses.findIndex(
          (s) => s.semesterID === targetId,
        );
        if (fromIndex !== -1 && toIndex !== -1) {
          moveSemester(fromIndex, toIndex);
        }
        return;
      }
    },
    [plannerCourses, moveSemester, resetPlanner, resetToolbox],
  );

  return (
    <DragDropProvider
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}

      <DragOverlay dropAnimation={{ duration: 150, easing: "ease-out" }}>
        {activeItem?.data?.type?.includes("course") && (
          <div className="w-[300px]">
            <Course
              id="overlay"
              index={0}
              group="overlay"
              variant="planner"
              course={activeItem.data.course}
            />
          </div>
        )}
      </DragOverlay>
    </DragDropProvider>
  );
}
