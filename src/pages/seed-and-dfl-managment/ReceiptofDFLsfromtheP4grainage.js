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

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ReceiptofDFLsfromtheP4grainage() {
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
      .get(baseURLSeedDfl + `ReceiptOfDflsFromP4GrainageLinesController/get-info`)
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
      .get(baseURLSeedDfl + `ReceiptOfDflsFromP4GrainageLinesController/get-alert-data`)
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
      title: "Reject attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const deleteConfirm = (_sodId, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will Reject permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject it!",
    }).then((result) => {
      if (result.value) {
        console.log("hello");
        const response = api
          .get(baseURLSeedDfl + `ReceiptOfDflsFromP4GrainageLinesController/accept-reject-dfls/${_sodId}/${status}`)
          .then((response) => {
            // deleteConfirm(_id);
            getList();
            Swal.fire(
              "Rejected",
              "You successfully rejected this record",
              "success"
            );
          })
          .catch((err) => {
            deleteError();
          });
        // Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not rejected", "info");
      }
    });
  };

  const acceptError = () => {
    Swal.fire({
      icon: "error",
      title: "Accept attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const acceptConfirm = (_sodId, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will Accept!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Accept it!",
    }).then((result) => {
      if (result.value) {
        console.log("hello");
        const response = api
          .get(baseURLSeedDfl + `ReceiptOfDflsFromP4GrainageLinesController/accept-reject-dfls/${_sodId}/${status}`)
          .then((response) => {
            // deleteConfirm(_id);
            getList();
            Swal.fire(
              "Accepted",
              "You successfully Accepted this record",
              "success"
            );
          })
          .catch((err) => {
            acceptError();
          });
        // Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not accepted", "info");
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

  const handleEdit = (_id) => {
    navigate(`/seriui/Receipt-of-DFLs-from-the-P4-grainage-edit/${_id}`);
    // navigate("/seriui/training Schedule");
  };

  const ReceiptofDFLsfromtheP4grainageDataColumns = [
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <div className="text-start w-100">
    //       <Button
    //         variant="primary"
    //         size="sm"
    //         onClick={() => handleEdit(row.id)}
    //       >
    //         Edit
    //       </Button>
         
    //       <Button
    //         variant="danger"
    //         size="sm"
    //         onClick={() => deleteConfirm(row.id)}
    //         className="ms-2"
    //       >
    //         Delete
    //       </Button>
    //     </div>
    //   ),
    //   sortable: false,
    //   hide: "md",
    //   // grow: 3,
    // },
    {
      name: "Laid On Date",
      selector: (row) => row.laidOnDate,
      cell: (row) => <span>{row.laidOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Hatching Date",
      selector: (row) => row.hatchingDate,
      cell: (row) => <span>{row.hatchingDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Grainage",
      selector: (row) => row.grainageMasterName,
      cell: (row) => <span>{row.grainageMasterName}</span>,
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
      name: "Line Name",
      selector: (row) => row.lineName,
      cell: (row) => <span>{row.lineName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Invoice Number",
      selector: (row) => row.invoiceNumber,
      cell: (row) => <span>{row.invoiceNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Invoice Date",
      selector: (row) => row.invoiceDate,
      cell: (row) => <span>{row.invoiceDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "No Of DFLs Received",
      selector: (row) => row.numberOfDflsReleased,
      cell: (row) => <span>{row.numberOfDflsReleased}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Generation Number",
      selector: (row) => row.generationNumber,
      cell: (row) => <span>{row.generationNumber}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  const ReceiptofDFLsfromtheP4grainageGardenDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => acceptConfirm(row.sodId, 1)}
          >
            Accept
          </Button>
         
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.sodId, 2)}
            className="ms-2"
          >
            Reject
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      // grow: 3,
    },

    {
      name: "Lot Number",
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Grainage",
      selector: (row) => row.grainageMasterName,
      cell: (row) => <span>{row.grainageMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Invoice Number",
      selector: (row) => row.invoiceNumber,
      cell: (row) => <span>{row.invoiceNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Invoice Date",
      selector: (row) => row.invoiceDate,
      cell: (row) => <span>{row.invoiceDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "No Of DFLs Received",
      selector: (row) => row.numberOfDflsDisposed,
      cell: (row) => <span>{row.numberOfDflsDisposed}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Accepted or not",
      selector: (row) => row.isAccepted,
      cell: (row) => (
        <span>
          {row.isAccepted === 0
            ? "Pending"
            : row.isAccepted === 1
            ? "Accepted"
            : row.isAccepted === 2
            ? "Rejected"
            : "Unknown"}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
  ];


  
  return (
    <Layout title="Receipt of DFLs from the P4 grainage">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Receipt of DFLs from the P4 grainage
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
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Receipt-of-DFLs-from-the-P4-grainage-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link> */}
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
            columns={ReceiptofDFLsfromtheP4grainageDataColumns}
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

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Alerts Window</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-2">
            <Card>
              <DataTable
                // title="New Trader License List"
                tableClassName="data-table-head-light table-responsive"
                columns={ReceiptofDFLsfromtheP4grainageGardenDataColumns}
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
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default ReceiptofDFLsfromtheP4grainage;
