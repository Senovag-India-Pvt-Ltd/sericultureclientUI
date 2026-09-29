// Farmer Indent – UI data layer.
// UI-only phase: all data below is demo data kept in memory (and in
// sessionStorage so a page refresh keeps demo edits). Every read/write goes
// through this file, so replacing it with real API calls later does not
// touch the screens.
import { useSyncExternalStore } from "react";
import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";

// ─── Masters (will come from master-data APIs) ───────────────────────────
export const GRAINAGES = [
  { id: 1, name: "Magadi", nameKn: "ಮಾಗಡಿ" },
  { id: 2, name: "Kudur", nameKn: "ಕುದೂರು" },
  { id: 3, name: "Solur", nameKn: "ಸೋಲೂರು" },
];

// "CRC / Direct" = grainages (direct supply) + registered CRCs
export const SUPPLY_UNITS = [
  { id: 1, name: "Direct (Layings From Magadi GG)", type: "Direct" },
  { id: 2, name: "Direct (Layings From Solur GG)", type: "Direct" },
  { id: 3, name: "Direct (Layings From Kudur GG)", type: "Direct" },
  { id: 4, name: "Kempegowda CRC (Mathikere)", type: "CRC" },
  { id: 5, name: "Sri Bhavani CRC (Koramangala)", type: "CRC" },
];

export const TSCS = ["Magadi", "Mathikere", "Kudur", "Solur", "Kalya"];
export const RACES = ["FC1 x FC2", "CSR2 x CSR4", "PM x CSR2", "Kolar Gold"];
export const MARKETS = ["Kudur Seed Market", "Magadi Seed Market", "Ramanagara Market"];
export const MOULTS = ["Chawki", "1st Moult", "2nd Moult", "3rd Moult", "4th Moult", "Spinning"];
export const CROP_STATUSES = ["Good", "Average", "Poor", "Failed"];
export const REASONS = [
  "Disease (Flacherie / Grasserie)",
  "Pesticide / poison in mulberry leaf",
  "Shortage of mulberry leaf",
  "Uzi fly attack",
  "Weather (heat / rain)",
  "Double entry",
  "Farmer not interested",
  "Other",
];
export const DISEASE_STATUSES = ["Free From All Diseases", "Flacherie", "Grasserie", "Muscardine", "Pebrine suspected"];
export const INSPECTION_STAGES = ["4th Moult", "5th Stage", "Spinning"];

export const INDENT_STATUSES = [
  { key: "captured", label: "Indent Captured" },
  { key: "assessment", label: "Cocoon Assessment Completed" },
  { key: "production", label: "DFLs In Production" },
  { key: "ready", label: "Ready to Assign DFLs" },
  { key: "assigned", label: "DFLs Assigned" },
];
export const FARMER_STATUSES = ["Rearing", "Ready to Harvest", "Ready to Market", "Dis-infection"];

// ─── Crop stages (calculated from Expected Date of Hatching) ─────────────
// Day ranges are relative to the hatching day. To be confirmed by the
// department (see requirement REQ-19).
export const STAGES = [
  { key: "release", label: "DFLs Release", color: "#64748b" },
  { key: "incubation", label: "Incubation", color: "#0ea5e9" },
  { key: "blackboxing", label: "Black-boxing", color: "#334155" },
  { key: "hatching", label: "Hatching", color: "#f59e0b" },
  { key: "moult1", label: "1st Moult", color: "#84cc16" },
  { key: "moult2", label: "2nd Moult", color: "#22c55e" },
  { key: "moult3", label: "3rd Moult", color: "#10b981" },
  { key: "moult4", label: "4th Moult", color: "#14b8a6" },
  { key: "spinning", label: "Spinning", color: "#8b5cf6" },
  { key: "market", label: "Market", color: "#1e67a8" },
];
const STAGE_RULES = [
  [-Infinity, -3, "incubation"],
  [-2, -1, "blackboxing"],
  [0, 2, "hatching"],
  [3, 6, "moult1"],
  [7, 10, "moult2"],
  [11, 15, "moult3"],
  [16, 21, "moult4"],
  [22, 27, "spinning"],
  [28, Infinity, "market"],
];

// ─── Date helpers ─────────────────────────────────────────────────────────
const today = () => new Date();
const iso = (d) => format(d, "yyyy-MM-dd");
const rel = (days) => iso(addDays(today(), days));
export const fmtDate = (s) => (s ? format(parseISO(s), "dd/MM/yyyy") : "–");
export const todayIso = () => iso(today());

