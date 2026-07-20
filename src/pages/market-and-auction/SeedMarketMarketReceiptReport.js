import React, { useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import api from "../../services/auth/api";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function SeedMarketMarketReceiptReport() {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);

  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    allottedLotId: "",
    auctionDate: new Date(),
  });

  const formatDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  if (!document.getElementById("swal-report-styles")) {
    const s = document.createElement("style");
    s.id = "swal-report-styles";
    s.innerHTML = `
      .swal-pop { border-radius: 22px !important; padding: 8px !important; box-shadow: 0 30px 90px rgba(0,0,0,0.22) !important; }
      .swal-pop .swal2-title { font-size: 21px !important; font-weight: 800 !important; color: #1a202c !important; }
      .swal-pop .swal2-icon { margin: 20px auto 4px !important; }
      .swal-pop .swal2-html-container { margin: 0 !important; padding: 0 !important; }
      .swal-pop .swal2-actions { gap: 10px !important; }
      .swal-pop .swal2-confirm, .swal-pop .swal2-cancel { border-radius: 11px !important; padding: 12px 30px !important; font-weight: 700 !important; font-size: 14px !important; }
    `;
    document.head.appendChild(s);
  }

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!data.allottedLotId) {
      Swal.fire({
        icon: "warning", title: "Required Field",
        html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">Bidding Slip Lot No Required</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">Please enter the Bidding Slip Lot No before generating the report.</p></div></div></div>`,
        confirmButtonText: "Got it", confirmButtonColor: "#d97706", background: "#fff",
        showClass: { popup: "animate__animated animate__headShake animate__faster" },
        customClass: { popup: "swal-pop" },
      });
      return;
    }
    setIsGenerating(true);
    try {
      const response = await api.post(
        baseURLReport + `get-market-reciept`,
        { marketId: data.marketId, allottedLotId: data.allottedLotId, auctionDate: formatDate(data.auctionDate) },
        { responseType: "blob" }
      );
      const blobData = response.data;
      if (!blobData || blobData.size === 0) {
        Swal.fire({ icon: "info", title: "No Data Found", text: "No records found for the selected criteria." });
        return;
      }
      const firstBytes = await blobData.slice(0, 10).text();
      if (!firstBytes.startsWith('%PDF')) {
        Swal.fire({ icon: "info", title: "No Data Found", text: "No records found for the selected criteria." });
        return;
      }
      const pdfUrl = URL.createObjectURL(blobData);
      const pdfWindow = window.open(pdfUrl, '_blank');
      if (!pdfWindow) {
        const a = document.createElement('a');
        a.href = pdfUrl; a.download = `market-receipt-lot-${data.allottedLotId}.pdf`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      }
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
    } catch (err) {
      let isNoData = false;
      try { const b = err?.response?.data; if (b instanceof Blob) { const t = await b.text(); isNoData = /out of bounds|No Data|length 0|No data found/i.test(t); } } catch (_) {}
      if (isNoData) {
        Swal.fire({ icon: "info", title: "No Data Found", text: "No records found for the selected criteria." });
      } else {
        Swal.fire({
          icon: "error", title: "Generation Failed",
          html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Could Not Generate</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">Failed to generate the report. Please try again.</p></div></div></div>`,
          confirmButtonText: "Close", confirmButtonColor: "#e53e3e", background: "#fff",
          showClass: { popup: "animate__animated animate__shakeX animate__faster" },
          customClass: { popup: "swal-pop" },
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const inputStyle = { borderRadius: "8px", border: "1.5px solid #d0d9e8", padding: "8px 12px", fontSize: "14px", background: "#f8fafd", color: "#333", width: "100%" };
  const labelStyle = { fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "5px", display: "block" };
  const fieldGroupStyle = { display: "flex", flexDirection: "column", marginBottom: "4px" };

  return (
    <Layout title={t("Market Receipt Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Market Receipt Report")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)" }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)", padding: "18px 28px", display: "flex", alignItems: "center", gap: "12px", borderRadius: "14px 14px 0 0" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🏪</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "17px", lineHeight: 1.2 }}>Market Receipt Report</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", marginTop: "2px" }}>Generate market receipt by auction date and bidding lot</div>
            </div>
            <div style={{ marginLeft: "auto", background: "rgba(255,255,255,0.15)", borderRadius: "20px", padding: "4px 14px" }}>
              <span style={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>Seed Market</span>
            </div>
          </div>

          <Card.Body style={{ padding: "28px 32px 32px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e67a8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px" }}>
              Filter Parameters
            </div>

            <Form onSubmit={handleGenerate}>
              <Row className="mb-3">
                <Col md={4} style={fieldGroupStyle}>
                  <label style={labelStyle}>Auction Date <span style={{ color: "#e53e3e" }}>*</span></label>
                  <DatePicker dateFormat="dd/MM/yyyy" selected={data.auctionDate} onChange={(d) => setData({ ...data, auctionDate: d })} className="form-control" maxDate={new Date()} required />
                </Col>
                <Col md={4} style={fieldGroupStyle}>
                  <label style={labelStyle}>Bidding Slip Lot No <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Control type="text" name="allottedLotId" value={data.allottedLotId} onChange={(e) => setData({ ...data, allottedLotId: e.target.value })} placeholder="Enter Bidding Slip Lot No" style={inputStyle} required />
                </Col>
              </Row>

              <div style={{ borderTop: "1.5px dashed #d0d9e8", margin: "16px 0 24px" }} />

              <div className="d-flex gap-3">
                <button type="submit" disabled={isGenerating} style={{ background: isGenerating ? "#c8d6e5" : "linear-gradient(135deg,#1e67a8,#2d9cdb)", border: "none", borderRadius: "10px", padding: "12px 32px", fontWeight: 700, fontSize: "14px", color: "#fff", cursor: isGenerating ? "not-allowed" : "pointer", boxShadow: isGenerating ? "none" : "0 4px 14px rgba(30,103,168,0.35)", display: "flex", alignItems: "center", gap: "8px" }}>
                  {isGenerating ? <><span className="spinner-border spinner-border-sm" />Generating…</> : <>📄 Generate Market Receipt Report</>}
                </button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default SeedMarketMarketReceiptReport;
