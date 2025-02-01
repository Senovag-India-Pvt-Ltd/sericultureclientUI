import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
// import axios from "axios";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Icon, Select } from "../../components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";


const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;

function FarmerDetailsListFromSeedAndDFL() {
   // Translation
   const { t } = useTranslation();
  const [listSaleAndDisposalOfDflData, setSaleAndDisposalOfDflData] = useState({});
  const [listSaleAndDisposalOfDflRssoData, setSaleAndDisposalOfDflRssoData] = useState({});
  const [listChowkiManagementData, setChowkiManagementData] = useState({});
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
        const message = err.response.data.errorMessages[0].message[0].message;
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
        const message = err.response.data.errorMessages[0].message[0].message;
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
        const message = err.response.data.errorMessages[0].message[0].message;
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
        const message = err.response.data.errorMessages[0].message[0].message;
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
    "light"
  );

  const customStyles = {
    rows: {
      style: {
        minHeight: "45px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        fontSize: "14px",
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

  const SaleAndDisposalDataColumns = [
    {
        name: t("Fruits Id"),
        selector: (row) => row.fruitsId,
        cell: (row) => <span>{row.fruitsId}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: t("Name and Address of the Farm"),
      selector: (row) => row.nameAndAddressOfTheFarm,
      cell: (row) => <span>{row.nameAndAddressOfTheFarm}</span>,
      sortable: true,
      hide: "md",
    },
    {
        name: t("Lot Number"),
        selector: (row) => row.lotNumberCrc,
        cell: (row) => <span>{row.lotNumberCrc}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("No of DFLs"),
        selector: (row) => row.numbersOfDfls,
        cell: (row) => <span>{row.numbersOfDfls}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Rate Per 100 DFLs"),
        selector: (row) => row.ratePer100Dfls,
        cell: (row) => <span>{row.ratePer100Dfls}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: t("Race"),
      selector: (row) => row.raceName,
      cell: (row) => <span>{row.raceName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Hatching Date"),
      selector: (row) => row.hatchingInspectionDate,
      cell: (row) => <span>{row.hatchingInspectionDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
        name: t("Date Of Disposal"),
        selector: (row) => row.dateOfDisposal,
        cell: (row) => <span>{row.dateOfDisposal}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Dfls Source"),
        selector: (row) => row.dflsSource,
        cell: (row) => <span>{row.dflsSource}</span>,
        sortable: true,
        hide: "md",
      },
  ];

  

  const SaleAndDisposalRssoDataColumns = [
    {
        name: t("Fruits Id"),
        selector: (row) => row.fruitsId,
        cell: (row) => <span>{row.fruitsId}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: t("Name and Address of the Farm"),
      selector: (row) => row.nameAndAddressOfTheFarm,
      cell: (row) => <span>{row.nameAndAddressOfTheFarm}</span>,
      sortable: true,
      hide: "md",
    },
    {
        name: t("Lot Number"),
        selector: (row) => row.lotNumberCrc,
        cell: (row) => <span>{row.lotNumberCrc}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("No of DFLs"),
        selector: (row) => row.numbersOfDfls,
        cell: (row) => <span>{row.numbersOfDfls}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Rate Per 100 DFLs"),
        selector: (row) => row.ratePer100Dfls,
        cell: (row) => <span>{row.ratePer100Dfls}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: t("Race"),
      selector: (row) => row.raceName,
      cell: (row) => <span>{row.raceName}</span>,
      sortable: true,
      hide: "md",
    }
  ];

  const ChowkiManagementDataColumns = [
    {
        name: t("Fruits Id"),
        selector: (row) => row.fruitsId,
        cell: (row) => <span>{row.fruitsId}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: t("Name and Address of the Farm"),
      selector: (row) => row.nameAndAddressOfTheFarm,
      cell: (row) => <span>{row.nameAndAddressOfTheFarm}</span>,
      sortable: true,
      hide: "md",
    },
    {
        name: t("Lot Number"),
        selector: (row) => row.lotNumberCrc,
        cell: (row) => <span>{row.lotNumberCrc}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("No of DFLs"),
        selector: (row) => row.numbersOfDfls,
        cell: (row) => <span>{row.numbersOfDfls}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Rate Per 100 DFLs"),
        selector: (row) => row.ratePer100Dfls,
        cell: (row) => <span>{row.ratePer100Dfls}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: t("Race"),
      selector: (row) => row.raceName,
      cell: (row) => <span>{row.raceName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Hatching Date"),
      selector: (row) => row.hatchingInspectionDate,
      cell: (row) => <span>{row.hatchingInspectionDate}</span>,
      sortable: true,
      hide: "md",
    },
      {
        name: t("Dfls Source"),
        selector: (row) => row.dflsSource,
        cell: (row) => <span>{row.dflsSource}</span>,
        sortable: true,
        hide: "md",
      },
  ];

  

  return (
    <Layout title={t("List of Sold DFL Details")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("List of Sold DFL Details")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      {/* Radio Buttons */}
      <Block className="mt-n4">
        <Card>
          <Card.Body>
            <Row lg="12" className="g-gs">
              <Col lg="4">
                <Form.Group as={Row} className="form-group" controlId="farm">
                  <Col sm={1}>
                    <Form.Check
                      type="radio"
                      name="userType"
                      value="farm"
                      checked={selectedCategory === "farm"}
                      onChange={handleCategoryChange}
                    />
                  </Col>
                  <Form.Label column sm={9} className="mt-n2">
                    {t("Sale and Disposal of Dfls (eggs)")}
                  </Form.Label>
                </Form.Group>
              </Col>
              
              <Col lg="4">
                <Form.Group as={Row} className="form-group" controlId="farmer">
                  <Col sm={1}>
                    <Form.Check
                      type="radio"
                      name="userType"
                      value="farmer"
                      checked={selectedCategory === "farmer"}
                      onChange={handleCategoryChange}
                    />
                  </Col>
                  <Form.Label column sm={9} className="mt-n2">
                    {t("Sale and Disposal of Dfls (eggs) RSP/NSSO")}
                  </Form.Label>
                </Form.Group>
              </Col>

              <Col lg="4">
                <Form.Group as={Row} className="form-group" controlId="crc">
                  <Col sm={1}>
                    <Form.Check
                      type="radio"
                      name="userType"
                      value="crc"
                      checked={selectedCategory === "crc"}
                      onChange={handleCategoryChange}
                    />
                  </Col>
                  <Form.Label column sm={9} className="mt-n2">
                    {t("Chowki Management")}
                  </Form.Label>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>

      {/* Conditionally Render Data Table */}
      <Block className="mt-n4">
        <Card>
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
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
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

export default FarmerDetailsListFromSeedAndDFL;