// ─── Demo data ────────────────────────────────────────────────────────────
function seed() {
  const farmers = [
    ["Gangalakshmamma", "Kalaiah", "9741035847", "Siddapura", "Kalya", 2.0],
    ["Cheluvaiah", "Singraiah", "9740572232", "Dandinapalya", "Magadi", 1.5],
    ["Jayalakshmamma", "Ramanna", "9611006752", "Koramangala", "Mathikere", 3.0],
    ["Narasimhamurthy", "Marivenkatappa", "8296623391", "Kalyarepalya", "Magadi", 2.5],
    ["Raju", "Narasaiah", "9740361104", "Byranahalli", "Kudur", 1.0],
    ["Balaiah", "Mallaiah", "9611910170", "K D Halli", "Mathikere", 2.0],
    ["Kuntegowda", "Kuntegowda", "7259436892", "Byranahalli", "Magadi", 4.0],
    ["Harish", "Krishnappa", "9740685270", "Gollarahatti", "Kudur", 1.5],
    ["Nagaraju", "Mullaiah", "8105274078", "Sugganahalli", "Kudur", 2.0],
    ["Krishnappa", "Attappa", "8861610137", "Singarigowdanapalya", "Kalya", 3.5],
    ["Girish S V", "Venkataramanaiah", "7764549434", "Shivanasandra", "Kalya", 2.0],
    ["Shankarappa H R", "Late Ramaiah", "9036841537", "Hemapura", "Solur", 2.5],
    ["Ravikumar", "Mariyanna", "9538689641", "Kannasandra", "Solur", 1.0],
    ["Siddalingamurthy", "Gangaraiah", "9844173270", "Gollahalli", "Solur", 5.0],
  ].map(([name, father, mobile, village, tsc, acres], i) => ({
    id: i + 1,
    farmerNumber: `MGDSAF${String(495 + i * 37).padStart(4, "0")}`,
    fruitsId: `29010000${String(61840 + i * 1373).padStart(8, "0")}`,
    name,
    fatherName: father,
    mobile,
    village,
    tsc,
    mulberryAcres: acres,
    grainageId: i % 5 === 4 ? 2 : 1,
  }));

  // [farmerId, unitId, sheets, dfls, daysAgo, status, farmerStatus, cancelled?]
  const indentRows = [
    [1, 3, 6, 120, 32, "assigned", "Rearing"],
    [2, 1, 7, 140, 30, "assigned", "Ready to Market"],
    [3, 5, 4, 80, 28, "assigned", "Ready to Harvest"],
    [4, 4, 6, 120, 26, "assigned", "Rearing"],
    [5, 3, 5, 100, 24, "assigned", "Rearing"],
    [6, 4, 5, 100, 20, "assigned", "Rearing"],
    [7, 1, 5, 100, 17, "assigned", "Rearing"],
    [8, 3, 3, 60, 14, "assigned", "Rearing"],
    [9, 1, 8, 150, 12, "assigned", "Rearing"],
    [10, 4, 5, 100, 9, "ready", "Dis-infection"],
    [11, 1, 4, 75, 6, "production", "Dis-infection"],
    [12, 5, 6, 120, 4, "assessment", "Dis-infection"],
    [13, 1, 3, 50, 2, "captured", "Dis-infection"],
    [14, 3, 10, 200, 1, "captured", "Rearing"],
    [6, 4, 5, 100, 15, "captured", "Rearing", "Double entry"],
    [9, 1, 2, 40, 40, "captured", "Rearing", "Farmer not interested"],
  ];
  const indents = indentRows.map(([farmerId, unitId, sheets, dfls, daysAgo, status, fStatus, cancelReason], i) => ({
    id: i + 1,
    indentNo: `IND-2026-${String(101 + i).padStart(4, "0")}`,
    farmerId,
    grainageId: 1,
    unitId,
    sheetsOrdered: sheets,
    dflsOrdered: dfls,
    indentDate: rel(-daysAgo),
    status,
    farmerStatus: fStatus,
    cancelled: cancelReason ? { reason: cancelReason, date: rel(-daysAgo + 1), remarks: "" } : null,
  }));

  // assignment = Sale/Disposal of DFLs record linked to the indent
  const hatchOffsets = { 1: -34, 2: -30, 3: -26, 4: -24, 5: -19, 6: -13, 7: -8, 8: -4, 9: 3 };
  const assignments = Object.entries(hatchOffsets).map(([indentId, h], i) => {
    const ind = indents[indentId - 1];
    return {
      id: i + 1,
      indentId: Number(indentId),
      lotNumber: ["45 KR", "99 M", "100 M", "100 M", "112 KR", "118 M", "120 M", "124 KR", "130 M"][i],
      race: RACES[i % RACES.length],
      eggSheetNumbers: `ES-${200 + i * 7}–${200 + i * 7 + ind.sheetsOrdered - 1}`,
      sheetsAssigned: ind.sheetsOrdered,
      dflsAssigned: ind.dflsOrdered - (i === 3 ? 10 : 0),
      laidOnDate: rel(h - 11),
      releaseDate: rel(h - 2),
      hatchingDate: rel(h),
      assignDate: rel(h - 3),
      ratePer100: 1500,
      invoiceNo: `INV/MGD/${2026}/${String(310 + i)}`,
      discarded: null,
    };
  });

  const inspections = [
    { assignmentId: 1, date: rel(-20), moult: "3rd Moult", cropStatus: "Good", reason: "", week: 3, note: "Healthy crop" },
    { assignmentId: 2, date: rel(-14), moult: "4th Moult", cropStatus: "Good", reason: "", week: 3, note: "" },
    { assignmentId: 3, date: rel(-12), moult: "4th Moult", cropStatus: "Average", reason: "", week: 3, note: "Leaf quality average" },
    { assignmentId: 4, date: rel(-9), moult: "4th Moult", cropStatus: "Failed", reason: "Pesticide / poison in mulberry leaf", week: 3, note: "Neighbour sprayed pesticide" },
    { assignmentId: 5, date: rel(-6), moult: "3rd Moult", cropStatus: "Good", reason: "", week: 2, note: "" },
    { assignmentId: 6, date: rel(-2), moult: "2nd Moult", cropStatus: "Poor", reason: "Shortage of mulberry leaf", week: 2, note: "" },
  ].map((x, i) => ({ id: i + 1, ...x }));

  const fitness = [
    { assignmentId: 1, transactionDate: rel(-2), market: MARKETS[0], inspectedAt: "Spinning", spunFrom: rel(-9), spunTo: rel(-8), larvalExamAt: "5th Stage", diseaseStatus: "Free From All Diseases", fit: true, expectedKg: 78, chandies: 120 },
    { assignmentId: 2, transactionDate: rel(1), market: MARKETS[0], inspectedAt: "Spinning", spunFrom: rel(-5), spunTo: rel(-4), larvalExamAt: "5th Stage", diseaseStatus: "Free From All Diseases", fit: true, expectedKg: 92, chandies: 140 },
    { assignmentId: 3, transactionDate: rel(3), market: MARKETS[1], inspectedAt: "Spinning", spunFrom: rel(-1), spunTo: rel(0), larvalExamAt: "5th Stage", diseaseStatus: "Flacherie", fit: false, expectedKg: 30, chandies: 80 },
  ].map((x, i) => ({ id: i + 1, ...x }));

  const harvests = [
    { assignmentId: 1, marketDate: rel(-2), market: MARKETS[0], spunFrom: rel(-9), spunTo: rel(-8), cocoonsPerKg: 620, seedKg: 70, seedRate: 780, reelingKg: 8, reelingRate: 520, bonus: 1500, incentive: 2400 },
  ].map((x, i) => ({ id: i + 1, ...x }));

  return { farmers, indents, assignments, inspections, fitness, harvests, grainageId: 1 };
}

