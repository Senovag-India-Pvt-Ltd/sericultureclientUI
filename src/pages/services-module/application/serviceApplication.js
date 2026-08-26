import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "react-datepicker";
import DataTable from "../../../components/AppDataTable";
import { Icon, Select } from "../../../components";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import ReactSelect from "react-select";
import api from "../../../../src/services/auth/api";
import React, { useMemo } from "react";
import {
  getFinancialYearMonths,
  getMonthPeriodByValue,
} from "../../../utilities/monthlyFrequency";


const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLRegistration = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLFarmerServer =
  process.env.REACT_APP_API_BASE_URL_REGISTRATION_FROM_FRUITS;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

const getFinancialYearPeriod = (financialYearStr) => {
  let startYear;
  if (financialYearStr) {
    const match = String(financialYearStr).match(/(\d{4})/);
    if (match) startYear = parseInt(match[1], 10);
  }
  if (!startYear) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    startYear = month >= 3 ? year : year - 1;
  }
  return {
    periodFrom: new Date(startYear, 3, 1),
    periodTo: new Date(startYear + 1, 2, 31),
  };
};

const getCurrentFinancialYearPeriod = () => getFinancialYearPeriod();

function ServiceApplication() {

  const isSanctionEnabledFromDB = async (scSubSchemeDetailsId) => {
  if (!scSubSchemeDetailsId) return false;

  try {
    const resp = await api.get(
      baseURLMasterData +
        `scSubSchemeDetails/is-sanction-enabled/${scSubSchemeDetailsId}`
    );
    return resp.data === false;
  } catch (err) {
    console.error("Sanction check failed", err);
    return false;
  }
};

const [originalStateAmount, setOriginalStateAmount] = useState(null);

const generateFinalReport = async (selectedRows) => {
  const subSchemeDetailsId = selectedRows?.[0]?.subSchemeId;

  if (!subSchemeDetailsId) {
    Swal.fire({
      icon: "warning",
      title: "Invalid Selection",
      html: `<div style="font-size:13.5px;color:#555;">Sub Scheme not found for the selected row.</div>`,
      confirmButtonText: "OK",
      confirmButtonColor: "#f0a500",
      width: "360px",
    });
    return;
  }

  // 🔹 Sanction enable check (DB driven)
  const isAllowed = await isSanctionEnabledFromDB(subSchemeDetailsId);

  // ❌ DB = 1 → STOP
  if (!isAllowed) {
    Swal.fire({
      icon: "warning",
      title: "Sanction Disabled",
      html: `<div style="font-size:13.5px;color:#555;">Sanction Order is disabled for this Component Type.</div>`,
      confirmButtonText: "OK",
      confirmButtonColor: "#f0a500",
      width: "360px",
    });
    return;
  }

  // ✅ DB = 0 or null → CONTINUE
  // 🔹 Do NOTHING extra here
  // Your existing flow already continues correctly
};



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
    periodFrom: getCurrentFinancialYearPeriod().periodFrom,
    periodTo: getCurrentFinancialYearPeriod().periodTo,
    cocoonsWeight:"",
    actualCocoonsTransacted: null,
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
    fromMonth: "",
    toMonth: "",
    monthYear: "",
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
    monthlyLimit: "",
    boilerInKg: "",
    sanctionNo: "",
    calculationBasedOn: "",
    marketId: "",
    taxInvoiceNo: "",
    taxInvoiceDate: new Date(),
    rearingEquipmentDetailsId: "",
    beneficiaryShareAmount: "",
    alreadyPaidAmount: 0,
    stateAmount: "",
    newFinancialYear: "",
    year: "",
    taxAmount: "0",
    eligibleForBonus: "",
    eligibleForIncentive: "",
    eligibleForIncentive: "",
    quantityOfSeedCocoons: "",
    armEnds: "",
    armUnitName: "",
    armUnitAddress: "",
    armLandType: "",
    armDistrictId: "",
    armTalukId: "",
    armHobliId: "",
    armVillageId: "",
    armAddress: "",
    armOwnerName: "",
    armSurveyNo: "",
    armAssessmentNo: "",

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
    length:"",
    breadth:"",
    height:"",
  });

  const [equipment, setEquipment] = useState({
    unitType: "",
    description: "",
    l1Rate: "",
    price: "",
    vendorId: "",
    payToVendor: false,
  });

  const emptySilkIncentiveRow = { equipmentDate: new Date(), noOfRawSilkProduced: "", form17JNo: "", silkExchangeId: "" };
  const [silkIncentiveList, setSilkIncentiveList] = useState([{ ...emptySilkIncentiveRow }]);

  const handleSilkIncentiveChange = (index, field, value) => {
    setSilkIncentiveList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addSilkIncentiveRow = () => setSilkIncentiveList((prev) => [...prev, { ...emptySilkIncentiveRow }]);
  const removeSilkIncentiveRow = (index) => setSilkIncentiveList((prev) => prev.filter((_, i) => i !== index));

  const emptyRearingEquipmentRow = { description: "", machineTypeId: "", l1Rate: "", machineQuantity: "", taxInvoiceNo: "", taxInvoiceDate: null };
  const [rearingEquipmentPurchaseList, setRearingEquipmentPurchaseList] = useState([{ ...emptyRearingEquipmentRow }]);

  const handleRearingEquipmentChange = (index, e) => {
    const { name, value } = e.target;
    setRearingEquipmentPurchaseList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  const handleRearingEquipmentDateChange = (index, date) => {
    setRearingEquipmentPurchaseList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], taxInvoiceDate: date };
      return updated;
    });
  };

  const addRearingEquipmentRow = () => {
    setRearingEquipmentPurchaseList((prev) => [...prev, { ...emptyRearingEquipmentRow }]);
  };

  const removeRearingEquipmentRow = (index) => {
    setRearingEquipmentPurchaseList((prev) => prev.filter((_, i) => i !== index));
  };

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

  const [showAmountBreakup, setShowAmountBreakup] = useState(false);

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
const [armCalculationData, setArmCalculationData] = useState([]);
const [armTalukListData, setArmTalukListData] = useState([]);
const [armHobliListData, setArmHobliListData] = useState([]);
const [armVillageListData, setArmVillageListData] = useState([]);

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
              // data.lotNo,
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
      // biddingSlipNo: biddingSlipNo,
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

const getCropDetailsSeedMarketByMarketAndDate = () => {
  if (!data.transactionDate || !data.marketId || !data.fruitsId) return;

  const formattedAuctionDate = formatAuctionDate(data.transactionDate);

  console.log("Fetching Seed Market by Market & Date →", {
    transactionDate: formattedAuctionDate,
    marketId: data.marketId,
    fruitsId: data.fruitsId,
  });

  api.post(
    baseURLDBT + `cropDetailsSeedMarket/getCropDetailsSeedMarketByLotNoWithoutBiddingSlip`,
    {
      transactionDate: formattedAuctionDate,
      marketId: data.marketId,
      fruitsId: data.fruitsId,
    }
  )
  .then((response) => {
    console.log("Seed Market response →", response.data);
    const respData = response.data.content || [];
    
    const lotData = respData[0] || {};

    setData((prev) => ({
      ...prev,
      quantityOfSeedCocoons: lotData.quantityOfSeedCocoons || 0,
      cocoonsWeight: lotData.quantityOfSeedCocoons || 0,
      averageYield: lotData.averageYield || 0,
      lotWeight: lotData.noOfDfls || 0,
      noOfCocoonPerKg: lotData.noOfCocoonsPerKg || 0,
      eligibleForBonus: lotData.eligibleForBonus || "",
      eligibleForIncentive: lotData.eligibleForIncentive || "",
      cocoonTransactedForReelingInKg: lotData.cocoonTransactedForReelingInKg || "",
      cocoonTransactedForSeedInKg: lotData.cocoonTransactedForSeedInKg || "",
      cocoonRatePerKg: lotData.cocoonRatePerKg || "",
      noOfRawSilkProduced: lotData.cocoonTransactedForReelingInKg || 0,
      noOfCocoonsNeedToProduce: lotData.quantityOfSeedCocoons || 0,
    }));
  })
  .catch((err) => {
    console.error("Seed Market fetch error →", err?.response?.data || err.message);
    setData((prev) => ({
      ...prev,
      quantityOfSeedCocoons: 0,
      cocoonsWeight: 0,
      averageYield: 0,
      lotWeight: 0,
      noOfCocoonPerKg: 0,
      eligibleForBonus: "",
      eligibleForIncentive: "",
      cocoonTransactedForReelingInKg: "",
      cocoonTransactedForSeedInKg: "",
      cocoonRatePerKg: "",
      noOfRawSilkProduced: 0,
      noOfCocoonsNeedToProduce: 0,
    }));
  });
};

