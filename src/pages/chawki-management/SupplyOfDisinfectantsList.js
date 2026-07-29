import { Card, Form, Row, Col, Button } from "react-bootstrap";
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
import api from "../../../src/services/auth/api";
import ChawkiManagement from "./ChawkiManagement";
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

const baseURL = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;

function SupplyOfDisinfectantsList() {
  const { t } = useTranslation();
/* get table detais */

const [listData, setListData] = useState([]);
const [page, setPage] = useState(0);
const countPerPage = 5;
const [totalRows, setTotalRows] = useState(0);
const [loading, setLoading] = useState(false);
const _params = { params: { pageNumber: page, size: countPerPage } };

const getList = () => {
  setLoading(true);

  const response = api
    .get(baseURL + `cropInspection/get-supply-of-disinfectants-info`)
    .then((response) => {
      console.log(response.data);
      setListData(response.data);
      // setTotalRows(response.data.content.totalItems);
      setLoading(false);
    })
    .catch((err) => {
      // setListData({});
      setLoading(false);
    });
};

useEffect(() => {
    getList();
  }, []);

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

  const navigate = useNavigate();
//   const handleView = (_id) => {
//     navigate(`/seriui/chawki-management-view/${_id}`);
//   };

  const handleEdit = (_id) => {
    navigate(`/seriui/supply-of-disinfectants-edit/${_id}`);
    // navigate("/seriui/state");
  };

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const ChawkiDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          {/* <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.chowkiId)}
          >
            View
          </Button> */}
          <Button
            variant="primary"
            size="sm"
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm"
            onClick={() => handleEdit(row.supplyOfDisinfectantsId)}
          >
            <Icon name="edit" />
            {t("Edit")}
          </Button>
          {/* <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.chowkiId)}
            className="ms-2"
          >
            Delete
          </Button> */}
        </div>
      ),
      sortable: false,
      hide: "md",
      // grow: 2,
    },
    {
        name: t("First Name"),
        selector: (row) => row.firstName,
        cell: (row) => <span>{row.firstName}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Disinfectant"),
        selector: (row) => row.disinfectantMasterName,
        cell: (row) => <span>{row.disinfectantMasterName}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: t("Invoice No"),
      selector: (row) => row.invoiceNoDate,
      cell: (row) => <span>{row.invoiceNoDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Quantity"),
      selector: (row) => row.quantity,
      cell: (row) => <span>{row.quantity}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Disinfectant Name"),
      selector: (row) => row.disinfectantName,
      cell: (row) => <span>{row.disinfectantName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Quantity Supplied"),
      selector: (row) => row.quantitySupplied,
      cell: (row) => <span>{row.quantitySupplied}</span>,
      sortable: true,
      hide: "md",
    },
    {
        name: t("Date Of Supply"),
        selector: (row) => row.supplyDate,
        cell: (row) => <span>{row.supplyDate}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: t("Size Of Rearing House"),
      selector: (row) => row.sizeOfRearingHouse,
      cell: (row) => <span>{row.sizeOfRearingHouse}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Number Of Dfls"),
      selector: (row) => row.numbersOfDfls,
      cell: (row) => <span>{row.numbersOfDfls}</span>,
      sortable: true,
      hide: "md",
    },
    
  ];

  return (
    <Layout title={t("Supply Of Disinfectants")}>
      <style>{supplyOfDisinfectantsListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Supply Of Disinfectants")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/supply-of-disinfectants"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("Create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/supply-of-disinfectants"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("Create")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card>
        <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={ChawkiDataColumns}
            data={listData}
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

const supplyOfDisinfectantsListStyles = `
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
  .sh-cta-btn {
    background: #ffffff;
    color: #1e67a8 !important;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
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

export default SupplyOfDisinfectantsList;

