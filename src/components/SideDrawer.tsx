import type { CSSProperties } from "react";

import { BiX } from "react-icons/bi";
import { Drawer } from "vaul";

import Button from "@/components/Button";
import Tag from "@/components/Tag";
import { cn } from "@/lib/classnames";
import useIsDesktop from "@/lib/hooks/useIsDesktop";
import { useCourseFilters } from "@/lib/stores/useFilterStore";
import { UserCourse } from "@/lib/types";

interface CourseDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: UserCourse;
}

export function CourseDetailsDrawer({
  open,
  onOpenChange,
  course,
}: CourseDetailsDrawerProps) {
  const isDesktop = useIsDesktop();
  const { attrFilters, semFilters } = useCourseFilters(course.data);

  const direction = isDesktop ? "left" : "bottom";

  return (
    <Drawer.Root direction={direction} open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Content
          className={cn(
            "md:left-2 md:top-2 bottom-2 fixed z-50",
            "outline-none md:w-[calc(100%-16px)] lg:w-1/3 flex h-2/5 md:h-[calc(100%-16px)]",
          )}
          style={{ "--initial-transform": "calc(100% + 8px)" } as CSSProperties}
        >
          <div
            className={cn(
              " w-full relative  grow p-8 flex flex-col rounded-2xl overflow-y-auto shadow-2xl shadow-darkblue",
              "bg-darkblue md:border-[color-mix(in_oklab,var(--color-carpipink)_40%,white_60%)] md:border-2",
            )}
          >
            <div className="flex items-start justify-between">
              <Drawer.Title
                aria-label={course.name}
                className="flex flex-col mb-2"
              >
                <span className="text-sm font-light text-carpipink">
                  {course.name}
                </span>
                <span className="text-lg font-bold text-carpipink">
                  {course.data.title}
                </span>
              </Drawer.Title>

              <Drawer.Close>
                <Button
                  inverted
                  tooltip="Close Drawer"
                  onClick={() => onOpenChange(false)}
                >
                  <BiX className="w-5 h-5" />
                </Button>
              </Drawer.Close>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {attrFilters.map((attr) => {
                return <Tag key={`${attr.type}-${attr.code}`} filter={attr} />;
              })}
              {semFilters?.map((semester) => {
                return (
                  <Tag
                    key={`${semester.type}-${semester.code}`}
                    filter={semester}
                  />
                );
              })}
            </div>

            <Drawer.Description className="mb-4 text-carpipink">
              {course.data.desc_text || "No description available."}
            </Drawer.Description>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
