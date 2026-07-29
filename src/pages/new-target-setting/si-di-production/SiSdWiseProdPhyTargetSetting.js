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
import { useTranslation } from "react-i18next";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function SiSdWiseProdPhyTargetSetting() {
  const { t } = useTranslation();
  const [data, setData] = useState({
    mulberryTargetTypeId: "",
    financialYearMasterId: "",
    districtId: "",
    talukId: "",
    clusterId: "",
    megaClusterId: "",
    month: "",
    targetType: "",
    value: "",
    raceMasterId: "",
    tscMasterId: "",
    userMasterId: "",
  });

  const [districtWiseProductionMonth,setDistrictWiseProductionMonth] = useState({
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
   
     const handleDistrictWiseProductionMonth = (e) => {
       const { name, value } = e.target;
       setDistrictWiseProductionMonth(prev => ({
         ...prev,
         [name]: value
       }));
     };
 
     // To get all month targets for Grainage
 const getAllMonthTarget = () => {
   api
     .post(
       baseURLTargetSetting +
         `productionTargets/getDistrictWiseProductionSISDRecords?financialYearId=${data.financialYearMasterId}&mulberryTargetTypeId=${data.mulberryTargetTypeId}&districtId=${data.districtId}&raceMasterId=${data.raceMasterId}&tscMasterId=${data.tscMasterId}`)
     .then((response) => {
       const monthDataList = response.data.districtWiseProductionMonth; // assuming backend sends districtWiseProductionMonth like districtWiseProductionMonth
 
       if (monthDataList && monthDataList.length > 0) {
         const monthData = monthDataList[0]; // assuming 1 record per call
         setDistrictWiseProductionMonth({
           april: monthData.april,
           may: monthData.may,
           june: monthData.june,
           july: monthData.july,
           august: monthData.august,
           september: monthData.september,
           october: monthData.october,
           november: monthData.november,
           december: monthData.december,
           january: monthData.january,
           february: monthData.february,
           march: monthData.march,
         });
       } else {
         // Initialize empty values
         setDistrictWiseProductionMonth({
           april: "",
           may: "",
           june: "",
           july: "",
           august: "",
           september: "",
           october: "",
           november: "",
           december: "",
           january: "",
           february: "",
           march: "",
         });
       }
     })
     .catch((err) => {
       console.error("Failed to fetch grainage month targets", err);
     });
 };
 
 useEffect(() => {
  if (
    data.financialYearMasterId &&
    data.mulberryTargetTypeId &&
    data.districtId &&
    data.raceMasterId &&
    data.tscMasterId
  ) {
    getAllMonthTarget();
  }
}, [
  data.financialYearMasterId,
  data.mulberryTargetTypeId,
  data.districtId,
  data.raceMasterId,
  data.tscMasterId,
]);

  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [showModal4, setShowModal4] = useState(false);
const [showModal6, setShowModal6] = useState(false);
const [pageReportee, setPageReportee] = useState(0);
const [pageNormal, setPageNormal] = useState(0);
const [listViewReporteesTargetData, setViewReporteesTargetListData] = useState([]);
const [listViewTargetData, setViewTargetListData] = useState([]);

  const [validatedAllDateEdit, setValidatedAllDateEdit] = useState(false);

  const [showModal3, setShowModal3] = useState(false);

  const [showModal7, setShowModal7] = useState(false);

  const handleCloseModal7 = () => {
    setShowModal7(false);
    userSearchEditClear();
  };

  const handleShowModal3 = () => setShowModal3(true);
  const handleCloseModal3 = () => setShowModal3(false);

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


    const [message, setMessage] = useState("");
    const getMulberryTargetTypeLists = (mulberryId) => {
      const response = api
        .get(baseURLMasterData + `mulberryTargetType/get/${mulberryId}`)
        .then((response) => {
          // setMulberryTargetTypeData(response.data.content.mulberryTargetType);
          setMessage(response.data.content.unit)
        })
        .catch((err) => {
          // setMulberryTargetTypeData([]);
        });
    };
  
    useEffect(() => {
      if(data.mulberryTargetTypeId){
        getMulberryTargetTypeLists(data.mulberryTargetTypeId)
      }
    }, [data.mulberryTargetTypeId]);

  // get List

  const getList = () => {
    setLoading(true);
    api
      .get(baseURLTargetSetting + `productionTargets/list-sisd-join`, _params)
      .then((response) => {
        setListData(response.data.content.body.content.productionTarget);
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
    tscMasterId: "",
    userMasterId: "",
  });

  // const handleEdit = (productionTargetsId) => {
  //   setLoading(true);
  //   const response = api
  //     .get(
  //       baseURLTargetSetting +
  //         `productionTargets/get-sisd/${productionTargetsId}`
  //     )
  //     .then((response) => {
  //       setEditData(response.data.content);
  //       setUserNameEdit(
  //         response.data.content.userMasterName
  //       );
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
  const handleEdit = (productionTargetsId) => {
    setLoading(true);
    const response = api
      .get(baseURLTargetSetting + `productionTargets/get-by-id?id=${productionTargetsId}`)
      .then((response) => {
        setEditData(response.data.content.body.content.productionTargets);
        setUserNameEdit(
          response.data.content.body.content.productionTargets.userMasterName
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
      .get(baseURLMasterData + `mulberryTargetType/get-by-required-false`)
      .then((response) => {
         setMulberryTargetTypeData(response.data.mulberryTargetType);
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

  // to get Mega Cluster
  const [megaClusterListData, setMegaClusterListData] = useState([]);

  const getMegaClusterList = () => {
    api
      .get(baseURLTargetSetting + `megaCluster/get-all`)
      .then((response) => {
        setMegaClusterListData(response.data.content.megaCluster);
      })
      .catch((err) => {
        setMegaClusterListData([]);
      });
  };

  useEffect(() => {
    getMegaClusterList();
  }, []);

  // to get Cluster
  const [clusterListData, setClusterListData] = useState([]);

  const getClusterList = () => {
    api
      .get(baseURLTargetSetting + `cluster/get-all`)
      .then((response) => {
        setClusterListData(response.data.content.cluster);
      })
      .catch((err) => {
        setClusterListData([]);
      });
  };

  useEffect(() => {
    getClusterList();
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

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  //   To get user by TSC
  const [userListData, setUserListData] = useState([]);
  const getUserListByTsc = (tscId) => {
    console.log("tsc", tscId);
    api
      .get(baseURLMasterData + `userMaster/get-by-tsc-master-id/${tscId}`)
      .then((response) => {
        setUserListData(response.data.content.userMaster);
      })
      .catch((err) => {
        setUserListData([]);
      });
  };

  useEffect(() => {
    if (data.tscMasterId) {
      getUserListByTsc(data.tscMasterId);
    }
  }, [data.tscMasterId]);

  useEffect(() => {
    if (editData.tscMasterId) {
      getUserListByTsc(editData.tscMasterId);
    }
  }, [editData.tscMasterId]);

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
      const {talukId,...rest} = data;
      api
        .post(
          baseURLTargetSetting + `productionTargets/saveSISDProductionTargets`,
          {...rest,districtWiseProductionMonth:[districtWiseProductionMonth]}
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
          baseURLTargetSetting + `productionTargets/editSISDProductionTargets`,
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

  const editClear = () => {
    setEditData({
      mulberryTargetTypeId: "",
      financialYearMasterId: "",
      districtId: "",
      talukId: "",
      month: "",
      targetType: "",
      value: "",
      raceMasterId: "",
      tscMasterId: "",
      userMasterId: "",
    });
    
    getFinancialDefaultDetails();
    setValidatedAllDateEdit(false);
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
          .delete(baseURLTargetSetting + `productionTargets/delete-sisd/${_id}`)
          .then((response) => {
            // deleteConfirm(_id);
            // getFinancialYearList();
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
            onClick={() => handleEdit(row.productionTargetsId)}
          >
            {t("Edit")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.productionTargetsId)}
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
      name: t("TSC"),
      selector: (row) => row.tscMasterName,
      cell: (row) => <span>{row.tscMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Race"),
      selector: (row) => row.raceMasterName,
      cell: (row) => <span>{row.raceMasterName}</span>,
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
      clusterId: "",
      megaClusterId: "",
      month: "",
      targetType: "",
      value: "",
      raceMasterId: "",
      tscMasterId: "",
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

  // const [showModal6, setShowModal6] = useState(false);

  // const handleShowModal6 = () => setShowModal6(true);
  // const handleCloseModal6 = () => setShowModal6(false);

  // const [listViewReporteesTargetData, setViewReporteesTargetListData] =
  //   useState({});

  const searchReportee = (event) => {
    const { financialYearMasterId, mulberryTargetTypeId } = data;

    // if (!financialYearMasterId || financialYearMasterId === "0") {
    //   Swal.fire({
    //     icon: "error",
    //     title: t("Validation Error"),
    //     text: t("Financial Year is required."),
    //   });
    //   return;
    // }

    // if (!mulberryTargetTypeId || mulberryTargetTypeId === "0") {
    //   Swal.fire({
    //     icon: "error",
    //     title: t("Validation Error"),
    //     text: t("Target is required."),
    //   });
    //   return;
    // }

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
    //     icon: "error",
    //     title: "Validation Error",
    //     text: "Target Type is required.",
    //   });
    //   return;
    // }

    // Proceed with API call if validations pass
    api
      .post(
        baseURLTargetSetting +
          `productionTargets/viewHierarchyProductionDetails`,
        {},
        {
          params: {
            financialYearMasterId,
            mulberryTargetTypeId,
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setViewReporteesTargetListData(response.data.content);
        setTotalRows(response.data.totalRecords);
        setShowModal6(true);
      })
      .catch((err) => {
        setViewReporteesTargetListData([]);
      });
  };

  const ViewTargetReporteeDataColumns = [
    {
      name: t("Serial Number"),
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
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
      name: t("Target"),
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
      name: t("Race"),
      selector: (row) => row.raceMasterName,
      cell: (row) => <span>{row.raceMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Target Type",
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
      name: t("Target No"),
      selector: (row) => row.value,
      cell: (row) => <span>{row.value}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("User"),
      selector: (row) => row.userMasterName,
      cell: (row) => <span>{row.userMasterName}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  // const [showModal4, setShowModal4] = useState(false);

  // const handleShowModal4 = () => setShowModal4(true);
  // const handleCloseModal4 = () => setShowModal4(false);

  // const [listViewTargetData, setViewTargetListData] = useState({});

  const search = (event) => {
    const { financialYearMasterId, mulberryTargetTypeId } = data;

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
    //     icon: "error",
    //     title: "Validation Error",
    //     text: "Target Type is required.",
    //   });
    //   return;
    // }

    // Proceed with API call if validations pass
    api
      .post(
        baseURLTargetSetting + `productionTargets/viewProductionDetails`,
        {},
        {
          params: {
            financialYearMasterId,
            mulberryTargetTypeId,
            // targetType,
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
  };

  // 🔄 For Reportee Modal
useEffect(() => {
  if (showModal6) {
    setLoading(true);
    api
      .post(
        baseURLTargetSetting + `productionTargets/viewHierarchyProductionDetails`,
        {},
        {
          params: {
            financialYearMasterId: data.financialYearMasterId,
            mulberryTargetTypeId: data.mulberryTargetTypeId,
            pageNumber: pageReportee,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setViewReporteesTargetListData(response.data.content || []);
        setTotalRows(response.data.totalRecords || 0);
        setLoading(false);
      })
      .catch(() => {
        setViewReporteesTargetListData([]);
        setLoading(false);
      });
  }
}, [pageReportee, showModal6, data.financialYearMasterId, data.mulberryTargetTypeId]);

// 🔄 For Normal Modal
useEffect(() => {
  if (showModal4) {
    setLoading(true);
    api
      .post(
        baseURLTargetSetting + `productionTargets/viewProductionDetails`,
        {},
        {
          params: {
            financialYearMasterId: data.financialYearMasterId,
            mulberryTargetTypeId: data.mulberryTargetTypeId,
            pageNumber: pageNormal,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setViewTargetListData(response.data.content || []);
        setTotalRows(response.data.totalRecords || 0);
        setLoading(false);
      })
      .catch(() => {
        setViewTargetListData([]);
        setLoading(false);
      });
  }
}, [pageNormal, showModal4, data.financialYearMasterId, data.mulberryTargetTypeId]);


// const [showModal4, setShowModal4] = useState(false);
// const [showModal6, setShowModal6] = useState(false);

// ✅ Use this: Resets page number before showing modal
const handleShowModal4 = () => {
  setPageNormal(0);      // reset normal pagination to page 0
  setShowModal4(true);   // open modal
};

const handleCloseModal4 = () => {
  setShowModal4(false);
};

const handleShowModal6 = () => {
  setPageReportee(0);    // reset reportee pagination to page 0
  setShowModal6(true);   // open modal
};

const handleCloseModal6 = () => {
  setShowModal6(false);
};

useEffect(() => {
  if (showModal6) {
    // your logic
  }
}, [pageReportee, showModal6, data.financialYearMasterId, data.mulberryTargetTypeId]);

// const [showModal4, setShowModal4] = useState(false);
// const [showModal6, setShowModal6] = useState(false);

// ✅ Now it's safe to use these in useEffect
useEffect(() => {
  if (showModal6) {
    // logic here
  }
}, [showModal6]);

useEffect(() => {
  if (showModal4) {
    // logic here
  }
}, [showModal4]);


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
    },
    {
      name: t("Target"),
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
      name: t("Race"),
      selector: (row) => row.raceMasterName,
      cell: (row) => <span>{row.raceMasterName}</span>,
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
      name: t("Target No"),
      selector: (row) => row.value,
      cell: (row) => <span>{row.value}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("User"),
      selector: (row) => row.userMasterName,
      cell: (row) => <span>{row.userMasterName}</span>,
      sortable: true,
      hide: "md",
    },
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

  const [viewTotalTargetsData, setViewTotalTargetsData] = useState({});

  const totalTarget = (event) => {
    const { districtId,mulberryTargetTypeId, tscMasterId,financialYearMasterId,raceMasterId} = data;

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

    if (!raceMasterId || raceMasterId === "0") {
          Swal.fire({
            icon: "warning",
            title: "Please select Race",
            text: "Please try again!",
          });
          return;
        }
        if (!tscMasterId || tscMasterId === "0") {
          Swal.fire({
            icon: "warning",
            title: "Please select Tsc",
            text: "Please try again!",
          });
          return;
        }

    // Proceed with API call if validations pass
    api
      .post(
        baseURLTargetSetting + `productionTargets/getTargetDetailsForSISDForProduction`,
        {},
        {
          params: {
            districtId,
            mulberryTargetTypeId,
            financialYearMasterId,
            tscMasterId,
            raceMasterId,
          },
        }
      )
      .then((response) => {
        setViewTotalTargetsData(response.data);
        // setTotalRows(response.data.totalRecords);
        // setShowModal4(true);
      })
      .catch((err) => {
        setViewTotalTargetsData([]);
      });
  };

  const [viewMonthlyTargetsData, setViewMonthlyTargetsData] = useState({});

  const monthlyTarget = (event) => {
    const { districtId,mulberryTargetTypeId, raceMasterId,tscMasterId,financialYearMasterId,month} = data;

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

    if (!raceMasterId || raceMasterId === "0") {
         Swal.fire({
           icon: "warning",
           title: "Please select Race",
           text: "Please try again!",
         });
         return;
       }
   
        if (!tscMasterId || tscMasterId === "0") {
             Swal.fire({
               icon: "warning",
               title: "Please select TSC",
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
        baseURLTargetSetting + `productionTargets/getMonthlyTargetDetailsForSISDForProduction`,
        {},
        {
          params: {
            districtId,
            mulberryTargetTypeId,
            financialYearMasterId,
            tscMasterId,
            month,
            raceMasterId,
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

  


  const [searchData, setSearchData] = useState({
    districtId: "",
    talukId: "",
    designationId: "",
    // villageId: "",
    phoneNumber: "",
    username: "",
    userMasterId: "",
  });

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

  

  const handleSearchInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  const [showModal5, setShowModal5] = useState(false);

  const handleShowModal5 = () => setShowModal5(true);
  const handleCloseModal5 = () => setShowModal5(false);

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

  
  
  const [searchDataEdit, setSearchDataEdit] = useState({
    districtId: "",
    talukId: "",
    designationId: "",
    // villageId: "",
    phoneNumber: "",
    username: "",
    userMasterId: "",
  });

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

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: t("Saved successfully"),
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
      title: t("Save attempt was not successful"),
      html: errorMessage,
    });
  };
  return (
    <Layout title={t("Range Wise Physical Target Setting")}>
      <style>{siSdWiseProdPhyTargetSettingStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Range Wise Physical Target Setting")}
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
                      <span>{t("Range wise Physical Target Setting")}</span>
                    </Card.Header>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'flex-start' }}>
                        {/* Annual Targets Section */}
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                          <Button variant="primary" onClick={totalTarget}>
                            {t('Annual Targets')}
                          </Button>
                          <table
                            className="table table-bordered table-striped"
                            style={{ ...styles.table, width: '600px' }}
                          >
                            <thead>
                              <tr>
                              <th style={styles.ctstyle}>{t("Range Annual Targets")}</th>
                              <th style={styles.ctstyle}>{t("TSC Annual Targets")}</th>
                              <th style={styles.ctstyle}>{t("Remaining Targets")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {viewTotalTargetsData.length > 0 ? (
                                <tr>
                                <td>{viewTotalTargetsData[0].sisdValue || "N/A"}</td>
                                <td>{viewTotalTargetsData[0].tscValue || "N/A"}</td>
                                <td>{viewTotalTargetsData[0].remainingValue || "N/A"}</td>
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
                                <option value="">{t("Select Target Type")}</option>
                                {mulberryTargetTypeData && mulberryTargetTypeData.length
                                ?mulberryTargetTypeData.map((list) => (
                                  <option
                                    key={list.mulberryTargetTypeId}
                                    value={list.mulberryTargetTypeId}
                                  >
                                    {list.mulberryTargetTypeName}
                                  </option>
                                ))
                                :""}
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
                                {districtListData && districtListData.length
                                ?districtListData.map((list) => (
                                  <option
                                    key={list.districtId}
                                    value={list.districtId}
                                  >
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
                              {t("Mega Cluster")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="megaClusterId"
                                value={data.megaClusterId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                              >
                                <option value="">{t("Select Mega Cluster")}</option>
                                {megaClusterListData && megaClusterListData.length
                                ?megaClusterListData.map((list) => (
                                  <option
                                    key={list.megaClusterId}
                                    value={list.megaClusterId}
                                  >
                                    {list.name}
                                  </option>
                                ))
                                : ""}
                              </Form.Select>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("Cluster")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="clusterId"
                                value={data.clusterId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                              >
                                <option value="">{t("Select Cluster")}</option>
                                {clusterListData && clusterListData.length
                                ?clusterListData.map((list) => (
                                  <option
                                    key={list.clusterId}
                                    value={list.clusterId}
                                  >
                                    {list.name}
                                  </option>
                                ))
                                : ""}
                              </Form.Select>
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
                                // isInvalid={
                                //   data.talukId === undefined ||
                                //   data.talukId === "0"
                                // }
                              >
                                <option value="">{t("Select Taluk")}</option>
                                {talukListData && talukListData.length?
                                  talukListData.map((list) => (
                                  <option
                                    key={list.talukId}
                                    value={list.talukId}
                                  >
                                    {list.talukName}
                                  </option>
                                ))
                                :""}
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
                              {t("TSC")}
                              <span className="text-danger">*</span>
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
                                {tscListData && talukListData.length?
                                tscListData.map((list) => (
                                  <option
                                    key={list.tscMasterId}
                                    value={list.tscMasterId}
                                  >
                                    {list.name}
                                  </option>
                                ))
                                :""}
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

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
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
                                  {raceListData && raceListData.length?
                                  raceListData.map((list) => (
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

                        <Col lg="1">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("User")}<span className="text-danger">*</span>
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
                         {message?(<p className="mt-n2 mb-4 bold">Please enter the below field {message}</p>):""}
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="value">
                                {t("April")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="april"
                                  name="april"
                                  value={districtWiseProductionMonth.april}
                                  onChange={handleDistrictWiseProductionMonth}
                                  type="text"
                                  placeholder={t("Enter Target No.")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Target No. is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
  
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="value">
                                {t("May")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="may"
                                  name="may"
                                  value={districtWiseProductionMonth.may}
                                  onChange={handleDistrictWiseProductionMonth}
                                  type="text"
                                  placeholder={t("Enter Target No.")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Target No. is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
  
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="value">
                                {t("June")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="june"
                                  name="june"
                                  value={districtWiseProductionMonth.june}
                                  onChange={handleDistrictWiseProductionMonth}
                                  type="text"
                                  placeholder={t("Enter Target No.")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Target No. is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
  
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="value">
                                {t("July")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="july"
                                  name="july"
                                  value={districtWiseProductionMonth.july}
                                  onChange={handleDistrictWiseProductionMonth}
                                  type="text"
                                  placeholder={t("Enter Target No.")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Target No. is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
  
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="value">
                                {t("August")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="august"
                                  name="august"
                                  value={districtWiseProductionMonth.august}
                                  onChange={handleDistrictWiseProductionMonth}
                                  type="text"
                                  placeholder={t("Enter Target No.")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Target No. is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="value">
                                {t("September")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="september"
                                  name="september"
                                  value={districtWiseProductionMonth.september}
                                  onChange={handleDistrictWiseProductionMonth}
                                  type="text"
                                  placeholder={t("Enter Target No.")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Target No. is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="value">
                                {t("October")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="october"
                                  name="october"
                                  value={districtWiseProductionMonth.october}
                                  onChange={handleDistrictWiseProductionMonth}
                                  type="text"
                                  placeholder={t("Enter Target No.")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Target No. is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="value">
                                {t("November")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="november"
                                  name="november"
                                  value={districtWiseProductionMonth.november}
                                  onChange={handleDistrictWiseProductionMonth}
                                  type="text"
                                  placeholder={t("Enter Target No.")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Target No. is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="value">
                                {t("December")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="december"
                                  name="december"
                                  value={districtWiseProductionMonth.december}
                                  onChange={handleDistrictWiseProductionMonth}
                                  type="text"
                                  placeholder={t("Enter Target No.")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Target No. is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="value">
                                {t("January")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="january"
                                  name="january"
                                  value={districtWiseProductionMonth.january}
                                  onChange={handleDistrictWiseProductionMonth}
                                  type="text"
                                  placeholder={t("Enter Target No.")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Target No. is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="value">
                                {t("Febrauary")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="february"
                                  name="february"
                                  value={districtWiseProductionMonth.february}
                                  onChange={handleDistrictWiseProductionMonth}
                                  type="text"
                                  placeholder={t("Enter Target No.")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Target No. is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
  
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="value">
                                {t("March")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="march"
                                  name="march"
                                  value={districtWiseProductionMonth.march}
                                  onChange={handleDistrictWiseProductionMonth}
                                  type="text"
                                  placeholder={t("Enter Target No.")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Target No. is required")}
                                </Form.Control.Feedback>
                              </div>
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
                  {t("Available Budget Balance")}
                </Card.Header>
                <Card.Body>
                  <table className="table small table-bordered">
                    <tbody>
                      <tr>
                        <td style={styles.ctstyle}> {t("Balance Amount")}:</td>
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
            <span>{t("Range wise Physical Target Setting")}</span>
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
                      {financialyearListData && financialyearListData.length?
                        financialyearListData.map((list) => (
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
                      <option value="">{t("Select Target Type")}</option>
                      {mulberryTargetTypeData && mulberryTargetTypeData?
                      mulberryTargetTypeData.map((list) => (
                        <option
                          key={list.mulberryTargetTypeId}
                          value={list.mulberryTargetTypeId}
                        >
                          {list.mulberryTargetTypeName}
                        </option>
                      ))
                      :""}
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
                      //   data.districtId === undefined ||
                      //   data.districtId === "0"
                      // }
                    >
                      <option value="">{t("Select District")}</option>
                      {districtListData && districtListData.length
                      ?districtListData.map((list) => (
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
                      // isInvalid={
                      //   data.districtId === undefined ||
                      //   data.districtId === "0"
                      // }
                    >
                      <option value="">{t("Select Taluk")}</option>
                      {talukListData && talukListData.length
                      ?talukListData.map((list) => (
                        <option key={list.talukId} value={list.talukId}>
                          {list.talukName}
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
                      {tscListData && tscListData.length?
                      tscListData.map((list) => (
                        <option key={list.tscMasterId} value={list.tscMasterId}>
                          {list.name}
                        </option>
                      ))
                      :""}
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
                        {raceListData && raceListData.length
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

              {/* <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              Target Type<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="targetType"
                                value={data.targetType}
                                onChange={handleEditInputs}
                                onBlur={() => handleEditInputs}
                                required
                              >
                                <option value="">Select Target Type</option>
                                <option value="NAREGA">NAREGA</option>
                                <option value="NON NAREGA">NON NAREGA</option>
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Target Type is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

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

      <Modal show={showModal6} onHide={handleCloseModal6} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="users" />
            <span>{t("All Reportee Details")}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DataTable
  tableClassName="data-table-head-light table-responsive"
  columns={ViewTargetReporteeDataColumns}
  data={listViewReporteesTargetData}
  highlightOnHover
  pagination
  paginationServer
  paginationTotalRows={totalRows}
  paginationPerPage={countPerPage}
  paginationComponentOptions={{ noRowsPerPage: true }}
  onChangePage={(page) => setPageReportee(page - 1)} // ⬅️ updated
  progressPending={loading}
  theme="solarized"
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
  paginationTotalRows={totalRows}
  paginationPerPage={countPerPage}
  paginationComponentOptions={{ noRowsPerPage: true }}
  onChangePage={(page) => setPageNormal(page - 1)} // ⬅️ updated
  progressPending={loading}
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

const siSdWiseProdPhyTargetSettingStyles = `
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
    font-size: 15px !important;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
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

export default SiSdWiseProdPhyTargetSetting;
