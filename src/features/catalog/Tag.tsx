import { IoClose } from "react-icons/io5";

import { useFilterData } from "@/features/filters/useFilterData";
import useIsDesktop from "@/lib/hooks/useIsDesktop.ts";
import { FilterData } from "@/lib/types";

interface ColorClass {
  selected_border: string;
  selected_bg: string;
  hover_bg: string;
}

const getColorClass = (type: string): ColorClass => {
  switch (type) {
    case "Subject":
      return {
        selected_border: "border-burgundy",
        selected_bg: "bg-burgundy",
        hover_bg:
          "hover:bg-[color-mix(in_oklab,var(--color-burgundy)_90%,white_10%)]",
      };
    case "Attribute":
      return {
        selected_border: "border-slategray",
        selected_bg: "bg-slategray",
        hover_bg:
          "hover:bg-[color-mix(in_oklab,var(--color-slategray)_90%,white_10%)]",
      };
    case "Semester":
      return {
        selected_border: "border-copperwood",
        selected_bg: "bg-copperwood",
        hover_bg:
          "hover:bg-[color-mix(in_oklab,var(--color-copperwood)_90%,white_10%)]",
      };
    default:
      return {
        selected_border: "border-darkblue",
        selected_bg: "bg-darkblue",
        hover_bg:
          "hover:bg-[color-mix(in_oklab,var(--color-darkblue)_90%,white_10%)]",
      };
  }
};

interface TagProps {
  filter: FilterData;

  // optional props for behavior and style
  isSelectable?: boolean;
  isSelected?: boolean;
  showCode?: boolean;
  isRemovable?: boolean;
}

export default function Tag({
  filter,
  showCode = false,
  isSelectable = false,
  isSelected = false,
  isRemovable = false,
}: TagProps) {
  const { toggleFilter } = useFilterData();
  const isDesktop = useIsDesktop();

  // Determine content: value or code
  const content = showCode ? filter.code : filter.value;
  const selectedValue = isSelectable ? isSelected : true;

  // Determine styles
  const baseClass =
    "rounded-full px-3 py-1 text-sm inline-flex items-center transition-colors text-carpipink";
  const accentColor = getColorClass(filter.type);
  const colorClasses = selectedValue
    ? `${accentColor.selected_border} ${accentColor.selected_bg} ${accentColor.hover_bg}`
    : isDesktop
      ? `border-carpipink ${accentColor.hover_bg}`
      : `border-darkblue text-darkblue ${accentColor.hover_bg}`;

  const handleClick = () => {
    if (isSelectable || isRemovable) {
      toggleFilter(filter);
    }
  };

  return (
    <button
      className={`border ${baseClass} ${colorClasses} ${isSelectable || isRemovable ? "hover:cursor-pointer" : ""}`}
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
}
