import { useState, useEffect, useMemo, useRef } from "react";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, useAnimation } from "framer-motion";
import { IoIosArrowUp } from "react-icons/io";

import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import { SortableItem } from "@/features/dnd/components/SortableItem";
import GarbageBin from "@/features/toolbox/GarbageBin";
import NavButton from "@/features/toolbox/NavButton";
import ToolboxButton from "@/features/toolbox/ToolboxButton";
import ToolboxCourse from "@/features/toolbox/ToolboxCourse";
import { cn } from "@/lib/classnames";
import useIsDesktop from "@/lib/hooks/useIsDesktop";

export default function Toolbox() {
  const { setNodeRef } = useDroppable({ id: "toolbox" });
  const isDesktop = useIsDesktop();
  const [isOpen, setIsOpen] = useState(isDesktop);
  const scrollRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const { toolboxCourses, toolboxCourseCount } = useCourseWorkspace();
  const courseIds = useMemo(
    () => toolboxCourses.map((c) => c.id),
    [toolboxCourses],
  );

  useEffect(() => {
    setIsOpen(isDesktop);
  }, [isDesktop]);

  useEffect(() => {
    controls.start(isOpen ? "open" : "closed");
  }, [isOpen, controls]);

  const toggleToolbox = () => setIsOpen((open) => !open);

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const variants = {
    open: { y: 0 },
    closed: { y: isDesktop ? "calc(100% - 52px)" : "100%" },
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-full z-50 flex flex-col items-start pointer-events-none",
      )}
    >
      {!isDesktop && !isOpen && (
        <div className="absolute bottom-0 right-0 pointer-events-auto">
          <ToolboxButton
            isOpen={isOpen}
            toggleToolbox={toggleToolbox}
            count={toolboxCourseCount}
          />
        </div>
      )}

      <div className="pointer-events-none w-full">
        <GarbageBin />
      </div>

      <motion.div
        animate={controls}
        initial={isOpen ? "open" : "closed"}
        variants={variants}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "w-full bg-darkblue rounded-t-xl h-auto pointer-events-auto",
          "shadow-[0_-5px_15px_rgba(0,0,0,0.3)]",
        )}
      >
        <button
          onClick={toggleToolbox}
          className="flex items-center w-full gap-4 pt-3 px-5 mb-4 cursor-pointer text-left"
        >
          <div className="flex items-center">
            <h2 className="text-carpipink font-semibold text-xl">TOOLBOX</h2>
            <IoIosArrowUp
              className={cn(
                "ml-2 text-2xl text-carpipink transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </div>
          {toolboxCourseCount > 0 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-steelblue text-sm font-medium text-white">
              {toolboxCourseCount}
            </div>
          )}
        </button>

        <div
          className={cn(isOpen ? "block" : "hidden")}
          id="hideable-toolbox-content"
        >
          <div
            ref={(node) => {
              setNodeRef(node);
              (
                scrollRef as React.MutableRefObject<HTMLDivElement | null>
              ).current = node;
            }}
            onWheel={handleWheel}
            className="gap-4 scrollbar-none flex items-center w-full overflow-x-auto p-4 mb-14 h-fit md:mb-0"
          >
            <SortableContext
              items={courseIds}
              strategy={horizontalListSortingStrategy}
            >
              {toolboxCourses.length === 0 ? (
                <div className="md:absolute w-full h-full inset-0 flex items-center justify-center pointer-events-none">
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
      </motion.div>

      {!isDesktop && (
        <div className="w-full pointer-events-auto relative">
          <NavButton />
        </div>
      )}
    </div>
  );
}
