import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/classnames";

export default function NavButton() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <Link
      className={cn(
        "border-t w-full text-center rounded-t-2xl py-2 absolute bottom-0",
        "bg-darkblue text-carpipink border-carpipink font-semibold text-lg",
      )}
      to={`${path == "/" ? "/planner" : "/"}`}
    >
      {path == "/" ? "Go to Planner" : "Go to Courses"}
    </Link>
  );
}
