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

function ChawkidistributiontoFarmers() {
  const [data, setData] = useState({
    id: 0,
    fruitsId: " ",
    farmerName: "",
    fatherName: "",
    sourceOfDFLs: "",
    raceOfDFLs: "",
    numberOfDFLs: 0,
    lotNumberRSP: "",
    lotNumberCRC: "",
    village: 0,
    district: "",
    state: "",
    tsc: "",
    ratePer100DFLs: 0,
    price: 0,
    dispatchDate: "",
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
        .post(baseURL + `Chawki-distribution/add-info`, data)
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
      .get(baseURL + `Chawki-distribution/get-info`)
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
    navigate(`/seriui/Chawki-distribution-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/ChawkidistributiontoFarmers-edit/${_id}`);
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
          .delete(baseURL + `Chawki-distribution/delete-info/${_id}`)
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
      name: "Father Name",
      selector: (row) => row.fatherName,
      cell: (row) => <span>{row.fatherName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "sourceOfDFLs",
      selector: (row) => row.sourceOfDFLs,
      cell: (row) => <span>{row.sourceOfDFLs}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Race Of DFLs",
      selector: (row) => row.raceOfDFLs,
      cell: (row) => <span>{row.raceOfDFLs}</span>,
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
      name: "Lot Number RSP",
      selector: (row) => row.lotNumberRSP,
      cell: (row) => <span>{row.lotNumberRSP}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Lot Number CRC",
      selector: (row) => row.lotNumberCRC,
      cell: (row) => <span>{row.lotNumberCRC}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Village",
      selector: (row) => row.village,
      cell: (row) => <span>{row.village}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "District",
      selector: (row) => row.district,
      cell: (row) => <span>{row.district}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "State",
      selector: (row) => row.state,
      cell: (row) => <span>{row.state}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "TSC",
      selector: (row) => row.tsc,
      cell: (row) => <span>{row.tsc}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Sold After Moult",
      selector: (row) => row.soldAfterMoult,
      cell: (row) => <span>{row.soldAfterMoult}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Rate Per 100 DFLs",
      selector: (row) => row.ratePer100DFLs,
      cell: (row) => <span>{row.ratePer100DFLs}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Price",
      selector: (row) => row.price,
      cell: (row) => <span>{row.price}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Dispatch Date",
      selector: (row) => row.dispatchDate,
      cell: (row) => <span>{row.dispatchDate}</span>,
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
    <Layout title="Chawki distribution to Farmers">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Chawki distribution to Farmers</Block.Title>
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
                  to="#"
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
                      <Card.Header>Chawki distribution to Farmers </Card.Header>
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
                                  placeholder="FRUITS-ID"
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
                                Father’s Name
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="fatherName"
                                  name="fatherName"
                                  type="text"
                                  value={data.fatherName}
                                  onChange={handleInputs}
                                  placeholder="Father’s Name"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Source of DFLs
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sourceOfDFLs"
                                  name="sourceOfDFLs"
                                  type="text"
                                  value={data.sourceOfDFLs}
                                  onChange={handleInputs}
                                  placeholder="Source of DFLs"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Race of DFLs
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="raceOfDFLs"
                                  name="raceOfDFLs"
                                  type="text"
                                  value={data.raceOfDFLs}
                                  onChange={handleInputs}
                                  placeholder="Source of DFLs"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Number of DFL’s
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfDFLs"
                                  name="numberOfDFLs"
                                  type="text"
                                  value={data.numberOfDFLs}
                                  onChange={handleInputs}
                                  placeholder="Number of DFL’s"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Lot Number (of the RSP)
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="lotNumberRSP"
                                  name="lotNumberRSP"
                                  type="text"
                                  value={data.lotNumberRSP}
                                  onChange={handleInputs}
                                  placeholder="Lot Number (of the RSP)"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Lot No. (CRC)
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="lotNumberCRC"
                                  name="lotNumberCRC"
                                  type="text"
                                  value={data.lotNumberCRC}
                                  onChange={handleInputs}
                                  placeholder="Lot No. (CRC)"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">Village</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="village"
                                  name="village"
                                  type="text"
                                  value={data.village}
                                  onChange={handleInputs}
                                  placeholder="Village"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">District</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="district"
                                  name="district"
                                  type="text"
                                  value={data.district}
                                  onChange={handleInputs}
                                  placeholder="District"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">State</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="state"
                                  name="state"
                                  type="text"
                                  value={data.state}
                                  onChange={handleInputs}
                                  placeholder="State"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">TSC</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="tsc"
                                  name="tsc"
                                  type="text"
                                  value={data.tsc}
                                  onChange={handleInputs}
                                  placeholder="TSC"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Sold after 1st/2nd Moult
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="soldAfterMoult"
                                  name="soldAfterMoult"
                                  type="text"
                                  value={data.soldAfterMoult}
                                  onChange={handleInputs}
                                  placeholder="Sold after 1st/2nd Moult"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Rate per 100 DFLs(optional)
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="ratePer100DFLs"
                                  name="ratePer100DFLs"
                                  type="text"
                                  value={data.ratePer100DFLs}
                                  onChange={handleInputs}
                                  placeholder="Rate per 100 DFLs(optional)"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Price (in Rupees) (optional)
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="price"
                                  name="price"
                                  type="text"
                                  value={data.price}
                                  onChange={handleInputs}
                                  placeholder="Price (in Rupees) (optional)"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Dispatch date
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="dispatchDate"
                                  name="dispatchDate"
                                  type="text"
                                  value={data.dispatchDate}
                                  onChange={handleInputs}
                                  placeholder="Dispatch date"
                                />

                                <DatePicker
                                  selected={data.dispatchDate}
                                  onChange={(date) =>
                                    handleDateChange(date, "dispatchDate")
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

                          <Col lg="12" className="text-center">
                            <Button type="submit" variant="primary">
                              {" "}
                              Save{" "}
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
                          <Block className="mt-n4">
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

export default ChawkidistributiontoFarmers;
