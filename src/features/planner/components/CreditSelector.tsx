import { useMemo } from "react";

import * as Select from "@radix-ui/react-select";

import Dropdown from "@/components/Dropdown";
import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import { cn } from "@/lib/classnames";

export default function CreditSelector({
  semesterId,
  courseId,
  currentCredits,
  minCredits,
  maxCredits,
}: {
  semesterId: string | null;
  courseId: string;
  currentCredits: number;
  minCredits: number;
  maxCredits: number;
}) {
  const { updateCourseCredits } = useCourseWorkspace();

  // Calculate if variable credits are needed
  const isVariableCredits = minCredits !== maxCredits;

  // Generate options range
  const creditOptions = useMemo(() => {
    if (!isVariableCredits) return [];
    const options = [];
    for (let i = minCredits; i <= maxCredits; i++) {
      options.push(i);
    }
    return options;
  }, [minCredits, maxCredits, isVariableCredits]);

  const handleCreditChange = (value: string | number) => {
    if (semesterId) {
      updateCourseCredits(semesterId, courseId, Number(value));
    }
  };

  if (!isVariableCredits) return null;

  // Handle pluralization edge case
  const creditText = currentCredits === 1 ? "credit" : "credits";

  return (
    <Dropdown
      selectedValue={currentCredits}
      onChange={handleCreditChange}
      options={creditOptions.map((c) => ({ value: c, label: c.toString() }))}
      trigger={
        <button
          className={cn(
            "items-center gap-1 text-sm rounded-lg px-1.5 py-0.5 border transition-colors",
            "bg-carpipink/10 border-carpipink/30 hover:bg-carpipink/20 ",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-carpipink",
          )}
          // onPointerDown={(e) => e.stopPropagation()}
          aria-label="Select credits"
        >
          <Select.Value className="font-bold" />
          <span className="text-xs opacity-80 block lg:hidden">cr</span>
          <span className="text-xs opacity-80 hidden lg:block">
            {creditText}
          </span>
        </button>
      }
      aria-label="Select credits"
    />
  );
}
