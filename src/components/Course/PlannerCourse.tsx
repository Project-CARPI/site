import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { MdDragIndicator, MdOutlineMoreHoriz } from "react-icons/md";
import { APICourse } from "../../types/interfaces/Course.interface";
import { SemesterType } from "../../types/interfaces/Semester.interface";
import { UserCourse } from "../../types/interfaces/Course.interface";
import * as RightClickContextMenu from "@radix-ui/react-context-menu";
import { usePlannerCourse } from "../../hooks/usePlannerCourseOptions";
import PlannerOptionsPopup from "../PlannerComponents/PlannerOptionsPopup";

interface PlannerCourseProps {
  course: APICourse;
  isDragging?: boolean;
  index: number;
  setPlannerCourses: Dispatch<SetStateAction<SemesterType[]>>;
  setToolboxCourses: Dispatch<SetStateAction<UserCourse[]>>;
  semesterIndex: number;
  count: number;
}

const PlannerCourse: React.FC<PlannerCourseProps> = ({
  course,
  count,
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

  const handleSelect = (action: () => void) => {
    action();
    setOpenPopup(false);
  };

  const {
    handleDuplicate,
    handleMoveNext,
    handleMoveToolbox,
    handleDelete,
    toTitleCase,
  } = usePlannerCourse({
    setPlannerCourses: setPlannerCourses,
    setToolboxCourses: setToolboxCourses,
    semesterIndex: semesterIndex,
    courseIndex: index,
    course: course,
    name: course.title,
    count: count,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setOpenPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* Right-Click Context Menu */
  return (
    <RightClickContextMenu.Root>
      <RightClickContextMenu.Trigger>
        <div
          ref={componentRef}
          className="relative flex justify-between bg-[#283044] rounded-2xl text-[#F5CECE] gap-4 px-2 py-3"
        >
          <div className={`flex gap-2 items-center`}>
            <MdDragIndicator className="text-2xl" />
            <div className={`text-sm`}>
              <b>
                {course.subj_code}-{course.code_num}
              </b>
              <i>
                {course.credit_min !== course.credit_max ? (
                  <span className="ml-2 text-gray-500">
                    {course.credit_min}–{course.credit_max} credits
                  </span>
                ) : (
                  <span className="ml-2 text-gray-500">
                    {course.credit_max} credits
                  </span>
                )}
              </i>

              <p>{toTitleCase(course.title)}</p>
            </div>
          </div>

          <div className={`flex gap-1 items-center`}>
            {/* <div
              className={`rounded-full bg-[#F5CECE] text-[#283044] w-5 h-5 flex items-center justify-center text-sm`}
            >
              <p>{course.credit_max}</p>
            </div> */}
            <MdOutlineMoreHoriz
              onClick={togglePopup}
              className="cursor-pointer text-2xl"
            />
          </div>

          {openPopup && (
            <PlannerOptionsPopup
              handleSelect={handleSelect}
              handleDuplicate={handleDuplicate}
              handleMoveNext={handleMoveNext}
              handleMoveToolbox={handleMoveToolbox}
              handleDelete={handleDelete}
            />
          )}
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
