import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const navEntries = window.performance?.getEntriesByType?.("navigation") as PerformanceNavigationTiming[];
    const navType = navEntries?.[0];

    const delay = navType?.type === "back_forward" ? 100 : 0;

    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, delay);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default ScrollToTop;

