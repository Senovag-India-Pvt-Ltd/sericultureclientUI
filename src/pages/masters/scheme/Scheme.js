import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon, Select } from "../../../components";

function Scheme() {
  return (
    <Layout title="Scheme" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Scheme</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Scheme
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
                      <Form.Label htmlFor="name">Name</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="name"
                          type="text"
                          placeholder="Enter Name"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label>Head Of Account</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select Head of Account</option>
                          <option value="1">
                            Sericulture Development Programme 2851-00-107-1-35
                          </option>
                          <option value="2">
                            Pradhan Manthri Krishi Sinchayi Yojane (PMKSY)
                            2851-00-107-1-49
                          </option>
                          <option value="2">
                            Programs implemented by Price Stabilization Fund
                            2851-00-107-1-51
                          </option>
                          <option value="2">
                            Civil works 4851-00-107-1-01
                          </option>
                          <option value="3">Silk Samagra(CSS)</option>
                        </Select>
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

export default Scheme;
