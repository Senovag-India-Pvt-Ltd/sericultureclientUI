import { Card, Button, Col, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import { createTheme } from "react-data-table-component";
// import DataTable from "../../../components/DataTable/DataTable";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "../../services/auth/api";
import DatePicker from "react-datepicker";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_TRAINING;
// const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function TrainerPageList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [data, setData] = useState({
    text: "",
    date: "",
    searchBy: "trStartDate",
  });

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // // Search
  // const search = (e) => {
  //   let joinColumn;
  //   if (data.searchBy === "trStartDate") {
  //     joinColumn = "trSchedule.trStartDate";
  //   }
  //   if (data.searchBy === "trGroupMasterName") {
  //     joinColumn = "trGroupMaster.trGroupMasterName";
  //   }
  //   // console.log(joinColumn);
  //   api
  //     .post(
  //       baseURL2 + `trSchedule/search`,
  //       {
  //         searchText: data.text,
  //         joinColumn: joinColumn,
  //       },
  //       {
  //         headers: _header,
  //       }
  //     )
  //     .then((response) => {
  //       setListData(response.data.content.trSchedule);
  //     })
  //     .catch((err) => {
  //     });
  // };
  // Search
  const search = (e) => {
    let joinColumn;
    if (data.searchBy === "trStartDate") {
      joinColumn = "trSchedule.trStartDate";
      const formattedFromDate =
      new Date(data.date).getFullYear() +
      "-" +
      (new Date(data.date).getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      new Date(data.date).getDate().toString().padStart(2, "0");
      api
        .post(
          baseURL2 + `trSchedule/search-by-user`,
          {
            searchText: formattedFromDate,
            joinColumn: joinColumn,
            userMasterId: localStorage.getItem("userMasterId"),
          },
          {
            headers: _header,
          }
        )
        .then((response) => {
          setListData(response.data.content.trSchedule);
          setTotalRows(response.data.content.totalItems);
          setLoading(false);

          // if (response.data.content.error) {
          //   // saveError();
          // } else {
          //   console.log(response);
          //   // saveSuccess();
          // }
        })
        .catch((err) => {
          // saveError();
        });
    }
    if (data.searchBy === "trGroupMasterName") {
      joinColumn = "trGroupMaster.trGroupMasterName";
      api
        .post(
          baseURL2 + `trSchedule/search-by-user`,
          {
            searchText: data.text,
            joinColumn: joinColumn,
            userMasterId: localStorage.getItem("userMasterId"),
          },
          {
            headers: _header,
          }
        )
        .then((response) => {
          setListData(response.data.content.trSchedule);
          setTotalRows(response.data.content.totalItems);
          setLoading(false);

          // if (response.data.content.error) {
          //   // saveError();
          // } else {
          //   console.log(response);
          //   // saveSuccess();
          // }
        })
        .catch((err) => {
          // saveError();
        });
    }

    // console.log(joinColumn);
  };

  const [trScheduleList, setTrScheduleListData] = useState({
    userMasterId: localStorage.getItem("userMasterId"),
  });

  const getList = (e) => {
    // setLoading(true);
    api
      .post(baseURL2 + `trSchedule/get-by-user-master-id`, { userMasterId: e })
      .then((response) => {
        setListData(response.data.content.trSchedule);
        setTotalRows(response.data.content.totalItems);
        setLoading(false);
        if (response.data.content.error) {
          setListData([]);
        }
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    if (trScheduleList.userMasterId) {
      getList(trScheduleList.userMasterId);
    }
  }, [trScheduleList.userMasterId]);

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/trainer-page-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/trainer-page-edit/${_id}`);
    // navigate("/seriui/state");
  };

  const handleAttendance = (_id) => {
    navigate(`/seriui/trainee-attendance-page/${_id}`);
    // navigate("/seriui/state");
  };

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  // const deleteConfirm = (_id) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "It will delete permanently!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, delete it!",
  //   }).then((result) => {
  //     if (result.value) {
  //       api
  //         .delete(baseURL2 + `trSchedule/delete/${_id}`)
  //         .then((response) => {
  //           // deleteConfirm(_id);
  //           getList();
  //           Swal.fire(
  //             "Deleted",
  //             "You successfully deleted this record",
  //             "success"
  //           );
  //         })
  //         .catch((err) => {
  //           deleteError();
  //         });
  //       // Swal.fire("Deleted", "You successfully deleted this record", "success");
  //     } else {
  //       Swal.fire("Cancelled", "Your record is not deleted", "info");
  //     }
  //   });
  // };

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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const TrTraineeLicenseDataColumns = [
    {
      name: "Action",
      width: "300px",
      headerStyle: (selector, id) => {
        return { textAlign: "center" };
      },
      cell: (row) => (
        //   Button style
        <div className="text-end w-100 d-flex justify">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.trScheduleId)}
          >
            View
          </Button>
          {/* <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.trScheduleId)}
          >
            Edit
          </Button> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleAttendance(row.trScheduleId)}
            className="ms-2"
          >
            Attendance
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2,
    },
    {
      name: "Training Schedule Id",
      selector: (row) => row.trScheduleId,
      cell: (row) => <span>{row.trScheduleId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Date",
      selector: (row) => row.trStartDate,
      cell: (row) => <span>{formatDate(row.trStartDate)}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Training Institution Name",
    //   selector: (row) => row.trInstitutionMasterName,
    //   cell: (row) => <span>{row.trInstitutionMasterName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Training Group Name",
      selector: (row) => row.trGroupMasterName,
      cell: (row) => <span>{row.trGroupMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Training Program Name",
      selector: (row) => row.trProgramMasterName,
      cell: (row) => <span>{row.trProgramMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Training Course Name",
      selector: (row) => row.trCourseMasterName,
      cell: (row) => <span>{row.trCourseMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Training Mode",
      selector: (row) => row.trModeMasterName,
      cell: (row) => <span>{row.trModeMasterName}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title="Trainer Page List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Trainer Page List</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            {/* <ul className="d-flex">
              <li>
                <Link
                  to="#"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
            </ul> */}
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
          <Row className="m-2">
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
                      {/* <option value="">Select</option> */}
                      <option value="trStartDate">Start Date</option>
                      <option value="trGroupMasterName">Training Group</option>
                    </Form.Select>
                  </div>
                </Col>
                {data.searchBy === "trStartDate" ? (
                  <Col sm={2}>
                    <Form.Group className="form-group">
                      {/* <Form.Label htmlFor="sordfl">
                      Training Period Start Date<span className="text-danger">*</span>
                      </Form.Label> */}
                      <div className="form-control-wrap">
                        <DatePicker
                          selected={data.date}
                          onChange={(date) => handleDateChange(date, "date")}
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          // minDate={new Date()}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                ) : (
                  <Col sm={3}>
                    <Form.Control
                      id="trScheduleId"
                      name="text"
                      value={data.text}
                      onChange={handleInputs}
                      type="text"
                      placeholder="Search"
                    />
                  </Col>
                )}

                <Col sm={3}>
                  <Button type="button" variant="primary" onClick={search}>
                    Search
                  </Button>
                </Col>
              </Form.Group>
            </Col>
          </Row>
          <DataTable
            // title="Reeler License List"
            tableClassName="data-table-head-light table-responsive"
            columns={TrTraineeLicenseDataColumns}
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
    </Layout>
  );
}

export default TrainerPageList;
