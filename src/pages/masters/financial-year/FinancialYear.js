import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState } from "react";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function FinancialYear() {
  const [data, setData] = useState({
    financialYear: "",
    isDefault: false,
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleCheckBox = (e) => {
    setData((prev) => ({
      ...prev,
      isDefault: e.target.checked,
    }));
  };

  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

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
        .post(baseURL + `financialYearMaster/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
              financialYear: "",
              isDefault: false,
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
      financial_year: "",
      is_default: false,
    });
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
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
    <Layout title="Financial Year">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Financial Year</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/financial-year-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/financial-year-list"
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
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="financialYear">
                        Financial Year<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="financialYear"
                          name="financialYear"
                          value={data.financialYear}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Title"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Financial Year is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={3}>
                        <Form.Check
                          className="form-check-sm"
                          type="checkbox"
                          id="isDefault"
                          checked={data.isDefault}
                          name="isDefault"
                          label="Is Default"
                          onChange={handleCheckBox}
                        />
                      </Col>
                      {/* <Form.Label column sm={11} className="mt-n2">
                        Triplet Generation After Weighment
                      </Form.Label> */}
                    </Form.Group>

                    {/* <div style={{ marginTop: "10px" }}>
                      <Form.Check
                        className="form-check-sm"
                        type="checkbox"
                        id="is_default"
                        name="is_default"
                        label="Is Default"
                      />
                    </div> */}
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

export default FinancialYear;
