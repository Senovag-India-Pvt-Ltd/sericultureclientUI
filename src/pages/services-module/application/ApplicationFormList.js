import { Card, Button, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function ApplicationFormList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 500;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  // const [data, setData] = useState({
  //   userMasterId: "",
  // });

  // const handleInputs = (e) => {
  //   // debugger;
  //   let { name, value } = e.target;
  //   setData({ ...data, [name]: value });
  // };

  // Search
  //   const search = (e) => {
  //     let joinColumn;
  //     if (data.searchBy === "marketMasterName") {
  //       joinColumn = "marketMaster.marketMasterName";
  //     }
  //     if (data.searchBy === "marketTypeMasterName") {
  //       joinColumn = "marketTypeMaster.marketTypeMasterName";
  //     }
  //     // console.log(joinColumn);
  //     api
  //       .post(baseURL + `marketMaster/search`, {
  //         searchText: data.text,
  //         joinColumn: joinColumn,
  //       })
  //       .then((response) => {
  //         setListData(response.data.content.marketMaster);

  //         // if (response.data.content.error) {
  //         //   // saveError();
  //         // } else {
  //         //   console.log(response);
  //         //   // saveSuccess();
  //         // }
  //       })
  //       .catch((err) => {
  //         // saveError();
  //       });
  //   };
//   const [landData, setLandData] = useState({
//     landId: "",
//     talukId: "",
//   });

//   const handleRadioChange = (_id, tId) => {
//     if (!tId) {
//       tId = 0;
//     }
//     setLandData((prev) => ({ ...prev, landId: _id, talukId: tId }));
//   };

//   const [applicationIds, setApplicationIds] = useState([]);
//   const [unselectedApplicationIds, setUnselectedApplicationIds] = useState([]);
//   const [allApplicationIds, setAllApplicationIds] = useState([]);

//   const handleCheckboxChange = (_id) => {
//     if (applicationIds.includes(_id)) {
//       const dataList = [...applicationIds];
//       const newDataList = dataList.filter((data) => data !== _id);
//       setApplicationIds(newDataList);
//     } else {
//       setApplicationIds((prev) => [...prev, _id]);
//     }
//   };

//   useEffect(() => {
//     setUnselectedApplicationIds(
//       allApplicationIds.filter((id) => !applicationIds.includes(id))
//     );
//   }, [allApplicationIds, applicationIds]);

//   //   console.log("Unselected",unselectedApplicationIds);
//   const [validated, setValidated] = useState(false);
//   const postData = (event) => {
//     const post = {
//       applicationFormIds: applicationIds,
//       applicationFormIdsNotSelected: unselectedApplicationIds,
//       inspectorId: localStorage.getItem("userMasterId"),
//     };
//     const form = event.currentTarget;
//     if (form.checkValidity() === false) {
//       event.preventDefault();
//       event.stopPropagation();
//       setValidated(true);
//     } else {
//       event.preventDefault();
//       api
//         .post(baseURLDBT + `service/updateApplicationStatus`, post)
//         .then((response) => {
//           if (response.data.content.errorCode) {
//             saveError(response.data.content.error_description);
//           } else {
//             saveSuccess();
//             getList();
//           }
//         })
//         .catch((err) => {
//           saveError(err.response.data.validationErrors);
//         });
//       setValidated(true);
//     }
//   };

//   const clear = (e) => {
//     e.preventDefault();
//     window.location.reload();
//     // setAllApplicationIds([]);
//     // setUnselectedApplicationIds([]);
//     // setAllApplicationIds([]);
//   };

  const getList = () => {
    setLoading(true);
    api
      .get(baseURLDBT + `service/list-with-join`)
      .then((response) => {
        setListData(response.data.content.applicationForm);
        setTotalRows(response.data.content.totalItems);
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

//   console.log(allApplicationIds);

  // to get User Master
  // const [userListData, setUserListData] = useState([]);

  // const getUserList = () => {
  //   api
  //     .get(baseURL + `userMaster/get-all`)
  //     .then((response) => {
  //       setUserListData(response.data.content.userMaster);
  //     })
  //     .catch((err) => {
  //       setUserListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getUserList();
  // }, []);

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/market-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/application-form-edit/${_id}`);
    // navigate("/seriui/district");
  };

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
          .delete(baseURL + `marketMaster/delete/${_id}`)
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

  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: message,
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

  const ApplicationDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          {/* <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.marketMasterId)}
          >
            View
          </Button> */}
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.id)}
          >
            Edit
          </Button>
          {/* <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.marketMasterId)}
            className="ms-2"
          >
            Delete
          </Button> */}
        </div>
      ),
      sortable: false,
      hide: "md",
    //   grow: 2,
    },
    // {
    //   name: "Select",
    //   selector: "select",
    //   cell: (row) => (
    //     <input
    //       type="checkbox"
    //       name="selectedLand"
    //       value={row.scApplicationFormId}
    //       checked={applicationIds.includes(row.scApplicationFormId)}
    //       onChange={() => handleCheckboxChange(row.scApplicationFormId)}
    //     />
    //   ),
    //   // ignoreRowClick: true,
    //   // allowOverflow: true,
    //   button: true,
    // },
    {
        name: "Arn Number",
        selector: (row) => row.arn,
        cell: (row) => <span>{row.arn}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: "Farmer Name",
      selector: (row) => row.farmerFirstName,
      cell: (row) => <span>{row.farmerFirstName}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Market Name in Kannada",
    //   selector: (row) => row.marketNameInKannada,
    //   cell: (row) => <span>{row.marketNameInKannada}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Market Address",
    //   selector: (row) => row.marketMasterAddress,
    //   cell: (row) => <span>{row.marketMasterAddress}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Head of Account",
      selector: (row) => row.headAccountName,
      cell: (row) => <span>{row.headAccountName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Scheme Name",
      selector: (row) => row.schemeName,
      cell: (row) => <span>{row.schemeName}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "State",
    //   selector: (row) => row.stateName,
    //   cell: (row) => <span>{row.stateName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Sub Scheme Name",
      selector: (row) => row.subSchemeName,
      cell: (row) => <span>{row.subSchemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Minimum Quantity",
      selector: (row) => row.minQty,
      cell: (row) => <span>{row.minQty}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Maximum Quantity",
      selector: (row) => row.maxQty,
      cell: (row) => <span>{row.maxQty}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title="Application Form List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Application Form List</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/dbt-application"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>New Application</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/dbt-application"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>New Application</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

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
                     
                      <option value="marketMasterName">Market</option>
                      <option value="marketTypeMasterName">Market Type</option>
                    </Form.Select>
                  </div>
                </Col>

                <Col sm={3}>
                  <Form.Control
                    id="marketMasterId"
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
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={ApplicationDataColumns}
            data={listData}
            highlightOnHover
            // pagination
            // paginationServer
            // paginationTotalRows={totalRows}
            // paginationPerPage={countPerPage}
            // paginationComponentOptions={{
            //   noRowsPerPage: true,
            // }}
            // onChangePage={(page) => setPage(page - 1)}
            progressPending={loading}
            theme="solarized"
            customStyles={customStyles}
          />
        </Card>
      </Block>

      {/* <div className="gap-col mt-1">
        <ul className="d-flex align-items-center justify-content-center gap g-3">
          <li>
            <Button type="submit" variant="primary" onClick={postData}>
              Save
            </Button>
          </li>
          <li>
            <Button type="button" variant="secondary" onClick={(e) => clear(e)}>
              Cancel
            </Button>
          </li>
        </ul>
      </div> */}
      {/* <Block className="">
        <Row className="g-3 ">
          <Form noValidate validated={validated} onSubmit={postData}>
            <Card>
              <Card.Body>
                <Row className="g-gs ">
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        User<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="userMasterId"
                          value={data.userMasterId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.userMasterId === undefined ||
                            data.userMasterId === "0"
                          }
                        >
                          <option value="">Select User</option>
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
                          User name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
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
        </Row>
      </Block> */}
    </Layout>
  );
}

export default ApplicationFormList;
