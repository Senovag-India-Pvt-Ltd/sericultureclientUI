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
import { format } from 'date-fns';


const baseURL = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function ChawkidistributiontoFarmersList() {
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
    .get(baseURL + `Chawki-distribution/get-info`)
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
  const handleView = (_id) => {
    navigate(`/seriui/chawki-distribution-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/chawki-distribution-edit/${_id}`);
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
          .delete(baseURL + `chowkimanagement/delete-info/${_id}`)
          .then((response) => {
            // deleteConfirm(_id);
            getList();
            Swal.fire(
              "Deleted",
              "You successfully deleted this record",
              "success"
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

  const ChawkiDataColumns = [
    {
      name: "Fruits ID",
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Farmer's Name",
      selector: (row) => row.farmerName,
      cell: (row) => <span>{row.farmerName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Father Name",
      selector: (row) => row.fatherName,
      cell: (row) => <span>{row.fatherName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Source of DFLs",
      selector: (row) => row.dflsSource,
      cell: (row) => <span>{row.dflsSource}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Race of DFLs",
      selector: (row) => row.raceName,
      cell: (row) => <span>{row.raceName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Numbers Of DFLs",
      selector: (row) => row.numbersOfDfls,
      cell: (row) => <span>{row.numbersOfDfls}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Lot Number (of the RSP)",
      selector: (row) => row.lotNumberRsp,
      cell: (row) => <span>{row.lotNumberRsp}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Lot No. (CRC)",
      selector: (row) => row.lotNumberCrc,
      cell: (row) => <span>{row.lotNumberCrc}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Lot No. (CRC)",
      selector: (row) => row.lotNumberCrc,
      cell: (row) => <span>{row.lotNumberCrc}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Village",
      selector: (row) => row.villageName,
      cell: (row) => <span>{row.villageName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "District",
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "State",
      selector: (row) => row.stateName,
      cell: (row) => <span>{row.stateName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Sold after 1st/2nd/3rd Moult",
      selector: (row) => row.soldAfter1stOr2ndMould,
      cell: (row) => <span>{row.soldAfter1stOr2ndMould}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Rate per 100 DFLs(optional)",
      selector: (row) => row.ratePer100Dfls,
      cell: (row) => <span>{row.ratePer100Dfls}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "price",
      selector: (row) => row.price,
      cell: (row) => <span>{row.price}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Hatching  date",
      selector: (row) => row.hatchingDate,
      cell: (row) => <span>{row.hatchingDate}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Dispatch date",
      selector: (row) => row.dispatchDate,
      cell: (row) => <span>{row.dispatchDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Receipt Number",
      selector: (row) => row.receiptNo,
      cell: (row) => <span>{row.receiptNo}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.chowkiId)}
          >
            View
          </Button>
          {/* <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.chowkiId)}
          >
            Edit
          </Button>
          <Button
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
      grow: "2",
    },
  ];

  return (
    <Layout title="Chawki Management (Sale Of Chawki Worms)">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Chawki Management (Sale Of Chawki Worms)</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/chawki-distribution"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/chawki-distribution"
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

export default ChawkidistributiontoFarmersList;

