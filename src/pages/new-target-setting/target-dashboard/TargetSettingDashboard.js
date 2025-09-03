// // import { Row, Col, Card, Button, Dropdown, Table, Badge } from 'react-bootstrap';
// import {
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   Tooltip,
//   OverlayTrigger,
// } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
// // import { ChartDoughnut } from "../../../components/Chart/Charts";
// // import { ChartLegend } from "../../../components";
// import Block from "../../../components/Block/Block";
// import DataTable from "react-data-table-component";
// import { Colors } from "../../../utilities/index";
// import { useState, useEffect } from "react";

// import Layout from "../../../layout/default";
// import { useNavigate } from "react-router-dom";
// import { Icon } from "../../../components";
// import api from "../../../services/auth/api";
// import { useTranslation } from "react-i18next";

// // const baseURL2 = process.env.REACT_APP_API_BASE_URL_HELPDESK;
// const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
// const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
// const baseURLTarget = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

// // import {
// //     Image,
// //   } from '../../../components';

// function TargetSettingDashboard() {
//   const [listData, setListData] = useState({});
//   const [page, setPage] = useState(0);
//   const countPerPage = 5;
//   const [totalRows, setTotalRows] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const _params = { params: { pageNumber: page, size: countPerPage } };
//   const _header = { "Content-Type": "application/json", accept: "*/*" };

//   const styles = {
//     // backgroundColor: "#cdefff",
//     borderRadius: "3%",
//     cursor: "pointer",
//   };
//   // Translation
//   const { t } = useTranslation();
//   const rainbowColors = [
//     "#b82424",
//     "#ca8b17",
//     "#acac22",
//     "#287728",
//     "#575797",
//     "#88699f",
//     "#bf45bf",
//   ];

//   const [data, setData] = useState({
//     // text: "",
//     // searchBy: "ticketArn",
//     month: "JUNE",
//     type: "NAREGA",
//     financialYearMasterId: 3,
//   });

//   const handleInputs = (e) => {
//     // debugger;
//     let { name, value } = e.target;
//     setData({ ...data, [name]: value });
//   };

//   // const handleSearchInputs = (e) => {
//   //   // debugger;
//   //   let { name, value } = e.target;
//   //   setSchemeId({ ...schemeId, [name]: value });
//   // };
//   const handleSearchInputs = (e) => {
//     const { value } = e.target; // Destructure the selected value
//     setSchemeId(value); // Update schemeId with the selected value
//   };

//   // to get sc-scheme-details
//   const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);
//   const getList = () => {
//     api
//       .get(baseURLMasterData + `scSchemeDetails/get-all`)
//       .then((response) => {
//         setScSchemeDetailsListData(response.data.content.ScSchemeDetails);
//       })
//       .catch((err) => {
//         setScSchemeDetailsListData([]);
//       });
//   };

//   useEffect(() => {
//     getList();
//   }, []);

//   // to get dashboard data
//   const [dashboardData, setDashboardData] = useState([]);
//   const getDashboardList = () => {
//     api
//       .post(baseURLTarget + `targetsDashboard/get-dashboard`, data)
//       .then((response) => {
//         setDashboardData(response.data.content);
//       })
//       .catch((err) => {
//         setDashboardData([]);
//       });
//   };

//   useEffect(() => {
//     getDashboardList();
//   }, []);

//   // Get Default Financial Year
  
//     const getFinancialDefaultDetails = () => {
//       api
//         .get(baseURLMasterData + `financialYearMaster/get-is-default`)
//         .then((response) => {
//           setData((prev) => ({
//             ...prev,
//             financialYearMasterId: response.data.content.financialYearMasterId,
//           }));
//         })
//         .catch((err) => {
//           setData((prev) => ({
//             ...prev,
//             financialYearMasterId: "",
//           }));
//         });
//     };
  
//     useEffect(() => {
//       getFinancialDefaultDetails();
//     }, []);

//     // to get Financial Year
//       const [financialyearListData, setFinancialyearListData] = useState([]);
    
//       const getFinancialList = () => {
//          api
//           .get(baseURLMasterData + `financialYearMaster/get-all`)
//           .then((response) => {
//             setFinancialyearListData(response.data.content.financialYearMaster);
//           })
//           .catch((err) => {
//             setFinancialyearListData([]);
//           });
//       };
    
