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

function RearingofDFLs() {
  const [data, setData] = useState({
    disinfectantMasterId: "",
    cropNumber: "",
    lotNumberId: "",
    coldStorageDetails: "",
    releasedOnDate: "",
    brushingDate: "",
    chawkiPercentage: "",
    wormWeight: "",
    spunOnDate: "",
    wormTestDetails: "",
    cocoonAssessmentDetails: "",
  });


  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
    if(name=== "lotNumberId"){
      getSourceList(value);
    }
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
        .post(baseURL2 + `Rearing-of-dfls/add-info`, data)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({
              disinfectantMasterId: "",
              cropNumber: "",
              lotNumberId: "",
              coldStorageDetails: "",
              releasedOnDate: "",
              brushingDate: "",
              chawkiPercentage: "",
              wormWeight: "",
              spunOnDate: "",
              wormTestDetails: "",
              cocoonAssessmentDetails: "",
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
      disinfectantMasterId: "",
      cropNumber: "",
      lotNumberId: "",
      coldStorageDetails: "",
      releasedOnDate: "",
      brushingDate: "",
      chawkiPercentage: "",
      wormWeight: "",
      spunOnDate: "",
      wormTestDetails: "",
      cocoonAssessmentDetails: "",
    });
    setLot({
    raceOfDfls: "",
    grainage: "",
    numberOfDFLsReceived: "",
    laidOnDate: "",});
  };

 

  const [lot ,setLot] = useState({
    raceOfDfls: "",
    grainage: "",
    numberOfDFLsReceived: "",
    laidOnDate: "",
  })

  const [lotNumberListData, setLotNumberListData] = useState([]);

  const getLotNumberList = () => {
    const response = api
      .get(baseURL2 + `lot-number-master/get-info`)
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

  const getSourceList = (_id) => {
    const response = api
      .get(baseURL2 + `lot-number-master/get-info-by-id/${_id}`)
      .then((response) => {
        if (response.data) {
          setLot(response.data);
          
        }
      })
      .catch((err) => {
      });
  };
 
  


  // to get DisInfactant Variety
  const [disinfactantListData, setDisinfactantListData] = useState([]);

  const getDisinfactantList = () => {
    const response = api
      .get(baseURL + `disinfectantMaster/get-all`)
      .then((response) => {
        setDisinfactantListData(response.data.content.disinfectantMaster);
      })
      .catch((err) => {
        setDisinfactantListData([]);
      });
  };

  useEffect(() => {
    getDisinfactantList();
  }, []);

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

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
    <Layout title="Rearing of DFLs ">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Rearing of DFLs </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/rearing-of-dfls-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/rearing-of-dfls-list"
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
              Rearing Of DFLs
            </Card.Header>
            <Card.Body>
              {/* <h3>Farmers Details</h3> */}
              <Row className="g-gs">
              <Col lg="4">
                    <Form.Group className="form-group ">
                      <Form.Label>
                        Disinfactant Usage Details
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="disinfectantMasterId"
                            value={data.disinfectantMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                          >
                            <option value="">Select Disinfactant Usage</option>
                            {disinfactantListData.map((list) => (
                              <option
                                key={list.disinfectantMasterId}
                                value={list.disinfectantMasterId}
                              >
                                {list.disinfectantMasterName}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="plotNumber">
                      Crop Number<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="cropNumber"
                        name="cropNumber"
                        value={data.cropNumber}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Crop Number"
                        required
                      />
                    </div>
                  </Form.Group>
                  <Form.Control.Feedback type="invalid">
                    Crop Number is required
                  </Form.Control.Feedback>
                </Col>

                {/* <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="plotNumber">
                        Lot Number<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lotNumber"
                          name="lotNumber"
                          value={data.lotNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Lot Number"
                          required
                        />
                      </div>
                    </Form.Group>
                    <Form.Control.Feedback type="invalid">
                      Lot Number is required
                    </Form.Control.Feedback>
                  </Col> */}

                <Col lg="4">
                  <Form.Group className="form-group">
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

                {/* <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Source
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="grainage"
                          value={lot.grainage}
                          onChange={handleInputs}
                          // onBlur={() => handleInputs}
                          disabled
                        >
                          <option value="">Select Source</option>
                          {sourceListData.map((list) => (
                            <option key={list.grainage} value={list.grainage}>
                              {list.grainage}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>


                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Number Of DFLs
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="numberOfDFLsReceived"
                          value={lot.numberOfDFLsReceived}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          disabled
                        >
                          <option value="">Select No Of DFLs</option>
                          {dflsListData.map((list) => (
                            <option key={list.numberOfDFLsReceived} value={list.numberOfDFLsReceived}>
                              {list.numberOfDFLsReceived}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                     Race Of DFLs
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="raceOfDfls"
                          value={lot.raceOfDfls}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          disabled
                        >
                          <option value="">Select Race Of DFLs</option>
                          {raceListData.map((list) => (
                            <option key={list.raceOfDfls} value={list.raceOfDfls}>
                              {list.raceOfDfls}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                     Laid On Date
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="laidOnDate"
                          value={lot.laidOnDate}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          disabled
                        >
                          <option value="">Select Laid On Date</option>
                          {laidListData.map((list) => (
                            <option key={list.laidOnDate} value={list.laidOnDate}>
                              {list.laidOnDate}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Col>
                  </Form.Group>
                </Col> */}

                <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="plotNumber">
                        Race Of Dfls
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="raceOfDfls"
                          name="raceOfDfls"
                          value={lot.raceOfDfls}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Race Of Dfls"
                          readOnly
                        />
                      </div>
                    </Form.Group>
                  </Col>


                <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="plotNumber">
                        Source
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="grainage"
                          name="grainage"
                          value={lot.grainage}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Source"
                          readOnly
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="plotNumber">
                        No Of DFLs received
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="numberOfDFLsReceived"
                          name="numberOfDFLsReceived"
                          value={lot.numberOfDFLsReceived}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Number Of DFLs"
                          readOnly
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="plotNumber">
                        Laid On Date
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="laidOnDate"
                          name="laidOnDate"
                          value={lot.laidOnDate}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Laid On Date"
                          readOnly
                        />
                      </div>
                    </Form.Group>
                  </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="coldStorageDetails">
                      Cold Storage Details
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="coldStorageDetails"
                        name="coldStorageDetails"
                        value={data.coldStorageDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter  Cold Storage Details"
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="plotNumber">
                      Chawki Percentage
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="chawkiPercentage"
                        name="chawkiPercentage"
                        value={data.chawkiPercentage}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Chawki Percentage"
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="plotNumber">
                      Worm Weight(In Grams)
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="wormWeight"
                        name="wormWeight"
                        value={data.wormWeight}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter  Cold Storage Details"
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="plotNumber">
                      Worm Test Details
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="wormTestDetails"
                        name="wormTestDetails"
                        value={data.wormTestDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Worm Test Details"
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="plotNumber">
                      Cocoon Assessment Details
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="cocoonAssessmentDetails"
                        name="cocoonAssessmentDetails"
                        value={data.cocoonAssessmentDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Cocoon Assessment Details"
                      />
                    </div>
                  </Form.Group>
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
                      onChange={(date) => handleDateChange(date, "brushingDate")}
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
                  Released On Date
                  <span className="text-danger">*</span>
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    {/* <DatePicker
                          selected={data.dob}
                          onChange={(date) => handleDateChange(date, "dob")}
                        /> */}
                    <DatePicker
                      selected={data.releasedOnDate}
                      onChange={(date) =>
                        handleDateChange(date, "releasedOnDate")
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
                  Spun Date
                  <span className="text-danger">*</span>
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    {/* <DatePicker
                          selected={data.dob}
                          onChange={(date) => handleDateChange(date, "dob")}
                        /> */}
                    <DatePicker
                      selected={data.spunOnDate}
                      onChange={(date) => handleDateChange(date, "spunOnDate")}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                    />
                  </div>
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
export default RearingofDFLs;
