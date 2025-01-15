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
import { useTranslation } from 'react-i18next';

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function PreservationofseedcocoonforprocessingList() {
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [listLogsData, setListLogsData] = useState({});
  const [listLogsForMarketData, setListLogsForMarketData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [showModal, setShowModal] = useState(true);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [showModal1, setShowModal1] = useState(true);

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const [showModal4, setShowModal4] = useState(false);
  const handleShowModal4 = () => setShowModal4(true); 
  const handleCloseModal4 = () => setShowModal4(false);

  const [listMoultData, setMoultListData] = useState({});

  const getRejectedList = () => {
    setLoading(true);
  
    api
      .get(baseURLSeedDfl + `PreservationOfSeed/get-rejected-list-for-market`)
      .then((response) => {
        setMoultListData(response.data);
        setLoading(false);
        handleShowModal4(); // Open modal after data is fetched
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  // useEffect(() => {
  //   getRejectedList();
  // }, []);

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

  const [senderType, setSenderType] = useState(null);

  const [buyerType, setBuyerType] = useState(null);

  const getAlertList = () => {
    setLoading(true);
    api.get(baseURLSeedDfl + `PreservationOfSeed/get-alert-data`)
      .then((response) => {
        setListLogsData(response.data);
        setLoading(false);
        if (response.data.length > 0) {
          setSenderType(response.data[0].senderType);
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

  const getAlertListForMarket = () => {
    setLoading(true);
    api.get(baseURLSeedDfl + `PreservationOfSeed/get-alert-data-for-market`)
      .then((response) => {
        setListLogsForMarketData(response.data);
        setLoading(false);
        if (response.data.length > 0) {
          // setBuyerType(response.data[0].buyerType);
          setShowModal1(true);
        } else {
          setShowModal1(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  

  useEffect(() => {
    getAlertListForMarket();
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



  const acceptConfirm = (_id, status, senderType) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will Accept!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Accept it!",
    }).then((result) => {
      if (result.value) {
        console.log("hello");
        api
          .get(baseURLSeedDfl + `PreservationOfSeed/accept-reject-dfls/${_id}/${status}/${senderType}`)
          .then((response) => {
            if (response.data.error === 1) {
              acceptError(response.data.message || "An error occurred while accepting the record.");
            } else {
              // getList();
              Swal.fire("Accepted", "You successfully Accepted this record", "success");
              getAlertList();
              getList();
            }
          })
          .catch((err) => {
            acceptError("An error occurred while accepting the record.");
          });
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not accepted", "info");
      }
    });
  };
  
  const deleteConfirm = (_id, status, senderType) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will Reject permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject it!",
    }).then((result) => {
      if (result.value) {
        console.log("hello");
        api
          .get(baseURLSeedDfl + `PreservationOfSeed/accept-reject-dfls/${_id}/${status}/${senderType}`)
          .then((response) => {
            if (response.data.error === 1) {
              deleteError(response.data.message || "An error occurred while rejecting the record.");
            } else {
              // getList();
              Swal.fire("Rejected", "You successfully rejected this record", "success");
              getAlertList();
              getList();
            }
          })
          .catch((err) => {
            deleteError("An error occurred while rejecting the record.");
          });
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
    });
  };

  const acceptConfirmForMarket = (_id, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will Accept!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Accept it!",
    }).then((result) => {
      if (result.value) {
        console.log("hello");
        api
          .get(baseURLSeedDfl + `PreservationOfSeed/accept-reject-dfls/${_id}/${status}`)
          .then((response) => {
            if (response.data.error === 1) {
              acceptError(response.data.message || "An error occurred while accepting the record.");
            } else {
              // getList();
              Swal.fire("Accepted", "You successfully Accepted this record", "success");
              getAlertListForMarket();
              getList();
            }
          })
          .catch((err) => {
            acceptError("An error occurred while accepting the record.");
          });
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not accepted", "info");
      }
    });
  };
  
  const deleteConfirmForMarket = (_id, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will Reject permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject it!",
    }).then((result) => {
      if (result.value) {
        console.log("hello");
        api
          .get(baseURLSeedDfl + `PreservationOfSeed/accept-reject-dfls/${_id}/${status}`)
          .then((response) => {
            if (response.data.error === 1) {
              deleteError(response.data.message || "An error occurred while rejecting the record.");
            } else {
              // getList();
              Swal.fire("Rejected", "You successfully rejected this record", "success");
              getAlertListForMarket();
              getList();
            }
          })
          .catch((err) => {
            deleteError("An error occurred while rejecting the record.");
          });
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
  
  const deleteError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Reject attempt was not successful",
      text: message,
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
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => acceptConfirm(row.id, 1,row.senderType)}
          >
            {t("Accept")}
          </Button>
         
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.id, 2,row.senderType)}
            className="ms-2"
          >
            {t("Reject")}
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2,
    },

    {
      name: t("Lot Number"),
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: t("Name Of Supplier"),
      selector: (row) => row.nameOfSupplier,
      cell: (row) => <span>{row.nameOfSupplier}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Spun On Date"),
      selector: (row) => row.spunOnDate,
      cell: (row) => <span>{row.spunOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Date of supply"),
      selector: (row) => row.dateOfSupply,
      cell: (row) => <span>{row.dateOfSupply}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("No Of Cocoons Dispatched"),
      selector: (row) => row.numberOfCocoonsDispatched,
      cell: (row) => <span>{row.numberOfCocoonsDispatched}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Invoice No"),
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
      name: t("Accepted or not"),
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
    {
      name: t("Sender Type"),
      selector: (row) => row.senderType,
      cell: (row) => <span>{row.senderType}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  const PreservationOfSeedCocoonGardenDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => acceptConfirmForMarket(row.lotGroupageId, 1)}
          >
            {t("Accept")}
          </Button>
         
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirmForMarket(row.lotGroupageId, 2)}
            className="ms-2"
          >
            {t("Reject")}
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2,
    },

    {
      name: t("Lot Number"),
      selector: (row) => row.lotParentLevel,
      cell: (row) => <span>{row.lotParentLevel}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Buyer Type"),
      selector: (row) => row.buyerType,
      cell: (row) => <span>{row.buyerType}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: t("Buyer"),
      selector: (row) => row.buyerName,
      cell: (row) => <span>{row.buyerName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Quantity Of Cocoons in Kgs"),
      selector: (row) => row.lotWeight,
      cell: (row) => <span>{row.lotWeight}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Price"),
      selector: (row) => row.amount,
      cell: (row) => <span>{row.amount}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Sold Out Amount"),
      selector: (row) => row.soldAmount,
      cell: (row) => <span>{row.soldAmount}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Invoice No"),
      selector: (row) => row.invoiceNumber,
      cell: (row) => <span>{row.invoiceNumber}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("Accepted or not"),
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

  const PreservationOfRejectedSeedCocoonGardenDataColumns = [
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     //   Button style
    //     <div className="text-start w-100">
    //       <Button
    //         variant="primary"
    //         size="sm"
    //         onClick={() => acceptConfirmForMarket(row.lotGroupageId, 1)}
    //       >
    //         Accept
    //       </Button>
         
    //       <Button
    //         variant="danger"
    //         size="sm"
    //         onClick={() => deleteConfirmForMarket(row.lotGroupageId, 2)}
    //         className="ms-2"
    //       >
    //         Reject
    //       </Button>
    //     </div>
    //   ),
    //   sortable: false,
    //   hide: "md",
    //   grow: 2,
    // },
    {
      name: t("Lot Number"),
      selector: (row) => row.lotParentLevel,
      cell: (row) => <span>{row.lotParentLevel}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Buyer Type"),
      selector: (row) => row.buyerType,
      cell: (row) => <span>{row.buyerType}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: t("Buyer"),
      selector: (row) => row.buyerName,
      cell: (row) => <span>{row.buyerName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Quantity Of Cocoons in Kgs"),
      selector: (row) => row.lotWeight,
      cell: (row) => <span>{row.lotWeight}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Price"),
      selector: (row) => row.amount,
      cell: (row) => <span>{row.amount}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Sold Out Amount"),
      selector: (row) => row.soldAmount,
      cell: (row) => <span>{row.soldAmount}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Invoice No"),
      selector: (row) => row.invoiceNumber,
      cell: (row) => <span>{row.invoiceNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Status"),
      selector: (row) => row.isAccepted,
      cell: (row) => (
        <span style={{ color: row.isAccepted === 2 ? 'red' : 'inherit', fontWeight: row.isAccepted === 2 ? 'bold' : 'normal' }}>
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
    }
    
    
   
  ];


  const PreservationOfSeedCocoonForProcessingDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.id)}
          >
            {t("View")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.id)}
          >
            {t("Edit")}
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
      name: t("Lot Number"),
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Parent Lot Number",
    //   selector: (row) => row.parentLotNumber,
    //   cell: (row) => <span>{row.parentLotNumber}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: t("Race"),
      selector: (row) => row.raceName,
      cell: (row) => <span>{row.raceName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Market"),
      selector: (row) => row.marketMasterName,
      cell: (row) => <span>{row.marketMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Farm"),
      selector: (row) => row.farmName,
      cell: (row) => <span>{row.farmName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Name of the Farmer"),
      selector: (row) => row.nameOfTheGovernmentSeedFarmOrFarmer,
      cell: (row) => <span>{row.nameOfTheGovernmentSeedFarmOrFarmer}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Date Of Seed Cocoon Supply"),
      selector: (row) => row.dateOfSeedCocoonSupply,
      cell: (row) => <span>{row.dateOfSeedCocoonSupply}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: t("Spun On Date"),
      selector: (row) => row.spunOnDate,
      cell: (row) => <span>{formatDate(row.spunOnDate)}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Crop Number"),
      selector: (row) => row.cropNumber,
      cell: (row) => <span>{row.cropNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Line Name"),
      selector: (row) => row.lineName,
      cell: (row) => <span>{row.lineName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Cocoon supplied in Kg"),
      selector: (row) => row.bedNumberOrKgsOfCocoonsSupplied,
      cell: (row) => <span>{row.bedNumberOrKgsOfCocoonsSupplied}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Cocoon supplied in Nos"),
      selector: (row) => row.cacoonSuppliedNumbers,
      cell: (row) => <span>{row.cacoonSuppliedNumbers}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Number of pupa examined"),
      selector: (row) => row.numberOfPupaExamined,
      cell: (row) => <span>{row.numberOfPupaExamined}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Cocoon rejection details/ numbers"),
      selector: (row) => row.cocoonRejectionDetails,
      cell: (row) => <span>{row.cocoonRejectionDetails}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: t("Invoice Date"),
      selector: (row) => row.invoiceDate,
      cell: (row) => <span>{formatDate(row.invoiceDate)}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Rate Per Kg"),
      selector: (row) => row.ratePerKg,
      cell: (row) => <span>{row.ratePerKg}</span>,
      sortable: true,
      hide: "md",
    },
  
  ];

  return (
    <Layout title={t("Preservation of seed cocoon for processing List")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("Preservation of seed cocoon for processing List")}
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
                  <span>{t("Create")}</span>
                </Link>
              </li>
              <li>
              <Button
                variant="danger"
                size="sm"
                onClick={() => getRejectedList()}
                className="ms-2"
              >
                {t("Rejected List For Market")}
              </Button>
            </li>
              <li>
                <Link
                  to="/seriui/Preservation-of-seed-cocoon-for-processing"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>{t("Create")}</span>
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

      {showModal && (
        <Modal show={showModal} onHide={handleCloseModal} size="xl" className="modal-item">
          <Modal.Header closeButton>
            <Modal.Title>{t("Alerts Window")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Block className="mt-2">
              <Card>
                <DataTable
                  tableClassName="data-table-head-light table-responsive"
                  columns={ReceiptofDFLsfromtheP4grainageGardenDataColumns}
                  data={listLogsData}
                  highlightOnHover
                  pagination
                  paginationServer
                  paginationTotalRows={totalRows}
                  paginationPerPage={countPerPage}
                  paginationComponentOptions={{ noRowsPerPage: true }}
                  onChangePage={(page) => setPage(page - 1)}
                  progressPending={loading}
                  theme="solarized"
                  customStyles={customStyles}
                />
              </Card>
            </Block>
          </Modal.Body>
        </Modal>
      )}

      {/* Second Modal */}
      {showModal1 && (
        <Modal show={showModal1} onHide={handleCloseModal1} size="xl" className="modal-item">
          <Modal.Header closeButton>
            <Modal.Title>{t("Alerts Window For Market")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Block className="mt-2">
              <Card>
                <DataTable
                  tableClassName="data-table-head-light table-responsive"
                  columns={PreservationOfSeedCocoonGardenDataColumns}
                  data={listLogsForMarketData}
                  highlightOnHover
                  pagination
                  paginationServer
                  paginationTotalRows={totalRows}
                  paginationPerPage={countPerPage}
                  paginationComponentOptions={{ noRowsPerPage: true }}
                  onChangePage={(page) => setPage(page - 1)}
                  progressPending={loading}
                  theme="solarized"
                  customStyles={customStyles}
                />
              </Card>
            </Block>
          </Modal.Body>
        </Modal>
      )}

      <Modal show={showModal4} onHide={handleCloseModal4} size="xl">
  <Modal.Header closeButton>
    <Modal.Title>{t("Rejected List For Market")}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Block className="mt-3">
      <Card>
        <DataTable
          tableClassName="data-table-head-light table-responsive"
          columns={PreservationOfRejectedSeedCocoonGardenDataColumns}
          data={listMoultData}
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
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal4}>
      {t("Close")}
    </Button>
  </Modal.Footer>
</Modal>
    </Layout>
  );
}

export default PreservationofseedcocoonforprocessingList;
