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

function HelpDeskFeatureEdit() {
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
      .post(baseURL + `hdFeatureMaster/edit`, data)
      .then((response) => {
        if(response.data.content.error){
          updateError(response.data.content.error_description);
          }else{
            updateSuccess();
            setData({
                hdModuleId: "",
                hdFeatureName: "",
            });
            setValidated(false);
          }
      })
      .catch((err) => {
        updateError();
      });
      setValidated(true);
    }
  };

  const clear = () =>{
    setData({
        hdModuleId: "",
        hdFeatureName: "", 
    })
  }

 // to get Module
 const [hdModuleListData, setHdModuleListData] = useState([]);

 const getList = () => {
   const response = api
     .get(baseURL + `hdModuleMaster/get-all`)
     .then((response) => {
       setHdModuleListData(response.data.content.hdModuleMaster);
     })
     .catch((err) => {
       setHdModuleListData([]);
     });
 };

 useEffect(() => {
   getList();
 }, []);


  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `hdFeatureMaster/get/${id}`)
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
    }).then(() => navigate("#"));
  };

  return (
    <Layout title="Edit Features">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Features</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/hd-feature-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/hd-feature-list"
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
                      <Form.Label>Modules<span className="text-danger">*</span></Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hdModuleId"
                          value={data.hdModuleId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs} 
                          required
                          isInvalid={data.hdModuleId === undefined || data.hdModuleId === "0"}
                        >
                         <option value="">Select Module</option>
                          {hdModuleListData.map((list) => (
                            <option
                              key={list.hdModuleId}
                              value={list.hdModuleId}
                            >
                              {list.hdModuleName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        Module name is required
                      </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="hdFeature">Features<span className="text-danger">*</span></Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="hdFeature"
                            name="hdFeatureName"
                            value={data.hdFeatureName}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Features"
                            required
                            />
                            <Form.Control.Feedback type="invalid">
                            Feature Name is required.
                            </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body>
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
            </Card.Body>
            </Card>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default HelpDeskFeatureEdit;