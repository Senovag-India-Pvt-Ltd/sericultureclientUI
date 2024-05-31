import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Select } from "../../components";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURL1 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function BiddingSlip() {
  const [farmerDetails, setFarmerDetails] = useState({});
  const [farmerAddress, setFarmerAddress] = useState({});
  const [loading, setLoading] = useState(false);
  const [farmer, setFarmer] = useState({
    text: "",
    select: "mobileNumber",
  });

  const searchOptions = [
    { value: "fruitsId", label: "FRUITS ID" },
    { value: "farmerNumber", label: "FARMER NUMBER" },
    { value: "mobileNumber", label: "MOBILE NUMBER" },
  ];

  const [validated, setValidated] = useState(false);
  const [validatedDisplay, setValidatedDisplay] = useState(false);

  const [isActive, setIsActive] = useState(false);
  const [bank, setBank] = useState({
    farmerBankName: "",
    farmerBankAccountNumber: "",
    farmerBankBranchName: "",
    farmerBankIfscCode: "",
  });

  const [farmerNumber, setFarmerNumber] = useState("");

  console.log(farmer);

  const display = (event) => {
    // const fruitsId = farmer.fruitsId;
    // const { fruitsId, farmerNumber, mobileNumber } = farmer;
    // if (fruitsId) {

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedDisplay(true);
    } else {
      event.preventDefault();

      setData({
        farmerId: "",
        sourceMasterId: "",
        raceMasterId: "",
        dflCount: "",
        estimatedWeight: "",
        numberOfLot: "",
        numberOfSmallBin: "",
        numberOfBigBin: "",
        marketId: localStorage.getItem("marketId"),
        godownId: localStorage.getItem("godownId")
          ? localStorage.getItem("godownId")
          : 0,
      });
      setFarmerNumber("");
      setValidatedDisplay(false);
      setFarmerDetails({});
      setFarmerAddress({});
      setBank({
        farmerBankName: "",
        farmerBankAccountNumber: "",
        farmerBankBranchName: "",
        farmerBankIfscCode: "",
      });
      setAllotedLotList([]);
      setBigBinList([]);
      setSmallBinList([]);

      const { text, select } = farmer;
      let sendData;

      if (select === "mobileNumber") {
        sendData = {
          mobileNumber: text,
        };
      }
      if (select === "fruitsId") {
        sendData = {
          fruitsId: text,
        };
      }
      if (select === "farmerNumber") {
        sendData = {
          farmerNumber: text,
        };
      }

      setLoading(true);

      api
        .post(
          baseURLFarmer +
            `farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number`,
          sendData
        )
        .then((response) => {
          if (!response.data.content.error) {
            const farmerResponse = response.data.content.farmerResponse;
            setFarmerNumber(farmerResponse.farmerNumber);
            console.log("Response:", response.data.content.farmerResponse);
            // console.log("hello",response);
            const res = response.data.content.farmerBankAccount;
            setFarmerDetails(response.data.content.farmerResponse);
            setFarmerAddress(response.data.content.farmerAddressList);
            setData((prev) => {
              return {
                ...prev,
                farmerId: response.data.content.farmerResponse.farmerId,
              };
            });
            setLoading(false);
            setIsActive(true);
            if (res) {
              setBank({
                farmerBankName:
                  response.data.content.farmerBankAccount.farmerBankName,
                farmerBankAccountNumber:
                  response.data.content.farmerBankAccount
                    .farmerBankAccountNumber,
                farmerBankBranchName:
                  response.data.content.farmerBankAccount.farmerBankBranchName,
                farmerBankIfscCode:
                  response.data.content.farmerBankAccount.farmerBankIfscCode,
              });
            }
          } else {
            searchError(response.data.content.error_description);
          }

          //   // Logs after updating state
          // console.log('After updating state - farmerDetails:', farmerDetails);
          // console.log('After updating state - Bank Name:', farmerDetails && farmerDetails.farmerBankName);
        })
        .catch((err) => {
          console.error("Error fetching farmer details:", err);
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              searchError(err.response.data.validationErrors);
            }
          } else {
            Swal.fire({
              icon: "warning",
              title: "Details not Found",
            });
          }
          setFarmerDetails({});
          setLoading(false);
        });
    }
  };

  const increment = (_farmerId) => {
    api
      .post(baseURL2 + `farmer/update-farmer-without-fruits-id-counter`, {
        farmerId: _farmerId,
      })
      .then((response) => {
        // if (response.data.content.error) {
        //   saveError(response.data.content.error_description);
        // } else {
        //   saveSuccess();
        //   setData({
        //     stateName: "",
        //     stateNameInKannada: "",
        //   });
        //   setValidated(false);
        // }
      })
      .catch((err) => {
        // if (Object.keys(err.response.data.validationErrors).length > 0) {
        //   saveError(err.response.data.validationErrors);
        // }
      });
  };

  // useEffect(() => {
  //   display();
  // }, []);
  // useEffect(() => {
  //   display();
  // }, []);

  // useEffect(() => {
  //   // Log the updated state after setting bank details
  //   console.log('After updating state - farmerDetails:', farmerDetails);
  //   console.log('After updating state - Bank Name:', farmerDetails && farmerDetails.farmerBankName);
  // }, [farmerDetails]);

  // console.log(farmerDetails);

  const handleFarmerIdInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setFarmer({ ...farmer, [name]: value });
  };

  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: localStorage.getItem("godownId")
      ? localStorage.getItem("godownId")
      : 0,
    farmerId: "",
    sourceMasterId: "",
    raceMasterId: "",
    dflCount: "",
    estimatedWeight: "",
    numberOfLot: "",
    numberOfSmallBin: 0,
    numberOfBigBin: 1,
  });
  console.log(data);

  const { id } = useParams();
  // const [data] = useState(EducationDatas);
  // const [farmerDetails, setFarmerDetails] = useState({});
  // const [loading, setLoading] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    // setData({ ...data, [name]: value });
    setData((prevData) => {
      let updatedData = { ...prevData, [name]: value };
      if (name === "estimatedWeight") {
        const weight = parseInt(value);
        // console.log("hello", marketData.lotWeight);
        // debugger;
        if (isNaN(weight) || weight <= 0) {
          updatedData = {
            ...updatedData,
            numberOfLot: "",
            numberOfBigBin: 1,
            numberOfSmallBin: 1,
          };
        } else if (weight >= marketData.lotWeight) {
          updatedData = {
            ...updatedData,
            numberOfLot: Math.floor(weight / marketData.lotWeight) * 1,
          };
        } else if (weight < marketData.lotWeight) {
          updatedData = { ...updatedData, numberOfLot: 1 };
        }
      }
      return updatedData;
    });
  };

  // const handleDateChange = (newDate) => {
  //   setData({ ...data, marketAuctionDate: newDate });
  // };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [sourceData, setSourceData] = useState({});
  const [allotedLotList, setAllotedLotList] = useState([]);
  const [bigBinList, setBigBinList] = useState([]);
  const [smallBinList, setSmallBinList] = useState([]);

  // const commaSeparated = (datas) => {
  //   const result = datas.map((data) => data.toString());
  //   return result.join(", ");
  // };

  // console.log(commaSeparated);

  // const result = sourceData.allotedLotList.map((data) => data.toString());

  // const commasep = result.join(", ");
  const postData = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      try {
        const addGodown = localStorage.getItem("godownId")?localStorage.getItem("godownId"):0;
        const response = await api.post(baseURL + `auction/allot`, {...data,godownId:addGodown});
        if (response.data.errorCode === 0) {
          setSourceData(response.data.content);
          increment(response.data.content.farmerId);
          if (response.data.content.allotedLotList) {
            setAllotedLotList(response.data.content.allotedLotList);
          } else {
            setAllotedLotList([]);
          }

          if (response.data.content.allotedBigBinList) {
            setBigBinList(response.data.content.allotedBigBinList);
          } else {
            setBigBinList([]);
          }

          if (response.data.content.allotedSmallBinList) {
            setSmallBinList(response.data.content.allotedSmallBinList);
          } else {
            setSmallBinList([]);
          }

          if (
            response.data.content.allotedLotList.length ||
            response.data.content.allotedLotList
          ) {
            const list = response.data.content.allotedLotList;
            const openWindows = [];
            for (const item of list) {
              const promise = generateBiddingSlip(item);
              openWindows.push(promise);
            }
            await Promise.all(openWindows);
          }

          if (response.data.content) {
            let allotedBigBinList;
            let allotedSmallBinList;
            if (response.data.content.allotedBigBinList) {
              allotedBigBinList = response.data.content.allotedBigBinList;
            } else {
              allotedBigBinList = [];
            }

            if (response.data.content.allotedSmallBinList) {
              allotedSmallBinList = response.data.content.allotedSmallBinList;
            } else {
              allotedSmallBinList = [];
            }

            saveSuccess(allotedBigBinList, allotedSmallBinList);
          } else {
            saveError(response.data.errorMessages[0].message);
          }
        } else if (response.data.errorCode === -1) {
          saveError(response.data.errorMessages[0].message);
        }
      } catch (err) {
        // setData({});
        // saveError();
      }
      setValidated(true);
    }
  };
  console.log(allotedLotList);
  // to get Source
  const [sourceListData, setSourceListData] = useState([]);

  const getSourceList = () => {
    api
      .get(baseURL1 + `sourceMaster/get-all`)
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

  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = (_id) => {
    api
      .get(baseURL1 + `raceMarketMaster/get-by-market-master-id/${_id}`)
      .then((response) => {
        setRaceListData(response.data.content.raceMaster);
      })
      .catch((err) => {
        // setRaceListData([]);
      });
  };

  useEffect(() => {
    if (data.marketId) {
      getRaceList(data.marketId);
    }
  }, [data.marketId]);

  // to get Market list
  // const [marketListData, setMarketListData] = useState([]);

  // const getMarketList = () => {
  //   api
  //     .get(baseURL1 + `marketMaster/get-all`)
  //     .then((response) => {
  //       setMarketListData(response.data.content.marketMaster);
  //     })
  //     .catch((err) => {
  //       setMarketListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getMarketList();
  // }, []);
  //  console.log(marketListData);
  // to get Godown list
  // const [godownListData, setGodownListData] = useState([]);
  // const getGodownList = (_id) => {
  //   api
  //     .get(baseURL1 + `godown/get-by-market-master-id/${_id}`)
  //     .then((response) => {
  //       setGodownListData(response.data.content.godown);
  //       // setTotalRows(response.data.content.totalItems);
  //       setLoading(false);
  //       if (response.data.content.error) {
  //         setGodownListData([]);
  //       }
  //     })
  //     .catch((err) => {
  //       setGodownListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   if (data.marketId) {
  //     getGodownList(data.marketId);
  //   }
  // }, [data.marketId]);

  // To get market
  const [marketData, setMarketData] = useState({});

  const getMarket = (_id) => {
    api
      .get(baseURL1 + `marketMaster/get/${_id}`)
      .then((response) => {
        // debugger;
        setMarketData(response.data.content);
      })
      .catch((err) => {
        // setMarketData([]);
      });
  };

  useEffect(() => {
    if (data.marketId) {
      getMarket(data.marketId);
    }
  }, [data.marketId]);

  // const generateBiddingSlip = (allotedLotId) =>{
  //   // const newDate = new Date();
  //   // const formattedDate =
  //   //   newDate.getFullYear() +
  //   //   "-" +
  //   //   (newDate.getMonth() + 1) +
  //   //   "-" +
  //   //   newDate.getDate();

  //   const newDate = new Date();
  //   const formattedDate =
  //     newDate.getFullYear() +
  //     "-" +
  //     (newDate.getMonth() + 1).toString().padStart(2, '0') +
  //     "-" +
  //     newDate.getDate().toString().padStart(2, '0');

  //   axios
  //       .post(
  //         `https://api.senovagseri.com/reports/marketreport/getfarmercopy`,
  //         {
  //           marketId: data.marketId,
  //           godownId: data.godownId,
  //           allottedLotId: allotedLotId,
  //           auctionDate: formattedDate,
  //           // marketId: "31",
  //           // godownId: "0",
  //           // allottedLotId: "12",
  //           // auctionDate: "2023-12-30",
  //         },
  //         {
  //           responseType: "blob", //Force to receive data in a Blob Format
  //         }
  //       )
  //       .then((response) => {
  //         //console.log("hello world", response.data);
  //         //Create a Blob from the PDF Stream
  //         const file = new Blob([response.data], { type: "application/pdf" });
  //         //Build a URL from the file
  //         const fileURL = URL.createObjectURL(file);
  //         //Open the URL on new Window
  //         window.open(fileURL);
  //       })
  //       .catch((error) => {
  //         // console.log("error", error);
  //       });
  // }

  const generateBiddingSlip = async (allotedLotId) => {
    const newDate = new Date();
    const formattedDate =
      newDate.getFullYear() +
      "-" +
      (newDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      newDate.getDate().toString().padStart(2, "0");

    try {
      const response = await api.post(
        baseURLReport + `getfarmercopy-kannada`,
        {
          marketId: data.marketId,
          godownId: data.godownId,
          allottedLotId: allotedLotId,
          auctionDate: formattedDate,
        },
        {
          responseType: "blob", //Force to receive data in a Blob Format
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);

      // const file = new Blob([response.data], { type: "application/pdf" });
      // const fileURL = URL.createObjectURL(file);
      // const printWindow = window.open(fileURL);
      // if (printWindow) {
      //   printWindow.onload = () => {
      //     printWindow.print();
      //   };
      // } else {
      //   console.error("Failed to open the print window.");
      // }
    } catch (error) {
      // console.log("error", error);
    }
  };

  //  console.log(marketData);
  // console.log("farmerAddress", farmerAddress);

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
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

  console.log("Data", data);
  // const [farmer, setFarmer] = useState({
  //   fruitsId: "",
  // });

  // const [isActive, setIsActive] = useState(false);
  // const display = () => {
  //   const fruitsId = farmer.fruitsId;
  //   if (fruitsId) {
  //   axios
  //     .post(
  //       `http://13.200.62.144:8000/farmer-registration/v1/farmer/get-farmer-details`,{fruitsId}

  //     )
  //     .then((response) => {
  //       console.log('Response:', response.data);
  //       setFarmerDetails(response.data.content.farmerResponse.isFruitService);
  //       // console.log('Farmer Details:', response.data.content.isFruitService);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setFarmerDetails({});
  //       setLoading(false);
  //     });
  //     setIsActive((current) => !current);
  //   } else {
  //     setFarmerDetails({});
  //   }
  // };

  const [isSubmit, setisSubmit] = useState(false);
  const show = () => {
    setisSubmit((current) => !current);
  };

  const navigate = useNavigate();
  const saveSuccess = (bigList, smallList) => {
    let small;
    let big;
    if (bigList.length) {
      big = ` Big ${bigList.join(",")}`;
    } else {
      big = "";
    }

    if (smallList.length) {
      small = ` Small ${smallList.join(",")}`;
    } else {
      small = "";
    }
    Swal.fire({
      icon: "success",
      title: "Bidding Slip has been generated",
      text: `Alloted Bin number ${big} ${small}`,
      width: 300,
      // customClass: styles.sweetsize,
    });
  };

  const saveError = (message = "Something went wrong!") => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: message,
    });
  };

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

  return (
    <Layout title="Bidding Slip" show="true">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Bidding Slip</Block.Title>
            {/* <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Bidding Slip
                </li>
              </ol>
            </nav> */}
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        {/* <Form action="#"> */}
        <Form noValidate validated={validatedDisplay} onSubmit={display}>
          <Card>
            <Card.Body>
              <Row className="g-gs">
                {/* <Col lg="12">
                    <Form.Group as={Row} className="form-group" id="fid">
                      <Form.Label column sm={3}>
                        FRUITS ID / FARMER NUMBER<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={3}>
                        <Form.Control
                          id="fruitsId"
                          name="fruitsId"
                          value={farmer.fruitsId}
                          onChange={handleFarmerIdInputs}
                          type="text"
                          placeholder="Enter FRUITS ID / FARMER NUMBER"
                        />
                      </Col> */}
                <Col sm={8} lg={12}>
                  <Form.Group as={Row} className="form-group" id="fid">
                    <Form.Label column sm={1} lg={2}>
                      Search Farmer Details By
                    </Form.Label>
                    <Col sm={1} lg={2}>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="select"
                          value={farmer.select}
                          onChange={handleFarmerIdInputs}
                        >
                          {/* <option value="">Select</option> */}
                          <option value="mobileNumber">Mobile Number</option>
                          <option value="fruitsId">Fruits Id</option>
                          <option value="farmerNumber">Farmer Number</option>
                        </Form.Select>
                      </div>
                    </Col>

                    <Col sm={2} lg={2}>
                      <Form.Control
                        id="fruitsId"
                        name="text"
                        value={farmer.text}
                        onChange={handleFarmerIdInputs}
                        type="text"
                        placeholder="Search"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Field Value is Required
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={2} lg={3}>
                      <Button type="submit" variant="primary">
                        Search
                      </Button>
                    </Col>
                    {/* <Col sm={2} style={{ marginLeft: "-280px" }}> */}
                    <Col sm={1} lg={2} style={{ marginLeft: "-15%" }}>
                      <Link
                        to="/seriui/stake-holder-registration"
                        className="btn btn-primary border-0"
                      >
                        Add New
                      </Link>
                    </Col>
                    <Col sm={1} lg={3} style={{ marginLeft: "-5%" }}>
                      <Form.Group as={Row} className="form-group" id="date">
                        <Form.Label column sm={2} lg={3}>
                          Date
                        </Form.Label>
                        <Col sm={1} lg={1} style={{ marginLeft: "-10%" }}>
                          <div className="form-control-wrap">
                            <DatePicker
                              dateFormat="dd/MM/yyyy"
                              selected={new Date()}
                              // className="form-control"
                              readOnly
                            />
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>
        <Form
          noValidate
          validated={validated}
          onSubmit={postData}
          className="mt-2"
        >
          <Row className="g-3 ">
            <div className={isActive ? "" : "d-none"}>
              <Row className="g-gs">
                <Col lg="5">
                  <Card>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="12">
                          <Form.Group
                            as={Row}
                            className="form-group"
                            id="source"
                          >
                            <Form.Label column sm={4}>
                              Source
                            </Form.Label>
                            <Col sm={8}>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="sourceMasterId"
                                  value={data.sourceMasterId}
                                  onChange={handleInputs}
                                >
                                  <option value="0">Select Source</option>
                                  {sourceListData.map((list) => (
                                    <option
                                      key={list.sourceMasterId}
                                      value={list.sourceMasterId}
                                    >
                                      {list.sourceMasterName}
                                    </option>
                                  ))}
                                </Form.Select>
                              </div>
                            </Col>
                          </Form.Group>

                          <Form.Group
                            as={Row}
                            className="form-group mt-1"
                            id="race"
                          >
                            <Form.Label column sm={4}>
                              Race<span className="text-danger">*</span>
                            </Form.Label>
                            {/* <Col sm={8}>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="raceMasterId"
                                  value={data.raceMasterId}
                                  onChange={handleInputs}
                                >
                                  <option value="0">Select Race</option>
                                  {raceListData.map((list) => (
                                    <option
                                      key={list.raceMasterId}
                                      value={list.raceMasterId}
                                    >
                                      {list.raceMasterName}
                                    </option>
                                  ))}
                                </Form.Select>
                              </div>
                            </Col> */}
                            <Col sm={8}>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="raceMasterId"
                                  value={data.raceMasterId}
                                  onChange={handleInputs}
                                  required
                                >
                                  <option value="">Select Race</option>
                                  {raceListData ? (
                                    raceListData.map((list) => (
                                      <option
                                        key={list.raceMasterId}
                                        value={list.raceMasterId}
                                      >
                                        {list.raceMasterName}
                                      </option>
                                    ))
                                  ) : (
                                    <option value="" disabled>
                                      No Race found for this market
                                    </option>
                                  )}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Race is required
                                </Form.Control.Feedback>
                              </div>
                            </Col>
                          </Form.Group>

                          {/* <Form.Group
                            as={Row}
                            className="form-group mt-3"
                            id="market"
                          >
                            <Form.Label column sm={4}>
                              Market
                            </Form.Label>
                            <Col sm={8}>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="marketId"
                                  value={data.marketId}
                                  onChange={handleInputs}
                                >
                                  <option value="0">Select Market</option>
                                  {marketListData.map((list) => (
                                    <option
                                      key={list.marketMasterId}
                                      value={list.marketMasterId}
                                    >
                                      {list.marketMasterName}
                                    </option>
                                  ))}
                                </Form.Select>
                              </div>
                            </Col>
                          </Form.Group> */}

                          {/* <Form.Group
                            as={Row}
                            className="form-group mt-3"
                            id="godown"
                          >
                            <Form.Label column sm={4}>
                              Godown<span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm={8}>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="godownId"
                                  value={data.godownId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs}
                                  required
                                  isInvalid={
                                    data.godownId === undefined ||
                                    data.godownId === "0"
                                  }
                                >
                                  <option value="">Select Godown</option>
                                  {godownListData.map((list) => (
                                    <option
                                      key={list.godownId}
                                      value={list.godownId}
                                    >
                                      {list.godownName}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Godown is required
                                </Form.Control.Feedback>
                              </div>
                            </Col>
                          </Form.Group> */}

                          <Form.Group
                            as={Row}
                            className="form-group mt-1"
                            id="dfl"
                          >
                            <Form.Label column sm={4}>
                              No. of DFL's<span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Control
                                type="number"
                                name="dflCount"
                                min={0}
                                value={data.dflCount}
                                onChange={handleInputs}
                                placeholder="Enter No. of DFL's"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                No of DFL's is required
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>

                          {/* <Form.Group
                            as={Row}
                            className="form-group mt-1"
                            id="date"
                          >
                            <Form.Label column sm={4}>
                              Market Auction Date
                            </Form.Label>
                            <Col sm={8}>
                              <div className="form-control-wrap">
                                <DatePicker
                                  dateFormat="dd/MM/yyyy"
                                  selected={new Date()}
                                  readOnly
                                />
                              </div>
                            </Col>
                          </Form.Group> */}

                          <Form.Group
                            as={Row}
                            className="form-group mt-1"
                            id="dfl"
                          >
                            <Form.Label column sm={4}>
                              Weight<span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Control
                                type="number"
                                min={0}
                                name="estimatedWeight"
                                value={data.estimatedWeight}
                                onChange={handleInputs}
                                placeholder="Enter Weight"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Weight is required
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>

                          <Form.Group
                            as={Row}
                            className="form-group mt-1"
                            id="numberOfLot"
                          >
                            <Form.Label column sm={4}>
                              No. of Lot<span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Control
                                type="number"
                                name="numberOfLot"
                                min={0}
                                value={data.numberOfLot}
                                onChange={handleInputs}
                                required
                                // placeholder="Enter No. of DFL's"
                              />
                              <Form.Control.Feedback type="invalid">
                                No. of Lot is required
                              </Form.Control.Feedback>
                            </Col>
                            {/* <Col sm={4}>
                              <Form.Control
                                type="number"
                                // placeholder="Enter No. of DFL's"
                              />
                            </Col> */}
                          </Form.Group>

                          <div className="d-flex justify-content-between">
                            <Form.Group
                              as={Row}
                              className="form-group mt-1"
                              id="numberOfBigBin"
                            >
                              <Form.Label column sm={6}>
                                No. of Bin(Big)
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <Col sm={6}>
                                <Form.Control
                                  type="number"
                                  min={0}
                                  name="numberOfBigBin"
                                  value={data.numberOfBigBin}
                                  onChange={handleInputs}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Big Bin is required.
                                </Form.Control.Feedback> */}
                              </Col>
                            </Form.Group>
                            <Form.Group
                              as={Row}
                              className="form-group mt-1 ms-1"
                              id="numberOfSmallBin"
                            >
                              <Form.Label column sm={6}>
                                No. of Bin(small)
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <Col sm={6}>
                                <Form.Control
                                  min={0}
                                  type="number"
                                  name="numberOfSmallBin"
                                  value={data.numberOfSmallBin}
                                  onChange={handleInputs}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Big Bin is required.
                                </Form.Control.Feedback> */}
                              </Col>
                            </Form.Group>
                          </div>
                        </Col>

                        {/* <Col lg="6">
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="setamt">Set Amount</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="setamt"
                            type="text"
                            placeholder="Set Amount"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="addben">
                          Add Beneficiary
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="addben"
                            type="text"
                            placeholder="Add Beneficiary"
                          />
                        </div>
                      </Form.Group>
                    </Col> */}
                      </Row>
                    </Card.Body>
                  </Card>
                  <div className="gap-col mt-1">
                    <ul className="d-flex align-items-center justify-content-center gap g-3">
                      <li>
                        {/* <Button
                          type="button"
                          variant="primary"
                          onClick={postData}
                        > */}
                        <Button type="submit" variant="primary">
                          Submit
                        </Button>
                      </li>
                      {/* <li>
                        <Link to="#" className="btn btn-primary border-0">
                          Print Bidding Slip
                        </Link>
                      </li> */}
                    </ul>
                  </div>

                  {/* <div className={isSubmit ? "mt-2" : "d-none"}>

                    {isSubmit ? (
                      sourceData.allotedLotList.length > 0 ? (
                        <Card>
                          <Card.Header>Print Bidding Slip</Card.Header>
                          <Card.Body>
                            <Row className="g-gs">
                              <Col lg="12">
                                <Block>
                                  <Card>
                                    <div
                                      className="table-responsive"
                                    >
                                      <table className="table small">
                                        <thead>
                                          <tr
                                            style={{
                                              backgroundColor: "#f1f2f7",
                                            }}
                                          >
                                            <th>Lot Number</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {sourceData.allotedLotList.map(
                                            (data) => (
                                              <tr>
                                                <td>{data}</td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </Card>
                                </Block>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </div>

                  <div className={isSubmit ? "mt-2" : "d-none"}>
                    {isSubmit ? (
                      sourceData.allotedSmallBinList.length > 0 ? (
                        <Card>
                          <Card.Header>Small Bin</Card.Header>
                          <Card.Body>
                            <Row className="g-gs">
                              <Col lg="12">
                                <Block>
                                  <Card>
                                    <div
                                      className="table-responsive"
                                    >
                                      <table className="table small">
                                        <thead>
                                          <tr
                                            style={{
                                              backgroundColor: "#f1f2f7",
                                            }}
                                          >
                                            <th>Small Bin Number</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {sourceData.allotedSmallBinList.map(
                                            (data) => (
                                              <tr>
                                                <td>{data}</td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </Card>
                                </Block>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </div>

                  <div className={isSubmit ? "mt-2" : "d-none"}>
                    {isSubmit ? (
                      sourceData.allotedBigBinList.length > 0 ? (
                        <Card>
                          <Card.Header>Big Bin</Card.Header>
                          <Card.Body>
                            <Row className="g-gs">
                              <Col lg="12">
                                <Block>
                                  <Card>
                                    <div
                                      className="table-responsive"
                                      
                                    >
                                      <table className="table small">
                                        <thead>
                                          <tr
                                            style={{
                                              backgroundColor: "#f1f2f7",
                                            }}
                                          >
                                            <th>Big Bin Number</th>
                                            
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {sourceData.allotedBigBinList.map(
                                            (data) => (
                                              <tr>
                                                <td>{data}</td>
                                                
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </Card>
                                </Block>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </div> */}
                </Col>

                <Col lg="2">
                  {/* <Card>
                    <Card.Header>Details</Card.Header>
                    <Card.Body>
                      <Row className="g-gs"> */}
                  <table className="table small table-bordered">
                    <tbody>
                      <tr>
                        <td style={styles.top}>Farmer Number</td>
                      </tr>
                      <tr>
                        <td style={styles.bottom}>
                          {farmerNumber ? farmerNumber : "---"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.top}> Lot Number</td>
                      </tr>
                      <tr>
                        {/* <td style={styles.bottom}>
                          {data.numberOfLot ? data.numberOfLot : "---"}
                        </td> */}
                        <td style={styles.bottom}>
                          {allotedLotList.length
                            ? allotedLotList.join(",")
                            : "---"}
                        </td>
                        {/* <td style={styles.bottom}>
                          {allotedLotList.length
                            ? (allotedLotList.map((element, index) => (
                              <span key={index}>
                                <span style={{cursor:"pointer"}} onClick={()=>generateBiddingSlip(element)}>{element}</span>
                                {index < allotedLotList.length - 1 && ' , '}
                              </span>
                            )))
                            : "---"}
                        </td> */}
                      </tr>
                      <tr>
                        <td style={styles.top}> Bin Number</td>
                      </tr>
                      <tr>
                        <td style={styles.bottom}>
                          {/* {data.numberOfBigBin ? data.numberOfBigBin : "---"} */}
                          {bigBinList.length
                            ? `Big Bin: ${bigBinList.join(",")}`
                            : "---"}{" "}
                          {smallBinList.length
                            ? `Small Bin: ${smallBinList.join(",")}`
                            : "---"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {/* </Row>
                    </Card.Body>
                  </Card> */}
                </Col>

                <Col lg="5">
                  <Card>
                    <Card.Header>Farmer Personal Info</Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="12">
                          <table className="table small table-bordered">
                            <tbody>
                              <tr>
                                <td style={styles.ctstyle}> Farmer Number:</td>
                                <td>{farmerNumber}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> Farmer Name:</td>
                                <td>
                                  {farmerDetails && farmerDetails.firstName}
                                </td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  Father's/Husband's Name:
                                </td>
                                <td>
                                  {farmerDetails && farmerDetails.fatherName}
                                </td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> Gender:</td>
                                <td>
                                  {farmerDetails && farmerDetails.genderId === 1
                                    ? "Male"
                                    : farmerDetails &&
                                      farmerDetails.genderId === 2
                                    ? "Female"
                                    : "Other"}
                                </td>
                              </tr>
                              {/* <tr>
                                <td style={styles.ctstyle}>Village:</td>
                                <td>{farmerDetails && farmerDetails.villageId}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> State:</td>
                                <td>{farmerDetails && farmerDetails.stateId}</td>
                              </tr> */}
                              {/* <tr>
                                <td style={styles.ctstyle}> TSC:</td>
                                <td>{fruitsId.farmerId}</td>
                              </tr> */}
                              <tr>
                                <td style={styles.ctstyle}> Phone Number:</td>
                                <td>
                                  {farmerDetails && farmerDetails.mobileNumber}
                                </td>
                              </tr>
                              {/* <tr>
                                <td style={styles.ctstyle}> Aadhaar Number:</td>
                                <td>{fruitsId.farmerId}</td>
                              </tr> */}
                              {/* <tr>
                                <td style={styles.ctstyle}> EPIC Number:</td>
                                <td>
                                  {farmerDetails && farmerDetails.epicNumber}
                                </td>
                              </tr> */}
                              <tr>
                                <td style={styles.ctstyle}> Farmer Address:</td>
                                <td>
                                  {/* {farmerAddress.length &&
                                    farmerAddress[0].villageName} */}
                                  {farmerAddress &&
                                    farmerAddress.length > 0 &&
                                    farmerAddress[0].addressText &&
                                    farmerAddress[0].addressText}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="card-gutter-md mt-4">
                    <Card.Header>Bank Details</Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="12">
                          {/* {console.log('farmerDetails:', farmerDetails)} */}
                          {/* {console.log('bank:', farmerDetails && farmerDetails.farmerBankAccount)} */}

                          <table className="table small table-bordered">
                            <tbody>
                              <tr>
                                <td style={styles.ctstyle}> Bank Name:</td>
                                <td>{bank.farmerBankName}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> Branch:</td>
                                <td>{bank.farmerBankBranchName}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> Account Number:</td>
                                <td>{bank.farmerBankAccountNumber}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> IFSC Code:</td>
                                <td>{bank.farmerBankIfscCode}</td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default BiddingSlip;
