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

function GenerateArmReleaseLetters() {
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

  // ── resolve the selected Work Order Number to an applicationFormId ──────
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
        const data = response.data.content;
        const recordData = data[0];
        setApplicationFormId(recordData?.scApplicationFormId);
      })
      .catch(() => {
        setApplicationFormId(null);
      });
  };

  // ── work order numbers dropdown (getWorkOrderNumbers) ─────────────
  const [workOrderNumbers, setWorkOrderNumbers] = useState([]);

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

  // ── input handlers ────────────────────────────────────────────────
  const handleInputsaddress = (e) => {
    const { name, value } = e.target;
    const updated = { ...addressDetails, [name]: value };
    setAddressDetails(updated);
    setApplicationFormId(null);
    fetchWorkOrderNumbers(updated);
  };

  const handleWorkOrderChange = (e) => {
    const value = e.target.value;
    const updated = { ...addressDetails, sanctionOrderNumber: value };
    setAddressDetails(updated);
    search(updated);
  };

  // ── master data ───────────────────────────────────────────────────
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

  // ── Generate letters — same request shape as handleArmStageAction's
  // openArmReportPdf in DashboardReportList.js ──────────────────────
  const [generatingEndpoint, setGeneratingEndpoint] = useState(null);

  const showLetterError = (title) =>
    Swal.fire({
      icon: "error",
      title: "Could Not Generate",
      text: `Failed to generate the ${title}. Please check the selected Work Order and try again.`,
      confirmButtonColor: "#e53e3e",
    });

  const generateLetter = async (endpoint, title) => {
    if (!applicationFormId) {
      Swal.fire({
        icon: "warning",
        title: "Selection Required",
        text: "Please select a Work Order Number before generating a letter.",
        confirmButtonColor: "#d97706",
      });
      return;
    }
    setGeneratingEndpoint(endpoint);
    try {
      const response = await api.post(
        baseURLReport + endpoint,
        {
          applicationFormId,
          schemeId: addressDetails.scSchemeDetailsId,
          subSchemeId: addressDetails.subSchemeId,
          categoryId: addressDetails.scCategoryId,
        },
        { responseType: "blob" }
      );
      const file = new Blob([response.data], { type: "application/pdf" });
      window.open(URL.createObjectURL(file));
    } catch (error) {
      showLetterError(title);
    } finally {
      setGeneratingEndpoint(null);
    }
  };

  const generateAdvancePaymentLetter = () => generateLetter("arm-advance-payment", "ARM Advance Payment letter");
  const generateFirstReleaseLetter = () => generateLetter("arm-first-release", "ARM First Release letter");
  const generateFinalReleaseLetter = () => generateLetter("arm-final-release", "ARM Final Release letter");

  // ── styles ────────────────────────────────────────────────────────
  const selectStyle = {
    borderRadius: "8px",
    border: "1.5px solid #d0d9e8",
    padding: "8px 12px",
    fontSize: "14px",
    background: "#f8fafd",
    color: "#333",
    width: "100%",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: 600,
    color: "#4a5568",
    marginBottom: "5px",
    display: "block",
  };

  const fieldGroupStyle = { display: "flex", flexDirection: "column", marginBottom: "4px" };

  const btnStyle = (active, color1, color2, shadow) => ({
    background: active ? `linear-gradient(135deg, ${color1}, ${color2})` : "#c8d6e5",
    border: "none",
    borderRadius: "9px",
    padding: "10px 22px",
    fontWeight: 700,
    fontSize: "13.5px",
    color: "#fff",
    cursor: active ? "pointer" : "not-allowed",
    boxShadow: active ? `0 4px 14px ${shadow}` : "none",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    minWidth: "200px",
    justifyContent: "center",
  });

  const filtersReady =
    addressDetails.financialYearId &&
    addressDetails.scSchemeDetailsId &&
    addressDetails.subSchemeId &&
    addressDetails.componentId &&
    addressDetails.scCategoryId;

  // ── render ────────────────────────────────────────────────────────
  return (
    <Layout title="ARM Release Letters">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">ARM Release Letters</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card
          className="mt-1"
          style={{
            borderRadius: "14px",
            border: "none",
            boxShadow: "0 4px 24px rgba(30,103,168,0.10)",
            overflow: "hidden",
          }}
        >
          {/* Card Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #1a7a4a 0%, #28a745 100%)",
              padding: "18px 28px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              🏭
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "17px", lineHeight: 1.2 }}>
                ARM Release Letters
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", marginTop: "2px" }}>
                Select filters, pick a Work Order, then generate the Advance Payment / First Release / Final Release letter
              </div>
            </div>
          </div>

          <Card.Body style={{ padding: "28px 32px 24px" }}>

            {/* Fruits ID — optional */}
            <Row className="mb-3">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>
                  Fruits ID{" "}
                  <span style={{ color: "#a0aec0", fontWeight: 400 }}>(optional)</span>
                </label>
                <Form.Control
                  type="text"
                  name="fruitsId"
                  value={addressDetails.fruitsId || ""}
                  onChange={handleInputsaddress}
                  placeholder="Enter Fruits ID to filter"
                  style={selectStyle}
                />
              </Col>
            </Row>

            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1a7a4a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "18px" }}>
              Step 1 — Select Scheme Details
            </div>

            {/* Row 1 */}
            <Row className="mb-3">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>Financial Year</label>
                <Form.Select
                  name="financialYearId"
                  value={addressDetails.financialYearId || ""}
                  onChange={handleInputsaddress}
                  style={selectStyle}
                >
                  <option value="">— Select Financial Year —</option>
                  {financialyearListData.map((list) => (
                    <option key={list.financialYearMasterId} value={list.financialYearMasterId}>
                      {list.financialYear}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>Scheme</label>
                <Form.Select
                  name="scSchemeDetailsId"
                  value={addressDetails.scSchemeDetailsId || ""}
                  onChange={handleInputsaddress}
                  style={selectStyle}
                >
                  <option value="">— Select Scheme —</option>
                  {scSchemeDetailsListData?.map((list) => (
                    <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>
                      {list.schemeName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            {/* Row 2 */}
            <Row className="mb-3">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>Component Type</label>
                <Form.Select
                  name="subSchemeId"
                  value={addressDetails.subSchemeId || ""}
                  onChange={handleInputsaddress}
                  style={selectStyle}
                >
                  <option value="">— Select Component Type —</option>
                  {scSubSchemeDetailsListData?.map((list) => (
                    <option key={list.scSubSchemeDetailsId} value={list.subSchemeId}>
                      {list.subSchemeName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>Component</label>
                <Form.Select
                  name="componentId"
                  value={addressDetails.componentId || ""}
                  onChange={handleInputsaddress}
                  style={selectStyle}
                >
                  <option value="">— Select Component —</option>
                  {scComponentListData?.map((list) => (
                    <option key={list.scComponentId} value={list.scComponentId}>
                      {list.scComponentName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            {/* Row 3 */}
            <Row className="mb-4">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>Sub Component</label>
                <Form.Select
                  name="scCategoryId"
                  value={addressDetails.scCategoryId || ""}
                  onChange={handleInputsaddress}
                  style={selectStyle}
                >
                  <option value="">— Select Sub Component —</option>
                  {scCategoryListData?.map((list) => (
                    <option key={list.scCategoryId} value={list.scCategoryId}>
                      {list.categoryName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <div style={{ borderTop: "1.5px dashed #d0d9e8", margin: "8px 0 20px" }} />
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1a7a4a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "18px" }}>
              Step 2 — Select Work Order &amp; Generate
            </div>

            {/* Row 4 — Work Order Number */}
            <Row className="mb-3 align-items-end">
              <Col md={5} style={fieldGroupStyle}>
                <label style={labelStyle}>
                  Work Order Number
                  {workOrderNumbers.length > 0 && (
                    <span style={{ marginLeft: "8px", fontSize: "11px", color: "#1a7a4a", fontWeight: 500 }}>
                      ({workOrderNumbers.length} found)
                    </span>
                  )}
                </label>
                <Form.Select
                  name="sanctionOrderNumber"
                  value={addressDetails.sanctionOrderNumber}
                  onChange={handleWorkOrderChange}
                  style={selectStyle}
                  disabled={!filtersReady}
                >
                  <option value="">
                    {filtersReady ? "— Select Work Order —" : "— Fill filters above first —"}
                  </option>
                  {workOrderNumbers.map((item, index) => (
                    <option key={index} value={item.workOrderNumber}>
                      {item.workOrderNumber}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            {/* Row 5 — Generate buttons */}
            <Row>
              <Col md={12} className="d-flex gap-3 flex-wrap pt-1">
                <button
                  type="button"
                  onClick={generateAdvancePaymentLetter}
                  disabled={!applicationFormId || generatingEndpoint !== null}
                  style={btnStyle(
                    applicationFormId && generatingEndpoint === null,
                    "#1a7a4a", "#28a745", "rgba(26,122,74,0.35)"
                  )}
                >
                  {generatingEndpoint === "arm-advance-payment" ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      Generating…
                    </>
                  ) : (
                    <>📄 Advance Payment Letter</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={generateFirstReleaseLetter}
                  disabled={!applicationFormId || generatingEndpoint !== null}
                  style={btnStyle(
                    applicationFormId && generatingEndpoint === null,
                    "#1e67a8", "#2d9cdb", "rgba(30,103,168,0.35)"
                  )}
                >
                  {generatingEndpoint === "arm-first-release" ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      Generating…
                    </>
                  ) : (
                    <>📄 First Release Letter</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={generateFinalReleaseLetter}
                  disabled={!applicationFormId || generatingEndpoint !== null}
                  style={btnStyle(
                    applicationFormId && generatingEndpoint === null,
                    "#b45309", "#d97706", "rgba(180,83,9,0.35)"
                  )}
                >
                  {generatingEndpoint === "arm-final-release" ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      Generating…
                    </>
                  ) : (
                    <>📄 Final Release Letter</>
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

export default GenerateArmReleaseLetters;
