import React from "react";

interface CourseLabelProps {
  subjCode: string;
  codeNum: number;
  title: string;
  horizontal?: boolean;
}

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const CourseLabel: React.FC<CourseLabelProps> = ({
  subjCode,
  codeNum,
  title,
  horizontal = false,
}) => {
  return (
    <div className={`text-sm ${horizontal ? "flex items-center gap-2" : ""}`}>
      <b>
        {subjCode}-{codeNum}
      </b>
      <p>{toTitleCase(title)}</p>
    </div>
  );
};

export default CourseLabel;
