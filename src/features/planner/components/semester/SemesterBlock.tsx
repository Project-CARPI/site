import React, { useState, useRef, useEffect } from "react";

import { CollisionPriority } from "@dnd-kit/abstract";
import { closestCenter } from "@dnd-kit/collision";
import { useDroppable, useDragOperation } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { AnimatePresence } from "framer-motion";
import { MdDragIndicator, MdDeleteOutline } from "react-icons/md";

import Course from "@/components/course/Course";
import ErrorBanner from "@/components/ErrorBanner";
import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import CourseDropzone from "@/features/planner/components/semester/CourseDropzone";
import SeasonSelector from "@/features/planner/components/semester/SeasonSelector";
import { usePlannerLayoutStore } from "@/features/planner/PlannerLayoutStore";
import { cn } from "@/lib/classnames";
import { SemesterType } from "@/lib/types";

export type SemesterBlockProps = {
  semester: SemesterType;
  index: number;
};

export default function SemesterBlock({ semester, index }: SemesterBlockProps) {
  // --- SORTABLE: For dragging the Semester block itself ---
  const {
    handleRef,
    ref: sortableRef,
    isDragging,
  } = useSortable({
    id: semester.semesterID,
    index,
    accept: ["semester"],
    type: "semester",
    feedback: "clone",
    data: { type: "semester", semesterId: semester.semesterID },
    collisionPriority: CollisionPriority.Low,
    collisionDetector: closestCenter,
  });

  const dragOperation = useDragOperation();
  const isDraggingCatalog =
    dragOperation?.source?.data?.type === "catalog-course";

  // --- DROPPABLE: For receiving Courses inside the Semester ---
  const { ref: droppableRef, isDropTarget } = useDroppable({
    id: `dropzone-${semester.semesterID}`,
    accept: ["planner-course", "toolbox-course", "catalog-course"], // Accept courses
    data: { type: "semester", semesterId: semester.semesterID },
  });

  // Layout state
  const { allExpanded, expandedSemesters } = usePlannerLayoutStore();
  const isOpen = expandedSemesters[semester.semesterID] ?? allExpanded;

  /* SEMESTER CONTROLS */
  const { updateSemesterName, deleteSemester } = useCourseWorkspace();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSemesterName(semester.semesterID, e.target.value);
  };

  const handleDeleteSemester = (semesterId: string) => {
    deleteSemester(semesterId);
  };

  const finishEditing = () => setIsEditing(false);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") finishEditing();
  };

  /* VALIDATION LOGIC */
  const CREDIT_LIMIT_WITHOUT_APPROVAL = 21;
  const CREDIT_LIMIT = 23;
  const over_limit = semester.creditsTotal > CREDIT_LIMIT_WITHOUT_APPROVAL;
  const over_hard_limit = semester.creditsTotal > CREDIT_LIMIT;

  const hasDuplicateCourses = semester.courseList.some((course, index) => {
    return (
      semester.courseList.findIndex(
        (c) =>
          c.data.subj_code === course.data.subj_code &&
          c.data.code_num === course.data.code_num,
      ) !== index
    );
  });

  return (
    <div
      ref={sortableRef}
      className={cn(
        "flex flex-col rounded-2xl w-full max-w-full relative group",
        "bg-[color-mix(in_oklab,var(--color-darkblue)_10%,var(--color-carpipink)_90%)]",
        !isOpen ? "p-3 h-auto" : "p-4 h-full",
        { "border-2 border-rosewood": over_limit },
      )}
    >
      <div className={cn("flex flex-col gap-1 w-full", isOpen && "mb-3")}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              ref={handleRef}
              type="button"
              aria-label="Drag to reorder semester"
              className={cn(
                "hover:bg-darkblue/20 py-1.5 px-0.75 rounded-lg shrink-0 ",
                isDragging
                  ? "cursor-grabbing"
                  : "cursor-grab active:cursor-grabbing",
              )}
            >
              <MdDragIndicator size={22} />
            </button>

            {isEditing ? (
              <input
                ref={inputRef}
                value={semester.semesterTitle}
                onChange={handleTitleChange}
                onBlur={finishEditing}
                onKeyDown={handleKeyDown}
                className="font-bold text-md bg-transparent border-b border-darkblue/20 w-full min-w-0 focus:outline-none"
                placeholder={`Semester ${semester.semesterNumber}`}
              />
            ) : (
              <span
                onClick={() => setIsEditing(true)}
                className="font-bold text-md truncate cursor-text hover:text-darkblue/70 transition-colors w-full block min-w-0"
              >
                {semester.semesterTitle ||
                  `Semester ${semester.semesterNumber}`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <div className="relative group/delete-btn flex flex-col items-center">
              <button
                type="button"
                onClick={() => handleDeleteSemester(semester.semesterID)}
                className="text-darkblue/40 hover:text-rosewood transition-colors p-1 hover:bg-rosewood/10 rounded-lg hover:cursor-pointer"
                aria-label="Delete Semester"
              >
                <MdDeleteOutline size={22} />
              </button>

              <div className="absolute -bottom-7 z-50 hidden group-hover/delete-btn:flex flex-col items-center">
                <div className="w-2 h-2 bg-darkblue rotate-45"></div>
                <div className="bg-darkblue text-carpipink text-tiny py-0.5 px-2 -mt-1 rounded-full whitespace-nowrap">
                  Delete
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-7 text-sm">
          <div className="scale-90 origin-left">
            <SeasonSelector
              season={semester.season}
              semesterID={semester.semesterID}
            />
          </div>

          <div
            className={cn(
              "px-3 py-1 rounded-full font-medium text-xs",
              over_limit
                ? "bg-rosewood text-white"
                : "bg-darkblue/10 text-darkblue",
            )}
          >
            {semester.creditsTotal} Credits
          </div>
        </div>
      </div>

      <AnimatePresence initial={isOpen}>
        {isOpen && (
          <div className="overflow-hidden space-y-2 flex-1">
            {over_limit && (
              <ErrorBanner>
                You are over the maximum credit limit of{" "}
                {over_hard_limit ? CREDIT_LIMIT : CREDIT_LIMIT_WITHOUT_APPROVAL}{" "}
                credits! <b>Check with your advisor before proceeding.</b>
              </ErrorBanner>
            )}

            {hasDuplicateCourses && (
              <ErrorBanner>
                There are duplicate courses in this semester!
              </ErrorBanner>
            )}

            <div
              ref={droppableRef}
              className={cn(
                "flex flex-col gap-2 h-full min-h-15 rounded-xl transition-colors",
                isDropTarget && !isDraggingCatalog && "bg-black/5",
              )}
            >
              {semester.courseList.length === 0 ? (
                <CourseDropzone isHover={isDropTarget} />
              ) : (
                semester.courseList.map((course, index) => (
                  <Course
                    variant="planner"
                    key={course.id}
                    id={course.id}
                    index={index}
                    group={semester.semesterID}
                    course={course}
                    semesterId={semester.semesterID}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
