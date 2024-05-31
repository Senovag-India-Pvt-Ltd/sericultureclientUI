import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScProgramAccountMappingEdit() {
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
        .post(baseURL + `scProgramAccountMapping/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError();
          } else {
            updateSuccess();
            setData({
                scProgramId: "",
                scHeadAccountId: "",
                scCategoryId: "",
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
        scProgramId: "",
        scHeadAccountId: "",
        scCategoryId: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `scProgramAccountMapping/get/${id}`)
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

  // to get Program
  const [programListData, setProgramListData] = useState([]);

  const getProgramList = () => {
    const response = api
      .get(baseURL + `scProgram/get-all`)
      .then((response) => {
        setProgramListData(response.data.content.scProgram);
      })
      .catch((err) => {
        setProgramListData([]);
      });
  };

  useEffect(() => {
    getProgramList();
  }, []);

  // to get Head Account
  // const [accountListData, setAccountListData] = useState([]);

  // const getAccountList = (_id) => {
  //   const response = api
  //     .get(baseURL + `scHeadAccount/get-by-program-id/${_id}`)
  //     .then((response) => {
  //       setAccountListData(response.data.content.scHeadAccount);
  //       setLoading(false);
  //       if (response.data.content.error) {
  //           setAccountListData([]);
  //       }
  //     })
  //     .catch((err) => {
  //       setAccountListData([]);
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   if (data.scProgramId) {
  //     getAccountList(data.scProgramId);
  //   }
  // }, [data.scProgramId]);

  // // to get Category
  // const [categoryListData, setCategoryListData] = useState([]);

  // const getCategoryList = (_id) => {
  //   const response = api
  //     .get(baseURL + `scCategory/get-by-head-account-id/${_id}`)
  //     .then((response) => {
  //       setCategoryListData(response.data.content.scCategory);
  //       setLoading(false);
  //       if (response.data.content.error) {
  //           setCategoryListData([]);
  //       }
  //     })
  //     .catch((err) => {
  //       setCategoryListData([]);
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   if (data.scHeadAccountId) {
  //       getCategoryList(data.scHeadAccountId);
  //   }
  // }, [data.scHeadAccountId]);

  // to get Head Of Account
  const [accountListData, setAccountListData] = useState([]);

  const getAccountList = () => {
    const response = api
      .get(baseURL + `scHeadAccount/get-all`)
      .then((response) => {
       setAccountListData(response.data.content.scHeadAccount);
      })
      .catch((err) => {
       setAccountListData([]);
      });
  };

  useEffect(() => {
    getAccountList();
  }, []);

  // to get Program
  const [categoryListData, setCategoryListData] = useState([]);

  const getCategoryList = () => {
    const response = api
      .get(baseURL + `scCategory/get-all`)
      .then((response) => {
       setCategoryListData(response.data.content.scCategory);
      })
      .catch((err) => {
       setCategoryListData([]);
      });
  };

  useEffect(() => {
    getCategoryList();
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
    }).then(() => navigate("#"));
  };

  return (
    <Layout title="Edit Service Program Account Mapping">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Service Program Account Mapping</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-program-account-mapping-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-program-account-mapping-list"
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
                      <Form.Label>
                        Program<span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scProgramId"
                            value={data.scProgramId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scProgramId === undefined ||
                              data.scProgramId === "0"
                            }
                          >
                            <option value="">Select Program</option>
                            {programListData.map((list) => (
                              <option
                                key={list.scProgramId}
                                value={list.scProgramId}
                              >
                                {list.scProgramName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Program is required
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        Head Account<span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scHeadAccountId"
                            value={data.scHeadAccountId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scHeadAccountId === undefined ||
                              data.scHeadAccountId === "0"
                            }
                          >
                            <option value="">Select Head Of Account</option>
                            {accountListData.map((list) => (
                              <option
                                key={list.scHeadAccountId}
                                value={list.scHeadAccountId}
                              >
                                {list.scHeadAccountName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Head Account is required
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                       Category<span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scCategoryId"
                            value={data.scCategoryId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scCategoryId === undefined ||
                              data.scCategoryId === "0"
                            }
                          >
                            <option value="">Select Category</option>
                            {categoryListData.map((list) => (
                              <option
                                key={list.scCategoryId}
                                value={list.scCategoryId}
                              >
                                {list.codeNumber}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                           Category  is required
                          </Form.Control.Feedback>
                        </div>
                      </Col>
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

export default ScProgramAccountMappingEdit;
