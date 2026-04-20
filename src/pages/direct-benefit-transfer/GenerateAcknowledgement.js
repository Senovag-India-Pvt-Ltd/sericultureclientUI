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

function GenerateAcknowledgement() {
  const [listData, setListData] = useState({});
  const [page] = useState(0);
  const countPerPage = 50;
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const [addressDetails, setAddressDetails] = useState({
    financialYearId: "",
    schemeId: "",
    componentId: "",
    subSchemeId: "",
    sanctionOrderNumber: "",
    scCategoryId: "",
  });

  const [applicationFormId, setApplicationFormId] = useState(null);
  const [sanctionOrderForScheme, setSanctionOrderForScheme] = useState(null);
  const [allApplicationIds, setAllApplicationIds] = useState([]);
  const [subSchemeType, setSubSchemeType] = useState([]);
  const [arn, setArn] = useState("");

  // ── fetch list on sanction order change ──────────────────────────
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
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
        const scApplicationFormIds = response.data.content.map(
          (item) => item.scApplicationFormId
        );
        const data = response.data.content;
        const recordData = data[0];
        setAllApplicationIds(scApplicationFormIds);
        setApplicationFormId(recordData?.scApplicationFormId);
        setSubSchemeType(recordData?.subSchemeType);
        setArn(recordData?.arn || "");
        setSanctionOrderForScheme(recordData?.sanctionOrderForScheme || null);
        setLoading(false);
      })
      .catch(() => {
        setListData([]);
      });
  };

  const getList = () => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getSanctionOrderData`,
        {},
        {
          params: {
            schemeId: addressDetails.schemeId || 0,
            subSchemeId: addressDetails.subSchemeId || 0,
            componentId: addressDetails.componentId || 0,
            scCategoryId: addressDetails.scCategoryId || 0,
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
        const data = response.data.content;
        const recordData = data[0];
        const applicationFormIdsFromApi =
          response.data.extra?.applicationFormIds || [];
        setAllApplicationIds(applicationFormIdsFromApi);
        setApplicationFormId(recordData?.scApplicationFormId);
        setSubSchemeType(recordData?.subSchemeType);
        setArn(recordData?.arn || "");
        setSanctionOrderForScheme(recordData?.sanctionOrderForScheme || null);
        setLoading(false);
      })
      .catch(() => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [page]);

  // ── input handlers ────────────────────────────────────────────────
  const handleInputsaddress = (e) => {
    const { name, value } = e.target;
    const updated = { ...addressDetails, [name]: value };
    setAddressDetails(updated);
    if (
      updated.scSchemeDetailsId &&
      updated.subSchemeId &&
      updated.componentId &&
      updated.scCategoryId
    ) {
      loadSanctionOrderNumbers(updated);
    }
  };

  const handleSanctionOrderChange = (e) => {
    const updated = { ...addressDetails, sanctionOrderNumber: e.target.value };
    setAddressDetails(updated);
    search(updated);
  };

  // ── sanction order numbers dropdown ──────────────────────────────
  const [sanctionOrderNumbers, setSanctionOrderNumbers] = useState([]);

  const loadSanctionOrderNumbers = () => {
    if (
      addressDetails.financialYearId &&
      addressDetails.scSchemeDetailsId &&
      addressDetails.subSchemeId &&
      addressDetails.componentId &&
      addressDetails.scCategoryId
    ) {
      api
        .post(
          baseURLDBT +
            `service/getSanctionOrderNumbers?financialYearId=${addressDetails.financialYearId}&schemeId=${addressDetails.scSchemeDetailsId}&subSchemeId=${addressDetails.subSchemeId}&componentId=${addressDetails.componentId}&categoryId=${addressDetails.scCategoryId}`
        )
        .then((res) => {
          if (res.data && res.data.content)
            setSanctionOrderNumbers(res.data.content);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    if (
      addressDetails.financialYearId &&
      addressDetails.scSchemeDetailsId &&
      addressDetails.subSchemeId &&
      addressDetails.componentId &&
      addressDetails.scCategoryId
    ) {
      loadSanctionOrderNumbers(addressDetails);
    }
  }, [
    addressDetails.financialYearId,
    addressDetails.scSchemeDetailsId,
    addressDetails.subSchemeId,
    addressDetails.componentId,
    addressDetails.scCategoryId,
  ]);

  // ── master data ───────────────────────────────────────────────────
  const [financialyearListData, setFinancialyearListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-all`)
      .then((r) =>
        setFinancialyearListData(r.data.content.financialYearMaster)
      )
      .catch(() => setFinancialyearListData([]));
  }, []);

  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURLMasterData + `scSchemeDetails/get-all`)
      .then((r) =>
        setScSchemeDetailsListData(r.data.content.ScSchemeDetails)
      )
      .catch(() => setScSchemeDetailsListData([]));
  }, []);

  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState([]);
  useEffect(() => {
    if (addressDetails.scSchemeDetailsId) {
      api
        .get(
          baseURLDBT +
            `master/cost/get-by-scheme-id/${addressDetails.scSchemeDetailsId}`
        )
        .then((r) => {
          if (r.data.content.unitCost)
            setScSubSchemeDetailsListData(r.data.content.unitCost);
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
  }, [
    addressDetails.scSchemeDetailsId,
    addressDetails.subSchemeId,
    addressDetails.scCategoryId,
  ]);

  const [scCategoryListData, setScCategoryListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURLMasterData + `scCategory/get-all`)
      .then((r) => {
        if (r.data.content.scCategory)
          setScCategoryListData(r.data.content.scCategory);
      })
      .catch(() => setScCategoryListData([]));
  }, []);

  // ── Generate PDF (scheme-based report endpoints) ──────────────────
  const handleGeneratePDF = () => {
    const selectedSanctionOrder = addressDetails.sanctionOrderNumber;
    if (!selectedSanctionOrder) {
      Swal.fire({
        icon: "warning",
        title: "Sanction Order Required",
        html: "<p style='color:#555;font-size:15px;margin:0'>Please select a <b>Sanction Order Number</b> before generating the PDF.</p>",
        confirmButtonText: "Got it",
        confirmButtonColor: "#6b46c1",
        background: "#fff",
        customClass: { popup: "swal-rounded" },
      });
      return;
    }
    if (sanctionOrderForScheme === "Bivoltine Bonus") {
      const type = Number(subSchemeType);
      if (type === 2) generateReport("get-Incentive", selectedSanctionOrder, true);
      else if (type === 3) generateReport("get-Bonus", selectedSanctionOrder, true);
      else if (type === 4) generateReport("get-seed-cocoon", selectedSanctionOrder, true);
      else showSchemeError();
    } else if (sanctionOrderForScheme === "Incentive For Bivoltine Cocoons-30/kg-PSF") {
      generateReport("get-PriceStabilizationIncentive", selectedSanctionOrder, true);
    } else if (sanctionOrderForScheme === "North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP") {
      generateReport("get-TransportSubsidy", selectedSanctionOrder, true);
    } else if (sanctionOrderForScheme === "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500") {
      generateReport("get-MscSeedChawki", selectedSanctionOrder, true);
    } else if (sanctionOrderForScheme === "Incentive For Bivoltine Chawki Rearing Cost") {
      generateReport("get-MscSeedChawki1000", selectedSanctionOrder, true);
    } else if (sanctionOrderForScheme === "Silk Incentive-PSF") {
      generateReport("sanction-silk-incentive", selectedSanctionOrder, true);
    } else if (sanctionOrderForScheme === "Reeling Shed-PSF") {
      generateReport("sanction-psfa-reeling-shed", selectedSanctionOrder, false);
    } else if (sanctionOrderForScheme === "Adopting Heat Recovery Unit-PSF") {
      generateReport("sanction-heat-unit", selectedSanctionOrder, false);
    } else if (sanctionOrderForScheme === "Registered Private Bivoltine Chawki Rearing Center Subsidy") {
      generateReport("getChawkiSanctionOrderPdf", selectedSanctionOrder, false);
    } else if (sanctionOrderForScheme === "Rearing Equipment SS") {
      generateReport("getSanctionOrderRHEquipment", selectedSanctionOrder, false);
    } else {
      showSchemeError();
    }
  };

  const showSchemeError = () =>
    Swal.fire({
      icon: "error",
      title: "No Report Available",
      html: "<p style='color:#555;font-size:15px;margin:0'>No downloadable report is configured for the selected scheme.</p>",
      confirmButtonText: "Close",
      confirmButtonColor: "#e53e3e",
      background: "#fff",
      customClass: { popup: "swal-rounded" },
    });

  const generateReport = async (endpoint, selectedSanctionOrder, usesApplicationIds) => {
    try {
      const payload = usesApplicationIds
        ? { userMasterId: localStorage.getItem("userMasterId"), schemeId: addressDetails.scSchemeDetailsId, subSchemeId: addressDetails.subSchemeId, applicationFormIds: allApplicationIds, sanctionOrderNumber: selectedSanctionOrder }
        : { schemeId: addressDetails.scSchemeDetailsId, subSchemeId: addressDetails.subSchemeId, categoryId: addressDetails.scCategoryId, applicationFormId, sanctionOrderNumber: selectedSanctionOrder };
      const response = await api.post(baseURLReport + endpoint, payload, { responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })));
    } catch (error) {}
  };

  // ── Download PDF (arn as file key) ───────────────────────────────
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = async () => {
    if (!arn) {
      Swal.fire({
        icon: "info",
        title: "File Not Available",
        html: "<p style='color:#555;font-size:15px;margin:0'>No pre-generated PDF was found for this acknowledgement.<br/>Try <b>Generate PDF</b> instead.</p>",
        confirmButtonText: "OK",
        confirmButtonColor: "#6b46c1",
        background: "#fff",
        customClass: { popup: "swal-rounded" },
      });
      return;
    }
    setIsDownloading(true);
    try {
      const fileNameWithExtension = `${arn}.pdf`;
      const response = await api.get(
        baseURLDBT + "dashboard/downLoadFileForURL",
        { params: { fileName: fileNameWithExtension }, responseType: "arraybuffer" }
      );
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = fileNameWithExtension;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      Swal.fire({
        icon: "success",
        title: "Downloaded Successfully!",
        html: `<div style="text-align:center"><p style="color:#555;font-size:15px;margin:6px 0 0">Your <b>Acknowledgement PDF</b> has been saved to your device.</p></div>`,
        confirmButtonText: "✓ Done",
        confirmButtonColor: "#6b46c1",
        background: "#fff",
        timer: 3000,
        timerProgressBar: true,
        customClass: { popup: "swal-rounded" },
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        html: `<p style="color:#555;font-size:15px;margin:0">We couldn't fetch the PDF at this time.<br/>Please <b>check your connection</b> and try again.</p>`,
        confirmButtonText: "Retry",
        confirmButtonColor: "#e53e3e",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        cancelButtonColor: "#a0aec0",
        background: "#fff",
        customClass: { popup: "swal-rounded" },
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // ── Swal styles ───────────────────────────────────────────────────
  if (!document.getElementById("swal-custom-styles")) {
    const style = document.createElement("style");
    style.id = "swal-custom-styles";
    style.innerHTML = `
      .swal-rounded { border-radius: 18px !important; padding: 10px !important; }
      .swal2-title { font-size: 20px !important; font-weight: 700 !important; color: #1a202c !important; }
      .swal2-popup.swal-rounded { box-shadow: 0 20px 60px rgba(0,0,0,0.18) !important; }
      .swal2-confirm { border-radius: 8px !important; padding: 10px 28px !important; font-weight: 600 !important; font-size: 14px !important; }
      .swal2-cancel { border-radius: 8px !important; padding: 10px 28px !important; font-weight: 600 !important; font-size: 14px !important; }
      .swal2-timer-progress-bar { background: #6b46c1 !important; height: 5px !important; }
      .swal2-icon { margin: 18px auto 10px !important; }
    `;
    document.head.appendChild(style);
  }

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
    padding: "10px 26px",
    fontWeight: 700,
    fontSize: "14px",
    color: "#fff",
    cursor: active ? "pointer" : "not-allowed",
    boxShadow: active ? `0 4px 14px ${shadow}` : "none",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    minWidth: "160px",
    justifyContent: "center",
  });

  // ── render ────────────────────────────────────────────────────────
  return (
    <Layout title="Acknowledgement">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Acknowledgement</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card
          className="mt-1"
          style={{
            borderRadius: "14px",
            border: "none",
            boxShadow: "0 4px 24px rgba(107,70,193,0.10)",
            overflow: "hidden",
          }}
        >
          {/* Card Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
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
              📋
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "17px", lineHeight: 1.2 }}>
                Acknowledgement Filter
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", marginTop: "2px" }}>
                Select filters to load and download acknowledgement
              </div>
            </div>
          </div>

          <Card.Body style={{ padding: "28px 32px 24px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#6b46c1", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "18px" }}>
              Step 1 — Select Scheme Details
            </div>

            {/* Row 1 */}
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
                  {scSchemeDetailsListData && scSchemeDetailsListData.length
                    ? scSchemeDetailsListData.map((list) => (
                        <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>{list.schemeName}</option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
            </Row>

            {/* Row 2 */}
            <Row className="mb-3">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>Component Type</label>
                <Form.Select name="subSchemeId" value={addressDetails.subSchemeId || ""} onChange={handleInputsaddress} style={selectStyle}>
                  <option value="">— Select Component Type —</option>
                  {scSubSchemeDetailsListData && scSubSchemeDetailsListData.length
                    ? scSubSchemeDetailsListData.map((list) => (
                        <option key={list.scSubSchemeDetailsId} value={list.subSchemeId}>{list.subSchemeName}</option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>Component</label>
                <Form.Select name="componentId" value={addressDetails.componentId || ""} onChange={handleInputsaddress} style={selectStyle}>
                  <option value="">— Select Component —</option>
                  {scComponentListData && scComponentListData.length
                    ? scComponentListData.map((list) => (
                        <option key={list.scComponentId} value={list.scComponentId}>{list.scComponentName}</option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
            </Row>

            {/* Row 3 */}
            <Row className="mb-4">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>Sub Component</label>
                <Form.Select name="scCategoryId" value={addressDetails.scCategoryId || ""} onChange={handleInputsaddress} style={selectStyle}>
                  <option value="">— Select Sub Component —</option>
                  {scCategoryListData && scCategoryListData.length
                    ? scCategoryListData.map((list) => (
                        <option key={list.scCategoryId} value={list.scCategoryId}>{list.categoryName}</option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
            </Row>

            <div style={{ borderTop: "1.5px dashed #d0d9e8", margin: "8px 0 20px" }} />
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#6b46c1", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "18px" }}>
              Step 2 — Select Sanction Order &amp; Download Acknowledgement
            </div>

            {/* Row 4 */}
            <Row className="align-items-end">
              <Col md={5} style={fieldGroupStyle}>
                <label style={labelStyle}>Sanction Order Number</label>
                <Form.Select name="sanctionOrderNumber" value={addressDetails.sanctionOrderNumber} onChange={handleSanctionOrderChange} style={selectStyle}>
                  <option value="">— Select Sanction Order —</option>
                  {sanctionOrderNumbers && sanctionOrderNumbers.length
                    ? sanctionOrderNumbers.map((num, index) => (
                        <option key={index} value={num}>{num}</option>
                      ))
                    : ""}
                </Form.Select>
                {!arn && addressDetails.sanctionOrderNumber && (
                  <small style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>
                    No pre-generated acknowledgement file found.
                  </small>
                )}
              </Col>

              <Col md={7} className="d-flex gap-3 flex-wrap pb-1">
                <button
                  type="button"
                  onClick={downloadFile}
                  disabled={!addressDetails.sanctionOrderNumber || isDownloading}
                  style={btnStyle(
                    addressDetails.sanctionOrderNumber && !isDownloading,
                    "#4c1d95", "#7c3aed", "rgba(107,70,193,0.35)"
                  )}
                >
                  {isDownloading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      Downloading…
                    </>
                  ) : (
                    <>⬇ Download PDF</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleGeneratePDF}
                  disabled={!addressDetails.sanctionOrderNumber}
                  style={btnStyle(
                    addressDetails.sanctionOrderNumber,
                    "#1e67a8", "#2d9cdb", "rgba(30,103,168,0.35)"
                  )}
                >
                  🖨 Generate PDF
                </button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default GenerateAcknowledgement;
