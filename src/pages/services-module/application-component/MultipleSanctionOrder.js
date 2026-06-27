import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Modal,
  Accordion,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useState, useRef } from "react";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import api from "../../../services/auth/api";
import { reference } from "@popperjs/core";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function MultipleSanctionOrder() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 35;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const [applicationDetails, setApplicationDetails] = useState([]);
  const [actionFarmerData, setActionFarmerData] = useState({});
  console.log("actionFarmerData", actionFarmerData);
  console.log("actionFarmerDatasasa", !!actionFarmerData[0]?.applicationFormId);

  const [data, setData] = useState({
    userMasterId: "",
    stepId: "",
    schemeId: "",
    subSchemeId: "",
    scComponentId: "",
    scCategoryId: "",
    tscId: "",
    machineTypeId: "",
    raceId: "",
  });

  let name, value;
  // const handleInputs = (e) => {
  //   // debugger;
  //   name = e.target.name;
  //   value = e.target.value;
  //   setData({ ...data, [name]: value });
  //   setIsRowSelectable(false);     // hide checkboxes again
  //   setSelectedRows([]);           // clear previous selections
  //   setIsSubmitEnabled(false);
  // };

 const isSanctionEnabledFromDB = async (subSchemeDetailsId) => {
  if (!subSchemeDetailsId) return false;

  try {
    const resp = await api.get(
      baseURLMasterData +
        `scSubSchemeDetails/is-sanction-enabled/${subSchemeDetailsId}`
    );
    return resp.data === true;
  } catch (err) {
    console.error("Sanction check failed", err);
    return false;
  }
};


  const handleActionInputs = (e) => {
  const { name, value } = e.target;

  setActionData({
    ...actionData,
    [name]: value,
  });

  // if (name === "approvalStageId") {
  //   getApprovalAfterStageNextStepList(data.subSchemeId, value);
  // }
};

//   const handleInputs = (e) => {
//   const { name, value } = e.target;
//   setData({ ...data, [name]: value });

//   // Reset table ONLY when filters changed
//   if (
//     name === "schemeId" ||
//     name === "subSchemeId" ||
//     name === "scComponentId" ||
//     name === "scCategoryId"
//   ) {
//     setIsRowSelectable(false);
//     setSelectedRows([]);
//     setIsSubmitEnabled(false);
//   }
// };
const [sanctionOrderForScheme, setSanctionOrderForScheme] = useState("");


const handleInputs = (e) => {
  const { name, value } = e.target;

  setData((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (name === "schemeId" || name === "subSchemeId") {
  setSanctionOrderForScheme("");
  setSubSchemeType(null);
}


  // Reset table when filters changed
  if (
    name === "schemeId" ||
    name === "subSchemeId" ||
    name === "scComponentId" ||
    name === "scCategoryId"
  ) {
    setIsRowSelectable(false);
    setSelectedRows([]);
    setIsSubmitEnabled(false);
  }

  // 👉 When Component is selected, pick sanctionOrderForScheme & subSchemeType
  if (name === "scComponentId") {
    const comp = scComponentListData.find(
      (item) => item.scComponentId == value
    );

    if (comp) {
      setSanctionOrderForScheme(comp.sanctionOrderForScheme || "");
      setSubSchemeType(comp.subSchemeType || null);
    } else {
      setSanctionOrderForScheme("");
      setSubSchemeType(null);
    }
  }
};



  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isRowSelectable, setIsRowSelectable] = useState(false);
  // initially disabled

  // Format JS Date → "YYYY-MM-DD"
const formatDate = (date) => {
  if (!date) return "";
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0")
  );
};

// Parse "YYYY-MM-DD" → JS Date (timezone safe)
const parseDate = (value) => {
  if (!value) return null;

  // If already a Date object → return as-is
  if (value instanceof Date) return value;

  // If value is not a string → return null (avoid crash)
  if (typeof value !== "string") return null;

  // If string is not in YYYY-MM-DD format → return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [y, m, d] = value.split("-");
  return new Date(y, m - 1, d);
};



// const handleDateForPropasalChange = (date, type) => {
//     const formattedDate =
//       date.getFullYear() +
//       "-" +
//       (date.getMonth() + 1).toString().padStart(2, "0") +
//       "-" +
//       date.getDate().toString().padStart(2, "0");
//     console.log("formattedDate", formattedDate);
//     setActionData((prev) => ({ ...prev, [type]: formattedDate }));

//     // checkSubmitEnabled();
//   };

const handleDateChange = (date, fieldName) => {
  const formatted = formatDate(date);
  console.log("Formatted:", formatted);
  setActionData((prev) => ({ ...prev, [fieldName]: formatted }));
};


const enableSanctionIfRequired = async () => {
  if (!data.subSchemeId) return;

  try {
    await api.post(
      baseURLMasterData + "scSubSchemeDetails/enable-sanction",
      {
        scSubSchemeDetailsId: data.subSchemeId,
      }
    );
  } catch (err) {
    console.log("Enable-sanction failed");
  }
};




  
  // // Search
  // const search = (e) => {
  //   e.preventDefault();
  //   setSelectedRows([]);
  //   setIsSubmitEnabled(false);
  //   setIsRowSelectable(false); // disallow selection first
  //   setListData([]); // reset table

  //   api
  //     .post(
  //       baseURLDBT + `service/multipleSanctionList`,
  //       {},
  //       {
  //         params: {
  //           userId: localStorage.getItem("userMasterId"),
  //           schemeId: data.schemeId,
  //           subSchemeId: data.subSchemeId,
  //           componentId : data.scComponentId,
  //           scCategoryId : data.scCategoryId,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       const result = response.data.content;
  //       setListData(result);
  //       //       setIsSubmitEnabled(true);
  //       //     //   setIsSubmitEnabled(result && result.length > 0); // Enable if rows exist
  //       //     })
  //       //     .catch((err) => {
  //       //       setListData([]);
  //       //       setIsSubmitEnabled(false); // Disable on error
  //       //     });
  //       // };

  //       // ✅ Update totalSchemeAmount
  //       // const total = result?.[0]?.totalSchemeAmount ?? 0;
  //       // setTotalSchemeAmount(total);

  //       // if (result && result.length > 0) {
  //       //   setIsRowSelectable(true); // allow selection
  //       // } else {
  //       //   setIsRowSelectable(false);
  //       // }
  //       const areAllFieldsSelected =
  //         data.schemeId > 0 &&
  //         data.subSchemeId > 0 &&
  //         data.scComponentId > 0 &&
  //         data.scCategoryId > 0;

  //       if (result && result.length > 0 && areAllFieldsSelected) {
  //         setIsRowSelectable(true);   // show checkboxes
  //       } else {
  //         setIsRowSelectable(false);  // hide checkboxes
  //       }
  //     })
  //     .catch((err) => {
  //       setListData([]);
  //       setIsRowSelectable(false);
  //       setIsSubmitEnabled(false);
  //       setTotalSchemeAmount(0);
  //     });
  // };

  const search = (e) => {
  e.preventDefault();

  const isMachineTypeRequired =
  sanctionOrderForScheme === "Silk Incentive-PSF";

  // 🔍 Validate all fields before calling API
  const areAllFieldsSelected =
    data.schemeId > 0 &&
    data.subSchemeId > 0 &&
    data.scComponentId > 0 &&
    data.scCategoryId > 0;

  if (!areAllFieldsSelected) {
    Swal.fire({
      icon: "warning",
      title: "Select All Fields",
      text: "Please select Scheme, Component Type, Component and Sub Component",
    });
    return;
  }

   // ⭐ ADD THIS BLOCK HERE
  if (isMachineTypeRequired && data.machineTypeId <= 0) {
    Swal.fire({
      icon: "warning",
      title: "Machine Type Required",
      text: "Please select Machine Type",
    });
    return;
  }

  if (isMachineTypeRequired && data.raceId <= 0) {
  Swal.fire({
    icon: "warning",
    title: "Race Required",
    text: "Please select Race",
  });
  return;
}


  // Reset
  setSelectedRows([]);
  setIsSubmitEnabled(false);
  setIsRowSelectable(false);
  setListData([]);

  api
    .post(
      baseURLDBT + `service/multipleSanctionList`,
      {},
      {
        params: {
          userId: localStorage.getItem("userMasterId"),
          schemeId: data.schemeId,
          subSchemeId: data.subSchemeId,
          componentId: data.scComponentId,
          scCategoryId: data.scCategoryId,
          // tscId: data.tscId || 0,
          tscId: data.tscId > 0 ? data.tscId : null,
          machineTypeId: data.machineTypeId > 0 ? data.machineTypeId : null,
          raceId: data.raceId > 0 ? data.raceId : null,

        },
      }
    )
    .then((response) => {
      const result = response.data.content;
      setListData(result);

      // update total amount
      const total = result?.[0]?.totalSchemeAmount ?? 0;
      setTotalSchemeAmount(total);

      // 🔍 Enable checkbox only when:
      // 1. All fields selected
      // 2. API returned data
      if (result && result.length > 0 && areAllFieldsSelected) {
        setIsRowSelectable(true);
        const approvalStageId = result[0]?.approvalStageId;
        const subSchemeId = result[0]?.subSchemeId;

        // ⭐ CALL NEXT STEP API NOW
        if (approvalStageId && subSchemeId) {
          getApprovalAfterStageNextStepList(subSchemeId, approvalStageId);
        }
      } else {
        setIsRowSelectable(false);

        Swal.fire({
          icon: "info",
          title: "No Records Found",
          text: "No data available for the selected filters",
        });
      }
    })
    .catch((err) => {
      setListData([]);
      setIsRowSelectable(false);
      setIsSubmitEnabled(false);
      setTotalSchemeAmount(0);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while fetching data",
      });
    });
};



