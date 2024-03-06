import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import DataTable from "react-data-table-component";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import { createTheme } from "react-data-table-component";
// import axios from "axios";
import api from "../../../../src/services/auth/api";
const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURL1 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ReelerActivate() {
  const [data, setData] = useState({
    reelerId: "",
    username: "",
    password: "",
    phoneNumber: "",
    emailId: "",
    roleId: "",
    marketMasterId: "",
    designationId: "",
    deviceId: "",
    walletAMount: "",
  });

  const [validated, setValidated] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "reelerId") {
      getReelerList(value);
      getConfigureUser(value);
    }
  };
  // const _header = { "Content-Type": "application/json", accept: "*/*" };
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
      // event.stopPropagation();
      api
        .post(baseURL1 + `userMaster/save-reeler-user`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError();
          } else {
            saveSuccess();
            setData({
              reelerId: "",
              username: "",
              password: "",
              phoneNumber: "",
              emailId: "",
              roleId: "",
              marketMasterId: "",
              designationId: "",
              deviceId: "",
              walletAMount: "",
            });
            setValidated(false);
          }
        })

        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }

          // if (err.response && err.response.data.content) {
          //   Swal.fire({
          //     icon: "error",
          //     title: "Invalid Username",
          //     text: "Please enter a valid username",
          //   });
          // }
        });
      setValidated(true);
    }
  };

  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  //const _header = { "Content-Type": "application/json", accept: "*/*" };

  //to get Reeler users

  const [reelerList, setReelerList] = useState({
    userTypeId: "",
  });

  const getReelerList = (e) => {
    api
      .post(baseURL1 + `userMaster/get-reeler-users`, { userTypeId: e })
      // marketId: localStorage.getItem("marketId"),
      .then((response) => {
        //console.log(response);
        // if (response.data.content) {
        setListData(response.data.content.userMaster);
        setTotalRows(response.data.content.totalItems);
        setLoading(false);
        if (response.data.content.error) {
          setListData([]);
        }
      })
      .catch((err) => {
        setListData([]);
        setListData(false);
      });
  };
  useEffect(() => {
    if (reelerList.userTypeId) {
      getReelerList(reelerList.userTypeId);
    }
  }, [reelerList.userTypeId]);

  const clear = () => {
    setData({
      reelerId: "",
      username: "",
      password: "",
      phoneNumber: "",
      emailId: "",
      roleId: "",
      marketMasterId: "",
      designationId: "",
      deviceId: "",
      walletAMount: "",
    });
    setListData([]);
  };

  const [show, setShow] = useState(false);

  const getConfigureUser = (e) => {
    api
      .post(baseURL1 + `userMaster/get-configure-user-details-for-reeler`, {
        userTypeId: e,
      })
      // marketId: localStorage.getItem("marketId"),
      .then((response) => {
        if (!response.data.content.error) {
          const currentUser = response.data.content.currentReelerUsers;
          const maxReelerUser = response.data.content.maxReelerUsers;
          if (currentUser >= maxReelerUser) {
            saveError();
            setShow(true);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Attempt was not successful",
            text: "Record Not Found!!!",
          });
        }
      })
      .catch((err) => {});
  };
  useEffect(() => {
    if (reelerList.userTypeId) {
      getReelerList(reelerList.userTypeId);
    }
  }, [reelerList.userTypeId]);

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

  const ReelerDataColumns = [
    {
      name: "User Type Id",
      selector: (row) => row.userTypeId,
      cell: (row) => <span>{row.userTypeId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "User ID",
      selector: (row) => row.userMasterId,
      cell: (row) => <span>{row.userMasterId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Name",
      selector: (row) => row.firstName,
      cell: (row) => <span>{row.firstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Market",
      selector: (row) => row.marketMasterId,
      cell: (row) => <span>{row.marketMasterId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Mobile Number",
      selector: (row) => row.phoneNumber,
      cell: (row) => <span>{row.phoneNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Device Id",
      selector: (row) => row.deviceId,
      cell: (row) => <span>{row.deviceId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Action",
      width: "300px",
      headerStyle: (selector, id) => {
        return { textAlign: "center" };
      },
      cell: (row) => (
        <div className="text-end w-100 d-flex justify">
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={handleShowModal}
          >
            Edit
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    },
  ];

  // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = () => {
    const response = api
      .get(baseURL1 + `marketMaster/get-all`)
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

  // to get reeler
  const [reelerListData, setReelerListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `reeler/get-all`)
      .then((response) => {
        setReelerListData(response.data.content.reeler);
      })
      .catch((err) => {
        setReelerListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    });
  };
  const saveError = (message = "Maxium users already created!") => {
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
    <Layout title="Activate Reeler">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Activate Reeler</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            {/* <ul className="d-flex">
              <li>
                <Link to="#" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
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
                        Reeler<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="reelerId"
                          value={data.reelerId}
                          onChange={handleInputs}
                          // onSelect={()=>getReelerList(data.reelerId)}
                          // onBlur={handleInputs}
                          required
                          isInvalid={
                            data.reelerId === undefined || data.reelerId === "0"
                          }
                        >
                          <option value="">Select Reeler</option>
                          {reelerListData.map((list) => (
                            <option key={list.reelerId} value={list.reelerId}>
                              {list.reelerName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Reeler Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        Market<span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="marketMasterId"
                            value={data.marketMasterId}
                            onChange={handleInputs}
                            // onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.marketMasterId === undefined ||
                              data.marketMasterId === "0"
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
                            Market Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="user">
                        User Name<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="user"
                          name="username"
                          value={data.username}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter User Name"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          User Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="password">
                        Password<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="password"
                          name="password"
                          value={data.password}
                          onChange={handleInputs}
                          type="password"
                          placeholder="Enter Password"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Password is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="phoneNumber">
                        Mobile number<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="phoneNumber"
                          name="phoneNumber"
                          value={data.phoneNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Mobile Number"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Mobile Number is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="phoneNumber">
                        Device ID<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="deviceId"
                          name="deviceId"
                          value={data.deviceId}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Device Id"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Device Id is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="phoneNumber">
                      Reeler Initial Wallet Amount<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="walletAMount"
                          name="walletAMount"
                          value={data.walletAMount}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Reeler Initial Wallet Amount"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Reeler Initial Wallet Amount is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}
                </Row>
              </Card.Body>
            </Card>

            <Block className="mt-4">
              <Card>
                <DataTable
                  tableClassName="data-table-head-light table-responsive"
                  columns={ReelerDataColumns}
                  data={listData}
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
              </Card>
            </Block>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary" disabled={show}>
                    Activate
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

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Activate Reeler</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          {/* <Form
            noValidate
            validated={validatedFarmerAddressEdit}
            onSubmit={(e) => handleUpdateFa(e, faId, farmerAddress)}
          >
            <Row className="g-3">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    State<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="stateId"
                      value={`${farmerAddress.stateId}_${farmerAddress.stateName}`}
                      onChange={handleStateOption}
                      onBlur={() => handleStateOption}
                      required
                      isInvalid={
                        farmerAddress.stateId === undefined ||
                        farmerAddress.stateId === "0"
                      }
                    >
                      <option value="0">Select State</option>
                      {addressStateListData.map((list) => (
                        <option
                          key={list.stateId}
                          value={`${list.stateId}_${list.stateName}`}
                        >
                          {list.stateName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      State Name is required.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    District<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="districtId"
                      value={`${farmerAddress.districtId}_${farmerAddress.districtName}`}
                      onChange={handleDistrictOption}
                      onBlur={() => handleDistrictOption}
                      required
                      isInvalid={
                        farmerAddress.districtId === undefined ||
                        farmerAddress.districtId === "0"
                      }
                    >
                      <option value="">Select District</option>
                      {addressdistrictListData && addressdistrictListData.length
                        ? addressdistrictListData.map((list) => (
                            <option
                              key={list.districtId}
                              value={`${list.districtId}_${list.districtName}`}
                            >
                              {list.districtName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      District Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    Taluk<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="talukId"
                      value={`${farmerAddress.talukId}_${farmerAddress.talukName}`}
                      onChange={handleTalukOption}
                      onBlur={() => handleTalukOption}
                      required
                      isInvalid={
                        farmerAddress.talukId === undefined ||
                        farmerAddress.talukId === "0"
                      }
                    >
                      <option value="">Select Taluk</option>
                      {addressTalukListData && addressTalukListData.length
                        ? addressTalukListData.map((list) => (
                            <option
                              key={list.talukId}
                              value={`${list.talukId}_${list.talukName}`}
                            >
                              {list.talukName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Taluk Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    Hobli<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="hobliId"
                      value={`${farmerAddress.hobliId}_${farmerAddress.hobliName}`}
                      onChange={handleHobliOption}
                      onBlur={() => handleHobliOption}
                      required
                      isInvalid={
                        farmerAddress.hobliId === undefined ||
                        farmerAddress.hobliId === "0"
                      }
                    >
                      <option value="">Select Hobli</option>
                      {addressHobliListData && addressHobliListData.length
                        ? addressHobliListData.map((list) => (
                            <option
                              key={list.hobliId}
                              value={`${list.hobliId}_${list.hobliName}`}
                            >
                              {list.hobliName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Hobli Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="Village">
                    Village<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="villageId"
                      value={`${farmerAddress.villageId}_${farmerAddress.villageName}`}
                      onChange={handleVillageOption}
                      onBlur={() => handleVillageOption}
                      required
                      isInvalid={
                        farmerAddress.villageId === undefined ||
                        farmerAddress.villageId === "0"
                      }
                    >
                      <option value="">Select Village</option>
                      {addressVillageListData && addressVillageListData.length
                        ? addressVillageListData.map((list) => (
                            <option
                              key={list.villageId}
                              value={`${list.villageId}_${list.villageName}`}
                            >
                              {list.villageName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Village Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-2">
                  <Form.Label htmlFor="address">
                    {t("address")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      as="textarea"
                      id="addressText"
                      name="addressText"
                      value={farmerAddress.addressText}
                      onChange={handleFarmerAddressInputs}
                      type="text"
                      placeholder={t("enter_address")}
                      rows="2"
                      required
                      readOnly
                    />
                    <Form.Control.Feedback type="invalid">
                      Address is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="pincode">
                    {t("pin_code")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="pincode"
                      name="pincode"
                      value={farmerAddress.pincode}
                      onChange={handleFarmerAddressInputs}
                      type="text"
                      placeholder={t("enter_pin_code")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Pincode is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
               
                <Form.Group as={Row} className="form-group mt-4">
                  <Col sm={1}>
                    <Form.Check
                      type="checkbox"
                      id="defaultAddress"
                      checked={farmerAddress.defaultAddress}
                      onChange={handleCheckBox}
                      // defaultChecked
                    />
                  </Col>
                  <Form.Label column sm={11} className="mt-n2">
                    {t("make_this_address_default")}
                  </Form.Label>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                  
                    <Button type="submit" variant="success">
                      Update
                    </Button>
                  </div>
               
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form> */}

          <Form noValidate validated={validated} onSubmit={postData}>
            <Row className="g-3 ">
              <Card>
                <Card.Body>
                  {/* <h3>Farmers Details</h3> */}
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          Reeler<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="reelerId"
                            value={data.reelerId}
                            onChange={handleInputs}
                            required
                            isInvalid={
                              data.reelerId === undefined ||
                              data.reelerId === "0"
                            }
                          >
                            <option value="">Select Reeler</option>
                            {reelerListData.map((list) => (
                              <option key={list.reelerId} value={list.reelerId}>
                                {list.reelerName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Reeler Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          Market<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="marketMasterId"
                              value={data.marketMasterId}
                              onChange={handleInputs}
                              // onBlur={() => handleInputs}
                              required
                              isInvalid={
                                data.marketMasterId === undefined ||
                                data.marketMasterId === "0"
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
                              Market Name is required
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="user">
                          User Name<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="user"
                            name="username"
                            value={data.username}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter User Name"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            User Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="password">
                          Password<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={handleInputs}
                            type="password"
                            placeholder="Enter Password"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Password is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="phoneNumber">
                          Mobile number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="phoneNumber"
                            name="phoneNumber"
                            value={data.phoneNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Mobile Number"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Mobile Number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="phoneNumber">
                          Device ID<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="deviceId"
                            name="deviceId"
                            value={data.deviceId}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Device Id"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Device Id is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="phoneNumber">
                      Reeler Initial Wallet Amount<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="walletAMount"
                          name="walletAMount"
                          value={data.walletAMount}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Reeler Initial Wallet Amount"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Reeler Initial Wallet Amount is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}
                  </Row>
                </Card.Body>
              </Card>

              <div className="gap-col">
                <ul className="d-flex align-items-center justify-content-center gap g-3">
                  <li>
                    {/* <Button type="button" variant="primary" onClick={postData}> */}
                    <Button type="submit" variant="primary" disabled={show}>
                      Edit
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
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default ReelerActivate;
