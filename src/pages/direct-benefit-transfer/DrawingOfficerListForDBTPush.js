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

function DrawingOfficerListForDBTPush() {

  // Translation
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 500;
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
    districtId: 0,
    talukId: 0,
  });

const [pushVisible, setPushVisible] = useState(false);
const [checkingXml, setCheckingXml] = useState(false);

// --- Check XML File Details Button
const handleCheckXmlFile = (appId, ddoCode) => {
  // disable check button
  setCheckingXml(true);
  setPushVisible(false);

  getCheckFileDetails(appId, ddoCode);

  // // start 30s timer
  // if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
  // timeoutIdRef.current = setTimeout(() => {
  //   setPushVisible(true);      // show Push after 30s
  //   setCheckingXml(false);     // re-enable Check XML button
  // }, 30000);

  // open details modal
  viewModal();
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
  const handleCloseModal6 = () => setShowModal6(false);

   const [checkFileDetails, setCheckFileDetails] = useState({});
    const getCheckFileDetails = (appId, ddoCode) => {
      // if (
      //   !actionData.sanctionNo ||
      //   actionData.sanctionNo === "0" ||
      //   actionData.sanctionNo === 0
      // ) {
      //   warningAlert("Please Enter The Sanction Number", "Alert!!!");
      //   return;
      // }
  
      const recordData = listData[0];
  
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
          thirtyMinHold();
        })
        .catch((err) => {
          // setApprovalStageAfterNextStepListData([]);
          setCheckFileDetails([]);
          // alert(err.response.data.errorMessages[0].message[0].message);
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
  

  const [searchData, setSearchData] = useState({
    text: "",
    type: 5,
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURLDBT + `service/getDBTListForDBTPush`,
        {},
        {
          params: {
            districtId: addressDetails.districtId,
            talukId: addressDetails.talukId,
            userMasterId: localStorage.getItem("userMasterId"),
            text: searchData.text,
            type: searchData.type,
            displayAllRecords: true,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
      })
      .catch((err) => {
        setListData([]);
      });
  };

  const exportCsv = (e) => {
    api
      .post(
        baseURLDBT + `service/subsidy-sanctioned-dbt-push-list-report`,
        {},
        {
          params: {
            districtId: addressDetails.districtId,
            talukId: addressDetails.talukId,
            userMasterId: localStorage.getItem("userMasterId"),
            text: searchData.text,
            type: searchData.type,
            displayAllRecords: true,
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
        link.download = `dbt_subsidy_sanctioned_report.csv`;
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

  const [reportingOfficerKhazaneRecipientId, setReportingOfficerKhazaneRecipientId] = useState("");

const getUserMastersList = (_id) => {
    api
      .get(baseURL + `userMaster/get-join/${_id}`)
      .then((response) => {
        if (response.data) {
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
            applicationTransactionDetails: content.applicationTransactionResponses
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

const handleSelectRow = (id) => {
  setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  );
};


  const handleCheckboxChange = (_id) => {
    if (applicationIds.includes(_id)) {
      const dataList = [...applicationIds];
      const newDataList = dataList.filter((data) => data !== _id);
      setApplicationIds(newDataList);
    } else {
      setApplicationIds((prev) => [...prev, _id]);
    }
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
      scApplicationFormServiceId: item.scApplicationFormServiceId,
      categoryId: item.categoryId,
      componentId: item.componentId,
      componentType: item.componentType,
      sanctionNo: item.sanctionNo,
      schemeId: item.schemeId,
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
        scApplicationFormServiceId: firstRow.scApplicationFormServiceId,
        categoryId: firstRow.categoryId,
        componentId: firstRow.componentId,
        componentType: firstRow.componentType,
        sanctionNo: firstRow.sanctionNo,
        schemeId: firstRow.schemeId,
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
    ddoCode: reportingOfficerKhazaneRecipientId,
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
        pushedSuccess(beneficiaryId, fruitsId);
        getList();
        setSelectedIds([]);
        setSelectedRows([]);
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
    const post = {
      applicationList: applicationIds,
      paymentMode: "P",
      pushType:"P",
      userMasterId: localStorage.getItem("userMasterId"),
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
          saveError(err.response.data.validationErrors);
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
      const year = response.data.content.financialYear;
      const [fromDate, toDate] = year.split("-");
      setData({
        financialYearMasterId: response.data.content.financialYearMasterId,
        year1: fromDate,
        year2: toDate
      });
      setSearchData((prev) => ({
        ...prev,
        text: response.data.content.financialYearMasterId // Pre-fill text with financial year
      }));
    })
    .catch((err) => {
      setData({
        financialYearMasterId: "",
        year1: "",
        year2: ""
      });
    });
};


  const getList = () => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getDBTListForDBTPush`,
        {},
        {
          params: {
            userMasterId: localStorage.getItem("userMasterId"),
            displayAllRecords: true,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
        const scApplicationFormIds = response.data.content.map(
          (item) => item.scApplicationFormId
        );
        setAllApplicationIds(scApplicationFormIds);
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

  // console.log(allApplicationIds);

  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState(
    []
  );

  const getSubSchemeList = () => {
    const response = api
      .get(baseURLMasterData + `scSubSchemeDetails/get-all`)
      .then((response) => {
        if (response.data.content.scSubSchemeDetails) {
          setScSubSchemeDetailsListData(
            response.data.content.scSubSchemeDetails
          );
        }
      })
      .catch((err) => {
        setScSubSchemeDetailsListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getSubSchemeList();
  }, []);

  // to get sc-scheme-details
  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);

  const getSchemeList = () => {
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
    getSchemeList();
  }, []);

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
  const [scComponentListData, setScComponentListData] = useState([]);

  const getComponentList = () => {
    api
      .get(baseURLMasterData + `scComponent/get-all`)
      .then((response) => {
        setScComponentListData(response.data.content.scComponent);
      })
      .catch((err) => {
        setScComponentListData([]);
      });
  };

  useEffect(() => {
    getComponentList();
  }, []);
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

  console.log(searchData);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
    if (e.target.name === "financialYearMasterId") {
      const selectedYearObject = financialyearListData.find(
        (year) => year.financialYearMasterId === parseInt(e.target.value)
      );
      const year = selectedYearObject.financialYear;
      const [fromDate, toDate] = year.split("-");
      setSearchData((prev) => ({ ...prev, year1: fromDate, year2: toDate }));
    }
  };

  const handleInputsaddress = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setAddressDetails({ ...addressDetails, [name]: value });
  };

  // const handleInputsSearch = (e) => {
  //   let name = e.target.name;
  //   let value = e.target.value;
  //   setSearchData({ ...searchData, [name]: value });
  // };

  const handleInputsSearch = (e) => {
    const { name, value } = e.target;
    
    // If type is 4, set the financial year ID in searchData
    if (value == 4) {
      setSearchData((prev) => ({
        ...prev,
        [name]: value,
        text: data.financialYearMasterId, // Use the fetched financialYearMasterId
      }));
    } else {
      setSearchData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };


  const handleSearchInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (e.target.name === "type") {
      setSearchData({ ...searchData, [name]: value, searchText: "" });
    } else {
      setSearchData({ ...searchData, [name]: value });
    }
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

  const pushedSuccess = (b,f) => {
    Swal.fire({
      icon: "success",
      title: "Pushed successfully",
      text:  `Beneficiary Id is ${b} and Fruits Id is ${f}`,
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
      selector: (row) => row.scApplicationFormId,
      cell: (row,i) => <span>{i+1}</span>,
      sortable: true,
      width: "80px",
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
  grow: 2,
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
    <Layout title="Drawing Officer List-DBT Push">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Drawing Officer List-DBT Push")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        
        <Card className="mt-1">
          
          <Row className="m-2">
            <Col>
              <Form.Group as={Row} className="form-group" id="fid">
                <Form.Label column sm={1}>
                  {t("Search By")}
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="type"
                      value={searchData.type}
                      onChange={handleInputsSearch}
                    >
                      {/* <option value="0">All</option> */}
                      {/* <option value="1">Sanction No.</option> */}
                      <option value="2">{t("FRUITS ID")}</option>
                      {/* <option value="3">Rejected Reason</option> */}
                      <option value="4">{t("Beneficiary ID")}</option>
                      <option value="5">{t("Financial Year")}</option>
                      <option value="6">{t("Component")}</option>
                      <option value="7">{t("Component Type")}</option>
                    </Form.Select>
                  </div>
                </Col>

                {(Number(searchData.type) === 5 )? (
                  <Col sm={2} lg={2}>
                  <Form.Group className="form-group">
                           
                            <div className="form-control-wrap">
                              <Form.Select
                                name="text"
                                value={searchData.text}
                                onChange={handleInputsSearch}
                                onBlur={() => handleInputsSearch}
                                // multiple
                                required
                                isInvalid={
                                  //  searchData.text === undefined ||
                                  searchData.text === "0"
                                }
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
                            
                            </div>
                          </Form.Group>
                        </Col>
            ) : Number(searchData.type) === 6 ? (
              <Col sm={2} lg={2}>
                <Form.Group className="form-group">
                        <div className="form-control-wrap">
                          <Form.Select
                            name="text"
                            value={searchData.text}
                            onChange={handleInputsSearch}
                            onBlur={() => handleInputsSearch}
                            // multiple
                            required
                            isInvalid={
                            //  searchData.text === undefined ||
                              searchData.text === "0"
                            }
                          >
                            <option value="">{t("Select Component")}</option>
                            {scComponentListData.map((list) => (
                              <option
                                key={list.scComponentId}
                                value={list.scComponentId}
                              >
                                {list.scComponentName}
                              </option>
                            ))}
                          </Form.Select>
                          
                        </div>
                      </Form.Group>
                    </Col>
            ) : Number(searchData.type) === 7 ? (
              <Col sm={2} lg={2}>
              <Form.Group className="form-group">     
                <div className="form-control-wrap">
                  <Form.Select
                   name="text"
                       value={searchData.text}
                       onChange={handleInputsSearch}
                       onBlur={() => handleInputsSearch}
                       // multiple
                       required
                       isInvalid={
                        //  searchData.text === undefined ||
                         searchData.text === "0"
                       }
                  >
                    <option value="">{t("Select Component Type")}</option>
                    {scSubSchemeDetailsListData &&
                      scSubSchemeDetailsListData.map((list, i) => (
                        <option 
                        key={list.scSubSchemeDetailsId}
                          value={list.scSubSchemeDetailsId}>
                          {list.subSchemeName}
                        </option>
                      ))}
                  </Form.Select>
                  
                </div>
                    </Form.Group>
                  </Col>
                ) : (


                <Col sm={2} lg={2}>
                  <Form.Control
                    id="fruitsId"
                    name="text"
                    value={searchData.text}
                    onChange={handleInputsSearch}
                    type="text"
                    placeholder="Search"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                  {t("Field Value is Required")}
                  </Form.Control.Feedback>
                </Col>
              )}

                <Form.Label column sm={1}>
                {t("district")}
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="districtId"
                      value={addressDetails.districtId}
                      onChange={handleInputsaddress}
                      style={{ marginLeft: "-14%" }}
                    >
                      <option value="0">{t("select_district")}</option>
                      {districtListData.map((list) => (
                        <option key={list.districtId} value={list.districtId}>
                          {list.districtName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>

                <Form.Label column sm={1}>
                {t("taluk")}
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="talukId"
                      value={addressDetails.talukId}
                      onChange={handleInputsaddress}
                      style={{ marginLeft: "-14%" }}
                    >
                      <option value="0">{t("select_taluk")}</option>
                      {talukListData.map((list) => (
                        <option key={list.talukId} value={list.talukId}>
                          {list.talukName}
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
                <Col sm={1}>
              <Button type="button" variant="primary" onClick={exportCsv}>
              {t("Export")}
              </Button>
            </Col>
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
            // pagination
            // paginationServer
            // paginationTotalRows={totalRows}
            // paginationPerPage={countPerPage}
            // paginationComponentOptions={{
            //   noRowsPerPage: true,
            // }}
            // onChangePage={(page) => setPage(page - 1)}
            progressPending={loading}
            selectableRows
            onSelectedRowsChange={({ selectedRows }) => {
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
          <Button
            type="button"
            variant="primary"
            onClick={() => handleCheckXmlFile()}
            disabled={checkingXml || selectedRows.length === 0} // disable when checking
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
          <Accordion.Header style={{ backgroundColor: "#0F6CBE",color:"white",fontWeight: "bold" }}
                        className="mb-2">{t("Application Details")}</Accordion.Header>
          <Accordion.Body>
            <table className="table small table-bordered">
              <tbody>
                <tr>
                  <td style={styles.ctstyle}>{t("FRUITS ID")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.fruitsId || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("farmer_name")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.farmerFirstName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Sanction No.")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.sanctionNo || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Sub Scheme Name")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.subSchemeName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Component")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.scComponentName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Scheme Name")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.schemeName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Sub Component")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.categoryName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Scheme Amount")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.schemeAmount || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Period From")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.periodFrom || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Period To")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.periodTo || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("district")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.districtName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("taluk")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.talukName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("village")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.villageName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Application Status")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.applicationStatus || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Remarks")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.remarks || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </Accordion.Body>
        </Accordion.Item>

        {/* Land Details Accordion */}
        {viewDetailsData?.landDetails?.length > 0 ? (
          viewDetailsData.landDetails.map((landDetail, index) => (
            <Accordion.Item eventKey={index + 1} key={index}>
              <Accordion.Header style={{ backgroundColor: "#0F6CBE",color:"white",fontWeight: "bold" }}
                        className="mb-2">{t("Land Details")}</Accordion.Header>
              <Accordion.Body>
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>{t("survey_number")}</td>
                      <td>{landDetail.surveyNumber || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("district")}</td>
                      <td>{landDetail.districtName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("taluk")}</td>
                      <td>{landDetail.talukName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("village")}</td>
                      <td>{landDetail.villageName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Acre")}</td>
                      <td>{landDetail.acre || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("FGunta")}</td>
                      <td>{landDetail.fGunta || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Gunta")}</td>
                      <td>{landDetail.gunta || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Developed Area Acre")}</td>
                      <td>{landDetail.devAcre || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Developed Area F Gunta")}</td>
                      <td>{landDetail.devFGunta || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Developed Area Gunta")}</td>
                      <td>{landDetail.devGunta || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("hissa")}</td>
                      <td>{landDetail.hissa || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Land Code")}</td>
                      <td>{landDetail.landCode || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Main Owner No")}</td>
                      <td>{landDetail.mainOwnerNo || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("owner_name")}</td>
                      <td>{landDetail.ownerName || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </Accordion.Body>
            </Accordion.Item>
          ))
        ) : (
          <Accordion.Item eventKey="land">
            <Accordion.Header style={{ backgroundColor: "#0F6CBE",color:"white",fontWeight: "bold" }}
                        className="mb-2" >{t("Land Details")}</Accordion.Header>
            <Accordion.Body>{t("No Land Details Available")}</Accordion.Body>
          </Accordion.Item>
        )}

        <Accordion.Item eventKey="transaction">
  <Accordion.Header style={{ backgroundColor: "#0F6CBE",color:"white",fontWeight: "bold" }}
                        className="mb-2"> {t("Application Transaction Details")}</Accordion.Header>
  <Accordion.Body>
    <div style={{ overflowX: 'auto' }}>
      <table className="table small table-bordered" style={{ maxWidth: '100%', tableLayout: 'fixed' }}>
        <thead style={styles.headerStyle}>
          <tr>
          <th style={{ width: "10%" }}>{t("FRUITS ID")}</th>
                          <th style={{ width: "10%" }}>{t("Beneficiary ID")}</th>
                          <th style={{ width: "10%" }}>{t("Scheme Amount")}</th>
                          <th style={{ width: "10%" }}>{t("Sanction No.")}</th>
                          <th style={{ width: "10%" }}>{t("Financial Year")}</th>
                          <th style={{ width: "10%" }}>{t("Payment Mode")}</th>
                          <th style={{ width: "10%" }}>{t("File Name")}</th>
                          <th style={{ width: "10%" }}>{t("DBT Push Type")}</th>
                          <th style={{ width: "10%" }}>{t("Status")}</th>
                          <th style={{ width: "10%" }}>{t("Remarks")}</th>
          </tr>
        </thead>
        <tbody>
          {viewDetailsData?.applicationTransactionDetails?.length > 0 ? (
            viewDetailsData.applicationTransactionDetails.map((transaction, index) => (
              <tr key={index}>
                <td style={{ wordBreak: 'break-word' }}>{transaction.fruitsId || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.beneficiaryId || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.schemeAmount || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.sanctionNo || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.financialYear || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.paymentMode || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.fileName || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.dbtPushType || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.status || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.remarks || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">{t("No Transaction Details Available")}</td>
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

<Modal show={showModal6} onHide={handleCloseModal6} size="xl">
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
      </Modal>

     
    </Layout>
  );
}

export default DrawingOfficerListForDBTPush;
