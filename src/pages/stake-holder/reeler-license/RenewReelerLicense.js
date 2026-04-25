import { Card, Form, Row, Col, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
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

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };
  return (
    <Layout title="Renew Reeler License">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Renew Reeler License")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="8">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={4}>
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
                        <Button type="submit" variant="primary">
                        {t("save")}
                        </Button>
                      </li>
                      <li>
                      <Button type="button" variant="secondary" onClick={clear}>
                      {t( "Clear")}
                  </Button>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col lg="6">
                  <Card>
                    <Card.Header>{t("Reeler License Details")}</Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="12">
                          <table className="table small table-bordered">
                            <tbody>
                              {/* <tr>
                                <td style={styles.ctstyle}>ID:</td>
                                <td>{ReelerLicense.mulberrySourceId}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> Source Of Mulberry:</td>
                                <td>{SourceOfMulberry.mulberrySourceName}</td>
                              </tr> */}
                              <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  {t("Reeling License Number")}
                                </td>
                                <td>{reeler.reelingLicenseNumber}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> {t("Reeler Name")}</td>
                                <td>{reeler.reelerName}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  {t("Father's/Husband's Name")}
                                </td>
                                <td>{reeler.fatherName}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  {t("License Expiry Date")}
                                </td>
                                <td>{reeler.licenseExpiryDate}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>{t("address")}</td>
                                <td>{reeler.address}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  {t("Assign To Inspect")}
                                </td>
                                <td>{reeler.assignToInspectId}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> {t("GPS Coordinates of reeling unit")}</td>
                                <td>
                                  Latitude:{reeler.chakbandiLat}, Longitude:
                                  {reeler.chakbandiLng}
                                </td>
                              </tr>
                              {/* <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  Mahajar Details:
                                </td>
                                <td>{reeler.mahajarDetails}</td>
                              </tr> */}
                              <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  {t("Representative/Agent name and Address")}
                                </td>
                                <td>{reeler.representativeNameAddress}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> {t("Machine Type is required")}</td>
                                <td>{reeler.machineTypeName}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>
                                {t("Date of Machine Installation")}
                                </td>
                                <td>{reeler.dateOfMachineInstallation}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>
                                {t("Number of Basins/Charaka")}
                                </td>
                                <td>{reeler.numberOfBasins}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>
                                {t("Electricity RR Numbers")}
                                </td>
                                <td>{reeler.electricityRrNumber}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>
                                {t("Revenue Document (e-Khata / Reeling Unit)")}
                                </td>
                                <td>{reeler.revenueDocument}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>{t("district")}</td>
                                <td>{reeler.districtName}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>{t("taluk")}</td>
                                <td>{reeler.talukName}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>{t("village")}</td>
                                <td>{reeler.villageName}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  {t("Mahajar/Inspection Date")}
                                </td>
                                <td>{reeler.inspectionDate}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>{t("Receipt Date")}</td>
                                <td>{reeler.receiptDate}</td>
                              </tr>
                            </tbody>
                          </table>
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

export default RenewReelerLicense;
