import React from "react";

import {
  SemesterSeason,
  SemesterType,
} from "../../types/interfaces/Semester.interface";
import { Droppable } from "@hello-pangea/dnd";
import PlannerCourseHolder from "./PlannerCourseHolder";
import DraggableItem from "../DraggableItem";
import { useCourseWorkspace } from "../../hooks/useCourseWorkspace";
import DeleteSemester from "../PlannerComponents/DeleteSemester";

const seasons: SemesterSeason[] = ["Fall", "Spring", "Summer"];

export interface SemesterBlockProps {
  index: number;
  semester: SemesterType;
}

const SemesterBlock: React.FC<SemesterBlockProps> = ({ index, semester }) => {
  const { setPlannerCourses } = useCourseWorkspace();

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

  const seasonDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeason = e.target.value as SemesterSeason;
    setPlannerCourses((prevCourses) =>
      prevCourses.map((sem) =>
        sem.semesterID === semester.semesterID
          ? { ...sem, season: newSeason }
          : sem,
      ),
    );
  };

  const handleDeleteSemester = (semesterNumber: number) => {
    setPlannerCourses((prev) =>
      prev
        .filter((s) => s.semesterNumber !== semesterNumber)
        .map((s, idx) => ({ ...s, semesterNumber: idx + 1 })),
    );
  };

  return (
    <div
      className={`flex flex-grow flex-col space-y-2 bg-darkblue/10 p-4 rounded-2xl h-full ${
        over_limit || hasDuplicateCourses ? "border-2 border-rosewood" : ""
      }`}
    >
      <div className="flex justify-between">
        <span className="text-md font-bold">
          Semester {semester.semesterNumber}
        </span>

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
