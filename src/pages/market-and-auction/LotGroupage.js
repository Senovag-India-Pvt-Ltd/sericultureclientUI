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
  })
 }

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
  // const handleShowModal = () => setShowModal(true);
  const handleShowModal = () => {
    // Use the stored price directly when opening the modal
    if (price) {
      setData((prevData) => ({
        ...prevData,
        amount: price, // Automatically set the stored price
      }));
      // Open the modal to add new details
      setShowModal(true);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Price not available. Please perform a search first.",
      });
    }
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
      const buyerName = data.buyerType === "RSP" ? data.licenseNumber : data.address;
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

  // const handleDeleteLotDetails = (i) => {
  //   setDataLotList((prev) => {
  //     const newArray = prev.filter((item, place) => place !== i);
  //     return newArray;
  //   });
  // };
  // Handle deleting a lot
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

  // const handleUpdateLotDetails = (e, i, changes) => {
  //     setDataLotList((prev) =>
  //       prev.map((item, ix) => {
  //         if (ix === i) {
  //           return { ...item, ...changes };
  //         }
  //         return item;
  //       })
  //     ); const form = e.currentTarget;
  //     if (form.checkValidity() === false) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       setValidatedEdit(true);
  //     } else {
  //       e.preventDefault();
  //     setShowModal1(false);
  //     setValidatedEdit(false);
  //     setData({
  //       buyerType: "RSP",
  //       buyerId: "",
  //       lotWeight: "",
  //       amount: "",
  //       marketFee: "",
  //       soldAmount: "",
  //       allottedLotId: "",
  //       auctionDate: "",
  //       lotParentLevel: "",
  //     });
  //   }
  // };

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
    });
  }
};
  let name, value;
  // const handleInputs = (e) => {
  //   name = e.target.name;
  //   value = e.target.value;
  //   // setData({ ...data, [name]: value });
  //   if(name ==='allottedLotId'){
  //     setAllottedLotId(value);
  //   }else{
  //     setData({ ...data, [name]: value });
  //   }
  // };
  // const handleInputs = (e) => {
  //   const { name, value } = e.target;
  
  //   // Update state for lotWeight and amount
  //   const newData = { ...data, [name]: value };
  
  //   // Calculate total amount if both lotWeight and amount are present
  //   if (newData.lotWeight && newData.amount) {
  //     // Calculate total and fix to 2 decimal points, then convert to an integer
  //     newData.soldAmount = Math.floor(parseFloat(newData.lotWeight) * parseFloat(newData.amount)); 
  //   } else {
  //     newData.soldAmount = ''; // Clear soldAmount if inputs are missing
  //   }
  

  //   // Prevent editing 'amount' if it's already fetched
  // if (name === 'amount' && data.amount) {
  //   return; // Prevent updates to the price field
  // }
  
  //   // Set the new state
  //   if (name === 'allottedLotId') {
  //     setAllottedLotId(value);
  //   } else {
  //     setData(newData);
  //   }
  // };

  const handleInputs = (e) => {
    const { name, value } = e.target;
  
    // Update state for lotWeight and amount
    setData((prevData) => {
      const newData = { ...prevData, [name]: value };
  
      // Calculate soldAmount if both lotWeight and amount are present
      if (newData.lotWeight && newData.amount) {
        // Calculate total and fix to 2 decimal points, then convert to an integer
        newData.soldAmount = Math.floor(parseFloat(newData.lotWeight) * parseFloat(newData.amount));
      } else {
        newData.soldAmount = ''; // Clear soldAmount if inputs are missing
      }
  
      // Prevent editing 'amount' if it's already fetched
      if (name === 'amount' && prevData.amount) {
        return prevData; // Return the previous state to prevent updates to the price field
      }
  
      // Optionally, you can include the averageYield calculation here if needed
      // if (newData.lotWeight && newData.dflLotNumber) {
      //   newData.averageYield = (parseFloat(newData.lotWeight) / parseFloat(newData.dflLotNumber)).toFixed(2);
      // } else {
      //   newData.averageYield = ''; // Clear averageYield if inputs are missing
      // }
  
      return newData; // Return the new data state
    });
  
    // Set the new state for allottedLotId
    if (name === 'allottedLotId') {
      setAllottedLotId(value);
    }
  };
   
  
//   const handleInputs = (e) => {
//   const { name, value } = e.target;

