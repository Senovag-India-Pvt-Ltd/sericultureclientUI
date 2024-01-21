import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";

import {
  Icon,
} from "../../components";

function PreservationSeedCocoons() {
  return (
    <Layout
      title="Preservation of seed cocoon for processing"
      content="container"
    >
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Preservation of seed cocoon for processing
            </Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Preservation of seed cocoon for processing
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
            {/* <Card>
              <Card.Body>
                <Row className="g-gs">
                 

                  <Col lg="4">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="fid">FRUITS ID / AADHAAR NUMBER</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="fid"
                          type="text"
                          placeholder="FRUITS ID / AADHAAR NUMBER"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card> */}

            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="lot">Lot number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lot"
                          type="text"
                          placeholder="Enter Lot number"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="race">Race</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="race"
                          type="text"
                          placeholder="Enter Race"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Date of seed cocoon supply</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="notgs">
                        Name of the Government Seed Farm/Farmer
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="notgs"
                          type="text"
                          placeholder="Enter Name of the Government Seed Farm/Farmer"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Spun on Date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="crpno">Crop Number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="crpno"
                          type="text"
                          placeholder="Enter Crop Number"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="stc">
                        Source (Line) of the Cocoon
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="stc"
                          type="text"
                          placeholder="Enter Source (Line) of the Cocoon"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="bnn">
                        Bed number Number / Kgs of cocoons supplied
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="bnn"
                          type="text"
                          placeholder="Enter Bed number Number / Kgs of cocoons supplied"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="npe">
                        Number of pupa examined
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="npe"
                          type="text"
                          placeholder="Enter Number of pupa examined"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="crd">
                        Cocoon rejection details/ numbers
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="crd"
                          type="text"
                          placeholder="Enter Cocoon rejection details/ numbers"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="ind">
                        Invoice Number & Date
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="ind"
                          type="text"
                          placeholder="Enter Invoice Number & Date"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="rpk">Rate per Kg</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="rpk"
                          type="text"
                          placeholder="Enter Rate per Kg"
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

export default PreservationSeedCocoons;
