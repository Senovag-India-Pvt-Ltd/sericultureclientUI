import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import api from "../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_TRAINING;

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";
const CTRL_H = "44px";
const lbl = { fontSize: "12px", fontWeight: 600, color: "#212529", marginBottom: "3px", display: "block" };
const sel = { height: CTRL_H, fontSize: "14px", backgroundColor: "#fff" };

function TrainingDeputationTrackerReport() {
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
    programId: "",
    courseId: "",
  });

  const search = (e) => {
    api
      .post(
        baseURLFarmer + `trainingDeputationTracker/getDeputationTrackerDetails`,
        {},
        {
          params: {
            programId: data.programId || 0,
            courseId: data.courseId || 0,
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
        baseURLFarmer + `trainingDeputationTracker/getDeputationTrackerReport`,
        {},
        {
          params: {
            programId: data.programId || 0,
            courseId: data.courseId || 0,
          },
          responseType: 'blob',
          headers: {
             accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `deputation_tracker_report.xlsx`;
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
        baseURLFarmer + `trainingDeputationTracker/getDeputationTrackerDetails`,
        {},
        {
          params: {
            programId: data.programId || 0,
            courseId: data.courseId || 0,
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
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const [trGroupListData, setTrGroupListData] = useState([]);
  const getTrGroupList = () => {
    api
      .get(baseURL + `trGroupMaster/get-all`)
      .then((response) => setTrGroupListData(response.data.content.trGroupMaster))
      .catch((err) => setTrGroupListData([]));
  };
  useEffect(() => { getTrGroupList(); }, []);

  const [trProgramListData, setTrProgramListData] = useState([]);
  const getTrProgramList = () => {
    api
      .get(baseURL + `trProgramMaster/get-all`)
      .then((response) => setTrProgramListData(response.data.content.trProgramMaster))
      .catch((err) => setTrProgramListData([]));
  };
  useEffect(() => { getTrProgramList(); }, []);

  const [trCourseListData, setTrCourseListData] = useState([]);
  const getTrCourseList = () => {
    api
      .get(baseURL + `trCourseMaster/get-all`)
      .then((response) => setTrCourseListData(response.data.content.trCourseMaster))
      .catch((err) => setTrCourseListData([]));
  };
  useEffect(() => { getTrCourseList(); }, []);

  const [trModeListData, setTrModeListData] = useState([]);
  const getTrModeList = () => {
    api
      .get(baseURL + `trModeMaster/get-all`)
      .then((response) => setTrModeListData(response.data.content.trModeMaster))
      .catch((err) => setTrModeListData([]));
  };
  useEffect(() => { getTrModeList(); }, []);

  const [userListData, setUserListData] = useState([]);
  const getUserList = () => {
    api
      .get(baseURL + `userMaster/get-all`)
      .then((response) => setUserListData(response.data.content.userMaster))
      .catch((err) => setUserListData([]));
  };
  useEffect(() => { getUserList(); }, []);

  const customStyles = {
    headRow: { style: { minHeight: "52px", height: "auto" } },
    headCells: {
      style: {
        background: ACCENT_TABLE, color: "#fff", fontWeight: 700, fontSize: "13px",
        padding: "10px 8px", borderRight: "1px solid rgba(255,255,255,0.5)",
        borderBottom: "2px solid rgba(255,255,255,0.6)", whiteSpace: "normal",
        wordBreak: "break-word", overflowWrap: "break-word", overflow: "visible",
        lineHeight: "1.4", minHeight: "52px", height: "auto",
        verticalAlign: "middle", justifyContent: "center", textAlign: "center",
      },
    },
    rows: {
      style: {
        minHeight: "32px",
        "&:nth-of-type(odd)":  { background: "#fff" },
        "&:nth-of-type(even)": { background: "#f7fafd" },
      },
    },
    cells: {
      style: {
        borderRight: "1px solid #eef2f7", borderBottom: "1px solid #e8edf5",
        paddingTop: "4px", paddingBottom: "4px", paddingLeft: "8px", paddingRight: "8px",
        color: "#2d3748", fontSize: "13px", justifyContent: "center", textAlign: "center",
      },
    },
  };

  const colHeader = (label) => (
    <div style={{ whiteSpace: "normal", wordBreak: "break-word", textAlign: "center", lineHeight: "1.4", width: "100%", padding: "2px 0" }}>
      {label}
    </div>
  );

  const FarmerDataColumns = [
    { name: colHeader("Sl.No"),            selector: (row) => row.serialNumber,      cell: (row) => <span>{row.serialNumber}</span>,      sortable: true, hide: "md" },
    { name: colHeader("Name"),             selector: (row) => row.officialName,      cell: (row) => <span>{row.officialName}</span>,      sortable: true, hide: "md" },
    { name: colHeader("Designation"),      selector: (row) => row.designationName,   cell: (row) => <span>{row.designationName}</span>,   sortable: true, hide: "md" },
    { name: colHeader("Deputed Institute"),selector: (row) => row.deputedInstituteName, cell: (row) => <span>{row.deputedInstituteName}</span>, sortable: true, hide: "md" },
    { name: colHeader("Program"),          selector: (row) => row.programName,       cell: (row) => <span>{row.programName}</span>,       sortable: true, hide: "md" },
    { name: colHeader("Course"),           selector: (row) => row.courseName,        cell: (row) => <span>{row.courseName}</span>,        sortable: true, hide: "md" },
    { name: colHeader("Address"),          selector: (row) => row.officialAddress,   cell: (row) => <span>{row.officialAddress}</span>,   sortable: true, hide: "md" },
    { name: colHeader("Mobile Number"),    selector: (row) => row.mobileNumber,      cell: (row) => <span>{row.mobileNumber}</span>,      sortable: true, hide: "md" },
    { name: colHeader("From Date"),        selector: (row) => row.deputedFromDate,   cell: (row) => <span>{row.deputedFromDate}</span>,   sortable: true, hide: "md" },
    { name: colHeader("To Date"),          selector: (row) => row.deputedToDate,     cell: (row) => <span>{row.deputedToDate}</span>,     sortable: true, hide: "md" },
    { name: colHeader("Attended"),         selector: (row) => row.deputedAttended,   cell: (row) => <span>{row.deputedAttended}</span>,   sortable: true, hide: "md" },
    { name: colHeader("Remarks"),          selector: (row) => row.deputedRemarks,    cell: (row) => <span>{row.deputedRemarks}</span>,    sortable: true, hide: "md" },
  ];

  return (
    <Layout title={t("Training Deputation Tracker Details Report")}>
      <style>{trainingDeputationTrackerReportStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Training Deputation Tracker Details Report")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent></Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontSize: "20px" }}>📋</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>Training Deputation Tracker Details Report</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>Select filters to view and export deputation tracker data</div>
            </div>
          </div>
          <Card.Body className="pb-2">
            <Row className="g-2 mb-2 align-items-end">
              <Col lg={3}>
                <label style={lbl}>{t("Training Program")}</label>
                <Form.Select name="programId" value={data.programId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Program")}</option>
                  {trProgramListData.map((list) => (
                    <option key={list.trProgramMasterId} value={list.trProgramMasterId}>
                      {list.trProgramMasterName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col lg={3}>
                <label style={lbl}>{t("Training Course")}</label>
                <Form.Select name="courseId" value={data.courseId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Course")}</option>
                  {trCourseListData.map((list) => (
                    <option key={list.trCourseMasterId} value={list.trCourseMasterId}>
                      {list.trCourseMasterName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs="auto" style={{ paddingTop: "20px" }}>
                <button onClick={search} style={{ height: CTRL_H, padding: "0 20px", background: ACCENT_TABLE, color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "13px", cursor: "pointer", marginRight: "8px" }}>
                  {t("Search")}
                </button>
                <button onClick={exportCsv} style={{ height: CTRL_H, padding: "0 20px", background: "linear-gradient(135deg,#2d7a2d,#38a838)", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
                  {t("Export")}
                </button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mt-3" style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.08)" }}>
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
            customStyles={customStyles}
          />
        </Card>
      </Block>
    </Layout>
  );
}

const trainingDeputationTrackerReportStyles = `
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

export default TrainingDeputationTrackerReport;
