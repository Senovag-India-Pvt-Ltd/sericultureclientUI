import { useState } from "react";
import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";

import { Link } from "react-router-dom";

import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DataTable from "../../../components/DataTable/DataTable";

import K2StateShares, {
  K2StateSharesColumns,
} from "../../../store/masters/subsidy-shares/K2StateSharesData";
import BankCentralShares, {
  BankCentralSharesColumns,
} from "../../../store/masters/subsidy-shares/BankCentralSharesData";
import { Icon, Select } from "../../../components";

function ConfigureSubsidy() {
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);
  return (
    <Layout title="Configure Subsidy" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Configure Subsidy</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Configure Subsidy
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="#" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-4">
        <Form action="#">
          <Row className="g-3 ">
            {/* <Card>
              <Card.Body>
                <Row className="g-gs">
                 

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="fid">FRUITS ID / AADHAAR NUMBER</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="fid"
                          type="text"
                          placeholder="FRUITS ID / AADHAAR NUMBER"
                        />
                      </div>
                    </Form.Group>

                  </Col>

                  <Col lg="6">


                  </Col>
                </Row>
              </Card.Body>
            </Card> */}

            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label> Scheme </Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select Scheme Name</option>
                          <option value="1">
                            Subsidy for Mulberry garden implements/ Silkworm
                            rearing equipments
                          </option>
                          <option value="2">
                            Subsidy for construction of Rearing House
                          </option>
                          <option value="3">Supply of disinfectants</option>
                          <option value="4">
                            Subsidy for construction of Mounting Hall
                          </option>
                          <option value="5">
                            Subsidy for installation of Automatic Reeling
                            Machine
                          </option>
                        </Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>With Land</Form.Label>
                      <div className="form-control-wrap">
                        <ul className="gap g-3 ">
                          <li>
                            <Form.Check
                              inline
                              label="Yes"
                              name="inlineRadioOptions"
                              type="radio"
                              id="inlineRadio1"
                              defaultChecked
                            ></Form.Check>
                            <Form.Check
                              inline
                              label="No"
                              name="inlineRadioOptions"
                              type="radio"
                              id="inlineRadio2"
                            ></Form.Check>
                          </li>
                        </ul>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    {/* <Form.Group className="form-group mt-3">
                      <Form.Label>Castes</Form.Label>
                      <div className="form-control-wrap">
                        <Select multiple removeItemButton>
                          <option value="">Select Castes</option>
                          <option value="1">106(General)</option>
                          <option value="2">422(SC)</option>
                          <option value="3">423(ST)</option>
                        </Select>
                      </div>
                    </Form.Group> */}

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Head Of Account</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select Head of Account</option>
                          <option value="1">
                            Sericulture Development Programme 2851-00-107-1-35
                          </option>
                          <option value="2">
                            Pradhan Manthri Krishi Sinchayi Yojane (PMKSY)
                            2851-00-107-1-49
                          </option>
                          <option value="2">
                            Programs implemented by Price Stabilization Fund
                            2851-00-107-1-51
                          </option>
                          <option value="2">
                            Civil works 4851-00-107-1-01
                          </option>
                          <option value="3">Silk Samagra(CSS)</option>
                        </Select>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-1">
                      <div className="form-control-wrap">
                        <h3>K2 State Shares</h3>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group d-flex align-items-center justify-content-end gap g-3">
                      <div className="form-control-wrap">
                        <ul className="">
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
                              <span>Add</span>
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-gs mt-4">
                  <Col lg="12">
                    <Block>
                      <Card>
                        <DataTable
                          tableClassName="data-table-head-light table-responsive"
                          data={K2StateShares}
                          columns={K2StateSharesColumns}
                        />
                      </Card>
                    </Block>
                  </Col>

                  {/* <Col lg="6">hello</Col> */}
                </Row>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-1">
                      <div className="form-control-wrap">
                        <h3>BANK (Central Shares)</h3>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group d-flex align-items-center justify-content-end gap g-3">
                      <div className="form-control-wrap">
                        <ul className="">
                          <li>
                            <Button
                              className="d-md-none"
                              size="md"
                              variant="primary"
                              onClick={handleShowModal1}
                            >
                              <Icon name="plus" />
                              <span>Add</span>
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="d-none d-md-inline-flex"
                              variant="primary"
                              onClick={handleShowModal1}
                            >
                              <Icon name="plus" />
                              <span>Add</span>
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-gs mt-4">
                  <Col lg="12">
                    <Block>
                      <Card>
                        <DataTable
                          tableClassName="data-table-head-light table-responsive"
                          data={BankCentralShares}
                          columns={BankCentralSharesColumns}
                        />
                      </Card>
                    </Block>
                  </Col>

                  {/* <Col lg="6">hello</Col> */}
                </Row>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <h3>Approvals Details</h3>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label>Starting Officer</Form.Label>
                      <div className="form-control-wrap">
                        <Select multiple removeItemButton>
                          <option value="">Select Starting Officer</option>
                          <option value="1">Range Officer</option>
                          <option value="2">SEO</option>
                          <option value="3">ADS</option>
                          <option value="4">DDS</option>
                          <option value="5">JDS</option>
                          <option value="5">CSD</option>
                          <option value="5">DS</option>
                          <option value="5">DOS</option>
                          <option value="5">PCT</option>
                          <option value="5">GCM</option>
                          <option value="2">SEO(Reeling)</option>
                        </Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Verifying Officer</Form.Label>
                      <div className="form-control-wrap">
                        <Select multiple removeItemButton>
                          <option value="">Select Verifying Officer</option>
                          <option value="1">Range Officer</option>
                          <option value="2">SEO</option>
                          <option value="3">ADS</option>
                          <option value="4">DDS</option>
                          <option value="5">JDS</option>
                          <option value="6">CSD</option>
                          <option value="7">DS</option>
                          <option value="8">DOS</option>
                          <option value="9">PCT</option>
                          <option value="10">GCM</option>
                          <option value="11">SEO(Reeling)</option>
                        </Select>
                      </div>
                    </Form.Group>
                    <Form.Group className="form-group mt-3">
                      <Form.Label>Sanctioning Officer</Form.Label>
                      <div className="form-control-wrap">
                        <Select multiple removeItemButton>
                          <option value="">Select Sanctioning Officer</option>
                          <option value="1">Range Officer</option>
                          <option value="2">SEO</option>
                          <option value="3">ADS</option>
                          <option value="4">DDS</option>
                          <option value="5">JDS</option>
                          <option value="6">CSD</option>
                          <option value="7">DS</option>
                          <option value="8">DOS</option>
                          <option value="9">PCT</option>
                          <option value="10">GCM</option>
                          <option value="11">SEO(Reeling)</option>
                        </Select>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label>Drawing Officer</Form.Label>
                      <div className="form-control-wrap">
                        <Select multiple removeItemButton>
                          <option value="">Select Drawing Officer</option>
                          <option value="1">Range Officer</option>
                          <option value="2">SEO</option>
                          <option value="3">ADS</option>
                          <option value="4">DDS</option>
                          <option value="5">JDS</option>
                          <option value="6">CSD</option>
                          <option value="7">DS</option>
                          <option value="8">DOS</option>
                          <option value="9">PCT</option>
                          <option value="10">GCM</option>
                          <option value="11">SEO(Reeling)</option>
                        </Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Counter signing Officer</Form.Label>
                      <div className="form-control-wrap">
                        <Select multiple removeItemButton>
                          <option value="">
                            Select Counter signing Officer
                          </option>
                          <option value="1">Range Officer</option>
                          <option value="2">SEO</option>
                          <option value="3">ADS</option>
                          <option value="4">DDS</option>
                          <option value="5">JDS</option>
                          <option value="6">CSD</option>
                          <option value="7">DS</option>
                          <option value="8">DOS</option>
                          <option value="9">PCT</option>
                          <option value="10">GCM</option>
                          <option value="11">SEO(Reeling)</option>
                        </Select>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <h3>Inspection</h3>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-4">
                      {/* <Form.Label>With Land</Form.Label> */}
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
                    <Form.Group className="form-group mt-4">
                      {/* <Form.Label>With Land</Form.Label> */}
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
                </Row>
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="button" variant="primary">
                    Save
                  </Button>
                </li>
                <li>
                  <Link to="#" className="btn btn-secondary border-0">
                    Cancel
                  </Link>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>K2 (State Shares)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>Category</Form.Label>
                  <div className="form-control-wrap">
                    <Select removeItemButton>
                      <option value="">Select Category</option>
                      <option value="1">106(General)</option>
                      <option value="2">422(SC)</option>
                      <option value="3">423(ST)</option>
                    </Select>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="pin">Percentage %</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="pin"
                      type="text"
                      placeholder="Percentage (%)"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex gap g-2">
                  <div className="gap-col">
                    <Button variant="primary" onClick={handleCloseModal}>
                      Add
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

      <Modal show={showModal1} onHide={handleCloseModal1}>
        <Modal.Header closeButton>
          <Modal.Title>BANK (Central Shares)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>Category</Form.Label>
                  <div className="form-control-wrap">
                    <Select removeItemButton>
                      <option value="">Select Category</option>
                      <option value="1">106(General)</option>
                      <option value="2">422(SC)</option>
                      <option value="3">423(ST)</option>
                    </Select>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="pin">Percentage %</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="pin"
                      type="text"
                      placeholder="Percentage (%)"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex gap g-2">
                  <div className="gap-col">
                    <Button variant="primary" onClick={handleCloseModal1}>
                      Add
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal1}>
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

export default ConfigureSubsidy;
