import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Icon, Select } from "../../components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next"; // Add this line

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function MaintenanceOfMulberryGardenList() {
  const { t } = useTranslation(); // Add this line
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

  const [pruningDate, setPruningDate] = useState({
    id: "",
    fertilizerApplicationStatus: "0",
    fymApplicationStatus: "0",
    irrigationStatus: "0",
    brushingStatus: "0",
    foliarSpray1Status: "0",
    foliarSpray2Status: "0"
  });

  const handleDateChange = (date, type) => {
    setUpdateAllDate({ ...updateAllDate, [type]: date });
  };

  const [updateAllDate, setUpdateAllDate] = useState({
    id: "",
    fertilizerApplicationDate: "",
    fymApplicationDate: "",
    irrigationDate: "",
    brushingDate: "",
    foliarSpray1: "",
    foliarSpray2: ""
  });

  const dateFormat = (newDate) => {
    // Convert to Date if it's not already a Date object
    const date = new Date(newDate);
    
    // Check if conversion was successful (valid Date object)
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", newDate);
      return ""; // Return an empty string or handle the error as needed
    }
  
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0")
    );
  };


  const [validatedPruningDateEdit, setValidatedPruningDateEdit] = useState(false);

  const [validatedAllDateEdit, setValidatedAllDateEdit] = useState(false);

  const [showModal1, setShowModal1] = useState(false);

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const [showModal3, setShowModal3] = useState(false);

  const handleShowModal3 = () => setShowModal3(true);
  const handleCloseModal3 = () => setShowModal3(false);

  const getAlertList = () => {
    setLoading(true);

    api
      .get(baseURL2 + `Mulberry-garden/get-alerts-list`)
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

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedPruningDateEdit(true);
    } else {
      event.preventDefault();
      api
        .post([baseURL2] + `Mulberry-garden/update-task-status`, pruningDate)
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

  const updateAllDates = (event) => {
    const form = event.currentTarget;
    
    // Generate the formatted date
    // const newDate = new Date();
    // const formattedDate =
    //   newDate.getFullYear() +
    //   "-" +
    //   (newDate.getMonth() + 1).toString().padStart(2, "0") +
    //   "-" +
    //   newDate.getDate().toString().padStart(2, "0");
  
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedAllDateEdit(true);
    } else {
      event.preventDefault();
      
      // Update the state with the formatted date for all date fields
      const updatedDatePayload = {
        ...updateAllDate,
        fertilizerApplicationDate: dateFormat(updateAllDate.fertilizerApplicationDate),
        fymApplicationDate: dateFormat(updateAllDate.fymApplicationDate),
        irrigationDate: dateFormat(updateAllDate.irrigationDate),
        brushingDate: dateFormat(updateAllDate.brushingDate),
        foliarSpray1: dateFormat(updateAllDate.foliarSpray1),
        foliarSpray2: dateFormat(updateAllDate.foliarSpray2),
      };
  
      api
        .post(baseURL2 + `Mulberry-garden/update-task-dates`, updatedDatePayload)
        .then((response) => {
          updateSuccess(response.data.message);
          // getAlertList();
        })
        .catch((err) => {
          if (err.response.data.validationErrors) {
            updateError(err.response.data.validationErrors);
          }
        });
  
      setValidatedAllDateEdit(true);
      handleCloseModal3();
    }
  };
  

  const handlePruningInputs = (e) => {
    const { name, value } = e.target;
    setPruningDate({ ...pruningDate, [name]: value });
  };

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
      foliarSpray1Status: row.foliarSpray1Status,
      foliarSpray2Status: row.foliarSpray2Status,
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

  // const navigate = useNavigate();
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


  const navigate = useNavigate();

  const [id, setId] = useState(null);

