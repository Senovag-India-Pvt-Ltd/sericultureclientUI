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

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function ReceiptofDFLsfromtheP4grainageList() {
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

  const handleLogs = (_id) => {
    navigate(`/seriui/maintenance-of-mulberry-garden-logs/${_id}`);
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

  const MaintenanceofmulberryGardenDataColumns = [
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
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleUpdate(row.id)}
          >
            Update
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleAlert(row.id)}
          >
            Alert
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
      name: "Plot Number",
      selector: (row) => row.plotNumber,
      cell: (row) => <span>{row.plotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Variety",
      selector: (row) => row.variety,
      cell: (row) => <span>{row.variety}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: " Area(In Hectares)",
      selector: (row) => row.areaUnderEachVariety,
      cell: (row) => <span>{row.areaUnderEachVariety}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Pruning Date",
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
      name: "Activity Logs",
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
      name: "Plot Number",
      selector: (row) => row.plotNumber,
      cell: (row) => <span>{row.plotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Variety",
      selector: (row) => row.variety,
      cell: (row) => <span>{row.variety}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Area Under Each Variety",
      selector: (row) => row.areaUnderEachVariety,
      cell: (row) => <span>{row.areaUnderEachVariety}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Pruning Date",
      selector: (row) => row.pruningDate,
      cell: (row) => <span>{row.pruningDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Fertilizer Application Date",
      selector: (row) => row.fertilizerApplicationDate,
      cell: (row) => <span>{row.fertilizerApplicationDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "FYM Date",
      selector: (row) => row.fymApplicationDate,
      cell: (row) => <span>{row.fymApplicationDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Irrigation Date",
      selector: (row) => row.irrigationDate,
      cell: (row) => <span>{row.irrigationDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Brushing Date",
      selector: (row) => row.brushingDate,
      cell: (row) => <span>{row.brushingDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Fertilizer Application Status",
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
      name: "FYM Application Status",
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
      name: "Irrigation Status",
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
      name: "Brushing Status",
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
    <Layout title="Receipt of DFLs from the P4 grainage List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Receipt of DFLs from the P4 grainage List
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Receipt-of-DFLs-from-the-P4-grainage"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Receipt-of-DFLs-from-the-P4-grainage"
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
            columns={MaintenanceofmulberryGardenDataColumns}
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
          <Modal.Title>Activity Logs</Modal.Title>
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

export default ReceiptofDFLsfromtheP4grainageList;
