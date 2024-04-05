import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import { Icon, Select } from "../../../components";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { createTheme } from "react-data-table-component";

import api from "../../../../src/services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLRegistration = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;

function ServiceApplication() {
  // Translation
  const { t } = useTranslation();
  const [data, setData] = useState({
    with: "withLand",
    subinc: "subsidy",
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    scHeadAccountId: "",
    scCategoryId: "",
    scVendorId: "",
  });

  const [isDisabled, setIsDisabled] = useState(true);

  const [landDetailsList, setLandDetailsList] = useState([]);

  // to get sc-scheme-details
  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);

  const getList = () => {
    api
      .get(baseURLMasterData + `scSchemeDetails/get-all`)
      .then((response) => {
        setScSchemeDetailsListData(response.data.content.ScSchemeDetails);
      })
      .catch((err) => {
        setScSchemeDetailsListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get sc-sub-scheme-details by sc-scheme-details
  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState(
    []
  );
  const getSubSchemeList = (_id) => {
    const response = api
      .get(
        baseURLMasterData +
          `scSubSchemeDetails/get-by-sc-scheme-details-id/${_id}`
      )
      .then((response) => {
        if (response.data.content.scSubSchemeDetails) {
          setScSubSchemeDetailsListData(
            response.data.content.scSubSchemeDetails
          );
        }
      })
      .catch((err) => {
        setScSubSchemeDetailsListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.scSchemeDetailsId) {
      getSubSchemeList(data.scSchemeDetailsId);
    }
  }, [data.scSchemeDetailsId]);

  // to get head of account by sc-scheme-details
  const [scHeadAccountListData, setScHeadAccountListData] = useState([]);
  const getHeadAccountList = (_id) => {
    api
      .get(
        baseURLMasterData + `scHeadAccount/get-by-sc-scheme-details-id/${_id}`
      )
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
    if (data.scSchemeDetailsId) {
      getHeadAccountList(data.scSchemeDetailsId);
    }
  }, [data.scSchemeDetailsId]);

  // to get category by head of account id
  const [scCategoryListData, setScCategoryListData] = useState([]);
  const getCategoryList = (_id) => {
    api
      .get(
        baseURLMasterData +
          `scHeadAccountCategory/get-by-sc-head-account-id/${_id}`
      )
      .then((response) => {
        if (response.data.content.scHeadAccountCategory) {
          setScCategoryListData(response.data.content.scHeadAccountCategory);
        }
      })
      .catch((err) => {
        setScCategoryListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.scHeadAccountId) {
      getCategoryList(data.scHeadAccountId);
    }
  }, [data.scHeadAccountId]);

  // to get sc-vendor
  const [scVendorListData, setScVendorListData] = useState([]);

  const getVendorList = () => {
    api
      .get(baseURLMasterData + `scVendor/get-all`)
      .then((response) => {
        setScVendorListData(response.data.content.ScVendor);
      })
      .catch((err) => {
        setScVendorListData([]);
      });
  };

  useEffect(() => {
    getVendorList();
  }, []);

  const [shareDetails, setShareDetails] = useState({});
  useEffect(() => {
    if (
      data.scHeadAccountId &&
      data.scCategoryId &&
      data.scSubSchemeDetailsId
    ) {
      api
        .get(
          baseURLMasterData +
            `scUnitCost/get-by-sc-head-account-id?scHeadAccountId=${data.scHeadAccountId}&scCategoryId=${data.scCategoryId}&scSubSchemeDetailsId=${data.scSubSchemeDetailsId}`
        )
        .then((response) => {
          setShareDetails(response.data.content.scUnitCost[0]);
          // setScVendorListData(response.data.content.ScVendor);
        })
        .catch((err) => {
          // setScVendorListData([]);
        });
    }
  }, [data.scHeadAccountId, data.scCategoryId, data.scSubSchemeDetailsId]);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "fruitsId" && (value.length < 16 || value.length > 16)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "fruitsId" && value.length === 16) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();

      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }
      api
        .post(baseURLMasterData + `Maintenance-sale/add-info`, data)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.receiptNo);
            setData({
              fruitsId: "",
              farmerName: "",
              mulberryVarietyId: "",
              area: "",
              dateOfPlanting: "",
              nurserySaleDetails: "",
              quantity: "",
              date: "",
              rate: "",
              saplingAge: "",
              remittanceDetails: "",
              challanUploadKey: "",
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

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
    top: {
      backgroundColor: "rgb(15, 108, 190, 1)",
      color: "rgb(255, 255, 255)",
      width: "50%",
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    bottom: {
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    sweetsize: {
      width: "100px",
      height: "100px",
    },
  };

  const clear = () => {
    setData({
      fruitsId: "",
      farmerName: "",
      mulberryVarietyId: "",
      area: "",
      dateOfPlanting: "",
      nurserySaleDetails: "",
      quantity: "",
      date: "",
      rate: "",
      saplingAge: "",
      remittanceDetails: "",
      challanUploadKey: "",
    });
  };

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

  const [validated, setValidated] = useState(false);
  const [searchValidated, setSearchValidated] = useState(false);
  const [listLogsData, setListLogsData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const search = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setSearchValidated(true);
    } else {
      event.preventDefault();
      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }
      api
        .post(baseURLRegistration + `farmer/get-farmer-details`, {
          fruitsId: data.fruitsId,
        })
        .then((response) => {
          console.log(response);
          if (!response.data.content.error) {
            if (response.data.content.farmerLandDetailsDTOList.length > 0) {
              setLandDetailsList(
                response.data.content.farmerLandDetailsDTOList
              );
            }
          } else {
            saveError(response.data.content.error_description);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        });
    }
  };

  const LandDetailsColumns = [
    {
      name: "District",
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Taluk",
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Hobli",
      selector: (row) => row.hobliName,
      cell: (row) => <span>{row.hobliName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Village",
      selector: (row) => row.villageName,
      cell: (row) => <span>{row.villageName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Survey Number",
      selector: (row) => row.surveyNumber,
      cell: (row) => <span>{row.surveyNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Owner",
      selector: (row) => row.ownerName,
      cell: (row) => <span>{row.ownerName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Acre",
      selector: (row) => row.acre,
      cell: (row) => (
        <Form.Control
          // id="farmerName"
          // name="farmerName"
          type="text"
          value={row.acre}
          // onChange={handleInputs}
          placeholder="Edit Acre"
        />
      ),
      sortable: true,
      hide: "md",
    },
    {
      name: "Gunta",
      selector: (row) => row.gunta,
      cell: (row) => (
        <Form.Control
          // id="farmerName"
          // name="farmerName"
          type="text"
          value={row.gunta}
          // onChange={handleInputs}
          placeholder="Edit Gunta"
        />
      ),
      sortable: true,
      hide: "md",
    },

    {
      name: "FGunta",
      selector: (row) => row.fgunta,
      cell: (row) => (
        <Form.Control
          // id="farmerName"
          // name="farmerName"
          type="text"
          value={row.fgunta}
          // onChange={handleInputs}
          placeholder="Edit FGunta"
        />
      ),
      sortable: true,
      hide: "md",
    },
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={setIsDisabled(false)}
          >
            Update
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    },
  ];

  createTheme(
    "solarized",
    {
      text: {
        primary: "#004b8e",
        secondary: "#2aa198",
      },
      background: {
        default: "#fff",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#d3d3d3",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.02)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "light"
  );

  const customStyles = {
    rows: {
      style: {
        minHeight: "45px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        fontSize: "14px",
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

  return (
    <Layout title="Application for Subsidy / Incentives">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("title_service_application")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            {/* <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/stake-holder-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/stake-holder-list"
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
        {/* <Form noValidate validated={searchValidated} onSubmit={search}> */}
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
                        type="fruitsId"
                        name="fruitsId"
                        value={data.fruitsId}
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
        <Card className="mt-1">
          <Card.Body>
            <Row lg="12" className="g-gs">
              <Col lg={6}>
                <Row>
                  <Col lg="2">
                    <Form.Group
                      as={Row}
                      className="form-group"
                      controlId="subsidy"
                    >
                      <Col sm={1}>
                        <Form.Check
                          type="radio"
                          name="subinc"
                          value="subsidy"
                          checked={data.subinc === "subsidy"}
                          onChange={handleInputs}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2" id="subsidy">
                        Subsidy
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col lg="3">
                    <Form.Group
                      as={Row}
                      className="form-group"
                      controlId="incentive"
                    >
                      <Col sm={1}>
                        <Form.Check
                          type="radio"
                          name="subinc"
                          value="incentive"
                          checked={data.subinc === "incentive"}
                          onChange={handleInputs}
                        />
                      </Col>
                      <Form.Label
                        column
                        sm={9}
                        className="mt-n2"
                        id="incentive"
                      >
                        Incentive
                      </Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col lg={6}>
                <Row>
                  <Col lg="3">
                    <Form.Group as={Row} className="form-group" controlId="crc">
                      <Col sm={1}>
                        <Form.Check
                          type="radio"
                          name="with"
                          value="withLand"
                          checked={data.with === "withLand"}
                          onChange={handleInputs}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2" id="crc">
                        With Land
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col lg="3" className="ms-n2">
                    <Form.Group as={Row} className="form-group" controlId="crc">
                      <Col sm={1}>
                        <Form.Check
                          type="radio"
                          name="with"
                          value="withOutLand"
                          checked={data.with === "withOutLand"}
                          onChange={handleInputs}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2" id="crc">
                        Without Land
                      </Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>
      <Row>
        <Block>
          <Form noValidate validated={validated} onSubmit={postData}>
            <Row className="g-1 ">
              <Col lg={8}>
                <Block className="mt-3">
                  <Card>
                    <Card.Header style={{ fontWeight: "bold" }}>
                      Scheme Details
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Component Type (Sub Schemes)/Program Names
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scSchemeDetailsId"
                                value={data.scSchemeDetailsId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scSchemeDetailsId === undefined ||
                                  data.scSchemeDetailsId === "0"
                                }
                              >
                                <option value="">
                                  Select Component Type (Sub Schemes)/Program
                                  Names
                                </option>
                                {scSchemeDetailsListData.map((list) => (
                                  <option
                                    key={list.scSchemeDetailsId}
                                    value={list.scSchemeDetailsId}
                                  >
                                    {list.schemeName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Component Type (Sub Schemes)/Program Names is
                                required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Scheme (Head Of Account)
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scHeadAccountId"
                                value={data.scHeadAccountId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scHeadAccountId === undefined ||
                                  data.scHeadAccountId === "0"
                                }
                              >
                                <option value="">
                                  Select Scheme (Head Of Account)
                                </option>
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
                                Scheme (Head Of Account) is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              Component (Sub Program Name)
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scSubSchemeDetailsId"
                                value={data.scSubSchemeDetailsId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scSubSchemeDetailsId === undefined ||
                                  data.scSubSchemeDetailsId === "0"
                                }
                              >
                                <option value="">
                                  Select Component (Sub Program Name)
                                </option>
                                {scSubSchemeDetailsListData.map((list) => (
                                  <option
                                    key={list.scSubSchemeDetailsId}
                                    value={list.scSubSchemeDetailsId}
                                  >
                                    {list.subSchemeName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Component (Sub Program Name) is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Sub Component
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scCategoryId"
                                value={data.scCategoryId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scCategoryId === undefined ||
                                  data.scCategoryId === "0"
                                }
                              >
                                <option value="">Select Sub Component</option>
                                {scCategoryListData.map((list) => (
                                  <option
                                    key={list.scHeadAccountCategoryId}
                                    value={list.scCategoryId}
                                  >
                                    {list.categoryName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Sub Component is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Block>
              </Col>
              <Col lg={4}>
                <Block>
                  <Card className="mt-3">
                    <Card.Header style={{ fontWeight: "bold" }}>
                      Share Details
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="12">
                          <table className="table small table-bordered mt-n2 mb-n1">
                            <tbody>
                              <tr>
                                <td style={styles.ctstyle}> Unit Cost:</td>
                                <td>{shareDetails && shareDetails.unitCost}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  Beneficiary Share:
                                </td>
                                <td>
                                  {shareDetails &&
                                    shareDetails.benificiaryShare}
                                </td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>State Share:</td>
                                <td>
                                  {shareDetails && shareDetails.stateShare}
                                </td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> Central Share:</td>
                                <td>
                                  {shareDetails && shareDetails.centralShare}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Block>
              </Col>

              <Block className="mt-3">
                <Card>
                  <Card.Header style={{ fontWeight: "bold" }}>
                    Vendors List
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-gs">
                      <Col lg="4">
                        <Form.Group className="form-group mt-n3">
                          <Form.Label>
                            Vendor Name<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="scVendorId"
                              value={data.scVendorId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              // multiple
                              required
                              isInvalid={
                                data.scVendorId === undefined ||
                                data.scVendorId === "0"
                              }
                            >
                              <option value="">Select Vendor Name</option>
                              {scVendorListData.map((list) => (
                                <option
                                  key={list.scVendorId}
                                  value={list.scVendorId}
                                >
                                  {list.name}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Vendor Name is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Block>
              {data.with === "withLand" && landDetailsList.length > 0 ? (
                <Block className="mt-3">
                  <Card>
                    <Card.Header style={{ fontWeight: "bold" }}>
                      RTC Details
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <DataTable
                          tableClassName="data-table-head-light table-responsive"
                          columns={LandDetailsColumns}
                          data={landDetailsList}
                          highlightOnHover
                          pagination
                          paginationServer
                          paginationTotalRows={totalRows}
                          paginationPerPage={countPerPage}
                          paginationComponentOptions={{
                            noRowsPerPage: true,
                          }}
                          onChangePage={(page) => setPage(page - 1)}
                          progressPending={loading}
                          theme="solarized"
                          customStyles={customStyles}
                        />
                      </Row>
                      {/* <Row>
                        <Block className="mt-3">
                          <Row className="g-gs">
                            <Col lg="4">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label htmlFor="sordfl">
                                  Acre
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="farmerName"
                                    name="farmerName"
                                    type="text"
                                    // value={data.farmerName}
                                    // onChange={handleInputs}
                                    placeholder="Enter Lot Number"
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Lot Number is required
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>

                            <Col lg="4">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label htmlFor="sordfl">
                                  Gunta
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="farmerName"
                                    name="farmerName"
                                    type="text"
                                    // value={data.farmerName}
                                    // onChange={handleInputs}
                                    placeholder="Enter Egg Sheet Numbers"
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Egg Sheet Numbers is required
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>

                            <Col lg="4">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label htmlFor="sordfl">
                                  FGunta
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="area"
                                    name="area"
                                    // value={data.area}
                                    // onChange={handleInputs}
                                    type="text"
                                    maxLength="4"
                                    placeholder="Enter Number of DFLs disposed"
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Number of DFLs disposed is required
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Block>
                      </Row> */}
                    </Card.Body>
                  </Card>
                </Block>
              ) : (
                ""
              )}

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
      </Row>
    </Layout>
  );
}

export default ServiceApplication;
