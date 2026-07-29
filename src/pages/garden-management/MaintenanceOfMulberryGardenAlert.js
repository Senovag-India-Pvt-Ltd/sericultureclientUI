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
import { useTranslation } from "react-i18next"; // Add this line

const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function MaintenanceOfMulberryGardenAlert() {
  const { t } = useTranslation(); // Add this line
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
      .get(baseURL2 + `Mulberry-garden/get-alerts-list`)
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
        .post(baseURL2 + `Mulberry-garden/update-task-status`, pruningDate)
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

  const MulberryGardenDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="d-flex align-items-center flex-nowrap gap-2" style={{ whiteSpace: "nowrap" }}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleEdit(row)}
            className="d-inline-flex align-items-center gap-1 shadow-sm"
            style={{ borderRadius: "6px", fontWeight: 500, fontSize: "12.5px", paddingInline: "10px" }}
            title={t("Edit")}
          >
            <Icon name="edit" />
            <span>{t("Edit")}</span>
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
      minWidth: "140px",
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
  ];

  return (
    <Layout title={t("Alert Window")}>
      <style>{maintenanceMulberryGardenAlertStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Alert Window")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/maintenance-of-mulberry-garden-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/maintenance-of-mulberry-garden-list"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
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
              columns={MulberryGardenDataColumns}
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
            <Icon name="bell" />
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
                    >
                      <option value="">
                        {t("Select Fertilizer Application Status")}
                      </option>
                      <option value="0">{t("Pending")}</option>
                      <option value="1">{t("Completed")}</option>
                      {/* <option value="3">Other</option> */}
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
                    >
                      <option value="">{t("Select FYM Status")}</option>
                      <option value="0">{t("Pending")}</option>
                      <option value="1">{t("Completed")}</option>
                      {/* <option value="3">Other</option> */}
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
                    >
                      <option value="">{t("Select Irrigation Status")}</option>
                      <option value="0">{t("Pending")}</option>
                      <option value="1">{t("Completed")}</option>
                      {/* <option value="3">Other</option> */}
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
                    >
                      <option value="">{t("Select Brushing Status")}</option>
                      <option value="0">{t("Pending")}</option>
                      <option value="1">{t("Completed")}</option>
                      {/* <option value="3">Other</option> */}
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
                  <div className="gap-col">
                    <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                      <Icon name="cross" />
                      <span>{t("Cancel")}</span>
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

const maintenanceMulberryGardenAlertStyles = `
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

export default MaintenanceOfMulberryGardenAlert;
