import { Card, Form, Row, Col, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
// import DatePicker from "../../../components/Form/DatePicker";
import DatePicker from "react-datepicker";
// import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";


const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function RenewReelerLicense() {
  // Translation
  const { t } = useTranslation();

  const DetailGrid = ({ items, columns }) => {
    const visible = items.filter((it) => it && it.show !== false);
    return (
      <div
        className={columns === 1 ? "sh-detail-grid sh-detail-grid-1col" : "sh-detail-grid"}
        style={columns ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined}
      >
        {visible.map((it, i) => (
          <div className="sh-detail-cell" key={`${it.label}-${i}`}>
            <div className="sh-detail-label">{it.label}</div>
            <div className="sh-detail-value">
              {it.value !== undefined &&
              it.value !== null &&
              it.value !== "" ? (
                it.value
              ) : (
                <span className="sh-detail-empty">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const [data, setData] = useState({
    reelerId: "",
    status: 0,
    feeAmount: "",
    licenseRenewalDate: "",
    licenseExpiryDate: "",
    mahajarDetails: "",
  });

  const [validated, setValidated] = useState(false);

  const { id } = useParams();
  // const [data] = useState(EducationDatas);
  const [reeler, setReeler] = useState({});
  const [loading, setLoading] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  // // const YourFormComponent = ({ data, handleDateChange }) => {
  // const handleRenewedDateChange = (date) => {
  //   // Calculate expiration date by adding 3 years to the renewed date
  //   const expirationDate = new Date(date);
  //   expirationDate.setFullYear(expirationDate.getFullYear() + 3);

  //   setData({
  //     ...data,
  //     licenseRenewalDate: date,
  //     licenseExpiryDate: expirationDate,
  //   });
  // };

   const handleRenewedDateChange = (date) => {
  if (!date) return;

  const licenseRenewalDate = new Date(date);
  let expiryYear;

  if (licenseRenewalDate.getMonth() + 1 >= 4) {
    // If April (4) or later → expiry = 31st March (year + 3)
    expiryYear = licenseRenewalDate.getFullYear() + 3;
  } else {
    // If Jan–Mar → expiry = 31st March (year + 2)
    expiryYear = licenseRenewalDate.getFullYear() + 2;
  }

  const expirationDate = new Date(expiryYear, 2, 31); // March is month=2 (0-indexed)

  setData({
    ...data,
    licenseRenewalDate,
    licenseExpiryDate: expirationDate,
  });
}; 

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const withReelerid = {
      ...data,
      reelerId: reeler.reelerId,
    };
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      api
        .post(baseURL2 + `reeler/update-reeler-license`, withReelerid)
        .then((response) => {
          if (response.data.content.reelerId) {
            const mahajarId = response.data.content.reelerId;
            handleMahajarUpload(mahajarId);
          }
          saveSuccess();
          setData({
            reelerId: "",
            status: 0,
            feeAmount: "",
            licenseRenewalDate: "",
            licenseExpiryDate: "",
          });
        })
        .catch((err) => {
          setData({});
          saveError();
        });
      setValidated(true);
    }
  };
const clear = () => {
  setData({
    reelerId: "",
    status: 0,
    feeAmount: "",
    licenseRenewalDate: "",
    licenseExpiryDate: "",
  })
}


  // Multi-document upload state
  const [documents, setDocuments] = useState([
    { id: 1, label: "Mahajar Details", file: null, fileName: "", uploaded: false },
  ]);

  const handleDocLabelChange = (id, value) => {
    setDocuments((prev) => prev.map((d) => d.id === id ? { ...d, label: value } : d));
  };

  const handleDocFileChange = (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDocuments((prev) => prev.map((d) => d.id === id ? { ...d, file, fileName: file.name, uploaded: false } : d));
  };

  const addDocumentRow = () => {
    setDocuments((prev) => [...prev, { id: Date.now(), label: "", file: null, fileName: "", uploaded: false }]);
  };

  const removeDocumentRow = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Upload all selected documents to S3
  const handleMahajarUpload = async (reelerid) => {
    for (const doc of documents) {
      if (!doc.file) continue;
      const parameters = `reelerId=${reelerid}`;
      try {
        const formData = new FormData();
        formData.append("multipartFile", doc.file);
        await api.post(baseURL + `reeler/upload-document?${parameters}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setDocuments((prev) => prev.map((d) => d.id === doc.id ? { ...d, uploaded: true } : d));
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  useEffect(() => {
    const first = documents[0];
    if (first?.fileName) {
      setData((prev) => ({ ...prev, mahajarDetails: first.fileName }));
    }
  }, [documents]);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("#");
    });
  };
  const saveError = (message) => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };

  const [isActive, setIsActive] = useState(false);
  const display = () => {
    const reelingLicenseNumber = fruitId.reelingLicenseNumber;
    const response = api
      .get(
        baseURL2 +
          `reeler/get-by-reeling-license-number/${reelingLicenseNumber}`
      )
      .then((response) => {
        setReeler(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setReeler({});
        setLoading(false);
      });
    setIsActive((current) => !current);
  };

  const [fruitId, setFruitId] = useState({
    reelingLicenseNumber: "",
  });

  const handleFruitIdInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setFruitId({ ...fruitId, [name]: value });
  };

  return (
    <Layout title="Renew Reeler License">
      <style>{renewReelerStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Renew Reeler License")}
              </Block.Title>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card className="sh-search-card">
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="8">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={4} className="sh-fruits-label">
                      {t("Reeling License Number")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          id="reelingLicenseNumber"
                          name="reelingLicenseNumber"
                          value={fruitId.reelingLicenseNumber}
                          onChange={handleFruitIdInputs}
                          type="text"
                          placeholder={t("Enter Reeling License Number")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("Reeling License Number is required")}
                        </Form.Control.Feedback>
                      </Col>
                      <Col sm={2}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={display}
                        >
                          <Icon name="search" className="me-1" />
                          {t("search")}
                        </Button>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className={isActive ? "" : "d-none"}>
              <Row className="g-gs">
                <Col lg="6">
                  <Card>
                    <Card.Header className="sh-section-header">
                      <Icon name="calendar" />
                      <span>{t("Renewal Details")}</span>
                    </Card.Header>
                    <Card.Body>
                      {/* <h3>Farmers Details</h3> */}
                      <Row className="g-gs">
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="Fee">
                            {t("Fee Amount")}<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="Fee"
                                name="feeAmount"
                                value={data.feeAmount}
                                onChange={handleInputs}
                                type="text"
                                placeholder={t("Enter Fee Amount")}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Fee Amount is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>

                          <Form.Group className="form-group">
                            <Form.Label>{t("Renewed Date")}</Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.licenseRenewalDate}
                                // onChange={(date) =>
                                //   handleDateChange(date, "licenseRenewalDate")
                                // }
                                onChange={(date) =>
                                  handleRenewedDateChange(date)
                                }
                                className="form-control"
                              />
                            </div>
                          </Form.Group>

                          <Form.Group className="form-group">
                            <Form.Label>{t("New License Expiration Date")}</Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.licenseExpiryDate}
                                onChange={(date) =>
                                  handleDateChange(date, "licenseExpiryDate")
                                }
                                className="form-control"
                                disabled={data.licenseRenewalDate !== null} // Disable if Renewed Date is selected
                                // onChange={(date) =>
                                //   handleDateChange(date, "licenseExpiryDate")
                                // }
                              />
                            </div>
                          </Form.Group>

                      {/* Multi-document upload section */}
                      <Form.Group className="form-group mt-3">
                        <Form.Label style={{ fontWeight: "600", color: "#1a3c6e", fontSize: "13px" }}>
                          {t("Upload Documents")} <small style={{ color: "#6b7280", fontWeight: "400" }}>(PDF / JPG / PNG / MP4 — Max 5MB each)</small>
                        </Form.Label>
                        <div style={{ border: "1px solid #dce8f5", borderRadius: "10px", overflow: "hidden", background: "#f8faff" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "0", background: "#e8f0fb", padding: "8px 12px", fontSize: "11.5px", fontWeight: "700", color: "#1a3c6e", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                            <span>Document Type</span>
                            <span>File</span>
                            <span></span>
                          </div>
                          {documents.map((doc, idx) => (
                            <div key={doc.id} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "8px", alignItems: "center", padding: "10px 12px", borderTop: idx > 0 ? "1px solid #dce8f5" : "none", background: "#fff" }}>
                              <Form.Control
                                type="text"
                                placeholder="e.g. Mahajar, Aadhaar…"
                                value={doc.label}
                                onChange={(e) => handleDocLabelChange(doc.id, e.target.value)}
                                style={{ fontSize: "12.5px", padding: "6px 10px", borderRadius: "6px", border: "1.5px solid #c9d8ec" }}
                              />
                              <div>
                                <Form.Control
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                                  onChange={(e) => handleDocFileChange(doc.id, e)}
                                  style={{ fontSize: "12px", padding: "4px 8px", borderRadius: "6px", border: "1.5px solid #c9d8ec" }}
                                />
                                {doc.fileName && (
                                  <div style={{ fontSize: "11px", color: doc.uploaded ? "#0d7a4f" : "#1a5fa8", marginTop: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
                                    {doc.uploaded ? "✔" : "📎"} {doc.fileName}
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeDocumentRow(doc.id)}
                                disabled={documents.length === 1}
                                style={{ background: "none", border: "none", color: documents.length === 1 ? "#ccc" : "#dc2626", fontSize: "16px", cursor: documents.length === 1 ? "default" : "pointer", padding: "2px 6px", lineHeight: 1 }}
                                title="Remove"
                              >✕</button>
                            </div>
                          ))}
                          <div style={{ padding: "8px 12px", borderTop: "1px solid #dce8f5", background: "#f8faff" }}>
                            <button
                              type="button"
                              onClick={addDocumentRow}
                              style={{ background: "none", border: "1.5px dashed #1a5fa8", color: "#1a5fa8", borderRadius: "6px", padding: "5px 14px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                            >
                              + Add Another Document
                            </button>
                          </div>
                        </div>
                      </Form.Group>
                            
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                  <div className="gap-col mt-4">
                    <ul className="d-flex align-items-center justify-content-center gap g-3">
                      <li>
                        {/* <Button
                          type="button"
                          variant="primary"
                          onClick={postData}
                        > */}
                        <Button type="submit" variant="primary" className="shadow-sm px-4 py-2">
                          <Icon name="check" className="me-1" />
                          {t("save")}
                        </Button>
                      </li>
                      <li>
                      <Button type="button" variant="secondary" className="sh-cancel-btn shadow-sm px-4 py-2" onClick={clear}>
                        <Icon name="cross" className="me-1" />
                        {t( "Clear")}
                  </Button>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col lg="6">
                  <Card>
                    <Card.Header className="sh-section-header">
                      <Icon name="award" />
                      <span>{t("Reeler License Details")}</span>
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="12">
                          <DetailGrid
                            columns={1}
                            items={[
                              {
                                label: t("Reeling License Number"),
                                value: reeler.reelingLicenseNumber,
                              },
                              { label: t("Reeler Name"), value: reeler.reelerName },
                              {
                                label: t("Father's/Husband's Name"),
                                value: reeler.fatherName,
                              },
                              {
                                label: t("License Expiry Date"),
                                value: reeler.licenseExpiryDate,
                              },
                              { label: t("address"), value: reeler.address },
                              {
                                label: t("Assign To Inspect"),
                                value: reeler.assignToInspectId,
                              },
                              {
                                label: t("GPS Coordinates of reeling unit"),
                                value:
                                  reeler.chakbandiLat || reeler.chakbandiLng
                                    ? `Latitude: ${reeler.chakbandiLat || ""}, Longitude: ${reeler.chakbandiLng || ""}`
                                    : "",
                              },
                              {
                                label: t("Representative/Agent name and Address"),
                                value: reeler.representativeNameAddress,
                              },
                              {
                                label: t("Machine Type is required"),
                                value: reeler.machineTypeName,
                              },
                              {
                                label: t("Date of Machine Installation"),
                                value: reeler.dateOfMachineInstallation,
                              },
                              {
                                label: t("Number of Basins/Charaka"),
                                value: reeler.numberOfBasins,
                              },
                              {
                                label: t("Electricity RR Numbers"),
                                value: reeler.electricityRrNumber,
                              },
                              {
                                label: t("Revenue Document (e-Khata / Reeling Unit)"),
                                value: reeler.revenueDocument,
                              },
                              { label: t("district"), value: reeler.districtName },
                              { label: t("taluk"), value: reeler.talukName },
                              { label: t("village"), value: reeler.villageName },
                              {
                                label: t("Mahajar/Inspection Date"),
                                value: reeler.inspectionDate,
                              },
                              { label: t("Receipt Date"), value: reeler.receiptDate },
                            ]}
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

const renewReelerStyles = `
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
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-form-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
    margin-bottom: 18px;
  }
  .sh-form-wrap .card-header {
    border-bottom: none !important;
  }
  .sh-form-wrap .card-body {
    padding: 20px !important;
  }
  .sh-form-wrap .form-label {
    font-size: 13px;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 6px;
    letter-spacing: 0.2px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 10px !important;
    border: 1.5px solid #d8e0ec !important;
    background-color: #fbfcfe !important;
    padding: 0.62rem 0.9rem !important;
    font-size: 13.5px;
    color: #2b3a55;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }
  .sh-form-wrap .form-control::placeholder {
    color: #a7b0c0;
    font-weight: 400;
  }
  .sh-form-wrap .form-control:hover:not(:disabled):not([readonly]),
  .sh-form-wrap .form-select:hover:not(:disabled) {
    border-color: #a9c4e0 !important;
    background-color: #ffffff !important;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #2b7ac0 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important;
    outline: none;
  }
  .sh-form-wrap .form-control[readonly],
  .sh-form-wrap .form-control:read-only,
  .sh-form-wrap .form-select:disabled {
    background-color: #f1f5fa !important;
    border-color: #e4e9f2 !important;
    color: #8a96a8 !important;
    cursor: not-allowed;
  }
  .sh-form-wrap .form-control.is-invalid,
  .sh-form-wrap .form-select.is-invalid {
    border-color: #e3496a !important;
    box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important;
  }
  .sh-form-wrap .text-danger {
    font-weight: 700;
    margin-left: 3px;
  }
  .sh-search-card {
    background: #ffffff !important;
    border: none !important;
    border-top: 4px solid #2b7ac0 !important;
  }
  .sh-fruits-label {
    font-weight: 700 !important;
    color: #1e67a8 !important;
    font-size: 14px !important;
    letter-spacing: 0.3px;
  }
  .sh-form-wrap .btn-primary {
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.3px;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .btn-primary:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    background: #ffffff;
    color: #e3496a;
    border: 1.5px solid #e3496a;
    border-radius: 8px;
    transition: background-color 0.15s ease, color 0.15s ease,
      transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-cancel-btn:hover:not(:disabled),
  .sh-cancel-btn:focus:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(227, 73, 106, 0.32);
  }
  .sh-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700 !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    color: #ffffff !important;
    padding: 14px 20px !important;
  }
  .sh-section-header svg,
  .sh-section-header .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 15px;
  }
  .sh-detail-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border: 1px solid #e6ecf4;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }
  .sh-detail-cell {
    display: grid;
    grid-template-columns: 42% 1fr;
    border-right: 1px solid #eef2f8;
    border-bottom: 1px solid #eef2f8;
    min-height: 40px;
  }
  .sh-detail-cell:nth-child(3n) {
    border-right: none;
  }
  .sh-detail-grid-1col .sh-detail-cell {
    border-right: none !important;
    grid-template-columns: 45% 1fr;
  }
  .sh-detail-label {
    background-color: #f7faff;
    color: #4a5568;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.1px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    border-right: 1px solid #eef2f8;
    line-height: 1.35;
  }
  .sh-detail-value {
    padding: 8px 12px;
    color: #2b3a55;
    font-size: 13.5px;
    display: flex;
    align-items: center;
    word-break: break-word;
    line-height: 1.4;
    transition: background-color 0.15s ease;
  }
  .sh-detail-cell:hover .sh-detail-value {
    background-color: #fbfdff;
  }
  .sh-detail-empty {
    color: #b0bac9;
    font-style: italic;
  }
  @media (max-width: 991px) {
    .sh-detail-grid:not(.sh-detail-grid-1col) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 575px) {
    .sh-detail-grid:not(.sh-detail-grid-1col) {
      grid-template-columns: 1fr;
    }
    .sh-detail-cell {
      grid-template-columns: 45% 1fr;
    }
  }
`;

export default RenewReelerLicense;
