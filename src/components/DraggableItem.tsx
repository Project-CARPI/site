import { Dispatch, SetStateAction } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { SemesterType } from "../types/interfaces/Semester.interface";
import { CourseType, CourseEntry } from "../types/interfaces/Course.interface";

import PlannerCourse from "./PlannerComponents/PlannerCourse";
import ToolboxCourse from "./Toolbox/ToolboxCourse";

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
        // const isOverPlanner =
        //   snapshot.isDragging && snapshot.draggingOver !== "toolbox";

        const style = {
          ...provided.draggableProps.style,
          cursor: "grab",
          // background: snapshot.isDragging ? "#891726" : undefined,
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
