import DatePicker from "react-datepicker";
import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

const formatDate = (d) =>
  d.getFullYear() +
  "-" +
  (d.getMonth() + 1).toString().padStart(2, "0") +
  "-" +
  d.getDate().toString().padStart(2, "0");

function TransferMarketFeeToGovtAccount() {
  const { t } = useTranslation();

  const [date, setDate] = useState(new Date());
  const [lotList, setLotList] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [selectedLots, setSelectedLots] = useState(new Set());
  const [fileName, setFileName] = useState("");

  const marketId = parseInt(localStorage.getItem("marketId")) || 0;

  const allSelected = lotList.length > 0 && selectedLots.size === lotList.length;

  const totalFarmerFee = lotList.reduce((s, i) => s + (i.farmerMarketFee || 0), 0);
  const totalReelerFee = lotList.reduce((s, i) => s + (i.reelerMarketFee || 0), 0);
  const grandTotal = totalFarmerFee + totalReelerFee;

  const selectedTotal = lotList
    .filter((_, idx) => selectedLots.has(idx))
    .reduce((s, i) => s + (i.farmerMarketFee || 0) + (i.reelerMarketFee || 0), 0);

  const handleToggleLot = (idx) => {
    setSelectedLots((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleToggleAll = () => {
    setSelectedLots(allSelected ? new Set() : new Set(lotList.map((_, idx) => idx)));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLotList([]);
    setSelectedLots(new Set());
    setSearched(false);
    setLoading(true);

    api
      .post(baseURLMarket + `lotGroupage/getTransferMarketFeeToGovtAccount`, {
        marketId,
        date: formatDate(date),
      })
      .then((res) => {
        const raw = Array.isArray(res.data?.content) ? res.data.content : [];
        setLotList(raw);
        setSearched(true);
        if (raw.length === 0) {
          Swal.fire({ icon: "info", title: t("No Records"), text: t("No pending lots found for the given date and market.") });
        }
      })
      .catch((err) => {
        const msg =
          err.response?.data?.errorMessages?.[0]?.message ||
          err.message ||
          t("Failed to fetch records.");
        Swal.fire({ icon: "error", title: t("Error"), text: msg });
        setSearched(true);
      })
      .finally(() => setLoading(false));
  };

  const handleDownloadPreviewCSV = () => {
    api
      .get(baseURLMarket + `lotGroupage/generateMarketFeePreviewCSV`, {
        params: { marketId, date: formatDate(date) },
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = `MarketFeePreview_${formatDate(date)}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => Swal.fire({ icon: "error", title: t("Error"), text: t("Failed to download preview CSV.") }));
  };

  const handleTransfer = async () => {
    if (!fileName.trim()) {
      Swal.fire({ icon: "warning", title: t("File Name Required"), text: t("Please enter a file name before transferring.") });
      return;
    }
    const result = await Swal.fire({
      title: t("Confirm Transfer"),
      text: `${t("Transfer total")} ₹${grandTotal.toFixed(2)} ${t("to Govt Account?")}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("Yes, Transfer"),
    });
    if (!result.value) return;

    setTransferring(true);
    api
      .post(baseURLMarket + `lotGroupage/executeMarketFeeTransfer`, {
        marketId,
        date: formatDate(date),
        fileName: fileName.trim(),
      })
      .then((res) => {
        const content = res.data?.content;
        const returnedFileName = content?.fileName || fileName.trim();
        setFileName(returnedFileName);
        Swal.fire({
          icon: "success",
          title: t("Success"),
          text: content?.message || t("Market fee transferred successfully."),
        });
      })
      .catch((err) => {
        const msg =
          err.response?.data?.errorMessages?.[0]?.message ||
          err.message ||
          t("Transfer failed.");
        Swal.fire({ icon: "error", title: t("Error"), text: msg });
      })
      .finally(() => setTransferring(false));
  };

  const handleDownloadBankCSV = () => {
    const name = fileName.trim();
    api
      .get(baseURLMarket + `lotGroupage/downloadMarketFeeTransferCSV`, {
        params: { marketId, fileName: name },
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = name.endsWith(".csv") ? name : `${name}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        const msg =
          err.response?.data?.errorMessages?.[0]?.message ||
          err.message ||
          t("Failed to download bank CSV.");
        Swal.fire({ icon: "error", title: t("Error"), text: msg });
      });
  };

  const handleClear = () => {
    setDate(new Date());
    setLotList([]);
    setSelectedLots(new Set());
    setSearched(false);
    setFileName("");
  };

  const labelStyle = { fontWeight: 600, fontSize: "14px", color: "#4a5568" };
  const thStyle = { padding: "12px 16px", color: "#92400e", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "2px solid #fde68a", whiteSpace: "nowrap" };
  const tdStyle = { padding: "11px 16px", verticalAlign: "middle", fontSize: "13px" };

  return (
    <Layout title={t("Transfer Market Fee to Govt Account")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Transfer Market Fee to Govt Account")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* Search Card */}
        <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)", marginBottom: 20 }}>
          <div style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)", padding: "14px 24px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>💳</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{t("Transfer Market Fee to Govt Account")}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>{t("Select date to load pending lots")}</div>
            </div>
          </div>
          <Card.Body style={{ padding: "20px 24px" }}>
            <Form onSubmit={handleSearch}>
              <Row className="g-3 align-items-end">

                <Col md={2}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Date")}</Form.Label>
                    <DatePicker
                      selected={date}
                      onChange={(d) => setDate(d)}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      maxDate={new Date()}
                    />
                  </Form.Group>
                </Col>

                <Col md={4} style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ background: "linear-gradient(135deg,#1e67a8,#2d9cdb)", border: "none", borderRadius: "8px", padding: "8px 22px", fontWeight: 700, fontSize: "14px", color: "#fff", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 3px 10px rgba(30,103,168,0.25)", whiteSpace: "nowrap", opacity: loading ? 0.7 : 1 }}
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

              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* Results Card */}
        {searched && (
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
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: "10px", padding: "8px 16px" }}>
                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{t("Total Market Fee")}</div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>₹ {grandTotal.toFixed(2)}</div>
                  </div>
                  {selectedLots.size > 0 && (
                    <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: "10px", padding: "8px 16px" }}>
                      <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{t("Selected Amount")}</div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>₹ {selectedTotal.toFixed(2)}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Card.Body style={{ padding: 0 }}>
              {lotList.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: 10, opacity: 0.35 }}>📦</div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#6b7280" }}>{t("No pending lots found for the given date and market.")}</div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table" style={{ marginBottom: 0 }}>
                    <thead>
                      <tr style={{ background: "linear-gradient(90deg, #fffbeb, #fef3c7)" }}>
                        <th style={{ padding: "12px 16px", borderBottom: "2px solid #fde68a", width: 44 }}>
                          <input type="checkbox" checked={allSelected} onChange={handleToggleAll} style={{ width: 16, height: 16, cursor: "pointer" }} />
                        </th>
                        {[t("Lot No"), t("Fruits ID"), t("Farmer Name"), t("Farmer Market Fee"), t("Reeler Market Fee"), t("Total Market Fee")].map((h) => (
                          <th key={h} style={thStyle}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lotList.map((item, i) => {
                        const isChecked = selectedLots.has(i);
                        return (
                          <tr
                            key={i}
                            style={{ borderBottom: "1px solid #fef3c7", background: isChecked ? "#fffbeb" : "transparent", cursor: "pointer" }}
                            onClick={() => handleToggleLot(i)}
                          >
                            <td style={tdStyle}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleLot(i)}
                                onClick={(e) => e.stopPropagation()}
                                style={{ width: 16, height: 16, cursor: "pointer" }}
                              />
                            </td>
                            <td style={{ ...tdStyle, fontWeight: 700, color: "#1e2a44" }}>{item.lotNo ?? "—"}</td>
                            <td style={{ ...tdStyle, color: "#6b7280" }}>{item.fruitsId || "—"}</td>
                            <td style={tdStyle}>{item.farmerName || "—"}</td>
                            <td style={{ ...tdStyle, fontWeight: 600, color: "#0e7a4e" }}>
                              {item.farmerMarketFee != null ? `₹ ${item.farmerMarketFee}` : "—"}
                            </td>
                            <td style={{ ...tdStyle, fontWeight: 600, color: "#1e67a8" }}>
                              {item.reelerMarketFee != null ? `₹ ${item.reelerMarketFee}` : "—"}
                            </td>
                            <td style={{ ...tdStyle, fontWeight: 700, color: "#92400e" }}>
                              {item.farmerMarketFee != null && item.reelerMarketFee != null
                                ? `₹ ${(item.farmerMarketFee + item.reelerMarketFee).toFixed(2)}`
                                : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: "#fffbeb", borderTop: "2px solid #fde68a" }}>
                        <td colSpan={3} style={{ padding: "10px 16px", fontWeight: 700, fontSize: "13px", color: "#92400e" }}>{t("Total")}</td>
                        <td style={{ padding: "10px 16px", fontWeight: 700, color: "#0e7a4e" }}>₹ {totalFarmerFee.toFixed(2)}</td>
                        <td style={{ padding: "10px 16px", fontWeight: 700, color: "#1e67a8" }}>₹ {totalReelerFee.toFixed(2)}</td>
                        <td style={{ padding: "10px 16px", fontWeight: 700, color: "#92400e" }}>₹ {grandTotal.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Action Buttons */}
        {searched && (
          <>
            {/* File name input row */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f8faff", border: "1.5px solid #c7d9f0", borderRadius: "10px", padding: "10px 18px" }}>
                <span style={{ fontWeight: 600, fontSize: "14px", color: "#4a5568", whiteSpace: "nowrap" }}>{t("File Name")} :</span>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder={t("Enter file name (e.g. SeedMktFee_May29)")}
                  style={{ borderRadius: "7px", border: "1.5px solid #a3c0e0", padding: "7px 14px", fontSize: "14px", outline: "none", width: "260px", color: "#1e2a44" }}
                />
              </div>
            </div>

            {/* Buttons row */}
            <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>

              <button
                type="button"
                disabled={lotList.length === 0}
                onClick={handleDownloadPreviewCSV}
                style={{ background: lotList.length === 0 ? "#e5e7eb" : "linear-gradient(135deg,#059669,#10b981)", border: "none", borderRadius: "9px", padding: "10px 28px", fontWeight: 700, fontSize: "14px", color: lotList.length === 0 ? "#9ca3af" : "#fff", cursor: lotList.length === 0 ? "not-allowed" : "pointer", boxShadow: lotList.length > 0 ? "0 3px 12px rgba(5,150,105,0.30)" : "none" }}
              >
                ⬇ {t("Download Preview CSV")}
              </button>

              <button
                type="button"
                disabled={transferring || lotList.length === 0 || !fileName.trim()}
                onClick={handleTransfer}
                style={{ background: (lotList.length === 0 || !fileName.trim()) ? "#e5e7eb" : "linear-gradient(135deg,#1e67a8,#2d9cdb)", border: "none", borderRadius: "9px", padding: "10px 28px", fontWeight: 700, fontSize: "14px", color: (lotList.length === 0 || !fileName.trim()) ? "#9ca3af" : "#fff", cursor: (transferring || lotList.length === 0 || !fileName.trim()) ? "not-allowed" : "pointer", boxShadow: (lotList.length > 0 && fileName.trim()) ? "0 3px 12px rgba(30,103,168,0.30)" : "none", opacity: transferring ? 0.7 : 1 }}
              >
                {transferring ? t("Transferring...") : t("Transfer to Govt Account")}
              </button>

              <button
                type="button"
                disabled={!fileName.trim()}
                onClick={handleDownloadBankCSV}
                style={{ background: !fileName.trim() ? "#e5e7eb" : "linear-gradient(135deg,#7c3aed,#a78bfa)", border: "none", borderRadius: "9px", padding: "10px 28px", fontWeight: 700, fontSize: "14px", color: !fileName.trim() ? "#9ca3af" : "#fff", cursor: !fileName.trim() ? "not-allowed" : "pointer", boxShadow: fileName.trim() ? "0 3px 12px rgba(124,58,237,0.30)" : "none" }}
              >
                ⬇ {t("Download Bank CSV")}
              </button>

            </div>
          </>
        )}

      </Block>
    </Layout>
  );
}

export default TransferMarketFeeToGovtAccount;
