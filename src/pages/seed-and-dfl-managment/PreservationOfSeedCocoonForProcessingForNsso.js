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

function PreservationofseedcocoonforprocessingListForNsso() {
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

//   const getAlertList = () => {
//     setLoading(true);
//     api.get(baseURLSeedDfl + `PreservationOfSeed/get-alert-data`)
//       .then((response) => {
//         setListLogsData(response.data);
//         setLoading(false);
//         if (response.data.length > 0) {
//           setSenderType(response.data[0].senderType);
//           setShowModal(true);
//         } else {
//           setShowModal(false);
//         }
//       })
//       .catch((err) => {
//         setLoading(false);
//       });
//   };
  

//   useEffect(() => {
//     getAlertList();
//   }, []);

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



//   const acceptConfirm = (_id, status, senderType) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "It will Accept!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, Accept it!",
//     }).then((result) => {
//       if (result.value) {
//         console.log("hello");
//         api
//           .get(baseURLSeedDfl + `PreservationOfSeed/accept-reject-dfls/${_id}/${status}/${senderType}`)
//           .then((response) => {
//             if (response.data.error === 1) {
//               acceptError(response.data.message || "An error occurred while accepting the record.");
//             } else {
//               // getList();
//               Swal.fire("Accepted", "You successfully Accepted this record", "success");
//               getAlertList();
//               getList();
//             }
//           })
//           .catch((err) => {
//             acceptError("An error occurred while accepting the record.");
//           });
//       } else {
//         console.log(result.value);
//         Swal.fire("Cancelled", "Your record is not accepted", "info");
//       }
//     });
//   };
  
//   const deleteConfirm = (_id, status, senderType) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "It will Reject permanently!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, Reject it!",
//     }).then((result) => {
//       if (result.value) {
//         console.log("hello");
//         api
//           .get(baseURLSeedDfl + `PreservationOfSeed/accept-reject-dfls/${_id}/${status}/${senderType}`)
//           .then((response) => {
//             if (response.data.error === 1) {
//               deleteError(response.data.message || "An error occurred while rejecting the record.");
//             } else {
//               // getList();
//               Swal.fire("Rejected", "You successfully rejected this record", "success");
//               getAlertList();
//               getList();
//             }
//           })
//           .catch((err) => {
//             deleteError("An error occurred while rejecting the record.");
//           });
//       } else {
//         console.log(result.value);
//         Swal.fire("Cancelled", "Your record is not deleted", "info");
//       }
//     });
//   };

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
    table: {
      style: {
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(30, 103, 168, 0.06)",
      },
    },
    rows: {
      style: {
        minHeight: "52px",
        fontSize: "13.5px",
        color: "#2b2d42",
        borderBottom: "1px solid #eef1f6 !important",
        transition: "background-color 0.15s ease",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f4f8fd",
        cursor: "pointer",
        outline: "none",
      },
      stripedStyle: {
        backgroundColor: "#fbfcfe",
      },
    },
    headRow: {
      style: {
        minHeight: "50px",
        background:
          "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
      },
    },
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
    pagination: {
      style: {
        borderTop: "1px solid #eef1f6",
        fontSize: "13px",
        color: "#5a6577",
      },
    },
  };

//   const ReceiptofDFLsfromtheP4grainageGardenDataColumns = [
//     {
//       name: "Action",
//       cell: (row) => (
//         //   Button style
//         <div className="text-start w-100">
//           {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
//           <Button
//             variant="primary"
//             size="sm"
//             onClick={() => acceptConfirm(row.id, 1,row.senderType)}
//           >
//             Accept
//           </Button>
         
//           <Button
//             variant="danger"
//             size="sm"
//             onClick={() => deleteConfirm(row.id, 2,row.senderType)}
//             className="ms-2"
//           >
//             Reject
//           </Button>
//         </div>
//       ),
//       sortable: false,
//       hide: "md",
//       grow: 2,
//     },

//     {
//       name: "Lot Number",
//       selector: (row) => row.lotNumber,
//       cell: (row) => <span>{row.lotNumber}</span>,
//       sortable: true,
//       hide: "md",
//     },
    
