import { useState, useEffect } from "react";

const DESKTOP_BREAKPOINT = 1024;
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth > DESKTOP_BREAKPOINT,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > DESKTOP_BREAKPOINT);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDesktop;
};

export default useIsDesktop;
