import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import { Icon } from "../../components";

function SupplyCocoonsGrainage() {
  return (
    <Layout
      title="Attributes Supply of Cocoons to Grainage"
      content="container"
    >
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Attributes Supply of Cocoons to Grainage
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
                  Attributes Supply of Cocoons to Grainage
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
                      <Form.Label htmlFor="roc">Race of Cocoons</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="roc"
                          type="text"
                          placeholder="Enter Race of Cocoons"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Spun on Date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="nococoon">
                        Number of Cocoons Dispatched
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="nococoon"
                          type="text"
                          placeholder="Enter Number of Cocoons Dispatched"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="gend">Generation details</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="gend"
                          type="text"
                          placeholder="Enter Generation details"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Dispatch date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Link to="#" className="btn btn-secondary border-0">
                        Generate Invoice
                      </Link>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Link to="#" className="btn btn-secondary border-0">
                        View Receipt
                      </Link>
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

export default SupplyCocoonsGrainage;
