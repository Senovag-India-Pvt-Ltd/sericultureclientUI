import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";
import { Icon } from "../../../components";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

// Inject page-scoped styles once
if (typeof document !== "undefined" && !document.getElementById("armedit-styles")) {
  const s = document.createElement("style");
  s.id = "armedit-styles";
  s.innerHTML = `
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

    .armedit-wrap { animation: armedit-fade .35s ease; }
    @keyframes armedit-fade { from { opacity:0; transform:translateY(8px);} to { opacity:1; transform:none; } }

    .armedit-card { border:0; border-radius:16px; box-shadow:0 10px 32px rgba(15,23,42,.08); overflow:hidden; }
    .armedit-hero {
      background: linear-gradient(135deg,#1e3a8a 0%,#1e67a8 55%,#2d9cdb 100%);
      padding:20px 26px; position:relative; overflow:hidden;
      display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap;
    }
    .armedit-hero::after {
      content:""; position:absolute; right:-50px; top:-60px; width:200px; height:200px;
      background: radial-gradient(circle,rgba(255,255,255,.16),transparent 70%);
    }
    .armedit-hero-left { display:flex; align-items:center; gap:14px; position:relative; z-index:1; }
    .armedit-hero-icon {
      width:42px; height:42px; border-radius:12px; background:rgba(255,255,255,.16);
      border:1px solid rgba(255,255,255,.28); display:flex; align-items:center; justify-content:center;
      font-size:19px; backdrop-filter: blur(4px);
    }
    .armedit-hero-title { color:#fff; font-weight:800; font-size:16px; letter-spacing:.01em; margin:0; }
    .armedit-hero-sub { color:rgba(255,255,255,.82); font-size:12px; margin-top:2px; }
    .armedit-hero-chip {
      display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,.14);
      border:1px solid rgba(255,255,255,.24); border-radius:999px; padding:5px 13px;
      font-size:11.5px; font-weight:700; color:#fff; position:relative; z-index:1;
    }

    .armedit-body { padding:26px; background:#fbfdff; }

    .armedit-section { margin-bottom:22px; }
    .armedit-section-head {
      display:flex; align-items:center; gap:9px; margin-bottom:14px;
      padding-bottom:9px; border-bottom:1px dashed #dbe6f3;
    }
    .armedit-section-num {
      width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center;
      font-size:11.5px; font-weight:800; color:#fff; flex:0 0 auto;
    }
    .armedit-section-title { font-weight:800; font-size:13.5px; color:#1e293b; letter-spacing:.01em; }

    .armedit-section.s1 .armedit-section-num { background:linear-gradient(135deg,#1e67a8,#2d9cdb); }
    .armedit-section.s2 .armedit-section-num { background:linear-gradient(135deg,#7c3aed,#a855f7); }
    .armedit-section.s3 .armedit-section-num { background:linear-gradient(135deg,#059669,#10b981); }

    .armedit-field label {
      font-weight:650; font-size:12.5px; color:#475569; margin-bottom:5px; display:block;
    }
    .armedit-field .form-control,
    .armedit-field .form-select {
      border-radius:9px; border:1.5px solid #dbe4f0; font-size:13px; padding:8px 12px;
      transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
      background:#fff;
    }
    .armedit-field .form-control:hover,
    .armedit-field .form-select:hover { border-color:#a8c5e8; }
    .armedit-field .form-control:focus,
    .armedit-field .form-select:focus {
      border-color:#2d9cdb; box-shadow:0 0 0 3px rgba(45,156,219,.15); background:#fff;
    }
    .armedit-field .form-control:disabled,
    .armedit-field .form-control[readonly] {
      background:linear-gradient(135deg,#eef6ff,#f4f9ff); color:#1e67a8; font-weight:800; border-color:#cfe3f7;
    }

    .armedit-pct-total { border:1.5px solid; border-radius:12px; padding:12px 16px; margin-top:4px;
      display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
    .armedit-pct-total.ok { background:#ecfdf5; border-color:#bbf7d0; }
    .armedit-pct-total.warn { background:#fffbeb; border-color:#fde68a; }
    .armedit-pct-label { font-size:12px; font-weight:700; }
    .armedit-pct-total.ok .armedit-pct-label { color:#065f46; }
    .armedit-pct-total.warn .armedit-pct-label { color:#92400e; }
    .armedit-pct-value { font-size:15px; font-weight:800; }
    .armedit-pct-total.ok .armedit-pct-value { color:#059669; }
    .armedit-pct-total.warn .armedit-pct-value { color:#d97706; }

    .armedit-actions {
      display:flex; gap:10px; margin-top:24px; padding-top:18px; border-top:1px solid #e8f0fa;
    }
    .armedit-btn-update {
      background:linear-gradient(135deg,#1e67a8,#2d9cdb); border:none; border-radius:10px;
      padding:10px 30px; font-weight:700; font-size:13.5px; color:#fff;
      box-shadow:0 10px 22px rgba(30,103,168,.28); transition: transform .12s ease, box-shadow .12s ease;
    }
    .armedit-btn-update:hover { transform:translateY(-1px); box-shadow:0 14px 28px rgba(30,103,168,.34); }
    .armedit-btn-cancel {
      border:1.5px solid #1e67a8; border-radius:10px; padding:10px 24px; font-weight:700;
      font-size:13.5px; color:#1e67a8; background:#fff; transition: background .12s ease;
    }
    .armedit-btn-cancel:hover { background:#eef6ff; color:#1e67a8; }

    /* ---------- SweetAlert theming (kept consistent with other admin pages) ---------- */
    .armedit-swal-container { backdrop-filter: blur(5px); background: rgba(15,23,42,.45) !important; }
    .armedit-swal {
      border-radius: 22px !important; padding: 6px 4px 18px !important;
      background: linear-gradient(180deg,#ffffff 0%,#f8fafc 100%) !important;
      box-shadow: 0 30px 80px rgba(15,23,42,.28), 0 0 0 1px rgba(15,23,42,.04) !important;
      overflow:hidden !important; position:relative !important; max-width: 460px !important;
    }
    .armedit-swal::before {
      content:""; position:absolute; top:0; left:0; right:0; height:6px;
      background: linear-gradient(90deg,#94a3b8,#64748b);
    }
    .armedit-swal-success::before { background: linear-gradient(90deg,#34d399,#0ea5e9,#6366f1) !important; }
    .armedit-swal-error::before   { background: linear-gradient(90deg,#f87171,#dc2626,#9f1239) !important; }
    .armedit-swal .swal2-title { font-size:20px !important; font-weight:800 !important; color:#0f172a !important; }
    .armedit-swal .swal2-html-container { font-size:13.5px !important; color:#475569 !important; }
    .armedit-swal .swal2-styled {
      border-radius:12px !important; padding:10px 26px !important; font-weight:700 !important;
      font-size:13.5px !important; border:0 !important; transition: transform .14s ease, filter .14s !important;
    }
    .armedit-swal .swal2-styled:hover { transform: translateY(-2px); filter: brightness(1.05); }
    .armedit-swal-success .swal2-confirm { background: linear-gradient(135deg,#0ea5e9,#22d3ee) !important; box-shadow:0 12px 26px rgba(14,165,233,.3) !important; }
    .armedit-swal-error .swal2-confirm { background: linear-gradient(135deg,#ef4444,#b91c1c) !important; box-shadow:0 12px 26px rgba(220,38,38,.3) !important; }
  `;
  document.head.appendChild(s);
}

