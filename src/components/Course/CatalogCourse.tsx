import React, { useState } from "react";
import Tag from "./CatalogCourse/Tag";
import AddButton from "./CatalogCourse/AddButton";
import { motion } from "framer-motion";
import { CourseType } from "../../types/interfaces/Course.interface";
import { useCourseWorkspace } from "../../hooks/useCourseWorkspace";

interface CourseProps {
  course: CourseType;
}

const Course: React.FC<CourseProps> = ({ course }) => {
  const { toolboxCourses, setToolboxCourses } = useCourseWorkspace();

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
          { name: courseDisplay, count: 1, data: course },
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
        } absolute right-[-10px] top-[-10px] rounded-full bg-[#78A1BB] w-8 h-8 flex justify-center items-center text-white`}
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
          <div className={`flex flex-wrap mt-1`}>
            {course.attr_list?.map((attr, index) => {
              return (
                <Tag
                  key={index}
                  name={attr}
                  bgcolor={"#99C1B9"}
                  color={"#283044"}
                />
              );
            })}
            {course.sem_list?.map((semester, index) => {
              return (
                <Tag
                  key={index}
                  name={semester}
                  bgcolor={"#565E87"}
                  color={"#F5CECE"}
                />
              );
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
