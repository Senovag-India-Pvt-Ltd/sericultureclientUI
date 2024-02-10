import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable, { createTheme } from "react-data-table-component";

import { Link, useParams } from "react-router-dom";

import axios from "axios";

import { Icon, Select } from "../../components";

import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;

function ChawkiManagementEdit() {
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
        .post(baseURL + `chowkimanagement/update-info`, data)
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
      .get(baseURL + `chowkimanagement/get-info-by-id/${id}`)
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
    }).then(() => navigate("/seriui/chawki-management"));
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
    }).then(() => navigate("/seriui/chawki-management"));
  };

  return (
    <Layout title="Chawki-Management">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Chawki-Management</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Chawki-Management
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sale-chawki-worms-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sale-chawki-worms-list"
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
                      <Card.Header> Create / Add Farmer </Card.Header>
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
                                  value={data.fruitsId}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="FRUITS-ID"
                                  required
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
                                  id="lotNumberCrc"
                                  name="lotNumberCrc"
                                  value={data.lotNumberCrc}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Lot No. (CRC)"
                                  required
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
                                  value={data.price}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder=" Price (in Rupees) (optional)"
                                  required
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
                                  value={data.farmerName}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Farmer’s name"
                                  required
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
                                  value={data.village}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder=" Village"
                                  required
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Dispatch date
                              </Form.Label>
                              <div className="form-control-wrap"></div>
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
                                  value={data.fatherName}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder=" fatherName"
                                  required
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
                                  value={data.district}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder=" District"
                                  required
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
                                  id="dflsSource"
                                  name="dflsSource"
                                  value={data.dflsSource}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder=" District"
                                  required
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
                                  value={data.state}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder=" State"
                                  required
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
                                  id="raceOfDfls"
                                  name="raceOfDfls"
                                  value={data.raceOfDfls}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder=" Race of DFLs"
                                  required
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
                                  value={data.tsc}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="TSC"
                                  required
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
                                  id="numbersOfDfls"
                                  name="numbersOfDfls"
                                  value={data.numbersOfDfls}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder=" Number of DFL’s"
                                  required
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
                                  id="soldAfter1stOr2ndMould"
                                  name="soldAfter1stOr2ndMould"
                                  value={data.soldAfter1stOr2ndMould}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder=" Sold after 1st/2nd Moult"
                                  required
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
                                  id="lotNumberRsp"
                                  name="lotNumberRsp"
                                  value={data.lotNumberRsp}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="  Lot Number (of the RSP)"
                                  required
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
                                  id="ratePer100Dfls"
                                  name="ratePer100Dfls"
                                  value={data.ratePer100Dfls}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="    Rate per 100 DFLs(optional)"
                                  required
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="12" className="text-center">
                            <Button type="submit" variant="primary">
                              {" "}
                              Submit{" "}
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Block>
                </Col>
                <Col lg="12">
                  <div> .</div>
                </Col>
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default ChawkiManagementEdit;
