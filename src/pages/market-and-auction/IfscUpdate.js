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

function IfscUpdate() {
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
    <Layout title="IFSC Update">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">IFSC Update</Block.Title>
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

      <Block className="mt-4">
        <Card>
          <Card.Header className="text-center">Select Cheque No</Card.Header>
          <Card.Body>
            
              <Row className="g-gs">
                <Col lg="12">
                <Dropdown>
            <Dropdown.Toggle variant="primary" id="chequeNoDropdown">
                Select Cheque No
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {/* Replace the dummy values below with your actual Cheque No values */}
            <Dropdown.Item href="#">Cheque No 1</Dropdown.Item>
            <Dropdown.Item href="#">Cheque No 2</Dropdown.Item>
            <Dropdown.Item href="#">Cheque No 3</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
            {/* <table className="table table-striped table-bordered"> */}
              <thead>
                <tr>
                  {/* <th></th> */}
                  {/* <th>Ready For Payment</th> */}
                  {/* <th>select Cheque No</th> */}
                  <th>
                  <button className="btn btn-info">Update</button>
                  </th>
                  {/* <th>Lot Nbr</th>
                  <th>Transaction_Date</th>
                  <th>Farmer</th>
                  <th>TSC</th>
                  <th>Phone</th>
                  <th>Reeler</th>
                  <th>Bank</th>
                  <th>IFSC Len</th>
                  <th>IFSC</th>
                  <th>Account No</th>
                  <th>Amount</th>
                  <th>MF</th>
                  <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* <td>1</td> */}
                  {/* <td>111</td> */}
                  {/* <td>100056</td> */}
                  {/* <td>Basappa</td>
                  <td>Kolar</td>
                  <td>99999999</td>
                  <td>KKR13145</td>
                  <td>Karnataka Bank</td>
                  <td>0-Ok</td>
                  <td>KARB0001</td>
                  <td>100000123</td>
                  <td>4000</td>
                  <td>112</td> */}
                  {/* <td>
                    <button className="btn btn-info">Update</button>
                  </td> */}
                  {/* <td>
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
                  </td> */}
                </tr>
                {/* <tr>
                <td>
                    <button className="btn btn-info">remove</button>
                  </td>
                  <td>2</td>
                  <td>123</td>
                  <td>16/052001</td>
                  <td>Veerappa</td>
                  <td>Gadag</td>
                  <td>99999987</td>
                  <td>KKR13147</td>
                  <td>Sbi Bank</td>
                  <td>0-Ok</td>
                  <td>SBI0001</td>
                  <td>100000124</td>
                  <td>3500</td>
                  <td>114</td>
                  <td>
                    <button className="btn btn-info">remove</button>
                  </td> */}
                  {/* <td>
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
                  </td> */}
                {/* </tr>
                <tr>
                <td>
                    <button className="btn btn-info">remove</button>
                  </td>
                  <td>3</td>
                  <td>555</td>
                  <td>16/052001</td>
                  <td>Rama</td>
                  <td>Udupi</td>
                  <td>9999456</td>
                  <td>KKR25145</td>
                  <td>Karnataka Bank</td>
                  <td>0-Ok</td>
                  <td>KARB0001</td>
                  <td>100000123</td>
                  <td>4000</td>
                  <td>112</td>
                  <td>
                    <button className="btn btn-info">remove</button>
                  </td> */}
                  {/* <td>
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
                  </td> */}
                {/* </tr> */}
              </tbody>
            {/* </table> */}
            </Col>
              </Row>
            
          </Card.Body>
        </Card>
      </Block>
      {/* <Block>
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            data={SubsidyApprovalVerificationDatas}
            columns={SubsidyApprovalVerificationColumns}
            expandableRows
          />
        </Card>
      </Block> */}

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
                  <Form.Label htmlFor="actions">Actions</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="actions"
                      type="text"
                      placeholder="Actions"
                      value="actions1"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="slno">SL No</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="slno"
                      type="text"
                      placeholder="SL No"
                      value="1"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="lotno">Lot Nbr</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="lotno"
                      type="text"
                      placeholder="Lot Nbr"
                      value="411"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="tradate">Transaction_Date</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="tradate"
                      type="text"
                      placeholder="Transaction_Date"
                      value="16/05/2001"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
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

export default IfscUpdate;
