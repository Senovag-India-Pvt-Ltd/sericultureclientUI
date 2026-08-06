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
      <style>{reelerDeviceMappingStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">Reeler Device Mapping</Block.Title>
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
        </div>
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

      <Block className="mt-n4 sh-form-wrap">
        <Card>
          <Card.Header className="sh-section-header text-center">
            <Icon name="setting" />
            <span>Reeler Device Mapping</span>
          </Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table
                  className="table table-striped table-bordered"
                  style={{ backgroundColor: "white" }}
                >
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

const reelerDeviceMappingStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-cta-btn {
    background: #ffffff;
    color: #1e67a8 !important;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-form-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
  .sh-form-wrap .card-header {
    border-bottom: none !important;
  }
  .sh-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700 !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-left: none !important;
    color: #ffffff !important;
    padding: 14px 20px !important;
  }
  .sh-section-header svg,
  .sh-section-header .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 15px;
  }
  .sh-form-wrap .form-label {
    font-weight: 600;
    color: #2b3a55;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1px solid #dbe4f0;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6;
    box-shadow: 0 0 0 0.2rem rgba(59, 141, 214, 0.15);
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    font-weight: 600;
    padding: 8px 22px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    background: #ffffff !important;
    color: #c43257 !important;
    border: 1px solid #e3496a !important;
    font-weight: 600;
    padding: 8px 22px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s ease;
  }
  .sh-cancel-btn:hover {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%) !important;
    color: #ffffff !important;
    border-color: transparent !important;
  }
`;

export default ReelerDeviceMapping;
