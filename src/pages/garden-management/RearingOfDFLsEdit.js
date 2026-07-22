import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
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
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function RearingOfDFLsEdit() {
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
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const isDataLaidSet = !!data.laidOnDate;
  const isDataReleasedSet = !!data.releasedOnDate;
  const isDataSpunSet = !!data.spunOnDate;

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
      // const formattedReleaseDate = formatDate(data.releasedOnDate);
      // const formattedBoxingDate = formatDate(data.brushingDate);
      // const formattedDateOfDisposal = formatDate(data.spunOnDate);
      // // const formattedExpectedDateOfHatching = formatDate(data.hatchingDate);
      // const payload = {
      //   ...data,
      //   releasedOnDate: formattedReleaseDate,
      //   brushingDate: formattedBoxingDate,
      //   spunOnDate: formattedDateOfDisposal,
      //   // hatchingDate: formattedExpectedDateOfHatching,
      // };
      api
        .post(baseURL2 + `Rearing-of-dfls/update-info`, data)
        .then((response) => {
          //   const trScheduleId = response.data.content.trScheduleId;
          //   if (trScheduleId) {
          //     handlePPtUpload(trScheduleId);
          //   }
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              disinfectantMasterId: "",
              cropNumber: "",
              lotNumberId: "",
              coldStorageDetails: "",
              releasedOnDate: "",
              brushingDate: "",
              chawkiPercentage: "",
              wormWeight: "",
              spunOnDate: "",
              wormTestDetails: "",
              cocoonAssessmentDetails: "",
              averageLooseEggsPerDfl: "",
              wormsSelectedAfter3rdMoult: "",
              wormsSelectedForTestingAfter3rdMoult: "",
              lowYield: "",
              failedEggs: "",
              actualBrushedDfls: "",
              averageChawkiPerDfl: "",
              leafQuantityUsed: "",
              errAfter3rdMoult: "",
              seedCocoons: "",
              reelingCocoons: "", reelingCocoonsWeight: "", reelingCocoonsValue: "",
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
      disinfectantMasterId: "",
      cropNumber: "",
      lotNumberId: "",
      coldStorageDetails: "",
      releasedOnDate: "",
      brushingDate: "",
      chawkiPercentage: "",
      wormWeight: "",
      spunOnDate: "",
      wormTestDetails: "",
      cocoonAssessmentDetails: "",
      averageLooseEggsPerDfl: "",
      wormsSelectedAfter3rdMoult: "",
      wormsSelectedForTestingAfter3rdMoult: "",
      lowYield: "",
      failedEggs: "",
      actualBrushedDfls: "",
      averageChawkiPerDfl: "",
      leafQuantityUsed: "",
      errAfter3rdMoult: "",
      seedCocoons: "",
      reelingCocoons: "", reelingCocoonsWeight: "", reelingCocoonsValue: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `Rearing-of-dfls/get-info-by-id/${id}`)
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

  // to get Lot Number
  const [lotNumberListData, setLotNumberListData] = useState([]);

  const getLotNumberList = () => {
    const response = api
      .get(baseURL2 + `lot-number-master/get-info`)
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

  // to get DisInfactant Variety
  const [disinfactantListData, setDisinfactantListData] = useState([]);

  const getDisinfactantList = () => {
    const response = api
      .get(baseURL + `disinfectantMaster/get-all`)
      .then((response) => {
        setDisinfactantListData(response.data.content.disinfectantMaster);
      })
      .catch((err) => {
        setDisinfactantListData([]);
      });
  };

  useEffect(() => {
    getDisinfactantList();
  }, []);

  const navigate = useNavigate();

  const updateSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: t("Updated successfully"),
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

  return (
    <Layout title={t("Edit Rearing of DFLs")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Edit Rearing of DFLs")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/rearing-of-dfls-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/rearing-of-dfls-list"
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
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          {/* <Row className="g-3 "> */}
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
              {t("Edit Rearing Of DFLs")}
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
                        {t("Disinfactant Usage Details")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="disinfectantMasterId"
                            value={data.disinfectantMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                          >
                            <option value="">{t("Select Disinfactant Usage")}</option>
                            {disinfactantListData.map((list) => (
                              <option
                                key={list.disinfectantMasterId}
                                value={list.disinfectantMasterId}
                              >
                                {list.disinfectantMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("Disinfactant Usage Details is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>


                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="plotNumber">
                        {t("Crop Number")}
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="cropNumber"
                          name="cropNumber"
                          value={data.cropNumber}
                          onChange={handleInputs}
                          type="text"
                          maxLength="12"
                          placeholder={t("Enter Crop Number")}
                          // required
                        />
                        {/* <Form.Control.Feedback type="invalid">
                          Crop Number is required
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>

                  

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="coldStorageDetails">
                        {t("Cold Storage Status")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="coldStorageDetails"
                        name="coldStorageDetails"
                        value={data.coldStorageDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Cold Storage Status")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="plotNumber">
                      {t("Chawki Percentage")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="chawkiPercentage"
                        name="chawkiPercentage"
                        value={data.chawkiPercentage}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Chawki Percentage")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Chawki Percentage is required")}
                        </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="plotNumber">
                      {t("Worm Weight (In Grams)")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="wormWeight"
                        name="wormWeight"
                        value={data.wormWeight}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Worm Weight (In Grams)")}
                        required
                      />
                       <Form.Control.Feedback type="invalid">
                        {t("Worm Weight (In Grams) is required")}
                        </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="plotNumber">
                      {t("Worm Test Status")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="wormTestDetails"
                        name="wormTestDetails"
                        value={data.wormTestDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Worm Test Details")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Worm Test Status is required")}
                        </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="plotNumber">
                      {t("Cocoon Produced in NOs")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="cocoonAssessmentDetails"
                        name="cocoonAssessmentDetails"
                        value={data.cocoonAssessmentDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Cocoon Produced in NOs")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Cocoon Produced in NOs is required")}
                        </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="averageLooseEggsPerDfl">
                      {t("Average Loose Eggs per DFL")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="averageLooseEggsPerDfl"
                        name="averageLooseEggsPerDfl"
                        value={data.averageLooseEggsPerDfl ?? ""}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Average Loose Eggs per DFL")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="wormsSelectedAfter3rdMoult">
                      {t("Worms Selected After 3rd Moult")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="wormsSelectedAfter3rdMoult"
                        name="wormsSelectedAfter3rdMoult"
                        value={data.wormsSelectedAfter3rdMoult ?? ""}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        placeholder={t("Enter Worms Selected After 3rd Moult")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="wormsSelectedForTestingAfter3rdMoult">
                      {t("Worms Selected for Testing After 3rd Moult")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="wormsSelectedForTestingAfter3rdMoult"
                        name="wormsSelectedForTestingAfter3rdMoult"
                        value={data.wormsSelectedForTestingAfter3rdMoult ?? ""}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        placeholder={t("Enter Worms Selected for Testing After 3rd Moult")}
                      />
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
                        value={data.lowYield ?? ""}
                        onChange={handleInputs}
                        type="number"
                        min="0"
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
                        value={data.failedEggs ?? ""}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        placeholder={t("Enter Failed Eggs")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="actualBrushedDfls">
                      {t("Actual Brushed DFLs")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="actualBrushedDfls"
                        name="actualBrushedDfls"
                        value={data.actualBrushedDfls ?? ""}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        placeholder={t("Enter Actual Brushed DFLs")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="averageChawkiPerDfl">
                      {t("Average Chawki per DFL")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="averageChawkiPerDfl"
                        name="averageChawkiPerDfl"
                        value={data.averageChawkiPerDfl ?? ""}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Average Chawki per DFL")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="leafQuantityUsed">
                      {t("Leaf Quantity Used")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="leafQuantityUsed"
                        name="leafQuantityUsed"
                        value={data.leafQuantityUsed ?? ""}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Leaf Quantity Used")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="errAfter3rdMoult">
                      {t("ERR After 3rd Moult")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="errAfter3rdMoult"
                        name="errAfter3rdMoult"
                        value={data.errAfter3rdMoult ?? ""}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter ERR After 3rd Moult")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="seedCocoons">
                      {t("Seed Cocoons")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="seedCocoons"
                        name="seedCocoons"
                        value={data.seedCocoons ?? ""}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Seed Cocoons")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="reelingCocoons">
                      {t("Reeling Cocoons")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="reelingCocoons"
                        name="reelingCocoons"
                        value={data.reelingCocoons ?? ""}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Reeling Cocoons")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="reelingCocoonsWeight">
                      {t("Reeling Cocoons Weight (kg)")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="reelingCocoonsWeight"
                        name="reelingCocoonsWeight"
                        value={data.reelingCocoonsWeight ?? ""}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Reeling Cocoons Weight (kg)")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="reelingCocoonsValue">
                      {t("Reeling Cocoons Value (₹)")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="reelingCocoonsValue"
                        name="reelingCocoonsValue"
                        value={data.reelingCocoonsValue ?? ""}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Reeling Cocoons Value (₹)")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                {[1, 2, 3, 4, 5].map((s) => (
                  <Col lg="4" key={`wts${s}`}>
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor={`wormTestStage${s}`}>
                        {t(`Microscope Exam - Stage ${s}`)}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id={`wormTestStage${s}`}
                          name={`wormTestStage${s}`}
                          value={data[`wormTestStage${s}`] ?? ""}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t(`Enter Stage ${s} Microscope Exam`)}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                ))}

                {[
                  { k: "cocoonShellWeight", l: "Cocoon Shell Weight" },
                  { k: "denier", l: "Denier" },
                  { k: "mortalityPercent", l: "Mortality %" },
                  { k: "worms4thStage", l: "Worms in 4th Stage" },
                  { k: "bicoMarketCocoons", l: "BiCo / Market Cocoons" },
                ].map((f) => (
                  <Col lg="4" key={f.k}>
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor={f.k}>{t(f.l)}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id={f.k}
                          name={f.k}
                          value={data[f.k] ?? ""}
                          onChange={handleInputs}
                          type="number"
                          min="0"
                          step="any"
                          placeholder={t(`Enter ${f.l}`)}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                ))}

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="remarks">{t("Notes / Remarks")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="remarks"
                        name="remarks"
                        value={data.remarks ?? ""}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Notes / Remarks")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="2">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="sordfl">
                    {t("Released On Date")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                    <div className="form-control-wrap">
                      {isDataReleasedSet && (
                        <DatePicker
                          selected={new Date(data.releasedOnDate)}
                          onChange={(date) =>
                            handleDateChange(date, "releasedOnDate")
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
                  <Form.Label htmlFor="sordfl">
                    {t("Brushing Date")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                    <div className="form-control-wrap">
                      {isDataLaidSet && (
                        <DatePicker
                          selected={new Date(data.brushingDate)}
                          onChange={(date) =>
                            handleDateChange(date, "brushingDate")
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
                  <Form.Label htmlFor="sordfl">
                    {t("Spun Date")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                    <div className="form-control-wrap">
                      {isDataSpunSet && (
                        <DatePicker
                          selected={new Date(data.spunOnDate)}
                          onChange={(date) =>
                            handleDateChange(date, "spunOnDate")
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

export default RearingOfDFLsEdit;
