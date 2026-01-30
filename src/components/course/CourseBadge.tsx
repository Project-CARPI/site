interface CourseBadgeProps {
  count?: number;
  className?: string;
}

export default function CourseBadge({
  count,
  className = "",
}: CourseBadgeProps) {
  if (!count || count <= 1) return null;

  return (
    <div
      className={`absolute rounded-full bg-steelblue w-6 h-6 flex justify-center items-center text-white text-xs ${className}`}
    >
      {count}
    </div>
  );
}