const handleUpdateAllDates = (row) => {
  setId(row.id); // Set the ID when the button is clicked
  setShowModal3(true); // Show the modal
};

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

  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURL2 + `Mulberry-garden/get-info-by-id/${id}`)
      .then((response) => {
        setUpdateAllDate(response.data); // Set the data in updateAllDate state
        setLoading(false);
      })
      .catch((err) => {
        setUpdateAllDate({});
        setLoading(false);
      });
  };
  
  // Fetch the data whenever the id changes
  useEffect(() => {
    if (id) {
      getIdList();
    }
  }, [id]);
  
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
        <div className="d-flex align-items-center flex-nowrap gap-2">
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
            variant="primary"
            size="sm"
            onClick={() => handleUpdate(row.id)}
            className="d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            style={{ borderRadius: "6px", fontWeight: 500, fontSize: "12.5px", paddingInline: "10px" }}
            title={t("Update Pruning Date")}
          >
            <Icon name="calendar" />
            <span>{t("Update Pruning Date")}</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleUpdateAllDates(row)}
            className="d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            style={{ borderRadius: "6px", fontWeight: 500, fontSize: "12.5px", paddingInline: "10px" }}
            title={t("Update Dates")}
          >
            <Icon name="calendar-alt" />
            <span>{t("Update Dates")}</span>
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
      width: "380px",
      minWidth: "380px",
      grow: 0,
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
      name: t("Soil Type"),
      selector: (row) => row.soilTypeName,
      cell: (row) => <span>{row.soilTypeName}</span>,
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
      name: t("Spacing"),
      selector: (row) => row.mulberrySpacing,
      cell: (row) => <span>{row.mulberrySpacing}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: t("Plantation Date"),
      selector: (row) => row.plantationDate,
      cell: (row) => <span>{row.plantationDate}</span>,
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
      name: t("FYM (Farm Yard Manure) application date"),
      selector: (row) => row.fymApplicationDate,
      cell: (row) => <span>{row.fymApplicationDate}</span>,
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
      name: t("Foliar Spray 1 Date"),
      selector: (row) => row.foliarSpray1,
      cell: (row) => <span>{row.foliarSpray1}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Foliar Spray 2 Date"),
      selector: (row) => row.foliarSpray2,
      cell: (row) => <span>{row.foliarSpray2}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Activity Logs"),
      cell: (row) => (
        <div className="text-end">
          <AiOutlineInfoCircle // Use the information icon instead of Button
            size={20}
            style={{ cursor: "pointer", color: "#1e67a8" }}
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
      name: t("Action"),
      cell: (row) => (
        <div className="d-flex flex-nowrap align-items-center text-start w-100">
          <Button
            variant="primary"
            size="sm"
            className="ms-2 text-nowrap"
            onClick={() => handleStatusEdit(row)}
          >
            {t("Edit")}
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
      name: t("Plot Number"),
      selector: (row) => row.plotNumber,
      cell: (row) => <span>{row.plotNumber}</span>,
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
      name: t("FYM Application Status"),
      selector: (row) => row.fymApplicationStatus,
      cell: (row) => (
        <span>
          {row.fymApplicationStatus === 0
            ? t("Pending")
            : row.fymApplicationStatus === 1
            ? t("Completed")
            : t("Other")}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
    {
      name: t("Fertilizer Application Status"),
      selector: (row) => row.fertilizerApplicationStatus,
      cell: (row) => (
        <span>
          {row.fertilizerApplicationStatus === 0
            ? t("Pending")
            : row.fertilizerApplicationStatus === 1
            ? t("Completed")
            : t("Other")}
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
            ? t("Pending")
            : row.irrigationStatus === 1
            ? t("Completed")
            : t("Other")}
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
            ? t("Pending")
            : row.brushingStatus === 1
            ? t("Completed")
            : t("Other")}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
    {
      name: t("Foliar Spray 1 Status"),
      selector: (row) => row.foliarSpray1Status,
      cell: (row) => (
        <span>
          {row.foliarSpray1Status === 0
            ? t("Pending")
            : row.foliarSpray1Status === 1
            ? t("Completed")
            : t("Other")}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
    {
      name: t("Foliar Spray 2 Status"),
      selector: (row) => row.foliarSpray1Status,
      cell: (row) => (
        <span>
          {row.foliarSpray2Status === 0
            ? t("Pending")
            : row.foliarSpray2Status === 1
            ? t("Completed")
            : t("Other")}
        </span>
      ),
      sortable: true,
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
      name: t("FYM Date"),
      selector: (row) => row.fymApplicationDate,
      cell: (row) => <span>{row.fymApplicationDate}</span>,
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
            ? t("Pending")
            : row.fertilizerApplicationStatus === 1
            ? t("Completed")
            : row.fertilizerApplicationStatus === 2
            ? t("Activity Not Required")
            : t("Other")}
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
            ? t("Pending")
            : row.fymApplicationStatus === 1
            ? t("Completed")
            : row.fymApplicationStatus === 2
            ? t("Activity Not Required")
            : t("Other")}
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
            ? t("Pending")
            : row.irrigationStatus === 1
            ? t("Completed")
            : row.irrigationStatus === 2
            ? t("Activity Not Required")
            : t("Other")}
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
            ? t("Pending")
            : row.brushingStatus === 1
            ? t("Completed")
            : row.brushingStatus === 2
            ? t("Activity Not Required")
            : t("Other")}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
  ];
  

  return (
    <Layout title="Maintenance Of Mulberry Garden List">
      <style>{maintenanceMulberryGardenListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Maintenance Of Mulberry Garden List")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/maintenance-of-mulberry-garden"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("Create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/maintenance-of-mulberry-garden"
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

      <Modal show={showModal} onHide={handleCloseModal} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="activity-round" />
            <span>{t("Activity Logs")}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-2 sh-list-wrap">
            <Card className="sh-list-card">
              <div className="sh-table-wrap">
                <DataTable
                  // title="New Trader License List"
                  tableClassName="data-table-head-light table-responsive"
                  columns={MaintenanceofmulberryGardenLogsDataColumns}
                  data={listLogsData}
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
      </Modal>

      <Modal show={showModal1} onHide={handleCloseModal1} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="bell" />
            <span>{t("Update Status")}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-2 sh-list-wrap">
            <Card className="sh-list-card">
              <div className="sh-table-wrap">
                <DataTable
                  // title="New Trader License List"
                  tableClassName="data-table-head-light table-responsive"
                  columns={MulberryGardenDataColumns}
                  data={listAlertData}
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
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="edit" />
            <span>{t("Update Status")}</span>
          </Modal.Title>
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
                  <Form.Label>{t("Fertilizer Application Status")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="fertilizerApplicationStatus"
                      value={pruningDate.fertilizerApplicationStatus}
                      onChange={handlePruningInputs}
                      // disabled={!isTodayOrFutureDate(dates.fertilizerApplicationDate)}
                    >
                      <option value="">
                        {t("Select Fertilizer Application Status")}
                      </option>
                      <option value="0">{t("Pending")}</option>
                      <option value="1">{t("Completed")}</option>
                      <option value="2">{t("Activity Not Required")}</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>{t("Farm Yard Manure Application Status")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="fymApplicationStatus"
                      value={pruningDate.fymApplicationStatus}
                      onChange={handlePruningInputs}
                      // disabled={!isTodayOrFutureDate(dates.fymApplicationDate)}
                    >
                      <option value="">{t("Select FYM Status")}</option>
                      <option value="0">{t("Pending")}</option>
                      <option value="1">{t("Completed")}</option>
                      <option value="2">{t("Activity Not Required")}</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>{t("Irrigation Status")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="irrigationStatus"
                      value={pruningDate.irrigationStatus}
                      onChange={handlePruningInputs}
                      // disabled={!isTodayOrFutureDate(dates.irrigationDate)}
                      
                    >
                      <option value="">{t("Select Irrigation Status")}</option>
                      <option value="0">{t("Pending")}</option>
                      <option value="1">{t("Completed")}</option>
                      <option value="2">{t("Activity Not Required")}</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>{t("Brushing Status")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="brushingStatus"
                      value={pruningDate.brushingStatus}
                      onChange={handlePruningInputs}
                      // disabled={!isTodayOrFutureDate(dates.brushingDate)}
                    >
                      <option value="">{t("Select Brushing Status")}</option>
                      <option value="0">{t("Pending")}</option>
                      <option value="1">{t("Completed")}</option>
                      <option value="2">{t("Activity Not Required")}</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>{t("Foliar Spray 1 Status")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="foliarSpray1Status"
                      value={pruningDate.foliarSpray1Status}
                      onChange={handlePruningInputs}
                      // disabled={!isTodayOrFutureDate(dates.foliarSpray1Status)}
                    >
                      <option value="">{t("Select Foliar Spray 1 Status")}</option>
                      <option value="0">{t("Pending")}</option>
                      <option value="1">{t("Completed")}</option>
                      <option value="2">{t("Activity Not Required")}</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>{t("Foliar Spray 2 Status")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="foliarSpray2Status"
                      value={pruningDate.foliarSpray2Status}
                      onChange={handlePruningInputs}
                      // disabled={!isTodayOrFutureDate(dates.foliarSpray2Status)}
                    >
                      <option value="">{t("Select Foliar Spray 2 Status")}</option>
                      <option value="0">{t("Pending")}</option>
                      <option value="1">{t("Completed")}</option>
                      <option value="2">{t("Activity Not Required")}</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAdd}> */}
                    <Button type="submit" variant="success" className="sh-save-btn">
                      <Icon name="save" />
                      <span>{t("Update")}</span>
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
                    className="btn btn-secondary border-0 sh-cancel-btn"
                  >
                   <Icon name="cross" />
                   <span>{t("Cancel")}</span>
                  </Link>
                </li>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal3} onHide={handleCloseModal3} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="calendar-alt" />
            <span>{t("Update Dates")}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedAllDateEdit}
            onSubmit={updateAllDates}
          >
            <Row className="g-5 px-5">
            <Col lg="4">
                <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      {t("Brushing Date")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={updateAllDate.brushingDate ? new Date(updateAllDate.brushingDate) : null}
                        onChange={(date) =>
                          handleDateChange(date, "brushingDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        // maxDate={new Date()}
                        className="form-control"
                        // required
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      {t("Irrigation Date")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={updateAllDate.irrigationDate ? new Date(updateAllDate.irrigationDate) : null}
                        onChange={(date) =>
                          handleDateChange(date, "irrigationDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        // maxDate={new Date()}
                        className="form-control"
                        // required
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      {t("FYM Application Date")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={updateAllDate.fymApplicationDate ? new Date(updateAllDate.fymApplicationDate) : null}
                        onChange={(date) =>
                          handleDateChange(date, "fymApplicationDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        // maxDate={new Date()}
                        className="form-control"
                        // required
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      {t("Fertilizer Application Date")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={updateAllDate.fertilizerApplicationDate ? new Date(updateAllDate.fertilizerApplicationDate) : null}
                        onChange={(date) =>
                          handleDateChange(date, "fertilizerApplicationDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        // maxDate={new Date()}
                        className="form-control"
                        // required
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      {t("Foilar Spray 1")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={updateAllDate.foliarSpray1 ? new Date(updateAllDate.foliarSpray1) : null}
                        onChange={(date) =>
                          handleDateChange(date, "foliarSpray1")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        // maxDate={new Date()}
                        className="form-control"
                        // required
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                    {t("Foilar Spray 2")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={updateAllDate.foliarSpray2 ? new Date(updateAllDate.foliarSpray2) : null}
                        onChange={(date) =>
                          handleDateChange(date, "foliarSpray2")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        // maxDate={new Date()}
                        className="form-control"
                        // required
                      />
                    </div>
                  </Form.Group>
                </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAdd}> */}
                    <Button type="submit" variant="success" className="sh-save-btn">
                      <Icon name="save" />
                      <span>{t("Update Dates")}</span>
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button type="button" variant="secondary" onClick={clear}>
                      Cancel
                    </Button>
                  </div> */}
                  {/* <li>
                  <Link
                    to="/seriui/Maintenance-of-mulberry-Garden-in-the-Farms-list"
                    className="btn btn-secondary border-0"
                  >
                   Cancel
                  </Link>
                </li> */}
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

const maintenanceMulberryGardenListStyles = `
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
    overflow-x: auto;
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
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 22px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
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

export default MaintenanceOfMulberryGardenList;
