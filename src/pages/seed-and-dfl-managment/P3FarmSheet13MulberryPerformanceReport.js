import React from "react";
import { P3FarmFormSummaryReport } from "./P3FarmFormSummaryShared";

// Sheet 13 — Garden / Mulberry Performance (form summary)
// Garden area, planted area, variety mix (Local/M5/V1/S13/S36), irrigation, leaf yield.
const cfg = {
  sheet: "13",
  endpoint: "p3-farm/sheet13",
  titleKn: "ಪ್ರಪತ್ರ 13 · ತೋಟ / ಹಿಪ್ಪುನೇರಳೆ ಕಾರ್ಯ ನಿರ್ವಹಣಾ ವರದಿ",
  titleEn: "Garden / Mulberry Performance",
  descEn:  "P3 Farms (Bivoltine) — garden area, variety mix (Local/M5/V1/S13/S36), irrigation, leaf yield · CY",
  tagText: "P3 Farms · Bivoltine · Sheet-13 · Mulberry",
  icon: "🍃",
  palette: {
    primary: "#15803d", deep: "#14532d",
    light: "#f0fdf4", lightHex: "#bbf7d0",
    ringHex: "rgba(21,128,61,.18)",
    gradientFrom: "#14532d", gradientMid: "#15803d", gradientTo: "#22c55e",
    chipBg: "#dcfce7", chipBorder: "#86efac", chipText: "#15803d",
    subhdrA: "linear-gradient(135deg,#bbf7d0,#86efac)",
    subhdrB: "linear-gradient(135deg,#86efac,#4ade80)",
    cellM: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
    cellC: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
  },
};
export default function P3FarmSheet13MulberryPerformanceReport() {
  return <P3FarmFormSummaryReport cfg={cfg} />;
}
