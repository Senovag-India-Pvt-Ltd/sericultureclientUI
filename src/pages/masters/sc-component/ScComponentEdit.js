import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import api from "../../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScComponentEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  let name, value;

  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const [validated, setValidated] = useState(false);

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
      .post(baseURL + `scComponent/edit`, data)
      .then((response) => {
        if (response.data.content.error) {
          updateError(response.data.content.error_description);
        } else {
        updateSuccess();
        setData({
          scComponentName: "",
          scSubSchemeDetailsId: "",
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

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURL + `scComponent/get/${id}`)
      .then((response) => {
        setData(response.data.content);
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

  const clear = () => {
    setData({
      scComponentName: "",
      scSubSchemeDetailsId: "",
    });
  };

  // to get Sub Scheme Details
  const [scSubSchemeDetailsListData, setScSubSchemeDetailsData] = useState([]);

  const getScSubSchemeDetailsList = () => {
    const response = api
      .get(baseURL + `scSubSchemeDetails/get-all`)
      .then((response) => {
        setScSubSchemeDetailsData(response.data.content.scSubSchemeDetails);
      })
      .catch((err) => {
        setScSubSchemeDetailsData([]);
      });
  };

  useEffect(() => {
    getScSubSchemeDetailsList();
  }, []);

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

  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("/seriui/sc-component-list"));
  };

  return (
    <Layout title="Edit Component">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Component</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-component-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-component-list"
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
                        <Form.Label>
                          Sub Scheme Details<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scSubSchemeDetailsId"
                            value={data.scSubSchemeDetailsId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scSubSchemeDetailsId === undefined || data.scSubSchemeDetailsId === "0"
                            }
                          >
                            <option value="">Select Sub Scheme Details</option>
                            {scSubSchemeDetailsListData.map((list) => (
                              <option key={list.scSubSchemeDetailsId} value={list.scSubSchemeDetailsId}>
                                {list.subSchemeName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Sub Scheme Details Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group ">
                        <Form.Label htmlFor="component">Component</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="component"
                            name="scComponentName"
                            type="text"
                            value={data.scComponentName}
                            onChange={handleInputs}
                            placeholder="Enter Component"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    
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

export default ScComponentEdit;
