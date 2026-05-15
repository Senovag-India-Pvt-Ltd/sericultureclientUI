import { Card, Form, Row, Col, Button,Modal} from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { useState, useEffect,useMemo  } from "react";
import { useParams } from "react-router-dom";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
import ReactSelect from "react-select";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURLRegistration = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT; 

function LotGroupage() {
  const { t } = useTranslation();

const [dataLotList, setDataLotList] = useState([]); 
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: localStorage.getItem("godownId"),
    buyerType: "RSP",
    buyerId: "",
    lotWeight: "",
    amount: "",
    soldAmount: "",
    dflLotNumber: "",
    averageYield: "",
    lotParentLevel: "",
    externalUnitId: "",
    fruitsId: "",
  });

  const [auctionDate,setAuctionDate] = useState(new Date());
  const [allottedLotId,setAllottedLotId] = useState("");
  console.log(dataLotList);

 const clean = ()=>{
  setData({
    marketId: localStorage.getItem("marketId"),
    godownId: localStorage.getItem("godownId"),
    buyerType: "Reeler",
    buyerId: "",
    lotWeight: "",
    amount: "",
    soldAmount: "",
    dflLotNumber: "",
    averageYield: "",
    lotParentLevel: "",
    externalUnitId: "",
     fruitsId: "",
  });
  setBalanceError(false);
  setPurposeForRejection(false);
  setMovingToAnotherMarket(false);
  setMovingMarketReason("");
 }

 const [id, setId] = useState(localStorage.getItem("userMasterId"));
 const [marketMasterId, setMarketMasterId] = useState(null);

 const getIdList = () => {
     setLoading(true);
     const response = api
       .get(baseURL + `userMaster/get-join/${id}`)
       .then((response) => {
         setMarketMasterId(response.data.content.marketMasterId);
        //  setTalukId(response.data.content.talukId);
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

   const [requiredBasePrice, setRequiredBasePrice] = useState(false);
   const [isTriplet, setIsTriplet] = useState("");
   const [rejectionPercentage, setRejectionPercentage] = useState(0);
   const [purposeForRejection, setPurposeForRejection] = useState(false);
   const [movingToAnotherMarket, setMovingToAnotherMarket] = useState(false);
   const [movingMarketReason, setMovingMarketReason] = useState("");

// Example API call (adjust to your actual API)
useEffect(() => {
  api.get(`${baseURL}marketMaster/get/${localStorage.getItem("marketId")}`)
    .then(response => {
      setRequiredBasePrice(response.data.content.requiredBasePrice);
      setIsTriplet(response.data.content.weighmentTripletGeneration);
      const pct = response.data.content.rejectionPercentage;
      setRejectionPercentage(pct != null ? Number(pct) : 0);
    });
}, []);



  const [validatedDisplay, setValidatedDisplay] = useState(false);

const handleDateChange = (date) => {
    // setData((prev) => ({ ...prev, auctionDate: date }));
    setAuctionDate(date);
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
  const [balanceError, setBalanceError] = useState(false);
  // const handleShowModal = () => setShowModal(true);
 const handleShowModal = () => {
  // CASE 1️⃣: Market requires base price → price must exist
  if (requiredBasePrice) {
    if (price) {
      // Auto-fill price since it's mandatory and available
      setData(prev => ({ ...prev, amount: price }));
      setShowModal(true);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Price not available. Please perform a search first.",
      });
    }
    return;
  }

  // CASE 2️⃣: Market does NOT require base price → manual entry allowed
  // Do NOT enforce price
  setShowModal(true);
};

  
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
      const buyerName = 
      data.buyerType === "RSP" ? data.licenseNumber :
      data.buyerType === "NSSO" ? data.address :
      data.buyerType === "Reeling" ? data.reelerName :
      data.buyerType === "Govt Grainage" ? data.grainageMasterName : '';
      setDataLotList((prev) => [...prev, {...data,auctionDate,allottedLotId,buyerName}]);
      // Reset the form for the next entry but keep the price (amount) intact

      // Update total lot weight
    setTotalLotWeight((prevTotal) => prevTotal + parseFloat(data.lotWeight || 0));

    setData((prevData) => ({
      ...prevData,
      buyerType: "RSP",
      buyerId: "",
      lotWeight: "",
      soldAmount: "",
      dflLotNumber: "",
      averageYield: "",
      lotParentLevel: "",
      externalUnitId: "",
       fruitsId: "",
      // Keep the amount (price) if it's already set
      amount: prevData.amount,
    }));
      clean();
      setShowModal(false);
      setValidatedLot(false);
    }
    // e.preventDefault();
  };

  const [farmerdetails,setFarmerDetails] = useState({
    farmerFirstName:"",
    lotParentLevel:"",
    price:"",
    netWeight:"",
    farmerFruitsId:"",
    initialWeighment:""

  })

const handleDeleteLotDetails = (i) => {
  setDataLotList((prev) => {
    const deletedLotWeight = parseFloat(prev[i].lotWeight || 0);

    // Subtract deleted lot weight from totalLotWeight
    setTotalLotWeight((prevTotal) => prevTotal - deletedLotWeight);

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

  

  // Handle editing a lot
const handleUpdateLotDetails = (e, i, changes) => {
  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
    setValidatedEdit(true);
  } else {
    e.preventDefault();

    const previousLotWeight = parseFloat(dataLotList[i].lotWeight || 0);
    const newLotWeight = parseFloat(changes.lotWeight || 0);

    // Adjust the total lot weight based on the difference between the old and new weight
    setTotalLotWeight((prevTotal) => prevTotal - previousLotWeight + newLotWeight);

    // Update the lot details in the list
    setDataLotList((prev) =>
      prev.map((item, ix) => ix === i ? { ...item, ...changes } : item)
    );

    setShowModal1(false);
    setValidatedEdit(false);

    setData({
      buyerType: "RSP",
      buyerId: "",
      lotWeight: "",
      amount: "",
      marketFee: "",
      soldAmount: "",
      allottedLotId: "",
      auctionDate: "",
      lotParentLevel: "",
      externalUnitId: "",
       fruitsId: "",
    });
  }
};
  

  // const handleInputs = (e) => {
  //   const { name, value } = e.target;

  //   setData((prevData) => {
  //     const newData = { ...prevData, [name]: value };
  
  //     // Calculate soldAmount if both lotWeight and amount are present
  //     if (newData.buyerType !== "Reeling" && newData.lotWeight && newData.amount) {
  //       // Calculate total and fix to 2 decimal points, then convert to an integer
  //       newData.soldAmount = Math.floor(parseFloat(newData.lotWeight) * parseFloat(newData.amount));
  //     } else {
  //       newData.soldAmount = ''; // Clear soldAmount if inputs are missing
  //     }
  
  //     // Prevent editing 'amount' if it's already fetched
  //     if (name === 'amount' && prevData.amount) {
  //       return prevData; // Return the previous state to prevent updates to the price field
  //     }
  
  //     return newData; // Return the new data state
  //   });
  
  //   // Set the new state for allottedLotId
  //   if (name === 'allottedLotId') {
  //     setAllottedLotId(value);
  //   }
  // };

  const handleInputs = (e) => {
  const { name, value } = e.target;

  // Do NOT block user typing unless requiredBasePrice is true
  if (name === "amount" && requiredBasePrice) return;

  const newData = { ...data, [name]: value };

  // Recalculate soldAmount
  if (newData.lotWeight && newData.amount) {
    newData.soldAmount = Math.floor(
      parseFloat(newData.lotWeight) * parseFloat(newData.amount)
    );
  } else {
    newData.soldAmount = "";
  }

  setData(newData);

  // Re-validate balance whenever soldAmount is recalculated and a buyer is already selected
  if (
    (name === "lotWeight" || name === "amount" || name === "soldAmount") &&
    newData.soldAmount &&
    (newData.buyerId || newData.externalUnitId)
  ) {
    validateReelerBalance(newData);
  }

  if (name === "allottedLotId") {
    setAllottedLotId(value);
  }
};


   

   const [searchValidated, setSearchValidated] = useState(false);

  

  const [lotParentLevel, setLotParentLevel] = useState(null);
  const [fruitsId, setFruitsId] = useState(null);
  const [calculatedAverageYield, setCalculatedAverageYield] = useState(null);
  const [noOfDFLs, setNoOfDFLs] = useState(null);
  const [price, setPrice] = useState(0);

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
  
  const search = (event) => {
    setDataLotList([]);
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setSearchValidated(true);
    } else {
      event.preventDefault();
      const formattedAuctionDate = formatAuctionDate(auctionDate);
      api
        .post(
          baseURLMarket +
            `lotGroupage/getUpdateLotDistributeByLotIdForSeedMarket`,
          {
            allottedLotId: allottedLotId,
            auctionDate: formattedAuctionDate,
            marketId: localStorage.getItem("marketId"),
            godownId: localStorage.getItem("godownId"),
          }
        )
        .then((response) => {
          const lotGroupageId = response.data.content[0].lotGroupageId;
          const fetchedPrice = response.data.content[0].price;
          const fetchedNoOfDFLs = response.data.content[0].noOfDFLs;
          const fetchedAverageYield = response.data.content[0].calculatedAverageYield;
          // Extract lotParentLevel from the response
        const newLotParentLevel = response.data.content[0].lotParentLevel;
        const saledFruitsId = response.data.content[0].farmerFruitsId;
        setLotParentLevel(newLotParentLevel);
        setFruitsId(saledFruitsId);
        setCalculatedAverageYield(fetchedAverageYield);
        setNoOfDFLs(fetchedNoOfDFLs);
        setPrice(fetchedPrice); // Set the new lotParentLeve
        setData((prevData) => ({
          ...prevData,
          amount: fetchedPrice,  // Automatically set price
        }));

  
          // Saved rejection / market-move flags come back per row; the lot is one logical
          // unit so we read them off the first row (any row would have the same values).
          const savedPurposeForRejection = !!response.data.content[0].purposeForRejection;
          const savedMovingToAnotherMarket = !!response.data.content[0].movingToAnotherMarket;
          const savedMovingMarketReason = response.data.content[0].movingMarketReason || "";
          const savedRejectionQuantity = response.data.content[0].rejectionQuantity;

          if (lotGroupageId) {
            // navigate(`/seriui/lot-groupage-edit/${lotGroupageId}`);
            setFarmerDetails((prev) => ({
              ...prev,
              farmerFirstName: response.data.content[0].farmerFirstName,
              // lotParentLevel: response.data.content[0].lotParentLevel,
              lotParentLevel: newLotParentLevel,
              farmerFruitsId: response.data.content[0].farmerFruitsId,
              // price: response.data.content[0].price,
              price: fetchedPrice,
              calculatedAverageYield: fetchedAverageYield,
              netWeight: response.data.content[0].netWeight,
              noOfDFLs: fetchedNoOfDFLs,
              initialWeighment: response.data.content[0].initialWeighment,
              marketAuctionDate: response.data.content[0].marketAuctionDate,
              soldCocoonInKgs : response.data.content[0].soldCocoonInKgs,
              remainingCocoonWeight : response.data.content[0].remainingCocoonWeight,
              lotWeightAfterWeighment : response.data.content[0].lotWeightAfterWeighment,
              purposeForRejection: savedPurposeForRejection,
              movingToAnotherMarket: savedMovingToAnotherMarket,
              movingMarketReason: savedMovingMarketReason,
              rejectionQuantity: savedRejectionQuantity,
            }));
            // setLotParentLevel(response.data.content[0].lotParentLevel,);
           // Automatically set the fetched price in the data state

            // Restore checkbox + reason state so the UI reflects what was saved.
            setPurposeForRejection(savedPurposeForRejection);
            setMovingToAnotherMarket(savedMovingToAnotherMarket);
            setMovingMarketReason(savedMovingMarketReason);

            setDataLotList(response.data.content);
            setShowFarmerDetails(true);
          } else {
            setFarmerDetails((prev) => ({
              ...prev,
              farmerFirstName: response.data.content[0].farmerFirstName,
              lotParentLevel: response.data.content[0].lotParentLevel,
              farmerFruitsId: response.data.content[0].farmerFruitsId,
              price: response.data.content[0].price,
              calculatedAverageYield: response.data.content[0].calculatedAverageYield,
              netWeight: response.data.content[0].netWeight,
              noOfDFLs: response.data.content[0].noOfDFLs,
              initialWeighment: response.data.content[0].initialWeighment,
              marketAuctionDate: response.data.content[0].marketAuctionDate,
              soldCocoonInKgs : response.data.content[0].soldCocoonInKgs,
              remainingCocoonWeight : response.data.content[0].remainingCocoonWeight,
              lotWeightAfterWeighment : response.data.content[0].lotWeightAfterWeighment,
              purposeForRejection: savedPurposeForRejection,
              movingToAnotherMarket: savedMovingToAnotherMarket,
              movingMarketReason: savedMovingMarketReason,
              rejectionQuantity: savedRejectionQuantity,
            }));
            setShowFarmerDetails(true);
          }
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
              title: "No Records Found",
              html: `
                <div style="padding:6px 4px 8px">
                  <div style="background:linear-gradient(135deg,#fffaf0,#fff);border:1.5px solid #fbd38d;border-radius:14px;padding:18px 20px;display:flex;align-items:flex-start;gap:14px;text-align:left">
                    <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#ed8936,#f6ad55);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;box-shadow:0 4px 12px rgba(237,137,54,0.30)">🔍</div>
                    <div>
                      <p style="color:#7b341e;font-size:14px;font-weight:700;margin:0 0 6px">We couldn't find any details</p>
                      <p style="color:#9c4221;font-size:13px;margin:0 0 8px;line-height:1.6">
                        No lot information is available for the selected
                        <b>Bidding Slip Lot Number</b> and <b>Auction Date</b>.
                      </p>
                      <p style="color:#9c4221;font-size:12px;margin:0;line-height:1.55">
                        Please verify the lot number and date, then try again.
                      </p>
                    </div>
                  </div>
                </div>`,
              showCloseButton: true,
              confirmButtonText: "OK",
              confirmButtonColor: "#ed8936",
              background: "#fff",
              showClass: { popup: "animate__animated animate__fadeInDown animate__faster" },
              hideClass: { popup: "animate__animated animate__fadeOutUp animate__faster" },
              customClass: { popup: "swal-pop" },
            });
          }
          setFarmerDetails({});
          setLoading(false);
        });
    }
  };

  
  const [totalLotWeight, setTotalLotWeight] = useState(0);
  // const remainingCocoonWeight = farmerdetails.netWeight - (data.lotWeight || 0);
  // const remainingCocoonWeight = farmerdetails.netWeight - totalLotWeight;
  // Conditionally update remainingCocoonWeight based on totalLotWeight
