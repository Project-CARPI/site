import { useState, useCallback, useRef } from "react";

import type { UniqueIdentifier } from "@dnd-kit/abstract";
import { useDragDropMonitor } from "@dnd-kit/react";

import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import { UserCourse } from "@/lib/types/course";
import { isDraggableData } from "@/lib/types/dnd";

export default function DragMonitor() {
  const {
    plannerCourses,
    toolboxCourses,
    addCourseToSemester,
    removeCourseFromSemester,
    moveCourseInSemester,
    moveSemester,
    deleteSemester,
    insertCourseIntoToolbox,
    removeCourseFromToolbox,
    moveCourseInToolbox,
    consolidateToolbox,
    resetToolbox,
  } = useCourseWorkspace();

  const [originalToolboxState, setOriginalToolboxState] = useState<
    UserCourse[] | null
  >(null);

  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  const findContainer = useCallback(
    (id: UniqueIdentifier): UniqueIdentifier | undefined => {
      // 1. Check if the ID *is* a container itself (Empty drop zones)
      if (id === "toolbox") return "toolbox";
      if (plannerCourses.find((sem) => sem.semesterID === id)) return id;

      // 2. Check if the ID exists inside the toolbox
      if (toolboxCourses.find((c) => c.id === id)) return "toolbox";

      // 3. Check if the ID exists inside a semester
      const semester = plannerCourses.find((sem) =>
        sem.courseList.find((c) => c.id === id),
      );
      if (semester) return semester.semesterID;

      return undefined;
    },
    [plannerCourses, toolboxCourses],
  );

  const overContainerIsSame = (
    activeContainer: UniqueIdentifier,
    overId: UniqueIdentifier,
  ) => {
    return activeContainer === findContainer(overId);
  };

  useDragDropMonitor({
    onDragStart(event) {
      const active = event.operation.source;
      if (!active) return;

      const data = active.data;

      if (isDraggableData(data)) {
        if (data.type === "course") {
          if (findContainer(active.id) === "toolbox") {
            setOriginalToolboxState([...toolboxCourses]);
          }
        }
      }
    },

    onDragOver(event) {
      const { source, target } = event.operation;

      if (source?.type === "semester") return;

      const activeId = source?.id as string;
      const overId = target?.id as string;

      const activeData = source?.data;
      const overData = target?.data;

      const activeGroup = activeData?.group as string;
      let overGroup = overData?.group || (target?.id as string);

      console.log(source, target);

      // FIX 1: Map header hover-zones back to their parent semester ID
      if (overGroup.endsWith("-header")) {
        overGroup = overGroup.replace("-header", "");
      }

      if (
        !activeId ||
        !overId ||
        !activeGroup ||
        !overGroup ||
        activeGroup === overGroup ||
        // FIX 2: Ignore garbage bins during the hover phase so items don't vanish instantly
        overGroup === "garbage" ||
        overGroup === "toolbox-button"
      ) {
        return;
      }

      let movingItem: UserCourse | undefined;
      if (activeGroup === "toolbox") {
        movingItem = toolboxCourses.find((c) => c.id === activeId);
        removeCourseFromToolbox(activeId);
      } else {
        const sem = plannerCourses.find((s) => s.semesterID === activeGroup);
        movingItem = sem?.courseList.find((c) => c.id === activeId);
        removeCourseFromSemester(activeGroup, activeId);
      }

      if (!movingItem) return;

      let overIndex = target?.index ?? 0;

      // FIX 3: If dropping into the empty space of the container itself, push to the end of the array
      if (overId === overGroup) {
        if (overGroup === "toolbox") {
          overIndex = toolboxCourses.length;
        } else {
          const sem = plannerCourses.find((s) => s.semesterID === overGroup);
          overIndex = sem?.courseList.length ?? 0;
        }
      }

      if (overGroup === "toolbox") {
        insertCourseIntoToolbox(movingItem, overIndex);
      } else {
        addCourseToSemester(overGroup, movingItem, overIndex);
      }

      movingItem = { ...movingItem, count: 1 };
      recentlyMovedToNewContainer.current = true;
    },

    onDragEnd(event) {
      const { operation } = event;
      const active = operation.source;
      const data = active?.data;
      const over = operation.target;

      lastOverId.current = null;

      if (!isDraggableData(data) || !active) return;

      if (data.type === "semester") {
        if (over?.id === "garbage") {
          deleteSemester(data.payload.semesterID as string);
        } else if (over && active.id !== over.id) {
          // FIX: Look up semester index in plannerCourses array
          const oldIndex = plannerCourses.findIndex(
            (s) => s.semesterID === active.id,
          );
          const newIndex = plannerCourses.findIndex(
            (s) => s.semesterID === over.id,
          );

          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            moveSemester(oldIndex, newIndex);
          }
        }
      } else if (data.type === "course") {
        const activeContainer = findContainer(active.id);

        if (over?.id === "garbage") {
          if (activeContainer === "toolbox") {
            removeCourseFromToolbox(active.id as string);
          } else if (activeContainer) {
            removeCourseFromSemester(
              activeContainer as string,
              active.id as string,
            );
          }
          setOriginalToolboxState(null);
        } else if (over?.id === "toolbox-button") {
          if (activeContainer && activeContainer !== "toolbox") {
            const sem = plannerCourses.find(
              (s) => s.semesterID === activeContainer,
            );
            const itemToMove = sem?.courseList.find((c) => c.id === active.id);
            if (itemToMove) {
              removeCourseFromSemester(
                activeContainer as string,
                active.id as string,
              );
              insertCourseIntoToolbox(itemToMove, toolboxCourses.length);
              consolidateToolbox();
            }
          }
          setOriginalToolboxState(null);
        } else if (!over) {
          if (originalToolboxState) {
            resetToolbox(originalToolboxState);
            if (activeContainer && activeContainer !== "toolbox") {
              removeCourseFromSemester(
                activeContainer as string,
                active.id as string,
              );
            }
          }
          setOriginalToolboxState(null);
        } else if (
          activeContainer &&
          overContainerIsSame(activeContainer, over.id)
        ) {
          let activeIndex = -1;
          let overIndex = -1;

          // FIX: Calculate indices manually for local sorting
          if (activeContainer === "toolbox") {
            activeIndex = toolboxCourses.findIndex((c) => c.id === active.id);
            overIndex = toolboxCourses.findIndex((c) => c.id === over.id);
          } else {
            const sem = plannerCourses.find(
              (s) => s.semesterID === activeContainer,
            );
            if (sem) {
              activeIndex = sem.courseList.findIndex((c) => c.id === active.id);
              overIndex = sem.courseList.findIndex((c) => c.id === over.id);
            }
          }

          if (
            activeIndex !== -1 &&
            overIndex !== -1 &&
            activeIndex !== overIndex
          ) {
            if (activeContainer === "toolbox") {
              moveCourseInToolbox(activeIndex, overIndex);
            } else {
              moveCourseInSemester(
                activeContainer as string,
                activeIndex,
                overIndex,
              );
            }
          }
        }

        if (activeContainer === "toolbox" || over?.id === "toolbox") {
          consolidateToolbox();
        }

        setOriginalToolboxState(null);
      }
    },
  });

  return null;
}
