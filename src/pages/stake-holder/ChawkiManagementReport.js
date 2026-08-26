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
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";
const CTRL_H = "44px";
const lbl = { fontSize: "12px", fontWeight: 600, color: "#212529", marginBottom: "3px", display: "block" };
const sel = { height: CTRL_H, fontSize: "14px", backgroundColor: "#fff" };

function ChawkiManagementReport() {
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
    districtId: "",
    talukId: "",
    villageId: "",
    tscMasterId: "",
  });

  const [hobliData, setHobliData] = useState({
    hobliId: "",
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `farmer/primaryChowkiDetails`,
        {},
        {
          params: {
            districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            villageId: data.villageId || 0,
            tscMasterId: data.tscMasterId || 0,
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
        baseURLFarmer + `farmer/chowki-report`,
        {},
        {
          params: {
            districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            villageId: data.villageId || 0,
            tscMasterId: data.tscMasterId || 0,
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
        link.download = `chowki_report_${new Date().toLocaleDateString("en-GB").replace(/\//g,"-")}.xlsx`;
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
        baseURLFarmer + `farmer/primaryChowkiDetails`,
        {},
        {
          params: {
            districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            villageId: data.villageId || 0,
            tscMasterId: data.tscMasterId || 0,
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

  const handleHobliInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setHobliData({ ...hobliData, [name]: value });
  };

  // to get District
  const [districtListData, setDistrictListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `district/get-all`)
      .then((response) => {
        if (response.data.content.district) {
          setDistrictListData(response.data.content.district);
        }
      })
      .catch((err) => {
        setDistrictListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    const response = api
      .get(baseURL + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        if (response.data.content.taluk) {
          setTalukListData(response.data.content.taluk);
        }
      })
      .catch((err) => {
        setTalukListData([]);
      });
  };

  useEffect(() => {
    if (data.districtId) {
      getTalukList(data.districtId);
    }
  }, [data.districtId]);

  // to get hobli
  const [hobliListData, setHobliListData] = useState([]);

  const getHobliList = (_id) => {
    const response = api
      .get(baseURL + `hobli/get-by-taluk-id/${_id}`)
      .then((response) => {
        if (response.data.content.hobli) {
          setHobliListData(response.data.content.hobli);
        }
      })
      .catch((err) => {
        setHobliListData([]);
      });
  };

  useEffect(() => {
    if (data.talukId) {
      getHobliList(data.talukId);
    }
  }, [data.talukId]);

  // to get Village
  const [villageListData, setVillageListData] = useState([]);

  const getVillageList = (_id) => {
    api
      .get(baseURL + `village/get-by-hobli-id/${_id}`)
      .then((response) => {
        setVillageListData(response.data.content.village);
      })
      .catch((err) => {
        setVillageListData([]);
      });
  };

  useEffect(() => {
    if (hobliData.hobliId) {
      getVillageList(hobliData.hobliId);
    }
  }, [hobliData.hobliId]);

  // to get TSC
  const [tscListData, setTscListData] = useState([]);

  const getTscList = (districtId, talukId) => {
    api
      .post(baseURL + `tscMaster/get-by-districtId-and-talukId`, {
        districtId: districtId,
        talukId: talukId,
      })
      .then((response) => {
        setTscListData(response.data.content.tscMaster);
      })
      .catch((err) => {
        setTscListData([]);
      });
  };

  useEffect(() => {
    if (data.districtId && data.talukId) {
      getTscList(data.districtId, data.talukId);
    }
  }, [data.districtId, data.talukId]);

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
    { name: colHeader(t("Sl.No")),            selector: (row) => row.serialNumber,  cell: (row) => <span>{row.serialNumber}</span>,  sortable: true },
    { name: colHeader(t("First Name")),       selector: (row) => row.farmerName,    cell: (row) => <span>{row.farmerName}</span>,    sortable: true },
    { name: colHeader(t("Father Name")),      selector: (row) => row.fatherName,    cell: (row) => <span>{row.fatherName}</span>,    sortable: true },
    { name: colHeader(t("Fruits Id")),        selector: (row) => row.fruitsId,      cell: (row) => <span>{row.fruitsId}</span>,      sortable: true },
    { name: colHeader(t("Source of DFLs")),   selector: (row) => row.dflsSource,    cell: (row) => <span>{row.dflsSource}</span>,    sortable: true },
    { name: colHeader(t("Race")),             selector: (row) => row.raceName,      cell: (row) => <span>{row.raceName}</span>,      sortable: true },
    { name: colHeader(t("Number of DFLs")),   selector: (row) => row.numbersOfDfls, cell: (row) => <span>{row.numbersOfDfls}</span>, sortable: true },
    { name: colHeader(t("RSP Lot Number")),   selector: (row) => row.lotNumberRsp,  cell: (row) => <span>{row.lotNumberRsp}</span>,  sortable: true },
    { name: colHeader(t("CRC Lot Number")),   selector: (row) => row.lotNumberCrc,  cell: (row) => <span>{row.lotNumberCrc}</span>,  sortable: true },
    { name: colHeader(t("District")),         selector: (row) => row.districtName,  cell: (row) => <span>{row.districtName}</span>,  sortable: true },
    { name: colHeader(t("Taluk")),            selector: (row) => row.talukName,     cell: (row) => <span>{row.talukName}</span>,     sortable: true },
    { name: colHeader(t("Village")),          selector: (row) => row.villageName,   cell: (row) => <span>{row.villageName}</span>,   sortable: true },
    { name: colHeader(t("TSC")),              selector: (row) => row.tscName,       cell: (row) => <span>{row.tscName}</span>,       sortable: true },
  ];

  return (
    <Layout title={t("Chawki Management Report")}>
      <style>{chawkiManagementReportStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Chawki Management Report")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent></Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontSize: "20px" }}>🐛</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>{t("Chawki Management Report")}</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>{t("Select filters to view and export chawki management data")}</div>
            </div>
          </div>
          <Card.Body className="pb-2">
            <Row className="g-2 mb-2 align-items-end">
              <Col lg={2}>
                <label style={lbl}>{t("District")}</label>
                <Form.Select name="districtId" value={data.districtId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select District")}</option>
                  {districtListData && districtListData.length ? districtListData.map((list) => (
                    <option key={list.districtId} value={list.districtId}>
                      {i18n.language === "kn" ? list.districtNameInKannada : list.districtName}
                    </option>
                  )) : ""}
                </Form.Select>
              </Col>

              <Col lg={2}>
                <label style={lbl}>{t("Taluk")}</label>
                <Form.Select name="talukId" value={data.talukId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Taluk")}</option>
                  {talukListData && talukListData.length ? talukListData.map((list) => (
                    <option key={list.talukId} value={list.talukId}>
                      {i18n.language === "kn" ? list.talukNameInKannada : list.talukName}
                    </option>
                  )) : ""}
                </Form.Select>
              </Col>

              <Col lg={2}>
                <label style={lbl}>{t("Hobli")}</label>
                <Form.Select name="hobliId" value={hobliData.hobliId} onChange={handleHobliInputs} style={sel}>
                  <option value="">{t("Select hobli")}</option>
                  {hobliListData && hobliListData.length ? hobliListData.map((list) => (
                    <option key={list.hobliId} value={list.hobliId}>
                      {i18n.language === "kn" ? list.hobliNameInKannada : list.hobliName}
                    </option>
                  )) : ""}
                </Form.Select>
              </Col>

              <Col lg={2}>
                <label style={lbl}>{t("Village")}</label>
                <Form.Select name="villageId" value={data.villageId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select village")}</option>
                  {villageListData && villageListData.length ? villageListData.map((list) => (
                    <option key={list.villageId} value={list.villageId}>
                      {i18n.language === "kn" ? list.villageNameInKannada : list.villageName}
                    </option>
                  )) : ""}
                </Form.Select>
              </Col>

              <Col lg={2}>
                <label style={lbl}>{t("TSC")}</label>
                <Form.Select name="tscMasterId" value={data.tscMasterId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select TSC")}</option>
                  {tscListData && tscListData.length ? tscListData.map((list) => (
                    <option key={list.tscMasterId} value={list.tscMasterId}>
                      {i18n.language === "kn" ? list.nameInKannada : list.name}
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

const chawkiManagementReportStyles = `
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

export default ChawkiManagementReport;
