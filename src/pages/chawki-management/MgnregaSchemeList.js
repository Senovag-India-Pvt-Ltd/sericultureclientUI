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

function MgnregaSchemeList() {
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
    .get(baseURL + `cropInspection/get-mgnrega-scheme-info`)
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
    navigate(`/seriui/mgnerga-scheme-edit/${_id}`);
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
            onClick={() => handleEdit(row.mgnregaSchemeId)}
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
        name: "Acres Planted",
        selector: (row) => row.acresPlanted,
        cell: (row) => <span>{row.acresPlanted}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Sapling Followed(In Feet)",
        selector: (row) => row.spacingFollwedFeet,
        cell: (row) => <span>{row.spacingFollwedFeet}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: "Sapling Procured(Nos)",
      selector: (row) => row.spacingProcuredNos,
      cell: (row) => <span>{row.spacingProcuredNos}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Sapling Followed",
      selector: (row) => row.spacingFollowed,
      cell: (row) => <span>{row.spacingFollowed}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Sapling Procured",
      selector: (row) => row.spacingProcured,
      cell: (row) => <span>{row.spacingProcured}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Number of cutting Planted",
      selector: (row) => row.noOfCuttingPlanted,
      cell: (row) => <span>{row.noOfCuttingPlanted}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Number of successful samplings distributed",
      selector: (row) => row.noOfSuccessfullSamplings,
      cell: (row) => <span>{row.noOfSuccessfullSamplings}</span>,
      sortable: true,
      hide: "md",
    },
    
    
  ];

  return (
    <Layout title="List Of MGNREGA Scheme">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">List Of MGNREGA Scheme</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/mgnerga-scheme"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/mgnerga-scheme"
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

export default MgnregaSchemeList;

