import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function ScProgramApprovalMapping() {
  const [designationList, setDesignationList] = useState([]);
  const [designationDetails, setDesignationDetails] = useState({
    designationId: "",
    amount: "",

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

  const postData = (event) => {
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
    });
    designationClear();
  };

  const designationClear = () => {
    setDesignationDetails({
      designationId: "",
      amount: "",
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
    <Layout title="Service Program Approval Mapping">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Service Program Approval Mapping</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-program-approval-mapping-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-program-approval-mapping-list"
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

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
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
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Component Type
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
                          <option value="">Select Component Type</option>
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
                          Component Type is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Approval Stage<span className="text-danger">*</span>
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
                            <option value="">Select Approval Stage</option>
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
                            Approval Stage Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  {/* <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Designation<span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
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
                            <option value="">Select designation</option>
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
                            Designation is required
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col> */}

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="program">Orders</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="stepId"
                          name="stepId"
                          type="number"
                          value={data.stepId}
                          onChange={handleInputs}
                          placeholder="Enter Orders"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="program">Version</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="version"
                          name="version"
                          type="number"
                          value={data.version}
                          onChange={handleInputs}
                          placeholder="Enter Version"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Block className="mt-3">
              <Card>
                <Card.Header>Add Designation</Card.Header>
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
                                <th>Action</th>
                                <th>Designation</th>
                                <th>Amount</th>
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
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(i)}
                                        className="ms-2"
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </td>
                                  <td>{item.name}</td>
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
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    Cancel
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add Designation</Modal.Title>
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
                  <Form.Label htmlFor="sordfl">Designation</Form.Label>
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
                      <option value="">Select Designation</option>
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
                      Designation is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAdd}> */}
                    <Button type="submit" variant="success">
                      Add
                    </Button>
                  </div>

                  <div className="gap-col">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={designationClear}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Designation</Modal.Title>
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
                  <Form.Label htmlFor="sordfl">Designation</Form.Label>
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
                      <option value="">Select Designation</option>
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
                      Designation is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    <Button type="submit" variant="success">
                      Update
                    </Button>
                  </div>

                  <div className="gap-col">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={designationClear}
                    >
                      Clear
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

export default ScProgramApprovalMapping;
