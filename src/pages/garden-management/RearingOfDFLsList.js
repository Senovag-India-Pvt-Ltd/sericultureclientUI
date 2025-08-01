import { Card, Form, Row, Col, Button,Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
// import axios from "axios";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Icon, Select } from "../../components";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function RearingOfDFLsList() {
  const { t } = useTranslation();
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
      .get(baseURL2 + `Rearing-of-dfls/get-info`)
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

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/rearing-of-dfls-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/rearing-of-dfls-edit/${_id}`);
    // navigate("/seriui/training Schedule");
  };

  const formattedDate = (date) => {
    if (!date) return ""; // Handle null or undefined dates
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0")
    );
  };

  const [validated, setValidated] = useState(false);
   const [validatedEdit, setValidatedEdit] = useState(false);
     const [validatedForMoulting, setValidatedForMoulting] = useState(false);
  const [validatedForMoultingEdit, setValidatedForMoultingEdit] = useState(false);

  const [showModal3, setShowModal3] = useState(false);
  const [showModal5, setShowModal5] = useState(false);

  const [showModal6, setShowModal6] = useState(false);
const [showModal7, setShowModal7] = useState(false);

  // const handleShowModal3 = () => setShowModal3(true);
  const handleShowModal3 = (row) => {
    setFeedingMoultTable({ ...feedingTableDetails, rearingOfDFLsForThe8linesId: row.id });
    setShowModal3(true); 
  };

  const handleCloseModal3 = () => setShowModal3(false);

  const [feedingTableDetails, setFeedingMoultTable] = useState({
    rearingOfDFLsForThe8linesId: "",
    lotNumber: "",
    plotNumber: "",
    hatchingDate: new Date(),
    firstFeeding: "",
    secondFeeding: "",
    thirdFeeding: "",
    leafQuantity:"",
    wormStage: "",
    temperature: "",
    humidity: "",
  });

  const handleDateChange = (date, type) => {
    setFeedingMoultTable({ ...feedingTableDetails, [type]: date });
  };

  const handleFeedingMoultInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setFeedingMoultTable({ ...feedingTableDetails, [name]: value });
  };

  const postFeedingTableData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      const formattedReleaseDate = formattedDate(feedingTableDetails.hatchingDate);
      const sendPost = {
        rearingOfDFLsForThe8linesId: feedingTableDetails.rearingOfDFLsForThe8linesId,
        lotNumber: feedingTableDetails.lotNumber,
        plotNumber: feedingTableDetails.plotNumber,
        hatchingDate: formattedReleaseDate,
        firstFeeding: feedingTableDetails.firstFeeding,
        secondFeeding: feedingTableDetails.secondFeeding,
        thirdFeeding:feedingTableDetails.thirdFeeding,
        leafQuantity: feedingTableDetails.leafQuantity,
        wormStage: feedingTableDetails.wormStage,
        temperature: feedingTableDetails.temperature,
        humidity: feedingTableDetails.humidity, 
      };
      api
        .post(
          baseURLSeedDfl + `FeedingAndMoultTest/add-info`,
          sendPost
        )
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.message);
            handleCloseModal3();
            // clear();
            // handleCloseModal();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
      setValidated(true);
    }
  };

  const handleShowModal6 = (row) => {
    setOnlyMoultTable({ ...onlyMoultTableDetails, rearingOfDFLsForThe8linesId: row.id });
    setShowModal6(true); 
  };
  
  const handleCloseModal6 = () => setShowModal6(false);

  const [onlyMoultTableDetails, setOnlyMoultTable] = useState({
    rearingOfDFLsForThe8linesId: "",
    lotNumber: "",
    plotNumber: "",
    wormStage: "",
    atMoultDate: new Date(),
    atMoultTime: "",
    atMoultRemarks: "",
    resumeMoultDate: new Date(),
    resumeMoultTime: "",
    resumeMoultRemarks:"",
  });

  const handleDateChangeForMoulting = (date, type) => {
    setOnlyMoultTable({ ...onlyMoultTableDetails, [type]: date });
  };


  const handleOnlyMoultingInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setOnlyMoultTable({ ...onlyMoultTableDetails, [name]: value });
  };

  const postMoultingTableData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedForMoulting(true);
    } else {
      event.preventDefault();
      const formattedReleaseDate = formattedDate(onlyMoultTableDetails.atMoultDate);
      const formattedresumeDate = formattedDate(onlyMoultTableDetails.resumeMoultDate);
      const sendPost = {
        rearingOfDFLsForThe8linesId: onlyMoultTableDetails.rearingOfDFLsForThe8linesId,
        lotNumber: onlyMoultTableDetails.lotNumber,
        plotNumber: onlyMoultTableDetails.plotNumber,
        resumeMoultDate: formattedresumeDate,
        atMoultDate: formattedReleaseDate,
        atMoultTime: onlyMoultTableDetails.atMoultTime,
        atMoultRemarks: onlyMoultTableDetails.atMoultRemarks,
        resumeMoultTime:onlyMoultTableDetails.resumeMoultTime,
        resumeMoultRemarks: onlyMoultTableDetails.resumeMoultRemarks,
        wormStage: onlyMoultTableDetails.wormStage,
      };
      api
        .post(
          baseURLSeedDfl + `FeedingAndMoultTest/add-info-for-moulting`,
          sendPost
        )
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.message);
            // clear();
            // handleCloseModal();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
      setValidatedForMoulting(true);
    }
  };

  
  const [id, setId] = useState(null); // <-- Add this // <-- Add this// optional loading spinner

  const getIdList = () => {
  setLoading(true);
  api
    .get(baseURLSeedDfl + `FeedingAndMoultTest/get-info-by-id/${id}`)
    .then((response) => {
      const data = response.data;

      // Update form fields with fetched data
      setEditFeedingMoultTable({
        rearingOfDFLsForThe8linesId: data.rearingOfDFLsForThe8linesId || "",
        id: data.id || "",
        lotNumber: data.lotNumber || "",
        plotNumber: data.plotNumber || "",
        hatchingDate: new Date(data.hatchingDate), // Ensure it's a Date object
        firstFeeding: data.firstFeeding || "",
        secondFeeding: data.secondFeeding || "",
        thirdFeeding: data.thirdFeeding || "",
        leafQuantity: data.leafQuantity || "",
        wormStage: data.wormStage || "",
        temperature: data.temperature || "",
        humidity: data.humidity || "",
      });

      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch edit data", err);
      setEditFeedingMoultTable({});
      setLoading(false);
    });
};
useEffect(() => {
  if (id) {
    getIdList();
  }
}, [id]);

    

//    const handleShowModal5 = (rowId) => {
//   setId(rowId); // <-- this triggers the useEffect
//   setShowModal5(true);
// };
const handleShowModal5 = (row) => {
  setId(row.id); // this is used for fetching via API
  setEditFeedingMoultTable((prev) => ({
    ...prev,
    rearingOfDFLsForThe8linesId: row.rearingOfDFLsForThe8linesId || "",
  }));
  setShowModal5(true);
};


  
  const handleCloseModal5 = () => setShowModal5(false);


  const [editFeedingTableDetails, setEditFeedingMoultTable] = useState({
    rearingOfDFLsForThe8linesId: "",
    id: "",
    lotNumber: "",
    plotNumber: "",
    hatchingDate: new Date(),
    firstFeeding: "",
    secondFeeding: "",
    thirdFeeding: "",
    leafQuantity:"",
    wormStage: "",
    temperature: "",
    humidity: "",
  });

  const handleDateChangeForEditFeedit = (date, type) => {
    setEditFeedingMoultTable({ ...editFeedingTableDetails, [type]: date });
  };


  const handleFeedingMoultForEditInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setEditFeedingMoultTable({ ...editFeedingTableDetails, [name]: value });
  };

  const postFeedingTableForEditData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedEdit(true);
    } else {
      event.preventDefault();
      const formattedReleaseDate = formattedDate(editFeedingTableDetails.hatchingDate);
      const sendPost = {
        id: editFeedingTableDetails.id,
        rearingOfDFLsForThe8linesId: editFeedingTableDetails.rearingOfDFLsForThe8linesId,
        lotNumber: editFeedingTableDetails.lotNumber,
        plotNumber: editFeedingTableDetails.plotNumber,
        hatchingDate: formattedReleaseDate,
        firstFeeding: editFeedingTableDetails.firstFeeding,
        secondFeeding: editFeedingTableDetails.secondFeeding,
        thirdFeeding:editFeedingTableDetails.thirdFeeding,
        leafQuantity: editFeedingTableDetails.leafQuantity,
      };
      api
        .post(
          baseURLSeedDfl + `FeedingAndMoultTest/update-info`,
          sendPost
        )
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.message);
            getMoultList(); // Refresh the list after editing
            // clear();
            // handleCloseModal();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
      setValidatedEdit(true);
    }
  };

  

  const [idForMoulting, setIdForMoulting] = useState(null);

 const handleShowModal7 = (row) => {
  setIdForMoulting(row.id); // this is used for fetching via API
  setEditForMoultingTable((prev) => ({
    ...prev,
    rearingOfDFLsForThe8linesId: row.rearingOfDFLsForThe8linesId || "",
  }));
  setShowModal7(true);
};

  const getIdListForMoulting = () => {
  setLoading(true);
  api
    .get(baseURLSeedDfl + `FeedingAndMoultTest/get-info-by-id/${idForMoulting}`)
    .then((response) => {
      const data = response.data;

      // Update form fields with fetched data
      setEditForMoultingTable({
        rearingOfDFLsForThe8linesId: data.rearingOfDFLsForThe8linesId || "",
        id: data.id || "",
        lotNumber: data.lotNumber || "",
        plotNumber: data.plotNumber || "",
        atMoultDate: new Date(data.atMoultDate), // Ensure it's a Date object
        atMoultTime: data.atMoultTime || "",
        atMoultRemarks: data.atMoultRemarks || "",
        resumeMoultDate: new Date(data.resumeMoultDate),
        resumeMoultTime: data.resumeMoultTime || "",
        resumeMoultRemarks: data.resumeMoultRemarks || "",
        wormStage: data.wormStage || "",
      });

      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch edit data", err);
      setEditForMoultingTable({});
      setLoading(false);
    });
};
useEffect(() => {
  if (idForMoulting) {
    getIdListForMoulting();
  }
}, [idForMoulting]);

    

//    const handleShowModal5 = (rowId) => {
//   setId(rowId); // <-- this triggers the useEffect
//   setShowModal5(true);
// };



  
  const handleCloseModal7 = () => setShowModal7(false);


  const [editForMoultingDetails, setEditForMoultingTable] = useState({
    rearingOfDFLsForThe8linesId: "",
    lotNumber: "",
    plotNumber: "",
    wormStage: "",
    atMoultDate: new Date(),
    atMoultTime: "",
    atMoultRemarks: "",
    resumeMoultDate: new Date(),
    resumeMoultTime: "",
    resumeMoultRemarks:"",
  });

  const handleDateChangeForEditMoulting = (date, type) => {
    setEditForMoultingTable({ ...editForMoultingDetails, [type]: date });
  };


  const handleMoultingForEditInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setEditForMoultingTable({ ...editForMoultingDetails, [name]: value });
  }; 

  const postMoultingTableForEditData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedForMoultingEdit(true);
    } else {
      event.preventDefault();
      const formattedReleaseDate = formattedDate(editForMoultingDetails.atMoultDate);
      const formattedResumeDate = formattedDate(editForMoultingDetails.resumeMoultDate);
      const sendPost = {
        id: editForMoultingDetails.id,
        rearingOfDFLsForThe8linesId: editForMoultingDetails.rearingOfDFLsForThe8linesId,
        lotNumber: editForMoultingDetails.lotNumber,
        plotNumber: editForMoultingDetails.plotNumber,
        resumeMoultDate: formattedResumeDate,
        atMoultDate: formattedReleaseDate,
        atMoultTime: editForMoultingDetails.atMoultTime,
        atMoultRemarks: editForMoultingDetails.atMoultRemarks,
        resumeMoultTime:editForMoultingDetails.resumeMoultTime,
        resumeMoultRemarks: editForMoultingDetails.resumeMoultRemarks,
        wormStage: editForMoultingDetails.wormStage,
      };
      api
        .post(
          baseURLSeedDfl + `FeedingAndMoultTest/update-info-for-moulting`,
          sendPost
        )
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.message);
            getOnlyMoultingList(); // Refresh the list after editing
            // clear();
            // handleCloseModal();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
      setValidatedForMoultingEdit(true);
    }
  };
const [showModal8, setShowModal8] = useState(false);
  const handleShowModal8 = () => setShowModal8(true); 
  const handleCloseModal8 = () => setShowModal8(false);

  const [listOnlyMoultData, setOnlyMoultListData] = useState({});

  const getOnlyMoultingList = () => {
    setLoading(true);
  
    api
      .get(baseURLSeedDfl + `FeedingAndMoultTest/get-info-for-moulting`)
      .then((response) => {
        setOnlyMoultListData(response.data);
        setLoading(false);
        handleShowModal8(); // Open modal after data is fetched
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const [showModal4, setShowModal4] = useState(false);
  const handleShowModal4 = () => setShowModal4(true); 
  const handleCloseModal4 = () => setShowModal4(false);

  const [listMoultData, setMoultListData] = useState({});

  const getMoultList = () => {
    setLoading(true);
  
    api
      .get(baseURLSeedDfl + `FeedingAndMoultTest/get-info-for-feeding`)
      .then((response) => {
        setMoultListData(response.data);
        setLoading(false);
        handleShowModal4(); // Open modal after data is fetched
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const RearingOfDFLSMoultDataColumns = [
    
    {
      name: t("Lot Number"),
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: t("Hatching Date"),
      selector: (row) => row.hatchingDate,
      cell: (row) => <span>{row.hatchingDate}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("First Feeding"),
      selector: (row) => row.firstFeeding,
      cell: (row) => <span>{row.firstFeeding}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Second Feeding"),
      selector: (row) => row.secondFeeding,
      cell: (row) => <span>{row.secondFeeding}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("Third Feeding"),
      selector: (row) => row.thirdFeeding,
      cell: (row) => <span>{row.thirdFeeding}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Leaf Quantity"),
      selector: (row) => row.leafQuantity,
      cell: (row) => <span>{row.leafQuantity}</span>,
      sortable: true,
      hide: "md",
    },

     {
      name: t("Plot Number"),
      selector: (row) => row.plotNumber,
      cell: (row) => <span>{row.plotNumber}</span>,
      sortable: true,
      hide: "md",
    },
 {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirmForFeedingandMoult(row.id)}
          >
            Delete
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleShowModal5(row)} // <-- correct
          >
            {t("Edit")}
          </Button>

         
        </div>
      ),
      sortable: false,
      hide: "md",
      // grow: 2,
    },

    // {
    //   name: t("Worm Stage"),
    //   selector: (row) => row.wormStage,
    //   cell: (row) => <span>{row.wormStage}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: t("Temperature"),
    //   selector: (row) => row.temperature,
    //   cell: (row) => <span>{row.temperature}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: t("Humidity"),
    //   selector: (row) => row.humidity,
    //   cell: (row) => <span>{row.humidity}</span>,
    //   sortable: true,
    //   hide: "md",
    // },

  ];

  const RearingOfDFLSOnlyMoultingDataColumns = [
    
    {
      name: t("Lot Number"),
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Worm Stage"),
      selector: (row) => row.wormStage,
      cell: (row) => <span>{row.wormStage}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: t("At Moult Date"),
      selector: (row) => row.atMoultDate,
      cell: (row) => <span>{row.atMoultDate}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("At Moult Time"),
      selector: (row) => row.atMoultTime,
      cell: (row) => <span>{row.atMoultTime}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("At Moult Remarks"),
      selector: (row) => row.atMoultRemarks,
      cell: (row) => <span>{row.atMoultRemarks}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("Resume Moult Date"),
      selector: (row) => row.resumeMoultDate,
      cell: (row) => <span>{row.resumeMoultDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Resume Moult Time"),
      selector: (row) => row.resumeMoultTime,
      cell: (row) => <span>{row.resumeMoultTime}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Resume Moult Remarks"),
      selector: (row) => row.resumeMoultRemarks,
      cell: (row) => <span>{row.resumeMoultRemarks}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirmForFeedingandMoult(row.id)}
          >
            Delete
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleShowModal7(row)} // <-- correct
          >
            {t("Edit")}
          </Button>

         
        </div>
      ),
      sortable: false,
      hide: "md",
      // grow: 2,
    },

  ];


   const deleteConfirmForFeedingandMoult = (_id) => {
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
          .delete(baseURLSeedDfl + `FeedingAndMoultTest/delete-info/${_id}`)
          .then((response) => {
            // deleteConfirm(_id);
            getMoultList();
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

  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: message,
    });
  };

  const saveError = (message) => {
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
          .delete(baseURL2 + `Rearing-of-dfls/delete-info/${_id}`)
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

  const RearingOfDFLsDataColumns = [
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
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleShowModal3(row)}
            className="ms-2"
          >
            {t("Add Feeding Table")}
          </Button>

           <Button
            variant="danger"
            size="sm"
            onClick={() => handleShowModal6(row)}
            className="ms-2"
          >
            {t("Add Moulting Table")}
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 6,

    },
    {
      name: t("Disinfectant Usage Details"),
      selector: (row) => row.disinfectantMasterName,
      cell: (row) => <span>{row.disinfectantMasterName}</span>,
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
      name: t(" Lot Number"),
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: t(" Number Of DFLs"),
      selector: (row) => row.numberOfDfls,
      cell: (row) => <span>{row.numberOfDfls}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Race Of DFLs"),
      selector: (row) => row.raceName,
      cell: (row) => <span>{row.raceName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Source"),
      selector: (row) => row.source,
      cell: (row) => <span>{row.source}</span>,
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
      name: t("Cold Storage Details"),
      selector: (row) => row.coldStorageDetails,
      cell: (row) => <span>{row.coldStorageDetails}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Released On Date"),
      selector: (row) => row.releasedOnDate,
      cell: (row) => <span>{row.releasedOnDate}</span>,
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
      name: t("Chawki Percentage"),
      selector: (row) => row.chawkiPercentage,
      cell: (row) => <span>{row.chawkiPercentage}</span>,
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
      name: t("Spun On To Date"),
      selector: (row) => row.spunOnToDate,
      cell: (row) => <span>{row.spunOnToDate}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title={t("List Of Rearing of DFLs")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("List Of Rearing of DFLs")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/rearing-of-dfls"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>{t("Create")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/rearing-of-dfls"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>{t("Create")}</span>
                </Link>
              </li>
              <li>
              <Button
                variant="danger"
                size="sm"
                onClick={() => getMoultList()}
                className="ms-2"
              >
                {t("Feeding Table List")}
              </Button>
            </li>

            <li>
              <Button
                variant="danger"
                size="sm"
                onClick={() => getOnlyMoultingList()}
                className="ms-2"
              >
                {t("Moulting Table")}
              </Button>
            </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
        <div style={{ overflowX: 'auto' }}>
          <DataTable
            // title="New Trader License List"
            // tableClassName="data-table-head-light table-responsive"
            columns={RearingOfDFLsDataColumns}
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
          </div>
        </Card>
      </Block>

      <Modal show={showModal8} onHide={handleCloseModal8} size="xl">
  <Modal.Header closeButton>
    <Modal.Title>{t("Moulting Table")}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Block className="mt-3">
      <Card>
        <DataTable
          tableClassName="data-table-head-light table-responsive"
          columns={RearingOfDFLSOnlyMoultingDataColumns}
          data={listOnlyMoultData}
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
    <Button variant="secondary" onClick={handleCloseModal8}>
      {t("Close")}
    </Button>
  </Modal.Footer>
</Modal>

 <Modal show={showModal6} onHide={handleCloseModal6} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("Add Moulting Details")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-4">
            <Form noValidate validated={validatedForMoulting} onSubmit={postMoultingTableData}>
              <Row className="g-3 ">
                <div>
                  <Row className="g-gs">
                    <Col lg="12">
                      <Block>
                        <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Lot Number")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="lotNumber"
                                  name="lotNumber"
                                  value={
                                    onlyMoultTableDetails.lotNumber || ""
                                  }
                                  onChange={handleOnlyMoultingInputs}
                                  type="text"
                                  placeholder={t("Lot Number")}
                                  // readOnly
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Bed Name is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>
                              {t("Worm Stage")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="wormStage"
                                  value={onlyMoultTableDetails.wormStage}
                                  onChange={handleOnlyMoultingInputs}
                                  // required
                                  // isInvalid={
                                  //   data.testResults === undefined ||
                                  //   data.testResults === "0"
                                  // }
                                >
                                  <option value="">
                                    {t("Select Worm Stage")}
                                  </option>
                                  <option value="Hatching">{t("Hatching")}</option>
                                  <option value="1st Moult">{t("1st Moult")}</option>
                                  <option value="2nd Moult">{t("2nd Moult")}</option>
                                  <option value="3rd Moult">{t("3rd Moult")}</option>
                                  <option value="4th Moult">{t("4th Moult")}</option>
                                  <option value="Spinning">{t("Spinning")}</option>
                                  <option value="Harvest">{t("Harvest")}</option>
                                  <option value="Supply/Market">{t("Supply/Market")}</option>
                                </Form.Select>
                              </div>
                            </Form.Group>
                          </Col>
                    
                    <Block >
                      <Card>
                      <Card.Header>
                       {t("At Moulting Details")}
                      </Card.Header>
                      <Card.Body>
                      <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="sordfl">
                                {t("At Moult Date")}
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={onlyMoultTableDetails.atMoultDate}
                                  onChange={(date) =>
                                    handleDateChangeForMoulting(date, "atMoultDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  // maxDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  // required
                                />
                              </div>
                            </Form.Group>
                          </Col>
                        
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                               {t("At Moult Time")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="atMoultTime"
                                  name="atMoultTime"
                                  value={
                                    onlyMoultTableDetails.atMoultTime || ""
                                  }
                                  onChange={handleOnlyMoultingInputs}
                                  type="text"
                                  placeholder={t("At Moult Time")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                               {t("At Moult Remarks")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="atMoultRemarks"
                                  name="atMoultRemarks"
                                  value={
                                    onlyMoultTableDetails.atMoultRemarks || ""
                                  }
                                  onChange={handleOnlyMoultingInputs}
                                  type="text"
                                  placeholder={t("At Moult Remarks")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    {/* </Block> */}

                      <Card className="mt-3">
                      <Card.Header>
                       {t("Resume Moulting Details")}
                      </Card.Header>
                      <Card.Body>
                       <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="sordfl">
                                {t("Resume Moult Date")}
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={onlyMoultTableDetails.resumeMoultDate}
                                  onChange={(date) =>
                                    handleDateChangeForMoulting(date, "resumeMoultDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  // maxDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  // required
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                               {t("Resume Moult Time")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="resumeMoultTime"
                                  name="resumeMoultTime"
                                  value={
                                    onlyMoultTableDetails.resumeMoultTime || ""
                                  }
                                  onChange={handleOnlyMoultingInputs}
                                  type="text"
                                  placeholder={t("Resume Moult Time")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                               {t("Resume Moult Remarks")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="resumeMoultRemarks"
                                  name="resumeMoultRemarks"
                                  value={
                                    onlyMoultTableDetails.resumeMoultRemarks || ""
                                  }
                                  onChange={handleOnlyMoultingInputs}
                                  type="text"
                                  placeholder={t("Resume Moult Remarks")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                           </Row>
                        </Card.Body>
                      </Card>
                      </Block>
                          
                        </Row>
                        <div className="gap-col mt-2">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            {/* <Button type="button" variant="primary" onClick={postData}> */}
                            <Button type="submit" variant="primary">
                              {t("Update")}
                            </Button>
                          </li>
                          <li>
                            
                          </li>
                        </ul>
                      </div>
                        {/* </Card.Body>
                    </Card> */}
                      </Block>
                     
                    </Col>
                  </Row>
                </div>
              </Row>
            </Form>
          </Block>
          </Modal.Body>
      </Modal>

      <Modal show={showModal3} onHide={handleCloseModal3} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("Feeding Table")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-4">
            <Form noValidate validated={validated} onSubmit={postFeedingTableData}>
              <Row className="g-3 ">
                <div>
                  <Row className="g-gs">
                    <Col lg="12">
                      <Block>
                        <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="sordfl">
                                {t("Date")}
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={feedingTableDetails.hatchingDate}
                                  onChange={(date) =>
                                    handleDateChange(date, "hatchingDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  // maxDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  // required
                                />
                              </div>
                            </Form.Group>
                          </Col>

                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Lot Number")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="lotNumber"
                                  name="lotNumber"
                                  value={
                                    feedingTableDetails.lotNumber || ""
                                  }
                                  onChange={handleFeedingMoultInputs}
                                  type="text"
                                  placeholder={t("Lot Number")}
                                  // readOnly
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Bed Name is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                        

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                               {t("1st Feeding")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="firstFeeding"
                                  name="firstFeeding"
                                  value={
                                    feedingTableDetails.firstFeeding || ""
                                  }
                                  onChange={handleFeedingMoultInputs}
                                  type="text"
                                  placeholder={t("1st Feeding")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                               {t("2nd Feeding")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="secondFeeding"
                                  name="secondFeeding"
                                  value={
                                    feedingTableDetails.secondFeeding || ""
                                  }
                                  onChange={handleFeedingMoultInputs}
                                  type="text"
                                  placeholder={t("2nd Feeding")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                               {t("3rd Feeding")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="thirdFeeding"
                                  name="thirdFeeding"
                                  value={
                                    feedingTableDetails.thirdFeeding || ""
                                  }
                                  onChange={handleFeedingMoultInputs}
                                  type="text"
                                  placeholder={t("3rd Feeding")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Leaf Quantity in Gms/Kg")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="leafQuantity"
                                  name="leafQuantity"
                                  value={feedingTableDetails.leafQuantity || ""}
                                  onChange={handleFeedingMoultInputs}
                                  type="number"
                                  placeholder={t("Leaf Quantity in Gms/Kg")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                         <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Plot Number")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="plotNumber"
                                  name="plotNumber"
                                  value={
                                    feedingTableDetails.plotNumber || ""
                                  }
                                  onChange={handleFeedingMoultInputs}
                                  type="text"
                                  placeholder={t("Plot Number")}
                                  // readOnly
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Bed Name is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                        <div className="gap-col mt-2">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            {/* <Button type="button" variant="primary" onClick={postData}> */}
                            <Button type="submit" variant="primary">
                              {t("Update")}
                            </Button>
                          </li>
                          <li>
                            
                          </li>
                        </ul>
                      </div>
                        {/* </Card.Body>
                    </Card> */}
                      </Block>
                     
                    </Col>
                  </Row>
                </div>
              </Row>
            </Form>
          </Block>
          </Modal.Body>
      </Modal>

      <Modal show={showModal4} onHide={handleCloseModal4} size="xl">
  <Modal.Header closeButton>
    <Modal.Title>{t("Feeding Table")}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Block className="mt-3">
      <Card>
        <DataTable
          tableClassName="data-table-head-light table-responsive"
          columns={RearingOfDFLSMoultDataColumns}
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

<Modal show={showModal5} onHide={handleCloseModal5} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("Edit Feeding Table")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-4">
            <Form noValidate validated={validatedEdit} onSubmit={postFeedingTableForEditData}>
              <Row className="g-3 ">
                <div>
                  <Row className="g-gs">
                    <Col lg="12">
                      <Block>
                        <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="sordfl">
                                {t("Date")}
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={editFeedingTableDetails.hatchingDate}
                                  onChange={(date) =>
                                    handleDateChangeForEditFeedit(date, "hatchingDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  // maxDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  // required
                                />
                              </div>
                            </Form.Group>
                          </Col>

                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Lot Number")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="lotNumber"
                                  name="lotNumber"
                                  value={
                                    editFeedingTableDetails.lotNumber || ""
                                  }
                                  onChange={handleFeedingMoultForEditInputs}
                                  type="text"
                                  placeholder={t("Lot Number")}
                                  // readOnly
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Bed Name is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                        

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                               {t("1st Feeding")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="firstFeeding"
                                  name="firstFeeding"
                                  value={
                                    editFeedingTableDetails.firstFeeding || ""
                                  }
                                  onChange={handleFeedingMoultForEditInputs}
                                  type="text"
                                  placeholder={t("1st Feeding")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                               {t("2nd Feeding")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="secondFeeding"
                                  name="secondFeeding"
                                  value={
                                    editFeedingTableDetails.secondFeeding || ""
                                  }
                                  onChange={handleFeedingMoultForEditInputs}
                                  type="text"
                                  placeholder={t("2nd Feeding")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                               {t("3rd Feeding")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="thirdFeeding"
                                  name="thirdFeeding"
                                  value={
                                    editFeedingTableDetails.thirdFeeding || ""
                                  }
                                  onChange={handleFeedingMoultForEditInputs}
                                  type="text"
                                  placeholder={t("3rd Feeding")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Leaf Quantity in Gms/Kg")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="leafQuantity"
                                  name="leafQuantity"
                                  value={editFeedingTableDetails.leafQuantity || ""}
                                  onChange={handleFeedingMoultForEditInputs}
                                  type="number"
                                  placeholder={t("Leaf Quantity in Gms/Kg")}
                                  // required
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Plot Number")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="plotNumber"
                                  name="plotNumber"
                                  value={
                                    editFeedingTableDetails.plotNumber || ""
                                  }
                                  onChange={handleFeedingMoultForEditInputs}
                                  type="text"
                                  placeholder={t("Plot Number")}
                                  // readOnly
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Bed Name is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          
                        </Row>
                        <div className="gap-col mt-2">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            {/* <Button type="button" variant="primary" onClick={postData}> */}
                            <Button type="submit" variant="primary">
                              {t("Update")}
                            </Button>
                          </li>
                          <li>
                            
                          </li>
                        </ul>
                      </div>
                        {/* </Card.Body>
                    </Card> */}
                      </Block>
                     
                    </Col>
                  </Row>
                </div>
              </Row>
            </Form>
          </Block>
          </Modal.Body>
      </Modal>

        <Modal show={showModal7} onHide={handleCloseModal7} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("Edit Moulting Details")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-4">
            <Form noValidate validated={validatedForMoultingEdit} onSubmit={postMoultingTableForEditData}>
              <Row className="g-3 ">
                <div>
                  <Row className="g-gs">
                    <Col lg="12">
                      <Block>
                        <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Lot Number")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="lotNumber"
                                  name="lotNumber"
                                  value={
                                    editForMoultingDetails.lotNumber || ""
                                  }
                                  onChange={handleMoultingForEditInputs}
                                  type="text"
                                  placeholder={t("Lot Number")}
                                  // readOnly
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Bed Name is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>
                              {t("Worm Stage")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="wormStage"
                                  value={editForMoultingDetails.wormStage}
                                  onChange={handleMoultingForEditInputs}
                                  // required
                                  // isInvalid={
                                  //   data.testResults === undefined ||
                                  //   data.testResults === "0"
                                  // }
                                >
                                  <option value="">
                                    {t("Select Worm Stage")}
                                  </option>
                                  <option value="Hatching">{t("Hatching")}</option>
                                  <option value="1st Moult">{t("1st Moult")}</option>
                                  <option value="2nd Moult">{t("2nd Moult")}</option>
                                  <option value="3rd Moult">{t("3rd Moult")}</option>
                                  <option value="4th Moult">{t("4th Moult")}</option>
                                  <option value="Spinning">{t("Spinning")}</option>
                                  <option value="Harvest">{t("Harvest")}</option>
                                  <option value="Supply/Market">{t("Supply/Market")}</option>
                                </Form.Select>
                              </div>
                            </Form.Group>
                          </Col>
                    
                    <Block >
                      <Card>
                      <Card.Header>
                       {t("At Moulting Details")}
                      </Card.Header>
                      <Card.Body>
                      <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="sordfl">
                                {t("At Moult Date")}
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={editForMoultingDetails.atMoultDate}
                                  onChange={(date) =>
                                    handleDateChangeForEditMoulting(date, "atMoultDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  // maxDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  // required
                                />
                              </div>
                            </Form.Group>
                          </Col>
                        
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                               {t("At Moult Time")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="atMoultTime"
                                  name="atMoultTime"
                                  value={
                                    editForMoultingDetails.atMoultTime || ""
                                  }
                                  onChange={handleMoultingForEditInputs}
                                  type="text"
                                  placeholder={t("At Moult Time")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                               {t("At Moult Remarks")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="atMoultRemarks"
                                  name="atMoultRemarks"
                                  value={
                                    editForMoultingDetails.atMoultRemarks || ""
                                  }
                                  onChange={handleMoultingForEditInputs}
                                  type="text"
                                  placeholder={t("At Moult Remarks")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                           </Row>
                        </Card.Body>
                      </Card>


                <Card className="mt-3">
                      <Card.Header>
                       {t("Resume Moulting Details")}
                      </Card.Header>
                      <Card.Body>
                       <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="sordfl">
                                {t("Resume Moult Date")}
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={editForMoultingDetails.resumeMoultDate}
                                  onChange={(date) =>
                                    handleDateChangeForEditMoulting(date, "resumeMoultDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  // maxDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  // required
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                               {t("Resume Moult Time")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="resumeMoultTime"
                                  name="resumeMoultTime"
                                  value={
                                    editForMoultingDetails.resumeMoultTime || ""
                                  }
                                  onChange={handleMoultingForEditInputs}
                                  type="text"
                                  placeholder={t("Resume Moult Time")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                               {t("Resume Moult Remarks")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="resumeMoultRemarks"
                                  name="resumeMoultRemarks"
                                  value={
                                    editForMoultingDetails.resumeMoultRemarks || ""
                                  }
                                  onChange={handleMoultingForEditInputs}
                                  type="text"
                                  placeholder={t("Resume Moult Remarks")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                           </Row>
                        </Card.Body>
                      </Card>
                      </Block>
                          
                        </Row>
                        <div className="gap-col mt-2">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            {/* <Button type="button" variant="primary" onClick={postData}> */}
                            <Button type="submit" variant="primary">
                              {t("Update")}
                            </Button>
                          </li>
                          <li>
                            
                          </li>
                        </ul>
                      </div>
                        {/* </Card.Body>
                    </Card> */}
                      </Block>
                     
                    </Col>
                  </Row>
                </div>
              </Row>
            </Form>
          </Block>
          </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default RearingOfDFLsList;