useEffect(() => {
  if (selectedBonusMode === "Manual" && data.transactionDate && data.marketId && data.fruitsId) {
    getCropDetailsSeedMarketByMarketAndDate();
  }
}, [data.transactionDate, data.marketId, data.fruitsId, selectedBonusMode]);

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
    // data.lotNo &&
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
        // data.lotNo,
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

  // to get Financial Year
    const [financialyearListData, setFinancialyearListData] = useState([]);
  
    const getFinancialYearList = () => {
      api
        .get(baseURLMasterData + `financialYearMaster/get-all`)
        .then((response) => {
          setFinancialyearListData(response.data.content.financialYearMaster);
        })
        .catch((err) => {
          setFinancialyearListData([]);
        });
    };
  
    useEffect(() => {
      getFinancialYearList();
    }, []);


  const [defaultFinancialYearId, setDefaultFinancialYearId] = useState("");

  // Get Default Financial Year

  const getFinancialDefaultDetails = () => {
  api
    .get(baseURLMasterData + `financialYearMaster/get-is-default`)
    .then((response) => {
      const id = response.data.content.financialYearMasterId;
      const fyStr = response.data.content.financialYear;
      const { periodFrom, periodTo } = getFinancialYearPeriod(fyStr);

      setDefaultFinancialYearId(id);  // separate state

      setData((prev) => ({
        ...prev,
        financialYearMasterId: id,
        periodFrom,
        periodTo,
      }));
    })
    .catch(() => {
      setDefaultFinancialYearId("");
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
      }
    })
    .catch(() => {
      setScHeadAccountListData([]);
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
        if (
          response.data.content.unitCost &&
          getIncentiveAndBonusData?.[0]?.calculationBasedOn !== "Automatic Reeling Machine" &&
          getIncentiveAndBonusData?.[0]?.unitForScheme !== "Automatic Reeling Machine Unit"
        ) {
          const unitCost = response.data.content.unitCost;
          setScHeadAccountListData(unitCost);
          setAmountValue((prev) => ({
            ...prev,
            unitPrice: unitCost,
          }));
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
  const [allowAnyUser, setAllowAnyUser] = useState(false);

  //  to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLMasterData + `userMaster/get-join/${id}`)
      // .then((response) => {
      //   setDistrictId(response.data.content.districtId);
      //   setTalukId(response.data.content.talukId);
      .then((response) => {
      const res = response.data.content;

      setDistrictId(res.districtId);
      setTalukId(res.talukId);
      setAllowAnyUser(res.allowAnyUser === true);
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

  

  // to get user list
  const [userListData, setUserListData] = useState([]);

  const getUserList = () => {
    api
      .get(baseURLMasterData + `userMaster/get-all`)
      .then((response) => {
        setUserListData(response.data.content.userMaster);
      })
      .catch((err) => {
        setUserListData([]);
      });
  };

  useEffect(() => {
  if (allowAnyUser) {
    getUserList();
  }
}, [allowAnyUser]);


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

        // ARM land details cascade
        useEffect(() => {
          if (data.armDistrictId) {
            api.get(baseURLMasterData + `taluk/get-by-district-id/${data.armDistrictId}`)
              .then(r => setArmTalukListData(r.data.content?.taluk || []))
              .catch(() => setArmTalukListData([]));
          } else { setArmTalukListData([]); }
        }, [data.armDistrictId]);

        useEffect(() => {
          if (data.armTalukId) {
            api.get(baseURLMasterData + `hobli/get-by-taluk-id/${data.armTalukId}`)
              .then(r => setArmHobliListData(r.data.content?.hobli || []))
              .catch(() => setArmHobliListData([]));
          } else { setArmHobliListData([]); }
        }, [data.armTalukId]);

        useEffect(() => {
          if (data.armHobliId) {
            api.get(baseURLMasterData + `village/get-by-hobli-id/${data.armHobliId}`)
              .then(r => setArmVillageListData(r.data.content?.village || []))
              .catch(() => setArmVillageListData([]));
          } else { setArmVillageListData([]); }
        }, [data.armHobliId]);

        // Fetch ARM unit price when armEnds + category changes
        useEffect(() => {
          if (data.armEnds && data.scCategoryId) {
            api.get(baseURLMasterData + "armCalculation/get-unit-price", {
              params: { armEnds: data.armEnds, scCategoryId: data.scCategoryId }
            })
              .then(r => {
                const result = r.data.content;
                if (result && !result.error && result.totalUnitCost) {
                  // Wrap into a single-element array so all existing consumers work unchanged
                  setArmCalculationData([{
                    unitCost:          result.totalUnitCost,
                    centralPercentage: result.centralPercentage,
                    statePercentage:   result.statePercentage,
                    subsidyAmount:     result.subsidyAmount,
                    componentCount:    result.componentCount,
                  }]);
                } else {
                  setArmCalculationData([]);
                }
              })
              .catch(() => setArmCalculationData([]));
          } else {
            setArmCalculationData([]);
          }
        }, [data.armEnds, data.scCategoryId]);

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

  const [allDocList, setAllDocList] = useState([]);
  const [docListData, setDocListData] = useState([]);
  const [modalDocList, setModalDocList] = useState([]);

  useEffect(() => {
    api
      .get(baseURLMasterData + `documentMaster/get-all`)
      .then((response) => {
        setAllDocList(response.data.content.documentMaster || []);
      })
      .catch(() => {
        setAllDocList([]);
      });
  }, []);

  useEffect(() => {
    if (data.scSchemeDetailsId && data.scSubSchemeDetailsId) {
      api
        .get(baseURLMasterData + `schemeDocumentMaster/get-by-scheme-and-sub-scheme`, {
          params: {
            scSchemeDetailsId: data.scSchemeDetailsId,
            scSubSchemeDetailsId: data.scSubSchemeDetailsId,
          },
        })
        .then((res) => {
          const mappings = res.data.content.schemeDocumentMaster || [];
          if (mappings.length === 0) {
            setDocListData(allDocList);
            setModalDocList(allDocList);
          } else {
            const filtered = mappings.map((m) => ({
              documentMasterId: m.documentId,
              documentMasterName: m.documentMasterName,
            }));
            setDocListData(filtered);
            setModalDocList(filtered);
          }
        })
        .catch(() => {
          setDocListData(allDocList);
          setModalDocList(allDocList);
        });
    } else {
      setDocListData(allDocList);
    }
  }, [data.scSchemeDetailsId, data.scSubSchemeDetailsId, allDocList]);

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

   if (name === "alreadyPaidAmount") {
  const paid = Number(value || 0);

  // const isSDP =
  //   getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
  //   "SS Construction Of Low Cost Shed to Permanent Rearing House" ||
  // getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
  //   "SDP Construction Of  Low Cost Shed to  Permanent  Rearing House";

  const calcType = (
  getIncentiveAndBonusData?.[0]?.calculationBasedOn || ""
)
  .toLowerCase()
  .replace(/\s+/g, " ")
  .trim();

const isSDP =
  calcType === "ss construction of low cost shed to permanent rearing house" ||
  calcType === "sdp construction of low cost shed to permanent rearing house";

  // ✅ SDP LOGIC
  if (isSDP) {

    if (originalStateAmount === null || originalStateAmount === undefined) {
      setData({
        ...data,
        alreadyPaidAmount: paid
      });
      return;
    }

    const totalState = Number(originalStateAmount || 0);
    const eligible = Math.max(totalState - paid, 0);

    setData({
      ...data,
      alreadyPaidAmount: paid,
      stateAmount: eligible,

      // ✅ REQUIRED FIELD UPDATE
      expectedAmount: eligible,
      schemeAmount: eligible
    });

    return;
  }

  // ✅ EXISTING RH LOGIC (UNCHANGED)
  const finalStateAmount = Math.max(originalStateAmount - paid, 0);

  setData({
    ...data,
    alreadyPaidAmount: paid,
    stateAmount: finalStateAmount
  });

  return;
}

    if (name === "financialYearMasterId") {
      const selectedFY = financialyearListData.find(
        (f) => String(f.financialYearMasterId) === String(value)
      );
      const { periodFrom, periodTo } = getFinancialYearPeriod(
        selectedFY?.financialYear
      );
      // Changing the financial year invalidates any previously selected month
      // (the month list is FY-specific), so reset it back to the full-FY period.
      setData({ ...data, [name]: value, periodFrom, periodTo, monthYear: "" });
    } else {
      setData({ ...data, [name]: value });
    }

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

  // Monthly Frequency: selecting a month auto-populates Period From / Period To with
  // the first and last day of that month (leap-year safe). Used only when the selected
  // sub scheme has monthlyFrequency === true.
  const handleMonthlyFrequencyMonthChange = (e) => {
    const value = e.target.value;
    const { periodFrom, periodTo } = getMonthPeriodByValue(value);
    setData((prev) => ({
      ...prev,
      monthYear: value,
      periodFrom: periodFrom || prev.periodFrom,
      periodTo: periodTo || prev.periodTo,
    }));
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
        setAmountValue((prev) => ({
          ...prev,
          unitPrice: result.amount,
        }));
        
        if (schemeDetails.calculationBasedOn !== "PMKSY") { // Only update expectedAmount if not PMKSY
            setData((prev) => ({
              ...prev,
              expectedAmount: result.amount,
            }));
        }
        setLoading(false);
      })
      .catch((err) => {
        setAmountValue((prev) => ({
          ...prev,
          unitPrice: "",
        }));
        if (schemeDetails.calculationBasedOn !== "PMKSY") {
            setData((prev) => ({
              ...prev,
              expectedAmount: "",
            }));
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
              setData((prev) => ({ ...prev, expectedAmount: "" }));
          } else {
              setSaveDisabled(false);
              setData((prev) => ({ ...prev, expectedAmount: eligibleAmount || "" }));
          }
      } else {
          setSaveDisabled(false);
          // Do NOT update expectedAmount for non-PMKSY cases
      }
  })
  .catch(() => {
      setData((prev) => ({ ...prev, expectedAmount: "" }));
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

  // ARM: unit cost comes from ARM Calculation Master, not this API
  if (
    getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Automatic Reeling Machine" ||
    getIncentiveAndBonusData?.[0]?.unitForScheme === "Automatic Reeling Machine Unit"
  ) return;

  setLoading(true);

  api.get(`${baseURLDBT}configureRHAmount/get-amount-by-scheme-category-and-component?scSchemeDetailsId=${scSchemeDetailsId}&componentId=${scComponentId}&categoryId=${scCategoryId}`, {}, {
      headers: {
          "Content-Type": "application/json"
      }
  })
  .then((response) => {

  const list = response.data.content.configureRHAmount || [];

  const result = list.find(item => item.stateAmounts !== null) || list[0];
  const sqft = result?.sqft || 0;

  const amount = result?.amount || 0;
  const centralAmount = result?.centralAmount || 0;
  const stateAmounts = result?.stateAmounts || 0;

  const calcBasedOn = getIncentiveAndBonusData?.[0]?.calculationBasedOn || "";

  const isSdpRH225OrLowCost =
    calcBasedOn === "SDP RH 225" ||
    calcBasedOn === "SDP Low Cost Shed";

  if (isSdpRH225OrLowCost) {
    const minAmt = result?.minAmount || 0;
    const maxAmt = result?.maxAmount || 0;

    setAmountValue((prev) => ({
      ...prev,
      unitPrice: amount,
      minAmount: minAmt,
      maxAmount: maxAmt,
    }));

    // Total Subsidy will be computed in the rhSqft useEffect
    return;
  }

  const calcType = calcBasedOn.toLowerCase().replace(/\s+/g, " ").trim();

  const isSDP =
    calcType === "ss construction of low cost shed to permanent rearing house" ||
    calcType === "sdp construction of low cost shed to permanent rearing house";

  if (isSDP) {
    setAmountValue((prev) => ({
      ...prev,
      unitPrice: amount
    }));

    setData((prev) => ({
      ...prev,
      estimatedCost: amount
    }));

    setData((prev) => ({
      ...prev,
      expectedAmount: amount,
      schemeAmount: amount
    }));

    setOriginalStateAmount(stateAmounts);

    setData((prev) => ({
      ...prev,
      centralAmount: centralAmount,
      stateAmount: stateAmounts
    }));

    return;
  }

      // ✅ EXISTING LOGIC (UNCHANGED)
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
          calculatedAmount = amount || "";
          setData((prev) => ({
              ...prev,
              centralAmount: centralAmount,
              stateAmount: stateAmounts,
          }));
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

useEffect(() => {

  // const isSDP =
  //   getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
  //   "SS Construction Of Low Cost Shed to Permanent Rearing House" ||
  // getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
  //   "SDP Construction Of  Low Cost Shed to  Permanent  Rearing House";

  const calcType = (
  getIncentiveAndBonusData?.[0]?.calculationBasedOn || ""
)
  .toLowerCase()
  .replace(/\s+/g, " ")
  .trim();

const isSDP =
  calcType === "ss construction of low cost shed to permanent rearing house" ||
  calcType === "sdp construction of low cost shed to permanent rearing house";

  if (
    isSDP &&
    data.scComponentId &&
    data.scCategoryId &&
    data.scSchemeDetailsId
  ) {
    getCalculateAmountForRH();
  }

}, [
  getIncentiveAndBonusData,
  data.scComponentId,
  data.scCategoryId,
  data.scSchemeDetailsId
]);

useEffect(() => {

  if (originalStateAmount !== null && originalStateAmount !== undefined) {

    const paid = Number(data.alreadyPaidAmount || 0);

    const finalStateAmount = Math.max(
      originalStateAmount - paid,
      0
    );

    setData((prev) => ({
      ...prev,
      stateAmount: finalStateAmount
    }));
  }

}, [originalStateAmount, data.alreadyPaidAmount]);


const [totalSubsidy, setTotalSubsidy] = useState(0);



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

const calculateBonusAmount = ({ calcType, maxNoOfCocoonsPerKg, minAverageYield } = {}) => {
  const cocoonsWeight = parseFloat(data.cocoonsWeight || 0);
  const amountPerKg   = parseFloat(bonusAmountData[0]?.amountPerKg || 0);

  // Original formula: Total = Cocoons Transacted × Rate per kg
  const calculatedAmount = cocoonsWeight * amountPerKg;
  const roundedAmount    = Math.round(calculatedAmount);

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

  setAmountValue((prev) => ({
    ...prev,
    unitPrice: amountPerKg,
  }));

  setData((prev) => ({
    ...prev,
    expectedAmount: roundedAmount,
  }));
};

const calculateAmountForBivoltineBonus = () => {
  const amountPerKg = parseFloat(bonusAmountData[0]?.amountPerKg || 0);
  const schemeType = data.schemeType;

  let calculatedAmount = 0;

  if (schemeType === 3 || schemeType === "3") {
    const rawSilk = parseFloat(data.noOfRawSilkProduced || 0);
    calculatedAmount = rawSilk * amountPerKg;
  } else {
    const baseQuantity = parseFloat(data.cocoonsWeight || 0);
    calculatedAmount = baseQuantity * amountPerKg;
  }

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

  setAmountValue((prev) => ({
    ...prev,
    unitPrice: unitCost,
  }));

  setData((prev) => ({
    ...prev,
    expectedAmount: roundedAmount,
  }));
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

      setAmountValue((prev) => ({
          ...prev,
          unitPrice: incentiveData.unitCost,
        }));
        setData((prev) => ({
              ...prev,
              expectedAmount: incentiveData.unitCost,
            }));
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

  // ARM: calculate unit cost directly from ARM Calculation Master data
  if (
    getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Automatic Reeling Machine" ||
    getIncentiveAndBonusData?.[0]?.unitForScheme === "Automatic Reeling Machine Unit"
  ) {
    if (armCalculationData.length > 0) {
      const totalUnitCost = armCalculationData.reduce(
        (s, r) => s + (parseFloat(r.unitCost) || 0), 0
      );
      const centralPct = parseFloat(armCalculationData[0]?.centralPercentage) || 0;
      const statePct   = parseFloat(armCalculationData[0]?.statePercentage)   || 0;
      const subsidyAmt = Math.round(totalUnitCost * (centralPct + statePct) / 100);
      setAmountValue(prev => ({ ...prev, unitPrice: totalUnitCost }));
      setData(prev => ({ ...prev, expectedAmount: subsidyAmt }));
      setUnitPriceCalculated(true);
      Swal.fire({
        icon: "success",
        title: "Unit Price Calculated!",
        html: `
          <table style="width:100%;font-size:13px;border-collapse:collapse;">
            <tr style="background:#f0f4ff;">
              <td style="padding:6px 10px;color:#555;">Unit Cost</td>
              <td style="padding:6px 10px;font-weight:600;color:#222;">₹ ${totalUnitCost.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td style="padding:6px 10px;color:#555;">Subsidy % (Central + State)</td>
              <td style="padding:6px 10px;font-weight:600;color:#222;">${centralPct + statePct}%</td>
            </tr>
            <tr style="background:#e8f5e9;">
              <td style="padding:6px 10px;color:#2d8a4e;font-weight:600;">Subsidy Amount</td>
              <td style="padding:6px 10px;font-weight:700;font-size:14px;color:#2d8a4e;">₹ ${subsidyAmt.toLocaleString("en-IN")}</td>
            </tr>
          </table>`,
        confirmButtonText: "OK",
        confirmButtonColor: "#1a5fa8",
        width: "400px",
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "ARM Ends & Category Required",
        text: "Please select ARM Ends and Category to load the unit cost from ARM Calculation Master.",
        confirmButtonColor: "#f0a500",
      });
    }
    return;
  }

  const incentiveCalcBasedOn = getIncentiveAndBonusData?.[0]?.calculationBasedOn;

  const isSdpRH225OrLowCost =
    incentiveCalcBasedOn === "SDP RH 225" ||
    incentiveCalcBasedOn === "SDP Low Cost Shed";

  if (isSdpRH225OrLowCost) {
    const sqft = Number(developedLand.rhSqft);
    const unitPrice = Number(amountValue.unitPrice);
    const minAmount = Number(amountValue.minAmount);
    const maxAmount = Number(amountValue.maxAmount);

    if (!sqft) {
      Swal.fire({
        icon: "warning",
        title: "Sqft Required",
        html: `<p style="color:#555;font-size:15px;">Please enter the <strong>Constructed Area in Sqft</strong> before calculating.</p>`,
        confirmButtonText: "OK",
        confirmButtonColor: "#f0a500",
        showCloseButton: true,
      });
      return;
    }

    if (!unitPrice) {
      Swal.fire({
        icon: "warning",
        title: "Unit Price Not Available",
        html: `<p style="color:#555;font-size:15px;">Unit Price could not be fetched. Please select <strong>Component</strong> and <strong>Sub Component</strong> first.</p>`,
        confirmButtonText: "OK",
        confirmButtonColor: "#f0a500",
        showCloseButton: true,
      });
      return;
    }

    if (minAmount > 0 && sqft < minAmount) {
      Swal.fire({
        icon: "error",
        title: "No Subsidy Available",
        html: `
          <div style="text-align:center;">
            <div style="font-size:48px;margin-bottom:8px;">🏚️</div>
            <p style="color:#444;font-size:15px;line-height:1.6;">
              The entered area of <strong style="color:#d33;">${sqft} Sqft</strong> is below the
              minimum eligible area of <strong style="color:#2d8a4e;">${minAmount} Sqft</strong>.
            </p>
            <p style="color:#777;font-size:13px;margin-top:8px;">No subsidy can be granted for this value.</p>
          </div>`,
        confirmButtonText: "Understood",
        confirmButtonColor: "#d33",
        background: "#fff9f9",
        showCloseButton: true,
        footer: `<span style="color:#aaa;font-size:12px;">💡 Enter a Sqft value ≥ ${minAmount} to be eligible.</span>`,
      });
      setData((prev) => ({ ...prev, expectedAmount: "", schemeAmount: "" }));
      return;
    }

    const effectiveSqft = (maxAmount > 0 && sqft > maxAmount) ? maxAmount : sqft;
    const totalSubsidy = effectiveSqft * unitPrice;

    setData((prev) => ({
      ...prev,
      expectedAmount: totalSubsidy,
      schemeAmount: totalSubsidy,
    }));
    setUnitPriceCalculated(true);

    const capped = maxAmount > 0 && sqft > maxAmount;
    Swal.fire({
      icon: "success",
      title: "Subsidy Calculated!",
      html: `
        <table style="width:100%;font-size:13px;border-collapse:collapse;">
          <tr style="background:#f0f4ff;">
            <td style="padding:6px 10px;color:#555;">Entered Sqft</td>
            <td style="padding:6px 10px;font-weight:600;color:#222;">${sqft} Sqft</td>
          </tr>
          ${capped ? `<tr><td style="padding:6px 10px;color:#555;">Capped at Max</td><td style="padding:6px 10px;font-weight:600;color:#e65100;">${maxAmount} Sqft</td></tr>` : ""}
          <tr style="background:#f0f4ff;">
            <td style="padding:6px 10px;color:#555;">Unit Price</td>
            <td style="padding:6px 10px;font-weight:600;color:#222;">₹ ${unitPrice}</td>
          </tr>
          <tr style="background:#e8f5e9;">
            <td style="padding:6px 10px;color:#2d8a4e;font-weight:600;">Total Subsidy</td>
            <td style="padding:6px 10px;font-weight:700;font-size:14px;color:#2d8a4e;">₹ ${totalSubsidy.toLocaleString("en-IN")}</td>
          </tr>
        </table>`,
      confirmButtonText: "OK",
      confirmButtonColor: "#2d8a4e",
      background: "#f9fff9",
      width: "340px",
      showCloseButton: true,
    });

    return;
  }

  // All non-SDP paths: mark unit price as calculated
  setUnitPriceCalculated(true);

  if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Registered Private Bivoltine Chawki Rearing Center Subsidy") {
    if (!data.taxAmount || Number(data.taxAmount) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter a valid Tax Invoice Amount.",
      });
      return;
    }

    const totals = calculateTotals(chawkiData);
    const { totalEligible, totalClaimed } = totals;

    let baseAmount = 0;

    if (totalEligible > totalClaimed) {
      baseAmount = totalClaimed;
    } else {
      baseAmount = totalEligible;
    }

    const taxInvoiceAmount = Number(data.taxAmount);
    const finalAmount = taxInvoiceAmount < baseAmount ? taxInvoiceAmount : baseAmount;

    setAmountValue((prev) => ({
      ...prev,
      unitPrice: baseAmount,
    }));

    setEquipment((prev) => ({ ...prev, l1Rate: finalAmount }));

    setData((prev) => ({
      ...prev,
      expectedAmount: finalAmount,
    }));

    Swal.fire({
      icon: "success",
      title: "Calculated Successfully",
      text: `Total Subsidy/Bonus/Incentive Amount = ${finalAmount}`,
    });

    return;
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
  if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Bivoltine Bonus"  &&
  selectedBonusMode === "Automatic") {
    if (!data.scCategoryId || !data.scComponentId || !data.cocoonsWeight) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please fill all required fields." });
      return;
    }
    // 2. Check for required bonus-specific fields
    if ((data.averageYield === "" || data.averageYield === null || data.averageYield === undefined) ||
        (data.noOfCocoonPerKg === "" || data.noOfCocoonPerKg === null || data.noOfCocoonPerKg === undefined)) {
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


 if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Bivoltine Bonus"  &&
  selectedBonusMode === "Manual") {
    if (!data.scCategoryId || !data.scComponentId || !data.cocoonsWeight) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please fill all required fields." });
      return;
    }
    // 2. Check for required bonus-specific fields
    if ((data.averageYield === "" || data.averageYield === null || data.averageYield === undefined) ||
        (data.noOfCocoonPerKg === "" || data.noOfCocoonPerKg === null || data.noOfCocoonPerKg === undefined)) {
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
//   if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Incentive For Bivoltine Cocoons-30/kg-PSF" ||
//     getIncentiveAndBonusData?.[0]?.calculationBasedOn === "North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP"
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
//   getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
//     "Incentive For Bivoltine Cocoons-30/kg-PSF" ||
//   getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
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

//   const calcType = getIncentiveAndBonusData?.[0]?.calculationBasedOn;

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

const calcType = getIncentiveAndBonusData?.[0]?.calculationBasedOn;

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
    const avgYield      = parseFloat(data.averageYield || 0);
    const noOfDfls      = parseFloat(data.lotWeight || 0);
    const minAvgYield   = bonusAmountData[0]?.minAverageYield;
    const maxCocoonsPKg = bonusAmountData[0]?.maxNoOfCocoonsPerKg;

    if (minAvgYield == null || maxCocoonsPKg == null) {
      Swal.fire({
        icon: "error",
        title: "Configuration Not Found",
        text: "Min Average Yield and Max No. of Cocoons Per Kg are not configured. Please configure them in the Configure Bivoltine Amount page.",
      });
      return;
    }

    const minAvgYieldVal   = parseFloat(minAvgYield);
    const maxCocoonsPKgVal = parseFloat(maxCocoonsPKg);

    // Case 3: Average Yield < minAverageYield — block, do not calculate subsidy
    if (avgYield < minAvgYieldVal) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: `Average Yield Should be Above ${minAvgYieldVal}%`,
      });
      return;
    }

    // Case 1: Average Yield > maxNoOfCocoonsPerKg — Cocoons Transacted and Average Yield are
    // shown on screen as the eligible/capped figures (what Calculate produces), but the actual
    // Cocoons Transacted saved to the DB must stay the real, raw transacted quantity. So the
    // raw cocoonsWeight is captured into actualCocoonsTransacted BEFORE it's overwritten for
    // display — the save payload reads actualCocoonsTransacted instead of cocoonsWeight when
    // this scheme has been capped. Average Yield has no such split: it is shown and saved as
    // the capped value.
    if (avgYield > maxCocoonsPKgVal) {
      const eligibleCocoons = parseFloat((noOfDfls * maxCocoonsPKgVal / 100).toFixed(2));
      const amountPerKg     = parseFloat(bonusAmountData[0]?.amountPerKg || 0);
      const roundedAmount   = Math.round(eligibleCocoons * amountPerKg);

      setAmountValue((prev) => ({ ...prev, unitPrice: amountPerKg }));
      setData((prev) => ({
        ...prev,
        expectedAmount: roundedAmount,
        averageYield: maxCocoonsPKgVal,
        actualCocoonsTransacted: prev.cocoonsWeight,
        cocoonsWeight: eligibleCocoons,
      }));
      setUnitPriceCalculated(true);

      Swal.fire({
        icon: "info",
        title: "Subsidy Calculated on Eligible Quantity",
        text: `Average Yield exceeds ${maxCocoonsPKgVal}%. Subsidy is calculated on eligible quantity: ${eligibleCocoons} kg (${noOfDfls} × ${maxCocoonsPKgVal}/100). Average Yield and Cocoons Transacted (kg) shown here reflect the eligible values; the actual transacted quantity is still saved to the record.`,
      });
      return;
    }

    // Case 2: minAvgYieldVal ≤ averageYield ≤ maxCocoonsPKgVal — no capping applies this time,
    // clear out any capped-raw value left over from a previous Calculate click.
    setData((prev) => ({ ...prev, actualCocoonsTransacted: null }));
  }

  // 7. If all validations pass, calculate the bonus
  calculateBonusAmount({ calcType, maxNoOfCocoonsPerKg });
  return;
}


if (
  getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
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
  getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
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
  if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Silk Incentive-PSF") {
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
    getIncentiveAndBonusData?.[0]?.calculationBasedOn === "IMCB-PSF" ||
    getIncentiveAndBonusData?.[0]?.calculationBasedOn === "MERM-PSF"
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

    if (!data.taxAmount || Number(data.taxAmount) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter a valid Tax Invoice Amount.",
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

    const subsidyAmount = Math.round(imcbRecord.unitCost || 0);
    const taxInvoiceAmount = Number(data.taxAmount);

    setAmountValue((prev) => ({
      ...prev,
      unitPrice: subsidyAmount,
    }));

    // If Tax Invoice Amount < Subsidy Amount → use Tax Invoice Amount
    // If Tax Invoice Amount >= Subsidy Amount → no change, use Subsidy Amount
    const finalAmount = taxInvoiceAmount < subsidyAmount ? taxInvoiceAmount : subsidyAmount;

    setEquipment((prev) => ({ ...prev, l1Rate: finalAmount }));
    setData((prev) => ({
      ...prev,
      expectedAmount: finalAmount,
    }));

    setUnitPriceCalculated(true);
    return;
  }


  if (
    getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Adopting Boiler-PSF"
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

    if (!data.taxAmount || Number(data.taxAmount) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter a valid Tax Invoice Amount.",
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

    const subsidyAmount = Math.round(adoptingBoilerRecord.unitCost || 0);
    const taxInvoiceAmount = Number(data.taxAmount);

    setAmountValue((prev) => ({
      ...prev,
      unitPrice: subsidyAmount,
    }));

    // If Tax Invoice Amount < Subsidy Amount → use Tax Invoice Amount
    // If Tax Invoice Amount >= Subsidy Amount → no change, use Subsidy Amount
    const finalAmount = taxInvoiceAmount < subsidyAmount ? taxInvoiceAmount : subsidyAmount;

    setEquipment((prev) => ({ ...prev, l1Rate: finalAmount }));
    setData((prev) => ({
      ...prev,
      expectedAmount: finalAmount,
    }));

    setUnitPriceCalculated(true);
    return;
  }

  if (
    getIncentiveAndBonusData?.[0]?.calculationBasedOn === "ICB-PSF"
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

    if (!data.taxAmount || Number(data.taxAmount) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter a valid Tax Invoice Amount.",
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

    const subsidyAmount = Math.round(icbRecord.unitCost || 0);
    const taxInvoiceAmount = Number(data.taxAmount);

    setAmountValue((prev) => ({
      ...prev,
      unitPrice: subsidyAmount,
    }));

    // If Tax Invoice Amount < Subsidy Amount → use Tax Invoice Amount
    // If Tax Invoice Amount >= Subsidy Amount → no change, use Subsidy Amount
    const finalAmount = taxInvoiceAmount < subsidyAmount ? taxInvoiceAmount : subsidyAmount;

    setEquipment((prev) => ({ ...prev, l1Rate: finalAmount }));
    setData((prev) => ({
      ...prev,
      expectedAmount: finalAmount,
    }));

    setUnitPriceCalculated(true);
    return;
  }

  if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Rearing Equipment SS") {
    if (!data.scSchemeDetailsId || !data.scComponentId || !data.scCategoryId) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill all required fields.",
      });
      return;
    }

    if (!data.taxAmount || Number(data.taxAmount) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter a valid Tax Invoice Amount.",
      });
      return;
    }

    if (!rearingEquipmentSSAmountData || rearingEquipmentSSAmountData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data Found",
        text: "No Rearing Equipment SS data available for selected parameters.",
      });
      return;
    }

    const unitCost = Math.round(rearingEquipmentSSAmountData[0]?.amount || 0);
    const taxInvoiceAmount = Number(data.taxAmount);

    setAmountValue((prev) => ({ ...prev, unitPrice: unitCost }));

    // If Tax Invoice Amount < Unit Cost → use Tax Invoice Amount
    // If Tax Invoice Amount >= Unit Cost → no change, use Unit Cost
    const finalAmount = taxInvoiceAmount < unitCost ? taxInvoiceAmount : unitCost;

    setEquipment((prev) => ({ ...prev, l1Rate: finalAmount }));
    setRearingEquipmentPurchaseList((prev) => prev.map((row) => ({ ...row, l1Rate: finalAmount })));
    setData((prev) => ({
      ...prev,
      expectedAmount: finalAmount,
    }));

    setUnitPriceCalculated(true);
    return;
  }

