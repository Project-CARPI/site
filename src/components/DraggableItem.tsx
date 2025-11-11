import { Dispatch, SetStateAction } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { SemesterType } from "../types/interfaces/Semester.interface";
import { CourseType, CourseEntry } from "../types/interfaces/Course.interface";

import PlannerCourse from "./Course/PlannerCourse";
import ToolboxCourse from "./Course/ToolboxCourse";

interface DraggableItemProps {
  name: string;
  count: number;
  index: number;
  course: CourseType;
  location: string;
  setPlannerCourses: Dispatch<SetStateAction<SemesterType[]>> | null;
  setToolboxCourses: Dispatch<SetStateAction<CourseEntry[]>> | null;
  semesterIndex: number | null;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  name,
  count,
  index,
  course,
  location,
  setPlannerCourses,
  setToolboxCourses,
  semesterIndex,
}) => {
  return (
    <Draggable draggableId={`${name}`} index={index}>
      {(provided, snapshot) => {
        const style = {
          ...provided.draggableProps.style,
          cursor: "grab",
        };

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={style}
          >
            {location !== "toolbox" ? (
              <PlannerCourse
                course={course}
                count={count}
                isDragging={snapshot.isDragging}
                index={index}
                setPlannerCourses={setPlannerCourses!}
                setToolboxCourses={setToolboxCourses!}
                semesterIndex={semesterIndex!}
              />
            ) : (
              <ToolboxCourse
                course={course}
                index={index}
                name={name}
                count={count}
                isDragging={snapshot.isDragging}
              />
            )}
          </div>
        );
      }}
    </Draggable>
  );
};

export default DraggableItem;
