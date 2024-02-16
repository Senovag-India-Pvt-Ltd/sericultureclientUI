import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import { Icon } from "../../components";

function ProvidingChowkiIncentives() {
  return (
    <Layout
      title="Providing BV Chawki Rearing incentives to farmers"
      content="container"
    >
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Providing BV Chawki Rearing incentives to farmers
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
                  Providing BV Chawki Rearing incentives to farmers
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
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="fid">
                        FRUITS ID / AADHAAR NUMBER
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="fid"
                          type="text"
                          placeholder="FRUITS ID / AADHAAR NUMBER"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6"></Col>
                </Row>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="namefarm">Farmer’s name</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="namefarm"
                          type="text"
                          placeholder="Enter Farmer’s name"
                        />
                      </div>
                    </Form.Group>

                    {/* <Form.Group className="form-group mt-3">
                      <Form.Label>Gender </Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select</option>
                          <option value="1">Male</option>
                          <option value="2">Female</option>
                          <option value="3">Third Gender</option>
                        </Select>
                      </div>
                    </Form.Group> */}

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="village">Village</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="village"
                          type="text"
                          placeholder="Enter Village"
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
                      <Form.Label htmlFor="recno">Receipt No & date</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="recno"
                          type="text"
                          placeholder="Enter Receipt No & date"
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
                      <Form.Label htmlFor="source">Source</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="source"
                          type="text"
                          placeholder="Enter Source"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
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
                      <Form.Label>Date of Chawki</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="incamt">
                        Incentive Amount (calculated)
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="incamt"
                          type="text"
                          placeholder="Enter Incentive Amount"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="ccd">
                        Chawki certification details
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="ccd"
                          type="text"
                          placeholder="Enter Chawki certification details"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="digsig">
                        Digital Signatures
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="digsig"
                          type="text"
                          placeholder="Enter Digital Signatures"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="propay">Proceed to Pay</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="propay"
                          type="text"
                          placeholder="Enter Proceed to Pay"
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

export default ProvidingChowkiIncentives;
