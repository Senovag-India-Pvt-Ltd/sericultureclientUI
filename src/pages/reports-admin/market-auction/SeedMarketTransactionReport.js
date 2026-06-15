import { Card, Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2/src/sweetalert2.js";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import api from "../../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";

// All numeric column indices (right-aligned, show "—" when falsy)
const NUMERIC_IDX = new Set([4, 5, 6, 7, 8, 9, 10]);

// Column widths shared by both report types
const COL_WIDTHS = {
  0:  "45px",
  1:  "100px",
  2:  "170px",
  3:  "75px",
  4:  "105px",
  5:  "105px",
  6:  "100px",
  7:  "120px",
  8:  "95px",
  9:  "110px",
  10: "110px",
};

const formatDate = (d) =>
  d.getFullYear() + "-" +
  (d.getMonth() + 1).toString().padStart(2, "0") + "-" +
  d.getDate().toString().padStart(2, "0");

// Returns the raw value for a cell given the row, column index, and report type.
// Returns null for the Sl No column (handled separately).
const getCellValue = (item, colIdx, reportType) => {
  if (colIdx === 0) return null;
  // cols 0–5 and col 10 are identical for both types
  switch (colIdx) {
    case 1:  return item.transactionDate;
    case 2:  return item.operationDescription;
    case 3:  return item.transactionType;
    case 4:  return item.depositAmount;
    case 5:  return item.lotWeight;
    case 10: return item.balance;
    default: break;
  }
  if (reportType === "EXTERNAL_UNIT") {
    switch (colIdx) {
      case 6: return item.qtyNos;
      case 7: {
        const w = parseFloat(item.lotWeight) || 0;
        const q = parseFloat(item.qtyNos) || 0;
        return w && q ? w * q : null;
      }
      case 8: return item.ratePerKg;
      case 9: return item.paymentAmount;
      default: return null;
    }
  }
  // REELING (default)
  switch (colIdx) {
    case 6: return item.ratePerKg;
    case 7: return item.paymentAmount;
    case 8: return item.marketFee;
    case 9: return item.total;
    default: return null;
  }
};

function SeedMarketTransactionReport() {
  const { t } = useTranslation();

  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: localStorage.getItem("godownId"),
    fromDate: new Date(),
    toDate: new Date(),
    licenseNumber: "",
    buyerType: "REELING",
  });
  const [validated, setValidated] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [shown, setShown] = useState(false);
  const [loadPdf, setLoadPdf] = useState(false);
  const [licenseList, setLicenseList] = useState([]);

  useEffect(() => {
    setData((prev) => ({ ...prev, fromDate: new Date(), toDate: new Date() }));
  }, []);

  useEffect(() => {
    api
      .get(baseURLMarket + "lotGroupage/getLicenseNumberList", {
        params: {
          marketId: data.marketId,
          godownId: data.godownId,
          buyerType: data.buyerType,
        },
      })
      .then((res) => {
        const list = res.data?.content || res.data || [];
        setLicenseList(Array.isArray(list) ? list : []);
        setData((prev) => ({ ...prev, licenseNumber: "" }));
      })
      .catch(() => setLicenseList([]));
  }, [data.buyerType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const requestBody = () => ({
    marketId: data.marketId,
    godownId: data.godownId,
    fromDate: formatDate(data.fromDate),
    toDate: formatDate(data.toDate),
    licenseNumber: data.licenseNumber,
    buyerType: data.buyerType,
  });

  const postData = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    const selectedBuyerType = data.buyerType;
    const selectedLabel = selectedBuyerType === "EXTERNAL_UNIT" ? t("External Unit") : t("Reeler");

    api
      .post(baseURLMarket + "lotGroupage/getSeedMarketTxnReport", requestBody())
      .then((response) => {
        const { content, errorMessages, errorCode } = response.data;

        if (errorCode === -1 || (errorMessages && errorMessages.length > 0)) {
          setReportData(null);
          setShown(false);
          Swal.fire({
            icon: "error",
            title: t("Error"),
            text: errorMessages?.[0] || t("Something went wrong"),
          });
          return;
        }

        const returnedType = content?.reportType;
        if (returnedType != null && returnedType !== selectedBuyerType) {
          setReportData(null);
          setShown(false);
          Swal.fire({
            icon: "error",
            title: t("License Number Not Found"),
            text: `This license number is not registered as a ${selectedLabel}.`,
          });
          return;
        }

        if (content?.reelerTransactionReports?.length > 0) {
          setReportData(content);
          setShown(true);
        } else {
          setReportData(null);
          setShown(false);
          Swal.fire({ icon: "warning", title: "No Record Found" });
        }
      })
      .catch((error) => {
        const errMsg = error.response?.data?.errorMessages?.[0];
        Swal.fire({
          icon: "error",
          title: t("Error"),
          text: errMsg || t("Something went wrong"),
        });
      });
  };

  const downloadExcel = () => {
    const isEgg = data.buyerType === "EXTERNAL_UNIT";
    const endpoint = isEgg
      ? "lotGroupage/downloadEggProducerTxnReport"
      : "lotGroupage/downloadSeedMarketTxnReport";
    const filename = isEgg
      ? "ExternalUnitTransactionReport.xlsx"
      : "SeedMarketTransactionReport.xlsx";

    api
      .post(baseURLMarket + endpoint, requestBody(), { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => {
        Swal.fire({ icon: "error", title: t("Error"), text: t("Failed to download Excel report.") });
      });
  };

  const downloadPdf = async () => {
    const isEgg = data.buyerType === "EXTERNAL_UNIT";
    const endpoint = isEgg
      ? "lotGroupage/downloadEggProducerTxnReportPDF"
      : "lotGroupage/downloadSeedMarketTxnReportPDF";
    setLoadPdf(true);
    try {
      const res = await api.post(
        baseURLMarket + endpoint,
        requestBody(),
        { responseType: "blob" },
      );
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      window.open(url);
    } catch {
      Swal.fire({ icon: "error", title: t("Error"), text: t("Failed to generate PDF report.") });
    } finally {
      setLoadPdf(false);
    }
  };

  const lbl = {
    fontSize: "11px", fontWeight: 700, color: "#5a6a7e",
    marginBottom: "3px", display: "block",
    textTransform: "uppercase", letterSpacing: "0.05em",
  };
  const btnStyle = (bg, shadow, disabled) => ({
    background: disabled ? "#c8d6e5" : bg,
    border: "none", borderRadius: "8px",
    padding: "8px 18px", fontWeight: 700, fontSize: "13px", color: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : shadow,
    display: "inline-flex", alignItems: "center", gap: "7px", whiteSpace: "nowrap",
    opacity: disabled ? 0.7 : 1,
  });
  const tfootTd = (extra = {}) => ({
    padding: "11px 14px", borderTop: "2px solid #bfdbfe",
    color: "#1e40af", fontVariantNumeric: "tabular-nums",
    textAlign: "right", ...extra,
  });

  const FALLBACK_HEADERS = [
    t("Sl No"), t("Transaction Date"), t("Description"), t("Transaction Type"),
    t("Deposit Amount"), t("Qty of Seed Cocoon Purchased (kgs)"), t("Rate/Kg"),
    t("Cocoon Purchased Amount"), t("Market Fee @1%"), t("Total"), t("Balance Amount"),
  ];

  const headers = reportData?.columnHeaders?.length > 0 ? reportData.columnHeaders : FALLBACK_HEADERS;
  const rows       = reportData?.reelerTransactionReports || [];
  const reportType = reportData?.reportType || "REELING";
  const isEgg      = reportType === "EXTERNAL_UNIT";

  // EGG_PRODUCER footer needs computed totals from rows
  const totalQtyNos         = isEgg ? rows.reduce((s, r) => s + (parseFloat(r.qtyNos) || 0), 0) : 0;
  const totalLotWeightQtyNos = isEgg ? rows.reduce((s, r) => s + ((parseFloat(r.lotWeight) || 0) * (parseFloat(r.qtyNos) || 0)), 0) : 0;

  return (
    <Layout title={t("Seed Market Transaction Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Seed Market Transaction Report")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter card ── */}
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)" }}>
          <div style={{
            background: ACCENT_HEADER, padding: "11px 18px",
            display: "flex", alignItems: "center", gap: "10px",
            borderRadius: "12px 12px 0 0",
          }}>
            <span style={{ fontSize: "20px" }}>📋</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>
                {t("Seed Market Transaction Report")}
              </div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>
                {t("Enter license number and date range to view transactions")}
              </div>
            </div>
          </div>
          <Card.Body style={{ padding: "14px 18px 16px" }}>
            <Form noValidate validated={validated} onSubmit={postData}>
              <Row className="g-2 align-items-end">
                <Col md={2}>
                  <label style={lbl}>{t("Report Type")}</label>
                  <div style={{ display: "flex", gap: "20px", paddingTop: "4px" }}>
                    {[
                      { val: "REELING", label: t("Reeler") },
                      { val: "EXTERNAL_UNIT", label: t("External Unit") },
                    ].map(({ val, label }) => (
                      <label key={val} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", fontWeight: data.buyerType === val ? 700 : 500, color: data.buyerType === val ? "#1a5f9e" : "#4a5568", margin: 0 }}>
                        <input
                          type="radio"
                          name="buyerType"
                          value={val}
                          checked={data.buyerType === val}
                          onChange={() => {
                            setData((prev) => ({ ...prev, buyerType: val }));
                            setReportData(null);
                            setShown(false);
                          }}
                          style={{ width: 14, height: 14, cursor: "pointer", accentColor: "#1a5f9e" }}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </Col>
                <Col md={3}>
                  <label style={lbl}>
                    {t("License Number")} <span style={{ color: "#e53e3e" }}>*</span>
                  </label>
                  <Form.Select
                    name="licenseNumber"
                    value={data.licenseNumber}
                    onChange={handleInputs}
                    required
                    style={{ borderRadius: "7px", border: "1.5px solid #d0d9e8", fontSize: "13px" }}
                  >
                    <option value="">{t("-- Select License Number --")}</option>
                    {licenseList.map((item, i) => {
                      const val = typeof item === "object" ? (item.licenseNumber || item.value || item.id) : item;
                      const name = typeof item === "object" ? (item.name || item.label || "") : "";
                      const label = name ? `${val} - ${name}` : val;
                      return <option key={i} value={val}>{label}</option>;
                    })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {t("License Number is required")}
                  </Form.Control.Feedback>
                </Col>
                <Col md={2}>
                  <label style={lbl}>
                    {t("From Date")} <span style={{ color: "#e53e3e" }}>*</span>
                  </label>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={data.fromDate}
                    onChange={(date) => setData((prev) => ({ ...prev, fromDate: date }))}
                    maxDate={new Date()}
                    className="form-control"
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>
                    {t("To Date")} <span style={{ color: "#e53e3e" }}>*</span>
                  </label>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={data.toDate}
                    onChange={(date) => setData((prev) => ({ ...prev, toDate: date }))}
                    maxDate={new Date()}
                    className="form-control"
                  />
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" style={btnStyle("linear-gradient(135deg,#1a5f9e,#2c8fd4)", "0 3px 10px rgba(26,95,158,0.30)", false)}>
                      🔍 {t("Search")}
                    </button>
                    <button type="button" onClick={downloadExcel} style={btnStyle("linear-gradient(135deg,#1d6a3a,#22883f)", "0 3px 10px rgba(29,106,58,0.28)", false)}>
                      🟢 {t("Download Excel")}
                    </button>
                    <button type="button" onClick={downloadPdf} disabled={loadPdf} style={btnStyle("linear-gradient(135deg,#c53030,#e53e3e)", "0 3px 10px rgba(197,48,48,0.28)", loadPdf)}>
                      {loadPdf
                        ? <><span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13 }} /> {t("Generating...")}</>
                        : <>📥 {t("Download PDF")}</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* ── Report section ── */}
        {shown && reportData ? (
          <div className="mt-3">

            {/* Buyer info */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ebf8ff,#e6fffa)", border: "1.5px solid #bee3f8", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#2b6cb0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  {isEgg ? t("External Unit Name") : t("Reeler / Buyer Name")}
                </span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>
                  {reportData.name || "—"}
                </span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#f0fff4,#f7fafc)", border: "1.5px solid #9ae6b4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "260px" }}>
                <span style={{ fontSize: "11px", color: "#276749", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  {t("Address")}
                </span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>
                  {reportData.address || "—"}
                </span>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span style={{ background: "linear-gradient(135deg,#edf2f7,#e2e8f0)", border: "1.5px solid #cbd5e0", borderRadius: "20px", padding: "6px 16px", fontSize: "12px", color: "#4a5568", fontWeight: 600 }}>
                  {rows.length} {t("records")}
                </span>
              </div>
            </div>

            {/* Table */}
            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", tableLayout: "fixed" }}>
                  <colgroup>
                    {headers.map((_, i) => <col key={i} style={{ width: COL_WIDTHS[i] || "auto" }} />)}
                  </colgroup>
                  <thead>
                    <tr>
                      {headers.map((h, i) => (
                        <th key={i} style={{
                          background: ACCENT_TABLE, color: "#fff",
                          padding: "10px 12px",
                          textAlign: NUMERIC_IDX.has(i) ? "right" : i === 0 ? "center" : "left",
                          borderRight: i < headers.length - 1 ? "1px solid rgba(255,255,255,0.18)" : undefined,
                          fontWeight: 700, whiteSpace: "normal",
                          wordBreak: "break-word", lineHeight: "1.35",
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((item, idx) => {
                      const bg = idx % 2 === 0 ? "#fff" : "#f7fafd";
                      return (
                        <tr
                          key={idx}
                          style={{ background: bg, transition: "background 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#eef5fd")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = bg)}
                        >
                          {headers.map((_, colIdx) => {
                            const isNumeric = NUMERIC_IDX.has(colIdx);
                            let cellVal;
                            if (colIdx === 0) {
                              cellVal = idx + 1;
                            } else {
                              const raw = getCellValue(item, colIdx, reportType);
                              if (isNumeric) {
                                cellVal = raw != null && raw !== 0 && raw !== "" ? Number(raw).toFixed(2) : "—";
                              } else {
                                cellVal = raw || "—";
                              }
                            }
                            return (
                              <td key={colIdx} style={{
                                padding: "10px 12px",
                                textAlign: isNumeric ? "right" : colIdx === 0 ? "center" : "left",
                                borderBottom: "1px solid #e8edf5",
                                borderRight: "1px solid #eef2f7",
                                color: isNumeric ? "#1e40af" : "#2d3748",
                                fontVariantNumeric: isNumeric ? "tabular-nums" : undefined,
                                fontWeight: isNumeric ? 600 : 500,
                                whiteSpace: isNumeric ? "nowrap" : "normal",
                              }}>
                                {cellVal}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "linear-gradient(135deg,#e8f0fe,#dbeafe)", fontWeight: 700 }}>
                      <td colSpan={4} style={{ padding: "11px 14px", color: "#1a5f9e", fontWeight: 800, fontSize: "14px", borderTop: "2px solid #bfdbfe" }}>
                        ಒಟ್ಟ
                      </td>
                      {/* col 4 — depositAmount */}
                      <td style={tfootTd()}>{Number(reportData.totalDeposits || 0).toFixed(2)}</td>
                      {/* col 5 — lotWeight */}
                      <td style={tfootTd()}>{Number(reportData.totalLotWeight || 0).toFixed(2)}</td>

                      {isEgg ? (<>
                        {/* col 6 — qtyNos total */}
                        <td style={tfootTd()}>{totalQtyNos.toFixed(2)}</td>
                        {/* col 7 — lotWeight × qtyNos total */}
                        <td style={tfootTd()}>{totalLotWeightQtyNos.toFixed(2)}</td>
                        {/* col 8 — ratePerKg — blank */}
                        <td style={tfootTd({ textAlign: "left" })}></td>
                        {/* col 9 — paymentAmount */}
                        <td style={tfootTd()}>{Number(reportData.totalPaymentAmount || 0).toFixed(2)}</td>
                      </>) : (<>
                        {/* col 6 — ratePerKg — blank */}
                        <td style={tfootTd({ textAlign: "left" })}></td>
                        {/* col 7 — paymentAmount */}
                        <td style={tfootTd()}>{Number(reportData.totalPaymentAmount || 0).toFixed(2)}</td>
                        {/* col 8 — marketFee */}
                        <td style={tfootTd()}>{Number(reportData.totalMarketFee || 0).toFixed(2)}</td>
                        {/* col 9 — total purchase */}
                        <td style={tfootTd()}>{Number(reportData.totalPurchase || 0).toFixed(2)}</td>
                      </>)}

                      {/* col 10 — closingBalance */}
                      <td style={tfootTd()}>{Number(reportData.closingBalance || 0).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="mt-3" style={{ borderRadius: "12px", border: "1.5px dashed #cbd5e0", background: "#fafcff", boxShadow: "none" }}>
            <Card.Body style={{ padding: "32px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>📋</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a202c", marginBottom: "4px" }}>
                {t("Seed Market Transaction Report")}
              </div>
              <div style={{ fontSize: "13px", color: "#718096" }}>
                {t("Enter License Number and date range above, then click")}{" "}
                <b style={{ color: "#1a5f9e" }}>{t("Search")}</b>{" "}
                {t("to load the report.")}
              </div>
            </Card.Body>
          </Card>
        )}

      </Block>
    </Layout>
  );
}

export default SeedMarketTransactionReport;
