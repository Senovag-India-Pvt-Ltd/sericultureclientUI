import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScApprovingAuthority() {
  const [data, setData] = useState({
    minAmount: "",
    maxAmount: "",
    type: "",
    roleId:""
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
        .post(baseURL + `scApprovingAuthority/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            // saveError();
            saveRaceError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
                minAmount: "",
                maxAmount: "",
                type: "",
                roleId:""
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (
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
        minAmount: "",
        maxAmount: "",
        type: "",
        roleId:""
    });
  };

  // to get Role
  const [roleListData, setRoleListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `role/get-all`)
      .then((response) => {
        setRoleListData(response.data.content.role);
      })
      .catch((err) => {
        setRoleListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const saveRaceError = (message) => {
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
    <Layout title=" Approving Authority">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2"> Approving Authority</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-approving-authority-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-approving-authority-list"
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
                        Market<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="marketMasterId"
                          value={data.marketMasterId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.marketMasterId === undefined ||
                            data.marketMasterId === "0"
                          }
                        >
                          <option value="">Select Market</option>
                          {marketListData.map((list) => (
                            <option
                              key={list.marketMasterId}
                              value={list.marketMasterId}
                            >
                              {list.marketMasterName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Market Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="minAmount">
                        Min Amount<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="minAmount"
                          name="minAmount"
                          value={data.minAmount}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Min Amount"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Min Amount is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="maxAmount">
                        Max Amount
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="maxAmount"
                          name="maxAmount"
                          value={data.maxAmount}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Max Amount"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Max Amount is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="type">
                        Type
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="type"
                          name="type"
                          value={data.type}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Type"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Type is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        Role<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="roleId"
                          value={data.roleId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.roleId === undefined || data.roleId === "0"
                          }
                        >
                          <option value="">Select Role</option>
                          {roleListData.map((list) => (
                            <option key={list.roleId} value={list.roleId}>
                              {list.roleName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Role name is required
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

export default ScApprovingAuthority;
