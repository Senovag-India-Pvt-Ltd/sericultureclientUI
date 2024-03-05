import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

// const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURL = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function SeedCuttingBank() {
  const [data, setData] = useState({
    fruitsId: "",
    farmerName: "",
    quantityOfSeedCuttings: "",
    dateOfPruning: "",
    ratePerTonne: "",
    remittanceDetails: "",
    challanUpload: "",
  });

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
  // const handleDateChange = (newDate) => {
  //   setData({ ...data, applicationDate: newDate });
  // };

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
        .post(baseURL2 + `seed-cutting/add-info`, data)
        .then((response) => {
          if (response.data.seedCuttingBankId) {
            const seedUploadId = response.data.seedCuttingBankId;
            handleChallanUpload(seedUploadId);
          }
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.receiptNo);
            setData({
              fruitsId: "",
              farmerName: "",
              quantityOfSeedCuttings: "",
              dateOfPruning: "",
              ratePerTonne: "",
              remittanceDetails: "",
              challanUpload: "",
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
      quantityOfSeedCuttings: "",
      dateOfPruning: "",
      ratePerTonne: "",
      remittanceDetails: "",
      challanUpload: "",
    });
    setChallan("");
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const search = () => {
    api
      .post(
        "http://13.200.62.144:8000/farmer-registration/v1/farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number",
        { fruitsId: data.fruitsId }
      )
      .then((response) => {
        console.log(response);
        if (!response.data.content.error) {
          if (response.data.content.farmerResponse) {
            const firstName = response.data.content.farmerResponse.firstName;
            const fatherName = response.data.content.farmerResponse.fatherName;
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
  };


  // Display Image
  const [challan, setChallan] = useState("");
  // const [photoFile,setPhotoFile] = useState("")

  const handleChallanChange = (e) => {
    const file = e.target.files[0];
    setChallan(file);
    setData((prev) => ({ ...prev, challanUpload: file.name }));
    // setPhotoFile(file);
  };

  // Upload Image to S3 Bucket
  const handleChallanUpload = async (seedChallanid) => {
    const parameters = `seedCuttingBankId=${seedChallanid}`;
    try {
      const formData = new FormData();
      formData.append("multipartFile", challan);

      const response = await api.post(
        baseURL2 + `seed-cutting/upload-photo?${parameters}`,
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

  const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text:`Receipt Number ${message}`,
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
    <Layout title="Seed cutting bank">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Seed cutting bank</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/seed-cutting-bank-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/seed-cutting-bank-list"
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
                          placeholder="Enter FRUITS ID"
                          required
                          maxLength= "16"
                        />
                        <Form.Control.Feedback type="invalid">
                          Fruits ID Should Contain 16 digits
                        </Form.Control.Feedback>
                      </Col>
                      <Col sm={2}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={search}
                        >
                          Search
                        </Button>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>


        <Block className="mt-3">
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
              Seed Cutting Bank
            </Card.Header>
            <Card.Body>
              {/* <h3>Farmers Details</h3> */}
              <Row className="g-gs">

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="plotNumber">
                      Farmer Name<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="farmerName"
                        name="farmerName"
                        value={data.farmerName}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Farmer Name"
                        required
                      />
                       <Form.Control.Feedback type="invalid">
                    Farmer Name is required
                  </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="plotNumber">
                      Quantity Of Seed Cuttings
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="quantityOfSeedCuttings"
                        name="quantityOfSeedCuttings"
                        value={data.quantityOfSeedCuttings}
                        onChange={handleInputs}
                        type="text"
                        maxLength="5"
                        placeholder="Enter Quantity Of Seed Cuttings"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                    Quantity Of Seed Cuttings is required
                  </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="ratePerTonne">
                      Rate Per Tonne<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="ratePerTonne"
                        name="ratePerTonne"
                        value={data.ratePerTonne}
                        onChange={handleInputs}
                        type="text"
                        maxLength="4"
                        placeholder="Enter Rate Per Tonne"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Rate Per Tonne is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>


                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="ratePerTonne">
                      Remittance Details<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="remittanceDetails"
                        name="remittanceDetails"
                        value={data.remittanceDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter  Remittance Details"
                        required
                      />
                       <Form.Control.Feedback type="invalid">
                      Remittance Details is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="challanUpload">
                      Challan Upload
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        type="file"
                        id="challanUpload"
                        name="challanUpload"
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

                <Form.Label column sm={2}>
                  Date Of Pruning
                  <span className="text-danger">*</span>
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    <DatePicker
                      selected={data.dateOfPruning}
                      onChange={(date) =>
                        handleDateChange(date, "dateOfPruning")
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
                </Col>

                {/* <Col lg="2">
                  <Button type="button" onClick={postDataReceipt}>
                    View Invoice
                  </Button>
                </Col> */}
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
export default SeedCuttingBank;
