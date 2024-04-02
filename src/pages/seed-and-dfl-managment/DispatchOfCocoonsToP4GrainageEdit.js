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

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function DispatchofCocoonstoP4GrainageEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  const isDataSupplyDate = !!data.dateOfSupply;
  const isDataDispatchDate = !!data.dispatchDate;
  const isDataSpunDate = !!data.spunOnDate;

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

 

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
        .post(baseURLSeedDfl + `DispatchOfCocoons/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
                grainageMasterId: "",
                lineYear: "",
                sourceMasterId: "",
                screeningBatchNo: "",
                generationNumberId: "",
                spunOnDate: "",
                lotNumber: "",
                numberOfCocoonsDispatched: "",
                dateOfSupply: "",
                dispatchDate: "",
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
        grainageMasterId: "",
        lineYear: "",
        sourceMasterId: "",
        screeningBatchNo: "",
        generationNumberId: "",
        spunOnDate: "",
        lotNumber: "",
        numberOfCocoonsDispatched: "",
        dateOfSupply: "",
        dispatchDate: "",
    });
  };


  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `DispatchOfCocoons/get-info-by-id/${id}`)
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


   // to get Lot
   const [lotListData, setLotListData] = useState([]);

   const getLotList = () => {
     const response = api
       .get(baseURLSeedDfl + `ReceiptOfDflsFromP4GrainageLinesController/get-all-lot-number-list`)
       .then((response) => {
         setLotListData(response.data.ReceiptOfDflsFromP4GrainageLinesController);
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
       .get(baseURL2 + `raceMaster/get-all`)
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
 
   // to get Grainage
   const [grainageListData, setGrainageListData] = useState([]);
 
   const getGrainageList = () => {
     const response = api
       .get(baseURL2 + `grainageMaster/get-all`)
       .then((response) => {
         setGrainageListData(response.data.content.grainageMaster);
       })
       .catch((err) => {
         setGrainageListData([]);
       });
   };
 
   useEffect(() => {
     getGrainageList();
   }, []);
 
    // to get Source
    const [sourceListData, setSourceListData] = useState([]);
 
    const getSourceList = () => {
      const response = api
        .get(baseURL2 + `sourceMaster/get-all`)
        .then((response) => {
          setSourceListData(response.data.content.sourceMaster);
        })
        .catch((err) => {
         setSourceListData([]);
        });
    };
  
    useEffect(() => {
      getSourceList();
    }, []);
 
    // to get Generation Number
    const [generationListData, setGenerationListData] = useState([]);
 
    const getGenerationList = () => {
      const response = api
        .get(baseURL2 + `generationNumberMaster/get-all`)
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
    <Layout title="Edit Dispatch of Cocoons to P4 Grainage">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Dispatch of Cocoons to P4 Grainage</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Dispatch-of-Cocoons-to-P4-Grainage-List"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Dispatch-of-Cocoons-to-P4-Grainage-List"
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
              Edit Dispatch of Cocoons to P4 Grainage
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
                        <Form.Label>
                          Grainage<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="grainageMasterId"
                              value={data.grainageMasterId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">Select Grainage</option>
                              {grainageListData && grainageListData.length?(grainageListData.map((list) => (
                                <option
                                  key={list.grainageMasterId}
                                  value={list.grainageMasterId}
                                >
                                  {list.grainageMasterName}
                                </option>
                              ))):""}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Grainage is required
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Line/Year<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="lineYear"
                                  name="lineYear"
                                  value={data.lineYear}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Line Year"
                                  required
                                />
                              </div>
                            </Form.Group>
                          </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Source<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="sourceMasterId"
                              value={data.sourceMasterId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">Select Source</option>
                              {sourceListData && sourceListData.length?(sourceListData.map((list) => (
                                <option
                                  key={list.sourceMasterId}
                                  value={list.sourceMasterId}
                                >
                                  {list.sourceMasterName}
                                </option>
                              ))):""}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Source is required
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Screening Batch No<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="screeningBatchNo"
                            name="screeningBatchNo"
                            value={data.screeningBatchNo}
                            onChange={handleInputs}
                            type="text"
                            placeholder=" Enter Screening Batch No"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Screening Batch No is required
                          </Form.Control.Feedback>
                        </div>
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
                    <Form.Label>
                      Lot Number
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="lotNumber"
                          value={data.lotNumber}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                        //   required
                        >
                          <option value="">Select Lot Number</option>
                          {lotListData && lotListData.length?(lotListData.map((list) => (
                            <option key={list.lotNumberId} value={list.lotNumberId}>
                              {list.lotNumber}
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
                              <Form.Label htmlFor="sordfl">
                                Number of Cocoons Dispatched
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                id="numberOfCocoonsDispatched"
                                name="numberOfCocoonsDispatched"
                                value={data.numberOfCocoonsDispatched}
                                onChange={handleInputs}
                                type="text"
                                placeholder="Enter Number of Cocoons Dispatched"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Spun on Date
                              </Form.Label>
                              <div className="form-control-wrap">
                              {isDataSpunDate && (
                                <DatePicker
                                  selected={new Date(data.spunOnDate)}
                                  onChange={(date) =>
                                    handleDateChange(date, "spunOnDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                //   maxDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  required
                                />
                                )}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n4 ">
                              <Form.Label> Date of Supply</Form.Label>
                              <div className="form-control-wrap">
                              {isDataSupplyDate && (
                                <DatePicker
                                  selected={new Date(data.dateOfSupply)}
                                  onChange={(date) =>
                                    handleDateChange(date, "dateOfSupply")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                //   maxDate={new Date()}
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
                                Dispatch Date
                              </Form.Label>
                              <div className="form-control-wrap">
                              {isDataDispatchDate && (
                                <DatePicker
                                  selected={new Date(data.dispatchDate)}
                                  onChange={(date) =>
                                    handleDateChange(date, "dispatchDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                //   maxDate={new Date()}
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

export default DispatchofCocoonstoP4GrainageEdit;
