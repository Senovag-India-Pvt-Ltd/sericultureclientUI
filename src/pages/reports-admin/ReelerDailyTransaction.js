import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import DataTable from "../../components/AppDataTable";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../components";
import { useState, useEffect } from "react";
import { createTheme } from "react-data-table-component";
import DatePicker from "react-datepicker";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURL1 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ReelerDailyTransaction() {
  const { t } = useTranslation();
  const [data, setData] = useState({
    reelerId: "",
    username: "",
    password: "",
    phoneNumber: "",
    emailId: "",
    roleId: "",
    marketMasterId: localStorage.getItem("marketId"),
    designationId: "",
    deviceId: "",
    walletAMount: "",
    transactionDate: new Date(),
  });

  const [reelerSearch, setReelerSearch] = useState({
    text: "",
    select: "",
  });

  const [editData, setEditData] = useState({
    userTypeId: "",
    reelerId: "",
    username: "",
    password: "",
    phoneNumber: "",
    emailId: "",
    roleId: "",
    marketMasterId: localStorage.getItem("marketId"),
    designationId: "",
    deviceId: "",
    walletAMount: "",
  });

  const [reelerName, setReelerName] = useState("");
  const [editReelerName, setEditReelerName] = useState("");

  const getEdit = (i) => {
    console.log(i);
    setEditData((prev) => ({
      ...prev,
      reelerId: i.userTypeId,
      marketMasterId: i.marketMasterId,
      username: i.username,
      phoneNumber: i.phoneNumber,
      deviceId: i.deviceId,
      userTypeId: i.userMasterId,
    }));
    setEditReelerName(i.firstName);
    handleShowModal();
    // getMarketList();
  };

  const [validated, setValidated] = useState(false);
  const [validatedEdit, setValidatedEdit] = useState(false);
  const [validatedDisplay, setValidatedDisplay] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleFromDateChange = (date) => {
    setData((prev) => ({ ...prev, transactionDate: date }));
  };

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "reelerId") {
      getReelerList(value);
      getConfigureUser(value);
      setShow(false);
    }

    if (name === "phoneNumber" && (value.length < 10 || value.length > 10)) {
      // console.log("hellohello");
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "phoneNumber" && value.length === 10) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
  };

  const handleReelerSearchInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setReelerSearch({ ...reelerSearch, [name]: value });
  };

  // To get market
  const [marketData, setMarketData] = useState({});

  const getMarket = (_id) => {
    api
      .get(baseURL1 + `marketMaster/get/${_id}`)
      .then((response) => {
        // debugger;
        setMarketData(response.data.content);
      })
      .catch((err) => {
        // setMarketData([]);
      });
  };

  useEffect(() => {
    getMarket(localStorage.getItem("marketId"));
  }, [localStorage.getItem("marketId")]);

  const handleEditInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setEditData({ ...editData, [name]: value });

    if (name === "reelerId") {
      getReelerList(value);
      getConfigureUser(value);
    }

    if (name === "phoneNumber" && (value.length < 10 || value.length > 10)) {
      // console.log("hellohello");
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "phoneNumber" && value.length === 10) {
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
      if (data.phoneNumber.length < 10 || data.phoneNumber.length > 10) {
        return;
      }
      api
        .post(baseURL1 + `userMaster/save-reeler-user`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
              reelerId: "",
              username: "",
              password: "",
              phoneNumber: "",
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

  const [total, setTotal] = useState(0);

  const display = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedDisplay(true);
    } else {
      event.preventDefault();

      const { text, select } = reelerSearch;
      let sendData;

      if (select === "mobileNumber") {
        sendData = {
          mobileNumber: text.trim(),
          marketId: localStorage.getItem("marketId"),
          transactionDate: data.transactionDate,
        };
      } else if (select === "reelingLicenseNumber") {
        sendData = {
          reelerLicenceNumber: text,
          marketId: localStorage.getItem("marketId"),
          transactionDate: data.transactionDate,
        };
      } else {
        sendData = {
          marketId: localStorage.getItem("marketId"),
          //   marketId: 34,
          transactionDate: data.transactionDate,
        };
      }

      setLoading(true);

      api
        .post(baseURLMarket + `auction/reeler/getReelerTransaction`, sendData)
        .then((response) => {
          if (response.data.errorCode != -1) {
            setReelerListData(response.data.content);
            setTotal(response.data.content[0].total);
            // getReelerList(response.data.content.reelerId);
            // setReelerName(response.data.content.reelerName);
            // setData((prev) => ({
            //   ...prev,
            //   username: response.data.content.reelerName,
            //   reelerId: response.data.content.reelerId,
            // }));
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
      console.log(editData.phoneNumber);
      if (
        editData.phoneNumber.length < 10 ||
        editData.phoneNumber.length > 10
      ) {
        return;
      }
      api
        .post(baseURL1 + `userMaster/edit-reeler-user`, editData)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setEditData({
              reelerId: "",
              username: "",
              password: "",
              phoneNumber: "",
              emailId: "",
              roleId: "",
              marketMasterId: localStorage.getItem("marketId"),
              designationId: "",
              deviceId: "",
              walletAMount: "",
            });
            setValidatedEdit(false);
            getReelerList(data.reelerId);
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

  //to get Reeler users

  const [reelerList, setReelerList] = useState({
    userTypeId: "",
  });

  const getReelerList = (e) => {
    api
      .post(baseURL1 + `userMaster/get-reeler-users`, {
        userTypeId: e,
        marketMasterId: localStorage.getItem("marketId"),
      })
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
      marketMasterId: localStorage.getItem("marketId"),
      designationId: "",
      deviceId: "",
      walletAMount: "",
    });
    setListData([]);
  };

  const clearEdit = () => {
    setEditData({
      reelerId: "",
      username: "",
      password: "",
      phoneNumber: "",
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
      .post(baseURL1 + `userMaster/get-configure-user-details-for-reeler`, {
        userTypeId: e,
        marketMasterId: localStorage.getItem("marketId"),
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
      name: t("User Type Id"),
      selector: (row) => row.userTypeId,
      cell: (row) => <span>{row.userTypeId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("User ID"),
      selector: (row) => row.userMasterId,
      cell: (row) => <span>{row.userMasterId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Name"),
      selector: (row) => row.firstName,
      cell: (row) => <span>{row.firstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Market"),
      selector: (row) => row.marketMasterId,
      cell: (row) => <span>{row.marketMasterId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Mobile Number"),
      selector: (row) => row.phoneNumber,
      cell: (row) => <span>{row.phoneNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Device Id"),
      selector: (row) => row.deviceId,
      cell: (row) => <span>{row.deviceId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Action"),
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
    api
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
  // const [reelerListData, setReelerListData] = useState([]);

  // const getList = () => {
  //   const response = api
  //     .get(baseURL + `reeler/get-all`)
  //     .then((response) => {
  //       setReelerListData(response.data.content.reeler);
  //     })
  //     .catch((err) => {
  //       setReelerListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getList();
  // }, []);

  // to get current balance having reeler List based on marketId
  const [reelerListData, setReelerListData] = useState([]);
  // console.log(reelerListData);

  //   const getList = (_id) => {
  //     const response = api
  //       .get(
  //         baseURL + `reeler-virtual-bank-account/get-reelers-by-market-id/${_id}`
  //       )
  //       .then((response) => {
  //         setReelerListData([]);
  //         console.log(response.data.content.reelerVirtualBankAccount);
  //         setReelerListData(response.data.content.reelerVirtualBankAccount);
  //       })
  //       .catch((err) => {
  //         setReelerListData([]);
  //       });
  //   };

  //   useEffect(() => {
  //     if (data.marketMasterId) {
  //       getList(data.marketMasterId);
  //     }
  //   }, [data.marketMasterId]);

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
    <Layout title={t("Reeler Credit Transaction Report")}>
      <style>{reelerDailyTransactionStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Reeler Credit Transaction Report")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              {/* <ul className="d-flex">
              <li>
                <Link to="#" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>Go To List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go To List</span>
                </Link>
              </li>
            </ul> */}
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        {/* <Form action="#"> */}
        <Form noValidate validated={validatedDisplay} onSubmit={display}>
          <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col sm={8} lg={12}>
                  <Form.Group as={Row} className="form-group" id="fid">
                    <Form.Label column sm={1} lg={1}>
                      {t("Search Reeler")}
                    </Form.Label>
                    <Col sm={1} lg={2}>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="select"
                          value={reelerSearch.select}
                          onChange={handleReelerSearchInputs}
                        >
                          <option value="">{t("All")}</option>
                          <option value="mobileNumber">{t("Mobile Number")}</option>
                          <option value="reelingLicenseNumber">{t("Reeler License Number")}</option>
                          {/* <option value="reelerNumber">Reeler Number</option> */}
                        </Form.Select>
                      </div>
                    </Col>

                    <Col sm={2} lg={2}>
                      <Form.Control
                        id="fruitsId"
                        name="text"
                        value={reelerSearch.text}
                        onChange={handleReelerSearchInputs}
                        type="text"
                        placeholder={t("Search")}
                        // required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Field Value is Required")}
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={3} lg={4}>
                      <Form.Group as={Row} className="form-group" id="fid">
                        <Form.Label column sm={3}>
                          {t("Transaction Date")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Col sm={3}>
                          <div className="form-control-wrap">
                            <DatePicker
                              dateFormat="dd/MM/yyyy"
                              selected={data.transactionDate}
                              onChange={handleFromDateChange}
                              maxDate={new Date()}
                              className="form-control"
                            />
                          </div>
                        </Col>
                        <Col sm={2} lg={3}>
                          <Button type="submit" variant="primary">
                            {t("Search")}
                          </Button>
                        </Col>
                        {/* <Form.Label column sm={2}>
                      To Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={3}>
                      <div className="form-control-wrap">
                        <DatePicker
                          dateFormat="dd/MM/yyyy"
                          selected={data.reportToDate}
                          onChange={handleToDateChange}
                          maxDate={new Date()}
                          className="form-control"
                        />
                      </div>
                    </Col> */}
                      </Form.Group>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>

        <Row className="g-gs">
          {reelerListData && reelerListData.length ? (
            <div
            //  className={isActive ? "" : "d-none"}
            >
              <Row className="d-flex justify-content-end mt-2">
                <Col sm={2}>
                  {/* <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      onClick={generateDtrReport}
                    >
                      Print
                    </Button> */}
                </Col>
              </Row>

              <Row className="g-gs pt-2 d-flex justify-content-center">
                <Col lg="8">
                  <Card>
                    <Card.Header className="d-flex flex-column justify-content-center align-items-center">
                      <div style={{ fontSize: "150%", fontWeight: "bold" }}>
                        {t("Government Cocoon Market")}:
                        <span style={{ color: "#a1ffe5" }}>
                          {" "}
                          {marketData.marketMasterName}{" "}
                        </span>{" "}
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <table
                        className="table table-striped table-bordered"
                        style={{ backgroundColor: "white" }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ಕ್ರಮ ಸಂಖ್ಯೆ */}
                              {t("SL No")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                            >
                              {t("Posting Date")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ರೈತರ ವಿವರಗಳು */}
                              {t("Client Code")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ತೂಕ */}
                              {t("Client Name")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ಗೂಡಿನ  ವಯಸ್ಸು  */}
                              {t("Amount")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ಬಿಡ್ ಮೊತ್ತ */}
                              {t("Remitter Account")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ಬಿಡ್ ಮೊತ್ತ */}
                              {t("Remitter Bank")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ಬಿಡ್ ಮೊತ್ತ */}
                              {t("Sq no")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ಬಿಡ್ ಮೊತ್ತ */}
                              {t("Ref No")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ಬಿಡ್ ಮೊತ್ತ */}
                              {t("Time")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {reelerListData.map((list, i) => (
                            <tr key={i}>
                              <td>{list.slNo}</td>
                              <td>{list.postingDate}</td>
                              <td>{list.reelerLicenseNumber}</td>
                              <td>{list.name}</td>
                              <td>{list.amount}</td>
                              <td>{list.remitterAccount}</td>
                              <td>{list.remitterBank}</td>
                              <td>{list.sqNo}</td>
                              <td>{list.refNo}</td>
                              <td>{list.updatedDateTime}</td>
                              {/* <td>{parseFloat(list.farmerAmount.toFixed(2))}</td>
                            <td>
                              {parseFloat(
                                (
                                  list.farmerMarketFee + list.reelerMarketFee
                                ).toFixed(2)
                              )}
                            </td>
                            <td>{parseFloat(list.reelerAmount.toFixed(2))}</td> */}
                              {/* <td>{list.reelerName}</td>
                            <td>{list.bankName}</td>
                            <td>{list.ifscCode}</td> */}
                              {/* <td>{list.accountNumber}</td>
                            <td>{list.auctionDate}</td>
                            <td>{list.raceName}</td>
                            <td>{list.raceName}</td>
                            <td>{list.raceName}</td> */}
                            </tr>
                          ))}
                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{fontWeight:"bold"}}>{t("Total")}:</td>
                            <td>{total?total:0}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          ) : (
            ""
          )}
        </Row>
      </Block>
    </Layout>
  );
}

const reelerDailyTransactionStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-form-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
`;

export default ReelerDailyTransaction;
