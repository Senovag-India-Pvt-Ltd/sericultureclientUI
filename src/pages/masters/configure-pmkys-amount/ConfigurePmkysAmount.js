import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ConfigurePmkysAmount() {
  const [data, setData] = useState({
    spacingId: "",
    hectareId: "",
    amount: "",
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
        .post(baseURL + `configurePmkysAmount/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
            spacingId: "",
            hectareId: "",
            amount: "",
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

  const clear = () => {
    setData({
    spacingId: "",
    hectareId: "",
    amount: "",
    });
  };

  const [loading, setLoading] = useState(false);



  // to get spacing details
  const [spacingListData, setSpacingDetailsListData] = useState([]);

  const getSpacingList = () => {
    api
      .get(baseURL + `spacingMaster/get-all`)
      .then((response) => {
        setSpacingDetailsListData(response.data.content.spacingMaster);
      })
      .catch((err) => {
        setSpacingDetailsListData([]);
      });
  };

  useEffect(() => {
    getSpacingList();
  }, []);

  // to get hectare-details
  const [hectareListData, setHectareListData] = useState([]);

  const getHectareList = () => {
    api
      .get(baseURL + `hectareMaster/get-all`)
      .then((response) => {
        setHectareListData(response.data.content.hectareMaster);
      })
      .catch((err) => {
        setHectareListData([]);
      });
  };

  useEffect(() => {
    getHectareList();
  }, []);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("#");
    });
  };
  const saveError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: message,
    });
  };
  return (
    <Layout title="Configure Amount">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Configure Amount</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/configure-pmkys-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/configure-pmkys-list"
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
                    <Form.Group className="form-group mt-n3">
                    <Form.Label htmlFor="spacing">
                        Spacing<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                        <Form.Select
                        name="spacingId"
                        value={data.spacingId}
                        onChange={handleInputs}
                        required
                        isInvalid={
                            data.spacingId === undefined ||
                            data.spacingId === "0"
                        }
                        >
                        <option value="">Select Spacing</option>
                        {spacingListData && spacingListData.length > 0
                            ? spacingListData.map((list) => (
                                <option
                                key={list.spacingId}
                                value={list.spacingId}
                                >
                                {list.spacingName}
                                </option>
                            ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                    Spacing is required
                    </Form.Control.Feedback>
                    </div>
                    </Form.Group>
                </Col>

                <Col lg="6">
                    <Form.Group className="form-group mt-n3">
                    <Form.Label htmlFor="hectare">
                        Hectare<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                        <Form.Select
                        name="hectareId"
                        value={data.hectareId}
                        onChange={handleInputs}
                        required
                        isInvalid={
                            data.hectareId === undefined ||
                            data.hectareId === "0"
                        }
                        >
                        <option value="">Select Hectare</option>
                        {hectareListData && hectareListData.length > 0
                            ? hectareListData.map((list) => (
                                <option
                                key={list.hectareId}
                                value={list.hectareId}
                                >
                                {list.hectareName}
                                </option>
                            ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                    Hectare is required
                    </Form.Control.Feedback>
                    </div>
                    </Form.Group>
                </Col>

                <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        Amount
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="amount"
                          name="amount"
                          type="text"
                          value={data.amount}
                          onChange={handleInputs}
                          placeholder="Enter Amount"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Amount is required
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

export default ConfigurePmkysAmount;
