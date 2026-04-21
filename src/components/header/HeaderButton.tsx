import { cn } from "@/lib/classnames";

interface HeaderButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  tooltip: string;
}

export default function HeaderButton({
  onClick,
  children,
  tooltip,
}: HeaderButtonProps) {
  return (
    <div className="relative group flex flex-col items-center">
      <button
        aria-label="CARPI Options"
        onClick={onClick}
        className={cn(
          "p-3 rounded-full w-fit aspect-square flex items-center justify-center hover:cursor-pointer",
          "bg-darkblue/20 hover:bg-darkblue hover:text-carpipink transition-colors",
        )}
      >
        {children}
      </button>

      {/* Tooltip Container */}
      <div className="absolute -bottom-7 z-50 hidden group-hover:flex flex-col items-center">
        <div className="w-2 h-2 bg-darkblue rotate-45"></div>
        <div className="bg-darkblue text-carpipink text-tiny py-0.5 px-2 -mt-1 rounded-full whitespace-nowrap">
          {tooltip}
        </div>
      </div>
    </div>
  );
}
