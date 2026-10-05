// Farmer Indent – data layer.
// Everything comes from seedanddlf /farmer-indent APIs: one grainage-wise
// overview (farmers, indents, DFLs issued via Sale/Disposal of DFLs, crop
// inspections, fitness certificates, harvests) kept in a small shared store.
// Screens only use the store + derived helpers below.
import { useEffect, useSyncExternalStore } from "react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import Swal from "sweetalert2";
import api from "../../services/auth/api";

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;
const FI_API = `${baseURLSeedDfl}farmer-indent/`;

// DFL sales older than this (days) are not loaded unless linked to an indent
const HISTORY_DAYS = 365;
// A crop with no harvest / failure record this many days after hatching is
// treated as closed and leaves the running / due lists.
export const CROP_CLOSE_DAYS = 45;

// ─── Fixed lists ──────────────────────────────────────────────────────────
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
export const fmtDate = (s) => (s ? format(parseISO(s), "dd/MM/yyyy") : "–");
export const todayIso = () => iso(today());

// ─── API → screen shapes ──────────────────────────────────────────────────
const str = (v) => (v === null || v === undefined ? "" : String(v));
const num = (v) => (v === null || v === undefined || v === "" ? null : Number(v));
export const unitKey = (supplyType, supplyUnitId) => (supplyType && supplyUnitId != null ? `${supplyType}:${supplyUnitId}` : "");

// Farmers are keyed by FRUITS ID – DFL sales and indents both carry it.
function toFarmer(f) {
  // unregistered buyers: the sale only has "name, address"
  const [saleName, saleVillage] = str(f.saleName).split(",").map((x) => x.trim());
  return {
    id: f.fruitsId,
    fruitsId: f.fruitsId,
    farmerId: f.farmerId,
    registered: !!f.farmerId,
    farmerNumber: str(f.farmerNumber),
    name: str(f.farmerName) || saleName || f.fruitsId,
    fatherName: str(f.fatherName),
    mobile: str(f.mobile),
    village: str(f.village) || str(saleVillage),
    tsc: str(f.tsc),
    mulberryAcres: f.mulberryAcres == null ? null : Math.round(Number(f.mulberryAcres) * 100) / 100,
  };
}

function toIndent(i) {
  return {
    id: i.id,
    indentNo: str(i.indentNo),
    farmerId: i.fruitsId,
    fruitsId: i.fruitsId,
    grainageId: i.grainageId,
    supplyType: i.supplyType,
    supplyUnitId: i.supplyUnitId,
    unitId: unitKey(i.supplyType, i.supplyUnitId),
    unitName: str(i.supplyUnitName),
    sheetsOrdered: num(i.sheetsOrdered),
    dflsOrdered: num(i.dflsOrdered) || 0,
    indentDate: i.indentDate,
    status: i.status,
    farmerStatus: i.farmerStatus || "",
    source: i.source,
    cancelled: Number(i.cancelled) === 1 ? { reason: i.cancelReason, remarks: i.cancelRemarks || "", date: i.cancelledDate } : null,
  };
}

function toAssignment(a) {
  // egg_sheet_numbers holds the sheet count on most entries
  const sheets = /^\d+$/.test(str(a.eggSheetNumbers).trim()) ? Number(a.eggSheetNumbers) : null;
  return {
    id: a.id,
    indentId: a.indentId,
    fruitsId: a.fruitsId,
    lotNumber: str(a.lotNumber),
    race: str(a.race),
    eggSheetNumbers: str(a.eggSheetNumbers),
    sheetsAssigned: sheets,
    dflsAssigned: num(a.dflsAssigned) || 0,
    laidOnDate: a.laidOnDate,
    releaseDate: a.releaseDate,
    hatchingDate: a.hatchingDate || a.releaseDate || a.assignDate,
    assignDate: a.assignDate,
    ratePer100: num(a.ratePer100),
    invoiceNo: str(a.invoiceNo),
    marketed: Number(a.marketed) === 1,
    discarded: Number(a.discarded) === 1 ? { reason: a.discardReason, remarks: a.discardRemarks || "", date: a.discardedDate } : null,
  };
}

const toInspection = (i) => ({ ...i, failed: Number(i.failed) === 1, cropStatus: str(i.cropStatus), moult: str(i.moult), reason: str(i.reason), week: str(i.week), note: str(i.note) });
const toFitness = (f) => ({ ...f, fit: Number(f.fit) === 1, diseaseStatus: str(f.diseaseStatus), transactionDate: f.transactionDate || f.expectedMarketDate });

