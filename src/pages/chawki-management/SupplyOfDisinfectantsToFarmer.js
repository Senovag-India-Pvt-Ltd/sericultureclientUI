import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
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


function SupplyOfDisinfectantsToFarmers() {
  const [data, setData] = useState({
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

  const [showFarmerDetails, setShowFarmerDetails] = useState(false);

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
       
    const requestData = {
        ...data,
        farmerId: farmerDetails.farmerId, // Use farmerId from farmerDetails
      };
      api
        .post(baseURL + `cropInspection/add-supply-of-disinfectants-info`, requestData)
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
    setShowFarmerDetails(false);
  };

  const search = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setSearchValidated(true);
    } else {
        event.preventDefault();

        api
            .post(baseURLFarmer + `farmer-details/getInspectionFarmerDetailsByFruitsId`, { fruitsId: farmerDetails.fruitsId })
            .then((response) => {
                console.log(response);
                if (!response.data.errorMessages || response.data.errorMessages.length === 0) {
                    // Accessing the farmer details from the correct structure
                    const farmerResponses = response.data.content[0].farmerResponses;
                    
                    // Check if farmerResponses is empty
                    if (!farmerResponses || farmerResponses.length === 0) {
                        searchError("Farmer not found. Please set one of the addresses as default during registration.");
                        return; // Exit the function if no farmers are found
                    }
                    
                    const farmerData = farmerResponses[0]; // Accessing the first farmer response

                    // Setting farmer details
                    setFarmerDetails((prev) => ({
                        ...prev,
                        fruitsId: farmerData.fruitsId,
                        farmerId: farmerData.farmerId, // Store farmerId in farmerDetails
                        farmerName: farmerData.fullName || "",
                        fatherName: farmerData.fatherName || "",
                        address: farmerData.address || "",
                        villageName: farmerData.villageName || "",
                    }));

                    setShowFarmerDetails(true);
                } else {
                    saveError(response.data.errorMessages.join(", "));
                }
            })
            .catch((err) => {
                console.error("Error fetching farmer details:", err);
                if (err.response && err.response.data.validationErrors) {
                    if (Object.keys(err.response.data.validationErrors).length > 0) {
                        searchError(err.response.data.validationErrors);
                    }
                } else {
                    searchError("An unexpected error occurred.");
                }
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
      title: "Saved successfully",
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
        {/* <Form action="#"> */}
        <Form noValidate validated={searchValidated} onSubmit={search}>
          <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="12">
                  <Form.Group as={Row} className="form-group" controlId="fid">
                    <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                      FRUITS ID<span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={4}>
                      <Form.Control
                        type="text"
                        name="fruitsId"
                        value={farmerDetails.fruitsId}
                        onChange={handleFruitsInputs}
                        placeholder="Enter FRUITS ID"
                        required
                        maxLength="16"
                      />
                      <Form.Control.Feedback type="invalid">
                        Fruits ID Should Contain 16 digits
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={2}>
                      <Button type="submit" variant="primary">
                        Search
                      </Button>
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
                          <td>{farmerDetails.farmerName}</td>
                          <td style={styles.ctstyle}>Fruits Id:</td>
                          <td>{farmerDetails.fruitsId}</td>
                          <td style={styles.ctstyle}> Father Name:</td>
                          <td>{farmerDetails.fatherName}</td>
                          <td style={styles.ctstyle}> Village:</td>
                          <td>{farmerDetails.villageName}</td>
                          <td style={styles.ctstyle}> Addres:</td>
                          <td>{farmerDetails.address}</td>
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
                            selected={data.suppliedDate}
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

export default SupplyOfDisinfectantsToFarmers;
