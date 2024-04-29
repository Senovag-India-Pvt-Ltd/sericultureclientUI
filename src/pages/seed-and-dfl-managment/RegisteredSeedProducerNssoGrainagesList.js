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

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function RegisteredSeedProducerNssoGrainagesList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const getList = () => {
    setLoading(true);

    const response = api
      .get(baseURLSeedDfl + `EggPreparationRsso/get-info`)
      .then((response) => {
        setListData(response.data);
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

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/registered-seed-producer-nsso-grainages-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/registered-seed-producer-nsso-grainages-edit/${_id}`);
    // navigate("/seriui/training Schedule");
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
        console.log("hello");
        const response = api
          .delete(baseURLSeedDfl + `EggPreparationRsso/delete-info/${_id}`)
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

  const RegisteredSeedProducerDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.id)}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.id)}
          >
            Edit
          </Button>
          {/* <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.id)}
            className="ms-2"
          >
            Delete
          </Button> */}
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2,
    },
    {
      name: "Lot Number",
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Number of Cocoons (CB, Hybrid)",
      selector: (row) => row.numberOfCocoonsCB,
      cell: (row) => <span>{row.numberOfCocoonsCB}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Source of Seed Cocoon's",
      selector: (row) => row.sourceMasterName,
      cell: (row) => <span>{row.sourceMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Date of moth emergence",
      selector: (row) => row.dateOfMothEmergence,
      cell: (row) => <span>{row.dateOfMothEmergence}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Laid On Date",
      selector: (row) => row.laidOnDate,
      cell: (row) => <span>{row.laidOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Egg sheet serial number",
      selector: (row) => row.eggSheetSerialNumber,
      cell: (row) => <span>{row.eggSheetSerialNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Number of pairs",
      selector: (row) => row.numberOfPairs,
      cell: (row) => <span>{row.numberOfPairs}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Number of Rejection",
      selector: (row) => row.numberOfRejection,
      cell: (row) => <span>{row.numberOfRejection}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "DFLs obtained",
      selector: (row) => row.dflsObtained,
      cell: (row) => <span>{row.dflsObtained}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Egg Recovery %",
      selector: (row) => row.eggRecoveryPercentage,
      cell: (row) => <span>{row.eggRecoveryPercentage}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: "Test results",
      selector: (row) => row.testResults,
      cell: (row) => <span>{row.testResults}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Certification (Yes/No)",
      selector: (row) => row.certification,
      cell: (row) => <span>{row.certification}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Additional remarks",
      selector: (row) => row.additionalRemarks,
      cell: (row) => <span>{row.additionalRemarks}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title="Registered Seed Producer (RSP) NSSO Grainages List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Registered Seed Producer (RSP) NSSO Grainages List
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/registered-seed-producer-nsso-grainages"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/registered-seed-producer-nsso-grainages"
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
            // title="New Trader License List"
            tableClassName="data-table-head-light table-responsive"
            columns={RegisteredSeedProducerDataColumns}
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

export default RegisteredSeedProducerNssoGrainagesList;
