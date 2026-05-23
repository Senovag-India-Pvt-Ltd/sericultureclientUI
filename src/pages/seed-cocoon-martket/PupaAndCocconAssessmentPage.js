import React, { useState,useEffect } from "react";
import { Card, Form, Row, Col, Button, Table, Modal } from "react-bootstrap";
import Layout from "../../layout/default";
import { Link } from "react-router-dom";
import Block from "../../components/Block/Block";
import Icon from "../../components/Icon/Icon";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useTranslation } from 'react-i18next'; // Import useTranslation

const baseURL1 = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURLChawki = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function PupaAndCocoonAssessmentPage() {
  const { t } = useTranslation(); // Initialize useTranslation
  const [data, setData] = useState({
    marketAuctionId: "",
    testDate: new Date(),
    noOfCocoonTakenForExamination: "",
    noOfDflFromFc: "",
    diseaseFree: "",
    diseaseType: "",
    noOfCocoonPerKg: "",
    meltPercentage: "",
    pupaTestResult: "",
    cocoonAssessmentResult: "",
  });

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };


const [listData, setListData] = useState([]);
const [page, setPage] = useState(0);
const countPerPage = 5;
const [totalRows, setTotalRows] = useState(0);
const [loading, setLoading] = useState(false);
const [farmerDetails, setFarmerDetails] = useState({});
const _params = { params: { pageNumber: page, size: countPerPage } };

