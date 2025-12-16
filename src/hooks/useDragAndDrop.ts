import { useState, useCallback, useRef } from "react";
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

// --- Helpers ---

const generateId = (baseName: string) =>
  `${baseName}-${Math.random().toString(36).substring(2, 9)}`;

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Generates the standard "Toolbox Name" (e.g., "CSCI-4500 Computer Graphics")
// This is our key for detecting duplicates.
const getCanonicalName = (course: UserCourse) => {
  return `${course.data.subj_code}-${course.data.code_num} ${toTitleCase(
    course.data.title
  )}`;
};

export const useDndLogic = () => {
  const {
    plannerCourses,
    setPlannerCourses,
    toolboxCourses,
    setToolboxCourses,
  } = useCourseWorkspace();

  const [activeItem, setActiveItem] = useState<UserCourse | null>(null);

  // Track state for drag-cancellation
  const [originalToolboxState, setOriginalToolboxState] = useState<
    UserCourse[] | null
  >(null);
  const [toolboxRemainderId, setToolboxRemainderId] = useState<string | null>(
    null
  );

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

  // --- Find Container Helper ---
  const findContainer = (
    id: UniqueIdentifier
  ): UniqueIdentifier | undefined => {
    if (toolboxCourses.find((c) => c.name === id)) return "toolbox";
    const semester = plannerCourses.find((sem) =>
      sem.courseList.find((c) => c.name === id)
    );
    if (semester) return semester.semesterID;
    return undefined;
  };

  // --- Collision Strategy ---
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      // Prioritize Toolbox if active item belongs there
      if (
        activeItem &&
        findContainer(activeItem.name) === "toolbox" &&
        args.droppableContainers.find((c) => c.id === "toolbox")
      ) {
        // This helps bias selection towards toolbox when dragging near it
      }

      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);

      let overId = getFirstCollision(intersections, "id");

      if (overId != null) {
        if (overId === "garbage") return intersections;
        if (overId === "toolbox") return intersections;

        const semester = plannerCourses.find((s) => s.semesterID === overId);
        if (semester) {
          const containerItems = semester.courseList.map((c) => c.name);
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
        lastOverId.current = activeItem?.name || null;
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeItem, plannerCourses, toolboxCourses]
  );

  // --- Handlers ---

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = active.data.current as UserCourse;
    setActiveItem(item);

    if (findContainer(active.id) === "toolbox") {
      setOriginalToolboxState([...toolboxCourses]);
    }

    document.body.classList.add("no-scroll-during-drag");
  };

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

      // Find the actual item data
      let itemToMove: UserCourse | undefined;
      if (activeContainer === "toolbox") {
        itemToMove = toolboxCourses.find((c) => c.name === active.id);
      } else {
        const sem = plannerCourses.find(
          (s) => s.semesterID === activeContainer
        );
        itemToMove = sem?.courseList.find((c) => c.name === active.id);
      }

      if (!itemToMove) return;

      // 1. Remove from Source
      if (activeContainer === "toolbox") {
        setToolboxCourses((prev) => {
          if (itemToMove!.count > 1) {
            // If moving a multiple-count item, leave a remainder behind
            const tempId = generateId(itemToMove!.name);
            setToolboxRemainderId(tempId);
            return prev.map((c) =>
              c.name === active.id
                ? { ...c, name: tempId, count: c.count - 1 }
                : c
            );
          }
          return prev.filter((c) => c.name !== active.id);
        });
      } else {
        setPlannerCourses((prev) =>
          prev.map((sem) => {
            if (sem.semesterID === activeContainer) {
              return {
                ...sem,
                courseList: sem.courseList.filter((c) => c.name !== active.id),
                creditsTotal: sem.creditsTotal - itemToMove!.data.credit_max,
              };
            }
            return sem;
          })
        );
      }

      // 2. Add to Destination
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
                const idx = nextList.findIndex((c) => c.name === overId);
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

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeContainer = findContainer(active.id);

    document.body.classList.remove("no-scroll-during-drag");
    setActiveItem(null);
    lastOverId.current = null;

    // 1. Handle Garbage
    if (over?.id === "garbage") {
      if (activeContainer === "toolbox") {
        setToolboxCourses((prev) => prev.filter((c) => c.name !== active.id));
      } else {
        setPlannerCourses((prev) =>
          prev.map((sem) => ({
            ...sem,
            courseList: sem.courseList.filter((c) => c.name !== active.id),
            // credits updated in onDragOver essentially, but safe to filter here
          }))
        );
      }
      // If we left a remainder, restore its ID so it matches the canonical name again
      if (toolboxRemainderId) {
        const originalName = active.id as string;
        setToolboxCourses((prev) =>
          prev.map((c) =>
            c.name === toolboxRemainderId ? { ...c, name: originalName } : c
          )
        );
        setToolboxRemainderId(null);
      }
      return;
    }

    // 2. Handle Reorder (Toolbox)
    if (
      activeContainer === "toolbox" &&
      over?.id &&
      findContainer(over.id) === "toolbox"
    ) {
      const activeIndex = event.active.data.current?.sortable?.index;
      const overIndex = event.over?.data.current?.sortable?.index;

      if (
        activeIndex !== undefined &&
        overIndex !== undefined &&
        activeIndex !== overIndex
      ) {
        setToolboxCourses((items) => arrayMove(items, activeIndex, overIndex));
      }
    }

    // If the item ended up in the toolbox, check for duplicates and merge them.
    if (activeContainer === "toolbox") {
      setToolboxCourses((prev) => {
        const uniqueMap = new Map<string, UserCourse>();

        // Iterate through all courses currently in the toolbox
        for (const course of prev) {
          const canonicalName = getCanonicalName(course);

          if (uniqueMap.has(canonicalName)) {
            // Found a duplicate! Merge counts.
            const existing = uniqueMap.get(canonicalName)!;
            existing.count += course.count;
          } else {
            // New entry. Ensure name is canonical (resets any temp IDs)
            uniqueMap.set(canonicalName, { ...course, name: canonicalName });
          }
        }
        return Array.from(uniqueMap.values());
      });

      // Clear remainder tracking since we just merged everything
      setToolboxRemainderId(null);
      setOriginalToolboxState(null);
      return;
    }

    // 4. Handle Planner Drop (Rename to unique ID)
    if (activeContainer && activeContainer !== "toolbox") {
      const originalName = active.id as string;
      // If it came from toolbox (or split), we give it a unique ID now
      if (toolboxRemainderId || originalToolboxState) {
        setPlannerCourses((prev) =>
          prev.map((sem) => {
            if (sem.semesterID === activeContainer) {
              return {
                ...sem,
                courseList: sem.courseList.map((c) => {
                  if (c.name === originalName) {
                    return { ...c, name: generateId(c.name.split(" ")[0]) };
                  }
                  return c;
                }),
              };
            }
            return sem;
          })
        );
      }

      // Fix remainder in toolbox if needed
      if (toolboxRemainderId) {
        const originalName = active.id as string;
        setToolboxCourses((prev) =>
          prev.map((c) =>
            c.name === toolboxRemainderId ? { ...c, name: originalName } : c
          )
        );
        setToolboxRemainderId(null);
      }
      setOriginalToolboxState(null);
    }

    // 5. Handle Cancel / Drop Nowhere
    if (!over) {
      if (originalToolboxState) {
        setToolboxCourses(originalToolboxState);
        setPlannerCourses((prev) =>
          prev.map((sem) => ({
            ...sem,
            courseList: sem.courseList.filter((c) => c.name !== active.id),
          }))
        );
      }
      setToolboxRemainderId(null);
      setOriginalToolboxState(null);
    }
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
