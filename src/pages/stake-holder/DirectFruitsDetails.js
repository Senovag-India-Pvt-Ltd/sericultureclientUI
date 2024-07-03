import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../components";

import api from "../../../src/services/auth/api";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;
const baseURLDirectFarmer =
  process.env.REACT_APP_API_BASE_URL_REGISTRATION_DIRECT_FRUITS;

function DirectFruitsDetails() {
  const [data, setData] = useState({
    farmerName: "",
    fatherName: "",
    fruitsId: "",
    farmerId: "",
  });

  const [responseData,setResponseData] = useState({})

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "20%",
    },
  };

  const [validated, setValidated] = useState(false);
  const [searchValidated, setSearchValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "farmerId" && (value.length < 16 || value.length > 16)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "farmerId" && value.length === 16) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
  };

  const _header = {
    Accept: "*/*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJnb2Rvd25JZCI6MzcsInBob25lTnVtYmVyIjoiNjM2NjEyNTg2OSIsInJvbGVJZCI6MSwidXNlclR5cGUiOjAsInVzZXJNYXN0ZXJJZCI6MTQ4LCJ1c2VybmFtZSI6Ik9wc21hbiIsIm1hcmtldElkIjozNCwic3ViIjoiT3BzbWFuIiwiaWF0IjoxNzE5ODIzOTkwLCJleHAiOjE3MjA0MjM5OTB9.gJIeZzUMAajzLc4IXbG5F73ri2eo7XHEICb9BSPP0mI`,
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      if (data.farmerId.length < 16 || data.farmerId.length > 16) {
        return;
      }
      axios
        .post(baseURL + `fuits-api/get-farmer-by-fid`, data, _header)
        .then((response) => {
          // debugger;
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.receiptNo);
            setData({
              farmerName: "",
              fatherName: "",
              fruitsId: "",
              farmerId: "",
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
    farmerName: "",
    fatherName: "",
    fruitsId: "",
    farmerId: "",
    });
  };

  const search = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setSearchValidated(true);
    } else {
      event.preventDefault();
      if (data.farmerId.length < 16 || data.farmerId.length > 16) {
        return;
      }

      api
        .post(
          baseURLFarmer +
            `fuits-api/get-farmer-by-fid`,
          { farmerId: data.farmerId }
        )
        // .post(
        //   `https://e-reshme.karnataka.gov.in/farmer-registration/fuits-api/get-farmer-by-fid`,
        //   { farmerId: data.farmerId },
        //   { headers: _header }
        // )
        .then((response) => {
          setResponseData(response.data)
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        });
    }
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
    const response = api
      .get(baseURL2 + `raceMaster/get-all`)
      .then((response) => {
        setRaceListData(response.data.content.raceMaster);
      })
      .catch((err) => {
        setRaceListData([]);
      });
  };

  useEffect(() => {
    getRaceList();
  }, []);

  // to get User
  const [chawkiListData, setChawkiListData] = useState([]);

  const getChawkiList = () => {
    const response = api
      .get(baseURL2 + `tscMaster/get-all`)
      .then((response) => {
        setChawkiListData(response.data.content.tscMaster);
      })
      .catch((err) => {
        setChawkiListData([]);
      });
  };

  useEffect(() => {
    getChawkiList();
  }, []);

  // to get State
  const [stateListData, setStateListData] = useState([]);

  const getStateList = () => {
    api
      .get(baseURL2 + `state/get-all`)
      .then((response) => {
        setStateListData(response.data.content.state);
      })
      .catch((err) => {
        setStateListData([]);
      });
  };

  useEffect(() => {
    getStateList();
  }, []);

  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = (_id) => {
    api
      .get(baseURL2 + `district/get-by-state-id/${_id}`)
      .then((response) => {
        setDistrictListData(response.data.content.district);
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.state) {
      getDistrictList(data.state);
    }
  }, [data.state]);

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    api
      .get(baseURL2 + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        setTalukListData(response.data.content.taluk);
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.district) {
      getTalukList(data.district);
    }
  }, [data.district]);

  // to get hobli
  const [hobliListData, setHobliListData] = useState([]);

  const getHobliList = (_id) => {
    api
      .get(baseURL2 + `hobli/get-by-taluk-id/${_id}`)
      .then((response) => {
        setHobliListData(response.data.content.hobli);
      })
      .catch((err) => {
        setHobliListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.taluk) {
      getHobliList(data.taluk);
    }
  }, [data.taluk]);

  // to get Village
  const [villageListData, setVillageListData] = useState([]);

  const getVillageList = (_id) => {
    api
      .get(baseURL2 + `village/get-by-hobli-id/${_id}`)
      .then((response) => {
        setVillageListData(response.data.content.village);
      })
      .catch((err) => {
        setVillageListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.hobli) {
      getVillageList(data.hobli);
    }
  }, [data.hobli]);

  // const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: `Receipt Number ${message}`,
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
    <Layout title="Direct From Fruits">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Direct From Fruits</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            {/* <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/chawki-management-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/chawki-management-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul> */}
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        {/* <Form action="#"> */}
        <Form noValidate validated={searchValidated} onSubmit={search}>
          <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="12">
                  <Form.Group as={Row} className="form-group" controlId="fid">
                    <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                      FRUITS ID<span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={4}>
                      <Form.Control
                        type="farmerId"
                        name="farmerId"
                        value={data.farmerId}
                        onChange={handleInputs}
                        placeholder="Enter FRUITS ID"
                        required
                        maxLength="16"
                      />
                      <Form.Control.Feedback type="invalid">
                        Fruits ID Should Contain 16 digits
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={2}>
                      <Button type="submit" variant="primary">
                        Search
                      </Button>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1 ">
            <Block className="mt-3">
              <Card>
                <Card.Header>Fruits Response</Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group">
                        {/* <Form.Label htmlFor="sordfl">
                          Father’s Name
                          <span className="text-danger">*</span>
                        </Form.Label> */}
                        <div className="form-control-wrap">
                          <Form.Control
                            id="fatherName"
                            name="fatherName"
                            value={JSON.stringify(responseData, null, 2)}
                            // onChange={handleInputs}
                            as="textarea"
                            rows={20}
                            placeholder="Data will be fetched from FRUITS"
                            readOnly
                            // required
                          />
                          <Form.Control.Feedback type="invalid">
                            Father Name is required
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

export default DirectFruitsDetails;
