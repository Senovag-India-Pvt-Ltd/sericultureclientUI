import DatePicker from "react-datepicker";
import { Card, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import api from "../../../services/auth/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

const formatDate = (d) =>
  d.getFullYear() +
  "-" +
  (d.getMonth() + 1).toString().padStart(2, "0") +
  "-" +
  d.getDate().toString().padStart(2, "0");

function PendingMarketFeeReport() {
  const { t } = useTranslation();

  const [reportType, setReportType] = useState("marketWise");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [fruitsId, setFruitsId] = useState("");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [validatedSearch, setValidatedSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lotList, setLotList] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setFromDate(new Date());
    setToDate(new Date());
  }, []);

  const totalMarketFee = lotList.reduce((sum, item) => sum + (item.marketFee || 0), 0);
  const totalPendingAmount = lotList.reduce((sum, item) => sum + (item.pendingAmount || 0), 0);

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
    setSearched(false);
    setLoading(true);

    const marketId = parseInt(localStorage.getItem("marketId")) || 0;
    const payload = {
      marketId: marketId,
      fromDate: formatDate(new Date(fromDate)),
      toDate: formatDate(new Date(toDate)),
      statusFilter: statusFilter === "paid" ? "Paid" : statusFilter === "pending" ? "Pending" : "",
      fruitsId: reportType === "farmerWise" ? fruitsId : "",
    };

    api
      .post(baseURLMarket + `auction/report/getPendingMarketFeeReport`, payload)
      .then((res) => {
        const data = res.data;
        const raw = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : [];

        const list = raw.filter((item) =>
          statusFilter === "paid"
            ? item.currentStatus === "Paid"
            : statusFilter === "pending"
            ? item.currentStatus === "Pending"
            : true
        );

        setLotList(list);
        setSearched(true);
        if (list.length === 0) {
          Swal.fire({ icon: "info", title: t("No Records"), text: t("No records found for the selected criteria.") });
        }
      })
      .catch((err) => {
        const msg =
          err.response?.data?.errorMessages?.[0]?.message ||
          err.message ||
          t("Failed to fetch report data.");
        Swal.fire({ icon: "error", title: t("Error"), text: msg });
        setSearched(true);
      })
      .finally(() => setLoading(false));
    setValidatedSearch(false);
  };

  const handleClear = () => {
    setFruitsId("");
    setFromDate(new Date());
    setToDate(new Date());
    setStatusFilter("pending");
    setLotList([]);
    setSearched(false);
    setValidatedSearch(false);
  };

  const handleReportTypeChange = (type) => {
    setReportType(type);
    setFruitsId("");
    setLotList([]);
    setSearched(false);
    setValidatedSearch(false);
  };

  const reportTitle = `Pending Market Fee Report (${reportType === "marketWise" ? "Market Wise" : "Farmer Wise"} - ${statusFilter === "paid" ? "Paid" : statusFilter === "pending" ? "Pending" : "All"})`;

  const tableHeaders = ["Sl No", "Farmer Name", "Farmer ID", "Fruits ID", "Lot No", "Market Name", "Lot Sold Amount", "Market Fee", "Paid Amount", "Pending Amount", "Current Status"];

  const tableRows = lotList.map((item, i) => [
    item.serialNumber ?? i + 1,
    item.farmerName || "",
    item.farmerId || "",
    item.fruitsId || "",
    item.lotNo ?? "",
    item.marketName || "",
    item.lotAmount ?? "",
    item.marketFee ?? "",
    item.paidAmount ?? "",
    item.pendingAmount ?? "",
    item.currentStatus || "",
  ]);

  const handleDownloadExcel = () => {
    const wsData = [tableHeaders, ...tableRows, ["", "", "", "", "", "", "Total", Number(totalMarketFee).toFixed(2), "", Number(totalPendingAmount).toFixed(2), ""]];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "PendingMarketFeeReport.xlsx");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(13);
    doc.text(reportTitle, 14, 15);
    autoTable(doc, {
      startY: 22,
      head: [tableHeaders],
      body: [...tableRows, ["", "", "", "", "", "Total", "", Number(totalMarketFee).toFixed(2), "", Number(totalPendingAmount).toFixed(2), ""]],
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [217, 119, 6], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [255, 251, 235] },
    });
    doc.save("PendingMarketFeeReport.pdf");
  };

  const labelStyle = { fontWeight: 600, fontSize: "14px", color: "#4a5568" };
  const inputStyle = { borderRadius: "8px", border: "1.5px solid #d0d9e8", fontSize: "14px" };
  const tdStyle = { padding: "11px 16px", verticalAlign: "middle", fontSize: "13px" };
  const thStyle = { padding: "12px 16px", color: "#92400e", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "2px solid #fde68a", whiteSpace: "nowrap" };

  return (
    <Layout title={t("Pending Market Fee Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Pending Market Fee Report")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* Search Card */}
        <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)", marginBottom: 20 }}>
          <div style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)", padding: "14px 24px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px" }}>📋</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{t("Pending Market Fee Report")}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>{t("Select report type, date range and status")}</div>
            </div>
          </div>
          <Card.Body style={{ padding: "20px 24px" }}>
            <Form noValidate validated={validatedSearch} onSubmit={handleSearch}>
              <Row className="g-3 align-items-end">

                <Col md={3}>
                  <Form.Label style={labelStyle}>{t("Report Type")}</Form.Label>
                  <div style={{ display: "flex", gap: "18px", paddingTop: 4, marginBottom: reportType === "farmerWise" ? 10 : 0 }}>
                    {["marketWise", "farmerWise"].map((val) => (
                      <label key={val} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: reportType === val ? 700 : 500, color: reportType === val ? "#1e67a8" : "#4a5568", fontSize: "14px", margin: 0 }}>
                        <input type="radio" name="reportType" value={val} checked={reportType === val} onChange={() => handleReportTypeChange(val)} style={{ width: 14, height: 14, cursor: "pointer", accentColor: "#1e67a8" }} />
                        {val === "marketWise" ? t("Market Wise") : t("Farmer Wise")}
                      </label>
                    ))}
                  </div>
                  {reportType === "farmerWise" && (
                    <Form.Group>
                      <Form.Label style={labelStyle}>{t("Fruits ID")}</Form.Label>
                      <Form.Control
                        value={fruitsId}
                        onChange={(e) => setFruitsId(e.target.value)}
                        type="text"
                        placeholder={t("Enter Fruits ID")}
                        required
                        style={inputStyle}
                      />
                      <Form.Control.Feedback type="invalid">{t("Fruits ID is Required")}</Form.Control.Feedback>
                    </Form.Group>
                  )}
                </Col>

                <Col md={2}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("From Date")}</Form.Label>
                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => setFromDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      placeholderText={t("From Date")}
                    />
                  </Form.Group>
                </Col>

                <Col md={2} style={{ paddingLeft: "20px" }}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("To Date")}</Form.Label>
                    <DatePicker
                      selected={toDate}
                      onChange={(date) => setToDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      placeholderText={t("To Date")}
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Label style={labelStyle}>{t("Status")}</Form.Label>
                  <div style={{ display: "flex", gap: "16px", paddingTop: 4 }}>
                    {[{ val: "pending", label: t("Pending") }, { val: "paid", label: t("Paid") }, { val: "all", label: t("All") }].map(({ val, label }) => (
                      <label key={val} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: statusFilter === val ? 700 : 500, color: statusFilter === val ? "#1e67a8" : "#4a5568", fontSize: "14px", margin: 0 }}>
                        <input type="radio" name="statusFilter" value={val} checked={statusFilter === val} onChange={() => setStatusFilter(val)} style={{ width: 14, height: 14, cursor: "pointer", accentColor: "#1e67a8" }} />
                        {label}
                      </label>
                    ))}
                  </div>
                </Col>

                <Col md={2} style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" disabled={loading} style={{ background: "linear-gradient(135deg,#1e67a8,#2d9cdb)", border: "none", borderRadius: "8px", padding: "8px 20px", fontWeight: 700, fontSize: "14px", color: "#fff", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 3px 10px rgba(30,103,168,0.25)", whiteSpace: "nowrap", opacity: loading ? 0.7 : 1 }}>
                    🔍 {loading ? t("Searching...") : t("Search")}
                  </button>
                  <button type="button" onClick={handleClear} style={{ background: "#f0f6ff", border: "1.5px solid #1e67a8", borderRadius: "8px", padding: "8px 14px", fontWeight: 700, fontSize: "14px", color: "#1e67a8", cursor: "pointer", whiteSpace: "nowrap" }}>
                    {t("Clear")}
                  </button>
                </Col>

              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* Report Table */}
        {searched && (
          <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(245,158,11,0.10)" }}>
            <div style={{ background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)", padding: "14px 24px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>📋</div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>
                    {reportType === "marketWise" ? t("Market Wise") : t("Farmer Wise")} — {statusFilter === "paid" ? t("Paid") : statusFilter === "pending" ? t("Pending") : t("All")}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px" }}>{lotList.length} {t("record(s) found")}</div>
                </div>
              </div>
              {lotList.length > 0 && (
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: "10px", padding: "8px 16px" }}>
                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{t("Total Market Fee")}</div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>₹ {totalMarketFee.toFixed(2)}</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: "10px", padding: "8px 16px" }}>
                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{t("Total Pending Amount")}</div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>₹ {totalPendingAmount.toFixed(2)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadExcel}
                    style={{ background: "#16a34a", border: "none", borderRadius: "8px", padding: "8px 16px", fontWeight: 700, fontSize: "12px", color: "#fff", cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    ⬇ {t("Excel")}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    style={{ background: "#dc2626", border: "none", borderRadius: "8px", padding: "8px 16px", fontWeight: 700, fontSize: "12px", color: "#fff", cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    ⬇ {t("PDF")}
                  </button>
                </div>
              )}
            </div>
            <Card.Body style={{ padding: 0 }}>
              {lotList.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: 10, opacity: 0.35 }}>📋</div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#6b7280" }}>{t("No records found for the selected criteria.")}</div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table" style={{ marginBottom: 0 }}>
                    <thead>
                      <tr style={{ background: "linear-gradient(90deg, #fffbeb, #fef3c7)" }}>
                        {[t("Sl No"), t("Farmer Name"), t("Farmer ID"), t("Fruits ID"), t("Lot No"), t("Market Name"), t("Lot Sold Amount"), t("Market Fee"), t("Paid Amount"), t("Pending Amount"), t("Current Status")].map((h) => (
                          <th key={h} style={thStyle}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lotList.map((item, i) => (
                        <tr key={item.serialNumber || i} style={{ borderBottom: "1px solid #fef3c7" }}>
                          <td style={{ ...tdStyle, color: "#6b7280" }}>{item.serialNumber ?? i + 1}</td>
                          <td style={{ ...tdStyle }}>{item.farmerName || "—"}</td>
                          <td style={{ ...tdStyle, color: "#6b7280" }}>{item.farmerId || "—"}</td>
                          <td style={{ ...tdStyle, color: "#6b7280" }}>{item.fruitsId || "—"}</td>
                          <td style={{ ...tdStyle, fontWeight: 700, color: "#1e2a44" }}>{item.lotNo ?? "—"}</td>
                          <td style={{ ...tdStyle }}>{item.marketName || "—"}</td>
                          <td style={{ ...tdStyle, fontWeight: 600, color: "#0e7a4e" }}>
                            {item.lotAmount != null ? `₹ ${item.lotAmount}` : "—"}
                          </td>
                          <td style={{ ...tdStyle, fontWeight: 600, color: "#1e67a8" }}>
                            {item.marketFee != null ? `₹ ${item.marketFee}` : "—"}
                          </td>
                          <td style={{ ...tdStyle, fontWeight: 600, color: "#0e7a4e" }}>
                            {item.paidAmount != null ? `₹ ${item.paidAmount}` : "—"}
                          </td>
                          <td style={{ ...tdStyle, fontWeight: 700, color: "#c53030" }}>
                            {item.pendingAmount != null ? `₹ ${item.pendingAmount}` : "—"}
                          </td>
                          <td style={{ ...tdStyle }}>
                            <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, background: item.currentStatus === "Paid" ? "#dcfce7" : "#fef2f2", color: item.currentStatus === "Paid" ? "#15803d" : "#dc2626" }}>
                              {item.currentStatus || "—"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: "#fffbeb", borderTop: "2px solid #fde68a" }}>
                        <td colSpan={6} style={{ padding: "10px 16px", fontWeight: 700, fontSize: "13px", color: "#92400e" }}>{t("Total")}</td>
                        <td style={{ padding: "10px 16px" }}></td>
                        <td style={{ padding: "10px 16px", fontWeight: 700, color: "#1e67a8" }}>₹ {Number(totalMarketFee).toFixed(2)}</td>
                        <td style={{ padding: "10px 16px" }}></td>
                        <td style={{ padding: "10px 16px", fontWeight: 700, color: "#c53030" }}>₹ {Number(totalPendingAmount).toFixed(2)}</td>
                        <td style={{ padding: "10px 16px" }}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        )}
      </Block>
    </Layout>
  );
}

export default PendingMarketFeeReport;
