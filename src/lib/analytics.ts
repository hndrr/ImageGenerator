import ReactGA from "react-ga4";

// Google Analyticsの測定ID（環境変数から取得）
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-XXXXXXXXXX";

// Google Analyticsの初期化
export const initGA = () => {
  if (typeof window !== "undefined") {
    ReactGA.initialize(MEASUREMENT_ID);
    console.log("Google Analytics initialized with ID:", MEASUREMENT_ID);
  }
};

// ページビューの追跡
export const logPageView = () => {
  if (typeof window !== "undefined") {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    console.log(`Logging pageview for ${window.location.pathname}`);
  }
};

// イベントの追跡
export const logEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined") {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
    console.log(`Logging event: ${category} - ${action} - ${label || "N/A"}`);
  }
};