const remainingCocoonWeight =
  totalLotWeight > 0
    ? Number(farmerdetails?.netWeight || 0) - Number(totalLotWeight || 0)
    : Number(farmerdetails?.netWeight || 0);

// Format only for display (ensure it's a number first)
const formattedRemainingCocoonWeight = Number(remainingCocoonWeight).toFixed(2);

// Disable Add button if lotWeight exceeds remaining cocoon weight
const isAddDisabled = Number(data.lotWeight || 0) > Number(remainingCocoonWeight);

// When editing, add back the original lot's weight so its own weight doesn't count against remaining
const editRemainingCocoonWeight = remainingCocoonWeight + Number(dataLotList[lotId]?.lotWeight || 0);
const isEditDisabled = Number(data.lotWeight || 0) > Number(editRemainingCocoonWeight);

// === Rejection-related derived values ===
// Total weighed-in quantity for this lot
const lotWeightAfterWeighmentVal = Number(farmerdetails?.lotWeightAfterWeighment || 0);

// Sum of distributed quantity across all rows added to the buyers list
const distributedQuantity = useMemo(
  () => (dataLotList || []).reduce((sum, item) => sum + Number(item.lotWeight || 0), 0),
  [dataLotList]
);

// Remaining qty = lotWeightAfterWeighment - distributedQuantity (validated >= 0 below)
const remainingQty = Number((lotWeightAfterWeighmentVal - distributedQuantity).toFixed(2));

// remainingPercentage = (remainingQty / lotWeightAfterWeighment) * 100  (guard divide-by-zero)
const remainingPercentage = lotWeightAfterWeighmentVal > 0
  ? Number(((remainingQty / lotWeightAfterWeighmentVal) * 100).toFixed(2))
  : 0;

// Negative remaining qty is a validation error
const isRemainingNegative = remainingQty < 0;

