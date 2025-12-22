import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
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
import { useCourseWorkspace } from "./useCourseWorkspace";
import { UserCourse } from "../types/interfaces/Course.interface";

export const useDndLogic = () => {
  const {
    plannerCourses,
    toolboxCourses,

    // Planner Actions
    addCourseToSemester,
    removeCourseFromSemester,
    moveCourseInSemester,

    // Toolbox Actions
    insertCourseIntoToolbox,
    removeCourseFromToolbox,
    moveCourseInToolbox,
    consolidateToolboxCourses,
    resetToolbox,
  } = useCourseWorkspace();

  const [activeItem, setActiveItem] = useState<UserCourse | null>(null);

  // Snapshot of toolbox before drag starts. Used for "Cancel" (Esc/Drop nowhere).
  const [originalToolboxState, setOriginalToolboxState] = useState<
    UserCourse[] | null
  >(null);

  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  // --- Sensors ---
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- Helper: Find Container by Course ID ---
  const findContainer = useCallback(
    (id: UniqueIdentifier): UniqueIdentifier | undefined => {
      if (toolboxCourses.find((c) => c.id === id)) return "toolbox";

      const semester = plannerCourses.find((sem) =>
        sem.courseList.find((c) => c.id === id)
      );
      if (semester) return semester.semesterID;

      return undefined;
    },
    [plannerCourses, toolboxCourses]
  );

  // --- Collision Strategy ---
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      // Prioritize Toolbox if active item started there
      if (
        activeItem &&
        findContainer(activeItem.id) === "toolbox" &&
        args.droppableContainers.find((c) => c.id === "toolbox")
      ) {
        // Optional: Add logic here if you want to bias towards toolbox
        // return [{ id: "toolbox" }];
      }

      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);

      let overId = getFirstCollision(intersections, "id");

      if (overId != null) {
        if (overId === "garbage" || overId === "toolbox") return intersections;

        const semester = plannerCourses.find((s) => s.semesterID === overId);
        if (semester) {
          const containerItems = semester.courseList.map((c) => c.id);
          if (containerItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id as string)
              ),
            })[0]?.id;
          }
        }
        lastOverId.current = overId;
        return [{ id: overId }];
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeItem?.id || null;
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeItem, findContainer, plannerCourses]
  );

  // --- 1. Drag Start ---
  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = active.data.current as UserCourse;
    setActiveItem(item);

    if (findContainer(active.id) === "toolbox") {
      setOriginalToolboxState([...toolboxCourses]);
    }

    document.body.classList.add("no-scroll-during-drag");
  };

  // --- 2. Drag Over (Moving items between lists) ---
  const onDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      const overId = over?.id;

      if (!overId || active.id === overId) return;

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

      // Find the moving item data
      let itemToMove: UserCourse | undefined;
      if (activeContainer === "toolbox") {
        itemToMove = toolboxCourses.find((c) => c.id === active.id);
      } else {
        const sem = plannerCourses.find(
          (s) => s.semesterID === activeContainer
        );
        itemToMove = sem?.courseList.find((c) => c.id === active.id);
      }

      if (!itemToMove) return;

      // --- EXECUTE MOVE ---

      // remove from source
      if (activeContainer === "toolbox") {
        // If count > 1, decrement count instead of removing
        if (itemToMove.count > 1) {
          const remainder: UserCourse = {
            ...itemToMove,
            id: uuidv4(),
            count: itemToMove.count - 1,
          };

          const index = toolboxCourses.findIndex((c) => c.id === active.id);
          removeCourseFromToolbox(active.id as string);
          insertCourseIntoToolbox(remainder, index);
        } else {
          removeCourseFromToolbox(active.id as string);
        }
      } else {
        removeCourseFromSemester(
          activeContainer as string,
          active.id as string
        );
      }

      // B. Add to Destination
      // Ensure the moved item has count 1 in its new home
      const itemWithSingleCount = { ...itemToMove!, count: 1 };

      if (overContainer === "toolbox") {
        const overIndex =
          over.data.current?.sortable?.index ?? toolboxCourses.length;
        insertCourseIntoToolbox(itemWithSingleCount, overIndex);
      } else {
        const sem = plannerCourses.find((s) => s.semesterID === overContainer);
        if (sem) {
          const nextList = sem.courseList;
          let overIndex = nextList.length;

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
          addCourseToSemester(
            overContainer as string,
            itemWithSingleCount,
            overIndex
          );
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
    ]
  );

  // --- 3. Drag End (Cleanup & Merging) ---
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeContainer = findContainer(active.id);

    // Cleanup
    document.body.classList.remove("no-scroll-during-drag");
    setActiveItem(null);
    lastOverId.current = null;

    // A. Handle Garbage Drop
    if (over?.id === "garbage") {
      if (activeContainer === "toolbox") {
        removeCourseFromToolbox(active.id as string);
      } else if (activeContainer) {
        removeCourseFromSemester(
          activeContainer as string,
          active.id as string
        );
      }
      setOriginalToolboxState(null);
      return;
    }

    // B. Handle Cancel / Drop Nowhere
    if (!over) {
      if (originalToolboxState) {
        resetToolbox(originalToolboxState);

        // remmove from planner if came from there
        if (activeContainer && activeContainer !== "toolbox") {
          removeCourseFromSemester(
            activeContainer as string,
            active.id as string
          );
        }
      }
      setOriginalToolboxState(null);
      return;
    }

    // C. Handle Reorder within same container
    if (activeContainer && overContainerIsSame(activeContainer, over.id)) {
      const activeIndex = event.active.data.current?.sortable?.index;
      const overIndex = event.over?.data.current?.sortable?.index;

      if (activeIndex !== overIndex) {
        if (activeContainer === "toolbox") {
          moveCourseInToolbox(activeIndex, overIndex);
        } else {
          moveCourseInSemester(
            activeContainer as string,
            activeIndex,
            overIndex
          );
        }
      }
    }

    // D. Merge Logic (If dropped in Toolbox)
    if (activeContainer === "toolbox") {
      consolidateToolboxCourses();
    }

    // Clear snapshot after successful drop
    setOriginalToolboxState(null);
  };

  // Helper to check if overID belongs to the active container
  const overContainerIsSame = (
    activeContainer: UniqueIdentifier,
    overId: UniqueIdentifier
  ) => {
    // If we are over the container itself or an item inside it
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
