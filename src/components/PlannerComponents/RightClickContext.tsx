import React, { Dispatch, SetStateAction } from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { MdDragIndicator } from "react-icons/md";
import { CourseType } from "../../types/interfaces/Course.interface";
import { SemesterType } from "../../types/interfaces/Semester.interface";
import { CourseEntry } from "../../types/interfaces/Course.interface";

interface PlannerCourseProps {
  course: CourseType;
  isDragging: boolean;
  index: number;
  setPlannerCourses: Dispatch<SetStateAction<SemesterType[]>>;
  setToolboxCourses: Dispatch<SetStateAction<CourseEntry[]>>;
  semesterIndex: number;
}

const PlannerCourse: React.FC<PlannerCourseProps> = ({
  course,
  index,
  setPlannerCourses,
  setToolboxCourses,
  semesterIndex,
}) => {
  // ====== Course Actions (same as before) ======
  const handleDuplicate = () => {
    setPlannerCourses((prev) =>
      prev.map((semester, i) =>
        i === semesterIndex - 1
          ? {
              ...semester,
              creditsTotal:
                semester.creditsTotal +
                semester.courseList[index].data.credit_max,
              courseList: [
                ...semester.courseList.slice(0, index + 1),
                {
                  name: getNextName(semester.courseList[index].name),
                  count: semester.courseList[index].count,
                  data: semester.courseList[index].data,
                },
                ...semester.courseList.slice(index + 1),
              ],
            }
          : semester,
      ),
    );
  };

  const getNextName = (originalName: string): string => {
    const [base, tag] = originalName.split("-");
    if (!tag) return `${base}-A`;
    return `${base}-${incrementTag(tag)}`;
  };

  const incrementTag = (tag: string): string => {
    const chars = tag.toUpperCase().split("");
    let carry = true;
    for (let i = chars.length - 1; i >= 0 && carry; i--) {
      if (chars[i] === "Z") chars[i] = "A";
      else {
        chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
        carry = false;
      }
    }
    if (carry) chars.unshift("A");
    return chars.join("");
  };

  const handleMoveNext = () => {
    setPlannerCourses((prev) => {
      const courseCopy = prev[semesterIndex - 1].courseList[index];
      const updated = prev.map((s, i) =>
        i === semesterIndex - 1
          ? {
              ...s,
              courseList: s.courseList.filter((_, idx) => idx !== index),
              creditsTotal: s.creditsTotal - courseCopy.data.credit_max,
            }
          : s,
      );
      return updated.map((s, i) =>
        i === semesterIndex
          ? {
              ...s,
              courseList: [...s.courseList, courseCopy],
              creditsTotal: s.creditsTotal + courseCopy.data.credit_max,
            }
          : s,
      );
    });
  };

  const handleMoveToolbox = () => {
    setPlannerCourses((prev) => {
      const courseToMove = prev[semesterIndex - 1].courseList[index];
      const cleanedName = courseToMove.name.split("-")[0];
      const cleanedCourse = { ...courseToMove, name: cleanedName };

      const updated = prev.map((s, i) =>
        i === semesterIndex - 1
          ? {
              ...s,
              courseList: s.courseList.filter((_, idx) => idx !== index),
              creditsTotal: s.creditsTotal - courseToMove.data.credit_max,
            }
          : s,
      );

      setToolboxCourses((toolboxPrev) => {
        const existingIndex = toolboxPrev.findIndex(
          (entry) => entry.name === cleanedName,
        );
        if (existingIndex !== -1) {
          const updatedToolbox = [...toolboxPrev];
          updatedToolbox[existingIndex].count += cleanedCourse.count;
          return updatedToolbox;
        }
        return [...toolboxPrev, cleanedCourse];
      });

      return updated;
    });
  };

  const handleDelete = () => {
    setPlannerCourses((prev) =>
      prev.map((s, i) =>
        i === semesterIndex - 1
          ? {
              ...s,
              courseList: s.courseList.filter((_, idx) => idx !== index),
              creditsTotal:
                s.creditsTotal - s.courseList[index].data.credit_max,
            }
          : s,
      ),
    );
  };

  const toTitleCase = (str: string) =>
    str
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // ====== UI with Radix ContextMenu ======
  return (
    <ContextMenu.Root>
      {/* Right-click Target */}
      <ContextMenu.Trigger asChild>
        <div className="flex flex-row relative cursor-context-menu">
          <div className="bg-[#283044] w-full h-18 rounded-lg text-[#F5CECE] flex items-center px-2">
            <div className="flex justify-between w-11/12 m-auto text-2xl">
              <div className="flex items-center">
                <MdDragIndicator />
                <div className="text-sm ml-1">
                  <b>
                    {course.dept}
                    {course.code_num}
                  </b>
                  <p>{toTitleCase(course.title)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-[#F5CECE] text-[#283044] w-5 h-5 flex items-center justify-center text-sm mr-1 font-medium">
                <p>{course.credit_max}</p>
              </div>
              {/* 👈 No more three dots! */}
            </div>
          </div>
        </div>
      </ContextMenu.Trigger>

      {/* Context Menu Content */}
      <ContextMenu.Portal>
        <ContextMenu.Content
          className="min-w-[180px] rounded-md bg-white p-1 shadow-md text-[#283044] text-sm"
          sideOffset={5}
        >
          <ContextMenu.Item
            onSelect={handleDuplicate}
            className="px-3 py-1 rounded hover:bg-gray-200 cursor-pointer"
          >
            Duplicate
          </ContextMenu.Item>
          <ContextMenu.Item
            onSelect={handleMoveNext}
            className="px-3 py-1 rounded hover:bg-gray-200 cursor-pointer"
          >
            Move to next semester
          </ContextMenu.Item>
          <ContextMenu.Separator className="my-1 h-px bg-gray-300" />
          <ContextMenu.Item
            onSelect={handleMoveToolbox}
            className="px-3 py-1 rounded hover:bg-gray-200 cursor-pointer"
          >
            Back to toolbox
          </ContextMenu.Item>
          <ContextMenu.Item
            onSelect={handleDelete}
            className="px-3 py-1 rounded hover:bg-red-200 text-red-600 cursor-pointer"
          >
            Delete
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export default PlannerCourse;
