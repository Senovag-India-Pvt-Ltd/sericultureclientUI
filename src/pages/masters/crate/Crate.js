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

function Crate() {
  const [data, setData] = useState({
    raceMasterId: "",
    marketId: "",
    godownId: "",
    approxWeightPerCrate: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    // Convert value to integer if it represents a numeric value
    // const intValue = /^\d+$/.test(value) ? parseInt(value, 10) : value;

    // setData({ ...data, [name]: intValue });
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
        .post(baseURL + `crateMaster/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
              raceMasterId: "",
              marketId: "",
              godownId: "",
              approxWeightPerCrate: "",
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
      raceMasterId: "",
      marketId: "",
      godownId: "",
      approxWeightPerCrate: "",
    });
  };

  const [loading, setLoading] = useState(false);

  // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = () => {
    const response = api
      .get(baseURL + `marketMaster/get-all`)
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketListData([]);
      });
  };

  useEffect(() => {
    getMarketList();
  }, []);

  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = (_id) => {
    const response = api
      .get(baseURL + `raceMaster/get-by-market-master-id/${_id}`)
      .then((response) => {
        setRaceListData(response.data.content.raceMaster);
        setLoading(false);
        if (response.data.content.error) {
          setRaceListData([]);
        }
      })
      .catch((err) => {
        setRaceListData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (data.marketId) {
      getRaceList(data.marketId);
    }
  }, [data.marketId]);

  // // to get Godown
  // const [godownListData, setGodownListData] = useState([]);
  // const getGodownList = (_id) => {
  //   const response = api
  //     .get(baseURL + `godown/get-by-market-master-id/${_id}`)
  //     .then((response) => {
  //       setGodownListData(response.data.content.godown);
  //       // setTotalRows(response.data.content.totalItems);
  //       setLoading(false);
  //       if (response.data.content.error) {
  //         setGodownListData([]);
  //       }
  //     })
  //     .catch((err) => {
  //       setGodownListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   if (data.marketId) {
  //     getGodownList(data.marketId);
  //   }
  // }, [data.marketId]);

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
    <Layout title="Crate">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Crate</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/crate-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/crate-list"
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
                        Market<span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="marketId"
                            value={data.marketId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.marketId === undefined ||
                              data.marketId === "0"
                            }
                          >
                            <option value="">Select Market</option>
                            {marketListData.map((list) => (
                              <option
                                key={list.marketMasterId}
                                value={list.marketMasterId}
                              >
                                {list.marketMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Market is required
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        Race<span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="raceMasterId"
                            value={data.raceMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.raceMasterId === undefined ||
                              data.raceMasterId === "0"
                            }
                          >
                            <option value="">Select Race</option>
                            {raceListData.map((list) => (
                              <option
                                key={list.raceMasterId}
                                value={list.raceMasterId}
                              >
                                {list.raceMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Race is required
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  {/* <Col lg="6">
                  <Form.Group
                    className="form-group"
                  >
                    <Form.Label>
                      Godown<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="godownId"
                          value={data.godownId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs} 
                          required
                          isInvalid={data.godownId === undefined || data.godownId === "0"}
                        >
                          <option value="">Select Godown</option>
                          {godownListData.map((list) => (
                            <option
                              key={list.godownId}
                              value={list.godownId}
                            >
                              {list.godownName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        Godown is required
                      </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                  </Col> */}

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="approxWeightPerCrate">
                        Approx Weight Per Crate
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="approxWeightPerCrate"
                          name="approxWeightPerCrate"
                          value={data.approxWeightPerCrate}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Approx Weight Per Crate"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Approx Weight Per Crate is required.
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
                  {/* <Link
                    to="/seriui/crate-list"
                    className="btn btn-secondary border-0"
                  >
                    Cancel
                  </Link> */}
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

export default Crate;
