import useIsDesktop from "../hooks/useIsDesktop";

import Catalog from "./Catalog";
import Planner from "./Planner";

const HomePage = () => {
  const isDesktop = useIsDesktop();

  return (
    <div className="m-4 md:m-8 md:max-h-dvh overflow-hidden">
      <header className="sticky top-0 flex h-20 items-center justify-center bg-carpipink">
        <img src="/carpi-black.png" alt="Carpi Logo" className="h-full" />
      </header>

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
    </div>
  );
};

export default HomePage;
