import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import DatePicker from "../../components/Form/DatePicker";
import FileUpload from "../../components/Form/FileUpload";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
// import { Icon, Select, QuillMinimal, Tags, ImageUpload } from '../../components';
import { Icon, Select } from "../../components";

function AddManufacturingOrderPage() {
  return (
    <Layout title="Add Manufacturing Order" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Add Manufacturing Order</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/ecommerce/products">Production</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Add Manufacturing Order
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/production/manufacturing-order"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="eye" />
                  <span>View</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/production/manufacturing-order"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="eye" />
                  <span>View Manufacturing Order</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block>
        <Form action="/production/manufacturing-order">
          <Row className="g-gs">
            <Col xxl="9">
              <div className="gap gy-4">
                <div className="gap-col">
                  <Card>
                    <Card.Body>
                      <Row className="g-gs">
                        {/* <Col lg="12">
                                            <Form.Group className="form-group">
                                                <Form.Label htmlFor="category-name">Category Name</Form.Label>
                                                <div className="form-control-wrap">
                                                    <Form.Control type="text" id="category-name" placeholder="Category Name"/>
                                                </div>
                                            </Form.Group>
                                        </Col> */}
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="tax-class">
                              Location
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Select removeItemButton>
                                <option value="">Select an option</option>
                                <option value="1">location-1</option>
                                <option value="2">location-2</option>
                                <option value="3">location-3</option>
                              </Select>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="item">Item</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="item"
                                placeholder="type here..."
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="quantity">Quantity</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control type="text" id="quantity" />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label>Due Date</Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label>Start</Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label>Finish</Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="tax-class">
                              Assign To
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Select removeItemButton>
                                <option value="">None Selected</option>
                                <option value="1">user-1</option>
                                <option value="2">user-2</option>
                                <option value="3">user-3</option>
                              </Select>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="refNo">
                              Reference No.
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control type="text" id="refNo" />
                            </div>
                          </Form.Group>
                        </Col>
                        {/* <Col lg="6">
                                            <Form.Group className="form-group">
                                                <Form.Label htmlFor="vat-amount">Meta Tag Title</Form.Label>
                                                <div className="form-control-wrap">
                                                    <Form.Control type="text" id="vat-amount" placeholder="Meta Tag Title"/>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col lg="6">
                                            <Form.Group className="form-group">
                                                <Form.Label>Meta Tag Keywords</Form.Label>
                                                <div className="form-control-wrap">
                                                    <Tags removeItemButton/>
                                                </div>
                                            </Form.Group>
                                        </Col> */}
                        {/* <Col lg="12">
                                            <Form.Group className="form-group">
                                                <Form.Label>Description</Form.Label>
                                                <div className="form-control-wrap">
                                                    <QuillMinimal placeholderValue="Write category description text..."/>
                                                </div>
                                            </Form.Group>
                                        </Col> */}
                      </Row>
                    </Card.Body>
                  </Card>
                </div>
                <div className="gap-col">
                  <ul className="d-flex align-items-center gap g-3">
                    <li>
                      <Button type="submit" variant="primary">
                        Save Changes
                      </Button>
                    </li>
                    <li>
                      <Link
                        to="/seriui/production/manufacturing-order"
                        className="btn border-0"
                      >
                        Cancel
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col xxl="3">
              <Card>
                <Card.Body>
                  <Row className="g-gs">
                    <Col className="col-12">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="fileName">File Name</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="text"
                            id="fileName"
                            placeholder="File Name"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col className="col-12">
                      <Form.Group className="form-group">
                        <Form.Label>Choose File</Form.Label>
                        <div className="form-control-wrap">
                          <FileUpload
                            iconName="file"
                            maxFiles={1}
                            errorText="Multiple files not supported, please upload single file."
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    {/* <Col className="col-12">
                                    <Form.Group className="form-group">
                                        <Form.Label>Thumbnail</Form.Label>
                                        <div className="form-control-wrap">
                                            <ImageUpload src="/images/avatar/avatar-placeholder.jpg"/>
                                        </div>
                                        <div className="form-note mt-3">
                                            Set the category thumbnail image. Only *.png, *.jpg and *.jpeg image files are accepted.
                                        </div>
                                    </Form.Group>
                                </Col> */}
                    {/* <Col className="col-12">
                                    <Form.Group className="form-group">
                                        <Form.Label>Status</Form.Label>
                                        <div className="form-control-wrap">
                                            <Select removeItemButton>
                                                <option value="">Select an option</option>
                                                <option value="1">Published</option>
                                                <option value="2">Draft</option>
                                                <option value="3">Scheduled</option>
                                                <option value="4">Inactive</option>
                                            </Select>
                                        </div>
                                    </Form.Group>
                                </Col> */}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default AddManufacturingOrderPage;
