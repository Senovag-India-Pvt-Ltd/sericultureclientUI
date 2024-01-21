import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import {
  Icon,
} from "../../components";

function SeedCuttingBank() {
  return (
    <Layout title="Attributes Seed cutting bank" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Attributes Seed cutting bank</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Attributes Seed cutting bank
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
                      <Form.Label htmlFor="fname">Farmer’s name</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="fname"
                          type="text"
                          placeholder="Enter Farmer’s name"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="qsc">
                        Quantity of seed cuttings
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="qsc"
                          type="text"
                          placeholder="Enter Quantity of seed cuttings"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Date of pruning</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="rpt">Rate per Tonne</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="rpt"
                          type="text"
                          placeholder="Enter Rate per Tonne"
                        />
                      </div>
                    </Form.Group>

                    {/* <Form.Group className="form-group mt-3">
                      <Form.Label>Mulberry variety </Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select Mulberry variety</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </Select>
                      </div>
                    </Form.Group> */}
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Link to="#" className="btn btn-secondary border-0">
                        Generate Receipt
                      </Link>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="recno">Receipt number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="recno"
                          type="text"
                          placeholder="Enter Receipt number"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="remdet">
                        Remittance details
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="remdet"
                          type="text"
                          placeholder="Enter Remittance details"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="challan">Challan Upload</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control type="file" id="challan" />
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

export default SeedCuttingBank;
