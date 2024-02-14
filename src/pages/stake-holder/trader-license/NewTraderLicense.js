import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon, Select } from "../../../components";
import DatePicker from "../../../components/Form/DatePicker";
// import axios from "axios";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function NewTraderLicense() {
  const [data, setData] = useState({
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

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
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
        .post(baseURL2 + `trader-license/add`, data)
        .then((response) => {
          saveSuccess();
        })
        .catch((err) => {
          setData({});
          saveError(err.response.data.validationErrors);
        });
      setValidated(true);
    }
  };

  // const postData = (e) => {
  //   console.log("Data to be sent:", data);
  //   axios
  //     .post(baseURL2 + `trader-license/add`, data, {
  //       headers: _header,
  //     })
  //     .then((response) => {
  //       console.log("Response from server:", response.data);
  //       saveSuccess();
  //     })
  //     .catch((err) => {
  //       console.error("Error from server:", err);
  //       console.log("Detailed error response:", err.response); // Log the detailed error response
  //       setData({}); // You might want to handle the error and state appropriately
  //       saveError();
  //     });
  // };

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
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("/seriui/issue-new-trader-license-list");
    });
  };
  const saveError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      html: Object.values(message).join("<br>"),
    });
  };

  return (
    <Layout title="New Trader License">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">New Trader License</Block.Title>
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

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group">
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
                    </Form.Group>

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
                      <Form.Label htmlFor="licenseFee">License Fee</Form.Label>
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
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </li>
                <li>
                  <Link
                    to="/seriui/issue-new-trader-license-list"
                    className="btn btn-secondary border-0"
                  >
                    Cancel
                  </Link>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default NewTraderLicense;
