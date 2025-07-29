// import { Row, Col, Card, Button, Dropdown, Table, Badge } from 'react-bootstrap';
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { Link } from "react-router-dom";
// import { ChartDoughnut } from "../../../components/Chart/Charts";
// import { ChartLegend } from "../../../components";
import Block from "../../../components/Block/Block";
import DataTable from "react-data-table-component";
import { Colors } from "../../../utilities/index";
import { useState, useEffect } from "react";

import Layout from "../../../layout/default";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../../components";
import api from "../../../services/auth/api";
import { useTranslation } from "react-i18next";

// const baseURL2 = process.env.REACT_APP_API_BASE_URL_HELPDESK;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

// import {
//     Image,
//   } from '../../../components';

function TargetSettingDashboard() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const styles = {
    // backgroundColor: "#cdefff",
    borderRadius: "3%",
    cursor: "pointer",
  };
// Translation
const { t } = useTranslation();
  const rainbowColors = [
    "#b82424",
    "#ca8b17",
    "#acac22",
    "#287728",
    "#575797",
    "#88699f",
    "#bf45bf",
  ];

  const [data, setData] = useState({
    text: "",
    searchBy: "ticketArn",
  });

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // const handleSearchInputs = (e) => {
  //   // debugger;
  //   let { name, value } = e.target;
  //   setSchemeId({ ...schemeId, [name]: value });
  // };
  const handleSearchInputs = (e) => {
    const { value } = e.target; // Destructure the selected value
    setSchemeId(value); // Update schemeId with the selected value
  };

  // to get sc-scheme-details
  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);
  const getList = () => {
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
    getList();
  }, []);

  const [hdUserData, setHdUserData] = useState({
    userMasterId: localStorage.getItem("userMasterId"),
  });

  // let sessionsDevice = {
  //   labels: ["Total Tickets", "Pending", "Closed Ticket", "Others"],
  //   datasets: [
  //     {
  //       backgroundColor: [
  //         Colors.info,
  //         Colors.yellow,
  //         Colors.green,
  //         Colors.purple,
  //       ],
  //       data: [35, 23, 10, 27],
  //       hoverOffset: 4,
  //     },
  //   ],
  // };

  // Get Dashboards
  const [dashboardList, setDashboardList] = useState([{
    stepName: "District Wise Area Under Mulberry Monthly Target",
  },
{
    stepName: "TSC Wise Area Under Mulberry Monthly Target",
},
{
    stepName: "Range Wise Area Under Mulberry Monthly Target",
},
{
    stepName: "Range Wise Area Under Mulberry Daily Target",
},
{
    stepName: "District Wise Physical Target Setting",
},
{
    stepName: "TSC Wise Physical Target Setting",
},
{
    stepName: "Range Wise Physical Target Setting",
},
{
    stepName: "Farm Wise Target Setting",
},
{
    stepName: "Grainage Wise Target Setting",
},
{
    stepName: "Sericulture Training Institute  Wise Target Setting",
},
{
    stepName: "District Wise Scheme Target Setting",
},
{
    stepName: "TSC Wise Scheme Target Setting",
},
{
    stepName: "Reeling TSC Wise Scheme Target Setting",
}
]);
//   const getDashboard = (e) => {
//     // setLoading(true);
//     api
//       .post(
//         baseURLDBT + `service/getUserDashboardCount`,
//         {},
//         { params: { id: localStorage.getItem("userMasterId") } }
//         // { params: { id: 30 } }
//       )
//       .then((response) => {
//         setDashboardList(response.data.content);
//         // setListData(response.data.content.hdTicket);
//         // setTotalRows(response.data.content.totalItems);
//         // setLoading(false);
//       })
//       .catch((err) => {
//         // setListData({});
//         // setLoading(false);
//       });
//   };

