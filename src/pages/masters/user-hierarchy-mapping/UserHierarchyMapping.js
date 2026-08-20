import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function UserHierarchyMapping() {
  // Translation
  const { t, i18n } = useTranslation();

  const [data, setData] = useState({
    actualDesignationId: "",
    actualUserId: "",
    actualDistrictId: "",
    actualFirstName: "",
    reportUserMasterId: "",
    reportDesignationId: "",
    reportDistrictId: "",
    reportFirstName: "",
  });

  const [validated, setValidated] = useState(false);
  const [hierarchyList, setHierarchyList] = useState([]);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
    if (name === "actualUserId") {
      getUsersList(value);
    }
    if (name === "reportUserMasterId") {
      getUserMastersList(value);
    }
  };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  // const postData = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);
  //   } else {
  //     event.preventDefault();
  //     const sendPost = {
  //       reporteeUserMasterId: data.actualUserId,
  //       reportToUserMasterId: data.reportUserMasterId,
  //   };
  //     api
  //       .post(baseURL + `userHierarchyMapping/add`, sendPost)
  //       .then((response) => {
  //         if (response.data.content.error) {
  //           saveError(response.data.content.error_description);
  //         } else {
  //           saveSuccess();
  //           setData({
  //             actualDesignationId: "",
  //             actualUserId: "",
  //             actualDistrictId: "",
  //             actualFirstName: "",
  //             reportUserMasterId: "",
  //             reportDesignationId: "",
  //             reportDistrictId: "",
  //             reportFirstName: "",
  //           });
  //           setValidated(false);
  //         }
  //       })
  //       .catch((err) => {
  //           if (
  //               err.response &&
  //               err.response &&
  //               err.response.data &&
  //               err.response.data.validationErrors
  //             ) {
  //               if (Object.keys(err.response.data.validationErrors).length > 0) {
  //                 saveError(err.response.data.validationErrors);
  //               }
  //             }
  //       });
  //     setValidated(true);
  //   }
  // };
  const postData = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // ❌ SAME USER
      if (Number(data.actualUserId) === Number(data.reportUserMasterId)) {
        Swal.fire({
          icon: "error",
          title: "Employee and Manager cannot be same",
        });
        return;
      }

      // ❌ EMPLOYEE ALREADY HAS MANAGER
      const alreadyHasManager = hierarchyList.some(
        (item) => Number(item.employeeId) === Number(data.actualUserId),
      );

      if (alreadyHasManager) {
        Swal.fire({
          icon: "error",
          title: "This employee already has a manager",
        });
        return;
      }

      // ❌ REVERSE HIERARCHY
      const isReverse = hierarchyList.some(
        (item) =>
          Number(item.employeeId) === Number(data.reportUserMasterId) &&
          Number(item.managerId) === Number(data.actualUserId),
      );

      if (isReverse) {
        Swal.fire({
          icon: "error",
          title:
            "Invalid hierarchy! Manager cannot report to their own employee",
        });
        return;
      }

      // ❌ DUPLICATE
      const duplicate = hierarchyList.some(
        (item) =>
          Number(item.employeeId) === Number(data.actualUserId) &&
          Number(item.managerId) === Number(data.reportUserMasterId),
      );

      if (duplicate) {
        Swal.fire({
          icon: "error",
          title: "Mapping already exists",
        });
        return;
      }

      // Check the response from getIdList
      getIdList(data.actualUserId);

      // If there is a response, show confirmation
      // if (userIdList.length > 0) {
      //   Swal.fire({
      //     title: 'Are you sure?',
      //     text: 'You are updating your Report to user. Is it okay?',
      //     icon: 'warning',
      //     showCancelButton: true,
      //     confirmButtonText: 'Yes, save it!',
      //     cancelButtonText: 'No, cancel!',
      //     reverseButtons: true,
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       submitForm();
      //     }
      //   });
      // } else {
      //   submitForm(); // Directly submit if no confirmation is needed
      // }
    }
  };

  const submitForm = () => {
    const sendPost = {
      reporteeUserMasterId: data.actualUserId,
      reportToUserMasterId: data.reportUserMasterId,
    };

    api
      .post(baseURL + `userHierarchyMapping/add`, sendPost)
      .then((response) => {
        if (response.data.content.error) {
          saveError(response.data.content.error_description);
        } else {
          saveSuccess();
          setData({
            actualDesignationId: "",
            actualUserId: "",
            actualDistrictId: "",
            actualFirstName: "",
            reportUserMasterId: "",
            reportDesignationId: "",
            reportDistrictId: "",
            reportFirstName: "",
          });
          setValidated(false);
        }
      })
      .catch((err) => {
        if (
          err.response &&
          err.response.data &&
          err.response.data.validationErrors &&
          Object.keys(err.response.data.validationErrors).length > 0
        ) {
          saveError(err.response.data.validationErrors);
        }
      });
  };

  const getIdList = (userId) => {
    api
      .get(baseURL + `userHierarchyMapping/getByReporteeUserMasterId/${userId}`)
      .then((response) => {
        if (response.data.content) {
          Swal.fire({
            title: "Are you sure?",
            text: "You are updating your senior officer. Is that okay?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, save it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
          }).then((result) => {
            if (result.isConfirmed) {
              submitForm();
            }
          });
        } else {
          submitForm(); // Directly submit if no confirmation is needed
        }
        // setData(response.data.content);
        // if (response.data.content) {
        //   Swal.fire({
        //     title: 'Are you sure?',
        //     text: 'You are updating your Report to user. Is it okay?',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: 'Yes, save it!',
        //     cancelButtonText: 'No, cancel!',
        //     reverseButtons: true,
        //   }).then((result) => {
        //     if (result.isConfirmed) {
        //       postData(); // Call postData if confirmed
        //     }
        //   });
        // }
      })
      .catch(() => {
        setData({});
      });
  };
  // useEffect(() => {
  //   getIdList();
  // }, [reporteeUserMasterId]);

  const clear = () => {
    setData({
      actualDesignationId: "",
      actualUserId: "",
      actualDistrictId: "",
      actualFirstName: "",
      reportUserMasterId: "",
      reportDesignationId: "",
      reportDistrictId: "",
      reportFirstName: "",
    });
  };

  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = (_id) => {
    const response = api
      .get(baseURL + `district/get-all`)
      .then((response) => {
        if (response.data.content.district) {
          setDistrictListData(response.data.content.district);
        }
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getDistrictList();
  }, []);

  // to get designation
  const [designationListData, setDesignationListData] = useState([]);

  const getDesignationList = () => {
    const response = api
      .get(baseURL + `designation/get-all`)
      .then((response) => {
        setDesignationListData(response.data.content.designation);
      })
      .catch((err) => {
        setDesignationListData([]);
      });
  };

  useEffect(() => {
    getDesignationList();
  }, []);

  // to get hobli
  const [userListData, setUserListData] = useState([]);

  const getUserList = (designationId, districtId) => {
    const response = api
      .post(baseURL + `userMaster/get-by-designationId-and-districtId`, {
        designationId: designationId,
        districtId: districtId,
      })
      .then((response) => {
        if (response.data.content.userMaster) {
          setUserListData(response.data.content.userMaster);
        } else {
          setUserListData([]);
          setData((prev) => ({ ...prev, actualFirstName: "" }));
        }
      })
      .catch((err) => {
        setUserListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  // to get hobli
  const [userMasterListData, setUserMasterListData] = useState([]);

  const getUserMasterList = (designationId, districtId) => {
    const response = api
      .post(baseURL + `userMaster/get-by-designationId-and-districtId`, {
        designationId: designationId,
        districtId: districtId,
      })
      .then((response) => {
        if (response.data.content.userMaster) {
          setUserMasterListData(response.data.content.userMaster);
        } else {
          setUserMasterListData([]);
          setData((prev) => ({ ...prev, reportFirstName: "" }));
        }
      })
      .catch((err) => {
        setUserMasterListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  /// ✅ Pending Excel (FINAL)
  const downloadPending = async () => {
    try {
      const response = await api.post(
        baseURL + "userHierarchyMapping/pending-report",
        {},
        { responseType: "blob" }, // ✅ IMPORTANT FIX
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "pending_user_hierarchy.xlsx");

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      Swal.fire("Error downloading pending report");
    }
  };

  // ✅ Completed Excel (FINAL)
  const downloadCompleted = async () => {
    try {
      const response = await api.post(
        baseURL + "userHierarchyMapping/completed-report",
        {},
        { responseType: "blob" }, // ✅ IMPORTANT FIX
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "completed_user_hierarchy.xlsx");

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      Swal.fire("Error downloading completed report");
    }
  };
  useEffect(() => {
    if (data.actualDesignationId && data.actualDistrictId) {
      getUserList(data.actualDesignationId, data.actualDistrictId);
    }
  }, [data.actualDesignationId, data.actualDistrictId]);

  useEffect(() => {
    if (data.reportDesignationId && data.reportDistrictId) {
      getUserMasterList(data.reportDesignationId, data.reportDistrictId);
    }
  }, [data.reportDesignationId, data.reportDistrictId]);
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

  const getUsersList = (_id) => {
    api
      .get(baseURL + `userMaster/get-join/${_id}`)
      .then((response) => {
        if (response.data) {
          setData((prev) => ({
            ...prev,
            actualFirstName: response.data.content.firstName,
          }));
          setValidated(false);
        }
      })
      .catch((err) => {
        setValidated(false);
      });
  };

  const getUserMastersList = (_id) => {
    api
      .get(baseURL + `userMaster/get-join/${_id}`)
      .then((response) => {
        if (response.data) {
          setData((prev) => ({
            ...prev,
            reportFirstName: response.data.content.firstName,
          }));
          setValidated(false);
        }
      })
      .catch((err) => {
        setValidated(false);
      });
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("#");
    });
  };
  const saveError = (message) => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };
  return (
    <Layout title="User Hierarchy Mapping">
      <style>{userHierarchyMappingStyles}</style>
      <div className="sh-page-header">
        <Block.Head>
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("User Hierarchy Mapping")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Link
                    to="/seriui/user-hierarchy-mapping-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/user-hierarchy-mapping-list"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Button variant="primary" onClick={downloadPending} className="sh-cta-btn">
                    <Icon name="download" />
                    <span>{t("Pending List")}</span>
                  </Button>
                </li>
                <li>
                  <Button variant="primary" onClick={downloadCompleted} className="sh-cta-btn">
                    <Icon name="download" />
                    <span>{t("Completed List")}</span>
                  </Button>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </Block.Head>
      </div>

      <Block className="mt-n4 sh-form-wrap">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          {/* <Row className="g-3 "> */}
          <Block className="mt-3">
          <Card className="sh-section-card" style={{ marginTop: "28px" }}>
            <Card.Header className="sh-section-header">
              <Icon name="user" />
              <span>{t("Employee")}</span>
            </Card.Header>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Designation")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="actualDesignationId"
                        value={data.actualDesignationId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.actualDesignationId === undefined ||
                          data.actualDesignationId === "0"
                        }
                      >
                        <option value="">{t("Select Designation")}</option>
                        {designationListData && designationListData.length
                          ? designationListData.map((list) => (
                              <option
                                key={list.designationId}
                                value={list.designationId}
                              >
                                {i18n.language === "kn"
                                  ? list.designationNameInKannada || list.name
                                  : list.name}
                              </option>
                            ))
                          : ""}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("Designation is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("district")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="actualDistrictId"
                        value={data.actualDistrictId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          !data.actualDistrictId === undefined ||
                          data.actualDistrictId === "0"
                        }
                      >
                        <option value="">{t("select_district")}</option>
                        {districtListData && districtListData.length
                          ? districtListData.map((list) => (
                              <option
                                key={list.districtId}
                                value={list.districtId}
                              >
                                {i18n.language === "kn"
                                  ? list.districtNameInKannada ||
                                    list.districtName
                                  : list.districtName}
                              </option>
                            ))
                          : ""}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("District Name is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("User")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="actualUserId"
                        value={data.actualUserId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.actualUserId === undefined ||
                          data.actualUserId === "0"
                        }
                      >
                        <option value="">{t("Select User")}</option>
                        {userListData && userListData.length
                          ? userListData.map((list) => (
                              <option
                                key={list.userMasterId}
                                value={list.userMasterId}
                              >
                                {list.userName || list.username}
                              </option>
                            ))
                          : ""}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("User is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="emailID">
                      {t("First Name")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="actualFirstName"
                        name="actualFirstName"
                        value={data.actualFirstName}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter First Name")}
                        readOnly
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("First Name is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          </Block>

          <Block className="mt-3">
          <Card className="sh-section-card">
            <Card.Header className="sh-section-header">
              <Icon name="user-list" />
              <span>{t("Reports To (Manager)")}</span>
            </Card.Header>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Designation")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="reportDesignationId"
                        value={data.reportDesignationId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.reportDesignationId === undefined ||
                          data.reportDesignationId === "0"
                        }
                      >
                        <option value="">{t("Select Designation")}</option>
                        {designationListData && designationListData.length
                          ? designationListData.map((list) => (
                              <option
                                key={list.designationId}
                                value={list.designationId}
                              >
                                {i18n.language === "kn"
                                  ? list.designationNameInKannada || list.name
                                  : list.name}
                              </option>
                            ))
                          : ""}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("Designation is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("district")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="reportDistrictId"
                        value={data.reportDistrictId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          !data.reportDistrictId === undefined ||
                          data.reportDistrictId === "0"
                        }
                      >
                        <option value="">{t("select_district")}</option>
                        {districtListData && districtListData.length
                          ? districtListData.map((list) => (
                              <option
                                key={list.districtId}
                                value={list.districtId}
                              >
                                {i18n.language === "kn"
                                  ? list.districtNameInKannada ||
                                    list.districtName
                                  : list.districtName}
                              </option>
                            ))
                          : ""}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("District Name is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("User")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="reportUserMasterId"
                        value={data.reportUserMasterId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.reportUserMasterId === undefined ||
                          data.reportUserMasterId === "0"
                        }
                      >
                        <option value="">{t("Select User")}</option>
                        {userMasterListData && userMasterListData.length
                          ? userMasterListData.map((list) => (
                              <option
                                key={list.userMasterId}
                                value={list.userMasterId}
                              >
                                {list.userName || list.username}
                              </option>
                            ))
                          : ""}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("User is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="emailID">
                      {t("First Name")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="reportFirstName"
                        name="reportFirstName"
                        value={data.reportFirstName}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter First Name")}
                        readOnly
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("First Name is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          </Block>

          <div className="gap-col">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                {/* <Button type="button" variant="primary" onClick={postData}> */}
                <Button type="submit" variant="primary" className="sh-save-btn">
                  <Icon name="save" />
                  <span>{t("save")}</span>
                </Button>
              </li>
              <li>
                {/* <Link
                    to="/seriui/village-list"
                    className="btn btn-secondary border-0"
                  >
                    Cancel
                  </Link> */}
                <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                  <Icon name="cross" />
                  <span>{t("cancel")}</span>
                </Button>
              </li>
            </ul>
          </div>
          {/* </Row> */}
        </Form>
      </Block>
    </Layout>
  );
}

const userHierarchyMappingStyles = `
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
  .sh-form-wrap .card-header {
    border-bottom: none !important;
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
  .sh-form-wrap .form-control::placeholder {
    color: #a7b0c0;
    font-weight: 400;
  }
  .sh-form-wrap .form-control:hover:not(:disabled):not([readonly]),
  .sh-form-wrap .form-select:hover:not(:disabled) {
    border-color: #a9c4e0 !important;
    background-color: #ffffff !important;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #2b7ac0 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important;
    outline: none;
  }
  .sh-form-wrap .form-control[readonly],
  .sh-form-wrap .form-control:read-only,
  .sh-form-wrap .form-select:disabled {
    background-color: #f1f5fa !important;
    border-color: #e4e9f2 !important;
    color: #8a96a8 !important;
    cursor: not-allowed;
  }
  .sh-form-wrap .form-control.is-invalid,
  .sh-form-wrap .form-select.is-invalid {
    border-color: #e3496a !important;
    box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important;
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

export default UserHierarchyMapping;
