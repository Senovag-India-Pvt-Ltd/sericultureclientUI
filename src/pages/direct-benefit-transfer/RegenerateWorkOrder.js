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

// Work-order report endpoint per scheme — mirrors DashboardReportList.callWorkOrderAcknowledgment
// so the regenerated Work Order PDF matches what was originally generated.
// (No farmer/company branching for work orders.)
const WORK_ORDER_ENDPOINTS = {
  "Silk Samagra State": "getWorkOrder",
  "Silk Samagra Central": "getWorkOrder",
  "PDMC": "pdmcWorkOrder",
  "PMKSY": "pdmcWorkOrder",
  "Reeling Shed-PSF": "selection-reeling-shed",
  "Silk Incentive-PSF": "selection-reeling-shed",
  "Adopting Boiler-PSF": "selection-boiler",
  "SS Construction Of Low Cost Shed to Permanent Rearing House": "getWorkOrderRHSSconstruction",
  "SDP Construction Of  Low Cost Shed to  Permanent  Rearing House": "getWorkOrderSDPConstruction",
  "ICB-PSF": "selection-icb",
  "Adopting Heat Recovery Unit-PSF": "selection-heat-recovery-unit",
  "Adopting Silent Generator": "selection-silent-generator",
  "Adopting Solar power Generator": "selection-solar-generator",
  "Adopting Solar Water Heater": "selection-solar-water-heater",
  "MERM-PSF": "selection-MERM",
  "IMCB-PSF": "selection-imcb",
  "Rearing Equipment SS": "SelectionRearingEquipmentSS",
  "Registered Private Bivoltine Chawki Rearing Center Subsidy": "SelectionCRC",
  "SDP RH 225": "getRHSDP225WorkOrder",
  "SDP Low Cost Shed": "getRHSDPLowCostShedWorkOrder",
  "Automatic Reeling Machine Unit": "selection-arm",
};
// PDMC/PMKSY use a minimal payload; every other scheme sends scheme+subScheme+category.
const WORK_ORDER_MINIMAL_PAYLOAD = new Set(["PDMC", "PMKSY"]);

