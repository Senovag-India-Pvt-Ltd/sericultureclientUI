import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScProgramApprovalMapping() {
  const [data, setData] = useState({
    scProgramId: "",
    scApprovalStageId: "",
    designationId: "",
    orders: "",
  });

  const [validated, setValidated] = useState(false);

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
      // event.stopPropagation();
      api
        .post(baseURL + `scProgramApprovalMapping/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
                scProgramId: "",
                scApprovalStageId: "",
                designationId: "",
                orders: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          saveError();
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
        scProgramId: "",
        scApprovalStageId: "",
        designationId: "",
        orders: "",
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

  // to get Approval Stage
  // const [approvalListData, setApprovalListData] = useState([]);

  // const getApprovalList = (_id) => {
  //   const response = api
  //     .get(baseURL + `scApprovalStage/get-by-program-id/${_id}`)
  //     .then((response) => {
  //       setApprovalListData(response.data.content.scApprovalStage);
  //       setLoading(false);
  //       if (response.data.content.error) {
  //           setApprovalListData([]);
  //       }
  //     })
  //     .catch((err) => {
  //       setApprovalListData([]);
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   if (data.scProgramId) {
  //     getApprovalList(data.scProgramId);
  //   }
  // }, [data.scProgramId]);

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
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        Program<span className="text-danger">*</span>
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
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
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
                            Approval Stage  Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
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
                  </Col>

                  <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="program">Orders</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="orders"
                            name="orders"
                            type="number"
                            value={data.orders}
                            onChange={handleInputs}
                            placeholder="Enter Orders"
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
    </Layout>
  );
}

export default ScProgramApprovalMapping;
