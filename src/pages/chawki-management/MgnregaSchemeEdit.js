import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import { useParams } from "react-router-dom";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../components";

import api from "../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;


function MgnregaSchemeEdit() {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "8%", // Reduced from 20% to 10%
    },
  };
  

  const [validated, setValidated] = useState(false);
  const [searchValidated, setSearchValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

  };

  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
   
      api
        .post(baseURL + `cropInspection/update-mgnrega-scheme-info`, data)
        .then((response) => {
          // debugger;
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data);
            clear();
            // setData({
            //   farmerId: "",
            //     disinfectantMasterId: "",
            //     invoiceNoDate: "",
            //     quantity: "",
            //     disinfectantName: "",
            //     quantitySupplied: "",
            //     suppliedDate: "",
            //     : "",
            //     numbersOfDfls: "",
            // });
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
        acresPlanted: "",
      spacingFollwedFeet: "",
    spacingProcuredNos: "",
    spacingFollowed: "",
    spacingProcured: "",
    noOfCuttingPlanted: "",
    noOfSuccessfullSamplings: "",
    });
    
  };

   //   to get data from api
   const getIdList = () => {
    setLoading(true);
    // const chowki_id = chawkiList.chowki_id;
    const response = api
      .get(baseURL + `cropInspection/get-by-mgnrega-scheme-id/${id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        // editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, []);


  
  
  // const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
    //   text: `Receipt Number ${message}`,
    });
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
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Edit MGNREGA Scheme Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit MGNREGA Scheme Details</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/mgnrega-scheme-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/mgnrega-scheme-list"
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

      <Block className="mt-n4">
        {/* <Form action="#"> */}
       
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1 ">
          <Block className="mt-3">
              <Card>
                <Card.Header  style={{ fontSize: '20', padding: '5px' }}>Area Expansion</Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                         Acres Planted
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="acresPlanted"
                            name="acresPlanted"
                            value={data.acresPlanted}
                            onChange={handleInputs}
                            type="text"
                            placeholder=" Enter Acres Planted"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Acres Planted is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        Sapling Followed(In Feet)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="spacingFollwedFeet"
                            name="spacingFollwedFeet"
                            value={data.spacingFollwedFeet}
                            onChange={handleInputs}
                            type="text"
                            placeholder=" Enter Sapling Followed(In Feet)"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Sapling Followed(In Feet) is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Sapling Procured(Nos)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="spacingProcuredNos"
                            name="spacingProcuredNos"
                            value={data.spacingProcuredNos}
                            onChange={handleInputs}
                            type="text"
                            placeholder=" Enter Sapling Procured(Nos)"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Sapling Procured(Nos) is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                   
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mt-3">
                <Card.Header  style={{ fontSize: '20', padding: '5px' }}>Tree Mulberry Plantation 
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        Sapling Followed
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="spacingFollowed"
                            name="spacingFollowed"
                            value={data.spacingFollowed}
                            onChange={handleInputs}
                            type="text"
                            placeholder=" Enter Sapling Followed"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Sapling Followed is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        Sapling Procured
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="spacingProcured"
                            name="spacingProcured"
                            value={data.spacingProcured}
                            onChange={handleInputs}
                            type="text"
                            placeholder=" Enter Sapling Procured"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Sapling Procured is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mt-3">
              <Card.Header style={{ fontSize: '20', padding: '5px' }}>Nursery</Card.Header>

                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        Number of cutting Planted
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="noOfCuttingPlanted"
                            name="noOfCuttingPlanted"
                            value={data.noOfCuttingPlanted}
                            onChange={handleInputs}
                            type="text"
                            placeholder=" Enter Number of cutting Planted"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Number of cutting Planted is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        Number of successful samplings distributed
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="noOfSuccessfullSamplings"
                            name="noOfSuccessfullSamplings"
                            value={data.noOfSuccessfullSamplings}
                            onChange={handleInputs}
                            type="text"
                            placeholder=" Enter Number of successful samplings distributed"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Number of successful samplings distributed is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

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

export default MgnregaSchemeEdit;
