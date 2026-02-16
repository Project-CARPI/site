import useIsDesktop from "@/lib/hooks/useIsDesktop";
import Catalog from "@/pages/Catalog";
import Planner from "@/pages/Planner";

const HomePage = () => {
  const isDesktop = useIsDesktop();

  return (
    <div className="flex flex-row gap-8">
      <div className={isDesktop ? "w-1/3" : "w-full"}>
        <Catalog />
      </div>
      {isDesktop && (
        <div className="w-2/3">
          <Planner />
        </div>
      )}
    </div>
  );
};

export default HomePage;
