import { useState, useEffect } from "react";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { IoIosArrowUp } from "react-icons/io";

import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import { SortableItem } from "@/features/dnd/components/SortableItem";
import GarbageBin from "@/features/toolbox/GarbageBin";
import NavButton from "@/features/toolbox/NavButton";
import ToolboxButton from "@/features/toolbox/ToolboxButton";
import ToolboxCourse from "@/features/toolbox/ToolboxCourse";
import { cn } from "@/lib/classnames";
import useIsDesktop from "@/lib/hooks/useIsDesktop";

const Toolbox: React.FC = () => {
  const { setNodeRef } = useDroppable({ id: "toolbox" });

  const isDesktop = useIsDesktop();
  const [isOpen, setIsOpen] = useState(isDesktop);

  const { toolboxCourses, toolboxCourseCount } = useCourseWorkspace();

  useEffect(() => {
    setIsOpen(isDesktop);
  }, [isDesktop]);

  const toggleToolbox = () => {
    setIsOpen((open) => !open);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 flex flex-col items-center justify-center w-screen z-50 ${
        !isOpen && isDesktop ? "pointer-events-none" : "pointer-events-auto"
      }`}
    >
      {!isDesktop && !isOpen && (
        <ToolboxButton
          isOpen={isOpen}
          toggleToolbox={toggleToolbox}
          count={toolboxCourseCount}
        />
      )}

      <div
        className={`w-full bg-darkblue rounded-t-xl h-auto transition-transform duration-300 ease-in-out pointer-events-auto ${
          isOpen
            ? "transform translate-y-0"
            : isDesktop
              ? "transform translate-y-[calc(100%-52px)]"
              : "transform translate-y-full"
        }`}
      >
        <GarbageBin />

        {/* Header */}
        <div className="flex items-center gap-4 p-3 mx-2 cursor-pointer">
          <div className="flex items-center">
            <h2 className="text-carpipink font-semibold text-xl">TOOLBOX</h2>
            <IoIosArrowUp
              className={`ml-2 text-2xl text-carpipink transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
              onClick={toggleToolbox}
              role="button"
              aria-expanded={isOpen}
              aria-controls="hideable-toolbox-content"
            />
          </div>

          {toolboxCourseCount > 0 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-steelblue text-sm font-medium text-white">
              {toolboxCourseCount}
            </div>
          )}
        </div>

        {/* Collapsible content */}
        <div
          className={`${isOpen ? "block" : "hidden"}`}
          id="hideable-toolbox-content"
        >
          <div
            ref={setNodeRef}
            className={cn(
              "gap-4 scrollbar-none flex justify-items-center w-full overflow-x-auto p-4 mb-10 transition-colors relative",
              "md:h-[75px] h-[100px] md:min-h-[50px] md:pb-0 md:mb-0",
            )}
          >
            <SortableContext
              items={toolboxCourses.map((c) => c.id)}
              strategy={horizontalListSortingStrategy}
            >
              {toolboxCourses.length === 0 ? (
                <div className=" absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-carpipink opacity-60 text-sm md:text-base font-medium italic">
                    Add courses to plan your semester
                  </span>
                </div>
              ) : (
                toolboxCourses.map((course) => (
                  <SortableItem
                    key={course.id}
                    id={course.id}
                    data={course}
                    type="Course"
                  >
                    <ToolboxCourse course={course} />
                  </SortableItem>
                ))
              )}
            </SortableContext>
          </div>
        </div>
      </div>

      {!isDesktop && <NavButton />}
    </div>
  );
};

export default Toolbox;
