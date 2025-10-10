import { Draggable } from "@hello-pangea/dnd";
import PlannerCourse from "./PlannerComponents/PlannerCourse";
import ToolboxCourse from "./Toolbox/ToolboxCourse";
import { CourseType } from "../types/interfaces/Course.interface";
import { Dispatch, SetStateAction } from "react";
import { SemesterType } from "../types/interfaces/Semester.interface";
import { CourseEntry } from "../types/interfaces/Course.interface";

interface DraggableItemProps {
  name: string;
  count: number;
  index: number;
  course: CourseType;
  location: "toolbox" | "planner";
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
        // create a mutable copy of the style object provided by the library
        const style = {
          ...provided.draggableProps.style,
          cursor: "grab",
        };

        // unset top and let properties when dragging
        if (snapshot.isDragging) {
          (style as any).top = undefined;
          (style as any).left = undefined;
        }

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={style}
          >
            {location === "planner" &&
            setPlannerCourses &&
            setToolboxCourses &&
            semesterIndex !== null ? (
              <PlannerCourse
                index={index}
                isDragging={snapshot.isDragging}
                course={course}
                setPlannerCourses={setPlannerCourses}
                setToolboxCourses={setToolboxCourses}
                semesterIndex={semesterIndex}
              />
            ) : (
              <ToolboxCourse
                name={name}
                count={count}
                isDragging={snapshot.isDragging}
                index={index}
              />
            )}
          </div>
        );
      }}
    </Draggable>
  );
};

export default DraggableItem;
