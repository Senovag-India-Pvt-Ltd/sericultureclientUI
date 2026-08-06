import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useTranslation } from "react-i18next";
import {
  Icon,
  CustomDropdownToggle,
  CustomDropdownMenu,
} from "../../components";

const subsidyApprovalVerificationStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title { margin-bottom: 4px; color: #ffffff !important; font-weight: 700; letter-spacing: 0.2px; }
  .sh-page-header .breadcrumb-item, .sh-page-header .breadcrumb-item a { color: rgba(255,255,255,0.85) !important; }
  .sh-page-header .breadcrumb-item.active { color: #ffffff !important; }
  .sh-page-header .breadcrumb-item + .breadcrumb-item::before { color: rgba(255,255,255,0.6) !important; }
  .sh-form-wrap { background: #eef2f8; border-radius: 14px; padding: 18px; }
  .sh-form-wrap .card { border: none; border-radius: 12px !important; box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1); overflow: hidden; }
  .sh-form-wrap table thead th {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%); color: #fff;
    font-weight: 700; font-size: 12.5px; text-transform: uppercase; letter-spacing: 0.3px;
    border: none; padding: 10px 12px; white-space: nowrap;
  }
  .sh-form-wrap table tbody tr:hover { background-color: #f3f8fd; }
  .sh-form-wrap table tbody td { padding: 8px 12px; vertical-align: middle; }
  .sh-modal-content { border-radius: 12px !important; border: 1px solid #e3ebf6 !important; overflow: hidden; }
  .sh-modal-content .modal-header { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%); border-bottom: none; padding: 16px 22px; }
  .sh-modal-content .modal-header .btn-close { filter: brightness(0) invert(1); opacity: 0.85; }
  .sh-modal-content .modal-title { color: #ffffff; font-weight: 700; }
  .sh-modal-content .modal-body { padding: 22px 24px; }
  .sh-modal-content .form-control, .sh-modal-content .form-select {
    border-radius: 8px; border: 1px solid #dbe4f0;
  }
  .sh-modal-content .btn-secondary {
    background: #ffffff; color: #e3496a; border: 1.5px solid #e3496a; border-radius: 8px; font-weight: 600;
  }
`;

function SubsidyApprovalVerification() {

  // Translation
  const { t } = useTranslation();
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
    <Layout title="Subsidy Verification List">
      <style>{subsidyApprovalVerificationStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title">{t("Subsidy Verification List")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">{t("Home")}</Link>
                </li>
                {/* <li className="breadcrumb-item"><Link to="/seriui/crm/case-task">Subsidy Verification List</Link></li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  {t("List")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/stake-holder-registration"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/stake-holder-registration"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card>
          <div className="table-responsive" style={{ paddingBottom: "100px" }}>
            <table className="table small">
              <thead>
                <tr>
                  {/* <th></th> */}
                  <th>{t("Farmer Id")}</th>
                  <th>{t("Financial Year")}</th>
                  <th>{t("beneficiary_name")}</th>
                  <th>{t("mobile_number")}</th>
                  <th>{t("Category")}</th>
                  <th>{t("Head of Account")}</th>
                  <th>{t("Scheme")}</th>
                  <th>{t("Sub Scheme")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Action")}</th>
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
                  {t("Pending")}
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
                              {t("View")}
                            </Button>
                            <Button
                              style={{ width: "100%" }}
                              variant=""
                              onClick={handleShowModal2}
                            >
                              {t("Modify")}
                            </Button>
                            <Button
                              style={{ width: "100%" }}
                              variant=""
                              onClick={handleShowModal}
                            >
                              {t("Approve/Reject")}
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
                    {t("Approved")}
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
                              {t("View")}
                            </Button>
                            <Button
                              style={{ width: "100%" }}
                              variant=""
                              onClick={handleShowModal2}
                            >
                               {t("Modify")}
                            </Button>
                            <Button
                              style={{ width: "100%" }}
                              variant=""
                              onClick={handleShowModal}
                            >
                              {t("Approve/Reject")}
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
                  <td style={{ color: "Red", fontWeight: "bold" }}>{t("Rejected")}</td>
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
                              {t("View")}
                            </Button>
                            <Button
                              style={{ width: "100%" }}
                              variant=""
                              onClick={handleShowModal2}
                            >
                              {t("Modify")}
                            </Button>
                            <Button
                              style={{ width: "100%" }}
                              variant=""
                              onClick={handleShowModal}
                            >
                              {t("Approve/Reject")}
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

      <Modal show={showModal} onHide={handleCloseModal} size="lg" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>{t("Approve/Reject")}</Modal.Title>
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
                  <Form.Label htmlFor="fid">{t("Farmer Id")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fid"
                      type="text"
                      placeholder={t("Farmer Id")}
                      value="fid1"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="fyear">{t("Financial Year")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fyear"
                      type="text"
                      placeholder={t("Financial Year")}
                      value="2023-2024"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="fname">{t("beneficiary_name")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fname"
                      type="text"
                      placeholder={t("beneficiary_name")}
                      value="Basappa"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="mbl">{t("mobile_number")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="mbl"
                      type="text"
                      placeholder={t("mobile_number")}
                      value="8596742302"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="cmt">{t("Comment")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      as="textarea"
                      placeholder={t("Comment")}
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
                          label={t("Pre Inspection")}
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
                          label={t("Post Inspection")}
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
                      {t("Approve")}
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal}>
                      {t("Reject")}
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal}>
                      {t("Cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal1} onHide={handleCloseModal1} size="lg" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>{t("View Model")}</Modal.Title>
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
                  <Form.Label htmlFor="fname">Beneficiary Name</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fname"
                      type="text"
                      placeholder="Beneficiary Name"
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
                    {t("Close")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="lg" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>{t("Modify Model")}</Modal.Title>
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
                  <Form.Label htmlFor="fname">Beneficiary Name</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fname"
                      type="text"
                      placeholder="Beneficiary Name"
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
                    {t("save")}
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal2}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal2}>
                    {t("cancel")}
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

export default SubsidyApprovalVerification;
