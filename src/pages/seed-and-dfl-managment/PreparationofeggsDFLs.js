import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import axios from "axios";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function PreparationofeggsDFLs() {

  const [validated, setValidated] = useState(false);

  const [data, setData] = useState({
    numberOfCocoonsCB: "",
    dateOfMothEmergence: "",
    laidOnDate: "",
    eggSheetSerialNumber: "",
    numberOfPairs: "",
    numberOfRejection: "",
    dflsObtained: "",
    eggRecoveryPercentage: "",
    testResults: "",
    additionalRemarks: "",
    // varietyId: "",
    generationNumberId: "",
    lineNameId: "",
    raceId: "",
    parentLotNumber: "",
    selectedCocoon: "",
    rejectedCocoon: "",
    numberOfPairsSelectedCocoons:"",
    numberOfPairsRejectedCocoons: "",
    eggRecoveryPercentageselectedCocoons:"",
    eggRecoveryPercentagerRejectedCocoons: "",
    eggSheetSerialNos:"",
    remainingDFLs:"",
  });

  
  let name, value;
  // const handleInputs = (e) => {
  //   name = e.target.name;
  //   value = e.target.value;
  //   setData({ ...data, [name]: value });
  // };
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
  
    // Update the data state for the input field
    setData((prevData) => {
      // Calculate DFLs obtained if numberOfPairs or numberOfRejection is updated
      let dflsObtained = prevData.dflsObtained;
      if (name === "numberOfPairs" || name === "numberOfRejection") {
        const numberOfPairs = name === "numberOfPairs" ? parseInt(value) : parseInt(prevData.numberOfPairs);
        const numberOfRejection = name === "numberOfRejection" ? parseInt(value) : parseInt(prevData.numberOfRejection);
        dflsObtained = numberOfPairs - numberOfRejection;
      }
  
      return { ...prevData, [name]: value, dflsObtained };
    });
  };

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
      api
        .post(baseURLSeedDfl + `EggPreparation/add-info`, data)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess2(response.data.message, response.data.lotNumber);
            clear();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      numberOfCocoonsCB: "",
      dateOfMothEmergence: "",
      laidOnDate: "",
      eggSheetSerialNumber: "",
      numberOfPairs: "",
      numberOfRejection: "",
      dflsObtained: "",
      eggRecoveryPercentage: "",
      testResults: "",
      certification: "",
      additionalRemarks: "",
      varietyId: "",
      generationNumberId: "",
      lineNameId: "",
      raceId: "",
      parentLotNumber: "",
      selectedCocoon: "",
      rejectedCocoon: "",
      numberOfPairsSelectedCocoons:"",
      numberOfPairsRejectedCocoons: "",
      eggRecoveryPercentageselectedCocoons:"",
      eggRecoveryPercentagerRejectedCocoons: "",
      eggSheetSerialNos:"",
      remainingDFLs:"",
    });
    setValidated(false);
  };

   // to get Lot
   const [lotListData, setLotListData] = useState([]);

   const getLotList = () => {
     const response = api
       .get(baseURLSeedDfl + `PreservationOfSeed/get-all-parent-lot-number-list`)
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


  // to get Mulberry Variety
  const [varietyListData, setVarietyListData] = useState([]);

  const getVarietyList = () => {
    const response = api
      .get(baseURLMasterData + `mulberry-variety/get-all`)
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


   // to get Generation Number
   const [generationListData, setGenerationListData] = useState([]);

   const getGenerationList = () => {
     const response = api
       .get(baseURLMasterData + `generationNumberMaster/get-all`)
       .then((response) => {
         setGenerationListData(response.data.content.generationNumberMaster);
       })
       .catch((err) => {
        setGenerationListData([]);
       });
   };
 
   useEffect(() => {
     getGenerationList();
   }, []);

   // to get Line Year
   const [lineYearListData, setLineYearListData] = useState([]);

   const getLineYearList = () => {
     const response = api
       .get(baseURLMasterData + `lineNameMaster/get-all`)
       .then((response) => {
         setLineYearListData(response.data.content.lineNameMaster);
       })
       .catch((err) => {
        setLineYearListData([]);
       });
   };
 
   useEffect(() => {
     getLineYearList();
   }, []);

   // to get Race
   const [raceListData, setRaceListData] = useState([]);
  
   const getRaceList = () => {
     const response = api
       .get(baseURLMasterData + `raceMaster/get-all`)
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


  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: message,
    });
  };

  const saveSuccess2 = (message, lotNo) => {
    Swal.fire({
      icon: "success",
      title: message,
      text: `Generated Lot Number is ${lotNo}`,
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
    <Layout title="Preparation of Eggs (DFLs)">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Preparation of Eggs (DFLs)</Block.Title>
            
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Preparation-of-eggs-DFLs-List"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Preparation-of-eggs-DFLs-List"
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

      <Block className="mt-n5">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <div>
              <Row className="g-gs">
                <Col lg="12">
                  <Block>
                    <Card>
                      <Card.Header> Preparation of Eggs (DFLs) </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                        {/* <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Mulberry Variety<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="varietyId"
                        value={data.varietyId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        // multiple
                        required
                        isInvalid={
                          data.varietyId === undefined || data.varietyId === "0"
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
                </Col> */}

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Lot Number
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="parentLotNumber"
                          value={data.parentLotNumber}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          // required
                        >
                          <option value="">Select Lot Number</option>
                          {lotListData && lotListData.length?(lotListData.map((list) => (
                            <option key={list.id} value={list.parentLotNumber}>
                              {list.parentLotNumber}
                            </option>
                          ))): ""}
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
                        <Form.Label>
                          Line Details/year<span className="text-danger">*</span>
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
                              <option value="">Select Line Details</option>
                              {lineYearListData && lineYearListData.length?(lineYearListData.map((list) => (
                                <option
                                  key={list.lineNameId}
                                  value={list.lineNameId}
                                >
                                  {list.lineName}
                                </option>
                              ))):""}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Line Details is required
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                    
                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Generation Number<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="generationNumberId"
                              value={data.generationNumberId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">Select Generation Number</option>
                              {generationListData && generationListData.length?(generationListData.map((list) => (
                                <option
                                  key={list.generationNumberId}
                                  value={list.generationNumberId}
                                >
                                  {list.generationNumber}
                                </option>
                              ))):""}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Generation Number is required
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="numberOfCocoonsCB">
                              Cocoon's Purchased (in Kg's / Nos)
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfCocoonsCB"
                                  name="numberOfCocoonsCB"
                                  value={data.numberOfCocoonsCB}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Enter Cocoon's Purchased (in Kg's / Nos)"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                Cocoon's Purchased (in Kg's / Nos) is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="dateOfMothEmergence">
                                Date of moth emergence
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.dateOfMothEmergence}
                                  onChange={(date) =>
                                    handleDateChange(
                                      date,
                                      "dateOfMothEmergence"
                                    )
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  // minDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Date of moth emergence is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="laidOnDate">
                                Laid On Date
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.laidOnDate}
                                  onChange={(date) =>
                                    handleDateChange(date, "laidOnDate")
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
                                <Form.Control.Feedback type="invalid">
                                  Laid On Date is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="eggSheetSerialNumber">
                                Egg sheet serial number
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="eggSheetSerialNumber"
                                  name="eggSheetSerialNumber"
                                  value={data.eggSheetSerialNumber}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Egg sheet serial number"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Egg sheet serial number is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="selectedCocoon">
                              Selected Cocoon's in Nos
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="selectedCocoon"
                                  name="selectedCocoon"
                                  value={data.selectedCocoon}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Selected Cocoon's in Nos"
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Selected Cocoon's in Nos is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="rejectedCocoon">
                              Rejected Cocoon's in Nos
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="rejectedCocoon"
                                  name="rejectedCocoon"
                                  value={data.rejectedCocoon}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Rejected Cocoon's in Nos"
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Rejected Cocoon's in Nos is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="numberOfPairs">
                              No of Pairs (%) (Selected Cocoon's)
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfPairsSelectedCocoons"
                                  name="numberOfPairsSelectedCocoons"
                                  value={data.numberOfPairsSelectedCocoons}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="No of Pairs (%) (Selected Cocoon's)"
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                No of Pairs (%) (Selected Cocoon's) is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="numberOfPairs">
                              No of Pairs (%) (Rejected Cocoon's)
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfPairsRejectedCocoons"
                                  name="numberOfPairsRejectedCocoons"
                                  value={data.numberOfPairsRejectedCocoons}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="No of Pairs (%) (Rejected Cocoon's)"
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                No of Pairs (%) (Rejected Cocoon's) is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="numberOfPairs">
                                Number of pairs
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfPairs"
                                  name="numberOfPairs"
                                  value={data.numberOfPairs}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Number of pairs"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Number of pairs is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="numberOfRejection">
                                Number of Rejection
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfRejection"
                                  name="numberOfRejection"
                                  value={data.numberOfRejection}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Number of Rejection"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Number of Rejection is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="dflsObtained">
                                DFLs obtained
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="dflsObtained"
                                  name="dflsObtained"
                                  value={data.dflsObtained}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="DFLs obtained"
                                  readOnly
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  DFLs obtained is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="eggRecoveryPercentage">
                              Err %(Selected Cocoon's)
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="eggRecoveryPercentageselectedCocoons"
                                  name="eggRecoveryPercentageselectedCocoons"
                                  value={data.eggRecoveryPercentageselectedCocoons}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Err %(Selected Cocoon's)"
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Err %(Selected Cocoon's) is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="eggRecoveryPercentage">
                              Err %(Rejected Cocoon's)
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="eggRecoveryPercentagerRejectedCocoons"
                                  name="eggRecoveryPercentagerRejectedCocoons"
                                  value={data.eggRecoveryPercentagerRejectedCocoons }
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Err %(Rejected Cocoon's)"
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Err %(Rejected Cocoon's) is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="eggRecoveryPercentage">
                                Egg Recovery %
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="eggRecoveryPercentage"
                                  name="eggRecoveryPercentage"
                                  value={data.eggRecoveryPercentage}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Egg Recovery %"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Egg Recovery % is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="testResults">
                                Egg Sheet Serial Nos 
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="eggSheetSerialNos"
                                  name="eggSheetSerialNos"
                                  value={data.eggSheetSerialNos}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Egg Sheet Serial Nos "
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Test results is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="testResults">
                                Remaining DFLs 
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="remainingDFLs"
                                  name="remainingDFLs"
                                  value={data.remainingDFLs}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Remaining DFLs"
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Test results is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>
                              Test results
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="testResults"
                                  value={data.testResults}
                                  onChange={handleInputs}
                                  required
                                  isInvalid={
                                    data.testResults === undefined ||
                                    data.testResults === "0"
                                  }
                                >
                                  <option value="">
                                    Select Test Results
                                  </option>
                                  <option value="Diseased">Diseased</option>
                                  <option value="Disease-Free">Disease-Free</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                Test Results is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          {/* <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>
                                Certification (Yes/No)
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="certification"
                                  value={data.certification}
                                  onChange={handleInputs}
                                  required
                                  isInvalid={
                                    data.certification === undefined ||
                                    data.certification === "0"
                                  }
                                >
                                  <option value="">
                                    Select Certification{" "}
                                  </option>
                                  <option value="1">Yes</option>
                                  <option value="2">No</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Certification is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col> */}

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="additionalRemarks">
                                Additional remarks
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="additionalRemarks"
                                  name="additionalRemarks"
                                  value={data.additionalRemarks}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Additional remarks"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Additional remarks is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Block>
                  <div className="gap-col mt-2">
                    <ul className="d-flex align-items-center justify-content-center gap g-3">
                      <li>
                        {/* <Button type="button" variant="primary" onClick={postData}> */}
                        <Button type="submit" variant="primary">
                          Save
                        </Button>
                      </li>
                      <li>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={clear}
                        >
                          Cancel
                        </Button>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default PreparationofeggsDFLs;
