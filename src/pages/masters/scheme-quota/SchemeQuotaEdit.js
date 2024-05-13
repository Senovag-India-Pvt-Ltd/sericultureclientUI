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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function SchemeQuotaEdit() {
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
        .post(baseURL + `schemeQuota/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
                scSchemeDetailsId: "",
                schemeQuotaName: "",
                schemeQuotaType: "",
                schemeQuotaCode:"",
                schemeQuotaPaymentType:"",

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
        scSchemeDetailsId: "",
        schemeQuotaName: "",
        schemeQuotaType: "",
        schemeQuotaCode:"",
        schemeQuotaPaymentType:"",
    });
  };
// to get Scheme Details
const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);

const getList = () => {
  const response = api
    .get(baseURL + `scSchemeDetails/get-all`)
    .then((response) => {
      setScSchemeDetailsListData(response.data.content.ScSchemeDetails);
    })
    .catch((err) => {
      setScSchemeDetailsListData([]);
    });
};

useEffect(() => {
  getList();
}, []);

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `schemeQuota/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);


  

  const navigate = useNavigate();

  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
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
    }).then(() => navigate("#"));
  };
  return (
    <Layout title="Scheme Quota">
    <Block.Head>
      <Block.HeadBetween>
        <Block.HeadContent>
          <Block.Title tag="h2">Scheme Quota</Block.Title>
        </Block.HeadContent>
        <Block.HeadContent>
          <ul className="d-flex">
            <li>
              <Link
                to="/seriui/scheme-quota-list"
                className="btn btn-primary btn-md d-md-none"
              >
                <Icon name="arrow-long-left" />
                <span>Go to List</span>
              </Link>
            </li>
            <li>
              <Link
                to="/seriui/scheme-quota-list"
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
        {/* <Form Action="#"> */}
        <Row className="g-3 ">
          <Card>
            <Card.Body>
              {/* <h3>Farmers Details</h3> */}
              <Row className="g-gs">
              <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Scheme Details<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="scSchemeDetailsId"
                          value={data.scSchemeDetailsId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.scSchemeDetailsId === undefined || data.scSchemeDetailsId === "0"
                          }
                        >
                          <option value="">Select Scheme Details</option>
                          {scSchemeDetailsListData.map((list) => (
                            <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>
                              {list.schemeName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Scheme name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
              <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="title">
                         Scheme Quota
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="schemeQuotaName"
                          name="schemeQuotaName"
                          value={data.schemeQuotaName}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Scheme Quota"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Scheme Quota is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="title">
                        Scheme Quota Type
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="schemeQuotaType"
                          name="schemeQuotaType"
                          value={data.schemeQuotaType}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Scheme Quota Type"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Scheme Quota Type is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="title">
                      Scheme Quota Code
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="schemeQuotaCode"
                          name="schemeQuotaCode"
                          value={data.schemeQuotaCode}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Scheme Quota Code"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Scheme Quota Code is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="title">
                         Scheme Quota Payment Type
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="schemeQuotaPaymentType"
                          name="schemeQuotaPaymentType"
                          value={data.schemeQuotaPaymentType}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Scheme Quota Payment Type"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Scheme Quota Payment Type is required.
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
                {/* <Link to="/seriui/district-list" className="btn btn-secondary border-0">
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

export default SchemeQuotaEdit;