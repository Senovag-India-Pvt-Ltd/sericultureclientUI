import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import React from "react";
// import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScApprovalStage() {
  const [data, setData] = useState({
    stageName: "",
    stageNameInKannada: "",
    workFlowType:""
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
      api
        .post(baseURL + `scApprovalStage/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
              stageName: "",
              stageNameInKannada: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
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

  const handleCheckBox = (e) =>{
    const {name,value,checked} = e.target;
    setData((prev)=>({
      ...prev,
      [name]:value
    }))
  }

  console.log("see this",data);

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
    <Layout title="Approval Stage">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Approval Stage</Block.Title>
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
                {/* <h3>Farmers Details</h3> */}
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
                          // checked={data.weighmentTripletGeneration}
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
                          // checked={data.weighmentTripletGeneration}
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
                          // checked={data.weighmentTripletGeneration}
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
                          // checked={data.weighmentTripletGeneration}
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
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
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

export default ScApprovalStage;