//   useEffect(() => {
//     getDashboard();
//   }, []);

  const [schemeId, setSchemeId] = useState("");

  const getUserDashboardCountBySchemeId = () => {
    api
      .post(
        `${baseURLDBT}service/getUserDashboardCountBySchemeId`,
        {},
        { params: { schemeId } } // Pass schemeId as a query parameter
      )
      .then((response) => {
        setDashboardList(response.data.content);
      })
      .catch((err) => {
        console.error("Error fetching dashboard by schemeId", err);
      });
  };

  // useEffect(() => {
  //   getDashboard();
  // }, []);


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
    navigate(`/seriui/user-ticket-view/${_id}`);
  };

  //   const HelpdeskDataColumns = [
  //     {
  //       name: "Ticket No.",
  //       selector: (row) => row.ticketArn,
  //       cell: (row) => <span>{row.ticketArn}</span>,
  //       sortable: true,
  //       hide: "md",
  //     },
  //     {
  //       name: "User Profile",
  //       selector: (row) => row.username,
  //       cell: (row) => <span>{row.username}</span>,
  //       sortable: true,
  //       hide: "md",
  //     },
  //     {
  //       name: "Query",
  //       selector: (row) => row.query,
  //       cell: (row) => <span>{row.query}</span>,
  //       sortable: true,
  //       hide: "md",
  //     },
  //     {
  //       name: "Query Details",
  //       selector: (row) => row.queryDetails,
  //       cell: (row) => <span>{row.queryDetails}</span>,
  //       sortable: true,
  //       hide: "md",
  //     },
  //     {
  //       name: "Category",
  //       selector: (row) => row.hdCategoryName,
  //       cell: (row) => <span>{row.hdCategoryName}</span>,
  //       sortable: true,
  //       hide: "md",
  //     },
  //     {
  //       name: "User Affected",
  //       selector: (row) => row.hdUsersAffected,
  //       cell: (row) => <span>{row.hdUsersAffected}</span>,
  //       sortable: true,
  //       hide: "md",
  //     },
  //     {
  //       name: "Module",
  //       selector: (row) => row.hdModuleName,
  //       cell: (row) => <span>{row.hdModuleName}</span>,
  //       sortable: true,
  //       hide: "md",
  //     },
  //     {
  //       name: "Feature",
  //       selector: (row) => row.hdFeatureName,
  //       cell: (row) => <span>{row.hdFeatureName}</span>,
  //       sortable: true,
  //       hide: "md",
  //     },
  //     {
  //       name: "Status",
  //       selector: (row) => row.hdStatusName,
  //       cell: (row) => <span>{row.hdStatusName}</span>,
  //       sortable: true,
  //       hide: "md",
  //     },
  //     {
  //       name: "Attachments",
  //       selector: (row) => row.hdAttachFiles,
  //       cell: (row) => <span>{row.hdAttachFiles}</span>,
  //       sortable: true,
  //       hide: "md",
  //     },

  //     {
  //       name: "Action",
  //       cell: (row) => (
  //         <div text-start w-100>
  //           {/* <Button variant="primary" size="sm" onClick={() => edit(row)}>
  //               Update
  //             </Button> */}
  //           <Button
  //             variant="primary"
  //             size="sm"
  //             onClick={() => handleView(row.hdTicketId, row)}
  //           >
  //             View
  //           </Button>
  //         </div>
  //       ),
  //       sortable: true,
  //       hide: "md",
  //     },
  //   ];

  const goto = (id) => {
    // if (name === "Pre Inspection") {
    //   navigate(`/seriui/dashboard-report-list/1`);
    // } else if (name === "Work Order Issue") {
    //   navigate(`/seriui/application-dashboard-list/2`);
    // } else if (name === "Work Order Complete") {
    //   navigate(`/seriui/application-dashboard-list/3`);
    // } else if (name === "Inspection") {
    //   navigate(`/seriui/application-dashboard-list/4`);
    // } else if (name === "Sanction Order Generation") {
    //   navigate(`/seriui/application-dashboard-list/5`);
    // } else if (name === "Sanction Order Verification") {
    //   navigate(`/seriui/application-dashboard-list/6`);
    // } else {
    //   navigate(`/seriui/application-dashboard-list/7`);
    // }
    navigate(`/seriui/dashboard-report-list/${id}`)
  };

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
      
  <Card className="shadow-sm" style={{ maxWidth: "1800px", margin: "auto" }}>
  <Card.Body className="p-3">
    <div className="mx-auto" style={{ maxWidth: "1500px" }}>
      <Row className="g-3 align-items-end">
        {/* Scheme Selection */}
        <Col lg="8" md="7" sm="12">
          <Form.Group className="form-group">
            <Form.Label htmlFor="scheme" className="fw-bold">
              {t("Scheme")}
            </Form.Label>
            <div className="form-control-wrap">
              <Form.Select
                name="schemeId"
                value={schemeId}
                onChange={(e) => setSchemeId(e.target.value)}
                className="form-control shadow-sm"
              >
                <option value="">{t("Select Scheme Names")}</option>
                {scSchemeDetailsListData &&
                  scSchemeDetailsListData.map((list) => (
                    <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>
                      {list.schemeName}
                    </option>
                  ))}
              </Form.Select>
            </div>
          </Form.Group>
        </Col>

        {/* Search Button */}
        <Col lg="4" md="5" sm="12">
          <Button
            type="button"
            variant="primary"
            onClick={getUserDashboardCountBySchemeId}
            className="w-100 shadow-sm"
          >
            {t("Search")}
          </Button>
        </Col>
      </Row>
    </div>
  </Card.Body>
</Card>



      <Row className="g-gs d-flex justify-content-center mt-2">
        {dashboardList.map((dashboard, i) => (
          <Col xxl="3" 
          key={i}
          >
           
            <Card
              className="h-100"
              style={{
                ...styles,
                backgroundColor: rainbowColors[i % rainbowColors.length],
              }}
            //   onClick={() => goto(dashboard.approvalStageId)}
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
                      <div
                        className="amount h2 fw-bold"
                        style={{ color: "white" }}
                      >
                        {/* {dashboard.count} */}
                        10/10
                      </div>
                    </div>
                    {/* <Button
                      size="sm"
                      variant="primary"
                      // onClick={() => goto(dashboard.stepName)}
                    >
                      View
                    </Button> */}
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
