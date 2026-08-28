import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "../../components/AppDataTable";
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

function SoldDflDetailsReportForRsso() {
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
    raceId: "",
    grainageId: "",
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `sale-disposal-of-egg-rsso/soldDFlDetailsForRsso`,
        {},
        {
          params: {
            raceId: data.raceId || 0,
            grainageId: data.grainageId || 0,
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
        baseURLFarmer + `sale-disposal-of-egg-rsso/soldDFlDetailsForRssoReport`,
        {},
        {
          params: {
            lineId: data.lineId || 0,
            raceId: data.raceId || 0,
            grainageId: data.grainageId || 0,
            tscId: data.tscId || 0,
            userType: data.userType || ''
          },
          responseType: 'blob',
          headers: {
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `sold_dfl_details_rsso_report_.xlsx`;
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
        baseURLFarmer + `sale-disposal-of-egg-rsso/soldDFlDetailsForRsso`,
        {},
        {
          params: {
            raceId: data.raceId || 0,
            grainageId: data.grainageId || 0,
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

  // to get Grainage
  const [grainageListData, setGrainageListData] = useState([]);

  const getGrainageList = () => {
    const response = api
      .get(baseURL + `grainageMaster/get-all`)
      .then((response) => {
        setGrainageListData(response.data.content.grainageMaster);
      })
      .catch((err) => {
        setGrainageListData([]);
      });
  };

  useEffect(() => {
    getGrainageList();
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
    { name: colHeader(t("Sl.No")),                    selector: (row) => row.serialNumber,        cell: (row) => <span>{row.serialNumber}</span>,        sortable: true },
    { name: colHeader(t("Farmer Name")),              selector: (row) => row.farmNameAndAddress,   cell: (row) => <span>{row.farmNameAndAddress}</span>,   sortable: true },
    { name: colHeader(t("Father Name")),              selector: (row) => row.fatherName,           cell: (row) => <span>{row.fatherName}</span>,           sortable: true },
    { name: colHeader(t("Fruits Id")),                selector: (row) => row.fatherName,           cell: (row) => <span>{row.fatherName}</span>,           sortable: true },
    { name: colHeader(t("Lot Number")),               selector: (row) => row.lotNumber,            cell: (row) => <span>{row.lotNumber}</span>,            sortable: true },
    { name: colHeader(t("Laid On Date")),             selector: (row) => row.laidOnDate,           cell: (row) => <span>{row.laidOnDate}</span>,           sortable: true },
    { name: colHeader(t("Number Of DFLs Disposed")),  selector: (row) => row.numberOfDFLsDisposed, cell: (row) => <span>{row.numberOfDFLsDisposed}</span>, sortable: true },
    { name: colHeader(t("No of Cocoons")),            selector: (row) => row.numberOfCocoonsCB,    cell: (row) => <span>{row.numberOfCocoonsCB}</span>,    sortable: true },
    { name: colHeader(t("Race")),                     selector: (row) => row.raceName,             cell: (row) => <span>{row.raceName}</span>,             sortable: true },
    { name: colHeader(t("Grainage")),                 selector: (row) => row.grainageMasterName,   cell: (row) => <span>{row.grainageMasterName}</span>,   sortable: true },
    { name: colHeader(t("Release Date")),             selector: (row) => row.dateOfRelease,        cell: (row) => <span>{row.dateOfRelease}</span>,        sortable: true },
    { name: colHeader(t("Rate Per 100 DFLS Price")),  selector: (row) => row.ratePer100DflsPrice,  cell: (row) => <span>{row.ratePer100DflsPrice}</span>,  sortable: true },
    { name: colHeader(t("Name and Address")),         selector: (row) => row.nameAndAddress,       cell: (row) => <span>{row.nameAndAddress}</span>,       sortable: true },
  ];

  return (
    <Layout title={t("Sold DFLs Report For Rsso/NSSO")}>
      <style>{soldDflDetailsReportForRssoStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Sold DFLs Report For Rsso/NSSO")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent></Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontSize: "20px" }}>🏷️</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>{t("Sold DFLs Report For Rsso/NSSO")}</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>{t("Select filters to view and export sold DFLs for RSSO/NSSO data")}</div>
            </div>
          </div>
          <Card.Body className="pb-2">
            <Row className="g-2 mb-2 align-items-end">
              <Col lg={3}>
                <label style={lbl}>{t("Grainage")}</label>
                <Form.Select name="grainageId" value={data.grainageId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Grainage")}</option>
                  {grainageListData && grainageListData.length ? grainageListData.map((list) => (
                    <option key={list.grainageMasterId} value={list.grainageMasterId}>
                      {i18n.language === "kn" ? list.grainageMasterNameInKannada : list.grainageMasterName}
                    </option>
                  )) : ""}
                </Form.Select>
              </Col>
              <Col lg={3}>
                <label style={lbl}>{t("Race")}</label>
                <Form.Select name="raceId" value={data.raceId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Race")}</option>
                  {raceListData.map((list) => (
                    <option key={list.raceMasterId} value={list.raceMasterId}>
                      {i18n.language === "kn" ? list.raceNameInKannada : list.raceMasterName}
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

const soldDflDetailsReportForRssoStyles = `
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

export default SoldDflDetailsReportForRsso;
