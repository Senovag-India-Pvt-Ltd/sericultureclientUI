import React from "react";
import { P3FarmFormSummaryReport } from "./P3FarmFormSummaryShared";

// Sheet 6 — Feeding & Moulting (rows 15-22) · Monthly
// Different from the existing annual /p3-farm-annual-report/sheet6 — this is the
// per-month feeding/moult split per instar (2nd → 5th) from feeding_and_moult_test.
const cfg = {
  sheet: "6",
  endpoint: "p3-farm/sheet6",
  titleKn: "ಪ್ರಪತ್ರ 6 · ಮಾಸಿಕ ಆಹಾರ ಮತ್ತು ಜ್ವರ ವಿವರ — ಸಾಲುಗಳು 15–22",
  titleEn: "Monthly Feeding & Moult · rows 15-22",
  descEn:  "P3 Farms (Bivoltine) — 2nd–5th instar leaf count, leaf quantity, moult timings · CY",
  tagText: "P3 Farms · Bivoltine · Sheet-6 · Monthly F&M",
  icon: "🐛",
  palette: {
    primary: "#b45309", deep: "#78350f",
    light: "#fffbeb", lightHex: "#fde68a",
    ringHex: "rgba(180,83,9,.18)",
    gradientFrom: "#92400e", gradientMid: "#b45309", gradientTo: "#d97706",
    chipBg: "#fef3c7", chipBorder: "#fcd34d", chipText: "#92400e",
    subhdrA: "linear-gradient(135deg,#fde68a,#fcd34d)",
    subhdrB: "linear-gradient(135deg,#fcd34d,#fbbf24)",
    cellM: "linear-gradient(135deg,#fffbeb,#fef3c7)",
    cellC: "linear-gradient(135deg,#fef3c7,#fde68a)",
  },
};
export default function P3FarmSheet6FeedingMoultingReport() {
  return <P3FarmFormSummaryReport cfg={cfg} />;
}