//       useEffect(() => {
//         getFinancialList();
//       }, []);

//   // console.log("dashboardData", dashboardData);

//   const [hdUserData, setHdUserData] = useState({
//     userMasterId: localStorage.getItem("userMasterId"),
//   });

//   // let sessionsDevice = {
//   //   labels: ["Total Tickets", "Pending", "Closed Ticket", "Others"],
//   //   datasets: [
//   //     {
//   //       backgroundColor: [
//   //         Colors.info,
//   //         Colors.yellow,
//   //         Colors.green,
//   //         Colors.purple,
//   //       ],
//   //       data: [35, 23, 10, 27],
//   //       hoverOffset: 4,
//   //     },
//   //   ],
//   // };

//   // Get Dashboards
//   const [dashboardList, setDashboardList] = useState([]);
//   useEffect(() => {
//     if(dashboardData){
//       setDashboardList([
//     {
//       stepName: "Mulberry Monthly Target",
//       achieveCount: dashboardData.mulberryTotalTarAchievePerMonth,
//       targetCount: dashboardData.mulberryTotalTarPerMonth,
//       redirect: "/seriui/mulberry-achievement"
//     },
//     {
//       stepName: "Physical Target Monthly Setting",
//       achieveCount: dashboardData.productTotalTarAchievePerMonth,
//       targetCount: dashboardData.productTotalTarPerMonth,
//       redirect: "/seriui/physical-achievement"
//     },
//     {
//       stepName: "Farm Wise Target Setting",
//       achieveCount: dashboardData.farmTotalTarAchievePerMonth,
//       targetCount: dashboardData.farmTotalTarPerMonth,
//       redirect: "/seriui/farm-achievement"
//     },
//     {
//       stepName: "Grainage Wise Target Setting",
//       achieveCount: dashboardData.grainageTotalTarAchievePerMonth,
//       targetCount: dashboardData.grainageTotalTarPerMonth,
//       redirect: "/seriui/grainage-achievement"
//     },
//     {
//       stepName: "Sericulture Training Institute  Wise Target Setting",
//       achieveCount: dashboardData.trainingTotalTarAchievePerMonth,
//       targetCount: dashboardData.trainingTotalTarPerMonth,
//       redirect: "/seriui/training-achievement"
//     },
//     {
//       stepName: "Scheme Wise Target Setting",
//       achieveCount: dashboardData.trainingTotalTarAchievePerMonth,
//       targetCount: dashboardData.schemeTotalPhyFinTarPerMonth,
//       redirect: ""
//     },
//   ]);
//     }
//   },[dashboardData])
//   //   const getDashboard = (e) => {
//   //     // setLoading(true);
//   //     api
//   //       .post(
//   //         baseURLDBT + `service/getUserDashboardCount`,
//   //         {},
//   //         { params: { id: localStorage.getItem("userMasterId") } }
//   //         // { params: { id: 30 } }
//   //       )
//   //       .then((response) => {
//   //         setDashboardList(response.data.content);
//   //         // setListData(response.data.content.hdTicket);
//   //         // setTotalRows(response.data.content.totalItems);
//   //         // setLoading(false);
//   //       })
//   //       .catch((err) => {
//   //         // setListData({});
//   //         // setLoading(false);
//   //       });
//   //   };

//   //   useEffect(() => {
//   //     getDashboard();
//   //   }, []);

//   const [schemeId, setSchemeId] = useState("");

//   const getUserDashboardCountBySchemeId = () => {
//     api
//       .post(
//         `${baseURLDBT}service/getUserDashboardCountBySchemeId`,
//         {},
//         { params: { schemeId } } // Pass schemeId as a query parameter
//       )
//       .then((response) => {
//         setDashboardList(response.data.content);
//       })
//       .catch((err) => {
//         console.error("Error fetching dashboard by schemeId", err);
//       });
//   };

//   // useEffect(() => {
//   //   getDashboard();
//   // }, []);

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

//   const message = (message) => {
//       Swal.fire({
//         icon: "warning",
//         title: "Warning",
//         text: message,
//       });
//     };