const [isProposalFocused, setIsProposalFocused] = useState(false);
const [isDrawingOfficerFocused, setIsDrawingOfficerFocused] = useState(false);



  // const handleRowSelection = ({ selectedRows }) => {
  //   setSelectedRows(selectedRows);
  //   setIsSubmitEnabled(selectedRows.length > 0 && listData.length > 0);

  //   if (selectedRows.length > 0) {
  //   const firstRow = selectedRows[0];
  //   setSchemeId(firstRow.schemeId);
  //   setSubSchemeId(firstRow.subSchemeId);
  //   setSubSchemeType(firstRow.subSchemeType); // <- Make sure you have this state
  // }
  // };
  const [selectedTotalSchemeAmount, setSelectedTotalSchemeAmount] = useState(0);


  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);

  // const handleShowModal = () => setShowModal(true);
 const handleShowModal = (appId) => {
  setApplicationFormId(appId);   // ✅ IMPORTANT FIX
  setShowModal(true);
};


  const [showModal1, setShowModal1] = useState(false);

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const [showModal3, setShowModal3] = useState(false);

  const [applicationFormId, setApplicationFormId] = useState(null);

  const [componentType, setComponentType] = useState(null);

  const [schemeId, setSchemeId] = useState(null);

  const [subSchemeId, setSubSchemeId] = useState(null);

  const [componentId, setComponentId] = useState(null);

  const [scCategoryId, setCategoryId] = useState(null);

  const [workOrderSchemeId, setWorkOrderSchemeId] = useState(null);

  const [userId, setId] = useState(localStorage.getItem("userMasterId"));

  const [districtId, setDistrictId] = useState(null);
  const [talukId, setTalukId] = useState(null);
  const [designationId, setDesignationId] = useState(null);
  const [userFromDistrictData, setUserFromDistrictData] = useState([]);

  const [actionData, setActionData] = useState({
    applicationFormId: "",
    workOrderNumber: "",
    sanctionOrderNumber: "",
    sanctionAmount: "",
    lat: "",
    lon: "",
    description: "",
    rejectedReasonId: "",
    userId: "",
    stepId: "",
    rejectType: "",
    eligibleAmount: "",
    sanctionNo: "",
    rejectReasonWorkflowMasterId: "",
    comment: "",
    proposalDate: new Date(),
    releaseNo: "",
    releaseDate: new Date(),
  });

  //  to get data from api
  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURLMasterData + `userMaster/get-join/${userId}`)
      .then((response) => {
        setDistrictId(response.data.content.districtId);
        setTalukId(response.data.content.talukId);
        setDesignationId(response.data.content.designationId);
        getMultipleSanctionOrderList(
          response.data.content.districtId,
          response.data.content.talukId
        );
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
    //  getList();
  }, []);

  

  const [
      approvalStageAfterNextStepListData,
      setApprovalStageAfterNextStepListData,
    ] = useState([]);

    const getApprovalAfterStageNextStepList = (subSchemeId, approvalStageId) => {
      api
        .post(
          baseURLDBT +
            `service/getNextStepDetailsAfterSubmitBySubSchemeIdAndApprovalStageId?subSchemeId=${subSchemeId}&approvalStageId=${approvalStageId}`
        )
        .then((response) => {
          if (response.data.content) {
            setApprovalStageAfterNextStepListData(response.data.content);
          }
        })
        .catch((err) => {
          setApprovalStageAfterNextStepListData([]);
          // alert(err.response.data.errorMessages[0].message[0].message);
        });
    };

  const [selectedRows, setSelectedRows] = useState([]);

  const [drawingOfficerUsers, setDrawingOfficerUsers] = useState([]);


  const getUserForDrawingOfficer = (
  subSchemeId,
  scComponentId,
  talukId,
  districtId
) => {
  api
    .post(
      baseURLDBT +
        `service/getUserForDrawingOfficerForMultipleSanction?subSchemeId=${subSchemeId}&scComponentId=${scComponentId}&districtId=${districtId}&talukId=${talukId}`
    )
    .then((response) => {
      if (response.data.content) {
        setDrawingOfficerUsers(response.data.content || []);
      }
    })
    .catch((err) => {
      setDrawingOfficerUsers([]);
    });
};

useEffect(() => {
  if (
    data.subSchemeId > 0 &&
    data.scComponentId > 0
  ) {
    getUserForDrawingOfficer(
      data.subSchemeId,
      data.scComponentId,
      talukId,
      districtId
    );
  }
}, [data.subSchemeId, data.scComponentId, talukId, districtId]);



  const [totalSchemeAmount, setTotalSchemeAmount] = useState(0);
  const [subSchemeType, setSubSchemeType] = useState(null);

  const getMultipleSanctionOrderList = async () => {
    setLoading(true);
    try {
      const response = await api.post(
        baseURLDBT + `service/multipleSanctionList`,
        {},
        {
          params: {
            userId: localStorage.getItem("userMasterId"),
            //   schemeId: schemeId,
            //   subSchemeId: subSchemeId,
          },
        }
      );

      const data = response.data.content;

      setListData(data);

      const total = data?.[0]?.totalSchemeAmount ?? 0;
      setTotalSchemeAmount(total);

      const schemeId = data[0]?.schemeId;
      const subSchemeId = data[0]?.subSchemeId;
      const componentId = data[0]?.componentId;
      const categoryId = data[0]?.categoryId;
      const applicationDocumentId = data[0]?.applicationDocumentId;
      const subSchemeType = data[0]?.subSchemeType;
      const sanctionOrderForScheme = data[0]?.sanctionOrderForScheme;
      setApplicationFormId(applicationDocumentId);
      setSchemeId(schemeId);
      setSubSchemeId(subSchemeId);
      setComponentId(componentId);
      setCategoryId(categoryId);
      setSubSchemeType(subSchemeType);
      setSanctionOrderForScheme(sanctionOrderForScheme);
    } catch (err) {
      setListData({});
      setTotalSchemeAmount(0);
    } finally {
      setLoading(false);
    }
  };

  

  

