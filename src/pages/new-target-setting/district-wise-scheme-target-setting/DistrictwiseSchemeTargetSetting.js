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
import { useTranslation } from "react-i18next"; // Import useTranslation
// import axios from "axios";
import api from "../../../services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function DistrictwiseSchemeTargetSetting() {
  const { t } = useTranslation(); // Initialize useTranslation
  const [data, setData] = useState({
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
   .post(baseURLTargetSetting + `schemeTargets/getSchemeRecords?financialYearId=${data.financialYearMasterId}&scSchemeDetailsId=${data.scSchemeDetailsId}&scSubSchemeDetailsId=${data.scSubSchemeDetailsId}&scComponentId=${data.scComponentId}&scCategoryId=${data.scCategoryId}&scHeadAccountId=${data.scHeadAccountId}&districtId=${data.districtId}`)
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
 if(data.financialYearMasterId && data.scSchemeDetailsId && data.scSubSchemeDetailsId && data.scComponentId && data.scCategoryId && data.scHeadAccountId && data.districtId){
   getAllMonthTarget();
 }
}, [data.financialYearMasterId && data.scSchemeDetailsId && data.scSubSchemeDetailsId && data.scComponentId && data.scCategoryId && data.scHeadAccountId && data.districtId]);

  const [searchData, setSearchData] = useState({
    districtId: "",
    talukId: "",
    designationId: "",
    // villageId: "",
    phoneNumber: "",
    username: "",
    userMasterId: "",
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


  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal7, setShowModal7] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal3 = () => setShowModal3(true);


  const handleCloseModal3 = () => { 
    setShowModal3(false);
  userSearchEditClear();
};

const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => {
    setShowModal2(false);
    userSearchClear();
  };

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
          parameters2
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
      .get(baseURLTargetSetting + `schemeTargets/list-scheme-join`, _params)
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

  // const handleEdit = (schemeTargetsId) => {
  //   setLoading(true);
  //   const response = api
  //     .get(baseURLTargetSetting + `schemeTargets/get-scheme/${schemeTargetsId}`)
  //     .then((response) => {
  //       setEditData(response.data.content);
  //       setShowModal3(true);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       // const message = err.response.data.errorMessages[0].message[0].message;
  //       setEditData({});
  //       // editError(message);
  //       setLoading(false);
  //     });
  // };
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

  const [searchDataEdit, setSearchDataEdit] = useState({
    districtId: "",
    talukId: "",
    designationId: "",
    // villageId: "",
    phoneNumber: "",
    username: "",
    userMasterId: "",
  });
  //   to get data from api
  const [userName,setUserName] = useState("");
  const [userNameEdit, setUserNameEdit] = useState("");
  const getIdList = (id) => {
    setLoading(true);
     api
      .get(baseURLMasterData + `userMaster/get/${id}`)
      .then((response) => {
        console.log("heheheeh",response.data.content.username)
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
    if(searchData.userMasterId){
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

  console.log(userName);

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
          baseURLTargetSetting + `schemeTargets/editDistrictSchemeTargets`,
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

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const warning = () => {
    Swal.fire({
      icon: "warning",
      title: "Please select financial year and scheme",
      text: "Please try again!",
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
          .delete(baseURLTargetSetting + `schemeTargets/delete-scheme/${_id}`)
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

    // {
    //   name: t("Target Type"),
    //   selector: (row) => row.targetType,
    //   cell: (row) => <span>{row.targetType}</span>,
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
  ];

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
          baseURLTargetSetting + `schemeTargets/saveDistrictSchemeTargets`,
          {...data,physicalTargetMonths:[physicalTargetMonths],financialTargetMonths:[financialTargetMonths]}
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

  const [viewTotalTargetsDataPhysical, setViewTotalTargetsDataPhysical] = useState({});
  const [viewTotalTargetsDataFinancial, setViewTotalTargetsDataFinancial] = useState({});


  const totalTarget = (event) => {
    const { financialYearMasterId,scSchemeDetailsId,scSubSchemeDetailsId,scComponentId,scCategoryId,scHeadAccountId,districtId,targetType,month} = data;

    
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
        baseURLTargetSetting + `schemeTargets/getMonthlyTargetDetailsForScheme`,
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
    <Layout title={t("District Wise Target Setting for Subsidies")}>
      <style>{districtwiseSchemeTargetSettingStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("District Wise Target Setting for Subsidies")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                {/* <li>
                  <Link
                    to="/seriui/Budget-list"
                    className="btn btn-primary btn-md d-md-none"
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go to List</span>
                  </Link>
                </li> */}
                <li>
                  {/* <Link
                    to="/seriui/Budget-list"
                    className="btn btn-primary d-none d-md-inline-flex"
                  >
                    <Icon name="arrow-long-left" />
                    <span>View</span>
                  </Link> */}
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
            </Block.HeadContent>
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
                      <span>{t("District Wise Target Setting for Subsidies")}</span>
                    </Card.Header>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "20px",
                        alignItems: "flex-start",
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
                                {t("Scheme Yearly Targets (PHYSICAL TARGET)")}:{" "}
                                {viewTotalTargetsDataPhysical[0]?.yearlySchemeValue ||
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
                                {t("Scheme Yearly Targets (FINANCIAL TARGET)")}:{" "}
                                {viewTotalTargetsDataFinancial[0]?.yearlySchemeValue ||
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
                                {t("Total Scheme Yearly Targets")}:{" "}
                                {!isNaN(parseFloat(viewTotalTargetsDataFinancial[0]?.yearlySchemeValue)) && !isNaN(parseFloat(viewTotalTargetsDataPhysical[0]?.yearlySchemeValue)) ? ((parseFloat(viewTotalTargetsDataFinancial[0]?.yearlySchemeValue))+(parseFloat(viewTotalTargetsDataPhysical[0]?.yearlySchemeValue))).toFixed(2):"N/A" ||
                                  "N/A"}
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
                                <option value="">{t("Select Scheme Names")}</option>
                                {scSchemeDetailsListData &&
                                  scSchemeDetailsListData.length ? scSchemeDetailsListData.map((list) => (
                                    <option
                                      key={list.scSchemeDetailsId}
                                      value={list.scSchemeDetailsId}
                                    >
                                      {list.schemeName}
                                    </option>
                                  ))
                                  :""}
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
                                <option value="">{t("Select Component Type")}</option>
                                {scSubSchemeDetailsListData &&
                                  scSubSchemeDetailsListData.length ? scSubSchemeDetailsListData.map((list, i) => (
                                    <option key={i} value={list.subSchemeId}>
                                      {list.subSchemeName}
                                    </option>
                                  ))
                                  : ""}
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
                                <option value="">{t("Select Component")}</option>
                                {scComponentListData &&
                                  scComponentListData.length ? scComponentListData.map((list) => (
                                    <option
                                      key={list.scComponentId}
                                      value={list.scComponentId}
                                    >
                                      {list.scComponentName}
                                    </option>
                                  ))
                                  : ""}
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
                                {scCategoryListData &&
                                  scCategoryListData.length ? scCategoryListData.map((list) => (
                                    <option
                                      key={list.scCategoryId}
                                      value={list.scCategoryId}
                                    >
                                      {list.codeNumber}
                                    </option>
                                  ))
                                  : ""}
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
                                <option value="">{t("Select Head of Account")}</option>
                                {scHeadAccountListData &&
                                  scHeadAccountListData.length ?
                                  scHeadAccountListData.map((list) => (
                                    <option
                                      key={list.headOfAccountId}
                                      value={list.headOfAccountId}
                                    >
                                      {list.scHeadAccountName}
                                    </option>
                                  ))
                                  :""}
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
                                {t("Central Budget Amount is required.")}
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
                                {t("State Budget Amount is required.")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("District")}<span className="text-danger">*</span>
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
                                {districtListData && districtListData.length ? 
                                districtListData.map((list) => (
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

                        {/* <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("Target Type")}<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="targetType"
                                value={data.targetType}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                // isInvalid={
                                //   data.targetType === undefined ||
                                //   data.targetType === "0"
                                // }
                              >
                                <option value="">{t("Select Target Type")}</option>
                                <option value="PHYSICAL TARGET">
                                  {t("PHYSICAL TARGET")}
                                </option>
                                <option value="FINANCIAL TARGET">
                                  {t("FINANCIAL TARGET")}
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
                              {t("Month")}<span className="text-danger">*</span>
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
                              required
                            />
                          </Form.Group>
                        </Col>

                        {/* <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label htmlFor="value">
                              {t("Target No.")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="value"
                                name="value"
                                value={data.value}
                                onChange={handleInputs}
                                type="text"
                                placeholder={t("Enter Target No.")}
                                // required
                              />
                              <Form.Control.Feedback type="invalid">
                                {t("Target No. is required.")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

                        {/* <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label htmlFor="amount">
                              Budget Amount (in Lakhs)
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="amount"
                                name="amount"
                                value={data.amount}
                                onChange={handleInputs}
                                type="text"
                                placeholder="Enter Amount"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Amount is required.
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="2">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label htmlFor="sordfl"> Date</Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.date}
                                onChange={(date) =>
                                  handleDateChange(date, "date")
                                }
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                maxDate={new Date()}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                required
                              />
                            </div>
                          </Form.Group>
                        </Col> */}
                        {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="code">Code</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="code"
                          name="code"
                          value={data.code}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Code"
                        />
                      </div>
                    </Form.Group>
                  </Col> */}
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
                          {/* </Col> */}

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
          </Col>
          
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
            <span>{t("District Wise Target Setting for Subsidies")}</span>
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
                      <option value="">{t("Select Scheme Names")}</option>
                      {scSchemeDetailsListData &&
                        scSchemeDetailsListData.length ? scSchemeDetailsListData.map((list) => (
                          <option
                            key={list.scSchemeDetailsId}
                            value={list.scSchemeDetailsId}
                          >
                            {list.schemeName}
                          </option>
                        ))
                        : ""}
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
                      <option value="">{t("Select Component Type")}</option>
                      {scSubSchemeDetailsListData &&
                        scSubSchemeDetailsListData.length ? scSubSchemeDetailsListData.map((list, i) => (
                          <option key={i} value={list.subSchemeId}>
                            {list.subSchemeName}
                          </option>
                        ))
                        : ""}
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
                      <option value="">{t("Select Component")}</option>
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
                      <option value="">{t("Select Sub Component")}</option>
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
                      <option value="">{t("Select Head of Account")}</option>
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
                      {t("Central Budget Amount is required.")}
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
                      {t("State Budget Amount is required.")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
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
                      disabled
                      // isInvalid={
                      //   editData.districtId === undefined ||
                      //   editData.districtId === "0"
                      // }
                    >
                      <option value="">{t("Select District")}</option>
                      {districtListData && districtListData.length
                      ? districtListData.map((list) => (
                        <option key={list.districtId} value={list.districtId}>
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
                    {t("Target Type")}<span className="text-danger">*</span>
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
                      <option value="PHYSICAL TARGET">PHYSICAL TARGET</option>
                      <option value="FINANCIAL TARGET">FINANCIAL TARGET</option>
                      {/* {districtListData.map((list) => (
                          <option key={list.districtId} value={list.districtId}>
                            {list.districtName}
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
                      {t("Target No. is required.")}
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
                  data={displayListHierarchyFinancial}
                  highlightOnHover
                  pagination
                  paginationServer
                  paginationTotalRows={totalRowsViewHierarchyFinancial}
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
                  <span>{t('Select User In Edit')}</span>
                </Modal.Title>
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
                          className="w-100 sh-save-btn"
                        >
                          <Icon name="search" />
                          <span>{t('Search')}</span>
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
                        <Button variant="primary" onClick={() => handleCloseModal7()} className="sh-save-btn">
                          <Icon name="check" />
                          <span>{t('Submit')}</span>
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

const districtwiseSchemeTargetSettingStyles = `
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

export default DistrictwiseSchemeTargetSetting;