function toSupplyUnit(u) {
  const direct = u.supplyType === "DIRECT";
  return { id: unitKey(u.supplyType, u.id), supplyType: u.supplyType, supplyUnitId: u.id, type: direct ? "Direct" : "CRC", name: direct ? `Direct (Layings From ${u.name})` : u.name };
}

// ─── Store ────────────────────────────────────────────────────────────────
const EMPTY = {
  status: "idle", // idle | loading | ready | error
  error: null,
  grainage: null,
  grainageId: null,
  fromDate: null,
  farmers: [],
  extraFarmers: [], // picked in New Indent search, not yet part of the grainage list
  indents: [],
  assignments: [],
  inspections: [],
  fitness: [],
  harvests: [],
  supplyUnits: [],
  tscs: [],
};
let state = EMPTY;
const listeners = new Set();
function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}
const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };

export function useFiStore() {
  const s = useSyncExternalStore(subscribe, () => state);
  useEffect(() => { if (state.status === "idle") fiActions.reload(); }, []);
  return s;
}

const errorText = (err, fallback) => err?.response?.data?.message || err?.message || fallback;
const toast = (title, icon = "success") =>
  Swal.fire({ toast: true, position: "top-end", timer: 2200, showConfirmButton: false, icon, title, customClass: { popup: "fi-swal" } });
const showError = (text) => Swal.fire({ icon: "error", title: "Not saved", text, customClass: { popup: "fi-swal", confirmButton: "fi-swal-confirm" } });

// POST an action; AddResponse = { error, message, invoice_no }
async function post(path, body) {
  try {
    const { data } = await api.post(FI_API + path, body);
    if (data?.error) { showError(data.message); return null; }
    toast(data?.message || "Saved");
    await fiActions.reload();
    return data;
  } catch (err) {
    showError(errorText(err, "Something went wrong. Please try again."));
    return null;
  }
}

let loading = null;
export const fiActions = {
  reload() {
    if (loading) return loading;
    setState({ status: state.status === "ready" ? "ready" : "loading", error: null });
    loading = Promise.all([
      api.get(FI_API + "get-overview", { params: { days: HISTORY_DAYS } }),
      state.supplyUnits.length ? Promise.resolve(null) : api.get(FI_API + "get-supply-units"),
    ])
      .then(([ov, su]) => {
        const d = ov.data || {};
        if (d.error) { setState({ ...EMPTY, status: "error", error: d.message }); return; }
        const farmers = (d.farmers || []).map(toFarmer).sort((a, b) => a.name.localeCompare(b.name));
        setState({
          status: "ready",
          grainage: d.grainage,
          grainageId: d.grainage?.id,
          fromDate: d.fromDate,
          farmers,
          indents: (d.indents || []).map(toIndent),
          assignments: (d.assignments || []).map(toAssignment),
          inspections: (d.inspections || []).map(toInspection),
          fitness: (d.fitness || []).map(toFitness),
          harvests: d.harvests || [],
          tscs: [...new Set(farmers.map((f) => f.tsc).filter(Boolean))].sort(),
          ...(su ? { supplyUnits: (su.data || []).map(toSupplyUnit) } : {}),
        });
      })
      .catch((err) => setState({ status: "error", error: errorText(err, "Could not load Farmer Indent data") }))
      .finally(() => { loading = null; });
    return loading;
  },

  // new / edit indent (form fields as in IndentModal)
  saveIndent(indentId, f) {
    const unit = state.supplyUnits.find((u) => u.id === f.unitId);
    return post("save-info", {
      farmerIndentId: indentId || null,
      fruitsId: f.farmerId,
      supplyType: unit?.supplyType,
      supplyUnitId: unit?.supplyUnitId,
      sheetsOrdered: Number(f.sheetsOrdered),
      dflsOrdered: Number(f.dflsOrdered),
      indentDate: f.indentDate,
      indentStatus: f.status,
      farmerStatus: f.farmerStatus,
    });
  },
  updateStatus(indentId, patch) {
    return post("update-status", { farmerIndentId: indentId, indentStatus: patch.status, farmerStatus: patch.farmerStatus });
  },
  cancelIndent(indentId, reason, remarks) {
    return post("cancel", { farmerIndentId: indentId, reason, remarks });
  },
  restoreIndent(indentId) {
    return post(`restore/${indentId}`, {});
  },
  discardAssignment(saleId, reason, remarks) {
    return post("discard-assignment", { saleAndDisposalId: saleId, reason, remarks });
  },
  restoreAssignment(saleId) {
    return post("restore-assignment", { saleAndDisposalId: saleId });
  },

  // registered farmers by FRUITS ID / mobile / farmer number / name (min 3 chars)
  async searchFarmers(q) {
    try {
      const { data } = await api.get(FI_API + "search-farmers", { params: { q } });
      return (data || []).map(toFarmer);
    } catch (err) {
      return [];
    }
  },
  rememberFarmer(f) {
    if (f && !farmerById(state, f.id)) setState({ extraFarmers: [...state.extraFarmers, f] });
  },
};

