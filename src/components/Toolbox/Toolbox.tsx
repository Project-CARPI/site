import React, { useState } from "react";
import ToolboxButton from "./ToolboxButton";
import NavButton from "./NavButton";
import ToolboxCourse from "./ToolboxCourse";
import { Droppable } from "@hello-pangea/dnd";
import { IoIosArrowDown } from "react-icons/io";
import { CourseEntry } from "../../types/interfaces/Course.interface";
interface ToolboxProps {
  courses: CourseEntry[];
}

const Toolbox: React.FC<ToolboxProps> = ({ courses }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleToolbox = () => {
    setIsOpen((open) => !open);
  };

  const toolboxSum = () => {
    let sum = 0;
    courses.forEach((course) => (sum += course.count));
    return sum;
  };
  return (
    <>
      <div className={`fixed bottom-0 w-screen`}>
        <ToolboxButton
          isOpen={isOpen}
          toggleToolbox={toggleToolbox}
          count={toolboxSum()}
        />
        <div className={`flex justify-center`}>
          <div
            className={`${isOpen ? "" : "hidden"} bg-[#283044] h-36 w-screen rounded-t-xl`}
          >
            <div className={`close-toolbox`}>
              <button
                className={`flex items-center text-[#F5CECE] font-semibold mt-2 mx-5 text-xl p-1`}
                onClick={toggleToolbox}
              >
                TOOLBOX
                <IoIosArrowDown className={`mx-2`} />
              </button>
            </div>

            <Droppable droppableId={`toolbox`} direction="horizontal">
              {(provided, snapshot) => {
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`courses h-13 flex items-center px-2 w-screen overflow-x-auto whitespace-nowrap scrollbar-hide`}
                  >
                    {courses.map((course, index) => (
                      <ToolboxCourse
                        key={course.name}
                        name={course.name}
                        count={course.count}
                        index={index}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </div>

          <NavButton />
        </div>
      </div>
    </>
  );
};

export default Toolbox;
