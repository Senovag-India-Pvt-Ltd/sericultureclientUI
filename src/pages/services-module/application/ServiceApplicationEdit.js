import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import ReactSelect from "react-select";
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
import {
  getFinancialYearMonths,
  getMonthPeriodByValue,
  parseMonthYear,
} from "../../../utilities/monthlyFrequency";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLRegistration = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLFarmerServer =
  process.env.REACT_APP_API_BASE_URL_REGISTRATION_FROM_FRUITS;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

// Inject shared, page-scoped SweetAlert styling once (same block used by
// ApplicationFormEdit.js and ServiceApplicationEdit.js — identical markup,
// reused via the same style-tag id so navigating between the two doesn't
// inject it twice).
if (typeof document !== "undefined" && !document.getElementById("svc-swal-styles")) {
  const s = document.createElement("style");
  s.id = "svc-swal-styles";
  s.innerHTML = `
    .svc-swal-container { backdrop-filter: blur(5px); background: rgba(15,23,42,.45) !important; }
    .svc-swal {
      border-radius: 22px !important; padding: 6px 4px 20px !important;
      background: linear-gradient(180deg,#ffffff 0%,#f8fafc 100%) !important;
      box-shadow: 0 30px 80px rgba(15,23,42,.28), 0 0 0 1px rgba(15,23,42,.04) !important;
      overflow: hidden !important; position: relative !important; max-width: 520px !important;
    }
    .svc-swal::before {
      content:""; position:absolute; top:0; left:0; right:0; height:6px;
      background: linear-gradient(90deg,#94a3b8,#64748b);
    }
    .svc-swal-error::before   { background: linear-gradient(90deg,#f87171,#dc2626,#9f1239) !important; }
    .svc-swal-success::before { background: linear-gradient(90deg,#34d399,#0ea5e9,#6366f1) !important; }
    .svc-swal-warning::before { background: linear-gradient(90deg,#fbbf24,#f97316,#dc2626) !important; }
    .svc-swal .swal2-title {
      font-size: 21px !important; font-weight: 800 !important; color: #0f172a !important;
      letter-spacing: -.01em !important; margin-top: 4px !important; padding: 0 20px !important;
    }
    .svc-swal .swal2-html-container {
      font-size: 13.5px !important; color: #475569 !important; line-height: 1.65 !important;
      margin: 10px 22px 4px !important; text-align: left !important;
    }
    .svc-swal .swal2-icon { border-width: 3px !important; margin: 20px auto 4px !important; }
    .svc-swal-error   .swal2-icon.swal2-error   { box-shadow: 0 0 0 8px rgba(239,68,68,.10); }
    .svc-swal-success .swal2-icon.swal2-success { box-shadow: 0 0 0 8px rgba(34,197,94,.12); }
    .svc-swal .swal2-styled {
      border-radius: 12px !important; padding: 10px 28px !important; font-weight: 700 !important;
      font-size: 13.5px !important; border: 0 !important;
      transition: transform .14s ease, box-shadow .14s ease, filter .14s !important;
    }
    .svc-swal .swal2-styled:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.05); }
    .svc-swal-error   .swal2-confirm { background: linear-gradient(135deg,#ef4444,#b91c1c) !important; box-shadow: 0 12px 26px rgba(220,38,38,.30) !important; }
    .svc-swal-success .swal2-confirm { background: linear-gradient(135deg,#0ea5e9,#22d3ee) !important; box-shadow: 0 12px 26px rgba(14,165,233,.30) !important; }
    /* Multi-error lists render as <br>-joined text — style them like a clean list */
    .svc-swal-errlist { text-align: left; }
    .svc-swal-errlist .svc-swal-errline {
      display: flex; gap: 8px; align-items: flex-start; padding: 7px 10px; margin: 5px 0;
      background: #fef2f2; border: 1px solid #fecaca; border-radius: 9px; color: #991b1b;
    }
    .svc-swal-errline::before { content: "⚠"; flex: 0 0 auto; }
  `;
  document.head.appendChild(s);
}

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