// Indicates the checkbox is meaningfully applicable (only when there IS leftover)
const hasRemaining = remainingQty > 0;


 
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

    
     console.log(isTriplet);
   
    //  const getMarketDetails = () => {
    //    // console.log("hello world");
    //    api
    //      .get(baseURL + `marketMaster/get/${localStorage.getItem("marketId")}`)
    //      .then((response) => {
    //        if (!response.data.content.error) {
    //          setIsTriplet(response.data.content.weighmentTripletGeneration);
    //        } else {
    //          console.error(response.data.content.error_description);
    //        }
   
    //        console.log(response);
    //      })
    //      .catch((err) => {});
    //  };
   
    //  useEffect(() => {
    //    getMarketDetails();
    //  }, []);

 
  const _header = { "Content-Type": "application/json", accept: "*/*" };

 
  // const postData = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);
  //   } else {
  //     event.preventDefault();

  //     // Format the auction date
  //   const formattedAuctionDate = formatAuctionDate(auctionDate); 
  
  //     // Check if there is any lotGroupageId in the dataLotList
  //     const hasLotGroupageId = dataLotList.some(item => item.lotGroupageId);
  
  //     if (hasLotGroupageId) {
  //       // If lotGroupageId is present, prepare the update request
  //       const requestData = {
  //         marketId: localStorage.getItem("marketId"),
  //         godownId: localStorage.getItem("godownId"),
  //         lotGroupageRequestEditList: dataLotList.map(item => ({
  //           lotGroupageId: item.lotGroupageId,
  //           buyerType: item.buyerType,
  //           buyerId: item.buyerId,
  //           lotWeight: item.lotWeight,
  //           amount: item.amount,
  //           soldAmount: item.soldAmount,
  //           externalUnitId: item.externalUnitId,
  //           // dflLotNumber:item.dflLotNumber,
  //           invoiceNumber:item.invoiceNumber,
  //           //  averageYield: item.averageYield,
  //           allottedLotId: allottedLotId,
  //           // auctionDate: auctionDate,
  //           auctionDate: formattedAuctionDate,
  //           lotParentLevel: lotParentLevel,
  //           averageYield: calculatedAverageYield,
  //           dflLotNumber: noOfDFLs,
  //           remainingCocoonWeight: remainingCocoonWeight,
  //           fruitsId : fruitsId,
  //           marketId: localStorage.getItem("marketId"),
  //           godownId: localStorage.getItem("godownId"),
  //         }))
  //       };
  
  //       api.post(baseURLMarket + 'lotGroupage/updateLotGroupage', requestData)
  //         .then(response => {
  //           const updatedList = response.data.content;  // Fetch updated data

  //           // Generate invoice details from the updated response data
  //           const invoiceDetails = updatedList
  //             .map(item => `${item.buyerType} = ${item.invoiceNumber ? item.invoiceNumber : 'No Invoice Available'}`)
  //             .join("<br>");
  
  //           // Show the success message
  //             Swal.fire({
  //             icon: 'success',
  //             title: 'Updated successfully',
  //             html: `Invoice Details:<br>${invoiceDetails}`,
  //           }).then(() => {
  //             // Reload the page once user clicks OK
  //             window.location.reload();
  //           });
  
  //           clear();
  //           setValidated(false);
  //       })
  //         .catch(error => {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Update failed',
  //             text: 'There was an error updating the lot groupage details.'
  //           });
  //         });
  //     } else {
  //       // If no lotGroupageId is present, prepare the save request
  //       // const sendPost = {
  //       //   lotGroupageRequests: dataLotList,
  //       // };
  //       const sendPost = {
  //         lotGroupageRequests: dataLotList.map(item => ({
  //           ...item,
  //           lotParentLevel: lotParentLevel,
  //           fruitsId: fruitsId,
  //           averageYield: calculatedAverageYield,
  //           dflLotNumber: noOfDFLs, 
  //           remainingCocoonWeight: remainingCocoonWeight,  // Include lotParentLevel
  //           auctionDate: formatAuctionDate(item.auctionDate)  // Format and include auctionDate
  //         })),
  //       };
  
  //       api
  //         .post(baseURLMarket + 'lotGroupage/saveLotGroupage', sendPost)
  //         .then((response) => {
  //           if (response.data.content.error) {
  //             saveError(response.data.content.error_description);
  //           } else {
  //             saveSuccess(response.data.content);
  //             setData({
  //               buyerType: "",
  //               buyerId: "",
  //               lotWeight: "",
  //               amount: "",
  //               marketFee: "",
  //               soldAmount: "",
  //               allottedLotId: "",
  //               auctionDate: "",
  //               dflLotNumber: "",
  //               averageYield: "",
  //               externalUnitId: "",
  //               fruitsId: "",
  //             });
  //             clear();
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
  //         });
  //     }
  
  //     setValidated(true);
  //   }
  // };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();

      // === Front-end validation: distributed quantity cannot exceed final weighment ===
      if (lotWeightAfterWeighmentVal > 0 && distributedQuantity > lotWeightAfterWeighmentVal) {
        saveError(`Distributed Quantity (${distributedQuantity} Kg) cannot exceed Final Weighment (${lotWeightAfterWeighmentVal} Kg).`);
        return;
      }
      if (isRemainingNegative) {
        saveError("Remaining Quantity cannot be negative. Please review the distributed quantities.");
        return;
      }

      const formattedAuctionDate = formatAuctionDate(auctionDate);
      const hasLotGroupageId = dataLotList.some(item => item.lotGroupageId);
      setIsSaving(true);

      // Only the checkbox flag is persisted; the threshold comparison is UI-only.
      const purposeForRejectionFlag = !!purposeForRejection;
      const movingToAnotherMarketFlag = !!movingToAnotherMarket;
      const trimmedMovingMarketReason = (movingMarketReason || "").trim();

      // Reason is required when "Moving to another market" is ticked.
      if (movingToAnotherMarketFlag && !trimmedMovingMarketReason) {
        setIsSaving(false);
        saveError("Please enter a Reason for moving to another market.");
        return;
      }

      if (hasLotGroupageId) {
        const requestData = {
          marketId: localStorage.getItem("marketId"),
          godownId: localStorage.getItem("godownId"),
          lotGroupageRequestEditList: dataLotList.map(item => ({
            lotGroupageId: item.lotGroupageId,
            buyerType: item.buyerType,
            buyerId: item.buyerId,
            lotWeight: item.lotWeight,
            amount: item.amount,
            soldAmount: item.soldAmount,
            externalUnitId: item.externalUnitId,
            invoiceNumber: item.invoiceNumber,
            allottedLotId: allottedLotId,
            auctionDate: formattedAuctionDate,
            lotParentLevel: lotParentLevel,
            averageYield: calculatedAverageYield,
            dflLotNumber: noOfDFLs,
            remainingCocoonWeight: movingToAnotherMarketFlag ? 0 : remainingCocoonWeight,
            fruitsId: fruitsId,
            marketId: localStorage.getItem("marketId"),
            godownId: localStorage.getItem("godownId"),
            purposeForRejection: purposeForRejectionFlag,
            movingToAnotherMarket: movingToAnotherMarketFlag,
            movingMarketReason: movingToAnotherMarketFlag ? trimmedMovingMarketReason : null,
          }))
        };

        api.post(baseURLMarket + 'lotGroupage/updateLotGroupage', requestData)
          .then(response => {
            const updatedList = response.data.content;
            const invoiceRows = updatedList
              .map(item => `<tr><td style="padding:6px 12px;color:#2d3748;font-weight:600">${item.buyerType}</td><td style="padding:6px 12px;color:#1e67a8;font-weight:700">${item.invoiceNumber || 'No Invoice Available'}</td></tr>`)
              .join("");
            setIsSaving(false);
            Swal.fire({
              icon: 'success',
              title: 'Updated Successfully',
              html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#f0fff4,#f6fffa);border:1.5px solid #9ae6b4;border-radius:14px;padding:16px 20px;text-align:left"><p style="color:#276749;font-size:13px;font-weight:700;margin:0 0 10px">Invoice Details</p><table style="width:100%;border-collapse:collapse"><thead><tr style="background:#e6ffed"><th style="padding:6px 12px;color:#22543d;font-size:12px;text-align:left">Buyer Type</th><th style="padding:6px 12px;color:#22543d;font-size:12px;text-align:left">Invoice Number</th></tr></thead><tbody>${invoiceRows}</tbody></table></div></div>`,
              confirmButtonText: 'OK', confirmButtonColor: '#1e67a8', background: '#fff',
              showClass: { popup: 'animate__animated animate__bounceIn animate__faster' },
              customClass: { popup: 'swal-pop' },
            }).then(() => {
              if (isTriplet) printTriplet();
              window.location.reload();
            });
            clear();
            setValidated(false);
          })
          .catch(error => {
            setIsSaving(false);
            Swal.fire({
              icon: 'error', title: 'Update Failed',
              html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">❌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Update Not Saved</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">There was an error updating the lot groupage details. Please try again.</p></div></div></div>`,
              confirmButtonText: 'Close', confirmButtonColor: '#e53e3e', background: '#fff',
              showClass: { popup: 'animate__animated animate__shakeX animate__faster' },
              customClass: { popup: 'swal-pop' },
            });
          });
      } else {
        const sendPost = {
          lotGroupageRequests: dataLotList.map(item => ({
            ...item,
            lotParentLevel: lotParentLevel,
            fruitsId: fruitsId,
            averageYield: calculatedAverageYield,
            dflLotNumber: noOfDFLs,
            remainingCocoonWeight: movingToAnotherMarketFlag ? 0 : remainingCocoonWeight,
            auctionDate: formatAuctionDate(item.auctionDate),
            purposeForRejection: purposeForRejectionFlag,
            movingToAnotherMarket: movingToAnotherMarketFlag,
            movingMarketReason: movingToAnotherMarketFlag ? trimmedMovingMarketReason : null,
          })),
        };

        api
          .post(baseURLMarket + 'lotGroupage/saveLotGroupage', sendPost)
          .then((response) => {
            setIsSaving(false);
            if (response.data.content.error) {
              saveError(response.data.content.error_description);
            } else {
              saveSuccess(response.data.content);
              if (isTriplet) printTriplet();
              setData({
                buyerType: "",
                buyerId: "",
                lotWeight: "",
                amount: "",
                marketFee: "",
                soldAmount: "",
                allottedLotId: "",
                auctionDate: "",
                dflLotNumber: "",
                averageYield: "",
                externalUnitId: "",
                fruitsId: "",
              });
              clear();
              setValidated(false);
            }
          })
          .catch((err) => {
            setIsSaving(false);
            if (err.response?.data?.validationErrors &&
                Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            } else {
              saveError("There was an error saving the lot groupage details.");
            }
          });
      }

      setValidated(true);
    }
  };

  const printTriplet = () => {
      // const newDate = new Date();
      const formattedDate =
        auctionDate.getFullYear() +
        "-" +
        (auctionDate.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        auctionDate.getDate().toString().padStart(2, "0");
      api
        .post(
          baseURLReport + `gettripletpdf-kannada-seed`,
          {
            marketId: localStorage.getItem("marketId"),
            godownId: localStorage.getItem("godownId"),
            allottedLotId: allottedLotId,
            auctionDate: formattedDate,
          },
          {
            responseType: "blob", //Force to receive data in a Blob Format
          }
        )
        .then((response) => {
          
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          const printWindow = window.open(fileURL);
          if (printWindow) {
            printWindow.onload = () => {
              printWindow.print();
            };
          } else {
            console.error("Failed to open the print window.");
          }
        })
        .catch((error) => {
          // console.log("error", error);
        });
    };
  

  const updateLotGroupage = () => {
    const requestData = {
      marketId: localStorage.getItem("marketId"),
      godownId: localStorage.getItem("godownId"),
      lotGroupageRequestEditList: dataLotList.map(item => ({
        marketId: localStorage.getItem("marketId"),
        godownId: localStorage.getItem("godownId"),
        lotGroupageId: item.lotGroupageId,
        buyerType: item.buyerType,
        buyerId: item.buyerId,
        lotWeight: item.lotWeight,
        amount: item.amount,
        soldAmount: item.soldAmount,
        allottedLotId: item.allottedLotId,
        auctionDate: item.auctionDate
      }))
    };

    api.post(baseURLMarket + 'lotGroupage/updateLotGroupage', requestData)
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Updated successfully'
        });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Update failed',
          text: 'There was an error updating the lot groupage details.'
        });
      });
  };

  const handleReelerOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName,chooseUnit] = value.split("_");
    setData({
      ...data,
      buyerId: chooseId,
      address: chooseName,
      buyerName: chooseName,
      externalUnitId:chooseUnit
    });
  };

  const showBalanceErrorAlert = (message) => {
    setBalanceError(true);
    if (!document.getElementById("swal-balance-styles")) {
      const style = document.createElement("style");
      style.id = "swal-balance-styles";
      style.innerHTML = `
        .swal-balance-alert { border-radius: 18px !important; padding: 10px !important; box-shadow: 0 20px 60px rgba(229,62,62,0.22) !important; }
        .swal-balance-alert .swal2-title { font-size: 20px !important; font-weight: 700 !important; color: #c53030 !important; }
        .swal-balance-alert .swal2-confirm { border-radius: 8px !important; padding: 10px 28px !important; font-weight: 600 !important; font-size: 14px !important; }
        .swal-balance-alert .swal2-icon { margin: 14px auto 6px !important; }
      `;
      document.head.appendChild(style);
    }
    Swal.fire({
      icon: "warning",
      title: "Insufficient Balance",
      html: `
        <div style="text-align:center;padding:4px 0">
          <p style="color:#c53030;font-size:15px;font-weight:600;margin:0;line-height:1.7">${message}</p>
          <p style="color:#a0aec0;font-size:12px;margin:10px 0 0">Please ask the buyer to recharge their account.</p>
        </div>`,
      confirmButtonText: "OK, Got it",
      confirmButtonColor: "#e53e3e",
      background: "#fff",
      customClass: { popup: "swal-balance-alert" },
    });
  };

  const extractErrorMessage = (data) => {
    // Format 1: errorMessages[0].message[0].message  (standard ResponseWrapper)
    if (data?.errorMessages?.[0]?.message?.[0]?.message)
      return data.errorMessages[0].message[0].message;
    // Format 2: errorMessages is a plain string
    if (typeof data?.errorMessages === "string") return data.errorMessages;
    // Format 3: errorMessages is an array of strings
    if (Array.isArray(data?.errorMessages) && typeof data.errorMessages[0] === "string")
      return data.errorMessages[0];
    // Format 4: top-level message field
    if (data?.message) return data.message;
    // Format 5: error_description (used by some endpoints)
    if (data?.error_description) return data.error_description;
    // Format 6: raw string body
    if (typeof data === "string") return data;
    return null;
  };

  const validateReelerBalance = (updatedData) => {
    const { buyerType, buyerId, externalUnitId, soldAmount } = updatedData;

    // Only validate for Reeling and RSP buyer types
    if (!buyerType || ["Govt Grainage", "NSSO"].includes(buyerType)) return;
    if (!buyerId && !externalUnitId) return;

    const marketId = parseInt(
      updatedData.marketId || localStorage.getItem("marketId")
    );

    setBalanceError(false); // reset while new validation is in-flight

    api
      .post(baseURLMarket + "lotGroupage/validateReelerBalance", {
        lotGroupageRequests: [
          {
            marketId,
            buyerType: buyerType || "",
            buyerId: buyerId ? parseInt(buyerId) : null,
            externalUnitId: externalUnitId ? parseInt(externalUnitId) : null,
            soldAmount: soldAmount ? parseInt(soldAmount) : 0,
          },
        ],
      })
      .then((response) => {
        // Some Spring implementations return 200 with error embedded in body
        const data = response?.data;
        const errMsg = extractErrorMessage(data);
        if (errMsg && data?.content !== "Balance validation successful") {
          showBalanceErrorAlert(errMsg);
        } else {
          setBalanceError(false); // validation passed
        }
      })
      .catch((err) => {
        const errMsg =
          extractErrorMessage(err?.response?.data) ||
          "Unable to validate buyer balance.";
        showBalanceErrorAlert(errMsg);
      });
  };

   const handleManualReelerOption = (selectedOption) => {
    if (!selectedOption) {
      setData((prev) => ({
        ...prev,
        buyerId: "",
        reelerName: "",
        buyerName: "",
        externalUnitId: "",
      }));
      return;
    }
    const [chooseId, chooseName] = selectedOption.value.split("_");
    const updatedData = {
      ...data,
      buyerId: chooseId,
      reelerName: chooseName,
      buyerName: chooseName,
      externalUnitId: "",
    };
    setData(updatedData);
    validateReelerBalance(updatedData);
  };

  const handleGrainageOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName,chooseUnit] = value.split("_");
    const updatedData = {
      ...data,
      buyerId: chooseId,
      grainageMasterName: chooseName,
      buyerName: chooseName,
      externalUnitId: chooseUnit,
    };
    setData(updatedData);
    validateReelerBalance(updatedData);
  };

  // District
  const handleExternalOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName,chooseUnit] = value.split("_");
    setData({
      ...data,
      buyerId: chooseId,
      licenseNumber: chooseName,
      buyerName: chooseName,
      externalUnitId:chooseUnit
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
        auctionDate: new Date(), // Set to today's dat
        dflLotNumber: "",
        averageYield: "",
        externalUnitId: "",
        fruitsId: "",
    });
  setFarmerDetails({
    farmerFirstName:"",
    farmerMiddleName:"",
    farmerFruitsId:""
  });
  setAuctionDate(new Date());
setAllottedLotId("");
    setDataLotList([]);
  };

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!document.getElementById("swal-lotgroupage-styles")) {
    const s = document.createElement("style");
    s.id = "swal-lotgroupage-styles";
    s.innerHTML = `
      .swal-pop { border-radius: 22px !important; padding: 8px !important; box-shadow: 0 30px 90px rgba(0,0,0,0.22) !important; }
      .swal-pop .swal2-title { font-size: 21px !important; font-weight: 800 !important; color: #1a202c !important; }
      .swal-pop .swal2-icon { margin: 20px auto 4px !important; }
      .swal-pop .swal2-html-container { margin: 0 !important; padding: 0 !important; }
      .swal-pop .swal2-actions { gap: 10px !important; }
      .swal-pop .swal2-confirm, .swal-pop .swal2-cancel { border-radius: 11px !important; padding: 12px 30px !important; font-weight: 700 !important; font-size: 14px !important; }
    `;
    document.head.appendChild(s);
  }

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

   const addressOptions = externalListData?.map((list) => ({
  value: `${list.userMasterId}_${list.address}_${list.externalUnitRegistrationId}`,
  label: `${list.address} (${list.licenseNumber})`,
}));

  const reelerOptions = reelerListData?.map((list) => ({
    value: `${list.reelerId}_${list.reelerName}_${list.reelerId}`,
    label: `${list.reelerName} (${list.reelingLicenseNumber || ""})`,
  }));


  // to get Grainage
  const [grainageListData, setGrainageListData] = useState([]);

  const getGrainageList = () => {
    const response = api
      .get(baseURL+ `grainageMaster/get-all`)
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

  // const styles = {
  //   cardHeader: {
  //     backgroundColor: "rgb(15, 108, 190, 1)",
  //     color: "rgb(255, 255, 255)",
  //     fontSize: "20px",
  //     padding: "7px",
  //     textAlign: "center",
  //     borderTopLeftRadius: "8px",
  //     borderTopRightRadius: "8px",
  //   },
  //   cardBody: {
  //     backgroundColor: "rgb(255, 255, 255)",
  //     padding: "20px",
  //     borderBottomLeftRadius: "8px",
  //     borderBottomRightRadius: "8px",
  //   },
  //   table: {
  //     width: "100%",
  //     borderCollapse: "collapse",
  //     marginBottom: "15px",
  //   },
  //   tableRow: {
  //     borderBottom: "1px solid #ddd",
  //   },
  //   ctstyle: {
  //     backgroundColor: "rgb(248, 248, 249)",
  //     color: "rgb(0, 0, 0)",
  //     padding: "10px",
  //     fontWeight: "600",
  //   },
  //   cell: {
  //     padding: "10px",
  //     textAlign: "left",
  //     color: "#333",
  //   },
  //   boldText: {
  //     fontWeight: "bold",
  //   },
  // };

  // Reusable pill style for stat chips in the Rejection Details card
  const pillStyle = (bg, color) => ({
    background: bg,
    color: color,
    borderRadius: "999px",
    padding: "5px 12px",
    fontSize: "12px",
    fontWeight: 600,
    border: `1px solid ${color}22`,
    whiteSpace: "nowrap",
  });

  const styles = {
    cardHeader: {
      backgroundColor: "rgb(15, 108, 190, 1)",
      color: "rgb(255, 255, 255)",
      fontSize: "18px", // Reduced font size for compact design
      padding: "7px",
      textAlign: "center",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
    cardBody: {
      backgroundColor: "rgb(255, 255, 255)",
      padding: "15px", // Reduced padding for a more compact design
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "10px", // Reduced margin between table and other elements
    },
    tableRow: {
      borderBottom: "1px solid #ddd",
    },
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249)",
      color: "rgb(0, 0, 0)",
      padding: "8px", // Reduced padding to decrease row height
      fontWeight: "600",
      width: "15%", // Adjusted width for a more even column layout
      wordWrap: "break-word", // To prevent overflow
    },
    cell: {
      padding: "8px", // Reduced padding for a more compact look
      textAlign: "left",
      color: "#333",
      width: "18%", // Adjusted width for consistent layout
      wordWrap: "break-word", // Prevent overflow of long text
    },
  };
  

  const navigate = useNavigate();
  // const saveSuccess = (message) => {
  //   Swal.fire({
  //     icon: "success",
  //     title: "Saved successfully",
  //     text: `Invoice Number ${message}`,
  //   }).then(() => {
  //     navigate("#");
  //   });
  // };
  // const saveSuccess = (messages) => {
  //   const invoiceDetails = messages
  //     .map((item) => `${item.buyerType} = ${item.invoiceNumber}`)
  //     .join("\n");
  
  //   Swal.fire({
  //     icon: "success",
  //     title: "Saved successfully",
  //     text: `Invoice Details:\n${invoiceDetails}`,
  //   }).then(() => {
  //     navigate("#");
  //   });
  // };
  const saveSuccess = (messages) => {
    const invoiceRows = messages
      .map((item) => `<tr><td style="padding:6px 12px;color:#2d3748;font-weight:600">${item.buyerType}</td><td style="padding:6px 12px;color:#1e67a8;font-weight:700">${item.invoiceNumber || 'N/A'}</td></tr>`)
      .join("");
    Swal.fire({
      icon: "success",
      title: "Saved Successfully",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#f0fff4,#f6fffa);border:1.5px solid #9ae6b4;border-radius:14px;padding:16px 20px;text-align:left"><p style="color:#276749;font-size:13px;font-weight:700;margin:0 0 10px">Invoice Details</p><table style="width:100%;border-collapse:collapse"><thead><tr style="background:#e6ffed"><th style="padding:6px 12px;color:#22543d;font-size:12px;text-align:left">Buyer Type</th><th style="padding:6px 12px;color:#22543d;font-size:12px;text-align:left">Invoice Number</th></tr></thead><tbody>${invoiceRows}</tbody></table></div></div>`,
      confirmButtonText: "OK", confirmButtonColor: "#1e67a8", background: "#fff",
      showClass: { popup: "animate__animated animate__bounceIn animate__faster" },
      customClass: { popup: "swal-pop" },
    }).then(() => { window.location.reload(); });
  };

  const [purchaseMode, setPurchaseMode] = useState(""); // "Manual" or "Bid"
const handlePurchaseModeChange = (e) => {
  setPurchaseMode(e.target.value);
  // Optionally clear dependent fields
  setData({ ...data, buyerId: "", reelerName: "" });
};

  
  
  const saveError = (message) => {
    const errorMessage = typeof message === "object"
      ? Object.values(message).join("<br>")
      : message;
    Swal.fire({
      icon: "error", title: "Save Not Successful",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">❌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Could Not Save</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${errorMessage}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e", background: "#fff",
      showClass: { popup: "animate__animated animate__shakeX animate__faster" },
      customClass: { popup: "swal-pop" },
    });
  };

  return (
    <Layout title={t("Lot Distribution")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Lot Distribution")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            {/* <ul className="d-flex">
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
            </ul> */}
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        {/* <Form action="#"> */}
        <Form noValidate validated={searchValidated} onSubmit={search}>
            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)" }}>
              <div style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)", padding: "16px 24px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🔍</div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>{t("Lot Distribution")}</div>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>Search by bidding slip lot number and auction date</div>
                </div>
              </div>
              <Card.Body style={{ padding: "14px 20px" }}>
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group mb-0">
                      <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        {t("Bidding Slip Lot NO.")}<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={3}>
                        <Form.Control
                          id="allotedLotId"
                          name="allottedLotId"
                          value={allottedLotId}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Lot Number")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Lot Number is required.")}
                        </Form.Control.Feedback>
                      </Col>
                      <Form.Label column sm={1}>
                        {t("Date")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={auctionDate}
                            onChange={handleDateChange}
                            maxDate={new Date()}
                            className="form-control"
                          />
                        </div>
                      </Col>
                      <Col sm={2}>
                      <Button type="submit" variant="primary">
                       {t("Search")}
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
                  <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(30,103,168,0.10)", marginTop: "16px" }}>
                    <div style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)", padding: "12px 24px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "18px" }}>👨‍🌾</span>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{t("Farmer Details")}</span>
                    </div>
                    <Card.Body style={{ ...styles.cardBody, padding: "16px" }}>
                      <Row className="g-gs">
                        <Col lg="12">
                          <table style={styles.table} className="table small table-bordered">
                            <tbody>
                              <tr style={styles.tableRow}>
                                <td style={styles.ctstyle}>{t("Fruits Id:")}</td>
                                <td style={styles.cell}>{farmerdetails.farmerFruitsId}</td>
                                <td style={styles.ctstyle}>{t("Farmer Name:")}</td>
                                <td style={styles.cell}>{farmerdetails.farmerFirstName}</td>
                                <td style={styles.ctstyle}>{t("Bidding Slip Issued Date:")}</td>
                                <td style={styles.cell}>{farmerdetails.marketAuctionDate}</td>
                              </tr>
                              <tr style={styles.tableRow}>
                                <td style={styles.ctstyle}>{t("Lot No:")}</td>
                                <td style={styles.cell}>{farmerdetails.lotParentLevel}</td>
                                <td style={styles.ctstyle}>{t("No OF DFLs:")}</td>
                                <td style={styles.cell}>{farmerdetails.noOfDFLs}</td>
                                {/* <td style={styles.ctstyle}>{t("Price:")}</td> */}
                                <td style={styles.ctstyle}>Price:</td>
                                <td style={styles.cell}>{farmerdetails.price}</td>
                              </tr>
                              <tr style={styles.tableRow}>
                                <td style={styles.ctstyle}>{t("Initial Weighment:")}</td>
                                <td style={styles.cell}>{farmerdetails.initialWeighment}</td>
                                <td style={styles.ctstyle}>{t("Final Weighment in Kgs:")}</td>
                                <td style={styles.cell}>{farmerdetails.lotWeightAfterWeighment}</td>
                                <td style={styles.ctstyle}>{t("Average Yield:")}</td>
                                <td style={styles.cell}>{farmerdetails.calculatedAverageYield}</td>
                              </tr>
                              <tr style={styles.tableRow}>
                              <td style={styles.ctstyle}>{t("Sold Cocoon in Kgs:")}</td>
                                <td style={styles.cell}>{farmerdetails.soldCocoonInKgs}</td>
                                {(() => {
                                  // Label toggles with the LIVE checkbox state so the user can
                                  // flip between views after the lot is saved. Values come from
                                  // the SAVED data: the rejection / moved amounts are only known
                                  // after a save, so if the user ticks a box that wasn't saved
                                  // we show 0 for that stat rather than re-allocating remaining.
                                  const liveRejection = !!purposeForRejection;
                                  const liveMoved = !!movingToAnotherMarket;

                                  const wasSavedRejected = !!farmerdetails?.purposeForRejection;
                                  const wasSavedMoved = !!farmerdetails?.movingToAnotherMarket;
                                  const rejectedValue = wasSavedRejected
                                    ? Number(farmerdetails?.rejectionQuantity || 0)
                                    : 0;
                                  // Moved qty isn't persisted in its own column — compute it
                                  // from the saved buyer rows: weighment - sum(lot_weight).
                                  const savedDistributed = (dataLotList || []).reduce(
                                    (sum, item) => sum + Number(item.lotWeight || 0), 0
                                  );
                                  const movedValue = wasSavedMoved
                                    ? Math.max(0, Number((lotWeightAfterWeighmentVal - savedDistributed).toFixed(2)))
                                    : 0;

                                  if (liveRejection && liveMoved) {
                                    return (
                                      <>
                                        <td style={styles.ctstyle}>{t("Rejected / Moved:")}</td>
                                        <td style={styles.cell}>
                                          <div>{t("Rejected Cocoons")}: {rejectedValue.toFixed(2)} Kg</div>
                                          <div>{t("Moved to another market")}: {movedValue.toFixed(2)} Kg</div>
                                        </td>
                                      </>
                                    );
                                  }
                                  if (liveRejection) {
                                    return (
                                      <>
                                        <td style={styles.ctstyle}>{t("Rejected Cocoons:")}</td>
                                        <td style={styles.cell}>{rejectedValue.toFixed(2)}</td>
                                      </>
                                    );
                                  }
                                  if (liveMoved) {
                                    return (
                                      <>
                                        <td style={styles.ctstyle}>{t("Moved to another market:")}</td>
                                        <td style={styles.cell}>{movedValue.toFixed(2)}</td>
                                      </>
                                    );
                                  }
                                  return (
                                    <>
                                      <td style={styles.ctstyle}>{t("Remaining Cocoon in Kgs:")}</td>
                                      <td style={styles.cell}>{formattedRemainingCocoonWeight}</td>
                                    </>
                                  );
                                })()}
                                <td style={styles.ctstyle}>{t("Remaining Cocoon in Store:")}</td>
                                <td style={styles.cell}>{farmerdetails.remainingCocoonWeight}</td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>


                  </Col>
                )}


        <Form noValidate validated={validated} onSubmit={postData}>
          {showFarmerDetails && (
            <Row className="g-1">
              <Col lg="12">
                <Card
                  style={{
                    borderRadius: "14px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(229,62,62,0.10)",
                    marginTop: "16px",
                  }}
                >
                  <div
                    style={{
                      background: "linear-gradient(135deg, #e53e3e 0%, #fc5c7d 100%)",
                      padding: "12px 24px",
                      borderRadius: "14px 14px 0 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>⚠️</span>
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>
                      {t("Rejection Details")}
                    </span>
                  </div>
                  <Card.Body style={{ padding: "16px 20px", background: "#fffafa" }}>
                    <Row className="g-3 align-items-center">
                      <Col lg="6" md="6" sm="12">
                        <label
                          htmlFor="purposeForRejection"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 14px",
                            background: purposeForRejection
                              ? "linear-gradient(135deg,#fff5f5,#fff)"
                              : "#fff",
                            border: purposeForRejection
                              ? "1.5px solid #fc8181"
                              : "1.5px solid #e2e8f0",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "13px",
                            color: "#2d3748",
                            boxShadow: purposeForRejection
                              ? "0 2px 8px rgba(229,62,62,0.15)"
                              : "none",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <input
                            id="purposeForRejection"
                            name="purposeForRejection"
                            type="checkbox"
                            checked={!!purposeForRejection}
                            onChange={(e) => setPurposeForRejection(e.target.checked)}
                            style={{
                              width: "18px",
                              height: "18px",
                              accentColor: "#e53e3e",
                              cursor: "pointer",
                            }}
                          />
                          <span>{t("Reject Cocoons")}</span>
                        </label>
                      </Col>
                      <Col lg="6" md="6" sm="12">
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <span style={pillStyle("#ebf4ff", "#1e67a8")}>
                            {t("Weighment")}: <b>{lotWeightAfterWeighmentVal || 0} Kg</b>
                          </span>
                          <span style={pillStyle("#e6fffa", "#276749")}>
                            {t("Distributed")}: <b>{distributedQuantity || 0} Kg</b>
                          </span>
                          {(() => {
                            // Mirror the Farmer Details cell: labels toggle with the live
                            // checkboxes, but the displayed amount uses saved DB data when
                            // available (so reopening a saved lot shows the actual rejected /
                            // moved amounts, not a live re-allocation of remainingQty).
                            const wasSavedRejected = !!farmerdetails?.purposeForRejection;
                            const wasSavedMoved = !!farmerdetails?.movingToAnotherMarket;
                            const savedDistributed = (dataLotList || []).reduce(
                              (sum, item) => sum + Number(item.lotWeight || 0), 0
                            );
                            const savedRejectedQty = wasSavedRejected
                              ? Number(farmerdetails?.rejectionQuantity || 0)
                              : 0;
                            const savedMovedQty = wasSavedMoved
                              ? Math.max(0, Number((lotWeightAfterWeighmentVal - savedDistributed).toFixed(2)))
                              : 0;
                            // Moving to another market takes precedence over rejection: when
                            // moved is active the remaining qty is recorded as moved (see
                            // postData), so the rejected pill must NOT also claim it.
                            const movedActive = movingToAnotherMarket || wasSavedMoved;
                            const rejectedDisplay = wasSavedRejected
                              ? savedRejectedQty
                              : (movedActive ? 0 : remainingQty);
                            const movedDisplay = wasSavedMoved ? savedMovedQty : remainingQty;

                            // Show pills based on live flags OR saved state, so a reopened
                            // lot whose checkboxes default to unchecked still reflects its
                            // saved categorization (don't fall back to "Remaining" then).
                            const showMoved = movingToAnotherMarket || wasSavedMoved;
                            const showRejected = purposeForRejection || wasSavedRejected;

                            const pills = [];
                            if (showMoved) {
                              pills.push(
                                <span key="moved" style={pillStyle("#fff7ed", "#9c4221")}>
                                  {t("Moved to another market")}: <b>{Number(movedDisplay).toFixed(2)} Kg</b>
                                </span>
                              );
                            }
                            if (showRejected) {
                              pills.push(
                                <span key="rejected" style={pillStyle("#fff5f5", "#c53030")}>
                                  {t("Rejected Cocoons")}: <b>{Number(rejectedDisplay).toFixed(2)} Kg</b>
                                </span>
                              );
                            }
                            if (pills.length === 0) {
                              pills.push(
                                <span
                                  key="remaining"
                                  style={pillStyle(
                                    isRemainingNegative ? "#fff5f5" : "#fffaf0",
                                    isRemainingNegative ? "#c53030" : "#b7791f"
                                  )}
                                >
                                  {t("Remaining")}: <b>{remainingQty} Kg</b>
                                </span>
                              );
                            }
                            return pills;
                          })()}
                          {rejectionPercentage > 0 && (
                            <span style={pillStyle("#faf5ff", "#6b46c1")}>
                              {t("Threshold")}: <b>{rejectionPercentage}%</b>
                            </span>
                          )}
                        </div>
                      </Col>
                      <Col lg="6" md="6" sm="12">
                        <label
                          htmlFor="movingToAnotherMarket"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 14px",
                            background: movingToAnotherMarket
                              ? "linear-gradient(135deg,#fff7ed,#fff)"
                              : "#fff",
                            border: movingToAnotherMarket
                              ? "1.5px solid #f6ad55"
                              : "1.5px solid #e2e8f0",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "13px",
                            color: "#2d3748",
                            boxShadow: movingToAnotherMarket
                              ? "0 2px 8px rgba(237,137,54,0.18)"
                              : "none",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <input
                            id="movingToAnotherMarket"
                            name="movingToAnotherMarket"
                            type="checkbox"
                            checked={!!movingToAnotherMarket}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setMovingToAnotherMarket(checked);
                              if (!checked) setMovingMarketReason("");
                            }}
                            style={{
                              width: "18px",
                              height: "18px",
                              accentColor: "#dd6b20",
                              cursor: "pointer",
                            }}
                          />
                          <span>🚚 {t("Moving to another market")}</span>
                        </label>
                      </Col>
                      {movingToAnotherMarket && (
                        <Col lg="12">
                          <div
                            style={{
                              background: "linear-gradient(135deg,#fff7ed,#fff)",
                              border: "1.5px solid #fbd38d",
                              borderRadius: "10px",
                              padding: "12px 14px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                            }}
                          >
                            <label
                              htmlFor="movingMarketReason"
                              style={{
                                fontSize: "12.5px",
                                fontWeight: 700,
                                color: "#9c4221",
                                letterSpacing: "0.3px",
                                textTransform: "uppercase",
                                margin: 0,
                              }}
                            >
                              {t("Reason")} <span style={{ color: "#e53e3e" }}>*</span>
                            </label>
                            <textarea
                              id="movingMarketReason"
                              name="movingMarketReason"
                              value={movingMarketReason}
                              onChange={(e) => setMovingMarketReason(e.target.value)}
                              placeholder={t("Why is the remaining cocoon moving to another market?")}
                              rows={2}
                              required={movingToAnotherMarket}
                              style={{
                                width: "100%",
                                border: "1.5px solid #fbd38d",
                                borderRadius: "8px",
                                padding: "8px 12px",
                                fontSize: "13.5px",
                                color: "#2d3748",
                                background: "#ffffff",
                                resize: "vertical",
                                outline: "none",
                              }}
                            />
                            <div
                              style={{
                                fontSize: "11.5px",
                                color: "#9c4221",
                                fontWeight: 600,
                              }}
                            >
                              ℹ {t("Status will be saved as 'distributed' and remaining cocoon will be set to 0.")}
                            </div>
                          </div>
                        </Col>
                      )}
                      {isRemainingNegative && (
                        <Col lg="12">
                          <div
                            style={{
                              background: "#fff5f5",
                              border: "1.5px solid #feb2b2",
                              borderRadius: "8px",
                              padding: "8px 12px",
                              color: "#c53030",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            ⚠ {t("Distributed quantity cannot exceed Final Weighment. Please review the buyers list.")}
                          </div>
                        </Col>
                      )}
                      {purposeForRejection && hasRemaining && lotWeightAfterWeighmentVal > 0 && (
                        <Col lg="12">
                          <div
                            style={{
                              background:
                                remainingPercentage > rejectionPercentage
                                  ? "#fff5f5"
                                  : "#fffaf0",
                              border:
                                remainingPercentage > rejectionPercentage
                                  ? "1.5px solid #feb2b2"
                                  : "1.5px solid #fbd38d",
                              borderRadius: "8px",
                              padding: "8px 12px",
                              color:
                                remainingPercentage > rejectionPercentage
                                  ? "#c53030"
                                  : "#975a16",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            {remainingPercentage > rejectionPercentage ? (
                              <>
                                ⚠ {t("Remaining")} ({remainingPercentage}%) {t("exceeds threshold")} ({rejectionPercentage}%).
                                &nbsp;{t("Remaining quantity")} ({remainingQty} Kg) {t("will be recorded as rejection.")}
                              </>
                            ) : (
                              <>
                                ℹ {t("Remaining")} ({remainingPercentage}%) {t("is within threshold")} ({rejectionPercentage}%).
                                &nbsp;{t("No rejection quantity will be saved.")}
                              </>
                            )}
                          </div>
                        </Col>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
          <Row className="g-1 ">
            <Block className="mt-3">
              <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(30,103,168,0.10)", marginTop: "16px" }}>
                <div style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)", padding: "12px 24px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "18px" }}>🛒</span>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{t("Buyers List")}</span>
                </div>
                <Card.Body style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                    <button
                      type="button"
                      onClick={handleShowModal}
                      disabled={totalLotWeight >= farmerdetails.netWeight}
                      style={{
                        background: totalLotWeight >= farmerdetails.netWeight ? "#c8d6e5" : "linear-gradient(135deg,#1e67a8,#2d9cdb)",
                        border: "none", borderRadius: "9px", padding: "8px 18px",
                        fontWeight: 700, fontSize: "13px", color: "#fff",
                        cursor: totalLotWeight >= farmerdetails.netWeight ? "not-allowed" : "pointer",
                        boxShadow: totalLotWeight >= farmerdetails.netWeight ? "none" : "0 3px 10px rgba(30,103,168,0.30)",
                        display: "inline-flex", alignItems: "center", gap: "6px",
                      }}
                    >
                      ➕ {t("Add")}
                    </button>
                  </div>
                  {dataLotList && dataLotList.length > 0 && (
                    <div className="table-responsive mt-2" style={{ borderRadius: "10px", overflow: "hidden", border: "1.5px solid #e2e8f0" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                        <thead>
                          <tr style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)" }}>
                            {[
                              { label: t("Action"), align: "left" },
                              { label: t("Buyer Type"), align: "left" },
                              { label: t("License Number/Address/Grainage/Name"), align: "left" },
                              { label: t("Quantity of Cocoons(In Kgs)"), align: "right" },
                              { label: t("Rate per Kg"), align: "right" },
                              { label: t("Total Amount"), align: "right" },
                              { label: t("Invoice Number"), align: "left" },
                            ].map((h) => (
                              <th key={h.label} style={{ padding: "10px 14px", color: "#fff", fontWeight: 700, fontSize: "12px", letterSpacing: "0.04em", whiteSpace: "nowrap", border: "none", textAlign: h.align }}>{h.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {dataLotList.map((item, i) => (
                            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafd", borderBottom: "1px solid #e2e8f0" }}>
                              <td style={{ padding: "10px 14px" }}>
                                <button
                                  type="button"
                                  onClick={() => handleGetLotDetails(i)}
                                  disabled={!!item.lotGroupageId}
                                  style={{
                                    background: item.lotGroupageId ? "#e2e8f0" : "linear-gradient(135deg,#1e67a8,#2d9cdb)",
                                    border: "none", borderRadius: "7px", padding: "5px 14px",
                                    fontWeight: 600, fontSize: "12px", color: item.lotGroupageId ? "#a0aec0" : "#fff",
                                    cursor: item.lotGroupageId ? "not-allowed" : "pointer",
                                    boxShadow: item.lotGroupageId ? "none" : "0 2px 8px rgba(30,103,168,0.25)",
                                  }}
                                >
                                  ✏️ {t("Edit")}
                                </button>
                              </td>
                              <td style={{ padding: "10px 14px", color: "#2d3748", fontWeight: 500 }}>
                                <span style={{ background: "#ebf4ff", color: "#1e67a8", borderRadius: "6px", padding: "2px 10px", fontSize: "12px", fontWeight: 700 }}>{item.buyerType}</span>
                              </td>
                              <td style={{ padding: "10px 14px", color: "#4a5568" }}>{item.buyerName}</td>
                              <td style={{ padding: "10px 14px", color: "#2d3748", fontWeight: 600, textAlign: "right" }}>{item.lotWeight}</td>
                              <td style={{ padding: "10px 14px", color: "#2d3748", textAlign: "right" }}>{item.amount}</td>
                              <td style={{ padding: "10px 14px", color: "#276749", fontWeight: 700, textAlign: "right" }}>{item.soldAmount}</td>
                              <td style={{ padding: "10px 14px", color: item.invoiceNumber ? "#1e67a8" : "#a0aec0", fontWeight: item.invoiceNumber ? 600 : 400 }}>{item.invoiceNumber || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card.Body>
              </Card>

              </Block>
              </Row>
            

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "8px" }}>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  background: isSaving ? "#c8d6e5" : "linear-gradient(135deg,#1e67a8,#2d9cdb)",
                  border: "none", borderRadius: "10px", padding: "11px 32px",
                  fontWeight: 700, fontSize: "14px", color: "#fff",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  boxShadow: isSaving ? "none" : "0 4px 14px rgba(30,103,168,0.35)",
                  display: "flex", alignItems: "center", gap: "8px",
                  transition: "all 0.2s ease",
                }}
              >
                {isSaving ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> {t("Saving")}…</> : <>💾 {t("Save")}</>}
              </button>
              <button
                type="button"
                onClick={clear}
                style={{
                  background: "#f1f5f9", border: "1.5px solid #d0d9e8", borderRadius: "10px",
                  padding: "11px 28px", fontWeight: 600, fontSize: "14px", color: "#4a5568",
                  cursor: "pointer", transition: "all 0.2s ease",
                }}
              >
                {t("Cancel")}
              </button>
            </div>
          {/* </Row> */}
        {/* </Form>
        
        </Block> */}
      
      {/* </Row> */}
        </Form>
      </Block>  

       <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)", borderRadius: "12px 12px 0 0", border: "none", padding: "16px 24px" }}>
          <Modal.Title style={{ color: "#fff", fontWeight: 700, fontSize: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>➕</span>
            {t("Add Lot Distribution Details")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "24px 28px", background: "#f8fafd" }}>
        <Form noValidate validated={validatedLot} onSubmit={handleAddLotDetails}>
          <Row className="g-5 "> 
          <>    
                  <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Buyer Type")}<span className="text-danger">*</span>
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
                            <option value="">{t("Select Buyer Type")}</option>
                            <option value="RSP">{t("RSP")}</option>
                            <option value="NSSO">{t("NSSO")}</option>
                            <option value="Govt Grainage">{t("Govt Grainage")}</option>
                            <option value="Reeling">{t("Reeling")}</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          {t("Buyer Type is required")}
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
                    {data.buyerType === "Reeling" && (
                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("Purchase Mode")}<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="purchaseMode"
                                value={purchaseMode}
                                onChange={handlePurchaseModeChange}
                                required
                                isInvalid={purchaseMode === ""}
                              >
                                <option value="">{t("Select Purchase Mode")}</option>
                                <option value="Manual">{t("Manual")}</option>
                                <option value="Bid">{t("Bid")}</option>
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Purchase Mode is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                      )}

                      {/* Show Reeler dropdown only when Manual is selected */}
                      {data.buyerType === "Reeling" && purchaseMode === "Manual" && (
                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("Reeler")}<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <ReactSelect
                                options={reelerOptions}
                                placeholder={t("Select Reeler")}
                                isSearchable
                                menuPlacement="auto"
                                value={
                                  reelerOptions?.find(
                                    (opt) =>
                                      opt.value.startsWith(`${data.buyerId}_`)
                                  ) || null
                                }
                                onChange={handleManualReelerOption}
                              />
                              {!data.buyerId && (
                                <div className="invalid-feedback d-block">
                                  {t("Reeler is required")}
                                </div>
                              )}
                            </div>
                          </Form.Group>
                        </Col>
                      )}
                    </>
                    {data.buyerType === 'NSSO' && (
                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            {t("Address")}<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                           <ReactSelect
                              options={addressOptions}
                              placeholder={t("Select Address")}
                              isSearchable
                              menuPlacement="auto"
                              value={addressOptions?.find(
                                (opt) =>
                                  opt.value ===
                                  `${data.buyerId}_${data.address}_${data.externalUnitId}`
                              )}
                              onChange={(selectedOption) => {
                                if (!selectedOption) {
                                  setData((prev) => ({
                                    ...prev,
                                    buyerId: "",
                                    address: "",
                                    buyerName: "",
                                    externalUnitId: "",
                                  }));
                                  return;
                                }

                                const [chooseId, chooseAddress, chooseUnit] =
                                  selectedOption.value.split("_");

                                const updatedData = {
                                  ...data,
                                  buyerId: chooseId,
                                  address: chooseAddress,
                                  buyerName: chooseAddress,
                                  externalUnitId: chooseUnit,
                                };
                                setData(updatedData);
                                validateReelerBalance(updatedData);
                              }}
                            />

                            <Form.Control.Feedback type="invalid">
                              {t("Address is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    )}

                  {data.buyerType === 'Govt Grainage' && (
                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Grainage")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="buyerId"
                            value={`${data.buyerId}_${data.grainageMasterName}_${data.externalUnitId}`}
                            onChange={handleGrainageOption}
                            onBlur={handleGrainageOption} // Correctly set as function reference
                            required
                          >
                            <option value="">{t("Select Grainage")}</option>
                            {grainageListData && grainageListData.length ? (
                              grainageListData.map((list) => (
                                <option
                                  key={`${list.userMasterId}_${list.grainageMasterName}_${list.grainageMasterId}`} // Updated key pattern
                                  value={`${list.userMasterId}_${list.grainageMasterName}_${list.grainageMasterId}`}
                                >
                                  {list.grainageMasterName}
                                </option>
                              ))
                            ) : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("Grainage is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  )}


                  {data.buyerType === "RSP" && (
                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("License Number")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          {/* <Form.Select
                            name="buyerId"
                            value={`${data.buyerId}_${data.licenseNumber}_${data.externalUnitId}`}
                            onChange={handleExternalOption}
                            onBlur={handleExternalOption} // Correctly set as function reference
                            required
                            isInvalid={
                              data.buyerId === undefined ||
                              data.buyerId === "0"
                            }
                          >
                            <option value="">{t("Select License Number")}</option>
                            {externalListData.map((list) => (
                              <option
                                key={`${list.userMasterId}_${list.licenseNumber}_${list.externalUnitRegistrationId}`}
                                value={`${list.userMasterId}_${list.licenseNumber}_${list.externalUnitRegistrationId}`}
                              >
                                {list.licenseNumber}
                              </option>
                            ))}
                          </Form.Select> */}
                          <ReactSelect
                              options={addressOptions}
                              placeholder={t("Select Address")}
                              isSearchable
                              menuPlacement="auto"
                              value={addressOptions?.find(
                                (opt) =>
                                  opt.value ===
                                  `${data.buyerId}_${data.licenseNumber}_${data.externalUnitId}`
                              )}
                              onChange={(selectedOption) => {
                                if (!selectedOption) {
                                  setData((prev) => ({
                                    ...prev,
                                    buyerId: "",
                                    licenseNumber: "",
                                    buyerName: "",
                                    externalUnitId: "",
                                  }));
                                  return;
                                }

                                const [chooseId, chooseAddress, chooseUnit] =
                                  selectedOption.value.split("_");

                                const updatedData = {
                                  ...data,
                                  buyerId: chooseId,
                                  licenseNumber: chooseAddress,
                                  buyerName: chooseAddress,
                                  externalUnitId: chooseUnit,
                                };
                                setData(updatedData);
                                validateReelerBalance(updatedData);
                              }}
                            />
                          <Form.Control.Feedback type="invalid">
                            {t("License Number is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  )}


                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="approxWeightPerCrate">
                      {t("Quantity of Cocoons Allotted (In Kgs)")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lotWeight"
                          name="lotWeight"
                          value={data.lotWeight}
                          onChange={handleInputs}
                          type="number"
                          placeholder={t("Enter Quantity of Cocoons Allotted (In Kgs)")}
                          required
                          isInvalid={parseFloat(data.lotWeight) > remainingCocoonWeight}
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("Quantity of Cocoons Allotted (In Kgs) Should be less than Remaining Cocoon")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  {/* <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="approxWeightPerCrate">
                       No Of DFL
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="dflLotNumber"
                          name="dflLotNumber"
                          value={data.dflLotNumber}
                          onChange={handleInputs}
                          type="number"
                          placeholder="Enter No Of DFL"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        No Of DFL is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}

                  {/* <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="approxWeightPerCrate">
                       Average Yield
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="averageYield"
                          name="averageYield"
                          value={data.averageYield}
                          onChange={handleInputs}
                          type="number"
                          placeholder="Enter Average Yield"
                          required
                          readOnly
                        />
                        <Form.Control.Feedback type="invalid">
                        Average Yield is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}


                {/* {data.buyerType !== "Reeling" && (
          <> */}
            <Col lg="6">
              <Form.Group className="form-group mt-n4">
                <Form.Label htmlFor="amount">
                  {t("Price(In Rs.)")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Control
                    id="amount"
                    name="amount"
                    value={data.amount}
                    onChange={handleInputs}
                    type="number"
                    placeholder={t("Enter Price(In Rs.)")}
                    required
                    // readOnly
                    readOnly={requiredBasePrice} 
                  />
                  <Form.Control.Feedback type="invalid">
                    {t("Price(In Rs.) is required.")}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </Col>

            <Col lg="6">
              <Form.Group className="form-group mt-n4">
                <Form.Label htmlFor="soldAmount">
                  {t("Total Amount")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Control
                    id="soldAmount"
                    name="soldAmount"
                    value={data.soldAmount}
                    onChange={handleInputs}
                    type="number"
                    placeholder={t("Enter Total Amount")}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {t("Total Amount is required.")}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </Col>
          {/* </>
        )} */}

                <Col lg="12">
                <div className="d-flex gap g-2 justify-content-center">
                  <div className="gap-col">
                    {/* <Button variant="primary" onClick={handleAddFamilyMembers}> */}
                    <button
                      type="submit"
                      disabled={isAddDisabled || balanceError}
                      title={balanceError ? "Buyer has insufficient balance" : ""}
                      style={{
                        background: (isAddDisabled || balanceError) ? "#c8d6e5" : "linear-gradient(135deg,#1e67a8,#2d9cdb)",
                        border: "none", borderRadius: "10px", padding: "10px 28px",
                        fontWeight: 700, fontSize: "14px", color: "#fff",
                        cursor: (isAddDisabled || balanceError) ? "not-allowed" : "pointer",
                        boxShadow: (isAddDisabled || balanceError) ? "none" : "0 4px 14px rgba(30,103,168,0.35)",
                      }}
                    >
                      ➕ {t("Add")}
                    </button>
                  </div>
                  <div className="gap-col">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      style={{
                        background: "#f1f5f9", border: "1.5px solid #d0d9e8", borderRadius: "10px",
                        padding: "10px 24px", fontWeight: 600, fontSize: "14px", color: "#4a5568", cursor: "pointer",
                      }}
                    >
                      {t("Cancel")}
                    </button>
                  </div>
                </div>
                {balanceError && (
                  <div style={{ textAlign: "center", marginTop: "8px" }}>
                    <small style={{ color: "#c53030", fontWeight: 600, fontSize: "13px" }}>
                      ⚠ Add is disabled due to insufficient balance.
                    </small>
                  </div>
                )}
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal1} onHide={handleCloseModal1} size="xl">
        <Modal.Header closeButton style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)", borderRadius: "12px 12px 0 0", border: "none", padding: "16px 24px" }}>
          <Modal.Title style={{ color: "#fff", fontWeight: 700, fontSize: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✏️</span>
            {t("Edit Lot Distribution Details")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "24px 28px", background: "#f8fafd" }}>
        <Form
            noValidate
            validated={validatedEdit}
            onSubmit={(e) => handleUpdateLotDetails(e, lotId, data)}
          >
          <Row className="g-5 ">     
          <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Buyer Type")}<span className="text-danger">*</span>
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
                            <option value="">{t("Select Buyer Type")}</option>
                            <option value="RSP">{t("RSP")}</option>
                            <option value="NSSO">{t("NSSO")}</option>
                            <option value="Govt Grainage">{t("Govt Grainage")}</option>
                            <option value="Reeling">{t("Reeling")}</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          {t("Buyer Type is required")}
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
                    {data.buyerType === 'NSSO' && (
                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            {t("Address")}<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            {/* <Form.Select
                              name="buyerId"
                              value={`${data.buyerId}_${data.address}_${data.externalUnitId}`}
                              onChange={handleReelerOption}
                              onBlur={handleReelerOption} // Correctly set as function reference
                              required
                              isInvalid={
                                data.buyerId === undefined ||
                                data.buyerId === "0"
                              }
                            >
                              <option value="">{t("Select Address")}</option>
                              {externalListData.map((list) => (
                                <option
                                  key={`${list.userMasterId}_${list.address}_${list.externalUnitRegistrationId}`}
                                  value={`${list.userMasterId}_${list.address}_${list.externalUnitRegistrationId}`}
                                >
                                  {list.address}
                                </option>
                              ))}
                            </Form.Select> */}
                             <ReactSelect
                              options={addressOptions}
                              placeholder={t("Select Address")}
                              isSearchable
                              menuPlacement="auto"
                              value={addressOptions?.find(
                                (opt) =>
                                  opt.value ===
                                  `${data.buyerId}_${data.address}_${data.externalUnitId}`
                              )}
                              onChange={(selectedOption) => {
                                if (!selectedOption) {
                                  setData((prev) => ({
                                    ...prev,
                                    buyerId: "",
                                    address: "",
                                    buyerName: "",
                                    externalUnitId: "",
                                  }));
                                  return;
                                }

                                const [chooseId, chooseAddress, chooseUnit] =
                                  selectedOption.value.split("_");

                                const updatedData = {
                                  ...data,
                                  buyerId: chooseId,
                                  address: chooseAddress,
                                  buyerName: chooseAddress,
                                  externalUnitId: chooseUnit,
                                };
                                setData(updatedData);
                                validateReelerBalance(updatedData);
                              }}
                            />
                            <Form.Control.Feedback type="invalid">
                              {t("Address is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    )}

                  {data.buyerType === 'Govt Grainage' && (
                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Grainage")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="buyerId"
                            value={`${data.buyerId}_${data.grainageMasterName}_${data.externalUnitId}`}
                            onChange={handleGrainageOption}
                            onBlur={handleGrainageOption} // Correctly set as function reference
                            required
                          >
                            <option value="">{t("Select Grainage")}</option>
                            {grainageListData && grainageListData.length ? (
                              grainageListData.map((list) => (
                                <option
                                  key={`${list.userMasterId}_${list.grainageMasterName}_${list.grainageMasterId}`} // Updated key pattern
                                  value={`${list.userMasterId}_${list.grainageMasterName}_${list.grainageMasterId}`}
                                >
                                  {list.grainageMasterName}
                                </option>
                              ))
                            ) : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("Grainage is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  )}


                  {data.buyerType === "RSP" && (
                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("License Number")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          {/* <Form.Select
                            name="buyerId"
                            value={`${data.buyerId}_${data.licenseNumber}_${data.externalUnitId}`}
                            onChange={handleExternalOption}
                            onBlur={handleExternalOption} // Correctly set as function reference
                            required
                            isInvalid={
                              data.buyerId === undefined ||
                              data.buyerId === "0"
                            }
                          >
                            <option value="">{t("Select License Number")}</option>
                            {externalListData.map((list) => (
                              <option
                                key={`${list.userMasterId}_${list.licenseNumber}_${list.externalUnitRegistrationId}`}
                                value={`${list.userMasterId}_${list.licenseNumber}_${list.externalUnitRegistrationId}`}
                              >
                                {list.licenseNumber}
                              </option>
                            ))}
                          </Form.Select> */}
                           <ReactSelect
                              options={addressOptions}
                              placeholder={t("Select Address")}
                              isSearchable
                              menuPlacement="auto"
                              value={addressOptions?.find(
                                (opt) =>
                                  opt.value ===
                                  `${data.buyerId}_${data.licenseNumber}_${data.externalUnitId}`
                              )}
                              onChange={(selectedOption) => {
                                if (!selectedOption) {
                                  setData((prev) => ({
                                    ...prev,
                                    buyerId: "",
                                    licenseNumber: "",
                                    buyerName: "",
                                    externalUnitId: "",
                                  }));
                                  return;
                                }

                                const [chooseId, chooseAddress, chooseUnit] =
                                  selectedOption.value.split("_");

                                const updatedData = {
                                  ...data,
                                  buyerId: chooseId,
                                  licenseNumber: chooseAddress,
                                  buyerName: chooseAddress,
                                  externalUnitId: chooseUnit,
                                };
                                setData(updatedData);
                                validateReelerBalance(updatedData);
                              }}
                            />
                          <Form.Control.Feedback type="invalid">
                            {t("License Number is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  )}


                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="approxWeightPerCrate">
                      {t("Quantity of Cocoons Allotted (In Kgs)")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lotWeight"
                          name="lotWeight"
                          value={data.lotWeight}
                          onChange={handleInputs}
                          type="number"
                          placeholder={t("Enter Quantity of Cocoons Allotted (In Kgs)")}
                          required
                          isInvalid={parseFloat(data.lotWeight) > editRemainingCocoonWeight}
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("Quantity of Cocoons Allotted (In Kgs) Should be less than Remaining Cocoon")}
                        </Form.Control.Feedback>

                      </div>
                    </Form.Group>
                  </Col>


                  {/* <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="approxWeightPerCrate">
                       No Of DFL
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="dflLotNumber"
                          name="dflLotNumber"
                          value={data.dflLotNumber}
                          onChange={handleInputs}
                          type="number"
                          placeholder="Enter No Of DFL"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        No Of DFL is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}

                  {/* <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="approxWeightPerCrate">
                       Average Yield
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="averageYield"
                          name="averageYield"
                          value={data.averageYield}
                          onChange={handleInputs}
                          type="number"
                          placeholder="Enter Average Yield"
                          required
                          readOnly
                        />
                        <Form.Control.Feedback type="invalid">
                        Average Yield is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}

          {/* {data.buyerType !== "Reeling" && (
          <> */}
            <Col lg="6">
              <Form.Group className="form-group mt-n4">
                <Form.Label htmlFor="amount">
                  {t("Price(In Rs.)")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Control
                    id="amount"
                    name="amount"
                    value={data.amount}
                    onChange={handleInputs}
                    type="number"
                    placeholder={t("Enter Price(In Rs.)")}
                    required
                    // readOnly
                    readOnly={requiredBasePrice}
                  />
                  <Form.Control.Feedback type="invalid">
                    {t("Price(In Rs.) is required.")}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </Col>

            <Col lg="6">
              <Form.Group className="form-group mt-n4">
                <Form.Label htmlFor="soldAmount">
                  {t("Total Amount")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Control
                    id="soldAmount"
                    name="soldAmount"
                    value={data.soldAmount}
                    onChange={handleInputs}
                    type="number"
                    placeholder={t("Enter Total Amount")}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {t("Total Amount is required.")}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </Col>
          {/* </>
        )} */}

                <Col lg="12">
                <div className="d-flex gap g-2 justify-content-center">
                  <div className="gap-col">
                    {/* <Button variant="primary" onClick={handleAddFamilyMembers}> */}
                    <button
                      type="submit"
                      disabled={isEditDisabled}
                      style={{
                        background: isEditDisabled ? "#c8d6e5" : "linear-gradient(135deg,#1e67a8,#2d9cdb)",
                        border: "none", borderRadius: "10px", padding: "10px 28px",
                        fontWeight: 700, fontSize: "14px", color: "#fff",
                        cursor: isEditDisabled ? "not-allowed" : "pointer",
                        boxShadow: isEditDisabled ? "none" : "0 4px 14px rgba(30,103,168,0.35)",
                      }}
                    >
                      ✏️ {t("Update")}
                    </button>
                  </div>
                  <div className="gap-col">
                    <button
                      type="button"
                      onClick={handleCloseModal1}
                      style={{
                        background: "#f1f5f9", border: "1.5px solid #d0d9e8", borderRadius: "10px",
                        padding: "10px 24px", fontWeight: 600, fontSize: "14px", color: "#4a5568", cursor: "pointer",
                      }}
                    >
                      {t("Cancel")}
                    </button>
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
