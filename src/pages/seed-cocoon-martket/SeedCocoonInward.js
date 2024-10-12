import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Select } from "../../components";
import Icon from "../../components/Icon/Icon";

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

function SeedCocoonInward() {
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

  // Below for modal window for personal details
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Below for modal window for FC details
  const [showModalFC, setShowModalFC] = useState(false);
  const handleShowModalFC = () => setShowModalFC(true);
  const handleCloseModalFC = () => setShowModalFC(false);

  // Below for modal window for Crop details
  const [showModalCrop, setShowModalCrop] = useState(false);
  const handleShowModalCrop = () => setShowModalCrop(true);
  const handleCloseModalCrop = () => setShowModalCrop(false);

  // Below for modal window for Initial Weighment
  const [showModalWeighment, setShowModalWeighment] = useState(false);
  const handleShowModalWeighment = () => setShowModalWeighment(true);
  const handleCloseModalWeighment = () => setShowModalWeighment(false);

  // For handle Date
  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // handle intial Weighment
  const [validatedInitialWeighment, setValidatedInitialWeighment] =
    useState(false);
  const handleinitialWeighment = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedInitialWeighment(true);
    } else {
      e.preventDefault();
      // setFamilyMembersList((prev) => [...prev, familyMembers]);
      // setFamilyMembers({
      //   relationshipId: "",
      //   farmerFamilyName: "",
      // });
      setShowModalWeighment(false);
      setValidatedInitialWeighment(false);
    }
    // e.preventDefault();
  };

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
    event.preventDefault();
    setIsActive(!isActive);

    // const form = event.currentTarget;
    // if (form.checkValidity() === false) {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   setValidatedDisplay(true);
    // } else {
    //   event.preventDefault();

    //   setData({
    //     farmerId: "",
    //     sourceMasterId: "",
    //     raceMasterId: "",
    //     dflCount: "",
    //     estimatedWeight: "",
    //     numberOfLot: "",
    //     numberOfSmallBin: "",
    //     numberOfBigBin: "",
    //     marketId: localStorage.getItem("marketId"),
    //     godownId: localStorage.getItem("godownId")
    //       ? localStorage.getItem("godownId")
    //       : 0,
    //   });
    //   setFarmerNumber("");
    //   setValidatedDisplay(false);
    //   setFarmerDetails({});
    //   setFarmerAddress({});
    //   setBank({
    //     farmerBankName: "",
    //     farmerBankAccountNumber: "",
    //     farmerBankBranchName: "",
    //     farmerBankIfscCode: "",
    //   });
    //   setAllotedLotList([]);
    //   setBigBinList([]);
    //   setSmallBinList([]);

    //   const { text, select } = farmer;
    //   let sendData;

    //   if (select === "mobileNumber") {
    //     sendData = {
    //       mobileNumber: text,
    //     };
    //   }
    //   if (select === "fruitsId") {
    //     sendData = {
    //       fruitsId: text,
    //     };
    //   }
    //   if (select === "farmerNumber") {
    //     sendData = {
    //       farmerNumber: text,
    //     };
    //   }

    //   setLoading(true);

    //   api
    //     .post(
    //       baseURLFarmer +
    //         `farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number`,
    //       sendData
    //     )
    //     .then((response) => {
    //       if (!response.data.content.error) {
    //         const farmerResponse = response.data.content.farmerResponse;
    //         setFarmerNumber(farmerResponse.farmerNumber);
    //         console.log("Response:", response.data.content.farmerResponse);
    //         // console.log("hello",response);
    //         const res = response.data.content.farmerBankAccount;
    //         setFarmerDetails(response.data.content.farmerResponse);
    //         setFarmerAddress(response.data.content.farmerAddressList);
    //         setData((prev) => {
    //           return {
    //             ...prev,
    //             farmerId: response.data.content.farmerResponse.farmerId,
    //           };
    //         });
    //         setLoading(false);
    //         setIsActive(true);
    //         if (res) {
    //           setBank({
    //             farmerBankName:
    //               response.data.content.farmerBankAccount.farmerBankName,
    //             farmerBankAccountNumber:
    //               response.data.content.farmerBankAccount
    //                 .farmerBankAccountNumber,
    //             farmerBankBranchName:
    //               response.data.content.farmerBankAccount.farmerBankBranchName,
    //             farmerBankIfscCode:
    //               response.data.content.farmerBankAccount.farmerBankIfscCode,
    //           });
    //         }
    //       } else {
    //         searchError(response.data.content.error_description);
    //       }

    //       //   // Logs after updating state
    //       // console.log('After updating state - farmerDetails:', farmerDetails);
    //       // console.log('After updating state - Bank Name:', farmerDetails && farmerDetails.farmerBankName);
    //     })
    //     .catch((err) => {
    //       console.error("Error fetching farmer details:", err);
    //       if (
    //         err.response &&
    //         err.response.data &&
    //         err.response.data.validationErrors
    //       ) {
    //         if (Object.keys(err.response.data.validationErrors).length > 0) {
    //           searchError(err.response.data.validationErrors);
    //         }
    //       } else {
    //         Swal.fire({
    //           icon: "warning",
    //           title: "Details not Found",
    //         });
    //       }
    //       setFarmerDetails({});
    //       setLoading(false);
    //     });
    // }
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
    dob: new Date(),
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
      generateBiddingSlip(1);
      // try {
      //   const addGodown = localStorage.getItem("godownId")
      //     ? localStorage.getItem("godownId")
      //     : 0;
      //   const response = await api.post(baseURL + `auction/allot`, {
      //     ...data,
      //     godownId: addGodown,
      //   });
      //   if (response.data.errorCode === 0) {
      //     setSourceData(response.data.content);
      //     increment(response.data.content.farmerId);
      //     if (response.data.content.allotedLotList) {
      //       setAllotedLotList(response.data.content.allotedLotList);
      //     } else {
      //       setAllotedLotList([]);
      //     }

      //     if (response.data.content.allotedBigBinList) {
      //       setBigBinList(response.data.content.allotedBigBinList);
      //     } else {
      //       setBigBinList([]);
      //     }

      //     if (response.data.content.allotedSmallBinList) {
      //       setSmallBinList(response.data.content.allotedSmallBinList);
      //     } else {
      //       setSmallBinList([]);
      //     }

      //     if (
      //       response.data.content.allotedLotList.length ||
      //       response.data.content.allotedLotList
      //     ) {
      //       const list = response.data.content.allotedLotList;
      //       const openWindows = [];
      //       for (const item of list) {
      //         const promise = generateBiddingSlip(item);
      //         openWindows.push(promise);
      //       }
      //       await Promise.all(openWindows);
      //     }

      //     if (response.data.content) {
      //       let allotedBigBinList;
      //       let allotedSmallBinList;
      //       if (response.data.content.allotedBigBinList) {
      //         allotedBigBinList = response.data.content.allotedBigBinList;
      //       } else {
      //         allotedBigBinList = [];
      //       }

      //       if (response.data.content.allotedSmallBinList) {
      //         allotedSmallBinList = response.data.content.allotedSmallBinList;
      //       } else {
      //         allotedSmallBinList = [];
      //       }

      //       saveSuccess(allotedBigBinList, allotedSmallBinList);
      //     } else {
      //       saveError(response.data.errorMessages[0].message);
      //     }
      //   } else if (response.data.errorCode === -1) {
      //     saveError(response.data.errorMessages[0].message);
      //   }
      // } catch (err) {
      //   // setData({});
      //   // saveError();
      // }
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
      const response = await axios.post(
        // baseURLReport + `getfarmercopy-kannada`,
        `https://e-reshme.karnataka.gov.in/reports/marketreport/getfarmercopy-kannada`,

        {
          marketId: 1,
          godownId: 0,
          allottedLotId: allotedLotId,
          auctionDate: "2024-10-01",
        },
        {
          responseType: "blob", //Force to receive data in a Blob Format
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJnb2Rvd25JZCI6MSwicGhvbmVOdW1iZXIiOiI2MzY2MTI1ODY5Iiwicm9sZUlkIjoxLCJ1c2VyVHlwZSI6MCwidXNlck1hc3RlcklkIjo1OTMsInVzZXJuYW1lIjoibWFya2V0IiwibWFya2V0SWQiOjEsInN1YiI6Im1hcmtldCIsImlhdCI6MTcyNzg4MjM5OCwiZXhwIjoxNzI5NjgyMzk4fQ.sdw6GLGYq0SwrCvtLNvoWyBnwBrmAy0CNW8rkZ8Pu40"
          }
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
    <Layout title="Seed Cocoon E-Inward" show="true">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Seed Cocoon E-Inward</Block.Title>
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
                          <option value="csbNumber">CSB Number</option>
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
                        Clear
                      </Link>
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
              <Row>
                <Col lg="12">
                  <Card>
                    <Card.Body>
                      <Row>
                        <Col lg="3">
                          <Form.Group as={Row} className="form-group">
                            <Form.Label column sm={12}>
                              <div
                                className="d-flex align-items-center"
                                onClick={handleShowModal}
                              >
                                <Icon name="info-fill" size="lg"></Icon>
                                <span>Personal Details</span>
                              </div>
                            </Form.Label>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="3">
                          <Form.Group as={Row} className="form-group">
                            <Form.Label column sm={12}>
                              <div
                                className="d-flex align-items-center"
                                onClick={handleShowModalFC}
                              >
                                <Icon name="info-fill" size="lg"></Icon>
                                <span>FC Details</span>
                              </div>
                            </Form.Label>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="3">
                          <Form.Group as={Row} className="form-group">
                            <Form.Label column sm={12}>
                              <div
                                className="d-flex align-items-center"
                                onClick={handleShowModalCrop}
                              >
                                <Icon name="info-fill" size="lg"></Icon>
                                <span>Crop Details</span>
                              </div>
                            </Form.Label>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="3">
                          <Form.Group as={Row} className="form-group">
                            <Form.Label column sm={12}>
                              <div
                                className="d-flex align-items-center"
                                onClick={handleShowModalWeighment}
                              >
                                <Icon name="info-fill" size="lg"></Icon>
                                <span>Initial Weighment</span>
                              </div>
                            </Form.Label>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <div className="gap-col mt-1">
                    <ul className="d-flex align-items-center justify-content-center gap g-3">
                      <li>
                        <Button type="submit" variant="primary" >
                          Submit
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
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Personal Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <Row className="g-5">
              <Col lg="6">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Farmer Number:</td>
                      {/* <td>{farmerNumber}</td> */}
                      <td>00004825062024</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Farmer Name:</td>
                      {/* <td>{farmerDetails && farmerDetails.firstName}</td> */}
                      <td>SHIVANNA</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Father's/Husband's Name:</td>
                      {/* <td>{farmerDetails && farmerDetails.fatherName}</td> */}
                      <td>Veerabhadraiah</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Gender:</td>
                      {/* <td>
                        {farmerDetails && farmerDetails.genderId === 1
                          ? "Male"
                          : farmerDetails && farmerDetails.genderId === 2
                          ? "Female"
                          : "Other"}
                      </td> */}
                      <td>Male</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Phone Number:</td>
                      {/* <td>{farmerDetails && farmerDetails.mobileNumber}</td> */}
                      <td>9632297390</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Farmer Address:</td>
                      {/* <td>
                        {farmerAddress &&
                          farmerAddress.length > 0 &&
                          farmerAddress[0].addressText &&
                          farmerAddress[0].addressText}
                      </td> */}
                      <td>S BYADARAHALLI</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showModalFC} onHide={handleCloseModalFC} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>FC Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column justify-content-center">
            <Row className="g-5">
              <Col
                lg="12"
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <h3>Fitness Certificate</h3>
                <img
                  src="https://5.imimg.com/data5/ANDROID/Default/2024/7/434434494/XL/GV/OX/14251721/prod-20240712-2228471980760355427493851-jpg-1000x1000.jpg"
                  alt="FC Details"
                  width="300"
                  height="300"
                />
              </Col>
            </Row>
            <Row className="g-5">
              <Col
                lg="12"
                className="d-flex justify-content-center align-items-center"
              >
                <Form.Group className="form-group mt-3">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Confirmed
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Row className="d-flex align-items-center">
                      <Col lg="auto">
                        <Form.Check
                          type="radio"
                          id="yes"
                          name="subsidyAvailed"
                          label="Yes"
                          value="yes"
                          // onChange={handleChange}
                          // checked={selected === "yes"}
                        />
                      </Col>
                      <Col lg="auto">
                        <Form.Check
                          type="radio"
                          id="no"
                          value="no"
                          name="subsidyAvailed"
                          defaultChecked
                          // onChange={handleChange}
                          // checked={selected === "no"}
                          label="No"
                        />
                      </Col>
                    </Row>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showModalCrop} onHide={handleCloseModalCrop} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Crop Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <Row
              className="g-5 d-flex justify-content-center"
              style={{ width: "100%" }}
            >
              <Col lg="6">
                <table
                  className="table small table-bordered"
                  style={{ width: "100%" }}
                >
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> No of DFL's:</td>
                      <td>200</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Lot No.:</td>
                      <td>MAG003</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Source(Grainage Name):</td>
                      <td>CV</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Variety(Field Name):</td>
                      <td>Magadi</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Parental Level:</td>
                      <td>P3</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showModalWeighment}
        onHide={handleCloseModalWeighment}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Crop Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validatedInitialWeighment}
            onSubmit={handleinitialWeighment}
          >
            <Row className="g-3">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="farmerFamilyName">
                    Initial Weighment in Kg's
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="farmerFamilyName"
                      name="farmerFamilyName"
                      // value={familyMembers.farmerFamilyName}
                      // onChange={handleFMInputs}
                      type="text"
                      placeholder="Enter Initial Weighment in Kg's"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>Market Date</Form.Label>
                  <div className="form-control-wrap">
                    <DatePicker
                      selected={data.dob}
                      onChange={(date) => handleDateChange(date, "dob")}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      maxDate={new Date()}
                      minDate={new Date()}
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex gap g-2 justify-content-center">
                  <div className="gap-col">
                    {/* <Button variant="primary" onClick={handleinitialWeighment}> */}
                    <Button type="submit" variant="primary">
                      Add
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button
                      variant="secondary"
                      onClick={handleCloseModalWeighment}
                    >
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

export default SeedCocoonInward;
