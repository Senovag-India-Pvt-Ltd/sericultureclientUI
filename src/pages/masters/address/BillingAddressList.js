import { useState } from 'react';
import { Card, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Layout from '../../../layout/default';
import Block from '../../../components/Block/Block';
import DataTable from '../../../components/DataTable/DataTable';
import { Icon, Select } from '../../../components';
import BillingAddressData, { billingAddressColumns } from '../../../store/masters/address/BillingAddressData';

function BillingAddressListPage() {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <Layout title="Billing Address List" content="container">
        <Block.Head>
            <Block.HeadBetween>
                <Block.HeadContent>
                    <Block.Title tag="h2">Billing Address</Block.Title>
                    <nav>
                        <ol className="breadcrumb breadcrumb-arrow mb-0">
                          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                          <li className="breadcrumb-item"><Link to="/masters/billing-address">Billing Address list</Link></li>
                          <li className="breadcrumb-item active" aria-current="page">Billing Address</li>
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
                                <span>Add Billing Address</span>
                            </Button>
                        </li>
                    </ul>
                </Block.HeadContent>
            </Block.HeadBetween>
        </Block.Head>

      <Block>
        <Card>
          <DataTable tableClassName="data-table-head-light table-responsive" data={BillingAddressData} columns={billingAddressColumns}/>
        </Card>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Billing Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
              <Row className="g-3">
                  <Col lg="12">
                      <Form.Group className="form-group">
                          <Form.Label htmlFor="name">Address1</Form.Label>
                          <div className="form-control-wrap">
                              <Form.Control id="name" type="text" placeholder="Address1"/>
                          </div>
                      </Form.Group>
                  </Col>

                  <Col lg="12">
                      <Form.Group className="form-group">
                          <Form.Label htmlFor="name">Address2</Form.Label>
                          <div className="form-control-wrap">
                              <Form.Control id="name" type="text" placeholder="Address2"/>
                          </div>
                      </Form.Group>
                  </Col>

                  <Col lg="12">
                      <Form.Group className="form-group">
                          <Form.Label htmlFor="name">Pin</Form.Label>
                          <div className="form-control-wrap">
                              <Form.Control id="name" type="text" placeholder="Enter Pin Code"/>
                          </div>
                      </Form.Group>
                  </Col>

                  <Col lg="12">
                      <Form.Group className="form-group">
                          <Form.Label htmlFor="name">City</Form.Label>
                          <div className="form-control-wrap">
                              <Form.Control id="name" type="text" placeholder="City Name"/>
                          </div>
                      </Form.Group>
                  </Col>

                  <Col lg="12">
                      <Form.Group className="form-group">
                          <Form.Label>State</Form.Label>
                          <div className="form-control-wrap">
                              <Select removeItemButton>
                                  <option value="">Select a State</option>
                                  <option value="1">Karnataka</option>
                                  <option value="2">Tamil Nadu</option>
                                  <option value="3">Kerala</option>
                              </Select>
                          </div>
                      </Form.Group>
                  </Col>

                  <Col lg="12">
                      <Form.Group className="form-group">
                          <Form.Label>Country</Form.Label>
                          <div className="form-control-wrap">
                              <Select removeItemButton>
                                  <option value="">Select a Country</option>
                                  <option value="1">India</option>
                                  <option value="2">China</option>
                                  <option value="3">Russia</option>
                              </Select>
                          </div>
                      </Form.Group>
                  </Col>

                  <Col lg="12">
                      <div className="d-flex gap g-2">
                          <div className="gap-col">
                              <Button variant="primary" onClick={handleCloseModal}>Add Billing Address</Button>
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

export default BillingAddressListPage;