import { Card, Form, Row, Col, Button, Modal,Spinner} from "react-bootstrap";
import React from 'react';
import { Link, useParams} from "react-router-dom";
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

function PreparationofeggsDFLsList() {
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

  const [validated, setValidated] = useState(false);

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

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleBedInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setBedDetails({ ...bedDetails, [name]: value });
  };

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

  // const getList = () => {
  //   setLoading(true);

  //   const response = api
  //     .get(baseURLSeedDfl + `EggPreparation/get-info`)
  //     .then((response) => {
  //       // console.log(response.data)
  //       setListData(response.data);
  //       // setTotalRows(response.data.content.totalItems);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       // setListData({});
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   getList();
  // }, []);

  const getList = () => {
    setLoading(true);
  
    api
      .get(baseURLSeedDfl + `EggPreparation/get-info`)
      .then((response) => {
        // Assuming you want to get the preparationOfEggsId from the response
        const preparationOfEggsId = response.data?.preparationOfEggsId;
        
        // Set the list data
        setListData(response.data);
        
        // Pass the preparationOfEggsId to another method or store it in the state
        if (preparationOfEggsId) {
          getIdList(preparationOfEggsId);
        }
        setLoading(false);
      })
      .catch((err) => {
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

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/Preparation-of-eggs-DFLs-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/Preparation-of-eggs-DFLs-edit/${_id}`);
    // navigate("/seriui/training Schedule");
  };

  const handleAddEggs = (_id) => {
    navigate(`/seriui/Preparation-of-eggs-DFLs-add/${_id}`);
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
          .delete(baseURLSeedDfl + `MaintenanceOfScreen/delete-info/${_id}`)
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

  // const styles = {
  //   ctstyle: {
  //     backgroundColor: "rgb(248, 248, 249, 1)",
  //     color: "rgb(0, 0, 0)",
  //     width: "50%",
  //   },
  // };

  const styles = {
    labelStyle: {
        fontWeight: 'bold',
        paddingRight: '10px',
        color: '#5a5a5a'
    },
    valueStyle: {
        color: '#333'
    },
    cardStyle: {
        marginBottom: '20px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0,0,0,0.1)'
    }
};

  const { preparationOfEggsId } = useParams();

  const [showModal1, setShowModal1] = useState(false);

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const [prepareEggs, setPrepareEggs] = useState([]);

  const getIdList = (preparationOfEggsId) => {
    setLoading(true);
    api
      .get(`${baseURLSeedDfl}EggPreparation/get-preparation-of-present-lotno-dfls-by-preparationOfEggsId/${preparationOfEggsId}`)
      .then((response) => {
        if (response.data.length > 0) {
          setPrepareEggs(response.data); // Set to the entire array
        } else {
          setPrepareEggs([]); // Handle empty response
        }
        setLoading(false);
        handleShowModal1();
      })
      .catch((err) => {
        console.error(err);
        setPrepareEggs([]);
        setLoading(false);
      });
  };
  

  
  // useEffect(() => {
  //   getIdList();
  // }, [preparationOfEggsId]);

  const PreparationofeggsDFLsDataColumns = [
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
            className="ms-2"
            onClick={() => handleAddEggs(row.id)}
          >
            {t("Add DFLs")}
          </Button>
          {/* <Button
            variant="danger"
            size="sm"
            className="ms-2"
            onClick={() => getIdList(row.preparationOfEggsId)}
          >
            View DFLs
          </Button> */}
          <Button
            variant="danger"
            size="sm"
            className="ms-2"
            onClick={() => {
              const preparationOfEggsId = row.id;
              if (preparationOfEggsId) {
                getIdList(preparationOfEggsId);
              } else {
                console.error('preparationOfEggsId is undefined for this row:', row);
                alert(t('Error: preparationOfEggsId is undefined!'));
              }
            }}
          >
            {t("View DFLs")}
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 3,
    },

    // {
    //   name: "Name of the Grainage and Address",
    //   selector: (row) => row.cocoonsProducedAtEachGeneration,
    //   cell: (row) => <span>{row.cocoonsProducedAtEachGeneration}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: t("Lot number"),
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Number of Cocoons in Kg"),
      selector: (row) => row.numberOfCocoonsCB,
      cell: (row) => <span>{row.numberOfCocoonsCB}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Date of moth emergence"),
      selector: (row) => row.dateOfMothEmergence,
      cell: (row) => <span>{row.dateOfMothEmergence}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Race"),
      selector: (row) => row.raceName,
      cell: (row) => <span>{row.raceName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Generation Number"),
      selector: (row) => row.generationNumber,
      cell: (row) => <span>{row.generationNumber}</span>,
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
      name: t("Laid On Date"),
      selector: (row) => row.laidOnDate,
      cell: (row) => <span>{row.laidOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Egg sheet serial number"),
      selector: (row) => row.eggSheetSerialNumber,
      cell: (row) => <span>{row.eggSheetSerialNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Number of pairs"),
      selector: (row) => row.numberOfPairs,
      cell: (row) => <span>{row.numberOfPairs}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Number of Rejection"),
      selector: (row) => row.numberOfRejection,
      cell: (row) => <span>{row.numberOfRejection}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("DFLs obtained"),
      selector: (row) => row.dflsObtained,
      cell: (row) => <span>{row.dflsObtained}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Egg Recovery %"),
      selector: (row) => row.eggRecoveryPercentage,
      cell: (row) => <span>{row.eggRecoveryPercentage}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Parent Lot Number"),
      selector: (row) => row.parentLotNumber,
      cell: (row) => <span>{row.parentLotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Selected Cocoon's in Nos"),
      selector: (row) => row.selectedCocoonsNo,
      cell: (row) => <span>{row.selectedCocoonsNo}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Rejected Cocoon's in Nos"),
      selector: (row) => row.rejectedCocoonsNo,
      cell: (row) => <span>{row.rejectedCocoonsNo}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("No of Pairs (%) (Selected Cocoon's)"),
      selector: (row) => row.pairNoSelectedCocoonsNo,
      cell: (row) => <span>{row.pairNoSelectedCocoonsNo}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("No of Pairs (%) (Rejected Cocoon's)"),
      selector: (row) => row.pairNoRejectedCocoonsNo,
      cell: (row) => <span>{row.pairNoRejectedCocoonsNo}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Err %(Selected Cocoon's)"),
      selector: (row) => row.errPerSelectedCocoonsNo,
      cell: (row) => <span>{row.errPerSelectedCocoonsNo}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Err %(Rejected Cocoon's)"),
      selector: (row) => row.errPerRejectedCocoonsNo,
      cell: (row) => <span>{row.errPerRejectedCocoonsNo}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Remaining DFLs"),
      selector: (row) => row.remainingDfls,
      cell: (row) => <span>{row.remainingDfls}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Selected Bed as per the Mean Performance",
    //   selector: (row) => row.selectedBedAsPerTheMeanPerformance,
    //   cell: (row) => <span>{row.selectedBedAsPerTheMeanPerformance}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Egg Recovery %",
    //   selector: (row) => row.screeningBatchResults,
    //   cell: (row) => (
    //     <Button
    //       className="d-flex justify-content-center"
    //       variant="primary"
    //       size="sm"
    //       onClick={() => getLogsList(row.id)}
    //     >
    //       Show
    //     </Button>
    //   ),
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Test results",
      selector: (row) => row.testResults,
      cell: (row) => <span>{row.testResults}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Certification (Yes/No)",
    //   selector: (row) => row.certification,
    //   cell: (row) => <span>{row.certification === "1" ? "Yes" : "No"}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: t("Additional remarks"),
      selector: (row) => row.additionalRemarks,
      cell: (row) => <span>{row.additionalRemarks}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title={t("Preparation of Eggs (DFLs) List")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("Preparation of Eggs (DFLs) List")}
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Preparation-of-eggs-DFLs"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>{t("Create")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Preparation-of-eggs-DFLs"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>{t("Create")}</span>
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
            columns={PreparationofeggsDFLsDataColumns}
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
            {t("Worms Weight in grams of 10 Larvae on on 5th Instar 5th Day (Bedwise)")}
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
                        Preparation of Eggs (DFLs){" "}
                      </Card.Header>
                      <Card.Body> */}
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed1">
                                {t("Bed 1")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1"
                                  name="bed1"
                                  value={bedDetails.bed1 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 1")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 1 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed2">
                                {t("Bed 2")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2"
                                  name="bed2"
                                  value={bedDetails.bed2 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 2")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 2 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed3">
                                {t("Bed 3")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3"
                                  name="bed3"
                                  value={bedDetails.bed3 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 3")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 3 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed4">
                                {t("Bed 4")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4"
                                  name="bed4"
                                  value={bedDetails.bed4 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 4")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 4 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed5">
                                {t("Bed 5")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5"
                                  name="bed5"
                                  value={bedDetails.bed5 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 5")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 5 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed6">
                                {t("Bed 6")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed6"
                                  name="bed6"
                                  value={bedDetails.bed6 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 6")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 6 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed7">
                                {t("Bed 7")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed7"
                                  name="bed7"
                                  value={bedDetails.bed7 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 7")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 7 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed8">
                                {t("Bed 8")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed8"
                                  name="bed8"
                                  value={bedDetails.bed8 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 8")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 8 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed9">
                                {t("Bed 9")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed9"
                                  name="bed9"
                                  value={bedDetails.bed9 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 9")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 9 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed10">
                                {t("Bed 10")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed10"
                                  name="bed10"
                                  value={bedDetails.bed10 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 10")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 10 is required")}
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
                            <Button type="submit" variant="primary">
                              {t("Save")}
                            </Button>
                          </li>
                          <li>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={clear}
                            >
                              {t("Cancel")}
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
        <Modal.Title>{t("View DFL Details")}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {loading ? (
            <h1 className="d-flex justify-content-center align-items-center">{t("Loading...")}</h1>
        ) : (
            <div style={{ overflowX: "auto", width: "100%" }}>
                <table 
                    className="table table-bordered small text-center" 
                    style={{ 
                        tableLayout: "auto", 
                        width: "100%", 
                        border: "1px solid black",
                        borderCollapse: "collapse"
                    }}
                >
                    <thead style={{ backgroundColor: "#0F6CBE", color: "white", fontWeight: "bold" }}>
                        <tr>
                            <th style={{ width: "8%", border: "1px solid black" }}>{t("ID")}</th>
                            <th style={{ width: "19%", border: "1px solid black" }}>{t("Lot Number")}</th>
                            <th style={{ width: "18%", border: "1px solid black" }}>{t("Parent Lot Number")}</th>
                            <th style={{ width: "15%", border: "1px solid black" }}>{t("Date of Moth Emergence")}</th>
                            <th style={{ width: "15%", border: "1px solid black" }}>{t("Laid On Date")}</th>
                            <th style={{ width: "15%", border: "1px solid black" }}>{t("Egg Sheet Serial Number")}</th>
                            <th style={{ width: "10%", border: "1px solid black" }}>{t("Number of Pairs")}</th>
                            <th style={{ width: "10%", border: "1px solid black" }}>{t("Number of Rejection")}</th>
                            <th style={{ width: "10%", border: "1px solid black" }}>{t("DFLs Obtained")}</th>
                            <th style={{ width: "10%", border: "1px solid black" }}>{t("Remaining DFLs")}</th>
                            <th style={{ width: "10%", border: "1px solid black" }}>{t("Test Results")}</th>
                            <th style={{ width: "18%", border: "1px solid black" }}>{t("Remarks")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prepareEggs.map((egg, index) => (
                            <tr key={index}>
                                <td style={{ border: "1px solid black" }}>{egg.id}</td>
                                <td style={{ border: "1px solid black" }}>{egg.lotNumber}</td>
                                <td style={{ border: "1px solid black" }}>{egg.parentLotNumber}</td>
                                <td style={{ border: "1px solid black" }}>{egg.dateOfMothEmergence}</td>
                                <td style={{ border: "1px solid black" }}>{egg.laidOnDate}</td>
                                <td style={{ border: "1px solid black" }}>{egg.eggSheetSerialNumber}</td>
                                <td style={{ border: "1px solid black" }}>{egg.numberOfPairs}</td>
                                <td style={{ border: "1px solid black" }}>{egg.numberOfRejection}</td>
                                <td style={{ border: "1px solid black" }}>{egg.dflsObtained}</td>
                                <td style={{ border: "1px solid black" }}>{egg.remainingDfls}</td>
                                <td style={{ border: "1px solid black" }}>{egg.testResults}</td>
                                <td style={{ border: "1px solid black" }}>{egg.additionalRemarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </Modal.Body>
</Modal>
    </Layout>
  );
}

export default PreparationofeggsDFLsList;