const [marketAuctionId, setMarketAuctionId] = useState("");
const getList = () => {
  setLoading(true);

  api
    .get(baseURL1 + `cocoon/getPupaCocoonAssessmentList`)
    .then((response) => {
      console.log(response.data);
      const farmerResponse = response.data[0];
      // const farmerData = response.data;
      setListData(response.data);
      
      // Assuming you're getting a list, pick the first item's marketAuctionId for demonstration.
      if (response.data.length > 0) {
        setMarketAuctionId(response.data[0].marketAuctionId); // Set the marketAuctionId
      }
      // setFitnessCertificate(farmerResponse);

      // farmerData.forEach(farmerPhoto=>{
      //   if(farmerPhoto.fitnessCertificatePath){
      //     getDocumentFile(farmerPhoto.fitnessCertificatePath);
      //   }
      // })

      getIdList(farmerResponse.farmerId);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
};

useEffect(() => {
    getList();
  }, []);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const [validated, setValidated] = useState(false);

  const postData = (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
    } else {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        api
            .post(baseURL1 + `cocoon/savePupaTestAndCocoonAssessmentResult`, {
                ...data,
                marketAuctionId: marketAuctionId, // Use the marketAuctionId from state
            })
            .then((response) => {
                // Destructure the response to get relevant fields
                const { errorCode, content } = response.data;

                // Access the nested errorCode and content from body
                const nestedErrorCode = content?.body?.errorCode; // Accessing the nested errorCode
                const nestedContent = content?.body?.content; // Accessing the nested content message

                // Check if the response indicates success
                if (nestedErrorCode === 0) {
                    // Success condition based on nested errorCode
                    saveSuccess();
                    handleCloseModalAssesment();
                    getList();
                    
                    // setData({
                    //     marketAuctionId: "",
                    //     testDate: "",
                    //     noOfCocoonTakenForExamination: "",
                    //     noOfDflFromFc: "",
                    //     diseaseFree: "",
                    //     diseaseType: "",
                    //     noOfCocoonPerKg: "",
                    //     meltPercentage: "",
                    //     pupaTestResult: "",
                    //     cocoonAssessmentResult: "",
                    // }); // Optionally reset the form
                } else if (nestedErrorCode === -1) {
                    // Handle the case when an assessment has already been done
                    if (nestedContent) {
                        saveError(nestedContent); // Use the nested content message for errors
                    } else {
                        saveError(); // Default error if no specific message
                    }
                } else {
                    // Handle unexpected error codes if necessary
                    saveError("Unexpected error occurred.");
                }
            })
            .catch((err) => {
                console.error(err);
                saveError(); // Handle the error if the API call fails
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }
};


  // Below for modal window for personal details
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // // Below for modal window for FC details
  // const [showModalFC, setShowModalFC] = useState(false);
  // const handleShowModalFC = () => setShowModalFC(true);
  // const handleCloseModalFC = () => setShowModalFC(false);
   // Below for modal window for FC details
   const [showModalFC, setShowModalFC] = useState(false);
   const handleShowModalFC = () => {
     // getDocumentFile()
  //    pathList.forEach(path =>{
  //      getDocumentFile(path);
  //  })
     setShowModalFC(true);
   }
  //  const handleCloseModalFC = () => setShowModalFC(false);

  const handleCloseModalFC = () => {
    // setSelectedDocumentFile([]);
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

  // Below for modal window for Initial Weighment
  const [showModalAssesment, setShowModalAssesment] = useState(false);
  // Keeps the row the user clicked "Assess Now" on so the modal header can
  // surface their FRUITS ID + name without re-querying the list.
  const [selectedAssessmentItem, setSelectedAssessmentItem] = useState(null);
  const handleCloseModalAssesment = () => setShowModalAssesment(false);

  const handleShowModalAssesment = (item) => {
    setMarketAuctionId(item.marketAuctionId); // Set marketAuctionId from the selected item
    setData(prevData => ({ ...prevData, marketAuctionId: item.marketAuctionId })); // Ensure data is set correctly
    setSelectedAssessmentItem(item);
    setShowModalAssesment(true);
  };

  // Double-click guard for "Proceed To Weighment" so a flapping click won't
  // submit the same row twice.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to open modals with specific farmer details
const openModalWithDetails = (item) => {
  setFarmerDetails(item); // Set the selected farmer's details
  handleShowModal(); // Open personal details modal
};

const openModalWithFCDetails = (item) => {
  setFarmerDetails(item); // Set the selected farmer's details
  handleShowModalFC(); // Open FC details modal
};

const openModalWithCropDetails = (item) => {
  setFarmerDetails(item); // Set the selected farmer's details
  handleShowModalCrop(); // Open Crop details modal
};

const openModalWithWeighmentDetails = (item) => {
  setFarmerDetails(item); // Set the selected farmer's details
  handleShowModalWeighment(); // Open Weighment details modal
};

const [prepareEggs, setPrepareEggs] = useState([]);
  const [pathList,setPathList] = useState([]);

  const getIdList = (farmerId) => {
    setLoading(true);
    api
      .get(`${baseURLChawki}cropInspection/getFitnessCertificatePath/${farmerId}`)
      .then((response) => {
        if (response.data.length > 0) {
          const dataResponse = response.data;
          setPrepareEggs(response.data); // Set to the entire array
          dataResponse.forEach((data)=>{
            if(data.fitnessCertificatePath){
              setPathList((prev)=>([...prev,data.fitnessCertificatePath]));
            }
        })
        } else {
          setPrepareEggs([]); // Handle empty response
        }
        // setLoading(false);
        // handleShowModal1();
      })
      .catch((err) => {
        console.error(err);
        setPrepareEggs([]);
        setLoading(false);
      });
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
      fontWeight: 700,
      color: '#0f766e',
      backgroundColor: '#f0fdfa',
      padding: '10px 14px',
      fontSize: '13px',
      width: '40%',
      borderLeft: '3px solid #14b8a6',
      letterSpacing: '0.02em',
    },
    valStyle: {
      padding: '10px 14px',
      fontSize: '13px',
      color: '#1a202c',
      fontWeight: 600,
      backgroundColor: '#ffffff',
    },
    table: {
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(15,118,110,.08)',
      width: '100%',
      tableLayout: 'fixed',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
    },
    // Shared modal-header gradient — all detail modals use this so they read as one family.
    modalHeader: {
      background: 'linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#5b57ac 100%)',
      color: '#fff',
      padding: '16px 24px',
      border: 'none',
      borderRadius: '8px 8px 0 0',
    },
    modalTitle: {
      color: '#fff',
      fontWeight: 800,
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    },
    modalBody: {
      padding: '22px 24px',
      background: 'linear-gradient(180deg,#ffffff,#f8fffe)',
    },
    headerPill: {
      background: 'rgba(255,255,255,.22)',
      borderRadius: '20px',
      padding: '4px 14px',
      fontSize: '12px',
      fontWeight: 700,
    },
  };

  // Renders the two farmer-identity pills (name + FRUITS ID) the detail modals all show.
  const FarmerHeaderBadges = ({ item }) => (
    <>
      {item?.firstName && (
        <span style={styles.headerPill}>👤 {item.firstName}</span>
      )}
      {item?.fruitsId && (
        <span style={styles.headerPill}>🆔 {item.fruitsId}</span>
      )}
    </>
  );

  const [isDiseaseFree, setIsDiseaseFree] = useState("no"); // Initial state is "no"

  // Function to handle the change of radio buttons
  // const handleRadioChange = (e) => {
  //   setIsDiseaseFree(e.target.value);
  // };
  const handleRadioChange = (e) => {
    const { name, value } = e.target; // Use value for radio buttons
    setData((prev) => ({
      ...prev,
      [name]: value, // Dynamically update the field based on the radio button's value
    }));
  };

  const [fitnessCertificate, setFitnessCertificate] = useState({});

   // To get Photo
  //  const [selectedDocumentFile, setSelectedDocumentFile] = useState([]);

  //  const getDocumentFile = async (file) => {
  //    const parameters = `fileName=${file}`;
  //    try {
  //      const response = await api.get(
  //        baseURLChawki + `v1/api/s3/download?${parameters}`,
  //        {
  //          responseType: "arraybuffer",
  //        }
  //      );
  //      const blob = new Blob([response.data]);
  //      const url = URL.createObjectURL(blob);
  //      setSelectedDocumentFile(prev=>([...prev,url]));
  //    } catch (error) {
  //      console.error("Error fetching file:", error);
  //    }
  //  };



  //  const downloadFile = async (file) => {
  //   console.log("file",file);
  //   const parameters = `fileName=${file}`;
  //   try {
  //     const response = await api.get(
  //       baseURLChawki + `v1/api/s3/download?${parameters}`,
  //       {
  //         responseType: "arraybuffer",
  //       }
  //     );
  //     const blob = new Blob([response.data]);
  //     const url = URL.createObjectURL(blob);

  //     const fileExtension = file.split(".").pop();

  //     const link = document.createElement("a");
  //     link.href = url;

  //     const modifiedFileName = file.replace(/_([^_]*)$/, ".$1");

  //     link.download = modifiedFileName;

  //     document.body.appendChild(link);
  //     link.click();

  //     document.body.removeChild(link);
  //   } catch (error) {
  //     console.error("Error fetching file:", error);
  //   }
  // };

  // Tracks which certificate IDs have an in-flight download so a flapping double-click
  // can't open two PDFs for the same certificate. Keyed by fitnessCertificateId, with
  // a synthetic "__nokey__" bucket for callers that don't pass an id.
  const [downloadingFcIds, setDownloadingFcIds] = useState(new Set());
  const isFcDownloading = (id) => downloadingFcIds.has(id ?? "__nokey__");

   const downloadFile = async (fitnessCertificateId, fruitsId) => {
    const key = fitnessCertificateId ?? "__nokey__";
    if (downloadingFcIds.has(key)) return;
    setDownloadingFcIds((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    try {
      const response = await api.post(
        baseURLReport + `getFitenessCertificate`,
        {
            fitnessCertificateId: fitnessCertificateId,
             fruitsId: fruitsId,
          },
          {
            responseType: "blob", //Force to receive data in a Blob Format
          }

      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      window.open(fileURL);

    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setDownloadingFcIds((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  

  // Function to display the success message
const saveSuccess = () => {
  Swal.fire({
    icon: "success",
    title: "Pupa Testing And Cocoon Assessment Completed  Successfully",
    text: "You Can Proceed To Allotment",
  }).then(() => {
      // navigate("#");
      window.location.reload();
    });
};

const saveError = (message = "Something went wrong!") => {
  Swal.fire({
    icon: "error",
    title: "Save attempt was not successful",
    text: message,
  });
};



  return (
    <Layout title={t("Pupa Testing And Cocoon Assessment")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Pupa Testing And Cocoon Assessment")}</Block.Title>
          </Block.HeadContent>
          <li>
                <Link
                  to="/seriui/final-weighment-page"
                  style={{
                    background: "linear-gradient(135deg,#1e67a8,#2d9cdb)",
                    color: "#fff", border: "none", borderRadius: "10px",
                    padding: "9px 22px", fontWeight: 700, fontSize: "13px",
                    boxShadow: "0 4px 12px rgba(30,103,168,.30)",
                    textDecoration: "none", display: "inline-flex",
                    alignItems: "center", gap: "8px", whiteSpace: "nowrap",
                  }}
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Final Weighment List")}</span>
                </Link>
              </li>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
      <Form
          noValidate
          validated={validated}
          onSubmit={postData}
          className="mt-2"
        >
        <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(30,103,168,.10)", overflow: "hidden" }}>
          {/* Gradient header strip — matches the rest of the cocoon-market screens. */}
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#5b57ac 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🔬</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>{t("Pupa Testing & Cocoon Assessment")}</div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>{t("Lots ready for pupa examination after final weighment")}</div>
            </div>
            <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "5px 14px", color: "#fff", fontSize: "12px", fontWeight: 700 }}>
              {listData.length} {listData.length === 1 ? t("lot") : t("lots")}
            </span>
          </div>
          <Card.Body style={{ padding: "16px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
            <div style={{ overflowX: "auto", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "1200px" }}>
                <thead>
                  <tr style={{
                    background: "linear-gradient(135deg,#0f766e,#14b8a6)",
                    color: "#fff", fontWeight: 700,
                  }}>
                    {[t("Action"), t("Sl.No"), t("Date Of Issuance Of Bidding Slip"), t("Bidding Slip Lot No"), t("FID"), t("Farmer Name"), t("Phone Number"), t("Address Details"), t("Crop Details"), t("FC Details"), t("Weighment Details")].map((h, i) => (
                      <th key={i} style={{ padding: "12px 10px", textAlign: "left", borderRight: "1px solid rgba(255,255,255,.18)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listData.length === 0 ? (
                    <tr>
                      <td colSpan={11} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                        {t("No records found")}
                      </td>
                    </tr>
                  ) : listData.map((item, index) => {
                    const alt = index % 2 === 1;
                    const cellSt = { padding: "10px 12px", borderBottom: "1px solid #e2e8f0", color: "#1a202c", whiteSpace: "nowrap", background: alt ? "#f8fafc" : "#ffffff" };
                    const linkSt = { display: "inline-flex", alignItems: "center", gap: "6px", color: "#1e67a8", fontWeight: 600, cursor: "pointer" };
                    return (
                      <tr key={index} style={{ transition: "background .12s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(.98)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}>
                        <td style={cellSt}>
                          <button
                            type="button"
                            onClick={() => handleShowModalAssesment(item)}
                            style={{
                              background: "linear-gradient(135deg,#1e67a8,#2d9cdb)",
                              border: "none", borderRadius: "8px", padding: "7px 16px",
                              fontWeight: 700, fontSize: "12px", color: "#fff",
                              cursor: "pointer", boxShadow: "0 3px 10px rgba(30,103,168,.30)",
                              display: "inline-flex", alignItems: "center", gap: "6px",
                            }}
                          >
                            🧪 {t("Assess Now")}
                          </button>
                        </td>
                        <td style={cellSt}>
                          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg,#475569,#1e293b)", color: "#fff", fontWeight: 700, fontSize: "11px" }}>{item.serialNumber}</span>
                        </td>
                        <td style={cellSt}>{item.marketAuctionDate}</td>
                        <td style={cellSt}>{item.allottedLotId}</td>
                        <td style={cellSt}><span style={{ fontFamily: "ui-monospace,monospace", color: "#0f766e", fontWeight: 700 }}>{item.fruitsId}</span></td>
                        <td style={cellSt}><span style={{ fontWeight: 700 }}>{item.firstName}</span></td>
                        <td style={cellSt}>{item.mobileNumber}</td>
                        <td style={cellSt}>
                          <span style={linkSt} onClick={() => openModalWithDetails(item)}>
                            <Icon name="info-fill" size="lg" /> {t("Personal Details")}
                          </span>
                        </td>
                        <td style={cellSt}>
                          <span style={linkSt} onClick={() => openModalWithCropDetails(item)}>
                            <Icon name="info-fill" size="lg" /> {t("Crop Details")}
                          </span>
                        </td>
                        <td style={cellSt}>
                          <span style={linkSt} onClick={() => openModalWithFCDetails(item)}>
                            <Icon name="info-fill" size="lg" /> {t("FC Details")}
                          </span>
                        </td>
                        <td style={cellSt}>
                          <span style={linkSt} onClick={() => openModalWithWeighmentDetails(item)}>
                            <Icon name="info-fill" size="lg" /> {t("Weighment Details")}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton closeVariant="white" style={styles.modalHeader}>
            <Modal.Title style={styles.modalTitle}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>👤 {t("Address & Personal Details")}</span>
              <FarmerHeaderBadges item={farmerDetails} />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={styles.modalBody}>
            <Row className="g-4">
              <Col lg="6">
                <div style={{ background: "#fff", borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(15,118,110,.06)" }}>
                  <div style={{ background: "linear-gradient(135deg,#0f766e,#14b8a6)", color: "#fff", padding: "8px 14px", fontWeight: 700, fontSize: "12px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    🧾 {t("Identity")}
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr><td style={styles.ctstyle}>{t("Farmer Number")}</td><td style={styles.valStyle}>{farmerDetails?.farmerNumber || '—'}</td></tr>
                      <tr><td style={styles.ctstyle}>{t("Farmer Name")}</td><td style={styles.valStyle}>{farmerDetails?.firstName || '—'}</td></tr>
                      <tr><td style={styles.ctstyle}>{t("Father's/Husband's Name")}</td><td style={styles.valStyle}>{farmerDetails?.fatherName || '—'}</td></tr>
                      <tr><td style={styles.ctstyle}>{t("Phone Number")}</td><td style={styles.valStyle}>{farmerDetails?.mobileNumber || '—'}</td></tr>
                    </tbody>
                  </table>
                </div>
              </Col>
              <Col lg="6">
                <div style={{ background: "#fff", borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(91,87,172,.06)" }}>
                  <div style={{ background: "linear-gradient(135deg,#4338ca,#6366f1)", color: "#fff", padding: "8px 14px", fontWeight: 700, fontSize: "12px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    📍 {t("Address")}
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr><td style={styles.ctstyle}>{t("TSC")}</td><td style={styles.valStyle}>{farmerDetails?.tscName || '—'}</td></tr>
                      <tr><td style={styles.ctstyle}>{t("State")}</td><td style={styles.valStyle}>{farmerDetails?.stateName || '—'}</td></tr>
                      <tr><td style={styles.ctstyle}>{t("District")}</td><td style={styles.valStyle}>{farmerDetails?.districtName || '—'}</td></tr>
                      <tr><td style={styles.ctstyle}>{t("Taluk")}</td><td style={styles.valStyle}>{farmerDetails?.talukName || '—'}</td></tr>
                      <tr><td style={styles.ctstyle}>{t("Village")}</td><td style={styles.valStyle}>{farmerDetails?.villageName || '—'}</td></tr>
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>

      {/* <Modal show={showModalFC} onHide={handleCloseModalFC} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("FC Details")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         
          <div className="d-flex flex-column justify-content-center">
      <tr>
      <td style={styles.ctstyle}>{t("Fitness Certificate")}:</td>
        <td>
        {
          selectedDocumentFile?.length > 0 && (
            
              selectedDocumentFile.map(file =>(
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
                // onClick={() => downloadFile(fitnessCertificate.fitnessCertificatePath)}
                onClick={() => downloadFile(pathList[0])}
              >
                {t("Download File")}
              </Button>
              </>
          ))
            
          )
        }
          
        </td>
      </tr>
    </div>
        </Modal.Body>
      </Modal> */}

      <Modal show={showModalFC} onHide={handleCloseModalFC} size="lg" centered>
        <Modal.Header closeButton closeVariant="white" style={styles.modalHeader}>
          <Modal.Title style={styles.modalTitle}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>📄 {t("Fitness Certificate Details")}</span>
            <FarmerHeaderBadges item={farmerDetails} />
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={styles.modalBody}>
          {(!prepareEggs || prepareEggs.length === 0) ? (
            <div style={{ padding: "30px 10px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
              {t("No Fitness Certificate data available")}
            </div>
          ) : (
            <Row className="g-3">
              {prepareEggs.map((data, index) => (
                <Col lg="12" key={index}>
                  {/* Each FC certificate gets its own bordered card with a small label strip,
                      the certificate thumbnail on the left, and a 2-column key/value grid
                      for the metadata on the right. */}
                  <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 10px rgba(15,118,110,.06)" }}>
                    <div style={{ background: "linear-gradient(135deg,#0f766e,#14b8a6)", color: "#fff", padding: "8px 14px", fontWeight: 700, fontSize: "12px", letterSpacing: "0.04em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span>📜 {t("Certificate")} #{index + 1}</span>
                      {data.lotNumberRsp && <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px" }}>{t("Lot")} {data.lotNumberRsp}</span>}
                    </div>
                    <div style={{ padding: "16px", display: "flex", gap: "18px", flexWrap: "wrap" }}>
                      <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "140px", height: "140px", borderRadius: "10px", border: "1.5px solid #cbd5e0", background: "#f8fafd", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          {data.previewUrl ? (
                            <img
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              src={data.previewUrl}
                              alt={`Fitness Certificate ${index + 1}`}
                            />
                          ) : (
                            <span style={{ color: "#a0aec0", fontSize: "12px" }}>{t("No image")}</span>
                          )}
                        </div>
                        {(() => {
                          const dl = isFcDownloading(data.fitnessCertificateId);
                          return (
                            <button
                              type="button"
                              disabled={dl}
                              onClick={() => downloadFile(data.fitnessCertificateId, data.fruitsId)}
                              style={{
                                background: dl ? "#94a3b8" : "linear-gradient(135deg,#1e67a8,#2d9cdb)",
                                border: "none", borderRadius: "8px", padding: "7px 16px",
                                fontWeight: 700, fontSize: "12px", color: "#fff",
                                cursor: dl ? "not-allowed" : "pointer",
                                boxShadow: dl ? "none" : "0 3px 10px rgba(30,103,168,.30)",
                                display: "inline-flex", alignItems: "center", gap: "6px",
                              }}
                            >
                              {dl ? (
                                <><span className="spinner-border spinner-border-sm" style={{ width: "12px", height: "12px", borderWidth: "2px" }} /> {t("Downloading…")}</>
                              ) : (
                                <>⬇️ {t("Download File")}</>
                              )}
                            </button>
                          );
                        })()}
                      </div>
                      <div style={{ flex: "1 1 280px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <tbody>
                            <tr><td style={styles.ctstyle}>{t("Parental Lot Number")}</td><td style={styles.valStyle}>{data.lotNumberRsp || '—'}</td></tr>
                            <tr><td style={styles.ctstyle}>{t("DFL Lot Number")}</td><td style={styles.valStyle}>{data.numbersOfDfls || '—'}</td></tr>
                            <tr><td style={styles.ctstyle}>{t("Lot Variety")}</td><td style={styles.valStyle}>{data.raceOfDfls || '—'}</td></tr>
                            <tr><td style={styles.ctstyle}>{t("Spun From Date")}</td><td style={styles.valStyle}>{data.spunFromDate || '—'}</td></tr>
                            <tr><td style={styles.ctstyle}>{t("Spun To Date")}</td><td style={styles.valStyle}>{data.spunToDate || '—'}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showModalCrop} onHide={handleCloseModalCrop} size="lg" centered>
        <Modal.Header closeButton closeVariant="white" style={styles.modalHeader}>
          <Modal.Title style={styles.modalTitle}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>🌿 {t("Crop Details")}</span>
            <FarmerHeaderBadges item={farmerDetails} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          <Row className="g-3">
            {/* KPI strip — three coloured cards summarising the crop at a glance, then a key/value table below. */}
            <Col md="4">
              <div style={{ background: "linear-gradient(135deg,#f0fdfa,#ccfbf1)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "14px 16px" }}>
                <div style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("No of DFL's")}</div>
                <div style={{ fontSize: "20px", color: "#134e4a", fontWeight: 800, marginTop: "4px" }}>{farmerDetails?.numbersOfDfls || '—'}</div>
              </div>
            </Col>
            <Col md="4">
              <div style={{ background: "linear-gradient(135deg,#eef2ff,#e0e7ff)", border: "1.5px solid #a5b4fc", borderRadius: "12px", padding: "14px 16px" }}>
                <div style={{ fontSize: "11px", color: "#4338ca", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Lot No.")}</div>
                <div style={{ fontSize: "20px", color: "#312e81", fontWeight: 800, marginTop: "4px" }}>{farmerDetails?.lotNumberRsp || '—'}</div>
              </div>
            </Col>
            <Col md="4">
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)", border: "1.5px solid #f59e0b", borderRadius: "12px", padding: "14px 16px" }}>
                <div style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Variety")}</div>
                <div style={{ fontSize: "20px", color: "#78350f", fontWeight: 800, marginTop: "4px" }}>{farmerDetails?.raceName || '—'}</div>
              </div>
            </Col>
            <Col lg="12">
              <div style={{ background: "#fff", borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(15,118,110,.06)" }}>
                <div style={{ background: "linear-gradient(135deg,#0f766e,#14b8a6)", color: "#fff", padding: "8px 14px", fontWeight: 700, fontSize: "12px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  📋 {t("Full Crop Details")}
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr><td style={styles.ctstyle}>{t("No of DFL's")}</td><td style={styles.valStyle}>{farmerDetails?.numbersOfDfls || '—'}</td></tr>
                    <tr><td style={styles.ctstyle}>{t("Lot No.")}</td><td style={styles.valStyle}>{farmerDetails?.lotNumberRsp || '—'}</td></tr>
                    <tr><td style={styles.ctstyle}>{t("Variety")}</td><td style={styles.valStyle}>{farmerDetails?.raceName || '—'}</td></tr>
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
      <Modal
        show={showModalWeighment}
        onHide={handleCloseModalWeighment}
        size="lg"
        centered
      >
        <Modal.Header closeButton closeVariant="white" style={styles.modalHeader}>
          <Modal.Title style={styles.modalTitle}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>⚖️ {t("Weighment Details")}</span>
            <FarmerHeaderBadges item={farmerDetails} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          <Row className="g-3 justify-content-center">
            <Col md="8" lg="6">
              {/* Big hero KPI card — Initial Weighment is the only field, so make it count. */}
              <div style={{
                background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 100%)",
                borderRadius: "14px",
                padding: "24px 22px",
                color: "#fff",
                boxShadow: "0 6px 20px rgba(15,118,110,.25)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", opacity: .9 }}>
                  ⚖️ {t("Initial Weighment")}
                </div>
                <div style={{ fontSize: "36px", fontWeight: 800, marginTop: "8px", letterSpacing: ".02em" }}>
                  {farmerDetails?.initialWeighment ? `${farmerDetails.initialWeighment}` : '—'}
                  {farmerDetails?.initialWeighment && (
                    <span style={{ fontSize: "16px", fontWeight: 700, marginLeft: "6px", opacity: .85 }}>{t("kg")}</span>
                  )}
                </div>
                {farmerDetails?.allottedLotId && (
                  <div style={{ marginTop: "12px", fontSize: "12px", opacity: .9 }}>
                    📦 {t("Lot")} #{farmerDetails.allottedLotId}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModalAssesment}
        onHide={handleCloseModalAssesment}
        size="lg"
        centered
      >
        <Modal.Header closeButton style={{ background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#5b57ac 100%)", border: "none", padding: "16px 24px", borderRadius: "8px 8px 0 0" }} closeVariant="white">
          <Modal.Title style={{ color: "#fff", fontWeight: 800, fontSize: "16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>🧪 {t("Pupa Test")}</span>
            {selectedAssessmentItem?.firstName && (
              <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 14px", fontSize: "12px", fontWeight: 700 }}>
                👤 {selectedAssessmentItem.firstName}
              </span>
            )}
            {selectedAssessmentItem?.fruitsId && (
              <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 14px", fontSize: "12px", fontWeight: 700 }}>
                🆔 {selectedAssessmentItem.fruitsId}
              </span>
            )}
            {selectedAssessmentItem?.allottedLotId && (
              <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 14px", fontSize: "12px", fontWeight: 700 }}>
                📦 {t("Lot")} #{selectedAssessmentItem.allottedLotId}
              </span>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px 24px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
          <Form
            noValidate
            validated={validatedInitialWeighment}
            onSubmit={handleinitialWeighment}
          >
            {/* Pupa Test fields section — visually grouped under a teal banner so the
                user can see Pupa Test vs Cocoon Assessment as two distinct stages. */}
            <Card className="mb-3" style={{ border: "none", borderRadius: "12px", boxShadow: "0 2px 12px rgba(15,118,110,.10)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#0f766e,#14b8a6)",
                color: "#fff", padding: "10px 16px",
                fontWeight: 800, fontSize: "13px", display: "flex", alignItems: "center", gap: "8px",
              }}>
                <span>🧪</span> {t("Pupa Test")}
              </div>
              <Card.Body style={{ padding: "16px" }}>
            <Row className="g-3">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="farmerFamilyName">
                  {t("No. of Cocoons Taken for Examination")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="farmerFamilyName"
                      name="noOfCocoonTakenForExamination"
                      value={data.noOfCocoonTakenForExamination}
                      onChange={handleInputs}
                      type="text"
                      placeholder={t("Enter No. of Cocoons Taken for Examination")}
                      required
                    />
                    {/* <Form.Control.Feedback type="invalid">
                      Name is required
                    </Form.Control.Feedback> */}
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="farmerFamilyName">
                  {t("No. of DFLs From the FC")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="noOfDflFromFc"
                      name="noOfDflFromFc"
                      value={data.noOfDflFromFc}
                      onChange={handleInputs}
                      type="text"
                      placeholder={t("Enter No. of DFL’s from FC")}
                      required
                    />
                    {/* <Form.Control.Feedback type="invalid">
                      Name is required
                    </Form.Control.Feedback> */}
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="farmerFamilyName">
                  {t("No. of Pupa Examined")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="pupaTestResult"
                      name="pupaTestResult"
                      value={data.pupaTestResult}
                      onChange={handleInputs}
                      type="text"
                      placeholder={t("Enter No. of Pupa Examined")}
                      required
                    />
                    {/* <Form.Control.Feedback type="invalid">
                      Name is required
                    </Form.Control.Feedback> */}
                  </div>
                </Form.Group>
              </Col>

              <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="sordfl">
                        {t("Test Date")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.testDate}
                            onChange={(date) =>
                              handleDateChange(date, "testDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            maxDate={new Date()}
                            // required
                          />
                        </div>
                      </Form.Group>
                    </Col>

              <Col lg="6">
              <Form.Group className="form-group mt-3">
                <Form.Label style={{ fontSize: "20px" }}>{t("Disease Free")}</Form.Label>
                <div className="form-control-wrap">
                  <Row className="d-flex align-items-center">
                    <Col lg="auto">
                      <Form.Check
                        type="radio"
                        id="yes"
                        name="diseaseFree"
                        label={t("Yes")}
                        value="true" // Set the value to "yes"
                        checked={data.diseaseFree === "true"} // Check if the value in state is "yes"
                        onChange={handleRadioChange} // Handle radio button change
                      />
                    </Col>
                    <Col lg="auto">
                      <Form.Check
                        type="radio"
                        id="no"
                        name="diseaseFree"
                        label={t("No")}
                        value="false" // Set the value to "no"
                        checked={data.diseaseFree === "false"} // Check if the value in state is "no"
                        onChange={handleRadioChange} // Handle radio button change
                      />
                    </Col>
                  </Row>
                </div>

                {/* Conditionally render the disease name input field if "Yes" is selected */}
                {data.diseaseFree === "false" && (
                  <Col lg="6">
                  <Form.Group className="mt-3">
                    <Form.Label>{t("Disease Type")}</Form.Label>
                    <Form.Control
                      id="diseaseType"
                      name="diseaseType"
                      value={data.diseaseType || ""}
                      onChange={handleInputs}
                      type="text"
                      placeholder={t("Enter Disease Type")}
                    />
                  </Form.Group>
                  </Col>
                )}
              </Form.Group>
            </Col>
            </Row>
              </Card.Body>
            </Card>

            {/* Cocoon Assessment section — indigo banner so it's visually distinct from
                the Pupa Test section above. */}
            <Card style={{ border: "none", borderRadius: "12px", boxShadow: "0 2px 12px rgba(91,87,172,.10)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#4338ca,#6366f1)",
                color: "#fff", padding: "10px 16px",
                fontWeight: 800, fontSize: "13px", display: "flex", alignItems: "center", gap: "8px",
              }}>
                <span>🐛</span> {t("Cocoon Assessment")}
              </div>
              <Card.Body style={{ padding: "16px" }}>
                <Row className="g-gs">
            <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="farmerFamilyName">
                  {t("No. of Cocoons per Kg")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="noOfCocoonPerKg"
                      name="noOfCocoonPerKg"
                      value={data.noOfCocoonPerKg}
                      onChange={handleInputs}
                      type="text"
                      placeholder={t("No. of Cocoons per Kg")}
                      // required
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="farmerFamilyName">
                  {t("Melt %")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="meltPercentage"
                      name="meltPercentage"
                      value={data.meltPercentage}
                      onChange={handleInputs}
                      type="text"
                      placeholder={t("Melt %")}
                      // required
                    />
                  </div>
                </Form.Group>
              </Col>
              </Row>
              </Card.Body>
              </Card>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "18px" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: isSubmitting ? "#c8d6e5" : "linear-gradient(135deg,#0f766e,#14b8a6)",
                  border: "none", borderRadius: "10px", padding: "11px 30px",
                  fontWeight: 700, fontSize: "14px", color: "#fff",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  boxShadow: isSubmitting ? "none" : "0 4px 14px rgba(15,118,110,.32)",
                  display: "inline-flex", alignItems: "center", gap: "8px",
                }}
              >
                {isSubmitting ? (
                  <><span className="spinner-border spinner-border-sm" /> {t("Submitting…")}</>
                ) : (
                  <>✅ {t("Proceed To Weighment")}</>
                )}
              </button>
              <button
                type="button"
                onClick={handleCloseModalAssesment}
                style={{
                  background: "#f1f5f9", border: "1.5px solid #d0d9e8", borderRadius: "10px",
                  padding: "11px 26px", fontWeight: 600, fontSize: "14px", color: "#4a5568", cursor: "pointer",
                }}
              >
                {t("Cancel")}
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      </Form>
      </Block>
    </Layout>
  );
}

export default PupaAndCocoonAssessmentPage;