//   if (name === 'allottedLotId') {
//     setAllottedLotId(value);
//   } else {
//     const updatedData = { ...data, [name]: value };

//     // If lotWeight or amount is updated, calculate soldAmount
//     if (name === 'lotWeight' || name === 'amount') {
//       const lotWeight = parseFloat(updatedData.lotWeight) || 0;
//       const amount = parseFloat(updatedData.amount) || 0;
//       updatedData.soldAmount = (lotWeight * amount).toFixed(3);
//     }

//     setData(updatedData);
//   }
// };



   //  console.log("data",data.photoPath);
   const [searchValidated, setSearchValidated] = useState(false);

  //  const search = (event) => {
  //   setDataLotList([]);
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setSearchValidated(true);
  //   } else {
  //     event.preventDefault();
     
  //           api
  //             .post(
  //               baseURLMarket +
  //                 `lotGroupage/getUpdateLotDistributeByLotIdForSeedMarket`,
  //               { allottedLotId:allottedLotId,auctionDate: auctionDate, marketId: localStorage.getItem("marketId"),
  //                godownId: localStorage.getItem("godownId"),}
  //               // {
  //               //   headers: _header,
  //               // }
  //             )
  //             .then((response) => {
  //               const lotGroupageId = response.data.content[0].lotGroupageId;
        
  //               if (lotGroupageId) {
  //                 // navigate(`/seriui/lot-groupage-edit/${lotGroupageId}`);
  //                 setFarmerDetails((prev) => ({
  //                   ...prev,
  //                   farmerFirstName: response.data.content[0].farmerFirstName,
  //                   farmerMiddleName: response.data.content[0].farmerMiddleName,
  //                   farmerFruitsId: response.data.content[0].farmerFruitsId
  //                 }));
  //                 setDataLotList(response.data.content);
  //                 setShowFarmerDetails(true);
  //               } else {
  //               //  const farmerDetails = response.data.content;
  //               setFarmerDetails((prev) => ({
  //                 ...prev,
  //                 farmerFirstName: response.data.content[0].farmerFirstName,
  //                 farmerMiddleName: response.data.content[0].farmerMiddleName,
  //                 farmerFruitsId: response.data.content[0].farmerFruitsId
  //               }));
  //               setShowFarmerDetails(true);
  //                }
                 
  //                 // console.log(modified);

                 
  //             })
  //             .catch((err) => {
  //               console.error("Error fetching farmer details:", err);
  //               if (
  //                 err.response &&
  //                 err.response.data &&
  //                 err.response.data.validationErrors
  //               ) {
  //                 if (Object.keys(err.response.data.validationErrors).length > 0) {
  //                   searchError(err.response.data.validationErrors);
  //                 }
  //               } else {
  //                 Swal.fire({
  //                   icon: "warning",
  //                   title: "Details Not Found for This Lot and Auction Date",
  //                 });
  //               }
  //               setFarmerDetails({});
  //               setLoading(false);
  //             });
  //         }
  // };

  const [lotParentLevel, setLotParentLevel] = useState(null);
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
        setLotParentLevel(newLotParentLevel);
        setCalculatedAverageYield(fetchedAverageYield);
        setNoOfDFLs(fetchedNoOfDFLs);
        setPrice(fetchedPrice); // Set the new lotParentLeve
        setData((prevData) => ({
          ...prevData,
          amount: fetchedPrice,  // Automatically set price
        }));

  
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
            }));
            // setLotParentLevel(response.data.content[0].lotParentLevel,);
           // Automatically set the fetched price in the data state
            
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
              icon: "warning",
              title: "Details Not Found for This Lot and Auction Date",
            });
          }
          setFarmerDetails({});
          setLoading(false);
        });
    }
  };

  // const search = (event) => {
  //   setDataLotList([]);
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setSearchValidated(true);
  //   } else {
  //     event.preventDefault();
  //     const formattedAuctionDate = formatAuctionDate(auctionDate);
  //     api
  //       .post(
  //         baseURLMarket +
  //           `lotGroupage/getUpdateLotDistributeByLotIdForSeedMarket`,
  //         {
  //           allottedLotId: allottedLotId,
  //           auctionDate: formattedAuctionDate,
  //           marketId: localStorage.getItem("marketId"),
  //           godownId: localStorage.getItem("godownId"),
  //         }
  //       )
  //       .then((response) => {
  //         // const lotGroupageId = response.data.content[0].lotGroupageId;
  
  //         // // Store lotParentLevel in state
  //         // const currentFarmerDetails = {
  //         //   farmerFirstName: response.data.content[0].farmerFirstName,
  //         //   lotParentLevel: response.data.content[0].lotParentLevel,
  //         //   farmerFruitsId: response.data.content[0].farmerFruitsId,
  //         //   price: response.data.content.price,
  //         //   netWeight: response.data.content.netWeight,
  //         //   noOfDFLs: response.data.content.noOfDFLs,
  //         //   initialWeighment: response.data.content.initialWeighment,
  //         // };
  //         const currentContent = response.data.content[0];
  //         const lotGroupageId = currentContent.lotGroupageId;
    
  //         // Prepare farmer details while checking for undefined values
  //         const currentFarmerDetails = {
  //           farmerFirstName: currentContent.farmerFirstName,
  //           lotParentLevel: currentContent.lotParentLevel,
  //           farmerFruitsId: currentContent.farmerFruitsId,
  //           price: currentContent.price,
  //           netWeight: currentContent.netWeight,
  //           noOfDFLs: currentContent.noOfDFLs,
  //           initialWeighment: currentContent.initialWeighment,
  //         };
          
  //         setLotParentLevel(currentFarmerDetails.lotParentLevel); // Save lotParentLevel
  //         setFarmerDetails((prev) => ({ ...prev, ...currentFarmerDetails }));
  //         setDataLotList(response.data.content);
  //         setShowFarmerDetails(true);
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching farmer details:", err);
  //         if (err.response && err.response.data && err.response.data.validationErrors) {
  //           if (Object.keys(err.response.data.validationErrors).length > 0) {
  //             searchError(err.response.data.validationErrors);
  //           }
  //         } else {
  //           Swal.fire({
  //             icon: "warning",
  //             title: "Details Not Found for This Lot and Auction Date",
  //           });
  //         }
  //         setFarmerDetails({});
  //         setLoading(false);
  //       });
  //   }
  // };

  const [totalLotWeight, setTotalLotWeight] = useState(0);
  // const remainingCocoonWeight = farmerdetails.netWeight - (data.lotWeight || 0);
  // const remainingCocoonWeight = farmerdetails.netWeight - totalLotWeight;
  // Conditionally update remainingCocoonWeight based on totalLotWeight
