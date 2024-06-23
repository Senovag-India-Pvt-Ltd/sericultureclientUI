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

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ColdStorageScheduleBVEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  const isDataReleaseDate = !!data.dateOfRelease;
  const isDataDepositDate = !!data.dateOfDeposit;
  const isDataLaidDate = !!data.laidOnDate;

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
        .post(baseURLSeedDfl + `Cold-Storage/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
                lotNumber: "",
                laidOnDate: "",
                dateOfDeposit: "",
                scheduleType: "",
                dateOfRelease: "",
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
        lotNumber: "",
        laidOnDate: "",
        dateOfDeposit: "",
        scheduleType: "",
        dateOfRelease: "",
    });
  };


  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `Cold-Storage/get-info-by-id/${id}`)
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

  

   // to get Lot
  const [lotListData, setLotListData] = useState([]);

  const getLotList = () => {
    const response = api
      .get(baseURLSeedDfl + `EggPreparation/get-all-lot-number-list`)
      .then((response) => {
        setLotListData(response.data);
      })
      .catch((err) => {
        setLotListData([]);
      });
  };

  useEffect(() => {
    getLotList();
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
    <Layout title=" Edit Cold Storage Schedule BV">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2"> Edit Cold Storage Schedule BV</Block.Title>
            
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Cold-Storage-Schedule-BV-List"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Cold-Storage-Schedule-BV-List"
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
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
            Edit Cold Storage Schedule BV
                </Card.Header>
                    <Card.Body>
                    {loading ? (
                <h1 className="d-flex justify-content-center align-items-center">
                  Loading...
                </h1>
              ) : (
                        <Row className="g-gs">

                        {/* <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Grainage<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="grainageMasterId"
                              value={data.grainageMasterId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">Select Grainage</option>
                              {grainageListData && grainageListData.length?(grainageListData.map((list) => (
                                <option
                                  key={list.grainageMasterId}
                                  value={list.grainageMasterId}
                                >
                                  {list.grainageMasterName}
                                </option>
                              ))):""}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Grainage is required
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col> */}

                    <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Lot Number
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="lotNumber"
                          value={data.lotNumber}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          // required
                        >
                          <option value="">Select Lot Number</option>
                          {lotListData && lotListData.length?(lotListData.map((list) => (
                            <option key={list.id} value={list.lotNumber}>
                              {list.lotNumber}
                            </option>
                          ))): ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        Lot Number is required
                      </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                {/* <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Schedule Type<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="scheduleType"
                            name="scheduleType"
                            value={data.scheduleType}
                            onChange={handleInputs}
                            type="text"
                            placeholder=" Enter Schedule Type"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Schedule Type is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col> */}

                    <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                              Schedule Type
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="scheduleType"
                                  value={data.scheduleType}
                                  onChange={handleInputs}
                                  required
                                  isInvalid={
                                    data.scheduleType === undefined ||
                                    data.scheduleType === "0"
                                  }
                                >
                                  <option value="">
                                    Select Schedule Type
                                  </option>
                                  <option value="4-Months">4-Months</option>
                                  <option value="6-Months">6-Months</option>\
                                  <option value="10-Months">10-Months</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                Schedule Type is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          
                          <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Laid on Date
                              </Form.Label>
                              <div className="form-control-wrap">
                              {isDataDepositDate && (
                                <DatePicker
                                  selected={new Date(data.laidOnDate)}
                                  onChange={(date) =>
                                    handleDateChange(date, "laidOnDate")
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
                                )}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n4 ">
                              <Form.Label> Date of Deposit</Form.Label>
                              <div className="form-control-wrap">
                              {isDataDepositDate && (
                                <DatePicker
                                  selected={new Date(data.dateOfDeposit)}
                                  onChange={(date) =>
                                    handleDateChange(date, "dateOfDeposit")
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
                                )}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Release Date
                              </Form.Label>
                              <div className="form-control-wrap">
                              {isDataReleaseDate && (
                                <DatePicker
                                  selected={new Date(data.dateOfRelease)}
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
                                )}
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

export default ColdStorageScheduleBVEdit;
