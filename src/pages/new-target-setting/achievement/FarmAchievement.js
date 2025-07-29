import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
// import axios from "axios";
import api from "../../../services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function FarmwiseAchievement() {
  const { t } = useTranslation();
  const [data, setData] = useState({
    mulberryTargetTypeId: "",
    financialYearMasterId: "",
    districtId: "",
    month: "",
    target: "",
    value: "",
    raceMasterId: "",
    farmId: "",
    userMasterId: "",
  });


  
  const [brushingMonth,setBrushingMonth] = useState({
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

  const handleBrushing = (e) => {
    const { name, value } = e.target;
    setBrushingMonth(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [cocoonProductionMonth,setCocoonProductionMonth] = useState({
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

  const handleCocoonProduction = (e) => {
    const { name, value } = e.target;
    setCocoonProductionMonth(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // to get all month target
    const getAllMonthTarget = () => {
       api
        .post(baseURLTargetSetting + `targets/getFarmTargetRecords?raceMasterId=${data.raceMasterId}&financialYearId=${data.financialYearMasterId}&farmId=${data.farmId}`)
        .then((response) => {
          const brushingMonthList = response.data.brushingMonth;
          const cocoonProductionList = response.data.cocoonProductionMonth;
          if (
            brushingMonthList && brushingMonthList.length > 0 &&
            cocoonProductionList && cocoonProductionList.length > 0
          ){
            const brushingMonth = brushingMonthList[0];
            const cocoonProductionMonth = cocoonProductionList[0];
            setBrushingMonth({
              april:brushingMonth.april,
              may:brushingMonth.may,
              june:brushingMonth.june,
              july:brushingMonth.july,
              august:brushingMonth.august,
              september:brushingMonth.september,
              october:brushingMonth.october,
              november:brushingMonth.november,
              december:brushingMonth.december,
              january:brushingMonth.january,
              february:brushingMonth.february,
              march:brushingMonth.march,
            });
            setCocoonProductionMonth({
              april:cocoonProductionMonth.april,
              may:cocoonProductionMonth.may,
              june:cocoonProductionMonth.june,
              july:cocoonProductionMonth.july,
              august:cocoonProductionMonth.august,
              september:cocoonProductionMonth.september,
              october:cocoonProductionMonth.october,
              november:cocoonProductionMonth.november,
              december:cocoonProductionMonth.december,
              january:cocoonProductionMonth.january,
              february:cocoonProductionMonth.february,
              march:cocoonProductionMonth.march,
            });
          }else{
            setBrushingMonth({
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
            setCocoonProductionMonth({
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
  
    useEffect(() => {
      if(data.raceMasterId && data.financialYearMasterId && data.farmId){
        getAllMonthTarget();
      }
    }, [data.raceMasterId && data.financialYearMasterId && data.farmId]);

  const [searchData, setSearchData] = useState({
    districtId: "",
    talukId: "",
    designationId: "",
    // villageId: "",
    phoneNumber: "",
    username: "",
    userMasterId: "",
  });

  const [type, setType] = useState({
    budgetType: "allocate",
  });

  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const [page1,setPage1] = useState(0);
  const [page2,setPage2] = useState(0);
  const [page3,setPage3] = useState(0);
  const [page4,setPage4] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [validatedAllDateEdit, setValidatedAllDateEdit] = useState(false);

  const [showModal3, setShowModal3] = useState(false);
  const [showModal7, setShowModal7] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal3 = () => setShowModal3(true);
  const handleCloseModal3 = () => setShowModal3(false);

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  
  const handleCloseModal7 = () => {
    setShowModal7(false);
    userSearchEditClear();
  };

  const [toggleButton, setToggleButton] = useState(false);

  const toggle = () => {
    setToggleButton(!toggleButton);
  };

  // useEffect(()=>{
  //   if (data.financialYearMasterId && data.farmId) {
  //     handleShowModal();
  //   } 
  // }, [data.financialYearMasterId, data.farmId, page1, page2, page3, page4]);

useEffect(() => {
  if (showModal && data.financialYearMasterId && data.farmId) {
    handleShowModal();
  }
}, [page1, page2, page3, page4]);


  const [displayList, setDisplayList] = useState([]);
  const [displayListCocoon,setDisplayListCocoon] = useState([]);
  const [displayListHierarchy, setDisplayListHierarchy] = useState([]);
  const [displayListHierarchyCocoon, setDisplayListHierarchyCocoon] = useState([]);
  const [totalRowsView, setTotalRowsView] = useState(0);
  const [totalRowsViewCocoon, setTotalRowsViewCocoon] = useState(0);
  const [totalRowsViewHierarchy, setTotalRowsViewHierarchy] = useState(0);
  const [totalRowsViewHierarchyCocoon, setTotalRowsViewHierarchyCocoon] = useState(0);

  const handleSearchInputs = (e) => {
    let { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

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

  const handleSearchInputsEdit = (e) => {
    // debugger;
    let { name, value } = e.target;
    setSearchDataEdit({ ...searchDataEdit, [name]: value });
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


  // const targets = ["Cocoon Production","Brushing"];
  // const handleShowModal = () => {
  //   if (data.financialYearMasterId && data.farmId) {
  //     targets.forEach((target)=>{
  //       let parameters = {
  //       params: {
  //         financialYearId: data.financialYearMasterId,
  //         raceId: data.raceMasterId,
  //         targetType: target,
  //         farmId: data.farmId,
  //         // grainageId: data.scComponentId,
  //         // courseId: data.targetType,
  //         // institutionId: data.targetType,
  //         pageNumber: target === 'Cocoon Production'? page1:page2,
  //         size: countPerPage,
  //       },
  //     };
  //     let parameters2 = {
  //       params: {
  //         financialYearId: data.financialYearMasterId,
  //         raceId: data.raceMasterId,
  //         targetType: target,
  //         farmId: data.farmId,
  //         pageNumber: target === "Cocoon Production" ? page3 : page4, 
  //         size: countPerPage,
  //       },
  //     };
  //     api
  //       .get(baseURLTargetSetting + `targets/get-by-target-details`, parameters)
  //       .then((response) => {
  //         setShowModal(true);
  //         const res = response.data.content.target[0].target;
  //         if( "Cocoon Production" === res ){
  //           setDisplayListCocoon(response.data.content.target);
  //           setTotalRowsViewCocoon(response.data.content.totalItems);
  //         }else{
  //           setDisplayList(response.data.content.target);
  //           setTotalRowsView(response.data.content.totalItems);
  //         }
  
          
  //       })
  //       .catch((err) => {
  //         setDisplayList([]);
  //       });

  //     api
  //       .get(
  //         baseURLTargetSetting + `targets/get-by-target-details-hierarchy`,
  //         parameters2
  //       )
  //       .then((response) => {
  //         // setShowModal(true);
  //         const res = response.data.content.target[0].target;
  //         if( "Cocoon Production" === res ){
  //           setDisplayListHierarchyCocoon(response.data.content.target);
  //           setTotalRowsViewHierarchyCocoon(response.data.content.totalItems);
  //         }else{
  //           setDisplayListHierarchy(response.data.content.target);
  //           setTotalRowsViewHierarchy(response.data.content.totalItems);
  //         }
  //       })
  //       .catch((err) => {
  //         setDisplayListHierarchy([]);
  //       });
  //     })
  //   } else {
  //     warning();
  //   }
  // };


  
const targets = ["Cocoon Production", "Brushing"];

const handleShowModal = () => {
  if (data.financialYearMasterId && data.farmId) {
    targets.forEach((target) => {
      let parameters = {
        params: {
          financialYearId: data.financialYearMasterId,
          raceId: data.raceMasterId,
          targetType: target,
          farmId: data.farmId,

          pageNumber: target === 'Cocoon Production' ? page1 : page2,
          size: countPerPage,
        },
      };

      let parameters2 = {
        params: {
          financialYearId: data.financialYearMasterId,
          raceId: data.raceMasterId,
          targetType: target,
          farmId: data.farmId,

          pageNumber: target === "Cocoon Production" ? page3 : page4,
          size: countPerPage,
        },
      };

      api
        .get(baseURLTargetSetting + `targets/get-by-target-details`, parameters)
        .then((response) => {
          setShowModal(true);

          const res = response.data.content.target[0]?.target;

          // ✅ Correct: Update only corresponding state
          if (res === "Cocoon Production") {
            setDisplayListCocoon(response.data.content.target);
            setTotalRowsViewCocoon(response.data.content.totalItems);
          } else {
            setDisplayList(response.data.content.target);
            setTotalRowsView(response.data.content.totalItems);
          }
        })
        .catch(() => {
          // ✅ Clear only the relevant list
          if (target === "Cocoon Production") {
            setDisplayListCocoon([]);
          } else {
            setDisplayList([]);
          }
        });

      api
        .get(baseURLTargetSetting + `targets/get-by-target-details-hierarchy`, parameters2)
        .then((response) => {
          const res = response.data.content.target[0]?.target;

          // ✅ Correct: Update only corresponding hierarchy state
          if (res === "Cocoon Production") {
            setDisplayListHierarchyCocoon(response.data.content.target);
            setTotalRowsViewHierarchyCocoon(response.data.content.totalItems);
          } else {
            setDisplayListHierarchy(response.data.content.target);
            setTotalRowsViewHierarchy(response.data.content.totalItems);
          }
        })
        .catch(() => {
          // ✅ Clear only the relevant hierarchy list
          if (target === "Cocoon Production") {
            setDisplayListHierarchyCocoon([]);
          } else {
            setDisplayListHierarchy([]);
          }
        });
    });
  } else {
    warning();
  }
};

  const handleCloseModal = () => setShowModal(false);

  // to get Financial Year
  const [financialyearListData, setFinancialyearListData] = useState([]);

  const getFinancialYearList = () => {
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
    getFinancialYearList();
  }, []);

  // get List
  const getList = () => {
    setLoading(true);
    api
      .get(baseURLTargetSetting + `targets/list-farm-join`, _params)
      .then((response) => {
        setListData(response.data.content.body.content.targets);
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
    month: "",
    target: "",
    value: "",
    raceMasterId: "",
    farmId: "",
    userMasterId: "",
  });

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


  // const handleEdit = (targetsId) => {
  //   setLoading(true);
  //   const response = api
  //     .get(baseURLTargetSetting + `targets/get-by-id/${targetsId}`)
  //     .then((response) => {
  //       setEditData(response.data.content);
  //       setUserNameEdit(
  //         response.data.content.body.content.productionTargets.userMasterName
  //       );
  //       setShowModal3(true);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       // const message = err.response.data.errorMessages[0].me-ssage[0].message;
  //       setEditData({});
  //       // editError(message);
  //       setLoading(false);
  //     });
  // };
  const handleEdit = (targetsId) => {
    setLoading(true);
    const response = api
      .get(baseURLTargetSetting + `targets/get-by-id?id=${targetsId}`)
      .then((response) => {
        setEditData(response.data.content.body.content.target);
        setUserNameEdit(
          response.data.content.body.content.target.userMasterName
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
      .get(baseURLMasterData + `mulberryTargetType/get-all`)
      .then((response) => {
        setMulberryTargetTypeData(response.data.content.mulberryTargetType);
      })
      .catch((err) => {
        setMulberryTargetTypeData([]);
      });
  };

  useEffect(() => {
    getMulberryTargetTypeList();
  }, []);

  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
    api
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

  // to get District
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    api
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

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // to get Farm
  const [farmListData, setFarmListData] = useState([]);

  const getFarmList = () => {
    const response = api
      .get(baseURLMasterData + `farmMaster/get-all`)
      .then((response) => {
        setFarmListData(response.data.content.farmMaster);
      })
      .catch((err) => {
        setFarmListData([]);
      });
  };

  useEffect(() => {
    getFarmList();
  }, []);

  // Search User
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

  // const postData = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);
  //   } else {
  //     event.preventDefault();
  //     // event.stopPropagation();
  //     console.log("Entered Allocate");
  //     api
  //       .post(baseURLTargetSetting + `targets/saveFarmTargets`,  
  //         {...data,brushingMonth:[brushingMonth],cocoonProductionMonth:[cocoonProductionMonth]}
  //       )
  //       .then((response) => {
  //         if (response.data.content.error) {
  //           saveError(response.data.content.error_description);
  //         } else {
  //           saveSuccess();
  //           getList();
  //           // clear();
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

  const postData = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
      } else {
        event.preventDefault();
        // event.stopPropagation();
        api
          .post(baseURLTargetSetting + `targetsAchievement/add-Farm`, data)
          .then((response) => {
            if (response.data.content.error) {
              saveError(response.data.content.error_description);
            } else {
              saveSuccess();
              setData({
                 
  targetsAchievementId: "",
  financialYearMasterId: "",
  target: "", 
  raceMasterId: "",
  farmId: "",
  value: "",
  month: "",           
  userMasterId: "",
  pageType: "FARM",
              });
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
        .post(baseURLTargetSetting + `targets/editFarmTargets`, editData)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            getList();
            editClear();
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


  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
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

  const navigate = useNavigate();

  const handleView = (_id) => {
    navigate(`/seriui/taluk-view/${_id}`);
  };

  const editClear = () => {
    setEditData({
      mulberryTargetTypeId: "",
      financialYearMasterId: "",
      districtId: "",
      month: "",
      target: "",
      value: "",
      raceMasterId: "",
      farmId: "",
      userMasterId: "",
    });
    setType({
      budgetType: "allocate",
    });
    getFinancialDefaultDetails();
    setValidatedAllDateEdit(false);
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
          .delete(baseURLTargetSetting + `targets/delete-farm/${_id}`)
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

  const warning = () => {
    Swal.fire({
      icon: "warning",
      title: "Please select financial year and farm",
      text: "Please try again!",
    });
  };

 

  const [viewTotalTargetsDataBrushing, setViewTotalTargetsDataBrushing] = useState({});
  const [viewTotalTargetsDataCocoonProduction, setViewTotalTargetsDataCocoonProduction] = useState({});

  const totalTarget = (event) => {
    const { financialYearMasterId,raceMasterId,farmId,target,month} = data;

    
    if (!financialYearMasterId || financialYearMasterId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select Financial Year",
        text: "Please try again!",
      });
      return;
    }

    if (!raceMasterId || raceMasterId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select Race",
        text: "Please try again!",
      });
      return;
    }

    if (!farmId || farmId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select Farm",
        text: "Please try again!",
      });
      return;
    }

    // if (!target || target === "0") {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Please select Target",
    //     text: "Please try again!",
    //   });
    //   return;
    // }

    // if (!month || month === "0") {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Please select Month",
    //     text: "Please try again!",
    //   });
    //   return;
    // }

    // Proceed with API call if validations pass
    const targets = ["Brushing","Cocoon Production"];
    targets.forEach((target) => {
    api
      .post(
        baseURLTargetSetting + `targets/getFarmTargetDetails`,
        {},
        {
          params: {
            financialYearMasterId,
            raceMasterId,
            farmId,
            target,
            month,
          },
        }
      )
      .then((response) => {
        if(target === "Brushing"){
          setViewTotalTargetsDataBrushing(response.data);
        }
        else{
          setViewTotalTargetsDataCocoonProduction(response.data);
        }
          
        // setTotalRows(response.data.totalRecords);
        // setShowModal4(true);
      })
      .catch((err) => {
        if(target === "Brushing"){
          setViewTotalTargetsDataBrushing([]);
        }else{
          setViewTotalTargetsDataCocoonProduction([]);
        }
      });
    });

    
  };

  const ProductionPhysicalDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          {/* <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.targetsId)}
          >
            View
          </Button> */}
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.targetsId)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.targetsId)}
            className="ms-2"
          >
            Delete
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    },
    {
      name: "Financial Year",
      selector: (row) => row.financialYearMaster,
      cell: (row) => <span>{row.financialYearMaster}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Mulberry Target Type",
    //   selector: (row) => row.mulberryTargetTypeName,
    //   cell: (row) => <span>{row.mulberryTargetTypeName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "District",
    //   selector: (row) => row.districtName,
    //   cell: (row) => <span>{row.districtName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Farm",
      selector: (row) => row.farmName,
      cell: (row) => <span>{row.farmName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Race",
      selector: (row) => row.raceMasterName,
      cell: (row) => <span>{row.raceMasterName}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Month",
      selector: (row) => row.month,
      cell: (row) => <span>{row.month}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: " User Name",
      selector: (row) => row.userMasterName,
      cell: (row) => <span>{row.userMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Target No.",
      selector: (row) => row.value,
      cell: (row) => <span>{row.value}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  const ProductionPhysicalDataColumnsView = [
    {
      name: "Financial Year",
      selector: (row) => row.financialYearMaster,
      cell: (row) => <span>{row.financialYearMaster}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Farm",
      selector: (row) => row.farmName,
      cell: (row) => <span>{row.farmName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Race",
      selector: (row) => row.raceMasterName,
      cell: (row) => <span>{row.raceMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Month",
      selector: (row) => row.month,
      cell: (row) => <span>{row.month}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: " Target Type",
      selector: (row) => row.target,
      cell: (row) => <span>{row.target}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: " User Name",
      selector: (row) => row.userMasterName,
      cell: (row) => <span>{row.userMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Target No.",
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
      month: "",
      target: "",
      value: "",
      raceMasterId: "",
      farmId: "",
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
  <Layout title={t("Farm Wise Achievement")}>
    <Block.Head>
      <Block.HeadBetween>
        <Block.HeadContent>
          <Block.Title tag="h2">{t("Farm Wise Achievement")}</Block.Title>
        </Block.HeadContent>
        {/* Removed View button section */}
      </Block.HeadBetween>
    </Block.Head>

      <Block className="mt-n4">
        {/* <Form action="#"> */}
        <Row>
          <Col lg="12">
            <Form noValidate validated={validated} onSubmit={postData}>
              <Row className="g-3 ">
                <Block>
                  <Card>
                    <Card.Header>{t("Farm Wise Achievement")}</Card.Header>
                    <Card.Body>
                    {/* <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "20px",
                        alignItems: "flex-start",
                      }}
                    >
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
                                {t("Farm Yearly Targets (Brushing)")}:{" "}
                                {viewTotalTargetsDataBrushing[0]?.yearlyFarmValue ||
                                  "N/A"}
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
                                {t("Farm Yearly Targets (Cocoon Production)")}:{" "}
                                {viewTotalTargetsDataCocoonProduction[0]?.yearlyFarmValue ||
                                  "N/A"}
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
                                {t("Total Farm Yearly Targets")}:{" "}
                                {!isNaN(parseFloat(viewTotalTargetsDataCocoonProduction[0]?.yearlyFarmValue)) && !isNaN(parseFloat(viewTotalTargetsDataBrushing[0]?.yearlyFarmValue)) ? ((parseFloat(viewTotalTargetsDataCocoonProduction[0]?.yearlyFarmValue))+(parseFloat(viewTotalTargetsDataBrushing[0]?.yearlyFarmValue))).toFixed(2):"N/A" ||
                                  "N/A"}
                              </th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                    </div> */}

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
                                {financialyearListData.map((list) => (
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
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              {t("Race")}<span className="text-danger">*</span>
                            </Form.Label>
                            <Col>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="raceMasterId"
                                  value={data.raceMasterId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs}
                                  required
                                >
                                  <option value="">{t("Select Race")}</option>
                                  {raceListData && raceListData 
                                  ?raceListData.map((list) => (
                                    <option
                                      key={list.raceMasterId}
                                      value={list.raceMasterId}
                                    >
                                      {list.raceMasterName}
                                    </option>
                                  ))
                                  :""}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  {t("Race is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Col>
                          </Form.Group>
                        </Col>

                       

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("Farm")}<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="farmId"
                                value={data.farmId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.farmId === undefined ||
                                  data.farmId === "0"
                                }
                              >
                                <option value="">{t("Select Farm")}</option>
                                {farmListData && farmListData 
                                  ?farmListData.map((list) => (
                                  <option key={list.farmId} value={list.farmId}>
                                    {list.farmName}
                                  </option>
                                ))
                                :""}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Farm name is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
  <Form.Group className="form-group mt-n4">
    <Form.Label>
      {t("Month")}<span className="text-danger">*</span>
    </Form.Label>
    <div className="form-control-wrap">
      <Form.Select
        name="month"
        value={data.month}
        onChange={handleInputs}  
        // onBlur={() => handleEditInputs}
        required
        // disabled
      >
        <option value="">{t("SELECT MONTH")}</option>
  <option value="JANUARY">{t("JANUARY")}</option>
  <option value="FEBRUARY">{t("FEBRUARY")}</option>
  <option value="MARCH">{t("MARCH")}</option>
  <option value="APRIL">{t("APRIL")}</option>
  <option value="MAY">{t("MAY")}</option>
  <option value="JUNE">{t("JUNE")}</option>
  <option value="JULY">{t("JULY")}</option>
  <option value="AUGUST">{t("AUGUST")}</option>
  <option value="SEPTEMBER">{t("SEPTEMBER")}</option>
  <option value="OCTOBER">{t("OCTOBER")}</option>
  <option value="NOVEMBER">{t("NOVEMBER")}</option>
  <option value="DECEMBER">{t("DECEMBER")}</option>
</Form.Select>
      <Form.Control.Feedback type="invalid">
        {t("Month is required")}
      </Form.Control.Feedback>
    </div>
  </Form.Group>
</Col>


                       <Col lg="6">
  <Form.Group className="form-group mt-n4">
    <Form.Label>
      {t("Target Type")}
    </Form.Label>
    <div className="form-control-wrap">
      <Form.Select
        name="target"
        value={data.target}
        onChange={handleInputs}
        
      >
        <option value="">{t("Select Target Type")}</option>
        <option value="Brushing">{t("Brushing")}</option>
        <option value="Cocoon Production">{t("Cocoon Production")}</option>
      </Form.Select>
    </div>
  </Form.Group>
</Col>

 <Col lg="6">
  <Form.Group className="form-group mt-n4">
    <Form.Label htmlFor="Target Value">
      {t("Target Value")}<span className="text-danger">*</span>
    </Form.Label>
    <div className="form-control-wrap">
      <Form.Control
        id="value"
        name="value"
        value={data.value}
        onChange={handleInputs}
        type="text"
        placeholder={t("Enter Value")}
        required
        isInvalid={!data.value} 
      />
      <Form.Control.Feedback type="invalid">
        {t("Target Value is required")}.
      </Form.Control.Feedback>
    </div>
  </Form.Group>
</Col>

                        <Col lg="1">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("User")}<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Button
                                variant="primary"
                                onClick={() => setShowModal2(true)}
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
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Block>

                <div className="gap-col">
                  <ul className="d-flex align-items-center justify-content-center gap g-3">
                    <li>
                      <Button type="submit" variant="primary">
                        {t("Save")}
                      </Button>
                    </li>
                    <li>
                      <Button type="button" variant="secondary" onClick={clear}>
                        {t("Cancel")}
                      </Button>
                    </li>
                  </ul>
                </div>
              </Row>
            </Form>
          </Col>
         
        </Row>
      </Block>

      <Modal show={showModal3} onHide={handleCloseModal3} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("Farm Wise Target Setting")}</Modal.Title>
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
                      {financialyearListData && financialyearListData.length ?
                        financialyearListData.map((list) => (
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
                    {t("Race")}<span className="text-danger">*</span>
                  </Form.Label>
                  <Col>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="raceMasterId"
                        value={editData.raceMasterId}
                        onChange={handleEditInputs}
                        onBlur={() => handleEditInputs}
                        required
                        disabled
                      >
                        <option value="">{t("Select Race")}</option>
                        {raceListData && raceListData.length ?
                        raceListData.map((list) => (
                          <option
                            key={list.raceMasterId}
                            value={list.raceMasterId}
                          >
                            {list.raceMasterName}
                          </option>
                        ))
                        : ""}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("Race is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Col>
                </Form.Group>
              </Col>

              {/* <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("District")}<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="districtId"
                                value={editData.districtId}
                                onChange={handleEditInputs}
                                onBlur={() => handleEditInputs}
                                required
                                // isInvalid={
                                //   editData.districtId === undefined ||
                                //   editData.districtId === "0"
                                // }
                              >
                                <option value="">{t("Select District")}</option>
                                {districtListData.map((list) => (
                                  <option
                                    key={list.districtId}
                                    value={list.districtId}
                                  >
                                    {list.districtName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("District is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Farm")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="farmId"
                      value={editData.farmId}
                      onChange={handleEditInputs}
                      onBlur={() => handleEditInputs}
                      required
                      disabled
                      isInvalid={
                        editData.farmId === undefined || editData.farmId === "0"
                      }
                    >
                      <option value="">{t("Select Farm")}</option>
                      {farmListData && farmListData.length ?
                        farmListData.map((list) => (
                        <option key={list.farmId} value={list.farmId}>
                          {list.farmName}
                        </option>
                      ))
                      : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Farm name is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>


              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Farm")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="farmId"
                      value={editData.farmId}
                      onChange={handleEditInputs}
                      onBlur={() => handleEditInputs}
                      required
                      disabled
                      isInvalid={
                        editData.farmId === undefined || editData.farmId === "0"
                      }
                    >
                      <option value="">{t("Select Farm")}</option>
                      {farmListData && farmListData.length ?
                        farmListData.map((list) => (
                        <option key={list.farmId} value={list.farmId}>
                          {list.farmName}
                        </option>
                      ))
                      : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Farm name is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Target Type")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="target"
                      value={editData.target}
                      onChange={handleEditInputs}
                      onBlur={() => handleEditInputs}
                      required
                      disabled
                      // isInvalid={
                      //   editData.target === undefined ||
                      //   editData.target === "0"
                      // }
                    >
                      <option value="">{t("Select Target Type")}</option>
                      <option value="Brushing">{t("Brushing")}</option>
                      <option value="Cocoon Production">{t("Cocoon Production")}</option>
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
                    {t("Month")}<span className="text-danger">*</span>
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

                      {/* {districtListData.map((list) => (
                          <option key={list.districtId} value={list.districtId}>
                            {list.districtName}
                          </option>
                        ))} */}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Month is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              {/* <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("User")}<span className="text-danger">*</span>
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
                      <option value="">{t("Select User")}</option>
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
                      {t("User is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col> */}

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

              
              <Col lg="2">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("User")}<span className="text-danger">*</span>
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
                    <Button type="submit" variant="success">
                      {t("Update")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("Alloted Details")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Row className="mt-2 d-flex justify-content-center">
            <Col lg="12">
              <div
                style={{ fontWeight: "bold", color: "brown", fontSize: "1vw" }}
                className="d-flex justify-content-center"
              >
                {t("Target Allotted by Head Office")}
              </div>
              <DataTable
                tableClassName="data-table-head-light table-responsive"
                columns={ProductionPhysicalDataColumnsView}
                data={displayList}
                highlightOnHover
                pagination
                paginationServer
                paginationTotalRows={totalRowsView}
                paginationPerPage={countPerPage}
                paginationComponentOptions={{
                  noRowsPerPage: true,
                }}
                onChangePage={(page) => setPage2(page - 1)}
                progressPending={loading}
                theme="solarized"
                customStyles={customStyles}
              />

              <DataTable
                tableClassName="data-table-head-light table-responsive"
                columns={ProductionPhysicalDataColumnsView}
                data={displayListCocoon}
                highlightOnHover
                pagination
                paginationServer
                paginationTotalRows={totalRowsViewCocoon}
                paginationPerPage={countPerPage}
                paginationComponentOptions={{
                  noRowsPerPage: true,
                }}
                onChangePage={(page) => setPage1(page - 1)}
                progressPending={loading}
                theme="solarized"
                customStyles={customStyles}
              />
            </Col>
            {displayList && displayList.length > 0 && (
              <Col lg="12" className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  size="sm"
                  className="ms-2"
                  onClick={() => toggle()}
                >
                  {!toggleButton ? t("Show") : t("Hide")} {t("Hierarchical Assigned Targets")}
                </Button>
              </Col>
            )}
            {toggleButton && (
              <Col lg="12" className="mt-2">
                <div
                  style={{
                    fontWeight: "bold",
                    color: "brown",
                    fontSize: "1vw",
                  }}
                  className="d-flex justify-content-center"
                >
                  {t("Target Allotted by You")}
                </div>
                <DataTable
                  tableClassName="data-table-head-light table-responsive"
                  columns={ProductionPhysicalDataColumnsView}
                  data={displayListHierarchy}
                  highlightOnHover
                  pagination
                  paginationServer
                  paginationTotalRows={totalRowsViewHierarchy}
                  paginationPerPage={countPerPage}
                  paginationComponentOptions={{
                    noRowsPerPage: true,
                  }}
                  onChangePage={(page) => setPage4(page - 1)}
                  progressPending={loading}
                  theme="solarized"
                  customStyles={customStyles}
                />
                <DataTable
                  tableClassName="data-table-head-light table-responsive"
                  columns={ProductionPhysicalDataColumnsView}
                  data={displayListHierarchyCocoon}
                  highlightOnHover
                  pagination
                  paginationServer
                  paginationTotalRows={totalRowsViewHierarchyCocoon}
                  paginationPerPage={countPerPage}
                  paginationComponentOptions={{
                    noRowsPerPage: true,
                  }}
                  onChangePage={(page) => setPage3(page - 1)}
                  progressPending={loading}
                  theme="solarized"
                  customStyles={customStyles}
                />
              </Col>
            )}
          </Row>
        </Modal.Body>
      </Modal>
      <Modal show={showModal2} onHide={handleCloseModal2} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("Select User")}</Modal.Title>
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
                            {list.districtName}
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
                            {list.talukName}
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
                            {list.name}
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
                    className="w-100"
                  >
                    {t("Search")}
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
                  <Button variant="primary" onClick={() => handleCloseModal2()}>
                    {t("Submit")}
                  </Button>
                </div>
              </Row>
            </Card>
          </Block>
        </Modal.Body>
      </Modal>

      <Modal show={showModal7} onHide={handleCloseModal7} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>{t("Select User In Edit")}</Modal.Title>
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
                                  {list.districtName}
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
                                  {list.talukName}
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
                                  {list.name}
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
                          className="w-100"
                        >
                          {t("Search")}
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
                        <Button variant="primary" onClick={() => handleCloseModal7()}>
                          {t("Submit")}
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

export default FarmwiseAchievement;