const remainingCocoonWeight = totalLotWeight > 0 
? farmerdetails.netWeight - totalLotWeight 
: farmerdetails.netWeight;

// Disable Add button if lotWeight exceeds remaining cocoon weight
const isAddDisabled = parseFloat(data.lotWeight) > remainingCocoonWeight;

 
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

      // Format the auction date
    const formattedAuctionDate = formatAuctionDate(auctionDate); 
  
      // Check if there is any lotGroupageId in the dataLotList
      const hasLotGroupageId = dataLotList.some(item => item.lotGroupageId);
  
      if (hasLotGroupageId) {
        // If lotGroupageId is present, prepare the update request
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
            // dflLotNumber:item.dflLotNumber,
            invoiceNumber:item.invoiceNumber,
            //  averageYield: item.averageYield,
            allottedLotId: allottedLotId,
            // auctionDate: auctionDate,
            auctionDate: formattedAuctionDate,
            lotParentLevel: lotParentLevel,
            averageYield: calculatedAverageYield,
            dflLotNumber: noOfDFLs,
            remainingCocoonWeight: remainingCocoonWeight,
          }))
        };
  
        api.post(baseURLMarket + 'lotGroupage/updateLotGroupage', requestData)
          .then(response => {
            const updatedList = response.data.content;  // Fetch updated data

            // Generate invoice details from the updated response data
            const invoiceDetails = updatedList
              .map(item => `${item.buyerType} = ${item.invoiceNumber ? item.invoiceNumber : 'No Invoice Available'}`)
              .join("<br>");
  
            // Show the success message
            Swal.fire({
              icon: 'success',
              title: 'Updated successfully',
              html: `Invoice Details:<br>${invoiceDetails}`,  // Display invoice details in SweetAlert
            });
  
            clear();
            setValidated(false);
        })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Update failed',
              text: 'There was an error updating the lot groupage details.'
            });
          });
      } else {
        // If no lotGroupageId is present, prepare the save request
        // const sendPost = {
        //   lotGroupageRequests: dataLotList,
        // };
        const sendPost = {
          lotGroupageRequests: dataLotList.map(item => ({
            ...item,
            lotParentLevel: lotParentLevel,
            averageYield: calculatedAverageYield,
            dflLotNumber: noOfDFLs, 
            remainingCocoonWeight: remainingCocoonWeight,  // Include lotParentLevel
            auctionDate: formatAuctionDate(item.auctionDate)  // Format and include auctionDate
          })),
        };
  
        api
          .post(baseURLMarket + 'lotGroupage/saveLotGroupage', sendPost)
          .then((response) => {
            if (response.data.content.error) {
              saveError(response.data.content.error_description);
            } else {
              saveSuccess(response.data.content);
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
              });
              clear();
              setValidated(false);
            }
          })
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
          });
      }
  
      setValidated(true);
    }
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
    const [chooseId, chooseName] = value.split("_");
    setData({
      ...data,
      buyerId: chooseId,
      address: chooseName,
      buyerName: chooseName,
    });
  };

  // District
  const handleExternalOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setData({
      ...data,
      buyerId: chooseId,
      licenseNumber: chooseName,
      buyerName: chooseName,
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
        auctionDate: "",
        dflLotNumber: "",
        averageYield: "",
    });
  setFarmerDetails({
    farmerFirstName:"",
    farmerMiddleName:"",
    farmerFruitsId:""
  });
  setAuctionDate("");
