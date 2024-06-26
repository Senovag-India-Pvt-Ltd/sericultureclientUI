import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
// import Layout from "../../../layout/default";
// import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import axios from "axios";
// import { Icon } from "../../../components";
import api from "../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLHelpdesk = process.env.REACT_APP_API_BASE_URL_HELPDESK;

function HelpDeskFaqAnsComponent(props) {
  console.log(props);
  const [data, setData] = useState({
    hdQuestionName: props.query.query,
    hdQuestionAnswerName: "",
    hdFaqUploadPath: "",
  });

  console.log(props.query)

  useEffect(() => {
    if (props.query.query) {
      setData({
        ...data,
        hdQuestionName: props.query.query,
      });
    }
  }, [props.query]);

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
        .post(baseURL + `hdQuestionMaster/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            // saveSuccess();
            api.post(baseURLHelpdesk + `hdTicket/edit`, {
              ...props.query,
              hdStatusId: "6",
            });
            setData({
              hdQuestionName: props.query.query,
              hdQuestionAnswerName: "",
              hdFaqUploadPath: "",
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
      hdQuestionName: props.query.query,
      hdQuestionAnswerName: "",
      hdFaqUploadPath: "",
    });
    setValidated(false);
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
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
    <Form noValidate validated={validated} onSubmit={postData}>
      <Row className="g-3 ">
        <Card>
          <Card.Body>
            {/* <h3>Farmers Details</h3> */}
            <Row className="g-gs">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="Hd Question">
                    Questions<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="hdQuestion"
                      name="hdQuestionName"
                      value={data.hdQuestionName}
                      onChange={handleInputs}
                      type="text"
                      placeholder="Enter Questions"
                      as="textarea"
                      rows={4}
                      required
                      readOnly
                    />
                    <Form.Control.Feedback type="invalid">
                      Questions is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="Question&Answer">
                    Answers <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="Question&Answer"
                      name="hdQuestionAnswerName"
                      value={data.hdQuestionAnswerName}
                      onChange={handleInputs}
                      // type="text"
                      as="textarea"
                      rows={4}
                      placeholder="Enter Answers"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Answers is Required.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="FAQ Upload Path">
                    FAQ Upload Path <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="FAQUploadPath"
                      name="hdFaqUploadPath"
                      value={data.hdFaqUploadPath}
                      onChange={handleInputs}
                      type="text"
                      placeholder="Enter FAQ Upload Path"
                      // required
                    />
                    {/* <Form.Control.Feedback type="invalid">
                        FAQ Upload Path is Required.
                        </Form.Control.Feedback> */}
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    Submit
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    Cancel
                  </Button>
                </li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </Row>
    </Form>
  );
}

export default HelpDeskFaqAnsComponent;
