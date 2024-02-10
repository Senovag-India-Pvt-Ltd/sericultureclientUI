import { Card, Form, Row, Col, Button, Tab, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon, Select } from "../../../components";

function AddCompanyPage() {
  return (
    <Layout title="Add Company" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Add Company</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/masters/company-list">Company List</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Add Company
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/masters/company-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="eye" />
                  <span>View</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/masters/company-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="eye" />
                  <span>View Company</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Tab.Container defaultActiveKey="basic-info">
        <Block.HeadBetween>
          <div className="gap-col">
            <Nav variant="pills" className="nav-pills-border gap g-3">
              <Nav.Item>
                <Nav.Link eventKey="basic-info">Basic Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="account">Account</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="address">Address</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          {/* <div className="gap-col">
                    <ul className="d-flex gap g-2">
                        <li className="d-none d-md-block">
                            <Link to={`/user-manage/user-edit/${user.id}`} className="btn btn-soft btn-primary">
                                <Icon name="edit"></Icon>
                                <span>Edit Profile</span>
                            </Link>
                        </li>
                        <li className="d-md-none">
                            <Link to={`/user-manage/user-edit/${user.id}`} className="btn btn-soft btn-primary btn-icon">
                                <Icon name="edit"></Icon>
                            </Link>
                        </li>
                    </ul>
                </div> */}
        </Block.HeadBetween>

        <Block className="mt-4">
          <Tab.Content>
            <Tab.Pane eventKey="basic-info">
              <Form action="#">
                <Row className="g-gs">
                  <Col xxl="12">
                    <div className="gap gy-4">
                      <div className="gap-col">
                        <Card>
                          <Card.Body>
                            <Row className="g-gs">
                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="company-logo">
                                    Company Logo
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="file"
                                      id="company-logo"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="company-name">
                                    Company Name
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="company-name"
                                      placeholder="Company Name"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="company-code">
                                    Company Code
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="company-code"
                                      placeholder="Enter company code"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              {/* <Col lg="12">
                                                    <Form.Group className="form-group">
                                                        <Form.Label htmlFor="tax-class">Parent Category</Form.Label>
                                                        <div className="form-control-wrap">
                                                            <Select removeItemButton>
                                                                <option value="">Select an option</option>
                                                                <option value="1">Toothbrush</option>
                                                                <option value="2">Wines</option>
                                                                <option value="3">Cameras</option>
                                                            </Select>
                                                        </div>
                                                    </Form.Group>
                                                </Col> */}
                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="gst-number">
                                    GSTN Number
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="gst-number"
                                      placeholder="Enter GST Number"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="pan-number">
                                    Pan No.
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="pan-number"
                                      placeholder="Enter PAN Number"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="taan">TAAN</Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="taan"
                                      placeholder="Enter TAAN"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              {/* <Col lg="6">
                                                                <Form.Group className="form-group">
                                                                    <Form.Label>Meta Tag Keywords</Form.Label>
                                                                    <div className="form-control-wrap">
                                                                        <Tags removeItemButton />
                                                                    </div>
                                                                </Form.Group>
                                                            </Col> */}

                              {/* <Col lg="12">
                                                                <Form.Group className="form-group">
                                                                    <Form.Label>Description</Form.Label>
                                                                    <div className="form-control-wrap">
                                                                        <QuillMinimal placeholderValue="Write category description text..." />
                                                                    </div>
                                                                </Form.Group>
                                                            </Col> */}
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>
                      <div className="gap-col">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            <Button type="submit" variant="primary">
                              Save
                            </Button>
                          </li>
                          <li>
                            <Link
                              to="/seriui/masters/company-list"
                              className="btn border-0"
                            >
                              Cancel
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Block>

        <Block className="mt-4">
          <Tab.Content>
            <Tab.Pane eventKey="account">
              <Form action="#">
                <Row className="g-gs">
                  <Col xxl="12">
                    <div className="gap gy-4">
                      <div className="gap-col">
                        <Card>
                          <Card.Body>
                            <Row className="g-gs">
                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="bankName">
                                    Bank Name
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="bankName"
                                      type="text"
                                      placeholder="Enter Bank Name"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="accountName">
                                    Account Name
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="accountName"
                                      type="text"
                                      placeholder="Enter Account Name"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="AccNumber">
                                    Account Number
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="AccNumber"
                                      type="text"
                                      placeholder="Enter Account Number"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="branch">
                                    Branch
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="branch"
                                      type="text"
                                      placeholder="Enter Branch Name"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="ifsc">IFSC</Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="ifsc"
                                      type="text"
                                      placeholder="Enter IFSC code"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="address">
                                    Address
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="address"
                                      type="text"
                                      placeholder="Enter Bank Address"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>
                      <div className="gap-col">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            <Button type="submit" variant="primary">
                              Save
                            </Button>
                          </li>
                          <li>
                            <Link
                              to="/seriui/masters/company-list"
                              className="btn border-0"
                            >
                              Cancel
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Block>

        <Block className="mt-4">
          <Tab.Content>
            <Tab.Pane eventKey="address">
              <Form action="#">
                <Row className="g-gs">
                  <Col xxl="12">
                    <div className="gap gy-4">
                      <div className="gap-col">
                        <Card>
                          <Card.Body>
                            <Row className="g-gs">
                              <h4>Company Address</h4>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="company-address1">
                                    Address1
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="company-address1"
                                      placeholder="Enter company address"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="company-address2">
                                    Address2
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="company-address2"
                                      placeholder="Enter company address"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="company-city">
                                    City
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="company-city"
                                      placeholder="Enter city name"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="6">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="company-state">
                                    State
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Select removeItemButton>
                                      <option value="">Select State</option>
                                      <option value="1">Karnataka</option>
                                      <option value="2">Kerala</option>
                                      <option value="3">Tamil Nadu</option>
                                    </Select>
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="6">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="company-country">
                                    Country
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Select removeItemButton>
                                      <option value="">Select Country</option>
                                      <option value="1">India</option>
                                      <option value="2">Sri Lanka</option>
                                      <option value="3">China</option>
                                    </Select>
                                  </div>
                                </Form.Group>
                              </Col>

                              <h4>Billing Address</h4>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="billing-address1">
                                    Address1
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="billing-address1"
                                      placeholder="Enter billing address"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="billing-address2">
                                    Address2
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="billing-address2"
                                      placeholder="Enter billing address"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="billing-city">
                                    City
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="billing-city"
                                      placeholder="Enter city name"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="6">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="billing-state">
                                    State
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Select removeItemButton>
                                      <option value="">Select State</option>
                                      <option value="1">Karnataka</option>
                                      <option value="2">Kerala</option>
                                      <option value="3">Tamil Nadu</option>
                                    </Select>
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="6">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="billing-country">
                                    Country
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Select removeItemButton>
                                      <option value="">Select Country</option>
                                      <option value="1">India</option>
                                      <option value="2">Sri Lanka</option>
                                      <option value="3">China</option>
                                    </Select>
                                  </div>
                                </Form.Group>
                              </Col>

                              <h4>Delivery Address</h4>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="delivery-address1">
                                    Address1
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="delivery-address1"
                                      placeholder="Enter delivery address"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="delivery-address2">
                                    Address2
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="delivery-address2"
                                      placeholder="Enter delivery address"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="delivery-city">
                                    City
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="delivery-city"
                                      placeholder="Enter city name"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="6">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="delivery-state">
                                    State
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Select removeItemButton>
                                      <option value="">Select State</option>
                                      <option value="1">Karnataka</option>
                                      <option value="2">Kerala</option>
                                      <option value="3">Tamil Nadu</option>
                                    </Select>
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="6">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="delivery-country">
                                    Country
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Select removeItemButton>
                                      <option value="">Select Country</option>
                                      <option value="1">India</option>
                                      <option value="2">Sri Lanka</option>
                                      <option value="3">China</option>
                                    </Select>
                                  </div>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>
                      <div className="gap-col">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            <Button type="submit" variant="primary">
                              Save
                            </Button>
                          </li>
                          <li>
                            <Link
                              to="/seriui/masters/company-list"
                              className="btn border-0"
                            >
                              Cancel
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Block>
      </Tab.Container>
    </Layout>
  );
}

export default AddCompanyPage;
