import type { ReactNode } from "react";

import { cn } from "@/lib/classnames";

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  tooltip: string;
  inverted?: boolean; // Optional prop to invert colors
}

export default function Button({
  onClick,
  children,
  tooltip,
  inverted,
}: ButtonProps) {
  return (
    <div className="relative group flex flex-col items-center">
      <button
        onClick={onClick}
        className={cn(
          "p-3 rounded-full w-fit aspect-square flex items-center justify-center hover:cursor-pointer",
          inverted
            ? "bg-carpipink/20 text-carpipink hover:text-darkblue hover:bg-carpipink transition-colors"
            : "bg-[color-mix(in_oklab,var(--color-darkblue)_25%,var(--color-carpipink)_75%)] hover:bg-darkblue hover:text-carpipink transition-colors",
        )}
      >
        {children}
      </button>

      {/* Tooltip Container */}
      <div
        className={cn(
          "absolute -bottom-7 z-50 hidden group-hover:flex flex-col items-center ",
          inverted ? " text-darkblue" : " text-carpipink",
        )}
      >
        <div
          className={cn(
            "w-2 h-2  rotate-45",
            inverted ? "bg-carpipink" : "bg-darkblue",
          )}
        />
        <div
          className={cn(
            "bg-darkblue text-carpipink text-tiny! py-0.5 px-2 -mt-1 rounded-full whitespace-nowrap",
            inverted
              ? "bg-carpipink text-darkblue"
              : "bg-darkblue text-carpipink",
          )}
        >
          {tooltip}
        </div>
      </div>
    </div>
  );
}
