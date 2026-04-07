import { useState } from "react";

import { motion } from "framer-motion";
import { IoAdd } from "react-icons/io5";

import CourseBadge from "@/components/course/CourseBadge";
import CourseLabel from "@/components/course/CourseLabel";
import Tag from "@/components/Tag";
import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import { useCourseFilters } from "@/lib/stores/useFilterStore";
import { APICourse } from "@/lib/types";

interface CourseProps {
  course: APICourse;
}

const Course: React.FC<CourseProps> = ({ course }) => {
  const { addCourseToToolbox, getCourseCount } = useCourseWorkspace();
  const { attrFilters, semFilters } = useCourseFilters(course);

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
        count={getCourseCount(`${course.subj_code} ${course.code_num}`)}
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

interface AddButtonProps {
  addCourse: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const AddButton: React.FC<AddButtonProps> = ({ addCourse }) => {
  return (
    <button
      className={`hover:cursor-pointer hover:bg-darkblue hover:text-carpipink border-2 border-darkblue rounded-full p-1 text-4xl`}
      onClick={addCourse}
    >
      <IoAdd />
    </button>
  );
};
