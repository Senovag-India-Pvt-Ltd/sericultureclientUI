import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";
import { useTranslation } from "react-i18next";

// const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURL = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;

function SeedCuttingBank() {
  const { t } = useTranslation();
  const [data, setData] = useState({
    fruitsId: "",
    farmerName: "",
    quantityOfSeedCuttings: "",
    dateOfPruning: "",
    ratePerTonne: "",
    remittanceDetails: "",
    challanUpload: "",
  });

  const [validated, setValidated] = useState(false);
  const [searchValidated, setSearchValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "fruitsId" && (value.length < 16 || value.length > 16)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "fruitsId" && value.length === 16) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
  };
  // const handleDateChange = (newDate) => {
  //   setData({ ...data, applicationDate: newDate });
  // };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const formatDate = (date) => {
    if (!date) return ""; // Handle null or undefined dates
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0")
    );
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();

      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }
      // Format date fields
    const formattedSpunDate = formatDate(data.dateOfPruning);

    const payload = {
      ...data,
      dateOfPruning: formattedSpunDate,
    };
      api
        .post(baseURL2 + `seed-cutting/add-info`, payload)
        .then((response) => {
          if (response.data.seedCuttingBankId) {
            const seedUploadId = response.data.seedCuttingBankId;
            handleChallanUpload(seedUploadId);
          }
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.receiptNo);
            setData({
              fruitsId: "",
              farmerName: "",
              quantityOfSeedCuttings: "",
              dateOfPruning: "",
              ratePerTonne: "",
              remittanceDetails: "",
              challanUpload: "",
            });
            setChallan("");
            document.getElementById("challanUpload").value = "";
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      fruitsId: "",
      farmerName: "",
      quantityOfSeedCuttings: "",
      dateOfPruning: "",
      ratePerTonne: "",
      remittanceDetails: "",
      challanUpload: "",
    });
    setChallan("");
    document.getElementById("challanUpload").value = "";
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const search = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setSearchValidated(true);
    } else {
      event.preventDefault();
      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }
      api
        .post(
          baseURLFarmer +
            `farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number`,
          { fruitsId: data.fruitsId }
        )
        .then((response) => {
          console.log(response);
          if (!response.data.content.error) {
            if (response.data.content.farmerResponse) {
              const firstName = response.data.content.farmerResponse.firstName;
              const fatherName =
                response.data.content.farmerResponse.fatherName;
              setData((prev) => ({
                ...prev,
                farmerName: firstName,
                fatherName: fatherName,
              }));
            }
          } else {
            saveError(response.data.content.error_description);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        });
    }
  };

  // Display Image
  const [challan, setChallan] = useState("");
  // const [photoFile,setPhotoFile] = useState("")

  const handleChallanChange = (e) => {
    const file = e.target.files[0];
    setChallan(file);
    setData((prev) => ({ ...prev, challanUpload: file.name }));
    // setPhotoFile(file);
  };

  // Upload Image to S3 Bucket
  const handleChallanUpload = async (seedChallanid) => {
    const parameters = `seedCuttingBankId=${seedChallanid}`;
    try {
      const formData = new FormData();
      formData.append("multipartFile", challan);

      const response = await api.post(
        baseURL2 + `seed-cutting/upload-photo?${parameters}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File upload response:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: `Receipt Number ${message}`,
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
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title={t("Seed Cutting Bank")}>
      <style>{seedCuttingBankFormStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Seed Cutting Bank")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/seed-cutting-bank-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/seed-cutting-bank-list"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        {/* <Form action="#"> */}
        <Form noValidate validated={searchValidated} onSubmit={search}>
          <Card className="sh-section-card">
            <Card.Header className="sh-section-header">
              <Icon name="search" />
              <span>{t("Search Farmer")}</span>
            </Card.Header>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="12">
                  <Form.Group as={Row} className="form-group" controlId="fid">
                    <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                      {t("FRUITS ID")}<span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={4}>
                      <Form.Control
                        type="text"
                        name="fruitsId"
                        value={data.fruitsId}
                        onChange={handleInputs}
                        placeholder={t("Enter FRUITS ID")}
                        maxLength="16"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Fruits ID Should Contain 16 digits")}
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={2}>
                      <Button type="submit" variant="primary" className="sh-save-btn">
                        <Icon name="search" />
                        <span>{t("Search")}</span>
                      </Button>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>

        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1 ">
            <Block className="mt-3">
              <Card className="sh-section-card">
                <Card.Header className="sh-section-header">
                  <Icon name="package" />
                  <span>{t("Seed Cutting Bank")}</span>
                </Card.Header>
                <Card.Body>
                  {/* <h3>Farmers Details</h3> */}
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="plotNumber">
                          {t("Farmer Name")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerName"
                            name="farmerName"
                            value={data.farmerName}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Farmer Name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Farmer Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="plotNumber">
                          {t("Quantity Of Seed Cuttings")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="quantityOfSeedCuttings"
                            name="quantityOfSeedCuttings"
                            value={data.quantityOfSeedCuttings}
                            onChange={handleInputs}
                            type="text"
                            maxLength="5"
                            placeholder={t("Enter Quantity Of Seed Cuttings")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Quantity Of Seed Cuttings is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="ratePerTonne">
                          {t("Rate Per Tonne")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="ratePerTonne"
                            name="ratePerTonne"
                            value={data.ratePerTonne}
                            onChange={handleInputs}
                            type="text"
                            maxLength="4"
                            placeholder={t("Enter Rate Per Tonne")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Rate Per Tonne is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="ratePerTonne">
                          {t("Remittance Details")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="remittanceDetails"
                            name="remittanceDetails"
                            value={data.remittanceDetails}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Remittance Details")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Remittance Details is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="challanUpload">
                          {t("Challan Upload")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="file"
                            id="challanUpload"
                            name="challanUpload"
                            // value={data.photoPath}
                            onChange={handleChallanChange}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3 d-flex justify-content-center">
                        {challan ? (
                          <img
                            style={{ height: "100px", width: "100px" }}
                            src={URL.createObjectURL(challan)}
                          />
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Form.Label column sm={2}>
                      {t("Date Of Pruning")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={2}>
                      <div className="form-control-wrap">
                        <DatePicker
                          selected={data.dateOfPruning}
                          onChange={(date) =>
                            handleDateChange(date, "dateOfPruning")
                          }
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          required
                        />
                      </div>
                    </Col>

                    {/* <Col lg="2">
                  <Button type="button" onClick={postDataReceipt}>
                    View Invoice
                  </Button>
                </Col> */}
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <div className="gap-col sh-actions-bar">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary" className="sh-save-btn">
                    <Icon name="save" />
                    <span>{t("Save")}</span>
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                    <Icon name="cross" />
                    <span>{t("Cancel")}</span>
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

const seedCuttingBankFormStyles = `
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
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-section-card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
    margin-bottom: 18px;
  }
  .sh-section-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-bottom: none !important;
    padding: 14px 20px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    font-size: 15px !important;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
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
  .sh-form-wrap .card-body {
    padding: 20px !important;
  }
  .sh-form-wrap .form-label {
    font-weight: 600;
    color: #33475b;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1px solid #d9e2ec;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6;
    box-shadow: 0 0 0 3px rgba(59, 141, 214, 0.15);
  }
  .sh-actions-bar {
    margin-top: 8px;
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 22px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 22px;
    border-radius: 8px;
    font-weight: 600;
  }
`;

export default SeedCuttingBank;
