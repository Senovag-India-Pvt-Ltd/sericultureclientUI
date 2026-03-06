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
import ReactSelect from "react-select";
import { useTranslation } from "react-i18next";
import { reference } from "@popperjs/core";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function DashboardReportList() {
   const { t } = useTranslation();
  const { id } = useParams();
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 35;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const [applicationDetails, setApplicationDetails] = useState([]);
  const [actionFarmerData, setActionFarmerData] = useState({});
  // console.log("actionFarmerData", actionFarmerData);
  // console.log("actionFarmerDatasasa", !!actionFarmerData[0]?.applicationFormId);

  const [data, setData] = useState({
    userMasterId: "",
    stepId: "",
  });

  const [schemeDataListIds, setSchemeDataListIds] = useState([]);
  const [recordFromAppForm, setRecordFromAppForm] = useState([]);
  const [permission, setPermission] = useState(false);
  const [reportingOfficerDdoCode, setReportingOfficerDdoCode] = useState("");
  const [reportingOfficerKhazaneRecipientId, setReportingOfficerKhazaneRecipientId] = useState("");

  const [pushToDbtStatus, setPushToDbtStatus] = useState(false);
  const [directlyToFruits, setDirectlyToFruits] = useState(false);

  const handleDateChange = (date, type) => {
    const formattedDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0");
    console.log("formattedDate", formattedDate);
    setPushToDbtData((prev) => ({ ...prev, [type]: formattedDate }));
  };

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

  const handleDateForPropasalChange = (date, type) => {
    const formattedDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0");
    console.log("formattedDate", formattedDate);
    setActionData((prev) => ({ ...prev, [type]: formattedDate }));
  };

  const [showModal, setShowModal] = useState(false);

  // const handleShowModal = () => setShowModal(true);
  const handleShowModal = (fid) => {
    setShowModal(true);
    // getActionFarmerList(fid); // Call getList with userId and stepId
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDisplaySubmit(true);

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  const [showModal1, setShowModal1] = useState(false);

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const [showModal3, setShowModal3] = useState(false);

  // const handleShowModal3 = () => setShowModal3(true);
  const handleShowModal3 = (index) => {
    setDbtPushedList((prev) => prev.filter((_, i) => i !== index));
    setShowModal3(true);
  };

  const handleCloseModal3 = () => setShowModal3(false);

  const [showModal4, setShowModal4] = useState(false);

  const handleShowModal4 = () => setShowModal4(true);
  const handleCloseModal4 = () => setShowModal4(false);

  const [changeable, setChangeable] = useState({
    fid: "",
    schemeId: "",
    componentType: "",
  });

  const checkToShowModal = (fid, schemeId, applicationId, componentType) => {
    setChangeable((prev) => ({ ...prev, fid, schemeId, componentType }));
    getActionFarmerList(fid, schemeId, componentType);
  };

  const [sendApplicationFormServiceData, setSendApplicationFormServiceData] =
    useState([]);
  // const receiveData = (data,i) => {
  //   console.log("i",i);

  //   setSendApplicationFormServiceData(prev=>[...prev,data]);
  //   handleShowModal3(i);
  //  };

  //  const receiveData = (data, i) => {
  //   console.log("i", i);

  //   setSendApplicationFormServiceData((prev) => {
  //     const updatedData = [...prev,...actionFarmerData];
  //     updatedData[i] = {...data,actionFarmerData};
  //     return updatedData;
  //   });

  //   handleShowModal3(i);
  // };

  const receiveData = (data, i) => {
    console.log("i", i);
    setPushToDbtData((prev) => ({ ...prev, row: i }));
    setSendApplicationFormServiceData((prev) => {
      const updatedData = [...prev];
      if (i < updatedData.length) {
        updatedData[i] = { ...data, ...actionFarmerData[0] };
      } else {
        updatedData.push({ ...data, ...actionFarmerData[0] });
      }
      return updatedData;
    });

    handleShowModal3(i);
  };

  const receiveDataForPushToDbt = (data, i) => {
    console.log("i", i);
    setPushToDbtData((prev) => ({ ...prev, row: i }));
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

    handleShowModal3(i);
  };

  const [schemeDataList, setSchemeDataList] = useState([]);

const handleDrawingOfficerChange = (index, selectedUserId) => {
  setPushToDBTListData((prevList) => {
    const updatedList = [...prevList];
    if (updatedList[index]) {
      updatedList[index] = { ...updatedList[index], userId: selectedUserId };
    }
    return updatedList;
  });
};

const handleDrawingOfficerChangeForSanction = (index, selectedUserId) => {
  setRecordFromAppForm((prevList) => {
    const updatedList = [...prevList];
    if (updatedList[index]) {
      updatedList[index] = { ...updatedList[index], userId: selectedUserId };
    }
    return updatedList;
  });
};





  const schemeDetailsListColumn = [
    {
      name: "Select",
      selector: "select",
      cell: (row, i) => (
        <input
          type="checkbox"
          name="selectedLand"
          value={i}
          checked={schemeDataListIds.includes(i)}
          onChange={() => handleCheckboxChange(i, row)}
        />
      ),
      // ignoreRowClick: true,
      // allowOverflow: true,
      button: true,
    },
    {
      name: "Scheme Quota Name",
      selector: (row) => row.schemeQuotaName,
      cell: (row) => <span>{row.schemeQuotaName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Component Type",
      selector: (row) => row.schemeSubSchemeName,
      cell: (row) => <span>{row.schemeSubSchemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Component Name",
      selector: (row) => row.schemeComponentName,
      cell: (row) => <span>{row.schemeComponentName}</span>,
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
      name: "Scheme Amount",
      selector: (row) => row.schemeAmount,
      cell: (row) => <span>{row.schemeAmount}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Share Percentage",
      selector: (row) => row.shareInPercentage,
      cell: (row) => <span>{row.shareInPercentage}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Calculated Eligible Amount",
    //   selector: (row) => row.calculatedEligibleAmount,
    //   cell: (row) => <span>{row.calculatedEligibleAmount}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Final Amount",
      selector: (row) => row.subsidyAmount,
      cell: (row) => <span>{row.subsidyAmount}</span>,
      sortable: true,
      hide: "md",
    },
    {
    name: "Drawing Officer",
    selector: (row) => row.userId || "",
    cell: (row, i) => (
      <Form.Select
        size="sm"
        value={row.userId || ""}
        onChange={(e) => handleDrawingOfficerChange(i, e.target.value)}
        style={{
    borderColor: !row.userId ? "red" : "#ced4da",
  }}
      >
        {/* <option value="">-- Select Officer --</option>
        {userForDrawingOfficersData.map((user) => (
          <option key={user.userId} value={user.userId}>
            {user.userName}
          </option>
        ))}
      </Form.Select> */}
      <option value="">-- Select Officer --</option>
      {(drawingOfficerUsers[i] || []).map((user) => (
        <option key={user.userId} value={user.userId}>
          {user.userName}
        </option>
      ))}
    </Form.Select>
    
    ),
    sortable: false,
    hide: "md",
  },
    {
      name: "Action",
      cell: (row, i) => (
        <>
          <Button
            variant="primary"
            size="sm"
            onClick={() => receiveData(row, i)}
            className="ms-1"
          >
            Add
          </Button>
        </>
      ),
      sortable: true,
      hide: "md",
      grow: 2,
    },
  ];

  const schemeDetailsPushToDbtListColumn = [
    {
      name: "Select",
      selector: "select",
      cell: (row, i) => (
        <input
          type="checkbox"
          name="selectedLand"
          value={i}
          checked={schemeDataListIds.includes(i)}
          onChange={() => handleCheckboxChange(i, row)}
        />
      ),
      // ignoreRowClick: true,
      // allowOverflow: true,
      button: true,
      omit: directlyToFruits,
    },
    {
      name: "Scheme Quota Name",
      selector: (row) => row.schemeQuotaName,
      cell: (row) => <span>{row.schemeQuotaName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Component Type",
      selector: (row) => row.schemeSubSchemeName,
      cell: (row) => <span>{row.schemeSubSchemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Component Name",
      selector: (row) => row.schemeComponentName,
      cell: (row) => <span>{row.schemeComponentName}</span>,
      sortable: true,
      hide: "md",
    },
    // { 
    //   name: "Allocated Amount",
    //   selector: (row) => row.allocatedAmount,
    //   cell: (row) => <span>{row.allocatedAmount}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Share Percentage",
    //   selector: (row) => row.shareInPercentage,
    //   cell: (row) => <span>{row.shareInPercentage}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Subsidy Amount",
      selector: (row) => row.subsidyAmount,
      cell: (row) => <span>{row.subsidyAmount}</span>,
      sortable: true,
      hide: "md",
    },
  //   {
  //   name: "Drawing Officer",
  //   selector: (row) => row.userId || "",
  //   cell: (row, i) => (
  //     <Form.Select
  //       size="sm"
  //       value={row.userId || ""}
  //       onChange={(e) => handleDrawingOfficerChangeForSanction(i, e.target.value)}
  //     >
  //       <option value="">-- Select Officer --</option>
  //       {userForDrawingOfficersData.map((user) => (
  //         <option key={user.userId} value={user.userId}>
  //           {user.userName}
  //         </option>
  //       ))}
  //     </Form.Select>
  //   ),
  //   sortable: false,
  //   hide: "md",
  // },

    {
      name: "Action",
      cell: (row, i) => (
        <>
          <Button
            variant="primary"
            size="sm"
            onClick={() => receiveDataForPushToDbt(row, i)}
            className="ms-1"
          >
            Add
          </Button>
        </>
      ),
      sortable: true,
      hide: "md",
      omit: { directlyToFruits },
    },
    {
      name: "Action",
      cell: (row, i) => (
        <>
          <Button
            variant="primary"
            size="sm"
            onClick={() => saveApplicationForm(row, i)}
            className="ms-1"
            disabled={actionData.rejectType === "Permanent"}
          >
            Save
          </Button>
        </>
      ),
      sortable: true,
      hide: "md",
      omit: !directlyToFruits || !!actionFarmerData[0]?.applicationFormId,
    },
  ];

  // to get approvalStageAfterNextStep
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

  const [approvalStageSameStepListData, setApprovalStageSameStepListData] =
    useState([]);
  const getApprovalStageSameStepList = (subSchemeId, approvalStageId) => {
    api
      .post(
        baseURLDBT +
          `service/getSameStepDetailsAfterSubmitBySubSchemeIdAndApprovalStageId?subSchemeId=${subSchemeId}&approvalStageId=${approvalStageId}`
      )
      .then((response) => {
        if (response.data.content) {
          setApprovalStageSameStepListData(response.data.content);
        }
      })
      .catch((err) => {
        setApprovalStageSameStepListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  // to get approvalStage Before Step
  const [
    approvalRejectStageBeforeStepListData,
    setApprovalRejectStageBeforeStepListData,
  ] = useState([]);
  const getApprovalRejectStageBeforeStepListDataList = (
    subSchemeId,
    approvalStageId
  ) => {
    api
      .post(
        baseURLDBT +
          `service/getRejectedBeforeStepDetailsAfterSubmitBySubSchemeIdAndApprovalStageId?subSchemeId=${subSchemeId}&approvalStageId=${approvalStageId}`
      )
      .then((response) => {
        if (response.data.content) {
          setApprovalRejectStageBeforeStepListData(response.data.content);
        }
      })
      .catch((err) => {
        setApprovalRejectStageBeforeStepListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  // useEffect(() => {
  //   if (data.scSubSchemeDetailsId) {
  //     getApprovalBeforeStageNextStepList(data.scSubSchemeDetailsId);
  //   }
  // }, [data.scSubSchemeDetailsId]);

  const [applicationFormId, setApplicationFormId] = useState(null);

  const [componentType, setComponentType] = useState(null);

  const [schemeId, setSchemeId] = useState(null);

  const [workOrderSchemeId, setWorkOrderSchemeId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [workOrderNumber, setWorkOrderNumber] = useState(null);
  const [workOrderForScheme, setWorkOrderForScheme] = useState(null);
  const [sanctionOrderNumber, setSanctionOrderNumber] = useState(null);
  const [sanctionOrderForScheme, setSanctionOrderForScheme] = useState(null);

  

  const [userId, setId] = useState(localStorage.getItem("userMasterId"));

  const [districtId, setDistrictId] = useState(null);
  const [divisionId, setDivisionId] = useState(null);
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
    rejectReasonWorkflowMasterId:"",
    comment: "",
    proposalDate: "",
    selectionLetterDate: "",
  });

  const [allowAnyUser, setAllowAnyUser] = useState(false);

  //  to get data from api
  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURLMasterData + `userMaster/get-join/${userId}`)
      .then((response) => {
        setDistrictId(response.data.content.districtId);
        setTalukId(response.data.content.talukId);
        setDesignationId(response.data.content.designationId);
        setDivisionId(response.data.content.divisionMasterId);
        getList(
          response.data.content.districtId,
          response.data.content.talukId
        );
        setAllowAnyUser(response.data.content.allowAnyUser === true);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        // editError(message);
        setLoading(false);
      });
  };

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

  useEffect(() => {
    if (actionData.stepId)
      getUserFromDistrictList(
        subSchemeId,
        actionData.stepId,
        districtId,
        talukId
      );
  }, [actionData.stepId]);

  const [userOfStepsToApproveData, setUserOfStepsToApproveData] = useState([]);

  const getUserOfStepsToApproveList = (
    subSchemeId,
    approvalStageId,
    districtId,
    talukId,
    designationStep
  ) => {
    api
      .post(
        baseURLDBT +
          `service/getUserBySubSchemeIdAndScApprovalStageIdAndTalukIdAndDistrictIdForSameStep?subSchemeId=${subSchemeId}&approvalStageId=${approvalStageId}&districtId=${districtId}&talukId=${talukId}&designationStep=${designationStep}`
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
    if (actionData.stepId)
      getUserOfStepsToApproveList(
        subSchemeId,
        actionData.stepId,
        districtId,
        talukId,
        actionFarmerData[0]?.designationStep
      );
  }, [actionData.stepId]);

  

//   const getUserForDrawingOfficer = (
//     subSchemeId,
//     scComponentId,
//     schemeQuotaId,
//     talukId,
//     districtId,
//   ) => {
//     api
//       .post(
//         baseURLDBT +
//           `service/getUserForDrawingOfficer?subSchemeId=${subSchemeId}&scComponentId=${scComponentId}&schemeQuotaId=${schemeQuotaId}&districtId=${districtId}&talukId=${talukId}`
//       )
//       .then((response) => {
//         if (response.data.content) {
//           setUserForDrawingOfficersData(response.data.content);
//         }
//       })
//       .catch((err) => {
//         setUserForDrawingOfficersData([]);
//         // alert(err.response.data.errorMessages[0].message[0].message);
//       });
//   };

//  useEffect(() => {
//   if (
//     actionData.subSchemeId &&
//     actionData.scComponentId &&
//     actionData.schemeQuotaId &&
//     districtId &&
//     talukId
//   ) {
//     getUserForDrawingOfficer(
//       actionData.subSchemeId,
//       actionData.scComponentId,
//       actionData.schemeQuotaId,
//       talukId,
//       districtId
//     );
//   }
// }, [actionData.subSchemeId, actionData.scComponentId, actionData.schemeQuotaId, talukId, districtId]);


  const getList = async (district, taluk) => {
    setLoading(true);
    try {
      const response = await api.post(
        baseURLDBT + `service/getInProgressTaskListByUserIdAndStepId`,
        {},
        { params: { userId: localStorage.getItem("userMasterId"), stepId: id } }
      );

      setListData(response.data.content);
      const scApplicationFormIds = response.data.content.map(
        (item) => item.scApplicationFormId
      );

      const data = response.data.content; // Store the response data in a variable
      setAssignData(data);

      // Extract and set the applicationDocumentId
      const applicationDocumentId = data[0]?.applicationDocumentId; // Use data variable here
      setApplicationFormId(applicationDocumentId);

      const schemeId = data[0]?.schemeId; // Use data variable here
      setSchemeId(schemeId);

      // Extract subSchemeId and approvalStageId
      const subSchemeId = data[0]?.subSchemeId;
      const approvalStageId = data[0]?.approvalStageId;
      // const schemeId = data[0]?.schemeId;

      if (subSchemeId && approvalStageId && district && taluk) {
        await getUserFromDistrictList(
          subSchemeId,
          approvalStageId,
          district,
          taluk
        );
      }

      // setAllApplicationIds(scApplicationFormIds);
    } catch (err) {
      setListData({});
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {

  // }, [userId]);

  useEffect(() => {
    getIdList();
    //  getList();
  }, []);

  const [subSchemeId, setSubSchemeId] = useState(null); // State to hold subSchemeId
  const [approvalStageId, setApprovalStageId] = useState(null);
  const [isSanctionOrderAllowed, setIsSanctionOrderAllowed] = useState(false);
  const [displaySubmit, setDisplaySubmit] = useState(true);

  const timeoutIdRef = useRef(null);
  const thirtyMinHold = (e) => {
    timeoutIdRef.current = setTimeout(() => {
      setDisplaySubmit(false);
      setShowModal6(false);
    }, 15000);
  };

  // const getActionFarmerList = (fid,schemeId) => {
  //   setLoading(true);
  //   api
  //     .post(
  //       baseURLDBT + `service/getInProgressTaskListByUserIdAndStepId`,
  //       {},
  //       {
  //         params: {
  //           userId: localStorage.getItem("userMasterId"),
  //           stepId: id,
  //           fid: fid,
  //           schemeId: schemeId,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       const data = response.data.content; // Store the response data in a variable
  //       const recordData = data[0];
  //       setActionFarmerData(data);
  //        const subSchemeId = recordData?.subSchemeId;
  //        const designationStep = recordData?.designationStep;

  //     if (recordData.financialDelegation) {
  //       const amountToPass =
  //         !recordData.eligibleAmount || recordData.eligibleAmount === 0
  //           ? recordData.schemeAmount
  //           : recordData.eligibleAmount;

  //       api
  //         .post(
  //           baseURLDBT + `service/checkApprovalPower`,
  //           {},
  //           {
  //             params: {
  //               approvalStageId: recordData.approvalStageId,
  //               designationId,
  //               schemeAmount: amountToPass,
  //               subSchemeId: recordData.subSchemeId,
  //               applicationFormId: recordData.applicationDocumentId,
  //             },
  //           }
  //         )
  //         .then((response) => {
  //           const isAllowed = response.data;

  //           setIsSanctionOrderAllowed(isAllowed);

  //           if (isAllowed) {
  //             // Call for "after next step" and "user from district" when isSanctionOrderAllowed is true
  //             getApprovalAfterStageNextStepList(recordData.subSchemeId, recordData.approvalStageId);
  //             getUserFromDistrictList(
  //               recordData.subSchemeId,
  //               // recordData.approvalStageId,
  //               approvalStageId,
  //               districtId,
  //               talukId
  //             );
  //           } else {
  //             // Call for "same step" and "user of steps to approve" when isSanctionOrderAllowed is false
  //             getApprovalStageSameStepList(recordData.subSchemeId, recordData.approvalStageId);
  //             getUserOfStepsToApproveList(
  //               recordData.subSchemeId,
  //               // recordData.approvalStageId,
  //               approvalStageId,
  //               districtId,
  //               talukId,
  //               designationStep,
  //             );
  //           }

  //           handleShowModal(fid);
  //         })
  //         .catch((err) => {
  //           setIsSanctionOrderAllowed(false);
  //           // Fallback logic when checkApprovalPower fails
  //           getApprovalStageSameStepList(recordData.subSchemeId, recordData.approvalStageId);
  //           getUserOfStepsToApproveList(
  //             recordData.subSchemeId,
  //             // recordData.approvalStageId,
  //             approvalStageId,
  //             districtId,
  //             talukId,
  //             designationStep,
  //           );
  //           handleShowModal(fid);
  //         });
  //     } else {
  //       // When financialDelegation is false, no need to check isSanctionOrderAllowed
  //       getApprovalAfterStageNextStepList(recordData.subSchemeId, recordData.approvalStageId);
  //       getUserFromDistrictList(
  //         recordData.subSchemeId,
  //         // recordData.approvalStageId,
  //         approvalStageId,
  //         districtId,
  //         talukId
  //       );
  //       handleShowModal(fid);
  //     }

  //       if (recordData.pushToDbt) {
  //         api
  //           .post(
  //             baseURLDBT +
  //               `service/getApplicationDetailsFromScApplicationFormServiceId`,
  //             { scApplicationFormServiceId: recordData.applicationDocumentId }
  //           )
  //           .then((response) => {
  //             setRecordFromAppForm(
  //               response.data.content[0].applicationDetailsResponses
  //             );
  //           })
  //           .catch((err) => {
  //             setRecordFromAppForm([]);
  //           });
  //       }

  //       // Extract and set the applicationDocumentId
  //       const applicationDocumentId = recordData?.applicationDocumentId; // Use data variable here
  //       setApplicationFormId(applicationDocumentId); // Set applicationFormId here

  //       // Extract categoryId and componentId
  //       const categoryId = recordData?.categoryId;
  //       const componentId = recordData?.componentId;
  //       const schemeId = recordData?.schemeId;

  //       // // Fetch DBT List using extracted categoryId and componentId
  //       // if (categoryId && componentId) {
  //       //   getPushToDBTList(categoryId, componentId);
  //       // }
  //       // Ensure the applicationDocumentId is passed here
  //     if (categoryId && componentId && schemeId && applicationDocumentId) {
  //       getPushToDBTList(categoryId, componentId, schemeId,applicationDocumentId);
  //     }

  //       setSubSchemeId(subSchemeId); // Set subSchemeId from recordData

  //       // Set the applicationDocumentId for both uploadDocuments and sanctionOrderData
  //       setUploadDocuments((prev) => ({
  //         ...prev,
  //         applicationFormId: applicationDocumentId, // Set applicationDocumentId here
  //       }));

  //       setSanctionOrderData((prev) => ({
  //         ...prev,
  //         applicationFormId: applicationDocumentId, // Set applicationDocumentId here
  //       }));

  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setActionFarmerData({});
  //       setLoading(false);
  //     });
  // };

  const [allowDbtPush, setAllowDbtPush] = useState(true);


  const getActionFarmerList = async (fid, schemeId, componentType) => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getInProgressTaskListByUserIdAndStepId`,
        {},
        {
          params: {
            userId: localStorage.getItem("userMasterId"),
            stepId: id,
            fid: fid,
            schemeId: schemeId,
            componentType: componentType,
          },
        }
      )
      .then((response) => {
        const data = response.data.content;
        const recordData = data[0];
        setActionFarmerData(data);
        setAllowDbtPush(recordData.allowDbtPush === true);
        if (recordData.pushToDbt) {
          setFieldsDisabled(recordData.pushToDbt);
        }
        if (recordData.directlyToFruits) {
          setFieldsDisabled(recordData.directlyToFruits);
        }

        setDirectlyToFruits(recordData.directlyToFruits === true);

          /* ===========================
            🎯 MAIN RULE — ACTION CLICK
          =========================== */
        if (recordData.directlyToFruits === true) {
          // Submit must start as DISABLED always
          setDisplaySubmit(true);
        } else {
          // Keep existing behavior
          setDisplaySubmit(false);
        }

        // if(recordData.directlyToFruits){
        //   setDisplaySubmit(true);
        // }else{
        //   setDisplaySubmit(false);
        // }
  //       if (recordData.directlyToFruits) {
  // // 👇 NEW CONDITION
  //       if (recordData.allowDbtPush === false) {
  //             setDisplaySubmit(true);   // disable Submit
  //           } else {
  //             setDisplaySubmit(false);  // enable Submit (existing behavior)
  //           }
  //         } else {
  //           // ❗ DO NOT TOUCH existing non-direct logic
  //           setDisplaySubmit(false);
  //         }


        setPushToDbtStatus(recordData.pushToDbt);
        setDirectlyToFruits(recordData.directlyToFruits);
        const subSchemeId = recordData?.subSchemeId;
        isSanctionEnabledFromDB(subSchemeId);

        const designationStep = recordData?.designationStep;
        const applicationDocumentId = recordData?.applicationDocumentId;
        const categoryId = recordData?.categoryId;
        const componentId = recordData?.componentId;
        const componentType = recordData?.componentType;
        const schemeId = recordData?.schemeId;
        setApplicationFormId(recordData?.applicationDocumentId);
        setWorkOrderSchemeId(recordData?.schemeId);
        setCategoryId(recordData?.categoryId);

        setWorkOrderNumber(recordData?.workOrderNumber);
        setWorkOrderForScheme(recordData?.workOrderForScheme);

        setSanctionOrderNumber(recordData?.sanctionOrderNumber);
        setSanctionOrderForScheme(recordData?.sanctionOrderForScheme);

        if (recordData.financialDelegation) {
          const amountToPass =
            !recordData.eligibleAmount || recordData.eligibleAmount === 0
              ? recordData.schemeAmount
              : recordData.eligibleAmount;

          api
            .post(
              baseURLDBT + `service/checkApprovalPower`,
              {},
              {
                params: {
                  approvalStageId: recordData.approvalStageId,
                  designationId,
                  schemeAmount: amountToPass,
                  subSchemeId: recordData.subSchemeId,
                  applicationFormId: recordData.applicationDocumentId,
                },
              }
            )
            .then((response) => {
              const isAllowed = response.data;
              setIsSanctionOrderAllowed(isAllowed);

              if (isAllowed) {
                getApprovalAfterStageNextStepList(
                  recordData.subSchemeId,
                  recordData.approvalStageId
                );
                getUserFromDistrictList(
                  recordData.subSchemeId,
                  approvalStageId,
                  districtId,
                  talukId
                );
              } else {
                getApprovalStageSameStepList(
                  recordData.subSchemeId,
                  recordData.approvalStageId
                );
                getUserOfStepsToApproveList(
                  recordData.subSchemeId,
                  approvalStageId,
                  districtId,
                  talukId,
                  designationStep
                );
              }

              // ✅ **Move `fieldsShouldBeDisabled` logic inside `if (isAllowed)`**
              // if (isAllowed) {
              //   const sanctionOrderNumber = recordData?.sanctionOrderNumber;
              //   const fieldsShouldBeDisabled =
              //     recordData?.sanctionOrder && !sanctionOrderNumber;

              //   if (fieldsShouldBeDisabled) {
              //     Swal.fire({
              //       title: "Action Required!",
              //       text: "After Generating Sanction Order, please verify and upload the Sanction Order before sending it to the next step.",
              //       icon: "warning",
              //       confirmButtonText: "OK",
              //     });
              //   }
              //   setFieldsSanctionOrderDisabled(fieldsShouldBeDisabled);
              // }

              handleShowModal(fid);
            })
            .catch(() => {
              setIsSanctionOrderAllowed(false);
              getApprovalStageSameStepList(
                recordData.subSchemeId,
                recordData.approvalStageId
              );
              getUserOfStepsToApproveList(
                recordData.subSchemeId,
                approvalStageId,
                districtId,
                talukId,
                designationStep
              );
              handleShowModal(fid);
            });
        } else {
          if (recordData.directlyToFruits) {
            api
              .get(
                baseURLMasterData +
                  `userHierarchyMapping/getByReporteeUserMasterId/${localStorage.getItem(
                    "userMasterId"
                  )}`
              )
              .then((response) => {
                if (response.data.content.error) {
                  Swal.fire({
                    title: "Action Required!",
                    text: "You Don't have any Reporting Officer, Please add Reporting Officer and proceed.",
                    icon: "warning",
                    confirmButtonText: "OK",
                  });
                  getList();
                } else {
                  getApprovalAfterStageNextStepList(
                    recordData.subSchemeId,
                    recordData.approvalStageId
                  );
                  getUserFromDistrictList(
                    recordData.subSchemeId,
                    approvalStageId,
                    districtId,
                    talukId
                  );
                  if (response.data.content.reportToUserMasterId) {
                    getUserMastersList(
                      response.data.content.reportToUserMasterId
                    );
                  }
                  handleShowModal(fid);
                }
              })
              .catch(() => {});
          } else {
            getApprovalAfterStageNextStepList(
              recordData.subSchemeId,
              recordData.approvalStageId
            );
            getUserFromDistrictList(
              recordData.subSchemeId,
              approvalStageId,
              districtId,
              talukId
            );
            handleShowModal(fid);
          }
        }

        if (categoryId && componentId && schemeId  && applicationDocumentId && subSchemeId) {
          getPushToDBTList(
            categoryId,
            componentId,
            schemeId,
            applicationDocumentId,
            subSchemeId,
            componentType,
          );
        }

        setSubSchemeId(subSchemeId);
        setUploadDocuments((prev) => ({
          ...prev,
          applicationFormId: applicationDocumentId,
        }));
        setSanctionOrderData((prev) => ({
          ...prev,
          applicationFormId: applicationDocumentId,
        }));

        setLoading(false);
      })
      .catch(() => {
        setActionFarmerData({});
        setLoading(false);
      });
  };

  // useEffect(() => {
  //   if (districtId && talukId) {
  //     // Call getActionFarmerList after districtId and talukId are available
  //     getActionFarmerList();
  //   }
  // }, [districtId, talukId]);

  // to get push to dbt details
  const [isAllSchemesSelected, setIsAllSchemesSelected] = useState(false);

  const [pushToDBTListData, setPushToDBTListData] = useState([]);
  const [schemeQuotaListCount, setSchemeQuotaListCount] = useState(0);
  const getPushToDBTList = (
  categoryId,
  componentId,
  schemeId,
  applicationFormId,
  subSchemeId,
  componentType
) => {
  api
    .post(
      baseURLDBT +
        `service/getDetailsByComponentIdAndCategoryId?categoryId=${categoryId}&componentId=${componentId}&schemeId=${schemeId}&applicationFormId=${applicationFormId}&subSchemeId=${subSchemeId}&componentType=${componentType}`
    )
    .then((response) => {
      if (response.data.content) {
        const dbtData = response.data.content;

        setSchemeQuotaListCount(dbtData.length);
        setRecordFromAppForm(dbtData);
        setPushToDBTListData(dbtData); // Save full list

        // Optional: if dbtData is an array, handle accordingly
        const firstRecord = Array.isArray(dbtData) ? dbtData[0] : dbtData;
        const { subsidyAmount, calculatedEligibleAmount, schemeQuotaPaymentType,subSchemeId, scComponentId, schemeQuotaId  } = firstRecord;

        // Set subsidy and eligible amount in actionData
        setActionData((prevData) => ({
          ...prevData,
          subsidyAmount: subsidyAmount || "",
          calculatedEligibleAmount: calculatedEligibleAmount || "",
          schemeQuotaPaymentType: schemeQuotaPaymentType || "", 
          subSchemeId: subSchemeId,
          scComponentId: scComponentId,
          schemeQuotaId: schemeQuotaId,// Save for later use
        }));
      }
    })
    .catch((err) => {
      setPushToDBTListData([]);
    });
};

const [userForDrawingOfficersData, setUserForDrawingOfficersData] = useState([]);

  const [drawingOfficerUsers, setDrawingOfficerUsers] = useState({});

const getUserForDrawingOfficer = (
  rowIndex,
  subSchemeId,
  scComponentId,
  schemeQuotaId,
  divisionId
  // talukId,
  // districtId
) => {
  api
    .post(
      baseURLDBT +
        `service/getUserForDrawingOfficerByDivision?subSchemeId=${subSchemeId}&scComponentId=${scComponentId}&schemeQuotaId=${schemeQuotaId}&divisionId=${divisionId}`
    )
    .then((response) => {
      if (response.data.content) {
        setDrawingOfficerUsers((prev) => ({
          ...prev,
          [rowIndex]: response.data.content,
        }));
      }
    })
    .catch((err) => {
      setDrawingOfficerUsers((prev) => ({
        ...prev,
        [rowIndex]: [],
      }));
    });
};
useEffect(() => {
  pushToDBTListData.forEach((row, index) => {
    getUserForDrawingOfficer(
      index,
      row.subSchemeId,
      row.scComponentId,
      row.schemeQuotaId,
      // talukId,
      // districtId
      divisionId
    );
  });
}, [pushToDBTListData, divisionId]);

// useEffect(() => {
//   if (actionFarmerData.length > 0 && actionFarmerData[0].sanctionOrder) {
//     setIsAllSchemesSelected(
//       pushToDBTListData.length > 0 &&
//       pushToDBTListData.every((item) => item.isSelected) &&  // depends on how you mark selected
//       pushToDBTListData.length === schemeQuotaListCount
//     );
//   } else {
//     setIsAllSchemesSelected(true); // not sanction order → always allow submit
//   }
// }, [pushToDBTListData, schemeQuotaListCount, actionFarmerData]);


  // const getPushToDBTList = (
  //   categoryId,
  //   componentId,
  //   schemeId,
  //   applicationFormId,
  //   componentType
  // ) => {
  //   api
  //     .post(
  //       baseURLDBT +
  //         `service/getDetailsByComponentIdAndCategoryId?categoryId=${categoryId}&componentId=${componentId}&schemeId=${schemeId}&applicationFormId=${applicationFormId}&componentType=${componentType}`
  //     )
  //     .then((response) => {
  //       if (response.data.content) {
  //         const dbtData = response.data.content;
  //         setSchemeQuotaListCount(dbtData.length);
  //         setRecordFromAppForm(dbtData);

  //         // Assuming subsidy amount is in dbtData, update actionData
  //         // setActionData((prevData) => ({
  //         //   ...prevData,
  //         //   subsidyAmount: dbtData.subsidyAmount || "", // adjust according to your actual data structure
  //         // }));
  //         setActionData((prevData) => ({
  //           ...prevData,
  //           subsidyAmount: dbtData.subsidyAmount || "", // adjust according to your actual data structure
  //           calculatedEligibleAmount: dbtData.calculatedEligibleAmount || "",
  //           schemeQuotaPaymentType: dbtData.schemeQuotaPaymentType || "", // assuming eligibleAmount exists in dbtData
  //         }));

  //         setPushToDBTListData(response.data.content);
  //       }
  //     })
  //     .catch((err) => {
  //       setPushToDBTListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //     });
  // };

  // to get push to dbt details
  const [checkApprovalListData, setCheckApprovalListData] = useState([]);
  const getCheckApprovalList = (
    approvalStageId,
    designationId,
    schemeAmount
  ) => {
    api
      .post(
        baseURLDBT +
          `service/checkApprovalPower?approvalStageId=${approvalStageId}&designationId=${designationId}&schemeAmount=${schemeAmount}`
      )
      .then((response) => {
        if (response.data.content) {
          const dbtData = response.data.content;

          setCheckApprovalListData(response.data.content);
        }
      })
      .catch((err) => {
        setCheckApprovalListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  // useEffect(() => {
  //   if (data.scSubSchemeDetailsId) {
  //     getPushToDBTListList(data.scSubSchemeDetailsId);
  //   }
  // }, [data.scSubSchemeDetailsId]);

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

  const [applicationIds, setApplicationIds] = useState([]);
  const [unselectedApplicationIds, setUnselectedApplicationIds] = useState([]);
  const [allApplicationIds, setAllApplicationIds] = useState([]);

  const handleCheckboxChange = (_id, data) => {
    console.log("handleCheckboxChange", data);
    if (schemeDataListIds.includes(_id)) {
      const dataList = [...schemeDataListIds];
      const newDataList = dataList.filter((data) => data !== _id);
      const newSendApplicationFormServiceData =
        sendApplicationFormServiceData.filter((_, index) => index !== _id);
      console.log("newDataList", newDataList);
      setSchemeDataListIds(newDataList);
      setSendApplicationFormServiceData(newSendApplicationFormServiceData);
    } else {
      setSchemeDataListIds((prev) => [...prev, _id]);
      // setSendApplicationFormServiceData((prev) => [
      //   ...prev,
      //   ...actionFarmerData,
      // ]);
      setSendApplicationFormServiceData((prev) => {
        const updatedData = [...prev];
        updatedData[_id] = { ...data, ...actionFarmerData[0] };
        console.log("checkingUpdateData", updatedData);
        return updatedData;
      });
    }
  };

  useEffect(() => {
    setUnselectedApplicationIds(
      allApplicationIds.filter((id) => !applicationIds.includes(id))
    );
  }, [allApplicationIds, applicationIds]);

  //   console.log("Unselected",unselectedApplicationIds);
  const [validated, setValidated] = useState(false);

  // to get userList
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

  // useEffect(() => {
  //   if (data.scSubSchemeDetailsId && data.approvalStageId) {
  //     getUserFromDistrictList(

  //       districtId,
  //       talukId
  //     );
  //   }
  // }, [data.scSubSchemeDetailsId, data.approvalStageId]);

   const isSanctionEnabledFromDB = async (scSubSchemeDetailsId) => {
  if (!scSubSchemeDetailsId) return false;

  try {
    const resp = await api.get(
      baseURLMasterData +
        `scSubSchemeDetails/is-sanction-enabled/${scSubSchemeDetailsId}`
    );
    return resp.data === true; // true = sanction already generated
  } catch (err) {
    console.error("Sanction check failed", err);
    return false; // fail-safe → allow generation
  }
};

//   const callWorkOrderAcknowledgment = (
//   workOrderForScheme,
//   applicationFormId,
//   workOrderSchemeId,
//   subSchemeId,
//   categoryId
// ) => {

//   if (
//     workOrderForScheme === "Silk Samagra State" ||
//     workOrderForScheme === "Silk Samagra Central"
//   ) {
//     generateWorkOrderAcknowledgmentRH(applicationFormId, workOrderSchemeId);

//   } else if (
//     workOrderForScheme === "PDMC" ||
//     workOrderForScheme === "PMKSY"
//   ) {
//     generateWorkOrderAcknowledgment(applicationFormId, workOrderSchemeId);

//   } else if (
//     workOrderForScheme === "Reeling Shed-PSF" ||
//     workOrderForScheme === "Silk Incentive-PSF"
//   ) {
//     generateWorkOrderReelingShed(applicationFormId, workOrderSchemeId, subSchemeId,categoryId);

//   } else if (workOrderForScheme === "Adopting Heat Recovery Unit-PSF") {
//     generateWorkOrderOrderHRU(applicationFormId, workOrderSchemeId, subSchemeId,categoryId);
//   }
// };

const callWorkOrderAcknowledgment = async (
  workOrderForScheme,
  applicationFormId,
  workOrderSchemeId,
  subSchemeId,
  categoryId
) => {
  // 🔴 DB check
  const isEnabled = await isSanctionEnabledFromDB(subSchemeId);

  if (!isEnabled) {
    Swal.fire({
      icon: "warning",
      title: "Work Order Not Allowed",
      text: "Work Order generation is not enabled for this scheme.",
    });
    return; // ❌ STOP here
  }

  // ✅ Existing logic continues
  if (
    workOrderForScheme === "Silk Samagra State" ||
    workOrderForScheme === "Silk Samagra Central"
  ) {
    generateWorkOrderAcknowledgmentRH(
      applicationFormId,
      workOrderSchemeId
    );

  } else if (
    workOrderForScheme === "PDMC" ||
    workOrderForScheme === "PMKSY"
  ) {
    generateWorkOrderAcknowledgment(
      applicationFormId,
      workOrderSchemeId
    );

  } else if (
    workOrderForScheme === "Reeling Shed-PSF" ||
    workOrderForScheme === "Silk Incentive-PSF"
  ) {
    generateWorkOrderReelingShed(
      applicationFormId,
      workOrderSchemeId,
      subSchemeId,
      categoryId
    );

  } else if (workOrderForScheme === "Adopting Heat Recovery Unit-PSF") {
    generateWorkOrderOrderHRU(
      applicationFormId,
      workOrderSchemeId,
      subSchemeId,
      categoryId
    );
  }
};

const handleDownloadWorkOrder = async (viewDetailsData) => {
  try {
    // 🔴 DB check (sanction/work-order enabled or not)

    const isEnabled = await isSanctionEnabledFromDB(
      actionFarmerData[0]?.subSchemeId
    );

    if (!isEnabled) {
      Swal.fire({
        icon: "warning",
        title: "Work Order Not Allowed",
        text: "Work Order generation is not enabled for this scheme.",
      });
      return; // ❌ STOP execution
    }

    // ✅ Allowed → generate work order
    if (
      viewDetailsData.workOrderForScheme === "PDMC" ||
      viewDetailsData.workOrderForScheme === "PMKSY"
    ) {
      generateWorkOrderAcknowledgment(
        viewDetailsData.applicationFormId,
        viewDetailsData.workOrderSchemeId
      );

    } else if (
      viewDetailsData.workOrderForScheme === "Silk Samagra State" ||
      viewDetailsData.workOrderForScheme === "Silk Samagra Central"
    ) {
      generateWorkOrderAcknowledgmentRH(
        viewDetailsData.applicationFormId,
        viewDetailsData.workOrderSchemeId
      );

    } else if (
      viewDetailsData.workOrderForScheme === "Reeling Shed-PSF" ||
      viewDetailsData.workOrderForScheme === "Silk Incentive-PSF"
    ) {
      generateWorkOrderReelingShed(
        viewDetailsData.applicationFormId,
        viewDetailsData.workOrderSchemeId,
        viewDetailsData.subSchemeId,
        viewDetailsData.categoryId
      );

    } else if (
      viewDetailsData.workOrderForScheme === "Adopting Heat Recovery Unit-PSF"
    ) {
      generateWorkOrderOrderHRU(
        viewDetailsData.applicationFormId,
        viewDetailsData.workOrderSchemeId,
        viewDetailsData.subSchemeId,
        viewDetailsData.categoryId
      );

    } else {
      console.error("Unknown Work Order scheme type");
    }
  } catch (error) {
    console.error("Error while downloading work order:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to download work order. Please try again.",
    });
  }
};




  const generateWorkOrderAcknowledgment = async (
    applicationFormId,
    schemeId
  ) => {
    try {
      const response = await api.post(
        baseURLReport + `pdmcWorkOrder`,
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

  const generateWorkOrderAcknowledgmentRH = async (applicationFormId, schemeId) => {
  try {
    // ✅ Get userId from localStorage
    const userId = localStorage.getItem("userMasterId");

    const response = await api.post(
      baseURLReport + `getWorkOrder`,
      {
        applicationFormId: applicationFormId,
        schemeId: schemeId,
        userId: userId, // ✅ Added userId
      },
      {
        responseType: "blob", // Force to receive data in a Blob Format
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (error) {
    console.error("Error generating work order acknowledgment:", error);
  }
};

const generateWorkOrderReelingShed = async (applicationFormId, schemeId,subSchemeId,categoryId) => {
  try {
    // ✅ Get userId from localStorage
    const userId = localStorage.getItem("userMasterId");

    const response = await api.post(
      baseURLReport + `getWorkOrderReelingShed`,
      {
        applicationFormId: applicationFormId,
        schemeId: schemeId,
        subSchemeId: subSchemeId,
        categoryId:categoryId // ✅ Added userId
      },
      {
        responseType: "blob", // Force to receive data in a Blob Format
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (error) {
    console.error("Error generating work order acknowledgment:", error);
  }
};

const generateWorkOrderOrderHRU = async (applicationFormId, schemeId,subSchemeId,categoryId) => {
  try {
    // ✅ Get userId from localStorage
    const userId = localStorage.getItem("userMasterId");

    const response = await api.post(
      baseURLReport + `getWorkOrderHRU`,
      {
        applicationFormId: applicationFormId,
        schemeId: schemeId,
        subSchemeId: subSchemeId,
        categoryId:categoryId // ✅ Added userId
      },
      {
        responseType: "blob", // Force to receive data in a Blob Format
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (error) {
    console.error("Error generating work order acknowledgment:", error);
  }
};


  // const handleGenerateSanctionOrder = (applicationFormId) => {
  //   Swal.fire({
  //     title: "Generate Sanction Order",
  //     text: "Select the recipient:",
  //     showCancelButton: true,
  //     confirmButtonText: "Farmer",
  //     cancelButtonText: "Company",
  //     showCloseButton: true,
  //   }).then((result) => {
  //     if (result.isConfirmed || result.dismiss === Swal.DismissReason.cancel) {
  //       generateSanctionOrderAcknowledgment(applicationFormId);
  //     }
  //   });
  // };
  // const handleGenerateSanctionOrder = (applicationFormId,schemeId) => {
  //   Swal.fire({
  //     title: "Generate Sanction Order",
  //     text: "Select the recipient:",
  //     showCancelButton: true,
  //     confirmButtonText: "Farmer",
  //     cancelButtonText: "Company",
  //     showCloseButton: true,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // Call the Farmer endpoint
  //       generateSanctionOrderAcknowledgment(applicationFormId, schemeId, "farmer");
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       // Call the Company endpoint
  //       generateSanctionOrderAcknowledgment(applicationFormId, schemeId, "company");
  //     }
  //   });
  // };

//   const handleGenerateSanctionOrderClick = () => {
//   const userId = localStorage.getItem("userMasterId");
//   handleGenerateSanctionOrder(
//     applicationId,
//     actionFarmerData[0]?.schemeId,
//     actionFarmerData[0]?.subSchemeId,
//     actionFarmerData[0]?.categoryId,
//     userId
//   );
// };

const handleGenerateSanctionOrderClick = async () => {
  const userId = localStorage.getItem("userMasterId");
  const scSubSchemeDetailsId = actionFarmerData[0]?.subSchemeId;

  // 🔴 Check from DB
  const isEnabled = await isSanctionEnabledFromDB(scSubSchemeDetailsId);

  if (!isEnabled) {
    Swal.fire({
      icon: "warning",
      title: "Sanction Not Allowed",
      text: "Sanction Order and Work Order are not enabled for this scheme.",
    });
    return; // ❌ STOP HERE
  }

  // ✅ Allowed → continue
  handleGenerateSanctionOrder(
    applicationId,
    actionFarmerData[0]?.schemeId,
    actionFarmerData[0]?.subSchemeId,
    actionFarmerData[0]?.categoryId,
    userId
  );
};
 

 const handleGenerateSanctionOrder = async (
  applicationFormId,
  schemeId,
  subSchemeId,
  categoryId
) => {
  // 🔴 HARD GUARD (centralized)
  const scSubSchemeDetailsId = actionFarmerData[0]?.subSchemeId;

  const isEnabled = await isSanctionEnabledFromDB(scSubSchemeDetailsId);

  if (!isEnabled) {
    Swal.fire({
      icon: "warning",
      title: "Sanction Not Allowed",
      text: "Sanction Order and Work Order are not enabled for this scheme.",
    });
    return; // ❌ STOP — Swal will NOT open
  }
  const schemeType = actionFarmerData[0]?.sanctionOrderForScheme;

    Swal.fire({
      title: "Generate Sanction Order",
      text: "Select the recipient:",
      showCancelButton: true,
      confirmButtonText: "Farmer/Reeler",
      cancelButtonText: "Company",
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the Farmer endpoint based on the scheme type
        if (schemeType === "PMKSY") {
          generateSanctionOrderAcknowledgment(
            applicationFormId,
            schemeId,
            "farmer",
            "PMKSY"
          );
        } else if (schemeType === "PDMC") {
          generateSanctionOrderAcknowledgment(
            applicationFormId,
            schemeId,
            "farmer",
            "PDMC"
          );
        } else if (
          schemeType === "Silk Samagra State" ||
          schemeType === "Silk Samagra Central"
        ) {
          generateSanctionOrderAcknowledgment(
            applicationFormId,
            schemeId,
            "farmer",
            schemeType,
            subSchemeId,
            categoryId
          );
        } else {
          console.error("Unknown scheme type for farmer sanction order.");
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Call the Company endpoint based on the scheme type
        if (schemeType === "PMKSY") {
          generateSanctionOrderAcknowledgment(
            applicationFormId,
            schemeId,
            "company",
            "PMKSY"
          );
        } else if (schemeType === "PDMC") {
          generateSanctionOrderAcknowledgment(
            applicationFormId,
            schemeId,
            "company",
            "PDMC"
          );
        } else if (
          schemeType === "Silk Samagra State" ||
          schemeType === "Silk Samagra Central"
        ) {
          generateSanctionOrderAcknowledgment(
            applicationFormId,
            schemeId,
            subSchemeId,
            categoryId,
            "company",
            schemeType
          );
        } 
        else if (
          schemeType === "Reeling Shed-PSF"
        ) {
          generateSanctionOrderAcknowledgment(
            applicationFormId,
            schemeId,
            subSchemeId,
            categoryId,
            "company",
            schemeType
          );
        }
        else if (
          schemeType === "Adopting Heat Recovery Unit-PSF"
        ) {
          generateSanctionOrderAcknowledgment(
            applicationFormId,
            schemeId,
            subSchemeId,
            categoryId,
            "company",
            schemeType
          );
        }
        else if (
          schemeType === "Registered Private Bivoltine Chawki Rearing Center Subsidy"
        ) {
          generateSanctionOrderAcknowledgment(
            applicationFormId,
            schemeId,
            subSchemeId,
            categoryId,
            "company",
            schemeType
          );
        }
        else if (
          schemeType === "Rearing Equipment SS"
        ) {
          generateSanctionOrderAcknowledgment(
            applicationFormId,
            schemeId,
            subSchemeId,
            categoryId,
            "company",
            schemeType
          );
        }
        else {
          console.error("Unknown Scheme type for company sanction order.");
        }
      }
    });
  };

 


  // const downloadSanctionOrderAcknowledgment = async (
  //   applicationId,
  //   schemeId,
  //   recipientType,
  //   schemeType
  // ) => {
  //   try {
  //     // Determine the appropriate endpoint based on the recipient type and scheme type
  //     let endpoint;
  //     // if (recipientType === "farmer") {
  //     //   endpoint =
  //     //     schemeType === "PMKSY"
  //     //       ? baseURLReport + `getSanctionOrderPmksy`
  //     //       : baseURLReport + `getSanctionOrderPDMC`;
  //     // } else if (recipientType === "company") {
  //     //   endpoint =
  //     //     schemeType === "PMKSY"
  //     //       ? baseURLReport + `getSanctionOrderPmksyCompany`
  //     //       : baseURLReport + `getSanctionOrderPDMCCompany`;
  //     // } else {
  //     //   throw new Error("Invalid recipient type.");
  //     // }
  //     if (
  //       schemeType === "Silk Samagra State" ||
  //       schemeType === "Silk Samagra Central"
  //     ) {
  //       endpoint = baseURLReport + `getSanctionOrderRH`; // Call the API for Silk Samagra RH
  //     } else {
  //       if (recipientType === "farmer") {
  //         endpoint =
  //           schemeType === "PMKSY"
  //             ? baseURLReport + `getSanctionOrderPmksy`
  //             : baseURLReport + `getSanctionOrderPDMC`;
  //       } else if (recipientType === "company") {
  //         endpoint =
  //           schemeType === "PMKSY"
  //             ? baseURLReport + `getSanctionOrderPmksyCompany`
  //             : baseURLReport + `getSanctionOrderPDMCCompany`;
  //       } else {
  //         throw new Error("Invalid recipient type.");
  //       }
  //     }

  //     const response = await api.post(
  //       endpoint,
  //       {
  //         applicationFormId: applicationId,
  //         schemeId: schemeId,
  //       },
  //       {
  //         responseType: "blob", // Force to receive data in a Blob Format
  //       }
  //     );

  //     const file = new Blob([response.data], { type: "application/pdf" });
  //     const fileURL = URL.createObjectURL(file);
  //     window.open(fileURL);
  //   } catch (error) {
  //     console.error("Error generating sanction order:", error);
  //   }
  // };

 

  const generateSanctionOrderAcknowledgment = async (
  applicationId,
  schemeId,
  recipientType,
  schemeType,
  subSchemeId,
  categoryId
) => {
  try {
    const userId = localStorage.getItem("userMasterId");
    let endpoint;

    // -------------------------------
    // 1️⃣ Silk Samagra Schemes
    // -------------------------------
    if (
      schemeType === "Silk Samagra State" ||
      schemeType === "Silk Samagra Central"
    ) {
      endpoint = baseURLReport + `getSanctionOrderRH`;

    }
    // -------------------------------
    // 2️⃣ PSF Schemes
    // -------------------------------
    else if (schemeType === "Reeling Shed-PSF") {
      endpoint = baseURLReport + `sanction-psfa-reeling-shed`;  // ✅ NEW

    } else if (schemeType === "Adopting Heat Recovery Unit-PSF") {
      endpoint = baseURLReport + `sanction-heat-unit`;          // ✅ NEW

    }

    else if (schemeType === "Registered Private Bivoltine Chawki Rearing Center Subsidy") {
      endpoint = baseURLReport + `getChawkiSanctionOrderPdf`;
    }
    else if (schemeType === "Rearing Equipment SS") {
      endpoint = baseURLReport + `getSanctionOrderRHEquipment`;
    }
    // -------------------------------
    // 3️⃣ PMKSY / PDMC (farmer/company)
    // -------------------------------
    else {
      if (recipientType === "farmer") {
        endpoint =
          schemeType === "PMKSY"
            ? baseURLReport + `getSanctionOrderPmksy`
            : baseURLReport + `getSanctionOrderPDMC`;
      } else if (recipientType === "company") {
        endpoint =
          schemeType === "PMKSY"
            ? baseURLReport + `getSanctionOrderPmksyCompany`
            : baseURLReport + `getSanctionOrderPDMCCompany`;
      } else {
        throw new Error("Invalid recipient type.");
      }
    }

    // -------------------------------
    // Build Payload
    // -------------------------------
    const payload =
      schemeType === "Silk Samagra State" ||
      schemeType === "Silk Samagra Central" ||
      schemeType === "Reeling Shed-PSF" ||
      schemeType === "Adopting Heat Recovery Unit-PSF" ||
      schemeType === "Registered Private Bivoltine Chawki Rearing Center Subsidy" ||  // NEW
      schemeType === "Rearing Equipment SS"
        ? {
            applicationFormId: applicationId,
            schemeId,
            subSchemeId,
            categoryId,
            userId,
          }
        : {
            applicationFormId: applicationId,
            schemeId,
          };

    // -------------------------------
    // Call API & Open PDF
    // -------------------------------
    const response = await api.post(endpoint, payload, {
      responseType: "blob",
    });

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (error) {
    console.error("Error generating sanction order:", error);
  }
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

  // Add this at the beginning of your component to manage the disabled state
  const [fieldsDisabled, setFieldsDisabled] = useState(false);

  const [fieldsSanctionOrderDisabled, setFieldsSanctionOrderDisabled] =
    useState(false);

  const handleActionInputs = (e) => {
    let { name, value } = e.target;
    setActionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // if (name === "rejectType" && value === "Permanent") {
    //   setFieldsDisabled(true);
    // } else if (name === "rejectType" && value !== "Permanent") {
    //   setFieldsDisabled(false);
    // }
    if (name === "rejectType") {
      if (value === "Permanent") {
        setFieldsDisabled(true);
        setDisplaySubmit(false);
        getApprovalAfterStageNextStepList(subSchemeId, approvalStageId); // Calls after-next-step function for "Permanent"
      } else if (value === "Objection") {
        setFieldsDisabled(false);
        getApprovalRejectStageBeforeStepListDataList(
          subSchemeId,
          approvalStageId
        ); // Calls before-step function for "Objection"
      } else if (value === "") {
        setFieldsDisabled(true);
        setDisplaySubmit(true);
        setActionData((prevData) => ({
          ...prevData,
          comment: "",
          rejectReasonWorkflowMasterId: "",
        }));
      } else {
        setFieldsDisabled(false);
      }
    }

    // Update approvalStageId based on the selected approval stage
    if (name === "stepId") {
      setApprovalStageId(value);
      // If rejectType is "Objection", fetch users when the approval stage is selected
      if (actionData.rejectType === "Objection") {
        // const districtId = 16;
        // const talukId = 105;
        getUserFromDistrictList(subSchemeId, value, districtId, talukId); // Call to fetch users
      }
    }
  };

  // const rejectServiceApplication = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);
  //   } else {
  //     event.preventDefault();

  //     // const applicationFormId = assignData.applicationFormId || row?.applicationDocumentId;

  //     const sendPost = {
  //       applicationFormId: applicationFormId,
  //       rejectedReasonId: actionData.rejectReasonWorkflowMasterId,
  //       description: actionData.comment,
  //     };
  //     api
  //       .post(baseURLDBT + `service/rejectServiceApplication`, sendPost)
  //       .then((response) => {
  //         if (response.data.errorCode === -1) {
  //           saveError(response.data.errorMessages[0]);
  //         } else if (response.data && response.data.error) {
  //           saveError(response.data.error_description);
  //         } else {
  //           saveAssignSuccess();
  //           clear();
  //           setValidated(false);
  //         }
  //       })
  //       .catch((err) => {
  //         if (
  //           err.response &&
  //           err.response &&
  //           err.response.data &&
  //           err.response.data.validationErrors
  //         ) {
  //           if (Object.keys(err.response.data.validationErrors).length > 0) {
  //             saveError(err.response.data.validationErrors);
  //           }
  //         }
  //       });
  //     setValidated(true);
  //   }
  // };

  const rejectServiceApplication = () => {
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
      if (result.value) {
        api
          .post(`${baseURLDBT}service/rejectServiceApplication`, sendPost)
          .then((response) => {
            if (response.data.errorCode === -1) {
              saveError(response.data.errorMessages[0]);
              setDisplaySubmit(false);
            } else if (response.data && response.data.error) {
              saveError(response.data.error_description);
              setDisplaySubmit(false);
            } else {
              saveRejectSuccess();
              clear();
              setDisplaySubmit(false);
              handleCloseModal();
              getList();
              setValidated(false);
            }
          })
          .catch((err) => {
            if (
              err.response &&
              err.response.data &&
              err.response.data.validationErrors
            ) {
              saveError(err.response.data.validationErrors);
            }
            setDisplaySubmit(false);
          });
      }
    });
  };

  const handlePushToDbtInputs = (e) => {
    let { name, value } = e.target;
    setPushToDbtData((prev) => ({ ...prev, [name]: value }));
  };

  const [assignData, setAssignData] = useState({
    applicationFormId: "",
    userId: "",
  });

  const handleAssignInputs = (e) => {
    let { name, value } = e.target;
    setAssignData({ ...assignData, [name]: value });
  };

  //   const applicationDocumentId = data[0]?.applicationDocumentId; // Use data variable here
  // setApplicationFormId(applicationDocumentId);


  const postData = (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();

      // const applicationFormId = assignData.applicationFormId || row?.applicationDocumentId;

      const sendPost = {
        applicationFormId,
        userId: assignData.userId,
      };
      api
        .post(baseURLDBT + `service/reassignToUser`, sendPost)
        .then((response) => {
          if (response.data.errorCode === -1) {
            saveError(response.data.errorMessages[0]);
          } else if (response.data && response.data.error) {
            saveError(response.data.error_description);
          } else {
            saveAssignSuccess();
            clear();
            setValidated(false);
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
      setValidated(true);
    }
  };

  // const { subSchemeId, approvalStageId } = actionData;

  const [pushToDbtData, setPushToDbtData] = useState({
    row: "",
    paymentTo: "",
    paymentMethod: "",
    dateOfPayment: "",
    referenceNo: "",
    schemeAmount: "",
  });

  const [dbtPushedList, setDbtPushedList] = useState([]);

  const addToList = (e) => {
    e.preventDefault();
    setDbtPushedList((prev) => [...prev, pushToDbtData]);
    setSendApplicationFormServiceData((prev) => {
      const updatedData = [...prev];
      updatedData[pushToDbtData.row] = {
        ...updatedData[pushToDbtData.row],
        ...pushToDbtData,
      };
      return updatedData;
    });
    setPushToDbtData({
      row: "",
      paymentTo: "",
      paymentMethod: "",
      dateOfPayment: "",
      referenceNo: "",
      schemeAmount: "",
    });
    handleCloseModal3();
  };

  // console.log("dbtPushedList",dbtPushedList);

  // const postActionData = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);
  //   } else {
  //     event.preventDefault();

  //     const sendResponse = sendApplicationFormServiceData.map((item) => {
  //       return {
  //         schemeQuotaId: item.schemeQuotaId,
  //         schemeAmount: item.schemeAmount,
  //         paymentTo: item.paymentTo,
  //         paymentMethod: item.paymentMethod,
  //         dateOfPayment: item.dateOfPayment,
  //         referenceNo: item.referenceNo,
  //       };
  //     });

  //     let sendPost;
  //     if (actionFarmerData[0].pushToDbt) {
  //       const sendData = sendApplicationFormServiceData.map((item) => {
  //         return {
  //           applicationFormId: item.scApplicationFormId,
  //           schemeAmount: item.schemeAmount,
  //           paymentTo: item.paymentTo,
  //           paymentMethod: item.paymentMethod,
  //           dateOfPayment: item.dateOfPayment,
  //           referenceNo: item.referenceNo,
  //         };
  //       });
  //       sendPost = sendData;
  //     } else {
  //       sendPost = {
  //         description: actionData.comment,
  //         rejectedReasonId: actionData.rejectReasonWorkflowMasterId,
  //         // applicationFormId: actionData.applicationFormId,
  //         applicationFormId: applicationFormId,
  //         workOrderNumber: actionData.workOrderNumber,
  //         sanctionOrderNumber: actionData.sanctionOrderNumber,
  //         userId: actionData.userId,
  //         stepId: actionData.stepId,
  //         pushToDBTRequestList: sendResponse,
  //         // pushToDBTRequestList: dbtPushedList,
  //         // paymentTo: actionData.paymentTo,
  //         // paymentMethod: actionData.paymentMethod,
  //         // dateOfPayment: actionData.dateOfPayment,
  //         // referenceNo: actionData.referenceNo,
  //       };
  //     }

  //     let apiCall;

  //     if (actionFarmerData.length > 0) {
  //       // const workFlowType = actionFarmerData[0].workFlowType;
  //       // Need to ask Sathish do we need to call multiple APIs based on work flow types

  //       if (actionFarmerData[0].workOrder) {
  //         apiCall = api.post(baseURLDBT + `service/workOrderUpdate`, sendPost);
  //       }
  //       if (actionFarmerData[0].sanctionOrder) {
  //         apiCall = api.post(
  //           baseURLDBT + `service/sanctionOrderUpdate`,
  //           sendPost
  //         );
  //       }
  //       if (actionFarmerData[0].pushToDbt) {
  //         apiCall = api.post(baseURLDBT + `service/pushToDBT`, sendPost);
  //       }
  //     }

  //     if (apiCall) {
  //       apiCall
  //         .then((response) => {
  //           if (response.data.errorCode === -1) {
  //             saveError(response.data.errorMessages[0]);
  //           } else if (response.data.error) {
  //             saveError(response.data.error_description);
  //           } else {
  //             // Generate the acknowledgment after a successful work order update
  //             if (actionFarmerData[0].workOrder) {
  //               generateWorkOrderAcknowledgment(applicationFormId);
  //             }

  //             saveSuccess();

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
  const [applicationId, setApplicationId] = useState(null);
  const [showModal6, setShowModal6] = useState(false);
  const handleShowModal6 = () => setShowModal6(true);
  const handleCloseModal6 = () => setShowModal6(false);

  const saveApplicationForm = (data, i) => {
    const updatedData = [...sendApplicationFormServiceData];
    if (i < updatedData.length) {
      updatedData[i] = { ...data };
    } else {
      updatedData.push({ ...data });
    }
    const sendResponse = updatedData.map((item) => {
      return {
        schemeQuotaId: item.schemeQuotaId,
        // schemeAmount: item.subsidyAmount,
        // schemeAmount: item.schemeAmount,
        schemeAmount: item.subsidyAmount,
        eligibleAmount: item.calculatedEligibleAmount,
        paymentTo: item.paymentTo,
        paymentMethod: item.paymentMethod,
        dateOfPayment: item.dateOfPayment,
        referenceNo: item.referenceNo,
      };
    });

    const sendData = {
      description: actionData.comment,
      rejectedReasonId: actionData.rejectReasonWorkflowMasterId,
      applicationFormId: applicationFormId,
      workOrderNumber: actionData.workOrderNumber,
      sanctionOrderNumber: actionData.sanctionOrderNumber,
      userId: actionData.userId,
      stepId: actionData.stepId,
      eligibleAmount: actionData.eligibleAmount,
      pushToDBTRequestList: sendResponse,
    };

    api
      .post(baseURLDBT + `service/pushToDBTDirectlyToFruits`, sendData)
      .then((response) => {
        getActionFarmerList(
          changeable.fid,
          changeable.schemeId,
          changeable.componentType
        );
      })
      .catch((err) => {
        saveError(
          err.response?.data?.error_description ||
            "Sanction Order Update Failed"
        );
      });
  };

  // const postActionData = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);
  //   } else {
  //     event.preventDefault();
  //     setDisplaySubmit(true);
  //     // Check if Reject Type is "Permanent", then call rejectServiceApplication
  //     if (actionData.rejectType === "Permanent") {
  //       rejectServiceApplication();
  //       return;
  //     }

  //     // const sendResponse = sendApplicationFormServiceData.map((item) => {
  //     //   return {
  //     //     schemeQuotaId: item.schemeQuotaId,
  //     //     componentType: item.schemeQuotaId,
  //     //     schemeAmount: item.subsidyAmount,
  //     //     eligibleAmount: item.calculatedEligibleAmount,
  //     //     paymentTo: item.paymentTo,
  //     //     paymentMethod: item.paymentMethod,
  //     //     dateOfPayment: item.dateOfPayment,
  //     //     referenceNo: item.referenceNo,
  //     //   };
  //     // });
  //     const sendResponse = sendApplicationFormServiceData
  //     .filter(item => item) // ensures no nulls
  //     .map((item) => {
  //       return {
  //         schemeQuotaId: item.schemeQuotaId,
  //         componentType: item.schemeQuotaId,
  //         schemeAmount: item.subsidyAmount,
  //         eligibleAmount: item.calculatedEligibleAmount,
  //         paymentTo: item.paymentTo,
  //         paymentMethod: item.paymentMethod,
  //         dateOfPayment: item.dateOfPayment,
  //         referenceNo: item.referenceNo,
  //       };
  //     });

  //     let sendPost;
  //     if (actionFarmerData[0].pushToDbt) {
  //       const sendData = sendApplicationFormServiceData.map((item) => {
  //         return {
  //           applicationFormId: item.applicationFormId,
  //           componentType: item.schemeQuotaId,
  //           schemeAmount: item.subsidyAmount,
  //           eligibleAmount: item.calculatedEligibleAmount,
  //           paymentTo: item.paymentTo,
  //           paymentMethod: item.paymentMethod,
  //           dateOfPayment: item.dateOfPayment,
  //           referenceNo: item.referenceNo,
  //           categoryId: item.categoryId,
  //           componentId: item.componentId,
  //           schemeId: item.schemeId,
  //         };
  //       });
  //       sendPost = sendData;
  //     } else if (actionFarmerData[0].directlyToFruits) {
  //       const paymentType = actionData.schemeQuotaPaymentType;
  //       const ddoCodeToSend =
  //       paymentType === "B"
  //         ? reportingOfficerDdoCode
  //         : paymentType === "K"
  //         ? reportingOfficerKhazaneRecipientId
  //         : null;

  //          if (!ddoCodeToSend) {
  //           warningAlert("Unable to determine DDO Code from payment type", "Alert!!!");
  //           return;
  //         }

  //       sendPost = {
  //         applicationList: [actionFarmerData[0]?.applicationFormId],
  //         userMasterId: localStorage.getItem("userMasterId"),
  //         paymentMode: "P",
  //         pushType: "P",
  //         // ddoCode: reportingOfficerDdoCode,
  //         ddoCode: ddoCodeToSend,
  //         sanctionNo: actionData.sanctionNo,
  //         categoryId: actionFarmerData[0]?.categoryId,
  //         componentId: actionFarmerData[0]?.componentId,
  //         schemeId: actionFarmerData[0]?.schemeId,
  //         componentType: actionFarmerData[0]?.componentType,
  //       };
  //     } else {
  //       sendPost = {
  //         description: actionData.comment,
  //         rejectedReasonId: actionData.rejectReasonWorkflowMasterId,
  //         applicationFormId: applicationFormId,
  //         workOrderNumber: actionData.workOrderNumber,
  //         sanctionOrderNumber: actionData.sanctionOrderNumber,
  //         userId: actionData.userId,
  //         stepId: actionData.stepId,
  //         eligibleAmount: actionData.eligibleAmount,
  //         pushToDBTRequestList: sendResponse,
  //       };
  //     }

  //     let apiCall;

  //     // Check if all conditions are null/false, if so, call inspection update API
  //     // if (
  //     //   !actionFarmerData[0].pushToDbt &&
  //     //   !actionFarmerData[0].sanctionOrder &&
  //     //   !actionFarmerData[0].workOrder
  //     // ) {
  //     //   apiCall = api.post(baseURLDBT + `service/inspectionUpdate`, sendPost);
  //     // } else {
  //     // First condition: If pushToDbt, sanctionOrder, and workOrder are not present, call inspectionUpdate
  //     if (
  //       !actionFarmerData[0].pushToDbt &&
  //       !actionFarmerData[0].sanctionOrder &&
  //       !actionFarmerData[0].workOrder &&
  //       !actionFarmerData[0].directlyToFruits
  //     ) {
  //       apiCall = api.post(baseURLDBT + `service/inspectionUpdate`, sendPost);
  //     } else {
  //       // Second condition: If sanctionOrder exists and approval failed, call inspectionUpdate instead of sanctionOrderUpdate
  //       if (
  //         actionFarmerData[0].sanctionOrder && // Check if sanctionOrder is true
  //         actionFarmerData[0].financialDelegation && // Check if financialDelegation is true
  //         !isSanctionOrderAllowed // Check if isSanctionOrderAllowed is false
  //         (!isSanctionOrderAllowed || actionFarmerData[0].sanctionOrderNumber)
  //       ) 
  //       {
  //         apiCall = api
  //           .post(baseURLDBT + `service/inspectionUpdate`, sendPost)
  //           .then((response) => {
  //             saveSuccess(
  //               "Please forward the request to the higher authority to initiate the generation of the sanction order and submit it to FRUITS."
  //             );
  //             clear();
  //             setValidated(false);
  //             getList();
  //           })
  //           .catch((err) => {
  //             saveError(
  //               err.response?.data?.error_description ||
  //                 "Inspection Update Failed"
  //             );
  //           });
  //       } else {
  //         if (actionFarmerData[0].workOrder) {
  //           apiCall = api.post(
  //             baseURLDBT + `service/workOrderUpdate`,
  //             sendPost
  //           );
  //         }
  //         // if (actionFarmerData[0].sanctionOrder) {
  //         //   apiCall = api.post(
  //         //     baseURLDBT + `service/sanctionOrderUpdate`,
  //         //     sendPost
  //         //   );
  //         // }
  //         if (actionFarmerData[0].sanctionOrder) {
  //           if (sendPost.pushToDBTRequestList.length === 0) {
  //             warningAlert("Please select the scheme", "Alert!!!");
  //             return;
  //           } else if (
  //             schemeQuotaListCount !== sendPost.pushToDBTRequestList.length
  //           ) {
  //             warningAlert("Select all schemes to proceed", "Alert!!!");
  //             return;
  //           }

  //           apiCall = api
  //             .post(baseURLDBT + `service/sanctionOrderUpdate`, sendPost)
  //             .then((response) => {
  //               if (response.data.applicationFormId) {
  //                 // Update state with the generated applicationId
  //                 setApplicationId(response.data.applicationFormId);
  //                 // Pass the applicationId to handleGenerateSanctionOrder
  //                 handleGenerateSanctionOrder(
  //                   response.data.applicationFormId,
  //                   schemeId
  //                 );
  //                 setDisplaySubmit(false);
  //                 getList();
  //               } else {
  //                 saveError(
  //                   "Failed to generate application ID for sanction order."
  //                 );
  //                 setDisplaySubmit(false);
  //               }
  //             })
  //             .catch((err) => {
  //               saveError(
  //                 err.response?.data?.error_description ||
  //                   "Sanction Order Update Failed"
  //               );
  //               setDisplaySubmit(false);
  //             });
  //         }

  //         if (actionFarmerData[0].directlyToFruits) {
  //           // if (sendPost.sanctionNo == 0 || !sendPost.sanctionNo) {
  //           //   warningAlert("Please Enter The Sanction Number", "Alert!!!");
  //           //   return;
  //           // }
  //           apiCall = api
  //             .post(
  //               baseURLDBT +
  //                 `applicationTransaction/saveApplicationTransaction`,
  //               sendPost
  //             )
  //             .then((response) => {
  //               if (response.data.content.errorCode) {
  //                 saveError(response.data.content.error_description);
  //                 setDisplaySubmit(false);
  //               } else {
  //                 pushedSuccess(
  //                   checkFileDetails.beneficiaryId,
  //                   checkFileDetails.farmerRegNo
  //                 );
  //                 setDisplaySubmit(false);
  //                 getList();
  //               }
  //             })
  //             .catch((err) => {
  //               // For testing purpose Uncomment saveError and delete pushedSuccess
  //               saveError(
  //                 err.response?.data?.error_description ||
  //                   "Sanction Order Update Failed"
  //               );
  //               setDisplaySubmit(false);
  //               // pushedSuccess(checkFileDetails.beneficiaryId,checkFileDetails.farmerRegNo);
  //             });
  //         }
  //       }
  //       if (actionFarmerData[0].pushToDbt) {
  //         apiCall = api.post(baseURLDBT + `service/pushToDBT`, sendPost);
  //       }
  //     }

  //     if (apiCall) {
  //       apiCall
  //         .then((response) => {
  //           if (response.data.errorCode === -1) {
  //             saveError(response.data.errorMessages[0]);
  //           } else if (response.data.error) {
  //             saveError(response.data.error_description);
  //           } else {
  //             // Generate the acknowledgment after a successful work order update
  //             // if (actionFarmerData[0].workOrder) {
  //             //   generateWorkOrderAcknowledgment(applicationFormId,schemeId);
  //             // }
  //             // if (
  //             //   actionFarmerData[0].workOrder &&
  //             //   actionFarmerData[0].workOrderForScheme === "PDMC"
  //             // ) {
  //             //   generateWorkOrderAcknowledgment(applicationFormId, schemeId); // Pass schemeId to API
  //             // }
  //             if (actionFarmerData[0].workOrder) {
  //               if (
  //                 actionFarmerData[0].workOrderForScheme === "PDMC" ||
  //                 actionFarmerData[0].workOrderForScheme === "PMKSY"
  //               ) {
  //                 generateWorkOrderAcknowledgment(
  //                   applicationFormId,
  //                   workOrderSchemeId
  //                 );
  //               } else if (
  //                 actionFarmerData[0].workOrderForScheme ===
  //                   "Silk Samagra State" ||
  //                 actionFarmerData[0].workOrderForScheme ===
  //                   "Silk Samagra Central"
  //               ) {
  //                 generateWorkOrderAcknowledgmentRH(
  //                   applicationFormId,
  //                   workOrderSchemeId
  //                 );
  //               }
  //             }

  //             saveSuccess();
  //             getList();
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
  const [canSubmit, setCanSubmit] = useState(true);

   const isUserValid = React.useMemo(() => {
  return actionData.userId !== "" && actionData.userId !== null && actionData.userId !== undefined;
}, [actionData.userId]);


  const showDefaultUserField = !allowAnyUser;

  const postActionData = (event) => {
  const form = event.currentTarget;


  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
  } else {
    event.preventDefault();

    if (allowAnyUser && !isUserValid) {
      setValidated(true);
      return;
    }

    setDisplaySubmit(true);

    const missingOfficer = pushToDBTListData.some((row, index) => {
    if (schemeDataListIds.includes(index)) {
      return !row.userId || row.userId === "";
    }
    return false;
  });

  if (missingOfficer) {
    Swal.fire({
      icon: "warning",
      title: "Drawing Officer Required",
      text: "Please select Drawing Officer for all selected schemes before submitting!"
    });

    setDisplaySubmit(false);
    return; // Stop further execution
  }

    // Check if Reject Type is "Permanent", then call rejectServiceApplication
    if (actionData.rejectType === "Permanent") {
      rejectServiceApplication();
      return;
    }

    // Prepare common pushToDBTRequestList
    // const sendResponse = sendApplicationFormServiceData
    //   .filter(item => item) // ensures no nulls
    //   .map((item, index) => {
    //     return {
    //       schemeQuotaId: item.schemeQuotaId,
    //       componentType: item.schemeQuotaId,
    //       schemeAmount: item.subsidyAmount,
    //       eligibleAmount: item.calculatedEligibleAmount,
    //       paymentTo: item.paymentTo,
    //       paymentMethod: item.paymentMethod,
    //       dateOfPayment: item.dateOfPayment,
    //       referenceNo: item.referenceNo,
    //       userId: pushToDBTListData[index]?.userId || "",
    //       schemeQuotaType: item.schemeQuotaType,
    //       shareInPercentage: item.shareInPercentage,
    //     };
    //   });

    const selectedRows = pushToDBTListData.filter((_, index) =>
        schemeDataListIds.includes(index)
      );

      const sendResponse = selectedRows.map((item) => ({
        schemeQuotaId: item.schemeQuotaId,
        componentType: item.schemeQuotaId,
        schemeAmount: item.subsidyAmount,
        eligibleAmount: item.calculatedEligibleAmount,
        paymentTo: item.paymentTo,
        paymentMethod: item.paymentMethod,
        dateOfPayment: item.dateOfPayment,
        referenceNo: item.referenceNo,
        userId: item.userId || "",
        schemeQuotaType: item.schemeQuotaType,
        shareInPercentage: item.shareInPercentage,
      }));
    let sendPost;

    if (actionFarmerData[0].pushToDbt) {
      const sendData = sendApplicationFormServiceData.map((item) => {
        return {
          applicationFormId: item.applicationFormId,
          componentType: item.schemeQuotaId,
          schemeAmount: item.subsidyAmount,
          eligibleAmount: item.calculatedEligibleAmount,
          paymentTo: item.paymentTo,
          paymentMethod: item.paymentMethod,
          dateOfPayment: item.dateOfPayment,
          referenceNo: item.referenceNo,
          categoryId: item.categoryId,
          componentId: item.componentId,
          schemeId: item.schemeId,
        };
      });
      sendPost = sendData;
    } else if (actionFarmerData[0].directlyToFruits) {
      const paymentType = actionData.schemeQuotaPaymentType;
      const ddoCodeToSend =
        paymentType === "B"
          ? reportingOfficerDdoCode
          : paymentType === "K"
          ? reportingOfficerKhazaneRecipientId
          : null;

      if (!ddoCodeToSend) {
        warningAlert("Unable to determine DDO Code from payment type", "Alert!!!");
        return;
      }

      sendPost = {
        applicationList: [actionFarmerData[0]?.applicationFormId],
        userMasterId: localStorage.getItem("userMasterId"),
        paymentMode: "P",
        pushType: "P",
        ddoCode: ddoCodeToSend,
        sanctionNo: actionData.sanctionNo,
        proposalDate: actionData.proposalDate,
        userId: actionData.userId,
        // userId: selectedUserId, 
        stepId: actionData.stepId,
        selectionLetterDate: actionData.selectionLetterDate,
        ejectedReasonId: actionData.rejectReasonWorkflowMasterId,
        description: actionData.comment,
        categoryId: actionFarmerData[0]?.categoryId,
        componentId: actionFarmerData[0]?.componentId,
        schemeId: actionFarmerData[0]?.schemeId,
        componentType: actionFarmerData[0]?.componentType,
      };
    } else {
      // get the first row's selected userId

      sendPost = {
        proposalDate: actionData.proposalDate,
        selectionLetterDate: actionData.selectionLetterDate,
        description: actionData.comment,
        rejectedReasonId: actionData.rejectReasonWorkflowMasterId,
        applicationFormId: applicationFormId,
        workOrderNumber: actionData.workOrderNumber,
        sanctionOrderNumber: actionData.sanctionOrderNumber,
        userId: actionData.userId,
        // userId: selectedUserId, 
        stepId: actionData.stepId,
        sanctionNo: actionData.sanctionNo,
        eligibleAmount: actionData.eligibleAmount,
        pushToDBTRequestList: sendResponse,
      };
    }

    let apiCall;

    // Case 1: inspectionUpdate (no pushToDbt, no sanctionOrder, no workOrder, no directlyToFruits)
    if (
      !actionFarmerData[0].pushToDbt &&
      !actionFarmerData[0].sanctionOrder &&
      !actionFarmerData[0].workOrder &&
      !actionFarmerData[0].directlyToFruits
    ) {
      apiCall = api.post(baseURLDBT + `service/inspectionUpdate`, sendPost);
    } else {
      // Case 2: workOrder update
      // if (actionFarmerData[0].workOrder) {
      //   apiCall = api.post(baseURLDBT + `service/workOrderUpdate`, sendPost);
      // }
      if (actionFarmerData[0]?.workOrder) {

        if (!actionFarmerData[0]?.financialDelegation) {
          // financialDelegation false → always WorkOrder API
          apiCall = api.post(baseURLDBT + `service/workOrderUpdate`, sendPost);

        } else if (actionFarmerData[0]?.financialDelegation && isSanctionOrderAllowed) {
          // financialDelegation true and allowed
          apiCall = api.post(baseURLDBT + `service/workOrderUpdate`, sendPost);

        } else {
          // financialDelegation true but not allowed
          apiCall = api.post(baseURLDBT + `service/inspectionUpdate`, sendPost);
        }

      }

      // Case 3: sanctionOrder update 
      // if (actionFarmerData[0].sanctionOrder) {
      //   if (sendPost.pushToDBTRequestList.length === 0) {
      //     warningAlert("Please select the scheme", "Alert!!!");
      //     setDisplaySubmit(false);
      //     return;
      //   } else if (
      //     schemeQuotaListCount !== sendPost.pushToDBTRequestList.length
      //   ) {
      //     warningAlert("Select all schemes to proceed", "Alert!!!");
      //     setDisplaySubmit(false);
      //     return;
      //   }

      // if (
      //   actionFarmerData[0]?.sanctionOrder &&
      //   actionFarmerData[0]?.financialDelegation &&
      //   isSanctionOrderAllowed
      // ) {
      //   if (sendPost.pushToDBTRequestList.length === 0) {
      //     warningAlert("Please select the scheme", "Alert!!!");
      //     setDisplaySubmit(false);
      //     return;
      //   } else if (
      //     schemeQuotaListCount !== sendPost.pushToDBTRequestList.length
      //   ) {
      //     warningAlert("Select all schemes to proceed", "Alert!!!");
      //     setDisplaySubmit(false);
      //     return;
      //   // }
      //   }

        
      //   apiCall = api
      //     .post(baseURLDBT + `service/sanctionOrderUpdate`, sendPost)
      //     .then((response) => {
      //       if (response.data.applicationFormId) {
      //         setApplicationId(response.data.applicationFormId);
      //         handleGenerateSanctionOrder(
      //           response.data.applicationFormId,
      //           schemeId
      //         );
      //         setDisplaySubmit(false);
      //         getList();
      //         handleCloseModal();
      //       } else {
      //         saveError("Failed to generate application ID for sanction order.");
      //         setDisplaySubmit(false);
      //       }
      //     })
      //     .catch((err) => {
      //       saveError(
      //         err.response?.data?.error_description ||
      //           "Sanction Order Update Failed"
      //       );
      //       setDisplaySubmit(false);
      //     });
      // }

      // Case 3: sanctionOrder update
    if (actionFarmerData[0]?.sanctionOrder) {
      if (actionFarmerData[0]?.financialDelegation && isSanctionOrderAllowed) {
        // Only call sanctionOrderUpdate if financialDelegation && isSanctionOrderAllowed
        if (sendPost.pushToDBTRequestList.length === 0) {
          warningAlert("Please select the scheme", "Alert!!!");
          setDisplaySubmit(false);
          return;
        } else if (schemeQuotaListCount !== sendPost.pushToDBTRequestList.length) {
          warningAlert("Select all schemes to proceed", "Alert!!!");
          setDisplaySubmit(false);
          return;
        }

        apiCall = api
          .post(baseURLDBT + `service/sanctionOrderUpdate`, sendPost)
          .then((response) => {
            if (response.data.applicationFormId) {
              setApplicationId(response.data.applicationFormId);
              handleGenerateSanctionOrder(
                response.data.applicationFormId,
                schemeId,
                actionFarmerData[0]?.subSchemeId,
                actionFarmerData[0]?.categoryId
              );
              setDisplaySubmit(false);
              getList();
              handleCloseModal();
            } else {
              saveError("Failed to generate application ID for sanction order.");
              setDisplaySubmit(false);
            }
          })
          .catch((err) => {
            saveError(
              err.response?.data?.error_description || "Sanction Order Update Failed"
            );
            setDisplaySubmit(false);
          });
      } else {
        // financialDelegation false or isSanctionOrderAllowed false → fallback to inspectionUpdate
        apiCall = api.post(baseURLDBT + `service/inspectionUpdate`, sendPost);
      }
    }


      // Case 4: directly to fruits
      if (actionFarmerData[0].directlyToFruits) {
        apiCall = api
          .post(
            baseURLDBT + `applicationTransaction/saveApplicationTransactionForRH`,
            sendPost
          )
          .then((response) => {
            if (response.data.content.errorCode) {
              saveError(response.data.content.error_description);
              setDisplaySubmit(false);
            } else {
              // pushedSuccess(
              //   checkFileDetails.beneficiaryId,
              //   checkFileDetails.farmerRegNo
              // );
              const firstRecord = Array.isArray(checkFileDetails) 
                  ? checkFileDetails[0] 
                  : checkFileDetails;

                pushedSuccess(
                  firstRecord?.beneficiaryId,
                  firstRecord?.farmerRegNo
                );
              setDisplaySubmit(false);
              getList();
              handleCloseModal();
            }
          })
          .catch((err) => {
            saveError(
              err.response?.data?.error_description ||
                "Sanction Order Update Failed"
            );
            setDisplaySubmit(false);
          });
      }

      // Case 5: pushToDbt
      if (actionFarmerData[0].pushToDbt) {
        apiCall = api.post(baseURLDBT + `service/pushToDBT`, sendPost);
      }
    }

    if (apiCall) {
      apiCall
        .then((response) => {
          if (response.data.errorCode === -1) {
            saveError(response.data.errorMessages[0]);
          } else if (response.data.error) {
            saveError(response.data.error_description);
          } else {
            // Work order acknowledgment
          //  if (actionFarmerData[0].workOrder) {
          //     callWorkOrderAcknowledgment(
          //       actionFarmerData[0].workOrderForScheme,
          //       applicationFormId,
          //       workOrderSchemeId,
          //       actionFarmerData[0]?.subSchemeId,
          //       actionFarmerData[0]?.categoryId
          //     );
          //   }
          if (actionFarmerData[0]?.workOrder) {

              if (!actionFarmerData[0]?.financialDelegation || isSanctionOrderAllowed) {

                callWorkOrderAcknowledgment(
                  actionFarmerData[0].workOrderForScheme,
                  applicationFormId,
                  workOrderSchemeId,
                  actionFarmerData[0]?.subSchemeId,
                  actionFarmerData[0]?.categoryId
                );

              }

            }

            saveSuccess();
            getList();
            handleCloseModal();
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


  // const viewModal = async (e) => {
  //   if (!!actionFarmerData[0]?.applicationFormId) {
  //     await getCheckFileDetails(
  //       actionFarmerData[0]?.applicationFormId,
  //       reportingOfficerDdoCode
  //     );
  //   } else {
  //     Swal.fire({
  //       title: "Action Required!",
  //       text: `Please Save the Data from "Push to DBT" Block and then try to view the details.`,
  //       icon: "warning",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };
  const viewModal = async (e) => {
  if (!!actionFarmerData[0]?.applicationFormId) {
    // Determine ddoCode based on schemeQuotaPaymentType
    const paymentType = actionData.schemeQuotaPaymentType;

    const ddoCodeToSend =
      paymentType === "B"
        ? reportingOfficerDdoCode
        : paymentType === "K"
        ? reportingOfficerKhazaneRecipientId
        : null;

    if (!ddoCodeToSend) {
      Swal.fire({
        title: "Missing DDO Code",
        text: "Unable to determine the DDO Code based on Scheme Quota Payment Type.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    await getCheckFileDetails(
      actionFarmerData[0]?.applicationFormId,
      ddoCodeToSend
    );
  } else {
    Swal.fire({
      title: "Action Required!",
      text: `Please Save the Data from "Push to DBT" Block and then try to view the details.`,
      icon: "warning",
      confirmButtonText: "OK",
    });
  }
};


  const getUserMastersList = (_id) => {
    api
      .get(baseURL + `userMaster/get-join/${_id}`)
      .then((response) => {
        if (response.data) {
          setReportingOfficerDdoCode(response.data.content.ddoCode);
          setReportingOfficerKhazaneRecipientId(response.data.content.khazaneRecipientId);
          // setData(prev=>({...prev,
          //   reportFirstName:response.data.content.firstName
          // }));
          setValidated(false);
        }
      })
      .catch((err) => {
        setValidated(false);
      });
  };

  const startThirtySecondHold = () => {
  clearTimeout(timeoutIdRef.current);

  timeoutIdRef.current = setTimeout(() => {
    setDisplaySubmit(false);   // ENABLE Submit
  }, 30000); // 30 seconds
};


  const [checkFileDetails, setCheckFileDetails] = useState({});
  const getCheckFileDetails = (appId, ddoCode) => {
    if (
      !actionData.sanctionNo ||
      actionData.sanctionNo === "0" ||
      actionData.sanctionNo === 0
    ) {
      warningAlert("Please Enter The Sanction Number", "Alert!!!");
      return;
    }

    const recordData = actionFarmerData[0];

    api
      .post(baseURLDBT + `service/checkXmlFileDetails`, {
        applicationFormId: appId,
        userMasterId: localStorage.getItem("userMasterId"),
        paymentMode: "P",
        pushType: "P",
        ddoCode,
        categoryId: recordData.categoryId,
        componentId: recordData.componentId,
        schemeId: recordData.schemeId,
        componentType: recordData.componentType,
      })
      .then((response) => {
        if (response.data) {
          setCheckFileDetails(response.data);
        }
        setShowModal6(true);
        if (directlyToFruits && allowDbtPush) {
          thirtyMinHold();
        }
      })
      .catch((err) => {
        // setApprovalStageAfterNextStepListData([]);
        setCheckFileDetails([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
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
    handleCloseModal();
    getList();
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
          categoryId: categoryId,
          });
        }
      })
      .catch((err) => {
        // saveError(err.response.data.validationErrors);
      });
  };

  // useEffect(() => {
  //   getList();
  // }, []);

  const ApplicationDataColumns = [
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
      name: "Mobile Number",
      selector: (row) => row.mobileNumber,
      cell: (row) => <span>{row.mobileNumber}</span>,
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
      name: "Eligible Amount",
      selector: (row) => row.eligibleAmount,
      cell: (row) => <span>{row.eligibleAmount}</span>,
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
      name: "Component Name",
      selector: (row) => row.componentName,
      cell: (row) => <span>{row.componentName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Component Type",
      selector: (row) => row.componentTypeName,
      cell: (row) => <span>{row.componentTypeName}</span>,
      sortable: true,
      hide: "md",
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
              onClick={() => handleShowModal4()}
            >
              Re-Assign
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                checkToShowModal(
                  row.fruitsId,
                  row.schemeId,
                  row.applicationFormId,
                  row.componentType
                )
              }
            >
              Action
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleView(row.applicationDocumentId)}
            >
              View
            </Button>

            {/* {row.workOrderNumber && (
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  generateWorkOrderAcknowledgment(
                    row.applicationDocumentId,
                    row.schemeId
                  )
                }
              >
                Download Work Order
              </Button>
            )} */}
            {/* {row.workOrderNumber && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (
                    row.workOrderForScheme === "PDMC" ||
                    row.workOrderForScheme === "PMKSY"
                  ) {
                    generateWorkOrderAcknowledgment(
                      row.applicationDocumentId,
                      row.schemeId
                    );
                  } else if (
                    row.workOrderForScheme === "Silk Samagra State" ||
                    row.workOrderForScheme === "Silk Samagra Central"
                  ) {
                    generateWorkOrderAcknowledgmentRH(
                      row.applicationDocumentId,
                      row.schemeId
                    );
                  }
                }}
              >
                Download Work Order
              </Button>
            )}

            {row.sanctionOrderNumber && row.applicationFormId && (
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  handleDownloadSanctionOrder(
                    row.applicationFormId,
                    row.schemeId,
                    row.sanctionOrderForScheme
                  )
                }
              >
                Download Sanction Order
              </Button>
            )} */}
          </div>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2,
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

  const handleDocumentInputs = (e) => {
    let { name, value } = e.target;
    setUploadDocuments({ ...uploadDocuments, [name]: value });
  };

  const handleSanctionOrderInputs = (e) => {
    let { name, value } = e.target;
    setSanctionOrderData({ ...sanctionOrderData, [name]: value });
  };

  const [uploadStatus, setUploadStatus] = useState({});

  const handleAttachFileUpload = async (documentId) => {
    const param = {
      applicationFormId: uploadDocuments.applicationFormId,
      documentTypeId: documentId,
    };

    try {
      const formData = new FormData();
      formData.append("multipartFile", documentDetails);

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
      Swal.fire({
        icon: "success",
        title: "File Uploaded successfully",
      });

      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [documentId]: true, // Mark this document as uploaded
      }));

      setUploadedDocuments((prevDocs) => [
        ...prevDocs,
        {
          documentId,
          // documentName: document.name,
          documentName: documentDetails?.name || "Unknown Document",
          documentMasterName: docListData.find(
            (list) => list.documentMasterId === documentId
          )?.documentMasterName, // Find and store the documentMasterName
          documentFile: documentDetails, // Store the file itself for image preview
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

  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  //Display Document
  const [documentDetails, setDocumentDetails] = useState("");

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Added null check
      setDocumentDetails(file);
      setUploadDocuments((prev) => ({ ...prev, documentPath: file.name }));
    }
  };

  const [sanctionOrderData, setSanctionOrderData] = useState({
    applicationFormId: "",
    documentTypeId: "",
  });

  const [sanctionOrderUploadedDocuments, setSanctionOrderUploadedDocuments] =
    useState([]);

  //Display Document
  const [sanctionOrderDocument, setSanctionOrderDocument] = useState("");

  const handleSanctionOrderChange = (e) => {
    const file = e.target.files[0];
    setSanctionOrderDocument(file);
    setSanctionOrderData((prev) => ({ ...prev, documentPath: file.name }));
    //  setPhotoFile(file);
  };

  const [uploadSanctionOrderStatus, setSanctionOrderStatus] = useState({});

  const handleSanctionOrderUpload = async (documentId) => {
    const param = {
      applicationFormId: sanctionOrderData.applicationFormId,
      documentTypeId: documentId,
    };

    try {
      const formData = new FormData();
      formData.append("multipartFile", sanctionOrderDocument);

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
      Swal.fire({
        icon: "success",
        title: "File uploaded successfully",
      });

      setSanctionOrderStatus((prevStatus) => ({
        ...prevStatus,
        [documentId]: true, // Mark this document as uploaded
      }));

      setSanctionOrderUploadedDocuments((prevDocs) => [
        ...prevDocs,
        {
          documentId,
          documentName: sanctionOrderDocument.name,
          documentMasterName: docListData.find(
            (list) => list.documentMasterId === documentId
          )?.documentMasterName, // Find and store the documentMasterName
          documentFile: sanctionOrderDocument, // Store the file itself for image preview
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

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Body>
          {loading ? (
            <h1 className="d-flex justify-content-center align-items-center">
              Loading...
            </h1>
          ) : (
            <>
              <Form noValidate validated={validated} onSubmit={postActionData}>
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
                      Application Details
                    </Accordion.Header>
                    <Accordion.Body>
                      <Block className="mt-n3">
                        {/* <Card
                          className="mt-3"
                          style={{
                            border: "none",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                          }}
                        > */}
                        <Card.Body>
                          <table
                            className="table small table-bordered"
                            style={{ width: "100%" }}
                          >
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    color: "red",
                                    fontWeight: "bold",
                                    fontSize: "1.1rem",
                                  }}
                                >
                                  {(actionFarmerData.length > 0 &&
                                    actionFarmerData[0].schemeWiseAction) ||
                                    "N/A"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Card.Body>
                        {/* </Card> */}
                      </Block>

                      <Block className="mt-3">
                        <Card
                          className="mt-3"
                          style={{
                            border: "none",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {/* <Card.Header
                  style={{
                    backgroundColor: "#0a2463",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    padding: "10px 15px",
                  }}
                >
                  Farmers Details
                </Card.Header> */}
                          <Card.Header
                            style={{
                              // backgroundColor: "#0a2463",
                              backgroundColor: "#0F6CBE",
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                              padding: "7px 12px",
                              position: "relative",
                              color: "white",
                              overflow: "hidden",
                            }}
                          >
                            <span>Beneficiary Details</span>
                            <div
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                fontSize: "3rem",
                                color: "rgba(255, 255, 255, 0.1)", // Light watermark color
                                zIndex: 0,
                                pointerEvents: "none", // Allow interactions to pass through
                                whiteSpace: "nowrap",
                              }}
                            >
                              {/* Farmers Details */}
                            </div>
                          </Card.Header>

                          <Card.Body>
                            <div style={{ overflowX: "auto" }}>
                              <table
                                className="table small table-bordered table-hover"
                                style={{ tableLayout: "fixed" }}
                              >
                                <thead style={{ backgroundColor: "#27488A" }}>
                                  <tr>
                                    {[
                                      "Fruits Id",
                                      "Name",
                                      "Middle Name",
                                      "Mobile Number",
                                      "District",
                                      "Taluk",
                                    ].map((header) => (
                                      <th
                                        key={header}
                                        style={{ width: "10%", color: "white" }}
                                      >
                                        {header}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {actionFarmerData?.length > 0 ? (
                                    actionFarmerData.map((action, index) => (
                                      <tr key={index}>
                                        {[
                                          "fruitsId",
                                          "farmerFirstName",
                                          "farmerMiddleName",
                                          "mobileNumber",
                                          "districtName",
                                          "talukName",
                                        ].map((key) => (
                                          <td
                                            key={key}
                                            style={{ wordBreak: "break-word" }}
                                          >
                                            {action[key] || "N/A"}
                                          </td>
                                        ))}
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="10" className="text-center">
                                        No Details Available
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </Card.Body>
                        </Card>
                      </Block>

                      <Block className="mt-3">
                        <Card
                          className="mt-3"
                          style={{
                            border: "none",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {/* <Card.Body>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="ms-2"
                              onClick={handleShowModal1}
                              style={{ padding: "10px 20px", fontSize: "16px" }}
                            >
                              Upload Documents
                            </Button>
                          </Card.Body> */}
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleShowModal1}
                                style={{ padding: "10px 20px", fontSize: "16px" }}
                              >
                                Upload Documents
                              </Button>
                            </div>

                            {viewDetailsData?.documents?.length > 0 ? (
                              <table className="table small table-bordered">
                                <thead style={{ backgroundColor: "#27488A" }}>
                                  <tr>
                                    <th style={{ color: "white" }}>Document Name</th>
                                    <th style={{ color: "white" }}>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {viewDetailsData.documents.map((fileDocuments, index) => (
                                    <tr key={index}>
                                      <td>{fileDocuments.documentName || "N/A"}</td>
                                      <td>
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() =>
                                            handleDocumentClick(fileDocuments.documentPath)
                                          }
                                        >
                                          View Document
                                        </Button>
                                        {currentDocumentPath === fileDocuments.documentPath &&
                                          selectedDocumentFile && (
                                            <>
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  marginLeft: "10px",
                                                }}
                                                src={selectedDocumentFile}
                                                alt="Selected File"
                                              />
                                              <Button
                                                variant="primary"
                                                size="sm"
                                                className="ms-2"
                                                onClick={() => downloadFile(fileDocuments.documentPath)}
                                              >
                                                Download Selected File
                                              </Button>
                                            </>
                                          )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p>No Documents Available</p>
                            )}
                          </Card.Body>
                        </Card>
                      </Block>

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
                                    <strong>Reject Type</strong>
                                  </Form.Label>
                                  <Form.Select
                                    name="rejectType"
                                    value={actionData.rejectType}
                                    onChange={handleActionInputs}
                                  >
                                    <option value="">Select Reject Type</option>
                                    <option value="Permanent">Permanent</option>
                                    {!directlyToFruits && (
                                      <option value="Objection">
                                        Objection
                                      </option>
                                    )}
                                  </Form.Select>
                                </Form.Group>
                              </Col>

                              <Col lg="6">
                                <Form.Group className="form-group">
                                  <Form.Label>
                                    <strong>Reject Reason</strong>
                                  </Form.Label>
                                  <Form.Select
                                    name="rejectReasonWorkflowMasterId"
                                    value={
                                      actionData.rejectReasonWorkflowMasterId
                                    }
                                    onChange={handleActionInputs}
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
                                  />
                                </Form.Group>
                              </Col>

                                {(
                                (actionFarmerData[0]?.sanctionOrder &&
                                actionFarmerData[0]?.financialDelegation &&
                                isSanctionOrderAllowed
                                ) || actionFarmerData[0]?.directlyToFruits
                              ) && (
                              <Col lg="4">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="sordfl">
                                    Proposal Date  <span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <DatePicker
                                      selected={actionData.proposalDate ? new Date(actionData.proposalDate) : null}
                                      onChange={(date) =>
                                        handleDateForPropasalChange(date, "proposalDate")
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
                                     
                                    />
                                  </div>
                                </Form.Group>
                              </Col>

                            )}

                              {/* {(actionFarmerData[0]?.sanctionOrder || actionFarmerData[0]?.directlyToFruits) && (
                                <Col lg="6">
                                  <Form.Group className="form-group">
                                    <Form.Label>
                                      <strong>Sanction Number</strong>
                                      <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                      id="sanctionNo"
                                      type="text"
                                      name="sanctionNo"
                                      value={actionData.sanctionNo}
                                      onChange={handleActionInputs}
                                      placeholder="Enter Sanction Number"
                                      required
                                      disabled={
                                        actionData.rejectType === "Permanent"
                                      }
                                    />
                                  </Form.Group>
                                </Col>
                              )} */}
                              {(
                                (actionFarmerData[0]?.sanctionOrder &&
                                actionFarmerData[0]?.financialDelegation &&
                                isSanctionOrderAllowed
                                ) || actionFarmerData[0]?.directlyToFruits
                              ) && ( 
                                <Col lg="6">
                                  <Form.Group className="form-group">
                                    <Form.Label>
                                      <strong>Sanction Number</strong>
                                      <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                      id="sanctionNo"
                                      type="text"
                                      name="sanctionNo"
                                      value={actionData.sanctionNo}
                                      onChange={handleActionInputs}
                                      placeholder="Enter Sanction Number"
                                      required
                                      disabled={actionData.rejectType === "Permanent"}
                                    />
                                  </Form.Group>
                                </Col>
                              )}

                              {allowAnyUser && (
                                <Col lg="6">
                                  <Form.Group className="form-group">
                                    <Form.Label>
                                      User <span className="text-danger">*</span>
                                    </Form.Label>

                                    <ReactSelect
                                      options={userListData.map((u) => ({
                                        value: u.userMasterId,
                                        label: `${u.username} (${u.userMasterId})`,
                                      }))}
                                      isSearchable
                                      placeholder={t("Select User")}
                                      value={userListData
                                        .map((u) => ({
                                          value: u.userMasterId,
                                          label: `${u.username} (${u.userMasterId})`,
                                        }))
                                        .find((opt) => opt.value === actionData.userId)}
                                      onChange={(selectedOption) => {
                                        setActionData((prev) => ({
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



                              

                              {actionFarmerData[0]?.financialDelegation ? (
                                isSanctionOrderAllowed ? (
                                  // When financialDelegation is true and isSanctionOrderAllowed is true
                                  <>
                                    <Col lg="6">
                                      <Form.Group className="form-group">
                                        <Form.Label>
                                          Approval Stage{" "}
                                          <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                          name="stepId"
                                          value={actionData.stepId}
                                          onChange={handleActionInputs}
                                          required
                                          // isInvalid={!actionData.stepId || actionData.stepId === "0"}
                                          // disabled={fieldsDisabled}
                                          disabled={
                                            fieldsDisabled ||
                                            fieldsSanctionOrderDisabled ||
                                            pushToDbtStatus
                                          }
                                        >
                                          <option value="">
                                            Select Approval Stage
                                          </option>
                                          {(actionData.rejectType ===
                                          "Objection"
                                            ? approvalRejectStageBeforeStepListData
                                            : approvalStageAfterNextStepListData
                                          ).map((list) => (
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

                                    {showDefaultUserField && (
                                    <Col lg="6">
                                      <Form.Group className="form-group">
                                        <Form.Label>
                                          User
                                          <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Col>
                                          <div className="form-control-wrap">
                                            <Form.Select
                                              name="userId"
                                              value={actionData.userId}
                                              onChange={handleActionInputs}
                                              onBlur={() => handleActionInputs}
                                              required
                                              isInvalid={
                                                actionData.userId ===
                                                  undefined ||
                                                actionData.userId === "0"
                                              }
                                              // disabled={fieldsDisabled}
                                              // disabled={
                                              //   true || 
                                              //   fieldsDisabled ||
                                              //   fieldsSanctionOrderDisabled ||
                                              //   pushToDbtStatus
                                              // }
                                               // disabled={fieldsDisabled}
                                              // disabled={
                                              //   true || 
                                              //   fieldsDisabled ||
                                              //   fieldsSanctionOrderDisabled ||
                                              //   pushToDbtStatus
                                              // }
                                              // disabled={
                                              //     !actionFarmerData[0]?.workOrder &&
                                              //     (
                                              //       fieldsDisabled ||
                                              //       fieldsSanctionOrderDisabled ||
                                              //       pushToDbtStatus
                                              //     )
                                              //   }
                                              disabled={
                                                actionFarmerData?.[0]?.workOrder
                                                  ? false
                                                  : (true || fieldsDisabled || fieldsSanctionOrderDisabled || pushToDbtStatus)
                                              }
                                              // isInvalid={
                                              //   actionData.userId === undefined ||
                                              //   actionData.userId === "0"
                                              // }
                                            >
                                              <option value="">
                                                Select User
                                              </option>
                                              {userFromDistrictData.map(
                                                (list) => (
                                                  <option
                                                    key={list.userId}
                                                    value={list.userId}
                                                  >
                                                    {list.userName}
                                                  </option>
                                                )
                                              )}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                              User is required
                                            </Form.Control.Feedback>
                                          </div>
                                        </Col>
                                      </Form.Group>
                                    </Col>
                                    )}
                                  </>
                                ) : (
                                  // When financialDelegation is true and isSanctionOrderAllowed is false
                                  <>
                                  
                                    <Col lg="6">
                                      <Form.Group className="form-group">
                                        <Form.Label>
                                          Approval Stage{" "}
                                          <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                          name="stepId"
                                          value={actionData.stepId}
                                          onChange={handleActionInputs}
                                          required
                                          disabled={fieldsDisabled}
                                        >
                                          <option value="">
                                            Select Approval Stage
                                          </option>
                                          {(actionData.rejectType ===
                                          "Objection"
                                            ? approvalRejectStageBeforeStepListData
                                            : approvalStageSameStepListData
                                          ).map((list) => (
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

                                  {showDefaultUserField && (
                                    <Col lg="6">
                                      <Form.Group className="form-group">
                                        <Form.Label>
                                          User{" "}
                                          <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                          name="userId"
                                          value={actionData.userId}
                                          onChange={handleActionInputs}
                                          required
                                          isInvalid={
                                            actionData.userId === undefined ||
                                            actionData.userId === "0"
                                          }
                                          disabled={fieldsDisabled}
                                        >
                                          <option value="">Select User</option>
                                          {userOfStepsToApproveData.map(
                                            (list) => (
                                              <option
                                                key={list.userId}
                                                value={list.userId}
                                              >
                                                {list.userName}
                                              </option>
                                            )
                                          )}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                          User is required
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                    )}
                                  </>
                                )
                              ) : (
                                // When financialDelegation is false
                                <>
                                  <Col lg="6">
                                    <Form.Group className="form-group">
                                      <Form.Label>
                                        Approval Stage{" "}
                                        <span className="text-danger">*</span>
                                      </Form.Label>
                                      <Form.Select
                                        name="stepId"
                                        value={actionData.stepId}
                                        onChange={handleActionInputs}
                                        required
                                        disabled={
                                          fieldsDisabled || pushToDbtStatus
                                          // ||directlyToFruits
                                        }
                                      >
                                        <option value="">
                                          Select Approval Stage
                                        </option>
                                        {(actionData.rejectType === "Objection"
                                          ? approvalRejectStageBeforeStepListData
                                          : approvalStageAfterNextStepListData
                                        ).map((list) => (
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

                              {showDefaultUserField && (
                                  <Col lg="6">
                                    <Form.Group className="form-group">
                                      <Form.Label>
                                        User{" "}
                                        <span className="text-danger">*</span>
                                      </Form.Label>
                                      <Form.Select
                                        name="userId"
                                        value={actionData.userId}
                                        onChange={handleActionInputs}
                                        required
                                        isInvalid={
                                          actionData.userId === undefined ||
                                          actionData.userId === "0"
                                        }
                                        disabled={
                                          fieldsDisabled || pushToDbtStatus
                                          // ||directlyToFruits
                                        }
                                      >
                                        <option value="">Select User</option>
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
                                    </Form.Group>
                                  </Col>
                                  )}
                                </>
                              )}

                              <Col lg="6">
                                <Form.Group className="form-group">
                                  <Form.Label>
                                    Eligible Subsidy
                                    {/* <span className="text-danger">*</span> */}
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      id="eligibleAmount"
                                      name="eligibleAmount"
                                      value={actionData.eligibleAmount}
                                      onChange={handleActionInputs}
                                      type="text"
                                      placeholder="Enter Eligible Subsidy Amount "
                                      style={modalStyles.formControl}
                                      disabled
                                      // required
                                    />
                                    {/* <Form.Control.Feedback type="invalid">
                                                  Cocoon's Purchased (in Kg's / Nos) is required
                                                  </Form.Control.Feedback> */}
                                  </div>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Block>

                      
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Work Order Details Accordion */}
                  {actionFarmerData.length > 0 &&
  !actionFarmerData[0].workOrderNumber &&
  actionFarmerData[0].workOrder &&
  (
    !actionFarmerData[0].financialDelegation || 
    (actionFarmerData[0].financialDelegation && isSanctionOrderAllowed)
  ) && (
                      <Accordion.Item eventKey="transaction">
                        <Accordion.Header
                          style={{
                            backgroundColor: "#0F6CBE",
                            color: "white",
                            fontWeight: "bold",
                            padding: "3px",
                            borderRadius: "5px",
                          }}
                          className="mb-3"
                        >
                          Generate Work Order
                        </Accordion.Header>
                        <Accordion.Body>

                        <Col lg="3">
                          <Form.Group className="form-group">
                            <Form.Label style={{ fontWeight: "bold" }}>
                              Selection Letter/Work Order Date <span className="text-danger">*</span>
                            </Form.Label>
              
                            <DatePicker
                              selected={parseDate(actionData.selectionLetterDate)}
                              onChange={(date) => handleDateForPropasalChange(date, "selectionLetterDate")}
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              maxDate={new Date()}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              required
                            />
                          </Form.Group>
                        </Col>
                          
                        </Accordion.Body>
                      </Accordion.Item>
                    )}
                 
                  {actionFarmerData.length > 0 &&
                    !actionFarmerData[0].sanctionOrderNumber &&
                    (actionFarmerData[0].financialDelegation
                      ? // When financialDelegation is true, check isSanctionOrderAllowed
                        actionFarmerData[0].sanctionOrder &&
                        isSanctionOrderAllowed
                      : // When financialDelegation is false, check only sanctionOrder
                        actionFarmerData[0].sanctionOrder) && (
                      <Accordion.Item eventKey="sanction">
                        <Accordion.Header
                          style={{
                            backgroundColor: "#0F6CBE",
                            color: "white",
                            fontWeight: "bold",
                            padding: "3px",
                            borderRadius: "5px",
                          }}
                          className="mb-3"
                        >
                          Sanction Order Details
                        </Accordion.Header>
                        <Accordion.Body>
                          <Block className="mt-n4">
                            <Row>
                              <DataTable
                                tableClassName="data-table-head-light table-responsive"
                                columns={schemeDetailsListColumn}
                                data={pushToDBTListData}
                                highlightOnHover
                                progressPending={loading}
                                theme="solarized"
                                customStyles={customStyles}
                              />
                            </Row>
                            <Row className="mt-2">
                              {/* <Col lg="6">
                                <Form.Group className="form-group">
                                  <Form.Label>
                                    <strong>Sanction Order No.</strong>
                                  </Form.Label>
                                  <Form.Control
                                    id="sanctionOrderNumber"
                                    type="text"
                                    name="sanctionOrderNumber"
                                    value={actionData.sanctionOrderNumber}
                                    onChange={handleActionInputs}
                                    placeholder="Enter Sanction Order NO."
                                  />
                                </Form.Group>
                              </Col> */}

                              <Col lg="6">
                                <Form.Group className="form-group">
                                  <Form.Label>
                                    <strong>Documents</strong>
                                  </Form.Label>
                                  <Form.Select
                                    name="documentTypeId"
                                    value={sanctionOrderData.documentTypeId}
                                    onChange={handleSanctionOrderInputs}
                                  >
                                    <option value="">
                                      Select Document Type
                                    </option>
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

                              <Col lg="6">
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="accountImagePath">
                                    Upload Sanction Order (PDF/jpg/png)(Max:5MB)
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Control
                                      type="file"
                                      id="documentPath"
                                      name="documentPath"
                                      // value={data.photoPath}
                                      onChange={handleSanctionOrderChange}
                                    />
                                  </div>
                                </Form.Group>

                                <Form.Group className="form-group mt-3 d-flex justify-content-center">
                                  {sanctionOrderDocument ? (
                                    <img
                                      style={{
                                        height: "100px",
                                        width: "100px",
                                      }}
                                      src={URL.createObjectURL(
                                        sanctionOrderDocument
                                      )}
                                    />
                                  ) : (
                                    ""
                                  )}
                                </Form.Group>
                              </Col>
                            </Row>

                            {sanctionOrderUploadedDocuments.length > 0 && (
                              <div className="mt-3">
                                <h5>Uploaded Documents</h5>
                                <ul>
                                  {sanctionOrderUploadedDocuments.map(
                                    (doc, index) => (
                                      <li
                                        key={index}
                                        className="d-flex align-items-center"
                                      >
                                        {/* Show the image if it's available */}
                                        {doc.documentFile && (
                                          <img
                                            src={URL.createObjectURL(
                                              doc.documentFile
                                            )}
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
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </Block>

                          <div className="gap-col mt-1">
                            <ul className="d-flex align-items-center justify-content-center gap g-3">
                              <li>
                                <Button
                                  type="button"
                                  variant="primary"
                                  className="me-2"
                                  onClick={() =>
                                    handleSanctionOrderUpload(
                                      sanctionOrderData.documentTypeId
                                    )
                                  }
                                  disabled={
                                    uploadSanctionOrderStatus[
                                      sanctionOrderData.documentTypeId
                                    ]
                                  } // Disable button if this document is uploaded
                                >
                                  {uploadSanctionOrderStatus[
                                    sanctionOrderData.documentTypeId
                                  ]
                                    ? "Uploaded"
                                    : "Upload"}
                                </Button>
                              </li>
                            </ul>
                          </div>

                          
                        </Accordion.Body>
                      </Accordion.Item>
                    )}

                  {actionFarmerData.length > 0 &&
                    actionFarmerData[0].pushToDbt && (
                      <Accordion.Item eventKey="transaction">
                        <Accordion.Header
                          style={{
                            backgroundColor: "#0F6CBE",
                            color: "white",
                            fontWeight: "bold",
                            padding: "3px",
                            borderRadius: "5px",
                          }}
                          className="mb-3"
                        >
                          Push To DBT
                        </Accordion.Header>
                        <Accordion.Body>
                          <Block className="mt-n5">
                            <Card
                              className="mt-4"
                              style={{
                                border: "none",
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <Card.Body>
                               
                                <Row>
                                  <DataTable
                                    tableClassName="data-table-head-light table-responsive"
                                    columns={schemeDetailsPushToDbtListColumn}
                                    data={recordFromAppForm}
                                    highlightOnHover
                                    progressPending={loading}
                                    theme="solarized"
                                    customStyles={customStyles}
                                  />
                                </Row>
                              </Card.Body>
                            </Card>
                          </Block>
                        </Accordion.Body>
                      </Accordion.Item>
                    )}

                  {actionFarmerData.length > 0 &&
                    actionFarmerData[0].directlyToFruits && (
                      <Accordion.Item eventKey="transaction">
                        <Accordion.Header
                          style={{
                            backgroundColor: "#0F6CBE",
                            color: "white",
                            fontWeight: "bold",
                            padding: "3px",
                            borderRadius: "5px",
                          }}
                          className="mb-3"
                        >
                          Push To DBT 
                        </Accordion.Header>
                        <Accordion.Body>
                          <Block className="mt-n5">
                            <Card
                              className="mt-4"
                              style={{
                                border: "none",
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <Card.Body>
                                
                                <Row>
                                  <DataTable
                                    tableClassName="data-table-head-light table-responsive"
                                    columns={schemeDetailsPushToDbtListColumn}
                                    data={recordFromAppForm}
                                    highlightOnHover
                                    progressPending={loading}
                                    theme="solarized"
                                    customStyles={customStyles}
                                  />
                                </Row>
                              </Card.Body>
                            </Card>
                          </Block>
                        </Accordion.Body>
                      </Accordion.Item>
                    )}
                </Accordion>

                <Col lg="12">
                  <div className="d-flex justify-content-center gap-2 mt-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => viewModal()}
                      hidden={!directlyToFruits}
                      disabled={actionData.rejectType === "Permanent"}
                    >
                      View
                    </Button>
                    {directlyToFruits ? (
                      <Button
                        type="submit"
                        variant="success"
                        disabled={displaySubmit}
                      >
                        Submit
                      </Button>
                    ) : (
                      <Button type="submit" variant="success" disabled={displaySubmit}>
                        Submit
                      </Button>
                    )}

                    {/* <Button
                      type="button"
                        variant="primary"
                        onClick={() => handleGenerateSanctionOrder(applicationFormId)}
                      >
                        Generate Sanction Order
                      </Button> */}
                    {/* {actionFarmerData.length > 0 && actionFarmerData[0].sanctionOrder && (
                        <Button
                          type="button"
                          variant="primary"
                          onClick={() => handleGenerateSanctionOrder(applicationId,schemeId)}
                        >
                          Generate Sanction Order
                        </Button>
                      )} */}
                    {actionFarmerData.length > 0 &&
                      actionFarmerData[0].sanctionOrder &&
                      applicationId && (
                        <Button
                          type="button"
                          variant="primary"
                          onClick={handleGenerateSanctionOrderClick}
                        >
                          Generate Sanction Order
                        </Button>
                      )}
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

      <Block className="mt-n4">
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
            progressPending={loading}
            theme="solarized"
            customStyles={customStyles}
          />
        </Card>
      </Block>

      <Modal show={showModal1} onHide={handleCloseModal1} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* {docListData.map(({ documentMasterId, documentMasterName }) => ( */}
          <div>
            <Row>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    <strong>Documents</strong>
                  </Form.Label>
                  <Form.Select
                    name="documentTypeId"
                    value={uploadDocuments.documentTypeId}
                    onChange={handleDocumentInputs}
                  >
                    <option value="">Select Document Type</option>
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

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="accountImagePath">
                    Upload Documents(PDF/jpg/png)(Max:5MB)
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
                  {documentDetails ? (
                    <img
                      style={{ height: "100px", width: "100px" }}
                      src={URL.createObjectURL(documentDetails)}
                    />
                  ) : (
                    ""
                  )}
                </Form.Group>
              </Col>
            </Row>

            {uploadedDocuments.length > 0 && (
              <div className="mt-3">
                <h5>Uploaded Documents</h5>
                <ul>
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
            <div className="gap-col mt-1">
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
          </div>
          {/* ))} */}
        </Modal.Body>
      </Modal>

      <Modal show={showModal3} onHide={handleCloseModal3} size="lg">
        <Modal.Header style={modalStyles.modalHeader} closeButton>
          <Modal.Title style={modalStyles.modalTitle}>
            Add Payment Detail
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalStyles.modalBody}>
          {/* {docListData.map(({ documentMasterId, documentMasterName }) => ( */}
          <Row>
            <Col lg="6">
              <Form.Group className="form-group mt-n3">
                <Form.Label style={modalStyles.formGroupLabel}>
                  Payment To
                  {/* <span className="text-danger">*</span> */}
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Select
                    name="paymentTo"
                    value={pushToDbtData.paymentTo}
                    onChange={handlePushToDbtInputs}
                    style={modalStyles.selectInput}
                    // required
                    // isInvalid={
                    //   data.testResults === undefined ||
                    //   data.testResults === "0"
                    // }
                  >
                    <option value="">Select Payment To</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Vendor">Vendor</option>
                  </Form.Select>
                  {/* <Form.Control.Feedback type="invalid">
                                Test Results is required
                                </Form.Control.Feedback> */}
                </div>
              </Form.Group>
            </Col>

            <Col lg="6">
              <Form.Group className="form-group mt-n3">
                <Form.Label style={modalStyles.formGroupLabel}>
                  Payment Method
                  {/* <span className="text-danger">*</span> */}
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Select
                    name="paymentMethod"
                    value={pushToDbtData.paymentMethod}
                    onChange={handlePushToDbtInputs}
                    style={modalStyles.selectInput}
                    // required
                    // isInvalid={
                    //   data.testResults === undefined ||
                    //   data.testResults === "0"
                    // }
                  >
                    <option value="">Select Payment Method</option>
                    <option value="CASH">CASH</option>
                    <option value="DBT">DBT</option>
                    <option value="K2">K2</option>
                    {/* <option value="CASH">CASH</option> */}
                    <option value="CHEQUE">CHEQUE</option>
                    <option value="ONLINE">ONLINE</option>
                  </Form.Select>
                  {/* <Form.Control.Feedback type="invalid">
                                Test Results is required
                                </Form.Control.Feedback> */}
                </div>
              </Form.Group>
            </Col>

            <Col lg="6">
              <Form.Group className="form-group">
                <Form.Label style={modalStyles.formGroupLabel}>
                  Subsidy Amount
                  {/* <span className="text-danger">*</span> */}
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Control
                    id="schemeAmount"
                    name="schemeAmount"
                    value={pushToDbtData.schemeAmount}
                    onChange={handlePushToDbtInputs}
                    type="text"
                    placeholder="Enter Scheme Amount "
                    style={modalStyles.formControl}
                    // required
                  />
                  {/* <Form.Control.Feedback type="invalid">
                                Cocoon's Purchased (in Kg's / Nos) is required
                                </Form.Control.Feedback> */}
                </div>
              </Form.Group>
            </Col>

            {["CASH", "CHEQUE", "ONLINE"].includes(
              pushToDbtData.paymentMethod
            ) && (
              <>
                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label style={modalStyles.formGroupLabel}>
                      Reference No
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="referenceNo"
                        name="referenceNo"
                        value={pushToDbtData.referenceNo}
                        onChange={handlePushToDbtInputs}
                        type="text"
                        placeholder="Enter Reference No "
                        style={modalStyles.formControl}
                        // required
                      />
                      {/* <Form.Control.Feedback type="invalid">
                                Cocoon's Purchased (in Kg's / Nos) is required
                                </Form.Control.Feedback> */}
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label style={modalStyles.formGroupLabel}>
                      Date Of Payment
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={
                          pushToDbtData.dateOfPayment
                            ? new Date(pushToDbtData.dateOfPayment)
                            : null
                        }
                        onChange={(date) =>
                          handleDateChange(date, "dateOfPayment")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        // minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        // required
                      />
                      {/* <Form.Control.Feedback type="invalid">
                                  Date of moth emergence is required
                                </Form.Control.Feedback> */}
                    </div>
                  </Form.Group>
                </Col>
              </>
            )}
            <Col lg="12">
              <div className="d-flex justify-content-center gap-2 mt-3">
                <Button type="submit" onClick={addToList} variant="primary">
                  Submit
                </Button>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <Modal show={showModal4} onHide={handleCloseModal4} size="xl">
        <Modal.Header style={modalStyles.modalHeader} closeButton>
          <Modal.Title style={modalStyles.modalTitle}>User</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalStyles.modalBody}>
          <Form noValidate validated={validated} onSubmit={postData}>
            {/* {docListData.map(({ documentMasterId, documentMasterName }) => ( */}
            <Row>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label style={modalStyles.formGroupLabel}>
                    User
                    {/* <span className="text-danger">*</span> */}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="userId"
                      value={assignData.userId}
                      // onChange={(e) => handleListInput(e, row)}
                      onChange={handleAssignInputs}
                      // onBlur={() => handleInputs}
                    >
                      <option value="">Select User</option>
                      {userFromDistrictData.map((list) => (
                        <option key={list.userId} value={list.userId}>
                          {list.userName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap-2 mt-3">
                  <Button type="submit" variant="success">
                    Assign
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

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


                            <div className="mt-2">
                                  {/* {viewDetailsData?.workOrderNumber !== undefined &&
                                    viewDetailsData?.applicationFormId !== undefined && (
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => {
                                          if (
                                            viewDetailsData.workOrderForScheme === "PDMC" ||
                                            viewDetailsData.workOrderForScheme === "PMKSY"
                                          ) {
                                            generateWorkOrderAcknowledgment(
                                              viewDetailsData.applicationFormId,
                                              viewDetailsData.workOrderSchemeId
                                            );
                                          } else if (
                                            viewDetailsData.workOrderForScheme === "Silk Samagra State" ||
                                            viewDetailsData.workOrderForScheme === "Silk Samagra Central"
                                          ) {
                                            generateWorkOrderAcknowledgmentRH(
                                              viewDetailsData.applicationFormId,
                                              viewDetailsData.workOrderSchemeId
                                            );
                                          }
                                        }}
                                      >
                                        Download Work Order
                                      </Button>
                                    )} */}

                                    {viewDetailsData?.workOrderNumber !== undefined &&
                                    viewDetailsData?.applicationFormId !== undefined && (
                                       <Button
                                        variant="primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleDownloadWorkOrder(viewDetailsData)}
                                      >
                                        Download Work Order
                                      </Button>
                                    )}


                                  {/* {viewDetailsData?.sanctionOrderNumber && viewDetailsData?.applicationFormId && (
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() =>
                                        handleDownloadSanctionOrder(
                                          viewDetailsData.applicationFormId,
                                          viewDetailsData.workOrderSchemeId,
                                          viewDetailsData.sanctionOrderForScheme,
                                          viewDetailsData.subSchemeId,     // ✅ new
                                          viewDetailsData.categoryId
                                        )
                                      }
                                    >
                                      Download Sanction Order
                                    </Button>
                                  )} */}
                                </div>
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

              <Accordion.Item eventKey="transaction">
                <Accordion.Header
                  style={{
                    backgroundColor: "#0F6CBE",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  className="mb-2"
                >
                  Application Transaction Details
                </Accordion.Header>
                <Accordion.Body>
                  <div style={{ overflowX: "auto" }}>
                    <table
                      className="table small table-bordered"
                      style={{ maxWidth: "100%", tableLayout: "fixed" }}
                    >
                      <thead style={styles.headerStyle}>
                        <tr>
                          <th style={{ width: "10%" }}>Fruits Id</th>
                          <th style={{ width: "10%" }}>Beneficiary Id</th>
                          <th style={{ width: "10%" }}>Scheme Amount</th>
                          <th style={{ width: "10%" }}>Sanction No</th>
                          <th style={{ width: "10%" }}>Financial Year</th>
                          <th style={{ width: "10%" }}>Payment Mode</th>
                          <th style={{ width: "10%" }}>File Name</th>
                          <th style={{ width: "10%" }}>DBT Push Type</th>
                          <th style={{ width: "10%" }}>Status</th>
                          <th style={{ width: "10%" }}>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewDetailsData?.applicationTransactionDetails
                          ?.length > 0 ? (
                          viewDetailsData.applicationTransactionDetails.map(
                            (transaction, index) => (
                              <tr key={index}>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.fruitsId || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.beneficiaryId || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.schemeAmount || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.sanctionNo || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.financialYear || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.paymentMode || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.fileName || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.dbtPushType || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.status || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.remarks || "N/A"}
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td colSpan="10" className="text-center">
                              No Transaction Details Available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal2}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <Modal show={showModal6} onHide={handleCloseModal6} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Check Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table small table-bordered">
            <tbody>
              <tr>
                <td style={styles.ctstyle}>DeptCode:</td>
                <td>{checkFileDetails.deptCode}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>SchemeID:</td>
                <td>{checkFileDetails.schemeId}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>ComponentTypeID:</td>
                <td>{checkFileDetails.componentTypeId}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>ComponentID:</td>
                <td>{checkFileDetails.componentId}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>SubComponentID:</td>
                <td>{checkFileDetails.subComponentId}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>PaymentMode:</td>
                <td>{checkFileDetails.paymentMode}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>PaymentType:</td>
                <td>{checkFileDetails.paymentType}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>BenRecordCount:</td>
                <td>{checkFileDetails.benRecordCount}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>BeneficiaryID:</td>
                <td>{checkFileDetails.beneficiaryId}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>RegNo:</td>
                <td>{checkFileDetails.farmerRegNo}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>PeriodFrom:</td>
                <td>{checkFileDetails.periodFrom}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>PeriodTo:</td>
                <td>{checkFileDetails.periodTo}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>MobileNo:</td>
                <td>{checkFileDetails.mobileNumber}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>SanctionAmount:</td>
                <td>{checkFileDetails.sanctionAmount}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>LGDistrict:</td>
                <td>{checkFileDetails.lgDistrict}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>LGTaluk:</td>
                <td>{checkFileDetails.lgTaluk}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>SanctionNo:</td>
                <td>{actionData.sanctionNo}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>Finyear:</td>
                <td>{checkFileDetails.finYear}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>DDOCode:</td>
                <td>{checkFileDetails.ddoCode}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>DistrictCode:</td>
                <td>{checkFileDetails.districtCode}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>TalukCode:</td>
                <td>{checkFileDetails.talukCode}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>HobliCode:</td>
                <td>{checkFileDetails.hobliCode}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>VillageCode:</td>
                <td>{checkFileDetails.villageCode}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>SurveyNo:</td>
                <td>{checkFileDetails.surveyNumber}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>Surnoc:</td>
                <td>{checkFileDetails.surNoc}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>Hissano:</td>
                <td>{checkFileDetails.hissaNumber}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>LandCode:</td>
                <td>{checkFileDetails.landCode}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>OwnerNo:</td>
                <td>{checkFileDetails.ownerNumber}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>MainOwnerNo:</td>
                <td>{checkFileDetails.mainOwnerNumber}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>OwnerName:</td>
                <td>{checkFileDetails.ownerName}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>ExtAcre:</td>
                <td>{checkFileDetails.extAcre}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>ExtGunta:</td>
                <td>{checkFileDetails.extGunta}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>ExtfGunta:</td>
                <td>{checkFileDetails.extFGunta}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>DevAcre:</td>
                <td>{checkFileDetails.devAcre}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>DevGunta:</td>
                <td>{checkFileDetails.devGunta}</td>
              </tr>
              <tr>
                <td style={styles.ctstyle}>DevfGunta:</td>
                <td>{checkFileDetails.devFGunta}</td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal6}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
      <Modal show={showModal6} onHide={handleCloseModal6} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Check Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {checkFileDetails.length > 0 ? (
            checkFileDetails.map((detail, index) => (
              <div key={index} className="mb-4">
                <h6 className="mt-3 text-primary">Application #{index + 1}</h6>
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>DeptCode:</td>
                      <td>{detail.deptCode}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>SchemeID:</td>
                      <td>{detail.schemeId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>ComponentTypeID:</td>
                      <td>{detail.componentTypeId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>ComponentID:</td>
                      <td>{detail.componentId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>SubComponentID:</td>
                      <td>{detail.subComponentId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>PaymentMode:</td>
                      <td>{detail.paymentMode}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>PaymentType:</td>
                      <td>{detail.paymentType}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>BenRecordCount:</td>
                      <td>{detail.benRecordCount}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>BeneficiaryID:</td>
                      <td>{detail.beneficiaryId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>RegNo:</td>
                      <td>{detail.farmerRegNo}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>PeriodFrom:</td>
                      <td>{detail.periodFrom}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>PeriodTo:</td>
                      <td>{detail.periodTo}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>MobileNo:</td>
                      <td>{detail.mobileNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>SanctionAmount:</td>
                      <td>{detail.sanctionAmount}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>LGDistrict:</td>
                      <td>{detail.lgDistrict}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>LGTaluk:</td>
                      <td>{detail.lgTaluk}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>SanctionNo:</td>
                      <td>{actionData.sanctionNo}</td> {/* ✅ correct field */}
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Finyear:</td>
                      <td>{detail.finYear}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>DDOCode:</td>
                      <td>{detail.ddoCode}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>DistrictCode:</td>
                      <td>{detail.districtCode}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>TalukCode:</td>
                      <td>{detail.talukCode}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>HobliCode:</td>
                      <td>{detail.hobliCode}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>VillageCode:</td>
                      <td>{detail.villageCode}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>SurveyNo:</td>
                      <td>{detail.surveyNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Surnoc:</td>
                      <td>{detail.surNoc}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Hissano:</td>
                      <td>{detail.hissaNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>LandCode:</td>
                      <td>{detail.landCode}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>OwnerNo:</td>
                      <td>{detail.ownerNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>MainOwnerNo:</td>
                      <td>{detail.mainOwnerNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>OwnerName:</td>
                      <td>{detail.ownerName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>ExtAcre:</td>
                      <td>{detail.extAcre}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>ExtGunta:</td>
                      <td>{detail.extGunta}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>ExtfGunta:</td>
                      <td>{detail.extFGunta}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>DevAcre:</td>
                      <td>{detail.devAcre}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>DevGunta:</td>
                      <td>{detail.devGunta}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>DevfGunta:</td>
                      <td>{detail.devFGunta}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>No details found.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal6}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default DashboardReportList;