//   const navigate = useNavigate();
//   const handleView = (_id) => {
//     navigate(`/seriui/user-ticket-view/${_id}`);
//   };

//   //   const HelpdeskDataColumns = [
//   //     {
//   //       name: "Ticket No.",
//   //       selector: (row) => row.ticketArn,
//   //       cell: (row) => <span>{row.ticketArn}</span>,
//   //       sortable: true,
//   //       hide: "md",
//   //     },
//   //     {
//   //       name: "User Profile",
//   //       selector: (row) => row.username,
//   //       cell: (row) => <span>{row.username}</span>,
//   //       sortable: true,
//   //       hide: "md",
//   //     },
//   //     {
//   //       name: "Query",
//   //       selector: (row) => row.query,
//   //       cell: (row) => <span>{row.query}</span>,
//   //       sortable: true,
//   //       hide: "md",
//   //     },
//   //     {
//   //       name: "Query Details",
//   //       selector: (row) => row.queryDetails,
//   //       cell: (row) => <span>{row.queryDetails}</span>,
//   //       sortable: true,
//   //       hide: "md",
//   //     },
//   //     {
//   //       name: "Category",
//   //       selector: (row) => row.hdCategoryName,
//   //       cell: (row) => <span>{row.hdCategoryName}</span>,
//   //       sortable: true,
//   //       hide: "md",
//   //     },
//   //     {
//   //       name: "User Affected",
//   //       selector: (row) => row.hdUsersAffected,
//   //       cell: (row) => <span>{row.hdUsersAffected}</span>,
//   //       sortable: true,
//   //       hide: "md",
//   //     },
//   //     {
//   //       name: "Module",
//   //       selector: (row) => row.hdModuleName,
//   //       cell: (row) => <span>{row.hdModuleName}</span>,
//   //       sortable: true,
//   //       hide: "md",
//   //     },
//   //     {
//   //       name: "Feature",
//   //       selector: (row) => row.hdFeatureName,
//   //       cell: (row) => <span>{row.hdFeatureName}</span>,
//   //       sortable: true,
//   //       hide: "md",
//   //     },
//   //     {
//   //       name: "Status",
//   //       selector: (row) => row.hdStatusName,
//   //       cell: (row) => <span>{row.hdStatusName}</span>,
//   //       sortable: true,
//   //       hide: "md",
//   //     },
//   //     {
//   //       name: "Attachments",
//   //       selector: (row) => row.hdAttachFiles,
//   //       cell: (row) => <span>{row.hdAttachFiles}</span>,
//   //       sortable: true,
//   //       hide: "md",
//   //     },

//   //     {
//   //       name: "Action",
//   //       cell: (row) => (
//   //         <div text-start w-100>
//   //           {/* <Button variant="primary" size="sm" onClick={() => edit(row)}>
//   //               Update
//   //             </Button> */}
//   //           <Button
//   //             variant="primary"
//   //             size="sm"
//   //             onClick={() => handleView(row.hdTicketId, row)}
//   //           >
//   //             View
//   //           </Button>
//   //         </div>
//   //       ),
//   //       sortable: true,
//   //       hide: "md",
//   //     },
//   //   ];

//   // const goto = (id) => {
//   //   // if (name === "Pre Inspection") {
//   //   //   navigate(`/seriui/dashboard-report-list/1`);
//   //   // } else if (name === "Work Order Issue") {
//   //   //   navigate(`/seriui/application-dashboard-list/2`);
//   //   // } else if (name === "Work Order Complete") {
//   //   //   navigate(`/seriui/application-dashboard-list/3`);
//   //   // } else if (name === "Inspection") {
//   //   //   navigate(`/seriui/application-dashboard-list/4`);
//   //   // } else if (name === "Sanction Order Generation") {
//   //   //   navigate(`/seriui/application-dashboard-list/5`);
//   //   // } else if (name === "Sanction Order Verification") {
//   //   //   navigate(`/seriui/application-dashboard-list/6`);
//   //   // } else {
//   //   //   navigate(`/seriui/application-dashboard-list/7`);
//   //   // }
//   //   navigate(`/seriui/dashboard-report-list/${id}`);
//   // };

