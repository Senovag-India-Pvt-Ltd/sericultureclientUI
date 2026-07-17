import { Card, Form, Row, Col } from "react-bootstrap";
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

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";
const CTRL_H = "44px";
const lbl = { fontSize: "12px", fontWeight: 600, color: "#212529", marginBottom: "3px", display: "block" };
const sel = { height: CTRL_H, fontSize: "14px", backgroundColor: "#fff" };

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
    { name: colHeader("Sl.No"),                selector: (row) => row.serialNumber,      cell: (row) => <span>{row.serialNumber}</span>,      sortable: true, hide: "md" },
    { name: colHeader("Training Institution"), selector: (row) => row.institutionName,   cell: (row) => <span>{row.institutionName}</span>,   sortable: true, hide: "md" },
    { name: colHeader("Training Group"),       selector: (row) => row.groupName,         cell: (row) => <span>{row.groupName}</span>,         sortable: true, hide: "md" },
    { name: colHeader("Training Program"),     selector: (row) => row.programName,       cell: (row) => <span>{row.programName}</span>,       sortable: true, hide: "md" },
    { name: colHeader("Training Course"),      selector: (row) => row.courseName,        cell: (row) => <span>{row.courseName}</span>,        sortable: true, hide: "md" },
    { name: colHeader("Training Mode"),        selector: (row) => row.modeName,          cell: (row) => <span>{row.modeName}</span>,          sortable: true, hide: "md" },
    { name: colHeader("Duration"),             selector: (row) => row.duration,          cell: (row) => <span>{row.duration}</span>,          sortable: true, hide: "md" },
    { name: colHeader("Period"),               selector: (row) => row.period,            cell: (row) => <span>{row.period}</span>,            sortable: true, hide: "md" },
    { name: colHeader("Trainee Name"),         selector: (row) => row.traineeName,       cell: (row) => <span>{row.traineeName}</span>,       sortable: true, hide: "md" },
    { name: colHeader("Designation"),          selector: (row) => row.designationName,   cell: (row) => <span>{row.designationName}</span>,   sortable: true, hide: "md" },
    { name: colHeader("Start Date"),           selector: (row) => row.startDate,         cell: (row) => <span>{row.startDate}</span>,         sortable: true, hide: "md" },
    { name: colHeader("Date Of Completion"),   selector: (row) => row.completionDate,    cell: (row) => <span>{row.completionDate}</span>,    sortable: true, hide: "md" },
    { name: colHeader("Mobile Number"),        selector: (row) => row.mobileNumber,      cell: (row) => <span>{row.mobileNumber}</span>,      sortable: true, hide: "md" },
    { name: colHeader("Place"),                selector: (row) => row.place,             cell: (row) => <span>{row.place}</span>,             sortable: true, hide: "md" },
    { name: colHeader("District"),             selector: (row) => row.districtName,      cell: (row) => <span>{row.districtName}</span>,      sortable: true, hide: "md" },
    { name: colHeader("Post Test Score"),      selector: (row) => row.postTestScore,     cell: (row) => <span>{row.postTestScore}</span>,     sortable: true, hide: "md" },
    { name: colHeader("Pre Test Score"),       selector: (row) => row.preTestScore,      cell: (row) => <span>{row.preTestScore}</span>,      sortable: true, hide: "md" },
    { name: colHeader("Percentage Improved"),  selector: (row) => row.percentageImproved, cell: (row) => <span>{row.percentageImproved}</span>, sortable: true, hide: "md" },
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
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontSize: "20px" }}>📚</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>Trainee Details Report</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>Select filters to view and export trainee details data</div>
            </div>
          </div>
          <Card.Body className="pb-2">
            <Row className="g-2 mb-2 align-items-end">
              <Col lg={2}>
                <label style={lbl}>{t("Training Institution")}</label>
                <Form.Select name="institutionId" value={data.institutionId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Institution")}</option>
                  {trInstitutionListData.map((list) => (
                    <option key={list.trInstitutionMasterId} value={list.trInstitutionMasterId}>
                      {list.trInstitutionMasterName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col lg={2}>
                <label style={lbl}>{t("Training Group")}</label>
                <Form.Select name="groupId" value={data.groupId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Group")}</option>
                  {trGroupListData.map((list) => (
                    <option key={list.trGroupMasterId} value={list.trGroupMasterId}>
                      {list.trGroupMasterName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col lg={2}>
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
              <Col lg={2}>
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
              <Col lg={2}>
                <label style={lbl}>{t("Training Mode")}</label>
                <Form.Select name="modeId" value={data.modeId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Training Mode")}</option>
                  {trModeListData.map((list) => (
                    <option key={list.trModeMasterId} value={list.trModeMasterId}>
                      {list.trModeMasterName}
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

export default TraineeDetailsReport;
