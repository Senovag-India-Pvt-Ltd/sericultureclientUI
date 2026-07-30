import React, { useState, useEffect } from "react";
import { Card, Button, Nav, Table, Badge, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import Swal from "sweetalert2";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const ARM_ENDS = ["120 Ends", "200 Ends", "400 Ends"];
// Category tabs are resolved by NAME (not a hardcoded scCategoryId) against the real
// sc_category master data — the IDs are auto-generated per environment and previously
// drifted out of sync with these labels (e.g. id 3 was actually "SCSP-422", not "General"),
// silently mis-tagging every component added under the wrong tab.
const CATEGORY_LABELS = ["General", "TSP", "SCSP"];

const fmt = (v) =>
  v == null ? "—" : `₹ ${parseFloat(v).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

function ArmCalculationList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [allData, setAllData]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [activeArm, setActiveArm] = useState("120 Ends");
  const [activeCat, setActiveCat] = useState("General");
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving]           = useState(false);
  const [newRowType, setNewRowType]   = useState("Component Details");
  const emptyRow = { equipmentName: "", quantity: "", unitRate: "", unitCost: "", centralPercentage: "", statePercentage: "", advancePercentage: "", firstPayment: "", finalPayment: "" };
  const [newRow, setNewRow] = useState(emptyRow);
  const [scCategoryList, setScCategoryList] = useState([]);

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
      centralPercentage:  parseFloat(newRow.centralPercentage) || 0,
      statePercentage:    parseFloat(newRow.statePercentage)   || 0,
      advancePercentage:  parseFloat(newRow.advancePercentage) || 0,
      firstPayment:       parseFloat(newRow.firstPayment)      || 0,
      finalPayment:       parseFloat(newRow.finalPayment)      || 0,
      active:             true,
    })
      .then(() => {
        loadAll();
        setNewRow(emptyRow);
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

  return (
    <Layout title={t("ARM Calculation")}>
      <style>{armCalculationListHeaderStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("ARM Calculation Master")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <Link to="/seriui/arm-calculation" className="btn btn-primary d-none d-md-inline-flex sh-cta-btn">
                <Icon name="plus" /><span>{t("Add Component")}</span>
              </Link>
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
                onClick={() => { setActiveArm(e); setActiveCat("General"); setShowAddForm(false); setNewRow(emptyRow); setNewRowType("Component Details"); }}
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
                      onClick={() => { setActiveCat(cat.label); setShowAddForm(false); setNewRow(emptyRow); setNewRowType("Component Details"); }}
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
            ) : filteredData.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>{t("No components found for this selection")}</div>
            ) : (
              <>
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
                            <th style={{ ...thStyle, textAlign: "center", width: 90 }}>{t("Central %")}</th>
                            <th style={{ ...thStyle, textAlign: "center", width: 80 }}>{t("State %")}</th>
                            <th style={{ ...thStyle, textAlign: "center", width: 90 }}>{t("Advance %")}</th>
                            <th style={{ ...thStyle, textAlign: "center", width: 90 }}>{t("First Payment %")}</th>
                            <th style={{ ...thStyle, textAlign: "center", width: 90 }}>{t("Final Payment %")}</th>
                            <th style={{ ...thStyle, textAlign: "center", width: 160 }}>{t("Actions")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mainRows.map((r, idx) => {
                            const total = r.totalAmount != null ? r.totalAmount : (r.quantity && r.unitRate ? parseFloat(r.quantity) * parseFloat(r.unitRate) : null);
                            return (
                              <tr key={r.armCalculationId} style={{ borderBottom: "1px solid #f0f4f8" }}>
                                <td style={{ ...tdStyle, color: "#9ca3af" }}>{idx + 1}</td>
                                <td style={{ ...tdStyle, fontWeight: 500, color: "#1a202c" }}>{r.equipmentName}</td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>{r.quantity}</td>
                                <td style={{ ...tdStyle, textAlign: "right", color: "#374151" }}>{fmt(r.unitRate)}</td>
                                <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: "#1e67a8" }}>{fmt(total)}</td>
                                <td style={{ ...tdStyle, textAlign: "right" }}>{fmt(r.unitCost)}</td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                  {r.centralPercentage != null ? <Badge bg="success" style={{ fontSize: "12px" }}>{r.centralPercentage}%</Badge> : "—"}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                  {r.statePercentage != null ? <Badge bg="primary" style={{ fontSize: "12px" }}>{r.statePercentage}%</Badge> : "—"}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                  {r.advancePercentage != null ? <Badge bg="secondary" style={{ fontSize: "12px", background: "#9333ea" }}>{r.advancePercentage}%</Badge> : "—"}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                  {r.firstPayment != null ? <Badge bg="secondary" style={{ fontSize: "12px", background: "#c2410c" }}>{r.firstPayment}%</Badge> : "—"}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                  {r.finalPayment != null ? <Badge bg="secondary" style={{ fontSize: "12px", background: "#0f766e" }}>{r.finalPayment}%</Badge> : "—"}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                  <div className="d-flex gap-1 justify-content-center">
                                    <Button variant="outline-secondary" size="sm" onClick={() => navigate(`/seriui/arm-calculation-view/${r.armCalculationId}`)}>{t("View")}</Button>
                                    <Button variant="primary" size="sm" onClick={() => navigate(`/seriui/arm-calculation-edit/${r.armCalculationId}`)}>{t("Edit")}</Button>
                                    <Button variant="danger" size="sm" onClick={() => deleteConfirm(r.armCalculationId)}>{t("Del")}</Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr style={{ background: "#f0f5fb", borderTop: "2px solid #c7d9ef" }}>
                            <td colSpan={5} style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: "#1e67a8" }}>
                              {t("Sub Total")} ({mainRows.length} {t("components")}):
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right", fontWeight: 800, fontSize: "15px", color: "#004b8e" }}>{fmt(mainUnitCost)}</td>
                            <td colSpan={6} />
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
                            <th style={{ ...thStyle, textAlign: "center", width: 90 }}>{t("Central %")}</th>
                            <th style={{ ...thStyle, textAlign: "center", width: 80 }}>{t("State %")}</th>
                            <th style={{ ...thStyle, textAlign: "center", width: 90 }}>{t("Advance %")}</th>
                            <th style={{ ...thStyle, textAlign: "center", width: 90 }}>{t("First Payment %")}</th>
                            <th style={{ ...thStyle, textAlign: "center", width: 90 }}>{t("Final Payment %")}</th>
                            <th style={{ ...thStyle, textAlign: "center", width: 160 }}>{t("Actions")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ibrRows.map((r, idx) => {
                            const total = r.totalAmount != null ? r.totalAmount : (r.quantity && r.unitRate ? parseFloat(r.quantity) * parseFloat(r.unitRate) : null);
                            return (
                              <tr key={r.armCalculationId} style={{ borderBottom: "1px solid #fef3c7" }}>
                                <td style={{ ...tdStyle, color: "#9ca3af" }}>{idx + 1}</td>
                                <td style={{ ...tdStyle, fontWeight: 500, color: "#1a202c" }}>{r.equipmentName}</td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>{r.quantity}</td>
                                <td style={{ ...tdStyle, textAlign: "right", color: "#374151" }}>{fmt(r.unitRate)}</td>
                                <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: "#b45309" }}>{fmt(total)}</td>
                                <td style={{ ...tdStyle, textAlign: "right" }}>{fmt(r.unitCost)}</td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                  {r.centralPercentage != null ? <Badge bg="success" style={{ fontSize: "12px" }}>{r.centralPercentage}%</Badge> : "—"}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                  {r.statePercentage != null ? <Badge bg="primary" style={{ fontSize: "12px" }}>{r.statePercentage}%</Badge> : "—"}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                  {r.advancePercentage != null ? <Badge bg="secondary" style={{ fontSize: "12px", background: "#9333ea" }}>{r.advancePercentage}%</Badge> : "—"}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                  {r.firstPayment != null ? <Badge bg="secondary" style={{ fontSize: "12px", background: "#c2410c" }}>{r.firstPayment}%</Badge> : "—"}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                  {r.finalPayment != null ? <Badge bg="secondary" style={{ fontSize: "12px", background: "#0f766e" }}>{r.finalPayment}%</Badge> : "—"}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                  <div className="d-flex gap-1 justify-content-center">
                                    <Button variant="outline-secondary" size="sm" onClick={() => navigate(`/seriui/arm-calculation-view/${r.armCalculationId}`)}>{t("View")}</Button>
                                    <Button variant="primary" size="sm" onClick={() => navigate(`/seriui/arm-calculation-edit/${r.armCalculationId}`)}>{t("Edit")}</Button>
                                    <Button variant="danger" size="sm" onClick={() => deleteConfirm(r.armCalculationId)}>{t("Del")}</Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr style={{ background: "#fef9ec", borderTop: "2px solid #fde68a" }}>
                            <td colSpan={5} style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: "#92400e" }}>
                              {t("IBR Boiler Sub Total")}:
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right", fontWeight: 800, fontSize: "15px", color: "#92400e" }}>{fmt(ibrUnitCost)}</td>
                            <td colSpan={6} />
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
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr", gap: "10px", alignItems: "end" }}>
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
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Central %")}</label>
                          <Form.Control
                            size="sm" type="number" min="0" max="100"
                            placeholder="0"
                            value={newRow.centralPercentage}
                            onChange={(e) => handleNewRowChange("centralPercentage", e.target.value)}
                            style={{ borderColor: "#93c5fd", borderRadius: "6px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("State %")}</label>
                          <Form.Control
                            size="sm" type="number" min="0" max="100"
                            placeholder="0"
                            value={newRow.statePercentage}
                            onChange={(e) => handleNewRowChange("statePercentage", e.target.value)}
                            style={{ borderColor: "#93c5fd", borderRadius: "6px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Advance %")}</label>
                          <Form.Control
                            size="sm" type="number" min="0" max="100"
                            placeholder="0"
                            value={newRow.advancePercentage}
                            onChange={(e) => handleNewRowChange("advancePercentage", e.target.value)}
                            style={{ borderColor: "#d8b4fe", borderRadius: "6px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("First Payment %")}</label>
                          <Form.Control
                            size="sm" type="number" min="0" max="100"
                            placeholder="0"
                            value={newRow.firstPayment}
                            onChange={(e) => handleNewRowChange("firstPayment", e.target.value)}
                            style={{ borderColor: "#fdba74", borderRadius: "6px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>{t("Final Payment %")}</label>
                          <Form.Control
                            size="sm" type="number" min="0" max="100"
                            placeholder="0"
                            value={newRow.finalPayment}
                            onChange={(e) => handleNewRowChange("finalPayment", e.target.value)}
                            style={{ borderColor: "#5eead4", borderRadius: "6px" }}
                          />
                        </div>
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
                          onClick={() => { setShowAddForm(false); setNewRow(emptyRow); setNewRowType("Component Details"); }}
                          style={{ borderRadius: "7px", padding: "7px 18px", fontWeight: 500, fontSize: "13px", border: "1px solid #dbeafe" }}
                        >
                          {t("Cancel")}
                        </Button>
                      </div>
                    </div>
                  )}
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
`;

export default ArmCalculationList;
