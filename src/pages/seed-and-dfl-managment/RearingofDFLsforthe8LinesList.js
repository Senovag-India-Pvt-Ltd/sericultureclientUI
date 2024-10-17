import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
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
import { format } from "date-fns";

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function RearingofDFLsforthe8LinesList() {
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

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseModal1 = () => setShowModal1(false);

  const [validated, setValidated] = useState(false);

  const getList = () => {
    setLoading(true);

    const response = api
      .get(baseURLSeedDfl + `8linesController/get-info`)
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

  const [cocoonAssesmentDetails, setCocoonAssesmentDetails] = useState({
    id: "",
    weightCacoons: 0,
    weightPupa: 0,
    weightShells: 0,
    shellPercentage: 0,
    err: 0,
    cacoonsFormed: 0,
    wormsBrushed: 0,
  });

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
    bed2Id: "",
    bed2Name: "",
    bed2WeightCacoons: "",
    bed2WeightPupa: "",
    bed2WeightShells: "",
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
    bed4Id: "",
    bed4Name: "",
    bed4WeightCacoons: "",
    bed4WeightPupa: "",
    bed4WeightShells: "",
    bed4ShellPercentage: "",
    bed4Err:"",
    bed4CacoonsFormed: "",
    bed4WormsBrushed: "",
    bed5Id: "",
    bed5Name: "",
    bed5WeightCacoons: "",
    bed5WeightPupa: "",
    bed5WeightShells: "",
    bed5ShellPercentage: "",
    bed5Err:"",
    bed5CacoonsFormed: "",
    bed5WormsBrushed: "",
  });

  const clear = () => {
    setCocoonAssesmentDetails((prev) => ({
      ...prev,
      weightCacoons: "",
      weightPupa: "",
      weightShells: "",
      shellPercentage: "",
      err: "",
      cacoonsFormed: "",
      wormsBrushed: "",
    }));
    setValidated(false);
    handleCloseModal();
  };

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
        shellPercentage:cocoonAssesmentDetailsBedWise.bed1ShellPercentage,
        err: cocoonAssesmentDetailsBedWise.bed1Err,
        cacoonsFormed: cocoonAssesmentDetailsBedWise.bed1CacoonsFormed,
        wormsBrushed: cocoonAssesmentDetailsBedWise.bed1WormsBrushed, 
      };
      api
        .post(
          baseURLSeedDfl + `8linesController/update-cacoon-assesment-data-by-id`,
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
        err: cocoonAssesmentDetailsBedWise.bed2Err,
        cacoonsFormed: cocoonAssesmentDetailsBedWise.bed2CacoonsFormed,
        wormsBrushed: cocoonAssesmentDetailsBedWise.bed2WormsBrushed, 
      };
      api
        .post(
          baseURLSeedDfl + `8linesController/update-cacoon-assesment-data-by-id`,
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
        shellPercentage:cocoonAssesmentDetailsBedWise.bed3ShellPercentage,
        err: cocoonAssesmentDetailsBedWise.bed3Err,
        cacoonsFormed: cocoonAssesmentDetailsBedWise.bed3CacoonsFormed,
        wormsBrushed: cocoonAssesmentDetailsBedWise.bed3WormsBrushed, 
      };
      api
        .post(
          baseURLSeedDfl + `8linesController/update-cacoon-assesment-data-by-id`,
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
        shellPercentage:cocoonAssesmentDetailsBedWise.bed4ShellPercentage,
        err: cocoonAssesmentDetailsBedWise.bed4Err,
        cacoonsFormed: cocoonAssesmentDetailsBedWise.bed4CacoonsFormed,
        wormsBrushed: cocoonAssesmentDetailsBedWise.bed4WormsBrushed, 
      };
      api
        .post(
          baseURLSeedDfl + `8linesController/update-cacoon-assesment-data-by-id`,
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
        shellPercentage:cocoonAssesmentDetailsBedWise.bed5ShellPercentage,
        err: cocoonAssesmentDetailsBedWise.bed5Err,
        cacoonsFormed: cocoonAssesmentDetailsBedWise.bed5CacoonsFormed,
        wormsBrushed: cocoonAssesmentDetailsBedWise.bed5WormsBrushed, 
      };
      api
        .post(
          baseURLSeedDfl + `8linesController/update-cacoon-assesment-data-by-id`,
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
    bed2Id: "",
    bed2Name: "",
    bed2WeightCacoons: "",
    bed2WeightPupa: "",
    bed2WeightShells: "",
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
    bed4Id: "",
    bed4Name: "",
    bed4WeightCacoons: "",
    bed4WeightPupa: "",
    bed4WeightShells: "",
    bed4ShellPercentage: "",
    bed4Err:"",
    bed4CacoonsFormed: "",
    bed4WormsBrushed: "",
    bed5Id: "",
    bed5Name: "",
    bed5WeightCacoons: "",
    bed5WeightPupa: "",
    bed5WeightShells: "",
    bed5ShellPercentage: "",
    bed5Err:"",
    bed5CacoonsFormed: "",
    bed5WormsBrushed: "",
  });

  const viewDetails = (_id) => {
    handleShowModal1();
    api
      .get(baseURLSeedDfl + `8linesController/get-cacoon-assesment-data-by-id/${_id}`)
      .then((response) => {
        const data = response.data;
        setViewDetailsData({
          bed1Id: data[0]?.id || "",
          bed1Name: data[0]?.bedName || "",
          bed1WeightCacoons: data[0]?.weightCacoons || "",
          bed1WeightPupa: data[0]?.weightPupa || "",
          bed1WeightShells: data[0]?.weightShells || "",
          bed1ShellPercentage: data[0]?.shellPercentage || "",
          bed1Err: data[0]?.err || "",
          bed1CacoonsFormed: data[0]?.cacoonsFormed || "",
          bed1WormsBrushed: data[0]?.wormsBrushed || "",
          bed2Id: data[1]?.id || "",
          bed2Name: data[1]?.bedName || "",
          bed2WeightCacoons: data[1]?.weightCacoons || "",
          bed2WeightPupa: data[1]?.weightPupa || "",
          bed2WeightShells: data[1]?.weightShells || "",
          bed2ShellPercentage: data[1]?.shellPercentage || "",
          bed2Err: data[1]?.err || "",
          bed2CacoonsFormed: data[1]?.cacoonsFormed || "",
          bed2WormsBrushed: data[1]?.wormsBrushed || "",
          bed3Id: data[2]?.id || "",
          bed3Name: data[2]?.bedName || "",
          bed3WeightCacoons: data[2]?.weightCacoons || "",
          bed3WeightPupa: data[2]?.weightPupa || "",
          bed3WeightShells: data[2]?.weightShells || "",
          bed3ShellPercentage: data[2]?.shellPercentage || "",
          bed3Err: data[2]?.err || "",
          bed3CacoonsFormed: data[2]?.cacoonsFormed || "",
          bed3WormsBrushed: data[2]?.wormsBrushed || "",
          bed4Id: data[3]?.id || "",
          bed4Name: data[3]?.bedName || "",
          bed4WeightCacoons: data[3]?.weightCacoons || "",
          bed4WeightPupa: data[3]?.weightPupa || "",
          bed4WeightShells: data[3]?.weightShells || "",
          bed4ShellPercentage: data[3]?.shellPercentage || "",
          bed4Err: data[3]?.err || "",
          bed4CacoonsFormed: data[3]?.cacoonsFormed || "",
          bed4WormsBrushed: data[3]?.wormsBrushed || "",
          bed5Id: data[4]?.id || "",
          bed5Name: data[4]?.bedName || "",
          bed5WeightCacoons: data[4]?.weightCacoons || "",
          bed5WeightPupa: data[4]?.weightPupa || "",
          bed5WeightShells: data[4]?.weightShells || "",
          bed5ShellPercentage: data[4]?.shellPercentage || "",
          bed5Err: data[4]?.err || "",
          bed5CacoonsFormed: data[4]?.cacoonsFormed || "",
          bed5WormsBrushed: data[4]?.wormsBrushed || "",
        });
  
        // setViewDetailsData(response.data);

        setLoading(false);
      })
      .catch((err) => {
        setViewDetailsData({});
        setLoading(false);
      });
  };

  const [showModal3, setShowModal3] = useState(false);

  // const handleShowModal3 = () => setShowModal3(true);
  const handleShowModal3 = (row) => {
    setFeedingMoultTable({ ...feedingTableDetails, rearingOfDFLsForThe8linesId: row.id });
    setShowModal3(true); 
  };
  
  const handleCloseModal3 = () => setShowModal3(false);




  const [feedingTableDetails, setFeedingMoultTable] = useState({
    rearingOfDFLsForThe8linesId: "",
    lotNumber: "",
    hatchingDate: "",
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
      const sendPost = {
        rearingOfDFLsForThe8linesId: feedingTableDetails.rearingOfDFLsForThe8linesId,
        lotNumber: feedingTableDetails.lotNumber,
        hatchingDate: feedingTableDetails.hatchingDate,
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

  const [showModal4, setShowModal4] = useState(false);
  const handleShowModal4 = () => setShowModal4(true); 
  const handleCloseModal4 = () => setShowModal4(false);

  const [listMoultData, setMoultListData] = useState({});

  const getMoultList = () => {
    setLoading(true);
  
    api
      .get(baseURLSeedDfl + `FeedingAndMoultTest/get-info`)
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
         
    //     </div>
    //   ),
    //   sortable: false,
    //   hide: "md",
    //   // grow: 2,
    // },
    {
      name: "Lot Number",
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Crop Details",
    //   selector: (row) => row.cropDetail,
    //   cell: (row) => <span>{row.cropDetail}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Hatching Date",
      selector: (row) => row.hatchingDate,
      cell: (row) => <span>{row.hatchingDate}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "First Feeding",
      selector: (row) => row.firstFeeding,
      cell: (row) => <span>{row.firstFeeding}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Second Feeding",
      selector: (row) => row.secondFeeding,
      cell: (row) => <span>{row.secondFeeding}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Third Feeding",
      selector: (row) => row.thirdFeeding,
      cell: (row) => <span>{row.thirdFeeding}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Leaf Quantity",
      selector: (row) => row.leafQuantity,
      cell: (row) => <span>{row.leafQuantity}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Worm Stage",
      selector: (row) => row.wormStage,
      cell: (row) => <span>{row.wormStage}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Temperature",
      selector: (row) => row.temperature,
      cell: (row) => <span>{row.temperature}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Humidity",
      selector: (row) => row.humidity,
      cell: (row) => <span>{row.humidity}</span>,
      sortable: true,
      hide: "md",
    },

  ];


  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/Rearing-of-DFLs-for-the-8-Lines-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/Rearing-of-DFLs-for-the-8-Lines-edit/${_id}`);
    // navigate("/seriui/training Schedule");
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
          .delete(baseURLSeedDfl + `8linesController/delete-info/${_id}`)
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  };

  // const getCocoonList = (_id) => {
  //   setLoading(true);
  //   handleShowModal();

  //   api
  //     .get(
  //       baseURLSeedDfl +
  //         `8linesController/get-cacoon-assesment-data-by-id/${_id}`
  //     )
  //     .then((response) => {
  //       // console.log(response.data)
  //       setCocoonAssesmentDetails(response.data);
  //       // setTotalRows(response.data.content.totalItems);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       // setListData({});
  //       setLoading(false);
  //     });
  // };

  const getCocoonList = (_id) => {
    setLoading(true);
    handleShowModal();
  
    api
      .get(
        baseURLSeedDfl + `8linesController/get-cacoon-assesment-data-by-id/${_id}`
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
          bed1ShellPercentage: data[0]?.shellPercentage || "",
          bed1Err: data[0]?.err || "",
          bed1CacoonsFormed: data[0]?.cacoonsFormed || "",
          bed1WormsBrushed: data[0]?.wormsBrushed || "",
          bed2Id: data[1]?.id || "",
          bed2Name: data[1]?.bedName || "",
          bed2WeightCacoons: data[1]?.weightCacoons || "",
          bed2WeightPupa: data[1]?.weightPupa || "",
          bed2WeightShells: data[1]?.weightShells || "",
          bed2ShellPercentage: data[1]?.shellPercentage || "",
          bed2Err: data[1]?.err || "",
          bed2CacoonsFormed: data[1]?.cacoonsFormed || "",
          bed2WormsBrushed: data[1]?.wormsBrushed || "",
          bed3Id: data[2]?.id || "",
          bed3Name: data[2]?.bedName || "",
          bed3WeightCacoons: data[2]?.weightCacoons || "",
          bed3WeightPupa: data[2]?.weightPupa || "",
          bed3WeightShells: data[2]?.weightShells || "",
          bed3ShellPercentage: data[2]?.shellPercentage || "",
          bed3Err: data[2]?.err || "",
          bed3CacoonsFormed: data[2]?.cacoonsFormed || "",
          bed3WormsBrushed: data[2]?.wormsBrushed || "",
          bed4Id: data[3]?.id || "",
          bed4Name: data[3]?.bedName || "",
          bed4WeightCacoons: data[3]?.weightCacoons || "",
          bed4WeightPupa: data[3]?.weightPupa || "",
          bed4WeightShells: data[3]?.weightShells || "",
          bed4ShellPercentage: data[3]?.shellPercentage || "",
          bed4Err: data[3]?.err || "",
          bed4CacoonsFormed: data[3]?.cacoonsFormed || "",
          bed4WormsBrushed: data[3]?.wormsBrushed || "",
          bed5Id: data[4]?.id || "",
          bed5Name: data[4]?.bedName || "",
          bed5WeightCacoons: data[4]?.weightCacoons || "",
          bed5WeightPupa: data[4]?.weightPupa || "",
          bed5WeightShells: data[4]?.weightShells || "",
          bed5ShellPercentage: data[4]?.shellPercentage || "",
          bed5Err: data[4]?.err || "",
          bed5CacoonsFormed: data[4]?.cacoonsFormed || "",
          bed5WormsBrushed: data[4]?.wormsBrushed || "",
        });
  
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  

  const RearingOfDFLSForThe8LinesDataColumns = [
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
            variant="danger"
            size="sm"
            onClick={() => handleShowModal3(row)}
            className="ms-2"
          >
            Add Moult Table
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2,
    },
    {
      name: "Disinfectant Usage Details",
      selector: (row) => row.disinfectantMasterName,
      cell: (row) => <span>{row.disinfectantMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Crop Details",
    //   selector: (row) => row.cropDetail,
    //   cell: (row) => <span>{row.cropDetail}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Crop Number",
      selector: (row) => row.cropNumber,
      cell: (row) => <span>{row.cropNumber}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Lot Number",
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Number Of DFLs",
      selector: (row) => row.numberOfDFLs,
      cell: (row) => <span>{row.numberOfDFLs}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Laid On Date",
      selector: (row) => row.laidOnDate,
      cell: (row) => <span>{formatDate(row.laidOnDate)}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Cold Storage Details",
      selector: (row) => row.coldStorageDetails,
      cell: (row) => <span>{row.coldStorageDetails}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Released On",
      selector: (row) => row.releasedOnDate,
      cell: (row) => <span>{formatDate(row.releasedOnDate)}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Chawki Percentage",
      selector: (row) => row.chawkiPercentage,
      cell: (row) => <span>{row.chawkiPercentage}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Worm Weight In Grams",
      selector: (row) => row.wormWeightInGrams,
      cell: (row) => <span>{row.wormWeightInGrams}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Spun On Date",
      selector: (row) => row.spunOnDate,
      cell: (row) => <span>{formatDate(row.spunOnDate)}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Worm Test results",
      selector: (row) => row.wormTestDatesAndResults,
      cell: (row) => <span>{row.wormTestDatesAndResults}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Crop Failure Details",
      selector: (row) => row.cropFailureDetails,
      cell: (row) => <span>{row.cropFailureDetails}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Cocoon Assesment Details",
      cell: (row) => (
        <Button
          className="d-flex justify-content-center"
          variant="primary"
          size="sm"
          onClick={() => getCocoonList(row.id)}
        >
          Show
        </Button>
      ),
      sortable: true,
      hide: "md",
    },
    {
      name: "View Cocoon Assesment Details",
      cell: (row) => (
        <Button
          className="d-flex justify-content-center"
          variant="primary"
          size="sm"
          onClick={() => viewDetails(row.id)}
        >
          View
        </Button>
      ),
      sortable: true,
      hide: "md",
    },
  ];
  return (
    <Layout title="Rearing of DFLs for the 8 lines List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Rearing of DFLs for the 8 lines List
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
          <ul className="d-flex">
            <li>
              <Link
                to="/seriui/Rearing-of-DFLs-for-the-8-Lines"
                className="btn btn-primary btn-md d-md-none"
              >
                <Icon name="plus" />
                <span>Create</span>
              </Link>
            </li>
            <li>
              <Link
                to="/seriui/Rearing-of-DFLs-for-the-8-Lines"
                className="btn btn-primary d-none d-md-inline-flex"
              >
                <Icon name="plus" />
                <span>Create</span>
              </Link>
            </li>
            <li>
              <Button
                variant="danger"
                size="sm"
                onClick={() => getMoultList()}
                className="ms-2"
              >
                Moult Table List
              </Button>
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
            columns={RearingOfDFLSForThe8LinesDataColumns}
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

      <Modal show={showModal4} onHide={handleCloseModal4} size="xl">
  <Modal.Header closeButton>
    <Modal.Title>Feeding and Moult Test</Modal.Title>
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
      Close
    </Button>
  </Modal.Footer>
</Modal>



      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Cocoon Assesment Details</Modal.Title>
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
                       Bed 1
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                Bed Name
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
                                  placeholder="Bed Name"
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
                                Average Weight of 25 Cocoons
        
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
                                  placeholder="Average Weight of 25 Cocoons"
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
                                Average Weight of 25 Pupa
        
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
                                  placeholder="Average Weight of 25 Pupa"
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
                                Average Weight of 25 Shells
        
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
                                  placeholder="Average Weight of 25 Shells"
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
                                Shell Percentage
        
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
                                  placeholder="Shell Percentage"
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
                              Err
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1Err"
                                  name="bed1Err"
                                  value={cocoonAssesmentDetailsBedWise.bed1Err || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="ERR"
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
                                No of Cocoon's Formed
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
                                  placeholder="No of Cocoon's Formed"
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
                                No of Worms Brushed
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
                                  placeholder="No of Worms Brushed"
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Worms Brushed is required
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
                              Update
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
                       Bed 2
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                Bed Name      
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
                                  placeholder="Bed Name"
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
                                Average Weight of 25 Cocoons
        
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
                                  placeholder="Average Weight of 25 Cocoons"
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
                                Average Weight of 25 Pupa
        
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
                                  placeholder="Average Weight of 25 Pupa"
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
                                Average Weight of 25 Shells
        
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
                                  placeholder="Average Weight of 25 Shells"
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
                                Shell Percentage
        
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
                                  placeholder="Shell Percentage"
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
                              Err
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2Err"
                                  name="bed2Err"
                                  value={cocoonAssesmentDetailsBedWise.bed2Err || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="ERR"
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
                                No of Cocoon's Formed
        
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
                                  placeholder="No of Cocoon's Formed"
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
                                No of Worms Brushed
        
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
                                  placeholder="No of Worms Brushed"
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Worms Brushed is required
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
                              Update
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
                       Bed 3
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                Bed Name
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
                                  placeholder="Bed Name"
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
                                Average Weight of 25 Cocoons
        
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
                                  placeholder="Average Weight of 25 Cocoons"
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
                                Average Weight of 25 Pupa
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
                                  placeholder="Average Weight of 25 Pupa"
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
                                Average Weight of 25 Shells
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
                                  placeholder="Average Weight of 25 Shells"
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
                                Shell Percentage        
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
                                  placeholder="Shell Percentage"
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
                                  Err
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3Err"
                                  name="bed3Err"
                                  value={cocoonAssesmentDetailsBedWise.bed3Err || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="ERR"
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
                                No of Cocoon's Formed
        
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
                                  placeholder="No of Cocoon's Formed"
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
                                No of Worms Brushed
        
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
                                  placeholder="No of Worms Brushed"
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Worms Brushed is required
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
                              Update
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
                       Bed 4
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                Bed Name       
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
                                  placeholder="Bed Name"
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
                                Average Weight of 25 Cocoons
        
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
                                  placeholder="Average Weight of 25 Cocoons"
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
                                Average Weight of 25 Pupa
        
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
                                  placeholder="Average Weight of 25 Pupa"
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
                                Average Weight of 25 Shells
        
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
                                  placeholder="Average Weight of 25 Shells"
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
                                Shell Percentage
        
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
                                  placeholder="Shell Percentage"
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
                              Err
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4Err"
                                  name="bed4Err"
                                  value={cocoonAssesmentDetailsBedWise.bed4Err || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="ERR"
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
                                No of Cocoon's Formed
        
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
                                  placeholder="No of Cocoon's Formed"
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
                                No of Worms Brushed
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
                                  placeholder="No of Worms Brushed"
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Worms Brushed is required
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
                              Update
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
                       Bed 5
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                Bed Name
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
                                  placeholder="Bed Name"
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
                                Average Weight of 25 Cocoons
        
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
                                  placeholder="Average Weight of 25 Cocoons"
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
                                Average Weight of 25 Pupa
        
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
                                  placeholder="Average Weight of 25 Pupa"
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
                                Average Weight of 25 Shells
        
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
                                  placeholder="Average Weight of 25 Shells"
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
                                Shell Percentage
        
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
                                  placeholder="Shell Percentage"
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
                              Err
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5Err"
                                  name="bed5Err"
                                  value={cocoonAssesmentDetailsBedWise.bed5Err || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="ERR"
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
                                No of Cocoon's Formed
        
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
                                  placeholder="No of Cocoon's Formed"
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
                                No of Worms Brushed
        
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
                                  placeholder="No of Worms Brushed"
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Worms Brushed is required
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
                              Update
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

      <Modal show={showModal1} onHide={handleCloseModal1} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>View</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <h1 className="d-flex justify-content-center align-items-center">
              Loading...
            </h1>
          ) : (
            <>
            <Card className="mt-3">
            <Card.Header>
              Bed 1
            </Card.Header>
            <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                  <tr>
                      <td style={styles.ctstyle}>Bed Name:</td>
                      <td>{viewDetailsData.bed1Name}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Average Weight of 25 Cocoons:</td>
                      <td>{viewDetailsData.bed1WeightCacoons}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Average Weight of 25 Pupa:</td>
                      <td>{viewDetailsData.bed1WeightPupa}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Average Weight of 25 Shells:</td>
                      <td>{viewDetailsData.bed1WeightShells}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Shell Percentage</td>
                      <td>{viewDetailsData.bed1ShellPercentage}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>ERR</td>
                      <td>{viewDetailsData.bed1Err}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>No of Worms Brushed:</td>
                      <td>{viewDetailsData.bed1CacoonsFormed}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>No of Cocoon's Formed:</td>
                      <td>{viewDetailsData.bed1WormsBrushed}</td>
                    </tr>
                    
                  </tbody>
                </table>
              </Col>
            </Row>
            </Card.Body>
            </Card>

            <Card className="mt-3">
            <Card.Header>
              Bed 2
            </Card.Header>
            <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                  <tr>
                      <td style={styles.ctstyle}>Bed Name:</td>
                      <td>{viewDetailsData.bed2Name}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Average Weight of 25 Cocoons:</td>
                      <td>{viewDetailsData.bed2WeightCacoons}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Average Weight of 25 Pupa:</td>
                      <td>{viewDetailsData.bed2WeightPupa}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Average Weight of 25 Shells:</td>
                      <td>{viewDetailsData.bed2WeightShells}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Shell Percentage</td>
                      <td>{viewDetailsData.bed2ShellPercentage}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>ERR</td>
                      <td>{viewDetailsData.bed2Err}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>No of Worms Brushed:</td>
                      <td>{viewDetailsData.bed2WormsBrushed}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>No of Cocoon's Formed:</td>
                      <td>{viewDetailsData.bed2CacoonsFormed}</td>
                    </tr>
                    
                  </tbody>
                </table>
              </Col>
            </Row>
            </Card.Body>
            </Card>

            <Card className="mt-3">
            <Card.Header>
              Bed 3
            </Card.Header>
            <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                  <tr>
                      <td style={styles.ctstyle}>Bed Name:</td>
                      <td>{viewDetailsData.bed3Name}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Average Weight of 25 Cocoons:</td>
                      <td>{viewDetailsData.bed3WeightCacoons}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Average Weight of 25 Pupa:</td>
                      <td>{viewDetailsData.bed3WeightPupa}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Average Weight of 25 Shells:</td>
                      <td>{viewDetailsData.bed3WeightShells}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Shell Percentage</td>
                      <td>{viewDetailsData.bed3ShellPercentage}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>ERR</td>
                      <td>{viewDetailsData.bed3Err}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>No of Worms Brushed:</td>
                      <td>{viewDetailsData.bed3WormsBrushed}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>No of Cocoon's Formed:</td>
                      <td>{viewDetailsData.bed3CacoonsFormed}</td>
                    </tr>
                    
                  </tbody>
                </table>
              </Col>
            </Row>
            </Card.Body>
            </Card>

            <Card className="mt-3">
            <Card.Header>
              Bed 4
            </Card.Header>
            <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                  <tr>
                      <td style={styles.ctstyle}>Bed Name:</td>
                      <td>{viewDetailsData.bed4Name}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Average Weight of 25 Cocoons:</td>
                      <td>{viewDetailsData.bed4WeightCacoons}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Average Weight of 25 Pupa:</td>
                      <td>{viewDetailsData.bed4WeightPupa}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Average Weight of 25 Shells:</td>
                      <td>{viewDetailsData.bed4WeightShells}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Shell Percentage</td>
                      <td>{viewDetailsData.bed4ShellPercentage}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>ERR</td>
                      <td>{viewDetailsData.bed4Err}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>No of Worms Brushed:</td>
                      <td>{viewDetailsData.bed4WormsBrushed}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>No of Cocoon's Formed:</td>
                      <td>{viewDetailsData.bed4CacoonsFormed}</td>
                    </tr>
                    
                  </tbody>
                </table>
              </Col>
            </Row>
            </Card.Body>
            </Card>

            <Card className="mt-3">
            <Card.Header>
              Bed 5
            </Card.Header>
            <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                  <tr>
                      <td style={styles.ctstyle}>Bed Name:</td>
                      <td>{viewDetailsData.bed5Name}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Average Weight of 25 Cocoons:</td>
                      <td>{viewDetailsData.bed5WeightCacoons}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Average Weight of 25 Pupa:</td>
                      <td>{viewDetailsData.bed5WeightPupa}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Average Weight of 25 Shells:</td>
                      <td>{viewDetailsData.bed5WeightShells}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Shell Percentage</td>
                      <td>{viewDetailsData.bed5ShellPercentage}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>ERR</td>
                      <td>{viewDetailsData.bed5Err}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>No of Worms Brushed:</td>
                      <td>{viewDetailsData.bed5WormsBrushed}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>No of Cocoon's Formed:</td>
                      <td>{viewDetailsData.bed5CacoonsFormed}</td>
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

      <Modal show={showModal3} onHide={handleCloseModal3} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Feeding and Moult Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-4">
            <Form noValidate validated={validated} onSubmit={postFeedingTableData}>
              <Row className="g-3 ">
                <div>
                  <Row className="g-gs">
                    <Col lg="12">
                      <Block>
                      {/* <Card>
                      <Card.Header>
                       Bed 1
                      </Card.Header>
                      <Card.Body> */}
                        <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                Lot Number
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
                                  placeholder="Lot Number"
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
                              <Form.Label htmlFor="sordfl">
                                Hatching Date
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
                              <Form.Label htmlFor="shellPercentage">
                               1st Feeding
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
                                  placeholder="1st Feeding"
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
                               2nd Feeding
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
                                  placeholder="2nd Feeding"
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
                               3rd Feeding
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
                                  placeholder="3rd Feeding"
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
                              Leaf Quantity in Gms/Kg
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="leafQuantity"
                                  name="leafQuantity"
                                  value={feedingTableDetails.leafQuantity || ""}
                                  onChange={handleFeedingMoultInputs}
                                  type="text"
                                  placeholder="Leaf Quantity in Gms/Kg"
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
                              <Form.Label>
                              Worm Stage
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="wormStage"
                                  value={feedingTableDetails.wormStage}
                                  onChange={handleFeedingMoultInputs}
                                  // required
                                  // isInvalid={
                                  //   data.testResults === undefined ||
                                  //   data.testResults === "0"
                                  // }
                                >
                                  <option value="">
                                    Select Worm Stage
                                  </option>
                                  <option value="Hatching">Hatching</option>
                                  <option value="1st Moult">1st Moult</option>
                                  <option value="2nd Moult">2nd Moult</option>
                                  <option value="3rd Moult">3rd Moult</option>
                                  <option value="4th Moult">4th Moult</option>
                                  <option value="Spinning">Spinning</option>
                                  <option value="Harvest">Harvest</option>
                                  <option value="Supply/Market">Supply/Market</option>
                                </Form.Select>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="wormsBrushed">
                                Temperature
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="temperature"
                                  name="temperature"
                                  value={
                                    feedingTableDetails.temperature || ""
                                  }
                                  onChange={handleFeedingMoultInputs}
                                  type="text"
                                  placeholder="Enter temperature"
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
                              <Form.Label htmlFor="wormsBrushed">
                                Humidity
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="humidity"
                                  name="humidity"
                                  value={
                                    feedingTableDetails.humidity || ""
                                  }
                                  onChange={handleFeedingMoultInputs}
                                  type="text"
                                  placeholder="Enter Humidity"
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Worms Brushed is required
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
                              Update
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

export default RearingofDFLsforthe8LinesList;
