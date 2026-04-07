import { useState, useCallback, useRef, useMemo } from "react";

import { PointerSensor, KeyboardSensor } from "@dnd-kit/dom";
import {
  DragDropProvider,
  DragDropEventHandlers,
  DragOverlay,
} from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { MdDragIndicator, MdOutlineMoreHoriz } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

import CourseLabel from "@/components/course/CourseLabel";
import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import { APICourse, UserCourse } from "@/lib/types";

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
    removeCourseFromToolbox,
    resetPlanner,
    resetToolbox,
    consolidateToolbox,
    moveCourseInSemester,
    insertCourseIntoToolbox,
  } = useCourseWorkspace();

  const snapshotToolbox = useRef(structuredClone(toolboxCourses));
  const snapshotPlanner = useRef(structuredClone(plannerCourses));
  const catalogDragCourseIdRef = useRef<string>("");

  const [draggedCatalogCourse, setDraggedCatalogCourse] =
    useState<APICourse | null>(null);

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

  const handleDragStart = useCallback<DragDropEventHandlers["onDragStart"]>(
    (event) => {
      const { source } = event.operation;
      snapshotPlanner.current = structuredClone(plannerCourses);
      snapshotToolbox.current = structuredClone(toolboxCourses);
      if (source?.data?.type === "catalog-course") {
        setDraggedCatalogCourse(source.data.course as APICourse);
        catalogDragCourseIdRef.current = uuidv4();
      }
    },
    [plannerCourses, toolboxCourses],
  );

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

      // --- CATALOG TO PLANNER ---
      if (sourceType === "catalog-course") {
        const apiCourse = source.data?.course as APICourse | undefined;
        if (!apiCourse) return;

        const targetSemesterId =
          targetType === "semester"
            ? target.data?.semesterId || targetId
            : courseLocationMap.get(targetId)?.semesterId;

        if (!targetSemesterId) return;

        let catalogTargetIndex: number | undefined;
        if (isSortable(target)) {
          catalogTargetIndex = target.index;
        } else {
          const targetSemester =
            plannerCourses[
              courseLocationMap.get(targetId)?.semesterIndex ?? -1
            ];
          catalogTargetIndex = targetSemester?.courseList.length ?? 0;
        }

        const plannerCourseId = catalogDragCourseIdRef.current;
        const existingLocation = courseLocationMap.get(plannerCourseId);
        const courseToPlace: UserCourse = {
          id: plannerCourseId,
          name: `${apiCourse.subj_code} ${apiCourse.code_num}`,
          count: 1,
          credits: apiCourse.credit_max,
          data: apiCourse,
        };

        if (!existingLocation) {
          addCourseToSemester(
            targetSemesterId,
            courseToPlace,
            catalogTargetIndex,
          );
        } else if (existingLocation.semesterId === targetSemesterId) {
          const currentIndex = existingLocation.index;
          if (
            currentIndex !== undefined &&
            currentIndex !== -1 &&
            currentIndex !== catalogTargetIndex
          ) {
            moveCourseInSemester(
              existingLocation.semesterId,
              currentIndex,
              catalogTargetIndex,
            );
          }
        } else {
          removeCourseFromSemester(
            existingLocation.semesterId,
            plannerCourseId,
          );
          addCourseToSemester(
            targetSemesterId,
            courseToPlace,
            catalogTargetIndex,
          );
        }
        return;
      }

      const sourceCourse = source.data?.course as UserCourse | undefined;
      if (!sourceCourse) return;

      let targetIndex;
      if (isSortable(target)) {
        targetIndex = target.index;
      } else {
        const targetSemester =
          plannerCourses[courseLocationMap.get(targetId)?.semesterIndex || -1];
        targetIndex = targetSemester?.courseList.length || 0;
      }

      // --- PLANNER TO TOOLBOX ---
      if (targetId === "toolbox" || targetType === "toolbox-course") {
        if (sourceType === "planner-course") {
          const sourceSemesterId = courseLocationMap.get(sourceId)?.semesterId;
          if (sourceSemesterId) {
            removeCourseFromSemester(sourceSemesterId, sourceId);
            insertCourseIntoToolbox(sourceCourse, targetIndex ?? 0);
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
      courseLocationMap,
      moveCourseInSemester,
      insertCourseIntoToolbox,
    ],
  );

  const handleDragEnd = useCallback<DragDropEventHandlers["onDragEnd"]>(
    (event) => {
      setDraggedCatalogCourse(null);

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
        const semId = courseLocationMap.get(sourceId)?.semesterId;
        if (semId) removeCourseFromSemester(semId, sourceId);
        else removeCourseFromToolbox(sourceId);
        return;
      }

      if (targetId === "toolbox-button") {
        const sourceCourse = source.data?.course as UserCourse | undefined;
        if (!sourceCourse) return;
        const semId = courseLocationMap.get(sourceId)?.semesterId;
        if (semId) {
          removeCourseFromSemester(semId, sourceId);
          insertCourseIntoToolbox(sourceCourse, 0);
          consolidateToolbox();
        }
      }

      if (targetId === "toolbox" || targetType === "toolbox-course") {
        if (sourceType !== "semester") {
          consolidateToolbox();
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
      consolidateToolbox,
      courseLocationMap,
      removeCourseFromSemester,
      removeCourseFromToolbox,
      insertCourseIntoToolbox,
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
      <DragOverlay disabled={!draggedCatalogCourse} dropAnimation={null}>
        {draggedCatalogCourse && (
          <div className="flex justify-between bg-darkblue rounded-2xl text-carpipink gap-4 px-2 py-3 shadow-xl cursor-grabbing select-none">
            <div className="flex gap-2 items-center">
              <MdDragIndicator size={22} />
              <CourseLabel course={draggedCatalogCourse} showCredits />
            </div>
            <MdOutlineMoreHoriz className="text-2xl opacity-40" />
          </div>
        )}
      </DragOverlay>
    </DragDropProvider>
  );
}
