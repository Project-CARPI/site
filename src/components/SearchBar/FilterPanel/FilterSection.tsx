import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FilterCategory,
  FilterData,
} from "../../../types/interfaces/Filters.interface";
import useIsDesktop from "../../../hooks/useIsDesktop";

interface FilterSectionProps {
  sectionName: FilterCategory;
  tags: FilterData[];
  selected: string[];
  toggleFilter: (filter: FilterData) => void;
  showCode?: boolean;
  classname: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  sectionName,
  tags,
  selected,
  toggleFilter,
  showCode = false,
  classname,
}) => {
  const isDesktop = useIsDesktop();
  const [isExpanded, setIsExpanded] = useState(false);

  const COLLAPSED_HEIGHT = "6rem";
  const TAG_THRESHOLD = 6;
  const shouldTruncate = tags.length > TAG_THRESHOLD;

  const tagStyle = ({ selected }: { selected: boolean }) => {
    return selected
      ? `${classname}`
      : isDesktop
        ? `text-carpipink border border-carpipink hover:bg-darkblue/30`
        : `text-darkblue border border-darkblue hover:bg-darkblue/30`;
  };

  return (
    <div className="mt-2">
      <h3 className="font-medium mb-1">{sectionName}</h3>

      <div className="relative">
        <motion.div
          initial={false}
          animate={{
            height:
              isExpanded || !shouldTruncate || !isDesktop
                ? "auto"
                : COLLAPSED_HEIGHT,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-wrap overflow-hidden gap-1"
        >
          {tags.map((tag) => (
            <button
              key={tag.id}
              className={`hover:cursor-pointer rounded-2xl px-3 py-1 text-sm mr-1 mb-1 flex-none transition-colors
                ${tagStyle({ selected: selected.includes(tag.code) })}`}
              onClick={() => toggleFilter(tag)}
            >
              {showCode ? tag.code : tag.value}
            </button>
          ))}
        </motion.div>

        {isDesktop && !isExpanded && shouldTruncate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
            className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-dustygrape to-transparent pointer-events-none"
          />
        )}
      </div>

      {/* Toggle Button */}
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls={`${sectionName}-tags`}
          className="text-xs text-carpipink mt-1 hover:underline focus:outline-none"
        >
          {isExpanded ? "Show Less" : "Show All"}
        </button>
      )}
    </div>
  );
};

export default FilterSection;
