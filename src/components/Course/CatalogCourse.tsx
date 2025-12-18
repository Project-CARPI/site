import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import AddButton from "./CatalogCourse/AddButton";
import { motion } from "framer-motion";
import { APICourse } from "../../types/interfaces/Course.interface";
import { useCourseWorkspace } from "../../hooks/useCourseWorkspace";
import { useFilterData } from "../../hooks/useFilters";
import { FilterData } from "../../types/interfaces/Filters.interface";
import Tag from "../Tag";

const findFiltersForCourse = (
  api_list: string[],
  filterDataType: FilterData[]
) => {
  console.log("API List:", api_list);
  return filterDataType.filter((attr) => api_list.includes(attr.code));
};

interface CourseProps {
  course: APICourse;
}

const Course: React.FC<CourseProps> = ({ course }) => {
  const { toolboxCourses, setToolboxCourses } = useCourseWorkspace();
  const { attributes, semesters } = useFilterData();

  const attrFilters = findFiltersForCourse(course.attr_list || [], attributes);
  const semFilters = findFiltersForCourse(course.sem_list || [], semesters);

  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.id !== "add-button") setIsOpen((open) => !open);
  };

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const courseDisplay: string = `${course.subj_code}-${course.code_num} ${toTitleCase(course.title)}`;
  const addCourse = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setToolboxCourses((prevCourses) => {
      const existingIndex = prevCourses.findIndex(
        (c) => c.name === courseDisplay
      );

      if (existingIndex !== -1) {
        return prevCourses.map((c, i) =>
          i === existingIndex ? { ...c, count: c.count + 1 } : c
        );
      } else {
        return [
          ...prevCourses,
          {
            id: uuidv4(),
            name: courseDisplay,
            count: 1,
            data: course,
          },
        ];
      }
    });
  };
  const toolboxCourse =
    toolboxCourses[toolboxCourses.findIndex((c) => c.name === courseDisplay)];
  const courseCount = toolboxCourse ? toolboxCourse.count : undefined;
  return (
    <div
      className="relative bg-carpipink hover:cursor-pointer hover:bg-darkblue/10 border-1 border-black rounded-xl w-full p-4"
      onClick={toggleOpen}
    >
      <div
        className={`${
          courseCount === undefined ? "hidden" : ""
        } absolute right-[-10px] top-[-10px] rounded-full bg-steelblue w-8 h-8 flex justify-center items-center text-carpipink`}
      >
        <p>{courseCount}</p>
      </div>

      <div className={`flex items-center justify-between`}>
        <div>
          <div className={`text-md`}>
            <b>
              {course.subj_code}-{course.code_num}
            </b>
            <p>{toTitleCase(course.title)}</p>
          </div>
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
          <AddButton addCourse={addCourse} />
        </div>
      </div>
      <div className={`${isOpen ? "" : "hidden"} mt-2`}>
        <motion.p
          initial={{ height: 0, opacity: 0 }}
          animate={isOpen ? { height: "auto", opacity: 1 } : {}}
          className={`text-sm`}
          transition={{ duration: 0.05 }}
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
