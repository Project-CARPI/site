import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterData } from "../../../types/interfaces/Filters.interface";

interface FilterSectionProps {
  sectionName: "Subject" | "Attributes" | "Semesters";
  tags: FilterData[];
  selected: string[];
  toggleFilter: (filter: FilterData) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  sectionName,
  tags,
  selected,
  toggleFilter,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = tags.length > 12;
  const COLLAPSED_HEIGHT = "6rem";

  return (
    <div className="mt-2">
      <h3 className="font-semibold mb-1">{sectionName}</h3>

      <div className="relative">
        <motion.div
          initial={false}
          animate={{
            height: isExpanded || !shouldTruncate ? "auto" : COLLAPSED_HEIGHT,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-wrap overflow-hidden"
        >
          {tags.map((tag) => (
            <button
              key={tag.id}
              className={`hover:bg-darkblue/10 hover:cursor-pointer rounded-2xl px-3 py-1 text-sm mr-1 mb-1 flex-none transition-colors
                ${
                  selected.includes(tag.code)
                    ? "bg-darkblue text-carpipink hover:bg-darkblue/70 border border-darkblue"
                    : "border border-darkblue text-darkblue"
                }`}
              onClick={() => toggleFilter(tag)}
            >
              {tag.code}
            </button>
          ))}
        </motion.div>

        <AnimatePresence>
          {!isExpanded && shouldTruncate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-carpipink to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-darkblue mt-1 hover:underline focus:outline-none"
        >
          {isExpanded ? "Show Less" : "Show All"}
        </button>
      )}
    </div>
  );
};

export default FilterSection;
