import { Card, Form, Row, Col, Button, Tab, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "../../components/DataTable/DataTable";
import { Select } from "../../components";
import {
  bomColumns,
  fgColumns,
  rmColumns,
  scrapColumns,
  otherChargesColumns,
  boms,
  fgdata,
  rmdata,
  scrapdata,
  otherChargesdata,
} from "../../store/production/BomData";

function AddBomPage() {
  return (
    <Layout title="Add Bill of Material" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Add Bill of Material</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/production/bill-of-material">BoM List</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Add BoM
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          {/* <Block.HeadContent>
                        <ul className="d-flex">
                            <li>
                                <Link to="/seriui/masters/company-list" className="btn btn-primary btn-md d-md-none">
                                    <Icon name="eye" />
                                    <span>View</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/seriui/masters/company-list" className="btn btn-primary d-none d-md-inline-flex">
                                    <Icon name="eye" />
                                    <span>View BoM</span>
                                </Link>
                            </li>
                        </ul>
                    </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Tab.Container defaultActiveKey="bom-detail">
        <Block.HeadBetween>
          <div className="gap-col">
            <Nav variant="pills" className="nav-pills-border gap g-3">
              <Nav.Item>
                <Nav.Link eventKey="bom-detail">BoM Details</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="finished-goods">Finished Goods</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="raw-materials">Raw Materials</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="routing">Routing</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="scrap">Scrap</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="other-charges">Other Charges</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          {/* <div className="gap-col">
                    <ul className="d-flex gap g-2">
                        <li className="d-none d-md-block">
                            <Link to={`/user-manage/user-edit/${user.id}`} className="btn btn-soft btn-primary">
                                <Icon name="edit"></Icon>
                                <span>Edit Profile</span>
                            </Link>
                        </li>
                        <li className="d-md-none">
                            <Link to={`/user-manage/user-edit/${user.id}`} className="btn btn-soft btn-primary btn-icon">
                                <Icon name="edit"></Icon>
                            </Link>
                        </li>
                    </ul>
                </div> */}
        </Block.HeadBetween>

        <Block className="mt-4">
          <Tab.Content>
            <Tab.Pane eventKey="bom-detail">
              <Form action="#">
                <Row className="g-gs">
                  <Col xxl="12">
                    <div className="gap gy-4">
                      <div className="gap-col">
                        <Card>
                          <Card.Body>
                            <Row className="g-gs">
                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="doc-name">
                                    BoM Name
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="doc-name"
                                      placeholder="Enter Document Name"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="bom-id">
                                    BoM ID
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Select removeItemButton>
                                      <option value="">Select ID</option>
                                      <option value="1">uid01</option>
                                      <option value="2">uid02</option>
                                      <option value="3">uid03</option>
                                    </Select>
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="6">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="fg-store">
                                    Finished Good Store
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="fg-store"
                                      placeholder="Finished Good Store"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="6">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="rm-store">
                                    Raw Material Store
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="rm-store"
                                      placeholder="Raw Material Store"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="scrap-store">
                                    Scrap/Reject Store
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="scrap-store"
                                      placeholder="Scrap/Reject Store"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="description">
                                    Description
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="text"
                                      id="description"
                                      placeholder="Write Here..."
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              {/* <Col lg="12">
                                                    <Form.Group className="form-group">
                                                        <Form.Label htmlFor="tax-class">Parent Category</Form.Label>
                                                        <div className="form-control-wrap">
                                                            <Select removeItemButton>
                                                                <option value="">Select an option</option>
                                                                <option value="1">Toothbrush</option>
                                                                <option value="2">Wines</option>
                                                                <option value="3">Cameras</option>
                                                            </Select>
                                                        </div>
                                                    </Form.Group>
                                                </Col> */}

                              {/* <Col lg="6">
                                                                <Form.Group className="form-group">
                                                                    <Form.Label>Meta Tag Keywords</Form.Label>
                                                                    <div className="form-control-wrap">
                                                                        <Tags removeItemButton />
                                                                    </div>
                                                                </Form.Group>
                                                            </Col> */}

                              {/* <Col lg="12">
                                                                <Form.Group className="form-group">
                                                                    <Form.Label>Description</Form.Label>
                                                                    <div className="form-control-wrap">
                                                                        <QuillMinimal placeholderValue="Write category description text..." />
                                                                    </div>
                                                                </Form.Group>
                                                            </Col> */}
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>
                      <div className="gap-col">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            <Button type="submit" variant="primary">
                              Save
                            </Button>
                          </li>
                          <li>
                            <Link
                              to="/seriui/production/bill-of-material"
                              className="btn border-0"
                            >
                              Cancel
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="gap-col">
                        <Block>
                          <Card>
                            <DataTable
                              tableClassName="data-table-head-light table-responsive data-table-checkbox"
                              data={boms}
                              columns={bomColumns}
                              selectableRows
                            ></DataTable>
                          </Card>
                        </Block>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Block>

        <Block className="mt-4">
          <Tab.Content>
            <Tab.Pane eventKey="finished-goods">
              <Form action="#">
                <Row className="g-gs">
                  <Col xxl="12">
                    <div className="gap gy-4">
                      <div className="gap-col">
                        <Card>
                          <Card.Body>
                            <Row className="g-gs">
                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="fg-id">
                                    Finished Good ID
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Select removeItemButton>
                                      <option value="">Select ID</option>
                                      <option value="1">uid01</option>
                                      <option value="2">uid02</option>
                                      <option value="3">uid03</option>
                                    </Select>
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="fg-name">
                                    Name
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="fg-name"
                                      type="text"
                                      placeholder="Enter Finished Good Name"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="category">
                                    Category
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="category"
                                      type="text"
                                      placeholder="Enter Category"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="quality">
                                    Quantity
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="quality"
                                      type="text"
                                      placeholder="Enter Quantity"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="uom">
                                    Unit of Measurement
                                  </Form.Label>
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

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="comment">
                                    Comment
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="comment"
                                      type="text"
                                      placeholder="Comment"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>
                      <div className="gap-col">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            <Button type="submit" variant="primary">
                              Save
                            </Button>
                          </li>
                          <li>
                            <Link
                              to="/seriui/masters/company-list"
                              className="btn border-0"
                            >
                              Cancel
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="gap-col">
                        <Block>
                          <Card>
                            <DataTable
                              tableClassName="data-table-head-light table-responsive data-table-checkbox"
                              data={fgdata}
                              columns={fgColumns}
                              selectableRows
                            ></DataTable>
                          </Card>
                        </Block>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Block>

        <Block className="mt-4">
          <Tab.Content>
            <Tab.Pane eventKey="raw-materials">
              <Form action="#">
                <Row className="g-gs">
                  <Col xxl="12">
                    <div className="gap gy-4">
                      <div className="gap-col">
                        <Card>
                          <Card.Body>
                            <Row className="g-gs">
                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="raw-id">
                                    Raw Material ID
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Select removeItemButton>
                                      <option value="">Select ID</option>
                                      <option value="1">uid01</option>
                                      <option value="2">uid02</option>
                                      <option value="3">uid03</option>
                                    </Select>
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="raw-name">
                                    Name
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="raw-name"
                                      type="text"
                                      placeholder="Enter Raw Material Name"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="raw-category">
                                    Category
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="raw-category"
                                      type="text"
                                      placeholder="Enter Category"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="raw-quality">
                                    Quantity
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="raw-quality"
                                      type="text"
                                      placeholder="Enter Quantity"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="raw-uom">
                                    Unit of Measurement
                                  </Form.Label>
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

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="raw-comment">
                                    Comment
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="raw-comment"
                                      type="text"
                                      placeholder="Comment"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>
                      <div className="gap-col">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            <Button type="submit" variant="primary">
                              Save
                            </Button>
                          </li>
                          <li>
                            <Link
                              to="/seriui/masters/company-list"
                              className="btn border-0"
                            >
                              Cancel
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="gap-col">
                        <Block>
                          <Card>
                            <DataTable
                              tableClassName="data-table-head-light table-responsive data-table-checkbox"
                              data={rmdata}
                              columns={rmColumns}
                              selectableRows
                            ></DataTable>
                          </Card>
                        </Block>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Block>

        <Block className="mt-4">
          <Tab.Content>
            <Tab.Pane eventKey="routing">
              <Form action="#">
                <Row className="g-gs">
                  <Col xxl="12">
                    {/* <div className="gap gy-4">
                                            <div className="gap-col">
                                                <Card>
                                                    <Card.Body>
                                                        <Row className="g-gs">
                                                            <Col lg="12">
                                                                <Form.Group className="form-group">
                                                                    <Form.Label htmlFor="raw-id">Raw Material ID</Form.Label>
                                                                    <div className="form-control-wrap">
                                                                        <Select removeItemButton>
                                                                            <option value="">Select ID</option>
                                                                            <option value="1">uid01</option>
                                                                            <option value="2">uid02</option>
                                                                            <option value="3">uid03</option>
                                                                        </Select>
                                                                    </div>
                                                                </Form.Group>
                                                            </Col>

                                                            <Col lg="12">
                                                                <Form.Group className="form-group">
                                                                    <Form.Label htmlFor="raw-name">Name</Form.Label>
                                                                    <div className="form-control-wrap">
                                                                        <Form.Control id="raw-name" type="text" placeholder="Enter Raw Material Name" />
                                                                    </div>
                                                                </Form.Group>
                                                            </Col>

                                                            <Col lg="12">
                                                                <Form.Group className="form-group">
                                                                    <Form.Label htmlFor="raw-category">Category</Form.Label>
                                                                    <div className="form-control-wrap">
                                                                        <Form.Control id="raw-category" type="text" placeholder="Enter Category" />
                                                                    </div>
                                                                </Form.Group>
                                                            </Col>

                                                            <Col lg="12">
                                                                <Form.Group className="form-group">
                                                                    <Form.Label htmlFor="raw-quality">Quantity</Form.Label>
                                                                    <div className="form-control-wrap">
                                                                        <Form.Control id="raw-quality" type="text" placeholder="Enter Quantity" />
                                                                    </div>
                                                                </Form.Group>
                                                            </Col>

                                                            <Col lg="12">
                                                                <Form.Group className="form-group">
                                                                    <Form.Label htmlFor="raw-uom">Unit of Measurement</Form.Label>
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

                                                            <Col lg="12">
                                                                <Form.Group className="form-group">
                                                                    <Form.Label htmlFor="raw-comment">Comment</Form.Label>
                                                                    <div className="form-control-wrap">
                                                                        <Form.Control id="raw-comment" type="text" placeholder="Comment" />
                                                                    </div>
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                            <div className="gap-col">
                                                <ul className="d-flex align-items-center justify-content-center gap g-3">
                                                    <li>
                                                        <Button type="submit" variant="primary">Save</Button>
                                                    </li>
                                                    <li>
                                                        <Link to="/seriui/masters/company-list" className="btn border-0">Cancel</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div> */}
                  </Col>
                </Row>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Block>

        <Block className="mt-4">
          <Tab.Content>
            <Tab.Pane eventKey="scrap">
              <Form action="#">
                <Row className="g-gs">
                  <Col xxl="12">
                    <div className="gap gy-4">
                      <div className="gap-col">
                        <Card>
                          <Card.Body>
                            <Row className="g-gs">
                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="scrap-id">
                                    Scrap ID
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Select removeItemButton>
                                      <option value="">Select ID</option>
                                      <option value="1">uid01</option>
                                      <option value="2">uid02</option>
                                      <option value="3">uid03</option>
                                    </Select>
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="scrap-name">
                                    Name
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="scrap-name"
                                      type="text"
                                      placeholder="Scrap Name"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="scrap-category">
                                    Category
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="scrap-category"
                                      type="text"
                                      placeholder="Enter Category"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="scrap-quality">
                                    Quantity
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="scrap-quality"
                                      type="text"
                                      placeholder="Enter Quantity"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="scrap-uom">
                                    Unit of Measurement
                                  </Form.Label>
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

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="scrap-comment">
                                    Comment
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="scrap-comment"
                                      type="text"
                                      placeholder="Comment"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>
                      <div className="gap-col">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            <Button type="submit" variant="primary">
                              Save
                            </Button>
                          </li>
                          <li>
                            <Link
                              to="/seriui/masters/company-list"
                              className="btn border-0"
                            >
                              Cancel
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="gap-col">
                        <Block>
                          <Card>
                            <DataTable
                              tableClassName="data-table-head-light table-responsive data-table-checkbox"
                              data={scrapdata}
                              columns={scrapColumns}
                              selectableRows
                            ></DataTable>
                          </Card>
                        </Block>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Block>

        <Block className="mt-4">
          <Tab.Content>
            <Tab.Pane eventKey="other-charges">
              <Form action="#">
                <Row className="g-gs">
                  <Col xxl="12">
                    <div className="gap gy-4">
                      <div className="gap-col">
                        <Card>
                          <Card.Body>
                            <Row className="g-gs">
                              {/* <Col lg="12">
                                                                <Form.Group className="form-group">
                                                                    <Form.Label htmlFor="scrap-id">Scrap ID</Form.Label>
                                                                    <div className="form-control-wrap">
                                                                        <Select removeItemButton>
                                                                            <option value="">Select ID</option>
                                                                            <option value="1">uid01</option>
                                                                            <option value="2">uid02</option>
                                                                            <option value="3">uid03</option>
                                                                        </Select>
                                                                    </div>
                                                                </Form.Group>
                                                            </Col> */}

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="other-name">
                                    Other Charges Name
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="other-name"
                                      type="text"
                                      placeholder="Other Charges Name"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="other-amount">
                                    Amount
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="other-amount"
                                      type="text"
                                      placeholder="Enter Amount"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="12">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="other-description">
                                    Description
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="other-description"
                                      type="text"
                                      placeholder="Write Here..."
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>
                      <div className="gap-col">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            <Button type="submit" variant="primary">
                              Save
                            </Button>
                          </li>
                          <li>
                            <Link
                              to="/seriui/masters/company-list"
                              className="btn border-0"
                            >
                              Cancel
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="gap-col">
                        <Block>
                          <Card>
                            <DataTable
                              tableClassName="data-table-head-light table-responsive data-table-checkbox"
                              data={otherChargesdata}
                              columns={otherChargesColumns}
                              selectableRows
                            ></DataTable>
                          </Card>
                        </Block>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Block>
      </Tab.Container>
    </Layout>
  );
}

export default AddBomPage;
