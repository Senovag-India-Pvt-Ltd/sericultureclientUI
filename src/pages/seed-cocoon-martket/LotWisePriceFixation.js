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
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL1 = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function LotWisePriceFixation() {
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
    allottedLotId: "",
  });

  const handleEdit = (_id) => {
    navigate(`/seriui/lot-wise-price-fixation-edit/${_id}`);
    // navigate("/seriui/taluk");
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
        const response = api
          .delete(baseURL1 + `cocoon/delete/${_id}`)
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

  const [validated, setValidated] = useState(false);
  const [isActive,setIsActive] = useState(false);

  const { id } = useParams();
  const { t } = useTranslation();

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const [allottedLotOptions, setAllottedLotOptions] = useState([]);

const getAllottedLotIdsForPrice = async () => {
  try {
    const response = await api.post(
      baseURL1 + `cocoon/getAllottedLotIdsForPrice`
    );

    if (response?.data?.content) {
      setAllottedLotOptions(response.data.content);
    } else {
      setAllottedLotOptions([]);
    }
  } catch (error) {
    setAllottedLotOptions([]);
  }
};
useEffect(() => {
  getAllottedLotIdsForPrice();
}, []);



  const acceptSuccess = () => {
    Swal.fire({
      icon: "success",
      title: t("Price Added successfully"),
      // text: "Auction Accepted Successfully",
    });
    // setIsActive(true);
  };

  const acceptError = (message = t("Something went wrong!")) => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: t("Accept attempt was not successful"),
      html: errorMessage,
    });
  };

  const getList = () => {
    setLoading(true);
    const response = api
      .get(baseURL1 + `cocoon/getPrices`, _params)
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
      .post(baseURL1 + `cocoon/saveLotWiseBasePriceKGLot`, {
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
    name: t("Sl.No."),
    selector: (row) => row.marketId,
    cell: (row,i) => <span>{i+1}</span>,
    sortable: true,
    width: "80px",
    hide: "md",
  },
  {
    name: t("Bidding Slip Lot No"),
    selector: (row) => row.allottedLotId,
    cell: (row) => <span>{row.allottedLotId}</span>,
    sortable: true,
    // width: "100",
    hide: "md",
  },
  {
    name: t("Fixation Date"),
    selector: (row) => row.fixationDate,
    cell: (row) => <span>{row.fixationDate}</span>,
    sortable: true,
    // width: "100",
    hide: "md",
  },
  {
    name: t("Price Per Kg"),
    selector: (row) => row.pricePerKg,
    cell: (row) => <span>{row.pricePerKg}</span>,
    sortable: true,
    // width: "100",
    hide: "md",
  },
  {
        name: "Action",
        cell: (row) => (
          //   Button style
          <div className="text-start w-100">
            {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
            {/* <Button
              variant="primary"
              size="sm"
              onClick={() => handleView(row.raceMarketMasterId)}
            >
              View
            </Button> */}
            {/* <Button
              variant="primary"
              size="sm"
              className="ms-2"
              onClick={() => handleEdit(row.id)}
            >
              Edit
            </Button> */}
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
        // grow: 2,
      },
 
];

  return (
    <Layout title={t("Lot Wise Price Fixation")} show="true">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Lot Wise Price Fixation")}</Block.Title>
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

                    {/* <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                        {t("Bidding Slip Lot No")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <Form.Control
                          id="allottedLotId"
                          name="allottedLotId"
                          value={data.allottedLotId}
                          onChange={handleLotIdInputs}
                          type="number"
                          placeholder={t("Enter Bidding Slip Lot No")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Bidding Slip Lot No is required.")}
                        </Form.Control.Feedback>
                      </Col> */}
                      <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                          {t("Bidding Slip Lot No")}
                          <span className="text-danger">*</span>
                        </Form.Label>

                        <Col sm={2}>
                          <Form.Select
                            id="allottedLotId"
                            name="allottedLotId"
                            value={data.allottedLotId}
                            onChange={handleLotIdInputs}
                            required
                          >
                            <option value="">{t("Select Bidding Slip Lot No")}</option>

                            {allottedLotOptions.map((lotId) => (
                              <option key={lotId} value={lotId}>
                                {lotId}
                              </option>
                            ))}
                          </Form.Select>

                          <Form.Control.Feedback type="invalid">
                            {t("Bidding Slip Lot No is required.")}
                          </Form.Control.Feedback>
                        </Col>


                      <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                        {t("Price")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <Form.Control
                          id="pricePerKg"
                          name="pricePerKg"
                          value={data.pricePerKg}
                          onChange={handleLotIdInputs}
                          type="number"
                          placeholder={t("Enter Price")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Price is required.")}
                        </Form.Control.Feedback>
                      </Col>

                      <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        {t("Market Date")}<span className="text-danger">*</span>
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

                     <Col lg="2">
                      <Button type="submit" variant="primary" className="w-100">
                        {t("Submit")}
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


{/* {isActive ? ( */}
  
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
 
{/* ) : (
  ""
)} */}
      </Block>
    </Layout>
  );
}

export default LotWisePriceFixation;
