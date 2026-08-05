import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
// import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Icon, Select } from "../../components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";
const CTRL_H = "44px";
const lbl = { fontSize: "12px", fontWeight: 600, color: "#212529", marginBottom: "3px", display: "block" };
const sel = { height: CTRL_H, fontSize: "14px", backgroundColor: "#fff" };


const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;

function FarmerDetailsListFromSeedAndDFL() {
   // Translation
   const { t } = useTranslation();
  const [listSaleAndDisposalOfDflData, setSaleAndDisposalOfDflData] = useState([]);
  const [listSaleAndDisposalOfDflRssoData, setSaleAndDisposalOfDflRssoData] = useState([]);
  const [listChowkiManagementData, setChowkiManagementData] = useState([]);
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [tscMasterId, setTscMasterId] = useState(null); 

  const [selectedCategory, setSelectedCategory] = useState("farm");

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
   //   to get data from api
   const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `userMaster/get/${localStorage.getItem("userMasterId")}`)
      .then((response) => {
        setTscMasterId(response.data.content.tscMasterId);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response?.data?.errorMessages?.[0]?.message?.[0]?.message;
        setTscMasterId({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, []);

  //   to get data from api
  const getSaleandDisposalList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `chowkimanagement/getFarmerDetailsFromSaleDisposalOfDFlsByTsc/${tscMasterId}`)
      .then((response) => {
        setSaleAndDisposalOfDflData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response?.data?.errorMessages?.[0]?.message?.[0]?.message;
        // setData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    if (tscMasterId) {
      getSaleandDisposalList();
    }
  }, [tscMasterId]);

  //   to get data from api
  const getSaleandDisposalRssoList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `chowkimanagement/getFarmerDetailsFromSaleDisposalOfDFlsRssoByTsc/${tscMasterId}`)
      .then((response) => {
        setSaleAndDisposalOfDflRssoData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response?.data?.errorMessages?.[0]?.message?.[0]?.message;
        // setData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    if (tscMasterId) {
      getSaleandDisposalRssoList();
    }
  }, [tscMasterId]);

  //   to get data from api
  const getChowkiList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `chowkimanagement/getFarmerDetailsFromChowkiManagementByTsc/${tscMasterId}`)
      .then((response) => {
        setChowkiManagementData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response?.data?.errorMessages?.[0]?.message?.[0]?.message;
        // setData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    if (tscMasterId) {
      getChowkiList();
    }
  }, [tscMasterId]);

 
  const navigate = useNavigate();
 


  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

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

  const SaleAndDisposalDataColumns = [
    { name: colHeader(t("Fruits Id")),                    selector: (row) => row.fruitsId,                 cell: (row) => <span>{row.fruitsId}</span>,                 sortable: true },
    { name: colHeader(t("Name and Address of the Farm")), selector: (row) => row.nameAndAddressOfTheFarm,  cell: (row) => <span>{row.nameAndAddressOfTheFarm}</span>,  sortable: true },
    { name: colHeader(t("Lot Number")),                   selector: (row) => row.lotNumberCrc,             cell: (row) => <span>{row.lotNumberCrc}</span>,             sortable: true },
    { name: colHeader(t("No of DFLs")),                   selector: (row) => row.numbersOfDfls,            cell: (row) => <span>{row.numbersOfDfls}</span>,            sortable: true },
    { name: colHeader(t("Rate Per 100 DFLs")),            selector: (row) => row.ratePer100Dfls,           cell: (row) => <span>{row.ratePer100Dfls}</span>,           sortable: true },
    { name: colHeader(t("Race")),                         selector: (row) => row.raceName,                 cell: (row) => <span>{row.raceName}</span>,                 sortable: true },
    { name: colHeader(t("Hatching Date")),                selector: (row) => row.hatchingInspectionDate,   cell: (row) => <span>{row.hatchingInspectionDate}</span>,   sortable: true },
    { name: colHeader(t("Date Of Disposal")),             selector: (row) => row.dateOfDisposal,           cell: (row) => <span>{row.dateOfDisposal}</span>,           sortable: true },
    { name: colHeader(t("Dfls Source")),                  selector: (row) => row.dflsSource,               cell: (row) => <span>{row.dflsSource}</span>,               sortable: true },
  ];

  

  const SaleAndDisposalRssoDataColumns = [
    { name: colHeader(t("Fruits Id")),                    selector: (row) => row.fruitsId,                 cell: (row) => <span>{row.fruitsId}</span>,                 sortable: true },
    { name: colHeader(t("Name and Address of the Farm")), selector: (row) => row.nameAndAddressOfTheFarm,  cell: (row) => <span>{row.nameAndAddressOfTheFarm}</span>,  sortable: true },
    { name: colHeader(t("Lot Number")),                   selector: (row) => row.lotNumberCrc,             cell: (row) => <span>{row.lotNumberCrc}</span>,             sortable: true },
    { name: colHeader(t("No of DFLs")),                   selector: (row) => row.numbersOfDfls,            cell: (row) => <span>{row.numbersOfDfls}</span>,            sortable: true },
    { name: colHeader(t("Rate Per 100 DFLs")),            selector: (row) => row.ratePer100Dfls,           cell: (row) => <span>{row.ratePer100Dfls}</span>,           sortable: true },
    { name: colHeader(t("Race")),                         selector: (row) => row.raceName,                 cell: (row) => <span>{row.raceName}</span>,                 sortable: true },
  ];

  const ChowkiManagementDataColumns = [
    { name: colHeader(t("Fruits Id")),                    selector: (row) => row.fruitsId,                 cell: (row) => <span>{row.fruitsId}</span>,                 sortable: true },
    { name: colHeader(t("Name and Address of the Farm")), selector: (row) => row.nameAndAddressOfTheFarm,  cell: (row) => <span>{row.nameAndAddressOfTheFarm}</span>,  sortable: true },
    { name: colHeader(t("Lot Number")),                   selector: (row) => row.lotNumberCrc,             cell: (row) => <span>{row.lotNumberCrc}</span>,             sortable: true },
    { name: colHeader(t("No of DFLs")),                   selector: (row) => row.numbersOfDfls,            cell: (row) => <span>{row.numbersOfDfls}</span>,            sortable: true },
    { name: colHeader(t("Rate Per 100 DFLs")),            selector: (row) => row.ratePer100Dfls,           cell: (row) => <span>{row.ratePer100Dfls}</span>,           sortable: true },
    { name: colHeader(t("Race")),                         selector: (row) => row.raceName,                 cell: (row) => <span>{row.raceName}</span>,                 sortable: true },
    { name: colHeader(t("Hatching Date")),                selector: (row) => row.hatchingInspectionDate,   cell: (row) => <span>{row.hatchingInspectionDate}</span>,   sortable: true },
    { name: colHeader(t("Dfls Source")),                  selector: (row) => row.dflsSource,               cell: (row) => <span>{row.dflsSource}</span>,               sortable: true },
  ];

  

  return (
    <Layout title={t("List of Sold DFL Details")}>
      <style>{farmerDetailsListFromSeedAndDFLStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("List of Sold DFL Details")}</Block.Title>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontSize: "20px" }}>🌱</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>List of Sold DFL Details</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>Select a category to view farmer DFL details</div>
            </div>
          </div>
          <Card.Body className="pb-2">
            <Row className="g-2 mb-2 align-items-center">
              <Col lg="4">
                <Form.Group as={Row} className="form-group align-items-center" controlId="farm">
                  <Col xs="auto">
                    <Form.Check
                      type="radio"
                      name="userType"
                      value="farm"
                      checked={selectedCategory === "farm"}
                      onChange={handleCategoryChange}
                    />
                  </Col>
                  <Col>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#212529" }}>{t("Sale and Disposal of Dfls (eggs)")}</span>
                  </Col>
                </Form.Group>
              </Col>

              <Col lg="4">
                <Form.Group as={Row} className="form-group align-items-center" controlId="farmer">
                  <Col xs="auto">
                    <Form.Check
                      type="radio"
                      name="userType"
                      value="farmer"
                      checked={selectedCategory === "farmer"}
                      onChange={handleCategoryChange}
                    />
                  </Col>
                  <Col>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#212529" }}>{t("Sale and Disposal of Dfls (eggs) RSP/NSSO")}</span>
                  </Col>
                </Form.Group>
              </Col>

              <Col lg="4">
                <Form.Group as={Row} className="form-group align-items-center" controlId="crc">
                  <Col xs="auto">
                    <Form.Check
                      type="radio"
                      name="userType"
                      value="crc"
                      checked={selectedCategory === "crc"}
                      onChange={handleCategoryChange}
                    />
                  </Col>
                  <Col>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#212529" }}>{t("Chawki Management")}</span>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mt-3" style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.08)" }}>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={
              selectedCategory === "farm"
                ? SaleAndDisposalDataColumns
                : selectedCategory === "farmer"
                ? SaleAndDisposalRssoDataColumns
                : ChowkiManagementDataColumns
            }
            data={
              selectedCategory === "farm"
                ? listSaleAndDisposalOfDflData
                : selectedCategory === "farmer"
                ? listSaleAndDisposalOfDflRssoData
                : listChowkiManagementData
            }
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

const farmerDetailsListFromSeedAndDFLStyles = `
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

export default FarmerDetailsListFromSeedAndDFL;
