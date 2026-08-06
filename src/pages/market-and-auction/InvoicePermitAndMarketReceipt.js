import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import ReactSelect from "react-select";
import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

const REPORT_TYPES = [
  { id: "invoice",       label: "Invoice",        icon: "🧾", desc: "By Grainage & Date Range"   },
  { id: "permit",        label: "Permit",          icon: "📋", desc: "By External User & Date"    },
  { id: "cashReceipt",   label: "Cash Receipt",    icon: "💵", desc: "By Auction Date & Lot No"   },
  { id: "marketReceipt", label: "Market Receipt",  icon: "🏪", desc: "By Auction Date & Lot No"   },
];

function InvoicePermitAndMarketReceipt() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("invoice");
  const [isGenerating, setIsGenerating] = useState(false);

  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: localStorage.getItem("godownId"),
    allottedLotId: "",
    auctionDate: new Date(),
    grainageMasterId: "",
    externalUnitRegistrationId: "",
    fromDate: new Date(),
    toDate: new Date(),
  });

  // ── master data ───────────────────────────────────────────────────
  const [grainageListData, setGrainageListData] = useState([]);
  useEffect(() => {
    api.get(baseURL + `grainageMaster/get-all`)
      .then((r) => setGrainageListData(r.data.content.grainageMaster))
      .catch(() => setGrainageListData([]));
  }, []);

  const [externalListData, setExternalListData] = useState([]);
  useEffect(() => {
    api.get(baseURLFarmer + `external-unit-registration/get-all`)
      .then((r) => setExternalListData(r.data.content.externalUnitRegistration))
      .catch(() => setExternalListData([]));
  }, []);

  const externalUserOptions = externalListData?.map((list) => ({
    value: list.externalUnitRegistrationId,
    label: `${list.name} (${list.licenseNumber})`,
  }));

  // ── date formatter ────────────────────────────────────────────────
  const fmt = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  // ── Swal styles ───────────────────────────────────────────────────
  if (!document.getElementById("swal-custom-styles")) {
    const s = document.createElement("style");
    s.id = "swal-custom-styles";
    s.innerHTML = `
      .swal-pop { border-radius: 22px !important; padding: 8px !important; box-shadow: 0 30px 90px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.03) !important; }
      .swal-pop .swal2-title { font-size: 21px !important; font-weight: 800 !important; color: #1a202c !important; letter-spacing: -0.02em !important; padding-top: 2px !important; }
      .swal-pop .swal2-icon { margin: 20px auto 4px !important; }
      .swal-pop .swal2-html-container { margin: 0 !important; padding: 0 !important; }
      .swal-pop .swal2-actions { gap: 10px !important; padding-bottom: 4px !important; margin-top: 2px !important; }
      .swal-pop .swal2-confirm, .swal-pop .swal2-cancel { border-radius: 11px !important; padding: 12px 30px !important; font-weight: 700 !important; font-size: 14px !important; letter-spacing: 0.02em !important; box-shadow: 0 4px 14px rgba(0,0,0,0.13) !important; }
      .swal-pop .swal2-timer-progress-bar { height: 4px !important; border-radius: 0 0 4px 4px !important; }
    `;
    document.head.appendChild(s);
  }

  // ── report generators ─────────────────────────────────────────────
  const showError = (title, body) =>
    Swal.fire({
      icon: "warning", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">Required Field</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${body}</p></div></div></div>`,
      confirmButtonText: "Got it", confirmButtonColor: "#d97706", background: "#fff",
      showClass: { popup: "animate__animated animate__headShake animate__faster" },
      customClass: { popup: "swal-pop" },
    });

  const showFail = () =>
    Swal.fire({
      icon: "error", title: "Generation Failed",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left;margin-bottom:10px"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Could Not Generate</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">Failed to generate the report. Please check your connection and try again.</p></div></div><div style="background:#f7fafc;border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:8px"><span style="font-size:16px">💡</span><span style="color:#4a5568;font-size:12.5px">If the problem persists, contact your system administrator.</span></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e", background: "#fff",
      showClass: { popup: "animate__animated animate__shakeX animate__faster" },
      customClass: { popup: "swal-pop" },
    });

  const openPdf = (blob) =>
    window.open(URL.createObjectURL(new Blob([blob], { type: "application/pdf" })));

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      let response;
      if (selectedCategory === "invoice") {
        if (!data.grainageMasterId) { showError("Grainage Required", "Please select a Grainage before generating the Invoice report."); return; }
        response = await api.post(baseURLReport + `get-Invoice`, { marketId: data.marketId, grainageMasterId: data.grainageMasterId, fromDate: fmt(data.fromDate), toDate: fmt(data.toDate) }, { responseType: "blob" });
      } else if (selectedCategory === "permit") {
        if (!data.externalUnitRegistrationId) { showError("External User Required", "Please select an External User before generating the Permit report."); return; }
        response = await api.post(baseURLReport + `get-Permit`, { marketId: data.marketId, externalUnitRegistrationId: data.externalUnitRegistrationId, fromDate: fmt(data.fromDate), toDate: fmt(data.toDate) }, { responseType: "blob" });
      } else if (selectedCategory === "cashReceipt") {
        if (!data.allottedLotId) { showError("Lot No Required", "Please enter the Bidding Slip Lot No before generating the Cash Receipt report."); return; }
        response = await api.post(baseURLReport + `get-Rasheedi`, { marketId: data.marketId, allottedLotId: data.allottedLotId, auctionDate: fmt(data.auctionDate) }, { responseType: "blob" });
      } else if (selectedCategory === "marketReceipt") {
        if (!data.allottedLotId) { showError("Lot No Required", "Please enter the Bidding Slip Lot No before generating the Market Receipt report."); return; }
        response = await api.post(baseURLReport + `get-market-reciept`, { marketId: data.marketId, allottedLotId: data.allottedLotId, auctionDate: fmt(data.auctionDate) }, { responseType: "blob" });
      }
      openPdf(response.data);
    } catch {
      showFail();
    } finally {
      setIsGenerating(false);
    }
  };

  // ── styles ────────────────────────────────────────────────────────
  const inputStyle = {
    borderRadius: "8px", border: "1.5px solid #d0d9e8", padding: "8px 12px",
    fontSize: "14px", background: "#f8fafd", color: "#333", width: "100%",
  };
  const labelStyle = {
    fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px", display: "block",
  };
  const fieldGroupStyle = { display: "flex", flexDirection: "column", marginBottom: "4px" };

  const reactSelectStyles = {
    control: (b, s) => ({
      ...b, borderRadius: "8px",
      border: s.isFocused ? "1.5px solid #1e67a8" : "1.5px solid #d0d9e8",
      background: "#f8fafd", fontSize: "14px", minHeight: "40px",
      boxShadow: s.isFocused ? "0 0 0 3px rgba(30,103,168,0.12)" : "none",
    }),
    menu: (b) => ({ ...b, borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 9999 }),
    option: (b, s) => ({
      ...b, fontSize: "13px",
      background: s.isSelected ? "#1e67a8" : s.isFocused ? "#ebf4ff" : "#fff",
      color: s.isSelected ? "#fff" : "#333",
    }),
  };

  const selectedType = REPORT_TYPES.find((r) => r.id === selectedCategory);

  return (
    <Layout title={t("Seed Market Reports")}>
      <style>{`
        .sh-page-header {
          padding: 20px 24px;
          background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
          border-radius: 12px;
          border: none;
          box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
          margin-bottom: 22px;
        }
        .sh-page-title { margin-bottom: 4px; color: #ffffff !important; font-weight: 700; letter-spacing: 0.2px; }
      `}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title">{t("Seed Market Reports")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ───────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)" }}>
          <div style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)", padding: "16px 28px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
              {selectedType?.icon}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px", lineHeight: 1.2 }}>{selectedType?.label} Report</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", marginTop: "2px" }}>Seed Market</div>
            </div>
          </div>

          {/* ── Report Type Tabs ── */}
          <div style={{ borderBottom: "1.5px solid #e2e8f0", padding: "0 28px", background: "#fff", display: "flex", gap: "4px" }}>
            {REPORT_TYPES.map((type) => {
              const active = selectedCategory === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedCategory(type.id)}
                  style={{
                    background: "none", border: "none", padding: "10px 16px",
                    fontSize: "13px", fontWeight: active ? 700 : 500,
                    color: active ? "#1e67a8" : "#718096",
                    borderBottom: active ? "2.5px solid #1e67a8" : "2.5px solid transparent",
                    cursor: "pointer", transition: "all 0.15s ease",
                    marginBottom: "-1.5px", userSelect: "none",
                    display: "flex", alignItems: "center", gap: "6px",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{type.icon}</span>
                  {type.label}
                </button>
              );
            })}
          </div>

          <Card.Body style={{ padding: "28px 32px 32px" }}>
            <Form onSubmit={handleGenerateReport}>

              {/* ── Invoice filters ── */}
              {selectedCategory === "invoice" && (
                <>
                  <Row className="mb-3">
                    <Col md={6} style={fieldGroupStyle}>
                      <label style={labelStyle}>Grainage <span style={{ color: "#e53e3e" }}>*</span></label>
                      <Form.Select name="grainageMasterId" value={data.grainageMasterId} onChange={(e) => setData({ ...data, grainageMasterId: e.target.value })} style={inputStyle}>
                        <option value="">— Select Grainage —</option>
                        {grainageListData?.map((g) => (
                          <option key={g.grainageMasterId} value={g.grainageMasterId}>{g.grainageMasterName}</option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={4} style={fieldGroupStyle}>
                      <label style={labelStyle}>From Date <span style={{ color: "#e53e3e" }}>*</span></label>
                      <DatePicker dateFormat="dd/MM/yyyy" selected={data.fromDate} onChange={(d) => setData({ ...data, fromDate: d })} className="form-control" maxDate={new Date()} />
                    </Col>
                    <Col md={4} style={fieldGroupStyle}>
                      <label style={labelStyle}>To Date <span style={{ color: "#e53e3e" }}>*</span></label>
                      <DatePicker dateFormat="dd/MM/yyyy" selected={data.toDate} onChange={(d) => setData({ ...data, toDate: d })} className="form-control" maxDate={new Date()} />
                    </Col>
                  </Row>
                </>
              )}

              {/* ── Permit filters ── */}
              {selectedCategory === "permit" && (
                <>
                  <Row className="mb-3">
                    <Col md={6} style={fieldGroupStyle}>
                      <label style={labelStyle}>External User <span style={{ color: "#e53e3e" }}>*</span></label>
                      <ReactSelect
                        options={externalUserOptions}
                        placeholder="— Select External User —"
                        isSearchable
                        menuPlacement="auto"
                        styles={reactSelectStyles}
                        value={externalUserOptions?.find((o) => o.value === data.externalUnitRegistrationId) || null}
                        onChange={(sel) => setData({ ...data, externalUnitRegistrationId: sel?.value || "" })}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={4} style={fieldGroupStyle}>
                      <label style={labelStyle}>From Date <span style={{ color: "#e53e3e" }}>*</span></label>
                      <DatePicker dateFormat="dd/MM/yyyy" selected={data.fromDate} onChange={(d) => setData({ ...data, fromDate: d })} className="form-control" maxDate={new Date()} />
                    </Col>
                    <Col md={4} style={fieldGroupStyle}>
                      <label style={labelStyle}>To Date <span style={{ color: "#e53e3e" }}>*</span></label>
                      <DatePicker dateFormat="dd/MM/yyyy" selected={data.toDate} onChange={(d) => setData({ ...data, toDate: d })} className="form-control" maxDate={new Date()} />
                    </Col>
                  </Row>
                </>
              )}

              {/* ── Cash Receipt & Market Receipt filters ── */}
              {(selectedCategory === "cashReceipt" || selectedCategory === "marketReceipt") && (
                <Row className="mb-2">
                  <Col md={4} style={fieldGroupStyle}>
                    <label style={labelStyle}>Auction Date <span style={{ color: "#e53e3e" }}>*</span></label>
                    <DatePicker dateFormat="dd/MM/yyyy" selected={data.auctionDate} onChange={(d) => setData({ ...data, auctionDate: d })} className="form-control" maxDate={new Date()} />
                  </Col>
                  <Col md={4} style={fieldGroupStyle}>
                    <label style={labelStyle}>Bidding Slip Lot No <span style={{ color: "#e53e3e" }}>*</span></label>
                    <Form.Control type="text" name="allottedLotId" value={data.allottedLotId} onChange={(e) => setData({ ...data, allottedLotId: e.target.value })} placeholder="Enter Bidding Slip Lot No" style={inputStyle} />
                  </Col>
                </Row>
              )}

              <div style={{ borderTop: "1.5px dashed #d0d9e8", margin: "20px 0 24px" }} />

              {/* ── Generate button ── */}
              <div className="d-flex align-items-center gap-3">
                <button
                  type="submit"
                  disabled={isGenerating}
                  style={{
                    background: isGenerating ? "#c8d6e5" : "linear-gradient(135deg, #1e67a8, #2d9cdb)",
                    border: "none", borderRadius: "10px", padding: "12px 32px",
                    fontWeight: 700, fontSize: "14px", color: "#fff",
                    cursor: isGenerating ? "not-allowed" : "pointer",
                    boxShadow: isGenerating ? "none" : "0 4px 16px rgba(30,103,168,0.35)",
                    display: "flex", alignItems: "center", gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isGenerating ? (
                    <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> Generating…</>
                  ) : (
                    <>📄 Generate {selectedType?.label} Report</>
                  )}
                </button>
                {!isGenerating && (
                  <span style={{ fontSize: "12.5px", color: "#718096" }}>
                    Report will open in a new tab as PDF
                  </span>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>

      </Block>
    </Layout>
  );
}

export default InvoicePermitAndMarketReceipt;
