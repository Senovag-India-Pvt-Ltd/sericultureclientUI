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
  });

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isRowSelectable, setIsRowSelectable] = useState(false);
  // initially disabled

  // Search
  const search = (e) => {
    e.preventDefault();
    setSelectedRows([]);
    setIsSubmitEnabled(false);
    setIsRowSelectable(false); // disallow selection first
    setListData([]); // reset table

    api
      .post(
        baseURLDBT + `service/multipleSanctionList`,
        {},
        {
          params: {
            userId: localStorage.getItem("userMasterId"),
            schemeId: data.schemeId,
            subSchemeId: data.subSchemeId,
          },
        }
      )
      .then((response) => {
        const result = response.data.content;
        setListData(result);
        //       setIsSubmitEnabled(true);
        //     //   setIsSubmitEnabled(result && result.length > 0); // Enable if rows exist
        //     })
        //     .catch((err) => {
        //       setListData([]);
        //       setIsSubmitEnabled(false); // Disable on error
        //     });
        // };

        // ✅ Update totalSchemeAmount
        const total = result?.[0]?.totalSchemeAmount ?? 0;
        setTotalSchemeAmount(total);

        if (result && result.length > 0) {
          setIsRowSelectable(true); // allow selection
        } else {
          setIsRowSelectable(false);
        }
      })
      .catch((err) => {
        setListData([]);
        setIsRowSelectable(false);
        setIsSubmitEnabled(false);
        setTotalSchemeAmount(0);
      });
  };

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

  const handleRowSelection = ({ selectedRows }) => {
  setSelectedRows(selectedRows);
  setIsSubmitEnabled(selectedRows.length > 0 && listData.length > 0);

  if (selectedRows.length > 0) {
    const firstRow = selectedRows[0];
    setSchemeId(firstRow.schemeId);
    setSubSchemeId(firstRow.subSchemeId);
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
};


  const [schemeDataListIds, setSchemeDataListIds] = useState([]);
  const [recordFromAppForm, setRecordFromAppForm] = useState([]);
  const [permission, setPermission] = useState(false);
  const [reportingOfficerDdoCode, setReportingOfficerDdoCode] = useState("");

  const [pushToDbtStatus, setPushToDbtStatus] = useState(false);
  const [directlyToFruits, setDirectlyToFruits] = useState(false);

  const [showModal, setShowModal] = useState(false);

  // const handleShowModal = () => setShowModal(true);
  const handleShowModal = (fid) => {
    setShowModal(true);
    // getActionFarmerList(fid); // Call getList with userId and stepId
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

  //   const getList = async (district, taluk) => {
  //   setLoading(true);
  //   try {
  //     const response = await api.post(
  //       baseURLDBT + `service/multipleSanctionList`,
  //       {},
  //       { params: { userId: localStorage.getItem("userMasterId") } }
  //     );

  //     const data = response.data.content;

  //     const applicationDocumentId = data[0]?.applicationDocumentId;
  //     const schemeId = data[0]?.schemeId;
  //     const subSchemeId = data[0]?.subSchemeId;

  //     // Set state
  //     setApplicationFormId(applicationDocumentId);
  // setSchemeId(schemeId);
  // setSubSchemeId(subSchemeId);

  //     // Call second API with the newly set values
  //     getMultipleSanctionOrderList(schemeId, subSchemeId);
  //   } catch (err) {
  //     setListData({});
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {

  // }, [userId]);

  useEffect(() => {
    getIdList();
    //  getList();
  }, []);

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
      const applicationDocumentId = data[0]?.applicationDocumentId;
      const subSchemeType = data[0]?.subSchemeType;
      setApplicationFormId(applicationDocumentId);
      setSchemeId(schemeId);
      setSubSchemeId(subSchemeId);
      setSubSchemeType(subSchemeType);
    } catch (err) {
      setListData({});
      setTotalSchemeAmount(0);
    } finally {
      setLoading(false);
    }
  };

  

  const generateReportForIncentive = async () => {
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
    // console.error("Error generating incentive report", error);
  }
};

