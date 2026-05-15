import React from "react";
import { P3FarmFormSummaryReport } from "./P3FarmFormSummaryShared";

// Sheet 8 — Distribution / Sale (rows 34-37)
// Reeling dispatch, DFL-prep cocoons, market value, copy-to-office acknowledgements.
const cfg = {
  sheet: "8",
  endpoint: "p3-farm/sheet8",
  titleKn: "ಪ್ರಪತ್ರ 8 · ವಿಲೇವಾರಿ / ಮಾರಾಟ ವರದಿ — ಸಾಲುಗಳು 34–37",
  titleEn: "Distribution / Sale · rows 34-37",
  descEn:  "P3 Farms (Bivoltine) — reeling dispatch, DFL-prep cocoons, market value · CY vs PY",
  tagText: "P3 Farms · Bivoltine · Sheet-8 · Distribution",
  icon: "🚚",
  palette: {
    primary: "#3730a3", deep: "#312e81",
    light: "#eef2ff", lightHex: "#a5b4fc",
    ringHex: "rgba(55,48,163,.18)",
    gradientFrom: "#1e1b4b", gradientMid: "#3730a3", gradientTo: "#4f46e5",
    chipBg: "#e0e7ff", chipBorder: "#a5b4fc", chipText: "#3730a3",
    subhdrA: "linear-gradient(135deg,#c7d2fe,#a5b4fc)",
    subhdrB: "linear-gradient(135deg,#a5b4fc,#818cf8)",
    cellM: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
    cellC: "linear-gradient(135deg,#e0e7ff,#c7d2fe)",
  },
};
export default function P3FarmSheet8DistributionSaleReport() {
  return <P3FarmFormSummaryReport cfg={cfg} />;
}
