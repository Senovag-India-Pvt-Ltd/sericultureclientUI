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

function Preservationofseedcocoonforprocessing() {
  const { t } = useTranslation();

  const [data, setData] = useState({
    lotNumber: "",
    raceId: "",
    dateOfSeedCocoonSupply: "",
    nameOfTheGovernmentSeedFarmOrFarmer: "",
    spunOnDate: "",
    cropNumber: "",
    lineNameId: "",
    bedNumberOrKgsOfCocoonsSupplied: "",
    numberOfPupaExamined: "",
    cocoonRejectionDetails: "",
    invoiceNo: "",
    invoiceDate: "",
    ratePerKg: "",
    farmId: "",
    marketMasterId: "",
    parentLotNumber: "",
    cacoonSuppliedNumbers: "",
    spunOnToDate: "",
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const [validated, setValidated] = useState(false);

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

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
       const formattedReleaseDate = formatDate(data.dateOfSeedCocoonSupply);
    const formattedDateOfDisposal = formatDate(data.spunOnDate);
    const formattedExpectedDateOfHatching = formatDate(data.invoiceDate);
    const formattedSpunOnToDate = formatDate(data.spunOnToDate);
    const payload = {
      ...data,
      dateOfSeedCocoonSupply: formattedReleaseDate,
      spunOnDate: formattedDateOfDisposal,
      invoiceDate: formattedExpectedDateOfHatching,
      spunOnToDate: formattedSpunOnToDate,
    };
      api
        .post(baseURLSeedDfl + `PreservationOfSeed/add-info`, payload)
        .then((response) => {
          // if (response.data.receiptOfDflsId) {
          //   const receiptId = response.data.receiptOfDflsId;
          //   handleReceiptUpload(receiptId);
          // }
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.invoiceNo);
            setData({
              lotNumber: "",
              raceId: "",
              dateOfSeedCocoonSupply: "",
              nameOfTheGovernmentSeedFarmOrFarmer: "",
              spunOnDate: "",
              cropNumber: "",
              lineNameId: "",
              bedNumberOrKgsOfCocoonsSupplied: "",
              numberOfPupaExamined: "",
              cocoonRejectionDetails: "",
              invoiceNo: "",
              invoiceDate: "",
              ratePerKg: "",
              farmId: "",
              marketMasterId: "", 
              parentLotNumber: "",
              cacoonSuppliedNumbers: "",
              spunOnToDate: "",         
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
      dateOfSeedCocoonSupply: "",
      nameOfTheGovernmentSeedFarmOrFarmer: "",
      spunOnDate: "",
      cropNumber: "",
      lineNameId: "",
      bedNumberOrKgsOfCocoonsSupplied: "",
      numberOfPupaExamined: "",
      cocoonRejectionDetails: "",
      invoiceNo: "",
      invoiceDate: "",
      ratePerKg: "",
      farmId: "",
      marketMasterId: "",
      parentLotNumber: "",  
      cacoonSuppliedNumbers: "",
      spunOnToDate: "",
    })
  }

  // to get Lot
  const [lotParentListData, setParentLotListData] = useState([]);

  const getParentLotList = () => {
    const response = api
      .get(baseURLSeedDfl + `PreservationOfSeed/get-all-parent-lot-number-list`)
      .then((response) => {
        setLotListData(response.data);
      })
      .catch((err) => {
        setLotListData([]);
      });
  };

  useEffect(() => {
    getParentLotList();
  }, []);


  // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = () => {
    const response = api
      .get(baseURL + `marketMaster/get-all`)
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketListData([]);
      });
  };

  useEffect(() => {
    getMarketList();
  }, []);


// to get Lot
const [lineNameListData, setLineNameListData] = useState([]);

const getLineNameLotList = () => {
  api
    .get(baseURL+ `lineNameMaster/get-all`)
    .then((response) => {
      setLineNameListData(response.data.content.lineNameMaster);
    })
    .catch((err) => {
      setLineNameListData([]);
    });
};