setAllottedLotId("");
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
    const invoiceDetails = messages
      .map((item) => `${item.buyerType} = ${item.invoiceNumber}`)
      .join("<br>");
  
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      html: `Invoice Details:<br>${invoiceDetails}`, // Use 'html' instead of 'text'
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
          {/* <Row className="g-3 "> */}
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        Bidding Slip Lot NO.<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={3}>
                        <Form.Control
                          id="allotedLotId"
                          name="allottedLotId"
                          value={allottedLotId}
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
                            selected={auctionDate}
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
                    <Card.Header style={styles.cardHeader}>Farmer Details</Card.Header>
                    <Card.Body style={styles.cardBody}>
                      <Row className="g-gs">
                        <Col lg="12">
                          <table style={styles.table} className="table small table-bordered">
                            <tbody>
                              <tr style={styles.tableRow}>
                                <td style={styles.ctstyle}>Fruits Id:</td>
                                <td style={styles.cell}>{farmerdetails.farmerFruitsId}</td>
                                <td style={styles.ctstyle}>Farmer Name:</td>
                                <td style={styles.cell}>{farmerdetails.farmerFirstName}</td>
                                <td style={styles.ctstyle}>Bidding Slip Issued Date:</td>
                                <td style={styles.cell}>{farmerdetails.marketAuctionDate}</td>
                              </tr>
                              <tr style={styles.tableRow}>
                                <td style={styles.ctstyle}>Lot No:</td>
                                <td style={styles.cell}>{farmerdetails.lotParentLevel}</td>
                                <td style={styles.ctstyle}>No OF DFLs:</td>
                                <td style={styles.cell}>{farmerdetails.noOfDFLs}</td>
                                <td style={styles.ctstyle}>Price:</td>
                                <td style={styles.cell}>{farmerdetails.price}</td>
                              </tr>
                              <tr style={styles.tableRow}>
                                <td style={styles.ctstyle}>Initial Weighment:</td>
                                <td style={styles.cell}>{farmerdetails.initialWeighment}</td>
                                <td style={styles.ctstyle}>Final Weighment in Kgs:</td>
                                <td style={styles.cell}>{farmerdetails.lotWeightAfterWeighment}</td>
                                <td style={styles.ctstyle}>Average Yield:</td>
                                <td style={styles.cell}>{farmerdetails.calculatedAverageYield}</td>
                              </tr>
                              <tr style={styles.tableRow}>
                              <td style={styles.ctstyle}>Sold Cocoon in Kgs:</td>
                                <td style={styles.cell}>{farmerdetails.soldCocoonInKgs}</td>
                                <td style={styles.ctstyle}>Remaining Cocoon in Kgs:</td>
                                <td style={styles.cell}>{remainingCocoonWeight}</td>
                                <td style={styles.ctstyle}>Remaining Cocoon in Store:</td>
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
                              {/* <Button
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
                              </Button> */}
                              <Button
                                className="d-md-none"
                                size="md"
                                variant="primary"
                                onClick={handleShowModal}
                                disabled={totalLotWeight >= farmerdetails.netWeight}
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
                                disabled={totalLotWeight >= farmerdetails.netWeight}
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
                                  <th>License Number/Address</th>
                                  <th>Quantity of Cocoons(In Kgs)</th>
                                  {/* <th>No Of DFL</th>
                                  <th>Average Yield</th> */}
                                  <th>Price(In Rs.)</th>
                                  <th>Total Amount</th>
                                  <th>Invoice Number</th>
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
                                          disabled={!!item.lotGroupageId}
                                        >
                                          Edit
                                        </Button>
                                        {/* <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() =>
                                            handleDeleteLotDetails(i)
                                          }
                                          // onClick={handleShowModal2}
                                          className="ms-2"
                                        >
                                          Delete
                                        </Button> */}
                                      </div>
                                    </td>
                                    <td>{item.buyerType}</td>
                                     {/* <td>
                                    {item.buyerType === 'Reeler' ? (
                                      item.reelerName
                                    ) : item.buyerType === 'ExternalStakeHolders' ? (
                                      item.name
                                    ) : (
                                      item.buyerId
                                    )}
                                  </td> */}
                                  <td>{item.buyerName}</td>
                                    <td>{item.lotWeight}</td>
                                    {/* <td>{item.dflLotNumber}</td> */}
                                    {/* <td>{item.marketFee}</td> */}
                                    {/* <td>{item.averageYield}</td> */}
                                    <td>{item.amount}</td>
                                    <td>{item.soldAmount}</td>
                                    <td>{item.invoiceNumber}</td>
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
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    Store
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
                            <option value="">Select Buyer Type</option>
                            <option value="RSP">RSP</option>
                            <option value="NSSO">NSSO</option>
                            <option value="Govt Grainage">Govt Grainage</option>
                            <option value="Reeling">Reeling</option>
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
                    <>
                    {(data.buyerType === 'Govt Grainage' || data.buyerType === 'NSSO') && (
                          <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                Address<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="buyerId"
                                  value={`${data.buyerId}_${data.address}`}
                                  onChange={handleReelerOption}
                                  onBlur={() => handleReelerOption} // Make sure this is correctly set
                                  required
                                  isInvalid={
                                    data.buyerId === undefined ||
                                    data.buyerId === "0"
                                  }
                                >
                                  <option value="">Select Address</option>
                                  {externalListData.map((list) => (
                                    <option
                                      key={`${list.externalUnitRegistrationId}_${list.address}`}
                                      value={`${list.externalUnitRegistrationId}_${list.address}`}
                                    >
                                      {list.address}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Address is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                        )}
                        {/* Ensure that there's a closing tag for the parent component here if needed */}
                      </>
                    {/* ); */}

                  {data.buyerType === "RSP" ? (
                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          License Number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="buyerId"
                            value={`${data.buyerId}_${data.licenseNumber}`}
                            onChange={handleExternalOption}
                            onBlur={() => handleExternalOption}
                            required
                            isInvalid={
                              data.buyerId === undefined ||
                              data.buyerId === "0"
                            }
                          >
                            <option value="">Select License Number</option>
                            {externalListData.map((list) => (
                              <option
                                key={`${list.externalUnitRegistrationId}_${list.licenseNumber}`}
                                value={`${list.externalUnitRegistrationId}_${list.licenseNumber}`}
                              >
                                {list.licenseNumber}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            License Number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  ) : (
                    ""
                  )}

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="approxWeightPerCrate">
                      Quantity of Cocoons Allotted (In Kgs)
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lotWeight"
                          name="lotWeight"
                          value={data.lotWeight}
                          onChange={handleInputs}
                          type="number"
                          placeholder="Enter Quantity of Cocoons Allotted (In Kgs)"
                          required
                          isInvalid={parseFloat(data.lotWeight) > remainingCocoonWeight}
                        />
                        <Form.Control.Feedback type="invalid">
                        Quantity of Cocoons Allotted (In Kgs) Should be less than Remaining Cocoon
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


                  {data.buyerType !== "Reeling" && (
          <>
            <Col lg="6">
              <Form.Group className="form-group mt-n4">
                <Form.Label htmlFor="amount">
                  Price(In Rs.)
                  <span className="text-danger">*</span>
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Control
                    id="amount"
                    name="amount"
                    value={data.amount}
                    onChange={handleInputs}
                    type="number"
                    placeholder="Enter Price(In Rs.)"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Price(In Rs.) is required.
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </Col>

            <Col lg="6">
              <Form.Group className="form-group mt-n4">
                <Form.Label htmlFor="soldAmount">
                  Total Amount
                  <span className="text-danger">*</span>
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Control
                    id="soldAmount"
                    name="soldAmount"
                    value={data.soldAmount}
                    onChange={handleInputs}
                    type="number"
                    placeholder="Enter Total Amount"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Total Amount is required.
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </Col>
          </>
        )}

                <Col lg="12">
                <div className="d-flex gap g-2 justify-content-center">
                  <div className="gap-col">
                    {/* <Button variant="primary" onClick={handleAddFamilyMembers}> */}
                    <Button type="submit" variant="primary"
                    // disabled={totalLotWeight >= farmerdetails.netWeight}
                    disabled={isAddDisabled}
                    >
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
                            <option value="">Select Buyer Type</option>
                            <option value="RSP">RSP</option>
                            <option value="NSSO">NSSO</option>
                            <option value="Govt Grainage">Govt Grainage</option>
                            <option value="Reeling">Reeling</option>
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
                    <>
                    {(data.buyerType === 'Govt Grainage' || data.buyerType === 'NSSO') && (
                          <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                Address<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="buyerId"
                                  value={`${data.buyerId}_${data.address}`}
                                  onChange={handleReelerOption}
                                  onBlur={() => handleReelerOption} // Make sure this is correctly set
                                  required
                                  isInvalid={
                                    data.buyerId === undefined ||
                                    data.buyerId === "0"
                                  }
                                >
                                  <option value="">Select Address</option>
                                  {externalListData.map((list) => (
                                    <option
                                      key={`${list.externalUnitRegistrationId}_${list.address}`}
                                      value={`${list.externalUnitRegistrationId}_${list.address}`}
                                    >
                                      {list.address}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Address is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                        )}
                        {/* Ensure that there's a closing tag for the parent component here if needed */}
                      </>
                    {/* ); */}

                  {data.buyerType === "RSP" ? (
                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          License Number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="buyerId"
                            value={`${data.buyerId}_${data.licenseNumber}`}
                            onChange={handleExternalOption}
                            onBlur={() => handleExternalOption}
                            required
                            isInvalid={
                              data.buyerId === undefined ||
                              data.buyerId === "0"
                            }
                          >
                            <option value="">Select License Number</option>
                            {externalListData.map((list) => (
                              <option
                                key={`${list.externalUnitRegistrationId}_${list.licenseNumber}`}
                                value={`${list.externalUnitRegistrationId}_${list.licenseNumber}`}
                              >
                                {list.licenseNumber}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            License Number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  ) : (
                    ""
                  )}

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="approxWeightPerCrate">
                      Quantity of Cocoons Allotted (In Kgs)
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lotWeight"
                          name="lotWeight"
                          value={data.lotWeight}
                          onChange={handleInputs}
                          type="number"
                          placeholder="Enter Quantity of Cocoons Allotted (In Kgs)"
                          required
                          isInvalid={parseFloat(data.lotWeight) > remainingCocoonWeight}
                        />
                        <Form.Control.Feedback type="invalid">
                        Quantity of Cocoons Allotted (In Kgs) Should be less than Remaining Cocoon
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

          {data.buyerType !== "Reeling" && (
          <>
            <Col lg="6">
              <Form.Group className="form-group mt-n4">
                <Form.Label htmlFor="amount">
                  Price(In Rs.)
                  <span className="text-danger">*</span>
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Control
                    id="amount"
                    name="amount"
                    value={data.amount}
                    onChange={handleInputs}
                    type="number"
                    placeholder="Enter Price(In Rs.)"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Price(In Rs.) is required.
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </Col>

            <Col lg="6">
              <Form.Group className="form-group mt-n4">
                <Form.Label htmlFor="soldAmount">
                  Total Amount
                  <span className="text-danger">*</span>
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Control
                    id="soldAmount"
                    name="soldAmount"
                    value={data.soldAmount}
                    onChange={handleInputs}
                    type="number"
                    placeholder="Enter Total Amount"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Total Amount is required.
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </Col>
          </>
        )}

                <Col lg="12">
                <div className="d-flex gap g-2 justify-content-center">
                  <div className="gap-col">
                    {/* <Button variant="primary" onClick={handleAddFamilyMembers}> */}
                    <Button type="submit" variant="primary"
                    // disabled={totalLotWeight >= farmerdetails.netWeight}
                    disabled={isAddDisabled}
                    >
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
