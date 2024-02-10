import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import { Icon, Select } from "../../components";

function AttributeFoundationCourses() {
  return (
    <Layout
      title="Attributes conducting foundation courses, conducting workshops, refresher training for officials"
      content="container"
    >
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Attributes conducting foundation courses, conducting workshops,
              refresher training for officials
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
                  Attributes conducting foundation courses, conducting
                  workshops, refresher training for officials
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
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="Iname">Institute Name</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="Iname"
                          type="text"
                          placeholder="Enter Institute Name"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="dname">Offical Name</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="dname"
                          type="text"
                          placeholder="Enter Offical Name"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Designation</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select Designation</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="mno">Mobile Number </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="mno"
                          type="text"
                          placeholder="Enter Mobile Number"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="officename">
                        Name of Office{" "}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="officename"
                          type="text"
                          placeholder="Enter Name of Office"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="vtd">
                        Village, Taluk, Dist{" "}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="vtd"
                          type="text"
                          placeholder="Enter Village, Taluk, Dist"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Training date</Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="dot">
                        Duration of Training
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="dot"
                          type="text"
                          placeholder="Enter Duration of Training"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="dot">Type of Training</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="dot"
                          type="text"
                          placeholder="Enter Type of Training"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="wrkspname">Workshop Name</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="wrkspname"
                          type="text"
                          placeholder="Enter Workshop Name"
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

export default AttributeFoundationCourses;
