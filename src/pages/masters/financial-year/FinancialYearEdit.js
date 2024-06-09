import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import FinancialYear from "./FinancialYear";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function FinancialYearEdit() {
  // Fetching id from URL params
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  let name, value;

  // Function to handle input changes
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  // Function to handle checkbox change
  const handleCheckBox = (e) => {
    setData((prev) => ({
      ...prev,
      isDefault: e.target.checked,
    }));
  };

  // HTTP header configuration
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  // Function to submit form data
  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURL + `financialYearMaster/edit`, {...data,financialYearMasterId:id})
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
              title: "",
              code: "",
              nameInKannada: "",
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
              updateError(err.response.data.validationErrors);
            }
          }
        });
      setValidated(true);
    }
  };

  // Function to clear form data
  const clear = () => {
    setData({
      title: "",
      code: "",
      nameInKannada: "",
    });
  };

  // Function to get data by ID from API
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `financialYearMaster/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        let message;
        if (err.response.data.errorMessages.length > 0) {
          message = err.response.data.errorMessages[0].message[0].message;
          editError(message);
        }
        setData({});
        setLoading(false);
      });
  };

  // Fetch data on component mount
  useEffect(() => {
    getIdList();
  }, [id]);

  // Navigation hook
  const navigate = useNavigate();

  // Function to handle success alert
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
    }).then(() => navigate("#"));
  };

  // Function to handle error alert
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

  // Function to handle edit error
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("#"));
  };

  return (
    <Layout title="Edit financialyear">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Financial Year</Block.Title>
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="title">
                          Edit Financial Year
                          <span className="text-danger">*</span>
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
                    </Col>

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
                    </Form.Group>
                  </Row>
                )}
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
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

export default FinancialYearEdit;
