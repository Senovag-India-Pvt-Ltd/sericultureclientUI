import { useState } from "react";
import { Card, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DataTable from "../../../components/DataTable/DataTable";
import { Icon, Select, QuillMinimal } from "../../../components";
import StockTransfer, {
  stockTransferColumns,
} from "../../../store/masters/inventory/StockTransferData";

function StockTransferPage() {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <Layout title="Stock Transfer" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Stock Transfer List</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/masters/billing-address">
                    Stock Transfer List
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Stock Tranfer
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
                  <span>New Item Transfer</span>
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
            data={StockTransfer}
            columns={stockTransferColumns}
          />
        </Card>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>New Item Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label>Select Item</Form.Label>
                  <div className="form-control-wrap">
                    <Select removeItemButton>
                      <option value="">Select Item</option>
                      <option value="1">Item1</option>
                      <option value="2">Item2</option>
                      <option value="3">Item3</option>
                    </Select>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label>From Store</Form.Label>
                  <div className="form-control-wrap">
                    <Select removeItemButton>
                      <option value="">Select Store</option>
                      <option value="1">Store1</option>
                      <option value="2">Store2</option>
                      <option value="3">Store3</option>
                    </Select>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label>To Store</Form.Label>
                  <div className="form-control-wrap">
                    <Select removeItemButton>
                      <option value="">Select Store</option>
                      <option value="1">Store1</option>
                      <option value="2">Store2</option>
                      <option value="3">Store3</option>
                    </Select>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label>Description</Form.Label>
                  <div className="form-control-wrap">
                    <QuillMinimal placeholderValue="Write description text..." />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="qty">Quantity</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="qty"
                      type="text"
                      placeholder="Number of Quantity"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex gap g-2">
                  <div className="gap-col">
                    <Button variant="primary" onClick={handleCloseModal}>
                      Transfer
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

export default StockTransferPage;
