import React, { useState, useEffect } from "react";
import { Card, Button, Nav, Table, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import Swal from "sweetalert2";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const ARM_ENDS = ["120 Ends", "200 Ends", "400 Ends"];
const CATEGORIES = [
  { label: "General", id: 3 },
  { label: "TSP",     id: 4 },
  { label: "SCSP",    id: 5 },
];

const fmt = (v) =>
  v == null ? "—" : `₹ ${parseFloat(v).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

function ArmCalculationList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [allData, setAllData]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [activeArm, setActiveArm] = useState("120 Ends");
  const [activeCat, setActiveCat] = useState("General");

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

  const activeCatId   = CATEGORIES.find((c) => c.label === activeCat)?.id;
  const filteredData  = allData.filter(
    (r) => r.armEnds === activeArm && Number(r.scCategoryId) === activeCatId
  );

  const totalUnitCost = filteredData.reduce((s, r) => s + (parseFloat(r.unitCost) || 0), 0);
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
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("ARM Calculation Master")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <Link to="/seriui/arm-calculation" className="btn btn-primary d-none d-md-inline-flex">
              <Icon name="plus" /><span>{t("Add Component")}</span>
            </Link>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── ARM Ends outer pill tabs ───────────────────────────── */}
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
                      onClick={() => setActiveCat(cat.label)}
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
          <Card.Body style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>{t("Loading...")}</div>
            ) : filteredData.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>{t("No components found for this selection")}</div>
            ) : (
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
                      <th style={{ ...thStyle, textAlign: "center", width: 160 }}>{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((r, idx) => {
                      const total =
                        r.totalAmount != null
                          ? r.totalAmount
                          : r.quantity && r.unitRate
                          ? parseFloat(r.quantity) * parseFloat(r.unitRate)
                          : null;
                      return (
                        <tr key={r.armCalculationId} style={{ borderBottom: "1px solid #f0f4f8" }}>
                          <td style={{ ...tdStyle, color: "#9ca3af" }}>{idx + 1}</td>
                          <td style={{ ...tdStyle, fontWeight: 500, color: "#1a202c" }}>{r.equipmentName}</td>
                          <td style={{ ...tdStyle, textAlign: "center" }}>{r.quantity}</td>
                          <td style={{ ...tdStyle, textAlign: "right", color: "#374151" }}>{fmt(r.unitRate)}</td>
                          <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: "#1e67a8" }}>{fmt(total)}</td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>{fmt(r.unitCost)}</td>
                          <td style={{ ...tdStyle, textAlign: "center" }}>
                            {r.centralPercentage != null ? (
                              <Badge bg="success" style={{ fontSize: "12px" }}>{r.centralPercentage}%</Badge>
                            ) : "—"}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "center" }}>
                            {r.statePercentage != null ? (
                              <Badge bg="primary" style={{ fontSize: "12px" }}>{r.statePercentage}%</Badge>
                            ) : "—"}
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
                        {t("Total Unit Cost")} ({filteredData.length} {t("components")}):
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right", fontWeight: 800, fontSize: "15px", color: "#004b8e" }}>
                        {fmt(totalUnitCost)}
                      </td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default ArmCalculationList;
