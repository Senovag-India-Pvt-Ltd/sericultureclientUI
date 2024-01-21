import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function LandOwnershipEdit() {
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
    const datas = {
      landOwnershipId: id,
      landOwnershipName: data.landOwnershipName,
      landOwnershipNameInKannada: data.landOwnershipNameInKannada,
    };
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
    api
      .post(baseURL + `landOwnership/edit`, datas)
      .then((response) => {
        if(response.data.content.error){
          updateError(response.data.content.error_description);
          }else{
        updateSuccess();
          }
      })
      .catch((err) => {
        setData({});
        updateError();
      });
      setValidated(true);
    }
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `landOwnership/get/${id}`)
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
    }).then(() => navigate("/land-ownership-list"));
  };
  const updateError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: message,
    });
  };
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("/state-list"));
  };

  return (
    <Layout title="Edit Land Ownership">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Land Ownership</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/land-ownership-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/land-ownership-list"
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
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="land">Land Ownership<span className="text-danger">*</span></Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="land"
                            name="landOwnershipName"
                            type="text"
                            value={data.landOwnershipName}
                            onChange={handleInputs}
                            placeholder="Enter Land Ownership"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                          Land Ownership is required.
                        </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="land">Land Ownership Name in Kannada<span className="text-danger">*</span></Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="land"
                          name="landOwnershipNameInKannada"
                          type="text"
                          value={data.landOwnershipNameInKannada}
                          onChange={handleInputs}
                          placeholder="Enter Land Ownership Name in Kannada"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Land Ownership Name in Kannada is required.
                        </Form.Control.Feedback>
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
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    Update
                  </Button>
                </li>
                <li>
                  <Link
                    to="/land-ownership-list"
                    className="btn btn-secondary border-0"
                  >
                    Cancel
                  </Link>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default LandOwnershipEdit;
