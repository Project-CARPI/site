import React, { useState, useRef, useEffect } from "react";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { MdDragIndicator, MdDeleteOutline, MdExpandMore } from "react-icons/md";

import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import { SortableItem } from "@/features/dnd/components/SortableItem";
import { useSortableItem } from "@/features/dnd/useSortableItem";
import CourseDropzone from "@/features/planner/components/CourseDropzone";
import PlannerCourse from "@/features/planner/components/PlannerCourse";
import SeasonSelector from "@/features/planner/components/SeasonSelector";
import { cn } from "@/lib/classnames";
import { SemesterType } from "@/lib/types";

export interface SemesterBlockProps {
  semester: SemesterType;
  isDragging?: boolean;
}

export default function SemesterBlock({
  semester,
  isDragging,
}: SemesterBlockProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: semester.semesterID,
  });
  const { listeners, attributes } = useSortableItem();

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const isMediumOrSmaller = window.matchMedia("(max-width: 768px)").matches;
    setIsCollapsed(isMediumOrSmaller);
  }, [isDragging]);

  const { updateSemesterName, deleteSemester } = useCourseWorkspace();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // check for credit limits
  const CREDIT_LIMIT_WITHOUT_APPROVAL = 21;
  const CREDIT_LIMIT = 23;
  const over_limit = semester.creditsTotal > CREDIT_LIMIT_WITHOUT_APPROVAL;
  const over_hard_limit = semester.creditsTotal > CREDIT_LIMIT;

  // check for duplicate courses
  const hasDuplicateCourses = semester.courseList.some((course, index) => {
    return (
      semester.courseList.findIndex(
        (c) => c.data.title === course.data.title,
      ) !== index
    );
  });

  // customizable semester title
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

  return (
    <motion.div
      layout
      className={cn(
        "flex flex-col rounded-2xl w-full max-w-full relative group",
        "bg-[color-mix(in_oklab,var(--color-darkblue)_10%,var(--color-carpipink)_90%)]",
        isCollapsed ? "p-3 h-auto" : "p-4 h-full",
        { "border-2 border-rosewood": over_limit },
      )}
    >
      <motion.div
        layout
        className={cn("flex flex-col gap-1 w-full", !isCollapsed && "mb-3")}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className={cn(
                "hover:bg-darkblue/20 py-1.5 px-0.75 rounded-lg flex-shrink-0 ",
                isDragging
                  ? "cursor-grabbing"
                  : "cursor-grab active:cursor-grabbing",
              )}
              {...listeners}
              {...attributes}
            >
              <MdDragIndicator size={22} />
            </div>

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
                className="font-bold text-md truncate cursor-text hover:text-darkblue/70 transition-colors w-full"
              >
                {semester.semesterTitle ||
                  `Semester ${semester.semesterNumber}`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <div className="relative group/delete-btn flex flex-col items-center">
              <button
                onClick={() => handleDeleteSemester(semester.semesterID)}
                className="text-darkblue/40 hover:text-rosewood transition-colors p-1 hover:bg-rosewood/10 rounded-lg hover:cursor-pointer"
                aria-label="Delete Semester"
              >
                <MdDeleteOutline size={22} />
              </button>

              {/* Tooltip */}
              <div className="absolute -bottom-7 z-50 hidden group-hover/delete-btn:flex flex-col items-center">
                <div className="w-2 h-2 bg-darkblue rotate-45"></div>
                <div className="bg-darkblue text-carpipink text-tiny py-0.5 px-2 -mt-1 rounded-full whitespace-nowrap">
                  Delete
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="lg:hidden text-darkblue/50 hover:text-darkblue transition-colors p-1 hover:bg-darkblue/10 rounded-lg hover:cursor-pointer"
              title={isCollapsed ? "Expand Semester" : "Collapse Semester"}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? -90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <MdExpandMore size={22} />
              </motion.div>
            </button>
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
      </motion.div>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key="course-list"
            className="overflow-hidden space-y-2 flex-1"
          >
            {over_limit && (
              <motion.div
                layout
                className="text-darkblue text-sm bg-rosewood/20 rounded-2xl p-4 text-center"
              >
                You are over the maximum credit limit of{" "}
                {over_hard_limit ? CREDIT_LIMIT : CREDIT_LIMIT_WITHOUT_APPROVAL}{" "}
                credits! <b>Check with your advisor before proceeding.</b>
              </motion.div>
            )}

            {hasDuplicateCourses && (
              <motion.div
                layout
                className="text-darkblue text-sm bg-rosewood/20 rounded-2xl p-4 text-center"
              >
                There are duplicate courses in this semester!
              </motion.div>
            )}

            <div ref={setNodeRef} className="flex flex-col gap-2 h-full">
              <SortableContext
                items={semester.courseList.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {semester.courseList.length === 0 ? (
                  <CourseDropzone isHover={isOver} />
                ) : (
                  semester.courseList.map((course) => (
                    <SortableItem
                      key={course.id}
                      id={course.id}
                      data={course}
                      type="course"
                    >
                      <PlannerCourse
                        course={course}
                        semesterId={semester.semesterID}
                      />
                    </SortableItem>
                  ))
                )}
              </SortableContext>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
