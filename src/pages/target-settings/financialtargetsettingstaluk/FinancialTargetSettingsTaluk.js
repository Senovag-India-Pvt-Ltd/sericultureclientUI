import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
// import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function FinancialTargetSettingsTaluk() {
  const [data, setData] = useState({
    financialYearMasterId: "",
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    scCategoryId: "",
    districtId: "",
    talukId: "",
    date: "",
    reportingOfficerId: "",
    implementingOfficerId: "",
    tsActivityMasterId: "",
    amount: "",
    useDisburse: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };
  // const _header = { "Content-Type": "application/json", accept: "*/*" };
  // const _header = { "Content-Type": "application/json", accept: "*/*",  'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`, "Access-Control-Allow-Origin": "*"};
  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  // const postData = (e) => {
  //   axios
  //     .post(baseURLMasterData + `Budget/add`, data, {
  //       headers: _header,
  //     })
  //     .then((response) => {
  //       saveSuccess();
  //     })
  //     .catch((err) => {
  //       setData({});
  //       saveError();
  //     });
  // };

  
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

 // get head of Account Id
 const [scHeadAccountId, setScHeadAccountId] = useState("");
 const getHeadAccountList = (_id) => {
   api
     .get(
       baseURLMasterData + `scHeadAccount/get-by-sc-scheme-details-id/${_id}`
     )
     .then((response) => {
       if (response.data.content.scHeadAccount) {
         // setScHeadAccountListData(response.data.content.scHeadAccount);
         setScHeadAccountId(
           response.data.content.scHeadAccount[0].scHeadAccountId
         );
       }
     })
     .catch((err) => {
       setScHeadAccountId("");
       // alert(err.response.data.errorMessages[0].message[0].message);
     });
 };

 useEffect(() => {
   if (data.scSchemeDetailsId) {
     getHeadAccountList(data.scSchemeDetailsId);
   }
 }, [data.scSchemeDetailsId]);

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

 // get unit of measurement
 const [unitTypeList, setUnitTypeList] = useState([]);
 useEffect(() => {
   if (
     data.scSchemeDetailsId &&
     data.scCategoryId &&
     data.scSubSchemeDetailsId
   ) {
     api
       .post(baseURLDBT + `master/cost/getUnitType`, {
         headOfAccountId: scHeadAccountId,
         schemeId: data.scSchemeDetailsId,
         subSchemeId: data.scSubSchemeDetailsId,
         categoryId: data.scCategoryId,
       })
       .then((response) => {
         setUnitTypeList(response.data.content);
         // setScVendorListData(response.data.content.ScVendor);
       })
       .catch((err) => {
         // setScVendorListData([]);
       });
   }
 }, [data.scHeadAccountId, data.scCategoryId, data.scSubSchemeDetailsId]);

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
        .post(baseURLTargetSetting + `tsBudgetDistrict/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            clear();
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
      financialYearMasterId: "",
      scSchemeDetailsId: "",
      scSubSchemeDetailsId: "",
      scCategoryId: "",
      districtId: "",
      talukId:"",
      date: "",
      reportingOfficerId: "",
      implementingOfficerId: "",
      tsActivityMasterId: "",
      amount: "",
      useDisburse: "",
    });
    setValidated(false);
  };

  
  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
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
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };
  return (
    <Layout title="Taluk Financial Target Settings">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Taluk Financial Target Settings</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/ financialtargetsettingstaluk-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/financialtargetsettingstaluk-list"
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
            <Block>
              <Card>
                <Card.Header>Taluk Financial Target Settings</Card.Header>
                <Card.Body>
                  {/* <h3>Farmers Details</h3> */}
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
                            {list.categoryName}
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
                          <option key={list.districtId} value={list.districtId}>
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
                        <option value="">
                          Select Implementing Officer DDO
                        </option>
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
                        <option value="">Select Activity</option>
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
                      <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="budgetAmount">
                          Amount<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="budgetAmount"
                            name="budgetAmount"
                            value={data.budgetAmount}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Amount"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Amount is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="budgetAmount">
                          Use / Disburse<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="budgetAmount"
                            name="budgetAmount"
                            value={data.budgetAmount}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Amount"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Use / Disburse is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl"> Date</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.date}
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
                </Card.Body>
              </Card>
            </Block>

            <div className="d-flex justify-content-center">
            <Card className="mt-2" style={{ width: "90rem" }}>
              <Card.Header className="d-flex justify-content-center">
                {" "}
                Monthly Target Setting
              </Card.Header>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group as={Row} className="form-group mt-1" id="dfl">
                      <Form.Label column sm={2}>
                        April<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="dflCount"
                          // min={0}
                          value={data.dflCount}
                          onChange={handleInputs}
                          placeholder="April Target"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="form-group mt-1" id="dfl">
                      <Form.Label column sm={2}>
                        May<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="dflCount"
                          // min={0}
                          value={data.dflCount}
                          onChange={handleInputs}
                          placeholder="May Target"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="form-group mt-1" id="dfl">
                      <Form.Label column sm={2}>
                        June<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="dflCount"
                          // min={0}
                          value={data.dflCount}
                          onChange={handleInputs}
                          placeholder="June Target"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="form-group mt-1" id="dfl">
                      <Form.Label column sm={2}>
                        July<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="dflCount"
                          // min={0}
                          value={data.dflCount}
                          onChange={handleInputs}
                          placeholder="July Target"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="form-group mt-1" id="dfl">
                      <Form.Label column sm={2}>
                        August<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="dflCount"
                          // min={0}
                          value={data.dflCount}
                          onChange={handleInputs}
                          placeholder="August Target"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="form-group mt-1" id="dfl">
                      <Form.Label column sm={2}>
                        September<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="dflCount"
                          // min={0}
                          value={data.dflCount}
                          onChange={handleInputs}
                          placeholder="September Target"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group as={Row} className="form-group mt-1" id="dfl">
                      <Form.Label column sm={2}>
                        October<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="dflCount"
                          // min={0}
                          value={data.dflCount}
                          onChange={handleInputs}
                          placeholder="October Target"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="form-group mt-1" id="dfl">
                      <Form.Label column sm={2}>
                        November<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="dflCount"
                          // min={0}
                          value={data.dflCount}
                          onChange={handleInputs}
                          placeholder="November Target"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="form-group mt-1" id="dfl">
                      <Form.Label column sm={2}>
                        December<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="dflCount"
                          // min={0}
                          value={data.dflCount}
                          onChange={handleInputs}
                          placeholder="December Target"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="form-group mt-1" id="dfl">
                      <Form.Label column sm={2}>
                        January<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="dflCount"
                          // min={0}
                          value={data.dflCount}
                          onChange={handleInputs}
                          placeholder="January Target"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="form-group mt-1" id="dfl">
                      <Form.Label column sm={2}>
                        February<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="dflCount"
                          // min={0}
                          value={data.dflCount}
                          onChange={handleInputs}
                          placeholder="February Target"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="form-group mt-1" id="dfl">
                      <Form.Label column sm={2}>
                        March<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="dflCount"
                          // min={0}
                          value={data.dflCount}
                          onChange={handleInputs}
                          placeholder="March Target"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
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

export default FinancialTargetSettingsTaluk;
