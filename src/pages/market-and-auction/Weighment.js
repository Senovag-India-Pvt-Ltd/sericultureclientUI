import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { SerialPort } from "serialport";
import api from "../../../src/services/auth/api";
import { useSpeechSynthesis } from "react-speech-kit";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL1 = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function Weighment() {
  const [weighStream, setWeighStream] = useState("");
  const [lastWeight, setLastWeight] = useState("0");
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalNetWeight, setTotalNetWeight] = useState(0);
  const [tableWeightData, setTableWeightData] = useState([]);

  const { speak } = useSpeechSynthesis();

  const [noOfBox, setNoOfBox] = useState(0);
  const [lotNumber, setLotNumber] = useState("");
  const [pricePerKg, setPricePerKg] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalNetPrice, setTotalNetPrice] = useState(0);
  const [tareWeight, setTareWeight] = useState(0.0);
  const [counter, setCounter] = useState(0);

  const [canContinue, setCanContinue] = useState(false);

  const [weighTest, setWeighTest] = useState(false);

  const notify = (what) => {
    if (what === "lot") {
      toast.warn("Please Enter Lot No", {
        position: "top-center",
      });
    }
    if (what === "crate") {
      toast.warn("Please Enter No of Crates", {
        position: "top-center",
      });
    }
  };

  const [data, setData] = useState({
    allottedLotId: "",
    noOfCrates: "0",
  });

  console.log("Initial Counter:", counter);
  console.log("Initial No of Crates:", data.noOfCrates);

  const [weigh, setWeigh] = useState({
    date: new Date(),
    bidAmount: "0",
    reelerCurrentBalance: 0,
    farmerFirstName: "",
    farmerNumber: "",
    reelerName: "",
    reelerLicense: "",
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const onchangingCrate = (e) => {
    let value = e.target.value;
    setData((prev) => {
      return { ...prev, noOfCrates: value };
    });
    if (data.allottedLotId) {
      getLotDetails(data.allottedLotId);
      if (value && parseInt(value) !== 0) {
        // debugger;
        getCrateDetails(value, data.allottedLotId);
      }
    }
  };

  const onchanging = (e) => {
    let value = e.target.value;
    setData((prev) => {
      return { ...prev, allottedLotId: value };
    });
    if (value !== "") {
      // debugger;
      getLotDetails(value);
      if (data.noOfCrates && parseInt(data.noOfCrates) !== 0) {
        getCrateDetails(data.noOfCrates, value);
      }
    }
    // if(!data.noOfCrates){
    //   getLotDetails(value);
    //   getCrateDetails(data.noOfCrates, value);
    // }else{
    //   alert("Please Enter No of Crates");
    // }
  };

  const continueWeighment = () => {
    setWeighTest(true);
    setLastWeight("0");
  };

  const getLotDetails = (allottedLotId) => {
    const sendData = {
      marketId: localStorage.getItem("marketId"),
      godownId: localStorage.getItem("godownId"),
      allottedLotId: allottedLotId,
    };
    api
      .post(baseURL1 + `auction/weigment/getUpdateWeighmentByLotId`, sendData)
      .then((response) => {
        // debugger;
        console.log(response.data.content);
        setWeigh((prev) => {
          return { ...prev, ...response.data.content };
        });
        setPricePerKg(response.data.content.bidAmount);
        setTareWeight(response.data.content.tareWeight);

        console.log(response);
      })
      .catch((err) => {
        // debugger;
        // setData({});
        // saveError();
      });
  };

  const [weight, setWeight] = useState(0);

  const getCrateDetails = (noOfCrates, allottedLotId) => {
    const sendData = {
      marketId: localStorage.getItem("marketId"),
      godownId: localStorage.getItem("godownId"),
      allottedLotId: allottedLotId,
      noOfCrates: noOfCrates,
    };
    api
      .post(baseURL1 + `auction/weigment/canContinuetoWeighment`, sendData)
      .then((response) => {
        // debugger;
        if (response.data.errorCode === 0 && response.data.content === null) {
          submitError(response.data.errorMessages[0].reason);
        } else if (response.data.errorCode === -1) {
          if (response.data.content) {
            setWeight(response.data.content.weight);
            // alert(response.data.errorMessages[0]);
            // submitError(response.data.errorMessages[0]);
            submitConfirm();
          } else {
            submitError(response.data.errorMessages[0]);
          }
        } else if (response.data.errorCode === 0) {
          setWeight(response.data.content.weight);
        }
      })
      .catch((err) => {
        // debugger;
        // setData({});
        // saveError();
      });
  };

  const submitError = (message = "Something went wrong!") => {
    Swal.fire({
      icon: "error",
      title: "Not Saved",
      text: message,
    }).then((result) => {
      if (result.isConfirmed) {
        setData({
          allottedLotId: "",
          noOfCrates: "0",
        });
        setWeigh({
          date: new Date(),
          bidAmount: "0",
          reelerCurrentBalance: 0,
          farmerFirstName: "",
          farmerNumber: "",
          reelerName: "",
          reelerLicense: "",
        });
        setTableWeightData([]);
        setTotalNetPrice(0);
        setTotalWeight(0);
        setTotalNetWeight(0);
        setTareWeight(0);
        setCounter(0);
        setLastWeight("0");
      }
    });
  };

  const submitSuccess = (amount, lot) => {
    Swal.fire({
      icon: "warning",
      title: "Weighment Completed",
      text: `Total amount Debited is ${amount} for Lot ${lot}`,
    }).then((result) => {
      if (result.isConfirmed) {
        setData({
          allottedLotId: "",
          noOfCrates: "0",
        });
        setWeigh({
          date: new Date(),
          bidAmount: "0",
          reelerCurrentBalance: 0,
          farmerFirstName: "",
          farmerNumber: "",
          reelerName: "",
          reelerLicense: "",
        });
        setTableWeightData([]);
        setTotalNetPrice(0);
        setTotalWeight(0);
        setTotalNetWeight(0);
        setTareWeight(0);
        setCounter(0);
        setLastWeight("0");
        // setLotNumber("");

        printTriplet();
      }
    });
  };

  const printTriplet = () => {
    const newDate = new Date();
    const formattedDate =
      newDate.getFullYear() +
      "-" +
      (newDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      newDate.getDate().toString().padStart(2, "0");
    api
      .post(
        `https://api.senovagseri.com/reports-uat/marketreport/gettripletpdf-kannada`,
        {
          marketId: localStorage.getItem("marketId"),
          godownId: localStorage.getItem("godownId"),
          allottedLotId: data.allottedLotId,
          auctionDate: formattedDate,
        },
        {
          responseType: "blob", //Force to receive data in a Blob Format
        }
      )
      .then((response) => {
        //console.log("hello world", response.data);
        //Create a Blob from the PDF Stream
        const file = new Blob([response.data], { type: "application/pdf" });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
        window.open(fileURL);
      })
      .catch((error) => {
        // console.log("error", error);
      });
  };

  const onSubmitting = (e) => {
    const submitData = {
      marketId: localStorage.getItem("marketId"),
      godownId: localStorage.getItem("godownId"),
      allottedLotId: data.allottedLotId,
      weighmentList: tableWeightData,
      userName: localStorage.getItem("username"),
    };
    api
      .post(baseURL1 + `auction/weigment/completeWeighmentForLot`, submitData)
      .then((response) => {
        // debugger;
        console.log(response.data.content);
        if (response.data.content) {
          submitSuccess(
            response.data.content.totalAmountDebited,
            response.data.content.allottedLotId
          );
          speak({ text: `Weighment Completed Successfully` });
        } else {
          submitError(response.data.errorMessages);
        }
        // setWeigh((prev) => {
        //   return { ...prev, ...response.data.content };
        // });

        // console.log(response);
      })
      .catch((err) => {
        // debugger;
        // setData({});
        // saveError();
      });
  };

  console.log("tableWeightData", tableWeightData);

  const submitConfirm = async () => {
    // debugger
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Insufficient balance, Do you want to continue with the Weighment?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Continue!",
      });

      if (result.isConfirmed) {
        // debugger
      } else {
        setData((prev) => ({ ...prev, allottedLotId: "" }));
      }
    } catch (error) {
      console.error("Error during submitConfirm:", error);
      Swal.fire("Error", "An error occurred", "error");
    }

    // Swal.fire({
    //   title: "Are you sure?",
    //   text: "Do you Want to Complete Weighment?",
    //   icon: "success",
    //   showCancelButton: true,
    //   confirmButtonText: "Yes, Complete it!",
    // }).then((result) => {
    //   if (result.value) {
    //     const submitData = {
    //       marketId: localStorage.getItem("marketId"),
    //       godownId: "2",
    //       allottedLotId: data.allottedLotId,
    //       weighmentList: tableWeightData,
    //       userName: localStorage.getItem("username"),
    //     };
    //     api
    //       .post(baseURL1 + `auction/weigment/completeWeighmentForLot`, submitData)
    //       .then((response) => {
    //         // debugger;
    //         console.log(response.data.content);
    //         if (response.data.content) {
    //           setTableWeightData([]);
    //           setTotalWeight(0);
    //           setTotalNetWeight(0);
    //           setLotNumber("");
    //           printTriplet();
    //         }
    //         // setWeigh((prev) => {
    //         //   return { ...prev, ...response.data.content };
    //         // });
    //         alert(
    //           `Total amount Debited is ${response.data.content.totalAmountDebited} for Lot ${response.data.content.totalAmountDebited}`
    //         );
    //         // console.log(response);
    //       })
    //       .catch((err) => {
    //         // debugger;
    //         // setData({});
    //         // saveError();
    //       });
    //     // Swal.fire("Deleted", "You successfully deleted this record", "success");
    //   } else {
    //     console.log(result.value);
    //     Swal.fire("Cancelled", "Weighment not submitted", "info");
    //   }
    // });
  };

  // const lastSubmitConfirm = async () => {
  //   // return window.confirm("Are you sure?");
  //   debugger
  //   try {
  //     const result = await Swal.fire({
  //       title: "Are you sure?",
  //       text: "Insufficient balance, Do you want to continue with the Weighment?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes, Continue!",
  //     });
  //     debugger;
  //     if (result.isConfirmed) {
  //       debugger;
  //       onSubmitting();
  //     } else {
  //       console.log("Confirmation canceled");
  //       // setData((prev) => ({ ...prev, allottedLotId: "" }));
  //     }
  //   } catch (error) {
  //     console.error("Error during submitConfirm:", error);
  //     Swal.fire("Error", "An error occurred", "error");
  //   }
  // };

  const lastSubmitConfirm = async () => {
    // return window.confirm("Are you sure?");
    // debugger;
    try {
      // return Swal.fire({
      //   title: "Are you sure?",
      //   text: "Insufficient balance, Do you want to continue with the Weighment?",
      //   icon: "warning",
      //   showCancelButton: true,
      //   confirmButtonText: "Yes, Continue!",
      // }).then((result)=>{
      //   if (result.isConfirmed) {
      //     debugger;
      //     onSubmitting();
      //   } else {
      //     console.log("Confirmation canceled");
      //     // setData((prev) => ({ ...prev, allottedLotId: "" }));
      //   }
      // })
      const isConfirmed = window.confirm(
        "Insufficient Balance,Do you want to continue with the Weighment?"
      );
      // debugger;
      if (isConfirmed) {
        onSubmitting();
      } else {
        console.log("Confirmation canceled");
      }
    } catch (error) {
      console.error("Error during submitConfirm:", error);
      Swal.fire("Error", "An error occurred", "error");
    }
  };

  // useEffect(() => {

  //   console.log( lastWeight  );
  //   // Code to be executed after waiting for one second
  //   console.log('One second has passed!');

  //   const lastWeightFloat  = parseFloat(lastWeight.trim()) || 0;
  //   const totalWeightFloat = lastWeightFloat + totalWeight;
  //   setTotalWeight(totalWeightFloat);

  //   setWeighStream('');

  //   // If you want to clean up the effect, you can return a cleanup function
  //   return () => {
  //     // Cleanup code here (optional)
  //   };
  // }, [lastWeight]); // myState is specified as a dependency

  // useEffect(() => {
  //   const handleKeyDown = async (event) => {
  //     if (event.key === "Enter") {
  //       // Handle the Enter key press here
  //       //{data.noOfCrates} - {counter}
  //       // If condition to continue with weighing
  //       if (data.allottedLotId == "") {
  //         alert("Please Enter Lot No");
  //         setCanContinue(false);
  //       }
  //       if (data.noOfCrates <= 0) {
  //         alert("Please Enter No of Crates");
  //         setCanContinue(false);
  //       }
  //       // debugger;
  //       if (counter >= parseInt(data.noOfCrates)-1) {
  //         setCanContinue(false);
  //         // alert("You already completed the weighment with crates");
  //         // document.removeEventListener("keydown", handleKeyDown);
  //         // await submitConfirm();

  //         onSubmitting();
  //         // printTriplet();
  //       }

  //       // if(data.noOfCrates <= 0 || data.allottedLotId == "" || counter >= data.noOfCrates){
  //       if (
  //         data.noOfCrates <= 0 ||
  //         data.allottedLotId == "" ||
  //         counter >= parseInt(data.noOfCrates)-1
  //       ) {
  //         setCanContinue(false);
  //         console.log("cannot continue with weighment");
  //       } else {
  //         setCanContinue(true);
  //       }

  //       if (canContinue) {
  //         let prabhu = weighStream.toString();

  //         const lastWeightString = prabhu.substring(
  //           prabhu.lastIndexOf("kg") - 8,
  //           prabhu.lastIndexOf("kg") - 1
  //         );

  //         setLastWeight(lastWeightString);

  //         const lastWeightFloat = parseFloat(lastWeightString.trim()) || 0;
  //         const totalWeightFloat = lastWeightFloat + totalWeight;

  //         setTotalWeight(totalWeightFloat);

  //         // calculate set total net weight
  //         // const totalNetWeightFloat =
  //         //   lastWeightFloat - tareWeight + totalNetWeight;

  //         const totalNetWeightFloat =
  //           lastWeightFloat - tareWeight + totalNetWeight < 0
  //             ? 0
  //             : lastWeightFloat - tareWeight + totalNetWeight;

  //         setTotalNetWeight(totalNetWeightFloat);

  //         const weightObj = {
  //           grossWeight: lastWeightFloat,
  //           netWeight:
  //             lastWeightFloat >= tareWeight ? lastWeightFloat - tareWeight : 0,
  //           crateNumber: data.noOfCrates,
  //         };
  //         setTableWeightData((prevState) => [...prevState, weightObj]);

  //         const formattedTotalPrice = totalWeightFloat * pricePerKg;
  //         console.log(pricePerKg);
  //         console.log(formattedTotalPrice);

  //         setTotalPrice(formattedTotalPrice);

  //         // calculate total net cocoon net weight total price
  //         const formattedTotalNetPrice = totalNetWeightFloat * pricePerKg;
  //         // setTotalNetPrice(formattedTotalNetPrice);
  //         setTotalNetPrice(10);

  //         if (counter <= parseInt(data.noOfCrates)-1) {
  //           setCounter(counter + 1);
  //         }

  //         setWeighStream("");
  //       }
  //     }
  //   };

  //   // console.log(tableWeightData);

  //   // Attach the event listener when the component mounts
  //   document.addEventListener("keydown", handleKeyDown);

  //   // Detach the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // });

  useEffect(() => {
    if (weighTest) {
      let canContinue1 = false;
      const handleKeyDown = async (event) => {
        if (event.key === "Enter") {
          // debugger;
          // Handle the Enter key press here
          //{data.noOfCrates} - {counter}
          // If condition to continue with weighing
          if (data.allottedLotId == "" || data.noOfCrates <= 0) {
            // debugger;
            if (data.allottedLotId == "") {
              notify("lot");
              setCanContinue(false);
              canContinue1 = false;
            }
            if (data.noOfCrates <= 0) {
              notify("crate");
              setCanContinue(false);
              canContinue1 = false;
            }
          }

          // debugger;
          // if (counter >= parseInt(data.noOfCrates)-1) {
          //   setCanContinue(false);
          //   // alert("You already completed the weighment with crates");
          //   // document.removeEventListener("keydown", handleKeyDown);
          //   // await submitConfirm();

          //   onSubmitting();
          //   // printTriplet();
          // }
          console.log("counter", counter);
          console.log("noOfCrate", parseInt(data.noOfCrates));
          if (
            counter === parseInt(data.noOfCrates) ||
            data.allottedLotId === ""
          ) {
            // debugger;
            if (parseInt(data.noOfCrates) === 0) {
              // alert("Please Enter No of Crates");
              notify("crate");
              setCanContinue(false);
              canContinue1 = false;
            } else if (data.allottedLotId === "") {
              // alert("Please Enter Lot Number");
              notify("lot");
              setCanContinue(false);
              canContinue1 = false;
            } else if (totalNetPrice > weigh.reelerCurrentBalance) {
              // console.log("Reeler don't have enough money");
              // getCrateDetails();
              await lastSubmitConfirm();
            } else {
              console.log("hello Weight");
              setCanContinue(false);
              canContinue1 = false;
              onSubmitting();
            }
          } else {
            canContinue1 = true;
          }

          // if(data.noOfCrates <= 0 || data.allottedLotId == "" || counter >= data.noOfCrates){
          // if (
          //   data.noOfCrates <= 0 ||
          //   data.allottedLotId == "" ||
          //   counter >= parseInt(data.noOfCrates) - 1
          // ) {
          //   debugger;
          //   setCanContinue(false);
          //   canContinue1 = false;
          //   console.log("cannot continue with weighment");
          // } else {
          //   setCanContinue(true);
          //   canContinue1 = true;
          // }

          if (canContinue1) {
            let prabhu = weighStream.toString();

            const lastWeightString = prabhu.substring(
              prabhu.lastIndexOf("kg") - 8,
              prabhu.lastIndexOf("kg") - 1
            );

            setLastWeight(lastWeightString);

            const lastWeightFloat = parseFloat(lastWeightString.trim()) || 0;
            const totalWeightFloat = lastWeightFloat + totalWeight;

            setTotalWeight(totalWeightFloat);

            // calculate set total net weight
            // const totalNetWeightFloat =
            //   lastWeightFloat - tareWeight + totalNetWeight;

            const totalNetWeightFloat =
              lastWeightFloat - tareWeight + totalNetWeight < 0
                ? 0
                : lastWeightFloat - tareWeight + totalNetWeight;

            setTotalNetWeight(totalNetWeightFloat);

            const weightObj = {
              grossWeight: lastWeightFloat,
              netWeight:
                lastWeightFloat >= tareWeight
                  ? lastWeightFloat - tareWeight
                  : 0,
              crateNumber: data.noOfCrates,
            };
            setTableWeightData((prevState) => [...prevState, weightObj]);

            const formattedTotalPrice = totalWeightFloat * pricePerKg;
            console.log(pricePerKg);
            console.log(formattedTotalPrice);

            setTotalPrice(formattedTotalPrice);

            // calculate total net cocoon net weight total price
            const formattedTotalNetPrice = totalNetWeightFloat * pricePerKg;
            setTotalNetPrice(formattedTotalNetPrice);
            // setTotalNetPrice(10);

            if (counter <= parseInt(data.noOfCrates) - 1) {
              // debugger;
              speak({ text: `Crate number ${counter + 1} is completed` });
              setCounter(counter + 1);
            }

            setWeighStream("");
          }
        }
      };

      // console.log(tableWeightData);

      // Attach the event listener when the component mounts
      document.addEventListener("keydown", handleKeyDown);

      // Detach the event listener when the component unmounts
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      const handleTestKeyDown = async (event) => {
        if (event.key === "Enter") {
          let prabhuTest = weighStream.toString();

          const lastWeightStringTest = prabhuTest.substring(
            prabhuTest.lastIndexOf("kg") - 8,
            prabhuTest.lastIndexOf("kg") - 1
          );

          setLastWeight(lastWeightStringTest);
        }
      };
      document.addEventListener("keydown", handleTestKeyDown);

      return () => {
        document.removeEventListener("keydown", handleTestKeyDown);
      };
    }
  });

  // if (counter == parseInt(data.noOfCrates)) {
  //   if (totalNetPrice > weigh.reelerCurrentBalance) {
  //     // console.log("Reeler don't have enough money");
  //     // getCrateDetails();
  //     lastSubmitConfirm();
  //   } else {
  //     console.log("hello Weight");
  //   }
  // }

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  // const postData = (e) => {
  //   axios
  //     .post(baseURL + `caste/add`, data, {
  //       headers: _header,
  //     })
  //     .then((response) => {
  //       saveSuccess();
  //     })
  //     .catch((err) => {
  //       setData({});
  //       saveError();
  //     });
  // };

  const testSerialPort = async (e) => {
    // https://fidisys.com/blog/serial-port-devices/
    if ("serial" in navigator) {
      console.log("Awesome, The serial port is supported.");
      // The Web Serial API is supported.

      // Prompt user to select any serial port.
      const port = await navigator.serial.requestPort();

      // Wait for the serial port to open.
      await port.open({ baudRate: 9600 });

      // Listen to data coming from the serial device.
      const reader = port.readable.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // console.log(new TextDecoder().decode(value));
          // Allow the serial port to be closed later.
          reader.releaseLock();
          break;
        }

        setWeighStream((prevVal) => prevVal + new TextDecoder().decode(value));
      }
    }
  };

  const deleteRow = (indexToDelete) => {
    let weightAmount;
    let weightNet;
    let weightGross;
    speak({ text: `Crate number ${indexToDelete + 1}  is deleted` });
    const updatedData = tableWeightData.filter((data, index) => {
      if (index === indexToDelete) {
        weightAmount = data.netWeight * weigh.bidAmount;
        weightNet = data.netWeight;
        weightGross = data.grossWeight;
      }
      return index !== indexToDelete;
    });

    console.log("wa", weightAmount);
    console.log("wn", weightNet);
    console.log("wg", weightGross);
    // debugger;
    setCounter((prev) => prev - 1);
    setTableWeightData(updatedData);
    setTotalNetPrice((prev) => prev - weightAmount);
    setTotalNetWeight((prev) => prev - weightNet);
    setTotalWeight((prev) => prev - weightGross);
  };

  const styles = {
    top: {
      backgroundColor: "rgb(248 248 249)",
      color: "#000",
      //   width: "50%",
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    bottom: {
      backgroundColor: "#fff",
      color: "#b50606",
      fontWeight: "bold",
      fontSize: "80px",
      textAlign: "center",
    },
    large: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "#b50606",
      fontWeight: "bold",
      fontSize: "150px",
      textAlign: "center",
    },
    small: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      fontWeight: "bold",
      fontSize: "43px",
      textAlign: "center",
    },
    xsmall: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "#b50606",
      fontWeight: "bold",
      fontSize: "30px",
      textAlign: "center",
    },
    xxsmall: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    xxsmallcolor: {
      backgroundColor: "rgb(0, 128, 0, 1)",
      color: "rgb(255, 255, 255)",
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    smallwhiteback: {
      backgroundColor: "#fff",
      color: "#b50606",
      fontWeight: "bold",
      fontSize: "30px",
      textAlign: "left",
    },
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",

      // text: "You clicked the button!",
    }).then(() => {
      navigate("/seriui/caste-list");
    });
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };
  return (
    // <Layout title="e-Weighment">
    <div>
      {/* <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">e-Weighment</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  e-Weighment
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/caste-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/caste-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head> */}

      {weighTest ? (
        <Block>
          <Form action="#">
            <Row className="g-3">
              <Col lg="12">
                <Card>
                  <Card.Body>
                    <Row className="g-3 ">
                      <ToastContainer />
                      <Col lg="6" style={{ padding: "0px 0px 0px 8px" }}>
                        <table className="table small table-bordered weightmenttable marginbottom0">
                          <thead>
                            <tr>
                              <th style={styles.top}>No of Crate(s)</th>
                              <th style={styles.top}>Lot No</th>
                              <th style={styles.top}>Bid Price / Kg</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              {/* <td style={styles.bottom}>{noOfBox}</td> */}
                              <td style={styles.bottom}>
                                <input
                                  name="noOfCrates"
                                  value={data.noOfCrates}
                                  onChange={handleInputs}
                                  onBlur={onchangingCrate}
                                  style={{
                                    width: "100px",
                                    color: "#b50606",
                                    borderStyle: "none",
                                    boxSizing: "border-box",
                                  }}
                                />
                              </td>

                              <td style={styles.bottom}>
                                <input
                                  name="allottedLotId"
                                  value={data.allottedLotId}
                                  onChange={handleInputs}
                                  onBlur={onchanging}
                                  style={{
                                    width: "100px",
                                    color: "#b50606",
                                    borderStyle: "none",
                                    boxSizing: "border-box",
                                  }}
                                />
                              </td>

                              <td style={styles.bottom}>
                                {" "}
                                &#8377; {weigh.bidAmount}
                              </td>

                              {/* <td style={styles.bottom}>2</td> */}
                            </tr>
                          </tbody>
                        </table>
                      </Col>

                      <Col lg="3" style={{ padding: 0 }}>
                        <table className="table small table-bordered marginbottom0">
                          {/* <thead>
                          <tr>
                            <th style={styles.top}>No of Box(es)</th>
                            <th style={styles.top}>Lot No</th>
                            <th style={styles.top}>Price</th>
                          </tr>
                        </thead> */}
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  backgroundColor: "rgb(248, 248, 249, 1)",
                                  color: "rgb(0, 0, 0)",
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                  textAlign: "center",
                                }}
                              >
                                {weigh.date.toDateString()}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  ...styles.small,
                                  backgroundColor:
                                    Math.round(
                                      weigh.reelerCurrentBalance -
                                        weight * weigh.bidAmount
                                    ) >= 0
                                      ? "green"
                                      : "red",
                                  fontSize: "31px",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  color: "#000",
                                }}
                              >
                                {" "}
                                {/* &#8377; {totalNetPrice } */}
                                Balance: &#8377;{" "}
                                {Math.round(
                                  weigh.reelerCurrentBalance -
                                    weight * weigh.bidAmount
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={styles.small}
                                style={{
                                  backgroundColor: "white",
                                  fontSize: "31px",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  color: "#000",
                                }}
                              >
                                {" "}
                                {/* &#8377; {totalNetPrice } */}
                                &#8377;{" "}
                                {Number.isInteger(Number(totalNetPrice))
                                  ? Number(totalNetPrice).toFixed(0)
                                  : Number(totalNetPrice).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                      <Col lg="3" style={{ padding: "0 8px 0 0" }}>
                        <table className="table small table-bordered marginbottom0">
                          <tbody>
                            <tr>
                              <td style={styles.small}>
                                Tare wt: {tareWeight}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.small}>
                                {" "}
                                Crates {data.noOfCrates} - {counter}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                    </Row>
                    <Row className="g-3 ">
                      <Col lg="8">
                        <table className="table smallwhiteback table-bordered">
                          <tbody>
                            <tr>
                              <td style={styles.smallwhiteback}>
                                Farmer Details: {weigh.farmerFirstName}{" "}
                                {weigh.farmerNumber}
                                {/* RMG3333-RAM (SAK 3333) */}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.smallwhiteback}>
                                Reeler Details:{weigh.reelerName}{" "}
                                {weigh.reelerLicense}
                                {/* 353535-MARUTI */}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  backgroundColor: "green",
                                  padding: "3%",
                                }}
                              >
                                {" "}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.large}>{lastWeight}</td>
                            </tr>
                            <tr>
                              <td style={styles.xxsmallcolor}>
                                Reeler Wallet Amount: &#8377;{" "}
                                {weigh.reelerCurrentBalance}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Button
                                  type="button"
                                  variant="primary"
                                  onClick={testSerialPort}
                                >
                                  Generate
                                </Button>
                                <Button
                                  type="button"
                                  variant="primary"
                                  onClick={onSubmitting}
                                  className="ms-1"
                                >
                                  Submit
                                </Button>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  value={weighStream}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>

                      <Col lg="4">
                        <table className="table small table-bordered totalweight">
                          <tbody>
                            <tr>
                              <td
                                style={styles.small}
                                style={{
                                  fontSize: "50px",
                                  color: "rgb(181, 6, 6)",
                                }}
                              >
                                {/* Total Gross Wt: {totalWeight} */}
                                {/* Total Gross Wt: {Number(totalWeight).toFixed(2)} */}
                                Total Gross Wt:{" "}
                                {Number.isInteger(Number(totalWeight))
                                  ? Number(totalWeight).toFixed(0)
                                  : Number(totalWeight).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={styles.small}
                                style={{
                                  fontSize: "50px",
                                  color: "rgb(181, 6, 6)",
                                }}
                              >
                                {/* Total Net Wt: {totalNetWeight} */}
                                {/* Total Net Wt: {Number(totalNetWeight).toFixed(2)} */}
                                Total Net Wt:{" "}
                                {Number.isInteger(Number(totalNetWeight))
                                  ? Number(totalNetWeight).toFixed(0)
                                  : Number(totalNetWeight).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        {/* <table className="table small table-bordered totalweight">
                        <tbody>
                          {tableWeightData.map((row, index) => (
                            <tr key={index}>
                              <td style={styles.xxsmall}>
                                {" "}
                                {index + 1} -{" "}
                                {Number.isInteger(Number(row.netWeight))
                                  ? Number(row.netWeight).toFixed(0)
                                  : Number(row.netWeight).toFixed(2)}
                                <span className="ms-2">
                                  <Button
                                    size="sm"
                                    onClick={() => deleteRow(index)}
                                  >
                                    Delete
                                  </Button>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table> */}
                        <table className="table small table-bordered totalweight">
                          <tbody>
                            {tableWeightData.map(
                              (row, index) =>
                                // debugger
                                index + 1 !== data.noOfCrates && (
                                  <tr key={index}>
                                    <td style={styles.xxsmall}>
                                      {index + 1} -{" "}
                                      {Number.isInteger(Number(row.netWeight))
                                        ? Number(row.netWeight).toFixed(0)
                                        : Number(row.netWeight).toFixed(2)}
                                      <span className="ms-2">
                                        <Button
                                          size="sm"
                                          onClick={() => deleteRow(index)}
                                        >
                                          Delete
                                        </Button>
                                      </span>
                                    </td>
                                  </tr>
                                )
                            )}
                          </tbody>
                        </table>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="button" variant="primary" onClick={postData}>
                    Generate
                  </Button>
                </li>
              </ul>
            </div> */}
            </Row>
          </Form>
        </Block>
      ) : (
        <Block>
          {/* <h1>Hello</h1> */}
          <Form action="#">
            <Row className="g-3">
              <Col lg="12">
                <Card>
                  <Card.Body>
                    <Row className="g-3 ">
                      <Col lg="8">
                        <table className="table smallwhiteback table-bordered">
                          <tbody>
                            <tr>
                              <td style={styles.smallwhiteback}>
                                Date: {new Date().toDateString()}
                              </td>
                            </tr>

                            {/* <tr>
                            <td
                              style={{
                                backgroundColor: "green",
                                padding: "3%",
                              }}
                            >
                              {" "}
                            </td>
                          </tr> */}
                            <tr>
                              <td style={styles.large}>{lastWeight}</td>
                            </tr>

                            <tr>
                              <td>
                                <Button
                                  type="button"
                                  variant="primary"
                                  onClick={testSerialPort}
                                >
                                  Check Weight
                                </Button>
                                <Button
                                  type="button"
                                  variant="primary"
                                  onClick={continueWeighment}
                                  className="ms-1"
                                >
                                  Continue weighment
                                </Button>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  value={weighStream}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        </Block>
      )}
    </div>
    // </Layout>
  );
}

export default Weighment;