const generateReportForBonus = async (selectedRows) => {
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

const generateReportForSeedCocoon = async (selectedRows) => {
  try {
    const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);

    const response = await api.post(
      baseURLReport + `get-seed-cocoon`,
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
    // console.error("Error generating seed cocoon report", error);
  }
};


    const generateReportForBonusIncentiveSeedCocoon = (selectedRows) => {
  if (subSchemeType === 2) {
    generateReportForIncentive(selectedRows);
  } else if (subSchemeType === 3) {
    generateReportForBonus(selectedRows);
  } else if (subSchemeType === 4) {
    generateReportForSeedCocoon(selectedRows);
  }
};

  const [displaySubmit, setDisplaySubmit] = useState(true);
  const [validated, setValidated] = useState(false);
  const [sendApplicationFormServiceData, setSendApplicationFormServiceData] =
    useState([]);
  const [applicationId, setApplicationId] = useState(null);
  const [schemeQuotaListCount, setSchemeQuotaListCount] = useState(0);

  const receiveData = (data, i) => {
    console.log("i", i);
    // setPushToDbtData((prev) => ({ ...prev, row: i }));
    setSendApplicationFormServiceData((prev) => {
      const updatedData = [...prev];
      if (i < updatedData.length) {
        updatedData[i] = { ...data, ...actionFarmerData[0] };
      } else {
        updatedData.push({ ...data, ...actionFarmerData[0] });
      }
      return updatedData;
    });

    // handleShowModal3(i);
  };

  const receiveDataForPushToDbt = (data, i) => {
    console.log("i", i);
    // setPushToDbtData((prev) => ({ ...prev, row: i }));
    setSendApplicationFormServiceData((prev) => {
      const updatedData = [...prev];
      if (i < updatedData.length) {
        // updatedData[i] = { ...data, ...actionFarmerData[0] };
        updatedData[i] = { ...data };
      } else {
        // updatedData.push({ ...data, ...actionFarmerData[0] });
        updatedData.push({ ...data });
      }
      return updatedData;
    });

    // handleShowModal3(i);
  };

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

  const postActionData = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    }

    event.preventDefault();
    setDisplaySubmit(true);

    // Validate selection
    if (selectedRows.length === 0) {
      warningAlert("Please select at least one row", "Alert!!!");
      setDisplaySubmit(false);
      return;
    }

    const sendResponse = selectedRows.map((item) => ({
      applicationFormId: item.applicationDocumentId,
      schemeAmount: item.schemeAmount,
      eligibleAmount: item.eligibleAmount ?? item.calculatedEligibleAmount,
      schemeId: item.schemeId,
      subSchemeId: item.subSchemeId,
      approvalStageId: item.approvalStageId,
      categoryId: item.categoryId,
      componentId: item.componentId,
      khazaneRecipientId: item.khazaneRecipientId,
      biddingSlipLotNo: item.biddingSlipLotNo,
      farmerId: item.farmerId,
    }));
    const applicationIDs = selectedRows.map(m=>m.applicationDocumentId);
    const sendPost = {
      sanctionOrderNumber: actionData.sanctionOrderNumber,
      userId: actionData.userId,
      stepId: actionData.stepId,
      eligibleAmount: actionData.eligibleAmount,
      pushToDBTRequestList: sendResponse, // ✅ all applicationFormIds are inside this list
    };

    try {
      const response = await api.post(
        baseURLDBT + `service/sanctionOrderUpdateForMultipleSanctionOrder`,
        sendPost
      );
      if (response.data?.applicationFormId) {
        setApplicationId(response.data.applicationFormId);
        // generateReportForBonusIncentiveSeedCocoon(response.data.applicationFormId, schemeId);
        saveSuccess("Sanction Order Updated Successfully");
        generateReportForBonusIncentiveSeedCocoon(selectedRows);
        await getMultipleSanctionOrderList();
        setIsSubmitEnabled(false);
        setIsRowSelectable(false);
      } else {
        saveError("Failed to generate application ID for sanction order.");
      }
    } catch (err) {
      saveError(
        err.response?.data?.error_description || "Sanction Order Update Failed"
      );
    } finally {
      setDisplaySubmit(false);
    }

    setValidated(true);
  };

  const saveRejectSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Rejected successfully",
      text: message,
    });
  };
  const saveAssignSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Assigned successfully",
      text: message,
    });
  };

  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: message,
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

  const pushedSuccess = (b, f) => {
    Swal.fire({
      icon: "success",
      title: "Pushed successfully",
      text: `Beneficiary Id is ${b} and Fruits Id is ${f}`,
    });
    // getList();
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

  const [selectedRows, setSelectedRows] = useState([]);

  console.log("selected row", selectedRows);

  const ApplicationDataColumns = [
    {
      name: "Fruits Id",
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Farmer Name",
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
      name: "Head of Account",
      selector: (row) => row.headAccountName,
      cell: (row) => <span>{row.headAccountName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Bidding Slip Lot No",
      selector: (row) => row.biddingSlipLotNo,
      cell: (row) => <span>{row.biddingSlipLotNo}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobileNumber,
      cell: (row) => <span>{row.mobileNumber}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Eligible Amount",
      selector: (row) => row.eligibleAmount,
      cell: (row) => <span>{row.eligibleAmount}</span>,
      sortable: true,
      hide: "md",
    },

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
  ];

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
          {/* <Row className="m-2">
                 <Col>
                   <Form.Group as={Row} className="form-group" id="fid">
                     <Form.Label column sm={1}>
                       Search By
                     </Form.Label>
                     <Col sm={3}>
                       <div className="form-control-wrap">
                         <Form.Select
                           name="searchBy"
                           value={data.searchBy}
                           onChange={handleInputs}
                         >
                          
                           <option value="marketMasterName">Market</option>
                           <option value="marketTypeMasterName">Market Type</option>
                         </Form.Select>
                       </div>
                     </Col>
     
                     <Col sm={3}>
                       <Form.Control
                         id="marketMasterId"
                         name="text"
                         value={data.text}
                         onChange={handleInputs}
                         type="text"
                         placeholder="Search"
                       />
                     </Col>
                     <Col sm={3}>
                       <Button type="button" variant="primary" onClick={search}>
                         Search
                       </Button>
                     </Col>
                   </Form.Group>
                 </Col>
               </Row> */}

          <Row className="m-2">
            <Col>
              <Form.Group as={Row} className="form-group" id="fid">
                <Form.Label column sm={1}>
                  {t("Search By")}
                </Form.Label>

                <Form.Label column sm={1}>
                  {t("Scheme")}
                </Form.Label>
                <Col sm={4}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="schemeId"
                      value={data.schemeId}
                      onChange={handleInputs}
                      style={{ marginLeft: "-14%" }}
                    >
                      <option value="0">{t("select scheme")}</option>
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

                <Form.Label column sm={2}>
                  {t("Component")}
                </Form.Label>
                <Col sm={4}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="subSchemeId"
                      value={data.subSchemeId}
                      onChange={handleInputs}
                      style={{ marginLeft: "-14%" }}
                    >
                      <option value="0">{t("select component")}</option>
                      {scSubSchemeDetailsListData.map((list) => (
                        <option
                          key={list.scSubSchemeDetailsId}
                          value={list.subSchemeId}
                        >
                          {list.subSchemeName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>

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

        <Form
          noValidate
          validated={validated}
          //   disabled={!isSubmitEnabled || selectedRows.length === 0}
          onSubmit={postActionData}
          className="mt-1"
        >
          <div className="gap-col mt-1">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                {/* <Button type="submit" variant="secondary" onClick={clear}>
                        {t("Submit Application")}
                        </Button> */}
                <Button
                  type="submit"
                  variant="secondary"
                  onClick={clear}
                  disabled={!isSubmitEnabled}
                >
                  {t("Submit Application")}
                </Button>
              </li>
            </ul>
          </div>
        </Form>
      </Block>
    </Layout>
  );
}

export default MultipleSanctionOrder;