// Regenerate Work Order — always builds the PDF freshly from Jasper via the
// reports `getWorkOrder` endpoint (NOT the pre-generated copy stored on S3).
function RegenerateWorkOrder() {
  const [listData, setListData] = useState({});
  const [page] = useState(0);
  const countPerPage = 50;
  const { t, i18n } = useTranslation();

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
  const [workOrderNumber, setWorkOrderNumber] = useState("");
  const [workOrderNumbers, setWorkOrderNumbers] = useState([]);
  // The scheme's "work order for scheme" config drives which Jasper report is used.
  const [workOrderForScheme, setWorkOrderForScheme] = useState(null);

  // ── resolve the applicationFormId for the selected WORK ORDER number ──
  // getSanctionOrderData matches sanction_order_number only, so a work-order
  // number never resolves through it. getWorkOrderAndAcknowledgementData maps a
  // workOrderNumber (+ scheme filters) to its application rows.
  const search = (details = addressDetails) => {
    api
      .post(
        baseURLDBT + `service/getWorkOrderAndAcknowledgementData`,
        {},
        {
          params: {
            schemeId: details.scSchemeDetailsId || 0,
            subSchemeId: details.subSchemeId || 0,
            componentId: details.componentId || 0,
            scCategoryId: details.scCategoryId || 0,
            workOrderNumber: details.sanctionOrderNumber || "",
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        const data = response.data.content || [];
        setListData(data);
        const recordData = data[0];
        setApplicationFormId(recordData?.scApplicationFormId || null);
      })
      .catch(() => {
        setListData([]);
        setApplicationFormId(null);
      });
  };

  // ── work order numbers dropdown (auto-fetch when filters ready) ──
  const fetchWorkOrderNumbers = (details) => {
    const { financialYearId, scSchemeDetailsId, subSchemeId, componentId, scCategoryId, fruitsId } = details;
    if (financialYearId && scSchemeDetailsId && subSchemeId && componentId && scCategoryId) {
      api
        .post(
          baseURLDBT + `service/getWorkOrderNumbers`,
          {},
          {
            params: {
              financialYearId,
              schemeId: scSchemeDetailsId,
              subSchemeId,
              componentId,
              categoryId: scCategoryId,
              ...(fruitsId ? { fruitsId } : {}),
            },
          }
        )
        .then((res) => {
          const content = res.data?.content;
          setWorkOrderNumbers(Array.isArray(content) ? content : []);
        })
        .catch(() => setWorkOrderNumbers([]));
    } else {
      setWorkOrderNumbers([]);
    }
  };

  // ── input handlers ──
  const handleInputsaddress = (e) => {
    const { name, value } = e.target;
    const updated = { ...addressDetails, [name]: value, sanctionOrderNumber: "" };
    setAddressDetails(updated);
    setWorkOrderNumber("");
    setApplicationFormId(null);
    fetchWorkOrderNumbers(updated);
  };

  const handleWorkOrderChange = (e) => {
    const value = e.target.value;
    const updated = { ...addressDetails, sanctionOrderNumber: value };
    setAddressDetails(updated);
    setWorkOrderNumber(value);
    if (value) search(updated);
    else setApplicationFormId(null);
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

  // Resolve the scheme's work-order report type once scheme + component type are chosen.
  useEffect(() => {
    if (addressDetails.scSchemeDetailsId && addressDetails.subSchemeId) {
      api
        .get(
          baseURLMasterData +
            `scSubSchemeDetails/get-by-scheme-and-sub-scheme-details-id/${addressDetails.scSchemeDetailsId}/${addressDetails.subSchemeId}`
        )
        .then((r) => {
          const list = r.data?.content?.scSubSchemeDetails;
          setWorkOrderForScheme(list?.[0]?.workOrderForScheme || null);
        })
        .catch(() => setWorkOrderForScheme(null));
    } else {
      setWorkOrderForScheme(null);
    }
  }, [addressDetails.scSchemeDetailsId, addressDetails.subSchemeId]);

  // ── Regenerate from Jasper (getWorkOrder) ──
  const [isGenerating, setIsGenerating] = useState(false);

  const regenerateFromJasper = async () => {
    if (!addressDetails.sanctionOrderNumber || !applicationFormId) {
      Swal.fire({
        icon: "warning",
        title: t("Selection Required", { ns: "reports" }),
        html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;box-shadow:0 4px 10px rgba(245,158,11,0.3)">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">${t("Action Needed", { ns: "reports" })}</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${t("Please select a <b>Work Order Number</b> from the dropdown before regenerating.", { ns: "reports" })}</p></div></div></div>`,
        confirmButtonText: t("Got it", { ns: "reports" }),
        confirmButtonColor: "#d97706",
        background: "#fff",
        customClass: { popup: "swal-pop" },
      });
      return;
    }
    const endpoint = WORK_ORDER_ENDPOINTS[workOrderForScheme];
    if (!endpoint) {
      Swal.fire({
        icon: "warning",
        title: t("Scheme Not Supported", { ns: "reports" }),
        text: workOrderForScheme
          ? t("No work order report is configured for \"{{scheme}}\".", { ns: "reports", scheme: workOrderForScheme })
          : t("Could not determine the scheme's work order type. Please reselect the Scheme and Component Type.", { ns: "reports" }),
        confirmButtonColor: "#d97706",
      });
      return;
    }
    const payload = WORK_ORDER_MINIMAL_PAYLOAD.has(workOrderForScheme)
      ? {
          applicationFormId: applicationFormId,
          schemeId: addressDetails.scSchemeDetailsId,
        }
      : {
          applicationFormId: applicationFormId,
          schemeId: addressDetails.scSchemeDetailsId,
          subSchemeId: addressDetails.subSchemeId,
          categoryId: addressDetails.scCategoryId,
        };
    setIsGenerating(true);
    try {
      const response = await api.post(baseURLReport + endpoint, payload, {
        responseType: "blob",
      });
      const file = new Blob([response.data], { type: "application/pdf" });
      window.open(URL.createObjectURL(file));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("Regeneration Failed", { ns: "reports" }),
        html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🖨️</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Could Not Regenerate", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${t("Could not build the Work Order PDF. Please verify the selection and try again.", { ns: "reports" })}</p></div></div></div>`,
        confirmButtonText: t("Close"),
        confirmButtonColor: "#e53e3e",
        background: "#fff",
        customClass: { popup: "swal-pop" },
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
    transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "7px", minWidth: "200px", justifyContent: "center",
  });

  const filtersReady =
    addressDetails.financialYearId &&
    addressDetails.scSchemeDetailsId &&
    addressDetails.subSchemeId &&
    addressDetails.componentId &&
    addressDetails.scCategoryId;

  const canGenerate = workOrderNumber && applicationFormId && !isGenerating;

  // ── render ──
  return (
    <Layout title={t("Regenerate Work Order", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Regenerate Work Order", { ns: "reports" })}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg, #1a7a4a 0%, #28a745 100%)", padding: "18px 28px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🖨️</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "17px", lineHeight: 1.2 }}>{t("Regenerate Work Order", { ns: "reports" })}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", marginTop: "2px" }}>{t("Builds a fresh PDF", { ns: "reports" })}</div>
            </div>
          </div>

          <Card.Body style={{ padding: "28px 32px 24px" }}>
            {/* Fruits ID — optional */}
            <Row className="mb-3">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Fruits ID", { ns: "reports" })} <span style={{ color: "#a0aec0", fontWeight: 400 }}>({t("optional", { ns: "reports" })})</span></label>
                <Form.Control type="text" name="fruitsId" value={addressDetails.fruitsId || ""} onChange={handleInputsaddress} placeholder={t("Enter Fruits ID to filter", { ns: "reports" })} style={selectStyle} />
              </Col>
            </Row>

            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1a7a4a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "18px" }}>{t("Step 1 — Select Scheme Details", { ns: "reports" })}</div>

            <Row className="mb-3">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Financial Year")}</label>
                <Form.Select name="financialYearId" value={addressDetails.financialYearId || ""} onChange={handleInputsaddress} style={selectStyle}>
                  <option value="">{`— ${t("Select Financial Year")} —`}</option>
                  {financialyearListData.map((list) => (
                    <option key={list.financialYearMasterId} value={list.financialYearMasterId}>{list.financialYear}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Scheme")}</label>
                <Form.Select name="scSchemeDetailsId" value={addressDetails.scSchemeDetailsId || ""} onChange={handleInputsaddress} style={selectStyle}>
                  <option value="">{`— ${t("Select Scheme")} —`}</option>
                  {scSchemeDetailsListData?.map((list) => (
                    <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>{i18n.language === "kn" ? (list.schemeNameInKannada || list.schemeName) : list.schemeName}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Component Type")}</label>
                <Form.Select name="subSchemeId" value={addressDetails.subSchemeId || ""} onChange={handleInputsaddress} style={selectStyle}>
                  <option value="">{`— ${t("Select Component Type")} —`}</option>
                  {scSubSchemeDetailsListData?.map((list) => (
                    <option key={list.scSubSchemeDetailsId} value={list.subSchemeId}>{i18n.language === "kn" ? (list.subSchemeNameInKannada || list.subSchemeName) : list.subSchemeName}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Component")}</label>
                <Form.Select name="componentId" value={addressDetails.componentId || ""} onChange={handleInputsaddress} style={selectStyle}>
                  <option value="">{`— ${t("Select Component")} —`}</option>
                  {scComponentListData?.map((list) => (
                    <option key={list.scComponentId} value={list.scComponentId}>{i18n.language === "kn" ? (list.scComponentNameInKannada || list.scComponentName) : list.scComponentName}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Sub Component")}</label>
                <Form.Select name="scCategoryId" value={addressDetails.scCategoryId || ""} onChange={handleInputsaddress} style={selectStyle}>
                  <option value="">{`— ${t("Select Sub Component")} —`}</option>
                  {scCategoryListData?.map((list) => (
                    <option key={list.scCategoryId} value={list.scCategoryId}>{i18n.language === "kn" ? (list.categoryNameInKannada || list.categoryName) : list.categoryName}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <div style={{ borderTop: "1.5px dashed #d0d9e8", margin: "8px 0 20px" }} />
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1a7a4a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "18px" }}>{t("Step 2 — Select Work Order & Regenerate", { ns: "reports" })}</div>

            <Row className="mb-3 align-items-end">
              <Col md={5} style={fieldGroupStyle}>
                <label style={labelStyle}>
                  {t("Work Order Number", { ns: "reports" })}
                  {workOrderNumbers.length > 0 && (
                    <span style={{ marginLeft: "8px", fontSize: "11px", color: "#1a7a4a", fontWeight: 500 }}>({workOrderNumbers.length} {t("found", { ns: "reports" })})</span>
                  )}
                </label>
                <SearchableSelect
                  name="sanctionOrderNumber"
                  value={addressDetails.sanctionOrderNumber}
                  onChange={(val) =>
                    handleWorkOrderChange({
                      target: { name: "sanctionOrderNumber", value: val },
                    })
                  }
                  isDisabled={!filtersReady}
                  placeholder={filtersReady ? `— ${t("Select Work Order", { ns: "reports" })} —` : `— ${t("Fill filters above first", { ns: "reports" })} —`}
                  options={(workOrderNumbers || []).map((item) =>
                    typeof item === "object" ? item.workOrderNumber : item
                  )}
                />
              </Col>
            </Row>

            <Row>
              <Col md={12} className="d-flex gap-3 flex-wrap pt-1">
                <button type="button" onClick={regenerateFromJasper} disabled={!canGenerate} style={btnStyle(canGenerate, "#1a7a4a", "#28a745", "rgba(26,122,74,0.35)")}>
                  {isGenerating ? (
                    <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> {t("Regenerating…", { ns: "reports" })}</>
                  ) : (
                    <>🖨️ {t("Regenerate Sanction Order", { ns: "reports" })}</>
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

export default RegenerateWorkOrder;
