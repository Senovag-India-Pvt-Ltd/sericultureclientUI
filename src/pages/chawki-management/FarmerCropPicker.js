// Shared by Crop Inspection Add and Fitness Certificate Add:
// search farmer (FRUITS ID / mobile / RSCP no.) → pick one of the farmer's
// DFL crops (Sale/Disposal of DFLs) returned by `cropsPath`.
import { useEffect, useRef, useState } from "react";
import { Card, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import api from "../../services/auth/api";

const baseURLChawki = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;
const baseURLRegistration = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const swalClass = { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" };

export const pickerStyles = `
  .fcp-card { border:none !important; border-radius:14px !important; box-shadow:0 2px 12px rgba(0,0,0,.08) !important; overflow:hidden; margin-bottom:20px; }
  .fcp-card > .card-header { background:linear-gradient(135deg,#1e67a8 0%,#0d4f8a 100%); color:#fff; font-weight:700; padding:14px 22px; border:none; }
  .fcp-farmer { display:flex; gap:14px; align-items:center; flex-wrap:wrap; background:#f3f8fe; border:1px solid #d9e7f5; border-radius:12px; padding:12px 16px; }
  .fcp-avatar { width:44px; height:44px; border-radius:50%; background:#1e67a8; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; }
  .fcp-meta small { display:block; color:#6b7a8c; font-size:.72rem; font-weight:600; text-transform:uppercase; }
  .fcp-meta b { color:#1f2d3d; font-size:.9rem; }
  .fcp-crops { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:12px; }
  .fcp-crop { text-align:left; background:#fff; border:2px solid #e3ebf5; border-radius:12px; padding:12px 14px; transition:all .15s; cursor:pointer; width:100%; }
  .fcp-crop:hover { border-color:#9cc2e8; transform:translateY(-1px); }
  .fcp-crop.active { border-color:#1e67a8; background:#eef6ff; box-shadow:0 0 0 3px rgba(30,103,168,.12); }
  .fcp-crop .lot { font-weight:800; color:#1e67a8; }
  .fcp-crop .row-i { display:flex; justify-content:space-between; font-size:.8rem; color:#4a5568; margin-top:4px; }
  .fcp-empty { text-align:center; color:#6b7a8c; padding:18px; background:#f8fafc; border-radius:12px; border:1px dashed #cbd5e1; }
`;

function FarmerCropPicker({ cropsPath, emptyText, selected, onSelect, onFarmer, reloadKey }) {
  const { t } = useTranslation();
  const { state: prefill } = useLocation();
  const [farmer, setFarmer] = useState({ select: "fruitsId", text: prefill?.fruitsId || "" });
  const [details, setDetails] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const autoDone = useRef(false);

  const loadCrops = (fruitsId) => {
    if (!fruitsId) { setCrops([]); return; }
    api.get(`${baseURLChawki}chowkimanagement/${cropsPath}/${fruitsId}`)
      .then((res) => setCrops(Array.isArray(res.data) ? res.data : res.data?.content || []))
      .catch(() => setCrops([]));
  };

  const search = (e) => {
    e?.preventDefault?.();
    if (!farmer.text.trim()) { setValidated(true); return; }
    setValidated(false);
    setLoading(true);
    setDetails(null); setCrops([]); onSelect(null); onFarmer(null);
    api.post(`${baseURLRegistration}farmer/get-farmer-details-by-fruits-id-or-mobile-number-or-csb-register-number`, { text: farmer.text.trim(), type: farmer.select })
      .then((res) => {
        const found = Array.isArray(res.data) ? res.data[0] : null;
        if (!found) {
          const msg = res.data?.errorMessages?.[0]?.message?.[0]?.message || res.data?.errorMessages?.[0]?.message || t("No details found");
          Swal.fire({ icon: "warning", title: t("Details not Found"), text: msg, customClass: swalClass });
          return;
        }
        setDetails(found);
        onFarmer(found);
        loadCrops(found.fruitsId);
      })
      .catch(() => Swal.fire({ icon: "warning", title: t("Details not Found"), customClass: swalClass }))
      .finally(() => setLoading(false));
  };

  // opened from Farmer Indent with a FRUITS ID → search once
  useEffect(() => {
    if (prefill?.fruitsId && !autoDone.current) { autoDone.current = true; search(); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // parent asks for a refresh after saving
  useEffect(() => {
    if (reloadKey && details?.fruitsId) { onSelect(null); loadCrops(details.fruitsId); }
  }, [reloadKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const name = details ? [details.firstName, details.lastName].filter(Boolean).join(" ") : "";
  return (
    <>
      <Card className="fcp-card">
        <Card.Header>🔍 {t("Search Farmer")}</Card.Header>
        <Card.Body style={{ padding: "20px 24px" }}>
          <Form noValidate validated={validated} onSubmit={search}>
            <Row className="g-3 align-items-end">
              <Col md={3}>
                <Form.Label className="fw-semibold small text-secondary">{t("Search Farmer Details By")}</Form.Label>
                <Form.Select value={farmer.select} onChange={(e) => setFarmer((f) => ({ ...f, select: e.target.value }))} style={{ borderRadius: 8 }}>
                  <option value="fruitsId">{t("Fruits Id")}</option>
                  <option value="mobileNumber">{t("Mobile Number")}</option>
                  <option value="farmerNumber">{t("RSCP Number")}</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="fw-semibold small text-secondary">{t("Enter value")}</Form.Label>
                <Form.Control required value={farmer.text} onChange={(e) => setFarmer((f) => ({ ...f, text: e.target.value }))} placeholder={t("Enter FRUITS ID / mobile / RSCP number")} style={{ borderRadius: 8 }} />
                <Form.Control.Feedback type="invalid">{t("Field Value is Required")}</Form.Control.Feedback>
              </Col>
              <Col md={3}>
                <Button type="submit" className="w-100" disabled={loading} style={{ borderRadius: 8, background: "linear-gradient(90deg,#1e67a8,#2b7ac0)", border: "none", fontWeight: 600 }}>
                  {loading ? <Spinner size="sm" /> : t("Search")}
                </Button>
              </Col>
            </Row>
          </Form>

          {details && (
            <div className="fcp-farmer mt-3">
              <span className="fcp-avatar">{(name || "?").slice(0, 1).toUpperCase()}</span>
              <div className="fcp-meta"><small>{t("Farmer")}</small><b>{name}</b></div>
              <div className="fcp-meta"><small>{t("Fruits Id")}</small><b>{details.fruitsId || "–"}</b></div>
              <div className="fcp-meta"><small>{t("Mobile Number")}</small><b>{details.mobileNumber || "–"}</b></div>
              <div className="fcp-meta"><small>{t("Village")}</small><b>{details.villageName || "–"}</b></div>
            </div>
          )}
        </Card.Body>
      </Card>

      {details && (
        <Card className="fcp-card">
          <Card.Header>🐛 {t("Select Crop (DFLs given to the farmer)")}</Card.Header>
          <Card.Body style={{ padding: "18px 24px" }}>
            {crops.length === 0 ? (
              <div className="fcp-empty">{emptyText}</div>
            ) : (
              <div className="fcp-crops">
                {crops.map((c) => (
                  <button type="button" key={c.saleAndDisposalId} className={`fcp-crop ${selected?.saleAndDisposalId === c.saleAndDisposalId ? "active" : ""}`} onClick={() => onSelect(c)}>
                    <div className="d-flex justify-content-between"><span className="lot">{t("Lot")} {c.lotNumberCrc || "–"}</span>{selected?.saleAndDisposalId === c.saleAndDisposalId && <span>✔</span>}</div>
                    <div className="row-i"><span>{t("DFLs")}</span><b>{c.numbersOfDfls ?? "–"}</b></div>
                    <div className="row-i"><span>{t("Race")}</span><b>{c.raceName || "–"}</b></div>
                    <div className="row-i"><span>{t("Date of Disposal")}</span><b>{c.dateOfDisposal || "–"}</b></div>
                    <div className="row-i"><span>{t("Hatching Date")}</span><b>{c.hatchingInspectionDate || "–"}</b></div>
                    <div className="row-i"><span>{t("Source")}</span><b>{c.dflsSource || "–"}</b></div>
                  </button>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </>
  );
}

export default FarmerCropPicker;