if (
    getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Reeling Shed-PSF"
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
    getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Adopting Silent Generator"
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

    if (!data.taxAmount || Number(data.taxAmount) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter a valid Tax Invoice Amount.",
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

    const subsidyAmount = Math.round(icbRecord.unitCost || 0);
    const taxInvoiceAmount = Number(data.taxAmount);

    // ✅ Set Unit Price (always the DB subsidy rate)
    setAmountValue((prev) => ({
      ...prev,
      unitPrice: subsidyAmount,
    }));

    // If Tax Invoice Amount < Subsidy Amount → use Tax Invoice Amount
    // If Tax Invoice Amount >= Subsidy Amount → no change, use Subsidy Amount
    const finalAmount = taxInvoiceAmount < subsidyAmount ? taxInvoiceAmount : subsidyAmount;

    setEquipment((prev) => ({ ...prev, l1Rate: finalAmount }));
    setData((prev) => ({
      ...prev,
      expectedAmount: finalAmount,
    }));

    setUnitPriceCalculated(true);
    return;
  }

  if (
    getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Adopting Solar power Generator"
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

    if (!data.taxAmount || Number(data.taxAmount) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter a valid Tax Invoice Amount.",
      });
      return;
    }

    if (!reelinShedAmountData || reelinShedAmountData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data Found",
        text: "No Adopting Solar power Generator data available for selected parameters.",
      });
      return;
    }

    const icbRecord = reelinShedAmountData[0];
    const subsidyAmount = Math.round(icbRecord.unitCost || 0);
    const taxInvoiceAmount = Number(data.taxAmount);

    // ✅ Set Unit Price (always the DB subsidy rate)
    setAmountValue((prev) => ({
      ...prev,
      unitPrice: subsidyAmount,
    }));

    // If Tax Invoice Amount < Subsidy Amount → base calculation on Tax Invoice Amount
    // If Tax Invoice Amount >= Subsidy Amount → no change, use Subsidy Amount
    const finalAmount = taxInvoiceAmount < subsidyAmount ? taxInvoiceAmount : subsidyAmount;

    setEquipment((prev) => ({ ...prev, l1Rate: finalAmount }));
    setData((prev) => ({
      ...prev,
      expectedAmount: finalAmount,
    }));

    setUnitPriceCalculated(true);
    return;
  }


  if (
  getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Adopting Solar Water Heater"
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

  if (!data.taxAmount || Number(data.taxAmount) <= 0) {
    Swal.fire({
      icon: "warning",
      title: "Validation Error",
      text: "Please enter a valid Tax Invoice Amount.",
    });
    return;
  }

  // ✅ Validate API data
  if (
    !reelingShedSolarWaterHeaterAmountData ||
    reelingShedSolarWaterHeaterAmountData.length === 0
  ) {
    Swal.fire({
      icon: "warning",
      title: "No Data Found",
      text: "No Adopting Solar Water Heater data available for selected parameters.",
    });
    return;
  }

  // ✅ Get first record
  const icbRecord = reelingShedSolarWaterHeaterAmountData[0];

  const subsidyAmount = Math.round(icbRecord.unitCost || 0);
  const taxInvoiceAmount = Number(data.taxAmount);

  // ✅ Set Unit Price (always the DB subsidy rate)
  setAmountValue((prev) => ({
    ...prev,
    unitPrice: subsidyAmount,
  }));

  // If Tax Invoice Amount < Subsidy Amount → base calculation on Tax Invoice Amount
  // If Tax Invoice Amount >= Subsidy Amount → no change, use Subsidy Amount
  const finalAmount = taxInvoiceAmount < subsidyAmount ? taxInvoiceAmount : subsidyAmount;

  setEquipment((prev) => ({ ...prev, l1Rate: finalAmount }));
  setData((prev) => ({
    ...prev,
    expectedAmount: subsidyAmount,
  }));

  setUnitPriceCalculated(true);
  return;
}


  // ✅ Adopting Heat Recovery Unit - PSF
  if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Adopting Heat Recovery Unit-PSF") {
    if (!data.scSchemeDetailsId || !data.scSubSchemeDetailsId || !data.scComponentId) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill all required fields.",
      });
      return;
    }

    if (!data.taxAmount || Number(data.taxAmount) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter a valid Tax Invoice Amount.",
      });
      return;
    }

    // unitPrice is set by getHeadAccountList when scheme/subscheme/component are selected
    const subsidyAmount = Number(amountValue.unitPrice) || Number(scHeadAccountListData) || 0;
    const taxInvoiceAmount = Number(data.taxAmount);

    // If Tax Invoice Amount < Subsidy Amount → base calculation on Tax Invoice Amount
    // If Tax Invoice Amount >= Subsidy Amount → no change, use Subsidy Amount
    const finalAmount = taxInvoiceAmount < subsidyAmount ? taxInvoiceAmount : subsidyAmount;

    setAmountValue((prev) => ({ ...prev, unitPrice: subsidyAmount }));
    setEquipment((prev) => ({ ...prev, l1Rate: finalAmount }));
    setData((prev) => ({
      ...prev,
      expectedAmount: finalAmount,
    }));

    setUnitPriceCalculated(true);
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
//   getIncentiveAndBonusData?.[0]?.calculationBasedOn === 
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

// if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Registered Private Bivoltine Chawki Rearing Center Subsidy") {
      
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

//   const [chawkiData, setChawkiData] = useState({
//   equipmentList: [],  // repeating rows
//   mulberry: {
//     eligible: 0,
//     claimed: "",
//     percentage: ""
//   },
//   drip: {
//     eligible: 0,
//     claimed: "",
//     percentage: ""
//   },
//   building: {
//     eligible: 0,
//     claimed: "",
//     percentage: ""
//   }
// });

const [chawkiData, setChawkiData] = useState({
  equipmentList: [],
  mulberry: {
    eligible: 0,
    claimed: "",
    percentage: "",
    district: "",
    taluk: "",
    village: "",
    tsc: "",
    trainingFromDate: "",
    trainingToDate: "",
    registerDate: "",
    registerNo: "",
    surveyNo: "",
    acre: "",
    vibhaga: ""
  },
  drip: {
    eligible: 0,
    claimed: "",
    percentage: ""
  },
  building: {
    eligible: 0,
    claimed: "",
    percentage: "",
    district: "",
    taluk: "",
    village: "",
    tsc: "",
    surveyNo: "",
    acre: "",
    sqft: "",
    length: "",
    breadth: ""
  },
  equipment: {
    district: "",
    taluk: "",
    village: "",
    tsc: "",
    place: ""
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
        percentage: "",
        district: "",
        taluk: "",
        village: "",
        tsc: "",
        trainingFromDate: "",
        trainingToDate: "",
        registerDate: "",
        registerNo: "",
        surveyNo: "",
        acre: "",
        vibhaga: ""
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
        percentage: "",

        district: "",
          taluk: "",
          village: "",
          tsc: "",
          surveyNo: "",
          acre: "",
          sqft: "",
          length: "",
          breadth: ""
      },

      equipment: {
          // input fields - null by default
          district: "",
          taluk: "",
          village: "",
          tsc: "",
          place: ""
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

      setAmountValue((prev) => ({
          ...prev,
          unitPrice: incentiveData.unitCost,
        }));
        setData((prev) => ({
              ...prev,
              expectedAmount: incentiveData.unitCost,
            }));
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
    const timer = setTimeout(() => {
      getImcbAndMermAmountList(
        data.imcbTable,
        data.scSubSchemeDetailsId,
        data.scComponentId,
        data.scCategoryId
      );
    }, 500);
    return () => clearTimeout(timer);
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
      const incentiveData = response.data?.content?.configureAdoptingBoiler || [];
      setAdoptingBoilerAmountListData(incentiveData);

      setAmountValue((prev) => ({
          ...prev,
          unitPrice: incentiveData.unitCost,
        }));
        setData((prev) => ({
              ...prev,
              expectedAmount: incentiveData.unitCost,
            }));
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
    const timer = setTimeout(() => {
      getAdoptingBoilerAmountList(
        data.boilerInKg,
        data.scSubSchemeDetailsId,
        data.scComponentId,
        data.scCategoryId
      );
    }, 500);
    return () => clearTimeout(timer);
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
      const incentiveData = response.data?.content?.configureIcb || [];
      setIcbAndArmAmountListData(incentiveData);

      setAmountValue((prev) => ({
          ...prev,
          unitPrice: incentiveData.unitCost,
        }));
        setData((prev) => ({
              ...prev,
              expectedAmount: incentiveData.unitCost,
            }));
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
    const timer = setTimeout(() => {
      getIcbAndArmAmountList(
        data.icbBasinEnds,
        data.scSubSchemeDetailsId,
        data.scComponentId,
        data.scCategoryId
      );
    }, 500);
    return () => clearTimeout(timer);
  }
}, [data.icbBasinEnds,data.scSubSchemeDetailsId, data.scComponentId, data.scCategoryId]);

const [rearingEquipmentSSAmountData, setRearingEquipmentSSAmountData] = useState([]);

const getRearingEquipmentSSAmountList = (scSchemeDetailsId, componentId, categoryId) => {
  api
    .get(`${baseURLDBT}configureRHAmount/get-amount-by-scheme-category-and-component`, {
      params: { scSchemeDetailsId, componentId, categoryId }
    })
    .then((response) => {
      const list = response.data.content.configureRHAmount || [];
      setRearingEquipmentSSAmountData(list);
      if (list.length > 0) {
        const unitCost = Math.round(list[0]?.amount || 0);
        setAmountValue((prev) => ({ ...prev, unitPrice: unitCost }));
      }
    })
    .catch(() => {
      setRearingEquipmentSSAmountData([]);
    });
};

useEffect(() => {
  if (
    getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Rearing Equipment SS" &&
    data.scSchemeDetailsId &&
    data.scComponentId &&
    data.scCategoryId
  ) {
    const timer = setTimeout(() => {
      getRearingEquipmentSSAmountList(
        data.scSchemeDetailsId,
        data.scComponentId,
        data.scCategoryId
      );
    }, 500);
    return () => clearTimeout(timer);
  }
}, [data.scSchemeDetailsId, data.scComponentId, data.scCategoryId, getIncentiveAndBonusData]);

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



