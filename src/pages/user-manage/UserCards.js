import { useState } from 'react';
import { Card, Button, Modal, Form, Row, Col, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Layout from '../../layout/default';
import Block from '../../components/Block/Block';
import { Icon, Select, Media, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem, Image } from '../../components';
import UsersData from '../../store/users/UsersData';
import { toInitials } from "../../utilities";
import Pagination from '../../components/Pagination/Pagination';

function UserCardsPage() {
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [data] = useState(UsersData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(12);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const itemChangePerPage = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout title="Users Cards" content="container">
        <Block.Head>
            <Block.HeadBetween>
                <Block.HeadContent>
                    <Block.Title tag="h2">Users Cards</Block.Title>
                    <nav>
                        <ol className="breadcrumb breadcrumb-arrow mb-0">
                          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                          <li className="breadcrumb-item"><Link to="/user-manage/user-list">User Manage</Link></li>
                          <li className="breadcrumb-item active" aria-current="page">Users</li>
                        </ol>
                    </nav>
                </Block.HeadContent>
                <Block.HeadContent>
                    <ul className="d-flex">
                        <li>
                            <Button className="d-md-none" size="md" variant="primary" onClick={handleShowModal}>
                                <Icon name="plus"/>
                                <span>Add</span>
                            </Button>
                        </li>
                        <li>
                            <Button className="d-none d-md-inline-flex" variant="primary" onClick={handleShowModal}>
                                <Icon name="plus"/>
                                <span>Add User</span>
                            </Button>
                        </li>
                    </ul>
                </Block.HeadContent>
            </Block.HeadBetween>
        </Block.Head>

      <Block>
        <Row className="g-gs">
            {currentItems.map((item) => {
                // destructured from items
                const { id, avatar, theme, name, role, followers, following } = item;
                return (
                    <Col sm="6" xl="4" xxl="3" key={id}>
                        <Card className="text-center h-100">
                            <Card.Body>
                                <Media size="xxl" shape="circle" variant={theme}>
                                    { avatar ? 
                                        <Image src={avatar} staticImage alt="user"/> :
                                        <span className="fw-medium">{toInitials(name)}</span>
                                    }
                                </Media>
                                <div className="mt-1 mb-4">
                                    <Link to={`/user-manage/user-profile/${id}`} className="mb-1 h5">{name}</Link>
                                    <div className="small">{role}</div>
                                </div>
                                <Row className="g-gs justify-content-center">
                                    <Col className="col-5">
                                        <div className="h5 mb-1">{followers}</div>
                                        <div className="small">Followers</div>
                                    </Col>
                                    <Col className="col-5">
                                        <div className="h5 mb-1">{following}<span>K</span></div>
                                        <div className="small">Following</div>
                                    </Col>
                                </Row>
                            </Card.Body>
                            <Dropdown className="position-absolute top-0 end-0 p-3">
                                <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                                    <Icon name="more-v"></Icon>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-sm" as={CustomDropdownMenu} align="end">
                                    <div className="dropdown-content py-1">
                                        <LinkList className="link-list-hover-bg-primary link-list-md">
                                            <LinkListItem to={`/user-manage/user-edit/${id}`}>
                                                <Icon name="edit"></Icon><span>Edit</span>
                                            </LinkListItem>
                                            <LinkListItem to={`/user-manage/user-edit/${id}`}>
                                                <Icon name="trash"></Icon><span>Delete</span>
                                            </LinkListItem>
                                            <LinkListItem to={`/user-manage/user-profile/${id}`}>
                                                <Icon name="eye"></Icon><span>View Details</span>
                                            </LinkListItem>
                                        </LinkList>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Card>
                    </Col>
                )
            })}
        </Row>
        <Card className="mt-5">
            <Card.Body>
                <Pagination
                    itemPerPage={itemPerPage}
                    totalItems={data.length}
                    paginate={itemChangePerPage}
                    currentPage={currentPage}
                />
            </Card.Body>
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
                              <Form.Control id="firstname" type="text" placeholder="First name"/>
                          </div>
                      </Form.Group>
                  </Col>
                  <Col lg="6">
                      <Form.Group className="form-group">
                          <Form.Label htmlFor="lastname">Last Name</Form.Label>
                          <div className="form-control-wrap">
                              <Form.Control id="lastname" type="text" placeholder="Last name"/>
                          </div>
                      </Form.Group>
                  </Col>
                  <Col lg="6">
                      <Form.Group className="form-group">
                          <Form.Label htmlFor="email">Email Address</Form.Label>
                          <div className="form-control-wrap">
                              <Form.Control id="email" type="text" placeholder="Email address"/>
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
                      <div className="d-flex gap g-2">
                          <div className="gap-col">
                              <Button variant="primary" onClick={handleCloseModal}>Add User</Button>
                          </div>
                          <div className="gap-col">
                              <button type="button" className="border-0 btn" onClick={handleCloseModal}>Discard</button>
                          </div>
                      </div>
                  </Col>
              </Row>
          </Form>
        </Modal.Body>
      </Modal>

    </Layout>
  )
}

export default UserCardsPage;