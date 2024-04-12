import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;
// const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function MaintenanceOfEggsAtCold() {
  const [data, setData] = useState({
    lotNumber: "",
    numberOfDFLs: "",
    dateOfColdStore: "",
    laidOnDate: "",
    dateOfRelease: "",
    incubationDetails: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
  // const handleDateChange = (newDate) => {
  //   setData({ ...data, applicationDate: newDate });
  // };

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
        .post(baseURLSeedDfl + `EggStorage/add-info`, data)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({
              lotNumber: "",
              numberOfDFLs: "",
              dateOfColdStore: "",
              laidOnDate: "",
              dateOfRelease: "",
              incubationDetails: "",
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
      lotNumber: "",
      numberOfDFLs: "",
      dateOfColdStore: "",
      laidOnDate: "",
      dateOfRelease: "",
      incubationDetails: "",
    });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // to get Lot
  const [lotListData, setLotListData] = useState([]);

  const getLotList = () => {
    const response = api
      .get(baseURLSeedDfl + `EggPreparation/get-all-lot-number-list`)
      .then((response) => {
        setLotListData(response.data.EggPreparation);
      })
      .catch((err) => {
        setLotListData([]);
      });
  };

  useEffect(() => {
    getLotList();
  }, []);


  
  const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: message,
    });
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
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };


  return (
    <Layout title="Maintenance of eggs at cold storage NSSO">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Maintenance of eggs at cold storage NSSO
            </Block.Title>
           
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/maintenance-of-eggs-at-cold-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/maintenance-of-eggs-at-cold-list"
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
          {/* <Row className="g-3 "> */}
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
                        Maintenance of eggs at cold storage
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                          {/* <Col lg="4">
                          <Form.Group className="form-group mt-n4 ">
                    <Form.Label htmlFor="plotNumber">
                      Lot Number<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="lotNumber"
                        name="lotNumber"
                        value={data.lotNumber}
                        onChange={handleInputs}
                        maxLength="12"
                        type="text"
                        placeholder="Enter Lot Number"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Lot Number is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>           
                </Col> */}

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                    Lot Number<span className="text-danger">*</span>
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
                          <option value="">Select Lot Number</option>
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
                        Lot Number is required
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="numberOfDFLsReceived">
                      Number Of DFLs 
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="numberOfDFLs"
                        name="numberOfDFLs"
                        value={data.numberOfDFLs}
                        onChange={handleInputs}
                        maxLength="4"
                        type="text"
                        placeholder="Enter Number Of DFLs received"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Number Of DFLs is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Incubation Details
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                   id="incubationDetails"
                                  name="incubationDetails"
                                  value={data.incubationDetails}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Incubation Details"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Date of Cold storage<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="Date of Cold Storage">
                                <DatePicker
                                  selected={data.dateOfColdStore}
                                  onChange={(date) =>
                                    handleDateChange(date, "dateOfColdStore")
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
                      Laid On Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.laidOnDate}
                        onChange={(date) =>
                          handleDateChange(date, "laidOnDate")
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

                
                {/* <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="numberOfDFLsReceived">
                      Grainage Details
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="grainageDetails"
                        name="grainageDetails"
                        value={data.grainageDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Grainage Details"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Grainage Details is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col> */}

                          
                          <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Date of release<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.dateOfRelease}
                                  onChange={(date) =>
                                    handleDateChange(date, "dateOfRelease")
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
                  Cancel
                </Button>
              </li>
            </ul>
          </div>
        </Form>
      </Block>
    </Layout>
  );
}

export default MaintenanceOfEggsAtCold;
