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
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function MaintenanceofScreeningBatchRecordsList() {
  const [listData, setListData] = useState({});
  const [listLogsData, setListLogsData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const [validated, setValidated] = useState(false);
  const [validated1, setValidated1] = useState(false);

  const [data, setData] = useState({
    cocoonsProducedAtEachGeneration: "",
    lotNumber: "",
    lineNameId: "",
    incubationDate: "",
    blackBoxingDate: "",
    brushedOnDate: "",
    spunOnDate: "",
    screeningBatchNo: "",
    cocoonsProducedAtEachScreening: "",
    screeningBatchResults: "",
    chawkiPercentage: "",
    selectedBedAsPerTheMeanPerformance: "",
    cropFailureDetails: "",
  });

  // const clear = () => {
  //   setData({
  //     cocoonsProducedAtEachGeneration: "",
  //     lotNumber: "",
  //     lineNameId: "",
  //     incubationDate: "",
  //     blackBoxingDate: "",
  //     brushedOnDate: "",
  //     spunOnDate: "",
  //     screeningBatchNo: "",
  //     cocoonsProducedAtEachScreening: "",
  //     screeningBatchResults: "",
  //     chawkiPercentage: "",
  //     selectedBedAsPerTheMeanPerformance: "",
  //     cropFailureDetails: "",
  //   });
  //   setValidated(false);
  // };

  const clear = () => {
    setBedDetails((prev) => ({
      ...prev,
      bed1: "",
      bed2: "",
      bed3: "",
      bed4: "",
      bed5: "",
      bed6: "",
      bed7: "",
      bed8: "",
      bed9: "",
      bed10: "",
    }));
    setValidated(false);
    handleCloseModal();
  };

  const clearCocoon = () => {
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
    setValidated1(false);
    handleCloseModal1();
  };

  const handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setCocoonAssesmentDetailsBedWise({ ...cocoonAssesmentDetailsBedWise, [name]: value });
  };

  const handleBedInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setBedDetails({ ...bedDetails, [name]: value });
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

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(
          baseURLSeedDfl + `MaintenanceOfScreen/update-bedwise-test-data-by-id`,
          bedDetails
        )
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.message);
            clear();
            handleCloseModal();
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

  const postData1 = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated1(true);
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
          baseURLSeedDfl + `MaintenanceOfScreen/update-cacoon-assesment-data-by-id`,
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
      setValidated1(true);
    }
  };

  const postBed2Data = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated1(true);
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
          baseURLSeedDfl + `MaintenanceOfScreen/update-cacoon-assesment-data-by-id`,
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
      setValidated1(true);
    }
  };

  const postBed3Data = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated1(true);
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
          baseURLSeedDfl + `MaintenanceOfScreen/update-cacoon-assesment-data-by-id`,
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
      setValidated1(true);
    }
  };

  const postBed4Data = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated1(true);
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
          baseURLSeedDfl + `MaintenanceOfScreen/update-cacoon-assesment-data-by-id`,
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
      setValidated1(true);
    }
  };

  const postBed5Data = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated1(true);
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
          baseURLSeedDfl + `MaintenanceOfScreen/update-cacoon-assesment-data-by-id`,
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
      setValidated1(true);
    }
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

  const getList = () => {
    setLoading(true);

    const response = api
      .get(baseURLSeedDfl + `MaintenanceOfScreen/get-info`)
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

  const [bedDetails, setBedDetails] = useState({
    id: "",
    bed1: "",
    bed2: "",
    bed3: "",
    bed4: "",
    bed5: "",
    bed6: "",
    bed7: "",
    bed8: "",
    bed9: "",
    bed10: "",
  });

  const [cocoonAssesmentDetails, setCocoonAssesmentDetails] = useState({
    id: "",
    weightCacoons: "",
    weightPupa: "",
    weightShells: "",
    shellPercentage: "",
    err: "",
    cacoonsFormed: "",
    wormsBrushed: "",
  });

  console.log(bedDetails);
  const getLogsList = (_id) => {
    setLoading(true);
    setShowModal(true);

    api
      .get(
        baseURLSeedDfl +
          `MaintenanceOfScreen/get-bedwise-test-data-by-id/${_id}`
      )
      .then((response) => {
        // console.log(response.data)
        setBedDetails(response.data);
        // setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        // setListData({});
        setLoading(false);
      });
  };

  const getCocoonList = (_id) => {
    setLoading(true);
    handleShowModal1();

    api
      .get(
        baseURLSeedDfl +
          `MaintenanceOfScreen/get-cacoon-assesment-data-by-id/${_id}`
      )
      .then((response) => {
        // console.log(response.data)
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
        // setListData({});
        setLoading(false);
      });
  };

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/maintenance-of-Screening-Batch-Records-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/maintenance-of-Screening-Batch-Records-edit/${_id}`);
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
        // console.log("hello");
        api
          .delete(baseURLSeedDfl + `/MaintenanceOfScreen/delete-info/${_id}`)
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

  const MaintenanceofScreeningBatchDataColumns = [
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
          {/* <Button
            variant="danger"
            size="sm"
            className="ms-2"
            onClick={() => deleteConfirm(row.id)}
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
      name: "Total number of cocoons produced",
      selector: (row) => row.cocoonsProducedAtEachGeneration,
      cell: (row) => <span>{row.cocoonsProducedAtEachGeneration}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Lot number",
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Line Name",
      selector: (row) => row.lineName,
      cell: (row) => <span>{row.lineName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Incubation Date",
      selector: (row) => row.incubationDate,
      cell: (row) => <span>{row.incubationDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Black Boxing Date",
      selector: (row) => row.blackBoxingDate,
      cell: (row) => <span>{row.blackBoxingDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Brushed on date",
      selector: (row) => row.brushedOnDate,
      cell: (row) => <span>{row.brushedOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Spun on date",
      selector: (row) => row.spunOnDate,
      cell: (row) => <span>{row.spunOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Worm Test details  and result",
    //   selector: (row) => row.spunOnDate,
    //   cell: (row) => <span>{row.spunOnDate}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Total No of Cocoons Produced at each Screening",
      selector: (row) => row.cocoonsProducedAtEachScreening,
      cell: (row) => <span>{row.cocoonsProducedAtEachScreening}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Screening Batch Results",
      selector: (row) => row.screeningBatchResults,
      cell: (row) => <span>{row.screeningBatchResults}</span>,
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
      name: "Selected Bed as per the Mean Performance",
      selector: (row) => row.selectedBedAsPerTheMeanPerformance,
      cell: (row) => <span>{row.selectedBedAsPerTheMeanPerformance}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Selected Bed as per the Mean Performance",
    //   selector: (row) => row.selectedBedAsPerTheMeanPerformance,
    //   cell: (row) => {
    //     const value = row.selectedBedAsPerTheMeanPerformance;
    //     return (
    //       <span>
    //         {value === "1" || value === 1
    //           ? "Bed 1"
    //           : value === "2" || value === 2
    //           ? "Bed 2"
    //           : value === "3" || value === 3
    //           ? "Bed 3"
    //           : value === "4" || value === 4
    //           ? "Bed 4"
    //           : value === "5" || value === 5
    //           ? "Bed 5"
    //           : "Other"}
    //       </span>
    //     );
    //   },
    //   sortable: true,
    //   hide: "md",
    // },    
    {
      name: "Worms Weight in grams of 10 Larvae on on 5th Instar 5th Day (Bedwise)",
      cell: (row) => (
        <Button
          className="d-flex justify-content-center"
          variant="primary"
          size="sm"
          onClick={() => getLogsList(row.id)}
        >
          Show
        </Button>
      ),
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
      name: "Crop Failure Details",
      selector: (row) => row.cropFailureDetails,
      cell: (row) => <span>{row.cropFailureDetails}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  
  return (
    <Layout title="Maintenance of screening batch records List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Maintenance of screening batch records List
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Maintenance-of-Screening-Batch-Records"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Maintenance-of-Screening-Batch-Records"
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
            columns={MaintenanceofScreeningBatchDataColumns}
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
          <Modal.Title>
            Worms Weight in grams of 10 Larvae on on 5th Instar 5th Day
            (Bedwise)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Block className="mt-2">
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
          </Block> */}
          <Block className="mt-4">
            <Form noValidate validated={validated} onSubmit={postData}>
              <Row className="g-3 ">
                <div>
                  <Row className="g-gs">
                    <Col lg="12">
                      <Block>
                        {/* <Card>
                      <Card.Header>
                        {" "}
                        Maintenance of screening batch records{" "}
                      </Card.Header>
                      <Card.Body> */}
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed1">
                                Bed 1<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1"
                                  name="bed1"
                                  value={bedDetails.bed1 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder="Bed 1"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Bed 1 is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed2">
                                Bed 2<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2"
                                  name="bed2"
                                  value={bedDetails.bed2 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder="Bed 2"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Bed 2 is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed3">
                                Bed 3<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3"
                                  name="bed3"
                                  value={bedDetails.bed3 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder="Bed 3"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Bed 3 is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed4">
                                Bed 4<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4"
                                  name="bed4"
                                  value={bedDetails.bed4 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder="Bed 4"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Bed 4 is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed5">
                                Bed 5<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5"
                                  name="bed5"
                                  value={bedDetails.bed5 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder="Bed 5"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Bed 5 is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed6">
                                Bed 6<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed6"
                                  name="bed6"
                                  value={bedDetails.bed6 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder="Bed 6"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Bed 6 is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed7">
                                Bed 7<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed7"
                                  name="bed7"
                                  value={bedDetails.bed7 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder="Bed 7"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Bed 7 is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed8">
                                Bed 8<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed8"
                                  name="bed8"
                                  value={bedDetails.bed8 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder="Bed 8"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Bed 8 is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed9">
                                Bed 9<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed9"
                                  name="bed9"
                                  value={bedDetails.bed9 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder="Bed 9"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Bed 9 is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed10">
                                Bed 10
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed10"
                                  name="bed10"
                                  value={bedDetails.bed10 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder="Bed 10"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Bed 10 is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                        {/* </Card.Body>
                    </Card> */}
                      </Block>
                      <div className="gap-col mt-2">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            {/* <Button type="button" variant="primary" onClick={postData}> */}
                            <Button type="submit" variant="primary">
                              Save
                            </Button>
                          </li>
                          <li>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={clear}
                            >
                              Cancel
                            </Button>
                          </li>
                        </ul>
                      </div>
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
          <Modal.Title>Cocoon Assesment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-4">
            <Form noValidate validated={validated1} onSubmit={postData1}>
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
            <Form noValidate validated={validated1} onSubmit={postBed2Data}>
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
            <Form noValidate validated={validated1} onSubmit={postBed3Data}>
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
            <Form noValidate validated={validated1} onSubmit={postBed4Data}>
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
            <Form noValidate validated={validated1} onSubmit={postBed5Data}>
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
    </Layout>
  );
}

export default MaintenanceofScreeningBatchRecordsList;
