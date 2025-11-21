import React from "react";
import { FilterData } from "../../../types/interfaces/Filters.interface";

interface TagProp {
  tag: FilterData;
  classname: string;
}
const Tag: React.FC<TagProp> = ({ tag, classname }) => {
  return (
    <div
      className={`rounded-2xl px-3 py-1 text-xs mr-1 mb-1 ${classname}`}
      title={tag.value}
    >
      {tag.code}
    </div>
  );
};

export default Tag;
