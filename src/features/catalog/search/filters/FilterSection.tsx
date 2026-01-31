import { useState } from "react";

import { motion } from "framer-motion";

import Tag from "@/features/catalog/Tag";
import useIsDesktop from "@/lib/hooks/useIsDesktop";
import { FilterCategory, FilterData } from "@/lib/types";

interface FilterSectionProps {
  sectionName: FilterCategory;
  tags: FilterData[];
  selected: string[];
  showCode?: boolean;
}

export default function FilterSection({
  sectionName,
  tags,
  selected,
  showCode = false,
}: FilterSectionProps) {
  const isDesktop = useIsDesktop();
  const [isExpanded, setIsExpanded] = useState(false);

  const COLLAPSED_HEIGHT = "6rem";
  const TAG_THRESHOLD = 6;
  const shouldTruncate = tags.length > TAG_THRESHOLD;

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
            <Tag
              key={`${tag.type}-${tag.code}`}
              filter={tag}
              isSelectable={true}
              isSelected={selected.includes(tag.code)}
              showCode={showCode}
            />
          ))}
        </motion.div>

        {isDesktop && !isExpanded && shouldTruncate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
            className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-darkblue to-transparent pointer-events-none"
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
}
