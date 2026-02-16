import { useMemo } from "react";

import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";

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

  const handleCreditChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (semesterId) {
      updateCourseCredits(semesterId, courseId, parseInt(e.target.value));
    }
  };

  if (!isVariableCredits) return null;

  return (
    <div
      className="relative flex items-center gap-1 text-sm bg-carpipink/10 rounded-lg px-1.5 py-0.5 border border-carpipink/30 hover:bg-carpipink/20 transition-colors"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <span className="font-bold">{currentCredits}</span>
      <span className="text-xs opacity-80 lg:hidden md:block">cr</span>
      <span className="text-xs opacity-80 lg:block md:hidden">credits</span>

      <select
        value={currentCredits}
        onChange={handleCreditChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none"
        aria-label="Select credits"
      >
        {creditOptions.map((c) => (
          <option key={c} value={c} className="text-darkblue">
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
