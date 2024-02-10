import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import { Icon } from "../../components";

function SupplyOfDisinfectantsInspection() {
  return (
    <Layout title="Supply of disinfectants to farmers " content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Supply of disinfectants to farmers
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
                  Supply of disinfectants to farmers
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
                      <Form.Label htmlFor="nameins">
                        Name of the Inspector/Demonstrator
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="nameins"
                          type="text"
                          placeholder="Name of the Inspector/Demonstrator"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="disinfect">
                        Name of the Disinfectant
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="disinfect"
                          type="text"
                          placeholder="Enter Name of the Disinfectant"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="invoice">
                        Invoice number and date
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="invoice"
                          type="text"
                          placeholder="Enter Invoice number and date"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="quantity">Quantity</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="quantity"
                          type="text"
                          placeholder="Enter Quantity"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="nameoffar">
                        Name of the Farmer
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="nameoffar"
                          type="text"
                          placeholder="Enter the Name of the Farmer"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="father">Father's Name</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="father"
                          type="text"
                          placeholder="Enter Father's Name"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="village">Village name</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="village"
                          type="text"
                          placeholder="Enter Village Name"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="qsname">
                        Quantity supplied name (General/Bed)
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="qsname"
                          type="text"
                          placeholder="Enter Quantity supplied name"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Date of supply</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="srh">
                        Size of rearing house
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="srh"
                          type="text"
                          placeholder="Enter Size of rearing house"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="dfls">Number of DFLs</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="dfls"
                          type="text"
                          placeholder="Enter Number of DFLs"
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

export default SupplyOfDisinfectantsInspection;
