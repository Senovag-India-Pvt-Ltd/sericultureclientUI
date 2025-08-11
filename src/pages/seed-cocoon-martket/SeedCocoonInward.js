import { Card, Form, Row, Col, Button, Modal, Table } from "react-bootstrap";
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
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURL1 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;
const baseURLChawki = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;

function SeedCocoonInward() {
  const { t } = useTranslation();
  const [farmerDetails, setFarmerDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [farmer, setFarmer] = useState({
    text: "",
    select: "mobileNumber",
  });

  // Below for modal window for personal details
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Below for modal window for FC details
  const [showModalFC, setShowModalFC] = useState(false);
  const handleShowModalFC = () => {
    // getDocumentFile()
    pathList.forEach((path) => {
      getDocumentFile(path);
    });
    setShowModalFC(true);
  };
  const handleCloseModalFC = () => {
    setSelectedDocumentFile([]);
    setShowModalFC(false);
  };

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

  // const display = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidatedDisplay(true);
  //   } else {
  //     event.preventDefault();

  //     // Reset data state
  //     setData({
  //       farmerId: "",
  //       sourceMasterId: "",
  //       raceMasterId: "",
  //       dflCount: "",
  //       estimatedWeight: "",
  //       numberOfLot: "",
  //       numberOfSmallBin: "",
  //       numberOfBigBin: "",
  //       dflLotNumber: "",  // Initial values are empty
  //       lotVariety: "",
  //       lotParentalLevel: "",
  //       marketId: localStorage.getItem("marketId"),
  //       godownId: localStorage.getItem("godownId") ? localStorage.getItem("godownId") : 0,
  //     });

  //     setValidatedDisplay(false);
  //     setFarmerDetails({});
  //     setAllotedLotList([]);
  //     setBigBinList([]);
  //     setSmallBinList([]);

  //     const { text, select } = farmer;
  //     let sendData = {
  //       text,
  //       type: select,
  //     };

  //     setLoading(true);
  //     api
  //       .post(
  //         baseURL2 +
  //           `farmer/get-farmer-details-by-fruits-id-or-mobile-number-or-csb-register-number`,
  //         sendData
  //       )
  //       .then((response) => {
  //         if (response.data && response.data.length > 0) {
  //           const farmerResponse = response.data[0]; // Accessing the first farmer's details

  //           // Update state with farmer details
  //           setFarmerDetails(farmerResponse);
  //           setData((prev) => ({
  //             ...prev,
  //             farmerId: farmerResponse.farmerId,
  //             dflLotNumber: farmerResponse.numbersOfDfls,  // Set dflLotNumber from response
  //             lotVariety: farmerResponse.raceOfDfls,       // Set lotVariety from response
  //             lotParentalLevel: farmerResponse.lotNumberRsp // Set lotParentLevel from response
  //           }));
  //
  //           setLoading(false);
  //           setIsActive(true);
  //         } else {
  //           searchError("No details found");
  //         }
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching farmer details:", err);
  //         if (err.response?.data?.validationErrors) {
  //           searchError(err.response.data.validationErrors);
  //         } else {
  //           Swal.fire({
  //             icon: "warning",
  //             title: "Details not Found",
  //           });
  //         }
  //         setFarmerDetails({});
  //         setLoading(false);
  //       });
  //   }
  // };
  const display = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedDisplay(true);
    } else {
      event.preventDefault();

      // Reset data state
      setData({
        farmerId: "",
        sourceMasterId: "",
        raceMasterId: "",
        dflCount: "",
        estimatedWeight: "",
        numberOfLot: "",
        numberOfSmallBin: "",
        numberOfBigBin: "",
        dflLotNumber: "", // Initial values are empty
        lotVariety: "",
        lotParentalLevel: "",
        marketId: localStorage.getItem("marketId"),
        godownId: localStorage.getItem("godownId")
          ? localStorage.getItem("godownId")
          : 0,
      });

      setValidatedDisplay(false);
      setFarmerDetails({});
      setAllotedLotList([]);
      setBigBinList([]);
      setSmallBinList([]);

      const { text, select } = farmer;
      let sendData = {
        text,
        type: select,
      };

      setLoading(true);
      api
        .post(
          baseURL2 +
            `farmer/get-farmer-details-by-fruits-id-or-mobile-number-or-csb-register-number`,
          sendData
        )
        .then((response) => {
          if (response.data && response.data.length > 0) {
            const farmerResponse = response.data[0]; // Accessing the first farmer's details
            // const farmerData = response.data;
            // Update state with farmer details
            setFarmerDetails(farmerResponse);
            setData((prev) => ({
              ...prev,
              farmerId: farmerResponse.farmerId,
              // dflLotNumber: farmerResponse.numbersOfDfls, // Set dflLotNumber from response
              // lotVariety: farmerResponse.raceOfDfls, // Set lotVariety from response
              // lotParentalLevel: farmerResponse.lotNumberRsp, // Set lotParentLevel from response
            }));

            // setFitnessCertificate(farmerResponse); // Save the fitness certificate path if available

            // if (farmerData) {
            //   // Automatically call the getDocumentFile function when the farmerId is received
            //   getDocumentFile(farmerResponse.fitnessCertificatePath);
            // }
            // farmerData.forEach(farmerPhoto=>{
            //   if(farmerPhoto.fitnessCertificatePath){
            //     getDocumentFile(farmerPhoto.fitnessCertificatePath);
            //   }
            // })
            getIdList(farmerResponse.farmerId);

            setLoading(false);
            setIsActive(true);
          } else {
            searchError("No details found");
          }
        })
        .catch((err) => {
          console.error("Error fetching farmer details:", err);
          if (err.response?.data?.validationErrors) {
            searchError(err.response.data.validationErrors);
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
  const [fitnessLotOptions, setFitnessLotOptions] = useState([]);
const [selectedParentalLotNumber, setSelectedParentalLotNumber] = useState("");


  const [prepareEggs, setPrepareEggs] = useState([]);
  const [pathList, setPathList] = useState([]);
  const getIdList = (farmerId) => {
  setLoading(true);
  api
    .get(`${baseURLChawki}cropInspection/getFitnessCertificatePath/${farmerId}`)
    .then((response) => {
      const dataResponse = response.data || [];

      setPrepareEggs(dataResponse);
      setFitnessLotOptions(dataResponse);
      setPathList([]);
      setSelectedDocumentFile([]);

      if (dataResponse.length > 0) {
        dataResponse.forEach((data) => {
          if (data.fitnessCertificatePath) {
            setPathList((prev) => [...prev, data.fitnessCertificatePath]);
            getDocumentFile(data.fitnessCertificatePath);
          }
        });

        if (dataResponse.length === 1) {
          const singleLot = dataResponse[0];

          // Automatically assign values from the only available entry
          setSelectedParentalLotNumber(singleLot.lotNumberRsp);
          setData((prev) => ({
            ...prev,
            lotParentalLevel: singleLot.lotNumberRsp,
            dflLotNumber: singleLot.numbersOfDfls,
            lotVariety: singleLot.raceOfDfls,
          }));
        } else {
          // Multiple entries - wait for user to input
          setSelectedParentalLotNumber("");
          setData((prev) => ({
            ...prev,
            lotParentalLevel: "",
            dflLotNumber: "",
            lotVariety: "",
          }));
        }
      } else {
        setPrepareEggs([]);
        setFitnessLotOptions([]);
        setPathList([]);
        setSelectedDocumentFile([]);
      }

      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setPrepareEggs([]);
      setFitnessLotOptions([]);
      setLoading(false);
    });
};


  // const getIdList = (farmerId) => {
  //   setLoading(true);
  //   api
  //     .get(
  //       `${baseURLChawki}cropInspection/getFitnessCertificatePath/${farmerId}`
  //     )
  //     // .then((response) => {
  //     //   if (response.data.length > 0) {
  //     //     const dataResponse = response.data;
  //     //     setPrepareEggs(response.data); // Set to the entire array
  //     //     dataResponse.forEach((data) => {
  //     //       if (data.fitnessCertificatePath) {
  //     //         setPathList((prev) => [...prev, data.fitnessCertificatePath]);
  //     //       }
  //     //     });
  //     //   } else {
  //     //     setPrepareEggs([]); // Handle empty response
  //     //   }
  //     //   // setLoading(false);
  //     //   // handleShowModal1();
  //     // })
  //     .then((response) => {
  //       if (response.data.length > 0) {
  //         const dataResponse = response.data|| [];
  //         setPrepareEggs(dataResponse);
  //         setFitnessLotOptions(dataResponse);
  //         setPathList([]); // clear previous paths
  //         setSelectedDocumentFile([]); // clear previous file previews
  //         dataResponse.forEach((data) => {
  //           if (data.fitnessCertificatePath) {
  //             setPathList((prev) => [...prev, data.fitnessCertificatePath]);
  //             getDocumentFile(data.fitnessCertificatePath); // <-- fetch image preview
  //           }
  //         });
  //       } else {
  //         setPrepareEggs([]);
  //         setFitnessLotOptions([]);
  //         setPathList([]);
  //         setSelectedDocumentFile([]);
  //       }
  //     })

  //     .catch((err) => {
  //       console.error(err);
  //       setPrepareEggs([]);
  //       setFitnessLotOptions([]);
  //       setLoading(false);
  //     });
  // };

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
    numberOfLot: 1,
    numberOfSmallBin: 0,
    numberOfBigBin: 1,
    dflLotNumber: "",
    lotVariety: "",
    lotParentalLevel: "",
    dob: new Date(),
  });
  console.log(data);

  const { id } = useParams();
  // const [data] = useState(EducationDatas);
  // const [farmerDetails, setFarmerDetails] = useState({});
  // const [loading, setLoading] = useState(false);

  // let name, value;
  // const handleInputs = (e) => {
  //   // debugger;
  //   name = e.target.name;
  //   value = e.target.value;
  //   // setData({ ...data, [name]: value });
  //   setData((prevData) => {
  //     let updatedData = { ...prevData, [name]: value };
  //     if (name === "estimatedWeight") {
  //       const weight = parseInt(value);
  //       // console.log("hello", marketData.lotWeight);
  //       // debugger;
  //       if (isNaN(weight) || weight <= 0) {
  //         updatedData = {
  //           ...updatedData,
  //           numberOfLot: "",
  //           numberOfBigBin: 1,
  //           numberOfSmallBin: 1,
  //         };
  //       } else if (weight >= marketData.lotWeight) {
  //         updatedData = {
  //           ...updatedData,
  //           numberOfLot: Math.floor(weight / marketData.lotWeight) * 1,
  //         };
  //       } else if (weight < marketData.lotWeight) {
  //         updatedData = { ...updatedData, numberOfLot: 1 };
  //       }
  //     }
  //     return updatedData;
  //   });
  // };

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      if (name === "estimatedWeight") {
        const weight = parseInt(value);

        if (isNaN(weight) || weight <= 0) {
          updatedData = {
            ...updatedData,
            numberOfLot: 1,
            numberOfBigBin: 1,
            numberOfSmallBin: 1,
          };
        } else if (weight >= marketData.lotWeight) {
          updatedData = {
            ...updatedData,
            numberOfLot: 1, // Keep it as 1 instead of calculating based on weight
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

  // const postData = async (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);
  //   } else {
  //     event.preventDefault();
  //     // generateBiddingSlip(1);
  //     try {
  //       const addGodown = localStorage.getItem("godownId")
  //         ? localStorage.getItem("godownId")
  //         : 0;
  //       const response = await api.post(baseURL + `cocoon/reserveLot`, {
  //         ...data,
  //         godownId: addGodown,
  //       });
  //       if (response.data.errorCode === 0) {
  //         setSourceData(response.data.content);
  //         // increment(response.data.content.farmerId);
  //         if (response.data.content.allotedLotList) {
  //           setAllotedLotList(response.data.content.allotedLotList);
  //         } else {
  //           setAllotedLotList([]);
  //         }

  //         if (response.data.content.allotedBigBinList) {
  //           setBigBinList(response.data.content.allotedBigBinList);
  //         } else {
  //           setBigBinList([]);
  //         }

  //         if (response.data.content.allotedSmallBinList) {
  //           setSmallBinList(response.data.content.allotedSmallBinList);
  //         } else {
  //           setSmallBinList([]);
  //         }

  //         if (
  //           response.data.content.allotedLotList.length ||
  //           response.data.content.allotedLotList
  //         ) {
  //           const list = response.data.content.allotedLotList;
  //           const openWindows = [];
  //           for (const item of list) {
  //             const promise = generateBiddingSlip(item);
  //             openWindows.push(promise);
  //           }
  //           await Promise.all(openWindows);
  //         }

  //         if (response.data.content) {
  //           let allotedBigBinList;
  //           let allotedSmallBinList;
  //           if (response.data.content.allotedBigBinList) {
  //             allotedBigBinList = response.data.content.allotedBigBinList;
  //           } else {
  //             allotedBigBinList = [];
  //           }

  //           if (response.data.content.allotedSmallBinList) {
  //             allotedSmallBinList = response.data.content.allotedSmallBinList;
  //           } else {
  //             allotedSmallBinList = [];
  //           }

  //           saveSuccess(allotedBigBinList, allotedSmallBinList);
  //         } else {
  //           saveError(response.data.errorMessages[0].message);
  //         }
  //       } else if (response.data.errorCode === -1) {
  //         saveError(response.data.errorMessages[0].message);
  //       }
  //     } catch (err) {
  //       // setData({});
  //       // saveError();
  //     }
  //     setValidated(true);
  //   }
  // };
  const postData = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      try {
        const addGodown = localStorage.getItem("godownId")
          ? localStorage.getItem("godownId")
          : 0;
        const response = await api.post(baseURL + `cocoon/reserveLot`, {
          ...data,
          godownId: addGodown,
        });

        if (response.data.errorCode === 0) {
          setSourceData(response.data.content);

          const allotedLotList = response.data.content.allotedLotList || [];
          const allotedBigBinList =
            response.data.content.allotedBigBinList || [];
          const allotedSmallBinList =
            response.data.content.allotedSmallBinList || [];

          // Call the generateBiddingSlip for each item in the allotedLotList
          if (allotedLotList.length > 0) {
            const openWindows = [];
            for (const item of allotedLotList) {
              const promise = generateBiddingSlip(item); // Assuming generateBiddingSlip takes an item as an argument
              openWindows.push(promise);
            }
            await Promise.all(openWindows); // Wait for all bidding slips to be generated
          }

          // Pass the alloted lot list, big bin list, and small bin list to saveSuccess
          saveSuccess(allotedLotList, allotedBigBinList, allotedSmallBinList);
        } else if (response.data.errorCode === -1) {
          saveError(response.data.errorMessages[0].message);
        }
      } catch (err) {
        // Handle error
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

  // const generateBiddingSlip = async (allotedLotId) => {
  //   const newDate = new Date();
  //   const formattedDate =
  //     newDate.getFullYear() +
  //     "-" +
  //     (newDate.getMonth() + 1).toString().padStart(2, "0") +
  //     "-" +
  //     newDate.getDate().toString().padStart(2, "0");

  //   try {
  //     const response = await axios.post(
  //       // baseURLReport + `getfarmercopy-kannada`,
  //       `https://e-reshme.karnataka.gov.in/reports/marketreport/getfarmercopy-kannada`,

  //       {
  //         marketId: 1,
  //         godownId: 0,
  //         allottedLotId: allotedLotId,
  //         auctionDate: "2024-10-01",
  //       },
  //       {
  //         responseType: "blob", //Force to receive data in a Blob Format
  //         headers: {
  //           Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJnb2Rvd25JZCI6MSwicGhvbmVOdW1iZXIiOiI2MzY2MTI1ODY5Iiwicm9sZUlkIjoxLCJ1c2VyVHlwZSI6MCwidXNlck1hc3RlcklkIjo1OTMsInVzZXJuYW1lIjoibWFya2V0IiwibWFya2V0SWQiOjEsInN1YiI6Im1hcmtldCIsImlhdCI6MTcyNzg4MjM5OCwiZXhwIjoxNzI5NjgyMzk4fQ.sdw6GLGYq0SwrCvtLNvoWyBnwBrmAy0CNW8rkZ8Pu40"
  //         }
  //       }
  //     );

  //     const file = new Blob([response.data], { type: "application/pdf" });
  //     const fileURL = URL.createObjectURL(file);
  //     window.open(fileURL);

  //     // const file = new Blob([response.data], { type: "application/pdf" });
  //     // const fileURL = URL.createObjectURL(file);
  //     // const printWindow = window.open(fileURL);
  //     // if (printWindow) {
  //     //   printWindow.onload = () => {
  //     //     printWindow.print();
  //     //   };
  //     // } else {
  //     //   console.error("Failed to open the print window.");
  //     // }
  //   } catch (error) {
  //     // console.log("error", error);
  //   }
  // };

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
        baseURLReport + `getfarmercopy-kannada-seed`,
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

  // const styles = {
  //   ctstyle: {
  //     backgroundColor: "rgb(248, 248, 249, 1)",
  //     color: "rgb(0, 0, 0)",
  //     width: "50%",
  //   },
  //   top: {
  //     backgroundColor: "rgb(15, 108, 190, 1)",
  //     color: "rgb(255, 255, 255)",
  //     width: "50%",
  //     fontWeight: "bold",
  //     fontSize: "25px",
  //     textAlign: "center",
  //   },
  //   bottom: {
  //     fontWeight: "bold",
  //     fontSize: "25px",
  //     textAlign: "center",
  //   },
  //   sweetsize: {
  //     width: "100px",
  //     height: "100px",
  //   },
  // };

  const styles = {
    ctstyle: {
      fontWeight: "bold",
      color: "#2e314a",
      backgroundColor: "#f8f9fa",
      padding: "10px 15px", // Keep some padding for cells
      fontSize: "1rem", // Font size for better readability
    },
    table: {
      borderRadius: "5px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      width: "100%", // Full width for the table
      tableLayout: "fixed", // Use fixed layout for better control over column widths
    },
    modalHeader: {
      backgroundColor: "#0f6cbe",
      color: "#fff",
      textAlign: "center",
      padding: "10px", // Reduced padding for a smaller header
      fontSize: "1.2rem", // Reduced font size for the header
    },
    modalTitle: {
      fontWeight: "600",
      fontSize: "1.2rem", // Reduced title font size
    },
    modalBody: {
      padding: "20px", // Padding around the body
      height: "100%", // Expand the body to full height
      overflowY: "auto", // Allow scrolling if content overflows
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
  // const saveSuccess = (bigList, smallList) => {
  //   let small;
  //   let big;
  //   if (bigList.length) {
  //     big = ` Big ${bigList.join(",")}`;
  //   } else {
  //     big = "";
  //   }

  //   if (smallList.length) {
  //     small = ` Small ${smallList.join(",")}`;
  //   } else {
  //     small = "";
  //   }
  //   Swal.fire({
  //     icon: "success",
  //     title: "Bidding Slip has been generated",
  //     text: `Alloted Bin number ${big} ${small}`,
  //     width: 300,
  //     // customClass: styles.sweetsize,
  //   });
  // };
  const saveSuccess = (lotList, bigList, smallList) => {
    let small;
    let big;
    let lot;

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

    if (lotList.length) {
      lot = ` Allotted Lot Number: ${lotList.join(",")}`;
    } else {
      lot = "";
    }

    Swal.fire({
      icon: "success",
      title: "Bidding Slip has been generated",
      text: `${lot} ${big} ${small}`,
      width: 300,
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

  const [fitnessCertificate, setFitnessCertificate] = useState({});

  // To get Photo
  const [selectedDocumentFile, setSelectedDocumentFile] = useState([]);

  const getDocumentFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURLChawki + `v1/api/s3/download?${parameters}`,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      setSelectedDocumentFile((prev) => [...prev, url]);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  const downloadFile = async (file) => {
    console.log("file", file);
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURLChawki + `v1/api/s3/download?${parameters}`,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);

      const fileExtension = file.split(".").pop();

      const link = document.createElement("a");
      link.href = url;

      const modifiedFileName = file.replace(/_([^_]*)$/, ".$1");

      link.download = modifiedFileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  return (
    <Layout title={t("Seed Cocoon E-Inward")} show="true">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Seed Cocoon E-Inward")}</Block.Title>
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
                      {t("Search Farmer Details By")}
                    </Form.Label>
                    <Col sm={1} lg={2}>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="select"
                          value={farmer.select}
                          onChange={handleFarmerIdInputs}
                        >
                          {/* <option value="">Select</option> */}
                          <option value="mobileNumber">{t("Mobile Number")}</option>
                          <option value="fruitsId">{t("Fruits Id")}</option>
                          <option value="farmerNumber">{t("CSB Number")}</option>
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
                        placeholder={t("Search")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Field Value is Required")}
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={2} lg={3}>
                      <Button type="submit" variant="primary">
                        {t("Search")}
                      </Button>
                    </Col>
                    {/* <Col sm={2} style={{ marginLeft: "-280px" }}> */}
                    <Col sm={1} lg={2} style={{ marginLeft: "-15%" }}>
                      <Link
                        to="/seriui/issue-new-trader-license"
                        className="btn btn-primary border-0"
                      >
                        {t("Add New")}
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
                                <span>{t("Personal Details")}</span>
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
                                <span>{t("FC Details")}</span>
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
                                <span>{t("Crop Details")}</span>
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
                                <span>{t("Initial Weighment")}</span>
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
                        <Button type="submit" variant="primary">
                          {t("Submit")}
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
        <Modal.Header closeButton style={styles.modalHeader}>
          <Modal.Title style={styles.modalTitle}>{t("Personal Details")}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          <div className="d-flex justify-content-center">
            <Row className="g-5">
              <Col lg="12">
                <Table
                  striped
                  bordered
                  hover
                  responsive
                  className="table-sm"
                  style={styles.table}
                >
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>{t("Farmer Number")}:</td>
                      <td>{farmerDetails?.farmerNumber || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Farmer Name")}:</td>
                      <td>{farmerDetails?.firstName || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Father's/Husband's Name")}:</td>
                      <td>{farmerDetails?.fatherName || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Phone Number")}:</td>
                      <td>{farmerDetails?.mobileNumber || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("TSC")}:</td>
                      <td>{farmerDetails?.tscName || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("State")}:</td>
                      <td>{farmerDetails?.stateName || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("District")}:</td>
                      <td>{farmerDetails?.districtName || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Taluk")}:</td>
                      <td>{farmerDetails?.talukName || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Village")}:</td>
                      <td>{farmerDetails?.villageName || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>

      {/* <Modal show={showModalFC} onHide={handleCloseModalFC} size="lg">
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
            <tr>
                      <td style={styles.ctstyle}>Fitness Certificate:</td>
                      <td>

                        {selectedDocumentFile && (
                          <>
                          <img
                            style={{ height: "100px", width: "100px" }}
                            src={selectedDocumentFile}
                            alt="Selected File"
                          />
                          <Button
                                variant="primary"
                                size="sm"
                                className="ms-2"
                                onClick={() =>
                                  downloadFile(fitnessCertificate.fitnessCertificatePath)
                                }
                              >
                                Download File
                              </Button>
                            </>
                        )}
                      </td>
                    </tr>
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
      </Modal> */}
      {/* <Modal show={showModalFC} onHide={handleCloseModalFC} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("FC Details")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column justify-content-center">
            <tr>
              <td style={styles.ctstyle}>{t("Fitness Certificate")}:</td>
              <td>
                {selectedDocumentFile?.length > 0 &&
                  selectedDocumentFile.map((file) => (
                    <>
                      <img
                        style={{ height: "100px", width: "100px" }}
                        src={file}
                        alt="Selected File"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        className="ms-2"
                        onClick={() => downloadFile(pathList[0])}
                      >
                        {t("Download File")}
                      </Button>
                    </>
                  ))}
              </td>
            </tr>
          </div>
        </Modal.Body>
      </Modal> */}
      <Modal show={showModalFC} onHide={handleCloseModalFC} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>{t("FC Details")}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="d-flex flex-column justify-content-center">
      <table>
        <tbody>
          {prepareEggs?.length > 0 &&
            prepareEggs.map((data, index) => (
              <tr key={index}>
                <td style={styles.ctstyle}>{t("Fitness Certificate")}:</td>
                <td>
                  <img
                    style={{ height: "100px", width: "100px" }}
                    src={selectedDocumentFile[index]}
                    alt={`Fitness Certificate ${index + 1}`}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    className="ms-2"
                    onClick={() => downloadFile(data.fitnessCertificatePath)}
                  >
                    {t("Download File")}
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </Modal.Body>
</Modal>


      {/* <Modal show={showModalCrop} onHide={handleCloseModalCrop} size="lg">
        <Modal.Header closeButton style={styles.modalHeader}>
          <Modal.Title style={styles.modalTitle}>{t("Crop Details")}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          <div className="d-flex justify-content-center">
            <Row
              className="g-5 d-flex justify-content-center"
              style={{ width: "100%" }}
            >
              <Col lg="12">
                {" "}
                <table
                  className="table small table-bordered"
                  style={styles.table}
                >
                
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>{t("No of DFL's")}:</td>
                      <td>{farmerDetails?.numbersOfDfls || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Lot No")}:</td>
                      <td>{farmerDetails?.lotNumberRsp || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Rate Per 100 Dfls")}:</td>
                      <td>{farmerDetails?.dflsSource || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Variety")}:</td>
                      <td>{farmerDetails?.raceName || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal> */}

      <Modal show={showModalCrop} onHide={handleCloseModalCrop} size="lg">
  <Modal.Header closeButton style={styles.modalHeader}>
    <Modal.Title style={styles.modalTitle}>{t("Crop Details")}</Modal.Title>
  </Modal.Header>
  <Modal.Body style={styles.modalBody}>
    <div className="d-flex justify-content-center">
      <Row className="g-5 d-flex justify-content-center" style={{ width: "100%" }}>
        <Col lg="12">
          {prepareEggs && prepareEggs.length > 0 ? (
            prepareEggs.map((item, index) => (
              <div key={index} className="mb-4">
                <h6 className="fw-bold">{t("Crop Details")} #{index + 1}</h6>
                <table className="table small table-bordered" style={styles.table}>
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>{t("No of DFL's")}:</td>
                      <td>{item.numbersOfDfls || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Lot No")}:</td>
                      <td>{item.lotNumberRsp || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Rate Per 100 Dfls")}:</td>
                      <td>{item.dflsSource || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Variety")}:</td>
                      <td>{item.raceName || "N/A"}</td>
                    </tr>
                    {/* <tr>
                      <td style={styles.ctstyle}>{t("Fitness Certificate")}:</td>
                      <td>
                        {item.fitnessCertificatePath ? (
                          <a href={item.fitnessCertificatePath} target="_blank" rel="noopener noreferrer">
                            {t("View Certificate")}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <div className="text-center">{t("No crop details available")}</div>
          )}
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
          <Modal.Title>{t("Initial Weighment")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validatedInitialWeighment}
            onSubmit={handleinitialWeighment}
          >
            <Row className="g-3">
            {fitnessLotOptions.length > 1 && (
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="lotParentLevel">
                    {t("Parental Lot Number")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="lotParentalLevel"
                      name="lotParentalLevel"
                      type="text"
                      placeholder={t("Enter Parental Lot Number")}
                      value={selectedParentalLotNumber}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        setSelectedParentalLotNumber(enteredValue);

                        const matchedLot = fitnessLotOptions.find(
                          (item) => item.lotNumberRsp  === enteredValue
                        );

                        if (matchedLot) {
                          setData((prev) => ({
                            ...prev,
                            lotParentalLevel: matchedLot.lotNumberRsp,
                            dflLotNumber: matchedLot.numbersOfDfls,
                            lotVariety: matchedLot.raceOfDfls,
                          }));
                        } else {
                          setData((prev) => ({
                            ...prev,
                            lotParentalLevel: enteredValue,
                            dflLotNumber: "",
                            lotVariety: "",
                          }));
                        }
                      }}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Parental Lot Number is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
            )}

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="farmerFamilyName">
                    {t("Initial Weighment in Kg's")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="estimatedWeight"
                      name="estimatedWeight"
                      value={data.estimatedWeight}
                      onChange={handleInputs}
                      type="text"
                      placeholder={t("Enter Initial Weighment in Kg's")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Initial Weight is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="farmerFamilyName">
                    {t("No Of Lot")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      type="number"
                      name="numberOfLot"
                      min={0}
                      value={data.numberOfLot}
                      onChange={handleInputs}
                      placeholder={t("Enter No Of Lot")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("No Of Lot is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex gap g-2 justify-content-center">
                  <div className="gap-col">
                    {/* <Button variant="primary" onClick={handleinitialWeighment}> */}
                    <Button type="submit" variant="primary">
                      {t("Add")}
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button
                      variant="secondary"
                      onClick={handleCloseModalWeighment}
                    >
                      {t("Cancel")}
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
