import React from "react";
import { IoClose } from "react-icons/io5";
import { FilterData } from "../types/interfaces/Filters.interface";
import { useFilterData } from "../hooks/useFilters";

const getColorClass = (type: string, isSelected: boolean): string => {
  let accentColor: string;
  switch (type) {
    case "Subject":
      accentColor = "burgundy";
      break;
    case "Attribute":
      accentColor = "slategray";
      break;
    case "Semester":
      accentColor = "copperwood";
      break;
    default:
      accentColor = "darkblue";
  }

  // If the tag is selected, apply the active styles
  if (isSelected) {
    return `text-carpipink border border-${accentColor} bg-${accentColor} hover:bg-[color-mix(in_oklab,var(--color-${accentColor})_90%,white_10%)]`;
  }

  // If not selected, return unselected style
  return `border-1 border-carpipink hover:bg-[color-mix(in_oklab,var(--color-${accentColor})_70%,var(--color-darkblue)_30%)]`;
};

interface TagProps {
  filter: FilterData;

  // optional props for behavior and style
  isSelectable?: boolean;
  isSelected?: boolean;
  showCode?: boolean;
  isRemovable?: boolean;
}

const Tag: React.FC<TagProps> = ({
  filter,
  showCode = false,
  isSelectable = false,
  isSelected = false,
  isRemovable = false,
}) => {
  const { toggleFilter } = useFilterData();

  // Determine content: value or code
  const content = showCode ? filter.code : filter.value;
  const selectedValue = isSelectable ? isSelected : true;

  // Determine styles
  const baseClass =
    "rounded-full px-3 py-1 text-sm inline-flex items-center transition-colors text-carpipink";
  const colorClasses = getColorClass(filter.type, selectedValue);

  const handleClick = () => {
    if (isSelectable || isRemovable) {
      toggleFilter(filter);
    }
  };

  return (
    <button
      className={`${baseClass} ${colorClasses} ${isSelectable || isRemovable ? "hover:cursor-pointer" : ""}`}
      onClick={handleClick}
      disabled={!isSelectable && !isRemovable}
      title={filter.value}
    >
      {content}
      {isRemovable && (
        <span className="inline ml-1">
          <IoClose
            className="w-4 h-4"
            aria-label={`Remove filter: ${filter.value}`}
          />
        </span>
      )}
    </button>
  );
};

export default Tag;
