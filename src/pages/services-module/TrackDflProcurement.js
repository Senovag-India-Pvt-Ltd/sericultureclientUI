import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import { Icon, Select } from "../../components";

function TrackDflProcurement() {
  return (
    <Layout title="Track DFL Procurement" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Track the DFL procurement and sale of cocoon by the farmer{" "}
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
                  Track DFL Procurement
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
                      <Form.Label htmlFor="name">Farmer Name</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="name"
                          type="text"
                          placeholder="Enter Farmers Name"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="name">Farmer's Address</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="name"
                          type="text"
                          placeholder="Enter Farmer's Address"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="crop">Crop Number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="crop"
                          type="text"
                          placeholder="Enter Crop Number"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="nodlfs">Number of DFLs</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="nodlfs"
                          type="text"
                          placeholder="Enter Number of DFLs"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="lotno">Lot number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lotno"
                          type="text"
                          placeholder="Enter Lot number"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Race</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select</option>
                          <option value="1">BV</option>
                          <option value="2">CB</option>
                        </Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Source </Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select</option>
                          <option value="1">CRC</option>
                          <option value="2">Grain Age</option>
                        </Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Date of Brushing(field Data)</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Spun Date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label>Date of Harvest(field Data)</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="yield">Yield</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="yield"
                          type="text"
                          placeholder="Enter Yield"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="avgyield">Average Yield</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="avgyield"
                          type="text"
                          placeholder="Enter Average Yield"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="avgyield">Average Yield</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="avgyield"
                          type="text"
                          placeholder="Enter Average Yield"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="rate">Rate per Kg</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="rate"
                          type="text"
                          placeholder="Enter Rate per Kg"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="market">
                        Name of the Market
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="market"
                          type="text"
                          placeholder="Enter name of the Market"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="market">
                        Bidding slip details
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="market"
                          type="text"
                          placeholder="Enter bidding slip details"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="passbook">
                        Passbook details
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="passbook"
                          type="text"
                          placeholder="Enter passbook details"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="realization">
                        Total Realization
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="realization"
                          type="text"
                          placeholder="Enter passbook details"
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

export default TrackDflProcurement;
