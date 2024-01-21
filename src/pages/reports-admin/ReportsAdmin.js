import { Card, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import {
  Select,
} from "../../components";

function ReportsAdmin() {
  return (
    <Layout title="Admin Reports" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Admin Reports</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Admin Reports
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          {/* <Block.HeadContent>
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
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-4">
        <Form action="#">
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="4">
                    <Form.Group
                      as={Row}
                      className="form-group mt-3"
                      controlId="fromdate"
                    >
                      <Form.Label column sm={4} className="me-n5">
                        From
                      </Form.Label>
                      <Col sm={8} className="ms-n5">
                        <div className="form-control-wrap">
                          <DatePicker />
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group
                      as={Row}
                      className="form-group mt-3"
                      controlId="todate"
                    >
                      <Form.Label column sm={4} className="me-n5">
                        To
                      </Form.Label>
                      <Col sm={8} className="ms-n5">
                        <div className="form-control-wrap">
                          <DatePicker />
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group
                      as={Row}
                      className="form-group mt-3"
                      controlId="institute"
                    >
                      <Form.Label column sm={4} className="me-n5">
                        Institution
                      </Form.Label>
                      <Col sm={8}>
                        <div className="form-control-wrap">
                          <Select removeItemButton>
                            <option value="">Select Institution</option>
                            <option value="1">Registration</option>
                            <option value="2">Grainages</option>
                            <option value="3">Farms</option>
                            <option value="4">Cocoon Market</option>
                            <option value="5">Silk Exchange</option>
                            <option value="6">Training</option>
                            <option value="7">Inspection</option>
                          </Select>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  {/* <Col lg="6">
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
                        <Form.Label htmlFor="addben">
                          Add Beneficiary
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="addben"
                            type="text"
                            placeholder="Add Beneficiary"
                          />
                        </div>
                      </Form.Group>
                    </Col> */}
                </Row>
              </Card.Body>
            </Card>

            {/* <div className="gap-col">
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
            </div> */}
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default ReportsAdmin;
