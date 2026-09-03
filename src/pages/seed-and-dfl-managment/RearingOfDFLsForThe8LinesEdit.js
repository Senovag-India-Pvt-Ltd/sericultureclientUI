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

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;
const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function RearingOfDFLsForThe8LinesEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const [validated, setValidated] = useState(false);

  const isDataLaidDate = !!data.laidOnDate;
  const isDataReleasedDate = !!data.releasedOn;
  const isDataSpunDate = !!data.spunOnDate;
  const isDataHatchingDate = !!data.hatchingDate;

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "lotNumber") {
      const selectedLot = lotListEggPreparationData.find((lot) => lot.lotNumber === value);
      if (selectedLot) {
        setData((prev) => ({
          ...prev,
          numberOfDFLs: selectedLot.numberOfDfls || "", // Use fallback if `dflsObtained` is null
          laidOnDate: selectedLot.laidOnDate
            ? new Date(selectedLot.laidOnDate) // Convert to Date object
            : null,
          hatchingDate: selectedLot.hatchingDate
            ? new Date(selectedLot.hatchingDate) // Convert to Date object if available
            : null,
        }));
      }
}
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
      // const formattedReleaseDate = formatDate(data.laidOnDate);
      // const formattedBoxingDate = formatDate(data.releasedOn);
      // const formattedDateOfDisposal = formatDate(data.spunOnDate);
      // const formattedExpectedDateOfHatching = formatDate(data.hatchingDate);
      // const payload = {
      //   ...data,
      //   laidOnDate: formattedReleaseDate,
      //   releasedOn: formattedBoxingDate,
      //   spunOnDate: formattedDateOfDisposal,
      //   hatchingDate: formattedExpectedDateOfHatching,
      // };

      api
        .post(baseURLSeedDfl + `8linesController/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              disinfectantMasterId: "",
              cropDetail: "",
              cropNumber: "",
              lotNumber: "",
              numberOfDFLs: "",
              laidOnDate: "",
              coldStorageDetails: "",
              releasedOnDate: "",
              chawkiPercentage: "",
              wormWeightInGrams: "",
              spunOnDate: "",
              wormTestDatesAndResults: "",
              cropFailureDetails: "",
              hatchingDate: "",
              spunOnToDate: "",
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
      disinfectantUsageDetails: "",
      cropDetail: "",
      cropNumber: "",
      lotNumber: "",
      numberOfDFLs: "",
      laidOnDate: "",
      coldStorageDetails: "",
      releasedOn: "",
      chawkiPercentage: "",
      wormWeightInGrams: "",
      spunOnDate: "",
      wormTestDatesAndResults: "",
      cocoonAssessmentDetails: "",
      cropFailureDetails: "",
      hatchingDate: "",
      spunOnToDate: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `8linesController/get-info-by-id/${id}`)
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

  // to get Lot
  const [lotListData, setLotListData] = useState([]);

  const getLotList = () => {
    const response = api
      .get(
        baseURLSeedDfl +
          `ReceiptOfDflsFromP4GrainageLinesController/get-all-lot-number-list`
      )
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

  // to get Lot
  const [lotListEggPreparationData, setLotListEggPreparationData] = useState([]);

  const getLotEggPreparationList = () => {
    api
      .post(baseURLSeedDfl + `8linesController/get-all-lot-number-list`)
      .then((response) => {
        console.log("Lot List Data:", response.data); // Check the format of laidOnDate and dateOfRelease
        setLotListEggPreparationData(response.data);
      })
      .catch((err) => {
        console.error("Error fetching lot list:", err);
        setLotListEggPreparationData([]);
      });
  };
  
  useEffect(() => {
    getLotEggPreparationList();
  }, []); 

    // to get Disinfectant
    const [disinfectantListData, setDisinfectantListData] = useState([]);

    const getDisinfectantList = () => {
      const response = api
        .get(baseURLMaster + `disinfectantMaster/get-all`)
        .then((response) => {
         setDisinfectantListData(response.data.content.disinfectantMaster);
        })
        .catch((err) => {
         setDisinfectantListData([]);
        });
    };
  
    useEffect(() => {
     getDisinfectantList();
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
    <Layout title={t("Edit Rearing of DFLs for the 8 lines")}>
      <style>{rearing8LinesEditStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Edit Rearing of DFLs for the 8 lines")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/Rearing-of-DFLs-for-the-8-Lines-List"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go to List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/Rearing-of-DFLs-for-the-8-Lines-List"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go to List")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Card>
            <Card.Header className="sh-section-header">
              <Icon name="grid" />
              <span>{t("Edit Rearing of DFLs for the 8 lines")}</span>
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
                    <Form.Label>
                      {t("Disinfectant Usage Details")}
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="disinfectantMasterId"
                          value={data.disinfectantMasterId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          // required
                        >
                          <option value="">{t("Select Disinfectant Usage Details")}</option>
                          {disinfectantListData && disinfectantListData.length?(disinfectantListData.map((list) => (
                            <option key={list.disinfectantMasterId} value={list.disinfectantMasterId}>
                              {i18n.language === "kn" ? list.disinfectantMasterNameInKannada : list.disinfectantMasterName}
                            </option>
                          ))): ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        {t("Disinfectant Usage Details is required")}
                      </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                  {/* <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        {t("Crop Detail")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="sordfl"
                          name="cropDetail"
                          value={data.cropDetail}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Crop Detail")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Crop Detail is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        {t("Crop Number")}
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="sordfl"
                          name="cropNumber"
                          value={data.cropNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Crop number")}
                          // required
                        />
                        {/* <Form.Control.Feedback type="invalid">
                          {t("Crop number is required")}
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("Lot Number")}</Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="lotNumber"
                            value={data.lotNumber}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            // required
                          >
                            <option value="">{t("Select Lot Number")}</option>
                            {lotListData && lotListData.length
                              ? lotListData.map((list) => (
                                  <option key={list.id} value={list.lotNumber}>
                                    {list.lotNumber}
                                  </option>
                                ))
                              : ""}
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
                      <Form.Label htmlFor="sordfl">
                        {t("Number of DFLs")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="sordfl"
                          name="numberOfDFLs"
                          value={data.numberOfDFLs}
                          onChange={handleInputs}
                          type="number"
                          placeholder={t("Enter Number of DFLs")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Number of DFLs is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        {t("Cold Storage Details")}
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="sordfl"
                          name="coldStorageDetails"
                          value={data.coldStorageDetails}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Cold Storage Details")}
                          // required
                        />
                        {/* <Form.Control.Feedback type="invalid">
                          {t("Cold Storage Details is required")}
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        {t("Chawki percentage")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="sordfl"
                          name="chawkiPercentage"
                          value={data.chawkiPercentage}
                          onChange={handleInputs}
                          type="number"
                          placeholder={t("Enter Chawki percentage")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Chawki percentage is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        {t("Worm weight (In grms)")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="sordfl"
                          name="wormWeightInGrams"
                          value={data.wormWeightInGrams}
                          onChange={handleInputs}
                          type="number"
                          placeholder={t("Enter Worm weight (In grms)")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Worm weight (In grms) is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        {t("Worm Test results")}
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lineYear"
                          name="wormTestDatesAndResults"
                          value={data.wormTestDatesAndResults}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Worm Test results")}
                          // required
                        />
                        {/* <Form.Control.Feedback type="invalid">
                        {t("Worm Test results is required")}
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        {t("Crop Failure details")}
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="sordfl"
                          name="cropFailureDetails"
                          value={data.cropFailureDetails}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Crop failure details")}
                          // required
                        />
                        {/* <Form.Control.Feedback type="invalid">
                          {t("Crop failure details is required")}
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="lowYield">
                        {t("Low Yield")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lowYield"
                          name="lowYield"
                          value={data.lowYield}
                          onChange={handleInputs}
                          type="number"
                          placeholder={t("Enter Low Yield")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="failedEggs">
                        {t("Failed Eggs")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="failedEggs"
                          name="failedEggs"
                          value={data.failedEggs}
                          onChange={handleInputs}
                          type="number"
                          placeholder={t("Enter Failed Eggs")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="singleEggBreak">
                        {t("Loose Eggs in One DFL")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="singleEggBreak"
                          name="singleEggBreak"
                          value={data.singleEggBreak ?? ""}
                          onChange={handleInputs}
                          type="number"
                          min="0"
                          placeholder={t("Enter Loose Eggs in One DFL")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="hatchedLarvae">
                        {t("Hatched Larvae")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="hatchedLarvae"
                          name="hatchedLarvae"
                          value={data.hatchedLarvae ?? ""}
                          onChange={handleInputs}
                          type="number"
                          min="0"
                          placeholder={t("Enter Hatched Larvae")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="fourthStageLarvae">
                        {t("4th Stage Larvae")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="fourthStageLarvae"
                          name="fourthStageLarvae"
                          value={data.fourthStageLarvae ?? ""}
                          onChange={handleInputs}
                          type="number"
                          min="0"
                          placeholder={t("Enter 4th Stage Larvae")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="cocoonProduced">
                        {t("Estimated Cocoons Produced")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="cocoonProduced"
                          name="cocoonProduced"
                          value={data.cocoonProduced ?? ""}
                          onChange={handleInputs}
                          type="number"
                          min="0"
                          placeholder={t("Enter Estimated Cocoons Produced")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  {[
                    { k: "wormsTested4thStage", l: "Worms Tested (4th Stage)" },
                    { k: "destroyedWorms",      l: "Destroyed Worms" },
                    { k: "avgYieldCount",       l: "Average Yield (count)" },
                    { k: "yieldWeightGrams",    l: "Yield Weight (grams)" },
                    { k: "disposalQuantity",    l: "Disposal Quantity" },
                    { k: "reelingCocoons",      l: "Reeling Cocoons" },
                    { k: "p4SeedCocoons",       l: "P4 Seed Cocoons" },
                  ].map((fld) => (
                    <Col lg="4" key={fld.k}>
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor={fld.k}>{t(fld.l)}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id={fld.k}
                            name={fld.k}
                            value={data[fld.k] ?? ""}
                            onChange={handleInputs}
                            type="number"
                            min="0"
                            placeholder={t(fld.l)}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  ))}

                  <Col lg="2">
                    <Form.Group className="form-group mt-n4 ">
                      <Form.Label>
                        {t("Laid on (L/O) date")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        {/* {isDataLaidDate && ( */}
                          <DatePicker
                            selected={data.laidOnDate ? new Date(data.laidOnDate) : null}
                            onChange={(date) =>
                              handleDateChange(date, "laidOnDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            //   maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            required
                          />
                        {/* )} */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        {t("Released on")}
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        {/* {isDataReleasedDate && ( */}
                          <DatePicker
                            selected={data.releasedOnDate ? new Date(data.releasedOnDate) : null}
                            onChange={(date) =>
                              handleDateChange(date, "releasedOnDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            //   maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            // required
                          />
                        {/* )} */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        {t("Spun on date(From)")}
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        {/* {isDataSpunDate && ( */}
                          <DatePicker
                            selected={data.spunOnDate ? new Date(data.spunOnDate) : null}
                            onChange={(date) =>
                              handleDateChange(date, "spunOnDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            //   maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            // required
                          />
                        {/* )} */}
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
                            selected={data.spunOnToDate ? new Date(data.spunOnToDate) : null}
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
                                {t("Brushing Date")}
                                {/* <span className="text-danger">*</span> */}
                                </Form.Label>
                                <div className="form-control-wrap">
                                  {/* {isDataHatchingDate && ( */}
                                    <DatePicker
                                      selected={data.hatchingDate ? new Date(data.hatchingDate) : null}
                                      onChange={(date) =>
                                        handleDateChange(date, "hatchingDate")
                                      }
                                      peekNextMonth
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      //   maxDate={new Date()}
                                      dateFormat="dd/MM/yyyy"
                                      className="form-control"
                                      // required
                                    />
                                  {/* )} */}
                                </div>
                            </Form.Group>
                          </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          <div className="gap-col">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                {/* <Button type="button" variant="primary" onClick={postData}> */}
                <Button type="submit" variant="primary" className="shadow-sm px-4 py-2">
                  <Icon name="check" className="me-1" />
                  {t("Update")}
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

const rearing8LinesEditStyles = `
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

export default RearingOfDFLsForThe8LinesEdit;
