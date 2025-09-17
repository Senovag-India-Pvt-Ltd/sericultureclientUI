import { Card, Button, Row, Col, Form, Modal,Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import DataTable, { defaultThemes } from "react-data-table-component";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import DatePicker from "react-datepicker";
import { useState,useRef } from "react";
import { useEffect } from "react";
import axios from "axios";
import api from "../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function DrawingOfficerListForK2Push() {

  // Translation
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 50;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
    headerStyle: {
      backgroundColor: "#0f6cbe",
      color: "white",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
  };

  const [addressDetails, setAddressDetails] = useState({
    fruitsId: "",
    beneficiaryId: "",
    financialYearId: "",
    componentId: "",
    subSchemeId: "",
    districtId: "",
    talukId: "",
    tscMasterId: "",

    scCategoryId: "",
    scSchemeDetailsId: "",
  });

const [pushVisible, setPushVisible] = useState(false);
const [checkingXml, setCheckingXml] = useState(false);

// // handler
// const handleCheckXmlFile = (appId) => {
//   setCheckingXml(true);
//   setPushVisible(false);

//   // if (!ddoCode) {
//   //   warningAlert("DDO Code not found. Please try again.", "Alert!!!");
//   //   setCheckingXml(false);
//   //   return;
//   // }

//   getCheckFileDetails(appId);
//   viewModal();
// };
// handler
const handleCheckXmlFile = (rows, ddoCode) => {
  setCheckingXml(true);
  setPushVisible(false);

  // Extract all selected appIds
  const appIds = rows.map(r => r.scApplicationFormId);

  if (!appIds || appIds.length === 0) {
    Swal.fire({
      title: "No Applications Selected",
      text: "Please select at least one application to check.",
      icon: "warning",
      confirmButtonText: "OK",
    });
    setCheckingXml(false);
    return;
  }

  getCheckFileDetails(appIds, ddoCode);
};



  const viewModal = async (e) => {
    if (!!listData[0]?.scApplicationFormId) {
      // Determine ddoCode based on schemeQuotaPaymentType
      // const paymentType = actionData.schemeQuotaPaymentType;
  
      // const ddoCodeToSend =
      //   paymentType === "B"
      //     ? reportingOfficerDdoCode
      //     : paymentType === "K"
      //     ? reportingOfficerKhazaneRecipientId
      //     : null;
  
      // if (!ddoCodeToSend) {
      //   Swal.fire({
      //     title: "Missing DDO Code",
      //     text: "Unable to determine the DDO Code based on Scheme Quota Payment Type.",
      //     icon: "warning",
      //     confirmButtonText: "OK",
      //   });
      //   return;
      // }
  
      await getCheckFileDetails(
        listData[0]?.scApplicationFormId,
        // ddoCodeToSend
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
  

  const [showModal6, setShowModal6] = useState(false);
  const handleShowModal6 = () => setShowModal6(true);
  const handleCloseModal6 = () => {
  setShowModal6(false);
  setPushVisible(true);   // Enable Push button when modal closes
  setCheckingXml(false); 
};

   const [checkFileDetails, setCheckFileDetails] = useState([]); // should be an array

    const getCheckFileDetails = (applicationFormIds) => {
  const recordData = listData[0];

  api
    .post(baseURLDBT + `service/checkXmlFileDetails`, {
      applicationFormIds: applicationFormIds,
      userMasterId: localStorage.getItem("userMasterId"),
      paymentMode: "P",
      pushType: "P",
      ddoCode: reportingOfficerDdoCode,
      categoryId: recordData.categoryId,
      componentId: recordData.componentId,
      schemeId: recordData.schemeId,
      componentType: recordData.componentType,
    })
    .then((response) => {
      if (response.data && Array.isArray(response.data)) {
        setCheckFileDetails(response.data);  // ✅ save array directly
      } else {
        setCheckFileDetails([]);
      }
      setShowModal6(true);
      // thirtyMinHold();
    })
    .catch((err) => {
      setCheckFileDetails([]);
    });
};


    const [displaySubmit, setDisplaySubmit] = useState(true);
    
 const timeoutIdRef = useRef(null);

  const thirtyMinHold = (e) => {
    timeoutIdRef.current = setTimeout(() => {
      setDisplaySubmit(false);
      setShowModal6(false);
      setPushVisible(true);      // show Push after 30s
      setCheckingXml(false); 
    }, 15000);
  };

  const warningAlert = (message, title) => {
      Swal.fire({
        icon: "warning",
        title: title,
        text: message,
      });
    };
  
const [showCheckboxes, setShowCheckboxes] = useState(false);


  // Search
  const search = (e) => {
  api
    .post(
      baseURLDBT + `service/getK2ListForDBTPush`,
      {},
      {
        params: {
          userMasterId: localStorage.getItem("userMasterId"),
          fruitsId: addressDetails.fruitsId || '',
          beneficiaryId: addressDetails.beneficiaryId || '',
          financialYearId: addressDetails.financialYearId || 0,
          componentId: addressDetails.componentId || 0,
          subSchemeId: addressDetails.subSchemeId || 0,
          districtId: addressDetails.districtId || 0,
          talukId: addressDetails.talukId || 0,
          tscMasterId: addressDetails.tscMasterId || 0,
          scSchemeDetailsId: addressDetails.scSchemeDetailsId || 0,
          scCategoryId: addressDetails.scCategoryId || 0,
          pageNumber: page,
          pageSize: countPerPage,
        },
      }
    )
    .then((response) => {
      setListData(response.data.content);

      // Show checkboxes only if mandatory fields are selected
      if (
        addressDetails.financialYearId &&
        addressDetails.scSchemeDetailsId &&
        addressDetails.subSchemeId &&
        addressDetails.componentId &&
        addressDetails.scCategoryId
      ) {
        setShowCheckboxes(true);
      } else {
        setShowCheckboxes(false);
      }
    })
    .catch((err) => {
      setListData([]);
      setShowCheckboxes(false);
    });
};


  const exportCsv = (e) => {
    api
      .post(
        baseURLDBT + `service/getK2ListForDBTPushReport`,
        {},
        {
          params: {
           userMasterId: localStorage.getItem("userMasterId"),
          fruitsId: addressDetails.fruitsId || '',
          beneficiaryId: addressDetails.beneficiaryId || '',
          financialYearId: addressDetails.financialYearId || 0,
          componentId: addressDetails.componentId || 0,
          subSchemeId: addressDetails.subSchemeId || 0,
          districtId: addressDetails.districtId || 0,
          talukId: addressDetails.talukId || 0,
          tscMasterId: addressDetails.tscMasterId || 0,
          scSchemeDetailsId: addressDetails.scSchemeDetailsId || 0,
          scCategoryId: addressDetails.scCategoryId || 0,
          },
          responseType: 'blob',
          headers: {
            accept: "text/csv",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `k2_list_for_dbt_push_report.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        Swal.fire({
          icon: "warning",
          title: "No record found!!!",
        });
      });
}; 

  const [reportingOfficerDdoCode, setReportingOfficerDdoCode] = useState("");

const getUserMastersList = (_id) => {
    api
      .get(baseURL + `userMaster/get-join/${_id}`)
      .then((response) => {
        if (response.data) {
          setReportingOfficerDdoCode(response.data.content.khazaneRecipientId);
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

  useEffect(() => {
  const userId = localStorage.getItem("userMasterId");
  if (userId) {
    getUserMastersList(userId);
  }
}, []);



  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    api
      .get(baseURL + `district/get-all`)
      .then((response) => {
        if (response.data.content.district) {
          setDistrictListData(response.data.content.district);
        }
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getDistrictList();
  }, []);

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    api
      .get(baseURL + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        if (response.data.content.taluk) {
          setTalukListData(response.data.content.taluk);
        } else {
          setTalukListData([]);
        }
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (addressDetails.districtId) {
      getTalukList(addressDetails.districtId);
    }
  }, [addressDetails.districtId]);

  

  const [data, setData] = useState({
    financialYearMasterId: "",
    year1: "",
    year2: ""
  });

  const [period, setPeriod] = useState({
    periodFrom: new Date(),
    periodTo: new Date(),
  });

  // console.log(searchData);

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

  const [validatedDisplay, setValidatedDisplay] = useState(false);


  const [applicationIds, setApplicationIds] = useState([]);
  const [unselectedApplicationIds, setUnselectedApplicationIds] = useState([]);
  const [allApplicationIds, setAllApplicationIds] = useState([]);

  console.log(applicationIds);

  // const [viewDetailsData, setViewDetailsData] = useState({});
  // const viewDetails = (_id) => {
  //   handleShowModal();
  //   api
  //     .get(baseURLDBT + `service/get-join/${_id}`)
  //     .then((response) => {
  //       setViewDetailsData(response.data.content);

  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setViewDetailsData({});
  //       setLoading(false);
  //     });
  // };
  
  const [viewDetailsData, setViewDetailsData] = useState({
    applicationDetails: [],
    landDetails: [],
    applicationTransactionDetails: [],
  });

  const handleView = (_id) => {
    api
      .post(baseURLDBT + `service/viewApplicationDetails`, {
        applicationFormId: _id,
      })
      .then((response) => {
        const content = response.data.content[0];
        
        if (content.applicationDetailsResponses.length <= 0) {
          saveError("No Details Found!!!");
        } else {
          handleShowModal();
          setViewDetailsData({
            applicationDetails: content.applicationDetailsResponses,
            landDetails: content.landDetailsResponses,
            applicationTransactionDetails: content.applicationTransactionResponses,

          applicationFormId: applicationFormId, // coming from state set earlier
          workOrderSchemeId: workOrderSchemeId,
          workOrderNumber: workOrderNumber,
          workOrderForScheme: workOrderForScheme,
          sanctionOrderNumber: sanctionOrderNumber,
          sanctionOrderForScheme: sanctionOrderForScheme,
          workOrderApplicationFormId: scApplicationFormServiceId,
          });
        }
      })
      .catch((err) => {
        // saveError(err.response.data.validationErrors);
      });
  };

  const rejectDetails = (_id) => {
    api
      .post(
        baseURLDBT + `service/updateApplicationFormAsRejectedByChecker`,
        {},
        { params: { docId: _id } }
      )
      .then((response) => {
        // setViewDetailsData(response.data.content);
        getList();

        setLoading(false);
      })
      .catch((err) => {
        // setViewDetailsData({});
        setLoading(false);
      });
  };

  const [selectedIds, setSelectedIds] = useState([]);
const [pushing, setPushing] = useState(false); // for disabling Push button
const [searchClicked, setSearchClicked] = useState(false);

// Validation function for critical fields
const validateSelectionFields = (showAlert = true) => {
  if (!addressDetails.scSchemeDetailsId || addressDetails.scSchemeDetailsId === 0) {
    if (showAlert) Swal.fire({ icon: "warning", title: "Please select Scheme", text: "Scheme is required before selecting rows." });
    return false;
  }

  if (!addressDetails.subSchemeId || addressDetails.subSchemeId === 0) {
    if (showAlert) Swal.fire({ icon: "warning", title: "Please select Component Type", text: "Component Type is required before selecting rows." });
    return false;
  }

  if (!addressDetails.componentId || addressDetails.componentId === 0) {
    if (showAlert) Swal.fire({ icon: "warning", title: "Please select Component", text: "Component is required before selecting rows." });
    return false;
  }

  if (!addressDetails.scCategoryId || addressDetails.scCategoryId === 0) {
    if (showAlert) Swal.fire({ icon: "warning", title: "Please select Sub Component", text: "Sub Component is required before selecting rows." });
    return false;
  }

  if (!addressDetails.financialYearId || addressDetails.financialYearId === 0) {
    if (showAlert) Swal.fire({ icon: "warning", title: "Please select Financial Year", text: "Financial Year is required before selecting rows." });
    return false;
  }

  return true;
};


  const [selectedRows, setSelectedRows] = useState([]);

  // const [showDisable, setShowDisable] = useState(false);
// const handlePush = () => {
//   if (selectedIds.length === 0) {
//     saveError("Please select at least one record.");
//     return;
//   }

//   setPushing(true); // disable Push button

//   const pushdata = {
//     applicationList: selectedIds,
//     userMasterId: localStorage.getItem("userMasterId"),
//     paymentMode: "P",
//     pushType: "P"
//   };

//   api
//     .post(baseURLDBT + `applicationTransaction/saveApplicationTransaction`, pushdata)
//     .then((response) => {
//       if (response.data.content.errorCode) {
//         saveError(response.data.content.error_description);
//         setPushing(false); // re-enable on failure
//       } else {
//         pushedSuccess();
//         getList();
//         // keep disabled (require checkbox re-selection to re-enable)
//         setSelectedIds([]);
//       }
//     })
//     .catch((err) => {
//       saveError(err.response?.data?.validationErrors || "Push failed");
//       setPushing(false); // re-enable on failure
//     });
// };


// const handlePush = (id) => {
//   let applicationList = [];
//   let extraDetails = {};
//   let beneficiaryId = null;
//   let fruitsId = null;

//   if (id) {
    
//     const item = listData.find((row) => row.scApplicationFormId === id);
//     if (!item) {
//       saveError("Application not found in list");
//       return;
//     }
//     applicationList = [id];
//     beneficiaryId = item.beneficiaryId;
//     fruitsId = item.fruitsId;
//     extraDetails = {
//       scApplicationFormServiceId: item.scApplicationFormServiceId,
//       categoryId: item.categoryId,
//       componentId: item.componentId,
//       componentType: item.componentType,
//       sanctionNo: item.sanctionNo,
//       schemeId: item.schemeId,
//     };
//   } else if (selectedRows.length > 0) {

//     applicationList = selectedRows.map((row) => row.scApplicationFormId);

//     const firstRow = listData.find(
//       (item) => item.scApplicationFormId === selectedRows[0].scApplicationFormId
//     );

//      if (firstRow) {
//       beneficiaryId = firstRow.beneficiaryId;
//       fruitsId = firstRow.fruitsId;

//       extraDetails = {
//         scApplicationFormServiceId: firstRow.scApplicationFormServiceId,
//         categoryId: firstRow.categoryId,
//         componentId: firstRow.componentId,
//         componentType: firstRow.componentType,
//         sanctionNo: firstRow.sanctionNo,
//         schemeId: firstRow.schemeId,
//       };
//     }
//   } else {
//     saveError("No applications selected for push");
//     return;
//   }

//   const pushdata = {
//     applicationList,
//     userMasterId: localStorage.getItem("userMasterId"),
//     paymentMode: "P",
//     pushType: "P",
//     ddoCode: reportingOfficerKhazaneRecipientId,
//     ...extraDetails,
//   };

//   api
//     .post(
//       baseURLDBT + `applicationTransaction/saveApplicationTransaction`,
//       pushdata
//     )
//     .then((response) => {
//       if (response.data.content.errorCode) {
//         saveError(response.data.content.error_description);
//         setPushing(false);
//       } else {
//         pushedSuccess(beneficiaryId, fruitsId); // ✅ show IDs in popup
//         getList();
//         setSelectedIds([]);
//         setSelectedRows([]);
//       }
//     })
//     .catch((err) => {
//       saveError(err.response?.data?.validationErrors || "Push failed");
//       setPushing(false);
//     });
// };

// --- Push Logic (no SweetAlert)
// --- Push Logic (same as before)
const handlePush = (id) => {
  let applicationList = [];
  let extraDetails = {}; 
  let beneficiaryId = null;
  let fruitsId = null;

  if (id) {
    const item = listData.find((row) => row.scApplicationFormId === id);
    if (!item) {
      saveError("Application not found in list");
      return;
    }
    applicationList = [id];
    beneficiaryId = item.beneficiaryId;
    fruitsId = item.fruitsId;
    extraDetails = {
      // scApplicationFormServiceId: item.scApplicationFormServiceId,
      // categoryId: item.categoryId,
      // componentId: item.componentId,
      // componentType: item.componentType,
      sanctionNo: item.sanctionNumber,
      // schemeId: item.schemeId,
    };
  } else if (selectedRows.length > 0) {
    applicationList = selectedRows.map((row) => row.scApplicationFormId);
    const firstRow = listData.find(
      (item) => item.scApplicationFormId === selectedRows[0].scApplicationFormId
    );
    if (firstRow) {
      beneficiaryId = firstRow.beneficiaryId;
      fruitsId = firstRow.fruitsId;
      extraDetails = {
        // scApplicationFormServiceId: firstRow.scApplicationFormServiceId,
        // categoryId: firstRow.categoryId,
        // componentId: firstRow.componentId,
        // componentType: firstRow.componentType,
        sanctionNo: firstRow.sanctionNumber,
        // schemeId: firstRow.schemeId,
      };
    }
  } else {
    saveError("No applications selected for push");
    return;
  }

  setPushing(true);

  const pushdata = {
    applicationList,
    userMasterId: localStorage.getItem("userMasterId"),
    paymentMode: "P",
    pushType: "P",
    ddoCode: reportingOfficerDdoCode,
    // sanctionNo:
    ...extraDetails,
  };

  api
    .post(
      baseURLDBT + `applicationTransaction/saveApplicationTransaction`,
      pushdata
    )
    .then((response) => {
      if (response.data.content.errorCode) {
        saveError(response.data.content.error_description);
        setPushing(false); // enable again on failure
      } else {
        const successRows = id 
        ? [listData.find((row) => row.scApplicationFormId === id)]
        : listData.filter((row) => 
            selectedRows.some((sel) => sel.scApplicationFormId === row.scApplicationFormId)
          );
        pushedSuccess(successRows);
        
        // getList()
        // window.location.reload();
        setPushVisible(false);
        setSelectedIds([]);
        setSelectedRows([]);
    //     setTimeout(() => {
    //   window.location.reload();
    // }, 30000);
        // keep disabled after success
      }
    })
    .catch((err) => {
      saveError(err.response?.data?.validationErrors || "Push failed");
      setPushing(false); // enable again on failure
    });
};



  const handleFromDateChange = (date) => {
    setPeriod((prev) => ({ ...prev, periodFrom: date }));
  };

  const handleToDateChange = (date) => {
    setPeriod((prev) => ({ ...prev, periodTo: date }));
  };

  useEffect(() => {
    handleFromDateChange(new Date());
    handleToDateChange(new Date());
  }, []);

  useEffect(() => {
    setUnselectedApplicationIds(
      allApplicationIds.filter((id) => !applicationIds.includes(id))
    );
  }, [allApplicationIds, applicationIds]);

  //   console.log("Unselected",unselectedApplicationIds);
  const [validated, setValidated] = useState(false);
  const postData = (event) => {
  // find the first selected row to extract sanctionNo + ddoCode
  const firstRow = selectedRows[0];

  const post = {
    applicationList: applicationIds,
    paymentMode: "P",
    pushType: "P",
    userMasterId: localStorage.getItem("userMasterId"),
    ddoCode: reportingOfficerDdoCode,
    sanctionNo: firstRow?.sanctionNumber, // ✅ include sanctionNo
  };

  const form = event.currentTarget;
  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
  } else {
    event.preventDefault();
    api
      .post(
        baseURLDBT + `applicationTransaction/saveApplicationTransaction`,
        post
      )
      .then((response) => {
        if (response.data.content.errorCode) {
          saveError(response.data.content.error_description);
        } else {
          saveSuccess();
          getList();
        }
      })
      .catch((err) => {
        saveError(err.response?.data?.validationErrors || "Push failed");
      });
    setValidated(true);
  }
};


  const clear = () => {
    // e.preventDefault();
    // window.location.reload();
    // setAllApplicationIds([]);
    // setUnselectedApplicationIds([]);
    // setAllApplicationIds([]);
  };

  // const getList = () => {
  //   setLoading(true);
  //   api
  //     .post(
  //       baseURLDBT + `service/getDrawingOfficerList`,
  //       {},
  //       { params: { type: 0 } }
  //     )
  //     .then((response) => {
  //       setListData(response.data.content);
  //       const scApplicationFormIds = response.data.content.map(
  //         (item) => item.scApplicationFormId
  //       );
  //       setAllApplicationIds(scApplicationFormIds);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setListData({});
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   getList();
  // }, [page]);

  
       // Fetch default financial year details
const getFinancialDefaultDetails = () => {
  api
    .get(baseURLMasterData + `financialYearMaster/get-is-default`)
    .then((response) => {
      const defaultYearId = response.data.content.financialYearMasterId;

      // Update the correct field
      setAddressDetails((prev) => ({
        ...prev,
        financialYearId: defaultYearId, // <-- set the default financial year
      }));
    })
    .catch((err) => {
      setAddressDetails((prev) => ({
        ...prev,
        financialYearId: "", // fallback if error
      }));
    });
};

const [applicationFormId, setApplicationFormId] = useState(null);
const [scApplicationFormServiceId, setScApplicationFormServiceId] = useState(null);
const [workOrderSchemeId, setWorkOrderSchemeId] = useState(null);
const [workOrderNumber, setWorkOrderNumber] = useState(null);
const [workOrderForScheme, setWorkOrderForScheme] = useState(null);
const [sanctionOrderNumber, setSanctionOrderNumber] = useState(null);
const [sanctionOrderForScheme, setSanctionOrderForScheme] = useState(null);


  const getList = () => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getK2ListForDBTPush`,
        {},
        {
          params: {
             userMasterId: localStorage.getItem("userMasterId"),
              fruitsId: addressDetails.fruitsId || '',
              beneficiaryId: addressDetails.beneficiaryId || '',
              financialYearId: addressDetails.financialYearId || 0,
              componentId: addressDetails.componentId || 0,
              subSchemeId: addressDetails.subSchemeId || 0,
              districtId: addressDetails.districtId || 0,
              talukId: addressDetails.talukId || 0,
              tscMasterId: addressDetails.tscMasterId || 0,
              scSchemeDetailsId: addressDetails.scSchemeDetailsId || 0,
              scCategoryId: addressDetails.scCategoryId || 0,
              pageNumber: page,
              pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
        const scApplicationFormIds = response.data.content.map(
          (item) => item.scApplicationFormId
        );
        const data = response.data.content;
        const recordData = data[0];
        setAllApplicationIds(scApplicationFormIds);

        setApplicationFormId(recordData?.scApplicationFormId);
        setScApplicationFormServiceId(recordData?.scApplicationFormServiceId);
        setWorkOrderSchemeId(recordData?.schemeId);

        setWorkOrderNumber(recordData?.workOrderNumber);
        setWorkOrderForScheme(recordData?.workOrderForScheme);

        setSanctionOrderNumber(recordData?.sanctionOrderNumber);
        setSanctionOrderForScheme(recordData?.sanctionOrderForScheme);
        setLoading(false);
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getFinancialDefaultDetails();
    getList();
  }, [page]);

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
  
    const generateWorkOrderAcknowledgmentRH = async (
      applicationFormId,
      schemeId
    ) => {
      try {
        const response = await api.post(
          baseURLReport + `getAuthorisationLetterFromFarmer`,
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

     const handleDownloadSanctionOrder = (
        applicationFormId,
        schemeId,
        schemeType
      ) => {
        // const schemeId = schemeId;
        // const schemeType = sanctionOrderForScheme; // Fetch the scheme type from the response
    
        Swal.fire({
          title: "Generate Sanction Order",
          text: "Select the recipient:",
          showCancelButton: true,
          confirmButtonText: "Farmer",
          cancelButtonText: "Company",
          showCloseButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // Call the Farmer endpoint based on the scheme type
            if (schemeType === "PMKSY") {
              downloadSanctionOrderAcknowledgment(
                applicationFormId,
                schemeId,
                "farmer",
                "PMKSY"
              );
            } else if (schemeType === "PDMC") {
              downloadSanctionOrderAcknowledgment(
                applicationFormId,
                schemeId,
                "farmer",
                "PDMC"
              );
            } else if (
              schemeType === "Silk Samagra State" ||
              schemeType === "Silk Samagra Central"
            ) {
              downloadSanctionOrderAcknowledgment(
                applicationFormId,
                schemeId,
                "farmer",
                schemeType
              );
            } else {
              console.error("Unknown scheme type for farmer sanction order.");
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Call the Company endpoint based on the scheme type
            if (schemeType === "PMKSY") {
              downloadSanctionOrderAcknowledgment(
                applicationFormId,
                schemeId,
                "company",
                "PMKSY"
              );
            } else if (schemeType === "PDMC") {
              downloadSanctionOrderAcknowledgment(
                applicationFormId,
                schemeId,
                "company",
                "PDMC"
              );
            } else if (
              schemeType === "Silk Samagra State" ||
              schemeType === "Silk Samagra Central"
            ) {
              downloadSanctionOrderAcknowledgment(
                applicationFormId,
                schemeId,
                "company",
                schemeType
              );
            } else {
              console.error("Unknown scheme type for company sanction order.");
            }
          }
        });
      };
    
      const downloadSanctionOrderAcknowledgment = async (
        applicationId,
        schemeId,
        recipientType,
        schemeType
      ) => {
        try {
          // Determine the appropriate endpoint based on the recipient type and scheme type
          let endpoint;
          // if (recipientType === "farmer") {
          //   endpoint =
          //     schemeType === "PMKSY"
          //       ? baseURLReport + `getSanctionOrderPmksy`
          //       : baseURLReport + `getSanctionOrderPDMC`;
          // } else if (recipientType === "company") {
          //   endpoint =
          //     schemeType === "PMKSY"
          //       ? baseURLReport + `getSanctionOrderPmksyCompany`
          //       : baseURLReport + `getSanctionOrderPDMCCompany`;
          // } else {
          //   throw new Error("Invalid recipient type.");
          // }
          if (
            schemeType === "Silk Samagra State" ||
            schemeType === "Silk Samagra Central"
          ) {
            endpoint = baseURLReport + `getSanctionOrder`; // Call the API for Silk Samagra RH
          } else {
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
    
          const response = await api.post(
            endpoint,
            {
              applicationFormId: applicationId,
              schemeId: schemeId,
            },
            {
              responseType: "blob", // Force to receive data in a Blob Format
            }
          );
    
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        } catch (error) {
          console.error("Error generating sanction order:", error);
        }
      };
    
// to get sc-scheme-details
  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);
  const getSchemesList = () => {
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
    getSchemesList();
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
    if (addressDetails.scSchemeDetailsId) {
      getSubSchemeList(addressDetails.scSchemeDetailsId);
    }
  }, [addressDetails.scSchemeDetailsId]);

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

    useEffect(() => {
        if (addressDetails.scSchemeDetailsId && addressDetails.subSchemeId) {
          getComponentList(addressDetails.scSchemeDetailsId, addressDetails.subSchemeId);
          
        }
      }, [addressDetails.scSchemeDetailsId, addressDetails.subSchemeId,addressDetails.scCategoryId]);

  const [scHeadAccountListData, setScHeadAccountListData] = useState([]);

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

  const [scCategoryListData, setScCategoryListData] = useState([]);

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

  // to get component
  // const [scComponentListData, setScComponentListData] = useState([]);

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
  // to get User Master
  // const [userListData, setUserListData] = useState([]);

  // const getUserList = () => {
  //   api
  //     .get(baseURL + `userMaster/get-all`)
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

  // to get District Implementing Officer
    const [tscListData, setTscListData] = useState([]);
  
    const getTscList = (districtId, talukId) => {
      api
        .post(baseURLMasterData + `tscMaster/get-by-districtId-and-talukId`, {
          districtId: districtId,
          talukId: talukId,
        })
        .then((response) => {
          setTscListData(response.data.content.tscMaster);
        })
        .catch((err) => {
          setTscListData([]);
        });
    };
  
    useEffect(() => {
      if (addressDetails.districtId && addressDetails.talukId) {
        // getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
        getTscList(addressDetails.districtId, addressDetails.talukId);
      }
    }, [addressDetails.districtId, addressDetails.talukId]);

  const navigate = useNavigate();
  
  const handleEdit = (_id) => {
    navigate(`/seriui/market-edit/${_id}`);
    // navigate("/seriui/district");
  };

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const deleteConfirm = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        const response = api
          .delete(baseURL + `marketMaster/delete/${_id}`)
          .then((response) => {
            // deleteConfirm(_id);
            getList();
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

  // const [searchData, setSearchData] = useState({
  //   year1: "",
  //   year2: "",
  //   type: 1,
  //   searchText: "",
  // });

  // console.log(searchData);

  

  const handleInputsaddress = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setAddressDetails({ ...addressDetails, [name]: value });
    
  };

  

  


  // // Get Default Financial Year

  // const getFinancialDefaultDetails = () => {
  //   api
  //     .get(baseURLMasterData + `financialYearMaster/get-is-default`)
  //     .then((response) => {
  //       const year = response.data.content.financialYear;
  //       const [fromDate, toDate] = year.split("-");
  //       setData((prev) => ({
  //         ...prev,
  //         financialYearMasterId: response.data.content.financialYearMasterId,
  //       }));
  //       setSearchData((prev) => ({ ...prev, year1: fromDate, year2: toDate }));
  //     })
  //     .catch((err) => {
  //       setData((prev) => ({
  //         ...prev,
  //         financialYearMasterId: "",
  //       }));
  //       setSearchData((prev) => ({ ...prev, year1: "", year2: "" }));
  //     });
  // };

  // useEffect(() => {
  //   getFinancialDefaultDetails();
  // }, []);

  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Pushed successfully",
      text: message,
    });
  };

  // const pushedSuccess = (b,f) => {
  //   Swal.fire({
  //     icon: "success",
  //     title: "Pushed successfully",
  //     text:  `Beneficiary Id is ${b} and Fruits Id is ${f}`,
  //   });
  // };
  const pushedSuccess = (rows) => {
    const details = rows
      .map(
        (item, index) =>
          `${index + 1}. Beneficiary Id: ${item.beneficiaryId}, Fruits Id: ${item.fruitsId}`
      )
      .join("<br>");
  
    Swal.fire({
      icon: "success",
      title: "Pushed successfully",
      html: `Application Details:<br>${details}`,
      confirmButtonText: "OK", // show OK button
    }).then(() => {
      // reload only after clicking OK
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
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };

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

  //   const customStyles = {
  //     rows: {
  //       style: {
  //         minHeight: "45px", // override the row height
  //       },
  //     },
  //     headCells: {
  //       style: {
  //         backgroundColor: "#1e67a8",
  //         color: "#fff",
  //         fontSize: "14px",
  //         paddingLeft: "8px", // override the cell padding for head cells
  //         paddingRight: "8px",
  //       },
  //     },
  //     cells: {
  //       style: {
  //         paddingLeft: "8px", // override the cell padding for data cells
  //         paddingRight: "8px",
  //       },
  //     },
  //   };

  // const customStyles = {
  //   rows: {
  //     style: {
  //       minHeight: "30px", // adjust this value to your desired row height
  //     },
  //   },
  //   // header: {
  //   //   style: {
  //   //     minHeight: "56px",
  //   //   },
  //   // },
  //   // headRow: {
  //   //   style: {
  //   //     borderTopStyle: "solid",
  //   //     borderTopWidth: "1px",
  //   //     // borderTop:"none",
  //   //     // borderTopColor: defaultThemes.default.divider.default,
  //   //     borderColor: "black",
  //   //   },
  //   // },
  //   headCells: {
  //     style: {
  //       // '&:not(:last-of-type)': {
  //       backgroundColor: "#1e67a8",
  //       color: "#fff",
  //       borderStyle: "solid",
  //       bordertWidth: "1px",
  //       // borderColor: defaultThemes.default.divider.default,
  //       borderColor: "black",
  //       // },
  //     },
  //   },
  //   cells: {
  //     style: {
  //       // '&:not(:last-of-type)': {
  //       borderStyle: "solid",
  //       borderWidth: "1px",
  //       paddingTop: "3px",
  //       paddingBottom: "3px",
  //       paddingLeft: "8px",
  //       paddingRight: "8px",
  //       // borderColor: defaultThemes.default.divider.default,
  //       borderColor: "black",
  //       // },
  //     },
  //   },
  // };

  const customStyles = {
    rows: {
      style: {
        minHeight: "30px", // Row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8", // Header background color
        color: "#fff", // Header text color
        borderStyle: "solid", 
        borderWidth: "1px", 
        borderColor: "black", // Header cell border color
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        borderStyle: "solid", 
        borderWidth: "1px", 
        borderColor: "black", // Data cell border color
        paddingTop: "3px",
        paddingBottom: "3px",
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
  };
  

  const ApplicationDataColumns = [
    {
      name: t("Sl.No"),
      selector: (row) => row.serialNumber,
      cell: (row,i) => <span>{row.serialNumber}</span>,
      sortable: true,
      width: "80px",
      hide: "md",
    },
    {
      name:  t("Financial Year"),
      selector: (row) => row.financialYear,
      cell: (row) => <span>{row.financialYear}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name:  t("FRUITS ID"),
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Beneficiary ID"),
      selector: (row) => row.beneficiaryId,
      cell: (row) => <span>{row.beneficiaryId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("farmer_name"),
      selector: (row) => row.farmerFirstName,
      cell: (row) => <span>{row.farmerFirstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name:t("district"),
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
      name: t("village"),
      selector: (row) => row.villageName,
      cell: (row) => <span>{row.villageName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Scheme"),
      selector: (row) => row.schemeName,
      cell: (row) => <span>{row.schemeName}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: t("Component Type"),
      selector: (row) => row.subSchemeName,
      cell: (row) => <span>{row.subSchemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Component"),
      selector: (row) => row.scComponentName,
      cell: (row) => <span>{row.scComponentName}</span>,
      sortable: true,
      hide: "md",
    },
  {
      name: t("Sub Component"),
      selector: (row) => row.categoryName,
      cell: (row) => <span>{row.categoryName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Sanction Number"),
      selector: (row) => row.sanctionNumber,
      cell: (row) => <span>{row.sanctionNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Subsidy Amount"),
      selector: (row) => row.actualAmount,
      cell: (row) => <span>{row.actualAmount}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name:  t("Application Status"),
      selector: (row) => row.applicationStatus,
      cell: (row) => (
        <span style={{ color: "green", fontWeight: "bold" }}>
          {row.applicationStatus}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
    {
      name: t("Remarks"),
      selector: (row) => row.remarks,
      cell: (row) => <span>{row.remarks}</span>,
      sortable: true,
      hide: "md",
    },
    {
  name: t("Action"),
  cell: (row) => (
    <>
      <Button
        variant="primary"
        size="sm"
        onClick={() => handleView(row.scApplicationFormId)}
        className="ms-1"
      >
        {t("View")}
      </Button>
    </>
  ),
  sortable: true,
  hide: "md",
  // grow: 2,
},
// {
//   name: "",
//   cell: (row) => (
//     <Form.Check
//       type="checkbox"
//       checked={selectedIds.includes(row.scApplicationFormId)}
//       onChange={() => handleSelectRow(row.scApplicationFormId)}
//     />
//   ),
//   width: "50px",
// }
  ];

  return (
    <Layout title="Drawing Officer List-K2 Push">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Drawing Officer List-K2 Push")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
  <Card className="mt-1">
    <Row className="m-2">
      <Col>
        <Form.Group className="form-group" id="fid">

          {/* Row 1 */}
          <Row className="mb-3">
            <Form.Label column sm={1}>
              {t("FRUITS ID")}
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                id="fruitsId"
                name="fruitsId"
                value={addressDetails.fruitsId || ""}
                onChange={handleInputsaddress}
                type="text"
                placeholder={t("Enter FRUITS ID")}
              />
            </Col>

            <Form.Label column sm={1}>
              {t("Beneficiary ID")}
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                id="beneficiaryId"
                name="beneficiaryId"
                value={addressDetails.beneficiaryId || ""}
                onChange={handleInputsaddress}
                type="text"
                placeholder={t("Enter Beneficiary ID")}
              />
            </Col>

            <Form.Label column sm={1}>
              {t("Financial Year")}
            </Form.Label>
            <Col sm={3}>
              <Form.Select
                name="financialYearId"
                value={addressDetails.financialYearId || 0}
                onChange={handleInputsaddress}
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
            </Col>
          </Row>

          {/* Row 2 */}
          <Row className="mb-3">

          <Form.Label column sm={1}>
              {t("Scheme")}
            </Form.Label>
            <Col sm={3}>
              <Form.Select
                name="scSchemeDetailsId"
                value={addressDetails.scSchemeDetailsId || 0}
                onChange={handleInputsaddress}
              >
                <option value="">{t("Select Scheme Name")}</option>
                {scSchemeDetailsListData && scSchemeDetailsListData.length ?
                  scSchemeDetailsListData.map((list) => (
                    <option
                      key={list.scSchemeDetailsId}
                      value={list.scSchemeDetailsId}
                    >
                      {list.schemeName}
                  </option>
                ))
                      : ""}
              </Form.Select>
            </Col>

           <Form.Label column sm={1}>
            {t("Component Type")}
          </Form.Label>
          <Col sm={3}>
            <Form.Select
              name="subSchemeId"
              value={addressDetails.subSchemeId || 0}
              onChange={handleInputsaddress}
            >
              <option value="">{t("Select Component Type")}</option>
              {scSubSchemeDetailsListData && scSubSchemeDetailsListData.length
                      ? scSubSchemeDetailsListData.map((list) => (
                <option
                  key={list.scSubSchemeDetailsId}
                  value={list.subSchemeId}
                >
                  {list.subSchemeName}
                </option>
              ))
              : ""}
            </Form.Select>
          </Col>


            <Form.Label column sm={1}>
              {t("Component")}
            </Form.Label>
            <Col sm={3}>
              <Form.Select
                name="componentId"
                value={addressDetails.componentId || 0}
                onChange={handleInputsaddress}
              >
                <option value="">{t("Select Component")}</option>
                {scComponentListData  && scComponentListData.length
                      ? scComponentListData.map((list) => (
                  <option key={list.scComponentId} value={list.scComponentId}>
                    {list.scComponentName}
                  </option>
               ))
                      : ""}
              </Form.Select>
            </Col>  

            
          </Row>

          {/* Row 3 */}
          <Row className="mb-3">

          <Form.Label column sm={1}>
              {t("Sub Component")}
            </Form.Label>
            <Col sm={3}>
              <Form.Select
                name="scCategoryId"
                value={addressDetails.scCategoryId || 0}
                onChange={handleInputsaddress}
              >
                <option value="">{t("Select Sub Component")}</option>
                {scCategoryListData &&
                  scCategoryListData.length ? scCategoryListData.map((list) => (
                    <option
                      key={list.scCategoryId}
                      value={list.scCategoryId}
                    >
                      {list.categoryName}
                  </option>
                ))
                      : ""}
              </Form.Select>
            </Col>      

            <Form.Label column sm={1}>
              {t("District")}
            </Form.Label>
            <Col sm={3}>
              <Form.Select
                name="districtId"
                value={addressDetails.districtId || 0}
                onChange={handleInputsaddress}
              >
                <option value="">{t("Select District")}</option>
                {districtListData && districtListData.length ? districtListData.map((list) => (
                  <option key={list.districtId} value={list.districtId}>
                    {list.districtName}
                  </option>
                ))
                : ""}
              </Form.Select>
            </Col>

            <Form.Label column sm={1}>
              {t("Taluk")}
            </Form.Label>
            <Col sm={3}>
              <Form.Select
                name="talukId"
                value={addressDetails.talukId || 0}
                onChange={handleInputsaddress}
              >
                <option value="0">{t("Select Taluk")}</option>
                {talukListData && talukListData.length
                      ? talukListData.map((list) => (
                          <option key={list.talukId} value={list.talukId}>
                            {list.talukName}
                          </option>
                        ))
                      : ""}
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-3">
            <Form.Label column sm={1}>
              {t("TSC")}
            </Form.Label>
            <Col sm={3}>
              <Form.Select
                name="tscMasterId"
                value={data.tscMasterId}
                onChange={handleInputsaddress}
              >
                <option value="">{t("Select TSC")}</option>
                {tscListData && tscListData.length
                  ? tscListData.map((list) => (
                      <option key={list.tscMasterId} value={list.tscMasterId}>
                        {list.name}
                      </option>
                    ))
                  : ""}
              </Form.Select>
            </Col>

            <Col sm={2} className="d-flex">
              <Button type="button" variant="primary" onClick={search} className="me-2">
                {t("Search")}
              </Button>
              <Button type="button" variant="primary" onClick={exportCsv}>
                {t("Export")}
              </Button>
            </Col>
          </Row>

        </Form.Group>
      </Col>
    </Row>
  </Card>
</Block>



          <Block className='mt-3'>
          <Card>
          <DataTable
            //  title="Market List"
            tableClassName="data-table-head-light table-responsive"
            columns={ApplicationDataColumns}
            data={listData}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={countPerPage}
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
            onChangePage={(page) => setPage(page - 1)}
            progressPending={loading}
            // selectableRows={validateSelectionFields(false)} 
            selectableRows={showCheckboxes}// only enable if all required fields are selected
            onSelectedRowsChange={({ selectedRows }) => {
              if (!validateSelectionFields(true)) return; // prevent selection if fields invalid
              setSelectedRows(selectedRows);
              setSelectedIds(selectedRows.map((row) => row.id));
            }}
            theme="solarized"
            customStyles={customStyles}
          />
        </Card>

       <Form noValidate validated={validated} onSubmit={postData} className="mt-1">
    <div className="gap-col mt-1">
      <ul className="d-flex align-items-center justify-content-center gap g-3">
        <li>
          {/* <Button
          type="button"
          variant="primary"
          onClick={() => handleCheckXmlFile(selectedRows[0]?.scApplicationFormId, reportingOfficerDdoCode)}
          disabled={checkingXml || selectedRows.length === 0}
        >
          {t("Check XML File Details")}
        </Button> */}
        <Button
          type="button"
          variant="primary"
          onClick={() => handleCheckXmlFile(selectedRows, reportingOfficerDdoCode)} // pass all selected rows
          disabled={checkingXml || selectedRows.length === 0}
        >
          {t("Check XML File Details")}
        </Button>
        </li>
        {pushVisible && (
          <li>
            <Button
              type="button"
              variant="primary"
              onClick={() => handlePush()}
              disabled={pushing || selectedRows.length === 0}
            >
              {t("Push")}
            </Button>
          </li>
        )}
        <li>
          <Button type="button" variant="secondary" onClick={clear}>
            {t("cancel")}
          </Button>
        </li>
      </ul>
    </div>
  </Form>

      </Block>

      

<Modal show={showModal} onHide={handleCloseModal} size="xl">
  <Modal.Header closeButton>
    <Modal.Title>{t("View Details")}</Modal.Title>
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
                             <td style={styles.ctstyle}>Farmer Name:</td>
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
                           {/* <tr>
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
                           </tr> */}
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
                     </Accordion.Body>
                   </Accordion.Item>
     
                   {/* Land Details Accordion */}
                   {viewDetailsData?.landDetails?.length > 0 ? (
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
                       Download
                     </Accordion.Header>
                     <Accordion.Body>
                       
     
                        <div className="mt-2">
                              {viewDetailsData?.workOrderNumber && (
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
                                        viewDetailsData.workOrderApplicationFormId,
                                        viewDetailsData.workOrderSchemeId
                                      );
                                    } else if (
                                      viewDetailsData.workOrderForScheme === "Silk Samagra State" ||
                                      viewDetailsData.workOrderForScheme === "Silk Samagra Central"
                                    ) {
                                      generateWorkOrderAcknowledgmentRH(
                                        viewDetailsData.workOrderApplicationFormId,
                                        viewDetailsData.workOrderSchemeId
                                      );
                                    }
                                  }}
                                >
                                  Download Work Order
                                </Button>
                              )}

                              {viewDetailsData?.sanctionOrderNumber && viewDetailsData?.applicationFormId && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() =>
                                    handleDownloadSanctionOrder(
                                      viewDetailsData.applicationFormId,
                                      viewDetailsData.workOrderSchemeId,
                                      viewDetailsData.sanctionOrderForScheme
                                    )
                                  }
                                >
                                  Download Sanction Order
                                </Button>
                              )}
                            </div>
                        </Accordion.Body>
                      </Accordion.Item>

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
    <Button variant="secondary" onClick={handleCloseModal}>
    {t("Close")}
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
                <td style={styles.ctstyle}>FarmerRegNo:</td>
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
                <td>{listData.sanctionNo}</td>
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
                <td style={styles.ctstyle}>FarmerRegNo:</td>
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
                <td>{detail.sanctionNumber}</td> {/* ✅ correct field */}
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

export default DrawingOfficerListForK2Push;
