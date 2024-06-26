import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";
// import "react-datepicker/dist/react-datepicker.css";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";
import api from "../../../src/services/auth/api";

import { Link, useParams } from "react-router-dom";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function MaintenanceandSaleofNurserytoFarmersEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "fruitsId" && (value.length < 16 || value.length > 16)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "fruitsId" && value.length === 16) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    } 
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();

      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }
      api
        .post(baseURL + `Maintenance-sale/update-info`, data)
        .then((response) => {
          const mainAndSaleOfNurseryId = response.data.mainAndSaleOfNurseryId;
          if (mainAndSaleOfNurseryId) {
            handleChallanUpload(mainAndSaleOfNurseryId);
          }
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              fruitsId: "",
              farmerName: "",
              mulberryVarietyId: "",
              area: "",
              dateOfPlanting: "",
              nurserySaleDetails: "",
              quantity: "",
              date: "",
              rate: "",
              saplingAge: "",
              remittanceDetails: "",
              challanUploadKey: "",
            });
            setChallanFile("");
            document.getElementById("challanUploadKey").value = "";
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      fruitsId: "",
      farmerName: "",
      mulberryVarietyId: "",
      area: "",
      dateOfPlanting: "",
      nurserySaleDetails: "",
      quantity: "",
      date: "",
      rate: "",
      saplingAge: "",
      remittanceDetails: "",
      challanUploadKey: "",
    });
    setChallanFile("");
    document.getElementById("challanUploadKey").value = "";
  };

  const isDataPlantingSet = !!data.dateOfPlanting;
  const isDataDateSet = !!data.date;
  
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `Maintenance-sale/get-info-by-id/${id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
        if (response.data.challanUploadKey) {
          getChallanFile(response.data.challanUploadKey);
        }
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
  }, [id]);

  // to get Mulberry Variety
  const [varietyListData, setVarietyListData] = useState([]);

  const getVarietyList = () => {
    const response = api
      .get(baseURL2 + `mulberry-variety/get-all`)
      .then((response) => {
        setVarietyListData(response.data.content.mulberryVariety);
      })
      .catch((err) => {
        setVarietyListData([]);
      });
  };

  useEffect(() => {
    getVarietyList();
  }, []);

   // Display Image
   const [challan, setChallan] = useState("");
   // const [photoFile,setPhotoFile] = useState("")
 
   const handleChallanChange = (e) => {
     const file = e.target.files[0];
     setChallan(file);
     setData((prev) => ({ ...prev, challanUploadKey: file.name }));
     // setPhotoFile(file);
   };
 
   // Upload Image to S3 Bucket
   const handleChallanUpload = async (nurseryFarmerid) => {
     const parameters = `mainAndSaleOfNurseryId=${nurseryFarmerid}`;
     try {
       const formData = new FormData();
       formData.append("multipartFile", challan);
 
       const response = await api.post(
         baseURL + `Maintenance-sale/upload-photo?${parameters}`,
         formData,
         {
           headers: {
             "Content-Type": "multipart/form-data",
           },
         }
       );
       console.log("File upload response:", response.data);
     } catch (error) {
       console.error("Error uploading file:", error);
     }
   };
 
   // To get Photo from S3 Bucket
   const [selectedChallanFile, setChallanFile] = useState(null);
 
   const getChallanFile = async (file) => {
     const parameters = `fileName=${file}`;
     try {
       const response = await api.get(
         baseURL + `v1/api/s3/download?${parameters}`,
         {
           responseType: "arraybuffer",
         }
       );
       const blob = new Blob([response.data]);
       const url = URL.createObjectURL(blob);
       setChallanFile(url);
     } catch (error) {
       console.error("Error fetching file:", error);
     }
   };

  const navigate = useNavigate();
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    });
  };
  const updateError = (message) => {
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
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("#"));
  };

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
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/maintenance-and-sale-of-nursery-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/maintenance-and-sale-of-nursery-list"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1 ">
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
                          type="fruitsId"
                          name="fruitsId"
                          value={data.fruitsId}
                          onChange={handleInputs}
                          placeholder="Enter FRUITS ID "
                          required
                          maxLength= "16"
                        />
                        <Form.Control.Feedback type="invalid">
                          Fruits ID Should Contain 16 digits
                        </Form.Control.Feedback>
                      </Col>
                      {/* <Col sm={2}>
                        <Button
                          type="button"
                          variant="primary"
                          // onClick={display}
                        >
                          Search
                        </Button>
                      </Col> */}
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

        <Block className="mt-3">
          {/* <Row className="g-3 "> */}
            <Card>
              <Card.Header style={{ fontWeight: "bold" }}>
                Maintenance and Sale of Nursery to Farmers
              </Card.Header>
                      <Card.Body>
                      {loading ? (
                        <h1 className="d-flex justify-content-center align-items-center">
                          Loading...
                        </h1>
                      ) : (
                        <Row className="g-gs">
                       

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Farmer Name<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="farmerName"
                                  name="farmerName"
                                  type="text"
                                  value={data.farmerName}
                                  onChange={handleInputs}
                                  placeholder="Enter Farmer’s name"
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                  Farmer Name is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Mulberry Variety<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="mulberryVarietyId"
                        value={data.mulberryVarietyId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        // multiple
                        required
                        isInvalid={
                          data.mulberryVarietyId === undefined || data.mulberryVarietyId === "0"
                        }
                      >
                        <option value="">Select Mulberry Variety</option>
                        {varietyListData.map((list) => (
                          <option
                            key={list.mulberryVarietyId}
                            value={list.mulberryVarietyId}
                          >
                            {list.mulberryVarietyName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Mulberry Variety is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">Area<span className="text-danger">*</span></Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="area"
                                  name="area"
                                  value={data.area}
                                  onChange={handleInputs}
                                  type="text"
                                  maxLength="4"
                                  placeholder="Enter Area"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                Area is required
                              </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>                

                            {/* <Col lg="4">
                              <Form.Group className="form-group mt-n4">
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
                                    placeholder="Enter Nursery sale details"
                                  />
                                </div>
                              </Form.Group>
                            </Col> */}

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">Quantity(No Of Saplings)<span className="text-danger">*</span></Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="quantity"
                                  name="quantity"
                                  value={data.quantity}
                                  onChange={handleInputs}
                                  type="text"
                                  maxLength="5"
                                  placeholder=" Enter Quantity(No Of Saplings)"
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                 Quantity(No Of Saplings) is required
                              </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">Rate<span className="text-danger">*</span></Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="rate"
                                  name="rate"
                                  value={data.rate}
                                  onChange={handleInputs}
                                  type="text"
                                  maxLength="3"
                                  placeholder="Enter Rate"
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                 Rate is required
                              </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Sapling age in Month/Year<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="saplingAge"
                                  name="saplingAge"
                                  value={data.saplingAge}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Sapling age in Month/Year"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                 Sapling age in Month/Year is required
                              </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          {/* <Col lg="4">
                            <Form.Group className="form-group mt-n4">
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
                            <Form.Group className="form-group mt-n4">
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
                                  placeholder="Enter Receipt number"
                                />
                              </div>
                            </Form.Group>
                          </Col> */}

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Remittance details<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="remittanceDetails"
                                  name="remittanceDetails"
                                  type="text"
                                  value={data.remittanceDetails}
                                  onChange={handleInputs}
                                  placeholder="Enter Remittance details"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                Remittance details is required
                              </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                       

                          <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Date of planting<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                              {isDataPlantingSet && (
                                <DatePicker
                                  selected={new Date(data.dateOfPlanting)}
                                  onChange={(date) =>
                                    handleDateChange(date, "dateOfPlanting")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  required
                                />
                                )}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">Sale Date<span className="text-danger">*</span></Form.Label>
                              <div className="form-control-wrap">
                              {isDataDateSet && (
                                <DatePicker
                                  selected={new Date(data.date)}
                                  onChange={(date) =>
                                    handleDateChange(date, "date")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  required
                                />
                              )}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="challanUploadKey">
                        Upload Challan
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          type="file"
                          id="challanUploadKey"
                          name="challanUploadKey"
                          // value={data.photoPath}
                          onChange={handleChallanChange}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3 d-flex justify-content-center">
                      {challan ? (
                        <img
                          style={{ height: "100px", width: "100px" }}
                          src={URL.createObjectURL(challan)}
                        />
                     ) : (
                          selectedChallanFile && (
                            <img
                              style={{ height: "100px", width: "100px" }}
                              src={selectedChallanFile}
                              alt="Selected File"
                            />
                          )
                        )}
                    </Form.Group>
                  </Col>

                          </Row>
                          )}
                          </Card.Body>
                      </Card>
                    </Block>

                  <div className="gap-col">
                <ul className="d-flex align-items-center justify-content-center gap g-3">
                  <li>
                    {/* <Button type="button" variant="primary" onClick={postData}> */}
                    <Button type="submit" variant="primary">
                      Update
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

export default MaintenanceandSaleofNurserytoFarmersEdit;