useEffect(() => {
  getLineNameLotList();
}, []);

  // to get Lot
  const [lotListData, setLotListData] = useState([]);

  const getLotList = () => {
    api
      .get(baseURLSeedDfl + `ReceiptOfDflsFromP4GrainageLinesController/get-all-lot-number-list`)
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
   
    // to get farm
  const [farmListData, setFarmListData] = useState([]);

  const getFarmList = () => {
    api
      .get(baseURL + `farmMaster/get-all`)
      .then((response) => {
        setFarmListData(response.data.content.farmMaster);
      })
      .catch((err) => {
        setFarmListData([]);
      });
  };

  useEffect(() => {
    getFarmList();
  }, []);
    
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
 


  return (
    <Layout title={t("Preservation of seed Cocoon for processing")}>
      <style>{preservationSeedCocoonFormStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Preservation of seed Cocoon for processing")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/preservation-of-seed-cocoon-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/preservation-of-seed-cocoon-list"
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
          <Card className="sh-section-card">
            <Card.Header className="sh-section-header">
              <Icon name="archive" />
              <span>{t("Preservation of seed Cocoon for processing")}</span>
            </Card.Header>
            <Card.Body>
              {/* <h3>Farmers Details</h3> */}
              <Row className="g-gs">
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
                    <Form.Label htmlFor="invoiceDetails">
                      {t("Lot Number")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="lotNumber"
                        name="lotNumber"
                        value={data.lotNumber}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Lot Number")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                {/* <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                     Parent Lot Number
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="parentLotNumber"
                          value={data.parentLotNumber}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          // required
                        >
                          <option value="">Select Lot Number</option>
                          {lotListData && lotListData.length?(lotListData.map((list) => (
                            <option key={list.id} value={list.parentLotNumber}>
                              {list.parentLotNumber}
                            </option>
                          ))): ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        Parent Lot Number is required
                      </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col> */}

                <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            {t("Farm")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="farmId"
                              value={data.farmId}
                              onChange={handleInputs}
                            >
                              <option value="">{t("Select Farm")}</option>
                              {farmListData.map((list) => (
                                <option
                                  key={list.farmId}
                                  value={list.userMasterId}
                                >
                                  {list.farmName}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {t("Farm is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        {t("Market")}
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="marketMasterId"
                            value={data.marketMasterId}
                            onChange={handleInputs}
                          >
                            <option value="">{t("Select Market")}</option>
                            {marketListData.map((list) => (
                              <option
                                key={list.marketMasterId}
                                value={list.marketMasterId}
                              >
                                {list.marketMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("Market is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                
                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Race")}<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="raceId"
                          value={data.raceId}
                          onChange={handleInputs}
                          required
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
                        <Form.Control.Feedback type="invalid">
                          {t("Race is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                          <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      {t("Name of the Farmer")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="nameOfTheGovernmentSeedFarmOrFarmer"
                        name="nameOfTheGovernmentSeedFarmOrFarmer"
                        value={data.nameOfTheGovernmentSeedFarmOrFarmer}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Name of the Government Seed Farm/Farmer")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="numberOfDFLsReceived">
                      {t("Crop Number")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="cropNumber"
                        name="cropNumber"
                        value={data.cropNumber}
                        onChange={handleInputs}
                        // maxLength="4"
                        type="text"
                        placeholder={t("Enter Crop Number")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Line Name")}
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="lineNameId"  
                          value={data.lineNameId}
                          onChange={handleInputs}
                        >
                          <option value="">{t("Select Line Name")}</option>
                          {lineNameListData.map((list) => (
                            <option
                              key={list.lineNameId}
                              value={list.lineNameId}
                            >
                              {list.lineName}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      {t("Cocoon Supplied in Kg")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="bedNumberOrKgsOfCocoonsSupplied"
                        name="bedNumberOrKgsOfCocoonsSupplied"
                        value={data.bedNumberOrKgsOfCocoonsSupplied}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Cocoon Supplied in Kg")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      {t("Cocoon Supplied in No's")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="cacoonSuppliedNumbers"
                        name="cacoonSuppliedNumbers"
                        value={data.cacoonSuppliedNumbers}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Cocoon Supplied in No's")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      {t("Number of pupa examined")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="numberOfPupaExamined"
                        name="numberOfPupaExamined"
                        value={data.numberOfPupaExamined}
                        onChange={handleInputs}
                        type="number"
                        placeholder={t("Enter Number of pupa examined")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      {t("Cocoon rejection details/ numbers")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="cocoonRejectionDetails"
                        name="cocoonRejectionDetails"
                        value={data.cocoonRejectionDetails}
                        onChange={handleInputs}
                        type="number"
                        placeholder={t("Enter Cocoon rejection details/ numbers")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      {t("Rate Per Kg")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="ratePerKg"
                        name="ratePerKg"
                        value={data.ratePerKg}
                        onChange={handleInputs}
                        type="number"
                        placeholder={t("Enter Rate Per Kg")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Rate Per Kg is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>
               

                <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("Date of seed cocoon supply")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="Date of seed cocoon supply">
                                <DatePicker
                                  selected={data.dateOfSeedCocoonSupply}
                                  onChange={(date) =>
                                    handleDateChange(date, "dateOfSeedCocoonSupply")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  // maxDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  required
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      {t("Spun on date(From)")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.spunOnDate}
                        onChange={(date) =>
                          handleDateChange(date, "spunOnDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="2">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      {t(" Spun On Date(To)")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.spunOnToDate}
                        onChange={(date) =>
                          handleDateChange(date, "spunOnToDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                      />
                    </div>
                  </Form.Group>
                </Col>

                    <Col lg="2">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      {t("Invoice Date")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.invoiceDate}
                        onChange={(date) =>
                          handleDateChange(date, "invoiceDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                      />
                    </div>
                  </Form.Group>
                </Col>

                
              </Row>
            </Card.Body>
          </Card>

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
          {/* </Row> */}
        </Form>
      </Block>
    </Layout>
  );
}

const preservationSeedCocoonFormStyles = `
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
    margin-bottom: 20px;
  }
  .sh-section-card .card-body {
    padding: 20px !important;
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
  .sh-actions-bar {
    margin-top: 6px;
  }
  .sh-save-btn,
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 8px;
    font-weight: 600;
    padding: 8px 22px;
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border: none;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-save-btn:hover {
    box-shadow: 0 6px 16px rgba(30, 103, 168, 0.35);
    transform: translateY(-1px);
  }
`;

export default Preservationofseedcocoonforprocessing;
