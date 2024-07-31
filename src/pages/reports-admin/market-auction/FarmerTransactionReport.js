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
import api from "../../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;

function FarmerTransactionReport() {
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: 0,
    farmerNumber: "",
    reportFromDate: new Date(),
    reportToDate: new Date(),
  });
  console.log("printBid", data);
  const [farmerNumber, setFarmerNumber] = useState("");
  const [farmerDetails, setFarmerDetails] = useState({});
  const [farmerAddress, setFarmerAddress] = useState({});
  const [farmer, setFarmer] = useState({
    text: "",
    select: "mobileNumber",
  });

  const [validated, setValidated] = useState(false);
  const [validatedDisplay, setValidatedDisplay] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showFarmerDetails, setShowFarmerDetails] = useState(false);

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "10%",
    },
    top: {
      backgroundColor: "rgb(15, 108, 190, 1)",
      color: "rgb(255, 255, 255)",
      width: "50%",
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    bottom: {
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    sweetsize: {
      width: "100px",
      height: "100px",
    },
  };

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const searchError = (message = "Something went wrong!") => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Details not Found",
      html: errorMessage,
    });
  };

  const handleFarmerIdInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setFarmer({ ...farmer, [name]: value });
  };

  const display = (event) => {
    // const fruitsId = farmer.fruitsId;
    // const { fruitsId, farmerNumber, mobileNumber } = farmer;
    // if (fruitsId) {

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedDisplay(true);
    } else {
      event.preventDefault();

      // setData({
      //   farmerId: "",
      //   sourceMasterId: "",
      //   raceMasterId: "",
      //   dflCount: "",
      //   estimatedWeight: "",
      //   numberOfLot: "",
      //   numberOfSmallBin: "",
      //   numberOfBigBin: "",
      //   marketId: localStorage.getItem("marketId"),
      //   godownId: localStorage.getItem("godownId")
      //     ? localStorage.getItem("godownId")
      //     : 0,
      // });
      setFarmerNumber("");
      setValidatedDisplay(false);
      setFarmerDetails({});
      setFarmerAddress({});

      const { text, select } = farmer;
      let sendData;

      if (select === "mobileNumber") {
        sendData = {
          mobileNumber: text,
        };
      }
      if (select === "fruitsId") {
        sendData = {
          fruitsId: text,
        };
      }
      if (select === "farmerNumber") {
        sendData = {
          farmerNumber: text,
        };
      }

      setLoading(true);

      api
        .post(
          baseURLFarmer +
            `farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number`,
          sendData
        )
        .then((response) => {
          if (!response.data.content.error) {
            const farmerResponse = response.data.content.farmerResponse;
            setFarmerNumber(farmerResponse.farmerNumber);
            console.log("Response:", response.data.content.farmerResponse);
            console.log("hello", response.data.content);
            // const res = response.data.content.farmerBankAccount;
            setFarmerDetails(response.data.content.farmerResponse);
            setFarmerAddress(response.data.content.farmerAddressList);
            setData((prev) => {
              return {
                ...prev,
                farmerId: response.data.content.farmerResponse.farmerId,
              };
            });
            setLoading(false);
            setIsActive(true);
            setShowFarmerDetails(true);
            // if (res) {
            //   setBank({
            //     farmerBankName:
            //       response.data.content.farmerBankAccount.farmerBankName,
            //     farmerBankAccountNumber:
            //       response.data.content.farmerBankAccount
            //         .farmerBankAccountNumber,
            //     farmerBankBranchName:
            //       response.data.content.farmerBankAccount.farmerBankBranchName,
            //     farmerBankIfscCode:
            //       response.data.content.farmerBankAccount.farmerBankIfscCode,
            //   });
            // }
          } else {
            searchError(response.data.content.error_description);
          }

          //   // Logs after updating state
          // console.log('After updating state - farmerDetails:', farmerDetails);
          // console.log('After updating state - Bank Name:', farmerDetails && farmerDetails.farmerBankName);
        })
        .catch((err) => {
          console.error("Error fetching farmer details:", err);
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              searchError(err.response.data.validationErrors);
            }
          } else {
            Swal.fire({
              icon: "warning",
              title: "Details not Found",
            });
          }
          setFarmerDetails({});
          setLoading(false);
        });
    }
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

  const handleFromDateChange = (date) => {
    setData((prev) => ({ ...prev, reportFromDate: date }));
  };

  const handleToDateChange = (date) => {
    setData((prev) => ({ ...prev, reportToDate: date }));
  };

  useEffect(() => {
    handleFromDateChange(new Date());
    handleToDateChange(new Date());
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
    const { marketId, godownId, reportFromDate, reportToDate } =
      data;
    const formattedFromDate =
      reportFromDate.getFullYear() +
      "-" +
      (reportFromDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      reportFromDate.getDate().toString().padStart(2, "0");

    const formattedToDate =
      reportToDate.getFullYear() +
      "-" +
      (reportToDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      reportToDate.getDate().toString().padStart(2, "0");

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      api
        .post(
          baseURLReport + `get-farmer-txn-report`,
          {
            marketId: marketId,
            godownId: godownId,
            reportFromDate: formattedFromDate,
            reportToDate: formattedToDate,
            farmerNumber: farmerNumber,
          },
          {
            responseType: "blob", //Force to receive data in a Blob Format
          }
        )
        .then((response) => {
          console.log(response.data.size);
          if (response.data.size > 800) {
            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          } else {
            Swal.fire({
              icon: "warning",
              title: "No Record Found",
            });
          }
          //console.log("hello world", response.data);
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

      <Block className="mt-n3">
        {/* <Form action="#"> */}
        <Form noValidate validated={validatedDisplay} onSubmit={display}>
          <Card>
            <Card.Body>
              <Row className="g-gs">
                {/* <Col lg="12">
                    <Form.Group as={Row} className="form-group" id="fid">
                      <Form.Label column sm={3}>
                        FRUITS ID / FARMER NUMBER<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={3}>
                        <Form.Control
                          id="fruitsId"
                          name="fruitsId"
                          value={farmer.fruitsId}
                          onChange={handleFarmerIdInputs}
                          type="text"
                          placeholder="Enter FRUITS ID / FARMER NUMBER"
                        />
                      </Col> */}
                <Col sm={6} lg={6}>
                  <Form.Group as={Row} className="form-group" id="fid">
                    <Form.Label column sm={1} lg={4}>
                      Search Farmer Details By
                    </Form.Label>
                    <Col sm={1} lg={3}>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="select"
                          value={farmer.select}
                          onChange={handleFarmerIdInputs}
                        >
                          {/* <option value="">Select</option> */}
                          <option value="mobileNumber">Mobile Number</option>
                          <option value="fruitsId">Fruits Id</option>
                          <option value="farmerNumber">Farmer Number</option>
                        </Form.Select>
                      </div>
                    </Col>

                    <Col sm={2} lg={3}>
                      <Form.Control
                        id="fruitsId"
                        name="text"
                        value={farmer.text}
                        onChange={handleFarmerIdInputs}
                        type="text"
                        placeholder="Search"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Field Value is Required
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={2} lg={2}>
                      <Button type="submit" variant="primary">
                        Search
                      </Button>
                    </Col>
                  </Form.Group>
                </Col>
                <Col sm={6} lg={6}>
                  <Form.Group as={Row} className="form-group" id="fid">
                    <Form.Label column sm={2}>
                      From Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={3}>
                      <div className="form-control-wrap">
                        <DatePicker
                          dateFormat="dd/MM/yyyy"
                          selected={data.reportFromDate}
                          onChange={handleFromDateChange}
                          maxDate={new Date()}
                          className="form-control"
                        />
                      </div>
                    </Col>
                    <Form.Label column sm={2}>
                      To Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={3}>
                      <div className="form-control-wrap">
                        <DatePicker
                          dateFormat="dd/MM/yyyy"
                          selected={data.reportToDate}
                          onChange={handleToDateChange}
                          maxDate={new Date()}
                          className="form-control"
                        />
                      </div>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              {showFarmerDetails && (
                // <Col lg="12" className="mt-1">
                //   <Card>
                //     <Card.Header>Farmer Personal Info</Card.Header>
                //     <Card.Body>
                <Row className="g-gs mt-1">
                  <Col lg="12">
                    <table className="table small table-bordered">
                      <tbody>
                        <tr>
                          <td style={styles.ctstyle}> Farmer Name:</td>
                          <td>{farmerDetails.firstName}</td>
                          <td style={styles.ctstyle}> Father Name:</td>
                          <td>{farmerDetails.fatherName}</td>
                          <td style={styles.ctstyle}> Mobile Number :</td>
                          <td>{farmerDetails.mobileNumber}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Form>
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
           

            <Row className="d-flex justify-content-center mt-4">
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

            {/* <Block className="mt-3">
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
            </Block> */}

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
