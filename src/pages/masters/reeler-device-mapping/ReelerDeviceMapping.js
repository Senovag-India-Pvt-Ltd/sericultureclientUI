import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { Icon } from "../../../components";
import React from "react";
import { useState } from "react";
import axios from "axios";

function ReelerDeviceMapping() {
  const [data, setData] = useState({});

  const [reelerListData, setReelerListData] = useState([]);
  const handleInputs = (e) => {};

  const display = () => {
    // Define the display function logic here
    console.log("Displaying data");
    // Add your logic here
  };

  return (
    <Layout title="Reeler Device Mapping">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Reeler Device Mapping</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item"><Link to="/seriui/crm/case-task">Subsidy Verification List</Link></li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  List
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Form action="#">
        <Row className="g-3">
          <Col lg="6">
            <Form.Group className="form-group">
              <Form.Label htmlFor="actions">Device Id</Form.Label>
              <div className="form-control-wrap">
                <Form.Control
                  id="deviceId"
                  type="text"
                  placeholder="Actions"
                  value="Enter Device Id"
                />
              </div>
            </Form.Group>
          </Col>

          <Col lg="6">
            <Form.Group className="form-group">
              <Form.Label>Reeler Id</Form.Label>
              <div className="form-control-wrap">
                <Form.Select
                  name="reelerId"
                  value={data.reelerId}
                  onChange={handleInputs}
                >
                  <option value="0">Select Reeler</option>
                  {reelerListData.map((list) => (
                    <option key={list.reelerId} value={list.reelerId}>
                      {list.reelerName}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
            <Col>
              <Button type="button" variant="primary" onClick={display}>
                Update Device Id
              </Button>
            </Col>
            {/* </Col>
                </Row> */}
          </Col>
        </Row>
      </Form>

      <Block className="mt-4">
        <Card>
          <Card.Header className="text-center">
            Reeler Device Mapping
          </Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      {/* <th></th> */}
                      <th>UserName</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Mac_ID</th>
                      <th>And_Dev_ID</th>
                      <th>Counter</th>
                      <th>Block</th>
                      <th>Dev_IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>202</td>
                      <td>202</td>
                      <td>Reeler</td>
                      <td></td>
                      <td>Basappa</td>
                      <td>4bab4c093331615</td>
                      <td>99999999</td>
                      <td>KKR13145</td>
                      <td>Karnataka Bank</td>
                      <td>0-Ok</td>
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
                    <tr>
                      <td>Add_to_bank</td>
                      <td>2</td>
                      <td>123</td>
                      <td>16/052001</td>
                      <td>Veerappa</td>
                      <td>Gadag</td>
                      <td>99999987</td>
                      <td>KKR13147</td>
                      <td>Sbi Bank</td>
                      <td>0-Ok</td>
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
                    <tr>
                      <td>Add_to_bank</td>
                      <td>3</td>
                      <td>555</td>
                      <td>16/052001</td>
                      <td>Rama</td>
                      <td>Udupi</td>
                      <td>9999456</td>
                      <td>KKR25145</td>
                      <td>Karnataka Bank</td>
                      <td>0-Ok</td>
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
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default ReelerDeviceMapping;
