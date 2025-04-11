import { Draggable } from "@hello-pangea/dnd";

interface DraggableItemProps {
  name: string;
  count: number;
  index: number;
  isDragging: boolean;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  name,
  count,
  index,
  isDragging,
}) => {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => {
        const isOverZoneA = snapshot.draggingOver === "zone-a";
        const isOverZoneB = snapshot.draggingOver === "zone-b";

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
            {isOverZoneA ? (
              <CompactView data={item} />
            ) : isOverZoneB ? (
              <ExpandedView data={item} />
            ) : (
              <CompactView data={item} />
            )}
          </div>
        );
      }}
    </Draggable>
  );
};

export default DraggableItem;
