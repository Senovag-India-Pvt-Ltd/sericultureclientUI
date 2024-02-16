import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Select, FileUpload } from "../../../components";

function AddItemPage() {
  return (
    <Layout title="Add Item" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Add Item</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/masters/item">Item List</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Add List
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-4">
        <Form action="#">
          <Row className="g-3 ">
            <Col xxl="8">
              <div className="gap gy-4">
                <div className="gap-col">
                  <Card>
                    <Card.Body>
                      <Row className="g-gs">
                        <h6>Basic Details</h6>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="itemId">Item Id</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="itemId"
                                type="text"
                                placeholder="Enter Item ID"
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="itemName">
                              Item Name
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="name"
                                type="text"
                                placeholder="Enter Item Name"
                              />
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label>Product/Service</Form.Label>
                            <div className="form-control-wrap">
                              <Select removeItemButton>
                                <option value="">Select</option>
                                <option value="1">Product</option>
                                <option value="2">Service</option>
                              </Select>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label>Buy/Sell/Both</Form.Label>
                            <div className="form-control-wrap">
                              <Select removeItemButton>
                                <option value="">Select</option>
                                <option value="1">Buy</option>
                                <option value="2">Sell</option>
                                <option value="3">Both</option>
                              </Select>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label>Unit of Measurement(UoM)</Form.Label>
                            <div className="form-control-wrap">
                              <Select removeItemButton>
                                <option value="">Select</option>
                                <option value="1">Kilogram</option>
                                <option value="2">Gram</option>
                                <option value="3">Ton</option>
                              </Select>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label>Item Category</Form.Label>
                            <div className="form-control-wrap">
                              <Select removeItemButton>
                                <option value="">Select</option>
                                <option value="1">Raw Materials</option>
                                <option value="2">Semi-finished Goods</option>
                                <option value="3">Consumables</option>
                                <option value="4">Bought-out Parts</option>
                                <option value="5">Trading Goods</option>
                                <option value="6">Service</option>
                              </Select>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="price">Price</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="price"
                                type="text"
                                placeholder="Enter Price"
                              />
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="hsn">HSN Code</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="hsn"
                                type="text"
                                placeholder="Enter the HSN code"
                              />
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label>Store</Form.Label>
                            <div className="form-control-wrap">
                              <Select removeItemButton>
                                <option value="">Select</option>
                                <option value="1">Store1</option>
                                <option value="2">Store2</option>
                                <option value="3">Store3</option>
                                <option value="4">Store4</option>
                                <option value="5">Store5</option>
                              </Select>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label>Tax</Form.Label>
                            <div className="form-control-wrap">
                              <Select removeItemButton>
                                <option value="">Select</option>
                                <option value="1">Tax:5%</option>
                                <option value="2">Tax:28%</option>
                                <option value="3">Tax:12%</option>
                                <option value="4">Tax:18%</option>
                                <option value="5">Tax:30%</option>
                              </Select>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </Col>
            <Col xxl="4">
              <div className="gap-col">
                <Card>
                  <Card.Body>
                    <Row className="g-gs">
                      <h6>Stock Details</h6>
                      <Col lg="12">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="current-stock">
                            Current Stock
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="current-stock"
                              type="text"
                              placeholder="Enter Current Stock"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="12">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="min-stock">
                            Minimum Stock
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="min-stock"
                              type="text"
                              placeholder="Enter Minimum Stock"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="12">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="max-stock">
                            Maximum Stock
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="max-stock"
                              type="text"
                              placeholder="Enter Maximum Stock"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>
              <div className="gap-col">
                <Card>
                  <Card.Body>
                    <Form.Group className="form-group">
                      <Form.Label>Attachments</Form.Label>
                      <FileUpload
                        iconName="img"
                        maxSize={12582912}
                        errorText="File size is too large, please upload file size within (12MB)"
                      />
                      {/* <div className="form-note mt-3">Set the product media gallery.</div> */}
                    </Form.Group>
                  </Card.Body>
                </Card>
              </div>
            </Col>
            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </li>
                <li>
                  <Link to="/seriui/masters/item" className="btn border-0">
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

export default AddItemPage;
