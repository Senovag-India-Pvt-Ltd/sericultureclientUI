import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
//import axios from "axios";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function EditScApprovalStage() {
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

  const handleCheckBox = (e) => {
    const { name, value, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const datas = {
      scApprovalStageId: id,
      stageName: data.stageName,
      stageNameInKannada: data.stageNameInKannada,
      workFlowType: data.workFlowType,
    };
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURL + `scApprovalStage/edit`, datas)
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
              stageName: "",
              stageNameInKannada: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      stageName: "",
      stageNameInKannada: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `scApprovalStage/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setData({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  const navigate = useNavigate();
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    });
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
    <Layout title="Edit Approval Stage">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Approval Stage</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-approval-stage-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-approval-stage-list"
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
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
                  <>
                    <Row className="g-gs">
                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="title">
                            Approval Stage
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="title"
                              name="stageName"
                              type="text"
                              value={data.stageName}
                              onChange={handleInputs}
                              placeholder="Enter Approval Stage"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Approval Stage is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="title">
                            Approval Stage Name in Kannada
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="title"
                              name="stageNameInKannada"
                              type="text"
                              value={data.stageNameInKannada}
                              onChange={handleInputs}
                              placeholder="Enter Approval Stage Name In Kannada"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Approval Stage Name In Kannada is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="1">
                        <Form.Group as={Row} className="form-group mt-4">
                          <Col sm={1}>
                            <Form.Check
                              type="radio"
                              name="workFlowType"
                              value="INSPECTION"
                              id="weighmentTripletGeneration"
                              checked={data.workFlowType === "INSPECTION"}
                              onChange={handleCheckBox}
                              // Optional: disable the checkbox in view mode
                              // defaultChecked
                            />
                          </Col>
                          <Form.Label column sm={8} className="mt-n2">
                            Inspection
                          </Form.Label>
                        </Form.Group>
                      </Col>
                      <Col lg="1">
                        <Form.Group as={Row} className="form-group mt-4">
                          <Col sm={1}>
                            <Form.Check
                              type="radio"
                              name="workFlowType"
                              value="WORKORDER"
                              id="weighmentTripletGeneration"
                              checked={data.workFlowType === "WORKORDER"}
                              onChange={handleCheckBox}
                              // Optional: disable the checkbox in view mode
                              // defaultChecked
                            />
                          </Col>
                          <Form.Label column sm={8} className="mt-n2">
                            Work Order
                          </Form.Label>
                        </Form.Group>
                      </Col>
                      <Col lg="1">
                        <Form.Group as={Row} className="form-group mt-4">
                          <Col sm={1}>
                            <Form.Check
                              type="radio"
                              name="workFlowType"
                              value="SANCTIONORDER"
                              id="weighmentTripletGeneration"
                              checked={data.workFlowType === "SANCTIONORDER"}
                              onChange={handleCheckBox}
                              // Optional: disable the checkbox in view mode
                              // defaultChecked
                            />
                          </Col>
                          <Form.Label column sm={8} className="mt-n2">
                            Sanction Order
                          </Form.Label>
                        </Form.Group>
                      </Col>
                      <Col lg="1">
                        <Form.Group as={Row} className="form-group mt-4">
                          <Col sm={1}>
                            <Form.Check
                              type="radio"
                              name="workFlowType"
                              value="PUSHTODBT"
                              id="weighmentTripletGeneration"
                              checked={data.workFlowType === "PUSHTODBT"}
                              onChange={handleCheckBox}
                              // Optional: disable the checkbox in view mode
                              // defaultChecked
                            />
                          </Col>
                          <Form.Label column sm={8} className="mt-n2">
                            Push to DBT
                          </Form.Label>
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    Update
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

export default EditScApprovalStage;
