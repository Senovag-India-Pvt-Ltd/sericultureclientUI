import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {
  Icon,
  CustomDropdownToggle,
  CustomDropdownMenu,
} from "../../components";

function SubsidyCounterSigning() {
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);
  return (
    <Layout title="Subsidy Counter Signing List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Subsidy Counter Signing List</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item"><Link to="/crm/case-task">Subsidy Counter Signing List</Link></li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  List
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/stake-holder-registration"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/stake-holder-registration"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Block>
        <Card>
          <div className="table-responsive" style={{ paddingBottom: "100px" }}>
            <table className="table small">
              <thead>
                <tr>
                  {/* <th></th> */}
                  <th>Farmer Id</th>
                  <th>Financial Year</th>
                  <th>Farmer Name</th>
                  <th>Mobile</th>
                  <th>Category</th>
                  <th>Head of Account</th>
                  <th>Scheme</th>
                  <th>Sub Scheme</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>fid01</td>
                  <td>20/10/2023</td>
                  <td>Basappa</td>
                  <td>8098787890</td>
                  <td>106(General)</td>
                  <td>Sericulture Development Programme</td>
                  <td>
                    Subsidy for Mulberry garden implements/ Silkworm rearing
                    equipments
                  </td>
                  <td>Subsidy for Mulberry garden implements</td>
                  <td style={{ color: "Orange", fontWeight: "bold" }}>
                    Pending
                  </td>
                  <td>
                    <div className="text-end w-100 d-flex justify-content-start">
                      <Dropdown>
                        <Dropdown.Toggle
                          size="sm"
                          as={CustomDropdownToggle}
                          className="btn btn-sm btn-icon btn-zoom me-n1"
                        >
                          <Icon name="more-v"></Icon>
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                          className="dropdown-menu-sm"
                          as={CustomDropdownMenu}
                          align="end"
                        >
                          <div className="dropdown-content py-1">
                            <Button
                              style={{ width: "100%" }}
                              variant=""
                              onClick={handleShowModal1}
                            >
                              View
                            </Button>
                            <Button
                              style={{ width: "100%" }}
                              variant=""
                              onClick={handleShowModal2}
                            >
                              Modify
                            </Button>
                            <Button
                              style={{ width: "100%" }}
                              variant=""
                              onClick={handleShowModal}
                            >
                              Approve/Reject
                            </Button>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>fid02</td>
                  <td>20/10/2023</td>
                  <td>Basappa</td>
                  <td>8098787890</td>
                  <td>422(SC)</td>
                  <td>Sericulture Development Programme</td>
                  <td>
                    Subsidy for Chawki garden maintenance/ Chawki rearing
                    building/Chawki rearing equipments
                  </td>
                  <td>Subsidy for Chawki garden maintenance</td>
                  <td style={{ color: "Green", fontWeight: "bold" }}>
                    Approved
                  </td>
                  <td>
                    <div className="text-end w-100 d-flex justify-content-start">
                      <Dropdown>
                        <Dropdown.Toggle
                          size="sm"
                          as={CustomDropdownToggle}
                          className="btn btn-sm btn-icon btn-zoom me-n1"
                        >
                          <Icon name="more-v"></Icon>
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                          className="dropdown-menu-sm"
                          as={CustomDropdownMenu}
                          align="end"
                        >
                          <div className="dropdown-content py-1">
                            <Button
                              style={{ width: "100%" }}
                              variant=""
                              onClick={handleShowModal1}
                            >
                              View
                            </Button>
                            <Button
                              style={{ width: "100%" }}
                              variant=""
                              onClick={handleShowModal2}
                            >
                              Modify
                            </Button>
                            <Button
                              style={{ width: "100%" }}
                              variant=""
                              onClick={handleShowModal}
                            >
                              Approve/Reject
                            </Button>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>fid03</td>
                  <td>20/10/2023</td>
                  <td>Basappa</td>
                  <td>8098787890</td>
                  <td>423(ST)</td>
                  <td>Sericulture Development Programme</td>
                  <td>
                    Subsidy for Chawki garden maintenance/ Chawki rearing
                    building/Chawki rearing equipments
                  </td>
                  <td>Chawki rearing building</td>
                  <td style={{ color: "Red", fontWeight: "bold" }}>Rejected</td>
                  <td>
                    <div className="text-end w-100 d-flex justify-content-start">
                      <Dropdown>
                        <Dropdown.Toggle
                          size="sm"
                          as={CustomDropdownToggle}
                          className="btn btn-sm btn-icon btn-zoom me-n1"
                        >
                          <Icon name="more-v"></Icon>
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                          className="dropdown-menu-sm"
                          as={CustomDropdownMenu}
                          align="end"
                        >
                          <div className="dropdown-content py-1">
                            <Button
                              style={{ width: "100%" }}
                              variant=""
                              onClick={handleShowModal1}
                            >
                              View
                            </Button>
                            <Button
                              style={{ width: "100%" }}
                              variant=""
                              onClick={handleShowModal2}
                            >
                              Modify
                            </Button>
                            <Button
                              style={{ width: "100%" }}
                              variant=""
                              onClick={handleShowModal}
                            >
                              Approve/Reject
                            </Button>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Approve/Reject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="6">
                {/* 
              <Form.Group
                      as={Row}
                      className="form-group mt-3"
                      controlId="fid"
                    >
                      <Form.Label column sm={4}>
                        FRUITS ID / AADHAAR NUMBER
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control type="text" placeholder="FRUITS ID / AADHAAR NUMBER" value="Hello" />
                      </Col>
                      
                    </Form.Group> */}

                <Form.Group className="form-group">
                  <Form.Label htmlFor="fid">Farmer ID</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fid"
                      type="text"
                      placeholder="Farmer ID"
                      value="fid1"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="fyear">Financial Year</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fyear"
                      type="text"
                      placeholder="Financial Year"
                      value="2023-2024"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="fname">Farmer Name</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fname"
                      type="text"
                      placeholder="Farmer Name"
                      value="Basappa"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="mbl">Mobile</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="mbl"
                      type="text"
                      placeholder="Mobile"
                      value="8596742302"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="cmt">Comment</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      as="textarea"
                      placeholder="Enter Comment"
                      id="cmt"
                      rows="3"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      {/* <Form.Label>With Land</Form.Label> */}
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          label="Pre Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      {/* <Form.Label>With Land</Form.Label> */}
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          label="Post Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 mt-3">
                  <div className="gap-col">
                    <Button variant="success" onClick={handleCloseModal}>
                      Approve
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal}>
                      Reject
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal1} onHide={handleCloseModal1} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>View Model</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="6">
                {/* 
              <Form.Group
                      as={Row}
                      className="form-group mt-3"
                      controlId="fid"
                    >
                      <Form.Label column sm={4}>
                        FRUITS ID / AADHAAR NUMBER
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control type="text" placeholder="FRUITS ID / AADHAAR NUMBER" value="Hello" />
                      </Col>
                      
                    </Form.Group> */}

                {/* <Form.Group className="form-group">
                  <Form.Label htmlFor="fid">Farmer ID</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fid"
                      type="text"
                      placeholder="Farmer ID"
                      value="fid1"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="fyear">Financial Year</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fyear"
                      type="text"
                      placeholder="Financial Year"
                      value="2023-2024"
                    />
                  </div>
                </Form.Group> */}
              </Col>
              <Col lg="6">
                {/* <Form.Group className="form-group">
                  <Form.Label htmlFor="fname">Farmer Name</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fname"
                      type="text"
                      placeholder="Farmer Name"
                      value="Basappa"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="mbl">Mobile</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="mbl"
                      type="text"
                      placeholder="Mobile"
                      value="8596742302"
                    />
                  </div>
                </Form.Group> */}
              </Col>

              <Col lg="12">
                {/* <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="cmt">Comment</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      as="textarea"
                      placeholder="Enter Comment"
                      id="cmt"
                      rows="3"
                    />
                  </div>
                </Form.Group> */}
              </Col>

              <Col lg="12">
                {/* <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          defaultChecked
                          label="Pre Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          defaultChecked
                          label="Post Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row> */}
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 mt-3">
                  {/* <div className="gap-col">
                    <Button variant="success" onClick={handleCloseModal1}>
                      Approve
                    </Button>
                  </div> */}
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal1}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal1}>
                      Close
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Modify Model</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="6">
                {/* 
              <Form.Group
                      as={Row}
                      className="form-group mt-3"
                      controlId="fid"
                    >
                      <Form.Label column sm={4}>
                        FRUITS ID / AADHAAR NUMBER
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control type="text" placeholder="FRUITS ID / AADHAAR NUMBER" value="Hello" />
                      </Col>
                      
                    </Form.Group> */}

                {/* <Form.Group className="form-group">
                  <Form.Label htmlFor="fid">Farmer ID</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fid"
                      type="text"
                      placeholder="Farmer ID"
                      value="fid1"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="fyear">Financial Year</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fyear"
                      type="text"
                      placeholder="Financial Year"
                      value="2023-2024"
                    />
                  </div>
                </Form.Group> */}
              </Col>
              <Col lg="6">
                {/* <Form.Group className="form-group">
                  <Form.Label htmlFor="fname">Farmer Name</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fname"
                      type="text"
                      placeholder="Farmer Name"
                      value="Basappa"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="mbl">Mobile</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="mbl"
                      type="text"
                      placeholder="Mobile"
                      value="8596742302"
                    />
                  </div>
                </Form.Group> */}
              </Col>

              <Col lg="12">
                {/* <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="cmt">Comment</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      as="textarea"
                      placeholder="Enter Comment"
                      id="cmt"
                      rows="3"
                    />
                  </div>
                </Form.Group> */}
              </Col>

              <Col lg="12">
                {/* <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          defaultChecked
                          label="Pre Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          defaultChecked
                          label="Post Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row> */}
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 mt-3">
                  <div className="gap-col">
                    <Button variant="success" onClick={handleCloseModal2}>
                      Save
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal2}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal2}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default SubsidyCounterSigning;
