import { Card, Button, Col, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { createTheme } from "react-data-table-component";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function UserAndManagerHierarchyMappingList() {
  const [listData, setListData] = useState({});

  const [listAllReporteeData, setListAllReporteeData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [validated, setValidated] = useState(false);

  const [data, setData] = useState({
    text: "",
    searchBy: "username",
  });

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const clear = () => {
    setUserData({
    managerId: "",
    userMasterId: "",
    });
  };

  const [userData, setUserData] = useState({
    userMasterId: ""
  });


  // Search
  const search = (e) => {
    let joinColumn;
    if (data.searchBy === "username") {
      joinColumn = "userMaster.username";
    }
    if (data.searchBy === "phoneNumber") {
      joinColumn = "userMaster.phoneNumber";
    }
    // console.log(joinColumn);
    api
      .post(baseURL + `userMaster/search`, {
        searchText: data.text,
        joinColumn: joinColumn,
      })
      .then((response) => {
        setListData(response.data.content.userMaster);

      })
      .catch((err) => {
        // saveError();
      });
  };

  const [activeReportee, setActiveReportee] = useState("direct");

  const getList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `userMaster/getDirectReporteeDetails`)
      .then((response) => {
        setListData(response.data);
        // setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [page]);

  const getAllReporteeList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `userMaster/getAllReporteeDetails`)
      .then((response) => {
        setListAllReporteeData(response.data);
        // setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setListAllReporteeData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllReporteeList();
  }, [page]);

  useEffect(() => {
    if (activeReportee === "direct") {
      getList();
    } else {
      getAllReporteeList();
    }
  }, [activeReportee, page]);

  const navigate = useNavigate();
//   const handleView = (_id) => {
//     navigate(`/seriui/users-view/${_id}`);
//   };

//   const handleEdit = (_id) => {
//     navigate(`/seriui/users-edit/${_id}`);
//     // navigate("/seriui/user");
//   };

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const deleteConfirm = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        const response = api
          .delete(baseURL + `userMaster/delete/${_id}`)
          .then((response) => {
            // deleteConfirm(_id);
            getList();
            Swal.fire(
              "Deleted",
              "You successfully deleted this record",
              "success"
            );
          })
          .catch((err) => {
            deleteError();
          });
        // Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
    });
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
    //   const sendPost = {
    //     reporteeUserMasterId: data.actualUserId,
    //     reportToUserMasterId: data.reportUserMasterId,
    // };
      api
        .post(baseURL + `userMaster/updateManagerDetails`, userData)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setUserData({
              managerId: "",
              userMasterId: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
            if (
                err.response &&
                err.response &&
                err.response.data &&
                err.response.data.validationErrors
              ) {
                if (Object.keys(err.response.data.validationErrors).length > 0) {
                  saveError(err.response.data.validationErrors);
                }
              }
        });
      setValidated(true);
    }
  };

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("#");
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

  // to get designation
  const [userListData, setUserListData] = useState([]);

  const getUserList = () => {
    const response = api
      .get(baseURL + `userMaster/get-all`)
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


  const UserDataColumns = [
    {
      name: "User Name",
      selector: (row) => row.username,
      cell: (row) => <span>{row.username}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "First Name",
      selector: (row) => row.firstName,
      cell: (row) => <span>{row.firstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Last Name",
      selector: (row) => row.lastName,
      cell: (row) => <span>{row.lastName}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "District",
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
      cell: (row) => <span>{row.phoneNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Designation",
      selector: (row) => row.name,
      cell: (row) => <span>{row.name}</span>,
      sortable: true,
      hide: "md",
    },
    
    
  ];

  const UserAllReporteeDataColumns = [
    
    {
      name: "User Name",
      selector: (row) => row.username,
      cell: (row) => <span>{row.username}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "First Name",
      selector: (row) => row.firstName,
      cell: (row) => <span>{row.firstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Last Name",
      selector: (row) => row.lastName,
      cell: (row) => <span>{row.lastName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "District",
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
      cell: (row) => <span>{row.phoneNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Designation",
      selector: (row) => row.name,
      cell: (row) => <span>{row.name}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: "Level",
      selector: (row) => row.level,
      cell: (row) => <span>{row.level}</span>,
      sortable: true,
      hide: "md",
    },
   
  ];


  return (
    <Layout title="List Of Direct And All Reportees Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">List Of Direct And All Reportees Details</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            
            {/* <div className="d-flex justify-content-center align-items-center mt-3">
                <button className="btn btn-primary mx-2">Direct Reportee</button>
                <button className="btn btn-secondary mx-2">All Reportee</button>
            </div> */}
      <div className="d-flex justify-content-center align-items-center mt-3">
        <button
          className={`btn btn-primary mx-2 ${activeReportee === "direct" ? "active" : ""}`}
          onClick={() => setActiveReportee("direct")}
        >
          Direct Reportee
        </button>
        <button
          className={`btn btn-secondary mx-2 ${activeReportee === "all" ? "active" : ""}`}
          onClick={() => setActiveReportee("all")}
        >
          All Reportee
        </button>
      </div>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      {/* <Block className="mt-n4">
        <Form noValidate validated={validated} onSubmit={postData}>
            <Card>
            <Card.Header>User Hierarchy Mapping</Card.Header>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        User<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="userMasterId"
                          value={userData.userMasterId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            userData.userMasterId === undefined ||
                            userData.userMasterId === "0"
                          }
                        >
                          <option value="">Select Reporting Officer</option>
                          {userListData && userListData.length
                            ? userListData.map((list) => (
                                <option
                                  key={list.userMasterId}
                                  value={list.userMasterId}
                                >
                                  {list.username}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          User is required
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
                  <Button type="submit" variant="primary">
                    Direct Reportee
                  </Button>
                </li>

                <li>
                  <Button type="submit" variant="primary">
                    All Reportee
                  </Button>
                </li>
                
              </ul>
            </div>
        </Form>
      </Block> */}

      <Block className="mt-n4">
        <Card>
          {/* <Row className="m-2">
            <Col>
              <Form.Group as={Row} className="form-group" id="fid">
                <Form.Label column sm={1}>
                  Search By
                </Form.Label>
                <Col sm={3}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="searchBy"
                      value={data.searchBy}
                      onChange={handleInputs}
                    >
                      <option value="username">User Name</option>
                      <option value="phoneNumber">Phone Number</option>
                    </Form.Select>
                  </div>
                </Col>

                <Col sm={3}>
                  <Form.Control
                    id="userMasterId"
                    name="text"
                    value={data.text}
                    onChange={handleInputs}
                    type="text"
                    placeholder="Search"
                  />
                </Col>
                <Col sm={3}>
                  <Button type="button" variant="primary" onClick={search}>
                    Search
                  </Button>
                </Col>
              </Form.Group>
            </Col>
          </Row> */}
        {activeReportee === "direct" ? (
        <DataTable
          tableClassName="data-table-head-light table-responsive"
          columns={UserDataColumns}
          data={listData}
          highlightOnHover
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={10}
          paginationComponentOptions={{
            noRowsPerPage: true,
          }}
          onChangePage={(page) => setPage(page - 1)}
          progressPending={loading}
          theme="solarized"
          customStyles={customStyles}
        />
      ) : (
        <DataTable
          tableClassName="data-table-head-light table-responsive"
          columns={UserAllReporteeDataColumns}
          data={listAllReporteeData}
          highlightOnHover
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={10}
          paginationComponentOptions={{
            noRowsPerPage: true,
          }}
          onChangePage={(page) => setPage(page - 1)}
          progressPending={loading}
          theme="solarized"
          customStyles={customStyles}
        />
      )}
        </Card>
      </Block>
    </Layout>
  );
}

export default UserAndManagerHierarchyMappingList;
