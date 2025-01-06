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
  const { t } = useTranslation();

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
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("Edit Rearing of DFLs for the 8 lines")}
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Rearing-of-DFLs-for-the-8-Lines-List"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Rearing-of-DFLs-for-the-8-Lines-List"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
              {t("Edit Rearing of DFLs for the 8 lines")}
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
                              {list.disinfectantMasterName}
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
                        {t("Spun on Date")}
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
                                {t("Date")}
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
                <Button type="submit" variant="primary">
                  {t("Update")}
                </Button>
              </li>
              <li>
                <Button type="button" variant="secondary" onClick={clear}>
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

export default RearingOfDFLsForThe8LinesEdit;
