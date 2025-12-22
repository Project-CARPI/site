import React, { useState } from "react";
import AddButton from "./CatalogCourse/AddButton";
import { motion } from "framer-motion";
import { APICourse } from "../../types/interfaces/Course.interface";
import { useCourseWorkspace } from "../../hooks/useCourseWorkspace";
import { useFilterData } from "../../hooks/useFilters";
import { FilterData } from "../../types/interfaces/Filters.interface";
import Tag from "../Tag";
import CourseLabel from "./shared/CourseLabel";
import CourseBadge from "./shared/CourseBadge";

const findFiltersForCourse = (
  api_list: string[],
  filterDataType: FilterData[],
) => {
  return filterDataType.filter((attr) => api_list.includes(attr.code));
};

interface CourseProps {
  course: APICourse;
}

const Course: React.FC<CourseProps> = ({ course }) => {
  const { addCourseToToolbox, getCourseCountInToolbox } = useCourseWorkspace();
  const { attributes, semesters } = useFilterData();

  const attrFilters = findFiltersForCourse(course.attr_list || [], attributes);
  const semFilters = findFiltersForCourse(course.sem_list || [], semesters);

  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.id !== "add-button") setIsOpen((open) => !open);
  };

  return (
    <div
      className="relative bg-carpipink hover:cursor-pointer hover:bg-darkblue/10 border-1 border-black rounded-xl w-full p-4"
      onClick={toggleOpen}
    >
      <CourseBadge
        count={getCourseCountInToolbox(course)}
        className="absolute -top-2 -right-2"
      />

      <div className={`flex items-center justify-between`}>
        <div>
          <CourseLabel course={course} showCredits />
          <div className={`flex flex-wrap mt-1 gap-1`}>
            {attrFilters.map((attr, index) => {
              return <Tag key={index} filter={attr} />;
            })}
            {semFilters?.map((semester, index) => {
              return <Tag key={index} filter={semester} />;
            })}
          </div>
        </div>
        <div id="add-button" className={``}>
          <AddButton
            addCourse={(e) => {
              e.stopPropagation();
              addCourseToToolbox(course);
            }}
          />
        </div>
      </div>
      <div className={`${isOpen ? "" : "hidden"} mt-2`}>
        <motion.p
          initial={{ height: 0, opacity: 0 }}
          animate={
            isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
          }
          className={`text-sm`}
          transition={{ duration: 0.1 }}
        >
          {course.desc_text.trim() === ""
            ? "Empty Description"
            : course.desc_text}
        </motion.p>
      </div>
    </div>
  );
};

export default Course;
