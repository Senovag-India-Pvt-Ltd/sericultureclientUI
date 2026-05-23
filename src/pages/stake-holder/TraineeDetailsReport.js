import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { createTheme } from "react-data-table-component";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_TRAINING;

createTheme(
  "solarized",
  {
    text: { primary: "#004b8e", secondary: "#2aa198" },
    background: { default: "#fff" },
    context: { background: "#cb4b16", text: "#FFFFFF" },
    divider: { default: "#d3d3d3" },
    action: {
      button: "rgba(0,0,0,.54)",
      hover: "rgba(0,0,0,.02)",
      disabled: "rgba(0,0,0,.12)",
    },
  },
  "light"
);

const customStyles = {
  rows: { style: { minHeight: "30px" } },
  headCells: {
    style: {
      backgroundColor: "#1e67a8",
      color: "#fff",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "black",
    },
  },
  cells: {
    style: {
      borderStyle: "solid",
      borderWidth: "1px",
      paddingTop: "3px",
      paddingBottom: "3px",
      paddingLeft: "8px",
      paddingRight: "8px",
      borderColor: "black",
    },
  },
};

function TraineeDetailsReport() {
  const { t } = useTranslation();
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const countPerPage = 25;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    institutionId: "",
    groupId: "",
    programId: "",
    courseId: "",
    modeId: "",
  });

  const search = () => {
    setPage(0);
    api
      .post(
        baseURLFarmer + `trTrainee/getTraineeDetails`,
        {},
        {
          params: {
            institutionId: data.institutionId || 0,
            groupId: data.groupId || 0,
            programId: data.programId || 0,
            courseId: data.courseId || 0,
            modeId: data.modeId || 0,
            pageNumber: 0,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
        setTotalRows(response.data.totalRecords);
      })
      .catch(() => {
        setListData([]);
      });
  };

  const exportCsv = () => {
    api
      .post(
        baseURLFarmer + `trTrainee/getTraineeReport`,
        {},
        {
          params: {
            institutionId: data.institutionId || 0,
            groupId: data.groupId || 0,
            programId: data.programId || 0,
            courseId: data.courseId || 0,
            modeId: data.modeId || 0,
          },
          responseType: "blob",
          headers: {
            accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `trainee_report.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch(() => {
        Swal.fire({ icon: "warning", title: "No record found!!!" });
      });
  };

  const getTraineeList = () => {
    api
      .post(
        baseURLFarmer + `trTrainee/getTraineeDetails`,
        {},
        {
          params: {
            institutionId: data.institutionId || 0,
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
      .catch(() => {
        setListData([]);
      });
  };

  useEffect(() => {
    getTraineeList();
  }, [page]);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const [trInstitutionListData, setTrInstitutionListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURL + `trInstitutionMaster/get-all`)
      .then((response) => setTrInstitutionListData(response.data.content.trInstitutionMaster))
      .catch(() => setTrInstitutionListData([]));
  }, []);

  const [trGroupListData, setTrGroupListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURL + `trGroupMaster/get-all`)
      .then((response) => setTrGroupListData(response.data.content.trGroupMaster))
      .catch(() => setTrGroupListData([]));
  }, []);

  const [trProgramListData, setTrProgramListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURL + `trProgramMaster/get-all`)
      .then((response) => setTrProgramListData(response.data.content.trProgramMaster))
      .catch(() => setTrProgramListData([]));
  }, []);

  const [trCourseListData, setTrCourseListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURL + `trCourseMaster/get-all`)
      .then((response) => setTrCourseListData(response.data.content.trCourseMaster))
      .catch(() => setTrCourseListData([]));
  }, []);

  const [trModeListData, setTrModeListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURL + `trModeMaster/get-all`)
      .then((response) => setTrModeListData(response.data.content.trModeMaster))
      .catch(() => setTrModeListData([]));
  }, []);

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
      name: "Trainee Name",
      selector: (row) => row.traineeName,
      cell: (row) => <span>{row.traineeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Designation",
      selector: (row) => row.designationName,
      cell: (row) => <span>{row.designationName}</span>,
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
    {
      name: "Mobile Number",
      selector: (row) => row.mobileNumber,
      cell: (row) => <span>{row.mobileNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Place",
      selector: (row) => row.place,
      cell: (row) => <span>{row.place}</span>,
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
      name: "Post Test Score",
      selector: (row) => row.postTestScore,
      cell: (row) => <span>{row.postTestScore}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Pre Test Score",
      selector: (row) => row.preTestScore,
      cell: (row) => <span>{row.preTestScore}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Percentage Improved",
      selector: (row) => row.percentageImproved,
      cell: (row) => <span>{row.percentageImproved}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title={t("Trainee Details Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Trainee Details Report")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent></Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1">
          <Row className="m-4">
            <Col sm={2}>
              <Form.Group className="form-group mt-n4">
                <Form.Label>{t("Training Institution")}</Form.Label>
                <div className="form-control-wrap">
                  <Form.Select name="institutionId" value={data.institutionId} onChange={handleInputs}>
                    <option value="">{t("Select Institution")}</option>
                    {trInstitutionListData.map((list) => (
                      <option key={list.trInstitutionMasterId} value={list.trInstitutionMasterId}>
                        {list.trInstitutionMasterName}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>

            <Col sm={2}>
              <Form.Group className="form-group mt-n4">
                <Form.Label>{t("Training Group")}</Form.Label>
                <div className="form-control-wrap">
                  <Form.Select name="groupId" value={data.groupId} onChange={handleInputs}>
                    <option value="">{t("Select Group")}</option>
                    {trGroupListData.map((list) => (
                      <option key={list.trGroupMasterId} value={list.trGroupMasterId}>
                        {list.trGroupMasterName}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>

            <Col sm={2}>
              <Form.Group className="form-group mt-n4">
                <Form.Label>{t("Training Program")}</Form.Label>
                <div className="form-control-wrap">
                  <Form.Select name="programId" value={data.programId} onChange={handleInputs}>
                    <option value="">{t("Select Program")}</option>
                    {trProgramListData.map((list) => (
                      <option key={list.trProgramMasterId} value={list.trProgramMasterId}>
                        {list.trProgramMasterName}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>

            <Col sm={2}>
              <Form.Group className="form-group mt-n4">
                <Form.Label>{t("Training Course")}</Form.Label>
                <div className="form-control-wrap">
                  <Form.Select name="courseId" value={data.courseId} onChange={handleInputs}>
                    <option value="">{t("Select Course")}</option>
                    {trCourseListData.map((list) => (
                      <option key={list.trCourseMasterId} value={list.trCourseMasterId}>
                        {list.trCourseMasterName}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>

            <Col sm={2}>
              <Form.Group className="form-group mt-n4">
                <Form.Label>{t("Training Mode")}</Form.Label>
                <div className="form-control-wrap">
                  <Form.Select name="modeId" value={data.modeId} onChange={handleInputs}>
                    <option value="">{t("Select Training Mode")}</option>
                    {trModeListData.map((list) => (
                      <option key={list.trModeMasterId} value={list.trModeMasterId}>
                        {list.trModeMasterName}
                      </option>
                    ))}
                  </Form.Select>
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
            paginationComponentOptions={{ noRowsPerPage: true }}
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

export default TraineeDetailsReport;
