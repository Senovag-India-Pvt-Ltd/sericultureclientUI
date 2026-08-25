import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";
import { useTranslation } from 'react-i18next';

const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ReceiptofDFLsfromthegrainage() {
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [listLogsData, setListLogsData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [showModal, setShowModal] = useState(true);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const getReceiptList = () => {
    setLoading(true);

    const response = api
      .get(baseURL2 + `Receipt/get-info`)
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

  useEffect(() => {
    getReceiptList();
  }, []);

  // const handleDateChange = (date, type) => {
  //   setData({ ...data, [type]: date });
  // };

  const getList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `Receipt/get-alert-data`)
      .then((response) => {
        // console.log(response.data)
        setListData(response.data);
        // setTotalRows(response.data.content.totalItems);
        setLoading(false);
        if (response.data.length > 0) {
          setShowModal(true);
        } else {
          setShowModal(false);
        }
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
 
  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: t("Reject attempt was not successful"),
      text: t("Something went wrong!"),
    });
  };

  const deleteConfirm = (_sodId, status) => {
    Swal.fire({
      title: t("Are you sure?"),
      text: t("It will Reject permanently!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, Reject it!"),
    }).then((result) => {
      if (result.value) {
        console.log("hello");
        const response = api
          .get(baseURL2 + `Receipt/accept-reject-dfls/${_sodId}/${status}`)
          .then((response) => {
            // deleteConfirm(_id);
            // getList();
            Swal.fire(
              t("Rejected"),
              t("You successfully rejected this record"),
              "success"
            );
            getList();
            getReceiptList();
          })
          .catch((err) => {
            deleteError();
          });
        // Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        console.log(result.value);
        Swal.fire(t("Cancelled"), t("Your record is not rejected"), "info");
      }
    });
  };

  const acceptError = () => {
    Swal.fire({
      icon: "error",
      title: t("Accept attempt was not successful"),
      text: t("Something went wrong!"),
    });
  };

  const acceptConfirm = (_sodId, status) => {
    Swal.fire({
      title: t("Are you sure?"),
      text: t("It will Accept!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, Accept it!"),
    }).then((result) => {
      if (result.value) {
        console.log("hello");
        const response = api
          .get(baseURL2 + `Receipt/accept-reject-dfls/${_sodId}/${status}`)
          .then((response) => {
            // deleteConfirm(_id);
            // getList();
            Swal.fire(
              t("Accepted"),
              t("You successfully Accepted this record"),
              "success"
            );
            getList();
            getReceiptList();
          })
          .catch((err) => {
            acceptError();
          });
        // Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        console.log(result.value);
        Swal.fire(t("Cancelled"), t("Your record is not accepted"), "info");
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

  const handleEdit = (_id) => {
    navigate(`/seriui/receipt-of-dfls-edit/${_id}`);
    // navigate("/seriui/training Schedule");
  };


  const ReceiptofDFLsfromtheP4grainageDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        <div className="text-start w-100">
          <Button
            variant="primary"
            size="sm"
            className="d-inline-flex align-items-center gap-1 shadow-sm"
            onClick={() => handleEdit(row.id)}
          >
            <Icon name="edit" />
            {t("Edit")}
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
      minWidth: "120px",
      // grow: 3,
    },
    {
      name: t("Laid On Date"),
      selector: (row) => row.laidOnDate,
      cell: (row) => <span>{row.laidOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Lot Number"),
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
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
      name: t("Invoice Number"),
      selector: (row) => row.invoiceNumber,
      cell: (row) => <span>{row.invoiceNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Invoice Date"),
      selector: (row) => row.invoiceDate,
      cell: (row) => <span>{row.invoiceDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("No Of DFLs Received"),
      selector: (row) => row.numberOfDflsReleased,
      cell: (row) => <span>{row.numberOfDflsReleased}</span>,
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
  ];

  const ReceiptofDFLsfromtheP4grainageGardenDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            className="d-inline-flex align-items-center gap-1 shadow-sm"
            onClick={() => acceptConfirm(row.sodId, 1)}
          >
            <Icon name="check" />
            {t("Accept")}
          </Button>

          <Button
            variant="danger"
            size="sm"
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm"
            onClick={() => deleteConfirm(row.sodId, 2)}
          >
            <Icon name="cross" />
            {t("Reject")}
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      minWidth: "160px",
      // grow: 3,
    },

    {
      name: t("Lot Number"),
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Grainage"),
      selector: (row) => row.grainageMasterName,
      cell: (row) => <span>{row.grainageMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Invoice Number"),
      selector: (row) => row.invoiceNumber,
      cell: (row) => <span>{row.invoiceNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Invoice Date"),
      selector: (row) => row.invoiceDate,
      cell: (row) => <span>{row.invoiceDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("No Of DFLs Received"),
      selector: (row) => row.numberOfDflsDisposed,
      cell: (row) => <span>{row.numberOfDflsDisposed}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Accepted or not"),
      selector: (row) => row.isAccepted,
      cell: (row) => (
        <span>
          {row.isAccepted === 0
            ? t("Pending")
            : row.isAccepted === 1
            ? t("Accepted")
            : row.isAccepted === 2
            ? t("Rejected")
            : t("Unknown")}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
  ];


  
  return (
    <Layout title={t("Receipt Of DFLs")}>
      <style>{receiptOfDFLsFromGrainageStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Receipt Of DFLs")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  {/* <Link
                  to="/seriui/Receipt-of-DFLs-from-the-P4-grainage-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Receipt-of-DFLs-from-the-P4-grainage-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link> */}
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
              columns={ReceiptofDFLsfromtheP4grainageDataColumns}
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
              progressComponent={<div className="p-3 text-center">{t("Loading...")}</div>}
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

      {/* <Block className="mt-4">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <div>
              <Row className="g-gs">
                <Col lg="12">
                  <Block>
                    <Card>
                      <Card.Header>
                        Receipt of DFLs from the P4 grainage{" "}
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Lot Number<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  type="text"
                                  placeholder="Lot  Number"
                                />
                                <Form.Control.Feedback type="invalid">
                                  Lot Number is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Laid on Date
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.pruningDate}
                                  onChange={(date) =>
                                    handleDateChange(date, "pruningDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  maxDate={new Date()}
                                  dropdownMode="select"
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  required
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Line Number/Year
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  type="text"
                                  placeholder="Line Number/Year"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Number of DFLs received
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  type="text"
                                  placeholder="Number of DFLs received"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Invoice no. and Date
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.pruningDate}
                                  onChange={(date) =>
                                    handleDateChange(date, "pruningDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  maxDate={new Date()}
                                  dropdownMode="select"
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  required
                                />
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                    
                    <div className="gap-col">
                      <ul className="mt-1 d-flex align-items-center justify-content-center gap g-3">
                        <li>
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
                  </Block>
                </Col>
               
              </Row>
            </div>
          </Row>
        </Form>
      </Block> */}

      <Modal show={showModal} onHide={handleCloseModal} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="bell" />
            <span>{t("Alerts Window")}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-2 sh-list-wrap">
            <Card className="sh-list-card">
              <div className="sh-table-wrap">
                <DataTable
                  // title="New Trader License List"
                  tableClassName="data-table-head-light table-responsive"
                  columns={ReceiptofDFLsfromtheP4grainageGardenDataColumns}
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
                  progressComponent={<div className="p-3 text-center">{t("Loading...")}</div>}
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
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

const receiptOfDFLsFromGrainageStyles = `
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
`;

export default ReceiptofDFLsfromthegrainage;
