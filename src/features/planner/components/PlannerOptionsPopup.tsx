import { Fragment, useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import { MdOutlineMoreHoriz } from "react-icons/md";

import { MenuOption } from "@/features/planner/usePlannerCourse";
import { cn } from "@/lib/classnames";

interface PlannerOptionsPopupProps {
  options: MenuOption[];
}

export default function PlannerOptionsPopup({
  options,
}: PlannerOptionsPopupProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <MdOutlineMoreHoriz
          className={cn(
            "cursor-pointer text-2xl",
            open && "pointer-events-none",
          )}
        />
      </Popover.Trigger>
      <Popover.Content
        side="bottom"
        align="end"
        className="bg-carpipink flex flex-col rounded-xl border border-darkblue text-darkblue text-xs p-1.5 shadow-lg z-50 min-w-[150px]"
      >
        {options.map((opt) => (
          <Fragment key={opt.label}>
            {opt.hasSeparatorBefore && (
              <div className="h-px bg-darkblue my-1 mx-3" />
            )}

            <button
              className={`px-3 py-1 rounded-lg w-full text-left outline-none cursor-pointer ${
                opt.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : opt.isDanger
                    ? "hover:bg-rosewood hover:text-carpipink cursor-pointer"
                    : "hover:bg-slategray hover:text-carpipink cursor-pointer"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (opt.disabled) return;
                opt.action();
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          </Fragment>
        ))}
      </Popover.Content>
    </Popover.Root>
  );
}

{
  /* <div className="absolute right-0 top-10 bg-carpipink flex flex-col rounded-xl border border-darkblue text-darkblue text-xs p-1.5 shadow-lg z-50 min-w-[150px]">
      {options.map((opt) => (
        <React.Fragment key={opt.label}>
          {opt.hasSeparatorBefore && (
            <div className="h-px bg-darkblue my-1 mx-3" />
          )}

          <button
            className={`px-3 py-1 rounded-lg w-full text-left outline-none cursor-pointer ${
              opt.disabled
                ? "opacity-50 cursor-not-allowed"
                : opt.isDanger
                  ? "hover:bg-rosewood hover:text-carpipink cursor-pointer"
                  : "hover:bg-slategray hover:text-carpipink cursor-pointer"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (opt.disabled) return;
              opt.action();
              onClose();
            }}
          >
            {opt.label}
          </button>
        </React.Fragment>
      ))}
    </div> */
}