// ─── Store ────────────────────────────────────────────────────────────────
const KEY = "fi-demo-store-v1";
let state = (() => {
  try {
    const s = sessionStorage.getItem(KEY);
    if (s) return JSON.parse(s);
  } catch (e) { /* storage blocked – use fresh demo data */ }
  return seed();
})();
const listeners = new Set();
function setState(fn) {
  state = { ...state, ...fn(state) };
  try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  listeners.forEach((l) => l());
}
const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };
export function useFiStore() {
  return useSyncExternalStore(subscribe, () => state);
}
const nextId = (arr) => arr.reduce((m, x) => Math.max(m, x.id), 0) + 1;

export const fiActions = {
  addIndent(data) {
    setState((s) => {
      const id = nextId(s.indents);
      const indent = { id, indentNo: `IND-2026-${String(100 + id).padStart(4, "0")}`, grainageId: s.grainageId, status: "captured", cancelled: null, ...data };
      return { indents: [indent, ...s.indents] };
    });
  },
  updateIndent(id, patch) {
    setState((s) => ({ indents: s.indents.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  },
  cancelIndent(id, reason, remarks) {
    setState((s) => ({ indents: s.indents.map((x) => (x.id === id ? { ...x, cancelled: { reason, remarks, date: todayIso() } } : x)) }));
  },
  restoreIndent(id) {
    setState((s) => ({ indents: s.indents.map((x) => (x.id === id ? { ...x, cancelled: null } : x)) }));
  },
  assignDfls(indentId, data) {
    setState((s) => ({
      assignments: [{ id: nextId(s.assignments), indentId, assignDate: todayIso(), discarded: null, ...data }, ...s.assignments],
      indents: s.indents.map((x) => (x.id === indentId ? { ...x, status: "assigned", farmerStatus: "Rearing" } : x)),
    }));
  },
  updateAssignment(id, patch) {
    setState((s) => ({ assignments: s.assignments.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  },
  discardAssignment(id, reason, remarks) {
    setState((s) => ({ assignments: s.assignments.map((x) => (x.id === id ? { ...x, discarded: { reason, remarks, date: todayIso() } } : x)) }));
  },
  saveInspection(data) {
    setState((s) => data.id
      ? { inspections: s.inspections.map((x) => (x.id === data.id ? { ...x, ...data } : x)) }
      : { inspections: [{ ...data, id: nextId(s.inspections) }, ...s.inspections] });
  },
  saveFitness(data) {
    setState((s) => data.id
      ? { fitness: s.fitness.map((x) => (x.id === data.id ? { ...x, ...data } : x)) }
      : { fitness: [{ ...data, id: nextId(s.fitness) }, ...s.fitness] });
  },
  saveHarvest(data) {
    setState((s) => {
      const harvests = data.id
        ? s.harvests.map((x) => (x.id === data.id ? { ...x, ...data } : x))
        : [{ ...data, id: nextId(s.harvests) }, ...s.harvests];
      const a = s.assignments.find((x) => x.id === Number(data.assignmentId));
      const indents = a ? s.indents.map((x) => (x.id === a.indentId ? { ...x, farmerStatus: "Dis-infection" } : x)) : s.indents;
      return { harvests, indents };
    });
  },
  resetDemo() {
    setState(() => seed());
  },
};

// ─── Derived data (joins used by the screens) ────────────────────────────
export const farmerById = (s, id) => s.farmers.find((f) => f.id === id);
export const unitById = (id) => SUPPLY_UNITS.find((u) => u.id === Number(id));
export const grainageById = (id) => GRAINAGES.find((g) => g.id === Number(id));
export const statusLabel = (key) => INDENT_STATUSES.find((x) => x.key === key)?.label || key;

export function harvestTotals(h) {
  const seedKg = Number(h.seedKg) || 0;
  const reelingKg = Number(h.reelingKg) || 0;
  const perKg = Number(h.cocoonsPerKg) || 0;
  const totalKg = seedKg + reelingKg;
  const amount = seedKg * (Number(h.seedRate) || 0) + reelingKg * (Number(h.reelingRate) || 0) + (Number(h.bonus) || 0) + (Number(h.incentive) || 0);
  return { totalKg, seedNos: seedKg * perKg, reelingNos: reelingKg * perKg, totalNos: totalKg * perKg, amount };
}

// Full crop record for an assignment: farmer, indent, stage, inspection …
export function cropRecords(s) {
  return s.assignments
    .map((a) => {
      const indent = s.indents.find((i) => i.id === a.indentId);
      if (!indent) return null;
      const farmer = farmerById(s, indent.farmerId);
      const inspections = s.inspections.filter((x) => x.assignmentId === a.id).sort((x, y) => (x.date < y.date ? 1 : -1));
      const lastInspection = inspections[0] || null;
      const fc = s.fitness.find((x) => x.assignmentId === a.id) || null;
      const harvest = s.harvests.find((x) => x.assignmentId === a.id) || null;
      const failed = lastInspection?.cropStatus === "Failed";
      const day = differenceInCalendarDays(today(), parseISO(a.hatchingDate));
      let stageKey;
      if (differenceInCalendarDays(today(), parseISO(a.releaseDate)) < 0) stageKey = "release";
      else stageKey = STAGE_RULES.find(([lo, hi]) => day >= lo && day <= hi)[2];
      const stage = STAGES.find((x) => x.key === stageKey);
      return { a, indent, farmer, inspections, lastInspection, fc, harvest, failed, day, stage, discarded: !!a.discarded };
    })
    .filter(Boolean);
}

// Farmers of the logged-in grainage: registered to it, or having an
// indent / DFL sale from it.
export function grainageFarmers(s) {
  const recs = cropRecords(s);
  return s.farmers
    .map((f) => {
      const indents = s.indents.filter((i) => i.farmerId === f.id).sort((x, y) => (x.indentDate < y.indentDate ? 1 : -1));
      const active = indents.filter((i) => !i.cancelled);
      const last = active[0] || null;
      const crop = last ? recs.find((r) => r.indent.id === last.id) || null : null;
      return { ...f, indents, lastIndent: last, crop };
    })
    .filter((f) => f.grainageId === s.grainageId || f.indents.some((i) => i.grainageId === s.grainageId));
}
