import React, { useEffect, useState } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../src/services/auth/api";
import Swal from "sweetalert2";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { createTheme } from "react-data-table-component";
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
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">User Hierarchy Mapping</Block.Title>
          </Block.HeadContent>

          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Button
                  className="btn btn-primary btn-md d-md-none"
                  onClick={() =>
                    navigate("/seriui/user-hierarchy-mapping-list")
                  }
                >
                  Go to List
                </Button>
              </li>
              <li>
                <Button
                  className="btn btn-primary d-none d-md-inline-flex"
                  onClick={() =>
                    navigate("/seriui/user-hierarchy-mapping-list")
                  }
                >
                  Go to List
                </Button>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        <Form>
          <Row className="g-3">
            <Card>
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
                  >
                    Update
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
                  >
                    Cancel
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

export default UserHierarchyMappingEdit;
