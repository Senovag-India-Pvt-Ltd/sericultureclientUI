import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import { Icon, Select } from "../../components";

function ProvidingReelersIncentives() {
  return (
    <Layout title="Providing incentives to Reelers" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Providing incentives to Reelers</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Providing incentives to Reelers
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
                 

                  <Col lg="6">
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

                  <Col lg="6">


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
                      <Form.Label htmlFor="rlno">
                        Reeler Licence Number
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="rlno"
                          type="text"
                          placeholder="Enter Reeler Licence Number"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="rname">Reeler’s name</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="rname"
                          type="text"
                          placeholder="Enter Reeler’s name"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Gender </Form.Label>
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
                      <Form.Label>
                        Month (in which incentive is being taken)
                      </Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="rswk">
                        Raw silk weight in kgs
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="rswk"
                          type="text"
                          placeholder="Enter Raw silk weight in kgs"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="incrate">
                        Incentive Rate/kg
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="incrate"
                          type="text"
                          placeholder="Enter Incentive Rate/kg"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Incentive amount Type of silk</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select</option>
                          <option value="1">BV</option>
                          <option value="2">CB</option>
                          <option value="3">PM</option>
                        </Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="tsbmt">
                        Type of silk based on machinery type
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="tsbmt"
                          type="text"
                          placeholder="Enter Type of silk based on machinery type"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="streport">
                        Silk Test report
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="streport"
                          type="text"
                          placeholder="Enter Silk Test report"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="ppay">Proceed to Payment</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="ppay"
                          type="text"
                          placeholder="Enter Proceed to Payment"
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

export default ProvidingReelersIncentives;
