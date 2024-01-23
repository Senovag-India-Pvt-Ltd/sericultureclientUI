import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";

import { Icon } from "../../../components";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function MarketType() {
  const [data, setData] = useState({
    marketTypeMasterName: "",
    reelerFee: "",
    farmerFee: "",
    traderFee: "",
    marketTypeNameInKannada: "",
    
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
      .post(baseURL + `marketTypeMaster/add`, data)
      .then((response) => {
        if(response.data.content.error){
          saveError(response.data.content.error_description);
          }else{
            saveSuccess();
            setData({
              marketTypeMasterName: "",
              reelerFee: "",
              farmerFee: "",
              traderFee: "",
              marketTypeNameInKannada: "",
            });
            setValidated(false);
          }
        })
      .catch((err) => {
        saveError();
      });
      setValidated(true);
    }
  };

  const clear = () =>{
    setData({
      marketTypeMasterName: "",
      reelerFee: "",
      farmerFee: "",
      traderFee: "",
      marketTypeNameInKannada: "",
    })
  }

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
  };

  const saveError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: message,
    });
  };

  return (
    <Layout title="Market Type">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Market Type</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/market-type-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/market-type-list"
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
                      <Form.Label htmlFor="marketTypeMasterName">
                        Market Type<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="marketTypeMasterName"
                          name="marketTypeMasterName"
                          type="text"
                          value={data.marketTypeMasterName}
                          onChange={handleInputs}
                          placeholder="Enter Market Type"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Market Type is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="marketTypeMasterName">
                        Market Type Name In Kannada<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="marketTypeNameInKannada"
                          name="marketTypeNameInKannada"
                          type="text"
                          value={data.marketTypeNameInKannada}
                          onChange={handleInputs}
                          placeholder="Enter Market Type Name in Kannada"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Market Type Name in Kannada is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="reeler">
                        Reeler Fee (in %)<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="reeler"
                          name="reelerFee"
                          type="text"
                          value={data.reelerFee}
                          onChange={handleInputs}
                          placeholder="Enter Reeler Fee"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Reeler Fee is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="farmerFee">
                        Farmer Fee (in %)<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="farmerFee"
                          name="farmerFee"
                          type="text"
                          value={data.farmerFee}
                          onChange={handleInputs}
                          placeholder="Enter Farmer Fee"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Farmer Fee is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="trader">
                        Trader  Fee (in %)<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="traderFee"
                          name="traderFee"
                          type="text"
                          value={data.traderFee}
                          onChange={handleInputs}
                          placeholder="Enter Trader Fee"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Trader Fee is required.
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

export default MarketType;
