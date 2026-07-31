import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
import ReactSelect from "react-select";
import React, { useMemo } from "react";
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;


function ScProgramApprovalMapping() {
  // Translation
  const { t } = useTranslation();
  
  const [designationList, setDesignationList] = useState([]);
  const [designationDetails, setDesignationDetails] = useState({
    designationId: "",
    amount: "",
    designationStep: "",
  });

  const [validated, setValidated] = useState(false);
  const [validatedDesignationDetails, setValidatedDesignationDetails] =
    useState(false);
  const [validatedDesignationDetailsEdit, setValidatedDesignationDetailsEdit] =
    useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAdd = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setDesignationDetails(true);
    } else {
      e.preventDefault();
      setDesignationList((prev) => [...prev, designationDetails]);
      setDesignationDetails({
        designationId: "",
        amount: "",
        designationStep: "",
      });
      setShowModal(false);
      setValidatedDesignationDetails(false);
    }
  };

  const handleDelete = (i) => {
    setDesignationList((prev) => {
      const newArray = prev.filter((item, place) => place !== i);
      return newArray;
    });
  };

  const [designationDetailsId, setMapComponentId] = useState();
  const handleGet = (i) => {
    setDesignationDetails(designationList[i]);
    setShowModal2(true);
    setMapComponentId(i);
  };

  console.log(designationList);

  const handleUpdate = (e, i, changes) => {
    setDesignationList((prev) =>
      prev.map((item, ix) => {
        if (ix === i) {
          return { ...item, ...changes };
        }
        return item;
      })
    );
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedDesignationDetailsEdit(true);
    } else {
      e.preventDefault();
      setShowModal2(false);
      setValidatedDesignationDetailsEdit(false);
      setDesignationDetails({
        designationId: "",
        amount: "",
        designationStep: "",
      });
    }
  };

  const handleMapInputs = (e) => {
    const { name, value } = e.target;
    setDesignationDetails({ ...designationDetails, [name]: value });
  };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);
  const [data, setData] = useState({
    version: "",
    action:"",
    status: "",
    subSchemeId: "",
    stepId: "",
    scApprovalStageId: "",
    // designationId: "",
    stepName: "",
    subSchemeWorkFlowDetailsRequests: [],
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const isSubSchemeValid = React.useMemo(() => {
    return data.subSchemeId !== "" && data.subSchemeId !== null && data.subSchemeId !== undefined;
  }, [data.subSchemeId]);

  const isApprovalStageValid = React.useMemo(() => {
    return data.scApprovalStageId !== "" && data.scApprovalStageId !== null && data.scApprovalStageId !== undefined;
  }, [data.scApprovalStageId]);

  const postData = (event) => {
    if (!isSubSchemeValid || !isApprovalStageValid) {
    event.preventDefault();
    setValidated(true);
    return; // ⛔ STOP — API will NOT be called
  }
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      const sendPost = {
        version: data.version,
        status: "Active",
        action: data.action,
        stepId: data.stepId,
        scApprovalStageId: data.scApprovalStageId,
        subSchemeId: data.subSchemeId,
        // landDetailId: landDetailsIds[0],
        // designationId: data.designationId,
        stepName: data.stepName,
        subSchemeWorkFlowDetailsRequests: designationList,
      };
      api
        .post(baseURLDBT + `master/cost/saveSubSchemeWorkFlowRequest`, sendPost)
        .then((response) => {
          saveSuccess();
          clear();
          setValidated(false);
        })
        .catch((err) => {
          if (
            err.response &&
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      version: "",
      status: "",
      subSchemeId: "",
      stepId: "",
      scApprovalStageId: "",
      // designationId: "",
      stepName: "",
      action: "",
    });
    designationClear();
  };

  const designationClear = () => {
    setDesignationDetails({
      designationId: "",
      amount: "",
      designationStep: "",
    });
    setDesignationList([]);
  };

  // Handle Options
  // Designation
  const handleDesignationOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setDesignationDetails({
      ...designationDetails,
      designationId: chooseId,
      name: chooseName,
    });
  };

  const [loading, setLoading] = useState(false);

  // to get Program
  const [programListData, setProgramListData] = useState([]);

  const getProgramList = () => {
    const response = api
      .get(baseURL + `scProgram/get-all`)
      .then((response) => {
        setProgramListData(response.data.content.scProgram);
      })
      .catch((err) => {
        setProgramListData([]);
      });
  };

  useEffect(() => {
    getProgramList();
  }, []);

  // to get sc-sub-scheme-details by sc-scheme-details
  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState(
    []
  );
  const getSubSchemeList = () => {
    api
      .get(baseURL + `scSubSchemeDetails/get-all`)
      .then((response) => {
        if (response.data.content.scSubSchemeDetails) {
          setScSubSchemeDetailsListData(
            response.data.content.scSubSchemeDetails
          );
        }
      })
      .catch((err) => {
        setScSubSchemeDetailsListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getSubSchemeList();
  }, []);

  const [approvalListData, setApprovalListData] = useState([]);

  const getApprovalList = () => {
    const response = api
      .get(baseURL + `scApprovalStage/get-all`)
      .then((response) => {
        setApprovalListData(response.data.content.scApprovalStage);
      })
      .catch((err) => {
        setApprovalListData([]);
      });
  };

  useEffect(() => {
    getApprovalList();
  }, []);

  // to get Program
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

  //to get Approval Stage
  // const [approvalStageListData, setApprovalStageListData] = useState([]);

  const getApprovalStageList = (_id) => {
    api
      .get(baseURL + `scApprovalStage/get/${_id}`)
      .then((response) => {
        setData((prev) => ({
          ...prev,
          stepName: response.data.content.stageName,
        }));
        setLoading(false);
      })
      .catch((err) => {
        // setApprovalListData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (data.scApprovalStageId) {
      getApprovalStageList(data.scApprovalStageId);
    }
  }, [data.scApprovalStageId]);



  // // to get Category
  // const [designationListData, setDesignationListData] = useState([]);

  // const getDesignationList = (_id) => {
  //   const response = api
  //     .get(baseURL + `designation/get-by-sc-approval-stage-id/${_id}`)
  //     .then((response) => {
  //       setDesignationListData(response.data.content.designation);
  //       setLoading(false);
  //       if (response.data.content.error) {
  //           setDesignationListData([]);
  //       }
  //     })
  //     .catch((err) => {
  //       setDesignationListData([]);
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   if (data.scApprovalStageId) {
  //       getDesignationList(data.scApprovalStageId);
  //   }
  // }, [data.scApprovalStageId]);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
    // Refresh entire page AFTER clicking OK
    window.location.reload();
  });
    // clear();
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
    <Layout title="Service Program Approval Mapping">
      <style>{scProgramApprovalMappingStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Service Program Approval Mapping")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/sc-program-approval-mapping-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/sc-program-approval-mapping-list"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Header className="sh-section-header">
                <Icon name="setting" />
                <span>{t("Scheme And Approval Stage Details")}</span>
              </Card.Header>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        Component Type<span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scProgramId"
                            value={data.scProgramId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scProgramId === undefined ||
                              data.scProgramId === "0"
                            }
                          >
                            <option value="">Select Program</option>
                            {programListData.map((list) => (
                              <option
                                key={list.scProgramId}
                                value={list.scProgramId}
                              >
                                {list.scProgramName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Program is required
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col> */}
                  {/* <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                      {t("Component Type")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="subSchemeId"
                          value={data.subSchemeId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          // multiple
                          required
                          isInvalid={
                            data.subSchemeId === undefined ||
                            data.subSchemeId === "0"
                          }
                        >
                          <option value="">{t("Select Component Type")}</option>
                          {scSubSchemeDetailsListData &&
                            scSubSchemeDetailsListData.map((list) => (
                              <option
                                key={list.scSubSchemeDetailsId}
                                value={list.scSubSchemeDetailsId}
                              >
                                {list.subSchemeName}
                              </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        {t("Component Type is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                      {t("Approval Stage")}<span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scApprovalStageId"
                            value={data.scApprovalStageId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scApprovalStageId === undefined ||
                              data.scApprovalStageId === "0"
                            }
                          >
                            <option value="">{t("Select Approval Stage")}</option>
                            {approvalListData.map((list) => (
                              <option
                                key={list.scApprovalStageId}
                                value={list.scApprovalStageId}
                              >
                                {list.stageName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          {t("Approval Stage Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col> */}

                  <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Component Type")} <span className="text-danger">*</span>
                    </Form.Label>

                    <div className="form-control-wrap">
                      <ReactSelect
                        options={scSubSchemeDetailsListData?.map((list) => ({
                          value: list.scSubSchemeDetailsId,
                          label: list.subSchemeName,
                        }))}
                        placeholder={t("Select Component Type")}
                        isSearchable
                        menuPlacement="auto"
                        value={scSubSchemeDetailsListData
                          ?.map((list) => ({
                            value: list.scSubSchemeDetailsId,
                            label: list.subSchemeName,
                          }))
                          .find((opt) => opt.value === data.subSchemeId)}
                        onChange={(selectedOption) => {
                          setData((prev) => ({
                            ...prev,
                            subSchemeId: selectedOption?.value || "",
                          }));
                         if (validated) setValidated(false);
                        }}
                        className={validated && !isSubSchemeValid ? "is-invalid" : ""}
                      />

                      {validated && !isSubSchemeValid && (
                        <div className="invalid-feedback d-block">
                          {t("Component Type is required")}
                        </div>
                      )}

                    </div>
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Approval Stage")} <span className="text-danger">*</span>
                    </Form.Label>

                    <div className="form-control-wrap">
                      <ReactSelect
                        options={approvalListData?.map((list) => ({
                          value: list.scApprovalStageId,
                          label: list.stageName,
                        }))}
                        placeholder={t("Select Approval Stage")}
                        isSearchable
                        menuPlacement="auto"
                        value={approvalListData
                          ?.map((list) => ({
                            value: list.scApprovalStageId,
                            label: list.stageName,
                          }))
                          .find((opt) => opt.value === data.scApprovalStageId)}
                        onChange={(selectedOption) => {
                          setData((prev) => ({
                            ...prev,
                            scApprovalStageId: selectedOption?.value || "",
                          }));
                          if (validated) setValidated(false);
                        }}
                        className={validated && !isApprovalStageValid ? "is-invalid" : ""}
                      />

                      {validated && !isApprovalStageValid && (
                        <div className="invalid-feedback d-block">
                          {t("Approval Stage Name is required")}
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </Col>


                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="program">{t("Order")}
                      <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="stepId"
                          name="stepId"
                          type="number"
                          value={data.stepId}
                          onChange={handleInputs}
                          placeholder={t("Enter Order")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Order is required")}
                          </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="program">{t("Version")}
                      <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="version"
                          name="version"
                          type="number"
                          value={data.version}
                          onChange={handleInputs}
                          placeholder={t("Enter Version")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Version is required")}
                          </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="program">{t("Action")}
                      <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="action"
                          name="action"
                          as="textarea"
                          rows={4}
                          value={data.action}
                          onChange={handleInputs}
                          placeholder={t("Enter Action")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Action is required")}
                          </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Block className="mt-3">
              <Card>
                <Card.Header className="sh-section-header"><Icon name="package" /><span>{t("Add Designation")}</span></Card.Header>
                <Card.Body>
                  {/* <h3>Virtual Bank account</h3> */}
                  <Row className="g-gs mb-1">
                    <Col lg="6">
                      <Form.Group className="form-group mt-1">
                        <div className="form-control-wrap"></div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group d-flex align-items-center justify-content-end gap g-5">
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
                                <span>{t("add")}</span>
                              </Button>
                            </li>
                            <li>
                              <Button
                                className="d-none d-md-inline-flex"
                                variant="primary"
                                onClick={handleShowModal}
                              >
                                <Icon name="plus" />
                                <span>{t("add")}</span>
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  {designationList.length > 0 ? (
                    <Row className="g-gs">
                      <Block>
                        <Card>
                          <div
                            className="table-responsive"
                            // style={{ paddingBottom: "30px" }}
                          >
                            <table className="table small">
                              <thead>
                                <tr style={{ backgroundColor: "#f1f2f7" }}>
                                  {/* <th></th> */}
                                  <th>{t("Action")}</th>
                                  <th>{t("Designation")}</th>
                                  <th>{t("Amount")}</th>
                                  <th>{t("Designation Order")}</th>
                                  {/* <th>Share in %</th> */}
                                </tr>
                              </thead>
                              <tbody>
                                {designationList.map((item, i) => (
                                  <tr>
                                    <td>
                                      <div>
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() => handleGet(i)}
                                          className="d-inline-flex align-items-center gap-1 shadow-sm"
                                        >
                                          <Icon name="edit" />
                                          {t("Edit")}
                                        </Button>
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() => handleDelete(i)}
                                          className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm"
                                        >
                                          <Icon name="trash" />
                                          {t("delete")}
                                        </Button>
                                      </div>
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.amount}</td>
                                    <td>{item.designationStep}</td>
                                    {/* <td>{item.scHeadAccountName}</td>
                                  <td>{item.shareInPercentage}</td> */}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </Card>
                      </Block>
                    </Row>
                  ) : (
                    ""
                  )}
                </Card.Body>
              </Card>
            </Block>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="submit" variant="primary" className="sh-save-btn">
                  <Icon name="save" />
                  {t("save")}
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                  <Icon name="cross" />
                  {t("cancel")}
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal} size="xl" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title><Icon name="plus" />{t("Add Designation")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedDesignationDetails}
            onSubmit={handleAdd}
          >
            <Row className="g-5">
              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="sordfl">{("Designation")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="designationId"
                      value={`${designationDetails.designationId}_${designationDetails.name}`}
                      onChange={handleDesignationOption}
                      onBlur={() => handleDesignationOption}
                      required
                      isInvalid={
                        designationDetails.designationId === undefined ||
                        designationDetails.designationId === "0"
                      }
                    >
                      <option value="">{t("Select Designation")}</option>
                      {designationListData.map((list) => (
                        <option
                          key={list.designationId}
                          value={`${list.designationId}_${list.name}`}
                        >
                          {list.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Designation is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="program">{t("Amount")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="amount"
                      name="amount"
                      type="number"
                      value={designationDetails.amount}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Amount")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Amount is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="program">{t("Designation Order")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="designationStep"
                      name="designationStep"
                      type="number"
                      value={designationDetails.designationStep}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Order")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Designation Order is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAdd}> */}
                    <Button type="submit" variant="success" className="sh-save-btn">
                    <Icon name="plus" />
                    {t("add")}
                    </Button>
                  </div>

                  <div className="gap-col">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={designationClear}
                      className="sh-cancel-btn"
                    >
                       <Icon name="cross" />
                       {t("Clear")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="xl" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title><Icon name="edit" />{t("Edit Designation")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedDesignationDetailsEdit}
            onSubmit={(e) =>
              handleUpdate(e, designationDetailsId, designationDetails)
            }
          >
            <Row className="g-5">
              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="sordfl">{t("Designation")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="designationId"
                      value={`${designationDetails.designationId}_${designationDetails.name}`}
                      onChange={handleDesignationOption}
                      onBlur={() => handleDesignationOption}
                      required
                      isInvalid={
                        designationDetails.designationId === undefined ||
                        designationDetails.designationId === "0"
                      }
                    >
                      <option value="">{t("Select Designation")}</option>
                      {designationListData.map((list) => (
                        <option
                          key={list.designationId}
                          value={`${list.designationId}_${list.name}`}
                        >
                          {list.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                    {t("Designation is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="program">{t("Amount")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="amount"
                      name="amount"
                      type="number"
                      value={designationDetails.amount}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Amount")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Amount is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="program">{t("Designation Order")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="designationStep"
                      name="designationStep"
                      type="number"
                      value={designationDetails.designationStep}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Order")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Designation Order is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    <Button type="submit" variant="success" className="sh-save-btn">
                    <Icon name="save" />
                    {t("update")}
                    </Button>
                  </div>

                  <div className="gap-col">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={designationClear}
                      className="sh-cancel-btn"
                    >
                      <Icon name="cross" />
                      {t("Clear")}
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

const scProgramApprovalMappingStyles = `
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
  .sh-modal-content {
    border: none;
    border-radius: 14px;
    overflow: hidden;
  }
  .sh-modal-content .modal-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-bottom: none;
    padding: 18px 24px;
  }
  .sh-modal-content .modal-title {
    color: #ffffff;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sh-modal-content .btn-close {
    filter: invert(1) brightness(200%);
  }
`;

export default ScProgramApprovalMapping;
