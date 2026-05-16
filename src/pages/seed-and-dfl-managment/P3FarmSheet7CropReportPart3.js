import React from "react";
import { P3FarmFormSummaryReport } from "./P3FarmFormSummaryShared";

// Sheet 7 — Monthly Crop Report Part 3 (rows 23-37)
// Disease detection by stage, cocoon weight, leaf used, production, seed dispatch,
// reeling dispatch, DFL-prep cocoons, market value, and copy-to-office acknowledgements.
// (rows 34-37 were formerly Sheet 8 — Sl numbers are continuous so they're returned together.)
const cfg = {
  sheet: "7",
  endpoint: "p3-farm/sheet7",
  titleKn: "ಪ್ರಪತ್ರ 7 · ಮಾಸಿಕ ಬೆಳೆ ವರದಿ (ಭಾಗ 3) — ಸಾಲುಗಳು 23–37",
  titleEn: "Monthly Crop Report (Part 3) · rows 23-37",
  descEn:  "P3 Farms (Bivoltine) — disease detection, cocoon weight, leaf used, production, reeling dispatch, DFL-prep cocoons · CY vs PY",
  tagText: "P3 Farms · Bivoltine · Sheet-7 · Part 3 (rows 23–37)",
  icon: "🪺",
  palette: {
    primary: "#9f1239", deep: "#881337",
    light: "#fff1f2", lightHex: "#fda4af",
    ringHex: "rgba(159,18,57,.18)",
    gradientFrom: "#881337", gradientMid: "#9f1239", gradientTo: "#be123c",
    chipBg: "#ffe4e6", chipBorder: "#fda4af", chipText: "#9f1239",
    subhdrA: "linear-gradient(135deg,#fecdd3,#fda4af)",
    subhdrB: "linear-gradient(135deg,#fda4af,#fb7185)",
    cellM: "linear-gradient(135deg,#fff1f2,#ffe4e6)",
    cellC: "linear-gradient(135deg,#ffe4e6,#fecdd3)",
  },
};
export default function P3FarmSheet7CropReportPart3() {
  return <P3FarmFormSummaryReport cfg={cfg} />;
}
