import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import DataTable from "../../../components/AppDataTable";
// import axios from "axios";
import api from "../../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function DistrictWiseMontlyMulberry() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState({
    mulberryTargetTypeId: "",
    financialYearMasterId: "",
    districtId: "",
    talukId: "",
    month: "",
    targetType: "",
    value: "",
    userMasterId: "",
  });

  const [naregaMonth,setNaregaMonth] = useState({
    april:"",
    may:"",
    june:"",
    july:"",
    august:"",
    september:"",
    october:"",
    november:"",
    december:"",
    january:"",
    february:"",
    march:"",
  });

  const handleNarega = (e) => {
    const { name, value } = e.target;
    setNaregaMonth(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [nonNaregaMonth,setNonNargearegaMonth] = useState({
    april:"",
    may:"",
    june:"",
    july:"",
    august:"",
    september:"",
    october:"",
    november:"",
    december:"",
    january:"",
    february:"",
    march:"",
  });

  const handleNonNarega = (e) => {
    const { name, value } = e.target;
    setNonNargearegaMonth(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [type, setType] = useState({
    budgetType: "allocate",
  });

  const [pageNarega, setPageNarega] = useState(0); // UPDATED: zero-based page index
  const [listViewTargetData, setViewTargetListData] = useState([]);
  const [totalRowsNarega, setTotalRowsNarega] = useState(0);
  const [loadingNarega, setLoadingNarega] = useState(false);

  // Pagination and Data states for NON NAREGA
  const [pageNonNarega, setPageNonNarega] = useState(0); // UPDATED: zero-based page index
  const [listViewNnTargetData, setViewNnTargetListData] = useState([]);
  const [totalRowsNonNarega, setTotalRowsNonNarega] = useState(0);
  const [loadingNonNarega, setLoadingNonNarega] = useState(false);
  const [totalRowsReportee, setTotalRowsReportee] = useState(0);
  const [loadingReportee, setLoadingReportee] = useState(false);
    const [pageReportee, setPageReportee] = useState(0); // zero-based
  

  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [validatedAllDateEdit, setValidatedAllDateEdit] = useState(false);

  const [showModal3, setShowModal3] = useState(false);
  const [showModal6, setShowModal6] = useState(false);
  const [showModal4, setShowModal4] = useState(false);



  const handleShowModal3 = () => setShowModal3(true);
  const handleCloseModal3 = () => setShowModal3(false);

  const handleShowModal4 = () => setShowModal4(true);
  const handleCloseModal4 = () => setShowModal4(false);


  const handleShowModal6 = () => setShowModal6(true);
  const handleCloseModal6 = () => setShowModal6(false);
const [triggerNaregaFetch, setTriggerNaregaFetch] = useState(false); 
const [triggerReporteeFetch, setTriggerReporteeFetch] = useState(false); 

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

// to get all month target
  const getAllMonthTarget = () => {
     api
      .post(baseURLTargetSetting + `mulberryTargets/getMulberryRecords?districtId=${data.districtId}&financialYearId=${data.financialYearMasterId}&mulberryTargetTypeId=${data.mulberryTargetTypeId}` + (data.talukId?(`&talukId=${data.talukId}`):('')))
      .then((response) => {
        const naregaMonthList = response.data.naregaMonths;
        const nonNaregaMonthList = response.data.nonNaregaMonths;
        if (
          naregaMonthList && naregaMonthList.length > 0 &&
          nonNaregaMonthList && nonNaregaMonthList.length > 0
        ){
          const naregaMonth = naregaMonthList[0];
          const nonNaregaMonth = nonNaregaMonthList[0];
          setNaregaMonth({
            april:naregaMonth.april,
            may:naregaMonth.may,
            june:naregaMonth.june,
            july:naregaMonth.july,
            august:naregaMonth.august,
            september:naregaMonth.september,
            october:naregaMonth.october,
            november:naregaMonth.november,
            december:naregaMonth.december,
            january:naregaMonth.january,
            february:naregaMonth.february,
            march:naregaMonth.march,
          });
          setNonNargearegaMonth({
            april:nonNaregaMonth.april,
            may:nonNaregaMonth.may,
            june:nonNaregaMonth.june,
            july:nonNaregaMonth.july,
            august:nonNaregaMonth.august,
            september:nonNaregaMonth.september,
            october:nonNaregaMonth.october,
            november:nonNaregaMonth.november,
            december:nonNaregaMonth.december,
            january:nonNaregaMonth.january,
            february:nonNaregaMonth.february,
            march:nonNaregaMonth.march,
          });
        }else{
          setNaregaMonth({
            april:"",
            may:"",
            june:"",
            july:"",
            august:"",
            september:"",
            october:"",
            november:"",
            december:"",
            january:"",
            february:"",
            march:"",
          });
          setNonNargearegaMonth({
            april:"",
            may:"",
            june:"",
            july:"",
            august:"",
            september:"",
            october:"",
            november:"",
            december:"",
            january:"",
            february:"",
            march:"",
          });
        }
        // setFinancialyearListData(response.data.content.financialYearMaster);
      })
      .catch((err) => {
        // setFinancialyearListData([]);
      });
  };


  const fetchNaregaData = (page) => {
    setLoadingNarega(true);
    api
      .post(
        baseURLTargetSetting + `mulberryTargets/viewMulberryDetails`,
        {},
        {
          params: {
            financialYearMasterId: data.financialYearMasterId,
            mulberryTargetTypeId: data.mulberryTargetTypeId,
            targetType: "NAREGA",
            pageNumber: page, // UPDATED: send zero-based page index to API
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setViewTargetListData(response.data.content);
        setTotalRowsNarega(response.data.totalRecords);
        // setShowModal4(true);
      })
      .catch(() => {
        setViewTargetListData([]);
        setTotalRowsNarega(0);
      })
      .finally(() => setLoadingNarega(false));
  };



  // Fetch function for NON NAREGA targets - includes page param
  const fetchNonNaregaData = (page) => {
    setLoadingNonNarega(true);
    api
      .post(
        baseURLTargetSetting + `mulberryTargets/viewMulberryDetails`,
        {},
        {
          params: {
            financialYearMasterId: data.financialYearMasterId,
            mulberryTargetTypeId: data.mulberryTargetTypeId,
            targetType: "NON NAREGA",
            pageNumber: page, // UPDATED: zero-based page index
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setViewNnTargetListData(response.data.content);
        setTotalRowsNonNarega(response.data.totalRecords);
        // setShowModal4(true);
      })
      .catch(() => {
        setViewNnTargetListData([]);
        setTotalRowsNonNarega(0);
      })
      .finally(() => setLoadingNonNarega(false));
  };



  useEffect(() => {
    if (data.financialYearMasterId && data.mulberryTargetTypeId) {
      fetchNaregaData(pageNarega); // UPDATED: fetch with current page state
      fetchNonNaregaData(pageNonNarega);
    }
  }, [pageNarega, pageNonNarega, data.financialYearMasterId, data.mulberryTargetTypeId]);

  // UPDATED: Handler for NAREGA page change from DataTable (1-based to 0-based)
  const handlePageChangeNarega = (page) => {
    setPageNarega(page - 1); // UPDATED: convert 1-based page to zero-based
  };

  // UPDATED: Handler for NON NAREGA page change
  const handlePageChangeNonNarega = (page) => {
    setPageNonNarega(page - 1); // UPDATED: convert 1-based page to zero-based
  };

  const handleOpenModal = () => {
    if (!data.financialYearMasterId || data.financialYearMasterId === "0") {
      Swal.fire({ icon: "warning", title: "Please select Financial Year", text: "Please try again!" });
      return;
    }
    if (!data.mulberryTargetTypeId || data.mulberryTargetTypeId === "0") {
      Swal.fire({ icon: "warning", title: "Please select Target", text: "Please try again!" });
      return;
    }
    setPageNarega(0); // ✅ Reset to page 0 before opening
setPageNonNarega(0); // ✅ Reset to page 0 before opening
setShowModal4(true); // ✅ Open modal after resetting page
  };

  // ✅ NEW useEffect
useEffect(() => {
  if (
    triggerNaregaFetch &&
    data.financialYearMasterId &&
    data.mulberryTargetTypeId
  ) {
    fetchNaregaData(pageNarega);              
    fetchNonNaregaData(pageNonNarega);        
    setShowModal4(true);                      
    setTriggerNaregaFetch(false);             
  }
}, [triggerNaregaFetch, pageNarega, pageNonNarega, data.financialYearMasterId, data.mulberryTargetTypeId]);  // ✅ NEW LINE


  

// const fetchViewReporteesTargetData = (page) => {
//   setLoading(true); // 🔄 Show loading while fetching data

//   api
//     .post(
//       baseURLTargetSetting + `mulberryTargets/viewHierarchyMulberryDetails`,
//       {},
//       {
//         params: {
//           financialYearMasterId: data.financialYearMasterId,
//             mulberryTargetTypeId: data.mulberryTargetTypeId,
//           // targetType:trType,
//           pageNumber: page,        // 🔄 Send current page (0-indexed)
//           pageSize: countPerPage,  // 🔄 Number of records per page
//         },
//       }
//     )
//     .then((response) => {
//       setViewReporteesTargetListData(response.data.content); 
//       setTotalRows(response.data.totalRecords);              // 🔄 Set total records for DataTable pagination
//       setShowModal6(true);
//     })
//     .catch((err) => {
//       setViewReporteesTargetListData([]);                    // 🔄 Reset list on error
//     })
//     .finally(() => setLoading(false));                       // 🔄 Turn off loading state
// };

// // ✅ Only fetch reportee data when modal is explicitly opened
// useEffect(() => {
//   if (showModal6) {
//     fetchViewReporteesTargetData(page);
//   }
// }, [page, showModal6]); // ✅ watch both `page` and `showModal6`

  
  useEffect(() => {
    if(data.districtId && data.financialYearMasterId && data.mulberryTargetTypeId){
      getAllMonthTarget();
    }
  }, [data.districtId,data.financialYearMasterId,data.mulberryTargetTypeId,data.talukId]);

  // get list
  const getList = () => {
    setLoading(true);
    api
      .get(baseURLTargetSetting + `mulberryTargets/list-Mulberry-join`, _params)
      .then((response) => {
        setListData(response.data.content.body.content.mulberryTargets);
        setTotalRows(response.data.content.body.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [page]);

  const [editData, setEditData] = useState({
    mulberryTargetTypeId: "",
    financialYearMasterId: "",
    districtId: "",
    talukId: "",
    month: "",
    targetType: "",
    value: "",
    raceMasterId: "",
    userMasterId: "",
     
  });

  const handleEdit = (mulberryTargetsId) => {
    setLoading(true);
    const response = api
      .get(
        baseURLTargetSetting +
          `mulberryTargets/get-by-id?id=${mulberryTargetsId}`
      )
      .then((response) => {
        console.log(
          "heslsls",
          response.data.content.body.content.mulberryTargets
        );
        setEditData(response.data.content.body.content.mulberryTargets);
        setUserNameEdit(
          response.data.content.body.content.mulberryTargets.userMasterName
        );
        setShowModal3(true);
        setLoading(false);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setEditData({});
        // editError(message);
        setLoading(false);
      });
  };

  // to get mulberry target type
  const [mulberryTargetTypeData, setMulberryTargetTypeData] = useState([]);

  const getMulberryTargetTypeList = () => {
    api
      .get(baseURLMasterData + `mulberryTargetType/get-by-required-true`)
      .then((response) => {
        // setMulberryTargetTypeData(response.data.content.mulberryTargetType);
        setMulberryTargetTypeData(response.data.mulberryTargetType);
      })
      .catch((err) => {
        setMulberryTargetTypeData([]);
      });
  };

  useEffect(() => {
    getMulberryTargetTypeList();
  }, []);

  // to get taluk
  const [talukListDatas, setTalukListDatas] = useState([]);
  const getTalukListData = (_id) => {
    const response = api
      .get(baseURLMasterData + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        if (response.data.content.taluk) {
          setTalukListData(response.data.content.taluk);
        }
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.districtId) {
      getTalukList(data.districtId);
    }
  }, [data.districtId]);

  const fetchViewReporteesTargetData = (page) => {
    setLoadingReportee(true);
  
    api
      .post(
        baseURLTargetSetting + `mulberryTargets/viewHierarchyMulberryDetails`,
        {},
        {
          params: {
            financialYearMasterId: data.financialYearMasterId,
            mulberryTargetTypeId: data.mulberryTargetTypeId,
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setViewReporteesTargetListData(response.data.content);
        setTotalRowsReportee(response.data.totalRecords);
        // setShowModal6(true);
      })
      .catch(() => {
        setViewReporteesTargetListData([]);
        setTotalRowsReportee(0);
      })
      .finally(() => setLoadingReportee(false));
  };
  
  const handlePageChangeReportee = (page) => {
    setPageReportee(page - 1); // convert to 0-based
  };
  
  
  useEffect(() => {
    if (data.financialYearMasterId && data.mulberryTargetTypeId) {
      fetchViewReporteesTargetData(pageReportee);
    }
  }, [pageReportee, data.financialYearMasterId, data.mulberryTargetTypeId]);
  
  
   useEffect(() => {
     if(data.districtId && data.financialYearMasterId && data.mulberryTargetTypeId && data.tscMasterId){
       getAllMonthTarget();
     }
   }, [data.districtId,data.financialYearMasterId,data.mulberryTargetTypeId,data.tscMasterId]);
  
  

  // to get District
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    const response = api
      .get(baseURLMasterData + `district/get-all`)
      .then((response) => {
        setDistrictListData(response.data.content.district);
      })
      .catch((err) => {
        setDistrictListData([]);
      });
  };

  useEffect(() => {
    getDistrictList();
  }, []);

  // to get User
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
    getUserList();
  }, []);

  const customStyles = {
    table: { style: { borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(30, 103, 168, 0.06)" } },
    rows: {
      style: { minHeight: "45px", fontSize: "13.5px", color: "#2b2d42", borderBottom: "1px solid #eef1f6 !important", transition: "background-color 0.15s ease" },
      highlightOnHoverStyle: { backgroundColor: "#f4f8fd", cursor: "pointer", outline: "none" },
      stripedStyle: { backgroundColor: "#fbfcfe" },
    },
    headRow: { style: { minHeight: "50px", background: "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" } },
    headCells: {
      style: {
        backgroundColor: "transparent",
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.3px",
        textTransform: "uppercase",
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    pagination: { style: { borderTop: "1px solid #eef1f6", fontSize: "13px", color: "#5a6577" } },
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    // setData({ ...data, [name]: value });
    let updatedData = { ...data, [name]: value };
    if (name === "centralBudget" || name === "stateBudget") {
      const centralBudget = parseFloat(updatedData.centralBudget);
      const stateBudget = parseFloat(updatedData.stateBudget);
      const totalAmount =
        (isNaN(centralBudget) ? 0 : centralBudget) +
        (isNaN(stateBudget) ? 0 : stateBudget);
      updatedData = { ...updatedData, amount: totalAmount.toString() };
    }
    setData(updatedData);
  };

  const handleEditInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setEditData({ ...editData, [name]: value });
  };
  const handleTypeInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setType({ ...type, [name]: value });
  };
  // const _header = { "Content-Type": "application/json", accept: "*/*" };
  // const _header = { "Content-Type": "application/json", accept: "*/*",  'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`, "Access-Control-Allow-Origin": "*"};
  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  // const postData = (e) => {
  //   axios
  //     .post(baseURLMasterData + `Budget/add`, data, {
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

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      console.log("Entered Allocate");
      api
        .post(
          baseURLTargetSetting + `mulberryTargets/saveDistrictMulberryTargets`,
          {...data,naregaMonths:[naregaMonth],nonNaregaMonths:[nonNaregaMonth]}
        )
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            getList();
            // clear();
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

  const postEditData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedAllDateEdit(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      console.log("Entered Allocate");
      api
        .post(
          baseURLTargetSetting + `mulberryTargets/editMulberryTargets`,
          editData
        )
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            getList();
            editClear();
            handleCloseModal3();
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
      setValidatedAllDateEdit(true);
    }
  };

  // Get Default Financial Year

  const getFinancialDefaultDetails = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-is-default`)
      .then((response) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId: response.data.content.financialYearMasterId,
        }));
      })
      .catch((err) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId: "",
        }));
      });
  };

  useEffect(() => {
    getFinancialDefaultDetails();
  }, []);

  const styles = {
    button: {
      backgroundColor: "#007bff",
      border: "none",
      padding: "10px 20px",
      fontSize: "16px",
      color: "#fff",
      borderRadius: "5px",
      cursor: "pointer",
      marginBottom: "20px",
      transition: "background-color 0.3s ease",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    ctstyle: {
      fontWeight: "bold",
      padding: "10px",
      backgroundColor: "#f8f9fa",
    },
  };

  const navigate = useNavigate();

  const handleView = (_id) => {
    navigate(`/seriui/taluk-view/${_id}`);
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
          .delete(
            baseURLTargetSetting +
              `mulberryTargets/delete-mulberry-targets/${_id}`
          )
          .then((response) => {
            // deleteConfirm(_id);
            getFinancialList();
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

  const ProductionPhysicalDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          {/* <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.productionTargetsId)}
          >
            View
          </Button> */}
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.mulberryTargetsId)}
          >
            {t("Edit")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.mulberryTargetsId)}
            className="ms-2"
          >
            {t("Delete")}
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    },
    {
      name: t("Financial Year"),
      selector: (row) => row.financialYearMaster,
      cell: (row) => <span>{row.financialYearMaster}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Mulberry Target Type"),
      selector: (row) => row.mulberryTargetTypeName,
      cell: (row) => <span>{row.mulberryTargetTypeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("District"),
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Taluk"),
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Target Type"),
      selector: (row) => row.targetType,
      cell: (row) => <span>{row.targetType}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("Month"),
      selector: (row) => row.month,
      cell: (row) => <span>{row.month}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("User Name"),
      selector: (row) => row.userMasterName,
      cell: (row) => <span>{row.userMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Target No."),
      selector: (row) => row.value,
      cell: (row) => <span>{row.value}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  const clear = () => {
    setData({
      mulberryTargetTypeId: "",
      financialYearMasterId: "",
      districtId: "",
      talukId: "",
      month: "",
      targetType: "",
      value: "",
      userMasterId: "",
       
    });
    setSearchData({
      districtId: "",
      talukId: "",
      designationId: "",
      phoneNumber: "",
      username: "",
      userMasterId: "",
    });
    setUserName("");
    setType({
      budgetType: "allocate",
    });
    getFinancialDefaultDetails();
    setValidated(false);
  };

  const editClear = () => {
    setEditData({
      mulberryTargetTypeId: "",
      financialYearMasterId: "",
      districtId: "",
      talukId: "",
      month: "",
      targetType: "",
      value: "",
      userMasterId: "",
       
    });
    setType({
      budgetType: "allocate",
    });
    getFinancialDefaultDetails();
    setValidatedAllDateEdit(false);
  };

  

  const [listViewReporteesTargetData, setViewReporteesTargetListData] =
    useState({});

  const searchReportee = (fyId,mulbTrgtTyId,trType) => {
    const { financialYearMasterId, mulberryTargetTypeId, targetType } = data;

    if (!financialYearMasterId || financialYearMasterId === "0") {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Financial Year is required.",
      });
      return;
    }

    if (!mulberryTargetTypeId || mulberryTargetTypeId === "0") {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Target is required.",
      });
      return;
    }

    // if (!targetType || targetType === "0") {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Validation Error",
    //     text: "Target Type is required.",
    //   });
    //   return;
    // }

    // Proceed with API call if validations pass
    api
      .post(
        baseURLTargetSetting + `mulberryTargets/viewHierarchyMulberryDetails`,
        {},
        {
          params: {
            financialYearMasterId,
            mulberryTargetTypeId,
            targetType:trType,
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setViewReporteesTargetListData(response.data.content);
        setTotalRows(response.data.totalRecords);
        // setShowModal6(true);
        setTriggerReporteeFetch(true); 

      })
      .catch((err) => {
        setViewReporteesTargetListData([]);
      });
  };

  useEffect(() => {
  if (triggerReporteeFetch) {
    fetchViewReporteesTargetData(page); 
    setShowModal6(true);                 
    setTriggerReporteeFetch(false);      
  }
}, [triggerReporteeFetch, page]);

  const ViewTargetReporteeDataColumns = [
    {
      name: t("Serial Number"),
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
      hide: "md",
      style: { width: "50px", textAlign: "center" },
    },
    {
      name: t("Financial Year"),
      selector: (row) => row.financialYearMaster,
      cell: (row) => <span>{row.financialYearMaster}</span>,
      sortable: true,
      hide: "md",
      style: { width: "100px", textAlign: "center" },
    },
    {
      name: t("Target"),
      selector: (row) => row.mulberryTargetTypeName,
      cell: (row) => <span>{row.mulberryTargetTypeName}</span>,
      sortable: true,
      hide: "md",
      style: { width: "100px", textAlign: "center" },
    },

    {
      name: t("District"),
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
      style: { width: "100px", textAlign: "center" },
    },
    {
      name: t("Taluk"),
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
      hide: "md",
      style: { width: "100px", textAlign: "center" },
    },
    {
      name: t("Target Type"),
      selector: (row) => row.targetType,
      cell: (row) => <span>{row.targetType}</span>,
      sortable: true,
      hide: "md",
      style: { width: "100px", textAlign: "center" },
    },
    {
      name: t("Month"),
      selector: (row) => row.month,
      cell: (row) => <span>{row.month}</span>,
      sortable: true,
      hide: "md",
      style: { width: "100px", textAlign: "center" },
    },
    {
      name: t("Target No"),
      selector: (row) => row.value,
      cell: (row) => <span>{row.value}</span>,
      sortable: true,
      hide: "md",
      style: { width: "100px", textAlign: "center" },
    },
    {
      name: t("User"),
      selector: (row) => row.userMasterName,
      cell: (row) => <span>{row.userMasterName}</span>,
      sortable: true,
      hide: "md",
      style: { width: "100px", textAlign: "center" },
    },
  ];

  // const [showModal4, setShowModal4] = useState(false);


  // const [listViewTargetData, setViewTargetListData] = useState({});
  // const [listViewNnTargetData, setViewNnTargetListData] = useState({});

  const search = (event) => {
    const { financialYearMasterId, mulberryTargetTypeId, targetType } = data;

    if (!financialYearMasterId || financialYearMasterId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select Financial Year",
        text: "Please try again!",
      });
      return;
    }

    if (!mulberryTargetTypeId || mulberryTargetTypeId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select Target",
        text: "Please try again!",
      });
      return;
    }

    // if (!targetType || targetType === "0") {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Please select Target Type",
    //     text: "Please try again!",
    //   });
    //   return;
    // }

    // Proceed with API call if validations pass
    api
      .post(
        baseURLTargetSetting + `mulberryTargets/viewMulberryDetails`,
        {},
        {
          params: {
            financialYearMasterId,
            mulberryTargetTypeId,
            targetType :"NAREGA",
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setViewTargetListData(response.data.content);
        setTotalRows(response.data.totalRecords);
        setShowModal4(true);
      })
      .catch((err) => {
        setViewTargetListData([]);
      });

      api
      .post(
        baseURLTargetSetting + `mulberryTargets/viewMulberryDetails`,
        {},
        {
          params: {
            financialYearMasterId,
            mulberryTargetTypeId,
            targetType :"NON NAREGA",
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setViewNnTargetListData(response.data.content);
        setTotalRows(response.data.totalRecords);
        setShowModal4(true);
      })
      .catch((err) => {
        setViewNnTargetListData([]);
      });
  };

  const [viewTotalTargetsDataNarega, setViewTotalTargetsDataNarega] = useState({});
  const [viewTotalTargetsDataNonNarega, setViewTotalTargetsDataNonNarega] = useState({});

  const totalTarget = (event) => {
    const {
      districtId,
      mulberryTargetTypeId,
      financialYearMasterId,
      talukId,
    } = data;

    if (!districtId || districtId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select District",
        text: "Please try again!",
      });
      return;
    }

    if (!financialYearMasterId || financialYearMasterId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select Financial Year",
        text: "Please try again!",
      });
      return;
    }

    if (!mulberryTargetTypeId || mulberryTargetTypeId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select Target",
        text: "Please try again!",
      });
      return;
    }

    // if (!targetType || targetType === "0") {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Please select Target Type",
    //     text: "Please try again!",
    //   });
    //   return;
    // }

    // Proceed with API call if validations pass
    const targets = ["NAREGA","NON NAREGA"];
    targets.forEach((target) => {
      api
      .post(
        baseURLTargetSetting + `mulberryTargets/getTargetDetails`,
        {},
        {
          params: {
            districtId,
            mulberryTargetTypeId,
            targetType:target,
            financialYearMasterId,
            ...(talukId && {talukId})
          },
        }
      )
      .then((response) => {
        if(target === "NAREGA"){
          setViewTotalTargetsDataNarega(response.data);
        }
        else{
          setViewTotalTargetsDataNonNarega(response.data);
        }
          
        // setTotalRows(response.data.totalRecords);
        // setShowModal4(true);
      })
      .catch((err) => {
        if(target === "NAREGA"){
        setViewTotalTargetsDataNarega([]);
        }else{
          setViewTotalTargetsDataNonNarega([]);
        }
      });
    });

    
  };

  const [viewMonthlyTargetsData, setViewMonthlyTargetsData] = useState({});

  const monthlyTarget = (event) => {
    const {
      districtId,
      mulberryTargetTypeId,
      targetType,
      financialYearMasterId,
      month,
    } = data;

    if (!districtId || districtId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select District",
        text: "Please try again!",
      });
      return;
    }

    if (!financialYearMasterId || financialYearMasterId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select Financial Year",
        text: "Please try again!",
      });
      return;
    }

    if (!mulberryTargetTypeId || mulberryTargetTypeId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select Target",
        text: "Please try again!",
      });
      return;
    }

    if (!targetType || targetType === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select Target Type",
        text: "Please try again!",
      });
      return;
    }

    if (!month || month === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select Month",
        text: "Please try again!",
      });
      return;
    }

    // Proceed with API call if validations pass
    api
      .post(
        baseURLTargetSetting + `mulberryTargets/getMonthlyTargetDetails`,
        {},
        {
          params: {
            districtId,
            mulberryTargetTypeId,
            targetType,
            financialYearMasterId,
            month,
          },
        }
      )
      .then((response) => {
        setViewMonthlyTargetsData(response.data);
        // setTotalRows(response.data.totalRecords);
        // setShowModal4(true);
      })
      .catch((err) => {
        setViewMonthlyTargetsData([]);
      });
  };

  const ViewTargetDataColumns = [
    {
      name: t("Sl.no"),
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
      hide: "md",
      style: { width: "50px", textAlign: "center" },
    },
    {
      name: t("Financial Year"),
      selector: (row) => row.financialYearMaster,
      cell: (row) => <span>{row.financialYearMaster}</span>,
      sortable: true,
      hide: "md",
      style: { minWidth: "150px", textAlign: "left" },
      style: { width: "100px", textAlign: "center" },
    },
    {
      name: t("Target"),
      selector: (row) => row.mulberryTargetTypeName,
      cell: (row) => <span>{row.mulberryTargetTypeName}</span>,
      sortable: true,
      hide: "md",
      style: { width: "100px", textAlign: "center" },
    },

    {
      name: t("District"),
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
      style: { width: "100px", textAlign: "center" },
    },
    {
      name: t("Taluk"),
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
      hide: "md",
      style: { width: "100px", textAlign: "center" },
    },
    {
      name: t("Target Type"),
      selector: (row) => row.targetType,
      cell: (row) => <span>{row.targetType}</span>,
      sortable: true,
      hide: "md",
      style: { width: "100px", textAlign: "center" },
    },
    {
      name: t("Month"),
      selector: (row) => row.month,
      cell: (row) => <span>{row.month}</span>,
      sortable: true,
      hide: "md",
      style: { width: "100px", textAlign: "center" },
    },
    {
      name: t("Target No"),
      selector: (row) => row.value,
      cell: (row) => <span>{row.value}</span>,
      sortable: true,
      hide: "md",
      style: { width: "100px", textAlign: "center" },
    },
    // {
    //   name: "User",
    //   selector: (row) => row.userMasterName,
    //   cell: (row) => <span>{row.userMasterName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: t("Action"),
      cell: (row) => (
        <div className="text-start w-100">
          <Button
            variant="danger"
            size="sm"
            onClick={() =>
              searchReportee(
                row.financialYearMasterId,
                row.mulberryTargetTypeId,
                row.targetType
              )
            }
            className="ms-2"
          >
            {t("View Reportee Details")}
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2,
    },
  ];

  const [searchData, setSearchData] = useState({
    districtId: "",
    talukId: "",
    designationId: "",
    // villageId: "",
    phoneNumber: "",
    username: "",
    userMasterId: "",
  });

  const userSearchClear = () => {
    setSearchData({
      districtId: "",
      talukId: "",
      designationId: "",
      // villageId: "",
      phoneNumber: "",
      username: "",
      userMasterId: "",
    });
  };

  const [searchDataEdit, setSearchDataEdit] = useState({
    districtId: "",
    talukId: "",
    designationId: "",
    // villageId: "",
    phoneNumber: "",
    username: "",
    userMasterId: "",
  });

  const userSearchEditClear = () => {
    setSearchDataEdit({
      districtId: "",
      talukId: "",
      designationId: "",
      // villageId: "",
      phoneNumber: "",
      username: "",
      userMasterId: "",
    });
  };

  //   to get data from api
  const [userName, setUserName] = useState("");
  const [userNameEdit, setUserNameEdit] = useState("");
  const getIdList = (id) => {
    setLoading(true);
    api
      .get(baseURLMasterData + `userMaster/get/${id}`)
      .then((response) => {
        console.log("heheheeh", response.data.content.username);
        setUserName(response.data.content.username);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setUserName("");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (searchData.userMasterId) {
      getIdList(searchData.userMasterId);
    }
  }, [searchData.userMasterId]);

  const getIdListEdit = (id) => {
    setLoading(true);
    api
      .get(baseURLMasterData + `userMaster/get/${id}`)
      .then((response) => {
        console.log("heheheeh", response.data.content.username);
        setUserNameEdit(response.data.content.username);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setUserNameEdit("");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (searchDataEdit.userMasterId) {
      getIdListEdit(searchDataEdit.userMasterId);
    }
  }, [searchDataEdit.userMasterId]);

  const handleSearchInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  const handleSearchInputsEdit = (e) => {
    // debugger;
    let { name, value } = e.target;
    setSearchDataEdit({ ...searchDataEdit, [name]: value });
  };

  const [showModal5, setShowModal5] = useState(false);
  const [showModal7, setShowModal7] = useState(false);

  const handleShowModal5 = () => setShowModal5(true);
  const handleCloseModal5 = () => {
    setShowModal5(false);
    userSearchClear();
  };

  const handleShowModal7 = () => setShowModal7(true);
  const handleCloseModal7 = () => {
    setShowModal7(false);
    userSearchEditClear();
  };

  // const handleUserSelect = (userId) => {
  //   setSearchData({ ...searchData, userMasterId: userId }); // Update data with selected user ID
  //   setShowModal5(false); // Close modal
  // };
  // const handleUserSelect = (userId) => {
  //   // Update the `userMasterId` in your `data` state
  //   setData((prevData) => ({
  //     ...prevData,
  //     userMasterId: userId,
  //   }));
  // };
  const handleUserSelect = (userId) => {
    // Update both `userMasterId` in `data` and `searchData` states
    setData((prevData) => ({
      ...prevData,
      userMasterId: userId,
    }));

    setSearchData((prevSearchData) => ({
      ...prevSearchData,
      userMasterId: userId,
    }));
  };

  const handleUserEditSelect = (userId) => {
    setEditData((prevData) => ({
      ...prevData,
      userMasterId: userId,
    }));
    setSearchDataEdit((prevSearchData) => ({
      ...prevSearchData,
      userMasterId: userId,
    }));
  };

  // const searchUser = (e) => {
  //   api
  //     .post(
  //       baseURLMasterData + `userMaster/get-by-designationId-districtId-talukId-and-mobileNumber-userName`,
  //       {},
  //       {
  //         params: {
  //           districtId: searchData.districtId,
  //           talukId: searchData.talukId,
  //           designationId: searchData.designationId,
  //           mobileNumber: searchData.mobileNumber,
  //           username: searchData.username,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       if (response.data && response.data.content && response.data.content.userMaster) {
  //         setUserListData(response.data.content.userMaster); // Ensure userMaster is an array
  //       } else {
  //         setUserListData([]); // Fallback to an empty array if the data is not structured as expected
  //       }
  //     })
  //     .catch((err) => {
  //       setUserListData([]); // Ensure userListData is reset on error
  //     });
  // };
  const searchUser = (e) => {
    // Build the params object dynamically
    const params = {};

    // Only add the parameters to the params object if they are not empty or undefined
    if (searchData.districtId) params.districtId = searchData.districtId;
    if (searchData.talukId) params.talukId = searchData.talukId;
    if (searchData.designationId)
      params.designationId = searchData.designationId;
    if (searchData.phoneNumber) params.phoneNumber = searchData.phoneNumber;
    if (searchData.username) params.username = searchData.username;

    api
      .post(
        baseURLMasterData +
          `userMaster/get-by-designationId-districtId-talukId-and-mobileNumber-userName`,
        {},
        {
          params: params, // Pass the dynamically built params
        }
      )
      .then((response) => {
        if (
          response.data &&
          response.data.content &&
          response.data.content.userMaster
        ) {
          setUserListData(response.data.content.userMaster); // Ensure userMaster is an array
        } else {
          setUserListData([]); // Fallback to an empty array if the data is not structured as expected
        }
      })
      .catch((err) => {
        setUserListData([]); // Ensure userListData is reset on error
      });
  };

  const searchUserEdit = (e) => {
    // Build the params object dynamically
    const params = {};

    // Only add the parameters to the params object if they are not empty or undefined
    if (searchDataEdit.districtId)
      params.districtId = searchDataEdit.districtId;
    if (searchDataEdit.talukId) params.talukId = searchDataEdit.talukId;
    if (searchDataEdit.designationId)
      params.designationId = searchDataEdit.designationId;
    if (searchDataEdit.phoneNumber)
      params.phoneNumber = searchDataEdit.phoneNumber;
    if (searchDataEdit.username) params.username = searchDataEdit.username;

    api
      .post(
        baseURLMasterData +
          `userMaster/get-by-designationId-districtId-talukId-and-mobileNumber-userName`,
        {},
        {
          params: params, // Pass the dynamically built params
        }
      )
      .then((response) => {
        if (
          response.data &&
          response.data.content &&
          response.data.content.userMaster
        ) {
          setUserListData(response.data.content.userMaster); // Ensure userMaster is an array
        } else {
          setUserListData([]); // Fallback to an empty array if the data is not structured as expected
        }
      })
      .catch((err) => {
        setUserListData([]); // Ensure userListData is reset on error
      });
  };

  // to get Designation
  const [designationListData, setDesignationListData] = useState([]);

  const getDesignationList = () => {
    const response = api
      .get(baseURLMasterData + `designation/get-all`)
      .then((response) => {
        if (response.data.content.designation) {
          setDesignationListData(response.data.content.designation);
        }
      })
      .catch((err) => {
        setDesignationListData([]);
      });
  };

  useEffect(() => {
    getDesignationList();
  }, []);

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    const response = api
      .get(baseURLMasterData + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        if (response.data.content.taluk) {
          setTalukListData(response.data.content.taluk);
        }
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (searchData.districtId) {
      getTalukList(searchData.districtId);
    }
  }, [searchData.districtId]);

  // to get taluk edit user
  const [talukListDataEdit, setTalukListDataEdit] = useState([]);

  const getTalukListEdit = (_id) => {
    const response = api
      .get(baseURLMasterData + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        if (response.data.content.taluk) {
          setTalukListDataEdit(response.data.content.taluk);
        }
      })
      .catch((err) => {
        setTalukListDataEdit([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (searchDataEdit.districtId) {
      getTalukListEdit(searchDataEdit.districtId);
    }
  }, [searchDataEdit.districtId]);

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
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
    <Layout title={t("District Wise Monthly Mulberry")}>
      <style>{districtWiseMonthlyMulberryStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("District Wise Monthly Mulberry")}
              </Block.Title>
            </Block.HeadContent>
            <Button variant="primary" onClick={search} className="sh-cta-btn">
              <Icon name="target" />
              <span>{t("View Target")}</span>
            </Button>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        {/* <Form action="#"> */}
        <Row>
          <Col lg="12">
            <Form noValidate validated={validated} onSubmit={postData}>
              <Row className="g-3 ">
                <Block>
                  <Card className="sh-section-card">
                    <Card.Header className="sh-section-header">
                      <Icon name="activity-round" />
                      <span>{t("District Wise Monthly Mulberry")}</span>
                    </Card.Header>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "20px",
                        alignItems: "flex-start",
                        padding: "20px 24px 0 24px",
                      }}
                    >
                      {/* Yearly Targets Section */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <Button variant="primary" onClick={totalTarget}>
                          {t("Yearly Targets")}
                        </Button>
                        <table
                          className="table table-bordered table-striped"
                          style={{ ...styles.table, width: "500px" }}
                        >
                          <thead>
                            <tr>
                              <th style={styles.ctstyle}>
                                {t("Mulberry Yearly Targets (NAREGA)")}:{" "}
                                {viewTotalTargetsDataNarega[0]?.mulberryValue ||
                                  t("N/A")}
                              </th>
                            </tr>
                          </thead>
                        </table>
                        <table
                          className="table table-bordered table-striped"
                          style={{ ...styles.table, width: "500px" }}
                        >
                          <thead>
                            <tr>
                              <th style={styles.ctstyle}>
                                {t("Mulberry Yearly Targets (NON NAREGA)")}:{" "}
                                {viewTotalTargetsDataNonNarega[0]?.mulberryValue ||
                                  t("N/A")}
                              </th>
                            </tr>
                          </thead>
                        </table>
                        <table
                          className="table table-bordered table-striped"
                          style={{ ...styles.table, width: "500px" }}
                        >
                          <thead>
                            <tr>
                              <th style={styles.ctstyle}>
                                {t("Total Mulberry Yearly Targets")}:{" "}
                                {!isNaN(parseFloat(viewTotalTargetsDataNonNarega[0]?.mulberryValue)) && !isNaN(parseFloat(viewTotalTargetsDataNarega[0]?.mulberryValue)) ? ((parseFloat(viewTotalTargetsDataNonNarega[0]?.mulberryValue))+(parseFloat(viewTotalTargetsDataNarega[0]?.mulberryValue))).toFixed(2):t("N/A") ||
                                  t("N/A")}
                              </th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                    </div>

                    <Card.Body>
                      {/* <h3>Farmers Details</h3> */}
                      <Row className="g-gs">
                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
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
                                {financialyearListData &&
                                financialyearListData.length
                                  ? financialyearListData.map((list) => (
                                      <option
                                        key={list.financialYearMasterId}
                                        value={list.financialYearMasterId}
                                      >
                                        {list.financialYear}
                                      </option>
                                    ))
                                  : ""}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Financial Year is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              {t("Target")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="mulberryTargetTypeId"
                                value={data.mulberryTargetTypeId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.mulberryTargetTypeId === undefined ||
                                  data.mulberryTargetTypeId === "0"
                                }
                              >
                                <option value="">
                                  {t("Select Mulberry Target Type")}
                                </option>
                                {mulberryTargetTypeData &&
                                mulberryTargetTypeData.length
                                  ? mulberryTargetTypeData.map((list) => (
                                      <option
                                        key={list.mulberryTargetTypeId}
                                        value={list.mulberryTargetTypeId}
                                      >
                                        {i18n.language === "kn" ? list.mulberryTargetTypeNameInKannada : list.mulberryTargetTypeName}
                                      </option>
                                    ))
                                  : ""}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Target is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("District")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="districtId"
                                value={data.districtId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                // isInvalid={
                                //   data.districtId === undefined ||
                                //   data.districtId === "0"
                                // }
                              >
                                <option value="">{t("Select District")}</option>
                                {districtListData && districtListData.length
                                  ? districtListData.map((list) => (
                                      <option
                                        key={list.districtId}
                                        value={list.districtId}
                                      >
                                        {i18n.language === "kn" ? list.districtNameInKannada : list.districtName}
                                      </option>
                                    ))
                                  : ""}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("District is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>


                        {/* <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("Taluk")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="talukId"
                                value={data.talukId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.districtId === undefined ||
                                  data.districtId === "0"
                                }
                              >
                                <option value="">{t("Select Taluk")}</option>
                                {talukListData && talukListData.length
                                  ? talukListData.map((list) => (
                                      <option
                                        key={list.talukId}
                                        value={list.talukId}
                                      >
                                        {i18n.language === "kn" ? list.talukNameInKannada : list.talukName}
                                      </option>
                                    ))
                                  : ""}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Taluk is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

                        {/* <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("Target Type")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="targetType"
                                value={data.targetType}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                              >
                                <option value="">
                                  {t("Select Target Type")}
                                </option>
                                <option value="NAREGA">{t("NAREGA")}</option>
                                <option value="NON NAREGA">
                                  {t("NON NAREGA")}
                                </option>

                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Target Type is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

                        {/* <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t('Month')}<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="month"
                                value={data.month}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                // isInvalid={
                                //   data.month === undefined ||
                                //   data.month === "0"
                                // }
                              >
                                <option value="">{t('Select Month')}</option>
                                <option value="JANUARY">{t('January')}</option>
                                <option value="FEBRUARY">{t('February')}</option>
                                <option value="MARCH">{t('March')}</option>
                                <option value="APRIL">{t('April')}</option>
                                <option value="MAY">{t('May')}</option>
                                <option value="JUNE">{t('June')}</option>
                                <option value="JULY">{t('July')}</option>
                                <option value="AUGUST">{t('August')}</option>
                                <option value="SEPTEMBER">{t('September')}</option>
                                <option value="OCTOBER">{t('October')}</option>
                                <option value="NOVEMBER">{t('November')}</option>
                                <option value="DECEMBER">{t('December')}</option>
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t('Month is required')}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

                        {/* <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label htmlFor="value">
                              {t("Target No.")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="value"
                                name="value"
                                value={data.value}
                                onChange={handleInputs}
                                type="number"
                                placeholder={t("Enter Target No.")}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {t("Target No. is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

                        {/* <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              User<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="userMasterId"
                                value={data.userMasterId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.userMasterId === undefined ||
                                  data.userMasterId === "0"
                                }
                              >
                                <option value="">Select User</option>
                                {userListData.map((list) => (
                                  <option
                                    key={list.userMasterId}
                                    value={list.userMasterId}
                                  >
                                    {list.username}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                User is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}
                        <Col lg="1">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("User")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Button
                                variant="primary"
                                onClick={() => setShowModal5(true)}
                              >
                                {t("Select User")}
                              </Button>
                              <Form.Control
                                type="hidden"
                                name="userMasterId"
                                value={data.userMasterId}
                                // isInvalid={!data.userMasterId || data.userMasterId === "0"} // Automatically updated
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {t("User is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col sm={3}>
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>{t("User Name")}</Form.Label>
                            <Form.Control
                              id="username"
                              name="username"
                              value={userName}
                              // onChange={handleSearchInputs}
                              type="text"
                              placeholder={t("Enter User Name")}
                              className="form-control"
                              // readOnly
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {t("User is required")}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Block>

                <Block>
                  <Card className="sh-section-card">
                    <Card.Header className="sh-section-header">
                      <Icon name="calendar" />
                      <span>{t("Months")}</span>
                    </Card.Header>
                    <Card.Body>
  <div className="w-100 mb-3" style={{ backgroundColor: "#fff", paddingLeft: "0.10rem" }}>
  <h5 className="mb-0 fw-bold text-start">{t("Please enter the below field Physical in Hectares")}</h5>
</div>
                      {/* <h3>Farmers Details</h3> */}
                      <Row className="g-gs">
                        <Col lg="6">
                          <Form.Group className="form-group mt-n2">
                            <Form.Label htmlFor="value" className="bold fs-5">
                              {t("April")}
                            </Form.Label>
                            <Row className="g-gs">
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="april"
                                    name="april"
                                    value={naregaMonth.april}
                                    onChange={handleNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NON NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="april"
                                    name="april"
                                    value={nonNaregaMonth.april}
                                    onChange={handleNonNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Row>
                          </Form.Group>

                          <Form.Group className="form-group mt-2">
                            <Form.Label htmlFor="value" className="bold fs-5">
                              {t("May")}
                            </Form.Label>
                            <Row className="g-gs">
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="may"
                                    name="may"
                                    value={naregaMonth.may}
                                    onChange={handleNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NON NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="may"
                                    name="may"
                                    value={nonNaregaMonth.may}
                                    onChange={handleNonNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Row>
                          </Form.Group>
                          {/* </Col> */}

                          <Form.Group className="form-group mt-2">
                            <Form.Label htmlFor="value" className="bold fs-5">
                              {t("June")}
                            </Form.Label>
                            <Row className="g-gs">
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="june"
                                    name="june"
                                    value={naregaMonth.june}
                                    onChange={handleNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NON NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="june"
                                    name="june"
                                    value={nonNaregaMonth.june}
                                    onChange={handleNonNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Row>
                          </Form.Group>


                          <Form.Group className="form-group mt-2">
                            <Form.Label htmlFor="value" className="bold fs-5">
                              {t("July")}
                            </Form.Label>
                            <Row className="g-gs">
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="july"
                                    name="july"
                                    value={naregaMonth.july}
                                    onChange={handleNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NON NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="july"
                                    name="july"
                                    value={nonNaregaMonth.july}
                                    onChange={handleNonNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Row>
                          </Form.Group>

                          <Form.Group className="form-group mt-2">
                            <Form.Label htmlFor="value" className="bold fs-5">
                              {t("August")}
                            </Form.Label>
                            <Row className="g-gs">
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="august"
                                    name="august"
                                    value={naregaMonth.august}
                                    onChange={handleNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NON NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="august"
                                    name="august"
                                    value={nonNaregaMonth.august}
                                    onChange={handleNonNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Row>
                          </Form.Group>

                          <Form.Group className="form-group mt-2">
                            <Form.Label htmlFor="value" className="bold fs-5">
                              {t("September")}
                            </Form.Label>
                            <Row className="g-gs">
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="september"
                                    name="september"
                                    value={naregaMonth.september}
                                    onChange={handleNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NON NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="september"
                                    name="september"
                                    value={nonNaregaMonth.september}
                                    onChange={handleNonNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Row>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                        <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="value" className="bold fs-5">
                              {t("October")}
                            </Form.Label>
                            <Row className="g-gs">
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="october"
                                    name="october"
                                    value={naregaMonth.october}
                                    onChange={handleNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NON NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="october"
                                    name="october"
                                    value={nonNaregaMonth.october}
                                    onChange={handleNonNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Row>
                          </Form.Group>
                          
                          <Form.Group className="form-group mt-2">
                            <Form.Label htmlFor="value" className="bold fs-5">
                              {t("November")}
                            </Form.Label>
                            <Row className="g-gs">
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="november"
                                    name="november"
                                    value={naregaMonth.november}
                                    onChange={handleNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NON NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="november"
                                    name="november"
                                    value={nonNaregaMonth.november}
                                    onChange={handleNonNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Row>
                          </Form.Group>

                          <Form.Group className="form-group mt-2">
                            <Form.Label htmlFor="value" className="bold fs-5">
                              {t("December")}
                            </Form.Label>
                            <Row className="g-gs">
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="december"
                                    name="december"
                                    value={naregaMonth.december}
                                    onChange={handleNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NON NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="december"
                                    name="december"
                                    value={nonNaregaMonth.december}
                                    onChange={handleNonNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Row>
                          </Form.Group>

                          <Form.Group className="form-group mt-2">
                            <Form.Label htmlFor="value" className="bold fs-5">
                              {t("January")}
                            </Form.Label>
                            <Row className="g-gs">
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="january"
                                    name="january"
                                    value={naregaMonth.january}
                                    onChange={handleNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NON NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="january"
                                    name="january"
                                    value={nonNaregaMonth.january}
                                    onChange={handleNonNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Row>
                          </Form.Group>

                          <Form.Group className="form-group mt-2">
                            <Form.Label htmlFor="value" className="bold fs-5">
                              {t("February")}
                            </Form.Label>
                            <Row className="g-gs">
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="february"
                                    name="february"
                                    value={naregaMonth.february}
                                    onChange={handleNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NON NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="february"
                                    name="february"
                                    value={nonNaregaMonth.february}
                                    onChange={handleNonNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Row>
                          </Form.Group>

                          <Form.Group className="form-group mt-2">
                            <Form.Label htmlFor="value" className="bold fs-5">
                              {t("March")}
                            </Form.Label>
                            <Row className="g-gs">
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="march"
                                    name="march"
                                    value={naregaMonth.march}
                                    onChange={handleNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("NON NAREGA")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="march"
                                    name="march"
                                    value={nonNaregaMonth.march}
                                    onChange={handleNonNarega}
                                    type="number"
                                    placeholder={t("Enter Target No.")}
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {t("Target No. is required")}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Row>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Block>

                <div className="gap-col">
                  <ul className="d-flex align-items-center justify-content-center gap g-3">
                    <li>
                      <Button type="submit" variant="primary" className="sh-save-btn">
                        <Icon name="save" />
                        <span>{t("Save")}</span>
                      </Button>
                    </li>
                    <li>
                      <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                        <Icon name="cross" />
                        <span>{t("Cancel")}</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </Row>
            </Form>
          </Col>
          {/* {type.budgetType === "release" ? (
            <Col lg="4">
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  {t('Available Budget Balance')}
                </Card.Header>
                <Card.Body>
                  <table className="table small table-bordered">
                    <tbody>
                      <tr>
                        <td style={styles.ctstyle}> {t('Balance Amount')}:</td>
                        <td>0</td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            ""
          )} */}
        </Row>
        {/* <Row className="mt-2">
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={ProductionPhysicalDataColumns}
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
            theme="solarized"
            customStyles={customStyles}
          />
        </Row> */}
      </Block>

      <Modal show={showModal3} onHide={handleCloseModal3} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="edit" />
            <span>{t("District Wise Monthly Mulberry")}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedAllDateEdit}
            onSubmit={postEditData}
          >
            <Row className="g-5 px-5">
              <Col lg="6">
                <Form.Group className="form-group mt-n3">
                  <Form.Label>
                    {t("Financial Year")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="financialYearMasterId"
                      value={editData.financialYearMasterId}
                      onChange={handleEditInputs}
                      onBlur={() => handleEditInputs}
                      required
                      disabled
                      isInvalid={
                        editData.financialYearMasterId === undefined ||
                        editData.financialYearMasterId === "0"
                      }
                    >
                      <option value="">{t("Select Year")}</option>
                      {financialyearListData && financialyearListData.length
                        ? financialyearListData.map((list) => (
                            <option
                              key={list.financialYearMasterId}
                              value={list.financialYearMasterId}
                            >
                              {list.financialYear}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Financial Year is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n3">
                  <Form.Label>
                    {t("Target")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="mulberryTargetTypeId"
                      value={editData.mulberryTargetTypeId}
                      onChange={handleEditInputs}
                      onBlur={() => handleEditInputs}
                      required
                      disabled
                      isInvalid={
                        editData.mulberryTargetTypeId === undefined ||
                        editData.mulberryTargetTypeId === "0"
                      }
                    >
                      <option value="">
                        {t("Select Mulberry Target Type")}
                      </option>
                      {mulberryTargetTypeData && mulberryTargetTypeData.length
                        ? mulberryTargetTypeData.map((list) => (
                            <option
                              key={list.mulberryTargetTypeId}
                              value={list.mulberryTargetTypeId}
                            >
                              {i18n.language === "kn" ? list.mulberryTargetTypeNameInKannada : list.mulberryTargetTypeName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Target is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("District")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="districtId"
                      value={editData.districtId}
                      onChange={handleEditInputs}
                      onBlur={() => handleEditInputs}
                      required
                      disabled
                      // isInvalid={
                      //   editData.districtId === undefined ||
                      //   editData.districtId === "0"
                      // }
                    >
                      <option value="">{t("Select District")}</option>
                      {districtListData && districtListData.length
                        ? districtListData.map((list) => (
                            <option
                              key={list.districtId}
                              value={list.districtId}
                            >
                              {i18n.language === "kn" ? list.districtNameInKannada : list.districtName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("District is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Target Type")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="targetType"
                      value={editData.targetType}
                      onChange={handleEditInputs}
                      onBlur={() => handleEditInputs}
                      required
                      disabled
                      // isInvalid={
                      //   editData.targetType === undefined ||
                      //   editData.targetType === "0"
                      // }
                    >
                      <option value="">{t("Select Target Type")}</option>
                      <option value="NAREGA">NAREGA</option>
                      <option value="NON NAREGA">NON NAREGA</option>
                      {/* {districtListeditData.map((list) => (
                          <option key={list.districtId} value={list.districtId}>
                            {i18n.language === "kn" ? list.districtNameInKannada : list.districtName}
                          </option>
                        ))} */}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Target Type is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Month")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="month"
                      value={editData.month}
                      onChange={handleEditInputs}
                      onBlur={() => handleEditInputs}
                      required
                      disabled
                      // isInvalid={
                      //   editData.month === undefined ||
                      //   editData.month === "0"
                      // }
                    >
                      <option value="">{t("Select Month")}</option>
                      <option value="JANUARY">{t("January")}</option>
                      <option value="FEBRUARY">{t("February")}</option>
                      <option value="MARCH">{t("March")}</option>
                      <option value="APRIL">{t("April")}</option>
                      <option value="MAY">{t("May")}</option>
                      <option value="JUNE">{t("June")}</option>
                      <option value="JULY">{t("July")}</option>
                      <option value="AUGUST">{t("August")}</option>
                      <option value="SEPTEMBER">{t("September")}</option>
                      <option value="OCTOBER">{t("October")}</option>
                      <option value="NOVEMBER">{t("November")}</option>
                      <option value="DECEMBER">{t("December")}</option>

                      {/* {districtListeditData.map((list) => (
                          <option key={list.districtId} value={list.districtId}>
                            {i18n.language === "kn" ? list.districtNameInKannada : list.districtName}
                          </option>
                        ))} */}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Month is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="value">
                    {t("Target No.")}
                    {/* <span className="text-danger">*</span> */}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="value"
                      name="value"
                      value={editData.value}
                      onChange={handleEditInputs}
                      type="text"
                      placeholder={t("Enter Target No.")}
                      // required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Target No. is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              {/* <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    User<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="userMasterId"
                      value={editData.userMasterId}
                      onChange={handleEditInputs}
                      onBlur={() => handleEditInputs}
                      required
                      isInvalid={
                        editData.userMasterId === undefined ||
                        editData.userMasterId === "0"
                      }
                    >
                      <option value="">Select User</option>
                      {userListData.map((list) => (
                        <option
                          key={list.userMasterId}
                          value={list.userMasterId}
                        >
                          {list.username}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      User is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col> */}

              <Col lg="2">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("User")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Button
                      variant="primary"
                      onClick={() => setShowModal7(true)}
                    >
                      {t("Select User")}
                    </Button>
                    <Form.Control
                      type="hidden"
                      name="userMasterId"
                      value={editData.userMasterId}
                      // isInvalid={!data.userMasterId || data.userMasterId === "0"} // Automatically updated
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("User is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col sm={3}>
                <Form.Group className="form-group mt-n4">
                  <Form.Label>{t("User Name")}</Form.Label>
                  <Form.Control
                    id="username"
                    name="username"
                    value={userNameEdit}
                    // onChange={handleSearchInputs}
                    type="text"
                    placeholder={t("Enter User Name")}
                    className="form-control"
                    // readOnly
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {t("User is required")}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAdd}> */}
                    <Button type="submit" variant="success" className="sh-save-btn">
                      <Icon name="save" />
                      <span>{t("Update")}</span>
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      {/* <Modal show={showModal6} onHide={handleCloseModal6} size="xl">
        <Modal.Header closeButton> 
          <Modal.Title>{t("All Reportee Details")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <DataTable
  columns={ViewTargetReporteeDataColumns}
  data={listViewReporteesTargetData}
  highlightOnHover
  pagination
  paginationServer                       
  paginationTotalRows={totalRows}       
  paginationPerPage={countPerPage}      
  onChangePage={(page) => setPage(page - 1)} 
  progressPending={loading}             
  customStyles={customStyles}
/> */}

 <Modal show={showModal6} onHide={handleCloseModal6} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="users" />
            <span>{t("All Reportee Details")}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DataTable
      columns={ViewTargetReporteeDataColumns}
      data={listViewReporteesTargetData}
      highlightOnHover
      pagination
      paginationServer
      paginationTotalRows={totalRowsReportee}
      paginationPerPage={countPerPage}
      onChangePage={handlePageChangeReportee}
      progressPending={loadingReportee}
      paginationComponentOptions={{ noRowsPerPage: true }}
      customStyles={customStyles}
    />
        </Modal.Body>
      </Modal>

      <Modal show={showModal4} onHide={handleCloseModal4} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="target" />
            <span>{t("View Target Details")}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={ViewTargetDataColumns}
            data={listViewTargetData}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={totalRowsNarega}
            paginationPerPage={countPerPage} 
            paginationComponentOptions={{ noRowsPerPage: true }}
            onChangePage={handlePageChangeNarega} 
            progressPending={loadingNarega} 
            theme="solarized"
            customStyles={customStyles}
          />

          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={ViewTargetDataColumns}
            data={listViewNnTargetData}
            highlightOnHover
            pagination
            paginationServer 
            paginationTotalRows={totalRowsNonNarega} 
            paginationPerPage={countPerPage} 
            paginationComponentOptions={{ noRowsPerPage: true }}
            onChangePage={handlePageChangeNonNarega} 
            progressPending={loadingNonNarega} 
            theme="solarized"
            customStyles={customStyles}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showModal5} onHide={handleCloseModal5} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="users" />
            <span>{t("Select User")}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-n4">
            <Card className="mt-3 p-4 shadow-lg rounded">
              <Row className="g-4">
                {/* District Input */}
                <Col sm={4}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("District")}</Form.Label>
                    <Form.Select
                      name="districtId"
                      value={searchData.districtId}
                      onChange={handleSearchInputs}
                      className="form-control"
                    >
                      <option value="">{t("Select District")}</option>
                      {districtListData &&
                        districtListData.length &&
                        districtListData.map((list) => (
                          <option key={list.districtId} value={list.districtId}>
                            {i18n.language === "kn" ? list.districtNameInKannada : list.districtName}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Taluk Input */}
                <Col sm={4}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("Taluk")}</Form.Label>
                    <Form.Select
                      name="talukId"
                      value={searchData.talukId}
                      onChange={handleSearchInputs}
                      className="form-control"
                    >
                      <option value="">{t("Select Taluk")}</option>
                      {talukListData &&
                        talukListData.length &&
                        talukListData.map((list) => (
                          <option key={list.talukId} value={list.talukId}>
                            {i18n.language === "kn" ? list.talukNameInKannada : list.talukName}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Designation Input */}
                <Col sm={4}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("Designation")}</Form.Label>
                    <Form.Select
                      name="designationId"
                      value={searchData.designationId}
                      onChange={handleSearchInputs}
                      className="form-control"
                    >
                      <option value="">{t("Select Designation")}</option>
                      {designationListData &&
                        designationListData.length &&
                        designationListData.map((list) => (
                          <option
                            key={list.designationId}
                            value={list.designationId}
                          >
                            {i18n.language === "kn" ? list.designationNameInKannada : list.name}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Mobile Number Input */}
                <Col sm={4}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("Mobile Number")}</Form.Label>
                    <Form.Control
                      id="phoneNumber"
                      name="phoneNumber"
                      value={searchData.phoneNumber}
                      onChange={handleSearchInputs}
                      type="text"
                      placeholder={t("Enter Mobile Number")}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>

                {/* Username Input */}
                <Col sm={4}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("User Name")}</Form.Label>
                    <Form.Control
                      id="username"
                      name="username"
                      value={searchData.username}
                      onChange={handleSearchInputs}
                      type="text"
                      placeholder={t("Enter User Name")}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>

                {/* Search Button */}
                <Col sm={4} className="d-flex align-items-end">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={searchUser}
                    className="w-100 sh-save-btn"
                  >
                    <Icon name="search" />
                    <span>{t("Search")}</span>
                  </Button>
                </Col>
              </Row>

              {/* User Selection */}
              <Row className="m-4">
                <Col sm={12}>
                  <Form.Label>{t("User")}</Form.Label>
                  <Form.Select
                    name="userMasterId"
                    value={searchData.userMasterId}
                    onChange={(e) => handleUserSelect(e.target.value)}
                    className="form-control"
                  >
                    <option value="">{t("Select User")}</option>
                    {userListData && userListData.length > 0 ? (
                      userListData.map((list) => (
                        <option
                          key={list.userMasterId}
                          value={list.userMasterId}
                        >
                          {list.username}
                        </option>
                      ))
                    ) : (
                      <option value="">{t("No Users Found")}</option> // Show a message if no users are found
                    )}
                  </Form.Select>
                </Col>
              </Row>
              <Row>
                <div className="gap-col d-flex justify-content-center">
                  <Button variant="primary" onClick={() => handleCloseModal5()} className="sh-save-btn">
                    <Icon name="check" />
                    <span>{t("Submit")}</span>
                  </Button>
                </div>
              </Row>
            </Card>
          </Block>
        </Modal.Body>
      </Modal>
      <Modal show={showModal7} onHide={handleCloseModal7} size="lg" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="users" />
            <span>{t("Select User In Edit")}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-n4">
            <Card className="mt-3 p-4 shadow-lg rounded">
              <Row className="g-4">
                {/* District Input */}
                <Col sm={4}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("District")}</Form.Label>
                    <Form.Select
                      name="districtId"
                      value={searchDataEdit.districtId}
                      onChange={handleSearchInputsEdit}
                      className="form-control"
                    >
                      <option value="">{t("Select District")}</option>
                      {districtListData &&
                        districtListData.length &&
                        districtListData.map((list) => (
                          <option key={list.districtId} value={list.districtId}>
                            {i18n.language === "kn" ? list.districtNameInKannada : list.districtName}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Taluk Input */}
                <Col sm={4}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("Taluk")}</Form.Label>
                    <Form.Select
                      name="talukId"
                      value={searchDataEdit.talukId}
                      onChange={handleSearchInputsEdit}
                      className="form-control"
                    >
                      <option value="">{t("Select Taluk")}</option>
                      {talukListDataEdit &&
                        talukListDataEdit.length &&
                        talukListDataEdit.map((list) => (
                          <option key={list.talukId} value={list.talukId}>
                            {i18n.language === "kn" ? list.talukNameInKannada : list.talukName}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Designation Input */}
                <Col sm={4}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("Designation")}</Form.Label>
                    <Form.Select
                      name="designationId"
                      value={searchDataEdit.designationId}
                      onChange={handleSearchInputsEdit}
                      className="form-control"
                    >
                      <option value="">{t("Select Designation")}</option>
                      {designationListData &&
                        designationListData.length &&
                        designationListData.map((list) => (
                          <option
                            key={list.designationId}
                            value={list.designationId}
                          >
                            {i18n.language === "kn" ? list.designationNameInKannada : list.name}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Mobile Number Input */}
                <Col sm={4}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("Mobile Number")}</Form.Label>
                    <Form.Control
                      id="phoneNumber"
                      name="phoneNumber"
                      value={searchDataEdit.phoneNumber}
                      onChange={handleSearchInputsEdit}
                      type="text"
                      placeholder={t("Enter Mobile Number")}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>

                {/* Username Input */}
                <Col sm={4}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("User Name")}</Form.Label>
                    <Form.Control
                      id="username"
                      name="username"
                      value={searchDataEdit.username}
                      onChange={handleSearchInputsEdit}
                      type="text"
                      placeholder={t("Enter User Name")}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
                {/* Search Button */}
                <Col sm={4} className="d-flex align-items-end">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={searchUserEdit}
                    className="w-100 sh-save-btn"
                  >
                    <Icon name="search" />
                    <span>{t("Search")}</span>
                  </Button>
                </Col>
              </Row>

              {/* User Selection */}
              <Row className="m-4">
                <Col sm={12}>
                  <Form.Label>{t("User")}</Form.Label>
                  <Form.Select
                    name="userMasterId"
                    value={searchDataEdit.userMasterId}
                    onChange={(e) => handleUserEditSelect(e.target.value)}
                    className="form-control"
                  >
                    <option value="">{t("Select User")}</option>
                    {userListData && userListData.length > 0 ? (
                      userListData.map((list) => (
                        <option
                          key={list.userMasterId}
                          value={list.userMasterId}
                        >
                          {list.username}
                        </option>
                      ))
                    ) : (
                      <option value="">{t("No Users Found")}</option> // Show a message if no users are found
                    )}
                  </Form.Select>
                </Col>
              </Row>
              <Row>
                <div className="gap-col d-flex justify-content-center">
                  <Button variant="primary" onClick={() => handleCloseModal7()} className="sh-save-btn">
                    <Icon name="check" />
                    <span>{t("Submit")}</span>
                  </Button>
                </div>
              </Row>
            </Card>
          </Block>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

const districtWiseMonthlyMulberryStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-cta-btn {
    background: #ffffff;
    color: #1e67a8 !important;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-form-wrap .card,
  .sh-section-card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
    margin-bottom: 18px;
  }
  .sh-form-wrap .card-header {
    border-bottom: none !important;
  }
  .sh-form-wrap .card-body {
    padding: 20px !important;
  }
  .sh-form-wrap .form-label {
    font-size: 13px;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 6px;
    letter-spacing: 0.2px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 10px !important;
    border: 1.5px solid #d8e0ec !important;
    background-color: #fbfcfe !important;
    padding: 0.62rem 0.9rem !important;
    font-size: 13.5px;
    color: #2b3a55;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }
  .sh-form-wrap .form-control::placeholder {
    color: #a7b0c0;
    font-weight: 400;
  }
  .sh-form-wrap .form-control:hover:not(:disabled):not([readonly]),
  .sh-form-wrap .form-select:hover:not(:disabled) {
    border-color: #a9c4e0 !important;
    background-color: #ffffff !important;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #2b7ac0 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important;
    outline: none;
  }
  .sh-form-wrap .form-control[readonly],
  .sh-form-wrap .form-control:read-only,
  .sh-form-wrap .form-select:disabled {
    background-color: #f1f5fa !important;
    border-color: #e4e9f2 !important;
    color: #8a96a8 !important;
    cursor: not-allowed;
  }
  .sh-form-wrap .form-control.is-invalid,
  .sh-form-wrap .form-select.is-invalid {
    border-color: #e3496a !important;
    box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important;
  }
  .sh-form-wrap .form-check-input {
    border-radius: 5px;
    border: 1.5px solid #c9d4e3;
    cursor: pointer;
  }
  .sh-form-wrap .form-check-input:checked {
    background-color: #1e67a8;
    border-color: #1e67a8;
  }
  .sh-form-wrap .form-check-input:focus {
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14);
    border-color: #2b7ac0;
  }
  .sh-form-wrap .text-danger {
    font-weight: 700;
    margin-left: 3px;
  }
  .sh-section-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-bottom: none !important;
    padding: 14px 20px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sh-section-header svg,
  .sh-section-header .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 15px;
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    color: #e3496a;
    border: 1.5px solid #e3496a;
    border-radius: 8px;
    font-weight: 600;
    transition: background-color 0.15s ease, color 0.15s ease,
      transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-cancel-btn:hover:not(:disabled),
  .sh-cancel-btn:focus:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(227, 73, 106, 0.32);
  }
  .sh-modal .modal-content {
    border: none;
    border-radius: 12px;
    overflow: hidden;
  }
  .sh-modal-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-bottom: none !important;
    color: #ffffff !important;
  }
  .sh-modal-header .modal-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    color: #ffffff !important;
  }
  .sh-modal-header .btn-close {
    filter: invert(1) brightness(2);
  }
`;

export default DistrictWiseMontlyMulberry;
