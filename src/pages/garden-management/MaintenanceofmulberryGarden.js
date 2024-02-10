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

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function MaintenanceofmulberryGarden() {
  const [data, setData] = useState({
    plotNumber: "",
    variety: "",
    areaUnderEachVariety: "",
    pruningDate: "",
    fertilizerApplicationDate: "",
    fymApplicationDate: "",
    irrigationDate: "",
    brushingDate: "",
    remarks: "",
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
        .post(baseURL2 + `Mulberry-garden/add-info`, data)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({
              plotNumber: "",
              variety: "",
              areaUnderEachVariety: "",
              pruningDate: "",
              fertilizerApplicationDate: "",
              fymApplicationDate: "",
              irrigationDate: "",
              brushingDate: "",
              remarks: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          saveError();
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      plotNumber: "",
      variety: "",
      areaUnderEachVariety: "",
      pruningDate: "",
      fertilizerApplicationDate: "",
      fymApplicationDate: "",
      irrigationDate: "",
      brushingDate: "",
      remarks: "",
    });
  };

  // to get Mulberry Variety
  // const [mulberryVarietyListData, setMulberryVarietyListData] = useState([]);

  // const getMulberryVarietyList = () => {
  //   const response = api
  //     .get(baseURL + `mulberry-variety/get-all`)
  //     .then((response) => {
  //       setMulberryVarietyListData(response.data);
  //     })
  //     .catch((err) => {
  //       setMulberryVarietyListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getMulberryVarietyList();
  // }, []);

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("#");
    });
  };
  const saveError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: message,
    });
  };

  return (
    <Layout title="Maintenance of Mulberry Garden">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Maintenance of Mulberry Garden</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/maintenance-of-mulberry-garden-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/maintenance-of-mulberry-garden-list"
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
                  <Col lg="4">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="plotNumber">
                        Plot Number<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="plotNumber"
                          name="plotNumber"
                          value={data.plotNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Plot Number"
                          required
                        />
                      </div>
                    </Form.Group>
                    <Form.Control.Feedback type="invalid">
                      Plot Number is required
                    </Form.Control.Feedback>
                  </Col>

                  <Col lg="4">
                    {/* <Form.Group className="form-group">
                    <Form.Label>
                      Mulberry Variety<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="variety"
                        value={data.variety}
                        onChange={handleInputs}
                        onBlur={() => handleInputs} 
                        // multiple
                        required
                        isInvalid={data.variety === undefined || data.variety === "0"} 
                      >
                        <option value="">Select Mulberry Variety</option>
                        {mulberryVarietyListData.map((list) => (
                          <option
                            key={list.mulberryVarietyId}
                            value={list.mulberryVarietyId}
                          >
                            {list.mulberryVarietyName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Mulberry Variety is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group> */}
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="trDuration">
                        Mulberry Variety<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="variety"
                          name="variety"
                          value={data.variety}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Mulberry Variety"
                          required
                        />
                      </div>
                    </Form.Group>
                    <Form.Control.Feedback type="invalid">
                      Mulberry Variety is required
                    </Form.Control.Feedback>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="areaUnderEachVariety">
                        Area Under Each Variety
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="areaUnderEachVariety"
                          name="areaUnderEachVariety"
                          value={data.areaUnderEachVariety}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Area Under Each Variety"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Form.Label column sm={2}>
                    Pruning Date
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Col sm={2}>
                    <div className="form-control-wrap">
                      {/* <DatePicker
                          selected={data.dob}
                          onChange={(date) => handleDateChange(date, "dob")}
                        /> */}
                      <DatePicker
                        selected={data.pruningDate}
                        onChange={(date) =>
                          handleDateChange(date, "pruningDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                      />
                    </div>
                  </Col>
                  <Form.Label column sm={2}>
                    Fertilizer Application Date
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Col sm={2}>
                    <div className="form-control-wrap">
                      {/* <DatePicker
                          selected={data.dob}
                          onChange={(date) => handleDateChange(date, "dob")}
                        /> */}
                      <DatePicker
                        selected={data.fertilizerApplicationDate}
                        onChange={(date) =>
                          handleDateChange(date, "fertilizerApplicationDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                      />
                    </div>
                  </Col>
                  {/* </Form.Group>
                  </Col> */}

                  <Form.Label column sm={2}>
                    Farm Yard Manure Application Date
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Col sm={2}>
                    <div className="form-control-wrap">
                      {/* <DatePicker
                          selected={data.dob}
                          onChange={(date) => handleDateChange(date, "dob")}
                        /> */}
                      <DatePicker
                        selected={data.fymApplicationDate}
                        onChange={(date) =>
                          handleDateChange(date, "fymApplicationDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                      />
                    </div>
                  </Col>

                  <Form.Label column sm={2}>
                    Irrigation Date
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Col sm={2}>
                    <div className="form-control-wrap">
                      {/* <DatePicker
                          selected={data.dob}
                          onChange={(date) => handleDateChange(date, "dob")}
                        /> */}
                      <DatePicker
                        selected={data.irrigationDate}
                        onChange={(date) =>
                          handleDateChange(date, "irrigationDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                      />
                    </div>
                  </Col>
                  <Form.Label column sm={2}>
                    Brushing Date
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Col sm={2}>
                    <div className="form-control-wrap">
                      {/* <DatePicker
                          selected={data.dob}
                          onChange={(date) => handleDateChange(date, "dob")}
                        /> */}
                      <DatePicker
                        selected={data.brushingDate}
                        onChange={(date) =>
                          handleDateChange(date, "brushingDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                      />
                    </div>
                  </Col>

                  <Col lg="4" className="mt-n1">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="plotNumber">Remarks</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="remarks"
                          name="remarks"
                          value={data.remarks}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Remarks"
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
export default MaintenanceofmulberryGarden;
