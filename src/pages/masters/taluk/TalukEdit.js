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

function TalukEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (e) => {
    api
      .post(baseURL + `taluk/edit`, data, {
        headers: _header,
      })
      .then((response) => {
        if(response.data.content.error){
          updateError(response.data.content.error_description);
          }else{
            updateSuccess();
          }
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        updateError(message);
        setData({});
      });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `taluk/get/${id}`)
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

  // to get State
  const [stateListData, setStateListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `state/get-all`)
      .then((response) => {
        if(response.data.content.state){
          setStateListData(response.data.content.state);
          }
      })
      .catch((err) => {
        setStateListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = (_id) => {
    const response = api
      .get(baseURL + `district/get-by-state-id/${_id}`)
      .then((response) => {
        if(response.data.content.district){
          setDistrictListData(response.data.content.district);
          }
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.stateId) {
      getDistrictList(data.stateId);
    }
  }, [data.stateId]);

  const navigate = useNavigate();

  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("/taluk-list"));
  };
  const updateError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: message,
    });
  };
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("/taluk-list"));
  };
  return (
    <Layout title="Taluk">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Taluk</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/taluk-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/taluk-list"
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
        <Form action="#">
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
                    <Form.Group className="form-group ">
                      <Form.Label>State<span className="text-danger">*</span></Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="stateId"
                          value={data.stateId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs} 
                          required
                          isInvalid={data.stateId === undefined || data.stateId === "0"}
                        >
                          <option value="">Select State</option>
                          {stateListData.map((list) => (
                            <option key={list.stateId} value={list.stateId}>
                              {list.stateName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        Taluk Name is required
                      </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group ">
                      <Form.Label>District<span className="text-danger">*</span></Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="districtId"
                          value={data.districtId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs} 
                          required
                          isInvalid={data.districtId === undefined || data.districtId === "0"}
                        >
                          <option value="">Select District</option>
                          {districtListData.length
                            ? districtListData.map((list) => (
                                <option
                                  key={list.districtId}
                                  value={list.districtId}
                                >
                                  {list.districtName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        District Name is required
                      </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="Taluk">Taluk<span className="text-danger">*</span></Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="Taluk"
                          name="talukName"
                          value={data.talukName}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Taluk"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Taluk Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="Taluk">Taluk Name in Kannada<span className="text-danger">*</span></Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="Taluk"
                          name="talukNameInKannada"
                          value={data.talukNameInKannada}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Taluk Name in Kannada "
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Taluk Name in Kannada is required
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
                  <Button type="button" variant="primary" onClick={postData}>
                    Update
                  </Button>
                </li>
                <li>
                  <Link to="/taluk-list" className="btn btn-secondary border-0">
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

export default TalukEdit;
