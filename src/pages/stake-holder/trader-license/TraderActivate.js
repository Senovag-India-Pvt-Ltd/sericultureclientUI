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

function TraderActivate() {
  const [data, setData] = useState({
    traderLicenseId: "",
    username: "",
    password: "",
    mobileNumber: "",
    emailId: "",
    roleId: "",
    marketMasterId: localStorage.getItem("marketId"),
    designationId: "",
    deviceId: "",
    walletAMount: "",
  });

  const [traderSearch, setTraderSearch] = useState({
    text: "",
    select: "mobileNumber",
  });

  const [editData, setEditData] = useState({
    userTypeId: "",
    traderLicenseId: "",
    username: "",
    password: "",
    mobileNumber: "",
    emailId: "",
    roleId: "",
    marketMasterId: localStorage.getItem("marketId"),
    designationId: "",
    deviceId: "",
    walletAMount: "",
  });

  const [traderName, setTraderName] = useState("");
  const [editTraderName, setEditTraderName] = useState("");

  const getEdit = (i) => {
    console.log(i);
    setEditData((prev) => ({
      ...prev,
      traderLicenseId: i.userTypeId,
      marketMasterId: i.marketMasterId,
      username: i.username,
      mobileNumber: i.mobileNumber,
      deviceId: i.deviceId,
      userTypeId: i.userMasterId,
    }));
    setEditTraderName(i.firstName);
    handleShowModal();
    // getMarketList();
  };

  const [validated, setValidated] = useState(false);
  const [validatedEdit, setValidatedEdit] = useState(false);
  const [validatedDisplay, setValidatedDisplay] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "traderLicenseId") {
      getTraderList(value);
      getConfigureUser(value);
      setShow(false);
    }

    if (name === "mobileNumber" && (value.length < 10 || value.length > 10)) {
      // console.log("hellohello");
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "mobileNumber" && value.length === 10) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
  };

  const handleTraderSearchInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setTraderSearch({ ...traderSearch, [name]: value });
  };

  const handleEditInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setEditData({ ...editData, [name]: value });

    if (name === "traderLicenseId") {
      getTraderList(value);
      getConfigureUser(value);
    }

    if (name === "mobileNumber" && (value.length < 10 || value.length > 10)) {
      // console.log("hellohello");
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "mobileNumber" && value.length === 10) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
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
      if (data.mobileNumber.length < 10 || data.mobileNumber.length > 10) {
        return;
      }
      api
        .post(baseURL1 + `userMaster/save-trader-user`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
              traderLicenseId: "",
              username: "",
              password: "",
              mobileNumber: "",
              emailId: "",
              roleId: "",
              marketMasterId: localStorage.getItem("marketId"),
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

  const display = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedDisplay(true);
    } else {
      event.preventDefault();

      const { text, select } = traderSearch;
      let sendData;

      if (select === "mobileNumber") {
        sendData = {
          mobileNumber: text.trim(),
          marketId: localStorage.getItem("marketId"),
        };
      }
      if (select === "traderLicenseNumber") {
        sendData = {
          traderLicenseNumber: text,
          marketId: localStorage.getItem("marketId"),
        };
      }

      setLoading(true);

      api
        .post(
          baseURL +
            `trader-license/get-trader-details-by-trader-number-or-mobile-number`,
          sendData
        )
        .then((response) => {
          if (!response.data.content.error) {
            getTraderList(response.data.content.traderLicenseId);
            setTraderName(response.data.content.firstName);
            setData((prev) => ({
              ...prev,
              username: response.data.content.firstName,
              traderLicenseId: response.data.content.traderLicenseId,
            }));
          } else {
            Swal.fire({
              icon: "warning",
              title: "Details not Found",
            });
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error fetching farmer details:", err);
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              searchError(err.response.data.validationErrors);
            }
          } else {
            Swal.fire({
              icon: "warning",
              title: "Details not Found",
            });
          }
          setLoading(false);
        });
    }
  };

  const editPostData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedEdit(true);
    } else {
      event.preventDefault();
      console.log(editData.mobileNumber);
      if (
        editData.mobileNumber.length < 10 ||
        editData.mobileNumber.length > 10
      ) {
        return;
      }
      api
        .post(baseURL1 + `userMaster/edit-trader-user`, editData)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setEditData({
              traderLicenseId: "",
              username: "",
              password: "",
              mobileNumber: "",
              emailId: "",
              roleId: "",
              marketMasterId: localStorage.getItem("marketId"),
              designationId: "",
              deviceId: "",
              walletAMount: "",
            });
            setValidatedEdit(false);
            getTraderList(data.traderLicenseId);
            handleCloseModal();
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
        });
      setValidatedEdit(true);
    }
  };

  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  //const _header = { "Content-Type": "application/json", accept: "*/*" };

  //to get trader users

  const [traderList, setTraderList] = useState({
    userTypeId: "",
  });

  const getTraderList = (e) => {
    api
      .post(baseURL1 + `userMaster/get-trader-users`, { userTypeId: e })
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
    if (traderList.userTypeId) {
      getTraderList(traderList.userTypeId);
    }
  }, [traderList.userTypeId]);

  const clear = () => {
    setData({
      traderLicenseId: "",
      username: "",
      password: "",
      mobileNumber: "",
      emailId: "",
      roleId: "",
      marketMasterId: localStorage.getItem("marketId"),
      designationId: "",
      deviceId: "",
      walletAMount: "",
    });
    setListData([]);
  };

  const clearEdit = () => {
    setEditData({
      traderLicenseId: "",
      username: "",
      password: "",
      mobileNumber: "",
      emailId: "",
      roleId: "",
      marketMasterId: localStorage.getItem("marketId"),
      designationId: "",
      deviceId: "",
      walletAMount: "",
    });
  };

  const [show, setShow] = useState(false);

  const getConfigureUser = (e) => {
    api
      .post(baseURL1 + `userMaster/get-configure-user-details-for-trader`, {
        userTypeId: e,
      })
      // marketId: localStorage.getItem("marketId"),
      .then((response) => {
        if (!response.data.content.error) {
          const currentUser = response.data.content.currentTraderUsers;
          const maxTraderUser = response.data.content.maxTraderUsers;
          if (currentUser >= maxTraderUser) {
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
    if (traderList.userTypeId) {
      getTraderList(traderList.userTypeId);
    }
  }, [traderList.userTypeId]);

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

  const TraderDataColumns = [
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
      selector: (row) => row.mobileNumber,
      cell: (row) => <span>{row.mobileNumber}</span>,
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
            // onClick={handleShowModal}
            onClick={() => getEdit(row)}
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

  // to get trader
  // const [traderListData, setTraderListData] = useState([]);

  // const getList = () => {
  //   const response = api
  //     .get(baseURL + `trader/get-all`)
  //     .then((response) => {
  //       setTraderListData(response.data.content.trader);
  //     })
  //     .catch((err) => {
  //       setTraderListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getList();
  // }, []);

  // to get trader with market Id
  const [traderListData, setTraderListData] = useState([]);
  // console.log(traderListData);

  const getList = (_id) => {
    const response = api
      .get(
        baseURL + `trader-license/get-traders-by-market-id/${_id}`
      )
      .then((response) => {
        setTraderListData([]);
        console.log(response.data.content.traderLicense);
        setTraderListData(response.data.content.traderLicense);
      })
      .catch((err) => {
        setTraderListData([]);
      });
  };

  useEffect(() => {
    if (data.marketMasterId) {
      getList(data.marketMasterId);
    }
  }, [data.marketMasterId]);

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

  const searchError = (message = "Something went wrong!") => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Details not Found",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Activate trader">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Activate trader</Block.Title>
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

      <Block className="mt-n3">
        {/* <Form action="#"> */}
        <Form noValidate validated={validatedDisplay} onSubmit={display}>
          <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col sm={8} lg={12}>
                  <Form.Group as={Row} className="form-group" id="fid">
                    <Form.Label column sm={1} lg={2}>
                      Search Trader
                    </Form.Label>
                    <Col sm={1} lg={2}>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="select"
                          value={traderSearch.select}
                          onChange={handleTraderSearchInputs}
                        >
                          {/* <option value="">Select</option> */}
                          <option value="mobileNumber">Mobile Number</option>
                          <option value="traderLicenseNumber">
                            Trader License Number
                          </option>
                        </Form.Select>
                      </div>
                    </Col>

                    <Col sm={2} lg={2}>
                      <Form.Control
                        id="fruitsId"
                        name="text"
                        value={traderSearch.text}
                        onChange={handleTraderSearchInputs}
                        type="text"
                        placeholder="Search"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Field Value is Required
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={2} lg={3}>
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
        <Form
          noValidate
          validated={validated}
          onSubmit={postData}
          className="mt-2"
        >
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  {/* <Col lg="6">
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
                  </Col> */}

                  {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        trader<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="traderLicenseId"
                          value={data.traderLicenseId}
                          onChange={handleInputs}
                          // onSelect={()=>getTraderList(data.traderLicenseId)}
                          // onBlur={handleInputs}
                          required
                          isInvalid={
                            data.traderLicenseId === undefined || data.traderLicenseId === "0"
                          }
                        >
                          <option value="">Select trader</option>
                          {traderListData.map((list) => (
                            <option
                              key={list.traderVirtualBankAccountId}
                              value={list.traderLicenseId}
                            >
                              {console.log(list)}
                              {list.traderName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          trader Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="user">
                        Trader Name<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="user"
                          name="username"
                          value={traderName}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter User Name"
                          readOnly
                        />
                        <Form.Control.Feedback type="invalid">
                          User Name is required
                        </Form.Control.Feedback>
                      </div>
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
                      <Form.Label htmlFor="mobileNumber">
                        Mobile number<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="mobileNumber"
                          name="mobileNumber"
                          value={data.mobileNumber}
                          onChange={handleInputs}
                          type="text"
                          maxLength="10"
                          placeholder="Enter Mobile Number"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Mobile Number Should Contain 10 digits
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="mobileNumber">
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
                      <Form.Label htmlFor="mobileNumber">
                      trader Initial Wallet Amount<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="walletAMount"
                          name="walletAMount"
                          value={data.walletAMount}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter trader Initial Wallet Amount"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          trader Initial Wallet Amount is required
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

            <Block className="mt-4">
              <Card>
                <DataTable
                  tableClassName="data-table-head-light table-responsive"
                  columns={TraderDataColumns}
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
          </Row>
        </Form>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Activate trader</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validatedEdit} onSubmit={editPostData}>
            <Row className="g-3 ">
              <Card>
                <Card.Body>
                  {/* <h3>Farmers Details</h3> */}
                  <Row className="g-gs">
                    {/* <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          trader<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="traderLicenseId"
                            value={editData.traderLicenseId}
                            onChange={handleEditInputs}
                            required
                            isInvalid={
                              editData.traderLicenseId === undefined ||
                              editData.traderLicenseId === "0"
                            }
                          >
                            <option value="">Select trader</option>
                            {traderListData.map((list) => (
                              <option
                                key={list.traderVirtualBankAccountId}
                                value={list.traderLicenseId}
                              >
                                {list.traderName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            trader Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col> */}

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="user">
                          Trader Name<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="user"
                            name="username"
                            value={editTraderName}
                            // onChange={handleEditInputs}
                            type="text"
                            placeholder="Enter User Name"
                            readOnly
                          />
                          <Form.Control.Feedback type="invalid">
                            User Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    {/* <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          Market<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="marketMasterId"
                              value={editData.marketMasterId}
                              onChange={handleEditInputs}
                              // onBlur={() => handleEditInputs}
                              required
                              isInvalid={
                                editData.marketMasterId === undefined ||
                                editData.marketMasterId === "0"
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
                    </Col> */}
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="user">
                          User Name<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="user"
                            name="username"
                            value={editData.username}
                            onChange={handleEditInputs}
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
                            value={editData.password}
                            onChange={handleEditInputs}
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
                        <Form.Label htmlFor="mobileNumber">
                          Mobile number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mobileNumber"
                            name="mobileNumber"
                            value={editData.mobileNumber}
                            onChange={handleEditInputs}
                            type="text"
                            maxLength="10"
                            placeholder="Enter Mobile Number"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Mobile Number Should Contain 10 digits
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="mobileNumber">
                          Device ID<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="deviceId"
                            name="deviceId"
                            value={editData.deviceId}
                            onChange={handleEditInputs}
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
                  </Row>
                </Card.Body>
              </Card>

              <div className="gap-col">
                <ul className="d-flex align-items-center justify-content-center gap g-3">
                  <li>
                    {/* <Button type="button" variant="primary" onClick={postData}> */}
                    <Button type="submit" variant="primary">
                      Update
                    </Button>
                  </li>
                  <li>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={clearEdit}
                    >
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

export default TraderActivate;