//   return (
//     <Layout title="User Dashboard">
//       <Block.Head>
//         <Block.HeadBetween>
//           <Block.HeadContent>
//             <Block.Title tag="h2">{t("User Dashboard")}</Block.Title>
//           </Block.HeadContent>
//         </Block.HeadBetween>
//       </Block.Head>

//       <Block className="mt-n4">
//         <Card
//           className="shadow-sm"
//           style={{ maxWidth: "1800px", margin: "auto" }}
//         >
//           <Card.Body className="p-3">
//             <div className="mx-auto" style={{ maxWidth: "1500px" }}>
//               <Row className="g-3 align-items-end">
//                 {/* Scheme Selection */}
//                 <Col lg="8" md="7" sm="12">
//                   <Form.Group className="form-group mt-n3">
//                       <Form.Label>
//                         {t("Financial Year")}
//                         <span className="text-danger">*</span>
//                       </Form.Label>
//                       <div className="form-control-wrap">
//                         <Form.Select
//                           name="financialYearMasterId"
//                           value={data.financialYearMasterId}
//                           onChange={handleInputs}
//                           onBlur={() => handleInputs}
//                           required
//                           isInvalid={
//                             data.financialYearMasterId === undefined ||
//                             data.financialYearMasterId === "0"
//                           }
//                         >
//                           <option value="">{t("Select Year")}</option>
//                           {financialyearListData && financialyearListData.length
//                           ?financialyearListData.map((list) => (
//                             <option
//                               key={list.financialYearMasterId}
//                               value={list.financialYearMasterId}
//                             >
//                               {list.financialYear}
//                             </option>
//                           ))
//                           : ""}
//                         </Form.Select>
//                         <Form.Control.Feedback type="invalid">
//                           {t("Financial Year is required")}
//                         </Form.Control.Feedback>
//                       </div>
//                     </Form.Group>
//                 </Col>

//                 {/* Search Button */}
//                 <Col lg="4" md="5" sm="12">
//                   <Button
//                     type="button"
//                     variant="primary"
//                     onClick={getDashboardList}
//                     className="w-100 shadow-sm"
//                   >
//                     {t("Search")}
//                   </Button>
//                 </Col>
//               </Row>
//             </div>
//           </Card.Body>
//         </Card>

//         <Row className="g-gs d-flex justify-content-center mt-2">
//           {dashboardList.map((dashboard, i) => (
//             <Col xxl="3" key={i}>
//               <Card
//                 className="h-100"
//                 style={{
//                   ...styles,
//                   backgroundColor: rainbowColors[i % rainbowColors.length],
//                 }}
//                   onClick={() => navigate(dashboard.redirect? dashboard.redirect : message("Scheme achievement is done automatically"))}
//               >
//                 <Card.Body>
//                   <div className="d-flex justify-content-center text-center">
//                     <div>
//                       <div className="card-title">
//                         <h4
//                           className="title mb-1 bold"
//                           style={{ color: "white" }}
//                         >
//                           {dashboard.stepName}
//                         </h4>
//                       </div>
//                       <div className="my-3">
//                         <div
//                           className="amount h2 fw-bold"
//                           style={{ color: "white" }}
//                         >
//                           {dashboard.achieveCount}/{dashboard.targetCount}
//                         </div>
//                       </div>
//                       {/* <Button
//                       size="sm"
//                       variant="primary"
//                       // onClick={() => goto(dashboard.stepName)}
//                     >
//                       View
//                     </Button> */}
//                     </div>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </Block>
//     </Layout>
//   );
// }

// export default TargetSettingDashboard;