function ServiceApplicationEdit() {
  const { id } = useParams();
  // Translation
  const { t } = useTranslation();
  const [data, setData] = useState({
    with: "withLand",
    subinc: "subsidy",
    equordev: "land",
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    scHeadAccountId: "",
    scCategoryId: "",
    scSubSchemeType: "",
    scVendorId: "",
    farmerId: "",
    expectedAmount: "",
    financialYearMasterId: "",
    scComponentId: "",
    schemeAmount: "",
    sanctionNumber: "",
    spacingId: "",
    hectareId: "",
    periodFrom: "",
    periodTo: "",
    monthYear: "",
    userMasterId: "",
    approvalStageId: "",
  });

  // True when the selected sub scheme is configured with monthlyFrequency.
  const [isMonthlyFrequency, setIsMonthlyFrequency] = useState(false);

  const [developedLand, setDevelopedLand] = useState({
    dbtFarmerLandDetailsId: "",
    scApplicationFormId: "",
    farmerId: "",
    hissa: "",
    subsidyAvailed: "",
    surveyNumber: "",
    ownerName: "",
    surNoc: "",
    ownerNo: "",
    mainOwnerNo: "",
    acre: "",
    gunta: "",
    landCode: "",
    districtCode: "",
    talukCode: "",
    hobliCode: "",
    villageCode: "",
    fgunta: "",
  });

  const [equipment, setEquipment] = useState({
    unitType: "",
    description: "",
    price: "",
    vendorId: "",
    payToVendor: false,
  });

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

     
    
      const handleEditDocument = async (documentPath) => {
        await getDocumentFile(documentPath);
        handleShowModal();
      };

      const [currentDocumentPath, setCurrentDocumentPath] = useState(null);

      const handleDocumentClick = async (documentPath) => {
        setCurrentDocumentPath(documentPath);
        await getDocumentFile(documentPath);
      };
      
        // To get Photo from S3 Bucket
        const [selectedDocumentFile, setSelectedDocumentFile] = useState(null);
      
        const getDocumentFile = async (file) => {
          const parameters = `fileName=${file}`;
          try {
            const response = await api.get(
              baseURLDBT + `service/downLoadFile?${parameters}`,
              {
                responseType: "arraybuffer",
              }
            );
            const blob = new Blob([response.data]);
            const url = URL.createObjectURL(blob);
            setSelectedDocumentFile(url);
          } catch (error) {
            console.error("Error fetching file:", error);
          }
        };

        const downloadFile = async (file) => {
          const parameters = `fileName=${file}`;
          try {
            const response = await api.get(
              baseURLDBT + `service/downLoadFile?${parameters}`,
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

        const deleteFile = async (file) => {
          const parameters = `fileName=${file}`;
          try {
            const response = await api.delete(
              baseURLDBT + `service/delete?${parameters}`
            );
            if (response.status === 200) {
              console.log("File deleted successfully");
              // Optionally, you can refresh the file list or update the UI
            }
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        };

        const [schemeDetails, setSchemeDetails] = useState({});
const [schemeId, setSchemeId] = useState("");

// Get data from API
const getAreaDetailsList = () => {
  setLoading(true);
  api
    .get(`${baseURLMasterData}scSchemeDetails/get/${schemeId}`)
    .then((response) => {
      setSchemeDetails(response.data.content); // Store response data in state
      setLoading(false);
    })
    .catch((err) => {
      setLoading(false);
    });
};

useEffect(() => {
  if (schemeId) {
    getAreaDetailsList();
  }
}, [schemeId]);
        

  const [farmerDetails, setFarmerDetails] = useState({
    farmerName: "",
    hobli: "",
    village: "",
    talukName: "",
    fid: "",
  });

  const [farmerId, setFarmerId] = useState(0);

  const getIdList = () => {
  setLoading(true);
  api
    .get(baseURLDBT + `service/get-application-form-service-join/${id}`)
    .then((response) => {
      const datas = response.data.content;
      // A monthly-frequency month is stored as "APRIL 2026"; PSF ranges ("APRIL-MAY")
      // and other values fail to parse and are left blank.
      const monthYear = parseMonthYear(datas.month) ? datas.month : "";
      // Monthly-frequency records don't always have periodFrom/periodTo saved on their
      // own — the Month field is the source of truth for them. Re-derive the dates from
      // the saved month whenever the API didn't return them directly, so Period From/To
      // don't show blank on edit while Month is populated.
      const derivedPeriod = monthYear ? getMonthPeriodByValue(monthYear) : {};

      setData((prev) => ({
        ...prev,
        scSchemeDetailsId: datas.schemeId,
        scSubSchemeDetailsId: datas.subSchemeId,
        scComponentId: datas.componentId,
        scCategoryId: datas.categoryId,
        scHeadAccountId: datas.headOfAccountId,
        financialYearMasterId: datas.financialYearMasterId,
        schemeAmount: datas.schemeAmount,
        sanctionNumber: datas.sanctionNo,
        scSubSchemeType: datas.componentType,
        vendorId: datas.vendorId,
        description: datas.description,
        hectareId: datas.hectareId,
        spacingId: datas.spacingId,
        periodFrom: datas.periodFrom
          ? new Date(datas.periodFrom)
          : derivedPeriod.periodFrom || prev.periodFrom,
        periodTo: datas.periodTo
          ? new Date(datas.periodTo)
          : derivedPeriod.periodTo || prev.periodTo,
        monthYear,
        userMasterId: datas.userMasterId || "",
        approvalStageId: datas.approvalStageId || "",
      }));

      setFarmerId(datas.farmerId);

      // The beneficiary id (datas.farmerId) is a generic id shared by both
      // Farmer and Reeler tables — a farmer's id and a reeler's id are
      // independent sequences, so the same numeric value can validly exist
      // as a row in BOTH tables. Guessing "try reeler, fall back to farmer"
      // previously showed the wrong beneficiary whenever that coincidence
      // happened.
      //
      // datas.beneficiaryType ("Farmer"/"Reeler") is the application row's
      // own authoritative field — the same one the backend
      // (DBTController/ApplicationFormService/ApplicationTransactionService)
      // already trusts for Farmer/Reeler branching everywhere else in this
      // system — so resolve on that directly.
      const beneficiaryType = (datas.beneficiaryType || "").trim().toLowerCase();

      if (beneficiaryType === "reeler") {
        fetchReelerRelatedData(datas);
      } else if (beneficiaryType === "farmer") {
        fetchFarmerRelatedData(datas);
      } else {
        // beneficiaryType wasn't populated on this row — fall back to the
        // sub-scheme's sanctionForReeling flag (same source the create form
        // uses, see serviceApplication.js getIncentiveAndBonusList).
        api
          .get(
            baseURLMasterData +
              `scSubSchemeDetails/get-by-scheme-and-sub-scheme-details-id/${datas.schemeId}/${datas.subSchemeId}`
          )
          .then((subSchemeRes) => {
            const subSchemeList = subSchemeRes.data?.content?.scSubSchemeDetails;
            const sanctionForReeling = subSchemeList?.[0]?.sanctionForReeling === true;

            if (sanctionForReeling) {
              fetchReelerRelatedData(datas);
            } else {
              fetchFarmerRelatedData(datas);
            }
          })
          .catch((err) => {
            console.error("Error fetching sub-scheme beneficiary type:", err);
            fetchFarmerRelatedData(datas);
          });
      }

      // ✅ Always call handleView at the end
      handleView(id);
    })
    .catch((err) => {
      const message =
        err.response?.data?.errorMessages?.[0]?.message?.[0]?.message;
      console.error("Error fetching application form details:", message);
      setData({});
      setLoading(false);
    });
};

// datas.farmerId is a generic beneficiary id column shared by both the
// Farmer and Reeler tables (independent auto-increment sequences), so the
// exact same numeric value legitimately exists as an unrelated row in BOTH
// tables (confirmed in data: reeler_id 4281 = "B Santhosh", farmer_id 4281 =
// a completely different "GANGARAJU N"). Once datas.beneficiaryType has told
// us this row is a Reeler, falling back to a farmer lookup on ANY failure
// here would silently show that unrelated farmer instead — which is exactly
// the bug this function exists to prevent. So on failure we show a clear
// error and leave the fields blank, we never guess by querying the other
// table.
const showBeneficiaryLoadError = () => {
  Swal.fire({
    icon: "warning",
    title: "Could not load beneficiary details",
    text: "The FRUITS/registration lookup for this application's beneficiary failed. Please try again or contact support.",
  });
};

// 🔁 Helper function: fetch reeler details for reeler-beneficiary applications
// (datas.beneficiaryType === "Reeler" — see getIdList above).
//
// This reads directly off the LOCAL registration service's reeler/get/{id}
// (the exact same call ReelerLicenceEdit.js already uses to load the full
// reeler edit form from — reelerName/fatherName/gender/casteId/address/
// fruitsId/talukId all come back from it directly). We deliberately do NOT
// round-trip through reeler/get-reeler-details-by-fruits-id on the external
// FRUITS gateway (baseURLFarmerServer) the way the create form does — that
// call 403s from this environment, and failing it used to fall back to
// querying the farmer table with the same numeric id, which silently shows
// an unrelated farmer (see note above showBeneficiaryLoadError).
const fetchReelerRelatedData = (datas) => {
  api
    .get(baseURLRegistration + `reeler/get/${datas.farmerId}`)
    .then((reelerRes) => {
      const reeler = reelerRes.data?.content;

      if (!reeler || !reeler.reelerId) {
        console.error("Reeler lookup returned no data for reeler id", datas.farmerId);
        showBeneficiaryLoadError();
        setLoading(false);
        return;
      }

      setFarmerDetails({
        farmerName: reeler.reelerName || "",
        fid: reeler.fruitsId || "",
        talukName: "",
        village: reeler.address || "",
      });

      setData((prev) => ({
        ...prev,
        reelerId: reeler.reelerId,
        reelerName: reeler.reelerName,
        fatherName: reeler.fatherName,
        gender: reeler.gender,
        casteId: reeler.casteId,
        address: reeler.address || "",
      }));

      setValidated(false);
      setLoading(false);

      // talukId only — resolve the display name separately (best-effort;
      // the name/FRUITS ID fields above are already correct without this).
      if (reeler.talukId) {
        api
          .get(baseURLMasterData + `taluk/get/${reeler.talukId}`)
          .then((talukRes) => {
            const talukName = talukRes.data?.content?.talukName;
            if (talukName) {
              setFarmerDetails((prev) => ({ ...prev, talukName }));
            }
          })
          .catch((err) => {
            console.error("Error resolving reeler taluk name:", err);
          });
      }
    })
    .catch((err) => {
      console.error("Error fetching reeler by farmerId:", err);
      showBeneficiaryLoadError();
      setLoading(false);
    });
};

// 🔁 Helper function: fetch farmer details for farmer-beneficiary applications
const fetchFarmerRelatedData = (datas) => {
  // Farmer Address API
  api
    .get(
      baseURLRegistration + `farmer-address/get-by-farmer-id-join/${datas.farmerId}`
    )
    .then((response) => {
      if (response.data.errorCode !== -1 && response.data.content) {
        const addr = response.data.content.farmerAddress?.[0];
        if (addr) {
          setFarmerDetails((prev) => ({
            ...prev,
            village: addr.villageName,
            talukName: addr.talukName,
          }));
        }
      }
    })
    .catch(handleError);

  // Farmer Details API
  api
    .get(baseURLRegistration + `farmer/get-by-farmer-id-join/${datas.farmerId}`)
    .then((response) => {
      if (response.data.errorCode !== -1 && response.data.content) {
        setFarmerDetails((prev) => ({
          ...prev,
          farmerName: response.data.content.firstName,
          fid: response.data.content.fruitsId,
        }));
      }
    })
    .catch(handleError);

  // Land Details API — scoped to THIS application (route id is the
  // sc_application_form_service id here) rather than the farmer's full land
  // list, so each row's authoritative dbtFarmerLandDetailsId is recovered and a
  // save emits op=UPDATE against the correct row (no duplicate inserts / no
  // stale rows from the farmer's other applications).
  api
    .get(baseURLDBT + `dbt-farmer-land-details/get-by-application-form-id/${id}`)
    .then((response) => {
      if (response.data.errorCode !== -1 && response.data.content) {
        const landDetails = response.data.content.dbtFarmerLandDetails || [];
        setSavedLandDetailsList(landDetails);
      }
    })
    .catch(handleError)
    .finally(() => {
      setLoading(false);
    });
};

useEffect(() => {
  getIdList();
}, [id]);




  // const getIdList = () => {
  //   setLoading(true);
  //   const response = api
  //     .get(baseURLDBT + `service/get-application-form-service-join/${id}`)
  //     .then((response) => {
  //       const datas = response.data.content;
  //       setData((prev) => ({
  //         ...prev,
  //         scSchemeDetailsId: datas.schemeId,
  //         scSubSchemeDetailsId: datas.subSchemeId,
  //         scComponentId: datas.componentId,
  //         scCategoryId: datas.categoryId,
  //         scHeadAccountId: datas.headOfAccountId,
  //         financialYearMasterId: datas.financialYearMasterId,
  //         schemeAmount: datas.schemeAmount,
  //         sanctionNumber: datas.sanctionNo,
  //         scSubSchemeType: datas.componentType,
  //         vendorId: datas.vendorId,
  //         description: datas.description,
  //         hectareId: datas.hectareId,
  //         spacingId: datas.spacingId,
  //         periodFrom: new Date("2024-04-01"),
  //         periodTo: new Date("2025-03-31"),
  //       }));

  //       setFarmerId(datas.farmerId);

  //       api
  //         .get(
  //           baseURLRegistration +
  //             `farmer-address/get-by-farmer-id-join/${datas.farmerId}`
  //         )
  //         .then((response) => {
  //           if (response.data.errorCode === -1) {
  //             saveError(response.data.message);
  //           } else {
  //             // console.log("Fruits ID",response.data.content.fruitsId);
  //             setFarmerDetails((prev) => ({
  //               ...prev,
  //               village:
  //                 response.data.content.farmerAddress &&
  //                 response.data.content.farmerAddress[0].villageName,
  //               talukName:
  //                 response.data.content.farmerAddress &&
  //                 response.data.content.farmerAddress[0].talukName,
  //             }));
  //             setValidated(false);
  //           }
  //         })
  //         .catch((err) => {
  //           handleError(err);
  //         });

  //       api
  //         .get(
  //           baseURLRegistration +
  //             `farmer/get-by-farmer-id-join/${datas.farmerId}`
  //         )
  //         .then((response) => {
  //           if (response.data.errorCode === -1) {
  //             saveError(response.data.message);
  //           } else {
  //             setFarmerDetails((prev) => ({
  //               ...prev,
  //               farmerName: response.data.content.firstName,
  //               fid: response.data.content.fruitsId,
  //             }));
  //             setValidated(false);
  //           }
  //         })
  //         .catch((err) => {
  //           handleError(err);
  //         });

  //       api
  //         .get(
  //           baseURLDBT +
  //             `dbt-farmer-land-details/get-by-farmer-id/${datas.farmerId}`
  //         )
  //         .then((response) => {
  //           if (response.data.errorCode === -1) {
  //             saveError(response.data.message);
  //           } else {
  //             const landDetails =
  //               response.data.content.dbtFarmerLandDetails || [];
  //             console.log("Fetched land details:", landDetails);
  //             setSavedLandDetailsList(landDetails);
  //           }
  //           setLoading(false);
  //         })
  //         .catch((err) => {
  //           handleError(err);
  //           setLoading(false);
  //         });

  //      // Call handleView with applicationFormId
  //     handleView(id); // Ensure applicationFormId exists in datas
      
  //     setLoading(false);
  //   })
  //     .catch((err) => {
  //       const message = err.response.data.errorMessages[0].message[0].message;
  //       setData({});
  //       setLoading(false);
  //     }); 
  // };

  // useEffect(() => {
  //   getIdList();
  // }, [id]);

  const getDirectData = () => {
    api
      .post(baseURLFarmerServer + `farmer/get-details-by-fruits-id`, {
        fruitsId: farmerDetails.fid,
      })
      .then((response) => {
        console.log("landdetails", response.data);
        if (response.data.content.farmerLandDetailsDTOList.length > 0) {
          setLandDetailsList(response.data.content.farmerLandDetailsDTOList);
        }
      })
      .catch((err) => {
        setLandDetailsList([]);
      });
  };

  useEffect(() => {
    getDirectData();
  }, [farmerDetails.fid]);

  const handleError = (err) => {
    if (
      err.response &&
      err.response.data &&
      err.response.data.validationErrors
    ) {
      if (Object.keys(err.response.data.validationErrors).length > 0) {
        saveError(err.response.data.validationErrors);
      }
    }
  };

  const [savedLandDetailsList, setSavedLandDetailsList] = useState([]);
 

  console.log("changes", data);

  const handleRemoveImage = (documentId) => {
    const updatedDocument = { ...documentAttachments };
    delete updatedDocument[documentId];
    setDocumentAttachments(updatedDocument);
    document.getElementById(`attImage${documentId}`).value = "";
    // setData((prev) => ({ ...prev, hdAttachFiles: "" }));
  };

  // console.log(documentAttachments);

  // const handleAttachFileUpload = async (documentId) => {
  //   const param = {
  //     applicationFormId: id,
  //     documentTypeId: documentId,
  //   };
  
  //   try {
  //     const formData = new FormData();
  //     formData.append("multipartFile", documentAttachments[documentId]);
  
  //     const response = await api.post(
  //       baseURLDBT + `service/uploadDocument`,
  //       formData,
  //       {
  //         params: param,
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  
  //     console.log("File upload response:", response.data);
  
     
  // Swal.fire({
  //   icon: "success",
  //   title: "File uploaded successfully",
  // });
 
  // setUploadStatus((prevStatus) => ({
  //   ...prevStatus,
  //   [documentId]: true, // Mark this document as uploaded
  // }));
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Error uploading file. Please try again.",
  //     });
  //   }
  // };

  const [uploadDocuments, setUploadDocuments] = useState({
    applicationFormId: "",
    documentTypeId: "",
    documentPath: "",
  });
  const handleDocumentInputs = (e) => {
    let { name, value } = e.target;
    // setUploadDocuments({ ...uploadDocuments, [name]: value });
    setUploadDocuments(prev=>({...prev,  [name]: value }));
  };

  //Display Document
   const [document, setDocument] = useState("");

   const handleDocumentChange = (e) => {
     const file = e.target.files[0];
     setDocument(file);
     setUploadDocuments((prev) => ({ ...prev, documentPath: file.name }));
    //  setPhotoFile(file);
   };

  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const handleAttachFileUpload = async (documentId) => {
    const param = {
      applicationFormId: id,
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
      (list) => list.documentMasterId === documentId
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
const[applicationFormId ,setApplicationFormId] = useState ("");

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = (applicationFormId) => {
    // Check if the applicationFormId is valid
    if (applicationFormId) {
      setApplicationId(applicationFormId);  // Set applicationId if passed from the button click
    }
    setShowModal(true);  // Open the modal
  };
  
  
  
  // const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCheckBox = (e) => {
    setEquipment((prev) => ({
      ...prev,
      payToVendor: e.target.checked,
    }));
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  console.log("hehehehehe", data);

  const [isDisabled, setIsDisabled] = useState(true);

  const [landDetailsList, setLandDetailsList] = useState([]);

  const [landDetailsIds, setLandDetailsIds] = useState([]);

  const [developedArea, setDevelopedArea] = useState([]);

  // Saved Land Details rows come from DbtFarmerLandDetails which stores only
  // location *codes* (districtCode, talukCode, …) — no names. The FRUITS
  // land data in landDetailsList has the names. Join on landCode so the saved
  // table can render District/Taluk/Hobli/Village.
  const enrichedSavedLandDetailsList = useMemo(() => {
    const saved = Array.isArray(savedLandDetailsList) ? savedLandDetailsList : [];
    const profile = Array.isArray(landDetailsList) ? landDetailsList : [];
    if (saved.length === 0 || profile.length === 0) return saved;
    const byLandCode = new Map();
    profile.forEach((p) => {
      if (p && p.landCode != null) byLandCode.set(String(p.landCode), p);
    });
    return saved.map((s) => {
      const match = s && s.landCode != null
        ? byLandCode.get(String(s.landCode))
        : null;
      if (!match) return s;
      return {
        ...s,
        districtName: s.districtName || match.districtName,
        talukName: s.talukName || match.talukName,
        hobliName: s.hobliName || match.hobliName,
        villageName: s.villageName || match.villageName,
      };
    });
  }, [savedLandDetailsList, landDetailsList]);

  // Pre-fill developedArea + landDetailsIds from previously-saved land details
  // once on load. Restores user's prior selections and devAcre/devGunta/devFGunta
  // values, AND stashes the existing dbtFarmerLandDetailsId per entry so
  // postData can emit op:"UPDATE" reliably. Match strategy: landCode →
  // farmerLandDetailsId → surveyNumber+ownerName fallback, because FRUITS does
  // not expose landCode on farmerLandDetailsDTOList rows. Without this, every
  // edit emitted op:"NEW" and silently inserted duplicate DbtFarmerLandDetails
  // rows — the "land details is not updating" bug from rejection-list /
  // drawing-officer edit.
  const prefilledLandRef = useRef(false);
  useEffect(() => {
    if (prefilledLandRef.current) return;
    const saved = Array.isArray(savedLandDetailsList) ? savedLandDetailsList : [];
    const profile = Array.isArray(landDetailsList) ? landDetailsList : [];
    if (saved.length === 0 || profile.length === 0) return;

    const matchProfileIndex = (savedRow) => {
      return profile.findIndex((p) => {
        if (!p) return false;
        if (savedRow.landCode != null && p.landCode != null
            && String(savedRow.landCode) === String(p.landCode)) return true;
        if (savedRow.farmerLandDetailsId != null && p.farmerLandDetailsId != null
            && String(savedRow.farmerLandDetailsId) === String(p.farmerLandDetailsId)) return true;
        if (savedRow.surveyNumber != null && p.surveyNumber != null
            && String(savedRow.surveyNumber) === String(p.surveyNumber)
            && String(savedRow.ownerName || "") === String(p.ownerName || "")) return true;
        return false;
      });
    };

    const nextIds = [];
    const nextDeveloped = {};
    saved.forEach((s) => {
      const idx = matchProfileIndex(s);
      if (idx < 0) return;
      nextIds.push(idx);
      nextDeveloped[idx] = {
        ...profile[idx],
        devAcre: s.devAcre != null ? String(s.devAcre) : "0",
        devGunta: s.devGunta != null ? String(s.devGunta) : "0",
        devFGunta: s.devFGunta != null ? String(s.devFGunta) : "0",
        _dbtFarmerLandDetailsId: s.dbtFarmerLandDetailsId,
      };
    });

    if (nextIds.length > 0) {
      setLandDetailsIds(nextIds);
      setDevelopedArea(nextDeveloped);
    }
    prefilledLandRef.current = true;
  }, [savedLandDetailsList, landDetailsList]);

  // const handleCheckboxChange = (farmerLandDetailsId) => {
  //   setLandDetailsIds((prevIds) => {
  //     const isAlreadySelected = prevIds.includes(farmerLandDetailsId);
  //     const newIds = isAlreadySelected
  //       ? prevIds.filter((id) => id !== farmerLandDetailsId)
  //       : [...prevIds, farmerLandDetailsId];

  //     setDevelopedArea((prevData) => {
  //       if (isAlreadySelected) {
  //         const { [farmerLandDetailsId]: _, ...rest } = prevData;
  //         return rest;
  //       } else {
  //         // If selected, add to developedArea
  //         return {
  //           ...prevData,
  //           [farmerLandDetailsId]: {
  //             acre: prevData[farmerLandDetailsId]?.acre || "0",
  //             gunta: prevData[farmerLandDetailsId]?.gunta || "0",
  //             fgunta: prevData[farmerLandDetailsId]?.fgunta || "0",
  //           },
  //         };
  //       }
  //     });

  //     return newIds;
  //   });
  // };

  const handleCheckboxChange = (farmerLandDetailsId, selectedData) => {
    setLandDetailsIds((prevIds) => {
      const isAlreadySelected = prevIds.includes(farmerLandDetailsId);
      // Multi-select: keep previously checked rows and add/remove this one.
      const newIds = isAlreadySelected
        ? prevIds.filter((id) => id !== farmerLandDetailsId)
        : [...prevIds, farmerLandDetailsId];

      setDevelopedArea((prevData) => {
        if (isAlreadySelected) {
          const { [farmerLandDetailsId]: _, ...rest } = prevData;
          return rest;
        }
        // Preserve existing entries; add the newly selected row.
        return {
          ...prevData,
          [farmerLandDetailsId]: {
            ...selectedData,
            devAcre: prevData[farmerLandDetailsId]?.devAcre || "0",
            devGunta: prevData[farmerLandDetailsId]?.devGunta || "0",
            devFGunta: prevData[farmerLandDetailsId]?.devFGunta || "0",
          },
        };
      });

      return newIds;
    });
  };

   // to get scheme-Quota-details
   const [spacingListData, setSpacingDetailsListData] = useState(
    []
  );

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
  const [hectareListData, setHectareListData] = useState(
    []
  );

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

  // to get Financial Year
  const [financialyearListData, setFinancialyearListData] = useState([]);

  const getFinancialList = () => {
    const response = api
      .get(baseURLMasterData + `financialYearMaster/get-all`)
      .then((response) => {
        setFinancialyearListData(response.data.content.financialYearMaster);
      })
      .catch((err) => {
        setFinancialyearListData([]);
      });
  };

  useEffect(() => {
    getFinancialList();
  }, []);

  // V2 edit: User Master dropdown (required-editable per edit spec)
  const [userListData, setUserListData] = useState([]);
  const getUserList = () => {
    api
      .get(baseURLMasterData + `userMaster/get-all`)
      .then((response) => {
        setUserListData(response.data.content.userMaster || []);
      })
      .catch(() => setUserListData([]));
  };
  useEffect(() => {
    getUserList();
  }, []);

  // FY → period derivation is handled by the existing useEffect below
  // (uses the getFinancialYearPeriod helper). Don't duplicate.

  useEffect(() => {
    if (!data.financialYearMasterId
        || !Array.isArray(financialyearListData)
        || financialyearListData.length === 0) return;
    const selectedFY = financialyearListData.find(
      (f) => String(f.financialYearMasterId) === String(data.financialYearMasterId)
    );
    if (!selectedFY) return;
    // For monthly-frequency schemes (or records already carrying a saved month) the
    // period follows the selected month, not the full financial year — leave it to the
    // month handler / loaded value so we don't clobber the loaded per-month dates.
    if (isMonthlyFrequency || parseMonthYear(data.monthYear)) return;
    const { periodFrom, periodTo } = getFinancialYearPeriod(selectedFY.financialYear);
    setData((prev) => ({ ...prev, periodFrom, periodTo }));
  }, [data.financialYearMasterId, financialyearListData, isMonthlyFrequency, data.monthYear]);

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
      getSchemeQuotaList(data.scSchemeDetailsId);
    }
  }, [data.scSchemeDetailsId]);

  // Fetch the sub scheme's monthlyFrequency flag (same master-data source the
  // create form uses) once both scheme and sub scheme are known.
  useEffect(() => {
    if (data.scSchemeDetailsId && data.scSubSchemeDetailsId) {
      api
        .get(
          baseURLMasterData +
            `scSubSchemeDetails/get-by-scheme-and-sub-scheme-details-id/${data.scSchemeDetailsId}/${data.scSubSchemeDetailsId}`
        )
        .then((response) => {
          const list = response.data?.content?.scSubSchemeDetails;
          setIsMonthlyFrequency(list?.[0]?.monthlyFrequency === true);
        })
        .catch(() => setIsMonthlyFrequency(false));
    } else {
      setIsMonthlyFrequency(false);
    }
  }, [data.scSchemeDetailsId, data.scSubSchemeDetailsId]);

  // const getSubSchemeList = () => {
  //   const response = api
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

  // viewDetailsData feeds a <DataTable data={viewDetailsData}>. The setter
  // below replaces it with content.documentsResponses (an array), so the
  // initial shape MUST also be an array — initialising as an object caused
  // DataTable to crash with "undefined.map" when documentsResponses was
  // missing for an application.
  const [viewDetailsData, setViewDetailsData] = useState([]);

  const handleView = (_id) => {
    api
      .post(baseURLDBT + `service/viewServiceApplicationDetails`, {
        applicationFormId: _id,
      })
      .then((response) => {
        const content = response.data?.content?.[0];
        if (content) {
          setViewDetailsData(content.documentsResponses || []);
        }
      })
      .catch((err) => {
        // Handle error if needed
      });
  };
  
  // Default-FY auto-fill removed on the edit page: it raced with
  // getIdList() and overwrote the saved Financial Year with the current
  // default (e.g. saved 2023-2024 got replaced by default 2025-2026 on the
  // form after reload). The FY for an existing application must come from
  // the loaded record, not from the master-data default.

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
  const getHeadAccountList = () => {
    api
      .get(baseURLMasterData + `scHeadAccount/get-all`)
      .then((response) => {
        if (response.data.content.scHeadAccount) {
          setScHeadAccountListData(response.data.content.scHeadAccount);
        }
      })
      .catch((err) => {
        setScHeadAccountListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getHeadAccountList();
  }, []);

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

  // to get approval stage
  const [approvalStageListData, setApprovalStageListData] = useState([]);

  const getApprovalStageList = () => {
    api
      .get(baseURLMasterData + `scApprovalStage/get-all`)
      .then((response) => {
        if (response.data.content.scApprovalStage) {
          setApprovalStageListData(response.data.content.scApprovalStage);
        }
      })
      .catch((err) => {
        setApprovalStageListData([]);
      });
  };

  useEffect(() => {
    getApprovalStageList();
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

  // to get uploadable documents
  // const [docListData, setDocListData] = useState([]);

  // const getDocList = () => {
  //   api
  //     .post(baseURLDBT + `service/getApplicableDocumentList`)
  //     .then((response) => {
  //       setDocListData(response.data.content);
  //     })
  //     .catch((err) => {
  //       setDocListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getDocList();
  // }, []);

  // to get scheme-Quota-details
  const [schemeQuotaDetailsListData, setSchemeQuotaDetailsListData] = useState(
    []
  );

  const getSchemeQuotaList = (_id) => {
    api
      .get(baseURLMasterData + `schemeQuota/get-by-sc-scheme-details-id/${_id}`)
      .then((response) => {
        setSchemeQuotaDetailsListData(response.data.content.schemeQuota);
      })
      .catch((err) => {
        setSchemeQuotaDetailsListData([]);
      });
  };

  // to get component
  const [scComponentListData, setScComponentListData] = useState([]);

  // const getComponentList = () => {
  //   api
  //     .get(baseURLMasterData + `scComponent/get-all`)
  //     .then((response) => {
  //       setScComponentListData(response.data.content.scComponent);
  //     })
  //     .catch((err) => {
  //       setScComponentListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getComponentList();
  // }, []);

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

  const getHeadAccountbyschemeIdAndSubSchemeIdList = (
    schemeId,
    subSchemeId
  ) => {
    api
      .post(baseURLDBT + `master/cost/get-hoa-by-schemeId-and-subSchemeId`, {
        schemeId: schemeId,
        subSchemeId: subSchemeId,
      })
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
    if (data.scSchemeDetailsId && data.scSubSchemeDetailsId) {
      getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
      getHeadAccountbyschemeIdAndSubSchemeIdList(
        data.scSchemeDetailsId,
        data.scSubSchemeDetailsId
      );
    }
  }, [data.scSchemeDetailsId, data.scSubSchemeDetailsId]);

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

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    if (name === "financialYearMasterId") {
      const selectedFY = financialyearListData.find(
        (f) => String(f.financialYearMasterId) === String(value)
      );
      const { periodFrom, periodTo } = getFinancialYearPeriod(
        selectedFY?.financialYear
      );
      // Changing the financial year invalidates any selected month (FY-specific list).
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
      setSchemeId(value);  // Trigger fetching scheme details
    }
  };

  // Monthly Frequency: selecting a month auto-populates Period From / Period To.
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

  // Show the Month field when the sub scheme is configured monthly OR the record
  // already has a saved month-year (e.g. "APRIL 2026") — the latter guarantees the
  // field appears for already-saved monthly applications even before / regardless of
  // the config fetch resolving.
  const showMonthField = isMonthlyFrequency || !!parseMonthYear(data.monthYear);

  const handleDevelopedLandInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setDevelopedLand({ ...developedLand, [name]: value });
  };

  const handleEquipmentInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setEquipment({ ...equipment, [name]: value });
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

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    }
    event.preventDefault();

    // Monthly Frequency: Month is mandatory for monthly-frequency sub schemes.
    if (showMonthField && !data.monthYear) {
      Swal.fire({
        icon: "warning",
        title: "Month Required",
        text: "Please select a Month.",
      });
      return;
    }

    // Equipment line-item flow is NOT part of the V2 edit endpoint contract,
    // so route it through the legacy service endpoint.
    if (data.equordev === "equipment") {
      const legacyPayload = {
        id,
        farmerId,
        headOfAccountId: data.scHeadAccountId,
        schemeId: data.scSchemeDetailsId,
        subSchemeId: data.scSubSchemeDetailsId,
        componentType: data.scSubSchemeType,
        schemeAmount: data.schemeAmount,
        sanctionNo: data.sanctionNumber,
        categoryId: data.scCategoryId,
        componentId: data.scComponentId,
        approvalStageId: data.approvalStageId || null,
        financialYearMasterId: data.financialYearMasterId,
        vendorId: equipment.vendorId,
        spacingId: data.spacingId,
        hectareId: data.hectareId,
        description: equipment.description,
        periodFrom: formatDate(data.periodFrom),
        periodTo: formatDate(data.periodTo),
        month: data.monthYear || null,
        applicationFormLineItemRequestList: [
          {
            unitTypeMasterId: equipment.unitType,
            lineItemComment: equipment.description,
            cost: equipment.price,
            vendorId: equipment.vendorId,
          },
        ],
      };
      api
        .post(baseURLDBT + `service/editServiceApplicationForm`, legacyPayload)
        .then((response) => {
          if (response.data.errorCode === -1) {
            saveError(response.data.errorMessages[0]);
          } else if (response.data && response.data.error) {
            saveError(response.data.error_description);
          } else {
            saveSuccess();
            setApplicationId(response.data.content.applicationDocumentId);
            clear();
            getIdList();
            setValidated(false);
          }
        })
        .catch((err) => {
          if (err.response?.data?.validationErrors) {
            saveError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
      return;
    }

    // Land flow goes through the V2 endpoint for SERVICE applications.
    // Backend updates ONLY sc_application_form_service + DbtFarmerLandDetails.
    // op is decided from the `_dbtFarmerLandDetailsId` stashed at prefill time
    // (UPDATE when present, NEW otherwise). The previous match-by-landCode
    // path never matched because FRUITS doesn't expose landCode on its rows,
    // so every save silently duplicated DbtFarmerLandDetails inserts instead
    // of updating existing rows.
    const landRows = Object.keys(developedArea).map((key) => {
      const row = developedArea[key] || {};
      const savedId = row._dbtFarmerLandDetailsId;
      const op = savedId ? "UPDATE" : "NEW";
      return {
        op,
        dbtFarmerLandDetailsId: savedId || null,
        farmerId: farmerId ? Number(farmerId) : null,
        hissa: row.hissa,
        subsidyAvailed: row.subsidyAvailed,
        surveyNumber: row.surveyNumber,
        ownerName: row.ownerName,
        surNoc: row.surNoc,
        ownerNo: row.ownerNo,
        mainOwnerNo: row.mainOwnerNo,
        acre: row.acre,
        gunta: row.gunta,
        fGunta: row.fgunta != null ? row.fgunta : row.fGunta,
        landCode: row.landCode,
        districtCode: row.districtCode,
        talukCode: row.talukCode,
        hobliCode: row.hobliCode,
        villageCode: row.villageCode,
        devAcre: row.devAcre,
        devGunta: row.devGunta,
        devFGunta: row.devFGunta,
      };
    });

    // Coerce IDs to numbers and dates to ISO strings so backend Jackson
    // deserialises cleanly — string-encoded numbers were silently failing
    // for some fields and leaving Financial Year / period unchanged.
    const toNum = (v) => (v === "" || v == null ? null : Number(v));
    const v2Payload = {
      id: id ? parseInt(id, 10) : null,
      farmerId,
      financialYearMasterId: toNum(data.financialYearMasterId),
      schemeId: toNum(data.scSchemeDetailsId),
      subSchemeId: toNum(data.scSubSchemeDetailsId),
      componentType: toNum(data.scSubSchemeType),
      componentId: toNum(data.scComponentId),
      categoryId: toNum(data.scCategoryId),
      headOfAccountId: toNum(data.scHeadAccountId),
      approvalStageId: toNum(data.approvalStageId),
      userMasterId: toNum(data.userMasterId),
      schemeAmount: toNum(data.schemeAmount),
      sanctionNo: toNum(data.sanctionNumber),
      vendorId: toNum(equipment.vendorId),
      description: equipment.description || null,
      hectareId: toNum(data.hectareId),
      spacingId: toNum(data.spacingId),
      periodFrom: data.periodFrom ? formatDate(data.periodFrom) : null,
      periodTo: data.periodTo ? formatDate(data.periodTo) : null,
      month: data.monthYear || null,
      landRows,
    };

    api
      .post(baseURLDBT + `service/edit-service-application-form/${id}`, v2Payload)
      .then((response) => {
        // Reject HTML responses (e.g. production WAF returning a block page
        // with a 200/2xx status) — those have no .content and would silently
        // be treated as success otherwise.
        const isHtml = typeof response.data === "string"
          && /<html/i.test(response.data);
        if (isHtml || !response.data || typeof response.data !== "object") {
          saveError("Update was blocked by the server (received non-JSON response). Please contact support.");
          return;
        }
        const body = response.data.content;
        if (body && body.error) {
          saveError(body.errorDescription || "Update failed");
          return;
        }
        saveSuccess();
        setValidated(false);
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          saveError(
            err.response.data?.content?.errorDescription ||
              "Application has already been pushed and cannot be edited"
          );
        } else if (err.response?.data?.content?.errorDescription) {
          saveError(err.response.data.content.errorDescription);
        } else if (err.response?.data?.validationErrors) {
          saveError(err.response.data.validationErrors);
        } else {
          saveError("Update failed");
        }
      });
    setValidated(true);
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

  // const clear = () => {
  //   setData({
  //   with: "withLand",
  //   subinc: "subsidy",
  //   equordev: "land",
  //   scSchemeDetailsId: "",
  //   scSubSchemeDetailsId: "",
  //   scHeadAccountId: "",
  //   scCategoryId: "",
  //   scSubSchemeType: "",
  //   scVendorId: "",
  //   farmerId: "",
  //   expectedAmount: "",
  //   financialYearMasterId: "",
  //   scComponentId: "",
  //   schemeAmount: "",
  //   sanctionNumber: "",
  //   });
  //   setDevelopedLand({
  //     landDeveloped: "",
  //     unitType: "",
  //   });
  //   setEquipment({
  //     unitType: "",
  //     description: "",
  //     price: "",
  //     vendorId: "",
  //     payToVendor: false,
  //   });
  //   setDocumentAttachments({});
  //   setSavedLandDetailsList([]);
  //   setLandDetailsList([]);
  //   setDevelopedArea([]);
  //   setLandDetailsIds([]);
  //   getIdList();
  //   getDirectData();
  // };

  const clear = () => {
    // Resetting all data and states
    setData({
      with: "withLand",
      subinc: "subsidy",
      equordev: "land",
      scSchemeDetailsId: "",
      scSubSchemeDetailsId: "",
      scHeadAccountId: "",
      scCategoryId: "",
      scSubSchemeType: "",
      scVendorId: "",
      farmerId: "",
      expectedAmount: "",
      financialYearMasterId: "",
      scComponentId: "",
      schemeAmount: "",
      sanctionNumber: "",
      spacingId: "",
      hectareId: "",
      vendorId: "",
      description: ""
    });
  
    // Clear developed land details
    setDevelopedLand({
      landDeveloped: "",
      unitType: "",
    });
  
    // Clear equipment-related fields
    setEquipment({
      unitType: "",
      description: "",
      price: "",
      vendorId: "",
      payToVendor: false,
    });
  
    // Clear document attachments
    setDocumentAttachments({});
  
    // Clear saved and editable land details
    setSavedLandDetailsList([]);
    setLandDetailsList([]);
  
    // Clear developed area data
    setDevelopedArea([]);
  
    // Clear land detail IDs
    setLandDetailsIds([]);
  
    // Fetch new IDs and other related data again after clearing
    getIdList();
    getDirectData();
  };
  

  const saveSuccess = () => {
    // Reload the window once the user dismisses the success popup so the
    // form re-fetches every field (Financial Year, periodFrom, periodTo,
    // dropdowns, land details) from the freshly-saved DB state. Avoids the
    // flicker-then-stale-value issue caused by clear() + getIdList() racing
    // against the open Swal.
    Swal.fire({
      icon: "success",
      title: "Updated Successfully",
      customClass: { container: "svc-swal-container", popup: "svc-swal svc-swal-success" },
    }).then(() => {
      window.location.reload();
    });
  };

  const [uploadStatus, setUploadStatus] = useState({});

  const [applicationId, setApplicationId] = useState("");

  
  const saveError = (message) => {
    let lines;
    if (typeof message === "object") {
      lines = Object.values(message);
    } else {
      lines = String(message || "").split(/;\s*|<br\s*\/?>/i).filter(Boolean);
    }
    if (lines.length === 0) lines = ["Something went wrong. Please try again."];
    const html =
      `<div class="svc-swal-errlist">` +
      lines.map((l) => `<div class="svc-swal-errline">${l}</div>`).join("") +
      `</div>`;
    Swal.fire({
      icon: "error",
      title: "Attempt was not successful",
      html,
      customClass: { container: "svc-swal-container", popup: "svc-swal svc-swal-error" },
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

  const search = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setSearchValidated(true);
    } else {
      event.preventDefault();
      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }
      api
        .post(baseURLRegistration + `farmer/get-farmer-details`, {
          fruitsId: data.fruitsId,
        })
        .then((response) => {
          console.log(response);
          if (!response.data.content.error) {
            if (response.data.content.farmerResponse) {
              setData((prev) => ({
                ...prev,
                farmerId: response.data.content.farmerResponse.farmerId,
              }));
            }
            if (response.data.content.farmerLandDetailsDTOList.length > 0) {
              setLandDetailsList(
                response.data.content.farmerLandDetailsDTOList
              );
            }
            if (response.data.content.farmerAddressDTOList.length > 0) {
              setLandData((prev) => ({
                ...prev,
                talukId:
                  response.data.content.farmerAddressDTOList[0].talukId || 0,
              }));
            }
          } else {
            saveError(response.data.content.error_description);
          }
        })
        .catch((err) => {
          if (
            err.response &&
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
  };

  // const handleInlineDevelopedLandChange = (e, row) => {
  //   const { name, value } = e.target;
  //   const farmerLandDetailsId = row.farmerLandDetailsId;

  const handleInlineDevelopedLandChange = (e, row,i) => {
    const { name, value } = e.target;
    const farmerLandDetailsId =i;

    setDevelopedArea((prevData) => ({
      ...prevData,
      [farmerLandDetailsId]: {
        ...prevData[farmerLandDetailsId],
        [name]: value,
      },
    }));
  };

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
  
  


  const LandDetailsForDevColumns = [
    {
      // name: "Select",
      // selector: "select",
      // cell: (row) => (
      //   <input
      //     type="checkbox"
      //     name="selectedLand"
      //     value={row.farmerLandDetailsId}
      //     checked={landDetailsIds.includes(row.farmerLandDetailsId)}
      //     onChange={() => handleCheckboxChange(row.farmerLandDetailsId)}
      //   />
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
      cell: (row) => <span>{row.gunta}</span>,
      sortable: true,
      hide: "md",
    },

  //   {
  //     name: "Developed Area (Acre/Gunta/FGunta)",
  //     // selector: (row) => row.acre,
  //     cell: (row) => (
  //       <>
  //         <Form.Control
  //           name="acre"
  //           type="text"
  //           value={developedArea[row.farmerLandDetailsId]?.acre || ""}
  //           onChange={(e) => handleInlineDevelopedLandChange(e, row)}
  //           placeholder="Acre"
  //           className="m-1"
  //         />
  //         <Form.Control
  //           name="gunta"
  //           type="text"
  //           value={developedArea[row.farmerLandDetailsId]?.gunta || ""}
  //           onChange={(e) => handleInlineDevelopedLandChange(e, row)}
  //           placeholder="Gunta"
  //           className="m-1"
  //         />
  //         <Form.Control
  //           name="fgunta"
  //           type="text"
  //           value={developedArea[row.farmerLandDetailsId]?.fgunta || ""}
  //           onChange={(e) => handleInlineDevelopedLandChange(e, row)}
  //           placeholder="FGunta"
  //           className="m-1"
  //         />
  //       </>
  //     ),
  //     // cell: (row) => <span>{row.acre}</span>,
  //     sortable: true,
  //     hide: "md",
  //     grow: 3,
  //   },
  // ];
  {
    name: "Developed Area (Acre/Gunta/FGunta)",
    // selector: (row) => row.acre,
    cell: (row, i) => (
      <>
        <Form.Control
          name="devAcre"
          type="text"
          value={developedArea[i]?.devAcre || ""}
          onChange={(e) => handleInlineDevelopedLandChange(e, row, i)}
          placeholder="Acre"
          className="m-1"
        />
        <Form.Control
          name="devGunta"
          type="text"
          value={developedArea[i]?.devGunta || ""}
          onChange={(e) => handleInlineDevelopedLandChange(e, row, i)}
          placeholder="Gunta"
          className="m-1"
        />
        <Form.Control
          name="devFGunta"
          type="text"
          value={developedArea[i]?.devFGunta || ""}
          onChange={(e) => handleInlineDevelopedLandChange(e, row, i)}
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

  const LandDetailsColumns = [
    // {
    //   name: "Select",
    //   selector: "select",
    //   cell: (row) => (
    //     <input
    //       type="radio"
    //       name="selectedLand"
    //       value={row.farmerLandDetailsId}
    //       // checked={selectedLandId === row.id}
    //       onChange={() => handleRadioChange(row.farmerLandDetailsId)}
    //     />
    //   ),
    //   // ignoreRowClick: true,
    //   // allowOverflow: true,
    //   button: true,
    // },
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
      name:  t("owner_name"),
      selector: (row) => row.ownerName,
      cell: (row) => <span>{row.ownerName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name:  t("Acre"),
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
      name:t("FGunta"),
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
      name: "DevAcre",
      selector: (row) => row.devAcre,
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
      cell: (row) => <span>{row.devAcre}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "DevGunta",
      selector: (row) => row.devGunta,
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
      cell: (row) => <span>{row.devGunta}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "DevFGunta",
      selector: (row) => row.devFGunta,
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
      cell: (row) => <span>{row.devFGunta}</span>,
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

   useEffect(() => {
    getDocList();
  }, []);

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const deleteConfirm = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        const response = api
          .delete(baseURLDBT + `service/delete/${id}`)
          .then((response) => {
            // deleteConfirm(_id);
            handleView();
            Swal.fire(
              "Deleted",
              "You successfully deleted this record",
              "success"
            );
          })
          .catch((err) => {
            deleteError();
          });
        // Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
    });
  };

  const DocumentsUploaded = [
    
    {
      name: "Document Name",
      selector: (row) => row.documentName,  
      cell: (row) => <span>{row.documentName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Document Path",
      selector: (row) => row.documentPath,
      cell: (row) => <span>{row.documentPath}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Documents",
      selector: (row) => row.documentPath,
      cell: (row) => (
        <div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleDocumentClick(row.documentPath)}
          >
            {t("View Document")}
          </Button>
          {currentDocumentPath === row.documentPath && selectedDocumentFile && (
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
                onClick={() => downloadFile(row.documentPath)}
              >
                Download Selected File
              </Button>
            </>
          )}
        </div>
      ),
      sortable: false,
      hide: "md",
    },
        
    {
      name: t("Action"),
      // selector: (row) => row.documentPath,
      cell: (row) => (
        <div className="text-start w-100">
       
        <Button
          variant="danger"
          size="sm"
          onClick={() => deleteConfirm(row.id)}
          className="ms-2"
        >
          {t("delete")}
        </Button>
      </div>
    ),
    sortable: false,
    hide: "md",
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

  const serviceApplicationEditStyles = `
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
    html body .sh-form-wrap .form-label { font-size: 13px; font-weight: 600; color: #4a5568; margin-bottom: 6px; letter-spacing: 0.2px; }
    html body .sh-form-wrap .form-control, html body .sh-form-wrap .form-select {
      border-radius: 10px !important; border: 1.5px solid #d8e0ec !important; background-color: #fbfcfe !important;
      padding: 0.62rem 0.9rem !important; font-size: 13.5px; color: #2b3a55;
      transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
    }
    html body .sh-form-wrap .form-control:focus, html body .sh-form-wrap .form-select:focus {
      border-color: #2b7ac0 !important; background-color: #ffffff !important; box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important; outline: none;
    }
    html body .sh-form-wrap .btn-primary { border-radius: 8px; font-weight: 600; letter-spacing: 0.3px; transition: transform 0.15s ease, box-shadow 0.15s ease; }
    html body .sh-form-wrap .btn-primary:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(30, 103, 168, 0.25); }
    html body .sh-form-wrap .btn-success { font-weight: 600; }
    .sh-cancel-btn {
      background: #ffffff; color: #e3496a; border: 1.5px solid #e3496a; border-radius: 8px;
      transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
    }
    .sh-cancel-btn:hover:not(:disabled) {
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
    .sh-swal-confirm { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border-radius: 8px !important; font-weight: 600 !important; }
    .sh-swal-cancel { background: #ffffff !important; color: #c43257 !important; border: 1px solid #e3496a !important; border-radius: 8px !important; font-weight: 600 !important; }
  `;

  return (
    <Layout title=" Edit Scheme Details Form">
      <style>{serviceApplicationEditStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title"> {t("Edit Scheme Details Form")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/all-application-list"
                  className="btn btn-primary btn-md d-md-none sh-cta-btn"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Application Form List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/all-application-list"
                  className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Service Application List")}</span>
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
          <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="12">
                  {/* <Form.Group as={Row} className="form-group" controlId="fid">
                    <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                      Farmer Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={4}>
                      <Form.Control
                        type="fruitsId"
                        name="fruitsId"
                        value={data.fruitsId}
                        onChange={handleInputs}
                        placeholder="Enter FRUITS ID"
                        required
                        maxLength="16"
                      />
                      <Form.Control.Feedback type="invalid">
                        Fruits ID Should Contain 16 digits
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group> */}
                  <Row className="g-gs mt-1">
                    <Col lg="12">
                      <table className="table small table-bordered">
                        <tbody>
                          <tr>
                            <td style={styles.ctstyle}>{t("Name")}</td>
                            <td>{farmerDetails.farmerName}</td>
                            <td style={styles.ctstyle}> {t("FRUITS ID")}</td>
                            <td>{farmerDetails.fid}</td>
                            <td style={styles.ctstyle}>{t("taluk")}</td>
                            <td>{farmerDetails.talukName}</td>
                            <td style={styles.ctstyle}>{t("village")}</td>
                            <td>{farmerDetails.village}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>
        {/* <Card className="mt-1">
          <Card.Body>
            <Row lg="12" className="g-gs">
              <Col lg={6}>
                <Row>
                  <Col lg="2">
                    <Form.Group
                      as={Row}
                      className="form-group"
                      controlId="subsidy"
                    >
                      <Col sm={1}>
                        <Form.Check
                          type="radio"
                          name="subinc"
                          value="subsidy"
                          checked={data.subinc === "subsidy"}
                          onChange={handleInputs}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2" id="subsidy">
                        Subsidy
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col lg="3">
                    <Form.Group
                      as={Row}
                      className="form-group"
                      controlId="incentive"
                    >
                      <Col sm={1}>
                        <Form.Check
                          type="radio"
                          name="subinc"
                          value="incentive"
                          checked={data.subinc === "incentive"}
                          onChange={handleInputs}
                        />
                      </Col>
                      <Form.Label
                        column
                        sm={9}
                        className="mt-n2"
                        id="incentive"
                      >
                        Incentive
                      </Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col lg={6}>
                <Row>
                  <Col lg="3">
                    <Form.Group as={Row} className="form-group" controlId="crc">
                      <Col sm={1}>
                        <Form.Check
                          type="radio"
                          name="with"
                          value="withLand"
                          checked={data.with === "withLand"}
                          onChange={handleInputs}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2" id="crc">
                        With Land
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col lg="3" className="ms-n2">
                    <Form.Group as={Row} className="form-group" controlId="crc">
                      <Col sm={1}>
                        <Form.Check
                          type="radio"
                          name="with"
                          value="withOutLand"
                          checked={data.with === "withOutLand"}
                          onChange={handleInputs}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2" id="crc">
                        Without Land
                      </Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card> */}
      </Block>
      <Row>
        <Block className="sh-form-wrap">
          <Form noValidate validated={validated} onSubmit={postData}>
            <Row className="g-1 ">
              <Col lg={12}>
                <Block className="mt-3">
                  <Card>
                    <Card.Header className="sh-section-header">
                      {t("Scheme Details")}
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label>
                              {t("Financial Year")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="financialYearMasterId"
                                value={data.financialYearMasterId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.financialYearMasterId === undefined ||
                                  data.financialYearMasterId === "0"
                                }
                              >
                                <option value="">{t("Select Year")}</option>
                                {(financialyearListData || []).map((list) => (
                                  <option
                                    key={list.financialYearMasterId}
                                    value={list.financialYearMasterId}
                                  >
                                    {list.financialYear}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Financial Year is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
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
                                {scSchemeDetailsListData && scSchemeDetailsListData.length > 0 ? (
                                  (scSchemeDetailsListData || []).map((list) => (
                                  <option
                                    key={list.scSchemeDetailsId}
                                    value={list.scSchemeDetailsId}
                                  >
                                    {list.schemeName}
                                  </option>
                                ))
                              ) : (
                                <></> 
                              )} 
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Scheme is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                              {/* Conditionally Render Spacing Field */}
                    {/* {schemeDetails.spacing && ( */}
                    {(schemeDetails.calculationBasedOn === "PDMC" || schemeDetails.calculationBasedOn === "PMKSY") && (
                          <Col lg="6">
                            <Form.Group className="form-group">
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
                            <Form.Group className="form-group">
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
                          <Form.Group className="form-group">
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
                                {scSubSchemeDetailsListData && scSubSchemeDetailsListData.length > 0 ? (
                                  (scSubSchemeDetailsListData || []).map((list, i) => (
                                    <option key={i} value={list.subSchemeId}>
                                      {list.subSchemeName}
                                    </option>
                                  ))
                              ) : (
                                <></> 
                              )} 
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                              {t("Component Type is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                        {/* <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label>
                              Scheme Type
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scSubSchemeType"
                                value={data.scSubSchemeType}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scSubSchemeType === undefined ||
                                  data.scSubSchemeType === "0"
                                }
                              >
                                <option value="">Select Sub Scheme</option>
                                {(schemeQuotaDetailsListData || []).map((list) => (
                                  <option
                                    key={list.schemeQuotaId}
                                    value={list.schemeQuotaId}
                                  >
                                    {list.schemeQuotaName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Sub Scheme is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

                        <Col lg="6">
                          <Form.Group className="form-group">
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
                                {(scComponentListData || []).map((list) => (
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
                          <Form.Group className="form-group">
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
                                {(scCategoryListData || []).map((list) => (
                                  <option
                                    key={list.scCategoryId}
                                    value={list.scCategoryId}
                                  >
                                    {list.codeNumber}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                              {t("Sub Component is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                            {t("Approval Stage")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="approvalStageId"
                                value={data.approvalStageId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                              >
                                <option value="">{t("Select Approval Stage")}</option>
                                {(approvalStageListData || []).map((list) => (
                                  <option
                                    key={list.scApprovalStageId}
                                    value={list.scApprovalStageId}
                                  >
                                    {list.stageName}
                                  </option>
                                ))}
                              </Form.Select>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
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
                                {(scHeadAccountListData || []).map((list) => (
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
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="userMasterId">
                              {t("User Master")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <ReactSelect
                                options={(userListData || []).map((u) => ({
                                  value: u.userMasterId,
                                  label: `${u.username} (${u.userMasterId})`,
                                }))}
                                isSearchable
                                isClearable
                                placeholder={t("Search and select user")}
                                value={
                                  (userListData || [])
                                    .map((u) => ({
                                      value: u.userMasterId,
                                      label: `${u.username} (${u.userMasterId})`,
                                    }))
                                    .find(
                                      (opt) =>
                                        String(opt.value) === String(data.userMasterId)
                                    ) || null
                                }
                                onChange={(selectedOption) => {
                                  setData((prev) => ({
                                    ...prev,
                                    userMasterId: selectedOption?.value || "",
                                  }));
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sanctionAmount">
                              {t("Scheme Amount")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="schemeAmount"
                                type="text"
                                name="schemeAmount"
                                value={data.schemeAmount}
                                onChange={handleInputs}
                                placeholder={t("Enter Scheme Amount")}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                              {t("Scheme Amount is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        {/* <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="schemeAmount">
                              Scheme Amount
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="schemeAmount"
                                type="text"
                                name="schemeAmount"
                                value={data.schemeAmount}
                                onChange={handleInputs}
                                placeholder="Enter Scheme Amount"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Scheme Amount is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sanctionNumber">
                              Sanction Number
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="sanctionNumber"
                                type="text"
                                name="sanctionNumber"
                                value={data.sanctionNumber}
                                onChange={handleInputs}
                                placeholder="Enter Sanction Number"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Sanction Number is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

                        {showMonthField && (
                          <Col lg="2">
                            <Form.Group className="form-group">
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
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                              {t("From Date")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.periodFrom ? new Date(data.periodFrom) : null}
                                onChange={(date) =>
                                  handleDateChange(date, "periodFrom")
                                }
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                required
                                readOnly
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="2">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                              {t("To Date")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.periodTo ? new Date(data.periodTo):null}
                                onChange={(date) =>
                                  handleDateChange(date, "periodTo")
                                }
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                required
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

              <Block className="mt-3">
                <Card>
                  <Card.Header className="sh-section-header">
                    {t("Saved Land Details")}
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <DataTable
                        tableClassName="data-table-head-light table-responsive"
                        columns={LandDetailsColumns}
                        data={enrichedSavedLandDetailsList}
                        highlightOnHover
                        // pagination
                        // paginationServer
                        // paginationTotalRows={totalRows}
                        // paginationPerPage={countPerPage}
                        // paginationComponentOptions={{
                        //   noRowsPerPage: true,
                        // }}
                        // onChangePage={(page) => setPage(page - 1)}
                        progressPending={loading}
                        theme="solarized"
                        customStyles={customStyles}
                      />
                    </Row>
                  </Card.Body>
                </Card>
              </Block>

              {/* {data.equordev.includes("equipment") && ( */}
                {/* <Block className="mt-3">
                  <Card>
                    <Card.Header className="sh-section-header">
                      Equipment Purchase
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="4">
                          <Form.Group className="form-group">
                            <Form.Label>
                              Vendor Name
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="vendorId"
                                value={equipment.vendorId}
                                onChange={handleEquipmentInputs}
                                required
                                isInvalid={
                                  equipment.vendorId === undefined ||
                                  equipment.vendorId === "0"
                                }
                              >
                                <option value="">Select Vendor Name</option>
                                {(scVendorListData || []).map((list) => (
                                  <option
                                    key={list.scVendorId}
                                    value={list.scVendorId}
                                  >
                                    {list.name}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Vendor Name is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="4">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="description">
                              Description
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="description"
                                type="text"
                                name="description"
                                value={equipment.description}
                                onChange={handleEquipmentInputs}
                                placeholder="Enter Description"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Description is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Block> */}
              {/* )} */}
              {data.with === "withLand" && landDetailsList.length > 0 ? (
                <>
                  <Block className="mt-3">
                    <Card>
                      {/* <Card.Header className="sh-section-header">
                        RTC Details
                      </Card.Header> */}
                      <Card.Body>
                      <Card.Header className="sh-section-header">
                        {t("Edit Land Details")}
                      </Card.Header>
                        <Row>
                          <DataTable
                            tableClassName="data-table-head-light table-responsive"
                            columns={LandDetailsForDevColumns}
                            data={landDetailsList}
                            highlightOnHover
                            // pagination
                            // paginationServer
                            // paginationTotalRows={totalRows}
                            // paginationPerPage={countPerPage}
                            // paginationComponentOptions={{
                            //   noRowsPerPage: true,
                            // }}
                            // onChangePage={(page) => setPage(page - 1)}
                            progressPending={loading}
                            theme="solarized"
                            customStyles={customStyles}
                          />
                        </Row>
                      </Card.Body>

                      {/* <Row className="ms-1">
                        <Col lg="2">
                          <Form.Group
                            as={Row}
                            className="form-group"
                            controlId="land"
                          >
                            <Col sm={1}>
                              <Form.Check
                                type="radio"
                                name="equordev"
                                value="land"
                                checked={data.equordev === "land"}
                                onChange={handleInputs}
                              />
                            </Col>
                            <Form.Label
                              column
                              sm={9}
                              className="mt-n2"
                              id="land"
                            >
                              Developed Area
                            </Form.Label>
                          </Form.Group>
                        </Col>
                        <Col lg="2">
                          <Form.Group
                            as={Row}
                            className="form-group"
                            controlId="equip"
                          >
                            <Col sm={1}>
                              <Form.Check
                                type="radio"
                                name="equordev"
                                value="equipment"
                                checked={data.equordev === "equipment"}
                                onChange={handleInputs}
                              />
                            </Col>
                            <Form.Label
                              column
                              sm={9}
                              className="mt-n2"
                              id="equip"
                            >
                              Equipment Purchase
                            </Form.Label>
                          </Form.Group>
                        </Col>
                      </Row> */}
                    </Card>
                  </Block>

                  <Block className="mt-3">
                <Card>
                  <Card.Header className="sh-section-header">
                    {t("Documents")}
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <DataTable
                        tableClassName="data-table-head-light table-responsive"
                        columns={DocumentsUploaded}
                        data={Array.isArray(viewDetailsData) ? viewDetailsData : []}
                        highlightOnHover
                        // pagination
                        // paginationServer
                        // paginationTotalRows={totalRows}
                        // paginationPerPage={countPerPage}
                        // paginationComponentOptions={{
                        //   noRowsPerPage: true,
                        // }}
                        // onChangePage={(page) => setPage(page - 1)}
                        progressPending={loading}
                        theme="solarized"
                        customStyles={customStyles}
                      />
                    </Row>
                    <div className="gap-col">
                <ul className="d-flex align-items-center justify-content-center gap g-3">
                  <li>
                    {/* <Button type="button" variant="primary" onClick={postData}> */}
                    {/* <Button type="submit" variant="primary"onClick={handleShowModal}>
                      Upload Documents
                    </Button> */}
                    <Button
                    variant="secondary"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleShowModal(applicationId)}
                  >
                    {t("Upload Documents")}
                  </Button>
                  </li>
                  
                </ul>
              </div>
                  </Card.Body>
                </Card>
              </Block>
                </>
              ) : (
                ""
              )}

              <div className="gap-col">
                <ul className="d-flex align-items-center justify-content-center gap g-3">
                  <li>
                    {/* <Button type="button" variant="primary" onClick={postData}> */}
                    <Button type="submit" variant="primary">
                    {t("update")}
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

      <Modal show={showModal} onHide={handleCloseModal} size="xl" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>{t("Upload Documents")}</Modal.Title>
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
                <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label><strong>{t("Documents")}</strong></Form.Label>
                        <Form.Select
                          name="documentTypeId"
                          value={uploadDocuments.documentTypeId}
                          onChange={handleDocumentInputs}
                        >
                          <option value="">{t("Choose Document Type")}</option>
                          {(docListData || []).map((list) => (
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

                <Col lg="6">
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
              </Row>

              {/* {uploadedDocuments.length > 0 && (
    <div className="mt-3">
      <h5>Uploaded Documents</h5>
      <ul>
        {(uploadedDocuments || []).map((doc, index) => (
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
    <ul>
      {(uploadedDocuments || []).map((doc, index) => (
        <li key={index} className="d-flex align-items-center">
          {/* Show the image if it's available */}
          {doc.documentFile && (
            <img
              src={URL.createObjectURL(doc.documentFile)}
              alt={doc.documentName}
              style={{ height: "100px", width: "100px", marginRight: "10px" }}
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
            <div className="gap-col mt-1">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                {/* <Button type="submit" variant="success">
                  Upload Documents
                </Button> */}
                <Button
                type="button"
                variant="primary"
                onClick={() => handleAttachFileUpload(uploadDocuments.documentTypeId)}
                disabled={uploadStatus[uploadDocuments.documentTypeId]} // Disable button if this document is uploaded
              >
                {uploadStatus[uploadDocuments.documentTypeId] ? "Uploaded" : "Upload"}
              </Button>
                </li>
        </ul>
      </div>
        </Modal.Body>
      </Modal>

    

      {/* <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>File Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(docListData || []).map(({ documentId, documentName }) => (
            <div key={documentId}>
              <Row className="d-flex justify-content-center align-items-center">
                <Col lg="2">
                  <Form.Group className="form-group mt-1">
                    <Form.Label htmlFor="trUploadPath">
                      {documentName}
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="form-group mt-1">
                    <div className="form-control-wrap">
                      <Form.Control
                        type="file"
                        id={`attImage${documentId}`}
                       
                        onChange={(e) => handleAttachFileChange(e, documentId)}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4" style={{ position: "relative" }}>
                  <Form.Group className="form-group mt-3 d-flex justify-content-center">
                    {documentAttachments[documentId] && (
                      <div style={{ position: "relative" }}>
                        <img
                          style={{ height: "150px", width: "150px" }}
                          src={URL.createObjectURL(
                            documentAttachments[documentId]
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
                          onClick={() => handleRemoveImage(documentId)}
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
                    onClick={() => handleAttachFileUpload(documentId)}
                  >
                    Upload
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
        </Modal.Body>
      </Modal> */}
    </Layout>
  );
}

export default ServiceApplicationEdit;
