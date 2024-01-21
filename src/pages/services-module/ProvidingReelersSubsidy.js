import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {
  Icon,
} from "../../components";

function ProvidingReelersSubsidy() {
  return (
    <Layout title="Providing subsidy to the Reelers" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Providing subsidy to the Reelers</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Providing subsidy to the Reelers
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
                      <Form.Label htmlFor="rname">
                        Name and address of the Reeler
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="rname"
                          type="text"
                          placeholder="Enter Name and address of the Reeler"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="ward">Ward Number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="ward"
                          type="text"
                          placeholder="Enter Ward Number"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="surno">Survey number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="surno"
                          type="text"
                          placeholder="Enter Survey number"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="sono">
                        Sanction order number and date
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="sono"
                          type="text"
                          placeholder="Enter Sanction order number and date"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="subamt">Subsidy amount</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="subamt"
                          type="text"
                          placeholder="Enter Subsidy amount"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="pursub">
                        Purpose of subsidy Relevant subsidy related details
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="pursub"
                          type="text"
                          placeholder="Enter Purpose of subsidy Relevant subsidy related details"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="propay">
                        Proceed to Payment
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="propay"
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

export default ProvidingReelersSubsidy;
