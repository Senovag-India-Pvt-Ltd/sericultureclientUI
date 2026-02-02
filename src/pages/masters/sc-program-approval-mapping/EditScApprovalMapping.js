import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";
import { act } from "react";
import { useTranslation } from "react-i18next";
import ReactSelect from "react-select";
import React, { useMemo } from "react";
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function ScProgramApprovalMappingEdit() {
  // Translation
  const { t } = useTranslation();
  
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);


  const [validated, setValidated] = useState(false);
  

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
        id: id,
        version: data.version,
        status: data.status,
        stepId: data.stepId,
        scApprovalStageId: data.scApprovalStageId,
        subSchemeId: data.subSchemeId,
        action: data.action,
        designationId: data.designationId,
        designationStep: data.designationStep,
        amount: data.amount,
        stepName: data.stepName,
      };
      api
        .post(baseURLDBT + `master/cost/editSubSchemeWorkFlowRequest`, sendPost)
        .then((response) => {
          updateSuccess();
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
              updateError(err.response.data.validationErrors);
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
      amount: "",
      action: "",
      subSchemeId: "",
      stepId: "",
      scApprovalStageId: "",
      designationId: "",
      designationStep: "",
      stepName: "",
    });
  };


  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLDBT + `master/cost/getSubSchemeWorkFlowRequest/get/${id}`)
      .then((response) => {
        const res = response.data.content;
        setData((prev) => ({
          ...prev,
          version: res.version,
          status: res.status,
          stepId: res.stepId,
          scApprovalStageId: res.scApprovalStageId,
          subSchemeId: res.subSchemeId,
          action: res.action,
          // landDetailId: landDetailsIds[0],
          designationId: res.designationId,
          amount: res.amount,
          designationStep: res.designationStep,
          stepName: res.stepName,
        }));
        setLoading(false);
      })
      .catch((err) => {
        setData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);
  
  

  // to get sc-sub-scheme-details
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

  // to get Approval
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

  

  const navigate = useNavigate();

  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    }).then(() => {
    // Refresh entire page AFTER clicking OK
    window.location.reload();
  });
    // clear();
  };
  
  const updateError = (message) => {
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
    <Layout title="Edit Service Program Account Mapping">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("Edit Service Program Account Mapping")}
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-program-approval-mapping-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-program-approval-mapping-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
          <Block className="mt-3">
            <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
                {t("Scheme And Approval Stage Details")}
              </Card.Header>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
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
                  </Col>        */}
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
                      <Form.Label htmlFor="program">{t("Order")}<span className="text-danger">*</span></Form.Label>
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
                      <Form.Label htmlFor="program">{t("Version")}</Form.Label>
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
                      <Form.Label htmlFor="program">{t("Action")}</Form.Label>
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
            </Block>

          <Block className="mt-3">
            <Card>
              <Card.Header style={{ fontWeight: "bold" }}>
                {t("Designation Details")}
              </Card.Header>
              <Card.Body>
              <Row className="g-gs">
              <Col lg="4">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="sordfl">{t("Designation")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="designationId"
                      value={data.designationId}
                      onChange={handleInputs}
                      onBlur={() => handleInputs}
                      required
                      isInvalid={
                        data.designationId === undefined ||
                        data.designationId === "0"
                      }
                    >
                      <option value="">{t("Select Designation")}</option>
                      {designationListData.map((list) => (
                        <option
                          key={list.designationId}
                          value={list.designationId}
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

              <Col lg="4">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="program">{t("Amount")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="amount"
                      name="amount"
                      type="number"
                      value={data.amount}
                      onChange={handleInputs}
                      placeholder={t("Enter Amount")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Amount is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="4">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="program">{t("Designation Order")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="designationStep"
                      name="designationStep"
                      type="number"
                      value={data.designationStep}
                      onChange={handleInputs}
                      placeholder={t("Enter Order")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Designation Order is required")}
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
                  <Button type="submit" variant="primary">
                  {t("update")}
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                  {t("cancel")}
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>

      {/* <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("Add Designation")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validatedDesignationDetails}
            onSubmit={handleAdd}
          >
            <Row className="g-5"> */}
           


              {/* <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    <Button type="submit" variant="success">
                      {t("add")}
                    </Button>
                  </div>

                  <div className="gap-col">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={designationClear}
                    >
                      {t("Clear")}
                    </Button>
                  </div>
                </div>
              </Col> */}
            {/* </Row>
          </Form>
        </Modal.Body>
      </Modal> */}

      {/* <Modal show={showModal2} onHide={handleCloseModal2} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("Edit Designation")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                    <Button type="submit" variant="success">
                    {t("update")}
                    </Button>
                  </div>

                  <div className="gap-col">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={designationClear}
                    >
                      {t("Clear")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal> */}
    </Layout>
  );
}

export default ScProgramApprovalMappingEdit;
