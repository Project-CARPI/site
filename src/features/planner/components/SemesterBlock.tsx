import React, { useState, useRef, useEffect } from "react";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MdDragIndicator, MdEdit } from "react-icons/md";

import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import { SortableItem } from "@/features/dnd/components/SortableItem";
import CourseDropzone from "@/features/planner/components/CourseDropzone";
import PlannerCourse from "@/features/planner/components/PlannerCourse";
import { SemesterType, SemesterSeason } from "@/features/planner/interfaces";
import { cn } from "@/lib/classnames";

const seasons: SemesterSeason[] = ["Fall", "Spring", "Summer"];

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

  const { updateSemesterName, updateSemesterSeason, deleteSemester } =
    useCourseWorkspace();
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

  // handle season dropdown
  const seasonDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeason = e.target.value as SemesterSeason;
    updateSemesterSeason(semester.semesterID, newSeason);
  };

  const handleDeleteSemester = (semesterId: string) => {
    deleteSemester(semesterId);
  };

  const finishEditing = () => setIsEditing(false);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") finishEditing();
  };

  return (
    <div
      className={cn(
        "flex flex-grow flex-col space-y-2 p-4 rounded-2xl h-full",
        "bg-[color-mix(in_oklab,var(--color-darkblue)_10%,var(--color-carpipink)_90%)]",
        {
          "border-2 border-rosewood": over_limit || hasDuplicateCourses,
        },
      )}
    >
      <div className="flex justify-between items-center mb-1 h-8">
        <div
          className={cn(
            "hover:bg-darkblue/20 py-2 px-1 rounded-lg",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          <MdDragIndicator className="text-xl" />
        </div>

        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={semester.semesterTitle}
            onChange={handleTitleChange}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
            className="text-md font-bold bg-transparent border-b border-black focus:outline-none w-1/2 placeholder:opacity-60"
            placeholder={`Semester ${semester.semesterNumber}`}
          />
        ) : (
          <div className="flex items-center gap-2 w-1/2">
            <span
              className="text-md font-bold truncate cursor-text hover:underline decoration-dotted underline-offset-4"
              onClick={() => setIsEditing(true)}
              title="Click to rename"
            >
              {semester.semesterTitle || `Semester ${semester.semesterNumber}`}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-black transition-colors"
              title="Edit Semester Name"
            >
              <MdEdit size={18} />
            </button>
          </div>
        )}

        <div className="flex space-x-2 items-center">
          <select
            value={semester.season}
            onChange={seasonDropdown}
            className="border-1 border-black rounded-full px-2 py-0 h-fit w-fit min-w-0 font-medium text-sm"
          >
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>

          <div className="">{semester.creditsTotal} credits</div>
        </div>
      </div>

      {over_limit && (
        <div className="text-darkblue text-sm bg-rosewood/20 rounded-2xl p-4 text-center">
          You are over the maximum credit limit of{" "}
          {over_hard_limit ? CREDIT_LIMIT : CREDIT_LIMIT_WITHOUT_APPROVAL}{" "}
          credits! <b>Check with your advisor before proceeding.</b>
        </div>
      )}

      {hasDuplicateCourses && (
        <div className="text-darkblue text-sm bg-rosewood/20 rounded-2xl p-4 text-center">
          There are duplicate courses in this semester!
        </div>
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
                type="Course"
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

      <div className="flex justify-end">
        <button
          onClick={() => handleDeleteSemester(semester.semesterID)}
          className="border border-black rounded-full px-3 py-0 h-fit font-medium text-sm hover:cursor-pointer hover:bg-darkblue hover:text-carpipink transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
