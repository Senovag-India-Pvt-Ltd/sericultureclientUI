import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Icon, Select } from "../../../components";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function ExternalUnitRegister() {
  const [data, setData] = useState({
    externalUnitTypeId: "",
    name: "",
    address: "",
    licenseNumber: "",
    externalUnitNumber: "",
    organisationName: "",
    raceMasterId: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
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
        .post(baseURL2 + `external-unit-registration/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
          saveSuccess();
          setData({
            externalUnitTypeId: "",
            name: "",
            address: "",
            licenseNumber: "",
            externalUnitNumber: "",
            organisationName: "",
            raceMasterId: "",
          });
          setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      externalUnitTypeId: "",
      name: "",
      address: "",
      licenseNumber: "",
      externalUnitNumber: "",
      organisationName: "",
      raceMasterId: "",
    });
  };

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

  // to get external Unit
  const [externalUnitTypeListData, setExternalUnitTypeListData] = useState([]);

  const getExternalUnitTypeList = () => {
    const response = api
      .get(baseURL + `externalUnitType/get-all`)
      .then((response) => {
        setExternalUnitTypeListData(response.data.content.externalUnitType);
      })
      .catch((err) => {
        setExternalUnitTypeListData([]);
      });
  };

  useEffect(() => {
    getExternalUnitTypeList();
  }, []);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    })
  };
  const saveError = (message) => {
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

  return (
    <Layout title="External Units Registration(CRC,RSP,NSSO)">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              External Units Registration(CRC,RSP,NSSO)
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/external-unit-registration-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/external-unit-registration-list"
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
                      <Form.Label>
                        Select External Unit
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="externalUnitTypeId"
                          value={data.externalUnitTypeId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.externalUnitTypeId === undefined ||
                            data.externalUnitTypeId === "0"
                          }
                        >
                          <option value="">Select External Unit</option>
                          {externalUnitTypeListData.map((list) => (
                            <option
                              key={list.externalUnitTypeId}
                              value={list.externalUnitTypeId}
                            >
                              {list.externalUnitTypeName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          External Unit Type is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="name">Name of the Unit</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="name"
                          name="name"
                          value={data.name}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Name"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="name">
                        Name of the Owner/Organisation
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="organisationName"
                          name="organisationName"
                          value={data.organisationName}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Name of the Owner/Organisation"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="externalUnitNumber">
                        External Units ID
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="externalUnitNumber"
                          name="externalUnitNumber"
                          value={data.externalUnitNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter External Units ID"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>Select Race</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="raceMasterId"
                          value={data.raceMasterId}
                          onChange={handleInputs}
                        >
                          <option value="0">Select Race</option>
                          {raceListData.map((list) => (
                            <option
                              key={list.raceMasterId}
                              value={list.raceMasterId}
                            >
                              {list.raceMasterName}
                            </option>
                          ))}
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
                      <Form.Label htmlFor="licenseNumber">
                        License Number
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="licenseNumber"
                          name="licenseNumber"
                          value={data.licenseNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter License Number"
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

export default ExternalUnitRegister;
