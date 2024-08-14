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
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function MaintenanceofMulberryfarmList() {
  const [listData, setListData] = useState({});
  const [listLogsData, setListLogsData] = useState({});
  const [listAlertData, setListAlertData] = useState({});
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
      .get(baseURLSeedDfl + `MulberryFarm/get-info`)
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
      .get(baseURLSeedDfl + `MulberryFarm/get-logs/${_id}/${plot}`)
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

  const [pruningDate, setPruningDate] = useState({
    id: "",
    fertilizerApplicationStatus: "0",
    fymApplicationStatus: "0",
    irrigationStatus: "0",
    brushingStatus: "0",
  });

  const [validatedPruningDateEdit, setValidatedPruningDateEdit] = useState(false);

  const [showModal1, setShowModal1] = useState(false);

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const getAlertList = () => {
    setLoading(true);

    api
      .get(baseURLSeedDfl + `MulberryFarm/get-alerts-list`)
      .then((response) => {
        setListAlertData(response.data);
        setLoading(false);
        if (response.data.length > 0) {
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
    getAlertList();
  }, []);
//   const getAlertList = () => {
//     setLoading(true);

//     api.get(baseURLSeedDfl + `MulberryFarm/get-alerts-list`)
//         .then((response) => {
//             const today = new Date();
//             today.setHours(0, 0, 0, 0); // Ensure today's date is set to midnight

//             const alertsToShow = response.data.filter((alert) => {
//                 const pruningDate = new Date(alert.pruningDate);

//                 // Calculate the relevant dates based on pruning date
//                 const fertilizerApplicationDate = new Date(pruningDate);
//                 fertilizerApplicationDate.setDate(fertilizerApplicationDate.getDate() + 15);
//                 fertilizerApplicationDate.setHours(0, 0, 0, 0); // Set time to midnight
                
//                 const fymApplicationDate = new Date(pruningDate);
//                 fymApplicationDate.setDate(fymApplicationDate.getDate() + 5);
//                 fymApplicationDate.setHours(0, 0, 0, 0); // Set time to midnight

//                 const irrigationDate = new Date(pruningDate);
//                 irrigationDate.setDate(irrigationDate.getDate() + 12);
//                 irrigationDate.setHours(0, 0, 0, 0); // Set time to midnight

//                 const brushingDate = new Date(pruningDate);
//                 brushingDate.setDate(brushingDate.getDate() + 45);
//                 brushingDate.setHours(0, 0, 0, 0); // Set time to midnight

//                 // Check if any application date is today and status is pending
//                 return (
//                     (alert.fertilizerApplicationStatus === "0" && fertilizerApplicationDate.getTime() === today.getTime()) ||
//                     (alert.fymApplicationStatus === "0" && fymApplicationDate.getTime() === today.getTime()) ||
//                     (alert.irrigationStatus === "0" && irrigationDate.getTime() === today.getTime()) ||
//                     (alert.brushingStatus === "0" && brushingDate.getTime() === today.getTime())
//                 );
//             });

//             setListAlertData(alertsToShow);
//             setLoading(false);

//             // Show the alert modal if there are any relevant alerts
//             if (alertsToShow.length > 0) {
//                 setShowModal1(true);
//             } else {
//                 setShowModal1(false);
//             }
//         })
//         .catch((err) => {
//             setLoading(false);
//         });
// };

// useEffect(() => {
//     getAlertList();
// }, []);



  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedPruningDateEdit(true);
    } else {
      event.preventDefault();
      api
        .post(baseURLSeedDfl + `MulberryFarm/update-task-status`, pruningDate)
        .then((response) => {
          updateSuccess(response.data.message);
          getAlertList();
        })
        .catch((err) => {
          if (err.response.data.validationErrors) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidatedPruningDateEdit(true);
      handleCloseModal2();
    }
  };

  const handlePruningInputs = (e) => {
    const { name, value } = e.target;
    setPruningDate({ ...pruningDate, [name]: value });
  };

  const navigate = useNavigate();
  const updateSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: message,
    });
  };

  const updateError = (message) => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };

  const clear = () => {
    setPruningDate({
      fertilizerApplicationStatus: "",
      fymApplicationStatus: "",
      irrigationStatus: "",
      brushingStatus: "",
    });
  };

  // const handleStatusEdit = (row) => {
  //   setShowModal2(true);
  //   setPruningDate({
  //     id: row.id,
  //     fertilizerApplicationStatus: row.fertilizerApplicationStatus,
  //     fymApplicationStatus: row.fymApplicationStatus,
  //     irrigationStatus: row.irrigationStatus,
  //     brushingStatus: row.brushingStatus,
  //   });
  
    // Calculate enabled dates based on pruning date
    // const pruningDate = new Date(row.pruningDate);
    // const fertilizerApplicationDate = new Date(pruningDate);
    // fertilizerApplicationDate.setDate(fertilizerApplicationDate.getDate() + 15); // Assuming 15 days after pruning for fertilizer application
    // const fymApplicationDate = new Date(pruningDate);
    // fymApplicationDate.setDate(fymApplicationDate.getDate() + 5); // Assuming 5 days after pruning for fym application
    // const irrigationDate = new Date(pruningDate);
    // irrigationDate.setDate(irrigationDate.getDate() + 10); // Assuming 10 days after pruning for irrigation
    // const brushingDate = new Date(pruningDate);
    // brushingDate.setDate(brushingDate.getDate() + 45); // Assuming 45 days after pruning for brushing
  
    // setDates({
    //   fertilizerApplicationDate: fertilizerApplicationDate,
    //   fymApplicationDate: fymApplicationDate,
    //   irrigationDate: irrigationDate,
    //   brushingDate: brushingDate,
    // });
  // };

  // const isTodayOrFutureDate = (date) => {
  //   const today = new Date();
  //   return date >= today;
  // };
  // const isTodayOrFutureDate = (date) => {
  //   const today = new Date();
  //   const yesterday = new Date();
  //   yesterday.setDate(today.getDate() - 1);
  //   return date <= yesterday;
  // };
  const isTodayOrFutureDate = (date) => {
    if (!date) {
        return false; // Return false if date is null or undefined
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date <= today;
};


  const [dates, setDates] = useState({
    fertilizerApplicationDate: null,
    fymApplicationDate: null,
    irrigationDate: null,
    brushingDate: null,
  });

  const handleStatusEdit = (row) => {
    setShowModal2(true);
    setPruningDate({
      id: row.id,
      fertilizerApplicationStatus: row.fertilizerApplicationStatus,
      fymApplicationStatus: row.fymApplicationStatus,
      irrigationStatus: row.irrigationStatus,
      brushingStatus: row.brushingStatus,
    }); 

    const pruningDate = new Date(row.pruningDate);
    const fertilizerApplicationDate = new Date(pruningDate);
    fertilizerApplicationDate.setDate(fertilizerApplicationDate.getDate() + 15);
    const fymApplicationDate = new Date(pruningDate);
    fymApplicationDate.setDate(fymApplicationDate.getDate() + 5);
    const irrigationDate = new Date(pruningDate);
    irrigationDate.setDate(irrigationDate.getDate() + 12);
    const brushingDate = new Date(pruningDate);
    brushingDate.setDate(brushingDate.getDate() + 45);

    setDates({
      fertilizerApplicationDate: fertilizerApplicationDate,
      fymApplicationDate: fymApplicationDate,
      irrigationDate: irrigationDate,
      brushingDate: brushingDate,
    });
  };
//   const validDates = {
//     fertilizerApplicationDate: isTodayOrFutureDate(fertilizerApplicationDate) ? fertilizerApplicationDate : null,
//     fymApplicationDate: isTodayOrFutureDate(fymApplicationDate) ? fymApplicationDate : null,
//     irrigationDate: isTodayOrFutureDate(irrigationDate) ? irrigationDate : null,
//     brushingDate: isTodayOrFutureDate(brushingDate) ? brushingDate : null,
//   };

//   setDates(validDates);
// };


  const handleView = (_id) => {
    navigate(`/seriui/Maintenance-of-mulberry-Garden-in-the-Farms-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/Maintenance-of-mulberry-Garden-in-the-Farms-edit/${_id}`);
    // navigate("/seriui/training Schedule");
  };

  const handleUpdate = (_id) => {
    navigate(`/seriui/Maintenance-of-mulberry-Garden-in-the-Farms-update/${_id}`);
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
          .delete(baseURLSeedDfl + `MulberryFarm/delete-info/${_id}/${plot}`)
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
          {/* <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleAlert(row.id)}
          >
            Alert
          </Button> */}
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
      // grow: 2,
    },
    {
      name: "Soil Type",
      selector: (row) => row.soilTypeName,
      cell: (row) => <span>{row.soilTypeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Area(In Acres)",
      selector: (row) => row.areaUnderEachVariety,
      cell: (row) => <span>{row.areaUnderEachVariety}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Spacing",
      selector: (row) => row.mulberrySpacing,
      cell: (row) => <span>{row.mulberrySpacing}</span>,
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
      name: "Plantation Date",
      selector: (row) => row.plantationDate,
      cell: (row) => <span>{row.plantationDate}</span>,
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
      name: "FYM (Farm Yard Manure) application date",
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
      name: "Remarks",
      selector: (row) => row.remarks,
      cell: (row) => <span>{row.remarks}</span>,
      sortable: true,
      hide: "md",
    },

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

  const MulberryGardenDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="text-start w-100">
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleStatusEdit(row)}
          >
            Edit
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    },
    {
      name: "Plot Number",
      selector: (row) => row.plotNumber,
      cell: (row) => <span>{row.plotNumber}</span>,
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
            : row.fertilizerApplicationStatus === 2
            ? "Activity Not Required"
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
            : row.fymApplicationStatus === 2
            ? "Activity Not Required"
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
            : row.irrigationStatus === 2
            ? "Activity Not Required"
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
            : row.brushingStatus === 2
            ? "Activity Not Required"
            : "Other"}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title="Maintenance Of Mulberry Garden in Farms List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Maintenance Of Mulberry Garden in Farms List
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Maintenance-of-mulberry-Garden-in-the-Farms"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Maintenance-of-mulberry-Garden-in-the-Farms"
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

      <Modal show={showModal1} onHide={handleCloseModal1} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-2">
            <Card>
              <DataTable
                // title="New Trader License List"
                tableClassName="data-table-head-light table-responsive"
                columns={MulberryGardenDataColumns}
                data={listAlertData}
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

      <Modal show={showModal2} onHide={handleCloseModal2} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedPruningDateEdit}
            onSubmit={postData}
          >
            <Row className="g-5 px-5">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>Fertilizer Application Status</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="fertilizerApplicationStatus"
                      value={pruningDate.fertilizerApplicationStatus}
                      onChange={handlePruningInputs}
                      disabled={!isTodayOrFutureDate(dates.fertilizerApplicationDate)}
                    >
                      <option value="">
                        Select Fertilizer Application Status
                      </option>
                      <option value="0">Pending</option>
                      <option value="1">Completed</option>
                      <option value="2">Activity Not Required</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>Farm Yard Manure Application Status</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="fymApplicationStatus"
                      value={pruningDate.fymApplicationStatus}
                      onChange={handlePruningInputs}
                      disabled={!isTodayOrFutureDate(dates.fymApplicationDate)}
                    >
                      <option value="">Select FYM Status</option>
                      <option value="0">Pending</option>
                      <option value="1">Completed</option>
                      <option value="2">Activity Not Required</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>Irrigation Status</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="irrigationStatus"
                      value={pruningDate.irrigationStatus}
                      onChange={handlePruningInputs}
                      disabled={!isTodayOrFutureDate(dates.irrigationDate)}
                      
                    >
                      <option value="">Select Irrigation Status</option>
                      <option value="0">Pending</option>
                      <option value="1">Completed</option>
                      <option value="2">Activity Not Required</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>Brushing Status</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="brushingStatus"
                      value={pruningDate.brushingStatus}
                      onChange={handlePruningInputs}
                      disabled={!isTodayOrFutureDate(dates.brushingDate)}
                    >
                      <option value="">Select Brushing Status</option>
                      <option value="0">Pending</option>
                      <option value="1">Completed</option>
                      <option value="2">Activity Not Required</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAdd}> */}
                    <Button type="submit" variant="success">
                      Update
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button type="button" variant="secondary" onClick={clear}>
                      Cancel
                    </Button>
                  </div> */}
                  <li>
                  <Link
                    to="/seriui/Maintenance-of-mulberry-Garden-in-the-Farms-list"
                    className="btn btn-secondary border-0"
                  >
                   Cancel
                  </Link>
                </li>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default MaintenanceofMulberryfarmList;
