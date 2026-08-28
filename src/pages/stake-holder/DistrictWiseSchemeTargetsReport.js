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
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";
const CTRL_H = "44px";
const lbl = { fontSize: "12px", fontWeight: 600, color: "#212529", marginBottom: "3px", display: "block" };
const sel = { height: CTRL_H, fontSize: "14px", backgroundColor: "#fff" };

function DistrictWiseSchemeTargetsReport() {
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
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    scComponentId: "",
    scCategoryId: "",
    scHeadAccountId: "",
    targetType: "",
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `schemeTargets/getSchemeTargetsDetails`,
        {},
        {
          params: {
            financialYearId: data.financialYearId || 0,
            districtId: data.districtId || 0,
            scSchemeDetailsId: data.scSchemeDetailsId || 0,
            scSubSchemeDetailsId: data.scSubSchemeDetailsId || 0,
            scComponentId: data.scComponentId || 0,
            scCategoryId: data.scCategoryId || 0,
            scHeadAccountId: data.scHeadAccountId || 0,
            targetType: data.targetType || '',
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
        baseURLFarmer + `schemeTargets/getSchemeTargetsReport`,
        {},
        {
          params: {
           financialYearId: data.financialYearId || 0,
            districtId: data.districtId || 0,
            scSchemeDetailsId: data.scSchemeDetailsId || 0,
            scSubSchemeDetailsId: data.scSubSchemeDetailsId || 0,
            scComponentId: data.scComponentId || 0,
            scCategoryId: data.scCategoryId || 0,
            scHeadAccountId: data.scHeadAccountId || 0,
            targetType: data.targetType || '',
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
        link.download = `district_wise_scheme_targets_report.xlsx`;
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
        baseURLFarmer + `schemeTargets/getSchemeTargetsDetails`,
        {},
        {
          params: {
            financialYearId: data.financialYearId || 0,
            districtId: data.districtId || 0,
            scSchemeDetailsId: data.scSchemeDetailsId || 0,
            scSubSchemeDetailsId: data.scSubSchemeDetailsId || 0,
            scComponentId: data.scComponentId || 0,
            scCategoryId: data.scCategoryId || 0,
            scHeadAccountId: data.scHeadAccountId || 0,
            targetType: data.targetType || '',
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

  const [message, setMessage] = useState("");
  const getMulberryTargetTypeLists = (mulberryId) => {
    const response = api
      .get(baseURL + `mulberryTargetType/get/${mulberryId}`)
      .then((response) => {
        // setMulberryTargetTypeData(response.data.content.mulberryTargetType);
        setMessage(response.data.content.unit)
      })
      .catch((err) => {
        // setMulberryTargetTypeData([]);
      });
  };

  useEffect(() => {
    if(data.mulberryTargetTypeId){
      getMulberryTargetTypeLists(data.mulberryTargetTypeId)
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

  // to get sc-scheme-details
  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);
  const getSchemeList = () => {
    api
      .get(baseURL + `scSchemeDetails/get-all`)
      .then((response) => {
        setScSchemeDetailsListData(response.data.content.ScSchemeDetails);
      })
      .catch((err) => {
        setScSchemeDetailsListData([]);
      });
  };

  useEffect(() => {
    getSchemeList();
  }, []);

  // to get sc-sub-scheme-details by sc-scheme-details
  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState([]);
  const getSubSchemeList = (_id) => {
    api
      .get(baseURLDBT + `master/cost/get-by-scheme-id/${_id}`)
      .then((response) => {
        if (response.data.content.unitCost) {
          setScSubSchemeDetailsListData(response.data.content.unitCost);
        }
      })
      .catch((err) => {
        setScSubSchemeDetailsListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.scSchemeDetailsId) {
      getSubSchemeList(data.scSchemeDetailsId);
    }
  }, [data.scSchemeDetailsId]);

  // to get component
  const [scComponentListData, setScComponentListData] = useState([]);

  const getComponentList = (schemeId, subSchemeId) => {
    api
      .post(baseURLDBT + `master/cost/get-by-schemeId-and-subSchemeId`, {
        schemeId: schemeId,
        subSchemeId: subSchemeId,
      })
      .then((response) => {
        setScComponentListData(response.data.content.unitCost);
      })
      .catch((err) => {
        setScComponentListData([]);
      });
  };

  const getHeadAccountbyschemeIdAndSubSchemeIdList = (schemeId, subSchemeId) => {
    api
      .post(baseURLDBT + `master/cost/get-hoa-by-schemeId-and-subSchemeId`, {
        schemeId: schemeId,
        subSchemeId: subSchemeId,
      })
      .then((response) => {
        if (response.data.content.unitCost) {
          setScHeadAccountListData(response.data.content.unitCost);
        }
      })
      .catch((err) => {
        setScHeadAccountListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.scSchemeDetailsId && data.scSubSchemeDetailsId) {
      getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
      getHeadAccountbyschemeIdAndSubSchemeIdList(
        data.scSchemeDetailsId,
        data.scSubSchemeDetailsId
      );
    }
  }, [data.scSchemeDetailsId, data.scSubSchemeDetailsId]);

  // to get head of account by sc-scheme-details
  const [scHeadAccountListData, setScHeadAccountListData] = useState([]);
  const getHeadAccountList = (schemeId, subSchemeId, scComponentId) => {
    api
      .post(
        baseURLDBT + `master/cost/get-by-schemeId-and-subSchemeId-and-scComponentId`,
        {
          schemeId: schemeId,
          subSchemeId: subSchemeId,
          scComponentId: scComponentId,
        }
      )
      .then((response) => {
        if (response.data.content.unitCost) {
          setScHeadAccountListData(response.data.content.unitCost);
        }
      })
      .catch((err) => {
        setScHeadAccountListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.scSchemeDetailsId && data.scSubSchemeDetailsId && data.scComponentId) {
      getHeadAccountList(
        data.scSchemeDetailsId,
        data.scSubSchemeDetailsId,
        data.scComponentId
      );
    }
  }, [data.scSchemeDetailsId, data.scSubSchemeDetailsId, data.scComponentId]);

  // get Category List
  const [scCategoryListData, setScCategoryListData] = useState([]);

  const getCategoryList = () => {
    api
      .get(baseURL + `scCategory/get-all`)
      .then((response) => {
        if (response.data.content.scCategory) {
          setScCategoryListData(response.data.content.scCategory);
        }
      })
      .catch((err) => {
        setScCategoryListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getCategoryList();
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
    { name: colHeader(t("Sl.No")),           selector: (row) => row.serialNumber,   cell: (row) => <span>{row.serialNumber}</span>,   sortable: true, hide: "md" },
    { name: colHeader(t("Financial Year")),  selector: (row) => row.financialYear,   cell: (row) => <span>{row.financialYear}</span>,   sortable: true, hide: "md" },
    { name: colHeader(t("District")),        selector: (row) => row.districtName,    cell: (row) => <span>{row.districtName}</span>,    sortable: true, hide: "md" },
    { name: colHeader(t("Scheme")),          selector: (row) => row.schemeName,      cell: (row) => <span>{row.schemeName}</span>,      sortable: true, hide: "md" },
    { name: colHeader(t("Component Type")),  selector: (row) => row.subSchemeName,   cell: (row) => <span>{row.subSchemeName}</span>,   sortable: true, hide: "md" },
    { name: colHeader(t("Component")),       selector: (row) => row.componentName,   cell: (row) => <span>{row.componentName}</span>,   sortable: true, hide: "md" },
    { name: colHeader(t("Sub Component")),   selector: (row) => row.categoryName,    cell: (row) => <span>{row.categoryName}</span>,    sortable: true, hide: "md" },
    { name: colHeader(t("Head of Account")), selector: (row) => row.headAccountName, cell: (row) => <span>{row.headAccountName}</span>, sortable: true, hide: "md" },
    { name: colHeader(t("State Share")),     selector: (row) => row.stateShare,      cell: (row) => <span>{row.stateShare}</span>,      sortable: true, hide: "md" },
    { name: colHeader(t("Central Share")),   selector: (row) => row.centralShare,    cell: (row) => <span>{row.centralShare}</span>,    sortable: true, hide: "md" },
    { name: colHeader(t("Target Type")),     selector: (row) => row.targetType,      cell: (row) => <span>{row.targetType}</span>,      sortable: true, hide: "md" },
    { name: colHeader(t("Month")),           selector: (row) => row.month,           cell: (row) => <span>{row.month}</span>,           sortable: true, hide: "md" },
    { name: colHeader(t("Value")),           selector: (row) => row.value,           cell: (row) => <span>{row.value}</span>,           sortable: true, hide: "md" },
    { name: colHeader(t("User Name")),       selector: (row) => row.userName,        cell: (row) => <span>{row.userName}</span>,        sortable: true, hide: "md" },
  ];

  return (
    <Layout title={t("District Wise Scheme Target Details Report")}>
      <style>{districtWiseSchemeTargetsReportStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("District Wise Scheme Target Details Report")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent></Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontSize: "20px" }}>📋</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>{t("District Wise Scheme Target Details Report")}</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>{t("Select filters to view and export district wise scheme target data")}</div>
            </div>
          </div>
          <Card.Body className="pb-2">
            <Row className="g-2 mb-2 align-items-end" style={{ flexWrap: "nowrap" }}>
              <Col style={{ flex: "1 1 0", minWidth: "100px" }}>
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
              <Col style={{ flex: "1 1 0", minWidth: "100px" }}>
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
              <Col style={{ flex: "1 1 0", minWidth: "100px" }}>
                <label style={lbl}>{t("Scheme")}</label>
                <Form.Select name="scSchemeDetailsId" value={data.scSchemeDetailsId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Scheme Names")}</option>
                  {scSchemeDetailsListData && scSchemeDetailsListData.length
                    ? scSchemeDetailsListData.map((list) => (
                        <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>
                          {i18n.language === "kn" ? list.schemeNameInKannada : list.schemeName}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
              <Col style={{ flex: "1 1 0", minWidth: "100px" }}>
                <label style={lbl}>{t("Component Type")}</label>
                <Form.Select name="scSubSchemeDetailsId" value={data.scSubSchemeDetailsId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Component Type")}</option>
                  {scSubSchemeDetailsListData && scSubSchemeDetailsListData.length
                    ? scSubSchemeDetailsListData.map((list, i) => (
                        <option key={i} value={list.subSchemeId}>
                          {i18n.language === "kn" ? list.subSchemeNameInKannada : list.subSchemeName}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
              <Col style={{ flex: "1 1 0", minWidth: "100px" }}>
                <label style={lbl}>{t("Component")}</label>
                <Form.Select name="scComponentId" value={data.scComponentId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Component")}</option>
                  {scComponentListData && scComponentListData.length
                    ? scComponentListData.map((list) => (
                        <option key={list.scComponentId} value={list.scComponentId}>
                          {i18n.language === "kn" ? list.scComponentNameInKannada : list.scComponentName}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
              <Col style={{ flex: "1 1 0", minWidth: "100px" }}>
                <label style={lbl}>{t("Sub Component")}</label>
                <Form.Select name="scCategoryId" value={data.scCategoryId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Sub Component")}</option>
                  {scCategoryListData && scCategoryListData.length
                    ? scCategoryListData.map((list) => (
                        <option key={list.scCategoryId} value={list.scCategoryId}>
                          {list.codeNumber}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
              <Col style={{ flex: "1 1 0", minWidth: "100px" }}>
                <label style={lbl}>{t("Head of Account")}</label>
                <Form.Select name="scHeadAccountId" value={data.scHeadAccountId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Head of Account")}</option>
                  {scHeadAccountListData && scHeadAccountListData.length
                    ? scHeadAccountListData.map((list) => (
                        <option key={list.headOfAccountId} value={list.headOfAccountId}>
                          {i18n.language === "kn" ? list.scHeadAccountNameInKannada : list.scHeadAccountName}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
              <Col style={{ flex: "1 1 0", minWidth: "100px" }}>
                <label style={lbl}>{t("Target Type")}</label>
                <Form.Select name="targetType" value={data.targetType} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Target Type")}</option>
                  <option value="PHYSICAL TARGET">{t("PHYSICAL TARGET")}</option>
                  <option value="FINANCIAL TARGET">{t("FINANCIAL TARGET")}</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="g-2 mb-2">
              <Col xs="auto">
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

const districtWiseSchemeTargetsReportStyles = `
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

export default DistrictWiseSchemeTargetsReport;
