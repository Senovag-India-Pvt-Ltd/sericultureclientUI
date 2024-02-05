import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
 
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {  useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

 
 const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function MaintenanceofLineRecordsforEachRace() {
 

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
    },
    actiongreentstyle: {
      backgroundColor: "#03d300",
      color: "#fff",
    },
    actionredtstyle: {
      backgroundColor: "#ff0000",
      color: "#fff",
    },
  };

   // Virtual Bank Account
  const [vbAccountList, setVbAccountList] = useState([]);
  const [vbAccount, setVbAccount] = useState({
    virtualAccountNumber: "",
    branchName: "",
    ifscCode: "",
    marketMasterId: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAdd = () => {
    setVbAccountList((prev) => [...prev, vbAccount]);
    setVbAccount({
      virtualAccountNumber: "",
      branchName: "",
      ifscCode: "",
      marketMasterId: "",
    });
    setShowModal(false);
  };

  const handleDelete = (i) => {
    setVbAccountList((prev) => {
      const newArray = prev.filter((item, place) => place !== i);
      return newArray;
    });
  };

  const [vbId, setVbId] = useState();
  const handleGet = (i) => {
    setVbAccount(vbAccountList[i]);
    setShowModal2(true);
    setVbId(i);
  };

  const handleUpdate = (i, changes) => {
    setVbAccountList((prev) =>
      prev.map((item, ix) => {
        if (ix === i) {
          return { ...item, ...changes };
        }
        return item;
      })
    );
    setShowModal2(false);
    setVbAccount({
      virtualAccountNumber: "",
      branchName: "",
      ifscCode: "",
      marketMasterId: "",
    });
  };

  const handleVbInputs = (e) => {
    const { name, value } = e.target;
    setVbAccount({ ...vbAccount, [name]: value });
  };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const [data, setData] = useState({
    name: "",
    wardNumber: "",
    passbookNumber: "",
    fatherName: "",
    educationId: "",
    reelingUnitBoundary: "",
    dob: "",
    rationCard: "",
    machineTypeId: "",
    gender: "",
    dateOfMachineInstallation: "",
    electricityRrNumber: "",
    casteId: "",
    revenueDocument: "",
    numberOfBasins: "",
    mobileNumber: "",
    recipientId: "",
    mahajarDetails: "",
    emailId: "",
    representativeNameAddress: "",
    loanDetails: "",
    assignToInspectId: "",
    gpsLat: "",
    gpsLng: "",
    inspectionDate: "",
    arnNumber: "",
    chakbandiLat: "",
    chakbandiLng: "",
    address: "",
    pincode: "",
    stateId: "",
    districtId: "",
    talukId: "",
    hobliId: "",
    villageId: "",
    licenseReceiptNumber: "",
    licenseExpiryDate: "",
    receiptDate: "",
    functionOfUnit: "",
    reelingLicenseNumber: "",
    feeAmount: "",
    memberLoanDetails: "",
    mahajarEast: "",
    mahajarWest: "",
    mahajarNorth: "",
    mahajarSouth: "",
    mahajarNorthEast: "",
    mahajarNorthWest: "",
    mahajarSouthEast: "",
    mahajarSouthWest: "",
    bankName: "",
    bankAccountNumber: "",
    branchName: "",
    ifscCode: "",
    status: "",
    licenseRenewalDate: "",
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (e) => {
    axios
      .post(baseURL + `reeler/add`, data, {
        headers: _header,
      })
      .then((response) => {
        if (vbAccountList.length > 0) {
          const reelerId = response.data.content.reelerId;
          vbAccountList.forEach((list) => {
            const updatedVb = {
              ...list,
              reelerId: reelerId,
            };
            axios
              .post(baseURL + `reeler-virtual-bank-account/add`, updatedVb, {
                headers: _header,
              })
              .then((response) => {
                saveSuccess();
              })
              .catch((err) => {
                setVbAccount({});
                saveError();
              });
          });
        } else {
          saveSuccess();
        }
      })
      .catch((err) => {
        setData({});
        saveError();
      });
  };

  // to get Caste
  const [casteListData, setCasteListData] = useState([]);

  const getCasteList = () => {
    axios
      .get(baseURL2 + `caste/get-all`)
      .then((response) => {
        setCasteListData(response.data.content.caste);
      })
      .catch((err) => {
        setCasteListData([]);
      });
  };

  useEffect(() => {
    getCasteList();
  }, []);

  // to get Education
  const [educationListData, setEducationListData] = useState([]);

  const getEducationList = () => {
    axios
      .get(baseURL2 + `education/get-all`)
      .then((response) => {
        setEducationListData(response.data.content.education);
      })
      .catch((err) => {
        setEducationListData([]);
      });
  };

  useEffect(() => {
    getEducationList();
  }, []);

  // to get Machine Type
  const [machineTypeListData, setMachineTypeListData] = useState([]);

  const getMachineTypeList = () => {
    axios
      .get(baseURL2 + `machine-type-master/get-all`)
      .then((response) => {
        setMachineTypeListData(response.data.content.machineTypeMaster);
      })
      .catch((err) => {
        setMachineTypeListData([]);
      });
  };

  useEffect(() => {
    getMachineTypeList();
  }, []);

  // to get Market
  const [marketMasterListData, setMarketMasterListData] = useState([]);

  const getMarketMasterList = () => {
    axios
      .get(baseURL2 + `marketMaster/get-all`)
      .then((response) => {
        setMarketMasterListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketMasterListData([]);
      });
  };

  useEffect(() => {
    getMarketMasterList();
  }, []);

  // to get State
  const [stateListData, setStateListData] = useState([]);

  const getList = () => {
    axios
      .get(baseURL2 + `state/get-all`)
      .then((response) => {
        setStateListData(response.data.content.state);
      })
      .catch((err) => {
        setStateListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = (_id) => {
    axios
      .get(baseURL2 + `district/get-by-state-id/${_id}`)
      .then((response) => {
        setDistrictListData(response.data.content.district);
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.stateId) {
      getDistrictList(data.stateId);
    }
  }, [data.stateId]);

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    axios
      .get(baseURL2 + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        setTalukListData(response.data.content.taluk);
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.districtId) {
      getTalukList(data.districtId);
    }
  }, [data.districtId]);

  // to get hobli
  const [hobliListData, setHobliListData] = useState([]);

  const getHobliList = (_id) => {
    axios
      .get(baseURL2 + `hobli/get-by-taluk-id/${_id}`)
      .then((response) => {
        setHobliListData(response.data.content.hobli);
      })
      .catch((err) => {
        setHobliListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.talukId) {
      getHobliList(data.talukId);
    }
  }, [data.talukId]);

  // to get Village
  const [villageListData, setVillageListData] = useState([]);

  const getVillageList = (_id) => {
    axios
      .get(baseURL2 + `village/get-by-hobli-id/${_id}`)
      .then((response) => {
        setVillageListData(response.data.content.village);
      })
      .catch((err) => {
        setVillageListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.hobliId) {
      getVillageList(data.hobliId);
    }
  }, [data.hobliId]);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("/reeler-license-list"));
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };

  // Handle Options
  // Market
  const handleMarketOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setVbAccount({
      ...vbAccount,
      stateId: chooseId,
      stateName: chooseName,
    });
  };


  
  return (
    <Layout title="Maintenance of Line records for each race">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Maintenance of Line records for each race</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                 Maintenance of Line records for each race
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/sale-chawki-worms-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/sale-chawki-worms-list"
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

      <Block className="mt-4">
        <Form action="#">
          <Row className="g-3 "> 
            <div  >
              <Row className="g-gs">
                <Col lg="12">
                  <Block >
                    <Card>
                      <Card.Header> Maintenance of Line records for each race  </Card.Header>
                      <Card.Body>
                         <Row className="g-gs">
                        <Col lg="4" >

                           <Form.Group className="form-group  ">
                        <Form.Label>Line details/Year (Silk Worm Race)</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="gender"
                            value={data.gender}
                            onChange={handleInputs}
                          >
                            <option value="">Kempanahalli</option>
                            <option value="1">Magadi</option>
                            <option value="2">Hebbur</option>
                            <option value="3"> Kunigal</option>
                             <option value="">Solur</option>
                            <option value="1">Kudur</option>
                            <option value="2">Swarna-I</option>
                            <option value="3"> CSB</option>
                          </Form.Select>
                        </div>
                      </Form.Group>

                         </Col  > 
                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                            FRUITS-ID
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="sordfl"
                                type="text"
                                placeholder="FRUITS-ID"
                              />
                            </div>
                          </Form.Group>
                         </Col  >  

                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                            Farmer’s name
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="sordfl"
                                type="text"
                                placeholder="Farmer’s name"
                              />
                            </div>
                          </Form.Group>
                         </Col  >  
 

                          <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                              Lot number/Year
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="sordfl"
                                type="text"
                                placeholder="Lot number/Year"
                              />
                            </div>
                          </Form.Group>
                         </Col  > 
                         <Col lg="4" >
                         
                         <Form.Group className="form-group  ">
                        <Form.Label>Generation number</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="gender"
                            value={data.gender}
                            onChange={handleInputs}
                          >
                            <option value="">1st </option>
                            <option value="1">2nd</option>
                            <option value="2">3rd</option>
                            <option value="3"> 4th </option>
                             <option value="">5th</option>
                            <option value="1">6th</option>
                            <option value="2">7th</option>
                            <option value="3"> 8th</option>
                              <option value="">9th</option>
                            <option value="1">10th</option>
                            <option value="2">11th</option>
                            <option value="3">12th</option>
                          </Form.Select>
                        </div>
                      </Form.Group>

                         </Col  >  

                         <Col lg="4" >
                           <Form.Group className="form-group ">
                      <Form.Label> Date of selection of Cocoon</Form.Label>
                      <div className="form-control-wrap">
                        {/* <DatePicker selected={formValues.remark}
                          onChange={(e) =>
                            setFormValues({
                              ...formValues,
                              remark: e.target.value,
                            })
                          } /> */}
                        <DatePicker />
                      </div>
                    </Form.Group>
                         </Col  > 


                         <Col lg="4" >
                           <Form.Group className="form-group  ">
                        <Form.Label>Market Name</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="gender"
                            value={data.gender}
                            onChange={handleInputs}
                          >
                            <option value="">Kempanahalli</option> 
                            <option value="2">Hebbur</option>
                            <option value="3"> Kunigal</option>
                             <option value="">Solur</option>
                            <option value="1">Kudur</option>
                             
                          </Form.Select>
                        </div>
                      </Form.Group>
                         </Col  > 
                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                             No. of cocoons selected
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="sordfl"
                                type="text"
                                placeholder="No. of cocoons selected"
                              />
                            </div>
                          </Form.Group>
                         </Col  >  

                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                             Crop number
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="sordfl"
                                type="text"
                                placeholder="Crop number"
                              />
                            </div>
                          </Form.Group>
                         </Col  > 

                            <Col lg="4" >
                         <Form.Group className="form-group ">
                      <Form.Label> Date of Brushing (each generation)</Form.Label>
                      <div className="form-control-wrap">
                        {/* <DatePicker selected={formValues.remark}
                          onChange={(e) =>
                            setFormValues({
                              ...formValues,
                              remark: e.target.value,
                            })
                          } /> */}
                        <DatePicker />
                      </div>
                    </Form.Group>
                         </Col  > 

                           <Col lg="4" >
                         <Form.Group className="form-group ">
                      <Form.Label> Spun on date (each generation)</Form.Label>
                      <div className="form-control-wrap">
                        {/* <DatePicker selected={formValues.remark}
                          onChange={(e) =>
                            setFormValues({
                              ...formValues,
                              remark: e.target.value,
                            })
                          } /> */}
                        <DatePicker />
                      </div>
                    </Form.Group>
                         </Col  > 

                            <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                            Total number of cocoons produced
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="sordfl"
                                type="text"
                                placeholder="Total number of cocoons produced"
                              />
                            </div>
                          </Form.Group>
                         </Col  > 

                            <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                            Average Weight
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="sordfl"
                                type="text"
                                placeholder="Average Weight"
                              />
                            </div>
                          </Form.Group>
                         </Col  > 

                         
                         
 
 

                         <Col lg="12" className="text-center">
                        <Button type="button" variant="primary"  onClick={handleShowModal} > Submit  </Button>  
                      </Col>
 
                      </Row>
                        
                      </Card.Body>
                    </Card>
                  </Block>
                </Col>
                <Col lg="12">
                  <Card>
                    <Card.Body>
                      {/* <h3>Farmers Details</h3> */}
                      <Row className="g-gs">
                          <Col lg="12">
                          <div className="table-responsive">
                            <table className="table small table-bordered">
                              <thead>
                                <tr>
                                  <th style={styles.ctstyle}>Line details/Year (Silk Worm Race)</th>  
                                  <th style={styles.ctstyle}>FRUITS-ID</th> 
                                  <th style={styles.ctstyle}>Farmer’s name</th> 
                                  <th style={styles.ctstyle}>Lot number/Year</th> 
                                  <th style={styles.ctstyle}>Generation number</th> 
                                   <th style={styles.ctstyle}>Date of selection of Cocoon</th> 
                                  <th style={styles.ctstyle}>Market Name</th>
                                   <th style={styles.ctstyle}>No. of cocoons selected</th>
                                   <th style={styles.ctstyle}>Crop number</th>

                                   <th style={styles.ctstyle}>Date of Brushing </th>
                                   <th style={styles.ctstyle}>Spun on date (each generation) </th>
                                   <th style={styles.ctstyle}>Total number of cocoons produced</th>
                                       <th style={styles.ctstyle}>Average Weight</th>
                                   
                                </tr>
                              </thead>
                              <tbody>
                                 <tr>
                                   <td>Line details/Year (Silk Worm Race) data</td>  
                                   <td>FRUITS-ID data</td> 
                                   <td>Farmer’s name data</td> 
                                    <td>Lot number/Year data</td> 
                                    <td>Generation number data</td> 
                                     <td>12-9-2023</td> 
                                    <td>Market Name date</td> 
                                    <td>No. of cocoons selected data</td> 
                                     <td>Crop number</td> 
                                     
                                      <td>20-9-2023</td> 
                                    <td>30-8-2023</td> 
                                    <td>Total number of cocoons produced</td> 
                                     <td>Average Weight</td> 
                                      
                                </tr>
                              </tbody>
                            </table> 
                            </div>
                          </Col>
                        </Row>
                       
                      

                    </Card.Body>
                  </Card>
                 
                
                 
                    <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title> Status of Receipt of DFLs from the grainage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-5 px-5">
               
              <div className="table-responsive">
                          <table className="table small table-bordered">
                              <thead>
                                <tr>
                                  <th style={styles.ctstyle}>Grainage Name</th>   
                                  <th style={styles.ctstyle}>Number of DFLs received</th> 
                                  <th style={styles.ctstyle}>Line Name</th> 
                                   <th style={styles.ctstyle}>Lot  Number</th> 
                                  <th style={styles.ctstyle}>Invoice no</th>
                                   <th style={styles.ctstyle}>Invoice Date</th>
                                   <th style={styles.ctstyle}>Status (Recived)</th>
                                   
                                </tr>
                              </thead>
                              <tbody>
                                 <tr>
                                   <td>Grainage Name data</td>  
                                    <td>Number of DFLs received data</td> 
                                    <td    >Line Name data</td> 
                                     <td  >Lot  Number data</td> 
                                    <td >Invoice no data</td> 
                                    <td >Invoice Date data</td>  
                                     <td style={styles.actionredtstyle}>Reject</td>   
                                </tr>
                                 <tr>
                                   <td>Grainage Name data</td>  
                                    <td>Number of DFLs received data</td> 
                                    <td    >Line Name data</td> 
                                     <td  >Lot  Number data</td> 
                                    <td >Invoice no data</td> 
                                    <td >Invoice Date data</td>  
                                     <td style={styles.actiongreentstyle}>Accept</td>   
                                </tr>
                              </tbody>
                            </table>
                             
                            </div>

              
            </Row>
          </Form>
        </Modal.Body>
      </Modal>



                </Col>
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default MaintenanceofLineRecordsforEachRace;
