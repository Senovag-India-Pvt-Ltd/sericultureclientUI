import React, { useEffect, useState } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../src/services/auth/api";
import Swal from "sweetalert2";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { createTheme } from "react-data-table-component";
import { Icon } from "../../../components";
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function UserHierarchyMappingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userHierarchyMappingId: "",
    actualDesignationId: "",
    actualDistrictId: "",
    actualUserId: "",
    reportDesignationId: "",
    reportDistrictId: "",
    reportUserMasterId: "",
  });

  const [designationList, setDesignationList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [hierarchyList, setHierarchyList] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [existingManagerName, setExistingManagerName] = useState("");
  // 🔹 Load mapping
  useEffect(() => {
    api
      .get(
        baseURL + "userHierarchyMapping/list-with-join?pageNumber=0&size=100",
      )
      .then((res) => {
        const list = res.data.content.userHierarchyMapping || [];

        const selected = list.find(
          (item) => Number(item.userHierarchyMappingId) === Number(id),
        );

        if (selected) {
          setFormData({
            userHierarchyMappingId: selected.userHierarchyMappingId,

            actualUserId: selected.employeeId,
            actualDesignationId: selected.employeeDesignationId,
            actualDistrictId: selected.employeeDistrictId,

            reportUserMasterId: selected.managerId,
            reportDesignationId: selected.managerDesignationId,
            reportDistrictId: selected.managerDistrictId,
          });

          setEmployeeName(selected.employeeName);
          setExistingManagerName(selected.managerName);
        }
      });
  }, [id]);
  // 🔹 Load dropdowns
  useEffect(() => {
    api
      .get(baseURL + "designation/get-all")
      .then((res) => setDesignationList(res.data.content.designation || []));

    api
      .get(baseURL + "district/get-all")
      .then((res) => setDistrictList(res.data.content.district || []));
  }, []);

  // 🔹 Load employee list
  useEffect(() => {
    if (formData.actualDesignationId && formData.actualDistrictId) {
      api
        .post(baseURL + "userMaster/get-by-designationId-and-districtId", {
          designationId: formData.actualDesignationId,
          districtId: formData.actualDistrictId,
        })
        .then((res) => setEmployeeList(res.data.content.userMaster || []));
    }
  }, [formData.actualDesignationId, formData.actualDistrictId]);

  // 🔹 Load manager list
  useEffect(() => {
    if (formData.reportDesignationId && formData.reportDistrictId) {
      api
        .post(baseURL + "userMaster/get-by-designationId-and-districtId", {
          designationId: formData.reportDesignationId,
          districtId: formData.reportDistrictId,
        })
        .then((res) => setManagerList(res.data.content.userMaster || []));
    }
  }, [formData.reportDesignationId, formData.reportDistrictId]);

  useEffect(() => {
    const selected = managerList.find(
      (m) => Number(m.userMasterId) === Number(formData.reportUserMasterId),
    );

    if (selected) {
      setExistingManagerName(selected.username);
    }
  }, [formData.reportUserMasterId, managerList]);

  useEffect(() => {
    api
      .get(
        baseURL + "userHierarchyMapping/list-with-join?pageNumber=0&size=100",
      )
      .then((res) => {
        setHierarchyList(res.data.content.userHierarchyMapping || []);
      })
      .catch(() => setHierarchyList([]));
  }, []);

  // 🔹 Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔹 Submit
  const handleSubmit = async () => {
    // ❌ SAME USER
    if (Number(formData.actualUserId) === Number(formData.reportUserMasterId)) {
      Swal.fire("Employee and Manager cannot be same");
      return;
    }

    // ❌ REVERSE CHECK
    const isReverse = hierarchyList.some(
      (item) =>
        Number(item.employeeId) === Number(formData.reportUserMasterId) &&
        Number(item.managerId) === Number(formData.actualUserId),
    );

    if (isReverse) {
      Swal.fire({
        icon: "error",
        title: "Invalid hierarchy! Manager cannot report to their own employee",
      });
      return;
    }

    // ❌ DUPLICATE
    const duplicate = hierarchyList.some(
      (item) =>
        Number(item.employeeId) === Number(formData.actualUserId) &&
        Number(item.managerId) === Number(formData.reportUserMasterId) &&
        Number(item.userHierarchyMappingId) !==
          Number(formData.userHierarchyMappingId),
    );

    if (duplicate) {
      Swal.fire({
        icon: "error",
        title: "Mapping already exists",
      });
      return;
    }

    const payload = {
      userHierarchyMappingId: formData.userHierarchyMappingId,
      reporteeUserMasterId: formData.actualUserId, // Vaishnavi
      reportToUserMasterId: formData.reportUserMasterId, // Sattish
    };

    try {
      await api.post(baseURL + "userHierarchyMapping/add", {
        reporteeUserMasterId: formData.actualUserId,
        reportToUserMasterId: formData.reportUserMasterId,
      });

      Swal.fire("Updated successfully", "", "success").then(() => {
        navigate("/seriui/user-hierarchy-mapping-list");
      });
    } catch {
      Swal.fire("Update failed");
    }
  };

  return (
    <Layout title="User Hierarchy Mapping">
      <style>{userHierarchyMappingEditStyles}</style>
      <div className="sh-page-header">
        <Block.Head>
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">User Hierarchy Mapping</Block.Title>
            </Block.HeadContent>

            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Button
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                    onClick={() =>
                      navigate("/seriui/user-hierarchy-mapping-list")
                    }
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go To List</span>
                  </Button>
                </li>
                <li>
                  <Button
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                    onClick={() =>
                      navigate("/seriui/user-hierarchy-mapping-list")
                    }
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go To List</span>
                  </Button>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </Block.Head>
      </div>

      <Block className="mt-n4 sh-form-wrap">
        <Form>
          <Row className="g-3">
            <Card className="sh-section-card">
              <Card.Header className="sh-section-header">
                <Icon name="edit" />
                <span>Update Hierarchy Mapping</span>
              </Card.Header>
              <Card.Body>
                <Row className="g-gs">
                 
                    <Col lg="6">
                      <Form.Group>
                        <Form.Label>
                          <b>Employee</b>
                        </Form.Label>
                        <Form.Control value={employeeName} disabled />
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group>
                        <Form.Label>
                          <b>Existing Manager</b>
                        </Form.Label>
                        <Form.Control value={existingManagerName} disabled />
                      </Form.Group>
                    </Col>
                  

                  {/* DESIGNATION */}
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        Designation <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="actualDesignationId"
                          value={formData.actualDesignationId}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Designation</option>
                          {designationList.map((d) => (
                            <option
                              key={d.designationId}
                              value={d.designationId}
                            >
                              {d.name}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </Col>

                  {/* DISTRICT */}
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        District <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="actualDistrictId"
                          value={formData.actualDistrictId}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select District</option>
                          {districtList.map((d) => (
                            <option key={d.districtId} value={d.districtId}>
                              {d.districtName}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </Col>

                  {/* EMPLOYEE */}
                  <Col lg="6">
                    <Form.Group>
                      <Form.Label>
                        Change Manager <span className="text-danger">*</span>
                      </Form.Label>

                      <Form.Select
                        name="reportUserMasterId"
                        value={formData.reportUserMasterId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Manager</option>

                        {managerList.map((m) => (
                          <option key={m.userMasterId} value={m.userMasterId}>
                            {m.userName || m.username}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* BUTTONS SAME AS VILLAGE */}
            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSubmit}
                    className="sh-save-btn"
                  >
                    <Icon name="save" />
                    <span>Update</span>
                  </Button>
                </li>

                <li>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      navigate("/seriui/user-hierarchy-mapping-list");
                      window.location.reload();
                    }}
                    className="sh-cancel-btn"
                  >
                    <Icon name="cross" />
                    <span>Cancel</span>
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

const userHierarchyMappingEditStyles = `
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
    display: inline-flex;
    align-items: center;
    gap: 6px;
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
  .sh-form-wrap .card,
  .sh-section-card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
    margin-bottom: 18px;
  }
  .sh-form-wrap .card-body {
    padding: 20px !important;
  }
  .sh-form-wrap .form-label {
    font-size: 13px;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 6px;
    letter-spacing: 0.2px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 10px !important;
    border: 1.5px solid #d8e0ec !important;
    background-color: #fbfcfe !important;
    padding: 0.62rem 0.9rem !important;
    font-size: 13.5px;
    color: #2b3a55;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #2b7ac0 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important;
    outline: none;
  }
  .sh-form-wrap .form-control:disabled {
    background-color: #f1f5fa !important;
    border-color: #e4e9f2 !important;
    color: #8a96a8 !important;
    cursor: not-allowed;
  }
  .sh-section-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-bottom: none !important;
    padding: 14px 20px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    gap: 10px;
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
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
  }
`;

export default UserHierarchyMappingEdit;
