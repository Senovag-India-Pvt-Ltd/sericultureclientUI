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

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function EditTestingOfMoth() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

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

 

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      api
        .post(baseURLSeedDfl + `Testing/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
                lotNumber: "",
                pebrineFreeStatusOfPupaAndMoth: "",
                sourceDetails: "",
                examinationDate: "",
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
        lotNumber: "",
        pebrineFreeStatusOfPupaAndMoth: "",
        sourceDetails: "",
    });
  };


  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `Testing/get-info-by-id/${id}`)
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
    <Layout title={t("Edit Testing Of Moth")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Edit Testing Of Moth")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/testing-of-moth-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/testing-of-moth-list"
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
              {t("Edit Testing Of Moth")}
            </Card.Header>
            <Card.Body>
              {loading ? (
                <h1 className="d-flex justify-content-center align-items-center">
                  {t("Loading...")}
                </h1>
              ) : (
                <Row className="g-gs">
                {/* <Col lg="4">
                  <Form.Group className="form-group">
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
                        {t("Lot Number is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col> */}

                <Col lg="4" >
                  <Form.Group className="form-group ">
                    <Form.Label htmlFor="plotNumber">
                      {t("Lot Number")}<span className="text-danger">*</span>
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
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Lot Number is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>


                {/* <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="numberOfDFLsReceived">
                      {t("Pebrine Free Status Of Pupa & Moth")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="pebrineFreeStatusOfPupaAndMoth"
                        name="pebrineFreeStatusOfPupaAndMoth"
                        value={data.pebrineFreeStatusOfPupaAndMoth}
                        onChange={handleInputs}
                        // maxLength="4"
                        type="text"
                        placeholder={t("Enter Pebrine Free Status Of Pupa & Moth")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Pebrine Free Status Of Pupa & Moth is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col> */}
                <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label>
                              {t("Pebrine Free Status Of Pupa & Moth")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="pebrineFreeStatusOfPupaAndMoth"
                                  value={data.pebrineFreeStatusOfPupaAndMoth}
                                  onChange={handleInputs}
                                  required
                                  isInvalid={
                                    data.pebrineFreeStatusOfPupaAndMoth === undefined ||
                                    data.pebrineFreeStatusOfPupaAndMoth === "0"
                                  }
                                >
                                  <option value="">
                                    {t("Select Pebrine Free Status Of Pupa & Moth")}
                                  </option>
                                  <option value="Diseased">{t("Diseased")}</option>
                                  <option value="Disease-Free">{t("Disease-Free")}</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                {t("Pebrine Free Status Of Pupa & Moth is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>


                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="invoiceDetails">
                      {t("Source Details")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="sourceDetails"
                        name="sourceDetails"
                        value={data.sourceDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Source Details")}
                        // required
                      />
                      {/* <Form.Control.Feedback type="invalid">
                      {t("Source Details is required")}
                      </Form.Control.Feedback> */}
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label>
                      {t("Examination Stage")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="stage"
                        value={data.stage || ""}
                        onChange={handleInputs}
                        required
                      >
                        <option value="">{t("Select Examination Stage")}</option>
                        <option value="COCOON">{t("Cocoon Test")}</option>
                        <option value="MOTH">{t("Moth Test")}</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("Examination Stage is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="numberOfBeds">
                      {t("Number of Beds")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="numberOfBeds"
                        name="numberOfBeds"
                        value={data.numberOfBeds || ""}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        placeholder={t("Enter Number of Beds")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="numberOfDiseasedBeds">
                      {t("Number of Diseased Beds")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="numberOfDiseasedBeds"
                        name="numberOfDiseasedBeds"
                        value={data.numberOfDiseasedBeds || ""}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        placeholder={t("Enter Number of Diseased Beds")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="examinationDate">
                      {t("Examination Date")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="examinationDate"
                        name="examinationDate"
                        value={data.examinationDate ? String(data.examinationDate).slice(0, 10) : ""}
                        onChange={handleInputs}
                        type="date"
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

export default EditTestingOfMoth;
