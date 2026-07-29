import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";
// import "react-datepicker/dist/react-datepicker.css";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

import { Link, useParams } from "react-router-dom";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function MaintenanceandSaleofNurserytoFarmersEdit() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

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

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  // const formatDate = (date) => {
  //   if (!date) return ""; // Handle null or undefined dates
  //   return (
  //     date.getFullYear() +
  //     "-" +
  //     (date.getMonth() + 1).toString().padStart(2, "0") +
  //     "-" +
  //     date.getDate().toString().padStart(2, "0")
  //   );
  // };

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
    // const formattedSpunDate = formatDate(data.date);
    // const formattedDateOfSupply = formatDate(data.dateOfPlanting);
    // // const formattedDateOfDispatch = formatDate(data.dispatchDate);

    // const payload = {
    //   ...data,
    //   date: formattedSpunDate,
    //   dateOfPlanting: formattedDateOfSupply,
    //   // dispatchDate: formattedDateOfDispatch,
    // };
      api
        .post(baseURL + `Maintenance-sale/update-info`, data)
        .then((response) => {
          const mainAndSaleOfNurseryId = response.data.mainAndSaleOfNurseryId;
          if (mainAndSaleOfNurseryId) {
            handleChallanUpload(mainAndSaleOfNurseryId);
          }
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              fruitsId: "",
              farmerName: "",
              mulberryVarietyId: "",
              area: "",
              dateOfPlanting: "",
              nurserySaleDetails: "",
              quantity: "",
              date: "",
              rate: "",
              saplingAge: "",
              remittanceDetails: "",
              challanUploadKey: "",
            });
            setChallanFile("");
            document.getElementById("challanUploadKey").value = "";
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      fruitsId: "",
      farmerName: "",
      mulberryVarietyId: "",
      area: "",
      dateOfPlanting: "",
      nurserySaleDetails: "",
      quantity: "",
      date: "",
      rate: "",
      saplingAge: "",
      remittanceDetails: "",
      challanUploadKey: "",
    });
    setChallanFile("");
    document.getElementById("challanUploadKey").value = "";
  };

  const isDataPlantingSet = !!data.dateOfPlanting;
  const isDataDateSet = !!data.date;
  
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `Maintenance-sale/get-info-by-id/${id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
        if (response.data.challanUploadKey) {
          getChallanFile(response.data.challanUploadKey);
        }
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        // editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);

  // to get Mulberry Variety
  const [varietyListData, setVarietyListData] = useState([]);

  const getVarietyList = () => {
    const response = api
      .get(baseURL2 + `mulberry-variety/get-all`)
      .then((response) => {
        setVarietyListData(response.data.content.mulberryVariety);
      })
      .catch((err) => {
        setVarietyListData([]);
      });
  };

  useEffect(() => {
    getVarietyList();
  }, []);

   // Display Image
   const [challan, setChallan] = useState("");
   // const [photoFile,setPhotoFile] = useState("")
 
   const handleChallanChange = (e) => {
     const file = e.target.files[0];
     setChallan(file);
     setData((prev) => ({ ...prev, challanUploadKey: file.name }));
     // setPhotoFile(file);
   };
 
   // Upload Image to S3 Bucket
   const handleChallanUpload = async (nurseryFarmerid) => {
     const parameters = `mainAndSaleOfNurseryId=${nurseryFarmerid}`;
     try {
       const formData = new FormData();
       formData.append("multipartFile", challan);
 
       const response = await api.post(
         baseURL + `Maintenance-sale/upload-photo?${parameters}`,
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
 
   // To get Photo from S3 Bucket
   const [selectedChallanFile, setChallanFile] = useState(null);
 
   const getChallanFile = async (file) => {
     const parameters = `fileName=${file}`;
     try {
       const response = await api.get(
         baseURL + `v1/api/s3/download?${parameters}`,
         {
           responseType: "arraybuffer",
         }
       );
       const blob = new Blob([response.data]);
       const url = URL.createObjectURL(blob);
       setChallanFile(url);
     } catch (error) {
       console.error("Error fetching file:", error);
     }
   };

  const navigate = useNavigate();
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: t("Updated successfully"),
      // text: "You clicked the button!",
    });
  };
  const updateError = (message) => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: t("Attempt was not successful"),
      html: errorMessage,
    });
  };
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: t("Something went wrong!"),
    }).then(() => navigate("#"));
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  return (
    <Layout title={t("Edit Maintenance and Sale of Nursery to Farmers")}>
      <style>{editMaintenanceSaleNurseryStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Edit Maintenance and Sale of Nursery to Farmers")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/maintenance-and-sale-of-nursery-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/maintenance-and-sale-of-nursery-list"
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
          <Row className="g-1 ">
            <Card className="sh-section-card">
              <Card.Header className="sh-section-header">
                <Icon name="search" />
                <span>{t("FRUITS ID")}</span>
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
                          type="fruitsId"
                          name="fruitsId"
                          value={data.fruitsId}
                          onChange={handleInputs}
                          placeholder={t("Enter FRUITS ID")}
                          required
                          maxLength= "16"
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Fruits ID Should Contain 16 digits")}
                        </Form.Control.Feedback>
                      </Col>
                      {/* <Col sm={2}>
                        <Button
                          type="button"
                          variant="primary"
                          // onClick={display}
                        >
                          Search
                        </Button>
                      </Col> */}
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

        <Block className="mt-3">
          {/* <Row className="g-3 "> */}
            <Card className="sh-section-card">
              <Card.Header className="sh-section-header">
                <Icon name="package" />
                <span>{t("Maintenance and Sale of Nursery to Farmers")}</span>
              </Card.Header>
                      <Card.Body>
                      {loading ? (
                        <h1 className="d-flex justify-content-center align-items-center">
                          {t("Loading...")}
                        </h1>
                      ) : (
                        <Row className="g-gs">
                       

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("Farmer Name")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="farmerName"
                                  name="farmerName"
                                  type="text"
                                  value={data.farmerName}
                                  onChange={handleInputs}
                                  placeholder={t("Enter Farmer’s name")}
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                  {t("Farmer Name is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Mulberry Variety")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="mulberryVarietyId"
                        value={data.mulberryVarietyId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        // multiple
                        required
                        isInvalid={
                          data.mulberryVarietyId === undefined || data.mulberryVarietyId === "0"
                        }
                      >
                        <option value="">{t("Select Mulberry Variety")}</option>
                        {varietyListData.map((list) => (
                          <option
                            key={list.mulberryVarietyId}
                            value={list.mulberryVarietyId}
                          >
                            {list.mulberryVarietyName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("Mulberry Variety is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">{t("Area")}<span className="text-danger">*</span></Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="area"
                                  name="area"
                                  value={data.area}
                                  onChange={handleInputs}
                                  type="text"
                                  // maxLength="4"
                                  placeholder={t("Enter Area")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                {t("Area is required")}
                              </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>                

                            {/* <Col lg="4">
                              <Form.Group className="form-group mt-n4">
                                <Form.Label htmlFor="sordfl">
                                  Nursery sale details
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="nurserySaleDetails"
                                    name="nurserySaleDetails"
                                    type="text"
                                    value={data.nurserySaleDetails}
                                    onChange={handleInputs}
                                    placeholder="Enter Nursery sale details"
                                  />
                                </div>
                              </Form.Group>
                            </Col> */}

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">{t("Quantity(No Of Saplings)")}<span className="text-danger">*</span></Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="quantity"
                                  name="quantity"
                                  value={data.quantity}
                                  onChange={handleInputs}
                                  type="text"
                                  maxLength="5"
                                  placeholder={t("Enter Quantity(No Of Saplings)")}
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                 {t("Quantity(No Of Saplings) is required")}
                              </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">{t("Rate")}<span className="text-danger">*</span></Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="rate"
                                  name="rate"
                                  value={data.rate}
                                  onChange={handleInputs}
                                  type="text"
                                  // maxLength="3"
                                  placeholder={t("Enter Rate")}
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                 {t("Rate is required")}
                              </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("Sapling age in Month/Year")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="saplingAge"
                                  name="saplingAge"
                                  value={data.saplingAge}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Enter Sapling age in Month/Year")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                 {t("Sapling age in Month/Year is required")}
                              </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          {/* <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Generate Recipt
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="generateRecipt"
                                  name="generateRecipt"
                                  type="text"
                                  value={data.generateRecipt}
                                  onChange={handleInputs}
                                  placeholder="Generate Recipt"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Receipt number
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="receiptNumber"
                                  name="receiptNumber"
                                  type="text"
                                  value={data.receiptNumber}
                                  onChange={handleInputs}
                                  placeholder="Enter Receipt number"
                                />
                              </div>
                            </Form.Group>
                          </Col> */}

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("Remittance details")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="remittanceDetails"
                                  name="remittanceDetails"
                                  type="text"
                                  value={data.remittanceDetails}
                                  onChange={handleInputs}
                                  placeholder={t("Enter Remittance details")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                {t("Remittance details is required")}
                              </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                       

                          <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("Date of planting")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                              {isDataPlantingSet && (
                                <DatePicker
                                  selected={new Date(data.dateOfPlanting)}
                                  onChange={(date) =>
                                    handleDateChange(date, "dateOfPlanting")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  required
                                />
                                )}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">{t("Sale Date")}<span className="text-danger">*</span></Form.Label>
                              <div className="form-control-wrap">
                              {isDataDateSet && (
                                <DatePicker
                                  selected={new Date(data.date)}
                                  onChange={(date) =>
                                    handleDateChange(date, "date")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  required
                                />
                              )}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="challanUploadKey">
                        {t("Upload Challan")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          type="file"
                          id="challanUploadKey"
                          name="challanUploadKey"
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
                          selectedChallanFile && (
                            <img
                              style={{ height: "100px", width: "100px" }}
                              src={selectedChallanFile}
                              alt="Selected File"
                            />
                          )
                        )}
                    </Form.Group>
                  </Col>

                          </Row>
                          )}
                          </Card.Body>
                      </Card>
                    </Block>

                  <div className="gap-col sh-actions-bar">
                <ul className="d-flex align-items-center justify-content-center gap g-3">
                  <li>
                    {/* <Button type="button" variant="primary" onClick={postData}> */}
                    <Button type="submit" variant="primary" className="sh-save-btn">
                      <Icon name="save" />
                      <span>{t("Update")}</span>
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

const editMaintenanceSaleNurseryStyles = `
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

export default MaintenanceandSaleofNurserytoFarmersEdit;
