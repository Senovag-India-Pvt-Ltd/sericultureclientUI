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
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";
const CTRL_H = "44px";
const lbl = { fontSize: "12px", fontWeight: 600, color: "#212529", marginBottom: "3px", display: "block" };
const sel = { height: CTRL_H, fontSize: "14px", backgroundColor: "#fff" };

function FarmWiseReportForSeedAndDFLs() {
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
    raceId: "",
    farmId: "",
    lineId: "",
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `8linesController/rearingOfDflsDetails`,
        {},
        {
          params: {
            farmId: data.farmId || 0,
            lineId: data.lineId || 0,
            raceId: data.raceId || 0,
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
        baseURLFarmer + `8linesController/rearingOfDflsReport`,
        {},
        {
          params: {
            farmId: data.farmId || 0,
            lineId: data.lineId || 0,
            raceId: data.raceId || 0,
          },
          responseType: 'blob',
          headers: {
   Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `seed_and_dfl_farm_wise_report.xlsx`;
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
        baseURLFarmer + `8linesController/rearingOfDflsDetails`,
        {},
        {
          params: {
            farmId: data.farmId || 0,
            lineId: data.lineId || 0,
            raceId: data.raceId || 0,
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

  // to get farm
  const [farmListData, setFarmListData] = useState([]);

  const getFarmList = () => {
    api
      .get(baseURL + `farmMaster/get-all`)
      .then((response) => {
        setFarmListData(response.data.content.farmMaster);
      })
      .catch((err) => {
        setFarmListData([]);
      });
  };

  useEffect(() => {
    getFarmList();
  }, []);

  // to get Line Year
  const [lineYearListData, setLineYearListData] = useState([]);

  const getLineYearList = () => {
    const response = api
      .get(baseURL + `lineNameMaster/get-all`)
      .then((response) => {
        setLineYearListData(response.data.content.lineNameMaster);
      })
      .catch((err) => {
        setLineYearListData([]);
      });
  };

  useEffect(() => {
    getLineYearList();
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
    { name: colHeader("Sl.No"),                  selector: (row) => row.serialNumber,          cell: (row) => <span>{row.serialNumber}</span>,          sortable: true },
    { name: colHeader("Lot Number"),             selector: (row) => row.lotNumber,              cell: (row) => <span>{row.lotNumber}</span>,              sortable: true },
    { name: colHeader("Crop Number"),            selector: (row) => row.cropNumber,             cell: (row) => <span>{row.cropNumber}</span>,             sortable: true },
    { name: colHeader("Laid On Date"),           selector: (row) => row.laidOnDate,             cell: (row) => <span>{row.laidOnDate}</span>,             sortable: true },
    { name: colHeader("Number Of DFLs"),         selector: (row) => row.numberOfDfls,           cell: (row) => <span>{row.numberOfDfls}</span>,           sortable: true },
    { name: colHeader("No of DFLs Released"),    selector: (row) => row.numberOfDflsReleased,   cell: (row) => <span>{row.numberOfDflsReleased}</span>,   sortable: true },
    { name: colHeader("Race"),                   selector: (row) => row.raceName,               cell: (row) => <span>{row.raceName}</span>,               sortable: true },
    { name: colHeader("Grainage"),               selector: (row) => row.grainageMasterName,     cell: (row) => <span>{row.grainageMasterName}</span>,     sortable: true },
    { name: colHeader("Spun On Date(From)"),     selector: (row) => row.spunOnDate,             cell: (row) => <span>{row.spunOnDate}</span>,             sortable: true },
    { name: colHeader("Spun On Date(To)"),       selector: (row) => row.spunOnToDate,           cell: (row) => <span>{row.spunOnToDate}</span>,           sortable: true },
    { name: colHeader("Hatching Date"),          selector: (row) => row.hatchingDate,           cell: (row) => <span>{row.hatchingDate}</span>,           sortable: true },
    { name: colHeader("Disinfectant"),           selector: (row) => row.disinfectantMasterName, cell: (row) => <span>{row.disinfectantMasterName}</span>, sortable: true },
    { name: colHeader("Chawki Percentage"),      selector: (row) => row.chawkiPercentage,       cell: (row) => <span>{row.chawkiPercentage}</span>,       sortable: true },
    { name: colHeader("Released Date"),          selector: (row) => row.releasedOnDate,         cell: (row) => <span>{row.releasedOnDate}</span>,         sortable: true },
    { name: colHeader("Farm"),                   selector: (row) => row.farmNameInKannada,      cell: (row) => <span>{row.farmNameInKannada}</span>,      sortable: true },
    { name: colHeader("Line"),                   selector: (row) => row.lineName,               cell: (row) => <span>{row.lineName}</span>,               sortable: true },
  ];

  return (
    <Layout title={t("Seed And DFL- Farm Wise Report")}>
      <style>{farmWiseReportSeedAndDFLsStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Seed And DFL- Farm Wise Report")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent></Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontSize: "20px" }}>🌱</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>Seed And DFL- Farm Wise Report</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>Select filters to view and export seed and DFL farm wise data</div>
            </div>
          </div>
          <Card.Body className="pb-2">
            <Row className="g-2 mb-2 align-items-end">
              <Col lg={3}>
                <label style={lbl}>{t("Farm")}</label>
                <Form.Select name="farmId" value={data.farmId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Farm")}</option>
                  {farmListData && farmListData.length ? farmListData.map((list) => (
                    <option key={list.farmId} value={list.farmId}>
                      {list.farmName}
                    </option>
                  )) : ""}
                </Form.Select>
              </Col>
              <Col lg={3}>
                <label style={lbl}>{t("Line")}</label>
                <Form.Select name="lineId" value={data.lineId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Line Details")}</option>
                  {lineYearListData && lineYearListData.length ? lineYearListData.map((list) => (
                    <option key={list.lineNameId} value={list.lineNameId}>
                      {list.lineName}
                    </option>
                  )) : ""}
                </Form.Select>
              </Col>
              <Col lg={3}>
                <label style={lbl}>{t("Race")}</label>
                <Form.Select name="raceId" value={data.raceId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Race")}</option>
                  {raceListData && raceListData.length ? raceListData.map((list) => (
                    <option key={list.raceMasterId} value={list.raceMasterId}>
                      {list.raceMasterName}
                    </option>
                  )) : ""}
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

const farmWiseReportSeedAndDFLsStyles = `
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

export default FarmWiseReportForSeedAndDFLs;
