import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable, { createTheme } from "react-data-table-component";

import { Icon, Select } from "../../components";

import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function SupplyofCocoonstoGrainage() {
  const [data, setData] = useState({
    lotNumberId: "",
    numberOfCocoonsDispatched: "",
    grainageId: "",
    dispatchDate: "",
  });

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "20%",
    },
  };

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if(name=== "lotNumberId"){
      getRearingList(value);
    }
  };

  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
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
        .post(baseURL + `supply-cocoons/add-info`, data)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({
              lotNumberId: "",
              numberOfCocoonsDispatched: "",
              grainageId: "",
              dispatchDate: "",
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
      lotNumberId: "",
      numberOfCocoonsDispatched: "",
      grainageId: "",
      dispatchDate: "",
    });
    setLot({
      lotNumber: "",
      raceName: "",
      generationDetails: "",
      laidOnDate: "",
    });
  };

  const [lot ,setLot] = useState({
    lotNumber: "",
    raceName: "",
    generationDetails: "",
    laidOnDate: "",
  })

  // To Get Lot Number
  const [lotNumberListData, setLotNumberListData] = useState([]);

  const getLotNumberList = () => {
    const response = api
      .get(baseURL + `lot-number-master/get-lot-after-rearing`)
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

  const getRearingList = (_id) => {
    const response = api
      .get(baseURL + `lot-number-master/get-lot-after-rearing-by-id/${_id}`)
      .then((response) => {
        if (response.data) {
          setLot(response.data);
          
        }
      })
      .catch((err) => {
      });
  };
 
  // to get Grainage
  const [grainageListData, setGrainageListData] = useState([]);

  const getGrainageList = () => {
    const response = api
      .get(baseURL2 + `grainageMaster/get-all`)
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

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  return (
    <Layout title="Supply of Cocoons to Grainage ">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Supply of Cocoons to Grainage</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/supply-of-cocoons-to-grainage-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/supply-of-cocoons-to-grainage-list"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-0">
            <Card>
              <Card.Header style={{ fontWeight: "bold" }}>
                Supply of Cocoons to Grainage
              </Card.Header>
              <Card.Body>
                <Row className="g-gs">

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Lot Number
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="lotNumberId"
                          value={data.lotNumberId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                        >
                          <option value="">Select Lot Number</option>
                          {lotNumberListData.map((list) => (
                            <option key={list.id} value={list.id}>
                              {list.lotNumber}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">Race of Cocoons</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="raceName"
                          name="raceName"
                          value={lot.raceName}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Race of Cocoons"
                          readOnly
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  
                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="generationDetails">
                        Generation details
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="generationDetails"
                          name="generationDetails"
                          value={lot.generationDetails}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Generation details"
                          readOnly
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        Laid On Date
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="laidOnDate"
                          name="laidOnDate"
                          value={lot.laidOnDate}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Laid On Date"
                          readOnly
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        Number of Cocoons Dispatched
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="numberOfCocoonsDispatched"
                          name="numberOfCocoonsDispatched"
                          value={data.numberOfCocoonsDispatched}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Number of Cocoons Dispatched"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  

                  {/* <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">Generate Invoice</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="generateInvoice"
                          name="generateInvoice"
                          value={data.generateInvoice}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Generate Invoice"
                        />
                      </div>
                    </Form.Group>
                  </Col> */}

                  {/* <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">View Reciept</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="viewReciept"
                          name="viewReciept"
                          value={data.viewReciept}
                          onChange={handleInputs}
                          type="text"
                          placeholder="View Reciept"
                        />
                      </div>
                    </Form.Group>
                  </Col> */}

                  {/* <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">Spun on date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker
                          selected={data.spunOnDate}
                          onChange={(date) =>
                            handleDateChange(date, "spunOnDate")
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
                  </Col> */}

                  <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Grainage<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="grainageId"
                          value={data.grainageId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                        >
                          <option value="">Select Grainage</option>
                          {grainageListData.map((list) => (
                            <option
                              key={list.grainageMasterId}
                              value={list.grainageMasterId}
                            >
                              {list.grainageMasterName}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>


                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">Dispatch Date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker
                          selected={data.dispatchDate}
                          onChange={(date) =>
                            handleDateChange(date, "dispatchDate")
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
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default SupplyofCocoonstoGrainage;
