import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";

function FarmerRegistrationList() {
  const { t, i18n } = useTranslation();
  const [listData, setListData] = useState({});
  const [listFarmerData, setListFarmerData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 25;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [isActive, setIsActive] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [data, setData] = useState({
    districtId: "",
    talukId: "",
    villageId: "",
    tscMasterId: "",
    casteId: "",
    landFilter: "",
  });

  const [hobliData, setHobliData] = useState({
    hobliId: "",
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `farmer/primaryFarmerDetails`,
        {},
        {
          params: {
            districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            villageId: data.villageId || 0,
            tscMasterId: data.tscMasterId || 0,
            casteId: data.casteId || 0,
            landFilter: data.landFilter || null,
            pageNumber: page,
            pageSize: countPerPage,
          },
        },
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
    if (isExporting) return;
    if (!data.districtId) {
      Swal.fire({
        icon: "warning",
        title: "Please select a District before exporting",
      });
      return;
    }
    setIsExporting(true);
    api
      .post(
        baseURLFarmer + `farmer/farmer-report`,
        {},
        {
          params: {
            districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            villageId: data.villageId || 0,
            tscMasterId: data.tscMasterId || 0,
            casteId: data.casteId || 0,
            landFilter: data.landFilter || null,
          },
          responseType: "blob",
          headers: {
            accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Type": "application/json",
          },
        },
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `farmer_report${new Date().toLocaleDateString("en-GB").replace(/\//g,"-")}.xlsx`;
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
      })
      .finally(() => {
        setIsExporting(false);
      });
  };

  const getFarmerList = (e) => {
    api
      .post(
        baseURLFarmer + `farmer/primaryFarmerDetails`,
        {},
        {
          params: {
            districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            villageId: data.villageId || 0,
            tscMasterId: data.tscMasterId || 0,
            casteId: data.casteId || 0,
            landFilter: data.landFilter || null,
            pageNumber: page,
            pageSize: countPerPage,
          },
        },
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

  // to get caste
  const [casteListData, setCasteListData] = useState([]);

  const getCasteList = () =>
    api
      .get(baseURL + `caste/get-all`)
      .then((response) => {
        setCasteListData(response.data.content.caste);
      })
      .catch((err) => {
        setCasteListData([]);
      });

  useEffect(() => {
    getCasteList();
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
      // getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
      getTscList(data.districtId, data.talukId);
    }
  }, [data.districtId, data.talukId]);

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/farmer-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/farmer-edit/${_id}`);
    // navigate("/seriui/state");
  };

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const deleteConfirm = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        const response = api
          .delete(baseURL + `farmer/delete/${_id}`)
          .then((response) => {
            // deleteConfirm(_id);
            // getList();
            Swal.fire(
              "Deleted",
              "You successfully deleted this record",
              "success",
            );
          })
          .catch((err) => {
            deleteError();
          });
        // Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
    });
  };

  createTheme(
    "solarized",
    {
      text: {
        primary: "#004b8e",
        secondary: "#2aa198",
      },
      background: {
        default: "#fff",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#d3d3d3",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.02)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "light",
  );

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

  const FarmerDataColumns = [
    {
      name: colHeader(t("Sl.No")),
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: colHeader(t("First Name")),
      selector: (row) => row.firstName,
      cell: (row) => <span>{row.firstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: colHeader(t("Middle Name")),
      selector: (row) => row.middleName,
      cell: (row) => <span>{row.middleName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: colHeader(t("Fruits Id")),
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: colHeader("Farmer Number"),
    //   selector: (row) => row.farmerNumber,
    //   cell: (row) => <span>{row.farmerNumber}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Land Status",
    //   selector: (row) => row.landStatus,
    //   cell: (row) => <span>{row.landStatus}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: colHeader(t("Father Name")),
      selector: (row) => row.fatherName,
      cell: (row) => <span>{row.fatherName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: colHeader(t("Caste")),
      selector: (row) => row.caste,
      cell: (row) => <span>{row.caste}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: colHeader("Passbook Number"),
    //   selector: (row) => row.passbookNumber,
    //   cell: (row) => <span>{row.passbookNumber}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: colHeader(t("District Name")),
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: colHeader(t("Taluk Name")),
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: colHeader("Village Name"),
    //   selector: (row) => row.villageName,
    //   cell: (row) => <span>{row.villageName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: colHeader("Mulberry Area"),
    //   selector: (row) => row.mulberryArea,
    //   cell: (row) => <span>{row.mulberryArea}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: colHeader("Owner Name"),
    //   selector: (row) => row.ownerName,
    //   cell: (row) => <span>{row.ownerName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: colHeader("Survey Number"),
    //   selector: (row) => row.surveyNumber,
    //   cell: (row) => <span>{row.surveyNumber}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: colHeader("Spacing"),
    //   selector: (row) => row.spacing,
    //   cell: (row) => <span>{row.spacing}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: colHeader("Hissa"),
    //   selector: (row) => row.hissa,
    //   cell: (row) => <span>{row.hissa}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: colHeader("Rearing House Details"),
    //   selector: (row) => row.rearingHouseDetails,
    //   cell: (row) => <span>{row.rearingHouseDetails}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: colHeader(t("Land Address")),
      selector: (row) => row.landAddress,
      cell: (row) => <span>{row.landAddress}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: colHeader("Mulberry Variety"),
    //   selector: (row) => row.mulberryVarietyName,
    //   cell: (row) => <span>{row.mulberryVarietyName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: colHeader(t("Mobile Number")),
      selector: (row) => row.mobileNumber,
      cell: (row) => <span>{row.mobileNumber}</span>,
      sortable: true,
    },
    {
      name: colHeader(t("TSC Name")),
      selector: (row) => row.tscName,
      cell: (row) => <span>{row.tscName}</span>,
      sortable: true,
    },
  ];

  const lbl = { fontSize: "12px", fontWeight: 600, color: "#212529", marginBottom: "3px", display: "block" };
  const CTRL_H = "44px";
  const sel = { height: CTRL_H, fontSize: "14px", backgroundColor: "#fff" };

  return (
    <Layout title={t("Farmer Wise Report")}>
      <style>{farmerRegistrationListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Farmer Wise Report")}</Block.Title>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">

        {/* ── Filter Card ── */}
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{
            background: ACCENT_HEADER, padding: "11px 18px",
            display: "flex", alignItems: "center", gap: "10px",
            borderRadius: "12px 12px 0 0",
          }}>
            <span style={{ fontSize: "20px" }}>🌾</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>{t("Farmer Wise Report")}</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>{t("Select filters to view and export farmer registration data")}</div>
            </div>
          </div>
          <Card.Body style={{ padding: "14px 18px 16px" }}>
            {/* Row 1 — All filters */}
            <Row className="g-2 mb-2">
              <Col md={2}>
                <label style={lbl}>{t("District")} <span style={{ color: "red" }}>*</span></label>
                <Form.Select name="districtId" value={data.districtId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select District")}</option>
                  {districtListData && districtListData.map((list) => (
                    <option key={list.districtId} value={list.districtId}>
                      {i18n.language === "kn" ? list.districtNameInKannada : list.districtName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <label style={lbl}>{t("Taluk")}</label>
                <Form.Select name="talukId" value={data.talukId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Taluk")}</option>
                  {talukListData && talukListData.map((list) => (
                    <option key={list.talukId} value={list.talukId}>
                      {i18n.language === "kn" ? list.talukNameInKannada : list.talukName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <label style={lbl}>{t("Hobli")}</label>
                <Form.Select name="hobliId" value={hobliData.hobliId} onChange={handleHobliInputs} style={sel}>
                  <option value="">{t("Select Hobli")}</option>
                  {hobliListData && hobliListData.map((list) => (
                    <option key={list.hobliId} value={list.hobliId}>
                      {i18n.language === "kn" ? list.hobliNameInKannada : list.hobliName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <label style={lbl}>{t("Village")}</label>
                <Form.Select name="villageId" value={data.villageId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Village")}</option>
                  {villageListData && villageListData.map((list) => (
                    <option key={list.villageId} value={list.villageId}>
                      {i18n.language === "kn" ? list.villageNameInKannada : list.villageName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <label style={lbl}>{t("TSC")}</label>
                <Form.Select name="tscMasterId" value={data.tscMasterId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select TSC")}</option>
                  {tscListData && tscListData.map((list) => (
                    <option key={list.tscMasterId} value={list.tscMasterId}>
                      {i18n.language === "kn" ? list.nameInKannada : list.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <label style={lbl}>{t("Caste")}</label>
                <Form.Select name="casteId" value={data.casteId} onChange={handleInputs} style={sel}>
                  <option value="0">{t("Select Caste")}</option>
                  {casteListData.map((list) => (
                    <option key={list.id} value={list.id}>
                      {i18n.language === "kn" ? list.nameInKannada : list.title}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              {/* <Col md={2}>
                <label style={lbl}>{t("Land Filter")}</label>
                <Form.Select name="landFilter" value={data.landFilter} onChange={handleInputs} style={sel}>
                  <option value="">{t("All Farmers")}</option>
                  <option value="WITH">{t("With Land")}</option>
                  <option value="WITHOUT">{t("Without Land")}</option>
                </Form.Select>
              </Col> */}
            </Row>
            {/* Row 2 — Buttons */}
            <Row className="g-2 mt-1">
              <Col md="auto">
                <button type="button" onClick={search} style={{
                  background: "linear-gradient(135deg,#1a5f9e,#2c8fd4)", border: "none", borderRadius: "8px",
                  height: CTRL_H, padding: "0 20px", fontWeight: 700, fontSize: "13px", color: "#fff", cursor: "pointer",
                  boxShadow: "0 3px 10px rgba(26,95,158,0.30)", display: "inline-flex", alignItems: "center", gap: "6px",
                }}>
                  🔍 {t("Search")}
                </button>
              </Col>
              <Col md="auto">
                <button type="button" onClick={exportCsv} disabled={isExporting || !data.districtId} style={{
                  background: "linear-gradient(135deg,#c53030,#e53e3e)", border: "none", borderRadius: "8px",
                  height: CTRL_H, padding: "0 20px", fontWeight: 700, fontSize: "13px", color: "#fff",
                  cursor: (isExporting || !data.districtId) ? "not-allowed" : "pointer", opacity: (isExporting || !data.districtId) ? 0.6 : 1,
                  boxShadow: "0 3px 10px rgba(197,48,48,0.28)", display: "inline-flex", alignItems: "center", gap: "6px",
                }}
                  title={!data.districtId ? t("Select a District to enable Export") : undefined}
                >
                  📥 {isExporting ? t("Exporting...") : t("Export")}
                </button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* ── Data Table ── */}
        <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)", overflow: "hidden", marginTop: "16px" }}>
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
            theme="solarized"
            customStyles={customStyles}
          />
        </Card>

      </Block>
    </Layout>
  );
}

const farmerRegistrationListStyles = `
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

export default FarmerRegistrationList;
