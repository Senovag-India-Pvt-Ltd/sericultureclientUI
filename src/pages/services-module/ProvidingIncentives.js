import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import {
  Icon,
} from "../../components";

function ProvidingIncentives() {
  return (
    <Layout title="Providing incentives to farmers" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Providing incentives to farmers</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Providing incentives to farmers
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
                      <Form.Label htmlFor="benename">
                        Beneficiary name and address
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="benename"
                          type="text"
                          placeholder="Enter Beneficiary name and address"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="genderaddress">
                        Gender/Address details
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="genderaddress"
                          type="text"
                          placeholder="Enter Gender/Address details"
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
                      <Form.Label>Market and date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="slip">
                        Bidding slip number
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="slip"
                          type="text"
                          placeholder="Enter Bidding slip number"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="cocoon">Cocoons (in kgs)</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="cocoon"
                          type="text"
                          placeholder="Enter Cocoons (in kgs)"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="eligible">
                        Eligible kgs for incentive
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="eligible"
                          type="text"
                          placeholder="Enter Eligible kgs for incentive"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="incrate">
                        Incentive rate per kg (calculated)
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="incrate"
                          type="text"
                          placeholder="Enter Incentive rate per kg"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="totalinc">
                        Total incentive amount (calculated)
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="totalinc"
                          type="text"
                          placeholder="Enter Total incentive amount"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="ads">
                        Sent for Sanction to ADS
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="ads"
                          type="text"
                          placeholder="Enter Sent for Sanction to ADS"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="rejection">
                        Reason for Rejection of Claim
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="rejection"
                          type="text"
                          placeholder="Enter Reason for Rejection of Claim"
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

export default ProvidingIncentives;
