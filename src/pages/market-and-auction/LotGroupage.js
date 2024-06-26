import { Card, Form, Row, Col, Button,Modal} from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { Icon, Select } from "../../components";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURLRegistration = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function LotGroupage() {

const [dataLotList, setDataLotList] = useState([]); 
  const [data, setData] = useState({
    buyerType: "Reeler",
    buyerId: "",
    lotWeight: "",
    amount: "",
    soldAmount: "",
    allottedLotId: "",
    auctionDate: "",
    
  });

  console.log(dataLotList);



  const [validatedDisplay, setValidatedDisplay] = useState(false);

const handleDateChange = (date) => {
    setData((prev) => ({ ...prev, auctionDate: date }));
  };
  useEffect(() => {
    handleDateChange(new Date());
  }, []);

  const [lotGroupages, setLotGroupages] = useState({
    lotGroupageRequests: []
   
  });
  // const [searchValidated, setSearchValidated] = useState(false);
  const [validated, setValidated] = useState(false);
  const [validatedLot, setValidatedLot] = useState(false);
  const [validatedEdit, setValidatedEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const [showFarmerDetails, setShowFarmerDetails] = useState(false);

  const handleAddLotDetails = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setData(true);
    } else {
      e.preventDefault();
      setDataLotList((prev) => [...prev, data]);
      // setData({
      //   buyerType: "Reeler",
      //   buyerId: "",
      //   lotWeight: "",
      //   amount: "",
      //   marketFee: "",
      //   soldAmount: "",
      //   allottedLotId: "",
      //   auctionDate: ""
      // });
      setShowModal(false);
      setValidatedLot(false);
    }
    // e.preventDefault();
  };

  const handleDeleteLotDetails = (i) => {
    setDataLotList((prev) => {
      const newArray = prev.filter((item, place) => place !== i);
      return newArray;
    });
  };

  const [lotId, setLotId] = useState();
  const handleGetLotDetails = (i) => {
    setData(dataLotList[i]);
    setShowModal1(true);
    setLotId(i);
  };

  const handleUpdateLotDetails = (e, i, changes) => {
      setDataLotList((prev) =>
        prev.map((item, ix) => {
          if (ix === i) {
            return { ...item, ...changes };
          }
          return item;
        })
      ); const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
        setValidatedEdit(true);
      } else {
        e.preventDefault();
      setShowModal1(false);
      setValidatedEdit(false);
      setData({
        buyerType: "Reeler",
        buyerId: "",
        lotWeight: "",
        amount: "",
        marketFee: "",
        soldAmount: "",
        allottedLotId: "",
        auctionDate: ""
      });
    }
  };

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };


   //  console.log("data",data.photoPath);
   const [searchValidated, setSearchValidated] = useState(false);

   const search = (event) => {
    setDataLotList([]);
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setSearchValidated(true);
    } else {
      event.preventDefault();
     
            api
              .post(
                baseURLMarket +
                  `lotGroupage/getUpdateLotDistributeByLotIdForSeedMarket`,
                { allottedLotId: data.allottedLotId,auctionDate: data.auctionDate, marketId: localStorage.getItem("marketId"),
                 godownId: localStorage.getItem("godownId"),}
                // {
                //   headers: _header,
                // }
              )
              .then((response) => {
                const lotGroupageId = response.data.content[0].lotGroupageId;
        
                if (lotGroupageId) {
                  navigate(`/seriui/lot-groupage-edit/${lotGroupageId}`);
                } else {
                 const farmerDetails = response.data.content;
                setData((prev) => ({
                  ...prev,
                  farmerFirstName: farmerDetails.farmerFirstName,
                  farmerMiddleName: farmerDetails.farmerMiddleName,
                  farmerFruitsId: farmerDetails.farmerFruitsId
                }));
                setShowFarmerDetails(true);
                 }
                 
                  // console.log(modified);FF

                 
              })
              .catch((error) => {});
          }
       //  })
       //  .catch((error) => {});
   //  }
  };
 
  //  const [isActive, setIsActive] = useState(false);
  //  const getLotDetails = (event) => {
  //    const form = event.currentTarget;
  //    if (form.checkValidity() === false) {
  //        event.preventDefault();
  //        event.stopPropagation();
  //        setValidatedDisplay(true);
  //      } else {
  //        event.preventDefault();
  //    const sendData = {
  //      marketId: localStorage.getItem("marketId"),
  //      godownId: localStorage.getItem("godownId"),
  //      allottedLotId: data.allottedLotId,
  //      auctionDate: data.auctionDate,
  //    };
  //    api
  //      .post(baseURLMarket + `auction/weigment/getUpdateWeighmentByLotIdForSeedMarket`, sendData)
  //      .then((response) => {
  //        // debugger;
  //        console.log(response.data.content);
  //        setData((prev) => {
  //          return { ...prev, ...response.data.content };
  //        });
        
  //      })
  //      .catch((err) => {
  //        if (
  //          err.response.data &&
  //          err.response.data.errorMessages[0] &&
  //          err.response.data.errorMessages[0].message[0]
  //        ) {
  //            if (Object.keys(err.response.data.validationErrors).length > 0) {
  //                searchError(err.response.data.validationErrors);
  //              }
  //            } else {
  //              Swal.fire({
  //                icon: "warning",
  //                title: "Details not Found",
  //              });
  //            }
  //            setFarmerDetails({});
  //            setValidatedDisplay(false);
  //            setLoading(false);
         
  //          });
  //          setIsActive((current) => !current);
  //      }
  //      };
 
      //  const handleLotInputs = (e) => {
      //    name = e.target.name;
      //    value = e.target.value;
      //    setFarmerDetails({ ...farmerDetails, [name]: value });
      //  };
     
 
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

 
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      const sendPost = {
        lotGroupageRequests: dataLotList, 
      };
      api
        .post(baseURLMarket + `lotGroupage/saveLotGroupage`, sendPost)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
            buyerType: "",
            buyerId: "",
            lotWeight: "",
            amount: "",
            marketFee: "",
            soldAmount: "",
            allottedLotId: "",
            auctionDate: ""
            });
            clear();
            setValidated(false);
          }
        })
        .catch((err) => {
          if (
            err.response &&
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

  const handleReelerOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setData({
      ...data,
      buyerId: chooseId,
      reelerName: chooseName,
    });
  };

  // District
  const handleExternalOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setData({
      ...data,
      buyerId: chooseId,
      name: chooseName,
    });
  };


  const clear = () => {
    setData({
        buyerType: "",
        buyerId: "",
        lotWeight: "",
        amount: "",
        marketFee: "",
        soldAmount: "",
        allottedLotId: "",
        auctionDate: ""
    });
  //   setFarmerDetails({
  //   marketId: localStorage.getItem("marketId"),
  //   godownId: 0,
  //   allottedLotId: "",
  //   auctionDate: "",
  // });
    setDataLotList([]);
  };

  const [loading, setLoading] = useState(false);

  // to get Market
  const [reelerListData, setReelerListData] = useState([]);

  const getReelerList = () => {
    const response = api
      .get(baseURLRegistration + `reeler/get-all`)
      .then((response) => {
        setReelerListData(response.data.content.reeler);
      })
      .catch((err) => {
        setReelerListData([]);
      });
  };

  useEffect(() => {
    getReelerList();
  }, []);

  // to get Race
  const [externalListData, setExternalListData] = useState([]);

  const getExternalList = (_id) => {
    const response = api
      .get(baseURLRegistration + `external-unit-registration/get-all`)
      .then((response) => {
        setExternalListData(response.data.content.externalUnitRegistration);
        setLoading(false);
        if (response.data.content.error) {
            setExternalListData([]);
        }
      })
      .catch((err) => {
        setExternalListData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
        getExternalList();
  }, []);

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "10%",
    },
    top: {
      backgroundColor: "rgb(15, 108, 190, 1)",
      color: "rgb(255, 255, 255)",
      width: "50%",
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    bottom: {
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    sweetsize: {
      width: "100px",
      height: "100px",
    },
  };


  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("#");
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
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Lot Distribution">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Lot Distribution</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/crate-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/crate-list"
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
          {/* <Row className="g-3 "> */}
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        Lot Number<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={3}>
                        <Form.Control
                          id="allotedLotId"
                          name="allottedLotId"
                          value={data.allottedLotId}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Lot Number"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Lot Number is required.
                        </Form.Control.Feedback>
                      </Col>
                      <Form.Label column sm={1}>
                        Date
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={data.auctionDate}
                            onChange={handleDateChange}
                            maxDate={new Date()}
                            className="form-control"
                          />
                        </div>
                      </Col>
                      <Col sm={2}>
                      <Button type="submit" variant="primary">
                       Search
                      </Button>
                      </Col>
                    </Form.Group>
                  </Col>
                  </Row>
                  
              </Card.Body>
            </Card>
            </Form>

            {showFarmerDetails && (
                  <Col lg="12">
                  <Card>
                    <Card.Header>Farmer Details</Card.Header>
                    <Card.Body>
                      <Row className="g-gs mt-1">
                        <Col lg="12">
                          <table className="table small table-bordered">
                            <tbody>
                              <tr>
                              <td style={styles.ctstyle}> Farmer Name:</td>
                              <td>{data.farmerFirstName}</td>
                              <td style={styles.ctstyle}> Farmer Middle Name:</td>
                              <td>{data.farmerMiddleName}</td>
                              <td style={styles.ctstyle}> Fruits Id :</td>
                              <td>{data.farmerFruitsId}</td>
                             </tr>
                            </tbody>
                          </table>
                        </Col>
                      </Row>
                    
                    </Card.Body>
                  </Card>
                  </Col>
                )}


            {/* <div className={isActive ? "" : "d-none"}>      */}
            
                  {/* </div>  */}

      {/* <Block className="mt-3"> */}
      <Form noValidate validated={validated} onSubmit={postData}>
      <Row className="g-1 ">
      <Block className="mt-3">
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                 Buyers List
                </Card.Header>
                <Card.Body>
                  {/* <h3>Family Members</h3> */}
                  <Row className="g-gs mb-1">
                    <Col lg="6">
                      <Form.Group className="form-group mt-1">
                        <div className="form-control-wrap"></div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group d-flex align-items-center justify-content-end gap g-3">
                        <div className="form-control-wrap">
                          <ul className="">
                            <li>
                              <Button
                                className="d-md-none"
                                size="md"
                                variant="primary"
                                onClick={handleShowModal}
                              >
                                <Icon name="plus" />
                                <span>Add</span>
                              </Button>
                            </li>
                            <li>
                              <Button
                                className="d-none d-md-inline-flex"
                                variant="primary"
                                onClick={handleShowModal}
                              >
                                <Icon name="plus" />
                                <span>Add</span>
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  {dataLotList && dataLotList.length > 0 ? (
                    <Row className="g-gs">
                      <Block>
                        <Card>
                          <div
                            className="table-responsive"
                            // style={{ paddingBottom: "30px" }}
                          >
                            <table className="table small">
                              <thead>
                                <tr style={{ backgroundColor: "#f1f2f7" }}>
                                  {/* <th></th> */}
                                  <th>Action</th>
                                  <th>Buyer Type</th>
                                  <th>Buyer</th>
                                  <th>Lot Weight</th>
                                  <th>Amount</th>
                                  {/* <th>Market Fee</th> */}
                                  <th>Sold Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {dataLotList.map((item, i) => (
                                  <tr>
                                    <td>
                                      <div>
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() => handleGetLotDetails(i)}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() =>
                                            handleDeleteLotDetails(i)
                                          }
                                          // onClick={handleShowModal2}
                                          className="ms-2"
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </td>
                                    <td>{item.buyerType}</td>
                                    <td>{item.buyerId}</td>
                                    <td>{item.lotWeight}</td>
                                    <td>{item.amount}</td>
                                    {/* <td>{item.marketFee}</td> */}
                                    <td>{item.soldAmount}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </Card>
                      </Block>
                    </Row>
                  ) : (
                    ""
                  )}
                </Card.Body>
              </Card>

              </Block>
              </Row>
            

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </li>
                <li>
                  {/* <Link
                    to="/seriui/crate-list"
                    className="btn btn-secondary border-0"
                  >
                    Cancel
                  </Link> */}
                  <Button type="button" variant="secondary" onClick={clear}>
                    Cancel
                  </Button>
                </li>
              </ul>
            </div>
          {/* </Row> */}
        {/* </Form>
        
        </Block> */}
      
      {/* </Row> */}
        </Form>
      </Block>  

       <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add Lot Distribution Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form noValidate validated={validatedLot} onSubmit={handleAddLotDetails}>
          <Row className="g-5 ">     
                  <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Buyer Type<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="buyerType"
                            value={data.buyerType}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.buyerType === undefined ||
                              data.buyerType === "0"
                            }
                          >
                            <option value="">Select Budget Type</option>
                            <option value="Reeler">Reeler</option>
                            <option value="ExternalStakeHolders">External Stake Holders</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          Buyer Type is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    {/* {data.buyerType === "Reeler" ||
                    data.buyerType === "" ? (
                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            Reeler<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="buyerId"
                              value={`{data.buyerId}_${data.reelerName}`}
                              onChange={handleReelerOption}
                              onBlur={() => handleReelerOption}
                              required
                              isInvalid={
                                data.buyerId === undefined ||
                                data.buyerId === "0"
                              }
                            >
                              <option value="">Select Reeler</option>
                              {reelerListData.map((list) => (
                                <option
                                  key={`{list.reelerId}_${list.reelerName}`}
                                  value={list.reelerId}
                                >
                                  {list.reelerName}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Reeler is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}
                    {data.buyerType === "ExternalStakeHolders" ? (
                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                          External Stake Holders<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="buyerId"
                              value={`{data.buyerId}_${data.name}`}
                              onChange={handleExternalOption}
                              onBlur={() => handleExternalOption}
                              required
                              isInvalid={
                                data.buyerId === undefined ||
                                data.buyerId === "0"
                              }
                            >
                              <option value="">Select External Stake Holders</option>
                              {externalListData.map((list) => (
                                <option
                                  key={list.externalUnitRegistrationId}
                                  value={`{list.externalUnitRegistrationId}_${list.name}`}
                                >
                                  {list.name}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                            External Stake Holders is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )} */}
                    {data.buyerType === "Reeler" || data.buyerType === "" ? (
                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Reeler<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="buyerId"
                            value={`${data.buyerId}_${data.reelerName}`}
                            onChange={handleReelerOption}
                            onBlur={() => handleReelerOption}
                            required
                            isInvalid={
                              data.buyerId === undefined ||
                              data.buyerId === "0"
                            }
                          >
                            <option value="">Select Reeler</option>
                            {reelerListData.map((list) => (
                              <option
                                key={`${list.reelerId}_${list.reelerName}`}
                                value={`${list.reelerId}_${list.reelerName}`}
                              >
                                {list.reelerName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Reeler is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  ) : (
                    ""
                  )}

                  {data.buyerType === "ExternalStakeHolders" ? (
                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          External Stake Holders<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="buyerId"
                            value={`${data.buyerId}_${data.name}`}
                            onChange={handleExternalOption}
                            onBlur={() => handleExternalOption}
                            required
                            isInvalid={
                              data.buyerId === undefined ||
                              data.buyerId === "0"
                            }
                          >
                            <option value="">Select External Stake Holders</option>
                            {externalListData.map((list) => (
                              <option
                                key={`${list.externalUnitRegistrationId}_${list.name}`}
                                value={`${list.externalUnitRegistrationId}_${list.name}`}
                              >
                                {list.name}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            External Stake Holders is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  ) : (
                    ""
                  )}

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="approxWeightPerCrate">
                        Purchase Lot
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lotWeight"
                          name="lotWeight"
                          value={data.lotWeight}
                          onChange={handleInputs}
                          type="number"
                          placeholder="Enter Lot Weight"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Purchase Lot is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="approxWeightPerCrate">
                        Amount Per Kg
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="amount"
                          name="amount"
                          value={data.amount}
                          onChange={handleInputs}
                          type="number"
                          placeholder="Enter  Amount Per Kg"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Amount Per Kg is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="approxWeightPerCrate">
                        Market Fee
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="marketFee"
                          name="marketFee"
                          value={data.marketFee}
                          onChange={handleInputs}
                          type="number"
                          placeholder="Enter Market Fee"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Market Fee is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="approxWeightPerCrate">
                       Sold Amount
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="soldAmount"
                          name="soldAmount"
                          value={data.soldAmount}
                          onChange={handleInputs}
                          type="number"
                          placeholder="Enter Sold Amount"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Sold Amount is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                <Col lg="12">
                <div className="d-flex gap g-2 justify-content-center">
                  <div className="gap-col">
                    {/* <Button variant="primary" onClick={handleAddFamilyMembers}> */}
                    <Button type="submit" variant="primary">
                      Add
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal1} onHide={handleCloseModal1} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Lot Distribution Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form
            noValidate
            validated={validatedEdit}
            onSubmit={(e) => handleUpdateLotDetails(e, lotId, data)}
          >
          <Row className="g-5 ">     
                  <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Buyer Type<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="buyerType"
                            value={data.buyerType}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.buyerType === undefined ||
                              data.buyerType === "0"
                            }
                          >
                            <option value="">Select Budget Type</option>
                            <option value="Reeler">Reeler</option>
                            <option value="ExternalStakeHolders">External Stake Holders</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          Buyer Type is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                  {data.buyerType === "Reeler" || data.buyerType === "" ? (
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Reeler<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="buyerId"
                          value={`${data.buyerId}_${data.reelerName}`}
                          onChange={handleReelerOption}
                          onBlur={() => handleReelerOption}
                          required
                          isInvalid={
                            data.buyerId === undefined ||
                            data.buyerId === "0"
                          }
                        >
                          <option value="">Select Reeler</option>
                          {reelerListData.map((list) => (
                            <option
                              key={`${list.reelerId}_${list.reelerName}`}
                              value={`${list.reelerId}_${list.reelerName}`}
                            >
                              {list.reelerName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Reeler is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                ) : (
                  ""
                )}

                {data.buyerType === "ExternalStakeHolders" ? (
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        External Stake Holders<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="buyerId"
                          value={`${data.buyerId}_${data.name}`}
                          onChange={handleExternalOption}
                          onBlur={() => handleExternalOption}
                          required
                          isInvalid={
                            data.buyerId === undefined ||
                            data.buyerId === "0"
                          }
                        >
                          <option value="">Select External Stake Holders</option>
                          {externalListData.map((list) => (
                            <option
                              key={`${list.externalUnitRegistrationId}_${list.name}`}
                              value={`${list.externalUnitRegistrationId}_${list.name}`}
                            >
                              {list.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          External Stake Holders is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                ) : (
                  ""
                )}

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="approxWeightPerCrate">
                      Purchase Lot
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lotWeight"
                          name="lotWeight"
                          value={data.lotWeight}
                          onChange={handleInputs}
                          type="number"
                          placeholder="Enter Lot Weight"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Purchase Lot is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="approxWeightPerCrate">
                      Amount Per Kg
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="amount"
                          name="amount"
                          value={data.amount}
                          onChange={handleInputs}
                          type="number"
                          placeholder="Enter Amount Per Kg"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Amount Per Kg is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="approxWeightPerCrate">
                        Market Fee
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="marketFee"
                          name="marketFee"
                          value={data.marketFee}
                          onChange={handleInputs}
                          type="number"
                          placeholder="Enter Market Fee"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Market Fee is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="approxWeightPerCrate">
                       Sold Amount
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="soldAmount"
                          name="soldAmount"
                          value={data.soldAmount}
                          onChange={handleInputs}
                          type="number"
                          placeholder="Enter Sold Amount"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Sold Amount is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                <Col lg="12">
                <div className="d-flex gap g-2 justify-content-center">
                  <div className="gap-col">
                    {/* <Button variant="primary" onClick={handleAddFamilyMembers}> */}
                    <Button type="submit" variant="primary">
                      Update
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal> 
    </Layout>
  );
}

export default LotGroupage;
