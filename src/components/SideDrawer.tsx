import { Drawer } from "vaul";

import { findFiltersForCourse } from "@/components/course/utils";
import { useFilterStore } from "@/features/catalog/search/filters/useFilterStore";
import Tag from "@/features/catalog/Tag";
import useIsDesktop from "@/lib/hooks/useIsDesktop";
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
  const { filters } = useFilterStore();
  const direction = isDesktop ? "left" : "bottom";

  const attrFilters = findFiltersForCourse(
    course.data.attr_list || [],
    filters.attributes,
  );
  const semFilters = findFiltersForCourse(
    course.data.sem_list || [],
    filters.semesters,
  );

  return (
    <Drawer.Root
      direction={direction}
      open={open}
      // modal={false}
      onOpenChange={onOpenChange}
    >
      <Drawer.Portal>
        <Drawer.Content
          className="left-2 md:top-2 bottom-2 fixed z-50 outline-none w-[calc(100%-16px)] md:w-1/2 lg:w-1/3 flex"
          style={
            { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
          }
        >
          <div className="bg-darkblue border-carpipink/50 border h-1/2 md:h-full w-full grow p-8 flex flex-col rounded-2xl ">
            <div className="w-full">
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

              <div className="flex flex-wrap gap-2 mb-4">
                {attrFilters.map((attr, index) => {
                  return <Tag key={index} filter={attr} />;
                })}
                {semFilters?.map((semester, index) => {
                  return <Tag key={index} filter={semester} />;
                })}
              </div>

              <Drawer.Description className="mb-4 text-carpipink">
                {course.data.desc_text || "No description available."}
              </Drawer.Description>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
