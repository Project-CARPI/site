import { useState, useCallback, useRef } from "react";

import {
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  UniqueIdentifier,
  CollisionDetection,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  closestCenter,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import { UserCourse } from "@/lib/types";
import { DraggableData, isDraggableData } from "@/lib/types/dnd";

export const useDndLogic = () => {
  const {
    plannerCourses,
    toolboxCourses,
    // Planner Actions
    addCourseToSemester,
    removeCourseFromSemester,
    moveCourseInSemester,
    moveSemester,
    deleteSemester,
    // Toolbox Actions
    insertCourseIntoToolbox,
    removeCourseFromToolbox,
    moveCourseInToolbox,
    consolidateToolbox,
    resetToolbox,
  } = useCourseWorkspace();

  const [activeItem, setActiveItem] = useState<DraggableData | null>(null);

  // Snapshot of toolbox before drag starts. Used for "Cancel" (Esc/Drop nowhere).
  const [originalToolboxState, setOriginalToolboxState] = useState<
    UserCourse[] | null
  >(null);

  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  // --- Sensors ---
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // --- Helper: Find Container by Course ID ---
  const findContainer = useCallback(
    (id: UniqueIdentifier): UniqueIdentifier | undefined => {
      if (toolboxCourses.find((c) => c.id === id)) return "toolbox";
      const semester = plannerCourses.find((sem) =>
        sem.courseList.find((c) => c.id === id),
      );
      if (semester) return semester.semesterID;
      return undefined;
    },
    [plannerCourses, toolboxCourses],
  );

  // --- Collision Strategy ---
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      // semester dragging strategy: only collide with other semesters and garbage bin
      if (activeItem && activeItem.type === "semester") {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (c) => c.data.current?.type === "semester" || c.id === "garbage",
          ),
        });
      }

      // toolbox priority
      if (
        activeItem &&
        findContainer(activeItem.payload.id) === "toolbox" &&
        args.droppableContainers.find((c) => c.id === "toolbox")
      ) {
        // add bias here
      }

      // course dragging strategy: prefer pointer intersections, then fallback to rectangle intersections
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);

      let overId = getFirstCollision(intersections, "id");

      if (overId != null) {
        if (
          ["garbage", "toolbox", "toolbox-button"].includes(overId as string)
        ) {
          return intersections;
        }

        const semester = plannerCourses.find((s) => s.semesterID === overId);
        if (semester) {
          const containerItems = semester.courseList.map((c) => c.id);
          // If hovering a semester with items, bias towards the items inside it
          if (containerItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id as string),
              ),
            })[0]?.id;
          }
        }
        lastOverId.current = overId;
        return [{ id: overId }];
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeItem?.payload.id || null;
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeItem, findContainer, plannerCourses],
  );

  // --- 1. Drag Start ---
  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;

    if (isDraggableData(data)) {
      setActiveItem(data);

      if (data.type === "course") {
        if (findContainer(active.id) === "toolbox") {
          setOriginalToolboxState([...toolboxCourses]);
        }
      }
    }
    document.body.classList.add("no-scroll-during-drag");
  };

  // --- 2. Drag Over (Moving items between lists) ---
  const onDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      const data = active.data.current;

      // only allow dragging courses, nothing else
      if (!isDraggableData(data)) return;
      if (data.type === "semester") return;
      if (!over) return;

      const overId = over.id;
      if (active.id === overId) return;

      const activeContainer = findContainer(active.id);
      const overContainer =
        plannerCourses.some((s) => s.semesterID === overId) ||
        overId === "toolbox"
          ? overId
          : findContainer(overId);

      if (
        !activeContainer ||
        !overContainer ||
        activeContainer === overContainer
      ) {
        return;
      }

      // get the item we're moving
      let itemToMove: UserCourse | undefined;
      if (activeContainer === "toolbox") {
        itemToMove = toolboxCourses.find((c) => c.id === active.id);
      } else {
        const sem = plannerCourses.find(
          (s) => s.semesterID === activeContainer,
        );
        itemToMove = sem?.courseList.find((c) => c.id === active.id);
      }

      if (!itemToMove) return;

      // --- EXECUTE MOVE ---

      // remove course from the source container
      if (activeContainer === "toolbox") {
        removeCourseFromToolbox(active.id as string);
      } else {
        removeCourseFromSemester(
          activeContainer as string,
          active.id as string,
        );
      }

      // add coures to the destination container
      const item = { ...itemToMove!, count: 1 };
      if (overContainer === "toolbox") {
        const overIndex =
          over.data.current?.sortable?.index ?? toolboxCourses.length;
        insertCourseIntoToolbox(item, overIndex);
      } else {
        const sem = plannerCourses.find((s) => s.semesterID === overContainer);
        if (sem) {
          const nextList = sem.courseList;
          let overIndex = nextList.length;

          // calculate index based on hover position relative to other items
          if (overId !== overContainer) {
            const idx = nextList.findIndex((c) => c.id === overId);
            const isBelow =
              over &&
              active.rect.current.translated &&
              active.rect.current.translated.top >
                over.rect.top + over.rect.height;
            const modifier = isBelow ? 1 : 0;
            overIndex = idx >= 0 ? idx + modifier : nextList.length;
          }
          addCourseToSemester(overContainer as string, item, overIndex);
        }
      }
      recentlyMovedToNewContainer.current = true;
    },
    [
      findContainer,
      plannerCourses,
      toolboxCourses,
      addCourseToSemester,
      removeCourseFromSemester,
      removeCourseFromToolbox,
      insertCourseIntoToolbox,
    ],
  );

  // --- 3. Drag End (Cleanup & Merging) ---
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const data = active.data.current;

    // Cleanup
    document.body.classList.remove("no-scroll-during-drag");
    setActiveItem(null);
    lastOverId.current = null;

    if (!isDraggableData(data)) return;

    if (data.type === "semester") {
      if (over?.id === "garbage") {
        deleteSemester(data.payload.semesterID as string);
      } else if (over && active.id !== over.id) {
        const oldIndex = data.sortable?.index;
        const newIndex = over.data.current?.sortable?.index;
        if (
          oldIndex !== undefined &&
          newIndex !== undefined &&
          oldIndex !== newIndex
        ) {
          moveSemester(oldIndex, newIndex);
        }
      }
    } else if (data.type === "course") {
      const activeContainer = findContainer(active.id);

      // garbage drop (deletion)
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
      }

      // drop into toolbox button on mobile (removes from semester, adds to toolbox)
      else if (over?.id === "toolbox-button") {
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
      }

      // cancel/drop outside (revert to original position)
      else if (!over) {
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
      }

      // reorder within the same container
      else if (
        activeContainer &&
        overContainerIsSame(activeContainer, over.id)
      ) {
        const activeIndex = data.sortable?.index;
        const overIndex = over.data.current?.sortable?.index;

        if (
          activeIndex !== undefined &&
          overIndex !== undefined &&
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

      // merge duplicates (Always run this if we touched the toolbox)
      if (activeContainer === "toolbox" || over?.id === "toolbox") {
        consolidateToolbox();
      }

      setOriginalToolboxState(null);
    }
  };

  const overContainerIsSame = (
    activeContainer: UniqueIdentifier,
    overId: UniqueIdentifier,
  ) => {
    const overRealContainer =
      plannerCourses.some((s) => s.semesterID === overId) ||
      overId === "toolbox"
        ? overId
        : findContainer(overId);
    return activeContainer === overRealContainer;
  };

  return {
    sensors,
    collisionDetectionStrategy,
    onDragStart,
    onDragOver,
    onDragEnd,
    activeItem,
  };
};
