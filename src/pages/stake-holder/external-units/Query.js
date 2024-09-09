import { Card, Form, Row, Col, Button } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../../../src/services/auth/api";
import { useNavigate } from "react-router-dom";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function Query() {
  const [data, setData] = useState({
    queryName: "",
  });

  const payload = {
    query: data.queryName,
  };
  const _params = { params: { query: payload.query } };
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  // Handling form inputs
  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Handling form submission
  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();

      if (!data.queryName.toUpperCase().includes("WHERE")) {
        saveError("Error: Query must contain a WHERE clause.");
        return;
      }

      // Prepare request payload
      

      // API call to execute query
      api
        .post(baseURL + `query/execute`,{},_params)
        .then((response) => {
          saveSuccess(response.data);
          clear();
        })
        .catch((err) => {
          saveError(err.response?.data?.message || "Error executing query");
        });
    }
  };

  // Display success message
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Query executed successfully",
      text: message,
    });
  };

  // Display error message
  const saveError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      html: typeof message === "string" ? message : "An error occurred",
    });
  };

  // Clear form data
  const clear = () => {
    setData({ queryName: "" });
    setValidated(false);
  };

  return (
    <Layout title="Query">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Query</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="queryName">
                        Query<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          as="textarea"
                          id="queryName"
                          name="queryName"
                          value={data.queryName}
                          onChange={handleInputs}
                          placeholder="Enter SQL query with a WHERE clause"
                          rows="6"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Query is required
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
                  <Button type="submit" variant="primary">
                    Execute
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    Clear
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

export default Query;
