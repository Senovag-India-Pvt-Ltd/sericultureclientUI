import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import { Icon, Select } from "../../components";

function PreparationDcBills() {
  return (
    <Layout title="Preparation of DC bills" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Preparation of DC bills</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Preparation of DC bills
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
            </Card>

            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="namefarm">
                        Name and Address of the Farmer
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="namefarm"
                          type="text"
                          placeholder="Enter Name and Address of the Farmer"
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
                      <Form.Label htmlFor="bsn">Bidding Slip Number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="bsn"
                          type="text"
                          placeholder="Enter Bidding Slip Number"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Bidding slip date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="qoc">Quantity of cocoons</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="qoc"
                          type="text"
                          placeholder="Enter Quantity of cocoons"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="subamt">Subsidy amount</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="subamt"
                          type="text"
                          placeholder="Enter Quantity of cocoons"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="nom">Name of the Market</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="nom"
                          type="text"
                          placeholder="Enter Name of the Market"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="k2">K2 Recipient ID</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="k2"
                          type="text"
                          placeholder="Enter K2 Recipient ID"
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

export default PreparationDcBills;
