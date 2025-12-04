import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import { Icon, Select } from "../../../components";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { createTheme } from "react-data-table-component";

import api from "../../../../src/services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLRegistration = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLFarmerServer =
  process.env.REACT_APP_API_BASE_URL_REGISTRATION_FROM_FRUITS;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function ServiceApplication() {
  // Translation
  const { t } = useTranslation();
  const [data, setData] = useState({
    with: "withLand",
    subinc: "subsidy",
    // equordev: ["land","equipment"],enable this for other scheme later
    equordev: ["land"],
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    scHeadAccountId: "",
    fruitsId: "",
    scCategoryId: "",
    scSubSchemeType: "",
    scVendorId: "",
    farmerId: "",
    expectedAmount: "",
    financialYearMasterId: "",
    scComponentId: "",
    schemeAmount: "",
    sanctionNumber: "",
    approvalStageId: "",
    userId: "",
    spacingId: "",
    hectareId: "",
    periodFrom: new Date("2025-04-01"),
    periodTo: new Date("2026-03-31"),
    cocoonsWeight:"",
    availBonus:"",
    // availBonus: true,
    lotWeight:"",
    lotNo:"",
    transactionDate:new Date(),
    kaneshDistrictId:"",
    kaneshTalukId: "",
    kaneshVillageId: "",
    kaneshNo: "",
    sqft:"",
    panchayatName:"",
    east: "",
    west: "",
    north:"",
    south:"",
    addKaneshLand:"no",
    kaneshHobliId: "",
    month: "",
    machineQuantity: "",
    machineTypeId: "",
    imcbTable: "",
    icbBasinEnds:"",
    reelingUnit:"",
    reelingSqft:"", 
    extentOfMulberry:"",
    rhSqft:"",
    estimatedCost:"",
    roofTypeId:"",
    proposalDate:"",
    raceId:"",
    renditta:"",
    silkTable: "",
    noOfCocoonsNeedToProduce:"",
    noOfRawSilkProduced:"",
    silkExchangeId:"",
    form17JNo: "",
    dailyLimit: "",
    boilerInKg: "",
    sanctionNo: "",
    calculationBasedOn: "",
    marketId: "",
    taxInvoiceNo: "",
    taxInvoiceDate: new Date(),
    rearingEquipmentDetailsId: "",
    beneficiaryShareAmount: "",
  });

  const formatAuctionDate = (auctionDate) => {
    const distributionDate = new Date(auctionDate);
    return (
      distributionDate.getFullYear() +
      "-" +
      (distributionDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      distributionDate.getDate().toString().padStart(2, "0")
    );
  };

//   const getLotDistributeResponseForInvoiceAndBonusScheme = (lotId) => {
//   const formattedAuctionDate = formatAuctionDate(data.transactionDate);

//   api.post(
//     baseURLMarket + `lotGroupage/getLotDistributeResponseForInvoiceAndBonusScheme`,
//     {
//       auctionDate: formattedAuctionDate,
//       marketId: localStorage.getItem("marketId"),
//       fruitsId: data.fruitsId,
//       allottedLotId: lotId,// include if backend requires
//     }
//   )
//   .then((response) => {
//     setFarmerDetails(response.data.content || []); // ✅ always array
//     setShowFarmerDetails(true);
//   })
//   .catch((err) => {
//     console.error("Error fetching farmer details:", err);
//     Swal.fire({
//       icon: "warning",
//       title: "Details Not Found for This Lot and Auction Date",
//     });
//     setFarmerDetails([]);
//     setLoading(false);
//   });
// };


// State to store allottted lots
const [lotOptions, setLotOptions] = useState([]);

// Fetch allotted lots from backend
const fetchLotOptions = () => {
  if (!data.transactionDate || !data.fruitsId) return;

  const formattedAuctionDate = formatAuctionDate(data.transactionDate);

  api
    .post(baseURLMarket + `lotGroupage/getAllottedLotIds`, {
      auctionDate: formattedAuctionDate,
      marketId: localStorage.getItem("marketId"),
      fruitsId: data.fruitsId,
    })
    .then((response) => {
      // Convert response to objects for dropdown
      const options = (response.data.content || []).map((id) => ({
        allottedLotId: id,
      }));
      setLotOptions(options);
    })
    .catch((err) => {
      console.error("Error fetching allotted lots:", err);
      setLotOptions([]);
    });
};

// Fetch lot options when transactionDate or fruitsId changes
useEffect(() => {
  fetchLotOptions();
}, [data.transactionDate, data.fruitsId]);


// State to store allottted lots
const [lotOptionsForCommercialMarket, setLotOptionsForCommercialMarket] = useState([]);

// Fetch allotted lots from backend
const fetchLotOptionsForCommercialMarket = () => {
  if (!data.transactionDate || !data.fruitsId) return;

  const formattedAuctionDate = formatAuctionDate(data.transactionDate);

  api
    .post(baseURLDBT + `cropDetailsCommercialMarket/getBiddingSlipNoForCommercialMarket`, {
      transactionDate: formattedAuctionDate,
      marketId: data.marketId,
      fruitsId: data.fruitsId,
    })
    .then((response) => {
      // Convert response to objects for dropdown
      const options = (response.data.content || []).map((id) => ({
        biddingSlipNo: id,
      }));
      setLotOptionsForCommercialMarket(options);
    })
    .catch((err) => {
      console.error("Error fetching allotted lots:", err);
      setLotOptionsForCommercialMarket([]);
    });
};

// Fetch lot options when transactionDate or fruitsId changes
useEffect(() => {
  fetchLotOptionsForCommercialMarket();
}, [data.transactionDate, data.fruitsId]);


// State to store allottted lots
const [lotOptionsForSeedMarket, setLotOptionsForSeedMarket] = useState([]);

// Fetch allotted lots from backend
const fetchLotOptionsForSeedMarket = () => {
  if (!data.transactionDate || !data.fruitsId) return;

  const formattedAuctionDate = formatAuctionDate(data.transactionDate);

  api
    .post(baseURLDBT + `cropDetailsSeedMarket/getBiddingSlipNoForSeedMarket`, {
      transactionDate: formattedAuctionDate,
      marketId: data.marketId,
      fruitsId: data.fruitsId,
    })
    .then((response) => {
      // Convert response to objects for dropdown
      const options = (response.data.content || []).map((id) => ({
        biddingSlipNo: id,
      }));
      setLotOptionsForSeedMarket(options);
    })
    .catch((err) => {
      console.error("Error fetching allotted lots:", err);
      setLotOptionsForSeedMarket([]);
    });
};

// Fetch lot options when transactionDate or fruitsId changes
useEffect(() => {
  fetchLotOptionsForSeedMarket();
}, [data.transactionDate, data.fruitsId]);



  // console.log("nodu", data);

  const [applicationId, setApplicationId] = useState("");

  // to get scheme-Quota-details
  const [schemeQuotaDetailsListData, setSchemeQuotaDetailsListData] = useState(
    []
  );

  const getSchemeQuotaList = () => {
    api
      .get(baseURLMasterData + `schemeQuota/get-all`)
      .then((response) => {
        setSchemeQuotaDetailsListData(response.data.content.schemeQuota);
      })
      .catch((err) => {
        setSchemeQuotaDetailsListData([]);
      });
  };

  useEffect(() => {
    getSchemeQuotaList();
  }, []);

   // to get Market
    const [marketListData, setMarketListData] = useState([]);
  
    const getMarketList = () => {
      const response = api
        .get(baseURLMasterData + `marketMaster/get-all`)
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

  // to get roofType
    const [roofTypeListData, setRoofTypeListData] = useState([]);
  
    const getRoofTypeList = () => {
      api
        .get(baseURLMasterData + `roofType/get-all`)
        .then((response) => {
          setRoofTypeListData(response.data.content.roofType);
        })
        .catch((err) => {
          setRoofTypeListData([]);
        });
    };
  
    useEffect(() => {
      getRoofTypeList();
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

       // to get Race
       const [silkListData, setSilkListData] = useState([]);
    
       const getSilkList = () => {
         const response = api
           .get(baseURLMasterData + `silkExchange/get-all`)
           .then((response) => {
             setSilkListData(response.data.content.silkExchange);
           })
           .catch((err) => {
             setSilkListData([]);
           });
       };
     
       useEffect(() => {
         getSilkList();
       }, []);
  // to get scheme-Quota-details
  const [spacingListData, setSpacingDetailsListData] = useState([]);

  const getSpacingList = () => {
    api
      .get(baseURLMasterData + `spacingMaster/get-all`)
      .then((response) => {
        setSpacingDetailsListData(response.data.content.spacingMaster);
      })
      .catch((err) => {
        setSpacingDetailsListData([]);
      });
  };

  useEffect(() => {
    getSpacingList();
  }, []);

  // to get scheme-Quota-details
  const [hectareListData, setHectareListData] = useState([]);

  const getHectareList = () => {
    api
      .get(baseURLMasterData + `hectareMaster/get-all`)
      .then((response) => {
        setHectareListData(response.data.content.hectareMaster);
      })
      .catch((err) => {
        setHectareListData([]);
      });
  };

  useEffect(() => {
    getHectareList();
  }, []);

  const [schemeDetails, setSchemeDetails] = useState({});
  const [schemeId, setSchemeId] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [showCommercialMarketTransaction, setShowCommercialMarketTransaction] = useState(false);
  const [showSeedMarketTransaction, setShowSeedMarketTransaction] = useState(false);   

  // Get data from API
  // const getAreaDetailsList = () => {
  //   setLoading(true);
  //   api
  //     .get(`${baseURLMasterData}scSchemeDetails/get/${schemeId}`)
  //     .then((response) => {
  //       setSchemeDetails(response.data.content); // Store response data in state
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //     });
  // };
 // Get data from API
 const getAreaDetailsList = () => {
  setLoading(true);
  api
    .get(`${baseURLMasterData}scSchemeDetails/get/${schemeId}`)
    .then((response) => {
      const details = response.data.content;
      setSchemeDetails(details);
      setLoading(false);
    })
    .catch((err) => {
      setLoading(false);
      console.error("Error fetching area details:", err);
    });
};

useEffect(() => {
  if (schemeId) {
    getAreaDetailsList();
  }
}, [schemeId]);

  const [developedLand, setDevelopedLand] = useState({
    landDeveloped: "",
    unitType: "",
    extentOfMulberry:"",
    rhSqft:"",
    estimatedCost:"",
    roofTypeId:"",
    proposalDate:"",
  });

  const [equipment, setEquipment] = useState({
    unitType: "",
    description: "",
    price: "",
    vendorId: "",
    payToVendor: false,
  });

  const [developedArea, setDevelopedArea] = useState([]);

  const transformedData = Object.keys(developedArea).map((id) => ({
    // landDeveloped: developedLand.landDeveloped,
    // landDetailId: parseInt(id),
    ...developedArea[id],
  }));

  // console.log(transformedData);

  // const

  const handleInlineDevelopedLandChange = (e, i) => {
    const { name, value } = e.target;
    const farmerLandDetailsId = i;

    setDevelopedArea((prevData) => ({
      ...prevData,
      [farmerLandDetailsId]: {
        ...prevData[farmerLandDetailsId],
        [name]: value,
      },
    }));
  };

  console.log("new dev data", developedArea);

  const [landDetailsIds, setLandDetailsIds] = useState([]);

  

  const handleCheckboxChange = (farmerLandDetailsId, selectedData) => {
  setLandDetailsIds((prevIds) => {
    const isAlreadySelected = prevIds.includes(farmerLandDetailsId);

    // ✅ Multi select logic
    const newIds = isAlreadySelected
      ? prevIds.filter((id) => id !== farmerLandDetailsId) // remove if already selected
      : [...prevIds, farmerLandDetailsId]; // add new one

    // ✅ update developedArea state
    setDevelopedArea((prevData) => {
      if (isAlreadySelected) {
        // remove from developedArea
        const { [farmerLandDetailsId]: _, ...rest } = prevData;
        return rest;
      } else {
        // add new with defaults
        return {
          ...prevData,
          [farmerLandDetailsId]: {
            ...selectedData,
            devAcre: prevData[farmerLandDetailsId]?.devAcre || "0",
            devGunta: prevData[farmerLandDetailsId]?.devGunta || "0",
            devFGunta: prevData[farmerLandDetailsId]?.devFGunta || "0",
          },
        };
      }
    });

    return newIds;
  });
};

  console.log(landDetailsIds);


  const [showModal, setShowModal] = useState(false);
  const [pendingPostData, setPendingPostData] = useState(null);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);


  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  // const handleShowModal = (post) => {
  //   setPendingPostData(post); // Store post data in state
  //   setShowModal(true);
  // };
  // const handleCloseModal = () => {
  //   setShowModal(false);
  //   if (pendingPostData) {
  //     // Save application if there is pending post data
  //     saveApplication(pendingPostData);
  //     setPendingPostData(null); // Clear pending data after saving
  //   }
  // };

  const [showModalBreakUp, setShowModalBreakUp] = useState(false);

  const handleShowModalBreakUp = () => setShowModalBreakUp(true);
  const handleCloseModalBreakUp = () => setShowModalBreakUp(false);

  const handleCheckBox = (e) => {
    setEquipment((prev) => ({
      ...prev,
      payToVendor: e.target.checked,
    }));
  };

  const [isDisabled, setIsDisabled] = useState(true);

  const [landDetailsList, setLandDetailsList] = useState([]);

  console.log("Just Checking", landDetailsList);

  // to get sc-scheme-details
  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);
  const getList = () => {
    api
      .get(baseURLMasterData + `scSchemeDetails/get-all`)
      .then((response) => {
        setScSchemeDetailsListData(response.data.content.ScSchemeDetails);
      })
      .catch((err) => {
        setScSchemeDetailsListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get sc-sub-scheme-details by sc-scheme-details
  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState(
    []
  );
  const getSubSchemeList = (_id) => {
    api
      .get(baseURLDBT + `master/cost/get-by-scheme-id/${_id}`)
      .then((response) => {
        if (response.data.content.unitCost) {
          setScSubSchemeDetailsListData(response.data.content.unitCost);
        }
      })
      .catch((err) => {
        setScSubSchemeDetailsListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.scSchemeDetailsId) {
      getSubSchemeList(data.scSchemeDetailsId);
    }
  }, [data.scSchemeDetailsId]);

   // to get Machine Type
    const [machineTypeListData, setMachineTypeListData] = useState([]);
  
    const getMachineTypeList = () => {
      api
        .get(baseURLMasterData + `machine-type-master/get-all`)
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

 // State to store incentive and bonus data
const [getIncentiveAndBonusData, setIncentiveAndBonusData] = useState([]);
const [isSanctionForReeling, setIsSanctionForReeling] = useState(false);

// // Function to fetch incentive/bonus data
// const getIncentiveAndBonusList = (scSchemeDetailsId, scSubSchemeDetailsId) => {
//   if (!scSchemeDetailsId || !scSubSchemeDetailsId) return; // avoid unnecessary calls

//   api
//     .get(
//       baseURLMasterData + 
//       `scSubSchemeDetails/get-by-scheme-and-sub-scheme-details-id/${scSchemeDetailsId}/${scSubSchemeDetailsId}`
//     )
//     .then((response) => {
//       const content = response.data.content;

//      if (content && content.scSubSchemeDetails.length > 0) {
//         const subSchemeList = content.scSubSchemeDetails;
//         setIncentiveAndBonusData(subSchemeList);

//         const sanctionForReeling =
//           subSchemeList[0]?.sanctionForReeling || false;
//         setIsSanctionForReeling(sanctionForReeling);

//         // ✅ Check unitForScheme === "Bivoltine Bonus" here
//         const unitForScheme = subSchemeList[0]?.unitForScheme;
//         if (unitForScheme === "Bivoltine Bonus") {
//           setShowButton(true);
//           setData((prev) => ({
//             ...prev,
//             availBonus: true,
//           }));
//         } else {
//           setShowButton(false);
//           setData((prev) => ({
//             ...prev,
//             availBonus: false,
//           }));
//         }

//         if (
//         unitForScheme === "North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP" ||
//         unitForScheme === "Incentive For Bivoltine Cocoons-30/kg-PSF"
//       ) {
//         setShowCommercialMarketTransaction(true);
//         setData((prev) => ({
//             ...prev,
//             availBonus: true,
//           }));
//       } else {
//         setShowCommercialMarketTransaction(false);
//         setData((prev) => ({
//             ...prev,
//             availBonus: false,
//           }));
//         }

//         // ✅ Extract schemeType and trigger next API
//         const schemeType = subSchemeList[0]?.subSchemeType;
//         if (data.lotNo && schemeType) {
//           getLotDistributeResponseForInvoiceAndBonusScheme(
//             data.lotNo,
//             schemeType
//           );
//         }
//       } else {
//         setIncentiveAndBonusData([]);
//         setIsSanctionForReeling(false);
//         setShowButton(false);
//         setData((prev) => ({
//           ...prev,
//           availBonus: false,
//         }));
//       }
//     })
//     .catch((err) => {
//       setIncentiveAndBonusData([]);
//       setIsSanctionForReeling(false);
//       setShowButton(false);
//       setData((prev) => ({
//         ...prev,
//         availBonus: false,
//       }));
//       console.error("Error fetching incentive/bonus data:", err);
//     });
// };

const [selectedBonusMode, setSelectedBonusMode] = useState(""); 


// Function to fetch incentive/bonus data
const getIncentiveAndBonusList = (scSchemeDetailsId, scSubSchemeDetailsId) => {
  if (!scSchemeDetailsId || !scSubSchemeDetailsId) return; // avoid unnecessary calls

  api
    .get(
      baseURLMasterData +
        `scSubSchemeDetails/get-by-scheme-and-sub-scheme-details-id/${scSchemeDetailsId}/${scSubSchemeDetailsId}`
    )
    .then((response) => {
      const content = response.data.content;

      if (content && content.scSubSchemeDetails.length > 0) {
        const subSchemeList = content.scSubSchemeDetails;
        setIncentiveAndBonusData(subSchemeList);

        const sanctionForReeling =
          subSchemeList[0]?.sanctionForReeling || false;
        setIsSanctionForReeling(sanctionForReeling);

        // Extract unitForScheme
        const unitForScheme = subSchemeList[0]?.unitForScheme;

        // Show button for Bivoltine Bonus
        if (unitForScheme === "Bivoltine Bonus") {
          setShowButton(false);
          setSelectedBonusMode(""); 
          setData((prev) => ({
            ...prev,
            availBonus: true,
          }));
        } 
        // else {
        //   setShowButton(false);
        //   setData((prev) => ({
        //     ...prev,
        //     availBonus: false,
        //   }));
        // }

        // Show Commercial Market Transaction section
        if (
          unitForScheme ===
            "North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP" ||
          unitForScheme ===
            "Incentive For Bivoltine Cocoons-30/kg-PSF" ||
          unitForScheme ===
            "Incentive For Bivoltine Chawki Rearing Cost"
        ) {
          setShowCommercialMarketTransaction(true);
          setData((prev) => ({
            ...prev,
            availBonus: true,
          }));
        } else {
          setShowCommercialMarketTransaction(false);
          // setData((prev) => ({
          //   ...prev,
          //   availBonus: false,
          // }));
        }

        // if (
        //   unitForScheme ===
        //     "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500" && 
        //   selectedBonusMode === "Manual"
        // ) {
        //   setShowSeedMarketTransaction(true);
        //   setData((prev) => ({
        //     ...prev,
        //     availBonus: true,
        //   }));
        // } else {
        //   setShowSeedMarketTransaction(false);
        //   // setData((prev) => ({
        //   //   ...prev,
        //   //   availBonus: false,
        //   // }));
        // }
        // Default availBonus TRUE for MSC Chawki incentive
            if (unitForScheme === "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500") {
              setData((prev) => ({
                ...prev,
                availBonus: true,   // <-- Make true by default
              }));
            }

            // Show Seed Market section only if Manual mode
            if (
              unitForScheme === "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500" &&
              selectedBonusMode === "Manual"
            ) {
              setShowSeedMarketTransaction(true);
            } else {
              setShowSeedMarketTransaction(false);
            }


        // Extract schemeType
        const schemeType = subSchemeList[0]?.subSchemeType;

        setData((prev) => ({
          ...prev,
          schemeType: schemeType,
        }));

        // Trigger correct API based on unitForScheme
        if (data.lotNo && schemeType) {
          // For Bivoltine Bonus
          // if (unitForScheme === "Bivoltine Bonus") {
          //   getLotDistributeResponseForInvoiceAndBonusScheme(
          //     data.lotNo,
          //     schemeType
          //   );
          // }
          if (
              unitForScheme === "Bivoltine Bonus" &&
              selectedBonusMode === "Automatic"
            ) {
              getLotDistributeResponseForInvoiceAndBonusScheme(
                data.lotNo,
                schemeType
              );
            }

          // For Commercial Market Incentive Schemes
          if (
            unitForScheme ===
              "North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP" ||
            unitForScheme ===
              "Incentive For Bivoltine Cocoons-30/kg-PSF" ||
            unitForScheme ===
              "Incentive For Bivoltine Chawki Rearing Cost"
          ) {
            getCropDetailsCommercialMarketByLotNo(
              data.lotNo,
              schemeType
            );
          }

          if (
            unitForScheme ===
              "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500" && 
        selectedBonusMode === "Manual"
          ) {
            getCropDetailsSeedMarketByLotNo(
              data.lotNo,
              schemeType
            );
          }

        }
      } else {
        setIncentiveAndBonusData([]);
        setIsSanctionForReeling(false);
        setShowButton(false);
        setData((prev) => ({
          ...prev,
          availBonus: false,
        }));
      }
    })
    .catch((err) => {
      setIncentiveAndBonusData([]);
      setIsSanctionForReeling(false);
      setShowButton(false);
      setData((prev) => ({
        ...prev,
        availBonus: false,
      }));
      console.error("Error fetching incentive/bonus data:", err);
    });
};



const [farmerDetailsForIB, setFarmerDetailsForIB] = useState({});

// Modified getLotDistributeResponseForInvoiceAndBonusScheme to include schemeType logic
const getLotDistributeResponseForInvoiceAndBonusScheme = (lotId, schemeType) => {
  const formattedAuctionDate = formatAuctionDate(data.transactionDate);

  api.post(
    baseURLMarket + `lotGroupage/getLotDistributeResponseForInvoiceAndBonusScheme`,
    {
      auctionDate: formattedAuctionDate,
      marketId: localStorage.getItem("marketId"),
      fruitsId: data.fruitsId,
      allottedLotId: lotId,
    }
  )
  .then((response) => {
    const respData = response.data.content || [];
    setFarmerDetailsForIB(respData);
    setShowFarmerDetails(true);

    const lotData = respData[0] || {};

    // Update fields based on schemeType
   if (schemeType == "2") {
      // Incentive
      setData((prev) => ({
        ...prev,
        cocoonsWeight: lotData.totalLotWeight || 0,
        lotWeight: lotData.lotWeightAfterWeighment || 0,
        averageYield: lotData.averageYield || 0,
        noOfCocoonPerKg: lotData.noOfCocoonPerKg || 0,
      }));
    } else if (schemeType == "3") {
      // Bonus
      setData((prev) => ({
        ...prev,
        cocoonsWeight: lotData.sumLotWeightReeling || 0,
        lotWeight: lotData.lotWeightAfterWeighment || 0,
        averageYield: lotData.averageYield || 0,
        noOfCocoonPerKg: lotData.noOfCocoonPerKg || 0,
      }));
    }
  })
  .catch((err) => {
    console.error("Error fetching lot distribution:", err);
    Swal.fire({
      icon: "warning",
      title: "Details Not Found for This Lot and Auction Date",
    });
    setFarmerDetailsForIB([]);
    setData((prev) => ({
      ...prev,
      cocoonsWeight: 0,
      lotWeight: 0,
      averageYield: 0,
      noOfCocoonPerKg: 0,
    }));
    setLoading(false);
  });
};


const getCropDetailsCommercialMarketByLotNo = (biddingSlipNo, schemeType) => {
  const formattedAuctionDate = formatAuctionDate(data.transactionDate);

  api.post(
    baseURLDBT + `cropDetailsCommercialMarket/getCropDetailsCommercialMarketByLotNo`,
    {
      transactionDate: formattedAuctionDate,
      marketId: data.marketId,
      fruitsId: data.fruitsId,
      biddingSlipNo: biddingSlipNo,
    }
  )
  .then((response) => {
    const respData = response.data.content || [];
    // setFarmerDetailsForIB(respData);
    // setShowFarmerDetails(true);

    const lotData = respData[0] || {};

    // Update fields based on schemeType
      setData((prev) => ({
        ...prev,
        cocoonsWeight:lotData.quantityOfCocoonsProduced || 0,
        // lotWeight: lotData.lotWeightAfterWeighment || 0,
        averageYield: lotData.averageYield || 0,
        lotWeight: lotData.noOfDfls || 0,
      }));
    })
    .catch((err) => {
      console.error("Error fetching lot distribution:", err);

      Swal.fire({
        icon: "warning",
        title: "Details Not Found for This Lot and Auction Date",
      });

      // setFarmerDetailsForIB([]);

      // Reset fields
      setData((prev) => ({
        ...prev,
        cocoonsWeight: 0,
        // lotWeight: 0,
        averageYield: 0,
        noOfCocoonPerKg: 0,
      }));

      setLoading(false);
    });
};


const getCropDetailsSeedMarketByLotNo = (biddingSlipNo, schemeType) => {
  const formattedAuctionDate = formatAuctionDate(data.transactionDate);

  api.post(
    baseURLDBT + `cropDetailsSeedMarket/getCropDetailsSeedMarketByLotNo`,
    {
      transactionDate: formattedAuctionDate,
      marketId: data.marketId,
      fruitsId: data.fruitsId,
      biddingSlipNo: biddingSlipNo,
    }
  )
  .then((response) => {
    const respData = response.data.content || [];
    // setFarmerDetailsForIB(respData);
    // setShowFarmerDetails(true);

    const lotData = respData[0] || {};

    // Update fields based on schemeType
      setData((prev) => ({
        ...prev,
        cocoonsWeight:lotData.quantityOfSeedCocoons || 0,
        // lotWeight: lotData.lotWeightAfterWeighment || 0,
        averageYield: lotData.averageYield || 0,
        lotWeight: lotData.noOfDfls || 0,
        noOfCocoonPerKg: lotData.noOfCocoonsPerKg || 0,
        noOfRawSilkProduced: lotData.cocoonTransactedForReelingInKg || 0,
        noOfCocoonsNeedToProduce: lotData.quantityOfSeedCocoons || 0,
      }));
    })
    .catch((err) => {
      console.error("Error fetching lot distribution:", err);

      Swal.fire({
        icon: "warning",
        title: "Details Not Found for This Lot and Auction Date",
      });

      // setFarmerDetailsForIB([]);

      // Reset fields
      setData((prev) => ({
        ...prev,
        cocoonsWeight: 0,
        // lotWeight: 0,
        averageYield: 0,
        noOfCocoonPerKg: 0,
      }));

      setLoading(false);
    });
};

// Call when scheme or sub-scheme changes
useEffect(() => {
  if (data.scSchemeDetailsId && data.scSubSchemeDetailsId) {
    getIncentiveAndBonusList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
  }
}, [data.scSchemeDetailsId, data.scSubSchemeDetailsId]);

// Trigger lot fetch when lotNo changes, after all required data is available
// useEffect(() => {
//   if (data.lotNo && data.transactionDate && data.fruitsId && getIncentiveAndBonusData.length > 0) {
//     const schemeType = getIncentiveAndBonusData[0]?.subSchemeType;
//     if (schemeType) {
//       getLotDistributeResponseForInvoiceAndBonusScheme(data.lotNo, schemeType);
//     }
//   }
// }, [data.lotNo, data.transactionDate, data.fruitsId, getIncentiveAndBonusData]);


// useEffect(() => {
//   if (data.lotNo && data.transactionDate && data.fruitsId && getIncentiveAndBonusData.length > 0) {
//     const schemeType = getIncentiveAndBonusData[0]?.subSchemeType;
//     if (schemeType) {
//       getCropDetailsCommercialMarketByLotNo(data.lotNo, schemeType);
//     }
//   }
// }, [data.lotNo, data.transactionDate, data.fruitsId, getIncentiveAndBonusData]);

useEffect(() => {
  if (
    data.lotNo &&
    data.transactionDate &&
    data.fruitsId &&
    getIncentiveAndBonusData.length > 0
  ) {
    const schemeType = getIncentiveAndBonusData[0]?.subSchemeType;
    const unitForScheme = getIncentiveAndBonusData[0]?.unitForScheme;

    if (!schemeType || !unitForScheme) return;

    // 👉 Call For Bivoltine Bonus
    // if (unitForScheme === "Bivoltine Bonus") {
    //   getLotDistributeResponseForInvoiceAndBonusScheme(
    //     data.lotNo,
    //     schemeType
    //   );
    // }
if (
  unitForScheme === "Bivoltine Bonus" &&
  selectedBonusMode === "Automatic"
) {
  getLotDistributeResponseForInvoiceAndBonusScheme(
    data.lotNo,
    schemeType
  );
}

    // 👉 Call For Commercial Market Incentives
    if (
      unitForScheme ===
        "North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP" ||
      unitForScheme ===
        "Incentive For Bivoltine Cocoons-30/kg-PSF" || 
        unitForScheme ===
        "Incentive For Bivoltine Chawki Rearing Cost"
    ) {
      getCropDetailsCommercialMarketByLotNo(
        data.lotNo,
        schemeType
      );
    }

    if (
      unitForScheme ===
        "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500" && 
        selectedBonusMode === "Manual"
    ) {
      getCropDetailsSeedMarketByLotNo(
        data.lotNo,
        schemeType
      );
    }

  }
}, [
  data.lotNo,
  data.transactionDate,
  data.fruitsId,
  getIncentiveAndBonusData
]);


  // const getSubSchemeList = () => {
  //    api
  //     .get(baseURLMasterData + `scSubSchemeDetails/get-all`)
  //     .then((response) => {
  //       if (response.data.content.scSubSchemeDetails) {
  //         setScSubSchemeDetailsListData(
  //           response.data.content.scSubSchemeDetails
  //         );
  //       }
  //     })
  //     .catch((err) => {
  //       setScSubSchemeDetailsListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //     });
  // };

  // useEffect(() => {
  //   getSubSchemeList();
  // }, []);

  // to get sc-sub-scheme-details by sc-scheme-details
  const [
    approvalStageBeforeNextStepListData,
    setApprovalStageBeforeNextStepListData,
  ] = useState([]);
  const getApprovalBeforeStageNextStepList = (subSchemeId) => {
    api
      .post(
        baseURLDBT +
          `service/getNextStepDetailsBeforeSubmitBySubSchemeId?subSchemeId=${subSchemeId}`
      )
      .then((response) => {
        if (response.data.content) {
          setApprovalStageBeforeNextStepListData(response.data.content);
        }
      })
      .catch((err) => {
        setApprovalStageBeforeNextStepListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.scSubSchemeDetailsId) {
      getApprovalBeforeStageNextStepList(data.scSubSchemeDetailsId);
    }
  }, [data.scSubSchemeDetailsId]);

  // Get Default Financial Year

  const getFinancialDefaultDetails = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-is-default`)
      .then((response) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId: response.data.content.financialYearMasterId,
        }));
      })
      .catch((err) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId: "",
        }));
      });
  };

  useEffect(() => {
    getFinancialDefaultDetails();
  }, []);

  // to get component
  const [scComponentListData, setScComponentListData] = useState([]);

  const getComponentList = (schemeId, subSchemeId) => {
    api
      .post(baseURLDBT + `master/cost/get-by-schemeId-and-subSchemeId`, {
        schemeId: schemeId,
        subSchemeId: subSchemeId,
      })
      .then((response) => {
        setScComponentListData(response.data.content.unitCost);
      })
      .catch((err) => {
        setScComponentListData([]);
      });
  };

  const [sharePercentage, setSharePercentage] = useState(0);

  const getHeadAccountbyschemeIdAndSubSchemeIdList = (
  schemeId,
  subSchemeId,
  scComponentId,
  categoryId
) => {
  api
    .post(baseURLDBT + `master/cost/get-hoa-by-schemeId-and-subSchemeId-and-categoryId`, {
      schemeId,
      subSchemeId,
      scComponentId,
      categoryId,
    })
    .then((response) => {
      const unitCost = response.data.content.unitCost;
      if (unitCost) {
        setScHeadAccountListData(unitCost);

        const first = unitCost[0];
        if (first) {
          setSharePercentage(first.shareInPercentage);  // ✅ correct field
        }
      }
    })
    .catch(() => {
      setScHeadAccountListData([]);
      setSharePercentage(0);
    });
};





  useEffect(() => {
    if (data.scSchemeDetailsId && data.scSubSchemeDetailsId) {
      getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
      getHeadAccountbyschemeIdAndSubSchemeIdList(
        data.scSchemeDetailsId,
        data.scSubSchemeDetailsId,
        data.scComponentId,
        data.scCategoryId
      );
    }
  }, [data.scSchemeDetailsId, data.scSubSchemeDetailsId,data.scComponentId,data.scCategoryId]);

  useEffect(() => {
  if (data.expectedAmount && sharePercentage) {
    const subsidy = (Number(data.expectedAmount) * Number(sharePercentage)) / 100;

    setData((prev) => ({
      ...prev,
      subsidyAmount: Math.round(subsidy)   // 🔥 rounded value
    }));
  }
}, [data.expectedAmount, sharePercentage]);

  console.log(data);

  // to get head of account by sc-scheme-details
  const [scHeadAccountListData, setScHeadAccountListData] = useState([]);
  // const getHeadAccountList = (_id) => {
  //   api
  //     .get(
  //       baseURLMasterData + `scHeadAccount/get-by-sc-scheme-details-id/${_id}`
  //     )
  //     .then((response) => {
  //       if (response.data.content.scHeadAccount) {
  //         setScHeadAccountListData(response.data.content.scHeadAccount);
  //       }
  //     })
  //     .catch((err) => {
  //       setScHeadAccountListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //     });
  // };

  // useEffect(() => {
  //   if (data.scSchemeDetailsId) {
  //     getHeadAccountList(data.scSchemeDetailsId);
  //   }
  // }, [data.scSchemeDetailsId]);
  const getHeadAccountList = (schemeId, subSchemeId, scComponentId) => {
    api
      .post(
        baseURLDBT +
          `master/cost/get-by-schemeId-and-subSchemeId-and-scComponentId`,
        {
          schemeId: schemeId,
          subSchemeId: subSchemeId,
          scComponentId: scComponentId,
        }
      )
      .then((response) => {
        if (response.data.content.unitCost) {
          setScHeadAccountListData(response.data.content.unitCost);
        }
      })
      .catch((err) => {
        setScHeadAccountListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (
      data.scSchemeDetailsId &&
      data.scSubSchemeDetailsId &&
      data.scComponentId
    ) {
      getHeadAccountList(
        data.scSchemeDetailsId,
        data.scSubSchemeDetailsId,
        data.scComponentId
      );
    }
  }, [data.scSchemeDetailsId, data.scSubSchemeDetailsId, data.scComponentId]);

  // to get category by head of account id
  const [scCategoryListData, setScCategoryListData] = useState([]);
  // const getCategoryList = (_id) => {
  //   api
  //     .get(
  //       baseURLMasterData +
  //         `scHeadAccountCategory/get-by-sc-head-account-id/${_id}`
  //     )
  //     .then((response) => {
  //       if (response.data.content.scHeadAccountCategory) {
  //         setScCategoryListData(response.data.content.scHeadAccountCategory);
  //       }
  //     })
  //     .catch((err) => {
  //       setScCategoryListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //     });
  // };

  // useEffect(() => {
  //   if (data.scHeadAccountId) {
  //     getCategoryList(data.scHeadAccountId);
  //   }
  // }, [data.scHeadAccountId]);

  const [id, setId] = useState(localStorage.getItem("userMasterId"));

  const [districtId, setDistrictId] = useState(null);
  const [talukId, setTalukId] = useState(null);
  const [userFromDistrictData, setUserFromDistrictData] = useState([]);

  //  to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLMasterData + `userMaster/get-join/${id}`)
      .then((response) => {
        setDistrictId(response.data.content.districtId);
        setTalukId(response.data.content.talukId);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        // editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);

  const getUserFromDistrictList = (
    subSchemeId,
    approvalStageId,
    districtId,
    talukId
  ) => {
    api
      .post(
        baseURLDBT +
          `service/getUserBySubSchemeIdAndScApprovalStageIdAndTalukIdAndDistrictId?subSchemeId=${subSchemeId}&approvalStageId=${approvalStageId}&districtId=${districtId}&talukId=${talukId}`
      )
      .then((response) => {
        if (response.data.content) {
          setUserFromDistrictData(response.data.content);
        }
      })
      .catch((err) => {
        setUserFromDistrictData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  const getCategoryList = () => {
    api
      .get(baseURLMasterData + `scCategory/get-all`)
      .then((response) => {
        if (response.data.content.scCategory) {
          setScCategoryListData(response.data.content.scCategory);
        }
      })
      .catch((err) => {
        setScCategoryListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  // to get sc-vendor
  const [scVendorListData, setScVendorListData] = useState([]);

  const getVendorList = () => {
    api
      .get(baseURLMasterData + `scVendor/get-all`)
      .then((response) => {
        setScVendorListData(response.data.content.ScVendor);
      })
      .catch((err) => {
        setScVendorListData([]);
      });
  };

  useEffect(() => {
    getVendorList();
  }, []);

   // to get District
     const [districtListData, setDistrictListData] = useState([]);
  
     const getDistrictList = () => {
       const response = api
         .get(baseURLMasterData + `district/get-all`)
         .then((response) => {
           setDistrictListData(response.data.content.district);
         })
         .catch((err) => {
           setDistrictListData([]);
         });
     };
   
     useEffect(() => {
       getDistrictList();
     }, []);

      // to get taluk
       const [talukListData, setTalukListData] = useState([]);
     
       const getTalukList = (_id) => {
         api
           .get(baseURLMasterData + `taluk/get-by-district-id/${_id}`)
           .then((response) => {
             setTalukListData(response.data.content.taluk);
           })
           .catch((err) => {
             setTalukListData([]);
             // alert(err.response.data.errorMessages[0].message[0].message);
           });
       };
     
       useEffect(() => {
         if (data.kaneshDistrictId) {
           getTalukList(data.kaneshDistrictId);
         }
       }, [data.kaneshDistrictId]);

       // to get hobli
         const [hobliListData, setHobliListData] = useState([]);
       
         const getHobliList = (_id) => {
           api
             .get(baseURLMasterData + `hobli/get-by-taluk-id/${_id}`)
             .then((response) => {
               setHobliListData(response.data.content.hobli);
             })
             .catch((err) => {
               setHobliListData([]);
               // alert(err.response.data.errorMessages[0].message[0].message);
             });
         };
       
         useEffect(() => {
           if (data.kaneshTalukId) {
             getHobliList(data.kaneshTalukId);
           }
         }, [data.kaneshTalukId]);

       // to get Village
         const [villageListData, setVillageListData] = useState([]);
       
         const getVillageList = (_id) => {
           api
             .get(baseURLMasterData + `village/get-by-hobli-id/${_id}`)
             .then((response) => {
               setVillageListData(response.data.content.village);
             })
             .catch((err) => {
               setVillageListData([]);
               // alert(err.response.data.errorMessages[0].message[0].message);
             });
         };
       
         useEffect(() => {
           if (data.kaneshHobliId) {
             getVillageList(data.kaneshHobliId);
           }
         }, [data.kaneshHobliId]);

  // to get User Master
  // const [userListData, setUserListData] = useState([]);

  // const getUserList = () => {
  //   const response = api
  //     .get(baseURLMasterData + `userMaster/get-all`)
  //     .then((response) => {
  //       setUserListData(response.data.content.userMaster);
  //     })
  //     .catch((err) => {
  //       setUserListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getUserList();
  // }, []);

  const [approvalListData, setApprovalListData] = useState([]);

  const getApprovalList = () => {
    const response = api
      .get(baseURLMasterData + `scApprovalStage/get-all`)
      .then((response) => {
        setApprovalListData(response.data.content.scApprovalStage);
      })
      .catch((err) => {
        setApprovalListData([]);
      });
  };

  useEffect(() => {
    getApprovalList();
  }, []);

  // to get uploadable documents
  const [docListData, setDocListData] = useState([]);

  const getDocList = () => {
    api
      .get(baseURLMasterData + `documentMaster/get-all`)
      .then((response) => {
        setDocListData(response.data.content.documentMaster);
      })
      .catch((err) => {
        setDocListData([]);
      });
  };

  console.log("where", docListData);

  // const getDocList = () => {
  //   api
  //     .post(baseURLDBT + `service/getApplicableDocumentList?subSchemeId=${data.scSubSchemeDetailsId}`)
  //     .then((response) => {
  //       setDocListData(response.data.content);
  //     })
  //     .catch((err) => {
  //       setDocListData([]);
  //     });
  // };

  useEffect(() => {
    getDocList();
  }, []);

  // console.log(applicationId[0]);

  const [farmerDetails, setFarmerDetails] = useState({
    farmerName: "",
    hobli: "",
    village: "",
  });

  const [showFarmerDetails, setShowFarmerDetails] = useState(false);

  const [unitTypeList, setUnitTypeList] = useState([]);
  useEffect(() => {
    if (
      data.scSchemeDetailsId &&
      data.scHeadAccountId &&
      data.scCategoryId &&
      data.scSubSchemeDetailsId
    ) {
      api
        .post(baseURLDBT + `master/cost/getUnitType`, {
          headOfAccountId: data.scHeadAccountId,
          schemeId: data.scSchemeDetailsId,
          subSchemeId: data.scSubSchemeDetailsId,
          categoryId: data.scCategoryId,
        })
        .then((response) => {
          setUnitTypeList(response.data.content);
          // setScVendorListData(response.data.content.ScVendor);
        })
        .catch((err) => {
          // setScVendorListData([]);
        });
    }
  }, [data.scHeadAccountId, data.scCategoryId, data.scSubSchemeDetailsId]);

  useEffect(() => {
    if (data.scSubSchemeDetailsId && data.approvalStageId) {
      getUserFromDistrictList(
        data.scSubSchemeDetailsId,
        data.approvalStageId,
        districtId,
        talukId
      );
    }
  }, [data.scSubSchemeDetailsId, data.approvalStageId]);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "fruitsId" && (value.length < 16 || value.length > 16)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "fruitsId" && value.length === 16) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
    if (name === "scSchemeDetailsId") {
      setSchemeId(value); // Trigger fetching scheme details
    }
    if (name === "calculationBasedOn") {
  setSelectedBonusMode(value); // Manual or Automatic
}
  };

  const formatDate = (date) => {
    if (!date) return ""; // Handle null or undefined dates
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0")
    );
  };


  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const handleDevelopedLandInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setDevelopedLand({ ...developedLand, [name]: value });
  };

  
  const handleAmountValueInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setAmountValue({ ...amountValue, [name]: value });
  };

  const [listData, setListData] = useState({});

 
  const getAmountList = () => {
    setLoading(true);
    const spacingId = data.spacingId;
    const hectareId = data.hectareId;
    
    api.get(`${baseURLMasterData}configurePmkysAmount/getClosestAmountBySpacingAndHectare/${spacingId}/${hectareId}`)
      .then((response) => {
        const result = response.data[0]; // Assuming the first element contains the relevant data
        setAmountValue({
          ...amountValue,
          unitPrice: result.amount, // Set the Unit Price
        });
        
        if (schemeDetails.calculationBasedOn !== "PMKSY") { // Only update expectedAmount if not PMKSY
            setData({
              ...data,
              expectedAmount: result.amount, // Set the Subsidy amount to expectedAmount
            });
        }
        setLoading(false);
      })
      .catch((err) => {
        setAmountValue({
          ...amountValue,
          unitPrice: "", // Clear Unit Price if API call fails
        });
        if (schemeDetails.calculationBasedOn !== "PMKSY") {
            setData({
              ...data,
              expectedAmount: "", // Clear expectedAmount if API call fails
            });
        }
        setLoading(false);
      });
};

  const [saveDisabled, setSaveDisabled] = useState(false);



const getEligibleAmount = () => {
  const { scComponentId, scCategoryId, fruitsId } = data;

  if (!fruitsId || !scComponentId || !scCategoryId) return; // Ensure required fields are selected

  setLoading(true);
  
  api.post(`${baseURLDBT}service/getEligibleAmount?componentId=${scComponentId}&categoryId=${scCategoryId}&fruitsId=${fruitsId}`, {}, {
      headers: {
          "Content-Type": "application/json"
      }
  })
  .then((response) => {
      const result = response.data.content?.[0]; // Ensure correct data access
      const eligibleAmount = result?.eligibleAmount;

      if (schemeDetails.calculationBasedOn === "PMKSY") {
          if (eligibleAmount === null || eligibleAmount === undefined || eligibleAmount === 0) {
              Swal.fire({
                  icon: "warning",
                  title: "First apply application for PDMC",
                  text: "Please apply for PDMC before proceeding.",
              });
              setSaveDisabled(true);
              setData({ ...data, expectedAmount: "" }); // Reset expectedAmount for PMKSY if no eligible amount
          } else {
              setSaveDisabled(false);
              setData({ ...data, expectedAmount: eligibleAmount || "" }); // Only set expectedAmount for PMKSY
          }
      } else {
          setSaveDisabled(false);
          // Do NOT update expectedAmount for non-PMKSY cases
      }
  })
  .catch(() => {
      setData({ ...data, expectedAmount: "" });
  })
  .finally(() => {
      setLoading(false);
  });
};

// useEffect to trigger API call
useEffect(() => {
if (data.scComponentId && data.scCategoryId && data.fruitsId) {
  getEligibleAmount();
}
}, [data.scComponentId, data.scCategoryId, data.fruitsId]);


const getCalculateAmountForRH = () => { 
  const { scSchemeDetailsId, scComponentId, scCategoryId } = data;

  if (!scSchemeDetailsId || !scComponentId || !scCategoryId) return;

  setLoading(true);
  
  api.get(`${baseURLDBT}configureRHAmount/get-amount-by-scheme-category-and-component?scSchemeDetailsId=${scSchemeDetailsId}&componentId=${scComponentId}&categoryId=${scCategoryId}`, {}, {
      headers: {
          "Content-Type": "application/json"
      }
  })
  .then((response) => {
      const result = response.data.content.configureRHAmount?.[0];
      const sqft = result?.sqft;
      const amount = result?.amount;
      let calculatedAmount = "";

      if (schemeDetails.calculationBasedOn === "Sericulture Development Programme") {
          if (sqft && amount) {
              calculatedAmount = sqft * amount;
          }
      } 
      else if (
          schemeDetails.calculationBasedOn === "Silk Samagra State" || 
          schemeDetails.calculationBasedOn === "Silk Samagra Central"
      ) {
          calculatedAmount = amount || ""; // Directly set amount from API
      }

      if (calculatedAmount) {
          setAmountValue((prev) => ({
              ...prev,
              unitPrice: calculatedAmount,
          }));

          setData((prev) => ({
              ...prev,
              expectedAmount: calculatedAmount,
          }));
      } else {
          setAmountValue((prev) => ({ ...prev, unitPrice: "" }));
          setData((prev) => ({ ...prev, expectedAmount: "" }));
      }
  })
  .catch(() => {
      setAmountValue((prev) => ({ ...prev, unitPrice: "" }));
      setData((prev) => ({ ...prev, expectedAmount: "" }));
  })
  .finally(() => {
      setLoading(false);
  });
};

// useEffect to trigger API call
useEffect(() => {
if (data.scComponentId && data.scCategoryId && data.scSchemeDetailsId) {
  getCalculateAmountForRH();
}
}, [data.scComponentId, data.scCategoryId, data.scSchemeDetailsId]);




  // const calculateBonusAmount = () => {
  //   const cocoonsWeight = parseFloat(data.cocoonsWeight || 0);
  //   const amountPerKg = parseFloat(bonusAmountData[0]?.amountPerKg || 0);
  //   const calculatedAmount = cocoonsWeight * amountPerKg;
  
  //   setAmountValue({
  //     ...amountValue,
  //     // unitPrice: calculatedAmount.toFixed(2),
  //     unitPrice: amountPerKg, // Set the Unit Price to amountPerKg
  //   });
  //   setData({
  //     ...data,
  //     expectedAmount: calculatedAmount, // Set the calculated amount as the Subsidy Amount
  //   });
  // };
  
//   const calculateBonusAmount = () => {
//   const cocoonsWeight = parseFloat(data.cocoonsWeight || 0);
//   const amountPerKg = parseFloat(bonusAmountData[0]?.amountPerKg || 0);

//   const calculatedAmount = cocoonsWeight * amountPerKg;
//   const roundedAmount = Math.round(calculatedAmount);
//  // round to 2 decimals

//   setAmountValue({
//     ...amountValue,
//     unitPrice: amountPerKg,
//   });

//   setData({
//     ...data,
//     expectedAmount: roundedAmount,
//   });
// };

const calculateBonusAmount = ({ calcType, maxNoOfCocoonsPerKg } = {}) => {
  const cocoonsWeight = parseFloat(data.cocoonsWeight || 0);
  const amountPerKg = parseFloat(bonusAmountData[0]?.amountPerKg || 0);
  const avgYield = parseFloat(data.averageYield || 0);

  let baseQuantity;

  // ⭐ Special rule:
  // If calcType is Bivoltine incentive AND averageYield > maxNoOfCocoonsPerKg,
  // then calculate based on: maxNoOfCocoonsPerKg * amountPerKg
  if (
    calcType === "Incentive For Bivoltine Cocoons-30/kg-PSF" &&
    maxNoOfCocoonsPerKg &&
    avgYield > parseFloat(maxNoOfCocoonsPerKg)
  ) {
    baseQuantity = parseFloat(maxNoOfCocoonsPerKg);
  } else {
    // Default: use cocoonsWeight as before
    baseQuantity = cocoonsWeight;
  }

  const calculatedAmount = baseQuantity * amountPerKg;

  // Round to 2 decimals
  // const roundedAmount = Math.round(calculatedAmount * 100) / 100;

  const roundedAmount = Math.round(calculatedAmount);

  setAmountValue((prev) => ({
    ...prev,
    unitPrice: amountPerKg,
  }));

  setData((prev) => ({
    ...prev,
    expectedAmount: roundedAmount,
  }));
};



const calculateAmountFor30Kg = () => {
  const cocoonsWeight = parseFloat(data.cocoonsWeight || 0);

  // If averageYield > max limit, use max slab's amountPerKg
  let amountPerKg;
  if (data.useMaxSlab) {
    amountPerKg = parseFloat(bonusAmountData[0]?.amountPerKg || 0);
  } else {
    amountPerKg = parseFloat(bonusAmountData[0]?.amountPerKg || 0);
  }

  const calculatedAmount = cocoonsWeight * amountPerKg;
  const roundedAmount = Math.round(calculatedAmount * 100) / 100; // round to 2 decimals

  setAmountValue({
    ...amountValue,
    unitPrice: amountPerKg,
  });

  setData({
    ...data,
    expectedAmount: roundedAmount,
  });
};

const calculateAmountForBivoltineBonus = () => {
  const amountPerKg = parseFloat(bonusAmountData[0]?.amountPerKg || 0);
  const cocoonsWeight = parseFloat(data.cocoonsWeight || 0);

  const schemeType = data.schemeType; // 2 = incentive, 3 = Bivoltine Bonus

  let calculatedAmount = 0;

  // ⭐ CASE 1: Bivoltine Bonus (subSchemeType = 3)
  if (schemeType === 3) {
    const rawSilk = parseFloat(data.noOfRawSilkProduced || 0);

    calculatedAmount = rawSilk * amountPerKg; // <-- Your new rule

  } 
  // ⭐ CASE 2: Other Incentive Schemes (subSchemeType = 2)
  else if (schemeType === 2) {
    const baseQuantity = parseFloat(data.cocoonsWeight || 0);
    calculatedAmount = baseQuantity * amountPerKg;
  }

  // Round to 2 decimals
  // const roundedAmount = Math.round(calculatedAmount * 100) / 100;
  const roundedAmount = Math.round(calculatedAmount);

  setAmountValue((prev) => ({
    ...prev,
    unitPrice: amountPerKg,
  }));

  setData((prev) => ({
    ...prev,
    expectedAmount: roundedAmount,
  }));
};



 const calculateChawkiBivoltineAmount = () => {
  const noOfDfls = parseFloat(data.lotWeight || 0);
  const amountPerKg = parseFloat(bonusAmountData[0]?.amountPerKg || 0);
  const unitCost = parseFloat(bonusAmountData[0]?.unitCost || 0);

  const calculatedAmount = noOfDfls * amountPerKg;
  const roundedAmount = Math.round(calculatedAmount);
 // round to 2 decimals

  setAmountValue({
    ...amountValue,
    unitPrice: unitCost,
  });

  setData({
    ...data,
    expectedAmount: roundedAmount,
  });
};

// to get Program
  const [rearingEquipmentDetailsData, setRearingEquipmentDetailsDataListData] = useState([]);

  const getRearingEquipmentDetailsDataList = () => {
    const response = api
      .get(baseURLMasterData + `subsidy/get-all`)
      .then((response) => {
        setRearingEquipmentDetailsDataListData(response.data.content.subsidy);
      })
      .catch((err) => {
        setRearingEquipmentDetailsDataListData([]);
      });
  };

  useEffect(() => {
    getRearingEquipmentDetailsDataList();
  }, []);
 
//   const handleCalculateUnitPrice = () => { 
//     if (schemeDetails.calculationBasedOn === "PDMC" || schemeDetails.calculationBasedOn === "PMKSY") {
//         if (!data.spacingId) {
//             Swal.fire({ icon: "warning", title: "Validation Error", text: "Please select a Spacing." });
//             return;
//         }
//         if (!data.hectareId) {
//             Swal.fire({ icon: "warning", title: "Validation Error", text: "Please select a Hectare." });
//             return;
//         }

//         if (schemeDetails.calculationBasedOn === "PMKSY") {
//             getEligibleAmount(); // Call the API after selecting fruitsId, categoryId, and componentId
//         }
//         getAmountList(); // Call to fill unitPrice
//     }  
//     else if (schemeDetails.calculationBasedOn === "Bivoltine Bonus") {
//         if (!data.scCategoryId || !data.scComponentId || !data.cocoonsWeight) {
//             Swal.fire({ icon: "warning", title: "Validation Error", text: "Please fill all required fields." });
//             return;
//         }
//         calculateBonusAmount();
//     } 
//     else if (
//       schemeDetails.calculationBasedOn === "Sericulture Development Programme" || 
//       schemeDetails.calculationBasedOn === "Silk Samagra State" || 
//       schemeDetails.calculationBasedOn === "Silk Samagra Central"
//   ) {
//       if (!data.scSchemeDetailsId || !data.scCategoryId || !data.scComponentId) {
//           Swal.fire({ icon: "warning", title: "Validation Error", text: "Please fill all required fields." });
//           return;
//       }
//       getCalculateAmountForRH();
//   }  
//   else {
//       Swal.fire({ icon: "error", title: "Error", text: "Invalid calculation method." });
//   }
// };

const [reelinShedAmountData, setReelingShedAmountListData] = useState([]);

// ✅ API call to get Silk Incentive amount list
const getreelingShedAmountList = (machineTypeId ,reelingSqft,componentTypeId, componentId, categoryId) => {
  api
    .get(`${baseURLMasterData}configureReelingShed/findByReelingUnitAndSqftAndComponentTypeIdAndComponentIdAndCategoryIdAndActive`, {
      params: {
        machineTypeId,
        reelingSqft,
        componentTypeId,
        componentId,
        categoryId
      }
    })
    .then((response) => {
      const incentiveData = response.data.content?.configureReelingShed || [];
      setReelingShedAmountListData(incentiveData);

      setAmountValue({
          ...amountValue,
          unitPrice: incentiveData.unitCost, // Set the Unit Price
        });
        setData({
              ...data,
              expectedAmount: incentiveData.unitCost, // Set the Subsidy amount to expectedAmount
            });
    })
    .catch((err) => {
      setReelingShedAmountListData([]);
      console.error(err);
    });
};

// ✅ useEffect to fetch Silk Incentive data when dependent fields change
useEffect(() => {
  if (
    data.machineTypeId &&
    data.reelingSqft &&
    data.scSubSchemeDetailsId &&
    data.scComponentId &&
    data.scCategoryId
  ) {
    getreelingShedAmountList( 
      data.machineTypeId,
      data.reelingSqft,
      data.scSubSchemeDetailsId,
      data.scComponentId, 
      data.scCategoryId
    );
  }
}, [data.machineTypeId,data.reelingSqft,data.scSubSchemeDetailsId, data.scComponentId, data.scCategoryId]);


const [reelingShedSolarWaterHeaterAmountData, setReelingShedSolarWaterHeaterAmountListData] = useState([]);

// ✅ API call to get Silk Incentive amount list
const getreelingShedSolarWaterHeaterAmountList = (machineTypeId ,reelingSqft,reelingUnit,componentTypeId, componentId, categoryId) => {
  api
    .get(`${baseURLMasterData}configureReelingShed/getDetailsForSolarWaterHeater`, {
      params: {
        machineTypeId,
        reelingSqft,
        reelingUnit,
        componentTypeId,
        componentId,
        categoryId
      }
    })
    .then((response) => {
      const incentiveData = response.data?.content?.configureReelingShed || [];

    setReelingShedSolarWaterHeaterAmountListData(incentiveData);

    // If record found, update unit price & expected amount
    if (incentiveData.length > 0) {
      const record = incentiveData[0];

      setAmountValue((prev) => ({
        ...prev,
        unitPrice: record.unitCost || 0,
      }));

      setData((prev) => ({
        ...prev,
        expectedAmount: record.unitCost || 0,
      }));
    }
  })
  .catch((err) => {
    setReelingShedSolarWaterHeaterAmountListData([]);
    console.error(err);
  });
};

// ✅ useEffect to fetch Silk Incentive data when dependent fields change
useEffect(() => {
  if (
    data.machineTypeId &&
    data.reelingSqft &&
    data.reelingUnit &&
    data.scSubSchemeDetailsId &&
    data.scComponentId &&
    data.scCategoryId
  ) {
    getreelingShedSolarWaterHeaterAmountList( 
      data.machineTypeId,
      data.reelingSqft,
      data.reelingUnit,
      data.scSubSchemeDetailsId,
      data.scComponentId, 
      data.scCategoryId
    );
  }
}, [data.machineTypeId,data.reelingSqft,data.reelingUnit,data.scSubSchemeDetailsId, data.scComponentId, data.scCategoryId]);

const [allDetailsData, setAllDetailsData] = useState([]);

// ✅ API call to get Silk Incentive amount list
const getAllDetailsDataForReelingShedSWSG = (machineTypeId,componentTypeId, componentId, categoryId) => {
  api
    .get(`${baseURLMasterData}configureReelingShed/getAllDetails`, {
      params: {
        machineTypeId,
        componentTypeId,
        componentId,
        categoryId
      }
    })
    .then((response) => {
      const incentiveData = response.data.content?.configureReelingShed || [];
      setAllDetailsData(incentiveData);
    })
    .catch((err) => {
      setAllDetailsData([]);
      console.error(err);
    });
};

// ✅ useEffect to fetch Silk Incentive data when dependent fields change
useEffect(() => {
  if (
    data.machineTypeId &&
    data.scSubSchemeDetailsId &&
    data.scComponentId &&
    data.scCategoryId
  ) {
    getAllDetailsDataForReelingShedSWSG( 
      data.machineTypeId,
      data.scSubSchemeDetailsId,
      data.scComponentId, 
      data.scCategoryId
    );
  }
}, [data.machineTypeId,data.scSubSchemeDetailsId, data.scComponentId, data.scCategoryId]);

const calculateEquipmentRow = (item, sharePerc) => {
  const purchasedNos = Number(item.purchasedEquipmentInNos || 0);
  const rate = Number(item.ratePerEligibleEquipment || 0);

  // Purchased Total Value
  const purchasedTotal = purchasedNos * rate;

  const eligibleValue = Number(item.eligibleTotalValueInRs || 0);
  const maxEligible = Number(item.maxAmountOfSubsidyEligible || 0);

  let subsidyAmount = 0;

  if (purchasedTotal > eligibleValue) {
    subsidyAmount = (maxEligible * sharePerc) / 100;
  } else {
    subsidyAmount = (purchasedTotal * sharePerc) / 100;
  }

  return {
    ...item,
    purchasedTotalValueInRs: purchasedTotal,
    percentageOfSubsidyAmount: subsidyAmount
  };
};


const handleCalculateUnitPrice = () => {

  const incentiveCalcBasedOn = getIncentiveAndBonusData[0]?.calculationBasedOn;
  const isChawki =
    incentiveCalcBasedOn ===
    "Registered Private Bivoltine Chawki Rearing Center Subsidy";

  // const schemeCalcBasedOn = schemeDetails.calculationBasedOn;

  // 1️⃣ FIRST: Chawki – Registered Private Bivoltine...
  if (isChawki) {
    const totals = calculateTotals(chawkiData);
    const { totalEligible, totalClaimed } = totals;

    // finalAmount = min(totalEligible, totalClaimed)
    const finalAmount =
      Number(totalEligible || 0) > Number(totalClaimed || 0)
        ? Number(totalClaimed || 0)
        : Number(totalEligible || 0);

    // Set Unit Cost
    setAmountValue((prev) => ({
      ...prev,
      unitPrice: finalAmount,
    }));

    // Set Total Subsidy/Bonus/Incentive Amount (expectedAmount)
    setData((prev) => ({
      ...prev,
      expectedAmount: finalAmount,
    }));

    // (Optional) If you also want to store in subsidyAmount when sanctionForReeling is true:
    if (getIncentiveAndBonusData[0]?.sanctionForReeling) {
      setData((prev) => ({
        ...prev,
        subsidyAmount: finalAmount,
      }));
    }

    Swal.fire({
      icon: "success",
      title: "Calculated Successfully",
      text: `Total Subsidy/Bonus/Incentive Amount = ${finalAmount}`,
    });

    return; // ✅ stop further checks
  }


  // ✅ Check scheme-based calculations
  if (schemeDetails.calculationBasedOn === "PDMC" || schemeDetails.calculationBasedOn === "PMKSY") {
    if (!data.spacingId) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please select a Spacing." });
      return;
    }
    if (!data.hectareId) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please select a Hectare." });
      return;
    }

    if (schemeDetails.calculationBasedOn === "PMKSY") {
      getEligibleAmount();
    }
    getAmountList();
    return; // ✅ stop further checks
  }

  // ✅ Check for Incentive/Bonus-based calculations
  if (getIncentiveAndBonusData[0]?.calculationBasedOn === "Bivoltine Bonus"  &&
  selectedBonusMode === "Automatic") {
    if (!data.scCategoryId || !data.scComponentId || !data.cocoonsWeight) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please fill all required fields." });
      return;
    }
    // 2. Check for required bonus-specific fields
    if (!data.averageYield || !data.noOfCocoonPerKg) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please provide Average Yield and No. of Cocoons/Kg." });
      return;
    }

    // 3. Validate that API data for bonus is available
    if (!bonusAmountData || bonusAmountData.length === 0) {
      Swal.fire({ icon: "warning", title: "No Data Found", text: "No Bivoltine Bonus data available for selected parameters." });
      return;
    }

    // 4. Extract min/max values from the bonus amount data
    // Assuming bonusAmountData[0] contains the validation parameters
    const { minAverageYield, maxNoOfCocoonsPerKg } = bonusAmountData[0];

    // 5. Check for minimum Average Yield
    if (parseFloat(data.averageYield) < parseFloat(minAverageYield)) {
      Swal.fire({ 
        icon: "warning", 
        title: "Validation Error", 
        text: `Average Yield cannot be less than the minimum required value (${minAverageYield}).` 
      });
      return;
    }

    // 6. Check for maximum No. of Cocoons Per Kg
    if (parseFloat(data.noOfCocoonPerKg) > parseFloat(maxNoOfCocoonsPerKg)) {
      Swal.fire({ 
        icon: "warning", 
        title: "Validation Error", 
        text: `No. of Cocoons Per Kg cannot be greater than the maximum allowed value (${maxNoOfCocoonsPerKg}).` 
      });
      return;
 }

    // 7. If all validations pass, calculate the bonus
    calculateBonusAmount();
    return;
  }


 if (getIncentiveAndBonusData[0]?.calculationBasedOn === "Bivoltine Bonus"  &&
  selectedBonusMode === "Manual") {
    if (!data.scCategoryId || !data.scComponentId || !data.cocoonsWeight) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please fill all required fields." });
      return;
    }
    // 2. Check for required bonus-specific fields
    if (!data.averageYield || !data.noOfCocoonPerKg) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please provide Average Yield and No. of Cocoons/Kg." });
      return;
    }

    // 3. Validate that API data for bonus is available
    if (!bonusAmountData || bonusAmountData.length === 0) {
      Swal.fire({ icon: "warning", title: "No Data Found", text: "No Bivoltine Bonus data available for selected parameters." });
      return;
    }

    // 4. Extract min/max values from the bonus amount data
    // Assuming bonusAmountData[0] contains the validation parameters
    const { minAverageYield, maxNoOfCocoonsPerKg } = bonusAmountData[0];

    // 5. Check for minimum Average Yield
    if (parseFloat(data.averageYield) < parseFloat(minAverageYield)) {
      Swal.fire({ 
        icon: "warning", 
        title: "Validation Error", 
        text: `Average Yield cannot be less than the minimum required value (${minAverageYield}).` 
      });
      return;
    }

    // 6. Check for maximum No. of Cocoons Per Kg
    if (parseFloat(data.noOfCocoonPerKg) > parseFloat(maxNoOfCocoonsPerKg)) {
      Swal.fire({ 
        icon: "warning", 
        title: "Validation Error", 
        text: `No. of Cocoons Per Kg cannot be greater than the maximum allowed value (${maxNoOfCocoonsPerKg}).` 
      });
      return;
 }

    // 7. If all validations pass, calculate the bonus
    calculateAmountForBivoltineBonus();
    return;
  }


// ✅ Check for Incentive/Bonus-based calculations
//   if (getIncentiveAndBonusData[0]?.calculationBasedOn === "Incentive For Bivoltine Cocoons-30/kg-PSF" ||
//     getIncentiveAndBonusData[0]?.calculationBasedOn === "North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP"
//   ) {
//     if (!data.scCategoryId || !data.scComponentId || !data.cocoonsWeight) {
//       Swal.fire({ icon: "warning", title: "Validation Error", text: "Please fill all required fields." });
//       return;
//     }
//     // 2. Check for required bonus-specific fields
//     if (!data.averageYield || !data.noOfDfls) {
//       Swal.fire({ icon: "warning", title: "Validation Error", text: "Please provide Average Yield and No Of DFLs" });
//       return;
//     }

//     // 3. Validate that API data for bonus is available
//     if (!bonusAmountData || bonusAmountData.length === 0) {
//       Swal.fire({ icon: "warning", title: "No Data Found", text: "No data available for selected parameters." });
//       return;
//     }

//     // 4. Extract min/max values from the bonus amount data
//     // Assuming bonusAmountData[0] contains the validation parameters
//     const { minAverageYield, maxNoOfCocoonsPerKg } = bonusAmountData[0];

//     // 5. Check for minimum Average Yield
//     if (parseFloat(data.averageYield) < parseFloat(minAverageYield)) {
//       Swal.fire({ 
//         icon: "warning", 
//         title: "Validation Error", 
//         text: `Average Yield cannot be less than the minimum required value (${minAverageYield}).` 
//       });
//       return;
//     }

//     // 6. Check for maximum No. of Cocoons Per Kg
//     if (parseFloat(data.averageYield) > parseFloat(maxNoOfCocoonsPerKg)) {
//       Swal.fire({ 
//         icon: "warning", 
//         title: "Validation Error", 
//         text: `Average Yield cannot be greater than the maximum allowed value (${maxNoOfCocoonsPerKg}).` 
//       });
//       return;
//  }

//     // 7. If all validations pass, calculate the bonus
//     calculateBonusAmount();
//     return;
//   }
// ✅ Check for Incentive/Bonus-based calculations
// if (
//   getIncentiveAndBonusData[0]?.calculationBasedOn ===
//     "Incentive For Bivoltine Cocoons-30/kg-PSF" ||
//   getIncentiveAndBonusData[0]?.calculationBasedOn ===
//     "North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP"
// ) {
//   if (!data.scCategoryId || !data.scComponentId || !data.cocoonsWeight) {
//     Swal.fire({
//       icon: "warning",
//       title: "Validation Error",
//       text: "Please fill all required fields.",
//     });
//     return;
//   }

//   // 2. Check for required bonus-specific fields
//   if (!data.averageYield || !data.cocoonsWeight) {
//     Swal.fire({
//       icon: "warning",
//       title: "Validation Error",
//       text: "Please provide Average Yield and No Of DFLs",
//     });
//     return;
//   }

//   // 3. Validate that API data for bonus is available
//   if (!bonusAmountData || bonusAmountData.length === 0) {
//     Swal.fire({
//       icon: "warning",
//       title: "No Data Found",
//       text: "No data available for selected parameters.",
//     });
//     return;
//   }

//   const calcType = getIncentiveAndBonusData[0]?.calculationBasedOn;

//   // 🔥 APPLY MIN/MAX VALIDATION ONLY FOR BIVOLTINE INCENTIVE
//   if (calcType === "Incentive For Bivoltine Cocoons-30/kg-PSF") {
//     const { minAverageYield, maxNoOfCocoonsPerKg } = bonusAmountData[0];

//     // 5. Check min Average Yield
//     if (parseFloat(data.averageYield) < parseFloat(minAverageYield)) {
//       Swal.fire({
//         icon: "warning",
//         title: "Validation Error",
//         text: `Average Yield cannot be less than the minimum required value (${minAverageYield}).`,
//       });
//       return;
//     }

//     // 6. Check max No. of Cocoons Per Kg
//     if (parseFloat(data.averageYield) > parseFloat(maxNoOfCocoonsPerKg)) {
//       Swal.fire({
//         icon: "warning",
//         title: "Validation Error",
//         text: `Average Yield cannot be greater than the maximum allowed value (${maxNoOfCocoonsPerKg}).`,
//       });
//       return;
//     }
//   }

//   // 7. If all validations pass, calculate the bonus
//   calculateBonusAmount();
//   return;
// }

// ... inside your function/handler

const calcType = getIncentiveAndBonusData[0]?.calculationBasedOn;

if (
  calcType === "Incentive For Bivoltine Cocoons-30/kg-PSF" ||
  calcType === "North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP"
) {
  if (!data.scCategoryId || !data.scComponentId || !data.cocoonsWeight) {
    Swal.fire({
      icon: "warning",
      title: "Validation Error",
      text: "Please fill all required fields.",
    });
    return;
  }

  // 2. Check for required bonus-specific fields
  if (!data.averageYield || !data.cocoonsWeight) {
    Swal.fire({
      icon: "warning",
      title: "Validation Error",
      text: "Please provide Average Yield and No Of DFLs",
    });
    return;
  }

  // 3. Validate that API data for bonus is available
  if (!bonusAmountData || bonusAmountData.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "No Data Found",
      text: "No data available for selected parameters.",
    });
    return;
  }

  // 🔥 EXTRA: MIN validation only for Bivoltine incentive
  let maxNoOfCocoonsPerKg;

  if (calcType === "Incentive For Bivoltine Cocoons-30/kg-PSF") {
    const { minAverageYield, maxNoOfCocoonsPerKg: maxCocoons } = bonusAmountData[0];
    maxNoOfCocoonsPerKg = maxCocoons;

    // 5. Check min Average Yield (still blocked if less than min)
    if (parseFloat(data.averageYield) < parseFloat(minAverageYield)) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: `Average Yield cannot be less than the minimum required value (${minAverageYield}).`,
      });
      return;
    }

    // ⚠️ IMPORTANT:
    // If Average Yield > maxNoOfCocoonsPerKg -> DO NOT block.
    // We'll handle it inside calculateBonusAmount by using
    // maxNoOfCocoonsPerKg for the calculation.
  }

  // 7. If all validations pass, calculate the bonus
  calculateBonusAmount({ calcType, maxNoOfCocoonsPerKg });
  return;
}


if (
  getIncentiveAndBonusData[0]?.calculationBasedOn ===
    "Incentive For Bivoltine Chawki Rearing Cost"
) {
  if (!data.scCategoryId || !data.scComponentId || !data.cocoonsWeight) {
    Swal.fire({
      icon: "warning",
      title: "Validation Error",
      text: "Please fill all required fields.",
    });
    return;
  }

  // 2. Check for required bonus-specific fields
  if (!data.averageYield || !data.lotWeight) {
    Swal.fire({
      icon: "warning",
      title: "Validation Error",
      text: "Please provide Average Yield and No Of DFLs",
    });
    return;
  }

  // 3. Validate that API data for bonus is available
  if (!bonusAmountData || bonusAmountData.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "No Data Found",
      text: "No data available for selected parameters.",
    });
    return;
  }

  

  // 7. If all validations pass, calculate the bonus
  calculateChawkiBivoltineAmount();
  return;
}

if (
  getIncentiveAndBonusData[0]?.calculationBasedOn ===
    "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500"
) {

  if (!data.scCategoryId || !data.scComponentId || !data.cocoonsWeight) {
    Swal.fire({
      icon: "warning",
      title: "Validation Error",
      text: "Please fill all required fields.",
    });
    return;
  }

  // 2. Check for required bonus-specific fields
  if (!data.averageYield || !data.lotWeight) {
    Swal.fire({
      icon: "warning",
      title: "Validation Error",
      text: "Please provide Average Yield and No Of DFLs",
    });
    return;
  }

  // 3. Validate that API data for bonus is available
  if (!bonusAmountData || bonusAmountData.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "No Data Found",
      text: "No data available for selected parameters.",
    });
    return;
  }

  

  // 7. If all validations pass, calculate the bonus
  calculateChawkiBivoltineAmount();
  return;
}


  // ✅ Special case: Silk Incentive - PSF
  if (getIncentiveAndBonusData[0]?.calculationBasedOn === "Silk Incentive-PSF") {
    if (!data.scSubSchemeDetailsId || !data.scComponentId || !data.scCategoryId || !data.machineTypeId || !data.silkTable || !data.renditta) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill all required fields.",
      });
      return;
    }

    if (!data.machineQuantity) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter Machine Quantity.",
      });
      return;
    }

    // ✅ Check for max machine quantity
    if (maxMachineQuantity && parseFloat(data.machineQuantity) > parseFloat(maxMachineQuantity)) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: `Entered quantity exceeds maximum allowed value (${maxMachineQuantity}). Please enter a lower quantity.`,
      });
      return;
    }

    // ✅ Calculate subsidy/bonus amount using amountPerKg
        if (silkIncentiveAmountData.length > 0) {
      const { amountPerKg } = silkIncentiveAmountData[0];
      const totalAmount = parseFloat(data.machineQuantity) * parseFloat(amountPerKg);

      // ✅ Update Unit Price as amountPerKg
          setAmountValue((prev) => ({
        ...prev,
        unitPrice: Math.round(totalAmount), // no decimals
      }));

      // ✅ Update Subsidy/Bonus/Incentive Amount
      setData((prev) => ({
        ...prev,
        expectedAmount: Math.round(totalAmount), // no decimals
      }));
    }

    return;
  }

  if (
    getIncentiveAndBonusData[0]?.calculationBasedOn === "IMCB-PSF" ||
    getIncentiveAndBonusData[0]?.calculationBasedOn === "MERM-PSF"
  ) {
    if (
      !data.imcbTable ||
      !data.scSubSchemeDetailsId ||
      !data.scComponentId ||
      !data.scCategoryId
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill all required fields.",
      });
      return;
    }

    // ✅ Validate that API data is available
    if (!imcbAndMermAmountData || imcbAndMermAmountData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data Found",
        text: "No IMCB/MERM data available for selected parameters.",
      });
      return;
    }

    // ✅ Use first record (or modify if multiple expected)
    const imcbRecord = imcbAndMermAmountData[0];

    // ✅ Set Unit Price (unitCost) and Scheme Amount (amount)
    setAmountValue((prev) => ({
      ...prev,
      unitPrice: Math.round(imcbRecord.unitCost || 0),
    }));

    setData((prev) => ({
      ...prev,
      expectedAmount: Math.round(imcbRecord.unitCost || 0),
    }));

    return;
  }


  if (
    getIncentiveAndBonusData[0]?.calculationBasedOn === "Adopting Boiler-PSF" 
  ) {
    if (
      !data.boilerInKg ||
      !data.scSubSchemeDetailsId ||
      !data.scComponentId ||
      !data.scCategoryId
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill all required fields.",
      });
      return;
    }

    // ✅ Validate that API data is available
    if (!adoptingBoilerAmountData || adoptingBoilerAmountData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data Found",
        text: "No data available for selected parameters.",
      });
      return;
    }

    // ✅ Use first record (or modify if multiple expected)
    const adoptingBoilerRecord = adoptingBoilerAmountData[0];

    // ✅ Set Unit Price (unitCost) and Scheme Amount (amount)
    setAmountValue((prev) => ({
      ...prev,
      unitPrice: Math.round(adoptingBoilerRecord.unitCost || 0),
    }));

    setData((prev) => ({
      ...prev,
      expectedAmount: Math.round(adoptingBoilerRecord.unitCost || 0),
    }));

    return;
  }

  if (
    getIncentiveAndBonusData[0]?.calculationBasedOn === "ICB-PSF"
  ) {
    if (
      !data.icbBasinEnds ||
      !data.scSubSchemeDetailsId ||
      !data.scComponentId ||
      !data.scCategoryId
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill all required fields.",
      });
      return;
    }


  // ✅ Validate that API data is available
    if (!icbAndArmAmountData || icbAndArmAmountData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data Found",
        text: "No ICB data available for selected parameters.",
      });
      return;
    }

    // ✅ Use first record (or modify if multiple expected)
    const icbRecord = icbAndArmAmountData[0];

    // ✅ Set Unit Price (unitCost) and Scheme Amount (amount)
    setAmountValue((prev) => ({
      ...prev,
      unitPrice: Math.round(icbRecord.unitCost || 0),
    }));

    setData((prev) => ({
      ...prev,
      expectedAmount: Math.round(icbRecord.unitCost || 0),
    }));

    return;
  }

  
if (
    getIncentiveAndBonusData[0]?.calculationBasedOn === "Reeling Shed-PSF"
  ) {
    if (
      !data.machineTypeId ||
      !data.reelingSqft ||
      !data.scSubSchemeDetailsId ||
      !data.scComponentId ||
      !data.scCategoryId
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill all required fields.",
      });
      return;
    }


  // ✅ Validate that API data is available
    if (!reelinShedAmountData || reelinShedAmountData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data Found",
        text: "No Reeling Shed data available for selected parameters.",
      });
      return;
    }

    // ✅ Use first record (or modify if multiple expected)
    const icbRecord = reelinShedAmountData[0];

    // ✅ Set Unit Price (unitCost) and Scheme Amount (amount)
    setAmountValue((prev) => ({
      ...prev,
      unitPrice: Math.round(icbRecord.unitCost || 0),
    }));

    setData((prev) => ({
      ...prev,
      expectedAmount: Math.round(icbRecord.unitCost || 0),
    }));

    return;
  } 


  if (
    getIncentiveAndBonusData[0]?.calculationBasedOn === "Adopting Silent Generator"
  ) {
    if (
      !data.machineTypeId ||
      !data.reelingSqft ||
      !data.scSubSchemeDetailsId ||
      !data.scComponentId ||
      !data.scCategoryId
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill all required fields.",
      });
      return;
    }


  // ✅ Validate that API data is available
    if (!reelinShedAmountData || reelinShedAmountData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data Found",
        text: "No Adopting Silent Generator data available for selected parameters.",
      });
      return;
    }

    // ✅ Use first record (or modify if multiple expected)
    const icbRecord = reelinShedAmountData[0];

    // ✅ Set Unit Price (unitCost) and Scheme Amount (amount)
    setAmountValue((prev) => ({
      ...prev,
      unitPrice: Math.round(icbRecord.unitCost || 0),
    }));

    setData((prev) => ({
      ...prev,
      expectedAmount: Math.round(icbRecord.unitCost || 0),
    }));

    return;
  } 

  if (
    getIncentiveAndBonusData[0]?.calculationBasedOn === "Adopting Solar power Generator"
  ) {
    if (
      !data.machineTypeId ||
      !data.reelingSqft ||
      !data.scSubSchemeDetailsId ||
      !data.scComponentId ||
      !data.scCategoryId
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill all required fields.",
      });
      return;
    }


  // ✅ Validate that API data is available
    if (!reelinShedAmountData || reelinShedAmountData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data Found",
        text: "No Adopting Solar power Generator data available for selected parameters.",
      });
      return;
    }

    // ✅ Use first record (or modify if multiple expected)
    const icbRecord = reelinShedAmountData[0];

    // ✅ Set Unit Price (unitCost) and Scheme Amount (amount)
    setAmountValue((prev) => ({
      ...prev,
      unitPrice: Math.round(icbRecord.unitCost || 0),
    }));

    setData((prev) => ({
      ...prev,
      expectedAmount: Math.round(icbRecord.unitCost || 0),
    }));

    return;
  } 


  if (
    getIncentiveAndBonusData[0]?.calculationBasedOn === "Adopting Solar Water Heater"
  ) {
    if (
      !data.machineTypeId ||
      !data.reelingSqft ||
      !data.reelingUnit ||
      !data.scSubSchemeDetailsId ||
      !data.scComponentId ||
      !data.scCategoryId
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill all required fields.",
      });
      return;
    }


  // ✅ Validate that API data is available
    if (!reelingShedSolarWaterHeaterAmountData || reelingShedSolarWaterHeaterAmountData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data Found",
        text: "No Adopting Solar Water Heater data available for selected parameters.",
      });
      return;
    }

    // ✅ Use first record (or modify if multiple expected)
    const icbRecord = reelingShedSolarWaterHeaterAmountData[0];

    // ✅ Set Unit Price (unitCost) and Scheme Amount (amount)
    setAmountValue((prev) => ({
      ...prev,
      unitPrice: Math.round(icbRecord.unitCost || 0),
    }));

    setData((prev) => ({
      ...prev,
      expectedAmount: Math.round(icbRecord.unitCost || 0),
    }));

    return;
  } 
  

  // ✅ Adopting Heat Recovery Unit - PSF
  if (getIncentiveAndBonusData[0]?.calculationBasedOn === "Adopting Heat Recovery Unit-PSF") {
    if (!data.scSchemeDetailsId || !data.scSubSchemeDetailsId || !data.scComponentId) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill all required fields.",
      });
      return;
    }

    // ✅ Directly assign unitPrice → expectedAmount
    setData((prev) => ({
      ...prev,
      expectedAmount: amountValue.unitPrice || 0,
    }));

    return;
  }

  // ✅ Sericulture/State/Central-based calculations
  if (
    schemeDetails.calculationBasedOn === "Sericulture Development Programme" ||
    schemeDetails.calculationBasedOn === "Silk Samagra State" ||
    schemeDetails.calculationBasedOn === "Silk Samagra Central"
  ) {
    if (!data.scSchemeDetailsId || !data.scCategoryId || !data.scComponentId) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please fill all required fields." });
      return;
    }
    getCalculateAmountForRH();
    return;
  }

  // ===============================================
// FOR REGISTERED PRIVATE CHAWKI SUBSIDY CALCULATION
// ===============================================
// if (
//   getIncentiveAndBonusData[0]?.calculationBasedOn === 
//   "Registered Private Bivoltine Chawki Rearing Center Subsidy"
// ) {
//   let sharePerc = getIncentiveAndBonusData[0]?.shareInPercentage || 0;

//   setChawkiData((prev) => {
//     const updatedList = prev.equipmentList.map((item) => {
//       const purchasedNos = Number(item.purchasedEquipmentInNos || 0);
//       const rate = Number(item.ratePerEligibleEquipment || 0);

//       // 1️⃣ Purchased Total Value
//       const purchasedTotal = purchasedNos * rate;

//       const eligibleValue = Number(item.eligibleTotalValueInRs || 0);
//       const maxEligible = Number(item.maxAmountOfSubsidyEligible || 0);

//       let subsidyAmount = 0;

//       // 2️⃣ Subsidy Calculation Logic
//       if (purchasedTotal > eligibleValue) {
//         subsidyAmount = (maxEligible * sharePerc) / 100;
//       } else {
//         subsidyAmount = (purchasedTotal * sharePerc) / 100;
//       }

//       return {
//         ...item,
//         purchasedTotalValueInRs: purchasedTotal,
//         percentageOfSubsidyAmount: subsidyAmount
//       };
//     });

//     return { ...prev, equipmentList: updatedList };
//   });

//   return;
// }

// if (getIncentiveAndBonusData[0]?.calculationBasedOn === "Registered Private Bivoltine Chawki Rearing Center Subsidy") {
      
//       const totals = calculateTotals(chawkiData);
//       const { totalEligible, totalClaimed } = totals;

//       // Apply logic
//       let finalAmount = 0;

//       if (totalEligible > totalClaimed) {
//         finalAmount = totalClaimed;
//       } else {
//         finalAmount = totalEligible;
//       }

//       setAmountValue((prev) => ({
//       ...prev,
//       unitPrice: finalAmount
//     }));

//       // Store in expectedAmount field (Total Subsidy/Bonus/Incentive Amount)
//       setData(prev => ({
//         ...prev,
//         expectedAmount: finalAmount
//       }));

//       Swal.fire({
//         icon: "success",
//         title: "Calculated Successfully",
//         text: `Total Subsidy/Bonus/Incentive Amount = ${finalAmount}`
//       });

//       return;
//   }


  // ❌ Default fallback for anything unmatched
  Swal.fire({ icon: "error", title: "Error", text: "Invalid calculation method." });
};


  // to get bonus Amount by component and category
  const [bonusAmountData, setBonusAmountListData] = useState(
    []
  );
  const getBonusAmountList = (componentId, categoryId) => {
    api
      .get(
        `${baseURLDBT}configureBivoltineAmount/get-amount-by-category-and-component`, 
        {
          params: {
            componentId,
            categoryId,
            // isActive: true
          }
        }
      )
      .then((response) => {
        if (response.data.content.configureBivoltineAmount) {
          setBonusAmountListData(response.data.content.configureBivoltineAmount);
        }
      })
      .catch((err) => {
        setBonusAmountListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };
  

  useEffect(() => {
    if (data.scComponentId && data.scCategoryId) {
      getBonusAmountList(data.scComponentId,data.scCategoryId);
    }
  }, [data.scComponentId, data.scCategoryId]);

  const [chawkiData, setChawkiData] = useState({
  equipmentList: [],  // repeating rows
  mulberry: {
    eligible: 0,
    claimed: "",
    percentage: ""
  },
  drip: {
    eligible: 0,
    claimed: "",
    percentage: ""
  },
  building: {
    eligible: 0,
    claimed: "",
    percentage: ""
  }
});


  const getChawkiDetails = () => {
 api.post(
    baseURLDBT + `registeredPrivateChawki/getChawkiSanctionOrderDetails`,
    {
    subSchemeId: data.scSubSchemeDetailsId,
    componentId: data.scComponentId,
    categoryId: data.scCategoryId
  })
  .then(res => {
    const list = res.data.content || [];

    if (list.length === 0) return;

    // Extract 3 single-value blocks
    const first = list[0];

    setChawkiData({
      equipmentList: list.map(item => ({
        rearingEquipmentDetailsId: item.rearingEquipmentDetailsId,
        subsidyName: item.subsidyName,
        eligibleEquipmentInNos: item.eligibleEquipmentInNos,
        eligibleTotalValueInRs: item.eligibleTotalValueInRs,
        // ratePerEligibleEquipment: item.ratePerEligibleEquipment,
        maxAmountOfSubsidyEligible: item.maxAmountOfSubsidyEligible,

        ratePerEligibleEquipment: "",
        purchasedEquipmentInNos: "",
        purchasedTotalValueInRs: "",
        percentageOfSubsidyAmount: "",

        selected: false
      })),

      mulberry: {
        eligible: first.establishmentOfMulberryGardenEligibleAmount,
        // claimed: first.establishmentOfMulberryGardenClaimedAmount || "",
        // percentage: first.establishmentOfMulberryGardenPercentageOfSubsidyAmount || ""
        claimed: "",
        percentage: ""
      },
      drip: {
        eligible: first.installationOfDripIrrigationEligibleAmount,
        // claimed: first.installationOfDripIrrigationClaimedAmount || "",
        // percentage: first.installationOfDripIrrigationPercentageOfSubsidyAmount || ""
        claimed: "",
        percentage: ""
      },
      building: {
        eligible: first.chawkiRearingBuildingEligibleAmount,
        // claimed: first.chawkiRearingBuildingClaimedAmount || "",
        // percentage: first.chawkiRearingBuildingPercentageOfSubsidyAmount || ""
        claimed: "",
        percentage: ""
      }
    });
  })
.catch((err) => {
    console.error("Error fetching details:", err);
    Swal.fire({
      icon: "warning",
      title: "Details Not Found",
    });
    // setFarmerDetailsForIB([]);
 
    setLoading(false);
  });
};


useEffect(() => {
  if (
    data.scSubSchemeDetailsId &&
    data.scComponentId &&
    data.scCategoryId
  ) {
    getChawkiDetails(
      data.scSubSchemeDetailsId,
      data.scComponentId,
      data.scCategoryId
    );
  }
}, [data.scSubSchemeDetailsId, data.scComponentId, data.scCategoryId]);





const [silkIncentiveAmountData, setSilkIncentiveListData] = useState([]);
const [maxMachineQuantity, setMaxMachineQuantity] = useState(null);

  // ✅ API call to get Silk Incentive amount list
const getSilkIncentiveAmountList = (componentTypeId, componentId, categoryId, machineTypeId,silkTable,renditta) => {
  api
    .get(`${baseURLMasterData}configureSilkIncentive/getAmountByMachineTypeComponentsAndSchemes`, {
      params: {
        componentTypeId,
        componentId,
        categoryId,
        machineTypeId,
        silkTable,
        renditta
      }
    })
    .then((response) => {
      const incentiveData = response.data.content?.configureSilkIncentive || [];
      setSilkIncentiveListData(incentiveData);

      if (incentiveData.length > 0) {
        const { amountPerKg, max } = incentiveData[0];
        setMaxMachineQuantity(max || null);

        // ✅ Auto calculate total amount if machineQuantity is already entered
        if (data.machineQuantity && amountPerKg) {
          const totalAmount = parseFloat(data.machineQuantity) * parseFloat(amountPerKg);
          setData((prev) => ({
            ...prev,
            expectedAmount: Math.round(totalAmount),
          }));
        }
      }
    })
    .catch((err) => {
      setSilkIncentiveListData([]);
      setMaxMachineQuantity(null);
      console.error(err);
    });
};

// ✅ useEffect to fetch Silk Incentive data when dependent fields change
useEffect(() => {
  if (
    data.scSubSchemeDetailsId &&
    data.scComponentId &&
    data.scCategoryId &&
    data.machineTypeId &&
    data.silkTable &&
    data.renditta
  ) {
    getSilkIncentiveAmountList(
      data.scSubSchemeDetailsId,
      data.scComponentId,
      data.scCategoryId,
      data.machineTypeId,
      data.silkTable,
      data.renditta
    );
  }
}, [data.scSubSchemeDetailsId, data.scComponentId, data.scCategoryId, data.machineTypeId,data.silkTable, data.renditta]);

const [imcbAndMermAmountData, setImcbAndMermAmountListData] = useState([]);

// ✅ API call to get Silk Incentive amount list
const getImcbAndMermAmountList = (imcbTable ,componentTypeId, componentId, categoryId) => {
  api
    .get(`${baseURLMasterData}configureImcb/findByImcbTableAndComponentTypeIdAndComponentIdAndCategoryIdAndActive`, {
      params: {
        imcbTable,
        componentTypeId,
        componentId,
        categoryId
      }
    })
    .then((response) => {
      const incentiveData = response.data.content?.configureImcb || [];
      setImcbAndMermAmountListData(incentiveData);

      setAmountValue({
          ...amountValue,
          unitPrice: incentiveData.unitCost, // Set the Unit Price
        });
        setData({
              ...data,
              expectedAmount: incentiveData.unitCost, // Set the Subsidy amount to expectedAmount
            });
    })
    .catch((err) => {
      setImcbAndMermAmountListData([]);
      console.error(err);
    });
};

// ✅ useEffect to fetch Silk Incentive data when dependent fields change
useEffect(() => {
  if (
    data.imcbTable &&
    data.scSubSchemeDetailsId &&
    data.scComponentId &&
    data.scCategoryId
  ) {
    getImcbAndMermAmountList(
      data.imcbTable,
      data.scSubSchemeDetailsId,
      data.scComponentId,
      data.scCategoryId
    );
  }
}, [data.imcbTable,data.scSubSchemeDetailsId, data.scComponentId, data.scCategoryId]);


const [adoptingBoilerAmountData, setAdoptingBoilerAmountListData] = useState([]);

// ✅ API call to get Silk Incentive amount list
const getAdoptingBoilerAmountList = (boilerInKg ,componentTypeId, componentId, categoryId) => {
  api
    .get(`${baseURLMasterData}configureAdoptingBoiler/findByBoilerInKgAndComponentTypeIdAndComponentIdAndCategoryIdAndActive`, {
      params: {
        boilerInKg,
        componentTypeId,
        componentId,
        categoryId
      }
    })
    .then((response) => {
      const incentiveData = response.data.content?.configureAdoptingBoiler || [];
      setAdoptingBoilerAmountListData(incentiveData);

      setAmountValue({
          ...amountValue,
          unitPrice: incentiveData.unitCost, // Set the Unit Price
        });
        setData({
              ...data,
              expectedAmount: incentiveData.unitCost, // Set the Subsidy amount to expectedAmount
            });
    })
    .catch((err) => {
      setAdoptingBoilerAmountListData([]);
      console.error(err);
    });
};

// ✅ useEffect to fetch Silk Incentive data when dependent fields change
useEffect(() => {
  if (
    data.boilerInKg &&
    data.scSubSchemeDetailsId &&
    data.scComponentId &&
    data.scCategoryId
  ) {
    getAdoptingBoilerAmountList(
      data.boilerInKg,
      data.scSubSchemeDetailsId,
      data.scComponentId,
      data.scCategoryId
    );
  }
}, [data.boilerInKg,data.scSubSchemeDetailsId, data.scComponentId, data.scCategoryId]);


const [icbAndArmAmountData, setIcbAndArmAmountListData] = useState([]);

// ✅ API call to get Silk Incentive amount list
const getIcbAndArmAmountList = (icbBasinEnds ,componentTypeId, componentId, categoryId) => {
  api
    .get(`${baseURLMasterData}configureIcb/findByIcbBasinEndsAndComponentTypeIdAndComponentIdAndCategoryIdAndActive`, {
      params: {
        icbBasinEnds,
        componentTypeId,
        componentId,
        categoryId
      }
    })
    .then((response) => {
      const incentiveData = response.data.content?.configureIcb || [];
      setIcbAndArmAmountListData(incentiveData);

      setAmountValue({
          ...amountValue,
          unitPrice: incentiveData.unitCost, // Set the Unit Price
        });
        setData({
              ...data,
              expectedAmount: incentiveData.unitCost, // Set the Subsidy amount to expectedAmount
            });
    })
    .catch((err) => {
      setIcbAndArmAmountListData([]);
      console.error(err);
    });
};

// ✅ useEffect to fetch Silk Incentive data when dependent fields change
useEffect(() => {
  if (
    data.icbBasinEnds &&
    data.scSubSchemeDetailsId &&
    data.scComponentId &&
    data.scCategoryId
  ) {
    getIcbAndArmAmountList( 
      data.icbBasinEnds,
      data.scSubSchemeDetailsId,
      data.scComponentId, 
      data.scCategoryId
    );
  }
}, [data.icbBasinEnds,data.scSubSchemeDetailsId, data.scComponentId, data.scCategoryId]);

  const handleEquipmentInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setEquipment({ ...equipment, [name]: value });
  };

  const handleEquipmentListChange = (index, e) => {
  const { name, value, type, checked } = e.target;
  const sharePerc = sharePercentage;

  setChawkiData((prev) => {
    const updated = [...prev.equipmentList];
    updated[index] = {
      ...updated[index],
      [name]: type === "checkbox" ? checked : value
    };

    if (name === "purchasedEquipmentInNos") {
      updated[index] = calculateEquipmentRow(updated[index], sharePerc);
    }
    return { ...prev, equipmentList: updated };
  });
};

// const handleSingleBlockChange = (block, e) => {
//   const { name, value } = e.target;

//   setChawkiData((prev) => ({
//     ...prev,
//     [block]: {
//       ...prev[block],
//       [name]: value
//     }
//   }));
// };
const handleSingleBlockChange = (block, e) => {
  const { name, value } = e.target;
  const sharePerc = sharePercentage;

  setChawkiData((prev) => {
    const updatedBlock = {
      ...prev[block],
      [name]: value
    };

    // 🔥 Auto-calculate percentage only when claimed value changes
    if (name === "claimed") {
      const claimedVal = Number(value || 0);
      const eligibleVal = Number(prev[block].eligible || 0);

      let subsidy = 0;

      if (claimedVal >= eligibleVal) {
        subsidy = (eligibleVal * sharePerc) / 100;
      } else {
        subsidy = (claimedVal * sharePerc) / 100;
      }

      updatedBlock.percentage = subsidy;
    }

    return {
      ...prev,
      [block]: updatedBlock
    };
  });
};

// const calculateTotals = (data) => {
//   const equipmentEligibleTotal = data.equipmentList
//     .filter(item => item.selected)
//     .reduce((sum, item) => sum + Number(item.eligibleTotalValueInRs || 0), 0);

//   const equipmentPurchasedTotal = data.equipmentList
//     .filter(item => item.selected)
//     .reduce((sum, item) => sum + Number(item.purchasedTotalValueInRs || 0), 0);

//   const equipmentPercentageTotal = data.equipmentList
//     .filter(item => item.selected)
//     .reduce((sum, item) => sum + Number(item.percentageOfSubsidyAmount || 0), 0);

//   const mulberry = Number(data.mulberry.percentage || 0);
//   const drip = Number(data.drip.percentage || 0);
//   const building = Number(data.building.percentage || 0);

//   const totalClaimed =
//     Number(data.mulberry.claimed || 0) +
//     Number(data.drip.claimed || 0) +
//     Number(data.building.claimed || 0) +
//     equipmentPurchasedTotal;

//   const totalEligible =
//     Number(data.mulberry.eligible || 0) +
//     Number(data.drip.eligible || 0) +
//     Number(data.building.eligible || 0) +
//     equipmentEligibleTotal;

//   const totalSubsidy =
//     mulberry + drip + building + equipmentPercentageTotal;

//   return {
//     equipmentEligibleTotal,
//     equipmentPurchasedTotal,
//     equipmentPercentageTotal,
//     totalClaimed,
//     totalEligible,
//     totalSubsidy
//   };
// };

const calculateTotals = (data) => {
  const equipmentEligibleTotal = Math.round(
    data.equipmentList
      .filter(item => item.selected)
      .reduce((sum, item) => sum + Number(item.eligibleTotalValueInRs || 0), 0)
  );

  const equipmentMaxSubsidyTotal = Math.round(
    data.equipmentList
      .filter(item => item.selected)
      .reduce((sum, item) => sum + Number(item.maxAmountOfSubsidyEligible || 0), 0)
  );

  const equipmentPurchasedTotal = Math.round(
    data.equipmentList
      .filter(item => item.selected)
      .reduce((sum, item) => sum + Number(item.purchasedTotalValueInRs || 0), 0)
  );

  const equipmentPercentageTotal = Math.round(
    data.equipmentList
      .filter(item => item.selected)
      .reduce((sum, item) => sum + Number(item.percentageOfSubsidyAmount || 0), 0)
  );

  const mulberry = Number(data.mulberry.percentage || 0);
  const drip = Number(data.drip.percentage || 0);
  const building = Number(data.building.percentage || 0);

  const totalMaxSubsidy = Math.round(
    Number(data.mulberry.eligible || 0) +
    Number(data.drip.eligible || 0) +
    Number(data.building.eligible || 0) +
    equipmentMaxSubsidyTotal
  );

  const totalClaimed = Math.round(
    Number(data.mulberry.claimed || 0) +
    Number(data.drip.claimed || 0) +
    Number(data.building.claimed || 0) +
    equipmentPurchasedTotal
  );

  const totalEligible = Math.round(
    Number(data.mulberry.eligible || 0) +
    Number(data.drip.eligible || 0) +
    Number(data.building.eligible || 0) +
    equipmentEligibleTotal
  );

  const totalSubsidy = Math.round(
    mulberry + drip + building + equipmentPercentageTotal
  );

  return {
    equipmentEligibleTotal,
    equipmentPurchasedTotal,
    equipmentPercentageTotal,
    equipmentMaxSubsidyTotal,
    totalMaxSubsidy,
    totalClaimed,
    totalEligible,
    totalSubsidy
  };
};






  const postData = (event) => {
    event.preventDefault(); // Prevent the default form submission
    const form = event.currentTarget;

    // Validate the form
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return; // Exit if the form is not valid
    }

    const formattedDates = {
      periodFrom: formatDate(data.periodFrom),
      periodTo: formatDate(data.periodTo),
      transactionDate: formatDate(data.transactionDate),
    };

    const transformedData = Object.keys(developedArea).map((id) => ({
      ...developedArea[id],
    }));

    const chawkiSanctionOrderList = chawkiData.equipmentList
  .filter(e => e.selected)
  .map(e => ({
    rearingEquipmentDetailsId: e.rearingEquipmentDetailsId,

    eligibleEquipmentInNos: e.eligibleEquipmentInNos,
    eligibleTotalValueInRs: e.eligibleTotalValueInRs,
    ratePerEligibleEquipment: e.ratePerEligibleEquipment,
    eligibleAmount: e.eligibleAmount,
    maxAmountOfSubsidyEligible: e.maxAmountOfSubsidyEligible,

    purchasedEquipmentInNos: Number(e.purchasedEquipmentInNos || 0),
    purchasedTotalValueInRs: Number(e.purchasedTotalValueInRs || 0),
    percentageOfSubsidyAmount: Number(e.percentageOfSubsidyAmount || 0),

    establishmentOfMulberryGardenEligibleAmount: chawkiData.mulberry.eligible,
    establishmentOfMulberryGardenClaimedAmount: Number(chawkiData.mulberry.claimed || 0),
    establishmentOfMulberryGardenPercentageOfSubsidyAmount: Number(chawkiData.mulberry.percentage || 0),

    installationOfDripIrrigationEligibleAmount: chawkiData.drip.eligible,
    installationOfDripIrrigationClaimedAmount: Number(chawkiData.drip.claimed || 0),
    installationOfDripIrrigationPercentageOfSubsidyAmount: Number(chawkiData.drip.percentage || 0),

    chawkiRearingBuildingEligibleAmount: chawkiData.building.eligible,
    chawkiRearingBuildingClaimedAmount: Number(chawkiData.building.claimed || 0),
    chawkiRearingBuildingPercentageOfSubsidyAmount: Number(chawkiData.building.percentage || 0)
  }));

  const totals = calculateTotals(chawkiData);


    const sendPost = {
      
      approvalStageId: data.approvalStageId,
      userMasterId: data.userId,
      farmerId: data.farmerId,
      fruitsId: data.fruitsId,
      payToVendor: equipment.payToVendor,
      headOfAccountId: data.scHeadAccountId,
      schemeId: data.scSchemeDetailsId,
      subSchemeId: data.scSubSchemeDetailsId,
      categoryId: data.scCategoryId,
      landDetailId: landDetailsIds[0],
      talukId: landData.talukId,
      newFarmer: true,
      componentId: data.scComponentId,
      financialYearMasterId: data.financialYearMasterId,
      devAcre: 0,
      devGunta: 0,
      devFGunta: 0,
      schemeAmount: data.schemeAmount,
      sanctionNumber: data.sanctionNumber,
      initialAmount: data.expectedAmount,
      // periodFrom: data.periodFrom,
      // periodTo: data.periodTo,
      vendorId: equipment.vendorId,
      spacingId: data.spacingId,
      hectareId: data.hectareId,
      cocoonsWeight: data.cocoonsWeight,
      lotNo: data.lotNo,
      lotWeight: data.lotWeight,
      kaneshDistrictId: data.kaneshDistrictId,
      kaneshTalukId: data.kaneshTalukId,
      kaneshVillageId: data.kaneshVillageId,
      kaneshNo: data.kaneshNo,
      panchayatName: data.panchayatName,
      sqft: data.sqft,
      east: data.east,
      west: data.west,
      north: data.north,
      south: data.south,
      // transactionDate: data.transactionDate,
      periodFrom: formattedDates.periodFrom,
      periodTo: formattedDates.periodTo,
      transactionDate: formattedDates.transactionDate,
      availBonus: data.availBonus,
      description: equipment.description,
      loggedInUserId: localStorage.getItem("userMasterId"),
      month: data.month,
      machineQuantity: data.machineQuantity,
      machineTypeId: data.machineTypeId,
      imcbTable: data.imcbTable,
      icbBasinEnds: data.icbBasinEnds,
      reelingUnit: data.reelingUnit,
      reelingSqft: data.reelingSqft,
      landDeveloped: developedLand.landDeveloped,
      unitType: developedLand.unitType,
      extentOfMulberry: developedLand.extentOfMulberry,
      rhSqft: developedLand.rhSqft,
      estimatedCost: developedLand.estimatedCost,
      roofTypeId: developedLand.roofTypeId,
      raceId:data.raceId,
      renditta:data.renditta,
      silkTable: data.silkTable,
      noOfCocoonsNeedToProduce:data.noOfCocoonsNeedToProduce,
      noOfRawSilkProduced:data.noOfRawSilkProduced,
      silkExchangeId: data.silkExchangeId,
      form17JNo: data.form17JNo,
      dailyLimit: data.dailyLimit,
      boilerInKg: data.boilerInKg,
      sanctionNo: data.sanctionNo,
      marketId: data.marketId,
      taxInvoiceNo: data.taxInvoiceNo,
      taxInvoiceDate: data.taxInvoiceDate,
      rearingEquipmentDetailsId: data.rearingEquipmentDetailsId,
      beneficiaryShareAmount: data.beneficiaryShareAmount,
      unitPrice:amountValue.unitPrice,
      equipmentEligibleTotal: totals.equipmentEligibleTotal,
      equipmentMaxSubsidyTotal: totals.equipmentMaxSubsidyTotal,
    equipmentPurchasedTotal: totals.equipmentPurchasedTotal,
    equipmentPercentageTotal: totals.equipmentPercentageTotal,
    totalClaimed: totals.totalClaimed,
    totalEligible: totals.totalEligible,
    totalSubsidy: totals.totalSubsidy,

      chawkiSanctionOrderList: chawkiSanctionOrderList
    };

    // Check what checkboxes are selected and build the request accordingly
    if (data.equordev.includes("land")) {
      sendPost.dbtFarmerLandDetailsRequestList = transformedData; // Include land details
    }
    if (data.equordev.includes("equipment")) {
      sendPost.applicationFormLineItemRequestList = [
        {
          lineItemComment: equipment.description,
          cost: equipment.price,
          vendorId: equipment.vendorId,
        },
      ];
    }
    // if (data.equordev.includes("constructedArea")) {
    //     // Handle constructedArea data if needed
    // }

    // Check the fruitsId length constraint
    if (data.fruitsId.length !== 16) {
      return;
    }

    setSaveDisabled(true);
    uploadFileConfirm(sendPost);
  };

  const [amountValue, setAmountValue] = useState({
    maxAmount: "",
    minAmount: "",
    unitPrice: "",
    fullPrice: false,
  });

  useEffect(() => {
    if (
      data.scSchemeDetailsId &&
      data.scSubSchemeDetailsId &&
      data.scComponentId &&
      data.scHeadAccountId
    ) {
      if (data.scCategoryId) {
        api
          .post(baseURLDBT + `master/cost/check-min-max-validation`, {
            headOfAccountId: data.scHeadAccountId,
            schemeId: data.scSchemeDetailsId,
            subSchemeId: data.scSubSchemeDetailsId,
            categoryId: data.scCategoryId,
            scComponentId: data.scComponentId,

            // headOfAccountId: 53,
            // schemeId: 20,
            // subSchemeId: 56,
            // categoryId: 11,
          })
          .then((response) => {
            // if (response.data.content.unitCost) {
            //   setScHeadAccountListData(response.data.content.unitCost);
            // }
            // console.log(response);
            setAmountValue((prev) => ({
              ...prev,
              maxAmount: response.data.content.unitCostMaster[0].maxAmount,
              minAmount: response.data.content.unitCostMaster[0].minAmount,
              unitPrice:
                response.data.content.unitCostMaster[0].unitCostInRupees,
              fullPrice: response.data.content.unitCostMaster[0].fullPrice,
              // fullPrice: true,
            }));
          })
          .catch((err) => {
            // setScHeadAccountListData([]);
            // alert(err.response.data.errorMessages[0].message[0].message);
          });
      } else {
        api
          .post(baseURLDBT + `master/cost/check-min-max-validation`, {
            headOfAccountId: data.scHeadAccountId,
            schemeId: data.scSchemeDetailsId,
            subSchemeId: data.scSubSchemeDetailsId,

            // headOfAccountId: 53,
            // schemeId: 20,
            // subSchemeId: 56,
          })
          .then((response) => {
            // if (response.data.content.unitCost) {
            //   setScHeadAccountListData(response.data.content.unitCost);
            // }
            console.log(response);
            setAmountValue((prev) => ({
              ...prev,
              maxAmount: response.data.content.unitCostMaster[0].maxAmount,
              minAmount: response.data.content.unitCostMaster[0].minAmount,
            }));
          })
          .catch((err) => {
            // setScHeadAccountListData([]);
            // alert(err.response.data.errorMessages[0].message[0].message);
          });
      }
    }
  }, [
    data.scSchemeDetailsId,
    data.scSubSchemeDetailsId,
    data.scComponentId,
    data.scCategoryId,
    data.scHeadAccountId,
  ]);

  console.log(amountValue);

  const generateAcknowledgment = async (applicationFormId,schemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getAcknowledementPMKSY`,
        {
          applicationFormId: applicationFormId,
          schemeId: schemeId,
        },
        {
          responseType: "blob", //Force to receive data in a Blob Format
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      // console.log("error", error);
    }
  };

  const generateAcknowledgmentRH = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getBlankSample`,
        {
          applicationFormId: applicationFormId,
          schemeId: schemeId,
          subSchemeId: subSchemeId,
        },
        {
          responseType: "blob", //Force to receive data in a Blob Format
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      // console.log("error", error);
    }
  };

  const generateAcknowledgmentReelingShed = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getReelerAcknowledgement`,
        {
          applicationFormId: applicationFormId,
          schemeId: schemeId,
          subSchemeId: subSchemeId,
        },
        {
          responseType: "blob", //Force to receive data in a Blob Format
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      // console.log("error", error);
    }
  };

  const generateAcknowledgmentHRU = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getReelerAcknowledgementHRU`,
        {
          applicationFormId: applicationFormId,
          schemeId: schemeId,
          subSchemeId: subSchemeId,
        },
        {
          responseType: "blob", //Force to receive data in a Blob Format
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      // console.log("error", error);
    }
  };

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

  const clear = () => {
    setData({
      with: "withLand",
      subinc: "subsidy",
      // equordev: ["land","equipment"],enable this for other scheme later
      equordev: ["land"],
      scSchemeDetailsId: "",
      fruitsId: "",
      scSubSchemeDetailsId: "",
      scHeadAccountId: "",
      scCategoryId: "",
      scComponentId: "",
      scVendorId: "",
      farmerId: "",
      approvalStageId: "",
      userId: "",
      spacingId: "",
      hectareId: "",
      expectedAmount: "",
      financialYearMasterId: "",
      periodFrom: new Date("2025-04-01"),
      periodTo: new Date("2026-03-31"),
      cocoonsWeight:"",
      availBonus:"",
      // availBonus: true,
      lotWeight:"",
      lotNo:"",
      transactionDate:"",
      kaneshDistrictId: "",
      kaneshTalukId: "",
      kaneshVillageId: "",
      kaneshNo: "",
      panchayatName: "",
      sqft: "",
      east: "",
      west: "",
      north: "",
      south: "",
      kaneshHobliId: "",
      addKaneshLand :"no",
      month: "",
      machineQuantity: "",
      machineTypeId: "",
      imcbTable: "",
      icbBasinEnds: "",
      reelingSqft: "",
      reelingUnit: "",
      raceId:"",
      renditta:"",
      silkTable: "",
      noOfCocoonsNeedToProduce:"",
      noOfRawSilkProduced:"",
      silkExchangeId:"",
      form17JNo: "",
      dailyLimit: "",
      boilerInKg: "",
      sanctionNo: ""
    });
    setDevelopedLand({
      landDeveloped: "",
      unitType: "",
      extentOfMulberry:"",
      rhSqft:"",
      estimatedCost:"",
      roofTypeId:"",
      proposalDate:"",
    });
    setEquipment({
      unitType: "",
      description: "",
      price: "",
      vendorId: "",
      payToVendor: false,
    });
    setAmountValue({
      maxAmount: "",
      minAmount: "",
      unitPrice: "",
      fullPrice: false,
    })
    setDocumentAttachments({});
    setValidated(false);
    setLandDetailsList([]);
    setShowFarmerDetails(false);
    setShowReelerDetails(false);
    // setDisabled(false);
  };

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: `Generated ARN Number is ${arnNumber}`,
    }).then(() => {
    // Refresh entire page AFTER clicking OK
    window.location.reload();
  });
    // clear();
  };

  const uploadFileConfirm = (post) => {
  Swal.fire({
    title: "Do you want to Upload the Documents?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Later",
  }).then((result) => {
    // ✅ Decide the correct API endpoint based on sanctionForReeling
    const apiEndpoint = isSanctionForReeling
      ? `${baseURLDBT}service/saveApplicationFormForReeler`
      : `${baseURLDBT}service/saveApplicationForm`;

    const handleResponse = (response, showModal = false) => {
      if (response.data.errorCode === -1) {
        saveError(response.data.errorMessages[0]);
        setSaveDisabled(false);
      } else if (response.data && response.data.error) {
        saveError(response.data.error_description);
        setSaveDisabled(false);
      } else {
        if (!showModal) saveSuccess();
        setApplicationId(response.data.content.applicationDocumentId);
        setSchemeId(response.data.content.schemeId);
        clear();
        // window.location.reload();
        setSaveDisabled(false);

        // ✅ Acknowledgment logic remains same
        callAcknowledgmentFunction(
          getIncentiveAndBonusData[0]?.acknowledgementForScheme,
          response.data.content.applicationDocumentId,
          response.data.content.schemeId,
          response.data.content.subSchemeId
        );

        if (showModal) handleShowModal();
        setValidated(false);
      }
    };

    // ✅ Case 1: User clicked "Yes" → Upload + Show Modal
    if (result.value) {
      api
        .post(apiEndpoint, post)
        .then((response) => handleResponse(response, true))
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
          setSaveDisabled(false);
        });
      setValidated(true);

    // ✅ Case 2: User clicked "Later" → Just save, no modal
    } else {
      api
        .post(apiEndpoint, post)
        .then((response) => handleResponse(response, false))
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
          setSaveDisabled(false);
        });
      setValidated(true);
    }
  });
};


  // const uploadFileConfirm = (post) => {
  //   Swal.fire({
  //     title: "Do you want to Upload the Documents?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes",
  //     cancelButtonText: "Later",
  //   }).then((result) => {
  //     if (result.value) {
  //       api
  //         .post(baseURLDBT + `service/saveApplicationForm`, post)
  //         .then((response) => {
  //           if (response.data.errorCode === -1) {
  //             saveError(response.data.errorMessages[0]);
  //             setSaveDisabled(false);
  //           } else if (response.data && response.data.error) {
  //             saveError(response.data.error_description);
  //             setSaveDisabled(false);
  //           } else {
  //             setApplicationId(response.data.content.applicationDocumentId);
  //             setSchemeId(response.data.content.schemeId);
  //             clear();
  //             setSaveDisabled(false);
  
  //             // Call the appropriate acknowledgment function
  //             callAcknowledgmentFunction(
  //               schemeDetails.acknowledgementForScheme,
  //               response.data.content.applicationDocumentId,
  //               response.data.content.schemeId
  //             );
  
  //             handleShowModal();
  //             setValidated(false);
  //           }
  //         })
  //         .catch((err) => {
  //           if (
  //             err.response &&
  //             err.response.data &&
  //             err.response.data.validationErrors
  //           ) {
  //             if (Object.keys(err.response.data.validationErrors).length > 0) {
  //               saveError(err.response.data.validationErrors);
  //             }
  //           }
  //           setSaveDisabled(false);
  //         });
  //       setValidated(true);
  //     } else {
  //       console.log(result.value);
  //       api
  //         .post(baseURLDBT + `service/saveApplicationForm`, post)
  //         .then((response) => {
  //           if (response.data.errorCode === -1) {
  //             saveError(response.data.errorMessages[0]);
  //             setSaveDisabled(false);
  //           } else if (response.data && response.data.error) {
  //             saveError(response.data.error_description);
  //             setSaveDisabled(false);
  //           } else {
  //             saveSuccess();
  //             setApplicationId(response.data.content.applicationDocumentId);
  //             setSchemeId(response.data.content.schemeId);
  //             clear();
  //             setSaveDisabled(false);
  
  //             // Call the appropriate acknowledgment function
  //             callAcknowledgmentFunction(
  //               schemeDetails.acknowledgementForScheme,
  //               response.data.content.applicationDocumentId,
  //               response.data.content.schemeId
  //             );
  
  //             setValidated(false);
  //           }
  //         })
  //         .catch((err) => {
  //           if (
  //             err.response &&
  //             err.response.data &&
  //             err.response.data.validationErrors
  //           ) {
  //             if (Object.keys(err.response.data.validationErrors).length > 0) {
  //               saveError(err.response.data.validationErrors);
  //             }
  //           }
  //           setSaveDisabled(false);
  //         });
  //       setValidated(true);
  //     }
  //   });
  // };
  
 // Function to decide which acknowledgment method to call
//  const callAcknowledgmentFunction = (acknowledgementForScheme, applicationFormId, schemeId) => {
//   if (acknowledgementForScheme === "Silk Samagra State" || acknowledgementForScheme === "Silk Samagra Central") {
//     generateAcknowledgmentRH(applicationFormId, schemeId);
//   } else if (acknowledgementForScheme === "PDMC" || acknowledgementForScheme === "PMKSY") {
//     generateAcknowledgment(applicationFormId, schemeId);
//   }
// };

const callAcknowledgmentFunction = (acknowledgementForScheme, applicationFormId, schemeId,subSchemeId) => {
  if (
    acknowledgementForScheme === "Silk Samagra State" || 
    acknowledgementForScheme === "Silk Samagra Central"
  ) {
    generateAcknowledgmentRH(applicationFormId, schemeId,subSchemeId);

  } else if (
    acknowledgementForScheme === "PDMC" || 
    acknowledgementForScheme === "PMKSY"
  ) {
    generateAcknowledgment(applicationFormId, schemeId);

  } else if (
    acknowledgementForScheme === "Reeling Shed-PSF" ||
    acknowledgementForScheme === "Silk Incentive-PSF"
  ) {
    generateAcknowledgmentReelingShed(applicationFormId, schemeId,subSchemeId);

  } else if (acknowledgementForScheme === "Adopting Heat Recovery Unit-PSF") {
    generateAcknowledgmentHRU(applicationFormId, schemeId,subSchemeId);
  }
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

  const [landData, setLandData] = useState({
    landId: "",
    talukId: "",
  });

  const handleRadioChange = (_id) => {
    // if (!tId) {
    //   tId = 0;
    // }
    setLandData((prev) => ({ ...prev, landId: _id }));
  };

  const [validated, setValidated] = useState(false);
  const [searchValidated, setSearchValidated] = useState(false);
  const [listLogsData, setListLogsData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const [disable, setDisable] = useState(false);

//   const search = (event) => {
//     const form = event.currentTarget;
//     if (form.checkValidity() === false) {
//       event.preventDefault();
//       event.stopPropagation();
//       setSearchValidated(true);
//     } else {
//       event.preventDefault();
//       if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
//         return;
//       } else {
//         setDisable(true);
//       }
      

//       api
//         .post(baseURLFarmerServer + `farmer/get-details-by-fruits-id`, {
//           fruitsId: data.fruitsId,
//         })
//         .then((response) => {
  
//   if (response.data.errorCode === -1) {
//     saveError(response.data.errorMessages[0]);
//   } else if (response.data.content && response.data.content.error) {
//     saveError(response.data.content.error_description);
//   } else if (response.data.content.farmerResponse) {

//      // ✅ Reset old selections before setting new data
//       setLandDetailsIds([]);
//       setDevelopedArea({});
//       setLandDetailsList([]);

//     setData((prev) => ({
//       ...prev,
//       farmerId: response.data.content.farmerResponse.farmerId,
//     }));
//     setFarmerDetails((prev) => ({
//       ...prev,
//       farmerName: response.data.content.farmerResponse.firstName,
//     }));
    
//     if (response.data.content.farmerAddressDTOList.length > 0) {
//       setFarmerDetails((prev) => ({
//         ...prev,
//         address: response.data.content.farmerAddressDTOList[0].addressText,
//       }));
//     }
//     setShowFarmerDetails(true);

//     if (response.data.content.farmerLandDetailsDTOList.length > 0) {
//       setLandDetailsList(response.data.content.farmerLandDetailsDTOList);
//     }
//   }
// })
// .catch((err) => {
//   saveError("An error occurred while fetching farmer details.");
//   setLandDetailsIds([]);     // ✅ also clear on error
//   setDevelopedArea({});
//   setLandDetailsList([]);
// });
// }
// };

const [showReelerDetails, setShowReelerDetails] = useState(false);
const [reelerDetails, setReelerDetails] = useState({});


const search = (event) => {
  const form = event.currentTarget;
  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    setSearchValidated(true);
    return;
  }

  event.preventDefault();

  if (data.fruitsId.length !== 16) {
    return;
  }

  setDisable(true);

  // Step 1: Try fetching Farmer Details first
  api
    .post(baseURLFarmerServer + `farmer/get-details-by-fruits-id`, {
      fruitsId: data.fruitsId,
    })
    .then((response) => {
      if (
        response.data &&
        response.data.content &&
        response.data.content.farmerResponse
      ) {
        // ✅ Farmer details found
        const farmerData = response.data.content.farmerResponse;
        const addressList = response.data.content.farmerAddressDTOList || [];
        const landDetails = response.data.content.farmerLandDetailsDTOList || [];

        // Reset previous selections
        setLandDetailsIds([]);
        setDevelopedArea({});
        setLandDetailsList([]);

        // Set farmer data
        setData((prev) => ({
          ...prev,
          farmerId: farmerData.farmerId,
        }));

        setFarmerDetails({
          farmerName: farmerData.firstName,
          address: addressList.length ? addressList[0].addressText : "",
        });

        setLandDetailsList(landDetails);
        setShowFarmerDetails(true);
        setShowReelerDetails(false); // hide reeler section if farmer found
      } else {
        // ✅ If farmer not found, try fetching reeler details
        fetchReelerDetails();
      }
    })
    .catch((err) => {
      console.error("Farmer API error:", err);
      // If farmer API fails, try reeler as fallback
      fetchReelerDetails();
    });
};

const fetchReelerDetails = () => { 
  api
    .post(baseURLFarmerServer + `reeler/get-reeler-details-by-fruits-id`, {
      fruitsId: data.fruitsId,
    })
    .then((response) => {
      const reeler = response.data?.content?.reelerResponse;

      if (reeler) {
        // Directly use 'reelerResponse.address' since it's available
        const reelerAddress = reeler.address || "";

        // ✅ Update data state with correct keys
        setData((prev) => ({
          ...prev,
          reelerId: reeler.reelerId,
          reelerName: reeler.reelerName,
          fatherName: reeler.fatherName,
          gender: reeler.gender,
          casteId: reeler.casteId,
          address: reelerAddress,
        }));

        // ✅ Set reeler details for UI
        setReelerDetails({
          reelerName: reeler.reelerName,
          address: reelerAddress,
          reelingLicenseNumber: reeler.reelingLicenseNumber,
          reelerNumber: reeler.reelerNumber,
          mobileNumber: reeler.mobileNumber,
        });

        // ✅ Show reeler section
        setShowReelerDetails(true);
        setShowFarmerDetails(false);
      } else {
        saveError("No farmer or reeler details found for this Fruits ID.");
      }
    })
    .catch((error) => {
      console.error("Reeler API error:", error);
      saveError("An error occurred while fetching reeler details.");
    });
};




  const LandDetailsColumns = [
    {
      name: "Select",
      selector: "select",
      cell: (row) => (
        <input
          type="radio"
          name="selectedLand"
          value={row.farmerLandDetailsId}
          // checked={selectedLandId === row.id}
          onChange={() => handleRadioChange(row.farmerLandDetailsId)}
        />
      ),
      // ignoreRowClick: true,
      // allowOverflow: true,
      button: true,
    },
    {
      name: t("district"),
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("taluk"),
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("hobli"),
      selector: (row) => row.hobliName,
      cell: (row) => <span>{row.hobliName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("select_village"),
      selector: (row) => row.villageName,
      cell: (row) => <span>{row.villageName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("survey_noc"),
      selector: (row) => row.surveyNumber,
      cell: (row) => <span>{row.surveyNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("owner_name"),
      selector: (row) => row.ownerName,
      cell: (row) => <span>{row.ownerName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Acre"),
      selector: (row) => row.acre,
      // cell: (row) => (
      //   <Form.Control
      //     // id="farmerName"
      //     // name="farmerName"
      //     type="text"
      //     value={row.acre}
      //     // onChange={handleInputs}
      //     placeholder="Edit Acre"
      //   />
      // ),
      cell: (row) => <span>{row.acre}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Gunta"),
      selector: (row) => row.gunta,
      // cell: (row) => (
      //   <Form.Control
      //     // id="farmerName"
      //     // name="farmerName"
      //     type="text"
      //     value={row.gunta}
      //     // onChange={handleInputs}
      //     placeholder="Edit Gunta"
      //   />
      // ),
      cell: (row) => <span>{row.gunta}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("FGunta"),
      selector: (row) => row.fgunta,
      // cell: (row) => (
      //   <Form.Control
      //     // id="farmerName"
      //     // name="farmerName"
      //     type="text"
      //     value={row.fgunta}
      //     // onChange={handleInputs}
      //     placeholder="Edit FGunta"
      //   />
      // ),
      cell: (row) => <span>{row.gunta}</span>,
      sortable: true,
      hide: "md",
    },

    // {
    //   name: "Action",
    //   cell: (row) => (
    //     //   Button style
    //     <div className="text-start w-100">
    //       <Button
    //         variant="primary"
    //         size="sm"
    //         className="ms-2"
    //         onClick={setIsDisabled(false)}
    //       >
    //         Update
    //       </Button>
    //     </div>
    //   ),
    //   // cell: (row) => <span>{row.gunta}</span>,
    //   sortable: false,
    //   hide: "md",
    // },
  ];

  const LandDetailsForDevColumns = [
    {
      name: "Select",
      selector: "select",
      cell: (row, i) => (
        <input
          type="checkbox"
          name="selectedLand"
          value={i}
          checked={landDetailsIds.includes(i)}
          onChange={() => handleCheckboxChange(i, row)}
        />
      ),
      // ignoreRowClick: true,
      // allowOverflow: true,
      button: true,
    },
    {
      name: t("district"),
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("taluk"),
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("hobli"),
      selector: (row) => row.hobliName,
      cell: (row) => <span>{row.hobliName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("village"),
      selector: (row) => row.villageName,
      cell: (row) => <span>{row.villageName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("survey_number"),
      selector: (row) => row.surveyNumber,
      cell: (row) => <span>{row.surveyNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("owner_name"),
      selector: (row) => row.ownerName,
      cell: (row) => <span>{row.ownerName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Acre"),
      selector: (row) => row.acre,
      // cell: (row) => (
      //   <Form.Control
      //     // id="farmerName"
      //     // name="farmerName"
      //     type="text"
      //     value={row.acre}
      //     // onChange={handleInputs}
      //     placeholder="Edit Acre"
      //   />
      // ),
      cell: (row) => <span>{row.acre}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Gunta"),
      selector: (row) => row.gunta,
      // cell: (row) => (
      //   <Form.Control
      //     // id="farmerName"
      //     // name="farmerName"
      //     type="text"
      //     value={row.gunta}
      //     // onChange={handleInputs}
      //     placeholder="Edit Gunta"
      //   />
      // ),
      cell: (row) => <span>{row.gunta}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("FGunta"),
      selector: (row) => row.fgunta,
      // cell: (row) => (
      //   <Form.Control
      //     // id="farmerName"
      //     // name="farmerName"
      //     type="text"
      //     value={row.fgunta}
      //     // onChange={handleInputs}
      //     placeholder="Edit FGunta"
      //   />
      // ),
      cell: (row) => <span>{row.fgunta}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Developed Area (Acre/Gunta/FGunta)",
      // selector: (row,id) => console.log("rowDetails",id),
      cell: (row, i) => (
        <>
          {/* {console.log("dada marre",i)} */}
          <Form.Control
            name="devAcre"
            type="text"
            value={developedArea[i]?.devAcre || ""}
            onChange={(e) => handleInlineDevelopedLandChange(e, i)}
            placeholder="Acre"
            className="m-1"
          />
          <Form.Control
            name="devGunta"
            type="text"
            value={developedArea[i]?.devGunta || ""}
            onChange={(e) => handleInlineDevelopedLandChange(e, i)}
            placeholder="Gunta"
            className="m-1"
          />
          <Form.Control
            name="devFGunta"
            type="text"
            value={developedArea[i]?.devFGunta || ""}
            onChange={(e) => handleInlineDevelopedLandChange(e, i)}
            placeholder="FGunta"
            className="m-1"
          />
        </>
      ),
      // cell: (row) => <span>{row.acre}</span>,
      sortable: true,
      hide: "md",
      grow: 3,
    },
  ];

  createTheme(
    "solarized",
    {
      text: {
        primary: "#004b8e",
        secondary: "#2aa198",
      },
      background: {
        default: "#fff",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#d3d3d3",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.02)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "light"
  );

  const customStyles = {
    rows: {
      style: {
        minHeight: "45px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        fontSize: "14px",
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

  // Display Image
  const [documentAttachments, setDocumentAttachments] = useState({});
  const handleAttachFileChange = (e, documentId) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setDocumentAttachments((prevState) => ({
        ...prevState,
        [documentId]: file,
      }));
    } else {
      setDocumentAttachments((prevState) => ({
        ...prevState,
        [documentId]: null,
      }));
      // setData((prev) => ({ ...prev, hdAttachFiles: "" }));
      // document.getElementById("hdAttachFiles").value = "";
    }
    // setPhotoFile(file);
  };

  console.log("showdevplease", developedArea);

  const handleRemoveImage = (documentId) => {
    const updatedDocument = { ...documentAttachments };
    delete updatedDocument[documentId];
    setDocumentAttachments(updatedDocument);
    document.getElementById(`attImage${documentId}`).value = "";
    // setData((prev) => ({ ...prev, hdAttachFiles: "" }));
  };

  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const [uploadStatus, setUploadStatus] = useState({});

  const handleAttachFileUpload = async (documentId) => {
    const param = {
      // applicationFormId: applicationId,
      applicationFormId: applicationId,
      documentTypeId: documentId,
    };

    try {
      const formData = new FormData();
      // formData.append("multipartFile", documentAttachments[documentId]);
      formData.append("multipartFile", document);

      const response = await api.post(
        baseURLDBT + `service/uploadDocument`,
        formData,
        {
          params: param,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("File upload response:", response.data);

      // Show SweetAlert success message after successful upload
      // SweetAlert success function
      Swal.fire({
        icon: "success",
        title: "File uploaded successfully",
      });

      // setIsUploaded(true);
      // Update the upload status for this specific document
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [documentId]: true, // Mark this document as uploaded
      }));
      // Add the uploaded document to the list of uploaded documents
      //  setUploadedDocuments((prevDocs) => [
      //   ...prevDocs,
      //   {
      //     documentId,
      //     documentName: document.name,
      //   },
      // ]);
      // Modify the setUploadedDocuments to include documentMasterName
      setUploadedDocuments((prevDocs) => [
        ...prevDocs,
        {
          documentId,
          documentName: document.name,
          documentMasterName: docListData.find(
            (list) => list.documentMasterId == documentId
          )?.documentMasterName, // Find and store the documentMasterName
          documentFile: document, // Store the file itself for image preview
        },
      ]);
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error uploading file. Please try again.",
      });
    }
  };

  const [uploadDocuments, setUploadDocuments] = useState({
    applicationFormId: "",
    documentTypeId: "",
    documentPath: "",
  });

  const handleDocumentInputs = (e) => {
    let { name, value } = e.target;
    // setUploadDocuments({ ...uploadDocuments, [name]: value });
    setUploadDocuments((prev) => ({ ...prev, [name]: value }));
  };

  //Display Document
  const [document, setDocument] = useState("");

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    setDocument(file);
    setUploadDocuments((prev) => ({ ...prev, documentPath: file?.name }));
    //  setPhotoFile(file);
  };

  // const handleCheckbox = (e) => {
  //   const { value, checked } = e.target;

  //   if (checked) {
  //     setData((prevData) => ({
  //       ...prevData,
  //       equordev: [...prevData.equordev, value],
  //     }));
  //   } else {
  //     setData((prevData) => ({
  //       ...prevData,
  //       equordev: prevData.equordev.filter((item) => item !== value),
  //     }));
  //   }
  // };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      // Add the selected option to the array
      setData((prevData) => ({
        ...prevData,
        equordev: [...prevData.equordev, value],
      }));
    } else {
      // Remove the unchecked option from the array
      setData((prevData) => ({
        ...prevData,
        equordev: prevData.equordev.filter((item) => item !== value),
      }));
    }
  };

  // const handleBonusCheckBox = (e) => {
  //   const { name, checked } = e.target; // Get the name and checked state from the event
  //   setData((prev) => ({
  //     ...prev,
  //     [name]: checked, // Dynamically update the correct field based on the checkbox name
  //   }));
  // };
  const handleBonusCheckBox = (event) => {
    setData((prevData) => ({
      ...prevData,
      availBonus: event.target.checked,
    })); 
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
    <Layout title="Scheme Details Form">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Scheme Details Form")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/all-application-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Applications List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/all-application-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Applications List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        {/* <Form action="#"> */}
        {/* <Form noValidate validated={searchValidated} onSubmit={search}> */}
        <Form noValidate validated={searchValidated} onSubmit={search}>
          <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="12">
                  <Form.Group as={Row} className="form-group" controlId="fid">
                    <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                    {t("FRUITS ID")}<span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={4}>
                      <Form.Control
                        type="fruitsId"
                        name="fruitsId"
                        value={data.fruitsId}
                        onChange={handleInputs}
                        placeholder={t("Enter FRUITS ID")}
                        required
                        maxLength="16"
                      />
                      <Form.Control.Feedback type="invalid">
                        Fruits ID Should Contain 16 digits
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={2}>
                      <Button type="submit" variant="primary">
                      {t("search")}
                      </Button>
                    </Col>
                    {/* <Col sm={2}>
                      <Button type="submit" variant="primary" onClick={clear}>
                        Clear
                      </Button>
                    </Col> */}
                  </Form.Group>
                </Col>
              </Row>
              {showFarmerDetails && (
                <Row className="g-gs mt-1">
                  <Col lg="12">
                    <table className="table small table-bordered">
                      <tbody>
                        <tr>
                          <td style={styles.ctstyle}> {t("farmer_name")}</td>
                          <td>{farmerDetails.farmerName}</td>
                          <td style={styles.ctstyle}> {t("address")}</td>
                          <td>{farmerDetails.address}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>
              )}

              {showReelerDetails && (
                <Row className="g-gs mt-1">
                  <Col lg="12">
                    <table className="table small table-bordered">
                      <tbody>
                        <tr>
                          <td style={styles.ctstyle}>{t("Reeler Name")}</td>
                          <td>{reelerDetails.reelerName}</td>
                          <td style={styles.ctstyle}>{t("Address")}</td>
                          <td>{reelerDetails.address}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>
              )}

            </Card.Body>
          </Card>
        </Form>

        
      </Block>
      <Row>
        <Block>
          <Form noValidate validated={validated} onSubmit={postData}>
            <Row className="g-1 ">
              <Col lg={12}>
                <Block className="mt-3">
                  <Card>
                    <Card.Header style={{ fontWeight: "bold" }}>
                      {t("Scheme Details")}
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              {t("Scheme")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scSchemeDetailsId"
                                value={data.scSchemeDetailsId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scSchemeDetailsId === undefined ||
                                  data.scSchemeDetailsId === "0"
                                }
                              >
                                <option value="">{t("Select Scheme Names")}</option>
                                {scSchemeDetailsListData &&
                                  scSchemeDetailsListData.map((list) => (
                                    <option
                                      key={list.scSchemeDetailsId}
                                      value={list.scSchemeDetailsId}
                                    >
                                      {list.schemeName}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Scheme is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        {/* Conditionally Render Spacing Field */}
                        {(schemeDetails.calculationBasedOn === "PDMC" || schemeDetails.calculationBasedOn === "PMKSY") && (
                          <Col lg="6">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="spacing">
                                {t("Spacing")} <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="spacingId"
                                  value={data.spacingId}
                                  onChange={handleInputs}
                                  // required
                                  isInvalid={
                                    data.spacingId === undefined ||
                                    data.spacingId === "0"
                                  }
                                >
                                  <option value="">{t("Select Spacing")}</option>
                                  {spacingListData && spacingListData.length > 0
                                    ? spacingListData.map((list) => (
                                        <option
                                          key={list.spacingId}
                                          value={list.spacingId}
                                        >
                                          {list.spacingName}
                                        </option>
                                      ))
                                    : ""}
                                </Form.Select>
                                {/* <Form.Control.Feedback type="invalid">
                              Spacing is required
                            </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                        )}

                        {/* Conditionally Render Hectare Field */}
                        {(schemeDetails.calculationBasedOn === "PDMC" || schemeDetails.calculationBasedOn === "PMKSY") && (
                          <Col lg="6">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="hectare">
                                {t("Hectare")} <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="hectareId"
                                  value={data.hectareId}
                                  onChange={handleInputs}
                                  // required
                                  isInvalid={
                                    data.hectareId === undefined ||
                                    data.hectareId === "0"
                                  }
                                >
                                  <option value="">{t("Select Hectare")}</option>
                                  {hectareListData && hectareListData.length > 0
                                    ? hectareListData.map((list) => (
                                        <option
                                          key={list.hectareId}
                                          value={list.hectareId}
                                        >
                                          {list.hectareName}
                                        </option>
                                      ))
                                    : ""}
                                </Form.Select>
                                {/* <Form.Control.Feedback type="invalid">
                              Hectare is required
                            </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                        )}

                        

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              {t("Component Type")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scSubSchemeDetailsId"
                                value={data.scSubSchemeDetailsId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scSubSchemeDetailsId === undefined ||
                                  data.scSubSchemeDetailsId === "0"
                                }
                              >
                                <option value="">{t("Select Component Type")}</option>
                                {scSubSchemeDetailsListData &&
                                  scSubSchemeDetailsListData.map((list, i) => (
                                    <option key={i} value={list.subSchemeId}>
                                      {list.subSchemeName}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Component Type is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                         {(getIncentiveAndBonusData[0]?.calculationBasedOn === "Bivoltine Bonus" ||
                            getIncentiveAndBonusData[0]?.calculationBasedOn === "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500") && (
                            <Col lg="6">
                                <Form.Group className="form-group mt-n4">
                                  <Form.Label htmlFor="imcbTable">
                                    {t("Manual/Automatic")} <span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      id="calculationBasedOn"
                                      name="calculationBasedOn"
                                      value={data.calculationBasedOn}
                                      onChange={handleInputs}
                                      required
                                    >
                                      <option value="">{t("Select Manual/Automatic")}</option>
                                      <option value="Manual">Manual</option>
                                      <option value="Automatic">Automatic</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Imcb Table is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>
                          )}

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              {t("Component")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scComponentId"
                                value={data.scComponentId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                // required
                                isInvalid={
                                  data.scComponentId === undefined ||
                                  data.scComponentId === "0"
                                }
                              >
                                <option value="">{t("Select Component")}</option>
                                {scComponentListData &&
                                  scComponentListData.map((list) => (
                                    <option
                                      key={list.scComponentId}
                                      value={list.scComponentId}
                                    >
                                      {list.scComponentName}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Component is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        
                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              {t("Sub Component")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scCategoryId"
                                value={data.scCategoryId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                // required
                                isInvalid={
                                  data.scCategoryId === undefined ||
                                  data.scCategoryId === "0"
                                }
                              >
                                <option value="">{t("Select Sub Component")}</option>
                                {scCategoryListData &&
                                  scCategoryListData.map((list) => (
                                    <option
                                      key={list.scCategoryId}
                                      value={list.scCategoryId}
                                    >
                                      {list.categoryName}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Sub Component is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                         {getIncentiveAndBonusData[0]?.unitForScheme === "Rearing Equipment SS" && (
                            <>

                            <Col lg="6">
                              <Form.Group className="form-group mt-n4">
                                <Form.Label htmlFor="sordfl">{("Rearing Equipment Details")}</Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Select
                                    name="rearingEquipmentDetailsId"
                                    value={data.rearingEquipmentDetailsId}
                                    onChange={handleInputs}
                                    // onBlur={() => handleInputs}
                                    // required
                                    // isInvalid={
                                    //   data.rearingEquipmentDetailsId === undefined ||
                                    //   data.rearingEquipmentDetailsId === "0"
                                    // }
                                  >
                                    <option value="">{t("Select Rearing Equipment Details")}</option>
                                    {rearingEquipmentDetailsData && rearingEquipmentDetailsData.length ?(rearingEquipmentDetailsData.map((list) => (
                                      <option
                                        key={list.subsidyId}
                                        value={list.subsidyId}
                                      >
                                        {list.subsidyName}
                                      </option>
                                    ))):""}
                                  </Form.Select>
                                  {/* <Form.Control.Feedback type="invalid">
                                    {t("Rearing Equipment Details is required")}
                                  </Form.Control.Feedback> */}
                                </div>
                              </Form.Group>
                            </Col>
                            
                            <Col lg="6">
                                <Form.Group className="form-group mt-n3">
                                  <Form.Label htmlFor="schemeAmount">Tax Invoice No</Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="taxInvoiceNo"
                                      type="text"
                                      name="taxInvoiceNo"
                                      value={data.taxInvoiceNo}
                                      onChange={handleInputs}
                                      placeholder="Enter Tax Invoice No"
                                      // required
                                      // readOnly
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              {t("Tax Invoice Date")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.taxInvoiceDate}
                                onChange={(date) =>
                                  handleDateChange(date, "taxInvoiceDate")
                                }
                                // minDate={new Date("01/04/2023")}
                                // maxDate={new Date("31/03/2024")}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                maxDate={new Date()}
                                // readOnly={schemeDetails.calculationBasedOn === "Silk Samagra Central" || 
                                //   schemeDetails.calculationBasedOn === "Silk Samagra State" || 
                                //   !schemeDetails.calculationBasedOn}
                                // readOnly 
                                // required
                              />
                            </div>
                          </Form.Group>
                        </Col>
                              
                            </>
                          )}

                          {(
                          getIncentiveAndBonusData[0]?.unitForScheme === 
                            "Registered Private Bivoltine Chawki Rearing Center Subsidy" ||
                          getIncentiveAndBonusData[0]?.sanctionForReeling
                        ) && (
                          <>
                            <Col lg="6">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label htmlFor="schemeAmount">
                                  Tax Invoice No
                                  {/* <span className="text-danger">*</span> */}
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="taxInvoiceNo"
                                    type="text"
                                    name="taxInvoiceNo"
                                    value={data.taxInvoiceNo}
                                    onChange={handleInputs}
                                    placeholder="Enter Tax Invoice No"
                                    // required
                                  />
                                </div>
                              </Form.Group>
                            </Col>

                            <Col lg="2">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label htmlFor="sordfl">
                                  {t("Tax Invoice Date")}
                                  {/* <span className="text-danger">*</span> */}
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <DatePicker
                                    selected={data.taxInvoiceDate}
                                    onChange={(date) => handleDateChange(date, "taxInvoiceDate")}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    maxDate={new Date()}
                                    // readOnly
                                    // required
                                  />
                                </div>
                              </Form.Group>
                            </Col>
                          </>
                        )}


                        {getIncentiveAndBonusData[0]?.calculationBasedOn === "Silk Incentive-PSF" && (
                            <>
                            <Col lg="3">
                                <Form.Group className="form-group mt-n3">
                                  <Form.Label htmlFor="schemeAmount">Quantity in kg<span className="text-danger">*</span></Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="machineQuantity"
                                      type="text"
                                      name="machineQuantity"
                                      value={data.machineQuantity}
                                      onChange={handleInputs}
                                      placeholder="Enter Quantity in kg"
                                      required
                                      // readOnly
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="3">
                                <Form.Group className="form-group mt-n3">
                                  <Form.Label>
                                    {t('Month')}<span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      name="month"
                                      value={data.month}
                                      onChange={handleInputs}
                                      onBlur={() => handleInputs}
                                      required
                                      // isInvalid={
                                      //   data.month === undefined ||
                                      //   data.month === "0"
                                      // }
                                    >
                                      <option value="">{t('Select Month')}</option>
                                      <option value="JANUARY">{t('January')}</option>
                                      <option value="FEBRUARY">{t('February')}</option>
                                      <option value="MARCH">{t('March')}</option>
                                      <option value="APRIL">{t('April')}</option>
                                      <option value="MAY">{t('May')}</option>
                                      <option value="JUNE">{t('June')}</option>
                                      <option value="JULY">{t('July')}</option>
                                      <option value="AUGUST">{t('August')}</option>
                                      <option value="SEPTEMBER">{t('September')}</option>
                                      <option value="OCTOBER">{t('October')}</option>
                                      <option value="NOVEMBER">{t('November')}</option>
                                      <option value="DECEMBER">{t('December')}</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t('Month is required')}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="6">
                                <Form.Group className="form-group mt-n3">
                                  <Form.Label htmlFor="schemeAmount">
                                    {t("Machine Type")}<span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      name="machineTypeId"
                                      value={data.machineTypeId}
                                      onChange={handleInputs}
                                      onBlur={() => handleInputs}
                                      required
                                      isInvalid={
                                        data.machineTypeId === undefined ||
                                        data.machineTypeId === "0"
                                      }
                                    >
                                      <option value="">{t("Select Machine Type")}</option>
                                      {machineTypeListData.map((list) => (
                                        <option
                                          key={list.machineTypeId}
                                          value={list.machineTypeId}
                                        >
                                          {list.machineTypeName}
                                        </option>
                                      ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Machine Type is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>

                            <Col lg="6">
                                <Form.Group className="form-group mt-n4">
                                  <Form.Label htmlFor="imcbTable">
                                    {t("Table/Basin/Ends")} <span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      id="silkTable"
                                      name="silkTable"
                                      value={data.silkTable}
                                      onChange={handleInputs}
                                      required
                                    >
                                      <option value="">{t("Select Table/Basin/Ends")}</option>
                                      <option value="4 Charaka">4 Charaka</option>
                                      <option value="1-Table(2 Basin)">1-Table(2 Basin)</option>
                                      <option value="2-Table(4 Basin)">2-Table(4 Basin)</option>
                                      <option value="3-Table(6 Basin)">3-Table(6 Basin)</option>
                                      <option value="6 Basin">6 Basin</option>
                                      <option value="10 Basin">10 Basin</option>
                                      <option value="36 ends">36 ends</option>
                                      <option value="48 ends">48 ends</option>
                                      <option value="400 ends">400 ends</option>
                                      <option value="200 ends">200 ends</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Table/Basin/Ends is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="6">
                                <Form.Group className="form-group mt-n4">
                                  <Form.Label htmlFor="imcbTable">
                                    {t("Renditta/Grade")} <span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      id="renditta"
                                      name="renditta"
                                      value={data.renditta}
                                      onChange={handleInputs}
                                      required
                                    >
                                      <option value="">{t("Select Renditta/Grade")}</option>
                                      <option value="8.00">8.00</option>
                                      <option value="7.50">7.50</option>
                                      <option value="B-Grade">B-Grade</option>
                                      <option value="2 A-Grade">2 A-Grade</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Renditta/Grade is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>
                              
                            </>
                          )}

                          {getIncentiveAndBonusData[0]?.calculationBasedOn === "ICB-PSF" && (
                           
                            <Col lg="6">
                                  <Form.Group className="form-group mt-n4">
                                <Form.Label htmlFor="icbBasinEnds">
                                  {t("ICB Basin Ends")} <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Select
                                    id="icbBasinEnds"
                                    name="icbBasinEnds"
                                    value={data.icbBasinEnds}
                                    onChange={handleInputs}
                                    required
                                  >
                                    <option value="">{t("Select ICB Basin Ends")}</option>
                                    <option value="48 Ends">48 Ends</option>
                                    <option value="36 Ends">36 Ends</option>
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    {t("ICB Basin Ends is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>
                               )}

                               {getIncentiveAndBonusData[0]?.calculationBasedOn === "Adopting Boiler-PSF" && (
                           
                            <Col lg="6">
                                  <Form.Group className="form-group mt-n4">
                                <Form.Label htmlFor="icbBasinEnds">
                                  {t("Boiler In Kg")} <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                   <Form.Control
                                      id="boilerInKg"
                                      type="number"
                                      name="boilerInKg"
                                      value={data.boilerInKg}
                                      onChange={handleInputs}
                                      placeholder="Enter Boiler In Kg"
                                      required
                                      // readOnly
                                    />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Boiler In Kg is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>
                               )}


                            {getIncentiveAndBonusData[0]?.calculationBasedOn === "Reeling Shed-PSF" && (
                            <>
                            <Col lg="6">
                                <Form.Group className="form-group mt-n3">
                                  <Form.Label htmlFor="schemeAmount">
                                    {t("Machine Type")}<span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      name="machineTypeId"
                                      value={data.machineTypeId}
                                      onChange={handleInputs}
                                      onBlur={() => handleInputs}
                                      required
                                      isInvalid={
                                        data.machineTypeId === undefined ||
                                        data.machineTypeId === "0"
                                      }
                                    >
                                      <option value="">{t("Select Machine Type")}</option>
                                      {machineTypeListData.map((list) => (
                                        <option
                                          key={list.machineTypeId}
                                          value={list.machineTypeId}
                                        >
                                          {list.machineTypeName}
                                        </option>
                                      ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Machine Type is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>

                             {/* <Col lg="6">
                                  <Form.Group className="form-group mt-n4">
                                <Form.Label htmlFor="icbBasinEnds">
                                  {t("Reeling SQFT")} <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Select
                                    id="reelingShedSqft"
                                    name="reelingShedSqft"
                                    value={data.reelingShedSqft}
                                    onChange={handleInputs}
                                    required
                                  >
                                    <option value="">{t("Select Reeling SQFT")}</option>
                                    <option value="1200">1200</option>
                                    <option value="900">900</option>
                                    <option value="600">600</option>
                                    
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    {t("Reeling SQFT is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col> */}

                             <Col lg="6">
                                <Form.Group className="form-group mt-n3">
                                  <Form.Label htmlFor="schemeAmount">
                                    {t("Reeling Sqft")}<span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      name="reelingSqft"
                                      value={data.reelingSqft}
                                      onChange={handleInputs}
                                      onBlur={() => handleInputs}
                                      required
                                      isInvalid={
                                        data.reelingSqft === undefined ||
                                        data.reelingSqft === "0"
                                      }
                                    >
                                      <option value="">{t("Reeling Sqft")}</option>
                                      {allDetailsData.map((list) => (
                                        <option
                                          key={list.reelingShedId}
                                          value={list.reelingSqft}
                                        >
                                          {list.reelingSqft}
                                        </option>
                                      ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Reeling Sqft is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>


                            </>
                               )}

                               {getIncentiveAndBonusData[0]?.calculationBasedOn === "Adopting Silent Generator" && (
                            <>
                            <Col lg="6">
                                <Form.Group className="form-group mt-n3">
                                  <Form.Label htmlFor="schemeAmount">
                                    {t("Machine Type")}<span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      name="machineTypeId"
                                      value={data.machineTypeId}
                                      onChange={handleInputs}
                                      onBlur={() => handleInputs}
                                      required
                                      isInvalid={
                                        data.machineTypeId === undefined ||
                                        data.machineTypeId === "0"
                                      }
                                    >
                                      <option value="">{t("Select Machine Type")}</option>
                                      {machineTypeListData.map((list) => (
                                        <option
                                          key={list.machineTypeId}
                                          value={list.machineTypeId}
                                        >
                                          {list.machineTypeName}
                                        </option>
                                      ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Machine Type is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>

                             {/* <Col lg="6">
                                  <Form.Group className="form-group mt-n4">
                                <Form.Label htmlFor="icbBasinEnds">
                                  {t("Reeling SQFT")} <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Select
                                    id="reelingSqft"
                                    name="reelingSqft"
                                    value={data.reelingSqft}
                                    onChange={handleInputs}
                                    required
                                  >
                                    <option value="">{t("Select Reeling SQFT")}</option>
                                    <option value="1200">1200</option>
                                    <option value="900">900</option>
                                    <option value="600">600</option>
                                    
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    {t("Reeling SQFT is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col> */}

                            {/* <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                <strong>Silent generator Capacity( KW )</strong>
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="reelingSqft"
                                type="text"
                                name="reelingSqft"
                                value={data.reelingSqft}
                                onChange={handleInputs}
                                placeholder="Enter Silent genera tor Capacity( KW )"
                                required
                                // disabled={actionData.rejectType === "Permanent"}
                              />
                            </Form.Group>
                             <Form.Control.Feedback type="invalid">
                                Silent generator Capacity( KW ) is required
                              </Form.Control.Feedback>
                          </Col> */}

                          <Col lg="6">
                                <Form.Group className="form-group mt-n3">
                                  <Form.Label htmlFor="schemeAmount">
                                    {t("Silent generator Capacity( KW )")}<span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      name="reelingSqft"
                                      value={data.reelingSqft}
                                      onChange={handleInputs}
                                      onBlur={() => handleInputs}
                                      required
                                      isInvalid={
                                        data.reelingSqft === undefined ||
                                        data.reelingSqft === "0"
                                      }
                                    >
                                      <option value="">{t("Select Machine Type")}</option>
                                      {allDetailsData.map((list) => (
                                        <option
                                          key={list.reelingShedId}
                                          value={list.reelingSqft}
                                        >
                                          {list.reelingSqft}
                                        </option>
                                      ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Silent generator Capacity( KW ) is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>
                            </>
                               )}

                               {getIncentiveAndBonusData[0]?.calculationBasedOn === "Adopting Solar power Generator" && (
                            <>
                            <Col lg="6">
                                <Form.Group className="form-group mt-n3">
                                  <Form.Label htmlFor="schemeAmount">
                                    {t("Machine Type")}<span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      name="machineTypeId"
                                      value={data.machineTypeId}
                                      onChange={handleInputs}
                                      onBlur={() => handleInputs}
                                      required
                                      isInvalid={
                                        data.machineTypeId === undefined ||
                                        data.machineTypeId === "0"
                                      }
                                    >
                                      <option value="">{t("Select Machine Type")}</option>
                                      {machineTypeListData.map((list) => (
                                        <option
                                          key={list.machineTypeId}
                                          value={list.machineTypeId}
                                        >
                                          {list.machineTypeName}
                                        </option>
                                      ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Machine Type is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>

                             {/* <Col lg="6">
                                  <Form.Group className="form-group mt-n4">
                                <Form.Label htmlFor="icbBasinEnds">
                                  {t("Reeling SQFT")} <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Select
                                    id="reelingSqft"
                                    name="reelingSqft"
                                    value={data.reelingSqft}
                                    onChange={handleInputs}
                                    required
                                  >
                                    <option value="">{t("Select Reeling SQFT")}</option>
                                    <option value="1200">1200</option>
                                    <option value="900">900</option>
                                    <option value="600">600</option>
                                    
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    {t("Reeling SQFT is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col> */}

                            {/* <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                <strong>Solar Power Generator Capacity(HP)</strong>
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="reelingSqft"
                                type="text"
                                name="reelingSqft"
                                value={data.reelingSqft}
                                onChange={handleInputs}
                                placeholder="Enter Silent genera tor Capacity( KW )"
                                required
                                // disabled={actionData.rejectType === "Permanent"}
                              />
                            </Form.Group>
                             <Form.Control.Feedback type="invalid">
                                Solar Power Generator Capacity(HP) is required
                              </Form.Control.Feedback>
                          </Col> */}

                          <Col lg="6">
                                <Form.Group className="form-group mt-n3">
                                  <Form.Label htmlFor="schemeAmount">
                                    {t("Solar Power Generator Capacity(HP)")}<span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      name="reelingSqft"
                                      value={data.reelingSqft}
                                      onChange={handleInputs}
                                      onBlur={() => handleInputs}
                                      required
                                      isInvalid={
                                        data.reelingSqft === undefined ||
                                        data.reelingSqft === "0"
                                      }
                                    >
                                      <option value="">{t("Select Solar Power Generator Capacity(HP)")}</option>
                                      {allDetailsData.map((list) => (
                                        <option
                                          key={list.reelingShedId}
                                          value={list.reelingSqft}
                                        >
                                          {list.reelingSqft}
                                        </option>
                                      ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Solar Power Generator Capacity(HP) is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>
                            </>
                               )}

                                {getIncentiveAndBonusData[0]?.calculationBasedOn === "Adopting Solar Water Heater" && (
                            <>
                            <Col lg="6">
                                <Form.Group className="form-group mt-n4">
                                  <Form.Label htmlFor="schemeAmount">
                                    {t("Machine Type")}<span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      name="machineTypeId"
                                      value={data.machineTypeId}
                                      onChange={handleInputs}
                                      onBlur={() => handleInputs}
                                      required
                                      isInvalid={
                                        data.machineTypeId === undefined ||
                                        data.machineTypeId === "0"
                                      }
                                    >
                                      <option value="">{t("Select Machine Type")}</option>
                                      {machineTypeListData.map((list) => (
                                        <option
                                          key={list.machineTypeId}
                                          value={list.machineTypeId}
                                        >
                                          {list.machineTypeName}
                                        </option>
                                      ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Machine Type is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>

                             {/* <Col lg="6">
                                  <Form.Group className="form-group mt-n4">
                                <Form.Label htmlFor="icbBasinEnds">
                                  {t("Reeling SQFT")} <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Select
                                    id="reelingSqft"
                                    name="reelingSqft"
                                    value={data.reelingSqft}
                                    onChange={handleInputs}
                                    required
                                  >
                                    <option value="">{t("Select Reeling SQFT")}</option>
                                    <option value="1200">1200</option>
                                    <option value="900">900</option>
                                    <option value="600">600</option>
                                    
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    {t("Reeling SQFT is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col> */}

                            {/* <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                <strong>Solar Power Generator Capacity(HP)</strong>
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="reelingSqft"
                                type="text"
                                name="reelingSqft"
                                value={data.reelingSqft}
                                onChange={handleInputs}
                                placeholder="Enter Silent genera tor Capacity( KW )"
                                required
                                // disabled={actionData.rejectType === "Permanent"}
                              />
                            </Form.Group>
                             <Form.Control.Feedback type="invalid">
                                Solar Power Generator Capacity(HP) is required
                              </Form.Control.Feedback>
                          </Col> */}

                           {/* <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                <strong>Solar Water heater Capcity(In Ltrs)</strong>
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="reelingSqft"
                                type="text"
                                name="reelingSqft"
                                value={data.reelingSqft}
                                onChange={handleInputs}
                                placeholder="Enter Silent genera tor Capacity( KW )"
                                required
                                // disabled={actionData.rejectType === "Permanent"}
                              />
                            </Form.Group>
                             <Form.Control.Feedback type="invalid">
                                Solar Water heater Capcity(In Ltrs) is required
                              </Form.Control.Feedback>
                          </Col> */}

                           {/* <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                <strong>Model</strong>
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="reelingUnit"
                                type="text"
                                name="reelingUnit"
                                value={data.reelingUnit}
                                onChange={handleInputs}
                                placeholder="Enter Model"
                                required
                                // disabled={actionData.rejectType === "Permanent"}
                              />
                            </Form.Group>
                             <Form.Control.Feedback type="invalid">
                                Model is required
                              </Form.Control.Feedback>
                          </Col> */}

                           {/* <Col lg="6">
                                <Form.Group className="form-group mt-n3">
                                  <Form.Label htmlFor="schemeAmount">
                                    {t("Solar Water Heater Capcity(In Ltrs)")}<span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      name="reelingSqft"
                                      value={data.reelingSqft}
                                      onChange={handleInputs}
                                      onBlur={() => handleInputs}
                                      required
                                      isInvalid={
                                        data.reelingSqft === undefined ||
                                        data.reelingSqft === "0"
                                      }
                                    >
                                      <option value="">{t("Select Solar Water Heater Capcity(In Ltrs)")}</option>
                                      {allDetailsData.map((list) => (
                                        <option
                                          key={list.reelingShedId}
                                          value={list.reelingSqft}
                                        >
                                          {list.reelingSqft}
                                        </option>
                                      ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Solar Water heater Capcity(In Ltrs) is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>

                          

                         
                          <Col lg="6">
                                <Form.Group className="form-group mt-n3">
                                  <Form.Label htmlFor="schemeAmount">
                                    {t("Model")}<span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      name="reelingUnit"
                                      value={data.reelingUnit}
                                      onChange={handleInputs}
                                      onBlur={() => handleInputs}
                                      required
                                      isInvalid={
                                        data.reelingUnit === undefined ||
                                        data.reelingUnit === "0"
                                      }
                                    >
                                      <option value="">{t("Model")}</option>
                                      {allDetailsData.map((list) => (
                                        <option
                                          key={list.reelingShedId}
                                          value={list.reelingUnit}
                                        >
                                          {list.reelingUnit}
                                        </option>
                                      ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Model is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col> */}

                              <Col lg="6">
                                  <Form.Group className="form-group mt-n4">
                                <Form.Label htmlFor="icbBasinEnds">
                                  {t("Solar Power Generator Capacity(HP)")} <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Select
                                    id="reelingSqft"
                                    name="reelingSqft"
                                    value={data.reelingSqft}
                                    onChange={handleInputs}
                                    required
                                  >
                                    <option value="">{t("Select Reeling SQFT")}</option>
                                    <option value="1000">1000</option>
                                    <option value="500">500</option>
                                    <option value="200">200</option>
                                    {/* <option value="600">600</option> */}
                                    
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    {t("Reeling SQFT is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>

                            <Col lg="6">
                                  <Form.Group className="form-group mt-n4">
                                <Form.Label htmlFor="icbBasinEnds">
                                  {t("Model")} <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Select
                                    id="reelingUnit"
                                    name="reelingUnit"
                                    value={data.reelingUnit}
                                    onChange={handleInputs}
                                    required
                                  >
                                    <option value="">{t("Select Model")}</option>
                                    <option value="FPC">FPC</option>
                                    <option value="ETC">ETC</option>
                                    {/* <option value="600">600</option> */}
                                    
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    {t("Model is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>
                            </>
                               )}


                          {(getIncentiveAndBonusData[0]?.calculationBasedOn === "IMCB-PSF" ||
                            getIncentiveAndBonusData[0]?.calculationBasedOn === "MERM-PSF") && (
                            <Col lg="6">
                                <Form.Group className="form-group mt-n4">
                                  <Form.Label htmlFor="imcbTable">
                                    {t("Imcb Table/Basin")} <span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      id="imcbTable"
                                      name="imcbTable"
                                      value={data.imcbTable}
                                      onChange={handleInputs}
                                      required
                                    >
                                      <option value="">{t("Select Imcb Table")}</option>
                                      <option value="1-Table(2 Basin)">1-Table(2 Basin)</option>
                                      <option value="2-Table(4 Basin)">2-Table(4 Basin)</option>
                                      <option value="3-Table(6 Basin)">3-Table(6 Basin)</option>
                                      <option value="6 Basin">6 Basin</option>
                                      <option value="10 Basin">10 Basin</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Imcb Table is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>
                          )}


                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              {t("Head of Account")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scHeadAccountId"
                                value={data.scHeadAccountId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                // required
                                // isInvalid={
                                //   data.scHeadAccountId === undefined ||
                                //   data.scHeadAccountId === "0"
                                // }
                              >
                                <option value="">{t("Select Head of Account")}</option>
                                {scHeadAccountListData &&
                                  scHeadAccountListData.map((list) => (
                                    <option
                                      key={list.headOfAccountId}
                                      value={list.headOfAccountId}
                                    >
                                      {list.scHeadAccountName}
                                    </option>
                                  ))}
                              </Form.Select>
                              {/* <Form.Control.Feedback type="invalid">
                                {t("Head of Account is required")}
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>

                        

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("Approval Stage")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <Col>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="approvalStageId"
                                  value={data.approvalStageId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs}
                                  required  
                                  isInvalid={
                                    data.approvalStageId === undefined ||
                                    data.approvalStageId === "0"
                                  }
                                >
                                  <option value="">
                                    {t("Select Approval Stage")}
                                  </option>
                                  {approvalStageBeforeNextStepListData.map(
                                    (list) => (
                                      <option
                                        key={list.approvalStageId}
                                        value={list.approvalStageId}
                                      >
                                        {list.approvalStageName}
                                      </option>
                                    )
                                  )}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  {t("Approval Stage Name is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Col>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("User Master")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <Col>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="userId"
                                  value={data.userId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs}
                                  required
                                  isInvalid={
                                    data.userId === undefined ||
                                    data.userId === "0"
                                  }
                                >
                                  <option value="">{t("Select User")}</option>
                                  {userFromDistrictData.map((list) => (
                                    <option
                                      key={list.userId}
                                      value={list.userId}
                                    >
                                      {list.userName}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                User is required
                              </Form.Control.Feedback>
                              </div>
                            </Col>
                          </Form.Group>
                        </Col>

                    {/* {getIncentiveAndBonusData[0]?.allowMultipleSanction && (
                       <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                <strong>Sanction Number</strong>
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="sanctionNo"
                                type="text"
                                name="sanctionNo"
                                value={data.sanctionNo}
                                onChange={handleInputs}
                                placeholder="Enter Sanction Number"
                                required
                                // disabled={actionData.rejectType === "Permanent"}
                              />
                            </Form.Group>
                             <Form.Control.Feedback type="invalid">
                                Sanction Number is required
                              </Form.Control.Feedback>
                          </Col>
                        )} */}

                        <Col lg="2">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              {t("From Date")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.periodFrom}
                                onChange={(date) =>
                                  handleDateChange(date, "periodFrom")
                                }
                                // minDate={new Date("01/04/2023")}
                                // maxDate={new Date("31/03/2024")}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                maxDate={new Date()}
                                // readOnly={schemeDetails.calculationBasedOn === "Silk Samagra Central" || 
                                //   schemeDetails.calculationBasedOn === "Silk Samagra State" || 
                                //   !schemeDetails.calculationBasedOn}
                                readOnly 
                                required
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="2">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              {t("To Date")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.periodTo}
                                onChange={(date) =>
                                  handleDateChange(date, "periodTo")
                                }
                                // minDate={new Date("01/04/2023")}
                                // maxDate={new Date("31/03/2024")}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                maxDate={new Date()}
                                required
                                // readOnly={schemeDetails.calculationBasedOn === "Silk Samagra Central" || 
                                //   schemeDetails.calculationBasedOn === "Silk Samagra State" || 
                                //   !schemeDetails.calculationBasedOn}
                                readOnly 
                              />
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Block>
              </Col>

             
              <Card className="mt-1">
                <Row className="ms-1 mt-2">
                  <Col lg="2">
                    <Form.Group
                      as={Row}
                      className="form-group"
                      controlId="constructedArea"
                    >
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="equordev"
                          value="constructedArea"
                          checked={data.equordev.includes("constructedArea")}
                          onChange={handleCheckbox}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2">
                        {t("Constructed Area")}
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col lg="2">
                    <Form.Group
                      as={Row}
                      className="form-group"
                      controlId="equipment"
                    >
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="equordev"
                          value="equipment"
                          checked={data.equordev.includes("equipment")}
                          onChange={handleCheckbox}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2">
                        {t("Equipment Purchase")}
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col lg="2">
                    <Form.Group
                      as={Row}
                      className="form-group"
                      controlId="land"
                    >
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="equordev"
                          value="land"
                          checked={data.equordev.includes("land")}
                          onChange={handleCheckbox}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2">
                      {t("Land Wise")}
                      </Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </Card>

{getIncentiveAndBonusData[0]?.calculationBasedOn === "Silk Incentive-PSF" && (
                            <>
              <Block className="mt-3">
              <Card className="mb-4">
                  <Card.Header>{t("Add Silk Incentive Details")}</Card.Header>
                  <Card.Body>
                        <Row className="mt-3">
                        <Col lg="4">
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
                        </Col>

                        <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                {t("Daily Limit")} 
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  type="text"
                                  name="dailyLimit"
                                  value={data.dailyLimit}
                                  onChange={handleInputs}
                                  // required
                                  placeholder={t("Enter Daily Limit")}
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                  {t("Daily Limit is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>


                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                {t("No Of Cocoons used to Produce Raw Silk")} 
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  type="text"
                                  name="noOfCocoonsNeedToProduce"
                                  value={data.noOfCocoonsNeedToProduce}
                                  onChange={handleInputs}
                                  // required
                                  placeholder={t("Enter No Of Cocoons used to Produce Raw Silk")}
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                  {t("No Of Cocoons used to Produce Raw Silk is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label>
                                {t("Raw Silk Produced in Kgs")} 
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  type="text"
                                  name="noOfRawSilkProduced"
                                  value={data.noOfRawSilkProduced}
                                  onChange={handleInputs}
                                  // required
                                  placeholder={t("Enter No Of Raw Silk Produced")}
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                  {t("No Of Raw Silk Produced is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label>
                                {t("Form 17J No")} 
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  type="text"
                                  name="form17JNo"
                                  value={data.form17JNo}
                                  onChange={handleInputs}
                                  // required
                                  placeholder={t("Enter Form 17J No")}
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                  {t("Form 17J No is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                          <Form.Group className="form-group">
                            <Form.Label>
                              {t("Silk Exchange Type")}<span className="text-danger">*</span>
                            </Form.Label>
                            <Col>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="silkExchangeId"
                                  value={data.silkExchangeId}
                                  onChange={handleInputs}
                                  required
                                >
                                  <option value="">{t("Select Silk Exchange Type")}</option>
                                  {silkListData.map((list) => (
                                    <option
                                      key={list.silkExchangeId}
                                      value={list.silkExchangeId}
                                    >
                                      {list.silkExchangeName}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  {t("Silk Exchange is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Col>
                          </Form.Group>
                        </Col>
                        </Row>
                  </Card.Body>
                </Card>
                </Block>
                </>
             )}

              {/* {showButton && ( */}
              {selectedBonusMode === "Automatic" && (
                    <Block className="mt-3">
                      <Card>
                        <Card.Header style={{ fontWeight: "bold" }}>
                          {t("Transaction Details")}
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-4">
                            {/* <Col sm={4}>
                              <Form.Group className="form-group">
                                <Form.Label>Bidding Slip Lot No</Form.Label>
                                <Form.Control
                                  id="lotNo"
                                  name="lotNo"
                                  value={data.lotNo}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Enter Bidding Slip Lot No"
                                  className="form-control"
                                />
                              </Form.Group>
                            </Col> */}

                            <Col lg="2">
                              <Form.Group className="form-group">
                                <Form.Label htmlFor="transactionDate">
                                  {t("Transaction Date")} <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <DatePicker
                                    selected={data.transactionDate}
                                    onChange={(date) => handleDateChange(date, "transactionDate")}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    maxDate={new Date()}
                                    required
                                  />
                                </div>
                              </Form.Group>
                            </Col>

                            <Col lg="3">
                            <Form.Group className="form-group">
                              <Form.Label>Bidding Slip Lot No</Form.Label>
                              <Form.Control
                                as="select"
                                name="lotNo"
                                value={data.lotNo || ""}
                                disabled={!data.transactionDate || !data.fruitsId} 
                               onChange={(e) => {
                                const selectedLotId = e.target.value;
                                setData((prev) => ({
                                  ...prev,
                                  lotNo: selectedLotId, // 🔥 only update lotNo (it is allottedLotId)
                                }));


                                  // Fetch additional details for this lot if needed
                                  fetchLotOptions(e);
                                  const selectedSubScheme = getIncentiveAndBonusData[0];
                                  const schemeType = selectedSubScheme?.subSchemeType;

                                  // ✅ Call only when we have auctionDate + fruitsId + allottedLotId
                                  if (selectedLotId && data.transactionDate && data.fruitsId && schemeType) {
                                    getLotDistributeResponseForInvoiceAndBonusScheme(selectedLotId, schemeType);
                                  }
                                }}
                                className="form-control"
                              >
                                <option value="">-- Select Lot --</option>
                                {lotOptions.map((lot) => (
                                  <option key={lot.allottedLotId} value={lot.allottedLotId}>
                                    {lot.allottedLotId}
                                  </option>
                                ))}
                              </Form.Control>
                            </Form.Group>
                          </Col>

                          <Col lg="3">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                              Average Yield
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="averageYield"
                                type="text"
                                name="averageYield"
                                value={data.averageYield}
                                onChange={handleInputs}
                                placeholder="Enter Average Yield"
                                // readOnly
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                              Total Cocoons Weight is required
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>


                        <Col lg="3">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                             No Of Cocoons/Kg
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="noOfCocoonPerKg"
                                type="text"
                                name="noOfCocoonPerKg"
                                value={data.noOfCocoonPerKg}
                                onChange={handleInputs}
                                placeholder="Enter  No Of Cocoons/Kg"
                                // readOnly
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                              Total Cocoons Weight is required
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>

                          <Col lg="3">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                              Total Cocoons Weight
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="cocoonsWeight"
                                type="text"
                                name="cocoonsWeight"
                                value={data.cocoonsWeight}
                                onChange={handleInputs}
                                placeholder="Enter Total Cocoons Weight"
                                readOnly
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                              Total Cocoons Weight is required
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>


                            <Col lg="3">
                              <Form.Group className="form-group">
                                <Form.Label>Lot Weight</Form.Label>
                                <Form.Control
                                  id="lotWeight"
                                  name="lotWeight"
                                  value={data.lotWeight}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Lot Weight"
                                  className="form-control"
                                  readOnly
                                />
                              </Form.Group>
                            </Col>

                            
                          </Row>

                          <Col lg="2">
                            <Form.Group as={Row} className="form-group" controlId="availBonus">
                              <Col sm={1}>
                                <Form.Check
                                  type="checkbox"
                                  name="availBonus"
                                  value="availBonus"
                                  checked={data.availBonus}
                                  onChange={handleBonusCheckBox}
                                />
                              </Col>
                              <Form.Label column sm={9} className="mt-n2">
                                {t("Avail Bonus Or Incentive")}
                              </Form.Label>
                            </Form.Group>
                          </Col>

                      {/* <Row>
                        <div className="gap-col d-flex justify-content-center">
                          <Button
                            variant="primary"
                            type="button"
                            onClick={() =>
                              console.log("Submit Transaction Details", data)
                            }
                          >
                            Submit
                          </Button>
                        </div>
                      </Row> */}
                      {/* Farmer Details Card - show only after lot is selected */}
                      {data.lotNo && farmerDetailsForIB.length > 0 && (
                        <Card className="mt-3">
                          <Card.Header style={{ fontWeight: "bold" }}>
                            {t("Farmer Details")}
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col lg="12">
                                <table className="table small table-bordered">
                                  <thead>
                                    <tr>
                                      <th>Sl. No</th>
                                      <th>Farmer Name</th>
                                      <th>Buyer Type</th>
                                      <th>Cocoons Weight</th>
                                      <th>Lot Parent Level</th>
                                      <th>DFL Lot No</th>
                                      <th>Buyer Name</th>
                                      <th>Amount</th>
                                      <th>Market Name</th>
                                      <th>Farmer Village</th>
                                      <th>Total Lot Weight</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {farmerDetailsForIB.map((farmer, index) => (
                                      <tr key={farmer.serialNumber}>
                                        <td>{farmer.serialNumber}</td>
                                        <td>{farmer.farmerFullName}</td>
                                        <td>{farmer.buyerType}</td>
                                        <td>{farmer.lotWeight}</td>
                                        <td>{farmer.lotParentLevel}</td>
                                        <td>{farmer.dflLotNumber}</td>
                                        <td>{farmer.buyerName}</td>
                                        <td>{farmer.soldAmount}</td>
                                        <td>{farmer.marketName}</td>
                                        <td>{farmer.farmerVillage}</td>
                                        <td>{farmer.lotWeightAfterWeighment}</td>
                                      </tr>
                                    ))}
                                    <tr>
                                      <td colSpan="10">
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                          <span style={{ color: "green", fontWeight: "bold" }}>
                                            Total Cocoons Weight Of Seed Area – Eligible for Incentive: {farmerDetailsForIB[0]?.totalLotWeight || 0}
                                          </span>
                                          <span style={{ color: "green", fontWeight: "bold" }}>
                                            Total Cocoons Weight For Reeling – Eligible for Bonus and Incentive: {farmerDetailsForIB[0]?.sumLotWeightReeling || 0}
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      )}
                    </Card.Body>
                  </Card>
                </Block>
              )}


               {/* {getIncentiveAndBonusData[0]?.calculationBasedOn === "Registered Private Bivoltine Chawki Rearing Center Subsidy" && (
                    <Block className="mt-3">
                      <Card>
                        <Card.Header style={{ fontWeight: "bold" }}>
                          {t("Registered Private Bivoltine Chawki Rearing Center Subsidy Details")}
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-4">
                           

                           <Card>
                            <Card.Header>Rearing Equipment Details</Card.Header>
                            <Card.Body>
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>Select</th>
                                    <th>Subsidy Name</th>
                                    <th>Eligible Nos</th>
                                    <th>Eligible Value</th>
                                    <th>Rate</th>
                                    <th>Max Subsidy</th>
                                    <th>Purchased Nos</th>
                                    <th>Purchased Value</th>
                                    <th>Percentage</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {chawkiData.equipmentList.map((row, index) => (
                                    <tr key={row.rearingEquipmentDetailsId}>
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={row.selected}
                                          onChange={(e) => {
                                            const updated = [...chawkiData.equipmentList];
                                            updated[index].selected = e.target.checked;
                                            setChawkiData({ ...chawkiData, equipmentList: updated });
                                          }}
                                        />
                                      </td>

                                      <td>{row.subsidyName}</td>
                                      <td>{row.eligibleEquipmentInNos}</td>
                                      <td>{row.eligibleTotalValueInRs}</td>
                                      <td>{row.ratePerEligibleEquipment}</td>
                                      <td>{row.maxAmountOfSubsidyEligible}</td>

                                      <td>
                                        <input
                                          type="number"
                                          className="form-control"
                                          value={row.purchasedEquipmentInNos}
                                          onChange={(e) => {
                                            const updated = [...chawkiData.equipmentList];
                                            updated[index].purchasedEquipmentInNos = e.target.value;
                                            setChawkiData({ ...chawkiData, equipmentList: updated });
                                          }}
                                        />
                                      </td>

                                      <td>
                                        <input
                                          type="number"
                                          className="form-control"
                                          value={row.purchasedTotalValueInRs}
                                          onChange={(e) => {
                                            const updated = [...chawkiData.equipmentList];
                                            updated[index].purchasedTotalValueInRs = e.target.value;
                                            setChawkiData({ ...chawkiData, equipmentList: updated });
                                          }}
                                        />
                                      </td>

                                      <td>
                                        <input
                                          type="number"
                                          className="form-control"
                                          value={row.percentageOfSubsidyAmount}
                                          onChange={(e) => {
                                            const updated = [...chawkiData.equipmentList];
                                            updated[index].percentageOfSubsidyAmount = e.target.value;
                                            setChawkiData({ ...chawkiData, equipmentList: updated });
                                          }}
                                        />
                                      </td>

                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </Card.Body>
                          </Card>

                              <Card className="mt-3">
                                <Card.Header>Establishment Of Mulberry Garden</Card.Header>
                                <Card.Body>
                                  <div><strong>Eligible Amount:</strong> {chawkiData.mulberry.eligible}</div>

                                  <Row>
                                    <Col lg="6">
                                      <label>Claimed Amount</label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={chawkiData.mulberry.claimed}
                                        onChange={(e) =>
                                          setChawkiData({
                                            ...chawkiData,
                                            mulberry: { ...chawkiData.mulberry, claimed: e.target.value }
                                          })
                                        }
                                      />
                                    </Col>

                                    <Col lg="6">
                                      <label>Percentage of Subsidy</label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={chawkiData.mulberry.percentage}
                                        onChange={(e) =>
                                          setChawkiData({
                                            ...chawkiData,
                                            mulberry: { ...chawkiData.mulberry, percentage: e.target.value }
                                          })
                                        }
                                      />
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Card>

                              <Card className="mt-3">
                                <Card.Header>Installation Of Drip Irrigation</Card.Header>

                                <Card.Body>
                                  <div>
                                    <strong>Eligible Amount:</strong> {chawkiData.drip.eligible}
                                  </div>

                                  <Row className="mt-3">
                                    <Col lg="6">
                                      <label>Claimed Amount</label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={chawkiData.drip.claimed}
                                        onChange={(e) =>
                                          setChawkiData({
                                            ...chawkiData,
                                            drip: { ...chawkiData.drip, claimed: e.target.value }
                                          })
                                        }
                                      />
                                    </Col>

                                    <Col lg="6">
                                      <label>Percentage of Subsidy</label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={chawkiData.drip.percentage}
                                        onChange={(e) =>
                                          setChawkiData({
                                            ...chawkiData,
                                            drip: { ...chawkiData.drip, percentage: e.target.value }
                                          })
                                        }
                                      />
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Card>

                              <Card className="mt-3">
                                <Card.Header>Chawki Rearing Building</Card.Header>

                                <Card.Body>
                                  <div>
                                    <strong>Eligible Amount:</strong> {chawkiData.building.eligible}
                                  </div>

                                  <Row className="mt-3">
                                    <Col lg="6">
                                      <label>Claimed Amount</label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={chawkiData.building.claimed}
                                        onChange={(e) =>
                                          setChawkiData({
                                            ...chawkiData,
                                            building: { ...chawkiData.building, claimed: e.target.value }
                                          })
                                        }
                                      />
                                    </Col>

                                    <Col lg="6">
                                      <label>Percentage of Subsidy</label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={chawkiData.building.percentage}
                                        onChange={(e) =>
                                          setChawkiData({
                                            ...chawkiData,
                                            building: { ...chawkiData.building, percentage: e.target.value }
                                          })
                                        }
                                      />
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Card>



                            
                          </Row>

                        

                      
                     
                    </Card.Body>
                  </Card>
                </Block>
              )} */}

              {
                getIncentiveAndBonusData[0]?.calculationBasedOn ===
                  "Registered Private Bivoltine Chawki Rearing Center Subsidy" && (
                  <Block className="mt-3">
                    <Card>
                      <Card.Header style={{ fontWeight: "bold" }}>
                        {t("Registered Private Bivoltine Chawki Rearing Center Subsidy Details")}
                      </Card.Header>

                      <Card.Body>
                        <Row className="g-4">

                          {/* ============================
                              CARD 1: Rearing Equipment
                          ============================= */}
                          <Card>
                            <Card.Header>Rearing Equipment Details</Card.Header>
                            <Card.Body>
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>Select</th>
                                    <th>Subsidy Name</th>
                                    <th>Eligible Nos</th>
                                    <th>Eligible Value</th>
                                    {/* <th>Rate</th> */}
                                    <th>Max Subsidy</th>
                                    <th>Rate</th>
                                    <th>Purchased Nos</th>
                                    <th>Purchased Total Value</th>
                                    <th>Percentage Of Subsidy(In Rs.)</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {chawkiData.equipmentList.map((row, index) => (
                                    <tr key={row.rearingEquipmentDetailsId}>
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={row.selected}
                                          onChange={(e) =>
                                            setChawkiData((prev) => {
                                              const updated = [...prev.equipmentList];
                                              updated[index] = {
                                                ...updated[index],
                                                selected: e.target.checked
                                              };
                                              return { ...prev, equipmentList: updated };
                                            })
                                          }
                                        />
                                      </td>

                                      <td>{row.subsidyName}</td>
                                      <td>{row.eligibleEquipmentInNos}</td>
                                      <td>{row.eligibleTotalValueInRs}</td>
                                      {/* <td>{row.ratePerEligibleEquipment}</td> */}
                                      <td>{row.maxAmountOfSubsidyEligible}</td>

                                      {/* Purchased Nos */}
                                      <td>
                                        
                                        <input
                                      type="number"
                                      className="form-control"
                                      name="ratePerEligibleEquipment"
                                      value={row.ratePerEligibleEquipment}
                                      onChange={(e) => handleEquipmentListChange(index, e)}
                                      
                                    />
                                      </td>

                                      <td>
                                        
                                        <input
                                      type="number"
                                      className="form-control"
                                      name="purchasedEquipmentInNos"
                                      value={row.purchasedEquipmentInNos}
                                      onChange={(e) => handleEquipmentListChange(index, e)}
                                      
                                    />
                                      </td>

                                      {/* Purchased Value */}
                                      <td>
                                        <input
                                        type="number"
                                        className="form-control"
                                        name="purchasedTotalValueInRs"
                                        value={row.purchasedTotalValueInRs}
                                        onChange={(e) => handleEquipmentListChange(index, e)}
                                        readOnly
                                      />

                                      </td>

                                      {/* Percentage */}
                                      <td>
                                        <input
                                      type="number"
                                      className="form-control"
                                      name="percentageOfSubsidyAmount"
                                      value={row.percentageOfSubsidyAmount}
                                      onChange={(e) => handleEquipmentListChange(index, e)}
                                      readOnly
                                    />
                                      </td>
                                    </tr>
                                  ))}
                                  <tr style={{ fontWeight: "bold", background: "#f8f9fa" }}>
                                <td colSpan="3" className="text-end">TOTAL</td>

                                {/* Eligible Value */}
                                <td>{calculateTotals(chawkiData).equipmentEligibleTotal}</td>
                                
                                <td>{calculateTotals(chawkiData).equipmentMaxSubsidyTotal}</td>


                                <td></td> {/* Rate */}
                                <td></td>  {/* Purchased Nos skip */}

    
                                {/* <td></td> */}

                                {/* Purchased Value */}
                                <td>{calculateTotals(chawkiData).equipmentPurchasedTotal}</td>

                                {/* Percentage Total */}
                                <td>{calculateTotals(chawkiData).equipmentPercentageTotal}</td>
                              </tr>

                                </tbody>
                              </table>
                            </Card.Body>
                          </Card>

                          {/* ============================
                              CARD 2: Mulberry Garden
                          ============================= */}
                          <Card className="mt-3">
                            <Card.Header>Establishment Of Mulberry Garden</Card.Header>
                            <Card.Body>
                              <div>
                                <strong>Eligible Amount:</strong> {chawkiData.mulberry.eligible}
                              </div>

                              <Row className="mt-3">
                                <Col lg="6">
                                  <label>Claimed Amount</label>
                                 <input
                                    type="number"
                                    className="form-control"
                                    name="claimed"
                                    value={chawkiData.mulberry.claimed}
                                    onChange={(e) => handleSingleBlockChange("mulberry", e)}
                                  />
                                </Col>

                                <Col lg="6">
                                  <label>Percentage of Subsidy</label>
                                  <input
                                          type="number"
                                          className="form-control"
                                          name="percentage"
                                          value={chawkiData.mulberry.percentage}
                                          onChange={(e) => handleSingleBlockChange("mulberry", e)}
                                          readOnly
                                        />
                                    </Col>
                              </Row>
                            </Card.Body>
                          </Card>

                          {/* ============================
                              CARD 3: Drip Irrigation
                          ============================= */}
                          <Card className="mt-3">
                            <Card.Header>Installation Of Drip Irrigation</Card.Header>
                            <Card.Body>
                              <div>
                                <strong>Eligible Amount:</strong> {chawkiData.drip.eligible}
                              </div>

                              <Row className="mt-3">
                                <Col lg="6">
                                  <label>Claimed Amount</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="claimed"
                                    value={chawkiData.drip.claimed}
                                    onChange={(e) => handleSingleBlockChange("drip", e)}
                                  />
                                </Col>

                                <Col lg="6">
                                  <label>Percentage of Subsidy</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="percentage"
                                    value={chawkiData.drip.percentage}
                                    onChange={(e) => handleSingleBlockChange("drip", e)}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>

                          {/* ============================
                              CARD 4: Chawki Rearing Building
                          ============================= */}
                          <Card className="mt-3">
                            <Card.Header>Chawki Rearing Building</Card.Header>
                            <Card.Body>
                              <div>
                                <strong>Eligible Amount:</strong> {chawkiData.building.eligible}
                              </div>

                              <Row className="mt-3">
                                <Col lg="6">
                                  <label>Claimed Amount</label>
                                  <input
                                      type="number"
                                      className="form-control"
                                      name="claimed"
                                      value={chawkiData.building.claimed}
                                      onChange={(e) => handleSingleBlockChange("building", e)}
                                    />
                                </Col>

                                <Col lg="6">
                                  <label>Percentage of Subsidy</label>
                                  <input
                                  type="number"
                                  className="form-control"
                                  name="percentage"
                                  value={chawkiData.building.percentage}
                                  onChange={(e) => handleSingleBlockChange("building", e)}
                                  readOnly
                                />
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>

                          <Card className="mt-4">
                        <Card.Header style={{ fontWeight: "bold" }}>
                          Final Total Summary
                        </Card.Header>

                        <Card.Body>
                          {(() => {
                            const t = calculateTotals(chawkiData);
                            return (
                              <>
                              {/* <p><strong>Total Max Subsidy Amount:</strong> {t.totalMaxSubsidy}</p> */}
                                <p><strong>Total Claimed Amount:</strong> {t.totalClaimed}</p>
                                <p><strong>Total Eligible Amount:</strong> {t.totalEligible}</p>
                                <p><strong>Total Subsidy Amount:</strong> {t.totalSubsidy}</p>
                              </>
                            );
                          })()}
                        </Card.Body>
                      </Card>


                        </Row>
                      </Card.Body>
                    </Card>
                  </Block>
                )
              }


              {showCommercialMarketTransaction && (
                    <Block className="mt-3">
                      <Card>
                        <Card.Header style={{ fontWeight: "bold" }}>
                          {t("Transaction Details-Commercial Market")}
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-4">
                             <Col lg="2">
                        <Form.Group className="form-group">
                            <Form.Label>
                            {t("Market")}<span className="text-danger">*</span>
                            </Form.Label>
                            <Col>
                            <div className="form-control-wrap">
                                <Form.Select
                                name="marketId"
                                value={data.marketId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                >
                                <option value="">{t("Select Market")}</option>
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
                                {t("Market is required")}
                                </Form.Control.Feedback>
                            </div>
                            </Col>
                        </Form.Group>
                        </Col>

                            <Col lg="2">
                              <Form.Group className="form-group">
                                <Form.Label htmlFor="transactionDate">
                                  {t("Transaction Date")} <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <DatePicker
                                    selected={data.transactionDate}
                                    onChange={(date) => handleDateChange(date, "transactionDate")}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    maxDate={new Date()}
                                    required
                                  />
                                </div>
                              </Form.Group>
                            </Col>

                            <Col lg="2">
                            <Form.Group className="form-group">
                              <Form.Label>Bidding Slip Lot No</Form.Label>
                              <Form.Control
                                as="select"
                                name="lotNo"
                                value={data.lotNo || ""}
                                disabled={!data.transactionDate || !data.fruitsId} 
                               onChange={(e) => {
                                const selectedLotId = e.target.value;
                                setData((prev) => ({
                                  ...prev,
                                  lotNo: selectedLotId, // 🔥 only update lotNo (it is allottedLotId)
                                }));


                                  // Fetch additional details for this lot if needed
                                  fetchLotOptionsForCommercialMarket(e);
                                  const selectedSubScheme = getIncentiveAndBonusData[0];
                                  const schemeType = selectedSubScheme?.subSchemeType;

                                  // ✅ Call only when we have auctionDate + fruitsId + allottedLotId
                                  if (selectedLotId && data.transactionDate && data.fruitsId && schemeType) {
                                    getCropDetailsCommercialMarketByLotNo(selectedLotId, schemeType);
                                  }
                                }}
                                className="form-control"
                              >
                                <option value="">-- Select Lot --</option>
                                {lotOptionsForCommercialMarket.map((lot) => (
                                  <option key={lot.biddingSlipNo} value={lot.biddingSlipNo}>
                                    {lot.biddingSlipNo}
                                  </option>
                                ))}
                              </Form.Control>
                            </Form.Group>
                          </Col>

                          


                       

                          <Col lg="2">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                              Cocoons Transacted
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="cocoonsWeight"
                                type="text"
                                name="cocoonsWeight"
                                value={data.cocoonsWeight}
                                onChange={handleInputs}
                                placeholder="Enter Cocoons Transacted"
                                // readOnly
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                              Total Cocoons Weight is required
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>


                         <Col lg="2">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                             No Of DFLs
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="lotWeight"
                                type="text"
                                name="lotWeight"
                                value={data.lotWeight}
                                onChange={handleInputs}
                                placeholder="Enter  No Of DFLs"
                                // readOnly
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                              Total Cocoons Weight is required
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="2">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                              Average Yield
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="averageYield"
                                type="text"
                                name="averageYield"
                                value={data.averageYield}
                                onChange={handleInputs}
                                placeholder="Enter Average Yield"
                                // readOnly
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                              Total Cocoons Weight is required
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>


                            {/* <Col lg="3">
                              <Form.Group className="form-group">
                                <Form.Label>Lot Weight</Form.Label>
                                <Form.Control
                                  id="lotWeight"
                                  name="lotWeight"
                                  value={data.lotWeight}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Lot Weight"
                                  className="form-control"
                                  readOnly
                                />
                              </Form.Group>
                            </Col> */}

                            
                          </Row>

                          <Col lg="2">
                            <Form.Group as={Row} className="form-group" controlId="availBonus">
                              <Col sm={1}>
                                <Form.Check
                                  type="checkbox"
                                  name="availBonus"
                                  value="availBonus"
                                  checked={data.availBonus}
                                  onChange={handleBonusCheckBox}
                                />
                              </Col>
                              <Form.Label column sm={9} className="mt-n2">
                                {t("Avail Bonus Or Incentive")}
                              </Form.Label>
                            </Form.Group>
                          </Col>

                          </Card.Body>
                  </Card>
                </Block>
              )}

               {/* {showSeedMarketTransaction && ( */}
               {selectedBonusMode === "Manual" && (
                    <Block className="mt-3">
                      <Card>
                        <Card.Header style={{ fontWeight: "bold" }}>
                          {t("Transaction Details-Seed Market")}
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-4">

                          <Col lg="2">
                        <Form.Group className="form-group">
                            <Form.Label>
                            {t("Market")}<span className="text-danger">*</span>
                            </Form.Label>
                            <Col>
                            <div className="form-control-wrap">
                                <Form.Select
                                name="marketId"
                                value={data.marketId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                >
                                <option value="">{t("Select Market")}</option>
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
                                {t("Market is required")}
                                </Form.Control.Feedback>
                            </div>
                            </Col>
                        </Form.Group>
                        </Col>
                            

                            <Col lg="2">
                              <Form.Group className="form-group">
                                <Form.Label htmlFor="transactionDate">
                                  {t("Transaction Date")} <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <DatePicker
                                    selected={data.transactionDate}
                                    onChange={(date) => handleDateChange(date, "transactionDate")}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    maxDate={new Date()}
                                    required
                                  />
                                </div>
                              </Form.Group>
                            </Col>

                            <Col lg="2">
                            <Form.Group className="form-group">
                              <Form.Label>Bidding Slip Lot No</Form.Label>
                              <Form.Control
                                as="select"
                                name="lotNo"
                                value={data.lotNo || ""}
                                disabled={!data.transactionDate || !data.fruitsId} 
                               onChange={(e) => {
                                const selectedLotId = e.target.value;
                                setData((prev) => ({
                                  ...prev,
                                  lotNo: selectedLotId, // 🔥 only update lotNo (it is allottedLotId)
                                }));


                                  // Fetch additional details for this lot if needed
                                  fetchLotOptionsForSeedMarket(e);
                                  const selectedSubScheme = getIncentiveAndBonusData[0];
                                  const schemeType = selectedSubScheme?.subSchemeType;

                                  // ✅ Call only when we have auctionDate + fruitsId + allottedLotId
                                  if (selectedLotId && data.transactionDate && data.fruitsId && schemeType) {
                                    getCropDetailsSeedMarketByLotNo(selectedLotId, schemeType);
                                  }
                                }}
                                className="form-control"
                              >
                                <option value="">-- Select Lot --</option>
                                {lotOptionsForSeedMarket.map((lot) => (
                                  <option key={lot.biddingSlipNo} value={lot.biddingSlipNo}>
                                    {lot.biddingSlipNo}
                                  </option>
                                ))}
                              </Form.Control>
                            </Form.Group>
                          </Col>

                          


                       

                          <Col lg="2">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                              Total Cocoons Transacted
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="cocoonsWeight"
                                type="text"
                                name="cocoonsWeight"
                                value={data.cocoonsWeight}
                                onChange={handleInputs}
                                placeholder="Enter Cocoons Transacted"
                                // readOnly
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                              Total Cocoons Weight is required
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>


                         <Col lg="2">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                             No Of DFLs
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="lotWeight"
                                type="text"
                                name="lotWeight"
                                value={data.lotWeight}
                                onChange={handleInputs}
                                placeholder="Enter  No Of DFLs"
                                // readOnly
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                              Total Cocoons Weight is required
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="2">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                             No Of Cocoons Per Kg
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="noOfCocoonPerKg"
                                type="text"
                                name="noOfCocoonPerKg"
                                value={data.noOfCocoonPerKg}
                                onChange={handleInputs}
                                placeholder="Enter  No Of Cocoons Per Kg"
                                // readOnly
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                              Total Cocoons Weight is required
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="2">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                              Average Yield
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="averageYield"
                                type="text"
                                name="averageYield"
                                value={data.averageYield}
                                onChange={handleInputs}
                                placeholder="Enter Average Yield"
                                // readOnly
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                              Total Cocoons Weight is required
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>


                        <Col lg="2">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                              Eligible For Bonus
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="noOfRawSilkProduced"
                                type="text"
                                name="noOfRawSilkProduced"
                                value={data.noOfRawSilkProduced}
                                onChange={handleInputs}
                                placeholder="Eligible For Bonus"
                                // readOnly
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                              Total Cocoons Weight is required
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>


                        <Col lg="2">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                              Eligible For Incentive
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="noOfCocoonsNeedToProduce"
                                type="text"
                                name="noOfCocoonsNeedToProduce"
                                value={data.noOfCocoonsNeedToProduce}
                                onChange={handleInputs}
                                placeholder="Eligible For Incentive"
                                // readOnly
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                              Total Cocoons Weight is required
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>


                            {/* <Col lg="3">
                              <Form.Group className="form-group">
                                <Form.Label>Lot Weight</Form.Label>
                                <Form.Control
                                  id="lotWeight"
                                  name="lotWeight"
                                  value={data.lotWeight}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Lot Weight"
                                  className="form-control"
                                  readOnly
                                />
                              </Form.Group>
                            </Col> */}

                            
                          </Row>

                          <Col lg="2">
                            <Form.Group as={Row} className="form-group" controlId="availBonus">
                              <Col sm={1}>
                                <Form.Check
                                  type="checkbox"
                                  name="availBonus"
                                  value="availBonus"
                                  checked={data.availBonus}
                                  onChange={handleBonusCheckBox}
                                />
                              </Col>
                              <Form.Label column sm={9} className="mt-n2">
                                {t("Avail Bonus Or Incentive")}
                              </Form.Label>
                            </Form.Group>
                          </Col>

                          </Card.Body>
                  </Card>
                </Block>
              )}

              <Block className="mt-3">
                <Card>
                  <Card.Header style={{ fontWeight: "bold" }}>
                    {t("Sanction Amount")}
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-gs">
                    <div className="gap-col">
                      <ul className="d-flex align-items-left justify-content-left gap g-3">
                      
                        <li>
                          {/* <Button type="button" variant="secondary" onClick={handleCalculateUnitPrice}>
                            Calculate Unit Price
                          </Button> */}
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCalculateUnitPrice}
                            // disabled={!schemeDetails.calculationBasedOn}
                            disabled={
                            !(
                              schemeDetails.calculationBasedOn ||
                              getIncentiveAndBonusData[0]?.calculationBasedOn
                            )
                          }
                          >
                            {t("Calculate Unit Price")}
                          </Button>
                          </li>

                          {/* <li>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowModal2(true)}
                          >
                            Select Transaction Details
                          </Button>
                        </li> */}
                        {/* <li>
                          {showButton && ( // Conditionally render the button
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => setShowModal2(true)}
                            >
                              {t("Select Transaction Details")}
                            </Button>
                          )}
                        </li> */}
                      </ul>
                    </div>
                    <div className="gap-col">
                      <ul className="d-flex align-items-left justify-content-left gap g-3">
                      
                        <li>
                          {/* <Button type="button" variant="secondary" onClick={handleCalculateUnitPrice}>
                            Calculate Unit Price
                          </Button> */}
                          
                        </li>
                      </ul>
                    </div>
                      <Col lg="4">
                        <Form.Group className="form-group mt-n5">
                          <Form.Label htmlFor="landDeveloped">
                            {t("Unit Cost")}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="landDeveloped"
                              type="text"
                              name="unitPrice"
                              value={amountValue.unitPrice}
                              onChange={handleAmountValueInputs}
                              placeholder={t("Enter Unit Cost")}
                              readOnly
                            />
                            <Form.Control.Feedback type="invalid">
                              {t("Unit Cost is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      {/* <Col lg="4">
                        <Form.Group className="form-group mt-n5">
                          <Form.Label htmlFor="expectedAmount">
                            {t("Subsidy/Bonus/Incentive Amount")}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="expectedAmount"
                              type="text"
                              name="expectedAmount"
                              value={data.expectedAmount}
                              onChange={handleInputs}
                              placeholder={t("Enter Expected Amount")}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {t("Subsidy Amount is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col> */}

                      {/* IF NOT sanctionForReeling → Show normal field */}
                    {!getIncentiveAndBonusData[0]?.sanctionForReeling &&
                      getIncentiveAndBonusData[0]?.calculationBasedOn !==
                        "Registered Private Bivoltine Chawki Rearing Center Subsidy" && (
                        <Col lg="4">
                          <Form.Group className="form-group mt-n5">
                            <Form.Label htmlFor="expectedAmount">
                              {t("Subsidy/Bonus/Incentive Amount")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="expectedAmount"
                                type="text"
                                name="expectedAmount"
                                value={data.expectedAmount}
                                onChange={handleInputs}
                                placeholder={t("Enter Expected Amount")}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {t("Subsidy Amount is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                      )}



                    {/* IF sanctionForReeling → Show Total Expected Amount (disabled) */}
                    {/* {getIncentiveAndBonusData[0]?.sanctionForReeling && (
                      <Col lg="4">
                        <Form.Group className="form-group mt-n5">
                          <Form.Label htmlFor="totalExpectedAmount">
                            {t("Total Subsidy/Bonus/Incentive Amount")}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="totalExpectedAmount"
                              type="text"
                              name="expectedAmount"
                              value={data.expectedAmount}
                              disabled
                              placeholder={t("Enter Expected Amount")}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    )} */}


                    {/* IF sanctionForReeling → Show Subsidy Amount */}
                    {/* {getIncentiveAndBonusData[0]?.sanctionForReeling && (
                      <Col lg="4">
                        <Form.Group className="form-group mt-n5">
                          <Form.Label>
                            <strong>Subsidy Amount</strong>
                          </Form.Label>
                          <Form.Control
                            id="subsidyAmount"
                            type="text"
                            name="subsidyAmount"
                            value={data.subsidyAmount}
                            // disabled
                            placeholder="Auto Calculated"
                          />
                        </Form.Group>
                      </Col>
                    )} */}
                    {(getIncentiveAndBonusData[0]?.sanctionForReeling ||
                    getIncentiveAndBonusData[0]?.calculationBasedOn ===
                      "Registered Private Bivoltine Chawki Rearing Center Subsidy") && (
                    <Col lg="4">
                      <Form.Group className="form-group mt-n5">
                        <Form.Label htmlFor="totalExpectedAmount">
                          {t("Total Subsidy/Bonus/Incentive Amount")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="totalExpectedAmount"
                            type="text"
                            name="expectedAmount"
                            value={data.expectedAmount}
                            disabled
                            placeholder={t("Enter Expected Amount")}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  )}

                    {(getIncentiveAndBonusData[0]?.sanctionForReeling ||
                        getIncentiveAndBonusData[0]?.calculationBasedOn ===
                          "Registered Private Bivoltine Chawki Rearing Center Subsidy") && (
                        <Col lg="4">
                          <Form.Group className="form-group mt-n5">
                            <Form.Label>
                              <strong>Subsidy Amount</strong>
                            </Form.Label>
                            <Form.Control
                              id="subsidyAmount"
                              type="text"
                              name="subsidyAmount"
                              value={data.subsidyAmount}
                              placeholder="Auto Calculated"
                            />
                          </Form.Group>
                        </Col>
                      )}


                    </Row>
                  </Card.Body>
                </Card>
              </Block>


              {/* Conditional Section Rendering */}
              {data.equordev.includes("constructedArea") && (
                <Block className="mt-3">
                  <Card>
                    <Card.Header style={{ fontWeight: "bold" }}>
                      {t("Constructed Area")}
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="4">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="landDeveloped">
                              {t("Unit")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="landDeveloped"
                                type="text"
                                name="landDeveloped"
                                value={developedLand.landDeveloped}
                                onChange={handleDevelopedLandInputs}
                                placeholder="Enter Unit"
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                                {t("Unit Quantity is required")}
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="4">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="landDeveloped">
                              {t("Extent Of Mulberry")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="extentOfMulberry"
                                type="text"
                                name="extentOfMulberry"
                                value={developedLand.extentOfMulberry}
                                onChange={handleDevelopedLandInputs}
                                placeholder="Enter Extent Of Mulberry"
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                                {t("Extent Of Mulberry is required")}
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="4">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="landDeveloped">
                              {t("Constructed Area in Sqft")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="rhSqft"
                                type="text"
                                name="rhSqft"
                                value={developedLand.rhSqft}
                                onChange={handleDevelopedLandInputs}
                                placeholder="Enter Constructed Area in Sqft"
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                                {t("Extent Of Mulberry is required")}
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="4">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="landDeveloped">
                              {t("Estimated Cost")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="estimatedCost"
                                type="text"
                                name="estimatedCost"
                                value={developedLand.estimatedCost}
                                onChange={handleDevelopedLandInputs}
                                placeholder="Enter Estimated Cost"
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                                {t("Extent Of Mulberry is required")}
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="4">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              {t("Roof Type")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="roofTypeId"
                                value={developedLand.roofTypeId}
                                onChange={handleDevelopedLandInputs}
                                // required
                                // isInvalid={
                                //   equipment.vendorId === undefined ||
                                //   equipment.vendorId === "0"
                                // }
                              >
                                <option value="">{t("Select Roof Type")}</option>
                                {roofTypeListData.map((list) => (
                                  <option
                                    key={list.roofTypeId}
                                    value={list.roofTypeId}
                                  >
                                    {list.roofTypeName}
                                  </option>
                                ))}
                              </Form.Select>
                              {/* <Form.Control.Feedback type="invalid">
                                {t("Vendor Name is required")}
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Block>
              )}

              {data.equordev.includes("equipment") && (
                <Block className="mt-3">
                  <Card>
                    <Card.Header style={{ fontWeight: "bold" }}>
                      {t("Equipment Purchase")}
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="4">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              {t("Vendor Name")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="vendorId"
                                value={equipment.vendorId}
                                onChange={handleEquipmentInputs}
                                // required
                                // isInvalid={
                                //   equipment.vendorId === undefined ||
                                //   equipment.vendorId === "0"
                                // }
                              >
                                <option value="">{t("Select Vendor Name")}</option>
                                {scVendorListData.map((list) => (
                                  <option
                                    key={list.scVendorId}
                                    value={list.scVendorId}
                                  >
                                    {list.name}
                                  </option>
                                ))}
                              </Form.Select>
                              {/* <Form.Control.Feedback type="invalid">
                                {t("Vendor Name is required")}
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="4">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="description">
                              {t("Description")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="description"
                                type="text"
                                name="description"
                                value={equipment.description}
                                onChange={handleEquipmentInputs}
                                placeholder={t("Enter Description")}
                                // required
                              />
                              {/* <Form.Control.Feedback type="invalid">
                                {t("Description is required")}
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Block>
              )}

            <Block className="mt-3">
              <Card className="mb-4">
                  <Card.Header>{t("Kanesh Land Details")}</Card.Header>
                  <Card.Body>
                    <Row>
                      <Col lg="12">
                        <Form.Group className="form-group mt-n3">
                          <Form.Label>
                            {t("Do you want to add Kanesh Land Details?")}{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Check
                              inline
                              label={t("Yes")}
                              type="radio"
                              name="addKaneshLand"
                              id="kaneshYes"
                              value="yes"
                              checked={data.addKaneshLand === "yes"}
                              onChange={handleInputs}
                            />
                            <Form.Check
                              inline
                              label={t("No")}
                              type="radio"
                              name="addKaneshLand"
                              id="kaneshNo"
                              value="no"
                              checked={data.addKaneshLand === "no" || !data.addKaneshLand}
                              onChange={handleInputs}
                            />

                            {/* Hidden input for validation */}
                            <input
                              type="text"
                              style={{ display: "none" }}
                              required
                              value={data.addKaneshLand || ""}
                              onChange={() => {}}
                            />

                            {!data.addKaneshLand && validated && (
                              <div className="text-danger small mt-1">
                                {t("Please select Yes or No")}
                              </div>
                            )}
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Show fields only if Yes is selected */}
                    {data.addKaneshLand === "yes" && (
                      <>
                        <Row className="mt-3">
                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label>
                                {t("Kanesh No")} 
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  type="text"
                                  name="kaneshNo"
                                  value={data.kaneshNo}
                                  onChange={handleInputs}
                                  // required
                                  placeholder={t("Enter Kanesh No")}
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label>
                                {t("District")} 
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="kaneshDistrictId"
                                  value={data.kaneshDistrictId}
                                  onChange={handleInputs}
                                  // required
                                  // isInvalid={!data.kaneshDistrictId || data.kaneshDistrictId === "0"}
                                >
                                  <option value="">{t("Select District")}</option>
                                  {districtListData && districtListData.length
                                    ? districtListData.map((list) => (
                                        <option
                                          key={list.districtId}
                                          value={list.districtId}
                                        >
                                          {list.districtName}
                                        </option>
                                      ))
                                    : ""}
                                </Form.Select>
                                {/* <Form.Control.Feedback type="invalid">
                                  {t("District is required")}
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label>
                                {t("Taluk")} 
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="kaneshTalukId"
                                  value={data.kaneshTalukId}
                                  onChange={handleInputs}
                                  // required
                                  // isInvalid={!data.kaneshTalukId || data.kaneshTalukId === "0"}
                                >
                                  <option value="">{t("Select Taluk")}</option>
                                  {talukListData && talukListData.length
                                    ? talukListData.map((list) => (
                                        <option
                                          key={list.talukId}
                                          value={list.talukId}
                                        >
                                          {list.talukName}
                                        </option>
                                      ))
                                    : ""}
                                </Form.Select>
                                {/* <Form.Control.Feedback type="invalid">
                                  {t("Taluk is required")}
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label>
                                {t("Hobli")} 
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                    name="kaneshHobliId"
                                    value={data.kaneshHobliId}
                                    onChange={handleInputs}
                                    // onBlur={() => handleInputs}
                                    // required
                                    // isInvalid={
                                    //   data.hobliId === undefined || data.hobliId === "0"
                                    // }
                                  >
                                    <option value="">{t("select_hobli")}</option>
                                          {hobliListData && hobliListData.length
                                    ? hobliListData.map((list) => (
                                        <option
                                          key={list.hobliId}
                                          value={list.hobliId}
                                        >
                                          {list.hobliName}
                                        </option>
                                      ))
                                    : ""}
                                  </Form.Select>
                                {/* <Form.Control.Feedback type="invalid">
                                  {t("Village is required")}
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label>
                                {t("Village")} 
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="kaneshVillageId"
                                  value={data.kaneshVillageId}
                                  onChange={handleInputs}
                                  // required
                                  // isInvalid={!data.kaneshVillageId || data.kaneshVillageId === "0"}
                                >
                                  <option value="">{t("Select Village")}</option>
                                  {villageListData && villageListData.length
                                    ? villageListData.map((list) => (
                                        <option
                                          key={list.villageId}
                                          value={list.villageId}
                                        >
                                          {list.villageName}
                                        </option>
                                      ))
                                    : ""}
                                </Form.Select>
                                {/* <Form.Control.Feedback type="invalid">
                                  {t("Village is required")}
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label>
                                {t("Panchayat Name")} 
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  type="text"
                                  name="panchayatName"
                                  value={data.panchayatName}
                                  onChange={handleInputs}
                                  // required
                                  placeholder={t("Enter Panchayat Name")}
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label>
                                {t("Sqft")} 
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  type="text"
                                  name="sqft"
                                  value={data.sqft}
                                  onChange={handleInputs}
                                  // required
                                  placeholder={t("Enter Sqft")}
                                />
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>

                        {/* Chakbandi Details */}
                       <Block className="mt-3">
                        <Card className="mb-4">
                          <Card.Header>{t("Chakbandi Details")}</Card.Header>
                          <Card.Body>
                            <Row>
                              <Col lg="3">
                                <Form.Group className="form-group mt-n4">
                                  <Form.Label htmlFor="mahajarEast">
                                    {t("East")}
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="east"
                                      name="east"
                                      value={data.east}
                                      onChange={handleInputs}
                                      type="text"
                                      placeholder={t("Enter East")}
                                      // required
                                    />
                                    {/* <Form.Control.Feedback type="invalid">
                                      This Field is required
                                    </Form.Control.Feedback> */}
                                  </div>
                                </Form.Group>
                              </Col>
          
                              <Col lg="3">
                                <Form.Group className="form-group mt-n4">
                                  <Form.Label htmlFor="mahajarWest">
                                    {t("West")}
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="west"
                                      name="west"
                                      value={data.west}
                                      onChange={handleInputs}
                                      type="text"
                                      placeholder={t("West")}
                                      // required
                                    />
                                    {/* <Form.Control.Feedback type="invalid">
                                      This Field is required
                                    </Form.Control.Feedback> */}
                                  </div>
                                </Form.Group>
                              </Col>
          
                              <Col lg="3">
                                <Form.Group className="form-group mt-n4">
                                  <Form.Label htmlFor="mahajarNorth">
                                    {t("North")}
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="north"
                                      name="north"
                                      value={data.north}
                                      onChange={handleInputs}
                                      type="text"
                                      placeholder={t("North")}
                                      // required
                                    />
                                    {/* <Form.Control.Feedback type="invalid">
                                      This Field is required
                                    </Form.Control.Feedback> */}
                                  </div>
                                </Form.Group>
                              </Col>
          
                              <Col lg="3">
                                <Form.Group className="form-group mt-n4">
                                  <Form.Label htmlFor="mahajarSouth">
                                    {t("South")}
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="south"
                                      name="south"
                                      value={data.south}
                                      onChange={handleInputs}
                                      type="text"
                                      placeholder={t("South")}
                                      // required
                                    />
                                    {/* <Form.Control.Feedback type="invalid">
                                      This Field is required
                                    </Form.Control.Feedback> */}
                                  </div>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Block>
                      </>
                    )}
                  </Card.Body>
                </Card>
                </Block>


              {data.equordev.includes("land") &&
                data.with === "withLand" &&
                landDetailsList.length > 0 && (
                  <Block className="mt-3">
                    <Card>
                      <Card.Header style={{ fontWeight: "bold" }}>
                        {t("Land Wise")}
                      </Card.Header>
                      <Card.Body>
                        {/* Display land-related details like the DataTable here */}
                        <Row>
                          <DataTable
                            tableClassName="data-table-head-light table-responsive"
                            columns={LandDetailsForDevColumns}
                            data={landDetailsList}
                            highlightOnHover
                            progressPending={loading}
                            theme="solarized"
                            customStyles={customStyles}
                          />
                        </Row>
                      </Card.Body>
                    </Card>
                  </Block>
                )}

              <div className="gap-col">
                <ul className="d-flex align-items-center justify-content-center gap g-3">
                  <li>
                    {/* <Button type="button" variant="primary" onClick={postData}> */}
                    {/* <Button type="submit" variant="primary">
                    {t("save")}
                    </Button> */}
                    <Button type="submit" variant="primary" disabled={saveDisabled}>
                    {t("save")}
                </Button>
                  </li>
                  <li>
                    <Button type="button" variant="secondary" onClick={clear}>
                    {t("cancel")}
                    </Button>
                  </li>
                </ul>
              </div>
            </Row>
          </Form>
        </Block>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("File Upload")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* {docListData.map(({ documentMasterId, documentMasterName }) => (
            <div key={documentMasterId}>
              <Row className="d-flex justify-content-center align-items-center">
                <Col lg="2">
                  <Form.Group className="form-group mt-1">
                    <Form.Label htmlFor="trUploadPath">
                      {documentMasterName}
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="form-group mt-1">
                    <div className="form-control-wrap">
                      <Form.Control
                        type="file"
                        id={`attImage${documentMasterId}`}
                        // name="hdAttachFiles"
                        // value={data.photoPath}
                        onChange={(e) => handleAttachFileChange(e, documentMasterId)}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4" style={{ position: "relative" }}>
                  <Form.Group className="form-group mt-3 d-flex justify-content-center">
                    {documentAttachments[documentMasterId] && (
                      <div style={{ position: "relative" }}>
                        <img
                          style={{ height: "150px", width: "150px" }}
                          src={URL.createObjectURL(
                            documentAttachments[documentMasterId]
                          )}
                        />
                        <button
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            background: "transparent",
                            border: "none",
                            color: "black",
                            fontSize: "24px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleRemoveImage(documentMasterId)}
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </Form.Group>
                </Col>
                <Col lg="2">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleAttachFileUpload(documentMasterId)}
                  >
                    Upload
                  </Button>
                </Col>
                <Col lg="2">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => handleAttachFileUpload(documentMasterId)}
                  disabled={isUploaded} // Disable button after upload
                >
                  {isUploaded ? "Uploaded" : "Upload"}
                </Button>
                <Button
                type="button"
                variant="primary"
                onClick={() => handleAttachFileUpload(documentMasterId)}
                disabled={uploadStatus[documentMasterId]} // Disable button if this document is uploaded
              >
                {uploadStatus[documentMasterId] ? "Uploaded" : "Upload"}
              </Button>
              </Col>
              </Row>
            </div>
          ))} */}
          <Block className="mt-3">
            <Row>
              <Col lg="5">
                <Form.Group className="form-group">
                  <Form.Label>
                    <strong>{t("Documents")}</strong>
                  </Form.Label>
                  <Form.Select
                    name="documentTypeId"
                    value={uploadDocuments.documentTypeId}
                    onChange={handleDocumentInputs}
                  >
                    <option value="">{t("Choose Document Type")}</option>
                    {docListData.map((list) => (
                      <option
                        key={list.documentMasterId}
                        value={list.documentMasterId}
                      >
                        {list.documentMasterName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col lg="5">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="accountImagePath">
                    {t("Upload Documents(PDF/jpg/png)(Max:2mb)")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      type="file"
                      id="documentPath"
                      name="documentPath"
                      // value={data.photoPath}
                      onChange={handleDocumentChange}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3 d-flex justify-content-center">
                  {document ? (
                    <img
                      style={{ height: "100px", width: "100px" }}
                      src={URL.createObjectURL(document)}
                    />
                  ) : (
                    ""
                  )}
                </Form.Group>
              </Col>
              <Col lg="2">
                <div className="gap-col mt-3">
                  <ul className="d-flex align-items-center justify-content-center gap g-3">
                    <li>
                      {/* <Button type="submit" variant="success">
                  Upload Documents
                </Button> */}
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() =>
                          handleAttachFileUpload(uploadDocuments.documentTypeId)
                        }
                        disabled={uploadStatus[uploadDocuments.documentTypeId]} // Disable button if this document is uploaded
                      >
                        {uploadStatus[uploadDocuments.documentTypeId]
                          ? "Uploaded"
                          : "Upload"}
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>

            {/* {uploadedDocuments.length > 0 && (
    <div className="mt-3">
      <h5>Uploaded Documents</h5>
      <ul>
        {uploadedDocuments.map((doc, index) => (
          <li key={index}>
            Document Type: {doc.documentId} - {doc.documentName}
          </li>
        ))}
      </ul>
    </div>
  )} */}

            {uploadedDocuments.length > 0 && (
              <div className="mt-3">
                <h5>{t("Uploaded Documents")}</h5>
                <ul className="d-flex justify-content-start">
                  {uploadedDocuments.map((doc, index) => (
                    <li key={index} className="d-flex align-items-center">
                      {/* Show the image if it's available */}
                      {doc.documentFile && (
                        <img
                          src={URL.createObjectURL(doc.documentFile)}
                          alt={doc.documentName}
                          style={{
                            height: "100px",
                            width: "100px",
                            marginRight: "10px",
                          }}
                        />
                      )}
                      {/* Show the document master name */}
                      {/* <span>Document Type: {doc.documentMasterName }</span> */}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Block>

          {/* <Col lg="12"> */}
          {uploadedDocuments.length > 0 && (
            <div className="gap-col mt-1">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button
                    type="button"
                    variant="primary"
                    // onClick={() =>
                    //   handleAttachFileUpload(uploadDocuments.documentTypeId)
                    // }
                    // disabled={uploadStatus[uploadDocuments.documentTypeId]} // Disable button if this document is uploaded
                  >
                    {/* {uploadStatus[uploadDocuments.documentTypeId]
                    ? "Uploaded"
                    : "Upload"} */}
                    {t("Submit")}
                  </Button>
                </li>
              </ul>
            </div>
          )}
        </Modal.Body>
      </Modal>

       {/* <Modal show={showModal2} onHide={handleCloseModal2} size="xl">
              <Modal.Header closeButton>
                <Modal.Title>Select Transaction Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Block className="mt-n4">
                  <Card className="mt-3 p-4 shadow-lg rounded">
                    <Row className="g-4">
                    <Col sm={4}>
                        <Form.Group className="form-group">
                          <Form.Label>Bidding Slip Lot No</Form.Label>
                          <Form.Control
                            id="lotNo"
                            name="lotNo"
                            value={data.lotNo}
                            onChange={handleInputs}
                            type="number"
                            placeholder="Enter Bidding Slip Lot No"
                            className="form-control"
                          />
                        </Form.Group>
                      </Col>
      
                      <Col sm={4}>
                        <Form.Group className="form-group">
                          <Form.Label>Lot Weight</Form.Label>
                          <Form.Control
                            id="lotWeight"
                            name="lotWeight"
                            value={data.lotWeight}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Lot Weight"
                            className="form-control"
                          />
                        </Form.Group>
                      </Col>
      
                      <Col lg="2">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                              {t("Transaction Date")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.transactionDate}
                                onChange={(date) =>
                                  handleDateChange(date, "transactionDate")
                                }
                                // minDate={new Date("01/04/2023")}
                                // maxDate={new Date("31/03/2024")}

                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                maxDate={new Date()}
                                // readOnly
                                required
                              />
                            </div>
                          </Form.Group>
                        </Col>
                    </Row>
                    <Col lg="2">
                    <Form.Group
                      as={Row}
                      className="form-group"
                      controlId="availBonus"
                    >
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="availBonus"
                          value="availBonus"
                          checked={data.availBonus}
                          onChange={handleBonusCheckBox}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2">
                      {t("Avail Bonus")}
                      </Form.Label>
                    </Form.Group>
                  </Col>
    
                    <Row>
                      <div className="gap-col d-flex justify-content-center">
                        <Button variant="primary" onClick={() => handleCloseModal2()}>
                          Submit
                        </Button>
                      </div>
                    </Row>
                  </Card>
                </Block>
              </Modal.Body>
            </Modal> */}

          <Modal show={showModalBreakUp} onHide={handleCloseModalBreakUp} size="xl">
            <Modal.Header closeButton>
              <Modal.Title>{t("Break Up")}</Modal.Title>
            </Modal.Header>
            <Modal.Body></Modal.Body>
          </Modal>
    </Layout>
  );
}

export default ServiceApplication;
