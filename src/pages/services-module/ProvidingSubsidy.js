import { Card, Form, Row, Col, Button, Tab, Nav } from "react-bootstrap";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import DataTable from "../../components/DataTable/DataTable";
import K2StateShares, {
  K2StateSharesColumns,
} from "../../store/masters/subsidy-shares/K2StateSharesData";
import BankCentralShares, {
  BankCentralSharesColumns,
} from "../../store/masters/subsidy-shares/BankCentralSharesData";
import { Icon, Select } from "../../components";
import ProvidingSubsidyData, {
  ProvidingSubsidyColumns,
} from "../../store/masters/servicemodule/ProvidingSubsidyData";

function ProvidingSubsidy() {
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(false);
  const display = () => {
    setIsActive((current) => !current);
  };
  const handleClick = (e) => {
    e.preventDefault();
    navigate("/seriui/subsidy-acknowledge");
  };
  return (
    <Layout title="Apply Subsidy">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Apply Subsidy</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Apply Subsidy
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="#" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
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
        <Form action="#">
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="8">
                    <Form.Group
                      as={Row}
                      className="form-group mt-3"
                      controlId="fid"
                    >
                      <Form.Label column sm={4}>
                        FRUITS ID / AADHAAR NUMBER
                      </Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          type="text"
                          placeholder="FRUITS ID / AADHAAR NUMBER"
                        />
                      </Col>
                      <Col sm={2}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={display}
                        >
                          Search
                        </Button>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className={isActive ? "" : "d-none"}>
              <Row className="g-3 ">
                <Card>
                  <Card.Body>
                    <h3>Farmer Details</h3>

                    <Tab.Container
                      id="vertical-tabs-example"
                      defaultActiveKey="vertical-home"
                    >
                      <Row>
                        <Col lg="3" xl="2">
                          <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                              <Nav.Link eventKey="vertical-home">
                                Pesonal Details
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="vertical-profile">
                                Address Details
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="vertical-contact">
                                Identification details
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="vertical-setting">
                                Land Details
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="vertical-bank">
                                Bank Details
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="vertical-other">
                                Other Details
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                        </Col>
                        <Col lg="9" xl="10">
                          <Tab.Content>
                            <Tab.Pane eventKey="vertical-home">
                              <Row className="g-gs">
                                <Col lg="6">
                                  <Form.Group
                                    as={Row}
                                    className="form-group mt-3"
                                    controlId="farmerName"
                                  >
                                    <Form.Label column sm={4}>
                                      Farmer Name
                                    </Form.Label>
                                    <Col sm={6}>
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter Farmer Name"
                                      />
                                    </Col>
                                  </Form.Group>

                                  <Form.Group
                                    as={Row}
                                    className="form-group mt-3"
                                    controlId="FatherName"
                                  >
                                    <Form.Label column sm={4}>
                                      Father's/Husband's Name
                                    </Form.Label>
                                    <Col sm={6}>
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter Father's/Husband's Name"
                                      />
                                    </Col>
                                  </Form.Group>

                                  <Form.Group
                                    as={Row}
                                    className="form-group mt-3"
                                    controlId="dob"
                                  >
                                    <Form.Label column sm={4}>
                                      Farmer DOB
                                    </Form.Label>
                                    <Col sm={6}>
                                      <div className="form-control-wrap">
                                        <DatePicker />
                                      </div>
                                    </Col>
                                  </Form.Group>

                                  <Form.Group
                                    as={Row}
                                    className="form-group mt-3"
                                    controlId="gender"
                                  >
                                    <Form.Label column sm={4}>
                                      Gender
                                    </Form.Label>
                                    <Col sm={6}>
                                      <div className="form-control-wrap">
                                        <Select removeItemButton>
                                          <option value="">
                                            Select Gender
                                          </option>
                                          <option value="1">Male</option>
                                          <option value="2">Female</option>
                                          <option value="3">
                                            Third Gender
                                          </option>
                                        </Select>
                                      </div>
                                    </Col>
                                  </Form.Group>

                                  <Form.Group
                                    as={Row}
                                    className="form-group mt-3"
                                    controlId="caste"
                                  >
                                    <Form.Label column sm={4}>
                                      Caste
                                    </Form.Label>
                                    <Col sm={6}>
                                      <div className="form-control-wrap">
                                        <Select removeItemButton>
                                          <option value="">Select Caste</option>
                                          <option value="1">SC</option>
                                          <option value="2">ST</option>
                                          <option value="3">BCM</option>
                                          <option value="3">Minority</option>
                                          <option value="3">Others</option>
                                        </Select>
                                      </div>
                                    </Col>
                                  </Form.Group>

                                  <Form.Group
                                    as={Row}
                                    className="form-group mt-3"
                                    controlId="diffable"
                                  >
                                    <Form.Label column sm={4}>
                                      Differently Abled
                                    </Form.Label>
                                    <Col sm={6}>
                                      <div className="form-control-wrap">
                                        <Select removeItemButton>
                                          <option value="">Select</option>
                                          <option value="1">Yes</option>
                                          <option value="2">No</option>
                                        </Select>
                                      </div>
                                    </Col>
                                  </Form.Group>
                                </Col>
                                <Col sm={6}>
                                  <Form.Group
                                    as={Row}
                                    className="form-group mt-3"
                                    controlId="email"
                                  >
                                    <Form.Label column sm={4}>
                                      Email
                                    </Form.Label>
                                    <Col sm={6}>
                                      <div className="form-control-wrap">
                                        <Form.Control
                                          type="email"
                                          placeholder="Enter Email"
                                        />
                                      </div>
                                    </Col>
                                  </Form.Group>

                                  <Form.Group
                                    as={Row}
                                    className="form-group mt-3"
                                    controlId="mobile"
                                  >
                                    <Form.Label column sm={4}>
                                      Mobile Number
                                    </Form.Label>
                                    <Col sm={6}>
                                      <div className="form-control-wrap">
                                        <Form.Control
                                          type="email"
                                          placeholder="Enter Mobile Number"
                                        />
                                      </div>
                                    </Col>
                                  </Form.Group>

                                  <Form.Group
                                    as={Row}
                                    className="form-group mt-3"
                                    controlId="aadhar"
                                  >
                                    <Form.Label column sm={4}>
                                      Aadhar Number
                                    </Form.Label>
                                    <Col sm={6}>
                                      <div className="form-control-wrap">
                                        <Form.Control
                                          type="email"
                                          placeholder="Enter Aadhar Number"
                                        />
                                      </div>
                                    </Col>
                                  </Form.Group>

                                  <Form.Group
                                    as={Row}
                                    className="form-group mt-3"
                                    controlId="epic"
                                  >
                                    <Form.Label column sm={4}>
                                      EPIC Number
                                    </Form.Label>
                                    <Col sm={6}>
                                      <div className="form-control-wrap">
                                        <Form.Control
                                          type="email"
                                          placeholder="Enter EPIC Number"
                                        />
                                      </div>
                                    </Col>
                                  </Form.Group>

                                  <Form.Group
                                    as={Row}
                                    className="form-group mt-3"
                                    controlId="rcard"
                                  >
                                    <Form.Label column sm={4}>
                                      Ration Card
                                    </Form.Label>
                                    <Col sm={6}>
                                      <div className="form-control-wrap">
                                        <Form.Control
                                          type="email"
                                          placeholder="Enter Ration Card"
                                        />
                                      </div>
                                    </Col>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey="vertical-profile"></Tab.Pane>
                            <Tab.Pane eventKey="vertical-contact"></Tab.Pane>
                            <Tab.Pane eventKey="vertical-setting"></Tab.Pane>
                          </Tab.Content>
                        </Col>
                      </Row>
                    </Tab.Container>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <Row className="g-gs">
                      <Col lg="6">
                        <Form.Group className="form-group mt-3">
                          <Form.Label>Financial Year</Form.Label>
                          <div className="form-control-wrap">
                            <Select removeItemButton>
                              <option value="">Select Financial Year</option>
                              <option value="1">2022-2023</option>
                              <option value="2">2023-2024</option>
                            </Select>
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label>Sub Scheme</Form.Label>
                          <div className="form-control-wrap">
                            <Select removeItemButton>
                              <option value="">Select Sub Scheme Name</option>
                              <option value="1">
                                Subsidy for Mulberry garden implements
                              </option>
                              <option value="2">
                                Silkworm rearing equipments
                              </option>
                              <option value="3">
                                Subsidy for construction of Rearing House
                              </option>
                              <option value="4">
                                Subsidy for Chawki garden maintenance
                              </option>
                              <option value="5">Chawki rearing building</option>
                              <option value="6">
                                Chawki rearing equipments
                              </option>
                            </Select>
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label>Head Of Account</Form.Label>
                          <div className="form-control-wrap">
                            <Select removeItemButton>
                              <option value="">Select Head of Account</option>
                              <option value="1">
                                Sericulture Development Programme
                                2851-00-107-1-35
                              </option>
                              <option value="2">
                                Pradhan Manthri Krishi Sinchayi Yojane (PMKSY)
                                2851-00-107-1-49
                              </option>
                              <option value="2">
                                Programs implemented by Price Stabilization Fund
                                2851-00-107-1-51
                              </option>
                              <option value="2">
                                Civil works 4851-00-107-1-01
                              </option>
                              <option value="3">Silk Samagra(CSS)</option>
                            </Select>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group mt-3">
                          <Form.Label> Scheme </Form.Label>
                          <div className="form-control-wrap">
                            <Select removeItemButton>
                              <option value="">Select Scheme Name</option>
                              <option value="1">
                                Subsidy for Mulberry garden implements/ Silkworm
                                rearing equipments
                              </option>
                              <option value="2">
                                Subsidy for construction of Rearing House
                              </option>
                              <option value="3">Supply of disinfectants</option>
                              <option value="4">
                                Subsidy for construction of Mounting Hall
                              </option>
                              <option value="5">
                                Subsidy for installation of Automatic Reeling
                                Machine
                              </option>
                            </Select>
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label>Category</Form.Label>
                          <div className="form-control-wrap">
                            <Select removeItemButton>
                              <option value="">Select Category</option>
                              <option value="1">106(General)</option>
                              <option value="2">422(SC)</option>
                              <option value="3">423(ST)</option>
                            </Select>
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label>Is New Farmer</Form.Label>
                          <div className="form-control-wrap">
                            <ul className="gap g-3 ">
                              <li>
                                <Form.Check
                                  inline
                                  label="Yes"
                                  name="inlineRadioOptions"
                                  type="radio"
                                  id="inlineRadio1"
                                  defaultChecked
                                ></Form.Check>
                                <Form.Check
                                  inline
                                  label="No"
                                  name="inlineRadioOptions"
                                  type="radio"
                                  id="inlineRadio2"
                                ></Form.Check>
                              </li>
                            </ul>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <h3>Machinery Details</h3>

                    <Row className="g-gs mt-4">
                      <Col lg="12">
                        <Block>
                          <Card>
                            <h4 className="mt-4 ms-3">
                              Select survey number for availing benefit
                            </h4>
                            <DataTable
                              tableClassName="data-table-head-light table-responsive"
                              data={ProvidingSubsidyData}
                              columns={ProvidingSubsidyColumns}
                            />
                          </Card>
                        </Block>
                      </Col>

                      {/* <Col lg="6">hello</Col> */}
                    </Row>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <Row className="g-gs">
                      <Col lg="6">
                        <Row className="g-gs">
                          <Col lg="6">
                            <Form.Group className="form-group mt-1">
                              <div className="form-control-wrap">
                                <h3>K2 State Shares</h3>
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row className="g-gs mt-4">
                          <Col lg="12">
                            <Block>
                              <Card>
                                <DataTable
                                  tableClassName="data-table-head-light table-responsive"
                                  data={K2StateShares}
                                  columns={K2StateSharesColumns}
                                />
                              </Card>
                            </Block>
                          </Col>

                          {/* <Col lg="6">hello</Col> */}
                        </Row>
                      </Col>

                      <Col lg="6">
                        <Row className="g-gs">
                          <Col lg="6">
                            <Form.Group className="form-group mt-1">
                              <div className="form-control-wrap">
                                <h3>BANK (Central Shares)</h3>
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="g-gs mt-4">
                          <Col lg="12">
                            <Block>
                              <Card>
                                <DataTable
                                  tableClassName="data-table-head-light table-responsive"
                                  data={BankCentralShares}
                                  columns={BankCentralSharesColumns}
                                />
                              </Card>
                            </Block>
                          </Col>

                          {/* <Col lg="6">hello</Col> */}
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    {/* <h3>Farmers Details</h3> */}
                    <Row className="g-gs">
                      <Col lg="6">
                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="k2">
                            K2 State Shares %
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="k2"
                              type="text"
                              placeholder="Enter K2 State Shares %"
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="subsidydet">
                            Relevant subsidy related details
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="subsidydet"
                              type="text"
                              placeholder="Enter Relevant subsidy related details"
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="farname">
                            Name and address of the farmer
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="farname"
                              type="text"
                              placeholder="Enter Name and address of the farmer"
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="surno">Survey number</Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="surno"
                              type="text"
                              placeholder="Enter Survey number"
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="sond">
                            Sanction order number and date
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="sond"
                              type="text"
                              placeholder="Enter Sanction order number and date"
                            />
                          </div>
                        </Form.Group>

                        {/* <Form.Group className="form-group mt-3">
                      <Form.Label>Market and date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group> */}
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="central">
                            Bank (Central Share) %
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="central"
                              type="text"
                              placeholder="Enter Bank (Central Share) %"
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="subamt">
                            Subsidy amount
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="subamt"
                              type="text"
                              placeholder="Enter Subsidy amount"
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="pursub">
                            Purpose of subsidy
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="pursub"
                              type="text"
                              placeholder="Enter Purpose of subsidy"
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="arn">ARN Number</Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="arn"
                              type="text"
                              placeholder="Enter ARN Number"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <h3>Machine or Equipment Details</h3>
                    <Row className="g-gs">
                      <Col lg="6">
                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="manuname">
                            Manufacturer Name
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="manuname"
                              type="text"
                              placeholder="Enter Manufacturer Name"
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="eqpname">
                            Machine/Equipment Name
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="eqpname"
                              type="text"
                              placeholder="Enter Machine/Equipment Name"
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="impcost">
                            Implement Cost (&#8377;)
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="impcost"
                              type="text"
                              placeholder="Enter Implement Cost (&#8377;)"
                            />
                          </div>
                        </Form.Group>

                        {/* <Form.Group className="form-group mt-3">
                      <Form.Label>Market and date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group> */}
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="subamt">
                            Subsidy Amount (&#8377;)
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="subamt"
                              type="text"
                              placeholder="Enter Subsidy Amount (&#8377;)"
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="farshare">
                            Farmer Share (&#8377;)
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="farshare"
                              type="text"
                              placeholder="Enter Farmer Share (&#8377;)"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="g-gs">
                      <Col lg="12" className="d-flex justify-content-evenly">
                        <Form.Group className="form-group mt-3">
                          <Form.Label>RTC Submitted</Form.Label>
                          <div className="form-control-wrap">
                            <ul className="gap g-3 ">
                              <li>
                                <Form.Check
                                  inline
                                  label="Yes"
                                  name="rtcname"
                                  type="radio"
                                  id="rtc1"
                                  defaultChecked
                                ></Form.Check>
                                <Form.Check
                                  inline
                                  label="No"
                                  name="rtcname"
                                  type="radio"
                                  id="rtc2"
                                ></Form.Check>
                              </li>
                            </ul>
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label>Affidavit Submitted</Form.Label>
                          <div className="form-control-wrap">
                            <ul className="gap g-3 ">
                              <li>
                                <Form.Check
                                  inline
                                  label="Yes"
                                  name="aff"
                                  type="radio"
                                  id="aff1"
                                  defaultChecked
                                ></Form.Check>
                                <Form.Check
                                  inline
                                  label="No"
                                  name="aff"
                                  type="radio"
                                  id="aff2"
                                ></Form.Check>
                              </li>
                            </ul>
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label>NOC Submitted</Form.Label>
                          <div className="form-control-wrap">
                            <ul className="gap g-3 ">
                              <li>
                                <Form.Check
                                  inline
                                  label="Yes"
                                  name="noc"
                                  type="radio"
                                  id="noc1"
                                  defaultChecked
                                ></Form.Check>
                                <Form.Check
                                  inline
                                  label="No"
                                  name="noc"
                                  type="radio"
                                  id="noc2"
                                ></Form.Check>
                              </li>
                            </ul>
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label>RC Book Submitted</Form.Label>
                          <div className="form-control-wrap">
                            <ul className="gap g-3 ">
                              <li>
                                <Form.Check
                                  inline
                                  label="Yes"
                                  name="rc"
                                  type="radio"
                                  id="rc1"
                                  defaultChecked
                                ></Form.Check>
                                <Form.Check
                                  inline
                                  label="No"
                                  name="rc"
                                  type="radio"
                                  id="rc2"
                                ></Form.Check>
                              </li>
                            </ul>
                          </div>
                        </Form.Group>

                        <Form.Group className="form-group mt-3">
                          <Form.Label>Water Source Paper Submitted</Form.Label>
                          <div className="form-control-wrap">
                            <ul className="gap g-3 ">
                              <li>
                                <Form.Check
                                  inline
                                  label="Yes"
                                  name="water"
                                  type="radio"
                                  id="water1"
                                  defaultChecked
                                ></Form.Check>
                                <Form.Check
                                  inline
                                  label="No"
                                  name="water"
                                  type="radio"
                                  id="water2"
                                ></Form.Check>
                              </li>
                            </ul>
                          </div>
                        </Form.Group>

                        {/* <Form.Group className="form-group mt-3">
                      <Form.Label>Market and date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group> */}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <div className="gap-col">
                  <ul className="d-flex align-items-center justify-content-center gap g-3">
                    <li>
                      <Button
                        type="button"
                        onClick={handleClick}
                        variant="primary"
                      >
                        Send for verification to ADS
                      </Button>
                    </li>
                    <li>
                      <Link to="#" className="btn btn-secondary border-0">
                        Cancel
                      </Link>
                    </li>
                  </ul>
                </div>
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default ProvidingSubsidy;
