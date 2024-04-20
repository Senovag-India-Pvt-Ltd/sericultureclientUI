import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
// import DatePicker from "../../../components/Form/DatePicker";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import axios from "axios";
import { createTheme } from "react-data-table-component";
import { Icon } from "../../components";
import DataTable from "react-data-table-component";
import api from "../../../src/services/auth/api";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function MaintenanceofMulberryfarmAlert() {
  const { id } = useParams();
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [pruningDate, setPruningDate] = useState({
    id: "",
    fertilizerApplicationStatus: "0",
    fymApplicationStatus: "0",
    irrigationStatus: "0",
    brushingStatus: "0",
  });

  const [validatedPruningDateEdit, setValidatedPruningDateEdit] =
    useState(false);

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const getList = () => {
    setLoading(true);

    const response = api
      .get(baseURLSeedDfl + `MulberryFarm/get-alerts-list`)
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
          // getVbDetailsList();
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidatedPruningDateEdit(true);
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

  const handleDateChange = (date, type) => {
    setPruningDate({ ...pruningDate, [type]: date });
  };

  const clear = () => {
    setPruningDate({
      fertilizerApplicationStatus: "",
      fymApplicationStatus: "",
      irrigationStatus: "",
      brushingStatus: "",
    });
  };

  const handleEdit = (row) => {
    setShowModal(true);
    setPruningDate((prev) => ({
      ...prev,
      id: row.id,
      fertilizerApplicationStatus: row.fertilizerApplicationStatus,
      fymApplicationStatus: row.fymApplicationStatus,
      irrigationStatus: row.irrigationStatus,
      brushingStatus: row.brushingStatus,
    }));

    // navigate("/seriui/training Schedule");
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

  const MulberryGardenDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row)}
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
      name: "Fertilizer Date",
      selector: (row) => row.pruningDate,
      cell: (row) => <span>{row.pruningDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "FYM Date",
      selector: (row) => row.pruningDate,
      cell: (row) => <span>{row.pruningDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Irrigation Date",
      selector: (row) => row.pruningDate,
      cell: (row) => <span>{row.pruningDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Brushing Date",
      selector: (row) => row.pruningDate,
      cell: (row) => <span>{row.pruningDate}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Gender",
    //   selector: (row) => row.genderId,
    //   cell: (row) => <span>{row.genderId  === 1
    //     ? 'Male'
    //     : row.gender === 2
    //     ? 'Female'
    //     : 'Other'}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
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
    <Layout title="Alert Window">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Alert Window</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Maintenance-of-mulberry-Garden-in-the-Farms-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Maintenance-of-mulberry-Garden-in-the-Farms-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
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
            columns={MulberryGardenDataColumns}
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
          <Modal.Title>Update Status </Modal.Title>
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
                    >
                      <option value="">
                        Select Fertilizer Application Status
                      </option>
                      <option value="0">Pending</option>
                      <option value="1">Completed</option>
                      {/* <option value="3">Other</option> */}
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
                    >
                      <option value="">Select FYM Status</option>
                      <option value="0">Pending</option>
                      <option value="1">Completed</option>
                      {/* <option value="3">Other</option> */}
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
                    >
                      <option value="">Select Irrigation Status</option>
                      <option value="0">Pending</option>
                      <option value="1">Completed</option>
                      {/* <option value="3">Other</option> */}
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
                    >
                      <option value="">Select Brushing Status</option>
                      <option value="0">Pending</option>
                      <option value="1">Completed</option>
                      {/* <option value="3">Other</option> */}
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
                  <div className="gap-col">
                    <Button type="button" variant="secondary" onClick={clear}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default MaintenanceofMulberryfarmAlert;
