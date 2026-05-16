import React from "react";
import { P3FarmFormSummaryReport } from "./P3FarmFormSummaryShared";

// Sheet 5 — Monthly Crop Report Part 1 (rows 1-14)
// Crop count, chawki eggs, breeds, sources, lot batches, chawki %, microscope readings.
const cfg = {
  sheet: "5",
  endpoint: "p3-farm/sheet5",
  titleKn: "ಪ್ರಪತ್ರ 5 · ಮಾಸಿಕ ಬೆಳೆ ವರದಿ (ಭಾಗ 1) — ಸಾಲುಗಳು 1–14",
  titleEn: "Monthly Crop Report (Part 1) · rows 1-14",
  descEn:  "P3 Farms (Bivoltine) — chawki eggs, breeds, sources, microscope readings · CY vs PY",
  tagText: "P3 Farms · Bivoltine · Sheet-5 · Part 1",
  icon: "🌾",
  palette: {
    primary: "#0f766e", deep: "#134e4a",
    light: "#ecfdf5", lightHex: "#a7f3d0",
    ringHex: "rgba(15,118,110,.18)",
    gradientFrom: "#064e3b", gradientMid: "#0f766e", gradientTo: "#14b8a6",
    chipBg: "#d1fae5", chipBorder: "#6ee7b7", chipText: "#065f46",
    subhdrA: "linear-gradient(135deg,#99f6e4,#5eead4)",
    subhdrB: "linear-gradient(135deg,#5eead4,#2dd4bf)",
    cellM: "linear-gradient(135deg,#f0fdfa,#ccfbf1)",
    cellC: "linear-gradient(135deg,#ccfbf1,#99f6e4)",
  },
};
export default function P3FarmSheet5CropReportPart1() {
  return <P3FarmFormSummaryReport cfg={cfg} />;
}
