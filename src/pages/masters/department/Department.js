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

function Department() {
  const [data, setData] = useState({
    departmentCode: "",
    departmentName: "",
    departmentNameInKannada: "",
    departmentDetails: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    // Convert value to integer if it represents a numeric value
    // const intValue = /^\d+$/.test(value) ? parseInt(value, 10) : value;

    // setData({ ...data, [name]: intValue });
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
        .post(baseURL + `departmentMaster/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
                departmentCode: "",
                departmentName: "",
                departmentNameInKannada: "",
                departmentDetails: "",
            });
            setValidated(false);
          }
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
        departmentCode: "",
        departmentName: "",
        departmentNameInKannada: "",
        departmentDetails: "",
    });
  };

  const [loading, setLoading] = useState(false);

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
    <Layout title="Department">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Department</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/department-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/department-list"
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
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="approxWeightPerCrate">
                        Department Code
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="departmentCode"
                          name="departmentCode"
                          value={data.departmentCode}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Department Code"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Department Code is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="approxWeightPerCrate">
                        Department Name
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="departmentName"
                          name="departmentName"
                          value={data.departmentName}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Department Name"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Department Name is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="approxWeightPerCrate">
                        Department Name In Kannada
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="departmentNameInKannada"
                          name="departmentNameInKannada"
                          value={data.departmentNameInKannada}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Department Name In Kannada"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Department Name In Kannada is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="approxWeightPerCrate">
                        Department Details
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="departmentDetails"
                          name="departmentDetails"
                          value={data.departmentDetails}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Department Details"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Department Details is required.
                        </Form.Control.Feedback>
                      </div>
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
                  {/* <Link
                    to="/seriui/crate-list"
                    className="btn btn-secondary border-0"
                  >
                    Cancel
                  </Link> */}
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

export default Department;
