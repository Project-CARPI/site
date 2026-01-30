import React, { useState, useEffect, useRef } from "react";

import * as RightClickContextMenu from "@radix-ui/react-context-menu";
import { MdDragIndicator, MdOutlineMoreHoriz } from "react-icons/md";

import CourseLabel from "@/components/course/CourseLabel";
import PlannerOptionsPopup from "@/features/planner/components/PlannerOptionsPopup";
import { usePlannerCourse } from "@/features/planner/usePlannerCourse";
import { UserCourse } from "@/lib/types";

interface PlannerCourseProps {
  course: UserCourse;
  semesterId: string | null;
  isFirstSemester?: boolean;
  isLastSemester?: boolean;
}

export default function PlannerCourse({
  course,
  semesterId,
}: PlannerCourseProps) {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const menuOptions = usePlannerCourse({
    course,
    semesterId,
  });

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
          className="relative flex justify-between bg-darkblue rounded-2xl text-carpipink gap-4 px-2 py-3 e"
        >
          <div className={`flex gap-2 items-center`}>
            <MdDragIndicator className="text-2xl" />
            <CourseLabel course={course.data} showCredits />
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
}
