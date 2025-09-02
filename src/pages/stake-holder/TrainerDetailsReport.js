import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_TRAINING;

function TrainerDetailsReport() {
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [listFarmerData, setListFarmerData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 25;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [isActive, setIsActive] = useState(false);

  const [data, setData] = useState({
    groupId: "",
    programId: "",
    courseId: "",
    modeId: "",
  });


  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `trSchedule/getTrainerDetails`,
        {},
        {
          params: {
            groupId: data.groupId || 0,
            programId: data.programId || 0,
            courseId: data.courseId || 0,
            modeId: data.modeId || 0,
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
        setTotalRows(response.data.totalRecords);
      })
      .catch((err) => {
        setListData([]);
      });
  };

  const exportCsv = (e) => {
    api
      .post(
        baseURLFarmer + `trSchedule/getTrainerReport`,
        {},
        {
          params: {
           groupId: data.groupId || 0,
            programId: data.programId || 0,
            courseId: data.courseId || 0,
            modeId: data.modeId || 0,
          },
          responseType: 'blob',
          headers: {
            accept: "text/csv",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `trainer_report.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        Swal.fire({
          icon: "warning",
          title: "No record found!!!",
        });
      });
};

  const getFarmerList = (e) => {
    api
      .post(
        baseURLFarmer + `trSchedule/getTrainerDetails`,
        {},
        {
          params: {
            groupId: data.groupId || 0,
            programId: data.programId || 0,
            courseId: data.courseId || 0,
            modeId: data.modeId || 0,
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
        setTotalRows(response.data.totalRecords);
      })
      .catch((err) => {
        setListData([]);
      });
  };

  useEffect(() => {
    getFarmerList();
  }, [page]);

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  
    // to get TrGroup
  const [trGroupListData, setTrGroupListData] = useState([]);

  const getTrGroupList = () => {
    const response = api
      .get(baseURL + `trGroupMaster/get-all`)
      .then((response) => {
        setTrGroupListData(response.data.content.trGroupMaster);
      })
      .catch((err) => {
        setTrGroupListData([]);
      });
  };

  useEffect(() => {
    getTrGroupList();
  }, []);

  // to get TrProgram
  const [trProgramListData, setTrProgramListData] = useState([]);

  const getTrProgramList = () => {
    const response = api
      .get(baseURL + `trProgramMaster/get-all`)
      .then((response) => {
        setTrProgramListData(response.data.content.trProgramMaster);
      })
      .catch((err) => {
        setTrProgramListData([]);
      });
  };

  useEffect(() => {
    getTrProgramList();
  }, []);

  // to get Course
  const [trCourseListData, setTrCourseListData] = useState([]);

  const getTrCourseList = () => {
    const response = api
      .get(baseURL + `trCourseMaster/get-all`)
      .then((response) => {
        setTrCourseListData(response.data.content.trCourseMaster);
      })
      .catch((err) => {
        setTrCourseListData([]);
      });
  };

  useEffect(() => {
    getTrCourseList();
  }, []);

  // to get TrMode
  const [trModeListData, setTrModeListData] = useState([]);

  const getTrModeList = () => {
    const response = api
      .get(baseURL + `trModeMaster/get-all`)
      .then((response) => {
        setTrModeListData(response.data.content.trModeMaster);
      })
      .catch((err) => {
        setTrModeListData([]);
      });
  };

  useEffect(() => {
    getTrModeList();
  }, []);

    // to get username
    const [userListData, setUserListData] = useState([]);
  
    const getUserList = () => {
      api
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
        minHeight: "30px", // override the row height
      },
    },
    headCells: {
      style: {
        // '&:not(:last-of-type)': {
        backgroundColor: "#1e67a8",
        color: "#fff",
        borderStyle: "solid",
        bordertWidth: "1px",
        // borderColor: defaultThemes.default.divider.default,
        borderColor: "black",
        // },
      },
    },
    cells: {
      style: {
        // '&:not(:last-of-type)': {
        borderStyle: "solid",
        borderWidth: "1px",
        paddingTop: "3px",
        paddingBottom: "3px",
        paddingLeft: "8px",
        paddingRight: "8px",
        // borderColor: defaultThemes.default.divider.default,
        borderColor: "black",
        // },
      },
    },
  };

  const FarmerDataColumns = [
    {
      name: "Sl.No",
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Training Institution",
      selector: (row) => row.institutionName,
      cell: (row) => <span>{row.institutionName}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Training Group",
      selector: (row) => row.groupName,
      cell: (row) => <span>{row.groupName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Training Program",
      selector: (row) => row.programName,
      cell: (row) => <span>{row.programName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Training Course",
      selector: (row) => row.courseName,
      cell: (row) => <span>{row.courseName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Training Mode",
      selector: (row) => row.modeName,
      cell: (row) => <span>{row.modeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Duration",
      selector: (row) => row.duration,
      cell: (row) => <span>{row.duration}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Period",
      selector: (row) => row.period,
      cell: (row) => <span>{row.period}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Trainer Name",
      selector: (row) => row.trainingName,
      cell: (row) => <span>{row.trainingName}</span>,
      sortable: true,
      hide: "md",
    },  
    {
      name: "Trainer",
      selector: (row) => row.username,
      cell: (row) => <span>{row.username}</span>,
      sortable: true,
      hide: "md",
    },  
    {
      name: "Start Date",
      selector: (row) => row.startDate,
      cell: (row) => <span>{row.startDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Date Of Completion",
      selector: (row) => row.completionDate,
      cell: (row) => <span>{row.completionDate}</span>,
      sortable: true,
      hide: "md",
    },
    
  ];

  return (
    <Layout title={t("Trainer Details Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Trainer Details Report")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent></Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1">
          <Row className="m-4">
            {/* <Col sm={2}>
              <Form.Group className="form-group mt-n4">
                <Form.Label>{t("District")}</Form.Label>
                <div className="form-control-wrap">
                  <Form.Select
                    name="districtId"
                    value={data.districtId}
                    onChange={handleInputs}
                    onBlur={() => handleInputs}
                    isInvalid={
                      data.districtId === undefined || data.districtId === "0"
                    }
                  >
                    <option value="">{t("Select District")}</option>
                    {districtListData && districtListData.length
                      ? districtListData.map((list) => (
                          <option key={list.districtId} value={list.districtId}>
                            {list.districtName}
                          </option>
                        ))
                      : ""}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {t("District Name is required")}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </Col> */}

            

               <Col sm={2}>
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Training Group")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="groupId"
                        value={data.groupId}
                        onChange={handleInputs}
                        // onBlur={() => handleInputs}
                        // required
                        // isInvalid={
                        //   data.trGroupMasterId === undefined ||
                        //   data.trGroupMasterId === "0"
                        // }
                      >
                        <option value="">{t("Select Group")}</option>
                        {trGroupListData.map((list) => (
                          <option
                            key={list.trGroupMasterId}
                            value={list.trGroupMasterId}
                          >
                            {list.trGroupMasterName}
                          </option>
                        ))}
                      </Form.Select>
                      {/* <Form.Control.Feedback type="invalid">
                        {t("Training Group is required")}
                      </Form.Control.Feedback> */}
                    </div>
                  </Form.Group>
                </Col>

                <Col sm={2}>
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Training Program")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="programId"
                        value={data.programId}
                        onChange={handleInputs}
                    
                      >
                        <option value="">{t("Select Program")}</option>
                        {trProgramListData.map((list) => (
                          <option
                            key={list.trProgramMasterId}
                            value={list.trProgramMasterId}
                          >
                            {list.trProgramMasterName}
                          </option>
                        ))}
                      </Form.Select>
                      {/* <Form.Control.Feedback type="invalid">
                        {t("Training Program is required")}
                      </Form.Control.Feedback> */}
                    </div>
                  </Form.Group>
                </Col>

                <Col sm={2}>
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Training Course")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="courseId"
                        value={data.courseId}
                        onChange={handleInputs}
                       
                      >
                        <option value="">{t("Select Course")}</option>
                        {trCourseListData.map((list) => (
                          <option
                            key={list.trCourseMasterId}
                            value={list.trCourseMasterId}
                          >
                            {list.trCourseMasterName}
                          </option>
                        ))}
                      </Form.Select>
                      {/* <Form.Control.Feedback type="invalid">
                        {t("Training Course is required")}
                      </Form.Control.Feedback> */}
                    </div>
                  </Form.Group>
                </Col>

                <Col sm={2}>
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Training Mode")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="modeId"
                        value={data.modeId}
                        onChange={handleInputs}
                        // onBlur={() => handleInputs}
                        // required
                        // isInvalid={
                        //   data.trModeMasterId === undefined ||
                        //   data.trModeMasterId === "0"
                        // }
                      >
                        <option value="">{t("Select Training Mode")}</option>
                        {trModeListData.map((list) => (
                          <option
                            key={list.trModeMasterId}
                            value={list.trModeMasterId}
                          >
                            {list.trModeMasterName}
                          </option>
                        ))}
                      </Form.Select>
                      {/* <Form.Control.Feedback type="invalid">
                        {t("Training Mode is required")}
                      </Form.Control.Feedback> */}
                    </div>
                  </Form.Group>
                </Col>

                    
            <Col sm={1}>
              <Button type="button" variant="primary" onClick={search}>
                {t("Search")}
              </Button>
            </Col>
            <Col sm={1}>
              <Button type="button" variant="primary" onClick={exportCsv}>
                {t("Export")}
              </Button>
            </Col>
          </Row>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={FarmerDataColumns}
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

export default TrainerDetailsReport;
