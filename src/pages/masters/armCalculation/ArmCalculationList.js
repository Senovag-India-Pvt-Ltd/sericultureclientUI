import React, { useState, useEffect } from "react";
import { Card, Button, Nav, Table, Badge, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import Swal from "sweetalert2";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const ARM_ENDS = ["120", "200", "400"];
// Category tabs are resolved by NAME (not a hardcoded scCategoryId) against the real
// sc_category master data — the IDs are auto-generated per environment and previously
// drifted out of sync with these labels (e.g. id 3 was actually "SCSP-422", not "General"),
// silently mis-tagging every component added under the wrong tab.
const CATEGORY_LABELS = ["General", "TSP", "SCSP"];
// Central/State % funding split is a fixed policy per category (mirrors ArmCalculation.js's
// CATEGORY_POLICY) — used to pre-fill the inline insert form so leaving these blank doesn't
// silently save 0% instead of the category's real split.
const CATEGORY_POLICY = {
  General: { central: 50, state: 25 },
  TSP:     { central: 65, state: 25 },
  SCSP:    { central: 65, state: 25 },
};

const fmt = (v) =>
  v == null ? "—" : `₹ ${parseFloat(v).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

function ArmCalculationList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [allData, setAllData]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [activeArm, setActiveArm] = useState("120");
  const [activeCat, setActiveCat] = useState("General");
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving]           = useState(false);
  const [newRowType, setNewRowType]   = useState("Component Details");
  const emptyRow = { equipmentName: "", quantity: "", unitRate: "", unitCost: "" };
  const [newRow, setNewRow] = useState(emptyRow);
  const [scCategoryList, setScCategoryList] = useState([]);
  const [componentTypeList, setComponentTypeList] = useState([]);
  const [componentList, setComponentList] = useState([]);
  const [newComponentTypeId, setNewComponentTypeId] = useState("");
  const [newComponentId, setNewComponentId] = useState("");

  // Inline Edit -- expands in place within the table (closed by default), instead of
  // navigating to a separate page. Its Central/State/Advance/First/Final/Min/Max come from
  // the SAME `groupSettings` state as the Insert form and the Group Settings panel below --
  // never a separate copy -- so the displayed percentages can never drift from what gets saved.
  const emptyEditRow = { equipmentName: "", quantity: "", unitRate: "", unitCost: "" };
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState(emptyEditRow);
  const [editComponentTypeId, setEditComponentTypeId] = useState("");
  const [editComponentId, setEditComponentId] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Central%/State%/Advance%/First%/Final%/Min/Max are entered ONCE per (armEnds, category)
  // group here, instead of being re-typed for every component row. Saving this panel bulk-applies
  // the values to every existing component in the group via armCalculation/update-group-settings,
  // and new components inserted under this group also use these values automatically.
  const emptyGroupSettings = { centralPercentage: "", statePercentage: "", advancePercentage: "", firstPayment: "", finalPayment: "", projectCostMin: "", projectCostMax: "" };
  const [groupSettings, setGroupSettings] = useState(emptyGroupSettings);
  const [savingGroup, setSavingGroup] = useState(false);

  const loadAll = () => {
    setLoading(true);
    api
      .get(baseURL + "armCalculation/list", { params: { pageNumber: 0, size: 500 } })
      .then((r) => {
        const c = r.data.content || {};
        setAllData(c.armCalculation || []);
        setLoading(false);
      })
      .catch(() => { setAllData([]); setLoading(false); });
  };

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    api.get(baseURL + "scCategory/get-all")
      .then((r) => setScCategoryList((r.data.content?.scCategory || []).filter((c) => c.active !== false)))
      .catch(() => setScCategoryList([]));
    api.get(baseURL + "scSubSchemeDetails/get-all")
      .then((r) => setComponentTypeList(r.data.content?.scSubSchemeDetails || []))
      .catch(() => setComponentTypeList([]));
    api.get(baseURL + "scComponent/get-all")
      .then((r) => setComponentList(r.data.content?.scComponent || []))
      .catch(() => setComponentList([]));
  }, []);

  // Resolve each tab's scCategoryId by matching the real, active sc_category name — never
  // hardcode the numeric id, since it's auto-generated per environment (see note above).
  const CATEGORIES = CATEGORY_LABELS.map((label) => {
    const match = scCategoryList.find((c) =>
      (c.categoryName || "").toLowerCase().startsWith(label.toLowerCase())
    );
    return { label, id: match ? match.scCategoryId : null };
  });

  const handleNewRowChange = (field, value) => {
    setNewRow((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "quantity" || field === "unitRate") {
        const q = parseFloat(field === "quantity" ? value : prev.quantity) || 0;
        const r = parseFloat(field === "unitRate"  ? value : prev.unitRate)  || 0;
        if (q && r) next.unitCost = String(q * r);
      }
      return next;
    });
  };

  const handleInsert = () => {
    if (!newRow.equipmentName.trim() || !newRow.quantity || !newRow.unitRate) {
      Swal.fire({ icon: "warning", title: t("Validation"), text: t("Equipment Name, Quantity and Unit Rate are required") });
      return;
    }
    const qty  = parseFloat(newRow.quantity)  || 0;
    const rate = parseFloat(newRow.unitRate)   || 0;
    const cost = parseFloat(newRow.unitCost)   || qty * rate;
    let finalName = newRow.equipmentName.trim();
    if (newRowType === "IBR Boiler" && !finalName.toLowerCase().includes("ibr boiler")) {
      finalName = "IBR Boiler " + finalName;
    }
    setSaving(true);
    api.post(baseURL + "armCalculation/add", {
      equipmentName:      finalName,
      quantity:           qty,
      unitRate:           rate,
      unitCost:           cost,
      armEnds:            activeArm,
      scCategoryId:       activeCatId,
      componentTypeId:    newComponentTypeId || null,
      componentId:        newComponentId || null,
      // Central/State/Advance/First/Final/Min/Max come from the group settings panel
      // (entered once per armEnds+category), not re-typed per component.
      centralPercentage:  parseFloat(groupSettings.centralPercentage) || 0,
      statePercentage:    parseFloat(groupSettings.statePercentage)   || 0,
      advancePercentage:  parseFloat(groupSettings.advancePercentage) || 0,
      firstPayment:       parseFloat(groupSettings.firstPayment)      || 0,
      finalPayment:       parseFloat(groupSettings.finalPayment)      || 0,
      projectCostMin:     groupSettings.projectCostMin ? parseFloat(groupSettings.projectCostMin) : null,
      projectCostMax:     groupSettings.projectCostMax ? parseFloat(groupSettings.projectCostMax) : null,
      active:             true,
    })
      .then(() => {
        loadAll();
        setNewRow(emptyRow);
        setNewComponentTypeId("");
        setNewComponentId("");
        setNewRowType("Component Details");
        setShowAddForm(false);
        setSaving(false);
        Swal.fire({ icon: "success", title: t("Inserted"), text: t("Component inserted successfully"), timer: 1500, showConfirmButton: false });
      })
      .catch(() => {
        setSaving(false);
        Swal.fire({ icon: "error", title: t("Error"), text: t("Failed to insert component") });
      });
  };

  const handleEditRowChange = (field, value) => {
    setEditRow((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "quantity" || field === "unitRate") {
        const q = parseFloat(field === "quantity" ? value : prev.quantity) || 0;
        const r = parseFloat(field === "unitRate"  ? value : prev.unitRate)  || 0;
        if (q && r) next.unitCost = String(q * r);
      }
      return next;
    });
  };

  const openEdit = (row) => {
    setEditingId(row.armCalculationId);
    setEditRow({
      equipmentName: row.equipmentName || "",
      quantity:      row.quantity != null ? String(row.quantity) : "",
      unitRate:      row.unitRate != null ? String(row.unitRate) : "",
      unitCost:      row.unitCost != null ? String(row.unitCost) : "",
    });
    setEditComponentTypeId(row.componentTypeId || "");
    setEditComponentId(row.componentId || "");
  };

  const closeEdit = () => {
    setEditingId(null);
    setEditRow(emptyEditRow);
    setEditComponentTypeId("");
    setEditComponentId("");
  };

  const handleSaveEdit = () => {
    if (!editRow.equipmentName.trim() || !editRow.quantity || !editRow.unitRate) {
      Swal.fire({ icon: "warning", title: t("Validation"), text: t("Equipment Name, Quantity and Unit Rate are required") });
      return;
    }
    const qty  = parseFloat(editRow.quantity) || 0;
    const rate = parseFloat(editRow.unitRate)  || 0;
    const cost = parseFloat(editRow.unitCost)  || qty * rate;
    setSavingEdit(true);
    api.post(baseURL + "armCalculation/edit", {
      armCalculationId:   editingId,
      equipmentName:      editRow.equipmentName.trim(),
      quantity:           qty,
      unitRate:           rate,
      unitCost:           cost,
      armEnds:            activeArm,
      scCategoryId:       activeCatId,
      componentTypeId:    editComponentTypeId || null,
      componentId:        editComponentId || null,
      // Same shared groupSettings the user sees on screen -- never a separate stale copy.
      centralPercentage:  parseFloat(groupSettings.centralPercentage) || 0,
      statePercentage:    parseFloat(groupSettings.statePercentage)   || 0,
      advancePercentage:  parseFloat(groupSettings.advancePercentage) || 0,
      firstPayment:       parseFloat(groupSettings.firstPayment)      || 0,
      finalPayment:       parseFloat(groupSettings.finalPayment)      || 0,
      projectCostMin:     groupSettings.projectCostMin ? parseFloat(groupSettings.projectCostMin) : null,
      projectCostMax:     groupSettings.projectCostMax ? parseFloat(groupSettings.projectCostMax) : null,
      active:             true,
    })
      .then(() => {
        loadAll();
        closeEdit();
        setSavingEdit(false);
        Swal.fire({ icon: "success", title: t("Updated"), text: t("Component updated successfully"), timer: 1500, showConfirmButton: false });
      })
      .catch(() => {
        setSavingEdit(false);
        Swal.fire({ icon: "error", title: t("Error"), text: t("Failed to update component") });
      });
  };

  const activeCatId   = CATEGORIES.find((c) => c.label === activeCat)?.id;
  const filteredData  = allData.filter(
    (r) => r.armEnds === activeArm && Number(r.scCategoryId) === activeCatId
  );

  const isIbr        = (name) => (name || "").toLowerCase().includes("ibr boiler");
  const mainRows     = filteredData.filter((r) => !isIbr(r.equipmentName));
  const ibrRows      = filteredData.filter((r) =>  isIbr(r.equipmentName));
  const mainUnitCost = mainRows.reduce((s, r) => s + (parseFloat(r.unitCost) || 0), 0);
  const ibrUnitCost  = ibrRows.reduce((s, r)  => s + (parseFloat(r.unitCost) || 0), 0);
  const totalUnitCost = mainUnitCost + ibrUnitCost;
  const firstRow      = filteredData[0];

  // Re-sync the group settings panel whenever the active Ends/Category tab (or its data) changes --
  // pre-fill from the group's existing saved values, or the category's default %-split if the
  // group has no components yet.
  useEffect(() => {
    if (firstRow) {
      setGroupSettings({
        centralPercentage: firstRow.centralPercentage != null ? String(firstRow.centralPercentage) : "",
        statePercentage:   firstRow.statePercentage   != null ? String(firstRow.statePercentage)   : "",
        advancePercentage: firstRow.advancePercentage != null ? String(firstRow.advancePercentage) : "",
        firstPayment:      firstRow.firstPayment      != null ? String(firstRow.firstPayment)      : "",
        finalPayment:      firstRow.finalPayment      != null ? String(firstRow.finalPayment)      : "",
        projectCostMin:    firstRow.projectCostMin    != null ? String(firstRow.projectCostMin)    : "",
        projectCostMax:    firstRow.projectCostMax    != null ? String(firstRow.projectCostMax)    : "",
      });
    } else {
      const policy = CATEGORY_POLICY[activeCat];
      setGroupSettings({
        ...emptyGroupSettings,
        centralPercentage: policy ? String(policy.central) : "",
        statePercentage:   policy ? String(policy.state)   : "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeArm, activeCat, allData]);

  const handleGroupSettingChange = (field, value) => {
    setGroupSettings((prev) => ({ ...prev, [field]: value }));
  };

  const saveGroupSettings = () => {
    if (!activeCatId) return;
    setSavingGroup(true);
    api.post(baseURL + "armCalculation/update-group-settings", {
      armEnds:            activeArm,
      scCategoryId:        activeCatId,
      centralPercentage:  parseFloat(groupSettings.centralPercentage) || 0,
      statePercentage:    parseFloat(groupSettings.statePercentage)   || 0,
      advancePercentage:  parseFloat(groupSettings.advancePercentage) || 0,
      firstPayment:       parseFloat(groupSettings.firstPayment)      || 0,
      finalPayment:       parseFloat(groupSettings.finalPayment)      || 0,
      projectCostMin:     groupSettings.projectCostMin ? parseFloat(groupSettings.projectCostMin) : null,
      projectCostMax:     groupSettings.projectCostMax ? parseFloat(groupSettings.projectCostMax) : null,
    })
      .then((r) => {
        setSavingGroup(false);
        loadAll();
        const count = r.data.content?.updatedCount ?? 0;
        Swal.fire({
          icon: "success", title: t("Saved"),
          text: count > 0
            ? t("Applied to") + ` ${count} ` + t("existing component(s) in this group")
            : t("Saved -- will apply to new components added to this group"),
          timer: 1800, showConfirmButton: false,
        });
      })
      .catch(() => {
        setSavingGroup(false);
        Swal.fire({ icon: "error", title: t("Error"), text: t("Failed to save group settings") });
      });
  };

  const deleteConfirm = (id) => {
    Swal.fire({
      title: t("Are you sure?"),
      text: t("It will delete permanently!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, delete it!"),
    }).then((result) => {
      if (result.value) {
        api
          .delete(baseURL + `armCalculation/delete/${id}`)
          .then(() => { loadAll(); Swal.fire(t("Deleted"), t("Record deleted successfully"), "success"); })
          .catch(() => Swal.fire({ icon: "error", title: t("Error"), text: t("Delete failed!") }));
      }
    });
  };

  /* ─── styles ────────────────────────────────────────────────── */
  const thStyle = { padding: "12px 14px", color: "#374151", fontWeight: 700, background: "#f0f5fb", whiteSpace: "nowrap" };
  const tdStyle = { padding: "10px 14px", verticalAlign: "middle" };

  // Inline Edit panel rendered as an expanded table row directly under the component being
  // edited -- keeps the whole already-added list visible while editing (closed by default,
  // only this one row's form appears, and only after clicking its Edit button).
  const renderEditPanelRow = (r) => {
    if (editingId !== r.armCalculationId) return null;
    return (
      <tr key={`${r.armCalculationId}-edit`}>
        <td colSpan={7} style={{ padding: 0, background: "#eff6ff", borderBottom: "1px solid #bfdbfe" }}>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ fontWeight: 700, color: "#1e40af", fontSize: "13px", marginBottom: "10px" }}>
              ✏️ {t("Edit Component")}
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: "12px", flexWrap: "wrap" }}>
              <div style={{ minWidth: 200, flex: "1 1 200px" }}>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Component Type")}</label>
                <Form.Select
                  size="sm"
                  value={editComponentTypeId}
                  onChange={(e) => setEditComponentTypeId(e.target.value)}
                  style={{ borderColor: "#93c5fd", borderRadius: "6px" }}
                >
                  <option value="">{t("-- Select Component Type --")}</option>
                  {componentTypeList.map((c) => (
                    <option key={c.scSubSchemeDetailsId} value={c.scSubSchemeDetailsId}>{c.subSchemeName}</option>
                  ))}
                </Form.Select>
              </div>
              <div style={{ minWidth: 200, flex: "1 1 200px" }}>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Component")}</label>
                <Form.Select
                  size="sm"
                  value={editComponentId}
                  onChange={(e) => setEditComponentId(e.target.value)}
                  style={{ borderColor: "#93c5fd", borderRadius: "6px" }}
                >
                  <option value="">{t("-- Select Component --")}</option>
                  {componentList.map((c) => (
                    <option key={c.scComponentId} value={c.scComponentId}>{c.scComponentName}</option>
                  ))}
                </Form.Select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "10px", alignItems: "end" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Equipment Name")} *</label>
                <Form.Control
                  size="sm" type="text"
                  value={editRow.equipmentName}
                  onChange={(e) => handleEditRowChange("equipmentName", e.target.value)}
                  style={{ borderColor: "#93c5fd", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Qty")} *</label>
                <Form.Control
                  size="sm" type="number" min="0"
                  value={editRow.quantity}
                  onChange={(e) => handleEditRowChange("quantity", e.target.value)}
                  style={{ borderColor: "#93c5fd", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Unit Rate")} *</label>
                <Form.Control
                  size="sm" type="number" min="0"
                  value={editRow.unitRate}
                  onChange={(e) => handleEditRowChange("unitRate", e.target.value)}
                  style={{ borderColor: "#93c5fd", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Unit Cost")}</label>
                <Form.Control
                  size="sm" type="number" min="0"
                  value={editRow.unitCost}
                  onChange={(e) => handleEditRowChange("unitCost", e.target.value)}
                  style={{ borderColor: "#93c5fd", borderRadius: "6px", background: "#eff6ff" }}
                />
              </div>
            </div>
            <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "8px" }}>
              {t("Central%/State%/Advance%/First%/Final%/Min/Max come from the Group Settings panel below")}.
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
              <Button
                size="sm" disabled={savingEdit}
                onClick={handleSaveEdit}
                style={{ background: "linear-gradient(135deg,#1e67a8,#2d9cdb)", border: "none", borderRadius: "7px", padding: "7px 22px", fontWeight: 600, fontSize: "13px", color: "#fff" }}
              >
                {savingEdit ? t("Saving...") : t("Save")}
              </Button>
              <Button
                size="sm" variant="light"
                onClick={closeEdit}
                style={{ borderRadius: "7px", padding: "7px 18px", fontWeight: 500, fontSize: "13px", border: "1px solid #dbeafe" }}
              >
                {t("Cancel")}
              </Button>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  // Dedicated print view for the current group's summary -- hidden on screen, shown only
  // via @media print, built from the same derived data as the on-screen tables. Kept entirely
  // separate from the interactive UI (tabs/forms/buttons) so printing never has to fight with
  // hiding those without breaking page layout.
  const renderPrintArea = () => (
    <div className="arm-print-only">
      <div className="arm-print-header">
        <div className="arm-print-title">{activeArm} — {activeCat} {t("Category")}</div>
        <div className="arm-print-meta">
          {filteredData.length} {t("components")}
          {firstRow?.centralPercentage != null && (
            <span> &nbsp;|&nbsp; {t("Central")} {firstRow.centralPercentage}% &nbsp;|&nbsp; {t("State")} {firstRow.statePercentage}%</span>
          )}
        </div>
      </div>
      {mainRows.length > 0 && (
        <>
          <div className="arm-print-section-label">1. {t("Component Details")}</div>
          <table className="arm-print-table">
            <thead>
              <tr>
                <th>#</th><th>{t("Equipment Name")}</th><th>{t("Qty")}</th><th>{t("Unit Rate")}</th><th>{t("Total Amount")}</th><th>{t("Unit Cost")}</th>
              </tr>
            </thead>
            <tbody>
              {mainRows.map((r, idx) => {
                const total = r.totalAmount != null ? r.totalAmount : (r.quantity && r.unitRate ? parseFloat(r.quantity) * parseFloat(r.unitRate) : null);
                return (
                  <tr key={r.armCalculationId}>
                    <td>{idx + 1}</td><td>{r.equipmentName}</td><td>{r.quantity}</td><td>{fmt(r.unitRate)}</td><td>{fmt(total)}</td><td>{fmt(r.unitCost)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr><td colSpan={4} style={{ textAlign: "right" }}>{t("Sub Total")} ({mainRows.length} {t("components")}):</td><td>{fmt(mainUnitCost)}</td><td /></tr>
            </tfoot>
          </table>
        </>
      )}
      {ibrRows.length > 0 && (
        <>
          <div className="arm-print-section-label">2. {t("IBR Boiler")}</div>
          <table className="arm-print-table">
            <thead>
              <tr>
                <th>#</th><th>{t("Equipment Name")}</th><th>{t("Qty")}</th><th>{t("Unit Rate")}</th><th>{t("Total Amount")}</th><th>{t("Unit Cost")}</th>
              </tr>
            </thead>
            <tbody>
              {ibrRows.map((r, idx) => {
                const total = r.totalAmount != null ? r.totalAmount : (r.quantity && r.unitRate ? parseFloat(r.quantity) * parseFloat(r.unitRate) : null);
                return (
                  <tr key={r.armCalculationId}>
                    <td>{idx + 1}</td><td>{r.equipmentName}</td><td>{r.quantity}</td><td>{fmt(r.unitRate)}</td><td>{fmt(total)}</td><td>{fmt(r.unitCost)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr><td colSpan={4} style={{ textAlign: "right" }}>{t("IBR Boiler Sub Total")}:</td><td>{fmt(ibrUnitCost)}</td><td /></tr>
            </tfoot>
          </table>
        </>
      )}
      <div className="arm-print-grand-total">
        {t("Grand Total")} ({filteredData.length} {t("components")}): {fmt(totalUnitCost)}
      </div>
    </div>
  );

  return (
    <Layout title={t("ARM Calculation")}>
      <style>{armCalculationListHeaderStyles}</style>
      {renderPrintArea()}
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("ARM Calculation Master")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <div className="d-flex gap-2">
                <Button
                  onClick={() => window.print()}
                  className="d-none d-md-inline-flex sh-cta-btn"
                  style={{ alignItems: "center", gap: "6px" }}
                >
                  <Icon name="printer" /><span>{t("Print")}</span>
                </Button>
              </div>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── ARM Ends outer pill tabs ───────────────────────────── */}
        <Nav variant="pills" className="gap-2 mb-3 flex-nowrap">
          {ARM_ENDS.map((e) => (
            <Nav.Item key={e}>
              <Nav.Link
                active={activeArm === e}
                onClick={() => { setActiveArm(e); setActiveCat("General"); setShowAddForm(false); setNewRow(emptyRow); setNewComponentTypeId(""); setNewComponentId(""); setNewRowType("Component Details"); }}
                style={
                  activeArm === e
                    ? { background: "#1e67a8", color: "#fff", fontWeight: 700, borderRadius: "8px", cursor: "pointer" }
                    : { color: "#1e67a8", border: "1.5px solid #1e67a8", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }
                }
              >
                {t(e)}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)" }}>

          {/* card header */}
          <div style={{ background: "linear-gradient(135deg,#1e67a8,#2d9cdb)", padding: "14px 24px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>⚙️</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{activeArm} — {activeCat} {t("Category")}</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>
                  {filteredData.length} {t("components")}
                  {firstRow?.centralPercentage != null && (
                    <span style={{ marginLeft: 10, background: "rgba(255,255,255,0.2)", borderRadius: 4, padding: "2px 8px" }}>
                      Central {firstRow.centralPercentage}% &nbsp;|&nbsp; State {firstRow.statePercentage}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            {totalUnitCost > 0 && (
              <div style={{ color: "#fff", textAlign: "right" }}>
                <div style={{ fontSize: "11px", opacity: 0.8 }}>{t("Total Unit Cost")}</div>
                <div style={{ fontSize: "20px", fontWeight: 800 }}>{fmt(totalUnitCost)}</div>
              </div>
            )}
          </div>

          {/* ── Category inner tabs ──────────────────────────────── */}
          <div style={{ borderBottom: "2px solid #e8f0fa", padding: "0 24px", background: "#fff" }}>
            <Nav variant="tabs" className="border-0">
              {CATEGORIES.map((cat) => {
                const count = allData.filter(
                  (r) => r.armEnds === activeArm && Number(r.scCategoryId) === cat.id
                ).length;
                return (
                  <Nav.Item key={cat.label}>
                    <Nav.Link
                      active={activeCat === cat.label}
                      onClick={() => { setActiveCat(cat.label); setShowAddForm(false); setNewRow(emptyRow); setNewComponentTypeId(""); setNewComponentId(""); setNewRowType("Component Details"); }}
                      style={
                        activeCat === cat.label
                          ? { color: "#1e67a8", fontWeight: 700, borderBottom: "3px solid #1e67a8", background: "none", cursor: "pointer" }
                          : { color: "#6b7280", fontWeight: 500, cursor: "pointer" }
                      }
                    >
                      {t(cat.label)}
                      <Badge
                        bg={activeCat === cat.label ? "primary" : "secondary"}
                        style={{ marginLeft: 6, fontSize: "10px" }}
                      >
                        {count}
                      </Badge>
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
          </div>

          {/* ── Table ─────────────────────────────────────────────── */}
          <Card.Body style={{ padding: "0 0 16px" }}>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>{t("Loading...")}</div>
            ) : (
              <>
                {filteredData.length === 0 && (
                  <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>{t("No components found for this selection")}</div>
                )}
                {/* ── 1. Main components table ── */}
                {mainRows.length > 0 && (
                  <>
                    <div style={{ background: "linear-gradient(90deg,#e0e7ff,#f5f3ff)", borderLeft: "4px solid #4f46e5", borderRadius: "0 6px 6px 0", padding: "7px 18px", margin: "16px 16px 8px", fontWeight: 700, color: "#3730a3", fontSize: "13px" }}>
                      1. {t("Component Details")}
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <Table hover style={{ margin: 0, fontSize: "13px" }}>
                        <thead>
                          <tr>
                            <th style={{ ...thStyle, width: 44 }}>#</th>
                            <th style={thStyle}>{t("Equipment Name")}</th>
                            <th style={{ ...thStyle, textAlign: "center", width: 64 }}>{t("Qty")}</th>
                            <th style={{ ...thStyle, textAlign: "right" }}>{t("Unit Rate")}</th>
                            <th style={{ ...thStyle, textAlign: "right" }}>{t("Total Amount")}</th>
                            <th style={{ ...thStyle, textAlign: "right" }}>{t("Unit Cost")}</th>
                            <th style={{ ...thStyle, textAlign: "center", width: 160 }}>{t("Actions")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mainRows.map((r, idx) => {
                            const total = r.totalAmount != null ? r.totalAmount : (r.quantity && r.unitRate ? parseFloat(r.quantity) * parseFloat(r.unitRate) : null);
                            return (
                              <React.Fragment key={r.armCalculationId}>
                                <tr style={{ borderBottom: "1px solid #f0f4f8" }}>
                                  <td style={{ ...tdStyle, color: "#9ca3af" }}>{idx + 1}</td>
                                  <td style={{ ...tdStyle, fontWeight: 500, color: "#1a202c" }}>{r.equipmentName}</td>
                                  <td style={{ ...tdStyle, textAlign: "center" }}>{r.quantity}</td>
                                  <td style={{ ...tdStyle, textAlign: "right", color: "#374151" }}>{fmt(r.unitRate)}</td>
                                  <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: "#1e67a8" }}>{fmt(total)}</td>
                                  <td style={{ ...tdStyle, textAlign: "right" }}>{fmt(r.unitCost)}</td>
                                  <td style={{ ...tdStyle, textAlign: "center" }}>
                                    <div className="d-flex gap-1 justify-content-center">
                                      <Button variant="outline-secondary" size="sm" onClick={() => navigate(`/seriui/arm-calculation-view/${r.armCalculationId}`)}>{t("View")}</Button>
                                      <Button variant="primary" size="sm" onClick={() => openEdit(r)}>{t("Edit")}</Button>
                                      <Button variant="danger" size="sm" onClick={() => deleteConfirm(r.armCalculationId)}>{t("Del")}</Button>
                                    </div>
                                  </td>
                                </tr>
                                {renderEditPanelRow(r)}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr style={{ background: "#f0f5fb", borderTop: "2px solid #c7d9ef" }}>
                            <td colSpan={5} style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: "#1e67a8" }}>
                              {t("Sub Total")} ({mainRows.length} {t("components")}):
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right", fontWeight: 800, fontSize: "15px", color: "#004b8e" }}>{fmt(mainUnitCost)}</td>
                            <td />
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </>
                )}

                {/* ── 2. IBR Boiler separate table ── */}
                {ibrRows.length > 0 && (
                  <>
                    <div style={{ background: "linear-gradient(90deg,#fef3c7,#fffbeb)", borderLeft: "4px solid #d97706", borderRadius: "0 6px 6px 0", padding: "7px 18px", margin: "20px 16px 8px", fontWeight: 700, color: "#92400e", fontSize: "13px" }}>
                      2. {t("IBR Boiler")}
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <Table hover style={{ margin: 0, fontSize: "13px" }}>
                        <thead>
                          <tr>
                            <th style={{ ...thStyle, width: 44 }}>#</th>
                            <th style={thStyle}>{t("Equipment Name")}</th>
                            <th style={{ ...thStyle, textAlign: "center", width: 64 }}>{t("Qty")}</th>
                            <th style={{ ...thStyle, textAlign: "right" }}>{t("Unit Rate")}</th>
                            <th style={{ ...thStyle, textAlign: "right" }}>{t("Total Amount")}</th>
                            <th style={{ ...thStyle, textAlign: "right" }}>{t("Unit Cost")}</th>
                            <th style={{ ...thStyle, textAlign: "center", width: 160 }}>{t("Actions")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ibrRows.map((r, idx) => {
                            const total = r.totalAmount != null ? r.totalAmount : (r.quantity && r.unitRate ? parseFloat(r.quantity) * parseFloat(r.unitRate) : null);
                            return (
                              <React.Fragment key={r.armCalculationId}>
                                <tr style={{ borderBottom: "1px solid #fef3c7" }}>
                                  <td style={{ ...tdStyle, color: "#9ca3af" }}>{idx + 1}</td>
                                  <td style={{ ...tdStyle, fontWeight: 500, color: "#1a202c" }}>{r.equipmentName}</td>
                                  <td style={{ ...tdStyle, textAlign: "center" }}>{r.quantity}</td>
                                  <td style={{ ...tdStyle, textAlign: "right", color: "#374151" }}>{fmt(r.unitRate)}</td>
                                  <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: "#b45309" }}>{fmt(total)}</td>
                                  <td style={{ ...tdStyle, textAlign: "right" }}>{fmt(r.unitCost)}</td>
                                  <td style={{ ...tdStyle, textAlign: "center" }}>
                                    <div className="d-flex gap-1 justify-content-center">
                                      <Button variant="outline-secondary" size="sm" onClick={() => navigate(`/seriui/arm-calculation-view/${r.armCalculationId}`)}>{t("View")}</Button>
                                      <Button variant="primary" size="sm" onClick={() => openEdit(r)}>{t("Edit")}</Button>
                                      <Button variant="danger" size="sm" onClick={() => deleteConfirm(r.armCalculationId)}>{t("Del")}</Button>
                                    </div>
                                  </td>
                                </tr>
                                {renderEditPanelRow(r)}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr style={{ background: "#fef9ec", borderTop: "2px solid #fde68a" }}>
                            <td colSpan={5} style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: "#92400e" }}>
                              {t("IBR Boiler Sub Total")}:
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right", fontWeight: 800, fontSize: "15px", color: "#92400e" }}>{fmt(ibrUnitCost)}</td>
                            <td />
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </>
                )}

                {/* ── Grand Total ── */}
                {mainRows.length > 0 && ibrRows.length > 0 && (
                  <div style={{ background: "linear-gradient(135deg,#1e3a8a,#1e40af)", borderRadius: "8px", padding: "12px 20px", margin: "12px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>{t("Grand Total")} ({filteredData.length} {t("components")})</span>
                    <span style={{ color: "#fbbf24", fontWeight: 800, fontSize: "18px", fontVariantNumeric: "tabular-nums" }}>{fmt(totalUnitCost)}</span>
                  </div>
                )}

                {/* ── Inline Insert Form ── */}
                <div style={{ margin: "16px 16px 4px" }}>
                  {!showAddForm ? (
                    <Button
                      size="sm"
                      onClick={() => setShowAddForm(true)}
                      style={{ background: "linear-gradient(135deg,#059669,#047857)", border: "none", borderRadius: "7px", padding: "8px 20px", fontWeight: 600, fontSize: "13px", color: "#fff", boxShadow: "0 2px 8px rgba(5,150,105,0.25)" }}
                    >
                      + {t("Insert Component")}
                    </Button>
                  ) : (
                    <div style={{ background: newRowType === "IBR Boiler" ? "#fffbeb" : "#f8faff", border: `1px solid ${newRowType === "IBR Boiler" ? "#fde68a" : "#bfdbfe"}`, borderRadius: "10px", padding: "16px", transition: "all 0.2s" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", borderBottom: `1px solid ${newRowType === "IBR Boiler" ? "#fde68a" : "#dbeafe"}`, paddingBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                        <div style={{ fontWeight: 700, color: newRowType === "IBR Boiler" ? "#92400e" : "#1e40af", fontSize: "13px" }}>
                          + {t("Insert New Component")} — <span style={{ color: "#059669" }}>{activeArm}</span> / <span style={{ color: "#7c3aed" }}>{activeCat}</span>
                        </div>
                        {/* ── Section toggle ── */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280" }}>{t("Insert Under")}:</span>
                          <button
                            type="button"
                            onClick={() => setNewRowType("Component Details")}
                            style={{
                              padding: "5px 12px", fontSize: "11.5px", fontWeight: 700, borderRadius: "6px", cursor: "pointer", transition: "all 0.15s",
                              background: newRowType === "Component Details" ? "linear-gradient(135deg,#1e40af,#2563eb)" : "#f1f5f9",
                              color: newRowType === "Component Details" ? "#fff" : "#374151",
                              border: newRowType === "Component Details" ? "none" : "1px solid #cbd5e1",
                            }}
                          >1. {t("Component Details")}</button>
                          <button
                            type="button"
                            onClick={() => setNewRowType("IBR Boiler")}
                            style={{
                              padding: "5px 12px", fontSize: "11.5px", fontWeight: 700, borderRadius: "6px", cursor: "pointer", transition: "all 0.15s",
                              background: newRowType === "IBR Boiler" ? "linear-gradient(135deg,#d97706,#b45309)" : "#f1f5f9",
                              color: newRowType === "IBR Boiler" ? "#fff" : "#374151",
                              border: newRowType === "IBR Boiler" ? "none" : "1px solid #cbd5e1",
                            }}
                          >2. {t("IBR Boiler")}</button>
                        </div>
                      </div>
                      {/* Live placement preview */}
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        background: newRowType === "IBR Boiler" ? "#fef3c7" : "#dbeafe",
                        borderRadius: "6px", padding: "4px 10px", marginBottom: "12px", fontSize: "11.5px", fontWeight: 600,
                        color: newRowType === "IBR Boiler" ? "#92400e" : "#1e40af",
                      }}>
                        {newRowType === "IBR Boiler" ? "⚠️" : "ℹ️"}
                        {t("Will appear under")}: <strong>{newRowType === "IBR Boiler" ? "2. IBR Boiler" : "1. Component Details"}</strong>
                        {newRowType === "IBR Boiler" && (
                          <span style={{ fontWeight: 400, color: "#b45309", marginLeft: 4 }}>
                            {t("(name will be prefixed with 'IBR Boiler' if not already)")}
                          </span>
                        )}
                      </div>

                      {/* Component / Component Type (optional — matches the main Add page) */}
                      <div style={{ display: "flex", gap: 12, marginBottom: "12px", flexWrap: "wrap" }}>
                        <div style={{ minWidth: 200, flex: "1 1 200px" }}>
                          <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Component Type")}</label>
                          <Form.Select
                            size="sm"
                            value={newComponentTypeId}
                            onChange={(e) => setNewComponentTypeId(e.target.value)}
                            style={{ borderColor: "#93c5fd", borderRadius: "6px" }}
                          >
                            <option value="">{t("-- Select Component Type --")}</option>
                            {componentTypeList.map((c) => (
                              <option key={c.scSubSchemeDetailsId} value={c.scSubSchemeDetailsId}>{c.subSchemeName}</option>
                            ))}
                          </Form.Select>
                        </div>
                        <div style={{ minWidth: 200, flex: "1 1 200px" }}>
                          <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Component")}</label>
                          <Form.Select
                            size="sm"
                            value={newComponentId}
                            onChange={(e) => setNewComponentId(e.target.value)}
                            style={{ borderColor: "#93c5fd", borderRadius: "6px" }}
                          >
                            <option value="">{t("-- Select Component --")}</option>
                            {componentList.map((c) => (
                              <option key={c.scComponentId} value={c.scComponentId}>{c.scComponentName}</option>
                            ))}
                          </Form.Select>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "10px", alignItems: "end" }}>
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Equipment Name")} *</label>
                          <Form.Control
                            size="sm" type="text"
                            placeholder={t("Enter equipment name")}
                            value={newRow.equipmentName}
                            onChange={(e) => handleNewRowChange("equipmentName", e.target.value)}
                            style={{ borderColor: "#93c5fd", borderRadius: "6px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Qty")} *</label>
                          <Form.Control
                            size="sm" type="number" min="0"
                            placeholder="0"
                            value={newRow.quantity}
                            onChange={(e) => handleNewRowChange("quantity", e.target.value)}
                            style={{ borderColor: "#93c5fd", borderRadius: "6px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Unit Rate")} *</label>
                          <Form.Control
                            size="sm" type="number" min="0"
                            placeholder="0"
                            value={newRow.unitRate}
                            onChange={(e) => handleNewRowChange("unitRate", e.target.value)}
                            style={{ borderColor: "#93c5fd", borderRadius: "6px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Unit Cost")}</label>
                          <Form.Control
                            size="sm" type="number" min="0"
                            placeholder={t("Auto")}
                            value={newRow.unitCost}
                            onChange={(e) => handleNewRowChange("unitCost", e.target.value)}
                            style={{ borderColor: "#93c5fd", borderRadius: "6px", background: "#eff6ff" }}
                          />
                        </div>
                      </div>
                      <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "8px" }}>
                        {t("Central%/State%/Advance%/First%/Final%/Min/Max are set once for the whole")} {activeArm} / {activeCat} {t("group below")}.
                      </div>
                      <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                        <Button
                          size="sm" disabled={saving}
                          onClick={handleInsert}
                          style={{ background: "linear-gradient(135deg,#059669,#047857)", border: "none", borderRadius: "7px", padding: "7px 22px", fontWeight: 600, fontSize: "13px", color: "#fff" }}
                        >
                          {saving ? t("Saving...") : t("Insert")}
                        </Button>
                        <Button
                          size="sm" variant="light"
                          onClick={() => { setShowAddForm(false); setNewRow(emptyRow); setNewComponentTypeId(""); setNewComponentId(""); setNewRowType("Component Details"); }}
                          style={{ borderRadius: "7px", padding: "7px 18px", fontWeight: 500, fontSize: "13px", border: "1px solid #dbeafe" }}
                        >
                          {t("Cancel")}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Group Settings (Central/State/Advance/First/Final/Min/Max) ──────
                     Entered once per armEnds+category group. Saving bulk-applies to every
                     existing component in this group and pre-fills any new one added. ── */}
                <div style={{ margin: "20px 16px 4px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "16px" }}>
                  <div style={{ fontWeight: 700, color: "#15803d", fontSize: "13px", marginBottom: "4px" }}>
                    {t("Group Settings")} — <span style={{ color: "#059669" }}>{activeArm}</span> / <span style={{ color: "#7c3aed" }}>{activeCat}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#15803d", marginBottom: "12px" }}>
                    {t("Set these once for the whole group -- Save applies them to every component already in this group, plus any new ones you add")}.
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr", gap: "10px", alignItems: "end" }}>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Central %")}</label>
                      <Form.Control
                        size="sm" type="number" min="0" max="100"
                        value={groupSettings.centralPercentage}
                        onChange={(e) => handleGroupSettingChange("centralPercentage", e.target.value)}
                        style={{ borderColor: "#86efac", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("State %")}</label>
                      <Form.Control
                        size="sm" type="number" min="0" max="100"
                        value={groupSettings.statePercentage}
                        onChange={(e) => handleGroupSettingChange("statePercentage", e.target.value)}
                        style={{ borderColor: "#86efac", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Advance %")}</label>
                      <Form.Control
                        size="sm" type="number" min="0" max="100"
                        value={groupSettings.advancePercentage}
                        onChange={(e) => handleGroupSettingChange("advancePercentage", e.target.value)}
                        style={{ borderColor: "#86efac", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("First Payment %")}</label>
                      <Form.Control
                        size="sm" type="number" min="0" max="100"
                        value={groupSettings.firstPayment}
                        onChange={(e) => handleGroupSettingChange("firstPayment", e.target.value)}
                        style={{ borderColor: "#86efac", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Final Payment %")}</label>
                      <Form.Control
                        size="sm" type="number" min="0" max="100"
                        value={groupSettings.finalPayment}
                        onChange={(e) => handleGroupSettingChange("finalPayment", e.target.value)}
                        style={{ borderColor: "#86efac", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Project Cost Min (₹ Lakhs)")}</label>
                      <Form.Control
                        size="sm" type="number" min="0" step="0.01"
                        value={groupSettings.projectCostMin}
                        onChange={(e) => handleGroupSettingChange("projectCostMin", e.target.value)}
                        style={{ borderColor: "#86efac", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Project Cost Max (₹ Lakhs)")}</label>
                      <Form.Control
                        size="sm" type="number" min="0" step="0.01"
                        value={groupSettings.projectCostMax}
                        onChange={(e) => handleGroupSettingChange("projectCostMax", e.target.value)}
                        style={{ borderColor: "#86efac", borderRadius: "6px" }}
                      />
                    </div>
                  </div>
                  <Button
                    size="sm" disabled={savingGroup}
                    onClick={saveGroupSettings}
                    style={{ marginTop: "14px", background: "linear-gradient(135deg,#15803d,#166534)", border: "none", borderRadius: "7px", padding: "7px 22px", fontWeight: 600, fontSize: "13px", color: "#fff" }}
                  >
                    {savingGroup ? t("Saving...") : t("Save Group Settings")}
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

const armCalculationListHeaderStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-cta-btn {
    background: #ffffff;
    color: #1e67a8 !important;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }

  /* Print-only summary: hidden on screen, shown (and everything else hidden) only when printing. */
  .arm-print-only { display: none; }
  @media print {
    body * { visibility: hidden; }
    .arm-print-only, .arm-print-only * { visibility: visible; }
    .arm-print-only {
      display: block;
      position: absolute; top: 0; left: 0; width: 100%;
      font-family: Arial, sans-serif; color: #000;
    }
    .arm-print-header { margin-bottom: 14px; }
    .arm-print-title { font-size: 16px; font-weight: 700; }
    .arm-print-meta { font-size: 12px; color: #333; margin-top: 2px; }
    .arm-print-section-label { font-weight: 700; font-size: 13px; margin: 14px 0 6px; }
    .arm-print-table { width: 100%; border-collapse: collapse; font-size: 11px; page-break-inside: avoid; }
    .arm-print-table th, .arm-print-table td { border: 1px solid #999; padding: 4px 6px; text-align: left; }
    .arm-print-table th:nth-child(3), .arm-print-table td:nth-child(3),
    .arm-print-table th:nth-child(4), .arm-print-table td:nth-child(4),
    .arm-print-table th:nth-child(5), .arm-print-table td:nth-child(5),
    .arm-print-table th:nth-child(6), .arm-print-table td:nth-child(6) { text-align: right; }
    .arm-print-table tfoot td { font-weight: 700; background: #f0f0f0; }
    .arm-print-grand-total { margin-top: 14px; font-size: 14px; font-weight: 800; text-align: right; }
    @page { size: A4; margin: 12mm; }
  }
`;

export default ArmCalculationList;
