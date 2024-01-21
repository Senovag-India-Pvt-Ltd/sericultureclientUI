import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";
import axios from "axios";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ReelerType() {
  const [data, setData] = useState({
    reelerTypeMasterName: "",
    reelerTypeNameInKannada: "",
    noOfDeviceAllowed: "",
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
      .post(baseURL + `reelerTypeMaster/add`, data)
      .then((response) => {
        if(response.data.content.error){
          saveError(response.data.content.error_description);
          }else{
            saveSuccess();
          }
      })
      .catch((err) => {
        setData({});
        saveError();
      });
      setValidated(true);
    }
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("/reeler-type-list"));
  };
  const saveError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: message,
    });
  };
  return (
    <Layout title="Releer Type">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Releer Type </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/reeler-type-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/reeler-type-list"
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
                      <Form.Label htmlFor="Releer Type">Releer Type<span className="text-danger">*</span></Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="reeler"
                          name="reelerTypeMasterName"
                          value={data.reelerTypeMasterName}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Reeler Type"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Reeler Type Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="Releer Type">Releer Type Name in Kannada<span className="text-danger">*</span></Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="reeler"
                          name="reelerTypeNameInKannada"
                          value={data.reelerTypeNameInKannada}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Reeler Type Name in Kannada"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Reeler Type Name in Kannada is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="noOfDeviceAllowed">Number of device Allowed<span className="text-danger">*</span></Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="reeler"
                          name="noOfDeviceAllowed"
                          value={data.noOfDeviceAllowed}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter No Of Device "
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Number of device is required
                        </Form.Control.Feedback>
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
                    Save
                  </Button>
                </li>
                <li>
                  <Link to="/reeler-type-list" className="btn btn-secondary border-0">
                    Cancel
                  </Link>
                </li>
              </ul>
            </div>
            </Card.Body>
            </Card>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default ReelerType;

