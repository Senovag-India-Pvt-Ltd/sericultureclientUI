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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function SaleAndDisposalOfEggsNSSOEdit() {
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
        .post(baseURLSeedDfl + `sale-disposal-of-egg/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              lotNumber: "",
              eggSheetNumbers: "",
              raceId: "",
              releaseDate: "",
              dateOfDisposal: "",
              expectedDateOfHatching: "",
              numberOfDflsDisposed: "",
              fruitsId: "",
              nameAndAddressOfTheFarm: "",
              ratePer100DflsPrice: "",
              userType: "farm",
              userTypeId: "",
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
      pebrine: "",
      sourceDetails: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURLSeedDfl + `sale-disposal-of-egg/get-info-by-id/${id}`)
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
    <Layout title="Edit Sale / Disposal of DFL's(eggs) NSSO">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Sale / Disposal of DFL's(eggs) NSSO</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sale-and-disposal-of-eggs-nsso-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sale-and-disposal-of-eggs-nsso-list"
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
        <Card>
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
        </Card>

        {data.userType === "farmer" ? (
          <Form
            noValidate
            validated={searchValidated}
            onSubmit={search}
            className="mt-1"
          >
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group" controlId="fid">
                      <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                        FRUITS ID<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={4}>
                        <Form.Control
                          type="fruitsId"
                          name="fruitsId"
                          value={data.fruitsId}
                          onChange={handleInputs}
                          placeholder="Enter FRUITS ID"
                          required
                          maxLength="16"
                        />
                        <Form.Control.Feedback type="invalid">
                          Fruits ID Should Contain 16 digits
                        </Form.Control.Feedback>
                      </Col>
                      <Col sm={2}>
                        <Button type="submit" variant="primary">
                          Search
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
        ) : (
          ""
        )}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1 ">
            <Block className="mt-3">
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  Sale / Disposal of DFLs 's (egg) s{" "}
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>Lot Number</Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="lotNumber"
                              value={data.lotNumber}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              // required
                            >
                              <option value="">Select Lot Number</option>
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
                              Lot Number is required
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="sordfl">
                          Egg Sheet Numbers
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="eggSheetNumbers"
                            name="eggSheetNumbers"
                            type="number"
                            min="1"
                            value={data.eggSheetNumbers}
                            onChange={handleInputs}
                            placeholder="Enter Egg Sheet Numbers"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Egg Sheet Numbers is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>
                          Race<span className="text-danger">*</span>
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
                            <option value="">Select Race</option>
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
                            Race is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Number of DFLs disposed
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numberOfDflsDisposed"
                            name="numberOfDflsDisposed"
                            value={data.numberOfDflsDisposed}
                            onChange={handleInputs}
                            type="text"
                            maxLength="4"
                            placeholder="Enter Number of DFLs disposed"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Number of DFLs disposed is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    {data.userType === "farm" ? (
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
                              <option value="">Select Farm</option>
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
                    ) : data.userType === "farmer" ? (
                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="sordfl">
                            Name and address farmer
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="nameAndAddressOfTheFarm"
                              name="nameAndAddressOfTheFarm"
                              value={data.nameAndAddressOfTheFarm}
                              onChange={handleInputs}
                              type="text"
                              placeholder=" Enter Name and address farmer"
                              required
                              readOnly
                            />
                            <Form.Control.Feedback type="invalid">
                              Name and address farmer is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    ) : (
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
                              placeholder=" Enter Name and address CRC"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Name and address CRC is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    )}

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Rate per 100 DFLs Price (in Rupees)
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
                            placeholder="Enter Rate per 100 DFLs Price"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Rate per 100 DFLs Price is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    {data.userType === "farm" ? (
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
                              placeholder=" Enter Name and address of Farm"
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
                    )}
                    <Col lg="2">
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
                    </Col>

                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Date of disposal<span className="text-danger">*</span>
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

                    <Col lg="2">
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
                    Save
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    Cancel
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

export default SaleAndDisposalOfEggsNSSOEdit;
