import { Draggable } from "@hello-pangea/dnd";
import PlannerCourse from "./PlannerComponents/PlannerCourse";
import ToolboxCourse from "./Toolbox/ToolboxCourse";
import { CourseType } from "../types/interfaces/Course.interface";
interface DraggableItemProps {
  name: string;
  count: number;
  index: number;
  course: CourseType;
  location: "toolbox" | "planner";
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  name,
  count,
  index,
  course,
  location,
}) => {
  return (
    <Draggable draggableId={`${name}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            cursor: "grab",
          }}
          className="relative"
        >
          {location === "planner" ? (
            <PlannerCourse
              index={index}
              isDragging={snapshot.isDragging}
              course={course}
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
      )}
    </Draggable>
  );
};

export default DraggableItem;
