import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import { Link, useParams } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function ChawkidistributiontoFarmersEdit() {
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
        .post(baseURL + `Chawki-distribution/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError();
          } else {
            updateSuccess();
          }
        })
        .catch((err) => {
          setData({});
          updateError();
        });
      setValidated(true);
    }
  };

  // const [chawkiList ,setChawkiList]= useState({
  //   chawki_id: "",
  // })

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    // const chowki_id = chawkiList.chowki_id;
    const response = api
      .get(baseURL + `Chawki-distribution/get-info-by-id/${id}`)
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
  }, []);

  const navigate = useNavigate();
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
  };
  const updateError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: message,
    });
  };
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("#"));
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  return (
    <Layout title="Chawki distribution to Farmers">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Chawki distribution to Farmers</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Chawki distribution to Farmers
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/ChawkidistributiontoFarmers"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Chawki-distribution-to-Farmers"
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

      <Block className="mt-4">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <div>
              <Row className="g-gs">
                <Col lg="12">
                  <Block>
                    <Card>
                      <Card.Header>Chawki distribution to Farmers </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                FRUITS-ID
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="fruitsId"
                                  name="fruitsId"
                                  type="text"
                                  value={data.fruitsId}
                                  onChange={handleInputs}
                                  placeholder="FRUITS-ID"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Farmer’s name
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="farmerName"
                                  name="farmerName"
                                  type="text"
                                  value={data.farmerName}
                                  onChange={handleInputs}
                                  placeholder="Farmer’s name"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Father’s Name
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="fatherName"
                                  name="fatherName"
                                  type="text"
                                  value={data.fatherName}
                                  onChange={handleInputs}
                                  placeholder="Father’s Name"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Source of DFLs
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sourceOfDFLs"
                                  name="sourceOfDFLs"
                                  type="text"
                                  value={data.sourceOfDFLs}
                                  onChange={handleInputs}
                                  placeholder="Source of DFLs"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Race of DFLs
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="raceOfDFLs"
                                  name="raceOfDFLs"
                                  type="text"
                                  value={data.raceOfDFLs}
                                  onChange={handleInputs}
                                  placeholder="Source of DFLs"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Number of DFL’s
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfDFLs"
                                  name="numberOfDFLs"
                                  type="text"
                                  value={data.numberOfDFLs}
                                  onChange={handleInputs}
                                  placeholder="Number of DFL’s"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Lot Number (of the RSP)
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="lotNumberRSP"
                                  name="lotNumberRSP"
                                  type="text"
                                  value={data.lotNumberRSP}
                                  onChange={handleInputs}
                                  placeholder="Lot Number (of the RSP)"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Lot No. (CRC)
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="lotNumberCRC"
                                  name="lotNumberCRC"
                                  type="text"
                                  value={data.lotNumberCRC}
                                  onChange={handleInputs}
                                  placeholder="Lot No. (CRC)"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">Village</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="village"
                                  name="village"
                                  type="text"
                                  value={data.village}
                                  onChange={handleInputs}
                                  placeholder="Village"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">District</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="district"
                                  name="district"
                                  type="text"
                                  value={data.district}
                                  onChange={handleInputs}
                                  placeholder="District"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">State</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="state"
                                  name="state"
                                  type="text"
                                  value={data.state}
                                  onChange={handleInputs}
                                  placeholder="State"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">TSC</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="tsc"
                                  name="tsc"
                                  type="text"
                                  value={data.tsc}
                                  onChange={handleInputs}
                                  placeholder="TSC"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Sold after 1st/2nd Moult
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="soldAfterMoult"
                                  name="soldAfterMoult"
                                  type="text"
                                  value={data.soldAfterMoult}
                                  onChange={handleInputs}
                                  placeholder="Sold after 1st/2nd Moult"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Rate per 100 DFLs(optional)
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="ratePer100DFLs"
                                  name="ratePer100DFLs"
                                  type="text"
                                  value={data.ratePer100DFLs}
                                  onChange={handleInputs}
                                  placeholder="Rate per 100 DFLs(optional)"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Price (in Rupees) (optional)
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="price"
                                  name="price"
                                  type="text"
                                  value={data.price}
                                  onChange={handleInputs}
                                  placeholder="Price (in Rupees) (optional)"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Dispatch date
                              </Form.Label>
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

                          <Col lg="12" className="text-center">
                            <Button type="submit" variant="primary">
                              {" "}
                              Update{" "}
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Block>
                </Col>
                <Col lg="12">
                  <Card>
                    <Card.Body>
                      {/* <h3>Farmers Details</h3> */}
                      <Row className="g-gs">
                        <Col lg="12"></Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default ChawkidistributiontoFarmersEdit;
