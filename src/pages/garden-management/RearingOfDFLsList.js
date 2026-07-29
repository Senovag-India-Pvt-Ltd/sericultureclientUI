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

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

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
    trayWormCount: "",
    rejectedWormCount: "",
    pebrineDetected: "",
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
        trayWormCount: onlyMoultTableDetails.trayWormCount,
        rejectedWormCount: onlyMoultTableDetails.rejectedWormCount,
        pebrineDetected: onlyMoultTableDetails.pebrineDetected,
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
        trayWormCount: data.trayWormCount ?? "",
        rejectedWormCount: data.rejectedWormCount ?? "",
        pebrineDetected: data.pebrineDetected ?? "",
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
    trayWormCount: "",
    rejectedWormCount: "",
    pebrineDetected: "",
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
        trayWormCount: editForMoultingDetails.trayWormCount,
        rejectedWormCount: editForMoultingDetails.rejectedWormCount,
        pebrineDetected: editForMoultingDetails.pebrineDetected,
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
            onClick={() => deleteConfirmForFeeding(row.id)}
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
      grow: 2,
    },

  ];

  const [showModal9, setShowModal9] = useState(false);
    const handleShowModal9 = () => setShowModal9(true); 
    const handleCloseModal9 = () => setShowModal9(false);
  
     const [listOnlyTemperatureData, setOnlyTemperatureListData] = useState({});
    
      const getOnlyTemperatureList = () => {
        setLoading(true);
      
        api
          .get(baseURLSeedDfl + `FeedingAndMoultTest/get-info-for-temperature`)
          .then((response) => {
            setOnlyTemperatureListData(response.data);
            setLoading(false);
            handleShowModal9(); // Open modal after data is fetched
          })
          .catch((err) => {
            setLoading(false);
          });
      };
  
    const [showModal10, setShowModal10] = useState(false);
  const handleShowModal10 = (row) => {
      setOnlyTemperatureTable({ ...onlyTemperatureTableDetails, rearingOfDFLsForThe8linesId: row.id });
      setShowModal10(true); 
    };
  
     const handleCloseModal10 = () => setShowModal10(false);
  
    const [onlyTemperatureTableDetails, setOnlyTemperatureTable] = useState({
      rearingOfDFLsForThe8linesId: "",
      lotNumber: "",
      temperatureHumidityDate: new Date(),
      temperature: "",
      humidity: "",
      rainfall: "",
      afterNoonTwelveTemperature: "",
      afterNoonTwelveHumidity: "",
      eveningSixTemperature:"",
      eveningSixHumidity:"",
    });
  
    const [validatedForTemperature, setValidatedForTemperature] = useState(false);
    const [validatedForTemperatureEdit, setValidatedForTemperatureEdit] = useState(false);
  
    const handleDateChangeForTemperature = (date, type) => {
        setOnlyTemperatureTable({ ...onlyTemperatureTableDetails, [type]: date });
      };
    
    
      const handleOnlyTemperatureInputs = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setOnlyTemperatureTable({ ...onlyTemperatureTableDetails, [name]: value });
      };
  
    
    
      const postTemperatureTableData = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          setValidatedForTemperature(true);
        } else {
          event.preventDefault();
          const formattedTemperatureHumidityDate = formattedDate(onlyTemperatureTableDetails.temperatureHumidityDate);
         
          const sendPost = {
            rearingOfDFLsForThe8linesId: onlyTemperatureTableDetails.rearingOfDFLsForThe8linesId,
            lotNumber: onlyTemperatureTableDetails.lotNumber,
            temperatureHumidityDate: formattedTemperatureHumidityDate,
            temperature: onlyTemperatureTableDetails.temperature,
            humidity: onlyTemperatureTableDetails.humidity,
            rainfall: onlyTemperatureTableDetails.rainfall,
            afterNoonTwelveTemperature: onlyTemperatureTableDetails.afterNoonTwelveTemperature,
            afterNoonTwelveHumidity: onlyTemperatureTableDetails.afterNoonTwelveHumidity,
            eveningSixTemperature:onlyTemperatureTableDetails.eveningSixTemperature,
            eveningSixHumidity: onlyTemperatureTableDetails.eveningSixHumidity,
           
          };
          api
            .post(
              baseURLSeedDfl + `FeedingAndMoultTest/add-info-for-temperature-humidity`,
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
          setValidatedForTemperature(true);
        }
      };
  
      const [showModal11, setShowModal11] = useState(false);
      const handleCloseModal11 = () => setShowModal11(false);
     const [idForTemperature, setIdForTemperature] = useState(null);
    const [editForTemperatureDetails, setEditForTemperatureTable] = useState({
      rearingOfDFLsForThe8linesId: "",
      lotNumber: "",
      temperatureHumidityDate: new Date(),
      temperature: "",
      humidity: "",
      rainfall: "",
      afterNoonTwelveTemperature: "",
      afterNoonTwelveHumidity: "",
      eveningSixTemperature:"",
      eveningSixHumidity:"",
    });
  
    const handleDateChangeForEditTemperature = (date, type) => {
        setEditForTemperatureTable({ ...editForTemperatureDetails, [type]: date });
      };
    
    
      const handleTemperatureForEditInputs = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setEditForTemperatureTable({ ...editForTemperatureDetails, [name]: value });
      }; 
    
      const postTemperatureTableForEditData = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          setValidatedForTemperatureEdit(true);
        } else {
          event.preventDefault();
          const formattedTemperatureHumidityDate = formattedDate(editForTemperatureDetails.temperatureHumidityDate);
          const sendPost = {
            id: editForTemperatureDetails.id,
           rearingOfDFLsForThe8linesId: editForTemperatureDetails.rearingOfDFLsForThe8linesId,
            lotNumber: editForTemperatureDetails.lotNumber,
            temperatureHumidityDate: formattedTemperatureHumidityDate,
            temperature: editForTemperatureDetails.temperature,
            humidity: editForTemperatureDetails.humidity,
            rainfall: editForTemperatureDetails.rainfall,
            afterNoonTwelveTemperature: editForTemperatureDetails.afterNoonTwelveTemperature,
            afterNoonTwelveHumidity: editForTemperatureDetails.afterNoonTwelveHumidity,
            eveningSixTemperature:editForTemperatureDetails.eveningSixTemperature,
            eveningSixHumidity: editForTemperatureDetails.eveningSixHumidity,
          };
          api
            .post(
              baseURLSeedDfl + `FeedingAndMoultTest/update-info-for-temperature-humidity`,
              sendPost
            )
            .then((response) => {
              if (response.data.error) {
                saveError(response.data.message);
              } else {
                saveSuccess(response.data.message);
                getOnlyTemperatureList(); // Refresh the list after editing
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
          setValidatedForTemperatureEdit(true);
        }
      };
  
     const handleShowModal11 = (row) => {
      setIdForTemperature(row.id); // this is used for fetching via API
      setEditForTemperatureTable((prev) => ({
        ...prev,
        rearingOfDFLsForThe8linesId: row.rearingOfDFLsForThe8linesId || "",
      }));
      setShowModal11(true);
    };
    
      const getIdListForTemperature = () => {
      setLoading(true);
      api
        .get(baseURLSeedDfl + `FeedingAndMoultTest/get-info-by-id/${idForTemperature}`)
        .then((response) => {
          const data = response.data;
    
          // Update form fields with fetched data
          setEditForTemperatureTable({
            rearingOfDFLsForThe8linesId: data.rearingOfDFLsForThe8linesId || "",
            id: data.id || "",
            lotNumber: data.lotNumber || "",
            temperatureHumidityDate: new Date(data.temperatureHumidityDate), // Ensure it's a Date object
            temperature: data.temperature || "",
            humidity: data.humidity || "",
            rainfall: data.rainfall || "",
            afterNoonTwelveTemperature: data.afterNoonTwelveTemperature,
            afterNoonTwelveHumidity: data.afterNoonTwelveHumidity || "",
            eveningSixTemperature: data.eveningSixTemperature || "",
            eveningSixHumidity: data.eveningSixHumidity || "",
          });
    
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch edit data", err);
          setEditForTemperatureTable({});
          setLoading(false);
        });
    };
    useEffect(() => {
      if (idForTemperature) {
        getIdListForTemperature();
      }
    }, [idForTemperature]);

    const RearingOfDFLSOnlyTemperatureDataColumns = [
          
          {
            name: t("Lot Number"),
            selector: (row) => row.lotNumber,
            cell: (row) => <span>{row.lotNumber}</span>,
            sortable: true,
            hide: "md",
          },
    
          {
            name: t("Date"),
            selector: (row) => row.temperatureHumidityDate,
            cell: (row) => <span>{row.temperatureHumidityDate}</span>,
            sortable: true,
            hide: "md",
          },
          {
            name: t("Morning 6 Temperature"),
            selector: (row) => row.temperature,
            cell: (row) => <span>{row.temperature}</span>,
            sortable: true,
            hide: "md",
          },
          
          {
            name: t("Morning 6 Humidity"),
            selector: (row) => row.humidity,
            cell: (row) => <span>{row.humidity}</span>,
            sortable: true,
            hide: "md",
          },
      
         {
            name: t("12 PM Temperature"),
            selector: (row) => row.afterNoonTwelveTemperature,
            cell: (row) => <span>{row.afterNoonTwelveTemperature}</span>,
            sortable: true,
            hide: "md",
          },
          
          {
            name: t("12 PM Humidity"),
            selector: (row) => row.afterNoonTwelveHumidity,
            cell: (row) => <span>{row.afterNoonTwelveHumidity}</span>,
            sortable: true,
            hide: "md",
          },
    
          {
            name: t("6 PM Temperature"),
            selector: (row) => row.eveningSixTemperature,
            cell: (row) => <span>{row.eveningSixTemperature}</span>,
            sortable: true,
            hide: "md",
          },
          
          {
            name: t("6 PM Humidity"),
            selector: (row) => row.eveningSixHumidity,
            cell: (row) => <span>{row.eveningSixHumidity}</span>,
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
                  onClick={() => deleteConfirmForTemperature(row.id)}
                >
                  Delete
                </Button>
      
                <Button
                  variant="primary"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleShowModal11(row)} // <-- correct
                >
                  {t("Edit")}
                </Button>
      
               
              </div>
            ),
            sortable: false,
            hide: "md",
            grow: 2,
          },
      
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
            onClick={() => deleteConfirmForMoult(row.id)}
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
      grow: 2,
    },

  ];


    const deleteConfirmForMoult = (_id) => {
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
            getOnlyMoultingList();
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

  const deleteConfirmForFeeding = (_id) => {
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

   const deleteConfirmForTemperature = (_id) => {
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
            getOnlyTemperatureList();
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

  const [cocoonAssesmentDetailsBedWise, setCocoonAssesmentDetailsBedWise] = useState({
      bed1Id: "",
      bed1Name: "",
      bed1WeightCacoons: "",
      bed1WeightPupa: "",
      bed1WeightShells: "",
      bed1ShellPercentage: "",
      bed1Err:"",
      bed1CacoonsFormed: "",
      bed1WormsBrushed: "",
      bed1SingleWeightCacoons: "",
      bed1SingleWeightPupa: "",
      bed1SingleWeightShells: "",
      bed2Id: "",
      bed2Name: "",
      bed2WeightCacoons: "",
      bed2WeightPupa: "",
      bed2WeightShells: "",
      bed2SingleWeightCacoons: "",
      bed2SingleWeightPupa: "",
      bed2SingleWeightShells: "",
      bed2ShellPercentage: "",
      bed2Err:"",
      bed2CacoonsFormed: "",
      bed2WormsBrushed: "",
      bed3Id: "",
      bed3Name: "",
      bed3WeightCacoons: "",
      bed3WeightPupa: "",
      bed3WeightShells: "",
      bed3ShellPercentage: "",
      bed3Err:"",
      bed3CacoonsFormed: "",
      bed3WormsBrushed: "",
      bed3SingleWeightCacoons: "",
      bed3SingleWeightPupa: "",
      bed3SingleWeightShells: "",
      bed4Id: "",
      bed4Name: "",
      bed4WeightCacoons: "",
      bed4WeightPupa: "",
      bed4WeightShells: "",
      bed4ShellPercentage: "",
      bed4Err:"",
      bed4CacoonsFormed: "",
      bed4WormsBrushed: "",
      bed4SingleWeightCacoons: "",
      bed4SingleWeightPupa: "",
      bed4SingleWeightShells: "",
      bed5Id: "",
      bed5Name: "",
      bed5WeightCacoons: "",
      bed5WeightPupa: "",
      bed5WeightShells: "",
      bed5ShellPercentage: "",
      bed5Err:"",
      bed5CacoonsFormed: "",
      bed5WormsBrushed: "",
      bed5SingleWeightCacoons: "",
      bed5SingleWeightPupa: "",
      bed5SingleWeightShells: "",
    });
  
    
  
    const handleInputs = (e) => {
      let name = e.target.name;
      let value = e.target.value;
      setCocoonAssesmentDetailsBedWise({ ...cocoonAssesmentDetailsBedWise, [name]: value });
    };
  
    const postData = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
      } else {
        event.preventDefault();
        const sendPost = {
          id: cocoonAssesmentDetailsBedWise.bed1Id,
          bedName: cocoonAssesmentDetailsBedWise.bed1Name,
          weightCacoons: cocoonAssesmentDetailsBedWise.bed1WeightCacoons,
          weightPupa: cocoonAssesmentDetailsBedWise.bed1WeightPupa,
          weightShells: cocoonAssesmentDetailsBedWise.bed1WeightShells,
          singleWeightCacoons: cocoonAssesmentDetailsBedWise.bed1SingleWeightCacoons,
          singleWeightPupa: cocoonAssesmentDetailsBedWise.bed1SingleWeightPupa,
          singleWeightShells: cocoonAssesmentDetailsBedWise.bed1SingleWeightShells,
          shellPercentage:cocoonAssesmentDetailsBedWise.bed1ShellPercentage,
          err: cocoonAssesmentDetailsBedWise.bed1Err,
          cacoonsFormed: cocoonAssesmentDetailsBedWise.bed1CacoonsFormed,
          wormsBrushed: cocoonAssesmentDetailsBedWise.bed1WormsBrushed,
          maleRatio: cocoonAssesmentDetailsBedWise.bed1MaleRatio,
          femaleRatio: cocoonAssesmentDetailsBedWise.bed1FemaleRatio, 
        };
        api
          .post(
            baseURL2 + `Rearing-of-dfls/update-cacoon-assesment-data-by-id`,
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
        setValidated(true);
      }
    };
  
    const postBed2Data = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
      } else {
        event.preventDefault();
        const sendPost = {
          id: cocoonAssesmentDetailsBedWise.bed2Id,
          bedName: cocoonAssesmentDetailsBedWise.bed2Name,
          weightCacoons: cocoonAssesmentDetailsBedWise.bed2WeightCacoons,
          weightPupa: cocoonAssesmentDetailsBedWise.bed2WeightPupa,
          weightShells: cocoonAssesmentDetailsBedWise.bed2WeightShells,
          shellPercentage:cocoonAssesmentDetailsBedWise.bed2ShellPercentage,
          singleWeightCacoons: cocoonAssesmentDetailsBedWise.bed2SingleWeightCacoons,
          singleWeightPupa: cocoonAssesmentDetailsBedWise.bed2SingleWeightPupa,
          singleWeightShells: cocoonAssesmentDetailsBedWise.bed2SingleWeightShells,
          err: cocoonAssesmentDetailsBedWise.bed2Err,
          cacoonsFormed: cocoonAssesmentDetailsBedWise.bed2CacoonsFormed,
          wormsBrushed: cocoonAssesmentDetailsBedWise.bed2WormsBrushed,
          maleRatio: cocoonAssesmentDetailsBedWise.bed2MaleRatio,
          femaleRatio: cocoonAssesmentDetailsBedWise.bed2FemaleRatio, 
        };
        api
          .post(
            baseURL2 + `Rearing-of-dfls/update-cacoon-assesment-data-by-id`,
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
        setValidated(true);
      }
    };
  
    const postBed3Data = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
      } else {
        event.preventDefault();
        const sendPost = {
          id: cocoonAssesmentDetailsBedWise.bed3Id,
          bedName: cocoonAssesmentDetailsBedWise.bed3Name,
          weightCacoons: cocoonAssesmentDetailsBedWise.bed3WeightCacoons,
          weightPupa: cocoonAssesmentDetailsBedWise.bed3WeightPupa,
          weightShells: cocoonAssesmentDetailsBedWise.bed3WeightShells,
          singleWeightCacoons: cocoonAssesmentDetailsBedWise.bed3SingleWeightCacoons,
          singleWeightPupa: cocoonAssesmentDetailsBedWise.bed3SingleWeightPupa,
          singleWeightShells: cocoonAssesmentDetailsBedWise.bed3SingleWeightShells,
          shellPercentage:cocoonAssesmentDetailsBedWise.bed3ShellPercentage,
          err: cocoonAssesmentDetailsBedWise.bed3Err,
          cacoonsFormed: cocoonAssesmentDetailsBedWise.bed3CacoonsFormed,
          wormsBrushed: cocoonAssesmentDetailsBedWise.bed3WormsBrushed,
          maleRatio: cocoonAssesmentDetailsBedWise.bed3MaleRatio,
          femaleRatio: cocoonAssesmentDetailsBedWise.bed3FemaleRatio, 
        };
        api
          .post(
            baseURL2 + `Rearing-of-dfls/update-cacoon-assesment-data-by-id`,
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
        setValidated(true);
      }
    };
  
    const postBed4Data = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
      } else {
        event.preventDefault();
        const sendPost = {
          id: cocoonAssesmentDetailsBedWise.bed4Id,
          bedName: cocoonAssesmentDetailsBedWise.bed4Name,
          weightCacoons: cocoonAssesmentDetailsBedWise.bed4WeightCacoons,
          weightPupa: cocoonAssesmentDetailsBedWise.bed4WeightPupa,
          weightShells: cocoonAssesmentDetailsBedWise.bed4WeightShells,
          singleWeightCacoons: cocoonAssesmentDetailsBedWise.bed4SingleWeightCacoons,
          singleWeightPupa: cocoonAssesmentDetailsBedWise.bed4SingleWeightPupa,
          singleWeightShells: cocoonAssesmentDetailsBedWise.bed4SingleWeightShells,
          shellPercentage:cocoonAssesmentDetailsBedWise.bed4ShellPercentage,
          err: cocoonAssesmentDetailsBedWise.bed4Err,
          cacoonsFormed: cocoonAssesmentDetailsBedWise.bed4CacoonsFormed,
          wormsBrushed: cocoonAssesmentDetailsBedWise.bed4WormsBrushed,
          maleRatio: cocoonAssesmentDetailsBedWise.bed4MaleRatio,
          femaleRatio: cocoonAssesmentDetailsBedWise.bed4FemaleRatio, 
        };
        api
          .post(
            baseURL2 + `Rearing-of-dfls/update-cacoon-assesment-data-by-id`,
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
        setValidated(true);
      }
    };
  
    const postBed5Data = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
      } else {
        event.preventDefault();
        const sendPost = {
          id: cocoonAssesmentDetailsBedWise.bed5Id,
          bedName: cocoonAssesmentDetailsBedWise.bed5Name,
          weightCacoons: cocoonAssesmentDetailsBedWise.bed5WeightCacoons,
          weightPupa: cocoonAssesmentDetailsBedWise.bed5WeightPupa,
          weightShells: cocoonAssesmentDetailsBedWise.bed5WeightShells,
          singleWeightCacoons: cocoonAssesmentDetailsBedWise.bed5SingleWeightCacoons,
          singleWeightPupa: cocoonAssesmentDetailsBedWise.bed5SingleWeightPupa,
          singleWeightShells: cocoonAssesmentDetailsBedWise.bed5SingleWeightShells,
          shellPercentage:cocoonAssesmentDetailsBedWise.bed5ShellPercentage,
          err: cocoonAssesmentDetailsBedWise.bed5Err,
          cacoonsFormed: cocoonAssesmentDetailsBedWise.bed5CacoonsFormed,
          wormsBrushed: cocoonAssesmentDetailsBedWise.bed5WormsBrushed,
          maleRatio: cocoonAssesmentDetailsBedWise.bed5MaleRatio,
          femaleRatio: cocoonAssesmentDetailsBedWise.bed5FemaleRatio, 
        };
        api
          .post(
            baseURL2 + `Rearing-of-dfls/update-cacoon-assesment-data-by-id`,
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
        setValidated(true);
      }
    };
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseModal1 = () => setShowModal1(false);

   const getCocoonList = (_id) => {
      setLoading(true);
      handleShowModal();
    
      api
        .get(
          baseURL2 + `Rearing-of-dfls/get-cacoon-assesment-data-by-id/${_id}`
        )
        .then((response) => {
          const data = response.data;
    
          // Update the state for each bed based on the response
          setCocoonAssesmentDetailsBedWise({
            bed1Id: data[0]?.id || "",
            bed1Name: data[0]?.bedName || "",
            bed1WeightCacoons: data[0]?.weightCacoons || "",
            bed1WeightPupa: data[0]?.weightPupa || "",
            bed1WeightShells: data[0]?.weightShells || "",
            bed1SingleWeightCacoons: data[0]?.singleWeightCacoons || "",
            bed1SingleWeightPupa: data[0]?.singleWeightPupa || "",
            bed1SingleWeightShells: data[0]?.singleWeightShells || "",
            bed1ShellPercentage: data[0]?.shellPercentage || "",
            bed1Err: data[0]?.err || "",
            bed1CacoonsFormed: data[0]?.cacoonsFormed || "",
            bed1WormsBrushed: data[0]?.wormsBrushed || "",
            bed1MaleRatio: data[0]?.maleRatio || "",
            bed1FemaleRatio: data[0]?.femaleRatio || "",
            bed2Id: data[1]?.id || "",
            bed2Name: data[1]?.bedName || "",
            bed2WeightCacoons: data[1]?.weightCacoons || "",
            bed2WeightPupa: data[1]?.weightPupa || "",
            bed2WeightShells: data[1]?.weightShells || "",
            bed2SingleWeightCacoons: data[1]?.singleWeightCacoons || "",
            bed2SingleWeightPupa: data[1]?.singleWeightPupa || "",
            bed2SingleWeightShells: data[1]?.singleWeightShells || "",
            bed2ShellPercentage: data[1]?.shellPercentage || "",
            bed2Err: data[1]?.err || "",
            bed2CacoonsFormed: data[1]?.cacoonsFormed || "",
            bed2WormsBrushed: data[1]?.wormsBrushed || "",
            bed2MaleRatio: data[1]?.maleRatio || "",
            bed2FemaleRatio: data[1]?.femaleRatio || "",
            bed3Id: data[2]?.id || "",
            bed3Name: data[2]?.bedName || "",
            bed3WeightCacoons: data[2]?.weightCacoons || "",
            bed3WeightPupa: data[2]?.weightPupa || "",
            bed3WeightShells: data[2]?.weightShells || "",
            bed3SingleWeightCacoons: data[2]?.singleWeightCacoons || "",
            bed3SingleWeightPupa: data[2]?.singleWeightPupa || "",
            bed3SingleWeightShells: data[2]?.singleWeightShells || "",
            bed3ShellPercentage: data[2]?.shellPercentage || "",
            bed3Err: data[2]?.err || "",
            bed3CacoonsFormed: data[2]?.cacoonsFormed || "",
            bed3WormsBrushed: data[2]?.wormsBrushed || "",
            bed3MaleRatio: data[2]?.maleRatio || "",
            bed3FemaleRatio: data[2]?.femaleRatio || "",
            bed4Id: data[3]?.id || "",
            bed4Name: data[3]?.bedName || "",
            bed4WeightCacoons: data[3]?.weightCacoons || "",
            bed4WeightPupa: data[3]?.weightPupa || "",
            bed4WeightShells: data[3]?.weightShells || "",
            bed4SingleWeightCacoons: data[3]?.singleWeightCacoons || "",
            bed4SingleWeightPupa: data[3]?.singleWeightPupa || "",
            bed4SingleWeightShells: data[3]?.singleWeightShells || "",
            bed4ShellPercentage: data[3]?.shellPercentage || "",
            bed4Err: data[3]?.err || "",
            bed4CacoonsFormed: data[3]?.cacoonsFormed || "",
            bed4WormsBrushed: data[3]?.wormsBrushed || "",
            bed4MaleRatio: data[3]?.maleRatio || "",
            bed4FemaleRatio: data[3]?.femaleRatio || "",
            bed5Id: data[4]?.id || "",
            bed5Name: data[4]?.bedName || "",
            bed5WeightCacoons: data[4]?.weightCacoons || "",
            bed5WeightPupa: data[4]?.weightPupa || "",
            bed5WeightShells: data[4]?.weightShells || "",
            bed5SingleWeightCacoons: data[4]?.singleWeightCacoons || "",
            bed5SingleWeightPupa: data[4]?.singleWeightPupa || "",
            bed5SingleWeightShells: data[4]?.singleWeightShells || "",
            bed5ShellPercentage: data[4]?.shellPercentage || "",
            bed5Err: data[4]?.err || "",
            bed5CacoonsFormed: data[4]?.cacoonsFormed || "",
            bed5WormsBrushed: data[4]?.wormsBrushed || "",
            bed5MaleRatio: data[4]?.maleRatio || "",
            bed5FemaleRatio: data[4]?.femaleRatio || "",
          });
    
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    };

     const [viewDetailsData, setViewDetailsData] = useState({
        bed1Id: "",
        bed1Name: "",
        bed1WeightCacoons: "",
        bed1WeightPupa: "",
        bed1WeightShells: "",
        bed1ShellPercentage: "",
        bed1Err:"",
        bed1CacoonsFormed: "",
        bed1WormsBrushed: "",
        bed1SingleWeightCacoons: "",
        bed1SingleWeightPupa: "",
        bed1SingleWeightShells: "",
        bed1MaleRatio: "",
        bed1FemaleRatio: "",
        bed2Id: "",
        bed2Name: "",
        bed2WeightCacoons: "",
        bed2WeightPupa: "",
        bed2WeightShells: "",
        bed2SingleWeightCacoons: "",
        bed2SingleWeightPupa: "",
        bed2SingleWeightShells: "",
        bed2ShellPercentage: "",
        bed2Err:"",
        bed2CacoonsFormed: "",
        bed2WormsBrushed: "",
        bed2MaleRatio: "",
        bed2FemaleRatio: "",
        bed3Id: "",
        bed3Name: "",
        bed3WeightCacoons: "",
        bed3WeightPupa: "",
        bed3WeightShells: "",
        bed3ShellPercentage: "",
        bed3Err:"",
        bed3CacoonsFormed: "",
        bed3WormsBrushed: "",
        bed3SingleWeightCacoons: "",
        bed3SingleWeightPupa: "",
        bed3SingleWeightShells: "",
        bed3MaleRatio: "",
        bed3FemaleRatio: "",
        bed4Id: "",
        bed4Name: "",
        bed4WeightCacoons: "",
        bed4WeightPupa: "",
        bed4WeightShells: "",
        bed4ShellPercentage: "",
        bed4Err:"",
        bed4CacoonsFormed: "",
        bed4WormsBrushed: "",
        bed4SingleWeightCacoons: "",
        bed4SingleWeightPupa: "",
        bed4SingleWeightShells: "",
        bed4MaleRatio: "",
        bed4FemaleRatio: "",
        bed5Id: "",
        bed5Name: "",
        bed5WeightCacoons: "",
        bed5WeightPupa: "",
        bed5WeightShells: "",
        bed5ShellPercentage: "",
        bed5Err:"",
        bed5CacoonsFormed: "",
        bed5WormsBrushed: "",
        bed5SingleWeightCacoons: "",
        bed5SingleWeightPupa: "",
        bed5SingleWeightShells: "",
        bed5MaleRatio: "",
        bed5FemaleRatio: "",
      });
    
      const viewDetails = (_id) => {
        handleShowModal1();
        api
          .get(baseURL2 + `Rearing-of-dfls/get-cacoon-assesment-data-by-id/${_id}`)
          .then((response) => {
            const data = response.data;
            setViewDetailsData({
              bed1Id: data[0]?.id || "",
              bed1Name: data[0]?.bedName || "",
              bed1WeightCacoons: data[0]?.weightCacoons || "",
              bed1WeightPupa: data[0]?.weightPupa || "",
              bed1WeightShells: data[0]?.weightShells || "",
              bed1SingleWeightCacoons: data[0]?.singleWeightCacoons || "",
              bed1SingleWeightPupa: data[0]?.singleWeightPupa || "",
              bed1SingleWeightShells: data[0]?.singleWeightShells || "",
              bed1ShellPercentage: data[0]?.shellPercentage || "",
              bed1Err: data[0]?.err || "",
              bed1CacoonsFormed: data[0]?.cacoonsFormed || "",
              bed1WormsBrushed: data[0]?.wormsBrushed || "",
              bed1MaleRatio: data[0]?.maleRatio || "",
              bed1FemaleRatio: data[0]?.femaleRatio || "",
              bed2Id: data[1]?.id || "",
              bed2Name: data[1]?.bedName || "",
              bed2WeightCacoons: data[1]?.weightCacoons || "",
              bed2WeightPupa: data[1]?.weightPupa || "",
              bed2WeightShells: data[1]?.weightShells || "",
              bed2SingleWeightCacoons: data[1]?.singleWeightCacoons || "",
              bed2SingleWeightPupa: data[1]?.singleWeightPupa || "",
              bed2SingleWeightShells: data[1]?.singleWeightShells || "",
              bed2ShellPercentage: data[1]?.shellPercentage || "",
              bed2Err: data[1]?.err || "",
              bed2CacoonsFormed: data[1]?.cacoonsFormed || "",
              bed2WormsBrushed: data[1]?.wormsBrushed || "",
              bed2MaleRatio: data[1]?.maleRatio || "",
              bed2FemaleRatio: data[1]?.femaleRatio || "",
              bed3Id: data[2]?.id || "",
              bed3Name: data[2]?.bedName || "",
              bed3WeightCacoons: data[2]?.weightCacoons || "",
              bed3WeightPupa: data[2]?.weightPupa || "",
              bed3WeightShells: data[2]?.weightShells || "",
              bed3SingleWeightCacoons: data[2]?.singleWeightCacoons || "",
              bed3SingleWeightPupa: data[2]?.singleWeightPupa || "",
              bed3SingleWeightShells: data[2]?.singleWeightShells || "",
              bed3ShellPercentage: data[2]?.shellPercentage || "",
              bed3Err: data[2]?.err || "",
              bed3CacoonsFormed: data[2]?.cacoonsFormed || "",
              bed3WormsBrushed: data[2]?.wormsBrushed || "",
              bed3MaleRatio: data[2]?.maleRatio || "",
              bed3FemaleRatio: data[2]?.femaleRatio || "",
              bed4Id: data[3]?.id || "",
              bed4Name: data[3]?.bedName || "",
              bed4WeightCacoons: data[3]?.weightCacoons || "",
              bed4WeightPupa: data[3]?.weightPupa || "",
              bed4WeightShells: data[3]?.weightShells || "",
              bed4SingleWeightCacoons: data[3]?.singleWeightCacoons || "",
              bed4SingleWeightPupa: data[3]?.singleWeightPupa || "",
              bed4SingleWeightShells: data[3]?.singleWeightShells || "",
              bed4ShellPercentage: data[3]?.shellPercentage || "",
              bed4Err: data[3]?.err || "",
              bed4CacoonsFormed: data[3]?.cacoonsFormed || "",
              bed4WormsBrushed: data[3]?.wormsBrushed || "",
              bed4MaleRatio: data[3]?.maleRatio || "",
              bed4FemaleRatio: data[3]?.femaleRatio || "",
              bed5Id: data[4]?.id || "",
              bed5Name: data[4]?.bedName || "",
              bed5WeightCacoons: data[4]?.weightCacoons || "",
              bed5WeightPupa: data[4]?.weightPupa || "",
              bed5WeightShells: data[4]?.weightShells || "",
              bed5SingleWeightCacoons: data[4]?.singleWeightCacoons || "",
              bed5SingleWeightPupa: data[4]?.singleWeightPupa || "",
              bed5SingleWeightShells: data[4]?.singleWeightShells || "",
              bed5ShellPercentage: data[4]?.shellPercentage || "",
              bed5Err: data[4]?.err || "",
              bed5CacoonsFormed: data[4]?.cacoonsFormed || "",
              bed5WormsBrushed: data[4]?.wormsBrushed || "",
              bed5MaleRatio: data[4]?.maleRatio || "",
              bed5FemaleRatio: data[4]?.femaleRatio || "",
            });
      
            // setViewDetailsData(response.data);
    
            setLoading(false);
          })
          .catch((err) => {
            setViewDetailsData({});
            setLoading(false);
          });
      };

  const RearingOfDFLsDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="outline-primary"
            size="sm"
            className="d-inline-flex align-items-center gap-1 shadow-sm"
            onClick={() => handleView(row.id)}
          >
            <Icon name="eye" />
            {t("View")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm"
            onClick={() => handleEdit(row.id)}
          >
            <Icon name="edit" />
            {t("Edit")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleShowModal3(row)}
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm"
          >
            <Icon name="plus" />
            {t("Add Feeding Table")}
          </Button>

           <Button
            variant="danger"
            size="sm"
            onClick={() => handleShowModal6(row)}
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm"
          >
            <Icon name="plus" />
            {t("Add Moulting Table")}
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => handleShowModal10(row)}
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm"
          >
            <Icon name="plus" />
            {t("Add Temperature Table")}
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
          name: t("Cocoon Assesment Details"),
          cell: (row) => (
            <Button
              className="d-flex justify-content-center"
              variant="primary"
              size="sm"
              onClick={() => getCocoonList(row.id)}
            >
              {t("Show")}
            </Button>
          ),
          sortable: true,
          hide: "md",
        },
        {
          name: t("View Cocoon Assesment Details"),
          cell: (row) => (
            <Button
              className="d-flex justify-content-center"
              variant="primary"
              size="sm"
              onClick={() => viewDetails(row.id)}
            >
              {t("View")}
            </Button>
          ),
          sortable: true,
          hide: "md",
        },
  ];

  return (
    <Layout title={t("List Of Rearing of DFLs")}>
      <style>{rearingOfDFLsListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("List Of Rearing of DFLs")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex flex-wrap gap-2">
                <li>
                  <Link
                    to="/seriui/rearing-of-dfls"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("Create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/rearing-of-dfls"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("Create")}</span>
                  </Link>
                </li>
                <li>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => getMoultList()}
                  className="sh-cta-btn d-inline-flex align-items-center gap-1"
                >
                  <Icon name="activity-round" />
                  {t("Feeding Table List")}
                </Button>
              </li>

              <li>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => getOnlyMoultingList()}
                  className="sh-cta-btn d-inline-flex align-items-center gap-1"
                >
                  <Icon name="activity-round" />
                  {t("Moulting Table")}
                </Button>
              </li>

              <li>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => getOnlyTemperatureList()}
                  className="sh-cta-btn d-inline-flex align-items-center gap-1"
                >
                  <Icon name="activity-round" />
                  {t("Temperature Humidity Table")}
                </Button>
              </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-list-wrap">
        <Card className="sh-list-card">
        {/* <div style={{ overflowX: 'auto' }}> */}
          <div className="sh-table-wrap">
            <DataTable
              // title="New Trader License List"
              // tableClassName="data-table-head-light table-responsive"
              columns={RearingOfDFLsDataColumns}
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
          {/* </div> */}
        </Card>
      </Block>

      <Modal show={showModal8} onHide={handleCloseModal8} size="xl" className="sh-modal">
  <Modal.Header closeButton className="sh-modal-header">
    <Modal.Title>
      <Icon name="activity-round" />
      <span>{t("Moulting Table")}</span>
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Block className="mt-3 sh-list-wrap">
      <Card className="sh-list-card">
        <div className="sh-table-wrap">
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={RearingOfDFLSOnlyMoultingDataColumns}
            data={listOnlyMoultData}
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
    <Button variant="secondary" onClick={handleCloseModal8} className="sh-cancel-btn">
      <Icon name="cross" />
      <span>{t("Close")}</span>
    </Button>
  </Modal.Footer>
