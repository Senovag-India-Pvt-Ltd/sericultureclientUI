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
// import axios from "axios";
import api from "../../../services/auth/api";
import { t } from "i18next";
import { useTranslation } from "react-i18next";


const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function SchemeAchievement() {
  const { t } = useTranslation();

  const [data, setData] = useState({
    mulberryTargetTypeId: "",
    financialYearMasterId: "",
    districtId: "",
    talukId: "",
    month: "",
    targetType: "",
    value: "",
    scHeadAccountId: "",
    scComponentId: "",
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    scCategoryId: "",
    stateShare: "",
    centralShare: "",
    userMasterId: "",
    institution: "",
    tscMasterId: "",
  });

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
    
    
    // to get all month target
    const getAllMonthTarget = () => {
      api
       .post(baseURLTargetSetting + `schemeTargets/getSchemeRecordsForINST?financialYearId=${data.financialYearMasterId}&scSchemeDetailsId=${data.scSchemeDetailsId}&scSubSchemeDetailsId=${data.scSubSchemeDetailsId}&scComponentId=${data.scComponentId}&scCategoryId=${data.scCategoryId}&scHeadAccountId=${data.scHeadAccountId}&districtId=${data.districtId}&tscMasterId=${data.tscMasterId}`)
       .then((response) => {
         const physicalMonthList = response.data.physicalTargetMonths;
         const financialMonthList = response.data.financialTargetMonths;
         if (
          physicalMonthList && physicalMonthList.length > 0 &&
          financialMonthList && financialMonthList.length > 0
         ){
           const physicalTargetMonths = physicalMonthList[0];
           const financialTargetMonths = financialMonthList[0];
           setPhysicalTargetMonths({
             april:physicalTargetMonths.april,
             may:physicalTargetMonths.may,
             june:physicalTargetMonths.june,
             july:physicalTargetMonths.july,
             august:physicalTargetMonths.august,
             september:physicalTargetMonths.september,
             october:physicalTargetMonths.october,
             november:physicalTargetMonths.november,
             december:physicalTargetMonths.december,
             january:physicalTargetMonths.january,
             february:physicalTargetMonths.february,
             march:physicalTargetMonths.march,
           });
           setFinancialTargetMonths({
             april:financialTargetMonths.april,
             may:financialTargetMonths.may,
             june:financialTargetMonths.june,
             july:financialTargetMonths.july,
             august:financialTargetMonths.august,
             september:financialTargetMonths.september,
             october:financialTargetMonths.october,
             november:financialTargetMonths.november,
             december:financialTargetMonths.december,
             january:financialTargetMonths.january,
             february:financialTargetMonths.february,
             march:financialTargetMonths.march,
           });
         }else{
           setPhysicalTargetMonths({
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
           setFinancialTargetMonths({
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
     if(data.financialYearMasterId && data.scSchemeDetailsId && data.scSubSchemeDetailsId && data.scComponentId && data.scCategoryId && data.scHeadAccountId && data.districtId && data.tscMasterId){
       getAllMonthTarget();
     }
    }, [data.financialYearMasterId && data.scSchemeDetailsId && data.scSubSchemeDetailsId && data.scComponentId && data.scCategoryId && data.scHeadAccountId && data.districtId && data.tscMasterId]);

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
  const [showModal2, setShowModal2] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal3 = () => setShowModal3(true);
  const handleCloseModal3 = () => setShowModal3(false);

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const [showModal7, setShowModal7] = useState(false);

  const handleShowModal7 = () => setShowModal7(true);
  const handleCloseModal7 = () => {
    setShowModal7(false);
    userSearchEditClear();
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

  const searchUserEdit = (e) => {
    // Build the params object dynamically
    const params = {};

    // Only add the parameters to the params object if they are not empty or undefined
    if (searchDataEdit.districtId) params.districtId = searchDataEdit.districtId;
    if (searchDataEdit.talukId) params.talukId = searchDataEdit.talukId;
    if (searchDataEdit.designationId)
      params.designationId = searchDataEdit.designationId;
    if (searchDataEdit.phoneNumber) params.phoneNumber = searchDataEdit.phoneNumber;
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

  const [toggleButton, setToggleButton] = useState(false);

  const toggle = () => {
    setToggleButton(!toggleButton);
  };

   useEffect(() => {
  if (data.financialYearMasterId && data.scSchemeDetailsId) {
    handleShowModal();
  }
}, [page1, page2, page3, page4]);

  const [displayList, setDisplayList] = useState([]);
  const [displayListFinancial,setDisplayListFinancial] = useState([]);
  const [displayListHierarchy, setDisplayListHierarchy] = useState([]);
  const [displayListHierarchyFinancial, setDisplayListHierarchyFinancial] = useState([]);
  const [totalRowsView, setTotalRowsView] = useState(0);
  const [totalRowsViewFinancial, setTotalRowsViewFinancial] = useState(0);
  const [totalRowsViewHierarchy, setTotalRowsViewHierarchy] = useState(0);
  const [totalRowsViewHierarchyFinancial, setTotalRowsViewHierarchyFinancial] = useState(0);

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

useEffect(() => {
  if (showModal) {
    fetchHierarchyData("PHYSICAL TARGET", page3); 
  }
}, [page3]); 

useEffect(() => {
  if (showModal) {
    fetchHierarchyData("FINANCIAL TARGET", page4); 
  }
}, [page4]); 

useEffect(() => {
  if (showModal) {
    fetchViewData("FINANCIAL TARGET", page1); 
  }
}, [page1]);

useEffect(() => {
  if (showModal) {
    fetchViewData("PHYSICAL TARGET", page2); 
  }
}, [page2]); 

const fetchViewData = (targetType, page) => { 
  const parameters = {
    params: {
      financialYearId: data.financialYearMasterId,
      schemeId: data.scSchemeDetailsId,
      hoaId: data.scHeadAccountId,
      componentTypeId: data.scSubSchemeDetailsId,
      componentId: data.scComponentId,
      targetType: targetType, 
      pageNumber: page,      
      size: countPerPage,
    },
  };

  api.get(`${baseURLTargetSetting}schemeTargets/get-by-scheme-target-details`, parameters)
    .then((response) => {
      if (targetType === "PHYSICAL TARGET") {
        setDisplayList(response.data.content.schemeTargets); 
        setTotalRowsView(response.data.content.totalItems);   
      } else {
        setDisplayListFinancial(response.data.content.schemeTargets); 
        setTotalRowsViewFinancial(response.data.content.totalItems);  
      }
    })
    .catch(() => {
      if (targetType === "PHYSICAL TARGET") setDisplayList([]);
      else setDisplayListFinancial([]);
    });
};


const fetchHierarchyData = (targetType, page) => { 
  const parameters = {
    params: {
      financialYearId: data.financialYearMasterId,
      schemeId: data.scSchemeDetailsId,
      hoaId: data.scHeadAccountId,
      componentTypeId: data.scSubSchemeDetailsId,
      componentId: data.scComponentId,
      targetType: targetType, 
      pageNumber: page,       
      size: countPerPage,
    },
  };

  api.get(`${baseURLTargetSetting}schemeTargets/get-by-scheme-target-details-hierarchy`, parameters)
    .then((response) => {
      if (targetType === "PHYSICAL TARGET") {
        setDisplayListHierarchy(response.data.content.schemeTargets); 
        setTotalRowsViewHierarchy(response.data.content.totalItems);  
      } else {
        setDisplayListHierarchyFinancial(response.data.content.schemeTargets); 
        setTotalRowsViewHierarchyFinancial(response.data.content.totalItems);  
      }
    })
    .catch(() => {
      if (targetType === "PHYSICAL TARGET") setDisplayListHierarchy([]);
      else setDisplayListHierarchyFinancial([]);
    });
};



  const schemeTargets = ["PHYSICAL TARGET","FINANCIAL TARGET"];

  const handleShowModal = () => {
    if (data.financialYearMasterId && data.scSchemeDetailsId) {
      schemeTargets.forEach((target)=>{
      let parameters = {
        params: {
          financialYearId: data.financialYearMasterId,
          schemeId: data.scSchemeDetailsId,
          hoaId: data.scHeadAccountId,
          componentTypeId: data.scSubSchemeDetailsId,
          componentId: data.scComponentId,
          targetType: target,
          pageNumber: target === 'PHYSICAL TARGET'? page1:page2,
          size: countPerPage,
        },
      };
      let parameters2 = {
  params: {
    financialYearId: data.financialYearMasterId,
    schemeId: data.scSchemeDetailsId,
    hoaId: data.scHeadAccountId,
    componentTypeId: data.scSubSchemeDetailsId,
    componentId: data.scComponentId,
    targetType: target,
    pageNumber: target === 'PHYSICAL TARGET'? page3:page4,
    size: countPerPage,
  },
};
      api
        .get(
          baseURLTargetSetting + `schemeTargets/get-by-scheme-target-details`,
          parameters
        )
        .then((response) => {
          setShowModal(true);
          const res = target;
          if( "PHYSICAL TARGET" === res ){
            setDisplayListFinancial(response.data.content.schemeTargets);
            setTotalRowsViewFinancial(response.data.content.totalItems);
          }else{
            setDisplayList(response.data.content.schemeTargets);
            setTotalRowsView(response.data.content.totalItems);
          }
        })
        .catch((err) => {
          setDisplayList([]);
        });

      api
        .get(
          baseURLTargetSetting +
            `schemeTargets/get-by-scheme-target-details-hierarchy`,
          parameters
        )
        .then((response) => {
          // setShowModal(true);
          const res = target;
          if( "PHYSICAL TARGET" === res ){
            setDisplayListHierarchyFinancial(response.data.content.schemeTargets);
            setTotalRowsViewHierarchyFinancial(response.data.content.totalItems);
          }else{
            setDisplayListHierarchy(response.data.content.schemeTargets);
            setTotalRowsViewHierarchy(response.data.content.totalItems);
          }
        })
        .catch((err) => {
          setDisplayListHierarchy([]);
        });
      })
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
      .get(baseURLTargetSetting + `schemeTargets/list-sisd-join`, _params)
      .then((response) => {
        setListData(response.data.content.body.content.schemeTargets);
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



  const [editData, setEditData] = useState({
    mulberryTargetTypeId: "",
    financialYearMasterId: "",
    districtId: "",
    month: "",
    targetType: "",
    value: "",
    scHeadAccountId: "",
    scComponentId: "",
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    scCategoryId: "",
    stateShare: "",
    centralShare: "",
    userMasterId: "",
    institution: "",
    talukId: "",
    tscMasterId: "",
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

  // useEffect(() => {
  //   if (searchData.districtId) {
  //     getTalukList(searchData.districtId);
  //   }
  // }, [searchData.districtId]);
  useEffect(() => {
    const districtId =
      searchData.districtId || data.districtId || editData.districtId;
    if (districtId) {
      getTalukList(districtId);
    }
  }, [searchData.districtId, data.districtId, editData.districtId]);

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

  //   To get TSC by District
  const [tscListData, setTscListData] = useState([]);

  const getTscListByDistrict = (distId) => {
    api
      .post(baseURLMasterData + `tscMaster/get-by-districtId`, {
        districtId: distId,
      })
      .then((response) => {
        setTscListData(response.data.content.tscMaster);
      })
      .catch((err) => {
        setTscListData([]);
      });
  };

  useEffect(() => {
    if (data.districtId) {
      getTscListByDistrict(data.districtId);
    }
  }, [data.districtId]);

  useEffect(() => {
    if (editData.districtId) {
      getTscListByDistrict(editData.districtId);
    }
  }, [editData.districtId]);

  const handleEdit = (schemeTargetsId) => {
    setLoading(true);
    const response = api
      .get(baseURLTargetSetting + `schemeTargets/get-by-id?id=${schemeTargetsId}`)
      .then((response) => {
        setEditData(response.data.content.body.content.schemeTargets);
        setUserNameEdit(
          response.data.content.body.content.schemeTargets.userMasterName
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

  const [viewTotalTargetsDataPhysical, setViewTotalTargetsDataPhysical] = useState({});
  const [viewTotalTargetsDataFinancial, setViewTotalTargetsDataFinancial] = useState({});

  const totalTarget = (event) => {
    const { financialYearMasterId,scSchemeDetailsId,scSubSchemeDetailsId,scComponentId,scCategoryId,scHeadAccountId,districtId,talukId,tscMasterId,targetType,month} = data;

    
    if (!financialYearMasterId || financialYearMasterId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select Financial Year",
        text: "Please try again!",
      });
      return;
    }

    if (!scSchemeDetailsId || scSchemeDetailsId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select Scheme",
        text: "Please try again!",
      });
      return;
    }

    if (!scSubSchemeDetailsId || scSubSchemeDetailsId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select Component Type",
        text: "Please try again!",
      });
      return;
    }

    if (!scComponentId || scComponentId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please select Component",
        text: "Please try again!",
      });
      return;
    }

    if (!scCategoryId || scCategoryId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please Select Sub Component",
        text: "Please try again!",
      });
      return;
    }

    if (!scHeadAccountId || scHeadAccountId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please Select Head Of Account",
        text: "Please try again!",
      });
      return;
    }

    if (!districtId || districtId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please Select District",
        text: "Please try again!",
      });
      return;
    }

    // if (!talukId || talukId === "0") {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Please Select Taluk",
    //     text: "Please try again!",
    //   });
    //   return;
    // }
    if (!tscMasterId || tscMasterId === "0") {
      Swal.fire({
        icon: "warning",
        title: "Please Select TSC",
        text: "Please try again!",
      });
      return;
    }

    // if (!targetType || targetType === "0") {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Please Select Target Type",
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
    const targets = ["PHYSICAL TARGET","FINANCIAL TARGET"];
    targets.forEach((target) => {
    api
      .post(
        baseURLTargetSetting + `schemeTargets/getOnlyYearlyTargetDetailsForTscAndInst`,
        {},
        {
          params: {
            financialYearMasterId,
            scSchemeDetailsId,
            scSubSchemeDetailsId,
            scComponentId,
            scCategoryId,
            scHeadAccountId,
            districtId,
            // talukId,
            tscMasterId,
            targetType:target
            // month
          },
        }
      )
      .then((response) => {
        if(target === "PHYSICAL TARGET"){
          setViewTotalTargetsDataPhysical(response.data);
        }
        else{
          setViewTotalTargetsDataFinancial(response.data);
        }
          
        // setTotalRows(response.data.totalRecords);
        // setShowModal4(true);
      })
      .catch((err) => {
        if(target === "PHYSICAL TARGET"){
          setViewTotalTargetsDataPhysical([]);
        }else{
          setViewTotalTargetsDataFinancial([]);
        }
      });
    });
    
  };

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
    }
  }, [data.scSchemeDetailsId]);

  useEffect(() => {
    if (editData.scSchemeDetailsId) {
      getSubSchemeList(editData.scSchemeDetailsId);
    }
  }, [editData.scSchemeDetailsId]);

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

  useEffect(() => {
    if (editData.scSchemeDetailsId && editData.scSubSchemeDetailsId) {
      getComponentList(
        editData.scSchemeDetailsId,
        editData.scSubSchemeDetailsId
      );
      getHeadAccountbyschemeIdAndSubSchemeIdList(
        editData.scSchemeDetailsId,
        editData.scSubSchemeDetailsId
      );
    }
  }, [editData.scSchemeDetailsId, editData.scSubSchemeDetailsId]);

  console.log(data);

  // to get head of account by sc-scheme-details
  const [scHeadAccountListData, setScHeadAccountListData] = useState([]);
  const getHeadAccountList = (schemeId, subSchemeId, scComponentId) => {
    api
      .post(
        baseURLDBT +
          `master/cost/get-by-schemeId-and-subSchemeId-and-scComponentId`,
        {
          schemeId: schemeId,
          subSchemeId: subSchemeId,
          scComponentId: scComponentId,
        }
      )
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
    if (
      data.scSchemeDetailsId &&
      data.scSubSchemeDetailsId &&
      data.scComponentId
    ) {
      getHeadAccountList(
        data.scSchemeDetailsId,
        data.scSubSchemeDetailsId,
        data.scComponentId
      );
    }
  }, [data.scSchemeDetailsId, data.scSubSchemeDetailsId, data.scComponentId]);

  useEffect(() => {
    if (
      editData.scSchemeDetailsId &&
      editData.scSubSchemeDetailsId &&
      editData.scComponentId
    ) {
      getHeadAccountList(
        editData.scSchemeDetailsId,
        editData.scSubSchemeDetailsId,
        editData.scComponentId
      );
    }
  }, [
    editData.scSchemeDetailsId,
    editData.scSubSchemeDetailsId,
    editData.scComponentId,
  ]);

  // get Category List
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
    name = e.target.name;
    value = e.target.value;
    // setData({ ...data, [name]: value });
    let updatedData = { ...editData, [name]: value };
    if (name === "centralBudget" || name === "stateBudget") {
      const centralBudget = parseFloat(updatedData.centralBudget);
      const stateBudget = parseFloat(updatedData.stateBudget);
      const totalAmount =
        (isNaN(centralBudget) ? 0 : centralBudget) +
        (isNaN(stateBudget) ? 0 : stateBudget);
      updatedData = { ...updatedData, amount: totalAmount.toString() };
    }
    setEditData(updatedData);
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
          baseURLTargetSetting + `schemeTargets/editInstSchemeTargets`,
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

  const editClear = () => {
    setEditData({
      mulberryTargetTypeId: "",
      financialYearMasterId: "",
      districtId: "",
      month: "",
      targetType: "",
      value: "",
      scHeadAccountId: "",
      scComponentId: "",
      scSchemeDetailsId: "",
      scSubSchemeDetailsId: "",
      scCategoryId: "",
      stateShare: "",
      centralShare: "",
      userMasterId: "",
      institution: "",
      talukId: "",
      tscMasterId: "",
    });
    setType({
      budgetType: "allocate",
    });
    getFinancialDefaultDetails();
    setValidatedAllDateEdit(false);
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

  const navigate = useNavigate();

  const handleView = (_id) => {
    navigate(`/seriui/taluk-view/${_id}`);
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
          .delete(baseURLTargetSetting + `schemeTargets/delete-inst/${_id}`)
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
      title: "Please select financial year and scheme",
      text: "Please try again!",
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
            onClick={() => handleView(row.schemeTargetsId)}
          >
            View
          </Button> */}
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.schemeTargetsId)}
          >
            {t("Edit")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.schemeTargetsId)}
            className="ms-2"
          >
            {t("Delete")}
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2,
    },
    {
      name: t("Financial Year"),
      selector: (row) => row.financialYearMaster,
      cell: (row) => <span>{row.financialYearMaster}</span>,
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
      name: t("Head of Account"),
      selector: (row) => row.scHeadAccountName,
      cell: (row) => <span>{row.scHeadAccountName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Central Budget (In Lakhs)"),
      selector: (row) => row.centralShare,
      cell: (row) => <span>{row.centralShare}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("State Budget (In Lakhs)"),
      selector: (row) => row.stateShare,
      cell: (row) => <span>{row.stateShare}</span>,
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
    {
      name: t("Institution"),
      selector: (row) => row.institution,
      cell: (row) => <span>{row.institution}</span>,
      sortable: true,
      hide: "md",
    },
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
      name: t("Scheme"),
      selector: (row) => row.schemeName,
      cell: (row) => <span>{row.schemeName}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: t("Component Type"),
    //   selector: (row) => row.subSchemeName,
    //   cell: (row) => <span>{row.subSchemeName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
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
      name: t("Head of Account"),
      selector: (row) => row.scHeadAccountName,
      cell: (row) => <span>{row.scHeadAccountName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Central Budget (In Lakhs)"),
      selector: (row) => row.centralShare,
      cell: (row) => <span>{row.centralShare}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("State Budget (In Lakhs)"),
      selector: (row) => row.stateShare,
      cell: (row) => <span>{row.stateShare}</span>,
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
    {
      name: t("Institution"),
      selector: (row) => row.institution,
      cell: (row) => <span>{row.institution}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  // const postData = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);
  //   } else {
  //     event.preventDefault();
  //     // event.stopPropagation();
  //     const {talukId,...rest} = data;
  //     api
  //       .post(
  //         baseURLTargetSetting + `schemeTargets/saveInstSchemeTargets`,
  //          {...rest,physicalTargetMonths:[physicalTargetMonths],financialTargetMonths:[financialTargetMonths]}
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
              .post(baseURLTargetSetting + `schemeAchievement/add-Scheme`, data)
              .then((response) => {
                if (response.data.content.error) {
                  saveError(response.data.content.error_description);
                } else {
                  saveSuccess();
                  setData({   
      targetsAchievementId: "",
      financialYearMasterId: "",
      districtId: "",
      month: "",
      value: "",
      scHeadAccountId: "",
      scComponentId: "",
      scSchemeDetailsId: "",
      scSubSchemeDetailsId: "",
      scCategoryId: "",
      stateShare: "",
      centralShare: "",
      userMasterId: "",
      institution: "",
      talukId: "",
      tscMasterId: "",
      target: "", 
      pageType: "SCHEME",
    
    
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

  const clear = () => {
    setData({
      mulberryTargetTypeId: "",
      financialYearMasterId: "",
      districtId: "",
      month: "",
      targetType: "",
      value: "",
      scHeadAccountId: "",
      scComponentId: "",
      scSchemeDetailsId: "",
      scSubSchemeDetailsId: "",
      scCategoryId: "",
      stateShare: "",
      centralShare: "",
      userMasterId: "",
      institution: "",
      talukId: "",
      tscMasterId: "",
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
  <Layout title={t("Scheme Wise Achievement")}>
    <Block.Head>
      <Block.HeadBetween>
        <Block.HeadContent>
          <Block.Title tag="h2">
            {t("Scheme Wise Achievement")}
          </Block.Title>
        </Block.HeadContent>
        {/* Removed View Button Block */}
      </Block.HeadBetween>
    </Block.Head>


      <Block className="mt-n4">
        {/* <Form action="#"> */}
        <Row>
          <Col lg={type.budgetType === "release" ? "8" : "12"}>
            <Form noValidate validated={validated} onSubmit={postData}>
              <Row className="g-3 ">
                <Block>
                  <Card>
                    <Card.Header>
                      {t("Scheme Wise Achievement")}{" "}
                    </Card.Header>
                  
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
                          <Form.Group className="form-group mt-n3">
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
                                <option value="">
                                  {t("Select Scheme Names")}
                                </option>
                                {scSchemeDetailsListData &&
                                  scSchemeDetailsListData.map((list) => (
                                    <option
                                      key={list.scSchemeDetailsId}
                                      value={list.scSchemeDetailsId}
                                    >
                                      {list.schemeName}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Scheme is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
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
                                <option value="">
                                  {t("Select Component Type")}
                                </option>
                                {scSubSchemeDetailsListData &&
                                  scSubSchemeDetailsListData.map((list, i) => (
                                    <option key={i} value={list.subSchemeId}>
                                      {list.subSchemeName}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Component Type is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
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
                                <option value="">
                                  {t("Select Component")}
                                </option>
                                {scComponentListData &&
                                  scComponentListData.map((list) => (
                                    <option
                                      key={list.scComponentId}
                                      value={list.scComponentId}
                                    >
                                      {list.scComponentName}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Component is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
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
                                <option value="">
                                  {t("Select Sub Component")}
                                </option>
                                {scCategoryListData &&
                                  scCategoryListData.map((list) => (
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
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              {t("Head of Account")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scHeadAccountId"
                                value={data.scHeadAccountId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scHeadAccountId === undefined ||
                                  data.scHeadAccountId === "0"
                                }
                              >
                                <option value="">
                                  {t("Select Head of Account")}
                                </option>
                                {scHeadAccountListData &&
                                  scHeadAccountListData.map((list) => (
                                    <option
                                      key={list.headOfAccountId}
                                      value={list.headOfAccountId}
                                    >
                                      {list.scHeadAccountName}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {t("Head of Account is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label htmlFor="centralShare">
                              {t("Central Budget Amount (in Lakhs)")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="centralShare"
                                name="centralShare"
                                value={data.centralShare}
                                onChange={handleInputs}
                                type="text"
                                placeholder={t("Enter Central Budget Amount")}
                                // required
                              />
                              <Form.Control.Feedback type="invalid">
                                Central Budget Amount is required.
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label htmlFor="stateShare">
                              {t("State Budget Amount (in Lakhs)")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="stateShare"
                                name="stateShare"
                                value={data.stateShare}
                                onChange={handleInputs}
                                type="text"
                                placeholder={t("Enter State Budget Amount")}
                                // required
                              />
                              <Form.Control.Feedback type="invalid">
                                {t("State Budget Amount is required")}.
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
                                <option value="">
                                  {t("Select District")}
                                </option>
                                {districtListData && districtListData.length
                                ? districtListData.map((list) => (
                                  <option
                                    key={list.districtId}
                                    value={list.districtId}
                                  >
                                    {list.districtName}
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
                              {t("Taluk")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="talukId"
                                value={data.talukId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // required
                                isInvalid={
                                  data.talukId === undefined ||
                                  data.talukId === "0"
                                }
                              >
                                <option value="">{t("Select Taluk")}</option>
                                {talukListData && talukListData.length ?
                                talukListData.map((list) => (
                                  <option
                                    key={list.talukId}
                                    value={list.talukId}
                                  >
                                    {list.talukName}
                                  </option>
                                ))
                                : ""}
                              </Form.Select>
                              {/* <Form.Control.Feedback type="invalid">
                                {t("Taluk is required")}
                              </Form.Control.Feedback> */}
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                {t("TSC")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="tscMasterId"
                                  value={data.tscMasterId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs}
                                  required
                                  isInvalid={
                                    data.tscMasterId === undefined ||
                                    data.tscMasterId === "0"
                                  }
                                >
                                  <option value="">{t("Select TSC")}</option>
                                  {tscListData && tscListData.length ?
                                  tscListData.map((list) => (
                                    <option
                                      key={list.tscMasterId}
                                      value={list.tscMasterId}
                                    >
                                      {list.name}
                                    </option>
                                  ))
                                  : ""}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  {t("TSC is required")}
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
                                                        <option value="Physical Target">{t("Financial Target")}</option>
                                                        <option value="Financial Target">{t("Physical Target")}</option>
                                                      </Form.Select>
                                                    </div>
                                                  </Form.Group>
                                                </Col>
                                      

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label htmlFor="institution">
                              {t("Institute")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="institution"
                                name="institution"
                                value={data.institution}
                                onChange={handleInputs}
                                type="text"
                                placeholder={t("Enter Institute")}
                                // required
                              />
                              <Form.Control.Feedback type="invalid">
                                {t("Institute is required")}.
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>



                        <Col lg="1">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("User")}
                              <span className="text-danger">*</span>
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
          <Modal.Title>{t("Scheme Wise Achievement")}</Modal.Title>
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
                                            {list.financialYearMaster}
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
                  <Form.Label htmlFor="sordfl">
                    {t("Scheme")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="scSchemeDetailsId"
                      value={editData.scSchemeDetailsId}
                      onChange={handleEditInputs}
                      onBlur={() => handleEditInputs}
                      // multiple
                      required
                      disabled
                      isInvalid={
                        editData.scSchemeDetailsId === undefined ||
                        editData.scSchemeDetailsId === "0"
                      }
                    >
                      <option value="">
                        {t("Select Scheme Names")}
                      </option>
                      {scSchemeDetailsListData &&
                        scSchemeDetailsListData.map((list) => (
                          <option
                            key={list.scSchemeDetailsId}
                            value={list.scSchemeDetailsId}
                          >
                            {list.schemeName}
                          </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Scheme is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n3">
                  <Form.Label>
                    {t("Component Type")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="scSubSchemeDetailsId"
                      value={editData.scSubSchemeDetailsId}
                      onChange={handleEditInputs}
                      onBlur={() => handleEditInputs}
                      // multiple
                      required
                      disabled
                      isInvalid={
                        editData.scSubSchemeDetailsId === undefined ||
                        editData.scSubSchemeDetailsId === "0"
                      }
                    >
                      <option value="">
                        {t("Select Component Type")}
                      </option>
                      {scSubSchemeDetailsListData &&
                        scSubSchemeDetailsListData.map((list, i) => (
                          <option key={i} value={list.subSchemeId}>
                            {list.subSchemeName}
                          </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Component Type is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n3">
                  <Form.Label htmlFor="sordfl">
                    {t("Component")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="scComponentId"
                      value={editData.scComponentId}
                      onChange={handleEditInputs}
                      onBlur={() => handleEditInputs}
                      // multiple
                      // required
                      disabled
                      isInvalid={
                        editData.scComponentId === undefined ||
                        editData.scComponentId === "0"
                      }
                    >
                      <option value="">
                        {t("Select Component")}
                      </option>
                      {scComponentListData &&
                        scComponentListData.map((list) => (
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
                <Form.Group className="form-group mt-n3">
                  <Form.Label htmlFor="sordfl">
                    {t("Sub Component")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="scCategoryId"
                      value={editData.scCategoryId}
                      onChange={handleEditInputs}
                      onBlur={() => handleEditInputs}
                      // multiple
                      // required
                      disabled
                      isInvalid={
                        editData.scCategoryId === undefined ||
                        editData.scCategoryId === "0"
                      }
                    >
                      <option value="">
                        {t("Select Sub Component")}
                      </option>
                      {scCategoryListData &&
                        scCategoryListData.map((list) => (
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
                <Form.Group className="form-group mt-n3">
                  <Form.Label htmlFor="sordfl">
                    {t("Head of Account")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="scHeadAccountId"
                      value={editData.scHeadAccountId}
                      onChange={handleEditInputs}
                      onBlur={() => handleEditInputs}
                      // multiple
                      required
                      disabled
                      isInvalid={
                        editData.scHeadAccountId === undefined ||
                        editData.scHeadAccountId === "0"
                      }
                    >
                      <option value="">
                        {t("Select Head of Account")}
                      </option>
                      {scHeadAccountListData &&
                        scHeadAccountListData.map((list) => (
                          <option
                            key={list.headOfAccountId}
                            value={list.headOfAccountId}
                          >
                            {list.scHeadAccountName}
                          </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Head of Account is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="centralShare">
                    {t("Central Budget Amount (in Lakhs)")}
                    {/* <span className="text-danger">*</span> */}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="centralShare"
                      name="centralShare"
                      value={editData.centralShare}
                      onChange={handleEditInputs}
                      type="text"
                      placeholder={t("Enter Central Budget Amount")}
                      // required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Central Budget Amount is required")}.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="stateShare">
                    {t("State Budget Amount (in Lakhs)")}
                    {/* <span className="text-danger">*</span> */}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="stateShare"
                      name="stateShare"
                      value={editData.stateShare}
                      onChange={handleEditInputs}
                      type="text"
                      placeholder={t("Enter State Budget Amount")}
                      // required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("State Budget Amount is required")}.
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
                      <option value="">
                        {t("Select District")}
                      </option>
                      {districtListData && districtListData.length ?
                      districtListData.map((list) => (
                        <option key={list.districtId} value={list.districtId}>
                          {list.districtName}
                        </option>
                      ))
                      :""}
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
                        {t("Taluk")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="talukId"
                          value={editData.talukId}
                          onChange={handleEditInputs}
                          onBlur={() => handleEditInputs}
                          required
                          disabled
                          isInvalid={
                            editData.talukId === undefined ||
                            editData.talukId === "0"
                          }
                        >
                          <option value="">{t("Select Taluk")}</option>
                          {talukListData && talukListData.length ?
                          talukListData.map((list) => (
                            <option
                              key={list.talukId}
                              value={list.talukId}
                            >
                              {list.talukName}
                            </option>
                          ))
                          : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("Taluk is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

              <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("TSC")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="tscMasterId"
                        value={editData.tscMasterId}
                        onChange={handleEditInputs}
                        onBlur={() => handleEditInputs}
                        required
                        disabled
                        isInvalid={
                          editData.tscMasterId === undefined ||
                          editData.tscMasterId === "0"
                        }
                      >
                        <option value="">{t("Select TSC")}</option>
                        {tscListData && tscListData.length ?
                        tscListData.map((list) => (
                          <option key={list.tscMasterId} value={list.tscMasterId}>
                            {list.name}
                          </option>
                        ))
                        : ""}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("TSC is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

              {/* <Col lg="6">
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
                      <option value="">
                        {t("Select Target Type")}
                      </option>
                      <option value="Physical Target">Physical Target</option>
                      <option value="Financial Target">Financial Target</option>
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
                      <option value="">
                        {t("Select Month")}
                      </option>
                      <option value="JANUARY">January</option>
                      <option value="FEBRUARY">February</option>
                      <option value="MARCH">March</option>
                      <option value="APRIL">April</option>
                      <option value="MAY">May</option>
                      <option value="JUNE">June</option>
                      <option value="JULY">July</option>
                      <option value="AUGUST">August</option>
                      <option value="SEPTEMBER">September</option>
                      <option value="OCTOBER">October</option>
                      <option value="NOVEMBER">November</option>
                      <option value="DECEMBER">December</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Month is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col> */}

              <Col lg="1">
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
                    required
                    // readOnly
                  />
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
                      {t("Target No. is required")}.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="institution">
                    {t("Institute")}
                    {/* <span className="text-danger">*</span> */}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="institution"
                      name="institution"
                      value={editData.institution}
                      onChange={handleEditInputs}
                      type="text"
                      placeholder={t("Enter Institute")}
                      // required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Target No. is required")}.
                    </Form.Control.Feedback>
                  </div>
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
                data={displayListFinancial}
                highlightOnHover
                pagination
                paginationServer
                paginationTotalRows={totalRowsViewFinancial}
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
                  {!toggleButton ? "Show" : "Hide"} {t("Hierarchical Assigned Targets")}
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
                  onChangePage={(page) => setPage3(page - 1)}
                  progressPending={loading}
                  theme="solarized"
                  customStyles={customStyles}
                />
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
                      <option value="">
                        {t("Select District")}
                      </option>
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
                      <option value="">
                        {t("Select Taluk")}
                      </option>
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
                      <option value="">
                        {t("Select Designation")}
                      </option>
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
                    <option value="">
                      {t("Select User")}
                    </option>
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
                      <option value="">
                        {t("No Users Found")}
                      </option> // Show a message if no users are found
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
                  <Modal.Title>{t('Select User In Edit')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Block className="mt-n4">
                    <Card className="mt-3 p-4 shadow-lg rounded">
                      <Row className="g-4">
                        {/* District Input */}
                        <Col sm={4}>
                          <Form.Group className="form-group">
                            <Form.Label>{t('District')}</Form.Label>
                            <Form.Select
                              name="districtId"
                              value={searchDataEdit.districtId}
                              onChange={handleSearchInputsEdit}
                              className="form-control"
                            >
                              <option value="">{t('Select District')}</option>
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
                            <Form.Label>{t('Taluk')}</Form.Label>
                            <Form.Select
                              name="talukId"
                              value={searchDataEdit.talukId}
                              onChange={handleSearchInputsEdit}
                              className="form-control"
                            >
                              <option value="">{t('Select Taluk')}</option>
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
                            <Form.Label>{t('Designation')}</Form.Label>
                            <Form.Select
                              name="designationId"
                              value={searchDataEdit.designationId}
                              onChange={handleSearchInputsEdit}
                              className="form-control"
                            >
                              <option value="">{t('Select Designation')}</option>
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
                            <Form.Label>{t('Mobile Number')}</Form.Label>
                            <Form.Control
                              id="phoneNumber"
                              name="phoneNumber"
                              value={searchDataEdit.phoneNumber}
                              onChange={handleSearchInputsEdit}
                              type="text"
                              placeholder={t('Enter Mobile Number')}
                              className="form-control"
                            />
                          </Form.Group>
                        </Col>
        
                        {/* Username Input */}
                        <Col sm={4}>
                          <Form.Group className="form-group">
                            <Form.Label>{t('User Name')}</Form.Label>
                            <Form.Control
                              id="username"
                              name="username"
                              value={searchDataEdit.username}
                              onChange={handleSearchInputsEdit}
                              type="text"
                              placeholder={t('Enter User Name')}
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
                            {t('Search')}
                          </Button>
                        </Col>
                      </Row>
        
                      {/* User Selection */}
                      <Row className="m-4">
                        <Col sm={12}>
                          <Form.Label>{t('User')}</Form.Label>
                          <Form.Select
                            name="userMasterId"
                            value={searchDataEdit.userMasterId}
                            onChange={(e) => handleUserEditSelect(e.target.value)}
                            className="form-control"
                          >
                            <option value="">{t('Select User')}</option>
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
                              <option value="">{t('No Users Found')}</option> // Show a message if no users are found
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row>
                        <div className="gap-col d-flex justify-content-center">
                          <Button variant="primary" onClick={() => handleCloseModal7()}>
                            {t('Submit')}
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

export default SchemeAchievement;
