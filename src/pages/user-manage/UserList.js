import { useState } from "react";
import { Card, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "../../components/DataTable/DataTable";
import { Icon, Select } from "../../components";
import UsersData, { userColumns } from "../../store/users/UsersData";

function UserListPage() {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <Layout title="Users List" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Users List</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/user-manage/user-list">User Manage</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Users
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
                  <span>Add User</span>
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
            data={UsersData}
            columns={userColumns}
          />
        </Card>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="firstname">First Name</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="firstname"
                      type="text"
                      placeholder="First name"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="lastname">Last Name</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="lastname"
                      type="text"
                      placeholder="Last name"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="email">Email Address</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="email"
                      type="text"
                      placeholder="Email address"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>Status</Form.Label>
                  <div className="form-control-wrap">
                    <Select removeItemButton>
                      <option value="">Select a status</option>
                      <option value="1">Pending</option>
                      <option value="2">Active</option>
                      <option value="3">Inactive</option>
                    </Select>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="pin">PIN</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control id="pin" type="text" placeholder="PIN Code" />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label>Role</Form.Label>
                  <div className="form-control-wrap">
                    <Select removeItemButton>
                      <option value="">Select a role</option>
                      <option value="1">Administrator</option>
                      <option value="2">Developer</option>
                      <option value="3">Analyst</option>
                      <option value="4">Support</option>
                      <option value="5">Trial</option>
                    </Select>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label>User Group</Form.Label>
                  <div className="form-control-wrap">
                    <Select removeItemButton>
                      <option value="">Select a user group</option>
                      <option value="1">Group-1</option>
                      <option value="2">Group-2</option>
                      <option value="3">Group-3</option>
                      <option value="4">Group-4</option>
                      <option value="5">Group-5</option>
                    </Select>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label>Type</Form.Label>
                  <div className="form-control-wrap">
                    <Select removeItemButton>
                      <option value="">Select a user type</option>
                      <option value="1">Customer</option>
                      <option value="2">Vendor</option>
                      <option value="3">Technician</option>
                    </Select>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="12">
                <div className="d-flex gap g-2">
                  <div className="gap-col">
                    <Button variant="primary" onClick={handleCloseModal}>
                      Add User
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

export default UserListPage;
