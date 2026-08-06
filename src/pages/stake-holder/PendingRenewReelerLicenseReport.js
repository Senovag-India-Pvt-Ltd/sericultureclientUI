import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";
const CTRL_H = "44px";
const lbl = { fontSize: "12px", fontWeight: 600, color: "#212529", marginBottom: "3px", display: "block" };
const sel = { height: CTRL_H, fontSize: "14px", backgroundColor: "#fff" };

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function PendingRenewReelerLicenseReport() {
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
    districtId: "",
    talukId: "",
    villageId: "",
    marketId: "",
    renewalDate: null,
    expiryDate: null,
  });

  const [hobliData, setHobliData] = useState({
    hobliId: "",
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `reeler/expired-reeler-list`,
        {},
        {
          params: {
            districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            villageId: data.villageId || 0,
            marketId: data.marketId || 0,
            renewalDate: data.renewalDate ? data.renewalDate : null,
            expiryDate: data.expiryDate ? data.expiryDate : null,
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
        baseURLFarmer + `reeler/expired-reeler-report`,
        {},
        {
          params: {
            districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            villageId: data.villageId || 0,
            marketId: data.marketId || 0,
            renewalDate: data.renewalDate ? data.renewalDate : null,
            expiryDate: data.expiryDate ? data.expiryDate : null,
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
        link.download = `expired_reeler_report${new Date().toLocaleDateString("en-GB").replace(/\//g,"-")}.xlsx`;
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

  const getReelerList = (e) => {
    api
      .post(
        baseURLFarmer + `reeler/expired-reeler-list`,
        {},
        {
          params: {
            districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            villageId: data.villageId || 0,
            marketId: data.marketId || 0,
            renewalDate: data.renewalDate ? data.renewalDate : null,
            expiryDate: data.expiryDate ? data.expiryDate : null,
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
    getReelerList();
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

  // to get State
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
        // alert(err.response.data.errorMessages[0].message[0].message);
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
        // alert(err.response.data.errorMessages[0].message[0].message);
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
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (hobliData.hobliId) {
      getVillageList(hobliData.hobliId);
    }
  }, [hobliData.hobliId]);

  // to get District Implementing Officer
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = (districtId) => {
    api
      .post(baseURL + `marketMaster/get-market-by-districtId`, {
        districtId: districtId,
      })
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketListData([]);
      });
  };

  useEffect(() => {
    if (data.districtId) {
      // getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
      getMarketList(data.districtId);
    }
  }, [data.districtId]);

 
  
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
    { name: colHeader("Sl.No"),                selector: (row) => row.serialNumber,       cell: (row) => <span>{row.serialNumber}</span>,       sortable: true },
    { name: colHeader("First Name"),           selector: (row) => row.firstName,           cell: (row) => <span>{row.firstName}</span>,           sortable: true },
    { name: colHeader("Father Name"),          selector: (row) => row.fatherName,          cell: (row) => <span>{row.fatherName}</span>,          sortable: true },
    { name: colHeader("Fruits Id"),            selector: (row) => row.fruitsId,            cell: (row) => <span>{row.fruitsId}</span>,            sortable: true },
    { name: colHeader("Reeler License Number"), selector: (row) => row.reelerLicenseNumber, cell: (row) => <span>{row.reelerLicenseNumber}</span>, sortable: true },
    { name: colHeader("Reeler Number"),        selector: (row) => row.reelerNumber,        cell: (row) => <span>{row.reelerNumber}</span>,        sortable: true },
    { name: colHeader("Mobile Number"),        selector: (row) => row.reelerMobileNumber,  cell: (row) => <span>{row.reelerMobileNumber}</span>,  sortable: true },
   // { name: colHeader("Passbook Number"),      selector: (row) => row.passbookNumber,      cell: (row) => <span>{row.passbookNumber}</span>,      sortable: true },
    { name: colHeader("District Name"),        selector: (row) => row.districtName,        cell: (row) => <span>{row.districtName}</span>,        sortable: true },
    { name: colHeader("Taluk Name"),           selector: (row) => row.talukName,           cell: (row) => <span>{row.talukName}</span>,           sortable: true },
    { name: colHeader("Village Name"),         selector: (row) => row.villageName,         cell: (row) => <span>{row.villageName}</span>,         sortable: true },
    { name: colHeader("Renew License Date"),   selector: (row) => row.renewalDate,         cell: (row) => <span>{row.renewalDate}</span>,         sortable: true },
    { name: colHeader("Expiration Date"),      selector: (row) => row.expiryDate,          cell: (row) => <span>{row.expiryDate}</span>,          sortable: true },
  ];

  return (
    <Layout title={t("Pending to renew License Report")}>
      <style>{pendingRenewReelerLicenseReportStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Pending to renew License Report")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent></Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        {/* Filter Card */}
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontSize: "20px" }}>⏳</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>{t("Pending to renew License Report")}</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>Select filters to view and export pending renewal license data</div>
            </div>
          </div>

          <Card.Body className="pb-2">
            {/* Row 1 — All 7 filters in one line */}
            <Row className="g-2 mb-2 align-items-end flex-nowrap">
              <Col>
                <label style={lbl}>{t("District")}</label>
                <Form.Select name="districtId" value={data.districtId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select District")}</option>
                  {districtListData && districtListData.length
                    ? districtListData.map((list) => (
                        <option key={list.districtId} value={list.districtId}>{list.districtName}</option>
                      ))
                    : ""}
                </Form.Select>
              </Col>

              <Col>
                <label style={lbl}>{t("Taluk")}</label>
                <Form.Select name="talukId" value={data.talukId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Taluk")}</option>
                  {talukListData && talukListData.length
                    ? talukListData.map((list) => (
                        <option key={list.talukId} value={list.talukId}>{list.talukName}</option>
                      ))
                    : ""}
                </Form.Select>
              </Col>

              <Col>
                <label style={lbl}>{t("Hobli")}</label>
                <Form.Select name="hobliId" value={hobliData.hobliId} onChange={handleHobliInputs} style={sel}>
                  <option value="">{t("Select hobli")}</option>
                  {hobliListData && hobliListData.length
                    ? hobliListData.map((list) => (
                        <option key={list.hobliId} value={list.hobliId}>{list.hobliName}</option>
                      ))
                    : ""}
                </Form.Select>
              </Col>

              <Col>
                <label style={lbl}>{t("Village")}</label>
                <Form.Select name="villageId" value={data.villageId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select village")}</option>
                  {villageListData && villageListData.length
                    ? villageListData.map((list) => (
                        <option key={list.villageId} value={list.villageId}>{list.villageName}</option>
                      ))
                    : ""}
                </Form.Select>
              </Col>

              <Col>
                <label style={lbl}>{t("Market")}</label>
                <Form.Select name="marketId" value={data.marketId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Market")}</option>
                  {marketListData && marketListData.length
                    ? marketListData.map((list) => (
                        <option key={list.marketMasterId} value={list.marketMasterId}>{list.marketMasterName}</option>
                      ))
                    : ""}
                </Form.Select>
              </Col>

              <Col>
                <label style={lbl}>{t("Renewal Date")}</label>
                <Form.Control type="date" name="renewalDate" value={data.renewalDate || ""} onChange={handleInputs} style={sel} />
              </Col>

              <Col>
                <label style={lbl}>{t("Expiry Date")}</label>
                <Form.Control type="date" name="expiryDate" value={data.expiryDate || ""} onChange={handleInputs} style={sel} />
              </Col>
            </Row>

            {/* Row 2 — Buttons */}
            <Row className="g-2 mt-1">
              <Col xs="auto">
                <button
                  onClick={search}
                  style={{ height: CTRL_H, padding: "0 20px", background: ACCENT_TABLE, color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
                >
                  {t("Search")}
                </button>
              </Col>
              <Col xs="auto">
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
            onChangePage={(page) => setPage(page - 1)}
            progressPending={loading}
            customStyles={customStyles}
          />
        </Card>
      </Block>
    </Layout>
  );
}

const pendingRenewReelerLicenseReportStyles = `
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

export default PendingRenewReelerLicenseReport;
