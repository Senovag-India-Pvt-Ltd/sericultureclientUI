import React, { useState, useEffect } from "react";
import { Card, Button, Nav, Table, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import Swal from "sweetalert2";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const ARM_ENDS = ["120 Ends", "200 Ends", "400 Ends"];
// Central/State % are a fixed funding-split policy per category (not stored in sc_category
// master data), so those stay hardcoded here. The scCategoryId, however, is auto-generated
// per environment and must NOT be hardcoded — it's resolved by matching the real, active
// sc_category name below (the same fix applied to ArmCalculationList.js, which previously
// had General/SCSP swapped because ids 3/4/5 didn't actually correspond to those labels).
const CATEGORY_POLICY = [
  { label: "General", central: 50, state: 25 },
  { label: "TSP",     central: 65, state: 25 },
  { label: "SCSP",    central: 65, state: 25 },
];

const newRow = () => ({
  key: Date.now() + Math.random(),
  equipmentName: "",
  quantity: "",
  unitRate: "",
  advancePercentage: "",
  firstPayment: "",
  finalPayment: "",
});

const initTable = () => {
  const t = {};
  ARM_ENDS.forEach((arm) => {
    t[arm] = {};
    CATEGORY_POLICY.forEach((cat) => { t[arm][cat.label] = [newRow()]; });
  });
  return t;
};

function ArmCalculation() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeArm, setActiveArm] = useState("120 Ends");
  const [activeCat, setActiveCat] = useState("General");
  const [saving, setSaving]       = useState(false);
  const [tableData, setTableData] = useState(initTable);
  const [scCategoryList, setScCategoryList] = useState([]);

  useEffect(() => {
    api.get(baseURL + "scCategory/get-all")
      .then((r) => setScCategoryList((r.data.content?.scCategory || []).filter((c) => c.active !== false)))
      .catch(() => setScCategoryList([]));
  }, []);

  const CATEGORIES = CATEGORY_POLICY.map((cat) => {
    const match = scCategoryList.find((c) =>
      (c.categoryName || "").toLowerCase().startsWith(cat.label.toLowerCase())
    );
    return { ...cat, id: match ? match.scCategoryId : null };
  });

  const catObj = CATEGORIES.find((c) => c.label === activeCat);
  const rows   = tableData[activeArm][activeCat];

  const setRows = (newRows) =>
    setTableData((prev) => ({
      ...prev,
      [activeArm]: { ...prev[activeArm], [activeCat]: newRows },
    }));

  const updateRow = (key, field, value) =>
    setRows(rows.map((r) => (r.key === key ? { ...r, [field]: value } : r)));

  const addRow    = () => setRows([...rows, newRow()]);
  const removeRow = (key) => rows.length > 1 && setRows(rows.filter((r) => r.key !== key));

  const handleSave = async () => {
    const filled = rows.filter((r) => r.equipmentName.trim() && r.quantity && r.unitRate);
    if (!filled.length) {
      Swal.fire({ icon: "warning", title: t("No data"), text: t("Please fill at least one row completely") });
      return;
    }
    setSaving(true);
    try {
      for (const r of filled) {
        const qty  = parseFloat(r.quantity);
        const rate = parseFloat(r.unitRate);
        await api.post(baseURL + "armCalculation/add", {
          scCategoryId:      catObj.id,
          armEnds:           activeArm,
          equipmentName:     r.equipmentName.trim(),
          quantity:          qty,
          unitRate:          rate,
          unitCost:          qty * rate,
          centralPercentage: catObj.central,
          statePercentage:   catObj.state,
          advancePercentage: r.advancePercentage ? parseFloat(r.advancePercentage) : null,
          firstPayment:      r.firstPayment ? parseFloat(r.firstPayment) : null,
          finalPayment:      r.finalPayment ? parseFloat(r.finalPayment) : null,
        });
      }
      setSaving(false);
      Swal.fire({ icon: "success", title: t("Saved successfully"), text: `${filled.length} ${t("component(s) saved")}` })
        .then(() => navigate("/seriui/arm-calculation-list"));
    } catch (err) {
      setSaving(false);
      const msg =
        err.response?.data?.errorMessages?.[0]?.message?.[0]?.message ||
        err.response?.data?.errorMessages?.[0]?.message ||
        t("Something went wrong!");
      Swal.fire({ icon: "error", title: t("Error"), text: typeof msg === "string" ? msg : JSON.stringify(msg) });
    }
  };

  const totalAmt = rows.reduce((s, r) => {
    const q = parseFloat(r.quantity) || 0;
    const rt = parseFloat(r.unitRate) || 0;
    return s + q * rt;
  }, 0);

  const filledCount = rows.filter((r) => r.equipmentName && r.quantity && r.unitRate).length;

  /* ── styles ─────────────────────────────────────── */
  const inputStyle = { borderRadius: "6px", border: "1.5px solid #d0d9e8", fontSize: "13px", padding: "6px 10px" };
  const thStyle    = { padding: "11px 14px", color: "#374151", fontWeight: 700, background: "#f0f5fb", whiteSpace: "nowrap" };
  const tdStyle    = { padding: "7px 10px", verticalAlign: "middle" };

  return (
    <Layout title={t("Add ARM Calculation")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Add ARM Calculation")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <Link to="/seriui/arm-calculation-list" className="btn btn-primary d-none d-md-inline-flex">
              <Icon name="arrow-left" /><span>{t("Back to List")}</span>
            </Link>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── ARM Ends outer tabs ───────────────────── */}
        <Nav variant="pills" className="gap-2 mb-3 flex-nowrap">
          {ARM_ENDS.map((e) => (
            <Nav.Item key={e}>
              <Nav.Link
                active={activeArm === e}
                onClick={() => { setActiveArm(e); setActiveCat("General"); }}
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
                <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{t("ARM Calculation Master")}</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>{t("Add equipment component details for ARM unit")}</div>
              </div>
            </div>
            <div style={{ color: "#fff", textAlign: "right", fontSize: "12px" }}>
              <div style={{ fontWeight: 700 }}>{activeArm} / {activeCat}</div>
              <div style={{ opacity: 0.85 }}>Central {catObj?.central}% &nbsp;|&nbsp; State {catObj?.state}%</div>
            </div>
          </div>

          {/* ── Category inner tabs ───────────────────── */}
          <div style={{ borderBottom: "2px solid #e8f0fa", padding: "0 24px", background: "#fff" }}>
            <Nav variant="tabs" className="border-0">
              {CATEGORIES.map((cat) => (
                <Nav.Item key={cat.label}>
                  <Nav.Link
                    active={activeCat === cat.label}
                    onClick={() => setActiveCat(cat.label)}
                    style={
                      activeCat === cat.label
                        ? { color: "#1e67a8", fontWeight: 700, borderBottom: "3px solid #1e67a8", background: "none", cursor: "pointer" }
                        : { color: "#6b7280", fontWeight: 500, cursor: "pointer" }
                    }
                  >
                    {t(cat.label)}
                    <span style={{ marginLeft: 5, fontSize: "11px", color: activeCat === cat.label ? "#1e67a8" : "#9ca3af" }}>
                      C:{cat.central}% S:{cat.state}%
                    </span>
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </div>

          {/* ── Editable table ────────────────────────── */}
          <Card.Body style={{ padding: "20px 24px" }}>
            <div style={{ overflowX: "auto" }}>
              <Table style={{ margin: 0, fontSize: "13px" }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: 44, textAlign: "center" }}>#</th>
                    <th style={thStyle}>{t("Equipment Name")} <span className="text-danger">*</span></th>
                    <th style={{ ...thStyle, width: 100, textAlign: "center" }}>{t("Qty")} <span className="text-danger">*</span></th>
                    <th style={{ ...thStyle, width: 160, textAlign: "right" }}>{t("Unit Rate (₹)")} <span className="text-danger">*</span></th>
                    <th style={{ ...thStyle, width: 170, textAlign: "right" }}>{t("Total Amount (₹)")}</th>
                    <th style={{ ...thStyle, width: 110, textAlign: "center" }}>{t("Advance (%)")}</th>
                    <th style={{ ...thStyle, width: 110, textAlign: "center" }}>{t("First Payment (%)")}</th>
                    <th style={{ ...thStyle, width: 110, textAlign: "center" }}>{t("Final Payment (%)")}</th>
                    <th style={{ ...thStyle, width: 48, textAlign: "center" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => {
                    const qty   = parseFloat(r.quantity) || 0;
                    const rate  = parseFloat(r.unitRate)  || 0;
                    const total = qty > 0 && rate > 0 ? qty * rate : null;
                    return (
                      <tr key={r.key} style={{ borderBottom: "1px solid #f0f4f8" }}>
                        <td style={{ ...tdStyle, textAlign: "center", color: "#9ca3af", fontWeight: 600 }}>{idx + 1}</td>
                        <td style={tdStyle}>
                          <Form.Control
                            type="text"
                            value={r.equipmentName}
                            onChange={(e) => updateRow(r.key, "equipmentName", e.target.value)}
                            placeholder={t("Enter equipment name")}
                            style={inputStyle}
                          />
                        </td>
                        <td style={tdStyle}>
                          <Form.Control
                            type="number"
                            value={r.quantity}
                            onChange={(e) => updateRow(r.key, "quantity", e.target.value)}
                            placeholder="1"
                            min="0"
                            step="0.01"
                            style={{ ...inputStyle, textAlign: "center", width: "80px" }}
                          />
                        </td>
                        <td style={tdStyle}>
                          <Form.Control
                            type="number"
                            value={r.unitRate}
                            onChange={(e) => updateRow(r.key, "unitRate", e.target.value)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            style={{ ...inputStyle, textAlign: "right" }}
                          />
                        </td>
                        <td style={{ ...tdStyle, textAlign: "right" }}>
                          {total != null ? (
                            <span style={{ fontWeight: 700, color: "#1e67a8", fontSize: "14px" }}>
                              ₹ {total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span style={{ color: "#d1d5db" }}>—</span>
                          )}
                        </td>
                        <td style={tdStyle}>
                          <Form.Control
                            type="number"
                            value={r.advancePercentage}
                            onChange={(e) => updateRow(r.key, "advancePercentage", e.target.value)}
                            placeholder="0"
                            min="0"
                            max="100"
                            step="0.01"
                            style={{ ...inputStyle, textAlign: "center" }}
                          />
                        </td>
                        <td style={tdStyle}>
                          <Form.Control
                            type="number"
                            value={r.firstPayment}
                            onChange={(e) => updateRow(r.key, "firstPayment", e.target.value)}
                            placeholder="0"
                            min="0"
                            max="100"
                            step="0.01"
                            style={{ ...inputStyle, textAlign: "center" }}
                          />
                        </td>
                        <td style={tdStyle}>
                          <Form.Control
                            type="number"
                            value={r.finalPayment}
                            onChange={(e) => updateRow(r.key, "finalPayment", e.target.value)}
                            placeholder="0"
                            min="0"
                            max="100"
                            step="0.01"
                            style={{ ...inputStyle, textAlign: "center" }}
                          />
                        </td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeRow(r.key)}
                            disabled={rows.length === 1}
                            style={{ padding: "3px 8px", fontSize: "13px", lineHeight: 1 }}
                          >
                            ✕
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* total footer */}
                {totalAmt > 0 && (
                  <tfoot>
                    <tr style={{ background: "#f0f5fb", borderTop: "2px solid #c7d9ef" }}>
                      <td colSpan={4} style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: "#1e67a8" }}>
                        {t("Total")} ({filledCount} {t("items")}):
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right", fontWeight: 800, fontSize: "15px", color: "#004b8e" }}>
                        ₹ {totalAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td colSpan={4} />
                    </tr>
                  </tfoot>
                )}
              </Table>
            </div>

            {/* ── Actions ────────────────────────────── */}
            <div className="d-flex align-items-center gap-2 mt-3">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={addRow}
                style={{ borderRadius: "7px", fontWeight: 600, fontSize: "13px" }}
              >
                <Icon name="plus" /> {t("Add Row")}
              </Button>

              <div style={{ flex: 1 }} />

              <Button
                onClick={handleSave}
                disabled={saving}
                style={{ background: "linear-gradient(135deg,#1e67a8,#2d9cdb)", border: "none", borderRadius: "8px", padding: "8px 28px", fontWeight: 700 }}
              >
                {saving ? t("Saving...") : t("Save All")}
              </Button>
              <Link
                to="/seriui/arm-calculation-list"
                className="btn"
                style={{ border: "1.5px solid #1e67a8", borderRadius: "8px", padding: "8px 20px", fontWeight: 700, color: "#1e67a8" }}
              >
                {t("Cancel")}
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default ArmCalculation;
