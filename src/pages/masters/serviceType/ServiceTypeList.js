import { useState } from "react";
import { Card, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DataTable from "../../../components/DataTable/DataTable";
import { Icon } from "../../../components";
import ServiceTypeData, {
  serviceTypeColumns,
} from "../../../store/masters/serviceType/ServiceTypeData";

function ServiceTypeList() {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <Layout title="Service Type List" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Service Type List</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="/user-manage/user-list">User Manage</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Service Type
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
                  <span>Add Service Type</span>
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
            data={ServiceTypeData}
            columns={serviceTypeColumns}
          />
        </Card>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Service Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="stname">Service Type Name</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control id="stname" type="text" placeholder="Name" />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="description">Description</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="description"
                      type="text"
                      placeholder="Write Here..."
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="12">
                <div className="d-flex gap g-2">
                  <div className="gap-col">
                    <Button variant="primary" onClick={handleCloseModal}>
                      Add Service Type
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

export default ServiceTypeList;
