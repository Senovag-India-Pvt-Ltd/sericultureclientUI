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

function TraderLicenseListReport() {
  const { t, i18n } = useTranslation();
//   const [listData, setListData] = useState({});
const [listData, setListData] = useState([]);
  const [listFarmerData, setListFarmerData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 25;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
//   const _params = { params: { pageNumber: page, size: countPerPage } };
const _params = { params: { pageNumber: page, pageSize: countPerPage } };

  const [isActive, setIsActive] = useState(false);

  const [data, setData] = useState({
    districtId: "",
    traderTypeMasterId: "",
    silkType: "",
  });

  const [hobliData, setHobliData] = useState({
    hobliId: "",
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `trader-license/traderLicenseList`,
        {},
        {
          params: {
  districtId: data.districtId || 0,
  traderTypeMasterId: data.traderTypeMasterId || 0,
  silkType: data.silkType ? data.silkType : null,   // FIXED
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
        baseURLFarmer + `trader-license/trader-license-report`,
        {},
        {
          params: {
            districtId: data.districtId || 0,
            traderTypeMasterId: data.traderTypeMasterId || 0,
           silkType: data.silkType || null,
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
        link.download = `trader_license_report${new Date().toLocaleDateString("en-GB").replace(/\//g,"-")}.xlsx`;
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
        baseURLFarmer + `trader-license/traderLicenseList`,
        {},
        {
          params: {
  districtId: data.districtId || 0,
  traderTypeMasterId: data.traderTypeMasterId || 0,
  silkType: data.silkType ? data.silkType : null,  
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

//   const handleInputs = (e) => {
//     // debugger;
//     let { name, value } = e.target;
//     setData({ ...data, [name]: value });
//   };

const handleInputs = (e) => {
  let { name, value } = e.target;

  if (name === "districtId" || name === "traderTypeMasterId") {
    setData({ ...data, [name]: value === "" ? "" : Number(value) });
  } else {
    setData({ ...data, [name]: value === "" ? null : value });
  }
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

  // to get traderType Unit
    const [traderTypeListData, setTraderTypeListData] = useState([]);
  
    const getTraderTypeList = () => {
      const response = api
        .get(baseURL + `traderTypeMaster/get-all`)
        .then((response) => {
          setTraderTypeListData(response.data.content.traderTypeMaster);
        })
        .catch((err) => {
          setTraderTypeListData([]);
        });
    };
  
    useEffect(() => {
      getTraderTypeList();
    }, []);

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
    { name: colHeader(t("Sl.No")),                   selector: (row) => row.serialNumber,        cell: (row) => <span>{row.serialNumber}</span>,        sortable: true },
    { name: colHeader(t("ARN Number")),              selector: (row) => row.arnNumber,            cell: (row) => <span>{row.arnNumber}</span>,            sortable: true },
    { name: colHeader(t("Trader Type")),             selector: (row) => row.traderTypeMasterName, cell: (row) => <span>{row.traderTypeMasterName}</span>, sortable: true },
    { name: colHeader(t("Name of the Applicant")),   selector: (row) => row.firstName,            cell: (row) => <span>{row.firstName}</span>,            sortable: true },
    { name: colHeader(t("Mobile Number")),           selector: (row) => row.mobileNumber,         cell: (row) => <span>{row.mobileNumber}</span>,         sortable: true },
    { name: colHeader(t("Address")),                 selector: (row) => row.address,              cell: (row) => <span>{row.address}</span>,              sortable: true },
    { name: colHeader(t("District Name")),           selector: (row) => row.districtName,         cell: (row) => <span>{row.districtName}</span>,         sortable: true },
    { name: colHeader(t("Silk Type")),               selector: (row) => row.silkType,             cell: (row) => <span>{row.silkType}</span>,             sortable: true },
    { name: colHeader(t("Trader License Number")),   selector: (row) => row.traderLicenseNumber,  cell: (row) => <span>{row.traderLicenseNumber}</span>,  sortable: true },
   // { name: colHeader("Virtual Account Number"),  selector: (row) => row.virtualAccountNumber, cell: (row) => <span>{row.virtualAccountNumber}</span>, sortable: true },
    //{ name: colHeader("Branch Name"),             selector: (row) => row.branchName,           cell: (row) => <span>{row.branchName}</span>,           sortable: true },
   // { name: colHeader("IFSC Code"),               selector: (row) => row.ifscCode,             cell: (row) => <span>{row.ifscCode}</span>,             sortable: true },
    { name: colHeader(t("Market")),                  selector: (row) => row.marketMasterName,     cell: (row) => <span>{row.marketMasterName}</span>,     sortable: true },
  ];

  return (
    <Layout title={t("Trader License Report")}>
      <style>{traderLicenseListReportStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Trader License Report")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent></Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        {/* Filter Card */}
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontSize: "20px" }}>📋</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>{t("Trader License Report")}</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>{t("Select filters to view and export trader license data")}</div>
            </div>
          </div>

          <Card.Body className="pb-2">
            <Row className="g-2 mb-2 align-items-end">
              <Col lg={3}>
                <label style={lbl}>{t("District")}</label>
                <Form.Select name="districtId" value={data.districtId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select District")}</option>
                  {districtListData?.map((list) => (
                    <option key={list.districtId} value={list.districtId}>
                      {i18n.language === "kn" ? list.districtNameInKannada : list.districtName}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col lg={3}>
                <label style={lbl}>{t("Trader Type")}</label>
                <Form.Select name="traderTypeMasterId" value={data.traderTypeMasterId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Trader Type")}</option>
                  {traderTypeListData?.map((list) => (
                    <option key={list.traderTypeMasterId} value={list.traderTypeMasterId}>
                      {i18n.language === "kn" ? list.traderTypeNameInKannada : list.traderTypeMasterName}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col lg={3}>
                <label style={lbl}>{t("Silk Type")}</label>
                <Form.Select name="silkType" value={data.silkType} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Silk Type")}</option>
                  <option value="Raw Silk">{t("Raw Silk")}</option>
                  <option value="Twisted">{t("Twisted")}</option>
                  <option value="Dupion">{t("Dupion")}</option>
                </Form.Select>
              </Col>

              <Col xs="auto" style={{ paddingTop: "20px" }}>
                <button
                  onClick={search}
                  style={{ height: CTRL_H, padding: "0 20px", background: ACCENT_TABLE, color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "13px", cursor: "pointer", marginRight: "8px" }}
                >
                  {t("Search")}
                </button>
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

const traderLicenseListReportStyles = `
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

export default TraderLicenseListReport;
