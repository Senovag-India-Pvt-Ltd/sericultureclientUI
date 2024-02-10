import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import TimePicker from "../../components/Form/TimePicker";
import { Select } from "../../components";

function AssignRequestToTech() {
  return (
    <Layout title="Assign Request to Technician" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Assign Request to Technician</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/request">request</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Assign Request to Technician
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-4">
        <Form action="#">
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group className="form-group">
                      <Form.Label>Request Number</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select Request Number</option>
                          <option value="1">Request No 1</option>
                          <option value="2">Request No 2</option>
                          <option value="3">Request No 3</option>
                        </Select>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="12">
                    <Form.Group className="form-group">
                      <Form.Label>Technician</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select Technician</option>
                          <option value="1">Technician 1</option>
                          <option value="2">Technician 2</option>
                          <option value="3">Technician 3</option>
                        </Select>
                      </div>
                    </Form.Group>
                  </Col>

                  <h6>Start Time</h6>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>Date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>Time</Form.Label>
                      <div className="form-control-wrap">
                        <TimePicker format={12} value="" placeholder="hh:mm" />
                      </div>
                    </Form.Group>
                  </Col>

                  <h6>End Time</h6>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>Date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>Time</Form.Label>
                      <div className="form-control-wrap">
                        <TimePicker format={12} value="" placeholder="hh:mm" />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </li>
                <li>
                  <Link to="/seriui/request" className="btn border-0">
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

export default AssignRequestToTech;