</Modal>

 <Modal show={showModal6} onHide={handleCloseModal6} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="edit" />
            <span>{t("Add Moulting Details")}</span>
          </Modal.Title>
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
                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label>{t("Tray Worm Count")}</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  name="trayWormCount"
                                  value={onlyMoultTableDetails.trayWormCount || ""}
                                  onChange={handleOnlyMoultingInputs}
                                  type="number"
                                  min="0"
                                  placeholder={t("Tray Worm Count")}
                                />
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label>{t("Rejected Worm Count")}</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  name="rejectedWormCount"
                                  value={onlyMoultTableDetails.rejectedWormCount || ""}
                                  onChange={handleOnlyMoultingInputs}
                                  type="number"
                                  min="0"
                                  placeholder={t("Rejected Worm Count")}
                                />
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label>{t("Pebrine Detected (per stage)")}</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  name="pebrineDetected"
                                  value={onlyMoultTableDetails.pebrineDetected || ""}
                                  onChange={handleOnlyMoultingInputs}
                                  type="text"
                                  placeholder={t("Pebrine Detected")}
                                />
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

      <Modal show={showModal3} onHide={handleCloseModal3} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="edit" />
            <span>{t("Feeding Table")}</span>
          </Modal.Title>
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

      <Modal show={showModal4} onHide={handleCloseModal4} size="xl" className="sh-modal">
  <Modal.Header closeButton className="sh-modal-header">
    <Modal.Title>
      <Icon name="activity-round" />
      <span>{t("Feeding Table")}</span>
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Block className="mt-3 sh-list-wrap">
      <Card className="sh-list-card">
        <div className="sh-table-wrap">
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={RearingOfDFLSMoultDataColumns}
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

