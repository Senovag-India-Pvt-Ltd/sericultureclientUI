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

// const baseURL2 = process.env.REACT_APP_API_BASE_URL_HELPDESK;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

// import {
//     Image,
//   } from '../../../components';

function ApplicationDashboard() {
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
  const [dashboardList, setDashboardList] = useState([]);
  const getDashboard = (e) => {
    // setLoading(true);
    api
      .post(
        baseURLDBT + `service/getUserDashboardCount`,
        {},
        { params: { id: localStorage.getItem("userMasterId") } }
        // { params: { id: 30 } }
      )
      .then((response) => {
        setDashboardList(response.data.content);
        // setListData(response.data.content.hdTicket);
        // setTotalRows(response.data.content.totalItems);
        // setLoading(false);
      })
      .catch((err) => {
        // setListData({});
        // setLoading(false);
      });
  };

  useEffect(() => {
    getDashboard();
  }, []);

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

  const goto = (name) => {
    if (name === "Pre Inspection") {
      navigate(`/seriui/application-dashboard-list/1`);
    } else if (name === "Work Order Issue") {
      navigate(`/seriui/application-dashboard-list/2`);
    } else if (name === "Work Order Complete") {
      navigate(`/seriui/application-dashboard-list/3`);
    } else if (name === "Inspection") {
      navigate(`/seriui/application-dashboard-list/4`);
    } else if (name === "Sanction Order Generation") {
      navigate(`/seriui/application-dashboard-list/5`);
    } else if (name === "Sanction Order Verification") {
      navigate(`/seriui/application-dashboard-list/6`);
    } else {
      navigate(`/seriui/application-dashboard-list/7`);
    }
  };

  return (
    <Layout title="Help desk Dashboard">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">User Dashboard</Block.Title>
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/help-desk"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create New Ticket</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/help-desk"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Create New Ticket</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Row className="g-gs d-flex justify-content-center">
        {dashboardList.map((dashboard, i) => (
          <Col xxl="3" key={i}>
            {/* <Card
              className="h-100"
              style={{ ...styles, backgroundColor: rainbowColors[i] }}
              onClick={() => goto(dashboard.stepName)}
            > */}
            <Card
              className="h-100"
              style={{
                ...styles,
                backgroundColor: rainbowColors[i % rainbowColors.length],
              }}
              onClick={() => goto(dashboard.stepName)}
            >
              <Card.Body>
                <div className="d-flex justify-content-center text-center">
                  <div>
                    <div className="card-title">
                      <h4 className="title mb-1" style={{ color: "white" }}>
                        {dashboard.stepName}
                      </h4>
                    </div>
                    <div className="my-3">
                      <div
                        className="amount h2 fw-bold"
                        style={{ color: "white" }}
                      >
                        {dashboard.count}
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

        {/* {dashboardList.map((dashboard, index) => (
          <Col key={index} xxl="3">
            <Card className="h-100 dashboard-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="card-title">
                      <h4 className="title mb-1">{dashboard.stepName}</h4>
                    </div>
                    <div className="my-3">
                      <div className="amount h2 fw-bold text-primary">
                        {dashboard.count}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => goto(dashboard.stepName)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))} */}

        {/* <Col xxl="3">
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="card-title">
                      <h4 className="title mb-1">Unsigned Tickets</h4>
                    </div>
                    <div className="my-3">
                      <div className="amount h2 fw-bold text-primary ">111</div>
                    </div>
                    <Button href="#" size="sm" variant="primary">
                      View
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col> */}
      </Row>
      {/* <Row className="g-gs mt-2">
        <Col xxl="12">
          <Block className="mt-n3">
            <Card>
              <Row className="m-2">
                <Col>
                  <Form.Group as={Row} className="form-group" id="hdTicketId">
                    <Form.Label column sm={1}>
                      Search By
                    </Form.Label>
                    <Col sm={3}>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="searchBy"
                          value={data.searchBy}
                          onChange={handleInputs}
                        >
                          <option value="ticketArn">Ticket Number</option>
                        </Form.Select>
                      </div>
                    </Col>

                    <Col sm={3}>
                      <Form.Control
                        id="hdTicketId"
                        name="text"
                        value={data.text}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Search"
                      />
                    </Col>
                    <Col sm={3}>
                      <Button type="button" variant="primary" onClick={search}>
                        Search
                      </Button>
                    </Col>
                    <Col sm={2}>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={getTicketDataList}
                      >
                        <Icon name="reload-alt"></Icon>
                      </Button>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <DataTable
                tableClassName="data-table-head-light table-responsive"
                columns={HelpdeskDataColumns}
                data={hdTicketDataList}
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
            </Card>
          </Block>
        </Col>
      </Row> */}
    </Layout>
  );
}

export default ApplicationDashboard;
