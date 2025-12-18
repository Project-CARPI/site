import React, { useState, useEffect, useRef, useMemo } from "react";
import { MdDragIndicator, MdOutlineMoreHoriz } from "react-icons/md";
import { UserCourse } from "../../types/interfaces/Course.interface";
import * as RightClickContextMenu from "@radix-ui/react-context-menu";
import { usePlannerCourse } from "../../hooks/usePlannerCourseOptions";
import PlannerOptionsPopup, { MenuOption } from "./PlannerCourseOptionsPopup";

interface PlannerCourseProps {
  course: UserCourse;
  semesterId: string | null;
  isFirstSemester?: boolean;
  isLastSemester?: boolean;
}

const PlannerCourse: React.FC<PlannerCourseProps> = ({
  course,
  semesterId,
  isFirstSemester = false,
  isLastSemester = false,
}) => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const {
    handleDuplicate,
    handleMoveNext,
    handleMovePrev,
    handleMoveToolbox,
    handleDelete,
    toTitleCase,
  } = usePlannerCourse({
    course: course,
    semesterId: semesterId,
  });

  // --- 1. DEFINE YOUR MENU CONFIGURATION HERE ---
  // Using useMemo prevents it from being recreated on every render
  const menuOptions: MenuOption[] = useMemo(
    () => [
      { label: "Duplicate", action: handleDuplicate },
      {
        label: "Move to next sem",
        action: handleMoveNext,
        disabled: semesterId === null || isLastSemester,
      },
      {
        label: "Move to prev sem",
        action: handleMovePrev,
        disabled: semesterId === null || isFirstSemester,
      },
      {
        label: "Move back to toolbox",
        action: handleMoveToolbox,
        hasSeparatorBefore: true,
      },
      {
        label: "Delete",
        action: handleDelete,
        isDanger: true,
      },
    ],
    [
      handleDuplicate,
      handleMoveNext,
      handleMovePrev,
      handleMoveToolbox,
      handleDelete,
      semesterId,
      isFirstSemester,
      isLastSemester,
    ],
  );

  const togglePopup = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenPopup((prev) => !prev);
  };

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
                {course.data.subj_code}-{course.data.code_num}
              </b>
              <p>{toTitleCase(course.data.title)}</p>
            </div>
          </div>

          <div className={`flex gap-1 items-center`}>
            <MdOutlineMoreHoriz
              onClick={togglePopup}
              className="cursor-pointer text-2xl"
            />
          </div>

          {openPopup && (
            <PlannerOptionsPopup
              options={menuOptions}
              onClose={() => setOpenPopup(false)}
            />
          )}
        </div>
      </RightClickContextMenu.Trigger>

      <RightClickContextMenu.Portal>
        <RightClickContextMenu.Content className="bg-carpipink rounded-xl border border-darkblue text-darkblue text-xs p-1.5 shadow-lg z-50 min-w-[150px]">
          {menuOptions.map((opt) => (
            <React.Fragment key={opt.label}>
              {opt.hasSeparatorBefore && (
                <RightClickContextMenu.Separator className="h-px bg-darkblue my-1 mx-3" />
              )}
              <RightClickContextMenu.Item
                className={`px-3 py-1 rounded-lg w-full text-left outline-none cursor-pointer ${
                  opt.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : opt.isDanger
                      ? "hover:bg-rosewood hover:text-carpipink cursor-pointer"
                      : "hover:bg-slategray hover:text-carpipink cursor-pointer"
                }`}
                onSelect={opt.action}
              >
                {opt.label}
              </RightClickContextMenu.Item>
            </React.Fragment>
          ))}
        </RightClickContextMenu.Content>
      </RightClickContextMenu.Portal>
    </RightClickContextMenu.Root>
  );
};

export default PlannerCourse;
