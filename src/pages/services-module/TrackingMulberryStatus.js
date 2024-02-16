import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import { Icon, Select } from "../../components";

function TrackingMulberryStatus() {
  return (
    <Layout title="Tracking Mulberry Status" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Tracking the current status and extension of mulberry plantation
            </Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Tracking Mulberry Status
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
                  {/* <Col lg="4">
                  <Form.Group className="form-group mt-3">
                      <Form.Label>Select Department</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Choose Department</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </Select>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                  <Form.Group className="form-group mt-3">
                      <Form.Label>Select Activity</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Choose Activity</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </Select>
                      </div>
                    </Form.Group>
                  </Col> */}

                  <Col lg="8">
                    <Form.Group as={Row} className="form-group" controlId="fid">
                      <Form.Label column sm={4}>
                        FRUITS ID / AADHAAR NUMBER
                      </Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          type="text"
                          placeholder="Enter FRUITS ID / AADHAAR NUMBER"
                        />
                      </Col>
                      <Col sm={2}>
                        <Button
                          type="button"
                          variant="primary"
                          // onClick={display}
                        >
                          Search
                        </Button>
                      </Col>
                    </Form.Group>
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
                      <Form.Label htmlFor="tscname">
                        Name of the TSC Village/Taluk/ District
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="tscname"
                          type="text"
                          placeholder="Enter name of the TSC"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="pin">PIN Code</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="pin"
                          type="text"
                          placeholder="Enter PIN Code"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="name">Farmer's Name</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="name"
                          type="text"
                          placeholder="Enter Farmer's Address"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="namefh">
                        Name of the Father/Husband
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="namefh"
                          type="text"
                          placeholder="Enter name of the Father/Husband"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Gender</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select</option>
                          <option value="1">Male</option>
                          <option value="2">Female</option>
                          <option value="3">Third Gender</option>
                        </Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="mbno">Mobile Number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="mbno"
                          type="text"
                          placeholder="Enter mobile number"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="aadhar">Aadhar Number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="aadhar"
                          type="text"
                          placeholder="Enter aadhar number"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="epic">Epic Number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="epic"
                          type="text"
                          placeholder="Enter Epic number"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Caste</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select</option>
                          <option value="1">SC</option>
                          <option value="2">ST</option>
                          <option value="3">BCM</option>
                          <option value="4">Minority</option>
                          <option value="5">Others</option>
                        </Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Landholding Category</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select</option>
                          <option value="1">SF</option>
                          <option value="2">MF</option>
                          <option value="3">Others</option>
                        </Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="bankName">Bank Name</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="bankName"
                          type="text"
                          placeholder="Enter Bank Name"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="branchName">Branch Name</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="branchName"
                          type="text"
                          placeholder="Enter Branch Name"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="accno">
                        Bank Account Number
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="accno"
                          type="text"
                          placeholder="Enter Bank Account Number"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="ifsc">IFSC Code</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="ifsc"
                          type="text"
                          placeholder="Enter IFSC Code"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="surno">Survey Number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="surno"
                          type="text"
                          placeholder="Enter Survey Number"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="teol">
                        Total Extent of land
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="teol"
                          type="text"
                          placeholder="Enter Total Extent of land"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="variety">
                        Mulberry variety
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="variety"
                          type="text"
                          placeholder="Enter Mulberry variety"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="spacing">Spacing</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="spacing"
                          type="text"
                          placeholder="Enter Spacing"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="moi">Means of irrigation</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="moi"
                          type="text"
                          placeholder="Enter Means of irrigation"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>
                        Important dates (date of plantation)
                      </Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="uproot">
                        Uprootment details
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="uproot"
                          type="text"
                          placeholder="Enter Uprootment details"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Crop Status</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select</option>
                          <option value="1">Success</option>
                          <option value="2">Failure</option>
                          <option value="3">Discard</option>
                        </Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="remark">Remarks</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="remark"
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
                  <Button type="button" variant="primary">
                    Save
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
        </Form>
      </Block>
    </Layout>
  );
}

export default TrackingMulberryStatus;
