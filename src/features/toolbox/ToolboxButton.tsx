import { PiToolbox } from "react-icons/pi";

import { cn } from "@/lib/classnames";

interface ToolboxButtonProps {
  toggleToolbox: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isOpen: boolean;
  count: number;
}
export default function ToolboxButton({
  toggleToolbox,
  isOpen,
  count,
}: ToolboxButtonProps) {
  return (
    <button
      className={cn(
        "bg-darkblue rounded-full text-carpipink text-5xl p-4 border-carpipink border-1 m-4 absolute bottom-10 right-0",
        isOpen ? "hidden" : "",
      )}
      onClick={toggleToolbox}
    >
      <div
        className={cn(
          count === 0 ? "hidden" : "",
          "absolute -top-1 -right-2  rounded-full bg-steelblue w-8 h-8 flex justify-center items-center text-white text-lg",
        )}
      >
        <p>{count}</p>
      </div>
      <PiToolbox />
    </button>
  );
}
