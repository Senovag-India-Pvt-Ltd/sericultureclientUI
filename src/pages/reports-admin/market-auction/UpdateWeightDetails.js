import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import DataTable, { defaultThemes } from "react-data-table-component";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "react-datepicker";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function UpdateWeightDetails() {
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    allottedLotId: "",
    auctionDate:new Date()
  });

  const [realReelerId, setRealReelerId] = useState("");

  console.log("printBid", data);

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

const handleDateChange = (date) => {
  setData((prev) => ({ ...prev, auctionDate: date }));
};
useEffect(() => {
  handleDateChange(new Date());
}, []);

  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  const [searchValidated, setSearchValidated] = useState(false);

   const search = (event) => {
    const { allottedLotId, marketId, auctionDate } = data;
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
      setSearchValidated(true);
    } else {
      event.preventDefault();
     
            api
              .post(
                baseURLMarket +
                  `auction/updateWeight/getWeighmentWeightDetails`,
                  {
                    allottedLotId: allottedLotId,
                    auctionDate: formattedDate,
                    marketId: marketId,
                  },
              )
              .then((response) => {
                // Handle successful response here
                console.log(response.data);
                setListData(response.data.content);
                setLoading(false);
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
                    title: "Details Not Found for This Lot and Auction Date",
                  });
                }
                // setFarmerDetails({});
                setLoading(false);
              });
          }
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
 
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const customStyles = {
    rows: {
      style: {
        minHeight: "30px", // adjust this value to your desired row height
      },
    },
   
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        borderStyle: "solid",
        bordertWidth: "1px",
        borderColor: "black",
      },
    },
    cells: {
      style: {
        borderStyle: "solid",
        borderWidth: "1px",
        paddingTop: "3px",
        paddingBottom: "3px",
        paddingLeft: "8px",
        paddingRight: "8px",
        borderColor: "black",
      },
    },
  };

  const [updatedWeights, setUpdatedWeights] = useState({});

  // Handler for updating weight
  const handleWeightChange = (rowId, value) => {
    setUpdatedWeights((prev) => ({
      ...prev,
      [rowId]: value,
    }));
  };

  const WeightDataColumns = [
   
    {
      name: "Crate Number",
      selector: (row) => row.crateNumber,
      cell: (row) => <span>{row.crateNumber}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: "Net Weight",
      selector: (row) => row.netWeight,
      cell: (row) => <span>{row.netWeight}</span>,
      sortable: true,
      hide: "md",
    },
   
    {
        name: "Update Weight",
        selector: (row) => row.actualAmount,
        cell: (row) => (
          <input
            type="text"
            value={updatedWeights[row.id] || row.actualAmount}
            onChange={(e) => handleWeightChange(row.id, e.target.value)}
          />
        ),
        sortable: true,
        hide: "md",
      },
    
  ];

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    })
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };
  return (
    <Layout title="Update Weight">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Update Weight</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
           
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={search}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                        Lot Number
                      </Form.Label>
                      <Col sm={3}>
                        <Form.Control
                          id="allottedLotId"
                          name="allottedLotId"
                          value={data.allottedLotId}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Lot Number"
                          // required
                        />
                        {/* <Form.Control.Feedback type="invalid">
                          Reeler Number is required.
                        </Form.Control.Feedback> */}
                      </Col>
                     
                      <Form.Label column sm={1}>
                        Auction Date
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={data.auctionDate}
                            onChange={handleDateChange}
                            className="form-control"
                            maxDate={new Date()}
                          />
                        </div>
                      </Col>
                    
                      <Col sm={2}>
                        <Button type="submit" variant="primary">
                          Search
                        </Button>
                      </Col>
                        </Form.Group>
                    </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>
        </Form>
      </Block>

         <Block className="mt-3">
        <Card>
        <DataTable
            //  title="Market List"
            tableClassName="data-table-head-light table-responsive"
            columns={WeightDataColumns}
            data={listData}
            highlightOnHover
            // pagination
            // paginationServer
            // paginationTotalRows={totalRows}
            // paginationPerPage={countPerPage}
            // paginationComponentOptions={{
            //   noRowsPerPage: true,
            // }}
            // onChangePage={(page) => setPage(page - 1)}
            progressPending={loading}
            theme="solarized"
            customStyles={customStyles}
          />
           <div className="d-flex justify-content-center mt-3">
            <Button color="primary" onClick={handleWeightChange}>
                Update Weight
            </Button>
        </div>
        </Card>
      </Block>
    </Layout>
  );
}

export default UpdateWeightDetails;
