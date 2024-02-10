import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "react-datepicker";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
// import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function FarmerTransactionReport() {
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: 0,
    allottedLotId: "",
    auctionDate: "",
  });
  console.log("printBid", data);

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const listData = [
    {
      id: "uid01",
      stateName: "name",
      stateNameInKannada: "name",
    },
  ];

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

  const handleDateChange = (date) => {
    setData((prev) => ({ ...prev, auctionDate: date }));
  };
  useEffect(() => {
    handleDateChange(new Date());
  }, []);
  // const _header = { "Content-Type": "application/json", accept: "*/*" };
  // const _header = { "Content-Type": "application/json", accept: "*/*",  'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`, "Access-Control-Allow-Origin": "*"};
  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  // const postData = (e) => {
  //   axios
  //     .post(baseURL + `caste/add`, data, {
  //       headers: _header,
  //     })
  //     .then((response) => {
  //       saveSuccess();
  //     })
  //     .catch((err) => {
  //       setData({});
  //       saveError();
  //     });
  // };

  const postData = (event) => {
    const { marketId, godownId, allottedLotId, auctionDate } = data;
    const newDate = new Date(auctionDate);
    const formattedDate =
      newDate.getFullYear() +
      "-" +
      (newDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      newDate.getDate().toString().padStart(2, "0");

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      axios
        .post(
          `https://api.senovagseri.com/reports/gettripletpdf`,
          {
            marketId: marketId,
            godownId: godownId,
            allottedLotId: allottedLotId,
            auctionDate: formattedDate,
          },
          {
            responseType: "blob", //Force to receive data in a Blob Format
          }
        )
        .then((response) => {
          //console.log("hello world", response.data);
          //Create a Blob from the PDF Stream
          const file = new Blob([response.data], { type: "application/pdf" });
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          //Open the URL on new Window
          window.open(fileURL);
        })
        .catch((error) => {
          // console.log("error", error);
        });
    }
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("/seriui/caste-list");
    });
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const StateDataColumns = [
    {
      name: "Sl No",
      selector: (row) => row.stateName,
      cell: (row) => <span>{row.stateName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Lot Nbr",
      selector: (row) => row.stateNameInKannada,
      cell: (row) => <span>{row.stateNameInKannada}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Date",
      selector: (row) => row.stateNameInKannada,
      cell: (row) => <span>{row.stateNameInKannada}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Breed",
      selector: (row) => row.stateNameInKannada,
      cell: (row) => <span>{row.stateNameInKannada}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Bid Amt",
      selector: (row) => row.stateNameInKannada,
      cell: (row) => <span>{row.stateNameInKannada}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Wt",
      selector: (row) => row.stateNameInKannada,
      cell: (row) => <span>{row.stateNameInKannada}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Trans Amt",
      selector: (row) => row.stateNameInKannada,
      cell: (row) => <span>{row.stateNameInKannada}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "MF",
      selector: (row) => row.stateNameInKannada,
      cell: (row) => <span>{row.stateNameInKannada}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Farmer Amt",
      selector: (row) => row.stateNameInKannada,
      cell: (row) => <span>{row.stateNameInKannada}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title="Farmer Transaction Report">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Farmer Transaction Report</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            {/* <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/caste-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/caste-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul> */}
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        Farmer Number<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={3}>
                        <Form.Control
                          id="allotedLotId"
                          name="allottedLotId"
                          value={data.allottedLotId}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Farmer Number"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Farmer Number is required.
                        </Form.Control.Feedback>
                      </Col>
                      <Form.Label column sm={1}>
                        From Date
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={data.auctionDate}
                            onChange={handleDateChange}
                          />
                        </div>
                      </Col>
                      <Form.Label column sm={1}>
                        To Date
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={data.auctionDate}
                            onChange={handleDateChange}
                          />
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="code">Code</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="code"
                          name="code"
                          value={data.code}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Code"
                        />
                      </div>
                    </Form.Group>
                  </Col> */}
                </Row>
              </Card.Body>
            </Card>

            <Row className="d-flex justify-content-center mt-2">
              <Col sm={2}>
                {/* <Button
                          type="button"
                          variant="primary"
                          onClick={display}
                        > */}
                <Button type="submit" variant="primary">
                  Generate Report
                </Button>
              </Col>
            </Row>

            <Block className="mt-3">
              <Card>
                <Card.Header
                  className="d-flex flex-column justify-content-center align-items-center"
                  style={{ fontWeight: "bold" }}
                >
                  <span style={{ fontSize: "x-large" }}>
                    e-Haraju Farmer Transaction Report - 3085
                  </span>
                  <span>From 20/12/2021 To 20/12/2021</span>
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="12">
                      <Card>
                        <DataTable
                          tableClassName="data-table-head-light table-responsive"
                          columns={StateDataColumns}
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
                      <div>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label
                            column
                            sm={12}
                            style={{ fontWeight: "bold" }}
                          >
                            Farmer Details:{" "}
                            <span>
                              C Narayanaswamy (S/o) (W/o) Venkatappa,
                              Channahalli, Devanahalli
                            </span>
                          </Form.Label>
                        </Form.Group>
                      </div>

                      <div>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label
                            column
                            sm={4}
                            style={{ fontWeight: "bold" }}
                          >
                            Total Sale Amount:{" "}
                            <span style={{ color: "green" }}>
                              {" "}
                              &#8377; {53370}
                            </span>
                          </Form.Label>
                        </Form.Group>

                        <Form.Group as={Row} className="form-group">
                          <Form.Label
                            column
                            sm={4}
                            style={{ fontWeight: "bold" }}
                          >
                            Total Market Amount:{" "}
                            <span style={{ color: "green" }}>
                              {" "}
                              &#8377; {534}
                            </span>
                          </Form.Label>
                        </Form.Group>

                        <Form.Group as={Row} className="form-group">
                          <Form.Label
                            column
                            sm={4}
                            style={{ fontWeight: "bold" }}
                          >
                            Total Amount:{" "}
                            <span style={{ color: "green" }}>
                              &#8377; {52836}
                            </span>
                          </Form.Label>
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            {/* <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </li>
                <li>
                  <Link to="/seriui/caste-list" className="btn btn-secondary border-0">
                    Cancel
                  </Link>
                </li>
              </ul>
            </div> */}
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default FarmerTransactionReport;