const swalSuccess = (title, text) =>
  Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: "Great",
    customClass: { container: "armedit-swal-container", popup: "armedit-swal armedit-swal-success" },
  });

const swalError = (title, text) =>
  Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "Got it",
    customClass: { container: "armedit-swal-container", popup: "armedit-swal armedit-swal-error" },
  });

function ArmCalculationEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const ARM_ENDS_OPTIONS = ["120 Ends", "200 Ends", "400 Ends"];

  const [data, setData] = useState({
    armCalculationId: "",
    scCategoryId: "",
    componentId: "",
    componentTypeId: "",
    armEnds: "",
    equipmentName: "",
    quantity: "",
    unitRate: "",
    unitCost: "",
    centralPercentage: "",
    statePercentage: "",
    advancePercentage: "",
    firstPayment: "",
    finalPayment: "",
  });
  const [validated, setValidated] = useState(false);

  const totalAmount =
    data.quantity && data.unitRate
      ? (parseFloat(data.quantity) * parseFloat(data.unitRate)).toFixed(2)
      : "";

  const pctSum =
    (parseFloat(data.advancePercentage) || 0) +
    (parseFloat(data.firstPayment) || 0) +
    (parseFloat(data.finalPayment) || 0);
  const pctSumOk = Math.abs(pctSum - 100) < 0.01;

  const [scCategoryList, setScCategoryList] = useState([]);
  const [componentList, setComponentList] = useState([]);
  const [componentTypeList, setComponentTypeList] = useState([]);

  useEffect(() => {
    // Load dropdowns
    api.get(baseURL + "scCategory/get-all").then((r) => setScCategoryList(r.data.content.scCategory || [])).catch(() => {});
    api.get(baseURL + "scComponent/get-all").then((r) => setComponentList(r.data.content.scComponent || [])).catch(() => {});
    api.get(baseURL + "scSubSchemeDetails/get-all").then((r) => setComponentTypeList(r.data.content.scSubSchemeDetails || [])).catch(() => {});

    // Load existing record
    api.get(baseURL + `armCalculation/get/${id}`)
      .then((r) => {
        const c = r.data.content;
        setData({
          armCalculationId: c.armCalculationId || id,
          scCategoryId: c.scCategoryId || "",
          componentId: c.componentId || "",
          componentTypeId: c.componentTypeId || "",
          armEnds: c.armEnds || "",
          equipmentName: c.equipmentName || "",
          quantity: c.quantity || "",
          unitRate: c.unitRate || "",
          unitCost: c.unitCost || "",
          centralPercentage: c.centralPercentage || "",
          statePercentage: c.statePercentage || "",
          advancePercentage: c.advancePercentage || "",
          firstPayment: c.firstPayment || "",
          finalPayment: c.finalPayment || "",
        });
      })
      .catch(() => swalError(t("Error"), t("Record not found")));
  }, [id]);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: ["scCategoryId", "componentId", "componentTypeId"].includes(name)
        ? parseInt(value)
        : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) { e.stopPropagation(); setValidated(true); return; }
    setValidated(false);

    const payload = {
      armCalculationId: parseInt(id),
      scCategoryId: data.scCategoryId || null,
      componentId: data.componentId || null,
      componentTypeId: data.componentTypeId || null,
      armEnds: data.armEnds || null,
      equipmentName: data.equipmentName,
      quantity: data.quantity ? parseFloat(data.quantity) : null,
      unitRate: data.unitRate ? parseFloat(data.unitRate) : null,
      unitCost: data.unitCost ? parseFloat(data.unitCost) : null,
      centralPercentage: data.centralPercentage ? parseFloat(data.centralPercentage) : null,
      statePercentage: data.statePercentage ? parseFloat(data.statePercentage) : null,
      advancePercentage: data.advancePercentage ? parseFloat(data.advancePercentage) : null,
      firstPayment: data.firstPayment ? parseFloat(data.firstPayment) : null,
      finalPayment: data.finalPayment ? parseFloat(data.finalPayment) : null,
    };

    api.post(baseURL + "armCalculation/edit", payload)
      .then(() => {
        swalSuccess(t("Updated successfully")).then(() =>
          navigate("/seriui/arm-calculation-list")
        );
      })
      .catch((err) => {
        const msg = err.response?.data?.errorMessages?.[0]?.message?.[0]?.message || t("Something went wrong!");
        swalError(t("Error"), typeof msg === "string" ? msg : JSON.stringify(msg));
      });
  };

  return (
    <Layout title={t("Edit ARM Calculation")}>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Edit ARM Calculation")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <Link to="/seriui/arm-calculation-list" className="btn btn-primary d-none d-md-inline-flex sh-cta-btn">
                <Icon name="arrow-left" /><span>{t("Back to List")}</span>
              </Link>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 armedit-wrap">
        <Card className="armedit-card">
          <div className="armedit-hero">
            <div className="armedit-hero-left">
              <div className="armedit-hero-icon">✏️</div>
              <div>
                <p className="armedit-hero-title">{t("Edit ARM Calculation")}</p>
                <p className="armedit-hero-sub">
                  {data.equipmentName ? data.equipmentName : t("Loading component details...")}
                </p>
              </div>
            </div>
            {data.armEnds && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="armedit-hero-chip">📏 {data.armEnds}</span>
                {data.centralPercentage !== "" && (
                  <span className="armedit-hero-chip">🎯 {t("Central")} {data.centralPercentage}%</span>
                )}
              </div>
            )}
          </div>

          <Card.Body className="armedit-body">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>

              {/* ── Section 1: Classification ───────────────────────── */}
              <div className="armedit-section s1">
                <div className="armedit-section-head">
                  <span className="armedit-section-num">1</span>
                  <span className="armedit-section-title">{t("Classification")}</span>
                </div>
                <Row className="g-3">
                  <Col md={4} className="armedit-field">
                    <Form.Group>
                      <Form.Label>{t("SC Category")} <span className="text-danger">*</span></Form.Label>
                      <Form.Select name="scCategoryId" value={data.scCategoryId} onChange={handleInputs} required>
                        <option value="">{t("-- Select Category --")}</option>
                        {scCategoryList.map((c) => <option key={c.scCategoryId} value={c.scCategoryId}>{c.categoryName}</option>)}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{t("Category is required")}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="armedit-field">
                    <Form.Group>
                      <Form.Label>{t("Component Type")}</Form.Label>
                      <Form.Select name="componentTypeId" value={data.componentTypeId} onChange={handleInputs}>
                        <option value="">{t("-- Select Component Type --")}</option>
                        {componentTypeList.map((c) => <option key={c.scSubSchemeDetailsId} value={c.scSubSchemeDetailsId}>{c.subSchemeName}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="armedit-field">
                    <Form.Group>
                      <Form.Label>{t("Component")}</Form.Label>
                      <Form.Select name="componentId" value={data.componentId} onChange={handleInputs}>
                        <option value="">{t("-- Select Component --")}</option>
                        {componentList.map((c) => <option key={c.scComponentId} value={c.scComponentId}>{c.scComponentName}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="armedit-field">
                    <Form.Group>
                      <Form.Label>{t("ARM Ends")} <span className="text-danger">*</span></Form.Label>
                      <Form.Select name="armEnds" value={data.armEnds} onChange={handleInputs} required>
                        <option value="">{t("-- Select ARM Ends --")}</option>
                        {ARM_ENDS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{t("ARM Ends is required")}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={8} className="armedit-field">
                    <Form.Group>
                      <Form.Label>{t("Name of the Equipment")} <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" name="equipmentName" value={data.equipmentName} onChange={handleInputs} required />
                      <Form.Control.Feedback type="invalid">{t("Equipment name is required")}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* ── Section 2: Cost Details ──────────────────────────── */}
              <div className="armedit-section s2">
                <div className="armedit-section-head">
                  <span className="armedit-section-num">2</span>
                  <span className="armedit-section-title">{t("Cost Details")}</span>
                </div>
                <Row className="g-3">
                  <Col md={3} className="armedit-field">
                    <Form.Group>
                      <Form.Label>{t("Quantity (in No's)")} <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="number" name="quantity" value={data.quantity} onChange={handleInputs} min="0" step="0.01" required />
                      <Form.Control.Feedback type="invalid">{t("Quantity is required")}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="armedit-field">
                    <Form.Group>
                      <Form.Label>{t("Unit Rate (in Rs)")} <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="number" name="unitRate" value={data.unitRate} onChange={handleInputs} min="0" step="0.01" required />
                      <Form.Control.Feedback type="invalid">{t("Unit rate is required")}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="armedit-field">
                    <Form.Group>
                      <Form.Label>{t("Total Amount (in Rs.)")}</Form.Label>
                      <Form.Control type="text" value={totalAmount ? `₹ ${parseFloat(totalAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : ""} readOnly />
                      <Form.Text className="text-muted" style={{ fontSize: "11px" }}>{t("Auto-calculated")}</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="armedit-field">
                    <Form.Group>
                      <Form.Label>{t("Unit Cost (in Rs)")}</Form.Label>
                      <Form.Control type="number" name="unitCost" value={data.unitCost} onChange={handleInputs} min="0" step="0.01" />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* ── Section 3: Subsidy Shares ─────────────────────────── */}
              <div className="armedit-section s3">
                <div className="armedit-section-head">
                  <span className="armedit-section-num">3</span>
                  <span className="armedit-section-title">{t("Subsidy Shares")}</span>
                </div>
                <Row className="g-3">
                  <Col md={3} className="armedit-field">
                    <Form.Group>
                      <Form.Label>{t("Central Share (%)")} <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="number" name="centralPercentage" value={data.centralPercentage} onChange={handleInputs} min="0" max="100" step="0.01" required />
                      <Form.Control.Feedback type="invalid">{t("Central percentage is required")}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="armedit-field">
                    <Form.Group>
                      <Form.Label>{t("State Share (%)")} <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="number" name="statePercentage" value={data.statePercentage} onChange={handleInputs} min="0" max="100" step="0.01" required />
                      <Form.Control.Feedback type="invalid">{t("State percentage is required")}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={2} className="armedit-field">
                    <Form.Group>
                      <Form.Label>{t("Advance (%)")}</Form.Label>
                      <Form.Control type="number" name="advancePercentage" value={data.advancePercentage} onChange={handleInputs} min="0" max="100" step="0.01" />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="armedit-field">
                    <Form.Group>
                      <Form.Label>{t("First Payment (%)")}</Form.Label>
                      <Form.Control type="number" name="firstPayment" value={data.firstPayment} onChange={handleInputs} min="0" max="100" step="0.01" />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="armedit-field">
                    <Form.Group>
                      <Form.Label>{t("Final Payment (%)")}</Form.Label>
                      <Form.Control type="number" name="finalPayment" value={data.finalPayment} onChange={handleInputs} min="0" max="100" step="0.01" />
                    </Form.Group>
                  </Col>
                </Row>

                {(data.advancePercentage !== "" || data.firstPayment !== "" || data.finalPayment !== "") && (
                  <div className={`armedit-pct-total ${pctSumOk ? "ok" : "warn"}`}>
                    <span className="armedit-pct-label">
                      {pctSumOk ? "✅" : "⚠️"} {t("Advance + First + Final Payment")}
                    </span>
                    <span className="armedit-pct-value">{pctSum.toFixed(2)}%{!pctSumOk && ` (${t("expected 100%")})`}</span>
                  </div>
                )}
              </div>

              <div className="armedit-actions">
                <Button type="submit" className="armedit-btn-update">
                  {t("Update")}
                </Button>
                <Link to="/seriui/arm-calculation-list" className="armedit-btn-cancel" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                  {t("Cancel")}
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default ArmCalculationEdit;
