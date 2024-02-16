import { useState } from "react";
import { Card, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DataTable from "../../../components/DataTable/DataTable";
import { Icon } from "../../../components";
import BankDetailsData, {
  bankDetailsColumns,
} from "../../../store/masters/accounts/BankDetailsData";

function BankDetailsListPage() {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <Layout title="Bank Details List" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Bank Details</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/masters/bank-details">
                    Bank Details list
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Bank Details
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Button
                  className="d-md-none"
                  size="md"
                  variant="primary"
                  onClick={handleShowModal}
                >
                  <Icon name="plus" />
                  <span>Add</span>
                </Button>
              </li>
              <li>
                <Button
                  className="d-none d-md-inline-flex"
                  variant="primary"
                  onClick={handleShowModal}
                >
                  <Icon name="plus" />
                  <span>Add Bank Details</span>
                </Button>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block>
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            data={BankDetailsData}
            columns={bankDetailsColumns}
          />
        </Card>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Bank Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="bankName">Bank Name</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="bankName"
                      type="text"
                      placeholder="Enter Bank Name"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="accountName">Account Name</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="accountName"
                      type="text"
                      placeholder="Enter Account Name"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="AccNumber">Account Number</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="AccNumber"
                      type="text"
                      placeholder="Enter Account Number"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="branch">Branch</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="branch"
                      type="text"
                      placeholder="Enter Branch Name"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="ifsc">IFSC</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="ifsc"
                      type="text"
                      placeholder="Enter IFSC code"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="address">Address</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="address"
                      type="text"
                      placeholder="Enter Bank Address"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex gap g-2">
                  <div className="gap-col">
                    <Button variant="primary" onClick={handleCloseModal}>
                      Save
                    </Button>
                  </div>
                  <div className="gap-col">
                    <button
                      type="button"
                      className="border-0 btn"
                      onClick={handleCloseModal}
                    >
                      Discard
                    </button>
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

export default BankDetailsListPage;
