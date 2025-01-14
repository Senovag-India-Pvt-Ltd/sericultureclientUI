import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";
import { useTranslation } from "react-i18next";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function PreparationofeggsDFLsAdd() {
  const { id } = useParams();
  const { t } = useTranslation();
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
    certification: "",
    additionalRemarks: "",
    // varietyId: "",
    generationNumberId: "",
    lineNameId: "",
    raceId: "",
    parentLotNumber: "",
    selectedCocoonsNo: "",
    rejectedCocoonsNo: "",
    errPerSelectedCocoonsNo:"",
    errPerRejectedCocoonsNo: "",
    pairNoSelectedCocoonsNo:"",
    pairNoRejectedCocoonsNo: "",
    eggSheetSerialNos:"",
    remainingDfls :"",
  });
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

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

  const [selectedLotType, setSelectedLotType] = useState("newLot");

  const handleLotTypeChange = (event) => {
    setSelectedLotType(event.target.value);
  };

  const isDateOfMothEmergence = !!data.dateOfMothEmergence;
  const isLaidOnDate = !!data.laidOnDate;

  // const postData = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);
  //   } else {
  //     event.preventDefault();
  //     // event.stopPropagation();
  //     api
  //       .post(baseURLSeedDfl + `EggPreparation/preparation-of-present-lotno-dfls`, data)
  //       .then((response) => {
  //         //   const trScheduleId = response.data.content.trScheduleId;
  //         //   if (trScheduleId) {
  //         //     handlePPtUpload(trScheduleId);
  //         //   }
  //         if (response.data.error) {
  //           updateError(response.data.message);
  //         } else {
  //           updateSuccess();
  //           clear();
  //         }
  //       })
  //       .catch((err) => {
  //         // const message = err.response.data.errorMessages[0].message[0].message;
  //         updateError();
  //       });
  //     setValidated(true);
  //   }
  // };

  // Post data including preparationOfEggsId
  // const formatDate = (date) => {
  //   if (!date) return ""; // Handle null or undefined dates
  //   return (
  //     date.getFullYear() +
  //     "-" +
  //     (date.getMonth() + 1).toString().padStart(2, "0") +
  //     "-" +
  //     date.getDate().toString().padStart(2, "0")
  //   );
  // };

const postData = (event) => {
  const form = event.currentTarget;
  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
  } else {
    event.preventDefault();

    // const formattedReleaseDate = formatDate(data.dateOfMothEmergence);
    // const formattedBoxingDate = formatDate(data.laidOnDate);
    // // const formattedDateOfDisposal = formatDate(data.spunOnDate);
    // // const formattedExpectedDateOfHatching = formatDate(data.hatchingDate);
    // const payload = {
    //   ...data,
    //   dateOfMothEmergence: formattedReleaseDate,
    //   laidOnDate: formattedBoxingDate,
    //   // spunOnDate: formattedDateOfDisposal,
    //   // hatchingDate: formattedExpectedDateOfHatching,
    // };


    api
      .post(baseURLSeedDfl + `EggPreparation/preparation-of-present-lotno-dfls`, data)
      .then((response) => {
        if (response.data.error) {
          updateError(response.data.message);
        } else {
          updateSuccess();
          clear(); // Clear the form or reset state after successful submission
        }
      })
      .catch((err) => {
        updateError();
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
      selectedCocoonsNo: "",
      rejectedCocoonsNo: "",
      errPerSelectedCocoonsNo:"",
      errPerRejectedCocoonsNo: "",
      pairNoSelectedCocoonsNo:"",
      pairNoRejectedCocoonsNo: "",
      eggSheetSerialNos:"",
      remainingDfls :"",
    });
    setValidated(false);
    // getIdList();
  };

  // //   to get data from api
  // const getIdList = () => {
  //   setLoading(true);
  //   const response = api
  //     .get(baseURLSeedDfl + `EggPreparation/get-info-by-id/${id}`)
  //     .then((response) => {
  //       setData(response.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       // const message = err.response.data.errorMessages[0].message[0].message;
  //       setData({});
  //       // editError(message);
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   getIdList();
  // }, [id]);

  // Fetch data using the ID and set it in the state
const getIdList = () => {
  setLoading(true);
  api
    .get(baseURLSeedDfl + `EggPreparation/get-info-by-id/${id}`)
    .then((response) => {
      setData({ ...response.data, preparationOfEggsId: id }); // Set the data and include the ID as preparationOfEggsId
      setLoading(false);
    })
    .catch((err) => {
      setData({});
      // Handle the error if needed
      setLoading(false);
    });
};