const isUserValid = React.useMemo(() => {
  return data.userId !== "" && data.userId !== null && data.userId !== undefined;
}, [data.userId]);



  const postData = (event) => {
    event.preventDefault(); // Prevent the default form submission
    const form = event.currentTarget;

    const localStorageUserId = localStorage.getItem("userMasterId");
    if (!localStorageUserId || localStorageUserId === "null") {
      Swal.fire({
        icon: "warning",
        title: "Please Select User Master",
        text: "Please Select User Master and Save",
        confirmButtonColor: "#1e67a8",
      });
      return;
    }

    if (!isUserValid) {
      Swal.fire({
        icon: "warning",
        title: "Please Select User Master",
        text: "Please Select User Master and Save",
        confirmButtonColor: "#1e67a8",
      });
      return;
    }

    // Validate the form
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return; // Exit if the form is not valid
    }

    // All schemes: Calculate Unit Price must be clicked and amount must not be 0/empty
    const _unitPrice = Number(amountValue.unitPrice);
    if (!unitPriceCalculated || !amountValue.unitPrice || _unitPrice === 0) {
      Swal.fire({
        icon: "warning",
        title: `<span style="font-size:16px;font-weight:700;color:#b45309;">⚠ Cannot Save Application</span>`,
        html: `
          <div style="text-align:center;padding:4px 0 8px;">
            <div style="display:inline-flex;align-items:center;justify-content:center;width:54px;height:54px;border-radius:50%;background:#fef3c7;margin-bottom:12px;">
              <span style="font-size:26px;">🧮</span>
            </div>
            <div style="font-size:13.5px;color:#374151;line-height:1.7;margin-bottom:8px;">
              ${!unitPriceCalculated
                ? `Please click <strong style="color:#1a5fa8;">⚙ Calculate Unit Price</strong> before saving.`
                : `The calculated subsidy amount is <strong style="color:#dc2626;">₹ 0</strong> or empty.<br/>Please verify your inputs and recalculate.`
              }
            </div>
            <div style="background:#fef9ee;border:1px solid #fde68a;border-radius:7px;padding:8px 14px;font-size:12px;color:#92400e;display:inline-block;">
              Application cannot be saved without a valid subsidy amount.
            </div>
          </div>
        `,
        confirmButtonText: "OK, Got it",
        confirmButtonColor: "#1a5fa8",
        background: "#fffbf0",
        width: "400px",
        customClass: { popup: "swal2-border-radius" },
      });
      return;
    }

    // Silk Samagra State / Silk Samagra Central: validate Land Wise Constructed Area (skip for ARM)
    if (
      (schemeDetails.calculationBasedOn === "Silk Samagra State" ||
      schemeDetails.calculationBasedOn === "Silk Samagra Central") &&
      getIncentiveAndBonusData?.[0]?.unitForScheme !== "Automatic Reeling Machine Unit"
    ) {
      const missingFields = [];
      if (!data.equordev.includes("land")) {
        missingFields.push("Land Wise Details (please check the Land Wise checkbox)");
      // }
      } else if (landDetailsIds.length === 0) {
        missingFields.push("Land Wise Details (Please check at least one land from the Land Wise table.)");
      }
      if (!data.equordev.includes("constructedArea")) {
        missingFields.push("Constructed Area Details (please check the Constructed Area checkbox)");
      }
      if (missingFields.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "⚠️ Missing Details",
          html: `
            <div style="text-align:center; margin-bottom:10px; font-size:15px; color:#555;">
              Please provide the following required details before proceeding:
            </div>
            <ul style="
              text-align:left;
              padding-left:20px;
              margin:0 auto;
              display:inline-block;
              font-size:14px;
              color:#333;
              line-height:2;
            ">
              ${missingFields.map(f => `<li style="margin-bottom:4px;">✖ ${f}</li>`).join("")}
            </ul>
          `,
          confirmButtonText: "OK, Got it!",
          confirmButtonColor: "#f0a500",
          background: "#fff8f0",
          customClass: {
            title: "swal-title-style",
            popup: "swal-popup-style",
          },
        });
        return;
      }
    }

    // Incentive For Bivoltine Cocoons-30/kg-PSF: the min-yield gate (using the configured
    // minAverageYield, not a hardcoded number) already runs inside "Calculate Unit Price"
    // (see Case 3 above), and unitPriceCalculated already blocks save until Calculate has
    // run — so no separate hardcoded 60/90 recheck is needed here. Yield above the
    // configured max slab is the normal case Calculate already handles by capping the
    // eligible quantity, not by rejecting the save.

    // ARM: validate all Reeler Land Details fields are filled
    if (getIncentiveAndBonusData?.[0]?.unitForScheme === "Automatic Reeling Machine Unit") {
      const armMissingFields = [];
      if (!data.armLandType)    armMissingFields.push("Land Type");
      if (!data.armDistrictId)  armMissingFields.push("District");
      if (!data.armTalukId)     armMissingFields.push("Taluk");
      if (!data.armHobliId)     armMissingFields.push("Hobli");
      if (!data.armVillageId)   armMissingFields.push("Village");
      if (!data.armAddress)     armMissingFields.push("Address");
      if (!data.armOwnerName)   armMissingFields.push("Owner Name");
      if (!data.armSurveyNo)    armMissingFields.push("Survey No. / Property No.");
      if (!data.armAssessmentNo) armMissingFields.push("Assessment No.");
      if (armMissingFields.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "⚠️ Missing Reeler Land Details",
          html: `
            <div style="text-align:center; margin-bottom:10px; font-size:15px; color:#555;">
              Please fill in all required Reeler Land Details before saving:
            </div>
            <ul style="
              text-align:left;
              padding-left:20px;
              margin:0 auto;
              display:inline-block;
              font-size:14px;
              color:#333;
              line-height:2;
            ">
              ${armMissingFields.map(f => `<li style="margin-bottom:4px;">✖ ${f}</li>`).join("")}
            </ul>
          `,
          confirmButtonText: "OK, Got it!",
          confirmButtonColor: "#f0a500",
          background: "#fff8f0",
          customClass: {
            title: "swal-title-style",
            popup: "swal-popup-style",
          },
        });
        return;
      }
    }

    // Reeling Shed-PSF: validate Kanesh Land Details and Constructed Area
    if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Reeling Shed-PSF") {
      const missingFields = [];
      if (data.addKaneshLand !== "yes") {
        missingFields.push("Kanesh Land Details (please select 'Yes' to add Kanesh Land Details)");
      }
      if (!data.equordev.includes("constructedArea")) {
        missingFields.push("Constructed Area Details (please check the Constructed Area checkbox)");
      }
      if (missingFields.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "⚠️ Missing Details",
          html: `
            <div style="text-align:center; margin-bottom:10px; font-size:15px; color:#555;">
              Please provide the following required details before proceeding:
            </div>
            <ul style="
              text-align:left;
              padding-left:20px;
              margin:0 auto;
              display:inline-block;
              font-size:14px;
              color:#333;
              line-height:2;
            ">
              ${missingFields.map(f => `<li style="margin-bottom:4px;">✖ ${f}</li>`).join("")}
            </ul>
          `,
          confirmButtonText: "OK, Got it!",
          confirmButtonColor: "#f0a500",
          background: "#fff8f0",
          customClass: {
            title: "swal-title-style",
            popup: "swal-popup-style",
          },
        });
        return;
      }
    }

    // ISCB-PSF: validate Kanesh Land Details and Equipment Purchase
    if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "ICB-PSF") {
      const missingFields = [];
      // if (data.addKaneshLand !== "yes") {
      //   missingFields.push("Kanesh Land Details (please select 'Yes' to add Kanesh Land Details)");
      // }
      if (!data.equordev.includes("equipment")) {
        missingFields.push("Equipment Purchase (please check the Equipment Purchase checkbox)");
      } else {
        if (!equipment.vendorId) missingFields.push("Vendor Name in Equipment Purchase");
        if (!equipment.l1Rate) missingFields.push("L1 Rate in Equipment Purchase");
      }
      if (missingFields.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "⚠️ Missing Details",
          html: `
            <div style="text-align:center; margin-bottom:10px; font-size:15px; color:#555;">
              Please provide the following required details before proceeding:
            </div>
            <ul style="
              text-align:left;
              padding-left:20px;
              margin:0 auto;
              display:inline-block;
              font-size:14px;
              color:#333;
              line-height:2;
            ">
              ${missingFields.map(f => `<li style="margin-bottom:4px;">✖ ${f}</li>`).join("")}
            </ul>
          `,
          confirmButtonText: "OK, Got it!",
          confirmButtonColor: "#f0a500",
          background: "#fff8f0",
          customClass: {
            title: "swal-title-style",
            popup: "swal-popup-style",
          },
        });
        return;
      }
    }

    // MERM-PSF: validate Constructed Area and Equipment Purchase
    if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "MERM-PSF") {
      const missingFields = [];
      if (!data.equordev.includes("constructedArea")) {
        missingFields.push("Constructed Area Details (please check the Constructed Area checkbox)");
      }
      if (!data.equordev.includes("equipment")) {
        missingFields.push("Equipment Purchase (please check the Equipment Purchase checkbox)");
      } else {
        if (!equipment.vendorId) missingFields.push("Vendor Name in Equipment Purchase");
        if (!equipment.l1Rate) missingFields.push("L1 Rate in Equipment Purchase");
      }
      if (missingFields.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "⚠️ Missing Details",
          html: `
            <div style="text-align:center; margin-bottom:10px; font-size:15px; color:#555;">
              Please provide the following required details before proceeding:
            </div>
            <ul style="
              text-align:left;
              padding-left:20px;
              margin:0 auto;
              display:inline-block;
              font-size:14px;
              color:#333;
              line-height:2;
            ">
              ${missingFields.map(f => `<li style="margin-bottom:4px;">✖ ${f}</li>`).join("")}
            </ul>
          `,
          confirmButtonText: "OK, Got it!",
          confirmButtonColor: "#f0a500",
          background: "#fff8f0",
          customClass: {
            title: "swal-title-style",
            popup: "swal-popup-style",
          },
        });
        return;
      }
    }

    // IMCB-PSF: validate Equipment Purchase
    if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "IMCB-PSF") {
      const missingFields = [];
      if (!data.equordev.includes("equipment")) {
        missingFields.push("Equipment Purchase (please check the Equipment Purchase checkbox)");
      } else {
        if (!equipment.vendorId) missingFields.push("Vendor Name in Equipment Purchase");
        if (!equipment.l1Rate) missingFields.push("L1 Rate in Equipment Purchase");
      }
      if (missingFields.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "⚠️ Missing Details",
          html: `
            <div style="text-align:center; margin-bottom:10px; font-size:15px; color:#555;">
              Please provide the following required details before proceeding:
            </div>
            <ul style="
              text-align:left;
              padding-left:20px;
              margin:0 auto;
              display:inline-block;
              font-size:14px;
              color:#333;
              line-height:2;
            ">
              ${missingFields.map(f => `<li style="margin-bottom:4px;">✖ ${f}</li>`).join("")}
            </ul>
          `,
          confirmButtonText: "OK, Got it!",
          confirmButtonColor: "#f0a500",
          background: "#fff8f0",
          customClass: {
            title: "swal-title-style",
            popup: "swal-popup-style",
          },
        });
        return;
      }
    }

    // Adopting Boiler-PSF: validate Equipment Purchase
    if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Adopting Boiler-PSF") {
      const missingFields = [];
      if (!data.equordev.includes("equipment")) {
        missingFields.push("Equipment Purchase (please check the Equipment Purchase checkbox)");
      } else {
        if (!equipment.vendorId) missingFields.push("Vendor Name in Equipment Purchase");
        if (!equipment.l1Rate) missingFields.push("L1 Rate in Equipment Purchase");
      }
      if (missingFields.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "⚠️ Missing Details",
          html: `
            <div style="text-align:center; margin-bottom:10px; font-size:15px; color:#555;">
              Please provide the following required details before proceeding:
            </div>
            <ul style="
              text-align:left;
              padding-left:20px;
              margin:0 auto;
              display:inline-block;
              font-size:14px;
              color:#333;
              line-height:2;
            ">
              ${missingFields.map(f => `<li style="margin-bottom:4px;">✖ ${f}</li>`).join("")}
            </ul>
          `,
          confirmButtonText: "OK, Got it!",
          confirmButtonColor: "#f0a500",
          background: "#fff8f0",
          customClass: {
            title: "swal-title-style",
            popup: "swal-popup-style",
          },
        });
        return;
      }
    }

    // Adopting Silent Generator: validate Equipment Purchase
    if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Adopting Silent Generator") {
      const missingFields = [];
      if (!data.equordev.includes("equipment")) {
        missingFields.push("Equipment Purchase (please check the Equipment Purchase checkbox)");
      } else {
        if (!equipment.vendorId) missingFields.push("Vendor Name in Equipment Purchase");
        if (!equipment.l1Rate) missingFields.push("L1 Rate in Equipment Purchase");
      }
      if (missingFields.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "⚠️ Missing Details",
          html: `
            <div style="text-align:center; margin-bottom:10px; font-size:15px; color:#555;">
              Please provide the following required details before proceeding:
            </div>
            <ul style="
              text-align:left;
              padding-left:20px;
              margin:0 auto;
              display:inline-block;
              font-size:14px;
              color:#333;
              line-height:2;
            ">
              ${missingFields.map(f => `<li style="margin-bottom:4px;">✖ ${f}</li>`).join("")}
            </ul>
          `,
          confirmButtonText: "OK, Got it!",
          confirmButtonColor: "#f0a500",
          background: "#fff8f0",
          customClass: {
            title: "swal-title-style",
            popup: "swal-popup-style",
          },
        });
        return;
      }
    }

    // Adopting Solar power Generator: validate Equipment Purchase
    if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Adopting Solar power Generator") {
      const missingFields = [];
      if (!data.equordev.includes("equipment")) {
        missingFields.push("Equipment Purchase (please check the Equipment Purchase checkbox)");
      } else {
        if (!equipment.vendorId) missingFields.push("Vendor Name in Equipment Purchase");
        if (!equipment.l1Rate) missingFields.push("L1 Rate in Equipment Purchase");
      }
      if (missingFields.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "⚠️ Missing Details",
          html: `
            <div style="text-align:center; margin-bottom:10px; font-size:15px; color:#555;">
              Please provide the following required details before proceeding:
            </div>
            <ul style="
              text-align:left;
              padding-left:20px;
              margin:0 auto;
              display:inline-block;
              font-size:14px;
              color:#333;
              line-height:2;
            ">
              ${missingFields.map(f => `<li style="margin-bottom:4px;">✖ ${f}</li>`).join("")}
            </ul>
          `,
          confirmButtonText: "OK, Got it!",
          confirmButtonColor: "#f0a500",
          background: "#fff8f0",
          customClass: {
            title: "swal-title-style",
            popup: "swal-popup-style",
          },
        });
        return;
      }
    }

    // Adopting Solar Water Heater: validate Equipment Purchase
    if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Adopting Solar Water Heater") {
      const missingFields = [];
      if (!data.equordev.includes("equipment")) {
        missingFields.push("Equipment Purchase (please check the Equipment Purchase checkbox)");
      } else {
        if (!equipment.vendorId) missingFields.push("Vendor Name in Equipment Purchase");
        if (!equipment.l1Rate) missingFields.push("L1 Rate in Equipment Purchase");
      }
      if (missingFields.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "⚠️ Missing Details",
          html: `
            <div style="text-align:center; margin-bottom:10px; font-size:15px; color:#555;">
              Please provide the following required details before proceeding:
            </div>
            <ul style="
              text-align:left;
              padding-left:20px;
              margin:0 auto;
              display:inline-block;
              font-size:14px;
              color:#333;
              line-height:2;
            ">
              ${missingFields.map(f => `<li style="margin-bottom:4px;">✖ ${f}</li>`).join("")}
            </ul>
          `,
          confirmButtonText: "OK, Got it!",
          confirmButtonColor: "#f0a500",
          background: "#fff8f0",
          customClass: {
            title: "swal-title-style",
            popup: "swal-popup-style",
          },
        });
        return;
      }
    }

    // Adopting Heat Recovery Unit-PSF: validate Equipment Purchase
    if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Adopting Heat Recovery Unit-PSF") {
      const missingFields = [];
      if (!data.equordev.includes("equipment")) {
        missingFields.push("Equipment Purchase (please check the Equipment Purchase checkbox)");
      } else {
        if (!equipment.vendorId) missingFields.push("Vendor Name in Equipment Purchase");
        if (!equipment.l1Rate) missingFields.push("L1 Rate in Equipment Purchase");
      }
      if (missingFields.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "⚠️ Missing Details",
          html: `
            <div style="text-align:center; margin-bottom:10px; font-size:15px; color:#555;">
              Please provide the following required details before proceeding:
            </div>
            <ul style="
              text-align:left;
              padding-left:20px;
              margin:0 auto;
              display:inline-block;
              font-size:14px;
              color:#333;
              line-height:2;
            ">
              ${missingFields.map(f => `<li style="margin-bottom:4px;">✖ ${f}</li>`).join("")}
            </ul>
          `,
          confirmButtonText: "OK, Got it!",
          confirmButtonColor: "#f0a500",
          background: "#fff8f0",
          customClass: {
            title: "swal-title-style",
            popup: "swal-popup-style",
          },
        });
        return;
      }
    }

    // Rearing Equipment SS: validate Equipment Purchase, Constructed Area and Kanesh Land Details
    if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Rearing Equipment SS") {
      const missingFields = [];
      if (!data.equordev.includes("land")) {
        missingFields.push("Land Wise Details (please check the Land Wise checkbox)");
      }
      if (!data.equordev.includes("constructedArea")) {
        missingFields.push("Constructed Area Details (please check the Constructed Area checkbox)");
      }
      if (rearingEquipmentPurchaseList.some((item) => !item.l1Rate)) {
        missingFields.push("L1 Rate in Equipment Purchase (required for all rows)");
      }
      if (missingFields.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "⚠️ Missing Details",
          html: `
            <div style="text-align:center; margin-bottom:10px; font-size:15px; color:#555;">
              Please provide the following required details before proceeding:
            </div>
            <ul style="
              text-align:left;
              padding-left:20px;
              margin:0 auto;
              display:inline-block;
              font-size:14px;
              color:#333;
              line-height:2;
            ">
              ${missingFields.map(f => `<li style="margin-bottom:4px;">✖ ${f}</li>`).join("")}
            </ul>
          `,
          confirmButtonText: "OK, Got it!",
          confirmButtonColor: "#f0a500",
          background: "#fff8f0",
          customClass: {
            title: "swal-title-style",
            popup: "swal-popup-style",
          },
        });
        return;
      }
    }

    // Monthly Frequency: Month is mandatory when the selected sub scheme is configured
    // with monthlyFrequency === true.
    if (getIncentiveAndBonusData?.[0]?.monthlyFrequency === true && !data.monthYear) {
      Swal.fire({
        icon: "warning",
        title: "Month Required",
        text: "Please select a Month.",
      });
      return;
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
    chawkiRearingBuildingPercentageOfSubsidyAmount: Number(chawkiData.building.percentage || 0),

    // Establishment of Mulberry new fields
    establishmentOfMulberryDistrict: chawkiData.mulberry.district,
    establishmentOfMulberryTaluk: chawkiData.mulberry.taluk,
    establishmentOfMulberryVillage: chawkiData.mulberry.village,
    establishmentOfMulberryTsc: chawkiData.mulberry.tsc,
    establishmentOfMulberryTrainingFromDate: chawkiData.mulberry.trainingFromDate,
    establishmentOfMulberryTrainingToDate: chawkiData.mulberry.trainingToDate,
    establishmentOfMulberryRegisterDate: chawkiData.mulberry.registerDate,
    establishmentOfMulberryRegisterNo: chawkiData.mulberry.registerNo,
    establishmentOfMulberrySurveyNo: chawkiData.mulberry.surveyNo,
    establishmentOfMulberryAcre: chawkiData.mulberry.acre,
    establishmentOfMulberryVibhaga: chawkiData.mulberry.vibhaga,

    // Chawki Rearing Building new fields
    chawkiRearingBuildingDistrict: chawkiData.building.district,
    chawkiRearingBuildingTaluk: chawkiData.building.taluk,
    chawkiRearingBuildingVillage: chawkiData.building.village,
    chawkiRearingBuildingTsc: chawkiData.building.tsc,
    chawkiRearingBuildingSurveyNo: chawkiData.building.surveyNo,
    chawkiRearingBuildingAcre: chawkiData.building.acre,
    chawkiRearingBuildingSqft: chawkiData.building.sqft,
    chawkiRearingBuildingLength: chawkiData.building.length,
    chawkiRearingBuildingBreadth: chawkiData.building.breadth,

    // Purchase of Equipment new fields
    purchaseOfEquipmentDistrict: chawkiData.equipment.district,
    purchaseOfEquipmentTaluk: chawkiData.equipment.taluk,
    purchaseOfEquipmentVillage: chawkiData.equipment.village,
    purchaseOfEquipmentTsc: chawkiData.equipment.tsc,
    purchaseOfEquipmentPlace: chawkiData.equipment.place,
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
      vendorId: getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Rearing Equipment SS" ? data.vendorId : equipment.vendorId,
      spacingId: data.spacingId,
      hectareId: data.hectareId,
      cocoonsWeight: data.actualCocoonsTransacted ?? data.cocoonsWeight,
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
      l1Rate: equipment.l1Rate,
      loggedInUserId: localStorage.getItem("userMasterId"),
      month:
        getIncentiveAndBonusData?.[0]?.monthlyFrequency === true && data.monthYear
          ? data.monthYear
          : getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Silk Incentive-PSF" && data.fromMonth && data.toMonth
          ? `${data.fromMonth}-${data.toMonth}`
          : data.month,
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
      length: developedLand.length,
      breadth: developedLand.breadth,
      height: developedLand.height,
      roofTypeId: developedLand.roofTypeId,
      raceId:data.raceId,
      renditta:data.renditta,
      silkTable: data.silkTable,
      noOfCocoonsNeedToProduce:data.noOfCocoonsNeedToProduce,
      // noOfRawSilkProduced is a String column on sc_application_form_service
      // (ApplicationFormRequest.noOfRawSilkProduced is typed String too), so the
      // summed total is explicitly stringified rather than left as a JS number —
      // and rounded to 2dp first since summing row inputs in JS float arithmetic
      // can otherwise produce trailing-digit artifacts (e.g. 35.699999999999996).
      noOfRawSilkProduced: getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Silk Incentive-PSF"
        ? String(Math.round(silkIncentiveList.reduce((sum, r) => sum + (parseFloat(r.noOfRawSilkProduced) || 0), 0) * 100) / 100)
        : data.noOfRawSilkProduced,
      silkExchangeId: getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Silk Incentive-PSF"
        ? (Number(silkIncentiveList[0]?.silkExchangeId) || null)
        : data.silkExchangeId,
      form17JNo: getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Silk Incentive-PSF"
        ? silkIncentiveList.map((r) => r.form17JNo).join(",")
        : data.form17JNo,
      equipmentDate: getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Silk Incentive-PSF"
        ? silkIncentiveList.map((r) => {
            if (!r.equipmentDate) return "";
            const d = new Date(r.equipmentDate);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          }).join(",")
        : "",
      dailyLimit: data.dailyLimit,
       monthlyLimit:data.monthlyLimit,
      boilerInKg: data.boilerInKg,
      sanctionNo: data.sanctionNo,
      marketId: data.marketId,
      taxInvoiceNo: data.taxInvoiceNo,
      taxInvoiceDate: data.taxInvoiceDate,
      rearingEquipmentDetailsId: data.rearingEquipmentDetailsId,
      beneficiaryShareAmount: data.beneficiaryShareAmount,
      subsidyAmount: data.subsidyAmount,
      shareInPercentage: sharePercentage,
      unitPrice: [
        "IMCB-PSF", "MERM-PSF", "Adopting Heat Recovery Unit-PSF",
        "Adopting Solar Water Heater", "Adopting Solar power Generator",
        "Adopting Silent Generator", "Adopting Boiler-PSF", "ICB-PSF",
        "Rearing Equipment SS", "Registered Private Bivoltine Chawki Rearing Center Subsidy"
      ].includes(getIncentiveAndBonusData?.[0]?.calculationBasedOn)
        ? data.expectedAmount
        : amountValue.unitPrice,
      equipmentEligibleTotal: totals.equipmentEligibleTotal,
      equipmentMaxSubsidyTotal: totals.equipmentMaxSubsidyTotal,
    equipmentPurchasedTotal: totals.equipmentPurchasedTotal,
    equipmentPercentageTotal: totals.equipmentPercentageTotal,
    totalClaimed: totals.totalClaimed,
    totalEligible: totals.totalEligible,
    totalSubsidy: totals.totalSubsidy,
    alreadyPaidAmount: data.alreadyPaidAmount,
    stateAmount: data.stateAmount,
    newFinancialYear: data.newFinancialYear,
    year: data.year,
    taxAmount: data.taxAmount,
    // ARM Unit fields (Automatic Reeling Machine Unit)
    armEnds: data.armEnds || null,
    armUnitName: data.armUnitName || null,
    armUnitAddress: data.armUnitAddress || null,
    armLandType: data.armLandType || null,
    armLandDistrictId: data.armDistrictId || null,
    armLandTalukId: data.armTalukId || null,
    armLandHobliId: data.armHobliId || null,
    armLandVillageId: data.armVillageId || null,
    armLandAddress: data.armAddress || null,
    armLandOwnerName: data.armOwnerName || null,
    armLandSurveyNo: data.armSurveyNo || null,
    armLandAssessmentNo: data.armAssessmentNo || null,
      chawkiSanctionOrderList: chawkiSanctionOrderList
    };

    // Check what checkboxes are selected and build the request accordingly
    if (data.equordev.includes("land")) {
      sendPost.dbtFarmerLandDetailsRequestList = transformedData; // Include land details
    }
    if (getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Rearing Equipment SS") {
      sendPost.equipmentTableRequestList = rearingEquipmentPurchaseList.map((item) => ({
        eDescription: item.description || null,
        eL1Rate: item.l1Rate || null,
        eMachineTypeId: item.machineTypeId ? parseInt(item.machineTypeId, 10) : null,
        eMachineQuantity: item.machineQuantity ? parseFloat(item.machineQuantity) : null,
        eTaxInvoiceNo: item.taxInvoiceNo || null,
        eTaxInvoiceDate: item.taxInvoiceDate ? formatDate(item.taxInvoiceDate) : null,
      }));
    } else if (data.equordev.includes("equipment")) {
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

  // ARM: Auto-fill Unit Cost + Subsidy Amount when armCalculationData changes
  useEffect(() => {
    if (armCalculationData.length > 0) {
      const totalUnitCost = armCalculationData.reduce(
        (s, item) => s + (parseFloat(item.unitCost) || 0), 0
      );
      const centralPct = parseFloat(armCalculationData[0]?.centralPercentage) || 0;
      const statePct   = parseFloat(armCalculationData[0]?.statePercentage)   || 0;
      const subsidyAmt = Math.round(totalUnitCost * (centralPct + statePct) / 100);
      if (totalUnitCost > 0) {
        setAmountValue(prev => ({ ...prev, unitPrice: totalUnitCost }));
        setData(prev => ({ ...prev, expectedAmount: subsidyAmt }));
        setUnitPriceCalculated(true);
      }
    } else if (armCalculationData.length === 0 && data.armEnds) {
      setAmountValue(prev => ({ ...prev, unitPrice: "" }));
      setData(prev => ({ ...prev, expectedAmount: "" }));
      setUnitPriceCalculated(false);
    }
  }, [armCalculationData]);

  // Compute Total Subsidy based on rhSqft for SDP RH 225 / SDP Low Cost Shed
  useEffect(() => {
    const calcBasedOn = getIncentiveAndBonusData?.[0]?.calculationBasedOn || "";
    const isSdpRH225OrLowCost =
      calcBasedOn === "SDP RH 225" || calcBasedOn === "SDP Low Cost Shed";

    if (!isSdpRH225OrLowCost) return;

    const sqft = Number(developedLand.rhSqft);
    const unitPrice = Number(amountValue.unitPrice);
    const minAmount = Number(amountValue.minAmount);
    const maxAmount = Number(amountValue.maxAmount);

    if (!sqft || !unitPrice) return;

    if (minAmount > 0 && sqft < minAmount) {
      setData((prev) => ({ ...prev, expectedAmount: "", schemeAmount: "" }));
      return;
    }

    const effectiveSqft = (maxAmount > 0 && sqft > maxAmount) ? maxAmount : sqft;
    const totalSubsidy = effectiveSqft * unitPrice;

    setData((prev) => ({
      ...prev,
      expectedAmount: totalSubsidy,
      schemeAmount: totalSubsidy,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [developedLand.rhSqft, amountValue.unitPrice, amountValue.minAmount, amountValue.maxAmount, getIncentiveAndBonusData]);

  const [unitPriceCalculated, setUnitPriceCalculated] = useState(false);

  useEffect(() => {
    // SDP RH 225 / SDP Low Cost Shed use a dedicated API for unitPrice — skip this generic endpoint
    const calcBasedOn = getIncentiveAndBonusData?.[0]?.calculationBasedOn || "";
    if (calcBasedOn === "SDP RH 225" || calcBasedOn === "SDP Low Cost Shed") return;

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
            const unitCostMaster = response.data.content.unitCostMaster || [];
            // Take share percentage from the first (matching) row only — NOT sum of all rows.
            // Production has multiple rows per category (one per designation) which summed
            // incorrectly (e.g. 75+75+75 = 225 instead of correct 75).
            const singleSharePerc = Number(unitCostMaster[0]?.shareInPercentage || 0);
            if (singleSharePerc > 0) {
              setSharePercentage(singleSharePerc);
            }
            setAmountValue((prev) => ({
              ...prev,
              maxAmount: unitCostMaster[0]?.maxAmount,
              minAmount: unitCostMaster[0]?.minAmount,
              unitPrice: unitCostMaster[0]?.unitCostInRupees,
              fullPrice: unitCostMaster[0]?.fullPrice,
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
        baseURLReport + `getRHAck`,
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

  const generateAcknowledgmentRHSDPConstruction = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getSDPConstructionLowCostShedAck`,
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
        baseURLReport + `getReelingShedACK`,
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


  const generateAcknowledgmentSilkIncentive = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getSilkIncentiveACK`,
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


  const generateAcknowledgmentChawki1500 = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getChawkiAck1500`,
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

  const generateAcknowledgmentBonusPM = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getBonus225ACKPM`,
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

  const generateAcknowledgmentBonusBV = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getBonus225ACKBV`,
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

  const generateAcknowledgmentIncentivePM = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getIncentive120ACKPM`,
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

  const generateAcknowledgmentIncentiveBV = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getIncentive120ACKBV`,
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

  const generateAcknowledgmentTransportation = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getTransportationAck`,
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

  const generateAcknowledgmentBivoltineChawkiIncentive30 = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getIncentive30Ack`,
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

   const generateAcknowledgmentIncentiveForBivoltineChawki = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getChawki1000Ack`,
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

   const generateAcknowledgmentBolilerACK = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getBoilerACK`,
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

  const generateAcknowledgmentHeatRU = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getHRUACK`,
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

  const generateAcknowledgmentICB = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getIcbACK`,
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

  const generateAcknowledgmentIMCB = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getIMCBACK`,
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

  const generateAcknowledgmentSolarWaterHeater = async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getACKSolarWaterHeater`,
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

  const generateAcknowledgmentSilentGenerator= async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getACKSilentGenerator`,
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

  const generateAcknowledgmentSolarPowerGenerator= async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getACKSolarPowerGenerator`,
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

  const generateAcknowledgmentMERM= async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getACKMERM`,
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

  const generateAcknowledgmentRearingEquipmentSS= async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getACKRearingEquipmentSS`,
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

  const generateAcknowledgmentRegisteredPrivateBivCRC= async (applicationFormId,schemeId,subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getACKCRC`,
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


  const generateAcknowledgmentRHSDP225 = async (applicationFormId, schemeId, subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getRHSDP225Ack`,
        {
          applicationFormId: applicationFormId,
          schemeId: schemeId,
          subSchemeId: subSchemeId,
        },
        {
          responseType: "blob",
        }
      );
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {}
  };

  const generateAcknowledgmentRHSDPLowCostShed = async (applicationFormId, schemeId, subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getRHSDPLowCostShedAck`,
        {
          applicationFormId: applicationFormId,
          schemeId: schemeId,
          subSchemeId: subSchemeId,
        },
        {
          responseType: "blob",
        }
      );
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {}
  };

  const generateAcknowledgmentARM = async (applicationFormId, schemeId, subSchemeId) => {
    try {
      const response = await api.post(
        baseURLReport + `getAckARM`,
        {
          applicationFormId: applicationFormId,
          schemeId: schemeId,
          subSchemeId: subSchemeId,
        },
        {
          responseType: "blob",
        }
      );
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Acknowledgement Error", text: "Could not generate ARM acknowledgement. Please try again." });
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
      backgroundColor: "#eef3fc",
      color: "#1a2a4a",
      width: "10%",
      fontWeight: 600,
      fontSize: "0.85rem",
      borderLeft: "3px solid #1e67a8",
      paddingLeft: "10px",
    },
    top: {
      background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)",
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
      periodFrom: getCurrentFinancialYearPeriod().periodFrom,
      periodTo: getCurrentFinancialYearPeriod().periodTo,
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
       monthlyLimit: "",
      boilerInKg: "",
      sanctionNo: "",
      alreadyPaidAmount:"",
      stateAmount: "",
    newFinancialYear: "",
    taxAmount: "0",
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
      title: `<span style="font-size:17px;font-weight:700;color:#065f46;">Application Saved!</span>`,
      html: `
        <div style="text-align:center;padding:6px 0 4px;">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#d1fae5,#a7f3d0);margin-bottom:12px;box-shadow:0 4px 14px rgba(13,122,79,0.18);">
            <span style="font-size:28px;">✅</span>
          </div>
          <div style="font-size:14px;color:#374151;font-weight:500;margin-bottom:6px;">
            Application submitted successfully.
          </div>
          <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:7px;padding:7px 14px;font-size:12px;color:#065f46;display:inline-block;">
            Your application has been recorded in the system.
          </div>
        </div>
      `,
      confirmButtonText: "✔ OK",
      confirmButtonColor: "#0d7a4f",
      background: "#f6fdf9",
      width: "390px",
      showClass: { popup: "animate__animated animate__fadeInDown animate__faster" },
      hideClass: { popup: "animate__animated animate__fadeOutUp animate__faster" },
      customClass: { confirmButton: "px-4" },
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  };

  const uploadFileConfirm = (post) => {
  Swal.fire({
    title: "Upload Documents?",
    html: `<div style="font-size:13.5px;color:#555;">Would you like to upload supporting documents now?</div>`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Upload",
    cancelButtonText: "Later",
    confirmButtonColor: "#1a5fa8",
    cancelButtonColor: "#64748b",
    background: "#f0f6ff",
    width: "380px",
  }).then((result) => {

    const localStorageUserId2 = localStorage.getItem("userMasterId");
    if (!localStorageUserId2 || localStorageUserId2 === "null" || !post.userMasterId) {
      Swal.fire({
        icon: "warning",
        title: "Please Select User Master",
        text: "Please Select User Master and Save it once again",
        confirmButtonColor: "#1e67a8",
      });
      setSaveDisabled(false);
      return;
    }

    const apiEndpoint = isSanctionForReeling
      ? `${baseURLDBT}service/saveApplicationFormForReeler`
      : `${baseURLDBT}service/saveApplicationForm`;

    const handleResponse = async (response, showModal = false) => {
      if (response.data.errorCode === -1) {
        saveError(response.data.errorMessages[0]);
        setSaveDisabled(false);
        return;
      }

      if (response.data && response.data.error) {
        saveError(response.data.error_description);
        setSaveDisabled(false);
        return;
      }

      if (!showModal) saveSuccess();

      setApplicationId(response.data.content.applicationDocumentId);
      setSchemeId(response.data.content.schemeId);
      clear();
      setSaveDisabled(false);

      const subSchemeDetailsId = response.data.content.subSchemeId;

      const alreadyGenerated =
        await isSanctionEnabledFromDB(subSchemeDetailsId);

      if (!alreadyGenerated) {
        callAcknowledgmentFunction(
          getIncentiveAndBonusData[0]?.acknowledgementForScheme,
          response.data.content.applicationDocumentId,
          response.data.content.schemeId,
          subSchemeDetailsId
        );

        // await enableSanctionIfRequired(subSchemeDetailsId);
      }

      if (showModal) handleShowModal();
      setValidated(false);
    };

    // ✅ YES → Save + Upload
    if (result.value) {
      api
        .post(apiEndpoint, post)
        .then((response) => handleResponse(response, true))
        .catch((err) => {
          if (
            err.response?.data?.validationErrors &&
            Object.keys(err.response.data.validationErrors).length > 0
          ) {
            saveError(err.response.data.validationErrors);
          }
          setSaveDisabled(false);
        });
      setValidated(true);

    // ✅ LATER → Save only
    } else {
      api
        .post(apiEndpoint, post)
        .then((response) => handleResponse(response, false))
        .catch((err) => {
          if (
            err.response?.data?.validationErrors &&
            Object.keys(err.response.data.validationErrors).length > 0
          ) {
            saveError(err.response.data.validationErrors);
          }
          setSaveDisabled(false);
        });
      setValidated(true);
    }
  });
};

const handleSubmitApplication = async () => {
  // 🔐 Sanction enable check
  const canGenerateSanction = await isSanctionEnabledFromDB(
    data.scSubSchemeDetailsId
  );

  if (!canGenerateSanction) {
    Swal.fire({
      icon: "warning",
      title: "Sanction Disabled",
      html: `<div style="font-size:13.5px;color:#555;">Sanction Order is disabled for this component type.</div>`,
      confirmButtonText: "OK",
      confirmButtonColor: "#f0a500",
      width: "360px",
    });
    return; // ❌ STOP FLOW
  }

  // ✅ CONTINUE NORMAL PROCESS
  api.post(
    baseURLDBT + "service/saveApplication",
    data
  ).then((res) => {
    // existing success logic
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

// const callAcknowledgmentFunction = (acknowledgementForScheme, applicationFormId, schemeId,subSchemeId) => {
//   if (
//     acknowledgementForScheme === "Silk Samagra State" || 
//     acknowledgementForScheme === "Silk Samagra Central"
//   ) {
//     generateAcknowledgmentRH(applicationFormId, schemeId,subSchemeId);

//   } else if (
//     acknowledgementForScheme === "PDMC" || 
//     acknowledgementForScheme === "PMKSY"
//   ) {
//     generateAcknowledgment(applicationFormId, schemeId);

//   } else if (
//     acknowledgementForScheme === "Reeling Shed-PSF" ||
//     acknowledgementForScheme === "Silk Incentive-PSF"
//   ) {
//     generateAcknowledgmentReelingShed(applicationFormId, schemeId,subSchemeId);

//   } else if (acknowledgementForScheme === "Adopting Heat Recovery Unit-PSF") {
//     generateAcknowledgmentHRU(applicationFormId, schemeId,subSchemeId);
//   }
// };

const callAcknowledgmentFunction = (
  acknowledgementForScheme,
  applicationFormId,
  schemeId,
  subSchemeId
) => {
  if (
    acknowledgementForScheme === "Silk Samagra State" ||
    acknowledgementForScheme === "Silk Samagra Central"
  ) {
    generateAcknowledgmentRH(applicationFormId, schemeId, subSchemeId);

  } else if (
    acknowledgementForScheme === "PDMC" ||
    acknowledgementForScheme === "PMKSY"
  ) {
    generateAcknowledgment(applicationFormId, schemeId);

  } else if (
    acknowledgementForScheme === "Reeling Shed-PSF"
  ) {
    generateAcknowledgmentReelingShed(applicationFormId, schemeId, subSchemeId);

  }else if (
    acknowledgementForScheme === "SDP Construction Of  Low Cost Shed to  Permanent  Rearing House"
  ) {
    generateAcknowledgmentRHSDPConstruction(applicationFormId, schemeId, subSchemeId);

  // } else if (
  //   acknowledgementForScheme === "Adopting Heat Recovery Unit-PSF"
  // ) {
  //   generateAcknowledgmentHRU(applicationFormId, schemeId, subSchemeId);

  } else if (
    acknowledgementForScheme === "North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP"
  ) {
    generateAcknowledgmentTransportation(applicationFormId, schemeId, subSchemeId);

  } else if (
    acknowledgementForScheme === "Incentive For Bivoltine Cocoons-30/kg-PSF"
  ) {
    generateAcknowledgmentBivoltineChawkiIncentive30(
      applicationFormId,
      schemeId,
      subSchemeId
    );

  } else if (
    acknowledgementForScheme === "Silk Incentive-PSF"
  ) {
    generateAcknowledgmentSilkIncentive(
      applicationFormId,
      schemeId,
      subSchemeId
    );

    } else if (
    acknowledgementForScheme === "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500"
  ) {
    generateAcknowledgmentChawki1500(
      applicationFormId,
      schemeId,
      subSchemeId
    );

    } else if (
    acknowledgementForScheme === "Bonus PM"
  ) {
    generateAcknowledgmentBonusPM(
      applicationFormId,
      schemeId,
      subSchemeId
    );

    } else if (
    acknowledgementForScheme === "Bonus BV"
  ) {
    generateAcknowledgmentBonusBV(
      applicationFormId,
      schemeId,
      subSchemeId
    );

    } else if (
    acknowledgementForScheme === "Incentive PM"
  ) {
    generateAcknowledgmentIncentivePM(
      applicationFormId,
      schemeId,
      subSchemeId
    );

    } else if (
    acknowledgementForScheme === "Incentive BV"
  ) {
    generateAcknowledgmentIncentiveBV(
      applicationFormId,
      schemeId,
      subSchemeId
    );

    } else if (
    acknowledgementForScheme === "Incentive For Bivoltine Chawki Rearing Cost"
  ) {
    generateAcknowledgmentIncentiveForBivoltineChawki(
      applicationFormId,
      schemeId,
      subSchemeId
    );

    } else if (
    acknowledgementForScheme === "Adopting Boiler-PSF"
  ) {
    generateAcknowledgmentBolilerACK(
      applicationFormId,
      schemeId,
      subSchemeId
    );

    } else if (
    acknowledgementForScheme === "Adopting Heat Recovery Unit-PSF"
  ) {
    generateAcknowledgmentHeatRU(
      applicationFormId,
      schemeId,
      subSchemeId
    );

     } else if (
    acknowledgementForScheme === "ICB-PSF"
  ) {
    generateAcknowledgmentICB(
      applicationFormId,
      schemeId,
      subSchemeId
    );


    } else if (
    acknowledgementForScheme === "IMCB-PSF"
  ) {
    generateAcknowledgmentIMCB(
      applicationFormId,
      schemeId,
      subSchemeId
    );

  }

  else if (
    acknowledgementForScheme === "Adopting Solar Water Heater"
  ) {
    generateAcknowledgmentSolarWaterHeater(
      applicationFormId,
      schemeId,
      subSchemeId
    );

  }

  else if (
    acknowledgementForScheme === "Adopting Solar power Generator"
  ) {
    generateAcknowledgmentSolarPowerGenerator(
      applicationFormId,
      schemeId,
      subSchemeId
    );

  }

  else if (
    acknowledgementForScheme === "Adopting Silent Generator"
  ) {
    generateAcknowledgmentSilentGenerator(
      applicationFormId,
      schemeId,
      subSchemeId
    );

  }

  else if (
    acknowledgementForScheme === "MERM-PSF"
  ) {
    generateAcknowledgmentMERM(
      applicationFormId,
      schemeId,
      subSchemeId
    );

  }

   else if (
    acknowledgementForScheme === "Rearing Equipment SS"
  ) {
    generateAcknowledgmentRearingEquipmentSS(
      applicationFormId,
      schemeId,
      subSchemeId
    );

  }

  else if (
    acknowledgementForScheme === "Registered Private Bivoltine Chawki Rearing Center Subsidy"
  ) {
    generateAcknowledgmentRegisteredPrivateBivCRC(
      applicationFormId,
      schemeId,
      subSchemeId
    );

  } else if (acknowledgementForScheme === "SDP RH 225") {
    generateAcknowledgmentRHSDP225(applicationFormId, schemeId, subSchemeId);

  } else if (acknowledgementForScheme === "SDP Low Cost Shed") {
    generateAcknowledgmentRHSDPLowCostShed(applicationFormId, schemeId, subSchemeId);

  } else if (
    acknowledgementForScheme === "Automatic Reeling Machine" ||
    acknowledgementForScheme === "Automatic Reeling Machine Unit"
  ) {
    generateAcknowledgmentARM(applicationFormId, schemeId, subSchemeId);

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
      title: "Save Failed",
      html: `<div style="font-size:13.5px;color:#555;line-height:1.6;">${errorMessage}</div>`,
      confirmButtonText: "OK",
      confirmButtonColor: "#c0392b",
      background: "#fff8f7",
      width: "380px",
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

  // Step 1: Try fetching Farmer Details first (checks local DB before calling FRUITS API)
  api
    .post(baseURLFarmerServer + `farmer/get-details-by-fruits-id`, {
      fruitsId: data.fruitsId,
    })
    .then((response) => {
      setLoading(false);
      if (
        response.data &&
        response.data.content &&
        !response.data.content.error &&
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
      setLoading(false);
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
      setLoading(false);
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
      setLoading(false);
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
      name: t("Hissa"),
      selector: (row) => row.hissa,
      cell: (row) => <span>{row.hissa}</span>,
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
            type="number"
            value={developedArea[i]?.devAcre || ""}
            onChange={(e) => handleInlineDevelopedLandChange(e, i)}
            placeholder="Acre"
            className="m-1"
          />
          <Form.Control
            name="devGunta"
            type="number"
            value={developedArea[i]?.devGunta || ""}
            onChange={(e) => handleInlineDevelopedLandChange(e, i)}
            placeholder="Gunta"
            className="m-1"
          />
          <Form.Control
            name="devFGunta"
            type="number"
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
      title: "Details Not Found",
      html: `<div style="font-size:13.5px;color:#555;line-height:1.6;">${errorMessage}</div>`,
      confirmButtonText: "OK",
      confirmButtonColor: "#c0392b",
      background: "#fff8f7",
      width: "380px",
    });
  };


const serviceApplicationStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title { margin-bottom: 4px; color: #ffffff !important; font-weight: 700; letter-spacing: 0.2px; }
  .sh-cta-btn {
    background: #ffffff; color: #1e67a8 !important; border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25); font-weight: 700; padding: 8px 18px;
    border-radius: 8px; transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover { background: #eef6ff; color: #1e67a8 !important; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32); }
  .sh-form-wrap { background: #eef2f8; border-radius: 14px; padding: 28px; }
  html body .sh-form-wrap .card { border: none; border-radius: 12px !important; box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1); overflow: hidden; margin-bottom: 18px; }
  html body .sh-form-wrap .card-header { border-bottom: none !important; }
  html body .sh-form-wrap .card-header:not([style]) {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    color: #ffffff !important; font-weight: 700 !important; letter-spacing: 0.3px; padding: 12px 20px !important;
  }
  html body .sh-form-wrap .card-body { padding: 20px !important; }
  html body .sh-form-wrap .form-label { font-size: 13px; font-weight: 600; color: #4a5568; margin-bottom: 6px; letter-spacing: 0.2px; }
  html body .sh-form-wrap .form-control, html body .sh-form-wrap .form-select {
    border-radius: 10px !important; border: 1.5px solid #d8e0ec !important; background-color: #fbfcfe !important;
    padding: 0.62rem 0.9rem !important; font-size: 13.5px; color: #2b3a55;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }
  html body .sh-form-wrap .form-control:hover:not(:disabled):not([readonly]), html body .sh-form-wrap .form-select:hover:not(:disabled) {
    border-color: #a9c4e0 !important; background-color: #ffffff !important;
  }
  html body .sh-form-wrap .form-control:focus, html body .sh-form-wrap .form-select:focus {
    border-color: #2b7ac0 !important; background-color: #ffffff !important; box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important; outline: none;
  }
  html body .sh-form-wrap .form-control[readonly], html body .sh-form-wrap .form-control:read-only, html body .sh-form-wrap .form-select:disabled {
    background-color: #f1f5fa !important; border-color: #e4e9f2 !important; color: #8a96a8 !important; cursor: not-allowed;
  }
  html body .sh-form-wrap .form-control.is-invalid, html body .sh-form-wrap .form-select.is-invalid {
    border-color: #e3496a !important; box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important;
  }
  html body .sh-form-wrap .form-check-input { border-radius: 5px; border: 1.5px solid #c9d4e3; cursor: pointer; }
  html body .sh-form-wrap .form-check-input:checked { background-color: #1e67a8; border-color: #1e67a8; }
  html body .sh-form-wrap .text-danger { font-weight: 700; margin-left: 3px; }
  html body .sh-form-wrap .btn-primary { border-radius: 8px; font-weight: 600; letter-spacing: 0.3px; transition: transform 0.15s ease, box-shadow 0.15s ease; }
  html body .sh-form-wrap .btn-primary:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(30, 103, 168, 0.25); }
  html body .sh-form-wrap .btn-success { font-weight: 600; }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border: none !important;
    color: #ffffff !important; font-weight: 700; border-radius: 8px; padding: 8px 26px;
    box-shadow: 0 4px 12px rgba(30,103,168,0.25); transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-save-btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(30,103,168,0.32); }
  .sh-cancel-btn {
    background: #ffffff; color: #e3496a; border: 1.5px solid #e3496a; border-radius: 8px;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-cancel-btn:hover:not(:disabled), .sh-cancel-btn:focus:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%); color: #ffffff; border-color: transparent;
    transform: translateY(-1px); box-shadow: 0 6px 14px rgba(227, 73, 106, 0.32);
  }
  .sh-form-wrap table { border-radius: 8px; overflow: hidden; }
  .sh-form-wrap table thead th {
    background-color: #eef4fc !important; color: #2b3a55 !important; font-weight: 700; font-size: 13px;
    letter-spacing: 0.2px; border-bottom: 2px solid #d6e3f3 !important;
  }
  .sh-form-wrap table tbody tr:hover { background-color: #f7faff !important; }
  .sh-section-header {
    display: flex; align-items: center; gap: 10px; font-weight: 700 !important; font-size: 1rem !important;
    letter-spacing: 0.3px; background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-left: none !important; color: #ffffff !important; padding: 14px 20px !important;
  }
  .sh-section-header svg, .sh-section-header .icon, html body .sh-modal-content .modal-header svg, html body .sh-modal-content .modal-header .icon {
    display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px;
    border-radius: 50%; background: rgba(255, 255, 255, 0.22); color: #ffffff; font-size: 15px;
  }
  .sh-modal-content { border-radius: 12px !important; border: 1px solid #e3ebf6 !important; overflow: hidden; }
  html body .sh-modal-content .modal-header { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%); border-bottom: none; padding: 16px 22px; }
  html body .sh-modal-content .modal-header .btn-close { filter: brightness(0) invert(1); opacity: 0.85; }
  html body .sh-modal-content .modal-title { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 1.05rem; letter-spacing: 0.3px; color: #ffffff; }
  html body .sh-modal-content .modal-body { padding: 22px 24px; max-height: 72vh; overflow-y: auto; }
  html body .sh-modal-content .btn-primary {
    background: linear-gradient(135deg, #1e67a8 0%, #2b7ac0 100%); border: none; border-radius: 8px; font-weight: 600;
    letter-spacing: 0.3px; box-shadow: 0 4px 10px rgba(30, 103, 168, 0.2); transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  html body .sh-modal-content .btn-secondary {
    background: #ffffff; color: #e3496a; border: 1.5px solid #e3496a; border-radius: 8px; font-weight: 600;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }
  html body .sh-modal-content .btn-secondary:hover:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%); color: #ffffff; border-color: transparent;
    transform: translateY(-1px); box-shadow: 0 6px 14px rgba(227, 73, 106, 0.28);
  }
  .sh-swal-popup { border-radius: 14px !important; }
  .sh-swal-confirm { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border-radius: 8px !important; font-weight: 600 !important; box-shadow: 0 4px 12px rgba(30,103,168,0.25) !important; }
  .sh-swal-cancel { background: #ffffff !important; color: #c43257 !important; border: 1px solid #e3496a !important; border-radius: 8px !important; font-weight: 600 !important; }
`;

  return (
    <Layout title="Scheme Details Form">
      <style>{serviceApplicationStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title">{t("Scheme Details Form")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/all-application-list"
                  className="btn btn-primary btn-md d-md-none sh-cta-btn"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Applications List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/all-application-list"
                  className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Applications List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        {/* <Form action="#"> */}
        {/* <Form noValidate validated={searchValidated} onSubmit={search}> */}
        <Form noValidate validated={searchValidated} onSubmit={search}>
          <Card style={{ border: "none", borderRadius: "14px", boxShadow: "0 4px 18px rgba(30,103,168,0.12)", overflow: "hidden" }}>
            <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", fontWeight: 700, color: "white", padding: "12px 20px" }}>
              &#128269; {t("Search Beneficiary")}
            </Card.Header>
            <Card.Body style={{ background: "linear-gradient(135deg, #f8f9ff 0%, #eef3fc 100%)" }}>
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
              <Row className="g-gs mt-3">
                <Col lg="6">
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dce8f5",
                      borderRadius: "10px",
                      padding: "12px 16px",
                      boxShadow: "0 1px 4px rgba(26,95,168,0.06)",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        width: "4px",
                        height: "28px",
                        background: "#1a5fa8",
                        borderRadius: "2px",
                        display: "inline-block",
                      }}
                    />
                    <Form.Label
                      htmlFor="financialYearMasterId"
                      className="mb-0"
                      style={{ fontWeight: "bold", color: "#1a3c6e", whiteSpace: "nowrap" }}
                    >
                      {t("Financial Year")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      id="financialYearMasterId"
                      name="financialYearMasterId"
                      value={data.financialYearMasterId}
                      onChange={handleInputs}
                      required
                      style={{ maxWidth: "240px" }}
                    >
                      <option value="">{t("Select Year")}</option>
                      {financialyearListData.map((list) => (
                        <option
                          key={list.financialYearMasterId}
                          value={list.financialYearMasterId}
                        >
                          {list.financialYear}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
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
        <Block className="sh-form-wrap">
          <Form noValidate validated={validated} onSubmit={postData}>
            <Row className="g-1 ">
              <Col lg={12}>
                <Block className="mt-3">
                  <Card style={{ border: "none", borderRadius: "14px", boxShadow: "0 4px 18px rgba(30,103,168,0.12)", overflow: "hidden" }}>
                    <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", fontWeight: 700, color: "white", padding: "12px 20px", letterSpacing: "0.3px" }}>
                      &#128203; {t("Scheme Details")}
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

                         {(getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Bivoltine Bonus" ||
                            getIncentiveAndBonusData?.[0]?.calculationBasedOn === "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500") && (
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
                                required
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
                                required
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

                        {(getIncentiveAndBonusData?.[0]?.calculationBasedOn === "SDP RH 225" ||
                          getIncentiveAndBonusData?.[0]?.calculationBasedOn === "SDP Low Cost Shed") && (
                          <Col lg="6">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="rhSqft">
                                {t("Constructed Area in Sqft")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="rhSqft"
                                  type="text"
                                  name="rhSqft"
                                  value={developedLand.rhSqft}
                                  onChange={handleDevelopedLandInputs}
                                  placeholder="Enter Constructed Area in Sqft"
                                />
                              </div>
                            </Form.Group>
                          </Col>
                        )}

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
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                <strong>Tax Invoice Amount (in Rs)</strong>
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="taxAmount"
                                type="text"
                                name="taxAmount"
                                value={data.taxAmount}
                                onChange={handleInputs}
                                placeholder="Enter Tax Invoice Amount (in Rs)"
                                required
                              />
                            </Form.Group>
                            <Form.Control.Feedback type="invalid">
                              Tax Invoice Amount (in Rs) is required
                            </Form.Control.Feedback>
                          </Col>

                            </>
                          )}

                          {(
                          getIncentiveAndBonusData[0]?.unitForScheme ===
                            "Registered Private Bivoltine Chawki Rearing Center Subsidy" ||
                          (getIncentiveAndBonusData[0]?.sanctionForReeling &&
                            getIncentiveAndBonusData?.[0]?.calculationBasedOn !== "Silk Incentive-PSF" &&
                            getIncentiveAndBonusData?.[0]?.calculationBasedOn !== "Reeling Shed-PSF")
                        ) &&
                        getIncentiveAndBonusData?.[0]?.unitForScheme !== "Automatic Reeling Machine Unit" && (
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
                                    portalId="seri-datepicker-portal"
                                  />
                                </div>
                              </Form.Group>
                            </Col>

                            {!["IMCB-PSF", "MERM-PSF", "Adopting Heat Recovery Unit-PSF",
                               "Adopting Solar Water Heater", "Adopting Solar power Generator",
                               "Adopting Silent Generator", "Adopting Boiler-PSF", "ICB-PSF"
                              ].includes(getIncentiveAndBonusData?.[0]?.calculationBasedOn) &&
                              getIncentiveAndBonusData?.[0]?.unitForScheme !== "Rearing Equipment SS" && (
                            <Col lg="6">
                              <Form.Group className="form-group mt-n4">
                                <Form.Label>
                                  <strong>Tax Invoice Amount (in Rs)</strong>
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  id="taxAmount"
                                  type="text"
                                  name="taxAmount"
                                  value={data.taxAmount}
                                  onChange={handleInputs}
                                  placeholder="Enter Tax Invoice Amount (in Rs)"
                                  required
                                />
                              </Form.Group>
                              <Form.Control.Feedback type="invalid">
                                Tax Invoice Amount (in Rs) is required
                              </Form.Control.Feedback>
                            </Col>
                            )}
                          </>
                        )}


                        {/* ── ARM Unit Fields (Automatic Reeling Machine Unit) ───────── */}
                        {getIncentiveAndBonusData?.[0]?.unitForScheme === "Automatic Reeling Machine Unit" && (
                          <>
                            <Col lg="4">
                              <Form.Group className="form-group mt-n4">
                                <Form.Label>{t("ARM Ends")} <span className="text-danger">*</span></Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Select name="armEnds" value={data.armEnds} onChange={handleInputs} required>
                                    <option value="">{t("-- Select ARM Ends --")}</option>
                                    <option value="120 Ends">120 Ends</option>
                                    <option value="200 Ends">200 Ends</option>
                                    <option value="400 Ends">400 Ends</option>
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">{t("ARM Ends is required")}</Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>

                            <Col lg="4">
                              <Form.Group className="form-group mt-n4">
                                <Form.Label>{t("Name of the ARM Unit")} <span className="text-danger">*</span></Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    type="text"
                                    name="armUnitName"
                                    value={data.armUnitName}
                                    onChange={handleInputs}
                                    placeholder={t("Enter Name of ARM Unit")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">{t("Name of ARM Unit is required")}</Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>

                            <Col lg="4">
                              <Form.Group className="form-group mt-n4">
                                <Form.Label>{t("Address of ARM Unit")}</Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    type="text"
                                    name="armUnitAddress"
                                    value={data.armUnitAddress}
                                    onChange={handleInputs}
                                    placeholder={t("Enter Address of ARM Unit")}
                                  />
                                </div>
                              </Form.Group>
                            </Col>

                          </>
                        )}

                        {getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Silk Incentive-PSF" && (
                            <>
                            <Col lg="6">
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

                              <Col lg="6">
                                  <Form.Group className="form-group mt-n4">
                                <Form.Label htmlFor="icbBasinEnds">
                                  {t("Year")} 
                                  {/* <span className="text-danger">*</span> */}
                                </Form.Label>
                                <div className="form-control-wrap">
                                   <Form.Control
                                      id="year"
                                      type="text"
                                      name="year"
                                      value={data.year}
                                      onChange={handleInputs}
                                      placeholder="Enter Year"
                                      // required
                                      // readOnly
                                    />
                                  {/* <Form.Control.Feedback type="invalid">
                                    {t("Boiler In Kg is required")}
                                  </Form.Control.Feedback> */}
                                </div>
                              </Form.Group>
                            </Col>

                              <Col lg="6">
                                <Form.Group className="form-group mt-n3">
                                  <Form.Label>
                                    {t('From Month')}<span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      name="fromMonth"
                                      value={data.fromMonth}
                                      onChange={handleInputs}
                                      required
                                    >
                                      <option value="">{t('Select From Month')}</option>
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
                                  </div>
                                </Form.Group>
                              </Col>

                              <Col lg="6">
                                <Form.Group className="form-group mt-n3">
                                  <Form.Label>
                                    {t('To Month')}<span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      name="toMonth"
                                      value={data.toMonth}
                                      onChange={handleInputs}
                                      required
                                    >
                                      <option value="">{t('Select To Month')}</option>
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
                                <Form.Group className="form-group mt-n3">
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
                                        <option value="1 Charaka">1 Charaka</option>
                                        <option value="2 Charaka">2 Charaka</option>
                                        <option value="3 Charaka">3 Charaka</option>
                                        <option value="4 Charaka">4 Charaka</option>
                                        <option value="1-Table(2 ಬೇಸಿನ್‌)">1-Table(2 ಬೇಸಿನ್‌)</option>
                                        <option value="2-Table(4 ಬೇಸಿನ್‌)">2-Table(4 ಬೇಸಿನ್‌)</option>
                                        <option value="3-Table(6 ಬೇಸಿನ್‌)">3-Table(6 ಬೇಸಿನ್‌)</option>
                                        <option value="1 ಬೇಸಿನ್‌">1 ಬೇಸಿನ್‌</option>
                                        <option value="2 ಬೇಸಿನ್‌">2 ಬೇಸಿನ್‌</option>
                                        <option value="3 ಬೇಸಿನ್‌">3 ಬೇಸಿನ್‌</option>
                                        <option value="4 ಬೇಸಿನ್‌">4 ಬೇಸಿನ್‌</option>
                                        <option value="5 ಬೇಸಿನ್‌">5 ಬೇಸಿನ್‌</option>
                                        <option value="6 ಬೇಸಿನ್‌">6 ಬೇಸಿನ್‌</option>
                                        <option value="7 ಬೇಸಿನ್‌">7 ಬೇಸಿನ್‌</option>
                                        <option value="8 ಬೇಸಿನ್‌">8 ಬೇಸಿನ್‌</option>
                                        <option value="9 ಬೇಸಿನ್‌">9 ಬೇಸಿನ್‌</option>
                                        <option value="10 ಬೇಸಿನ್‌">10 ಬೇಸಿನ್‌</option>
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
                                <Form.Group className="form-group mt-n3">
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
                         <option value="2 B-Grade">2 B-Grade</option>
                          <option value="3 A-Grade">3 A-Grade</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Renditta/Grade is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>
                              
                            </>
                          )}

                          {getIncentiveAndBonusData?.[0]?.calculationBasedOn === "ICB-PSF" && (
                            <>
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
                            <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                <strong>Tax Invoice Amount (in Rs)</strong>
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="taxAmount"
                                type="text"
                                name="taxAmount"
                                value={data.taxAmount}
                                onChange={handleInputs}
                                placeholder="Enter Tax Invoice Amount (in Rs)"
                                required
                              />
                            </Form.Group>
                             <Form.Control.Feedback type="invalid">
                                Tax Invoice Amount (in Rs) is required
                              </Form.Control.Feedback>
                          </Col>
                            </>
                               )}

                               {getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Adopting Boiler-PSF" && (
                            <>
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
                            <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                <strong>Tax Invoice Amount (in Rs)</strong>
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="taxAmount"
                                type="text"
                                name="taxAmount"
                                value={data.taxAmount}
                                onChange={handleInputs}
                                placeholder="Enter Tax Invoice Amount (in Rs)"
                                required
                              />
                            </Form.Group>
                             <Form.Control.Feedback type="invalid">
                                Tax Invoice Amount (in Rs) is required
                              </Form.Control.Feedback>
                          </Col>
                            </>
                               )}


                            {getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Reeling Shed-PSF" && (
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

                               {getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Adopting Silent Generator" && (
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
                                      <option value="">{t("Select Silent generator Capacity( KW )")}</option>
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
                              
                              <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                <strong>Tax Invoice Amount (in Rs)</strong>
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="taxAmount"
                                type="text"
                                name="taxAmount"
                                value={data.taxAmount}
                                onChange={handleInputs}
                                placeholder="Enter Tax Invoice Amount (in Rs)"
                                required
                              />
                            </Form.Group>
                             <Form.Control.Feedback type="invalid">
                                Tax Invoice Amount (in Rs) is required
                              </Form.Control.Feedback>
                          </Col>
                            </>
                               )}

                               {getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Adopting Solar power Generator" && (
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

                            <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                <strong>Tax Invoice Amount (in Rs)</strong>
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="taxAmount"
                                type="text"
                                name="taxAmount"
                                value={data.taxAmount}
                                onChange={handleInputs}
                                placeholder="Enter Tax Invoice Amount (in Rs)"
                                required
                              />
                            </Form.Group>
                             <Form.Control.Feedback type="invalid">
                                Tax Invoice Amount (in Rs) is required
                              </Form.Control.Feedback>
                          </Col>
                            </>
                               )}

                                {getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Adopting Solar Water Heater" && (
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
                                  {t("Water Heater Capacity")} <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Select
                                    id="reelingSqft"
                                    name="reelingSqft"
                                    value={data.reelingSqft}
                                    onChange={handleInputs}
                                    required
                                  >
                                    <option value="">{t("Select Water Heater Capacity")}</option>
                                    <option value="1000">1000</option>
                                    <option value="500">500</option>
                                    <option value="200">200</option>
                                    {/* <option value="600">600</option> */}
                                    
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    {t("Water Heater Capacity is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>


                            <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                <strong>Tax Invoice Amount (in Rs)</strong>
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="taxAmount"
                                type="text"
                                name="taxAmount"
                                value={data.taxAmount}
                                onChange={handleInputs}
                                placeholder="Enter Tax Invoice Amount (in Rs)"
                                required
                                // disabled={actionData.rejectType === "Permanent"}
                              />
                            </Form.Group>
                             <Form.Control.Feedback type="invalid">
                                Tax Invoice Amount (in Rs)  is required
                              </Form.Control.Feedback>
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

                               {getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Adopting Heat Recovery Unit-PSF" && (
                            <>
                            <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                <strong>Tax Invoice Amount (in Rs)</strong>
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="taxAmount"
                                type="text"
                                name="taxAmount"
                                value={data.taxAmount}
                                onChange={handleInputs}
                                placeholder="Enter Tax Invoice Amount (in Rs)"
                                required
                              />
                            </Form.Group>
                             <Form.Control.Feedback type="invalid">
                                Tax Invoice Amount (in Rs) is required
                              </Form.Control.Feedback>
                          </Col>
                            </>
                               )}

                          {(getIncentiveAndBonusData?.[0]?.calculationBasedOn === "IMCB-PSF" ||
                            getIncentiveAndBonusData?.[0]?.calculationBasedOn === "MERM-PSF") && (
                            <>
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
                                      <option value="1-Table(2 ಬೇಸಿನ್‌)">1-Table(2 ಬೇಸಿನ್‌)</option>
                                      <option value="2-Table(4 ಬೇಸಿನ್‌)">2-Table(4 ಬೇಸಿನ್‌)</option>
                                      <option value="3-Table(6 ಬೇಸಿನ್‌)">3-Table(6 ಬೇಸಿನ್‌)</option>
                                      <option value="6 ಬೇಸಿನ್‌">6 ಬೇಸಿನ್‌</option>
                                      <option value="10 ಬೇಸಿನ್‌">10 ಬೇಸಿನ್‌</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("Imcb Table is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
                              </Col>
                            <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                <strong>Tax Invoice Amount (in Rs)</strong>
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="taxAmount"
                                type="text"
                                name="taxAmount"
                                value={data.taxAmount}
                                onChange={handleInputs}
                                placeholder="Enter Tax Invoice Amount (in Rs)"
                                required
                              />
                            </Form.Group>
                             <Form.Control.Feedback type="invalid">
                                Tax Invoice Amount (in Rs) is required
                              </Form.Control.Feedback>
                          </Col>
                            </>
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
                          <Form.Group className="form-group mt-n3">
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

                        {/* <Col lg="6">
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
                                  disabled={allowAnyUser}
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
                        </Col> */}

                        {/* ============ USER MASTER DROPDOWN ============ */}
                        {!allowAnyUser && (
                          <Col lg="6">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>
                                {t("User Master")}
                                <span className="text-danger">*</span>
                              </Form.Label>

                              <div className="form-control-wrap">
                                <ReactSelect
                                  options={userFromDistrictData.map((list) => ({
                                    value: list.userId,
                                    label: list.userName,
                                  }))}
                                  placeholder={t("Select User")}
                                  isSearchable
                                  menuPlacement="bottom"
                                  menuPosition="fixed"
                                  menuPortalTarget={document.body}
                                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                  value={userFromDistrictData
                                    .map((list) => ({ value: list.userId, label: list.userName }))
                                    .find((opt) => opt.value === data.userId)}
                                  onChange={(selectedOption) => {
                                    setData((prev) => ({
                                      ...prev,
                                      userId: selectedOption?.value || "",
                                    }));
                                    if (validated) setValidated(false);
                                  }}
                                  className={validated && !isUserValid ? "is-invalid" : ""}
                                />

                                {validated && !isUserValid && (
                                  <div className="invalid-feedback d-block">
                                    User Master is required
                                  </div>
                                )}
                              </div>
                            </Form.Group>
                          </Col>
                        )}

                        {/* ============ SELECT USER DROPDOWN ============ */}
                        {allowAnyUser && (
                          <Col lg="6">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>{t("Select User")}</Form.Label>

                              <ReactSelect
                                options={userListData.map((u) => ({
                                  value: u.userMasterId,
                                  label: `${u.username} (${u.userMasterId})`,
                                }))}
                                isSearchable
                                placeholder={t("Select User")}
                                menuPlacement="bottom"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                value={userListData
                                  .map((u) => ({
                                    value: u.userMasterId,
                                    label: `${u.username} (${u.userMasterId})`,
                                  }))
                                  .find((opt) => opt.value === data.userId)}
                                onChange={(selectedOption) => {
                                  setData((prev) => ({
                                    ...prev,
                                    userId: selectedOption?.value || "",
                                  }));
                                  if (validated) setValidated(false);
                                }}
                                className={validated && !isUserValid ? "is-invalid" : ""}
                              />

                              {validated && !isUserValid && (
                                <div className="invalid-feedback d-block">
                                  User is required
                                </div>
                              )}
                            </Form.Group>
                          </Col>
                        )}



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

                        {getIncentiveAndBonusData?.[0]?.monthlyFrequency === true && (
                          <Col lg="2">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="monthYear">
                                {t("Month")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  id="monthYear"
                                  name="monthYear"
                                  value={data.monthYear || ""}
                                  onChange={handleMonthlyFrequencyMonthChange}
                                  required
                                >
                                  <option value="">{t("Select Month")}</option>
                                  {getFinancialYearMonths(
                                    financialyearListData.find(
                                      (f) =>
                                        String(f.financialYearMasterId) ===
                                        String(data.financialYearMasterId)
                                    )?.financialYear
                                  ).map((m) => (
                                    <option key={m.value} value={m.value}>
                                      {m.label}
                                    </option>
                                  ))}
                                </Form.Select>
                              </div>
                            </Form.Group>
                          </Col>
                        )}

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
                                portalId="seri-datepicker-portal"
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
                                portalId="seri-datepicker-portal"
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
                  {getIncentiveAndBonusData?.[0]?.calculationBasedOn !== "Rearing Equipment SS" && (
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
                  )}
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

   {getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Silk Incentive-PSF" && (
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
                                {t("Daily Limit In Kgs")} 
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  type="text"
                                  name="dailyLimit"
                                  value={data.dailyLimit}
                                  onChange={handleInputs}
                                  required
                                  placeholder={t("Enter Daily Limit")}
                                  // required
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
                                {t("Monthly Limit In Kgs ")} 
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  type="text"
                                  name="monthlyLimit"
                                  value={data.monthlyLimit}
                                  onChange={handleInputs}
                                  // required
                                  placeholder={t("Enter Monthly Limit")}
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                  {t("Monthly Limit is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>


                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label>
                                {t("Quantity Of Cocoons  used to Produce Raw Silk(In Kgs)")} 
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  type="text"
                                  name="noOfCocoonsNeedToProduce"
                                  value={data.noOfCocoonsNeedToProduce}
                                  onChange={handleInputs}
                                  // required
                                  placeholder={t("Enter Quantity Of Cocoons in Kgs used to Produce Raw Silk")}
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                  {t("Quantity Of Cocoons in Kgs used to Produce Raw Silk is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                        </Row>

                        {/* Multiple rows: Equipment Date + Raw Silk + Form17J + Silk Exchange */}
                        {silkIncentiveList.map((row, index) => (
                          <div key={index} className="border rounded p-3 mb-3 mt-3">
                            <Row className="g-gs">
                              <Col lg="3">
                                <Form.Group className="form-group">
                                  <Form.Label>{t("Transaction Date")}<span className="text-danger">*</span></Form.Label>
                                  <div className="form-control-wrap">
                                    <DatePicker
                                      selected={row.equipmentDate}
                                      onChange={(date) => handleSilkIncentiveChange(index, "equipmentDate", date)}
                                      peekNextMonth
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      dateFormat="dd/MM/yyyy"
                                      className="form-control"
                                      maxDate={new Date()}
                                      portalId="seri-datepicker-portal"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                              <Col lg="3">
                                <Form.Group className="form-group">
                                  <Form.Label>{t("Quantity Of Raw Silk Produced in Kgs")}<span className="text-danger">*</span></Form.Label>
                                  <Form.Control
                                    type="text"
                                    inputMode="decimal"
                                    value={row.noOfRawSilkProduced}
                                    onChange={(e) => {
                                      // Digits and at most one decimal point — no letters/symbols.
                                      const sanitized = e.target.value
                                        .replace(/[^0-9.]/g, "")
                                        .replace(/(\..*)\./g, "$1");
                                      handleSilkIncentiveChange(index, "noOfRawSilkProduced", sanitized);
                                    }}
                                    placeholder={t("Enter No Of Raw Silk Produced")}
                                  />
                                </Form.Group>
                              </Col>
                              <Col lg="3">
                                <Form.Group className="form-group">
                                  <Form.Label>{t("Form 17J No")}<span className="text-danger">*</span></Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={row.form17JNo}
                                    onChange={(e) => handleSilkIncentiveChange(index, "form17JNo", e.target.value)}
                                    placeholder={t("Enter Form 17J No")}
                                  />
                                </Form.Group>
                              </Col>
                              <Col lg="3">
                                <Form.Group className="form-group">
                                  <Form.Label>{t("Silk Exchange Place")}<span className="text-danger">*</span></Form.Label>
                                  <Form.Select
                                    value={row.silkExchangeId}
                                    onChange={(e) => handleSilkIncentiveChange(index, "silkExchangeId", e.target.value)}
                                  >
                                    <option value="">{t("Select Silk Exchange Place")}</option>
                                    {silkListData.map((list) => (
                                      <option key={list.silkExchangeId} value={list.silkExchangeId}>{list.silkExchangeName}</option>
                                    ))}
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col lg="12" className="text-end">
                                {silkIncentiveList.length > 1 && (
                                  <Button variant="danger" size="sm" onClick={() => removeSilkIncentiveRow(index)}>{t("Remove")}</Button>
                                )}
                              </Col>
                            </Row>
                          </div>
                        ))}
                        <div className="mt-2 mb-2">
                          <Button variant="secondary" size="sm" onClick={addSilkIncentiveRow}>+ {t("Add Row")}</Button>
                        </div>

                  </Card.Body>
                </Card>
                </Block>
                </>
             )}

            {(
  getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
    "SS Construction Of Low Cost Shed to Permanent Rearing House" ||
  getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
    "SDP Construction Of  Low Cost Shed to  Permanent  Rearing House"
) && (

  <Card className="mt-2" style={{ borderRadius: "10px", border: "1px solid #dce8f5", boxShadow: "0 2px 8px rgba(26,95,168,0.07)", overflow: "hidden" }}>
    <Card.Header style={{ fontWeight: "600", fontSize: "13.5px", background: "#f0f6ff", color: "#1a3c6e", borderBottom: "1px solid #dce8f5", padding: "9px 16px", letterSpacing: "0.2px", display: "flex", alignItems: "center", gap: "8px" }}><span style={{ width: "4px", height: "16px", background: "#1a5fa8", borderRadius: "2px", display: "inline-block" }} />Financial Details</Card.Header>
    <Card.Body>
      <Row>

        {/* Financial Year */}
        <Col lg="4">
          <Form.Group>
            <Form.Label>
              Financial Year <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="newFinancialYear"
              value={data.newFinancialYear}
              onChange={handleInputs}
              required
            >
              <option value="">Select Year</option>
              {financialyearListData.map((list) => (
                <option
                  key={list.financialYearMasterId}
                  value={list.financialYearMasterId}
                >
                  {list.financialYear}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Already Paid */}
        <Col lg="4">
          <Form.Group>
            <Form.Label>
              Subsidy Amount Already Paid <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="alreadyPaidAmount"
              value={data.alreadyPaidAmount}
              onChange={handleInputs}
              placeholder="Enter Amount"
              required
            />
          </Form.Group>
        </Col>

      </Row>
    </Card.Body>
  </Card>
 )}


              {/* {showButton && ( */}
              {selectedBonusMode === "Automatic" && (
                    <Block className="mt-3">
                      <Card>
                        <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", fontWeight: 700, color: "white", padding: "10px 16px", letterSpacing: "0.3px" }}>
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
                                    portalId="seri-datepicker-portal"
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
                          <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", fontWeight: 700, color: "white", padding: "10px 16px", letterSpacing: "0.3px" }}>
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


               {/* {getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Registered Private Bivoltine Chawki Rearing Center Subsidy" && (
                    <Block className="mt-3">
                      <Card>
                        <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", fontWeight: 700, color: "white", padding: "10px 16px", letterSpacing: "0.3px" }}>
                          {t("Registered Private Bivoltine Chawki Rearing Center Subsidy Details")}
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-4">
                           

                           <Card>
                            <Card.Header style={{ fontWeight: "600", fontSize: "13.5px", background: "#f0f6ff", color: "#1a3c6e", borderBottom: "1px solid #dce8f5", padding: "9px 16px", letterSpacing: "0.2px" }}>Rearing Equipment Details</Card.Header>
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
                                <Card.Header style={{ fontWeight: "600", fontSize: "13.5px", background: "#f0f6ff", color: "#1a3c6e", borderBottom: "1px solid #dce8f5", padding: "9px 16px", letterSpacing: "0.2px" }}>Establishment Of Mulberry Garden</Card.Header>
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
                                <Card.Header style={{ fontWeight: "600", fontSize: "13.5px", background: "#f0f6ff", color: "#1a3c6e", borderBottom: "1px solid #dce8f5", padding: "9px 16px", letterSpacing: "0.2px" }}>Installation Of Drip Irrigation</Card.Header>

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
                                <Card.Header style={{ fontWeight: "600", fontSize: "13.5px", background: "#f0f6ff", color: "#1a3c6e", borderBottom: "1px solid #dce8f5", padding: "9px 16px", letterSpacing: "0.2px" }}>Chawki Rearing Building</Card.Header>

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
                getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
                  "Registered Private Bivoltine Chawki Rearing Center Subsidy" && (
                  <Block className="mt-3">
                    <Card>
                      <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", fontWeight: 700, color: "white", padding: "10px 16px", letterSpacing: "0.3px" }}>
                        {t("Registered Private Bivoltine Chawki Rearing Center Subsidy Details")}
                      </Card.Header>

                      <Card.Body>
                        <Row className="g-4">

                          
                          <Card className="p-0">
                            <Card.Header style={{ fontWeight: "600", fontSize: "13.5px", background: "#f0f6ff", color: "#1a3c6e", borderBottom: "1px solid #dce8f5", padding: "9px 16px", letterSpacing: "0.2px" }}>Rearing Equipment Details</Card.Header>
                            <Card.Body>
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>Select</th>
                                    <th>Subsidy Name</th>
                                    <th>Eligible Nos</th>
                                    <th>Eligible Value</th>
                                  
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
                                      
                                      <td>{row.maxAmountOfSubsidyEligible}</td>

                              
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

                              
                                <td>{calculateTotals(chawkiData).equipmentEligibleTotal}</td>
                                
                                <td>{calculateTotals(chawkiData).equipmentMaxSubsidyTotal}</td>


                                <td></td> 
                                <td></td>  

    
                                

                               
                                <td>{calculateTotals(chawkiData).equipmentPurchasedTotal}</td>

                                
                                <td>{calculateTotals(chawkiData).equipmentPercentageTotal}</td>
                              </tr>

                                </tbody>
                              </table>
                            </Card.Body>
                          </Card>

                         
                          <Card className="p-0">
                            <Card.Header style={{ fontWeight: "600", fontSize: "13.5px", background: "#f0f6ff", color: "#1a3c6e", borderBottom: "1px solid #dce8f5", padding: "9px 16px", letterSpacing: "0.2px" }}>Establishment Of Mulberry Garden</Card.Header>
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

                              <Row className="mt-3">
                            <Col lg="3">
                              <label>District</label>
                              <input
                                type="text"
                                className="form-control"
                                name="district"
                                value={chawkiData.mulberry.district}
                                onChange={(e) => handleSingleBlockChange("mulberry", e)}
                              />
                            </Col>
                            <Col lg="3">
                              <label>Taluk</label>
                              <input
                                type="text"
                                className="form-control"
                                name="taluk"
                                value={chawkiData.mulberry.taluk}
                                onChange={(e) => handleSingleBlockChange("mulberry", e)}
                              />
                            </Col>
                            <Col lg="3">
                              <label>Village</label>
                              <input
                                type="text"
                                className="form-control"
                                name="village"
                                value={chawkiData.mulberry.village}
                                onChange={(e) => handleSingleBlockChange("mulberry", e)}
                              />
                            </Col>
                            <Col lg="3">
                              <label>TSC</label>
                              <input
                                type="text"
                                className="form-control"
                                name="tsc"
                                value={chawkiData.mulberry.tsc}
                                onChange={(e) => handleSingleBlockChange("mulberry", e)}
                              />
                            </Col>
                          </Row>

                          <Row className="mt-3">
                            <Col lg="3">
                              <label>Training From Date</label>
                              <input
                                type="date"
                                className="form-control"
                                name="trainingFromDate"
                                value={chawkiData.mulberry.trainingFromDate}
                                onChange={(e) => handleSingleBlockChange("mulberry", e)}
                              />
                            </Col>
                            <Col lg="3">
                              <label>Training To Date</label>
                              <input
                                type="date"
                                className="form-control"
                                name="trainingToDate"
                                value={chawkiData.mulberry.trainingToDate}
                                onChange={(e) => handleSingleBlockChange("mulberry", e)}
                              />
                            </Col>
                            <Col lg="3">
                              <label>Register Date</label>
                              <input
                                type="date"
                                className="form-control"
                                name="registerDate"
                                value={chawkiData.mulberry.registerDate}
                                onChange={(e) => handleSingleBlockChange("mulberry", e)}
                              />
                            </Col>
                            <Col lg="3">
                              <label>Register No</label>
                              <input
                                type="text"
                                className="form-control"
                                name="registerNo"
                                value={chawkiData.mulberry.registerNo}
                                onChange={(e) => handleSingleBlockChange("mulberry", e)}
                              />
                            </Col>
                          </Row>

                          <Row className="mt-3">
                            <Col lg="4">
                              <label>Survey No</label>
                              <input
                                type="text"
                                className="form-control"
                                name="surveyNo"
                                value={chawkiData.mulberry.surveyNo}
                                onChange={(e) => handleSingleBlockChange("mulberry", e)}
                              />
                            </Col>
                            <Col lg="4">
                              <label>Acre</label>
                              <input
                                type="text"
                                className="form-control"
                                name="acre"
                                value={chawkiData.mulberry.acre}
                                onChange={(e) => handleSingleBlockChange("mulberry", e)}
                              />
                            </Col>
                            <Col lg="4">
                              <label>Vibhaga</label>
                              <input
                                type="text"
                                className="form-control"
                                name="vibhaga"
                                value={chawkiData.mulberry.vibhaga}
                                onChange={(e) => handleSingleBlockChange("mulberry", e)}
                              />
                            </Col>
                          </Row>
                            </Card.Body>
                          </Card>

                          
                          <Card className="p-0">
                            <Card.Header style={{ fontWeight: "600", fontSize: "13.5px", background: "#f0f6ff", color: "#1a3c6e", borderBottom: "1px solid #dce8f5", padding: "9px 16px", letterSpacing: "0.2px" }}>Installation Of Drip Irrigation</Card.Header>
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

                          

                          <Card className="p-0">
                            <Card.Header style={{ fontWeight: "600", fontSize: "13.5px", background: "#f0f6ff", color: "#1a3c6e", borderBottom: "1px solid #dce8f5", padding: "9px 16px", letterSpacing: "0.2px" }}>Chawki Rearing Building</Card.Header>
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

                              <Row className="mt-3">
                            <Col lg="3">
                              <label>District</label>
                              <input
                                type="text"
                                className="form-control"
                                name="district"
                                value={chawkiData.building.district}
                                onChange={(e) => handleSingleBlockChange("building", e)}
                              />
                            </Col>
                            <Col lg="3">
                              <label>Taluk</label>
                              <input
                                type="text"
                                className="form-control"
                                name="taluk"
                                value={chawkiData.building.taluk}
                                onChange={(e) => handleSingleBlockChange("building", e)}
                              />
                            </Col>
                            <Col lg="3">
                              <label>Village</label>
                              <input
                                type="text"
                                className="form-control"
                                name="village"
                                value={chawkiData.building.village}
                                onChange={(e) => handleSingleBlockChange("building", e)}
                              />
                            </Col>
                            <Col lg="3">
                              <label>TSC</label>
                              <input
                                type="text"
                                className="form-control"
                                name="tsc"
                                value={chawkiData.building.tsc}
                                onChange={(e) => handleSingleBlockChange("building", e)}
                              />
                            </Col>
                          </Row>

                          <Row className="mt-3">
                            <Col lg="4">
                              <label>Survey No</label>
                              <input
                                type="text"
                                className="form-control"
                                name="surveyNo"
                                value={chawkiData.building.surveyNo}
                                onChange={(e) => handleSingleBlockChange("building", e)}
                              />
                            </Col>
                            <Col lg="4">
                              <label>Acre</label>
                              <input
                                type="text"
                                className="form-control"
                                name="acre"
                                value={chawkiData.building.acre}
                                onChange={(e) => handleSingleBlockChange("building", e)}
                              />
                            </Col>
                            <Col lg="4">
                              <label>Sqft</label>
                              <input
                                type="text"
                                className="form-control"
                                name="sqft"
                                value={chawkiData.building.sqft}
                                onChange={(e) => handleSingleBlockChange("building", e)}
                              />
                            </Col>
                          </Row>

                          <Row className="mt-3">
                            <Col lg="6">
                              <label>Length</label>
                              <input
                                type="text"
                                className="form-control"
                                name="length"
                                value={chawkiData.building.length}
                                onChange={(e) => handleSingleBlockChange("building", e)}
                              />
                            </Col>
                            <Col lg="6">
                              <label>Breadth</label>
                              <input
                                type="text"
                                className="form-control"
                                name="breadth"
                                value={chawkiData.building.breadth}
                                onChange={(e) => handleSingleBlockChange("building", e)}
                              />
                            </Col>
                          </Row>
                            </Card.Body>
                          </Card>

                          <Card className="p-0">
                          <Card.Header style={{ fontWeight: "600", fontSize: "13.5px", background: "#f0f6ff", color: "#1a3c6e", borderBottom: "1px solid #dce8f5", padding: "9px 16px", letterSpacing: "0.2px" }}>Purchase of Equipment</Card.Header>
                          <Card.Body>
                            <Row>
                              <Col lg="3">
                                <label>District</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="district"
                                  value={chawkiData.equipment.district}
                                  onChange={(e) => handleSingleBlockChange("equipment", e)}
                                />
                              </Col>
                              <Col lg="3">
                                <label>Taluk</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="taluk"
                                  value={chawkiData.equipment.taluk}
                                  onChange={(e) => handleSingleBlockChange("equipment", e)}
                                />
                              </Col>
                              <Col lg="3">
                                <label>Village</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="village"
                                  value={chawkiData.equipment.village}
                                  onChange={(e) => handleSingleBlockChange("equipment", e)}
                                />
                              </Col>
                              <Col lg="3">
                                <label>TSC</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="tsc"
                                  value={chawkiData.equipment.tsc}
                                  onChange={(e) => handleSingleBlockChange("equipment", e)}
                                />
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col lg="6">
                                <label>Place</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="place"
                                  value={chawkiData.equipment.place}
                                  onChange={(e) => handleSingleBlockChange("equipment", e)}
                                />
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>

                          <Card className="mt-4">
                        <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", fontWeight: 700, color: "white", padding: "10px 16px", letterSpacing: "0.3px" }}>
                          Final Total Summary
                        </Card.Header>

                        <Card.Body>
                          {(() => {
                            const t = calculateTotals(chawkiData);
                            return (
                              <>
                             
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
                        <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", fontWeight: 700, color: "white", padding: "10px 16px", letterSpacing: "0.3px" }}>
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
                                    portalId="seri-datepicker-portal"
                                  />
                                </div>
                              </Form.Group>
                            </Col>

                            {/* <Col lg="2">
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
                          </Col> */}

                          


                       

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
                        <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", fontWeight: 700, color: "white", padding: "10px 16px", letterSpacing: "0.3px" }}>
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
                                    portalId="seri-datepicker-portal"
                                  />
                                </div>
                              </Form.Group>
                            </Col>

                          <Col lg="2">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                              Total Cocoons Transacted
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="cocoonsWeight"
                                type="text"
                                name="cocoonsWeight"
                                value={data.cocoonsWeight}
                                onChange={handleInputs}
                                placeholder="Enter Cocoons Transacted"
                              />
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="2">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                              No Of DFLs
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="lotWeight"
                                type="text"
                                name="lotWeight"
                                value={data.lotWeight}
                                onChange={handleInputs}
                                placeholder="Enter No Of DFLs"
                              />
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="2">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                              No Of Cocoons Per Kg
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="noOfCocoonPerKg"
                                type="text"
                                name="noOfCocoonPerKg"
                                value={data.noOfCocoonPerKg}
                                onChange={handleInputs}
                                placeholder="Enter No Of Cocoons Per Kg"
                              />
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="2">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                              Average Yield
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="averageYield"
                                type="text"
                                name="averageYield"
                                value={data.averageYield}
                                onChange={handleInputs}
                                placeholder="Enter Average Yield"
                              />
                            </div>
                          </Form.Group>
                        </Col>

                         <Col lg="2">
                           <Form.Group className="form-group">
                             <Form.Label>Eligible For Bonus</Form.Label>
                             <div className="form-control-wrap">
                               <Form.Control
                                 type="text"
                                 name="noOfRawSilkProduced"
                                 value={data.noOfRawSilkProduced}
                                 readOnly
                                 placeholder="Eligible For Bonus"
                               />
                             </div>
                           </Form.Group>
                         </Col>

                         <Col lg="2">
                           <Form.Group className="form-group">
                             <Form.Label>Eligible For Incentive</Form.Label>
                             <div className="form-control-wrap">
                               <Form.Control
                                 type="text"
                                 name="noOfCocoonsNeedToProduce"
                                 value={data.noOfCocoonsNeedToProduce}
                                 readOnly
                                 placeholder="Eligible For Incentive"
                               />
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
                  <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", fontWeight: 700, color: "white", padding: "10px 16px", letterSpacing: "0.3px" }}>
                    {t("Sanction Amount")}
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-gs">
                    <div className="gap-col">
                      <ul className="d-flex align-items-left justify-content-left gap g-3">

                        <li>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCalculateUnitPrice}
                            disabled={
                            !(
                              schemeDetails.calculationBasedOn ||
                              getIncentiveAndBonusData?.[0]?.calculationBasedOn
                            )
                          }
                          >
                            {t("Calculate Unit Price")}
                          </Button>
                        </li>
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

                      {/* ARM: Subsidy Amount = unitCost × (central% + state%) — auto calculated */}
                      {getIncentiveAndBonusData?.[0]?.unitForScheme === "Automatic Reeling Machine Unit" && (
                        <Col lg="4">
                          <Form.Group className="form-group mt-n5">
                            <Form.Label htmlFor="armSubsidyAmount">
                              {t("Subsidy Amount")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="armSubsidyAmount"
                                type="text"
                                name="expectedAmount"
                                value={data.expectedAmount}
                                readOnly
                                placeholder={t("Auto Calculated")}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                      )}



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

                      {/* IF NOT sanctionForReeling → Show normal field (not for ARM) */}
                    {!getIncentiveAndBonusData[0]?.sanctionForReeling &&
                      getIncentiveAndBonusData?.[0]?.calculationBasedOn !==
                        "Registered Private Bivoltine Chawki Rearing Center Subsidy" &&
                      getIncentiveAndBonusData?.[0]?.unitForScheme !== "Automatic Reeling Machine Unit" && (
                        <Col lg="4">
                          <Form.Group className="form-group mt-n5">
                            <Form.Label htmlFor="expectedAmount">
                              {t("Total Subsidy/Bonus/Incentive Amount")}
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
                                disabled
                              />
                              <Form.Control.Feedback type="invalid">
                                {t("Subsidy Amount is required")}
                              </Form.Control.Feedback>                     
                            </div>
                          </Form.Group> 
                        </Col>
                        )}  

                        {/* Subsidy Amount for Silk Samagra State: centralAmount + stateAmount */}
                        {schemeDetails.calculationBasedOn === "Silk Samagra State" &&
                          getIncentiveAndBonusData?.[0]?.calculationBasedOn !== "Rearing Equipment SS" &&
                          getIncentiveAndBonusData?.[0]?.calculationBasedOn !== "Registered Private Bivoltine Chawki Rearing Center Subsidy" &&
                          getIncentiveAndBonusData?.[0]?.unitForScheme !== "Automatic Reeling Machine Unit" && (
                          <Col lg="4">
                            <Form.Group className="form-group mt-n5">
                              <Form.Label htmlFor="silkSamagraSubsidyAmount">
                                {t("Subsidy Amount")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="silkSamagraSubsidyAmount"
                                  type="text"
                                  value={(Number(data.centralAmount) || 0) + (Number(data.stateAmount) || 0)}
                                  readOnly
                                  disabled
                                  placeholder="Auto Calculated"
                                />
                              </div>
                            </Form.Group>
                          </Col>
                        )}

                        {/* ✅ KEEP ONLY THIS */}
<Row className="mt-2">
  <Col lg="12" className="text-end">
    {(
  getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
    "SS Construction Of Low Cost Shed to Permanent Rearing House" ||
  getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
    "SDP Construction Of  Low Cost Shed to  Permanent  Rearing House"
) && (
      <Button onClick={() => setShowAmountBreakup(true)}>
        View Breakup
      </Button>
    )}
  </Col>
</Row>

{/* {showAmountBreakup && (
  <Card className="mt-2">
    <Card.Header>Amount Breakup</Card.Header>
    <Card.Body>

      <Row>
        <Col md="4">
          <strong>Central Amount:</strong> {data.centralAmount || 0}
        </Col>

        <Col md="4">
          <strong>State Amount:</strong> {Math.max((data.stateAmount || 0) - (data.alreadyPaidAmount || 0),0)}
        </Col>

        <Col md="4">
          <strong>Total Subsidy:</strong> 
          {(data.centralAmount || 0) + (data.stateAmount || 0)}
        </Col>
      </Row>

    </Card.Body>
  </Card>
)} */}


{showAmountBreakup && (
  <Card className="mt-2">
    <Card.Header>Amount Breakup</Card.Header>
    <Card.Body>

      {(() => {
        const remainingState = Math.max(
          (data.stateAmount || 0) - (data.alreadyPaidAmount || 0),
          0
        );

        return (
          <Row>
            <Col md="4">
              <strong>Central Amount:</strong> {data.centralAmount || 0}
            </Col>

            <Col md="4">
              <strong>State Amount:</strong> {remainingState}
            </Col>

            <Col md="4">
              <strong>Total Subsidy:</strong> 
              {(data.centralAmount || 0) + remainingState}
            </Col>
          </Row>
        );
      })()}

    </Card.Body>
  </Card>
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
                    getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
                      "Registered Private Bivoltine Chawki Rearing Center Subsidy") &&
                    getIncentiveAndBonusData?.[0]?.unitForScheme !== "Automatic Reeling Machine Unit" && (
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
                        getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
                          "Registered Private Bivoltine Chawki Rearing Center Subsidy") &&
                        getIncentiveAndBonusData?.[0]?.calculationBasedOn !==
                          "SS Construction Of Low Cost Shed to Permanent Rearing House" &&
                        getIncentiveAndBonusData?.[0]?.calculationBasedOn !==
                          "Silk Incentive-PSF" &&
                        getIncentiveAndBonusData?.[0]?.unitForScheme !== "Automatic Reeling Machine Unit" && (
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
                              disabled
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
                    <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", fontWeight: 700, color: "white", padding: "10px 16px", letterSpacing: "0.3px" }}>
                      {t("Constructed Area")}
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        {/* <Col lg="4">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="landDeveloped">
                              {t("Unit")}
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
                             
                            </div>
                          </Form.Group>
                        </Col> */}

                        <Col lg="4">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="landDeveloped">
                              {t("Extent Of Mulberry(In Acres)")}
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

                        {!(getIncentiveAndBonusData?.[0]?.calculationBasedOn === "SDP RH 225" ||
                          getIncentiveAndBonusData?.[0]?.calculationBasedOn === "SDP Low Cost Shed") && (
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
                        )}

                        <Col lg="4">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="landDeveloped">
                              {t("Estimated Cost (in lakhs)")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="estimatedCost"
                                type="text"
                                name="estimatedCost"
                                value={developedLand.estimatedCost}
                                onChange={handleDevelopedLandInputs}
                                placeholder="Enter Estimated Cost"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {t("Estimated Cost is required")}
                              </Form.Control.Feedback>
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

                        <Col lg="4">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="landDeveloped">
                              {t("Length (in feet)")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="length"
                                type="text"
                                name="length"
                                value={developedLand.length}
                                onChange={handleDevelopedLandInputs}
                                placeholder="Enter Length"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {t("Length (in feet) is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="4">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="landDeveloped">
                              {t("Breadth (in feet)")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="breadth"
                                type="text"
                                name="breadth"
                                value={developedLand.breadth}
                                onChange={handleDevelopedLandInputs}
                                placeholder="Enter Breadth"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {t("Breadth (in feet) is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>


                        <Col lg="4">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="landDeveloped">
                              {t("Height")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="height"
                                type="text"
                                name="height"
                                value={developedLand.height}
                                onChange={handleDevelopedLandInputs}
                                placeholder="Enter Height"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {t("Height is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Block>
              )}

              {(data.equordev.includes("equipment") || getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Rearing Equipment SS") && (
                <Block className="mt-3">
                  <Card>
                    <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", fontWeight: 700, color: "white", padding: "10px 16px", letterSpacing: "0.3px" }}>
                      {t("Equipment Purchase")}
                    </Card.Header>
                    <Card.Body>

                      {/* ── Rearing Equipment SS: multiple rows ── */}
                      {getIncentiveAndBonusData?.[0]?.calculationBasedOn === "Rearing Equipment SS" ? (
                        <>
                          <Row className="g-gs mb-3">
                            <Col lg="4">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label>{t("Vendor Name")}</Form.Label>
                                <Form.Select name="vendorId" value={data.vendorId} onChange={handleInputs}>
                                  <option value="">{t("Select Vendor Name")}</option>
                                  {scVendorListData.map((list) => (
                                    <option key={list.scVendorId} value={list.scVendorId}>{list.name}</option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                          {rearingEquipmentPurchaseList.map((row, index) => (
                            <div key={index} className="border rounded p-3 mb-3">
                              <Row className="g-gs">
                                <Col lg="4">
                                  <Form.Group className="form-group mt-n3">
                                    <Form.Label>{t("Equipment Details")}</Form.Label>
                                    <Form.Control type="text" name="description" value={row.description} onChange={(e) => handleRearingEquipmentChange(index, e)} placeholder={t("Enter Equipment Details")} />
                                  </Form.Group>
                                </Col>
                                <Col lg="4">
                                  <Form.Group className="form-group mt-n3">
                                    <Form.Label>{t("Machine Type")}</Form.Label>
                                    <Form.Select name="machineTypeId" value={row.machineTypeId} onChange={(e) => handleRearingEquipmentChange(index, e)}>
                                      <option value="">{t("Select Machine Type")}</option>
                                      {machineTypeListData.map((list) => (
                                        <option key={list.machineTypeId} value={list.machineTypeId}>{list.machineTypeName}</option>
                                      ))}
                                    </Form.Select>
                                  </Form.Group>
                                </Col>
                                <Col lg="4">
                                  <Form.Group className="form-group mt-n3">
                                    <Form.Label>{t("L1 Rate")}</Form.Label>
                                    <Form.Control type="text" name="l1Rate" value={row.l1Rate} onChange={(e) => handleRearingEquipmentChange(index, e)} placeholder={t("Enter L1 Rate")} />
                                  </Form.Group>
                                </Col>
                                <Col lg="4">
                                  <Form.Group className="form-group mt-n3">
                                    <Form.Label>Quantity (In No's)</Form.Label>
                                    <Form.Control type="text" name="machineQuantity" value={row.machineQuantity} onChange={(e) => handleRearingEquipmentChange(index, e)} placeholder="Enter Quantity (In No's)" />
                                  </Form.Group>
                                </Col>
                                <Col lg="4">
                                  <Form.Group className="form-group mt-n3">
                                    <Form.Label>Tax Invoice No</Form.Label>
                                    <Form.Control type="text" name="taxInvoiceNo" value={row.taxInvoiceNo} onChange={(e) => handleRearingEquipmentChange(index, e)} placeholder="Enter Tax Invoice No" />
                                  </Form.Group>
                                </Col>
                                <Col lg="4">
                                  <Form.Group className="form-group mt-n3">
                                    <Form.Label>{t("Tax Invoice Date")}</Form.Label>
                                    <DatePicker selected={row.taxInvoiceDate} onChange={(date) => handleRearingEquipmentDateChange(index, date)} peekNextMonth showMonthDropdown showYearDropdown dropdownMode="select" dateFormat="dd/MM/yyyy" className="form-control" maxDate={new Date()} portalId="seri-datepicker-portal" />
                                  </Form.Group>
                                </Col>
                                <Col lg="12" className="text-end">
                                  {rearingEquipmentPurchaseList.length > 1 && (
                                    <Button variant="danger" size="sm" onClick={() => removeRearingEquipmentRow(index)} className="me-2">
                                      {t("Remove")}
                                    </Button>
                                  )}
                                  {index === rearingEquipmentPurchaseList.length - 1 && (
                                    <Button variant="primary" size="sm" onClick={addRearingEquipmentRow}>
                                      + {t("Add Row")}
                                    </Button>
                                  )}
                                </Col>
                              </Row>
                            </div>
                          ))}
                        </>
                      ) : (
                        /* ── All other schemes: single form ── */
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>
                                {t("Vendor Name")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="vendorId"
                                  value={equipment.vendorId}
                                  onChange={handleEquipmentInputs}
                                >
                                  <option value="">{t("Select Vendor Name")}</option>
                                  {scVendorListData.map((list) => (
                                    <option key={list.scVendorId} value={list.scVendorId}>{list.name}</option>
                                  ))}
                                </Form.Select>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="description">{t("Equipment Details")}</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control id="description" type="text" name="description" value={equipment.description} onChange={handleEquipmentInputs} placeholder={t("Enter Equipment Details")} />
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="schemeAmount">{t("Machine Type")}</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select name="machineTypeId" value={data.machineTypeId} onChange={handleInputs}>
                                  <option value="">{t("Select Machine Type")}</option>
                                  {machineTypeListData.map((list) => (
                                    <option key={list.machineTypeId} value={list.machineTypeId}>{list.machineTypeName}</option>
                                  ))}
                                </Form.Select>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="description">{t("L1 Rate")}</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control id="l1Rate" type="text" name="l1Rate" value={equipment.l1Rate} onChange={handleEquipmentInputs} placeholder={t("Enter L1 Rate")} />
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="schemeAmount">Quantity (In No's)</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control id="machineQuantity" type="text" name="machineQuantity" value={data.machineQuantity} onChange={handleInputs} placeholder="Enter Quantity (In No's)" />
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="schemeAmount">Tax Invoice No</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control id="taxInvoiceNo" type="text" name="taxInvoiceNo" value={data.taxInvoiceNo} onChange={handleInputs} placeholder="Enter Tax Invoice No" />
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="sordfl">{t("Tax Invoice Date")}</Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker selected={data.taxInvoiceDate} onChange={(date) => handleDateChange(date, "taxInvoiceDate")} peekNextMonth showMonthDropdown showYearDropdown dropdownMode="select" dateFormat="dd/MM/yyyy" className="form-control" maxDate={new Date()} portalId="seri-datepicker-portal" />
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                      )}

                    </Card.Body>
                  </Card>
                </Block>
              )}

            {/* ── Reeler Land Details (ARM only) ─────────────────────── */}
            {getIncentiveAndBonusData?.[0]?.unitForScheme === "Automatic Reeling Machine Unit" && (
              <Block className="mt-3">
                <Card className="mb-4">
                  <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", fontWeight: 700, color: "white", padding: "10px 16px" }}>
                    {t("Reeler Land Details")}
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-gs">
                      <Col lg="4">
                        <Form.Group className="form-group">
                          <Form.Label>{t("Land Type")} <span className="text-danger">*</span></Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select name="armLandType" value={data.armLandType} onChange={handleInputs} required>
                              <option value="">{t("-- Own / Lease --")}</option>
                              <option value="Own">{t("Own")}</option>
                              <option value="Lease">{t("Lease")}</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{t("Land Type is required")}</Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="4">
                        <Form.Group className="form-group">
                          <Form.Label>{t("District")} <span className="text-danger">*</span></Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select name="armDistrictId" value={data.armDistrictId} onChange={handleInputs} required>
                              <option value="">{t("Select District")}</option>
                              {districtListData && districtListData.map(d => (
                                <option key={d.districtId} value={d.districtId}>{d.districtName}</option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{t("District is required")}</Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="4">
                        <Form.Group className="form-group">
                          <Form.Label>{t("Taluk")} <span className="text-danger">*</span></Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select name="armTalukId" value={data.armTalukId} onChange={handleInputs} required>
                              <option value="">{t("Select Taluk")}</option>
                              {armTalukListData.map(d => (
                                <option key={d.talukId} value={d.talukId}>{d.talukName}</option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{t("Taluk is required")}</Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="4">
                        <Form.Group className="form-group">
                          <Form.Label>{t("Hobli")} <span className="text-danger">*</span></Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select name="armHobliId" value={data.armHobliId} onChange={handleInputs} required>
                              <option value="">{t("Select Hobli")}</option>
                              {armHobliListData.map(d => (
                                <option key={d.hobliId} value={d.hobliId}>{d.hobliName}</option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{t("Hobli is required")}</Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="4">
                        <Form.Group className="form-group">
                          <Form.Label>{t("Village")} <span className="text-danger">*</span></Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select name="armVillageId" value={data.armVillageId} onChange={handleInputs} required>
                              <option value="">{t("Select Village")}</option>
                              {armVillageListData.map(d => (
                                <option key={d.villageId} value={d.villageId}>{d.villageName}</option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{t("Village is required")}</Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="4">
                        <Form.Group className="form-group">
                          <Form.Label>{t("Address")} <span className="text-danger">*</span></Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control type="text" name="armAddress" value={data.armAddress} onChange={handleInputs} placeholder={t("Enter Address")} required />
                            <Form.Control.Feedback type="invalid">{t("Address is required")}</Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="4">
                        <Form.Group className="form-group">
                          <Form.Label>{t("Owner Name")} <span className="text-danger">*</span></Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control type="text" name="armOwnerName" value={data.armOwnerName} onChange={handleInputs} placeholder={t("Enter Owner Name")} required />
                            <Form.Control.Feedback type="invalid">{t("Owner Name is required")}</Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="4">
                        <Form.Group className="form-group">
                          <Form.Label>{t("Survey No. / Property No.")} <span className="text-danger">*</span></Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control type="text" name="armSurveyNo" value={data.armSurveyNo} onChange={handleInputs} placeholder={t("Enter Survey No. / Property No.")} required />
                            <Form.Control.Feedback type="invalid">{t("Survey No. is required")}</Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="4">
                        <Form.Group className="form-group">
                          <Form.Label>{t("Assessment No.")} <span className="text-danger">*</span></Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control type="text" name="armAssessmentNo" value={data.armAssessmentNo} onChange={handleInputs} placeholder={t("Enter Assessment No.")} required />
                            <Form.Control.Feedback type="invalid">{t("Assessment No. is required")}</Form.Control.Feedback>
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
                      <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", fontWeight: 700, color: "white", padding: "10px 16px", letterSpacing: "0.3px" }}>
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
                    <Button type="submit" className="sh-save-btn" disabled={saveDisabled}>
                    {t("save")}
                </Button>
                  </li>
                  <li>
                    <Button type="button" className="sh-cancel-btn" onClick={clear}>
                    {t("cancel")}
                    </Button>
                  </li>
                </ul>
              </div>
            </Row>
          </Form>
        </Block>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="xl" contentClassName="sh-modal-content">
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
                    {modalDocList.map((list) => (
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
                    {t("Upload Documents(PDF/jpg/png)(Max:5MB)")}
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
            {/* ✅ VIEW BREAKUP MODAL */}
<Modal
  show={showAmountBreakup}
  onHide={() => setShowAmountBreakup(false)}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Subsidy Breakdown</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {(
  getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
    "SS Construction Of Low Cost Shed to Permanent Rearing House" ||
  getIncentiveAndBonusData?.[0]?.calculationBasedOn ===
    "SDP Construction Of  Low Cost Shed to  Permanent  Rearing House"
) && (

      <Card>
        <Card.Body>

          <Row>
            <Col>Central Amount</Col>
            <Col>₹ {data.centralAmount}</Col>
          </Row>

          <Row>
            <Col>Total State</Col>
            <Col>₹ {originalStateAmount}</Col>
          </Row>

          <Row>
            <Col>Already Paid</Col>
            <Col>₹ {data.alreadyPaidAmount}</Col>
          </Row>

          <Row>
            <Col><b>Remaining</b></Col>
            <Col><b>₹ {data.stateAmount}</b></Col>
          </Row>

        </Card.Body>
      </Card>
    )}
  </Modal.Body>

  <Modal.Footer>
    <Button onClick={() => setShowAmountBreakup(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
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
                                portalId="seri-datepicker-portal"
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

          <Modal show={showModalBreakUp} onHide={handleCloseModalBreakUp} size="xl" contentClassName="sh-modal-content">
            <Modal.Header closeButton style={{ background: "#f0f6ff", borderBottom: "1px solid #dce8f5" }}>
              <Modal.Title style={{ fontWeight: "700", color: "#1a3c6e", fontSize: "16px" }}>{t("Break Up")}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "20px 24px" }}></Modal.Body>
          </Modal>
    </Layout>
  );
}

export default ServiceApplication;
