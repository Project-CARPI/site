import { useState, useCallback, useRef, useMemo } from "react";

import { PointerSensor, KeyboardSensor } from "@dnd-kit/dom";
import { DragDropProvider, DragDropEventHandlers } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

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
    deleteSemester,
    resetPlanner,
    resetToolbox,
    consolidateToolbox,
    moveCourseInSemester,
  } = useCourseWorkspace();

  const snapshotToolbox = useRef(structuredClone(toolboxCourses));
  const snapshotPlanner = useRef(structuredClone(plannerCourses));

  const [sensors] = useState(() => [
    PointerSensor.configure({
      activatorElements(source) {
        return [source.element, source.handle];
      },
    }),
    KeyboardSensor,
  ]);

  const courseLocationMap = useMemo(() => {
    const map = new Map<
      string,
      { semesterId: string; semesterIndex: number; index: number }
    >();

    plannerCourses.forEach((semester, semesterIndex) => {
      semester.courseList.forEach((course, index) => {
        map.set(course.id, {
          semesterId: semester.semesterID,
          semesterIndex,
          index,
        });
      });
    });

    return map;
  }, [plannerCourses]);

  const handleDragStart = useCallback<
    DragDropEventHandlers["onDragStart"]
  >(() => {
    snapshotPlanner.current = structuredClone(plannerCourses);
    snapshotToolbox.current = structuredClone(toolboxCourses);
  }, [plannerCourses, toolboxCourses]);

  const handleDragOver = useCallback<DragDropEventHandlers["onDragOver"]>(
    (event) => {
      const { source, target } = event.operation;

      if (!source || !target || source.type === "semester") return;

      const sourceId = source.id as string;
      const targetId = target.id as string;

      // Ignore hovering over utility zones
      if (
        targetId === "garbage" ||
        targetId === "toolbox-button" ||
        sourceId === targetId
      )
        return;

      const sourceType = source.data?.type;
      const targetType = target.data?.type;
      const sourceCourse = source.data?.course as UserCourse | undefined;

      if (!sourceCourse) return;

      // --- PLANNER TO TOOLBOX ---
      if (targetId === "toolbox" || targetType === "toolbox-course") {
        if (sourceType === "planner-course") {
          const sourceSemesterId = courseLocationMap.get(sourceId)?.semesterId;
          if (sourceSemesterId) {
            removeCourseFromSemester(sourceSemesterId, sourceId);
            addCourseToToolbox(sourceCourse.data);
          }
        }
        return;
      }

      // --- ALL PLANNER MOVES (CROSS AND SAME SEMESTER) ---
      const sourceSemesterMeta = courseLocationMap.get(sourceId);
      const targetSemesterId =
        targetType === "semester"
          ? target.data?.semesterId || targetId
          : courseLocationMap.get(targetId)?.semesterId;

      if (!targetSemesterId) return;

      let targetIndex;
      if (isSortable(target)) {
        targetIndex = target.index;
      } else {
        const targetSemester =
          plannerCourses[courseLocationMap.get(targetId)?.semesterIndex || -1];
        targetIndex = targetSemester?.courseList.length || 0;
      }

      if (sourceType === "toolbox-course" && !sourceSemesterMeta) {
        // Toolbox to Planner
        removeCourseFromToolbox(sourceId);
        addCourseToSemester(
          targetSemesterId,
          { ...sourceCourse, id: sourceId, count: 1 },
          targetIndex,
        );
      } else if (sourceSemesterMeta) {
        if (sourceSemesterMeta.semesterId === targetSemesterId) {
          // SAME SEMESTER: Dynamically compute index to prevent React batching staleness
          const currentCourseIndex = sourceSemesterMeta.index;

          if (
            currentCourseIndex !== undefined &&
            currentCourseIndex !== -1 &&
            currentCourseIndex !== targetIndex
          ) {
            moveCourseInSemester(
              sourceSemesterMeta.semesterId,
              currentCourseIndex,
              targetIndex,
            );
          }
        } else {
          // CROSS SEMESTER: Instantly mount to new list so DOM keeps track of ID
          removeCourseFromSemester(sourceSemesterMeta.semesterId, sourceId);
          addCourseToSemester(targetSemesterId, sourceCourse, targetIndex);
        }
      }
    },
    [
      plannerCourses,
      addCourseToSemester,
      removeCourseFromToolbox,
      removeCourseFromSemester,
      addCourseToToolbox,
      courseLocationMap,
      moveCourseInSemester,
    ],
  );

  const handleDragEnd = useCallback<DragDropEventHandlers["onDragEnd"]>(
    (event) => {
      const { source, target } = event.operation;

      if (event.canceled || !target) {
        resetPlanner(snapshotPlanner.current);
        resetToolbox(snapshotToolbox.current);
        return;
      }
      if (!source || !target) return;

      const sourceId = source.id as string;
      const targetId = target.id as string;
      const sourceType = source.data?.type;
      const targetType = target.data?.type;

      // --- UTILITY DROPZONES ---
      if (targetId === "garbage") {
        if (sourceType === "semester") {
          deleteSemester(source.data?.semester?.semesterID || sourceId);
        } else {
          // Always look up the *current* state before deleting, as onDragOver might have moved it
          const semId = courseLocationMap.get(sourceId)?.semesterId;
          if (semId) removeCourseFromSemester(semId, sourceId);
          else removeCourseFromToolbox(sourceId);
        }
        return;
      }

      if (
        targetId === "toolbox-button" ||
        targetId === "toolbox" ||
        targetType === "toolbox-course"
      ) {
        if (sourceType !== "semester") {
          const semId = courseLocationMap.get(sourceId)?.semesterId;
          if (semId) {
            removeCourseFromSemester(semId, sourceId);
            addCourseToToolbox(
              source.data?.course?.data || source.data?.course,
            );
            consolidateToolbox();
          }
        }
        return;
      }

      // --- SEMESTER REORDERING ---
      if (sourceType === "semester" && targetType === "semester") {
        if (sourceId === targetId) return;
        const fromIndex = plannerCourses.findIndex(
          (s) => s.semesterID === sourceId,
        );
        const toIndex = plannerCourses.findIndex(
          (s) => s.semesterID === targetId,
        );
        if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
          moveSemester(fromIndex, toIndex);
        }
        return;
      }
    },
    [
      plannerCourses,
      moveSemester,
      resetPlanner,
      resetToolbox,
      deleteSemester,
      consolidateToolbox,
      courseLocationMap,
      removeCourseFromSemester,
      removeCourseFromToolbox,
      addCourseToToolbox,
    ],
  );

  return (
    <DragDropProvider
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DragDropProvider>
  );
}
