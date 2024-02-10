import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import { Icon } from "../../components";

function GrearingofDfls() {
  return (
    <Layout title="Attributes Rearing of DFL’s" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Attributes Rearing of DFL’s</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Attributes Rearing of DFL’s
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
                      <Form.Label htmlFor="dud">
                        Disinfectant usage details
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="dud"
                          type="text"
                          placeholder="Enter Disinfectant usage details"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Disinfection Date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="crpno">Crop number(Farm)</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="crpno"
                          type="text"
                          placeholder="Enter Crop number"
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
                      <Form.Label htmlFor="Source">Source</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="Source"
                          type="text"
                          placeholder="Enter Source"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="nodfls">Number of DFLs</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="nodfls"
                          type="text"
                          placeholder="Enter Number of DFLs"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="nodfls">
                        Total number of eggs
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="nodfls"
                          type="text"
                          placeholder="Enter Total number of eggs"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Laid on (L/O) date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="cold">
                        Cold storage details
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="cold"
                          type="text"
                          placeholder="Enter Cold storage details"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label>Date of release from cold Storage</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Date of Brushing</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="chawki">
                        Chawki percentage
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="chawki"
                          type="text"
                          placeholder="Enter Chawki percentage"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="feeding">Feeding Details</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="feeding"
                          type="text"
                          placeholder="Enter Feeding Details"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="wormweight">
                        Worm weight of 10 larvae on 5th instar 5th day(bed wise){" "}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="wormweight"
                          type="text"
                          placeholder="Enter Worm weight"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Spun on date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="wtest">
                        Worm test dates and results
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="wtest"
                          type="text"
                          placeholder="Enter Worm test dates and results"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="cocoonass">
                        Cocoon assessment details
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="cocoonass"
                          type="text"
                          placeholder="Enter Cocoon assessment details"
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

export default GrearingofDfls;
