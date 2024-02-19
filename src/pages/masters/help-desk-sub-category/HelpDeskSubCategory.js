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

function HelpDeskSubCategory() {
  const [data, setData] = useState({
    hdBoardCategoryId: "",
    hdCategoryId: "",
    hdSubCategoryName: "",
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
        .post(baseURL + `hdSubCategoryMaster/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
              hdBoardCategoryId: "",
              hdCategoryId: "",
              hdSubCategoryName: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          saveError(err.response.data.validationErrors);
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      hdBoardCategoryId: "",
      hdCategoryId: "",
      hdSubCategoryName: "",
    });
  };

  // to get hdCategory
  const [hdCategoryListData, setHdCategoryListData] = useState([]);

  const getHdCategoryList = (_id) => {
    const response = api
      .get(baseURL + `hdCategoryMaster/get-by-hd-board-category-id/${_id}`)
      .then((response) => {
        if (response.data.content.hdCategoryMaster) {
          setHdCategoryListData(response.data.content.hdCategoryMaster);
        }
      })
      .catch((err) => {
        setHdCategoryListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.hdBoardCategoryId) {
      getHdCategoryList(data.hdBoardCategoryId);
    }
  }, [data.hdBoardCategoryId]);

  // to get BoardCategory
  const [hdBoardCategoryListData, setHdBoardCategoryListData] = useState([]);

  const getHdBoardCategoryList = (_id) => {
    const response = api
      .get(baseURL + `hdBoardCategoryMaster/get-all`)
      .then((response) => {
        if (response.data.content.hdBoardCategoryMaster) {
          setHdBoardCategoryListData(
            response.data.content.hdBoardCategoryMaster
          );
        }
      })
      .catch((err) => {
        setHdBoardCategoryListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getHdBoardCategoryList();
  }, []);

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
    <Layout title="Sub Category">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Sub Category</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/hd-sub-category-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/hd-sub-category-list"
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
                      <Form.Label>
                        Broad Category<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hdBoardCategoryId"
                          value={data.hdBoardCategoryId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.hdBoardCategoryId === undefined ||
                            data.hdBoardCategoryId === "0"
                          }
                        >
                          <option value="">Select Broad Category</option>
                          {hdBoardCategoryListData.map((list) => (
                            <option
                              key={list.hdBoardCategoryId}
                              value={list.hdBoardCategoryId}
                            >
                              {list.hdBoardCategoryName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Broad Category name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Category<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hdCategoryId"
                          value={data.hdCategoryId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.hdCategoryId === undefined ||
                            data.hdCategoryId === "0"
                          }
                        >
                          <option value="">Select Category</option>
                          {hdCategoryListData.map((list) => (
                            <option
                              key={list.hdCategoryId}
                              value={list.hdCategoryId}
                            >
                              {list.hdCategoryName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Category name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="Hd Sub Category">
                        Sub Category<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="hdSubCategory"
                          name="hdSubCategoryName"
                          value={data.hdSubCategoryName}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Sub Category"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Sub Category Name is required
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
      </Block>
    </Layout>
  );
}

export default HelpDeskSubCategory;
