import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import axios from "axios";
import api from "../../services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ReceiptofDFLsfromtheP4grainage() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
    },
    actiongreentstyle: {
      backgroundColor: "#03d300",
      color: "#fff",
    },
    actionredtstyle: {
      backgroundColor: "#ff0000",
      color: "#fff",
    },
  };

  // Virtual Bank Account
  const [vbAccountList, setVbAccountList] = useState([]);
  const [vbAccount, setVbAccount] = useState({
    virtualAccountNumber: "",
    branchName: "",
    ifscCode: "",
    marketMasterId: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAdd = () => {
    setVbAccountList((prev) => [...prev, vbAccount]);
    setVbAccount({
      virtualAccountNumber: "",
      branchName: "",
      ifscCode: "",
      marketMasterId: "",
    });
    setShowModal(false);
  };

  const handleDelete = (i) => {
    setVbAccountList((prev) => {
      const newArray = prev.filter((item, place) => place !== i);
      return newArray;
    });
  };

  const [vbId, setVbId] = useState();
  const handleGet = (i) => {
    setVbAccount(vbAccountList[i]);
    setShowModal2(true);
    setVbId(i);
  };

  const handleUpdate = (i, changes) => {
    setVbAccountList((prev) =>
      prev.map((item, ix) => {
        if (ix === i) {
          return { ...item, ...changes };
        }
        return item;
      })
    );
    setShowModal2(false);
    setVbAccount({
      virtualAccountNumber: "",
      branchName: "",
      ifscCode: "",
      marketMasterId: "",
    });
  };

  const [validated, setValidated] = useState(false);

  const handleVbInputs = (e) => {
    const { name, value } = e.target;
    setVbAccount({ ...vbAccount, [name]: value });
  };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const [data, setData] = useState({
    lineNumber: "",
    lineNameId: "",
    laidOnDate: "",
    lotNumber: "",
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const clear = () => {
    setData({
      lineNumber: "",
      lineNameId: "",
      laidOnDate: "",
      lotNumber: "",
    });
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
        .post(baseURL2 + `Mulberry-garden/add-info`, data)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({
              plotNumber: "",
              variety: "",
              areaUnderEachVariety: "",
              pruningDate: "",
              fertilizerApplicationDate: "",
              fymApplicationDate: "",
              irrigationDate: "",
              brushingDate: "",
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

  // to get Caste
  const [casteListData, setCasteListData] = useState([]);

  const getCasteList = () => {
    axios
      .get(baseURL2 + `caste/get-all`)
      .then((response) => {
        setCasteListData(response.data.content.caste);
      })
      .catch((err) => {
        setCasteListData([]);
      });
  };

  useEffect(() => {
    getCasteList();
  }, []);

  // to get Education
  const [educationListData, setEducationListData] = useState([]);

  const getEducationList = () => {
    axios
      .get(baseURL2 + `education/get-all`)
      .then((response) => {
        setEducationListData(response.data.content.education);
      })
      .catch((err) => {
        setEducationListData([]);
      });
  };

  useEffect(() => {
    getEducationList();
  }, []);

  // to get Machine Type
  const [machineTypeListData, setMachineTypeListData] = useState([]);

  const getMachineTypeList = () => {
    axios
      .get(baseURL2 + `machine-type-master/get-all`)
      .then((response) => {
        setMachineTypeListData(response.data.content.machineTypeMaster);
      })
      .catch((err) => {
        setMachineTypeListData([]);
      });
  };

  useEffect(() => {
    getMachineTypeList();
  }, []);

  // to get Market
  const [marketMasterListData, setMarketMasterListData] = useState([]);

  const getMarketMasterList = () => {
    axios
      .get(baseURL2 + `marketMaster/get-all`)
      .then((response) => {
        setMarketMasterListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketMasterListData([]);
      });
  };

  useEffect(() => {
    getMarketMasterList();
  }, []);

  // to get State
  const [stateListData, setStateListData] = useState([]);

  const getList = () => {
    axios
      .get(baseURL2 + `state/get-all`)
      .then((response) => {
        setStateListData(response.data.content.state);
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
    axios
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
    if (data.stateId) {
      getDistrictList(data.stateId);
    }
  }, [data.stateId]);

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    axios
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
    if (data.districtId) {
      getTalukList(data.districtId);
    }
  }, [data.districtId]);

  // to get hobli
  const [hobliListData, setHobliListData] = useState([]);

  const getHobliList = (_id) => {
    axios
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
    if (data.talukId) {
      getHobliList(data.talukId);
    }
  }, [data.talukId]);

  // to get Village
  const [villageListData, setVillageListData] = useState([]);

  const getVillageList = (_id) => {
    axios
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
    if (data.hobliId) {
      getVillageList(data.hobliId);
    }
  }, [data.hobliId]);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("/seriui/reeler-license-list"));
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };

  // Handle Options
  // Market
  const handleMarketOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setVbAccount({
      ...vbAccount,
      stateId: chooseId,
      stateName: chooseName,
    });
  };

  // to get Race
  const [lineDetailsListData, setDetailsListData] = useState([]);

  const getLineDetailsList = () => {
    const response = api
      .get(baseURL2 + `lineNameMaster/get-all`)
      .then((response) => {
        setDetailsListData(response.data.content.lineNameMaster);
      })
      .catch((err) => {
        setDetailsListData([]);
      });
  };

  useEffect(() => {
    getLineDetailsList();
  }, []);

  return (
    <Layout title="Receipt of DFLs from the P4 grainage">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Receipt of DFLs from the P4 grainage
            </Block.Title>
            {/* <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Receipt of DFLs from the P4 grainage
                </li>
              </ol>
            </nav> */}
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Receipt-of-DFLs-from-the-P4-grainage-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Receipt-of-DFLs-from-the-P4-grainage-list"
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

      <Block className="mt-4">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <div>
              <Row className="g-gs">
                <Col lg="12">
                  <Block>
                    <Card>
                      <Card.Header>
                        Receipt of DFLs from the P4 grainage{" "}
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Lot Number<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  type="text"
                                  placeholder="Lot  Number"
                                />
                                <Form.Control.Feedback type="invalid">
                                  Lot Number is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group  ">
                              <Form.Label>
                                Line of DFLs
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="lineNameId"
                                  value={data.lineNameId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs}
                                  // multiple
                                  required
                                  isInvalid={
                                    data.lineNameId === undefined ||
                                    data.lineNameId === "0"
                                  }
                                >
                                  <option value="">Select Line Name</option>
                                  {lineDetailsListData.map((list) => (
                                    <option
                                      key={list.lineNameId}
                                      value={list.lineNameId}
                                    >
                                      {list.lineName}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Line Name is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Laid on Date
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.pruningDate}
                                  onChange={(date) =>
                                    handleDateChange(date, "pruningDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  maxDate={new Date()}
                                  dropdownMode="select"
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  required
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Line Number/Year
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  type="text"
                                  placeholder="Line Number/Year"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Number of DFLs received
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  type="text"
                                  placeholder="Number of DFLs received"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Invoice no. and Date
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.pruningDate}
                                  onChange={(date) =>
                                    handleDateChange(date, "pruningDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  maxDate={new Date()}
                                  dropdownMode="select"
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  required
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group  ">
                              <Form.Label>
                                Worm test details and result
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="gender"
                                  value={data.gender}
                                  onChange={handleInputs}
                                >
                                  <option value="">
                                    Worms Stage (Dropdown){" "}
                                  </option>
                                  <option value="1">2nd</option>
                                  <option value="2">3rd</option>
                                  <option value="3"> 4th </option>
                                  <option value="">5th</option>
                                  <option value="1">6th</option>
                                  <option value="2">7th</option>
                                  <option value="3"> 8th</option>
                                  <option value="">Litter</option>
                                  <option value="1">Ripen</option>
                                  <option value="2">Dust</option>
                                </Form.Select>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group  ">
                              <Form.Label>Generation details</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="gender"
                                  value={data.gender}
                                  onChange={handleInputs}
                                >
                                  <option value="">1st </option>
                                  <option value="1">2nd</option>
                                  <option value="2">3rd</option>
                                  <option value="3"> 4th </option>
                                  <option value="">5th</option>
                                  <option value="1">6th</option>
                                  <option value="2">7th</option>
                                  <option value="3"> 8th</option>
                                  <option value="">9th</option>
                                  <option value="1">10th</option>
                                  <option value="2">11th</option>
                                  <option value="3">12th</option>
                                </Form.Select>
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                    {/* <Col lg="12" className="text-center mt-1">
                      <Button type="submit" variant="primary">
                        {" "}
                        Submit{" "}
                      </Button>
                    </Col> */}
                    <div className="gap-col">
                      <ul className="mt-1 d-flex align-items-center justify-content-center gap g-3">
                        <li>
                          {/* <Button type="button" variant="primary" onClick={postData}> */}
                          <Button type="submit" variant="primary">
                            Save
                          </Button>
                        </li>
                        <li>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={clear}
                          >
                            Cancel
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </Block>
                </Col>
                {/* <Col lg="12">
                  <Card>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="12">
                          <div className="table-responsive">
                            <table className="table small table-bordered">
                              <thead>
                                <tr>
                                  <th style={styles.ctstyle}>
                                    Line Number/Year
                                  </th>
                                  <th style={styles.ctstyle}>Line of DFLs</th>
                                  <th style={styles.ctstyle}>Laid on Date</th>
                                  <th style={styles.ctstyle}>Lot Number</th>
                                  <th style={styles.ctstyle}>
                                    Number of DFLs received
                                  </th>
                                  <th style={styles.ctstyle}>
                                    Invoice no. and Date
                                  </th>
                                  <th style={styles.ctstyle}>
                                    Worm test details and result
                                  </th>
                                  <th style={styles.ctstyle}>
                                    Generation details
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Line Number/Year data</td>
                                  <td>Line of DFLs data</td>
                                  <td>Laid on Date data</td>
                                  <td>Lot Number data</td>
                                  <td>Number of DFLs received data</td>
                                  <td>Invoice no. and Date data</td>
                                  <td>Worm test details and result date</td>
                                  <td>Generation details data</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Modal show={showModal} onHide={handleCloseModal} size="xl">
                    <Modal.Header closeButton>
                      <Modal.Title>
                        {" "}
                        Status of Receipt of DFLs from the grainage
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form action="#">
                        <Row className="g-5 px-5">
                          <div className="table-responsive">
                            <table className="table small table-bordered">
                              <thead>
                                <tr>
                                  <th style={styles.ctstyle}>Grainage Name</th>
                                  <th style={styles.ctstyle}>
                                    Number of DFLs received
                                  </th>
                                  <th style={styles.ctstyle}>Line Name</th>
                                  <th style={styles.ctstyle}>Lot Number</th>
                                  <th style={styles.ctstyle}>Invoice no</th>
                                  <th style={styles.ctstyle}>Invoice Date</th>
                                  <th style={styles.ctstyle}>
                                    Status (Recived)
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Grainage Name data</td>
                                  <td>Number of DFLs received data</td>
                                  <td>Line Name data</td>
                                  <td>Lot Number data</td>
                                  <td>Invoice no data</td>
                                  <td>Invoice Date data</td>
                                  <td style={styles.actionredtstyle}>Reject</td>
                                </tr>
                                <tr>
                                  <td>Grainage Name data</td>
                                  <td>Number of DFLs received data</td>
                                  <td>Line Name data</td>
                                  <td>Lot Number data</td>
                                  <td>Invoice no data</td>
                                  <td>Invoice Date data</td>
                                  <td style={styles.actiongreentstyle}>
                                    Accept
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </Row>
                      </Form>
                    </Modal.Body>
                  </Modal>
                </Col> */}
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default ReceiptofDFLsfromtheP4grainage;
