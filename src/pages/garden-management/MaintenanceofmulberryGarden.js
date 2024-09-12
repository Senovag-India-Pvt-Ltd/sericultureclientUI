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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function MaintenanceofmulberryGarden() {
  const [data, setData] = useState({
    plotNumber: "",
    variety: "",
    areaUnderEachVariety: "",
    pruningDate: "",
    soilTypeId: "",
    mulberrySpacing: "",
    plantationDate: "",
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
      const { pruningDate } = data;
      const formattedDate =
        pruningDate.getFullYear() +
        "-" +
        (pruningDate.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        pruningDate.getDate().toString().padStart(2, "0");
      // event.stopPropagation();
      api
        .post(baseURL2 + `Mulberry-garden/add-info`, {
          ...data,
          pruningDate: formattedDate,
        })
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
              soilTypeId: "",
              mulberrySpacing: "",
              plantationDate: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
          
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
      soilTypeId: "",
      mulberrySpacing: "",
      plantationDate: "",
    });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // to get Mulberry Variety
  const [varietyListData, setVarietyListData] = useState([]);

  const getVarietyList = () => {
    const response = api
      .get(baseURL + `mulberry-variety/get-all`)
      .then((response) => {
        setVarietyListData(response.data.content.mulberryVariety);
      })
      .catch((err) => {
        setVarietyListData([]);
      });
  };

  useEffect(() => {
    getVarietyList();
  }, []);

  // to get Soil Type
  const [soilTypeListData, setSoilTypeListData] = useState([]);

  const getSoilTypeList = () => {
    const response = api
      .get(baseURL2 + `soilType/get-all`)
      .then((response) => {
        setSoilTypeListData(response.data.content.soilType);
      })
      .catch((err) => {
        setSoilTypeListData([]);
      });
  };

useEffect(() => {
  getSoilTypeList();
  getVarietyList();
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

      <Block className="mt-n4">
        <Form noValidate validated={validated} onSubmit={postData}>
          {/* <Row className="g-3 "> */}
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
              Maintenance Of Mulberry Garden
            </Card.Header>
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
                      <Form.Control.Feedback type="invalid">
                        Plot Number is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
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
                        isInvalid={
                          data.variety === undefined || data.variety === "0"
                        }
                      >
                        <option value="">Select Mulberry Variety</option>
                        {varietyListData.map((list) => (
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
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="areaUnderEachVariety">
                      Area(In Acres)
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="areaUnderEachVariety"
                        name="areaUnderEachVariety"
                        value={data.areaUnderEachVariety}
                        onChange={handleInputs}
                        maxLength="4"
                        type="text"
                        placeholder="Enter Area(In Hectares)"
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Soil Type<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="soilTypeId"
                        value={data.soilTypeId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        // multiple
                        required
                        isInvalid={
                          data.variety === undefined || data.variety === "0"
                        }
                      >
                        <option value="">Select Soil Type</option>
                        {soilTypeListData.map((list) => (
                          <option key={list.soilTypeId} value={list.soilTypeId}>
                            {list.soilTypeName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Soil Type is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="mulberrySpacing">
                      Mulberry Spacing
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="mulberrySpacing"
                        name="mulberrySpacing"
                        value={data.mulberrySpacing}
                        onChange={handleInputs}
                        maxLength="4"
                        type="text"
                        placeholder="Enter Mulberry Spacing"
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="2">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      Pruning Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.pruningDate ? new Date(data.pruningDate) : null}
                        onChange={(date) =>
                          handleDateChange(date, "pruningDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        // maxDate={new Date()}
                        className="form-control"
                        required
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="2">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      Plantation Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.plantationDate ? new Date(data.plantationDate) : null}
                        onChange={(date) =>
                          handleDateChange(date, "plantationDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        // maxDate={new Date()}
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
          {/* </Row> */}
        </Form>
      </Block>
    </Layout>
  );
}
export default MaintenanceofmulberryGarden;
