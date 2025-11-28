import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { Icon, Select } from "../../components";
import { useState, useEffect } from "react";
import api from "../../services/auth/api";
import { useTranslation } from "react-i18next";
import CropDetailsForSeedMarket from "./CropDetailsSeedMarket";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function CropDetailsCommercialMarketEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);
const { t } = useTranslation();
  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

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
        .post(baseURLDBT + `cropDetailsCommercialMarket/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError();
          } else {
            updateSuccess();
            setData({
                raceMasterId: "",
                grainageId: "",
                receiptNo: "",
                transactionDate: "",
                lotNo: "",
                noOfDfls: "",
                dateOfBrushing: "",
                dateOfDistributionOfChawkiWorms: "",
                chawkiPercentage: "",
                spunOnDate: "",
                quantityOfCocoonsProduced: "",
                averageYield: "",
                marketId: "",
                biddingSlipNo: "",
                cocoonRatePerKg: "",
                fruitsId: "",
                spunOnToDate: "",
                crcName: "",
                externalUnitRegistrationId: "",
                eligibleQuantityCocoonsTransacted: "",
                farmerName: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          // const message = err.response.data.errorMessages[0].message[0].message;
          updateError();
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
     raceMasterId: "",
    grainageId: "",
    receiptNo: "",
    transactionDate: "",
    lotNo: "",
    noOfDfls: "",
    dateOfBrushing: "",
    dateOfDistributionOfChawkiWorms: "",
    chawkiPercentage: "",
    spunOnDate: "",
    quantityOfCocoonsProduced: "",
    averageYield: "",
    marketId: "",
    biddingSlipNo: "",
    cocoonRatePerKg: "",
    fruitsId: "",
    spunOnToDate: "",
    crcName: "",
    externalUnitRegistrationId: "",
    eligibleQuantityCocoonsTransacted: "",
    farmerName: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLDBT + `cropDetailsCommercialMarket/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        editError(message);
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


  
  // to get Grainage
  const [grainageListData, setGrainageListData] = useState([]);

  const getGrainageList = () => {
    const response = api
      .get(baseURL + `grainageMaster/get-all`)
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

    // to get Race
        const [externalListData, setExternalListData] = useState([]);
      
        const getExternalList = (_id) => {
          const response = api
            .get(baseURLFarmer + `external-unit-registration/get-all`)
            .then((response) => {
              setExternalListData(response.data.content.externalUnitRegistration);
              // setLoading(false);
              if (response.data.content.error) {
                  setExternalListData([]);
              }
            })
            .catch((err) => {
              setExternalListData([]);
              // setLoading(false);
            });
        };
      
        useEffect(() => {
              getExternalList();
        }, []);

         const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const navigate = useNavigate();

  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
  };
  const updateError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
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
    <Layout title="Edit Crop Details-Commercial Market">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Crop Details-Commercial Market</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/crop-details-commercial-market-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/crop-details-commercial-market-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
              {/* <Form action="#"> */}
              <Form noValidate validated={validated} onSubmit={postData}>
              <Row className="g-1 ">
                <Card>
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
                            <Button type="submit" variant="primary">
                              {t("Search")}
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
              {/* </Form> */}
            {/* <Form noValidate validated={validated} onSubmit={postData}> */}
          {/* <Row className="g-0"> */}
          <Block className="mt-3">
            <Card>
              <Card.Header style={{ fontWeight: "bold" }}>
                {t("Crop Details-Commercial Market")}
              </Card.Header>
              <Card.Body>
                <Row className="g-gs">
                <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Farmer’s name")}<span className="text-danger">*</span>
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

                    {/* <Col lg="4">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label htmlFor="sordfl">
                              {t("Name Of The CRC")}<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="crcName"
                                name="crcName"
                                type="text"
                                value={data.crcName}
                                onChange={handleInputs}
                                placeholder={t("Enter Name Of The CRC")}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {t("Name Of The CRC is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

                        <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            {t("RSP/CRC License Number")}
                            {/* <span className="text-danger">*</span> */}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="externalUnitRegistrationId"
                              value={data.externalUnitRegistrationId}
                              onChange={handleInputs}
                              // onBlur={handleInputs} // Correctly set as function reference
                              
                            >
                              <option value="">{t("Select License Number")}</option>
                              {externalListData.map((list) => (
                                <option
                                  key={list.externalUnitRegistrationId}
                                  value={list.externalUnitRegistrationId}
                                >
                                  {list.licenseNumber}
                                </option>
                              ))}
                            </Form.Select>
                            {/* <Form.Control.Feedback type="invalid">
                              {t("License Number is required")}
                            </Form.Control.Feedback> */}
                          </div>
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
                                name="raceMasterId"
                                value={data.raceMasterId}
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
                        <Form.Label>
                          {t("Grainage")}<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="grainageId"
                              value={data.grainageId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">{t("Select Grainage")}</option>
                              {grainageListData && grainageListData.length?(grainageListData.map((list) => (
                                <option
                                  key={list.grainageMasterId}
                                  value={list.grainageMasterId}
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
                        <Form.Label htmlFor="sordfl">
                          {t("Receipt No")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="receiptNo"
                            name="receiptNo"
                            value={data.receiptNo}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Receipt No")}
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
                        <Form.Label htmlFor="sordfl">
                          {t("Lot No")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="lotNo"
                            name="lotNo"
                            value={data.lotNo}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Lot No")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Lot No is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Chawki Percentage")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="chawkiPercentage"
                            name="chawkiPercentage"
                            value={data.chawkiPercentage}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Chawki Percentage")}
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
                        <Form.Label htmlFor="sordfl">
                          {t("Quantity Of Cocoons Produced")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="quantityOfCocoonsProduced"
                            name="quantityOfCocoonsProduced"
                            value={data.quantityOfCocoonsProduced}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Quantity Of Cocoons Produced")}
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
                        <Form.Label htmlFor="sordfl">
                          {t("Eligible Quantity Of Cocoons Produced")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="eligibleQuantityCocoonsTransacted"
                            name="eligibleQuantityCocoonsTransacted"
                            value={data.eligibleQuantityCocoonsTransacted}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Eligible Quantity Of Cocoons Produced")}
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
                        <Form.Label htmlFor="sordfl">
                          {t("No Of DFL's")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="noOfDfls"
                            name="noOfDfls"
                            value={data.noOfDfls}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("No Of DFL's")}
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
                        <Form.Label htmlFor="sordfl">
                          {t("Average Yield")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="averageYield"
                            name="averageYield"
                            value={data.averageYield}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Average Yield")}
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
                            {t("Market")}<span className="text-danger">*</span>
                            </Form.Label>
                            <Col>
                            <div className="form-control-wrap">
                                <Form.Select
                                name="marketId"
                                value={data.marketId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
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
                        <Form.Label htmlFor="sordfl">
                          {t("Bidding Slip LOt No")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="biddingSlipNo"
                            name="biddingSlipNo"
                            value={data.biddingSlipNo}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Bidding Slip LOt No")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Bidding Slip LOt No is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Cocoon Rate Per Kg")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="cocoonRatePerKg"
                            name="cocoonRatePerKg"
                            value={data.cocoonRatePerKg}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Bidding Slip No")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                          Screening Batch No is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Transaction Date")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="Date of seed cocoon supply">
                        <DatePicker
                            selected={data.transactionDate ? new Date(data.transactionDate) : null}
                            onChange={(date) =>
                            handleDateChange(date, "transactionDate")
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
                        {t("Brushing Date")}
                        {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="Date of seed cocoon supply">
                        <DatePicker
                            selected={data.dateOfBrushing ? new Date(data.dateOfBrushing) : null}
                            onChange={(date) =>
                            handleDateChange(date, "dateOfBrushing")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            // maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            // required
                        />
                        </div>
                    </Form.Group>
                    </Col>


                    <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Date Of Chawki Distribution")}
                        {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="Date of seed cocoon supply">
                        <DatePicker
                            selected={data.dateOfDistributionOfChawkiWorms ? new Date(data.dateOfDistributionOfChawkiWorms) : null}
                            onChange={(date) =>
                            handleDateChange(date, "dateOfDistributionOfChawkiWorms")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            // maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            // required
                        />
                        </div>
                    </Form.Group>
                    </Col>

                    <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Spun on Date(From)")}
                        {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="Date of seed cocoon supply">
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
                            // required
                        />
                        </div>
                    </Form.Group>
                    </Col>

                    <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Spun on Date(To)")}
                        {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="Date of seed cocoon supply">
                        <DatePicker
                            selected={data.spunOnToDate ? new Date(data.spunOnToDate) : null}
                            onChange={(date) =>
                            handleDateChange(date, "spunOnToDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            // maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            // required
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
                  <Button type="submit" variant="primary">
                    {t("Save")}
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    {t("Cancel")}
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

export default CropDetailsCommercialMarketEdit;
