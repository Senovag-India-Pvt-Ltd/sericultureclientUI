import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import React, { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { useParams } from "react-router-dom";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL1 = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function BasePriceFixation() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const navigate = useNavigate();

  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    fixationDate: new Date(),
    pricePerKg: "",
  });

  const [validated, setValidated] = useState(false);
  const [isActive,setIsActive] = useState(false);

  const { id } = useParams();

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const acceptSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Price Added successfully",
      // text: "Auction Accepted Successfully",
    });
    setIsActive(true);
  };

  const acceptError = (message = "Something went wrong!") => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Accept attempt was not successful",
      html: errorMessage,
    });
  };

  const getList = () => {
    setLoading(true);
    const response = api
      .get(baseURL1 + `cocoon/getLast10daysBasePrice`, _params)
      .then((response) => {
        setListData(response.data.content);
        // setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [page]);

  const handleLotIdInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

 

//   const postData = (event) => {
//     const form = event.currentTarget;
    
//     if (form.checkValidity() === false) {
//         event.preventDefault();
//         event.stopPropagation();
//         setValidated(true);
//     } else {
//         event.preventDefault();

//         api.post(baseURL1 + `cocoon/saveBasePriceKGLot`, {
//             ...data,
//         })
//         .then((response) => {
//             if (response.data.errorCode === 0) {
//                 acceptSuccess();
//             } else if (response.data.errorCode === -1) {
//                 // Check if content exists and use it, otherwise use errorMessages
//                 if (response.data.content) {
//                     acceptError(response.data.content);
//                 } else if (response.data.errorMessages.length > 0) {
//                     acceptError(response.data.errorMessages[0].message);
//                 } else {
//                     acceptError(); // Default error if no specific message
//                 }
//             }
//         })
//         .catch((err) => {
//             acceptError(); // Handle the error if the API call fails
//         });
//     }
// };

const postData = (event) => {
  const form = event.currentTarget;

  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
  } else {
    event.preventDefault();

    api
      .post(baseURL1 + `cocoon/saveBasePriceKGLot`, {
        ...data,
      })
      .then((response) => {
        if (response.data.errorCode === 0) {
          acceptSuccess();
          getList(); // Refresh the table with the new data
          setData({
            marketId: localStorage.getItem("marketId"),
            fixationDate: new Date(),
            pricePerKg: "",
          }); // Optionally reset the form
        } else if (response.data.errorCode === -1) {
          if (response.data.content) {
            acceptError(response.data.content);
          } else if (response.data.errorMessages.length > 0) {
            acceptError(response.data.errorMessages[0].message);
          } else {
            acceptError(); // Default error if no specific message
          }
        }
      })
      .catch((err) => {
        acceptError(); // Handle the error if the API call fails
      });
  }
};


// const customStyles = {
//   rows: {
//     style: {
//       minHeight: "45px", // override the row height
//     },
//   },
//   headCells: {
//     style: {
//       backgroundColor: "#1e67a8",
//       color: "#fff",
//       fontSize: "14px",
//       paddingLeft: "8px", // override the cell padding for head cells
//       paddingRight: "8px",
//     },
//   },
//   cells: {
//     style: {
//       paddingLeft: "8px", // override the cell padding for data cells
//       paddingRight: "8px",
//     },
//   },
// };
const customStyles = {
  rows: {
    style: {
      minHeight: "30px", // Row height
    },
  },
  headCells: {
    style: {
      backgroundColor: "#1e67a8", // Header background color
      color: "#fff", // Header text color
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "black", // Header cell border color
      paddingLeft: "8px",
      paddingRight: "8px",
    },
  },
  cells: {
    style: {
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "black", // Data cell border color
      paddingTop: "3px",
      paddingBottom: "3px",
      paddingLeft: "8px",
      paddingRight: "8px",
      textAlign: "left", // Set alignment to left for all cells
    },
  },
};


const UserDataColumns = [
  {
    name: "Sl.No.",
    selector: (row) => row.marketId,
    cell: (row,i) => <span>{i+1}</span>,
    sortable: true,
    width: "80px",
    hide: "md",
  },
  {
    name: "Fixation Date",
    selector: (row) => row.fixationDate,
    cell: (row) => <span>{row.fixationDate}</span>,
    sortable: true,
    // width: "100",
    hide: "md",
  },
  {
    name: "Price Per Kg",
    selector: (row) => row.pricePerKg,
    cell: (row) => <span>{row.pricePerKg}</span>,
    sortable: true,
    // width: "100",
    hide: "md",
  },
 
];

  return (
    <Layout title="Base Price Fixation" show="true">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Base Price Fixation</Block.Title>
          </Block.HeadContent>
          {/* <Block.HeadContent>
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
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Row className="g-3 ">
          <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="8">
                  <Form noValidate validated={validated} onSubmit={postData}>
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                        Price
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <Form.Control
                          id="pricePerKg"
                          name="pricePerKg"
                          value={data.pricePerKg}
                          onChange={handleLotIdInputs}
                          type="number"
                          placeholder="Enter Price"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Price is required.
                        </Form.Control.Feedback>
                      </Col>
                      <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        Market Date<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={4} className="ms-n5">
                        <DatePicker
                          selected={data.fixationDate}
                          onChange={(date) =>
                            handleDateChange(date, "fixationDate")
                          }
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          maxDate={new Date()} // Maximum date set to today
                          minDate={new Date()} // Minimum date set to today
                        />
                      </Col>
                      <Col sm={2} className="ms-n5">
                       
                        <Button type="submit" variant="primary">
                          Submit
                        </Button>
                      </Col>
                    </Form.Group>
                  </Form>
                </Col>
                {/* added New End */}
              </Row>
             
            </Card.Body>
          </Card>
        </Row>


{isActive ? (
  
              <Row className="mt-3">
                <Col lg="4">
  <DataTable
    tableClassName="data-table-head-light table-responsive"
    columns={UserDataColumns}
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
  </Col>
  </Row>
 
) : (
  ""
)}
      </Block>
    </Layout>
  );
}

export default BasePriceFixation;
