import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable, { createTheme } from "react-data-table-component";

import { Icon, Select } from "../../components";
import { useTranslation } from "react-i18next";

import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function SupplyofCocoonstoGrainage() {
  const [data, setData] = useState({
    grainageUserMasterId: "",
    lineYear: "",
    sourceMasterId: "",
    screeningBatchNo: "",
    generationNumberId: "",
    spunOnDate: "",
    lotNumber: "",
    numberOfCocoonsDispatched: "",
    dateOfSupply: "",
    dispatchDate: "",
    cacoonsSuppliedInKg: "",
    spunOnToDate: "",
    cropNumber: "",
    rate: "",
  });

  const { t } = useTranslation();

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "20%",
    },
  };

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if(name=== "lotNumber"){
      getRearingList(value);
    }
  };

  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

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
      // Format date fields
    const formattedSpunDate = formatDate(data.spunOnDate);
    const formattedDateOfSupply = formatDate(data.dateOfSupply);
    const formattedDateOfDispatch = formatDate(data.dispatchDate);

    const payload = {
      ...data,
      spunOnDate: formattedSpunDate,
      dateOfSupply: formattedDateOfSupply,
      dispatchDate: formattedDateOfDispatch,
    };
      api
        .post(baseURL + `supply-cocoons/add-info`, payload)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({
              grainageUserMasterId: "",
              lineYear: "",
              sourceMasterId: "",
              screeningBatchNo: "",
              generationNumberId: "",
              spunOnDate: "",
              lotNumber: "",
              numberOfCocoonsDispatched: "",
              dateOfSupply: "",
              dispatchDate: "",
              cacoonsSuppliedInKg: "",
              spunOnToDate: "",
              cropNumber: "",
              rate: "",
            });
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
      grainageUserMasterId: "",
      lineYear: "",
      sourceMasterId: "",
      screeningBatchNo: "",
      generationNumberId: "",
      spunOnDate: "",
      lotNumber: "",
      numberOfCocoonsDispatched: "",
      dateOfSupply: "",
      dispatchDate: "",
      cacoonsSuppliedInKg: "",
      spunOnToDate: "",
      cropNumber: "",
      rate: "",
    });
    // setLot({
    //   lotNumber: "",
    //   raceName: "",
    //   generationDetails: "",
    //   laidOnDate: "",
    // });
  };

  const [lot ,setLot] = useState({
    lotNumber: "",
    raceName: "",
    generationDetails: "",
    laidOnDate: "",
  })

  // To Get Lot Number
  const [lotNumberListData, setLotNumberListData] = useState([]);

  const getLotNumberList = () => {
    const response = api
      .get(baseURL + `lot-number-master/get-lot-after-rearing`)
      .then((response) => {
        setLotNumberListData(response.data);
      })
      .catch((err) => {
        setLotNumberListData([]);
      });
  };

  useEffect(() => {
    getLotNumberList();
  }, []);

  const getRearingList = (_id) => {
    const response = api
      .get(baseURL + `lot-number-master/get-lot-after-rearing-by-id/${_id}`)
      .then((response) => {
        if (response.data) {
          setLot(response.data);
          
        }
      })
      .catch((err) => {
      });
  };
 
  // to get Grainage
  const [grainageListData, setGrainageListData] = useState([]);

  const getGrainageList = () => {
    const response = api
      .get(baseURL2 + `grainageMaster/get-all`)
      .then((response) => {
        setGrainageListData(response.data.content.grainageMaster);
      })
      .catch((err) => {
        setGrainageListData([]);
      });
  };

  useEffect(() => {
    getGrainageList();
  }, []);

  // // to get Lot
  // const [lotListData, setLotListData] = useState([]);

  // const getLotList = () => {
  //   const response = api
  //     .get(baseURLSeedDfl + `ReceiptOfDflsFromP4GrainageLinesController/get-all-lot-number-list`)
  //     .then((response) => {
  //       setLotListData(response.data);
  //     })
  //     .catch((err) => {
  //       setLotListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getLotList();
  // }, []);

  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
    const response = api
      .get(baseURL2 + `raceMaster/get-all`)
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

 

   // to get Source
   const [sourceListData, setSourceListData] = useState([]);

   const getSourceList = () => {
     const response = api
       .get(baseURL2 + `sourceMaster/get-all`)
       .then((response) => {
         setSourceListData(response.data.content.sourceMaster);
       })
       .catch((err) => {
        setSourceListData([]);
       });
   };
 
   useEffect(() => {
     getSourceList();
   }, []);

   // to get Generation Number
   const [generationListData, setGenerationListData] = useState([]);

   const getGenerationList = () => {
     const response = api
       .get(baseURL2 + `generationNumberMaster/get-all`)
       .then((response) => {
         setGenerationListData(response.data.content.generationNumberMaster);
       })
       .catch((err) => {
        setGenerationListData([]);
       });
   };
 
   useEffect(() => {
     getGenerationList();
   }, []);

   // to get Line Year
   const [lineYearListData, setLineYearListData] = useState([]);

   const getLineYearList = () => {
     const response = api
       .get(baseURL2 + `lineNameMaster/get-all`)
       .then((response) => {
         setLineYearListData(response.data.content.lineNameMaster);
       })
       .catch((err) => {
        setLineYearListData([]);
       });
   };
 
   useEffect(() => {
     getLineYearList();
   }, []);

  const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: t("Saved successfully"),
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
      title: t("Attempt was not successful"),
      html: errorMessage,
    });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  return (
    <Layout title={t("Supply of Cocoons to Grainage")}>
      <style>{supplyOfCocoonsToGrainageFormStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Supply of Cocoons to Grainage")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/supply-of-cocoons-to-grainage-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/supply-of-cocoons-to-grainage-list"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-0">
            <Card className="sh-section-card">
              <Card.Header className="sh-section-header">
                <Icon name="package" />
                <span>{t("Supply of Cocoons to Grainage")}</span>
              </Card.Header>
              <Card.Body>
                <Row className="g-gs">

                <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Grainage")}<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="grainageUserMasterId"
                              value={data.grainageUserMasterId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">{t("Select Grainage")}</option>
                              {grainageListData && grainageListData.length?(grainageListData.map((list) => (
                                <option
                                  key={list.userMasterId}
                                  value={list.userMasterId}
                                >
                                  {list.grainageMasterName}
                                </option>
                              ))):""}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {t("Grainage is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Line Details/year")}
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="lineYear"
                              value={data.lineYear}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              // required
                            >
                              <option value="">{t("Select Line Details")}</option>
                              {lineYearListData && lineYearListData.length?(lineYearListData.map((list) => (
                                <option
                                  key={list.lineNameId}
                                  value={list.lineNameId}
                                >
                                  {list.lineName}
                                </option>
                              ))):""}
                            </Form.Select>
                            {/* <Form.Control.Feedback type="invalid">
                              Line Details is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                    {/* <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Source<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="sourceMasterId"
                              value={data.sourceMasterId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">Select Source</option>
                              {sourceListData && sourceListData.length?(sourceListData.map((list) => (
                                <option
                                  key={list.sourceMasterId}
                                  value={list.sourceMasterId}
                                >
                                  {list.sourceMasterName}
                                </option>
                              ))):""}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Source is required
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col> */}

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Screening Batch No")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="screeningBatchNo"
                            name="screeningBatchNo"
                            value={data.screeningBatchNo}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Screening Batch No")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                          Screening Batch No is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Generation Number")}
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="generationNumberId"
                              value={data.generationNumberId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              // required
                            >
                              <option value="">{t("Select Generation Number")}</option>
                              {generationListData && generationListData.length?(generationListData.map((list) => (
                                <option
                                  key={list.generationNumberId}
                                  value={list.generationNumberId}
                                >
                                  {list.generationNumber}
                                </option>
                              ))):""}
                            </Form.Select>
                            {/* <Form.Control.Feedback type="invalid">
                              Generation Number is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                    {/* <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Lot Number
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="lotNumber"
                            name="lotNumber"
                            value={data.lotNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder=" Enter Lot Number"
                          />
                          
                        </div>
                      </Form.Group>
                    </Col> */}
                
                    <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Lot Number")}<span className="text-danger">*</span>
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
                          <option value="">{t("Select Lot Number")}</option>
                          {lotNumberListData.map((list) => (
                            <option key={list.id} value={list.lotNumber}>
                              {list.lotNumber}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("Lot Number is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                    {t("Cocoon Supplied in Kg")}
                    {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="cacoonsSuppliedInKg"
                        name="cacoonsSuppliedInKg"
                        value={data.cacoonsSuppliedInKg}
                        onChange={handleInputs}
                        type="number"
                        placeholder={t("Enter Cocoon Supplied in Kg")}
                        // required
                      />
                      {/* <Form.Control.Feedback type="invalid">
                      Cocoon Supplied in Kg is required
                      </Form.Control.Feedback> */}
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="rate">
                      {t("Rate (₹ per kg)")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="rate"
                        name="rate"
                        value={data.rate}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Rate (₹ per kg)")}
                      />
                    </div>
                  </Form.Group>
                </Col>


                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("Number of Cocoons Dispatched(kg/Nos)")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                id="numberOfCocoonsDispatched"
                                name="numberOfCocoonsDispatched"
                                value={data.numberOfCocoonsDispatched}
                                onChange={handleInputs}
                                type="number"
                                placeholder={t("Enter Number of Cocoons Dispatched")}
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="cropNumber">
                                {t("Crop Number")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                id="cropNumber"
                                name="cropNumber"
                                value={data.cropNumber}
                                onChange={handleInputs}
                                type="text"
                                placeholder={t("Enter Crop Number")}
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
                                  selected={data.spunOnDate ? new Date(data.spunOnDate) : null}
                                  onChange={(date) =>
                                    handleDateChange(date, "spunOnDate")
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
                            <Form.Group className="form-group mt-n4 ">
                              <Form.Label>{t("Date of Supply")}</Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.dateOfSupply ? new Date(data.dateOfSupply) : null}
                                  onChange={(date) =>
                                    handleDateChange(date, "dateOfSupply")
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
                                {t("Dispatch Date")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.dispatchDate ? new Date(data.dispatchDate) : null}
                                  onChange={(date) =>
                                    handleDateChange(date, "dispatchDate")
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
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

const supplyOfCocoonsToGrainageFormStyles = `
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

export default SupplyofCocoonstoGrainage;
