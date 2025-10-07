import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { MdDragIndicator, MdOutlineMoreHoriz } from "react-icons/md";
import { CourseType } from "../../types/interfaces/Course.interface";
import { SemesterType } from "../../types/interfaces/Semester.interface";
import { CourseEntry } from "../../types/interfaces/Course.interface";
import * as RightClickContextMenu from "@radix-ui/react-context-menu";

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
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const togglePopup = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenPopup((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      componentRef.current &&
      event.target instanceof Node &&
      !componentRef.current.contains(event.target)
    ) {
      setOpenPopup(false);
    }
  };

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

    if (!tag) {
      return `${base}-A`;
    }

    const nextTag = incrementTag(tag);
    return `${base}-${nextTag}`;
  };

  const incrementTag = (tag: string): string => {
    const chars = tag.toUpperCase().split("");
    let carry = true;

    for (let i = chars.length - 1; i >= 0 && carry; i--) {
      if (chars[i] === "Z") {
        chars[i] = "A";
      } else {
        chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
        carry = false;
      }
    }

    if (carry) {
      chars.unshift("A");
    }

    return chars.join("");
  };

  const handleMoveNext = () => {
    setPlannerCourses((prev) => {
      const courseCopy = {
        name: prev[semesterIndex - 1].courseList[index].name,
        count: prev[semesterIndex - 1].courseList[index].count,
        data: prev[semesterIndex - 1].courseList[index].data,
      };

      const updatedPlanner = prev.map((semester, i) =>
        i === semesterIndex - 1
          ? {
              ...semester,
              courseList: semester.courseList.filter((_, idx) => idx !== index),
              creditsTotal:
                semester.creditsTotal -
                prev[semesterIndex - 1].courseList[index].data.credit_max,
            }
          : semester,
      );

      return updatedPlanner.map((semester, i) =>
        i === semesterIndex
          ? {
              ...semester,
              courseList: [...semester.courseList, courseCopy],
              creditsTotal: semester.creditsTotal + courseCopy.data.credit_max,
            }
          : semester,
      );
    });
  };

  const handleMoveToolbox = () => {
    setPlannerCourses((prev) => {
      const courseToMove = prev[semesterIndex - 1].courseList[index];

      const cleanedName = courseToMove.name.split("-")[0];

      const cleanedCourse = {
        ...courseToMove,
        name: cleanedName,
      };

      const updatedPlanner = prev.map((semester, i) =>
        i === semesterIndex - 1
          ? {
              ...semester,
              courseList: semester.courseList.filter((_, idx) => idx !== index),
              creditsTotal:
                semester.creditsTotal - courseToMove.data.credit_max,
            }
          : semester,
      );

      setToolboxCourses((toolboxPrev) => {
        const existingIndex = toolboxPrev.findIndex(
          (entry) => entry.name === cleanedName,
        );

        if (existingIndex !== -1) {
          const updated = [...toolboxPrev];
          updated[existingIndex].count += cleanedCourse.count;
          return updated;
        } else {
          return [...toolboxPrev, cleanedCourse];
        }
      });

      return updatedPlanner;
    });
  };

  const handleDelete = () => {
    setPlannerCourses((prev) =>
      prev.map((semester, i) =>
        i === semesterIndex - 1
          ? {
              ...semester,
              courseList: semester.courseList.filter((_, idx) => idx !== index),
              creditsTotal:
                semester.creditsTotal -
                semester.courseList[index].data.credit_max,
            }
          : semester,
      ),
    );
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  /* Right-Click Context Menu */
  return (
    <RightClickContextMenu.Root>
      <RightClickContextMenu.Trigger asChild>
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
            </div>
          </div>
        </div>
      </RightClickContextMenu.Trigger>

      <RightClickContextMenu.Portal>
        <RightClickContextMenu.Content className="bg-[#F5CECE] rounded-xl border border-slate-500 text-[#283044] text-xs p-2 shadow-lg z-50">
          <RightClickContextMenu.Item
            className="hover:bg-gray-300 p-1 rounded w-full text-left"
            onSelect={handleDuplicate}
          >
            Duplicate
          </RightClickContextMenu.Item>
          <RightClickContextMenu.Item
            className="hover:bg-gray-300 p-1 rounded w-full text-left"
            onSelect={handleMoveNext}
          >
            Move to next sem
          </RightClickContextMenu.Item>
          <RightClickContextMenu.Separator className="h-px bg-gray-400 my-1" />
          <RightClickContextMenu.Item
            className="hover:bg-gray-300 p-1 rounded w-full text-left"
            onSelect={handleMoveToolbox}
          >
            Move back to toolbox
          </RightClickContextMenu.Item>
          <RightClickContextMenu.Item
            className="hover:bg-red-300 p-1 rounded w-full text-left"
            onSelect={handleDelete}
          >
            Delete
          </RightClickContextMenu.Item>
        </RightClickContextMenu.Content>
      </RightClickContextMenu.Portal>
    </RightClickContextMenu.Root>
  );
};

export default PlannerCourse;
