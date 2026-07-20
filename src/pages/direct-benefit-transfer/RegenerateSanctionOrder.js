import React, { useEffect, useState } from "react";
import api from "../../services/auth/api";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Card, Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import SearchableSelect from "../../components/SearchableSelect/SearchableSelect";

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
  // Farmer vs Company — only affects schemes whose sanction report branches by
  // recipient (Boiler/IMCB/ICB/HRU/Generators/Solar Heater/Rearing Equipment SS/PMKSY/PDMC).
  const [recipientType, setRecipientType] = useState("farmer");

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

  // Dashboard-Report-List schemes — regenerate using the EXACT same endpoint, payload
  // and farmer/company branching as the original generation flow
  // (mirrors DashboardReportList.generateSanctionOrderAcknowledgment) so the regenerated
  // PDF matches what was first produced.
  const runGeneratorAligned = (schemeType, recipient) => {
    const userId = localStorage.getItem("userMasterId");
    const schemeId = addressDetails.scSchemeDetailsId;
    const subSchemeId = addressDetails.subSchemeId;
    const categoryId = addressDetails.scCategoryId;

    let endpoint;
    if (schemeType === "Silk Samagra State" || schemeType === "Silk Samagra Central") {
      endpoint = `getSanctionOrderRH`;
    } else if (schemeType === "SS Construction Of Low Cost Shed to Permanent Rearing House") {
      endpoint = `getSanctionOrderRHSSConstruction`;
    } else if (schemeType === "SDP Construction Of  Low Cost Shed to  Permanent  Rearing House") {
      endpoint = `getSanctionOrderRHSDPConstruction`;
    } else if (schemeType === "Rearing Equipment SS") {
      endpoint = recipient === "company" ? `RearingEquipmentSSCompany` : `RearingEquipmentSSBeneficiary`;
    } else if (schemeType === "Reeling Shed-PSF") {
      endpoint = `sanction-psfa-reeling-shed`;
    } else if (schemeType === "MERM-PSF") {
      endpoint = `getMERMSanction`;
    } else if (schemeType === "Adopting Boiler-PSF") {
      endpoint = recipient === "company" ? `getBoilerSDPCompany` : `getBoilerSDPBeneficiary`;
    } else if (schemeType === "IMCB-PSF") {
      endpoint = recipient === "company" ? `getIMCBCompany` : `getIMCBBeneficiary`;
    } else if (schemeType === "ICB-PSF") {
      endpoint = recipient === "company" ? `getICBCompany` : `getICBBeneficiary`;
    } else if (schemeType === "Adopting Heat Recovery Unit-PSF") {
      endpoint = recipient === "company" ? `getHRUCompany` : `getHRUBeneficiary`;
    } else if (schemeType === "Adopting Silent Generator") {
      endpoint = recipient === "company" ? `getSilentGeneratorCompany` : `getSilentGeneratorBeneficiary`;
    } else if (schemeType === "Adopting Solar power Generator") {
      endpoint = recipient === "company" ? `getSolarPowerGeneratorCompany` : `getSolarPowerGeneratorBeneficiary`;
    } else if (schemeType === "Adopting Solar Water Heater") {
      endpoint = recipient === "company" ? `getSolarWaterHeaterCompany` : `getSolarWaterHeaterBeneficiary`;
    } else if (schemeType === "Registered Private Bivoltine Chawki Rearing Center Subsidy") {
      endpoint = `PrivateCRCSanction`;
    } else if (schemeType === "SDP RH 225") {
      endpoint = `getSanctionOrderRHSDP225`;
    } else if (schemeType === "SDP Low Cost Shed") {
      endpoint = `getSanctionOrderRHSDPLowCostShed`;
    } else {
      // PMKSY / PDMC
      if (recipient === "company") {
        endpoint = schemeType === "PMKSY" ? `getSanctionOrderPmksyCompany` : `getSanctionOrderPDMCCompany`;
      } else {
        endpoint = schemeType === "PMKSY" ? `getSanctionOrderPmksy` : `getSanctionOrderPDMC`;
      }
    }

    let payload;
    if (
      schemeType === "Silk Samagra State" ||
      schemeType === "Silk Samagra Central" ||
      schemeType === "Rearing Equipment SS" ||
      schemeType === "Registered Private Bivoltine Chawki Rearing Center Subsidy" ||
      schemeType === "SS Construction Of Low Cost Shed to Permanent Rearing House"
    ) {
      payload = { applicationFormIds: allApplicationIds, schemeId, subSchemeId, categoryId, userId };
    } else if (
      schemeType === "Reeling Shed-PSF" ||
      schemeType === "Adopting Heat Recovery Unit-PSF" ||
      schemeType === "Adopting Boiler-PSF" ||
      schemeType === "ICB-PSF" ||
      schemeType === "IMCB-PSF" ||
      schemeType === "Adopting Silent Generator" ||
      schemeType === "Adopting Solar power Generator" ||
      schemeType === "Adopting Solar Water Heater" ||
      schemeType === "MERM-PSF" ||
      schemeType === "SDP RH 225" ||
      schemeType === "SDP Low Cost Shed" ||
      schemeType === "SDP Construction Of  Low Cost Shed to  Permanent  Rearing House"
    ) {
      payload = { applicationFormId: applicationFormId, schemeId, subSchemeId, categoryId, userId };
    } else {
      payload = { applicationFormId: applicationFormId, schemeId };
    }

    return api
      .post(baseURLReport + endpoint, payload, { responseType: "blob" })
      .then((res) => openPdf(res.data));
  };

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
      case "Bonus PM":
        return reportByApplicationIds(`get-BonusPM`, selectedSanctionOrder);
      case "Bonus BV":
        return reportByApplicationIds(`get-Bonus`, selectedSanctionOrder);
      case "Incentive PM":
        return reportByApplicationIds(`get-Incentive`, selectedSanctionOrder);
      case "Incentive BV":
        return reportByApplicationIds(`get-IncentiveBV`, selectedSanctionOrder);
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

      // ── Dashboard Report List schemes — aligned to the generator (exact endpoint,
      //     payload and farmer/company branching via the recipient toggle) ──
      case "Silk Samagra State":
      case "Silk Samagra Central":
      case "SS Construction Of Low Cost Shed to Permanent Rearing House":
      case "SDP Construction Of  Low Cost Shed to  Permanent  Rearing House":
      case "Rearing Equipment SS":
      case "Reeling Shed-PSF":
      case "MERM-PSF":
      case "Adopting Boiler-PSF":
      case "IMCB-PSF":
      case "ICB-PSF":
      case "Adopting Heat Recovery Unit-PSF":
      case "Adopting Silent Generator":
      case "Adopting Solar power Generator":
      case "Adopting Solar Water Heater":
      case "Registered Private Bivoltine Chawki Rearing Center Subsidy":
      case "SDP RH 225":
      case "SDP Low Cost Shed":
      case "PMKSY":
      case "PDMC":
        return runGeneratorAligned(sanctionOrderForScheme, recipientType);

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
                <SearchableSelect
                  name="sanctionOrderNumber"
                  value={addressDetails.sanctionOrderNumber}
                  onChange={(val) =>
                    handleSanctionOrderChange({
                      target: { name: "sanctionOrderNumber", value: val },
                    })
                  }
                  isDisabled={!filtersReady}
                  placeholder={filtersReady ? "— Select Sanction Order —" : "— Fill filters above first —"}
                  options={(sanctionOrderNumbers || []).map((num) =>
                    typeof num === "object" ? num.sanctionOrderNumber : num
                  )}
                />
              </Col>
              <Col md={4} style={fieldGroupStyle}>
                <label style={labelStyle}>
                  Recipient
                  <span style={{ color: "#a0aec0", fontWeight: 400 }}> (Farmer/Company schemes only)</span>
                </label>
                <Form.Select value={recipientType} onChange={(e) => setRecipientType(e.target.value)} style={selectStyle}>
                  <option value="farmer">Farmer / Beneficiary</option>
                  <option value="company">Company</option>
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
