import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon, Select } from "../../components";

function RaiseTicket() {
  return (
    <Layout title="Raise a Ticket" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Raise a Ticket</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Raise a Ticket
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

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="pbill">Prepare Bill</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="pbill"
                          type="text"
                          placeholder="Prepare Bill"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">

                  <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="setamt">Set Amount</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="setamt"
                          type="text"
                          placeholder="Set Amount"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="addben">Add Beneficiary</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="addben"
                          type="text"
                          placeholder="Add Beneficiary"
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
                      <Form.Label> Module Name </Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select Module Name</option>
                          <option value="1">Stake Holder Registration</option>
                          <option value="2">Services</option>
                          <option value="3">Direct Benefit</option>
                          <option value="4">Market and Auction</option>
                          <option value="5">Seed and DFL</option>
                          <option value="6">Chawki Management</option>
                          <option value="7">Target Setting</option>
                          <option value="8">Inspection</option>
                          <option value="9">Training</option>
                          <option value="10">Admin and Reports</option>
                          <option value="11">Helpdesk</option>
                        </Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Functionality </Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select Functionality</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </Select>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="dessum">
                        Description Summary
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="dessum"
                          type="text"
                          placeholder="Enter Description Summary"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="nousers">
                        Number of Users Effected
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="nousers"
                          type="text"
                          placeholder="Enter Number of Users Effected"
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

export default RaiseTicket;
