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
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function ReceiptofDFLsfromtheP4grainageList() {
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [listLogsData, setListLogsData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const getList = () => {
    setLoading(true);

    const response = api
      .get(baseURL2 + `Mulberry-garden/get-info`)
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

  const getLogsList = (_id, plot) => {
    setLoading(true);
    setShowModal(true);

    api
      .get(baseURL2 + `Mulberry-garden/get-logs/${_id}/${plot}`)
      .then((response) => {
        // console.log(response.data)
        setListLogsData(response.data);
        // setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        // setListData({});
        setLoading(false);
      });
  };

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/maintenance-of-mulberry-garden-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/maintenance-of-mulberry-garden-edit/${_id}`);
    // navigate("/seriui/training Schedule");
  };

  const handleUpdate = (_id) => {
    navigate(`/seriui/maintenance-of-mulberry-garden-update/${_id}`);
  };

  const handleAlert = (_id) => {
    navigate(`/seriui/maintenance-of-mulberry-garden-alert/${_id}`);
  };

 

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const deleteConfirm = (_id, plot) => {
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
          .delete(baseURL2 + `Mulberry-garden/delete-info/${_id}/${plot}`)
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

  const MaintenanceofmulberryGardenDataColumns = [
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
            className="d-inline-flex align-items-center gap-1 shadow-sm"
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
            className="d-inline-flex align-items-center gap-1 shadow-sm"
            style={{ borderRadius: "6px", fontWeight: 500, fontSize: "12.5px", paddingInline: "10px" }}
            title={t("Edit")}
          >
            <Icon name="edit" />
            <span>{t("Edit")}</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleUpdate(row.id)}
            className="d-inline-flex align-items-center gap-1 shadow-sm"
            style={{ borderRadius: "6px", fontWeight: 500, fontSize: "12.5px", paddingInline: "10px" }}
            title={t("Update")}
          >
            <Icon name="calendar-check" />
            <span>{t("Update")}</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleAlert(row.id)}
            className="d-inline-flex align-items-center gap-1 shadow-sm"
            style={{ borderRadius: "6px", fontWeight: 500, fontSize: "12.5px", paddingInline: "10px" }}
            title={t("Alert")}
          >
            <Icon name="bell" />
            <span>{t("Alert")}</span>
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
      grow: 4,
      minWidth: "560px",
    },

    {
      name: t("Plot Number"),
      selector: (row) => row.plotNumber,
      cell: (row) => <span>{row.plotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Variety"),
      selector: (row) => row.variety,
      cell: (row) => <span>{row.variety}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t(" Area(In Hectares)"),
      selector: (row) => row.areaUnderEachVariety,
      cell: (row) => <span>{row.areaUnderEachVariety}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Pruning Date"),
      selector: (row) => row.pruningDate,
      cell: (row) => <span>{row.pruningDate}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Fertilizer Application Date",
    //   selector: (row) => row.fertilizerApplicationDate,
    //   cell: (row) => <span>{row.fymApplicationDate}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Activity Logs",
    //   cell: (row) => (
    //     <div className="text-end">
    //       <Button
    //         variant="primary"
    //         size="sm"
    //         onClick={() => handleLogs(row.id)}
    //       >
    //         Activity Logs
    //       </Button>
    //     </div>
    //   ),
    //   sortable: false,
    //   hide: "md",
    // },
    {
      name: t("Activity Logs"),
      cell: (row) => (
        <div className="text-end">
          <AiOutlineInfoCircle // Use the information icon instead of Button
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => getLogsList(row.id, row.plotNumber)}
          />
        </div>
      ),
      sortable: false,
      hide: "md",
    },
  ];

  const MaintenanceofmulberryGardenLogsDataColumns = [
    {
      name: t("Plot Number"),
      selector: (row) => row.plotNumber,
      cell: (row) => <span>{row.plotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Variety"),
      selector: (row) => row.variety,
      cell: (row) => <span>{row.variety}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Area Under Each Variety"),
      selector: (row) => row.areaUnderEachVariety,
      cell: (row) => <span>{row.areaUnderEachVariety}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Pruning Date"),
      selector: (row) => row.pruningDate,
      cell: (row) => <span>{row.pruningDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Fertilizer Application Date"),
      selector: (row) => row.fertilizerApplicationDate,
      cell: (row) => <span>{row.fertilizerApplicationDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("FYM Date"),
      selector: (row) => row.fymApplicationDate,
      cell: (row) => <span>{row.fymApplicationDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Irrigation Date"),
      selector: (row) => row.irrigationDate,
      cell: (row) => <span>{row.irrigationDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Brushing Date"),
      selector: (row) => row.brushingDate,
      cell: (row) => <span>{row.brushingDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Fertilizer Application Status"),
      selector: (row) => row.fertilizerApplicationStatus,
      cell: (row) => (
        <span>
          {row.fertilizerApplicationStatus === 0
            ? "Pending"
            : row.fertilizerApplicationStatus === 1
            ? "Completed"
            : "Other"}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
    {
      name: t("FYM Application Status"),
      selector: (row) => row.fymApplicationStatus,
      cell: (row) => (
        <span>
          {row.fymApplicationStatus === 0
            ? "Pending"
            : row.fymApplicationStatus === 1
            ? "Completed"
            : "Other"}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
    {
      name: t("Irrigation Status"),
      selector: (row) => row.irrigationStatus,
      cell: (row) => (
        <span>
          {row.irrigationStatus === 0
            ? "Pending"
            : row.irrigationStatus === 1
            ? "Completed"
            : "Other"}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
    {
      name: t("Brushing Status"),
      selector: (row) => row.brushingStatus,
      cell: (row) => (
        <span>
          {row.brushingStatus === 0
            ? "Pending"
            : row.brushingStatus === 1
            ? "Completed"
            : "Other"}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title={t("Receipt of DFLs from the P4 grainage List")}>
      <style>{receiptDflsListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Receipt of DFLs from the P4 grainage List")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/Receipt-of-DFLs-from-the-P4-grainage"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("Create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/Receipt-of-DFLs-from-the-P4-grainage"
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
            <DataTable
              // title="New Trader License List"
              tableClassName="data-table-head-light table-responsive"
              columns={MaintenanceofmulberryGardenDataColumns}
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

      <Modal show={showModal} onHide={handleCloseModal} size="xl" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="list" className="me-1" />
            {t("Activity Logs")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-2">
            <Card>
              <DataTable
                // title="New Trader License List"
                tableClassName="data-table-head-light table-responsive"
                columns={MaintenanceofmulberryGardenLogsDataColumns}
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

const receiptDflsListStyles = `
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
  .modal-backdrop.show {
    background-color: #0c2844;
    opacity: 0.75;
  }
  .sh-modal-content {
    border-radius: 12px !important;
    border: 1px solid #e3ebf6 !important;
    overflow: hidden;
  }
  .sh-modal-content .modal-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-bottom: none;
    padding: 16px 22px;
  }
  .sh-modal-content .modal-header .btn-close {
    filter: brightness(0) invert(1);
    opacity: 0.85;
  }
  .sh-modal-content .modal-header .btn-close:hover {
    opacity: 1;
  }
  .sh-modal-content .modal-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: 0.3px;
    color: #ffffff;
  }
  .sh-modal-content .modal-header svg,
  .sh-modal-content .modal-header .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 15px;
  }
  .sh-modal-content .modal-body {
    padding: 22px 24px;
  }
  .sh-modal-content table thead th {
    background-color: #eef4fc !important;
    color: #2b3a55 !important;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.2px;
    border-bottom: 2px solid #d6e3f3 !important;
  }
`;

export default ReceiptofDFLsfromtheP4grainageList;
