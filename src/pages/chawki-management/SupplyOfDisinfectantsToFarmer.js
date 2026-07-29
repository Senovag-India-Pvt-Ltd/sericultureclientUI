import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../components";
import { useTranslation } from "react-i18next";

import api from "../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;


function SupplyOfDisinfectantsToFarmers() {
  const { t } = useTranslation();
  const [data, setData] = useState({
    farmerId: "",
    disinfectantMasterId: "",
    invoiceNoDate: "",
    quantity: "",
    disinfectantName: "",
    quantitySupplied: "",
    suppliedDate: "",
    sizeOfRearingHouse: "",
    numbersOfDfls: "",
  });

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "8%", // Reduced from 20% to 10%
    },
  };
  

  const [validated, setValidated] = useState(false);
  const [searchValidated, setSearchValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

  };

  const handleFruitsInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setFarmerDetails({ ...farmerDetails, [name]: value });

  };

  const [farmerDetails, setFarmerDetails] = useState({
    fruitsId: "",
    farmerName: "",
    fatherName: "",
    villageName: "",
    address: "",
  });

  const [showFarmerDetails, setShowFarmerDetails] = useState(false);

  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
       
    const requestData = {
        ...data,
        farmerId: farmerDetails.farmerId, // Use farmerId from farmerDetails
      };
      api
        .post(baseURL + `cropInspection/add-supply-of-disinfectants-info`, requestData)
        .then((response) => {
          // debugger;
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data);
            clear();
            // setData({
            //   farmerId: "",
            //     disinfectantMasterId: "",
            //     invoiceNoDate: "",
            //     quantity: "",
            //     disinfectantName: "",
            //     quantitySupplied: "",
            //     suppliedDate: "",
            //     sizeOfRearingHouse: "",
            //     numbersOfDfls: "",
            // });
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
      farmerId: "",
    disinfectantMasterId: "",
    invoiceNoDate: "",
    quantity: "",
    disinfectantName: "",
    quantitySupplied: "",
    suppliedDate: "",
    sizeOfRearingHouse: "",
    numbersOfDfls: "",
    });
    setFarmerDetails({
      fruitsId: "",
    farmerName: "",
    fatherName: "",
    villageName: "",
    address: "",
    })
    setShowFarmerDetails(false);
  };

  const search = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setSearchValidated(true);
    } else {
        event.preventDefault();

        api
            .post(baseURLFarmer + `farmer-details/getInspectionFarmerDetailsByFruitsId`, { fruitsId: farmerDetails.fruitsId })
            .then((response) => {
                console.log(response);
                if (!response.data.errorMessages || response.data.errorMessages.length === 0) {
                    // Accessing the farmer details from the correct structure
                    const farmerResponses = response.data.content[0].farmerResponses;
                    
                    // Check if farmerResponses is empty
                    if (!farmerResponses || farmerResponses.length === 0) {
                        searchError("Farmer not found. Please set one of the addresses as default during registration.");
                        return; // Exit the function if no farmers are found
                    }
                    
                    const farmerData = farmerResponses[0]; // Accessing the first farmer response

                    // Setting farmer details
                    setFarmerDetails((prev) => ({
                        ...prev,
                        fruitsId: farmerData.fruitsId,
                        farmerId: farmerData.farmerId, // Store farmerId in farmerDetails
                        farmerName: farmerData.fullName || "",
                        fatherName: farmerData.fatherName || "",
                        address: farmerData.address || "",
                        villageName: farmerData.villageName || "",
                    }));

                    setShowFarmerDetails(true);
                } else {
                    saveError(response.data.errorMessages.join(", "));
                }
            })
            .catch((err) => {
                console.error("Error fetching farmer details:", err);
                if (err.response && err.response.data.validationErrors) {
                    if (Object.keys(err.response.data.validationErrors).length > 0) {
                        searchError(err.response.data.validationErrors);
                    }
                } else {
                    searchError("An unexpected error occurred.");
                }
            });
    }
};

