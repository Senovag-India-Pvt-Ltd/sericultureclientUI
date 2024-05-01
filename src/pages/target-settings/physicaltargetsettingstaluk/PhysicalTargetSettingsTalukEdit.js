import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function PhysicalTargetSettingsTalukEdit() {
  // Fetching id from URL params
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  let name, value;

  // Function to handle input changes
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  // Function to submit form data
  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURLTargetSetting + `tsPhysicalTaluk/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
              financialYearMasterId: "",
              scSchemeDetailsId: "",
              scSubSchemeDetailsId: "",
              districtId: "",
              talukId: "",
              date: "",
              reportingOfficerId: "",
              implementingOfficerId:"",
              tsActivityMasterId:"",
              unitMeasurementId: "9",
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

  // Function to clear form data
  const clear = () => {
    setData({
      financialYearMasterId: "",
      scSchemeDetailsId: "",
      scSubSchemeDetailsId: "",
      districtId: "",
      talukId: "",
      date: "",
      reportingOfficerId: "",
      implementingOfficerId:"",
      tsActivityMasterId:"",
      unitMeasurementId: "9",
    });
  };


  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLTargetSetting + `tsPhysicalTaluk/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        let message = "An error occurred while fetching data.";

        // Check if err.response is defined and not null
        if (err.response && err.response.data) {
          // Check if err.response.data.errorMessages is an array and has length > 0
          if (
            Array.isArray(err.response.data.errorMessages) &&
            err.response.data.errorMessages.length > 0
          ) {
          }
        }

        // Display error message
        // editError(message);
        setData({});
        setLoading(false);
      });
  };

  // Fetch data on component mount
  useEffect(() => {
    getIdList();
  }, [id]);

  // to get Financial Year
const [financialyearListData, setFinancialyearListData] = useState([]);

const getList = () => {
  api
    .get(baseURLMasterData + `financialYearMaster/get-all`)
    .then((response) => {
      setFinancialyearListData(response.data.content.financialYearMaster);
    })
    .catch((err) => {
      setFinancialyearListData([]);
    });
};

useEffect(() => {
  getList();
}, []);

  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    const response = api
      .get(baseURLMasterData + `district/get-all`)
      .then((response) => {
        if (response.data.content.district) {
          setDistrictListData(response.data.content.district);
        }
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getDistrictList();
  }, []);

  // to get district
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = () => {
    const response = api
      .get(baseURLMasterData + `taluk/get-all`)
      .then((response) => {
        if (response.data.content.taluk) {
          setTalukListData(response.data.content.taluk);
        }
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getTalukList();
  }, []);

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

    // to get Sub Scheme
    const [userListData, setUserListData] = useState([]);

    const getUserList = () => {
      const response = api
        .get(baseURLMasterData + `userMaster/get-all`)
        .then((response) => {
          setUserListData(response.data.content.userMaster);
        })
        .catch((err) => {
          setUserListData([]);
        });
    };
  
    useEffect(() => {
      getUserList();
    }, []);

    // to get Sub Scheme
    const [activityListData, setActivityListData] = useState([]);

    const getActivityList = () => {
      const response = api
        .get(baseURLMasterData + `tsActivityMaster/get-all`)
        .then((response) => {
          setActivityListData(response.data.content.tsActivityMaster);
        })
        .catch((err) => {
          setActivityListData([]);
        });
    };
  
    useEffect(() => {
      getActivityList();
    }, []);

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // Function to handle success alert
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
    });
  };

  // Function to handle error alert
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

  return (
    <Layout title="Edit Taluk Physical Target Settings">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Edit Taluk Physical Target Settings
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/physicaltargetsettingstaluk-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/physicaltargetsettingstaluk-list"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Header style={{ fontWeight: "bold" }}>
                Taluk Physical Target Settings
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
                  <Row className="g-gs">
                  <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              Financial Year
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="financialYearMasterId"
                                value={data.financialYearMasterId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.financialYearMasterId === undefined ||
                                  data.financialYearMasterId === "0"
                                }
                              >
                                <option value="">Select Year</option>
                                {financialyearListData.map((list) => (
                                  <option
                                    key={list.financialYearMasterId}
                                    value={list.financialYearMasterId}
                                  >
                                    {list.financialYear}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Financial Year is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

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
                            {schemeListData && schemeListData.map((list) => (
                              <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>
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
                            {subSchemeListData && subSchemeListData.map((list) => (
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
                              Select District
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="districtId"
                                value={data.districtId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.districtId === undefined ||
                                  data.districtId === "0"
                                }
                              >
                                <option value="">Select District</option>
                                {districtListData.map((list) => (
                                  <option
                                    key={list.districtId}
                                    value={list.districtId}
                                  >
                                    {list.districtName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                District is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              Taluk
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="talukId"
                                value={data.talukId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.talukId === undefined ||
                                  data.talukId === "0"
                                }
                              >
                                <option value="">Select Taluk</option>
                                {talukListData.map((list) => (
                                  <option
                                    key={list.talukId}
                                    value={list.talukId}
                                  >
                                    {list.talukName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Taluk is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>


                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              Reporting Officer DDO
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="reportingOfficerId"
                                value={data.reportingOfficerId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.reportingOfficerId === undefined ||
                                  data.reportingOfficerId === "0"
                                }
                              >
                                <option value="">Select Reporting Officer DDO</option>
                                {userListData.map((list) => (
                                  <option
                                    key={list.userMasterId}
                                    value={list.userMasterId}
                                  >
                                    {list.username}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                              Reporting Officer DDO is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                          <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                Implementing Officer DDO
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="implementingOfficerId"
                                value={data.implementingOfficerId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.implementingOfficerId === undefined ||
                                  data.implementingOfficerId === "0"
                                }
                              >
                                <option value="">Select  Implementing Officer DDO</option>
                                {userListData.map((list) => (
                                  <option
                                    key={list.userMasterId}
                                    value={list.userMasterId}
                                  >
                                    {list.username}
                                  </option>
                                ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Officer DDO is required.
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                Activity
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="tsActivityMasterId"
                                value={data.tsActivityMasterId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.tsActivityMasterId === undefined ||
                                  data.tsActivityMasterId === "0"
                                }
                              >
                                <option value="">Select  Activity</option>
                                {activityListData.map((list) => (
                                  <option
                                    key={list.tsActivityMasterId}
                                    value={list.tsActivityMasterId}
                                  >
                                    {list.name}
                                  </option>
                                ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Activity is required.
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                Unit Of Measurement
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="unitMeasurementId"
                                value={data.unitMeasurementId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // required
                                isInvalid={
                                  data.unitMeasurementId === undefined ||
                                  data.unitMeasurementId === "0"
                                }
                              >
                                <option value="">Select  Unit Of Measurement</option>
                                {/* {activityListData.map((list) => (
                                  <option
                                    key={list.tsActivityMasterId}
                                    value={list.tsActivityMasterId}
                                  >
                                    {list.tsActivityMasterName}
                                  </option>
                                ))} */}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Unit Of Measurement is required.
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl"> Date</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.date
                              ? new Date(data.date)
                              : null}
                            onChange={(date) => handleDateChange(date, "date")}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            required
                          />
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

export default PhysicalTargetSettingsTalukEdit;
