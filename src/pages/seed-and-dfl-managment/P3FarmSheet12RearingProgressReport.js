import React from "react";
import { P3FarmFormSummaryReport } from "./P3FarmFormSummaryShared";

// Sheet 12 — Rearing Section Crop Progress (form summary)
// Crop count, breed/lot, dfls received, chawki %, worm weight, ERR, leaf used.
const cfg = {
  sheet: "12",
  endpoint: "p3-farm/sheet12",
  titleKn: "ಪ್ರಪತ್ರ 12 · ಹುಳು ಸಾಕಾಣಿಕಾ ವಿಭಾಗದ ಬೆಳೆ ಪ್ರಗತಿ ವರದಿ",
  titleEn: "Rearing Section Crop Progress",
  descEn:  "P3 Farms (Bivoltine) — chawki %, mortality, worm weight, ERR, leaf consumption · CY vs PY",
  tagText: "P3 Farms · Bivoltine · Sheet-12 · Rearing",
  icon: "🐛",
  palette: {
    primary: "#7c2d12", deep: "#7c2d12",
    light: "#fef2f2", lightHex: "#fecaca",
    ringHex: "rgba(124,45,18,.18)",
    gradientFrom: "#7c2d12", gradientMid: "#9a3412", gradientTo: "#c2410c",
    chipBg: "#ffedd5", chipBorder: "#fdba74", chipText: "#9a3412",
    subhdrA: "linear-gradient(135deg,#fed7aa,#fdba74)",
    subhdrB: "linear-gradient(135deg,#fdba74,#fb923c)",
    cellM: "linear-gradient(135deg,#fff7ed,#ffedd5)",
    cellC: "linear-gradient(135deg,#ffedd5,#fed7aa)",
  },
};
export default function P3FarmSheet12RearingProgressReport() {
  return <P3FarmFormSummaryReport cfg={cfg} />;
}
