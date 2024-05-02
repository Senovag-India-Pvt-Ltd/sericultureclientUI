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

const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function RegisteredSeedProducerNssoGrainagesEdit() {
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
        .post(baseURLSeedDfl + `EggPreparationRsso/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              numberOfCocoonsCB: "",
              sourceMasterId: "",
              dateOfMothEmergence: "",
              laidOnDate: "",
              eggSheetSerialNumber: "",
              numberOfPairs: "",
              numberOfRejection: "",
              dflsObtained: "",
              eggRecoveryPercentage: "",
              testResults: "",
              certification: "",
              additionalRemarks: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          // const message = err.response.data.errorMessages[0].message[0].message;
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      numberOfCocoonsCB: "",
      sourceMasterId: "",
      dateOfMothEmergence: "",
      laidOnDate: "",
      eggSheetSerialNumber: "",
      numberOfPairs: "",
      numberOfRejection: "",
      dflsObtained: "",
      eggRecoveryPercentage: "",
      testResults: "",
      certification: "",
      additionalRemarks: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `EggPreparationRsso/get-info-by-id/${id}`)
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

   

 // to get Source 
 const [sourceListData, setSourceListData] = useState([]);

 const getSourceList = () => {
   const response = api
     .get(baseURL2 + `sourceMaster/get-all`)
     .then((response) => {
       setSourceListData(response.data.content.sourceMaster);
     })
     .catch((err) => {
       setSourceListData([]);
     });
 };

 useEffect(() => {
   getSourceList();
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
    <Layout title="Edit Registered Seed Producer (RSP) NSSO Grainages">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Edit Registered Seed Producer (RSP) NSSO Grainages
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/registered-seed-producer-nsso-grainages-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/registered-seed-producer-nsso-grainages-list"
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
              Registered Seed Producer (RSP) NSSO Grainages{" "}
            </Card.Header>
            <Card.Body>
              <Row className="g-gs">
              <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Number of Cocoons (CB, Hybrid)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numberOfCocoonsCB"
                            name="numberOfCocoonsCB"
                            type="number"
                            value={data.numberOfCocoonsCB}
                            onChange={handleInputs}
                            placeholder="Enter Number of Cocoons CB"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Number of Cocoons CB is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Source<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="sourceMasterId"
                            value={data.sourceMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            // multiple
                            required
                            isInvalid={
                              data.sourceMasterId === undefined ||
                              data.sourceMasterId === "0"
                            }
                          >
                            <option value="">Select Source</option>
                            {sourceListData.map((list) => (
                              <option
                                key={list.sourceMasterId}
                                value={list.sourceMasterId}
                              >
                                {list.sourceMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Source is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Date of moth emergence
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={
                              data.dateOfMothEmergence
                              ? new Date(data.dateOfMothEmergence)
                                : null
                                }
                            onChange={(date) =>
                              handleDateChange(date, "dateOfMothEmergence")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            maxDate={new Date()}
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
                            selected={
                              data.laidOnDate
                              ? new Date(data.laidOnDate)
                                : null
                                }
                            onChange={(date) =>
                              handleDateChange(date, "laidOnDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Egg sheet serial number
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="eggSheetSerialNumber"
                            name="eggSheetSerialNumber"
                            type="number"
                            value={data.eggSheetSerialNumber}
                            onChange={handleInputs}
                            placeholder="Enter Egg sheet serial number"                        required
                          />
                          <Form.Control.Feedback type="invalid">
                            Egg sheet serial number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Number of pairs
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numberOfPairs"
                            name="numberOfPairs"
                            type="number"
                            value={data.numberOfPairs}
                            onChange={handleInputs}
                            placeholder="Enter Number of pairs"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Number of pairs is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Number of Rejection
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numberOfRejection"
                            name="numberOfRejection"
                            type="number"
                            value={data.numberOfRejection}
                            onChange={handleInputs}
                            placeholder="Enter Number of Rejection"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Number of Rejection is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          DFLs obtained
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="dflsObtained"
                            name="dflsObtained"
                            type="number"
                            value={data.dflsObtained}
                            onChange={handleInputs}
                            placeholder="Enter DFLs obtained"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            DFLs obtained is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Egg Recovery %<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="eggRecoveryPercentage"
                            name="eggRecoveryPercentage"
                            type="number"
                            value={data.eggRecoveryPercentage}
                            onChange={handleInputs}
                            placeholder="Enter Egg Recovery %"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Egg Recovery % is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>


                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Test results
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="testResults"
                            name="testResults"
                            type="text"
                            value={data.testResults}
                            onChange={handleInputs}
                            placeholder="Enter Test results"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Test results is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Certification (Yes/No)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="certification"
                            name="certification"
                            type="text"
                            value={data.certification}
                            onChange={handleInputs}
                            placeholder="Enter Certification (Yes/No)"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Certification (Yes/No) is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Additional remarks
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="additionalRemarks"
                            name="additionalRemarks"
                            type="text"
                            value={data.additionalRemarks}
                            onChange={handleInputs}
                            placeholder="Enter Additional remarks"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Additional remarks is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="gap-col mt-1">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                {/* <Button type="button" variant="primary" onClick={postData}> */}
                <Button type="submit" variant="primary">
                  Update
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

export default RegisteredSeedProducerNssoGrainagesEdit;
