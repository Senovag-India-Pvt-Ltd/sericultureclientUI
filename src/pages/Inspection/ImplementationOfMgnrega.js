import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";

function ImplementationOfMgnrega() {
  return (
    <Layout
      title="Implementation of MGNREGA and Generation of Reports "
      content="container"
    >
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Implementation of MGNREGA and Generation of Reports
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
                  Implementation of MGNREGA and Generation of Reports
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
                      <Form.Label htmlFor="mtype">MGNREGA Type</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="mtype"
                          type="text"
                          placeholder="MGNREGA Type"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="jcn">Job Card Number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="jcn"
                          type="text"
                          placeholder="Enter Job Card Number"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="areac">Area Covered</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="areac"
                          type="text"
                          placeholder="Enter Area Covered"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="nofarm">
                        Number of farmers
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="nofarm"
                          type="text"
                          placeholder="Enter Number of farmers"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="wage">Wages Amount</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="wage"
                          type="text"
                          placeholder="Enter the Wages Amount"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="mandayno">
                        Number of Man-days
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="mandayno"
                          type="text"
                          placeholder="Enter Number of Man-days"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="matcos">Material Cost</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="matcos"
                          type="text"
                          placeholder="Enter Material Cost"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="acresp">Acres Planted</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="acresp"
                          type="text"
                          placeholder="Enter Acres Planted"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="spacfo">
                        Spacing Followed (In Feet)
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="spacfo"
                          type="text"
                          placeholder="Enter Spacing Followed (In Feet)"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="saplpro">
                        Sapling Procured (Nos.)
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="saplpro"
                          type="text"
                          placeholder="Enter Sapling Procured (Nos.)"
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

export default ImplementationOfMgnrega;
