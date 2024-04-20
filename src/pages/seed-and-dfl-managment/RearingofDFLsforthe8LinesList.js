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

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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
    weightCacoons: "",
    weightPupa: "",
    weightShells: "",
    shellPercentage: "",
    err: "",
    cacoonsFormed: "",
    wormsBrushed: "",
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
    setCocoonAssesmentDetails({ ...cocoonAssesmentDetails, [name]: value });
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
          baseURLSeedDfl + `8linesController/update-cacoon-assesment-data-by-id`,
          cocoonAssesmentDetails
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

  const getCocoonList = (_id) => {
    setLoading(true);
    handleShowModal();

    api
      .get(
        baseURLSeedDfl +
          `8linesController/get-cacoon-assesment-data-by-id/${_id}`
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
          {/* <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.id)}
            className="ms-2"
          >
            Delete
          </Button> */}
        </div>
      ),
      sortable: false,
      hide: "md",
      // grow: 2,
    },
    {
      name: "Disinfectant Usage Details",
      selector: (row) => row.disinfectantUsageDetails,
      cell: (row) => <span>{row.disinfectantUsageDetails}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Crop Details",
      selector: (row) => row.cropDetail,
      cell: (row) => <span>{row.cropDetail}</span>,
      sortable: true,
      hide: "md",
    },
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
      selector: (row) => row.releasedOn,
      cell: (row) => <span>{formatDate(row.releasedOn)}</span>,
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
      name: "Worm Test Dates And Results",
      selector: (row) => row.wormTestDatesAndResults,
      cell: (row) => <span>{row.wormTestDatesAndResults}</span>,
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
                                ERR<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="err"
                                  name="err"
                                  value={cocoonAssesmentDetails.err || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="ERR"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback>
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
    </Layout>
  );
}

export default RearingofDFLsforthe8LinesList;
