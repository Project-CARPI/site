import React from "react";

interface TagProp {
  name: string;
  bgcolor: string;
  color: string;
}
const Tag: React.FC<TagProp> = ({ name, bgcolor, color }) => {
  return (
    <div
      className={`rounded-2xl px-3 py-1 text-xs mr-1 mb-1`}
      style={{ backgroundColor: `${bgcolor}`, color: `${color}` }}
    >
      {name}
    </div>
  );
};

export default Tag;
