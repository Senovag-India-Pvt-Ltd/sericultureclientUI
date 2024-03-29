import { Card, Form, Row, Col, Button } from "react-bootstrap";
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
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
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
    // {
    //   name: "Action",
    //   width: "300px",
    //   headerStyle: (selector, id) => {
    //     return { textAlign: "center" };
    //   },
    // },
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
    Swal.fire({
      icon: "error",
      title: "Attempt was not successful",
      html: Object.values(message).join("<br>"),
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
            <ul className="d-flex">
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
            </ul>
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
    </Layout>
  );
}

export default ReelerActivate;
