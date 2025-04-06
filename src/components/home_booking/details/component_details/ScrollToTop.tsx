import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const navType = window.performance?.getEntriesByType?.("navigation")[0];

    // Nếu là back/forward (type = "back_forward") thì đợi chút rồi mới scroll lại
    const delay = navType?.type === "back_forward" ? 100 : 0;

    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, delay);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
