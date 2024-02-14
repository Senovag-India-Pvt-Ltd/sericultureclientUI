import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";
import api from "../../../src/services/auth/api";

import DataTable, { createTheme } from "react-data-table-component";

const baseURL = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function MaintenanceandSaleofNurserytoFarmers() {
  const [data, setData] = useState({
    id: 0,
    fruitsId: "",
    farmerName: "",
    mulberryVariety: "",
    area: "",
    dateOfPlanting: "",
    nurserySaleDetails: "",
    quantity: 0,
    date: "",
    rate: 0,
    saplingAge: "",
    generateRecipt: "",
    receiptNumber: "",
    remittanceDetails: "",
    challanUpload: "",
  });

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "20%",
    },
  };

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      api
        .post(baseURL + `Maintenance-sale/add-info`, data)
        .then((response) => {
          // debugger;
          if (response.data.error) {
            saveError();
          } else {
            saveSuccess();
          }
        })
        .catch((err) => {
          setData({});
          saveError();
        });
      setValidated(true);
    }
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      // navigate("/seriui/caste-list");
    });
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };

  /* get table detais */

  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const getList = () => {
    setLoading(true);

    const response = api
      .get(baseURL + `Maintenance-sale/get-info`)
      .then((response) => {
        console.log(response.data);
        setListData(response.data);
        // setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        // setListData({});
        setLoading(false);
      });

    // axios
    //   .get(baseURL + `caste/list`, _params , {
    //     headers: _header,
    //   })
    //   .then((response) => {
    //     setListData(response.data.content.caste);
    //     setTotalRows(response.data.content.totalItems);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     setListData({});
    //     setLoading(false);
    //   });
  };

  useEffect(() => {
    getList();
  }, []);

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

  const handleView = (_id) => {
    navigate(`/seriui/MaintenanceandSaleofNurserytoFarmers-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/MaintenanceandSaleofNurserytoFarmers-edit/${_id}`);
    // navigate("/seriui/state");
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
          .delete(baseURL + `Maintenance-sale/delete-info/${_id}`)
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
  const GardenNursaryDataColumns = [
    {
      name: "Fruits Id",
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Farmer Name",
      selector: (row) => row.farmerName,
      cell: (row) => <span>{row.farmerName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Mulberry Variety",
      selector: (row) => row.mulberryVariety,
      cell: (row) => <span>{row.mulberryVariety}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Number Of Cocoons Dispatched",
      selector: (row) => row.numberOfCocoonsDispatched,
      cell: (row) => <span>{row.numberOfCocoonsDispatched}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Area",
      selector: (row) => row.area,
      cell: (row) => <span>{row.area}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Date Of Planting",
      selector: (row) => row.dateOfPlanting,
      cell: (row) => <span>{row.dateOfPlanting}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Nursery Sale Details",
      selector: (row) => row.nurserySaleDetails,
      cell: (row) => <span>{row.nurserySaleDetails}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      cell: (row) => <span>{row.quantity}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Date",
      selector: (row) => row.date,
      cell: (row) => <span>{row.date}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Rate",
      selector: (row) => row.rate,
      cell: (row) => <span>{row.rate}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Sapling Age",
      selector: (row) => row.saplingAge,
      cell: (row) => <span>{row.saplingAge}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Generate Recipt",
      selector: (row) => row.generateRecipt,
      cell: (row) => <span>{row.generateRecipt}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Receipt Number",
      selector: (row) => row.receiptNumber,
      cell: (row) => <span>{row.receiptNumber}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Remittance Details",
      selector: (row) => row.remittanceDetails,
      cell: (row) => <span>{row.remittanceDetails}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Challan Upload",
      selector: (row) => row.challanUpload,
      cell: (row) => <span>{row.challanUpload}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          {/*<Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.id)}
          >
            View
          </Button>*/}
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
            onClick={() => deleteConfirm(row.id)}
            className="ms-2"
          >
            Delete
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    },
  ];

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  return (
    <Layout title="Maintenance and Sale of Nursery to Farmers ">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Maintenance and Sale of Nursery to Farmers
            </Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Maintenance and Sale of Nursery to Farmers
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="#" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/#"
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

      <Block className="mt-4">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <div>
              <Row className="g-gs">
                <Col lg="12">
                  <Block>
                    <Card>
                      <Card.Header>
                        Maintenance and Sale of Nursery to Farmers{" "}
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                FRUITS-ID
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="fruitsId"
                                  name="fruitsId"
                                  type="text"
                                  value={data.fruitsId}
                                  onChange={handleInputs}
                                  placeholder=" FRUITS-ID"
                                  required
                                />
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Farmer’s name
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="farmerName"
                                  name="farmerName"
                                  type="text"
                                  value={data.farmerName}
                                  onChange={handleInputs}
                                  placeholder="Farmer’s name"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Mulberry variety
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="mulberryVariety"
                                  name="mulberryVariety"
                                  type="text"
                                  value={data.mulberryVariety}
                                  onChange={handleInputs}
                                  placeholder="Mulberry variety"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">Area</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="area"
                                  name="area"
                                  type="text"
                                  value={data.area}
                                  onChange={handleInputs}
                                  placeholder="Area"
                                />
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Date of planting
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.dateOfPlanting}
                                  onChange={(date) =>
                                    handleDateChange(date, "dateOfPlanting")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Nursery sale details
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="nurserySaleDetails"
                                  name="nurserySaleDetails"
                                  type="text"
                                  value={data.nurserySaleDetails}
                                  onChange={handleInputs}
                                  placeholder="Nursery sale details"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">quantity</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="quantity"
                                  name="quantity"
                                  type="text"
                                  value={data.quantity}
                                  onChange={handleInputs}
                                  placeholder=" quantity"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">date</Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.date}
                                  onChange={(date) =>
                                    handleDateChange(date, "date")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">rate</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="rate"
                                  name="rate"
                                  type="text"
                                  value={data.rate}
                                  onChange={handleInputs}
                                  placeholder="rate"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                sapling age in Month/Year
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="saplingAge"
                                  name="saplingAge"
                                  type="text"
                                  value={data.saplingAge}
                                  onChange={handleInputs}
                                  placeholder="sapling age in Month/Year"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Generate Recipt
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="generateRecipt"
                                  name="generateRecipt"
                                  type="text"
                                  value={data.generateRecipt}
                                  onChange={handleInputs}
                                  placeholder="Generate Recipt"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Receipt number
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="receiptNumber"
                                  name="receiptNumber"
                                  type="text"
                                  value={data.receiptNumber}
                                  onChange={handleInputs}
                                  placeholder="Receipt number"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Remittance details
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="remittanceDetails"
                                  name="remittanceDetails"
                                  type="text"
                                  value={data.remittanceDetails}
                                  onChange={handleInputs}
                                  placeholder="Remittance details"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Challan Upload
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="challanUpload"
                                  name="challanUpload"
                                  type="text"
                                  value={data.challanUpload}
                                  onChange={handleInputs}
                                  placeholder="Challan Upload"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="12" className="text-center">
                            <Button type="submit" variant="primary">
                              Save
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Block>
                </Col>
                <Col lg="12">
                  <Card>
                    <Card.Body>
                      {/* <h3>Farmers Details</h3> */}
                      <Row className="g-gs">
                        <Col lg="12">
                          <Block className="mt-n4 m-4">
                            <Card>
                              <DataTable
                                tableClassName="data-table-head-light table-responsive"
                                columns={GardenNursaryDataColumns}
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
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default MaintenanceandSaleofNurserytoFarmers;