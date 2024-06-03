import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "../../../components/Form/DatePicker";
import { useState, useEffect } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function NewTraderLicenseEdit() {
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

  const handleDateChange = (newDate) => {
    setData({ ...data, applicationDate: newDate });
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
        .post(baseURL2 + `trader-license/edit`, data)
        .then((response) => {
          updateSuccess();
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
          setData({
            arnNumber: "",
            traderTypeMasterId: "",
            firstName: "",
            middleName: "",
            lastName: "",
            fatherName: "",
            districtId: "",
            stateId: "",
            address: "",
            premisesDescription: "",
            applicationDate: "2023-11-09T12:59:58.303+00:00",
            applicationNumber: "",
            traderLicenseNumber: "",
            representativeDetails: "",
            licenseFee: "",
            licenseChallanNumber: "",
            godownDetails: "",
            silkExchangeMahajar: "",
            licenseNumberSequence: "", 
          });
          setValidated(false);
        }
        })
        .catch((err) => {
          if (
            err.response &&
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
      arnNumber: "",
      traderTypeMasterId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      fatherName: "",
      districtId: "",
      stateId: "",
      address: "",
      premisesDescription: "",
      applicationDate: "2023-11-09T12:59:58.303+00:00",
      applicationNumber: "",
      traderLicenseNumber: "",
      representativeDetails: "",
      licenseFee: "",
      licenseChallanNumber: "",
      godownDetails: "",
      silkExchangeMahajar: "",
      licenseNumberSequence: "", 
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `trader-license/get/${id}`)
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

  // to get traderType Unit
  const [traderTypeListData, setTraderTypeListData] = useState([]);

  const getTraderTypeList = () => {
    const response = api
      .get(baseURL + `traderTypeMaster/get-all`)
      .then((response) => {
        setTraderTypeListData(response.data.content.traderTypeMaster);
      })
      .catch((err) => {
        setTraderTypeListData([]);
      });
  };

  useEffect(() => {
    getTraderTypeList();
  }, []);

  // to get State
  const [stateListData, setStateListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `state/get-all`)
      .then((response) => {
        setStateListData(response.data.content.state);
      })
      .catch((err) => {
        setStateListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = (_id) => {
    const response = api
      .get(baseURL + `district/get-by-state-id/${_id}`)
      .then((response) => {
        setDistrictListData(response.data.content.district);
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.stateId) {
      getDistrictList(data.stateId);
    }
  }, [data.stateId]);

  const navigate = useNavigate();

  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    })
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
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("/seriui/issue-new-trader-license-list"));
  };

  return (
    <Layout title="New Trader License Edit">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">New Trader License Edit</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/issue-new-trader-license-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/issue-new-trader-license-list"
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

      <Block className="mt-4">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
                  <Row className="g-gs">
                    <Col lg="6">
                      {/* <Form.Group className="form-group">
                        <Form.Label htmlFor="arnNumber">ARN Number</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="arnNumber"
                            name="arnNumber"
                            value={data.arnNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter ARN Number"
                          />
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group">
                        <Form.Label>
                          Trader Type<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="traderTypeMasterId"
                            value={data.traderTypeMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.traderTypeMasterId === undefined ||
                              data.traderTypeMasterId === "0"
                            }
                          >
                            <option value="">Select Trader Type</option>
                            {traderTypeListData.map((list) => (
                              <option
                                key={list.traderTypeMasterId}
                                value={list.traderTypeMasterId}
                              >
                                {list.traderTypeMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Trader Type is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label htmlFor="firstName">
                          Name of the Applicant
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="firstName"
                            name="firstName"
                            value={data.firstName}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Name of the Applicant"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label htmlFor="fatherName">
                          Father's Name
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="fatherName"
                            name="fatherName"
                            value={data.fatherName}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Father's Name"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label>State</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="stateId"
                            value={data.stateId}
                            onChange={handleInputs}
                          >
                            <option value="0">Select State</option>
                            {stateListData.map((list) => (
                              <option key={list.stateId} value={list.stateId}>
                                {list.stateName}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label>District</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="districtId"
                            value={data.districtId}
                            onChange={handleInputs}
                          >
                            <option value="">Select District</option>
                            {districtListData.length
                              ? districtListData.map((list) => (
                                  <option
                                    key={list.districtId}
                                    value={list.districtId}
                                  >
                                    {list.districtName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label htmlFor="address">Address</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="address"
                            name="address"
                            value={data.address}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Address"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label htmlFor="premisesDescription">
                          Premises Description
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="premisesDescription"
                            name="premisesDescription"
                            value={data.premisesDescription}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Premises Description"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      {/* <Form.Group className="form-group">
                      <Form.Label>Application Date</Form.Label>
                      <div className="form-control-wrap">
                      <DatePicker selected={new Date("2023-11-21")}/>
                      <DatePicker selected={data.applicationDate} onChange={handleDateChange} />
                      </div>
                    </Form.Group> */}

                      <Form.Group className="form-group">
                        <Form.Label htmlFor="applicationNumber">
                          Application Number
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="applicationNumber"
                            name="applicationNumber"
                            value={data.applicationNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Application Number"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label htmlFor="traderLicenseNumber">
                          Trader License Number
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="traderLicenseNumber"
                            name="traderLicenseNumber"
                            value={data.traderLicenseNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Trader License Number"
                          />
                        </div>
                      </Form.Group>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="representativeDetails">
                          Representative Details
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="representativeDetails"
                            name="representativeDetails"
                            value={data.representativeDetails}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Representative Details"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label htmlFor="licenseFee">
                          License Fee
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="licenseFee"
                            name="licenseFee"
                            value={data.licenseFee}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter License Fee"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label htmlFor="licenseChallanNumber">
                          License Challan Number
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="licenseChallanNumber"
                            name="licenseChallanNumber"
                            value={data.licenseChallanNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Challan Number"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label htmlFor="godownDetails">
                          Godown Details
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="godownDetails"
                            name="godownDetails"
                            value={data.godownDetails}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Godown Details"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label htmlFor="silkExchangeMahajar">
                          Corresponding Silk Exchange Mahajar
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="silkExchangeMahajar"
                            name="silkExchangeMahajar"
                            value={data.silkExchangeMahajar}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Corresponding Silk Exchange Mahajar"
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
                    Update
                  </Button>
                </li>
                <li>
                <Button type="button" variant="secondary" onClick={clear}>
                    Clear
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

export default NewTraderLicenseEdit;
