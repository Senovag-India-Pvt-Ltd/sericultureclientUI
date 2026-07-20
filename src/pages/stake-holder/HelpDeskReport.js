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
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_HELPDESK;

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";
const CTRL_H = "44px";
const lbl = { fontSize: "12px", fontWeight: 600, color: "#212529", marginBottom: "3px", display: "block" };
const sel = { height: CTRL_H, fontSize: "14px", backgroundColor: "#fff" };

function HelpDeskReport() {
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
    moduleId: "",
    featureId: "",
    statusId: "",
    createdBy: "",
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `hdTicket/getTicketDetails`,
        {},
        {
          params: {
            moduleId: data.moduleId || 0,
            featureId: data.featureId || 0,
            statusId: data.statusId || 0,
            createdBy: data.createdBy || 0,
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
        baseURLFarmer + `hdTicket/getTicketReport`,
        {},
        {
          params: {
           moduleId: data.moduleId || 0,
            featureId: data.featureId || 0,
            statusId: data.statusId || 0,
            createdBy: data.createdBy || 0,
          },
          responseType: 'blob',
          headers: {
                        accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `ticket_report.xlsx`;
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
        baseURLFarmer + `hdTicket/getTicketDetails`,
        {},
        {
          params: {
            moduleId: data.moduleId || 0,
            featureId: data.featureId || 0,
            statusId: data.statusId || 0,
            createdBy: data.createdBy || 0,
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

  // to get Status
  const [hdStatusListData, setHdStatusListData] = useState([]);

  const getStatusList = () => {
    const response = api
      .get(baseURL + `hdStatusMaster/get-all`)
      .then((response) => {
        setHdStatusListData(response.data.content.hdStatusMaster);
      })
      .catch((err) => {
        setHdStatusListData([]);
      });
  };

  useEffect(() => {
    getStatusList();
  }, []);

  // to get Module
  const [hdModuleListData, setHdModuleListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `hdModuleMaster/get-all`)
      .then((response) => {
        setHdModuleListData(response.data.content.hdModuleMaster);
      })
      .catch((err) => {
        setHdModuleListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get Feature
  const [featureListData, setFeatureListData] = useState([]);

  const getFeatureList = (_id) => {
    const response = api
      .get(baseURL + `hdFeatureMaster/get-by-hd-module-id/${_id}`)
      .then((response) => {
        setFeatureListData(response.data.content.hdFeatureMaster);
        setLoading(false);
        if (response.data.content.error) {
          setFeatureListData([]);
        }
      })
      .catch((err) => {
        setFeatureListData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (data.moduleId) {
      getFeatureList(data.moduleId);
    }
  }, [data.moduleId]);

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
    { name: colHeader("Sl.No"),             selector: (row) => row.serialNumber,     cell: (row) => <span>{row.serialNumber}</span>,     sortable: true, hide: "md" },
    { name: colHeader("Ticket Arn Number"), selector: (row) => row.ticketArn,        cell: (row) => <span>{row.ticketArn}</span>,        sortable: true, hide: "md" },
    { name: colHeader("Users Affected"),    selector: (row) => row.usersAffected,    cell: (row) => <span>{row.usersAffected}</span>,    sortable: true, hide: "md" },
    { name: colHeader("Query"),             selector: (row) => row.query,            cell: (row) => <span>{row.query}</span>,            sortable: true, hide: "md" },
    { name: colHeader("Module"),            selector: (row) => row.moduleName,       cell: (row) => <span>{row.moduleName}</span>,       sortable: true, hide: "md" },
    { name: colHeader("Feature"),           selector: (row) => row.featureName,      cell: (row) => <span>{row.featureName}</span>,      sortable: true, hide: "md" },
    { name: colHeader("Broad Category"),    selector: (row) => row.boardCategoryName,cell: (row) => <span>{row.boardCategoryName}</span>,sortable: true, hide: "md" },
    { name: colHeader("Created By"),        selector: (row) => row.onBehalfUsername, cell: (row) => <span>{row.onBehalfUsername}</span>, sortable: true, hide: "md" },
    { name: colHeader("Status"),            selector: (row) => row.statusName,       cell: (row) => <span>{row.statusName}</span>,       sortable: true, hide: "md" },
    { name: colHeader("Solution"),          selector: (row) => row.solution,         cell: (row) => <span>{row.solution}</span>,         sortable: true, hide: "md" },
    { name: colHeader("Severity"),          selector: (row) => row.severityName,     cell: (row) => <span>{row.severityName}</span>,     sortable: true, hide: "md" },
  ];

  return (
    <Layout title={t("Ticket Details Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Ticket Details Report")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent></Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontSize: "20px" }}>🎫</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>Ticket Details Report</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>Select filters to view and export helpdesk ticket data</div>
            </div>
          </div>
          <Card.Body className="pb-2">
            <Row className="g-2 mb-2 align-items-end">
              <Col lg={2}>
                <label style={lbl}>{t("Module")}</label>
                <Form.Select name="moduleId" value={data.moduleId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Module")}</option>
                  {hdModuleListData.map((list) => (
                    <option key={list.hdModuleId} value={list.hdModuleId}>
                      {list.hdModuleName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col lg={2}>
                <label style={lbl}>{t("Feature")}</label>
                <Form.Select name="featureId" value={data.featureId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Feature")}</option>
                  {featureListData.map((list) => (
                    <option key={list.hdFeatureId} value={list.hdFeatureId}>
                      {list.hdFeatureName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col lg={2}>
                <label style={lbl}>{t("Status")}</label>
                <Form.Select name="statusId" value={data.statusId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Status")}</option>
                  {hdStatusListData.map((list) => (
                    <option key={list.hdStatusId} value={list.hdStatusId}>
                      {list.hdStatusName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col lg={3}>
                <label style={lbl}>{t("Created By")}</label>
                <Form.Select name="createdBy" value={data.createdBy} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select User")}</option>
                  {userListData.map((list) => (
                    <option key={list.userMasterId} value={list.userMasterId}>
                      {list.username}
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

export default HelpDeskReport;
