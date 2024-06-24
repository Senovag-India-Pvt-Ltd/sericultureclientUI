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
import { format } from 'date-fns';

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function PreservationofseedcocoonforprocessingList() {
  const [listData, setListData] = useState({});
  const [listLogsData, setListLogsData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [showModal, setShowModal] = useState(true);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const getList = () => {
    setLoading(true);

    const response = api
      .get(baseURLSeedDfl + `PreservationOfSeed/get-info`)
      .then((response) => {
        // console.log(response.data)
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

  // const getAlertList = () => {
  //   setLoading(true);
  //   const response = api
  //     .get(baseURLSeedDfl + `PreservationOfSeed/get-alert-data`)
  //     .then((response) => {
  //       // console.log(response.data)
  //       setListLogsData(response.data);
  //       // setTotalRows(response.data.content.totalItems);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       // setListData({});
  //       setLoading(false);
  //     });
  // };

  const getAlertList = () => {
    setLoading(true);
    api.get(baseURLSeedDfl + `PreservationOfSeed/get-alert-data`)
      .then((response) => {
        setListLogsData(response.data);
        setLoading(false);
        if (response.data.length > 0) {
          setShowModal(true);
        } else {
          setShowModal(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  

  useEffect(() => {
    getAlertList();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return ''; 
    const date = new Date(dateString); 
    return format(date, 'dd/MM/yyyy'); 
  };

  
  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/preservation-of-seed-cocoon-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/preservation-of-seed-cocoon-edit/${_id}`);
  };



  const deleteError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: message,
    });
  };

  const deleteConfirm = (_id,status) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will Reject permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject it!",
    }).then((result) => {
      if (result.value) {
        console.log("hello");
        const response = api
          .delete(baseURLSeedDfl + `PreservationOfSeed/accept-reject-dfls/${_id}/${status}`)
          .then((response) => {
            // deleteConfirm(_id);
            getList();
            Swal.fire(
              "Rejected",
              "You successfully rejected this record",
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

  const acceptError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Accept attempt was not successful",
      text: message,
    });
  };

  const acceptConfirm = (_id, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will Accept!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Accept it!",
    }).then((result) => {
      if (result.value) {
        console.log("hello");
        const response = api
          .get(baseURLSeedDfl + `PreservationOfSeed/accept-reject-dfls/${_id}/${status}`)
          .then((response) => {
            // deleteConfirm(_id);
            getList();
            Swal.fire(
              "Accepted",
              "You successfully Accepted this record",
              "success"
            );
          })
          .catch((err) => {
            acceptError();
          });
        // Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not accepted", "info");
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

  const ReceiptofDFLsfromtheP4grainageGardenDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => acceptConfirm(row.id, 1)}
          >
            Accept
          </Button>
         
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.id, 2)}
            className="ms-2"
          >
            Reject
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      // grow: 3,
    },

    {
      name: "Lot Number",
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Name Of Supplier",
      selector: (row) => row.nameOfSupplier,
      cell: (row) => <span>{row.nameOfSupplier}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Spun On Date",
      selector: (row) => row.spunOnDate,
      cell: (row) => <span>{row.spunOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Date of supply",
      selector: (row) => row.dateOfSupply,
      cell: (row) => <span>{row.dateOfSupply}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "No Of Cocoons Dispatched",
      selector: (row) => row.numberOfCocoonsDispatched,
      cell: (row) => <span>{row.numberOfCocoonsDispatched}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Invoice No",
      selector: (row) => row.invoiceNo,
      cell: (row) => <span>{row.invoiceNo}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Accepted or not",
    //   selector: (row) => row.isAccepted,
    //   cell: (row) => <span>{row.isAccepted}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Accepted or not",
      selector: (row) => row.isAccepted,
      cell: (row) => (
        <span>
          {row.isAccepted === 0
            ? "Pending"
            : row.isAccepted === 1
            ? "Accepted"
            : row.isAccepted === 2
            ? "Rejected"
            : "Unknown"}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
  ];




  const PreservationOfSeedCocoonForProcessingDataColumns = [
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
            onClick={() => deleteConfirm(row.id, row.plotNumber)}
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
      name: "Race ",
      selector: (row) => row.raceName,
      cell: (row) => <span>{row.raceName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: " Name of the Government Seed Farm/Farmer",
      selector: (row) => row.nameOfTheGovernmentSeedFarmOrFarmer,
      cell: (row) => <span>{row.nameOfTheGovernmentSeedFarmOrFarmer}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Date Of Seed Cocoon Supply",
      selector: (row) => row.dateOfSeedCocoonSupply,
      cell: (row) => <span>{row.dateOfSeedCocoonSupply}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: "Spun On Date",
      selector: (row) => row.spunOnDate,
      cell: (row) => <span>{formatDate(row.spunOnDate)}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Crop Number",
      selector: (row) => row.cropNumber,
      cell: (row) => <span>{row.cropNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Line Name",
      selector: (row) => row.lineName,
      cell: (row) => <span>{row.lineName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Bed Number/Kgs of cocoons supplied",
      selector: (row) => row.bedNumberOrKgsOfCocoonsSupplied,
      cell: (row) => <span>{row.bedNumberOrKgsOfCocoonsSupplied}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Number of pupa examined",
      selector: (row) => row.numberOfPupaExamined,
      cell: (row) => <span>{row.numberOfPupaExamined}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Cocoon rejection details/ numbers",
      selector: (row) => row.cocoonRejectionDetails,
      cell: (row) => <span>{row.cocoonRejectionDetails}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: "Invoice Date",
      selector: (row) => row.invoiceDate,
      cell: (row) => <span>{formatDate(row.invoiceDate)}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Rate Per Kg",
      selector: (row) => row.ratePerKg,
      cell: (row) => <span>{row.ratePerKg}</span>,
      sortable: true,
      hide: "md",
    },
  
  ];

  return (
    <Layout title="Preservation of seed cocoon for processing List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Preservation of seed cocoon for processing List
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Preservation-of-seed-cocoon-for-processing"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Preservation-of-seed-cocoon-for-processing"
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
            columns={PreservationOfSeedCocoonForProcessingDataColumns}
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

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Alerts Window</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-2">
            <Card>
              <DataTable
                // title="New Trader License List"
                tableClassName="data-table-head-light table-responsive"
                columns={ReceiptofDFLsfromtheP4grainageGardenDataColumns}
                data={listLogsData}
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
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default PreservationofseedcocoonforprocessingList;
