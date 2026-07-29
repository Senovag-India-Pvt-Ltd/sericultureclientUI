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
import { useTranslation } from "react-i18next";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_TRAINING;
// const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function TrainerPageList() {
  const { t } = useTranslation();
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
    table: { style: { borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(30, 103, 168, 0.06)" } },
    rows: {
      style: { minHeight: "52px", fontSize: "13.5px", color: "#2b2d42", borderBottom: "1px solid #eef1f6 !important", transition: "background-color 0.15s ease" },
      highlightOnHoverStyle: { backgroundColor: "#f4f8fd", cursor: "pointer", outline: "none" },
      stripedStyle: { backgroundColor: "#fbfcfe" },
    },
    headRow: { style: { minHeight: "50px", background: "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" } },
    headCells: {
      style: {
        backgroundColor: "transparent",
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.3px",
        textTransform: "uppercase",
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
    pagination: { style: { borderTop: "1px solid #eef1f6", fontSize: "13px", color: "#5a6577" } },
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
      name: t("Action"),
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
            className="d-inline-flex align-items-center gap-1 shadow-sm"
          >
            <Icon name="eye" />
            {t("View")}
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
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm"
          >
            <Icon name="check-circle" />
            {t("Attendance")}
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2,
    },
    // {
    //   name: t("Training Schedule Id"),
    //   selector: (row) => row.trScheduleId,
    //   cell: (row) => <span>{row.trScheduleId}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: t("Date"),
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
      name: t("Training Group Name"),
      selector: (row) => row.trGroupMasterName,
      cell: (row) => <span>{row.trGroupMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Training Program Name"),
      selector: (row) => row.trProgramMasterName,
      cell: (row) => <span>{row.trProgramMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Training Course Name"),
      selector: (row) => row.trCourseMasterName,
      cell: (row) => <span>{row.trCourseMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Training Mode"),
      selector: (row) => row.trModeMasterName,
      cell: (row) => <span>{row.trModeMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("District"),
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Taluk"),
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Working Institution"),
      selector: (row) => row.workingInstitutionName,
      cell: (row) => <span>{row.workingInstitutionName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Designation"),
      selector: (row) => row.designationName,
      cell: (row) => <span>{row.designationName}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title={t("Trainer Page List")}>
      <style>{trainerPageListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Trainer Page List")}
              </Block.Title>
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
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card>
          <Row className="m-2">
            <Col>
              <Form.Group as={Row} className="form-group" id="fid">
                <Form.Label column sm={1}>
                  {t("Search By")}
                </Form.Label>
                <Col sm={3}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="searchBy"
                      value={data.searchBy}
                      onChange={handleInputs}
                    >
                      {/* <option value="">Select</option> */}
                      <option value="trStartDate">{t("Start Date")}</option>
                      <option value="trGroupMasterName">{t("Training Group")}</option>
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
                      placeholder={t("Search")}
                    />
                  </Col>
                )}

                <Col sm={3}>
                  <Button type="button" variant="primary" onClick={search} className="d-inline-flex align-items-center gap-1">
                    <Icon name="search" />
                    {t("Search")}
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

const trainerPageListStyles = `
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

export default TrainerPageList;
