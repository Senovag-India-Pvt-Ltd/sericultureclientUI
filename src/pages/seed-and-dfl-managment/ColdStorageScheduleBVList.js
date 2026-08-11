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

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function ColdStorageScheduleBVList() {
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [listLogsData, setListLogsData] = useState({});
  const [listCalendarData, setCalendarData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [data, setData] = useState({
   laidOnDate: "",
   lotNumber: "",
  });


  const getList = () => {
    setLoading(true);

    const response = api
      .get(baseURLSeedDfl + `Cold-Storage/get-info`)
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

  const [showModal, setShowModal] = useState(true);
  
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [showModal1, setShowModal1] = useState(false);
  
  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const getAlertList = () => {
    setLoading(true);
    api.get(baseURLSeedDfl + `Cold-Storage/get-alert-data`)
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


  const getCalendarList = (lotNumber,laidOnDate) => {
    setLoading(false);
    
    api.post(baseURLSeedDfl + `Cold-Storage/get-calendar-table-data`,{ lotNumber, laidOnDate })
      .then((response) => {
        setCalendarData(response.data);
        setLoading(false);
        setShowModal1(true);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  // useEffect(() => {
  //   getCalendarList();
  // }, []);

  
  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/Cold-Storage-Schedule-BV-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/Cold-Storage-Schedule-BV-edit/${_id}`);
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
          .delete(baseURLSeedDfl + `Cold-Storage/delete-info/${_id}`)
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

  const acceptError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: message,
    });
  };

  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: message,
      text: message,
    });
  };

  const acceptConfirm = (_cssId) => {
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
          .delete(baseURLSeedDfl + `Cold-Storage/change-alert-status/${_cssId}`)
          .then((response) => {
            if (response.data.error) {
              acceptError(response.data.message);
            } else {
              saveSuccess(response.data.message);
              // clear();
            }
            // getList();
            // Swal.fire(
            //   "Accepted",
            //   "You successfully Accepted this record",
            //   "success"
            // );
            Swal.fire({
              icon: "success",
              title: response.data.message,
              text: response.data.message,
            });
            getAlertList();
              getList();
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

  const ColdStorageAlertDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="d-flex flex-nowrap align-items-center text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => acceptConfirm(row.cssId)}
            className="text-nowrap"
          >
            Accept
          </Button>

          {/* <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.id)}
            className="ms-2"
          >
            Reject
          </Button> */}
        </div>
      ),
      sortable: false,
      hide: "md",
      width: "140px",
      minWidth: "140px",
      grow: 0,
      // grow: 3,
    },

    {
      name: t("Grainage Details"),
      selector: (row) => row.grainageDetails,
      cell: (row) => <span>{row.grainageDetails}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Lot Number"),
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Laid On Date"),
      selector: (row) => row.laidOnDate,
      cell: (row) => <span>{row.laidOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Date of Deposit"),
      selector: (row) => row.dateOfDeposit,
      cell: (row) => <span>{row.dateOfDeposit}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Remaining Duration"),
      selector: (row) => row.remainingDuration,
      cell: (row) => <span>{row.remainingDuration}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: t("Is Changed"),
      selector: (row) => row.isChanged,
      cell: (row) => (
        <span>
          {row.isChanged === 0
            ? "Pending"
            : row.isChanged === 1
            ? "Accepted"
            : "Unknown"}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
  ];

  const ColdStorageScheduleBVDataColumns = [
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
            onClick={() => deleteConfirm(row.id)}
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
      name: t("Grainage Details"),
      selector: (row) => row.grainageDetails,
      cell: (row) => <span>{row.grainageDetails}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Lot Number"),
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Laid On Date"),
      selector: (row) => row.laidOnDate,
      cell: (row) => <span>{row.laidOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Date Of Deposit"),
      selector: (row) => row.dateOfDeposit,
      cell: (row) => <span>{row.dateOfDeposit}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Schedule Type"),
      selector: (row) => row.scheduleType,
      cell: (row) => <span>{row.scheduleType}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Date Of Release"),
      selector: (row) => row.dateOfRelease,
      cell: (row) => <span>{row.dateOfRelease}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Storage Temperature",
    //   selector: (row) => row.storageTemperature,
    //   cell: (row) => <span>{row.storageTemperature}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Storage Duration",
    //   selector: (row) => row.storageDuration,
    //   cell: (row) => <span>{row.storageDuration}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Remaining Duration",
    //   selector: (row) => row.remainingDuration,
    //   cell: (row) => <span>{row.remainingDuration}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="d-flex flex-nowrap align-items-center text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => getCalendarList(row.lotNumber,row.laidOnDate)}
            className="text-nowrap"
          >
           Schedule Table
          </Button>
          </div>
          ),
          sortable: false,
          hide: "md",
          width: "140px",
          minWidth: "140px",
          grow: 0,
          },
      ]

    const ColdStorageCalendarBVDataColumns = [
     
      // {
      //   name: "Lot Number",
      //   selector: (row) => row.lotNumber,
      //   cell: (row) => <span>{row.lotNumber}</span>,
      //   sortable: true,
      //   hide: "md",
      // },
      // {
      //   name: "Lot Number",
      //   selector: (row) => row.lotNumber,
      //   cell: (row) => <span>{row.lotNumber}</span>,
      //   sortable: true,
      //   hide: "md",
      // },
      // {
      //   name: "Laid On Date",
      //   selector: (row) => row.laidOnDate,
      //   cell: (row) => <span>{row.laidOnDate}</span>,
      //   sortable: true,
      //   hide: "md",
      // },
      {
        name: t("Storage Temp"),
        selector: (row) => row.storageTemp,
        cell: (row) => <span>{row.storageTemp}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("From Date"),
        selector: (row) => row.fromDate,
        cell: (row) => <span>{row.fromDate}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("To Date"),
        selector: (row) => row.toDate,
        cell: (row) => <span>{row.toDate}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Storage Duration"),
        selector: (row) => row.storageDuration,
        cell: (row) => <span>{row.storageDuration}</span>,
        sortable: true,
        hide: "md",
      },  
   
  ];

  return (
    <Layout title={t("Cold Storage Schedule BV List")}>
      <style>{coldStorageScheduleBVListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Cold Storage Schedule BV List")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/Cold-Storage-Schedule-BV"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("Create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/Cold-Storage-Schedule-BV"
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
                columns={ColdStorageScheduleBVDataColumns}
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

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("Alerts Window")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-2">
            <Card>
              <div style={{ overflowX: "auto" }}>
                <DataTable
                  // title="New Trader License List"
                  tableClassName="data-table-head-light table-responsive"
                  columns={ColdStorageAlertDataColumns}
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
              </div>
            </Card>
          </Block>
        </Modal.Body>
      </Modal>

      <Modal show={showModal1} onHide={handleCloseModal1} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("Schedule Table")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-2">
            <Card>
              <DataTable
                // title="New Trader License List"
                tableClassName="data-table-head-light table-responsive"
                columns={ColdStorageCalendarBVDataColumns}
                data={listCalendarData}
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

const coldStorageScheduleBVListStyles = `
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

export default ColdStorageScheduleBVList;
