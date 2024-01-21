import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import {
  Icon,
} from "../../components";

function RearingofDfls() {
  return (
    <Layout title="Rearing of DFLs for the 8 lines" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
            Rearing of DFLs for the 8 lines
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
                Rearing of DFLs for the 8 lines
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
                      <Form.Label htmlFor="cropDetail">
                      Crop Detail
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="cropDetail"
                          type="text"
                          placeholder="Enter Crop Detail"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="crpno">Crop number</Form.Label>
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
                      <Form.Label>Laid on (L/O) date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="cold">Cold storage details</Form.Label>
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
                      <Form.Label>Released on</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="chawki">Chawki percentage</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="chawki"
                          type="text"
                          placeholder="Enter Chawki percentage"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="wormweight">Worm weight (In grms)</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="wormweight"
                          type="text"
                          placeholder="Enter Worm weight (In grms)"
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
                      <Form.Label htmlFor="wtest">Worm test dates and results</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="wtest"
                          type="text"
                          placeholder="Enter Worm test dates and results"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="cocoonass">Cocoon assessment details</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="cocoonass"
                          type="text"
                          placeholder="Enter Cocoon assessment details"
                        />
                      </div>
                    </Form.Group>
                    
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="crop">Crop failure details</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="crop"
                          type="text"
                          placeholder="Enter Crop failure details"
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

export default RearingofDfls;
