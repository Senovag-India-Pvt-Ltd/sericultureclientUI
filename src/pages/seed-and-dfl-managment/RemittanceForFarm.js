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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;


function RemittanceForFarm() {
  const [data, setData] = useState({
    lotNumber: "",
    raceId: "",
    numberOfDFLs: "",
    totalAmount: "",
    billNumber: "",
    bankChallanNumber: "",
    bankChallanUpload: "",
    rtc25: "",
    numberOfCocoons: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
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
      // event.stopPropagation();
      const formattedDate = formatDate(data.date);

    const payload = {
      ...data,
      date: formattedDate,
    };

      api
        .post(baseURLSeedDfl + `RemittanceOfEggForFarm/add-info`, payload)
        .then((response) => {
          // if (response.data.receiptOfDflsId) {
          //   const receiptId = response.data.receiptOfDflsId;
          //   handleReceiptUpload(receiptId);
          // }
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({
              lotNumber: "",
              raceId: "",
              numberOfDFLs: "",
              totalAmount: "",
              billNumber: "",
              bankChallanNumber: "",
              bankChallanUpload: "",
              rtc25: "",
              date: "",
              numberOfCocoons: "",
            });
            // setReceiptUpload("")
            // document.getElementById("viewReceipt").value = "";
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
      lotNumber: "",
      raceId: "",
      numberOfDFLs: "",
      totalAmount: "",
      billNumber: "",
      bankChallanNumber: "",
      bankChallanUpload: "",
      rtc25: "",
      date: "",
      numberOfCocoons: "",
    });
    // setReceiptUpload("")
    // document.getElementById("viewReceipt").value = "";
  };

  // to get Lot
  const [lotListData, setLotListData] = useState([]);

  const getLotList = () => {
    api
      .get(baseURLSeedDfl + `EggPreparation/get-all-lot-number-list`)
      .then((response) => {
        setLotListData(response.data);
      })
      .catch((err) => {
        setLotListData([]);
      });
  };

  useEffect(() => {
    getLotList();
  }, []);

 
  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
    const response = api
      .get(baseURL + `raceMaster/get-all`)
      .then((response) => {
        setRaceListData(response.data.content.raceMaster);
      })
      .catch((err) => {
        setRaceListData([]);
      });
  };

  useEffect(() => {
    getRaceList();
  }, []);

  
 

  // Display Image
  const [receiptUpload, setReceiptUpload] = useState("");
 
  const handleUploadChange = (e) => {
    const file = e.target.files[0];
    setReceiptUpload(file);
    setData((prev) => ({ ...prev, viewReceipt: file.name }));
  };

  // Upload Image to S3 Bucket
  const handleReceiptUpload = async (receiptid) => {
    const parameters = `receiptOfDflsId=${receiptid}`;
    try {
      const formData = new FormData();
      formData.append("multipartFile", receiptUpload);

      const response = await api.post(
        baseURLSeedDfl + `RemittaneOfEgg/upload-reciept?${parameters}`,
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

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };


  const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: message,
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

  const { t } = useTranslation();

  return (
    <Layout title={t("Remittance(Eggs/PC/Others)")}>
      <style>{remittanceForFarmFormStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Remittance(Eggs/PC/Others)")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/remittance-for-farm-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/remittance-for-farm-list"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          {/* <Row className="g-3 "> */}
          <Card>
            <Card.Header className="sh-section-header">
              <Icon name="wallet" />
              <span>{t("Remittance(Eggs/PC/Others)")}</span>
            </Card.Header>
            <Card.Body>
              {/* <h3>Farmers Details</h3> */}
              <Row className="g-gs">
              <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="plotNumber">
                      {t("Lot Number")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="lotNumber"
                        name="lotNumber"
                        value={data.lotNumber}
                        onChange={handleInputs}
                        // maxLength="12"
                        type="text"
                        placeholder={t("Enter Lot Number")}
                        // required
                      />
                      {/* <Form.Control.Feedback type="invalid">
                        Lot Number is required
                      </Form.Control.Feedback> */}
                    </div>
                  </Form.Group>
                </Col>

                {/* <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                    Lot Number<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="lotNumber"
                          value={data.lotNumber}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                        >
                          <option value="">Select Lot Number</option>
                          {lotListData && lotListData.length?(lotListData.map((list) => (
                            <option
                              key={list.id}
                              value={list.lotNumber}
                            >
                              {list.lotNumber}
                            </option>
                          ))):""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        Lot Number is required
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col> */}
                
                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Race")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="raceId"
                          value={data.raceId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          // required
                        >
                          <option value="">{t("Select Race")}</option>
                          {raceListData.map((list) => (
                            <option
                              key={list.raceMasterId}
                              value={list.raceMasterId}
                            >
                              {list.raceMasterName}
                            </option>
                          ))}
                        </Form.Select>
                        {/* <Form.Control.Feedback type="invalid">
                          Race is required
                        </Form.Control.Feedback> */}
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="numberOfDFLsReceived">
                      {t("Number Of DFLs")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="numberOfDFLs"
                        name="numberOfDFLs"
                        value={data.numberOfDFLs}
                        onChange={handleInputs}
                        // maxLength="4"
                        type="number"
                        placeholder={t("Enter Number Of DFLs")}
                        // required
                      />
                      {/* <Form.Control.Feedback type="invalid">
                        Number Of DFLs is required
                      </Form.Control.Feedback> */}
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="numberOfDFLsReceived">
                      {t("Number Of Cocoons in Kgs/grams")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="numberOfCocoons"
                        name="numberOfCocoons"
                        value={data.numberOfCocoons}
                        onChange={handleInputs}
                        // maxLength="4"
                        type="text"
                        placeholder={t("Enter Number Of Cocoons")}
                        // required
                      />
                      {/* <Form.Control.Feedback type="invalid">
                        Number Of DFLs is required
                      </Form.Control.Feedback> */}
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      {t("Total Amount")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="totalAmount"
                        name="totalAmount"
                        value={data.totalAmount}
                        onChange={handleInputs}
                        type="number"
                        placeholder={t("Enter Total Amount")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      {t("Total Amount is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      {t("Bill Number")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="billNumber"
                        name="billNumber"
                        value={data.billNumber}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Bill Number")}
                        // required
                      />
                      {/* <Form.Control.Feedback type="invalid">
                      Bill Number is required
                      </Form.Control.Feedback> */}
                    </div>
                  </Form.Group>
                </Col>

                {/* <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      {t("KTC 25")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="rtc25"
                        name="rtc25"
                        value={data.rtc25}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter KTC 25")}
                        // required
                      />
                    
                    </div>
                  </Form.Group>
                </Col> */}

                

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      {t("Bank Challan Number")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="bankChallanNumber"
                        name="bankChallanNumber"
                        value={data.bankChallanNumber}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Bank Challan Number")}
                        // required
                      />
                      {/* <Form.Control.Feedback type="invalid">
                      Bank Challan Number is required
                      </Form.Control.Feedback> */}
                    </div>
                  </Form.Group>
                </Col>

               

                <Col lg="2">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      {t("Date")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.date}
                        onChange={(date) =>
                          handleDateChange(date, "date")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        // maxDate={new Date()}
                        className="form-control"
                        required
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="gap-col">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                {/* <Button type="button" variant="primary" onClick={postData}> */}
                <Button type="submit" variant="primary" className="shadow-sm px-4 py-2">
                  <Icon name="check" className="me-1" />
                  {t("Save")}
                </Button>
              </li>
              <li>
                <Button type="button" variant="secondary" className="sh-cancel-btn shadow-sm px-4 py-2" onClick={clear}>
                  <Icon name="cross" className="me-1" />
                  {t("Cancel")}
                </Button>
              </li>
            </ul>
          </div>
          {/* </Row> */}
        </Form>
      </Block>
    </Layout>
  );
}
const remittanceForFarmFormStyles = `
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
`;

export default RemittanceForFarm;