// ─── Derived data (joins used by the screens) ────────────────────────────
export const farmerById = (s, id) => s.farmers.find((f) => f.id === id) || s.extraFarmers.find((f) => f.id === id);
export const unitById = (id) => state.supplyUnits.find((u) => u.id === id);
export const grainageById = (id) => (state.grainage && state.grainage.id === Number(id) ? state.grainage : null);
export const statusLabel = (key) => INDENT_STATUSES.find((x) => x.key === key)?.label || key;
export const unitName = (indent) => unitById(indent?.unitId)?.name || indent?.unitName || "–";

export function harvestTotals(h) {
  const seedKg = Number(h.seedKg) || 0;
  const reelingKg = Number(h.reelingKg) || 0;
  const perKg = Number(h.cocoonsPerKg) || 0;
  const totalKg = seedKg + reelingKg;
  const amount = seedKg * (Number(h.seedRate) || 0) + reelingKg * (Number(h.reelingRate) || 0) + (Number(h.bonus) || 0) + (Number(h.incentive) || 0);
  return { totalKg, seedNos: seedKg * perKg, reelingNos: reelingKg * perKg, totalNos: totalKg * perKg, amount };
}

// DFLs issued without an indent (direct Sale/Disposal entry)
const directIndent = (a) => ({ id: null, indentNo: "Direct sale", dflsOrdered: a.dflsAssigned, unitId: "", unitName: "", direct: true });
const unknownFarmer = (fruitsId) => ({ id: fruitsId, fruitsId, farmerNumber: "", name: fruitsId, fatherName: "", mobile: "", village: "", tsc: "", mulberryAcres: null });

// Full crop record for an assignment: farmer, indent, stage, inspection …
// Cached per store snapshot – every screen and the stepper use it.
let recCache = { s: null, recs: [] };
export function cropRecords(s) {
  if (recCache.s === s) return recCache.recs;
  const indents = new Map(s.indents.map((i) => [i.id, i]));
  const group = (list) => list.reduce((m, x) => m.set(x.assignmentId, [...(m.get(x.assignmentId) || []), x]), new Map());
  const insp = group(s.inspections);
  const fcs = group(s.fitness);
  const hvs = group(s.harvests);
  const now = today();
  const recs = s.assignments.map((a) => {
    const indent = (a.indentId && indents.get(a.indentId)) || directIndent(a);
    const farmer = farmerById(s, a.fruitsId) || unknownFarmer(a.fruitsId);
    const inspections = [...(insp.get(a.id) || [])].sort((x, y) => (x.date < y.date ? 1 : -1));
    const lastInspection = inspections[0] || null;
    const fc = (fcs.get(a.id) || [])[0] || null;
    // no matching seed-market entry but the lot was marked disposed at Seed Cocoon Inward
    const harvest = (hvs.get(a.id) || [])[0] || (a.marketed ? { marketedOnly: true, market: "Seed cocoon market" } : null);
    const failed = !!lastInspection?.failed;
    const day = differenceInCalendarDays(now, parseISO(a.hatchingDate));
    let stageKey;
    if (a.releaseDate && differenceInCalendarDays(now, parseISO(a.releaseDate)) < 0) stageKey = "release";
    else stageKey = STAGE_RULES.find(([lo, hi]) => day >= lo && day <= hi)[2];
    const stage = STAGES.find((x) => x.key === stageKey);
    const closed = !harvest && !failed && day > CROP_CLOSE_DAYS;
    return { a, indent, farmer, inspections, lastInspection, fc, harvest, failed, closed, day, stage, discarded: !!a.discarded };
  });
  recCache = { s, recs };
  return recs;
}

// Farmers who bought DFLs from / placed an indent with the grainage.
export function grainageFarmers(s) {
  const recs = cropRecords(s);
  const latestRec = new Map();
  recs.forEach((r) => {
    const cur = latestRec.get(r.farmer.id);
    if (!cur || cur.a.assignDate < r.a.assignDate) latestRec.set(r.farmer.id, r);
  });
  return s.farmers.map((f) => {
    const indents = s.indents.filter((i) => i.farmerId === f.id).sort((x, y) => (x.indentDate < y.indentDate ? 1 : -1));
    const last = indents.find((i) => !i.cancelled) || null;
    const byIndent = last ? recs.find((r) => r.indent.id === last.id) : null;
    return { ...f, indents, lastIndent: last, crop: byIndent || latestRec.get(f.id) || null };
  });
}
