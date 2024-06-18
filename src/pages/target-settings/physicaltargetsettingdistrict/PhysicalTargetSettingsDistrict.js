import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import api from "../../../services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function PhysicalTargetSettingsDistrict() {
  const [data, setData] = useState({
    financialYearMasterId: "",
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    districtId: "",
    date: "",
    reportingOfficerId: "",
    implementingOfficerId: "",
    tsActivityMasterId: "",
    unitMeasurementId: "9",
    scCategoryId: "",
    amount: "",
    tsMeasurementUnitId: "",
    schemeOrActivity: "",
  });

  const [months, setMonths] = useState({
    jan: "",
    feb: "",
    mar: "",
    apr: "",
    may: "",
    jun: "",
    jul: "",
    aug: "",
    sep: "",
    oct: "",
    nov: "",
    dec: "",
  });

  const [postMonths, setPostMonths] = useState([]);

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleMonthsInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setMonths({ ...months, [name]: value });
  };
  // const _header = { "Content-Type": "application/json", accept: "*/*" };
  // const _header = { "Content-Type": "application/json", accept: "*/*",  'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`, "Access-Control-Allow-Origin": "*"};
  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  const postData = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      const monthlyList = [];
      const monthNumbers = {
        jan: 1,
        feb: 2,
        mar: 3,
        apr: 4,
        may: 5,
        jun: 6,
        jul: 7,
        aug: 8,
        sep: 9,
        oct: 10,
        nov: 11,
        dec: 12,
      };
      for (const month in months) {
        monthlyList.push({
          month: monthNumbers[month],
          value: months[month],
        });
      }

      try {
        const response = await api.post(
          baseURLTargetSetting + `tsPhysicalDistrict/add-primary-monthly`,
          {
            physicalDistrictRequest: data,
            physicalDistrictMonthlyRequest: monthlyList,
          }
        );
        if (response.data.content.error) {
          saveError(response.data.content.error_description);
        } else {
          saveSuccess();
          clear();
        }
      } catch (err) {
        if (
          err.response &&
          err.response.data &&
          err.response.data.validationErrors
        ) {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        }
      }
      // setValidated(true);
    }
  };

  const clear = () => {
    setData({
    financialYearMasterId: "",
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    districtId: "",
    date: "",
    reportingOfficerId: "",
    implementingOfficerId: "",
    tsActivityMasterId: "",
    unitMeasurementId: "9",
    scCategoryId: "",
    amount: "",
    tsMeasurementUnitId: "",
    schemeOrActivity: "",
    });
    setMonths({
      jan: "",
      feb: "",
      mar: "",
      apr: "",
      may: "",
      jun: "",
      jul: "",
      aug: "",
      sep: "",
      oct: "",
      nov: "",
      dec: "",
    });
    setValidated(false);
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const getFinancialDefaultDetails = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-is-default`)
      .then((response) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId: response.data.content.financialYearMasterId,
        }));
      })
      .catch((err) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId: "",
        }));
      });
  };

  useEffect(() => {
    getFinancialDefaultDetails();
  }, []);

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
    <Layout title="Physical Target Setting - District">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Physical Target Setting - District
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/physicaltargetsettingsdistrict-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/physicaltargetsettingsdistrict-list"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Card>
            <Card.Header>Physical Target Setting District</Card.Header>
            <Card.Body>
              <Row className="g-gs ">
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
                      <Form.Group className="form-group mt-n4 ">
                        <Form.Label htmlFor="title">
                          Amount<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="amount"
                            name="amount"
                            value={data.amount}
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
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Scheme Or Activity
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="schemeOrActivity"
                        value={data.schemeOrActivity}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.schemeOrActivity === undefined ||
                          data.schemeOrActivity === "0"
                        }
                      >
                        <option value="0">Select Scheme Or Activity</option>
                        <option value="1">Scheme</option>
                        <option value="2">Activity</option>
                        
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                      Scheme Or Activity is required.
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                {/* <Col lg="6">
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
                        <option value="">Select Unit Of Measurement</option>
                        {unitTypeList.map((list) => (
                          <option key={list.id} value={list.id}>
                            {list.measurementUnit}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Unit Of Measurement is required.
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col> */}

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
                          name="apr"
                          // min={0}
                          value={months.apr}
                          onChange={handleMonthsInputs}
                          placeholder="April Target"
                          // required
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
                          name="may"
                          // min={0}
                          value={months.may}
                          onChange={handleMonthsInputs}
                          placeholder="May Target"
                          // required
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
                          name="jun"
                          // min={0}
                          value={months.jun}
                          onChange={handleMonthsInputs}
                          placeholder="June Target"
                          // required
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
                          name="jul"
                          // min={0}
                          value={months.jul}
                          onChange={handleMonthsInputs}
                          placeholder="July Target"
                          // required
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
                          name="aug"
                          // min={0}
                          value={months.aug}
                          onChange={handleMonthsInputs}
                          placeholder="August Target"
                          // required
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
                          name="sep"
                          // min={0}
                          value={months.sep}
                          onChange={handleMonthsInputs}
                          placeholder="September Target"
                          // required
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
                          name="oct"
                          // min={0}
                          value={months.oct}
                          onChange={handleMonthsInputs}
                          placeholder="October Target"
                          // required
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
                          name="nov"
                          // min={0}
                          value={months.nov}
                          onChange={handleMonthsInputs}
                          placeholder="November Target"
                          // required
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
                          name="dec"
                          // min={0}
                          value={months.dec}
                          onChange={handleMonthsInputs}
                          placeholder="December Target"
                          // required
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
                          name="jan"
                          // min={0}
                          value={months.jan}
                          onChange={handleMonthsInputs}
                          placeholder="January Target"
                          // required
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
                          name="feb"
                          // min={0}
                          value={months.feb}
                          onChange={handleMonthsInputs}
                          placeholder="February Target"
                          // required
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
                          name="mar"
                          // min={0}
                          value={months.mar}
                          onChange={handleMonthsInputs}
                          placeholder="March Target"
                          // required
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

          <div className="gap-col mt-1">
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
        </Form>
      </Block>
    </Layout>
  );
}

export default PhysicalTargetSettingsDistrict;
