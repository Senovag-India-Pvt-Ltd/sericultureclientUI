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

const baseURL = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;

function SupplyOfDisinfectantsList() {
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
      name: "Action",
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
            className="ms-2"
            onClick={() => handleEdit(row.supplyOfDisinfectantsId)}
          >
            Edit
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
        name: "First Name",
        selector: (row) => row.firstName,
        cell: (row) => <span>{row.firstName}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Disinfectant",
        selector: (row) => row.disinfectantMasterName,
        cell: (row) => <span>{row.disinfectantMasterName}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: "Invoice No",
      selector: (row) => row.invoiceNoDate,
      cell: (row) => <span>{row.invoiceNoDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      cell: (row) => <span>{row.quantity}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Disinfectant Name",
      selector: (row) => row.disinfectantName,
      cell: (row) => <span>{row.disinfectantName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Quantity Supplied",
      selector: (row) => row.suppliedDate,
      cell: (row) => <span>{row.suppliedDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Size Of Rearing House",
      selector: (row) => row.sizeOfRearingHouse,
      cell: (row) => <span>{row.sizeOfRearingHouse}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Number Of Dfls",
      selector: (row) => row.numbersOfDfls,
      cell: (row) => <span>{row.numbersOfDfls}</span>,
      sortable: true,
      hide: "md",
    },
    
  ];

  return (
    <Layout title="Supply Of Disinfectants">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Supply Of Disinfectants</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/supply-of-disinfectants"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/supply-of-disinfectants"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
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

export default SupplyOfDisinfectantsList;

