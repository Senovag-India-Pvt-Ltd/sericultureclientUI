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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function SaleAndDisposalOfEggsNSSOEdit() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);
  const [searchValidated, setSearchValidated] = useState(false);

  const search = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setSearchValidated(true);
    } else {
      event.preventDefault();
      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }
      api
        .post(
          baseURLFarmer +
            `farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number`,
          { fruitsId: data.fruitsId }
        )
        .then((response) => {
          console.log(response);
          if (!response.data.content.error) {
            if (response.data.content.farmerResponse) {
              const firstName = response.data.content.farmerResponse.firstName;
              const address =
                response.data.content.farmerAddressList[0].addressText;
              setData((prev) => ({
                ...prev,
                nameAndAddressOfTheFarm: `${firstName}, ${address}`,
              }));
            }
          } else {
            updateError(response.data.content.error_description);
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              updateError(err.response.data.validationErrors);
            }
          }
        });
    }
  };

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
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
      // const formattedDateOfDisposal = formatDate(data.dateOfDisposal);
      // const payload = {
      //   ...data,
      //   dateOfDisposal: formattedDateOfDisposal,
      // };
      api
        .post(baseURLSeedDfl + `sale-disposal-of-egg-rsso/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              lotNumber: "",
              eggSheetNumbers: "",
              raceId: "",
              dateOfDisposal: "",
              numberOfDflsDisposed: "",
              fruitsId: "",
              nameAndAddressOfTheFarm: "",
              ratePer100DflsPrice: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          // const message = err.response.data.errorMessages[0].message[0].message;
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              updateError(err.response.data.validationErrors);
            }
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      lotNumber: "",
      eggSheetNumbers: "",
      raceId: "",
      dateOfDisposal: "",
      numberOfDflsDisposed: "",
      fruitsId: "",
      nameAndAddressOfTheFarm: "",
      ratePer100DflsPrice: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURLSeedDfl + `sale-disposal-of-egg-rsso/get-info-by-id/${id}`)
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

  // to get Lot
  const [lotListData, setLotListData] = useState([]);

  const getLotList = () => {
    api
      .get(baseURLSeedDfl + `EggPreparationRsso/get-all-lot-number-list`)
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
    <Layout title={t("Edit Sale / Disposal of DFL's(eggs) NSSO")}>
      <style>{editSaleDisposalEggsNssoStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Edit Sale / Disposal of DFL's(eggs) NSSO")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/sale-and-disposal-of-eggs-nsso-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/sale-and-disposal-of-eggs-nsso-list"
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
        {/* <Card>
          <Card.Body>
            <Row lg="12" className="g-gs">
              <Col lg="1">
                <Form.Group as={Row} className="form-group" controlId="farm">
                  <Col sm={1}>
                    <Form.Check
                      type="radio"
                      name="userType"
                      value="farm"
                      checked={data.userType === "farm"}
                      onChange={handleInputs}
                    />
                  </Col>
                  <Form.Label column sm={9} className="mt-n2" id="farm">
                    Farm
                  </Form.Label>
                </Form.Group>
              </Col>
              <Col lg="1">
                <Form.Group as={Row} className="form-group" controlId="farmer">
                  <Col sm={1}>
                    <Form.Check
                      type="radio"
                      name="userType"
                      value="farmer"
                      checked={data.userType === "farmer"}
                      onChange={handleInputs}
                    />
                  </Col>
                  <Form.Label column sm={9} className="mt-n2" id="farmer">
                    Farmer
                  </Form.Label>
                </Form.Group>
              </Col>
              <Col lg="1">
                <Form.Group as={Row} className="form-group" controlId="crc">
                  <Col sm={1}>
                    <Form.Check
                      type="radio"
                      name="userType"
                      value="crc"
                      checked={data.userType === "crc"}
                      onChange={handleInputs}
                    />
                  </Col>
                  <Form.Label column sm={9} className="mt-n2" id="crc">
                    CRC
                  </Form.Label>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card> */}

        {/* {data.userType === "farmer" ? ( */}
          <Form
            noValidate
            validated={searchValidated}
            onSubmit={search}
            className="mt-1"
          >
            <Card className="sh-section-card">
              <Card.Header className="sh-section-header">
                <Icon name="search" />
                <span>{t("FRUITS ID Search")}</span>
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
                          maxLength="16"
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Fruits ID Should Contain 16 digits")}
                        </Form.Control.Feedback>
                      </Col>
                      <Col sm={2}>
                        <Button type="submit" variant="primary" className="sh-save-btn">
                          <Icon name="search" />
                          <span>{t("Search")}</span>
                        </Button>
                      </Col>
                      {/* <Col sm={2}>
                        <Button
                          type="button"
                          variant="primary"
                          href="https://fruits.karnataka.gov.in/OnlineUserLogin.aspx"
                          target="_blank"
                          // onClick={search}
                        >
                          Generate FRUITS ID
                        </Button>
                      </Col> */}
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Form>
        {/* ) : (
          ""
        )} */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1 ">
            <Block className="mt-3">
              <Card className="sh-section-card">
                <Card.Header className="sh-section-header">
                  <Icon name="cart" />
                  <span>{t("Sale / Disposal of DFLs 's (egg) s")}</span>
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group mt-n3">
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
                                    <option
                                      key={list.id}
                                      value={list.lotNumber}
                                    >
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
                      <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="sordfl">
                          {t("Egg Sheet Numbers")}
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="eggSheetNumbers"
                            name="eggSheetNumbers"
                            type="text"
                            // min="1"
                            value={data.eggSheetNumbers}
                            onChange={handleInputs}
                            placeholder={t("Enter Egg Sheet Numbers")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            Egg Sheet Numbers is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>
                          {t("Race")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="raceId"
                            value={data.raceId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            // multiple
                            required
                            isInvalid={
                              data.raceId === undefined || data.raceId === "0"
                            }
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
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Number of DFLs disposed")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numberOfDflsDisposed"
                            name="numberOfDflsDisposed"
                            value={data.numberOfDflsDisposed}
                            onChange={handleInputs}
                            type="text"
                            maxLength="6"
                            placeholder={t("Enter Number of DFLs disposed")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Number of DFLs disposed is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    {/* {data.userType === "farm" ? (
                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            Farm<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="userTypeId"
                              value={data.userTypeId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              // multiple
                              required
                              isInvalid={
                                data.userTypeId === undefined ||
                                data.userTypeId === "0"
                              }
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
                              Farm is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    ) : data.userType === "farmer" ? ( */}
                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="sordfl">
                          {t("Name and address of the Farmer")}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="nameAndAddressOfTheFarm"
                              name="nameAndAddressOfTheFarm"
                              value={data.nameAndAddressOfTheFarm}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter Name and address of the Farm")}
                              required
                              readOnly
                            />
                            <Form.Control.Feedback type="invalid">
                            {t("Name and address of the Farm is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    {/* ) : (
                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="sordfl">
                            Name and address CRC
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="nameAndAddressOfTheFarm"
                              name="nameAndAddressOfTheFarm"
                              value={data.nameAndAddressOfTheFarm}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter Name and address CRC")}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Name and address CRC is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    )} */}

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Rate per 100 DFLs Price (in Rupees)")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="ratePer100DflsPrice"
                            name="ratePer100DflsPrice"
                            value={data.ratePer100DflsPrice}
                            onChange={handleInputs}
                            type="text"
                            maxLength="3"
                            placeholder={t("Enter Rate per 100 DFLs Price")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Rate per 100 DFLs Price is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    {/* {data.userType === "farm" ? (
                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="sordfl">
                            Name and address of Farm
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="nameAndAddressOfTheFarm"
                              name="nameAndAddressOfTheFarm"
                              value={data.nameAndAddressOfTheFarm}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter Name and address of Farm")}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Name and address of Farm is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )} */}
                    {/* <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Release Date<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={
                              data.releaseDate
                                ? new Date(data.releaseDate)
                                : null
                            }
                            onChange={(date) =>
                              handleDateChange(date, "releaseDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col> */}

                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Date of disposal")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={
                              data.dateOfDisposal
                                ? new Date(data.dateOfDisposal)
                                : null
                            }
                            onChange={(date) =>
                              handleDateChange(date, "dateOfDisposal")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    {/* <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Expected Date of Hatching
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={
                              data.expectedDateOfHatching
                                ? new Date(data.expectedDateOfHatching)
                                : null
                            }
                            onChange={(date) =>
                              handleDateChange(date, "expectedDateOfHatching")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col> */}
                  </Row>
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

const editSaleDisposalEggsNssoStyles = `
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

export default SaleAndDisposalOfEggsNSSOEdit;
