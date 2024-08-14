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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function PreservationOfSeedCocoonForProcessingEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const isDataOfSeedCocoonSet = !!data.dateOfSeedCocoonSupply;
  const isDataSpunSet = !!data.spunOnDate;
  const isDataInvoiceDate = !!data.invoiceDate;


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
        .post(baseURLSeedDfl + `PreservationOfSeed/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
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
                farmId: "",
                marketMasterId: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          // const message = err.response.data.errorMessages[0].message[0].message;
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
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
        farmId: "",
        marketMasterId: "",
    });
  };



  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `PreservationOfSeed/get-info-by-id/${id}`)
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
  }, [id]);

  
    // to get Market
    const [marketListData, setMarketListData] = useState([]);

    const getMarketList = () => {
      const response = api
        .get(baseURL + `marketMaster/get-all`)
        .then((response) => {
          setMarketListData(response.data.content.marketMaster);
        })
        .catch((err) => {
          setMarketListData([]);
        });
    };
  
    useEffect(() => {
      getMarketList();
    }, []);
  
  
  
      // to get farm
    const [farmListData, setFarmListData] = useState([]);
  
    const getFarmList = () => {
      api
        .get(baseURL + `farmMaster/get-all`)
        .then((response) => {
          setFarmListData(response.data.content.farmMaster);
        })
        .catch((err) => {
          setFarmListData([]);
        });
    };
  
    useEffect(() => {
      getFarmList();
    }, []);
    
  

 // to get Lot
const [lineNameListData, setLineNameListData] = useState([]);

const getLineNameLotList = () => {
  api
    .get(baseURL + `lineNameMaster/get-all`)
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

  const updateSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      text: message,
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
              Edit Preservation of seed cocoon for processing
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
                    <Form.Label htmlFor="invoiceDetails">
                   Lot Number<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="lotNumber"
                        name="lotNumber"
                        value={data.lotNumber}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Lot Number"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Lot Number is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Market<span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="marketMasterId"
                            value={data.marketMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.marketMasterId === undefined ||
                              data.marketMasterId === "0"
                            }
                          >
                            <option value="">Select Market</option>
                            {marketListData.map((list) => (
                              <option
                                key={list.marketMasterId}
                                value={list.marketMasterId}
                              >
                                {list.marketMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Market is required
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            Farm<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="farmId"
                              value={data.farmId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              // multiple
                              required
                              isInvalid={
                                data.farmId === undefined ||
                                data.farmId === "0"
                              }
                            >
                              <option value="">Select Farm</option>
                              {farmListData.map((list) => (
                                <option
                                  key={list.farmId}
                                  value={list.userMasterId}
                                >
                                  {list.farmName}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Farm is required
                            </Form.Control.Feedback>
                          </div>
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
                        // required
                      />
                      {/* <Form.Control.Feedback type="invalid">
                      Name of the Government Seed Farm/Farmer is required
                      </Form.Control.Feedback> */}
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
                        type="text"
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
                              <div className="Date of Seed Cocoon supply">
                              {isDataOfSeedCocoonSet && (
                                <DatePicker
                                  selected={new Date(data.dateOfSeedCocoonSupply)}
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
                            )}
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
                    {isDataSpunSet && (
                      <DatePicker
                        selected={new Date(data.spunOnDate)}
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
                      )}
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
                    {isDataInvoiceDate && (
                      <DatePicker
                        selected={new Date(data.invoiceDate)}
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
                      )}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            )}
            </Card.Body>
          </Card>

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
          {/* </Row> */}
        </Form>
      </Block>
    </Layout>
  );
}

export default PreservationOfSeedCocoonForProcessingEdit;
