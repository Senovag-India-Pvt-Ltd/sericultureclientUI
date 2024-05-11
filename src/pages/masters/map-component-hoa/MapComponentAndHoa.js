import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../../components";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
// import TimePicker from 'react-time-picker';
import api from "../../../../src/services/auth/api";
import TimePicker from "../../../components/Form/TimePicker";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function MapComponent() {
  const [data, setData] = useState({
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    componentType: "",
    scComponentId: "",
    schemeQuotaId:"",
    scCategoryId: "",
    scHeadAccountId: "",
    shareInPer: "",
    unitCost: "",
    fullPrice: "",
    minStyle: "",
    maxStyle: "",
    measurementType: "",
    
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
        .post(baseURLMasterData + `marketMaster/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
                scSchemeDetailsId: "",
                scSubSchemeDetailsId: "",
                componentType: "",
                scComponentId: "",
                schemeQuotaId:"",
                scCategoryId: "",
                scHeadAccountId: "",
                shareInPer: "",
                unitCost: "",
                fullPrice: "",
                minStyle: "",
                maxStyle: "",
                measurementType: "",
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
        scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    componentType: "",
    scComponentId: "",
    schemeQuotaId:"",
    scCategoryId: "",
    scHeadAccountId: "",
    shareInPer: "",
    unitCost: "",
    fullPrice: "",
    minStyle: "",
    maxStyle: "",
    measurementType: "",

    });
  };

  // to get get Scheme
  const [schemeListData, setSchemeListData] = useState([]);

  const getSchemeList = () => {
    const response = api
      .get(baseURLMasterData + `scSchemeDetails/get-all`)
      .then((response) => {
        setSchemeListData(response.data.content.ScSchemeDetails);
      })
      .catch((err) => {
        setSchemeListData([]);
      });
  };

  useEffect(() => {
    getSchemeList();
  }, []);

  // to get Sub Scheme
  const [subSchemeListData, setSubSchemeListData] = useState([]);

  const getSubSchemeList = () => {
    const response = api
      .get(baseURLMasterData + `scSubSchemeDetails/get-all`)
      .then((response) => {
        setSubSchemeListData(response.data.content.scSubSchemeDetails);
      })
      .catch((err) => {
        setSubSchemeListData([]);
      });
  };

  useEffect(() => {
    getSubSchemeList();
  }, []);

   // to get Scheme Quota
   const [schemeQuotaListData, setSchemeQuotaListData] = useState([]);

   const getSchemeQuotaList = () => {
     const response = api
       .get(baseURLMasterData + `schemeQuota/get-all`)
       .then((response) => {
        setSchemeQuotaListData(response.data.content.schemeQuota);
       })
       .catch((err) => {
        setSchemeQuotaListData([]);
       });
   };
 
   useEffect(() => {
    getSchemeQuotaList();
   }, []);

   // to get Component
   const [scComponentListData, setScComponentListData] = useState([]);

   const getScComponentList = () => {
      api
       .get(baseURLMasterData + `scComponent/get-all`)
       .then((response) => {
        setScComponentListData(response.data.content.scComponent);
       })
       .catch((err) => {
        setScComponentListData([]);
       });
   };
 
   useEffect(() => {
    getScComponentList();
   }, []);

   // get head of Account Id
   const [scHeadAccountListData, setScHeadAccountListData] = useState([]);
   const getHeadAccountList = () => {
     api
     .get(baseURLMasterData + `scHeadAccount/get-all`)
     .then((response) => {
       if (response.data.content.scHeadAccount) {
        setScHeadAccountListData(response.data.content.scHeadAccount);
       }
     })
     .catch((err) => {
        setScHeadAccountListData([]);
       // alert(err.response.data.errorMessages[0].message[0].message);
     });
 };

 useEffect(() => {
    getHeadAccountList();
 }, []);

   // get category list
  const [scCategoryListData, setScCategoryListData] = useState([]);
  const getCategoryList = () => {
    api
      .get(baseURLMasterData + `scCategory/get-all`)
      .then((response) => {
        if (response.data.content.scCategory) {
          setScCategoryListData(response.data.content.scCategory);
        }
      })
      .catch((err) => {
        setScCategoryListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getCategoryList();
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
    <Layout title="Market">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Market</Block.Title>
            {/* <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Market
                </li>
              </ol>
            </nav> */}
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/market-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/market-list"
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
                      Select Scheme
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="scSchemeDetailsId"
                        value={data.scSchemeDetailsId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.scSchemeDetailsId === undefined ||
                          data.scSchemeDetailsId === "0"
                        }
                      >
                        <option value="">Select Scheme</option>
                        {schemeListData &&
                          schemeListData.map((list) => (
                            <option
                              key={list.scSchemeDetailsId}
                              value={list.scSchemeDetailsId}
                            >
                              {list.schemeName}
                            </option>
                          ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Scheme is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Select Sub Scheme
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="scSubSchemeDetailsId"
                        value={data.scSubSchemeDetailsId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.scSubSchemeDetailsId === undefined ||
                          data.scSubSchemeDetailsId === "0"
                        }
                      >
                        <option value="">Select Sub Scheme</option>
                        {subSchemeListData &&
                          subSchemeListData.map((list) => (
                            <option
                              key={list.scSubSchemeDetailsId}
                              value={list.scSubSchemeDetailsId}
                            >
                              {list.subSchemeName}
                            </option>
                          ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Sub Scheme is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Scheme Quota
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="schemeQuotaId"
                        value={data.schemeQuotaId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.schemeQuotaId === undefined ||
                          data.schemeQuotaId === "0"
                        }
                      >
                        <option value="">Select Scheme Quota</option>
                        {schemeQuotaListData &&
                            schemeQuotaListData.map((list) => (
                            <option
                              key={list.schemeQuotaId}
                              value={list.schemeQuotaId}
                            >
                              {list.schemeQuotaName}
                            </option>
                          ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Scheme Quota is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Component
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="scComponentId"
                        value={data.scComponentId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.scComponentId === undefined ||
                          data.scComponentId === "0"
                        }
                      >
                        <option value="">Select Component</option>
                        {scComponentListData &&
                            scComponentListData.map((list) => (
                            <option
                              key={list.scComponentId}
                              value={list.scComponentId}
                            >
                              {list.scComponentName}
                            </option>
                          ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Component is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      Category
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="scCategoryId"
                        value={data.scCategoryId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        // multiple
                        // required
                        isInvalid={
                          data.scCategoryId === undefined ||
                          data.scCategoryId === "0"
                        }
                      >
                        <option value="">Select Category</option>
                        {scCategoryListData.map((list) => (
                          <option
                            key={list.scCategoryId}
                            value={list.scCategoryId}
                          >
                            {list.codeNumber}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Category is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      Head Of Account
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="scHeadAccountId"
                        value={data.scHeadAccountId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        // multiple
                        // required
                        isInvalid={
                          data.scHeadAccountId === undefined ||
                          data.scHeadAccountId === "0"
                        }
                      >
                        <option value="">Select Head Of Account</option>
                        {scHeadAccountListData.map((list) => (
                          <option
                            key={list.scHeadAccountId}
                            value={list.scHeadAccountId}
                          >
                            {list.scHeadAccountName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                      Head Of Account is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="bidstart">
                            Share in %
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="shareInPer"
                              name="shareInPer"
                              value={data.shareInPer}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter Share in %"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                            Share in % is required
                            </Form.Control.Feedback>
                           
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="bidend">
                            Unit Cost
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="unitCost"
                              name="unitCost"
                              value={data.unitCost}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter  Unit Cost"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                            Unit Cost is required
                            </Form.Control.Feedback>
                            
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="bidstart">
                            Full Price
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="fullPrice"
                              name="fullPrice"
                              value={data.fullPrice}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter Full Price"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                            Full Price is required
                            </Form.Control.Feedback>
                            
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="bidend">
                            Min Style
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="minSty"
                              name="minSty"
                              value={data.minSty}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter Min Style"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                            Min Style is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="secbidstart">
                           Max Style
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="maxSty"
                              name="maxSty"
                              value={data.maxSty}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter Max Style"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                            Max Style is required
                            </Form.Control.Feedback>
                            
                          </div>
                        </Form.Group>
                      </Col>
                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Measurement Type
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="measurementType"
                        value={data.measurementType}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.measurementType === undefined ||
                          data.measurementType === "0"
                        }
                      >
                        <option value="">Select Measurement Type</option>
                        <option value="1">SQFT</option>
                        <option value="2">QTY</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Financial Year is required
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

export default MapComponent;