import {
  Row,
  Col,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Block from "../../../components/Block/Block";
import { useState, useEffect } from "react";
import Layout from "../../../layout/default";
import api from "../../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLTarget = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function TargetSettingDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const rainbowColors = [
    "#b82424",
    "#ca8b17",
    "#acac22",
    "#287728",
    "#575797",
    "#88699f",
    "#bf45bf",
  ];

  // Search filters state
  const [data, setData] = useState({
    month: "",
    targetType: "",
    tscMasterId: "",
    districtId: "",
    financialYearMasterId: "",
  });

  const [editData, setEditData] = useState({
    month: "",
    targetType: "",
    tscMasterId: "",
    districtId: "",
    financialYearMasterId: "",
       
    });

  // dropdown data
  // const [financialyearListData, setFinancialyearListData] = useState([]);
  const [tscList, setTscList] = useState([]);
  const [districtList, setDistrictList] = useState([]);

  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardList, setDashboardList] = useState([]);

  // // handlers
  // const handleInputs = (e) => {
  //   let { name, value } = e.target;
  //   setData({ ...data, [name]: value });
  // };

  const handleInputs = (e) => {
  let { name, value } = e.target;

  // Convert empty string to null for numeric fields
  if (["districtId", "tscMasterId", "financialYearMasterId"].includes(name)) {
    setData({ ...data, [name]: value === "" ? null : Number(value) });
  } else {
    setData({ ...data, [name]: value });
  }
};


  // Get Default Financial Year
  const getFinancialDefaultDetails = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-is-default`)
      .then((response) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId:
            response.data.content.financialYearMasterId || "",
        }));
      })
      .catch(() => {
        setData((prev) => ({ ...prev, financialYearMasterId: "" }));
      });
  };

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



  //   To get TSC by District
    const [tscListData, setTscListData] = useState([]);
  
    const getTscListByDistrict = (districtId) => {
      api
        .post(baseURLMasterData + `tscMaster/get-by-districtId`, {
          districtId: districtId,
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
  
    // useEffect(() => {
    //   if (editData.districtId) {
    //     getTscListByDistrict(editData.districtId);
    //   }
    // }, [editData.districtId]);


// to get State
  const [districtListData, setDistrictListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURLMasterData + `district/get-all`)
      .then((response) => {
        if (response.data.content.district) {
          setDistrictListData(response.data.content.district);
        }
      })
      .catch((err) => {
        setDistrictListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // Get Dashboard Data
  const getDashboardList = () => {
    api
      .post(baseURLTarget + `targetsDashboard/get-dashboard`, data)
      .then((response) => {
        setDashboardData(response.data.content);
      })
      .catch(() => {
        setDashboardData([]);
      });
  };

  useEffect(() => {
    getFinancialDefaultDetails();
    getFinancialList();
    getTscListByDistrict();
    getList();
  }, []);

  useEffect(() => {
    if (data.financialYearMasterId) {
      getDashboardList();
    }
  }, [data.financialYearMasterId]);

  useEffect(() => {
    if (dashboardData) {
      setDashboardList([
        {
          stepName: "Mulberry Monthly Target",
          achieveCount: dashboardData.mulberryTotalTarAchievePerMonth,
          targetCount: dashboardData.mulberryTotalTarPerMonth,
          redirect: "/seriui/mulberry-achievement",
        },
        {
          stepName: "Physical Target Monthly Setting",
          achieveCount: dashboardData.productTotalTarAchievePerMonth,
          targetCount: dashboardData.productTotalTarPerMonth,
          redirect: "/seriui/physical-achievement",
        },
        {
          stepName: "Farm Wise Target Setting",
          achieveCount: dashboardData.farmTotalTarAchievePerMonth,
          targetCount: dashboardData.farmTotalTarPerMonth,
          redirect: "/seriui/farm-achievement",
        },
        {
          stepName: "Grainage Wise Target Setting",
          achieveCount: dashboardData.grainageTotalTarAchievePerMonth,
          targetCount: dashboardData.grainageTotalTarPerMonth,
          redirect: "/seriui/grainage-achievement",
        },
        {
          stepName: "Sericulture Training Institute Wise Target Setting",
          achieveCount: dashboardData.trainingTotalTarAchievePerMonth,
          targetCount: dashboardData.trainingTotalTarPerMonth,
          redirect: "/seriui/training-achievement",
        },
        {
          stepName: "Scheme Wise Target Setting",
          achieveCount: dashboardData.schemePhyTarPerMonth,
          targetCount: dashboardData.schemeTotalPhyFinTarPerMonth,
          redirect: "",
        },
      ]);
    }
  }, [dashboardData]);

  const message = (msg) => {
    Swal.fire({
      icon: "warning",
      title: "Warning",
      text: msg,
    });
  };

  const months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  return (
    <Layout title="User Dashboard">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("User Dashboard")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="shadow-sm" style={{ maxWidth: "3000px", margin: "auto" }}>
          <Card.Body className="p-3">
          <Row 
  className="g-2 align-items-center w-100" 
  style={{ maxWidth: "3000px", margin: "auto" }}
>
  {/* Financial Year */}
  <Col>
    <Form.Group>
      <Form.Label className="mb-1">{t("Financial Year")}</Form.Label>
      <Form.Select
        name="financialYearMasterId"
        value={data.financialYearMasterId}
        onChange={handleInputs}
        className="form-control form-control-lg bg-white"
      >
        <option value="">{t("Select Year")}</option>
        {financialyearListData?.map((list) => (
          <option key={list.financialYearMasterId} value={list.financialYearMasterId}>
            {list.financialYear}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>

  {/* Month */}
  <Col>
    <Form.Group>
      <Form.Label className="mb-1">{t("Month")}</Form.Label>
      <Form.Select
        name="month"
        value={data.month}
        onChange={handleInputs}
        className="form-control form-control-lg bg-white"
      >
        <option value="">{t("Select Month")}</option>
        {months.map((m, idx) => (
          <option key={idx} value={m}>
            {m}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>

  {/* District */}
  <Col>
    <Form.Group>
      <Form.Label className="mb-1">{t("District")}</Form.Label>
      <Form.Select
        name="districtId"
        value={data.districtId}
        onChange={handleInputs}
        className="form-control form-control-lg bg-white"
      >
        <option value="">{t("Select District")}</option>
        {districtListData?.map((list) => (
          <option key={list.districtId} value={list.districtId}>
            {list.districtName}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>

  {/* TSC */}
  <Col>
    <Form.Group>
      <Form.Label className="mb-1">{t("TSC")}</Form.Label>
      <Form.Select
        name="tscMasterId"
        value={data.tscMasterId}
        onChange={handleInputs}
        className="form-control form-control-lg bg-white"
        disabled={!data.districtId}
      >
        <option value="">{t("Select TSC")}</option>
        {tscListData?.map((list) => (
          <option key={list.tscMasterId} value={list.tscMasterId}>
            {list.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>

  {/* Target Type */}
  <Col>
    <Form.Group>
      <Form.Label className="mb-1">{t("Target Type")}</Form.Label>
      <Form.Select
        name="targetType"
        value={data.targetType}
        onChange={handleInputs}
        className="form-control form-control-lg bg-white"
      >
        <option value="">{t("Select Target Type")}</option>
        <option value="Physical">Physical</option>
        <option value="Cocoon Production">Cocoon Production</option>
        <option value="PHYSICAL TARGET">PHYSICAL TARGET</option>
        <option value="Brushing">Brushing</option>
        <option value="Narega">Narega</option>
        <option value="NON NAREGA">NON NAREGA</option>
        <option value="NAREGA">NAREGA</option>
      </Form.Select>
    </Form.Group>
  </Col>

  {/* Search Button */}
  <Col className="d-flex align-items-end">
    <Button
      type="button"
      variant="primary"
      onClick={getDashboardList}
      className="shadow-sm btn-lg w-100"
      style={{ backgroundColor: "#0056b3", borderRadius: "8px" }}
    >
      {t("Search")}
    </Button>
  </Col>
</Row>

          </Card.Body>
        </Card>

        <Row className="g-gs d-flex justify-content-center mt-2">
          {dashboardList.map((dashboard, i) => (
            <Col xxl="3" key={i}>
              <Card
                className="h-100"
                style={{
                  borderRadius: "3%",
                  cursor: "pointer",
                  backgroundColor: rainbowColors[i % rainbowColors.length],
                }}
                onClick={() =>
                  dashboard.redirect
                    ? navigate(dashboard.redirect)
                    : message("Scheme achievement is done automatically")
                }
              >
                <Card.Body>
                  <div className="d-flex justify-content-center text-center">
                    <div>
                      <div className="card-title">
                        <h4 className="title mb-1 bold" style={{ color: "white" }}>
                          {dashboard.stepName}
                        </h4>
                      </div>
                      <div className="my-3">
                        <div className="amount h2 fw-bold" style={{ color: "white" }}>
                          {dashboard.achieveCount}/{dashboard.targetCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Block>
    </Layout>
  );
}

export default TargetSettingDashboard;

