import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  UniqueIdentifier,
  CollisionDetection,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  closestCenter,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { useCourseWorkspace } from "./useCourseWorkspace";
import { UserCourse } from "../types/interfaces/Course.interface";

export const useDndLogic = () => {
  const {
    plannerCourses,
    setPlannerCourses,
    toolboxCourses,
    setToolboxCourses,
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
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- Helper: Find Container by Course ID ---
  const findContainer = (
    id: UniqueIdentifier
  ): UniqueIdentifier | undefined => {
    if (toolboxCourses.find((c) => c.id === id)) return "toolbox";

    const semester = plannerCourses.find((sem) =>
      sem.courseList.find((c) => c.id === id)
    );
    if (semester) return semester.semesterID;

    return undefined;
  };

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
    [activeItem, plannerCourses, toolboxCourses]
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

      // A. Remove from Source
      if (activeContainer === "toolbox") {
        setToolboxCourses((prev) => {
          // If count > 1: We "Take" the active item (ID 1) and "Leave" a new item (ID 2)
          // This keeps the dnd-kit active ID consistent with the cursor.
          if (itemToMove!.count > 1) {
            const remainder: UserCourse = {
              ...itemToMove!,
              id: uuidv4(), // NEW ID for the item staying behind
              count: itemToMove!.count - 1,
            };
            // Replace the moving item with the remainder
            return prev.map((c) => (c.id === active.id ? remainder : c));
          }
          // If count == 1, just remove it
          return prev.filter((c) => c.id !== active.id);
        });
      } else {
        // Remove from Semester
        setPlannerCourses((prev) =>
          prev.map((sem) => {
            if (sem.semesterID === activeContainer) {
              return {
                ...sem,
                courseList: sem.courseList.filter((c) => c.id !== active.id),
                creditsTotal: sem.creditsTotal - itemToMove!.data.credit_max,
              };
            }
            return sem;
          })
        );
      }

      // B. Add to Destination
      // Ensure the moved item has count 1 in its new home
      const itemWithSingleCount = { ...itemToMove!, count: 1 };

      if (overContainer === "toolbox") {
        setToolboxCourses((prev) => {
          const next = [...prev];
          const overIndex = over.data.current?.sortable?.index ?? next.length;
          next.splice(overIndex, 0, itemWithSingleCount);
          return next;
        });
      } else {
        setPlannerCourses((prev) =>
          prev.map((sem) => {
            if (sem.semesterID === overContainer) {
              const nextList = [...sem.courseList];
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

              nextList.splice(overIndex, 0, itemWithSingleCount);
              return {
                ...sem,
                courseList: nextList,
                creditsTotal:
                  sem.creditsTotal + itemWithSingleCount.data.credit_max,
              };
            }
            return sem;
          })
        );
      }

      recentlyMovedToNewContainer.current = true;
    },
    [plannerCourses, toolboxCourses, setPlannerCourses, setToolboxCourses]
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
        setToolboxCourses((prev) => prev.filter((c) => c.id !== active.id));
      } else {
        setPlannerCourses((prev) =>
          prev.map((sem) => ({
            ...sem,
            courseList: sem.courseList.filter((c) => c.id !== active.id),
            // Credits update handled in onDragOver, but this is a safe sync
            creditsTotal: sem.courseList
              .filter((c) => c.id !== active.id)
              .reduce((acc, c) => acc + c.data.credit_max, 0),
          }))
        );
      }
      setOriginalToolboxState(null);
      return;
    }

    // B. Handle Cancel / Drop Nowhere
    if (!over) {
      if (originalToolboxState) {
        setToolboxCourses(originalToolboxState);
        // Remove ghost from planner if it exists
        setPlannerCourses((prev) =>
          prev.map((sem) => ({
            ...sem,
            courseList: sem.courseList.filter((c) => c.id !== active.id),
            creditsTotal: sem.courseList
              .filter((c) => c.id !== active.id)
              .reduce((acc, c) => acc + c.data.credit_max, 0),
          }))
        );
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
          setToolboxCourses((items) =>
            arrayMove(items, activeIndex, overIndex)
          );
        } else {
          setPlannerCourses((prev) =>
            prev.map((sem) =>
              sem.semesterID === activeContainer
                ? {
                    ...sem,
                    courseList: arrayMove(
                      sem.courseList,
                      activeIndex,
                      overIndex
                    ),
                  }
                : sem
            )
          );
        }
      }
    }

    // D. Merge Logic (If dropped in Toolbox)
    // We group by Content (Subj + Code) to merge duplicates
    if (activeContainer === "toolbox") {
      setToolboxCourses((prev) => {
        const uniqueMap = new Map<string, UserCourse>();

        for (const course of prev) {
          if (uniqueMap.has(course.name)) {
            const existing = uniqueMap.get(course.name)!;
            // Merge counts
            existing.count += course.count;
          } else {
            // New entry
            uniqueMap.set(course.name, { ...course });
          }
        }
        return Array.from(uniqueMap.values());
      });
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