//     {
//       name: "Name Of Supplier",
//       selector: (row) => row.nameOfSupplier,
//       cell: (row) => <span>{row.nameOfSupplier}</span>,
//       sortable: true,
//       hide: "md",
//     },
//     {
//       name: "Spun on date(From)",
//       selector: (row) => row.spunOnDate,
//       cell: (row) => <span>{row.spunOnDate}</span>,
//       sortable: true,
//       hide: "md",
//     },
//     {
//       name: "Date of supply",
//       selector: (row) => row.dateOfSupply,
//       cell: (row) => <span>{row.dateOfSupply}</span>,
//       sortable: true,
//       hide: "md",
//     },
//     {
//       name: "No Of Cocoons Dispatched",
//       selector: (row) => row.numberOfCocoonsDispatched,
//       cell: (row) => <span>{row.numberOfCocoonsDispatched}</span>,
//       sortable: true,
//       hide: "md",
//     },
//     {
//       name: "Invoice No",
//       selector: (row) => row.invoiceNo,
//       cell: (row) => <span>{row.invoiceNo}</span>,
//       sortable: true,
//       hide: "md",
//     },


   
//     // {
//     //   name: "Accepted or not",
//     //   selector: (row) => row.isAccepted,
//     //   cell: (row) => <span>{row.isAccepted}</span>,
//     //   sortable: true,
//     //   hide: "md",
//     // },
//     {
//       name: "Accepted or not",
//       selector: (row) => row.isAccepted,
//       cell: (row) => (
//         <span>
//           {row.isAccepted === 0
//             ? "Pending"
//             : row.isAccepted === 1
//             ? "Accepted"
//             : row.isAccepted === 2
//             ? "Rejected"
//             : "Unknown"}
//         </span>
//       ),
//       sortable: true,
//       hide: "md",
//     },
//     {
//       name: "Sender Type",
//       selector: (row) => row.senderType,
//       cell: (row) => <span>{row.senderType}</span>,
//       sortable: true,
//       hide: "md",
//     },
//   ];

  const PreservationOfSeedCocoonGardenDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="d-flex align-items-center flex-nowrap gap-2" style={{ whiteSpace: "nowrap" }}>
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => acceptConfirmForMarket(row.lotGroupageId, 1)}
            className="d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            style={{ borderRadius: "6px", fontWeight: 500, fontSize: "12.5px", paddingInline: "10px" }}
          >
            <Icon name="check" />
            <span>{t("Accept")}</span>
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirmForMarket(row.lotGroupageId, 2)}
            className="d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            style={{ borderRadius: "6px", fontWeight: 500, fontSize: "12.5px", paddingInline: "10px" }}
          >
            <Icon name="cross" />
            <span>{t("Reject")}</span>
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      width: "220px",
      minWidth: "220px",
      grow: 0,
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
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     //   Button style
    //     <div className="text-start w-100">
    //       {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
    //       <Button
    //         variant="primary"
    //         size="sm"
    //         onClick={() => handleView(row.id)}
    //       >
    //         View
    //       </Button>
    //       <Button
    //         variant="primary"
    //         size="sm"
    //         className="ms-2"
    //         onClick={() => handleEdit(row.id)}
    //       >
    //         Edit
    //       </Button>
    //       {/* <Button
    //         variant="danger"
    //         size="sm"
    //         onClick={() => deleteConfirm(row.id, row.plotNumber)}
    //         className="ms-2"
    //       >
    //         Delete
    //       </Button> */}
    //     </div>
    //   ),
    //   sortable: false,
    //   hide: "md",
    //   grow: 2,
    // },

    {
      name: t("Lot Number"),
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
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
      name: t("Cocoon supplied in Kg"),
      selector: (row) => row.bedNumberOrKgsOfCocoonsSupplied,
      cell: (row) => <span>{row.bedNumberOrKgsOfCocoonsSupplied}</span>,
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
    <Layout title={t("List Of Preservation of seed cocoon for processing")}>
      <style>{preservationSeedCocoonNssoListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("List Of Preservation of seed cocoon for processing")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                {/* <li>
                  <Link
                    to="/seriui/Preservation-of-seed-cocoon-for-processing"
                    className="btn btn-primary btn-md d-md-none"
                  >
                    <Icon name="plus" />
                    <span>Create</span>
                  </Link>
                </li> */}
                <li>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => getRejectedList()}
                  className="ms-2 d-inline-flex align-items-center gap-1 sh-cta-btn"
                >
                  <Icon name="alert-circle" />
                  <span>{t("Rejected List For Market")}</span>
                </Button>
              </li>
                {/* <li>
                  <Link
                    to="/seriui/Preservation-of-seed-cocoon-for-processing"
                    className="btn btn-primary d-none d-md-inline-flex"
                  >
                    <Icon name="plus" />
                    <span>Create</span>
                  </Link>
                </li> */}
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-list-wrap">
        <Card className="sh-list-card">
          <div className="sh-table-wrap">
            <DataTable
              // title="New Trader License List"
              tableClassName="data-table-head-light table-responsive"
              columns={PreservationOfSeedCocoonForProcessingDataColumns}
              data={listData}
              highlightOnHover
              striped
              pointerOnHover
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
              noDataComponent={
                <div className="sh-empty">
                  <Icon name="inbox" />
                  <p className="mt-2 mb-0">{t("No records found")}</p>
                </div>
              }
            />
          </div>
        </Card>
      </Block>
{/*
      {showModal && (
        <Modal show={showModal} onHide={handleCloseModal} size="xl" className="modal-item">
          <Modal.Header closeButton>
            <Modal.Title>Alerts Window</Modal.Title>
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
      )} */}

      {/* Second Modal */}
      {showModal1 && (
        <Modal show={showModal1} onHide={handleCloseModal1} size="xl" className="modal-item sh-modal">
          <Modal.Header closeButton className="sh-modal-header">
            <Modal.Title>
              <Icon name="bell" />
              <span>{t("Alerts Window For Market")}</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Block className="mt-2 sh-list-wrap">
              <Card className="sh-list-card">
                <div className="sh-table-wrap">
                  <div style={{ overflowX: "auto" }}>
                    <DataTable
                      tableClassName="data-table-head-light table-responsive"
                      columns={PreservationOfSeedCocoonGardenDataColumns}
                      data={listLogsForMarketData}
                      highlightOnHover
                      striped
                      pointerOnHover
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
                  </div>
                </div>
              </Card>
            </Block>
          </Modal.Body>
        </Modal>
      )}

      <Modal show={showModal4} onHide={handleCloseModal4} size="xl" className="sh-modal">
  <Modal.Header closeButton className="sh-modal-header">
    <Modal.Title>
      <Icon name="alert-circle" />
      <span>{t("Rejected List For Market")}</span>
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Block className="mt-3 sh-list-wrap">
      <Card className="sh-list-card">
        <div className="sh-table-wrap">
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={PreservationOfRejectedSeedCocoonGardenDataColumns}
            data={listMoultData}
            highlightOnHover
            striped
            pointerOnHover
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
        </div>
      </Card>
    </Block>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal4} className="sh-cancel-btn">
      <Icon name="cross" />
      <span>{t("Close")}</span>
    </Button>
  </Modal.Footer>
</Modal>
    </Layout>
  );
}

const preservationSeedCocoonNssoListStyles = `
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
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-list-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-list-card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
  .sh-table-wrap {
    padding: 0 4px 4px;
  }
  .sh-empty {
    padding: 36px 12px;
    text-align: center;
    color: #8a96a8;
    font-size: 14px;
  }
  .sh-empty svg {
    width: 40px;
    height: 40px;
    opacity: 0.5;
  }
  .sh-modal .modal-content {
    border: none;
    border-radius: 12px;
    overflow: hidden;
  }
  .sh-modal-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-bottom: none !important;
    padding: 14px 20px !important;
  }
  .sh-modal-header .modal-title {
    color: #ffffff;
    font-weight: 700;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sh-modal-header .btn-close {
    filter: brightness(0) invert(1);
    opacity: 0.85;
  }
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 22px;
    border-radius: 8px;
    font-weight: 600;
  }
`;

export default PreservationofseedcocoonforprocessingListForNsso;
