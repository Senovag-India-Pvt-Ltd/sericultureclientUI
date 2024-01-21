import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link,useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Icon,
  Select,
} from "../../../components";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function ExternalUnitRegisterEdit() {
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
        .post(baseURL2 + `external-unit-registration/edit`, data)
        .then((response) => {
          updateSuccess();
        })
        .catch((err) => {
          // const message = err.response.data.errorMessages[0].message[0].message;
          updateError();
          setData({});
        });
        setValidated(true);
      }
    };
  
    //   to get data from api
    const getIdList = () => {
      setLoading(true);
      const response = api
        .get(baseURL2 + `external-unit-registration/get/${id}`)
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
  
    const updateSuccess = () => {
      Swal.fire({
        icon: "success",
        title: "Updated successfully",
        // text: "You clicked the button!",
      }).then(() => navigate("/external-unit-registration-list"));
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
      }).then(() => navigate("/external-unit-registration-list"));
    };
  
    return (
      <Layout title="External Unit Register Edit">
        <Block.Head>
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2">External Unit Register Edit</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/external-unit-registration-list"
                    className="btn btn-primary btn-md d-md-none"
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go to List</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/external-unit-registration-list"
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
                      <Form.Group className="form-group">
                      <Form.Label> External Unit<span className="text-danger">*</span></Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="externalUnitTypeId"
                          value={data.externalUnitTypeId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs} 
                          required
                          isInvalid={data.externalUnitTypeId === undefined || data.externalUnitTypeId === "0"}
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
                      <Form.Label htmlFor="name">Name of the Owner/Organisation</Form.Label>
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

                    {/* <Form.Group className="form-group">
                      <Form.Label htmlFor="lotNumber">
                        Lot Number Nomenclature
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lotNumber"
                          name="lotNumber"
                          value={data.lotNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Lot Number Nomenclature"
                        />
                      </div>
                    </Form.Group> */}
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
                    <Link
                      to="/external-unit-registration-list"
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
  
  export default ExternalUnitRegisterEdit;