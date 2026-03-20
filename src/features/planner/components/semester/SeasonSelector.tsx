import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import { cn } from "@/lib/classnames";
import { SemesterSeason } from "@/lib/types";

const seasons: SemesterSeason[] = ["Fall", "Spring", "Summer"];

export default function SeasonSelector({
  season,
  semesterID,
}: {
  season: SemesterSeason;
  semesterID: string;
}) {
  const { updateSemesterSeason } = useCourseWorkspace();

  const seasonDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeason = e.target.value as SemesterSeason;
    updateSemesterSeason(semesterID, newSeason);
  };

  return (
    <div
      className={cn(
        "relative inline-grid items-center rounded-full px-3 py-1 font-medium text-xs",
        "hover:bg-darkblue/80 bg-darkblue text-carpipink",
      )}
    >
      <span className="invisible whitespace-pre">{season.toUpperCase()}</span>

      <select
        value={season}
        onChange={seasonDropdown}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        {seasons.map((season) => (
          <option key={season} value={season}>
            {season.toUpperCase()}
          </option>
        ))}
      </select>

      <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {season.toUpperCase()}
      </span>
    </div>
  );
}