<Modal show={showModal5} onHide={handleCloseModal5} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="edit" />
            <span>{t("Edit Feeding Table")}</span>
          </Modal.Title>
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

        <Modal show={showModal7} onHide={handleCloseModal7} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="edit" />
            <span>{t("Edit Moulting Details")}</span>
          </Modal.Title>
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

      <Modal show={showModal10} onHide={handleCloseModal10} size="xl" className="sh-modal">
                  <Modal.Header closeButton className="sh-modal-header">
                    <Modal.Title>
                      <Icon name="edit" />
                      <span>{t("Add Temperature Details")}</span>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Block className="mt-4">
                      <Form noValidate validated={validatedForTemperature} onSubmit={postTemperatureTableData}>
                        <Row className="g-3 ">
                          <div>
                            <Row className="g-gs">
                              <Col lg="12">
                                <Block>
                                  <Row className="g-gs">
                                  <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="weightCacoons">
                                          {t("Lot Number")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="lotNumber"
                                            name="lotNumber"
                                            value={
                                              onlyTemperatureTableDetails.lotNumber || ""
                                            }
                                            onChange={handleOnlyTemperatureInputs}
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
          
                                    
                                    <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="sordfl">
                                          {t("Date")}
                                          {/* <span className="text-danger">*</span> */}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <DatePicker
                                            selected={onlyTemperatureTableDetails.temperatureHumidityDate}
                                            onChange={(date) =>
                                              handleDateChangeForTemperature(date, "temperatureHumidityDate")
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
                              
                                  <Block >
                                    <Card>
                                    <Card.Header>
                                    {t("Morning 6-00 AM")}
                                    </Card.Header>
                                    <Card.Body>
                                    <Row className="g-gs">
                                  <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="shellPercentage">
                                          {t("Temperature (°C)")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="temperature"
                                            name="temperature"
                                            value={
                                              onlyTemperatureTableDetails.temperature || ""
                                            }
                                            onChange={handleOnlyTemperatureInputs}
                                            type="text"
                                            placeholder={t("Temperature (°C)")}
                                            // required
                                          />
                                          {/* <Form.Control.Feedback type="invalid">
                                            Shell Percentage is required
                                          </Form.Control.Feedback> */}
                                        </div>
                                      </Form.Group>
                                    </Col>
                                    <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="shellPercentage">
                                          {t("Humidity (%)")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="humidity"
                                            name="humidity"
                                            value={
                                              onlyTemperatureTableDetails.humidity || ""
                                            }
                                            onChange={handleOnlyTemperatureInputs}
                                            type="text"
                                            placeholder={t("Humidity (%)")}
                                            // required
                                          />
                                          {/* <Form.Control.Feedback type="invalid">
                                            Shell Percentage is required
                                          </Form.Control.Feedback> */}
                                        </div>
                                      </Form.Group>
                                    </Col>
                                    <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="rainfall">
                                          {t("Rainfall (mm)")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="rainfall"
                                            name="rainfall"
                                            value={
                                              onlyTemperatureTableDetails.rainfall || ""
                                            }
                                            onChange={handleOnlyTemperatureInputs}
                                            type="number"
                                            min="0"
                                            step="any"
                                            placeholder={t("Rainfall (mm)")}
                                          />
                                        </div>
                                      </Form.Group>
                                    </Col>
                                    </Row>
                                  </Card.Body>
                                </Card>
                              {/* </Block> */}
          
                                <Card className="mt-3">
                                <Card.Header>
                                    {t("Afternoon 12-00 PM")}
                                    </Card.Header>
                                    <Card.Body>
                                    <Row className="g-gs">
                                  <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="shellPercentage">
                                          {t("Temperature (°C)")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="afterNoonTwelveTemperature"
                                            name="afterNoonTwelveTemperature"
                                            value={
                                              onlyTemperatureTableDetails.afterNoonTwelveTemperature || ""
                                            }
                                            onChange={handleOnlyTemperatureInputs}
                                            type="text"
                                            placeholder={t("Temperature (°C)")}
                                            // required
                                          />
                                          {/* <Form.Control.Feedback type="invalid">
                                            Shell Percentage is required
                                          </Form.Control.Feedback> */}
                                        </div>
                                      </Form.Group>
                                    </Col>
                                    <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="shellPercentage">
                                          {t("Humidity (%)")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="afterNoonTwelveHumidity"
                                            name="afterNoonTwelveHumidity"
                                            value={
                                              onlyTemperatureTableDetails.afterNoonTwelveHumidity || ""
                                            }
                                            onChange={handleOnlyTemperatureInputs}
                                            type="text"
                                            placeholder={t("Humidity (%)")}
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
                                    {t("Evening 6-00 PM")}
                                    </Card.Header>
                                    <Card.Body>
                                    <Row className="g-gs">
                                  <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="shellPercentage">
                                          {t("Temperature (°C)")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="eveningSixTemperature"
                                            name="eveningSixTemperature"
                                            value={
                                              onlyTemperatureTableDetails.eveningSixTemperature || ""
                                            }
                                            onChange={handleOnlyTemperatureInputs}
                                            type="text"
                                            placeholder={t("Temperature (°C)")}
                                            // required
                                          />
                                          {/* <Form.Control.Feedback type="invalid">
                                            Shell Percentage is required
                                          </Form.Control.Feedback> */}
                                        </div>
                                      </Form.Group>
                                    </Col>
                                    <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="shellPercentage">
                                          {t("Humidity (%)")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="eveningSixHumidity"
                                            name="eveningSixHumidity"
                                            value={
                                              onlyTemperatureTableDetails.eveningSixHumidity || ""
                                            }
                                            onChange={handleOnlyTemperatureInputs}
                                            type="text"
                                            placeholder={t("Humidity (%)")}
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

                <Modal show={showModal9} onHide={handleCloseModal9} size="xl" className="sh-modal">
                    <Modal.Header closeButton className="sh-modal-header">
                      <Modal.Title>
                        <Icon name="activity-round" />
                        <span>{t("Temperature-Humidity Table")}</span>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Block className="mt-3 sh-list-wrap">
                        <Card className="sh-list-card">
                          <div className="sh-table-wrap">
                            <DataTable
                              tableClassName="data-table-head-light table-responsive"
                              columns={RearingOfDFLSOnlyTemperatureDataColumns}
                              data={listOnlyTemperatureData}
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
                      <Button variant="secondary" onClick={handleCloseModal9} className="sh-cancel-btn">
                        <Icon name="cross" />
                        <span>{t("Close")}</span>
                      </Button>
                    </Modal.Footer>
                  </Modal>

                <Modal show={showModal11} onHide={handleCloseModal11} size="xl" className="sh-modal">
                      <Modal.Header closeButton className="sh-modal-header">
                        <Modal.Title>
                          <Icon name="edit" />
                          <span>{t("Edit Temperature Humidity Details")}</span>
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Block className="mt-4">
                      <Form noValidate validated={validatedForTemperatureEdit} onSubmit={postTemperatureTableForEditData}>
                        <Row className="g-3 ">
                          <div>
                            <Row className="g-gs">
                              <Col lg="12">
                                <Block>
                                  <Row className="g-gs">
                                  <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="weightCacoons">
                                          {t("Lot Number")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="lotNumber"
                                            name="lotNumber"
                                            value={
                                              editForTemperatureDetails.lotNumber || ""
                                            }
                                            onChange={handleTemperatureForEditInputs}
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
          
                                    
                                    <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="sordfl">
                                          {t("Date")}
                                          {/* <span className="text-danger">*</span> */}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <DatePicker
                                            selected={editForTemperatureDetails.temperatureHumidityDate}
                                            onChange={(date) =>
                                              handleDateChangeForEditTemperature(date, "temperatureHumidityDate")
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
                              
                                  <Block >
                                    <Card>
                                    <Card.Header>
                                    {t("Morning 6-00 AM")}
                                    </Card.Header>
                                    <Card.Body>
                                    <Row className="g-gs">
                                  <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="shellPercentage">
                                          {t("Temperature (°C)")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="temperature"
                                            name="temperature"
                                            value={
                                              editForTemperatureDetails.temperature || ""
                                            }
                                            onChange={handleTemperatureForEditInputs}
                                            type="text"
                                            placeholder={t("Temperature (°C)")}
                                            // required
                                          />
                                          {/* <Form.Control.Feedback type="invalid">
                                            Shell Percentage is required
                                          </Form.Control.Feedback> */}
                                        </div>
                                      </Form.Group>
                                    </Col>
                                    <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="shellPercentage">
                                          {t("Humidity (%)")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="humidity"
                                            name="humidity"
                                            value={
                                              editForTemperatureDetails.humidity || ""
                                            }
                                            onChange={handleTemperatureForEditInputs}
                                            type="text"
                                            placeholder={t("Humidity (%)")}
                                            // required
                                          />
                                          {/* <Form.Control.Feedback type="invalid">
                                            Shell Percentage is required
                                          </Form.Control.Feedback> */}
                                        </div>
                                      </Form.Group>
                                    </Col>
                                    <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="rainfall">
                                          {t("Rainfall (mm)")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="rainfall"
                                            name="rainfall"
                                            value={
                                              editForTemperatureDetails.rainfall || ""
                                            }
                                            onChange={handleTemperatureForEditInputs}
                                            type="number"
                                            min="0"
                                            step="any"
                                            placeholder={t("Rainfall (mm)")}
                                          />
                                        </div>
                                      </Form.Group>
                                    </Col>
                                    </Row>
                                  </Card.Body>
                                </Card>
                              {/* </Block> */}
          
                                <Card className="mt-3">
                                <Card.Header>
                                    {t("Afternoon 12-00 PM")}
                                    </Card.Header>
                                    <Card.Body>
                                    <Row className="g-gs">
                                  <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="shellPercentage">
                                          {t("Temperature (°C)")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="afterNoonTwelveTemperature"
                                            name="afterNoonTwelveTemperature"
                                            value={
                                              editForTemperatureDetails.afterNoonTwelveTemperature || ""
                                            }
                                            onChange={handleTemperatureForEditInputs}
                                            type="text"
                                            placeholder={t("Temperature (°C)")}
                                            // required
                                          />
                                          {/* <Form.Control.Feedback type="invalid">
                                            Shell Percentage is required
                                          </Form.Control.Feedback> */}
                                        </div>
                                      </Form.Group>
                                    </Col>
                                    <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="shellPercentage">
                                          {t("Humidity (%)")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="afterNoonTwelveHumidity"
                                            name="afterNoonTwelveHumidity"
                                            value={
                                              editForTemperatureDetails.afterNoonTwelveHumidity || ""
                                            }
                                            onChange={handleTemperatureForEditInputs}
                                            type="text"
                                            placeholder={t("Humidity (%)")}
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
                                    {t("Evening 6-00 PM")}
                                    </Card.Header>
                                    <Card.Body>
                                    <Row className="g-gs">
                                  <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="shellPercentage">
                                          {t("Temperature (°C)")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="eveningSixTemperature"
                                            name="eveningSixTemperature"
                                            value={
                                              editForTemperatureDetails.eveningSixTemperature || ""
                                            }
                                            onChange={handleTemperatureForEditInputs}
                                            type="text"
                                            placeholder={t("Temperature (°C)")}
                                            // required
                                          />
                                          {/* <Form.Control.Feedback type="invalid">
                                            Shell Percentage is required
                                          </Form.Control.Feedback> */}
                                        </div>
                                      </Form.Group>
                                    </Col>
                                    <Col lg="6">
                                      <Form.Group className="form-group mt-n3">
                                        <Form.Label htmlFor="shellPercentage">
                                          {t("Humidity (%)")}
                                        </Form.Label>
                                        <div className="form-control-wrap">
                                          <Form.Control
                                            id="eveningSixHumidity"
                                            name="eveningSixHumidity"
                                            value={
                                              editForTemperatureDetails.eveningSixHumidity || ""
                                            }
                                            onChange={handleTemperatureForEditInputs}
                                            type="text"
                                            placeholder={t("Humidity (%)")}
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

                    <Modal show={showModal} onHide={handleCloseModal} size="xl" className="sh-modal">
                            <Modal.Header closeButton className="sh-modal-header">
                              <Modal.Title>
                                <Icon name="edit" />
                                <span>{t("Cocoon Assesment Details")}</span>
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Block className="mt-4">
                                <Form noValidate validated={validated} onSubmit={postData}>
                                  <Row className="g-3 ">
                                    <div>
                                      <Row className="g-gs">
                                        <Col lg="12">
                                          <Block>
                                          <Card>
                                          <Card.Header>
                                           {t("Bed 1")}
                                          </Card.Header>
                                          <Card.Body>
                                            <Row className="g-gs">
                                            <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightCacoons">
                                                    {t("Bed Name")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed1Name"
                                                      name="bed1Name"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed1Name || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Bed Name")}
                                                      readOnly
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
                                                  <Form.Label htmlFor="weightCacoons">
                                                    {t("Average Weight of 25 Cocoons")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed1WeightCacoons"
                                                      name="bed1WeightCacoons"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed1WeightCacoons || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Average Weight of 25 Cocoons")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Cocoons is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightCacoons">
                                                    {t("Weight of Single Cocoons")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed1SingleWeightCacoons"
                                                      name="bed1SingleWeightCacoons"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed1SingleWeightCacoons || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Weight of Single Cocoons")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Cocoons is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightPupa">
                                                    {t("Average Weight of 25 Pupa")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed1WeightPupa"
                                                      name="bed1WeightPupa"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed1WeightPupa || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Average Weight of 25 Pupa")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Pupa is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                               <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightPupa">
                                                    {t("Weight of Single Pupa")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed1SingleWeightPupa"
                                                      name="bed1SingleWeightPupa"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed1SingleWeightPupa || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Weight of Single Pupa")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Pupa is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightShells">
                                                    {t("Average Weight of 25 Shells")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed1WeightShells"
                                                      name="bed1WeightShells"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed1WeightShells || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Average Weight of 25 Shells")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Shells is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightShells">
                                                    {t("Weight of Single Shells")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed1SingleWeightShells"
                                                      name="bed1SingleWeightShells"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed1SingleWeightShells || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Weight of Single Shells")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Shells is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="shellPercentage">
                                                    {t("Shell Percentage")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed1ShellPercentage"
                                                      name="bed1ShellPercentage"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed1ShellPercentage || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Shell Percentage")}
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
                                                  {t("Err")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed1Err"
                                                      name="bed1Err"
                                                      value={cocoonAssesmentDetailsBedWise.bed1Err || ""}
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("ERR")}
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
                                                  <Form.Label htmlFor="cacoonsFormed">
                                                    {t("No of Cocoon's Formed")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed1CacoonsFormed"
                                                      name="bed1CacoonsFormed"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed1CacoonsFormed || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("No of Cocoon's Formed")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      No of Cocoon's Formed is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="wormsBrushed">
                                                    {t("No of Worms Brushed")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed1WormsBrushed"
                                                      name="bed1WormsBrushed"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed1WormsBrushed || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("No of Worms Brushed")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      No of Worms Brushed is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                               <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="err">
                                                  {t("Male Ratio")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed1MaleRatio"
                                                      name="bed1MaleRatio"
                                                      value={cocoonAssesmentDetailsBedWise.bed1MaleRatio || ""}
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Male Ratio")}
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
                                                  <Form.Label htmlFor="err">
                                                  {t("Female Ratio")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed1FemaleRatio"
                                                      name="bed1FemaleRatio"
                                                      value={cocoonAssesmentDetailsBedWise.bed1FemaleRatio || ""}
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Female Ratio")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      ERR is required
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
                                                {/* <Button
                                                  type="button"
                                                  variant="secondary"
                                                  onClick={clear}
                                                >
                                                  Cancel
                                                </Button> */}
                                              </li>
                                            </ul>
                                          </div>
                                            </Card.Body>
                                        </Card>
                                          </Block>
                                         
                                        </Col>
                                      </Row>
                                    </div>
                                  </Row>
                                </Form>
                              </Block>
                    
                              <Block className="mt-4">
                                <Form noValidate validated={validated} onSubmit={postBed2Data}>
                                  <Row className="g-3 ">
                                    <div>
                                      <Row className="g-gs">
                                        <Col lg="12">
                                          <Block>
                                          <Card>
                                          <Card.Header>
                                           {t("Bed 2")}
                                          </Card.Header>
                                          <Card.Body>
                                            <Row className="g-gs">
                                            <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightCacoons">
                                                    {t("Bed Name")}      
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed2Name"
                                                      name="bed2Name"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed2Name || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Bed Name")}
                                                      readOnly
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
                                                  <Form.Label htmlFor="weightCacoons">
                                                    {t("Average Weight of 25 Cocoons")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed2WeightCacoons"
                                                      name="bed2WeightCacoons"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed2WeightCacoons || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Average Weight of 25 Cocoons")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Cocoons is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                                               <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightCacoons">
                                                    {t("Weight of Single Cocoons")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed2SingleWeightCacoons"
                                                      name="bed2SingleWeightCacoons"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed2SingleWeightCacoons || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Weight of Single Cocoons")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Cocoons is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightPupa">
                                                    {t("Average Weight of 25 Pupa")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed2WeightPupa"
                                                      name="bed2WeightPupa"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed2WeightPupa || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Average Weight of 25 Pupa")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Pupa is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightPupa">
                                                    {t(" Weight of Single Pupa")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed2SingleWeightPupa"
                                                      name="bed2SingleWeightPupa"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed2SingleWeightPupa || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Weight of Single Pupa")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Pupa is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightShells">
                                                    {t("Average Weight of 25 Shells")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed2WeightShells"
                                                      name="bed2WeightShells"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed2WeightShells || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Average Weight of 25 Shells")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Shells is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightShells">
                                                    {t("Weight of Single Shells")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed2SingleWeightShells"
                                                      name="bed2SingleWeightShells"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed2SingleWeightShells || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Weight of Single Shells")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Shells is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="shellPercentage">
                                                    {t("Shell Percentage")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed2ShellPercentage"
                                                      name="bed2ShellPercentage"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed2ShellPercentage || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Shell Percentage")}
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
                                                  {t("Err")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed2Err"
                                                      name="bed2Err"
                                                      value={cocoonAssesmentDetailsBedWise.bed2Err || ""}
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("ERR")}
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
                                                  <Form.Label htmlFor="cacoonsFormed">
                                                    {t("No of Cocoon's Formed")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed2CacoonsFormed"
                                                      name="bed2CacoonsFormed"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed2CacoonsFormed || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("No of Cocoon's Formed")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      No of Cocoon's Formed is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="wormsBrushed">
                                                    {t("No of Worms Brushed")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed2WormsBrushed"
                                                      name="bed2WormsBrushed"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed2WormsBrushed || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("No of Worms Brushed")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      No of Worms Brushed is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                                               <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="err">
                                                  {t("Male Ratio")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed2MaleRatio"
                                                      name="bed2MaleRatio"
                                                      value={cocoonAssesmentDetailsBedWise.bed2MaleRatio || ""}
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Male Ratio")}
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
                                                  <Form.Label htmlFor="err">
                                                  {t("Female Ratio")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed2FemaleRatio"
                                                      name="bed2FemaleRatio"
                                                      value={cocoonAssesmentDetailsBedWise.bed2FemaleRatio || ""}
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Female Ratio")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      ERR is required
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
                                                {/* <Button
                                                  type="button"
                                                  variant="secondary"
                                                  onClick={clear}
                                                >
                                                  Cancel
                                                </Button> */}
                                              </li>
                                            </ul>
                                          </div>
                                            </Card.Body>
                                        </Card>
                                       
                                          </Block>
                                        </Col>
                                      </Row>
                                    </div>
                                  </Row>
                                </Form>
                              </Block>
                    
                              <Block className="mt-4">
                                <Form noValidate validated={validated} onSubmit={postBed3Data}>
                                  <Row className="g-3 ">
                                    <div>
                                      <Row className="g-gs">
                                        <Col lg="12">
                                          <Block>
                                          <Card>
                                          <Card.Header>
                                           {t("Bed 3")}
                                          </Card.Header>
                                          <Card.Body>
                                            <Row className="g-gs">
                                            <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightCacoons">
                                                    {t("Bed Name")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed3Name"
                                                      name="bed3Name"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed3Name || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Bed Name")}
                                                      readOnly
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
                                                  <Form.Label htmlFor="weightCacoons">
                                                    {t("Average Weight of 25 Cocoons")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed3WeightCacoons"
                                                      name="bed3WeightCacoons"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed3WeightCacoons || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Average Weight of 25 Cocoons")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Cocoons is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                               <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightCacoons">
                                                    {t("Weight of Single Cocoons")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed3SingleWeightCacoons"
                                                      name="bed3SingleWeightCacoons"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed3SingleWeightCacoons || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Weight of Single Cocoons")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Cocoons is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightPupa">
                                                    {t("Average Weight of 25 Pupa")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed3WeightPupa"
                                                      name="bed3WeightPupa"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed3WeightPupa || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Average Weight of 25 Pupa")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Pupa is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightPupa">
                                                    {t("Weight of Single Pupa")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed3SingleWeightPupa"
                                                      name="bed3SingleWeightPupa"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed3SingleWeightPupa || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Weight of Single Pupa")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Pupa is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightShells">
                                                    {t("Average Weight of 25 Shells")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed3WeightShells"
                                                      name="bed3WeightShells"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed3WeightShells || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Average Weight of 25 Shells")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Shells is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightShells">
                                                    {t("Weight of Single Shells")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed3SingleWeightShells"
                                                      name="bed3SingleWeightShells"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed3SingleWeightShells || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Weight of Single Shells")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Shells is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="shellPercentage">
                                                    {t("Shell Percentage")}        
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed3ShellPercentage"
                                                      name="bed3ShellPercentage"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed3ShellPercentage || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Shell Percentage")}
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
                                                      {t("Err")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed3Err"
                                                      name="bed3Err"
                                                      value={cocoonAssesmentDetailsBedWise.bed3Err || ""}
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("ERR")}
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
                                                  <Form.Label htmlFor="cacoonsFormed">
                                                    {t("No of Cocoon's Formed")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed3CacoonsFormed"
                                                      name="bed3CacoonsFormed"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed3CacoonsFormed || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("No of Cocoon's Formed")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      No of Cocoon's Formed is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="bed3WormsBrushed">
                                                    {t("No of Worms Brushed")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed3WormsBrushed"
                                                      name="bed3WormsBrushed"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed3WormsBrushed || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("No of Worms Brushed")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      No of Worms Brushed is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                               <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="err">
                                                  {t("Male Ratio")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed3MaleRatio"
                                                      name="bed3MaleRatio"
                                                      value={cocoonAssesmentDetailsBedWise.bed3MaleRatio || ""}
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Male Ratio")}
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
                                                  <Form.Label htmlFor="err">
                                                  {t("Female Ratio")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed3FemaleRatio"
                                                      name="bed3FemaleRatio"
                                                      value={cocoonAssesmentDetailsBedWise.bed3FemaleRatio || ""}
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Female Ratio")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      ERR is required
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
                                                {/* <Button
                                                  type="button"
                                                  variant="secondary"
                                                  onClick={clear}
                                                >
                                                  Cancel
                                                </Button> */}
                                              </li>
                                            </ul>
                                          </div>
                                            </Card.Body>
                                        </Card>
                                          </Block>
                                         
                                        </Col>
                                      </Row>
                                    </div>
                                  </Row>
                                </Form>
                              </Block>
                    
                              <Block className="mt-4">
                                <Form noValidate validated={validated} onSubmit={postBed4Data}>
                                  <Row className="g-3 ">
                                    <div>
                                      <Row className="g-gs">
                                        <Col lg="12">
                                          <Block>
                                          <Card>
                                          <Card.Header>
                                           {t("Bed 4")}
                                          </Card.Header>
                                          <Card.Body>
                                            <Row className="g-gs">
                                            <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightCacoons">
                                                    {t("Bed Name")}       
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed4Name"
                                                      name="bed4Name"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed4Name || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Bed Name")}
                                                      readOnly
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
                                                  <Form.Label htmlFor="weightCacoons">
                                                    {t("Average Weight of 25 Cocoons")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed4WeightCacoons"
                                                      name="bed4WeightCacoons"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed4WeightCacoons || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Average Weight of 25 Cocoons")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Cocoons is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightCacoons">
                                                    {t("Weight of Single Cocoons")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed4SingleWeightCacoons"
                                                      name="bed4SingleWeightCacoons"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed4SingleWeightCacoons || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Weight of Single Cocoons")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Cocoons is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                                              
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightPupa">
                                                    {t("Average Weight of 25 Pupa")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed4WeightPupa"
                                                      name="bed4WeightPupa"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed4WeightPupa || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Average Weight of 25 Pupa")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Pupa is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightPupa">
                                                    {t("Weight of Single Pupa")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed4SingleWeightPupa"
                                                      name="bed4SingleWeightPupa"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed4SingleWeightPupa || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Weight of Single Pupa")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Pupa is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightShells">
                                                    {t("Average Weight of 25 Shells")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed4WeightShells"
                                                      name="bed4WeightShells"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed4WeightShells || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Average Weight of 25 Shells")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Shells is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                               <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightShells">
                                                    {t("Weight of Single Shells")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed4SingleWeightShells"
                                                      name="bed4SingleWeightShells"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed4SingleWeightShells || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Weight of Single Shells")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Shells is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="shellPercentage">
                                                    {t("Shell Percentage")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed4ShellPercentage"
                                                      name="bed4ShellPercentage"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed4ShellPercentage || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Shell Percentage")}
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
                                                  {t("Err")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed4Err"
                                                      name="bed4Err"
                                                      value={cocoonAssesmentDetailsBedWise.bed4Err || ""}
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("ERR")}
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
                                                  <Form.Label htmlFor="cacoonsFormed">
                                                    {t("No of Cocoon's Formed")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed4CacoonsFormed"
                                                      name="bed4CacoonsFormed"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed4CacoonsFormed || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("No of Cocoon's Formed")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      No of Cocoon's Formed is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="wormsBrushed">
                                                    {t("No of Worms Brushed")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed4WormsBrushed"
                                                      name="bed4WormsBrushed"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed4WormsBrushed || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("No of Worms Brushed")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      No of Worms Brushed is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                               <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="err">
                                                  {t("Male Ratio")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed4MaleRatio"
                                                      name="bed4MaleRatio"
                                                      value={cocoonAssesmentDetailsBedWise.bed4MaleRatio || ""}
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Male Ratio")}
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
                                                  <Form.Label htmlFor="err">
                                                  {t("Female Ratio")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed4FemaleRatio"
                                                      name="bed4FemaleRatio"
                                                      value={cocoonAssesmentDetailsBedWise.bed4FemaleRatio || ""}
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Female Ratio")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      ERR is required
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
                                                {/* <Button
                                                  type="button"
                                                  variant="secondary"
                                                  onClick={clear}
                                                >
                                                  Cancel
                                                </Button> */}
                                              </li>
                                            </ul>
                                          </div>
                                            </Card.Body>
                                        </Card>
                                          </Block>
                                          
                                        </Col>
                                      </Row>
                                    </div>
                                  </Row>
                                </Form>
                              </Block>
                    
                              <Block className="mt-4">
                                <Form noValidate validated={validated} onSubmit={postBed5Data}>
                                  <Row className="g-3 ">
                                    <div>
                                      <Row className="g-gs">
                                        <Col lg="12">
                                          <Block>
                                          <Card>
                                          <Card.Header>
                                           {t("Bed 5")}
                                          </Card.Header>
                                          <Card.Body>
                                            <Row className="g-gs">
                                            <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightCacoons">
                                                    {t("Bed Name")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed5Name"
                                                      name="bed5Name"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed5Name || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Bed Name")}
                                                      readOnly
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
                                                  <Form.Label htmlFor="weightCacoons">
                                                    {t("Average Weight of 25 Cocoons")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed5WeightCacoons"
                                                      name="bed5WeightCacoons"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed5WeightCacoons || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Average Weight of 25 Cocoons")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Cocoons is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightCacoons">
                                                    {t("Weight of Single Cocoons")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed5SingleWeightCacoons"
                                                      name="bed5SingleWeightCacoons"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed5SingleWeightCacoons || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Weight of Single Cocoons")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Cocoons is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightPupa">
                                                    {t("Average Weight of 25 Pupa")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed5WeightPupa"
                                                      name="bed5WeightPupa"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed5WeightPupa || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Average Weight of 25 Pupa")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Pupa is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightPupa">
                                                    {t("Weight of Single Pupa")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed5SingleWeightPupa"
                                                      name="bed5SingleWeightPupa"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed5SingleWeightPupa || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Weight of Single Pupa")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Pupa is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightShells">
                                                    {t("Average Weight of 25 Shells")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed5WeightShells"
                                                      name="bed5WeightShells"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed5WeightShells || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Average Weight of 25 Shells")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Shells is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                               <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="weightShells">
                                                    {t("Weight of Single Shells")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed5SingleWeightShells"
                                                      name="bed5SingleWeightShells"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed5SingleWeightShells || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Weight of Single Shells")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      Average Weight of 25 Shells is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="bed5ShellPercentage">
                                                    {t("Shell Percentage")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed5ShellPercentage"
                                                      name="bed5ShellPercentage"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed5ShellPercentage || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Shell Percentage")}
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
                                                  {t("Err")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed5Err"
                                                      name="bed5Err"
                                                      value={cocoonAssesmentDetailsBedWise.bed5Err || ""}
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("ERR")}
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
                                                  <Form.Label htmlFor="bed5CacoonsFormed">
                                                    {t("No of Cocoon's Formed")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed5CacoonsFormed"
                                                      name="bed5CacoonsFormed"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed5CacoonsFormed || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("No of Cocoon's Formed")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      No of Cocoon's Formed is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="wormsBrushed">
                                                    {t("No of Worms Brushed")}
                            
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed5WormsBrushed"
                                                      name="bed5WormsBrushed"
                                                      value={
                                                        cocoonAssesmentDetailsBedWise.bed5WormsBrushed || ""
                                                      }
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("No of Worms Brushed")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      No of Worms Brushed is required
                                                    </Form.Control.Feedback> */}
                                                  </div>
                                                </Form.Group>
                                              </Col>
                    
                                              <Col lg="4">
                                                <Form.Group className="form-group mt-n3">
                                                  <Form.Label htmlFor="err">
                                                  {t("Male Ratio")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed5MaleRatio"
                                                      name="bed5MaleRatio"
                                                      value={cocoonAssesmentDetailsBedWise.bed5MaleRatio || ""}
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Male Ratio")}
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
                                                  <Form.Label htmlFor="err">
                                                  {t("Female Ratio")}
                                                  </Form.Label>
                                                  <div className="form-control-wrap">
                                                    <Form.Control
                                                      id="bed5FemaleRatio"
                                                      name="bed5FemaleRatio"
                                                      value={cocoonAssesmentDetailsBedWise.bed5FemaleRatio || ""}
                                                      onChange={handleInputs}
                                                      type="text"
                                                      placeholder={t("Female Ratio")}
                                                      // required
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid">
                                                      ERR is required
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
                                                {/* <Button
                                                  type="button"
                                                  variant="secondary"
                                                  onClick={clear}
                                                >
                                                  Cancel
                                                </Button> */}
                                              </li>
                                            </ul>
                                          </div>
                                            </Card.Body>
                                        </Card>
                                        
                                          </Block>
                    
                                          
                                        </Col>
                                      </Row>
                                    </div>
                                  </Row>
                                </Form>
                              </Block>
                            </Modal.Body>
                          </Modal>
                    
                          <Modal show={showModal1} onHide={handleCloseModal1} size="xl" className="sh-modal">
                            <Modal.Header closeButton className="sh-modal-header">
                              <Modal.Title>
                                <Icon name="eye" />
                                <span>{t("View")}</span>
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              {loading ? (
                                <h1 className="d-flex justify-content-center align-items-center">
                                  {t("Loading...")}
                                </h1>
                              ) : (
                                <>
                                <Card className="mt-3">
                                <Card.Header>
                                  {t("Bed 1")}
                                </Card.Header>
                                <Card.Body>
                                <Row className="g-gs">
                                  <Col lg="12">
                                    <table className="table small table-bordered">
                                      <tbody>
                                      <tr>
                                          <td style={styles.ctstyle}>{t("Bed Name")}:</td>
                                          <td>{viewDetailsData.bed1Name}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Average Weight of 25 Cocoons")}:</td>
                                          <td>{viewDetailsData.bed1WeightCacoons}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Weight of Single Cocoons")}:</td>
                                          <td>{viewDetailsData.bed1SingleWeightCacoons}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}> {t("Average Weight of 25 Pupa")}:</td>
                                          <td>{viewDetailsData.bed1WeightPupa}</td>
                                        </tr>
                                         <tr>
                                          <td style={styles.ctstyle}> {t("Weight of Single Pupa")}:</td>
                                          <td>{viewDetailsData.bed1SingleWeightPupa}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Average Weight of 25 Shells")}:</td>
                                          <td>{viewDetailsData.bed1WeightShells}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Weight of Single Shells")}:</td>
                                          <td>{viewDetailsData.bed1SingleWeightShells}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Shell Percentage")}</td>
                                          <td>{viewDetailsData.bed1ShellPercentage}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("ERR")}</td>
                                          <td>{viewDetailsData.bed1Err}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("No of Worms Brushed")}:</td>
                                          <td>{viewDetailsData.bed1CacoonsFormed}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("No of Cocoon's Formed")}:</td>
                                          <td>{viewDetailsData.bed1WormsBrushed}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Male Ratio")}:</td>
                                          <td>{viewDetailsData.bed1MaleRatio}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Female Ratio")}:</td>
                                          <td>{viewDetailsData.bed1FemaleRatio}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </Col>
                                </Row>
                                </Card.Body>
                                </Card>
                    
                                <Card className="mt-3">
                                <Card.Header>
                                  {t("Bed 2")}
                                </Card.Header>
                                <Card.Body>
                                <Row className="g-gs">
                                  <Col lg="12">
                                    <table className="table small table-bordered">
                                      <tbody>
                                      <tr>
                                          <td style={styles.ctstyle}>{t("Bed Name")}:</td>
                                          <td>{viewDetailsData.bed2Name}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Average Weight of 25 Cocoons")}:</td>
                                          <td>{viewDetailsData.bed2WeightCacoons}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Weight of Single Cocoons")}:</td>
                                          <td>{viewDetailsData.bed2SingleWeightCacoons}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}> {t("Average Weight of 25 Pupa")}:</td>
                                          <td>{viewDetailsData.bed2WeightPupa}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}> {t("Weight of Single Pupa")}:</td>
                                          <td>{viewDetailsData.bed2SingleWeightPupa}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Average Weight of 25 Shells")}:</td>
                                          <td>{viewDetailsData.bed2WeightShells}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Weight of Single Shells")}:</td>
                                          <td>{viewDetailsData.bed2SingleWeightShells}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Shell Percentage")}</td>
                                          <td>{viewDetailsData.bed2ShellPercentage}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("ERR")}</td>
                                          <td>{viewDetailsData.bed2Err}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("No of Worms Brushed")}:</td>
                                          <td>{viewDetailsData.bed2WormsBrushed}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("No of Cocoon's Formed")}:</td>
                                          <td>{viewDetailsData.bed2CacoonsFormed}</td>
                                        </tr>
                                         <tr>
                                          <td style={styles.ctstyle}>{t("Male Ratio")}:</td>
                                          <td>{viewDetailsData.bed2MaleRatio}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Female Ratio")}:</td>
                                          <td>{viewDetailsData.bed2FemaleRatio}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </Col>
                                </Row>
                                </Card.Body>
                                </Card>
                    
                                <Card className="mt-3">
                                <Card.Header>
                                  {t("Bed 3")}
                                </Card.Header>
                                <Card.Body>
                                <Row className="g-gs">
                                  <Col lg="12">
                                    <table className="table small table-bordered">
                                      <tbody>
                                      <tr>
                                          <td style={styles.ctstyle}>{t("Bed Name")}:</td>
                                          <td>{viewDetailsData.bed3Name}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Average Weight of 25 Cocoons")}:</td>
                                          <td>{viewDetailsData.bed3WeightCacoons}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Weight of Single Cocoons")}:</td>
                                          <td>{viewDetailsData.bed3SingleWeightCacoons}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}> {t("Average Weight of 25 Pupa")}:</td>
                                          <td>{viewDetailsData.bed3WeightPupa}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}> {t("Weight of Single Pupa")}:</td>
                                          <td>{viewDetailsData.bed3SingleWeightPupa}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Average Weight of 25 Shells")}:</td>
                                          <td>{viewDetailsData.bed3WeightShells}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Weight of Single Shells")}:</td>
                                          <td>{viewDetailsData.bed3SingleWeightShells}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Shell Percentage")}</td>
                                          <td>{viewDetailsData.bed3ShellPercentage}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("ERR")}</td>
                                          <td>{viewDetailsData.bed3Err}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("No of Worms Brushed")}:</td>
                                          <td>{viewDetailsData.bed3WormsBrushed}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("No of Cocoon's Formed")}:</td>
                                          <td>{viewDetailsData.bed3CacoonsFormed}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Male Ratio")}:</td>
                                          <td>{viewDetailsData.bed3MaleRatio}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Female Ratio")}:</td>
                                          <td>{viewDetailsData.bed3FemaleRatio}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </Col>
                                </Row>
                                </Card.Body>
                                </Card>
                    
                                <Card className="mt-3">
                                <Card.Header>
                                  {t("Bed 4")}
                                </Card.Header>
                                <Card.Body>
                                <Row className="g-gs">
                                  <Col lg="12">
                                    <table className="table small table-bordered">
                                      <tbody>
                                      <tr>
                                          <td style={styles.ctstyle}>{t("Bed Name")}:</td>
                                          <td>{viewDetailsData.bed4Name}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Average Weight of 25 Cocoons")}:</td>
                                          <td>{viewDetailsData.bed4WeightCacoons}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Weight of Single Cocoons")}:</td>
                                          <td>{viewDetailsData.bed4SingleWeightCacoons}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}> {t("Average Weight of 25 Pupa")}:</td>
                                          <td>{viewDetailsData.bed4WeightPupa}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}> {t("Weight of Single Pupa")}:</td>
                                          <td>{viewDetailsData.bed4SingleWeightPupa}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Average Weight of 25 Shells")}:</td>
                                          <td>{viewDetailsData.bed4WeightShells}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Weight of Single Shells")}:</td>
                                          <td>{viewDetailsData.bed4SingleWeightShells}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Shell Percentage")}</td>
                                          <td>{viewDetailsData.bed4ShellPercentage}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("ERR")}</td>
                                          <td>{viewDetailsData.bed4Err}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("No of Worms Brushed")}:</td>
                                          <td>{viewDetailsData.bed4WormsBrushed}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("No of Cocoon's Formed")}:</td>
                                          <td>{viewDetailsData.bed4CacoonsFormed}</td>
                                        </tr>
                                         <tr>
                                          <td style={styles.ctstyle}>{t("Male Ratio")}:</td>
                                          <td>{viewDetailsData.bed4MaleRatio}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Female Ratio")}:</td>
                                          <td>{viewDetailsData.bed4FemaleRatio}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </Col>
                                </Row>
                                </Card.Body>
                                </Card>
                    
                                <Card className="mt-3">
                                <Card.Header>
                                  {t("Bed 5")}
                                </Card.Header>
                                <Card.Body>
                                <Row className="g-gs">
                                  <Col lg="12">
                                    <table className="table small table-bordered">
                                      <tbody>
                                      <tr>
                                          <td style={styles.ctstyle}>{t("Bed Name")}:</td>
                                          <td>{viewDetailsData.bed5Name}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Average Weight of 25 Cocoons")}:</td>
                                          <td>{viewDetailsData.bed5WeightCacoons}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Weight of Single Cocoons")}:</td>
                                          <td>{viewDetailsData.bed5SingleWeightCacoons}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}> {t("Average Weight of 25 Pupa")}:</td>
                                          <td>{viewDetailsData.bed5WeightPupa}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}> {t("Weight of Single Pupa")}:</td>
                                          <td>{viewDetailsData.bed5SingleWeightPupa}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Average Weight of 25 Shells")}:</td>
                                          <td>{viewDetailsData.bed5WeightShells}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Weight of Single Shells")}:</td>
                                          <td>{viewDetailsData.bed5SingleWeightShells}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Shell Percentage")}</td>
                                          <td>{viewDetailsData.bed5ShellPercentage}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("ERR")}</td>
                                          <td>{viewDetailsData.bed5Err}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("No of Worms Brushed")}:</td>
                                          <td>{viewDetailsData.bed5WormsBrushed}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("No of Cocoon's Formed")}:</td>
                                          <td>{viewDetailsData.bed5CacoonsFormed}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Male Ratio")}:</td>
                                          <td>{viewDetailsData.bed5MaleRatio}</td>
                                        </tr>
                                        <tr>
                                          <td style={styles.ctstyle}>{t("Female Ratio")}:</td>
                                          <td>{viewDetailsData.bed5FemaleRatio}</td>
                                        </tr> 
                                      </tbody>
                                    </table>
                                  </Col>
                                </Row>
                                </Card.Body>
                                </Card>
                                </>
                              )}
                            </Modal.Body>
                          </Modal>
    </Layout>
  );
}

const rearingOfDFLsListStyles = `
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

export default RearingOfDFLsList;
