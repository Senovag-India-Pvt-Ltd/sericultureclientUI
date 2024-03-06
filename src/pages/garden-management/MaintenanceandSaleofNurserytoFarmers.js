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

const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function MaintenanceandSaleofNurserytoFarmers() {
  const [data, setData] = useState({
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

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "20%",
    },
  };

  const [validated, setValidated] = useState(false);
  const [searchValidated, setSearchValidated] = useState(false);

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

      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }
      api
        .post(baseURL + `Maintenance-sale/add-info`, data)
        .then((response) => {
          if (response.data.mainAndSaleOfNurseryId) {
            const nurseryId = response.data.mainAndSaleOfNurseryId;
            handleChallanUpload(nurseryId);
          }
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.receiptNo);
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
    setChallan("");
  };

  const search = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setSearchValidated(true);
    } else {
      event.preventDefault();
      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }
      api
        .post(
          baseURLFarmer +
            `farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number`,
          { fruitsId: data.fruitsId }
        )
        .then((response) => {
          console.log(response);
          if (!response.data.content.error) {
            if (response.data.content.farmerResponse) {
              const firstName = response.data.content.farmerResponse.firstName;
              const fatherName =
                response.data.content.farmerResponse.fatherName;
              setData((prev) => ({
                ...prev,
                farmerName: firstName,
                fatherName: fatherName,
              }));
            }
          } else {
            saveError(response.data.content.error_description);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        });
    }
  };

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

  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: `Receipt Number ${message}`,
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
                        type="fruitsId"
                        name="fruitsId"
                        value={data.fruitsId}
                        onChange={handleInputs}
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
                    {/* <Col sm={2}>
                        <Button
                          type="button"
                          variant="primary"
                          href="https://fruits.karnataka.gov.in/OnlineUserLogin.aspx"
                          target="_blank"
                          // onClick={search}
                        >
                          Generate FRUITS ID
                        </Button>
                      </Col> */}
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1 ">
            <Block className="mt-3">
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  Maintenance and Sale of Nursery to Farmers
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Farmer’s name<span className="text-danger">*</span>
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
                              data.mulberryVarietyId === undefined ||
                              data.mulberryVarietyId === "0"
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
                        <Form.Label htmlFor="sordfl">
                          Area<span className="text-danger">*</span>
                        </Form.Label>
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
                        <Form.Label htmlFor="sordfl">
                          Quantity(No Of Saplings)
                          <span className="text-danger">*</span>
                        </Form.Label>
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
                        <Form.Label htmlFor="sordfl">
                          Rate<span className="text-danger">*</span>
                        </Form.Label>
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
                          Sapling age in Month/Year
                          <span className="text-danger">*</span>
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
                          Remittance details
                          <span className="text-danger">*</span>
                          <span className="text-danger">*</span>
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
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Sale Date<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.date}
                            onChange={(date) => handleDateChange(date, "date")}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            required
                          />
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
                          ""
                        )}
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

export default MaintenanceandSaleofNurserytoFarmers;
