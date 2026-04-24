import React, { useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import api from "../../services/auth/api";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

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

const inputStyle = {
  borderRadius: "8px",
  border: "1.5px solid #d0d9e8",
  padding: "8px 12px",
  fontSize: "14px",
  background: "#f8fafd",
  color: "#333",
  width: "100%",
};
const labelStyle = { fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "5px", display: "block" };
const fieldGroupStyle = { display: "flex", flexDirection: "column", marginBottom: "4px" };

function FitnessCertificate() {
  const { t } = useTranslation();
  const [fitnessCertificateId, setFitnessCertificateId] = useState("");
  const [fruitsId, setFruitsId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!fitnessCertificateId.trim() || !fruitsId.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">Fields Required</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">Please enter both Fitness Certificate ID and Fruits ID before generating.</p></div></div></div>`,
        confirmButtonText: "Got it",
        confirmButtonColor: "#d97706",
        background: "#fff",
        showClass: { popup: "animate__animated animate__headShake animate__faster" },
        customClass: { popup: "swal-pop" },
      });
      return;
    }
    setIsGenerating(true);
    try {
      const response = await api.post(
        baseURLReport + `getFitenessCertificate`,
        {
          fitnessCertificateId: fitnessCertificateId,
          fruitsId: fruitsId,
        },
        { responseType: "blob" }
      );
      window.open(URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })));
    } catch {
      Swal.fire({
        icon: "error",
        title: "Generation Failed",
        html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Could Not Generate</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">Failed to generate the Fitness Certificate. Please try again.</p></div></div></div>`,
        confirmButtonText: "Close",
        confirmButtonColor: "#e53e3e",
        background: "#fff",
        showClass: { popup: "animate__animated animate__shakeX animate__faster" },
        customClass: { popup: "swal-pop" },
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout title={t("Fitness Certificate")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Fitness Certificate")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)" }}>
          <div style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)", padding: "18px 28px", display: "flex", alignItems: "center", gap: "12px", borderRadius: "14px 14px 0 0" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
              📜
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "17px", lineHeight: 1.2 }}>Fitness Certificate</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", marginTop: "2px" }}>Generate fitness certificate by certificate ID and Fruits ID</div>
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
              <Row className="mb-4">
                <Col md={6} style={fieldGroupStyle}>
                  <label style={labelStyle}>
                    Fitness Certificate ID <span style={{ color: "#e53e3e" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={fitnessCertificateId}
                    onChange={(e) => setFitnessCertificateId(e.target.value)}
                    placeholder="Enter Fitness Certificate ID"
                    style={inputStyle}
                    required
                  />
                </Col>
                <Col md={6} style={fieldGroupStyle}>
                  <label style={labelStyle}>
                    Fruits ID <span style={{ color: "#e53e3e" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={fruitsId}
                    onChange={(e) => setFruitsId(e.target.value)}
                    placeholder="Enter Fruits ID"
                    style={inputStyle}
                    required
                  />
                </Col>
              </Row>

              <div style={{ borderTop: "1.5px dashed #d0d9e8", margin: "8px 0 24px" }} />

              <button
                type="submit"
                disabled={isGenerating}
                style={{
                  background: isGenerating ? "#c8d6e5" : "linear-gradient(135deg,#1e67a8,#2d9cdb)",
                  border: "none", borderRadius: "10px", padding: "12px 32px",
                  fontWeight: 700, fontSize: "14px", color: "#fff",
                  cursor: isGenerating ? "not-allowed" : "pointer",
                  boxShadow: isGenerating ? "none" : "0 4px 14px rgba(30,103,168,0.35)",
                  display: "flex", alignItems: "center", gap: "8px",
                }}
              >
                {isGenerating
                  ? <><span className="spinner-border spinner-border-sm" /> Generating…</>
                  : <>📜 Generate Fitness Certificate</>}
              </button>
            </Form>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default FitnessCertificate;
