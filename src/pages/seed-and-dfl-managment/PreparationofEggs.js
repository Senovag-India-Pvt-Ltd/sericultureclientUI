import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import {
  Icon,
  Select,
} from "../../components";

function PreparationofEggs() {
  return (
    <Layout title="Preparation of eggs (DFLs)" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Preparation of eggs (DFLs)</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Preparation of eggs (DFLs)
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
                        Name of the Grainage and Address
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="dud"
                          type="text"
                          placeholder="Enter Name of the Grainage and Address"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="lotno">Lot number/Year</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lotno"
                          type="text"
                          placeholder="Enter Lot number/Year"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="nococoo">
                        Number of Cocoons (CB, Hybrid)
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="nococoo"
                          type="text"
                          placeholder="Enter Number of Cocoons (CB, Hybrid)"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Date of moth emergence</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="essn">
                        Egg sheet serial number
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="essn"
                          type="text"
                          placeholder="Enter Egg sheet serial number"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="nop">Number of pairs</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="nop"
                          type="text"
                          placeholder="Enter Number of pairs"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="nor">Number of Rejection</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="nor"
                          type="text"
                          placeholder="Enter Number of Rejection"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="dflso">DFLs obtained</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="dflso"
                          type="text"
                          placeholder="Enter DFLs obtained"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="eggrec">Egg Recovery %</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="eggrec"
                          type="text"
                          placeholder="Enter Egg Recovery %"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="eggrec">
                        Examination details
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="eggrec"
                          type="text"
                          placeholder="Enter Examination details"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="exstage">Examined Stage</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="exstage"
                          type="text"
                          placeholder="Enter Examined Stage"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="remarks">Remarks</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="remarks"
                          type="text"
                          placeholder="Enter Remarks"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Select Pebrine Status</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Choose Pebrine Status</option>
                          <option value="1">Yes</option>
                          <option value="2">No</option>
                        </Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="remark">
                        Additional remarks
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="remark"
                          type="text"
                          placeholder="Enter Pebrine Status"
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

export default PreparationofEggs;
