import React, { Fragment } from "react";

import { MenuOption } from "@/features/planner/usePlannerCourse";

interface PlannerMenuContentProps {
  options: MenuOption[];
  onItemSelect?: () => void;
  ItemComponent: React.ElementType;
  SeparatorComponent: React.ElementType;
}

export default function PlannerMenuContent({
  options,
  onItemSelect,
  ItemComponent,
  SeparatorComponent,
}: PlannerMenuContentProps) {
  const handleAction = (opt: MenuOption) => {
    if (opt.disabled) return;
    opt.action();
    onItemSelect?.();
  };

  const isNative = typeof ItemComponent === "string";

  return (
    <>
      {options.map((opt) => (
        <Fragment key={opt.label}>
          {opt.hasSeparatorBefore && (
            <SeparatorComponent className="h-px bg-darkblue my-1 mx-3" />
          )}
          <ItemComponent
            disabled={opt.disabled}
            className={`px-3 py-1 rounded-lg w-full text-left outline-none cursor-pointer ${
              opt.disabled
                ? "opacity-50 cursor-not-allowed"
                : opt.isDanger
                  ? "hover:bg-rosewood hover:text-carpipink"
                  : "hover:bg-slategray hover:text-carpipink"
            }`}
            // for radix component
            onSelect={
              !isNative
                ? opt.disabled
                  ? (e: Event) => e.preventDefault()
                  : () => handleAction(opt)
                : undefined
            }
            // for popover
            onClick={
              isNative && !opt.disabled ? () => handleAction(opt) : undefined
            }
          >
            {opt.label}
          </ItemComponent>
        </Fragment>
      ))}
    </>
  );
}
