import { Card, Form, Row, Col } from "react-bootstrap";
import { createTheme } from "react-data-table-component";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "../../components/AppDataTable";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";
const CTRL_H = "44px";
const lbl = { fontSize: "12px", fontWeight: 600, color: "#212529", marginBottom: "3px", display: "block" };
const sel = { height: CTRL_H, fontSize: "14px", backgroundColor: "#fff" };

function ReelerCountList() {
  const { t, i18n } = useTranslation();
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const countPerPage = 25;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    districtId: "",
    talukId: "",
    villageId: "",
    marketId: "",
    casteId: "",
  });

  const [hobliData, setHobliData] = useState({ hobliId: "" });

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleHobliInputs = (e) => {
    const { name, value } = e.target;
    setHobliData({ ...hobliData, [name]: value });
  };

  // ── Search ───────────────────────────────────────────────────────────────
  const search = () => {
    setLoading(true);
    api
      .post(baseURLFarmer + `reeler/primaryReelerDetails`, {}, {
        params: {
          districtId: data.districtId || 0,
          talukId: data.talukId || 0,
          villageId: data.villageId || 0,
          marketId: data.marketId || 0,
          casteId: data.casteId || 0,
          pageNumber: page,
          pageSize: countPerPage,
        },
      })
      .then((response) => {
        setListData(response.data.content);
        setTotalRows(response.data.totalRecords);
      })
      .catch(() => setListData([]))
      .finally(() => setLoading(false));
  };

  // ── Export XLSX ──────────────────────────────────────────────────────────
  const exportCsv = () => {
    api
      .post(baseURLFarmer + `reeler/reeler-report`, {}, {
        params: {
          districtId: data.districtId || 0,
          talukId: data.talukId || 0,
          villageId: data.villageId || 0,
          marketId: data.marketId || 0,
          casteId: data.casteId || 0,
        },
        responseType: "blob",
        headers: {
          accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `reeler_report${new Date().toLocaleDateString("en-GB").replace(/\//g,"-")}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch(() => {
        Swal.fire({ icon: "warning", title: "No record found!!!" });
      });
  };

  // ── Initial load + page change ───────────────────────────────────────────
  const getReelerList = () => {
    setLoading(true);
    api
      .post(baseURLFarmer + `reeler/primaryReelerDetails`, {}, {
        params: {
          districtId: data.districtId || 0,
          talukId: data.talukId || 0,
          villageId: data.villageId || 0,
          marketId: data.marketId || 0,
          casteId: data.casteId || 0,
          pageNumber: page,
          pageSize: countPerPage,
        },
      })
      .then((response) => {
        setListData(response.data.content);
        setTotalRows(response.data.totalRecords);
      })
      .catch(() => setListData([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { getReelerList(); }, [page]);

  // ── Dropdowns ────────────────────────────────────────────────────────────
  const [districtListData, setDistrictListData] = useState([]);
  useEffect(() => {
    api.get(baseURL + `district/get-all`)
      .then((r) => setDistrictListData(r.data.content.district || []))
      .catch(() => setDistrictListData([]));
  }, []);

  const [talukListData, setTalukListData] = useState([]);
  useEffect(() => {
    if (data.districtId) {
      api.get(baseURL + `taluk/get-by-district-id/${data.districtId}`)
        .then((r) => setTalukListData(r.data.content.taluk || []))
        .catch(() => setTalukListData([]));
    }
  }, [data.districtId]);

  const [hobliListData, setHobliListData] = useState([]);
  useEffect(() => {
    if (data.talukId) {
      api.get(baseURL + `hobli/get-by-taluk-id/${data.talukId}`)
        .then((r) => setHobliListData(r.data.content.hobli || []))
        .catch(() => setHobliListData([]));
    }
  }, [data.talukId]);

  const [villageListData, setVillageListData] = useState([]);
  useEffect(() => {
    if (hobliData.hobliId) {
      api.get(baseURL + `village/get-by-hobli-id/${hobliData.hobliId}`)
        .then((r) => setVillageListData(r.data.content.village || []))
        .catch(() => setVillageListData([]));
    }
  }, [hobliData.hobliId]);

  const [marketListData, setMarketListData] = useState([]);
  useEffect(() => {
    if (data.districtId) {
      api.post(baseURL + `marketMaster/get-market-by-districtId`, { districtId: data.districtId })
        .then((r) => setMarketListData(r.data.content.marketMaster || []))
        .catch(() => setMarketListData([]));
    }
  }, [data.districtId]);

  const [casteListData, setCasteListData] = useState([]);
  useEffect(() => {
    api.get(baseURL + `caste/get-all`)
      .then((r) => setCasteListData(r.data.content.caste || []))
      .catch(() => setCasteListData([]));
  }, []);

  // ── Table styles ─────────────────────────────────────────────────────────
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

  const colHeader = (label) => (
    <div style={{ whiteSpace: "normal", wordBreak: "break-word", textAlign: "center", lineHeight: "1.4", width: "100%", padding: "2px 0" }}>
      {label}
    </div>
  );

  const ReelerDataColumns = [
    {
      name: colHeader(t("Sl.No")),
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
    },
    {
      name: colHeader(t("First Name")),
      selector: (row) => row.firstName,
      cell: (row) => <span>{row.firstName}</span>,
      sortable: true,
    },
    {
      name: colHeader(t("Father Name")),
      selector: (row) => row.fatherName,
      cell: (row) => <span>{row.fatherName}</span>,
      sortable: true,
    },
    {
      name: colHeader(t("Fruits Id")),
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
    },
    {
      name: colHeader(t("Caste")),
      selector: (row) => row.caste,
      cell: (row) => <span>{row.caste}</span>,
      sortable: true,
    },
    {
      name: colHeader(t("Reeler License Number")),
      selector: (row) => row.reelerLicenseNumber,
      cell: (row) => <span>{row.reelerLicenseNumber}</span>,
      sortable: true,
    },
    {
      name: colHeader(t("Reeler Number")),
      selector: (row) => row.reelerNumber,
      cell: (row) => <span>{row.reelerNumber}</span>,
      sortable: true,
    },
    {
      name: colHeader(t("Mobile Number")),
      selector: (row) => row.reelerMobileNumber,
      cell: (row) => <span>{row.reelerMobileNumber}</span>,
      sortable: true,
    },
    // {
    //   name: colHeader("Passbook Number"),
    //   selector: (row) => row.passbookNumber,
    //   cell: (row) => <span>{row.passbookNumber}</span>,
    //   sortable: true,
    // },
    {
      name: colHeader(t("District Name")),
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
    },
    {
      name: colHeader(t("Taluk Name")),
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
    },
    {
      name: colHeader(t("Village Name")),
      selector: (row) => row.villageName,
      cell: (row) => <span>{row.villageName}</span>,
      sortable: true,
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Layout title={t("Reeler Wise Report")}>
      <style>{reelerCountListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Reeler Wise Report")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent></Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        {/* Filter Card */}
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontSize: "20px" }}>🧵</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>{t("Reeler Wise Report")}</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>{t("Select filters to view and export reeler registration data")}</div>
            </div>
          </div>

          <Card.Body className="pb-2">
            {/* Row 1 — All 6 filters */}
            <Row className="g-2 mb-2">
              <Col md={2}>
                <label style={lbl}>{t("District")}</label>
                <Form.Select name="districtId" value={data.districtId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select District")}</option>
                  {districtListData.map((d) => (
                    <option key={d.districtId} value={d.districtId}>
                      {i18n.language === "kn" ? d.districtNameInKannada : d.districtName}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={2}>
                <label style={lbl}>{t("Taluk")}</label>
                <Form.Select name="talukId" value={data.talukId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Taluk")}</option>
                  {talukListData.map((tk) => (
                    <option key={tk.talukId} value={tk.talukId}>
                      {i18n.language === "kn" ? tk.talukNameInKannada : tk.talukName}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={2}>
                <label style={lbl}>{t("Hobli")}</label>
                <Form.Select name="hobliId" value={hobliData.hobliId} onChange={handleHobliInputs} style={sel}>
                  <option value="">{t("Select Hobli")}</option>
                  {hobliListData.map((h) => (
                    <option key={h.hobliId} value={h.hobliId}>
                      {i18n.language === "kn" ? h.hobliNameInKannada : h.hobliName}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={2}>
                <label style={lbl}>{t("Village")}</label>
                <Form.Select name="villageId" value={data.villageId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Village")}</option>
                  {villageListData.map((v) => (
                    <option key={v.villageId} value={v.villageId}>
                      {i18n.language === "kn" ? v.villageNameInKannada : v.villageName}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={2}>
                <label style={lbl}>{t("Market")}</label>
                <Form.Select name="marketId" value={data.marketId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Market")}</option>
                  {marketListData.map((m) => (
                    <option key={m.marketMasterId} value={m.marketMasterId}>
                      {i18n.language === "kn" ? m.marketNameInKannada : m.marketMasterName}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={2}>
                <label style={lbl}>{t("Caste")}</label>
                <Form.Select name="casteId" value={data.casteId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Caste")}</option>
                  {casteListData.map((c) => (
                    <option key={c.id} value={c.id}>
                      {i18n.language === "kn" ? c.nameInKannada : c.title}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            {/* Row 2 — Buttons */}
            <Row className="g-2 mt-1">
              <Col md="auto">
                <button
                  onClick={search}
                  style={{ height: CTRL_H, padding: "0 20px", background: ACCENT_TABLE, color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
                >
                  {t("Search")}
                </button>
              </Col>
              <Col md="auto">
                <button
                  onClick={exportCsv}
                  style={{ height: CTRL_H, padding: "0 20px", background: "linear-gradient(135deg,#2d7a2d,#38a838)", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
                >
                  {t("Export")}
                </button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Table Card */}
        <Card className="mt-3" style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.08)" }}>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={ReelerDataColumns}
            data={listData}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={countPerPage}
            paginationComponentOptions={{ noRowsPerPage: true }}
            onChangePage={(p) => setPage(p - 1)}
            progressPending={loading}
            customStyles={customStyles}
          />
        </Card>
      </Block>
    </Layout>
  );
}

const reelerCountListStyles = `
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

export default ReelerCountList;
