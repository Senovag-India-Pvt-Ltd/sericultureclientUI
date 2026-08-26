import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "../../components/AppDataTable";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import api from "../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";
const CTRL_H = "44px";
const lbl = { fontSize: "12px", fontWeight: 600, color: "#212529", marginBottom: "3px", display: "block" };
const sel = { height: CTRL_H, fontSize: "14px", backgroundColor: "#fff" };

function RangeWisePhysicalTargetReport() {
  const { t, i18n } = useTranslation();
  const [listData, setListData] = useState({});
  const [listFarmerData, setListFarmerData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 25;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [isActive, setIsActive] = useState(false);

  const [data, setData] = useState({
    financialYearId: "",
    districtId: "",
    mulberryTargetTypeId: "",
    raceId: "",
    tscId: "",
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `productionTargets/getRangeWisePhysicalTargetsDetails`,
        {},
        {
          params: {
            financialYearId: data.financialYearId || 0,
            districtId: data.districtId || 0,
            mulberryTargetTypeId: data.mulberryTargetTypeId || 0,
            raceId: data.raceId || 0,
            tscId: data.tscId || 0,
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
        baseURLFarmer + `productionTargets/getRangeWisePhysicalTargetsReport`,
        {},
        {
          params: {
            financialYearId: data.financialYearId || 0,
            districtId: data.districtId || 0,
            mulberryTargetTypeId: data.mulberryTargetTypeId || 0,
            raceId: data.raceId || 0,
            tscId: data.tscId || 0,
          },
          responseType: 'blob',
          headers: {
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `range_wise_physical_targets_report.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        Swal.fire({
          icon: "warning",
          title: t("No record found!!!"),
        });
      });
  };

  const getFarmerList = (e) => {
    api
      .post(
        baseURLFarmer + `productionTargets/getRangeWisePhysicalTargetsDetails`,
        {},
        {
          params: {
            financialYearId: data.financialYearId || 0,
            districtId: data.districtId || 0,
            mulberryTargetTypeId: data.mulberryTargetTypeId || 0,
            raceId: data.raceId || 0,
            tscId: data.tscId || 0,
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

  const [message, setMessage] = useState("");
  const getMulberryTargetTypeLists = (mulberryId) => {
    const response = api
      .get(baseURL + `mulberryTargetType/get/${mulberryId}`)
      .then((response) => {
        setMessage(response.data.content.unit);
      })
      .catch((err) => {
      });
  };

  useEffect(() => {
    if (data.mulberryTargetTypeId) {
      getMulberryTargetTypeLists(data.mulberryTargetTypeId);
    }
  }, [data.mulberryTargetTypeId]);

  // to get mulberry target type
  const [mulberryTargetTypeData, setMulberryTargetTypeData] = useState([]);

  const getMulberryTargetTypeList = () => {
    api
      .get(baseURL + `mulberryTargetType/get-by-required-false`)
      .then((response) => {
        setMulberryTargetTypeData(response.data.mulberryTargetType);
      })
      .catch((err) => {
        setMulberryTargetTypeData([]);
      });
  };

  useEffect(() => {
    getMulberryTargetTypeList();
  }, []);

  // to get District
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    const response = api
      .get(baseURL + `district/get-all`)
      .then((response) => {
        setDistrictListData(response.data.content.district);
      })
      .catch((err) => {
        setDistrictListData([]);
      });
  };

  useEffect(() => {
    getDistrictList();
  }, []);

  // to get Financial Year
  const [financialyearListData, setFinancialyearListData] = useState([]);

  const getFinancialYearList = () => {
    api
      .get(baseURL + `financialYearMaster/get-all`)
      .then((response) => {
        setFinancialyearListData(response.data.content.financialYearMaster);
      })
      .catch((err) => {
        setFinancialyearListData([]);
      });
  };

  useEffect(() => {
    getFinancialYearList();
  }, []);

  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
    const response = api
      .get(baseURL + `raceMaster/get-all`)
      .then((response) => {
        setRaceListData(response.data.content.raceMaster);
      })
      .catch((err) => {
        setRaceListData([]);
      });
  };

  useEffect(() => {
    getRaceList();
  }, []);

  // to get tsc
  const [tscListData, setTscListData] = useState([]);

  const getTscList = () => {
    const response = api
      .get(baseURL + `tscMaster/get-all`)
      .then((response) => {
        setTscListData(response.data.content.tscMaster);
      })
      .catch((err) => {
        setTscListData([]);
      });
  };

  useEffect(() => {
    getTscList();
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
    { name: colHeader(t("Sl.No")),          selector: (row) => row.serialNumber,          cell: (row) => <span>{row.serialNumber}</span>,          sortable: true, hide: "md" },
    { name: colHeader(t("Financial Year")), selector: (row) => row.financialYear,          cell: (row) => <span>{row.financialYear}</span>,          sortable: true, hide: "md" },
    { name: colHeader(t("Target")),         selector: (row) => row.mulberryTargetTypeName, cell: (row) => <span>{row.mulberryTargetTypeName}</span>, sortable: true, hide: "md" },
    { name: colHeader(t("District")),       selector: (row) => row.districtName,           cell: (row) => <span>{row.districtName}</span>,           sortable: true, hide: "md" },
    { name: colHeader(t("Taluk")),          selector: (row) => row.talukName,              cell: (row) => <span>{row.talukName}</span>,              sortable: true, hide: "md" },
    { name: colHeader(t("TSC")),            selector: (row) => row.tscName,                cell: (row) => <span>{row.tscName}</span>,                sortable: true, hide: "md" },
    { name: colHeader(t("Race")),           selector: (row) => row.raceName,               cell: (row) => <span>{row.raceName}</span>,               sortable: true, hide: "md" },
    { name: colHeader(t("Month")),          selector: (row) => row.month,                  cell: (row) => <span>{row.month}</span>,                  sortable: true, hide: "md" },
    { name: colHeader(t("Target")),         selector: (row) => row.value,                  cell: (row) => <span>{row.value}</span>,                  sortable: true, hide: "md" },
    { name: colHeader(t("User")),           selector: (row) => row.userName,               cell: (row) => <span>{row.userName}</span>,               sortable: true, hide: "md" },
  ];

  return (
    <Layout title={t("Range Wise Physical Target Details Report")}>
      <style>{rangeWisePhysicalTargetReportStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Range Wise Physical Target Details Report")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent></Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontSize: "20px" }}>📊</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>{t("Range Wise Physical Target Details Report")}</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>{t("Select filters to view and export range wise physical target data")}</div>
            </div>
          </div>
          <Card.Body className="pb-2">
            <Row className="g-2 mb-2 align-items-end">
              <Col lg={2}>
                <label style={lbl}>{t("Financial Year")}</label>
                <Form.Select name="financialYearId" value={data.financialYearId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Year")}</option>
                  {financialyearListData && financialyearListData.length
                    ? financialyearListData.map((list) => (
                        <option key={list.financialYearMasterId} value={list.financialYearMasterId}>
                          {list.financialYear}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
              <Col lg={2}>
                <label style={lbl}>{t("District")}</label>
                <Form.Select name="districtId" value={data.districtId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select District")}</option>
                  {districtListData && districtListData.length
                    ? districtListData.map((list) => (
                        <option key={list.districtId} value={list.districtId}>
                          {i18n.language === "kn" ? list.districtNameInKannada : list.districtName}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
              <Col lg={2}>
                <label style={lbl}>{t("Target")}</label>
                <Form.Select name="mulberryTargetTypeId" value={data.mulberryTargetTypeId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Target")}</option>
                  {mulberryTargetTypeData && mulberryTargetTypeData.length
                    ? mulberryTargetTypeData.map((list) => (
                        <option key={list.mulberryTargetTypeId} value={list.mulberryTargetTypeId}>
                          {i18n.language === "kn" ? list.mulberryTargetTypeNameInKannada : list.mulberryTargetTypeName}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
              <Col lg={2}>
                <label style={lbl}>{t("Race")}</label>
                <Form.Select name="raceId" value={data.raceId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Race")}</option>
                  {raceListData && raceListData.length
                    ? raceListData.map((list) => (
                        <option key={list.raceMasterId} value={list.raceMasterId}>
                          {i18n.language === "kn" ? list.raceNameInKannada : list.raceMasterName}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
              <Col lg={2}>
                <label style={lbl}>{t("tsc")}</label>
                <Form.Select name="tscId" value={data.tscId} onChange={handleInputs} style={sel}>
                  <option value="">{t("select_tsc")}</option>
                  {tscListData.map((list) => (
                    <option key={list.tscMasterId} value={list.tscMasterId}>
                      {i18n.language === "kn" ? list.nameInKannada : list.name}
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

const rangeWisePhysicalTargetReportStyles = `
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

export default RangeWisePhysicalTargetReport;
