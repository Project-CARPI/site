import React from "react";
import { FilterData } from "../../../types/interfaces/Filters.interface";

interface TagProp {
  tag: FilterData;
  bgcolor: string;
  color: string;
}
const Tag: React.FC<TagProp> = ({ tag, bgcolor, color }) => {
  return (
    <div
      className={`rounded-2xl px-3 py-1 text-xs mr-1 mb-1`}
      style={{ backgroundColor: `${bgcolor}`, color: `${color}` }}
      title={tag.value}
    >
      {tag.code}
    </div>
  );
};

export default Tag;
