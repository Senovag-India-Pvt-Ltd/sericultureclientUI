import { Card, Form, Row, Col } from "react-bootstrap";
import { useState } from "react";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import api from "../../../src/services/auth/api";

const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

const marketFeeCollectionStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title { margin-bottom: 4px; color: #ffffff !important; font-weight: 700; letter-spacing: 0.2px; }
  .sh-swal-popup { border-radius: 14px !important; }
  .sh-swal-confirm { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border-radius: 8px !important; font-weight: 600 !important; }
  .sh-swal-cancel { background: #ffffff !important; color: #c43257 !important; border: 1px solid #e3496a !important; border-radius: 8px !important; font-weight: 600 !important; }
`;

function MarketFeeCollection() {
  const { t } = useTranslation();

  const [fruitsId, setFruitsId] = useState("");
  const [validatedSearch, setValidatedSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lotList, setLotList] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedLots, setSelectedLots] = useState(new Set());
  const [updating, setUpdating] = useState(false);

  const allSelected = lotList.length > 0 && selectedLots.size === lotList.length;

  const totalAllMarketFee = lotList.reduce((sum, item) => sum + (item.marketFeeAmount || 0), 0);

  const selectedMarketFee = lotList
    .filter((item) => selectedLots.has(item.lotGroupageId))
    .reduce((sum, item) => sum + (item.marketFeeAmount || 0), 0);

  const pendingAmount = totalAllMarketFee - selectedMarketFee;

  const currentBalance = lotList.length > 0 ? (lotList[0].currentBalance ?? null) : null;
  const balanceAfterDeduction = currentBalance != null ? currentBalance - selectedMarketFee : null;

  const handleToggleLot = (id) => {
    setSelectedLots((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedLots(new Set());
    } else {
      setSelectedLots(new Set(lotList.map((l) => l.lotGroupageId)));
    }
  };

  const fetchLots = (fid) => {
    const marketId = localStorage.getItem("marketId");
    setLoading(true);
    api
      .post(baseURLMarket + `lotGroupage/getGovtGrainageUnpaidLots`, {
        fruitsId: fid,
        marketId: marketId,
      })
      .then((res) => {
        const data = res.data;
        const raw = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : [];
        const list = raw.filter((item) => item.isMarketPaid === false);
        setLotList(list);
        setSearched(true);
        setSelectedLots(new Set());
      })
      .catch((err) => {
        const msg =
          err.response?.data?.errorMessages?.[0]?.message ||
          err.message ||
          t("Failed to fetch lot list.");
        Swal.fire({ icon: "error", title: t("Error"), text: msg, customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" } });
        setSearched(true);
      })
      .finally(() => setLoading(false));
  };

  const handleSearch = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedSearch(true);
      return;
    }
    e.preventDefault();
    setLotList([]);
    setSelectedLots(new Set());
    setSearched(false);
    fetchLots(fruitsId);
    setValidatedSearch(false);
  };

  const handleClear = () => {
    setFruitsId("");
    setLotList([]);
    setSelectedLots(new Set());
    setSearched(false);
    setValidatedSearch(false);
  };

  const handleUpdate = async () => {
    if (selectedLots.size === 0) {
      Swal.fire({ icon: "warning", title: t("Select Lots"), text: t("Please select at least one lot to collect market fee."), customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" } });
      return;
    }
    const marketId = localStorage.getItem("marketId");
    setUpdating(true);
    try {
      await Promise.all(
        [...selectedLots].map((lotGroupageId) =>
          api.post(
            baseURLMarket +
              `lotGroupage/markLotAsMarketPaid?lotGroupageId=${lotGroupageId}&marketId=${marketId}`
          )
        )
      );
      Swal.fire({ icon: "success", title: t("Success"), text: t("Market fee collected successfully."), customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" } });
      fetchLots(fruitsId);
    } catch (err) {
      const msg =
        err.response?.data?.errorMessages?.[0]?.message ||
        err.message ||
        t("Failed to update market fee.");
      Swal.fire({ icon: "error", title: t("Error"), text: msg, customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" } });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Layout title={t("Market Fee Collection")}>
      <style>{marketFeeCollectionStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title">{t("Market Fee Collection")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4">

        {/* Search Card */}
        <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)", marginBottom: 20 }}>
          <div style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)", padding: "14px 24px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px" }}>🔍</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{t("Search Farmer")}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>{t("Search by Fruits ID")}</div>
            </div>
          </div>
          <Card.Body style={{ padding: "14px 20px" }}>
            <Form noValidate validated={validatedSearch} onSubmit={handleSearch}>
              <Col sm={8} lg={12}>
                <Form.Group as={Row} className="form-group mb-0 align-items-center">
                  <Form.Label column sm="auto" style={{ fontWeight: 600, fontSize: "14px", color: "#4a5568", paddingRight: "8px", whiteSpace: "nowrap" }}>
                    {t("Fruits ID")}
                  </Form.Label>
                  <Col sm={2} lg={3}>
                    <Form.Control
                      value={fruitsId}
                      onChange={(e) => setFruitsId(e.target.value)}
                      type="text"
                      placeholder={t("Enter Fruits ID")}
                      required
                      style={{ borderRadius: "8px", border: "1.5px solid #d0d9e8", fontSize: "14px" }}
                    />
                    <Form.Control.Feedback type="invalid">{t("Fruits ID is Required")}</Form.Control.Feedback>
                  </Col>
                  <Col sm={2} lg={3} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{ background: "linear-gradient(135deg,#1e67a8,#2d9cdb)", border: "none", borderRadius: "8px", padding: "8px 22px", fontWeight: 700, fontSize: "14px", color: "#fff", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 3px 10px rgba(30,103,168,0.30)", whiteSpace: "nowrap", opacity: loading ? 0.7 : 1 }}
                    >
                      🔍 {loading ? t("Searching...") : t("Search")}
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      style={{ background: "#f0f6ff", border: "1.5px solid #1e67a8", borderRadius: "8px", padding: "8px 18px", fontWeight: 700, fontSize: "14px", color: "#1e67a8", cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      {t("Clear")}
                    </button>
                  </Col>
                </Form.Group>
              </Col>
            </Form>
          </Card.Body>
        </Card>

        {searched && (
          <>
            {/* Lot List Card */}
            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(245,158,11,0.10)", marginBottom: 20 }}>
              <div style={{ background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)", padding: "14px 24px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>📦</div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{t("Pending Market Fee Lots")}</div>
                    <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px" }}>{lotList.length} {t("lot(s) found")}</div>
                  </div>
                </div>
                {lotList.length > 0 && (
                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: "10px", padding: "8px 18px", minWidth: 130 }}>
                      <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{t("Current Balance")}</div>
                      <div style={{ color: balanceAfterDeduction != null && balanceAfterDeduction < 0 ? "#fca5a5" : "#fff", fontWeight: 700, fontSize: "16px" }}>
                        {balanceAfterDeduction != null ? `₹ ${balanceAfterDeduction.toFixed(2)}` : currentBalance != null ? `₹ ${currentBalance}` : "—"}
                      </div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: "10px", padding: "8px 18px", minWidth: 130 }}>
                      <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{t("Pending Amount")}</div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
                        ₹ {pendingAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Card.Body style={{ padding: 0 }}>
                {lotList.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: 10, opacity: 0.35 }}>📦</div>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#6b7280" }}>{t("No pending market fee lots found for this farmer.")}</div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table" style={{ marginBottom: 0 }}>
                      <thead>
                        <tr style={{ background: "linear-gradient(90deg, #fffbeb, #fef3c7)" }}>
                          <th style={{ padding: "12px 16px", borderBottom: "2px solid #fde68a", width: 44 }}>
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={handleToggleAll}
                              style={{ width: 16, height: 16, cursor: "pointer" }}
                            />
                          </th>
                          {[t("Lot No"), t("Farmer Name"), t("Lot Amount"), t("Market Fee Amount")].map((h) => (
                            <th key={h} style={{ padding: "12px 16px", color: "#92400e", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "2px solid #fde68a" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {lotList.map((item, i) => {
                          const isChecked = selectedLots.has(item.lotGroupageId);
                          return (
                            <tr
                              key={item.lotGroupageId || i}
                              style={{ borderBottom: "1px solid #fef3c7", background: isChecked ? "#fffbeb" : "transparent", cursor: "pointer" }}
                              onClick={() => handleToggleLot(item.lotGroupageId)}
                            >
                              <td style={{ padding: "11px 16px", verticalAlign: "middle" }}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleLot(item.lotGroupageId)}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ width: 16, height: 16, cursor: "pointer" }}
                                />
                              </td>
                              <td style={{ padding: "11px 16px", verticalAlign: "middle", fontWeight: 700, color: "#1e2a44", fontSize: "14px" }}>
                                {item.allottedLotId || "—"}
                              </td>
                              <td style={{ padding: "11px 16px", verticalAlign: "middle", fontSize: "14px" }}>
                                {item.farmerName || "—"}
                              </td>
                              <td style={{ padding: "11px 16px", verticalAlign: "middle", fontWeight: 600, color: "#0e7a4e", fontSize: "14px" }}>
                                {item.lotAmount != null ? `₹ ${item.lotAmount}` : "—"}
                              </td>
                              <td style={{ padding: "11px 16px", verticalAlign: "middle", fontWeight: 600, color: "#1e67a8", fontSize: "14px" }}>
                                {item.marketFeeAmount != null ? `₹ ${item.marketFeeAmount}` : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card.Body>
            </Card>

            {lotList.length > 0 && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                <button
                  type="button"
                  disabled={updating || selectedLots.size === 0}
                  onClick={handleUpdate}
                  style={{ background: selectedLots.size === 0 ? "#e5e7eb" : "linear-gradient(135deg,#0e7a4e,#16a34a)", border: "none", borderRadius: "9px", padding: "10px 36px", fontWeight: 700, fontSize: "14px", color: selectedLots.size === 0 ? "#9ca3af" : "#fff", cursor: updating || selectedLots.size === 0 ? "not-allowed" : "pointer", boxShadow: selectedLots.size > 0 ? "0 3px 12px rgba(14,122,78,0.30)" : "none", opacity: updating ? 0.7 : 1 }}
                >
                  {updating ? t("Submitting...") : t("Submit")}
                </button>
              </div>
            )}
          </>
        )}
      </Block>
    </Layout>
  );
}

export default MarketFeeCollection;
