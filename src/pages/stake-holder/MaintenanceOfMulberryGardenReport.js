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
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";
const CTRL_H = "44px";
const lbl = { fontSize: "12px", fontWeight: 600, color: "#212529", marginBottom: "3px", display: "block" };
const sel = { height: CTRL_H, fontSize: "14px", backgroundColor: "#fff" };

function MaintenanceOfMulberryGardenReport() {
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 25;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    varietyId: "",
    soilTypeId: "",
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `Mulberry-garden/maintenanceOfMulberryGardenDetails`,
        {},
        {
          params: {
            varietyId: data.varietyId || 0,
            soilTypeId: data.soilTypeId || 0,
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
        baseURLFarmer + `Mulberry-garden/maintenanceOfMulberryGardenReport`,
        {},
        {
          params: {
            varietyId: data.varietyId || 0,
            soilTypeId: data.soilTypeId || 0,
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
        link.download = `maintenance_of_mulberry_garden_report.xlsx`;
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
        baseURLFarmer + `Mulberry-garden/maintenanceOfMulberryGardenDetails`,
        {},
        {
          params: {
            varietyId: data.varietyId || 0,
            soilTypeId: data.soilTypeId || 0,
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

  // to get Mulberry Variety
  const [varietyListData, setVarietyListData] = useState([]);

  const getVarietyList = () => {
    api
      .get(baseURL + `mulberry-variety/get-all`)
      .then((response) => {
        setVarietyListData(response.data.content.mulberryVariety);
      })
      .catch((err) => {
        setVarietyListData([]);
      });
  };

  // to get Soil Type
  const [soilTypeListData, setSoilTypeListData] = useState([]);

  const getSoilTypeList = () => {
    api
      .get(baseURL + `soilType/get-all`)
      .then((response) => {
        setSoilTypeListData(response.data.content.soilType);
      })
      .catch((err) => {
        setSoilTypeListData([]);
      });
  };

  useEffect(() => {
    getSoilTypeList();
    getVarietyList();
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
    { name: colHeader("Sl.No"),                      selector: (row) => row.serialNumber,             cell: (row) => <span>{row.serialNumber}</span>,             sortable: true, hide: "md" },
    { name: colHeader("Plot Number"),                 selector: (row) => row.plotNumber,               cell: (row) => <span>{row.plotNumber}</span>,               sortable: true, hide: "md" },
    { name: colHeader("Mulberry Variety"),            selector: (row) => row.varietyName,              cell: (row) => <span>{row.varietyName}</span>,              sortable: true, hide: "md" },
    { name: colHeader("Area Under Each Variety"),     selector: (row) => row.areaUnderEachVariety,     cell: (row) => <span>{row.areaUnderEachVariety}</span>,     sortable: true, hide: "md" },
    { name: colHeader("Pruning Date"),                selector: (row) => row.pruningDate,              cell: (row) => <span>{row.pruningDate}</span>,              sortable: true, hide: "md" },
    { name: colHeader("Plantation Date"),             selector: (row) => row.plantationDate,           cell: (row) => <span>{row.plantationDate}</span>,           sortable: true, hide: "md" },
    { name: colHeader("Soil Type"),                   selector: (row) => row.soilTypeName,             cell: (row) => <span>{row.soilTypeName}</span>,             sortable: true, hide: "md" },
    { name: colHeader("Mulberry Spacing"),            selector: (row) => row.mulberrySpacing,          cell: (row) => <span>{row.mulberrySpacing}</span>,          sortable: true, hide: "md" },
    { name: colHeader("Fertilizer Application Date"), selector: (row) => row.fertilizerApplicationDate, cell: (row) => <span>{row.fertilizerApplicationDate}</span>, sortable: true, hide: "md" },
    { name: colHeader("FYM Application Date"),        selector: (row) => row.fymApplicationDate,       cell: (row) => <span>{row.fymApplicationDate}</span>,       sortable: true, hide: "md" },
    { name: colHeader("Irrigation Date"),             selector: (row) => row.irrigationDate,           cell: (row) => <span>{row.irrigationDate}</span>,           sortable: true, hide: "md" },
  ];

  return (
    <Layout title={t("Mulberry Garden Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Mulberry Garden Report")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent></Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontSize: "20px" }}>🌿</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>Mulberry Garden Report</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>Select filters to view and export mulberry garden data</div>
            </div>
          </div>
          <Card.Body className="pb-2">
            <Row className="g-2 mb-2 align-items-end">
              <Col lg={2}>
                <label style={lbl}>{t("Mulberry Variety")}</label>
                <Form.Select name="varietyId" value={data.varietyId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Mulberry Variety")}</option>
                  {varietyListData.map((list) => (
                    <option key={list.mulberryVarietyId} value={list.mulberryVarietyId}>
                      {list.mulberryVarietyName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col lg={2}>
                <label style={lbl}>{t("Soil Type")}</label>
                <Form.Select name="soilTypeId" value={data.soilTypeId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Soil Type")}</option>
                  {soilTypeListData.map((list) => (
                    <option key={list.soilTypeId} value={list.soilTypeId}>
                      {list.soilTypeName}
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

export default MaintenanceOfMulberryGardenReport;
