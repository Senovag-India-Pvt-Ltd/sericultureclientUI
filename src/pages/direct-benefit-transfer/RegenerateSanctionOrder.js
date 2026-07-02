import React, { useEffect, useState } from "react";
import api from "../../services/auth/api";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Card, Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

// Regenerate Sanction Order — always builds the PDF freshly from Jasper via the
// scheme-specific reports endpoints (NOT the pre-generated copy stored on S3).
function RegenerateSanctionOrder() {
  const [page] = useState(0);
  const countPerPage = 50;
  const { t } = useTranslation();

  const [addressDetails, setAddressDetails] = useState({
    fruitsId: "",
    financialYearId: "",
    scSchemeDetailsId: "",
    componentId: "",
    subSchemeId: "",
    sanctionOrderNumber: "",
    scCategoryId: "",
  });

  const [applicationFormId, setApplicationFormId] = useState(null);
  const [sanctionOrderForScheme, setSanctionOrderForScheme] = useState(null);
  const [allApplicationIds, setAllApplicationIds] = useState([]);
  const [subSchemeType, setSubSchemeType] = useState(null);
  const [listData, setListData] = useState([]);

  // ── fetch the record for the selected sanction order ──
  const search = (details = addressDetails) => {
    api
      .post(
        baseURLDBT + `service/getSanctionOrderData`,
        {},
        {
          params: {
            financialYearId: details.financialYearId || 0,
            schemeId: details.scSchemeDetailsId || 0,
            subSchemeId: details.subSchemeId || 0,
            componentId: details.componentId || 0,
            scCategoryId: details.scCategoryId || 0,
            sanctionOrderNumber: details.sanctionOrderNumber || "",
            fruitsId: details.fruitsId || "",
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        const data = response.data.content || [];
        setListData(data);
        const recordData = data[0];
        const scApplicationFormIds = data.map((item) => item.scApplicationFormId);
        setAllApplicationIds(scApplicationFormIds);
        setApplicationFormId(recordData?.scApplicationFormId || null);
        setSubSchemeType(recordData?.subSchemeType ?? null);
        setSanctionOrderForScheme(recordData?.sanctionOrderForScheme || null);
      })
      .catch(() => {
        setListData([]);
        setApplicationFormId(null);
        setSanctionOrderForScheme(null);
      });
  };

  // ── sanction order numbers dropdown ──
  const [sanctionOrderNumbers, setSanctionOrderNumbers] = useState([]);

  const loadSanctionOrderNumbers = (details) => {
    const { financialYearId, scSchemeDetailsId, subSchemeId, componentId, scCategoryId, fruitsId } = details;
    if (financialYearId && scSchemeDetailsId && subSchemeId && componentId && scCategoryId) {
      api
        .post(
          baseURLDBT +
            `service/getSanctionOrderNumbers?financialYearId=${financialYearId}&schemeId=${scSchemeDetailsId}&subSchemeId=${subSchemeId}&componentId=${componentId}&categoryId=${scCategoryId}&fruitsId=${fruitsId || ""}`
        )
        .then((res) => {
          setSanctionOrderNumbers(Array.isArray(res.data?.content) ? res.data.content : []);
        })
        .catch(() => setSanctionOrderNumbers([]));
    } else {
      setSanctionOrderNumbers([]);
    }
  };

  // ── input handlers ──
  const handleInputsaddress = (e) => {
    const { name, value } = e.target;
    const updated = { ...addressDetails, [name]: value, sanctionOrderNumber: "" };
    setAddressDetails(updated);
    setApplicationFormId(null);
    setSanctionOrderForScheme(null);
    loadSanctionOrderNumbers(updated);
  };

  const handleSanctionOrderChange = (e) => {
    const value = e.target.value;
    const updated = { ...addressDetails, sanctionOrderNumber: value };
    setAddressDetails(updated);
    if (value) search(updated);
    else {
      setApplicationFormId(null);
      setSanctionOrderForScheme(null);
    }
  };

  // ── master data ──
  const [financialyearListData, setFinancialyearListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-all`)
      .then((r) => setFinancialyearListData(r.data.content.financialYearMaster))
      .catch(() => setFinancialyearListData([]));
  }, []);

  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURLMasterData + `scSchemeDetails/get-all`)
      .then((r) => setScSchemeDetailsListData(r.data.content.ScSchemeDetails))
      .catch(() => setScSchemeDetailsListData([]));
  }, []);

  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState([]);
  useEffect(() => {
    if (addressDetails.scSchemeDetailsId) {
      api
        .get(baseURLDBT + `master/cost/get-by-scheme-id/${addressDetails.scSchemeDetailsId}`)
        .then((r) => {
          if (r.data.content.unitCost) setScSubSchemeDetailsListData(r.data.content.unitCost);
        })
        .catch(() => setScSubSchemeDetailsListData([]));
    }
  }, [addressDetails.scSchemeDetailsId]);

  const [scComponentListData, setScComponentListData] = useState([]);
  useEffect(() => {
    if (addressDetails.scSchemeDetailsId && addressDetails.subSchemeId) {
      api
        .post(baseURLDBT + `master/cost/get-by-schemeId-and-subSchemeId`, {
          schemeId: addressDetails.scSchemeDetailsId,
          subSchemeId: addressDetails.subSchemeId,
        })
        .then((r) => setScComponentListData(r.data.content.unitCost))
        .catch(() => setScComponentListData([]));
    }
  }, [addressDetails.scSchemeDetailsId, addressDetails.subSchemeId]);

  const [scCategoryListData, setScCategoryListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURLMasterData + `scCategory/get-all`)
      .then((r) => {
        if (r.data.content.scCategory) setScCategoryListData(r.data.content.scCategory);
      })
      .catch(() => setScCategoryListData([]));
  }, []);

  // ── Jasper report generators (one PDF, opened in a new tab) ──
  const openPdf = (data) =>
    window.open(URL.createObjectURL(new Blob([data], { type: "application/pdf" })));

  // Batch schemes — keyed off all application form ids + userMasterId
  const reportByApplicationIds = (endpoint, selectedSanctionOrder) =>
    api
      .post(
        baseURLReport + endpoint,
        {
          userMasterId: localStorage.getItem("userMasterId"),
          schemeId: addressDetails.scSchemeDetailsId,
          subSchemeId: addressDetails.subSchemeId,
          applicationFormIds: allApplicationIds,
          sanctionOrderNumber: selectedSanctionOrder,
        },
        { responseType: "blob" }
      )
      .then((res) => openPdf(res.data));

  // Single-application schemes — keyed off a single applicationFormId + category
  const reportBySingleApplication = (endpoint, selectedSanctionOrder) =>
    api
      .post(
        baseURLReport + endpoint,
        {
          schemeId: addressDetails.scSchemeDetailsId,
          subSchemeId: addressDetails.subSchemeId,
          categoryId: addressDetails.scCategoryId,
          applicationFormId: applicationFormId,
          sanctionOrderNumber: selectedSanctionOrder,
        },
        { responseType: "blob" }
      )
      .then((res) => openPdf(res.data));

  const runBivoltineBonus = (selectedSanctionOrder) => {
    const type = Number(subSchemeType);
    if (type === 2) return reportByApplicationIds(`get-Incentive`, selectedSanctionOrder);
    if (type === 3) return reportByApplicationIds(`get-Bonus`, selectedSanctionOrder);
    if (type === 4) return reportByApplicationIds(`get-seed-cocoon`, selectedSanctionOrder);
    showSchemeError("The selected sub-scheme type is not supported for PDF generation.");
    return Promise.resolve();
  };

  const runJasper = (selectedSanctionOrder) => {
    switch (sanctionOrderForScheme) {
      case "Bivoltine Bonus":
        return runBivoltineBonus(selectedSanctionOrder);
      case "Incentive For Bivoltine Cocoons-30/kg-PSF":
        return reportByApplicationIds(`get-PriceStabilizationIncentive`, selectedSanctionOrder);
      case "North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP":
        return reportByApplicationIds(`get-TransportSubsidy`, selectedSanctionOrder);
      case "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500":
        return reportByApplicationIds(`get-MscSeedChawki`, selectedSanctionOrder);
      case "Incentive For Bivoltine Chawki Rearing Cost":
        return reportByApplicationIds(`get-MscSeedChawki1000`, selectedSanctionOrder);
      case "Silk Incentive-PSF":
        return reportByApplicationIds(`sanction-silk-incentive`, selectedSanctionOrder);
      case "Reeling Shed-PSF":
        return reportBySingleApplication(`sanction-psfa-reeling-shed`, selectedSanctionOrder);
      case "Adopting Heat Recovery Unit-PSF":
        return reportBySingleApplication(`sanction-heat-unit`, selectedSanctionOrder);
      case "Registered Private Bivoltine Chawki Rearing Center Subsidy":
        return reportBySingleApplication(`getChawkiSanctionOrderPdf`, selectedSanctionOrder);
      case "Rearing Equipment SS":
        return reportBySingleApplication(`getSanctionOrderRHEquipment`, selectedSanctionOrder);
      default:
        showSchemeError("No report is configured for the selected Sanction Order scheme.");
        return Promise.resolve();
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const regenerateFromJasper = async () => {
    const selectedSanctionOrder = addressDetails.sanctionOrderNumber;
    if (!selectedSanctionOrder) {
      Swal.fire({
        icon: "warning",
        title: "Selection Required",
        html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">Action Needed</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">Please select a <b>Sanction Order Number</b> before regenerating.</p></div></div></div>`,
        confirmButtonText: "Got it",
        confirmButtonColor: "#d97706",
        background: "#fff",
        customClass: { popup: "swal-pop" },
      });
      return;
    }
    setIsGenerating(true);
    try {
      await runJasper(selectedSanctionOrder);
    } catch (error) {
      showSchemeError("Jasper could not build the Sanction Order PDF. Please verify the selection and try again.", "Regeneration Failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const showSchemeError = (msg, title = "Report Not Available") =>
    Swal.fire({
      icon: "error",
      title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">📭</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${title}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close",
      confirmButtonColor: "#e53e3e",
      background: "#fff",
      customClass: { popup: "swal-pop" },
    });

  // ── Swal styles ──
  if (!document.getElementById("swal-custom-styles")) {
    const style = document.createElement("style");
    style.id = "swal-custom-styles";
    style.innerHTML = `
      .swal-pop { border-radius: 22px !important; padding: 8px !important; box-shadow: 0 30px 90px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.03) !important; }
      .swal-pop .swal2-title { font-size: 21px !important; font-weight: 800 !important; color: #1a202c !important; letter-spacing: -0.02em !important; padding-top: 2px !important; }
      .swal-pop .swal2-icon { margin: 20px auto 4px !important; }
      .swal-pop .swal2-html-container { margin: 0 !important; padding: 0 !important; }
      .swal-pop .swal2-actions { gap: 10px !important; padding-bottom: 4px !important; margin-top: 2px !important; }
      .swal-pop .swal2-confirm, .swal-pop .swal2-cancel { border-radius: 11px !important; padding: 12px 30px !important; font-weight: 700 !important; font-size: 14px !important; letter-spacing: 0.02em !important; box-shadow: 0 4px 14px rgba(0,0,0,0.13) !important; }
    `;
    document.head.appendChild(style);
  }

  // ── styles ──
  const selectStyle = { borderRadius: "8px", border: "1.5px solid #d0d9e8", padding: "8px 12px", fontSize: "14px", background: "#f8fafd", color: "#333", width: "100%", transition: "border-color 0.2s" };
  const labelStyle = { fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "5px", display: "block" };
  const fieldGroupStyle = { display: "flex", flexDirection: "column", marginBottom: "4px" };
  const btnStyle = (active, color1, color2, shadow) => ({
    background: active ? `linear-gradient(135deg, ${color1}, ${color2})` : "#c8d6e5",
    border: "none", borderRadius: "9px", padding: "10px 26px", fontWeight: 700, fontSize: "14px", color: "#fff",
    cursor: active ? "pointer" : "not-allowed", boxShadow: active ? `0 4px 14px ${shadow}` : "none",
    transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "7px", minWidth: "210px", justifyContent: "center",
  });

  const filtersReady =
    addressDetails.financialYearId &&
    addressDetails.scSchemeDetailsId &&
    addressDetails.subSchemeId &&
    addressDetails.componentId &&
    addressDetails.scCategoryId;

  const canGenerate = addressDetails.sanctionOrderNumber && !isGenerating;

  // ── render ──
  return (
    <Layout title="Regenerate Sanction Order">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Regenerate Sanction Order</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)", padding: "18px 28px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🖨️</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "17px", lineHeight: 1.2 }}>Regenerate Sanction Order</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", marginTop: "2px" }}>Builds a fresh PDF from Jasper — not the stored S3 copy</div>
            </div>
          </div>

          <Card.Body style={{ padding: "28px 32px 24px" }}>
            <Row className="mb-3">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>Fruits ID <span style={{ color: "#a0aec0", fontWeight: 400 }}>(optional)</span></label>
                <Form.Control type="text" name="fruitsId" value={addressDetails.fruitsId || ""} onChange={handleInputsaddress} placeholder="Enter Fruits ID to filter" style={selectStyle} />
              </Col>
            </Row>

            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e67a8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "18px" }}>Step 1 — Select Scheme Details</div>

            <Row className="mb-3">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>Financial Year</label>
                <Form.Select name="financialYearId" value={addressDetails.financialYearId || ""} onChange={handleInputsaddress} style={selectStyle}>
                  <option value="">— Select Financial Year —</option>
                  {financialyearListData.map((list) => (
                    <option key={list.financialYearMasterId} value={list.financialYearMasterId}>{list.financialYear}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>Scheme</label>
                <Form.Select name="scSchemeDetailsId" value={addressDetails.scSchemeDetailsId || ""} onChange={handleInputsaddress} style={selectStyle}>
                  <option value="">— Select Scheme —</option>
                  {scSchemeDetailsListData?.map((list) => (
                    <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>{list.schemeName}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>Component Type</label>
                <Form.Select name="subSchemeId" value={addressDetails.subSchemeId || ""} onChange={handleInputsaddress} style={selectStyle}>
                  <option value="">— Select Component Type —</option>
                  {scSubSchemeDetailsListData?.map((list) => (
                    <option key={list.scSubSchemeDetailsId} value={list.subSchemeId}>{list.subSchemeName}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>Component</label>
                <Form.Select name="componentId" value={addressDetails.componentId || ""} onChange={handleInputsaddress} style={selectStyle}>
                  <option value="">— Select Component —</option>
                  {scComponentListData?.map((list) => (
                    <option key={list.scComponentId} value={list.scComponentId}>{list.scComponentName}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>Sub Component</label>
                <Form.Select name="scCategoryId" value={addressDetails.scCategoryId || ""} onChange={handleInputsaddress} style={selectStyle}>
                  <option value="">— Select Sub Component —</option>
                  {scCategoryListData?.map((list) => (
                    <option key={list.scCategoryId} value={list.scCategoryId}>{list.categoryName}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <div style={{ borderTop: "1.5px dashed #d0d9e8", margin: "8px 0 20px" }} />
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e67a8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "18px" }}>Step 2 — Select Sanction Order &amp; Regenerate</div>

            <Row className="mb-3 align-items-end">
              <Col md={5} style={fieldGroupStyle}>
                <label style={labelStyle}>
                  Sanction Order Number
                  {sanctionOrderNumbers.length > 0 && (
                    <span style={{ marginLeft: "8px", fontSize: "11px", color: "#1e67a8", fontWeight: 500 }}>({sanctionOrderNumbers.length} found)</span>
                  )}
                </label>
                <Form.Select name="sanctionOrderNumber" value={addressDetails.sanctionOrderNumber} onChange={handleSanctionOrderChange} style={selectStyle} disabled={!filtersReady}>
                  <option value="">{filtersReady ? "— Select Sanction Order —" : "— Fill filters above first —"}</option>
                  {sanctionOrderNumbers.map((num, index) => {
                    const val = typeof num === "object" ? num.sanctionOrderNumber : num;
                    return <option key={index} value={val}>{val}</option>;
                  })}
                </Form.Select>
              </Col>
            </Row>

            <Row>
              <Col md={12} className="d-flex gap-3 flex-wrap pt-1">
                <button type="button" onClick={regenerateFromJasper} disabled={!canGenerate} style={btnStyle(canGenerate, "#1e67a8", "#2d9cdb", "rgba(30,103,168,0.35)")}>
                  {isGenerating ? (
                    <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> Regenerating…</>
                  ) : (
                    <>🖨️ Regenerate from Jasper</>
                  )}
                </button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default RegenerateSanctionOrder;
