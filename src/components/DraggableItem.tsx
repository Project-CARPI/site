import { Draggable } from "@hello-pangea/dnd";
import PlannerCourse from "./PlannerComponents/PlannerCourse";
import ToolboxCourse from "./Toolbox/ToolboxCourse";
import { CourseType } from "../types/interfaces/Course.interface";
interface DraggableItemProps {
  name: string;
  count: number;
  index: number;
  isDragging: boolean;
  course: CourseType;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  name,
  count,
  index,
  isDragging,
  course,
}) => {
  return (
    <Draggable draggableId={``} index={index}>
      {(provided, snapshot) => {
        const isOverToolbox = snapshot.draggingOver === "toolbox";
        const isOverPlanner =
          snapshot.draggingOver === null
            ? false
            : snapshot.draggingOver.includes("planner");

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              padding: 10,
              transition: "transform 0.2s ease",
              cursor: "grab",
            }}
          >
            {isOverToolbox ? (
              <ToolboxCourse
                name={name}
                count={count}
                isDragging={isDragging}
                index={index}
              />
            ) : isOverPlanner ? (
              <PlannerCourse
                index={index}
                isDragging={isDragging}
                course={course}
              />
            ) : (
              <ToolboxCourse
                name={name}
                count={count}
                isDragging={isDragging}
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