const generateReportForNorthKarnataka = async (selectedRows) => {
  try {
    const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);

    const response = await api.post(
      baseURLReport + `get-TransportSubsidy`,
      {
        userMasterId: localStorage.getItem("userMasterId"),
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


const generateReportFor30Rs = async (selectedRows) => {
  try {
    const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);

    const response = await api.post(
      baseURLReport + `get-PriceStabilizationIncentive`,
      {
        userMasterId: localStorage.getItem("userMasterId"),
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

const clearAllAfterSubmit = () => {
  // 🔹 Clear filters
  setData({
    userMasterId: "",
    stepId: "",
    schemeId: "",
    subSchemeId: "",
    scComponentId: "",
    scCategoryId: "",
    tscId: "",
  });

  // 🔹 Clear action form BUT KEEP DATES
  setActionData((prev) => ({
    ...prev,
    applicationFormId: "",
    workOrderNumber: "",
    sanctionOrderNumber: "",
    sanctionAmount: "",
    lat: "",
    lon: "",
    description: "",
    rejectedReasonId: "",
    userId: "",
    stepId: "",
    rejectType: "",
    eligibleAmount: "",
    sanctionNo: "",
    rejectReasonWorkflowMasterId: "",
    comment: "",
    releaseNo: "",
    // ❌ DO NOT TOUCH proposalDate
    // ❌ DO NOT TOUCH releaseDate
  }));

  // 🔹 Clear table & selections
  setListData([]);
  setSelectedRows([]);
  setIsRowSelectable(false);
  setIsSubmitEnabled(false);

  // 🔹 Clear helpers
  setTotalSchemeAmount(0);
  setSelectedTotalSchemeAmount(0);
  setSanctionOrderForScheme("");
  setSubSchemeType(null);

  // ✅ MOST IMPORTANT
  setValidated(false);   // 🔥 removes red borders

  // Optional: hide pradesha
  setShowPradesha(false);
};



const generateReportFor100Rs = async (selectedRows) => {
  try {
    const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);

    const response = await api.post(
      baseURLReport + `get-MscSeedChawki1000`,
      {
        userMasterId: localStorage.getItem("userMasterId"),
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


const generateReportFor1500dfls = async (selectedRows) => {
  try {
    const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);

    const response = await api.post(
      baseURLReport + `get-MscSeedChawki`,
      {
        userMasterId: localStorage.getItem("userMasterId"),
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

const generateReportForSilkIncentive = async (selectedRows) => {
  try {
    const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);

    const response = await api.post(
      baseURLReport + `sanction-silk-incentive`,
      {
        userMasterId: localStorage.getItem("userMasterId"),
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


const generateReportForBonusPM = async (selectedRows) => {
  try {
    const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);

    const response = await api.post(
      baseURLReport + `get-BonusPM`,
      {
        userMasterId: localStorage.getItem("userMasterId"),
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


const generateAcknowledgmentBonusBV = async (selectedRows) => {
  try {
    const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);

    const response = await api.post(
      baseURLReport + `get-Bonus`,
      {
        userMasterId: localStorage.getItem("userMasterId"),
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


const generateAcknowledgmentIncentivePM = async (selectedRows) => {
  try {
    const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);

    const response = await api.post(
      baseURLReport + `get-Incentive`,
      {
        userMasterId: localStorage.getItem("userMasterId"),
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


const generateAcknowledgmentIncentiveBV = async (selectedRows) => {
  try {
    const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);

    const response = await api.post(
      baseURLReport + `get-IncentiveBV`,
      {
        userMasterId: localStorage.getItem("userMasterId"),
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


//     const generateReportForBonusIncentiveSeedCocoon = (selectedRows) => {
//   if (subSchemeType === 2) {
//     generateReportForIncentive(selectedRows);
//   } else if (subSchemeType === 3) {
//     generateReportForBonus(selectedRows);
//   } else if (subSchemeType === 4) {
//     generateReportForSeedCocoon(selectedRows);
//   }
// };

// const generateFinalReport = (selectedRows) => {
//   if (!sanctionOrderForScheme) {
//         Swal.fire({
//       icon: "error",
//       title: "Sanction Order For Scheme not found!",
//       confirmButtonText: "OK"
//     });
//     return;

    
//   }

//   switch (sanctionOrderForScheme) {
//     case "Bivoltine Bonus":
//       generateReportForBonusIncentiveSeedCocoon(selectedRows);
//       break;

//     case "North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP":
//       generateReportForNorthKarnataka(selectedRows);
//       break;

//     case "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500":
//       generateReportFor1500dfls(selectedRows);
//       break;

//     case "Incentive For Bivoltine Cocoons-30/kg-PSF":
//       generateReportFor30Rs(selectedRows);
//       break;

//     case "Incentive For Bivoltine Chawki Rearing Cost":
//       generateReportFor100Rs(selectedRows);
//       break;

//     case "Silk Incentive-PSF":
//       generateReportForSilkIncentive(selectedRows);
//       break;

//   default:
//   Swal.fire({
//     icon: "error",
//     title: "Invalid sanction order type!",
//     confirmButtonText: "OK"
//   });
//   break;

//   }
// };

const generateFinalReport = async (selectedRows) => {
  const subSchemeDetailsId = selectedRows[0]?.subSchemeId;

  // const alreadyGenerated =
  //   await isSanctionEnabledFromDB(subSchemeDetailsId);

  // // ❌ If sanction_enable = 1 → NO REPORT
  // if (alreadyGenerated) return;


  const isAllowed =
  await isSanctionEnabledFromDB(subSchemeDetailsId);

if (!isAllowed) return;   // ❌ block only when DB has 1

  if (!sanctionOrderForScheme) return;

  switch (sanctionOrderForScheme) {
    case "Bonus PM":
      await generateReportForBonusPM(selectedRows);
      break;

      case "Bonus BV":
      await generateAcknowledgmentBonusBV(selectedRows);
      break;

      case "Incentive PM":
      await generateAcknowledgmentIncentivePM(selectedRows);
      break;

      case "Incentive BV":
      await generateAcknowledgmentIncentiveBV(selectedRows);
      break;

    case "North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP":
      await generateReportForNorthKarnataka(selectedRows);
      break;

    case "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500":
      await generateReportFor1500dfls(selectedRows);
      break;

    case "Incentive For Bivoltine Cocoons-30/kg-PSF":
      await generateReportFor30Rs(selectedRows);
      break;

    case "Incentive For Bivoltine Chawki Rearing Cost":
      await generateReportFor100Rs(selectedRows);
      break;

    case "Silk Incentive-PSF":
      await generateReportForSilkIncentive(selectedRows);
      break;

    default:
      return;
  }

  // 🔐 LOCK AFTER FIRST SUCCESS
  await enableSanctionIfRequired();
};


  const [displaySubmit, setDisplaySubmit] = useState(true);
  const [validated, setValidated] = useState(false);
  const [sendApplicationFormServiceData, setSendApplicationFormServiceData] =
    useState([]);
  

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
    if (data.schemeId) {
      getSubSchemeList(data.schemeId);
    }
  }, [data.schemeId]);

  // to get component
      const [scComponentListData, setScComponentListData] = useState([]);
    
      const getComponentList = (schemeId, subSchemeId) => {
        api
          .post(baseURLDBT + `master/cost/get-by-schemeId-and-subSchemeId-for-all-responses`, {
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
  
      useEffect(() => {
          if (data.schemeId && data.subSchemeId) {
            getComponentList(data.schemeId, data.subSchemeId);
            
          }
        }, [data.schemeId, data.subSchemeId]);

         // to get category
      const [categoryListData, setCategoryListData] = useState([]);
    
      const getCategoryList = (schemeId, subSchemeId,componentId) => {
        api
          .post(baseURLDBT + `master/cost/get-by-schemeId-and-subSchemeId-and-componentId`, {
            schemeId: Number(schemeId),
            subSchemeId: Number(subSchemeId),
            scComponentId: Number(componentId),
          })
          .then((response) => {
            setCategoryListData(response.data.content.unitCost);
          })
          .catch((err) => {
            setCategoryListData([]);
          });
      };
  
      useEffect(() => {
          if (data.schemeId && data.subSchemeId && data.scComponentId) {
            getCategoryList(data.schemeId, data.subSchemeId ,data.scComponentId);
            
          }
        }, [data.schemeId, data.subSchemeId ,data.scComponentId]);

        // to get tsc
          const [tscListData, setTscListData] = useState([]);
        
          const getTscList = () => {
            const response = api
              .get(baseURL + `tscMaster/get-all`)
              .then((response) => {
                setTscListData(response.data.content.tscMaster);
              })
              .catch((err) => {
                setTscListData([]);
              });
          };
        
          useEffect(() => {
            getTscList();
          }, []);

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
          

  // const postActionData = async (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);
  //     return;
  //   }

  //   event.preventDefault();
  //   setDisplaySubmit(true);

  //   // Validate selection
  //   if (selectedRows.length === 0) {
  //     warningAlert("Please select at least one row", "Alert!!!");
  //     setDisplaySubmit(false);
  //     return;
  //   }

  //   // Build payload directly from selected rows
  //   const pushToDBTRequestList = selectedRows.map((item) => ({
  //     applicationFormId: item.applicationDocumentId,
  //     schemeAmount: item.schemeAmount,
  //     eligibleAmount: item.eligibleAmount ?? item.calculatedEligibleAmount, // use either field based on available data
  //     schemeId: item.schemeId,
  //     subSchemeId: item.subSchemeId,
  //     approvalStageId: item.approvalStageId,
  //     categoryId: item.categoryId,
  //     componentId: item.componentId,
  //     khazaneRecipientId: item.khazaneRecipientId,
  //     biddingSlipLotNo: item.biddingSlipLotNo,
  //     farmerId: item.farmerId,
  //     // Add other fields as needed
  //   }));

  //   try {
  //     const response = await api.post(
  //       baseURLDBT + `service/sanctionOrderUpdateForMultipleSanctionOrder `,
  //       { pushToDBTRequestList }
  //     );

  //     // if (response.data?.applicationFormId) {
  //     //   setApplicationId(response.data.applicationFormId);
  //     // //   generateWorkOrderAcknowledgmentRH(response.data.applicationFormId, schemeId);
  //     // } else {
  //     //   saveError("Failed to generate application ID for sanction order.");
  //     // }
  //    if (response?.data?.applicationFormId) {
  //       saveSuccess("Sanction Order updated successfully.");
  //       // Optional: clear selection or refresh data
  //       // setSelectedRows([]);
  //     } else {
  //       saveError("Sanction Order update response was invalid.");
  //     }
  //   } catch (err) {
  //     saveError(err.response?.data?.error_description || "Sanction Order Update Failed");
  //   } finally {
  //     setDisplaySubmit(false);
  //     setValidated(true);
  //   }
  // };

  // const postActionData = async (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);
  //     return;
  //   }

  //   event.preventDefault();
  //   setDisplaySubmit(true);

  //   // Validate selection
  //   if (selectedRows.length === 0) {
  //     warningAlert("Please select at least one row", "Alert!!!");
  //     setDisplaySubmit(false);
  //     return;
  //   }

  //   const sendResponse = selectedRows.map((item) => ({
  //     applicationFormId: item.applicationDocumentId,
  //     schemeAmount: item.schemeAmount,
  //     eligibleAmount: item.eligibleAmount ?? item.calculatedEligibleAmount, // use either field based on available data
  //     schemeId: item.schemeId,
  //     subSchemeId: item.subSchemeId,
  //     approvalStageId: item.approvalStageId,
  //     categoryId: item.categoryId,
  //     componentId: item.componentId,
  //     khazaneRecipientId: item.khazaneRecipientId,
  //     biddingSlipLotNo: item.biddingSlipLotNo,
  //     farmerId: item.farmerId,
  //   }));

  //   const sendPost = {
  //     applicationFormId: sendResponse.map((item) => item.applicationFormId),
  //     // applicationFormId: sendResponse[0].applicationFormId, // Assuming you want to use the first item's applicationFormId
  //     sanctionOrderNumber: actionData.sanctionOrderNumber,
  //     userId: actionData.userId,
  //     stepId: actionData.stepId,
  //     eligibleAmount: actionData.eligibleAmount,
  //     pushToDBTRequestList: sendResponse,
  //   };

  //   try {
  //     const response = await api.post(baseURLDBT + `service/sanctionOrderUpdateForMultipleSanctionOrder`, sendPost);
  //     if (response.data.applicationFormId) {
  //       setApplicationId(response.data.applicationFormId);
  //       generateWorkOrderAcknowledgmentRH(response.data.applicationFormId, schemeId);
  //       saveSuccess("Sanction Order Updated Successfully");
  //     } else {
  //       saveError("Failed to generate application ID for sanction order.");
  //     }
  //   } catch (err) {
  //     saveError(err.response?.data?.error_description || "Sanction Order Update Failed");
  //   } finally {
  //     setDisplaySubmit(false);
  //   }

  //   setValidated(true);
  // };

//   const checkSubmitEnabled = () => {
//   const isValid =
//     selectedRows.length > 0 &&
//     actionData.proposalDate &&
//     actionData.userId;

//   setIsSubmitEnabled(isValid);
// };


  // const postActionData = async (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);
  //     return;
  //   }

  //   event.preventDefault();
  //   if (!actionData.proposalDate) {
  //   warningAlert("Please select Proposal Date", "Missing Field");
  //   return;
  // }

  // if (!actionData.userId) {
  //   warningAlert("Please select Drawing Officer", "Missing Field");
  //   return;
  // }
  //   setDisplaySubmit(true);

  //   // Validate selection
  //   if (selectedRows.length === 0) {
  //     warningAlert("Please select at least one row", "Alert!!!");
  //     setDisplaySubmit(false);
  //     return;
  //   }

  //   const sendResponse = selectedRows.map((item) => ({
  //     applicationFormId: item.applicationDocumentId,
  //     schemeAmount: item.schemeAmount,
  //     eligibleAmount: item.eligibleAmount ?? item.calculatedEligibleAmount,
  //     schemeId: item.schemeId,
  //     subSchemeId: item.subSchemeId,
  //     approvalStageId: item.approvalStageId,
  //     categoryId: item.categoryId,
  //     componentId: item.componentId,
  //     componentType: item.schemeQuotaId,
  //     khazaneRecipientId: item.khazaneRecipientId,
  //     biddingSlipLotNo: item.biddingSlipLotNo,
  //     farmerId: item.farmerId,
  //     userId: actionData.userId,
  //     proposalDate:actionData.proposalDate // include userId here
  //   }));
  //   const applicationIDs = selectedRows.map(m=>m.applicationDocumentId);
  //   const sendPost = {
  //     sanctionOrderNumber: actionData.sanctionOrderNumber,
  //     // userMasterId: actionData.userId,
  //     stepId: actionData.stepId,
  //     eligibleAmount: actionData.eligibleAmount,
  //     proposalDate: actionData.proposalDate,
  //     pushToDBTRequestList: sendResponse, // ✅ all applicationFormIds are inside this list
  //   };

  //   try {
  //     const response = await api.post(
  //       baseURLDBT + `service/sanctionOrderUpdateForMultipleSanctionOrder`,
  //       sendPost
  //     );
  //     if (response.data?.applicationFormId) {
  //       setApplicationId(response.data.applicationFormId);
  //       // generateReportForBonusIncentiveSeedCocoon(response.data.applicationFormId, schemeId);
  //       saveSuccess("Sanction Order Updated Successfully");
  //       generateReportForBonusIncentiveSeedCocoon(selectedRows);
  //       await getMultipleSanctionOrderList();
  //       setIsSubmitEnabled(false);
  //       setIsRowSelectable(false);
  //     } else {
  //       saveError("Failed to generate application ID for sanction order.");
  //     }
  //   } catch (err) {
  //     saveError(
  //       err.response?.data?.error_description || "Sanction Order Update Failed"
  //     );
  //   } finally {
  //     setDisplaySubmit(false);
  //   }

  //   setValidated(true);
  // };

  
  const handleRowSelection = ({ selectedRows }) => {
  setSelectedRows(selectedRows);
  // checkSubmitEnabled();
  setIsSubmitEnabled(selectedRows.length > 0 && listData.length > 0);

  if (selectedRows.length > 0) {
    const firstRow = selectedRows[0];
    setSchemeId(firstRow.schemeId);
    setSubSchemeId(firstRow.subSchemeId);
    setComponentId(firstRow.componentId);
    setCategoryId(firstRow.categoryId);
    setSubSchemeType(firstRow.subSchemeType);

    // ✅ Convert to number safely and sum
    const selectedTotal = selectedRows.reduce((acc, row) => {
      const amount = parseFloat(row.schemeAmount) || 0;
      return acc + amount;
    }, 0);
    setSelectedTotalSchemeAmount(selectedTotal);
  } else {
    // No rows selected: show default
    setSelectedTotalSchemeAmount(0);
  }
  // checkSubmitEnabled();
};


  const postActionData = async (event) => {
  const form = event.currentTarget;

  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    return;
  }

  event.preventDefault();

  if (!actionData.proposalDate) {
    warningAlert("Please select Proposal Date", "Missing Field");
    return;
  }

  if (!actionData.userId) {
    warningAlert("Please select Drawing Officer", "Missing Field");
    return;
  }

  if (selectedRows.length === 0) {
    warningAlert("Please select at least one row", "Alert!!!");
    return;
  }

  setDisplaySubmit(true);

  // ----------------------------------------------------
  // 1️⃣ GET VALUES FOR APPROVAL POWER CHECK
  // ----------------------------------------------------
  const approvalStageId = selectedRows[0]?.approvalStageId;
  const schemeAmount = selectedTotalSchemeAmount || totalSchemeAmount;
  const subSchemeId = selectedRows[0]?.subSchemeId;
  const designationIdValue = designationId;        // <-- from getIdList()

  try {
  
    
    const approvalResp = await api.post(
      baseURLDBT +
        `service/getApprovalPowerForMultipleApplication?approvalStageId=${approvalStageId}&designationId=${designationIdValue}&schemeAmount=${schemeAmount}&subSchemeId=${subSchemeId}`
    );

    const hasApprovalPower = approvalResp.data === true;

    // ----------------------------------------------------
    // 3️⃣ IF USER IS NOT AUTHORIZED → POPUP WITH USER DROPDOWN
    // ----------------------------------------------------
   if (!hasApprovalPower) {
  const result = await Swal.fire({
    title: "<span style='font-size:22px;'>Not Authorized</span>",
    html: `
      <div style="font-size:18px; line-height:1.5;">
        You are <b>not authorized</b> to generate Sanction Order.<br><br>
        Please assign to higher authority.<br><br>

        <b>Select a User:</b><br><br>
        <select id="userDropdown" 
                class="swal2-select" 
                style="width:100%; padding:12px; font-size:16px; border-radius:8px;">
          <option value="">-- Select User --</option>
          ${userOfStepsToApproveData
            .map(
              (u) => `
                <option value="${u.userId}">
                  ${u.userName} (${u.userName})
                </option>
              `
            )
            .join("")}
        </select>
      </div>
    `,
    width: "550px",               // ⬅ Bigger Popup
    padding: "20px 30px",         // ⬅ More padding
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Assign",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    preConfirm: () => {
      const selectedUser = document.getElementById("userDropdown").value;

      if (!selectedUser) {
        Swal.showValidationMessage("Please select a user");
        return false;
      }

      return selectedUser;
    }
  });

  if (!result.isConfirmed) {
    setDisplaySubmit(false);
    return;
  }

  const selectedUserId = result.value;

 const applicationFormIds = selectedRows.map(
    (row) => row.applicationDocumentId
  );

  try {
    const inspectionResp = await api.post(
      baseURLDBT + `service/updateUserMasterId`,
      {
        applicationFormIds: applicationFormIds,
        userId: selectedUserId,
        approvalStageId: approvalStageId,
        assignedByProposalDate: actionData.proposalDate
      }
    );

    // console.log("inspectionUpdate success:", inspectionResp.data);

    // Show success alert and wait for user to click OK
  const successAlert = await Swal.fire({
    title: "Assigned Successfully!",
    text: "Application assigned to higher authority.",
    icon: "success",
    confirmButtonText: "OK",
    width: "450px"
  });

  if (successAlert.isConfirmed) {
    window.location.reload();   // 🔄 Reload only when user clicks OK
  }

} catch (err) {
  saveError(
    err.response?.data?.error_description ||
      "inspectionUpdate API failed"
  );
  setDisplaySubmit(false);
  return;
}

  // Update selected user in form
  // setActionData((prev) => ({
  //   ...prev,
  //   userId: selectedUserId
  // }));

  setDisplaySubmit(false);
  return;
}


  } catch (err) {
    saveError("Approval Power Validation Failed");
    setDisplaySubmit(false);
    return;
  }

  // ----------------------------------------------------
  // 4️⃣ USER HAS PERMISSION → PROCEED WITH NORMAL SUBMIT
  // ----------------------------------------------------
  const sendResponse = selectedRows.map((item) => ({
    applicationFormId: item.applicationDocumentId,
    schemeAmount: item.schemeAmount,
    eligibleAmount: item.eligibleAmount ?? item.calculatedEligibleAmount,
    schemeId: item.schemeId,
    subSchemeId: item.subSchemeId,
    // approvalStageId: item.approvalStageId,
    categoryId: item.categoryId,
    componentId: item.componentId,
    schemeQuotaId: item.schemeQuotaId,
    khazaneRecipientId: item.khazaneRecipientId,
    biddingSlipLotNo: item.biddingSlipLotNo,
    farmerId: item.farmerId,
    userId: actionData.userId,
    approvalStageId: actionData.approvalStageId,
    proposalDate: actionData.proposalDate,
    releaseNo: actionData.releaseNo,
    releaseDate: actionData.releaseDate,
  }));

  const sendPost = {
    sanctionOrderNumber: actionData.sanctionOrderNumber,
    stepId: actionData.stepId,
    eligibleAmount: actionData.eligibleAmount,
    proposalDate: actionData.proposalDate,
    releaseNo: actionData.releaseNo,
    sanctionNo: actionData.sanctionNo,
    releaseDate: actionData.releaseDate,
    pradesha: actionData.pradesha,
    pushToDBTRequestList: sendResponse
  };

  try {
    const response = await api.post(
      baseURLDBT + `service/sanctionOrderUpdateForMultipleSanctionOrder`,
      sendPost
    );

    if (response.data?.applicationFormId) {
      saveSuccess("Sanction Order Updated Successfully");
      // generateReportForBonusIncentiveSeedCocoon(selectedRows);
await generateFinalReport(selectedRows);
  clearAllAfterSubmit();   
      await getMultipleSanctionOrderList();
      setIsSubmitEnabled(false);
      setIsRowSelectable(false);
    } else {
      saveError("Failed to generate application ID for sanction order.");
    }
  } catch (err) {
    saveError(
      err.response?.data?.error_description ||
        "Sanction Order Update Failed"
    );
  } finally {
    setDisplaySubmit(false);
  }

  setValidated(true);
};

const [userOfStepsToApproveData, setUserOfStepsToApproveData] = useState([]);

  const getUserOfStepsToApproveList = (
      subSchemeId,
      approvalStageId,
      districtId,
      talukId,
    ) => {
      api
        .post(
          baseURLDBT +
            `service/getUserBySubSchemeIdAndScApprovalStageIdAndTalukIdAndDistrictId?subSchemeId=${subSchemeId}&approvalStageId=${approvalStageId}&districtId=${districtId}&talukId=${talukId}`
        )
        .then((response) => {
          if (response.data.content) {
            setUserOfStepsToApproveData(response.data.content);
          }
        })
        .catch((err) => {
          setUserOfStepsToApproveData([]);
          // alert(err.response.data.errorMessages[0].message[0].message);
        });
    };
  
   useEffect(() => {
  if (selectedRows.length > 0) {
    const approvalStageId = selectedRows[0]?.approvalStageId; // <-- from selected row

    getUserOfStepsToApproveList(
      subSchemeId,             // from state/data
      approvalStageId,         // <-- correct source
      districtId,
      talukId,
       // if required
    );
  }
}, [selectedRows]);


const [showPradesha, setShowPradesha] = useState(false);

  


  

  // const saveSuccess = (message) => {
  //   Swal.fire({
  //     icon: "success",
  //     title: "Saved successfully",
  //     text: message,
  //   });
  // };
  const saveSuccess = (message) => {
  Swal.fire({
    icon: "success",
    title: "Saved successfully",
    text: message,
  }).then(() => {
    // Refresh entire page AFTER clicking OK
    window.location.reload();
  });
    // clear();
  };

const saveRejectSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Rejected successfully",
      text: message,
    }).then(() => {
    // Refresh entire page AFTER clicking OK
    window.location.reload();
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
      // title: "Save attempt was not successful",
      html: errorMessage,
    });
  };

  

  const warningAlert = (message, title) => {
    Swal.fire({
      icon: "warning",
      title: title,
      text: message,
    });
  };

  const clear = () => {
    setActionData({
      applicationFormId: "",
      workOrderNumber: "",
      sanctionOrderNumber: "",
      lat: "",
      lon: "",
      description: "",
      rejectedReasonId: "",
      rejectedReasonWorkFlowMasterId: "",
      rejectType: "",
      comment: "",
      userId: "",
      stepId: "",
      paymentTo: "",
      paymentMethod: "",
      dateOfPayment: "",
      referenceNo: "",
      subsidyAmount: "",
    });
    setApplicationFormId(null);
    // Add other states that need to be reset
  };

   const [viewDetailsData, setViewDetailsData] = useState({
      applicationDetails: [],
      landDetails: [],
      applicationTransactionDetails: [],
      documents: [],
      workflowDetails: [],
    });

   const handleView = (_id) => {
    api
      .post(baseURLDBT + `service/viewServiceApplicationDetails`, {
        applicationFormId: _id,
      })
      .then((response) => {
        const content = response.data.content[0];

        if (content.applicationDetailsResponses.length <= 0) {
          saveError("No Details Found!!!");
        } else {
          handleShowModal2();
          const appDetails = content.applicationDetailsResponses[0];
          setViewDetailsData({
            applicationDetails: content.applicationDetailsResponses,
            landDetails: content.landDetailsResponses,
            applicationTransactionDetails:content.applicationTransactionResponses,
            // documents: content.documentsResponses,
            documents: content.documentsResponses || [],
            workflowDetails: content.workFlowDetailsResponses,

          applicationFormId: _id, // coming from state set earlier
          workOrderSchemeId: appDetails.schemeId,
          workOrderNumber: appDetails.workOrderNumber || "",
          workOrderForScheme: appDetails.workOrderForScheme,
          // sanctionOrderNumber: sanctionOrderNumber,
          // sanctionOrderForScheme: sanctionOrderForScheme,
          subSchemeId: subSchemeId,  // ✅ add this
        
          });
        }
      })
      .catch((err) => {
        // saveError(err.response.data.validationErrors);
      });
  };

   // to get Financial Year
    const [rejectReasonListData, setRejectReasonListData] = useState([]);
  
    const getRejectReasonList = () => {
      api
        .get(baseURLMasterData + `rejectReasonWorkFlowMaster/get-all`)
        .then((response) => {
          setRejectReasonListData(
            response.data.content.rejectReasonWorkFlowMaster
          );
        })
        .catch((err) => {
          setRejectReasonListData([]);
        });
    };
  
    useEffect(() => {
      getRejectReasonList();
    }, []);

  const rejectServiceApplication = (e) => {
  e.preventDefault();
  e.stopPropagation();

  const form = e.currentTarget;

  // 🔴 Validate form
  if (form.checkValidity() === false) {
    setValidated(true);
    return;
  }

  const sendPost = {
    applicationFormId: applicationFormId,
    rejectedReasonId: actionData.rejectReasonWorkflowMasterId,
    description: actionData.comment,
  };

  Swal.fire({
    title: "Do you want to Reject the Application?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      api
        .post(`${baseURLDBT}service/rejectServiceApplication`, sendPost)
        .then((response) => {
          if (response.data.errorCode === -1) {
            saveError(response.data.errorMessages[0]);
          } else if (response.data && response.data.error) {
            saveError(response.data.error_description);
          } else {
            saveRejectSuccess();
            clear();
            handleCloseModal();
            getMultipleSanctionOrderList();
            setValidated(false);
          }
        })
        .catch((err) => {
          if (err.response?.data?.validationErrors) {
            saveError(err.response.data.validationErrors);
          }
        });
    }
  });
};



  const ApplicationDataColumns = [
    {
      name: "Financial Year",
      selector: (row) => row.financialYear,
      cell: (row) => <span>{row.financialYear}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Fruits Id",
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Name",
      selector: (row) => row.farmerFirstName,
      cell: (row) => <span>{row.farmerFirstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Scheme Amount",
      selector: (row) => row.schemeAmount,
      cell: (row) => <span>{row.schemeAmount}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Sanction No",
      selector: (row) => row.sanctionNo,
      cell: (row) => <span>{row.sanctionNo}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Bidding Slip Lot No",
    //   selector: (row) => row.biddingSlipLotNo,
    //   cell: (row) => <span>{row.biddingSlipLotNo}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Mobile Number",
      selector: (row) => row.mobileNumber,
      cell: (row) => <span>{row.mobileNumber}</span>,
      sortable: true,
      hide: "md",
    },

    // {
    //   name: "Eligible Amount",
    //   selector: (row) => row.eligibleAmount,
    //   cell: (row) => <span>{row.eligibleAmount}</span>,
    //   sortable: true,
    //   hide: "md",
    // },

    {
      name: "Scheme Name",
      selector: (row) => row.schemeName,
      cell: (row) => <span>{row.schemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Sub Scheme Name",
      selector: (row) => row.subSchemeName,
      cell: (row) => <span>{row.subSchemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Khazane Recipient Id",
      selector: (row) => row.khazaneRecipientId,
      cell: (row) => <span>{row.khazaneRecipientId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "TSC",
      selector: (row) => row.tscName,
      cell: (row) => <span>{row.tscName}</span>,
      sortable: true,
      hide: "md",
    },

    // {
    //   name: "Machine Type",
    //   selector: (row) => row.machineTypeName,
    //   cell: (row) => <span>{row.machineTypeName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Machine Type",
      selector: (row) => row.machineTypeName,
      cell: (row) => <span>{row.machineTypeName}</span>,
      sortable: true,
      hide: sanctionOrderForScheme !== "Silk Incentive-PSF" ? "all" : "md",
    },

    {
      name: "Race",
      selector: (row) => row.raceName,
      cell: (row) => <span>{row.raceName}</span>,
      sortable: true,
      hide: sanctionOrderForScheme !== "Silk Incentive-PSF" ? "all" : "md",
    },

    {
          name: "Action",
          cell: (row) => (
            <div className="text-start w-100">
              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  gap: "0.5rem", // Adds space between buttons
                }}
              >
                
    
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleView(row.applicationDocumentId)}
                >
                  View
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleShowModal(row.applicationDocumentId)}
                >
                  Reject
                </Button>
    
               
              </div>
            </div>
          ),
          sortable: false,
          hide: "md",
          grow: 2,
        },
  ];

  const [currentDocumentPath, setCurrentDocumentPath] = useState(null);
  
    const handleDocumentClick = async (documentPath) => {
      setCurrentDocumentPath(documentPath);
      await getDocumentFile(documentPath);
    };
  
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

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
    headerStyle: {
      // backgroundColor: "#0f6cbe",
      backgroundColor: "#0a2463",
      color: "white",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },

    beautifulField: {
    borderRadius: "12px",
    padding: "10px",
    border: "1px solid #8f8f8f",
    backgroundColor: "#fafafa",
    boxShadow: "inset 0px 1px 3px rgba(0,0,0,0.1)",
  },

  beautifulFieldFocus: {
    borderColor: "#4f8cff",
    boxShadow: "0px 0px 5px rgba(79, 140, 255, 0.6)",
  },
  };

  const modalCustomStyles = {
    rows: {
      style: {
        minHeight: "45px",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        fontSize: "14px",
        paddingLeft: "8px",
        paddingRight: "8px",
        fontWeight: "bold", // Make header font bold
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        fontWeight: "bold", // Make cell font bold
      },
    },
  };

  const modalStyles = {
    modalHeader: {
      backgroundColor: "#0a2463", // Dark blue background
      color: "white",
      padding: "8px 15px", // Adjusted padding to reduce header size
      fontSize: "18px",
      fontWeight: "bold",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
      lineHeight: "1.2", // Adjust line-height to reduce height
    },
    modalBody: {
      backgroundColor: "rgb(248, 248, 249)",
      color: "black",
      padding: "20px",
    },
    formGroupLabel: {
      fontWeight: "bold", // Bold form label
      fontSize: "16px",
    },
    selectInput: {
      fontWeight: "bold", // Bold text inside select
      padding: "10px",
    },
    formControl: {
      fontWeight: "bold", // Bold text for inputs
      padding: "10px",
    },
    modalTitle: {
      fontSize: "18px", // Reduced font size for the title
      fontWeight: "bold", // Keep the title bold
    },
  };

  
  useEffect(() => {
  if (actionData.proposalDate && actionData.userId && selectedRows.length > 0) {
    setIsSubmitEnabled(true);
  }
}, [actionData, selectedRows]);

  return (
    <Layout title="List Of Application">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">List Of Application</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                {/* <span className="btn btn-light">
            Total Amount: ₹{(totalSchemeAmount ?? 0).toLocaleString("en-IN")}
            </span> */}
                {/* <span
                  className="btn btn-light"
                  style={{
                    fontWeight: "bold",
                    color: "green",
                    fontSize: "1.6rem",
                  }}
                >
                  Total Amount: ₹
                  {(totalSchemeAmount ?? 0).toLocaleString("en-IN")}
                </span> */}
                 <span
                    className="btn btn-light"
                    style={{
                      fontWeight: "bold",
                      color: "green",
                      fontSize: "1.6rem",
                    }}
                  >
                    Total Amount: ₹
                    {(selectedRows.length > 0
                      ? selectedTotalSchemeAmount
                      : totalSchemeAmount
                    ).toLocaleString("en-IN")}
                  </span>
              </li>
              <li>
                <Link
                  to="/seriui/application-dashboard"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/application-dashboard"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Dashboard</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1">
          

          <Row className="m-2">
            <Col>
              <Form.Group as={Row} className="form-group" id="fid">
                {/* <Form.Label column sm={1}>
                  {t("Search By")}
                </Form.Label> */}
            <Row className="mb-3">
                <Form.Label column sm={1}>
                  {t("Scheme")}
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="schemeId"
                      value={data.schemeId}
                      onChange={handleInputs}
                      // style={{ marginLeft: "-14%" }}
                    >
                      <option value="0">{t("Select Scheme")}</option>
                      {scSchemeDetailsListData.map((list) => (
                        <option
                          key={list.scSchemeDetailsId}
                          value={list.scSchemeDetailsId}
                        >
                          {list.schemeName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>

                <Form.Label column sm={1}>
                  {t("Component Type")}
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="subSchemeId"
                      value={data.subSchemeId}
                      onChange={handleInputs}
                      // style={{ marginLeft: "-14%" }}
                    >
                      <option value="0">{t("Select Component Type")}</option>
                      {scSubSchemeDetailsListData.map((list) => (
                        <option
                          key={list.subSchemeId}
                          value={list.subSchemeId}
                        >
                          {list.subSchemeName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>


                <Form.Label column sm={1}>
                  {t("Component")}
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="scComponentId"
                      value={data.scComponentId}
                      onChange={handleInputs}
                      // style={{ marginLeft: "-14%" }}
                    >
                      <option value="0">{t("Select Component")}</option>
                      {scComponentListData  && scComponentListData.length
                      ? scComponentListData.map((list) => (
                  <option key={list.scComponentId} value={list.scComponentId}>
                    {list.scComponentName}
                  </option>
                      ))  : ""}
                    </Form.Select>
                  </div>
                </Col>

                <Form.Label column sm={1}>
                  {t("Sub Component")}
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="scCategoryId"
                      value={data.scCategoryId}
                      onChange={handleInputs}
                      // style={{ marginLeft: "-14%" }}
                    >
                      <option value="0">{t("Select Sub Component")}</option>
                      {categoryListData &&
                  categoryListData.length ? categoryListData.map((list) => (
                    <option
                      key={list.categoryId}
                      value={list.categoryId}
                    >
                      {list.categoryName}
                  </option>
                ))
                      : ""}
                    </Form.Select>
                  </div>
                </Col>
                </Row>

            <Row className="mb-3">
                <Form.Label column sm={1}>
                  {t("TSC")}
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="tscId"
                      value={data.tscId}
                      onChange={handleInputs}
                      // style={{ marginLeft: "-14%" }}
                    >
                      <option value="0">{t("Select TSC")}</option>
                      {tscListData &&
                  tscListData.length ? tscListData.map((list) => (
                    <option
                      key={list.tscMasterId}
                      value={list.tscMasterId}
                    >
                      {list.name}
                  </option>
                ))
                      : ""}
                    </Form.Select>
                  </div>
                </Col>


                {/* <Form.Label column sm={1}>
                  {t("Machine Type")}
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="machineTypeId"
                      value={data.machineTypeId}
                      onChange={handleInputs}
                      // style={{ marginLeft: "-14%" }}
                    >
                      <option value="0">{t("Select Machine Type")}</option>
                      {machineTypeListData &&
                            machineTypeListData.length ? machineTypeListData.map((list) => (
                              <option
                                key={list.machineTypeId}
                                value={list.machineTypeId}
                              >
                                {list.machineTypeName}
                            </option>
                          ))
                      : ""}
                    </Form.Select>
                  </div>
                </Col> */}

                {sanctionOrderForScheme === "Silk Incentive-PSF" && (
                    <>
                      <Form.Label column sm={1}>
                        {t("Machine Type")}
                      </Form.Label>

                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="machineTypeId"
                            value={data.machineTypeId}
                            onChange={handleInputs}
                          >
                            <option value="0">{t("Select Machine Type")}</option>
                            {machineTypeListData && machineTypeListData.length
                              ? machineTypeListData.map((list) => (
                                  <option
                                    key={list.machineTypeId}
                                    value={list.machineTypeId}
                                  >
                                    {list.machineTypeName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                        </div>
                      </Col>

                       <Form.Label column sm={1}>
                        {t("Race")}
                      </Form.Label>

                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="raceId"
                            value={data.raceId}
                            onChange={handleInputs}
                          >
                            <option value="0">{t("Select Race")}</option>
                            {raceListData && raceListData.length
                              ? raceListData.map((list) => (
                                  <option
                                    key={list.raceMasterId}
                                    value={list.raceMasterId}
                                  >
                                    {list.raceMasterName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                        </div>
                      </Col>
                    </>
                  )}
                </Row>

                <Col sm={1}>
                  <Button type="button" variant="primary" onClick={search}>
                    {t("search")}
                  </Button>
                </Col>
              </Form.Group>
            </Col>
          </Row>
        </Card>
      </Block>

      <Block className="mt-3">
        <Card>
          <DataTable
            //  title="Market List"
            tableClassName="data-table-head-light table-responsive"
            columns={ApplicationDataColumns}
            data={listData}
            highlightOnHover
            // pagination
            // paginationServer
            // paginationTotalRows={totalRows}
            // paginationPerPage={countPerPage}
            // paginationComponentOptions={{
            //   noRowsPerPage: true,
            // }}
            // onChangePage={(page) => setPage(page - 1)}
            selectableRows={isRowSelectable}
            // onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
            onSelectedRowsChange={handleRowSelection}
            progressPending={loading}
            theme="solarized"
            customStyles={customStyles}
          />
        </Card>

          <Card className="p-3 mt-3">
          <Form noValidate validated={validated} onSubmit={postActionData}>
            <Row className="align-items-end">

              {/* Proposal Date */}
               <Col lg="3">
                <Form.Group className="form-group mt-n3">
                  <Form.Label htmlFor="schemeAmount">Sanction No<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="sanctionNo"
                      type="text"
                      name="sanctionNo"
                      value={actionData.sanctionNo}
                      onChange={handleActionInputs}
                      placeholder="Enter Sanction No"
                      required
                      // readOnly
                    />
                  </div>
                </Form.Group>
                <Form.Control.Feedback type="invalid">
                Sanction Number is required
              </Form.Control.Feedback>
              </Col>

              <Col lg="3">
                <Form.Group className="form-group mt-n3">
                  <Form.Label htmlFor="schemeAmount">Allotment Release Order Details<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="releaseNo"
                      type="text"
                      name="releaseNo"
                      value={actionData.releaseNo}
                      onChange={handleActionInputs}
                      placeholder="Allotment Release Order Details"
                      required
                      // readOnly
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="3">
                <Form.Group className="form-group">
                  <Form.Label>
                    Approval Stage{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="approvalStageId"
                    value={actionData.approvalStageId}
                    onChange={handleActionInputs}
                    required
                    // isInvalid={!actionData.stepId || actionData.stepId === "0"}
                  
                  >
                    <option value="">
                      Select Approval Stage
                    </option>
                    {
                   approvalStageAfterNextStepListData
                    .map((list) => (
                      <option
                        key={list.approvalStageId}
                        value={list.approvalStageId}
                      >
                        {list.approvalStageName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Approval Stage Name is required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Drawing Officer */}
              <Col lg="3">
                <Form.Group className="form-group">
                  <Form.Label style={{ fontWeight: "bold" }}>
                    Drawing Officer <span className="text-danger">*</span>
                  </Form.Label>

                  <Form.Select
                    name="userId"
                    value={actionData.userId || ""}
                    onChange={(e) => {
                      const userId = e.target.value;
                      setActionData((prev) => ({
                        ...prev,
                        userId: userId,
                        drawingOfficer: userId,
                      }));
                    }}
                    style={
                      isDrawingOfficerFocused
                        ? { ...styles.beautifulField, ...styles.beautifulFieldFocus }
                        : styles.beautifulField
                    }
                    onFocus={() => setIsDrawingOfficerFocused(true)}
                    onBlur={() => setIsDrawingOfficerFocused(false)}
                  >
                    <option value="">Select Drawing Officer</option>
                    {drawingOfficerUsers.map((list) => (
                      <option key={list.userId} value={list.userId}>
                        {list.userName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

          <Col lg="3">
            <Form.Group className="form-group">
              <Form.Label style={{ fontWeight: "bold" }}>
                Proposal Date <span className="text-danger">*</span>
              </Form.Label>

              <DatePicker
                selected={parseDate(actionData.proposalDate)}
                onChange={(date) => handleDateChange(date, "proposalDate")}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                maxDate={new Date()}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </Form.Group>
          </Col>


              <Col lg="3">
                  <Form.Group className="form-group">
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Release Date <span className="text-danger">*</span>
                    </Form.Label>

                    <DatePicker
                      selected={parseDate(actionData.releaseDate)}
                      onChange={(date) => handleDateChange(date, "releaseDate")}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      maxDate={new Date()}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </Form.Group>
                </Col>

                <Col lg="3">
                  <Form.Group className="form-group mt-2">
                    <Form.Check
                      type="checkbox"
                      label="Choose Pradesha"
                      checked={showPradesha}
                      onChange={(e) => setShowPradesha(e.target.checked)}
                    />
                  </Form.Group>
                </Col>

                {showPradesha && (
                    <Col lg="3">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="schemeAmount">Pradesha</Form.Label>

                        <div className="form-control-wrap">
                          <Form.Control
                            id="pradesha"
                            type="text"
                            name="pradesha"
                            value={actionData.pradesha}
                            onChange={handleActionInputs}
                            placeholder="Enter Pradesha"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  )}



              {/* Submit Button */}
              <Col lg="3">
                <Button
                  type="submit"
                  variant="secondary"
                  className="mt-2 w-100"
                  // onClick={clear}
                  disabled={!isSubmitEnabled}
                  // onClick={clear}
                >
                  {t("Submit Application")}
                </Button>
              </Col>

            </Row>
          </Form>
        </Card>
      </Block>


      <Modal show={showModal2} onHide={handleCloseModal2} size="xl">
              <Modal.Header closeButton>
                <Modal.Title>View Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
                  <Accordion defaultActiveKey="0">
                    {/* Application Details Accordion */}
                    <Accordion.Item eventKey="0">
                      <Accordion.Header
                        style={{
                          backgroundColor: "#0F6CBE",
                          color: "white",
                          fontWeight: "bold",
                        }}
                        className="mb-2"
                      >
                        Application Details
                      </Accordion.Header>
                      <Accordion.Body>
                        <table className="table small table-bordered">
                          <tbody>
                            <tr>
                              <td style={styles.ctstyle}>Fruits Id:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]?.fruitsId ||
                                  "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Name:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.farmerFirstName || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Sanction No:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.sanctionNo || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Sub Scheme Name:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.subSchemeName || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Component:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.scComponentName || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Scheme Name:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.schemeName || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Sub Component:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.categoryName || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Spacing:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.spacingName || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Hectare:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.hectareName || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Scheme Amount:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.schemeAmount || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Eligible Amount:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.eligibleAmount || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Period From:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.periodFrom || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Period To:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]?.periodTo ||
                                  "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>District Name:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.districtName || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Taluk Name:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.talukName || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Village Name:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.villageName || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Application Status:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.applicationStatus || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Month(Silk Incentive):</td>
                              <td>{viewDetailsData?.applicationDetails?.[0]?.month || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Machine Quantity(Silk Incentive):</td>
                              <td>{viewDetailsData?.applicationDetails?.[0]?.machineQuantity || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Machine Type(Silk Incentive):</td>
                              <td>{viewDetailsData?.applicationDetails?.[0]?.machineTypeName || 'N/A'}</td>
                            </tr>
                            
                            <tr>
                              <td style={styles.ctstyle}>Remarks:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]?.remarks ||
                                  "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Work Order No:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.workOrderNumber || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Sanction Order No:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.sanctionOrderNumber || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Proposal Date</td>
                              <td>{viewDetailsData?.applicationDetails?.[0]?.proposalDate || "N/A"}</td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Created Date:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.createdDate || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Modified Date:</td>
                              <td>
                                {viewDetailsData?.applicationDetails?.[0]
                                  ?.modifiedDate || "N/A"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
      
                        <Card className="shadow-sm border-0 rounded-3 mt-4">
                      <Card.Header 
                        className="fw-bold text-white" 
                        style={{ backgroundColor: "#0F6CBE" }}
                      >
                        Kanesh Land Details
                      </Card.Header>
                      <Card.Body>
                        <table className="table table-bordered table-striped small">
                          <tbody>
                            <tr>
                              <td style={styles.ctstyle}>District Name</td>
                              <td>{viewDetailsData?.applicationDetails?.[0]?.kaneshDistrictName || "N/A"}</td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Taluk Name</td>
                              <td>{viewDetailsData?.applicationDetails?.[0]?.kaneshTalukName || "N/A"}</td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Village Name</td>
                              <td>{viewDetailsData?.applicationDetails?.[0]?.kaneshVillageName || "N/A"}</td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Kanesh No</td>
                              <td>{viewDetailsData?.applicationDetails?.[0]?.kaneshNo || "N/A"}</td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Panchayat Name</td>
                              <td>{viewDetailsData?.applicationDetails?.[0]?.panchaytName || "N/A"}</td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>Square Feet</td>
                              <td>{viewDetailsData?.applicationDetails?.[0]?.sqft || "N/A"}</td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>East</td>
                              <td>{viewDetailsData?.applicationDetails?.[0]?.east || "N/A"}</td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>West</td>
                              <td>{viewDetailsData?.applicationDetails?.[0]?.west || "N/A"}</td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>North</td>
                              <td>{viewDetailsData?.applicationDetails?.[0]?.north || "N/A"}</td>
                            </tr>
                            <tr>
                              <td style={styles.ctstyle}>South</td>
                              <td>{viewDetailsData?.applicationDetails?.[0]?.south || "N/A"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </Card.Body>
                    </Card>
      
                    <Card className="shadow-sm border-0 rounded-3 mt-4">
                                    <Card.Header 
                                      className="fw-bold text-white" 
                                      style={{ backgroundColor: "#0F6CBE" }}
                                    >
                                      Constructed Area
                                    </Card.Header>
                                    <Card.Body>
                                      <table className="table table-bordered table-striped small">
                                        <tbody>
                                          <tr>
                                            <td style={styles.ctstyle}>Extent Of Mulberry</td>
                                            <td>{viewDetailsData?.applicationDetails?.[0]?.extentOfMulberry || "N/A"}</td>
                                          </tr>
                                          <tr>
                                            <td style={styles.ctstyle}>RH Sqft</td>
                                            <td>{viewDetailsData?.applicationDetails?.[0]?.rhSqft || "N/A"}</td>
                                          </tr>
                                          <tr>
                                            <td style={styles.ctstyle}>Estimated Cost</td>
                                            <td>{viewDetailsData?.applicationDetails?.[0]?.estimatedCost || "N/A"}</td>
                                          </tr>
                                          <tr>
                                            <td style={styles.ctstyle}>Roof Type</td>
                                            <td>{viewDetailsData?.applicationDetails?.[0]?.roofTypeName || "N/A"}</td>
                                          </tr>
                                          
                                        </tbody>
                                      </table>
                                    </Card.Body>
                                  </Card>
                      {/* )} */}
                      </Accordion.Body>
                    </Accordion.Item>
      
                    {/* Land Details Accordion */}
                    {/* {viewDetailsData?.landDetails?.length > 0 ? (
                      viewDetailsData.landDetails.map((landDetail, index) => (
                        <Accordion.Item eventKey={index + 1} key={index}>
                          <Accordion.Header
                            style={{
                              backgroundColor: "#0F6CBE",
                              color: "white",
                              fontWeight: "bold",
                            }}
                            className="mb-2"
                          >
                            Land Details
                          </Accordion.Header>
                          <Accordion.Body>
                            <table className="table small table-bordered">
                              <tbody>
                                <tr>
                                  <td style={styles.ctstyle}>Survey Number:</td>
                                  <td>{landDetail.surveyNumber || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>District Name:</td>
                                  <td>{landDetail.districtName || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Taluk Name:</td>
                                  <td>{landDetail.talukName || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Village Name:</td>
                                  <td>{landDetail.villageName || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Acre:</td>
                                  <td>{landDetail.acre || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>F Gunta:</td>
                                  <td>{landDetail.fGunta || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Gunta:</td>
                                  <td>{landDetail.gunta || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Developed Area Acre:</td>
                                  <td>{landDetail.devAcre || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>
                                    Developed Area F Gunta:
                                  </td>
                                  <td>{landDetail.devFGunta || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>
                                    Developed Area Gunta:
                                  </td>
                                  <td>{landDetail.devGunta || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Hissa:</td>
                                  <td>{landDetail.hissa || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Land Code:</td>
                                  <td>{landDetail.landCode || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Main Owner No:</td>
                                  <td>{landDetail.mainOwnerNo || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Owner Name:</td>
                                  <td>{landDetail.ownerName || "N/A"}</td>
                                </tr>
                              </tbody>
                            </table>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))
                    ) : (
                      <Accordion.Item eventKey="land">
                        <Accordion.Header
                          style={{
                            backgroundColor: "#0F6CBE",
                            color: "white",
                            fontWeight: "bold",
                          }}
                          className="mb-2"
                        >
                          Land Details
                        </Accordion.Header>
                        <Accordion.Body>No Land Details Available</Accordion.Body>
                      </Accordion.Item>
                    )} */}
      
                {viewDetailsData?.landDetails?.length > 0 ? (
                <Accordion.Item eventKey="landDetails">
                  <Accordion.Header
                    style={{ backgroundColor: "#0F6CBE", color: "white", fontWeight: "bold" }}
                    className="mb-2"
                  >
                    Land Details
                  </Accordion.Header>
                  <Accordion.Body>
                    {viewDetailsData.landDetails.map((landDetail, index) => (
                      <table className="table small table-bordered mb-3" key={index}>
                        <tbody>
                          <tr>
                            <td style={styles.ctstyle}>Survey Number:</td>
                            <td>{landDetail.surveyNumber || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>District Name:</td>
                            <td>{landDetail.districtName || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Taluk Name:</td>
                            <td>{landDetail.talukName || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Village Name:</td>
                            <td>{landDetail.villageName || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Acre:</td>
                            <td>{landDetail.acre || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>F Gunta:</td>
                            <td>{landDetail.fGunta || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Gunta:</td>
                            <td>{landDetail.gunta || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Developed Area Acre:</td>
                            <td>{landDetail.devAcre || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Developed Area F Gunta:</td>
                            <td>{landDetail.devFGunta || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Developed Area Gunta:</td>
                            <td>{landDetail.devGunta || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Hissa:</td>
                            <td>{landDetail.hissa || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Land Code:</td>
                            <td>{landDetail.landCode || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Main Owner No:</td>
                            <td>{landDetail.mainOwnerNo || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Owner Name:</td>
                            <td>{landDetail.ownerName || "N/A"}</td>
                          </tr>
                        </tbody>
                      </table>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <Accordion.Item eventKey="land">
                  <Accordion.Header
                    style={{ backgroundColor: "#0F6CBE", color: "white", fontWeight: "bold" }}
                    className="mb-2"
                  >
                    Land Details
                  </Accordion.Header>
                  <Accordion.Body>No Land Details Available</Accordion.Body>
                </Accordion.Item>
              )}
      
                    <Accordion.Item eventKey="documents">
                      <Accordion.Header
                        style={{
                          backgroundColor: "#0F6CBE",
                          color: "white",
                          fontWeight: "bold",
                        }}
                        className="mb-2"
                      >
                        Documents
                      </Accordion.Header>
                      <Accordion.Body>
                        {viewDetailsData?.documents?.length > 0 ? (
                          <table className="table small table-bordered">
                            <thead>
                              <tr>
                                <th>Document Name</th>
                                {/* <th>Document Path</th> */}
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {viewDetailsData.documents.map(
                                (fileDocuments, index) => (
                                  <tr key={index}>
                                    <td>{fileDocuments.documentName || "N/A"}</td>
                                    {/* <td>{fileDocuments.documentPath || 'N/A'}</td> */}
                                    <td>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() =>
                                          handleDocumentClick(
                                            fileDocuments.documentPath
                                          )
                                        }
                                      >
                                        View Document
                                      </Button>
                                      {currentDocumentPath ===
                                        fileDocuments.documentPath &&
                                        selectedDocumentFile && (
                                          <>
                                            <img
                                              style={{
                                                height: "100px",
                                                width: "100px",
                                              }}
                                              src={selectedDocumentFile}
                                              alt="Selected File"
                                            />
                                            <Button
                                              variant="primary"
                                              size="sm"
                                              className="ms-2"
                                              onClick={() =>
                                                downloadFile(
                                                  fileDocuments.documentPath
                                                )
                                              }
                                            >
                                              Download Selected File
                                            </Button>
                                          </>
                                        )}
      
                                      
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        ) : (
                          <p>No Documents Available</p>
                        )}
      
                      </Accordion.Body>
                    </Accordion.Item>
      
                    {viewDetailsData?.workflowDetails?.length > 0 ? (
                      <Accordion.Item eventKey="workflow-details">
                        <Accordion.Header
                          style={{
                            backgroundColor: "#0F6CBE",
                            color: "white",
                            fontWeight: "bold",
                          }}
                          className="mb-2"
                        >
                          Work Flow Details
                        </Accordion.Header>
                        <Accordion.Body>
                          {viewDetailsData.workflowDetails.map((workFlow, index) => (
                            <table className="table small table-bordered" key={index}>
                              <tbody>
                                <tr>
                                  <td style={styles.ctstyle}>Step Name:</td>
                                  <td>{workFlow.stepName || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Status:</td>
                                  <td>{workFlow.status || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Assigned By:</td>
                                  <td>{workFlow.assignedBy || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Reject Reason:</td>
                                  <td>{workFlow.rejectReason || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Rejected By:</td>
                                  <td>{workFlow.rejectReason || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      ...styles.ctstyle,
                                      fontWeight: "bold",
                                      color: "green",
                                    }}
                                  >
                                    Comment:
                                  </td>
                                  <td style={{ fontWeight: "bold", color: "green" }}>
                                    {workFlow.comment || "N/A"}
                                  </td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Reason:</td>
                                  <td>{workFlow.reason || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Assigned To:</td>
                                  <td>{workFlow.assignedTo || "N/A"}</td>
                                </tr>
                              </tbody>
                            </table>
                          ))}
                        </Accordion.Body>
                      </Accordion.Item>
                    ) : (
                      <Accordion.Item eventKey="land">
                        <Accordion.Header
                          style={{
                            backgroundColor: "#0F6CBE",
                            color: "white",
                            fontWeight: "bold",
                          }}
                          className="mb-2"
                        >
                          Work Flow Details
                        </Accordion.Header>
                        <Accordion.Body>
                          No Work Flow Details Available
                        </Accordion.Body>
                      </Accordion.Item>
                    )}
                  </Accordion>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal2}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

             <Modal show={showModal} onHide={handleCloseModal} size="xl">
                    <Modal.Body>
                      {loading ? (
                        <h1 className="d-flex justify-content-center align-items-center">
                          Loading...
                        </h1>
                      ) : (
                        <>
                          <Form noValidate validated={validated} onSubmit={rejectServiceApplication}>
                            <Accordion defaultActiveKey="0">
                              <Accordion.Item eventKey="0">
                                <Accordion.Header
                                  style={{
                                    backgroundColor: "#0F6CBE",
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: "3rem",
                                    padding: "3px",
                                    borderRadius: "5px",
                                    position: "relative",
                                    overflow: "hidden",
                                  }}
                                  className="mb-3"
                                >
                                 Reject Reason
                                </Accordion.Header>
                                <Accordion.Body>
                                  <Block className="mt-3">
                                    <Card
                                      className="mt-3"
                                      style={{
                                        border: "none",
                                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                                      }}
                                    >
                                      <Card.Body>
                                        <Row>
                                          
            
                                          <Col lg="6">
                                            <Form.Group className="form-group">
                                              <Form.Label>
                                                <strong>Reject Reason<span className="text-danger">*</span></strong>
                                              </Form.Label>
                                              <Form.Select
                                                name="rejectReasonWorkflowMasterId"
                                                value={
                                                  actionData.rejectReasonWorkflowMasterId
                                                }
                                                onChange={handleActionInputs}
                                                required
                                              >
                                                <option value="">
                                                  Select Reject Reason
                                                </option>
                                                {rejectReasonListData.map((list) => (
                                                  <option
                                                    key={list.rejectReasonWorkFlowMasterId}
                                                    value={
                                                      list.rejectReasonWorkFlowMasterId
                                                    }
                                                  >
                                                    {list.reason}
                                                  </option>
                                                ))}
                                              </Form.Select>
                                            </Form.Group>
                                          </Col>
                                          <Col lg="6">
                                            <Form.Group className="form-group">
                                              <Form.Label>
                                                <strong>Remarks/Description</strong>
                                              </Form.Label>
                                              <Form.Control
                                                id="comment"
                                                type="text"
                                                name="comment"
                                                value={actionData.comment}
                                                onChange={handleActionInputs}
                                                placeholder="Enter Description"
                                                // required
                                              />
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                      </Card.Body>
                                    </Card>
                                  </Block>
            
                                  
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
            
                            <Col lg="12">
                              <div className="d-flex justify-content-center gap-2 mt-3">
                              
                                  <Button
                                    type="submit"
                                    variant="success"
                                    // disabled={displaySubmit}
                                  >
                                    Reject
                                  </Button>
                               
                                
                              </div>
                            </Col>
                          </Form>
                        </>
                      )}
                    </Modal.Body>
            
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
    </Layout>
  );
}

export default MultipleSanctionOrder;
