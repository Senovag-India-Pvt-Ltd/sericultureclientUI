import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import classNames from "classnames";
// import { SerialPort } from "serialport";
import api from "../../../src/services/auth/api";
import { useLocation } from "react-router-dom";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function DownloadSanctionOrder() {
  // const { sanctionOrderDownloadUrl } = useParams();


  const [sanctionData, setSanctionData] = useState(null);

  // useEffect(() => {
  //   searchSanctionByURL(sanctionOrderDownloadUrl);
  // }, [sanctionOrderDownloadUrl]);

const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const sanctionOrderDownloadUrl = queryParams.get("sch");

const [validationMessage, setValidationMessage] = useState("");
const [isValidUrl, setIsValidUrl] = useState(false);
const [securityKeyFromDB, setSecurityKeyFromDB] = useState("");

// useEffect(() => {
//   const hostname = window.location.hostname;

//   const isLocal = hostname === "localhost";
//   const isProduction = hostname === "e-reshme.karnataka.gov.in";

//   if (!isLocal && !isProduction) {
//     setIsValidUrl(false);
//     setValidationMessage("⚠️ Invalid Access.");
//     return;
//   }
// }, []);

// useEffect(() => {
//   if (sanctionOrderDownloadUrl) {

//     // ✅ Construct full relative URL
//     // const fullUrl = `/download-sanction-order?sch=${sanctionOrderDownloadUrl}`;
//     const fullUrl = `${window.location.origin}/seriui/download-sanction-order?sch=${sanctionOrderDownloadUrl}`;

//     searchSanctionByURL(fullUrl);
//   }
// }, [sanctionOrderDownloadUrl]);

useEffect(() => {

  // 1️⃣ Validate hostname FIRST
  const hostname = window.location.hostname;

  const allowedHosts = ["localhost", "e-reshme.karnataka.gov.in"];

  if (!allowedHosts.includes(hostname)) {
    setIsValidUrl(false);
    setValidationMessage("⚠️ Invalid Access.");
    return; // 🚫 stop here
  }

  // 2️⃣ Validate security key exists
  if (!sanctionOrderDownloadUrl) {
    setIsValidUrl(false);
    setValidationMessage("⚠️ Invalid URL.");
    return;
  }

  // 3️⃣ Call backend with ONLY security key
  searchSanctionByURL(sanctionOrderDownloadUrl);

}, [sanctionOrderDownloadUrl]);

// const searchSanctionByURL = (fullUrl) => {
//   api
//     .get(baseURLDBT + "service/by-url", {
//       params: {
//         url: fullUrl,   // ✅ pass full URL here
//       },
//     })
//     .then((response) => {

//       setSanctionData(response.data);
//     })
//     .catch((err) => {
//       setSanctionData(null);
//       alert(
//         err?.response?.data?.message ||
//           "Invalid or expired URL. Please verify the link and try again."
//       );
//     });
// };

// const searchSanctionByURL = (fullUrl) => {
//   const fullCurrentUrl = window.location.href;
//   api
//     .get(baseURLDBT + "dashboard/by-url", {
//       params: { url: fullCurrentUrl },
//     })
//     .then((response) => {
//       const dbSecurityKey = response?.data?.sanctionOrderDownloadUrl;

//       // ✅ Compare security key
//       if (dbSecurityKey !== sanctionOrderDownloadUrl) {
//         setIsValidUrl(false);
//         setValidationMessage(
//           "⚠️ Invalid URL."
//         );
//         return;
//       }

//       // ✅ Valid case
//       setSecurityKeyFromDB(dbSecurityKey);
//       setIsValidUrl(true);
//       setValidationMessage("");
//       setSanctionData(response.data);
//     })
//     .catch((err) => {
//       setIsValidUrl(false);
//       setValidationMessage(
//         "⚠️ Invalid URL."
//       );
//       setSanctionData(null);
//     });
// };

const [sanctionRecords, setSanctionRecords] = useState([]);
const [schemeId, setSchemeId] = useState(null);
const [subSchemeId, setSubSchemeId] = useState(null);

const searchSanctionByURL = () => {
  const fullCurrentUrl = window.location.href;

  api
    .get(baseURLDBT + "dashboard/by-url", {
      params: { url: fullCurrentUrl },
    })
    .then((response) => {
      const data = response?.data;

      if (!data) {
        setIsValidUrl(false);
        setValidationMessage("⚠️ Invalid URL.");
        return;
      }

      // ✅ Handle single or multiple records
      const records = Array.isArray(data) ? data : [data];

      const dbSecurityKey = records[0]?.securityKey;

      if (dbSecurityKey !== sanctionOrderDownloadUrl) {
        setIsValidUrl(false);
        setValidationMessage("⚠️ Invalid URL.");
        return;
      }

      // ✅ Store everything
      setSanctionRecords(records);
      setSchemeId(records[0]?.schemeId);
      setSubSchemeId(records[0]?.subSchemeId);

      setIsValidUrl(true);
      setValidationMessage("");
    })
    .catch(() => {
      setIsValidUrl(false);
      setValidationMessage("⚠️ Invalid URL.");
    });
};

const handleDownloadClick = async () => {
  if (!sanctionRecords.length) return;

  await generateFinalReport(sanctionRecords);
};

const generateFinalReport = async (records) => {

  if (!records || records.length === 0) return;

  const sanctionType = records[0]?.sanctionOrderForScheme;

  switch (sanctionType) {

    case "Bonus PM":
      await generateReportForBonusPM(records);
      break;

    case "Bonus BV":
      await generateAcknowledgmentBonusBV(records);
      break;

    case "Incentive PM":
      await generateAcknowledgmentIncentivePM(records);
      break;

    case "Incentive BV":
      await generateAcknowledgmentIncentiveBV(records);   // ✅ FIXED
      break;

    case "North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP":
      await generateReportForNorthKarnataka(records);
      break;

    case "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500":
      await generateReportFor1500dfls(records);
      break;

    case "Incentive For Bivoltine Cocoons-30/kg-PSF":
      await generateReportFor30Rs(records);
      break;

    case "Incentive For Bivoltine Chawki Rearing Cost":
      await generateReportFor100Rs(records);
      break;

    case "Silk Incentive-PSF":
      await generateReportForSilkIncentive(records);
      break;

    default:
      return;
  }
};


const generateReportForNorthKarnataka = async (records) => {
  try {
    const applicationFormIds = records.map(row => row.scApplicationFormId);

    const schemeId = records[0]?.schemeId;
    const subSchemeId = records[0]?.subSchemeId;

    const response = await api.post(
      baseURLReport + `get-TransportSubsidy`,
      {
        // userMasterId: localStorage.getItem("userMasterId"),
        schemeId,
        subSchemeId,
        applicationFormIds,
      },
      {
        responseType: "blob",
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (error) {
    // console.error("Error generating bonus report", error);
  }
};


const generateReportFor30Rs = async (records) => {
  try {
    const applicationFormIds = records.map(row => row.scApplicationFormId);

    const schemeId = records[0]?.schemeId;
    const subSchemeId = records[0]?.subSchemeId;

    const response = await api.post(
      baseURLReport + `get-PriceStabilizationIncentive`,
      {
        // userMasterId: localStorage.getItem("userMasterId"),
        schemeId,
        subSchemeId,
        applicationFormIds,
      },
      {
        responseType: "blob",
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (error) {
    // console.error("Error generating bonus report", error);
  }
};


const generateReportFor100Rs = async (records) => {
  try {
    const applicationFormIds = records.map(row => row.scApplicationFormId);

    const schemeId = records[0]?.schemeId;
    const subSchemeId = records[0]?.subSchemeId;


    const response = await api.post(
      baseURLReport + `get-MscSeedChawki1000`,
      {
        // userMasterId: localStorage.getItem("userMasterId"),
        schemeId,
        subSchemeId,
        applicationFormIds,
      },
      {
        responseType: "blob",
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (error) {
    // console.error("Error generating bonus report", error);
  }
};


const generateReportFor1500dfls = async (records) => {
  try {
    const applicationFormIds = records.map(row => row.scApplicationFormId);

    const schemeId = records[0]?.schemeId;
    const subSchemeId = records[0]?.subSchemeId;

    const response = await api.post(
      baseURLReport + `get-MscSeedChawki`,
      {
        // userMasterId: localStorage.getItem("userMasterId"),
        schemeId,
        subSchemeId,
        applicationFormIds,
      },
      {
        responseType: "blob",
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (error) {
    // console.error("Error generating bonus report", error);
  }
};

const generateReportForSilkIncentive = async (records) => {
  try {
    const applicationFormIds = records.map(row => row.scApplicationFormId);

    const schemeId = records[0]?.schemeId;
    const subSchemeId = records[0]?.subSchemeId;
    
    const response = await api.post(
      baseURLReport + `sanction-silk-incentive`,
      {
        // userMasterId: localStorage.getItem("userMasterId"),
        schemeId,
        subSchemeId,
        applicationFormIds,
      },
      {
        responseType: "blob",
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (error) {
    // console.error("Error generating bonus report", error);
  }
};


const generateReportForBonusPM = async (records) => {
  try {
    const applicationFormIds = records.map(row => row.scApplicationFormId);

    const schemeId = records[0]?.schemeId;
    const subSchemeId = records[0]?.subSchemeId;

    const response = await api.post(
      baseURLReport + `get-BonusPM`,
      {
        // userMasterId: localStorage.getItem("userMasterId"),
        schemeId,
        subSchemeId,
        applicationFormIds,
      },
      {
        responseType: "blob",
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (error) {
    // console.error("Error generating bonus report", error);
  }
};


const generateAcknowledgmentBonusBV = async (records) => {
  try {
    const applicationFormIds = records.map(row => row.scApplicationFormId);

    const schemeId = records[0]?.schemeId;
    const subSchemeId = records[0]?.subSchemeId;

    const response = await api.post(
      baseURLReport + `get-Bonus`,
      {
        // userMasterId: localStorage.getItem("userMasterId"),
        schemeId,
        subSchemeId,
        applicationFormIds,
      },
      {
        responseType: "blob",
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (error) {
    // console.error("Error generating bonus report", error);
  }
};


const generateAcknowledgmentIncentivePM = async (records) => {
  try {
    const applicationFormIds = records.map(row => row.scApplicationFormId);

    const schemeId = records[0]?.schemeId;
    const subSchemeId = records[0]?.subSchemeId;

    const response = await api.post(
      baseURLReport + `get-Incentive`,
      {
        // userMasterId: localStorage.getItem("userMasterId"),
        schemeId,
        subSchemeId,
        applicationFormIds,
      },
      {
        responseType: "blob",
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (error) {
    // console.error("Error generating bonus report", error);
  }
};


const generateAcknowledgmentIncentiveBV = async (records) => {
  try {

    // ✅ Take ALL scApplicationFormId as LIST
    const applicationFormIds = records.map(
      record => record.scApplicationFormId
    );

    const schemeId = records[0]?.schemeId;
    const subSchemeId = records[0]?.subSchemeId;

    const response = await api.post(
      baseURLReport + `get-IncentiveBV`,
      {
        schemeId,
        subSchemeId,
        applicationFormIds
      },
      {
        responseType: "blob",
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);

  } catch (error) {
    console.error("Error generating Incentive BV report", error);
  }
};




 

//   const downloadFile = async () => {
//   try {
//     const response = await api.get(
//       baseURLDBT + "service/downLoadFile",
//       {
//         params: { fileName: securityKeyFromDB }, // ✅ Correct way
//         responseType: "arraybuffer",
//       }
//     );

//     const blob = new Blob([response.data], { type: "application/pdf" });
//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "Sanction_Order.pdf";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     window.URL.revokeObjectURL(url);
//   } catch (error) {
//     setValidationMessage(
//       "⚠️ Unable to download file. Please try again later."
//     );
//   }
// };
  

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

    <div
      style={{
        backgroundColor: "#f5f7fa",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Form
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h4 style={{ marginBottom: "25px", fontWeight: "600" }}>
          Sanction Order Download
        </h4>

        {/* ========================= */}
        {/* Validation Message Box */}
        {/* ========================= */}
        {validationMessage && (
          <div
            style={{
              background: "linear-gradient(90deg, #ff4d4f, #ff7875)",
              color: "white",
              padding: "20px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "20px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            {validationMessage}
          </div>
        )}

        {/* ========================= */}
        {/* Download Button */}
        {/* ========================= */}
        {/* <Button
            variant="primary"
            size="lg"
            disabled={!isValidUrl}
            onClick={downloadFile}   // ✅ No arrow function needed
            style={{
              width: "100%",
              padding: "10px",
              fontWeight: "600",
            }}
          >
            Download File
          </Button> */}
          <Button
          variant="primary"
          size="lg"
          disabled={!isValidUrl}
          onClick={handleDownloadClick}
          style={{
            width: "100%",
            padding: "10px",
            fontWeight: "600",
          }}
        >
          Download File
        </Button>
      </Form>
    </div>
  );
};

export default DownloadSanctionOrder;
