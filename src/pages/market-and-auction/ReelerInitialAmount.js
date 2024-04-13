import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import DataTable from "react-data-table-component";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../components";
import { useState, useEffect } from "react";
import { createTheme } from "react-data-table-component";
// import axios from "axios";
import api from "../../services/auth/api";
const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURL1 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ReelerInitialAmount() {
  const [data, setData] = useState({
    reelerId: "",
    initialAmount: "",
    accountNumber: "",
    virtualAccount: "",
  });

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

  const [reelerSearch, setReelerSearch] = useState({
    text: "",
    select: "mobileNumber",
  });

  const [editData, setEditData] = useState({
    userTypeId: "",
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

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    // if (name === "reelerId") {
    //   getReelerList(value);
    //   getConfigureUser(value);
    //   setShow(false);
    // }

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
      api
        .post(baseURL + `reeler/reeler-initial-amount`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            clear();
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
          } else {
            Swal.fire({
              icon: "warning",
              title: `Already initial amount is added !!!`,
            });
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

  const [showData, setShowData] = useState({
    reelerName: "",
    reelerNumber: "",
    reelingLicenseNumber: "",
    virtualAccountNumber: "",
  });

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
        };
      }
      if (select === "reelerNumber") {
        sendData = {
          reelerNumber: text,
          marketId: localStorage.getItem("marketId"),
        };
      }

      if (select === "reelingLicenseNumber") {
        sendData = {
          reelerNumber: text,
          marketId: localStorage.getItem("marketId"),
        };
      }

      setLoading(true);

      api
        .post(
          baseURL +
            `reeler-virtual-bank-account/get-reeler-details-by-reeler-number-or-mobile-number`,
          sendData
        )
        .then((response) => {
          if (!response.data.content.error) {
            // setReelerName(response.data.content.reelerName);
            setShowData((prev) => ({
              ...prev,
              reelerName: response.data.content.reelerName,
              reelerNumber: response.data.content.reelerNumber,
              reelingLicenseNumber: response.data.content.reelingLicenseNumber,
              virtualAccountNumber: response.data.content.virtualAccountNumber,
            }));

            setData((prev) => ({
              ...prev,
              reelerId: response.data.content.reelerId,
              virtualAccount: response.data.content.virtualAccountNumber,
            }));
            setShow(false);
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

  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  //const _header = { "Content-Type": "application/json", accept: "*/*" };

  //to get Reeler users

  const clear = () => {
    setData({
      reelerId: "",
      initialAmount: "",
      accountNumber: "",
      virtualAccount: "",
    });
    setShowData({
      reelerName: "",
      reelerNumber: "",
      reelingLicenseNumber: "",
      virtualAccountNumber: "",
    });
    setValidated(false);
    setShow(true);
  };

  const [show, setShow] = useState(true);

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

  // to get reeler with market Id
  const [reelerListData, setReelerListData] = useState([]);
  // console.log(reelerListData);

  const getList = (_id) => {
    const response = api
      .get(
        baseURL + `reeler-virtual-bank-account/get-reelers-by-market-id/${_id}`
      )
      .then((response) => {
        setReelerListData([]);
        console.log(response.data.content.reelerVirtualBankAccount);
        setReelerListData(response.data.content.reelerVirtualBankAccount);
      })
      .catch((err) => {
        setReelerListData([]);
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
    <Layout title="Reeler Initial Amount">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Reeler Initial Amount</Block.Title>
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
                      Search Reeler
                    </Form.Label>
                    <Col sm={1} lg={2}>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="select"
                          value={reelerSearch.select}
                          onChange={handleReelerSearchInputs}
                        >
                          {/* <option value="">Select</option> */}
                          <option value="mobileNumber">Mobile Number</option>
                          <option value="reelingLicenseNumber">
                            Reeler License Number
                          </option>
                          <option value="reelerNumber">Reeler Number</option>
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
        <Row>
          <Col lg="6">
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
                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="initial">
                            Initial Amount<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="initial"
                              name="initialAmount"
                              value={data.initialAmount}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter Initial Amount"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Initial Amount is required
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
                      <Button type="submit" variant="primary" disabled={show}>
                        Credit
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
          </Col>
          <Col>
            <Card className="mt-2">
              <Card.Header>Reeler Info</Card.Header>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="12">
                    <table className="table small table-bordered">
                      <tbody>
                        <tr>
                          <td style={styles.ctstyle}> Reeler Name:</td>
                          <td>{showData.reelerName}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}> Reeler Number:</td>
                          <td>{showData.reelerNumber}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>
                            {" "}
                            Reeler License Number:
                          </td>
                          <td>{showData.reelingLicenseNumber}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>
                            {" "}
                            Virtual Account Number:
                          </td>
                          <td>{showData.virtualAccountNumber}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Block>
    </Layout>
  );
}

export default ReelerInitialAmount;
