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
const [showViewModal, setShowViewModal] = useState(false);
const [selectedRow, setSelectedRow] = useState(null);

// const handleViewDetails = (row) => {
//   setSelectedRow(row);
//   setShowViewModal(true);
// };

const handleCloseViewModal = () => {
  setShowViewModal(false);
  setSelectedRow(null);
};

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

  const handleViewDetails = (row) => {
  api.get(baseURLSeedDfl + `PreservationOfSeed/lot-groupage/${row.lotGroupageId}`)
    .then(res => {
      setSelectedRow(res.data);
      setShowViewModal(true);
    })
    .catch(err => console.error(err));
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

  const ReceiptofDFLsfromtheP4grainageGardenDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="d-flex flex-nowrap align-items-center text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => acceptConfirm(row.id, 1,row.senderType)}
            className="text-nowrap"
          >
            {t("Accept")}
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.id, 2,row.senderType)}
            className="ms-2 text-nowrap"
          >
            {t("Reject")}
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
      name: t("Spun on date(From)"),
      selector: (row) => row.spunOnDate,
      cell: (row) => <span>{row.spunOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t(" Spun On Date(To)"),
      selector: (row) => row.spunOnToDate,
      cell: (row) => <span>{row.spunOnToDate}</span>,
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
            ? t("Pending")
            : row.isAccepted === 1
            ? t("Accepted")
            : row.isAccepted === 2
            ? t("Rejected")
            : t("Unknown")}
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
      <div className="d-flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => acceptConfirmForMarket(row.lotGroupageId, 1)}
          className="text-nowrap"
        >
          {t("Accept")}
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={() => deleteConfirmForMarket(row.lotGroupageId, 2)}
          className="text-nowrap"
        >
          {t("Reject")}
        </Button>

        <Button
          variant="primary" // Blue color
          size="sm"
          onClick={() => handleViewDetails(row)}
          className="text-nowrap"
        >
          {t("View")}
        </Button>
      </div>
    ),
    sortable: false,
    hide: "md",
    width: "300px",
    minWidth: "300px",
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
            ? t("Pending")
            : row.isAccepted === 1
            ? t("Accepted")
            : row.isAccepted === 2
            ? t("Rejected")
            : t("Unknown")}
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
            ? t("Pending")
            : row.isAccepted === 1
            ? t("Accepted")
            : row.isAccepted === 2
            ? t("Rejected")
            : t("Unknown")}
        </span>
      ),
      sortable: true,
      hide: "md",
    }
    
    
   
  ];

  const deleteConfirmForList = (_id) => {
      Swal.fire({
        title: "Are you sure?",
        text: "It will delete permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
          // console.log("hello");
          api
            .delete(baseURLSeedDfl + `PreservationOfSeed/delete-info/${_id}`)
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


  const PreservationOfSeedCocoonForProcessingDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="d-flex align-items-center flex-nowrap gap-2" style={{ whiteSpace: "nowrap" }}>
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleView(row.id)}
            className="d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            style={{ borderRadius: "6px", fontWeight: 500, fontSize: "12.5px", paddingInline: "10px" }}
            title={t("View")}
          >
            <Icon name="eye" />
            <span>{t("View")}</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleEdit(row.id)}
            className="d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            style={{ borderRadius: "6px", fontWeight: 500, fontSize: "12.5px", paddingInline: "10px" }}
            title={t("Edit")}
          >
            <Icon name="edit" />
            <span>{t("Edit")}</span>
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirmForList(row.id)}
            className="d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            style={{ borderRadius: "6px", fontWeight: 500, fontSize: "12.5px", paddingInline: "10px" }}
            title={t("Delete")}
          >
            <Icon name="trash" />
            <span>{t("Delete")}</span>
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      width: "300px",
      minWidth: "300px",
      grow: 0,
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
      name: t("Spun on date(From)"),
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
      <style>{preservationSeedCocoonListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Preservation of seed cocoon for processing List")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex sh-header-actions">
                <li>
                  <Link
                    to="/seriui/Preservation-of-seed-cocoon-for-processing"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
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
                  className="sh-reject-list-btn"
                >
                  <Icon name="alert-circle" />
                  <span>{t("Rejected List For Market")}</span>
                </Button>
              </li>
                <li>
                  <Link
                    to="/seriui/Preservation-of-seed-cocoon-for-processing"
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

      <Block className="mt-n4 sh-list-wrap">
        <Card className="sh-list-card">
          <div className="sh-table-wrap">
            <div style={{ overflowX: "auto" }}>
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
          </div>
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
                <div style={{ overflowX: "auto" }}>
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
                </div>
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
                <div style={{ overflowX: "auto" }}>
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
                </div>
              </Card>
            </Block>
          </Modal.Body>
        </Modal>
      )}
      

{showViewModal && selectedRow && (
  <Modal
    show={showViewModal}
    onHide={handleCloseViewModal}
    size="xl" 
    className="modal-item" 
  >
    <Modal.Header closeButton>
      <Modal.Title>{t("Lot Groupage Details")}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Block className="mt-2">
        <Card>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <div className="table-responsive">
                  <table className="table table-bordered table-sm">
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Farmer Name")}</td>
                        <td>{selectedRow.firstName}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Market Name")}</td>
                        <td>{selectedRow.marketName}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Farmer Fruits Id")}</td>
                        <td>{selectedRow.fruitsId}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Farmer Mobile Number")}</td>
                        <td>{selectedRow.mobileNumber}</td>
                      </tr>

                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Bidding Slip Lot No")}</td>
                        <td>{selectedRow.bidSlipLotNo}</td>
                      </tr>
                      
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Buyer Type")}</td>
                        <td>{selectedRow.buyerType}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Buyer Name")}</td>
                        <td>{selectedRow.buyerName}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Lot Weight")}</td>
                        <td>{selectedRow.lotWeight} kg</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Amount")}</td>
                        <td>{selectedRow.amount}</td>
                      </tr>
                      
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Sold Amount")}</td>
                        <td>{selectedRow.soldAmount}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Invoice Number")}</td>
                        <td>{selectedRow.invoiceNumber}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Lot Parental Level")}</td>
                        <td>{selectedRow.lotParentalLevel}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Auction Date")}</td>
                        <td>{formatDate(selectedRow.auctionDate)}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Average Yield")}</td>
                        <td>{selectedRow.averageYield}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("No Of DFLs")}</td>
                        <td>{selectedRow.noOfDfls}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Remaining Cocoon")}</td>
                        <td>{selectedRow.remainingCocoon}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>{t("Accepted Status")}</td>
                        <td>
                          {selectedRow.isAccepted === 0
                            ? t("Pending")
                            : selectedRow.isAccepted === 1
                            ? t("Accepted")
                            : selectedRow.isAccepted === 2
                            ? t("Rejected")
                            : t("Unknown")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseViewModal}>
        {t("Close")}
      </Button>
    </Modal.Footer>
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

const preservationSeedCocoonListStyles = `
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
  .sh-header-actions {
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .sh-reject-list-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 8px;
    font-weight: 700;
    padding: 8px 16px;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.2);
    white-space: nowrap;
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
`;

export default PreservationofseedcocoonforprocessingList;