// Fetch data on component mount or when ID changes
useEffect(() => {
  getIdList();
}, [id]);

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

    // to get Lot
   const [presentLotListData, setPresentLotListData] = useState([]);

   const getPresentLotList = () => {
     const response = api
       .get(baseURLSeedDfl + `EggPreparation/get-all-lot-number-list`)
       .then((response) => {
        setPresentLotListData(response.data);
       })
       .catch((err) => {
        setPresentLotListData([]);
       });
   };
 
   useEffect(() => {
     getPresentLotList();
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
  const navigate = useNavigate();

  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: t("Updated successfully"),
      // text: "You clicked the button!",
    });
  };
  const updateError = (message) => {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Save attempt was not successful",
    //     text: message,
    //   });
    // };
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: t("Attempt was not successful"),
      html: errorMessage,
    });
  };

  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: t("Something went wrong!"),
    }).then(() => navigate("#"));
  };
  return (
    <Layout title={t("Add Preparation of Eggs (DFLs)")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Add Preparation of Eggs (DFLs)")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Preparation-of-eggs-DFLs-List"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Preparation-of-eggs-DFLs-List"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

     
      <Block className="mt-n5">
      {/* <Card>
          <Card.Body>
            <Row lg="12" className="g-gs">
              <Col lg="1">
                <Form.Group as={Row} className="form-group" controlId="farm">
                  <Col sm={1}>
                    <Form.Check
                      type="radio"
                      name="lotType"
                      // label="New Lot"
                      value="newLot"
                      checked={selectedLotType === "newLot"}
                      onChange={handleLotTypeChange}
                    />
                  </Col>
                  <Form.Label column sm={9} className="mt-n2" id="farm">
                    {t("New Lot")}
                  </Form.Label>
                </Form.Group>
              </Col>
              
              <Col lg="1">
                <Form.Group as={Row} className="form-group" controlId="crc">
                  <Col sm={1}>
                    <Form.Check
                      type="radio"
                      name="lotType"
                      value="presentLot"
                      checked={selectedLotType === "presentLot"}
                      onChange={handleLotTypeChange}
                    />
                  </Col>
                  <Form.Label column sm={9} className="mt-n2" id="crc">
                    {t("Present Lot")}
                  </Form.Label>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <div>
              <Row className="g-gs">
                <Col lg="12">
                  <Block>
                    <Card>
                      <Card.Header>
                        {t("Add Preparation of Eggs (DFLs)")}
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                        {/* <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Mulberry Variety")}<span className="text-danger">*</span>
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
                        <option value="">{t("Select Mulberry Variety")}</option>
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
                        {t("Mulberry Variety is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col> */}

                {/* {selectedLotType === "presentLot" && ( */}
            {/* <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                     {t("Lot Number")}
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="lotNumber"
                          value={data.lotNumber}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          // required
                        >
                          <option value="">{t("Select Lot Number")}</option>
                          {presentLotListData && presentLotListData.length?(presentLotListData.map((list) => (
                            <option key={list.id} value={list.lotNumber}>
                              {list.lotNumber}
                            </option>
                          ))): ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        {t("Lot Number is required")}
                      </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>  */}
                    {/* )} */}

                    {/* {selectedLotType === "newLot" && ( */}
                      {/* <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                     {t("Cocoon Lot Number")}
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
                          <option value="">{t("Select Lot Number")}</option>
                          {lotListData && lotListData.length?(lotListData.map((list) => (
                            <option key={list.id} value={list.parentLotNumber}>
                              {list.parentLotNumber}
                            </option>
                          ))): ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        {t("Lot Number is required")}
                      </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>  */}
                    {/* )} */}
                {/* <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Race")}<span className="text-danger">*</span>
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
                              <option value="">{t("Select Race")}</option>
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
                              {t("Race is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col> */}
                    
                    {/* <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Line Details/year")}<span className="text-danger">*</span>
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
                              <option value="">{t("Select Line Details")}</option>
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
                              {t("Line Details is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col> */}

                    
                    {/* <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Generation Number")}<span className="text-danger">*</span>
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
                              <option value="">{t("Select Generation Number")}</option>
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
                              {t("Generation Number is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="numberOfCocoonsCB">
                              {t("Cocoon's Purchased (in Kg's / Nos)")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfCocoonsCB"
                                  name="numberOfCocoonsCB"
                                  value={data.numberOfCocoonsCB}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Enter Cocoon's Purchased (in Kg's / Nos)")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                {t("Cocoon's Purchased (in Kg's / Nos) is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col> */}

                          <Col lg="2">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="dateOfMothEmergence">
                                {t("Date of moth emergence")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                {/* {isDateOfMothEmergence && ( */}
                                  <DatePicker
                                    selected={
                                      data.dateOfMothEmergence ? new Date(data.dateOfMothEmergence) : null
                                    }
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
                                {/* )} */}

                                <Form.Control.Feedback type="invalid">
                                  {t("Date of moth emergence is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="laidOnDate">
                                {t("Laid On Date")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                {/* {isLaidOnDate && ( */}
                                  <DatePicker
                                    selected={data.laidOnDate ? new Date(data.laidOnDate) : null}
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
                                {/* )} */}

                                <Form.Control.Feedback type="invalid">
                                  {t("Laid On Date is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="eggSheetSerialNumber">
                                {t("Egg sheet serial number")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="eggSheetSerialNumber"
                                  name="eggSheetSerialNumber"
                                  value={data.eggSheetSerialNumber}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Egg sheet serial number")}
                                />
                              
                              </div>
                            </Form.Group>
                          </Col>

                          {/* <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="selectedCocoon">
                              {t("Selected Cocoon's in Nos")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="selectedCocoonsNo"
                                  name="selectedCocoonsNo"
                                  value={data.selectedCocoonsNo}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Selected Cocoon's in Nos")}
                                  // required
                                />

                              </div>
                            </Form.Group>
                          </Col> */}

                          {/* <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="rejectedCocoon">
                              {t("Rejected Cocoon's in Nos")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="rejectedCocoon"
                                  name="rejectedCocoonsNo"
                                  value={data.rejectedCocoonsNo}
                                  onChange={handleInputs}
                                  type="number"
                                />
                               
                              </div>
                            </Form.Group>
                          </Col> */}

                          {/* <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="numberOfPairs">
                              {t("No of Pairs (%) (Selected Cocoon's)")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="pairNoSelectedCocoonsNo"
                                  name="pairNoSelectedCocoonsNo"
                                  value={data.pairNoSelectedCocoonsNo}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("No of Pairs (%) (Selected Cocoon's)")}
                         
                                />
                             
                              </div>
                            </Form.Group>
                          </Col> */}

                          {/* <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="numberOfPairs">
                              {t("No of Pairs (%) (Rejected Cocoon's)")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="pairNoRejectedCocoonsNo"
                                  name="pairNoRejectedCocoonsNo"
                                  value={data.pairNoRejectedCocoonsNo}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("No of Pairs (%) (Rejected Cocoon's)")}
                                  
                                />
                               
                              </div>
                            </Form.Group>
                          </Col> */}

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="numberOfPairs">
                                {t("Number of pairs")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfPairs"
                                  name="numberOfPairs"
                                  value={data.numberOfPairs}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Number of pairs")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Number of pairs is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="numberOfRejection">
                                {t("Number of Rejection")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfRejection"
                                  name="numberOfRejection"
                                  value={data.numberOfRejection}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Number of Rejection")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Number of Rejection is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="dflsObtained">
                                {t("DFLs obtained")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="dflsObtained"
                                  name="dflsObtained"
                                  value={data.dflsObtained}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("DFLs obtained")}
                                  readOnly
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("DFLs obtained is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          {/* <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="eggRecoveryPercentage">
                              {t("Err %(Selected Cocoon's)")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="errPerSelectedCocoonsNo"
                                  name="errPerSelectedCocoonsNo"
                                  value={data.errPerSelectedCocoonsNo}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Err %(Selected Cocoon's)")}

                                />
                               
                              </div>
                            </Form.Group>
                          </Col> */}

                          {/* <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="eggRecoveryPercentage">
                              {t("Err %(Rejected Cocoon's)")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="errPerRejectedCocoonsNo"
                                  name="errPerRejectedCocoonsNo"
                                  value={data.errPerRejectedCocoonsNo }
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Err %(Rejected Cocoon's)")}
                                />
                               
                              </div>
                            </Form.Group>
                          </Col> */}
{/* 
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="eggRecoveryPercentage">
                                {t("Egg Recovery %")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="eggRecoveryPercentage"
                                  name="eggRecoveryPercentage"
                                  value={data.eggRecoveryPercentage}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Egg Recovery %")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Egg Recovery % is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col> */}

                          {/* <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="testResults">
                                {t("Remaining DFLs")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="remainingDFLs"
                                  name="remainingDfls"
                                  value={data.remainingDfls}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Remaining DFLs")}
                                  // required
                                />
                               
                              </div>
                            </Form.Group>
                          </Col> */}

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>
                              {t("Test results")}
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
                                    {t("Select Test Results")}
                                  </option>
                                  <option value="Diseased">{t("Diseased")}</option>
                                  <option value="Disease-Free">{t("Disease-Free")}</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                {t("Test Results is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          {/* <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>
                                {t("Certification (Yes/No)")}
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
                                    {t("Select Certification")}{" "}
                                  </option>
                                  <option value="1">{t("Yes")}</option>
                                  <option value="2">{t("No")}</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  {t("Certification is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col> */}

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="additionalRemarks">
                                {t("Additional remarks")}
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="additionalRemarks"
                                  name="additionalRemarks"
                                  value={data.additionalRemarks}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Additional remarks")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  {t("Additional remarks is required")}
                                </Form.Control.Feedback> */}
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
                          {t("Update")}
                        </Button>
                      </li>
                      <li>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={clear}
                        >
                          {t("Clear")}
                        </Button>
                      </li>
                {/* <li>
                  <Link
                    to="/seriui/Maintenance-of-mulberry-Garden-in-the-Farms-list"
                    className="btn btn-secondary border-0"
                  >
                   {t("Cancel")}
                  </Link>
                </li> */}
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

export default PreparationofeggsDFLsAdd;