const searchError = (message = "Something went wrong!") => {
  let errorMessage;
  if (typeof message === "object") {
    errorMessage = Object.values(message).join("<br>");
  } else {
    errorMessage = message;
  }
  Swal.fire({
    icon: "error",
    title: "Details not Found",
    html: errorMessage,
  });
};

  
  

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // to get Race
  const [disInfectantListData, setDisinfectantListData] = useState([]);

  const getDisinfectantMasterList = () => {
    const response = api
      .get(baseURL2 + `disinfectantMaster/get-all`)
      .then((response) => {
        setDisinfectantListData(response.data.content.disinfectantMaster);
      })
      .catch((err) => {
        setDisinfectantListData([]);
      });
  };

  useEffect(() => {
    getDisinfectantMasterList();
  }, []);

  
  // const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
    //   text: `Receipt Number ${message}`,
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
    <Layout title={t("Supply Of Disinfectants")}>
      <style>{supplyOfDisinfectantsStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Supply Of Disinfectants")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/supply-of-disinfectants-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/supply-of-disinfectants-list"
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
          <Card className="sh-search-card">
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
                        value={farmerDetails.fruitsId}
                        onChange={handleFruitsInputs}
                        placeholder={t("Enter FRUITS ID")}
                        required
                        maxLength="16"
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Fruits ID Should Contain 16 digits")}
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={2}>
                      <Button type="submit" variant="primary" className="d-inline-flex align-items-center gap-1">
                        <Icon name="search" />
                        {t("Search")}
                      </Button>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              {showFarmerDetails && (
                // <Col lg="12" className="mt-1">
                //   <Card>
                //     <Card.Header>Farmer Personal Info</Card.Header>
                //     <Card.Body>
                <Row className="g-gs mt-1">
                  <Col lg="12">
                    <table className="table small table-bordered">
                      <tbody>
                        <tr>
                          <td style={styles.ctstyle}>{t("Farmer Name")}:</td>
                          <td>{farmerDetails.farmerName}</td>
                          <td style={styles.ctstyle}>{t("Fruits Id")}:</td>
                          <td>{farmerDetails.fruitsId}</td>
                          <td style={styles.ctstyle}>{t("Father Name")}:</td>
                          <td>{farmerDetails.fatherName}</td>
                          <td style={styles.ctstyle}>{t("Village")}:</td>
                          <td>{farmerDetails.villageName}</td>
                          <td style={styles.ctstyle}>{t("Address")}:</td>
                          <td>{farmerDetails.address}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>
              )}
           
            </Card.Body>
          </Card>
        </Form>
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1 ">
            <Block className="mt-3">
              <Card>
                <Card.Header className="sh-section-header">
                  <Icon name="package" />
                  <span>{t("Supply Of Disinfectants Details")}</span>
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    
                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Disinfectant")}<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="disinfectantMasterId"
                              value={data.disinfectantMasterId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">{t("Select Disinfectant")}</option>
                              {disInfectantListData.map((list) => (
                                <option
                                  key={list.disinfectantMasterId}
                                  value={list.disinfectantMasterId}
                                >
                                  {list.disinfectantMasterName}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                            {t("Disinfectant is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Invoice No and Date")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="invoiceNoDate"
                            name="invoiceNoDate"
                            value={data.invoiceNoDate}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Invoice No and Date")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Invoice No and Date is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Quantity")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="quantity"
                            name="quantity"
                            value={data.quantity}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Quantity")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Quantity is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Quantity Supplied")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="quantitySupplied"
                            name="quantitySupplied"
                            value={data.quantitySupplied}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Quantity Supplied")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Quantity Supplied is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                   
                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                        {t("Disinfectant Name")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="disinfectantName"
                            value={data.disinfectantName}
                            onChange={handleInputs}
                          >
                            <option value="">{t("Select")}</option>
                            <option value="General">{t("General")}</option>
                            <option value="Bed">{t("Bed")}</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          {t("Disinfectant Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Number of DFL’s")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numbersOfDfls"
                            name="numbersOfDfls"
                            value={data.numbersOfDfls}
                            onChange={handleInputs}
                            type="text"
                            // maxLength="4"
                            placeholder={t("Number of DFL’s")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Number of DFL’s is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Size Of Rearing House")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="sizeOfRearingHouse"
                            name="sizeOfRearingHouse"
                            value={data.sizeOfRearingHouse}
                            onChange={handleInputs}
                            type="text"
                            // maxLength="4"
                            placeholder={t("Size Of Rearing House")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Size Of Rearing House is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    
                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                           {t("Date Of Supply")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.suppliedDate}
                            onChange={(date) =>
                              handleDateChange(date, "suppliedDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            // minDate={new Date()}
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <div className="gap-col">
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

const supplyOfDisinfectantsStyles = `
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
  .sh-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700 !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-left: none !important;
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
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    color: #e3496a;
    border: 1.5px solid #e3496a;
    border-radius: 8px;
    font-weight: 600;
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
`;

export default SupplyOfDisinfectantsToFarmers;
