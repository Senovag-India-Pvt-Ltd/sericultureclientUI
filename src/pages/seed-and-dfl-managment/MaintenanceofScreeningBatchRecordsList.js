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
    setCocoonAssesmentDetails({ ...cocoonAssesmentDetails, [name]: value });
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

  const postData1 = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated1(true);
    } else {
      event.preventDefault();
      api
        .post(
          baseURLSeedDfl +
            `MaintenanceOfScreen/update-cacoon-assesment-data-by-id`,
          cocoonAssesmentDetails
        )
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.message);
            clearCocoon();
            handleCloseModal1();
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
        setCocoonAssesmentDetails(response.data);
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
    // {
    //   name: "Selected Bed as per the Mean Performance",
    //   selector: (row) => row.selectedBedAsPerTheMeanPerformance,
    //   cell: (row) => <span>{row.selectedBedAsPerTheMeanPerformance}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Selected Bed as per the Mean Performance",
    //   selector: (row) => row.selectedBedAsPerTheMeanPerformance,
    //   cell: (row) => (
    //     <span>
    //       {row.selectedBedAsPerTheMeanPerformance === "1"
    //         ? "Bed 1"
    //         : row.selectedBedAsPerTheMeanPerformance === "2"
    //         ? "Bed 2"
    //         : row.selectedBedAsPerTheMeanPerformance === "3"
    //         ? "Bed 3"
    //         : row.selectedBedAsPerTheMeanPerformance === "4"
    //         ? "Bed 4"
    //         : row.selectedBedAsPerTheMeanPerformance === "5"
    //         ? "Bed 5"
    //         : "Other"}
    //     </span>
    //   ),
    //   sortable: true,
    //   hide: "md",
    // },   
    {
      name: "Selected Bed as per the Mean Performance",
      selector: (row) => row.selectedBedAsPerTheMeanPerformance,
      cell: (row) => {
        const value = row.selectedBedAsPerTheMeanPerformance;
        return (
          <span>
            {value === "1" || value === 1
              ? "Bed 1"
              : value === "2" || value === 2
              ? "Bed 2"
              : value === "3" || value === 3
              ? "Bed 3"
              : value === "4" || value === 4
              ? "Bed 4"
              : value === "5" || value === 5
              ? "Bed 5"
              : "Other"}
          </span>
        );
      },
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
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                Average Weight of 25 Cocoons
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="weightCacoons"
                                  name="weightCacoons"
                                  value={
                                    cocoonAssesmentDetails.weightCacoons || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Average Weight of 25 Cocoons"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Cocoons is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightPupa">
                                Average Weight of 25 Pupa
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="weightPupa"
                                  name="weightPupa"
                                  value={
                                    cocoonAssesmentDetails.weightPupa || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Average Weight of 25 Pupa"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Pupa is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightShells">
                                Average Weight of 25 Shells
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="weightShells"
                                  name="weightShells"
                                  value={
                                    cocoonAssesmentDetails.weightShells || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Average Weight of 25 Shells"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Shells is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                                Shell Percentage
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="shellPercentage"
                                  name="shellPercentage"
                                  value={
                                    cocoonAssesmentDetails.shellPercentage || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Shell Percentage"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                                ERR
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="err"
                                  name="err"
                                  value={cocoonAssesmentDetails.err || ""}
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
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="cacoonsFormed"
                                  name="cacoonsFormed"
                                  value={
                                    cocoonAssesmentDetails.cacoonsFormed || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="No of Cocoon's Formed"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  No of Cocoon's Formed is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="wormsBrushed">
                                No of Worms Brushed
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="wormsBrushed"
                                  name="wormsBrushed"
                                  value={
                                    cocoonAssesmentDetails.wormsBrushed || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="No of Worms Brushed"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  No of Worms Brushed is required
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
                              onClick={clearCocoon}
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
    </Layout>
  );
}

export default MaintenanceofScreeningBatchRecordsList;
