import { Card, Form, Row, Col, Button,Modal} from "react-bootstrap";
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

function TrainingTarget() {
  const { t } = useTranslation();
  const [data, setData] = useState({
    mulberryTargetTypeId: "",
    financialYearMasterId: "",
    districtId: "",
    month: "",
    target: "",
    value: "",
    raceMasterId: "",
    grainageMasterId: "",
    trainingInstitutionId: "",
    courseId: "",
    userMasterId: "",
  });

  
  const [searchData, setSearchData] = useState({
    districtId: "",
    talukId: "",
    designationId: "",
    // villageId: "",
    phoneNumber: "",
    username: "",
    userMasterId: "",
  });


  const [trainingMonth,setTrainingMonth] = useState({
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

  const handleTraining = (e) => {
    const { name, value } = e.target;
    setTrainingMonth(prev => ({
      ...prev,
      [name]: value
    }));
  };

    const [physicalTargetMonths,setPhysicalTargetMonths] = useState({
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

  const handlePhysical = (e) => {
    const { name, value } = e.target;
    setPhysicalTargetMonths(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [financialTargetMonths,setFinancialTargetMonths] = useState({
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

  const handleFinancial = (e) => {
    const { name, value } = e.target;
    setFinancialTargetMonths(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
 


// const getAllMonthTarget = () => {
//   api
//   .post(
//     baseURLTargetSetting +
//       `targets/getTrainingTargetRecords?courseId=${data.courseId}&financialYearId=${data.financialYearMasterId}&trainingInstitutionId=${data.trainingInstitutionId}`,
//     {}
//   )
//   .then((response) => {
//      const physicalMonthList = response.data.physicalTargetMonths;
//      const financialMonthList = response.data.financialTargetMonths;
//      if (
//       physicalMonthList && physicalMonthList.length > 0 &&
//       financialMonthList && financialMonthList.length > 0
//      ){
//        const physicalTargetMonths = physicalMonthList[0];
//        const financialTargetMonths = financialMonthList[0];
//        setPhysicalTargetMonths({
//          april:physicalTargetMonths.april,
//          may:physicalTargetMonths.may,
//          june:physicalTargetMonths.june,
//          july:physicalTargetMonths.july,
//          august:physicalTargetMonths.august,
//          september:physicalTargetMonths.september,
//          october:physicalTargetMonths.october,
//          november:physicalTargetMonths.november,
//          december:physicalTargetMonths.december,
//          january:physicalTargetMonths.january,
//          february:physicalTargetMonths.february,
//          march:physicalTargetMonths.march,
//        });
//        setFinancialTargetMonths({
//          april:financialTargetMonths.april,
//          may:financialTargetMonths.may,
//          june:financialTargetMonths.june,
//          july:financialTargetMonths.july,
//          august:financialTargetMonths.august,
//          september:financialTargetMonths.september,
//          october:financialTargetMonths.october,
//          november:financialTargetMonths.november,
//          december:financialTargetMonths.december,
//          january:financialTargetMonths.january,
//          february:financialTargetMonths.february,
//          march:financialTargetMonths.march,
//        });
//      }else{
//        setPhysicalTargetMonths({
//          april:"",
//          may:"",
//          june:"",
//          july:"",
//          august:"",
//          september:"",
//          october:"",
//          november:"",
//          december:"",
//          january:"",
//          february:"",
//          march:"",
//        });
//        setFinancialTargetMonths({
//          april:"",
//          may:"",
//          june:"",
//          july:"",
//          august:"",
//          september:"",
//          october:"",
//          november:"",
//          december:"",
//          january:"",
//          february:"",
//          march:"",
//        });
//      }
//      // setFinancialyearListData(response.data.content.financialYearMaster);
//    })
//    .catch((err) => {
//      // setFinancialyearListData([]);
//    });
// };


// useEffect(() => {
// if (
//   data.courseId &&
//   data.financialYearMasterId &&
//   data.trainingInstitutionId
// ) {
//   getAllMonthTarget();
// }
// }, [
// data.courseId,
// data.financialYearMasterId,
// data.trainingInstitutionId
// ]);



const getAllMonthTarget = () => {
  api
    .post(baseURLTargetSetting + "targets/getGrainageTargetRecords", {
      targetTypetraining: "training", // ✅ backend switch
      courseId: data.courseId,
      financialYearMasterId: data.financialYearMasterId,
      trainingInstitutionId: data.trainingInstitutionId
    })
    .then((response) => {
      const physicalMonthList = response.data.content.physicalTargetMonths;
      const financialMonthList = response.data.content.financialTargetMonths;

      if (
        physicalMonthList && physicalMonthList.length > 0 &&
        financialMonthList && financialMonthList.length > 0
      ) {
        const physicalTargetMonths = physicalMonthList[0];
        const financialTargetMonths = financialMonthList[0];

        setPhysicalTargetMonths({
          april: physicalTargetMonths.april,
          may: physicalTargetMonths.may,
          june: physicalTargetMonths.june,
          july: physicalTargetMonths.july,
          august: physicalTargetMonths.august,
          september: physicalTargetMonths.september,
          october: physicalTargetMonths.october,
          november: physicalTargetMonths.november,
          december: physicalTargetMonths.december,
          january: physicalTargetMonths.january,
          february: physicalTargetMonths.february,
          march: physicalTargetMonths.march,
        });

        setFinancialTargetMonths({
          april: financialTargetMonths.april,
          may: financialTargetMonths.may,
          june: financialTargetMonths.june,
          july: financialTargetMonths.july,
          august: financialTargetMonths.august,
          september: financialTargetMonths.september,
          october: financialTargetMonths.october,
          november: financialTargetMonths.november,
          december: financialTargetMonths.december,
          january: financialTargetMonths.january,
          february: financialTargetMonths.february,
          march: financialTargetMonths.march,
        });
      } else {
        setPhysicalTargetMonths({
          april: "", may: "", june: "", july: "", august: "",
          september: "", october: "", november: "", december: "",
          january: "", february: "", march: ""
        });
        setFinancialTargetMonths({
          april: "", may: "", june: "", july: "", august: "",
          september: "", october: "", november: "", december: "",
          january: "", february: "", march: ""
        });
      }
    })
    .catch((err) => {
      setPhysicalTargetMonths({
        april: "", may: "", june: "", july: "", august: "",
        september: "", october: "", november: "", december: "",
        january: "", february: "", march: ""
      });
      setFinancialTargetMonths({
        april: "", may: "", june: "", july: "", august: "",
        september: "", october: "", november: "", december: "",
        january: "", february: "", march: ""
      });
    });
};

useEffect(() => {
  if (data.courseId && data.financialYearMasterId && data.trainingInstitutionId) {
    getAllMonthTarget();
  }
}, [data.courseId, data.financialYearMasterId, data.trainingInstitutionId]);




// ✅ Existing or add
const [displayList, setDisplayList] = useState([]);
const [displayListFinancial, setDisplayListFinancial] = useState([]);
const [displayListHierarchy, setDisplayListHierarchy] = useState([]);
const [displayListHierarchyFinancial, setDisplayListHierarchyFinancial] = useState([]);

const [totalRowsView, setTotalRowsView] = useState(0);
const [totalRowsViewFinancial, setTotalRowsViewFinancial] = useState(0);
const [totalRowsViewHierarchy, setTotalRowsViewHierarchy] = useState(0);
const [totalRowsViewHierarchyFinancial, setTotalRowsViewHierarchyFinancial] = useState(0);



  const [listData, setListData] = useState({});
    const [page, setPage] = useState(0); 
  const [page1, setPage1] = useState(0); 
const [page2, setPage2] = useState(0);
const [page3, setPage3] = useState(0); 
const [page4, setPage4] = useState(0); 
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [validatedAllDateEdit, setValidatedAllDateEdit] = useState(false);

  const [showModal2, setShowModal2] = useState(false);
  const [showModal7, setShowModal7] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [showModal3, setShowModal3] = useState(false);

  const handleShowModal3 = () => setShowModal3(true);
  const handleCloseModal3 = () => setShowModal3(false);

  
  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  
  
  const handleCloseModal7 = () => {
    setShowModal7(false);
    userSearchEditClear();
  };



  const targets = ["PHYSICAL TARGET","FINANCIAL TARGET"];
  
const handleShowModal = () => {
  if (data.financialYearMasterId && data.trainingInstitutionId) {
    targets.forEach((target) => {
      let parameters = {
        params: {
          financialYearId: data.financialYearMasterId,
          raceId: data.raceMasterId,
          courseId: data.courseId,
          institutionId: data.institutionId,
          targetType: target,
          pageNumber: target === "PHYSICAL TARGET" ? page2 : page1,  
          size: countPerPage,
        },
      };

      let parameters2 = {
        params: {
          financialYearId: data.financialYearMasterId,
          raceId: data.raceMasterId,
          courseId: data.courseId,
          institutionId: data.institutionId,
          targetType: target,
          pageNumber: target === "PHYSICAL TARGET" ? page4 : page3,  
          size: countPerPage,
        },
      };

      // ✅ Target Allotted by Head Office
      api
  .get(baseURLTargetSetting + `targets/get-by-target-details`, parameters)
  .then((response) => {
    setShowModal(true);
    const res = target;

    const content = response.data?.content?.target || [];
    const totalItems = response.data?.content?.totalItems || 0;

    if ("PHYSICAL TARGET" === res) {
      setDisplayListFinancial(content);
      setTotalRowsViewFinancial(totalItems);
    } else {
      setDisplayList(content);
      setTotalRowsView(totalItems);
    }
  })
  .catch((err) => {
    setDisplayList([]);
  });

      // ✅ Target Allotted by You (Hierarchical)
      api
  .get(baseURLTargetSetting + `targets/get-by-target-details-hierarchy`, parameters2)
  .then((response) => {
    const res = target;
    const content = response.data?.content?.target || [];
    const totalItems = response.data?.content?.totalItems || 0;

    if ("PHYSICAL TARGET" === res) {
      setDisplayListHierarchyFinancial(content);
      setTotalRowsViewHierarchyFinancial(totalItems);
    } else {
      setDisplayListHierarchy(content);
      setTotalRowsViewHierarchy(totalItems);
    }
  })
  .catch((err) => {
    setDisplayListHierarchy([]);
  });

    });
  } else {
    warning();
  }
};


  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
  if (data.financialYearMasterId && data.trainingInstitutionId) {
    handleShowModal();
  }
}, [page1, page2, page3, page4]);


  const [toggleButton, setToggleButton] = useState(false);

  const toggle = () => {
    setToggleButton(!toggleButton);
  };

  useEffect(()=>{
      if (data.financialYearMasterId && data.trainingInstitutionId) {
        handleShowModal();
      } 
    },[page1,page2,page3,page4])
  
  

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

  const [pageView, setPageView] = useState(0); 
const [pageHierarchy, setPageHierarchy] = useState(0);

// const handleShowModal = () => {
//   if (data.financialYearMasterId && data.trainingInstitutionId) {
//     let parametersView = {
//       params: {
//         financialYearId: data.financialYearMasterId,
//         raceId: data.raceMasterId,
//         courseId: data.courseId,
//         institutionId: data.institutionId,
//         pageNumber: pageView, 
//         size: countPerPage,
//       },
//     };

//     let parametersHierarchy = {
//       params: {
//         financialYearId: data.financialYearMasterId,
//         raceId: data.raceMasterId,
//         courseId: data.courseId,
//         institutionId: data.institutionId,
//         pageNumber: pageHierarchy, 
//         size: countPerPage,
//       },
//     };

//     api
//       .get(baseURLTargetSetting + `targets/get-by-target-details`, parametersView) 
//       .then((response) => {
//         setShowModal(true);
//         setDisplayList(response.data.content.target);
//         setTotalRowsView(response.data.content.totalItems);
//       })
//       .catch((err) => {
//         setDisplayList([]);
//       });

//     api
//       .get(baseURLTargetSetting + `targets/get-by-target-details-hierarchy`, parametersHierarchy)
//       .then((response) => {
//         setDisplayListHierarchy(response.data.content.target);
//         setTotalRowsViewHierarchy(response.data.content.totalItems);
//       })
//       .catch((err) => {
//         setDisplayListHierarchy([]);
//       });
//   } else {
//     warning();
//   }
// };

useEffect(() => {
  if (showModal) handleShowModal(); 
}, [pageView, pageHierarchy]); 



  // const handleShowModal = () => {
  //   if (data.financialYearMasterId && data.trainingInstitutionId) {
  //     let parameters = {
  //       params: {
  //         financialYearId: data.financialYearMasterId,
  //         raceId: data.raceMasterId,
  //         // targetType: data.scHeadAccountId,
  //         // farmId: data.scSubSchemeDetailsId,
  //         // grainageId: data.scComponentId,
  //         courseId: data.courseId,
  //         institutionId: data.institutionId,
  //         pageNumber: page,
  //         size: countPerPage,
  //       },
  //     };
  //     api
  //       .get(baseURLTargetSetting + `targets/get-by-target-details`, parameters)
  //       .then((response) => {
  //         setShowModal(true);
  //         setDisplayList(response.data.content.target);
  //         setTotalRowsView(response.data.content.totalItems);
  //       })
  //       .catch((err) => {
  //         setDisplayList([]);
  //       });

  //     api
  //       .get(
  //         baseURLTargetSetting + `targets/get-by-target-details-hierarchy`,
  //         parameters
  //       )
  //       .then((response) => {
  //         // setShowModal(true);
  //         setDisplayListHierarchy(response.data.content.target);
  //         setTotalRowsViewHierarchy(response.data.content.totalItems);
  //       })
  //       .catch((err) => {
  //         setDisplayListHierarchy([]);
  //       });
  //   } else {
  //     warning();
  //   }
  // };
  // const handleCloseModal = () => setShowModal(false);

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

  // get List
  const getList = () => {
    setLoading(true);
    api
      .get(
        baseURLTargetSetting + `targets/list-training-join`,
        _params
      )
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
    grainageMasterId: "",
    trainingInstitutionId: "",
    courseId: "",
    userMasterId: "",
  });


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

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // to get Grainage
  const [grainageListData, setGrainageListData] = useState([]);

  const getGrainageList = () => {
    api
      .get(baseURLMasterData + `grainageMaster/get-all`)
      .then((response) => {
        setGrainageListData(response.data.content.grainageMaster);
      })
      .catch((err) => {
        setGrainageListData([]);
      });
  };

  useEffect(() => {
    getGrainageList();
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
  

  // to get TrInstitutionMaster
  const [trInstituteListData, setTrInstituteListData] = useState([]);

  const getTrInstitutionMasterList = () => {
    api
      .get(baseURLMasterData + `trInstitutionMaster/get-all`)
      .then((response) => {
        setTrInstituteListData(response.data.content.trInstitutionMaster);
      })
      .catch((err) => {
        setTrInstituteListData([]);
      });
  };

  useEffect(() => {
    getTrInstitutionMasterList();
  }, []);

  // to get Course
  const [trCourseListData, setTrCourseListData] = useState([]);

  const getTrCourseList = () => {
    const response = api
      .get(baseURLMasterData + `trCourseMaster/get-all`)
      .then((response) => {
        setTrCourseListData(response.data.content.trCourseMaster);
      })
      .catch((err) => {
        setTrCourseListData([]);
      });
  };

  useEffect(() => {
    getTrCourseList();
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
  //       .post(baseURLTargetSetting + `targets/saveTrainingTargets`,   {...data,trainingMonth:[trainingMonth]}
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
      console.log("Entered Allocate");
      api
        .post(
          baseURLTargetSetting + `targets/saveGrainageTargets`,
          {...data,targetTypetraining: "training",physicalTargetMonths:[physicalTargetMonths],financialTargetMonths:[financialTargetMonths]}
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
          baseURLTargetSetting +
            `targets/editTrainingTargets`,
          editData  
        )
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

  const navigate = useNavigate();

  const handleView = (_id) => {
    navigate(`/seriui/taluk-view/${_id}`);
  };

  const editClear = () => {
    setEditData({
    mulberryTargetTypeId: "",
    financialYearMasterId: "",
    districtId: "",
    courseId: "",
    month: "",
    target: "",
    value: "",
    raceMasterId: "",
    farmId: "",
    trainingInstitutionId: "",
    userMasterId: "",
    });
    getFinancialDefaultDetails();
    setValidatedAllDateEdit(false);
  };
  const warning = () => {
    Swal.fire({
      icon: "warning",
      title: "Please select financial year and Training Institution",
      text: "Please try again!",
    });
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
            onClick={() => handleView(row.productionTargetsId)}
          >
            View
          </Button> */}
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.targetsId)}
          >
            {t("Edit")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.targetsId)}
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
      name: t("Training Institution"),
      selector: (row) => row.trInstitutionMasterName,
      cell: (row) => <span>{row.trInstitutionMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Training Program"),
      selector: (row) => row.trainingCourseName,
      cell: (row) => <span>{row.trainingCourseName}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "District",
    //   selector: (row) => row.districtName,
    //   cell: (row) => <span>{row.districtName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
   

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
    // {
    //   name: "Target No.",
    //   selector: (row) => row.value,
    //   cell: (row) => <span>{row.value}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
  ];

  const ProductionPhysicalDataColumnsView = [
    {
      name: t("Financial Year"),
      selector: (row) => row.financialYearMaster,
      cell: (row) => <span>{row.financialYearMaster}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Training Institution"),
      selector: (row) => row.trInstitutionMasterName,
      cell: (row) => <span>{row.trInstitutionMasterName}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("Target Type."),
      selector: (row) => row.targetType,
      cell: (row) => <span>{row.targetType}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: t("Race"),
    //   selector: (row) => row.raceMasterName,
    //   cell: (row) => <span>{row.raceMasterName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
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
      month: "",
      target: "",
      value: "",
      raceMasterId: "",
      grainageMasterId: "",
      trainingInstitutionId: "",
      courseId: "",
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
    getFinancialDefaultDetails();
    setValidated(false);
  };

  const [viewMonthlyTargetsData, setViewMonthlyTargetsData] = useState({});
const [viewTotalTargetsDataPhysical, setViewTotalTargetsDataPhysical] = useState({});
  const [viewTotalTargetsDataFinancial, setViewTotalTargetsDataFinancial] = useState({});


//   const totalTarget = (event) => {
//     const { financialYearMasterId,courseId,trainingInstitutionId,targetType} = data;

    
//     if (!financialYearMasterId || financialYearMasterId === "0") {
//       Swal.fire({
//         icon: "warning",
//         title: "Please select Financial Year",
//         text: "Please try again!",
//       });
//       return;
//     }

//     if (!courseId || courseId === "0") {
//       Swal.fire({
//         icon: "warning",
//         title: "Please select Program",
//         text: "Please try again!",
//       });
//       return;
//     }

//     if (!trainingInstitutionId || trainingInstitutionId === "0") {
//       Swal.fire({
//         icon: "warning",
//         title: "Please select Institution",
//         text: "Please try again!",
//       });
//       return;
//     }

// const targetTypes = ["PHYSICAL TARGET", "FINANCIAL TARGET"];

// targetTypes.forEach((targetType) => {
//   const requestBody = {
//     financialYearMasterId: data.financialYearMasterId,
//     courseId: data.courseId,
//     trainingInstitutionId: data.trainingInstitutionId,
//     targetType: targetType,
//     targetTypetraining: "training",
//   };

//   api
//     .post(baseURLTargetSetting + `targets/getGrainageTargetRecords`, requestBody)
//     .then((response) => {
//       const content = response.data.content || response.data;
//       if (targetType === "PHYSICAL TARGET") {
//         setViewTotalTargetsDataPhysical(content);
//       } else {
//         setViewTotalTargetsDataFinancial(content);
//       }
//     })
//     .catch(() => {
//       if (targetType === "PHYSICAL TARGET") setViewTotalTargetsDataPhysical([]);
//       else setViewTotalTargetsDataFinancial([]);
//     });
// });

// const totalTarget = () => {
//   api
//     .post(baseURLTargetSetting + "targets/getGrainageTargetRecords", {
//       targetTypetraining: "training",
//       courseId: data.courseId,
//       financialYearMasterId: data.financialYearMasterId,
//       trainingInstitutionId: data.trainingInstitutionId
//     })
//     .then((response) => {
//       const content = response.data.content || {};
//       const physicalMonths = content.physicalTargetMonths?.[0] || {};
//       const financialMonths = content.financialTargetMonths?.[0] || {};

//       // Convert month values to numbers and sum
//       const sumValues = (months) =>
//         Object.values(months)
//           .map(val => parseFloat(val) || 0)
//           .reduce((a, b) => a + b, 0);

//       const physicalTotal = sumValues(physicalMonths).toFixed(2);
//       const financialTotal = sumValues(financialMonths).toFixed(2);

//       setViewTotalTargetsDataPhysical([{ yearlyTrainingValue: physicalTotal }]);
//       setViewTotalTargetsDataFinancial([{ yearlyTrainingValue: financialTotal }]);
//     })
//     .catch(() => {
//       setViewTotalTargetsDataPhysical([{ yearlyTrainingValue: "0.00" }]);
//       setViewTotalTargetsDataFinancial([{ yearlyTrainingValue: "0.00" }]);
//     });
// };

const [totalYearlyTraining, setTotalYearlyTraining] = useState("0.00");


const totalTarget = () => {
  const { financialYearMasterId, courseId, trainingInstitutionId } = data;

  if (!financialYearMasterId || financialYearMasterId === "0") {
    Swal.fire({ icon: "warning", title: "Please select Financial Year", text: "Please try again!" });
    return;
  }

  if (!courseId || courseId === "0") {
    Swal.fire({ icon: "warning", title: "Please select Program", text: "Please try again!" });
    return;
  }

  if (!trainingInstitutionId || trainingInstitutionId === "0") {
    Swal.fire({ icon: "warning", title: "Please select Institution", text: "Please try again!" });
    return;
  }

  api
    .post(baseURLTargetSetting + "targets/getGrainageTargetRecords", {
      targetTypetraining: "training",
      courseId,
      financialYearMasterId,
      trainingInstitutionId
    })
    .then((response) => {
      const content = response.data.content || {};
      const physicalMonths = content.physicalTargetMonths?.[0] || {};
      const financialMonths = content.financialTargetMonths?.[0] || {};

      const sumValues = (months) =>
        Object.values(months)
          .map(val => parseFloat(val) || 0)
          .reduce((a, b) => a + b, 0);

      const physicalTotal = sumValues(physicalMonths).toFixed(2);
      const financialTotal = sumValues(financialMonths).toFixed(2);

      // Update state
      setViewTotalTargetsDataPhysical([{ yearlyTrainingValue: physicalTotal }]);
      setViewTotalTargetsDataFinancial([{ yearlyTrainingValue: financialTotal }]);

      // ✅ Calculate total yearly target here
      const totalYearlyTrainingValue =
        (!isNaN(parseFloat(physicalTotal)) && !isNaN(parseFloat(financialTotal)))
          ? (parseFloat(physicalTotal) + parseFloat(financialTotal)).toFixed(2)
          : "N/A";

      console.log("Total Yearly Training Value:", totalYearlyTrainingValue);
      setTotalYearlyTraining(totalYearlyTrainingValue); // Optional: if you have a state for total
    })
    .catch(() => {
      setViewTotalTargetsDataPhysical([{ yearlyTrainingValue: "0.00" }]);
      setViewTotalTargetsDataFinancial([{ yearlyTrainingValue: "0.00" }]);
      setTotalYearlyTraining("0.00"); // Optional
    });
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
    <Layout title={t("Sericulture Training Institute Wise Target Setting")}>
      <style>{trainingTargetStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Sericulture Training Institute Wise Target Setting")}
              </Block.Title>
            </Block.HeadContent>
            <ul className="d-flex">
                <li>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleShowModal}
                    className="sh-cta-btn"
                  >
                    <Icon name="eye" />
                    <span>{t("View")}</span>
                  </Button>
                </li>
              </ul>
          </Block.HeadBetween>
        </div>
      </Block.Head>


      <Block className="mt-n4 sh-form-wrap">
        {/* <Form action="#"> */}
        <Row>
          {/* <Col lg={type.budgetType === "release" ? "8" : "12"}> */}
            <Form noValidate validated={validated} onSubmit={postData}>
              <Row className="g-3 ">
                <Block>
                  <Card className="sh-section-card">
                    <Card.Header className="sh-section-header">
                      <Icon name="activity-round" />
                      <span>{t("Sericulture Training Institute Wise Target Setting")}</span>
                    </Card.Header>
                    {/* <Card.Body> */}
                    {/* <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '20px',
                        alignItems: 'center', // Ensure items align horizontally
                      }}
                    >
                      <Button variant="primary" onClick={totalTarget}>
                        {t('Yearly Targets')}
                      </Button>

                      <table
                        className="table table-bordered table-striped"
                        style={{ ...styles.table, width: '600px', margin: '0' }} // Ensure no unnecessary margin
                      >
                         <thead>
                              <tr>
                              <th style={styles.ctstyle}>{t("Yearly No.Of Trainings")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {viewTotalTargetsDataFinancial.length > 0 ? (

                                <tr>
                                <td>{viewTotalTargetsDataFinancial[0].yearlyTrainingValue || "N/A"}</td>

                                </tr>
                              ) : (
                                <tr>
                                <td colSpan={3} style={{ textAlign: "center" }}>
                                  {t("No Data Available")}
                                </td>
                              </tr>
                              )}
                            </tbody>
                      </table>
                    </div> */}

<Card.Body>
  {/* 1️⃣ Button Section */}
  <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
    <Button 
      variant="primary" 
      onClick={totalTarget}
      style={{ padding: '8px 20px', fontWeight: 'bold' }}
    >
      {t("Yearly Targets")}
    </Button>
  </div>

  {/* 2️⃣ Targets Tables Section */}
  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
    {/* Physical Target */}
    <table className="table table-bordered table-striped" style={{ width: '300px', textAlign: 'center' }}>
      <thead>
        <tr>
          <th>{t("Yearly Physical Target")}: {viewTotalTargetsDataPhysical[0]?.yearlyTrainingValue || t("N/A")}</th>
        </tr>
      </thead>
    </table>

    {/* Financial Target */}
    <table className="table table-bordered table-striped" style={{ width: '300px', textAlign: 'center' }}>
      <thead>
        <tr>
          <th>{t("Yearly Financial Target")}: {viewTotalTargetsDataFinancial[0]?.yearlyTrainingValue || t("N/A")}</th>
        </tr>
      </thead>
    </table>

    {/* Total Target */}
    <table className="table table-bordered table-striped" style={{ width: '300px', textAlign: 'center' }}>
      <thead>
        <tr>
          <th>
            {t("Total Yearly Training Targets")}: {
              (!isNaN(parseFloat(viewTotalTargetsDataPhysical[0]?.yearlyTrainingValue)) &&
               !isNaN(parseFloat(viewTotalTargetsDataFinancial[0]?.yearlyTrainingValue)))
                ? (parseFloat(viewTotalTargetsDataPhysical[0]?.yearlyTrainingValue) + 
                   parseFloat(viewTotalTargetsDataFinancial[0]?.yearlyTrainingValue)).toFixed(2)
                : t("N/A")
            }
          </th>
        </tr>
      </thead>
    </table>
  </div>
{/* </Card.Body> */}

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
                                {financialyearListData && financialyearListData.length
                                ?financialyearListData.map((list) => (
                                  <option
                                    key={list.financialYearMasterId}
                                    value={list.financialYearMasterId}
                                  >
                                    {list.financialYear}
                                  </option>
                                ))
                                :""}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Financial Year is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        
                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("Training Institution")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="trainingInstitutionId"
                                value={data.trainingInstitutionId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.trainingInstitutionId === undefined ||
                                  data.trainingInstitutionId === "0"
                                }
                              >
                                <option value="">{t("Select Institution")}</option>
                                {trInstituteListData && trInstituteListData.length ?
                                trInstituteListData.map((list) => (
                                  <option
                                    key={list.trInstitutionMasterId}
                                    value={list.trInstitutionMasterId}
                                  >
                                    {list.trInstitutionMasterName}
                                  </option>
                                ))
                                : ""}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Training Institution is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              {t("Training Program")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="courseId"
                                value={data.courseId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.courseId === undefined ||
                                  data.courseId === "0"
                                }
                              >
                                <option value="">{t("Select Program")}</option>
                                {trCourseListData && trCourseListData.length
                                ?trCourseListData.map((list) => (
                                  <option
                                    key={list.trCourseMasterId}
                                    value={list.trCourseMasterId}
                                  >
                                    {list.trCourseMasterName}
                                  </option>
                                ))
                                : ""}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Training Program is required")}
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

                <Block>
                  <Card className="sh-section-card">
                    <Card.Header className="sh-section-header">
                      <Icon name="calendar" />
                      <span>{t("Months")}</span>
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="6">
                          <Form.Group className="form-group mt-n2">
                            <Form.Label htmlFor="value" className="bold fs-5">
                              {t("April")}
                            </Form.Label>
                            <Row className="g-gs">
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("PHYSICAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="april"
                                    name="april"
                                    value={physicalTargetMonths.april}
                                    onChange={handlePhysical}
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
                                  {t("FINANCIAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="april"
                                    name="april"
                                    value={financialTargetMonths.april}
                                    onChange={handleFinancial}
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
                                  {t("PHYSICAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="may"
                                    name="may"
                                    value={physicalTargetMonths.may}
                                    onChange={handlePhysical}
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
                                  {t("FINANCIAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="may"
                                    name="may"
                                    value={financialTargetMonths.may}
                                    onChange={handleFinancial}
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
                              {t("June")}
                            </Form.Label>
                            <Row className="g-gs">
                              <Col lg="6">
                                <Form.Label htmlFor="value">
                                  {t("PHYSICAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="june"
                                    name="june"
                                    value={physicalTargetMonths.june}
                                    onChange={handlePhysical}
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
                                  {t("FINANCIAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="june"
                                    name="june"
                                    value={financialTargetMonths.june}
                                    onChange={handleFinancial}
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
                                  {t("PHYSICAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="july"
                                    name="july"
                                    value={physicalTargetMonths.july}
                                    onChange={handlePhysical}
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
                                  {t("FINANCIAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="july"
                                    name="july"
                                    value={financialTargetMonths.july}
                                    onChange={handleFinancial}
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
                                  {t("PHYSICAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="august"
                                    name="august"
                                    value={physicalTargetMonths.august}
                                    onChange={handlePhysical}
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
                                  {t("FINANCIAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="august"
                                    name="august"
                                    value={financialTargetMonths.august}
                                    onChange={handleFinancial}
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
                                  {t("PHYSICAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="september"
                                    name="september"
                                    value={physicalTargetMonths.september}
                                    onChange={handlePhysical}
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
                                  {t("FINANCIAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="september"
                                    name="september"
                                    value={financialTargetMonths.september}
                                    onChange={handleFinancial}
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
                                  {t("PHYSICAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="october"
                                    name="october"
                                    value={physicalTargetMonths.october}
                                    onChange={handlePhysical}
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
                                  {t("FINANCIAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="october"
                                    name="october"
                                    value={financialTargetMonths.october}
                                    onChange={handleFinancial}
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
                                  {t("PHYSICAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="november"
                                    name="november"
                                    value={physicalTargetMonths.november}
                                    onChange={handlePhysical}
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
                                  {t("FINANCIAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="november"
                                    name="november"
                                    value={financialTargetMonths.november}
                                    onChange={handleFinancial}
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
                                  {t("PHYSICAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="december"
                                    name="december"
                                    value={physicalTargetMonths.december}
                                    onChange={handlePhysical}
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
                                  {t("FINANCIAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="december"
                                    name="december"
                                    value={financialTargetMonths.december}
                                    onChange={handleFinancial}
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
                                  {t("PHYSICAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="january"
                                    name="january"
                                    value={physicalTargetMonths.january}
                                    onChange={handlePhysical}
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
                                  {t("FINANCIAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="january"
                                    name="january"
                                    value={financialTargetMonths.january}
                                    onChange={handleFinancial}
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
                                  {t("PHYSICAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="february"
                                    name="february"
                                    value={physicalTargetMonths.february}
                                    onChange={handlePhysical}
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
                                  {t("FINANCIAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="february"
                                    name="february"
                                    value={financialTargetMonths.february}
                                    onChange={handleFinancial}
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
                                  {t("PHYSICAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="march"
                                    name="march"
                                    value={physicalTargetMonths.march}
                                    onChange={handlePhysical}
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
                                  {t("FINANCIAL TARGET")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="march"
                                    name="march"
                                    value={financialTargetMonths.march}
                                    onChange={handleFinancial}
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
          {/* </Col> */}
         
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
            <span>{t("Sericulture Training Institute Wise Target Setting")}</span>
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
                                ?financialyearListData.map((list) => (
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
                              {t("Training Program")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="courseId"
                                value={editData.courseId}
                                onChange={handleEditInputs}
                                onBlur={() => handleEditInputs}
                                required
                                disabled
                                isInvalid={
                                  editData.courseId === undefined ||
                                  editData.courseId === "0"
                                }
                              >
                                <option value="">{t("Select Program")}</option>
                                {trCourseListData && trCourseListData.length ?
                                trCourseListData.map((list) => (
                                  <option
                                    key={list.trCourseMasterId}
                                    value={list.trCourseMasterId}
                                  >
                                    {list.trCourseMasterName}
                                  </option>
                                ))
                                :""}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Training Program is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("Training Institution")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="trainingInstitutionId"
                                value={editData.trainingInstitutionId}
                                onChange={handleEditInputs}
                                onBlur={() => handleEditInputs}
                                required
                                disabled
                                isInvalid={
                                  editData.trainingInstitutionId === undefined ||
                                  editData.trainingInstitutionId === "0"
                                }
                              >
                                <option value="">{t("Select Institution")}</option>
                                {trInstituteListData && trInstituteListData.length ?
                                trInstituteListData.map((list) => (
                                  <option
                                    key={list.trInstitutionMasterId}
                                    value={list.trInstitutionMasterId}
                                  >
                                    {list.trInstitutionMasterName}
                                  </option>
                                ))
                                :""}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Training Institution is required")}
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
                                disabled
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

              <Col sm={3}>
                <Form.Group className="form-group mt-n4">
                  <Form.Label>{t("Target (No. of Trainings)")}</Form.Label>
                  <Form.Control
                    id="value"
                    name="value"
                    value={editData.value}
                    onChange={handleEditInputs}
                    type="text"
                    placeholder={t("Enter Physical (No. of Trainings)")}
                    className="form-control"
                    // readOnly
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {t("Target (No. of Trainings) is required")}
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
      <Modal show={showModal} onHide={handleCloseModal} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="target" />
            <span>{t("Alloted Details")}</span>
          </Modal.Title>
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
        data={displayListFinancial}
        highlightOnHover
        pagination
        paginationServer
        paginationTotalRows={totalRowsViewFinancial}
        paginationPerPage={countPerPage}
        paginationComponentOptions={{
          noRowsPerPage: true,
        }}
        onChangePage={(page) => setPage2(page - 1)}
        progressPending={loading}
        progressComponent={<div className="p-3">{t("Loading...")}</div>}
        noDataComponent={t("There are no records to display")}
        theme="solarized"
        customStyles={customStyles}
      />
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
        onChangePage={(page) => setPage1(page - 1)}
        progressPending={loading}
        progressComponent={<div className="p-3">{t("Loading...")}</div>}
        noDataComponent={t("There are no records to display")}
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
          data={displayListHierarchyFinancial}
          highlightOnHover
          pagination
          paginationServer
          paginationTotalRows={totalRowsViewHierarchyFinancial}
          paginationPerPage={countPerPage}
          paginationComponentOptions={{
            noRowsPerPage: true,
          }}
          onChangePage={(page) => setPage4(page - 1)}
          progressPending={loading}
          progressComponent={<div className="p-3">{t("Loading...")}</div>}
          noDataComponent={t("There are no records to display")}
          theme="solarized"
          customStyles={customStyles}
        />
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
          onChangePage={(page) => setPage3(page - 1)}
          progressPending={loading}
          progressComponent={<div className="p-3">{t("Loading...")}</div>}
          noDataComponent={t("There are no records to display")}
          theme="solarized"
          customStyles={customStyles}
        />
              </Col>
            )}
          </Row>
        </Modal.Body>
      </Modal>
      <Modal show={showModal2} onHide={handleCloseModal2} size="xl" className="sh-modal">
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
                  <Button variant="primary" onClick={() => handleCloseModal2()} className="sh-save-btn">
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

const trainingTargetStyles = `
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

export default TrainingTarget;
