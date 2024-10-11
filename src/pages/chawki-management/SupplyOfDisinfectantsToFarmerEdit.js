import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../components";

import api from "../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;


function SupplyOfDisinfectantsToFarmerEdit() {
//   const [data, setData] = useState({
//     farmerId: "",
//     disinfectantMasterId: "",
//     invoiceNoDate: "",
//     quantity: "",
//     disinfectantName: "",
//     quantitySupplied: "",
//     suppliedDate: "",
//     sizeOfRearingHouse: "",
//     numbersOfDfls: "",
//   });
const { id } = useParams();
const [data, setData] = useState({});
const [loading, setLoading] = useState(false);

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "8%", // Reduced from 20% to 10%
    },
  };
  

  const [validated, setValidated] = useState(false);
  const [searchValidated, setSearchValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

  };

  const handleFruitsInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setFarmerDetails({ ...farmerDetails, [name]: value });

  };

  const [farmerDetails, setFarmerDetails] = useState({
    fruitsId: "",
    farmerName: "",
    fatherName: "",
    villageName: "",
    address: "",
  });


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
       
    // const requestData = {
    //     ...data,
    //     farmerId: farmerDetails.farmerId, // Use farmerId from farmerDetails
    //   };
      api
        .post(baseURL + `cropInspection/update-supply-of-disinfectants-info`, data)
        .then((response) => {
          // debugger;
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data);
            clear();
            // setData({
            //   farmerId: "",
            //     disinfectantMasterId: "",
            //     invoiceNoDate: "",
            //     quantity: "",
            //     disinfectantName: "",
            //     quantitySupplied: "",
            //     suppliedDate: "",
            //     sizeOfRearingHouse: "",
            //     numbersOfDfls: "",
            // });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      farmerId: "",
    disinfectantMasterId: "",
    invoiceNoDate: "",
    quantity: "",
    disinfectantName: "",
    quantitySupplied: "",
    suppliedDate: "",
    sizeOfRearingHouse: "",
    numbersOfDfls: "",
    });
    setFarmerDetails({
      fruitsId: "",
    farmerName: "",
    fatherName: "",
    villageName: "",
    address: "",
    })
  };

   //   to get data from api
   const getIdList = () => {
    setLoading(true);
    // const chowki_id = chawkiList.chowki_id;
    const response = api
      .get(baseURL + `cropInspection/get-by-supply-of-disinfectants-id/${id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        // editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, []);

 
  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // to get Race
  const [disInfectantListData, setDisinfectantListData] = useState([]);

  const getDisinfectantMasterList = () => {
    const response = api
      .get(baseURL2 + `disinfectantMaster/get-all`)
      .then((response) => {
        setDisinfectantListData(response.data.content.disinfectantMaster);
      })
      .catch((err) => {
        setDisinfectantListData([]);
      });
  };

  useEffect(() => {
    getDisinfectantMasterList();
  }, []);

  
  // const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
    //   text: `Receipt Number ${message}`,
    });
  };

  const saveError = (message) => {
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

  return (
    <Layout title="Supply Of Disinfectants">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Supply Of Disinfectants</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/supply-of-disinfectants-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/supply-of-disinfectants-list"
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

      <Block className="mt-n4">
       
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1 ">
            <Block className="mt-3">
              <Card>
                <Card.Header>Supply Of Disinfectants Details</Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    
                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Disinfectant<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="disinfectantMasterId"
                              value={data.disinfectantMasterId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">Select Disinfectant</option>
                              {disInfectantListData.map((list) => (
                                <option
                                  key={list.disinfectantMasterId}
                                  value={list.disinfectantMasterId}
                                >
                                  {list.disinfectantMasterName}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                            Disinfectant is required
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Invoice No and Date
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="invoiceNoDate"
                            name="invoiceNoDate"
                            value={data.invoiceNoDate}
                            onChange={handleInputs}
                            type="text"
                            placeholder=" Enter Invoice No and Date"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Invoice No and Date is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Quantity
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="quantity"
                            name="quantity"
                            value={data.quantity}
                            onChange={handleInputs}
                            type="text"
                            placeholder=" Enter Quantity"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Quantity is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Quantity Supplied
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="quantitySupplied"
                            name="quantitySupplied"
                            value={data.quantitySupplied}
                            onChange={handleInputs}
                            type="text"
                            placeholder=" Enter Quantity Supplied"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Quantity Supplied is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                   
                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                        Disinfectant Name
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="disinfectantName"
                            value={data.disinfectantName}
                            onChange={handleInputs}
                          >
                            <option value="">Select</option>
                            <option value="General">General</option>
                            <option value="Bed">Bed</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          Disinfectant Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Number of DFL’s<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numbersOfDfls"
                            name="numbersOfDfls"
                            value={data.numbersOfDfls}
                            onChange={handleInputs}
                            type="text"
                            // maxLength="4"
                            placeholder=" Number of DFL’s"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Number of DFL’s is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Size Of Rearing House<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="sizeOfRearingHouse"
                            name="sizeOfRearingHouse"
                            value={data.sizeOfRearingHouse}
                            onChange={handleInputs}
                            type="text"
                            // maxLength="4"
                            placeholder="Size Of Rearing House"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Size Of Rearing House is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    
                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                           Date Of Supply
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.suppliedDate ? new Date(data.suppliedDate) : null}
                            onChange={(date) =>
                              handleDateChange(date, "suppliedDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            // minDate={new Date()}
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    Cancel
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default SupplyOfDisinfectantsToFarmerEdit;
