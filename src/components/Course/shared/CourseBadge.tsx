import React from "react";

interface CourseBadgeProps {
  count?: number;
  className?: string;
}

const CourseBadge: React.FC<CourseBadgeProps> = ({ count, className = "" }) => {
  if (!count || count <= 1) return null;

  return (
    <div
      className={`absolute rounded-full bg-steelblue w-6 h-6 flex justify-center items-center text-white text-xs ${className}`}
    >
      {count}
    </div>
  );
};

export default CourseBadge;
