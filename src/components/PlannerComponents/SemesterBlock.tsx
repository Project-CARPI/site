import React, { useState, useRef, useEffect } from "react";

import {
  SemesterSeason,
  SemesterType,
} from "../../types/interfaces/Semester.interface";
import { Droppable } from "@hello-pangea/dnd";
import PlannerCourseHolder from "./PlannerCourseHolder";
import DraggableItem from "../DraggableItem";
import { useCourseWorkspace } from "../../hooks/useCourseWorkspace";
import DeleteSemester from "../PlannerComponents/DeleteSemester";
import { MdEdit } from "react-icons/md";

const seasons: SemesterSeason[] = ["Fall", "Spring", "Summer"];

export interface SemesterBlockProps {
  index: number;
  semester: SemesterType;
}

const SemesterBlock: React.FC<SemesterBlockProps> = ({ index, semester }) => {
  const { setPlannerCourses } = useCourseWorkspace();
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
        (c) => c.data.title === course.data.title
      ) !== index
    );
  });
  // customizable semester title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlannerCourses((prev) =>
      prev.map((sem) =>
        sem.semesterID === semester.semesterID
          ? { ...sem, semesterTitle: e.target.value }
          : sem
      )
    );
  };
  // handle season dropdown
  const seasonDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeason = e.target.value as SemesterSeason;
    setPlannerCourses((prevCourses) =>
      prevCourses.map((sem) =>
        sem.semesterID === semester.semesterID
          ? { ...sem, season: newSeason }
          : sem
      )
    );
  };

  const handleDeleteSemester = (semesterNumber: number) => {
    setPlannerCourses((prev) =>
      prev
        .filter((s) => s.semesterNumber !== semesterNumber)
        .map((s, idx) => ({ ...s, semesterNumber: idx + 1 }))
    );
  };

  const finishEditing = () => setIsEditing(false);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") finishEditing();
  };

  const defaultTitle = `Semester ${semester.semesterNumber}`;
  const isPlaceholder =
    !semester.semesterTitle || semester.semesterTitle === defaultTitle;

  return (
    <div
      className={`flex flex-grow flex-col space-y-2 bg-darkblue/10 p-4 rounded-2xl h-full ${
        over_limit || hasDuplicateCourses ? "border-2 border-rosewood" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-1 h-8">
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
              className={`text-md font-bold truncate cursor-pointer hover:underline decoration-dotted underline-offset-4 ${
                isPlaceholder ? "opacity-60 italic" : ""
              }`}
              onClick={() => setIsEditing(true)}
              title="Click to rename"
            >
              {semester.semesterTitle || defaultTitle}
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

      <Droppable droppableId={`planner-${index + 1}`} direction="vertical">
        {(provided, snapshot) => {
          const isEmpty = semester.courseList.length === 0;
          const isHovering = snapshot.isDraggingOver;

          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col space-y-2 h-full"
            >
              {isEmpty && !isHovering && (
                <PlannerCourseHolder isHover={false} />
              )}
              {isEmpty && isHovering && <PlannerCourseHolder isHover={true} />}
              {!isEmpty && (
                <>
                  {semester.courseList.map((course, courseIndex) => (
                    <DraggableItem
                      key={course.name}
                      name={course.name}
                      course={course.data}
                      count={course.count}
                      index={courseIndex}
                      semesterIndex={index + 1}
                      location="planner"
                    />
                  ))}
                  {provided.placeholder}
                </>
              )}
            </div>
          );
        }}
      </Droppable>

      <DeleteSemester
        semesterNumber={semester.semesterNumber}
        onDelete={handleDeleteSemester}
      />
    </div>
  );
};

export default SemesterBlock;
