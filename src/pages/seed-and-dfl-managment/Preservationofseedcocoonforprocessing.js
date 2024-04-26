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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function Preservationofseedcocoonforprocessing() {
  

  const [data, setData] = useState({
    lotNumber: "",
    raceId: "",
    dateOfSeedCocoonSupply: "",
    nameOfTheGovernmentSeedFarmOrFarmer: "",
    spunOnDate: "",
    cropNumber: "",
    lineNameId: "",
    bedNumberOrKgsOfCocoonsSupplied: "",
    numberOfPupaExamined: "",
    cocoonRejectionDetails: "",
    invoiceNo: "",
    invoiceDate: "",
    ratePerKg: "",
    
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const [validated, setValidated] = useState(false);

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
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
      // event.stopPropagation();
      api
        .post(baseURLSeedDfl + `PreservationOfSeed/add-info`, data)
        .then((response) => {
          // if (response.data.receiptOfDflsId) {
          //   const receiptId = response.data.receiptOfDflsId;
          //   handleReceiptUpload(receiptId);
          // }
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.invoiceNo);
            setData({
              lotNumber: "",
              raceId: "",
              dateOfSeedCocoonSupply: "",
              nameOfTheGovernmentSeedFarmOrFarmer: "",
              spunOnDate: "",
              cropNumber: "",
              lineNameId: "",
              bedNumberOrKgsOfCocoonsSupplied: "",
              numberOfPupaExamined: "",
              cocoonRejectionDetails: "",
              invoiceNo: "",
              invoiceDate: "",
              ratePerKg: "",
            });
            // setReceiptUpload("")
            // document.getElementById("viewReceipt").value = "";
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
      lotNumber: "",
      raceId: "",
      dateOfSeedCocoonSupply: "",
      nameOfTheGovernmentSeedFarmOrFarmer: "",
      spunOnDate: "",
      cropNumber: "",
      lineNameId: "",
      bedNumberOrKgsOfCocoonsSupplied: "",
      numberOfPupaExamined: "",
      cocoonRejectionDetails: "",
      invoiceNo: "",
      invoiceDate: "",
      ratePerKg: "",
    })
  }

// to get Lot
const [lineNameListData, setLineNameListData] = useState([]);

const getLineNameLotList = () => {
  api
    .get(baseURL+ `lineNameMaster/get-all`)
    .then((response) => {
      setLineNameListData(response.data.content.lineNameMaster);
    })
    .catch((err) => {
      setLineNameListData([]);
    });
};

useEffect(() => {
  getLineNameLotList();
}, []);

  // to get Lot
  const [lotListData, setLotListData] = useState([]);

  const getLotList = () => {
    api
      .get(baseURLSeedDfl + `ReceiptOfDflsFromP4GrainageLinesController/get-all-lot-number-list`)
      .then((response) => {
        setLotListData(response.data);
      })
      .catch((err) => {
        setLotListData([]);
      });
  };

  useEffect(() => {
    getLotList();
  }, []);


   // to get Race
   const [raceListData, setRaceListData] = useState([]);

   const getRaceList = () => {
     const response = api
       .get(baseURL + `raceMaster/get-all`)
       .then((response) => {
         setRaceListData(response.data.content.raceMaster);
       })
       .catch((err) => {
         setRaceListData([]);
       });
   };
 
   useEffect(() => {
     getRaceList();
   }, []);
  

   const navigate = useNavigate();
   const saveSuccess = (message) => {
     Swal.fire({
       icon: "success",
       title: "Saved successfully",
       text: message,
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
    <Layout title="Preservation of seed Cocoon for processing">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Preservation of seed cocoon for processing
            </Block.Title>
            
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/preservation-of-seed-cocoon-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/preservation-of-seed-cocoon-list"
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
          {/* <Row className="g-3 "> */}
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
            Preservation of seed cocoon for processing
            </Card.Header>
            <Card.Body>
              {/* <h3>Farmers Details</h3> */}
              <Row className="g-gs">
                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                    Lot Number<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="lotNumber"
                          value={data.lotNumber}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                        >
                          <option value="">Select Lot Number</option>
                          {lotListData && lotListData.length?(lotListData.map((list) => (
                            <option
                              key={list.id}
                              value={list.lotNumber}
                            >
                              {list.lotNumber}
                            </option>
                          ))):""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        Lot Number is required
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>
                
                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Race<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="raceId"
                          value={data.raceId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                        >
                          <option value="">Select Race</option>
                          {raceListData.map((list) => (
                            <option
                              key={list.raceMasterId}
                              value={list.raceMasterId}
                            >
                              {list.raceMasterName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Race is required
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                          <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                    Name of the Government Seed Farm/Farmer<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="nameOfTheGovernmentSeedFarmOrFarmer"
                        name="nameOfTheGovernmentSeedFarmOrFarmer"
                        value={data.nameOfTheGovernmentSeedFarmOrFarmer}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Name of the Government Seed Farm/Farmer"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Name of the Government Seed Farm/Farmer is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="numberOfDFLsReceived">
                    Crop Number
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="cropNumber"
                        name="cropNumber"
                        value={data.cropNumber}
                        onChange={handleInputs}
                        // maxLength="4"
                        type="number"
                        placeholder="Enter Crop Number"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Crop Number is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Line Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="lineNameId"
                          value={data.lineNameId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                        >
                          <option value="">Select Line Name</option>
                          {lineNameListData.map((list) => (
                            <option
                              key={list.lineNameId}
                              value={list.lineNameId}
                            >
                              {list.lineName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Line Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                    Bed Number/Kgs of cocoons supplied<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="bedNumberOrKgsOfCocoonsSupplied"
                        name="bedNumberOrKgsOfCocoonsSupplied"
                        value={data.bedNumberOrKgsOfCocoonsSupplied}
                        onChange={handleInputs}
                        type="number"
                        placeholder="Enter Bed Number/Kgs of cocoons supplied"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Bed Number/Kgs of cocoons supplied is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                    Number of pupa examined<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="numberOfPupaExamined"
                        name="numberOfPupaExamined"
                        value={data.numberOfPupaExamined}
                        onChange={handleInputs}
                        type="number"
                        placeholder="Enter Number of pupa examined"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Number of pupa examined is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                    Cocoon rejection details/ numbers<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="cocoonRejectionDetails"
                        name="cocoonRejectionDetails"
                        value={data.cocoonRejectionDetails}
                        onChange={handleInputs}
                        type="number"
                        placeholder="Enter Cocoon rejection details/ numbers"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Cocoon rejection details/ numbers is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                    Rate Per Kg<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="ratePerKg"
                        name="ratePerKg"
                        value={data.ratePerKg}
                        onChange={handleInputs}
                        type="number"
                        placeholder="Enter Rate Per Kg"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Rate Per Kg is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>
               

                <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                              Date of seed cocoon supply<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="Date of seed cocoon supply">
                                <DatePicker
                                  selected={data.dateOfSeedCocoonSupply}
                                  onChange={(date) =>
                                    handleDateChange(date, "dateOfSeedCocoonSupply")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  // maxDate={new Date()}
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
                      Spun On Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.spunOnDate}
                        onChange={(date) =>
                          handleDateChange(date, "spunOnDate")
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
                      Invoice Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.invoiceDate}
                        onChange={(date) =>
                          handleDateChange(date, "invoiceDate")
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

                
              </Row>
            </Card.Body>
          </Card>

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
          {/* </Row> */}
        </Form>
      </Block>
    </Layout>
  );
}
export default Preservationofseedcocoonforprocessing;
