import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";
import { useTranslation } from "react-i18next";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function RegisteredSeedProducerNssoGrainagesEdit() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  let name, value;
  // const handleInputs = (e) => {
  //   name = e.target.name;
  //   value = e.target.value;
  //   setData({ ...data, [name]: value });
  // };

  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
  
    // Update the data state for the input field
    setData((prevData) => {
      // Calculate DFLs obtained if numberOfPairs or numberOfRejection is updated
      let dflsObtained = prevData.dflsObtained;
      if (name === "numberOfPairs" || name === "numberOfRejection") {
        const numberOfPairs = name === "numberOfPairs" ? parseInt(value) : parseInt(prevData.numberOfPairs);
        const numberOfRejection = name === "numberOfRejection" ? parseInt(value) : parseInt(prevData.numberOfRejection);
        dflsObtained = numberOfPairs - numberOfRejection;
      }
  
      return { ...prevData, [name]: value, dflsObtained };
    });
  };


  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

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
      // event.stopPropagation();

      // const formattedReleaseDate = formatDate(data.dateOfMothEmergence);
      // const formattedBoxingDate = formatDate(data.laidOnDate);
      // // const formattedDateOfDisposal = formatDate(data.spunOnDate);
      // // const formattedExpectedDateOfHatching = formatDate(data.hatchingDate);
      // const payload = {
      //   ...data,
      //   dateOfMothEmergence: formattedReleaseDate,
      //   laidOnDate: formattedBoxingDate,
      //   // spunOnDate: formattedDateOfDisposal,
      //   // hatchingDate: formattedExpectedDateOfHatching,
      // };

      api
        .post(baseURLSeedDfl + `EggPreparationRsso/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              numberOfCocoonsCB: "",
              sourceMasterId: "",
              dateOfMothEmergence: "",
              laidOnDate: "",
              eggSheetSerialNumber: "",
              numberOfPairs: "",
              numberOfRejection: "",
              dflsObtained: "",
              eggRecoveryPercentage: "",
              testResults: "",
              certification: "",
              additionalRemarks: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          // const message = err.response.data.errorMessages[0].message[0].message;
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      numberOfCocoonsCB: "",
      sourceMasterId: "",
      dateOfMothEmergence: "",
      laidOnDate: "",
      eggSheetSerialNumber: "",
      numberOfPairs: "",
      numberOfRejection: "",
      dflsObtained: "",
      eggRecoveryPercentage: "",
      testResults: "",
      certification: "",
      additionalRemarks: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `EggPreparationRsso/get-info-by-id/${id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
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

   // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = () => {
    const response = api
      .get(baseURL2 + `marketMaster/get-all`)
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


  const navigate = useNavigate();

  const updateSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      text: message,
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
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("#"));
  };
  return (
    <Layout title={t("Edit Preparation Of Eggs (DFLs) RSP/NSSO")}>
      <style>{editRegisteredSeedProducerNssoStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Edit Preparation Of Eggs (DFLs) RSP/NSSO")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/registered-seed-producer-nsso-grainages-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/registered-seed-producer-nsso-grainages-list"
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
              <Icon name="grid" />
              <span>{t("Preparation of Eggs (DFLs) RSP/NSSO")}</span>
            </Card.Header>
            <Card.Body>
              <Row className="g-gs">
              <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Cocoon Lot Number (MSC, Fc1, Fc2)")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="cocoonLotNumber"
                            name="cocoonLotNumber"
                            type="number"
                            value={data.cocoonLotNumber}
                            onChange={handleInputs}
                            placeholder={t("Enter Cocoon Lot Number (MSC, Fc1, Fc2)")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Cocoon Lot Number (MSC, Fc1, Fc2) is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
              <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Number of Cocoons (MSC, Fc1, Fc2)")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numberOfCocoonsCB"
                            name="numberOfCocoonsCB"
                            type="number"
                            value={data.numberOfCocoonsCB}
                            onChange={handleInputs}
                            placeholder={t("Enter Number of Cocoons (MSC, Fc1, Fc2)")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Number of Cocoons (MSC, Fc1, Fc2) is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    {/* <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Source<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="sourceMasterId"
                            value={data.sourceMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            // multiple
                            required
                            isInvalid={
                              data.sourceMasterId === undefined ||
                              data.sourceMasterId === "0"
                            }
                          >
                            <option value="">Select Source</option>
                            {sourceListData.map((list) => (
                              <option
                                key={list.sourceMasterId}
                                value={list.sourceMasterId}
                              >
                                {list.sourceMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Source is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col> */}
                    <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                      {t("Seed Cocoon Market")}
                       {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="sourceMasterId"
                            value={data.sourceMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            // required
                            // isInvalid={
                            //   data.sourceMasterId === undefined ||
                            //   data.sourceMasterId === "0"
                            // }
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
                          {/* <Form.Control.Feedback type="invalid">
                            Market is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Date of moth emergence")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={
                              data.dateOfMothEmergence
                              ? new Date(data.dateOfMothEmergence)
                                : null
                                }
                            onChange={(date) =>
                              handleDateChange(date, "dateOfMothEmergence")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            maxDate={new Date()}
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
                        {t("Laid On Date")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={
                              data.laidOnDate
                              ? new Date(data.laidOnDate)
                                : null
                                }
                            onChange={(date) =>
                              handleDateChange(date, "laidOnDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Egg sheet serial number")}
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="eggSheetSerialNumber"
                            name="eggSheetSerialNumber"
                            type="number"
                            value={data.eggSheetSerialNumber}
                            onChange={handleInputs}
                            placeholder={t("Enter Egg sheet serial number")}                        required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            Egg sheet serial number is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Number of pairs")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numberOfPairs"
                            name="numberOfPairs"
                            type="number"
                            value={data.numberOfPairs}
                            onChange={handleInputs}
                            placeholder={t("Enter Number of pairs")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Number of pairs is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Number of Rejection")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numberOfRejection"
                            name="numberOfRejection"
                            type="number"
                            value={data.numberOfRejection}
                            onChange={handleInputs}
                            placeholder={t("Enter Number of Rejection")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Number of Rejection is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("DFLs obtained")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="dflsObtained"
                            name="dflsObtained"
                            type="number"
                            value={data.dflsObtained}
                            onChange={handleInputs}
                            placeholder={t("Enter DFLs obtained")}
                            required
                            readOnly
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("DFLs obtained is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Egg Recovery %")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="eggRecoveryPercentage"
                            name="eggRecoveryPercentage"
                            type="number"
                            value={data.eggRecoveryPercentage}
                            onChange={handleInputs}
                            placeholder={t("Enter Egg Recovery %")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Egg Recovery % is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>


                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Test results")}
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="testResults"
                            name="testResults"
                            type="text"
                            value={data.testResults}
                            onChange={handleInputs}
                            placeholder={t("Enter Test results")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            Test results is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Certification (Yes/No)")}
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="certification"
                            name="certification"
                            type="text"
                            value={data.certification}
                            onChange={handleInputs}
                            placeholder={t("Enter Certification (Yes/No)")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            Certification (Yes/No) is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Additional remarks")}
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="additionalRemarks"
                            name="additionalRemarks"
                            type="text"
                            value={data.additionalRemarks}
                            onChange={handleInputs}
                            placeholder={t("Enter Additional remarks")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            Additional remarks is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="gap-col mt-1 sh-actions-bar">
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
          {/* </Row> */}
        </Form>
      </Block>
    </Layout>
  );
}

const editRegisteredSeedProducerNssoStyles = `
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

export default RegisteredSeedProducerNssoGrainagesEdit;
